/**
 * 마이페이지 전용 로직
 * - 유저 정보 표시 및 동기화 (등급, 사진 등)
 * - 사이드바 탭 전환
 * - 사진 업로드 및 변경
 * - 로그아웃 처리
 */
// ════════════════════════════════════════════════════════
// 전역 함수 정의 (타이밍 이슈 방지)
// ════════════════════════════════════════════════════════

// 1. 교환/반품 신청
window.openReturnModal = (productName, price) => {
    const modal = document.getElementById('returnModal');
    if (!modal) return;
    const nameInput = document.getElementById('returnProductName');
    const nameLabel = document.getElementById('returnProductLabel');
    if (nameInput) nameInput.value = productName;
    if (nameLabel) nameLabel.textContent = `신청 상품: ${productName}`;
    modal.classList.add('is-active');
};

// 2. 구매확정 및 리뷰 연동
window.confirmPurchase = (btn, productName) => {
    try {
        if (!confirm(`'${productName}' 상품을 구매확정 하시겠습니까?\n구매확정 후에는 교환/반품 신청이 불가하며, 리뷰 작성이 가능합니다.`)) return;

        const cell = btn.closest('.order-status-cell');
        if (cell) {
            // 버튼들을 숨기고 상태 텍스트만 변경 (DOM 파괴 방지)
            const statusSpan = cell.querySelector('span');
            if (statusSpan) {
                statusSpan.textContent = '구매확정';
                statusSpan.style.color = '#555';
            }
            cell.querySelectorAll('button').forEach(b => b.style.display = 'none');
        }

        if (window.Utils && typeof window.Utils.showToast === 'function') {
            window.Utils.showToast('구매확정이 완료되었습니다. 리뷰를 작성해 보세요!', 'success');
        }

        // 리뷰 모달 오픈
        setTimeout(() => {
            const modal = document.getElementById('reviewModal');
            if (!modal) return;
            const nameInput = document.getElementById('reviewProductName');
            const nameLabel = document.getElementById('reviewProductLabel');
            if (nameInput) nameInput.value = productName;
            if (nameLabel) nameLabel.textContent = `상품: ${productName}`;
            modal.classList.add('is-active');
        }, 800);
    } catch (error) {
        console.error('[VARO] confirmPurchase Error:', error);
    }
};

// 3. 배송 추적 시뮬레이션
window.openTrackingModal = (productName) => {
    try {
        const modal = document.getElementById('trackingModal');
        if (!modal) return;

        const nameLabel = document.getElementById('trackingProductName');
        if (nameLabel) nameLabel.textContent = productName;

        const timeline = document.getElementById('trackingTimeline');
        if (!timeline) return;

        const steps = [
            { date: '2026-04-20 14:22', status: '상품접수', location: 'VARO 물류센터', done: true, current: false },
            { date: '2026-04-20 18:05', status: '상품인수', location: '용인Hub', done: true, current: false },
            { date: '2026-04-21 02:40', status: '간선하차', location: '고양Hub', done: true, current: false },
            { date: '2026-04-21 09:15', status: '배달출발', location: '서울 강남구 일원동', done: true, current: true },
            { date: '-', status: '배달완료', location: '-', done: false, current: false }
        ];

        timeline.className = 'tracking-timeline';
        timeline.innerHTML = steps.map((s, idx) => `
            <div class="tracking-step ${s.done ? 'is-done' : ''} ${s.current ? 'is-current' : ''}">
                <div class="tracking-dot"></div>
                <div class="tracking-content">
                    <div class="tracking-info">
                        <div class="tracking-status">${s.status}</div>
                        <div class="tracking-location">${s.location}</div>
                    </div>
                    <div class="tracking-date">${s.date}</div>
                </div>
            </div>
        `).join('');

        modal.classList.add('is-active');
    } catch (error) {
        console.error('[VARO] openTrackingModal Error:', error);
    }
};

// 4. 주문 취소 기능
window.cancelOrder = (btn) => {
    try {
        if (!confirm('이 주문을 취소하시겠습니까?')) return;
        const cell = btn.closest('.order-status-cell') || btn.parentElement;
        if (cell) {
            const statusSpan = cell.querySelector('span');
            if (statusSpan) {
                statusSpan.textContent = '취소완료';
                statusSpan.style.color = '#ff4d4f';
            }
            cell.querySelectorAll('button').forEach(b => b.style.display = 'none');

            if (window.Utils && typeof window.Utils.showToast === 'function') {
                window.Utils.showToast('주문이 정상적으로 취소되었습니다.', 'success');
            }
        }
    } catch (error) {
        console.error('[VARO] cancelOrder Error:', error);
    }
};

