const getHomeHeaderOffset = () => {
  const header = document.querySelector('.v-header');
  if (header) return header.offsetHeight;

  const raw = getComputedStyle(document.documentElement).getPropertyValue('--v-header-height').trim();
  const parsed = Number.parseInt(raw, 10);
  return Number.isNaN(parsed) ? 80 : parsed;
};

const closeMobileNav = () => {
  const nav = document.querySelector('.v-nav-links');
  const toggle = document.querySelector('.v-mobile-toggle');
  if (nav && nav.classList.contains('active')) {
    nav.classList.remove('active');
    if (toggle) toggle.innerHTML = '☰';
  }
};

const samePageHashLinks = document.querySelectorAll('a[href^="#"], a[href^="index.html#"]');

samePageHashLinks.forEach(link => {
  link.addEventListener('click', event => {
    const href = link.getAttribute('href') || '';
    const hash = href.includes('#') ? href.slice(href.indexOf('#')) : '';

    if (!hash || hash === '#') return;

    const target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    const top = target.getBoundingClientRect().top + window.pageYOffset - getHomeHeaderOffset();

    window.scrollTo({
      top,
      behavior: 'smooth'
    });

    closeMobileNav();
  });
});

const homeLink = document.querySelector('.v-nav-link[href="index.html"]');
const hashNavLinks = Array.from(
  document.querySelectorAll('.v-nav-link[href^="#"], .v-nav-link[href^="index.html#"]')
);

if (hashNavLinks.length > 0) {
  const watchedSections = hashNavLinks
    .map(link => {
      const href = link.getAttribute('href') || '';
      const hash = href.includes('#') ? href.slice(href.indexOf('#')) : '';
      if (!hash || hash === '#') return null;
      const section = document.querySelector(hash);
      return section ? { hash, section, link } : null;
    })
    .filter(Boolean);

  if (watchedSections.length > 0) {
    window.addEventListener('scroll', () => {
      let currentHash = '';

      watchedSections.forEach(item => {
        const top = item.section.offsetTop - getHomeHeaderOffset() - 80;
        const bottom = top + item.section.offsetHeight;
        if (window.scrollY >= top && window.scrollY < bottom) {
          currentHash = item.hash;
        }
      });

      hashNavLinks.forEach(link => link.classList.remove('active'));

      if (currentHash) {
        const match = hashNavLinks.find(link => {
          const href = link.getAttribute('href') || '';
          return href.endsWith(currentHash);
        });

        if (match) {
          match.classList.add('active');
          if (homeLink) homeLink.classList.remove('active');
        }
      } else if (homeLink) {
        homeLink.classList.add('active');
      }
    });
  }
}

const faqs = document.querySelectorAll('.v-faq-question');

faqs.forEach(faq => {
  faq.addEventListener('click', () => {
    const parent = faq.parentElement;
    const wasActive = parent.classList.contains('active');

    document.querySelectorAll('.v-faq-item').forEach(item => {
      item.classList.remove('active');
    });

    if (!wasActive) {
      parent.classList.add('active');
    }
  });
});
