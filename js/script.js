(() => {
	const nav = document.querySelector('.site-nav');
	const navToggle = document.querySelector('.nav-toggle');
	const navMenu = document.querySelector('.nav-menu');
	const navRoot = document.querySelector('.nav-inner');
	const navLinks = Array.from(document.querySelectorAll('.nav-menu a[href^="#"]'));
	const allInPageAnchors = Array.from(document.querySelectorAll('a[href^="#"]'));
	const sections = navLinks
		.map((link) => document.querySelector(link.getAttribute('href')))
		.filter(Boolean);

	const revealItems = Array.from(document.querySelectorAll('.reveal'));
	const faqItems = Array.from(document.querySelectorAll('.faq-item'));
	const faqButtons = Array.from(document.querySelectorAll('.faq-trigger'));
	const yearNode = document.getElementById('year');
	const DEFAULT_HEADER_OFFSET = 80;

	const attachManagedListener = (target, eventName, key, handler, options) => {
		if (!target) {
			return;
		}

		const oldHandler = target[key];
		if (oldHandler) {
			target.removeEventListener(eventName, oldHandler);
		}

		target[key] = handler;
		target.addEventListener(eventName, handler, options);
	};

	const getHeaderOffset = () => {
		if (!nav) {
			return DEFAULT_HEADER_OFFSET;
		}

		return Math.max(DEFAULT_HEADER_OFFSET, nav.offsetHeight || 0);
	};

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

		const isVisible = window.scrollY > 40;
		nav.classList.toggle('is-visible', isVisible);
	};

	const updateActiveNavLink = () => {
		if (!sections.length) {
			return;
		}

		const viewportMarker = window.scrollY + getHeaderOffset() + 16;
		let activeSectionId = sections[0].id;

		sections.forEach((section) => {
			if (section.offsetTop - 24 <= viewportMarker) {
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

		const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
		const top = Math.max(targetPosition - getHeaderOffset(), 0);

		window.scrollTo({
			top,
			behavior: 'smooth'
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
			const handleFaq = () => {
				const item = button.closest('.faq-item');
				if (!item) {
					return;
				}

				const isOpen = button.getAttribute('aria-expanded') === 'true';
				faqItems.forEach((otherItem) => setFaqOpenState(otherItem, false));
				setFaqOpenState(item, !isOpen);
			};

			attachManagedListener(button, 'click', '_handleFaq', handleFaq);
		});
	};

	const initializeReveal = () => {
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) {
			revealItems.forEach((item) => item.classList.add('is-visible'));
			return;
		}

		if (window._revealObserver) {
			window._revealObserver.disconnect();
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
			threshold: 0.15,
			rootMargin: '0px 0px -50px 0px'
		});

		window._revealObserver = observer;

		revealItems.forEach((item) => observer.observe(item));
	};

	if (navToggle && navMenu) {
		const handleToggle = () => {
			const currentlyExpanded = navToggle.getAttribute('aria-expanded') === 'true';
			navToggle.setAttribute('aria-expanded', String(!currentlyExpanded));
			navMenu.classList.toggle('is-open', !currentlyExpanded);
		};

		attachManagedListener(navToggle, 'click', '_handleToggle', handleToggle);
	}

	allInPageAnchors.forEach((anchor) => {
		if (anchor.classList.contains('skip-link')) {
			return;
		}

		const handleAnchorScroll = (event) => {
			const targetId = anchor.getAttribute('href');
			if (!targetId || !targetId.startsWith('#')) {
				return;
			}

			const target = document.querySelector(targetId);
			if (!target) {
				return;
			}

			event.preventDefault();
			scrollToSection(targetId);
			closeMobileMenu();
		};

		attachManagedListener(anchor, 'click', '_handleScroll', handleAnchorScroll);
	});

	const handleOutsideClick = (event) => {
		if (!navMenu || !navToggle || !navMenu.classList.contains('is-open')) {
			return;
		}

		if (event.target instanceof Element && navRoot && !event.target.closest('.nav-inner')) {
			closeMobileMenu();
		}
	};

	attachManagedListener(document, 'click', '_handleOutsideClick', handleOutsideClick);

	const handleResize = () => {
		if (window.innerWidth >= 768) {
			closeMobileMenu();
		}
	};

	attachManagedListener(window, 'resize', '_handleResize', handleResize);

	const scrollTracker = () => {
		updateStickyNav();
		updateActiveNavLink();
	};

	if (window._scrollTracker) {
		window.removeEventListener('scroll', window._scrollTracker);
	}

	window._scrollTracker = scrollTracker;
	window.addEventListener('scroll', scrollTracker, { passive: true });

	initializeReveal();
	initializeFaq();
	scrollTracker();

	if (yearNode) {
		yearNode.textContent = String(new Date().getFullYear());
	}
})();
