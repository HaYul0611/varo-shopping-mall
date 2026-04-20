# VARO — 상용화 완성 로드맵
> 컨셉: 남친룩·커플룩·캐주얼룩·하객룩 / 20~30대 한국 남성 트렌드
> 발표: 2026년 4월 28일 (남은 기간 8일)

---

## 📋 현재 상태 분석

**✅ 완성된 것**
- 폴더 구조 및 파일 구성 완료
- 헤더 (흰색, 카테고리 탭)
- 메가메뉴 CSS/JS
- 커뮤니티 페이지 (6탭)
- 마이페이지 기본 구조

**❌ 문제점 (지금 당장 해결)**
1. `data.js` 이미지 — 컨셉과 안 맞는 랜덤 사진들
2. `index.html` 메인 화면 — 룩플 스타일 미적용
3. `index.js` — 상품 그리드 렌더 로직 없음
4. 각 페이지 JS 로직 미연결

---

## 🚨 지금 당장 할 것 (오늘 안에)

### STEP 1 — data.js 교체 (가장 중요)

안티그래비티에 복붙:
```
varo/js/data.js 파일을 방금 받은 새 data.js로 완전히 교체해줘.

교체 후 확인:
1. VARO_CONFIG에 BRAND_NAME, STYLE_THEMES, TEST_USER 있는지
2. PRODUCTS 배열에 16개 상품 있는지
3. HERO_SLIDES에 panels 배열 3개씩 있는지
4. window.VARO_DATA, window.VARO_CONFIG 노출 확인
5. 모든 mainImg/subImg가 images.unsplash.com URL인지

확인 후 보고해줘.
```

### STEP 2 — index.html + index.css + index.js 교체

안티그래비티에 복붙:
```
아래 3개 파일을 새 버전으로 교체해줘:
- varo/index.html
- varo/styles/index.css
- varo/js/index.js

교체 후 Live Server로 index.html 열고
아래 항목 확인해줘:

1. 상단에 3패널 슬라이더가 보이는가?
   (좌우 인물 사진 + 중앙 텍스트 오버레이)
2. 마퀴 텍스트가 흐르는가?
3. NEW IN 상품 이미지가 패션 사진인가?
   (오류: 랜덤 이미지 / 정상: 실제 패션 사진)
4. 각 섹션이 차례로 보이는가?
5. 콘솔 에러가 없는가?

에러 있으면 내용 알려줘.
```

### STEP 3 — CSS 로드 순서 최종 확인

모든 HTML 파일에 이 순서대로:
```html
<link rel="stylesheet" href="./styles/reset.css">
<link rel="stylesheet" href="./styles/variables.css">
<link rel="stylesheet" href="./styles/main.css">
<link rel="stylesheet" href="./styles/header.css">
<link rel="stylesheet" href="./styles/mega-menu.css">
<link rel="stylesheet" href="./styles/[페이지별].css">
```

모든 HTML 파일 `</body>` 전:
```html
<script src="./js/data.js"></script>
<script src="./js/utils.js"></script>
<script src="./js/main.js"></script>
<script src="./js/mega-menu.js"></script>
<script src="./js/[페이지별].js"></script>
```

---

## 📅 8일 스프린트 플랜

---

### Day 1 — 4/20 (오늘)
**목표: index.html 완성 + data.js 컨셉 적용**

```
[지시 1] data.js 교체 + 브라우저 확인
[지시 2] index.html 3패널 슬라이더 동작 확인
[지시 3] 상품 카드 이미지가 실제 패션 사진인지 확인
```

---

### Day 2 — 4/21
**목표: shop.html 필터/정렬 완성**

