// 경로: js/pages.js
// community.html / cart.html / login.html / signup.html 공통 로드
// ⚠ Fix 이력:
//   — CommunityPage: 셀렉터 전면 교체 (#postModal 구조 반영), 탭 필터, 더보기
//   — CartPage: #cartList 렌더, #summaryProductTotal 등 ID 기반 선택,
//               전체선택 체크박스, 무료배송 프로그레스바, 할인 표시
//   — AuthPage: ID 기반 선택 (#loginForm/#signupForm), .pw-toggle[data-target] 방식,
//               비밀번호 강도계 (#pwStrength), 전체동의 (#termsAll), 버튼 click 이벤트

'use strict';

/* ════════════════════════════════════════════════
   CommunityPage
   — community.html 에서만 활성화
════════════════════════════════════════════════ */
const CommunityPage = (() => {
  const { COMMUNITY_POSTS, PRODUCTS } = window.VARO_DATA;
  const cfg = window.VARO_CONFIG;

  /* 상태 */
  let posts = COMMUNITY_POSTS.map(p => ({ ...p })); // 얕은 복사로 원본 보호
  let currentTab = 'all';
  let visibleCount = cfg ? cfg.COMMUNITY_PAGE_SIZE : 9;

  /* ── 게시물 카드 빌드 ── */
  const buildPost = (post) => {
    const item = Utils.el('div', 'community-post', { data: { id: post.id }, tabindex: '0', role: 'button', 'aria-label': `${post.username}의 게시물 열기` });

    const img = Utils.el('img', 'community-post__img', {
      src: post.img,
      alt: `${post.username}의 착샷`,
      loading: 'lazy',
      width: '600',
      height: '750',
    });

    const overlay = Utils.el('div', 'community-post__overlay', { 'aria-hidden': 'true' });
    const stats = Utils.el('div', 'community-post__stats');
    const likeStat = Utils.el('span', 'community-post__stat');
    likeStat.innerHTML = Utils.icon('heart');
    const likeNum = Utils.el('span');
    likeNum.textContent = Utils.formatCount(post.likes);
    likeStat.appendChild(likeNum);

    const cmtStat = Utils.el('span', 'community-post__stat');
    cmtStat.innerHTML = Utils.icon('messageCircle');
    const cmtNum = Utils.el('span');
    cmtNum.textContent = Utils.formatCount(post.comments);
    cmtStat.appendChild(cmtNum);
    stats.append(likeStat, cmtStat);

    const userRow = Utils.el('div', 'community-post__user');
    const avatar = Utils.el('img', 'community-post__avatar', {
      src: post.avatar, alt: post.username, loading: 'lazy', width: '28', height: '28',
    });
    const username = Utils.el('span', 'community-post__username');
    username.textContent = post.username;
    userRow.append(avatar, username);
    overlay.append(stats, userRow);
    item.append(img, overlay);

    item.addEventListener('click', () => openModal(post));
    item.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(post); } });

    return item;
  };

  /* ── 그리드 렌더 ── */
  const renderGrid = () => {
    const grid = document.getElementById('communityGrid');
    const btn = document.getElementById('communityLoadMore');
    if (!grid) return;

    const filtered = currentTab === 'all'
      ? posts
      : posts.filter(p => p.styles?.includes(currentTab));

    grid.innerHTML = '';
    const visible = filtered.slice(0, visibleCount);
    visible.forEach(p => grid.appendChild(buildPost(p)));

    if (btn) btn.hidden = visibleCount >= filtered.length;
  };

  /* ── 모달 열기 ── */
  const openModal = (post) => {
    const modal = document.getElementById('postModal');
    if (!modal) return;

    /* 이미지 */
    const imgEl = document.getElementById('postModalImg');
    if (imgEl) { imgEl.src = post.img; imgEl.alt = `${post.username}의 착샷`; }

    /* 유저 정보 */
    const avatarEl = document.getElementById('postModalAvatar');
    if (avatarEl) {
      avatarEl.innerHTML = '';
      const avImg = Utils.el('img', '', { src: post.avatar, alt: post.username, loading: 'lazy', width: '40', height: '40' });
      avatarEl.appendChild(avImg);
    }
    const usernameEl = document.getElementById('postModalUsername');
    const dateEl = document.getElementById('postModalDate');
    if (usernameEl) usernameEl.textContent = post.username;
    if (dateEl) dateEl.textContent = post.timeAgo;

    /* 캡션 */
    const textEl = document.getElementById('postModalText');
    if (textEl) textEl.textContent = post.caption;

    /* 스타일 태그 */
    const tagsEl = document.getElementById('postModalTags');
    if (tagsEl) {
      tagsEl.innerHTML = '';
      (post.styles ?? []).forEach(s => {
        const chip = Utils.el('span', 'post-tag');
        chip.textContent = `#${s}`;
        tagsEl.appendChild(chip);
      });
    }

    /* 좋아요 */
    const likeBtn = document.getElementById('postModalLike');
    const likeCount = document.getElementById('postModalLikeCount');
    if (likeBtn && likeCount) {
      const updateLike = () => {
        likeBtn.classList.toggle('post-like-btn--liked', post.isLiked);
        likeCount.textContent = Utils.formatCount(post.likes);
      };
      likeBtn.onclick = () => {
        post.isLiked = !post.isLiked;
        post.likes += post.isLiked ? 1 : -1;
        updateLike();
        renderGrid(); /* 카드 카운트도 동기화 */
      };
      updateLike();
    }

    /* 태그 상품 */
    const productsEl = document.getElementById('postModalProducts');
    const listEl = document.getElementById('postModalProductList');
    if (productsEl && listEl) {
      listEl.innerHTML = '';
      const tagged = (post.taggedProducts ?? [])
        .map(pid => PRODUCTS.find(p => p.id === pid))
        .filter(Boolean);

      productsEl.hidden = tagged.length === 0;
      tagged.forEach(p => {
        const chip = Utils.el('a', 'tagged-product-chip', { href: `./product.html?id=${p.id}` });
        const chipImg = Utils.el('img', 'tagged-product-chip__img', {
          src: p.mainImg, alt: p.name, loading: 'lazy', width: '48', height: '64',
        });
        const chipName = Utils.el('span', 'tagged-product-chip__name');
        chipName.textContent = p.name;
        const chipPrice = Utils.el('span', 'tagged-product-chip__price');
        chipPrice.textContent = Utils.formatPrice(p.salePrice ?? p.price);
        chip.append(chipImg, chipName, chipPrice);
        listEl.appendChild(chip);
      });
    }

    /* 모달 활성 */
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('is-open');
    Utils.lockScroll();
  };

  /* ── 모달 닫기 ── */
  const closeModal = () => {
    const modal = document.getElementById('postModal');
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('is-open');
    Utils.unlockScroll();
  };

  /* ── 탭 초기화 ── */
  const initTabs = () => {
    document.getElementById('communityTabs')?.querySelectorAll('.community-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.community-tab').forEach(t => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        currentTab = tab.dataset.tab;
        visibleCount = cfg ? cfg.COMMUNITY_PAGE_SIZE : 9;
        renderGrid();
      });
    });
  };

  /* ── 더보기 ── */
  const initLoadMore = () => {
    document.getElementById('communityLoadMore')?.addEventListener('click', () => {
      visibleCount += cfg ? cfg.COMMUNITY_LOAD_STEP : 6;
      renderGrid();
    });
  };

  const init = () => {
    if (!document.getElementById('communityGrid')) return;
    renderGrid();
    initTabs();
    initLoadMore();
    document.getElementById('postModalClose')?.addEventListener('click', closeModal);
    document.getElementById('postModalOverlay')?.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  };

  return { init };
})();

