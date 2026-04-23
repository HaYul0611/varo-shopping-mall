/**
 * server.js 수정 패치 (diff 형식)
 * ─────────────────────────────────────────────────────────────────
 * 기존 server.js에서 아래 두 부분만 수정하면 됩니다.
 *
 * [수정 1] require 추가
 * [수정 2] app.use 라우터 등록 추가
 * [수정 3] 주기적 만료 데이터 정리 (선택)
 *
 * ────────────────────────────────────────────────────────────────
 * ★ 이 파일은 서버 전체를 교체하지 않습니다.
 *   기존 server.js에서 아래 PATCH 섹션만 추가하세요.
 * ────────────────────────────────────────────────────────────────
 */

// ═══════════════════════════════════════════════════════════════
// [PATCH 1] 기존 라우트 require 목록 아래에 추가
// ═══════════════════════════════════════════════════════════════

// 기존 코드 (예시):
// const cartRoute    = require('./routes/cart');
// const ordersRoute  = require('./routes/orders');
//
// ↓ 아래 줄들을 추가:

const wishlistRoute  = require('./routes/wishlist');
const checkoutRoute  = require('./routes/checkout');

// nanoid v3 CJS 호환 설치 확인: npm i nanoid@3 uuid
// optionalAuth는 cart.js / wishlist.js 내부에서 직접 require


// ═══════════════════════════════════════════════════════════════
// [PATCH 2] 기존 app.use 목록 아래에 추가
// ═══════════════════════════════════════════════════════════════

// 기존 코드 (예시):
// app.use('/api/cart',   cartRoute);
// app.use('/api/orders', ordersRoute);
//
// ↓ 기존 /api/cart는 수정된 routes/cart.js로 교체됩니다.
//   아래 신규 라우터를 추가하세요:

// app.use('/api/cart',      cartRouteUpdated);   // 기존 cartRoute → 교체
// app.use('/api/wishlist',  wishlistRoute);        // 신규
// app.use('/api/checkout',  checkoutRoute);        // 신규


// ═══════════════════════════════════════════════════════════════
// [PATCH 3] 만료된 비회원 데이터 자동 정리 (서버 시작 시 + 24시간 주기)
// ═══════════════════════════════════════════════════════════════

const db = require('./db'); // 기존 db 싱글턴

const purgeExpiredGuestData = () => {
  try {
    const now = "datetime('now')";
    db.exec(`DELETE FROM guest_carts      WHERE expires_at < ${now}`);
    db.exec(`DELETE FROM guest_wishlists  WHERE expires_at < ${now}`);
    console.info(`[Purge] 만료 비회원 데이터 정리 완료 - ${new Date().toISOString()}`);
  } catch (err) {
    console.error('[Purge] 정리 실패:', err.message);
  }
};

// 서버 시작 시 1회 + 이후 24시간마다 실행
purgeExpiredGuestData();
setInterval(purgeExpiredGuestData, 24 * 60 * 60 * 1000);


// ═══════════════════════════════════════════════════════════════
// [PATCH 4] 인증 라우트(login) 수정 — mergeAfterLogin 트리거
// ═══════════════════════════════════════════════════════════════
//
// 기존 POST /api/auth/login 응답에 아래를 추가하면
// 클라이언트(guestManager.js)의 mergeAfterLogin()이 자동 호출됩니다.
//
// 기존:
//   return res.json({ success: true, token, user: { ... } });
//
// 변경 불필요 — 클라이언트에서 로그인 성공 후 아래처럼 호출:
//   const { token } = await loginResponse.json();
//   localStorage.setItem('varo_token', token);
//   await GuestManager.mergeAfterLogin(token);  // ← 추가
//
// ═══════════════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════════════
// [PATCH 5] package.json 추가 패키지 설치
// ═══════════════════════════════════════════════════════════════
//
// npm i nanoid@3 uuid
//
// - nanoid@3: CJS require() 호환 (v4부터 ESM only)
// - uuid: 비회원 ID 생성 (optionalAuth.js)
//
// ═══════════════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════════════
// [PATCH 6] DB 마이그레이션 실행
// ═══════════════════════════════════════════════════════════════
//
// node db/migrations/001_add_guest_wishlist_checkout.js
//
// ─── 주의 ───────────────────────────────────────────────────
// 기존 테이블(products, users, orders, cart 등)은
// 마이그레이션이 IF NOT EXISTS + ALTER COLUMN(없는 경우만)으로만
// 동작하므로 기존 데이터가 보존됩니다.
// ════════════════════════════════════════════════════════════════


module.exports = { purgeExpiredGuestData };
