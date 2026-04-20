// 경로: js/data.js
// VARO 2026 — 남친룩·커플룩·캐주얼룩·하객룩 컨셉 쇼핑몰 데이터
// ⚠ 이 파일이 전체 쇼핑몰의 유일한 데이터 소스입니다.
// ⚠ 이미지: Unsplash 실제 패션 사진 (한국 20~30대 남성 트렌드 컨셉)

'use strict';

/* ══════════════════════════════════════════════
   ⚙ 전역 설정
══════════════════════════════════════════════ */
const VARO_CONFIG = {
  BRAND_NAME:           'VARO',
  BRAND_SLOGAN:         '지금, 바로 당신의 스타일',
  BRAND_DESC:           '남친룩부터 하객룩까지 — 20·30 남성의 모든 무드',
  DELIVERY_FEE:         3000,
  FREE_SHIP_THRESHOLD:  50000,
  ITEMS_PER_PAGE:       12,
  HERO_AUTOPLAY_MS:     5000,
  TEST_USER: {
    email: 'demo@varo.com',
    password: 'varo2026',
    name:  '김민준',
    grade: 'GOLD',
    point: 12400,
  },
  ADMIN: {
    email:    'admin@varo.com',
    password: 'varo2026admin',
  },
  MEMBERSHIP_TIERS: [
    { id:'basic',  label:'BASIC',    min:0,       max:99999,    discount:0,  points:1, badge:'🔰', color:'#888'    },
    { id:'silver', label:'SILVER',   min:100000,  max:299999,   discount:5,  points:3, badge:'🥈', color:'#8A9AAA' },
    { id:'gold',   label:'GOLD',     min:300000,  max:999999,   discount:10, points:5, badge:'🥇', color:'#BFA14A' },
    { id:'vip',    label:'VARO VIP', min:1000000, max:Infinity, discount:15, points:7, badge:'👑', color:'#D96B3C' },
  ],
};

/* ══════════════════════════════════════════════
   카테고리
   — id는 HTML filter-tab[data-category]와 일치해야 함
══════════════════════════════════════════════ */
const CATEGORIES = [
  { id:'all',    label:'전체'    },
  { id:'outer',  label:'아우터'  },
  { id:'shirt',  label:'셔츠'    },
  { id:'top',    label:'상의'    },
  { id:'knit',   label:'니트'    },
  { id:'bottom', label:'하의'    },
  { id:'setup',  label:'세트업'  },
  { id:'shoes',  label:'슈즈'    },
  { id:'acc',    label:'악세서리'},
];

/* ══════════════════════════════════════════════
   스타일 테마 (컨셉 분류)
   — 남친룩 · 커플룩 · 캐주얼룩 · 하객룩
══════════════════════════════════════════════ */
const STYLE_THEMES = [
  { id:'boyfriend', label:'남친룩',   color:'#4A7FA5' },
  { id:'couple',    label:'커플룩',   color:'#D96B3C' },
  { id:'casual',    label:'캐주얼룩', color:'#4A8A5A' },
  { id:'formal',    label:'하객룩',   color:'#BFA14A' },
];

