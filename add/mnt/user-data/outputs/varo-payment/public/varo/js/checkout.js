/**
 * checkout.js
 * ─────────────────────────────────────────────────────────────────
 * 결제 페이지 전체 로직
 *
 * [플로우]
 * 1. sessionStorage에서 checkout_items 로드
 * 2. POST /api/checkout/preview → 금액 계산 (서버 가격 검증)
 * 3. 폼 유효성 검사
 * 4. POST /api/checkout → 주문 생성
 * 5. 완료 화면 / 주문번호 표시
 *
 * [비회원 특이사항]
 * - 이름, 이메일, 전화번호 필드 추가 표시
 * - 포인트 UI 숨김
 * - 결제 완료 후 주문조회 안내 (주문번호 + 이메일)
 */

'use strict';

import GuestManager from './guestManager.js';
import CartManager  from './cartManager.js';

// ── 전역 상태 ────────────────────────────────────────────────────
let previewData = null;
let isProcessing = false;

// ── DOM 참조 캐싱 ────────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ── 숫자 포맷 ────────────────────────────────────────────────────
const fmt = (n) => Number(n).toLocaleString('ko-KR');

// ── 초기화 ───────────────────────────────────────────────────────
const init = async () => {
  const rawItems = sessionStorage.getItem('varo_checkout_items');
  if (!rawItems) {
    showError('결제할 상품이 없습니다. 장바구니로 이동합니다.');
    setTimeout(() => { location.href = '/varo/cart.html'; }, 2000);
    return;
  }

  const checkoutItems = JSON.parse(rawItems);
  const isLoggedIn = GuestManager.isLoggedIn();

  // 비회원 전용 폼 표시
  if (!isLoggedIn) {
    $('#guest-info-section').style.display = 'block';
    $('#points-section').style.display = 'none';
  } else {
    fetchUserInfo();
  }

  // 금액 미리보기 요청
  await loadPreview(checkoutItems);
  renderOrderItems(checkoutItems);
  bindEvents();
};

// ── 회원 정보 로드 ───────────────────────────────────────────────
const fetchUserInfo = async () => {
  try {
    const res  = await GuestManager.apiFetch('/api/auth/me');
    const json = await res.json();
    if (json.success) {
      const u = json.data;
      $('#shipping-name').value  = u.name  || '';
      $('#shipping-phone').value = u.phone || '';
      $('#membership-badge').textContent  = u.membership || 'BASIC';
      $('#available-points').textContent  = fmt(u.points || 0);
      $('#max-points').textContent        = fmt(Math.floor((previewData?.afterDiscount || 0) * 0.5));
    }
  } catch (err) {
    console.warn('[Checkout] 회원 정보 로드 실패:', err);
  }
};

// ── 금액 미리보기 ────────────────────────────────────────────────
const loadPreview = async (items, pointsToUse = 0) => {
  try {
    const res = await GuestManager.apiFetch('/api/checkout/preview', {
      method: 'POST',
      body: JSON.stringify({
        items: items.map(i => ({
          product_id: i.product_id,
          quantity: i.quantity,
          size: i.size,
          color: i.color,
        })),
        points_to_use: pointsToUse,
      }),
    });
    const json = await res.json();

    if (!json.success) {
      showError(json.message);
      return;
    }

    previewData = json.data;
    renderSummary(previewData);
  } catch (err) {
    showError('금액 계산 중 오류가 발생했습니다.');
  }
};

// ── 주문 상품 렌더링 ─────────────────────────────────────────────
const renderOrderItems = (items) => {
  const container = $('#order-items-list');
  if (!container) return;

  container.innerHTML = items.map(item => `
    <div class="checkout-item">
      <div class="checkout-item__img">
        <img src="${item.product_image || '/varo/img/placeholder.png'}" alt="${item.product_name}" loading="lazy">
      </div>
      <div class="checkout-item__info">
        <p class="checkout-item__name">${item.product_name}</p>
        <p class="checkout-item__options">
          ${item.size  ? `<span>사이즈: ${item.size}</span>` : ''}
          ${item.color ? `<span>색상: ${item.color}</span>` : ''}
        </p>
        <p class="checkout-item__qty">수량: ${item.quantity}개</p>
      </div>
      <div class="checkout-item__price">
        ${fmt(item.unit_price * item.quantity)}원
      </div>
    </div>
  `).join('');
};

