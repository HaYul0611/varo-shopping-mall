// 경로: js/data.js
// VARO 2026 — 남친룩·커플룩·캐주얼룩·하객룩 컨셉 쇼핑몰 데이터
// ⚠ 이 파일이 전체 쇼핑몰의 유일한 데이터 소스입니다.
// ⚠ 이미지: Unsplash 실제 패션 사진 (한국 20~30대 남성 트렌드 컨셉)

'use strict';

/* ══════════════════════════════════════════════
   ⚙ 전역 설정
══════════════════════════════════════════════ */
const VARO_CONFIG = {
  BRAND_NAME: 'VARO',
  BRAND_SLOGAN: '지금, 바로 당신의 스타일',
  BRAND_DESC: '남친룩부터 하객룩까지 — 20·30 남성의 모든 무드',
  DELIVERY_FEE: 3000,
  FREE_SHIP_THRESHOLD: 50000,
  ITEMS_PER_PAGE: 12,
  HERO_AUTOPLAY_MS: 4000,
  TEST_USER: {
    email: 'demo@varo.com',
    password: 'varo2026',
    name: '김민준',
    grade: 'GOLD',
    point: 12400,
  },
  ADMIN: {
    email: 'admin@varo.com',
    password: 'varo2026admin',
  },
  MEMBERSHIP_TIERS: [
    { id: 'bronze', label: 'BRONZE', min: 0, max: 99999, discount: 0, points: 1, color: '#A87C6C' },
    { id: 'silver', label: 'SILVER', min: 100000, max: 299999, discount: 5, points: 3, color: '#A0A0A0' },
    { id: 'gold', label: 'GOLD', min: 300000, max: 999999, discount: 10, points: 5, color: '#D4AF37' },
    { id: 'dia', label: 'DIAMOND', min: 1000000, max: 2999999, discount: 15, points: 7, color: '#00D1FF' },
    { id: 'manager', label: 'MANAGER', min: 3000000, max: 9999999, discount: 20, points: 10, color: '#D1D1FF' },
    { id: 'admin', label: 'ADMIN', min: 10000000, max: Infinity, discount: 0, points: 0, color: '#1B2B4B' },
  ],
};

/* ══════════════════════════════════════════════
   카테고리
══════════════════════════════════════════════ */
const CATEGORIES = [
  { id: 'all', label: '전체', parentId: null },
  { id: 'outer', label: '아우터', parentId: null },
  { id: 'shirt', label: '셔츠', parentId: null },
  { id: 'top', label: '상의', parentId: null },
  { id: 'knit', label: '니트', parentId: null },
  { id: 'bottom', label: '하의', parentId: null },
  { id: 'setup', label: '세트업', parentId: null },
  { id: 'shoes', label: '슈즈', parentId: null },
  { id: 'acc', label: '악세서리', parentId: null },
  // 예시 서브 카테고리 (필요 시 추가)
  { id: 'coat', label: '코트', parentId: 'outer' },
  { id: 'jacket', label: '자켓', parentId: 'outer' },
];

/* ══════════════════════════════════════════════
   스타일 테마
══════════════════════════════════════════════ */
const STYLE_THEMES = [
  { id: 'boyfriend', label: '남친룩', color: '#4A7FA5' },
  { id: 'couple', label: '커플룩', color: '#D96B3C' },
  { id: 'casual', label: '캐주얼룩', color: '#4A8A5A' },
  { id: 'formal', label: '하객룩', color: '#BFA14A' },
];

