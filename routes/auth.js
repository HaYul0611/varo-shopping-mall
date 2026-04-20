// routes/auth.js
const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const db      = require('../db/database');
const { requireAuth } = require('../middleware/auth');

const SECRET  = process.env.JWT_SECRET || 'varo2026_secret';
const EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

/* ── 회원가입 POST /api/auth/register ───── */
router.post('/register', (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: '이름, 이메일, 비밀번호는 필수입니다.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: '비밀번호는 6자 이상이어야 합니다.' });
  }
  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (exists) return res.status(409).json({ error: '이미 사용중인 이메일입니다.' });

  const hash = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)'
  ).run(name, email, hash, phone || null);

  const token = jwt.sign({ id: result.lastInsertRowid }, SECRET, { expiresIn: EXPIRES });
  const user  = db.prepare('SELECT id, name, email, grade, points, is_admin FROM users WHERE id = ?')
                  .get(result.lastInsertRowid);

  res.status(201).json({ token, user });
});

/* ── 로그인 POST /api/auth/login ─────────── */
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: '이메일과 비밀번호를 입력하세요.' });
  }
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
  }

  const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: EXPIRES });
  const { password: _, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

/* ── 내 정보 GET /api/auth/me ─────────────── */
router.get('/me', requireAuth, (req, res) => {
  const user = db.prepare(
    'SELECT id, name, email, grade, points, total_spent, phone, address, is_admin FROM users WHERE id = ?'
  ).get(req.user.id);
  res.json(user);
});

module.exports = router;
