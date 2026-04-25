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
    const rememberToggle = document.getElementById('loginRemember');

    if (rememberToggle) {
      // 1. 초기 복원 시 애니메이션(잔상) 방지를 위해 클래스 추가
      const container = rememberToggle.closest('.toggle-switch');
      if (container) container.classList.add('no-transition');

      rememberToggle.checked = rememberMe;

      // 2. 상태 설정 후 애니메이션을 다시 활성화 (다음 틱에서 제거)
      setTimeout(() => {
        if (container) container.classList.remove('no-transition');
      }, 50);

      // 토글 클릭 즉시 상태 저장 (제출 전에도 유지되도록)
      rememberToggle.addEventListener('change', (e) => {
        localStorage.setItem('varo_remember_me', e.target.checked ? 'true' : 'false');
      });
    }

    if (rememberMe && emailInput) {
      emailInput.value = localStorage.getItem('varo_remembered_email') || '';
    }
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
          const isRemembered = document.getElementById('loginRemember')?.checked;
          localStorage.setItem('varo_remember_me', isRemembered ? 'true' : 'false');
          if (isRemembered) {
            localStorage.setItem('varo_remembered_email', email);
          } else {
            localStorage.removeItem('varo_remembered_email');
          }

          // [비회원 데이터 병합 이식]
          if (window.GuestManager) {
            try {
              await window.GuestManager.mergeAfterLogin(res.token);
            } catch (mergeErr) {
              console.error('[Auth] Guest data merge failed:', mergeErr);
            }
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

      // 약관 상세 보기 이벤트 바인딩
      document.querySelectorAll('.terms-detail').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const type = btn.dataset.term;
          openTermsModal(type);
        });
      });
    }

    const openTermsModal = (type) => {
      const modal = document.getElementById('termsModal');
      const title = modal?.querySelector('.varo-modal__title');
      const body = document.getElementById('termsModalBody');
      const closeBtn = modal?.querySelector('.varo-modal__close');
      const overlay = modal?.querySelector('.varo-modal__overlay');

      if (!modal || !body) return;

      const content = {
        service: {
          title: '이용 약관',
          text: `[제1장 총칙]
제1조(목적)
이 약관은 VARO(이하 "회사"라 함)가 운영하는 VARO 쇼핑몰(이하 "몰"이라 함)에서 제공하는 인터넷 관련 서비스(이하 "서비스"라 함)를 이용함에 있어 몰과 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.

제2조(정의)
1. "몰"이란 회사가 재화 또는 용역을 이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 재화 등을 거래할 수 있도록 설정한 가상의 영업장을 말하며, 아울러 사이버몰을 운영하는 사업자의 의미로도 사용합니다.
2. "이용자"란 "몰"에 접속하여 이 약관에 따라 "몰"이 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
3. "회원"이라 함은 "몰"에 개인정보를 제공하여 회원등록을 한 자로서, "몰"의 정보를 지속적으로 제공받으며, "몰"이 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.

[제2장 서비스 이용계약]
제3조(약관의 명시와 개정)
1. "몰"은 이 약관의 내용과 상호, 영업소 소재지 주소, 대표자의 성명, 사업자등록번호, 연락처 등을 이용자가 알 수 있도록 사이트의 초기 서비스화면(전면)에 게시합니다.
2. "몰"은 약관의 규제에 관한 법률, 전자거래기본법, 전자서명법, 정보통신망 이용촉진 등에 관한 법률, 방문판매 등에 관한 법률, 소비자보호법 등 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.`
        },
        privacy: {
          title: '개인정보처리방침',
          text: `VARO(이하 "회사")는 고객님의 개인정보를 소중하게 생각하며, "정보통신망 이용촉진 및 정보보호"에 관한 법률을 준수하고 있습니다.

1. 수집하는 개인정보 항목
회사는 회원가입, 상담, 서비스 신청 등등을 위해 아래와 같은 개인정보를 수집하고 있습니다.
- 수집항목 : 이름, 로그인ID, 비밀번호, 자택 전화번호, 자택 주소, 휴대전화번호, 이메일, 쿠키, 결제기록
- 개인정보 수집방법 : 홈페이지(회원가입)

2. 개인정보의 수집 및 이용목적
회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.
- 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산: 콘텐츠 제공, 구매 및 요금 결제, 물품배송 또는 청구지 등 발송
- 회원 관리: 회원제 서비스 이용에 따른 본인확인, 개인 식별, 불량회원의 부정 이용 방지와 비인가 사용 방지, 가입 의사 확인, 불만처리 등 민원처리, 고지사항 전달

3. 개인정보의 보유 및 이용기간
원칙적으로, 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.
- 보존 항목 : 결제 기록, 서비스 이용 기록
- 보존 근거 : 전자상거래 등에서의 소비자보호에 관한 법률
- 보존 기간 : 5년`
        }
      };

      const data = content[type] || content.service;
      if (title) title.textContent = data.title;
      body.innerHTML = `<div style="white-space: pre-wrap; line-height: 1.6; color: #555; font-size: 13px; max-height: 400px; overflow-y: auto; padding-right: 10px;">${data.text}</div>`;

      modal.classList.add('is-active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      const close = () => {
        modal.classList.remove('is-active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      };

      closeBtn?.addEventListener('click', close, { once: true });
      overlay?.addEventListener('click', close, { once: true });
    };

    // 소셜 로그인 버튼 시뮬레이션 (하이브리드 모드)
    document.querySelectorAll('.social-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const provider = btn.classList.contains('social-btn--kakao') ? '카카오' :
          btn.classList.contains('social-btn--naver') ? '네이버' : '구글';

        // 하이브리드 연동 알림 (데모용)
        const toast = document.createElement('div');
        toast.className = 'toast toast--info is-visible';
        toast.style.cssText = 'position:fixed; bottom:20px; left:50%; transform:translateX(-50%); z-index:9999; background:#333; color:#fff; padding:12px 24px; border-radius:8px; font-size:14px; box-shadow:0 4px 12px rgba(0,0,0,0.2);';
        toast.innerHTML = `<span>[Hybrid API] ${provider} 계정 연동을 시작합니다...</span>`;
        document.body.appendChild(toast);

        setTimeout(() => {
          toast.classList.remove('is-visible');
          setTimeout(() => toast.remove(), 500);
        }, 2000);

        console.log(`[Hybrid API] ${provider} OAuth flow initiated.`);
      });
    });

    // 주소 검색 (하이브리드 API 연동)
    const addrSearchBtn = document.getElementById('signupAddrSearch');
    if (addrSearchBtn) {
      addrSearchBtn.addEventListener('click', () => {
        if (typeof daum === 'undefined') return alert('주소 서비스를 로드할 수 없습니다.');
        new daum.Postcode({
          oncomplete: (data) => {
            document.getElementById('signupZipcode').value = data.zonecode;
            document.getElementById('signupAddress').value = data.roadAddress || data.jibunAddress;
            document.getElementById('signupAddressDetail').focus();
          }
        }).open();
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