/* ══════════════════════════════════════════════
   상품 데이터 (16개)
══════════════════════════════════════════════ */
const PRODUCTS = [
  {
    id: 'P001', categoryId: 'outer', styles: ['boyfriend', 'formal'],
    brand: 'VARO', name: '더블 브레스티드 울 코트', price: 198000, salePrice: null, badge: 'best',
    mainImg: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=800&fit=crop&q=85',
    subImg: 'https://images.unsplash.com/photo-1507679799797-b90bd27e86da?w=600&h=800&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1507679799797-b90bd27e86da?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600&h=800&fit=crop&q=85',
    ],
    colors: [{ name: '카멜', hex: '#C8956A' }, { name: '블랙', hex: '#1C1A16' }, { name: '그레이', hex: '#7A7672' }],
    sizes: ['S', 'M', 'L', 'XL'], soldOutSizes: ['S'],
    description: '하객룩·데이트룩 모두 완벽한 더블 브레스티드 코트.', material: '70% Wool, 30% Polyester', care: '드라이클리닝 전용',
    rating: 4.9, reviewCount: 214, isWishlisted: false,
  },
  {
    id: 'P002', categoryId: 'outer', styles: ['boyfriend', 'casual'],
    brand: 'VARO', name: '오버사이즈 데님 자켓', price: 128000, salePrice: 98000, badge: 'sale',
    mainImg: 'https://images.unsplash.com/photo-1521509313432-84081efbc727?w=600&h=800&fit=crop&q=85', // 청자켓 (Denim Jacket)
    subImg: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=800&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1514473776127-61e2dc1dded3?w=600&h=800&fit=crop&q=85',
    ],
    colors: [{ name: '라이트블루', hex: '#A8C4D8' }, { name: '인디고', hex: '#2A3F6A' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], soldOutSizes: [],
    description: '어떤 하의와도 자연스럽게 어울리는 오버핏 데님 자켓.', material: '100% Cotton Denim', care: '30°C 이하 세탁',
    rating: 4.6, reviewCount: 87, isWishlisted: false,
  },
  {
    id: 'P003', categoryId: 'outer', styles: ['casual', 'boyfriend'],
    brand: 'VARO', name: '나일론 퀄팅 패딩 재킷', price: 148000, salePrice: null, badge: 'new',
    mainImg: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop&q=85',
    subImg: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop&q=85',
    ],
    colors: [{ name: '블랙', hex: '#1C1A16' }, { name: '올리브', hex: '#4A5240' }],
    sizes: ['S', 'M', 'L', 'XL'], soldOutSizes: [],
    description: '경량 나일론 퀄팅 패딩. 캐주얼 데이트룩과 완벽한 조합.', material: '100% Nylon', care: '30°C 이하 단독 세탁',
    rating: 4.7, reviewCount: 43, isWishlisted: false,
  },
  {
    id: 'P004', categoryId: 'shirt', styles: ['boyfriend', 'couple', 'casual'],
    brand: 'VARO', name: '스트라이프 오버핏 셔츠', price: 72000, salePrice: null, badge: 'new',
    mainImg: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop&q=85',
    subImg: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&h=800&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&h=800&fit=crop&q=85',
    ],
    colors: [{ name: '블루', hex: '#6B8FAF' }, { name: '화이트', hex: '#F5F5F0' }],
    sizes: ['S', 'M', 'L', 'XL'], soldOutSizes: [],
    description: '커플룩 베스트 스트라이프 셔츠.', material: '100% Cotton', care: '30°C 이하 단독 세탁',
    rating: 4.8, reviewCount: 156, isWishlisted: false,
  },
  {
    id: 'P005', categoryId: 'shirt', styles: ['formal', 'boyfriend'],
    brand: 'VARO', name: '화이트 포플린 드레스 셔츠', price: 68000, salePrice: null, badge: null,
    mainImg: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&h=800&fit=crop&q=85',
    subImg: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop&q=85',
    images: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&h=800&fit=crop&q=85'],
    colors: [{ name: '화이트', hex: '#F5F5F0' }],
    sizes: ['S', 'M', 'L', 'XL'], soldOutSizes: [],
    description: '하객룩 필템. 깔끔한 포플린 소재.', material: '100% Cotton Poplin', care: '30°C 이하 세탁',
    rating: 4.5, reviewCount: 92, isWishlisted: false,
  },
  {
    id: 'P006', categoryId: 'top', styles: ['casual', 'boyfriend'],
    brand: 'VARO', name: '코튼 오버핏 헤비 티셔츠', price: 42000, salePrice: null, badge: 'new',
    mainImg: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop&q=85',
    subImg: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=800&fit=crop&q=85',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop&q=85'],
    colors: [{ name: '블랙', hex: '#1C1A16' }, { name: '화이트', hex: '#F5F5F0' }],
    sizes: ['S', 'M', 'L', 'XL'], soldOutSizes: [],
    description: '남친룩·커플룩 데일리 기본템.', material: '100% Cotton', care: '건조기 금지',
    rating: 4.7, reviewCount: 328, isWishlisted: false,
  },
  {
    id: 'P007', categoryId: 'top', styles: ['casual', 'couple'],
    brand: 'VARO', name: '스웨트 오버사이즈 후드', price: 88000, salePrice: null, badge: 'best',
    mainImg: 'https://images.unsplash.com/photo-1556821840-03a63f8550d64?w=600&h=800&fit=crop&q=85',
    subImg: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop&q=85',
    images: ['https://images.unsplash.com/photo-1556821840-03a63f8550d64?w=600&h=800&fit=crop&q=85'],
    colors: [{ name: '차콜', hex: '#3A3A3A' }, { name: '아이보리', hex: '#F0EDE4' }],
    sizes: ['S', 'M', 'L', 'XL'], soldOutSizes: ['S'],
    description: '커플룩 1위! 프리미엄 플리스 후드.', material: '80% Cotton, 20% Poly', care: '단독 세탁',
    rating: 4.9, reviewCount: 203, isWishlisted: false,
  },
  {
    id: 'P008', categoryId: 'knit', styles: ['boyfriend', 'formal'],
    brand: 'VARO', name: '하프집업 골지 니트', price: 98000, salePrice: 78000, badge: 'sale',
    mainImg: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&h=800&fit=crop&q=85',
    subImg: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop&q=85',
    images: ['https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&h=800&fit=crop&q=85'],
    colors: [{ name: '오트밀', hex: '#D4C9B8' }, { name: '브라운', hex: '#7A5C44' }],
    sizes: ['S', 'M', 'L', 'XL'], soldOutSizes: [],
    description: '데이트룩·남친룩 최애 니트.', material: '80% Cotton, 20% Nylon', care: '손세탁 권장',
    rating: 4.8, reviewCount: 176, isWishlisted: false,
  },
  {
    id: 'P009', categoryId: 'bottom', styles: ['casual', 'boyfriend'],
    brand: 'VARO', name: '와이드 카고 팬츠', price: 89000, salePrice: 69000, badge: 'sale',
    mainImg: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop&q=85',
    subImg: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop&q=85',
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop&q=85'],
    colors: [{ name: '카키', hex: '#6B6B47' }, { name: '블랙', hex: '#1C1A16' }],
    sizes: ['S', 'M', 'L', 'XL'], soldOutSizes: [],
    description: '넉넉한 와이드 핏 카고 팬츠.', material: '98% Cotton, 2% Span', care: '뒤집어서 세탁',
    rating: 4.5, reviewCount: 89, isWishlisted: false,
  },
  {
    id: 'P010', categoryId: 'bottom', styles: ['formal', 'boyfriend'],
    brand: 'VARO', name: '슬림 테이퍼드 슬랙스', price: 82000, salePrice: null, badge: null,
    mainImg: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&h=800&fit=crop&q=85',
    subImg: 'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=600&h=800&fit=crop&q=85',
    images: ['https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&h=800&fit=crop&q=85'],
    colors: [{ name: '차콜', hex: '#3A3A3A' }, { name: '네이비', hex: '#1A2744' }],
    sizes: ['28', '30', '32', '34'], soldOutSizes: ['28'],
    description: '하객룩·남친룩 기본 슬랙스.', material: 'Poly/Rayon Blend', care: '중온 다림질',
    rating: 4.4, reviewCount: 102, isWishlisted: false,
  },
  {
    id: 'P011', categoryId: 'bottom', styles: ['casual', 'couple'],
    brand: 'VARO', name: '셀비지 데님 와이드 팬츠', price: 96000, salePrice: null, badge: 'best',
    mainImg: 'https://images.unsplash.com/photo-1603252109612-6d5fee16a54d?w=600&h=800&fit=crop&q=85',
    subImg: 'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&h=800&fit=crop&q=85',
    images: ['https://images.unsplash.com/photo-1603252109612-6d5fee16a54d?w=600&h=800&fit=crop&q=85'],
    colors: [{ name: '미드블루', hex: '#4A7399' }, { name: '블랙', hex: '#1A1A1A' }],
    sizes: ['28', '30', '32', '34'], soldOutSizes: [],
    description: '12oz 프리미엄 셀비지 데님.', material: '100% Cotton', care: '자연 건조',
    rating: 4.7, reviewCount: 148, isWishlisted: false,
  },
  {
    id: 'P012', categoryId: 'setup', styles: ['formal', 'couple'],
    brand: 'VARO', name: '체크 울 블레이저 세트업', price: 298000, salePrice: 238000, badge: 'sale',
    mainImg: 'https://images.unsplash.com/photo-1507679799797-b90bd27e86da?w=600&h=800&fit=crop&q=85',
    subImg: 'https://images.unsplash.com/photo-1549062572-544a64fb0c56?w=600&h=800&fit=crop&q=85',
    images: ['https://images.unsplash.com/photo-1507679799797-b90bd27e86da?w=600&h=800&fit=crop&q=85'],
    colors: [{ name: '그레이체크', hex: '#7A7A7A' }],
    sizes: ['S', 'M', 'L'], soldOutSizes: ['S'],
    description: '하객룩 완성 세트업.', material: 'Wool Blend', care: '드라이클리닝',
    rating: 4.8, reviewCount: 67, isWishlisted: false,
  },
  {
    id: 'P013',
    categoryId: 'shoes',
    styles: ['boyfriend', 'formal'],
    brand: 'VARO',
    name: '청키 러버솔 로퍼',
    price: 128000,
    salePrice: null,
    badge: null,
    isEvent: false,
    mainImg: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop&q=85',
    subImg: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=800&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=800&fit=crop&q=85',
    ],
    colors: [
      { name: '블랙', hex: '#1C1A16' },
      { name: '탄', hex: '#B8956A' },
    ],
    sizes: ['250', '255', '260', '265', '270', '275', '280'],
    soldOutSizes: ['275', '280'],
    description: '하객룩·남친룩 완성 슈즈. 청키 솔로 키도 살리고 스타일도 완성.',
    material: 'Upper: Genuine Leather / Outsole: Rubber',
    care: '가죽 전용 클리너 사용',
    rating: 4.6, reviewCount: 77,
    isWishlisted: false,
  },
  {
    id: 'P014',
    categoryId: 'acc',
    styles: ['casual', 'couple'],
    brand: 'VARO',
    name: '소프트 레더 미니 크로스백',
    price: 158000,
    salePrice: null,
    badge: 'new',
    isEvent: false,
    mainImg: 'https://images.unsplash.com/photo-1554062614-69755137dbad?w=600&h=800&fit=crop&q=85',
    subImg: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1548036161-2b1a0e5b4a7b?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop&q=85',
    ],
    colors: [
      { name: '블랙', hex: '#1C1A16' },
      { name: '탄', hex: '#B8956A' },
    ],
    sizes: ['FREE'],
    soldOutSizes: [],
    description: '커플룩 완성 아이템.',
    material: 'Leather',
    care: '가죽 전용 크림',
    rating: 4.9, reviewCount: 31,
    isWishlisted: false,
  },
  {
    id: 'P015',
    categoryId: 'acc',
    styles: ['casual', 'couple'],
    brand: 'VARO',
    name: '스테인리스 체인 브레이슬릿',
    price: 48000,
    salePrice: null,
    badge: 'new',
    isEvent: true,
    mainImg: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=800&fit=crop&q=85',
    subImg: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&h=800&fit=crop&q=85',
    images: ['https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&h=800&fit=crop&q=85'],
    colors: [{ name: '실버', hex: '#C0C0C0' }],
    sizes: ['FREE'], soldOutSizes: [],
    description: '커플룩 소품 인기 1위.', material: 'Stainless Steel', care: '물기 제거',
    rating: 4.7, reviewCount: 52, isWishlisted: false,
  },
  {
    id: 'P016',
    categoryId: 'top',
    styles: ['casual', 'couple'],
    brand: 'VARO',
    name: '피그먼트 롱슬리브 티셔츠',
    price: 46000,
    salePrice: null,
    badge: 'new',
    isEvent: true,
    mainImg: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=800&fit=crop&q=85', // 롱슬리브
    subImg: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop&q=85',
    images: ['https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=800&fit=crop&q=85'],
    colors: [{ name: '빈티지블랙', hex: '#2A2A2A' }],
    sizes: ['S', 'M', 'L', 'XL'], soldOutSizes: [],
    description: '커플룩 인기 폭발 롱슬리브.', material: '100% Cotton', care: '단독 세탁',
    rating: 4.6, reviewCount: 118, isWishlisted: false,
  },
];

