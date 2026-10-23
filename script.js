/**
 * Geetha Typewriting Institute - Core Vanilla JavaScript Engine
 * Fully documented, pure standard ES6 without external runtime frameworks
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Sticky Navigation Scroll Handler
  // ==========================================
  const navbar = document.querySelector('.navbar-custom');
  
  const handleNavbarScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  
  // Listen to window scrolling
  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll(); // Initial invocation on page load

  // ==========================================
  // 2. Active Class on Scroll (Spy Navigation)
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link-custom');

  const spySectionActive = () => {
    const scrollPosition = window.scrollY + 100; // Offset for header

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });

    // Simple fallback for very top of page
    if (window.scrollY < 100) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#hero') {
          link.classList.add('active');
        }
      });
    }
  };

  window.addEventListener('scroll', spySectionActive);

  // ==========================================
  // 3. Dynamic Interactive Course Filtering
  // ==========================================
  const filterButtons = document.querySelectorAll('.course-filter-btn');
  const courseCards = document.querySelectorAll('.course-col');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Toggle button states
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      courseCards.forEach(col => {
        const category = col.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          col.style.display = 'block';
          // Smooth fade-in
          setTimeout(() => {
            col.style.opacity = '1';
            col.style.transform = 'scale(1)';
          }, 10);
        } else {
          col.style.opacity = '0';
          col.style.transform = 'scale(0.95)';
          setTimeout(() => {
            col.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // ==========================================
  // 4. Custom Animate Statistics Counters
  // ==========================================
  const statsSection = document.getElementById('statistics');
  const counterElements = document.querySelectorAll('.counter-num[data-target]');
  let animated = false;

  const startCountersAnimation = () => {
    counterElements.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const suffix = counter.getAttribute('data-suffix') || '';
      let current = 0;
      // Define dynamic increments depending on size
      const increment = target / 60; // Finish in ~60 frames (~1sec)

      const updateCounter = () => {
        current += increment;
        if (current >= target) {
          counter.textContent = target + suffix;
        } else {
          // If decimal target like 98.6
          if (target % 1 === 0) {
            counter.textContent = Math.floor(current) + suffix;
          } else {
            counter.textContent = current.toFixed(1) + suffix;
          }
          requestAnimationFrame(updateCounter);
        }
      };
      
      updateCounter();
    });
  };

  // Trigger counters with classic intersection observer for performance
  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          startCountersAnimation();
          animated = true;
          observer.unobserve(statsSection);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(statsSection);
  } else {
    // Fallback for older browsers
    setTimeout(startCountersAnimation, 1200);
  }

  // ==========================================
  // 5. Custom Collapsible FAQ Accordion Code
  // ==========================================
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const parentItem = header.parentElement;
      const isActive = parentItem.classList.contains('active');
      const body = parentItem.querySelector('.faq-body');

      // Close all other FAQ items for a clean experience
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-body').style.maxHeight = null;
      });

      if (!isActive) {
        parentItem.classList.add('active');
        // Calculate precise height dynamically
        body.style.maxHeight = body.scrollHeight + "px";
      } else {
        parentItem.classList.remove('active');
        body.style.maxHeight = null;
      }
    });
  });

  // Keep first FAQ question open by default on mount
  if (faqHeaders.length > 0) {
    const firstItem = faqHeaders[0].parentElement;
    const firstBody = firstItem.querySelector('.faq-body');
    firstItem.classList.add('active');
    firstBody.style.maxHeight = firstBody.scrollHeight + "px";
  }

  // ==========================================
  // 6. Modern Light / Dark Theme Toggler
  // ==========================================
  const themeTogglerBtn = document.getElementById('theme-toggler-btn');
  const themeTogglerIcon = document.getElementById('theme-toggler-icon');

  if (themeTogglerBtn) {
    // Check local storage for theme selection priority
    const storedTheme = localStorage.getItem('gti-theme');
    
    const applyTheme = (theme) => {
      if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        themeTogglerIcon.classList.remove('fa-moon', 'text-dark');
        themeTogglerIcon.classList.add('fa-sun', 'text-warning');
        // Let's also adjust nav brand dark mode icon colors if any
      } else {
        document.body.classList.remove('dark-theme');
        themeTogglerIcon.classList.remove('fa-sun', 'text-warning');
        themeTogglerIcon.classList.add('fa-moon', 'text-dark');
      }
    };

    if (storedTheme) {
      applyTheme(storedTheme);
    } else {
      // System default preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(systemPrefersDark ? 'dark' : 'light');
    }

    themeTogglerBtn.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark-theme');
      const newTheme = isDark ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('gti-theme', newTheme);
    });
  }

  // ==========================================
  // 7. 3D Scroll Reveal Animation Observer
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal-3d');

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once animated, keep it active to avoid repeated jumps unless requested
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(item => {
      revealObserver.observe(item);
    });
  } else {
    // Fallback: active everything immediately if not supported
    revealElements.forEach(item => item.classList.add('active'));
  }

  // ==========================================
  // 8. Back-To-Top Dynamic Triggers
  // ==========================================
  const backToTopButton = document.getElementById('backToTopBtn');

  const checkBackToTopScroll = () => {
    if (window.scrollY > 400) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', checkBackToTopScroll);

  if (backToTopButton) {
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

});
