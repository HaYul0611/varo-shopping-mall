/* admin.js — VARO Admin Dashboard (Transplanted from admins.html) */

// ════════════════════════════════════════════════════════
// DATA STORE
// ════════════════════════════════════════════════════════
const DATA = {
  products: [
    { id: 1, name: '오버핏 코튼 티셔츠', sku: 'VR-TOP-001', category: '상의', price: 29000, origPrice: 39000, stock: 145, sold: 892, status: '판매중', img: './assets/products/P001_main.png' },
    { id: 2, name: '슬림 데님 팬츠', sku: 'VR-BOT-001', category: '하의', price: 59000, origPrice: 79000, stock: 67, sold: 534, status: '판매중', img: './assets/products/P002_main.png' },
    { id: 3, name: '크롭 후드 집업', sku: 'VR-OUT-001', category: '아우터', price: 89000, origPrice: 119000, stock: 32, sold: 421, status: '판매중', img: './assets/products/P003_main.jpg' },
    { id: 4, name: '캔버스 스니커즈', sku: 'VR-SHO-001', category: '신발', price: 69000, origPrice: 89000, stock: 0, sold: 312, status: '품절', img: './assets/products/P004_main.png' },
    { id: 5, name: '버킷햇', sku: 'VR-ACC-001', category: '악세서리', price: 25000, origPrice: 32000, stock: 8, sold: 278, status: '판매중', img: './assets/products/P005_main.jpg' },
    { id: 6, name: '린넨 셔츠', sku: 'VR-TOP-002', category: '상의', price: 45000, origPrice: 59000, stock: 88, sold: 167, status: '판매중', img: './assets/products/P006_main.jpg' },
    { id: 7, name: '와이드 트라우저', sku: 'VR-BOT-002', category: '하의', price: 72000, origPrice: 89000, stock: 3, sold: 145, status: '판매중', img: './assets/products/P007_main.jpg' },
    { id: 8, name: '나일론 윈드브레이커', sku: 'VR-OUT-002', category: '아우터', price: 129000, origPrice: 159000, stock: 21, sold: 98, status: '판매중', img: './assets/products/P008_main.gif' },
    { id: 9, name: '슬링백 힐', sku: 'VR-SHO-002', category: '신발', price: 85000, origPrice: 105000, stock: 14, sold: 87, status: '판매중', img: './assets/products/P009_main.png' },
    { id: 10, name: '미니 크로스백', sku: 'VR-ACC-002', category: '악세서리', price: 55000, origPrice: 72000, stock: 0, sold: 203, status: '숨김', img: './assets/products/P010_main.jpg' },
    { id: 11, name: '스트라이프 니트', sku: 'VR-TOP-003', category: '상의', price: 65000, origPrice: 82000, stock: 56, sold: 134, status: '판매중', img: './assets/products/P011_main.jpg' },
    { id: 12, name: '조거 팬츠', sku: 'VR-BOT-003', category: '하의', price: 48000, origPrice: 62000, stock: 77, sold: 221, status: '판매중', img: './assets/products/P012_main.jpg' },
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
    '판매중': 'badge-success', '품절': 'badge-danger', '숨기기': 'badge-gray', '입고 예정': 'badge-warning',
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

  // 탭 자동 매칭 (tabEl이 없을 경우를 위해)
  if (!tabEl) {
    const tabs = document.querySelectorAll('.nav-tab');
    const tabMap = { 'dashboard': 0, 'products': 1, 'orders': 2, 'members': 3, 'categories': 4, 'banners': 5, 'settings': 6, 'qna': 7 };
    tabEl = tabs[tabMap[id]];
  }

  if (tabEl) tabEl.classList.add('active');

  // 페이지 상태 저장
  localStorage.setItem('activeAdminPage', id);
}

// ════════════════════════════════════════════════════════
// RICH TEXT EDITOR HELPERS
// ════════════════════════════════════════════════════════
function execEditorCommand(cmd, val = null) {
  if (cmd === 'hiliteColor') {
    // 형광펜 토글 로직: 선택 영역의 배경색을 확인하여 이미 배경색이 있으면 투명하게 처리
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const parent = selection.getRangeAt(0).commonAncestorContainer.parentElement;
      const bg = window.getComputedStyle(parent).backgroundColor;
      // 노란색(#ffff00 -> rgb(255, 255, 0)) 확인
      if (bg === 'rgb(255, 255, 0)' || bg === 'yellow') {
        document.execCommand('hiliteColor', false, 'transparent');
      } else {
        document.execCommand('hiliteColor', false, val);
      }
    }
  } else if (cmd === 'removeFormat') {
    document.execCommand('removeFormat', false, null);
    document.execCommand('hiliteColor', false, 'transparent'); // 배경색도 명시적으로 제거
  } else {
    document.execCommand(cmd, false, val);
  }
  document.getElementById('pDescEditor').focus();
}