// 5. 가상 배송 추적 모달 제어 (하이브리드 API)
window.openDeliveryModal = () => {
    const modal = document.getElementById('deliveryTrackingModal');
    if (!modal) return;

    modal.style.display = 'flex';
    modal.classList.remove('u-hidden');

    const dot2 = document.getElementById('step-2-dot');
    const text2 = document.getElementById('step-2-text');
    const time2 = document.getElementById('step-2-time');

    const dot3 = document.getElementById('step-3-dot');
    const text3 = document.getElementById('step-3-text');
    const time3 = document.getElementById('step-3-time');

    if (dot2) {
        dot2.style.background = '#EEE';
        dot2.style.boxShadow = '0 0 0 1px #CCC';
        dot2.style.color = '#999';
        dot2.textContent = '2';
    }
    if (text2) text2.style.color = '#999';
    if (time2) time2.textContent = '-';

    if (dot3) {
        dot3.style.background = '#EEE';
        dot3.style.boxShadow = '0 0 0 1px #CCC';
        dot3.style.color = '#999';
        dot3.textContent = '3';
    }
    if (text3) text3.style.color = '#999';
    if (time3) time3.textContent = '-';

    setTimeout(() => {
        const m = document.getElementById('deliveryTrackingModal');
        if (m && !m.classList.contains('u-hidden')) {
            if (dot2) {
                dot2.style.background = '#D96B3C';
                dot2.style.boxShadow = '0 0 0 1px #D96B3C';
                dot2.style.color = '#FFF';
                dot2.textContent = '✓';
            }
            if (text2) text2.style.color = '#333';
            if (time2) time2.textContent = '2026.04.25 18:50 | 옥천HUB';
        }
    }, 1500);

    setTimeout(() => {
        const m = document.getElementById('deliveryTrackingModal');
        if (m && !m.classList.contains('u-hidden')) {
            if (dot3) {
                dot3.style.background = '#D96B3C';
                dot3.style.boxShadow = '0 0 0 1px #D96B3C';
                dot3.style.color = '#FFF';
                dot3.textContent = '✓';
            }
            if (text3) text3.style.color = '#333';
            if (time3) time3.textContent = '2026.04.26 10:30 | 배송완료 (문 앞)';
        }
    }, 3000);
};

window.closeDeliveryModal = () => {
    const modal = document.getElementById('deliveryTrackingModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.add('u-hidden');
    }
};

window.closePointModal = () => {
    const modal = document.getElementById('pointHistoryModal');
    if (modal) modal.classList.remove('is-active');
};

