/**
 * login_patch.js
 * ─────────────────────────────────────────────────────────────────
 * 기존 로그인 JS 파일(login.js 또는 auth.js)에
 * 로그인 성공 핸들러 부분만 아래처럼 수정하세요.
 *
 * [핵심 변경사항]
 * - 로그인 성공 시 GuestManager.mergeAfterLogin(token) 호출
 * - 이 한 줄이 비회원 장바구니/위시리스트를 회원 계정으로 자동 병합
 *
 * ────────────────────────────────────────────────────────────────
 * ★ 이 파일을 통째로 교체하지 말고,
 *   기존 로그인 성공 콜백에서 아래 BEFORE → AFTER 부분만 수정하세요.
 * ────────────────────────────────────────────────────────────────
 */

'use strict';

import GuestManager from './guestManager.js';

// ── BEFORE (기존 로그인 성공 처리) ───────────────────────────────
//
// const handleLoginSuccess = async (email, password) => {
//   const res  = await fetch('/api/auth/login', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ email, password }),
//   });
//   const json = await res.json();
//
//   if (json.success) {
//     localStorage.setItem('varo_token', json.token);
//     location.href = '/varo/';   // ← 리디렉션
//   }
// };


// ── AFTER (병합 로직 추가) ───────────────────────────────────────
//
// 기존 코드의 "localStorage.setItem('varo_token', json.token);" 바로 다음에
// 아래 한 줄만 추가하세요:
//
//   await GuestManager.mergeAfterLogin(json.token);
//
// ── 전체 예시 ────────────────────────────────────────────────────

const handleLoginSuccess = async (email, password) => {
  const res  = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || '로그인에 실패했습니다');
  }

  // ① 토큰 저장
  localStorage.setItem('varo_token', json.token);

  // ② 비회원 → 회원 데이터 병합 (핵심 추가)
  //    비회원 장바구니 + 위시리스트를 서버에서 merge
  await GuestManager.mergeAfterLogin(json.token);

  // ③ 기존 리디렉션 유지
  const redirect = new URLSearchParams(location.search).get('redirect') || '/varo/';
  location.href = redirect;
};

export { handleLoginSuccess };


// ─────────────────────────────────────────────────────────────────
// [참고] 비회원 결제 완료 후 회원가입 유도 예시
// ─────────────────────────────────────────────────────────────────
//
// 결제 완료 화면에서 아래처럼 회원가입 버튼을 추가하면
// 비회원 주문 이메일로 회원가입 → 주문 내역 확인 가능:
//
// <a href="/varo/join.html?email=ORDER_EMAIL" class="btn btn--primary">
//   회원가입하고 주문내역 보기 🎁
// </a>
//
// join.html에서 ?email= 파라미터를 읽어 이메일 필드 자동 입력 추가
// ─────────────────────────────────────────────────────────────────
