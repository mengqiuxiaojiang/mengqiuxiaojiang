(function () {
  const topbar = document.querySelector('.topbar');
  const navToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const revealItems = document.querySelectorAll('.reveal');
  const counters = document.querySelectorAll('[data-counter]');
  const parallaxItems = document.querySelectorAll('.float-parallax');

  function onScroll() {
    if (topbar) {
      topbar.classList.toggle('scrolled', window.scrollY > 12);
    }

    const y = window.scrollY;
    parallaxItems.forEach((item, index) => {
      const speed = Number(item.dataset.speed || (0.06 + index * 0.02));
      item.style.transform = 'translateY(' + y * speed + 'px)';
    });
  }

  function initReveal() {
    if (!('IntersectionObserver' in window)) {
      revealItems.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    revealItems.forEach((el, i) => {
      el.style.transitionDelay = (i % 6) * 80 + 'ms';
      io.observe(el);
    });
  }

  function animateCounter(el) {
    const target = Number(el.dataset.counter || 0);
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      const suffix = el.dataset.suffix || '';
      el.textContent = value.toLocaleString('en-US') + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  function initCounters() {
    if (!counters.length) {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCounter);
      return;
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach((item) => io.observe(item));
  }

  function initNav() {
    if (!navToggle || !navLinks) {
      return;
    }

    navToggle.addEventListener('click', function () {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function initContactForm() {
    const form = document.querySelector('[data-contact-form]');
    if (!form) {
      return;
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const status = form.querySelector('[data-form-status]');
      if (status) {
        status.textContent = 'Thanks. Your message has been queued for manual follow-up via support@mengqiuxiaojiang.com.';
      }
      form.reset();
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  initReveal();
  initCounters();
  initNav();
  initContactForm();
})();
