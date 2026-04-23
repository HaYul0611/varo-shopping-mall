/**
 * wishlistManager.js
 * ─────────────────────────────────────────────────────────────────
 * 비회원/회원 통합 위시리스트 상태 관리
 *
 * [비회원] 서버 guest_wishlists 테이블 사용 (TTL 30일)
 * [회원]   서버 wishlists 테이블 사용
 *
 * [사용 예]
 *   import WishlistManager from './wishlistManager.js';
 *   await WishlistManager.toggle(productId);
 *   WishlistManager.isWished(productId); // true/false
 */

'use strict';

import GuestManager from './guestManager.js';

const WishlistManager = (() => {
  let _wishedIds  = new Set();
  const _listeners = [];

  const API_BASE = '/api/wishlist';

  const emit     = () => _listeners.forEach(fn => fn(_wishedIds));
  const on       = (event, fn) => { if (event === 'change') _listeners.push(fn); };
  const isWished = (productId) => _wishedIds.has(Number(productId));

  // ── 하트 아이콘 전체 동기화 ──────────────────────────────────────
  const syncHeartIcons = () => {
    document.querySelectorAll('[data-wishlist-btn]').forEach(btn => {
      const id = Number(btn.dataset.productId);
      btn.classList.toggle('is-wished', _wishedIds.has(id));
      btn.setAttribute('aria-pressed', _wishedIds.has(id));
    });
  };

  // ── 배지 갱신 ────────────────────────────────────────────────────
  const updateBadge = () => {
    document.querySelectorAll('[data-wishlist-badge]').forEach(el => {
      const cnt = _wishedIds.size;
      el.textContent   = cnt > 99 ? '99+' : cnt;
      el.style.display = cnt > 0 ? 'flex' : 'none';
    });
  };

  // ── 서버 동기화 ──────────────────────────────────────────────────
  const sync = async () => {
    try {
      const res  = await GuestManager.apiFetch(API_BASE);
      const json = await res.json();
      if (json.success) {
        _wishedIds = new Set(json.data.map(i => Number(i.product_id)));
        syncHeartIcons();
        updateBadge();
        emit();
      }
    } catch (err) {
      console.error('[WishlistManager] sync 실패:', err);
    }
    return _wishedIds;
  };

  // ── 토글 (추가 / 제거) ───────────────────────────────────────────
  const toggle = async (productId) => {
    const id = Number(productId);

    // 낙관적 업데이트
    if (_wishedIds.has(id)) {
      _wishedIds.delete(id);
    } else {
      _wishedIds.add(id);
    }
    syncHeartIcons();
    updateBadge();
    emit();

    try {
      const res  = await GuestManager.apiFetch(API_BASE, {
        method: 'POST',
        body: JSON.stringify({ product_id: id }),
      });
      const json = await res.json();

      if (!json.success) {
        // 서버 실패 시 낙관적 업데이트 롤백
        if (_wishedIds.has(id)) _wishedIds.delete(id); else _wishedIds.add(id);
        syncHeartIcons();
        updateBadge();
        emit();
        return { success: false, message: json.message };
      }

      return { success: true, action: json.action };
    } catch (err) {
      await sync(); // 네트워크 오류 시 서버 상태로 복구
      return { success: false, message: '위시리스트 업데이트 실패' };
    }
  };

  return { on, isWished, sync, toggle };
})();

export default WishlistManager;
