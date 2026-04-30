/**
 * components.js
 * 공통 UI 컴포넌트(헤더, 푸터 등)를 동적으로 로드합니다.
 */
const ComponentLoader = (() => {
  const loadComponent = async (placeholderId, url) => {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;
    placeholder.innerHTML = `<div class="skeleton-box"></div>`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const html = await response.text();
      placeholder.outerHTML = html;
    } catch (error) {
      console.error(`[ComponentLoader] Error loading ${url}:`, error);
    }
  };

  const init = async () => {
    const headerP = document.getElementById('header-placeholder');
    const footerP = document.getElementById('footer-placeholder');
    const overlayP = document.getElementById('overlay-placeholder');

    const timestamp = Date.now();
    const getFinalUrl = (url) => {
      const uniqueSuffix = `v=${timestamp}-${Math.floor(Math.random() * 1000)}`;
      return url.includes('?') ? `${url}&${uniqueSuffix}` : `${url}?${uniqueSuffix}`;
    };

    const getResourcePath = (path) => {
      // 이미 절대 경로이거나 외부 URL이면 그대로 반환
      if (path.startsWith('http') || path.startsWith('/')) return path;
      // 현재 페이지 경로가 /public/varo/를 포함하면 상대 경로 그대로 사용
      // (index.html에서 ./includes/header.html 호출 시)
      return path;
    };

    const tasks = [];
    if (headerP) tasks.push(loadComponent('header-placeholder', getFinalUrl(getResourcePath(headerP.dataset.path || './includes/header.html'))));
    if (footerP) tasks.push(loadComponent('footer-placeholder', getFinalUrl(getResourcePath(footerP.dataset.path || './includes/footer.html'))));
    if (overlayP) tasks.push(loadComponent('overlay-placeholder', getFinalUrl(getResourcePath(overlayP.dataset.path || './includes/overlays.html'))));

    await Promise.all(tasks);

    // [ADD] 헤더 로드 후 카테고리 순서 재배치 로직
    const updateHeaderOrder = async (retryCount = 0) => {
      try {
        let catsStr = localStorage.getItem('varo_categories');
        let cats = [];

        if (!catsStr || catsStr === '[]') {
          if (window.API && typeof window.API.req === 'function') {
            const res = await window.API.req('GET', '/categories');
            if (res.success && (res.data || res.categories)) {
              cats = res.data || res.categories;
              localStorage.setItem('varo_categories', JSON.stringify(cats));
            }
          }
        } else {
          try {
            cats = JSON.parse(catsStr);
          } catch (e) {
            console.error('[HeaderSync] JSON parse error:', e);
          }
        }

        if (!Array.isArray(cats) || !cats.length) return;

        const parents = cats.filter(c => !c.parent_id || c.parent_id === 'null' || c.parent_id === '').sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

        const navList = document.querySelector('.category-nav__list');
        if (!navList) {
          if (retryCount < 10) {
            setTimeout(() => updateHeaderOrder(retryCount + 1), 200);
            return;
          }
          return;
        }

        // [FIX] 기존 DOM의 구조와 클래스를 유지하면서 서브 메뉴까지 포함하여 렌더링합니다.
        const children = cats.filter(c => c.parent_id && c.parent_id !== 'null' && c.parent_id !== '');

        navList.innerHTML = parents.map(p => {
          const subItems = children.filter(c => String(c.parent_id) === String(p.id)).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
          const hasSub = subItems.length > 0;
          const nameUpper = p.name.toUpperCase();

          let itemClass = 'category-nav__item';
          if (hasSub) itemClass += ' has-sub';
          if (nameUpper.includes('NEW')) itemClass += ' category-nav__item--new';
          if (nameUpper.includes('EVENT')) itemClass += ' category-nav__item--event';

          // [FIX] 모든 카테고리를 ACC처럼 일반 서브메뉴 스타일로 통일 (오버레이 제거)

          const colorStyle = p.font_color ? ` style="color:${p.font_color} !important"` : '';
          const slug = p.slug || p.id;

          // 링크 URL 매핑 (원본 header.html 방식 준수)
          let linkUrl = `./shop.html?cat=${slug}`;
          if (nameUpper === 'BEST') linkUrl = './shop.html?filter=best';
          else if (nameUpper.includes('NEW')) linkUrl = './shop.html?filter=new';
          else if (nameUpper === 'COLLECTION') linkUrl = './shop.html';
          else if (nameUpper === 'ACC') linkUrl = './shop.html?category=acc';
          else if (nameUpper === 'COMMUNITY') linkUrl = './community.html';
          else if (nameUpper.includes('EVENT')) linkUrl = './event.html';
          else if (hasSub) linkUrl = `./shop.html?category=${slug.toLowerCase()}`;

          let subHtml = '';
          if (hasSub) {
            subHtml = `<ul class="sub-menu">` +
              subItems.map(s => {
                const sSlug = s.slug || s.id;
                // 하위 카테고리 링크 구조 (원본: ?sub=...)
                return `<li><a href="./shop.html?sub=${sSlug.toLowerCase()}">${s.name}</a></li>`;
              }).join('') +
              `</ul>`;
          }

          return `
            <li class="${itemClass}">
              <a href="${linkUrl}"${colorStyle}>${p.name}</a>
              ${subHtml}
            </li>
          `;
        }).join('');

        // [ADD] 메뉴가 새로 생성되었으므로 메가메뉴 리스너 재등록
        if (window.MegaMenu && typeof window.MegaMenu.init === 'function') {
          window.MegaMenu.init();
        }

        console.log('[HeaderSync] Header categories re-rendered with MegaMenu sync');
      } catch (e) {
        console.error('[ComponentLoader] Failed to update header:', e);
      }
    };

    window.updateHeaderOrder = updateHeaderOrder;
    updateHeaderOrder();

    // 1. Storage 이벤트 감지 (다른 탭/창)
    window.addEventListener('storage', (e) => {
      if (e.key === 'varo_categories' || e.key === 'VARO_CATEGORIES_ORDER') {
        console.log('[HeaderSync] Storage event detected:', e.key);
        updateHeaderOrder();
      }
    });

    // 2. BroadcastChannel 감지 (동일 브라우저 내 모든 컨텍스트)
    try {
      const syncChannel = new BroadcastChannel('varo_admin_sync');
      syncChannel.onmessage = (e) => {
        console.log('[HeaderSync] Broadcast message received:', e.data);
        if (e.data && (e.data.type === 'categories' || e.data.reordered)) {
          updateHeaderOrder();
        }
      };
    } catch (err) {
      console.warn('[HeaderSync] BroadcastChannel not supported:', err);
    }

    window.varoComponentsLoaded = true;
    document.dispatchEvent(new CustomEvent('varo:componentsLoaded'));
  };

  return { init };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ComponentLoader.init);
} else {
  ComponentLoader.init();
}