// 에디터 내용 -> 숨겨진 textarea 동기화
function syncEditorToTextarea() {
  const editor = document.getElementById('pDescEditor');
  const textarea = document.getElementById('pDesc');
  if (editor && textarea) {
    textarea.value = editor.innerHTML;
  }
}

function previewImage(input, previewId = 'pImgPreview') {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const preview = document.getElementById(previewId);
      preview.innerHTML = `<img src="${e.target.result}" class="preview-img">`;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function previewImages(input, previewId) {
  const preview = document.getElementById(previewId);
  preview.innerHTML = '';
  if (input.files) {
    [...input.files].forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.className = 'preview-img-sm'; // 작은 썸네일용 스타일
        img.style.width = '40px';
        img.style.height = '40px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '4px';
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  }
}

// ════════════════════════════════════════════════════════
// DATA SYNC (MySQL Logic Integrator)
// ════════════════════════════════════════════════════════
let API_PRODUCTS = [];
let API_CATEGORIES = [];
let API_BANNERS = [];

async function syncAllData() {
  try {
    const [pRes, cRes, bRes] = await Promise.all([
      API.products.getAll(),
      API.categories.getAll(),
      API.banners.getAll()
    ]);

    if (pRes.success) {
      API_PRODUCTS = pRes.products || pRes.data || [];
      renderProducts();
      renderAnalytics();
    }
    if (cRes.success) {
      API_CATEGORIES = cRes.data || [];
      renderCategories();
    }
    if (bRes.success) {
      API_BANNERS = bRes.data || [];
      renderBanners();
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
  const ctx = document.getElementById('salesChartCanvas');
  if (!ctx) return;

  if (window.mySalesChart) {
    window.mySalesChart.destroy();
  }

  window.mySalesChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: '월별 매출 (₩M)',
        data: salesData,
        borderColor: '#D96B3C',
        backgroundColor: 'rgba(217, 107, 60, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (context) {
              return ' ₩' + context.raw + 'M';
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: '#F0F0F0' }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
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
  const salePrice = document.getElementById('pSalePrice').value || null;
  const badge = document.getElementById('pBadge').value || null;
  const stock = document.getElementById('pStock').value || 0;
  const categoryId = document.getElementById('pCategory').value;
  syncEditorToTextarea();
  const description = document.getElementById('pDesc').value;
  const mainFile = document.getElementById('pMainImgFile').files[0];
  const subFiles = document.getElementById('pSubImgFiles').files;

  const formData = new FormData();
  formData.append('name', name);
  formData.append('price', price);
  if (salePrice) formData.append('sale_price', salePrice);
  if (badge) formData.append('badge', badge);
  formData.append('stock', stock);
  formData.append('category_id', categoryId);
  formData.append('description', description);

  if (mainFile) formData.append('main_img', mainFile);
  if (subFiles.length > 0) {
    for (let i = 0; i < subFiles.length; i++) {
      formData.append('sub_imgs', subFiles[i]);
    }
  }

  const token = localStorage.getItem('varo_token');
  if (!token) {
    showToast('권한이 없습니다. 다시 로그인해 주세요.', 'error');
    return;
  }

  showToast('저장 중...', 'info');

  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    const data = await res.json();
    if (res.ok) {
      showToast(`"${name}" 상품이 처리되었습니다.`, 'success');
      closeModal('modal-add-product');
      syncAllData();
    } else {
      throw new Error(data.error || '권한이 없거나 서버 에러가 발생했습니다.');
    }
  } catch (err) {
    showToast('등록 실패: ' + err.message, 'error');
  }
}

function openAddProductModal() {
  document.getElementById('productModalTitle').textContent = '새 상품 등록';
  // 필드 초기화
  document.getElementById('pName').value = '';
  document.getElementById('pSku').value = '';
  document.getElementById('pCategory').selectedIndex = 0;
  document.getElementById('pPrice').value = '';
  document.getElementById('pSalePrice').value = '';

  // 배지 초기화
  document.querySelectorAll('.badge-toggle').forEach(btn => btn.classList.remove('is-active'));
  document.getElementById('pBadge').value = '';

  document.getElementById('pStock').value = '';
  document.getElementById('pStatus').selectedIndex = 0;
  document.getElementById('pDescEditor').innerHTML = '';
  document.getElementById('pMainImgFile').value = '';
  document.getElementById('pSubImgFiles').value = '';

  openModal('modal-add-product');
}

function toggleBadge(el) {
  // 다중 선택 허용 (체크박스 스타일)
  el.classList.toggle('is-active');

  // 활성화된 값들을 모아서 input에 저장
  const actives = Array.from(document.querySelectorAll('.badge-toggle.is-active'))
    .map(btn => btn.dataset.value);
  document.getElementById('pBadge').value = actives.join(',');
}

function editProduct(id) {
  // API 데이터 또는 더미 데이터에서 검색
  const p = API_PRODUCTS.find(x => x.id === id) || DATA.products.find(x => x.id === id);
  if (!p) return;
  document.getElementById('productModalTitle').textContent = '상품 수정';
  document.getElementById('pName').value = p.name || '';
  document.getElementById('pSku').value = p.product_code || p.sku || '';
  document.getElementById('pCategory').value = p.category_id || p.category || '';
  document.getElementById('pPrice').value = p.price || 0;
  document.getElementById('pSalePrice').value = p.sale_price || '';

  // 배지 버튼 활성화 (다중)
  const badgeStr = p.badge || '';
  const badges = badgeStr.split(',').filter(Boolean);
  document.getElementById('pBadge').value = badgeStr;
  document.querySelectorAll('.badge-toggle').forEach(btn => {
    if (badges.includes(btn.dataset.value)) btn.classList.add('is-active');
    else btn.classList.remove('is-active');
  });

  document.getElementById('pStock').value = p.stock || 0;
  document.getElementById('pStatus').value = p.isActive ? '판매중' : (p.status || '판매중');
  document.getElementById('pDescEditor').innerHTML = p.description || '';
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

async function updateOrderStatus(id, newStatus) {
  const statusMap = {
    '결제완료': 'pending',
    '배송준비': 'preparing',
    '배송중': 'shipped',
    '배송완료': 'delivered',
    '취소/반품': 'cancelled'
  };
  const engStatus = statusMap[newStatus] || newStatus;

  try {
    const res = await API.orders.updateStatus(id, engStatus);
    if (res.success) {
      const o = DATA.orders.find(x => x.id === id);
      if (o) o.status = newStatus;
      renderOrders();
      showToast(`주문 상태가 "${newStatus}"로 변경되었습니다.`, 'success');
    } else {
      const o = DATA.orders.find(x => x.id === id);
      if (o) o.status = newStatus;
      renderOrders();
      showToast(`주문 상태가 "${newStatus}"로 변경되었습니다.`, 'success');
    }
  } catch (e) {
    const o = DATA.orders.find(x => x.id === id);
    if (o) o.status = newStatus;
    renderOrders();
    showToast(`주문 상태가 "${newStatus}"로 변경되었습니다.`, 'success');
  }
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
// CATEGORIES [NEW]
// ════════════════════════════════════════════════════════
function renderCategories() {
  const container = document.getElementById('categoryContainer');
  if (!container) return;

  const parents = API_CATEGORIES.filter(c => !c.parent_id).sort((a, b) => a.sort_order - b.sort_order);
  const children = API_CATEGORIES.filter(c => c.parent_id).sort((a, b) => a.sort_order - b.sort_order);

  // 모달 셀렉트박스 업데이트
  const catParentSelect = document.getElementById('catParent');
  if (catParentSelect) {
    catParentSelect.innerHTML = '<option value="">없음 (최상위)</option>' +
      parents.map(p => `<option value="${p.id}">${p.name || p.label}</option>`).join('');
  }

  const pCatSelect = document.getElementById('pCategory');
  if (pCatSelect) {
    let options = '<option value="">선택</option>';
    parents.forEach(p => {
      options += `<option value="${p.id}" style="font-weight:700;">${p.name || p.label}</option>`;
      children.filter(c => c.parent_id == p.id).forEach(c => {
        options += `<option value="${c.id}">&nbsp;&nbsp;↳ ${c.name || c.label}</option>`;
      });
    });
    pCatSelect.innerHTML = options;
  }

  // 아코디언 렌더링
  container.innerHTML = parents.map(p => {
    const parentChildren = children.filter(c => c.parent_id == p.id);
    return `
      <div class="category-item expanded" data-id="${p.id}">
        <div class="category-parent" onclick="toggleAccordion(this)">
          <div class="drag-handle parent-handle">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/>
            </svg>
          </div>
          <span class="toggle-icon">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
          </span>
          <span class="name">${p.name || p.label} <small style="color:var(--gray-400); font-weight:400; margin-left:8px;">(${p.slug})</small></span>
          <div class="category-actions" onclick="event.stopPropagation()">
            <button class="add-sub-btn" onclick="addSubCategory(${p.id})">+ 서브 추가</button>
            <button class="btn btn-outline btn-sm" style="margin-left:8px" onclick="editCategory(${p.id})">수정</button>
            <button class="btn btn-danger btn-sm" onclick="deleteCategory(${p.id})">삭제</button>
          </div>
        </div>
        <div class="sub-category-list" data-parent-id="${p.id}">
          ${parentChildren.map(c => `
            <div class="sub-item" data-id="${c.id}">
              <div class="drag-handle child-handle">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/>
                </svg>
              </div>
              <span class="name">${c.name || c.label} <small style="color:var(--gray-400); margin-left:6px;">(${c.slug})</small></span>
              <div class="category-actions">
                <button class="btn btn-outline btn-sm" onclick="editCategory(${c.id})">수정</button>
                <button class="btn btn-danger btn-sm" onclick="deleteCategory(${c.id})">삭제</button>
              </div>
            </div>
          `).join('') || '<div style="padding:15px 52px; font-size:12px; color:var(--gray-400);">서브 카테고리가 없습니다.</div>'}
        </div>
      </div>`;
  }).join('') || '<div class="tbl-empty">등록된 카테고리가 없습니다.</div>';

  initCategorySortable();
}

function toggleAccordion(el) {
  el.parentElement.classList.toggle('expanded');
}

function addSubCategory(parentId) {
  document.getElementById('categoryModalTitle').textContent = '서브 카테고리 추가';
  document.getElementById('catName').value = '';
  document.getElementById('catSlug').value = '';
  document.getElementById('catOrder').value = '0';
  document.getElementById('catParent').value = parentId;
  delete document.getElementById('modal-add-category').dataset.editId;
  openModal('modal-add-category');
}

function initCategorySortable() {
  // 1. 상위 카테고리 재정렬
  const container = document.getElementById('categoryContainer');
  if (container && !container._sortable) {
    container._sortable = Sortable.create(container, {
      handle: '.parent-handle',
      animation: 150,
      onEnd: async function () {
        const items = Array.from(container.querySelectorAll('.category-item'));
        const orders = items.map((item, index) => ({
          id: item.dataset.id,
          sort_order: index + 1,
          parent_id: null
        }));
        await saveReorder(orders);
      }
    });
  }

  // 2. 각 하위 카테고리 리스트 재정렬
  document.querySelectorAll('.sub-category-list').forEach(list => {
    if (list._sortable) return;
    const parentId = list.dataset.parentId;
    list._sortable = Sortable.create(list, {
      handle: '.child-handle',
      animation: 150,
      onEnd: async function () {
        const items = Array.from(list.querySelectorAll('.sub-item'));
        const orders = items.map((item, index) => ({
          id: item.dataset.id,
          sort_order: index + 1,
          parent_id: parentId
        }));
        await saveReorder(orders);
      }
    });
  });
}

async function saveReorder(orders) {
  showToast('순서를 저장 중...', 'info');
  try {
    const res = await API.req('PUT', '/categories/reorder', { orders }, true);
    if (res.success) {
      showToast('순서가 변경되었습니다.', 'success');
      syncAllData(); // [ADD] 즉시 데이터 동기화 및 렌더링
    } else {
      showToast(res.message || '순서 저장 실패', 'error');
    }
  } catch (err) {
    showToast('네트워크 오류', 'error');
  }
}

async function saveCategory() {
  const name = document.getElementById('catName').value;
  const slug = document.getElementById('catSlug').value;
  const order = document.getElementById('catOrder').value || 0;
  const parentId = document.getElementById('catParent').value;

  if (!name || !slug) { showToast('이름과 슬러그를 입력하세요.', 'error'); return; }

  const payload = {
    name,
    slug,
    sort_order: parseInt(order),
    parent_id: parentId ? parseInt(parentId) : null,
    is_active: 1
  };

  const editId = document.getElementById('modal-add-category').dataset.editId;

  try {
    let res;
    if (editId) {
      res = await API.categories.update(editId, payload);
    } else {
      res = await API.categories.create(payload);
    }

    if (res.success) {
      showToast('카테고리가 저장되었습니다.', 'success');
      closeModal('modal-add-category');
      delete document.getElementById('modal-add-category').dataset.editId;
      syncAllData();
    }
  } catch (err) {
    showToast('저장 실패: ' + err.message, 'error');
  }
}

async function editCategory(id) {
  const c = API_CATEGORIES.find(x => x.id == id);
  if (!c) return;
  document.getElementById('categoryModalTitle').textContent = '카테고리 수정';
  document.getElementById('catName').value = c.name || c.label;
  document.getElementById('catSlug').value = c.slug || c.id;
  document.getElementById('catOrder').value = c.sort_order || 0;
  document.getElementById('catParent').value = c.parent_id || '';
  document.getElementById('modal-add-category').dataset.editId = id;
  openModal('modal-add-category');
}

async function deleteCategory(id) {
  if (!confirm('정말 삭제하시겠습니까? 하위 카테고리도 함께 삭제될 수 있습니다.')) return;

  try {
    const res = await API.categories.delete(id);
    if (res.success) {
      showToast('카테고리가 삭제되었습니다.');
      syncAllData();
    }
  } catch (e) { showToast('오류: ' + e.message, 'error'); }
}

// ════════════════════════════════════════════════════════
// BANNERS [NEW]
// ════════════════════════════════════════════════════════
function renderBanners() {
  const grid = document.getElementById('bannerGrid');
  if (!grid) return;
  grid.innerHTML = API_BANNERS.map(b => `
    <div class="card">
      <div class="card-body">
        <div style="height:120px;background:var(--gray-100);border-radius:6px;overflow:hidden;margin-bottom:12px;">
          <img src="${b.img_url}" style="width:100%;height:100%;object-fit:cover;">
        </div>
        <div style="font-weight:600;margin-bottom:4px;">${b.title || '제목 없음'}</div>
        <div style="font-size:12px;color:var(--gray-400);margin-bottom:8px;">URL: ${b.link_url || '-'}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:12px;color:var(--gray-500)">순서: ${b.sort_order}</span>
          <div style="display:flex;gap:4px;">
            <button class="btn btn-outline btn-sm" onclick="editBanner(${b.id})">수정</button>
            <button class="btn btn-danger btn-sm" onclick="deleteBanner(${b.id})">삭제</button>
          </div>
        </div>
      </div>
    </div>`).join('') || '<div class="tbl-empty">등록된 배너가 없습니다.</div>';
}

async function saveBanner() {
  const title = document.getElementById('bannerTitle').value;
  const img = document.getElementById('bannerImg').value;
  const link = document.getElementById('bannerLink').value;
  const order = document.getElementById('bannerOrder').value || 0;

  if (!img) { showToast('이미지 URL은 필수입니다.', 'error'); return; }

  try {
    const res = await API.banners.create({ title, img_url: img, link_url: link, sort_order: order });
    if (res.success) {
      showToast('배너가 저장되었습니다.', 'success');
      closeModal('modal-add-banner');
      syncAllData();
    }
  } catch (e) { showToast('오류: ' + e.message, 'error'); }
}

async function deleteBanner(id) {
  if (!confirm('정말 삭제하시겠습니까?')) return;
  try {
    const res = await API.banners.delete(id);
    if (res.success) {
      showToast('배너가 삭제되었습니다.');
      syncAllData();
    }
  } catch (e) { showToast('오류: ' + e.message, 'error'); }
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
// Q&A 관리 (커뮤니티 varo_qna 연동)
// ════════════════════════════════════════════════════════
function getQnaData() {
  return JSON.parse(localStorage.getItem('varo_qna') || '[]');
}

function renderAdminQNA() {
  const allData = getQnaData();
  const filter = document.getElementById('adminQnaFilter')?.value || 'all';
  const filtered = filter === 'all' ? allData : allData.filter(q => q.status === filter);

  // 통계 업데이트
  const totalEl = document.getElementById('adminQnaTotalCount');
  const pendingEl = document.getElementById('adminQnaPendingCount');
  const doneEl = document.getElementById('adminQnaDoneCount');
  if (totalEl) totalEl.textContent = fmt(allData.length);
  if (pendingEl) pendingEl.textContent = fmt(allData.filter(q => q.status === 'pending').length);
  if (doneEl) doneEl.textContent = fmt(allData.filter(q => q.status === 'done').length);

  const list = document.getElementById('adminQnaList');
  if (!list) return;

  if (filtered.length === 0) {
    list.innerHTML = '<div style="text-align:center; padding:40px; color:#888;">등록된 문의가 없습니다.</div>';
    return;
  }

  list.innerHTML = filtered.map(q => `
    <div class="review-row" style="border-bottom:1px solid #f0f0f0; padding:16px 0;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
        <div>
          <span class="badge ${q.status === 'done' ? 'badge-success' : 'badge-warning'}" style="margin-right:8px;">${q.status === 'done' ? '답변완료' : '답변대기'}</span>
          ${q.isSecret ? '<span style="color:#AAA; font-size:11px;">🔒 비밀글</span>' : ''}
        </div>
        <span style="font-size:12px; color:#888;">${q.date}</span>
      </div>
      <div style="font-weight:600; font-size:14px; margin-bottom:4px;">${window.Utils.escapeHTML(q.subject)}</div>
      <div style="font-size:13px; color:#555; line-height:1.6; margin-bottom:8px;">${window.Utils.escapeHTML(q.content || '')}</div>
      <div style="font-size:12px; color:#999; margin-bottom:12px;">${window.Utils.escapeHTML(q.author)}</div>
      ${q.replies && q.replies.length > 0 ? q.replies.map(r => `
        <div style="background:#f8f9fa; padding:12px; border-radius:6px; margin-bottom:8px; border-left:3px solid #1c1a16;">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span style="font-weight:600; font-size:12px;">${window.Utils.escapeHTML(r.author)} ${r.isAdmin ? '<span style="background:#1c1a16; color:#fff; font-size:9px; padding:1px 4px; border-radius:2px;">ADMIN</span>' : ''}</span>
            <span style="font-size:11px; color:#aaa;">${r.date}</span>
          </div>
          <div style="font-size:13px; color:#333;">${window.Utils.escapeHTML(r.content)}</div>
        </div>
      `).join('') : ''}
      <div style="display:flex; gap:8px; align-items:center;">
        <input type="text" class="form-control" placeholder="관리자 답변을 입력하세요..." id="adminReply-${q.id}" style="flex:1; padding:8px 12px; font-size:13px;">
        <button class="btn btn-primary btn-sm" onclick="submitAdminReply(${q.id})" style="white-space:nowrap;">답변 등록</button>
      </div>
    </div>
  `).join('');
}

function submitAdminReply(qId) {
  const input = document.getElementById(`adminReply-${qId}`);
  if (!input || !input.value.trim()) {
    showToast('답변 내용을 입력해주세요.', 'error');
    return;
  }

  const allData = getQnaData();
  const qIdx = allData.findIndex(q => q.id === qId);
  if (qIdx === -1) return;

  const newReply = {
    id: Date.now(),
    author: 'VARO (관리자)',
    content: input.value.trim(),
    date: new Date().toLocaleDateString('ko-KR').replace(/ /g, '').slice(0, -1),
    isAdmin: true
  };

  allData[qIdx].replies = allData[qIdx].replies || [];
  allData[qIdx].replies.push(newReply);
  allData[qIdx].status = 'done';
  localStorage.setItem('varo_qna', JSON.stringify(allData));

  showToast('답변이 등록되었습니다.', 'success');
  renderAdminQNA();
}

// ════════════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════════════
async function init() {
  const savedPage = localStorage.getItem('activeAdminPage') || 'dashboard';
  showPage(savedPage);

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
  renderCategories();
  renderBanners();
  renderSettings();
  renderAdminQNA();
}

init();

/* ── 알림(Notifications) 시스템 ── */
const DEFAULT_NOTIFICATIONS = [
  { id: 1, title: '새로운 주문', desc: '주문번호 #20250423-001 건이 결제 완료되었습니다.', time: '5분 전', unread: true, category: 'order' },
  { id: 2, title: '재고 부족 알림', desc: '[Handmade Coat] 상품의 재고가 3개 이하입니다.', time: '1시간 전', unread: true, category: 'stock' },
  { id: 3, title: '신규 회원 가입', desc: '홍길동 님이 새로운 회원으로 가입하셨습니다.', time: '3시간 전', unread: false, category: 'user' }
];

let NOTIFICATIONS = JSON.parse(localStorage.getItem('varo_notifications')) || DEFAULT_NOTIFICATIONS;

function saveNotifications() {
  localStorage.setItem('varo_notifications', JSON.stringify(NOTIFICATIONS));
}

function toggleNotifications(e) {
  if (e) e.stopPropagation();
  const dropdown = document.getElementById('notifDropdown');
  if (!dropdown) return;

  const isShow = dropdown.classList.toggle('show');
  if (isShow) {
    renderNotifications();
    // 바깥 클릭 시 닫기 (한 번만 등록)
    window.addEventListener('click', closeNotifOnOutside, { once: true });
  }
}

function closeNotifOnOutside(e) {
  const dropdown = document.getElementById('notifDropdown');
  const bell = document.querySelector('.nav-notif');
  if (dropdown && !dropdown.contains(e.target) && !bell.contains(e.target)) {
    dropdown.classList.remove('show');
  } else if (dropdown && dropdown.classList.contains('show')) {
    // 여전히 열려있으면 다시 등록 (한 번만 실행되므로)
    window.addEventListener('click', closeNotifOnOutside, { once: true });
  }
}

function renderNotifications() {
  const list = document.getElementById('notifList');
  const dot = document.getElementById('notifDot');
  if (!list) return;

  if (NOTIFICATIONS.length === 0) {
    list.innerHTML = `<div style="padding:40px 20px; text-align:center; color:var(--gray-400); font-size:13px;">새로운 알림이 없습니다.</div>`;
    if (dot) dot.style.display = 'none';
    return;
  }

  const icons = {
    order: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    stock: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    user: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
  };

  const bgColors = {
    order: '#e1effe',
    stock: '#fde8e8',
    user: '#edf2f7'
  };

  const iconColors = {
    order: '#1e429f',
    stock: '#9b1c1c',
    user: '#4a5568'
  };

  list.innerHTML = NOTIFICATIONS.map(n => `
    <div class="notif-item ${n.unread ? 'unread' : ''}" onclick="readNotification(${n.id}, event)">
      <div class="notif-icon-circle" style="background:${bgColors[n.category] || '#eee'}; color:${iconColors[n.category] || '#666'}">
        ${icons[n.category] || ''}
      </div>
      <div class="notif-content">
        <div class="notif-title">${n.title}</div>
        <div class="notif-desc">${n.desc}</div>
        <div class="notif-time">${n.time}</div>
      </div>
    </div>
  `).join('');

  // 점 표시 여부 (안읽은 알림이 있으면 표시)
  if (dot) {
    dot.style.display = NOTIFICATIONS.some(n => n.unread) ? 'block' : 'none';
  }
}

function readNotification(id, e) {
  if (e) e.stopPropagation();
  const index = NOTIFICATIONS.findIndex(n => n.id === id);
  if (index !== -1) {
    NOTIFICATIONS[index].unread = false;
    saveNotifications();
    renderNotifications();
  }
}

function readAllNotifications(e) {
  if (e) e.stopPropagation();
  NOTIFICATIONS.forEach(n => n.unread = false);
  saveNotifications();
  renderNotifications();
}

// 초기 로딩 시 호출 (점 표시를 위해)
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(renderNotifications, 1000); // 데이터 로드 후 여유있게 실행
});
