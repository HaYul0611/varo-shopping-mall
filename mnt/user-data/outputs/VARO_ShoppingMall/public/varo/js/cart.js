// 경로: js/cart.js — VARO 장바구니 (백엔드 API 연동)
'use strict';

const CartPage = (() => {
  const CFG   = window.VARO_CONFIG || {};
  const FEE   = CFG.DELIVERY_FEE         || 3000;
  const FREE  = CFG.FREE_SHIP_THRESHOLD  || 50000;

  let cartItems = []; // [{id, qty, size, color, product_id, name, price, sale_price, main_img}]

  /* ── 데이터 로드 ────────────────────────── */
  const loadCart = async () => {
    try {
      if (window.API?.auth.isLoggedIn()) {
        cartItems = await API.cart.get();
        // API 응답 필드 정규화
        cartItems = cartItems.map(i => ({
          ...i,
          price: i.sale_price || i.price,
          mainImg: i.main_img,
        }));
      } else {
        // 비로그인: localStorage 폴백
        cartItems = Utils?.storage.get('varo_cart') || [];
      }
    } catch {
      cartItems = Utils?.storage.get('varo_cart') || [];
    }
    render();
  };

  /* ── 렌더 ───────────────────────────────── */
  const render = () => {
    const listEl    = document.getElementById('cartList');
    const emptyEl   = document.getElementById('cartEmpty');
    const layoutEl  = document.getElementById('cartLayout');
    if (!listEl) return;

    if (!cartItems.length) {
      if (emptyEl)  emptyEl.hidden  = false;
      if (layoutEl) layoutEl.hidden = true;
      return;
    }
    if (emptyEl)  emptyEl.hidden  = true;
    if (layoutEl) layoutEl.hidden = false;

    const fmt = n => n.toLocaleString('ko-KR') + '원';

    listEl.innerHTML = '';
    cartItems.forEach((item, idx) => {
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML = `
        <label class="cart-item__check"><input type="checkbox" checked data-idx="${idx}" aria-label="${item.name} 선택"></label>
        <div class="cart-item__img-wrap">
          <img class="cart-item__img" src="${item.mainImg || item.main_img}" alt="${item.name}" loading="lazy" width="80" height="107">
        </div>
        <div class="cart-item__info">
          <p class="cart-item__brand">VARO</p>
          <p class="cart-item__name">${item.name}</p>
          <p class="cart-item__options">색상: ${item.color} / 사이즈: ${item.size}</p>
          <div class="cart-item__bottom">
            <div class="cart-item__qty">
              <button class="cart-qty-btn" data-idx="${idx}" data-action="minus" type="button">−</button>
              <span class="cart-qty-val">${item.qty}</span>
              <button class="cart-qty-btn" data-idx="${idx}" data-action="plus" type="button">+</button>
            </div>
            <span class="cart-item__price">${fmt(item.price * item.qty)}</span>
          </div>
        </div>
        <button class="cart-item__remove" data-idx="${idx}" data-id="${item.id}" type="button" aria-label="삭제">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      `;
      listEl.appendChild(li);
    });

    // 이벤트 위임
    listEl.onclick = async (e) => {
      const btn = e.target.closest('[data-action],.cart-item__remove');
      if (!btn) return;
      const idx  = parseInt(btn.dataset.idx);
      const id   = btn.dataset.id;
      const item = cartItems[idx];
      if (!item) return;

      if (btn.dataset.action === 'plus') {
        item.qty++;
        if (API.auth.isLoggedIn() && id) await API.cart.update(id, item.qty).catch(() => {});
      } else if (btn.dataset.action === 'minus') {
        if (item.qty > 1) {
          item.qty--;
          if (API.auth.isLoggedIn() && id) await API.cart.update(id, item.qty).catch(() => {});
        }
      } else if (btn.classList.contains('cart-item__remove')) {
        if (API.auth.isLoggedIn() && id) await API.cart.remove(id).catch(() => {});
        cartItems.splice(idx, 1);
        syncLocalStorage();
      }
      syncLocalStorage();
      render();
    };

    updateSummary();
  };

  const syncLocalStorage = () => {
    Utils?.storage.set('varo_cart', cartItems);
    App?.Cart?.updateBadge?.();
  };

  /* ── 금액 요약 ──────────────────────────── */
  const updateSummary = () => {
    const checked = cartItems.filter((_, i) => {
      const cb = document.querySelector(`input[data-idx="${i}"]`);
      return cb ? cb.checked : true;
    });
    const sub      = checked.reduce((s, i) => s + i.price * i.qty, 0);
    const shipping = sub >= FREE ? 0 : (sub > 0 ? FEE : 0);
    const total    = sub + shipping;
    const fmt      = n => n.toLocaleString('ko-KR') + '원';

    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('summaryProductTotal', fmt(sub));
    set('summaryShipping', shipping === 0 ? (sub > 0 ? '무료' : '0원') : fmt(shipping));
    set('summaryTotal', fmt(total));
    set('summaryDiscount', '0원');

    const bar  = document.getElementById('freeShipBar');
    const text = document.getElementById('freeShipText');
    if (bar && text) {
      const pct = Math.min(100, (sub / FREE) * 100);
      bar.style.width = `${pct}%`;
      text.textContent = sub >= FREE ? '🎉 무료배송 적용!' : `${fmt(FREE - sub)} 더 담으면 무료배송`;
    }
    // 주문 데이터 세션 저장 (checkout에서 활용)
    sessionStorage.setItem('varo_checkout_items', JSON.stringify(checked));
    sessionStorage.setItem('varo_checkout_total', JSON.stringify({ sub, shipping, total }));
  };

  const init = () => {
    if (!document.getElementById('cartList')) return;
    loadCart();
    // 전체선택
    document.getElementById('cartCheckAll')?.addEventListener('change', (e) => {
      document.querySelectorAll('#cartList input[type=checkbox]').forEach(cb => { cb.checked = e.target.checked; });
      updateSummary();
    });
    // 주문하기
    document.getElementById('cartCheckout')?.addEventListener('click', () => {
      if (!API.auth.isLoggedIn()) { location.href = './login.html?redirect=./checkout.html'; return; }
      location.href = './checkout.html';
    });
  };

  return { init };
})();

document.addEventListener('DOMContentLoaded', CartPage.init);
