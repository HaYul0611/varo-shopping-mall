/**
 * init-theme.js
 * 로딩 전 사용자 등급에 따른 클래스 설정
 */
(function () {
  const themes = {
    applyUserGrade: () => {
      try {
        const user = JSON.parse(localStorage.getItem('varo_user') || 'null');
        if (user && user.grade) {
          document.documentElement.classList.add('is-' + user.grade.toLowerCase());
        }
      } catch (e) { console.warn('[THEME] Grade Fail:', e); }
    },
    initSystemMode: () => {
      const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleMode = (e) => {
        // 이미 명시적 테마가 설정된 경우는 무시 (미래 확장성)
        if (!localStorage.getItem('varo_theme')) {
          document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
      };
      darkQuery.addEventListener('change', handleMode);
      handleMode(darkQuery);
    }
  };

  themes.applyUserGrade();
  themes.initSystemMode();
})();
