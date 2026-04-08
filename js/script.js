// Mobile Menu
const toggleBtn = document.querySelector('.v-mobile-toggle');
const navLinks = document.querySelector('.v-nav-links');

if (toggleBtn && navLinks) {
  toggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    toggleBtn.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
  });
}

// Smooth Scroll for same-page hash links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      if (navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        if (toggleBtn) toggleBtn.innerHTML = '☰';
      }
    }
  });
});

// Section Reveal
const reveals = document.querySelectorAll('.v-reveal');
const revealOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px"
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

// FAQ Accordion
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

// Nav Active State (page-based)
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

// Home-only section spy (for optional in-page nav links)
const sections = document.querySelectorAll('.v-section[id]');
const inPageNavItems = Array.from(navItems).filter(item => (item.getAttribute('href') || '').startsWith('#'));

if (sections.length > 0 && inPageNavItems.length > 0) {
  window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(sec => {
      const top = sec.offsetTop - 150;
      const height = sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        current = sec.getAttribute('id');
      }
    });

    inPageNavItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
