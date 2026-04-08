const getChapterHeaderOffset = () => {
  const header = document.querySelector('.v-header');
  if (header) return header.offsetHeight;

  const raw = getComputedStyle(document.documentElement).getPropertyValue('--v-header-height').trim();
  const parsed = Number.parseInt(raw, 10);
  return Number.isNaN(parsed) ? 80 : parsed;
};

const jumpLinks = Array.from(document.querySelectorAll('.v-jump-link'));

if (jumpLinks.length > 0) {
  const linkTargets = jumpLinks
    .map(link => {
      const href = link.getAttribute('href') || '';
      if (!href.startsWith('#') || href === '#') return null;
      const section = document.querySelector(href);
      return section ? { href, section, link } : null;
    })
    .filter(Boolean);

  linkTargets.forEach(item => {
    item.link.addEventListener('click', event => {
      event.preventDefault();

      const top = item.section.getBoundingClientRect().top + window.pageYOffset - getChapterHeaderOffset() - 8;
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    });
  });

  const updateActiveJumpLink = () => {
    let activeHash = linkTargets[0]?.href || '';

    linkTargets.forEach(item => {
      const top = item.section.offsetTop - getChapterHeaderOffset() - 80;
      if (window.scrollY >= top) {
        activeHash = item.href;
      }
    });

    jumpLinks.forEach(link => link.classList.remove('v-active'));
    const activeLink = jumpLinks.find(link => (link.getAttribute('href') || '') === activeHash);
    if (activeLink) {
      activeLink.classList.add('v-active');
    }
  };

  updateActiveJumpLink();
  window.addEventListener('scroll', updateActiveJumpLink);
}
