(() => {
  // true に変更すると、ページを開くたびにWORKSの表示順をランダム化します。
  const randomizeWorks = false;
  // true に変更した場合のみ、HTMLに直接書かれた画像パスをJavaScriptで上書きします。
  const overrideVisuals = false;

  // Visual Library: ランダム表示や比較検証でJavaScript上書きが必要な場合に使います。
  const visualLibrary = {
    'works-print': 'assets/images/categories/01-flyers.jpg',
    'works-cosmetics': 'assets/images/categories/02-cosmetics.jpg',
    'works-telecom': 'assets/images/categories/03-telecommunications.jpg',
    'works-corporate': 'assets/images/categories/04-corporate.jpg',
    'works-education': 'assets/images/categories/05-education.jpg',
    'works-editorial': 'assets/images/categories/06-editorial.jpg',
    'works-medical': 'assets/images/categories/07-medical.jpg',
    'works-web': 'assets/images/categories/08-web.jpg',
    'works-others': 'assets/images/categories/09-others.jpg',
    'philosophy-simple': 'assets/images/philosophy/01-simple-composition.jpg',
    'philosophy-timeless': 'assets/images/philosophy/02-timeless-design.jpg',
    'philosophy-ai': 'assets/images/philosophy/03-design-ai.jpg'
  };

  if (overrideVisuals) {
    document.querySelectorAll('[data-visual]').forEach((panel) => {
      const source = visualLibrary[panel.dataset.visual];
      if (source) panel.style.backgroundImage = `url("${source}")`;
    });
  }

  const nav = document.querySelector('#global-nav');
  const menuButton = document.querySelector('.menu-button');
  const navLinks = [...document.querySelectorAll('#global-nav a')];
  const sections = navLinks.map((link) => document.querySelector(link.hash)).filter(Boolean);
  const worksGrid = document.querySelector('[data-works-grid]');

  // オフラインの file:// 表示でも確実に動くスムーススクロール。
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.hash);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      nav?.classList.remove('open');
      menuButton?.setAttribute('aria-expanded', 'false');
    });
  });

  menuButton?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  // タッチ端末でもカードのhover表現を短く確認できます。
  document.querySelectorAll('.work-card').forEach((card) => {
    card.addEventListener('pointerenter', () => card.classList.add('is-hovered'));
    card.addEventListener('pointerleave', () => card.classList.remove('is-hovered'));
    card.addEventListener('touchstart', () => card.classList.add('is-hovered'), { passive: true });
    card.addEventListener('touchend', () => card.classList.remove('is-hovered'), { passive: true });
  });

  if (randomizeWorks && worksGrid) {
    const cards = [...worksGrid.children];
    for (let index = cards.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [cards[index], cards[randomIndex]] = [cards[randomIndex], cards[index]];
    }
    cards.forEach((card) => worksGrid.appendChild(card));
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
      });
    }, { rootMargin: '-25% 0px -65%' });
    sections.forEach((section) => observer.observe(section));
  }

  document.querySelector('#year').textContent = new Date().getFullYear();

  // 営業先別表示例: index.html?hide=telecom,cosmetics&visibility=public
  const params = new URLSearchParams(location.search);
  const hiddenCategories = (params.get('hide') || '').split(',').filter(Boolean);
  hiddenCategories.forEach((category) => {
    document.querySelectorAll(`[data-category="${CSS.escape(category)}"]`).forEach((card) => { card.hidden = true; });
  });
  if (params.get('visibility') === 'public') {
    document.querySelectorAll('[data-visibility="limited"]').forEach((card) => { card.hidden = true; });
  }
})();
