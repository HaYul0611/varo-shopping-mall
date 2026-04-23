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

const express    = require('express');
const router     = express.Router();
const optionalAuth = require('../middleware/optionalAuth');
const authMiddleware = require('../middleware/auth'); // 기존 필수 인증 미들웨어
const db         = require('../db');                  // 기존 DB 싱글턴

const FREE_SHIPPING_THRESHOLD = 50_000; // 5만원 이상 무료배송
const SHIPPING_FEE = 3_000;

// ── 공통 유틸 ────────────────────────────────────────────────────

/**
 * 장바구니 아이템 + 상품 정보 JOIN 조회
 * @param {string} table  - 'cart' | 'guest_carts'
 * @param {string} column - 'user_id' | 'guest_id'
 * @param {number|string} id
 */
const fetchCartItems = (table, column, id) => {
  return db.prepare(`
    SELECT
      c.id,
      c.product_id,
      c.quantity,
      c.size,
      c.color,
      p.name        AS product_name,
      p.price       AS unit_price,
      p.image       AS product_image,
      p.stock,
      (c.quantity * p.price) AS subtotal
    FROM ${table} c
    JOIN products p ON p.id = c.product_id
    WHERE c.${column} = ?
      ${table === 'guest_carts' ? "AND c.expires_at > datetime('now')" : ''}
    ORDER BY c.id ASC
  `).all(id);
};

const calcSummary = (items) => {
  const totalAmount  = items.reduce((s, i) => s + i.subtotal, 0);
  const shippingFee  = totalAmount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  return { totalAmount, shippingFee, finalAmount: totalAmount + shippingFee, itemCount: items.length };
};

// ── GET /api/cart ────────────────────────────────────────────────
router.get('/', optionalAuth, (req, res) => {
  try {
    let items;
    if (req.user) {
      items = fetchCartItems('cart', 'user_id', req.user.id);
    } else {
      items = fetchCartItems('guest_carts', 'guest_id', req.guestId);
    }

    return res.json({ success: true, data: { items, summary: calcSummary(items) } });
  } catch (err) {
    console.error('[Cart GET]', err);
    return res.status(500).json({ success: false, message: '장바구니 조회 실패' });
  }
});

// ── POST /api/cart ───────────────────────────────────────────────
router.post('/', optionalAuth, (req, res) => {
  const { product_id, quantity = 1, size, color } = req.body;

  if (!product_id || !Number.isInteger(Number(product_id))) {
    return res.status(400).json({ success: false, message: '유효하지 않은 상품 ID' });
  }
  if (quantity < 1 || quantity > 99) {
    return res.status(400).json({ success: false, message: '수량은 1~99 사이여야 합니다' });
  }

  try {
    // 상품 존재 + 재고 확인
    const product = db.prepare('SELECT id, stock FROM products WHERE id = ?').get(product_id);
    if (!product) return res.status(404).json({ success: false, message: '상품을 찾을 수 없습니다' });
    if (product.stock < quantity) {
      return res.status(409).json({ success: false, message: '재고가 부족합니다' });
    }

    if (req.user) {
      // ── 회원 장바구니 ─────────────────────────────────────────
      const existing = db.prepare(
        'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ? AND size IS ? AND color IS ?'
      ).get(req.user.id, product_id, size ?? null, color ?? null);

      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, 99);
        db.prepare('UPDATE cart SET quantity = ? WHERE id = ?').run(newQty, existing.id);
      } else {
        db.prepare(
          'INSERT INTO cart (user_id, product_id, quantity, size, color) VALUES (?, ?, ?, ?, ?)'
        ).run(req.user.id, product_id, quantity, size ?? null, color ?? null);
      }
    } else {
      // ── 비회원 장바구니 ───────────────────────────────────────
      const existing = db.prepare(
        `SELECT id, quantity FROM guest_carts
         WHERE guest_id = ? AND product_id = ? AND size IS ? AND color IS ?
           AND expires_at > datetime('now')`
      ).get(req.guestId, product_id, size ?? null, color ?? null);

      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, 99);
        db.prepare(
          `UPDATE guest_carts SET quantity = ?, expires_at = datetime('now', '+30 days') WHERE id = ?`
        ).run(newQty, existing.id);
      } else {
        db.prepare(
          `INSERT INTO guest_carts (guest_id, product_id, quantity, size, color)
           VALUES (?, ?, ?, ?, ?)`
        ).run(req.guestId, product_id, quantity, size ?? null, color ?? null);
      }
    }

    return res.status(201).json({ success: true, message: '장바구니에 추가되었습니다' });
  } catch (err) {
    console.error('[Cart POST]', err);
    return res.status(500).json({ success: false, message: '장바구니 추가 실패' });
  }
});

