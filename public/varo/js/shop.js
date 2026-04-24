/**
 * js/shop.js — VARO 쇼핑몰 상품 페이지 기능 구현
 */

(() => {
  const runShop = () => {
    console.log('[Shop] Initializing...');

    // ── 전역 데이터 참조
    const PRODUCTS = (window.VARO_DATA && window.VARO_DATA.PRODUCTS) ? window.VARO_DATA.PRODUCTS : [];
    const Utils = window.Utils;

    // ── DOM 요소
    const grid = document.getElementById('shopGrid');
    const countEl = document.getElementById('shopCount');
    const titleEl = document.getElementById('shopTitle');
    const breadcrumb = document.getElementById('breadcrumbCurrent');
    const sortSelect = document.getElementById('sortSelect');
    const pageSizeSelect = document.getElementById('pageSizeSelect');
    const emptyState = document.getElementById('shopEmpty');
    const resetBtn = document.getElementById('resetFilter');
    const filterTabs = document.querySelectorAll('.filter-tab');
    const priceInputs = document.querySelectorAll('input[name="price"]');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const applyPriceBtn = document.getElementById('applyPrice');
    const sizeChips = document.querySelectorAll('.size-chip');
    const viewGridBtn = document.getElementById('viewGrid');
    const viewListBtn = document.getElementById('viewList');

    if (!grid) {
      console.warn('[Shop] grid element (#shopGrid) not found. Skipping.');
      return;
    }

    // ── 상태
    const state = {
      products: [], // 하이브리드로 채워짐
      filteredProducts: [],
      filters: {
        category: 'all',
        badge: null,
        price: [],
        minPrice: null,
        maxPrice: null,
        size: null,
        sub: null,
        query: ''
      },
      sort: 'newest',
      pageSize: 20
    };

    let LIVE_PRODUCTS = [];

    // 데이터 동기화 엔진
    const syncLiveData = async () => {
      try {
        const res = await window.API.products.getAll();
        // API.products.getAll()이 배열을 반환하면 그대로 사용, 객체면 내부 속성 참조
        LIVE_PRODUCTS = Array.isArray(res) ? res : (res.products || res.data || []);
        updateMergedProducts();
      } catch (e) {
        console.warn('Live sync failed, using static data.', e);
        updateMergedProducts();
      }
    };

    const updateMergedProducts = () => {
      const staticList = (window.VARO_DATA && window.VARO_DATA.PRODUCTS) ? window.VARO_DATA.PRODUCTS : [];
      // 하이브리드 병합
      const merged = [...(LIVE_PRODUCTS.map(p => ({
        id: String(p.id),
        name: p.name,
        mainImg: p.main_img || p.mainImg || '../../assets/placeholder.png',
        subImg: p.sub_img || p.subImg || p.main_img || p.mainImg || '../../assets/placeholder.png',
        price: p.price,
        salePrice: p.salePrice,
        badge: p.badge,
        categoryId: p.categoryId,
        description: p.description,
        reviewCount: p.reviewCount || 0,
        colors: p.colors || [],
        sizes: p.sizes || []
      }))), ...staticList];

      state.products = merged;
      applyFilters();
    };

    // 실시간 변경 감지 리스너
    window.addEventListener('varo:dataChange', (e) => {
      console.log('Shop Page Sync Triggered:', e.detail.type);
      syncLiveData();
    });

    // ── URL 파라미터 처리
    const parseUrlParams = () => {
      const params = new URLSearchParams(window.location.search);
      state.filters.category = params.get('category') || 'all';
      const quickFilter = params.get('filter');
      if (quickFilter && ['new', 'best', 'sale'].includes(quickFilter)) {
        state.filters.badge = quickFilter;
      }
      state.filters.sub = params.get('sub') || null;
      state.filters.query = params.get('q') || '';

      // UI 동기화 (카테고리 탭)
      filterTabs.forEach(tab => {
        const isActive = tab.dataset.category === state.filters.category;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
      });
    };

    // ── 필터 적용
    const applyFilters = () => {
      let result = [...state.products];

      // 카테고리 필터
      if (state.filters.category !== 'all') {
        result = result.filter(p => p.categoryId === state.filters.category);
      }

      // 서브 카테고리(sub) 필터
      if (state.filters.sub) {
        const sub = state.filters.sub.toLowerCase();
        const subMap = {
          'jacket': '자켓', 'coat': '코트', 'padding': '패딩', 'jumper': '점퍼', 'leather': '레더',
          'shortshirt': '반팔셔츠', 'longshirt': '긴팔셔츠', 'overshirt': '오버사즈', 'denim-shirt': '데님셔츠',
          'shorttee': '반팔티', 'longtee': '긴팔티', 'sweatshirt': '맨투맨', 'hoodie': '후드', 'sleeveless': '민소매',
          'denim': '데님', 'slacks': '슬랙스', 'cargo': '카고', 'jogger': '조거', 'shorts': '반바지',
          'pullover': '풀오버', 'zipup': '집업', 'cardigan': '가디건', 'vest': '베스트',
          'sneakers': '스니커즈', 'loafer': '로퍼', 'sandal': '샌들', 'boots': '부츠'
        };
        const korSub = subMap[sub] || sub;

        result = result.filter(p => {
          const n = p.name ? p.name.toLowerCase() : '';
          const d = p.description ? p.description.toLowerCase() : '';
          const s = Array.isArray(p.styles) ? p.styles.join(' ').toLowerCase() : '';

          // '오버' 키워드가 '풀오버' 등과 혼동되지 않도록 정교화
          const isOvershirt = sub === 'overshirt';
          if (isOvershirt) {
            // 오버셔츠의 경우 '오버(사이즈/핏)' + '셔츠' 조합이거나 '오버사즈' 등을 체크
            const hasOver = n.includes('오버') || d.includes('오버') || s.includes('오버');
            const hasShirt = n.includes('셔츠') || d.includes('셔츠') || s.includes('셔츠');
            return (hasOver && hasShirt) || n.includes('overshirt');
          }

          return n.includes(korSub) || n.includes(sub) || d.includes(korSub) || s.includes(korSub) || s.includes(sub);
        });
      }

      // 뱃지(퀵) 필터
      if (state.filters.badge) {
        result = result.filter(p => p.badge === state.filters.badge);
      }

      // 가격 필터 (프리셋)
      if (state.filters.price && state.filters.price.length > 0) {
        result = result.filter(p => {
          const price = p.salePrice ?? p.price;
          return state.filters.price.some(range => {
            if (range === 'under50') return price <= 50000;
            if (range === '50to100') return price > 50000 && price <= 100000;
            if (range === '100to200') return price > 100000 && price <= 200000;
            if (range === 'over200') return price > 200000;
            return false;
          });
        });
      }

      // 가격 필터 (수동 입력)
      if (state.filters.minPrice !== null || state.filters.maxPrice !== null) {
        result = result.filter(p => {
          const price = p.salePrice ?? p.price;
          const min = state.filters.minPrice ?? 0;
          const max = state.filters.maxPrice ?? Infinity;
          return price >= min && price <= max;
        });
      }

      // 사이즈 필터
      if (state.filters.size) {
        result = result.filter(p => p.sizes && p.sizes.includes(state.filters.size));
      }

      // 검색어 필터
      if (state.filters.query) {
        const q = state.filters.query.toLowerCase();
        result = result.filter(p =>
          p.name.toLowerCase().includes(q) || (p.brand && p.brand.toLowerCase().includes(q))
        );
      }

      // 정렬
      switch (state.sort) {
        case 'newest': result.sort((a, b) => b.id.localeCompare(a.id)); break;
        case 'price-low': result.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price)); break;
        case 'price-high': result.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price)); break;
        case 'popular': result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      }

      state.filteredProducts = result;
      render();
    };

    // ── 렌더링
    const render = () => {
      // 페이지당 개수 제한 (사용자 요청 사항: O개씩 보기)
      const totalCount = state.filteredProducts.length;
      const items = state.filteredProducts.slice(0, state.pageSize);

      const categoryLabel = state.filters.category.toUpperCase();
      if (titleEl) titleEl.textContent = categoryLabel === 'ALL' ? 'ALL ITEMS' : categoryLabel;
      if (breadcrumb) breadcrumb.textContent = state.filters.category === 'all' ? '전체' : state.filters.category;
      if (countEl) countEl.textContent = `${totalCount}개의 상품 (상위 ${items.length}개 노출)`;

      if (totalCount === 0) {
        grid.innerHTML = '';
        emptyState?.removeAttribute('hidden');
        return;
      }
      emptyState?.setAttribute('hidden', '');

      grid.innerHTML = items.map(p => createCardHtml(p)).join('');

      // 이벤트 재바인딩
      grid.querySelectorAll('.product-card__wish').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          const id = btn.dataset.id;
          const isActive = window.App?.Wishlist?.toggle?.(id) ?? false;
          btn.classList.toggle('product-card__wish--active', !!isActive);
        });
      });
    };

    // ── 카드 HTML
    const createCardHtml = (p) => {
      const { id, brand, name, price, salePrice, badge, mainImg, subImg } = p;
      const isSale = salePrice != null;
      const currentPrice = isSale ? salePrice : price;
      const fmt = (v) => Utils ? Utils.formatPrice(v) : v.toLocaleString() + '원';

      return `
        <article class="product-card" onclick="location.href='./product.html?id=${id}'">
          <div class="product-card__img-wrap">
            ${badge ? `<span class="product-card__badge product-card__badge--${badge}">${badge.toUpperCase()}</span>` : ''}
            <img src="${mainImg}" alt="${name}" class="product-card__img product-card__img--main" loading="lazy" onerror="this.src='../../assets/placeholder.png'">
            <img src="${subImg}"  alt="${name}" class="product-card__img product-card__img--sub"  loading="lazy" onerror="this.src='${mainImg}'">
            
            <!-- ── 호버 상세 오버레이 (추가) ── -->
            <div class="product-card__overlay">
              <div class="overlay-content">
                ${badge === 'sale' ? '<div class="overlay-event">1+1</div>' : ''}
                <div class="overlay-name">${name}</div>
                <div class="overlay-colors">${p.colors ? p.colors.length : 0}color / Free Size</div>
                <div class="overlay-desc">${p.description || 'VARO의 감성을 담은 데일리 아이템입니다.'}</div>
                <div class="overlay-marketing">${badge === 'best' ? 'MD추천 / 주문폭주' : 'VARO BEST ITEM'}</div>
                <div class="overlay-price">
                  ${isSale ? `<span class="original">${fmt(price)}</span>` : ''}
                  <span class="current">${fmt(currentPrice)}</span>
                </div>
                <div class="overlay-reviews">Review ${p.reviewCount || 0}</div>
              </div>
            </div>

            <button class="product-card__wish ${window.App?.Wishlist?.has?.(id) ? 'product-card__wish--active' : ''}" data-id="${id}">
              ${Utils ? Utils.icon('heart') : '♡'}
            </button>
          </div>
          <div class="product-card__info">
            <div class="product-card__name-row">
              <h3 class="product-card__name">${name}</h3>
              <span class="product-card__color-count"> / ${p.colors ? p.colors.length : 0}color</span>
            </div>
            
            <div class="product-card__price-row">
              ${isSale ? `<span class="product-card__price--original">${fmt(price)}</span>` : ''}
              <span class="product-card__price ${isSale ? 'product-card__price--sale' : ''}">${fmt(currentPrice)}</span>
            </div>

            <p class="product-card__desc">${p.description || 'VARO가 제안하는 이번 시즌 필수 아이템입니다.'}</p>

            <div class="product-card__labels">
              ${badge === 'best' ? '<span class="label-point label-point--blue">MD추천/주문폭주</span>' : ''}
              ${badge === 'new' ? '<span class="label-point label-point--green">NEW 5% 신상 추가 할인</span>' : ''}
            </div>

            <p class="product-card__review-count">Review ${p.reviewCount || 0}</p>
          </div>
        </article>
      `;
    };

    // ── 이벤트 핸들러
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        state.filters.category = tab.dataset.category;
        state.filters.badge = null;
        applyFilters();
        // UI 갱신
        filterTabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
        tab.classList.add('is-active'); tab.setAttribute('aria-selected', 'true');
      });
    });

    sortSelect?.addEventListener('change', (e) => {
      state.sort = e.target.value;
      applyFilters();
    });

    pageSizeSelect?.addEventListener('change', (e) => {
      state.pageSize = parseInt(e.target.value, 10);
      render();
    });

    priceInputs.forEach(input => {
      input.addEventListener('change', () => {
        state.filters.price = Array.from(priceInputs).filter(i => i.checked).map(i => i.value);
        applyFilters();
      });
    });

    applyPriceBtn?.addEventListener('click', () => {
      const min = parseInt(minPriceInput.value, 10);
      const max = parseInt(maxPriceInput.value, 10);
      state.filters.minPrice = isNaN(min) ? null : min;
      state.filters.maxPrice = isNaN(max) ? null : max;
      applyFilters();
    });

    sizeChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const size = chip.dataset.size;
        state.filters.size = (state.filters.size === size) ? null : size;
        sizeChips.forEach(c => c.classList.toggle('is-active', c.dataset.size === state.filters.size));
        applyFilters();
      });
    });

    resetBtn?.addEventListener('click', () => {
      state.filters = { category: 'all', badge: null, price: [], minPrice: null, maxPrice: null, size: null, query: '' };
      state.sort = 'newest';
      state.pageSize = 20;
      if (sortSelect) sortSelect.value = 'newest';
      if (pageSizeSelect) pageSizeSelect.value = '20';
      if (minPriceInput) minPriceInput.value = '';
      if (maxPriceInput) maxPriceInput.value = '';
      priceInputs.forEach(i => i.checked = false);
      sizeChips.forEach(c => c.classList.remove('is-active'));
      applyFilters();
    });

    if (viewGridBtn && viewListBtn) {
      viewGridBtn.addEventListener('click', () => {
        grid.classList.remove('product-grid--list');
        viewGridBtn.classList.add('is-active'); viewListBtn.classList.remove('is-active');
      });
      viewListBtn.addEventListener('click', () => {
        grid.classList.add('product-grid--list');
        viewListBtn.classList.add('is-active'); viewGridBtn.classList.remove('is-active');
      });
    }

    // ── 초기 실행
    parseUrlParams();
    syncLiveData();
  };

  // ── 실행 제어
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runShop);
  } else {
    runShop();
  }
})();