안티그래비티 복붙:
```
varo/shop.html + varo/js/shop.js를 완성해줘.

[필요 기능]
1. URL 파라미터 처리:
   - ?category=outer/shirt/top/knit/bottom/setup/shoes/acc
   - ?filter=new/best/sale/fast
   - ?style=boyfriend/couple/casual/formal  ← 컨셉 필터 (신규)
   - ?sub=jacket/coat/... (서브카테고리)

2. 필터 탭 (상단):
   전체 / 아우터 / 셔츠 / 상의 / 니트 / 하의 / 세트업 / 슈즈 / 악세서리

3. 스타일 테마 태그 버튼 (탭 아래):
   전체 / 남친룩 / 커플룩 / 캐주얼룩 / 하객룩

4. 정렬: 신상품순/인기순/낮은가격/높은가격/리뷰많은순

5. 상품 카드 grid (PC 4열 / 태블릿 3열 / 모바일 2열)

6. 각 카드에 스타일 테마 태그 표시
   (남친룩, 커플룩 등 뱃지)

7. 페이지네이션 (12개씩)

8. 빈 결과 UI

varo/js/data.js의 PRODUCTS[].styles 배열 활용할 것.
완료 후 shop.html?style=couple 로 확인해줘.
```

---

### Day 3 — 4/22
**목표: product.html 상품 상세 완성**

안티그래비티 복붙:
```
varo/product.html + varo/js/product.js를 완성해줘.

[필요 기능]
1. URL ?id= 파라미터로 data.js PRODUCTS에서 조회
2. 갤러리: 메인 이미지 + 썸네일 (클릭 시 전환)
3. 색상 스와치 선택 (hex 기반 원형)
4. 사이즈 선택 (품절 표시 포함)
5. 수량 조절 (최소 1개)
6. 장바구니 담기 → localStorage(varo_cart)
7. 바로 구매 → cart.html로 이동
8. 멤버십 등급별 할인가 표시:
   SILVER 5% / GOLD 10% / VARO VIP 15%
9. 탭:
   - 상품정보 (소재/관리/설명)
   - 리뷰 (data.js REVIEWS 활용)
   - 배송·교환반품 안내
10. "이 스타일로 입은 멤버들" (COMMUNITY_POSTS에서
    taggedProducts에 해당 상품 ID 있는 것 최대 3개)
11. 관련 상품 (같은 categoryId, 같은 styles 우선)
12. 모바일 하단 sticky CTA 바

product.html?id=P001 로 확인해줘.
```

---

### Day 4 — 4/23
**목표: cart.html + checkout.html**

안티그래비티 복붙 (cart):
```
varo/cart.html + varo/js/pages.js의 CartPage를 완성해줘.

[기능]
1. localStorage varo_cart 데이터 렌더링
2. 전체선택 체크박스
3. 수량 증감, 개별 삭제, 선택 삭제
4. 무료배송 게이지 (50,000원 기준)
5. 상품금액 / 배송비 / 할인 / 합계 자동계산
6. 빈 카트 UI
7. "주문하기" → checkout.html

cart.html을 브라우저로 열고 확인해줘.
```

안티그래비티 복붙 (checkout):
```
varo/checkout.html을 새로 만들어줘.

[구성]
1. 주문자 정보 (이름/전화/이메일)
2. 배송지 (이름/전화/주소/상세주소/메모)
3. 결제수단 선택 UI:
   - 신용/체크카드
   - 카카오페이
   - 네이버페이
   - 무통장입금 (우리은행 000-000000-00-000 VARO)
4. 최종 주문 요약 (상품목록+금액)
5. 주문완료 처리:
   - localStorage varo_orders에 주문 추가
   - varo_cart 비우기
   - 완료 메시지 + 3초 후 index.html 이동
6. 유효성 검사 (이름/전화/이메일 필수)

styles/checkout.css + js/checkout.js 함께 만들어줘.
```

---

### Day 5 — 4/24
**목표: login + signup + mypage 완성**

안티그래비티 복붙 (login):
```
varo/login.html + varo/js/pages.js AuthPage를 완성해줘.

[기능]
1. 이메일/비밀번호 입력 + 실시간 유효성 검사
2. 로그인 성공:
   - localStorage varo_user에 저장
   - {name, email, grade, point, purchases:0}
3. 테스트 계정 자동 입력 버튼:
   "테스트 계정으로 로그인" 클릭 시
   demo@varo.com / varo2026 자동 입력
4. 소셜 로그인 버튼 UI (카카오/네이버/구글)
5. 로그인 후 mypage.html 또는 이전 페이지로

varo/VARO_CONFIG.TEST_USER 값 활용.
```

