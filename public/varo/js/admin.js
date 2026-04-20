// 경로: js/admin.js — VARO 관리자 대시보드
'use strict';

const Admin = (() => {

  let allOrders   = [];
  let allProducts = [];
  let editingId   = null;

  const fmt = n => (n || 0).toLocaleString('ko-KR') + '원';

  const statusLabel = { pending:'결제대기', preparing:'준비중', shipped:'배송중', delivered:'배송완료', cancelled:'취소' };
  const gradeLabel  = { basic:'BASIC', silver:'SILVER', gold:'GOLD', vip:'VIP' };

  /* ── 탭 전환 ────────────────────────────── */
  const initTabs = () => {
    document.querySelectorAll('.adm-nav__item').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        document.querySelectorAll('.adm-nav__item').forEach(b => b.classList.remove('is-active'));
        document.querySelectorAll('.adm-panel').forEach(p => p.classList.remove('is-active'));
        btn.classList.add('is-active');
        document.getElementById(`tab-${tab}`)?.classList.add('is-active');
        document.getElementById('admPageTitle').textContent =
          { dashboard:'대시보드', products:'상품 관리', orders:'주문 관리', users:'회원 관리' }[tab] || tab;
        if (tab === 'orders')   loadOrders();
        if (tab === 'products') loadProducts();
        if (tab === 'users')    loadUsers();
      });
    });
    // 모바일 햄버거
    document.getElementById('admHamburger')?.addEventListener('click', () => {
      document.getElementById('admSidebar')?.classList.toggle('is-open');
    });
  };

  /* ── 대시보드 ───────────────────────────── */
  const loadDashboard = async () => {
    try {
      const [products, orders, users] = await Promise.all([
        API.products.getAll({ limit: 999 }),
        API.orders.getAll(),
        API.users.getAll(),
      ]);
      allOrders   = orders;
      allProducts = products;

      const revenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0);
      document.getElementById('statProducts').textContent = products.length;
      document.getElementById('statOrders').textContent   = orders.length;
      document.getElementById('statUsers').textContent    = users.length;
      document.getElementById('statRevenue').textContent  = fmt(revenue);

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
            <td style="color:#888;font-size:11px">${o.created_at?.slice(0,10) || ''}</td>
          </tr>
        `).join('') : '<tr><td colspan="5" class="adm-empty">주문 없음</td></tr>';
      }
    } catch (e) {
      console.error('[Admin] 대시보드 로드 실패:', e);
    }
  };

  /* ── 상품 목록 ──────────────────────────── */
  const loadProducts = async () => {
    const tbody = document.getElementById('productsTbody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="8" class="adm-empty">로딩 중...</td></tr>';
    try {
      allProducts = await API.products.getAll({ limit: 999 });
      renderProductTable(allProducts);
    } catch (e) {
      tbody.innerHTML = '<tr><td colspan="8" class="adm-empty">불러오기 실패</td></tr>';
    }
  };

  const renderProductTable = (list) => {
    const tbody = document.getElementById('productsTbody');
    if (!tbody) return;
    tbody.innerHTML = list.map(p => `
      <tr>
        <td style="color:#888;font-size:11px">${p.product_code || p.id}</td>
        <td><img src="${p.mainImg || p.main_img}" alt="${p.name}" loading="lazy"></td>
        <td style="font-weight:500">${p.name}</td>
        <td><span style="font-size:11px;background:#F0F0F0;padding:2px 7px;border-radius:2px">${p.categoryId || p.category_id}</span></td>
        <td>${p.salePrice || p.sale_price ? `<span style="color:#D96B3C;font-weight:700">${fmt(p.salePrice||p.sale_price)}</span> <span style="text-decoration:line-through;color:#AAA;font-size:11px">${fmt(p.price)}</span>` : fmt(p.price)}</td>
        <td>${p.badge ? `<span style="background:#1C1A16;color:#fff;font-size:9px;padding:2px 6px;font-weight:800">${p.badge.toUpperCase()}</span>` : '-'}</td>
        <td>${p.stock ?? '-'}</td>
        <td>
          <button class="adm-btn adm-btn--sm" data-action="edit" data-id="${p.id}">수정</button>
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
      allOrders = await API.orders.getAll();
      renderOrderTable(allOrders);
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
          <td style="color:#888;font-size:11px">${o.created_at?.slice(0,10) || ''}</td>
          <td>
            <select class="adm-btn adm-btn--sm" data-order-id="${o.id}" style="padding:4px 8px">
              ${['pending','preparing','shipped','delivered','cancelled'].map(s =>
                `<option value="${s}"${o.status===s?' selected':''}>${statusLabel[s]}</option>`
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
      const users = await API.users.getAll();
      tbody.innerHTML = users.map(u => `
        <tr>
          <td style="color:#888;font-size:11px">#${u.id}</td>
          <td style="font-weight:500">${u.name}</td>
          <td style="color:#555">${u.email}</td>
          <td><span class="adm-grade-badge ${u.grade}">${gradeLabel[u.grade] || u.grade}</span></td>
          <td>${(u.points || 0).toLocaleString()}</td>
          <td>${fmt(u.total_spent)}</td>
          <td style="color:#888;font-size:11px">${u.created_at?.slice(0,10) || ''}</td>
        </tr>
      `).join('') || '<tr><td colspan="7" class="adm-empty">회원 없음</td></tr>';
    } catch { tbody.innerHTML = '<tr><td colspan="7" class="adm-empty">불러오기 실패</td></tr>'; }
  };

  /* ── 상품 등록/수정 모달 ────────────────── */
  const openProductModal = async (id = null) => {
    const modal = document.getElementById('productModal');
    if (!modal) return;
    editingId = id;
    document.getElementById('productModalTitle').textContent = id ? '상품 수정' : '상품 등록';

    // 체크박스 초기화
    document.querySelectorAll('.adm-checkbox-group input').forEach(cb => cb.checked = false);

    if (id) {
      const p = allProducts.find(x => x.id === id);
      if (p) {
        document.getElementById('pName').value      = p.name || '';
        document.getElementById('pCategory').value  = p.categoryId || p.category_id || '';
        document.getElementById('pPrice').value     = p.price || '';
        document.getElementById('pSalePrice').value = p.salePrice || p.sale_price || '';
        document.getElementById('pBadge').value     = p.badge || '';
        document.getElementById('pMainImg').value   = p.mainImg || p.main_img || '';
        document.getElementById('pSubImg').value    = p.subImg || p.sub_img || '';
        document.getElementById('pDesc').value      = p.description || '';
        document.getElementById('pMaterial').value  = p.material || '';
        document.getElementById('pCare').value      = p.care || '';
        document.getElementById('pIsEvent').checked = !!(p.isEvent || p.is_event);
        const styles = Array.isArray(p.styles) ? p.styles : JSON.parse(p.styles || '[]');
        document.querySelectorAll('.adm-checkbox-group input').forEach(cb => {
          if (styles.includes(cb.value)) cb.checked = true;
        });
      }
    } else {
      ['pName','pPrice','pSalePrice','pMainImg','pSubImg','pDesc','pMaterial','pCare'].forEach(id => {
        document.getElementById(id).value = '';
      });
      document.getElementById('pBadge').value   = '';
      document.getElementById('pIsEvent').checked = false;
    }
    modal.hidden = false;
  };

  const closeProductModal = () => {
    const modal = document.getElementById('productModal');
    if (modal) modal.hidden = true;
    editingId = null;
  };

  const saveProduct = async () => {
    const styles = [];
    document.querySelectorAll('.adm-checkbox-group input:checked').forEach(cb => styles.push(cb.value));

    const data = {
      name:        document.getElementById('pName').value.trim(),
      category_id: document.getElementById('pCategory').value,
      price:       parseInt(document.getElementById('pPrice').value) || 0,
      sale_price:  parseInt(document.getElementById('pSalePrice').value) || null,
      badge:       document.getElementById('pBadge').value || null,
      main_img:    document.getElementById('pMainImg').value.trim(),
      sub_img:     document.getElementById('pSubImg').value.trim() || document.getElementById('pMainImg').value.trim(),
      description: document.getElementById('pDesc').value.trim(),
      material:    document.getElementById('pMaterial').value.trim(),
      care:        document.getElementById('pCare').value.trim(),
      is_event:    document.getElementById('pIsEvent').checked,
      styles,
    };

    if (!data.name || !data.price || !data.main_img) {
      alert('상품명, 가격, 이미지 URL은 필수입니다.'); return;
    }

    try {
      if (editingId) await API.products.update(editingId, data);
      else            await API.products.create(data);
      closeProductModal();
      loadProducts();
      alert(editingId ? '상품이 수정되었습니다.' : '상품이 등록되었습니다.');
    } catch (e) {
      alert('저장 실패: ' + e.message);
    }
  };

  /* ── 초기화 ─────────────────────────────── */
  const init = async () => {
    // 유저 이름
    const user = JSON.parse(localStorage.getItem('varo_user') || '{}');
    const nameEl = document.getElementById('admUserName');
    if (nameEl) nameEl.textContent = user.name || '관리자';

    initTabs();

    // 모달 이벤트
    document.getElementById('btnAddProduct')?.addEventListener('click', () => openProductModal(null));
    document.getElementById('productModalClose')?.addEventListener('click', closeProductModal);
    document.getElementById('productModalCancel')?.addEventListener('click', closeProductModal);
    document.getElementById('productModalSave')?.addEventListener('click', saveProduct);
    document.getElementById('productModal')?.addEventListener('click', e => {
      if (e.target.id === 'productModal') closeProductModal();
    });

    // 로그아웃
    document.getElementById('admLogout')?.addEventListener('click', () => {
      API.auth.logout();
      location.href = './login.html';
    });

    loadDashboard();
  };

  return { init };
})();

document.addEventListener('DOMContentLoaded', Admin.init);