/* ══════════════════════════════════════════════
   상품 데이터 (16개 — 컨셉별 고르게 분배)
   이미지: Unsplash 한국 20~30대 남성 패션 실착 느낌
══════════════════════════════════════════════ */
const PRODUCTS = [

  /* ── 아우터 ────────────────────────────────── */
  {
    id: 'P001',
    categoryId: 'outer',
    styles: ['boyfriend', 'formal'],
    brand: 'VARO',
    name: '더블 브레스티드 울 코트',
    price: 198000,
    salePrice: null,
    badge: 'best',
    isEvent: false,
    mainImg: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=800&fit=crop&q=85',
    subImg:  'https://images.unsplash.com/photo-1507679799797-b90bd27e86da?w=600&h=800&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1507679799797-b90bd27e86da?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600&h=800&fit=crop&q=85',
    ],
    colors: [
      { name:'카멜',  hex:'#C8956A' },
      { name:'블랙',  hex:'#1C1A16' },
      { name:'그레이',hex:'#7A7672' },
    ],
    sizes: ['S','M','L','XL'],
    soldOutSizes: ['S'],
    description: '하객룩·데이트룩 모두 완벽한 더블 브레스티드 코트. 울 혼방 소재가 드레이프감을 극대화합니다.',
    material: '70% Wool, 30% Polyester',
    care: '드라이클리닝 전용',
    rating: 4.9, reviewCount: 214,
    isWishlisted: false,
  },
  {
    id: 'P002',
    categoryId: 'outer',
    styles: ['boyfriend', 'casual'],
    brand: 'VARO',
    name: '오버사이즈 데님 자켓',
    price: 128000,
    salePrice: 98000,
    badge: 'sale',
    isEvent: false,
    mainImg: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop&q=85',
    subImg:  'https://images.unsplash.com/photo-1514473776127-61e2dc1dded3?w=600&h=800&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1514473776127-61e2dc1dded3?w=600&h=800&fit=crop&q=85',
    ],
    colors: [
      { name:'라이트블루', hex:'#A8C4D8' },
      { name:'인디고',     hex:'#2A3F6A' },
    ],
    sizes: ['S','M','L','XL','XXL'],
    soldOutSizes: [],
    description: '남친룩 핵심 아이템. 어떤 하의와도 자연스럽게 어울리는 오버핏 데님 자켓.',
    material: '100% Cotton Denim',
    care: '30°C 이하 세탁 / 뒤집어서 세탁',
    rating: 4.6, reviewCount: 87,
    isWishlisted: false,
  },
  {
    id: 'P003',
    categoryId: 'outer',
    styles: ['casual', 'boyfriend'],
    brand: 'VARO',
    name: '나일론 퀄팅 패딩 재킷',
    price: 148000,
    salePrice: null,
    badge: 'new',
    isEvent: false,
    mainImg: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop&q=85',
    subImg:  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop&q=85',
    ],
    colors: [
      { name:'블랙',  hex:'#1C1A16' },
      { name:'올리브',hex:'#4A5240' },
    ],
    sizes: ['S','M','L','XL'],
    soldOutSizes: [],
    description: '경량 나일론 퀄팅 패딩. 캐주얼 데이트룩과 완벽한 조합.',
    material: '100% Nylon / Polyester Fill (80g)',
    care: '30°C 이하 단독 세탁',
    rating: 4.7, reviewCount: 43,
    isWishlisted: false,
  },

  /* ── 셔츠 ─────────────────────────────────── */
  {
    id: 'P004',
    categoryId: 'shirt',
    styles: ['boyfriend', 'couple', 'casual'],
    brand: 'VARO',
    name: '스트라이프 오버핏 셔츠',
    price: 72000,
    salePrice: null,
    badge: 'new',
    isEvent: true,
    mainImg: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop&q=85',
    subImg:  'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&h=800&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&h=800&fit=crop&q=85',
    ],
    colors: [
      { name:'블루 스트라이프', hex:'#6B8FAF' },
      { name:'화이트',         hex:'#F5F5F0' },
    ],
    sizes: ['S','M','L','XL'],
    soldOutSizes: [],
    description: '커플룩으로 가장 많이 찾는 스트라이프 오버핏 셔츠. 반팔·긴팔 모두 자연스럽게 연출.',
    material: '100% Cotton (Linen Blend)',
    care: '30°C 이하 단독 세탁 / 자연 건조',
    rating: 4.8, reviewCount: 156,
    isWishlisted: false,
  },
  {
    id: 'P005',
    categoryId: 'shirt',
    styles: ['formal', 'boyfriend'],
    brand: 'VARO',
    name: '화이트 포플린 드레스 셔츠',
    price: 68000,
    salePrice: null,
    badge: null,
    isEvent: false,
    mainImg: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&h=800&fit=crop&q=85',
    subImg:  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop&q=85',
    ],
    colors: [
      { name:'화이트', hex:'#F5F5F0' },
      { name:'라이트블루', hex:'#C5D8E8' },
    ],
    sizes: ['S','M','L','XL'],
    soldOutSizes: [],
    description: '하객룩·데이트룩 필수템. 깔끔한 포플린 소재가 격식과 캐주얼을 동시에.',
    material: '100% Cotton Poplin',
    care: '30°C 이하 세탁 / 중간 온도 다림질',
    rating: 4.5, reviewCount: 92,
    isWishlisted: false,
  },

  /* ── 상의 ─────────────────────────────────── */
  {
    id: 'P006',
    categoryId: 'top',
    styles: ['casual', 'boyfriend'],
    brand: 'VARO',
    name: '코튼 오버핏 헤비 티셔츠',
    price: 42000,
    salePrice: null,
    badge: 'new',
    isEvent: true,
    mainImg: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop&q=85',
    subImg:  'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=800&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop&q=85',
    ],
    colors: [
      { name:'블랙',   hex:'#1C1A16' },
      { name:'화이트', hex:'#F5F5F0' },
      { name:'그레이', hex:'#8A8680' },
      { name:'베이지', hex:'#D4C9B8' },
    ],
    sizes: ['S','M','L','XL','XXL'],
    soldOutSizes: [],
    description: '240gsm 헤비 코튼. 남친룩·커플룩으로 데일리하게 입을 수 있는 기본템.',
    material: '100% Cotton (240gsm)',
    care: '30°C 이하 세탁 / 건조기 금지',
    rating: 4.7, reviewCount: 328,
    isWishlisted: false,
  },
  {
    id: 'P007',
    categoryId: 'top',
    styles: ['casual', 'couple'],
    brand: 'VARO',
    name: '스웨트 오버사이즈 후드',
    price: 88000,
    salePrice: null,
    badge: 'best',
    isEvent: true,
    mainImg: 'https://images.unsplash.com/photo-1556821840-3a63f8550d64?w=600&h=800&fit=crop&q=85',
    subImg:  'https://images.unsplash.com/photo-1565084888279-aca607bb73f7?w=600&h=800&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f8550d64?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1565084888279-aca607bb73f7?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=600&h=800&fit=crop&q=85',
    ],
    colors: [
      { name:'블랙',    hex:'#1C1A16' },
      { name:'차콜',    hex:'#3A3A3A'  },
      { name:'아이보리',hex:'#F0EDE4'  },
    ],
    sizes: ['S','M','L','XL','XXL'],
    soldOutSizes: ['S'],
    description: '커플룩 1위! 320gsm 프리미엄 플리스. 여자친구와 함께 입기 딱 좋은 오버핏.',
    material: '80% Cotton, 20% Polyester (320gsm)',
    care: '40°C 이하 세탁 / 단독 세탁',
    rating: 4.9, reviewCount: 203,
    isWishlisted: false,
  },

  /* ── 니트 ─────────────────────────────────── */
  {
    id: 'P008',
    categoryId: 'knit',
    styles: ['boyfriend', 'formal', 'couple'],
    brand: 'VARO',
    name: '하프집업 골지 니트',
    price: 98000,
    salePrice: 78000,
    badge: 'sale',
    isEvent: false,
    mainImg: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&h=800&fit=crop&q=85',
    subImg:  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop&q=85',
    ],
    colors: [
      { name:'오트밀', hex:'#D4C9B8' },
      { name:'브라운', hex:'#7A5C44' },
      { name:'블랙',   hex:'#1C1A16' },
    ],
    sizes: ['S','M','L','XL'],
    soldOutSizes: [],
    description: '데이트룩·남친룩 최애 니트. 골지 패턴으로 슬림하고 세련된 실루엣 완성.',
    material: '80% Cotton, 20% Nylon',
    care: '30°C 이하 손세탁 / 뒤집어서',
    rating: 4.8, reviewCount: 176,
    isWishlisted: false,
  },

  /* ── 하의 ─────────────────────────────────── */
  {
    id: 'P009',
    categoryId: 'bottom',
    styles: ['casual', 'boyfriend'],
    brand: 'VARO',
    name: '와이드 카고 팬츠',
    price: 89000,
    salePrice: 69000,
    badge: 'sale',
    isEvent: false,
    mainImg: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop&q=85',
    subImg:  'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop&q=85',
    ],
    colors: [
      { name:'카키',   hex:'#6B6B47' },
      { name:'블랙',   hex:'#1C1A16' },
      { name:'베이지', hex:'#C8B89A' },
    ],
    sizes: ['S','M','L','XL','XXL'],
    soldOutSizes: ['S'],
    description: '캐주얼룩 완성 아이템. 넉넉한 와이드 핏과 실용적인 카고 포켓.',
    material: '98% Cotton, 2% Elastane',
    care: '30°C 이하 세탁 / 뒤집어서',
    rating: 4.5, reviewCount: 89,
    isWishlisted: false,
  },
  {
    id: 'P010',
    categoryId: 'bottom',
    styles: ['formal', 'boyfriend'],
    brand: 'VARO',
    name: '슬림 테이퍼드 슬랙스',
    price: 82000,
    salePrice: null,
    badge: null,
    isEvent: false,
    mainImg: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&h=800&fit=crop&q=85',
    subImg:  'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=600&h=800&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=600&h=800&fit=crop&q=85',
    ],
    colors: [
      { name:'차콜',   hex:'#3A3A3A' },
      { name:'네이비', hex:'#1A2744' },
      { name:'베이지', hex:'#C8B89A' },
    ],
    sizes: ['28','30','32','34'],
    soldOutSizes: ['28'],
    description: '하객룩·남친룩 기본. 어떤 상의와도 깔끔하게 맞는 슬림 테이퍼드.',
    material: '65% Polyester, 33% Rayon, 2% Elastane',
    care: '30°C 이하 세탁 / 중온 다림질',
    rating: 4.4, reviewCount: 102,
    isWishlisted: false,
  },
  {
    id: 'P011',
    categoryId: 'bottom',
    styles: ['casual', 'couple'],
    brand: 'VARO',
    name: '셀비지 데님 와이드 팬츠',
    price: 96000,
    salePrice: null,
    badge: 'best',
    isEvent: false,
    mainImg: 'https://images.unsplash.com/photo-1603252109612-6d5fee16a54d?w=600&h=800&fit=crop&q=85',
    subImg:  'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&h=800&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1603252109612-6d5fee16a54d?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&h=800&fit=crop&q=85',
    ],
    colors: [
      { name:'미드블루',   hex:'#4A7399' },
      { name:'라이트블루', hex:'#A8C4D8' },
      { name:'블랙',       hex:'#1A1A1A' },
    ],
    sizes: ['28','30','32','34','36'],
    soldOutSizes: [],
    description: '12oz 셀비지 데님. 사용할수록 자연스러운 에이징이 쌓이는 프리미엄 와이드.',
    material: '100% Cotton Selvage Denim (12oz)',
    care: '30°C 이하 단독 세탁 / 자연 건조',
    rating: 4.7, reviewCount: 148,
    isWishlisted: false,
  },

  /* ── 세트업 ────────────────────────────────── */
  {
    id: 'P012',
    categoryId: 'setup',
    styles: ['formal', 'couple', 'boyfriend'],
    brand: 'VARO',
    name: '체크 울 블레이저 세트업',
    price: 298000,
    salePrice: 238000,
    badge: 'sale',
    isEvent: false,
    mainImg: 'https://images.unsplash.com/photo-1507679799797-b90bd27e86da?w=600&h=800&fit=crop&q=85',
    subImg:  'https://images.unsplash.com/photo-1549062572-544a64fb0c56?w=600&h=800&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1507679799797-b90bd27e86da?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1549062572-544a64fb0c56?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600&h=800&fit=crop&q=85',
    ],
    colors: [
      { name:'그레이 체크', hex:'#7A7A7A' },
      { name:'네이비',      hex:'#1A2744' },
    ],
    sizes: ['S','M','L','XL'],
    soldOutSizes: ['S'],
    description: '하객룩 완성 세트업. 커플 하객룩으로도 대단히 인기 있는 체크 울 블레이저.',
    material: '60% Wool, 40% Polyester',
    care: '드라이클리닝 권장',
    rating: 4.8, reviewCount: 67,
    isWishlisted: false,
  },

  /* ── 슈즈 ─────────────────────────────────── */
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
    subImg:  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=800&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=800&fit=crop&q=85',
    ],
    colors: [
      { name:'블랙', hex:'#1C1A16' },
      { name:'탄',   hex:'#B8956A' },
    ],
    sizes: ['250','255','260','265','270','275','280'],
    soldOutSizes: ['275','280'],
    description: '하객룩·남친룩 완성 슈즈. 청키 솔로 키도 살리고 스타일도 완성.',
    material: 'Upper: Genuine Leather / Outsole: Rubber',
    care: '가죽 전용 클리너 사용',
    rating: 4.6, reviewCount: 77,
    isWishlisted: false,
  },

  /* ── 악세서리 ──────────────────────────────── */
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
    mainImg: 'https://images.unsplash.com/photo-1548036161-2b1a0e5b4a7b?w=600&h=800&fit=crop&q=85',
    subImg:  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1548036161-2b1a0e5b4a7b?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop&q=85',
    ],
    colors: [
      { name:'블랙', hex:'#1C1A16' },
      { name:'탄',   hex:'#B8956A' },
    ],
    sizes: ['FREE'],
    soldOutSizes: [],
    description: '커플룩 완성 아이템. 베지터블 무두질 가죽 크로스백으로 룩에 포인트를.',
    material: 'Full-grain Vegetable-tanned Leather',
    care: '전용 크림 도포 / 직사광선 보관 금지',
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
    mainImg: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&h=800&fit=crop&q=85',
    subImg:  'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=600&h=800&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=600&h=800&fit=crop&q=85',
    ],
    colors: [
      { name:'실버', hex:'#C0C0C0' },
      { name:'골드', hex:'#D4AF37' },
    ],
    sizes: ['FREE'],
    soldOutSizes: [],
    description: '커플룩 소품으로 인기 1위. 스테인리스 체인으로 변색 없이 오래 착용 가능.',
    material: '316L Stainless Steel',
    care: '물기 제거 후 보관',
    rating: 4.7, reviewCount: 52,
    isWishlisted: false,
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
    mainImg: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=800&fit=crop&q=85',
    subImg:  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop&q=85',
    images: [
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop&q=85',
    ],
    colors: [
      { name:'빈티지블랙', hex:'#2A2A2A' },
      { name:'워시드그레이',hex:'#6A6A6A' },
      { name:'아이보리',   hex:'#F0EDE4' },
    ],
    sizes: ['S','M','L','XL'],
    soldOutSizes: [],
    description: '커플룩으로 인기 폭발. 피그먼트 워싱으로 빈티지한 무드를 완성하는 롱슬리브.',
    material: '100% Cotton (Pigment Washed)',
    care: '30°C 이하 단독 세탁 / 뒤집어서',
    rating: 4.6, reviewCount: 118,
    isWishlisted: false,
  },
];

