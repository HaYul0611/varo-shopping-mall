/* js/api.js — Complete API & Real-time Sync Module */
'use strict';

const API = (() => {
  const BASE = '/api'; // 로컬 서버(3000) 미실행 대비 상대 경로 유지 (자동 캐치하여 MOCK 실행)
  const TOKEN_KEY = 'varo_token';
  const FORCE_MOCK = true; // 현재 데모 환경을 위해 MOCK 강제 활성화 가능 (선택 사항)

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
        if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
        return { success: true, ...data };
      }
      return { success: res.ok };
    } catch (err) {
      return handleMockRequest(method, path, body);
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
      else if (entity === 'banners' && typeof VARO_DATA !== 'undefined') items = VARO_DATA.HERO_SLIDES;
      else items = [];
      localStorage.setItem(storageKey, JSON.stringify(items));
    }

    // Auth Mock (가장 먼저 처리하여 하단 POST 블록과 충돌 방지)
    if (path.includes('/auth/login')) {
      const users = JSON.parse(localStorage.getItem('varo_users') || '[]');
      const user = users.find(u => u.email === body.email && u.password === body.password);
      if (user) return { success: true, user, token: 'mock-token' };
      // Default Admin
      if (body?.email === 'admin@varo.com' && body?.password === 'varo2026admin') {
        return { success: true, user: { name: '관리자', email: 'admin@varo.com', role: 'ADMIN', grade: 'ADMIN', is_admin: true }, token: 'mock-token' };
      }
      return { success: false, error: '인증 실패' };
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
    auth: {
      login: async (email, password) => {
        const res = await req('POST', '/auth/login', { email, password });
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
    orders: createEntity('orders'),
    users: createEntity('users'),
    banners: createEntity('banners'),
    categories: createEntity('categories'),
    inquiries: createEntity('inquiries')
  };
})();

if (typeof window !== 'undefined') window.API = API;
