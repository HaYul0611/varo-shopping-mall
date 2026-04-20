// 경로: js/community-page.js
// VARO 2026 — 커뮤니티 페이지 탭 + FAQ + 리뷰 로직
'use strict';

const CommunityPageV2 = (() => {

  /* ── URL 파라미터로 초기 탭 결정 ─────────────────── */
  const getInitialTab = () => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    const valid = ['notice','faq','qna','review','event','membership'];
    return valid.includes(tab) ? tab : 'notice';
  };

  /* ── 탭 전환 ──────────────────────────────────────── */
  const switchTab = (tabKey) => {
    document.querySelectorAll('.comm-tab').forEach(btn => {
      const active = btn.dataset.tab === tabKey;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('.comm-panel').forEach(panel => {
      panel.classList.toggle('is-active', panel.id === `panel-${tabKey}`);
    });
    // URL 업데이트 (히스토리)
    const url = new URL(window.location);
    url.searchParams.set('tab', tabKey);
    history.replaceState(null, '', url);
  };

  /* ── FAQ 아코디언 ─────────────────────────────────── */
  const initFAQ = () => {
    const faqList = document.getElementById('faqList');
    if (!faqList) return;

    faqList.addEventListener('click', (e) => {
      const btn = e.target.closest('.faq-q');
      if (!btn) return;
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('is-open');
      // 모두 닫기
      faqList.querySelectorAll('.faq-item.is-open').forEach(i => i.classList.remove('is-open'));
      if (!isOpen) item.classList.add('is-open');
    });

    // FAQ 카테고리 필터
    document.querySelectorAll('.faq-cat').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.faq-cat').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const cat = btn.dataset.faq;
        faqList.querySelectorAll('.faq-item').forEach(item => {
          item.style.display = (cat === 'all' || item.dataset.faq === cat) ? '' : 'none';
        });
      });
    });
  };

  /* ── 리뷰 렌더 ────────────────────────────────────── */
  const renderReviews = () => {
    const list = document.getElementById('communityReviewList');
    if (!list) return;

    const reviews = [
      { user:'민준 *', rating:5, product:'더블 브레스티드 코트', date:'2026.04.10', body:'카멜 색상 진짜 예쁩니다. 소재도 고급지고 핏이 너무 마음에 들어요. 주변에서 어디 샀냐고 많이 물어봐요!', sizeInfo:'M 구매 / 평소 M 착용', img:'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=60&h=80&fit=crop&q=80', hasPhoto: true },
      { user:'도현 *', rating:5, product:'와이드 카고 팬츠', date:'2026.04.08', body:'카키 색상 진짜 예뻐요. 와이드 핏이라 걸을때 편하고 카고 포켓도 실용적입니다. 재구매 의사 있어요.', sizeInfo:'M 구매 / 평소 M 착용', img:'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=60&h=80&fit=crop&q=80', hasPhoto: true },
      { user:'해찬 *', rating:4, product:'코튼 오버핏 헤비 티셔츠', date:'2026.04.07', body:'두꺼운 원단 퀄리티가 정말 좋네요. 색감도 사진과 똑같이 나왔습니다. 그레이도 사려고요.', sizeInfo:'L 구매 / 평소 M 착용', img:null, hasPhoto: false },
      { user:'지우 *', rating:5, product:'스웨트 오버사이즈 후드', date:'2026.04.06', body:'두께감 진짜 좋아요! 320gsm이라 그런지 묵직하고 따뜻합니다. 아이보리 색상 너무 예뻐요.', sizeInfo:'L 구매 / 평소 M 착용', img:'https://images.unsplash.com/photo-1556821840-3a63f8550d64?w=60&h=80&fit=crop&q=80', hasPhoto: true },
      { user:'박준 *', rating:4, product:'슬림 테이퍼드 슬랙스', date:'2026.04.05', body:'핏이 정말 깔끔해요. 차콜 색상으로 샀는데 어디에나 잘 어울립니다.', sizeInfo:'32 구매 / 평소 32 착용', img:null, hasPhoto: false },
      { user:'서준 *', rating:5, product:'하프집업 니트 스웨터', date:'2026.04.04', body:'오트밀 색상 진짜 예쁘네요. 소재도 부드럽고 하프집업이라 스타일 연출이 다양해서 좋아요.', sizeInfo:'M 구매 / 평소 M 착용', img:'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=60&h=80&fit=crop&q=80', hasPhoto: true },
    ];

    list.innerHTML = reviews.map(r => `
      <li class="review-card-comm">
        <div class="review-card-comm__header">
          <span class="review-card-comm__stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</span>
          <span class="review-card-comm__user">${r.user}</span>
          <span class="review-card-comm__date">${r.date}</span>
        </div>
        <p class="review-card-comm__product">${r.product}</p>
        <p class="review-card-comm__body">${r.body}</p>
        <div style="display:flex;gap:10px;align-items:center;">
          ${r.img ? `<div class="review-card-comm__img"><img src="${r.img}" alt="리뷰 이미지" loading="lazy"></div>` : ''}
          <span style="font-size:11px;color:#AAA">${r.sizeInfo}</span>
        </div>
      </li>
    `).join('');

    // 리뷰 필터
    document.querySelectorAll('.review-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.review-filter').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        // 실제 필터링 로직은 백엔드 연동 시 확장
        if (typeof Utils !== 'undefined') Utils.showToast(`${btn.textContent.trim()} 필터 적용`, 'default');
      });
    });
  };

  /* ── 초기화 ───────────────────────────────────────── */
  const init = () => {
    const initialTab = getInitialTab();
    switchTab(initialTab);

    // 탭 클릭 이벤트
    document.querySelectorAll('.comm-tab').forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    initFAQ();
    renderReviews();
  };

  return { init };
})();

document.addEventListener('DOMContentLoaded', CommunityPageV2.init);
