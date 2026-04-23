// js/main.js — VARO Shopping Mall Core Logic
'use strict';

// Theme & Grade instant apply (Prevent FOUC)
(() => {
  try {
    const user = JSON.parse(localStorage.getItem('varo_user') || 'null');
    if (user && user.grade) {
      document.documentElement.classList.add('is-' + user.grade.toLowerCase());
    }
    const protectedPages = ['mypage.html', 'checkout.html'];
    if (protectedPages.some(page => window.location.pathname.includes(page)) && !user) {
      alert('로그인이 필요한 페이지입니다.');
      window.location.replace('./login.html');
    }
  } catch (e) { }
})();

const App = (() => {
  const Cart = {
    KEY: 'varo_cart',
    getItems() { return JSON.parse(localStorage.getItem(this.KEY) || '[]'); },
    addItem(product, size, color, qty = 1) {
      const items = this.getItems();
      const existing = items.find(i => i.productId === product.id && i.size === size && i.color === color);
      if (existing) existing.qty += qty;
      else items.push({ productId: product.id, name: product.name, price: product.salePrice ?? product.price, mainImg: product.mainImg, size, color, qty });
      localStorage.setItem(this.KEY, JSON.stringify(items));
      this.updateBadge();
      if (window.Utils?.showToast) window.Utils.showToast('장바구니에 추가되었습니다 🛍', 'success');
    },
    updateBadge() {
      const count = this.getItems().reduce((sum, i) => sum + i.qty, 0);
      document.querySelectorAll('.header-btn__badge, .cart-badge').forEach(badge => {
        badge.textContent = count;
        badge.style.display = count === 0 ? 'none' : 'flex';
      });
    }
  };

  const syncAuthState = () => {
    const user = JSON.parse(localStorage.getItem('varo_user') || 'null');
    const utilNav = document.querySelector('.header-top__util');
    const profileIcon = document.getElementById('headerProfileIcon');

    if (user) {
      if (utilNav) {
        // 등급 명칭 매핑 (영문 표기 원칙)
        const gradeMap = {
          'BASIC': 'BRONZE', 'BRONZE': 'BRONZE',
          'SILVER': 'SILVER', 'GOLD': 'GOLD',
          'DIA': 'DIA',
          'MANAGER': 'MANAGER', 'ADMIN': 'ADMIN'
        };
        let displayGrade = gradeMap[user.grade] || user.grade || 'BRONZE';

        const gradeClass = `is-${(user.grade || 'bronze').toLowerCase()}`;

        // 아바타가 없을 경우 기본 아이콘 표시 (마이페이지와 동일하게 처리)
        const avatarHtml = user.avatar
          ? `<div class="user-avatar-mini"><img src="${user.avatar}" alt="${user.name}"></div>`
          : `<div class="user-avatar-mini"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>`;

        const isAdmin = user.role === 'ADMIN' || user.grade === 'ADMIN';
        const adminBtnHtml = isAdmin
          ? `<a href="./admin.html" class="header-admin-btn">관리자 모드</a><span class="header-top__sep"></span>`
          : '';
        const orderInquiryHtml = isAdmin
          ? ''
          : `<a href="./cart.html">주문조회</a><span class="header-top__sep"></span>`;

        utilNav.innerHTML = `
          <div class="user-info-group">
            ${avatarHtml}
            <span class="user-greeting">안녕하세요, <strong>${user.name}</strong>님</span>
            <span class="header-top__badge ${gradeClass}">${displayGrade}</span>
          </div>
          <span class="header-top__sep"></span>
          ${adminBtnHtml}
          ${orderInquiryHtml}
          <a href="./mypage.html">마이페이지</a>
          <span class="header-top__sep"></span>
          <a href="#" id="logoutBtn">로그아웃</a>
        `;
        document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.removeItem('varo_user');
          location.replace('./index.html');
        });
      }

      // 메인 헤더 프로필 아이콘 링크만 업데이트
      if (profileIcon) {
        profileIcon.href = './mypage.html';
      }
    } else {
      if (utilNav) {
        utilNav.innerHTML = `
          <a href="./signup.html">회원가입</a>
          <span class="header-top__sep"></span>
          <a href="./login.html">로그인</a>
          <span class="header-top__sep"></span>
          <a href="./cart.html">주문조회</a>
          <span class="header-top__sep"></span>
          <a href="./mypage.html">마이페이지</a>
        `;
      }
      if (profileIcon) {
        profileIcon.href = './login.html';
      }
    }
  };

  const init = () => {
    if (document.body.dataset.initialized === 'true') return;
    Cart.updateBadge();
    syncAuthState();
    if (window.API?.syncUI) window.API.syncUI();
    document.body.dataset.initialized = 'true';
    console.log('[App] Initialized');

    // Header Search Toggle Logic
    const searchToggle = document.getElementById('searchToggle');
    const searchInput = document.getElementById('headerSearchInput');
    if (searchToggle && searchInput) {
      searchToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const computedWidth = window.getComputedStyle(searchInput).width;
        if (searchInput.style.width === '0px' || searchInput.style.width === '0' || computedWidth === '0px') {
          searchInput.style.width = '150px';
          searchInput.style.opacity = '1';
          searchInput.style.pointerEvents = 'auto';
          searchInput.focus();
        } else {
          if (searchInput.value.trim()) {
            location.href = `./shop.html?search=${encodeURIComponent(searchInput.value.trim())}`;
          } else {
            searchInput.style.width = '0px';
            searchInput.style.opacity = '0';
            searchInput.style.pointerEvents = 'none';
          }
        }
      });
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && searchInput.value.trim()) {
          e.preventDefault();
          location.href = `./shop.html?search=${encodeURIComponent(searchInput.value.trim())}`;
        }
      });
    }

    // Real-time Data Sync Listener
    window.addEventListener('varo:dataChange', (e) => {
      console.log('[VARO] Real-time Data Update:', e.detail);
      if (['products', 'banners', 'categories'].includes(e.detail.type)) {
        location.reload();
      } else if (e.detail.type === 'auth') {
        syncAuthState();
      }
    });

    window.addEventListener('storage', (e) => {
      if (e.key === 'varo_last_sync_time') location.reload();
    });
  };

  return { init, Cart };
})();

