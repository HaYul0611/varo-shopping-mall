/**
 * guestManager.js
 * ─────────────────────────────────────────────────────────────────
 * 비회원 식별 ID 관리 + 로그인 시 서버 병합 처리
 *
 * [역할]
 * - localStorage에 UUID v4 guestId 영속 관리
 * - 모든 API 요청에 X-Guest-Id 헤더 자동 주입
 * - 로그인 완료 시 cart/wishlist merge API 호출
 *
 * [사용법]
 *   import GuestManager from './guestManager.js';
 *   const api = GuestManager.fetch('/api/cart');  // 헤더 자동 주입
 */

'use strict';

const GUEST_ID_KEY     = 'varo_guest_id';
const AUTH_TOKEN_KEY   = 'varo_token';

const GuestManager = (() => {

  // ── UUID v4 생성 (crypto.randomUUID 지원 브라우저 우선) ─────────
  const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Polyfill (구형 브라우저 대응)
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  };

  // ── guestId 조회 or 신규 생성 ────────────────────────────────────
  const getGuestId = () => {
    let id = localStorage.getItem(GUEST_ID_KEY);
    if (!id) {
      id = generateUUID();
      localStorage.setItem(GUEST_ID_KEY, id);
    }
    return id;
  };

  const clearGuestId = () => localStorage.removeItem(GUEST_ID_KEY);

  // ── 인증 토큰 조회 ────────────────────────────────────────────────
  const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);
  const isLoggedIn   = () => !!getAuthToken();

  /**
   * 공통 fetch 래퍼
   * - 로그인 상태: Authorization 헤더 자동 주입
   * - 비로그인 상태: X-Guest-Id 헤더 자동 주입
   * - 서버가 X-New-Guest-Id 헤더를 반환하면 localStorage 갱신
   */
  const apiFetch = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    if (isLoggedIn()) {
      headers['Authorization'] = `Bearer ${getAuthToken()}`;
    } else {
      headers['X-Guest-Id'] = getGuestId();
    }

    const response = await fetch(url, { ...options, headers });

    // 서버 발급 guestId 수신 시 로컬 갱신
    const newGuestId = response.headers.get('X-New-Guest-Id');
    if (newGuestId) {
      localStorage.setItem(GUEST_ID_KEY, newGuestId);
    }

    return response;
  };

  /**
   * 로그인 완료 후 비회원 데이터 서버 병합
   * 인증 처리 후 반드시 호출
   *
   * @param {string} token - 발급된 JWT
   */
  const mergeAfterLogin = async (token) => {
    const guestId = getGuestId();
    // 로컬에 guestId가 없으면 병합 불필요
    if (!guestId) return;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    try {
      // 장바구니 병합
      await fetch('/api/cart/merge', {
        method: 'POST',
        headers,
        body: JSON.stringify({ guest_id: guestId }),
      });

      // 위시리스트 병합
      await fetch('/api/wishlist/merge', {
        method: 'POST',
        headers,
        body: JSON.stringify({ guest_id: guestId }),
      });

      // 병합 완료 후 비회원 ID 제거
      clearGuestId();

      console.info('[GuestManager] 비회원 데이터 병합 완료');
    } catch (err) {
      console.warn('[GuestManager] 병합 중 오류 (무시됨):', err.message);
      // 병합 실패는 UX를 막지 않음 — 사용자는 로그인 정상 처리
    }
  };

  return { getGuestId, getAuthToken, isLoggedIn, apiFetch, mergeAfterLogin };
})();

export default GuestManager;
