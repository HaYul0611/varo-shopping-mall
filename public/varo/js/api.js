// 경로: js/api.js
// VARO 백엔드 API 통신 모듈
// 모든 fetch는 이 파일을 통해서만 진행합니다.

'use strict';

const API = (() => {
  const BASE = window.location.port === '5500' ? 'http://localhost:3000/api' : '/api';
  const TOKEN_KEY = 'varo_token';

  /* ── 토큰 관리 ──────────────────────────── */
  const getToken = () => localStorage.getItem(TOKEN_KEY);
  const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
  const removeToken = () => localStorage.removeItem(TOKEN_KEY);

  /* ── 공통 fetch ─────────────────────────── */
  const req = async (method, path, body = null, auth = false) => {
    const headers = { 'Content-Type': 'application/json' };
    if (auth) {
      const token = getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);
    try {
      const res = await fetch(BASE + path, opts);
      const isJson = res.headers.get('content-type')?.includes('application/json');
      if (isJson) {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || '요청 실패');
        return data;
      } else {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return await res.text();
      }
    } catch (err) {
      if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
        console.warn(`[API Dev Warning] 백엔드 서버(localhost:3000)가 응답하지 않습니다. 데이터 없이 시뮬레이션 모드로 실행합니다.`);
      } else {
        console.error(`[API Error] ${method} ${path}:`, err.message);
      }
      // 호출부에서 에러로 인해 런타임 중단이 발생하지 않도록 안전한 빈 객체 반환
      return { success: false, error: err.message, products: [], data: [] };
    }
  };

  /* ══════════════════════════════════════════
     인증
  ══════════════════════════════════════════ */
  const auth = {
    register: (data) => req('POST', '/auth/register', data),
    login: async (email, password) => {
      const res = await req('POST', '/auth/login', { email, password });
      setToken(res.token);
      localStorage.setItem('varo_user', JSON.stringify(res.user));
      return res;
    },
    logout: () => {
      removeToken();
      localStorage.removeItem('varo_user');
    },
    me: () => req('GET', '/auth/me', null, true),
    isLoggedIn: () => !!getToken(),
    getUser: () => {
      try { return JSON.parse(localStorage.getItem('varo_user')); }
      catch { return null; }
    },
  };

  /* ══════════════════════════════════════════
     상품
  ══════════════════════════════════════════ */
  const products = {
    getAll: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return req('GET', `/products${q ? '?' + q : ''}`);
    },
    getById: (id) => req('GET', `/products/${id}`),
    create: (data) => req('POST', '/products', data, true),
    update: (id, data) => req('PUT', `/products/${id}`, data, true),
    delete: (id) => req('DELETE', `/products/${id}`, null, true),
  };

  /* ══════════════════════════════════════════
     장바구니
  ══════════════════════════════════════════ */
  const cart = {
    get: () => req('GET', '/cart', null, true),
    add: (product_id, size, color, qty = 1) =>
      req('POST', '/cart', { product_id, size, color, qty }, true),
    update: (id, qty) => req('PUT', `/cart/${id}`, { qty }, true),
    remove: (id) => req('DELETE', `/cart/${id}`, null, true),
    clear: () => req('DELETE', '/cart', null, true),
  };

  /* ══════════════════════════════════════════
     주문
  ══════════════════════════════════════════ */
  const orders = {
    create: (data) => req('POST', '/orders', data, true),
    getAll: () => req('GET', '/orders', null, true),
    getById: (id) => req('GET', `/orders/${id}`, null, true),
    updateStatus: (id, status) => req('PUT', `/orders/${id}/status`, { status }, true),
  };

  /* ══════════════════════════════════════════
     사용자
  ══════════════════════════════════════════ */
  const users = {
    getAll: () => req('GET', '/users', null, true),
    me: () => req('GET', '/users/me', null, true),
    update: (data) => req('PUT', '/users/me', data, true),
  };

  /* ══════════════════════════════════════════
     리뷰
  ══════════════════════════════════════════ */
  const reviews = {
    getByProduct: (productId) => req('GET', `/reviews?productId=${productId}`),
    create: (data) => req('POST', '/reviews', data, true),
  };

  /* ══════════════════════════════════════════
     로그인 상태에 따른 UI 자동 업데이트
  ══════════════════════════════════════════ */
  const syncUI = () => {
    const user = auth.getUser();
    // 헤더 멤버십 배지 업데이트
    const badge = document.querySelector('.member-badge-btn');
    if (badge && user) {
      const gradeMap = { basic: 'BASIC', silver: 'SILVER', gold: 'GOLD', vip: 'VIP' };
      badge.textContent = gradeMap[user.grade] || 'LOGIN';
    }
    // 로그인/비로그인 분기 UI
    document.querySelectorAll('[data-auth="logged-in"]').forEach(el => {
      el.style.display = user ? '' : 'none';
    });
    document.querySelectorAll('[data-auth="logged-out"]').forEach(el => {
      el.style.display = user ? 'none' : '';
    });
  };

  return { auth, products, cart, orders, users, reviews, syncUI, getToken };
})();

if (typeof window !== 'undefined') window.API = API;
