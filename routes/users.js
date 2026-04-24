// routes/users.js
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db = require('../db/database');
const { requireAuth, requireAdmin } = require('../middleware/auth');

/* GET /api/users — 전체 목록 (관리자) */
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await db.query(
      'SELECT id, name, email, grade, points, total_spent, phone, is_admin, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(users.map(u => ({
      ...u,
      email: db.decrypt(u.email),
      phone: db.decrypt(u.phone)
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET /api/users/me — 내 정보 */
router.get('/me', requireAuth, async (req, res) => {
  try {
    const rows = await db.execute(
      'SELECT id, name, email, grade, points, total_spent, phone, address, is_admin FROM users WHERE id = ?',
      [req.user.id]
    );
    const user = rows[0];
    if (user) {
      user.email = db.decrypt(user.email);
      user.phone = db.decrypt(user.phone);
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* PUT /api/users/me — 프로필 수정 */
router.put('/me', requireAuth, async (req, res) => {
  const { name, phone, address, password, new_password } = req.body;
  try {
    const users = await db.execute('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const user = users[0];

    if (new_password) {
      if (!password) return res.status(400).json({ error: '현재 비밀번호를 입력하세요.' });
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: '현재 비밀번호가 틀렸습니다.' });
      }
      const hash = bcrypt.hashSync(new_password, 10);
      await db.execute('UPDATE users SET password=?, updated_at=CURRENT_TIMESTAMP WHERE id=?', [hash, req.user.id]);
    }

    await db.execute(`
      UPDATE users SET
        name = COALESCE(?, name),
        phone = COALESCE(?, phone),
        address = COALESCE(?, address),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name ?? null, phone ? db.encrypt(phone) : null, address ?? null, req.user.id]);

    const updatedRows = await db.execute(
      'SELECT id, name, email, grade, points, total_spent, phone, address FROM users WHERE id = ?',
      [req.user.id]
    );
    const updated = updatedRows[0];
    if (updated) {
      updated.email = db.decrypt(updated.email);
      updated.phone = db.decrypt(updated.phone);
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
