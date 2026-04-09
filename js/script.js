const toggleBtn = document.querySelector('.v-mobile-toggle');
const navLinks = document.querySelector('.v-nav-links');

if (toggleBtn && navLinks) {
  toggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    toggleBtn.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
  });

  navLinks.addEventListener('click', event => {
    const clickedLink = event.target.closest('a');
    if (!clickedLink) return;

    navLinks.classList.remove('active');
    toggleBtn.innerHTML = '☰';
  });
}

const reveals = document.querySelectorAll('.v-reveal');
const revealOptions = {
  threshold: 0.08,
  rootMargin: '0px 0px -50px 0px'
};

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('v-active');
        obs.unobserve(entry.target);
      }
    });
  }, revealOptions);

  reveals.forEach(el => observer.observe(el));
} else {
  reveals.forEach(el => el.classList.add('v-active'));
}

const navItems = document.querySelectorAll('.v-nav-link');
const currentPath = window.location.pathname.split('/').pop() || 'index.html';

navItems.forEach(item => {
  const href = item.getAttribute('href') || '';
  const targetPath = href.split('#')[0];
  const hasHash = href.includes('#');

  if ((currentPath === '' || currentPath === 'index.html') && targetPath === 'index.html' && !hasHash) {
    item.classList.add('active');
  } else if (targetPath && targetPath === currentPath && !hasHash) {
    item.classList.add('active');
  }
});

const backToTop = document.querySelector('.v-back-to-top');

if (backToTop) {
  const toggleBackToTop = () => {
    if (window.scrollY > 280) {
      backToTop.classList.add('is-visible');
    } else {
      backToTop.classList.remove('is-visible');
    }
  };

  toggleBackToTop();
  window.addEventListener('scroll', toggleBackToTop);
}