// ── PATCH /api/cart/:id ──────────────────────────────────────────
router.patch('/:id', optionalAuth, (req, res) => {
  const cartId  = Number(req.params.id);
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
      result = db.prepare(
        'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?'
      ).run(quantity, cartId, req.user.id);
    } else {
      result = db.prepare(
        `UPDATE guest_carts SET quantity = ? WHERE id = ? AND guest_id = ? AND expires_at > datetime('now')`
      ).run(quantity, cartId, req.guestId);
    }

    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: '항목을 찾을 수 없습니다' });
    }
    return res.json({ success: true, message: '수량이 변경되었습니다' });
  } catch (err) {
    console.error('[Cart PATCH]', err);
    return res.status(500).json({ success: false, message: '수량 변경 실패' });
  }
});

// ── DELETE /api/cart/:id ─────────────────────────────────────────
router.delete('/:id', optionalAuth, (req, res) => {
  const cartId = Number(req.params.id);

  if (!Number.isInteger(cartId) || cartId < 1) {
    return res.status(400).json({ success: false, message: '유효하지 않은 장바구니 ID' });
  }

  try {
    let result;
    if (req.user) {
      result = db.prepare('DELETE FROM cart WHERE id = ? AND user_id = ?').run(cartId, req.user.id);
    } else {
      result = db.prepare('DELETE FROM guest_carts WHERE id = ? AND guest_id = ?').run(cartId, req.guestId);
    }

    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: '항목을 찾을 수 없습니다' });
    }
    return res.json({ success: true, message: '삭제되었습니다' });
  } catch (err) {
    console.error('[Cart DELETE/:id]', err);
    return res.status(500).json({ success: false, message: '삭제 실패' });
  }
});

// ── DELETE /api/cart (전체 비우기) ───────────────────────────────
router.delete('/', optionalAuth, (req, res) => {
  try {
    if (req.user) {
      db.prepare('DELETE FROM cart WHERE user_id = ?').run(req.user.id);
    } else {
      db.prepare('DELETE FROM guest_carts WHERE guest_id = ?').run(req.guestId);
    }
    return res.json({ success: true, message: '장바구니가 비워졌습니다' });
  } catch (err) {
    console.error('[Cart DELETE all]', err);
    return res.status(500).json({ success: false, message: '초기화 실패' });
  }
});

// ── POST /api/cart/merge  (로그인 시 비회원 → 회원 병합) ─────────
router.post('/merge', authMiddleware, (req, res) => {
  const { guest_id } = req.body;

  if (!guest_id || typeof guest_id !== 'string') {
    return res.status(400).json({ success: false, message: 'guest_id가 필요합니다' });
  }

  try {
    const mergeTransaction = db.transaction(() => {
      const guestItems = db.prepare(
        `SELECT * FROM guest_carts WHERE guest_id = ? AND expires_at > datetime('now')`
      ).all(guest_id);

      let mergedCount = 0;
      for (const item of guestItems) {
        const existing = db.prepare(
          'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ? AND size IS ? AND color IS ?'
        ).get(req.user.id, item.product_id, item.size, item.color);

        if (existing) {
          const newQty = Math.min(existing.quantity + item.quantity, 99);
          db.prepare('UPDATE cart SET quantity = ? WHERE id = ?').run(newQty, existing.id);
        } else {
          db.prepare(
            'INSERT INTO cart (user_id, product_id, quantity, size, color) VALUES (?, ?, ?, ?, ?)'
          ).run(req.user.id, item.product_id, item.quantity, item.size, item.color);
        }
        mergedCount++;
      }

      // 병합 완료 후 비회원 장바구니 삭제
      db.prepare('DELETE FROM guest_carts WHERE guest_id = ?').run(guest_id);

      return mergedCount;
    });

    const count = mergeTransaction();
    return res.json({ success: true, message: `장바구니 ${count}개 항목이 병합되었습니다`, mergedCount: count });
  } catch (err) {
    console.error('[Cart MERGE]', err);
    return res.status(500).json({ success: false, message: '병합 실패' });
  }
});

module.exports = router;