/* ══════════════════════════════════════════════
   히어로 슬라이드 (3분할 레이아웃 적용)
══════════════════════════════════════════════ */
const HERO_SLIDES = [
  {
    id: 'H_JAN', tag: '01 JANUARY',
    panels: ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&h=800&fit=crop&q=85'] // 3분할 합본 대용 이미지
  },
  {
    id: 'H_FEB', tag: '02 FEBRUARY',
    panels: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1549062572-544a64fb0c56?w=800&h=1200&fit=crop&q=85'
    ]
  },
  {
    id: 'H_MAR', tag: '03 MARCH',
    panels: ['./assets/lookbook/mar_spring.png'] // 3분할 합본 (캠퍼스룩)
  },
  {
    id: 'H_APR', tag: '04 APRIL',
    panels: ['./assets/lookbook/apr_guest.png'] // 3분할 합본 (하객룩)
  },
  {
    id: 'H_MAY', tag: '05 MAY',
    panels: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1200&fit=crop&q=85'
    ]
  },
  {
    id: 'H_JUN', tag: '06 JUNE',
    panels: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&h=1200&fit=crop&q=85'
    ]
  },
  {
    id: 'H_JUL', tag: '07 JULY',
    panels: ['./assets/lookbook/jul_summer.png'] // 3분할 합본 (린넨 폴로)
  },
  {
    id: 'H_AUG', tag: '08 AUGUST',
    panels: ['./assets/lookbook/aug_summer.png'] // 3분할 합본 (썸머 캐주얼)
  },
  {
    id: 'H_SEP', tag: '09 SEPTEMBER',
    panels: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=1200&fit=crop&q=85'
    ]
  },
  {
    id: 'H_OCT', tag: '10 OCTOBER',
    panels: [
      'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&h=1200&fit=crop&q=85'
    ]
  },
  {
    id: 'H_NOV', tag: '11 NOVEMBER',
    panels: [
      'https://images.unsplash.com/photo-1549062572-544a64fb0c56?w=800&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1507679799797-b90bd27e86da?w=800&h=1200&fit=crop&q=85'
    ]
  },
  {
    id: 'H_DEC', tag: '12 DECEMBER',
    panels: ['./assets/lookbook/dec_winter.png'] // 3분할 합본 (헤비 패딩)
  },
];

