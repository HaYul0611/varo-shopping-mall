/**
 * js/product.js — VARO 쇼핑몰 상품 상세 페이지 기능 구현
 * 
 * - URL 파라미터 id로 상품 조회
 * - 이미지 갤러리 전환 및 줌
 * - 옵션(컬러/사이즈) 및 수량 관리
 * - 장바구니 담기 (localStorage + Event)
 * - 탭 시스템 및 콘텐츠 동적 렌더링
 * - 관련 상품 추천 렌더링
 */

import { PRODUCTS, REVIEWS } from './data.js';
import Utils from './utils.js';

const ProductDetail = (() => {
  /* ─── 상태 관리 (State) ──────────────────────────────── */
  const state = {
    product: null,
    selectedColor: null,
    selectedSize: null,
    quantity: 1,
    currentImgIndex: 0,
  };

  /* ─── DOM 요소 ───────────────────────────────────────── */
  const refs = {
    breadcrumb: document.getElementById('breadcrumbProduct'),
    galleryMain: document.getElementById('galleryMainImg'),
    galleryThumbs: document.getElementById('galleryThumbs'),
    productInfo: document.getElementById('productInfo'),
    zoomBtn: document.getElementById('galleryZoom'),
    modal: document.getElementById('galleryModal'),
    modalImg: document.getElementById('galleryModalImg'),
    modalClose: document.getElementById('galleryModalClose'),
    tabBtns: document.querySelectorAll('.tab-btn'),
    tabPanels: document.querySelectorAll('.tab-panel'),
    reviewBadge: document.getElementById('reviewCountBadge'),
    reviewSection: document.getElementById('reviewSection'),
    relatedGrid: document.getElementById('relatedGrid'),
    mobileCartBtn: document.getElementById('mobileCtaCart'),
    mobileWishBtn: document.getElementById('mobileCataWish'),
  };

  /* ─── 초기화 (Init) ──────────────────────────────────── */
  const init = () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
      alert('상품 정보를 찾을 수 없습니다.');
      location.href = './shop.html';
      return;
    }

    state.product = PRODUCTS.find(p => p.id === productId);
    if (!state.product) {
      alert('존재하지 않는 상품입니다.');
      location.href = './shop.html';
      return;
    }

    // 초기 데이터 설정
    state.selectedColor = state.product.colors[0]; // 기본 컬러

    renderUI();
    bindEvents();
    renderRelated();
    renderReviews();
    renderStylingSets();   // [ADD] 스타일링 제안
    renderReviewGallery();  // [ADD] 리뷰 갤러리
    initSizeGuide();       // [ADD] 사이즈 가이드 모달
  };

  /* ─── UI 렌더링 ─────────────────────────────────────── */
  const renderUI = () => {
    const { product } = state;
    const isSale = product.salePrice !== null;
    const currentPrice = isSale ? product.salePrice : product.price;

    // 페이지 타이틀 및 브레드크럼
    document.title = `${product.name} — VARO`;
    if (refs.breadcrumb) refs.breadcrumb.textContent = product.name;

    // 갤러리 메인 이미지
    if (refs.galleryMain) refs.galleryMain.src = product.images[0];

    // 썸네일 생성
    if (refs.galleryThumbs) {
      refs.galleryThumbs.innerHTML = product.images.map((img, idx) => `
        <div class="product-gallery__thumb ${idx === 0 ? 'is-active' : ''}" data-index="${idx}">
          <img src="${img}" alt="${product.name} 썸네일 ${idx + 1}">
        </div>
      `).join('');
    }

    // 상품 상세 정보 영역
    if (refs.productInfo) {
      refs.productInfo.innerHTML = `
        <div class="product-info__top">
          <p class="product-info__brand">${Utils.escapeHTML(product.brand)}</p>
          <h1 class="product-info__name">${Utils.escapeHTML(product.name)}</h1>
          
          <div class="product-info__rating">
            <div class="rating-stars">${renderStars(product.rating)}</div>
            <span class="product-info__rating-val">${product.rating}</span>
            <span class="product-info__review-count" id="infoReviewBtn">(${product.reviewCount} Reviews)</span>
          </div>

          <div class="product-info__price-wrap">
            ${isSale ? `<span class="product-info__price--discount">${Utils.discountRate(product.price, product.salePrice)}%</span>` : ''}
            <span class="product-info__price--main">${Utils.formatPrice(currentPrice)}</span>
            ${isSale ? `<span class="product-info__price--original">${Utils.formatPrice(product.price)}</span>` : ''}
          </div>
        </div>

        <div class="product-info__color-section">
          <p class="product-info__label">COLOR: <span class="product-info__color-value" id="selectedColorName">${state.selectedColor.name}</span></p>
          <div class="product-color-swatches">
            ${product.colors.map(c => `
              <button class="product-color-swatch ${c.name === state.selectedColor.name ? 'is-active' : ''} ${c.hex.toLowerCase() === '#ffffff' ? 'product-color-swatch--light' : ''}" 
                      style="background-color: ${c.hex}" 
                      data-color="${c.name}" title="${c.name}"></button>
            `).join('')}
          </div>
        </div>

        <div class="product-info__size-section">
          <div class="product-info__size-header">
            <p class="product-info__label">SIZE</p>
            <button class="size-guide-btn">Size Guide</button>
          </div>
          <div class="product-sizes">
            ${product.sizes.map(s => {
        const isSoldOut = product.soldOutSizes.includes(s);
        return `<button class="size-btn ${isSoldOut ? 'size-btn--sold-out' : ''}" data-size="${s}" ${isSoldOut ? 'disabled' : ''}>${s}</button>`;
      }).join('')}
          </div>
        </div>

        <div class="product-info__qty-section">
          <p class="product-info__label">QUANTITY</p>
          <div class="product-qty">
            <button class="qty-btn" data-action="minus" aria-label="수량 감소">${Utils.icon('minus')}</button>
            <span class="qty-value" id="qtyValue">1</span>
            <button class="qty-btn" data-action="plus" aria-label="수량 증가">${Utils.icon('plus')}</button>
          </div>
        </div>

        <div class="product-info__cta">
          <button class="product-wish-btn ${window.App?.Wishlist.has(product.id) ? 'is-active' : ''}" id="mainWishBtn" aria-label="위시리스트 추가">
            ${Utils.icon('heart')}
          </button>
          
          ${product.soldOutSizes.length === product.sizes.length ? `
            <button class="btn btn--restock btn--full" id="restockApplyBtn">재입고 알림 신청</button>
          ` : `
            <button class="btn btn--outline product-cta-btn" id="addToCartBtn">ADD TO CART</button>
            <button class="btn btn--primary product-cta-btn" id="buyNowBtn">BUY IT NOW</button>
          `}
        </div>

        <div class="product-info__meta">
          <p><strong>Material:</strong> ${product.material || 'Cotton 100%'}</p>
          <p><strong>Care:</strong> ${product.care || 'Dry Clean Recommended'}</p>
        </div>
      `;
    }
  };

  const renderStars = (rating) => {
    let stars = '';
    for (let i = 0; i < 5; i++) {
      stars += `<span class="rating-star">${Utils.icon('star')}</span>`;
    }
    return stars;
  };

  /* ─── 이벤트 바인딩 ─────────────────────────────────── */
  const bindEvents = () => {
    // 썸네일 클릭
    refs.galleryThumbs?.addEventListener('click', (e) => {
      const thumb = e.target.closest('.product-gallery__thumb');
      if (!thumb) return;
      const idx = parseInt(thumb.dataset.index);
      state.currentImgIndex = idx;
      refs.galleryMain.src = state.product.images[idx];
      refs.galleryThumbs.querySelectorAll('.product-gallery__thumb').forEach(t => t.classList.remove('is-active'));
      thumb.classList.add('is-active');
    });

    // 줌 모달
    refs.zoomBtn?.addEventListener('click', () => {
      refs.modalImg.src = state.product.images[state.currentImgIndex];
      refs.modal.classList.add('is-open');
      Utils.lockScroll();
    });
    refs.modalClose?.addEventListener('click', () => {
      refs.modal.classList.remove('is-open');
      Utils.unlockScroll();
    });

    // 상세 정보 영역 클릭 이벤트 (컬러, 사이즈, 수량, 버튼)
    refs.productInfo?.addEventListener('click', (e) => {
      // 컬러 선택
      const swatch = e.target.closest('.product-color-swatch');
      if (swatch) {
        const colorName = swatch.dataset.color;
        state.selectedColor = state.product.colors.find(c => c.name === colorName);
        refs.productInfo.querySelectorAll('.product-color-swatch').forEach(s => s.classList.remove('is-active'));
        swatch.classList.add('is-active');
        document.getElementById('selectedColorName').textContent = colorName;
      }

      // 사이즈 선택
      const sizeBtn = e.target.closest('.size-btn');
      if (sizeBtn && !sizeBtn.classList.contains('size-btn--sold-out')) {
        state.selectedSize = sizeBtn.dataset.size;
        refs.productInfo.querySelectorAll('.size-btn').forEach(b => b.classList.remove('is-active'));
        sizeBtn.classList.add('is-active');
      }

      // 수량 조절
      const qtyBtn = e.target.closest('.qty-btn');
      if (qtyBtn) {
        const action = qtyBtn.dataset.action;
        if (action === 'plus') state.quantity++;
        if (action === 'minus' && state.quantity > 1) state.quantity--;
        document.getElementById('qtyValue').textContent = state.quantity;
      }

      // 장바구니/구매 버튼
      if (e.target.closest('#addToCartBtn')) handleAddToCart();
      if (e.target.closest('#buyNowBtn')) {
        handleAddToCart(true);
      }

      // 재입고 알림 신청 (Premium)
      if (e.target.closest('#restockApplyBtn')) {
        Utils.showToast('재입고 알림 신청이 완료되었습니다. 🔔');
      }

      // 사이즈 가이드 모달 열기 (Premium)
      if (e.target.closest('.size-guide-btn')) {
        document.getElementById('sizeModal')?.classList.add('is-active');
      }
    });

    // 위시리스트 토글 (메인 버튼)
    document.getElementById('mainWishBtn')?.addEventListener('click', (e) => {
      const btn = e.currentTarget;
      const isActive = window.App?.Wishlist.toggle(state.product.id);
      btn.classList.toggle('is-active', isActive);
      const icon = btn.querySelector('svg');
      if (icon) icon.style.fill = isActive ? 'var(--color-accent)' : 'none';
    });

    // 탭 전환
    refs.tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        refs.tabBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        refs.tabPanels.forEach(p => {
          p.hidden = p.id !== `tab${target.charAt(0).toUpperCase() + target.slice(1)}`;
        });
      });
    });
  };

  /* ─── 앱 로직 ──────────────────────────────────────── */
  const handleAddToCart = (isBuyNow = false) => {
    if (!state.selectedSize) {
      Utils.showToast('사이즈를 선택해 주세요.', 'error');
      document.querySelector('.product-sizes').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const { product, selectedColor, selectedSize, quantity } = state;
    const cartKey = 'varo_cart';
    const cart = Utils.storage.get(cartKey) || [];

    const existing = cart.find(item =>
      item.productId === product.id &&
      item.size === selectedSize &&
      item.color === selectedColor.name
    );

    if (existing) {
      existing.qty += quantity;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        brand: product.brand,
        price: product.salePrice ?? product.price,
        mainImg: product.mainImg,
        size: selectedSize,
        color: selectedColor.name,
        qty: quantity
      });
    }

    Utils.storage.set(cartKey, cart);
    window.dispatchEvent(new Event('cartUpdated')); // 헤더 뱃지 갱신용

    if (isBuyNow) {
      location.href = './cart.html';
    } else {
      Utils.showToast('장바구니에 담겼습니다 🛍', 'success');
    }
  };

  const renderRelated = () => {
    if (!refs.relatedGrid) return;
    const related = PRODUCTS
      .filter(p => p.categoryId === state.product.categoryId && p.id !== state.product.id)
      .slice(0, 4);

    refs.relatedGrid.innerHTML = related.map(p => `
      <article class="product-card" onclick="location.href='./product.html?id=${p.id}'">
        <div class="product-card__img-wrap">
          <img src="${p.mainImg}" alt="${p.name}" class="product-card__img product-card__img--main" loading="lazy">
          <img src="${p.subImg}" alt="${p.name}" class="product-card__img product-card__img--sub" loading="lazy">
          <button class="product-card__wish ${window.App?.Wishlist.has(p.id) ? 'product-card__wish--active' : ''}" 
                  data-id="${p.id}" onclick="event.stopPropagation(); window.App?.Wishlist.toggle('${p.id}')">
            ${Utils.icon('heart')}
          </button>
        </div>
        <div class="product-card__info">
          <p class="product-card__brand">${p.brand}</p>
          <h3 class="product-card__name">${p.name}</h3>
          <p class="product-card__price">${Utils.formatPrice(p.salePrice ?? p.price)}</p>
        </div>
      </article>
    `).join('');
  };

  const renderReviews = () => {
    const reviews = REVIEWS[state.product.id] || [];
    if (refs.reviewBadge) refs.reviewBadge.textContent = `(${reviews.length})`;
    if (!refs.reviewSection) return;

    if (reviews.length === 0) {
      refs.reviewSection.innerHTML = '<p class="review-empty">작성된 리뷰가 없습니다.</p>';
      return;
    }

    refs.reviewSection.innerHTML = `
      <div class="review-list">
        ${reviews.map(r => `
          <div class="review-card">
            <div class="review-card__header">
              <strong>${r.user}</strong>
              <div class="rating-stars">${renderStars(r.rating)}</div>
              <span class="review-card__date">${r.date}</span>
            </div>
            <p class="review-card__body">${Utils.escapeHTML(r.body)}</p>
          </div>
        `).join('')}
      </div>
    `;
  };

  /* ─── 프리미엄 기능: 사이즈 가이드 ────────────────────── */
  const initSizeGuide = () => {
    const modal = document.getElementById('sizeModal');
    const closeBtn = document.getElementById('sizeModalClose');
    const overlay = document.getElementById('sizeModalOverlay');
    const tableContainer = document.getElementById('sizeGuideTableContainer');

    if (!modal || !tableContainer) return;

    // 데이터 바인딩
    const category = state.product.categoryId;
    const guide = window.VARO_DATA?.SIZE_GUIDE[category];

    if (!guide) {
      tableContainer.innerHTML = '<p style="text-align:center; padding: 20px;">이 카테고리는 사이즈 가이드가 준비 중입니다.</p>';
    } else {
      let html = '<table class="size-table"><thead><tr>';
      const keys = Object.keys(guide[0]);
      const labels = { size: '사이즈', chest: '가슴', shoulder: '어깨', length: '총장', waist: '허리', hip: '엉덩이', inseam: '인심', uk: 'UK', eu: 'EU' };

      keys.forEach(k => html += `<th>${labels[k] || k}</th>`);
      html += '</tr></thead><tbody>';
      guide.forEach(row => {
        html += '<tr>';
        keys.forEach(k => html += `<td>${row[k]}</td>`);
        html += '</tr>';
      });
      html += '</tbody></table>';
      tableContainer.innerHTML = html;
    }

    const close = () => modal.classList.remove('is-active');
    closeBtn?.addEventListener('click', close);
    overlay?.addEventListener('click', close);
  };

  /* ─── 프리미엄 기능: 스타일링 제안 (How To Wear) ──────── */
  const renderStylingSets = () => {
    const grid = document.getElementById('stylingGrid');
    const section = document.getElementById('stylingSection');
    if (!grid || !section) return;

    // 현재 상품과 같은 카테고리의 다른 상품들 추천
    const sets = PRODUCTS
      .filter(p => p.id !== state.product.id && p.categoryId === state.product.categoryId)
      .slice(0, 4);

    if (sets.length === 0) {
      section.style.display = 'none';
      return;
    }

    grid.innerHTML = sets.map(p => `
      <article class="styling-card" onclick="location.href='./product.html?id=${p.id}'" style="cursor:pointer">
        <img src="${p.mainImg}" alt="${p.name}" loading="lazy">
        <div class="styling-card__info">
          <p class="styling-card__name">${p.name}</p>
          <p class="styling-card__price">${Utils.formatPrice(p.salePrice ?? p.price)}</p>
        </div>
      </article>
    `).join('');
  };

  /* ─── 프리미엄 기능: 리뷰 갤러리 (착샷 모아보기) ──────── */
  const renderReviewGallery = () => {
    const gallery = document.getElementById('reviewGallery');
    if (!gallery) return;

    // COMMUNITY_POSTS에서 현재 상품이 태그된 포스트 필터링
    const taggedPosts = (window.VARO_DATA.COMMUNITY_POSTS || []).filter(post =>
      post.taggedProducts.some(tp => tp.id === state.product.id)
    );

    if (taggedPosts.length === 0) {
      gallery.innerHTML = '<p style="grid-column: 1/-1; padding: 40px 0; color: var(--color-gray); text-align:center; font-size: 13px;">아직 등록된 실착 이미지가 없습니다.</p>';
      return;
    }

    gallery.innerHTML = taggedPosts.map(post => `
      <div class="review-gallery__item" onclick="location.href='./community.html'">
        <img src="${post.img}" alt="Customer Look" loading="lazy">
      </div>
    `).join('');
  };

  return { init };
})();

document.addEventListener('DOMContentLoaded', ProductDetail.init);
export default ProductDetail;