안티그래비티 복붙 (mypage):
```
varo/mypage.html + styles/mypage.css를 완성해줘.
(미로그인 시 login.html 리다이렉트)

[구성]
좌측 사이드바:
- 프로필 (이름+등급배지)
- 메뉴: 주문내역/위시리스트/프로필수정/로그아웃

우측 메인:
1. 멤버십 카드 (검정 배경):
   - 이름 + 등급 배지
   - 포인트/쿠폰/기본할인율
   - 다음 등급까지 프로그레스바
2. MY 통계 (주문/배송중/찜)
3. 등급 혜택 비교표 4단계
4. 최근 주문 내역 (varo_orders 활용)

VARO_CONFIG.MEMBERSHIP_TIERS 활용.
```

---

### Day 6 — 4/25
**목표: event.html + admin.html**

안티그래비티 복붙 (event):
```
varo/event.html을 새로 만들어줘.

[구성]
1. 히어로 배너
2. Flash Deal 카운트다운 타이머 (오늘 자정까지)
3. 진행중 이벤트 4개 카드
4. 1+1 이벤트 상품 (data.js isEvent:true인 상품)
5. GOLD+ 전용 이벤트
6. 종료 이벤트 아카이브

styles/event.css + js/event.js 함께 만들어줘.
```

안티그래비티 복붙 (admin):
```
varo/admin.html을 새로 만들어줘.

관리자 로그인: admin@varo.com / varo2026admin

[대시보드 기능]
좌측 메뉴:
- 대시보드 (통계)
- 상품 관리
- 주문 관리
- 커뮤니티 관리

대시보드:
- 총 상품수 / 오늘 주문 / 회원 수 / 총 매출 카드

상품 관리:
- PRODUCTS 테이블 (이름/가격/카테고리/배지)
- 인라인 편집 → localStorage 저장

주문 관리:
- varo_orders 목록
- 상태 변경 (준비중/배송중/완료)

커뮤니티 관리:
- COMMUNITY_POSTS 목록
- 신고된 게시물 처리 UI

styles/admin.css + js/admin.js 함께 만들어줘.
```

---

### Day 7 — 4/26
**목표: 반응형 완성 + 전체 통합 테스트**

안티그래비티 복붙:
```
전체 페이지 반응형 점검해줘.

점검 해상도: 375px / 768px / 1440px

점검 파일:
index, shop, product, cart, checkout,
community, mypage, event, admin

발견된 깨진 항목 모두 수정해줘.

추가로 통합 테스트:
시나리오 1 (구매):
index → 상의 탭 → 커플룩 필터 → 후드 클릭 →
사이즈/색상 선택 → 장바구니 → checkout → 완료

시나리오 2 (로그인):
login (테스트 계정) → mypage → 멤버십 확인 → 로그아웃

각 단계 콘솔 에러 없는지 확인 + 수정.
```

---

### Day 8 — 4/27
**목표: 발표 준비 완성**

안티그래비티 복붙:
```
발표 최종 준비해줘.

1. 샘플 주문 데이터 2개 삽입:
   index.html 로드 시 localStorage에 없으면 자동 삽입:
   varo_orders = [{
     id: "ORD-2026-001",
     date: "2026.04.18",
     items: [{name:"더블 브레스티드 울 코트", price:198000, qty:1, size:"M", color:"카멜"}],
     total: 198000,
     status: "배송중"
   }]

2. 모든 페이지 title 통일:
   index.html  → "VARO — 남친룩·커플룩·하객룩"
   shop.html   → "쇼핑 — VARO"
   product.html→ "상품 상세 — VARO"
   cart.html   → "장바구니 — VARO"
   community.html → "커뮤니티 — VARO"
   mypage.html → "마이페이지 — VARO"
   event.html  → "이벤트 — VARO"
   admin.html  → "관리자 — VARO"

3. console.log 전부 제거

4. 이미지 alt 텍스트 모두 채우기

5. 404 에러 없는지 전체 링크 확인
```

---

### 4/28 ★ 발표일

**시연 순서 (15분 기준)**

