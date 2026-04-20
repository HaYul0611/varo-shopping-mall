// middleware/auth.js — JWT 인증 미들웨어
const jwt = require('jsonwebtoken');
const db  = require('../db/database');

const SECRET = process.env.JWT_SECRET || 'varo2026_secret';

/* ── 토큰 필수 미들웨어 ─────────────────── */
const requireAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }
  try {
    const token   = header.split(' ')[1];
    const payload = jwt.verify(token, SECRET);
    const user    = db.prepare('SELECT id, name, email, grade, points, is_admin FROM users WHERE id = ?').get(payload.id);
    if (!user) return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: '토큰이 만료되었거나 유효하지 않습니다.' });
  }
};

/* ── 관리자 전용 미들웨어 ────────────────── */
const requireAdmin = (req, res, next) => {
  if (!req.user?.is_admin) {
    return res.status(403).json({ error: '관리자 권한이 필요합니다.' });
  }
  next();
};

/* ── 선택적 인증 (비로그인도 허용) ─────── */
const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    try {
      const token = header.split(' ')[1];
      req.user = jwt.verify(token, SECRET);
    } catch { /* 무시 */ }
  }
  next();
};

module.exports = { requireAuth, requireAdmin, optionalAuth };
