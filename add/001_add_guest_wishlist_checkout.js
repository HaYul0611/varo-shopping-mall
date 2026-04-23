/**
 * 001_add_guest_wishlist_checkout.js
 * ─────────────────────────────────────────────────────────────────
 * 비회원/회원 통합 결제 시스템을 위한 DB 마이그레이션
 *
 * 추가 테이블:
 *   1. guest_carts        — 비회원 장바구니 (TTL 30일)
 *   2. wishlists          — 회원 위시리스트
 *   3. guest_wishlists    — 비회원 위시리스트 (TTL 30일)
 *   4. guest_orders       — 비회원 주문 헤더
 *   5. guest_order_items  — 비회원 주문 라인
 *
 * [실행]
 *   node db/migrations/001_add_guest_wishlist_checkout.js
 *
 * [주의] 기존 테이블(cart, orders, order_items, products, users)은 건드리지 않음
 */

'use strict';

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// node-sqlite3-wasm 초기화 (기존 db/index.js 또는 db.js 패턴 재사용)
const { DatabaseSync } = require('node-sqlite3-wasm');
const DB_PATH = process.env.DB_PATH || path.resolve(__dirname, '../varo.db');

let db;
try {
  db = new DatabaseSync(DB_PATH);
} catch (e) {
  console.error('DB 연결 실패:', e.message);
  process.exit(1);
}

