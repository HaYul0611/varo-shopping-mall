/* 경로: js/mypage.js */
const MyPage = (() => {
  const init = () => {
    // 탭 전환 로직
    const tabs = document.querySelectorAll('.mypage-nav__link[data-tab]');
    const sections = document.querySelectorAll('.mypage-section');

    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = tab.getAttribute('data-tab');
        if (!targetId) return;

        tabs.forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');

        sections.forEach(s => {
          s.style.display = 'none';
          s.classList.remove('is-active');
        });

        const targetSection = document.getElementById(`section-${targetId}`);
        if (targetSection) {
          targetSection.style.display = 'block';
          targetSection.classList.add('is-active');
        }

        if (targetId === 'inquiry') renderInquiries();
        if (targetId === 'payment') renderPayment();
        if (targetId === 'orders') loadOrders();
      });
    });

    // 프로필 로드
    loadProfile();

    // 로그아웃 (사이드바)
    document.getElementById('btnLogout')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('로그아웃 하시겠습니까?')) {
        Utils.storage.remove('varo_user');
        location.replace('./index.html');
      }
    });

    // 프로필 수정 제출
    document.getElementById('profileForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const newName = document.getElementById('profileName').value;
      const newPhone = document.getElementById('profilePhone').value;
      const newPostcode = document.getElementById('profilePostcode').value;
      const newAddress = document.getElementById('profileAddress').value;
      const newDetailAddress = document.getElementById('profileDetailAddress').value;
      const newPassword = document.getElementById('profilePassword').value;

      const user = Utils.storage.get('varo_user');
      if (!user) return;

      const updateData = {
        ...user,
        name: newName,
        phone: newPhone,
        postcode: newPostcode,
        address: newAddress,
        detailAddress: newDetailAddress
      };
      if (newPassword) updateData.password = newPassword;

      // 로컬 스토리지 및 전체 유저 데이터 업데이트
      const users = Utils.storage.get('varo_users') || [];
      const userIdx = users.findIndex(u => u.email === user.email);
      if (userIdx !== -1) {
        users[userIdx] = { ...users[userIdx], ...updateData };
        Utils.storage.set('varo_users', users);
      }
      Utils.storage.set('varo_user', updateData);

      // 커스텀 이벤트 발생 (main.js에서 감지)
      window.dispatchEvent(new CustomEvent('varo:authChange'));

      Utils.showToast('성공적으로 수정되었습니다.', 'success');
      setTimeout(() => location.reload(), 1000);
    });

    // 이미지 크롭 관련 로직
    initImageCrop();

    // 회원 탈퇴
    document.getElementById('btnWithdraw')?.addEventListener('click', () => {
      if (confirm('정말로 탈퇴하시겠습니까? 모든 구매 내역이 유실됩니다.')) {
        if (App?.Auth) {
          App.Auth.withdraw();
          Utils.showToast('탈퇴 처리가 완료되었습니다.');
          setTimeout(() => location.replace('./index.html'), 1500);
        }
      }
    });

    // 주소 검색 버튼
    document.getElementById('btnSearchAddress')?.addEventListener('click', () => {
      // Daum 우편번호 서비스 (전역 스크립트 가정)
      if (window.daum && window.daum.Postcode) {
        new window.daum.Postcode({
          oncomplete: (data) => {
            document.getElementById('profilePostcode').value = data.zonecode;
            document.getElementById('profileAddress').value = data.address;
            document.getElementById('profileDetailAddress').focus();
          }
        }).open();
      } else {
        Utils.showToast('주소 검색 서비스를 로드할 수 없습니다.', 'error');
      }
    });

    // 실시간 동기화 리스너
    window.addEventListener('varo:authChange', loadProfile);
  };

  // 프로필 로드
  const loadProfile = () => {
    const u = Utils.storage.get('varo_user');
    if (!u) return;
    const emailInput = document.getElementById('profileEmail');
    const nameInput = document.getElementById('profileName');
    const phoneInput = document.getElementById('profilePhone');
    const postcodeInput = document.getElementById('profilePostcode');
    const addressInput = document.getElementById('profileAddress');
    const detailAddressInput = document.getElementById('profileDetailAddress');
    const preview = document.getElementById('profilePreview');
    const sidebarAvatar = document.getElementById('myPageAvatar');
    const sidebarGrade = document.querySelector('.user-brief .user-grade');
    const nameLabel = document.getElementById('userNameLabel');

    if (emailInput) emailInput.value = u.email;
    if (nameInput) nameInput.value = u.name;
    if (phoneInput) phoneInput.value = u.phone || '';
    if (postcodeInput) postcodeInput.value = u.postcode || '';
    if (addressInput) addressInput.value = u.address || '';
    if (detailAddressInput) detailAddressInput.value = u.detailAddress || '';
    if (nameLabel) nameLabel.textContent = u.name;

    // 아바타 업데이트
    const updateAvatar = (url) => {
      if (!url) return;
      if (preview) {
        preview.style.backgroundImage = `url(${url})`;
        preview.classList.add('has-image');
      }
      if (sidebarAvatar) {
        sidebarAvatar.innerHTML = `<img src="${url}" style="width:100%; height:100%; object-fit:cover">`;
      }
    };
    updateAvatar(u.avatarUrl);

    // 등급 뱃지 동기화
    if (sidebarGrade) {
      const grade = u.grade || 'BRONZE';
      sidebarGrade.textContent = `${grade} MEMBER`;
      sidebarGrade.className = `user-grade header-top__badge is-${grade.toLowerCase()}`;
    }
  };

  /* ── 인터랙티브 이미지 크롭 엔진 (휠 줌 전용) ── */
  const initImageCrop = () => {
    const input = document.getElementById('profileImageInput');
    const modal = document.getElementById('cropModal');
    const img = document.getElementById('cropImage');
    const saveBtn = document.getElementById('saveCrop');
    const sidebarAvatar = document.getElementById('myPageAvatar');

    let scale = 1;
    let originX = 0, originY = 0;
    let isDragging = false;
    let startX = 0, startY = 0;

    if (img) img.draggable = false; // 브라우저 기본 드래그 차단

    const closeModal = () => {
      modal.classList.remove('is-active');
      if (input) input.value = ''; // 재선택 가능하도록 리셋
    };

    // 사이드바 아바타 클릭 시 파일 선택
    sidebarAvatar?.addEventListener('click', () => input?.click());

    input?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
          img.src = re.target.result;
          modal.classList.add('is-active');
          // 초기화
          scale = 1; originX = 0; originY = 0;
          updateTransform();
        };
        reader.readAsDataURL(file);
      }
    });

    const updateTransform = () => {
      requestAnimationFrame(() => {
        img.style.transform = `translate(calc(-50% + ${originX}px), calc(-50% + ${originY}px)) scale(${scale})`;
      });
    };

    // 마우스 휠 줌 (감도 최적화)
    img?.parentElement?.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      scale = Math.min(Math.max(0.3, scale + delta), 5);
      updateTransform();
    }, { passive: false });

    // 드래그 이동
    img?.addEventListener('mousedown', (e) => {
      e.preventDefault(); // 기본 드래그/선택 방지
      isDragging = true;
      startX = e.clientX - originX;
      startY = e.clientY - originY;
      img.style.cursor = 'grabbing';

      const onMove = (me) => {
        if (!isDragging) return;
        originX = me.clientX - startX;
        originY = me.clientY - startY;
        updateTransform();
      };

      const onUp = () => {
        isDragging = false;
        img.style.cursor = 'move';
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });

    saveBtn?.addEventListener('click', () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const cropSize = 400; // 고해상도 저장
      canvas.width = cropSize;
      canvas.height = cropSize;

      ctx.beginPath();
      ctx.arc(cropSize / 2, cropSize / 2, cropSize / 2, 0, Math.PI * 2);
      ctx.clip();

      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, cropSize, cropSize);

      ctx.save();
      ctx.translate(cropSize / 2, cropSize / 2);
      const ratio = cropSize / 250; // 오버레이 크기 기준 비율
      ctx.scale(scale * ratio, scale * ratio);
      ctx.translate(originX, originY);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      ctx.restore();

      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      const user = Utils.storage.get('varo_user');
      if (user) {
        user.avatarUrl = dataUrl;
        Utils.storage.set('varo_user', user);

        const users = Utils.storage.get('varo_users') || [];
        const idx = users.findIndex(u => u.email === user.email);
        if (idx !== -1) {
          users[idx].avatarUrl = dataUrl;
          Utils.storage.set('varo_users', users);
        }

        window.dispatchEvent(new CustomEvent('varo:authChange'));
        loadProfile();
        Utils.showToast('프로필 이미지가 변경되었습니다.', 'success');
      }
      closeModal();
    });

    document.getElementById('cancelCrop')?.addEventListener('click', closeModal);
    document.getElementById('closeCropModal')?.addEventListener('click', closeModal);
  };

  // 문의내역 렌더링
  const renderInquiries = () => {
    if (!App?.Inquiry) return;
    const list = App.Inquiry.getMyList();
    const tbody = document.getElementById('myInquiryList');
    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" class="empty-row">문의 내역이 없습니다.</td></tr>';
      return;
    }

    tbody.innerHTML = list.map(i => `
      <tr class="inquiry-row" onclick="this.nextElementSibling.classList.toggle('is-visible')">
        <td>${i.date}</td>
        <td style="text-align:left; cursor:pointer">${Utils.escapeHTML(i.title)}</td>
        <td><span class="status-badge ${i.status === '답변완료' ? 'success' : ''}">${i.status}</span></td>
      </tr>
      <tr class="inquiry-detail" style="display:none">
        <td colspan="3">
          <div class="inquiry-q"><strong>Q:</strong> ${Utils.escapeHTML(i.content)}</div>
          ${i.reply ? `<div class="inquiry-a"><strong>A:</strong> ${Utils.escapeHTML(i.reply)}</div>` : '<div class="inquiry-a no-reply">아직 답변이 등록되지 않았습니다.</div>'}
        </td>
      </tr>
    `).join('');
  };

  const renderPayment = () => {
    const container = document.getElementById('paymentCardList');
    if (!container) return;
    const cards = Utils.storage.get('varo_cards') || [];
    container.innerHTML = cards.length ? cards.map(c => `
      <div class="card-item">
        <div class="card-type">${c.type}</div>
        <div class="card-number">**** **** **** ${c.last4}</div>
        <button class="btn-delete" onclick="MyPage.deleteCard('${c.id}')">삭제</button>
      </div>
    `).join('') : '<div class="empty-row">등록된 결제 수단이 없습니다.</div>';
  };

  const loadOrders = async () => {
    const tbody = document.getElementById('orderHistoryList');
    if (!tbody) return;
    try {
      const orders = await API.orders.getAll();
      tbody.innerHTML = orders.length ? orders.map(o => {
        const canCancel = o.status === 'pending' || o.status === 'preparing';
        const canRefund = o.status === 'delivered';
        return `
          <tr>
            <td>${o.created_at.slice(0, 10)}</td>
            <td style="text-align:left">
              <div style="font-weight:500">${o.items?.[0]?.name}${o.items?.length > 1 ? ` 외 ${o.items.length - 1}건` : ''}</div>
              <div style="font-size:11px;color:#888">No. ${o.order_number}</div>
            </td>
            <td style="font-weight:700">${(o.total || 0).toLocaleString()}원</td>
            <td>
              <span class="status-badge ${o.status}">${o.status}</span>
              <div style="margin-top:5px; display:flex; gap:4px; justify-content:center">
                ${canCancel ? `<button class="btn btn--outline btn--xs" onclick="MyPage.requestClaim(${o.id}, 'cancelled')">주문취소</button>` : ''}
                ${canRefund ? `<button class="btn btn--outline btn--xs" onclick="MyPage.requestClaim(${o.id}, 'return_requested')">반품신청</button>` : ''}
              </div>
            </td>
          </tr>
        `;
      }).join('') : '<tr><td colspan="4" class="empty-row">주문 내역이 없습니다.</td></tr>';
    } catch (e) {
      console.error('[MyPage] 주문 조회 실패:', e);
    }
  };

  const requestClaim = async (id, status) => {
    const reason = prompt('사유를 입력해 주세요:');
    if (!reason) return;
    try {
      await API.orders.updateStatus(id, status, { reason });
      Utils.showToast('요청이 완료되었습니다.', 'success');
      loadOrders();
      window.dispatchEvent(new CustomEvent('varo:authChange'));
    } catch (e) {
      Utils.showToast(e.message, 'error');
    }
  };

  return { init };
})();

document.addEventListener('DOMContentLoaded', MyPage.init);