```
[1분] VARO 브랜드 소개
  → index.html 홈 오픈
  → 3패널 슬라이더 (남친룩/커플룩/하객룩 컨셉 설명)

[2분] 카테고리 메뉴 시연
  → 상의 탭 hover → 이미지 패널 메뉴
  → 커뮤니티 hover → 6개 메뉴 패널

[3분] 쇼핑 플로우
  → shop.html → "커플룩" 필터 클릭
  → 후드 카드 클릭 → product.html
  → 멤버십 할인가 설명 (GOLD 10%)
  → 사이즈 선택 → 장바구니 담기

[2분] 구매 플로우
  → cart.html (무료배송 게이지)
  → checkout.html → 주문 완료

[2분] 커뮤니티
  → community.html
  → 공지사항/FAQ/리뷰/멤버십 탭 전환
  → 커플룩 게시물 클릭 → 모달

[2분] 마이페이지
  → mypage.html (GOLD 등급 카드)
  → 멤버십 혜택 설명

[2분] 관리자
  → admin.html
  → 상품 관리 / 주문 상태 변경 시연

[1분] 마무리
  → 백엔드 연동 계획 설명
  → Supabase 연동 예정
```

---

## 🔧 안티그래비티 이미지 문제 해결법

안티그래비티가 이상한 이미지를 만들어올 때:

```
varo/js/data.js에서 모든 mainImg, subImg를
아래 규칙으로 Unsplash URL로 교체해줘.

URL 형식:
https://images.unsplash.com/photo-{ID}?w=600&h=800&fit=crop&q=85

사용할 이미지 ID 목록:
(코트/자켓)  1539109136881-3be0616acf4b
(블레이저)   507679799797-b90bd27e86da
(셔츠1)      596755094514-f87e34085b2c
(셔츠2)      607345366928-199ea26cfe3e
(티셔츠1)    521572163474-6864f9cf17ab
(후드)       556821840-3a63f8550d64
(니트)       489987707025-afc232f7ea0f
(카고팬츠)   624378439575-d8705ad7ae80
(슬랙스)     519315901367-f34ff9154487
(데님)       603252109612-6d5fee16a54d
(로퍼)       542291026-7eec264c27ff
(가방)       548036161-2b1a0e5b4a7b
(롱슬리브)   562157873-818bc0726f68

data.js 교체 후 브라우저 새로고침해서
상품 이미지가 실제 패션 사진인지 확인해줘.
```

---

## 📊 완료 체크리스트

| 파일 | 기능 | 완료? |
|------|------|-------|
| data.js | 16개 상품 + 컨셉 태그 | □ |
| index.html | 3패널 슬라이더 + 5개 섹션 | □ |
| shop.html | 필터+정렬+스타일테마 | □ |
| product.html | 갤러리+멤버십+리뷰 | □ |
| cart.html | 선택+수량+합계 | □ |
| checkout.html | 폼+결제선택+완료처리 | □ |
| login.html | 유효성+localStorage | □ |
| signup.html | 유효성+약관 | □ |
| mypage.html | 멤버십카드+주문내역 | □ |
| event.html | 타이머+이벤트상품 | □ |
| community.html | 6탭 완전 동작 | □ |
| admin.html | 상품/주문 관리 | □ |

---

## 💡 프론트엔드 → 백엔드 전략

**4/28 발표: 프론트엔드만으로 완성 시연 (localStorage 기반)**

발표 후 백엔드 연동 (Supabase 권장):
```
Supabase 연동 순서 (발표 후):
1. supabase.com 가입 (무료)
2. 테이블 생성: products, orders, users, reviews
3. data.js → Supabase fetch로 교체
4. localStorage → Supabase realtime으로 교체
5. 장바구니/위시리스트 서버 동기화
6. 커뮤니티 좋아요 실시간 동기화
```

**4/28 발표에서 백엔드 언급 방법:**
"현재 프론트엔드 완성 단계이며, Supabase를 통한 실시간 데이터 연동이 다음 단계로 계획되어 있습니다. 주문/회원/상품 데이터는 localStorage를 활용한 클라이언트 시뮬레이션으로 동작하며, 실제 서비스에서는 REST API를 통해 서버와 연동됩니다."
