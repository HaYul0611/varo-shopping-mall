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
    { id: 1, name: '김민준', email: 'mj@email.com', phone: '010-1234-5678', role: 'GOLD', purchase: 487000, point: 12450, joinDate: '2024-01-15', lastLogin: '2025-04-23', status: '정상' },
    { id: 2, name: '이서연', email: 'sy@email.com', phone: '010-2345-6789', role: 'GOLD', purchase: 312000, point: 8900, joinDate: '2024-02-20', lastLogin: '2025-04-22', status: '정상' },
    { id: 3, name: '박지훈', email: 'jh@email.com', phone: '010-3456-7890', role: 'SILVER', purchase: 178000, point: 4500, joinDate: '2024-03-05', lastLogin: '2025-04-21', status: '정상' },
    { id: 4, name: '최수아', email: 'sa@email.com', phone: '010-4567-8901', role: 'BRONZE', purchase: 95000, point: 2100, joinDate: '2024-04-12', lastLogin: '2025-04-20', status: '정상' },
    { id: 5, name: '정태양', email: 'ty@email.com', phone: '010-5678-9012', role: 'BRONZE', purchase: 44000, point: 1200, joinDate: '2024-05-01', lastLogin: '2025-04-18', status: '정상' },
    { id: 6, name: '강하늘', email: 'hn@email.com', phone: '010-6789-0123', role: 'BRONZE', purchase: 69000, point: 3400, joinDate: '2024-06-14', lastLogin: '2025-04-15', status: '정지' },
    { id: 7, name: '윤도현', email: 'dh@email.com', phone: '010-7890-1234', role: 'DIA', purchase: 1524000, point: 45800, joinDate: '2023-11-10', lastLogin: '2025-04-23', status: '정상' },
    { id: 8, name: '임채린', email: 'cr@email.com', phone: '010-8901-2345', role: 'SILVER', purchase: 120000, point: 5600, joinDate: '2025-01-08', lastLogin: '2025-04-22', status: '정상' },
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
  ],
  banners: [
    { id: 101, title: '2026 S/S 시즌 컬렉션', img_url: './assets/lookbook/lookbook_1.png', link_url: '/shop?cat=new', sort_order: 1, is_active: true },
    { id: 102, title: '신규 회원 웰컴 쿠폰', img_url: './assets/lookbook/lookbook_2.png', link_url: '/event/welcome', sort_order: 2, is_active: true },
    { id: 103, title: '리미티드 에디션 발매', img_url: './assets/lookbook/lookbook_3.png', link_url: '/product/P001', sort_order: 3, is_active: false }
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
    const tabMap = {
      'dashboard': 0,
      'banners': 1,
      'products': 2,
      'orders': 3,
      'members': 4,
      'coupons': 5,
      'community': 6,
      'analytics': 7,
      'settings': 8
    };
    tabEl = tabs[tabMap[id]];
  }

  if (tabEl) tabEl.classList.add('active');

  // 페이지별 초기화
  if (id === 'community') showCommunityTab('notice');
  if (id === 'banners') {
    const activeTab = document.querySelector('#page-banners .inner-tab.active');
    const subType = (activeTab && activeTab.textContent.includes('카테고리')) ? 'category' : 'banner';
    showBannerTab(subType);
  }
  if (id === 'coupons') showCouponTab('진행중');
  if (id === 'settings') renderFullNotifications();

  // 페이지 상태 저장
  localStorage.setItem('activeAdminPage', id);
}

