/**
 * routes/checkout.js  (비회원 / 회원 통합 결제)
 * ─────────────────────────────────────────────────────────────────
 * POST /api/checkout/preview  — 결제 미리보기 (금액 계산)
 * POST /api/checkout          — 주문 생성 (결제 확정)
 * GET  /api/checkout/order/:orderNumber — 주문 조회 (비회원: email 필요)
 *
 * [회원 전용]
 * GET  /api/checkout/orders   — 나의 주문 목록
 * POST /api/checkout/orders/:id/cancel — 주문 취소
 *
 * [결제 흐름]
 * 1. POST /api/checkout/preview  → 금액·할인·포인트 계산
 * 2. (실제 PG 연동 or 테스트 결제)
 * 3. POST /api/checkout          → 주문 레코드 생성, 재고 차감, 포인트 적립
 * 4. GET  /api/checkout/order/:number → 주문 완료 확인
 *
 * [멤버십 할인율]
 * BASIC: 0%  SILVER: 5%  GOLD: 10%  VARO VIP: 15%
 *
 * [포인트 적립율]
 * BASIC: 1%  SILVER: 3%  GOLD: 5%   VARO VIP: 7%
 */

'use strict';

const express        = require('express');
const router         = express.Router();
const optionalAuth   = require('../middleware/optionalAuth');
const authMiddleware = require('../middleware/auth');
const db             = require('../db');
const { nanoid }     = require('nanoid'); // npm i nanoid@3  (CJS 호환)

// ── 상수 ─────────────────────────────────────────────────────────
const SHIPPING_FEE             = 3_000;
const FREE_SHIPPING_THRESHOLD  = 50_000;
const MAX_POINTS_USE_RATIO     = 0.5;   // 포인트로 최대 50% 결제 가능

const MEMBERSHIP_CONFIG = {
  BASIC    : { discount: 0,    pointRate: 0.01 },
  SILVER   : { discount: 0.05, pointRate: 0.03 },
  GOLD     : { discount: 0.10, pointRate: 0.05 },
  'VARO VIP': { discount: 0.15, pointRate: 0.07 },
};

const getMembershipConfig = (tier) => MEMBERSHIP_CONFIG[tier] ?? MEMBERSHIP_CONFIG.BASIC;

/**
 * 주문번호 생성: VARO-YYYYMMDD-XXXXXX
 */
const generateOrderNumber = () => {
  const date  = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const token = nanoid(6).toUpperCase();
  return `VARO-${date}-${token}`;
};

/**
 * 결제 금액 계산 순수 함수
 */
const calcPaymentAmounts = ({ items, membership, pointsToUse = 0 }) => {
  const totalAmount   = items.reduce((s, i) => s + i.unit_price * i.quantity, 0);
  const config        = getMembershipConfig(membership);
  const discountRate  = config.discount;
  const discountAmt   = Math.floor(totalAmount * discountRate);
  const afterDiscount = totalAmount - discountAmt;
  const shippingFee   = afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  const maxPoints     = Math.floor(afterDiscount * MAX_POINTS_USE_RATIO);
  const actualPoints  = Math.min(pointsToUse, maxPoints);
  const finalAmount   = afterDiscount + shippingFee - actualPoints;
  const pointsEarned  = Math.floor(finalAmount * config.pointRate);

  return {
    totalAmount,
    discountRate,
    discountAmount: discountAmt,
    afterDiscount,
    shippingFee,
    pointsUsed: actualPoints,
    finalAmount: Math.max(finalAmount, 0),
    pointsEarned,
  };
};

