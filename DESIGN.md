# VARO — 설계 문서 (Design Specification)  
> 버전: v1.0.0 | 작성일: 2026-04-15 | 상태: Draft

---

## 1. 브랜드 아이덴티티

| 항목 | 내용 |
|------|------|
| 브랜드명 | **VARO** (바로) |
| 컨셉 | 인스타그램형 소통 커뮤니티 남성 쇼핑몰 |
| 타겟 | 10대 후반 ~ 30대 초반 / 트렌디하고 감도 있는 남성 |
| 디자인 철학 | High-density · Minimalist · Airy |
| 브랜드 무드 | Clean · Editorial · Streetwear-adjacent |

---

## 2. 프로젝트 구조

```
varo/
├── index.html              # 메인 홈
├── shop.html               # 쇼핑 목록
├── product.html            # 상품 상세
├── community.html          # 커뮤니티 피드 (인스타그램형)
├── cart.html               # 장바구니
├── login.html              # 로그인
├── signup.html             # 회원가입
├── event.html              # 이벤트/프로모션 (추가 예정)
├── mypage.html             # 마이페이지/회원정보 (추가 예정)
│
├── styles/
│   ├── reset.css           # CSS 초기화
│   ├── variables.css       # 디자인 토큰 (색상, 폰트, 간격)
│   ├── main.css            # 공통 레이아웃 (헤더, 푸터, 그리드)
│   ├── shop.css            # 쇼핑 목록 페이지
│   ├── product.css         # 상품 상세 페이지
│   ├── community.css       # 커뮤니티 페이지
│   ├── cart.css            # 장바구니 페이지
│   └── auth.css            # 로그인 / 회원가입
│
├── js/
│   ├── data.js             # 상품·카테고리·커뮤니티 데이터
│   ├── utils.js            # 공통 유틸리티 함수
│   ├── main.js             # 공통 로직 (헤더·장바구니 카운터·모바일 메뉴)
│   ├── shop.js             # 상품 목록 필터·정렬·렌더링
│   ├── product.js          # 상품 상세 (갤러리·사이즈·리뷰)
│   ├── community.js        # 커뮤니티 피드·좋아요·댓글
│   ├── cart.js             # 장바구니 CRUD·수량 조절·합계
│   └── auth.js             # 클라이언트 사이드 유효성 검사
│
└── assets/
    ├── images/             # 실제 이미지 배치 경로
    └── icons/              # SVG 아이콘
```

---

## 3. 디자인 토큰

### 3-1. 색상 팔레트

| 토큰 | 값 | 용도 |
|------|----|------|
| `--color-bg` | `#F8F7F4` | 기본 배경 (따뜻한 오프화이트) |
| `--color-black` | `#0D0D0D` | 주요 텍스트·아이콘 |
| `--color-gray-dark` | `#3A3A3A` | 서브 텍스트 |
| `--color-gray-mid` | `#7A7A7A` | 플레이스홀더·캡션 |
| `--color-gray-light` | `#C8C8C4` | 구분선 |
| `--color-border` | `#EAEAE6` | 카드 테두리·인풋 |
| `--color-accent` | `#B8956A` | CTA·강조 (웜 카라멜) |
| `--color-white` | `#FFFFFF` | 카드·모달 배경 |
| `--color-surface` | `#F2F1EE` | 섹션 배경 |

### 3-2. 타이포그래피

| 토큰 | 값 |
|------|----|
| `--font-primary` | `'Pretendard', 'Noto Sans KR', sans-serif` |
| `--tracking-tight` | `-0.04em` |
| `--tracking-normal` | `-0.02em` |
| `--leading-tight` | `1.2` |
| `--leading-normal` | `1.6` |

### 3-3. 간격 시스템 (8px Base)

```
--space-1: 4px   --space-2: 8px   --space-3: 12px
--space-4: 16px  --space-5: 24px  --space-6: 32px
--space-7: 48px  --space-8: 64px  --space-9: 96px
```

---

## 4. 그리드 & 반응형 브레이크포인트

| 구간 | 브레이크포인트 | 상품 열 수 |
|------|---------------|-----------|
| Mobile | `< 768px` | 2열 |
| Tablet | `768px ~ 1199px` | 3열 |
| Desktop | `≥ 1200px` | 4열 |
| Wide | `≥ 1440px` | 4열 (max-width 고정) |

