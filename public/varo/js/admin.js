/* admin.js — VARO Admin Dashboard (Transplanted from admins.html) */

// ════════════════════════════════════════════════════════
// DATA STORE
// ════════════════════════════════════════════════════════
const DATA = {
  products: [
    { id: 1, name: '오버핏 코튼 티셔츠', sku: 'VR-TOP-001', category: '상의', price: 29000, origPrice: 39000, stock: 145, sold: 892, status: '판매중', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop&q=85' },
    { id: 2, name: '슬림 데님 팬츠', sku: 'VR-BOT-001', category: '하의', price: 59000, origPrice: 79000, stock: 67, sold: 534, status: '판매중', img: 'https://images.unsplash.com/photo-1603252109612-6d5fee16a54d?w=600&h=800&fit=crop&q=85' },
    { id: 3, name: '크롭 후드 집업', sku: 'VR-OUT-001', category: '아우터', price: 89000, origPrice: 119000, stock: 32, sold: 421, status: '판매중', img: 'https://images.unsplash.com/photo-1556821840-03a63f8550d64?w=600&h=800&fit=crop&q=85' },
    { id: 4, name: '캔버스 스니커즈', sku: 'VR-SHO-001', category: '신발', price: 69000, origPrice: 89000, stock: 0, sold: 312, status: '품절', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop&q=85' },
    { id: 5, name: '버킷햇', sku: 'VR-ACC-001', category: '악세서리', price: 25000, origPrice: 32000, stock: 8, sold: 278, status: '판매중', img: 'https://images.unsplash.com/photo-1554062614-69755137dbad?w=600&h=800&fit=crop&q=85' },
    { id: 6, name: '린넨 셔츠', sku: 'VR-TOP-002', category: '상의', price: 45000, origPrice: 59000, stock: 88, sold: 167, status: '판매중', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop&q=85' },
    { id: 7, name: '와이드 트라우저', sku: 'VR-BOT-002', category: '하의', price: 72000, origPrice: 89000, stock: 3, sold: 145, status: '판매중', img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop&q=85' },
    { id: 8, name: '나일론 윈드브레이커', sku: 'VR-OUT-002', category: '아우터', price: 129000, origPrice: 159000, stock: 21, sold: 98, status: '판매중', img: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop&q=85' },
    { id: 9, name: '슬링백 힐', sku: 'VR-SHO-002', category: '신발', price: 85000, origPrice: 105000, stock: 14, sold: 87, status: '판매중', img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=800&fit=crop&q=85' },
    { id: 10, name: '미니 크로스백', sku: 'VR-ACC-002', category: '악세서리', price: 55000, origPrice: 72000, stock: 0, sold: 203, status: '숨김', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop&q=85' },
    { id: 11, name: '스트라이프 니트', sku: 'VR-TOP-003', category: '상의', price: 65000, origPrice: 82000, stock: 56, sold: 134, status: '판매중', img: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&h=800&fit=crop&q=85' },
    { id: 12, name: '조거 팬츠', sku: 'VR-BOT-003', category: '하의', price: 48000, origPrice: 62000, stock: 77, sold: 221, status: '판매중', img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop&q=85' },
  ],
  orders: [
    { id: 'ORD-202504-0284', customer: '김민준', email: 'mj@email.com', phone: '010-1234-5678', product: '오버핏 코튼 티셔츠 외 2개', amount: 87000, payment: '카드', status: '결제완료', date: '2025-04-23 14:22' },
    { id: 'ORD-202504-0283', customer: '이서연', email: 'sy@email.com', phone: '010-2345-6789', product: '슬림 데님 팬츠', amount: 59000, payment: '카카오페이', status: '배송준비', date: '2025-04-23 13:10' },
    { id: 'ORD-202504-0282', customer: '박지훈', email: 'jh@email.com', phone: '010-3456-7890', product: '크롭 후드 집업', amount: 89000, payment: '카드', status: '배송중', date: '2025-04-23 11:45' },
    { id: 'ORD-202504-0281', customer: '최수아', email: 'sa@email.com', phone: '010-4567-8901', product: '버킷햇 외 1개', amount: 50000, payment: '네이버페이', status: '배송완료', date: '2025-04-22 16:30' },
    { id: 'ORD-202504-0280', customer: '정태양', email: 'ty@email.com', phone: '010-5678-9012', product: '린넨 셔츠', amount: 45000, payment: '카드', status: '배송완료', date: '2025-04-22 10:12' },
    { id: 'ORD-202504-0279', customer: '강하늘', email: 'hn@email.com', phone: '010-6789-0123', product: '캔버스 스니커즈', amount: 69000, payment: '카드', status: '취소/반품', date: '2025-04-21 09:00' },
    { id: 'ORD-202504-0278', customer: '윤도현', email: 'dh@email.com', phone: '010-7890-1234', product: '나일론 윈드브레이커', amount: 129000, payment: '계좌이체', status: '결제완료', date: '2025-04-21 15:40' },
    { id: 'ORD-202504-0277', customer: '임채린', email: 'cr@email.com', phone: '010-8901-2345', product: '와이드 트라우저 외 1개', amount: 120000, payment: '카카오페이', status: '배송준비', date: '2025-04-20 18:22' },
    { id: 'ORD-202504-0276', customer: '한지우', email: 'jw@email.com', phone: '010-9012-3456', product: '스트라이프 니트', amount: 65000, payment: '카드', status: '배송중', date: '2025-04-20 12:55' },
    { id: 'ORD-202504-0275', customer: '오민서', email: 'ms@email.com', phone: '010-0123-4567', product: '조거 팬츠 외 2개', amount: 96000, payment: '네이버페이', status: '배송완료', date: '2025-04-19 14:00' },
  ],
  members: [
    { id: 1, name: '김민준', email: 'mj@email.com', phone: '010-1234-5678', role: 'GOLD', purchase: 487000, joinDate: '2024-01-15', lastLogin: '2025-04-23', status: '정상' },
    { id: 2, name: '이서연', email: 'sy@email.com', phone: '010-2345-6789', role: 'GOLD', purchase: 312000, joinDate: '2024-02-20', lastLogin: '2025-04-22', status: '정상' },
    { id: 3, name: '박지훈', email: 'jh@email.com', phone: '010-3456-7890', role: 'SILVER', purchase: 178000, joinDate: '2024-03-05', lastLogin: '2025-04-21', status: '정상' },
    { id: 4, name: '최수아', email: 'sa@email.com', phone: '010-4567-8901', role: 'BRONZE', purchase: 95000, joinDate: '2024-04-12', lastLogin: '2025-04-20', status: '정상' },
    { id: 5, name: '정태양', email: 'ty@email.com', phone: '010-5678-9012', role: 'BRONZE', purchase: 44000, joinDate: '2024-05-01', lastLogin: '2025-04-18', status: '정상' },
    { id: 6, name: '강하늘', email: 'hn@email.com', phone: '010-6789-0123', role: 'BRONZE', purchase: 69000, joinDate: '2024-06-14', lastLogin: '2025-04-15', status: '정지' },
    { id: 7, name: '윤도현', email: 'dh@email.com', phone: '010-7890-1234', role: 'DIA', purchase: 1524000, joinDate: '2023-11-10', lastLogin: '2025-04-23', status: '정상' },
    { id: 8, name: '임채린', email: 'cr@email.com', phone: '010-8901-2345', role: 'SILVER', purchase: 120000, joinDate: '2025-01-08', lastLogin: '2025-04-22', status: '정상' },
  ],
  coupons: [
    { id: 1, name: '신규가입 웰컴 쿠폰', type: '정액', discount: 3000, minOrder: 30000, target: '신규 회원', expiry: '2025-06-30', used: 342, total: 1200, status: '진행중' },
    { id: 2, name: '봄맞이 SALE 10%', type: '정률', discount: 10, minOrder: 50000, target: '전체 회원', expiry: '2025-04-30', used: 891, total: 5000, status: '진행중' },
    { id: 3, name: 'VIP 전용 5,000원 할인', type: '정액', discount: 5000, minOrder: 70000, target: 'VIP 회원', expiry: '2025-12-31', used: 67, total: 500, status: '진행중' },
    { id: 4, name: '생일 축하 20%', type: '정률', discount: 20, minOrder: 0, target: '생일 회원', expiry: '2025-12-31', used: 45, total: 999, status: '진행중' },
    { id: 5, name: '리뷰 작성 감사 쿠폰', type: '정액', discount: 2000, minOrder: 20000, target: '리뷰 작성자', expiry: '2025-05-31', used: 234, total: 9999, status: '진행중' },
  ],
  reviews: [
    { id: 1, product: '오버핏 코튼 티셔츠', customer: '김민준', rating: 5, content: '사이즈도 딱 맞고 소재가 너무 좋아요! 재구매 의사 있습니다.', date: '2025-04-22', replied: true, reply: '소중한 리뷰 감사드립니다 😊' },
    { id: 2, product: '슬림 데님 팬츠', customer: '이서연', rating: 4, content: '핏이 예쁜데 허리가 조금 작아요. 한 사이즈 업 추천합니다.', date: '2025-04-21', replied: false },
    { id: 3, product: '크롭 후드 집업', customer: '박지훈', rating: 3, content: '색상이 사진이랑 조금 다른 것 같아요.', date: '2025-04-20', replied: false },
    { id: 4, product: '버킷햇', customer: '최수아', rating: 5, content: '가성비 최고! 친구한테도 추천했어요.', date: '2025-04-19', replied: true, reply: '추천해 주셔서 정말 감사합니다!' },
    { id: 5, product: '린넨 셔츠', customer: '정태양', rating: 2, content: '배송이 너무 늦었어요. 품질은 괜찮네요.', date: '2025-04-18', replied: false },
  ]
};

// ════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════
const fmt = n => n.toLocaleString('ko-KR');
const fmtW = n => '₩' + n.toLocaleString('ko-KR');

const DEFAULT_AVATAR_SVG = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

function avatarHTML(person) {
  if (person && person.photo) {
    return `<div class="avatar" style="padding:0;overflow:hidden;"><img src="${person.photo}" alt="" style="width:100%;height:100%;object-fit:cover;"></div>`;
  }
  return `<div class="avatar">${DEFAULT_AVATAR_SVG}</div>`;
}

function statusBadge(s) {
  const map = {
    '판매중': 'badge-success', '품절': 'badge-danger', '숨김': 'badge-gray', '준비중': 'badge-warning',
    '결제완료': 'badge-info', '배송준비': 'badge-warning', '배송중': 'badge-info', '배송완료': 'badge-success', '취소/반품': 'badge-danger',
    '정상': 'badge-success', '정지': 'badge-danger',
    'BRONZE': 'badge-bronze', 'SILVER': 'badge-silver', 'GOLD': 'badge-gold', 'DIA': 'badge-dia', 'MANAGER': 'badge-manager',
    '진행중': 'badge-success', '만료': 'badge-gray'
  };
  return `<span class="badge ${map[s] || 'badge-gray'}">${s}</span>`;
}

function showToast(msg, type = '') {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = `toast${type ? ' ' + type : ''}`;
  t.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>${msg}`;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

function openModal(id) {
  document.getElementById(id).classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}
// close on overlay click
document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});

function showPage(id, tabEl) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  if (tabEl) tabEl.classList.add('active');
}

function previewImage(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const preview = document.getElementById('pImgPreview');
      preview.innerHTML = `<img src="${e.target.result}" class="preview-img">`;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// ════════════════════════════════════════════════════════
// DATA SYNC (MySQL Logic Integrator)
// ════════════════════════════════════════════════════════
let API_PRODUCTS = [];

async function syncAllData() {
  try {
    const res = await API.products.getAll();
    if (res.success) {
      API_PRODUCTS = res.products || res.data || [];
      renderProducts();
      renderAnalytics(); // 동적으로 통계 업데이트
    }
  } catch (e) {
    console.error('API Sync Failed:', e);
  }
}

// 실시간 동기화 리스너
window.addEventListener('varo:dataChange', (e) => {
  console.log('Real-time Data Change Detected:', e.detail);
  syncAllData();
});

// ════════════════════════════════════════════════════════
// DASHBOARD RENDER
// ════════════════════════════════════════════════════════
const salesData = [28.4, 31.2, 26.8, 35.1, 38.7, 42.3, 39.9, 44.2, 41.0, 45.8, 43.1, 48.7];
const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

function renderSalesChart() {
  const chart = document.getElementById('salesChart');
  const xAxis = document.getElementById('chartXAxis');
  const max = Math.max(...salesData);
  chart.innerHTML = salesData.map((v, i) => `
    <div class="chart-col">
      <div class="chart-bar${i === 11 ? ' active' : ''}" style="height:${(v / max) * 100}%;" title="${months[i]}: ₩${v}M"></div>
    </div>`).join('');
  xAxis.innerHTML = `<div class="chart-x-axis">${months.map(m => `<div class="chart-x-label">${m}</div>`).join('')}</div>`;
}

const categories = [
  { name: '상의', pct: 34, color: '#111' },
  { name: '하의', pct: 26, color: '#444' },
  { name: '아우터', pct: 18, color: '#777' },
  { name: '신발', pct: 14, color: '#aaa' },
  { name: '악세서리', pct: 8, color: '#ccc' },
];
function renderCategoryStats() {
  const el = document.getElementById('categoryStats');
  el.innerHTML = categories.map(c => `
    <div style="margin-bottom:14px;">
      <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:500;margin-bottom:5px;">
        <span>${c.name}</span><span style="font-family:'Inter'">${c.pct}%</span>
      </div>
      <div class="progress"><div class="progress-bar" style="width:${c.pct}%;background:${c.color}"></div></div>
    </div>`).join('');
}

function renderDashboardOrders() {
  const tbody = document.getElementById('dashboardOrders');
  tbody.innerHTML = DATA.orders.slice(0, 5).map(o => `
    <tr>
      <td style="font-size:12px;color:var(--gray-500);font-family:'Inter'">${o.id}</td>
      <td><div style="display:flex;align-items:center;gap:8px;">${avatarHTML(null)}${o.customer}</div></td>
      <td style="font-family:'Inter';font-weight:600">${fmtW(o.amount)}</td>
      <td>${statusBadge(o.status)}</td>
      <td style="font-size:12px;color:var(--gray-400)">${o.date.split(' ')[1]}</td>
    </tr>`).join('');
}

const activities = [
  { dot: 'green', text: '김민준님이 주문을 완료했습니다 — ₩87,000', time: '14:22' },
  { dot: 'blue', text: '신규 회원 이채원님이 가입했습니다', time: '13:45' },
  { dot: 'yellow', text: '슬림 데님 팬츠 재고가 10개 미만입니다', time: '12:30' },
  { dot: 'red', text: '강하늘님이 주문을 취소 요청했습니다', time: '11:15' },
  { dot: 'green', text: '봄맞이 SALE 쿠폰이 891건 사용되었습니다', time: '10:00' },
];
function renderActivity() {
  document.getElementById('activityFeed').innerHTML = activities.map(a => `
    <div class="activity-item">
      <div class="activity-dot ${a.dot}"></div>
      <div class="activity-text">${a.text}</div>
      <div class="activity-time">${a.time}</div>
    </div>`).join('');
}

// ════════════════════════════════════════════════════════
// PRODUCTS
// ════════════════════════════════════════════════════════
let productFilter = '';
function renderProducts(list) {
  // 하이브리드 병합: 더미 데이터 + API 데이터
  const allList = [...(API_PRODUCTS.map(p => ({
    id: p.id,
    name: p.name,
    sku: p.product_code || 'API-PROD',
    category: p.categoryId || '기타',
    price: p.price,
    origPrice: p.price, // API에는 정가가 따로 없을 수 있음
    stock: p.stock || 0,
    sold: p.rating || 0, // rating을 시연용 sold로 활용
    status: p.isActive ? '판매중' : '숨김',
    img: p.mainImg || './assets/products/default.jpg'
  }))), ...DATA.products];

  const targetList = list || allList;
  document.getElementById('productCount').textContent = fmt(targetList.length);
  const tbody = document.getElementById('productTable');
  tbody.innerHTML = targetList.map(p => `
    <tr>
      <td><input type="checkbox" class="prod-check"></td>
      <td>
        <div style="display:flex;align-items:center;gap:12px;">
          <div class="product-thumb">
            <img src="${p.img.startsWith('http') ? p.img : (p.img.startsWith('./') ? '/varo/' + p.img.substring(2) : p.img)}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;">
          </div>
          <div style="font-weight:600">${p.name}</div>
        </div>
      </td>
      <td style="font-size:12px;color:var(--gray-400);font-family:'Inter'">${p.sku}</td>
      <td>${p.category}</td>
      <td>
        <div style="font-weight:600;font-family:'Inter'">${fmtW(p.price)}</div>
        ${p.origPrice > p.price ? `<div style="font-size:11.5px;color:var(--gray-400);text-decoration:line-through">${fmtW(p.origPrice)}</div>` : ''}
      </td>
      <td class="${p.stock === 0 ? 'stock-low' : p.stock < 10 ? 'stock-low' : 'stock-ok'}">${p.stock === 0 ? '품절' : p.stock + '개'}</td>
      <td style="font-family:'Inter'">${fmt(p.sold)}</td>
      <td>${statusBadge(p.status)}</td>
      <td>
        <div style="display:flex;gap:4px;">
          <button class="btn btn-outline btn-sm btn-icon" title="수정" onclick="editProduct(${p.id})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn btn-danger btn-sm btn-icon" title="삭제" onclick="deleteProduct(${p.id})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
        </div>
      </td>
    </tr>`).join('');
}

function filterProducts(q) {
  const filtered = DATA.products.filter(p => p.name.includes(q) || p.sku.includes(q));
  renderProducts(filtered);
}
function filterByCategory(cat) {
  const filtered = cat ? DATA.products.filter(p => p.category === cat) : DATA.products;
  renderProducts(filtered);
}

async function saveProduct() {
  const name = document.getElementById('pName').value;
  if (!name) { showToast('상품명을 입력하세요.', 'error'); return; }
  const price = document.getElementById('pPrice').value || 0;
  const stock = document.getElementById('pStock').value || 0;
  const categoryId = document.getElementById('pCategory').value || '기타';
  const description = document.getElementById('pDesc').value;
  const fileInput = document.getElementById('pMainImgFile');

  // FormData 생성 (파일 전송)
  const formData = new FormData();
  formData.append('name', name);
  formData.append('price', price);
  formData.append('stock', stock);
  formData.append('category_id', categoryId);
  formData.append('description', description);
  if (fileInput.files[0]) {
    formData.append('main_img', fileInput.files[0]);
  } else {
    // 파일이 없으면 더미 URL 시뮬레이션
    formData.append('main_img', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop&q=85');
  }

  showToast('저장 중...', 'info');

  try {
    // API.products.create는 내부적으로 fetch(POST)를 호출함
    // FormData 전송을 위해 전역 fetch 또는 API 객체 수정 필요 (여기서는 직접 fetch 호출 시뮬레이션)
    const token = localStorage.getItem('varo_token');
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    const data = await res.json();
    if (res.ok) {
      showToast(`"${name}" 상품이 실시간 등록되었습니다.`, 'success');
      closeModal('modal-add-product');
      syncAllData(); // 목록 새로고침
      // 필드 초기화
      ['pName', 'pSku', 'pOrigPrice', 'pPrice', 'pStock', 'pDesc', 'pTags'].forEach(id => document.getElementById(id).value = '');
      document.getElementById('pImgPreview').innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg><span>클릭하여 이미지 업로드</span>`;
    } else {
      throw new Error(data.error);
    }
  } catch (err) {
    showToast('등록 실패: ' + err.message, 'error');
  }
}

function editProduct(id) {
  const p = DATA.products.find(x => x.id === id);
  if (!p) return;
  document.getElementById('productModalTitle').textContent = '상품 수정';
  document.getElementById('pName').value = p.name;
  document.getElementById('pSku').value = p.sku;
  document.getElementById('pCategory').value = p.category;
  document.getElementById('pPrice').value = p.price;
  document.getElementById('pOrigPrice').value = p.origPrice;
  document.getElementById('pStock').value = p.stock;
  document.getElementById('pStatus').value = p.status;
  openModal('modal-add-product');
}

function deleteProduct(id) {
  const idx = DATA.products.findIndex(x => x.id === id);
  if (idx > -1) {
    const name = DATA.products[idx].name;
    DATA.products.splice(idx, 1);
    renderProducts();
    showToast(`"${name}" 상품이 삭제되었습니다.`);
  }
}

// ════════════════════════════════════════════════════════
// ORDERS
// ════════════════════════════════════════════════════════
let orderStatusFilter = 'all';
function renderOrders(statusFilter) {
  statusFilter = statusFilter || orderStatusFilter;
  const list = statusFilter === 'all' ? DATA.orders : DATA.orders.filter(o => o.status === statusFilter);
  document.getElementById('orderCount').textContent = fmt(DATA.orders.length);
  // update counts
  ['결제완료', '배송준비', '배송중', '배송완료', '취소/반품'].forEach(s => {
    const el = document.getElementById('cnt-' + s);
    if (el) el.textContent = DATA.orders.filter(o => o.status === s).length;
  });
  document.getElementById('cnt-all').textContent = DATA.orders.length;

  const tbody = document.getElementById('orderTable');
  tbody.innerHTML = list.map(o => `
    <tr>
      <td><input type="checkbox" class="order-check"></td>
      <td style="font-size:12px;font-family:'Inter';font-weight:600;color:var(--gray-700)">${o.id}</td>
      <td><div style="display:flex;align-items:center;gap:8px;">${avatarHTML(null)}<div><div style="font-weight:500">${o.customer}</div><div style="font-size:11.5px;color:var(--gray-400)">${o.phone}</div></div></div></td>
      <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${o.product}</td>
      <td style="font-weight:700;font-family:'Inter'">${fmtW(o.amount)}</td>
      <td><span style="font-size:12px;color:var(--gray-500)">${o.payment}</span></td>
      <td>${statusBadge(o.status)}</td>
      <td style="font-size:12px;color:var(--gray-400)">${o.date}</td>
      <td>
        <div style="display:flex;gap:4px;">
          <button class="btn btn-outline btn-sm" onclick="viewOrder('${o.id}')">상세</button>
          ${o.status === '결제완료' ? `<button class="btn btn-primary btn-sm" onclick="updateOrderStatus('${o.id}','배송준비')">준비</button>` : ''}
          ${o.status === '배송준비' ? `<button class="btn btn-primary btn-sm" onclick="updateOrderStatus('${o.id}','배송중')">발송</button>` : ''}
        </div>
      </td>
    </tr>`).join('') || `<tr><td colspan="9" class="tbl-empty">해당 상태의 주문이 없습니다.</td></tr>`;

  const total = list.reduce((s, o) => s + o.amount, 0);
  document.getElementById('orderSummary').innerHTML = `조회된 주문: <b>${list.length}건</b>&nbsp;&nbsp;합계 금액: <b>${fmtW(total)}</b>`;
}

function filterOrders(status, tabEl) {
  orderStatusFilter = status;
  document.querySelectorAll('.inner-tab').forEach(t => t.classList.remove('active'));
  if (tabEl) tabEl.classList.add('active');
  renderOrders(status);
}

function viewOrder(id) {
  const o = DATA.orders.find(x => x.id === id);
  if (!o) return;
  document.getElementById('orderDetailBody').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
      <div class="card" style="box-shadow:none;border:1px solid var(--gray-100);">
        <div class="card-body">
          <div class="stat-label" style="margin-bottom:8px;">주문 정보</div>
          <div style="font-size:13px;line-height:1.8;">
            <b>주문번호</b>: ${o.id}<br>
            <b>주문일시</b>: ${o.date}<br>
            <b>결제방법</b>: ${o.payment}<br>
            <b>주문상태</b>: ${statusBadge(o.status)}
          </div>
        </div>
      </div>
      <div class="card" style="box-shadow:none;border:1px solid var(--gray-100);">
        <div class="card-body">
          <div class="stat-label" style="margin-bottom:8px;">배송 정보</div>
          <div style="font-size:13px;line-height:1.8;">
            <b>수령인</b>: ${o.customer}<br>
            <b>연락처</b>: ${o.phone}<br>
            <b>배송지</b>: 서울특별시 강남구 테헤란로 123<br>
            <b>운송장</b>: <span style="color:var(--gray-400)">미입력</span>
          </div>
        </div>
      </div>
    </div>
    <div class="card" style="box-shadow:none;border:1px solid var(--gray-100);">
      <div class="card-body">
        <div class="stat-label" style="margin-bottom:8px;">주문 상품</div>
        <div style="font-size:13px;">${o.product} — <b>${fmtW(o.amount)}</b></div>
      </div>
    </div>
    <div style="margin-top:12px;">
      <label class="form-label">상태 변경</label>
      <select class="form-control" onchange="updateOrderStatus('${o.id}',this.value)">
        ${['결제완료', '배송준비', '배송중', '배송완료', '취소/반품'].map(s => `<option${o.status === s ? ' selected' : ''}>${s}</option>`).join('')}
      </select>
    </div>`;
  openModal('modal-order-detail');
}

function updateOrderStatus(id, newStatus) {
  const o = DATA.orders.find(x => x.id === id);
  if (o) { o.status = newStatus; renderOrders(); showToast(`주문 상태가 "${newStatus}"로 변경되었습니다.`, 'success'); }
}

// ════════════════════════════════════════════════════════
// MEMBERS
// ════════════════════════════════════════════════════════
function renderMembers() {
  document.getElementById('memberCount').textContent = fmt(DATA.members.length);
  document.getElementById('memberTable').innerHTML = DATA.members.map(m => `
    <tr>
      <td><input type="checkbox" class="mem-check"></td>
      <td><div style="display:flex;align-items:center;gap:8px;">${avatarHTML(m)}<div style="font-weight:500">${m.name}</div></div></td>
      <td style="font-size:13px;color:var(--gray-500)">${m.email}</td>
      <td style="font-size:13px;color:var(--gray-500)">${m.phone}</td>
      <td>${statusBadge(m.role)}</td>
      <td style="font-weight:600;font-family:'Inter'">${fmtW(m.purchase)}</td>
      <td style="font-size:12px;color:var(--gray-400)">${m.joinDate}</td>
      <td style="font-size:12px;color:var(--gray-400)">${m.lastLogin}</td>
      <td>${m.status === '정지' ? statusBadge('정지') : statusBadge('정상')}</td>
      <td>
        <div style="display:flex;gap:4px;">
          <button class="btn btn-outline btn-sm" onclick="viewMember(${m.id})">상세</button>
          <button class="btn btn-outline btn-sm" onclick="toggleMemberStatus(${m.id})">${m.status === '정지' ? '활성화' : '정지'}</button>
        </div>
      </td>
    </tr>`).join('');
}

function toggleMemberStatus(id) {
  const m = DATA.members.find(x => x.id === id);
  if (m) { m.status = m.status === '정지' ? '정상' : '정지'; renderMembers(); showToast(`${m.name}님 계정이 ${m.status} 처리되었습니다.`); }
}

function saveMember() {
  const name = document.getElementById('mName').value;
  const email = document.getElementById('mEmail').value;
  if (!name || !email) { showToast('이름과 이메일을 입력하세요.', 'error'); return; }
  DATA.members.unshift({ id: Date.now(), name, email, phone: document.getElementById('mPhone').value, role: document.getElementById('mRole').value, purchase: 0, joinDate: new Date().toISOString().split('T')[0], lastLogin: '-', status: '정상' });
  renderMembers();
  closeModal('modal-add-member');
  showToast(`${name}님이 등록되었습니다.`, 'success');
}

function viewMember(id) {
  const m = DATA.members.find(x => x.id === id);
  if (!m) return;
  const orders = DATA.orders.filter(o => o.customer === m.name);
  document.getElementById('memberDetailBody').innerHTML = `
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;">
      <div style="width:56px;height:56px;border-radius:50%;background:var(--gray-100);display:flex;align-items:center;justify-content:center;">
        ${m.photo ? `<img src="${m.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">` : `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--gray-400)" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`}
      </div>
      <div>
        <div style="font-size:18px;font-weight:700;">${m.name}</div>
        <div style="font-size:13px;color:var(--gray-400);">${m.email}</div>
      </div>
      <div style="margin-left:auto;">${m.status === '정지' ? statusBadge('정지') : statusBadge('정상')}</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
      <div class="card" style="box-shadow:none;border:1px solid var(--gray-100);">
        <div class="card-body">
          <div class="stat-label" style="margin-bottom:8px;">회원 정보</div>
          <div style="font-size:13px;line-height:2;">
            <b>연락처</b>: ${m.phone}<br>
            <b>등급</b>: <span class="role-tag role-${m.role.toLowerCase()}">${m.role}</span><br>
            <b>가입일</b>: ${m.joinDate}<br>
            <b>최근 접속</b>: ${m.lastLogin}
          </div>
        </div>
      </div>
      <div class="card" style="box-shadow:none;border:1px solid var(--gray-100);">
        <div class="card-body">
          <div class="stat-label" style="margin-bottom:8px;">구매 정보</div>
          <div style="font-size:13px;line-height:2;">
            <b>누적 구매</b>: <span style="font-weight:700;font-family:'Inter'">${fmtW(m.purchase)}</span><br>
            <b>주문 횟수</b>: ${orders.length}건<br>
            <b>평균 주문</b>: ${orders.length > 0 ? fmtW(Math.round(m.purchase / orders.length)) : '-'}
          </div>
        </div>
      </div>
    </div>
    ${orders.length > 0 ? `
    <div class="card" style="box-shadow:none;border:1px solid var(--gray-100);">
      <div class="card-header"><span class="card-title">최근 주문 내역</span></div>
      <div class="tbl-wrap"><table><thead><tr><th>주문번호</th><th>상품</th><th>금액</th><th>상태</th><th>일시</th></tr></thead><tbody>
        ${orders.map(o => `<tr><td style="font-size:12px;font-family:'Inter'">${o.id}</td><td>${o.product}</td><td style="font-weight:600;font-family:'Inter'">${fmtW(o.amount)}</td><td>${statusBadge(o.status)}</td><td style="font-size:12px;color:var(--gray-400)">${o.date}</td></tr>`).join('')}
      </tbody></table></div>
    </div>` : '<div style="text-align:center;color:var(--gray-400);padding:16px;">주문 내역이 없습니다.</div>'}
    <div style="margin-top:16px;display:flex;gap:8px;">
      <label class="form-label" style="margin-bottom:0;align-self:center;">등급 변경</label>
      <select class="form-control" style="width:120px;" onchange="updateMemberRole(${m.id},this.value)">
        ${['BRONZE', 'SILVER', 'GOLD', 'DIA', 'MANAGER'].map(r => `<option${m.role === r ? ' selected' : ''}>${r}</option>`).join('')}
      </select>
    </div>`;
  openModal('modal-member-detail');
}

function updateMemberRole(id, newRole) {
  const m = DATA.members.find(x => x.id === id);
  if (m) { m.role = newRole; renderMembers(); showToast(`${m.name}님 등급이 ${newRole}로 변경되었습니다.`, 'success'); }
}

// ════════════════════════════════════════════════════════
// COUPONS
// ════════════════════════════════════════════════════════
function renderCoupons() {
  document.getElementById('couponGrid').innerHTML = DATA.coupons.map(c => `
    <div class="card">
      <div class="card-body">
        <div class="coupon-card" style="margin-bottom:12px;">
          <div>
            <div class="coupon-discount">${c.type === '정액' ? fmtW(c.discount) : c.discount + '%'} <span style="font-size:16px;font-weight:500">할인</span></div>
            <div class="coupon-name">${c.name}</div>
            <div class="coupon-cond">최소 ${fmtW(c.minOrder)} 이상 · ${c.target}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:11px;color:var(--gray-400);">만료일</div>
            <div style="font-size:13px;font-weight:600;">${c.expiry}</div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--gray-400);margin-bottom:8px;">
          <span>사용: <b style="color:var(--black)">${fmt(c.used)}</b></span>
          <span>발급: <b>${fmt(c.total)}</b></span>
          <span>사용률: <b>${Math.round(c.used / c.total * 100)}%</b></span>
        </div>
        <div class="progress"><div class="progress-bar" style="width:${Math.round(c.used / c.total * 100)}%"></div></div>
        <div style="display:flex;gap:8px;margin-top:12px;">
          <button class="btn btn-outline btn-sm" style="flex:1" onclick="showToast('쿠폰 수정')">수정</button>
          <button class="btn btn-danger btn-sm" onclick="deleteCoupon(${c.id})">삭제</button>
        </div>
      </div>
    </div>`).join('');
}

function deleteCoupon(id) {
  const idx = DATA.coupons.findIndex(x => x.id === id);
  if (idx > -1) { DATA.coupons.splice(idx, 1); renderCoupons(); showToast('쿠폰이 삭제되었습니다.'); }
}

function saveCoupon() {
  const name = document.getElementById('cName').value;
  if (!name) { showToast('쿠폰명을 입력하세요.', 'error'); return; }
  const discount = parseInt(document.getElementById('cDiscount').value) || 0;
  const type = document.getElementById('cType').value === '정액 할인' ? '정액' : '정률';
  DATA.coupons.unshift({ id: Date.now(), name, type, discount, minOrder: parseInt(document.getElementById('cMinOrder').value) || 0, target: document.getElementById('cTarget').value, expiry: document.getElementById('cExpiry').value || '2025-12-31', used: 0, total: 9999, status: '진행중' });
  renderCoupons();
  closeModal('modal-add-coupon');
  showToast(`"${name}" 쿠폰이 생성되었습니다.`, 'success');
}

// ════════════════════════════════════════════════════════
// REVIEWS
// ════════════════════════════════════════════════════════
function renderReviews() {
  document.getElementById('reviewList').innerHTML = DATA.reviews.map(r => `
    <div class="review-row">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
        <div style="display:flex;align-items:center;gap:10px;min-width:0;">
          ${avatarHTML(null)}
          <div>
            <div style="font-weight:600;font-size:13px;">${r.customer}</div>
            <div style="font-size:11.5px;color:var(--gray-400)">${r.product}</div>
          </div>
        </div>
        <div style="text-align:right;flex-shrink:0;">
          <div class="star-rating">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
          <div style="font-size:11.5px;color:var(--gray-400)">${r.date}</div>
        </div>
      </div>
      <div style="margin:10px 0;font-size:13.5px;line-height:1.6">${r.content}</div>
      ${r.replied ? `<div style="background:var(--gray-50);border-left:3px solid var(--black);padding:10px 14px;border-radius:0 6px 6px 0;font-size:13px;color:var(--gray-600);">↳ ${r.reply}</div>` : ''}
      <div style="display:flex;gap:8px;margin-top:10px;">
        <button class="btn btn-outline btn-sm" onclick="replyReview(${r.id})">${r.replied ? '답변 수정' : '답변 작성'}</button>
        <button class="btn btn-outline btn-sm" onclick="showToast('리뷰가 숨김 처리되었습니다.')">숨김</button>
        <button class="btn btn-danger btn-sm" onclick="showToast('리뷰가 삭제되었습니다.')">삭제</button>
      </div>
    </div>`).join('');
}

function replyReview(id) {
  const r = DATA.reviews.find(x => x.id === id);
  if (!r) return;
  document.getElementById('reviewDetailBody').innerHTML = `
    <div style="background:var(--gray-50);padding:12px;border-radius:8px;font-size:13px;">
      <b>${r.customer}</b> · ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}<br>
      <span style="color:var(--gray-600)">${r.content}</span>
    </div>`;
  document.getElementById('replyText').value = r.reply || '';
  openModal('modal-review-reply');
  window._replyId = id;
}

function saveReply() {
  const r = DATA.reviews.find(x => x.id === window._replyId);
  const text = document.getElementById('replyText').value;
  if (!text) { showToast('답변 내용을 입력하세요.', 'error'); return; }
  if (r) { r.replied = true; r.reply = text; renderReviews(); }
  closeModal('modal-review-reply');
  showToast('답변이 등록되었습니다.', 'success');
}

// ════════════════════════════════════════════════════════
// ANALYTICS
// ════════════════════════════════════════════════════════
function renderAnalytics() {
  // hourly
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const hourData = [2, 1, 1, 0, 0, 1, 3, 8, 14, 18, 22, 19, 25, 21, 17, 20, 28, 32, 38, 41, 35, 29, 22, 14];
  const maxH = Math.max(...hourData);
  document.getElementById('hourlyChart').innerHTML = hours.map((h, i) => `
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;">
      <div style="width:100%;background:${i >= 18 && i <= 21 ? 'var(--black)' : 'var(--gray-200)'};border-radius:3px 3px 0 0;height:${(hourData[i] / maxH) * 140}px;" title="${h}시: ${hourData[i]}건"></div>
    </div>`).join('');
  document.getElementById('hourlyLabel').innerHTML = [0, 6, 12, 18, 23].map(h => `<span style="font-size:10px;color:var(--gray-400);flex:${h === 0 ? 1 : h === 6 ? 6 : h === 12 ? 6 : h === 18 ? 5 : 5}">${h}시</span>`).join('');

  // top products
  const top = [...DATA.products].sort((a, b) => b.sold - a.sold).slice(0, 5);
  const maxSold = top[0].sold;
  document.getElementById('topProducts').innerHTML = top.map((p, i) => `
    <div style="margin-bottom:14px;">
      <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:500;margin-bottom:5px;">
        <span><b style="color:var(--gray-400);font-size:11px;margin-right:6px;">${i + 1}</b>${p.name}</span>
        <span style="font-family:'Inter'">${fmt(p.sold)}개</span>
      </div>
      <div class="progress"><div class="progress-bar" style="width:${(p.sold / maxSold) * 100}%;background:${i === 0 ? '#111' : i === 1 ? '#444' : i === 2 ? '#777' : '#aaa'}"></div></div>
    </div>`).join('');

  // traffic
  const traffic = [
    { src: '직접 유입', pct: 38 }, { src: '검색 (네이버)', pct: 28 }, { src: 'SNS (인스타)', pct: 18 },
    { src: '카카오 채널', pct: 10 }, { src: '기타', pct: 6 }
  ];
  document.getElementById('trafficSource').innerHTML = traffic.map(t => `
    <div style="margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:500;margin-bottom:5px;">
        <span>${t.src}</span><span style="font-family:'Inter'">${t.pct}%</span>
      </div>
      <div class="progress"><div class="progress-bar" style="width:${t.pct}%"></div></div>
    </div>`).join('');
}

// ════════════════════════════════════════════════════════
// SETTINGS TOGGLES
// ════════════════════════════════════════════════════════
function renderSettings() {
  const notiItems = [
    ['신규 주문 알림', 'noti1', true], ['재고 부족 알림 (10개 미만)', 'noti2', true],
    ['회원 가입 알림', 'noti3', false], ['리뷰 등록 알림', 'noti4', true],
    ['주문 취소/반품 알림', 'noti5', true],
  ];
  document.getElementById('notiSettings').innerHTML = notiItems.map(([label, id, checked]) => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--gray-100);">
      <span style="font-size:13.5px;">${label}</span>
      <label class="toggle"><input type="checkbox"${checked ? ' checked' : ''}><span class="toggle-slider"></span></label>
    </div>`).join('');

  const payItems = [['신용카드', 'pay1', true], ['카카오페이', 'pay2', true], ['네이버페이', 'pay3', true], ['계좌이체', 'pay4', true], ['무통장입금', 'pay5', false]];
  document.getElementById('paymentSettings').innerHTML = payItems.map(([label, id, checked]) => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--gray-100);">
      <span style="font-size:13.5px;">${label}</span>
      <label class="toggle"><input type="checkbox"${checked ? ' checked' : ''}><span class="toggle-slider"></span></label>
    </div>`).join('');
}

// ════════════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════════════
async function init() {
  renderSalesChart();
  renderCategoryStats();
  renderDashboardOrders();
  renderActivity();
  await syncAllData(); // 초기 데이터 동기화
  renderOrders();
  renderMembers();
  renderCoupons();
  renderReviews();
  renderAnalytics();
  renderSettings();
}

init();
