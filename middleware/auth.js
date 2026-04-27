const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');

const SECRET = process.env.JWT_SECRET || 'varo2026_secret';

// 필수 인증
const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ success: false, message: '로그인이 필요한 서비스입니다.' });

  try {
    const decoded = jwt.verify(token, SECRET);
    const user = await db.execute('SELECT id, email, name, is_admin FROM users WHERE id = ?', [decoded.id]);

    if (!user || user.length === 0) {
      return res.status(401).json({ success: false, message: '유효하지 않은 계정입니다.' });
    }

    req.user = user[0];
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: '토큰이 만료되었거나 유효하지 않습니다.' });
  }
};

// 관리자 권한 필수
const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({ error: '관리자 권한이 없습니다.' });
  }
  next();
};

// 선택적 인증 (토큰 있으면 사용자 정보 저장, 없으면 통과)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
  } catch (err) {
    // 선택적 인증이므로 오류 시 그냥 통과
  }
  next();
};

module.exports = { requireAuth, requireAdmin, optionalAuth };
