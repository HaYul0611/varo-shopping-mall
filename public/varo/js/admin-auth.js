/**
 * js/admin-auth.js
 * 관리자 페이지 접근 권한을 검증합니다.
 */
(() => {
  try {
    const user = JSON.parse(localStorage.getItem('varo_user') || 'null');
    const isAdmin = user && (user.role === 'ADMIN' || user.grade === 'ADMIN' || user.email === 'admin@varo.com');

    if (!isAdmin) {
      alert('관리자 권한이 필요합니다.');
      window.location.replace('./login.html');
    }
  } catch (e) {
    console.error('[AdminAuth] 권한 검증 중 오류 발생:', e);
    window.location.replace('./login.html');
  }
})();