// ── 금액 요약 렌더링 ─────────────────────────────────────────────
const renderSummary = (data) => {
  const set = (id, val) => { const el = $(id); if (el) el.textContent = val; };

  set('#summary-total',    `${fmt(data.totalAmount)}원`);
  set('#summary-discount', data.discountAmount > 0 ? `-${fmt(data.discountAmount)}원` : '0원');
  set('#summary-shipping', data.shippingFee === 0 ? '무료' : `${fmt(data.shippingFee)}원`);
  set('#summary-points',   data.pointsUsed > 0 ? `-${fmt(data.pointsUsed)}원` : '0원');
  set('#summary-final',    `${fmt(data.finalAmount)}원`);

  if (data.discountRate > 0) {
    const badge = $('#discount-badge');
    if (badge) {
      badge.textContent = `${(data.discountRate * 100).toFixed(0)}% 멤버십 할인 적용`;
      badge.style.display = 'inline-flex';
    }
  }

  if (data.pointsEarned > 0) {
    set('#points-earned', `이 주문으로 ${fmt(data.pointsEarned)}P 적립 예정`);
  }
};

// ── 이벤트 바인딩 ────────────────────────────────────────────────
const bindEvents = () => {
  // 포인트 사용 입력 (실시간 금액 재계산)
  const pointsInput = $('#points-input');
  if (pointsInput) {
    let debounceTimer;
    pointsInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        const rawItems = JSON.parse(sessionStorage.getItem('varo_checkout_items') || '[]');
        await loadPreview(rawItems, Number(pointsInput.value) || 0);
      }, 400);
    });

    // 최대 포인트 사용 버튼
    $('#use-max-points')?.addEventListener('click', () => {
      const max = Math.floor((previewData?.afterDiscount || 0) * 0.5);
      const avail = Number($('#available-points')?.textContent.replace(/,/g, '')) || 0;
      pointsInput.value = Math.min(max, avail);
      pointsInput.dispatchEvent(new Event('input'));
    });
  }

  // 주소 검색 (카카오 우편번호 API)
  $('#addr-search-btn')?.addEventListener('click', openAddressSearch);

  // 결제 수단 선택
  $$('[name="payment-method"]').forEach(radio => {
    radio.addEventListener('change', () => {
      $$('.payment-method__item').forEach(el => el.classList.remove('is-selected'));
      radio.closest('.payment-method__item')?.classList.add('is-selected');
    });
  });

  // 배송지 = 주문자 정보 동일 체크박스
  $('#same-as-orderer')?.addEventListener('change', (e) => {
    if (e.target.checked) {
      const isGuest = !GuestManager.isLoggedIn();
      if (isGuest) {
        $('#shipping-name').value  = $('#guest-name-input').value;
        $('#shipping-phone').value = $('#guest-phone-input').value;
      } else {
        // 회원 정보는 이미 채워져 있음
      }
    }
  });

  // 주문하기 버튼
  $('#checkout-submit-btn')?.addEventListener('click', handleSubmit);
};

// ── 카카오 우편번호 API ───────────────────────────────────────────
const openAddressSearch = () => {
  if (typeof daum === 'undefined') {
    showError('주소 검색 서비스를 불러올 수 없습니다.');
    return;
  }
  new daum.Postcode({
    oncomplete: (data) => {
      $('#shipping-zipcode').value = data.zonecode;
      $('#shipping-address').value = data.roadAddress || data.jibunAddress;
      $('#shipping-detail').focus();
    },
  }).open();
};

