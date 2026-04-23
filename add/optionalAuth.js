/**
 * optionalAuth.js
 * ─────────────────────────────────────────────────────────────────
 * 선택적 JWT 인증 미들웨어
 *
 * - 유효한 토큰 → req.user = { id, email, role, membership }
 * - 토큰 없음 / 만료 / 위조 → req.user = null (비회원으로 처리)
 * - 비회원은 X-Guest-Id 헤더로 식별 → req.guestId
 *
 * [사용처]
 * - GET/POST /api/cart       (비회원/회원 통합)
 * - GET/POST /api/wishlist   (비회원/회원 통합)
 * - POST     /api/checkout   (비회원/회원 통합 결제)
 */

'use strict';

const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');  // uuid 패키지 필요: npm i uuid

const GUEST_ID_HEADER = 'x-guest-id';
const GUEST_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Guest ID 유효성 검증 (UUID v4 형식만 허용)
 * SQL Injection / 조작 방지
 */
const isValidGuestId = (id) => typeof id === 'string' && GUEST_ID_PATTERN.test(id);

const optionalAuth = (req, res, next) => {
  req.user = null;
  req.guestId = null;

  // ── 1. JWT 추출 및 검증 ──────────────────────────────────────────
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
      return next(); // 인증 성공 → guestId 불필요
    } catch (err) {
      // 만료(TokenExpiredError) or 위조(JsonWebTokenError) → 비회원 처리
      req.user = null;
    }
  }

  // ── 2. Guest ID 추출 및 검증 ────────────────────────────────────
  const rawGuestId = req.headers[GUEST_ID_HEADER] || req.query.guestId;

  if (rawGuestId && isValidGuestId(rawGuestId)) {
    req.guestId = rawGuestId;
  } else {
    // 헤더 없거나 위조 형식 → 서버에서 새 guestId 발급 후 응답 헤더로 전달
    req.guestId = uuidv4();
    res.setHeader('X-New-Guest-Id', req.guestId);
  }

  next();
};

module.exports = optionalAuth;
