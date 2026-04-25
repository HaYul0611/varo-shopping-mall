// routes/addresses.js
const router = require('express').Router();
const db = require('../db/database');
const { requireAuth } = require('../middleware/auth');

/* GET /api/addresses — 내 배송지 목록 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const rows = await db.query('SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC', [req.user.id]);
    res.json({
      success: true,
      data: rows.map(r => ({
        ...r,
        recipient_phone: db.decrypt(r.recipient_phone)
      }))
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* POST /api/addresses — 배송지 추가 */
router.post('/', requireAuth, async (req, res) => {
  const { address_name, recipient_name, recipient_phone, zipcode, address, address_detail, is_default } = req.body;
  if (!address_name || !recipient_name || !recipient_phone || !address) {
    return res.status(400).json({ success: false, message: '필수 정보를 모두 입력해주세요.' });
  }

  try {
    await db.withTransaction(async (conn) => {
      if (is_default) {
        await conn.execute('UPDATE user_addresses SET is_default = 0 WHERE user_id = ?', [req.user.id]);
      }
      await conn.execute(`
        INSERT INTO user_addresses (user_id, address_name, recipient_name, recipient_phone, zipcode, address, address_detail, is_default)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [req.user.id, address_name, recipient_name, db.encrypt(recipient_phone), zipcode, address, address_detail || '', is_default ? 1 : 0]);
    });
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* PUT /api/addresses/:id — 배송지 수정 */
router.put('/:id', requireAuth, async (req, res) => {
  const { address_name, recipient_name, recipient_phone, zipcode, address, address_detail, is_default } = req.body;
  try {
    await db.withTransaction(async (conn) => {
      if (is_default) {
        await conn.execute('UPDATE user_addresses SET is_default = 0 WHERE user_id = ?', [req.user.id]);
      }
      await conn.execute(`
        UPDATE user_addresses
        SET address_name=?, recipient_name=?, recipient_phone=?, zipcode=?, address=?, address_detail=?, is_default=?
        WHERE id=? AND user_id=?
      `, [address_name, recipient_name, db.encrypt(recipient_phone), zipcode, address, address_detail, is_default ? 1 : 0, req.params.id, req.user.id]);
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* DELETE /api/addresses/:id — 배송지 삭제 */
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await db.execute('DELETE FROM user_addresses WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