// ── POST /api/checkout/preview ───────────────────────────────────
router.post('/preview', optionalAuth, (req, res) => {
  const { items, points_to_use = 0 } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: '주문 상품이 없습니다' });
  }

  try {
    // 상품 정보 일괄 조회 및 가격 서버에서 재확인 (클라이언트 가격 조작 방지)
    const productIds = items.map(i => Number(i.product_id));
    const placeholders = productIds.map(() => '?').join(',');
    const products = db.prepare(
      `SELECT id, name, price, stock, image FROM products WHERE id IN (${placeholders})`
    ).all(...productIds);

    const productMap = Object.fromEntries(products.map(p => [p.id, p]));

    const validatedItems = [];
    for (const item of items) {
      const product = productMap[item.product_id];
      if (!product) return res.status(404).json({ success: false, message: `상품 ID ${item.product_id}을 찾을 수 없습니다` });
      if (product.stock < item.quantity) {
        return res.status(409).json({ success: false, message: `'${product.name}' 재고 부족 (현재: ${product.stock})` });
      }
      validatedItems.push({ ...item, unit_price: product.price });
    }

    const membership = req.user?.membership ?? 'BASIC';
    const userPoints = req.user ? (db.prepare('SELECT points FROM users WHERE id = ?').get(req.user.id)?.points ?? 0) : 0;

    const amounts = calcPaymentAmounts({
      items: validatedItems,
      membership,
      pointsToUse: Math.min(points_to_use, userPoints),
    });

    return res.json({
      success: true,
      data: {
        items: validatedItems.map(i => ({
          ...i,
          subtotal: i.unit_price * i.quantity,
          product_name: productMap[i.product_id].name,
          product_image: productMap[i.product_id].image,
        })),
        ...amounts,
        membership,
        available_points: userPoints,
      },
    });
  } catch (err) {
    console.error('[Checkout PREVIEW]', err);
    return res.status(500).json({ success: false, message: '금액 계산 실패' });
  }
});

