// db/seed.js — 초기 데이터 삽입 (MySQL 용)
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const db = require('./database');

async function seed() {
  console.log('[Seed] VARO 초기 데이터 삽입 시작 (MySQL)...\n');

  try {
    await db.initDB();

    // 기존 데이터 제거 (시연용 데이터 보존을 위해 주석 처리)
    /*
    console.log('[Seed] 기존 데이터 초기화 중...');
    await db.execute('DELETE FROM reviews');
    await db.execute('DELETE FROM wishlist');
    await db.execute('DELETE FROM cart');
    await db.execute('DELETE FROM orders');
    await db.execute('DELETE FROM products');
    await db.execute('DELETE FROM users');
    */

    /* ── 사용자 데이터 ── */
    const users = [
      { name: '관리자', email: 'admin@varo.com', password: 'varo2026admin', phone: '010-0000-0001', grade: '관리자', points: 0, spent: 0, admin: 1 },
      { name: '매니저', email: 'manager@varo.com', password: 'varo2026manager', phone: '010-0000-0002', grade: '매니저', points: 0, spent: 0, admin: 1 },
      { name: '김민준', email: 'demo@varo.com', password: 'varo2026', phone: '010-1234-5678', grade: 'dia', points: 12400, spent: 874200, admin: 0 },
      { name: '이도현', email: 'dohyun@test.com', password: 'test1234', phone: '010-2345-6789', grade: 'gold', points: 3200, spent: 340000, admin: 0 },
      { name: '최현우', email: 'hyunwoo@test.com', password: 'test1234', phone: '010-4567-8901', grade: 'silver', points: 1500, spent: 150000, admin: 0 },
      { name: '박해찬', email: 'haechan@test.com', password: 'test1234', phone: '010-3456-7890', grade: 'bronze', points: 420, spent: 42000, admin: 0 },
    ];

    for (const u of users) {
      const hash = bcrypt.hashSync(u.password, 10);
      await db.execute(`
        INSERT IGNORE INTO users (name, email, password, phone, grade, points, total_spent, is_admin)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [u.name, u.email, hash, u.phone, u.grade, u.points, u.spent, u.admin]);
    }
    /* ── 카테고리 데이터 ── */
    const categories = [
      { name: '아우터', slug: 'outer', order: 1 },
      { name: '셔츠', slug: 'shirt', order: 2 },
      { name: '상의', slug: 'top', order: 3 },
      { name: '니트', slug: 'knit', order: 4 },
      { name: '하의', slug: 'bottom', order: 5 },
      { name: '슈즈', slug: 'shoes', order: 6 },
      { name: '악세서리', slug: 'acc', order: 7 },
    ];

    for (const c of categories) {
      await db.execute(`
        INSERT IGNORE INTO categories (name, slug, sort_order, is_active)
        VALUES (?, ?, ?, 1)
      `, [c.name, c.slug, c.order]);
    }
    console.log(`[Seed] 카테고리 ${categories.length}개 삽입 완료`);

    console.log(`[Seed] 사용자 ${users.length}명 삽입 완료`);

    /* ── 상품 데이터 ── */
    const products = [
      {
        code: 'P001', cat: 'outer', name: '핸드메이드 캐시미어 롱 코트', price: 289000, sale: 245000, badge: 'best',
        styles: ['boyfriend', 'formal'],
        main: './assets/products/P001_main.png',
        sub: './assets/products/P001_sub.png',
        imgs: ['./assets/products/P001_main.png', './assets/products/P001_sub.png'],
        colors: [{ name: '카멜', hex: '#C8956A' }, { name: '블랙', hex: '#1C1A16' }],
        sizes: ['M', 'L', 'XL'], soldOut: [],
        desc: '정갈한 실루엣의 핸드메이드 코트입니다.',
        mat: 'Cashemere Blend', care: '드라이클리닝 전용',
        rating: 4.9, reviews: 214, event: 0
      },
      {
        code: 'P002', cat: 'outer', name: '해링턴 코튼 블루종', price: 158000, sale: 128000, badge: 'best',
        styles: ['boyfriend', 'casual'],
        main: './assets/products/P002_main.png',
        sub: './assets/products/P002_sub.png',
        imgs: ['./assets/products/P002_main.png', './assets/products/P001_sub.png'],
        colors: [{ name: '네이비', hex: '#2A3F6A' }, { name: '카키', hex: '#4B5320' }],
        sizes: ['M', 'L', 'XL'], soldOut: [],
        desc: '클래식한 무드의 데일리 블루종 자켓.',
        mat: '100% Cotton', care: '단독 세탁 권장',
        rating: 4.8, reviews: 152, event: 0
      },
      {
        code: 'P003', cat: 'outer', name: '릴렉스핏 나일론 윈드브레이커', price: 89000, sale: null, badge: 'new',
        styles: ['casual'],
        main: './assets/products/P003_main.jpg',
        sub: './assets/products/P003_sub.jpg',
        imgs: ['./assets/products/P003_main.jpg', './assets/products/P003_sub.jpg'],
        colors: [{ name: '그레이', hex: '#7A7A7A' }],
        sizes: ['Free'], soldOut: [],
        desc: '가벼운 고밀도 나일론 소재의 윈드브레이커.',
        mat: 'High-density Nylon', care: '찬물 세탁',
        rating: 4.7, reviews: 88, event: 0
      },
      {
        code: 'P004', cat: 'outer', name: '덕다운 미니멀 숏 패딩', price: 198000, sale: 168000, badge: 'hot',
        styles: ['casual'],
        main: './assets/products/P004_main.png',
        sub: './assets/products/P004_sub.png',
        imgs: ['./assets/products/P004_main.png', './assets/products/P004_sub.png'],
        colors: [{ name: '매트블랙', hex: '#1A1A1A' }],
        sizes: ['M', 'L', 'XL'], soldOut: [],
        desc: '한파에도 걱정 없는 프리미엄 덕다운.',
        mat: 'Duck Down 80/20', care: '전문 세탁 권장',
        rating: 4.9, reviews: 67, event: 0
      },
      {
        code: 'P005', cat: 'outer', name: '바라쿠타 G9 스타일 자켓', price: 135000, sale: null, badge: null,
        styles: ['formal'],
        main: './assets/products/P005_main.jpg',
        sub: './assets/products/P005_sub.jpg',
        imgs: ['./assets/products/P005_main.jpg', './assets/products/P005_sub.jpg'],
        colors: [{ name: '베이지', hex: '#E2D3B8' }],
        sizes: ['M', 'L', 'XL'], soldOut: [],
        desc: '영국 클래식 감성의 해링턴 자켓.',
        mat: 'Cotton/Poly Blend', care: '드라이클리닝',
        rating: 4.6, reviews: 42, event: 0
      }
    ];

    for (const p of products) {
      await db.execute(`
        INSERT IGNORE INTO products (
          product_code, category_id, brand, name, price, sale_price, badge,
          styles, main_img, sub_img, images, colors, sizes, sold_out_sizes,
          description, material, care, rating, review_count, is_event, stock
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 100)
      `, [
        p.code, p.cat, 'VARO', p.name, p.price, p.sale, p.badge,
        JSON.stringify(p.styles), p.main, p.sub, JSON.stringify(p.imgs),
        JSON.stringify(p.colors), JSON.stringify(p.sizes), JSON.stringify(p.soldOut),
        p.desc, p.mat, p.care, p.rating, p.reviews, p.event
      ]);
    }
    console.log(`상품 ${products.length}개 삽입 완료`);

    // 즉시 확인
    const checkCount = await db.query('SELECT count(*) as cnt FROM products');
    console.log('\n MySQL 초기 데이터 삽입 완료!');
  } catch (err) {
    console.error('\n 시딩 중 오류 발생:', err.message);
  }
}

seed();
