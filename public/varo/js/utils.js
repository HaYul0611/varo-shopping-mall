// 경로: js/utils.js
// 공통 유틸리티 함수 모음 — XSS 방지, 포맷터, DOM 헬퍼

'use strict';

const Utils = (() => {

  /* ── 가격 포맷 ─────────────────────────────── */
  const formatPrice = (n) =>
    n.toLocaleString('ko-KR') + '원';

  /* ── 할인율 계산 ────────────────────────────── */
  const discountRate = (original, sale) =>
    Math.round((1 - sale / original) * 100);

  /* ── XSS 방지: 텍스트 이스케이프 ─────────────
     innerHTML 대신 createTextNode 또는 이 함수를 활용합니다. */
  const escapeHTML = (str) => {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(String(str)));
    return div.innerHTML;
  };

  /* ── 안전한 텍스트 삽입 ────────────────────── */
  const safeText = (el, text) => {
    el.textContent = String(text);
  };

  /* ── 요소 생성 헬퍼 ────────────────────────── */
  const el = (tag, cls = '', attrs = {}) => {
    const elem = document.createElement(tag);
    if (cls) elem.className = cls;
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'data') {
        Object.entries(v).forEach(([dk, dv]) =>
          elem.dataset[dk] = dv
        );
      } else {
        elem.setAttribute(k, v);
      }
    });
    return elem;
  };

  /* ── SVG 아이콘 반환 ────────────────────────── */
  const icons = {
    chevronRight: `<svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>`,
    chevronLeft: `<svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>`,
    chevronDown: `<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>`,
    heart: `<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    bag: `<svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
    search: `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    user: `<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    x: `<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    arrowRight: `<svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
    messageCircle: `<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    grid: `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    list: `<svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
    check: `<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`,
    star: `<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" stroke="none"/></svg>`,
    trash: `<svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
    minus: `<svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    plus: `<svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    eye: `<svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
    eyeOff: `<svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
    send: `<svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
    shoppingBag: `<svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
    filter: `<svg viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
  };

  /* ── 아이콘 HTML 반환 ───────────────────────── */
  const icon = (name) => {
    const svg = icons[name] || icons.x;
    return svg
      .replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" ');
  };

  /* ── 로컬스토리지 (안전 래퍼) ──────────────── */
  const storage = {
    get: (key) => {
      try { return JSON.parse(localStorage.getItem(key)); }
      catch { return null; }
    },
    set: (key, val) => {
      try { localStorage.setItem(key, JSON.stringify(val)); return true; }
      catch { return false; }
    },
    remove: (key) => {
      try { localStorage.removeItem(key); return true; }
      catch { return false; }
    },
  };

  /* ── 토스트 알림 ────────────────────────────── */
  const showToast = (msg, type = 'default', duration = 3000) => {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast${type !== 'default' ? ' toast--' + type : ''}`;

    const iconEl = document.createElement('span');
    iconEl.innerHTML = type === 'success' ? icon('check') :
      type === 'error' ? icon('x') : icon('shoppingBag');
    toast.appendChild(iconEl);

    const textEl = document.createElement('span');
    textEl.textContent = msg;  // XSS safe
    toast.appendChild(textEl);

    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('toast--out');
      toast.addEventListener('animationend', () => toast.remove(), { once: true });
    }, duration);
  };

  /* ── 디바운스 ───────────────────────────────── */
  const debounce = (fn, delay = 300) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  /* ── 스크롤 잠금 ───────────────────────────── */
  const lockScroll = () => {
    document.body.style.overflow = 'hidden';
  };
  const unlockScroll = () => {
    document.body.style.overflow = '';
  };

  /* ── 숫자 포맷 (좋아요 등) ─────────────────── */
  const formatCount = (n) => {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return String(n);
  };

  return {
    formatPrice, discountRate, escapeHTML, safeText,
    el, icon, storage, showToast, debounce,
    lockScroll, unlockScroll, formatCount,
  };
})();

window.Utils = Utils;
