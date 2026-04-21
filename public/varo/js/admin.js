// 경로: js/admin.js — VARO 관리자 대시보드
'use strict';

const Admin = (() => {
  let editingId = null;

  const fmt = n => (n || 0).toLocaleString('ko-KR') + '원';

  const statusLabel = { pending: '결제대기', preparing: '준비중', shipped: '배송중', delivered: '배송완료', cancelled: '취소' };
  const gradeLabel = { basic: 'BASIC', silver: 'SILVER', gold: 'GOLD', vip: 'VIP' };

  /* ── 테마 관리 (다크 모드) ───────────────────── */
  const initTheme = () => {
    const toggle = document.getElementById('admThemeToggle');
    if (!toggle) return;

    // 초기 로드 시 저장된 테마 적용
    if (localStorage.getItem('varo_adm_theme') === 'dark') {
      document.body.classList.add('dark-mode');
    }

    toggle.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-mode');
      localStorage.setItem('varo_adm_theme', isDark ? 'dark' : 'light');
    });
  };

  /* ── 실시간 데이터 폴링 (1분 주기) ─────────────── */
  const initPolling = () => {
    setInterval(() => {
      // 사용자가 탭을 보고 있을 때만 갱신
      if (!document.hidden && document.getElementById('tab-dashboard').classList.contains('is-active')) {
        loadDashboard();
      }
    }, 60000);
  };

  /* ── 탭 전환 ────────────────────────────── */
  const initTabs = () => {
    document.querySelectorAll('.adm-nav__tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        document.querySelectorAll('.adm-nav__tab').forEach(b => b.classList.remove('is-active'));
        document.querySelectorAll('.adm-panel').forEach(p => p.classList.remove('is-active'));
        btn.classList.add('is-active');

        const targetPanel = document.getElementById(`tab-${tab}`);
        if (targetPanel) {
          targetPanel.classList.add('is-active');
          const titleMap = {
            dashboard: '대시보드',
            products: '상품 관리',
            orders: '주문 관리',
            users: '회원 관리',
            claims: '클레임 관리',
            qna: 'CS 관리'
          };
          document.getElementById('admPageTitle').textContent = titleMap[tab] || '관리';
        }

        refreshCurrentTab();
      });
    });
  };

  const refreshCurrentTab = () => {
    const activeTab = document.querySelector('.adm-nav__tab.is-active')?.dataset.tab;
    if (activeTab === 'dashboard') loadDashboard();
    if (activeTab === 'orders') loadOrders();
    if (activeTab === 'products') loadProducts();
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'claims') loadClaims();
    if (activeTab === 'qna') loadQna();
  };

  /* ── 실시간 검색 (Search) ────────────────── */
  const initSearch = () => {
    const attachSearch = (inputId, listType) => {
      const input = document.getElementById(inputId);
      if (!input) return;
      input.addEventListener('input', Utils.debounce((e) => {
        const val = e.target.value.toLowerCase().trim();
        if (listType === 'products') {
          const filtered = allProducts.filter(p => p.name.toLowerCase().includes(val) || (p.categoryId || p.category_id).toLowerCase().includes(val));
          renderProductTable(filtered);
        }
        if (listType === 'orders') {
          const filtered = allOrders.filter(o => o.order_number.toLowerCase().includes(val) || o.recipient_name.toLowerCase().includes(val));
          renderOrderTable(filtered);
        }
        if (listType === 'users') {
          const filtered = allUsers.filter(u => u.name.toLowerCase().includes(val) || u.email.toLowerCase().includes(val));
          renderUserTable(filtered);
        }
      }, 300));
    };

    attachSearch('productSearch', 'products');
    attachSearch('orderSearch', 'orders');
    attachSearch('userSearch', 'users');
  };

  /* ── 대시보드 ───────────────────────────── */
  const MOCK = {
    products: Array(12).fill().map((_, i) => ({
      id: i + 1, name: `VARO 프리미엄 스타일 ${i + 1}`, price: 45000 + (i * 5000), category_id: i % 2 === 0 ? 'top' : 'outer',
      main_img: `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200`,
      stock: i % 3 === 0 ? 0 : 15, status: i % 3 === 0 ? 'soldout' : 'active', badge: i % 4 === 0 ? 'new' : null
    })),
    orders: Array(8).fill().map((_, i) => ({
      id: i + 1, order_number: `ORD-2026-${1000 + i}`, recipient_name: `사용자${i + 1}`, total: 89000 + (i * 1000),
      status: ['pending', 'preparing', 'shipped', 'delivered'][i % 4], created_at: '2026-04-21'
    })),
    users: Array(5).fill().map((_, i) => ({
      id: i + 1, name: `회원${i + 1}`, email: `user${i + 1}@example.com`, grade: i === 0 ? 'VIP' : 'GOLD',
      role: i === 0 ? 'ADMIN' : 'USER', points: 5000 * i, total_spent: 250000 * i, created_at: '2026-04-21'
    })),
    claims: [
      { id: 1, type: 'cancel', order_number: 'ORD-2026-1001', user_name: '김바로', reason: '단순변심', status: 'pending', created_at: '2026-04-21' }
    ],
    qna: [
      { id: 1, category: '상품', title: '재입고 문의', user_name: '이관리', content: '언제 들어오나요?', is_answered: false, created_at: '2026-04-21' }
    ]
  };

  let allProducts = [], allOrders = [], allUsers = [], allClaims = [], allQna = [];

  const loadDashboard = async () => {
    try {
      const [products, orders, users] = await Promise.all([
        API.products.getAll({ limit: 999 }).catch(() => MOCK.products),
        API.orders.getAll().catch(() => MOCK.orders),
        API.users.getAll().catch(() => MOCK.users),
      ]);
      allOrders = orders;
      allProducts = products;
      allUsers = users;

      // 로컬 스토리지에 유저 데이터가 없으면 MOCK으로 초기화 (권한 관리 모달용)
      if (!Utils.storage.get('varo_users')) {
        Utils.storage.set('varo_users', allUsers);
      }

      const revenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0);
      document.getElementById('statProducts').textContent = products.length;
      document.getElementById('statOrders').textContent = orders.length;
      document.getElementById('statUsers').textContent = users.length;
      document.getElementById('statRevenue').textContent = fmt(revenue);

      // 저재고 알림 (재고 5개 미만)
      const lowStock = products.filter(p => p.stock !== null && p.stock < 5);
      renderLowStock(lowStock);

      const alertBadge = document.getElementById('stockAlert');
      if (alertBadge) {
        alertBadge.hidden = lowStock.length === 0;
        alertBadge.textContent = `저재고 ${lowStock.length}건`;
      }

      // 최근 주문 5개
      const tbody = document.getElementById('recentOrdersTbody');
      if (tbody) {
        const recent = orders.slice(0, 5);
        tbody.innerHTML = recent.length ? recent.map(o => `
          <tr>
            <td><code style="font-size:11px">${o.order_number}</code></td>
            <td>${o.recipient_name}</td>
            <td>${fmt(o.total)}</td>
            <td><span class="adm-status ${o.status}">${statusLabel[o.status] || o.status}</span></td>
            <td style="color:var(--adm-text-soft);font-size:11px">${o.created_at?.slice(0, 10) || ''}</td>
          </tr>
        `).join('') : '<tr><td colspan="5" class="adm-empty">주문 없음</td></tr>';
      }
    } catch (e) {
      console.error('[Admin] 대시보드 로드 실패:', e);
    }
  };

  const renderLowStock = (list) => {
    const container = document.getElementById('lowStockList');
    if (!container) return;
    container.innerHTML = list.length ? list.map(p => `
      <div class="adm-simple-item">
        <img src="${p.mainImg || p.main_img}" alt="">
        <div class="adm-simple-info">
          <p class="name">${p.name}</p>
          <p class="stock">현재재고: <strong>${p.stock}</strong></p>
        </div>
        <button class="adm-btn adm-btn--sm" onclick="Admin.openProductModal(${p.id})">재고채우기</button>
      </div>
    `).join('') : '<p class="adm-empty">품절 임박 상품이 없습니다.</p>';
  };

  /* ── 상품 목록 ──────────────────────────── */
  const loadProducts = async () => {
    const tbody = document.getElementById('productsTbody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="8" class="adm-empty">로딩 중...</td></tr>';
    try {
      const list = await API.products.getAll({ limit: 999 }).catch(() => MOCK.products);
      allProducts = list;
      renderProductTable(list);
    } catch (e) {
      tbody.innerHTML = '<tr><td colspan="8" class="adm-empty">불러오기 실패</td></tr>';
    }
  };

  const renderProductTable = (list) => {
    const tbody = document.getElementById('productsTbody');
    if (!tbody) return;
    tbody.innerHTML = list.map(p => `
      <tr class="${p.status === 'private' ? 'is-private' : ''}">
        <td style="color:var(--adm-text-soft);font-size:11px">${p.product_code || p.id}</td>
        <td><img src="${p.mainImg || p.main_img}" alt="${p.name}" loading="lazy"></td>
        <td style="font-weight:600">${p.name}</td>
        <td><span style="font-size:11px;background:var(--adm-bg-soft);padding:3px 8px;border-radius:4px;color:var(--adm-text-soft)">${p.categoryId || p.category_id}</span></td>
        <td>${p.salePrice || p.sale_price ? `<span style="color:var(--adm-accent);font-weight:700">${fmt(p.salePrice || p.sale_price)}</span> <br><span style="text-decoration:line-through;color:var(--adm-text-soft);font-size:11px">${fmt(p.price)}</span>` : `<span style="font-weight:600">${fmt(p.price)}</span>`}</td>
        <td>${p.badge ? `<span style="background:var(--adm-highlight);color:#fff;font-size:10px;padding:3px 8px;font-weight:800;border-radius:3px">${p.badge.toUpperCase()}</span>` : '-'}</td>
        <td><span class="adm-status ${p.status || (p.stock > 0 ? 'active' : 'soldout')}">${statusLabel[p.status] || (p.stock > 0 ? '판매중' : '품절')} (${p.stock ?? 0})</span></td>
        <td>
          <button class="adm-btn adm-btn--sm" data-action="edit" data-id="${p.id}">관리</button>
          <button class="adm-btn adm-btn--sm adm-btn--danger" data-action="delete" data-id="${p.id}" style="margin-left:4px">삭제</button>
        </td>
      </tr>
    `).join('') || '<tr><td colspan="8" class="adm-empty">상품 없음</td></tr>';

    tbody.onclick = async (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const id = parseInt(btn.dataset.id);
      if (btn.dataset.action === 'edit') openProductModal(id);
      if (btn.dataset.action === 'delete') {
        if (!confirm('상품을 삭제(비활성화)하시겠습니까?')) return;
        await API.products.delete(id);
        loadProducts();
      }
    };
  };

  /* ── 주문 목록 ──────────────────────────── */
  const loadOrders = async () => {
    const tbody = document.getElementById('ordersTbody');
    if (!tbody) return;
    try {
      const list = await API.orders.getAll().catch(() => MOCK.orders);
      allOrders = list;
      renderOrderTable(list);
    } catch { tbody.innerHTML = '<tr><td colspan="8" class="adm-empty">불러오기 실패</td></tr>'; }

    // 필터
    document.querySelectorAll('.adm-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.adm-filter-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const s = btn.dataset.status;
        renderOrderTable(s === 'all' ? allOrders : allOrders.filter(o => o.status === s));
      });
    });
  };

  const renderOrderTable = (list) => {
    const tbody = document.getElementById('ordersTbody');
    if (!tbody) return;
    tbody.innerHTML = list.map(o => {
      const items = Array.isArray(o.items) ? o.items : [];
      const itemStr = items.map(i => `${i.name}(${i.size}×${i.qty})`).join(', ');
      return `
        <tr>
          <td><code style="font-size:11px">${o.order_number}</code></td>
          <td>${o.recipient_name}</td>
          <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;color:#555" title="${itemStr}">${itemStr}</td>
          <td style="font-weight:700">${fmt(o.total)}</td>
          <td style="font-size:11px">${o.payment_method}</td>
          <td><span class="adm-status ${o.status}">${statusLabel[o.status] || o.status}</span></td>
          <td style="color:#888;font-size:11px">${o.created_at?.slice(0, 10) || ''}</td>
          <td>
            <select class="adm-btn adm-btn--sm" data-order-id="${o.id}" style="padding:4px 8px">
              ${['pending', 'preparing', 'shipped', 'delivered', 'cancelled'].map(s =>
        `<option value="${s}"${o.status === s ? ' selected' : ''}>${statusLabel[s]}</option>`
      ).join('')}
            </select>
          </td>
        </tr>
      `;
    }).join('') || '<tr><td colspan="8" class="adm-empty">주문 없음</td></tr>';

    tbody.onchange = async (e) => {
      const sel = e.target.closest('select[data-order-id]');
      if (!sel) return;
      await API.orders.updateStatus(sel.dataset.orderId, sel.value);
    };
  };

  /* ── 회원 목록 ──────────────────────────── */
  const loadUsers = async () => {
    const tbody = document.getElementById('usersTbody');
    if (!tbody) return;
    try {
      const users = await API.users.getAll().catch(() => MOCK.users);
      allUsers = users;
      renderUserTable(users);
    } catch { tbody.innerHTML = '<tr><td colspan="8" class="adm-empty">불러오기 실패</td></tr>'; }
  };

  const renderUserTable = (list) => {
    const tbody = document.getElementById('usersTbody');
    if (!tbody) return;
    tbody.innerHTML = list.map(u => `
      <tr>
        <td style="color:var(--adm-text-soft);font-size:11px">#${u.id}</td>
        <td style="font-weight:600">${u.name}</td>
        <td style="color:var(--adm-text-soft)">${u.email}</td>
        <td><span class="adm-grade-badge ${u.grade?.toLowerCase()}">${u.grade || 'BRONZE'}</span></td>
        <td><strong style="color:var(--adm-accent)">${(u.points || 0).toLocaleString()}</strong> P</td>
        <td>${fmt(u.total_spent)}</td>
        <td style="color:var(--adm-text-soft);font-size:11px">${u.created_at?.slice(0, 10) || '2024-04-21'}</td>
        <td><button class="adm-btn adm-btn--sm" onclick="Admin.openUserModal('${u.email}')">권한/등급 관리</button></td>
      </tr>
    `).join('') || '<tr><td colspan="8" class="adm-empty">회원 없음</td></tr>';
  };

  /* ── 회원 정보 수정 모달 ────────────────── */
  const openUserModal = (email) => {
    const modal = document.getElementById('userModal');
    const users = Utils.storage.get('varo_users') || [];
    const u = users.find(x => x.email === email);
    if (!u || !modal) return;

    document.getElementById('mName').value = u.name;
    document.getElementById('mEmail').value = u.email;
    document.getElementById('mGrade').value = u.grade || 'BRONZE';
    document.getElementById('mRole').value = u.role || 'USER';
    document.getElementById('mPoints').value = u.points || 0;

    modal.classList.add('is-active');
  };

  const closeUserModal = () => {
    const modal = document.getElementById('userModal');
    if (modal) modal.classList.remove('is-active');
  };

  const saveUserChanges = async () => {
    const email = document.getElementById('mEmail').value;
    const grade = document.getElementById('mGrade').value;
    const role = document.getElementById('mRole').value;
    const points = parseInt(document.getElementById('mPoints').value) || 0;

    try {
      const users = Utils.storage.get('varo_users') || [];
      const idx = users.findIndex(u => u.email === email);
      if (idx > -1) {
        users[idx].grade = grade;
        users[idx].role = role;
        users[idx].points = points;
        users[idx].is_admin = (role === 'ADMIN');
        Utils.storage.set('varo_users', users);

        const curr = Utils.storage.get('varo_user');
        if (curr && curr.email === email) {
          const { password: _, ...rest } = users[idx];
          Utils.storage.set('varo_user', rest);
        }

        Utils.showToast('회원 정보가 성공적으로 변경되었습니다.', 'success');
        closeUserModal();
        loadUsers();
        loadDashboard(); // 통계 동기화
      }
    } catch (e) {
      alert('변경 실패: ' + e.message);
    }
  };

  /* ── 상품 등록/수정 모달 ────────────────── */
  const openProductModal = async (id = null) => {
    const modal = document.getElementById('productModal');
    if (!modal) return;
    editingId = id;
    document.getElementById('productModalTitle').textContent = id ? '상품 수정' : '상품 등록';

    document.querySelectorAll('.adm-checkbox-group input').forEach(cb => cb.checked = false);

    if (id) {
      const p = allProducts.find(x => x.id === id);
      if (p) {
        document.getElementById('pStatus').value = p.status || 'active';
        document.getElementById('pPrice').value = p.price || '';
        document.getElementById('pSalePrice').value = p.salePrice || p.sale_price || '';
        document.getElementById('pBadge').value = p.badge || '';
        document.getElementById('pMainImg').value = p.mainImg || p.main_img || '';
        document.getElementById('pSubImg').value = p.subImg || p.sub_img || '';
        document.getElementById('pDesc').value = p.description || '';
        document.getElementById('pMaterial').value = p.material || '';
        document.getElementById('pCare').value = p.care || '';
        document.getElementById('pIsEvent').checked = !!(p.isEvent || p.is_event);
        const styles = Array.isArray(p.styles) ? p.styles : JSON.parse(p.styles || '[]');
        document.querySelectorAll('.adm-checkbox-group input').forEach(cb => {
          if (styles.includes(cb.value)) cb.checked = true;
        });
      }
    } else {
      ['pName', 'pPrice', 'pSalePrice', 'pMainImg', 'pSubImg', 'pDesc', 'pMaterial', 'pCare'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      document.getElementById('pStatus').value = 'active';
      const badgeEl = document.getElementById('pBadge');
      if (badgeEl) badgeEl.value = '';
      const eventEl = document.getElementById('pIsEvent');
      if (eventEl) eventEl.checked = false;
    }
    modal.classList.add('is-active');
  };

  const closeProductModal = () => {
    const modal = document.getElementById('productModal');
    if (modal) modal.classList.remove('is-active');
    editingId = null;
  };

  const saveProduct = async () => {
    const styles = [];
    document.querySelectorAll('.adm-checkbox-group input:checked').forEach(cb => styles.push(cb.value));

    const data = {
      name: document.getElementById('pName').value.trim(),
      category_id: document.getElementById('pCategory').value,
      price: parseInt(document.getElementById('pPrice').value) || 0,
      sale_price: parseInt(document.getElementById('pSalePrice').value) || null,
      status: document.getElementById('pStatus').value,
      badge: document.getElementById('pBadge').value || null,
      main_img: document.getElementById('pMainImg').value.trim(),
      sub_img: document.getElementById('pSubImg').value.trim() || document.getElementById('pMainImg').value.trim(),
      description: document.getElementById('pDesc').value.trim(),
      material: document.getElementById('pMaterial').value.trim(),
      care: document.getElementById('pCare').value.trim(),
      is_event: document.getElementById('pIsEvent').checked,
      styles,
    };

    if (!data.name || !data.price || !data.main_img) {
      alert('상품명, 가격, 이미지 URL은 필수입니다.'); return;
    }

    try {
      if (editingId) await API.products.update(editingId, data);
      else await API.products.create(data);
      closeProductModal();
      loadProducts();
      loadDashboard(); // 데이터 변경 시 대시보드 강제 갱신
      Utils.showToast(editingId ? '상품 정보가 수정되었습니다.' : '신규 상품이 등록되었습니다.', 'success');
    } catch (e) {
      alert('저장 실패: ' + e.message);
    }
  };

  /* ── 클레임 관리 ────────────────────────── */
  const loadClaims = async () => {
    const tbody = document.getElementById('claimsTbody');
    if (!tbody) return;
    try {
      const orders = await API.orders.getAll().catch(() => MOCK.orders);
      // 예시 클레임 데이터 생성 (취소/반품/교환 요청 건만 필터링)
      const claims = orders.filter(o => ['cancelled', 'return_requested', 'exchange_requested'].includes(o.status));
      const list = claims.length ? claims : MOCK.claims; // MOCK 폴백
      allClaims = list;
      tbody.innerHTML = list.map(c => `
        <tr>
          <td><code>${c.order_number}</code></td>
          <td><span class="adm-status ${c.status || c.type}">${statusLabel[c.status] || (c.type === 'cancel' ? '취소환불' : '반품요청')}</span></td>
          <td>${c.recipient_name || c.user_name}</td>
          <td style="font-size:11px;color:var(--adm-text-soft)">${c.reason || '단순 변심'}</td>
          <td style="font-weight:700">${fmt(c.total)}</td>
          <td><span class="adm-status ${c.status}">${statusLabel[c.status] || c.status}</span></td>
          <td>
            <button class="adm-btn adm-btn--sm" onclick="Admin.approveClaim(${c.id}, '${c.status}')">승인처리</button>
          </td>
        </tr>
      `).join('') || '<tr><td colspan="7" class="adm-empty">클레임 내역이 없습니다.</td></tr>';
    } catch { tbody.innerHTML = '<tr><td colspan="7" class="adm-empty">불러오기 실패</td></tr>'; }
  };

  const approveClaim = async (id, currentStatus) => {
    let nextStatus = 'cancelled';
    if (currentStatus === 'return_requested') nextStatus = 'returned';
    if (currentStatus === 'exchange_requested') nextStatus = 'exchanged';

    if (confirm(`클레임을 승인하시겠습니까? (상태: ${nextStatus})`)) {
      await API.orders.updateStatus(id, nextStatus);
      loadClaims();
      Utils.showToast('클레임이 승인되었습니다.', 'success');
    }
  };

  /* ── CS 관리 (Q&A 답변) ───────────────────── */
  const loadQna = async () => {
    const container = document.getElementById('qnaList');
    if (!container) return;
    try {
      const list = Utils.storage.get('varo_inquiries') || MOCK.qna;
      allQna = list;
      container.innerHTML = list.length ? list.map(q => `
        <div class="adm-qna-card ${q.is_answered || q.status === '답변완료' ? 'is-replied' : ''}">
          <div class="qna-header">
            <span class="user">${q.userName || q.user_name}</span>
            <span class="date">${q.date || q.created_at?.slice(0, 10)}</span>
            <span class="status">${q.status || (q.is_answered ? '답변완료' : '답변대기')}</span>
          </div>
          <div class="qna-body">
            <p class="title">${Utils.escapeHTML(q.title)}</p>
            <p class="content">${Utils.escapeHTML(q.content)}</p>
          </div>
          <div class="qna-reply">
            <textarea placeholder="운영자 답변을 작성하세요..." id="reply_${q.id}">${q.reply || ''}</textarea>
            <button class="adm-btn adm-btn--primary" onclick="Admin.saveReply(${q.id})">답변 등록</button>
          </div>
        </div>
      `).join('') : '<p class="adm-empty">문의 내역이 없습니다.</p>';
    } catch { container.innerHTML = '<p class="adm-empty">불러오기 실패</p>'; }
  };

  const saveReply = (id) => {
    const replyText = document.getElementById(`reply_${id}`).value;
    if (!replyText.trim()) { alert('답변 내용을 입력해 주세요.'); return; }

    const list = Utils.storage.get('varo_inquiries') || [];
    const idx = list.findIndex(q => q.id === id);
    if (idx !== -1) {
      list[idx].reply = replyText;
      list[idx].status = '답변완료';
      Utils.storage.set('varo_inquiries', list);
      loadQna();
      Utils.showToast('답변이 등록되었습니다.', 'success');
    }
  };

  /* ── 초기화 ─────────────────────────────── */
  const init = async () => {
    const user = JSON.parse(localStorage.getItem('varo_user') || '{}');
    const nameEl = document.getElementById('admUserName');
    if (nameEl) nameEl.textContent = user.name || '관리자';

    initTabs();
    initTheme();
    initPolling();
    initSearch();

    document.getElementById('btnAddProduct')?.addEventListener('click', () => openProductModal(null));
    document.getElementById('productModalClose')?.addEventListener('click', closeProductModal);
    document.getElementById('productModalCancel')?.addEventListener('click', closeProductModal);
    document.getElementById('productModalSave')?.addEventListener('click', saveProduct);
    document.getElementById('productModal')?.addEventListener('click', e => {
      if (e.target.id === 'productModal') closeProductModal();
    });

    document.getElementById('userModalClose')?.addEventListener('click', closeUserModal);
    document.getElementById('userModalCancel')?.addEventListener('click', closeUserModal);
    document.getElementById('userModalSave')?.addEventListener('click', saveUserChanges);
    document.getElementById('userModal')?.addEventListener('click', e => {
      if (e.target.id === 'userModal') closeUserModal();
    });

    document.getElementById('admLogout')?.addEventListener('click', () => {
      API.auth.logout();
      location.href = './login.html';
    });

    loadDashboard();
  };

  return { init, openProductModal, approveClaim, saveReply };
})();

document.addEventListener('DOMContentLoaded', Admin.init);