// 서브 탭 제어 (쿠폰)
function showCouponTab(type, el) {
  if (el) {
    el.parentElement.querySelectorAll('.inner-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
  }
  renderCoupons(type);
}

function renderCoupons(type) {
  const grid = document.getElementById('couponGrid');
  if (!grid) return;

  let list = DATA.coupons || [];
  if (type === '진행중') list = list.filter(c => c.status === '진행중');
  else if (type === '만료') list = list.filter(c => c.status === '만료');
  // '발급'은 전체 또는 별도 발급 내역 테이블로 표시 가능 (여기서는 전체로 예시)

  if (type === '발급') {
    // 발급 내역 테이블 형태
    grid.style.display = 'block';
    grid.innerHTML = `
      <div class="card">
        <div class="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>회원명</th>
                <th>쿠폰명</th>
                <th>할인율/금액</th>
                <th>발급일시</th>
                <th>사용여부</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>김민준</td>
                <td>신규가입 웰컴 쿠폰</td>
                <td>3,000원</td>
                <td>2025-04-23 14:22</td>
                <td><span class="badge badge-success">사용완료</span></td>
              </tr>
              <tr>
                <td>이서연</td>
                <td>봄맞이 SALE 10%</td>
                <td>10%</td>
                <td>2025-04-23 13:10</td>
                <td><span class="badge badge-warning">미사용</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else {
    grid.style.display = 'grid';
    grid.innerHTML = list.map(c => `
      <div class="card coupon-card" style="border-left: 4px solid var(--primary-color);">
        <div class="card-body" style="padding: 20px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
            <span class="badge ${c.type === '정액' ? 'badge-info' : 'badge-warning'}">${c.type}</span>
            ${statusBadge(c.status)}
          </div>
          <div style="font-size: 16px; font-weight: 700; margin-bottom: 8px;">${c.name}</div>
          <div style="font-size: 24px; font-weight: 800; color: var(--primary-color); margin-bottom: 12px;">
            ${c.type === '정액' ? fmtW(c.discount) : c.discount + '%'} 할인
          </div>
          <div style="font-size: 12px; color: var(--gray-400); margin-bottom: 4px;">최소 주문: ${fmtW(c.minOrder || 0)}</div>
          <div style="font-size: 12px; color: var(--gray-400); margin-bottom: 15px;">만료일: ${c.expiry}</div>
          <div style="display:flex; justify-content:space-between; align-items:center; font-size: 13px; border-top: 1px dashed var(--gray-200); padding-top: 12px;">
            <span>사용: <b>${c.used}</b> / ${c.total}</span>
            <button class="btn btn-outline btn-sm" onclick="showToast('쿠폰 정보 수정')">수정</button>
          </div>
        </div>
      </div>
    `).join('') || '<div class="tbl-empty">쿠폰이 없습니다.</div>';
  }
}

// 서브 탭 제어 (커뮤니티)
function showCommunityTab(type, el) {
  if (el) {
    el.parentElement.querySelectorAll('.inner-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
  }
  const content = document.getElementById('community-content');
  if (type === 'review') {
    content.innerHTML = `<div class="card"><div class="card-body" id="reviewList"></div></div>`;
    renderReviews();
  } else if (type === 'qna') {
    content.innerHTML = `
      <div class="stats-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 20px;">
        <div class="stat-card">
          <div class="stat-label">전체 문의</div>
          <div class="stat-value" id="adminQnaTotalCount">0</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">답변 대기</div>
          <div class="stat-value" style="color:var(--warning)" id="adminQnaPendingCount">0</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">답변 완료</div>
          <div class="stat-value" style="color:var(--success)" id="adminQnaDoneCount">0</div>
        </div>
      </div>
      <div class="filter-bar" style="margin-bottom: 20px;">
        <select id="adminQnaFilter" class="form-control" style="width: 150px;" onchange="renderAdminQNA()">
          <option value="all">전체 문의</option>
          <option value="pending">답변 대기</option>
          <option value="done">답변 완료</option>
        </select>
      </div>
      <div class="card"><div class="card-body" id="adminQnaList"></div></div>`;
    renderAdminQNA ? renderAdminQNA() : (content.innerHTML = '<div class="p-4 text-center">Q&A 로딩 중...</div>');
  } else if (type === 'notice') {
    content.innerHTML = `<div class="card"><div class="card-body" id="adminNoticeList"></div></div>`;
    renderAdminNotice();
  } else if (type === 'faq') {
    content.innerHTML = `<div class="card"><div class="card-body" id="adminFaqList"></div></div>`;
    renderAdminFAQ();
  }
}

function renderAdminNotice() {
  const container = document.getElementById('adminNoticeList');
  if (!container) return;

  const list = JSON.parse(localStorage.getItem('varo_notices')) || [
    { id: 1, title: '[필독] 2026 SS 시즌 런칭 안내 및 신규 카테고리 오픈', date: '2026-04-15', views: 124, important: true, content: '안녕하세요, VARO입니다.<br><br>2026년 봄/여름(SS) 시즌을 맞이하여 감각적이고 트렌디한 신규 아이템들이 대거 업데이트되었습니다.<br>아울러 새로운 라이프스타일 카테고리가 추가 오픈되었으니 많은 관심 부탁드립니다.<br><br>항상 VARO를 이용해 주셔서 감사합니다.' },
    { id: 2, title: '개인정보처리방침 개정 안내 (2026년 4월 시행)', date: '2026-04-10', views: 89, important: true, content: '안녕하세요, VARO입니다.<br><br>고객님의 소중한 개인정보를 보다 안전하게 보호하고자 개인정보처리방침이 일부 개정될 예정입니다.<br><br>[개정 사항]<br>- 수집하는 개인정보 항목 및 이용 목적의 구체화<br>- 개인정보 파기 절차 및 방법 개선<br><br>시행일자: 2026년 4월 25일<br><br>감사합니다.' },
    { id: 3, title: '1+1 이벤트 상의 전품목 4/19~4/25 진행', date: '2026-04-19', views: 210, important: false, content: 'VARO의 특별한 1+1 혜택!<br><br>봄 시즌 필수 아이템인 상의 전 품목을 대상으로 1+1 이벤트를 진행합니다.<br>한정 수량으로 조기 소진될 수 있으니 서두르세요.<br><br>기간: 2026. 04. 19 ~ 2026. 04. 25' },
    { id: 4, title: '황금연휴 기간 배송 일정 안내 (4/29~5/5)', date: '2026-04-18', views: 156, important: false, content: '황금연휴 기간 배송 및 고객센터 휴무 안내입니다.<br><br>- 배송 마감: 4월 28일(화) 오후 2시 결제 완료 건까지 당일 발송<br>- 휴무 기간: 4월 29일 ~ 5월 5일<br>- 배송 재개: 5월 6일(수)부터 순차 발송<br><br>연휴 기간 동안 주문량이 많아 배송이 평소보다 2~3일 지연될 수 있는 점 양해 부탁드립니다.' },
    { id: 5, title: '앱 업데이트 및 서버 점검 완료 안내', date: '2026-04-12', views: 342, important: false, content: '보다 안정적인 서비스 제공을 위한 시스템 정기 점검이 완료되었습니다.<br><br>현재 모든 결제 및 장바구니 기능이 정상 작동 중입니다.<br>이용에 불편을 드려 죄송합니다.' },
    { id: 6, title: 'VARO 멤버십 등급 전환 기준 변경 안내', date: '2026-04-08', views: 275, important: false, content: '멤버십 등급 산정 기준이 개편되었습니다.<br><br>[변경 후 등급]<br>- 브론즈, 실버, 골드, DIA<br><br>자세한 등급별 혜택은 멤버십 안내 탭에서 확인하실 수 있습니다.' },
    { id: 7, title: '교환/반품 정책 변경 안내 (7일 → 14일 확대)', date: '2026-04-01', views: 198, important: false, content: '고객 만족을 위해 교환/반품 신청 가능 기간을 기존 상품 수령 후 7일에서 **14일**로 대폭 확대합니다.<br><br>더욱 여유롭고 안전한 쇼핑을 즐기세요.' }
  ];

  if (!localStorage.getItem('varo_notices')) {
    localStorage.setItem('varo_notices', JSON.stringify(list));
  }

  container.innerHTML = `
    <div class="tbl-wrap">
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성일</th>
            <th>조회수</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(n => `
            <tr>
              <td>${n.important ? '<span class="badge badge-danger">공지</span>' : n.id}</td>
              <td style="font-weight:${n.important ? '700' : '400'}">${n.title}</td>
              <td>${n.date}</td>
              <td>${n.views}</td>
              <td>
                <button class="btn btn-outline btn-sm" onclick="openNoticeModal(${n.id})">수정</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div style="margin-top: 15px; text-align: right;">
      <button class="btn btn-primary" onclick="openNoticeModal()">공지 등록</button>
    </div>
  `;
}

function openNoticeModal(id = null) {
  const notices = JSON.parse(localStorage.getItem('varo_notices')) || [];
  const notice = id ? notices.find(n => n.id === id) : { title: '', content: '', important: false };
  const isEdit = !!id;

  let modal = document.getElementById('modal-add-notice');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-add-notice';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <span class="modal-title">${isEdit ? '공지사항 수정' : '공지사항 등록'}</span>
        <button class="modal-close" onclick="closeModal('modal-add-notice')">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group" style="margin-bottom: 15px;">
          <label class="form-label" style="display:flex; align-items:center; gap:8px;">
            <input type="checkbox" id="noticeImportant"${notice.important ? ' checked' : ''} style="width:16px; height:16px;">
            중요 공지 (상단 노출)
          </label>
        </div>
        <div class="form-group" style="margin-bottom: 15px;">
          <label class="form-label">제목</label>
          <input type="text" id="noticeTitle" class="form-control" value="${notice.title}" placeholder="공지 제목을 입력하세요.">
        </div>
        <div class="form-group" style="margin-bottom: 15px;">
          <label class="form-label">내용</label>
          <textarea id="noticeContent" class="form-control" style="height: 150px; resize: none;" placeholder="공지 내용을 입력하세요.">${notice.content || ''}</textarea>
        </div>
      </div>
      <div class="modal-footer" style="display: flex; justify-content: space-between;">
        <div>
          ${isEdit ? `<button class="btn btn-danger" onclick="deleteNotice('${id}')">삭제</button>` : ''}
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-outline" onclick="closeModal('modal-add-notice')">취소</button>
          <button class="btn btn-primary" onclick="saveNotice(${id})">${isEdit ? '수정' : '등록'}</button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('open');
}

function saveNotice(id = null) {
  const title = document.getElementById('noticeTitle').value.trim();
  const content = document.getElementById('noticeContent').value.trim();
  const important = document.getElementById('noticeImportant').checked;

  if (!title) {
    showToast('제목을 입력해주세요.', 'error');
    return;
  }

  const notices = JSON.parse(localStorage.getItem('varo_notices')) || [];

  if (id) {
    const idx = notices.findIndex(n => n.id === id);
    if (idx !== -1) {
      notices[idx] = { ...notices[idx], title, content, important };
    }
  } else {
    const newId = notices.length > 0 ? Math.max(...notices.map(n => n.id)) + 1 : 1;
    notices.unshift({ id: newId, title, content, important, date: new Date().toISOString().split('T')[0], views: 0 });
  }

  localStorage.setItem('varo_notices', JSON.stringify(notices));
  closeModal('modal-add-notice');
  showToast(id ? '공지사항이 수정되었습니다.' : '공지사항이 등록되었습니다.', 'success');
  renderAdminNotice();
}

function showCustomConfirm(message, onConfirm) {
  let modal = document.getElementById('modal-custom-confirm');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-custom-confirm';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal" style="width: 400px; max-width: 90vw;">
      <div class="modal-header">
        <span class="modal-title">삭제 확인</span>
        <button class="modal-close" onclick="document.getElementById('modal-custom-confirm').classList.remove('open')">✕</button>
      </div>
      <div class="modal-body" style="padding: 30px 20px; text-align: center; font-size: 15px; font-weight: 500;">
        ${message}
      </div>
      <div class="modal-footer" style="display: flex; justify-content: center; gap: 12px;">
        <button class="btn btn-outline" onclick="document.getElementById('modal-custom-confirm').classList.remove('open')">취소</button>
        <button class="btn btn-danger" id="customConfirmBtn">삭제</button>
      </div>
    </div>
  `;

  modal.querySelector('#customConfirmBtn').onclick = () => {
    modal.classList.remove('open');
    if (onConfirm) onConfirm();
  };

  modal.classList.add('open');
}

function deleteNotice(id) {
  showCustomConfirm('정말 삭제하시겠습니까?<br><span style="color:var(--danger); font-size:12px; font-weight:400;">* 삭제 시 전체 데이터에 즉시 반영됩니다.</span>', () => {
    const notices = JSON.parse(localStorage.getItem('varo_notices')) || [];
    const filtered = notices.filter(n => String(n.id) !== String(id));

    localStorage.setItem('varo_notices', JSON.stringify(filtered));
    closeModal('modal-add-notice');
    showToast('공지사항이 삭제되었습니다.', 'success');
    renderAdminNotice();
  });
}

function renderAdminFAQ() {
  const container = document.getElementById('adminFaqList');
  if (!container) return;

  const list = JSON.parse(localStorage.getItem('varo_faqs')) || [
    { id: 1, category: '주문/결제', question: '주문 후 취소는 언제까지 가능한가요?', answer: '결제 완료 후 <strong>당일 자정</strong> 이전까지 마이페이지 > 주문내역에서 직접 취소 가능합니다. 이후에는 고객센터로 문의 부탁드립니다.' },
    { id: 2, category: '배송', question: '배송기간이 얼마나 걸리나요?', answer: '결제 완료 후 <strong>1~3 영업일</strong> 이내 발송되며, 당일발송 상품은 오후 2시 이전 결제 시 당일 출고됩니다.' },
    { id: 3, category: '교환/반품', question: '교환/반품 신청 방법을 알고 싶어요.', answer: '수령 후 <strong>14일 이내</strong> 마이페이지 > 주문내역 > 교환/반품 신청으로 진행하시거나, 고객센터 채팅으로 문의해 주세요. 상품 불량/오배송의 경우 전액 VARO 부담입니다.' },
    { id: 4, category: '회원/정보', question: '멤버십 등급은 어떻게 올라가나요?', answer: '누적 구매금액 기준으로 자동 승급됩니다.<br>BRONZE(0원~) → SILVER(10만원~) → GOLD(30만원~) → DIA (100만원~)<br>등급별 할인혜택과 포인트 적립률이 달라집니다.' },
    { id: 5, category: '상품', question: '사이즈가 맞지 않으면 교환할 수 있나요?', answer: '네, 단순 변심 사이즈 교환은 <strong>수령 후 14일 이내</strong> 가능합니다. 단, 왕복 배송비는 고객 부담입니다. 상품 태그가 제거되었거나 착용/세탁한 경우는 교환이 불가합니다.' },
    { id: 6, category: '주문/결제', question: '무통장 입금 기한은 얼마인가요?', answer: '주문 완료 후 <strong>24시간 이내</strong> 입금 확인이 되어야 합니다. 기한 내 미입금 시 자동 주문 취소됩니다.' },
    { id: 7, category: '배송', question: '무료배송 기준이 있나요?', answer: '<strong>5만원 이상</strong> 구매 시 무료배송입니다. VARO GOLD 이상 등급은 금액 무관 무료배송 혜택이 적용됩니다.' }
  ];

  if (!localStorage.getItem('varo_faqs')) {
    localStorage.setItem('varo_faqs', JSON.stringify(list));
  }

  container.innerHTML = `
    <div class="tbl-wrap">
      <table>
        <thead>
          <tr>
            <th>분류</th>
            <th>질문</th>
            <th>답변</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(f => `
            <tr>
              <td><span class="badge badge-gray">${f.category}</span></td>
              <td style="font-weight:600">${f.question}</td>
              <td style="font-size:12px; color:var(--gray-500);">${f.answer}</td>
              <td>
                <button class="btn btn-outline btn-sm" onclick="openFaqModal(${f.id})">수정</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div style="margin-top: 15px; text-align: right;">
      <button class="btn btn-primary" onclick="openFaqModal()">FAQ 등록</button>
    </div>
  `;
}

function openFaqModal(id = null) {
  const faqs = JSON.parse(localStorage.getItem('varo_faqs')) || [];
  const faq = id ? faqs.find(f => f.id === id) : { category: '주문/결제', question: '', answer: '' };
  const isEdit = !!id;

  let modal = document.getElementById('modal-add-faq');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-add-faq';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <span class="modal-title">${isEdit ? 'FAQ 수정' : 'FAQ 등록'}</span>
        <button class="modal-close" onclick="closeModal('modal-add-faq')">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group" style="margin-bottom: 15px;">
          <label class="form-label">분류</label>
          <select id="faqCategory" class="form-control">
            <option value="주문/결제"${faq.category === '주문/결제' ? ' selected' : ''}>주문/결제</option>
            <option value="배송"${faq.category === '배송' ? ' selected' : ''}>배송</option>
            <option value="교환/반품"${faq.category === '교환/반품' ? ' selected' : ''}>교환/반품</option>
            <option value="회원/정보"${faq.category === '회원/정보' ? ' selected' : ''}>회원/정보</option>
          </select>
        </div>
        <div class="form-group" style="margin-bottom: 15px;">
          <label class="form-label">질문</label>
          <input type="text" id="faqQuestion" class="form-control" value="${faq.question}" placeholder="질문을 입력하세요.">
        </div>
        <div class="form-group" style="margin-bottom: 15px;">
          <label class="form-label">답변</label>
          <textarea id="faqAnswer" class="form-control" style="height: 120px; resize: none;" placeholder="답변을 입력하세요.">${faq.answer}</textarea>
        </div>
      </div>
      <div class="modal-footer" style="display: flex; justify-content: space-between;">
        <div>
          ${isEdit ? `<button class="btn btn-danger" onclick="deleteFAQ('${id}')">삭제</button>` : ''}
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-outline" onclick="closeModal('modal-add-faq')">취소</button>
          <button class="btn btn-primary" onclick="saveFAQ(${id})">${isEdit ? '수정' : '등록'}</button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('open');
}

function saveFAQ(id = null) {
  const category = document.getElementById('faqCategory').value;
  const question = document.getElementById('faqQuestion').value.trim();
  const answer = document.getElementById('faqAnswer').value.trim();

  if (!question || !answer) {
    showToast('질문과 답변을 모두 입력해주세요.', 'error');
    return;
  }

  const faqs = JSON.parse(localStorage.getItem('varo_faqs')) || [];

  if (id) {
    const idx = faqs.findIndex(f => f.id === id);
    if (idx !== -1) {
      faqs[idx] = { id, category, question, answer };
    }
  } else {
    const newId = faqs.length > 0 ? Math.max(...faqs.map(f => f.id)) + 1 : 1;
    faqs.push({ id: newId, category, question, answer });
  }

  localStorage.setItem('varo_faqs', JSON.stringify(faqs));
  closeModal('modal-add-faq');
  showToast(id ? 'FAQ가 수정되었습니다.' : 'FAQ가 등록되었습니다.', 'success');
  renderAdminFAQ();
}

function deleteFAQ(id) {
  showCustomConfirm('정말 삭제하시겠습니까?<br><span style="color:var(--danger); font-size:12px; font-weight:400;">* 삭제 시 전체 데이터에 즉시 반영됩니다.</span>', () => {
    const faqs = JSON.parse(localStorage.getItem('varo_faqs')) || [];
    const filtered = faqs.filter(f => String(f.id) !== String(id));

    localStorage.setItem('varo_faqs', JSON.stringify(filtered));
    closeModal('modal-add-faq');
    showToast('FAQ가 삭제되었습니다.', 'success');
    renderAdminFAQ();
  });
}

function showBannerTab(type, el) {
  if (el) {
    el.parentElement.querySelectorAll('.inner-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
  }

  const bannerEl = document.getElementById('sub-page-banner');
  const sectionEl = document.getElementById('sub-page-section');
  const categoryEl = document.getElementById('sub-page-category');

  if (bannerEl) bannerEl.style.display = type === 'banner' ? 'block' : 'none';
  if (sectionEl) sectionEl.style.display = type === 'section' ? 'block' : 'none';
  if (categoryEl) categoryEl.style.display = type === 'category' ? 'block' : 'none';

  if (type === 'banner') renderBanners();
  else if (type === 'section' && typeof renderHomeSections === 'function') renderHomeSections();
  else if (type === 'category' && typeof renderCategories === 'function') renderCategories();
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

// 실시간 동기화 브로드캐스트 채널
const adminSyncChannel = new BroadcastChannel('varo_admin_sync');

// 실시간 동기화 리스너 고도화
function handleSync(data) {
  console.log('Real-time Data Change Detected:', data);
  const { type, action } = data || {};

  // 전체 동기화 실행 (API 호출 등)
  syncAllData();

  // 특정 페이지 실시간 즉시 반영 (깜빡임 없이)
  const activePage = localStorage.getItem('activeAdminPage');
  if (type === 'order' && activePage === 'orders') renderOrders();
  if (type === 'notification') {
    renderNotifications();
    if (activePage === 'settings') renderFullNotifications();
  }
}

// 로컬 이벤트 리스너
window.addEventListener('varo:dataChange', (e) => {
  handleSync(e.detail);
  // 다른 탭으로 전파
  adminSyncChannel.postMessage(e.detail);
});

// 다른 탭으로부터의 메시지 수신
adminSyncChannel.onmessage = (e) => {
  handleSync(e.data);
};

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
  const filterCat = document.getElementById('pFilterCategory')?.value || '';
  const filterStatus = document.getElementById('pFilterStatus')?.value || '';
  const filterSort = document.getElementById('pSort')?.value || '최신순';

  // 하이브리드 병합: 더미 데이터 + API 데이터
  const allList = [...(API_PRODUCTS.map(p => {
    const catObj = API_CATEGORIES.find(c => c.id == p.categoryId || c.id === p.category_id);
    return {
      id: p.id,
      name: p.name,
      sku: p.product_code || 'API-PROD',
      category: catObj ? (catObj.name || catObj.label) : (p.categoryId || '기타'),
      price: p.price,
      origPrice: p.price,
      stock: p.stock || 0,
      sold: p.rating || 0,
      status: p.isActive ? '판매중' : '숨김',
      img: p.mainImg || './assets/products/default.jpg'
    };
  })), ...DATA.products];

  let targetList = list || allList;

  if (filterCat) {
    targetList = targetList.filter(p => p.category === filterCat);
  }
  if (filterStatus) {
    targetList = targetList.filter(p => p.status === filterStatus);
  }

  if (filterSort === '최신순') {
    targetList.sort((a, b) => b.id - a.id);
  } else if (filterSort === '판매량순') {
    targetList.sort((a, b) => b.sold - a.sold);
  } else if (filterSort === '가격높은순') {
    targetList.sort((a, b) => b.price - a.price);
  } else if (filterSort === '가격낮은순') {
    targetList.sort((a, b) => a.price - b.price);
  }

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
function filterByStatus(status) {
  renderProducts();
}

function sortBy(sortType) {
  renderProducts();
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

  const tags = document.getElementById('pTags').value;
  const colors = document.getElementById('pColors').value;
  const sizes = document.getElementById('pSizes').value;
  const material = document.getElementById('pMaterial').value;
  const sku = document.getElementById('pSku').value;

  const formData = new FormData();
  formData.append('name', name);
  formData.append('product_code', sku);
  formData.append('price', price);
  if (salePrice) formData.append('sale_price', salePrice);
  if (badge) formData.append('badge', badge);
  formData.append('stock', stock);
  formData.append('category_id', categoryId);
  formData.append('description', description);
  formData.append('tags', tags);
  formData.append('colors', colors);
  formData.append('sizes', sizes);
  formData.append('material', material);

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

  // 신규 필드 (adminadd 연동)
  document.getElementById('pMaterial').value = p.material || '';

  // 상세 옵션 초기화
  productTags = p.tags ? p.tags.split(',').filter(Boolean) : [];
  selectedColors = p.colors ? p.colors.split(',').filter(Boolean) : [];
  selectedSizes = p.sizes ? p.sizes.split(',').filter(Boolean) : [];

  renderTags();
  renderStockTable();

  // 색상 칩 상태 반영
  document.querySelectorAll('.color-swatch-item').forEach(el => {
    const c = el.dataset.color;
    if (selectedColors.includes(c)) el.classList.add('selected');
    else el.classList.remove('selected');
  });

  // 사이즈 칩 상태 반영
  document.querySelectorAll('.size-chip').forEach(el => {
    const s = el.innerText.trim();
    if (selectedSizes.includes(s)) el.classList.add('selected');
    else el.classList.remove('selected');
  });

  openModal('modal-add-product');
}

// ════════════════════════════════════════════════════════
// PRODUCT OPTIONS HELPERS (GLOBAL)
// ════════════════════════════════════════════════════════
let selectedSizes = [];
let selectedColors = [];
let productTags = [];

function toggleSize(el, size) {
  el.classList.toggle('selected');
  if (el.classList.contains('selected')) {
    if (!selectedSizes.includes(size)) selectedSizes.push(size);
  } else {
    selectedSizes = selectedSizes.filter(s => s !== size);
  }
  renderStockTable();
  document.getElementById('pSizes').value = selectedSizes.join(',');
}

function renderStockTable() {
  const wrap = document.getElementById('pStockTableWrap');
  const tbody = document.getElementById('pStockTableBody');
  if (!wrap || !tbody) return;
  if (selectedSizes.length === 0) { wrap.style.display = 'none'; return; }
  wrap.style.display = 'block';
  tbody.innerHTML = selectedSizes.map(s => `
    <tr>
      <td><span class="tag-chip">${s}</span></td>
      <td><input type="number" class="form-control" data-size="${s}" value="0" style="width:80px;"></td>
    </tr>`).join('');
}

function toggleColor(el, color) {
  el.classList.toggle('selected');
  if (el.classList.contains('selected')) {
    if (!selectedColors.includes(color)) selectedColors.push(color);
  } else {
    selectedColors = selectedColors.filter(c => c !== color);
  }
  document.getElementById('pColors').value = selectedColors.join(',');
}

function removeTag(i) {
  productTags.splice(i, 1);
  renderTags();
}

function renderTags() {
  const wrap = document.getElementById('pTagWrap');
  const input = document.getElementById('pTagInput');
  if (!wrap || !input) return;
  const chips = productTags.map((t, i) => `<span class="tag-chip">${t} <i onclick="removeTag(${i})" style="cursor:pointer;margin-left:4px;">&times;</i></span>`).join('');
  wrap.innerHTML = chips;
  wrap.appendChild(input);
  document.getElementById('pTags').value = productTags.join(',');
}

// Tag Input Event (전역 등록을 위해 init 또는 DOMContentLoaded로 이동 권장하나 일단 여기 배치)
document.addEventListener('keydown', (e) => {
  if (e.target.id === 'pTagInput' && e.key === 'Enter') {
    e.preventDefault();
    const val = e.target.value.trim();
    if (val && !productTags.includes(val)) {
      productTags.push(val);
      renderTags();
      e.target.value = '';
    }
  }
});

// Banner & Section Renders
function renderBanners() {
  const list = document.getElementById('bannerSortableList');
  if (!list) return;
  list.innerHTML = [1, 2, 3].map(i => `
  <div class="notif-item" style="background:#fff;border-radius:8px;margin-bottom:8px;border:1px solid var(--gray-100)">
    <div style="width:40px;height:40px;background:var(--surface);border-radius:4px;display:flex;align-items:center;justify-content:center;">${i}</div>
    <div style="flex:1">
      <div style="font-weight:600">메인 배너 0${i}</div>
      <div style="font-size:12px;color:var(--gray-400)">배너 이미지 및 링크 설정</div>
    </div>
    <div style="color:var(--gray-300)">⠿</div>
  </div>`).join('');

  if (window.Sortable) {
    new Sortable(list, { animation: 150 });
  }
}

function renderHomeSections() {
  const list = document.getElementById('homeSectionList');
  if (!list) return;

  // 기본 섹션 + 카테고리별 상품 섹션 결합
  const baseSections = [
    { title: 'NEW IN', desc: '최신 상품 목록 섹션', active: true },
    { title: 'BEST SELLERS', desc: '주간 베스트 상품 섹션', active: true },
    { title: 'COMMUNITY', desc: '고객 리뷰 및 Q&A 섹션', active: true },
    { title: 'BRAND STORY', desc: '브랜드 가치 및 소개 섹션', active: false }
  ];

  const catSections = API_CATEGORIES.filter(c => !c.parent_id).map(c => ({
    title: (c.name || c.label).toUpperCase(),
    desc: `${c.name || c.label} 카테고리 홈 노출 섹션`,
    active: c.is_home || false
  }));

  const sections = [...baseSections, ...catSections];

  list.innerHTML = sections.map(s => `
  <div class="section-card">
    <div class="section-card-header">
      <div style="font-weight:700">${s.title}</div>
      <div class="form-switch"><input type="checkbox" ${s.active ? 'checked' : ''}></div>
    </div>
    <div class="section-card-body">
      <p style="font-size:13px;color:var(--gray-400)">${s.desc}</p>
    </div>
  </div>`).join('');
}



function renderFullNotifications() {
  const list = document.getElementById('notif-full-list');
  if (!list) return;
  list.innerHTML = [1, 2, 3, 4, 5].map(i => `
  <div class="notif-item unread">
    <div class="avatar" style="background:var(--accent);color:#fff;">N</div>
    <div style="flex:1">
      <div style="font-weight:600">새로운 주문이 발생했습니다. (ORD-2025-00${i})</div>
      <div style="font-size:12px;color:var(--gray-400)">방금 전 · 시스템 자동 알림</div>
    </div>
    <div class="badge badge-info">NEW</div>
  </div>`).join('');
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
      window.dispatchEvent(new CustomEvent('varo:dataChange', { detail: { type: 'order', id, action: 'updateStatus' } }));
    } else {
      const o = DATA.orders.find(x => x.id === id);
      if (o) o.status = newStatus;
      renderOrders();
      showToast(`주문 상태가 "${newStatus}"로 변경되었습니다.`, 'success');
      window.dispatchEvent(new CustomEvent('varo:dataChange', { detail: { type: 'order', id, action: 'updateStatus' } }));
    }
  } catch (e) {
    const o = DATA.orders.find(x => x.id === id);
    if (o) o.status = newStatus;
    renderOrders();
    showToast(`주문 상태가 "${newStatus}"로 변경되었습니다.`, 'success');
    window.dispatchEvent(new CustomEvent('varo:dataChange', { detail: { type: 'order', id, action: 'updateStatus' } }));
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
      <td style="font-weight:600;font-family:'Inter';color:var(--accent)">${fmt(m.point)} P</td>
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
  const container = document.getElementById('reviewList');
  if (!container) return;

  const list = JSON.parse(localStorage.getItem('varo_reviews')) || [
    { id: 1, product: '오버핏 코튼 티셔츠', customer: '김민준', rating: 5, content: '사이즈도 딱 맞고 소재가 너무 좋아요! 재구매 의사 있습니다.', date: '2026-04-22', replied: true, reply: '소중한 리뷰 감사드립니다 😊', hasPhoto: true, img: './assets/products/P001_main.png' },
    { id: 2, product: '슬림 데님 팬츠', customer: '이서연', rating: 4, content: '핏이 예쁜데 허리가 조금 작아요. 한 사이즈 업 추천합니다.', date: '2026-04-21', replied: false, hasPhoto: false },
    { id: 3, product: '크롭 후드 집업', customer: '박지훈', rating: 3, content: '색상이 사진이랑 조금 다른 것 같아요.', date: '2026-04-20', replied: false, hasPhoto: false },
    { id: 4, product: '버킷햇', customer: '최수아', rating: 5, content: '가성비 최고! 친구한테도 추천했어요.', date: '2026-04-19', replied: true, reply: '추천해 주셔서 정말 감사합니다!', hasPhoto: false },
    { id: 5, product: '린넨 셔츠', customer: '정태양', rating: 2, content: '배송이 너무 늦었어요. 품질은 괜찮네요.', date: '2026-04-18', replied: false, hasPhoto: false }
  ];

  if (!localStorage.getItem('varo_reviews')) {
    localStorage.setItem('varo_reviews', JSON.stringify(list));
  }

  container.innerHTML = list.map(r => `
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

  const categoryData = [
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
    { id: 20, parent_id: 10, name: '데님셔츠', slug: 'denimshirt', sort_order: 4 },
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
    { id: 15, parent_id: null, name: '1+1 EVENT', slug: 'event', sort_order: 10 },
    { id: 16, parent_id: null, name: 'COMMUNITY', slug: 'community', sort_order: 11 }
  ];

  const parents = categoryData.filter(c => !c.parent_id).sort((a, b) => a.sort_order - b.sort_order);
  const children = categoryData.filter(c => c.parent_id).sort((a, b) => a.sort_order - b.sort_order);

  // 모달 셀렉트박스 업데이트
  const catParentSelect = document.getElementById('catParent');
  if (catParentSelect) {
    catParentSelect.innerHTML = '<option value="">없음 (최상위)</option>' +
      parents.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  }

  const pCatSelect = document.getElementById('pCategory');
  const pFilterSelect = document.getElementById('pFilterCategory');

  if (pCatSelect || pFilterSelect) {
    let modalOptions = '<option value="">선택</option>';
    let filterOptions = '<option value="">전체 카테고리</option>';

    parents.forEach(p => {
      modalOptions += `<option value="${p.id}" style="font-weight:700;">${p.name}</option>`;
      filterOptions += `<option value="${p.name}" style="font-weight:700;">${p.name}</option>`;

      children.filter(c => c.parent_id == p.id).forEach(c => {
        modalOptions += `<option value="${c.id}">&nbsp;&nbsp;↳ ${c.name}</option>`;
        filterOptions += `<option value="${c.name}">&nbsp;&nbsp;↳ ${c.name}</option>`;
      });
    });

    if (pCatSelect) pCatSelect.innerHTML = modalOptions;
    if (pFilterSelect) pFilterSelect.innerHTML = filterOptions;
  }

  // 아코디언 렌더링
  container.innerHTML = parents.map(p => {
    const parentChildren = children.filter(c => c.parent_id == p.id);
    return `
      <div class="category-item" data-id="${p.id}">
        <div class="category-parent" onclick="toggleAccordion(this)">
          <div class="drag-handle parent-handle">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/>
            </svg>
          </div>
          <span class="toggle-icon">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
          </span>
          <span class="name">${p.name} <small style="color:var(--gray-400); font-weight:400; margin-left:8px;">(${p.slug})</small></span>
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
              <span class="name">${c.name} <small style="color:var(--gray-400); margin-left:6px;">(${c.slug})</small></span>
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
  console.log('Rendering Banners...', { API_BANNERS, DATA_BANNERS: DATA.banners });
  const container = document.getElementById('bannerSortableList');
  if (!container) {
    console.warn('bannerSortableList container not found');
    return;
  }

  // Ensure visibility
  container.style.minHeight = '200px';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';

  // Merge API data with local default data
  const apiItems = Array.isArray(API_BANNERS) ? API_BANNERS : [];
  const defaultItems = Array.isArray(DATA.banners) ? DATA.banners : [];
  const allBanners = [...apiItems, ...defaultItems.filter(db => !apiItems.some(ab => ab.id === db.id))];

  console.log('Merged Banners:', allBanners);

  if (allBanners.length === 0) {
    container.innerHTML = '<div class="tbl-empty">등록된 배너가 없습니다.</div>';
    return;
  }

  container.innerHTML = allBanners.map(b => `
    <div class="banner-item-card" onclick="selectBannerForPreview(${b.id})" style="display:flex !important; visibility:visible !important; opacity:1 !important;">
      <div class="drag-handle" style="padding-right:10px; cursor:grab;">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/>
          <circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>
        </svg>
      </div>
      <div class="banner-thumb" style="width:80px; height:50px; background:#eee; border-radius:4px; overflow:hidden;">
        <img src="${b.img_url}" alt="banner" style="width:100%; height:100%; object-fit:cover;">
      </div>
      <div class="banner-info" style="flex:1; padding-left:10px;">
        <div class="title" style="font-weight:600; font-size:14px;">${b.title || '제목 없음'}</div>
        <div class="desc" style="font-size:12px; color:#999;">${b.link_url || '링크 없음'}</div>
      </div>
      <div class="banner-actions" onclick="event.stopPropagation()" style="display:flex; align-items:center; gap:10px;">
        <label class="ios-switch">
          <input type="checkbox" ${b.is_active !== false ? 'checked' : ''} onchange="toggleBannerStatus(${b.id}, this.checked)">
          <span class="ios-slider"></span>
        </label>
        <button class="btn btn-outline btn-sm" onclick="editBanner(${b.id})">수정</button>
        <button class="btn btn-danger btn-sm" onclick="deleteBanner(${b.id})">삭제</button>
      </div>
    </div>`).join('');

  // Auto-select first banner if none selected
  if (allBanners.length > 0) {
    setTimeout(() => selectBannerForPreview(allBanners[0].id), 100);
  }
}

function selectBannerForPreview(id) {
  const banner = API_BANNERS.find(b => b.id === id) || DATA.banners.find(b => b.id === id);
  if (!banner) return;

  const content = document.getElementById('bannerPreviewContent');
  if (content) {
    content.classList.remove('preview-placeholder');
    content.innerHTML = `<img src="${banner.img_url}" style="width:100%; height:100%; object-fit:cover;">`;
  }

  // Highlight active card
  document.querySelectorAll('.banner-item-card').forEach(el => el.style.border = '1px solid var(--gray-100)');
  const selectedCard = [...document.querySelectorAll('.banner-item-card')].find(el => el.getAttribute('onclick')?.includes(id));
  if (selectedCard) selectedCard.style.border = '2px solid #b59670';
}

async function toggleBannerStatus(id, isActive) {
  try {
    const res = await API.banners.update(id, { is_active: isActive });
    if (res.success) {
      showToast(`배너가 ${isActive ? '활성화' : '비활성'} 되었습니다.`, 'success');
      syncAllData();
    }
  } catch (e) { showToast('오류: ' + e.message, 'error'); }
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
  const settings = JSON.parse(localStorage.getItem('varo_settings')) || {
    noti_order: true,
    noti_stock: true,
    noti_user: true,
    noti_qna: true,
    pay_card: true,
    pay_kakao: true,
    pay_naver: true,
    pay_bank: true
  };

  const notiItems = [
    ['신규 주문 알림', 'noti_order', settings.noti_order],
    ['재고 부족 알림', 'noti_stock', settings.noti_stock],
    ['회원 가입 알림', 'noti_user', settings.noti_user],
    ['1:1 문의 알림', 'noti_qna', settings.noti_qna],
  ];

  const notiHtml = notiItems.map(([label, key, checked]) => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--gray-100);">
      <div>
        <div style="font-weight:600; font-size:14px;">${label}</div>
      </div>
      <label class="switch">
        <input type="checkbox"${checked ? ' checked' : ''} onchange="updateSetting('${key}', this.checked)">
        <span class="slider"></span>
      </label>
    </div>`).join('');

  const notiContainer = document.getElementById('notiSettings');
  if (notiContainer) notiContainer.innerHTML = notiHtml;

  const payItems = [
    ['신용카드 결제', 'pay_card', settings.pay_card],
    ['카카오페이', 'pay_kakao', settings.pay_kakao],
    ['네이버페이', 'pay_naver', settings.pay_naver],
    ['무통장 입금', 'pay_bank', settings.pay_bank],
  ];

  const payHtml = payItems.map(([label, key, checked]) => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--gray-100);">
      <div>
        <div style="font-weight:600; font-size:14px;">${label}</div>
      </div>
      <label class="switch">
        <input type="checkbox"${checked ? ' checked' : ''} onchange="updateSetting('${key}', this.checked)">
        <span class="slider"></span>
      </label>
    </div>`).join('');

  const payContainer = document.getElementById('paymentSettings');
  if (payContainer) payContainer.innerHTML = payHtml;
}

function updateSetting(key, value) {
  const settings = JSON.parse(localStorage.getItem('varo_settings')) || {
    noti_order: true,
    noti_stock: true,
    noti_user: true,
    noti_qna: true,
    pay_card: true,
    pay_kakao: true,
    pay_naver: true,
    pay_bank: true
  };
  settings[key] = value;
  localStorage.setItem('varo_settings', JSON.stringify(settings));
  showToast('설정이 변경되었습니다.', 'success');

  if (key.startsWith('noti_')) {
    renderNotifications();
    if (typeof renderFullNotifications === 'function') renderFullNotifications();
  }
}

// ════════════════════════════════════════════════════════
// Q&A 관리 (커뮤니티 varo_qna 연동)
// ════════════════════════════════════════════════════════
function getQnaData() {
  const data = JSON.parse(localStorage.getItem('varo_qna') || '[]');
  if (data.length === 0 && !localStorage.getItem('varo_qna')) {
    const defaultQna = [
      { id: 1001, subject: '배송지 변경 가능한가요?', content: '방금 주문했는데 배송지를 변경하고 싶습니다. 가능한가요?', author: '김철수', date: '2026-04-28', status: 'pending', isSecret: false, replies: [] },
      { id: 1002, subject: '재입고 일정 문의', content: '품절된 캔버스 스니커즈 재입고 언제 되나요?', author: '이영희', date: '2026-04-27', status: 'done', isSecret: true, replies: [{ author: 'VARO (관리자)', content: '안녕하세요 고객님, 해당 상품은 5월 초 재입고 예정입니다.', date: '2026-04-27', isAdmin: true }] }
    ];
    localStorage.setItem('varo_qna', JSON.stringify(defaultQna));
    return defaultQna;
  }
  return data;
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

  const settings = JSON.parse(localStorage.getItem('varo_settings')) || {
    noti_order: true,
    noti_stock: true,
    noti_user: true,
    noti_qna: true
  };

  // 설정에 따라 알림 필터링
  const filteredNotifs = NOTIFICATIONS.filter(n => {
    if (n.category === 'order' && !settings.noti_order) return false;
    if (n.category === 'stock' && !settings.noti_stock) return false;
    if (n.category === 'user' && !settings.noti_user) return false;
    if (n.category === 'qna' && !settings.noti_qna) return false;
    return true;
  });

  if (filteredNotifs.length === 0) {
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

  list.innerHTML = filteredNotifs.map(n => `
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
    dot.style.display = filteredNotifs.some(n => n.unread) ? 'block' : 'none';
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
  setTimeout(() => {
    renderNotifications();
    renderFullNotifications();
  }, 1000); // 데이터 로드 후 여유있게 실행
});

function renderFullNotifications() {
  const container = document.getElementById('notif-full-list');
  if (!container) return;

  const settings = JSON.parse(localStorage.getItem('varo_settings')) || {
    noti_order: true,
    noti_stock: true,
    noti_user: true,
    noti_qna: true
  };

  const filteredNotifs = NOTIFICATIONS.filter(n => {
    if (n.category === 'order' && !settings.noti_order) return false;
    if (n.category === 'stock' && !settings.noti_stock) return false;
    if (n.category === 'user' && !settings.noti_user) return false;
    if (n.category === 'qna' && !settings.noti_qna) return false;
    return true;
  });

  if (filteredNotifs.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:40px; color:#888;">새로운 알림이 없습니다.</div>`;
    return;
  }

  container.innerHTML = `
    <div class="tbl-wrap">
      <table>
        <thead>
          <tr>
            <th>구분</th>
            <th>제목</th>
            <th>내용</th>
            <th>시간</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          ${filteredNotifs.map(n => `
            <tr style="${n.unread ? 'font-weight:600; background:var(--gray-50);' : ''}">
              <td>
                <span class="badge badge-${n.category === 'order' ? 'success' : n.category === 'stock' ? 'danger' : 'warning'}">
                  ${n.category === 'order' ? '주문' : n.category === 'stock' ? '재고' : '회원'}
                </span>
              </td>
              <td>${n.title}</td>
              <td style="font-size:13px; color:var(--gray-600);">${n.desc}</td>
              <td style="font-size:12px; color:var(--gray-400);">${n.time}</td>
              <td>
                ${n.unread ? `<button class="btn btn-outline btn-sm" onclick="readNotification(${n.id}); renderFullNotifications();">읽음</button>` : '<span style="color:var(--gray-300); font-size:12px;">읽음</span>'}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}