const COMMUNITY_POSTS = [
  { id: 'C001', userId: 'u_minjun', username: '@minjun_style', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&h=80&fit=crop&q=80', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=750&fit=crop&q=80', caption: '남친룩 완성 🤍', styles: ['boyfriend'], taggedProducts: ['P004'], likes: 412, comments: 28, timeAgo: '2시간 전', isLiked: false },
  { id: 'C002', userId: 'u_taehyun', username: '@t.look', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&q=80', img: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&h=900&fit=crop&q=80', caption: '커플룩 인증 💑', styles: ['couple'], taggedProducts: ['P007'], likes: 834, comments: 67, timeAgo: '4시간 전', isLiked: false },
];

const REVIEWS = {
  P001: [
    { id: 'R001', user: '민준 *', rating: 5, date: '2026.04.10', body: '하객룩으로 완벽합니다.', sizeInfo: 'M 구매' },
  ],
};

const MARQUEE_ITEMS = [
  'FREE SHIPPING OVER 50,000 KRW',
  '상의 전품목 1+1 이벤트',
  '남친룩 · 커플룩 · 하객룩 전문',
];

const SORT_OPTIONS = [
  { value: 'newest', label: '신상품순' },
  { value: 'popular', label: '인기순' },
];

if (typeof window !== 'undefined') {
  window.VARO_DATA = {
    CATEGORIES, STYLE_THEMES, PRODUCTS,
    HERO_SLIDES, MARQUEE_ITEMS,
    COMMUNITY_POSTS, REVIEWS,
    SORT_OPTIONS,
  };
  window.VARO_CONFIG = VARO_CONFIG;
}

// End of data.js

