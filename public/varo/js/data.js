// 경로: js/data.js
// VARO 2026 — 20·30 남성 프리미엄 쇼핑몰 데이터
// ⚠ 모든 이미지는 얼굴 노출이 없는(Headless) 고감도 한국 남성 트렌드 화보 중심

'use strict';

const VARO_CONFIG = {
  BRAND_NAME: 'VARO',
  BRAND_SLOGAN: '언제나, 바로 지금 당신의 스타일',
  BRAND_DESC: '20·30 남성 미니멀·캐주얼 셀렉트 숍',
  DELIVERY_FEE: 3000,
  FREE_SHIP_THRESHOLD: 50000,
  ITEMS_PER_PAGE: 12,
  HERO_AUTOPLAY_MS: 4000,
  MEMBERSHIP_TIERS: [
    { id: 'bronze', label: 'BRONZE', min: 0, max: 99999, discount: 0, points: 1, color: '#A87C6C' },
    { id: 'silver', label: 'SILVER', min: 100000, max: 299999, discount: 5, points: 3, color: '#A0A0A0' },
    { id: 'gold', label: 'GOLD', min: 300000, max: 999999, discount: 10, points: 5, color: '#D4AF37' },
    { id: 'dia', label: 'DIA', min: 1000000, max: 2999999, discount: 15, points: 7, color: '#00D1FF' },
  ],
};

const CATEGORIES = [
  { id: 'all', label: '전체', parentId: null },
  { id: 'outer', label: '아우터', parentId: null },
  { id: 'shirt', label: '셔츠', parentId: null },
  { id: 'top', label: '상의', parentId: null },
  { id: 'knit', label: '니트', parentId: null },
  { id: 'bottom', label: '하의', parentId: null },
  { id: 'shoes', label: '슈즈', parentId: null },
  { id: 'acc', label: '악세서리', parentId: null },
];

const WEEKLY_BEST = ['P001', 'P002', 'P003', 'P004', 'P005', 'P006', 'P007', 'P008', 'P009'];

/**
 * 50개 프리미엄 상품 데이터베이스
 * 중복 없는 고화질 얼굴 없는(Headless) 컷 위주
 */