// ── POST /api/checkout ───────────────────────────────────────────
router.post('/', optionalAuth, (req, res) => {
  const {
    items,
    shipping,      // { name, phone, zipcode, address, detail, request }
    payment,       // { method: 'card'|'kakao'|'naver'|'vbank', pg_token? }
    points_to_use = 0,
    // 비회원 전용
    guest_email,
    guest_name,
    guest_phone,
  } = req.body;

  // ── 입력 유효성 검사 ─────────────────────────────────────────
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: '주문 상품이 없습니다' });
  }
  if (!shipping?.address || !shipping?.zipcode) {
    return res.status(400).json({ success: false, message: '배송지 정보가 필요합니다' });
  }
  if (!payment?.method) {
    return res.status(400).json({ success: false, message: '결제 수단을 선택해주세요' });
  }
  if (!req.user) {
    if (!guest_email || !guest_name || !guest_phone) {
      return res.status(400).json({ success: false, message: '비회원 주문은 이름·이메일·전화번호가 필요합니다' });
    }
    // 이메일 형식 검증
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest_email)) {
      return res.status(400).json({ success: false, message: '이메일 형식이 올바르지 않습니다' });
    }
  }

  try {
    const placeOrder = db.transaction(() => {
      // ① 상품 재확인 (트랜잭션 내에서 재고 lock)
      const productIds  = items.map(i => Number(i.product_id));
      const placeholders = productIds.map(() => '?').join(',');
      const products    = db.prepare(
        `SELECT id, name, price, stock, image FROM products WHERE id IN (${placeholders})`
      ).all(...productIds);
      const productMap  = Object.fromEntries(products.map(p => [p.id, p]));

      const validatedItems = [];
      for (const item of items) {
        const product = productMap[item.product_id];
        if (!product) throw Object.assign(new Error(`상품 ID ${item.product_id}을 찾을 수 없습니다`), { status: 404 });
        if (product.stock < item.quantity) {
          throw Object.assign(new Error(`'${product.name}' 재고 부족`), { status: 409 });
        }
        validatedItems.push({
          product_id: product.id,
          product_name: product.name,
          product_image: product.image,
          unit_price: product.price,
          quantity: item.quantity,
          size: item.size ?? null,
          color: item.color ?? null,
        });
      }

      // ② 금액 계산
      const membership = req.user?.membership ?? 'BASIC';
      const userPoints = req.user
        ? (db.prepare('SELECT points FROM users WHERE id = ?').get(req.user.id)?.points ?? 0)
        : 0;

      const amounts = calcPaymentAmounts({
        items: validatedItems,
        membership,
        pointsToUse: Math.min(points_to_use, userPoints),
      });

      const orderNumber = generateOrderNumber();

      if (req.user) {
        // ── 회원 주문 ────────────────────────────────────────────
        const orderId = db.prepare(`
          INSERT INTO orders (
            user_id, order_number, total_amount, discount_amount,
            shipping_fee, final_amount, payment_method, payment_status,
            shipping_name, shipping_phone, shipping_zipcode,
            shipping_address, shipping_detail, delivery_request,
            points_used, points_earned, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')
        `).run(
          req.user.id, orderNumber,
          amounts.totalAmount, amounts.discountAmount,
          amounts.shippingFee, amounts.finalAmount,
          payment.method, 'paid',
          shipping.name, shipping.phone, shipping.zipcode,
          shipping.address, shipping.detail ?? null, shipping.request ?? null,
          amounts.pointsUsed, amounts.pointsEarned,
        ).lastInsertRowid;

        // 주문 아이템 삽입
        const insertItem = db.prepare(`
          INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, size, color, unit_price, subtotal)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const item of validatedItems) {
          insertItem.run(
            orderId, item.product_id, item.product_name, item.product_image,
            item.quantity, item.size, item.color,
            item.unit_price, item.unit_price * item.quantity,
          );
        }

        // 재고 차감
        const deductStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?');
        for (const item of validatedItems) {
          const result = deductStock.run(item.quantity, item.product_id, item.quantity);
          if (result.changes === 0) throw Object.assign(new Error(`'${item.product_name}' 재고 부족`), { status: 409 });
        }

        // 포인트 차감 + 적립 + 누적 구매금액 업데이트
        db.prepare(`
          UPDATE users
          SET points = points - ? + ?,
              total_purchase = total_purchase + ?,
              membership = CASE
                WHEN total_purchase + ? >= 1000000 THEN 'VARO VIP'
                WHEN total_purchase + ? >= 300000  THEN 'GOLD'
                WHEN total_purchase + ? >= 100000  THEN 'SILVER'
                ELSE membership
              END
          WHERE id = ?
        `).run(
          amounts.pointsUsed, amounts.pointsEarned,
          amounts.finalAmount, amounts.finalAmount, amounts.finalAmount, amounts.finalAmount,
          req.user.id,
        );

        // 장바구니 비우기 (ordered된 상품만)
        const orderedProductIds = validatedItems.map(i => i.product_id);
        const ph = orderedProductIds.map(() => '?').join(',');
        db.prepare(`DELETE FROM cart WHERE user_id = ? AND product_id IN (${ph})`).run(req.user.id, ...orderedProductIds);

      } else {
        // ── 비회원 주문 ──────────────────────────────────────────
        const orderId = db.prepare(`
          INSERT INTO guest_orders (
            order_number, guest_id, guest_email, guest_name, guest_phone,
            shipping_name, shipping_phone, shipping_zipcode,
            shipping_address, shipping_detail, delivery_request,
            total_amount, discount_amount, shipping_fee, final_amount,
            payment_method, payment_status, order_status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'paid', 'confirmed')
        `).run(
          orderNumber, req.guestId, guest_email, guest_name, guest_phone,
          shipping.name, shipping.phone, shipping.zipcode,
          shipping.address, shipping.detail ?? null, shipping.request ?? null,
          amounts.totalAmount, amounts.discountAmount, amounts.shippingFee, amounts.finalAmount,
          payment.method,
        ).lastInsertRowid;

        const insertItem = db.prepare(`
          INSERT INTO guest_order_items (order_id, product_id, product_name, product_image, quantity, size, color, unit_price, subtotal)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const item of validatedItems) {
          insertItem.run(
            orderId, item.product_id, item.product_name, item.product_image,
            item.quantity, item.size, item.color,
            item.unit_price, item.unit_price * item.quantity,
          );
        }

        // 재고 차감
        const deductStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?');
        for (const item of validatedItems) {
          const result = deductStock.run(item.quantity, item.product_id, item.quantity);
          if (result.changes === 0) throw Object.assign(new Error(`'${item.product_name}' 재고 부족`), { status: 409 });
        }

        // 비회원 장바구니 비우기
        db.prepare('DELETE FROM guest_carts WHERE guest_id = ?').run(req.guestId);
      }

      return { orderNumber, amounts };
    });

    const { orderNumber, amounts } = placeOrder();
    return res.status(201).json({
      success: true,
      data: { orderNumber, ...amounts },
      message: '주문이 완료되었습니다',
    });
  } catch (err) {
    console.error('[Checkout POST]', err);
    const status = err.status || 500;
    return res.status(status).json({ success: false, message: err.message || '주문 처리 실패' });
  }
});

