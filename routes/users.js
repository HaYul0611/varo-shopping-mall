// routes/users.js
const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const db      = require('../db/database');
const { requireAuth, requireAdmin } = require('../middleware/auth');

/* GET /api/users — 전체 목록 (관리자) */
router.get('/', requireAuth, requireAdmin, (req, res) => {
  const users = db.prepare(
    'SELECT id, name, email, grade, points, total_spent, phone, is_admin, created_at FROM users ORDER BY created_at DESC'
  ).all();
  res.json(users);
});

/* GET /api/users/me — 내 정보 */
router.get('/me', requireAuth, (req, res) => {
  const user = db.prepare(
    'SELECT id, name, email, grade, points, total_spent, phone, address, is_admin FROM users WHERE id = ?'
  ).get(req.user.id);
  res.json(user);
});

/* PUT /api/users/me — 프로필 수정 */
router.put('/me', requireAuth, (req, res) => {
  const { name, phone, address, password, new_password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);

  if (new_password) {
    if (!password) return res.status(400).json({ error: '현재 비밀번호를 입력하세요.' });
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: '현재 비밀번호가 틀렸습니다.' });
    }
    const hash = bcrypt.hashSync(new_password, 10);
    db.prepare("UPDATE users SET password=?, updated_at=datetime('now','localtime') WHERE id=?")
      .run(hash, req.user.id);
  }

  db.prepare(`
    UPDATE users SET
      name = COALESCE(?, name),
      phone = COALESCE(?, phone),
      address = COALESCE(?, address),
      updated_at = datetime('now','localtime')
    WHERE id = ?
  `).run(name ?? null, phone ?? null, address ?? null, req.user.id);

  const updated = db.prepare(
    'SELECT id, name, email, grade, points, total_spent, phone, address FROM users WHERE id = ?'
  ).get(req.user.id);
  res.json(updated);
});

module.exports = router;
