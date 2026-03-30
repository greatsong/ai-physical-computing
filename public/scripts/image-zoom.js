/**
 * 이미지 클릭 확대(Lightbox) - 모든 콘텐츠 이미지에 자동 적용
 * eduflow2 스타일 확대 기능
 */
(function () {
  function init() {
    const contentArea = document.querySelector('.sl-markdown-content') || document.querySelector('main');
    if (!contentArea) return;

    const images = contentArea.querySelectorAll('img:not(.no-zoom)');
    images.forEach((img) => {
      if (img.dataset.zoomBound) return;
      img.dataset.zoomBound = 'true';
      img.style.cursor = 'zoom-in';
      img.style.transition = 'border-color 0.2s, box-shadow 0.2s';

      img.addEventListener('mouseenter', () => {
        img.style.borderColor = 'var(--sl-color-accent)';
        img.style.boxShadow = '0 0 0 2px var(--sl-color-accent-low)';
      });
      img.addEventListener('mouseleave', () => {
        img.style.borderColor = '';
        img.style.boxShadow = '';
      });

      img.addEventListener('click', () => openZoom(img.src, img.alt));
    });
  }

  function openZoom(src, alt) {
    const overlay = document.createElement('div');
    overlay.className = 'zoom-overlay';
    overlay.innerHTML = `
      <button class="zoom-close" aria-label="닫기">✕</button>
      <div class="zoom-content" onclick="event.stopPropagation()">
        <img src="${src}" alt="${alt || ''}" style="max-width:100%;max-height:85vh;height:auto;object-fit:contain;" />
      </div>
      <span class="zoom-hint">ESC 또는 배경 클릭으로 닫기</span>
    `;

    function close() {
      overlay.remove();
      document.removeEventListener('keydown', escHandler);
    }

    function escHandler(e) {
      if (e.key === 'Escape') close();
    }

    overlay.addEventListener('click', close);
    overlay.querySelector('.zoom-close').addEventListener('click', (e) => {
      e.stopPropagation();
      close();
    });
    document.addEventListener('keydown', escHandler);
    document.body.appendChild(overlay);
  }

  // 페이지 로드 시 + Astro 네비게이션 후 재실행
  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('astro:page-load', init);
  // fallback
  if (document.readyState !== 'loading') init();
})();
