/* js/api.js — Complete API & Real-time Sync Module */
'use strict';

const API = (() => {
  const BASE = '/api';
  const TOKEN_KEY = 'varo_token';

  // [ 동적 API 모드 설정 ]
  // localStorage 'varo_api_mode' 값에 따라 실시간 전환
  let FORCE_MOCK = localStorage.getItem('varo_api_mode') !== 'real';

  // 시연용 모드 전환 전역 함수
  window.toggleApiMode = () => {
    const current = localStorage.getItem('varo_api_mode') === 'real' ? 'real' : 'mock';
    const next = current === 'real' ? 'mock' : 'real';
    localStorage.setItem('varo_api_mode', next);
    FORCE_MOCK = (next === 'mock');

    const modeText = next === 'real' ? '실제 API 연동 모드' : '시연용 Mock 데이터 모드';
    if (window.Utils?.showToast) {
      window.Utils.showToast(`[시스템] ${modeText}로 전환되었습니다.`, 'info');
    } else {
      alert(`[시스템] ${modeText}로 전환되었습니다.`);
    }
    return `현재 모드: ${modeText}`;
  };

  const getToken = () => localStorage.getItem(TOKEN_KEY);
  const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
  const removeToken = () => localStorage.removeItem(TOKEN_KEY);

  // 실시간 동기화 알림 (Storage 이벤트 트리거)
  const notifyChange = (type, data) => {
    window.dispatchEvent(new CustomEvent('varo:dataChange', { detail: { type, data } }));
    localStorage.setItem('varo_last_sync_type', type);
    localStorage.setItem('varo_last_sync_time', Date.now());
  };

  const req = async (method, path, body = null, auth = false) => {
    if (typeof FORCE_MOCK !== 'undefined' && FORCE_MOCK) {
      return handleMockRequest(method, path, body);
    }
    const headers = { 'Content-Type': 'application/json' };
    if (auth) {
      const token = getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);

    try {
      const res = await fetch(BASE + path, opts);
      const isJson = res.headers.get('content-type')?.includes('application/json');
      if (isJson) {
        const data = await res.json();
        if (!res.ok) {
          console.warn(`[API] Request Failed (${res.status}):`, path, data);
          return { success: false, ...data, status: res.status };
        }
        return { success: true, ...data };
      }
      if (!res.ok) console.warn(`[API] Non-JSON Error (${res.status}):`, path);
      return { success: res.ok, status: res.status };
    } catch (err) {
      if (!FORCE_MOCK && err.name === 'TypeError') { // 네트워크 에러 등만 Mock 전환
        return handleMockRequest(method, path, body);
      }
      return { success: false, message: err.message };
    }
  };

  const handleMockRequest = (method, path, body) => {
    const segments = path.split('/').filter(Boolean);
    const entity = segments[0]; // products, orders, users, banners, categories
    const id = segments[1];
    const storageKey = `varo_${entity}`;

    // 초기 데이터 로딩: 내장 데이터(VARO_DATA)와 LocalStorage 병합
    let items = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (items === null) {
      if (entity === 'categories' && typeof VARO_DATA !== 'undefined') items = VARO_DATA.CATEGORIES;
      else if (entity === 'banners' && typeof VARO_DATA !== 'undefined') {
        items = VARO_DATA.HERO_SLIDES.map(s => ({
          id: s.id,
          title: `메인 배너 - ${s.id}`,
          img_url: s.panels && s.panels.length > 0 ? s.panels[0] : '',
          link_url: '/varo/shop.html',
          sort_order: 0,
          is_active: true
        }));
      }
      else items = [];
      localStorage.setItem(storageKey, JSON.stringify(items));
    }

    // Auth Mock (가장 먼저 처리하여 하단 POST 블록과 충돌 방지)
    if (path.includes('/auth/login')) {
      const users = JSON.parse(localStorage.getItem('varo_users') || '[]');
      const user = users.find(u => u.email === body.email && u.password === body.password);
      if (user) return { success: true, user, token: 'mock-token' };
      // Default Admin
      if (body?.email === 'admin@varo.com' && body?.password === '1234') {
        return { success: true, user: { name: '관리자님', email: 'admin@varo.com', role: 'ADMIN', grade: 'ADMIN', is_admin: true }, token: 'mock-token' };
      }
      return { success: false, error: '인증 실패' };
    }

    // [NEW] 회원가입 Mock 처리
    if (path.includes('/auth/signup') || (entity === 'users' && method === 'POST')) {
      const users = JSON.parse(localStorage.getItem('varo_users') || '[]');
      if (body.email && users.some(u => u.email === body.email)) {
        return { success: false, error: '이미 존재하는 이메일입니다.' };
      }
      const newUser = {
        id: Date.now(),
        ...body,
        role: 'USER',
        grade: 'bronze',
        points: 1000,
        created_at: new Date().toISOString()
      };
      users.push(newUser);
      localStorage.setItem('varo_users', JSON.stringify(users));
      return { success: true, data: newUser, user: newUser };
    }

    if (method === 'GET') {
      if (id) {
        const item = items.find(x => x.id == id);
        return item ? { success: true, data: item } : { success: false, error: 'Not Found' };
      }
      return { success: true, data: items, products: items, orders: items, users: items, banners: items, categories: items };
    }

    if (method === 'POST') {
      const newItem = { id: Date.now(), ...body, created_at: new Date().toISOString() };
      items.push(newItem);
      localStorage.setItem(storageKey, JSON.stringify(items));
      notifyChange(entity, newItem);
      return { success: true, data: newItem };
    }

    if (method === 'PUT') {
      const idx = items.findIndex(x => x.id == id);
      if (idx > -1) {
        items[idx] = { ...items[idx], ...body, updated_at: new Date().toISOString() };
        localStorage.setItem(storageKey, JSON.stringify(items));
        notifyChange(entity, items[idx]);
        return { success: true, data: items[idx] };
      }
    }

    if (method === 'DELETE') {
      const filtered = items.filter(x => x.id != id);
      localStorage.setItem(storageKey, JSON.stringify(filtered));
      notifyChange(entity, { id, deleted: true });
      return { success: true };
    }

    if (method === 'PUT' && path.includes('/reorder')) {
      const { orders } = body;
      orders.forEach(o => {
        const idx = items.findIndex(x => x.id == o.id);
        if (idx > -1) {
          items[idx].sort_order = o.sort_order;
          items[idx].parent_id = o.parent_id;
        }
      });
      localStorage.setItem(storageKey, JSON.stringify(items));
      notifyChange(entity, { reordered: true });
      return { success: true };
    }


    return { success: false, error: 'Mock handler not found' };
  };

  const createEntity = (name) => ({
    getAll: (params) => req('GET', `/${name}`, null, false),
    getById: (id) => req('GET', `/${name}/${id}`, null, false),
    create: (data) => req('POST', `/${name}`, data, true),
    update: (id, data) => req('PUT', `/${name}/${id}`, data, true),
    delete: (id) => req('DELETE', `/${name}/${id}`, null, true),
    updateStatus: (id, status) => req('PUT', `/${name}/${id}`, { status }, true)
  });

  return {
    req, // [ADD] 공통 요청 함수 노출
    auth: {
      login: async (email, password) => {
        const res = await req('POST', '/auth/login', { email, password });
        if (res.success) {
          setToken(res.token);
          localStorage.setItem('varo_user', JSON.stringify(res.user));
        }
        return res;
      },
      register: async (data) => {
        const res = await req('POST', '/auth/register', data);
        if (res.success) {
          setToken(res.token);
          localStorage.setItem('varo_user', JSON.stringify(res.user));
        }
        return res;
      },
      logout: () => {
        removeToken();
        localStorage.removeItem('varo_user');
      },
      getUser: () => JSON.parse(localStorage.getItem('varo_user') || 'null')
    },
    products: createEntity('products'),
    orders: {
      ...createEntity('orders'),
      updateStatus: (id, status) => req('PUT', `/orders/${id}/status`, { status }, true)
    },
    users: createEntity('users'),
    banners: createEntity('banners'),
    categories: createEntity('categories'),
    inquiries: createEntity('inquiries'),
    addresses: createEntity('addresses'), // [NEW] 주소록 추가
    // 하이브리드 익스텐션
    hybrid: {
      socialLogin: async (provider) => {
        console.log(`[Hybrid] ${provider} 소셜 로그인 시뮬레이션 시작...`);
        await new Promise(r => setTimeout(r, 1000));
        const res = {
          success: true,
          token: 'hybrid-social-token',
          user: { name: `소셜_${provider}`, email: `${provider}@demo.com`, grade: 'bronze', is_admin: false }
        };
        localStorage.setItem('varo_token', res.token);
        localStorage.setItem('varo_user', JSON.stringify(res.user));
        return res;
      },
      processPayment: async (data) => {
        console.log('[Hybrid] PG 결제 프로세스 시뮬레이션...', data);
        await new Promise(r => setTimeout(r, 1500));
        return { success: true, pg_tid: 'TID_' + Date.now(), message: '결제 승인 완료' };
      },
      simulatePayment: async (data) => {
        console.log('[Hybrid] PG 결제 시뮬레이션 시작...', data);
        return new Promise((resolve) => {
          const modal = document.getElementById('pgPaymentModal');
          const amountEl = document.getElementById('pg-final-amount');
          const btnConfirm = document.getElementById('btnPgConfirm');
          const spinner = document.getElementById('pgSpinner');

          if (!modal || !amountEl || !btnConfirm) {
            console.warn('[Hybrid] 결제 모달을 찾을 수 없어 자동 승인 처리합니다.');
            resolve({ success: true });
            return;
          }

          if (spinner) spinner.style.display = 'none';
          btnConfirm.disabled = false;
          amountEl.textContent = `${Number(data.amount).toLocaleString('ko-KR')}원`;

          modal.style.display = 'flex';
          modal.classList.remove('u-hidden');

          btnConfirm.onclick = () => {
            if (spinner) spinner.style.display = 'block';
            btnConfirm.disabled = true;

            setTimeout(() => {
              modal.style.display = 'none';
              modal.classList.add('u-hidden');
              resolve({ success: true });
            }, 2000);
          };

          window.closePgModal = () => {
            modal.style.display = 'none';
            modal.classList.add('u-hidden');
            resolve({ success: false });
          };
        });
      }
    }
  };
})();

if (typeof window !== 'undefined') window.API = API;
