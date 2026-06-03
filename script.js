/*
================================================================
  HARSH RAJVANSHI PORTFOLIO INTERACTION LOGIC
================================================================
*/

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. Navigation & Mobile Menu Scroll Handler
  // ============================================================
  const header = document.getElementById('header');
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const navItems = document.querySelectorAll('.nav-item');

  // Change header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  mobileNavToggle.addEventListener('click', () => {
    mobileNavToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile nav on item click
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      mobileNavToggle.classList.remove('open');
      navLinks.classList.remove('open');
      
      // Update active class immediately
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // ============================================================
  // 2. Typing Subtitle Animation
  // ============================================================
  const typedTextSpan = document.getElementById('typed-text');
  const textArray = ["AI & Real-Time Specialist", "Full-Stack Developer", "RAG Pipeline Architect", "Problem Solver"];
  const typingSpeed = 100;
  const erasingSpeed = 60;
  const newTextDelay = 2000; // Delay between current and next text
  let textArrayIndex = 0;
  let charIndex = 0;

  // Insert blinking cursor helper
  const cursorSpan = document.createElement('span');
  cursorSpan.classList.add('typed-cursor');
  cursorSpan.textContent = '|';
  typedTextSpan.parentNode.appendChild(cursorSpan);

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
      textArrayIndex++;
      if (textArrayIndex >= textArray.length) textArrayIndex = 0;
      setTimeout(type, typingSpeed + 500);
    }
  }

  // Init typing animation
  if (typedTextSpan) {
    setTimeout(type, 1000);
  }

  // ============================================================
  // 3. Interactive Developer Terminal Mockup
  // ============================================================
  const terminalTabs = document.querySelectorAll('.terminal-tab-btn');
  const terminalProfile = document.getElementById('terminal-tab-profile');
  const terminalBash = document.getElementById('terminal-tab-bash');
  const bashTriggers = document.querySelectorAll('.terminal-cmd-trigger');
  const typedCmdSpan = document.getElementById('bash-typed-cmd');
  const prefixContainer = document.getElementById('bash-prompt-prefix');
  const bashOutput = document.getElementById('terminal-bash-output');

  // Tab switcher
  terminalTabs.forEach(tab => {
    tab.addEventListener('click', () => {
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

  // Simulating terminal command inputs
  const outputs = {
    'cat info.txt': `File: info.txt
-----------------------------
Current Location: Ghaziabad, UP, India
Interests: Real-Time Web Systems, Vector DB Optimization, Large Language Model alignment.
Hobbies: Open-source contribution, competitive programming.
Status: Open for Full-Stack / Software Engineering roles.`,
    'npm run dev': `> harsh-portfolio@1.0.0 dev
> vite --host --port 3000

  VITE v5.2.0  ready in 243 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help`,
    'python app.py': `[INFO] Connecting to MongoDB Cluster...
[INFO] Connection established successfully.
[INFO] Initializing Socket.io socket server...
[INFO] Loading OpenAI model pipeline (gpt-4o)...
[INFO] Running Flask development server at http://127.0.0.1:5000 (Press CTRL+C to quit)`
  };

  bashTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const command = btn.dataset.cmd;
      executeCommand(command);
    });
  });

  function executeCommand(cmd) {
    // Disable triggers during typing simulation
    bashTriggers.forEach(b => b.disabled = true);
    
    prefixContainer.style.display = 'block';
    typedCmdSpan.textContent = '';
    bashOutput.textContent = 'Executing...';
    
    let index = 0;
    
    function simulateType() {
      if (index < cmd.length) {
        typedCmdSpan.textContent += cmd.charAt(index);
        index++;
        setTimeout(simulateType, 50);
      } else {
        // Typing finished - display output
        setTimeout(() => {
          if (cmd === 'clear') {
            bashOutput.textContent = '';
            prefixContainer.style.display = 'none';
          } else if (outputs[cmd]) {
            bashOutput.textContent = outputs[cmd];
          } else {
            bashOutput.textContent = `bash: command not found: ${cmd}`;
          }
          // Re-enable trigger buttons
          bashTriggers.forEach(b => b.disabled = false);
        }, 300);
      }
    }
    
    simulateType();
  }

  // ============================================================
  // 4. Project Filters & Active Card States
  // ============================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active states on filters
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.dataset.filter;

      projectCards.forEach(card => {
        const category = card.dataset.category;
        
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'flex';
          // Smooth fade-in
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
            card.style.transition = 'all 0.4s ease';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ============================================================
  // 5. Scoped Project Details Tabbing
  // ============================================================
  const projectTabTriggers = document.querySelectorAll('.project-tab-trigger');

  projectTabTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const card = trigger.closest('.project-card');
      const triggersInCard = card.querySelectorAll('.project-tab-trigger');
      const contentPanels = card.querySelectorAll('.project-tab-content');
      const targetTab = trigger.dataset.projTab;

      // Toggle tab active trigger
      triggersInCard.forEach(t => t.classList.remove('active'));
      trigger.classList.add('active');

      // Toggle text content
      contentPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id.includes(targetTab)) {
          panel.classList.add('active');
        }
      });
    });
  });

  // ============================================================
  // 6. Intersection Observer for Scroll Trigger Animations
  // ============================================================
  const animElements = document.querySelectorAll('.scroll-animate');
  const skillsSection = document.getElementById('skills');
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  let skillsAnimated = false;

  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px'
  };

  const pageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Trigger animations
        entry.target.classList.add('animated');
        
        // Specific skill bars trigger
        if (entry.target === skillsSection && !skillsAnimated) {
          animateSkills();
          skillsAnimated = true;
        }
        
        // Remove item from observer once animated
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Watch scroll animate items
  animElements.forEach(el => pageObserver.observe(el));
  
  // Watch skills section separately
  if (skillsSection) {
    pageObserver.observe(skillsSection);
  }

  // Active Nav Tracker on scroll
  const sections = document.querySelectorAll('section');
  const navObserverOptions = {
    root: null,
    threshold: 0.5
  };

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
  }, navObserverOptions);

  sections.forEach(sec => navObserver.observe(sec));

  function animateSkills() {
    skillBars.forEach(bar => {
      const percentage = bar.dataset.percentage;
      bar.style.width = percentage;
    });
  }

  // ============================================================
  // 7. Dynamic 3D Card Tilt Effect on Projects
  // ============================================================
  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate relative to element
      const y = e.clientY - rect.top;  // y coordinate relative to element

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt degrees (max 6 deg)
      const rotateX = ((centerY - y) / centerY) * 6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      card.style.transition = 'transform 0.4s ease';
    });
    
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });

  // ============================================================
  // 8. Clipboard Copy & Toast Alert
  // ============================================================
  const copyBtn = document.getElementById('copy-email-btn');
  const emailLink = document.getElementById('email-link');
  const copyToast = document.getElementById('copy-toast');

  if (copyBtn && emailLink) {
    copyBtn.addEventListener('click', () => {
      const emailText = emailLink.textContent.trim();
      
      // Copy logic using navigator.clipboard
      navigator.clipboard.writeText(emailText)
        .then(() => {
          // Show toast alert
          copyToast.classList.add('show');
          copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
          
          setTimeout(() => {
            copyToast.classList.remove('show');
            copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Copy';
          }, 2500);
        })
        .catch(err => {
          console.error('Could not copy email context: ', err);
        });
    });
  }

  // ============================================================
  // 9. Contact Form Simulation & Success Overlay
  // ============================================================
  const contactForm = document.getElementById('contact-form');
  const successOverlay = document.getElementById('form-success-overlay');
  const successResetBtn = document.getElementById('success-reset-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Prevent standard page reload
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      // Simulating network request loader
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Dispatched logs...';

      setTimeout(() => {
        // Display overlay with nice fade
        successOverlay.style.display = 'flex';
        
        // Reset form variables
        contactForm.reset();
        
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 1500);
    });
  }

  if (successResetBtn) {
    successResetBtn.addEventListener('click', () => {
      successOverlay.style.display = 'none';
    });
  }

  // ============================================================
  // 10. Footer Back to Top Button
  // ============================================================
  const scrollTopBtn = document.getElementById('scroll-to-top-btn');

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

});
