(() => {
	const nav = document.querySelector('.site-nav');
	const navToggle = document.querySelector('.nav-toggle');
	const navMenu = document.querySelector('.nav-menu');
	const navLinks = Array.from(document.querySelectorAll('.nav-menu a[href^="#"]'));
	const sections = navLinks
		.map((link) => document.querySelector(link.getAttribute('href')))
		.filter(Boolean);

	const revealItems = Array.from(document.querySelectorAll('.reveal'));
	const faqItems = Array.from(document.querySelectorAll('.faq-item'));
	const faqButtons = Array.from(document.querySelectorAll('.faq-trigger'));
	const yearNode = document.getElementById('year');

	const closeMobileMenu = () => {
		if (!navToggle || !navMenu) {
			return;
		}

		navToggle.setAttribute('aria-expanded', 'false');
		navMenu.classList.remove('is-open');
	};

	const updateStickyNav = () => {
		if (!nav) {
			return;
		}

		const isVisible = window.scrollY > 80;
		nav.classList.toggle('is-visible', isVisible);
	};

	const updateActiveNavLink = () => {
		if (!sections.length) {
			return;
		}

		const viewportMarker = window.scrollY + (window.innerHeight * 0.35);
		let activeSectionId = sections[0].id;

		sections.forEach((section) => {
			if (section.offsetTop <= viewportMarker) {
				activeSectionId = section.id;
			}
		});

		navLinks.forEach((link) => {
			const targetId = link.getAttribute('href').slice(1);
			link.classList.toggle('is-active', targetId === activeSectionId);
		});
	};

	const scrollToSection = (targetId) => {
		const target = document.querySelector(targetId);
		if (!target) {
			return;
		}

		target.scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		});
	};

	const setFaqOpenState = (item, shouldOpen) => {
		const button = item.querySelector('.faq-trigger');
		const panel = item.querySelector('.faq-panel');
		const chevron = item.querySelector('.faq-chevron');

		if (!button || !panel || !chevron) {
			return;
		}

		item.classList.toggle('is-open', shouldOpen);
		button.setAttribute('aria-expanded', String(shouldOpen));
		panel.hidden = !shouldOpen;
		chevron.textContent = shouldOpen ? '▴' : '▾';
	};

	const initializeFaq = () => {
		faqItems.forEach((item) => {
			const button = item.querySelector('.faq-trigger');
			const panel = item.querySelector('.faq-panel');
			const isOpen = button && button.getAttribute('aria-expanded') === 'true';

			if (!button || !panel) {
				return;
			}

			setFaqOpenState(item, isOpen);
		});

		faqButtons.forEach((button) => {
			button.addEventListener('click', () => {
				const item = button.closest('.faq-item');
				if (!item) {
					return;
				}

				const isOpen = button.getAttribute('aria-expanded') === 'true';
				faqItems.forEach((otherItem) => setFaqOpenState(otherItem, false));
				setFaqOpenState(item, !isOpen);
			});
		});
	};

	const initializeReveal = () => {
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) {
			revealItems.forEach((item) => item.classList.add('is-visible'));
			return;
		}

		const observer = new IntersectionObserver((entries, revealObserver) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) {
					return;
				}

				entry.target.classList.add('is-visible');
				revealObserver.unobserve(entry.target);
			});
		}, {
			threshold: 0.14,
			rootMargin: '0px 0px -10% 0px'
		});

		revealItems.forEach((item) => observer.observe(item));
	};

	if (navToggle && navMenu) {
		navToggle.addEventListener('click', () => {
			const currentlyExpanded = navToggle.getAttribute('aria-expanded') === 'true';
			navToggle.setAttribute('aria-expanded', String(!currentlyExpanded));
			navMenu.classList.toggle('is-open', !currentlyExpanded);
		});
	}

	navLinks.forEach((link) => {
		link.addEventListener('click', (event) => {
			const targetId = link.getAttribute('href');
			if (!targetId || !targetId.startsWith('#')) {
				return;
			}

			event.preventDefault();
			scrollToSection(targetId);
			closeMobileMenu();
		});
	});

	document.addEventListener('click', (event) => {
		if (!navMenu || !navToggle || !navMenu.classList.contains('is-open')) {
			return;
		}

		if (event.target instanceof Element && !event.target.closest('.nav-inner')) {
			closeMobileMenu();
		}
	});

	window.addEventListener('resize', () => {
		if (window.innerWidth >= 768) {
			closeMobileMenu();
		}
	});

	window.addEventListener('scroll', () => {
		updateStickyNav();
		updateActiveNavLink();
	}, { passive: true });

	initializeReveal();
	initializeFaq();
	updateStickyNav();
	updateActiveNavLink();

	if (yearNode) {
		yearNode.textContent = String(new Date().getFullYear());
	}
})();
