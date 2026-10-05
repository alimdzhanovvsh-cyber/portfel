(() => {
  const body = document.body;
  const progress = document.getElementById('progress');
  const year = document.getElementById('year');
  const themeToggle = document.getElementById('themeToggle');
  const menuBtn = document.getElementById('menuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const printBtn = document.getElementById('printBtn');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');

  year.textContent = new Date().getFullYear();

  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'dark') body.classList.add('dark-mode');
  updateThemeIcon();

  themeToggle?.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    localStorage.setItem('portfolio-theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    updateThemeIcon();
  });

  function updateThemeIcon() {
    if (!themeToggle) return;
    themeToggle.textContent = body.classList.contains('dark-mode') ? '☀' : '◐';
    themeToggle.setAttribute('aria-label', body.classList.contains('dark-mode') ? 'Жарык режим' : 'Караңгы режим');
  }

  menuBtn?.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? '×' : '☰';
  });

  document.querySelectorAll('#mobileNav a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.textContent = '☰';
    });
  });

  printBtn?.addEventListener('click', () => window.print());

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = `${pct}%`;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.remove('active'));
      const active = navLinks.find(link => link.getAttribute('href') === `#${entry.target.id}`);
      active?.classList.add('active');
    });
  }, { rootMargin: '-35% 0px -50% 0px', threshold: 0 });
  sections.forEach(section => navObserver.observe(section));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.dataset.image;
      const caption = item.dataset.caption || '';
      if (!src) return;
      lightboxImage.src = src;
      lightboxImage.alt = caption;
      lightboxCaption.textContent = caption;
      lightbox.classList.add('show');
      lightbox.setAttribute('aria-hidden', 'false');
      body.classList.add('no-scroll');
    });
  });

  document.querySelectorAll('[data-close-lightbox]').forEach(el => el.addEventListener('click', closeLightbox));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('show')) closeLightbox();
  });

  function closeLightbox() {
    lightbox.classList.remove('show');
    lightbox.setAttribute('aria-hidden', 'true');
    body.classList.remove('no-scroll');
    window.setTimeout(() => { lightboxImage.src = ''; }, 200);
  }
})();