const PRODUCTS = [
  // ── OUTER (10) ──────────────────────────────────────────
  {
    id: 'P001', categoryId: 'outer', brand: 'VARO STUDIO', name: '핸드메이드 캐시미어 롱 코트', price: 289000, salePrice: 245000, badge: 'best',
    mainImg: './assets/products/P001_main.png', // 코트 뒷모습 (텍스트 없음)
    subImg: './assets/products/P001_sub.png',
    colors: [{ name: '카멜', hex: '#C8956A' }, { name: '블랙', hex: '#1C1A16' }],
    sizes: ['M', 'L', 'XL'], description: '정갈한 실루엣의 핸드메이드 코트입니다.', rating: 4.9, reviewCount: 214
  },
  {
    id: 'P002', categoryId: 'outer', brand: 'VARO STUDIO', name: '해링턴 코튼 블루종', price: 158000, salePrice: 128000, badge: 'best',
    mainImg: './assets/products/P002_main.png', // 블루종 착용샷 (상반신)
    subImg: './assets/products/P002_sub.png',
    colors: [{ name: '네이비', hex: '#2A3F6A' }, { name: '카키', hex: '#4B5320' }],
    sizes: ['M', 'L', 'XL'], description: '클래식한 무드의 데일리 블루종 자켓.', rating: 4.8, reviewCount: 152
  },
  {
    id: 'P003', categoryId: 'outer', brand: 'VARO', name: '릴렉스핏 나일론 윈드브레이커', price: 89000, salePrice: null, badge: 'new',
    mainImg: './assets/products/P003_main.jpg', // 바람막이 디테일
    subImg: './assets/products/P003_sub.jpg',
    colors: [{ name: '그레이', hex: '#7A7A7A' }, { name: '블랙', hex: '#1C1A16' }],
    sizes: ['Free'], description: '가벼운 고밀도 나일론 소재의 윈드브레이커.', rating: 4.7, reviewCount: 88
  },
  {
    id: 'P004', categoryId: 'outer', brand: 'VARO STUDIO', name: '덕다운 미니멀 숏 패딩', price: 198000, salePrice: 168000, badge: 'hot',
    mainImg: './assets/products/P004_main.png', // 패딩 뒷모습
    subImg: './assets/products/P004_sub.png',
    colors: [{ name: '매트블랙', hex: '#1A1A1A' }],
    sizes: ['M', 'L', 'XL'], description: '한파에도 걱정 없는 프리미엄 덕다운.', rating: 4.9, reviewCount: 67
  },
  {
    id: 'P005', categoryId: 'outer', brand: 'VARO', name: '바라쿠타 G9 스타일 자켓', price: 135000, salePrice: null, badge: null,
    mainImg: './assets/products/P005_main.jpg', // 자켓 디테일
    subImg: './assets/products/P005_sub.jpg',
    colors: [{ name: '베이지', hex: '#E2D3B8' }],
    sizes: ['M', 'L', 'XL'], description: '영국 클래식 감성의 해링턴 자켓.', rating: 4.6, reviewCount: 42
  },
  {
    id: 'P006', categoryId: 'outer', brand: 'VARO STUDIO', name: '오버사이즈 발마칸 코트', price: 215000, salePrice: null, badge: 'new',
    mainImg: './assets/products/P006_main.jpg', // 코트 실루엣
    subImg: './assets/products/P006_sub.jpg',
    colors: [{ name: '네이비', hex: '#1C2B4B' }],
    sizes: ['M', 'L'], description: '트렌디한 오버사이즈 실루엣의 발마칸 코트.', rating: 4.8, reviewCount: 56
  },
  {
    id: 'P007', categoryId: 'outer', brand: 'VARO', name: '코듀로이 트러커 자켓', price: 92000, salePrice: 75000, badge: 'sale',
    mainImg: './assets/products/P007_main.jpg', // 코듀로이 텍스처
    subImg: './assets/products/P007_sub.jpg',
    colors: [{ name: '브라운', hex: '#8B4513' }],
    sizes: ['M', 'L', 'XL'], description: '따뜻한 감성의 코듀로이 자켓.', rating: 4.5, reviewCount: 112
  },
  {
    id: 'P008', categoryId: 'outer', brand: 'VARO STUDIO', name: 'M-65 필드 자켓', price: 178000, salePrice: null, badge: 'best',
    mainImg: './assets/products/P008_main.gif', // 야상 착용컷 (목 아래)
    subImg: './assets/products/P008_sub.gif',
    colors: [{ name: '올리브', hex: '#4B5240' }],
    sizes: ['S', 'M', 'L'], description: '오랜 시간 사랑받는 밀리터리 필드 자켓.', rating: 4.8, reviewCount: 94
  },
  {
    id: 'P009', categoryId: 'outer', brand: 'VARO', name: '리버시블 보아 플리스 점퍼', price: 118000, salePrice: 89000, badge: 'hot',
    mainImg: './assets/products/P009_main.png', // 후리스 질감
    subImg: './assets/products/P009_sub.png',
    colors: [{ name: '아이보리', hex: '#F5F5F0' }],
    sizes: ['M', 'L', 'XL'], description: '양면으로 활용 가능한 실용적인 점퍼.', rating: 4.7, reviewCount: 186
  },
  {
    id: 'P010', categoryId: 'outer', brand: 'VARO STUDIO', name: '프리미엄 무스탕 자켓', price: 345000, salePrice: 298000, badge: 'premium',
    mainImg: './assets/products/P010_main.jpg', // 가죽 무스탕 (텍스트 없음)
    subImg: './assets/products/P010_sub.jpg',
    colors: [{ name: '블랙', hex: '#1A1A1A' }],
    sizes: ['M', 'L'], description: '최고급 비건 레더와 보아퍼로 제작된 무스탕.', rating: 5.0, reviewCount: 33
  },

  // ── SHIRT (8) ──────────────────────────────────────────
  {
    id: 'P011', categoryId: 'shirt', brand: 'VARO BASIC', name: '옥스퍼드 릴렉스 셔츠', price: 45000, salePrice: null, badge: 'best',
    mainImg: './assets/products/P011_main.jpg', // 셔츠 상반신 (얼굴 없음)
    subImg: './assets/products/P011_sub.jpg',
    colors: [{ name: '화이트', hex: '#FFFFFF' }, { name: '블루', hex: '#6B8FAF' }],
    sizes: ['S', 'M', 'L', 'XL'], description: '기본에 충실한 옥스퍼드 셔츠.', rating: 4.8, reviewCount: 456
  },
  {
    id: 'P012', categoryId: 'shirt', brand: 'VARO', name: '와이드 카라 스트라이프 셔츠', price: 52000, salePrice: 42000, badge: 'sale',
    mainImg: './assets/products/P012_main.jpg', // 스트라이프 셔츠
    subImg: './assets/products/P012_sub.jpg',
    colors: [{ name: '블루', hex: '#4A7399' }],
    sizes: ['M', 'L', 'XL'], description: '시원한 무드의 스트라이프 셔츠.', rating: 4.7, reviewCount: 122
  },
  {
    id: 'P013', categoryId: 'shirt', brand: 'VARO STUDIO', name: '리넨 블렌드 썸머 셔츠', price: 48000, salePrice: null, badge: 'new',
    mainImg: './assets/products/P013_main.jpg', // 화이트 리넨
    subImg: './assets/products/P013_sub.jpg',
    colors: [{ name: '네츄럴', hex: '#EEE8AA' }],
    sizes: ['M', 'L', 'XL'], description: '한여름에도 쾌적한 리넨 소재.', rating: 4.6, reviewCount: 89
  },
  {
    id: 'P014', categoryId: 'shirt', brand: 'VARO', name: '데님 웨스턴 셔츠', price: 65000, salePrice: 55000, badge: 'hot',
    mainImg: './assets/products/P014_main.jpg', // 데님 원단
    subImg: './assets/products/P014_sub.jpg',
    colors: [{ name: '인디고', hex: '#2A3F6A' }],
    sizes: ['M', 'L', 'XL'], description: '빈티지한 매력의 데님 셔츠.', rating: 4.8, reviewCount: 144
  },
  {
    id: 'P015', categoryId: 'shirt', brand: 'VARO STUDIO', name: '반팔 오버사이즈 워크 셔츠', price: 42000, salePrice: null, badge: null,
    mainImg: './assets/products/P015_main.jpg', // 워크 셔츠
    subImg: './assets/products/P015_sub.jpg',
    colors: [{ name: '카키', hex: '#556B2F' }],
    sizes: ['M', 'L', 'XL'], description: '터프한 질감의 반팔 워크 셔츠.', rating: 4.7, reviewCount: 63
  },
  {
    id: 'P016', categoryId: 'shirt', brand: 'VARO', name: '프렌치 린넨 밴드카라 셔츠', price: 58000, salePrice: null, badge: 'new',
    mainImg: './assets/products/P016_main.jpg', // 밴드카라
    subImg: './assets/products/P016_sub.jpg',
    colors: [{ name: '화이트', hex: '#FFFFFF' }],
    sizes: ['S', 'M', 'L'], description: '미니멀한 무드의 밴드카라 셔츠.', rating: 4.5, reviewCount: 29
  },
  {
    id: 'P017', categoryId: 'shirt', brand: 'VARO STUDIO', name: '타탄 체크 플라넬 셔츠', price: 54000, salePrice: 39000, badge: 'sale',
    mainImg: './assets/products/P017_main.jpg', // 체크 셔츠 원단
    subImg: './assets/products/P017_sub.jpg',
    colors: [{ name: '그린', hex: '#006400' }],
    sizes: ['M', 'L', 'XL'], description: '따뜻한 기모감의 체크 셔츠.', rating: 4.7, reviewCount: 110
  },
  {
    id: 'P018', categoryId: 'shirt', brand: 'VARO', name: '실키 라운드 오픈카라 셔츠', price: 49000, salePrice: null, badge: 'best',
    mainImg: './assets/products/P018_main.jpg', // 블랙 오픈카라
    subImg: './assets/products/P018_sub.jpg',
    colors: [{ name: '블랙', hex: '#1C1A16' }],
    sizes: ['M', 'L', 'XL'], description: '드레이프성이 뛰어난 오픈카라 셔츠.', rating: 4.8, reviewCount: 75
  },

  // ── TOP (12) ──────────────────────────────────────────
  {
    id: 'P019', categoryId: 'top', brand: 'VARO BASIC', name: '헤비 웨이트 20수 티셔츠', price: 29000, salePrice: null, badge: 'best',
    mainImg: './assets/products/P019_main.jpg', // 티셔츠 착용 (목 아래)
    subImg: './assets/products/P019_sub.jpg',
    colors: [{ name: '화이트', hex: '#FFFFFF' }, { name: '블랙', hex: '#000000' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], description: '비침 없는 탄탄한 무지 티셔츠.', rating: 4.8, reviewCount: 1240
  },
  {
    id: 'P020', categoryId: 'top', brand: 'VARO', name: 'USA 코튼 세미오버 후드', price: 68000, salePrice: 58000, badge: 'hot',
    mainImg: './assets/products/P020_main.jpg', // 그레이 후드티
    subImg: './assets/products/P020_sub.jpg',
    colors: [{ name: '그레이', hex: '#C0C0C0' }],
    sizes: ['M', 'L', 'XL'], description: '최고급 USA 코튼으로 제작된 후드.', rating: 4.9, reviewCount: 521
  },
  {
    id: 'P021', categoryId: 'top', brand: 'VARO STUDIO', name: '레터링 피그먼트 맨투맨', price: 59000, salePrice: null, badge: 'new',
    mainImg: './assets/products/P021_main.jpg', // 피그먼트 질감
    subImg: './assets/products/P021_sub.jpg',
    colors: [{ name: '빈티지블랙', hex: '#2A2A2A' }],
    sizes: ['M', 'L', 'XL'], description: '빈티지한 워싱의 피그먼트 스웨트셔츠.', rating: 4.7, reviewCount: 93
  },
  {
    id: 'P022', categoryId: 'top', brand: 'VARO', name: '피케 카라 반팔 티셔츠', price: 38000, salePrice: 29000, badge: 'sale',
    mainImg: './assets/products/P022_main.png', // 카라티
    subImg: './assets/products/P022_sub.png',
    colors: [{ name: '네이비', hex: '#1C2B4B' }],
    sizes: ['M', 'L', 'XL'], description: '여름철 깔끔한 출근룩 제항.', rating: 4.6, reviewCount: 156
  },
  {
    id: 'P023', categoryId: 'top', brand: 'VARO BASIC', name: '가먼트 다잉 롱슬리브', price: 35000, salePrice: null, badge: 'best',
    mainImg: './assets/products/P023_main.jpg', // 롱슬리브
    subImg: './assets/products/P023_sub.jpg',
    colors: [{ name: '차콜', hex: '#333333' }],
    sizes: ['M', 'L', 'XL'], description: '색감이 매력적인 가먼트 다잉 티셔츠.', rating: 4.8, reviewCount: 88
  },
  {
    id: 'P024', categoryId: 'top', brand: 'VARO STUDIO', name: '아카이브 그래픽 티셔츠', price: 39000, salePrice: null, badge: 'new',
    mainImg: './assets/products/P024_main.jpg', // 그래픽 티
    subImg: './assets/products/P024_sub.jpg',
    colors: [{ name: '화이트', hex: '#FFFFFF' }],
    sizes: ['S', 'M', 'L'], description: 'VARO만의 유니크한 그래픽 아트워크.', rating: 4.7, reviewCount: 45
  },
  {
    id: 'P025', categoryId: 'top', brand: 'VARO STUDIO', name: '럭비 카라 스웨트셔츠', price: 65000, salePrice: 49000, badge: 'sale',
    mainImg: './assets/products/P025_main.jpg', // 럭비 셔츠 무드
    subImg: './assets/products/P025_sub.jpg',
    colors: [{ name: '그린/네이비', hex: '#004225' }],
    sizes: ['L', 'XL'], description: '프레피룩의 정석 럭비 맨투맨.', rating: 4.8, reviewCount: 67
  },
  {
    id: 'P026', categoryId: 'top', brand: 'VARO', name: '모크넥 하프 지업 맨투맨', price: 62000, salePrice: null, badge: 'hot',
    mainImg: './assets/products/P026_main.jpg', // 하프집업
    subImg: './assets/products/P026_sub.jpg',
    colors: [{ name: '오트밀', hex: '#EDE4D4' }],
    sizes: ['M', 'L', 'XL'], description: '편안함과 스타일을 동시에 담은 집업.', rating: 4.7, reviewCount: 132
  },
  {
    id: 'P027', categoryId: 'top', brand: 'VARO BASIC', name: '서프 로고 포켓 티셔츠', price: 28000, salePrice: null, badge: null,
    mainImg: './assets/products/P027_main.jpg', // 포켓티
    subImg: './assets/products/P027_sub.jpg',
    colors: [{ name: '화이트/레드', hex: '#FFFFFF' }],
    sizes: ['S', 'M', 'L'], description: '포켓 디테일이 들어간 데일리 티셔츠.', rating: 4.5, reviewCount: 54
  },
  {
    id: 'P028', categoryId: 'top', brand: 'VARO', name: '스웨트셔츠', price: 58000, salePrice: null, badge: 'new',
    mainImg: './assets/products/P028_main.jpg', // 맨투맨 뒤태
    subImg: './assets/products/P028_sub.jpg',
    colors: [{ name: '그레이', hex: '#777777' }],
    sizes: ['M', 'L', 'XL'], description: '감각적인 바이크 그래픽이 특징.', rating: 4.6, reviewCount: 38
  },
  {
    id: 'P029', categoryId: 'top', brand: 'VARO STUDIO', name: '레이어드 전용 롱 티셔츠', price: 22000, salePrice: null, badge: 'best',
    mainImg: './assets/products/P029_main.gif', // 레이어드용 하얀 티
    subImg: './assets/products/P029_sub.gif',
    colors: [{ name: '화이트', hex: '#FFFFFF' }],
    sizes: ['S', 'M', 'L'], description: '레이어드에 최적화된 기장감.', rating: 4.9, reviewCount: 890
  },
  {
    id: 'P030', categoryId: 'top', brand: 'VARO', name: '베이직 모크넥 니트 티', price: 42000, salePrice: 35000, badge: 'sale',
    mainImg: './assets/products/P030_main.jpg', // 니트 티셔츠
    subImg: './assets/products/P030_sub.jpg',
    colors: [{ name: '블랙', hex: '#000000' }],
    sizes: ['M', 'L'], description: '부드러운 촉감의 모크넥 니트 티셔츠.', rating: 4.7, reviewCount: 45
  },

  // ── KNIT (6) ──────────────────────────────────────────
  {
    id: 'P031', categoryId: 'knit', brand: 'VARO STUDIO', name: '캐시미어 멜란지 라운드 니트', price: 89000, salePrice: 75000, badge: 'best',
    mainImg: './assets/products/P031_main.png', // 니트 질감
    subImg: './assets/products/P031_sub.png',
    colors: [{ name: '모카', hex: '#8B7D6B' }],
    sizes: ['M', 'L', 'XL'], description: '프리미엄 캐시미어 혼방 소재.', rating: 4.9, reviewCount: 167
  },
  {
    id: 'P032', categoryId: 'knit', brand: 'VARO', name: '오버핏 하찌 니트 가디건', price: 95000, salePrice: null, badge: 'hot',
    mainImg: './assets/products/P032_main.jpg', // 가디건 상반신
    subImg: './assets/products/P032_sub.jpg',
    colors: [{ name: '블랙', hex: '#1A1A1A' }],
    sizes: ['Free'], description: '도톰한 하찌 짜임의 가디건.', rating: 4.8, reviewCount: 224
  },
  {
    id: 'P033', categoryId: 'knit', brand: 'VARO STUDIO', name: '아가일 로고 브이넥 니트', price: 72000, salePrice: 62000, badge: 'sale',
    mainImg: './assets/products/P033_main.jpg', // 아가일 비슷한 패턴
    subImg: './assets/products/P033_sub.jpg',
    colors: [{ name: '네이비체크', hex: '#1C2B4B' }],
    sizes: ['M', 'L'], description: '클래식한 아가일 패턴의 니트.', rating: 4.6, reviewCount: 42
  },
  {
    id: 'P034', categoryId: 'knit', brand: 'VARO', name: '피셔맨 꽈배기 크루넥 니트', price: 82000, salePrice: null, badge: 'new',
    mainImg: './assets/products/P034_main.jpg', // 꽈배기 니트
    subImg: './assets/products/P034_sub.jpg',
    colors: [{ name: '크림', hex: '#FFFDD0' }],
    sizes: ['S', 'M', 'L'], description: '입체적인 꽈배기 짜임이 포인트.', rating: 4.7, reviewCount: 56
  },
  {
    id: 'P035', categoryId: 'knit', brand: 'VARO STUDIO', name: '부클 텍스처 풀오버', price: 69000, salePrice: null, badge: null,
    mainImg: 'https://imageapac1.lacoste.com/dw/image/v2/BBCL_PRD/on/demandware.static/-/Sites-master/default/dw5f0d20e5/AH232E-54N_XFJ_35.jpg?imwidth=320&impolicy=pctp&imdensity=1', // 부클 질감
    subImg: 'https://imageapac1.lacoste.com/dw/image/v2/BBCL_PRD/on/demandware.static/-/Sites-master/default/dw5f0d20e5/AH232E-54N_XFJ_35.jpg?imwidth=320&impolicy=pctp&imdensity=1',
    colors: [{ name: '멜란지그레이', hex: '#A9A9A9' }],
    sizes: ['M', 'L'], description: '독특한 부클 원단으로 포근한 느낌.', rating: 4.5, reviewCount: 18
  },
  {
    id: 'P036', categoryId: 'knit', brand: 'VARO', name: '집업 립 니트 자켓', price: 108000, salePrice: 92000, badge: 'best',
    mainImg: './assets/products/P036_main.jpg', // 니트 자켓
    subImg: './assets/products/P036_sub.jpg',
    colors: [{ name: '다크그레이', hex: '#2F4F4F' }],
    sizes: ['M', 'L', 'XL'], description: '자켓처럼 걸치기 좋은 집업 니트.', rating: 4.8, reviewCount: 88
  },

  // ── BOTTOM (8) ──────────────────────────────────────────
  {
    id: 'P037', categoryId: 'bottom', brand: 'VARO DENIM', name: '14oz 셀비지 리지드 데님', price: 98000, salePrice: null, badge: 'best',
    mainImg: './assets/products/P037_main.jpg', // 데님 원단 근접샷
    subImg: './assets/products/P037_sub.jpg',
    colors: [{ name: '리지드블루', hex: '#1B2B4B' }],
    sizes: ['28', '30', '32', '34', '36'], description: '입을수록 체형에 맞춰지는 프리미엄 데님.', rating: 4.9, reviewCount: 312
  },
  {
    id: 'P038', categoryId: 'bottom', brand: 'VARO', name: '세미 와이드 핀턱 슬랙스', price: 54000, salePrice: 45000, badge: 'hot',
    mainImg: './assets/products/P038_main.jpg', // 슬랙스 핏 (다리 중심)
    subImg: './assets/products/P038_sub.jpg',
    colors: [{ name: '그레이', hex: '#808080' }, { name: '블랙', hex: '#000000' }],
    sizes: ['S', 'M', 'L', 'XL'], description: '다리가 길어 보이는 세미 와이드 핏.', rating: 4.8, reviewCount: 840
  },
  {
    id: 'P039', categoryId: 'bottom', brand: 'VARO STUDIO', name: '투턱 코튼 치노 팬츠', price: 62000, salePrice: null, badge: 'new',
    mainImg: './assets/products/P039_main.jpg', // 치노 팬츠 (하반신)
    subImg: './assets/products/P039_sub.jpg',
    colors: [{ name: '베이지', hex: '#D2B48C' }],
    sizes: ['28', '30', '32', '34'], description: '기본에 충실한 워싱 코튼 치노.', rating: 4.7, reviewCount: 156
  },
  {
    id: 'P040', categoryId: 'bottom', brand: 'VARO', name: '와이드 카고 스트링 팬츠', price: 78000, salePrice: null, badge: 'hot',
    mainImg: './assets/products/P040_main.jpg', // 카고 팬츠
    subImg: './assets/products/P040_sub.jpg',
    colors: [{ name: '카키', hex: '#556B2F' }],
    sizes: ['M', 'L', 'XL'], description: '고프코어 무드의 카고 스트링 팬츠.', rating: 4.8, reviewCount: 92
  },
  {
    id: 'P041', categoryId: 'bottom', brand: 'VARO BASIC', name: '스웨트 조거 팬츠', price: 42000, salePrice: 32000, badge: 'sale',
    mainImg: './assets/products/P041_main.jpg', // 조거 팬츠 코디
    subImg: './assets/products/P041_sub.jpg',
    colors: [{ name: '멜란지', hex: '#A9A9A9' }],
    sizes: ['M', 'L', 'XL'], description: '집앞 마실룩부터 운동까지 완벽.', rating: 4.6, reviewCount: 231
  },
  {
    id: 'P042', categoryId: 'bottom', brand: 'VARO DENIM', name: '슬림 스트레이트 중청 데님', price: 68000, salePrice: null, badge: null,
    mainImg: './assets/products/P042_main.jpg', // 데님 (하반신)
    subImg: './assets/products/P042_sub.jpg',
    colors: [{ name: '미드인디고', hex: '#4A7FAF' }],
    sizes: ['28', '30', '32', '34'], description: '유행을 타지 않는 클래식한 데님.', rating: 4.7, reviewCount: 188
  },
  {
    id: 'P043', categoryId: 'bottom', brand: 'VARO', name: '코듀로이 원턱 팬츠', price: 72000, salePrice: null, badge: 'new',
    mainImg: './assets/products/P043_main.jpg', // 코듀로이 바지
    subImg: './assets/products/P043_sub.jpg',
    colors: [{ name: '브라운', hex: '#7B3F00' }],
    sizes: ['28', '30', '32'], description: '포근한 질감의 코듀로이 와이드 팬츠.', rating: 4.6, reviewCount: 41
  },
  {
    id: 'P044', categoryId: 'bottom', brand: 'VARO STUDIO', name: '나일론 이지 트랙 팬츠', price: 58000, salePrice: 42000, badge: 'sale',
    mainImg: './assets/products/P044_main.jpg', // 트랙 팬츠
    subImg: './assets/products/P044_sub.jpg',
    colors: [{ name: '스틸그레이', hex: '#4682B4' }],
    sizes: ['M', 'L'], description: '가볍고 시원한 나일론 이지 팬츠.', rating: 4.5, reviewCount: 56
  },

  // ── SHOES & ACC (6) ──────────────────────────────────────────
  {
    id: 'P045', categoryId: 'shoes', brand: 'VARO', name: '독일군 스니커즈 리마스터', price: 98000, salePrice: null, badge: 'best',
    mainImg: './assets/products/P045_main.png', // 스니커즈 (신발만)
    subImg: './assets/products/P045_sub.png',
    colors: [{ name: '화이트/그레이', hex: '#F5F5F0' }],
    sizes: ['250', '260', '270', '280'], description: '모든 룩에 잘 어울리는 만능 스니커즈.', rating: 4.9, reviewCount: 1450
  },
  {
    id: 'P046', categoryId: 'shoes', brand: 'VARO STUDIO', name: '클래식 더비 슈즈', price: 145000, salePrice: 118000, badge: 'hot',
    mainImg: './assets/products/P046_main.jpg', // 구두 (신발만)
    subImg: './assets/products/P046_sub.jpg',
    colors: [{ name: '블랙', hex: '#000000' }],
    sizes: ['250', '260', '270', '280'], description: '고급 가죽 소재의 베이직 더비 슈즈.', rating: 4.8, reviewCount: 421
  },
  {
    id: 'P047', categoryId: 'shoes', brand: 'VARO', name: '캔버스 척 스니커즈', price: 58000, salePrice: null, badge: null,
    mainImg: './assets/products/P047_main.jpg', // 스니커즈
    subImg: './assets/products/P047_sub.jpg',
    colors: [{ name: '화이트', hex: '#FFFFFF' }],
    sizes: ['240', '250', '260', '270', '280'], description: '언제 어디서나 가볍게 신기 좋은 캔버스화.', rating: 4.7, reviewCount: 890
  },
  {
    id: 'P048', categoryId: 'acc', brand: 'VARO STUDIO', name: '레더 미니 크로스백', price: 125000, salePrice: 98000, badge: 'best',
    mainImg: './assets/products/P048_main.jpg', // 가방 착용 (얼굴 없음)
    subImg: './assets/products/P048_sub.jpg',
    colors: [{ name: '블랙', hex: '#1A1A1A' }],
    sizes: ['Free'], description: '군더더기 없는 미니멀한 레더 백.', rating: 4.9, reviewCount: 156
  },
  {
    id: 'P049', categoryId: 'acc', brand: 'VARO', name: '실버 체인 브레이슬릿', price: 42000, salePrice: null, badge: 'new',
    mainImg: './assets/products/P049_main.png', // 팔찌
    subImg: './assets/products/P049_sub.png',
    colors: [{ name: '실버', hex: '#C0C0C0' }],
    sizes: ['Free'], description: '은은한 포인트가 되는 체인 팔찌.', rating: 4.7, reviewCount: 42
  },
  {
    id: 'P050', categoryId: 'acc', brand: 'VARO STUDIO', name: '오버사이즈 울 머플러', price: 38000, salePrice: null, badge: null,
    mainImg: './assets/products/P050_main.jpg', // 머플러 착용샷
    subImg: './assets/products/P050_sub.jpg',
    colors: [{ name: '오트밀그레이', hex: '#A9A9A9' }],
    sizes: ['Free'], description: '추운 겨울을 위한 포근한 울 머플러.', rating: 4.8, reviewCount: 120
  }
];

const HERO_SLIDES = [
  { id: 'H_JAN', panels: ['./assets/lookbook/lookbook_1.png'] },
  { id: 'H_FEB', panels: ['./assets/lookbook/lookbook_2.png'] },
  { id: 'H_MAR', panels: ['./assets/lookbook/lookbook_3.png'] },
  { id: 'H_APR', panels: ['./assets/lookbook/lookbook_4.png'] },
  { id: 'H_MAY', panels: ['./assets/lookbook/lookbook_5.png'] },
  { id: 'H_JUN', panels: ['./assets/lookbook/lookbook_6.png'] },
  { id: 'H_JUL', panels: ['./assets/lookbook/lookbook_7.png'] },
  { id: 'H_AUG', panels: ['./assets/lookbook/lookbook_8.png'] },
  { id: 'H_SEP', panels: ['./assets/lookbook/lookbook_9.png'] },
  { id: 'H_OCT', panels: ['./assets/lookbook/lookbook_10.png'] },
  { id: 'H_NOV', panels: ['./assets/lookbook/lookbook_11.png'] },
  { id: 'H_DEC', panels: ['./assets/lookbook/lookbook_12.png'] },
];

const REVIEWS = {};
const MARQUEE_ITEMS = ['PREMIUM ESSENTIALS FOR MEN', 'FREE SHIPPING OVER 50,000 KRW', '2026 VARO STUDIO COLLECTION'];
const SORT_OPTIONS = [{ value: 'newest', label: '신상품순' }, { value: 'popular', label: '인기순' }];

const SIZE_GUIDE = {
  'outer': [
    { size: 'S', shoulder: '46', chest: '54', length: '68' },
    { size: 'M', shoulder: '48', chest: '56', length: '70' },
    { size: 'L', shoulder: '50', chest: '58', length: '72' },
    { size: 'XL', shoulder: '52', chest: '60', length: '74' }
  ],
  'top': [
    { size: 'S', shoulder: '44', chest: '50', length: '66' },
    { size: 'M', shoulder: '46', chest: '52', length: '68' },
    { size: 'L', shoulder: '48', chest: '54', length: '70' },
    { size: 'XL', shoulder: '50', chest: '56', length: '72' }
  ],
  'shirt': [
    { size: 'M', shoulder: '47', chest: '55', length: '75' },
    { size: 'L', shoulder: '49', chest: '57', length: '77' },
    { size: 'XL', shoulder: '51', chest: '59', length: '79' }
  ],
  'bottom': [
    { size: 'S', waist: '38', hip: '50', length: '102' },
    { size: 'M', waist: '40', hip: '52', length: '104' },
    { size: 'L', waist: '42', hip: '54', length: '106' },
    { size: 'XL', waist: '44', hip: '56', length: '108' }
  ],
  'shoes': [
    { size: '250', kr: '250', eu: '40', uk: '6' },
    { size: '260', kr: '260', eu: '41', uk: '7' },
    { size: '270', kr: '270', eu: '42', uk: '8' },
    { size: '280', kr: '280', eu: '43', uk: '9' }
  ],
  'acc': [
    { size: 'Free', description: 'One Size fits all' }
  ]
};

if (typeof window !== 'undefined') {
  window.VARO_DATA = { CATEGORIES, PRODUCTS, WEEKLY_BEST, HERO_SLIDES, MARQUEE_ITEMS, REVIEWS, SORT_OPTIONS, SIZE_GUIDE };
  window.VARO_CONFIG = VARO_CONFIG;
}
