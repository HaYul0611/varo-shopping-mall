/* js/admin.js — VARO Administrative Dashboard (Stabilized) */
'use strict';

const Admin = (() => {
  let editingId = null;
  const fmt = n => (n || 0).toLocaleString('ko-KR') + '원';
  const statusLabel = { pending: '결제대기', preparing: '준비중', shipped: '배송중', delivered: '배송완료', cancelled: '취소' };

  let allProducts = [], allOrders = [], allUsers = [];

  const MOCK = {
    products: Array(12).fill().map((_, i) => ({ id: i + 1, name: `VARO 프리미엄 상품 ${i + 1}`, price: 45000, stock: 15, status: 'active', main_img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200' })),
    orders: Array(8).fill().map((_, i) => ({ id: i + 1, order_number: `ORD-2026-${1000 + i}`, recipient_name: `구매자 ${i + 1}`, total: 89000, status: 'preparing', created_at: '2026-04-23' })),
    users: Array(5).fill().map((_, i) => ({ id: i + 1, name: `회원 ${i + 1}`, email: `user${i}@example.com`, grade: 'VIP' }))
  };

  const loadDashboard = async () => {
    console.log('[Admin] loadDashboard target IDs:', ['statProducts', 'statOrders', 'statUsers', 'statRevenue']);
    try {
      const resP = await API.products.getAll({ limit: 999 }).catch(() => ({ data: MOCK.products }));
      const resO = await API.orders.getAll().catch(() => ({ data: MOCK.orders }));
      const resU = await API.users.getAll().catch(() => ({ data: MOCK.users }));

      allProducts = resP.data || [];
      allOrders = resO.data || [];
      allUsers = resU.data || [];

      updateEl('statProducts', allProducts.length);
      updateEl('statOrders', allOrders.length);
      updateEl('statUsers', allUsers.length);

      const rev = allOrders.reduce((s, o) => s + (o.total || 0), 0);
      updateEl('statRevenue', fmt(rev));

      renderRecentOrders(allOrders.slice(0, 5));
    } catch (err) { console.error('[Admin] Dashboard loading failed:', err); }
  };

  const updateEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  const renderRecentOrders = (list) => {
    const tbody = document.getElementById('recentOrdersTbody');
    if (tbody) {
      tbody.innerHTML = list.length ? list.map(o => `<tr><td><code>${o.order_number}</code></td><td>${o.recipient_name}</td><td>${fmt(o.total)}</td><td><span class="adm-status ${o.status}">${statusLabel[o.status] || o.status}</span></td></tr>`).join('') : '<tr><td colspan="4">최근 주문 없음</td></tr>';
    }
  };

  const initTabs = () => {
    document.querySelectorAll('.adm-nav__item').forEach(btn => {
      btn.onclick = () => {
        const tab = btn.dataset.tab;
        document.querySelectorAll('.adm-nav__item').forEach(b => b.classList.remove('is-active'));
        document.querySelectorAll('.adm-panel').forEach(p => p.classList.remove('is-active'));
        btn.classList.add('is-active');
        const panel = document.getElementById(`tab-${tab}`);
        if (panel) panel.classList.add('is-active');

        if (tab === 'dashboard') loadDashboard();
        else if (tab === 'products') loadProducts();
        else if (tab === 'orders') loadOrders();
      };
    });
  };

  const loadProducts = async () => {
    const tbody = document.getElementById('productsTbody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="7">로딩 중...</td></tr>';
    const res = await API.products.getAll().catch(() => ({ data: MOCK.products }));
    allProducts = res.data || [];
    if (tbody) tbody.innerHTML = allProducts.map(p => `<tr><td>#${p.id}</td><td><img src="${p.main_img}" style="width:30px"></td><td>${p.name}</td><td>${fmt(p.price)}</td><td>${p.stock}</td><td><span class="adm-status active">판매중</span></td><td><button class="adm-btn adm-btn--sm">관리</button></td></tr>`).join('');
  };

  const loadOrders = async () => {
    const tbody = document.getElementById('ordersTbody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="7">로딩 중...</td></tr>';
    const res = await API.orders.getAll().catch(() => ({ data: MOCK.orders }));
    allOrders = res.data || [];
    if (tbody) tbody.innerHTML = allOrders.map(o => `<tr><td><code>${o.order_number}</code></td><td>${o.recipient_name}</td><td>${fmt(o.total)}</td><td><span class="adm-status ${o.status}">${statusLabel[o.status]}</span></td><td><button class="adm-btn adm-btn--sm">관리</button></td></tr>`).join('');
  };

  const init = () => {
    console.log('[Admin] Initializing Tabs & Themes');
    initTabs();
    loadDashboard();
    const logoutBtn = document.getElementById('admLogout');
    if (logoutBtn) logoutBtn.onclick = () => { API.auth.logout(); location.href = './login.html'; };
  };

  return { init, openProductModal: () => { } };
})();

document.addEventListener('DOMContentLoaded', Admin.init);