**이미지 비율**: 3:4 (세로형, 전신샷 최적화)

---

## 5. 페이지별 기능 명세

### index.html — 메인 홈
- Hero 섹션: 풀스크린 슬라이더 (자동 + 수동)
- NEW IN 섹션: 최신 상품 8개 그리드
- COMMUNITY 섹션: 커뮤니티 게시물 미리보기 6개
- BRAND STORY 섹션: 브랜드 철학 텍스트 + 이미지

### shop.html — 쇼핑 목록
- 카테고리 필터 탭 (전체 / 상의 / 하의 / 아우터 / 악세서리)
- 정렬 셀렉트 (신상순 / 인기순 / 낮은가격 / 높은가격)
- 무한 스크롤 or 페이지네이션
- 상품 카드: 호버 시 서브 이미지 전환 + 찜하기

### product.html — 상품 상세
- 이미지 갤러리 (메인 + 썸네일 슬라이더)
- 상품명 / 가격 / 품번 / 소재
- 사이즈 선택 (XS·S·M·L·XL)
- 수량 선택 + 장바구니 담기 / 바로구매
- 스타일링 탭 (상품설명 / 사이즈정보 / 배송·반품)
- 관련 상품 추천

### community.html — 커뮤니티
- 인스타그램형 3열 피드 (모바일 2열)
- 게시물 모달: 이미지 + 텍스트 + 좋아요 + 댓글 + 태그된 상품
- 팔로우·좋아요 인터랙션 (로컬스토리지 기반 시뮬레이션)

### cart.html — 장바구니
- 선택 상품 목록 (이미지·이름·사이즈·수량·가격)
- 수량 증감 / 개별 삭제 / 전체 삭제
- 금액 요약 (소계·배송비·합계)
- 주문하기 CTA

### login.html / signup.html — 인증
- Vanilla JS 클라이언트 유효성 검사
- 실시간 인풋 피드백 (에러 메시지)
- 소셜 로그인 UI (카카오·네이버·구글 — 프론트엔드 UI만)
- XSS 방지: 모든 사용자 입력 `textContent` 처리

---

## 6. 보안 설계 원칙

| 위협 | 대응 방안 |
|------|----------|
| XSS | 모든 동적 렌더링은 `textContent` / `createElement` 사용, `innerHTML` 지양 |
| CSRF | 주문·회원가입 폼에 Hidden Token 필드 구조 포함 (서버 연동 시 활성화) |
| 민감 데이터 노출 | 클라이언트 스토리지에 비밀번호·카드번호 절대 저장 금지 |
| 입력 검증 | 정규식 기반 서버사이드 검증 병행 권고 |
| 의존성 취약점 | 외부 CDN은 SRI (Subresource Integrity) hash 적용 |

---

## 7. 성능 최적화

- **Lazy Loading**: 모든 `<img>`에 `loading="lazy"` 적용
- **CLS 방지**: 이미지 컨테이너에 3:4 `aspect-ratio` 고정
- **폰트 최적화**: `font-display: swap` 적용
- **Critical CSS**: `variables.css` + `reset.css`를 `<head>` 최상단 로드
- **이벤트 위임**: 리스트 아이템 이벤트는 부모에 위임하여 메모리 절약

---

## 8. 안티그래비티 이식 가이드

1. 모든 파일 최상단에 `// 경로:` 주석 포함 → 자동 폴더 정리 호환
2. CSS 변수는 `variables.css` 단일 파일에서 관리 → 테마 변경 즉시 반영
3. 데이터 레이어(`data.js`)와 로직 레이어 완전 분리 → API 교체 시 `data.js`만 수정
4. 각 페이지 JS는 해당 HTML에서만 로드 → 불필요한 스크립트 실행 방지

---

## 9. 추후 확장 계획

- [ ] 백엔드 API 연동 (Node.js + Express / Supabase)
- [ ] 멤버십 등급제 (BASIC/SILVER/GOLD/VIP)
- [ ] 실제 결제 모듈 통합 (토스페이먼츠)
- [ ] 검색 기능 고도화 (Fuse.js 퍼지 검색)
- [ ] PWA 전환 (Service Worker + Web App Manifest)
- [ ] 다크모드 지원 (`prefers-color-scheme` + 토글)
