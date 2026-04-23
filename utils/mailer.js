const nodemailer = require('nodemailer');

/**
 * SMTP 설정 - .env 파일의 설정을 사용합니다.
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for others
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * 이메일 발송 유틸리티
 * @param {string} to 수신자
 * @param {string} subject 제목
 * @param {string} html 내용 (HTML)
 */
const sendMail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"VARO" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log('[MAIL] Sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[MAIL] Error:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendMail };
