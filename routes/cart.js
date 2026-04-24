/**
 * routes/cart.js  (비회원 / 회원 통합 버전)
 * ─────────────────────────────────────────────────────────────────
 * GET    /api/cart              — 장바구니 조회   (비회원 O, 회원 O)
 * POST   /api/cart              — 상품 추가/수량증가
 * PATCH  /api/cart/:id          — 수량 변경
 * DELETE /api/cart/:id          — 단일 항목 삭제
 * DELETE /api/cart              — 전체 비우기
 * POST   /api/cart/merge        — 로그인 시 비회원 → 회원 병합 (인증 필수)
 *
 * [인증 흐름]
 *   비회원: X-Guest-Id 헤더로 guest_carts 테이블 접근
 *   회원:   Authorization: Bearer <JWT> → cart 테이블 접근 (기존 유지)
 */

'use strict';

const express = require('express');
const router = express.Router();
const optionalAuth = require('../middleware/optionalAuth');
const authMiddleware = require('../middleware/auth'); // 기존 필수 인증 미들웨어
const db = require('../db/database');

const FREE_SHIPPING_THRESHOLD = 50_000; // 5만원 이상 무료배송
const SHIPPING_FEE = 3_000;

// ── 공통 유틸 ────────────────────────────────────────────────────

/**
 * 장바구니 아이템 + 상품 정보 JOIN 조회
 * @param {string} table  - 'cart' | 'guest_carts'
 * @param {string} column - 'user_id' | 'guest_id'
 * @param {number|string} id
 */
const fetchCartItems = async (table, column, id) => {
  return await db.query(`
    SELECT
      c.id,
      c.product_id,
      c.quantity,
      c.size,
      c.color,
      p.name        AS product_name,
      p.price       AS unit_price,
      p.main_img    AS product_image,
      p.stock,
      (c.quantity * p.price) AS subtotal
    FROM ${table} c
    JOIN products p ON p.id = c.product_id
    WHERE c.${column} = ?
      ${table === 'guest_carts' ? "AND c.expires_at > CURRENT_TIMESTAMP" : ''}
    ORDER BY c.id ASC
  `, [id]);
};

const calcSummary = (items) => {
  const totalAmount = items.reduce((s, i) => s + i.subtotal, 0);
  const shippingFee = totalAmount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  return { totalAmount, shippingFee, finalAmount: totalAmount + shippingFee, itemCount: items.length };
};

// ── GET /api/cart ────────────────────────────────────────────────
router.get('/', optionalAuth, async (req, res) => {
  try {
    let items;
    if (req.user) {
      items = await fetchCartItems('cart', 'user_id', req.user.id);
    } else {
      items = await fetchCartItems('guest_carts', 'guest_id', req.guestId);
    }

    return res.json({ success: true, data: { items, summary: calcSummary(items) } });
  } catch (err) {
    console.error('[Cart GET]', err);
    return res.status(500).json({ success: false, message: '장바구니 조회 실패' });
  }
});

// ── POST /api/cart ───────────────────────────────────────────────
router.post('/', optionalAuth, async (req, res) => {
  const { product_id, quantity = 1, size, color } = req.body;

  if (!product_id || !Number.isInteger(Number(product_id))) {
    return res.status(400).json({ success: false, message: '유효하지 않은 상품 ID' });
  }
  if (quantity < 1 || quantity > 99) {
    return res.status(400).json({ success: false, message: '수량은 1~99 사이여야 합니다' });
  }

  try {
    const products = await db.execute('SELECT id, stock FROM products WHERE id = ?', [product_id]);
    if (!products.length) return res.status(404).json({ success: false, message: '상품을 찾을 수 없습니다' });
    const product = products[0];

    if (product.stock < quantity) {
      return res.status(409).json({ success: false, message: '재고가 부족합니다' });
    }

    if (req.user) {
      const existingRows = await db.execute(
        'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ? AND size <=> ? AND color <=> ?',
        [req.user.id, product_id, size ?? null, color ?? null]
      );

      if (existingRows.length > 0) {
        const existing = existingRows[0];
        const newQty = Math.min(existing.quantity + quantity, 99);
        await db.execute('UPDATE cart SET quantity = ? WHERE id = ?', [newQty, existing.id]);
      } else {
        await db.execute(
          'INSERT INTO cart (user_id, product_id, quantity, size, color) VALUES (?, ?, ?, ?, ?)',
          [req.user.id, product_id, quantity, size ?? null, color ?? null]
        );
      }
    } else {
      const existingRows = await db.execute(
        `SELECT id, quantity FROM guest_carts
         WHERE guest_id = ? AND product_id = ? AND size <=> ? AND color <=> ?
           AND expires_at > CURRENT_TIMESTAMP`,
        [req.guestId, product_id, size ?? null, color ?? null]
      );

      if (existingRows.length > 0) {
        const existing = existingRows[0];
        const newQty = Math.min(existing.quantity + quantity, 99);
        await db.execute(
          `UPDATE guest_carts SET quantity = ?, expires_at = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY) WHERE id = ?`,
          [newQty, existing.id]
        );
      } else {
        await db.execute(
          `INSERT INTO guest_carts (guest_id, product_id, quantity, size, color, expires_at)
           VALUES (?, ?, ?, ?, ?, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY))`,
          [req.guestId, product_id, quantity, size ?? null, color ?? null]
        );
      }
    }

    return res.status(201).json({ success: true, message: '장바구니에 추가되었습니다' });
  } catch (err) {
    console.error('[Cart POST]', err);
    return res.status(500).json({ success: false, message: '장바구니 추가 실패' });
  }
});

