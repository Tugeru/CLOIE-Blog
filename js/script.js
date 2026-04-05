// Mobile Menu
const toggleBtn = document.querySelector('.v-mobile-toggle');
const navLinks = document.querySelector('.v-nav-links');

if (toggleBtn && navLinks) {
  toggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    toggleBtn.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
  });
}

// Smooth Scroll
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

// Nav Active State
const sections = document.querySelectorAll('.v-section');
const navItems = document.querySelectorAll('.v-nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 150;
    const height = sec.offsetHeight;
    if (window.scrollY >= top && window.scrollY < top + height) {
      current = sec.getAttribute('id');
    }
  });
  
  navItems.forEach(li => {
    li.classList.remove('active');
    if (li.getAttribute('href') === `#${current}`) {
      li.classList.add('active');
    }
  });
});