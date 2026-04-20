// routes/cart.js
const router = require('express').Router();
const db     = require('../db/database');
const { requireAuth } = require('../middleware/auth');

/* GET /api/cart */
router.get('/', requireAuth, (req, res) => {
  const items = db.prepare(`
    SELECT c.id, c.qty, c.size, c.color,
           p.id as product_id, p.product_code, p.name, p.price, p.sale_price,
           p.main_img, p.brand
    FROM cart c
    JOIN products p ON p.id = c.product_id
    WHERE c.user_id = ?
    ORDER BY c.created_at DESC
  `).all(req.user.id);
  res.json(items);
});

/* POST /api/cart */
router.post('/', requireAuth, (req, res) => {
  const { product_id, size, color, qty = 1 } = req.body;
  if (!product_id || !size) return res.status(400).json({ error: '상품 ID와 사이즈는 필수입니다.' });

  const existing = db.prepare(
    'SELECT id, qty FROM cart WHERE user_id=? AND product_id=? AND size=? AND color=?'
  ).get(req.user.id, product_id, size, color);

  if (existing) {
    db.prepare('UPDATE cart SET qty = qty + ? WHERE id = ?').run(qty, existing.id);
  } else {
    db.prepare('INSERT INTO cart (user_id, product_id, size, color, qty) VALUES (?,?,?,?,?)')
      .run(req.user.id, product_id, size, color || '', qty);
  }
  res.json({ success: true });
});

/* PUT /api/cart/:id */
router.put('/:id', requireAuth, (req, res) => {
  const { qty } = req.body;
  if (!qty || qty < 1) return res.status(400).json({ error: '수량은 1 이상이어야 합니다.' });
  db.prepare('UPDATE cart SET qty = ? WHERE id = ? AND user_id = ?')
    .run(qty, req.params.id, req.user.id);
  res.json({ success: true });
});

/* DELETE /api/cart/:id */
router.delete('/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM cart WHERE id = ? AND user_id = ?')
    .run(req.params.id, req.user.id);
  res.json({ success: true });
});

/* DELETE /api/cart (전체 비우기) */
router.delete('/', requireAuth, (req, res) => {
  db.prepare('DELETE FROM cart WHERE user_id = ?').run(req.user.id);
  res.json({ success: true });
});

module.exports = router;
