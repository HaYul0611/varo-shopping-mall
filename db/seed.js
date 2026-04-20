// db/seed.js — 초기 데이터 삽입 (npm run seed)
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const db     = require('./database');

console.log('🌱 VARO 초기 데이터 삽입 시작...\n');

/* ── 기존 데이터 초기화 ─────────────────── */
db.exec(`
  DELETE FROM reviews;
  DELETE FROM wishlist;
  DELETE FROM cart;
  DELETE FROM orders;
  DELETE FROM products;
  DELETE FROM users;
`);

/* ══════════════════════════════════════════
   사용자 데이터
══════════════════════════════════════════ */
const insertUser = db.prepare(`
  INSERT INTO users (name, email, password, phone, grade, points, total_spent, is_admin)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const users = [
  { name:'관리자', email:'admin@varo.com',  password:'varo2026admin', phone:'010-0000-0001', grade:'vip',    points:0,      spent:0,       admin:1 },
  { name:'김민준', email:'demo@varo.com',   password:'varo2026',      phone:'010-1234-5678', grade:'gold',   points:12400,  spent:874200,  admin:0 },
  { name:'이도현', email:'dohyun@test.com', password:'test1234',      phone:'010-2345-6789', grade:'silver', points:3200,   spent:218000,  admin:0 },
  { name:'박해찬', email:'haechan@test.com',password:'test1234',      phone:'010-3456-7890', grade:'basic',  points:420,    spent:42000,   admin:0 },
];

for (const u of users) {
  const hash = bcrypt.hashSync(u.password, 10);
  insertUser.run(u.name, u.email, hash, u.phone, u.grade, u.points, u.spent, u.admin);
}
console.log(`✅ 사용자 ${users.length}명 삽입`);

/* ══════════════════════════════════════════
   상품 데이터 (16개 — 컨셉별)
   이미지: Unsplash 실제 패션 사진
══════════════════════════════════════════ */
const insertProduct = db.prepare(`
  INSERT INTO products (
    product_code, category_id, brand, name, price, sale_price, badge,
    styles, main_img, sub_img, images, colors, sizes, sold_out_sizes,
    description, material, care, rating, review_count, is_event
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?
  )
`);

const products = [
  // ── 아우터 ─────────────────────────────
  {
    code:'P001', cat:'outer', name:'더블 브레스티드 울 코트',
    price:198000, sale:null, badge:'best',
    styles:['boyfriend','formal'],
    main:'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=800&fit=crop&q=85',
    sub: 'https://images.unsplash.com/photo-1507679799797-b90bd27e86da?w=600&h=800&fit=crop&q=85',
    imgs:['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=800&fit=crop&q=85','https://images.unsplash.com/photo-1507679799797-b90bd27e86da?w=600&h=800&fit=crop&q=85','https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600&h=800&fit=crop&q=85'],
    colors:[{name:'카멜',hex:'#C8956A'},{name:'블랙',hex:'#1C1A16'},{name:'그레이',hex:'#7A7672'}],
    sizes:['S','M','L','XL'], soldOut:['S'],
    desc:'하객룩·데이트룩 완벽 코트. 울 혼방 소재가 드레이프감을 극대화합니다.',
    mat:'70% Wool, 30% Polyester', care:'드라이클리닝 전용',
    rating:4.9, reviews:214, event:0,
  },
  {
    code:'P002', cat:'outer', name:'오버사이즈 데님 자켓',
    price:128000, sale:98000, badge:'sale',
    styles:['boyfriend','casual'],
    main:'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop&q=85',
    sub: 'https://images.unsplash.com/photo-1514473776127-61e2dc1dded3?w=600&h=800&fit=crop&q=85',
    imgs:['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop&q=85','https://images.unsplash.com/photo-1514473776127-61e2dc1dded3?w=600&h=800&fit=crop&q=85'],
    colors:[{name:'라이트블루',hex:'#A8C4D8'},{name:'인디고',hex:'#2A3F6A'}],
    sizes:['S','M','L','XL','XXL'], soldOut:[],
    desc:'남친룩 핵심 아이템. 어떤 하의와도 자연스러운 오버핏 데님 자켓.',
    mat:'100% Cotton Denim', care:'30°C 이하 / 뒤집어 세탁',
    rating:4.6, reviews:87, event:0,
  },
  {
    code:'P003', cat:'outer', name:'나일론 퀄팅 패딩 재킷',
    price:148000, sale:null, badge:'new',
    styles:['casual','boyfriend'],
    main:'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop&q=85',
    sub: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop&q=85',
    imgs:['https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop&q=85','https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop&q=85'],
    colors:[{name:'블랙',hex:'#1C1A16'},{name:'올리브',hex:'#4A5240'}],
    sizes:['S','M','L','XL'], soldOut:[],
    desc:'경량 나일론 퀄팅 패딩. 캐주얼 데이트룩과 완벽한 조합.',
    mat:'100% Nylon / Polyester Fill 80g', care:'30°C 이하 단독 세탁',
    rating:4.7, reviews:43, event:0,
  },
  // ── 셔츠 ────────────────────────────────
  {
    code:'P004', cat:'shirt', name:'스트라이프 오버핏 셔츠',
    price:72000, sale:null, badge:'new',
    styles:['boyfriend','couple','casual'],
    main:'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop&q=85',
    sub: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&h=800&fit=crop&q=85',
    imgs:['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop&q=85','https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&h=800&fit=crop&q=85','https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&h=800&fit=crop&q=85'],
    colors:[{name:'블루 스트라이프',hex:'#6B8FAF'},{name:'화이트',hex:'#F5F5F0'}],
    sizes:['S','M','L','XL'], soldOut:[],
    desc:'커플룩으로 가장 많이 찾는 스트라이프 셔츠. 1+1 이벤트 대상.',
    mat:'100% Cotton Linen Blend', care:'30°C 이하 단독 세탁',
    rating:4.8, reviews:156, event:1,
  },
  {
    code:'P005', cat:'shirt', name:'화이트 포플린 드레스 셔츠',
    price:68000, sale:null, badge:null,
    styles:['formal','boyfriend'],
    main:'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&h=800&fit=crop&q=85',
    sub: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop&q=85',
    imgs:['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&h=800&fit=crop&q=85','https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop&q=85'],
    colors:[{name:'화이트',hex:'#F5F5F0'},{name:'라이트블루',hex:'#C5D8E8'}],
    sizes:['S','M','L','XL'], soldOut:[],
    desc:'하객룩·데이트룩 필수템. 깔끔한 포플린 소재.',
    mat:'100% Cotton Poplin', care:'30°C 이하 / 중온 다림질',
    rating:4.5, reviews:92, event:0,
  },
  // ── 상의 ────────────────────────────────
  {
    code:'P006', cat:'top', name:'코튼 오버핏 헤비 티셔츠',
    price:42000, sale:null, badge:'new',
    styles:['casual','boyfriend','couple'],
    main:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop&q=85',
    sub: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=800&fit=crop&q=85',
    imgs:['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop&q=85','https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=800&fit=crop&q=85','https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop&q=85'],
    colors:[{name:'블랙',hex:'#1C1A16'},{name:'화이트',hex:'#F5F5F0'},{name:'그레이',hex:'#8A8680'},{name:'베이지',hex:'#D4C9B8'}],
    sizes:['S','M','L','XL','XXL'], soldOut:[],
    desc:'240gsm 헤비 코튼. 남친룩·커플룩 데일리템. 1+1 이벤트 대상.',
    mat:'100% Cotton 240gsm', care:'30°C 이하 / 건조기 금지',
    rating:4.7, reviews:328, event:1,
  },
  {
    code:'P007', cat:'top', name:'스웨트 오버사이즈 후드',
    price:88000, sale:null, badge:'best',
    styles:['casual','couple'],
    main:'https://images.unsplash.com/photo-1556821840-3a63f8550d64?w=600&h=800&fit=crop&q=85',
    sub: 'https://images.unsplash.com/photo-1565084888279-aca607bb73f7?w=600&h=800&fit=crop&q=85',
    imgs:['https://images.unsplash.com/photo-1556821840-3a63f8550d64?w=600&h=800&fit=crop&q=85','https://images.unsplash.com/photo-1565084888279-aca607bb73f7?w=600&h=800&fit=crop&q=85','https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=600&h=800&fit=crop&q=85'],
    colors:[{name:'블랙',hex:'#1C1A16'},{name:'차콜',hex:'#3A3A3A'},{name:'아이보리',hex:'#F0EDE4'}],
    sizes:['S','M','L','XL','XXL'], soldOut:['S'],
    desc:'커플룩 1위! 320gsm 프리미엄 플리스. 1+1 이벤트 대상.',
    mat:'80% Cotton, 20% Polyester 320gsm', care:'40°C 이하 / 단독 세탁',
    rating:4.9, reviews:203, event:1,
  },
  {
    code:'P016', cat:'top', name:'피그먼트 롱슬리브 티셔츠',
    price:46000, sale:null, badge:'new',
    styles:['casual','couple'],
    main:'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=800&fit=crop&q=85',
    sub: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop&q=85',
    imgs:['https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=800&fit=crop&q=85','https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop&q=85'],
    colors:[{name:'빈티지블랙',hex:'#2A2A2A'},{name:'워시드그레이',hex:'#6A6A6A'},{name:'아이보리',hex:'#F0EDE4'}],
    sizes:['S','M','L','XL'], soldOut:[],
    desc:'커플룩 인기 폭발. 피그먼트 워싱 빈티지 무드 롱슬리브. 1+1 이벤트 대상.',
    mat:'100% Cotton Pigment Washed', care:'30°C 이하 단독 세탁',
    rating:4.6, reviews:118, event:1,
  },
  // ── 니트 ────────────────────────────────
  {
    code:'P008', cat:'knit', name:'하프집업 골지 니트',
    price:98000, sale:78000, badge:'sale',
    styles:['boyfriend','formal','couple'],
    main:'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&h=800&fit=crop&q=85',
    sub: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop&q=85',
    imgs:['https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&h=800&fit=crop&q=85','https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop&q=85'],
    colors:[{name:'오트밀',hex:'#D4C9B8'},{name:'브라운',hex:'#7A5C44'},{name:'블랙',hex:'#1C1A16'}],
    sizes:['S','M','L','XL'], soldOut:[],
    desc:'데이트룩·남친룩 최애 니트. 골지 패턴으로 슬림 실루엣.',
    mat:'80% Cotton, 20% Nylon', care:'30°C 이하 손세탁',
    rating:4.8, reviews:176, event:0,
  },
  // ── 하의 ────────────────────────────────
  {
    code:'P009', cat:'bottom', name:'와이드 카고 팬츠',
    price:89000, sale:69000, badge:'sale',
    styles:['casual','boyfriend'],
    main:'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop&q=85',
    sub: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop&q=85',
    imgs:['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop&q=85','https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop&q=85','https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop&q=85'],
    colors:[{name:'카키',hex:'#6B6B47'},{name:'블랙',hex:'#1C1A16'},{name:'베이지',hex:'#C8B89A'}],
    sizes:['S','M','L','XL','XXL'], soldOut:['S'],
    desc:'캐주얼룩 완성. 넉넉한 와이드 핏과 실용적인 카고 포켓.',
    mat:'98% Cotton, 2% Elastane', care:'30°C 이하 / 뒤집어 세탁',
    rating:4.5, reviews:89, event:0,
  },
  {
    code:'P010', cat:'bottom', name:'슬림 테이퍼드 슬랙스',
    price:82000, sale:null, badge:null,
    styles:['formal','boyfriend'],
    main:'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&h=800&fit=crop&q=85',
    sub: 'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=600&h=800&fit=crop&q=85',
    imgs:['https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&h=800&fit=crop&q=85','https://images.unsplash.com/photo-1560243563-062bfc001d68?w=600&h=800&fit=crop&q=85'],
    colors:[{name:'차콜',hex:'#3A3A3A'},{name:'네이비',hex:'#1A2744'},{name:'베이지',hex:'#C8B89A'}],
    sizes:['28','30','32','34'], soldOut:['28'],
    desc:'하객룩·남친룩 기본. 어떤 상의와도 깔끔하게.',
    mat:'65% Polyester, 33% Rayon, 2% Elastane', care:'30°C 이하 / 중온 다림질',
    rating:4.4, reviews:102, event:0,
  },
  {
    code:'P011', cat:'bottom', name:'셀비지 데님 와이드 팬츠',
    price:96000, sale:null, badge:'best',
    styles:['casual','couple'],
    main:'https://images.unsplash.com/photo-1603252109612-6d5fee16a54d?w=600&h=800&fit=crop&q=85',
    sub: 'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&h=800&fit=crop&q=85',
    imgs:['https://images.unsplash.com/photo-1603252109612-6d5fee16a54d?w=600&h=800&fit=crop&q=85','https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&h=800&fit=crop&q=85'],
    colors:[{name:'미드블루',hex:'#4A7399'},{name:'라이트블루',hex:'#A8C4D8'},{name:'블랙',hex:'#1A1A1A'}],
    sizes:['28','30','32','34','36'], soldOut:[],
    desc:'12oz 셀비지 데님. 사용할수록 에이징이 쌓이는 프리미엄 와이드.',
    mat:'100% Cotton Selvage Denim 12oz', care:'30°C 이하 단독 / 자연 건조',
    rating:4.7, reviews:148, event:0,
  },
  // ── 세트업 ──────────────────────────────
  {
    code:'P012', cat:'setup', name:'체크 울 블레이저 세트업',
    price:298000, sale:238000, badge:'sale',
    styles:['formal','couple','boyfriend'],
    main:'https://images.unsplash.com/photo-1507679799797-b90bd27e86da?w=600&h=800&fit=crop&q=85',
    sub: 'https://images.unsplash.com/photo-1549062572-544a64fb0c56?w=600&h=800&fit=crop&q=85',
    imgs:['https://images.unsplash.com/photo-1507679799797-b90bd27e86da?w=600&h=800&fit=crop&q=85','https://images.unsplash.com/photo-1549062572-544a64fb0c56?w=600&h=800&fit=crop&q=85','https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600&h=800&fit=crop&q=85'],
    colors:[{name:'그레이 체크',hex:'#7A7A7A'},{name:'네이비',hex:'#1A2744'}],
    sizes:['S','M','L','XL'], soldOut:['S'],
    desc:'하객룩 완성 세트업. 커플 하객룩으로 인기.',
    mat:'60% Wool, 40% Polyester', care:'드라이클리닝 권장',
    rating:4.8, reviews:67, event:0,
  },
  // ── 슈즈 ────────────────────────────────
  {
    code:'P013', cat:'shoes', name:'청키 러버솔 로퍼',
    price:128000, sale:null, badge:null,
    styles:['boyfriend','formal'],
    main:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop&q=85',
    sub: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=800&fit=crop&q=85',
    imgs:['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop&q=85','https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=800&fit=crop&q=85'],
    colors:[{name:'블랙',hex:'#1C1A16'},{name:'탄',hex:'#B8956A'}],
    sizes:['250','255','260','265','270','275','280'], soldOut:['275','280'],
    desc:'하객룩·남친룩 완성 슈즈. 청키 솔로 키도 살리고.',
    mat:'Upper: Genuine Leather / Outsole: Rubber', care:'가죽 전용 클리너',
    rating:4.6, reviews:77, event:0,
  },
  // ── 악세서리 ────────────────────────────
  {
    code:'P014', cat:'acc', name:'소프트 레더 미니 크로스백',
    price:158000, sale:null, badge:'new',
    styles:['casual','couple'],
    main:'https://images.unsplash.com/photo-1548036161-2b1a0e5b4a7b?w=600&h=800&fit=crop&q=85',
    sub: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop&q=85',
    imgs:['https://images.unsplash.com/photo-1548036161-2b1a0e5b4a7b?w=600&h=800&fit=crop&q=85','https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop&q=85'],
    colors:[{name:'블랙',hex:'#1C1A16'},{name:'탄',hex:'#B8956A'}],
    sizes:['FREE'], soldOut:[],
    desc:'커플룩 완성 크로스백. 베지터블 무두질 가죽.',
    mat:'Full-grain Vegetable-tanned Leather', care:'전용 크림 도포',
    rating:4.9, reviews:31, event:0,
  },
  {
    code:'P015', cat:'acc', name:'스테인리스 체인 브레이슬릿',
    price:48000, sale:null, badge:'new',
    styles:['casual','couple'],
    main:'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&h=800&fit=crop&q=85',
    sub: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=600&h=800&fit=crop&q=85',
    imgs:['https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&h=800&fit=crop&q=85','https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=600&h=800&fit=crop&q=85'],
    colors:[{name:'실버',hex:'#C0C0C0'},{name:'골드',hex:'#D4AF37'}],
    sizes:['FREE'], soldOut:[],
    desc:'커플룩 소품 1위. 316L 스테인리스로 변색 없이 오래 착용. 1+1 이벤트 대상.',
    mat:'316L Stainless Steel', care:'물기 제거 후 보관',
    rating:4.7, reviews:52, event:1,
  },
];

for (const p of products) {
  insertProduct.run(
    p.code, p.cat, 'VARO', p.name, p.price, p.sale ?? null, p.badge ?? null,
    JSON.stringify(p.styles), p.main, p.sub, JSON.stringify(p.imgs),
    JSON.stringify(p.colors), JSON.stringify(p.sizes), JSON.stringify(p.soldOut),
    p.desc, p.mat, p.care, p.rating, p.reviews, p.event
  );
}
console.log(`✅ 상품 ${products.length}개 삽입`);

/* ══════════════════════════════════════════
   샘플 주문 데이터
══════════════════════════════════════════ */
const demoUser = db.prepare('SELECT id FROM users WHERE email = ?').get('demo@varo.com');

if (demoUser) {
  const insertOrder = db.prepare(`
    INSERT INTO orders (order_number, user_id, items, subtotal, discount, shipping_fee, total,
      recipient_name, recipient_phone, address, payment_method, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const p1 = db.prepare('SELECT id FROM products WHERE product_code = ?').get('P001');
  const p7 = db.prepare('SELECT id FROM products WHERE product_code = ?').get('P007');

  const items1 = JSON.stringify([{productId:p1?.id, name:'더블 브레스티드 울 코트', price:198000, qty:1, size:'M', color:'카멜'}]);
  insertOrder.run('ORD-2026-001', demoUser.id, items1, 198000, 19800, 0, 178200, '김민준', '010-1234-5678', '서울특별시 강남구 테헤란로 123', 'card', 'shipped');

  const items2 = JSON.stringify([{productId:p7?.id, name:'스웨트 오버사이즈 후드', price:88000, qty:2, size:'L', color:'블랙'}]);
  insertOrder.run('ORD-2026-002', demoUser.id, items2, 176000, 0, 0, 176000, '김민준', '010-1234-5678', '서울특별시 강남구 테헤란로 123', 'kakaopay', 'delivered');

  console.log('✅ 샘플 주문 2건 삽입');
}

/* ══════════════════════════════════════════
   샘플 리뷰
══════════════════════════════════════════ */
const insertReview = db.prepare(`
  INSERT INTO reviews (product_id, user_id, rating, body, size_info)
  VALUES (?, ?, ?, ?, ?)
`);

const demo = db.prepare('SELECT id FROM users WHERE email = ?').get('demo@varo.com');
const p001 = db.prepare('SELECT id FROM products WHERE product_code = ?').get('P001');
const p007 = db.prepare('SELECT id FROM products WHERE product_code = ?').get('P007');
const p008 = db.prepare('SELECT id FROM products WHERE product_code = ?').get('P008');

if (demo && p001) {
  insertReview.run(p001.id, demo.id, 5, '하객룩으로 완벽합니다. 카멜 색상 너무 예쁘고 소재도 고급져요.', 'M 구매 / 평소 M 착용');
}
if (demo && p007) {
  insertReview.run(p007.id, demo.id, 5, '커플룩으로 샀는데 여자친구랑 너무 잘 어울려요! 오버핏이라 편하고 320gsm 두께감 최고.', 'L 구매 / 평소 M 착용');
}
if (demo && p008) {
  insertReview.run(p008.id, demo.id, 4, '오트밀 색상 진짜 예쁘고 남친룩으로 데이트할 때마다 입어요.', 'M 구매 / 평소 M 착용');
}
console.log('✅ 샘플 리뷰 3건 삽입');

console.log('\n🎉 초기 데이터 삽입 완료!');
console.log('   → npm start 로 서버를 시작하세요');
console.log('   → http://localhost:3000/varo/\n');
