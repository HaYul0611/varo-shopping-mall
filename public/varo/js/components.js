/**
 * components.js
 * 공통 UI 컴포넌트(헤더, 푸터 등)를 동적으로 로드합니다.
 */
const ComponentLoader = (() => {
  const loadComponent = async (placeholderId, url) => {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;

    // 1. 스켈레톤 UI 주입 (로딩 중 시각적 효과)
    placeholder.innerHTML = `<div class="skeleton-box"></div>`;

    const tryLoad = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const html = await response.text();
        placeholder.outerHTML = html;
      } catch (error) {
        console.error(`[ComponentLoader] Error loading ${url}:`, error);
        // 2. 에러 폴백 UI 제공
        placeholder.innerHTML = `
          <div class="component-error">
            <p>구성 요소를 불러오지 못했습니다.</p>
            <button onclick="ComponentLoader.retry('${placeholderId}', '${url}')">다시 시도</button>
          </div>
        `;
      }
    };

    await tryLoad();
  };

  const retry = (id, url) => {
    loadComponent(id, url);
  };

  const init = async () => {
    const headerP = document.getElementById('header-placeholder');
    const footerP = document.getElementById('footer-placeholder');
    const overlayP = document.getElementById('overlay-placeholder');

    const timestamp = Date.now();
    const getFinalUrl = (url) => {
      // 캐시 버스터를 더 유니크하게 (v=[timestamp]-[random])
      const uniqueSuffix = `v=${timestamp}-${Math.floor(Math.random() * 1000)}`;
      const cacheBusted = url.includes('?') ? `${url}&${uniqueSuffix}` : `${url}?${uniqueSuffix}`;
      return cacheBusted;
    };

    const getResourcePath = (path) => {
      // '/'로 시작하면 절대 경로로 사용
      if (path.startsWith('/')) return path;
      // 현재 위치가 /public/varo/ 내부인지 확인하여 경로 조정 (지능형 폴백)
      const isSubDir = window.location.pathname.includes('/public/varo/');
      if (!isSubDir && path.startsWith('./includes/')) {
        return `./public/varo/${path.slice(2)}`;
      }
      return path;
    };

    if (headerP) await loadComponent('header-placeholder', getFinalUrl(getResourcePath(headerP.dataset.path || './includes/header.html')));
    if (footerP) await loadComponent('footer-placeholder', getFinalUrl(getResourcePath(footerP.dataset.path || './includes/footer.html')));
    if (overlayP) await loadComponent('overlay-placeholder', getFinalUrl(getResourcePath(overlayP.dataset.path || './includes/overlays.html')));

    // 로드 완료 이벤트 발생 (main.js 등에서 수신)
    document.dispatchEvent(new CustomEvent('varo:componentsLoaded'));
  };

  return { init, retry };
})();

// DOM 콘텐츠 로드 후 시작
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ComponentLoader.init);
} else {
  ComponentLoader.init();
}