window.App = App;

const startApp = () => {
  if (window.varoAppInitialized) return;
  App.init();

  // CATEGORY TABS RESTORATION (User Request)
  const header = document.getElementById('siteHeader');
  let nav = document.getElementById('varoCategoryNav');

  if (header) {
    if (nav) nav.remove();
    const navHTML = `
      <nav class="category-nav" id="varoCategoryNav" style="display: block !important; visibility: visible !important; background: #fff !important; border-bottom: 1px solid #ebebeb !important; min-height: 50px !important; width: 100% !important; z-index: 100 !important;">
        <ul class="category-nav__list" style="display: flex !important; align-items: center !important; justify-content: space-between !important; margin: 0 auto !important; padding: 0 24px !important; list-style: none !important; gap: 10px !important; min-height: 50px !important; flex-wrap: wrap !important; max-width: 1440px !important;">
          <li class="category-nav__item"><a href="./shop.html?filter=best" style="font-size: 13px !important; font-weight: 700 !important; color: #000 !important;">BEST</a></li>
          <li class="category-nav__item"><a href="./shop.html?filter=new" style="font-size: 13px !important; font-weight: 700 !important; color: #D96B3C !important;">NEW 5%</a></li>
          <li class="category-nav__item"><a href="./shop.html" style="font-size: 13px !important; font-weight: 700 !important; color: #000 !important;">COLLECTION</a></li>
          <li class="category-nav__item has-sub">
            <a href="./shop.html?category=outer" style="font-size: 12px !important; font-weight: 500 !important; color: #333 !important;">OUTER</a>
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
            <a href="./shop.html?category=shirt" style="font-size: 12px !important; font-weight: 500 !important; color: #333 !important;">SHIRT</a>
            <ul class="sub-menu">
              <li><a href="./shop.html?category=shirt">전체보기</a></li>
              <li><a href="./shop.html?sub=shortshirt">반팔셔츠</a></li>
              <li><a href="./shop.html?sub=longshirt">긴팔셔츠</a></li>
              <li><a href="./shop.html?sub=overshirt">오버셔츠</a></li>
              <li><a href="./shop.html?sub=denim-shirt">데님셔츠</a></li>
            </ul>
          </li>
          <li class="category-nav__item has-sub">
            <a href="./shop.html?category=top" style="font-size: 12px !important; font-weight: 500 !important; color: #333 !important;">TOP</a>
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
            <a href="./shop.html?category=bottom" style="font-size: 12px !important; font-weight: 500 !important; color: #333 !important;">BOTTOM</a>
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
            <a href="./shop.html?category=knit" style="font-size: 12px !important; font-weight: 500 !important; color: #333 !important;">KNIT</a>
            <ul class="sub-menu">
              <li><a href="./shop.html?category=knit">전체보기</a></li>
              <li><a href="./shop.html?sub=pullover">풀오버</a></li>
              <li><a href="./shop.html?sub=zipup">집업니트</a></li>
              <li><a href="./shop.html?sub=cardigan">가디건</a></li>
              <li><a href="./shop.html?sub=vest">니트베스트</a></li>
            </ul>
          </li>
          <li class="category-nav__item has-sub">
            <a href="./shop.html?category=shoes" style="font-size: 12px !important; font-weight: 500 !important; color: #333 !important;">SHOES</a>
            <ul class="sub-menu">
              <li><a href="./shop.html?category=shoes">전체보기</a></li>
              <li><a href="./shop.html?sub=sneakers">스니커즈</a></li>
              <li><a href="./shop.html?sub=loafer">로퍼</a></li>
              <li><a href="./shop.html?sub=sandal">샌들</a></li>
              <li><a href="./shop.html?sub=boots">부츠</a></li>
            </ul>
          </li>
          <li class="category-nav__item"><a href="./event.html" style="font-size: 13px !important; font-weight: 700 !important; color: #D96B3C !important;">1+1 EVENT</a></li>
          <li class="category-nav__item has-sub">
            <a href="./community.html" style="font-size: 13px !important; font-weight: 500 !important; color: #333 !important;">COMMUNITY</a>
            <ul class="sub-menu">
              <li><a href="./community.html?tab=notice">공지사항</a></li>
              <li><a href="./community.html?tab=faq">FAQ</a></li>
              <li><a href="./community.html?tab=qna">Q&A</a></li>
              <li><a href="./community.html?tab=review">리뷰</a></li>
              <li><a href="./event.html">이벤트</a></li>
            </ul>
          </li>
        </ul>
      </nav>
    `;
    header.insertAdjacentHTML('beforeend', navHTML);
    nav = document.getElementById('varoCategoryNav');
    if (window.MegaMenu) setTimeout(() => { window.MegaMenu.init(); }, 100);

    if (nav) {
      nav.style.setProperty('visibility', 'visible', 'important');
      nav.style.setProperty('opacity', '1', 'important');
      nav.style.setProperty('height', 'auto', 'important');
      nav.style.setProperty('min-height', '50px', 'important');
      nav.style.setProperty('width', '100%', 'important');
      nav.style.setProperty('z-index', '100', 'important');
      nav.style.setProperty('background', '#fff', 'important');
    }
  }

  // 로그인 여부에 따른 프로필 아이콘 링크 변경
  const profileIcon = document.getElementById('headerProfileIcon');
  if (profileIcon && localStorage.getItem('varo_user')) {
    profileIcon.href = './mypage.html';
  }

  window.varoAppInitialized = true;
};

if (window.varoComponentsLoaded) {
  startApp();
} else {
  document.addEventListener('varo:componentsLoaded', startApp);
}
