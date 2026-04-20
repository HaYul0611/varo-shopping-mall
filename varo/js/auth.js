/**
 * js/auth.js — VARO 쇼핑몰 인증(로그인/회원가입) 기능 구현
 * 
 * - 유효성 검사 (이메일, 복합 비밀번호)
 * - 비밀번호 강도 측정 및 보기 토글
 * - 폼 에러 처리 및 상태 관리
 * - 로그인 성공 시 로컬 스토리지 연동
 */

import Utils from './utils.js';

const Auth = (() => {
  /* ─── 정규표현식 (Regex) ────────────────────────────── */
  const REGEX = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    // 8자 이상, 영문, 숫자, 특수문자 조합
    password: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  };

  /* ─── 초기화 (Init) ──────────────────────────────────── */
  const init = () => {
    bindCommonEvents();

    if (document.getElementById('loginForm')) initLogin();
    if (document.getElementById('signupForm')) initSignup();
  };

  /* ─── 공통 이벤트 (Common) ───────────────────────────── */
  const bindCommonEvents = () => {
    // 비밀번호 보기/숨기기 토글
    document.querySelectorAll('.pw-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const input = document.getElementById(targetId);
        if (!input) return;

        const isVisible = input.type === 'text';
        input.type = isVisible ? 'password' : 'text';

        // 아이콘 전환
        btn.querySelector('.eye-on').style.display = isVisible ? 'block' : 'none';
        btn.querySelector('.eye-off').style.display = isVisible ? 'none' : 'block';

        btn.setAttribute('aria-label', isVisible ? '비밀번호 표시' : '비밀번호 숨기기');
      });
    });

    // 입력 시 에러 제거
    document.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('input', () => {
        hideError(input);
      });
    });
  };

  /* ─── 로그인 로직 (Login) ─────────────────────────────── */
  const initLogin = () => {
    const form = document.getElementById('loginForm');
    const submitBtn = document.getElementById('loginSubmit');
    const emailInput = document.getElementById('loginEmail');
    const pwInput = document.getElementById('loginPassword');

    submitBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      let isValid = true;

      // 1. 이메일 검증
      if (!REGEX.email.test(emailInput.value)) {
        showError(emailInput, '유효한 이메일 주소를 입력해 주세요.');
        isValid = false;
      }

      // 2. 비밀번호 검증 (로그인은 형식보다는 필수값 위주)
      if (pwInput.value.length < 1) {
        showError(pwInput, '비밀번호를 입력해 주세요.');
        isValid = false;
      }

      if (isValid) {
        handleLoginSuccess(emailInput.value);
      }
    });
  };

  /* ─── 회원가입 로직 (Signup) ──────────────────────────── */
  const initSignup = () => {
    const form = document.getElementById('signupForm');
    const submitBtn = document.getElementById('signupSubmit');

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

    // 비밀번호 강도 실시간 체크
    pwInput?.addEventListener('input', () => {
      const strength = calculateStrength(pwInput.value);
      updateStrengthUI(strength);
    });

    // 약관 전체 동의
    termsAll?.addEventListener('change', (e) => {
      terms.forEach(t => t.checked = e.target.checked);
    });

    submitBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      let isValid = true;

      // 1. 이름 검증
      if (nameInput.value.trim().length < 2) {
        showError(nameInput, '이름은 2자 이상 입력해 주세요.');
        isValid = false;
      }

      // 2. 이메일 검증
      if (!REGEX.email.test(emailInput.value)) {
        showError(emailInput, '유효한 이메일 주소를 입력해 주세요.');
        isValid = false;
      }

      // 3. 비밀번호 조합 검증
      if (!REGEX.password.test(pwInput.value)) {
        showError(pwInput, '8자 이상, 영문+숫자+특수문자 조합이어야 합니다.');
        isValid = false;
      }

      // 4. 비밀번호 확인 일치 검증
      if (pwInput.value !== confirmInput.value) {
        showError(confirmInput, '비밀번호가 일치하지 않습니다.');
        isValid = false;
      }

      // 5. 필수 약관 검증
      if (!terms[0].checked || !terms[1].checked) {
        const errorEl = document.getElementById('termsError');
        errorEl.textContent = '필수 약관에 동의해 주세요.';
        isValid = false;
      } else {
        document.getElementById('termsError').textContent = '';
      }

      if (isValid) {
        Utils.showToast(`${nameInput.value}님, 환영합니다! 가입이 완료되었습니다.`, 'success');
        setTimeout(() => {
          location.href = './login.html';
        }, 1500);
      }
    });
  };

  /* ─── 유틸리티 함수 ─────────────────────────────────── */

  const showError = (input, message) => {
    input.classList.add('is-error');
    const errorEl = document.getElementById(input.getAttribute('aria-describedby')?.split(' ')[0] || (input.id + 'Error'));
    if (errorEl) {
      errorEl.textContent = message;
    }
  };

  const hideError = (input) => {
    input.classList.remove('is-error');
    const errorEl = document.getElementById(input.getAttribute('aria-describedby')?.split(' ')[0] || (input.id + 'Error'));
    if (errorEl) {
      errorEl.textContent = '';
    }
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

    container.className = 'pw-strength';
    segments.forEach(seg => seg.style.backgroundColor = 'var(--color-border)');

    if (score === 0) {
      label.textContent = '';
      return;
    }

    let status = 'weak';
    let color = '#E02020';

    if (score === 3) {
      status = 'medium';
      color = '#FFB800';
    } else if (score >= 4) {
      status = 'strong';
      color = '#00C853';
    }

    container.classList.add(`pw-strength--${status}`);
    label.textContent = status.toUpperCase();

    for (let i = 0; i < score; i++) {
      if (segments[i]) segments[i].style.backgroundColor = color;
    }
  };

  const handleLoginSuccess = (email) => {
    // 보안을 위해 XSS 방지 처리하여 저장
    const safeEmail = Utils.escapeHTML(email);
    Utils.storage.set('varo_user', {
      email: safeEmail,
      name: safeEmail.split('@')[0],
      loginTime: new Date().toISOString()
    });

    Utils.showToast('로그인에 성공했습니다. 잠시 후 이동합니다.', 'success');
    setTimeout(() => {
      location.href = './index.html';
    }, 1000);
  };

  return { init };
})();

// 초기화 실행
document.addEventListener('DOMContentLoaded', Auth.init);

export default Auth;
