/*
================================================================
  HARSH RAJVANSHI PORTFOLIO - ULTRA-INTERACTIVE ENGINE (v2.0)
  Inspired by Moodfunk Records (Awwwards / FWA Standard)
  Features: Lenis Smooth Inertia, Three.js 3D Zero-G WebGL Core, 
  GSAP ScrollTrigger Pinned Showcase, Web Audio API Synthesizer,
  Debounced Magnetic Cursor, 3D Specular Glare & Number Counters.
================================================================
*/

(() => {
  // ============================================================
  // 1. SENSORY AUDIO SYSTEM (Web Audio API Synthesizer)
  // ============================================================
  const AudioFX = {
    ctx: null,
    enabled: false,
    lastTickTime: 0,

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
    },

    toggle() {
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.enabled = !this.enabled;
      return this.enabled;
    },

    playTick() {
      if (!this.enabled || !this.ctx) return;
      const now = performance.now();
      if (now - this.lastTickTime < 45) return; // Debounce to prevent audio buzzing
      this.lastTickTime = now;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(850, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.02);
        gain.gain.setValueAtTime(0.035, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.025);
      } catch (e) {}
    },

    playClick() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(340, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.035);
        gain.gain.setValueAtTime(0.065, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.035);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
      } catch (e) {}
    },

    playChirp() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1150, this.ctx.currentTime);
        osc.frequency.setValueAtTime(1850, this.ctx.currentTime + 0.025);
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.055);
      } catch (e) {}
    },

    playWhoosh() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(460, this.ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.09);
      } catch (e) {}
    }
  };

  // Sound Toggle Button Handler
  function initSoundToggle() {
    const soundToggleBtn = document.getElementById('sound-toggle');
    const soundLabel = document.getElementById('sound-label');

    if (soundToggleBtn && soundLabel) {
      soundToggleBtn.addEventListener('click', () => {
        const active = AudioFX.toggle();
        if (active) {
          soundToggleBtn.classList.add('sound-active');
          soundLabel.textContent = 'FX ON';
          AudioFX.playChirp();
        } else {
          soundToggleBtn.classList.remove('sound-active');
          soundLabel.textContent = 'FX OFF';
        }
      });
    }
  }

  // ============================================================
  // 2. LIVE HUD TERMINAL CLOCK
  // ============================================================
  function initHudClock() {
    const hudClock = document.getElementById('hud-clock');
    if (!hudClock) return;

    function update() {
      const now = new Date();
      const options = { timeZone: 'Asia/Kolkata', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
      const timeStr = now.toLocaleTimeString('en-GB', options);
      hudClock.textContent = `IST ${timeStr}`;
    }
    update();
    setInterval(update, 1000);
  }

  // ============================================================
  // 3. LENIS SMOOTH INERTIA SCROLL & VELOCITY SKEWING
  // ============================================================
  let lenisInstance = null;
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth < 800);

  function initLenis() {
    if (typeof Lenis !== 'undefined' && !isTouchDevice && !lenisInstance) {
      lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.5,
      });

      lenisInstance.on('scroll', (e) => {
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.update();
        }
        handleVelocitySkew(e.velocity);
      });

      function lenisRaf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(lenisRaf);
      }
      requestAnimationFrame(lenisRaf);

      // Connect with GSAP ScrollTrigger
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        gsap.ticker.add((time) => {
          lenisInstance.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      }
    }

    // Intercept all internal anchor navigation for smooth Lenis scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            AudioFX.playClick();
            if (lenisInstance) {
              lenisInstance.scrollTo(targetEl, { offset: -70, duration: 1.2 });
            } else {
              targetEl.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }
      });
    });
  }

  // Velocity text skew effect
  const skewTargets = document.querySelectorAll('.skew-target');
  let skewTimeout = null;

  function handleVelocitySkew(velocity) {
    if (!skewTargets.length) return;
    const clampedVelocity = Math.max(-3, Math.min(3, velocity * 0.035));
    
    skewTargets.forEach(target => {
      target.style.transform = `skewY(${clampedVelocity}deg)`;
    });

    clearTimeout(skewTimeout);
    skewTimeout = setTimeout(() => {
      skewTargets.forEach(target => {
        target.style.transform = 'skewY(0deg)';
      });
    }, 120);
  }

  // ============================================================
  // 4. THREE.JS 3D WEBGL INTERACTIVE AI CORE (Physics, Inertia & Zero-G)
  // ============================================================
  let threeHeroInitialized = false;

  function initThreeHero() {
    if (threeHeroInitialized) return;
    const container = document.getElementById('hero-3d-wrapper');
    const canvas = document.getElementById('hero-webgl-canvas');
    if (!container || !canvas || typeof THREE === 'undefined') return;

    threeHeroInitialized = true;
    const width = container.clientWidth || 480;
    const height = container.clientHeight || 480;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7.2;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Master Rotation Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Outer Tech Wireframe Icosahedron
    const outerGeo = new THREE.IcosahedronGeometry(2.05, 1);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    coreGroup.add(outerMesh);

    // 2. Inner Glowing Core Polyhedron
    const innerGeo = new THREE.DodecahedronGeometry(1.26, 0);
    const innerMat = new THREE.MeshPhongMaterial({
      color: 0x0f172a,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.65,
      specular: 0x06b6d4,
      shininess: 90,
      flatShading: true,
      transparent: true,
      opacity: 0.92,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // 3. Orbiting Planetary Tech Rings
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x00f5ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45
    });
    const ringGeo1 = new THREE.RingGeometry(2.6, 2.64, 64);
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    const ringGeo2 = new THREE.RingGeometry(2.95, 2.99, 64);
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    coreGroup.add(ring2);

    const ringMat3 = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35
    });
    const ringGeo3 = new THREE.RingGeometry(3.3, 3.33, 64);
    const ring3 = new THREE.Mesh(ringGeo3, ringMat3);
    ring3.rotation.z = Math.PI / 5;
    ring3.rotation.y = -Math.PI / 3;
    coreGroup.add(ring3);

    // 4. Ambient Particle Nebula
    const particleCount = 700;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 14;
      posArray[i + 1] = (Math.random() - 0.5) * 14;
      posArray[i + 2] = (Math.random() - 0.5) * 14;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.032,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const lightCyan = new THREE.PointLight(0x06b6d4, 2.5, 20);
    lightCyan.position.set(4, 3, 4);
    scene.add(lightCyan);

    const lightViolet = new THREE.PointLight(0xa855f7, 2.2, 20);
    lightViolet.position.set(-4, -3, 2);
    scene.add(lightViolet);

    // Physics & Drag Inertia Variables
    let isDragging = false;
    let prevPointer = { x: 0, y: 0 };
    let velocity = { x: 0.0025, y: 0.005 };
    const friction = 0.955;
    let parallaxTarget = { x: 0, y: 0 };
    let parallaxCurrent = { x: 0, y: 0 };

    // Mouse / Touch Drag listeners
    canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevPointer = { x: e.clientX, y: e.clientY };
      AudioFX.playTick();
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const inHero = (e.clientX >= rect.left && e.clientX <= rect.right &&
                      e.clientY >= rect.top && e.clientY <= rect.bottom);

      if (inHero) {
        parallaxTarget.x = ((e.clientX - rect.left) / rect.width - 0.5) * 0.4;
        parallaxTarget.y = ((e.clientY - rect.top) / rect.height - 0.5) * 0.4;
      }

      if (isDragging) {
        const deltaX = e.clientX - prevPointer.x;
        const deltaY = e.clientY - prevPointer.y;

        velocity.y = deltaX * 0.0055;
        velocity.x = deltaY * 0.0055;

        prevPointer = { x: e.clientX, y: e.clientY };
      }
    });

    // Touch support for mobile
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevPointer = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    canvas.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - prevPointer.x;
        const deltaY = e.touches[0].clientY - prevPointer.y;
        velocity.y = deltaX * 0.0055;
        velocity.x = deltaY * 0.0055;
        prevPointer = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    // Resize Handler
    function handleResize() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    }
    window.addEventListener('resize', handleResize);

    // Animation Loop with Zero-G Floating Levitation
    const clock = new THREE.Clock();

    function animateThree() {
      requestAnimationFrame(animateThree);
      const elapsedTime = clock.getElapsedTime();

      // Zero-G Levitation Bobbing
      coreGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;

      // Apply drag inertia + base continuous rotation
      if (!isDragging) {
        velocity.x *= friction;
        velocity.y *= friction;

        // Keep a minimum ambient idle spin
        if (Math.abs(velocity.y) < 0.003) velocity.y = 0.003;
        if (Math.abs(velocity.x) < 0.001) velocity.x = 0.001;
      }

      coreGroup.rotation.y += velocity.y;
      coreGroup.rotation.x += velocity.x;

      // Inner counter-rotation
      innerMesh.rotation.y -= 0.008;
      innerMesh.rotation.z += 0.004;

      // Orbiting rings independent spin
      ring1.rotation.z += 0.006;
      ring2.rotation.z -= 0.008;
      ring3.rotation.x += 0.005;

      // Particle subtle drift
      particles.rotation.y += 0.0008;

      // Smooth parallax damping
      parallaxCurrent.x += (parallaxTarget.x - parallaxCurrent.x) * 0.08;
      parallaxCurrent.y += (parallaxTarget.y - parallaxCurrent.y) * 0.08;

      camera.position.x = parallaxCurrent.x * 2.8;
      camera.position.y = -parallaxCurrent.y * 2.8;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }

    animateThree();
  }

  // ============================================================
  // 5. FLUID MAGNETIC CUSTOM CURSOR & MAGNETIC BUTTON SNAP
  // ============================================================
  function initMagneticCursor() {
    const cursorDot = document.getElementById('custom-cursor');
    const cursorFollower = document.getElementById('custom-cursor-follower');
    const cursorLabel = document.getElementById('cursor-label');

    if (cursorDot && cursorFollower && !isTouchDevice) {
      let mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      let followerPos = { x: mousePos.x, y: mousePos.y };

      window.addEventListener('mousemove', (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;

        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
      });

      // Smooth Lerp loop for follower
      function animateCursor() {
        followerPos.x += (mousePos.x - followerPos.x) * 0.18;
        followerPos.y += (mousePos.y - followerPos.y) * 0.18;

        cursorFollower.style.left = `${followerPos.x}px`;
        cursorFollower.style.top = `${followerPos.y}px`;

        requestAnimationFrame(animateCursor);
      }
      requestAnimationFrame(animateCursor);

      // Hide cursor when leaving window
      document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorFollower.style.opacity = '0';
      });
      document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = '1';
        cursorFollower.style.opacity = '1';
      });

      // Cursor hover states
      const hoverTargets = document.querySelectorAll('a, button, .project-card, .stat-card, .terminal-cmd-trigger');
      hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
          cursorFollower.classList.add('cursor-hover');
          if (target.classList.contains('project-card')) {
            cursorLabel.textContent = 'EXPLORE';
          } else if (target.tagName.toLowerCase() === 'button' || target.classList.contains('btn')) {
            cursorLabel.textContent = 'CLICK';
          } else {
            cursorLabel.textContent = 'VIEW';
          }
          AudioFX.playTick();
        });

        target.addEventListener('mouseleave', () => {
          cursorFollower.classList.remove('cursor-hover');
        });
      });

      // WebGL Canvas cursor drag mode
      const webglCanvas = document.getElementById('hero-webgl-canvas');
      if (webglCanvas) {
        webglCanvas.addEventListener('mouseenter', () => {
          cursorFollower.classList.add('cursor-drag');
          cursorLabel.textContent = 'SPIN';
        });
        webglCanvas.addEventListener('mouseleave', () => {
          cursorFollower.classList.remove('cursor-drag');
        });
      }

      // Magnetic Snap Effect on elements with .magnetic-target
      const magneticElements = document.querySelectorAll('.magnetic-target');
      magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
          const rect = el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const deltaX = (e.clientX - centerX) * 0.32;
          const deltaY = (e.clientY - centerY) * 0.32;
          el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });

        el.addEventListener('mouseleave', () => {
          el.style.transform = 'translate(0px, 0px)';
          el.style.transition = 'transform 0.4s cubic-bezier(0.2, 1, 0.4, 1)';
        });

        el.addEventListener('mouseenter', () => {
          el.style.transition = 'none';
        });
      });
    }
  }

  // ============================================================
  // 6. 3D CARD TILT WITH DYNAMIC SPECULAR GLARE REFLECTION
  // ============================================================
  function initCardTilt() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
      const glare = card.querySelector('.card-glare');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((centerY - y) / centerY) * 6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;

        if (glare) {
          const glareX = (x / rect.width) * 100;
          const glareY = (y / rect.height) * 100;
          glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.22) 0%, transparent 60%)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        card.style.transition = 'transform 0.45s ease';
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
      });
    });
  }

  // ============================================================
  // 7. ULTRA-SMOOTH STICKY HORIZONTAL SHOWCASE
  // ============================================================
  let horizontalScrollInitialized = false;

  function initHorizontalScroll() {
    if (horizontalScrollInitialized) return;
    const track = document.getElementById('featured-track');
    const trackContainer = document.getElementById('horizontal-track-container');
    const showcaseSection = document.getElementById('featured');
    const showcaseFill = document.getElementById('showcase-progress-fill');
    const showcaseCounter = document.getElementById('showcase-counter');
    const prevBtn = document.getElementById('showcase-prev');
    const nextBtn = document.getElementById('showcase-next');

    if (!track || !trackContainer || !showcaseSection) return;

    if (window.innerWidth <= 900) {
      track.style.transform = 'none';
      return;
    }

    horizontalScrollInitialized = true;
    const totalCards = 4;
    let currentProgress = 0;

    function updateTrack(progress) {
      currentProgress = Math.max(0, Math.min(1, progress));
      const maxScroll = Math.max(0, track.scrollWidth - trackContainer.clientWidth);
      const x = -currentProgress * maxScroll;
      track.style.transform = `translate3d(${x}px, 0, 0)`;

      if (showcaseFill) {
        showcaseFill.style.width = `${Math.max(25, currentProgress * 100)}%`;
      }
      if (showcaseCounter) {
        const currentSlide = Math.min(totalCards, Math.floor(currentProgress * (totalCards - 0.05)) + 1);
        showcaseCounter.textContent = `0${currentSlide} / 0${totalCards}`;
      }
    }

    // ScrollTrigger scrub tied to sticky wrapper
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: showcaseSection,
        start: 'top top+=75',
        end: 'bottom bottom',
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          updateTrack(self.progress);
        }
      });
    }

    // Next / Prev button controls for intuitive navigation
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        AudioFX.playClick();
        const nextProg = Math.min(1, currentProgress + 1 / (totalCards - 1));
        const totalDistance = showcaseSection.offsetHeight - window.innerHeight;
        const targetScroll = showcaseSection.offsetTop + nextProg * totalDistance;
        if (lenisInstance) {
          lenisInstance.scrollTo(targetScroll, { duration: 0.9 });
        } else {
          window.scrollTo({ top: targetScroll, behavior: 'smooth' });
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        AudioFX.playClick();
        const prevProg = Math.max(0, currentProgress - 1 / (totalCards - 1));
        const totalDistance = showcaseSection.offsetHeight - window.innerHeight;
        const targetScroll = showcaseSection.offsetTop + prevProg * totalDistance;
        if (lenisInstance) {
          lenisInstance.scrollTo(targetScroll, { duration: 0.9 });
        } else {
          window.scrollTo({ top: targetScroll, behavior: 'smooth' });
        }
      });
    }

    // Drag-to-Scroll on track container
    let isTrackDragging = false;
    let dragStartX = 0;
    let dragScrollStart = 0;

    trackContainer.addEventListener('mousedown', (e) => {
      if (e.target.closest('button, a, pre, code')) return;
      isTrackDragging = true;
      dragStartX = e.clientX;
      dragScrollStart = currentProgress;
      AudioFX.playTick();
    });

    window.addEventListener('mouseup', () => {
      isTrackDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isTrackDragging) return;
      const deltaX = e.clientX - dragStartX;
      const maxScroll = Math.max(1, track.scrollWidth - trackContainer.clientWidth);
      const deltaProgress = -deltaX / maxScroll;
      const newProgress = Math.max(0, Math.min(1, dragScrollStart + deltaProgress));

      const totalDistance = showcaseSection.offsetHeight - window.innerHeight;
      const targetScroll = showcaseSection.offsetTop + newProgress * totalDistance;

      if (lenisInstance) {
        lenisInstance.scrollTo(targetScroll, { immediate: true });
      } else {
        window.scrollTo({ top: targetScroll });
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth <= 900) {
        track.style.transform = 'none';
      } else {
        updateTrack(currentProgress);
      }
    });
  }

  // ============================================================
  // 8. SCOPED PROJECT DETAILS TABBING
  // ============================================================
  function initProjectTabs() {
    const projectTabTriggers = document.querySelectorAll('.project-tab-trigger');

    projectTabTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        AudioFX.playClick();
        const card = trigger.closest('.project-card');
        const triggersInCard = card.querySelectorAll('.project-tab-trigger');
        const contentPanels = card.querySelectorAll('.project-tab-content');
        const targetTab = trigger.dataset.projTab;

        triggersInCard.forEach(t => t.classList.remove('active'));
        trigger.classList.add('active');

        contentPanels.forEach(panel => {
          panel.classList.remove('active');
          if (panel.id.includes(targetTab)) {
            panel.classList.add('active');
          }
        });
      });
    });
  }

  // ============================================================
  // 9. PROJECT FILTER BUTTONS (All / CRM / AI / Web)
  // ============================================================
  function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        AudioFX.playClick();
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterVal = btn.dataset.filter;
        const gridCards = document.querySelectorAll('#projects .project-card');

        gridCards.forEach(card => {
          const category = card.dataset.category || '';
          const categories = category.split(' ');

          if (filterVal === 'all' || categories.includes(filterVal)) {
            card.style.display = 'flex';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.96)';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
              card.style.transition = 'all 0.35s ease';
            }, 40);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ============================================================
  // 10. TYPING SUBTITLE ANIMATION
  // ============================================================
  function initTyping() {
    const typedTextSpan = document.getElementById('typed-text');
    if (!typedTextSpan) return;

    const textArray = [
      "Salesforce & CRM Developer",
      "Agentforce & AI Engineer",
      "Software Engineer",
      "Intelligent Automation"
    ];
    const typingSpeed = 85;
    const erasingSpeed = 45;
    const newTextDelay = 2100;
    let textArrayIndex = 0;
    let charIndex = 0;

    const cursorSpan = document.createElement('span');
    cursorSpan.classList.add('typed-cursor');
    cursorSpan.textContent = '|';
    if (typedTextSpan.parentNode) {
      typedTextSpan.parentNode.appendChild(cursorSpan);
    }

    function type() {
      if (charIndex < textArray[textArrayIndex].length) {
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingSpeed);
      } else {
        setTimeout(erase, newTextDelay);
      }
    }

    function erase() {
      if (charIndex > 0) {
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingSpeed);
      } else {
        textArrayIndex = (textArrayIndex + 1) % textArray.length;
        setTimeout(type, typingSpeed + 400);
      }
    }

    setTimeout(type, 700);
  }

  // ============================================================
  // 11. INTERACTIVE DEVELOPER TERMINAL MOCKUP
  // ============================================================
  function initTerminal() {
    const terminalTabs = document.querySelectorAll('.terminal-tab-btn');
    const terminalProfile = document.getElementById('terminal-tab-profile');
    const terminalBash = document.getElementById('terminal-tab-bash');
    const bashTriggers = document.querySelectorAll('.terminal-cmd-trigger');
    const typedCmdSpan = document.getElementById('bash-typed-cmd');
    const prefixContainer = document.getElementById('bash-prompt-prefix');
    const bashOutput = document.getElementById('terminal-bash-output');

    terminalTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        AudioFX.playClick();
        terminalTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const activeTab = tab.dataset.tab;
        if (activeTab === 'profile') {
          terminalProfile.style.display = 'block';
          terminalBash.style.display = 'none';
        } else {
          terminalProfile.style.display = 'none';
          terminalBash.style.display = 'block';
        }
      });
    });

    const outputs = {
      'cat info.txt': `File: info.txt
-----------------------------
Current Location: Noida, Uttar Pradesh, India
Current Role: Software Engineer Intern @ Cloud Science Labs
Focus Areas: Salesforce (Apex, LWC, Flows), Agentforce, Bitrix24 CRM, Document AI
Interests: Agentic AI, CRM Architecture, Enterprise Automation, Full-Stack Engineering
Status: Open for Software Engineering & CRM Developer roles.`,
      'npm run dev': `> crm-solutions@1.0.0 dev
> vite --host --port 3000

  VITE v5.2.0  ready in 218 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help`,
      'python app.py': `[INFO] Connecting to Salesforce & Bitrix24 endpoints...
[INFO] Agentforce / Google Gemini services initialized.
[INFO] Document AI & Named Credentials connected.
[INFO] Running integration server at http://127.0.0.1:5000 (Press CTRL+C to quit)`
    };

    bashTriggers.forEach(btn => {
      btn.addEventListener('click', () => {
        AudioFX.playClick();
        const command = btn.dataset.cmd;
        executeCommand(command);
      });
    });

    function executeCommand(cmd) {
      bashTriggers.forEach(b => b.disabled = true);
      prefixContainer.style.display = 'block';
      typedCmdSpan.textContent = '';
      bashOutput.textContent = 'Executing...';
      
      let index = 0;
      function simulateType() {
        if (index < cmd.length) {
          typedCmdSpan.textContent += cmd.charAt(index);
          index++;
          AudioFX.playTick();
          setTimeout(simulateType, 35);
        } else {
          setTimeout(() => {
            if (cmd === 'clear') {
              bashOutput.textContent = '';
              prefixContainer.style.display = 'none';
            } else if (outputs[cmd]) {
              bashOutput.textContent = outputs[cmd];
              AudioFX.playChirp();
            } else {
              bashOutput.textContent = `bash: command not found: ${cmd}`;
            }
            bashTriggers.forEach(b => b.disabled = false);
          }, 200);
        }
      }
      simulateType();
    }
  }

  // ============================================================
  // 12. SCROLL TRIGGER ANIMATIONS & ANIMATED NUMERIC COUNTERS
  // ============================================================
  function initScrollTriggers() {
    const animElements = document.querySelectorAll('.scroll-animate');
    const skillsSection = document.getElementById('skills');
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    let skillsAnimated = false;

    // Animated number counter for stats
    function animateCounters() {
      const counters = document.querySelectorAll('.stat-number[data-counter]');
      counters.forEach(counter => {
        const target = parseInt(counter.dataset.counter, 10);
        if (isNaN(target)) return;
        let count = 0;
        const duration = 1200;
        const stepTime = Math.max(20, Math.floor(duration / target));

        const timer = setInterval(() => {
          count++;
          counter.textContent = `${count}+`;
          if (count >= target) {
            counter.textContent = `${target}+`;
            clearInterval(timer);
          }
        }, stepTime);
      });
    }

    const observerOptions = {
      root: null,
      threshold: 0.12,
      rootMargin: '0px'
    };

    let countersTriggered = false;

    const pageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');

          // Trigger number counters on About section
          if (entry.target.id === 'about' && !countersTriggered) {
            animateCounters();
            countersTriggered = true;
          }
          
          // Trigger skill bars
          if (entry.target === skillsSection && !skillsAnimated) {
            skillBars.forEach(bar => {
              const percentage = bar.dataset.percentage;
              bar.style.width = percentage;
            });
            skillsAnimated = true;
          }
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animElements.forEach(el => pageObserver.observe(el));
    if (skillsSection) pageObserver.observe(skillsSection);

    // Active Nav Tracker on Scroll
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');

    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${id}`) {
              item.classList.add('active');
            }
          });
        }
      });
    }, { root: null, threshold: 0.35 });

    sections.forEach(sec => navObserver.observe(sec));

    // Mobile menu toggle
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (mobileNavToggle && navLinks) {
      mobileNavToggle.addEventListener('click', () => {
        AudioFX.playClick();
        mobileNavToggle.classList.toggle('open');
        navLinks.classList.toggle('open');
      });

      navItems.forEach(item => {
        item.addEventListener('click', () => {
          mobileNavToggle.classList.remove('open');
          navLinks.classList.remove('open');
        });
      });
    }

    // Header background blur on scroll
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // ============================================================
  // 13. CLIPBOARD COPY & CONTACT FORM
  // ============================================================
  function initContact() {
    const copyBtn = document.getElementById('copy-email-btn');
    const emailLink = document.getElementById('email-link');
    const copyToast = document.getElementById('copy-toast');

    if (copyBtn && emailLink) {
      copyBtn.addEventListener('click', () => {
        AudioFX.playClick();
        navigator.clipboard.writeText(emailLink.textContent.trim())
          .then(() => {
            copyToast.classList.add('show');
            copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
            AudioFX.playChirp();
            setTimeout(() => {
              copyToast.classList.remove('show');
              copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Copy';
            }, 2400);
          });
      });
    }

    const contactForm = document.getElementById('contact-form');
    const successOverlay = document.getElementById('form-success-overlay');
    const successResetBtn = document.getElementById('success-reset-btn');

    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        AudioFX.playClick();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Dispatched logs...';

        setTimeout(() => {
          successOverlay.style.display = 'flex';
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          AudioFX.playChirp();
        }, 1100);
      });
    }

    if (successResetBtn) {
      successResetBtn.addEventListener('click', () => {
        AudioFX.playClick();
        successOverlay.style.display = 'none';
      });
    }

    // Back to top
    const scrollTopBtn = document.getElementById('scroll-to-top-btn');
    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', () => {
        AudioFX.playWhoosh();
        if (lenisInstance) {
          lenisInstance.scrollTo(0, { duration: 1.5 });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }
  }

  // ============================================================
  // BOOTSTRAPPER (Immediate + Window Load Fallback)
  // ============================================================
  function boot() {
    initSoundToggle();
    initHudClock();
    initTyping();
    initTerminal();
    initFilters();
    initProjectTabs();
    initCardTilt();
    initScrollTriggers();
    initContact();
    initMagneticCursor();

    // Init Three.js & Lenis
    initThreeHero();
    initLenis();
    initHorizontalScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // Ensure Three.js, Lenis and ScrollTrigger refresh after full asset load
  window.addEventListener('load', () => {
    initThreeHero();
    initLenis();
    initHorizontalScroll();
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  });

})();