/* ══════════════════════════════════════════════
   히어로 슬라이드
══════════════════════════════════════════════ */
const HERO_SLIDES = [
  {
    id: 'H001',
    tag: '2026 SS — 남친룩 컬렉션',
    title: '지금,\n바로\n당신의 스타일',
    ctaLabel: '신상품 보기',
    ctaHref: './shop.html?filter=new',
    panels: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=520&h=760&fit=crop&q=85',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=520&h=760&fit=crop&q=85',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=520&h=760&fit=crop&q=85',
    ],
    panelLinks: [
      './shop.html?category=shirt',
      './shop.html?filter=new',
      './shop.html?category=bottom',
    ],
    panelLabels: ['SHIRT', null, 'BOTTOM'],
  },
  {
    id: 'H002',
    tag: '커플룩 PICK',
    title: '함께라서\n더 예쁜\n커플룩',
    ctaLabel: '커플룩 보기',
    ctaHref: './shop.html?style=couple',
    panels: [
      'https://images.unsplash.com/photo-1556821840-3a63f8550d64?w=520&h=760&fit=crop&q=85',
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=520&h=760&fit=crop&q=85',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=520&h=760&fit=crop&q=85',
    ],
    panelLinks: ['./shop.html?style=couple', './shop.html?style=couple', './shop.html?style=couple'],
    panelLabels: ['COUPLE', null, 'KNIT'],
  },
  {
    id: 'H003',
    tag: '하객룩 SEASON',
    title: '완벽한\n하객룩을\n완성하다',
    ctaLabel: '하객룩 보기',
    ctaHref: './shop.html?style=formal',
    panels: [
      'https://images.unsplash.com/photo-1507679799797-b90bd27e86da?w=520&h=760&fit=crop&q=85',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=520&h=760&fit=crop&q=85',
      'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=520&h=760&fit=crop&q=85',
    ],
    panelLinks: ['./shop.html?style=formal', './shop.html?style=formal', './shop.html?style=formal'],
    panelLabels: ['SET-UP', null, 'BOTTOM'],
  },
];