/* ════════════════════════════════════════════════
   CartPage
   — cart.html 에서만 활성화
════════════════════════════════════════════════ */
const CartPage = (() => {
  const cfg = window.VARO_CONFIG;
  const DELIVERY_FEE = cfg ? cfg.DELIVERY_FEE : 3000;
  const FREE_THRESH = cfg ? cfg.FREE_SHIP_THRESHOLD : 50000;

  let checkedIndices = new Set(); /* 선택된 항목 인덱스 */

  /* ── 전체 렌더 ── */
  const renderCart = () => {
    const items = App.Cart.getItems();
    const listEl = document.getElementById('cartList');
    const emptyEl = document.getElementById('cartEmpty');
    const layoutEl = document.getElementById('cartLayout');
    if (!listEl) return;

    if (items.length === 0) {
      if (emptyEl) emptyEl.hidden = false;
      if (layoutEl) layoutEl.hidden = true;
      return;
    }
    if (emptyEl) emptyEl.hidden = true;
    if (layoutEl) layoutEl.hidden = false;

    /* 선택 인덱스 초기화 (전체 선택) */
    if (checkedIndices.size === 0) {
      items.forEach((_, i) => checkedIndices.add(i));
    }
    /* 범위를 벗어난 인덱스 제거 */
    checkedIndices = new Set([...checkedIndices].filter(i => i < items.length));

    listEl.innerHTML = '';
    items.forEach((item, index) => {
      const row = Utils.el('li', 'cart-item', { data: { index: String(index) } });

      /* 체크박스 */
      const checkWrap = Utils.el('label', 'cart-item__check');
      const checkInput = Utils.el('input', '', { type: 'checkbox', 'aria-label': `${item.name} 선택` });
      checkInput.checked = checkedIndices.has(index);
      checkInput.addEventListener('change', () => {
        if (checkInput.checked) checkedIndices.add(index);
        else checkedIndices.delete(index);
        syncAllCheckbox();
        updateSummary();
      });
      checkWrap.appendChild(checkInput);

      /* 이미지 */
      const imgWrap = Utils.el('div', 'cart-item__img-wrap');
      const img = Utils.el('img', 'cart-item__img', {
        src: item.mainImg ?? 'https://picsum.photos/seed/default/90/120',
        alt: item.name, loading: 'lazy', width: '90', height: '120',
      });
      imgWrap.appendChild(img);

      /* 정보 */
      const info = Utils.el('div', 'cart-item__info');
      const brand = Utils.el('p', 'cart-item__brand'); brand.textContent = item.brand;
      const name = Utils.el('p', 'cart-item__name'); name.textContent = item.name;
      const opts = Utils.el('p', 'cart-item__options');
      opts.textContent = `색상: ${item.color} / 사이즈: ${item.size}`;

      const bottom = Utils.el('div', 'cart-item__bottom');

      /* 수량 */
      const qtyWrap = Utils.el('div', 'cart-item__qty');
      const minusBtn = Utils.el('button', 'cart-qty-btn', { type: 'button', 'aria-label': '수량 감소' });
      const qtyVal = Utils.el('span', 'cart-qty-val');
      const plusBtn = Utils.el('button', 'cart-qty-btn', { type: 'button', 'aria-label': '수량 증가' });
      minusBtn.textContent = '−';
      plusBtn.textContent = '+';
      qtyVal.textContent = String(item.qty);
      minusBtn.disabled = item.qty <= 1;
      minusBtn.addEventListener('click', () => {
        App.Cart.updateQty(index, -1);
        renderCart();
      });
      plusBtn.addEventListener('click', () => {
        App.Cart.updateQty(index, 1);
        renderCart();
      });
      qtyWrap.append(minusBtn, qtyVal, plusBtn);

      /* 가격 */
      const priceEl = Utils.el('span', 'cart-item__price');
      priceEl.textContent = Utils.formatPrice(item.price * item.qty);
      bottom.append(qtyWrap, priceEl);

      /* 삭제 버튼 */
      const removeBtn = Utils.el('button', 'cart-item__remove', { type: 'button', 'aria-label': `${item.name} 삭제` });
      removeBtn.innerHTML = Utils.icon('x');
      removeBtn.addEventListener('click', () => {
        checkedIndices.delete(index);
        App.Cart.removeItem(index);
        renderCart();
      });

      info.append(brand, name, opts, bottom);
      row.append(checkWrap, imgWrap, info, removeBtn);
      listEl.appendChild(row);
    });

    syncAllCheckbox();
    updateSummary();
  };

  /* ── 전체선택 체크박스 동기화 ── */
  const syncAllCheckbox = () => {
    const items = App.Cart.getItems();
    const allCheck = document.getElementById('cartCheckAll');
    if (!allCheck) return;
    allCheck.checked = checkedIndices.size === items.length && items.length > 0;
    allCheck.indeterminate = checkedIndices.size > 0 && checkedIndices.size < items.length;
  };

  /* ── 금액 요약 업데이트 ── */
  const updateSummary = () => {
    const items = App.Cart.getItems();
    const selected = items.filter((_, i) => checkedIndices.has(i));

    const subtotal = selected.reduce((s, i) => s + i.price * i.qty, 0);
    const origTotal = selected.reduce((s, i) => {
      const origPrice = (() => {
        const { PRODUCTS } = window.VARO_DATA;
        return PRODUCTS.find(p => p.id === i.productId)?.price ?? i.price;
      })();
      return s + origPrice * i.qty;
    }, 0);
    const discount = origTotal - subtotal;
    const shipping = subtotal >= FREE_THRESH ? 0 : (subtotal > 0 ? DELIVERY_FEE : 0);
    const total = subtotal + shipping;

    /* 텍스트 업데이트 */
    const el = (id) => document.getElementById(id);
    if (el('summaryProductTotal')) el('summaryProductTotal').textContent = Utils.formatPrice(origTotal);
    if (el('summaryShipping')) el('summaryShipping').textContent = shipping === 0 ? (subtotal > 0 ? '무료' : '0원') : Utils.formatPrice(shipping);
    if (el('summaryDiscount')) el('summaryDiscount').textContent = discount > 0 ? `-${Utils.formatPrice(discount)}` : '0원';
    if (el('summaryTotal')) el('summaryTotal').textContent = Utils.formatPrice(total);
    if (el('discountRow')) el('discountRow').hidden = discount === 0;

    /* 무료배송 프로그레스바 */
    const barEl = el('freeShipBar');
    const textEl = el('freeShipText');
    if (barEl && textEl) {
      if (subtotal >= FREE_THRESH) {
        barEl.style.width = '100%';
        textEl.textContent = '🎉 무료배송 혜택이 적용되었습니다!';
      } else {
        const pct = Math.min(100, (subtotal / FREE_THRESH) * 100);
        barEl.style.width = `${pct}%`;
        const remain = FREE_THRESH - subtotal;
        textEl.textContent = `${Utils.formatPrice(remain)} 더 담으면 무료배송`;
      }
    }
  };

  const init = () => {
    if (!document.getElementById('cartList')) return;

    renderCart();

    /* 전체 선택 */
    document.getElementById('cartCheckAll')?.addEventListener('change', (e) => {
      const items = App.Cart.getItems();
      checkedIndices = e.target.checked ? new Set(items.map((_, i) => i)) : new Set();
      renderCart();
    });

    /* 선택 삭제 */
    document.getElementById('cartDeleteSelected')?.addEventListener('click', () => {
      if (checkedIndices.size === 0) { Utils.showToast('삭제할 상품을 선택해 주세요', 'error'); return; }
      if (!confirm(`선택한 ${checkedIndices.size}개 상품을 삭제하시겠습니까?`)) return;
      /* 역순으로 제거해야 인덱스 밀림 방지 */
      [...checkedIndices].sort((a, b) => b - a).forEach(i => App.Cart.removeItem(i));
      checkedIndices.clear();
      renderCart();
    });

    /* 주문하기 */
    document.getElementById('cartCheckout')?.addEventListener('click', () => {
      const selected = App.Cart.getItems().filter((_, i) => checkedIndices.has(i));
      if (selected.length === 0) { Utils.showToast('주문할 상품을 선택해 주세요', 'error'); return; }
      Utils.showToast('주문 기능은 추후 연동 예정입니다 🛒', 'default');
    });
  };

  return { init };
})();

