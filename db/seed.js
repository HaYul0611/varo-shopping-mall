// db/seed.js — 초기 데이터 삽입 (MySQL 용)
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const db = require('./database');

async function seed() {
  console.log('[Seed] VARO 초기 데이터 삽입 시작 (MySQL)...\n');

  try {
    await db.initDB();

    // 트랜잭션으로 안전하게 처리
    await db.withTransaction(async (conn) => {
      // 기존 데이터 제거
      console.log('[Seed] 기존 데이터 초기화 중...');
      await conn.execute('DELETE FROM reviews');
      await conn.execute('DELETE FROM wishlist');
      await conn.execute('DELETE FROM cart');
      await conn.execute('DELETE FROM orders');
      await conn.execute('DELETE FROM products');
      await conn.execute('DELETE FROM users');

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
        await conn.execute(`
          INSERT INTO users (name, email, password, phone, grade, points, total_spent, is_admin)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [u.name, u.email, hash, u.phone, u.grade, u.points, u.spent, u.admin]);
      }
      console.log(`[Seed] 사용자 ${users.length}명 삽입 완료`);

      /* ── 상품 데이터 ── */
      const products = [
        {
          code: 'P001', cat: 'outer', name: '더블 브레스티드 울 코트', price: 198000, sale: null, badge: 'best',
          styles: ['boyfriend', 'formal'],
          main: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=800&fit=crop&q=85',
          sub: 'https://images.unsplash.com/photo-1507679799797-b90bd27e86da?w=600&h=800&fit=crop&q=85',
          imgs: ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=800&fit=crop&q=85', 'https://images.unsplash.com/photo-1507679799797-b90bd27e86da?w=600&h=800&fit=crop&q=85', 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600&h=800&fit=crop&q=85'],
          colors: [{ name: '카멜', hex: '#C8956A' }, { name: '블랙', hex: '#1C1A16' }, { name: '그레이', hex: '#7A7672' }],
          sizes: ['S', 'M', 'L', 'XL'], soldOut: ['S'],
          desc: '하객룩·데이트룩 완벽 코트. 울 혼방 소재가 드레이프감을 극대화합니다.',
          mat: '70% Wool, 30% Polyester', care: '드라이클리닝 전용',
          rating: 4.9, reviews: 214, event: 0,
        },
        {
          code: 'P002', cat: 'outer', name: '오버사이즈 데님 자켓', price: 128000, sale: 98000, badge: 'sale',
          styles: ['boyfriend', 'casual'],
          main: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop&q=85',
          sub: 'https://images.unsplash.com/photo-1514473776127-61e2dc1dded3?w=600&h=800&fit=crop&q=85',
          imgs: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop&q=85', 'https://images.unsplash.com/photo-1514473776127-61e2dc1dded3?w=600&h=800&fit=crop&q=85'],
          colors: [{ name: '라이트블루', hex: '#A8C4D8' }, { name: '인디고', hex: '#2A3F6A' }],
          sizes: ['S', 'M', 'L', 'XL', 'XXL'], soldOut: [],
          desc: '남친룩 핵심 아이템. 어떤 하의와도 자연스러운 오버핏 데님 자켓.',
          mat: '100% Cotton Denim', care: '30°C 이하 / 뒤집어 세탁',
          rating: 4.6, reviews: 87, event: 0,
        },
        {
          code: 'P003', cat: 'outer', name: '나일론 퀄팅 패딩 재킷', price: 148000, sale: null, badge: 'new',
          styles: ['casual', 'boyfriend'],
          main: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop&q=85',
          sub: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop&q=85',
          imgs: ['https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop&q=85', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop&q=85'],
          colors: [{ name: '블랙', hex: '#1C1A16' }, { name: '올리브', hex: '#4A5240' }],
          sizes: ['S', 'M', 'L', 'XL'], soldOut: [],
          desc: '경량 나일론 퀄팅 패딩. 캐주얼 데이트룩과 완벽한 조합.',
          mat: '100% Nylon / Polyester Fill 80g', care: '30°C 이하 단독 세탁',
          rating: 4.7, reviews: 43, event: 0,
        },
        {
          code: 'P004', cat: 'shirt', name: '스트라이프 오버핏 셔츠', price: 72000, sale: null, badge: 'new',
          styles: ['boyfriend', 'couple', 'casual'],
          main: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop&q=85',
          sub: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&h=800&fit=crop&q=85',
          imgs: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop&q=85', 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&h=800&fit=crop&q=85', 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&h=800&fit=crop&q=85'],
          colors: [{ name: '블루 스트라이프', hex: '#6B8FAF' }, { name: '화이트', hex: '#F5F5F0' }],
          sizes: ['S', 'M', 'L', 'XL'], soldOut: [],
          desc: '커플룩으로 가장 많이 찾는 스트라이프 셔츠. 1+1 이벤트 대상.',
          mat: '100% Cotton Linen Blend', care: '30°C 이하 단독 세탁',
          rating: 4.8, reviews: 156, event: 1,
        },
        {
          code: 'P005', cat: 'shirt', name: '화이트 포플린 드레스 셔츠', price: 68000, sale: null, badge: null,
          styles: ['formal', 'boyfriend'],
          main: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&h=800&fit=crop&q=85',
          sub: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop&q=85',
          imgs: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&h=800&fit=crop&q=85', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop&q=85'],
          colors: [{ name: '화이트', hex: '#F5F5F0' }, { name: '라이트블루', hex: '#C5D8E8' }],
          sizes: ['S', 'M', 'L', 'XL'], soldOut: [],
          desc: '하객룩·데이트룩 필수템. 깔끔한 포플린 소재.',
          mat: '100% Cotton Poplin', care: '30°C 이하 / 중온 다림질',
          rating: 4.5, reviews: 92, event: 0,
        }
      ];

      for (const p of products) {
        await conn.execute(`
          INSERT INTO products (
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
      console.log(`✅ 상품 ${products.length}개 삽입 완료`);

      /* ── 샘플 주문 ── */
      const [demo] = await conn.execute('SELECT id FROM users WHERE email = ?', ['demo@varo.com']);
      if (demo) {
        const [p1] = await conn.execute('SELECT id FROM products WHERE product_code = "P001"');
        const items = JSON.stringify([{ product_id: p1.id, product_name: '더블 브레스티드 울 코트', unit_price: 198000, quantity: 1, size: 'M', color: '카멜' }]);
        await conn.execute(`
          INSERT INTO orders (order_number, user_id, items, subtotal, discount, shipping_fee, total, recipient_name, recipient_phone, address, payment_method, status)
          VALUES ("ORD-SEED-01", ?, ?, 198000, 19800, 0, 178200, "김민준", "010-1234-5678", "서울시 강남구", "card", "shipped")
        `, [demo.id, items]);
        console.log('✅ 샘플 주문 삽입 완료');
      }
    });

    console.log('\n🎉 MySQL 초기 데이터 삽입 완료!');
  } catch (err) {
    console.error('\n❌ 시딩 중 오류 발생:', err.message);
  }
}

seed();
