// 경로: js/index.js
// VARO 2026 — 홈페이지 로직 (슬라이더, 상품 그리드, 커뮤니티)
'use strict';

const IndexPage = (() => {

  const { PRODUCTS, COMMUNITY_POSTS } = window.VARO_DATA;

  /* ══════════════════════════════════════════
     멀티패널 메인 슬라이더
  ══════════════════════════════════════════ */
  const initSlider = () => {
    const container = document.querySelector('.main-slider');
    if (!container) return;

    const track = container.querySelector('#sliderTrack');
    const prev = container.querySelector('#sliderPrev');
    const next = container.querySelector('#sliderNext');
    const dotsArray = Array.from(container.querySelectorAll('.month-item'));

    const slidesData = window.VARO_DATA?.HERO_SLIDES || [];

    if (!track || !dotsArray.length || !slidesData.length) return;

    let current = 0;
    let autoTimer;

    // 1. 12개의 슬라이드 동적 생성 (트랙 내부)
    track.innerHTML = ''; // 초기화
    slidesData.forEach((data, idx) => {
      const slide = document.createElement('div');
      slide.className = 'main-slider__slide';

      const userMasterImg = "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80";
      const imgPanels = Array.isArray(data.panels) ? data.panels : [data.image || userMasterImg];
      const isFull = imgPanels.length === 1;

      slide.innerHTML = `
        <a href="${data.ctaHref || './shop.html'}" class="main-slider__panel ${isFull ? 'main-slider__panel--full' : ''}">
          ${imgPanels.map((src, i) => `
            <img src="${src}" alt="배너 이미지 ${i + 1}" loading="${idx === 0 ? 'eager' : 'lazy'}">
          `).join('')}
          ${data.title || data.desc ? `
          <div class="main-slider__overlay" style="position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,0.4), transparent); display:flex; flex-direction:column; justify-content:center; padding:0 120px; color:#fff; text-shadow:0 2px 10px rgba(0,0,0,0.2);">
            <span style="font-size:14px; font-weight:700; letter-spacing:0.2em; margin-bottom:15px; text-transform:uppercase; opacity:0.8;">${data.tag || ''}</span>
            <h2 class="main-slider__title" style="margin-bottom:20px; word-break:keep-all;">${data.title || ''}</h2>
            <p style="font-size:18px; opacity:0.9; word-break:keep-all;">${data.desc || ''}</p>
          </div>
          ` : ''}
        </a>
      `;
      track.appendChild(slide);
    });

    const goTo = (idx) => {
      current = (idx + slidesData.length) % slidesData.length;
      track.style.transform = `translateX(-${current * (100 / slidesData.length)}%)`;
      dotsArray.forEach((dot, i) => dot.classList.toggle('month-item--active', i === current));
      resetAuto();
    };

    const resetAuto = () => {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(current + 1), window.VARO_CONFIG?.HERO_AUTOPLAY_MS ?? 4000);
    };

    dotsArray.forEach((dot, i) => {
      dot.addEventListener('click', () => goTo(i));
    });

    if (prev) prev.addEventListener('click', () => goTo(current - 1));
    if (next) next.addEventListener('click', () => goTo(current + 1));

    // 터치 스와이프 지원
    let startX = 0;
    container.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    container.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
    }, { passive: true });

    goTo(0);
  };

  /* ══════════════════════════════════════════
     상품 카드 빌더 (공통)
  ══════════════════════════════════════════ */
  const buildCard = (product, darkBg = false) => {
    const fmt = n => n.toLocaleString('ko-KR') + '원';
    const disc = (p, s) => Math.round((1 - s / p) * 100);
    const isWish = window.App?.Wishlist?.has ? window.App.Wishlist.has(product.id) : false;
    const card = document.createElement('article');
    card.className = 'product-card';

    const imgWrap = document.createElement('div');
    imgWrap.className = 'product-card__img-wrap';

    const mainImg = document.createElement('img');
    mainImg.className = 'product-card__img product-card__img--main';
    mainImg.src = product.mainImg || '../../assets/placeholder.png';
    mainImg.alt = product.name;
    mainImg.loading = 'lazy';
    mainImg.width = 600;
    mainImg.height = 800;

    const subImg = document.createElement('img');
    subImg.className = 'product-card__img product-card__img--sub';
    subImg.src = product.subImg || product.mainImg || '../../assets/placeholder.png';
    subImg.alt = '';
    subImg.loading = 'lazy';
    subImg.width = 600;
    subImg.height = 800;
    subImg.setAttribute('aria-hidden', 'true');
    subImg.onerror = () => { subImg.src = product.mainImg || '../../assets/placeholder.png'; }; // 폴백

    imgWrap.append(mainImg, subImg);

    // 배지
    if (product.badge) {
      const badge = document.createElement('span');
      badge.className = `product-card__badge product-card__badge--${product.badge}`;
      badge.textContent = { new: 'NEW', sale: 'SALE', best: 'BEST' }[product.badge] ?? product.badge.toUpperCase();
      imgWrap.appendChild(badge);
    }
    if (product.isEvent) {
      const b11 = document.createElement('span');
      b11.className = 'product-card__badge--11';
      b11.textContent = '1+1';
      imgWrap.appendChild(b11);
    }

    // 위시 버튼
    const wishBtn = document.createElement('button');
    wishBtn.className = `product-card__wish${isWish ? ' product-card__wish--active' : ''}`;
    wishBtn.setAttribute('type', 'button');
    wishBtn.setAttribute('aria-label', '위시리스트');
    wishBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
    wishBtn.addEventListener('click', e => {
      e.stopPropagation();
      if (window.App?.Wishlist?.toggle) {
        const active = window.App.Wishlist.toggle(product.id);
        wishBtn.classList.toggle('product-card__wish--active', active);
      }
    });
    imgWrap.appendChild(wishBtn);

    // ── 호버 상세 오버레이 (추가) ──
    const hoverOverlay = document.createElement('div');
    hoverOverlay.className = 'product-card__overlay';

    // MD추천 / 주문폭주 매핑
    const badgeText = product.badge === 'best' ? 'MD 추천' : (product.badge === 'new' ? '주문 폭주' : '');
    const ratingStars = '★'.repeat(Math.round(product.rating || 5)) + '☆'.repeat(5 - Math.round(product.rating || 5));

    hoverOverlay.innerHTML = `
      <div class="overlay-content">
        ${product.badge === 'sale' || product.isEvent ? '<div class="overlay-event">1+1</div>' : ''}
        <div class="overlay-name">${product.name}</div>
        <div class="overlay-colors">${product.colors ? product.colors.length : 0}color / Free Size</div>
        <div class="overlay-desc">${product.description || 'VARO의 감성을 담은 데일리 아이템입니다.'}</div>
        <div class="overlay-marketing">${product.badge === 'best' ? 'MD추천 / 주문폭주' : 'VARO BEST ITEM'}</div>
        <div class="overlay-price">
          ${product.salePrice ? `<span class="original">${fmt(product.price)}</span>` : ''}
          <span class="current">${fmt(product.salePrice ?? product.price)}</span>
        </div>
        <div class="overlay-reviews">Review ${product.reviewCount || 0}</div>
      </div>
    `;
    imgWrap.appendChild(hoverOverlay);

    card.appendChild(imgWrap);

    // ── 정보 (평상시 노출) ──
    const info = document.createElement('div');
    info.className = 'product-card__info';

    // 1. 이름 / 색상 수
    const nameRow = document.createElement('div');
    nameRow.className = 'product-card__name-row';
    const nameEl = document.createElement('p');
    nameEl.className = 'product-card__name';
    nameEl.textContent = product.name;
    const colorCount = document.createElement('span');
    colorCount.className = 'product-card__color-count';
    colorCount.textContent = ` / ${product.colors ? product.colors.length : 0}color`;
    nameRow.append(nameEl, colorCount);

    // 2. 가격 원가 / 할인가
    const priceRow = document.createElement('div');
    priceRow.className = 'product-card__price-row';
    if (product.salePrice) {
      const sEl = document.createElement('span');
      sEl.className = 'product-card__price product-card__price--sale';
      sEl.textContent = fmt(product.salePrice);
      const oEl = document.createElement('span');
      oEl.className = 'product-card__price--original';
      oEl.textContent = fmt(product.price);
      priceRow.append(oEl, sEl);
    } else {
      const pEl = document.createElement('span');
      pEl.className = 'product-card__price';
      pEl.textContent = fmt(product.price);
      priceRow.appendChild(pEl);
    }

    // 3. 설명
    const descEl = document.createElement('p');
    descEl.className = 'product-card__desc';
    descEl.textContent = product.description || 'VARO가 제안하는 이번 시즌 필수 아이템입니다.';

    // 4. 포인트 라벨 (Badge 기반 색상 포인트)
    const labels = document.createElement('div');
    labels.className = 'product-card__labels';
    if (product.badge === 'best') {
      const l1 = document.createElement('span');
      l1.className = 'label-point label-point--blue';
      l1.textContent = 'MD추천/주문폭주';
      labels.appendChild(l1);
    }
    if (product.isNew || product.badge === 'new') {
      const l2 = document.createElement('span');
      l2.className = 'label-point label-point--green';
      l2.textContent = 'NEW 5% 신상 추가 할인';
      labels.appendChild(l2);
    }

    // 5. 리뷰 수
    const reviews = document.createElement('p');
    reviews.className = 'product-card__review-count';
    reviews.textContent = `Review ${product.reviewCount || 0}`;

    info.append(nameRow, priceRow, descEl, labels, reviews);
    card.appendChild(info);

    card.addEventListener('click', e => {
      if (e.target.closest('.product-card__wish,.product-card__quick-add')) return;
      window.location.href = `./product.html?id=${product.id}`;
    });
    return card;
  };

  let LIVE_PRODUCTS = [];

  // 데이터 동기화 엔진
  const syncLiveData = async () => {
    try {
      const res = await window.API.products.getAll();
      if (res.success) {
        LIVE_PRODUCTS = res.products || res.data || [];
        renderAll();
      }
    } catch (e) {
      console.warn('Live sync failed, using static data.');
    }
  };

  // 실시간 변경 감지 리스너
  window.addEventListener('varo:dataChange', (e) => {
    console.log('Main Page Sync Triggered:', e.detail.type);
    syncLiveData();
  });

  const getProducts = () => {
    const staticProducts = window.VARO_DATA?.PRODUCTS || [];
    // 하이브리드 병합
    const merged = [...(LIVE_PRODUCTS.map(p => ({
      id: p.id,
      name: p.name,
      mainImg: p.main_img || p.mainImg || '../../assets/placeholder.png',
      subImg: p.sub_img || p.subImg || p.main_img || p.mainImg || '../../assets/placeholder.png',
      price: p.price,
      salePrice: p.salePrice,
      badge: p.badge,
      categoryId: p.categoryId,
      isNew: p.badge === 'new',
      isFlashSale: p.isFlashSale || false,
      flashSalePrice: p.flashSalePrice,
      flashSaleEnd: p.flashSaleEnd,
      description: p.description,
      reviewCount: p.reviewCount || 0
    }))), ...staticProducts];
    return merged;
  };

  /* ── 플래시 세일 (Time Sale) 엔진 ── */
  let flashInterval;
  const renderFlashSale = () => {
    const section = document.getElementById('flashSaleSection');
    const grid = document.getElementById('flashSaleGrid');
    if (!section || !grid) return;

    const products = getProducts();
    const flashItems = products.filter(p => p.isFlashSale && p.flashSaleEnd);

    if (flashItems.length === 0) {
      section.hidden = true;
      return;
    }

    section.hidden = false;
    grid.innerHTML = '';
    flashItems.slice(0, 4).forEach(p => {
      // 플래시 세일용 커스텀 빌더 (가격 강조)
      const card = buildCard(p);
      if (p.flashSalePrice) {
        const priceEl = card.querySelector('.product-card__price--sale') || card.querySelector('.product-card__price');
        priceEl.textContent = (p.flashSalePrice).toLocaleString() + '원';
        priceEl.classList.add('u-color-error');
      }
      grid.appendChild(card);
    });

    startFlashTimer(flashItems[0].flashSaleEnd);
  };

  const startFlashTimer = (endTime) => {
    clearInterval(flashInterval);
    const target = new Date(endTime).getTime();

    const update = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        clearInterval(flashInterval);
        renderFlashSale(); // 다시 렌더링하여 숨김 처리
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      document.getElementById('timerHours').textContent = String(h).padStart(2, '0');
      document.getElementById('timerMinutes').textContent = String(m).padStart(2, '0');
      document.getElementById('timerSeconds').textContent = String(s).padStart(2, '0');
    };

    update();
    flashInterval = setInterval(update, 1000);
  };

  /* 룩플 전용 렌더링 함수들 */
  const renderWeeklyBest = (category) => {
    const grid = document.getElementById('weeklyBestGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const products = getProducts();
    const { WEEKLY_BEST } = window.VARO_DATA;
    let filtered = [];

    if (category === 'best') {
      filtered = (WEEKLY_BEST || []).map(id => products.find(p => p.id === id)).filter(Boolean);
      // 신규 등록된 상품 중 베스트인 것들도 추가
      const newBests = products.filter(p => p.id > 1000 && p.badge === 'best');
      filtered = [...newBests, ...filtered].slice(0, 9);
    } else {
      filtered = products.filter(p => p.categoryId === category).slice(0, 9);
    }

    filtered.forEach(p => {
      const card = buildCard(p);
      card.classList.add('product-card--hover-only');
      grid.appendChild(card);
    });
  };

  // 3열 그리드 렌더링 (New Product)
  const renderNewProduct = () => {
    const grid = document.getElementById('newProductGrid');
    if (!grid) return;
    grid.innerHTML = '';
    const products = getProducts();
    const filtered = products.filter(p => p.badge === 'new' || p.isNew).slice(0, 6);
    filtered.forEach(p => grid.appendChild(buildCard(p)));
  };

  // 표준 4열 그리드 렌더링 (Lookple Best)
  const renderLookpleBest = () => {
    const grid = document.getElementById('lookpleBestGrid');
    if (!grid) return;
    grid.innerHTML = '';
    const products = getProducts();
    const filtered = products.filter(p => p.badge === 'best' || p.isSteady).slice(0, 8);
    filtered.forEach(p => grid.appendChild(buildCard(p)));
  };

  const renderAll = () => {
    renderFlashSale();
    renderWeeklyBest(document.querySelector('.lookple-tab-btn.is-active')?.dataset.category || 'best');
    renderNewProduct();
    renderLookpleBest();
  };

  // 탭 네비게이션 초기화
  const initLookpleTabs = () => {
    const tabs = document.querySelectorAll('.lookple-tab-btn');
    tabs.forEach(btn => {
      btn.addEventListener('click', function () {
        tabs.forEach(t => t.classList.remove('is-active'));
        this.classList.add('is-active');
        renderWeeklyBest(this.dataset.category);
      });
    });
  };

  /* ══════════════════════════════════════════
     초기화
  ══════════════════════════════════════════ */
  const init = async () => {
    initSlider(); // 슬라이더 초기화
    initLookpleTabs(); // 룩플 전용 탭 초기화

    // 초기 데이터 동기화 (MySQL 실시간 데이터 가져오기)
    await syncLiveData();

    // 초기 렌더링 수행
    renderAll();
  };

  return { init };
})();

document.addEventListener('DOMContentLoaded', IndexPage.init);
