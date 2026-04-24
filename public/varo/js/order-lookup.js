/**
 * order-lookup.js
 * ─────────────────────────────────────────────────────────────────
 * 비회원 주문 조회 로직
 */

'use strict';

import GuestManager from './guestManager.js';

const $ = (sel) => document.querySelector(sel);

const init = () => {
  const form = $('#orderLookupForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = $('#ordererName').value.trim();
    const orderNumber = $('#orderNumber').value.trim();
    const password = $('#orderPassword').value.trim();
    const btn = $('#lookupBtn');

    btn.textContent = '조회 중...';
    btn.disabled = true;

    try {
      const res = await fetch('/api/checkout/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, orderNumber, password })
      });

      const json = await res.json();

      if (json.success) {
        renderResult(json.data);
      } else {
        alert(json.message || '일치하는 주문 정보를 찾을 수 없습니다.');
      }
    } catch (err) {
      alert('네트워크 오류가 발생했습니다.');
    } finally {
      btn.textContent = '조회';
      btn.disabled = false;
    }
  });
};

const renderResult = (order) => {
  const resultContainer = $('#lookup-result');
  resultContainer.innerHTML = `
    <div class="order-status-badge">${getStatusLabel(order.order_status)}</div>
    <div class="order-summary-box">
      <div class="order-summary-row">
        <span>주문번호</span>
        <strong>${order.order_number}</strong>
      </div>
      <div class="order-summary-row">
        <span>결제금액</span>
        <strong>${Number(order.final_amount).toLocaleString()}원</strong>
      </div>
      <div class="order-summary-row">
        <span>배송지</span>
        <span>${order.shipping_address} ${order.shipping_detail || ''}</span>
      </div>
      <div class="order-summary-row">
        <span>받는 분</span>
        <span>${order.shipping_name}</span>
      </div>
    </div>
    <div style="margin-top:20px; text-align:center;">
       <a href="/varo/shop.html" class="btn btn--outline btn--sm">쇼핑 계속하기</a>
    </div>
  `;
  resultContainer.classList.remove('u-hidden');
};

const getStatusLabel = (status) => {
  const labels = {
    'confirmed': '결제 완료',
    'preparing': '배송 준비 중',
    'shipped': '배송 중',
    'delivered': '배송 완료',
    'cancelled': '주문 취소'
  };
  return labels[status] || status;
};

document.addEventListener('DOMContentLoaded', init);
