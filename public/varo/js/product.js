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

const Utils = window.Utils;

const ProductDetail = (() => {
  /* ─── 전역 데이터 추출 (init에서 할당) ─── */
  let PRODUCTS = [];
  let REVIEWS = {};

  /* ─── 상태 관리 (State) ──────────────────────────────── */
  const state = {
    product: null,
    selectedColor: null,
    selectedSize: null,
    quantity: 1,
    currentImgIndex: 0,
  };

  /* ─── DOM 요소 선언만 (할당은 init에서) ─── */
  let refs = {};

  /* ─── 초기화 (Init) ──────────────────────────────────── */
  const init = async () => {
    // DOM 요소 바인딩
    refs = {
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

    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
      alert('상품 정보를 찾을 수 없습니다.');
      location.href = './shop.html';
      return;
    }

    // 지연 로딩 대응: window.VARO_DATA에서 직접 추출하여 클로저 변수에 할당
    const VD = window.VARO_DATA || { PRODUCTS: [], REVIEWS: {} };
    PRODUCTS = VD.PRODUCTS || [];
    REVIEWS = VD.REVIEWS || {};

    // 하이브리드 데이터 로드 (Static -> API)
    let product = PRODUCTS.find(p => p.id === productId);

    try {
      const res = await window.API.products.getById(productId);
      if (res && res.success) {
        const p = res.product || res.data;
        // DB 데이터를 프론트엔드 포맷으로 변환
        product = {
          id: String(p.id || p.product_code),
          brand: p.brand || 'VARO',
          name: p.name,
          price: p.price,
          salePrice: p.sale_price || p.salePrice,
          mainImg: p.main_img || p.mainImg || '../../assets/placeholder.png',
          subImg: p.sub_img || p.subImg || '../../assets/placeholder.png',
          images: Array.isArray(p.images) ? p.images : (p.main_img ? [p.main_img, p.sub_img].filter(Boolean) : null),
          colors: Array.isArray(p.colors) ? p.colors : JSON.parse(p.colors || '[]'),
          sizes: Array.isArray(p.sizes) ? p.sizes : JSON.parse(p.sizes || '[]'),
          soldOutSizes: Array.isArray(p.sold_out_sizes) ? p.sold_out_sizes : JSON.parse(p.sold_out_sizes || '[]'),
          description: p.description,
          material: p.material,
          care: p.care,
          rating: p.rating || 5.0,
          reviewCount: p.review_count || p.reviewCount || 0,
          categoryId: p.category_id || p.categoryId,
          stock: p.stock !== undefined ? p.stock : ((parseInt((p.id || productId).replace(/[^0-9]/g, '') || '0') % 10) + 1)
        };
      }
    } catch (e) {
      console.warn('[Product] API sync failed, falling back to static data.');
    }

    if (!product) {
      alert('존재하지 않는 상품입니다.');
      location.href = './shop.html';
      return;
    }

    // images 보정
    if (!product.images || product.images.length === 0) {
      product.images = [product.mainImg, product.subImg].filter(Boolean);
    }
    if (product.images.length === 0) product.images = ['../../assets/placeholder.png'];

    if (product) {
      product.stock = 3;
    }
    state.product = product;

    // 초기 데이터 설정
    state.selectedColor = (state.product.colors && state.product.colors.length > 0)
      ? state.product.colors[0]
      : { name: 'Standard', hex: 'var(--color-black)' };

    renderUI();
    bindEvents();
    renderRelated();
    renderReviews();
    renderStylingSets();   // [ADD] 스타일링 제안
    initSizeGuide();       // [ADD] 사이즈 가이드 모달 및 탭 연동
    renderDetailImages();  // [ADD] 상세 이미지 렌더링
  };

  const renderDetailImages = () => {
    const container = document.getElementById('detailImages');
    if (!container) return;

    let detailImgs = [];
    try {
      const images = state.product.images;
      detailImgs = typeof images === 'string' ? JSON.parse(images) : (Array.isArray(images) ? images : []);
    } catch (e) {
      console.warn("상세 이미지 파싱 실패:", e);
    }

    if (detailImgs.length === 0) {
      // 상세 이미지가 없을 경우 메인/서브 이미지라도 노출 (상용 기준 보완)
      if (state.product.mainImg) detailImgs.push(state.product.mainImg);
      if (state.product.subImg) detailImgs.push(state.product.subImg);
    }

    container.innerHTML = detailImgs.map(img => `<img src="${img}" alt="상세 정보" loading="lazy" onerror="this.style.display='none'">`).join('');
  };

  /* ─── UI 렌더링 ─────────────────────────────────────── */
  const renderUI = () => {
    try {
      const { product } = state;
      if (!product) return;

      const isSale = product.salePrice != null;
      const currentPrice = isSale ? product.salePrice : product.price;

      // 페이지 타이틀 및 브레드크럼
      document.title = `${product.name} — VARO`;
      if (refs.breadcrumb) refs.breadcrumb.textContent = product.name;

      // 갤러리 메인 이미지
      if (refs.galleryMain && product.images && product.images.length > 0) {
        refs.galleryMain.src = product.images[0];
      }

      // 썸네일 생성
      if (refs.galleryThumbs && product.images) {
        refs.galleryThumbs.innerHTML = product.images.map((img, idx) => `
          <div class="product-gallery__thumb ${idx === state.currentImgIndex ? 'is-active' : ''}" data-index="${idx}">
            <img src="${img}" alt="${product.name} 썸네일 ${idx + 1}" onerror="this.src='../../assets/placeholder.png'">
          </div>
        `).join('');
      }

      // 상품 설명 배너 보강 (쇼핑몰 특성에 맞게 수정)
      const descBanner = document.getElementById('productDescBanner');
      if (descBanner) {
        const categoryId = product.categoryId || '';
        const isAcc = categoryId.includes('acc') || categoryId.includes('shoes');

        descBanner.innerHTML = `
          <div class="premium-desc">
            <div class="premium-desc__header">
              <span class="premium-desc__subtitle">VARO STUDIO SELECTION</span>
              <h3 class="premium-desc__title">DESIGNER'S NOTES</h3>
            </div>
            <div class="premium-desc__content">
              <p class="premium-desc__text">${product.description || 'VARO만의 감성으로 풀어낸 데일리 아이템입니다. 오랜 시간 착용 가능하도록 견고하게 제작되었습니다.'}</p>
              <div class="premium-desc__grid">
                <div class="premium-desc__item">
                  <span class="premium-desc__label">FABRIC</span>
                  <p class="premium-desc__val">${product.material || 'Premium Fabric'}</p>
                </div>
                <div class="premium-desc__item">
                  <span class="premium-desc__label">FIT</span>
                  <p class="premium-desc__val">${isAcc ? 'Standard Fit' : 'Modern Relaxed Fit'}</p>
                </div>
                <div class="premium-desc__item">
                  <span class="premium-desc__label">CARE</span>
                  <p class="premium-desc__val">${product.care || 'Dry Cleaning Recommended'}</p>
                </div>
              </div>
            </div>
            <div class="premium-desc__footer">
              <p class="premium-desc__tip"><span>TIP:</span> ${isAcc ? '다양한 스타일링에 포인트가 되어주는 아이템입니다.' : '정사이즈 구매를 권장하며, 자연스러운 실루엣을 연출합니다.'}</p>
            </div>
          </div>
        `;
      }

      // 상품 상세 정보 영역
      if (refs.productInfo) {
        const u = window.Utils || Utils; // 전역/로컬 모두 대응

        refs.productInfo.innerHTML = `
          <div class="product-info__top">
            <div class="product-info__brand-wrap">
              <p class="product-info__brand">${u.escapeHTML(product.brand || 'VARO STUDIO')}</p>
              <button class="share-btn" id="shareBtn" aria-label="공유하기">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              </button>
            </div>
            
            ${(product.stock && product.stock < 5) ? `<div class="stock-badge">[품절 임박] 단 ${product.stock}개 남음</div>` : ''}
            
            <h1 class="product-info__name">${u.escapeHTML(product.name)}</h1>
            
            <div class="product-info__rating">
              <div class="rating-stars">${renderStars(product.rating)}</div>
              <span class="product-info__rating-val">${product.rating || '5.0'}</span>
              <span class="product-info__review-count" id="infoReviewBtn">(${product.reviewCount || 0} Reviews)</span>
            </div>

            <div class="product-info__price-wrap">
              ${isSale ? `<span class="product-info__price--discount">${u.discountRate(product.price, product.salePrice)}%</span>` : ''}
              <span class="product-info__price--main">${u.formatPrice(currentPrice)}</span>
              ${isSale ? `<span class="product-info__price--original">${u.formatPrice(product.price)}</span>` : ''}
            </div>
          </div>

          <div class="product-info__color-section">
            <p class="product-info__label">COLOR: <span class="product-info__color-value" id="selectedColorName">${state.selectedColor?.name || 'Standard'}</span></p>
            <div class="product-color-swatches">
              ${(product.colors || []).map(c => `
                <button class="product-color-swatch ${(c.name === state.selectedColor?.name) ? 'is-active' : ''} ${c.hex?.toLowerCase() === '#ffffff' ? 'product-color-swatch--light' : ''}" 
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
              ${(product.sizes || []).map(s => {
          const isSoldOut = (product.soldOutSizes || []).includes(s);
          return `<button class="size-btn ${isSoldOut ? 'size-btn--sold-out' : ''}" data-size="${s}" ${isSoldOut ? 'disabled' : ''}>${s}</button>`;
        }).join('')}
            </div>
          </div>

          <div class="product-info__qty-section">
            <p class="product-info__label">수량</p>
            <div class="product-qty">
              <button class="qty-btn" data-action="minus" aria-label="수량 감소">${u.icon('minus')}</button>
              <span class="qty-value" id="qtyValue">1</span>
              <button class="qty-btn" data-action="plus" aria-label="수량 증가">${u.icon('plus')}</button>
            </div>
          </div>

          <div class="product-info__cta">
            <button class="product-wish-btn ${window.App?.Wishlist?.has?.(product.id) ? 'is-active' : ''}" id="mainWishBtn" aria-label="위시리스트 추가">
              ${u.icon('heart')}
            </button>
            
            ${(product.soldOutSizes || []).length === (product.sizes || []).length && (product.sizes || []).length > 0 ? `
              <button class="btn btn--restock btn--full" id="restockApplyBtn">재입고 알림 신청</button>
            ` : `
              <button class="btn btn--outline product-cta-btn" id="addToCartBtn">장바구니에 넣기</button>
              <button class="btn btn--primary product-cta-btn" id="buyNowBtn">바로 구매하기</button>
            `}
          </div>

          <div class="product-info__meta">
            <p><strong>Material:</strong> ${product.material || 'Premium Cashmere Blend'}</p>
            <p><strong>Care:</strong> ${product.care || 'Professional Dry Clean'}</p>
          </div>
        `;
      }
    } catch (err) {
      console.error('[Product] Fatal Render Error:', err);
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

      // 공유하기 (Premium)
      if (e.target.closest('#shareBtn')) {
        const url = window.location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(() => {
            Utils.showToast('링크가 복사되었습니다. 📋', 'success');
          }).catch(err => {
            Utils.showToast('링크 복사에 실패했습니다.', 'error');
          });
        } else {
          // 폴백
          const textArea = document.createElement('textarea');
          textArea.value = url;
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand('copy');
            Utils.showToast('링크가 복사되었습니다. 📋', 'success');
          } catch (err) {
            Utils.showToast('링크 복사에 실패했습니다.', 'error');
          }
          document.body.removeChild(textArea);
        }
      }

      // 사이즈 가이드 탭으로 전환
      if (e.target.closest('.size-guide-btn')) {
        document.getElementById('tabBtnSize')?.click();
        document.getElementById('productTabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    // 위시리스트 토글 (메인 버튼)
    document.getElementById('mainWishBtn')?.addEventListener('click', (e) => {
      const btn = e.currentTarget;
      const isActive = window.App?.Wishlist?.toggle ? window.App.Wishlist.toggle(state.product.id) : false;
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

        // 모든 패널 숨기기
        document.querySelectorAll('.tab-panel').forEach(p => p.hidden = true);

        // 대상 패널 보이기 (ID 매칭 보정)
        const panelId = `tab${target.charAt(0).toUpperCase() + target.slice(1)}`;
        const panel = document.getElementById(panelId);
        if (panel) panel.hidden = false;
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
    
    // 공통 Cart 모듈 사용 (실시간 배지 업데이트 포함)
    window.App.Cart.addItem(product, selectedSize, selectedColor.name, quantity);

    if (isBuyNow) {
      location.href = './cart.html';
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
          <button class="product-card__wish ${window.App?.Wishlist?.has?.(p.id) ? 'product-card__wish--active' : ''}" 
                  data-id="${p.id}" onclick="event.stopPropagation(); window.App?.Wishlist?.toggle?.('${p.id}')">
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

    if (!tableContainer) return;

    // 카테고리 체크: 액세서리나 슈즈의 경우 AI 추천 숨김
    const category = state.product.categoryId || state.product.category || '';
    const isAcc = category.includes('acc') || category.includes('shoes');
    const aiSection = document.getElementById('aiSizeRecommend');

    if (isAcc && aiSection) {
      aiSection.style.display = 'none';
    } else if (aiSection) {
      aiSection.style.display = 'block';
    }

    // AI 스마트 가이드 이벤트 바인딩
    const btnRunAi = document.getElementById('btnRunAi');
    if (btnRunAi) {
      btnRunAi.addEventListener('click', () => {
        const height = parseInt(document.getElementById('inputHeight')?.value, 10);
        const weight = parseInt(document.getElementById('inputWeight')?.value, 10);
        const resultDiv = document.getElementById('aiResult');
        const recommendedSize = document.getElementById('recommendedSize');

        if (!height || !weight || height < 100 || weight < 30) {
          alert('정확한 키와 몸무게를 입력해주세요.');
          return;
        }

        // 간단한 Mock 추론 로직
        let size = 'M';
        if (weight >= 85 || height >= 185) size = 'XL';
        else if (weight >= 75 || height >= 178) size = 'L';
        else if (weight <= 60 && height <= 168) size = 'S';

        recommendedSize.textContent = size;
        resultDiv.removeAttribute('hidden');
      });
    }

    // 데이터 바인딩
    const sizeGuideData = window.VARO_DATA?.SIZE_GUIDE || {};
    const guide = sizeGuideData[category] || sizeGuideData['상의'];

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

      // [ADD] 탭 내부 컨테이너에도 동일하게 렌더링
      const tabContainer = document.getElementById('tabSizeGuideContainer');
      if (tabContainer) tabContainer.innerHTML = html;
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
      <article class="styling-card" onclick="location.href='./product.html?id=${p.id}'">
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

// [NEW] AI 분석하기 버튼 이벤트 위임 처리 (렌더링 타이밍 이슈 해결)
document.addEventListener('click', (e) => {
  const btn = e.target.closest('#btnRunAi') || (e.target.id === 'btnRunAi' ? e.target : null);
  if (btn) {
    const height = parseInt(document.getElementById('inputHeight')?.value, 10);
    const weight = parseInt(document.getElementById('inputWeight')?.value, 10);
    const resultDiv = document.getElementById('aiResult');
    const recommendedSize = document.getElementById('recommendedSize');

    if (!height || !weight || height < 100 || weight < 30) {
      alert('정확한 키와 몸무게를 입력해주세요.');
      return;
    }

    let size = 'M';
    if (weight >= 85 || height >= 185) size = 'XL';
    else if (weight >= 75 || height >= 178) size = 'L';
    else if (weight <= 60 && height <= 168) size = 'S';

    if (recommendedSize) recommendedSize.textContent = size;
    if (resultDiv) {
      resultDiv.style.display = 'block';
      resultDiv.removeAttribute('hidden');
    }
  }
});

document.addEventListener('DOMContentLoaded', ProductDetail.init);
export default ProductDetail;
