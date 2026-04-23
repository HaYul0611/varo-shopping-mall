/**
 * 001_add_guest_wishlist_checkout.js
 * ─────────────────────────────────────────────────────────────────
 * 비회원/회원 통합 결제 시스템을 위한 DB 마이그레이션
 */

'use strict';

const path = require('path');
const Database = require('../compat'); // 기존 프로젝트의 DB 어댑터 사용
const DB_PATH = path.join(__dirname, '../varo.db');

let db;
try {
  db = new Database(DB_PATH);
  console.log('DB 연결 성공:', DB_PATH);
} catch (e) {
  console.error('DB 연결 실패:', e.message);
  process.exit(1);
}

// ── 마이그레이션 ──
try {
  // ① 비회원 장바구니
  db.exec(`
    CREATE TABLE IF NOT EXISTS guest_carts (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      guest_id    TEXT    NOT NULL,
      product_id  INTEGER NOT NULL,
      quantity    INTEGER NOT NULL DEFAULT 1,
      size        TEXT,
      color       TEXT,
      created_at  DATETIME DEFAULT (datetime('now','localtime')),
      expires_at  DATETIME DEFAULT (datetime('now', '+30 days')),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `);

  // ② 비회원 위시리스트
  db.exec(`
    CREATE TABLE IF NOT EXISTS guest_wishlists (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      guest_id    TEXT    NOT NULL,
      product_id  INTEGER NOT NULL,
      created_at  DATETIME DEFAULT (datetime('now','localtime')),
      expires_at  DATETIME DEFAULT (datetime('now', '+30 days')),
      UNIQUE(guest_id, product_id),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `);

  // ③ 비회원 주문 헤더
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
      total_amount     INTEGER NOT NULL,
      discount_amount  INTEGER NOT NULL DEFAULT 0,
      shipping_fee     INTEGER NOT NULL DEFAULT 0,
      final_amount     INTEGER NOT NULL,
      payment_method   TEXT    NOT NULL DEFAULT 'card',
      payment_status   TEXT    NOT NULL DEFAULT 'pending',
      order_status     TEXT    NOT NULL DEFAULT 'pending',
      tracking_number  TEXT,
      created_at       DATETIME DEFAULT (datetime('now','localtime')),
      updated_at       DATETIME DEFAULT (datetime('now','localtime'))
    );
  `);

  // ④ 비회원 주문 항목
  db.exec(`
    CREATE TABLE IF NOT EXISTS guest_order_items (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id    INTEGER NOT NULL,
      product_id  INTEGER NOT NULL,
      product_name TEXT   NOT NULL,
      product_image TEXT,
      quantity    INTEGER NOT NULL,
      size        TEXT,
      color       TEXT,
      unit_price  INTEGER NOT NULL,
      subtotal    INTEGER NOT NULL,
      FOREIGN KEY (order_id)   REFERENCES guest_orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
    );
  `);

  // ⑤ 기존 orders 테이블 컬럼 보강
  const orderCols = db.prepare("PRAGMA table_info(orders)").all().map(c => c.name);
  const neededOrderCols = [
    'shipping_name', 'shipping_phone', 'shipping_zipcode', 'shipping_address',
    'shipping_detail', 'delivery_request', 'discount_amount', 'shipping_fee',
    'final_amount', 'payment_method', 'payment_status', 'tracking_number',
    'points_used', 'points_earned'
  ];

  neededOrderCols.forEach(col => {
    if (!orderCols.includes(col)) {
      db.exec(`ALTER TABLE orders ADD COLUMN ${col} TEXT;`);
    }
  });

  // ⑥ 기존 users 테이블 컬럼 보강
  const userCols = db.prepare("PRAGMA table_info(users)").all().map(c => c.name);
  if (!userCols.includes('total_purchase')) {
    db.exec(`ALTER TABLE users ADD COLUMN total_purchase INTEGER DEFAULT 0;`);
  }

  console.log('마이그레이션 완료');
} catch (err) {
  console.error('마이그레이션 실패:', err.message);
}
