// routes/auth.js
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const { requireAuth } = require('../middleware/auth');
const { sendMail } = require('../utils/mailer');

// 인증 코드 저장 및 만료 처리용 (실제 서비스에서는 Redis나 DB 권장)
const verificationCodes = {};
const CODE_EXPIRE_TIME = 5 * 60 * 1000; // 5분

const SECRET = process.env.JWT_SECRET || 'varo2026_secret';
const EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

/* ── 회원가입 POST /api/auth/register ───── */
router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: '이름, 이메일, 비밀번호는 필수입니다.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: '비밀번호는 6자 이상이어야 합니다.' });
  }

  try {
    const existing = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(409).json({ error: '이미 사용중인 이메일입니다.' });

    const hash = bcrypt.hashSync(password, 10);
    const result = await db.execute(
      'INSERT INTO users (name, email, password, phone, grade) VALUES (?, ?, ?, ?, ?)',
      [name, email, hash, phone || null, 'bronze']
    );

    const token = jwt.sign({ id: result.insertId }, SECRET, { expiresIn: EXPIRES });
    const userRows = await db.execute('SELECT id, name, email, grade, points, is_admin FROM users WHERE id = ?', [result.insertId]);

    res.status(201).json({ token, user: userRows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── 로그인 POST /api/auth/login ─────────── */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: '이메일과 비밀번호를 입력하세요.' });
  }

  try {
    const users = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: EXPIRES });
    const { password: _, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── 내 정보 GET /api/auth/me ─────────────── */
router.get('/me', requireAuth, async (req, res) => {
  try {
    const users = await db.execute(
      'SELECT id, name, email, grade, points, total_spent, phone, address, is_admin FROM users WHERE id = ?',
      [req.user.id]
    );
    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── 아이디 찾기 POST /api/auth/find-id ─────────── */
router.post('/find-id', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: '이름과 이메일을 입력하세요.' });

  try {
    const users = await db.execute('SELECT email FROM users WHERE name = ? AND email = ?', [name, email]);
    if (users.length === 0) return res.status(404).json({ error: '일치하는 정보가 없습니다.' });

    const user = users[0];
    const [local, domain] = user.email.split('@');
    const maskedLocal = local.length > 2 ? local.substring(0, 2) + '*'.repeat(local.length - 2) : local;
    const maskedEmail = `${maskedLocal}@${domain}`;

    res.json({ email: maskedEmail });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── 인증번호 요청 POST /api/auth/request-code ───── */
router.post('/request-code', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: '이메일을 입력하세요.' });

  try {
    const users = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(404).json({ error: '가입되지 않은 이메일입니다.' });

    // 6자리 난수 생성
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes[email] = {
      code,
      expires: Date.now() + CODE_EXPIRE_TIME
    };

    const mailContent = `
    <div style="background-color: #0d0d0d; color: #ffffff; padding: 60px 40px; font-family: 'Pretendard', -apple-system, sans-serif; text-align: center;">
      <div style="max-width: 540px; margin: 0 auto; background: rgba(255,255,255,0.05); padding: 40px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1);">
        <h1 style="font-size: 20px; font-weight: 300; letter-spacing: 4px; margin-bottom: 40px; color: #fff;">VARO</h1>
        <p style="font-size: 14px; line-height: 1.8; color: #bbb; margin-bottom: 40px;">안녕하세요. 본인 확인을 위한 인증번호입니다.<br/>아래 번호를 인증창에 입력해 주세요.</p>
        <div style="background: linear-gradient(135deg, #222, #111); padding: 30px; border-radius: 12px; margin-bottom: 40px;">
          <span style="font-size: 42px; font-weight: 800; letter-spacing: 12px; color: #fff; text-shadow: 0 4px 10px rgba(255,255,255,0.2);">${code}</span>
        </div>
        <p style="font-size: 12px; color: #666;">인증번호는 5분 뒤 만료됩니다.</p>
      </div>
      <p style="margin-top: 40px; font-size: 10px; color: #444; letter-spacing: 1px;">© 2026 VARO. ALL RIGHTS RESERVED.</p>
    </div>
  `;

    const mailResult = await sendMail(email, '[VARO] 비밀번호 재설정 인증번호입니다.', mailContent);
    if (mailResult.success) {
      res.json({ success: true, message: '인증 코드가 전송되었습니다.' });
    } else {
      res.status(500).json({ error: '이메일 전송에 실패했습니다.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── 인증번호 확인 POST /api/auth/verify-code ────── */
router.post('/verify-code', (req, res) => {
  const { email, code } = req.body;
  const stored = verificationCodes[email];

  if (!stored || stored.code !== code || Date.now() > stored.expires) {
    return res.status(400).json({ error: '인증번호가 올바르지 않거나 만료되었습니다.' });
  }

  res.json({ success: true, message: '인증되었습니다.' });
});

/* ── 비밀번호 재설정 POST /api/auth/reset-password ── */
router.post('/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;
  const stored = verificationCodes[email];

  if (!stored || stored.code !== code || Date.now() > stored.expires) {
    return res.status(400).json({ error: '인증 정보가 유효하지 않습니다.' });
  }

  try {
    const hash = bcrypt.hashSync(newPassword, 10);
    await db.execute('UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?', [hash, email]);

    // 사용 완료된 코드 삭제
    delete verificationCodes[email];

    res.json({ success: true, message: '비밀번호가 성공적으로 변경되었습니다.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
