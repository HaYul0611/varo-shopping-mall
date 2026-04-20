// server.js — VARO 메인 서버
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

/* ── 미들웨어 ─────────────────────────────── */
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ── 정적 파일 서빙 (프론트엔드) ─────────── */
app.use(express.static(path.join(__dirname, 'public')));

/* ── API 라우터 ──────────────────────────── */
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api/reviews', require('./routes/reviews'));

/* ── 헬스 체크 ───────────────────────────── */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', brand: 'VARO', time: new Date().toISOString() });
});

/* ── SPA 폴백: /varo/* 요청은 index.html 반환 ── */
app.get('/varo/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'varo', 'index.html'));
});
app.get('/', (req, res) => {
  res.redirect('/varo/');
});

/* ── 404 처리 ────────────────────────────── */
app.use((req, res) => {
  res.status(404).json({ error: '요청한 리소스를 찾을 수 없습니다.' });
});

/* ── 전역 에러 핸들러 ─────────────────────── */
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({
    error: err.message || '서버 오류가 발생했습니다.',
  });
});

/* ── 서버 시작 ───────────────────────────── */
app.listen(PORT, () => {
  console.log('');
  console.log('  ██╗   ██╗ █████╗ ██████╗  ██████╗');
  console.log('  ██║   ██║██╔══██╗██╔══██╗██╔═══██╗');
  console.log('  ██║   ██║███████║██████╔╝██║   ██║');
  console.log('  ╚██╗ ██╔╝██╔══██║██╔══██╗██║   ██║');
  console.log('   ╚████╔╝ ██║  ██║██║  ██║╚██████╔╝');
  console.log('    ╚═══╝  ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝');
  console.log('');
  console.log(`  🛍  VARO 서버 실행 중: http://localhost:${PORT}/varo/`);
  console.log(`  📦  API 기본 URL: http://localhost:${PORT}/api`);
  console.log('');
});
