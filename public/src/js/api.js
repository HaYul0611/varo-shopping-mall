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

    let items = [];
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) items = JSON.parse(stored);
    } catch (e) {
      console.error(`[MockAPI] Failed to parse ${storageKey}:`, e);
    }

    if (!Array.isArray(items) || items.length === 0) {
      if (entity === 'categories') {
        items = [
          { id: 1, parent_id: null, name: 'BEST', slug: 'best', sort_order: 1 },
          { id: 2, parent_id: null, name: 'NEW 5%', slug: 'new', sort_order: 2 },
          { id: 3, parent_id: null, name: 'COLLECTION', slug: 'collection', sort_order: 3 },
          { id: 4, parent_id: null, name: 'OUTER', slug: 'outer', sort_order: 4 },
          { id: 5, parent_id: 4, name: '자켓', slug: 'jacket', sort_order: 1 },
          { id: 6, parent_id: 4, name: '코트', slug: 'coat', sort_order: 2 },
          { id: 7, parent_id: 4, name: '패딩', slug: 'padding', sort_order: 3 },
          { id: 8, parent_id: 4, name: '점퍼', slug: 'jumper', sort_order: 4 },
          { id: 9, parent_id: 4, name: '레더/무스탕', slug: 'leather', sort_order: 5 },
          { id: 10, parent_id: null, name: 'SHIRT', slug: 'shirt', sort_order: 5 },
          { id: 17, parent_id: 10, name: '반팔셔츠', slug: 'shortshirt', sort_order: 1 },
          { id: 18, parent_id: 10, name: '긴팔셔츠', slug: 'longshirt', sort_order: 2 },
          { id: 19, parent_id: 10, name: '오버셔츠', slug: 'overshirt', sort_order: 3 },
          { id: 20, parent_id: 10, name: '데님셔츠', slug: 'denim-shirt', sort_order: 4 },
          { id: 11, parent_id: null, name: 'TOP', slug: 'top', sort_order: 6 },
          { id: 21, parent_id: 11, name: '반팔티', slug: 'shorttee', sort_order: 1 },
          { id: 22, parent_id: 11, name: '긴팔티', slug: 'longtee', sort_order: 2 },
          { id: 23, parent_id: 11, name: '맨투맨', slug: 'sweatshirt', sort_order: 3 },
          { id: 24, parent_id: 11, name: '후드티', slug: 'hoodie', sort_order: 4 },
          { id: 25, parent_id: 11, name: '민소매', slug: 'sleeveless', sort_order: 5 },
          { id: 12, parent_id: null, name: 'BOTTOM', slug: 'bottom', sort_order: 7 },
          { id: 26, parent_id: 12, name: '데님팬츠', slug: 'denim', sort_order: 1 },
          { id: 27, parent_id: 12, name: '슬랙스', slug: 'slacks', sort_order: 2 },
          { id: 28, parent_id: 12, name: '카고팬츠', slug: 'cargo', sort_order: 3 },
          { id: 29, parent_id: 12, name: '조거팬츠', slug: 'jogger', sort_order: 4 },
          { id: 30, parent_id: 12, name: '반바지', slug: 'shorts', sort_order: 5 },
          { id: 13, parent_id: null, name: 'KNIT', slug: 'knit', sort_order: 8 },
          { id: 31, parent_id: 13, name: '풀오버', slug: 'pullover', sort_order: 1 },
          { id: 32, parent_id: 13, name: '집업니트', slug: 'zipup', sort_order: 2 },
          { id: 33, parent_id: 13, name: '가디건', slug: 'cardigan', sort_order: 3 },
          { id: 34, parent_id: 13, name: '니트베스트', slug: 'vest', sort_order: 4 },
          { id: 14, parent_id: null, name: 'SHOES', slug: 'shoes', sort_order: 9 },
          { id: 35, parent_id: 14, name: '스니커즈', slug: 'sneakers', sort_order: 1 },
          { id: 36, parent_id: 14, name: '로퍼', slug: 'loafer', sort_order: 2 },
          { id: 37, parent_id: 14, name: '샌들', slug: 'sandal', sort_order: 3 },
          { id: 38, parent_id: 14, name: '부츠', slug: 'boots', sort_order: 4 },
          { id: 39, parent_id: null, name: 'ACC', slug: 'acc', sort_order: 10 },
          { id: 40, parent_id: 39, name: '가방', slug: 'bag', sort_order: 1 },
          { id: 41, parent_id: 39, name: '모자', slug: 'hat', sort_order: 2 },
          { id: 42, parent_id: 39, name: '주얼리', slug: 'jewelry', sort_order: 3 },
          { id: 43, parent_id: 39, name: '잡화', slug: 'etc', sort_order: 4 },
          { id: 15, parent_id: null, name: '1+1 EVENT', slug: 'event', sort_order: 11 },
          { id: 16, parent_id: null, name: 'COMMUNITY', slug: 'community', sort_order: 12 },
          { id: 44, parent_id: 16, name: '공지사항', slug: 'notice', sort_order: 1 },
          { id: 45, parent_id: 16, name: 'FAQ', slug: 'faq', sort_order: 2 },
          { id: 46, parent_id: 16, name: 'Q&A', slug: 'qna', sort_order: 3 },
          { id: 47, parent_id: 16, name: '리뷰', slug: 'review', sort_order: 4 },
          { id: 48, parent_id: 16, name: '이벤트', slug: 'event-sub', sort_order: 5 }
        ];
      } else if (entity === 'banners' && typeof VARO_DATA !== 'undefined') {
        items = VARO_DATA.HERO_SLIDES.map(s => ({
          id: s.id,
          title: `메인 배너 - ${s.id}`,
          img_url: s.panels && s.panels.length > 0 ? s.panels[0] : '',
          link_url: '/varo/shop.html',
          sort_order: 0,
          is_active: true
        }));
      } else if (entity === 'products' && typeof VARO_DATA !== 'undefined') {
        items = VARO_DATA.PRODUCTS || [];
      } else {
        items = [];
      }
      localStorage.setItem(storageKey, JSON.stringify(items));
    }

    if (entity === 'categories') {
      const outerCat = items.find(c => c.name.toUpperCase() === 'OUTER');
      const outerId = outerCat ? outerCat.id : 4;
      let changed = false;

      items = items.map(c => {
        if (c.name === '패딩' || c.name === '점퍼' || c.name === '레더/무스탕') {
          if (!c.parent_id || c.parent_id === 'null') {
            c.parent_id = outerId;
            changed = true;
          }
        }
        return c;
      });

      if (changed) {
        localStorage.setItem(storageKey, JSON.stringify(items));
      }
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

    if (method === 'PUT' && path.includes('/reorder')) {
      const { orders } = body;
      orders.forEach(o => {
        const idx = items.findIndex(x => x.id == o.id);
        if (idx > -1) {
          items[idx].sort_order = o.sort_order;
          if (o.parent_id !== undefined) {
            items[idx].parent_id = o.parent_id;
          }
        }
      });
      localStorage.setItem(storageKey, JSON.stringify(items));
      notifyChange(entity, { reordered: true });
      return { success: true };
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
    },
    req: req
  };
})();

if (typeof window !== 'undefined') window.API = API;
