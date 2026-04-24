// middleware/optionalAuth.js
'use strict';
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'varo-secret-2026';

/**
 * 선택적 인증 미들웨어
 * 1. 헤더에 토큰이 있으면 사용자 정보를 req.user에 담음
 * 2. 토큰이 없거나 유효하지 않으면 req.guestId를 확인/생성함
 */
module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  req.guestId = req.headers['x-guest-id'] || `guest_${uuidv4().replace(/-/g, '').slice(0, 12)}`;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const [user] = await db.execute('SELECT id, email, name, is_admin FROM users WHERE id = ?', [decoded.id]);

    if (user && user.length > 0) {
      req.user = user[0];
    }
  } catch (err) {
    // 토큰이 만료되었거나 잘못된 경우 비회원으로 간주
    console.warn('[OptionalAuth] Invalid token, proceeding as guest');
  }

  next();
};
