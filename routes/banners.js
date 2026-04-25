// routes/banners.js
const router = require('express').Router();
const db = require('../db/database');
const { requireAuth, requireAdmin } = require('../middleware/auth');

/* GET /api/banners — 활성화된 배너 목록 (공개) */
router.get('/', async (req, res) => {
  try {
    const rows = await db.query('SELECT * FROM banners WHERE is_active = 1 ORDER BY sort_order ASC');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* POST /api/banners — 배너 추가 (관리자) */
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { title, img_url, link_url, sort_order } = req.body;
  if (!img_url) return res.status(400).json({ success: false, message: '이미지 URL이 필요합니다.' });

  try {
    const result = await db.execute(
      'INSERT INTO banners (title, img_url, link_url, sort_order) VALUES (?, ?, ?, ?)',
      [title || '', img_url, link_url || '', sort_order || 0]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* PUT /api/banners/:id — 배너 수정 (관리자) */
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { title, img_url, link_url, sort_order, is_active } = req.body;
  try {
    await db.execute(
      'UPDATE banners SET title=?, img_url=?, link_url=?, sort_order=?, is_active=? WHERE id=?',
      [title, img_url, link_url, sort_order, is_active, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* DELETE /api/banners/:id — 배너 삭제 (관리자) */
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    await db.execute('DELETE FROM banners WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
