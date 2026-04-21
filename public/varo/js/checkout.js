// 경로: js/checkout.js
// VARO 2026 — 주문 결제 로직
'use strict';

import Utils from './utils.js';

const CheckoutPage = (() => {

  const init = () => {
    // 1. 주문 데이터 로드 (장바구니에서 연결되었다고 가정)
    renderOrderItems();

    // 2. 주소 검색 연결
    document.getElementById('searchZip')?.addEventListener('click', () => {
      Utils.showToast('주소 검색 기능은 준비 중입니다.', 'default');
    });

    // 3. 결제하기 버튼
    document.getElementById('btnPay')?.addEventListener('click', handlePayment);
  };

  const renderOrderItems = () => {
    const list = document.getElementById('orderItemsList');
    if (!list) return;

    // 데모 데이터를 위해 App.Cart 또는 로컬스토리지 참조
    const cart = (typeof App !== 'undefined' && App.Cart) ? App.Cart.getItems() : [];
    if (cart.length === 0) {
      list.innerHTML = '<p class="empty-msg">주문할 상품이 없습니다.</p>';
      updatePrice(0);
      return;
    }

    list.innerHTML = cart.map(item => `
      <div class="order-item-mini">
        <img src="${item.mainImg}" alt="${item.name}" class="order-item-mini__img" loading="lazy">
        <div class="order-item-mini__info">
          <p class="order-item-mini__name">${item.name}</p>
          <p class="order-item-mini__meta">${item.size} / ${item.color} / ${item.quantity}개</p>
          <p class="order-item-mini__price">${(item.price * item.quantity).toLocaleString()}원</p>
        </div>
      </div>
    `).join('');

    const subtotal = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    updatePrice(subtotal);
  };

  const updatePrice = (subtotal) => {
    const shipping = subtotal > 50000 || subtotal === 0 ? 0 : 3000;
    const total = subtotal + shipping;

    const prodPriceEl = document.getElementById('totalProductPrice');
    const shipFeeEl = document.getElementById('shippingFee');
    const finalPriceEl = document.getElementById('finalOrderPrice');
    const payBtnAmount = document.getElementById('payAmount');

    if (prodPriceEl) prodPriceEl.textContent = subtotal.toLocaleString() + '원';
    if (shipFeeEl) shipFeeEl.textContent = (shipping === 0 ? '무료' : shipping.toLocaleString() + '원');
    if (finalPriceEl) finalPriceEl.textContent = total.toLocaleString() + '원';
    if (payBtnAmount) payBtnAmount.textContent = total.toLocaleString() + '원';
  };

  const handlePayment = () => {
    const agreeAll = document.getElementById('agreeAll')?.checked;
    const agreeTerms = document.getElementById('agreeTerms')?.checked;
    const agreePrivacy = document.getElementById('agreePrivacy')?.checked;

    if (!agreeAll && (!agreeTerms || !agreePrivacy)) {
      Utils.showToast('이용 약관에 모두 동의해 주세요.', 'error');
      return;
    }

    Utils.showToast('결제가 완료되었습니다! 주문 내역으로 이동합니다.', 'success');

    // 장바구니 비우기 (데모)
    if (typeof App !== 'undefined' && App.Cart) App.Cart.clear();

    setTimeout(() => {
      location.replace('./mypage.html');
    }, 2000);
  };

  return { init };
})();

document.addEventListener('DOMContentLoaded', CheckoutPage.init);
