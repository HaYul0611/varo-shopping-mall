// routes/products.js — 상품 CRUD
const router = require('express').Router();
const db     = require('../db/database');
const { requireAuth, requireAdmin, optionalAuth } = require('../middleware/auth');

const parseProduct = (row) => ({
  ...row,
  styles:        JSON.parse(row.styles        || '[]'),
  images:        JSON.parse(row.images        || '[]'),
  colors:        JSON.parse(row.colors        || '[]'),
  sizes:         JSON.parse(row.sizes         || '[]'),
  soldOutSizes:  JSON.parse(row.sold_out_sizes|| '[]'),
  salePrice:     row.sale_price,
  mainImg:       row.main_img,
  subImg:        row.sub_img,
  categoryId:    row.category_id,
  reviewCount:   row.review_count,
  isEvent:       !!row.is_event,
  isActive:      !!row.is_active,
});

/* ── 전체 목록 GET /api/products ─────────── */
router.get('/', optionalAuth, (req, res) => {
  const { category, filter, style, sort, q, limit, offset } = req.query;

  let sql    = 'SELECT * FROM products WHERE is_active = 1';
  const args = [];

  if (category && category !== 'all') {
    sql += ' AND category_id = ?'; args.push(category);
  }
  if (filter === 'new')   { sql += ' AND badge = ?';   args.push('new');  }
  if (filter === 'sale')  { sql += ' AND sale_price IS NOT NULL'; }
  if (filter === 'best')  { sql += ' AND badge = ?';   args.push('best'); }
  if (filter === 'event') { sql += ' AND is_event = 1'; }
  if (style && style !== 'all') {
    sql += ` AND styles LIKE ?`; args.push(`%${style}%`);
  }
  if (q) {
    sql += ` AND (name LIKE ? OR description LIKE ?)`; args.push(`%${q}%`, `%${q}%`);
  }

  switch (sort) {
    case 'price-low':  sql += ' ORDER BY COALESCE(sale_price, price) ASC'; break;
    case 'price-high': sql += ' ORDER BY COALESCE(sale_price, price) DESC'; break;
    case 'popular':    sql += ' ORDER BY rating DESC'; break;
    case 'review':     sql += ' ORDER BY review_count DESC'; break;
    default:           sql += ' ORDER BY created_at DESC';
  }

  const lim = parseInt(limit) || 100;
  const off = parseInt(offset) || 0;
  sql += ' LIMIT ? OFFSET ?'; args.push(lim, off);

  const rows = db.prepare(sql).all(...args);
  res.json(rows.map(parseProduct));
});

/* ── 단일 상품 GET /api/products/:id ────── */
router.get('/:id', (req, res) => {
  const row = db.prepare(
    'SELECT * FROM products WHERE (id = ? OR product_code = ?) AND is_active = 1'
  ).get(req.params.id, req.params.id);
  if (!row) return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
  res.json(parseProduct(row));
});

/* ── 상품 등록 POST /api/products (관리자) ── */
router.post('/', requireAuth, requireAdmin, (req, res) => {
  const { name, category_id, price, sale_price, badge, description,
          material, care, main_img, sub_img, images, colors, sizes,
          sold_out_sizes, styles, is_event } = req.body;

  if (!name || !category_id || !price || !main_img) {
    return res.status(400).json({ error: '상품명, 카테고리, 가격, 이미지는 필수입니다.' });
  }

  const code = `P${Date.now()}`;
  const result = db.prepare(`
    INSERT INTO products (product_code, category_id, name, price, sale_price, badge,
      main_img, sub_img, images, colors, sizes, sold_out_sizes,
      description, material, care, styles, is_event)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    code, category_id, name, price, sale_price ?? null, badge ?? null,
    main_img, sub_img ?? main_img,
    JSON.stringify(images ?? [main_img]),
    JSON.stringify(colors ?? []),
    JSON.stringify(sizes ?? []),
    JSON.stringify(sold_out_sizes ?? []),
    description ?? '', material ?? '', care ?? '',
    JSON.stringify(styles ?? []),
    is_event ? 1 : 0
  );

  const newRow = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(parseProduct(newRow));
});

/* ── 상품 수정 PUT /api/products/:id (관리자) ── */
router.put('/:id', requireAuth, requireAdmin, (req, res) => {
  const { name, price, sale_price, badge, description, material, care,
          main_img, sub_img, images, colors, sizes, sold_out_sizes,
          styles, is_event, is_active, stock } = req.body;

  const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });

  db.prepare(`
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
      updated_at = datetime('now','localtime')
    WHERE id = ?
  `).run(
    name ?? null, price ?? null,
    sale_price !== undefined ? (sale_price || null) : undefined,
    badge !== undefined ? (badge || null) : undefined,
    main_img ?? null, sub_img ?? null,
    images   ? JSON.stringify(images)   : null,
    colors   ? JSON.stringify(colors)   : null,
    sizes    ? JSON.stringify(sizes)    : null,
    sold_out_sizes ? JSON.stringify(sold_out_sizes) : null,
    description ?? null, material ?? null, care ?? null,
    styles ? JSON.stringify(styles) : null,
    is_event !== undefined ? (is_event ? 1 : 0) : null,
    is_active !== undefined ? (is_active ? 1 : 0) : null,
    stock ?? null,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  res.json(parseProduct(updated));
});

/* ── 상품 삭제 DELETE /api/products/:id (관리자) ── */
router.delete('/:id', requireAuth, requireAdmin, (req, res) => {
  const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
  // 실제 삭제 대신 비활성화
  db.prepare('UPDATE products SET is_active = 0 WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: '상품이 삭제되었습니다.' });
});

module.exports = router;
