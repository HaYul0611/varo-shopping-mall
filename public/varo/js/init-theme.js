/**
 * init-theme.js
 * 로딩 전 사용자 등급에 따른 클래스 설정
 */
(function () {
  try {
    const user = JSON.parse(localStorage.getItem('varo_user') || 'null');
    if (user && user.grade) {
      document.documentElement.classList.add('is-' + user.grade.toLowerCase());
    }
  } catch (e) {
    console.warn('[THEME] 로컬스토리지 접근 실패:', e);
  }
})();
