// routes/categories.js
const router = require('express').Router();
const db = require('../db/database');
const { requireAuth, requireAdmin } = require('../middleware/auth');

/* GET /api/categories — 전체 카테고리 목록 (공개) */
router.get('/', async (req, res) => {
  try {
    const rows = await db.query('SELECT * FROM categories ORDER BY sort_order ASC');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* POST /api/categories — 카테고리 추가 (관리자) */
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { name, slug, sort_order, parent_id } = req.body;
  if (!name || !slug) return res.status(400).json({ success: false, message: '이름과 슬러그가 필요합니다.' });

  try {
    const result = await db.execute(
      'INSERT INTO categories (name, slug, sort_order, parent_id) VALUES (?, ?, ?, ?)',
      [name, slug, sort_order || 0, parent_id || null]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* PUT /api/categories/reorder — 순서 대량 변경 (관리자) */
router.put('/reorder', requireAuth, requireAdmin, async (req, res) => {
  const { orders } = req.body; // [{id, sort_order, parent_id}, ...]
  if (!orders || !Array.isArray(orders)) return res.status(400).json({ success: false, message: '순서 데이터가 필요합니다.' });

  try {
    await db.withTransaction(async (conn) => {
      for (const item of orders) {
        await conn.execute(
          'UPDATE categories SET sort_order = ?, parent_id = ? WHERE id = ?',
          [item.sort_order, item.parent_id || null, item.id]
        );
      }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* PUT /api/categories/:id — 카테고리 수정 (관리자) */
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { name, slug, sort_order, is_active, parent_id } = req.body;
  try {
    await db.execute(
      'UPDATE categories SET name=?, slug=?, sort_order=?, is_active=?, parent_id=? WHERE id=?',
      [name, slug, sort_order, is_active, parent_id || null, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* DELETE /api/categories/:id — 카테고리 삭제 (관리자) */
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    await db.execute('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
