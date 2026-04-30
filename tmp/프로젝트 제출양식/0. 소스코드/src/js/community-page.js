// 경로: js/community-page.js
// VARO 2026 — 커뮤니티 페이지 탭 + FAQ + 리뷰 + Q&A 로직
'use strict';

const CommunityPageV2 = (() => {

  /* ── URL 파라미터로 초기 탭 결정 ─────────────────── */
  const getInitialTab = () => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    const valid = ['notice', 'faq', 'qna', 'review', 'event', 'membership'];
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

  /* ── 공지사항 렌더링 및 페이지네이션 ───────────────── */
  const NOTICE_PER_PAGE = 5;
  let currentNoticePage = 1;

  const renderNotices = (page = 1) => {
    let list = JSON.parse(localStorage.getItem('varo_notices')) || [
      { id: 1, title: '[필독] 2026 SS 시즌 런칭 안내 및 신규 카테고리 오픈', date: '2026-04-15', views: 124, important: true, content: '안녕하세요, VARO입니다.<br><br>2026년 봄/여름(SS) 시즌을 맞이하여 감각적이고 트렌디한 신규 아이템들이 대거 업데이트되었습니다.<br>아울러 새로운 라이프스타일 카테고리가 추가 오픈되었으니 많은 관심 부탁드립니다.<br><br>항상 VARO를 이용해 주셔서 감사합니다.' },
      { id: 2, title: '개인정보처리방침 개정 안내 (2026년 4월 시행)', date: '2026-04-10', views: 89, important: true, content: '안녕하세요, VARO입니다.<br><br>고객님의 소중한 개인정보를 보다 안전하게 보호하고자 개인정보처리방침이 일부 개정될 예정입니다.<br><br>[개정 사항]<br>- 수집하는 개인정보 항목 및 이용 목적의 구체화<br>- 개인정보 파기 절차 및 방법 개선<br><br>시행일자: 2026년 4월 25일<br><br>감사합니다.' },
      { id: 3, title: '1+1 이벤트 상의 전품목 4/19~4/25 진행', date: '2026-04-19', views: 210, important: false, content: 'VARO의 특별한 1+1 혜택!<br><br>봄 시즌 필수 아이템인 상의 전 품목을 대상으로 1+1 이벤트를 진행합니다.<br>한정 수량으로 조기 소진될 수 있으니 서두르세요.<br><br>기간: 2026. 04. 19 ~ 2026. 04. 25' },
      { id: 4, title: '황금연휴 기간 배송 일정 안내 (4/29~5/5)', date: '2026-04-18', views: 156, important: false, content: '황금연휴 기간 배송 및 고객센터 휴무 안내입니다.<br><br>- 배송 마감: 4월 28일(화) 오후 2시 결제 완료 건까지 당일 발송<br>- 휴무 기간: 4월 29일 ~ 5월 5일<br>- 배송 재개: 5월 6일(수)부터 순차 발송<br><br>연휴 기간 동안 주문량이 많아 배송이 평소보다 2~3일 지연될 수 있는 점 양해 부탁드립니다.' },
      { id: 5, title: '앱 업데이트 및 서버 점검 완료 안내', date: '2026-04-12', views: 342, important: false, content: '보다 안정적인 서비스 제공을 위한 시스템 정기 점검이 완료되었습니다.<br><br>현재 모든 결제 및 장바구니 기능이 정상 작동 중입니다.<br>이용에 불편을 드려 죄송합니다.' },
      { id: 6, title: 'VARO 멤버십 등급 전환 기준 변경 안내', date: '2026-04-08', views: 275, important: false, content: '멤버십 등급 산정 기준이 개편되었습니다.<br><br>[변경 후 등급]<br>- 브론즈, 실버, 골드, DIA<br><br>자세한 등급별 혜택은 멤버십 안내 탭에서 확인하실 수 있습니다.' },
      { id: 7, title: '교환/반품 정책 변경 안내 (7일 → 14일 확대)', date: '2026-04-01', views: 198, important: false, content: '고객 만족을 위해 교환/반품 신청 가능 기간을 기존 상품 수령 후 7일에서 **14일**로 대폭 확대합니다.<br><br>더욱 여유롭고 안전한 쇼핑을 즐기세요.' }
    ];

    if (!localStorage.getItem('varo_notices')) {
      localStorage.setItem('varo_notices', JSON.stringify(list));
    }
    const container = document.getElementById('noticeList');
    const pagination = document.querySelector('#panel-notice .board-pagination');
    if (!container) return;

    currentNoticePage = page;
    const start = (page - 1) * NOTICE_PER_PAGE;
    const end = start + NOTICE_PER_PAGE;
    const pagedList = list.slice(start, end);

    if (list.length === 0) {
      container.innerHTML = '<li class="notice-item" style="text-align:center; padding:40px 0; color:#888;">등록된 공지사항이 없습니다.</li>';
      if (pagination) pagination.style.display = 'none';
      return;
    }

    container.innerHTML = pagedList.map(n => `
      <li class="notice-item ${n.important ? 'notice-item--pinned' : ''}" data-id="${n.id}">
        <div class="notice-header">
          <span class="notice-badge ${n.important ? 'notice-badge--pin' : ''}">${n.important ? '공지' : '안내'}</span>
          <span class="notice-title">${Utils.escapeHTML(n.title)}</span>
          <span class="notice-date">${n.date.replace(/-/g, '.')}</span>
        </div>
        <div class="notice-content" style="display:none;">
          <p>${n.content || '내용이 없습니다.'}</p>
        </div>
      </li>
    `).join('');

    // 페이지네이션 렌더링
    if (pagination) {
      pagination.style.display = 'flex';
      const totalPages = Math.ceil(list.length / NOTICE_PER_PAGE);
      if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
      }
      let html = `<button class="board-page-btn board-page-btn--nav" ${page === 1 ? 'disabled' : ''} onclick="CommunityPageV2.renderNotices(${page - 1})">‹</button>`;
      for (let i = 1; i <= totalPages; i++) {
        html += `<button class="board-page-btn ${i === page ? 'is-active' : ''}" onclick="CommunityPageV2.renderNotices(${i})">${i}</button>`;
      }
      html += `<button class="board-page-btn board-page-btn--nav" ${page === totalPages ? 'disabled' : ''} onclick="CommunityPageV2.renderNotices(${page + 1})">›</button>`;
      pagination.innerHTML = html;
    }

    // 페이지 상단으로 스크롤 (목록 갱신 시)
    if (page !== 1) {
      document.querySelector('.comm-body').scrollIntoView({ behavior: 'smooth' });
    }
  };

  const initNotice = () => {
    const noticeList = document.getElementById('noticeList');
    if (!noticeList) return;

    noticeList.addEventListener('click', (e) => {
      const header = e.target.closest('.notice-header');
      const item = header ? header.closest('.notice-item') : e.target.closest('.notice-item');
      if (!item) return;

      if (e.target.tagName === 'A' || e.target.closest('a')) {
        e.preventDefault();
      }

      const isOpen = item.classList.contains('is-open');

      noticeList.querySelectorAll('.notice-item.is-open').forEach(i => {
        if (i !== item) {
          i.classList.remove('is-open');
          const c = i.querySelector('.notice-content');
          if (c) c.style.display = 'none';
        }
      });

      if (isOpen) {
        item.classList.remove('is-open');
        const content = item.querySelector('.notice-content');
        if (content) content.style.display = 'none';
      } else {
        item.classList.add('is-open');
        const content = item.querySelector('.notice-content');
        if (content) content.style.display = 'block';
      }
    });
  };

  /* ── FAQ 렌더링 및 아코디언 ────────────────────────── */
  const renderFAQs = () => {
    const list = JSON.parse(localStorage.getItem('varo_faqs')) || [];
    const container = document.getElementById('faqList');
    if (!container) return;

    if (list.length === 0) {
      container.innerHTML = '<li style="text-align:center; padding:40px 0; color:#888;">등록된 FAQ가 없습니다.</li>';
      return;
    }

    container.innerHTML = list.map(f => `
      <li class="faq-item" data-faq="${f.category === '주문/결제' ? 'order' : f.category === '배송' ? 'delivery' : f.category === '교환/반품' ? 'return' : f.category === '회원/정보' ? 'member' : 'product'}">
        <button class="faq-q">${Utils.escapeHTML(f.question)}<span class="faq-arrow">+</span></button>
        <div class="faq-a">${f.answer}</div>
      </li>
    `).join('');
  };

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

  /* ── 리뷰 렌더링 및 페이지네이션 ───────────────────── */
  const REVIEW_PER_PAGE = 6;
  let currentReviewPage = 1;

  const renderReviews = (page = 1, filter = 'all') => {
    const listContainer = document.getElementById('communityReviewList');
    const pagination = document.getElementById('reviewPagination');
    if (!listContainer) return;

    let allReviews = JSON.parse(localStorage.getItem('varo_reviews')) || [
      { id: 1, product: '핸드메이드 캐시미어 롱 코트', customer: '김민준', rating: 5, content: '카멜 색상 진짜 예쁩니다. 소재도 고급지고 핏이 너무 마음에 들어요. 주변에서 어디 샀냐고 많이 물어봐요!', date: '2026-04-10', hasPhoto: true, img: './assets/products/P001_main.png', sizeInfo: 'M 구매 / 평소 M 착용' },
      { id: 2, product: '와이드 카고 스트링 팬츠', customer: '도현', rating: 5, content: '카키 색상 진짜 예뻐요. 와이드 핏이라 걸을때 편하고 카고 포켓도 실용적입니다.', date: '2026-04-08', hasPhoto: true, img: './assets/products/P040_main.jpg', sizeInfo: 'M 구매 / 평소 M 착용' },
      { id: 3, product: '헤비 웨이트 20수 티셔츠', customer: '해찬', rating: 4, content: '두꺼운 원단 퀄리티가 정말 좋네요. 색감도 사진과 똑같이 나왔습니다.', date: '2026-04-07', hasPhoto: false, sizeInfo: 'L 구매 / 평소 M 착용' },
      { id: 101, product: 'USA 코튼 세미오버 후드', customer: '지우', rating: 5, content: '두께감 진짜 좋아요! USA 코튼이라 그런지 묵직하고 따뜻합니다.', date: '2026-04-06', hasPhoto: true, img: './assets/products/P020_main.jpg', sizeInfo: 'L 구매 / 평소 M 착용' },
      { id: 102, product: '세미 와이드 핀턱 슬랙스', customer: '박준', rating: 4, content: '핏이 정말 깔끔해요. 차콜 색상으로 샀는데 어디에나 잘 어울립니다.', date: '2026-04-05', hasPhoto: false, sizeInfo: '32 구매 / 평소 32 착용' },
      { id: 103, product: '모크넥 하프 지업 맨투맨', customer: '서준', rating: 5, content: '오트밀 색상 진짜 예쁘네요. 소재도 부드럽고 하프집업이라 스타일 연출이 다양해서 좋아요.', date: '2026-04-04', hasPhoto: true, img: './assets/products/P026_main.jpg', sizeInfo: 'M 구매 / 평소 M 착용' },
      { id: 104, product: '린넨 셔츠', customer: '정태양', rating: 2, content: '배송이 너무 늦었어요. 품질은 괜찮네요.', date: '2026-04-18', hasPhoto: false, sizeInfo: 'XL 구매 / 평소 L 착용' }
    ];

    if (!localStorage.getItem('varo_reviews')) {
      localStorage.setItem('varo_reviews', JSON.stringify(allReviews));
    }

    const filteredReviews = allReviews.filter(r => {
      if (filter === 'all') return true;
      if (filter === '5') return r.rating === 5;
      if (filter === '4') return r.rating === 4;
      if (filter === '3') return r.rating <= 3;
      if (filter === 'photo') return r.hasPhoto === true;
      return true;
    });

    if (filteredReviews.length === 0) {
      listContainer.innerHTML = `<li style="grid-column: 1 / -1; text-align: center; padding: 40px 0; color: #888; font-size: 14px;">조건에 맞는 리뷰가 없습니다.</li>`;
      if (pagination) pagination.innerHTML = '';
      return;
    }

    currentReviewPage = page;
    const start = (page - 1) * REVIEW_PER_PAGE;
    const end = start + REVIEW_PER_PAGE;
    const pagedList = filteredReviews.slice(start, end);

    listContainer.innerHTML = pagedList.map(r => `
      <li class="review-card-comm">
        <div class="review-card-comm__header">
          <span class="review-card-comm__stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
          <span class="review-card-comm__user">${Utils.escapeHTML(r.customer)}</span>
          <span class="review-card-comm__date">${r.date.replace(/-/g, '.')}</span>
        </div>
        <p class="review-card-comm__product">${Utils.escapeHTML(r.product)}</p>
        <p class="review-card-comm__body">${Utils.escapeHTML(r.content)}</p>
        <div style="display:flex;gap:10px;align-items:center;">
          ${r.img ? `<div class="review-card-comm__img"><img src="${r.img.startsWith('.') ? r.img : (r.img.startsWith('http') ? r.img : './assets' + r.img)}" alt="리뷰 이미지" loading="lazy"></div>` : ''}
          <span style="font-size:11px;color:#AAA">${r.sizeInfo || ''}</span>
        </div>
      </li>
    `).join('');

    // 페이지네이션 렌더링
    if (pagination) {
      const totalPages = Math.ceil(filteredReviews.length / REVIEW_PER_PAGE);
      let html = `<button class="board-page-btn board-page-btn--nav" ${page === 1 ? 'disabled' : ''} onclick="CommunityPageV2.renderReviews(${page - 1}, '${filter}')">‹</button>`;
      for (let i = 1; i <= totalPages; i++) {
        html += `<button class="board-page-btn ${i === page ? 'is-active' : ''}" onclick="CommunityPageV2.renderReviews(${i}, '${filter}')">${i}</button>`;
      }
      html += `<button class="board-page-btn board-page-btn--nav" ${page === totalPages ? 'disabled' : ''} onclick="CommunityPageV2.renderReviews(${page + 1}, '${filter}')">›</button>`;
      pagination.innerHTML = html;
    }
  };

  const initReviewFilters = () => {
    const filters = document.querySelectorAll('.review-filter');
    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const rating = btn.dataset.rating;
        renderReviews(rating);
      });
    });
  };

  /* ── Q&A (문의하기) 시스템 ──────────────────────────── */
  const state = {
    isAdminMode: false,
    qnaData: [],
    editingReplyId: null, // 현재 수정 중인 댓글 ID
    unlockedPostIds: []   // 이번 세션에서 잠금 해제된 비밀글 IDs
  };

  const loadQNA = () => {
    const saved = localStorage.getItem('varo_qna');
    if (saved) {
      state.qnaData = JSON.parse(saved);
    } else {
      state.qnaData = [
        {
          id: Date.now() - 3000000,
          author: '민준***',
          authorEmail: 'minjun@example.com',
          subject: 'P003 코트 카멜 L사이즈 재입고 예정인가요?',
          content: '재입고가 언제쯤 될까요? 꼭 사고 싶습니다.',
          date: '2026.04.18',
          isSecret: false,
          status: 'done',
          replies: [
            {
              id: Date.now() - 2900000,
              author: 'VARO',
              content: '안녕하세요 VARO입니다. 해당 상품은 4월 25일 재입고 예정입니다. 위시리스트에 추가해 두시면 재입고 알림을 받으실 수 있습니다. 감사합니다.',
              date: '2026.04.18',
              isAdmin: true
            }
          ]
        },
        {
          id: Date.now() - 5000000,
          author: '해찬***',
          authorEmail: 'haechan@example.com',
          subject: '교환 신청했는데 진행 상황 확인이 어려워요',
          content: '지난주에 신청했는데 아직 소식이 없네요.',
          date: '2026.04.16',
          isSecret: false,
          status: 'pending',
          replies: []
        }
      ];
      saveQNA();
    }
  };

  const saveQNA = () => {
    localStorage.setItem('varo_qna', JSON.stringify(state.qnaData));
    window.dispatchEvent(new CustomEvent('varo:dataChange', { detail: { type: 'qna', data: state.qnaData } }));
  };

  const renderQNA = () => {
    const list = document.getElementById('qnaList');
    if (!list) return;

    const user = JSON.parse(localStorage.getItem('varo_user') || '{}');

    list.innerHTML = state.qnaData.map(q => {
      const isAuthor = user.email && q.authorEmail === user.email;
      const isAdmin = user.role === 'ADMIN' || user.grade === 'ADMIN';
      const isUnlocked = state.unlockedPostIds.includes(q.id);
      const canSee = !q.isSecret || isAuthor || isAdmin || isUnlocked;

      let contentHtml = '';
      if (canSee) {
        contentHtml = `
          <div class="qna-q-row">
            <span class="qna-badge qna-badge--q">Q</span>
            <div class="qna-q-content">
              <p class="qna-subject">${q.isSecret ? '<span style="color:#AAA; display: inline-flex; align-items: center; gap: 4px; vertical-align: middle;"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> 비밀글입니다. </span>' : ''}${Utils.escapeHTML(q.subject)}</p>
              <p class="qna-meta" style="margin-top:8px; line-height:1.6; color:#555;">${Utils.escapeHTML(q.content)}</p>
              <p class="qna-meta" style="margin-top:8px;"><span class="qna-author">${Utils.escapeHTML(q.author)}</span> · ${q.date}</p>
            </div>
            <span class="qna-status qna-status--${q.status}">${q.status === 'done' ? '답변완료' : '답변대기'}</span>
          </div>
          ${q.replies.length > 0 ? `
            <div class="qna-replies">
              ${q.replies.map(r => {
          const isReplyAuthor = user.name && r.author === user.name;
          const isAdmin = user.role === 'ADMIN' || user.grade === 'ADMIN';
          const canManage = isAdmin || isReplyAuthor;
          const isEditing = state.editingReplyId === r.id;

          return `
                <div class="qna-reply-item" id="reply-${r.id}">
                  <div class="qna-reply-header">
                    <div style="display:flex; gap:8px; align-items:center;">
                      <span class="qna-reply-user">${Utils.escapeHTML(r.author)}</span>
                      ${r.isAdmin ? '<span class="admin-mark" style="font-size:9px; background:#1C1A16; color:#FFF; padding:1px 4px; border-radius:2px;">ADMIN</span>' : ''}
                      <span class="qna-reply-date">${r.date}</span>
                    </div>
                    ${canManage && !isEditing ? `
                      <div class="qna-reply-actions" style="display:flex; gap:6px;">
                        <button type="button" class="btn-text-action" onclick="CommunityPageV2.startEditReply(${r.id})" style="font-size:11px; color:#888; background:none; border:none; cursor:pointer;">수정</button>
                        <button type="button" class="btn-text-action" onclick="CommunityPageV2.deleteReply(${q.id}, ${r.id})" style="font-size:11px; color:#FF4D4F; background:none; border:none; cursor:pointer;">삭제</button>
                      </div>
                    ` : ''}
                  </div>
                  
                  ${isEditing ? `
                    <div class="qna-reply-edit-wrap" style="margin-top:8px;">
                      <textarea id="editReplyInput-${r.id}" class="qna-reply-input" style="width:100%; min-height:60px; padding:8px; font-size:13px;">${Utils.escapeHTML(r.content)}</textarea>
                      <div style="display:flex; gap:5px; margin-top:5px; justify-content:flex-end;">
                        <button type="button" class="btn btn--outline btn--xs" onclick="CommunityPageV2.cancelEditReply()" style="padding:4px 8px; font-size:11px;">취소</button>
                        <button type="button" class="btn btn--primary btn--xs" onclick="CommunityPageV2.saveEditedReply(${q.id}, ${r.id})" style="padding:4px 8px; font-size:11px;">저장</button>
                      </div>
                    </div>
                  ` : `
                    <div class="qna-reply-body">${Utils.escapeHTML(r.content)}</div>
                  `}
                </div>
                `;
        }).join('')}
            </div>
          ` : ''}
          <div class="qna-reply-write">
            <input type="text" class="qna-reply-input" placeholder="${state.isAdminMode ? '답변을 입력하세요...' : '댓글을 입력하세요...'}" id="replyInput-${q.id}">
            <button type="button" class="btn--reply-submit" onclick="CommunityPageV2.handleReplySubmit(${q.id})">등록</button>
          </div>
        `;
      } else {
        contentHtml = `
          <div class="qna-q-row qna-q-row--locked" style="cursor:pointer;" onclick="CommunityPageV2.handleSecretClick(${q.id})">
            <span class="qna-badge qna-badge--q" style="background:#EEE; color:#AAA;">Q</span>
            <div class="qna-q-content">
              <p class="qna-subject" style="color:#888; display: inline-flex; align-items: center; gap: 4px;"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> 비밀글입니다. <span style="font-size:11px; font-weight:400;">(클릭하여 비밀번호 입력)</span></p>
              <p class="qna-meta"><span class="qna-author">${Utils.escapeHTML(q.author)}</span> · ${q.date}</p>
            </div>
            <span class="qna-status qna-status--pending" style="background:#F5F5F5; color:#999;">비밀글</span>
          </div>
        `;
      }

      return `<li class="qna-item" id="qna-${q.id}">${contentHtml}</li>`;
    }).join('');
  };

  const handleReplySubmit = (qId) => {
    const input = document.getElementById(`replyInput-${qId}`);
    if (!input || !input.value.trim()) return;

    const user = JSON.parse(localStorage.getItem('varo_user') || '{}');
    const isAdmin = user.role === 'ADMIN' || user.grade === 'ADMIN';

    if (!user.name && !isAdmin) {
      alert('로그인이 필요한 기능입니다.');
      location.href = './login.html';
      return;
    }

    const qIdx = state.qnaData.findIndex(q => q.id === qId);
    if (qIdx === -1) return;

    const newReply = {
      id: Date.now(),
      author: isAdmin ? 'VARO (관리자)' : user.name,
      content: input.value.trim(),
      date: new Date().toLocaleDateString('ko-KR').replace(/ /g, '').slice(0, -1),
      isAdmin: isAdmin
    };

    state.qnaData[qIdx].replies.push(newReply);
    state.qnaData[qIdx].status = 'done';
    saveQNA();
    renderQNA();
    if (typeof Utils !== 'undefined') Utils.showToast('댓글이 등록되었습니다.', 'success');
  };

  /* ── 댓글 수정/삭제 로직 ────────────────────────── */
  const startEditReply = (rId) => {
    state.editingReplyId = rId;
    renderQNA();
  };

  const cancelEditReply = () => {
    state.editingReplyId = null;
    renderQNA();
  };

  const saveEditedReply = (qId, rId) => {
    const input = document.getElementById(`editReplyInput-${rId}`);
    if (!input || !input.value.trim()) return;

    const qIdx = state.qnaData.findIndex(q => q.id === qId);
    if (qIdx === -1) return;

    const rIdx = state.qnaData[qIdx].replies.findIndex(r => r.id === rId);
    if (rIdx === -1) return;

    state.qnaData[qIdx].replies[rIdx].content = input.value.trim();
    state.editingReplyId = null;
    saveQNA();
    renderQNA();
    if (typeof Utils !== 'undefined') Utils.showToast('댓글이 수정되었습니다.', 'success');
  };

  const deleteReply = (qId, rId) => {
    if (!confirm('정말 이 댓글을 삭제하시겠습니까?')) return;

    const qIdx = state.qnaData.findIndex(q => q.id === qId);
    if (qIdx === -1) return;

    state.qnaData[qIdx].replies = state.qnaData[qIdx].replies.filter(r => r.id !== rId);

    // 답변이 하나도 없으면 '답변대기'로 전환
    if (state.qnaData[qIdx].replies.length === 0) {
      state.qnaData[qIdx].status = 'pending';
    }

    saveQNA();
    renderQNA();
    if (typeof Utils !== 'undefined') Utils.showToast('댓글이 삭제되었습니다.', 'error');
  };

  const initAdminMode = () => {
    // 관리자 모드 토글 버튼 제거 (사용자 요청)
  };

  const initQNAEvents = () => {
    const btnOpenWrite = document.getElementById('btnOpenQnaWrite');
    const formWrap = document.getElementById('qnaWriteForm');
    const btnCancel = document.getElementById('btnCancelQna');
    const btnSubmit = document.getElementById('btnSubmitQna');

    if (!btnOpenWrite || !formWrap) return;

    btnOpenWrite.addEventListener('click', () => {
      const user = localStorage.getItem('varo_user');
      if (!user) {
        alert('로그인이 필요한 페이지입니다.');
        location.href = './login.html';
        return;
      }
      formWrap.style.display = formWrap.style.display === 'none' ? 'block' : 'none';
      if (formWrap.style.display === 'block') {
        document.getElementById('qnaSubject').focus();
      }
    });

    btnCancel.addEventListener('click', () => {
      formWrap.style.display = 'none';
      document.getElementById('qnaSubject').value = '';
      document.getElementById('qnaContent').value = '';
    });

    btnSubmit.addEventListener('click', () => {
      const subject = document.getElementById('qnaSubject').value.trim();
      const content = document.getElementById('qnaContent').value.trim();
      const isSecret = document.getElementById('qnaIsSecret').checked;
      const password = document.getElementById('qnaPassword').value.trim();
      const user = JSON.parse(localStorage.getItem('varo_user') || '{}');

      if (!subject || !content) {
        alert('제목과 내용을 모두 입력해 주세요.');
        return;
      }

      if (isSecret && !password) {
        alert('비밀글 설정을 위해 비밀번호 4자리를 입력해 주세요.');
        document.getElementById('qnaPassword').focus();
        return;
      }

      const newInquiry = {
        id: Date.now(),
        author: user.name + '***',
        authorEmail: user.email,
        subject: subject,
        content: content,
        date: new Date().toLocaleDateString('ko-KR').replace(/ /g, '').slice(0, -1),
        isSecret: isSecret,
        password: password, // 비밀번호 저장
        status: 'pending',
        replies: []
      };

      state.qnaData.unshift(newInquiry);
      saveQNA();

      const userQnas = JSON.parse(localStorage.getItem('varo_user_qna') || '[]');
      userQnas.unshift(newInquiry);
      localStorage.setItem('varo_user_qna', JSON.stringify(userQnas));

      renderQNA();
      formWrap.style.display = 'none';
      document.getElementById('qnaSubject').value = '';
      document.getElementById('qnaContent').value = '';
      if (typeof Utils !== 'undefined') Utils.showToast('문의가 정상적으로 등록되었습니다.', 'success');
    });

    window.addEventListener('storage', (e) => {
      if (e.key === 'varo_qna') {
        loadQNA();
        renderQNA();
      }
    });

    // 비밀글 체크박스 토글 핸들러
    const qnaIsSecret = document.getElementById('qnaIsSecret');
    const qnaPasswordWrap = document.getElementById('qnaPasswordWrap');
    if (qnaIsSecret && qnaPasswordWrap) {
      qnaIsSecret.addEventListener('change', () => {
        qnaPasswordWrap.style.display = qnaIsSecret.checked ? 'flex' : 'none';
      });
    }

    // 텍스트 영역 자동 확장 (Auto-expand)
    const textareas = document.querySelectorAll('textarea.form-textarea, textarea.qna-reply-input');
    textareas.forEach(ta => {
      ta.addEventListener('input', () => autoExpand(ta));
    });
  };

  const autoExpand = (el) => {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  };

  const handleSecretClick = (qId) => {
    const q = state.qnaData.find(item => item.id === qId);
    if (!q) return;

    const inputPw = prompt('비밀번호 4자리를 입력해주세요.');
    if (!inputPw) return;

    if (inputPw === q.password) {
      state.unlockedPostIds.push(qId);
      renderQNA();
    } else {
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  /* ── 멤버십 CTA 제어 ────────────────────────────── */
  const updateMembershipCTA = () => {
    const user = JSON.parse(localStorage.getItem('varo_user') || 'null');
    const signupBtn = document.getElementById('btnGoSignup');
    const checkBtn = document.getElementById('btnCheckMembership');

    if (user) {
      if (signupBtn) signupBtn.style.display = 'none';
      if (checkBtn) {
        checkBtn.textContent = '내 멤버십 현황 확인하기';
        // 마이페이지의 멤버십 탭으로 직접 이동할 수 있도록 쿼리 스트링 처리
        checkBtn.href = './mypage.html?tab=membership';
      }
    } else {
      if (signupBtn) signupBtn.style.display = 'inline-block';
      if (checkBtn) {
        checkBtn.textContent = '내 멤버십 확인하기';
        checkBtn.href = './login.html';
      }
    }
  };

  /* ── 초기화 ───────────────────────────────────────── */
  const init = () => {
    const initialTab = getInitialTab();
    switchTab(initialTab);

    document.querySelectorAll('.comm-tab').forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    initNotice();
    renderNotices();
    initFAQ();
    renderFAQs();
    renderReviews();
    initReviewFilters();
    loadQNA();
    renderQNA();
    initQNAEvents();
    initAdminMode();
    updateMembershipCTA();

    // 실시간 동기화 리스너 추가
    window.addEventListener('varo:dataChange', (e) => {
      const type = e.detail.type;
      if (type === 'notice') renderNotices(currentNoticePage);
      if (type === 'faq') renderFAQs();
      if (type === 'reviews') renderReviews(currentReviewPage, document.querySelector('.review-filter.is-active').dataset.rating);
    });
  };

  return { init, handleReplySubmit, startEditReply, cancelEditReply, saveEditedReply, deleteReply, handleSecretClick, renderNotices, renderReviews };
})();

document.addEventListener('DOMContentLoaded', CommunityPageV2.init);
