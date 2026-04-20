# VARO — 남성 패션 커뮤니티 쇼핑몰

> 남친룩·커플룩·캐주얼룩·하객룩 전문 | 20~30대 한국 남성

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프론트엔드 | HTML5 · CSS3 · Vanilla JS (ES6+) |
| 백엔드 | Node.js · Express.js |
| 데이터베이스 | SQLite (better-sqlite3) |
| 인증 | JWT (jsonwebtoken) + bcryptjs |

## 로컬 실행

```bash
# 1. 의존성 설치
npm install

# 2. 초기 데이터 삽입 (최초 1회)
npm run seed

# 3. 서버 시작
npm start

# 접속: http://localhost:3000/varo/
```

## 테스트 계정

| 역할 | 이메일 | 비밀번호 |
|------|--------|---------|
| 일반 사용자 (GOLD) | demo@varo.com | varo2026 |
| 관리자 | admin@varo.com | varo2026admin |

## 주요 기능

### 사용자
- 회원가입 / 로그인 (JWT 인증)
- 상품 탐색 (카테고리 · 스타일테마 · 정렬 필터)
- 장바구니 담기 → 주문 → 완료
- 마이페이지 (멤버십 등급 · 주문내역)
- 커뮤니티 (공지·FAQ·Q&A·리뷰·이벤트·멤버십)

### 관리자 (`/varo/admin.html`)
- 대시보드 (통계)
- 상품 CRUD (등록·수정·삭제)
- 주문 상태 관리
- 회원 목록

## 멤버십 등급

| 등급 | 누적 구매 | 할인 | 포인트 |
|------|-----------|------|--------|
| BASIC | 0원~ | 0% | 1% |
| SILVER | 10만원~ | 5% | 3% |
| GOLD | 30만원~ | 10% | 5% |
| VARO VIP | 100만원~ | 15% | 7% |

## API 엔드포인트

```
POST /api/auth/register   — 회원가입
POST /api/auth/login      — 로그인
GET  /api/products        — 상품 목록 (쿼리: category, filter, style, sort)
POST /api/products        — 상품 등록 (관리자)
PUT  /api/products/:id    — 상품 수정 (관리자)
DELETE /api/products/:id  — 상품 삭제 (관리자)
GET  /api/cart            — 장바구니 조회
POST /api/cart            — 장바구니 추가
POST /api/orders          — 주문 생성
GET  /api/orders          — 주문 목록
PUT  /api/orders/:id/status — 주문 상태 변경 (관리자)
```
