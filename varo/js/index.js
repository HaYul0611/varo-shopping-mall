// 경로: js/index.js
// VARO 2026 — 홈페이지 로직 (슬라이더, 상품 그리드, 커뮤니티)
'use strict';

const IndexPage = (() => {

  const { PRODUCTS, COMMUNITY_POSTS } = window.VARO_DATA;

  /* ══════════════════════════════════════════
     멀티패널 메인 슬라이더
  ══════════════════════════════════════════ */
  const initSlider = () => {
    const track = document.getElementById('mainSliderTrack');
    const dots = document.getElementById('sliderDots');
    const prev = document.getElementById('sliderPrev');
    const next = document.getElementById('sliderNext');
    if (!track) return;

    const slides = track.querySelectorAll('.main-slider__slide');
    let current = 0;
    let autoTimer;

    // 닷 생성
    if (dots) {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = `main-slider__dot${i === 0 ? ' is-active' : ''}`;
        dot.setAttribute('aria-label', `슬라이드 ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dots.appendChild(dot);
      });
    }

    const goTo = (idx) => {
      current = (idx + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots?.querySelectorAll('.main-slider__dot').forEach((d, i) =>
        d.classList.toggle('is-active', i === current));
      resetAuto();
    };

    const resetAuto = () => {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(current + 1),
        (window.VARO_CONFIG?.HERO_AUTOPLAY_MS ?? 5000));
    };

    prev?.addEventListener('click', () => goTo(current - 1));
    next?.addEventListener('click', () => goTo(current + 1));

    // 터치 스와이프
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
    }, { passive: true });

    resetAuto();
  };

  /* ══════════════════════════════════════════
     상품 카드 빌더 (공통)
  ══════════════════════════════════════════ */
  const buildCard = (product, darkBg = false) => {
    const fmt = n => n.toLocaleString('ko-KR') + '원';
    const disc = (p, s) => Math.round((1 - s / p) * 100);
    const isWish = typeof App !== 'undefined' ? App.Wishlist.has(product.id) : false;
    const card = document.createElement('article');
    card.className = 'product-card';

    const imgWrap = document.createElement('div');
    imgWrap.className = 'product-card__img-wrap';

    const mainImg = document.createElement('img');
    mainImg.className = 'product-card__img product-card__img--main';
    mainImg.src = product.mainImg;
    mainImg.alt = product.name;
    mainImg.loading = 'lazy';
    mainImg.width = 600;
    mainImg.height = 800;

    const subImg = document.createElement('img');
    subImg.className = 'product-card__img product-card__img--sub';
    subImg.src = product.subImg;
    subImg.alt = '';
    subImg.loading = 'lazy';
    subImg.width = 600;
    subImg.height = 800;
    subImg.setAttribute('aria-hidden', 'true');

    imgWrap.append(mainImg, subImg);

    // 배지
    if (product.badge) {
      const badge = document.createElement('span');
      badge.className = `product-card__badge product-card__badge--${product.badge}`;
      badge.textContent = { new: 'NEW', sale: 'SALE', best: 'BEST' }[product.badge] ?? product.badge.toUpperCase();
      imgWrap.appendChild(badge);
    }
    if (product.isEvent) {
      const b11 = document.createElement('span');
      b11.className = 'product-card__badge--11';
      b11.textContent = '1+1';
      imgWrap.appendChild(b11);
    }

    // 위시 버튼
    const wishBtn = document.createElement('button');
    wishBtn.className = `product-card__wish${isWish ? ' product-card__wish--active' : ''}`;
    wishBtn.setAttribute('type', 'button');
    wishBtn.setAttribute('aria-label', '위시리스트');
    wishBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
    wishBtn.addEventListener('click', e => {
      e.stopPropagation();
      if (typeof App !== 'undefined') {
        const active = App.Wishlist.toggle(product.id);
        wishBtn.classList.toggle('product-card__wish--active', active);
      }
    });
    imgWrap.appendChild(wishBtn);

    // 퀵 담기
    const quick = document.createElement('div');
    quick.className = 'product-card__quick-add';
    quick.textContent = '빠른 담기';
    quick.addEventListener('click', e => {
      e.stopPropagation();
      if (typeof App !== 'undefined') {
        App.Cart.addItem(product, product.sizes[0], product.colors[0]?.name ?? '', 1);
      }
    });
    imgWrap.appendChild(quick);
    card.appendChild(imgWrap);

    // 정보
    const info = document.createElement('div');
    info.className = 'product-card__info';
    const brand = document.createElement('p');
    brand.className = 'product-card__brand';
    brand.textContent = product.brand;
    const name = document.createElement('p');
    name.className = 'product-card__name';
    name.textContent = product.name;
    const priceWrap = document.createElement('div');
    priceWrap.className = 'product-card__price-wrap';

    if (product.salePrice) {
      const dEl = document.createElement('span');
      dEl.className = 'product-card__discount';
      dEl.textContent = `-${disc(product.price, product.salePrice)}%`;
      const sEl = document.createElement('span');
      sEl.className = 'product-card__price product-card__price--sale';
      sEl.textContent = fmt(product.salePrice);
      const oEl = document.createElement('span');
      oEl.className = 'product-card__price--original';
      oEl.textContent = fmt(product.price);
      priceWrap.append(dEl, sEl, oEl);
    } else {
      const pEl = document.createElement('span');
      pEl.className = 'product-card__price';
      pEl.textContent = fmt(product.price);
      if (darkBg) pEl.style.color = '#fff';
      priceWrap.appendChild(pEl);
    }
    if (darkBg) {
      brand.style.color = 'rgba(255,255,255,.5)';
      name.style.color = '#fff';
    }
    info.append(brand, name, priceWrap);
    card.appendChild(info);

    card.addEventListener('click', e => {
      if (e.target.closest('.product-card__wish,.product-card__quick-add')) return;
      window.location.href = `./product.html?id=${product.id}`;
    });
    return card;
  };

  /* ══════════════════════════════════════════
     상품 그리드 렌더
  ══════════════════════════════════════════ */
  const renderGrid = (gridId, filterFn, darkBg = false, limit = 8) => {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    const list = PRODUCTS.filter(filterFn).slice(0, limit);
    list.forEach(p => grid.appendChild(buildCard(p, darkBg)));
  };

  /* ══════════════════════════════════════════
     스타일보드 커뮤니티 그리드
  ══════════════════════════════════════════ */
  const renderStyleBoard = () => {
    const grid = document.getElementById('styleBoardGrid');
    if (!grid) return;
    const hIcon = '<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
    const cIcon = '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
    COMMUNITY_POSTS.slice(0, 6).forEach(post => {
      const item = document.createElement('a');
      item.href = './community.html';
      item.className = 'style-board-item';
      const img = document.createElement('img');
      img.src = post.img;
      img.alt = post.username;
      img.loading = 'lazy';
      img.width = 400;
      img.height = 400;
      const overlay = document.createElement('div');
      overlay.className = 'style-board-item__overlay';
      overlay.innerHTML = `
        <span class="style-board-stat">${hIcon} ${post.likes}</span>
        <span class="style-board-stat">${cIcon} ${post.comments}</span>
      `;
      item.append(img, overlay);
      grid.appendChild(item);
    });
  };

  /* ══════════════════════════════════════════
     초기화
  ══════════════════════════════════════════ */
  const init = () => {
    // 3열 그리드에 맞춰 6개씩 렌더링 (균형 잡힌 레이아웃)
    renderGrid('newInGrid', p => p.badge === 'new', false, 6);
    renderGrid('bestGrid', p => p.badge === 'best', false, 6);
  };

  return { init };
})();

document.addEventListener('DOMContentLoaded', IndexPage.init);