// WAL 모드 + 외래키 활성화
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// ── 마이그레이션 트랜잭션 ─────────────────────────────────────────
const migrate = db.transaction(() => {

  // ① 비회원 장바구니
  db.exec(`
    CREATE TABLE IF NOT EXISTS guest_carts (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      guest_id    TEXT    NOT NULL,
      product_id  INTEGER NOT NULL,
      quantity    INTEGER NOT NULL DEFAULT 1 CHECK(quantity > 0),
      size        TEXT,
      color       TEXT,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at  DATETIME DEFAULT (datetime('now', '+30 days')),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_guest_carts_guest_id ON guest_carts(guest_id);`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_guest_carts_expires  ON guest_carts(expires_at);`);

  // ② 회원 위시리스트
  db.exec(`
    CREATE TABLE IF NOT EXISTS wishlists (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     INTEGER NOT NULL,
      product_id  INTEGER NOT NULL,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, product_id),
      FOREIGN KEY (user_id)    REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id);`);

  // ③ 비회원 위시리스트
  db.exec(`
    CREATE TABLE IF NOT EXISTS guest_wishlists (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      guest_id    TEXT    NOT NULL,
      product_id  INTEGER NOT NULL,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at  DATETIME DEFAULT (datetime('now', '+30 days')),
      UNIQUE(guest_id, product_id),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_guest_wishlists_guest_id ON guest_wishlists(guest_id);`);

  // ④ 비회원 주문 헤더
  db.exec(`
    CREATE TABLE IF NOT EXISTS guest_orders (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number     TEXT    UNIQUE NOT NULL,
      guest_id         TEXT,
      guest_email      TEXT    NOT NULL,
      guest_name       TEXT    NOT NULL,
      guest_phone      TEXT    NOT NULL,
      shipping_name    TEXT    NOT NULL,
      shipping_phone   TEXT    NOT NULL,
      shipping_zipcode TEXT    NOT NULL,
      shipping_address TEXT    NOT NULL,
      shipping_detail  TEXT,
      delivery_request TEXT,
      total_amount     INTEGER NOT NULL CHECK(total_amount >= 0),
      discount_amount  INTEGER NOT NULL DEFAULT 0,
      shipping_fee     INTEGER NOT NULL DEFAULT 0,
      final_amount     INTEGER NOT NULL CHECK(final_amount >= 0),
      payment_method   TEXT    NOT NULL DEFAULT 'card',
      payment_status   TEXT    NOT NULL DEFAULT 'pending'
                       CHECK(payment_status IN ('pending','paid','failed','refunded')),
      order_status     TEXT    NOT NULL DEFAULT 'pending'
                       CHECK(order_status IN ('pending','confirmed','preparing','shipped','delivered','cancelled')),
      tracking_number  TEXT,
      created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_guest_orders_email   ON guest_orders(guest_email);`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_guest_orders_number  ON guest_orders(order_number);`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_guest_orders_guest   ON guest_orders(guest_id);`);

  // ⑤ 비회원 주문 라인 아이템
  db.exec(`
    CREATE TABLE IF NOT EXISTS guest_order_items (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id    INTEGER NOT NULL,
      product_id  INTEGER NOT NULL,
      product_name TEXT   NOT NULL,
      product_image TEXT,
      quantity    INTEGER NOT NULL CHECK(quantity > 0),
      size        TEXT,
      color       TEXT,
      unit_price  INTEGER NOT NULL CHECK(unit_price >= 0),
      subtotal    INTEGER NOT NULL CHECK(subtotal >= 0),
      FOREIGN KEY (order_id)   REFERENCES guest_orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
    );
  `);

  // ⑥ 회원 orders 테이블에 결제 관련 컬럼 보강 (없는 경우만)
  // SQLite는 ADD COLUMN 가능 (DROP COLUMN 불가)
  const existingCols = db.prepare("PRAGMA table_info(orders)").all().map(c => c.name);

  if (!existingCols.includes('shipping_name'))
    db.exec(`ALTER TABLE orders ADD COLUMN shipping_name TEXT;`);
  if (!existingCols.includes('shipping_phone'))
    db.exec(`ALTER TABLE orders ADD COLUMN shipping_phone TEXT;`);
  if (!existingCols.includes('shipping_zipcode'))
    db.exec(`ALTER TABLE orders ADD COLUMN shipping_zipcode TEXT;`);
  if (!existingCols.includes('shipping_address'))
    db.exec(`ALTER TABLE orders ADD COLUMN shipping_address TEXT;`);
  if (!existingCols.includes('shipping_detail'))
    db.exec(`ALTER TABLE orders ADD COLUMN shipping_detail TEXT;`);
  if (!existingCols.includes('delivery_request'))
    db.exec(`ALTER TABLE orders ADD COLUMN delivery_request TEXT;`);
  if (!existingCols.includes('discount_amount'))
    db.exec(`ALTER TABLE orders ADD COLUMN discount_amount INTEGER DEFAULT 0;`);
  if (!existingCols.includes('shipping_fee'))
    db.exec(`ALTER TABLE orders ADD COLUMN shipping_fee INTEGER DEFAULT 0;`);
  if (!existingCols.includes('final_amount'))
    db.exec(`ALTER TABLE orders ADD COLUMN final_amount INTEGER;`);
  if (!existingCols.includes('payment_method'))
    db.exec(`ALTER TABLE orders ADD COLUMN payment_method TEXT DEFAULT 'card';`);
  if (!existingCols.includes('payment_status'))
    db.exec(`ALTER TABLE orders ADD COLUMN payment_status TEXT DEFAULT 'pending';`);
  if (!existingCols.includes('tracking_number'))
    db.exec(`ALTER TABLE orders ADD COLUMN tracking_number TEXT;`);
  if (!existingCols.includes('points_used'))
    db.exec(`ALTER TABLE orders ADD COLUMN points_used INTEGER DEFAULT 0;`);
  if (!existingCols.includes('points_earned'))
    db.exec(`ALTER TABLE orders ADD COLUMN points_earned INTEGER DEFAULT 0;`);

  // ⑦ 회원 포인트 / 멤버십 컬럼 보강
  const userCols = db.prepare("PRAGMA table_info(users)").all().map(c => c.name);
  if (!userCols.includes('points'))
    db.exec(`ALTER TABLE users ADD COLUMN points INTEGER DEFAULT 0;`);
  if (!userCols.includes('total_purchase'))
    db.exec(`ALTER TABLE users ADD COLUMN total_purchase INTEGER DEFAULT 0;`);

  console.log('✅ 마이그레이션 완료');
});

try {
  migrate();
} catch (err) {
  console.error('❌ 마이그레이션 실패:', err.message);
  process.exit(1);
} finally {
  db.close();
}