// ── 폼 유효성 검사 ───────────────────────────────────────────────
const validateForm = () => {
  const errors = [];
  const isGuest = !GuestManager.isLoggedIn();

  if (isGuest) {
    if (!$('#guest-name-input')?.value.trim())  errors.push('주문자 이름을 입력해주세요');
    if (!$('#guest-phone-input')?.value.trim()) errors.push('주문자 전화번호를 입력해주세요');
    const email = $('#guest-email-input')?.value.trim();
    if (!email) {
      errors.push('주문자 이메일을 입력해주세요');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('이메일 형식이 올바르지 않습니다');
    }
  }

  if (!$('#shipping-name')?.value.trim())    errors.push('받는 분 이름을 입력해주세요');
  if (!$('#shipping-phone')?.value.trim())   errors.push('받는 분 전화번호를 입력해주세요');
  if (!$('#shipping-zipcode')?.value.trim()) errors.push('배송지 주소를 검색해주세요');

  const paymentMethod = $('[name="payment-method"]:checked')?.value;
  if (!paymentMethod) errors.push('결제 수단을 선택해주세요');

  if (!$('#terms-agree')?.checked) errors.push('구매조건 확인 및 결제 진행에 동의해주세요');

  return errors;
};

// ── 주문 제출 ────────────────────────────────────────────────────
const handleSubmit = async () => {
  if (isProcessing) return;

  const errors = validateForm();
  if (errors.length > 0) {
    showValidationErrors(errors);
    return;
  }

  isProcessing = true;
  setSubmitLoading(true);

  const rawItems = JSON.parse(sessionStorage.getItem('varo_checkout_items') || '[]');
  const isGuest  = !GuestManager.isLoggedIn();

  const payload = {
    items: rawItems.map(i => ({
      product_id: i.product_id,
      quantity:   i.quantity,
      size:       i.size,
      color:      i.color,
    })),
    shipping: {
      name:    $('#shipping-name').value.trim(),
      phone:   $('#shipping-phone').value.trim(),
      zipcode: $('#shipping-zipcode').value.trim(),
      address: $('#shipping-address').value.trim(),
      detail:  $('#shipping-detail').value.trim(),
      request: $('#delivery-request').value.trim(),
    },
    payment: {
      method: $('[name="payment-method"]:checked').value,
    },
    points_to_use: Number($('#points-input')?.value) || 0,
  };

  if (isGuest) {
    payload.guest_name  = $('#guest-name-input').value.trim();
    payload.guest_email = $('#guest-email-input').value.trim().toLowerCase();
    payload.guest_phone = $('#guest-phone-input').value.trim();
  }

  try {
    const res  = await GuestManager.apiFetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const json = await res.json();

    if (json.success) {
      sessionStorage.removeItem('varo_checkout_items');
      showOrderComplete(json.data, isGuest ? payload.guest_email : null);
      await CartManager.sync(); // 배지 갱신
    } else {
      showError(json.message || '주문 처리에 실패했습니다.');
    }
  } catch (err) {
    showError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
  } finally {
    isProcessing = false;
    setSubmitLoading(false);
  }
};

// ── UI 헬퍼 ─────────────────────────────────────────────────────
const setSubmitLoading = (loading) => {
  const btn = $('#checkout-submit-btn');
  if (!btn) return;
  btn.disabled = loading;
  btn.textContent = loading ? '처리 중...' : '주문하기';
};

const showValidationErrors = (errors) => {
  const container = $('#validation-errors');
  if (!container) { alert(errors.join('\n')); return; }
  container.innerHTML = errors.map(e => `<li>${e}</li>`).join('');
  container.style.display = 'block';
  container.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

const showError = (msg) => {
  const container = $('#checkout-error');
  if (container) {
    container.textContent = msg;
    container.style.display = 'block';
  } else {
    alert(msg);
  }
};

const showOrderComplete = (data, guestEmail = null) => {
  const mainEl     = $('#checkout-main');
  const completeEl = $('#checkout-complete');
  if (mainEl)     mainEl.style.display     = 'none';
  if (completeEl) completeEl.style.display = 'block';

  const setEl = (id, val) => { const el = $(id); if (el) el.textContent = val; };
  setEl('#complete-order-number', data.orderNumber);
  setEl('#complete-final-amount', `${fmt(data.finalAmount)}원`);
  if (data.pointsEarned > 0) setEl('#complete-points-earned', `${fmt(data.pointsEarned)}P 적립`);

  if (guestEmail) {
    const trackingInfo = $('#guest-tracking-info');
    if (trackingInfo) {
      trackingInfo.style.display = 'block';
      setEl('#complete-guest-email', guestEmail);
    }
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ── 페이지 로드 ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
