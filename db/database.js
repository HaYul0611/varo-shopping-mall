// db/database.js — SQLite (node-sqlite3-wasm 기반, 빌드 도구 불필요)
const Database = require('./compat');
const path = require('path');

const DB_PATH = path.join(__dirname, 'varo.db');
const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    email       TEXT    NOT NULL UNIQUE,
    password    TEXT    NOT NULL,
    phone       TEXT,
    address     TEXT,
    grade       TEXT    NOT NULL DEFAULT 'basic',
    points      INTEGER NOT NULL DEFAULT 0,
    total_spent INTEGER NOT NULL DEFAULT 0,
    is_admin    INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now','localtime')),
    updated_at  TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
  );
  CREATE TABLE IF NOT EXISTS products (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    product_code  TEXT NOT NULL UNIQUE,
    category_id   TEXT NOT NULL,
    brand         TEXT NOT NULL DEFAULT 'VARO',
    name          TEXT NOT NULL,
    price         INTEGER NOT NULL,
    sale_price    INTEGER,
    badge         TEXT,
    styles        TEXT NOT NULL DEFAULT '[]',
    main_img      TEXT NOT NULL,
    sub_img       TEXT NOT NULL,
    images        TEXT NOT NULL DEFAULT '[]',
    colors        TEXT NOT NULL DEFAULT '[]',
    sizes         TEXT NOT NULL DEFAULT '[]',
    sold_out_sizes TEXT NOT NULL DEFAULT '[]',
    description   TEXT,
    material      TEXT,
    care          TEXT,
    rating        REAL NOT NULL DEFAULT 0,
    review_count  INTEGER NOT NULL DEFAULT 0,
    stock         INTEGER NOT NULL DEFAULT 100,
    is_event      INTEGER NOT NULL DEFAULT 0,
    is_active     INTEGER NOT NULL DEFAULT 1,
    created_at    TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    updated_at    TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );
  CREATE TABLE IF NOT EXISTS cart (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL,
    product_id  INTEGER NOT NULL,
    size        TEXT NOT NULL,
    color       TEXT NOT NULL DEFAULT '',
    qty         INTEGER NOT NULL DEFAULT 1,
    created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    UNIQUE(user_id, product_id, size, color)
  );
  CREATE TABLE IF NOT EXISTS orders (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number    TEXT NOT NULL UNIQUE,
    user_id         INTEGER NOT NULL,
    items           TEXT NOT NULL,
    subtotal        INTEGER NOT NULL,
    discount        INTEGER NOT NULL DEFAULT 0,
    shipping_fee    INTEGER NOT NULL DEFAULT 3000,
    total           INTEGER NOT NULL,
    recipient_name  TEXT NOT NULL,
    recipient_phone TEXT NOT NULL,
    address         TEXT NOT NULL,
    address_detail  TEXT DEFAULT '',
    memo            TEXT DEFAULT '',
    payment_method  TEXT NOT NULL DEFAULT 'card',
    status          TEXT NOT NULL DEFAULT 'pending',
    created_at      TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );
  CREATE TABLE IF NOT EXISTS reviews (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id  INTEGER NOT NULL,
    user_id     INTEGER NOT NULL,
    rating      INTEGER NOT NULL,
    body        TEXT NOT NULL,
    size_info   TEXT DEFAULT '',
    created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );
  CREATE TABLE IF NOT EXISTS wishlist (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL,
    product_id  INTEGER NOT NULL,
    created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    UNIQUE(user_id, product_id)
  );
`);

module.exports = db;
