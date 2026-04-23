/**
 * public/varo/js/find_account.js — 아이디/비밀번호 찾기 클라이언트 로직
 */
'use strict';

let authTimerInterval = null;
let currentEmail = '';
let currentCode = '';

/**
 * 모달 열기
 * @param {string} tab 'id' 또는 'pw'
 */
window.openFindAccount = (tab) => {
  const modal = document.getElementById('findAccountModal');
  if (modal) {
    modal.classList.remove('u-hidden');
    switchFindTab(tab);
  }
};

/**
 * 모달 닫기
 */
window.closeFindAccount = () => {
  const modal = document.getElementById('findAccountModal');
  if (modal) {
    modal.classList.add('u-hidden');
    resetFindForms();
  }
};

/**
 * 탭 전환
 */
window.switchFindTab = (tab) => {
  const tabs = document.querySelectorAll('.find-tab');
  const idSection = document.getElementById('findIdSection');
  const pwSection = document.getElementById('findPwSection');

  tabs.forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tab);
  });

  if (tab === 'id') {
    idSection.classList.remove('u-hidden');
    pwSection.classList.add('u-hidden');
  } else {
    idSection.classList.add('u-hidden');
    pwSection.classList.remove('u-hidden');
  }
};

/**
 * 폼 리셋
 */
function resetFindForms() {
  // ID 폼 리셋
  document.getElementById('findIdName').value = '';
  document.getElementById('findIdPhone').value = '';
  const result = document.getElementById('findIdResult');
  result.classList.add('u-hidden');
  result.textContent = '';

  // PW 폼 리셋
  document.getElementById('findPwEmail').value = '';
  document.getElementById('findPwCode').value = '';
  document.getElementById('newPassword').value = '';
  document.getElementById('newPasswordConfirm').value = '';

  document.getElementById('pwStage1').classList.remove('u-hidden');
  document.getElementById('pwStage2').classList.add('u-hidden');
  document.getElementById('pwStage3').classList.add('u-hidden');

  stopTimer();
}

/**
 * 아이디 찾기 처리
 */
window.handleFindId = async () => {
  const name = document.getElementById('findIdName').value.trim();
  const email = document.getElementById('findIdEmail')?.value.trim();

  if (!name || !email) return alert('이름과 이메일을 입력해주세요.');

  try {
    const response = await fetch('/api/auth/find-id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    });
    const data = await response.json();

    const resultDiv = document.getElementById('findIdResult');
    resultDiv.classList.remove('u-hidden');

    if (response.ok) {
      resultDiv.innerHTML = `가입된 이메일은 <strong>${data.email}</strong> 입니다.`;
    } else {
      resultDiv.textContent = data.error || '정보를 찾을 수 없습니다.';
    }
  } catch (error) {
    alert('서버 오류가 발생했습니다.');
  }
};

/**
 * 인증 코드 요청 처리
 */
window.handleRequestCode = async () => {
  const email = document.getElementById('findPwEmail').value.trim();
  if (!email) return alert('이메일을 입력해주세요.');

  try {
    const response = await fetch('/api/auth/request-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await response.json();

    if (response.ok) {
      currentEmail = email;
      alert('인증번호가 발송되었습니다. 이메일을 확인해주세요.');
      document.getElementById('pwStage1').classList.add('u-hidden');
      document.getElementById('pwStage2').classList.remove('u-hidden');
      startTimer();
    } else {
      alert(data.error || '요청 실패');
    }
  } catch (error) {
    alert('서버 오류가 발생했습니다.');
  }
};

/**
 * 인증 코드 확인 처리
 */
window.handleVerifyCode = async () => {
  const code = document.getElementById('findPwCode').value.trim();
  if (!code) return alert('인증번호를 입력해주세요.');

  try {
    const response = await fetch('/api/auth/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: currentEmail, code })
    });
    const data = await response.json();

    if (response.ok) {
      currentCode = code;
      alert('인증되었습니다. 새로운 비밀번호를 설정해주세요.');
      document.getElementById('pwStage2').classList.add('u-hidden');
      document.getElementById('pwStage3').classList.remove('u-hidden');
      stopTimer();
    } else {
      alert(data.error || '인증 실패');
    }
  } catch (error) {
    alert('서버 오류가 발생했습니다.');
  }
};

/**
 * 비밀번호 재설정 처리
 */
window.handleResetPassword = async () => {
  const newPassword = document.getElementById('newPassword').value;
  const newPasswordConfirm = document.getElementById('newPasswordConfirm').value;

  if (newPassword.length < 8) return alert('비밀번호는 8자 이상이어야 합니다.');
  if (newPassword !== newPasswordConfirm) return alert('비밀번호가 일치하지 않습니다.');

  try {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: currentEmail,
        code: currentCode,
        newPassword
      })
    });
    const data = await response.json();

    if (response.ok) {
      alert('비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.');
      closeFindAccount();
    } else {
      alert(data.error || '변경 실패');
    }
  } catch (error) {
    alert('서버 오류가 발생했습니다.');
  }
};

/**
 * 타이머 시작
 */
function startTimer() {
  let timeLeft = 300; // 5분
  const timerSpan = document.getElementById('authTimer');

  stopTimer();

  authTimerInterval = setInterval(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerSpan.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    if (timeLeft <= 0) {
      stopTimer();
      alert('인증 시간이 만료되었습니다. 다시 요청해주세요.');
      document.getElementById('pwStage2').classList.add('u-hidden');
      document.getElementById('pwStage1').classList.remove('u-hidden');
    }
    timeLeft--;
  }, 1000);
}

/**
 * 타이머 중지
 */
function stopTimer() {
  if (authTimerInterval) {
    clearInterval(authTimerInterval);
    authTimerInterval = null;
  }
}

/**
 * 전역 이벤트 리스너: ESC 키 및 모달 바깥 클릭 시 닫기
 */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeFindAccount();
    // 다른 바로 모달들도 있으면 여기서 닫기 호출 가능
    if (typeof window.closeAllModals === 'function') window.closeAllModals();
  }
});

document.addEventListener('mousedown', (e) => {
  const modal = document.getElementById('findAccountModal');
  const content = modal?.querySelector('.modal-content');
  if (modal && !modal.classList.contains('u-hidden') && content && !content.contains(e.target)) {
    closeFindAccount();
  }
});
