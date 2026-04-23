/**
 * cartManager.js
 * ─────────────────────────────────────────────────────────────────
 * 비회원/회원 통합 장바구니 상태 관리 + UI 바인딩
 *
 * [기능]
 * - 장바구니 조회, 추가, 수량 변경, 삭제, 전체 비우기
 * - 배지 카운트 실시간 갱신
 * - 낙관적 업데이트 (UI 즉시 반영 → 서버 동기화)
 *
 * [사용 예]
 *   import CartManager from './cartManager.js';
 *   await CartManager.addItem({ product_id: 1, quantity: 2, size: 'M' });
 *   CartManager.on('change', ({ items, summary }) => { ... });
 */

'use strict';

import GuestManager from './guestManager.js';

const CartManager = (() => {
  let _state  = { items: [], summary: {} };
  const _listeners = [];

  const API_BASE = '/api/cart';

  // ── 이벤트 ──────────────────────────────────────────────────────
  const emit   = () => _listeners.forEach(fn => fn(_state));
  const on     = (event, fn) => { if (event === 'change') _listeners.push(fn); };
  const getState = () => ({ ..._state });

  // ── 배지 카운트 갱신 ─────────────────────────────────────────────
  const updateBadge = (count) => {
    document.querySelectorAll('[data-cart-badge]').forEach(el => {
      el.textContent  = count > 99 ? '99+' : count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  };

  // ── 서버에서 최신 장바구니 동기화 ────────────────────────────────
  const sync = async () => {
    try {
      const res  = await GuestManager.apiFetch(API_BASE);
      const json = await res.json();
      if (json.success) {
        _state = json.data;
        updateBadge(_state.items.length);
        emit();
      }
    } catch (err) {
      console.error('[CartManager] sync 실패:', err);
    }
    return _state;
  };

  // ── 상품 추가 ────────────────────────────────────────────────────
  const addItem = async ({ product_id, quantity = 1, size = null, color = null }) => {
    try {
      const res  = await GuestManager.apiFetch(API_BASE, {
        method: 'POST',
        body: JSON.stringify({ product_id, quantity, size, color }),
      });
      const json = await res.json();
      if (json.success) {
        await sync();
        return { success: true };
      }
      return { success: false, message: json.message };
    } catch (err) {
      return { success: false, message: '장바구니 추가 실패' };
    }
  };

  // ── 수량 변경 ────────────────────────────────────────────────────
  const updateQuantity = async (cartId, quantity) => {
    if (quantity < 1 || quantity > 99) return { success: false, message: '수량 범위 오류' };

    // 낙관적 업데이트
    _state.items = _state.items.map(i => i.id === cartId ? { ...i, quantity } : i);
    emit();

    try {
      const res  = await GuestManager.apiFetch(`${API_BASE}/${cartId}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity }),
      });
      const json = await res.json();
      if (!json.success) {
        await sync(); // 서버와 불일치 시 롤백
        return { success: false, message: json.message };
      }
      await sync();
      return { success: true };
    } catch (err) {
      await sync();
      return { success: false, message: '수량 변경 실패' };
    }
  };

  // ── 단일 삭제 ────────────────────────────────────────────────────
  const removeItem = async (cartId) => {
    _state.items = _state.items.filter(i => i.id !== cartId);
    updateBadge(_state.items.length);
    emit();

    try {
      await GuestManager.apiFetch(`${API_BASE}/${cartId}`, { method: 'DELETE' });
      await sync();
      return { success: true };
    } catch (err) {
      await sync();
      return { success: false };
    }
  };

  // ── 전체 비우기 ──────────────────────────────────────────────────
  const clearCart = async () => {
    try {
      const res  = await GuestManager.apiFetch(API_BASE, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        _state = { items: [], summary: {} };
        updateBadge(0);
        emit();
      }
      return json;
    } catch (err) {
      return { success: false };
    }
  };

  // ── 선택 항목 체크아웃 준비 ──────────────────────────────────────
  const prepareCheckout = (selectedIds = null) => {
    const items = selectedIds
      ? _state.items.filter(i => selectedIds.includes(i.id))
      : _state.items;

    sessionStorage.setItem('varo_checkout_items', JSON.stringify(items));
    return items;
  };

  return { on, getState, sync, addItem, updateQuantity, removeItem, clearCart, prepareCheckout };
})();

export default CartManager;
