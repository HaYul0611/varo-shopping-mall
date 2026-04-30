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
    const updateHeaderOrder = async () => {
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

        console.log('[HeaderSync] Cats raw data:', JSON.stringify(cats));

        const parents = cats.filter(c => !c.parent_id || c.parent_id === 'null' || c.parent_id === '').sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        console.log('[HeaderSync] Parents ordered:', parents.map(p => `${p.name}(${p.sort_order})`));

        const navList = document.querySelector('.category-nav__list');
        if (!navList) {
          console.warn('[HeaderSync] navList not found');
          return;
        }

        const items = Array.from(navList.querySelectorAll('.category-nav__item'));
        if (!items.length) {
          console.warn('[HeaderSync] items not found');
          return;
        }

        const sortedItems = [];
        parents.forEach(ord => {
          const match = items.find(item => {
            const aText = item.querySelector('a')?.textContent.trim().replace(/\s+/g, '').toUpperCase() || '';
            const ordName = ord.name.trim().replace(/\s+/g, '').toUpperCase() || '';
            return aText === ordName || aText.includes(ordName) || ordName.includes(aText);
          });
          if (match) sortedItems.push(match);
        });

        console.log('[HeaderSync] Sorted items count:', sortedItems.length);

        items.forEach(item => {
          if (!sortedItems.includes(item)) sortedItems.push(item);
        });

        navList.innerHTML = '';
        sortedItems.forEach(item => navList.appendChild(item));
      } catch (e) {
        console.error('[ComponentLoader] Failed to reorder header:', e);
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
