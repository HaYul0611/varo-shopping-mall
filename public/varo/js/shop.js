/**
 * js/shop.js — VARO 쇼핑몰 상품 페이지 기능 구현
 * 
 * - ES6+ 모듈 방식 사용 (import/export)
 * - 필터링 (카테고리, 가격, 사이즈)
 * - 정렬 (최신순, 인기순, 가격순)
 * - 렌더링 (상품 카드 BEM 구조, XSS 방지)
 * - URL 파라미터 연동
 */

import { PRODUCTS, VARO_CONFIG } from './data.js';
import Utils from './utils.js';

const Shop = (() => {
  /* ─── 상태 관리 (State) ──────────────────────────────── */
  const state = {
    products: [...PRODUCTS],      // 전체 상품 데이터 복사본
    filteredProducts: [],         // 필터링/정렬된 결과
    filters: {
      category: 'all',
      badge: null,
      price: [],
      size: null,
      query: '',
    },
    sort: 'newest',
  };

  /* ─── DOM 요소 ───────────────────────────────────────── */
  const refs = {
    grid: document.getElementById('shopGrid'),
    count: document.getElementById('shopCount'),
    title: document.getElementById('shopTitle'),
    breadcrumb: document.getElementById('breadcrumbCurrent'),
    sortSelect: document.getElementById('sortSelect'),
    emptyState: document.getElementById('shopEmpty'),
    resetBtn: document.getElementById('resetFilter'),
    filterTabs: document.querySelectorAll('.filter-tab'),
    priceInputs: document.querySelectorAll('input[name="price"]'),
    sizeChips: document.querySelectorAll('.size-chip'),
  };

  /* ─── 초기화 (Init) ──────────────────────────────────── */
  const init = () => {
    if (!refs.grid) return;

    parseUrlParams();
    renderBrandFilter(); // 브랜드 목록 동적 생성
    bindEvents();
    applyFilters();
  };

  /* ─── 브랜드 필터 렌더링 ────────────────────────────── */
  const renderBrandFilter = () => {
    const brands = [...new Set(state.products.map(p => p.brand))].sort();
    const list = document.getElementById('brandFilterList');
    if (!list) return;

    list.innerHTML = brands.map(brand => `
      <li><label><input type="checkbox" name="brand" value="${brand}"> ${brand}</label></li>
    `).join('');

    // 이벤트 바인딩 (새로 생성된 체크박스)
    list.querySelectorAll('input[name="brand"]').forEach(input => {
      input.addEventListener('change', () => {
        state.filters.brands = Array.from(list.querySelectorAll('input[name="brand"]:checked')).map(i => i.value);
        applyFilters();
      });
    });
  };

  /* ─── URL 파라미터 처리 ─────────────────────────────── */
  const parseUrlParams = () => {
    const params = new URLSearchParams(window.location.search);

    // 카테고리
    const category = params.get('category') || 'all';
    state.filters.category = category;

    // 특정 필터 (new, best, sale)
    const quickFilter = params.get('filter');
    if (quickFilter) {
      if (['new', 'best', 'sale'].includes(quickFilter)) {
        state.filters.badge = quickFilter;
      }
    }

    // 검색어
    state.filters.query = params.get('q') || '';

    // UI 동기화 (카테고리 탭)
    refs.filterTabs.forEach(tab => {
      const isActive = tab.dataset.category === category;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });
  };

  /* ─── 이벤트 바인딩 ─────────────────────────────────── */
  const bindEvents = () => {
    // 카테고리 탭
    refs.filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        state.filters.category = tab.dataset.category;
        state.filters.badge = null; // 카테고리 클릭 시 퀵필터 해제

        // UI 업데이트
        refs.filterTabs.forEach(t => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');

        applyFilters();
      });
    });

    // 정렬 변경
    refs.sortSelect?.addEventListener('change', (e) => {
      state.sort = e.target.value;
      applyFilters();
    });

    // 가격 필터 (체크박스)
    refs.priceInputs.forEach(input => {
      input.addEventListener('change', () => {
        const checked = Array.from(refs.priceInputs)
          .filter(i => i.checked)
          .map(i => i.value);
        state.filters.price = checked;
        applyFilters();
      });
    });

    // 사이즈 필터 (칩)
    refs.sizeChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const size = chip.dataset.size;
        if (state.filters.size === size) {
          state.filters.size = null; // 토글 해제
          chip.classList.remove('is-active');
        } else {
          refs.sizeChips.forEach(c => c.classList.remove('is-active'));
          state.filters.size = size;
          chip.classList.add('is-active');
        }
        applyFilters();
      });
    });

    // 필터 초기화 버튼
    refs.resetBtn?.addEventListener('click', resetAllFilters);
  };

  /* ─── 필터 초기화 ───────────────────────────────────── */
  const resetAllFilters = () => {
    state.filters = {
      category: 'all',
      badge: null,
      price: [],
      size: null,
      query: '',
    };
    state.sort = 'newest';

    // UI 리셋
    refs.sortSelect.value = 'newest';
    refs.priceInputs.forEach(i => i.checked = false);
    refs.sizeChips.forEach(c => c.classList.remove('is-active'));
    refs.filterTabs.forEach(t => {
      const isAll = t.dataset.category === 'all';
      t.classList.toggle('is-active', isAll);
    });

    applyFilters();
  };

  /* ─── 필터 및 정렬 적용 ────────────────────────────── */
  const applyFilters = () => {
    let result = [...state.products];

    // 1. 카테고리 필터
    if (state.filters.category !== 'all') {
      result = result.filter(p => p.categoryId === state.filters.category);
    }

    // 2. 퀵 필터 (badge)
    if (state.filters.badge) {
      result = result.filter(p => p.badge === state.filters.badge);
    }

    // 3. 가격 필터
    if (state.filters.price.length > 0) {
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

    // 4. 사이즈 필터
    if (state.filters.size) {
      result = result.filter(p => p.sizes.includes(state.filters.size));
    }

    // 5. 검색어 필터
    if (state.filters.query) {
      const q = state.filters.query.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      );
    }

    // 6. 정렬
    sortProducts(result);

    state.filteredProducts = result;
    render();
  };

  /* ─── 상품 정렬 ────────────────────────────────────── */
  const sortProducts = (list) => {
    switch (state.sort) {
      case 'newest':
        // 데이터상 id 역순을 최신순으로 가정
        list.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'price-low':
        list.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
        break;
      case 'price-high':
        list.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
        break;
      case 'popular':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'review':
        list.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }
  };

  /* ─── 렌더링 (Render) ───────────────────────────────── */
  const render = () => {
    const { grid, count, title, breadcrumb, emptyState } = refs;
    const items = state.filteredProducts;

    // 카운트 및 타이틀 업데이트
    const categoryLabel = state.filters.category.toUpperCase();
    if (title) title.textContent = categoryLabel === 'ALL' ? 'ALL ITEMS' : categoryLabel;
    if (breadcrumb) breadcrumb.textContent = state.filters.category === 'all' ? '전체' : state.filters.category;
    if (count) count.textContent = `${items.length}개의 상품`;

    // 빈 상태 처리
    if (items.length === 0) {
      grid.innerHTML = '';
      emptyState?.removeAttribute('hidden');
      return;
    }
    emptyState?.setAttribute('hidden', '');

    // 결과 렌더링
    grid.innerHTML = items.map(p => createProductCardHtml(p)).join('');

    // 위시리스트 버튼 이벤트 바인딩 (이벤트 위임 권장이나 여기서는 간단히 처리)
    grid.querySelectorAll('.product-card__wish').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // 카드 상세 이동 방지
        e.preventDefault();
        const id = btn.dataset.id;
        const isActive = window.App?.Wishlist.toggle(id);
        btn.classList.toggle('product-card__wish--active', isActive);
      });
    });
  };

  /* ─── 상품 카드 HTML 생성 (BEM) ─────────────────────── */
  const createProductCardHtml = (p) => {
    const { id, brand, name, price, salePrice, badge, mainImg, subImg } = p;
    const isSale = salePrice !== null;
    const currentPrice = isSale ? salePrice : price;
    const isWishlisted = window.App?.Wishlist.has(id);

    // XSS 방지 처리
    const safeName = Utils.escapeHTML(name);
    const safeBrand = Utils.escapeHTML(brand);

    return `
      <article class="product-card" onclick="location.href='./product.html?id=${id}'">
        <div class="product-card__img-wrap">
          ${badge ? `<span class="product-card__badge product-card__badge--${badge}">${badge.toUpperCase()}</span>` : ''}
          <img src="${mainImg}" alt="${safeName}" class="product-card__img product-card__img--main" loading="lazy">
          <img src="${subImg}" alt="${safeName}" class="product-card__img product-card__img--sub" loading="lazy">
          
          <button class="product-card__wish ${isWishlisted ? 'product-card__wish--active' : ''}" 
                  data-id="${id}" aria-label="위시리스트 추가">
            ${Utils.icon('heart')}
          </button>
          
          <div class="product-card__quick-add" onclick="event.stopPropagation(); window.App?.Cart.addItem(window.VARO_DATA.PRODUCTS.find(x=>x.id==='${id}'),'M','블랙')">
            QUICK ADD +
          </div>
        </div>
        
        <div class="product-card__info">
          <p class="product-card__brand">${safeBrand}</p>
          <h3 class="product-card__name">${safeName}</h3>
          <div class="product-card__price-wrap">
            <span class="product-card__price ${isSale ? 'product-card__price--sale' : ''}">
              ${Utils.formatPrice(currentPrice)}
            </span>
            ${isSale ? `
              <span class="product-card__price--original">${Utils.formatPrice(price)}</span>
              <span class="product-card__discount">${Utils.discountRate(price, salePrice)}%</span>
            ` : ''}
          </div>
        </div>
      </article>
    `;
  };

  return { init };
})();

// 초기화 실행
document.addEventListener('DOMContentLoaded', Shop.init);

export default Shop;
