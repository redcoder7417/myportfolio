(() => {
  // 1. Lenis Buttery-Smooth Inertia Scroll (Desktop)
  let lenis = null;
  const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || window.innerWidth < 860;
  if (typeof Lenis !== 'undefined' && !isTouch) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
    });
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href');
        if (id && id !== '#') {
          const target = document.querySelector(id);
          if (target) {
            e.preventDefault();
            lenis.scrollTo(target, { offset: -64, duration: 1.2 });
          }
        }
      });
    });
  }

  // 2. Levo-Style Scroll-Linked Word Crawl, Pinbar & SVG Stroke Drawing
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pinSections = Array.from(document.querySelectorAll('.levo-pin[data-pin="true"]'));

  // Split .crawl text nodes into word spans while preserving <b> tags
  function splitWords(el) {
    const walk = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const parts = node.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
          } else {
            const span = document.createElement('span');
            span.className = 'w';
            span.textContent = part;
            frag.appendChild(span);
          }
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(walk);
      }
    };
    walk(el);
    return Array.from(el.querySelectorAll('.w'));
  }

  const pinData = pinSections.map((sec) => {
    const crawlEl = sec.querySelector('.crawl');
    const words = crawlEl ? splitWords(crawlEl) : [];
    const rangeAttr = crawlEl?.dataset.range ? crawlEl.dataset.range.split(',').map(Number) : [0.06, 0.85];
    const pinBar = sec.querySelector('.levo-pinbar__fill');
    const drawEls = Array.from(sec.querySelectorAll('.draw')).map((el) => {
      const len = typeof el.getTotalLength === 'function' ? el.getTotalLength() : 400;
      if (!reducedMotion && window.innerWidth >= 768) {
        el.style.strokeDasharray = `${len}`;
        el.style.strokeDashoffset = `${len}`;
      }
      return { el, len };
    });

    return { sec, words, range: rangeAttr, pinBar, drawEls, currentP: 0 };
  });

  function updatePinnedSections() {
    const vh = window.innerHeight;
    const isDesktop = window.innerWidth >= 768 && !reducedMotion;

    pinData.forEach((item) => {
      const rect = item.sec.getBoundingClientRect();
      const scrollable = Math.max(1, item.sec.offsetHeight - vh);
      const rawProgress = isDesktop
        ? Math.max(0, Math.min(1, -rect.top / scrollable))
        : rect.top < vh * 0.85 ? 1 : 0;

      // Use raw progress directly (no lerp) — matches levo-studio behavior
      const p = rawProgress;
      item.currentP = p;

      if (item.pinBar) {
        item.pinBar.style.width = `${(p * 100).toFixed(2)}%`;
      }

      if (item.words.length) {
        const [start, end] = item.range;
        const span = Math.max(0.05, end - start);
        const total = item.words.length;
        item.words.forEach((w, idx) => {
          const threshold = start + (idx / total) * span;
          const local = Math.max(0, Math.min(1, (p - threshold) / 0.08));
          w.style.opacity = isDesktop ? (0.15 + 0.85 * local).toFixed(2) : '1';
        });
      }

      item.drawEls.forEach(({ el, len }, idx) => {
        if (!isDesktop) {
          el.style.strokeDashoffset = '0';
          return;
        }
        const delay = idx * 0.04;
        const drawP = Math.max(0, Math.min(1, (p - delay) / 0.55));
        el.style.strokeDashoffset = `${(len * (1 - drawP)).toFixed(1)}`;
      });
    });

    requestAnimationFrame(updatePinnedSections);
  }
  requestAnimationFrame(updatePinnedSections);

  // 3. Mobile Menu Toggle
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileIcon = document.getElementById('mobile-menu-icon');

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.toggle('hidden');
      if (mobileIcon) {
        mobileIcon.className = isHidden ? 'fa-solid fa-bars text-base' : 'fa-solid fa-xmark text-base';
      }
    });

    document.querySelectorAll('.mobile-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        if (mobileIcon) mobileIcon.className = 'fa-solid fa-bars text-base';
      });
    });
  }

  // 4. Project Category Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active', 'bg-[#ffb100]', 'text-[#070708]', 'font-medium');
        b.classList.add('border', 'border-white/[0.14]', 'text-[#8a8a86]');
      });
      btn.classList.add('active', 'bg-[#ffb100]', 'text-[#070708]', 'font-medium');
      btn.classList.remove('border', 'border-white/[0.14]', 'text-[#8a8a86]');

      const filter = btn.dataset.filter;
      projectCards.forEach((card) => {
        const categories = (card.dataset.category || '').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('hidden');
          card.classList.add('flex');
        } else {
          card.classList.add('hidden');
          card.classList.remove('flex');
        }
      });
    });
  });

  // 5. Project Card Impact / Code Tab Switcher
  document.querySelectorAll('.project-card').forEach((card) => {
    const tabBtns = card.querySelectorAll('.tab-btn');
    const panels = card.querySelectorAll('.tab-panel');

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        tabBtns.forEach((b) => {
          b.classList.remove('active', 'bg-[#ffb100]', 'text-[#070708]', 'font-medium');
          b.classList.add('text-[#8a8a86]');
        });
        btn.classList.add('active', 'bg-[#ffb100]', 'text-[#070708]', 'font-medium');
        btn.classList.remove('text-[#8a8a86]');

        panels.forEach((p) => {
          if (p.dataset.panel === target) {
            p.classList.remove('hidden');
          } else {
            p.classList.add('hidden');
          }
        });
      });
    });
  });

  // 6. Scroll Reveal & Skill Bar Animation
  const revealEls = document.querySelectorAll('.reveal');
  const skillFills = document.querySelectorAll('.skill-fill');
  let skillsAnimated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          if (!skillsAnimated && entry.target.querySelector('.skill-fill')) {
            skillFills.forEach((bar) => {
              bar.style.width = bar.dataset.pct || '0%';
            });
            skillsAnimated = true;
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  revealEls.forEach((el) => observer.observe(el));

  // 7. Copy Email + Toast
  const copyToast = document.getElementById('copy-toast');
  const copyBtn = document.getElementById('copy-email-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('harsh77rajvanshi@gmail.com').then(() => {
        if (copyToast) {
          copyToast.classList.remove('translate-y-24', 'opacity-0');
          setTimeout(() => copyToast.classList.add('translate-y-24', 'opacity-0'), 2400);
        }
        copyBtn.textContent = 'Copied';
        setTimeout(() => (copyBtn.textContent = 'Copy'), 2400);
      });
    });
  }

  // 8. Web3Forms Contact Form Submission
  const contactForm = document.getElementById('contact-form');
  const successOverlay = document.getElementById('form-success-overlay');
  const successResetBtn = document.getElementById('success-reset-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      try {
        const res = await fetch(contactForm.action, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(contactForm),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          successOverlay.classList.remove('hidden');
          successOverlay.classList.add('flex');
          contactForm.reset();
        } else {
          alert(data.message || 'Failed to send message. Please try again.');
        }
      } catch {
        alert('Network error while sending message. Please try again.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  if (successResetBtn && successOverlay) {
    successResetBtn.addEventListener('click', () => {
      successOverlay.classList.add('hidden');
      successOverlay.classList.remove('flex');
    });
  }
})();
