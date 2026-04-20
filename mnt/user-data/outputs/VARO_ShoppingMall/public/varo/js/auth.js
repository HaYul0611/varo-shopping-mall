// 경로: js/auth.js — VARO 인증 (백엔드 API 연동)
'use strict';

const Auth = (() => {
  const RULES = {
    name:     { min:2, pattern:/^[가-힣a-zA-Z ]{2,30}$/,   msg:'2~30자 한글/영문만 입력하세요' },
    email:    { pattern:/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,  msg:'올바른 이메일 형식을 입력하세요' },
    password: { min:6, pattern:/^(?=.*[a-zA-Z])(?=.*\d)/, msg:'영문+숫자 포함 6자 이상 입력하세요' },
  };
  const setErr = (input, msg) => {
    const e = input.closest('.form-group')?.querySelector('.form-error');
    input.classList.add('form-input--error');
    if (e) { e.textContent = msg; e.classList.add('is-visible'); }
    return false;
  };
  const clrErr = (input) => {
    const e = input.closest('.form-group')?.querySelector('.form-error');
    input.classList.remove('form-input--error');
    if (e) e.classList.remove('is-visible');
    return true;
  };
  const vf = (input, type) => {
    const v = input.value.trim(), r = RULES[type];
    if (!r) return true;
    if (!v) return setErr(input, '필수 입력 항목입니다');
    if (r.min && v.length < r.min) return setErr(input, r.msg);
    if (r.pattern && !r.pattern.test(v)) return setErr(input, r.msg);
    return clrErr(input);
  };

  const initPwToggle = () => {
    document.querySelectorAll('.pw-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.target;
        const input = id ? document.getElementById(id) : btn.closest('.form-input-wrap')?.querySelector('input');
        if (!input) return;
        const isText = input.type === 'text';
        input.type = isText ? 'password' : 'text';
        btn.querySelector('.eye-on').style.display  = isText ? 'block' : 'none';
        btn.querySelector('.eye-off').style.display = isText ? 'none'  : 'block';
      });
    });
  };

  const initPwStrength = () => {
    const pw = document.getElementById('signupPw');
    const segs = document.querySelectorAll('.pw-strength__seg');
    const lbl  = document.getElementById('pwStrengthLabel');
    if (!pw || !segs.length) return;
    const LV = ['','매우 약함','약함','보통','강함'];
    pw.addEventListener('input', () => {
      const v = pw.value;
      let s = 0;
      if (v.length >= 8) s++;
      if (/[A-Z]/.test(v)) s++;
      if (/\d/.test(v)) s++;
      if (/[^a-zA-Z\d]/.test(v)) s++;
      segs.forEach((seg, i) => { seg.className = 'pw-strength__seg'; if (i < s) seg.classList.add(`strength-${s}`); });
      if (lbl) lbl.textContent = v ? LV[s] : '';
    });
  };

  const initTermsAll = () => {
    const all = document.getElementById('termsAll');
    const subs = ['terms1','terms2','terms3'].map(id => document.getElementById(id)).filter(Boolean);
    if (!all) return;
    all.addEventListener('change', () => subs.forEach(b => b.checked = all.checked));
    subs.forEach(b => b.addEventListener('change', () => {
      all.checked = subs.every(x => x.checked);
      all.indeterminate = !all.checked && subs.some(x => x.checked);
    }));
  };

  const initLogin = () => {
    const emailIn = document.getElementById('loginEmail');
    const pwIn    = document.getElementById('loginPassword');
    const submit  = document.getElementById('loginSubmit');
    if (!submit) return;

    document.getElementById('demoLoginBtn')?.addEventListener('click', () => {
      if (emailIn) emailIn.value = 'demo@varo.com';
      if (pwIn)    pwIn.value    = 'varo2026';
    });
    emailIn?.addEventListener('blur', () => vf(emailIn, 'email'));
    pwIn?.addEventListener('blur',    () => vf(pwIn, 'password'));

    submit.addEventListener('click', async () => {
      let ok = true;
      if (!vf(emailIn, 'email'))    ok = false;
      if (!vf(pwIn, 'password'))    ok = false;
      if (!ok) return;
      submit.disabled = true; submit.textContent = '로그인 중...';
      try {
        await API.auth.login(emailIn.value.trim(), pwIn.value);
        API.syncUI();
        Utils?.showToast('로그인 성공! 환영합니다 🎉', 'success');
        setTimeout(() => {
          const rd = new URLSearchParams(location.search).get('redirect');
          location.href = rd || './index.html';
        }, 800);
      } catch (e) {
        Utils?.showToast(e.message || '로그인 실패', 'error');
        submit.disabled = false; submit.textContent = '로그인';
      }
    });
  };

  const initSignup = () => {
    const nameIn = document.getElementById('signupName');
    const emailIn = document.getElementById('signupEmail');
    const pwIn    = document.getElementById('signupPw');
    const pwCfm   = document.getElementById('signupPwConfirm');
    const submit  = document.getElementById('signupSubmit');
    if (!submit) return;

    nameIn?.addEventListener('blur',  () => vf(nameIn, 'name'));
    emailIn?.addEventListener('blur', () => vf(emailIn, 'email'));
    pwIn?.addEventListener('blur',    () => vf(pwIn, 'password'));
    pwCfm?.addEventListener('blur',   () => {
      if (pwCfm.value !== pwIn?.value) setErr(pwCfm, '비밀번호가 일치하지 않습니다');
      else clrErr(pwCfm);
    });

    submit.addEventListener('click', async () => {
      let ok = true;
      if (!vf(nameIn, 'name'))    ok = false;
      if (!vf(emailIn, 'email'))  ok = false;
      if (!vf(pwIn, 'password'))  ok = false;
      if (pwCfm && pwCfm.value !== pwIn?.value) { setErr(pwCfm, '비밀번호가 일치하지 않습니다'); ok = false; }
      const t1 = document.getElementById('terms1'), t2 = document.getElementById('terms2');
      const tErr = document.getElementById('termsError');
      if (!t1?.checked || !t2?.checked) {
        if (tErr) { tErr.textContent = '필수 약관에 동의해 주세요'; tErr.classList.add('is-visible'); }
        ok = false;
      }
      if (!ok) return;
      submit.disabled = true; submit.textContent = '처리 중...';
      try {
        await API.auth.register({ name: nameIn.value.trim(), email: emailIn.value.trim(), password: pwIn.value, phone: document.getElementById('signupPhone')?.value || '' });
        await API.auth.login(emailIn.value.trim(), pwIn.value);
        Utils?.showToast('회원가입 완료! 환영합니다 🎉', 'success');
        setTimeout(() => location.href = './index.html', 1000);
      } catch (e) {
        Utils?.showToast(e.message || '회원가입 실패', 'error');
        submit.disabled = false; submit.textContent = '가입하기';
      }
    });
  };

  const init = () => { initPwToggle(); initPwStrength(); initTermsAll(); initLogin(); initSignup(); };
  return { init };
})();

document.addEventListener('DOMContentLoaded', Auth.init);
