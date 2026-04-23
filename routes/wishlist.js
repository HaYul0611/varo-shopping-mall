/**
 * routes/wishlist.js  (비회원 / 회원 통합)
 * ─────────────────────────────────────────────────────────────────
 * GET    /api/wishlist              — 위시리스트 조회
 * POST   /api/wishlist              — 토글 (추가 / 제거)
 * DELETE /api/wishlist/:product_id  — 단일 제거
 * POST   /api/wishlist/merge        — 로그인 시 비회원 → 회원 병합
 *
 * [비회원] X-Guest-Id 헤더 → guest_wishlists 테이블
 * [회원]   Authorization: Bearer → wishlists 테이블
 */

'use strict';

const express      = require('express');
const router       = express.Router();
const optionalAuth = require('../middleware/optionalAuth');
const authMiddleware = require('../middleware/auth');
const db           = require('../db');

// ── GET /api/wishlist ────────────────────────────────────────────
router.get('/', optionalAuth, (req, res) => {
  try {
    let items;
    if (req.user) {
      items = db.prepare(`
        SELECT
          w.id,
          w.product_id,
          w.created_at,
          p.name  AS product_name,
          p.price AS product_price,
          p.image AS product_image,
          p.stock
        FROM wishlists w
        JOIN products p ON p.id = w.product_id
        WHERE w.user_id = ?
        ORDER BY w.id DESC
      `).all(req.user.id);
    } else {
      items = db.prepare(`
        SELECT
          gw.id,
          gw.product_id,
          gw.created_at,
          p.name  AS product_name,
          p.price AS product_price,
          p.image AS product_image,
          p.stock
        FROM guest_wishlists gw
        JOIN products p ON p.id = gw.product_id
        WHERE gw.guest_id = ?
          AND gw.expires_at > datetime('now')
        ORDER BY gw.id DESC
      `).all(req.guestId);
    }

    return res.json({ success: true, data: items });
  } catch (err) {
    console.error('[Wishlist GET]', err);
    return res.status(500).json({ success: false, message: '위시리스트 조회 실패' });
  }
});

// ── POST /api/wishlist  (토글) ───────────────────────────────────
router.post('/', optionalAuth, (req, res) => {
  const { product_id } = req.body;

  if (!product_id || !Number.isInteger(Number(product_id))) {
    return res.status(400).json({ success: false, message: '유효하지 않은 상품 ID' });
  }

  try {
    // 상품 존재 확인
    const product = db.prepare('SELECT id FROM products WHERE id = ?').get(product_id);
    if (!product) return res.status(404).json({ success: false, message: '상품을 찾을 수 없습니다' });

    let action;
    if (req.user) {
      const existing = db.prepare(
        'SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?'
      ).get(req.user.id, product_id);

      if (existing) {
        db.prepare('DELETE FROM wishlists WHERE id = ?').run(existing.id);
        action = 'removed';
      } else {
        db.prepare('INSERT INTO wishlists (user_id, product_id) VALUES (?, ?)').run(req.user.id, product_id);
        action = 'added';
      }
    } else {
      const existing = db.prepare(
        `SELECT id FROM guest_wishlists WHERE guest_id = ? AND product_id = ? AND expires_at > datetime('now')`
      ).get(req.guestId, product_id);

      if (existing) {
        db.prepare('DELETE FROM guest_wishlists WHERE id = ?').run(existing.id);
        action = 'removed';
      } else {
        db.prepare(
          `INSERT OR IGNORE INTO guest_wishlists (guest_id, product_id) VALUES (?, ?)`
        ).run(req.guestId, product_id);
        action = 'added';
      }
    }

    return res.json({
      success: true,
      action,
      message: action === 'added' ? '위시리스트에 추가되었습니다' : '위시리스트에서 제거되었습니다',
    });
  } catch (err) {
    console.error('[Wishlist POST]', err);
    return res.status(500).json({ success: false, message: '위시리스트 업데이트 실패' });
  }
});

// ── DELETE /api/wishlist/:product_id ─────────────────────────────
router.delete('/:product_id', optionalAuth, (req, res) => {
  const product_id = Number(req.params.product_id);

  if (!Number.isInteger(product_id) || product_id < 1) {
    return res.status(400).json({ success: false, message: '유효하지 않은 상품 ID' });
  }

  try {
    if (req.user) {
      db.prepare('DELETE FROM wishlists WHERE user_id = ? AND product_id = ?').run(req.user.id, product_id);
    } else {
      db.prepare('DELETE FROM guest_wishlists WHERE guest_id = ? AND product_id = ?').run(req.guestId, product_id);
    }
    return res.json({ success: true, message: '위시리스트에서 제거되었습니다' });
  } catch (err) {
    console.error('[Wishlist DELETE]', err);
    return res.status(500).json({ success: false, message: '삭제 실패' });
  }
});

// ── POST /api/wishlist/merge ─────────────────────────────────────
router.post('/merge', authMiddleware, (req, res) => {
  const { guest_id } = req.body;

  if (!guest_id) return res.status(400).json({ success: false, message: 'guest_id가 필요합니다' });

  try {
    const mergeTransaction = db.transaction(() => {
      const guestItems = db.prepare(
        `SELECT product_id FROM guest_wishlists WHERE guest_id = ? AND expires_at > datetime('now')`
      ).all(guest_id);

      for (const item of guestItems) {
        db.prepare(
          'INSERT OR IGNORE INTO wishlists (user_id, product_id) VALUES (?, ?)'
        ).run(req.user.id, item.product_id);
      }

      db.prepare('DELETE FROM guest_wishlists WHERE guest_id = ?').run(guest_id);
      return guestItems.length;
    });

    const count = mergeTransaction();
    return res.json({ success: true, message: `위시리스트 ${count}개 항목이 병합되었습니다` });
  } catch (err) {
    console.error('[Wishlist MERGE]', err);
    return res.status(500).json({ success: false, message: '병합 실패' });
  }
});

module.exports = router;
