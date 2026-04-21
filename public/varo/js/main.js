'use strict';

// 테마 및 등급 클래스 즉시 적용 (FOUC 방지)
(() => {
  try {
    const user = JSON.parse(localStorage.getItem('varo_user') || 'null');
    if (user && user.grade) {
      document.documentElement.classList.add('is-' + user.grade.toLowerCase());
    }

    // 보호된 페이지 리다이렉트 처리
    const protectedPages = ['mypage.html', 'checkout.html'];
    if (protectedPages.some(page => window.location.pathname.includes(page)) && !user) {
      alert('로그인이 필요한 페이지입니다.');
      window.location.replace('./login.html');
    }
  } catch (e) { }
})();

import Utils from './utils.js';

const App = (() => {

  /* ── 장바구니 CRUD ─────────────────────────── */
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

    // 단일 삭제
    removeItem(index) {
      const items = Cart.getItems();
      items.splice(index, 1);
      Utils.storage.set(Cart.KEY, items);
      Cart.updateBadge();
      Utils.showToast('상품이 삭제되었습니다.');
    },

    // 다중 삭제
    removeSelected(indices) {
      let items = Cart.getItems();
      // 인덱스가 꼬이지 않도록 역순으로 삭제하거나 필터링
      items = items.filter((_, idx) => !indices.includes(idx));
      Utils.storage.set(Cart.KEY, items);
      Cart.updateBadge();
      Utils.showToast('선택한 상품이 삭제되었습니다.', 'success');
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
      document.querySelectorAll('.header-btn__badge, .header-main__actions .cart-badge').forEach(badge => {
        badge.textContent = count;
        badge.style.display = count === 0 ? 'none' : 'flex';
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

  /* ── 유저 관리 (Auth/User CRUD) ─────────── */
  const Auth = {
    USERS_KEY: 'varo_users',
    SESSION_KEY: 'varo_user',

    // 가입 (Create)
    signup(userData) {
      const users = Utils.storage.get(Auth.USERS_KEY) || [];
      if (users.find(u => u.email === userData.email)) {
        throw new Error('이미 가입된 이메일입니다.');
      }
      // 가입 시 기본 등급 부여
      userData.grade = userData.grade || 'BRONZE';
      users.push(userData);
      Utils.storage.set(Auth.USERS_KEY, users);
      return true;
    },

    // 로그인 (Read)
    login(email, password) {
      let users = Utils.storage.get(Auth.USERS_KEY) || [];

      // 초기 데이터 시딩 (어드민/데모 계정이 없는 경우)
      if (!users.find(u => u.email === 'admin@varo.com')) {
        users.push({
          email: 'admin@varo.com',
          password: 'varo2026admin',
          name: '관리자',
          grade: 'ADMIN',
          role: 'ADMIN',
          is_admin: true
        });
        users.push({
          email: 'demo@varo.com',
          password: 'varo2026',
          name: '데모유저',
          grade: 'GOLD',
          role: 'USER'
        });
        Utils.storage.set(Auth.USERS_KEY, users);
      }

      // 문의 내역 시딩
      if (!Utils.storage.get('varo_inquiries')) {
        Utils.storage.set('varo_inquiries', [
          { id: 1, userEmail: 'demo@varo.com', userName: '데모유저', title: '배송 언제 되나요?', content: '어제 주문했는데 언제쯤 받아볼 수 있을까요?', date: '2026-04-20', status: '답변완료', reply: '안녕하세요 고객님, 해당 상품은 금일 출고 예정입니다. 감사합니다.' },
          { id: 2, userEmail: 'demo@varo.com', userName: '데모유저', title: '사이즈 문의 드립니다.', content: '175/70 인데 L 사이즈 괜찮을까요?', date: '2026-04-21', status: '대기중', reply: null }
        ]);
      }

      // 카드 정보 시딩
      if (!Utils.storage.get('varo_cards')) {
        Utils.storage.set('varo_cards', [
          { id: 'c1', type: 'Hyundai Card', last4: '1234' },
          { id: 'c2', type: 'Samsung Card', last4: '8899' }
        ]);
      }

      const user = users.find(u => u.email === email && u.password === password);
      if (!user) throw new Error('이메일 또는 비밀번호가 일치하지 않습니다.');

      const { password: _, ...safeUser } = user;
      Utils.storage.set(Auth.SESSION_KEY, safeUser);

      // 토큰이 없으면 생성 (로컬 환경 권한 체크용)
      if (!localStorage.getItem('varo_token')) {
        localStorage.setItem('varo_token', 'simulated_admin_token_' + Date.now());
      }

      return safeUser;
    },

    // 정보 수정 (Update)
    updateProfile(updatedData) {
      const sessionUser = Utils.storage.get(Auth.SESSION_KEY);
      if (!sessionUser) return;

      const users = Utils.storage.get(Auth.USERS_KEY) || [];
      const idx = users.findIndex(u => u.email === sessionUser.email);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...updatedData };
        Utils.storage.set(Auth.USERS_KEY, users);

        const { password: _, ...safeProfile } = users[idx];
        Utils.storage.set(Auth.SESSION_KEY, safeProfile);
        return safeProfile;
      }
    },

    // 가출 (Delete)
    withdraw() {
      const sessionUser = Utils.storage.get(Auth.SESSION_KEY);
      if (!sessionUser) return;

      const users = Utils.storage.get(Auth.USERS_KEY) || [];
      const filtered = users.filter(u => u.email !== sessionUser.email);
      Utils.storage.set(Auth.USERS_KEY, filtered);
      Utils.storage.remove(Auth.SESSION_KEY);
      return true;
    },

    getUser() {
      return Utils.storage.get(Auth.SESSION_KEY);
    }
  };

  /* ── 문의내역 관리 (Inquiry CRUD) ─────────── */
  const Inquiry = {
    KEY: 'varo_inquiries',

    submit(data) {
      const list = Utils.storage.get(Inquiry.KEY) || [];
      const user = Auth.getUser();
      list.push({
        ...data,
        id: Date.now(),
        userEmail: user?.email || 'guest',
        userName: user?.name || '비회원',
        date: new Date().toISOString().split('T')[0],
        status: '답변대기'
      });
      Utils.storage.set(Inquiry.KEY, list);
    },

    getMyList() {
      const list = Utils.storage.get(Inquiry.KEY) || [];
      const user = Auth.getUser();
      if (!user) return [];
      return list.filter(i => i.userEmail === user.email);
    }
  };

  /* ── 최근 본 상품 (Recent View) ────────────── */
  const Recent = {
    KEY: 'varo_recent',
    MAX_ITEMS: 10,

    getIds() {
      return Utils.storage.get(this.KEY) || [];
    },

    add(productId) {
      if (!productId) return;
      let ids = this.getIds();
      // 기존에 있으면 제거하고 맨 앞으로 추가 (최신순)
      ids = [productId, ...ids.filter(id => id !== productId)].slice(0, this.MAX_ITEMS);
      Utils.storage.set(this.KEY, ids);
      this.render();
    },

    render() {
      // Currently no UI container for this, maintaining structure for future use

      const container = document.getElementById('recentProductsList');
      if (!container) return;

      const ids = this.getIds();
      if (ids.length === 0) {
        container.innerHTML = '<p class="empty-msg">최근 본 상품이 없습니다.</p>';
        return;
      }

      // data.js의 PRODUCTS에서 정보를 가져와서 렌더링
      const products = ids.map(id => window.VARO_DATA?.PRODUCTS.find(p => p.id === id)).filter(Boolean);
      container.innerHTML = products.map(p => `
        <div class="recent-item">
          <a href="./product.html?id=${p.id}">
            <img src="${p.mainImg}" alt="${p.name}">
          </a>
        </div>
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

    // 인증 상태 동기화
    syncAuthState();
  };

  /* ── 인증 상태 동기화 (Auth Sync) ──────────── */
  const syncAuthState = () => {
    const user = Utils.storage.get('varo_user');
    const utilNav = document.querySelector('.header-top__util');
    const badge = document.getElementById('userGradeBadge');

    if (user) {
      if (utilNav) {
        // 로그인 상태: [이름]님 안녕하세요. / 로그아웃 / 주문조회 / 마이페이지
        const gradeClass = `is-${user.grade.toLowerCase()}`;
        utilNav.innerHTML = `
          <div class="user-info-group">
            <div class="user-avatar-mini" id="topAvatar">
              ${user.avatarUrl
            ? `<img src="${user.avatarUrl}" style="width:100%; height:100%; border-radius:50%; object-fit:cover">`
            : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>`
          }
            </div>
            <span class="user-greeting">안녕하세요, <strong>${user.name}</strong>님</span>
            <span class="header-top__badge ${gradeClass}">${user.grade}</span>
          </div>
          <span class="header-top__sep" aria-hidden="true"></span>
          <a href="./cart.html">주문조회</a>
          <span class="header-top__sep" aria-hidden="true"></span>
          <a href="${(user.role === 'ADMIN' || user.grade === 'ADMIN') ? './admin.html' : './mypage.html'}">마이페이지</a>
          <span class="header-top__sep" aria-hidden="true"></span>
          <a href="#" id="logoutBtn">로그아웃</a>
        `;

        // 로그아웃 버튼 이벤트 (둘 다 지원)
        const logoutHandler = (e) => {
          e.preventDefault();
          Utils.storage.remove('varo_user');
          Utils.showToast('로그아웃 되었습니다.', 'success');
          setTimeout(() => location.href = './index.html', 800);
        };
        document.getElementById('logoutBtn')?.addEventListener('click', logoutHandler);
        document.getElementById('btnLogout')?.addEventListener('click', logoutHandler);
      }

      // 전역 등급 뱃지 컬러 동기화
      const gradeClass = `is-${user.grade.toLowerCase()}`;
      document.querySelectorAll('.header-top__badge, .member-badge-btn, .user-grade').forEach(badgeEl => {
        const isManager = user.email === 'admin@varo.com' || user.role === 'ADMIN';
        const isSidebar = badgeEl.classList.contains('user-grade');

        // 텍스트 업데이트
        if (isSidebar) {
          badgeEl.textContent = `${user.grade} MEMBER`;
        } else {
          badgeEl.textContent = isManager ? `관리자(${user.grade})` : user.grade;
        }

        // 클래스 초기화 후 부여
        badgeEl.classList.remove('is-bronze', 'is-silver', 'is-gold', 'is-dia', 'is-manager', 'is-admin');
        badgeEl.classList.add(gradeClass);
        if (isManager) badgeEl.classList.add('is-admin');

        badgeEl.style.display = 'inline-block';
        if (isManager) badgeEl.style.border = '1px solid gold';
      });
    } else {
      if (badge) badge.style.display = 'none';
      if (utilNav) {
        utilNav.innerHTML = `
          <a href="./signup.html">회원가입</a>
          <span class="header-top__sep" aria-hidden="true"></span>
          <a href="./login.html">로그인</a>
          <span class="header-top__sep" aria-hidden="true"></span>
          <a href="./cart.html">주문조회</a>
          <span class="header-top__sep" aria-hidden="true"></span>
          <a href="./mypage.html">마이페이지</a>
        `;
      }
    }
  };

  /* ── 브라우저 탭 간 실시간 동기화 (Event Loop) ── */
  const initAuthSync = () => {
    window.addEventListener('storage', (e) => {
      // varo_user 키가 변경되었을 때 (로그인/로그아웃)
      if (e.key === 'varo_user') {
        syncAuthState();
        // 마이페이지나 장바구니 등 보안 페이지는 리다이렉트 처리 필요할 수 있음
        if (!e.newValue && (location.pathname.includes('mypage.html') || location.pathname.includes('checkout.html'))) {
          alert('세션이 만료되어 메인으로 이동합니다.');
          location.replace('./index.html');
        }
      }
    });
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

  /* ── 공개 API ───────────────────────────────── */
  const init = () => {
    initHeader();
    initMobileMenu();
    initSearch();
    initActiveNav();
    initLazyLoad();
    syncAuthState(); // 초기 인증 상태 반영
    initAuthSync();  // 실시간 동기화 시작
    Recent.render(); // 최근 본 상품 초기 렌더링

    // 상품 상세페이지일 경우 현재 상품을 최근 본 상품에 추가
    const params = new URLSearchParams(window.location.search);
    const prodId = params.get('id');
    if (window.location.pathname.includes('product.html') && prodId) {
      Recent.add(prodId);
    }
  };

  return { init, Cart, Wishlist, Auth, Inquiry };
})();

// 전역에서 App에 접근 가능하도록 노출 (auth.js 등 모듈 연동용)
window.App = App;

// 실시간 동기화 이벤트 수신
window.addEventListener('varo:authChange', () => {
  App.init(); // 상태 재동기화
});

document.addEventListener('DOMContentLoaded', App.init);
