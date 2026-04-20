// 경로: js/main.js
// 공통 로직: 헤더 스크롤 효과, 모바일 메뉴, 검색 오버레이, 장바구니 카운터

'use strict';

const App = (() => {

  /* ── 장바구니 ─────────────────────────────── */
  const Cart = {
    KEY: 'varo_cart',

    getItems() {
      return Utils.storage.get(Cart.KEY) || [];
    },

    addItem(product, size, color, qty = 1) {
      const items = Cart.getItems();
      const existing = items.find(
        i => i.productId === product.id && i.size === size && i.color === color
      );
      if (existing) {
        existing.qty += qty;
      } else {
        items.push({
          productId: product.id,
          name: product.name,
          brand: product.brand,
          price: product.salePrice ?? product.price,
          mainImg: product.mainImg,
          size,
          color,
          qty,
        });
      }
      Utils.storage.set(Cart.KEY, items);
      Cart.updateBadge();
      Utils.showToast('장바구니에 추가되었습니다 🛍', 'success');
    },

    removeItem(index) {
      const items = Cart.getItems();
      items.splice(index, 1);
      Utils.storage.set(Cart.KEY, items);
      Cart.updateBadge();
    },

    updateQty(index, delta) {
      const items = Cart.getItems();
      if (!items[index]) return;
      items[index].qty = Math.max(1, items[index].qty + delta);
      Utils.storage.set(Cart.KEY, items);
      Cart.updateBadge();
    },

    clearAll() {
      Utils.storage.set(Cart.KEY, []);
      Cart.updateBadge();
    },

    getTotal() {
      return Cart.getItems().reduce((sum, i) => sum + i.price * i.qty, 0);
    },

    getCount() {
      return Cart.getItems().reduce((sum, i) => sum + i.qty, 0);
    },

    updateBadge() {
      const count = Cart.getCount();
      document.querySelectorAll('.header-btn__badge').forEach(badge => {
        badge.textContent = count;
        badge.classList.toggle('header-btn__badge--hidden', count === 0);
      });
    },
  };

  /* ── 위시리스트 ────────────────────────────── */
  const Wishlist = {
    KEY: 'varo_wishlist',

    getIds() {
      return Utils.storage.get(Wishlist.KEY) || [];
    },

    toggle(productId) {
      const ids = Wishlist.getIds();
      const idx = ids.indexOf(productId);
      if (idx === -1) {
        ids.push(productId);
        Utils.showToast('위시리스트에 추가되었습니다 🤍');
      } else {
        ids.splice(idx, 1);
        Utils.showToast('위시리스트에서 제거되었습니다');
      }
      Utils.storage.set(Wishlist.KEY, ids);
      return idx === -1;
    },

    has(productId) {
      return Wishlist.getIds().includes(productId);
    },
  };

  /* ── 최근 본 상품 ────────────────────────────── */
  const Recent = {
    KEY: 'varo_recent',
    MAX_COUNT: 5,

    getIds() {
      return Utils.storage.get(Recent.KEY) || [];
    },

    add(productId) {
      if (!productId) return;
      let ids = Recent.getIds();
      // 중복 제거 및 최신순 정렬 (맨 앞으로)
      ids = [productId, ...ids.filter(id => id !== productId)];
      // 최대 개수 제한
      if (ids.length > Recent.MAX_COUNT) ids = ids.slice(0, Recent.MAX_COUNT);

      Utils.storage.set(Recent.KEY, ids);
      Recent.render();
    },

    render() {
      const ids = Recent.getIds();
      if (ids.length === 0) return;

      let sidebar = document.getElementById('recentSidebar');
      if (!sidebar) {
        sidebar = Utils.el('aside', 'recent-sidebar', { id: 'recentSidebar' });
        sidebar.innerHTML = `
          <div class="recent-sidebar__title">RECENT</div>
          <div class="recent-sidebar__list" id="recentList"></div>
        `;
        document.body.appendChild(sidebar);
      }

      const list = sidebar.querySelector('#recentList');
      if (!list) return;

      sidebar.style.display = 'flex'; // 데이터가 있으면 노출

      const products = ids.map(id => window.VARO_DATA?.PRODUCTS?.find(p => p.id === id)).filter(Boolean);

      list.innerHTML = products.map(p => `
        <a href="./product.html?id=${p.id}" class="recent-sidebar__item" title="${p.name}">
          <img src="${p.mainImg}" alt="${p.name}">
        </a>
      `).join('');
    }
  };

  /* ── 헤더 초기화 ────────────────────────────── */
  const initHeader = () => {
    const header = document.querySelector('.site-header');
    if (!header) return;

    // 스크롤 효과
    const onScroll = Utils.debounce(() => {
      header.classList.toggle('site-header--scrolled', window.scrollY > 40);
    }, 50);
    window.addEventListener('scroll', onScroll, { passive: true });

    // 장바구니 배지 초기화
    Cart.updateBadge();
  };

  /* ── 모바일 메뉴 ────────────────────────────── */
  const initMobileMenu = () => {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('hamburger--open');
      mobileNav.classList.toggle('mobile-nav--open', isOpen);
      isOpen ? Utils.lockScroll() : Utils.unlockScroll();
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // 네비 링크 클릭 시 메뉴 닫기
    mobileNav.querySelectorAll('.mobile-nav__link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('hamburger--open');
        mobileNav.classList.remove('mobile-nav--open');
        Utils.unlockScroll();
      });
    });

    // ESC 키
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('mobile-nav--open')) {
        hamburger.classList.remove('hamburger--open');
        mobileNav.classList.remove('mobile-nav--open');
        Utils.unlockScroll();
      }
    });
  };

  /* ── 검색 오버레이 ──────────────────────────── */
  const initSearch = () => {
    const searchBtn = document.querySelector('[data-action="open-search"]');
    const overlay = document.querySelector('.search-overlay');
    const closeBtn = document.querySelector('.search-overlay__close');
    const input = document.querySelector('.search-overlay__input');
    if (!searchBtn || !overlay) return;

    const open = () => {
      overlay.classList.add('search-overlay--open');
      Utils.lockScroll();
      setTimeout(() => input?.focus(), 100);
    };
    const close = () => {
      overlay.classList.remove('search-overlay--open');
      Utils.unlockScroll();
    };

    searchBtn.addEventListener('click', open);
    closeBtn?.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  };

  /* ── 현재 페이지 네비 활성화 ─────────────────── */
  const initActiveNav = () => {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.site-nav__link, .mobile-nav__link').forEach(link => {
      const href = link.getAttribute('href')?.split('/').pop() || '';
      if (href === currentPath) {
        link.classList.add('site-nav__link--active');
      }
    });
  };

  /* ── 이미지 Lazy Load 폴백 (구형 브라우저) ──── */
  const initLazyLoad = () => {
    if ('loading' in HTMLImageElement.prototype) return;
    const images = document.querySelectorAll('img[loading="lazy"]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(({ isIntersecting, target }) => {
        if (isIntersecting) {
          if (target.dataset.src) target.src = target.dataset.src;
          io.unobserve(target);
        }
      });
    }, { rootMargin: '200px' });
    images.forEach(img => io.observe(img));
  };

  /* ── 메가 패널 (MEGA PANEL) ─────────────────── */

  /* ── 공개 API ───────────────────────────────── */
  const init = () => {
    initHeader();
    initMobileMenu();
    initSearch();
    initActiveNav();
    initLazyLoad();
    Recent.render(); // 최근 본 상품 초기 렌더링

    // 상품 상세페이지일 경우 현재 상품을 최근 본 상품에 추가
    const params = new URLSearchParams(window.location.search);
    const prodId = params.get('id');
    if (window.location.pathname.includes('product.html') && prodId) {
      Recent.add(prodId);
    }
  };

  return { init, Cart, Wishlist };
})();

document.addEventListener('DOMContentLoaded', App.init);
