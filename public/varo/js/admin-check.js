/* js/admin-check.js — Final Reliable Guard */
(function () {
  const checkAdmin = () => {
    // 이미 로그인 페이지면 무시
    if (window.location.pathname.includes('login.html')) return;

    try {
      const user = JSON.parse(localStorage.getItem('varo_user') || 'null');
      const token = localStorage.getItem('varo_token');

      // 화이트리스트: admin@varo.com은 무조건 통과
      if (user && user.email === 'admin@varo.com') {
        if (!user.is_admin) {
          user.is_admin = true;
          user.role = 'ADMIN';
          localStorage.setItem('varo_user', JSON.stringify(user));
        }
        return; // 통과
      }

      const isAdmin = user && (user.is_admin || user.role === 'ADMIN' || user.grade === 'ADMIN');

      if (!token || !isAdmin) {
        console.error('[AdminCheck] Unauthorized access to admin area.');
        alert('관리자 권한이 필요합니다.');
        window.location.replace('./login.html?redirect=admin');
      }
    } catch (e) {
      console.error('[AdminCheck] Error parsing user data:', e);
    }
  };

  // 런타임 지연 및 정합성 확보를 위해 즉시 & 지연 실행
  checkAdmin();
})();
