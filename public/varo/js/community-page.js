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
      { user: '민준 *', rating: 5, product: '더블 브레스티드 코트', date: '2026.04.10', body: '카멜 색상 진짜 예쁩니다. 소재도 고급지고 핏이 너무 마음에 들어요. 주변에서 어디 샀냐고 많이 물어봐요!', sizeInfo: 'M 구매 / 평소 M 착용', img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=60&h=80&fit=crop&q=80', hasPhoto: true },
      { user: '도현 *', rating: 5, product: '와이드 카고 팬츠', date: '2026.04.08', body: '카키 색상 진짜 예뻐요. 와이드 핏이라 걸을때 편하고 카고 포켓도 실용적입니다. 재구매 의사 있어요.', sizeInfo: 'M 구매 / 평소 M 착용', img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=60&h=80&fit=crop&q=80', hasPhoto: true },
      { user: '해찬 *', rating: 4, product: '코튼 오버핏 헤비 티셔츠', date: '2026.04.07', body: '두꺼운 원단 퀄리티가 정말 좋네요. 색감도 사진과 똑같이 나왔습니다. 그레이도 사려고요.', sizeInfo: 'L 구매 / 평소 M 착용', img: null, hasPhoto: false },
      { user: '지우 *', rating: 5, product: '스웨트 오버사이즈 후드', date: '2026.04.06', body: '두께감 진짜 좋아요! 320gsm이라 그런지 묵직하고 따뜻합니다. 아이보리 색상 너무 예뻐요.', sizeInfo: 'L 구매 / 평소 M 착용', img: 'https://images.unsplash.com/photo-1556821840-3a63f8550d64?w=60&h=80&fit=crop&q=80', hasPhoto: true },
      { user: '박준 *', rating: 4, product: '슬림 테이퍼드 슬랙스', date: '2026.04.05', body: '핏이 정말 깔끔해요. 차콜 색상으로 샀는데 어디에나 잘 어울립니다.', sizeInfo: '32 구매 / 평소 32 착용', img: null, hasPhoto: false },
      { user: '서준 *', rating: 5, product: '하프집업 니트 스웨터', date: '2026.04.04', body: '오트밀 색상 진짜 예쁘네요. 소재도 부드럽고 하프집업이라 스타일 연출이 다양해서 좋아요.', sizeInfo: 'M 구매 / 평소 M 착용', img: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=60&h=80&fit=crop&q=80', hasPhoto: true },
    ];

    list.innerHTML = reviews.map(r => `
      <li class="review-card-comm">
        <div class="review-card-comm__header">
          <span class="review-card-comm__stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
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
              <p class="qna-subject">${q.isSecret ? '<span style="color:#AAA">🔒 비밀글입니다. </span>' : ''}${q.subject}</p>
              <p class="qna-meta" style="margin-top:8px; line-height:1.6; color:#555;">${q.content}</p>
              <p class="qna-meta" style="margin-top:8px;"><span class="qna-author">${q.author}</span> · ${q.date}</p>
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
                      <span class="qna-reply-user">${r.author}</span>
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
                      <textarea id="editReplyInput-${r.id}" class="qna-reply-input" style="width:100%; min-height:60px; padding:8px; font-size:13px;">${r.content}</textarea>
                      <div style="display:flex; gap:5px; margin-top:5px; justify-content:flex-end;">
                        <button type="button" class="btn btn--outline btn--xs" onclick="CommunityPageV2.cancelEditReply()" style="padding:4px 8px; font-size:11px;">취소</button>
                        <button type="button" class="btn btn--primary btn--xs" onclick="CommunityPageV2.saveEditedReply(${q.id}, ${r.id})" style="padding:4px 8px; font-size:11px;">저장</button>
                      </div>
                    </div>
                  ` : `
                    <div class="qna-reply-body">${r.content}</div>
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
              <p class="qna-subject" style="color:#888;">🔒 비밀글입니다. <span style="font-size:11px; font-weight:400;">(클릭하여 비밀번호 입력)</span></p>
              <p class="qna-meta"><span class="qna-author">${q.author}</span> · ${q.date}</p>
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

    initFAQ();
    renderReviews();
    loadQNA();
    renderQNA();
    initQNAEvents();
    initAdminMode();
    updateMembershipCTA(); // CTA 버튼 상태 업데이트
  };

  return { init, handleReplySubmit, startEditReply, cancelEditReply, saveEditedReply, deleteReply, handleSecretClick };
})();

document.addEventListener('DOMContentLoaded', CommunityPageV2.init);
