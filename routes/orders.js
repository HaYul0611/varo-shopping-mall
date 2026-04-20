// routes/orders.js
const router = require('express').Router();
const db     = require('../db/database');
const { requireAuth, requireAdmin } = require('../middleware/auth');

/* POST /api/orders — 주문 생성 */
router.post('/', requireAuth, (req, res) => {
  const { items, subtotal, discount, shipping_fee, total,
          recipient_name, recipient_phone, address, address_detail, memo, payment_method } = req.body;

  if (!items?.length || !recipient_name || !recipient_phone || !address) {
    return res.status(400).json({ error: '주문 정보가 불완전합니다.' });
  }

  const orderNum = `ORD-${Date.now()}`;
  const result = db.prepare(`
    INSERT INTO orders (order_number, user_id, items, subtotal, discount, shipping_fee, total,
      recipient_name, recipient_phone, address, address_detail, memo, payment_method)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    orderNum, req.user.id, JSON.stringify(items),
    subtotal, discount || 0, shipping_fee || 0, total,
    recipient_name, recipient_phone, address,
    address_detail || '', memo || '', payment_method || 'card'
  );

  // 장바구니 비우기
  db.prepare('DELETE FROM cart WHERE user_id = ?').run(req.user.id);

  // 누적 구매금액 업데이트 → 등급 자동 승급
  const user = db.prepare('SELECT total_spent FROM users WHERE id = ?').get(req.user.id);
  const newSpent = (user?.total_spent || 0) + total;
  let newGrade = 'basic';
  if (newSpent >= 1000000) newGrade = 'vip';
  else if (newSpent >= 300000) newGrade = 'gold';
  else if (newSpent >= 100000) newGrade = 'silver';

  db.prepare('UPDATE users SET total_spent = ?, grade = ? WHERE id = ?')
    .run(newSpent, newGrade, req.user.id);

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ ...order, items: JSON.parse(order.items) });
});

/* GET /api/orders — 내 주문 목록 */
router.get('/', requireAuth, (req, res) => {
  const isAdmin = req.user.is_admin;
  const sql = isAdmin
    ? 'SELECT * FROM orders ORDER BY created_at DESC'
    : 'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC';
  const rows = isAdmin ? db.prepare(sql).all() : db.prepare(sql).all(req.user.id);
  res.json(rows.map(o => ({ ...o, items: JSON.parse(o.items) })));
});

/* GET /api/orders/:id — 주문 상세 */
router.get('/:id', requireAuth, (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE order_number = ? OR id = ?')
                  .get(req.params.id, req.params.id);
  if (!order) return res.status(404).json({ error: '주문을 찾을 수 없습니다.' });
  if (!req.user.is_admin && order.user_id !== req.user.id) {
    return res.status(403).json({ error: '권한이 없습니다.' });
  }
  res.json({ ...order, items: JSON.parse(order.items) });
});

/* PUT /api/orders/:id/status — 상태 변경 (관리자) */
router.put('/:id/status', requireAuth, requireAdmin, (req, res) => {
  const { status } = req.body;
  const valid = ['pending','preparing','shipped','delivered','cancelled'];
  if (!valid.includes(status)) return res.status(400).json({ error: '유효하지 않은 상태값입니다.' });
  db.prepare("UPDATE orders SET status=?, updated_at=datetime('now','localtime') WHERE id=?")
    .run(status, req.params.id);
  res.json({ success: true, status });
});

module.exports = router;
