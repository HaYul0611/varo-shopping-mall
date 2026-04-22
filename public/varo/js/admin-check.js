/**
 * 관리자 권한 체크 스크립트
 * - 토큰 존재 여부 및 관리자 여부 확인
 * - 권한 없을 시 로그인 페이지로 리다이렉트
 */
(function () {
  const token = localStorage.getItem('varo_token');
  const user = JSON.parse(localStorage.getItem('varo_user') || '{}');
  if (!token || !user.is_admin) {
    if (token && !user.is_admin) {
      alert('관리자 권한이 필요합니다.');
    }
    location.replace('./login.html?redirect=./admin.html');
  }
})();