/* ══════════════════════════════════════════════
   커뮤니티 게시물
══════════════════════════════════════════════ */
const COMMUNITY_POSTS = [
  { id:'C001', userId:'u_minjun',   username:'@minjun_style', avatar:'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&h=80&fit=crop&q=80', img:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=750&fit=crop&q=80', caption:'남친룩 완성 🤍 스트라이프 셔츠 하나로 완성',       styles:['boyfriend'],          taggedProducts:['P004'], likes:412, comments:28, timeAgo:'2시간 전', isLiked:false },
  { id:'C002', userId:'u_taehyun',  username:'@t.look',       avatar:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&q=80', img:'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&h=900&fit=crop&q=80', caption:'커플룩 인증 💑 후드 투샷 완성',              styles:['couple','casual'],    taggedProducts:['P007'], likes:834, comments:67, timeAgo:'4시간 전', isLiked:false },
  { id:'C003', userId:'u_sehun',    username:'@sehun.kr',     avatar:'https://images.unsplash.com/photo-1463453091185-61582044d556?w=80&h=80&fit=crop&q=80', img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&q=80', caption:'하객룩 공유 👔 블레이저 세트업 강추',        styles:['formal'],             taggedProducts:['P012'], likes:521, comments:43, timeAgo:'어제',     isLiked:false },
  { id:'C004', userId:'u_jiwoo',    username:'@jiwoo_daily',  avatar:'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&q=80', img:'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&h=700&fit=crop&q=80', caption:'데일리 캐주얼 완성 🧢',                        styles:['casual'],             taggedProducts:['P006'], likes:198, comments:9,  timeAgo:'2일 전',   isLiked:false },
  { id:'C005', userId:'u_yoonho',   username:'@yh_fits',      avatar:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=80&fit=crop&q=80', img:'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600&h=800&fit=crop&q=80', caption:'니트 남친룩 ✨ 이거면 다야',             styles:['boyfriend','casual'], taggedProducts:['P008'], likes:324, comments:21, timeAgo:'3일 전',   isLiked:false },
  { id:'C006', userId:'u_haechan',  username:'@haechan.fit',  avatar:'https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=80&h=80&fit=crop&q=80', img:'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=600&h=900&fit=crop&q=80', caption:'커플 하객룩 🌸 너무 잘 어울려요',         styles:['formal','couple'],    taggedProducts:['P012','P001'], likes:689, comments:54, timeAgo:'4일 전', isLiked:false },
  { id:'C007', userId:'u_donghyun', username:'@d.hyun_style', avatar:'https://images.unsplash.com/photo-1542295669297-4d352b042bca?w=80&h=80&fit=crop&q=80', img:'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&h=800&fit=crop&q=80', caption:'가을 남친룩 완성 🍂 데님에 니트 조합',      styles:['boyfriend'],          taggedProducts:['P008','P011'], likes:748, comments:55, timeAgo:'5일 전', isLiked:false },
  { id:'C008', userId:'u_park',     username:'@parkjun_kr',   avatar:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&q=80', img:'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=750&fit=crop&q=80', caption:'코트 하객룩 강추 💼',                      styles:['formal'],             taggedProducts:['P001'], likes:229, comments:16, timeAgo:'1주 전',   isLiked:false },
  { id:'C009', userId:'u_sangwoo',  username:'@sw.look',      avatar:'https://images.unsplash.com/photo-1463453091185-61582044d556?w=80&h=80&fit=crop&q=80', img:'https://images.unsplash.com/photo-1603252109612-6d5fee16a54d?w=600&h=800&fit=crop&q=80', caption:'데님 와이드 캐주얼 👖 편하고 예쁨',        styles:['casual'],             taggedProducts:['P011'], likes:163, comments:7,  timeAgo:'1주 전',   isLiked:false },
  { id:'C010', userId:'u_junho',    username:'@junho.style',  avatar:'https://images.unsplash.com/photo-1542295669297-4d352b042bca?w=80&h=80&fit=crop&q=80', img:'https://images.unsplash.com/photo-1507679799797-b90bd27e86da?w=600&h=800&fit=crop&q=80', caption:'블레이저 캐주얼 무드 🖤 미니멀 완성',      styles:['boyfriend','formal'], taggedProducts:['P012'], likes:445, comments:32, timeAgo:'1주 전',   isLiked:false },
  { id:'C011', userId:'u_hyunwoo',  username:'@hw_minimal',   avatar:'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&h=80&fit=crop&q=80', img:'https://images.unsplash.com/photo-1556821840-3a63f8550d64?w=600&h=900&fit=crop&q=80', caption:'후드 커플룩 💕 너무 잘 어울린다',           styles:['couple','casual'],    taggedProducts:['P007'], likes:612, comments:49, timeAgo:'2주 전',   isLiked:false },
  { id:'C012', userId:'u_seojun',   username:'@seojun.daily', avatar:'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&q=80', img:'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&h=750&fit=crop&q=80', caption:'니트 남친룩 인증 🤎 색감 진짜 예뻐',        styles:['boyfriend'],          taggedProducts:['P008'], likes:387, comments:25, timeAgo:'2주 전',   isLiked:false },
];

/* ══════════════════════════════════════════════
   리뷰 데이터
══════════════════════════════════════════════ */
const REVIEWS = {
  P001:[
    { id:'R001', user:'민준 *', rating:5, date:'2026.04.10', body:'하객룩으로 완벽합니다. 카멜 색상이 너무 예쁘고 소재도 고급져요. 주변에서 어디서 샀냐고 많이 물어봐요.', sizeInfo:'M 구매 / 평소 M 착용' },
    { id:'R002', user:'도현 *', rating:5, date:'2026.04.05', body:'블랙으로 샀는데 여친이랑 하객룩으로 맞춰 입었어요. 너무 잘 어울립니다!', sizeInfo:'L 구매 / 평소 M 착용' },
  ],
  P004:[
    { id:'R003', user:'태현 *', rating:5, date:'2026.04.12', body:'커플룩으로 샀는데 여친이 너무 좋아해요. 스트라이프 패턴이 세련되고 핏도 딱 좋습니다.', sizeInfo:'M 구매 / 평소 M 착용' },
    { id:'R004', user:'해찬 *', rating:4, date:'2026.04.08', body:'남친룩으로 입기 너무 좋아요. 데이트룩에 딱 어울리는 느낌.', sizeInfo:'L 구매 / 평소 M 착용' },
  ],
  P006:[
    { id:'R005', user:'지우 *', rating:5, date:'2026.04.11', body:'화이트로 샀는데 너무 깔끔하고 기본 남친룩으로 최고입니다. 재구매 의사 있어요.', sizeInfo:'M 구매 / 평소 M 착용' },
    { id:'R006', user:'서준 *', rating:5, date:'2026.04.09', body:'여자친구도 함께 입는 커플티로 구매했어요. 오버핏이라 편하고 너무 예뻐요!', sizeInfo:'L 구매 / 평소 M 착용 (여자친구 XS)' },
  ],
  P007:[
    { id:'R007', user:'민준 *', rating:5, date:'2026.04.13', body:'커플룩 1등 상품 이유가 있네요. 여자친구랑 같이 입었는데 진짜 잘 어울려요.', sizeInfo:'L 구매 / 평소 M 착용' },
    { id:'R008', user:'박준 *', rating:5, date:'2026.04.07', body:'320gsm이라 두껍고 따뜻합니다. 가을부터 봄까지 내내 입을 수 있어요.', sizeInfo:'M 구매 / 평소 M 착용' },
  ],
  P008:[
    { id:'R009', user:'윤호 *', rating:5, date:'2026.04.10', body:'골지 패턴 진짜 예쁘고 슬림해 보여요. 남친룩으로 데이트할 때마다 입고 있어요.', sizeInfo:'M 구매 / 평소 M 착용' },
  ],
  P012:[
    { id:'R010', user:'상우 *', rating:5, date:'2026.04.06', body:'하객룩으로 완벽합니다. 그레이 체크 진짜 고급스럽고 커플 하객룩으로도 너무 잘 어울려요.', sizeInfo:'M 구매 / 평소 M 착용' },
    { id:'R011', user:'해찬 *', rating:4, date:'2026.04.02', body:'세일가에 구매해서 대만족. 소재감이 너무 좋고 핏이 모던해요.', sizeInfo:'L 구매 / 평소 M 착용' },
  ],
};

/* ══════════════════════════════════════════════
   마퀴 & 정렬 & 푸터
══════════════════════════════════════════════ */
const MARQUEE_ITEMS = [
  'FREE SHIPPING OVER <b>50,000 KRW</b>',
  '상의 전품목 <b>1+1 이벤트</b>',
  '남친룩 · 커플룩 · 하객룩 <b>전문 쇼핑몰</b>',
  'GOLD 멤버 <b>10% 상시 할인</b>',
  '7일 <b>무료반품</b> 보장',
  '2026 SS <b>NEW ARRIVALS</b>',
];

const SORT_OPTIONS = [
  { value:'newest',     label:'신상품순'    },
  { value:'popular',    label:'인기순'      },
  { value:'price-low',  label:'낮은 가격순' },
  { value:'price-high', label:'높은 가격순' },
  { value:'review',     label:'리뷰 많은순' },
];

/* ══════════════════════════════════════════════
   전역 노출
══════════════════════════════════════════════ */
if (typeof window !== 'undefined') {
  window.VARO_DATA = {
    CATEGORIES, STYLE_THEMES, PRODUCTS,
    HERO_SLIDES, MARQUEE_ITEMS,
    COMMUNITY_POSTS, REVIEWS,
    SORT_OPTIONS,
  };
  window.VARO_CONFIG = VARO_CONFIG;
}
