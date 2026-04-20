/**
 * js/cart.js — VARO 쇼핑몰 장바구니 페이지 기능 고도화
 * 
 * - App.Cart 모듈 연동
 * - 수량 조절, 삭제, 전체 선택 기능
 * - 배송비 및 총액 실시간 계산
 * - 쿠폰(VARO10) 할인 로직 적용
 */

import Utils from './utils.js';

const CartPage = (() => {
  const { VARO_CONFIG } = window;

  const state = {
    discountRate: 0,
    appliedCoupon: null
  };

  const refs = {
    list: document.getElementById('cartList'),
    empty: document.getElementById('cartEmpty'),
    layout: document.getElementById('cartLayout'),

    // Summary
    prodTotal: document.getElementById('summaryProductTotal'),
    shipping: document.getElementById('summaryShipping'),
    discount: document.getElementById('summaryDiscount'),
    discountRow: document.getElementById('discountRow'),
    finalTotal: document.getElementById('summaryTotal'),

    // Tools
    checkAll: document.getElementById('cartCheckAll'),
    deleteSelected: document.getElementById('cartDeleteSelected'),
    checkoutBtn: document.getElementById('cartCheckout'),

    // Coupon
    couponInput: document.getElementById('couponInput'),
    applyCoupon: document.getElementById('applyCoupon'),
    couponMsg: document.getElementById('couponMessage'),

    // Free Shipping Progress
    freeShipBar: document.getElementById('freeShipBar'),
    freeShipText: document.getElementById('freeShipText'),
  };

  const init = () => {
    if (!refs.list) return;
    render();
    bindEvents();
  };

  const render = () => {
    const items = window.App?.Cart.getItems() || [];

    if (items.length === 0) {
      refs.empty.hidden = false;
      refs.layout.hidden = true;
      return;
    }

    refs.empty.hidden = true;
    refs.layout.hidden = false;

    // 리스트 렌더링
    refs.list.innerHTML = items.map((item, idx) => `
      <li class="cart-item" data-index="${idx}">
        <div class="cart-item__check">
          <input type="checkbox" checked class="item-checkbox">
        </div>
        <div class="cart-item__img" onclick="location.href='./product.html?id=${item.productId}'">
          <img src="${item.mainImg}" alt="${item.name}">
        </div>
        <div class="cart-item__info">
          <p class="cart-item__brand">${item.brand}</p>
          <h3 class="cart-item__name">${item.name}</h3>
          <p class="cart-item__option">옵션: ${item.color} / ${item.size}</p>
          <div class="cart-item__qty-wrap">
            <button class="qty-btn" data-action="minus" data-index="${idx}">${Utils.icon('minus')}</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" data-action="plus" data-index="${idx}">${Utils.icon('plus')}</button>
          </div>
        </div>
        <div class="cart-item__price-block">
          <span class="cart-item__price">${Utils.formatPrice(item.price * item.qty)}</span>
          <button class="cart-item__remove" data-index="${idx}">${Utils.icon('x')}</button>
        </div>
      </li>
    `).join('');

    updateSummary();
  };

  const updateSummary = () => {
    const items = window.App?.Cart.getItems() || [];
    const subtotal = items.reduce((acc, cur) => acc + (cur.price * cur.qty), 0);

    const shipping = subtotal >= VARO_CONFIG.FREE_SHIP_THRESHOLD ? 0 : VARO_CONFIG.DELIVERY_FEE;
    const discount = Math.floor(subtotal * state.discountRate);
    const total = subtotal - discount + shipping;

    refs.prodTotal.textContent = Utils.formatPrice(subtotal);
    refs.shipping.textContent = shipping === 0 ? '무료' : Utils.formatPrice(shipping);

    if (discount > 0) {
      refs.discountRow.style.display = 'flex';
      refs.discount.textContent = `-${Utils.formatPrice(discount)}`;
    } else {
      refs.discountRow.style.display = 'none';
    }

    refs.finalTotal.textContent = Utils.formatPrice(total);

    // 무료배송 진행 바 업데이트
    const progress = Math.min((subtotal / VARO_CONFIG.FREE_SHIP_THRESHOLD) * 100, 100);
    refs.freeShipBar.style.width = `${progress}%`;
    if (subtotal >= VARO_CONFIG.FREE_SHIP_THRESHOLD) {
      refs.freeShipText.textContent = '🎉 현재 무료배송 혜택을 받고 있습니다!';
    } else {
      const remaining = VARO_CONFIG.FREE_SHIP_THRESHOLD - subtotal;
      refs.freeShipText.textContent = `${Utils.formatPrice(remaining)}원 추가 시 무료배송`;
    }
  };

  const bindEvents = () => {
    // 수량 조절 및 삭제 (이벤트 위임)
    refs.list.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      const index = parseInt(btn.dataset.index);

      if (btn.classList.contains('qty-btn')) {
        const delta = btn.dataset.action === 'plus' ? 1 : -1;
        window.App.Cart.updateQty(index, delta);
        render();
      }

      if (btn.classList.contains('cart-item__remove')) {
        window.App.Cart.removeItem(index);
        render();
      }
    });

    // 전체 선택
    refs.checkAll?.addEventListener('change', (e) => {
      const checked = e.target.checked;
      refs.list.querySelectorAll('.item-checkbox').forEach(cb => cb.checked = checked);
    });

    // 선택 삭제
    refs.deleteSelected?.addEventListener('click', () => {
      const checkboxes = Array.from(refs.list.querySelectorAll('.item-checkbox'));
      const indicesToRemove = checkboxes
        .map((cb, idx) => cb.checked ? idx : -1)
        .filter(idx => idx !== -1)
        .reverse(); // 인덱스 밀림 방지

      if (indicesToRemove.length === 0) {
        Utils.showToast('삭제할 상품을 선택해 주세요.', 'error');
        return;
      }

      indicesToRemove.forEach(idx => window.App.Cart.removeItem(idx));
      render();
      Utils.showToast('선택한 상품이 삭제되었습니다.');
    });

    // 쿠폰 적용
    refs.applyCoupon?.addEventListener('click', () => {
      const code = refs.couponInput.value.trim().toUpperCase();
      if (code === 'VARO10') {
        state.discountRate = 0.1;
        state.appliedCoupon = code;
        refs.couponMsg.textContent = '10% 할인이 적용되었습니다. 🏷';
        refs.couponMsg.className = 'coupon-message success';
        refs.couponMsg.hidden = false;
        updateSummary();
        Utils.showToast('쿠폰이 정상적으로 적용되었습니다.');
      } else {
        Utils.showToast('유효하지 않은 쿠폰 코드입니다.', 'error');
      }
    });

    // 주문하기
    refs.checkoutBtn?.addEventListener('click', () => {
      Utils.showToast('결제 시스템으로 이동합니다...', 'success');
      setTimeout(() => {
        location.href = './checkout.html';
      }, 1000);
    });
  };

  return { init };
})();

document.addEventListener('DOMContentLoaded', CartPage.init);
