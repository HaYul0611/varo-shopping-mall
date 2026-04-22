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

    // 탭 가시성 강제 확보 (데스크탑)
    ensureNavVisibility() {
      const nav = document.getElementById('varoCategoryNav');
      if (nav) {
        nav.style.cssText = "display: block !important; visibility: visible !important; opacity: 1 !important; height: auto !important; min-height: 40px !important;";
      }
    },

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

    // 탭 가시성 강제 확보
    Auth.ensureNavVisibility();
  };

  /* ── 인증 상태 동기화 (Auth Sync) ──────────── */
  const syncAuthState = () => {
    const user = Utils.storage.get('varo_user');
    const utilNav = document.querySelector('.header-top__util');
    const badge = document.getElementById('userGradeBadge');
    const profileIcon = document.getElementById('headerProfileIcon');

    if (user) {
      if (utilNav) {
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
          <a href="${(user.role === 'ADMIN' || user.grade === 'ADMIN') ? './admin.html' : './mypage.html'}" class="top-util__mypage" style="display:inline-flex; align-items:center; gap:4px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            마이페이지
          </a>
          <span class="header-top__sep" aria-hidden="true"></span>
          <a href="#" id="logoutBtn">로그아웃</a>
        `;

        const logoutHandler = (e) => {
          e.preventDefault();
          Utils.storage.remove('varo_user');
          Utils.showToast('로그아웃 되었습니다.', 'success');
          setTimeout(() => location.href = './index.html', 800);
        };
        document.getElementById('logoutBtn')?.addEventListener('click', logoutHandler);
      }

      // 전역 등급 뱃지 및 아이콘 동기화
      const gradeClass = `is-${user.grade.toLowerCase()}`;
      document.querySelectorAll('.header-top__badge, .member-badge-btn, .user-grade').forEach(badgeEl => {
        badgeEl.textContent = user.grade;
        badgeEl.classList.remove('is-bronze', 'is-silver', 'is-gold', 'is-diamond', 'is-manager', 'is-admin');
        badgeEl.classList.add(gradeClass);
        badgeEl.classList.remove('u-hidden');
      });

      if (profileIcon) {
        profileIcon.href = (user.role === 'ADMIN' || user.grade === 'ADMIN') ? './admin.html' : './mypage.html';
        profileIcon.setAttribute('aria-label', `${user.name}님 계정`);
      }
    } else {
      // 비로그인 상태
      if (badge) badge.classList.add('u-hidden');
      if (profileIcon) {
        profileIcon.href = './login.html';
        profileIcon.setAttribute('aria-label', '로그인');
      }

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
    const overlay = document.querySelector('.mobile-nav-overlay');
    if (!hamburger || !mobileNav) return;

    const toggleMenu = (open) => {
      const isOpen = typeof open === 'boolean' ? open : !mobileNav.classList.contains('is-open');
      hamburger.classList.toggle('is-open', isOpen);
      mobileNav.classList.toggle('is-open', isOpen);
      overlay?.classList.toggle('is-visible', isOpen);
      isOpen ? Utils.lockScroll() : Utils.unlockScroll();
      hamburger.setAttribute('aria-expanded', String(isOpen));
    };

    hamburger.addEventListener('click', () => toggleMenu());
    overlay?.addEventListener('click', () => toggleMenu(false));

    // 네비 링크 클릭 시 메뉴 닫기
    mobileNav.querySelectorAll('.mobile-nav__link').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // ESC 키
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
        toggleMenu(false);
      }
    });
  };

  /* ── 검색 오버레이 ──────────────────────────── */
  const initSearch = () => {
    const searchBtn = document.getElementById('searchToggle');
    const overlay = document.getElementById('searchOverlay');
    const closeBtn = document.getElementById('searchClose');
    const input = document.getElementById('searchInput');
    if (!searchBtn || !overlay) return;

    const open = () => {
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      Utils.lockScroll();
      setTimeout(() => input?.focus(), 100);
    };
    const close = () => {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
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
    document.querySelectorAll('.category-nav__item a, .mobile-nav__link').forEach(link => {
      const href = link.getAttribute('href')?.split('/').pop() || '';
      if (href && currentPath && href.includes(currentPath)) {
        link.classList.add('is-active');
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
    // 이미 초기화되었는지 확인 (중복 방지)
    if (document.body.dataset.initialized === 'true') return;

    initHeader();
    initMobileMenu();
    initSearch();
    initActiveNav();
    initLazyLoad();
    syncAuthState(); // 초기 인증 상태 반영
    initAuthSync();  // 실시간 동기화 시작
    if (window.API?.syncUI) window.API.syncUI(); // 등급 배지 등 API 연동 UI 동기화
    Recent.render(); // 최근 본 상품 초기 렌더링

    // 상품 상세페이지일 경우 현재 상품을 최근 본 상품에 추가
    const params = new URLSearchParams(window.location.search);
    const prodId = params.get('id');
    if (window.location.pathname.includes('product.html') && prodId) {
      Recent.add(prodId);
    }

    document.body.dataset.initialized = 'true';
    console.log('[App] Initialized');
  };

  return { init, Cart, Wishlist, Auth, Inquiry };
})();

// 전역에서 App에 접근 가능하도록 노출 (auth.js 등 모듈 연동용)
window.App = App;

// 실시간 동기화 이벤트 수신
window.addEventListener('varo:authChange', () => {
  App.init(); // 상태 재동기화
});

// 컴포넌트 로드 완료 후 초기화 (동적 로딩 대응)
document.addEventListener('varo:componentsLoaded', () => {
  App.init();

  // 네비게이션 탭 강제 생성 및 주입 (HTML 누락/파싱 오류 원천 차단)
  let nav = document.getElementById('varoCategoryNav');
  const header = document.getElementById('siteHeader');

  if (!nav && header) {
    console.log('[App] Nav missing, creating dynamically...');
    const navHTML = `
      <nav class="category-nav" id="varoCategoryNav" style="display: block !important; visibility: visible !important; background: #fff !important; border-bottom: 1px solid #ebebeb !important; min-height: 50px !important; opacity: 1 !important; width: 100% !important; position: relative !important; z-index: 100 !important;">
        <ul class="category-nav__list" style="display: flex !important; align-items: center !important; justify-content: space-between !important; margin: 0 auto !important; padding: 0 24px !important; list-style: none !important; gap: 10px !important; min-height: 50px !important; flex-wrap: wrap !important; max-width: 1440px !important;">
          <li class="category-nav__item"><a href="./shop.html?filter=best" style="font-size: 13px !important; font-weight: 700 !important; color: #000 !important; text-decoration: none !important; white-space: nowrap !important;">BEST</a></li>
          <li class="category-nav__item"><a href="./shop.html?filter=new" style="font-size: 13px !important; font-weight: 700 !important; color: #D96B3C !important; text-decoration: none !important; white-space: nowrap !important;">NEW 5%</a></li>
          <li class="category-nav__item"><a href="./shop.html" style="font-size: 13px !important; font-weight: 700 !important; color: #000 !important; text-decoration: none !important; white-space: nowrap !important;">COLLECTION</a></li>
          <li class="category-nav__item has-sub">
            <a href="./shop.html?category=outer" style="font-size: 12px !important; font-weight: 500 !important; color: #333 !important; text-decoration: none !important; white-space: nowrap !important;">OUTER</a>
            <ul class="sub-menu">
              <li><a href="./shop.html?category=outer">전체보기</a></li>
              <li><a href="./shop.html?sub=jacket">자켓</a></li>
              <li><a href="./shop.html?sub=coat">코트</a></li>
              <li><a href="./shop.html?sub=padding">패딩</a></li>
              <li><a href="./shop.html?sub=jumper">점퍼</a></li>
              <li><a href="./shop.html?sub=leather">레더/무스탕</a></li>
            </ul>
          </li>
          <li class="category-nav__item has-sub">
            <a href="./shop.html?category=shirt" style="font-size: 12px !important; font-weight: 500 !important; color: #333 !important; text-decoration: none !important; white-space: nowrap !important;">SHIRT</a>
            <ul class="sub-menu">
              <li><a href="./shop.html?category=shirt">전체보기</a></li>
              <li><a href="./shop.html?sub=shortshirt">반팔셔츠</a></li>
              <li><a href="./shop.html?sub=longshirt">긴팔셔츠</a></li>
              <li><a href="./shop.html?sub=overshirt">오버셔츠</a></li>
              <li><a href="./shop.html?sub=denim-shirt">데님셔츠</a></li>
            </ul>
          </li>
          <li class="category-nav__item has-sub">
            <a href="./shop.html?category=top" style="font-size: 12px !important; font-weight: 500 !important; color: #333 !important; text-decoration: none !important; white-space: nowrap !important;">TOP</a>
            <ul class="sub-menu">
              <li><a href="./shop.html?category=top">전체보기</a></li>
              <li><a href="./shop.html?sub=shorttee">반팔티</a></li>
              <li><a href="./shop.html?sub=longtee">긴팔티</a></li>
              <li><a href="./shop.html?sub=sweatshirt">맨투맨</a></li>
              <li><a href="./shop.html?sub=hoodie">후드티</a></li>
              <li><a href="./shop.html?sub=sleeveless">민소매</a></li>
            </ul>
          </li>
          <li class="category-nav__item has-sub">
            <a href="./shop.html?category=bottom" style="font-size: 12px !important; font-weight: 500 !important; color: #333 !important; text-decoration: none !important; white-space: nowrap !important;">BOTTOM</a>
            <ul class="sub-menu">
              <li><a href="./shop.html?category=bottom">전체보기</a></li>
              <li><a href="./shop.html?sub=denim">데님팬츠</a></li>
              <li><a href="./shop.html?sub=slacks">슬랙스</a></li>
              <li><a href="./shop.html?sub=cargo">카고팬츠</a></li>
              <li><a href="./shop.html?sub=jogger">조거팬츠</a></li>
              <li><a href="./shop.html?sub=shorts">반바지</a></li>
            </ul>
          </li>
          <li class="category-nav__item has-sub">
            <a href="./shop.html?category=knit" style="font-size: 12px !important; font-weight: 500 !important; color: #333 !important; text-decoration: none !important; white-space: nowrap !important;">KNIT</a>
            <ul class="sub-menu">
              <li><a href="./shop.html?category=knit">전체보기</a></li>
              <li><a href="./shop.html?sub=pullover">풀오버</a></li>
              <li><a href="./shop.html?sub=zipup">집업니트</a></li>
              <li><a href="./shop.html?sub=cardigan">가디건</a></li>
              <li><a href="./shop.html?sub=vest">니트베스트</a></li>
            </ul>
          </li>
          <li class="category-nav__item has-sub">
            <a href="./shop.html?category=shoes" style="font-size: 12px !important; font-weight: 500 !important; color: #333 !important; text-decoration: none !important; white-space: nowrap !important;">SHOES</a>
            <ul class="sub-menu">
              <li><a href="./shop.html?category=shoes">전체보기</a></li>
              <li><a href="./shop.html?sub=sneakers">스니커즈</a></li>
              <li><a href="./shop.html?sub=loafer">로퍼</a></li>
              <li><a href="./shop.html?sub=sandal">샌들</a></li>
              <li><a href="./shop.html?sub=boots">부츠</a></li>
            </ul>
          </li>
          <li class="category-nav__item"><a href="./event.html" style="font-size: 13px !important; font-weight: 700 !important; color: #D96B3C !important; text-decoration: none !important; white-space: nowrap !important;">1+1 EVENT</a></li>
          <li class="category-nav__item"><a href="./community.html" style="font-size: 13px !important; font-weight: 500 !important; color: #333 !important; text-decoration: none !important; white-space: nowrap !important;">COMMUNITY</a></li>
        </ul>
      </nav>
    `;
    header.insertAdjacentHTML('beforeend', navHTML);
    nav = document.getElementById('varoCategoryNav');

    // 강제 주입 후 메가메뉴 다시 바인딩
    if (window.MegaMenu) {
      setTimeout(() => { window.MegaMenu.init(); }, 100);
    }

  }

  if (nav) {
    nav.style.cssText = "display: block !important; visibility: visible !important; opacity: 1 !important; height: auto !important; min-height: 50px !important; width: 100% !important;";
    console.log('[App] VaroCategoryNav visibility established');
  }
});

// 직접 로드된 경우 (컴포넌트 로더 미사용 페이지 등) 대비
document.addEventListener('DOMContentLoaded', () => {
  // 0.5초 후에도 컴포넌트 로드 이벤트가 없으면 직접 초기화 시도
  setTimeout(() => {
    if (document.body.dataset.initialized !== 'true') {
      App.init();
    }
  }, 500);
});
