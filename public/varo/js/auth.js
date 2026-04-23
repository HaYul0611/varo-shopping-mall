/* js/auth.js — Authentication Logic (Standard Script, Loop Guarded, Force Admin) */
'use strict';

const Auth = (() => {
  const REGEX = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/
  };

  let initialized = false;

  const init = () => {
    if (initialized || window.AuthInitialized) return;
    initialized = true;
    window.AuthInitialized = true;
    console.log('[Auth] Initializing System...');

    const userStr = localStorage.getItem('varo_user');
    const path = window.location.pathname;

    if (userStr && userStr !== 'undefined') {
      const user = JSON.parse(userStr);
      if (user.email === 'admin@varo.com') {
        user.is_admin = true;
        user.role = 'ADMIN';
        localStorage.setItem('varo_user', JSON.stringify(user));
      }
      const isAdmin = user.is_admin || user.role === 'ADMIN';
      if (path.includes('login.html') || path.includes('signup.html')) {
        console.log('[Auth] Redirecting authorized user...');
        location.replace('./index.html');
        return;
      }
    }

    restoreRememberState();
    bindCommonEvents();
    if (document.getElementById('loginForm')) initLogin();
    if (document.getElementById('signupForm')) initSignup();
  };

  const restoreRememberState = () => {
    const rememberMe = localStorage.getItem('varo_remember_me') === 'true';
    const emailInput = document.getElementById('loginEmail');
    if (rememberMe && emailInput) emailInput.value = localStorage.getItem('varo_remembered_email') || '';
  };

  const bindCommonEvents = () => {
    document.querySelectorAll('.pw-toggle').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const input = document.getElementById(btn.dataset.target);
        if (!input) return;
        const isVisible = input.type === 'text';
        input.type = isVisible ? 'password' : 'text';
        const eyeOn = btn.querySelector('.eye-on');
        const eyeOff = btn.querySelector('.eye-off');
        if (eyeOn && eyeOff) {
          if (isVisible) {
            eyeOn.classList.remove('u-hidden');
            eyeOff.classList.add('u-hidden');
          } else {
            eyeOn.classList.add('u-hidden');
            eyeOff.classList.remove('u-hidden');
          }
        }
      };
    });
  };

  const initLogin = () => {
    const form = document.getElementById('loginForm');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const pw = document.getElementById('loginPassword').value.trim();

      if (window.API?.auth) {
        const res = await window.API.auth.login(email, pw);
        if (res.success) {
          if (document.getElementById('loginRemember')?.checked) {
            localStorage.setItem('varo_remembered_email', email);
          }
          location.href = './index.html';
        } else {
          alert('로그인 실패: ' + (res.error || '정보를 확인하세요.'));
        }
      }
    });
  };

  const initSignup = () => {
    const form = document.getElementById('signupForm');
    const termsAll = document.getElementById('termsAll');
    const termChecks = document.querySelectorAll('.terms-list input[type="checkbox"]');

    if (termsAll) {
      termsAll.addEventListener('change', (e) => {
        termChecks.forEach(chk => {
          chk.checked = e.target.checked;
        });
      });

      termChecks.forEach(chk => {
        chk.addEventListener('change', () => {
          const allChecked = Array.from(termChecks).every(c => c.checked);
          termsAll.checked = allChecked;
        });
      });
    }

    // 비밀번호 강도 표시기 연동
    const pwInput = document.getElementById('signupPw');
    const segs = document.querySelectorAll('.pw-strength__seg');
    const label = document.getElementById('pwStrengthLabel');

    if (pwInput && segs.length) {
      const calcStrength = (pw) => {
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[a-zA-Z]/.test(pw)) score++;
        if (/\d/.test(pw)) score++;
        if (/[^a-zA-Z\d]/.test(pw)) score++;
        return score; // 0~4
      };

      const LEVELS = [
        { label: '', cls: '' },
        { label: '보안취약', cls: 'strength-1' },
        { label: '미흡', cls: 'strength-2' },
        { label: '양호', cls: 'strength-3' },
        { label: '안전', cls: 'strength-4' },
      ];

      pwInput.addEventListener('input', () => {
        const score = calcStrength(pwInput.value);
        segs.forEach((seg, i) => {
          seg.className = 'pw-strength__seg';
          if (i < score) seg.classList.add(LEVELS[score].cls || `strength-${score}`);
        });
        if (label) {
          label.textContent = pwInput.value.length > 0 ? LEVELS[score].label : '';
        }
      });
    }

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('signupEmail').value.trim();
      const pw = document.getElementById('signupPw').value.trim();
      const pwConfirm = document.getElementById('signupPwConfirm').value.trim();
      const name = document.getElementById('signupName').value.trim();
      const terms1 = document.getElementById('terms1').checked;
      const terms2 = document.getElementById('terms2').checked;

      if (!name) return alert('이름을 입력해주세요.');
      if (!REGEX.email.test(email)) return alert('올바른 이메일 형식을 입력해주세요.');
      if (!REGEX.password.test(pw)) return alert('비밀번호는 영문, 숫자, 특수문자를 포함한 8자 이상이어야 합니다.');
      if (pw !== pwConfirm) return alert('비밀번호가 일치하지 않습니다.');
      if (!terms1 || !terms2) return alert('필수 약관에 동의해주세요.');

      if (window.API?.users) {
        // 기존 동일 이메일 있는지 체크
        const usersRes = await window.API.users.getAll();
        if (usersRes.success) {
          const exists = usersRes.data.find(u => u.email === email);
          if (exists) return alert('이미 가입된 이메일입니다.');
        }

        const newUser = {
          email,
          password: pw,
          name,
          role: 'USER',
          grade: 'BASIC',
          is_admin: false
        };

        const res = await window.API.users.create(newUser);
        if (res.success) {
          // 실시간 로그인 동기화
          localStorage.setItem('varo_user', JSON.stringify(res.data));
          window.dispatchEvent(new CustomEvent('varo:dataChange', { detail: { type: 'auth', data: res.data } }));
          alert('가입이 완료되었습니다!');
          location.replace('./index.html');
        } else {
          alert('회원가입 실패: ' + (res.error || '다시 시도해주세요.'));
        }
      }
    });
  };

  return { init };
})();

if (typeof window !== 'undefined') {
  window.Auth = Auth;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', Auth.init);
  else Auth.init();
}
