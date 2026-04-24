const express = require('express');
const router = express.Router();
const db = require('../db/database');

// 모든 리뷰 조회
router.get('/', async (req, res) => {
  try {
    const reviews = await db.query('SELECT * FROM reviews ORDER BY created_at DESC');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 상품별 리뷰 조회
router.get('/product/:id', async (req, res) => {
  try {
    const reviews = await db.query('SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC', [req.params.id]);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
