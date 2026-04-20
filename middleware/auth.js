const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'varo2026_secret';

// 필수 인증
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '인증 토큰이 없습니다.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('[Auth Middleware] 토큰 검증 실패:', err.message);
    return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
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
