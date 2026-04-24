// routes/orders.js
const router = require('express').Router();
const db = require('../db/database');
const { requireAuth, requireAdmin } = require('../middleware/auth');

/* POST /api/orders — 주문 생성 */
router.post('/', requireAuth, async (req, res) => {
  const { items, subtotal, discount, shipping_fee, total,
    recipient_name, recipient_phone, address, address_detail, memo, payment_method } = req.body;

  if (!items?.length || !recipient_name || !recipient_phone || !address) {
    return res.status(400).json({ error: '주문 정보가 불완전합니다.' });
  }

  const orderNum = `ORD-${Date.now()}`;
  try {
    const result = await db.execute(`
      INSERT INTO orders (order_number, user_id, items, subtotal, discount, shipping_fee, total,
        recipient_name, recipient_phone, address, address_detail, memo, payment_method)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      orderNum, req.user.id, JSON.stringify(items),
      subtotal, discount || 0, shipping_fee || 0, total,
      recipient_name, recipient_phone, address,
      address_detail || '', memo || '', payment_method || 'card'
    ]);

    // 장바구니 비우기
    await db.execute('DELETE FROM cart WHERE user_id = ?', [req.user.id]);

    // 누적 구매금액 업데이트 → 등급 자동 승급
    const users = await db.execute('SELECT total_spent FROM users WHERE id = ?', [req.user.id]);
    const user = users[0];
    const newSpent = (user?.total_spent || 0) + total;
    let newGrade = 'basic';
    if (newSpent >= 1000000) newGrade = 'vip';
    else if (newSpent >= 300000) newGrade = 'gold';
    else if (newSpent >= 100000) newGrade = 'silver';

    await db.execute('UPDATE users SET total_spent = ?, grade = ? WHERE id = ?', [newSpent, newGrade, req.user.id]);

    const orderRows = await db.execute('SELECT * FROM orders WHERE id = ?', [result.insertId]);
    const order = orderRows[0];
    res.status(201).json({ ...order, items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET /api/orders — 내 주문 목록 */
router.get('/', requireAuth, async (req, res) => {
  const isAdmin = req.user.is_admin;
  const sql = isAdmin
    ? 'SELECT * FROM orders ORDER BY created_at DESC'
    : 'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC';

  try {
    const rows = isAdmin ? await db.query(sql) : await db.query(sql, [req.user.id]);
    res.json(rows.map(o => ({ ...o, items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET /api/orders/:id — 주문 상세 */
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const rows = await db.query('SELECT * FROM orders WHERE order_number = ? OR id = ?', [req.params.id, req.params.id]);
    if (!rows.length) return res.status(404).json({ error: '주문을 찾을 수 없습니다.' });

    const order = rows[0];
    if (!req.user.is_admin && order.user_id !== req.user.id) {
      return res.status(403).json({ error: '권한이 없습니다.' });
    }
    res.json({ ...order, items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* PUT /api/orders/:id/status — 상태 변경 (관리자) */
router.put('/:id/status', requireAuth, requireAdmin, async (req, res) => {
  const { status } = req.body;
  const valid = ['pending', 'preparing', 'shipped', 'delivered', 'cancelled'];
  if (!valid.includes(status)) return res.status(400).json({ error: '유효하지 않은 상태값입니다.' });

  try {
    await db.execute("UPDATE orders SET status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?", [status, req.params.id]);
    res.json({ success: true, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
