# VARO — 남성 패션 커뮤니티 쇼핑몰

> 20 ~ 30대 트렌드 세터를 위한 세련된 남성 패션 커뮤니티 쇼핑몰

---

## 🏛 프로젝트 개요
**VARO**는 단순한 쇼핑몰을 넘어, 인스타그램 스타일의 커뮤니티 피드와 프리미엄 셀렉트 샵이 결합된 하이엔드 이커머스 플랫폼입니다. 20~30대 남성들의 세련된 스타일 제안과 소통을 기술적으로 뒷받침합니다.

## 🛠 기술 스택
- **Back-end**: Node.js, Express.js
- **Database**: **MySQL (InnoDB)** - 대용량 트랜잭션 및 정황성 보장
- **Authentication**: JWT (Stateless), BCrypt (암호화)
- **Front-end**: Vanilla JS, CSS3 (Variables), HTML5 (Semantic)
- **Security**: Prepared Statements, SQL Injection 방지, JWT 인증 미들웨어

## 🚀 로컬 실행 방법
```bash
# 1. 의존성 설치
npm install

# 2. .env 설정 (DB_PASSWORD 필수)
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=1234
# DB_NAME=varo

# 3. 데이터베이스 스키마 및 초기 데이터 삽입
node db/seed.js

# 4. 서버 기동
npm start

# 접속 URL: http://localhost:3000/varo/
```

## 💎 핵심 멤버십 체계 (6단계)
- **고객 등급**: `bronze` (기본), `silver`, `gold`, `dia` (VIP)
- **운영진 권한**: `매니저`, `관리자`

## 📦 주요 기능
- **통합 체크아웃**: 회원 및 비회원(비밀번호 보호) 주문 프로세스 지원.
- **커뮤니티 피드**: 스타일링 리뷰 및 소셜 상호작용.
- **자동 데이터 정리**: 24시간 주기로 만료된 비회원 장바구니 데이터를 정리하는 스케줄러 탑재.

---
© 2026 VARO Project. Sophisticated & Professional.
