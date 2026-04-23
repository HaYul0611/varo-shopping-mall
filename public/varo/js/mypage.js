/**
 * 마이페이지 전용 로직
 * - 유저 정보 표시 및 동기화 (등급, 사진 등)
 * - 사이드바 탭 전환
 * - 사진 업로드 및 변경
 * - 로그아웃 처리
 */
document.addEventListener('DOMContentLoaded', () => {

    const applyAdminLayout = () => {
        const user = JSON.parse(localStorage.getItem('varo_user') || '{}');
        const isAdmin = user.role === 'ADMIN' || user.grade === 'ADMIN';
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
        const user = JSON.parse(localStorage.getItem('varo_user') || '{}');
        const userNameLabel = document.getElementById('userNameLabel');
        const userGradeLabel = document.getElementById('userGradeLabel');
        const avatarImg = document.getElementById('userAvatarImg');
        const avatarDefault = document.getElementById('userAvatarDefault');

        const profileEmail = document.getElementById('profileEmail');
        const profileName = document.getElementById('profileName');

        if (userNameLabel && user.name) {
            userNameLabel.textContent = user.name;
        }

        if (userGradeLabel) {
            const gradeMap = {
                'BASIC': 'BRONZE', 'BRONZE': 'BRONZE',
                'SILVER': 'SILVER', 'GOLD': 'GOLD',
                'DIA': 'DIA',
                'MANAGER': 'MANAGER', 'ADMIN': 'ADMIN'
            };
            const displayGrade = gradeMap[user.grade] || user.grade || 'BRONZE';
            userGradeLabel.textContent = displayGrade;

            // 등급별 색상 클래스 추가
            userGradeLabel.className = `user-grade is-${(user.grade || 'bronze').toLowerCase()}`;
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
        badge.textContent = grade;

        // 색상 동기화
        const colors = {
            'BRONZE': '#A87C6C', 'SILVER': '#A0A0A0', 'GOLD': '#D4AF37',
            'DIA': '#00D1FF', 'MANAGER': '#D1D1FF', 'ADMIN': '#1B2B4B'
        };
        badge.style.background = colors[grade] || '#1c1a16';
        if (grade === 'DIA' || grade === 'MANAGER') badge.style.color = '#111';
        else badge.style.color = '#fff';

        desc.innerHTML = `회원님은 현재 <strong>${grade}</strong> 등급입니다.`;

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
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
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
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('로그아웃 하시겠습니까?')) {
                localStorage.removeItem('varo_user');
                localStorage.removeItem('varo_token');
                location.replace('./index.html');
            }
        });
    }    /* ── 위시리스트 & 문의내역 렌더링 ──────────────────── */
    const renderWishlist = () => {
        const grid = document.querySelector('.wishlist-grid');
        if (!grid) return;

        const wishlistIds = JSON.parse(localStorage.getItem('varo_wishlist') || '[]');
        const allProducts = (window.VARO_DATA && window.VARO_DATA.PRODUCTS) || [];
        const wishProducts = allProducts.filter(p => wishlistIds.includes(p.id));

        if (wishProducts.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 60px 0; color: #888;">
                    <p style="font-size: 40px; margin-bottom: 15px; opacity: 0.3;">🖤</p>
                    <p>위시리스트에 담긴 상품이 없습니다.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = wishProducts.map(p => `
            <div class="wishlist-item" style="border: 1px solid #F0F0F0; border-radius: 4px; overflow: hidden; background: #fff;">
                <div class="wishlist-item__img" style="aspect-ratio: 3/4; overflow: hidden;">
                    <img src="${p.mainImg}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="wishlist-item__info" style="padding: 15px;">
                    <p class="wishlist-item__brand" style="font-size: 11px; color: #AAA; margin-bottom: 4px;">${p.brand}</p>
                    <p class="wishlist-item__name" style="font-size: 13px; font-weight: 600; color: #1C1A16; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</p>
                    <p class="wishlist-item__price" style="font-size: 14px; font-weight: 700; color: #D96B3C;">${p.price.toLocaleString()}원</p>
                    <button class="btn btn--outline btn--sm" style="width: 100%; margin-top: 15px; font-size: 11px;" onclick="location.href='./product-detail.html?id=${p.id}'">상품보기</button>
                </div>
            </div>
        `).join('');
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
                    <p style="font-size: 40px; margin-bottom: 15px; opacity: 0.3;">✉️</p>
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
                <p style="font-size: 14px; font-weight: 600; color: #1C1A16; margin-bottom: 8px;">${q.isSecret ? '🔒 ' : ''}${q.subject}</p>
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