document.addEventListener('DOMContentLoaded', () => {
    // ════════════════════════════════════════════════════════
    // 순수 JS 이벤트 바인딩 (인라인 onclick 제거 대응)
    // ════════════════════════════════════════════════════════

    // 0. 적립금 내역 보기
    document.querySelectorAll('.btn-view-points').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = document.getElementById('pointHistoryModal');
            if (modal) modal.classList.add('is-active');
        });
    });

    // 1. 주문취소
    document.querySelectorAll('.btn-cancel-order').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.cancelOrder) window.cancelOrder(btn);
        });
    });

    // 2. 구매확정
    document.querySelectorAll('.btn-confirm-purchase').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const row = btn.closest('tr');
            const productName = row ? row.cells[1].textContent.trim() : '상품';
            if (window.confirmPurchase) window.confirmPurchase(btn, productName);
        });
    });

    // 3. 배송조회 (일반)
    document.querySelectorAll('.btn-track-delivery').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const row = btn.closest('tr');
            const productName = row ? row.cells[1].textContent.trim() : '상품';
            if (window.openTrackingModal) window.openTrackingModal(productName);
        });
    });

    // 4. 배송조회 (커스텀 모달)
    document.querySelectorAll('.btn-track-delivery-custom').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.openDeliveryModal) window.openDeliveryModal();
        });
    });

    // 5. 교환/반품
    document.querySelectorAll('.btn-return-order').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const row = btn.closest('tr');
            const productName = row ? row.cells[1].textContent.trim() : '상품';
            if (window.openReturnModal) window.openReturnModal(productName, 0);
        });
    });

    const applyAdminLayout = () => {
        const user = JSON.parse(localStorage.getItem('varo_user') || '{}');
        const isAdmin = user.role === 'ADMIN' || user.grade === 'ADMIN' || user.email === 'admin@varo.com';
        if (!isAdmin) return;

        // 사이드바 메뉴 변경
        const navLinks = document.querySelectorAll('.mypage-nav__link');
        navLinks.forEach(link => {
            const target = link.getAttribute('data-target');
            if (target === 'section-order') {
                link.textContent = '내 활동 로그';
                link.setAttribute('data-target', 'section-activity');
            } else if (target === 'section-wishlist') {
                link.textContent = '업무 즐겨찾기';
                link.setAttribute('data-target', 'section-bookmarks');
            } else if (target === 'section-inquiry') {
                link.textContent = '업무 메모';
                link.setAttribute('data-target', 'section-notes');
            } else if (target === 'section-membership') {
                link.parentElement.style.display = 'none';
            }
        });

        // 관리자용 탭 리매핑 (URL 파라미터 대응)
        const searchParams = new URLSearchParams(window.location.search);
        const tabParam = searchParams.get('tab');

        let targetTab = 'section-activity'; // 기본값
        if (tabParam === 'order') targetTab = 'section-activity';
        else if (tabParam === 'wishlist') targetTab = 'section-bookmarks';
        else if (tabParam === 'inquiry') targetTab = 'section-notes';
        else if (tabParam) targetTab = `section-${tabParam}`;

        // activateTab 함수가 정의된 이후에 호출되도록 지연 실행
        setTimeout(() => {
            if (typeof activateTab === 'function') {
                activateTab(targetTab);
            }
        }, 50);
    };

    const updateProfileUI = () => {
        const userRaw = localStorage.getItem('varo_user');
        const user = JSON.parse(userRaw || '{}');
        const userNameLabel = document.getElementById('userNameLabel');
        const userGradeLabel = document.getElementById('userGradeLabel');
        const avatarImg = document.getElementById('userAvatarImg');
        const avatarDefault = document.getElementById('userAvatarDefault');
        const btnLogout = document.getElementById('btnLogout');

        const profileEmail = document.getElementById('profileEmail');
        const profileName = document.getElementById('profileName');

        if (!userRaw) {
            // 비회원 사이드바 메뉴 필터링 (위시리스트, 로그인 제외 숨김)
            const navLinks = document.querySelectorAll('.mypage-nav__link');
            navLinks.forEach(link => {
                const target = link.getAttribute('data-target');
                // section-wishlist가 아니고, 로그아웃/로그인 버튼이 아닌 경우 숨김
                if (target && target !== 'section-wishlist') {
                    link.parentElement.style.display = 'none';
                }
            });

            if (userNameLabel) userNameLabel.textContent = '비회원';
            if (userGradeLabel) {
                userGradeLabel.textContent = 'GUEST';
                userGradeLabel.className = 'user-grade is-guest';
            }
            if (btnLogout) {
                btnLogout.textContent = '로그인';
                btnLogout.href = './login.html';
                btnLogout.classList.remove('mypage-nav__link--logout');
            }
            return;
        }

        if (userNameLabel && user.name) {
            userNameLabel.textContent = user.name;
        }

        if (userGradeLabel) {
            const gradeMap = {
                'BASIC': 'BRONZE', 'BRONZE': 'BRONZE',
                'SILVER': 'SILVER', 'GOLD': 'GOLD',
                'DIA': 'DIA',
                'MANAGER': 'MANAGER', 'ADMIN': '관리자설정'
            };
            const isAdmin = user.role === 'ADMIN' || user.grade === 'ADMIN' || user.email === 'admin@varo.com';
            let displayGrade = gradeMap[user.grade] || user.grade || 'BRONZE';
            if (isAdmin) displayGrade = '관리자설정';

            userGradeLabel.textContent = displayGrade;

            // 등급별 색상 클래스 추가 (매핑된 displayGrade 기준)
            const gradeClass = isAdmin ? 'is-admin' : `is-${displayGrade.toLowerCase()}`;
            userGradeLabel.className = `user-grade ${gradeClass}`;
        }

        if (avatarImg && avatarDefault) {
            if (user.avatar) {
                avatarImg.src = user.avatar;
                avatarImg.style.display = 'block';
                avatarDefault.style.display = 'none';
            } else {
                avatarImg.style.display = 'none';
                avatarDefault.style.display = 'block';
            }
        }

        const editAvatarImgScale = document.getElementById('editAvatarImgScale');
        const editAvatarDefaultSVG = document.getElementById('editAvatarDefaultSVG');
        if (editAvatarImgScale && editAvatarDefaultSVG) {
            if (user.avatar) {
                editAvatarImgScale.src = user.avatar;
                editAvatarImgScale.style.display = 'block';
                editAvatarDefaultSVG.style.display = 'none';
            } else {
                editAvatarImgScale.style.display = 'none';
                editAvatarDefaultSVG.style.display = 'block';
            }
        }
        if (profileEmail && user.email) profileEmail.value = user.email;
        if (profileName && user.name) profileName.value = user.name;
    };

    // 초기 표시
    updateProfileUI();
    // applyAdminLayout(); // 하단으로 이동
    // initAdminMemo();    // 하단으로 이동

    // 비밀번호 가시성 토글
    document.querySelectorAll('.pw-toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const input = document.getElementById(btn.dataset.target);
            if (!input) return;
            const isVisible = input.type === 'text';
            input.type = isVisible ? 'password' : 'text';
            const eyeOn = btn.querySelector('.eye-on');
            const eyeOff = btn.querySelector('.eye-off');
            if (isVisible) {
                eyeOn.classList.add('u-hidden');
                eyeOn.style.display = 'none';
                eyeOff.classList.remove('u-hidden');
                eyeOff.style.display = 'block';
            } else {
                eyeOn.classList.remove('u-hidden');
                eyeOn.style.display = 'block';
                eyeOff.classList.add('u-hidden');
                eyeOff.style.display = 'none';
            }
        });
    });

    // 비밀번호 강도 표시기
    const pwInput = document.getElementById('profilePw');
    const segs = document.querySelectorAll('.pw-strength__seg');
    const label = document.getElementById('mypagePwStrengthLabel');

    if (pwInput && segs.length) {
        const calcStrength = (pw) => {
            let score = 0;
            if (pw.length >= 8) score++;
            if (/[a-zA-Z]/.test(pw)) score++;
            if (/\d/.test(pw)) score++;
            if (/[^a-zA-Z\d]/.test(pw)) score++;
            return score; // 0~4
        };
        const LEVELS = [
            { label: '', cls: '', color: '#eee' },
            { label: '보안취약', cls: 'strength-1', color: '#ff4d4f' },
            { label: '미흡', cls: 'strength-2', color: '#faad14' },
            { label: '양호', cls: 'strength-3', color: '#52c41a' },
            { label: '안전', cls: 'strength-4', color: '#13c2c2' },
        ];
        pwInput.addEventListener('input', () => {
            const score = calcStrength(pwInput.value);
            segs.forEach((seg, i) => {
                if (i < score) {
                    seg.style.background = LEVELS[score].color;
                } else {
                    seg.style.background = '#eee';
                }
            });
            if (label) {
                label.textContent = pwInput.value.length > 0 ? LEVELS[score].label : '';
                label.style.color = pwInput.value.length > 0 ? LEVELS[score].color : '#999';
            }
        });
    }

    // 주소 검색 API 연동
    const btnSearchAddress = document.getElementById('btnSearchAddress');
    if (btnSearchAddress) {
        btnSearchAddress.addEventListener('click', () => {
            if (typeof daum === 'undefined') return alert('주소 검색 서비스를 불러올 수 없습니다.');
            new daum.Postcode({
                oncomplete: function (data) {
                    document.getElementById('profileZipcode').value = data.zonecode;
                    document.getElementById('profileAddress1').value = data.address;
                    document.getElementById('profileAddress2').focus();
                }
            }).open();
        });
    }

    // 변경된 새로운 2단 아바타 영역 매핑
    const editAvatarWrap = document.getElementById('editAvatarWrap');
    const btnTriggerAvatar = document.getElementById('btnTriggerAvatar');

    // 실시간 동기화 연동 (다른 창이나 API로 유저 데이터 변경 시)
    window.addEventListener('varo:dataChange', (e) => {
        if (e.detail?.type === 'auth' || e.detail?.type === 'users') {
            updateProfileUI();
        }
    });

    // 사이드바 탭 전환
    const navLinks = document.querySelectorAll('.mypage-nav__link[data-target]');
    const sections = document.querySelectorAll('.mypage-section');

    const activateTab = (targetId) => {
        // 매번 최신 상태의 요소들을 가져옵니다 (관리자 레이아웃 변경 대응)
        const currentNavLinks = document.querySelectorAll('.mypage-nav__link[data-target]');
        const currentSections = document.querySelectorAll('.mypage-section');

        currentNavLinks.forEach(l => l.classList.remove('is-active'));
        currentSections.forEach(s => {
            s.classList.remove('is-active');
            s.style.display = 'none';
        });

        const targetLink = document.querySelector(`.mypage-nav__link[data-target="${targetId}"]`);
        const targetSection = document.getElementById(targetId);

        if (targetLink) targetLink.classList.add('is-active');
        if (targetSection) {
            targetSection.classList.add('is-active');
            targetSection.style.display = 'block';

            // 탭별 데이터 로드 로직 추가
            if (targetId === 'section-wishlist') renderWishlist();
            if (targetId === 'section-inquiry') renderUserInquiries();
            if (targetId === 'section-membership') renderMembershipInfo();
            if (targetId === 'section-address') renderAddresses();
            if (targetId === 'section-activity') renderAdminActivity();
        }
    };

    const renderMembershipInfo = () => {
        const user = JSON.parse(localStorage.getItem('varo_user') || '{}');
        const badge = document.getElementById('myPageGradeBadge');
        const desc = document.getElementById('myPageGradeDesc');
        const amountEl = document.getElementById('myPageTotalOrderAmount');
        const nextGradeEl = document.getElementById('nextGradeGuide');

        if (!badge || !desc || !amountEl) return;

        const grade = (user.grade || 'BRONZE').toUpperCase();
        const displayGrade = grade === 'ADMIN' ? '관리자설정' : grade;
        badge.textContent = displayGrade;

        // 색상 동기화
        const colors = {
            'BRONZE': '#A87C6C', 'SILVER': '#A0A0A0', 'GOLD': '#D4AF37',
            'DIA': '#00D1FF', 'MANAGER': '#D1D1FF', 'ADMIN': '#1B2B4B', '관리자설정': '#1B2B4B'
        };
        badge.style.background = colors[displayGrade] || colors[grade] || '#1c1a16';
        if (grade === 'DIA' || grade === 'MANAGER') badge.style.color = '#111';
        else badge.style.color = '#fff';

        desc.innerHTML = `회원님은 현재 <strong>${displayGrade}</strong> 권한으로 로그인 중입니다.`;

        const totalAmount = parseInt(localStorage.getItem('varo_total_order_amount') || '0');
        amountEl.textContent = `${totalAmount.toLocaleString()}원`;

        let nextGrade = '';
        let nextGoal = 0;
        if (totalAmount < 100000) { nextGrade = 'SILVER'; nextGoal = 100000; }
        else if (totalAmount < 300000) { nextGrade = 'GOLD'; nextGoal = 300000; }
        else if (totalAmount < 1000000) { nextGrade = 'DIA'; nextGoal = 1000000; }

        if (nextGrade) {
            const diff = nextGoal - totalAmount;
            nextGradeEl.innerHTML = `다음 등급(<strong>${nextGrade}</strong>)까지 <strong>${diff.toLocaleString()}원</strong> 남았습니다.`;
        } else {
            nextGradeEl.textContent = '최고 등급인 DIA 등급을 유지하고 계십니다.';
        }
    };

    const initAdminMemo = () => {
        const memoArea = document.getElementById('adminMemoArea');
        const saveBtn = document.getElementById('btnSaveMemo');
        if (!memoArea || !saveBtn) return;

        // 저장된 메모 불러오기
        memoArea.value = localStorage.getItem('varo_admin_memo') || '';

        // 메모 저장 이벤트
        saveBtn.addEventListener('click', () => {
            localStorage.setItem('varo_admin_memo', memoArea.value);
            if (window.Utils?.showToast) window.Utils.showToast('업무 메모가 저장되었습니다 ✍️', 'success');
        });
    };

    const renderAdminActivity = () => {
        const container = document.getElementById('section-activity');
        if (!container) return;

        // 실제 데이터가 없으므로 정적인 안내 문구만 유지
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.classList.contains('mypage-nav__link--logout')) return;
            e.preventDefault();
            const user = localStorage.getItem('varo_user');
            const targetId = link.getAttribute('data-target');
            if (!user && targetId !== 'section-wishlist') {
                alert('로그인이 필요한 메뉴입니다.');
                location.href = './login.html';
                return;
            }
            activateTab(targetId);
            // URL 업데이트 (뒤로가기 지원)
            history.replaceState(null, null, `?tab=${targetId.replace('section-', '')}`);
        });
    });

    // 초기 로딩 시 URL 파라미터 확인 후 탭 활성화
    const searchParams = new URLSearchParams(window.location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam) {
        activateTab(`section-${tabParam}`);
    }

    // 아바타 사진 수정 (모달 연동 및 반응형 크롭 시스템)
    const avatarWrap = document.getElementById('userAvatarWrap');
    const avatarModal = document.getElementById('avatarModal');
    const avatarPreviewLarge = document.getElementById('avatarPreviewLarge');
    const avatarModalUpload = document.getElementById('avatarModalUpload');
    const btnSelectNewAvatar = document.getElementById('btnSelectNewAvatar');
    const btnSaveAvatar = document.getElementById('btnSaveAvatar');
    const btnClose = document.querySelector('.varo-modal__close');
    const modalOverlay = document.querySelector('.varo-modal__overlay');
    const cropContainer = document.getElementById('cropContainer');

    if (avatarWrap && avatarModal) {
        let isDragging = false;
        let startX, startY;
        let panX = 0, panY = 0;
        let scale = 1;

        const showSaveBtn = () => {
            if (btnSaveAvatar) btnSaveAvatar.style.display = 'inline-block';
        };

        const applyTransform = () => {
            if (avatarPreviewLarge) {
                avatarPreviewLarge.style.transform = `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px)) scale(${scale})`;
            }
        };

        const resetCropState = () => {
            panX = 0; panY = 0; scale = 1;
            applyTransform();
        };

        const openModal = () => {
            const user = JSON.parse(localStorage.getItem('varo_user') || '{}');
            resetCropState();
            // 원본 이미지 우선 로드 (크롭본이 아닌 전체 사진)
            const originalSrc = user.avatarOriginal || user.avatar;
            if (originalSrc) {
                avatarPreviewLarge.src = originalSrc;
                // 이미 사진이 있으면 위치 조정 후 바로 저장 가능하도록 버튼 표시
                showSaveBtn();
            } else {
                avatarPreviewLarge.src = '';
                if (btnSaveAvatar) btnSaveAvatar.style.display = 'none';
            }
            avatarModal.classList.add('is-active');
        };

        // 기존 사이드바 아바타 및 새 2단 레이아웃 아바타 버튼 모두 모달 오픈 연동
        avatarWrap.addEventListener('click', openModal);

        const editAvatarWrap = document.getElementById('editAvatarWrap');
        const btnTriggerAvatar = document.getElementById('btnTriggerAvatar');
        if (editAvatarWrap) editAvatarWrap.addEventListener('click', openModal);
        if (btnTriggerAvatar) btnTriggerAvatar.addEventListener('click', openModal);

        const closeModal = () => {
            avatarModal.classList.remove('is-active');
        };

        if (btnClose) btnClose.addEventListener('click', closeModal);
        if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

        // 사진 파일 업로드 및 모달 안에 세팅
        if (btnSelectNewAvatar && avatarModalUpload) {
            btnSelectNewAvatar.addEventListener('click', () => {
                avatarModalUpload.click();
            });

            avatarModalUpload.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (ev) => {
                    const base64Data = ev.target.result;
                    avatarPreviewLarge.src = base64Data;
                    // 업로드 즉시 원본 이미지를 별도 보관
                    const user = JSON.parse(localStorage.getItem('varo_user') || '{}');
                    user.avatarOriginal = base64Data;
                    localStorage.setItem('varo_user', JSON.stringify(user));
                    resetCropState();
                    showSaveBtn();
                };
                reader.readAsDataURL(file);
            });
        }

        // 마우스 드래그를 이용한 팬(Pan) — 픽셀 기반 1:1 이동
        if (cropContainer && avatarPreviewLarge) {
            avatarPreviewLarge.draggable = false;
            avatarPreviewLarge.style.userSelect = 'none';
            avatarPreviewLarge.style.webkitUserDrag = 'none';
            cropContainer.style.cursor = 'grab';

            cropContainer.addEventListener('mousedown', (e) => {
                e.preventDefault();
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                cropContainer.style.cursor = 'grabbing';
            });
            window.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
                panX += e.clientX - startX;
                panY += e.clientY - startY;
                applyTransform();
                startX = e.clientX;
                startY = e.clientY;
                showSaveBtn();
            });
            window.addEventListener('mouseup', () => {
                isDragging = false;
                cropContainer.style.cursor = 'grab';
            });

            // 마우스 휠을 이용한 줌(Zoom) 기능
            cropContainer.addEventListener('wheel', (e) => {
                e.preventDefault();
                scale += e.deltaY * -0.001;
                scale = Math.min(Math.max(0.2, scale), 5);
                applyTransform();
                showSaveBtn();
            });

            // 최종 캔버스 크롭 데이터 저장
            if (btnSaveAvatar) {
                btnSaveAvatar.addEventListener('click', () => {
                    if (!avatarPreviewLarge.src || avatarPreviewLarge.src.length < 100) return;

                    const cvs = document.createElement('canvas');
                    const size = 500; // 고해상도 크롭
                    cvs.width = size;
                    cvs.height = size;
                    const ctx = cvs.getContext('2d');

                    // 컨테이너와 오버레이(원형 영역) 크기 구하기
                    const cRect = cropContainer.getBoundingClientRect();
                    const cW = cRect.width;
                    const cH = cRect.height;



                    // 원형 오버레이: 컨테이너 중앙, 반지름 = min(w,h) * 0.42
                    const overlayR = Math.min(cW, cH) * 0.42;

                    // CSS에서 이미지는 left:50%, top:50%, transform: translate(calc(-50%+panX), calc(-50%+panY)) scale(s)
                    // → 이미지 중심좌표(컨테이너 기준) = (cW/2 + panX, cH/2 + panY)
                    // → 이미지의 렌더 크기 = naturalWidth * (렌더비율) * scale

                    // 이미지의 렌더링된 실제 크기 (CSS object-fit 없이 자연 크기대로 표시)
                    const img = avatarPreviewLarge;
                    const imgRenderedW = img.getBoundingClientRect().width;
                    const imgRenderedH = img.getBoundingClientRect().height;

                    // 원본 대비 렌더 비율
                    const ratioX = img.naturalWidth / imgRenderedW;
                    const ratioY = img.naturalHeight / imgRenderedH;

                    // 이미지 중심 (컨테이너 좌표계)
                    const imgCenterX = cW / 2 + panX;
                    const imgCenterY = cH / 2 + panY;

                    // 오버레이 영역 좌상단 (컨테이너 좌표계)
                    const cropLeft = cW / 2 - overlayR;
                    const cropTop = cH / 2 - overlayR;
                    const cropSize = overlayR * 2;

                    // 오버레이 좌상단을 이미지 좌표계로 변환
                    // 이미지 좌상단(컨테이너 좌표) = imgCenter - renderedSize/2
                    const imgLeft = imgCenterX - imgRenderedW / 2;
                    const imgTop = imgCenterY - imgRenderedH / 2;

                    // 원본 이미지 좌표로 변환
                    const srcX = (cropLeft - imgLeft) * ratioX;
                    const srcY = (cropTop - imgTop) * ratioY;
                    const srcW = cropSize * ratioX;
                    const srcH = cropSize * ratioY;

                    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, size, size);

                    const base64Data = cvs.toDataURL('image/jpeg', 0.92);
                    const user = JSON.parse(localStorage.getItem('varo_user') || '{}');
                    user.avatar = base64Data;
                    localStorage.setItem('varo_user', JSON.stringify(user));

                    window.dispatchEvent(new CustomEvent('varo:dataChange', { detail: { type: 'auth', data: user } }));
                    updateProfileUI();
                    alert('프로필 사진이 저장되었습니다!');
                    closeModal();
                });
            }
        }
    }

    // 로그아웃 처리
    const btnLogoutSidebar = document.getElementById('btnLogout');
    if (btnLogoutSidebar) {
        btnLogoutSidebar.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('로그아웃 하시겠습니까?')) {
                localStorage.removeItem('varo_user');
                localStorage.removeItem('varo_token');
                // 실시간 헤더 및 타 탭 동기화를 위한 이벤트 발생
                window.dispatchEvent(new CustomEvent('varo:dataChange', { detail: { type: 'auth', data: null } }));
                location.replace('./index.html');
            }
        });
    }
    /* ── 위시리스트 & 문의내역 렌더링 ──────────────────── */
    function renderWishlist() {
        window.renderWishlist = renderWishlist;
        const grid = document.querySelector('.wishlist-grid');
        if (!grid) return;

        let wishlist = JSON.parse(localStorage.getItem('varo_wishlist') || '[]');
        const allProducts = (window.VARO_DATA && window.VARO_DATA.PRODUCTS) || [];

        // 데이터 정제: 객체 배열이든 ID 배열이든 ID 추출
        let wishIds = wishlist.map(item => {
            if (typeof item === 'object' && item !== null) return String(item.id || '');
            return String(item);
        }).filter(id => id);

        let wishProducts = allProducts.filter(p => wishIds.includes(String(p.id)));
        if (wishProducts.length === 0 && wishlist.length > 0 && typeof wishlist[0] === 'object') {
            wishProducts = wishlist;
        }

        if (wishProducts.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 60px 0; color: #888;">
                    <p style="margin-bottom: 15px; display: flex; justify-content: center;"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.3;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></p>
                    <p>위시리스트에 담긴 상품이 없습니다.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = wishProducts.map(p => {
            // 진짜 상품(data.js에 존재)이면 mainImg 그대로 사용
            let img = p.mainImg || '';
            const isRealProduct = allProducts.some(real => String(real.id) === String(p.id));

            if (!isRealProduct) {
                if (p.name && (p.name.includes('데님') || p.name.includes('팬츠') || p.name.includes('슬랙스'))) {
                    img = './assets/products/P037_main.jpg';
                } else if (p.name && (p.name.includes('셔츠') || p.name.includes('티'))) {
                    img = './assets/products/P011_main.jpg';
                }
            }

            return `
                <div class="wishlist-item">
                    <button class="btn-wishlist-delete" onclick="event.stopPropagation(); if(confirm('위시리스트에서 삭제하시겠습니까?')){ window.App.Wishlist.toggle('${p.id}'); renderWishlist(); }" aria-label="삭제">×</button>
                    <div class="wishlist-item__img" style="aspect-ratio: 3/4; overflow: hidden;">
                        <img src="${img}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div class="wishlist-item__info" style="padding: 15px;">
                        <p class="wishlist-item__brand" style="font-size: 11px; color: #AAA; margin-bottom: 4px;">${p.brand || 'VARO'}</p>
                        <p class="wishlist-item__name" style="font-size: 13px; font-weight: 600; color: #1C1A16; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</p>
                        <p class="wishlist-item__price" style="font-size: 14px; font-weight: 700; color: #D96B3C;">${(p.price || 0).toLocaleString()}원</p>
                        <button class="btn btn--outline btn--sm" style="width: 100%; margin-top: 15px; font-size: 11px;" onclick="location.href='./product.html?id=${p.id}'">상품보기</button>
                    </div>
                </div>
            `;
        }).join('');
    };

    const renderUserInquiries = () => {
        const container = document.getElementById('section-inquiry');
        if (!container) return;

        const titleHtml = '<h2 class="mypage-section__title">내 문의내역</h2>';
        const qnaData = JSON.parse(localStorage.getItem('varo_qna') || '[]');
        const user = JSON.parse(localStorage.getItem('varo_user') || '{}');
        const userQnas = qnaData.filter(q => q.authorEmail === user.email);

        if (userQnas.length === 0) {
            container.innerHTML = titleHtml + `
                <div class="empty-state" style="text-align: center; padding: 60px 0; color: #888; background: #FAFAFA; border: 1px dashed #E0E0E0; border-radius: 8px;">
                    <p style="margin-bottom: 15px; display: flex; justify-content: center;"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.3;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></p>
                    <p>등록된 문의 내역이 없습니다.</p>
                </div>
            `;
            return;
        }

        const listHtml = userQnas.map(q => `
            <div class="mypage-inquiry-item" style="border-bottom: 1px solid #F0F0F0; padding: 20px 0;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                    <span class="qna-status qna-status--${q.status}" style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 2px; ${q.status === 'done' ? 'background:#EAF3FF; color:#4A7FA5;' : 'background:#FEF0E8; color:#D96B3C;'}">${q.status === 'done' ? '답변완료' : '답변대기'}</span>
                    <span style="font-size: 11px; color: #AAA;">${q.date}</span>
                </div>
                <p style="font-size: 14px; font-weight: 600; color: #1C1A16; margin-bottom: 8px; display: flex; align-items: center; gap: 4px;">${q.isSecret ? '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' : ''}${q.subject}</p>
                <div style="font-size: 13px; color: #666; line-height: 1.6; background: #F9F9F9; padding: 12px; border-radius: 4px;">
                    ${q.content}
                </div>
                ${q.replies.length > 0 ? `
                    <div class="mypage-replies" style="margin-top: 10px; padding-left: 20px;">
                        ${q.replies.map(r => `
                            <div style="background: #FFF; border: 1px solid #EAEAEA; padding: 10px 15px; border-radius: 4px; margin-top: 8px; position: relative;">
                                <span style="position: absolute; left: -15px; top: 10px; color: #CCC;">⌞</span>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                    <span style="font-size: 11px; font-weight: 800; color: #D96B3C;">${r.author}</span>
                                    <span style="font-size: 10px; color: #AAA;">${r.date}</span>
                                </div>
                                <p style="font-size: 12.5px; color: #444; line-height: 1.5;">${r.content}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('');

        container.innerHTML = titleHtml + `<div class="mypage-inquiry-list">${listHtml}</div>`;
    };

    /* ── 배송지 관리 (CRUD) ─────────────────────────── */
    const renderAddresses = async () => {
        const list = document.getElementById('addressList');
        if (!list) return;

        let addresses = [];
        try {
            const res = await window.API.addresses.getAll();
            if (res.success && res.data && res.data.length > 0) {
                addresses = res.data;
            } else {
                throw new Error('No data or failed');
            }
        } catch (err) {
            console.warn('[Address] API 호출 실패, LocalStorage 폴백 사용.');
            addresses = JSON.parse(localStorage.getItem('varo_addresses') || '[]');
        }

        // 만약 데이터가 아예 없다면 기본 목업 하나 생성
        if (addresses.length === 0) {
            const user = JSON.parse(localStorage.getItem('varo_user') || '{}');
            addresses = [{
                id: 'addr_default',
                address_name: '기본 배송지 (집)',
                recipient_name: user.name || '홍길동',
                recipient_phone: user.phone || '010-1234-5678',
                zipcode: '06159',
                address: '서울 강남구 테헤란로 521',
                address_detail: '30층',
                is_default: 1
            }];
            localStorage.setItem('varo_addresses', JSON.stringify(addresses));
        }

        list.innerHTML = addresses.map(addr => `
            <div class="address-item" style="border: 1px solid #eee; padding: 20px; border-radius: 8px; background: #fff; position: relative; ${addr.is_default ? 'border-color: #000; box-shadow: 0 4px 12px rgba(0,0,0,0.05);' : ''}">
                ${addr.is_default ? '<span style="position: absolute; top: 15px; right: 15px; font-size: 10px; background: #000; color: #fff; padding: 2px 6px; border-radius: 2px;">기본 배송지</span>' : ''}
                <strong style="display: block; font-size: 14px; margin-bottom: 5px;">${addr.address_name}</strong>
                <p style="font-size: 13px; color: #333; margin-bottom: 5px;">${addr.recipient_name} | ${addr.recipient_phone}</p>
                <p style="font-size: 13px; color: #666; line-height: 1.4;">(${addr.zipcode}) ${addr.address} ${addr.address_detail || ''}</p>
                <div style="margin-top: 15px; display: flex; gap: 10px;">
                    <button class="btn btn--outline btn--sm" onclick='editAddress(${JSON.stringify(addr)})'>수정</button>
                    <button class="btn btn--outline btn--sm" style="color: #ff4d4f; border-color: #ff4d4f;" onclick="deleteAddress('${addr.id}')">삭제</button>
                </div>
            </div>
        `).join('');
    };

    window.openAddressModal = (data = null) => {
        const modal = document.getElementById('addressModal');
        const form = document.getElementById('addressForm');
        if (!modal || !form) return;

        form.reset();
        document.getElementById('addrId').value = data ? data.id : '';
        document.getElementById('addressModalTitle').textContent = data ? '배송지 수정' : '새 배송지 추가';

        if (data) {
            document.getElementById('addrName').value = data.address_name;
            document.getElementById('addrRecipient').value = data.recipient_name || '';
            document.getElementById('addrPhone').value = data.recipient_phone || '';
            document.getElementById('addrZipcode').value = data.zipcode;
            document.getElementById('addrBase').value = data.address;
            document.getElementById('addrDetail').value = data.address_detail || '';
            document.getElementById('addrDefault').checked = !!data.is_default;
        }
        modal.classList.add('is-active');
    };

    window.editAddress = (data) => window.openAddressModal(data);

    window.deleteAddress = async (id) => {
        if (!confirm('배송지를 삭제하시겠습니까?')) return;
        try {
            await window.API.addresses.delete(id);
        } catch (err) { console.warn(err); }

        let addresses = JSON.parse(localStorage.getItem('varo_addresses') || '[]');
        addresses = addresses.filter(addr => String(addr.id) !== String(id));
        localStorage.setItem('varo_addresses', JSON.stringify(addresses));

        if (window.Utils?.showToast) window.Utils.showToast('배송지가 삭제되었습니다.', 'success');
        renderAddresses();
    };

    window.searchPostcode = (type) => {
        if (typeof daum === 'undefined') return alert('주소 검색 서비스를 불러올 수 없습니다.');
        new daum.Postcode({
            oncomplete: (data) => {
                if (type === 'addr') {
                    document.getElementById('addrZipcode').value = data.zonecode;
                    document.getElementById('addrBase').value = data.address;
                    document.getElementById('addrDetail').focus();
                }
            }
        }).open();
    };

    const addressForm = document.getElementById('addressForm');
    if (addressForm) {
        addressForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('addrId').value;
            const data = {
                address_name: document.getElementById('addrName').value,
                recipient_name: document.getElementById('addrRecipient').value,
                recipient_phone: document.getElementById('addrPhone').value,
                zipcode: document.getElementById('addrZipcode').value,
                address: document.getElementById('addrBase').value,
                address_detail: document.getElementById('addrDetail').value,
                is_default: document.getElementById('addrDefault').checked ? 1 : 0
            };

            try {
                id ? await window.API.addresses.update(id, data) : await window.API.addresses.create(data);
            } catch (err) { console.warn(err); }

            let addresses = JSON.parse(localStorage.getItem('varo_addresses') || '[]');
            if (id) {
                const idx = addresses.findIndex(addr => String(addr.id) === String(id));
                if (idx !== -1) {
                    addresses[idx] = { ...addresses[idx], ...data };
                }
            } else {
                data.id = 'addr_' + Date.now();
                addresses.push(data);
            }

            if (data.is_default) {
                addresses.forEach(addr => {
                    if (String(addr.id) !== String(id || data.id)) addr.is_default = 0;
                });
            }

            localStorage.setItem('varo_addresses', JSON.stringify(addresses));

            window.Utils.showToast('배송지가 저장되었습니다.', 'success');
            document.getElementById('addressModal').classList.remove('is-active');
            renderAddresses();
        });
    }

    // ════════════════════════════════════════════════════════
    // 교환/반품 / 구매확정 / 배송추적 기능
    // ════════════════════════════════════════════════════════
    // 리뷰 및 반품 폼 로직
    // ════════════════════════════════════════════════════════
    const returnForm = document.getElementById('returnForm');
    if (returnForm) {
        returnForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const type = document.getElementById('returnType').value === 'exchange' ? '교환' : '반품';
            const productName = document.getElementById('returnProductName').value;

            if (window.Utils?.showToast) window.Utils.showToast(`${productName} 상품의 ${type} 신청이 접수되었습니다.`, 'success');
            document.getElementById('returnModal').classList.remove('is-active');
        });
    }

    const stars = document.querySelectorAll('#reviewStars span');
    if (stars.length) {
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = star.dataset.star;
                document.getElementById('reviewRating').value = rating;
                stars.forEach(s => {
                    s.style.color = s.dataset.star <= rating ? '#FFB800' : '#ddd';
                });
            });
        });
    }

    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const rating = document.getElementById('reviewRating').value;
            const content = document.getElementById('reviewContent').value.trim();

            if (rating === '0') return alert('별점을 선택해 주세요.');
            if (!content) return alert('한줄평을 입력해 주세요.');

            if (window.Utils?.showToast) window.Utils.showToast('리뷰가 성공적으로 등록되었습니다. 500 적립금이 지급되었습니다!', 'success');
            document.getElementById('reviewModal').classList.remove('is-active');

            document.getElementById('reviewRating').value = '0';
            document.getElementById('reviewContent').value = '';
            stars.forEach(s => s.style.color = '#ddd');
        });
    }

    // 1. 교환/반품 신청


    // 모달 닫기 버튼 공통 처리 (Address Modal 및 기타 모든 varo-modal 대응)
    document.querySelectorAll('.varo-modal__close, .varo-modal__overlay').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.varo-modal');
            if (modal) {
                modal.classList.remove('is-active');
            }
        });
    });

    // 배송조회 모달 (deliveryTrackingModal) 오버레이 클릭 시 닫기
    const deliveryModal = document.getElementById('deliveryTrackingModal');
    if (deliveryModal) {
        deliveryModal.addEventListener('click', (e) => {
            if (e.target === deliveryModal) {
                closeDeliveryModal();
            }
        });
    }

    // 타 창 동기화를 위한 이벤트 리스너
    window.addEventListener('storage', (e) => {
        if (e.key === 'varo_wishlist' && document.getElementById('section-wishlist').classList.contains('is-active')) {
            renderWishlist();
        }
        if (e.key === 'varo_qna' && document.getElementById('section-inquiry').classList.contains('is-active')) {
            renderUserInquiries();
        }
    });

    window.addEventListener('varo:dataChange', (e) => {
        if (e.detail.type === 'qna' && document.getElementById('section-inquiry').classList.contains('is-active')) {
            renderUserInquiries();
        }
    });

    // 최종 초기화 (모든 함수 정의 후)
    applyAdminLayout();
    initAdminMemo();
});

