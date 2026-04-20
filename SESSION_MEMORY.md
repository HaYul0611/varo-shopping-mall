# VARO 프로젝트 세션 메모리
> 이 파일은 매 작업 세션 시작 시 반드시 읽어야 합니다.
> Claude에게: "VARO 작업 이어서 해줘" → 이 파일부터 읽고 시작

---

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 브랜드 | VARO (바로) |
| 컨셉 | 남친룩·커플룩·캐주얼룩·하객룩 / 20~30대 한국 남성 |
| 슬로건 | "지금, 바로 당신의 스타일" |
| 기술스택 | 프론트: HTML/CSS/Vanilla JS / 백엔드: Node.js+Express+SQLite |
| GitHub | https://github.com/[유저명]/VARO-ShoppingMall |
| 발표일 | 2026-04-28 |

---

## 디렉토리 구조 (완성형)

```
VARO-ShoppingMall/
├── package.json          ← npm start로 서버 시작
├── server.js             ← Express 메인 서버 (포트 3000)
├── .env                  ← JWT_SECRET, PORT 등
├── .gitignore
├── README.md
│
├── db/
│   ├── database.js       ← SQLite 연결 + 테이블 생성
│   └── seed.js           ← 초기 데이터 삽입 (npm run seed)
│
├── routes/
│   ├── auth.js           ← POST /api/auth/register, /login, /logout
│   ├── products.js       ← GET/POST/PUT/DELETE /api/products
│   ├── orders.js         ← GET/POST /api/orders
│   ├── cart.js           ← GET/POST/DELETE /api/cart
│   └── users.js          ← GET/PUT /api/users/me
│
├── middleware/
│   └── auth.js           ← JWT 토큰 검증 미들웨어
│
└── public/               ← 프론트엔드 정적 파일
    └── varo/
        ├── index.html    ← 메인 홈
        ├── shop.html
        ├── product.html
        ├── cart.html
        ├── checkout.html
        ├── community.html
        ├── login.html
        ├── signup.html
        ├── mypage.html
        ├── event.html    ← 이벤트/기획전
        ├── admin.html    ← 관리자 대시보드
        ├── js/
        │   ├── api.js         ← ★ 백엔드 API 통신 모듈 (신규)
        │   ├── data.js        ← 로컬 폴백 데이터
        │   ├── main.js
        │   ├── index.js
        │   ├── shop.js
        │   ├── product.js
        │   ├── cart.js
        │   ├── auth.js
        │   ├── pages.js
        │   ├── mega-menu.js
        │   ├── community-page.js
        │   ├── utils.js
        │   ├── event.js       ← (신규)
        │   └── admin.js       ← (신규)
        └── styles/
            ├── variables.css
            ├── reset.css
            ├── main.css
            ├── header.css
            ├── mega-menu.css
            ├── index.css
            ├── shop.css
            ├── product.css
            ├── community.css
            ├── components.css
            ├── event.css      ← (신규)
            └── admin.css      ← (신규)
```

---

## 테스트 계정

| 역할 | 이메일 | 비밀번호 |
|------|--------|---------|
| 일반 사용자 | demo@varo.com | varo2026 |
| 관리자 | admin@varo.com | varo2026admin |

---

## API 엔드포인트 목록

### 인증 (Auth)
- `POST /api/auth/register` — 회원가입
- `POST /api/auth/login` — 로그인 → JWT 반환
- `GET  /api/auth/me` — 내 정보 조회 (토큰 필요)

### 상품 (Products)
- `GET    /api/products` — 전체 목록 (쿼리: category, filter, style, sort)
- `GET    /api/products/:id` — 단일 상품
- `POST   /api/products` — 등록 (관리자 전용)
- `PUT    /api/products/:id` — 수정 (관리자 전용)
- `DELETE /api/products/:id` — 삭제 (관리자 전용)

### 장바구니 (Cart)
- `GET    /api/cart` — 내 장바구니
- `POST   /api/cart` — 상품 추가
- `PUT    /api/cart/:id` — 수량 변경
- `DELETE /api/cart/:id` — 항목 삭제
- `DELETE /api/cart` — 전체 비우기

### 주문 (Orders)
- `POST /api/orders` — 주문 생성
- `GET  /api/orders` — 내 주문 목록
- `GET  /api/orders/:id` — 주문 상세
- `PUT  /api/orders/:id/status` — 상태 변경 (관리자)

### 사용자 (Users)
- `GET /api/users` — 전체 목록 (관리자)
- `PUT /api/users/me` — 프로필 수정

### 리뷰 (Reviews)
- `GET  /api/reviews?productId=` — 상품 리뷰
- `POST /api/reviews` — 리뷰 작성

---

## 완료 현황 (세션마다 업데이트)

### ✅ 완료
- [ ] 프론트엔드 HTML 10개 (index/shop/product/cart/checkout/community/login/signup/mypage)
- [ ] 프론트엔드 CSS (variables/reset/main/header/mega-menu/index/shop/product/community/components)
- [ ] 프론트엔드 JS (data/main/index/shop/product/cart/auth/pages/mega-menu/community-page/utils)
- [ ] 백엔드 server.js
- [ ] 백엔드 database.js + seed.js
- [ ] 백엔드 routes (auth/products/orders/cart/users)
- [ ] 프론트엔드 api.js (백엔드 연동)

### 🔧 미완성 (다음 세션에서 작업)
- [ ] event.html + event.js + event.css
- [ ] admin.html + admin.js + admin.css
- [ ] index.html 로컬이미지 → Unsplash URL 교체

---

## 핵심 컨벤션 (반드시 준수)

### 이미지
- **절대 AI 생성 이미지 사용 금지**
- Unsplash URL 형식만 사용: `https://images.unsplash.com/photo-{ID}?w=600&h=800&fit=crop&q=85`
- index.html 로컬 경로 `./assets/trendy/xxx.png` → Unsplash로 교체 필요

### CSS 로드 순서 (모든 HTML 동일)
```html
reset.css → variables.css → main.css → header.css → mega-menu.css → [페이지별].css
```

### JS 로드 순서 (모든 HTML 동일)
```html
api.js → data.js → utils.js → main.js → mega-menu.js → [페이지별].js
```

### API 호출 방식
- 모든 백엔드 통신은 `js/api.js`의 함수 사용
- 로컬스토리지는 백엔드 fallback 용도로만 사용

---

## 로컬 실행 방법

```bash
git clone https://github.com/[유저명]/VARO-ShoppingMall
cd VARO-ShoppingMall
npm install
npm run seed      # DB 초기 데이터 삽입
npm start         # http://localhost:3000 으로 접속
```

---

## 발표 시연 순서 (15분)

1. `http://localhost:3000/varo/` 홈 오픈 (3패널 슬라이더)
2. 카테고리 메뉴 hover → 이미지 패널
3. 회원가입 → 로그인 (demo@varo.com / varo2026)
4. 상품 탐색 → 커플룩 필터 → 장바구니 담기
5. cart.html → checkout.html → 주문완료
6. mypage.html → 멤버십 GOLD 카드
7. community.html → FAQ/리뷰/멤버십 탭
8. admin.html → 상품 등록/수정/삭제 CRUD 시연

---

## 작업 세션 로그

| 날짜 | 작업 내용 | 담당 |
|------|-----------|------|
| 4/20 | 프로젝트 분석, 백엔드 구조 설계 | Claude |
| 4/20 | server.js, database.js, routes 완성 | Claude |
| - | event.html, admin.html 예정 | - |
