/**
 * 마이페이지 전용 로직
 * - 유저 정보 표시
 * - 로그아웃 처리
 */
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('varo_user') || '{}');
    
    // 유저 이름 표시
    const userNameLabel = document.getElementById('userNameLabel');
    if (userNameLabel && user.name) {
        userNameLabel.textContent = user.name;
    }

    // 로그아웃 처리
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('로그아웃 하시겠습니까?')) {
                localStorage.removeItem('varo_user');
                location.replace('./index.html');
            }
        });
    }
});
