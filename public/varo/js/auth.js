/**
 * js/auth.js — VARO 쇼핑몰 인증(로그인/회원가입) 기능 구현
 * 
 * - 유효성 검사 (이메일, 복합 비밀번호)
 * - 비밀번호 강도 측정 및 보기 토글
 * - 폼 에러 처리 및 상태 관리
 * - 로그인 성공 시 로컬 스토리지 연동
 * - 약관 보기 모달 시스템
 */

import Utils from './utils.js';

const Auth = (() => {
  /* ─── 정규표현식 (Regex) ────────────────────────────── */
  const REGEX = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  };

  /* ─── 초기화 (Init) ──────────────────────────────────── */
  const init = () => {
    try {
      bindCommonEvents();
      if (document.getElementById('loginForm')) initLogin();
      if (document.getElementById('signupForm')) initSignup();
      initTermsModal();
    } catch (e) {
      console.error('[Auth Init Error]', e);
    }
  };

  /* ─── 공통 이벤트 (Common) ───────────────────────────── */
  const bindCommonEvents = () => {
    document.querySelectorAll('.pw-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.dataset.target;
        const input = document.getElementById(targetId);
        if (!input) return;

        const isVisible = input.type === 'text';
        input.type = isVisible ? 'password' : 'text';

        const on = btn.querySelector('.eye-on');
        const off = btn.querySelector('.eye-off');
        if (on) on.style.display = isVisible ? 'block' : 'none';
        if (off) off.style.display = isVisible ? 'none' : 'block';

        btn.setAttribute('aria-label', isVisible ? '비밀번호 표시' : '비밀번호 숨기기');
      });
    });

    document.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('input', () => hideError(input));
    });
  };

  /* ─── 로그인 로직 (Login) ─────────────────────────────── */
  const initLogin = () => {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('loginEmail');
    const pwInput = document.getElementById('loginPassword');

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      if (!REGEX.email.test(emailInput.value)) {
        showError(emailInput, '유효한 이메일 주소를 입력해 주세요.');
        isValid = false;
      }
      if (pwInput.value.length < 1) {
        showError(pwInput, '비밀번호를 입력해 주세요.');
        isValid = false;
      }

      if (isValid) handleLogin(emailInput.value, pwInput.value);
    });
  };

  const handleLogin = (email, password) => {
    const users = Utils.storage.get('varo_users') || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      handleLoginSuccess(user);
    } else {
      Utils.showToast('이메일 또는 비밀번호가 일치하지 않습니다.', 'error');
    }
  };

  /* ─── 회원가입 로직 (Signup) ──────────────────────────── */
  const initSignup = () => {
    const form = document.getElementById('signupForm');
    const nameInput = document.getElementById('signupName');
    const emailInput = document.getElementById('signupEmail');
    const pwInput = document.getElementById('signupPw');
    const confirmInput = document.getElementById('signupPwConfirm');
    const termsAll = document.getElementById('termsAll');
    const terms = [
      document.getElementById('terms1'),
      document.getElementById('terms2'),
      document.getElementById('terms3')
    ];

    pwInput?.addEventListener('input', () => {
      updateStrengthUI(calculateStrength(pwInput.value));
    });

    termsAll?.addEventListener('change', (e) => {
      terms.forEach(t => { if (t) t.checked = e.target.checked; });
    });

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      if (!nameInput.value || nameInput.value.trim().length < 2) {
        showError(nameInput, '이름은 2자 이상 입력해 주세요.');
        isValid = false;
      }
      if (!REGEX.email.test(emailInput.value)) {
        showError(emailInput, '유효한 이메일 주소를 입력해 주세요.');
        isValid = false;
      }
      if (!REGEX.password.test(pwInput.value)) {
        showError(pwInput, '8자 이상, 영문+숫자+특수문자 조합이어야 합니다.');
        isValid = false;
      }
      if (pwInput.value !== confirmInput.value) {
        showError(confirmInput, '비밀번호가 일치하지 않습니다.');
        isValid = false;
      }
      if (terms[0] && terms[1] && (!terms[0].checked || !terms[1].checked)) {
        const errorEl = document.getElementById('termsError');
        if (errorEl) errorEl.textContent = '필수 약관에 동의해 주세요.';
        isValid = false;
      } else if (document.getElementById('termsError')) {
        document.getElementById('termsError').textContent = '';
      }

      if (isValid) {
        const users = Utils.storage.get('varo_users') || [];
        if (users.some(u => u.email === emailInput.value)) {
          showError(emailInput, '이미 가입된 이메일입니다.');
          return;
        }
        const newUser = {
          name: nameInput.value,
          email: emailInput.value,
          password: pwInput.value,
          joinDate: new Date().toISOString()
        };
        users.push(newUser);
        Utils.storage.set('varo_users', users);
        Utils.showToast(`${nameInput.value}님, 가입을 환영합니다!`, 'success');
        setTimeout(() => location.href = './login.html', 1500);
      }
    });
  };

  /* ─── 약관 모달 (Terms Modal) ────────────────────────── */
  const initTermsModal = () => {
    const modal = document.getElementById('termsModal');
    const modalBody = document.getElementById('termsModalBody');
    const closeBtn = modal?.querySelector('.varo-modal__close');
    const overlay = modal?.querySelector('.varo-modal__overlay');

    const termsData = {
      terms1: `<strong>제 1조 (목적)</strong><br><br>본 약관은 VARO 쇼핑몰이 제공하는 인터넷 관련 서비스(이하 "서비스"라 한다)를 이용함에 있어 쇼핑몰과 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.<br><br><strong>제 2조 (서비스의 제공 및 변경)</strong><br>1. 쇼핑몰은 다음과 같은 업무를 수행합니다.<br>- 재화 또는 용역에 대한 정보 제공 및 구매계약의 체결<br>- 구매계약이 체결된 재화 또는 용역의 배송<br>- 기타 쇼핑몰이 정하는 업무`,
      terms2: `<strong>개인정보 처리방침</strong><br><br>1. 수집하는 개인정보 항목: 이름, 이메일, 비밀번호, 서비스 이용 기록<br>2. 개인정보 수집 목적: 회원 가입 및 관리, 서비스 제공, 고객 상담<br>3. 보유 및 이용 기간: 회원 탈퇴 시까지 (관련 법령에 의거 보존 필요 시 해당 기간 보존)`
    };

    const openModal = (key) => {
      if (!modal || !modalBody) return;
      modalBody.innerHTML = termsData[key] || '준비 중입니다.';
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      if (!modal) return;
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    document.querySelectorAll('.terms-detail').forEach((link, idx) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(`terms${idx + 1}`);
      });
    });

    closeBtn?.addEventListener('click', closeModal);
    overlay?.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  };

  /* ─── 유틸리티 함수 ─────────────────────────────────── */
  const showError = (input, message) => {
    if (!input) return;
    input.classList.add('is-error');
    const errorEl = document.getElementById(input.getAttribute('aria-describedby')?.split(' ')[0] || (input.id + 'Error'));
    if (errorEl) errorEl.textContent = message;
  };

  const hideError = (input) => {
    if (!input) return;
    input.classList.remove('is-error');
    const errorEl = document.getElementById(input.getAttribute('aria-describedby')?.split(' ')[0] || (input.id + 'Error'));
    if (errorEl) errorEl.textContent = '';
  };

  const calculateStrength = (pw) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[a-zA-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[@$!%*?&]/.test(pw)) score++;
    return score;
  };

  const updateStrengthUI = (score) => {
    const segments = document.querySelectorAll('.pw-strength__seg');
    const label = document.getElementById('pwStrengthLabel');
    const container = document.getElementById('pwStrength');
    if (!container || !label) return;
    container.className = 'pw-strength';
    segments.forEach(seg => seg.style.backgroundColor = 'var(--color-border)');
    if (score === 0) { label.textContent = ''; return; }
    let status = 'weak', color = '#E02020';
    if (score === 3) { status = 'medium'; color = '#FFB800'; }
    else if (score >= 4) { status = 'strong'; color = '#00C853'; }
    container.classList.add(`pw-strength--${status}`);
    label.textContent = status.toUpperCase();
    for (let i = 0; i < score; i++) { if (segments[i]) segments[i].style.backgroundColor = color; }
  };

  const handleLoginSuccess = (user) => {
    Utils.storage.set('varo_user', { email: user.email, name: user.name, loginTime: new Date().toISOString() });
    Utils.showToast(`${user.name}님 안녕하세요. 로그인을 환영합니다!`, 'success');
    setTimeout(() => location.href = './index.html', 1000);
  };

  const logout = () => {
    Utils.storage.remove('varo_user');
    Utils.showToast('로그아웃 되었습니다.', 'success');
    setTimeout(() => location.reload(), 800);
  };

  return { init, logout };
})();

Auth.init();
window.Auth = Auth;
export default Auth;
