// 경로: js/community.js
// VARO 커뮤니티 페이지 로직: 탭 전환, 스타일피드 렌더링, 인스타그램 스타일 모달

'use strict';

const CommunityPage = (() => {

  const state = {
    activeTab: 'feed', // 기본값: 스타일피드
    feedPage: 1,
    isModalOpen: false,
  };

  /* ── 탭 제어 ───────────────────────────────── */
  const initTabs = () => {
    const tabs = document.querySelectorAll('.community-tab');
    const sections = document.querySelectorAll('.community-section');

    // URL 파라미터 확인 (?tab=feed)
    const params = new URLSearchParams(window.location.search);
    const initialTab = params.get('tab') || 'feed';

    const switchTab = (tabName) => {
      tabs.forEach(t => t.classList.toggle('is-active', t.dataset.tab === tabName));
      sections.forEach(s => s.classList.toggle('is-active', s.id === `section-${tabName}`));
      state.activeTab = tabName;

      // 탭별 초기 데이터 렌더링
      if (tabName === 'feed') renderStyleFeed();
      if (tabName === 'notice') renderNotices();
      if (tabName === 'faq') renderFAQ();
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    switchTab(initialTab);
  };

  /* ── 스타일 피드 렌더링 (인스타 그리드) ───────── */
  const renderStyleFeed = () => {
    const { COMMUNITY_POSTS } = window.VARO_DATA;
    const grid = document.getElementById('communityGrid');
    if (!grid || !COMMUNITY_POSTS) return;

    grid.innerHTML = '';
    COMMUNITY_POSTS.forEach(post => {
      const card = Utils.el('div', 'feed-item', {
        'data-id': post.id,
        role: 'button',
        'aria-label': `${post.username}의 게시물 보기`
      });

      const img = Utils.el('img', 'feed-item__img', {
        src: post.img,
        alt: post.caption,
        loading: 'lazy'
      });

      const overlay = Utils.el('div', 'feed-item__overlay');
      overlay.innerHTML = `
        <div class="feed-item__stats">
          <span>❤️ ${Utils.formatCount(post.likes)}</span>
          <span>💬 ${post.comments}</span>
        </div>
      `;

      card.append(img, overlay);
      card.addEventListener('click', () => openPostModal(post));
      grid.appendChild(card);
    });
  };

  /* ── 게시물 상세 모달 (인스타그램 스타일) ─────── */
  const openPostModal = (post) => {
    const modal = document.getElementById('postModal');
    if (!modal) return;

    // 데이터 바인딩
    document.getElementById('postModalImg').src = post.img;
    document.getElementById('postModalAvatar').src = post.avatar;
    document.getElementById('postModalUsername').textContent = post.username;
    document.getElementById('postModalText').textContent = post.caption;
    document.getElementById('postModalDate').textContent = post.timeAgo;
    document.getElementById('postLikeCount').textContent = post.likes;

    // 태그된 상품 렌더링
    const tagGrid = document.getElementById('postTaggedProducts');
    tagGrid.innerHTML = '';
    if (post.taggedProducts && post.taggedProducts.length > 0) {
      post.taggedProducts.forEach(prodId => {
        const product = window.VARO_DATA.PRODUCTS.find(p => p.id === prodId);
        if (product) {
          const tag = Utils.el('a', 'tagged-product', { href: `./product.html?id=${product.id}` });
          tag.innerHTML = `
            <img src="${product.mainImg}" alt="${product.name}">
            <div class="tagged-product__info">
              <span class="name">${product.name}</span>
              <span class="price">${Utils.formatPrice(product.price)}</span>
            </div>
          `;
          tagGrid.appendChild(tag);
        }
      });
    }

    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    state.isModalOpen = true;
  };

  const closePostModal = () => {
    const modal = document.getElementById('postModal');
    if (!modal) return;
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
    state.isModalOpen = false;
  };

  /* ── 공지사항 렌더링 ────────────────────────── */
  const renderNotices = () => {
    const { COMMUNITY_NOTICES } = window.VARO_DATA;
    const list = document.getElementById('noticeList');
    if (!list || !COMMUNITY_NOTICES) return;

    list.innerHTML = COMMUNITY_NOTICES.map(notice => `
      <li class="notice-item ${notice.isImportant ? 'notice-item--pinned' : ''}">
        <div class="notice-header">
          <span class="notice-badge ${notice.isImportant ? 'notice-badge--pin' : ''}">${notice.isImportant ? '공지' : notice.category || '소식'}</span>
          <span class="notice-title">${notice.title}</span>
          <span class="notice-date">${notice.date}</span>
        </div>
        <div class="notice-content">
          <p>${notice.content || '안녕하세요, VARO입니다.<br><br>공지사항 상세 내용이 준비 중입니다.'}</p>
        </div>
      </li>
    `).join('');
  };

  /* ── FAQ 렌더링 ────────────────────────────── */
  const renderFAQ = () => {
    const { FAQ_DATA } = window.VARO_DATA;
    const accordion = document.getElementById('faqAccordion');
    if (!accordion || !FAQ_DATA) return;

    accordion.innerHTML = FAQ_DATA.map((faq, idx) => `
      <div class="faq-item">
        <button class="faq-question" aria-expanded="false" data-index="${idx}">
          <span class="category">[${faq.category}]</span>
          <span class="text">${faq.question}</span>
          <svg class="icon" width="12" height="12" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
        </button>
        <div class="faq-answer">
          <div class="faq-answer__content">${faq.answer}</div>
        </div>
      </div>
    `).join('');

    // 아코디언 토글 로직
    accordion.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', !expanded);
      });
    });
  };

  /* ── 초기화 ────────────────────────────────── */
  const init = () => {
    initTabs();

    // 모달 닫기 이벤트
    document.getElementById('postModalClose')?.addEventListener('click', closePostModal);
    document.getElementById('postModalOverlay')?.addEventListener('click', closePostModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.isModalOpen) closePostModal();
    });

    // 공지사항 아코디언 이벤트 위임
    document.addEventListener('click', (e) => {
      const item = e.target.closest('.notice-item');
      if (item) {
        // a 태그나 버튼 클릭 시 기본 이동/이벤트 방지
        if (e.target.tagName === 'A' || e.target.closest('a')) {
          e.preventDefault();
        }
        item.classList.toggle('is-open');
      }
    });

    console.log('VARO: Community Page Initialized.');
  };

  return { init };
})();

document.addEventListener('DOMContentLoaded', CommunityPage.init);