// ── GET /api/checkout/order/:orderNumber ─────────────────────────
// 비회원: ?email= 파라미터로 본인 확인, 회원: JWT 본인 확인
router.get('/order/:orderNumber', optionalAuth, (req, res) => {
  const { orderNumber } = req.params;
  const { email } = req.query;

  try {
    if (req.user) {
      const order = db.prepare(`
        SELECT o.*, GROUP_CONCAT(
          json_object(
            'product_id', oi.product_id,
            'product_name', oi.product_name,
            'product_image', oi.product_image,
            'quantity', oi.quantity,
            'size', oi.size,
            'color', oi.color,
            'unit_price', oi.unit_price,
            'subtotal', oi.subtotal
          )
        ) AS items_json
        FROM orders o
        LEFT JOIN order_items oi ON oi.order_id = o.id
        WHERE o.order_number = ? AND o.user_id = ?
        GROUP BY o.id
      `).get(orderNumber, req.user.id);

      if (!order) return res.status(404).json({ success: false, message: '주문을 찾을 수 없습니다' });
      order.items = JSON.parse(`[${order.items_json}]`);
      delete order.items_json;
      return res.json({ success: true, data: order });
    } else {
      // 비회원: 이메일 확인 필요
      if (!email) return res.status(400).json({ success: false, message: '이메일 주소가 필요합니다' });

      const order = db.prepare(`
        SELECT o.*, GROUP_CONCAT(
          json_object(
            'product_id', oi.product_id,
            'product_name', oi.product_name,
            'product_image', oi.product_image,
            'quantity', oi.quantity,
            'size', oi.size,
            'color', oi.color,
            'unit_price', oi.unit_price,
            'subtotal', oi.subtotal
          )
        ) AS items_json
        FROM guest_orders o
        LEFT JOIN guest_order_items oi ON oi.order_id = o.id
        WHERE o.order_number = ? AND o.guest_email = ?
        GROUP BY o.id
      `).get(orderNumber, email.toLowerCase());

      if (!order) return res.status(404).json({ success: false, message: '주문을 찾을 수 없거나 이메일이 일치하지 않습니다' });
      order.items = JSON.parse(`[${order.items_json}]`);
      delete order.items_json;
      return res.json({ success: true, data: order });
    }
  } catch (err) {
    console.error('[Order GET]', err);
    return res.status(500).json({ success: false, message: '주문 조회 실패' });
  }
});

// ── GET /api/checkout/orders  (회원 전용: 나의 주문 목록) ─────────
router.get('/orders', authMiddleware, (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  try {
    const total = db.prepare('SELECT COUNT(*) AS cnt FROM orders WHERE user_id = ?').get(req.user.id).cnt;
    const orders = db.prepare(`
      SELECT id, order_number, total_amount, discount_amount, shipping_fee,
             final_amount, payment_method, payment_status, status AS order_status,
             created_at
      FROM orders
      WHERE user_id = ?
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `).all(req.user.id, Number(limit), offset);

    return res.json({ success: true, data: { orders, total, page: Number(page), limit: Number(limit) } });
  } catch (err) {
    console.error('[Orders GET]', err);
    return res.status(500).json({ success: false, message: '주문 목록 조회 실패' });
  }
});

// ── POST /api/checkout/orders/:id/cancel ─────────────────────────
router.post('/orders/:id/cancel', authMiddleware, (req, res) => {
  const orderId = Number(req.params.id);

  try {
    const order = db.prepare(
      `SELECT id, status, user_id, points_used, points_earned, final_amount
       FROM orders WHERE id = ? AND user_id = ?`
    ).get(orderId, req.user.id);

    if (!order) return res.status(404).json({ success: false, message: '주문을 찾을 수 없습니다' });
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(409).json({ success: false, message: '배송 준비 이후에는 취소할 수 없습니다' });
    }

    const cancelTransaction = db.transaction(() => {
      // 주문 상태 → cancelled
      db.prepare(`UPDATE orders SET status = 'cancelled', payment_status = 'refunded', updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(orderId);

      // 재고 복구
      const items = db.prepare('SELECT product_id, quantity FROM order_items WHERE order_id = ?').all(orderId);
      for (const item of items) {
        db.prepare('UPDATE products SET stock = stock + ? WHERE id = ?').run(item.quantity, item.product_id);
      }

      // 포인트 복구 (사용 포인트 환급, 적립 포인트 차감)
      db.prepare(`
        UPDATE users SET points = points + ? - ?, total_purchase = MAX(0, total_purchase - ?)
        WHERE id = ?
      `).run(order.points_used, order.points_earned, order.final_amount, req.user.id);
    });

    cancelTransaction();
    return res.json({ success: true, message: '주문이 취소되었습니다' });
  } catch (err) {
    console.error('[Order CANCEL]', err);
    return res.status(500).json({ success: false, message: '주문 취소 실패' });
  }
});

module.exports = router;
