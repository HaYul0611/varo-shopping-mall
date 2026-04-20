// 경로: js/event.js — 이벤트 페이지
'use strict';

const EventPage = (() => {

  /* ── 카운트다운 타이머 ───────────────────── */
  const initTimer = () => {
    const h = document.getElementById('timerH');
    const m = document.getElementById('timerM');
    const s = document.getElementById('timerS');
    if (!h) return;
    const tick = () => {
      const now  = new Date();
      const end  = new Date(); end.setHours(23,59,59,999);
      const diff = Math.max(0, end - now);
      const hh = Math.floor(diff / 3600000);
      const mm = Math.floor((diff % 3600000) / 60000);
      const ss = Math.floor((diff % 60000) / 1000);
      h.textContent = String(hh).padStart(2,'0');
      m.textContent = String(mm).padStart(2,'0');
      s.textContent = String(ss).padStart(2,'0');
    };
    tick();
    setInterval(tick, 1000);
  };

  /* ── 이벤트 상품 그리드 ─────────────────── */
  const renderEventProducts = async () => {
    const grid = document.getElementById('eventProductGrid');
    if (!grid) return;

    let products = [];
    try {
      products = await API.products.getAll({ filter: 'event', limit: 8 });
    } catch {
      products = (window.VARO_DATA?.PRODUCTS || []).filter(p => p.isEvent);
    }

    const fmt  = n => n.toLocaleString('ko-KR') + '원';
    const disc = (p, s) => Math.round((1-s/p)*100);

    grid.innerHTML = '';
    products.slice(0, 8).forEach(p => {
      const card = document.createElement('article');
      card.className = 'product-card';
      const mainImg = p.main_img || p.mainImg || '';
      const subImg  = p.sub_img  || p.subImg  || mainImg;
      const price   = p.sale_price || p.salePrice || p.price;
      const origPr  = p.price;
      const priceHTML = price < origPr
        ? `<span class="product-card__discount">-${disc(origPr,price)}%</span><span class="product-card__price product-card__price--sale">${fmt(price)}</span><span class="product-card__price--original">${fmt(origPr)}</span>`
        : `<span class="product-card__price">${fmt(price)}</span>`;

      card.innerHTML = `
        <div class="product-card__img-wrap">
          <span class="product-card__badge--11">1+1</span>
          <img class="product-card__img product-card__img--main" src="${mainImg}" alt="${p.name}" loading="lazy">
          <img class="product-card__img product-card__img--sub" src="${subImg}" alt="" loading="lazy" aria-hidden="true">
          <div class="product-card__quick-add">빠른 담기</div>
        </div>
        <div class="product-card__info">
          <p class="product-card__brand">VARO</p>
          <p class="product-card__name">${p.name}</p>
          <div class="product-card__price-wrap">${priceHTML}</div>
        </div>
      `;
      card.addEventListener('click', () => {
        location.href = `./product.html?id=${p.product_code || p.id}`;
      });
      grid.appendChild(card);
    });
  };

  const init = () => {
    initTimer();
    renderEventProducts();
  };
  return { init };
})();

document.addEventListener('DOMContentLoaded', EventPage.init);