// ── PATCH /api/cart/:id ──────────────────────────────────────────
router.patch('/:id', optionalAuth, async (req, res) => {
  const cartId = Number(req.params.id);
  const { quantity } = req.body;

  if (!Number.isInteger(cartId) || cartId < 1) {
    return res.status(400).json({ success: false, message: '유효하지 않은 장바구니 ID' });
  }
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    return res.status(400).json({ success: false, message: '수량은 1~99 사이여야 합니다' });
  }

  try {
    let result;
    if (req.user) {
      result = await db.execute(
        'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?',
        [quantity, cartId, req.user.id]
      );
    } else {
      result = await db.execute(
        `UPDATE guest_carts SET quantity = ? WHERE id = ? AND guest_id = ? AND expires_at > CURRENT_TIMESTAMP`,
        [quantity, cartId, req.guestId]
      );
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: '항목을 찾을 수 없습니다' });
    }
    return res.json({ success: true, message: '수량이 변경되었습니다' });
  } catch (err) {
    console.error('[Cart PATCH]', err);
    return res.status(500).json({ success: false, message: '수량 변경 실패' });
  }
});

// ── DELETE /api/cart/:id ─────────────────────────────────────────
router.delete('/:id', optionalAuth, async (req, res) => {
  const cartId = Number(req.params.id);

  if (!Number.isInteger(cartId) || cartId < 1) {
    return res.status(400).json({ success: false, message: '유효하지 않은 장바구니 ID' });
  }

  try {
    let result;
    if (req.user) {
      result = await db.execute('DELETE FROM cart WHERE id = ? AND user_id = ?', [cartId, req.user.id]);
    } else {
      result = await db.execute('DELETE FROM guest_carts WHERE id = ? AND guest_id = ?', [cartId, req.guestId]);
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: '항목을 찾을 수 없습니다' });
    }
    return res.json({ success: true, message: '삭제되었습니다' });
  } catch (err) {
    console.error('[Cart DELETE/:id]', err);
    return res.status(500).json({ success: false, message: '삭제 실패' });
  }
});

// ── DELETE /api/cart (전체 비우기) ───────────────────────────────
router.delete('/', optionalAuth, async (req, res) => {
  try {
    if (req.user) {
      await db.execute('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
    } else {
      await db.execute('DELETE FROM guest_carts WHERE guest_id = ?', [req.guestId]);
    }
    return res.json({ success: true, message: '장바구니가 비워졌습니다' });
  } catch (err) {
    console.error('[Cart DELETE all]', err);
    return res.status(500).json({ success: false, message: '초기화 실패' });
  }
});

// ── POST /api/cart/merge  (로그인 시 비회원 → 회원 병합) ─────────
router.post('/merge', authMiddleware, async (req, res) => {
  const { guest_id } = req.body;

  if (!guest_id || typeof guest_id !== 'string') {
    return res.status(400).json({ success: false, message: 'guest_id가 필요합니다' });
  }

  try {
    const guestItems = await db.query(
      `SELECT * FROM guest_carts WHERE guest_id = ? AND expires_at > CURRENT_TIMESTAMP`,
      [guest_id]
    );

    let mergedCount = 0;
    for (const item of guestItems) {
      const existingRows = await db.execute(
        'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ? AND size <=> ? AND color <=> ?',
        [req.user.id, item.product_id, item.size, item.color]
      );

      if (existingRows.length > 0) {
        const existing = existingRows[0];
        const newQty = Math.min(existing.quantity + item.quantity, 99);
        await db.execute('UPDATE cart SET quantity = ? WHERE id = ?', [newQty, existing.id]);
      } else {
        await db.execute(
          'INSERT INTO cart (user_id, product_id, quantity, size, color) VALUES (?, ?, ?, ?, ?)',
          [req.user.id, item.product_id, item.quantity, item.size, item.color]
        );
      }
      mergedCount++;
    }

    // 병합 완료 후 비회원 장바구니 삭제
    await db.execute('DELETE FROM guest_carts WHERE guest_id = ?', [guest_id]);

    return res.json({ success: true, message: `장바구니 ${mergedCount}개 항목이 병합되었습니다`, mergedCount });
  } catch (err) {
    console.error('[Cart MERGE]', err);
    return res.status(500).json({ success: false, message: '병합 실패' });
  }
});

module.exports = router;
