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
