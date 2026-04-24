// routes/products.js — 상품 CRUD
const router = require('express').Router();
const db = require('../db/database');
const { requireAuth, requireAdmin, optionalAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 이미지 저장 경로 설정
const uploadDir = path.join(__dirname, '../public/varo/assets/products');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${basename}_${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

const parseProduct = (row) => {
  if (!row) return null;
  const parse = (val) => {
    if (typeof val === 'string') {
      try { return JSON.parse(val); } catch (e) { return []; }
    }
    return val || [];
  };

  return {
    ...row,
    styles: parse(row.styles),
    images: parse(row.images),
    colors: parse(row.colors),
    sizes: parse(row.sizes),
    soldOutSizes: parse(row.sold_out_sizes),
    salePrice: row.sale_price,
    mainImg: row.main_img,
    subImg: row.sub_img,
    categoryId: row.category_id,
    reviewCount: row.review_count,
    isEvent: !!row.is_event,
    isActive: !!row.is_active,
  };
};

/* ── 다중 파일 업로드 POST /api/products/upload ─────────── */
router.post('/upload', requireAuth, requireAdmin, upload.fields([
  { name: 'mainFile', maxCount: 1 },
  { name: 'subFile', maxCount: 1 },
  { name: 'detailFiles', maxCount: 10 }
]), (req, res) => {
  try {
    const getUrl = (file) => file ? `./assets/products/${file.filename}` : null;

    res.json({
      success: true,
      urls: {
        main: req.files['mainFile'] ? getUrl(req.files['mainFile'][0]) : null,
        sub: req.files['subFile'] ? getUrl(req.files['subFile'][0]) : null,
        details: req.files['detailFiles'] ? req.files['detailFiles'].map(getUrl) : []
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: '파일 업로드 실패: ' + err.message });
  }
});

/* ── 전체 목록 GET /api/products ─────────── */
router.get('/', optionalAuth, async (req, res) => {
  const { category, filter, style, sort, q, limit, offset } = req.query;

  let sql = 'SELECT * FROM products WHERE is_active = 1';
  const args = [];

  if (category && category !== 'all') {
    sql += ' AND category_id = ?'; args.push(category);
  }
  if (filter === 'new') { sql += ' AND badge = ?'; args.push('new'); }
  if (filter === 'sale') { sql += ' AND sale_price IS NOT NULL'; }
  if (filter === 'best') { sql += ' AND badge = ?'; args.push('best'); }
  if (filter === 'event') { sql += ' AND is_event = 1'; }
  if (style && style !== 'all') {
    sql += ` AND styles LIKE ?`; args.push(`%${style}%`);
  }
  if (q) {
    sql += ` AND (name LIKE ? OR description LIKE ?)`; args.push(`%${q}%`, `%${q}%`);
  }

  switch (sort) {
    case 'price-low': sql += ' ORDER BY COALESCE(sale_price, price) ASC'; break;
    case 'price-high': sql += ' ORDER BY COALESCE(sale_price, price) DESC'; break;
    case 'popular': sql += ' ORDER BY rating DESC'; break;
    case 'review': sql += ' ORDER BY review_count DESC'; break;
    default: sql += ' ORDER BY created_at DESC';
  }

  const lim = parseInt(limit) || 100;
  const off = parseInt(offset) || 0;
  sql += ' LIMIT ? OFFSET ?'; args.push(lim, off);

  try {
    const rows = await db.query(sql, args);
    res.json(rows.map(parseProduct));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── 단일 상품 GET /api/products/:id ────── */
router.get('/:id', async (req, res) => {
  try {
    const rows = await db.execute(
      'SELECT * FROM products WHERE (id = ? OR product_code = ?) AND is_active = 1',
      [req.params.id, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    res.json(parseProduct(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── 상품 등록 POST /api/products (관리자) ── */
router.post('/', requireAuth, requireAdmin, upload.single('main_img'), async (req, res) => {
  const { name, category_id, price, sale_price, badge, description,
    material, care, sub_img, images, colors, sizes,
    sold_out_sizes, styles, is_event, stock } = req.body;

  // 파일 업로드 처리 또는 텍스트 URL 처리
  let main_img_path = req.body.main_img; // 기존 URL 방식 지원 (시연용 더미)
  if (req.file) {
    main_img_path = `./assets/products/${req.file.filename}`; // 실제 업로드 경로
  }

  if (!name || !category_id || !price || !main_img_path) {
    return res.status(400).json({ error: '상품명, 카테고리, 가격, 이미지는 필수입니다.' });
  }

  const code = `P${Date.now()}`;
  try {
    const result = await db.execute(`
      INSERT INTO products (product_code, category_id, name, price, sale_price, badge,
        main_img, sub_img, images, colors, sizes, sold_out_sizes,
        description, material, care, styles, is_event, stock)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      code, category_id, name, price, sale_price ?? null, badge ?? null,
      main_img_path, sub_img ?? main_img_path,
      images ? (typeof images === 'string' ? images : JSON.stringify(images)) : JSON.stringify([main_img_path]),
      colors ? (typeof colors === 'string' ? colors : JSON.stringify(colors)) : JSON.stringify([]),
      sizes ? (typeof sizes === 'string' ? sizes : JSON.stringify(sizes)) : JSON.stringify([]),
      sold_out_sizes ? (typeof sold_out_sizes === 'string' ? sold_out_sizes : JSON.stringify(sold_out_sizes)) : JSON.stringify([]),
      description ?? '', material ?? '', care ?? '',
      styles ? (typeof styles === 'string' ? styles : JSON.stringify(styles)) : JSON.stringify([]),
      is_event ? 1 : 0,
      stock ?? 0
    ]);

    const newRows = await db.execute('SELECT * FROM products WHERE id = ?', [result.insertId]);
    res.status(201).json(parseProduct(newRows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── 상품 수정 PUT /api/products/:id (관리자) ── */
router.put('/:id', requireAuth, requireAdmin, upload.single('main_img'), async (req, res) => {
  const { name, price, sale_price, badge, description, material, care,
    sub_img, images, colors, sizes, sold_out_sizes,
    styles, is_event, is_active, stock } = req.body;

  let main_img_path = req.body.main_img;
  if (req.file) {
    main_img_path = `./assets/products/${req.file.filename}`;
  }

  try {
    const existing = await db.execute('SELECT id FROM products WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });

    await db.execute(`
      UPDATE products SET
        name = COALESCE(?, name),
        price = COALESCE(?, price),
        sale_price = ?,
        badge = ?,
        main_img = COALESCE(?, main_img),
        sub_img = COALESCE(?, sub_img),
        images = COALESCE(?, images),
        colors = COALESCE(?, colors),
        sizes = COALESCE(?, sizes),
        sold_out_sizes = COALESCE(?, sold_out_sizes),
        description = COALESCE(?, description),
        material = COALESCE(?, material),
        care = COALESCE(?, care),
        styles = COALESCE(?, styles),
        is_event = COALESCE(?, is_event),
        is_active = COALESCE(?, is_active),
        stock = COALESCE(?, stock),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      name ?? null, price ?? null,
      sale_price !== undefined ? (sale_price || null) : undefined,
      badge !== undefined ? (badge || null) : undefined,
      main_img_path ?? null, sub_img ?? null,
      images ? (typeof images === 'string' ? images : JSON.stringify(images)) : null,
      colors ? (typeof colors === 'string' ? colors : JSON.stringify(colors)) : null,
      sizes ? (typeof sizes === 'string' ? sizes : JSON.stringify(sizes)) : null,
      sold_out_sizes ? (typeof sold_out_sizes === 'string' ? sold_out_sizes : JSON.stringify(sold_out_sizes)) : null,
      description ?? null, material ?? null, care ?? null,
      styles ? (typeof styles === 'string' ? styles : JSON.stringify(styles)) : null,
      is_event !== undefined ? (is_event ? 1 : 0) : null,
      is_active !== undefined ? (is_active ? 1 : 0) : null,
      stock ?? null,
      req.params.id
    ]);

    const updated = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
    res.json(parseProduct(updated[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── 상품 삭제 DELETE /api/products/:id (관리자) ── */
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const existing = await db.execute('SELECT id FROM products WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    // 실제 삭제 대신 비활성화
    await db.execute('UPDATE products SET is_active = 0 WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: '상품이 삭제되었습니다.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