/* ════════════════════════════════════════════════
   AuthPage
   — login.html / signup.html 에서만 활성화
════════════════════════════════════════════════ */
const AuthPage = (() => {

  /* ── 유효성 규칙 ── */
  const RULES = {
    name: { min: 2, pattern: /^[가-힣a-zA-Z ]{2,30}$/, msg: '2~30자 한글/영문만 입력하세요' },
    email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, msg: '올바른 이메일 형식을 입력하세요' },
    password: { min: 8, pattern: /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/, msg: '영문+숫자 포함 8자 이상 입력하세요' },
    phone: { pattern: /^01[016789]-?\d{3,4}-?\d{4}$/, msg: '올바른 휴대폰 번호를 입력하세요' },
  };

  /* ── 에러 표시 / 해제 ── */
  const setError = (input, msg) => {
    const group = input.closest('.form-group');
    const errEl = group?.querySelector('.form-error');
    input.classList.add('form-input--error');
    input.setAttribute('aria-invalid', 'true');
    if (errEl) { errEl.textContent = msg; errEl.classList.add('is-visible'); }
    return false;
  };
  const clearError = (input) => {
    const group = input.closest('.form-group');
    const errEl = group?.querySelector('.form-error');
    input.classList.remove('form-input--error');
    input.setAttribute('aria-invalid', 'false');
    if (errEl) errEl.classList.remove('is-visible');
    return true;
  };

  /* ── 단일 필드 검증 ── */
  const validateField = (input, type) => {
    const value = input.value.trim();
    const rule = RULES[type];
    if (!rule) return true;
    if (!value) return setError(input, '필수 입력 항목입니다');
    if (rule.min && value.length < rule.min) return setError(input, rule.msg);
    if (rule.pattern && !rule.pattern.test(value)) return setError(input, rule.msg);
    return clearError(input);
  };

  /* ── 비밀번호 확인 검증 ── */
  const validateConfirm = (confirmInput, pwInput) => {
    if (!confirmInput.value) return setError(confirmInput, '필수 입력 항목입니다');
    if (confirmInput.value !== pwInput.value) return setError(confirmInput, '비밀번호가 일치하지 않습니다');
    return clearError(confirmInput);
  };

  /* ── 비밀번호 표시/숨기기 ──
     HTML 구조: <button class="pw-toggle" data-target="inputId">
  ── */
  const initPasswordToggle = () => {
    document.querySelectorAll('.pw-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const input = targetId ? document.getElementById(targetId) : btn.closest('.form-input-wrap')?.querySelector('input');
        if (!input) return;
        const isText = input.type === 'text';
        input.type = isText ? 'password' : 'text';
        btn.querySelector('.eye-on').style.display = isText ? 'block' : 'none';
        btn.querySelector('.eye-off').style.display = isText ? 'none' : 'block';
        btn.setAttribute('aria-label', isText ? '비밀번호 숨기기' : '비밀번호 표시');
      });
    });
  };

  /* ── 비밀번호 강도계 ──
     HTML: #pwStrength > .pw-strength__seg[data-seg="0~3"] + #pwStrengthLabel
  ── */
  const calcStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^a-zA-Z\d]/.test(pw)) score++;
    return score; // 0~4
  };

  const initPasswordStrength = () => {
    const pwInput = document.getElementById('signupPw');
    const segs = document.querySelectorAll('.pw-strength__seg');
    const label = document.getElementById('pwStrengthLabel');
    if (!pwInput || !segs.length) return;

    const LEVELS = [
      { label: '', cls: '' },
      { label: '매우 약함', cls: 'strength-1' },
      { label: '약함', cls: 'strength-2' },
      { label: '보통', cls: 'strength-3' },
      { label: '강함', cls: 'strength-4' },
    ];

    pwInput.addEventListener('input', () => {
      const score = calcStrength(pwInput.value);
      segs.forEach((seg, i) => {
        seg.className = 'pw-strength__seg';
        if (i < score) seg.classList.add(LEVELS[score].cls || `strength-${score}`);
      });
      if (label) {
        label.textContent = pwInput.value.length > 0 ? LEVELS[score].label : '';
      }
    });
  };

  /* ── 전체 동의 ── */
  const initTermsAll = () => {
    const allBox = document.getElementById('termsAll');
    const boxes = [document.getElementById('terms1'), document.getElementById('terms2'), document.getElementById('terms3')].filter(Boolean);
    if (!allBox) return;

    allBox.addEventListener('change', () => {
      boxes.forEach(b => { b.checked = allBox.checked; });
    });
    boxes.forEach(b => {
      b.addEventListener('change', () => {
        allBox.checked = boxes.every(x => x.checked);
        allBox.indeterminate = !allBox.checked && boxes.some(x => x.checked);
      });
    });
  };

  /* ── 로그인 ── */
  const initLogin = () => {
    const form = document.getElementById('loginForm');
    const emailIn = document.getElementById('loginEmail');
    const pwIn = document.getElementById('loginPassword');
    const submit = document.getElementById('loginSubmit');
    if (!form || !submit) return;

    emailIn?.addEventListener('blur', () => validateField(emailIn, 'email'));
    pwIn?.addEventListener('blur', () => validateField(pwIn, 'password'));

    submit.addEventListener('click', () => {
      let valid = true;
      if (emailIn && !validateField(emailIn, 'email')) valid = false;
      if (pwIn && !validateField(pwIn, 'password')) valid = false;
      if (!valid) return;
      submit.disabled = true;
      submit.textContent = '로그인 중...';
      setTimeout(() => {
        Utils.showToast('로그인 기능은 추후 API 연동 예정입니다', 'default');
        submit.disabled = false;
        submit.textContent = '로그인';
      }, 800);
    });
  };

  /* ── 회원가입 ── */
  const initSignup = () => {
    const form = document.getElementById('signupForm');
    const nameIn = document.getElementById('signupName');
    const emailIn = document.getElementById('signupEmail');
    const pwIn = document.getElementById('signupPw');
    const pwConfirmIn = document.getElementById('signupPwConfirm');
    const submit = document.getElementById('signupSubmit');
    if (!form || !submit) return;

    nameIn?.addEventListener('blur', () => validateField(nameIn, 'name'));
    emailIn?.addEventListener('blur', () => validateField(emailIn, 'email'));
    pwIn?.addEventListener('blur', () => validateField(pwIn, 'password'));
    pwConfirmIn?.addEventListener('blur', () => validateConfirm(pwConfirmIn, pwIn));

    /* 비밀번호 변경 시 확인 필드도 재검증 */
    pwIn?.addEventListener('input', () => {
      if (pwConfirmIn?.value) validateConfirm(pwConfirmIn, pwIn);
    });

    submit.addEventListener('click', () => {
      let valid = true;
      if (nameIn && !validateField(nameIn, 'name')) valid = false;
      if (emailIn && !validateField(emailIn, 'email')) valid = false;
      if (pwIn && !validateField(pwIn, 'password')) valid = false;
      if (pwConfirmIn && !validateConfirm(pwConfirmIn, pwIn)) valid = false;

      /* 필수 약관 확인 */
      const t1 = document.getElementById('terms1');
      const t2 = document.getElementById('terms2');
      const tErr = document.getElementById('termsError');
      if (!t1?.checked || !t2?.checked) {
        if (tErr) { tErr.textContent = '필수 약관에 동의해 주세요'; tErr.classList.add('is-visible'); }
        valid = false;
      } else {
        if (tErr) tErr.classList.remove('is-visible');
      }

      if (!valid) return;

      submit.disabled = true;
      submit.textContent = '처리 중...';
      setTimeout(() => {
        Utils.showToast('회원가입이 완료되었습니다 🎉', 'success');
        submit.disabled = false;
        submit.textContent = '가입하기';
      }, 800);
    });
  };

  const init = () => {
    initPasswordToggle();
    initPasswordStrength();
    initTermsAll();
    initLogin();
    initSignup();
  };

  return { init };
})();

/* ════════════════════════════════════════════════
   DOMContentLoaded: 각 페이지 모듈 선택적 초기화
   — ID 존재 여부로 현재 페이지 판별
════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('communityGrid')) CommunityPage.init();
  if (document.getElementById('cartList')) CartPage.init();
  if (document.getElementById('loginForm') ||
    document.getElementById('signupForm')) AuthPage.init();
});
