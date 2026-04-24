// db/database.js — MySQL (mysql2/promise 기반)
require('dotenv').config();
const mysql = require('mysql2/promise');
const crypto = require('crypto');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'varo_premium_secret_key_32bytes_'; // Must be 32 bytes
const IV_LENGTH = 16;

const encrypt = (text) => {
  if (!text) return null;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

const encryptDeterministic = (text) => {
  if (!text) return null;
  const iv = Buffer.alloc(IV_LENGTH, 0); // 고정 IV 사용 (검색용)
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('hex');
};

const decrypt = (text) => {
  if (!text) return null;
  if (text.includes(':')) {
    // Random IV 방식
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } else {
    // Deterministic 방식
    const iv = Buffer.alloc(IV_LENGTH, 0);
    const encryptedText = Buffer.from(text, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
};

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'varo',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

/**
 * 테이블 초기화 (MySQL 문법)
 */
const initDB = async () => {
  // 별도 연결로 DB 생성 시도 (DB 미지정 상태)
  const setupConn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306,
  });

  try {
    const dbName = process.env.DB_NAME || 'varo';
    console.log(`[MySQL] Database '${dbName}' 확인 중...`);
    await setupConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await setupConn.query(`USE \`${dbName}\``);

    // Users Table
    await setupConn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        name        VARCHAR(255) NOT NULL,
        email       VARCHAR(255) NOT NULL UNIQUE,
        password    VARCHAR(255) NOT NULL,
        phone       VARCHAR(255),  -- 암호화로 인해 길이 확장
        address     TEXT,
        grade       VARCHAR(20) NOT NULL DEFAULT 'bronze',
        points      INT NOT NULL DEFAULT 0,
        total_spent INT NOT NULL DEFAULT 0,
        height      FLOAT,         -- [NEW] 체형 기반 추천용
        weight      FLOAT,         -- [NEW] 체형 기반 추천용
        is_admin    TINYINT NOT NULL DEFAULT 0,
        created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Products Table
    await setupConn.query(`
      CREATE TABLE IF NOT EXISTS products (
        id            INT AUTO_INCREMENT PRIMARY KEY,
        product_code  VARCHAR(50) NOT NULL UNIQUE,
        category_id   VARCHAR(50) NOT NULL,
        brand         VARCHAR(50) NOT NULL DEFAULT 'VARO',
        name          VARCHAR(255) NOT NULL,
        price         INT NOT NULL,
        sale_price    INT,
        badge         VARCHAR(50),
        styles        JSON NOT NULL,
        main_img      VARCHAR(255) NOT NULL,
        sub_img       VARCHAR(255) NOT NULL,
        images        JSON NOT NULL,
        colors        JSON NOT NULL,
        sizes         JSON NOT NULL,
        sold_out_sizes JSON NOT NULL,
        description   TEXT,
        material      VARCHAR(255),
        care          VARCHAR(255),
        rating        FLOAT NOT NULL DEFAULT 0,
        review_count  INT NOT NULL DEFAULT 0,
        stock         INT NOT NULL DEFAULT 100,
        is_event      TINYINT NOT NULL DEFAULT 0,
        is_flash_sale TINYINT NOT NULL DEFAULT 0, -- [NEW] 플래시 세일 여부
        flash_sale_price INT,                     -- [NEW] 플래시 세일 가격
        flash_sale_end TIMESTAMP NULL,            -- [NEW] 플래시 세일 종료 시간
        is_active     TINYINT NOT NULL DEFAULT 1,
        created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Cart Table
    await setupConn.query(`
      CREATE TABLE IF NOT EXISTS cart (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        user_id     INT NOT NULL,
        product_id  INT NOT NULL,
        size        VARCHAR(50) NOT NULL,
        color       VARCHAR(50) NOT NULL DEFAULT '',
        qty         INT NOT NULL DEFAULT 1,
        created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id, size, color)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Orders Table
    await setupConn.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id              INT AUTO_INCREMENT PRIMARY KEY,
        order_number    VARCHAR(100) NOT NULL UNIQUE,
        user_id         INT NOT NULL,
        items           JSON NOT NULL,
        subtotal        INT NOT NULL,
        discount        INT NOT NULL DEFAULT 0,
        shipping_fee    INT NOT NULL DEFAULT 3000,
        total           INT NOT NULL,
        recipient_name  VARCHAR(100) NOT NULL,
        recipient_phone VARCHAR(50)  NOT NULL,
        address         VARCHAR(255) NOT NULL,
        address_detail  VARCHAR(255) DEFAULT '',
        memo            TEXT,
        payment_method  VARCHAR(50) NOT NULL DEFAULT 'card',
        status          ENUM('pending','preparing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
        created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Order Items (평탄화된 상세 내역)
    await setupConn.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id            INT AUTO_INCREMENT PRIMARY KEY,
        order_id      INT NOT NULL,
        product_id    INT NOT NULL,
        product_name  VARCHAR(255) NOT NULL,
        product_image VARCHAR(255) NOT NULL,
        quantity      INT NOT NULL,
        size          VARCHAR(50),
        color         VARCHAR(50),
        unit_price    INT NOT NULL,
        subtotal      INT NOT NULL,
        FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Reviews Table
    await setupConn.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        product_id  INT NOT NULL,
        user_id     INT NOT NULL,
        rating      INT NOT NULL,
        body        TEXT NOT NULL,
        size_info   VARCHAR(100) DEFAULT '',
        created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Wishlist Table
    await setupConn.query(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        user_id     INT NOT NULL,
        product_id  INT NOT NULL,
        created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Guest Orders (비회원)
    await setupConn.query(`
      CREATE TABLE IF NOT EXISTS guest_orders (
        id              INT AUTO_INCREMENT PRIMARY KEY,
        order_number    VARCHAR(100) NOT NULL UNIQUE,
        guest_id        VARCHAR(100) NOT NULL,
        guest_email     VARCHAR(255) NOT NULL,
        guest_name      VARCHAR(100) NOT NULL,
        guest_phone     VARCHAR(50)  NOT NULL,
        guest_password  VARCHAR(255) NOT NULL,
        shipping_name   VARCHAR(100) NOT NULL,
        shipping_phone  VARCHAR(50)  NOT NULL,
        shipping_zipcode VARCHAR(20)  NOT NULL,
        shipping_address VARCHAR(255) NOT NULL,
        shipping_detail  VARCHAR(255) DEFAULT '',
        delivery_request TEXT,
        total_amount    INT NOT NULL,
        discount_amount INT NOT NULL DEFAULT 0,
        shipping_fee    INT NOT NULL DEFAULT 3000,
        final_amount    INT NOT NULL,
        payment_method  VARCHAR(50) NOT NULL DEFAULT 'card',
        payment_status  VARCHAR(50) NOT NULL DEFAULT 'paid',
        order_status    VARCHAR(50) NOT NULL DEFAULT 'confirmed',
        created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Guest Order Items
    await setupConn.query(`
      CREATE TABLE IF NOT EXISTS guest_order_items (
        id            INT AUTO_INCREMENT PRIMARY KEY,
        order_id      INT NOT NULL,
        product_id    INT NOT NULL,
        product_name  VARCHAR(255) NOT NULL,
        product_image VARCHAR(255) NOT NULL,
        quantity      INT NOT NULL,
        size          VARCHAR(50),
        color         VARCHAR(50),
        unit_price    INT NOT NULL,
        subtotal      INT NOT NULL,
        FOREIGN KEY(order_id) REFERENCES guest_orders(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Guest Carts (비회원 장바구니)
    await setupConn.query(`
      CREATE TABLE IF NOT EXISTS guest_carts (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        guest_id    VARCHAR(100) NOT NULL,
        product_id  INT NOT NULL,
        size        VARCHAR(50) NOT NULL,
        color       VARCHAR(50) NOT NULL DEFAULT '',
        qty         INT NOT NULL DEFAULT 1,
        expires_at  TIMESTAMP NOT NULL,
        created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Guest Wishlists
    await setupConn.query(`
      CREATE TABLE IF NOT EXISTS guest_wishlists (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        guest_id    VARCHAR(100) NOT NULL,
        product_id  INT NOT NULL,
        expires_at  TIMESTAMP NOT NULL,
        created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Admin Logs Table
    await setupConn.query(`
      CREATE TABLE IF NOT EXISTS admin_logs (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        admin_id    INT NOT NULL,
        action      VARCHAR(50) NOT NULL,
        target_type VARCHAR(50) NOT NULL,
        target_id   INT,
        details     TEXT,
        ip_address  VARCHAR(50),
        created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('[MySQL] Database and Tables initialized successfully.');
  } catch (err) {
    console.error('[MySQL] Init Error:', err.message);
    throw err;
  } finally {
    await setupConn.end();
  }
};

// 즉시 실행 대신 server.js에서 호출하거나 필요시 내부 호출
// initDB();

module.exports = {
  pool,
  execute: (sql, params) => pool.execute(sql, params).then(([rows]) => rows),
  query: (sql, params) => pool.query(sql, params).then(([rows]) => rows),
  encrypt,
  encryptDeterministic,
  decrypt,
  withTransaction: async (callback) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },
  initDB
};
