// 경로: js/mega-menu.js
// VARO 2026 — 이미지 패널 메가메뉴 로직
// 모든 HTML 파일 <body> 맨 아래 <script src="./js/mega-menu.js"></script> 추가

'use strict';

const MegaMenu = (() => {

  /* ── 카테고리별 메가메뉴 데이터 ──────────────────── */
  const MEGA_DATA = {
    outer: {
      title: '아우터',
      cats: [
        { label: '전체보기', href: './shop.html?category=outer', count: 147 },
        { label: '자켓', href: './shop.html?sub=jacket', count: 38 },
        { label: '코트', href: './shop.html?sub=coat', count: 29 },
        { label: '패딩', href: './shop.html?sub=padding', count: 24 },
        { label: '점퍼', href: './shop.html?sub=jumper', count: 31 },
        { label: '레더/무스탕', href: './shop.html?sub=leather', count: 25 },
      ],
      products: [
        { name: '미니멀 울 발마칸 코트', price: 348000, salePrice: 289000, badge: 'best', img: './assets/trendy/korean_minimal_balmacaan_coat_1776533515652.png', href: './product.html?id=P003' },
        { name: '나일론 퀄팅 패딩', price: 148000, salePrice: null, badge: 'new', img: './assets/trendy/product_padding.png', href: './shop.html?sub=padding' },
        { name: '미니멀 원버튼 블레이저', price: 159000, salePrice: null, badge: 'new', img: './assets/trendy/korean_minimal_blazer_black_1776533901701.png', href: './product.html?id=P008' },
        { name: '벨티드 레더 자켓', price: 198000, salePrice: 168000, badge: 'sale', img: './assets/trendy/korean_leather_jacket_black_1776533955223.png', href: './product.html?id=P007' },
        { name: '울 체스터 코트', price: 218000, salePrice: 178000, badge: 'sale', img: './assets/trendy/hero_coat.png', href: './shop.html?sub=coat' },
      ],
      promo: '아우터 전품목 5% 추가 적립',
    },
    shirt: {
      title: '셔츠',
      cats: [
        { label: '전체보기', href: './shop.html?category=shirt', count: 89 },
        { label: '반팔셔츠', href: './shop.html?sub=shortshirt', count: 22 },
        { label: '긴팔셔츠', href: './shop.html?sub=longshirt', count: 31 },
        { label: '오버셔츠', href: './shop.html?sub=overshirt', count: 18 },
        { label: '데님셔츠', href: './shop.html?sub=denim-shirt', count: 18 },
      ],
      products: [
        { name: '오버핏 옥스포드 셔츠', price: 65000, salePrice: null, badge: 'new', img: './assets/trendy/korean_oversized_stripe_shirt_1776533534047.png', href: './product.html?id=P004' },
        { name: '오버핏 체크 셔츠', price: 72000, salePrice: 58000, badge: 'sale', img: './assets/trendy/product_check_shirt.png', href: './shop.html?sub=longshirt' },
        { name: '데님 오버셔츠', price: 84000, salePrice: null, badge: 'new', img: './assets/trendy/hero_shirt.png', href: './shop.html?sub=denim-shirt' },
        { name: '와이드 반팔 셔츠', price: 52000, salePrice: null, badge: null, img: './assets/trendy/hero_shirt.png', href: './shop.html?sub=shortshirt' },
        { name: '블록 스트라이프 셔츠', price: 62000, salePrice: 48000, badge: 'sale', img: './assets/trendy/hero_shirt.png', href: './shop.html?sub=longshirt' },
      ],
      promo: 'NEW 5% 할인 + 무료배송',
    },
    top: {
      title: '상의',
      cats: [
        { label: '전체보기', href: './shop.html?category=top', count: 203 },
        { label: '반팔티', href: './shop.html?sub=shorttee', count: 54 },
        { label: '긴팔티', href: './shop.html?sub=longtee', count: 47 },
        { label: '맨투맨', href: './shop.html?sub=sweatshirt', count: 38 },
        { label: '후드티', href: './shop.html?sub=hoodie', count: 41 },
        { label: '민소매', href: './shop.html?sub=sleeveless', count: 23 },
      ],
      products: [
        { name: '프리미엄 피그먼트 롱슬리브', price: 46000, salePrice: null, badge: 'new', img: './assets/trendy/product_pigment.png', href: './product.html?id=P001' },
        { name: '스웨트 오버핏 후드', price: 88000, salePrice: null, badge: 'best', img: './assets/trendy/hero_hoodie.png', href: './product.html?id=P009' },
        { name: '하프집업 니트 스웨터', price: 98000, salePrice: 78000, badge: 'sale', img: './assets/trendy/product_knit.png', href: './product.html?id=P006' },
        { name: '헤비 코튼 후디', price: 46000, salePrice: null, badge: 'new', img: './assets/trendy/korean_heavy_hoodie_black_1776533887472.png', href: './shop.html?sub=longtee' },
        { name: '크루넥 스웨트셔츠', price: 68000, salePrice: 54000, badge: 'sale', img: './assets/trendy/hero_hoodie.png', href: './shop.html?sub=sweatshirt' },
      ],
      promo: '상의 1+1 이벤트 진행 중 · D-3',
    },
    knit: {
      title: '니트',
      cats: [
        { label: '전체보기', href: './shop.html?category=knit', count: 74 },
        { label: '풀오버', href: './shop.html?sub=pullover', count: 22 },
        { label: '집업니트', href: './shop.html?sub=zipup', count: 18 },
        { label: '가디건', href: './shop.html?sub=cardigan', count: 16 },
        { label: '니트베스트', href: './shop.html?sub=vest', count: 18 },
      ],
      products: [
        { name: '하프집업 니트', price: 98000, salePrice: 78000, badge: 'sale', img: './assets/trendy/product_knit.png', href: './product.html?id=P006' },
        { name: '오버핏 가디건', price: 88000, salePrice: null, badge: 'new', img: './assets/trendy/korean_halfzip_knit_charcoal_1776533867438.png', href: './shop.html?sub=cardigan' },
        { name: '케이블 풀오버', price: 92000, salePrice: null, badge: 'best', img: './assets/trendy/product_knit.png', href: './shop.html?sub=pullover' },
        { name: '니트 베스트', price: 64000, salePrice: 52000, badge: 'sale', img: './assets/trendy/korean_halfzip_knit_charcoal_1776533867438.png', href: './shop.html?sub=vest' },
        { name: '반집업 니트', price: 78000, salePrice: null, badge: 'new', img: './assets/trendy/product_knit.png', href: './shop.html?sub=zipup' },
      ],
      promo: '니트 GOLD 멤버 10% 추가 할인',
    },
    bottom: {
      title: '하의',
      cats: [
        { label: '전체보기', href: './shop.html?category=bottom', count: 178 },
        { label: '데님팬츠', href: './shop.html?sub=denim', count: 48 },
        { label: '슬랙스', href: './shop.html?sub=slacks', count: 36 },
        { label: '카고팬츠', href: './shop.html?sub=cargo', count: 29 },
        { label: '조거팬츠', href: './shop.html?sub=jogger', count: 31 },
        { label: '반바지', href: './shop.html?sub=shorts', count: 34 },
      ],
      products: [
        { name: '와이드 카고 벌룬 팬츠', price: 89000, salePrice: 69000, badge: 'sale', img: './assets/trendy/korean_cargo_pants_khaki_1776533933115.png', href: './product.html?id=P002' },
        { name: '테일러드 와이드 슬랙스', price: 78000, salePrice: null, badge: null, img: './assets/trendy/product_slacks.png', href: './product.html?id=P005' },
        { name: '프리미엄 셀비지 데님', price: 96000, salePrice: null, badge: 'best', img: './assets/trendy/korean_wide_selvedge_denim_1776533548638.png', href: './product.html?id=P010' },
        { name: '조거 스웨트팬츠', price: 64000, salePrice: 52000, badge: 'sale', img: './assets/trendy/korean_cargo_pants_khaki_1776533933115.png', href: './shop.html?sub=jogger' },
        { name: '코튼 하프 팬츠', price: 48000, salePrice: null, badge: 'new', img: './assets/trendy/korean_cargo_pants_khaki_1776533933115.png', href: './shop.html?sub=shorts' },
      ],
      promo: '하의 전품목 무료배송',
    },
    setup: {
      title: '세트업',
      cats: [
        { label: '전체보기', href: './shop.html?category=setup', count: 42 },
        { label: '상하의 세트', href: './shop.html?sub=set', count: 18 },
        { label: '트레이닝 세트', href: './shop.html?sub=training', count: 14 },
        { label: '수트 세트', href: './shop.html?sub=suit', count: 10 },
      ],
      products: [
        { name: '미니멀 원버튼 세트업', price: 298000, salePrice: null, badge: 'best', img: './assets/trendy/category_setup.png', href: './shop.html?sub=set' },
        { name: '트레이닝 세트', price: 98000, salePrice: 78000, badge: 'sale', img: './assets/trendy/hero_hoodie.png', href: './shop.html?sub=training' },
        { name: '체크 수트 세트', price: 298000, salePrice: 238000, badge: 'sale', img: './assets/trendy/category_setup.png', href: './shop.html?sub=suit' },
        { name: '린넨 세트업', price: 142000, salePrice: null, badge: 'new', img: './assets/trendy/category_setup.png', href: './shop.html?sub=set' },
      ],
      promo: '세트업 구매 시 10% 할인',
    },
    shoes: {
      title: '슈즈',
      cats: [
        { label: '전체보기', href: './shop.html?category=shoes', count: 62 },
        { label: '스니커즈', href: './shop.html?sub=sneakers', count: 18 },
        { label: '로퍼', href: './shop.html?sub=loafer', count: 14 },
        { label: '샌들', href: './shop.html?sub=sandal', count: 12 },
        { label: '부츠', href: './shop.html?sub=boots', count: 18 },
      ],
      products: [
        { name: '청키 러버솔 로퍼', price: 128000, salePrice: null, badge: null, img: './assets/trendy/category_shoes.png', href: './product.html?id=P008' },
        { name: '캔버스 로우 스니커', price: 88000, salePrice: 72000, badge: 'sale', img: './assets/trendy/product_sneakers.png', href: './shop.html?sub=sneakers' },
        { name: '첼시 부츠', price: 148000, salePrice: null, badge: 'new', img: './assets/trendy/category_shoes.png', href: './shop.html?sub=boots' },
        { name: '스트랩 샌들', price: 68000, salePrice: null, badge: 'new', img: './assets/trendy/category_shoes.png', href: './shop.html?sub=sandal' },
        { name: '벨크로 슬립온', price: 78000, salePrice: 62000, badge: 'sale', img: './assets/trendy/product_sneakers.png', href: './shop.html?sub=sneakers' },
      ],
      promo: '슈즈 2켤레 구매 시 추가 5% 할인',
    },
    community: {
      isCommunity: true,
    },
  };

  /* ── DOM 빌더: 텍스트 기반 고밀도 레이아웃 ────────────────── */
  const buildPanel = (key, data) => {
    const panel = document.createElement('div');
    panel.className = `mega-panel${data.isCommunity ? ' mega-panel--community' : ''}`;
    panel.dataset.panel = key;

    if (data.isCommunity) {
      // 커뮤니티 패널은 기존 스타일 유지 또는 텍스트 리스트로 최적화
      panel.innerHTML = `
        <div class="mega-panel__inner">
          <div class="community-mega-grid">
            ${[
          { icon: 'bell', name: '공지사항', desc: '새 소식', href: './community.html?tab=notice' },
          { icon: 'help', name: 'FAQ', desc: '자주 묻는 질문', href: './community.html?tab=faq' },
          { icon: 'msg', name: 'Q&A', desc: '1:1 문의', href: './community.html?tab=qna' },
          { icon: 'star', name: '리뷰', desc: '실착 후기', href: './community.html?tab=review' },
          { icon: 'gift', name: '이벤트', desc: '기획전 정보', href: './event.html' },
          { icon: 'crown', name: '멤버십', desc: '등급 혜택', href: './mypage.html#membership' },
        ].map(item => `
              <a href="${item.href}" class="community-mega-item">
                <div class="community-mega-item__icon">${communityIcon(item.icon)}</div>
                <p class="community-mega-item__name">${item.name}</p>
                <p class="community-mega-item__desc">${item.desc}</p>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    } else {
      // 일반 카테고리: 텍스트 링크 기반의 빠른 탐색 레이아웃
      const catsHTML = data.cats.map(c => `
        <li class="mega-panel__cat-item">
          <a href="${c.href}" class="mega-panel__cat-link">${c.label}</a>
        </li>
      `).join('');

      panel.innerHTML = `
        <div class="mega-panel__inner">
          <div class="mega-panel__cats">
            <p class="mega-panel__cat-title">${data.title}</p>
            <ul class="mega-panel__cat-list">${catsHTML}</ul>
          </div>
        </div>
      `;
    }
    return panel;
  };

  const communityIcon = (name) => {
    const icons = {
      bell: `<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1.6"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
      help: `<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1.6"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
      msg: `<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1.6"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
      star: `<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1.6"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
      gift: `<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1.6"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`,
      crown: `<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1.6"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/><line x1="5" y1="20" x2="19" y2="20"/></svg>`,
    };
    return icons[name] || icons.star;
  };

  /* ── 헤더 높이 CSS 변수 설정 ─────────────────────── */
  const updateHeaderHeight = () => {
    const header = document.querySelector('.site-header');
    const top = document.querySelector('.header-top');
    if (header && top) {
      const h = top.offsetHeight + header.offsetHeight;
      document.documentElement.style.setProperty('--header-total-height', h + 'px');
    }
  };

  /* ── 패널 컨트롤 ─────────────────────────────────── */
  let currentPanel = null;
  let closeTimer = null;

  const showPanel = (key, targetEl) => {
    if (!MEGA_DATA[key]) return;
    clearTimeout(closeTimer);
    if (currentPanel === key) return;

    // 이전 패널 숨김
    document.querySelectorAll('.mega-panel').forEach(p => p.classList.remove('is-visible'));
    const overlay = document.getElementById('megaOverlay');

    let panel = document.querySelector(`.mega-panel[data-panel="${key}"]`);
    if (!panel) {
      panel = buildPanel(key, MEGA_DATA[key]);
      document.body.appendChild(panel);
    }

    // 위치 계산: targetEl(카테고리 항목) 아래에 위치하도록
    if (targetEl) {
      const rect = targetEl.getBoundingClientRect();
      const scrollY = window.scrollY;
      panel.style.top = `${rect.bottom + scrollY}px`;
      panel.style.left = `${rect.left}px`;
    }

    panel.classList.add('is-visible');
    if (overlay) overlay.classList.add('is-visible');
    currentPanel = key;
  };

  const hidePanel = (delay = 220) => {
    closeTimer = setTimeout(() => {
      document.querySelectorAll('.mega-panel').forEach(p => p.classList.remove('is-visible'));
      const overlay = document.getElementById('megaOverlay');
      if (overlay) overlay.classList.remove('is-visible');
      currentPanel = null;
    }, delay);
  };

  /* ── 초기화 ──────────────────────────────────────── */
  const init = () => {
    // 오버레이 생성
    const overlay = document.createElement('div');
    overlay.id = 'megaOverlay';
    overlay.className = 'mega-overlay';
    document.body.appendChild(overlay);
    overlay.addEventListener('mouseenter', () => hidePanel(0));

    // 카테고리 nav 항목에 이벤트 연결 (has-sub, has-mega 모두 포함)
    const navItems = document.querySelectorAll('.category-nav__item.has-mega');
    navItems.forEach(item => {
      const megaKey = item.dataset.mega || getCatKey(item);
      if (!megaKey) return;

      item.addEventListener('mouseenter', () => showPanel(megaKey, item));
      item.addEventListener('mouseleave', () => hidePanel());
    });

    // 커뮤니티 탭 충돌 방지를 위해 기존 메가메뉴(has-comm) 바인딩을 제거하고 일반 sub-menu 형태로 작동하도록 수정함

    // 패널 위에 마우스가 있을 때 닫기 방지
    document.addEventListener('mouseover', (e) => {
      const panel = e.target.closest('.mega-panel');
      if (panel) clearTimeout(closeTimer);
    });
    document.addEventListener('mouseout', (e) => {
      const panel = e.target.closest('.mega-panel');
      if (panel && !e.relatedTarget?.closest('.mega-panel, .category-nav__item')) {
        hidePanel();
      }
    });

    // ESC키로 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hidePanel(0);
    });

    // 헤더 높이 설정
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
  };

  /* ── 카테고리 키 추론 ────────────────────────────── */
  const getCatKey = (item) => {
    const href = item.querySelector('a')?.getAttribute('href') || '';
    const text = item.querySelector('a')?.textContent.trim().toUpperCase() || '';
    const map = {
      '아우터': 'outer', 'OUTER': 'outer',
      '셔츠': 'shirt', 'SHIRT': 'shirt',
      '상의': 'top', 'TOP': 'top',
      '니트': 'knit', 'KNIT': 'knit',
      '하의': 'bottom', 'BOTTOM': 'bottom',
      '세트업': 'setup', 'SET-UP': 'setup', 'SETUP': 'setup',
      '슈즈': 'shoes', 'SHOES': 'shoes',
      '커뮤니티': 'community', 'COMMUNITY': 'community',
    };
    if (href.includes('category=outer')) return 'outer';
    if (href.includes('category=shirt')) return 'shirt';
    if (href.includes('category=top')) return 'top';
    if (href.includes('category=knit')) return 'knit';
    if (href.includes('category=bottom')) return 'bottom';
    if (href.includes('category=setup')) return 'setup';
    if (href.includes('category=shoes')) return 'shoes';
    if (href.includes('community')) return 'community';
    return map[text] || null;
  };

  return { init };
})();

document.addEventListener('DOMContentLoaded', MegaMenu.init);
