document.addEventListener('DOMContentLoaded', () => {
  initBgCanvas();
  initParticles();
  initScrollObserver();
  initSmoothParallax();
  initNavbar();
  initMarqueeSliders();
  initFAQAccordion();
  initCounters();
  initBackToTop();
  initFormHandler();
});

/* ======================================================= */
/*  1. VISIBLE INTERACTIVE CYBER-PURPLE CANVAS BACKGROUND   */
/*  Neon Violet, Electric Cyan, Glowing Particle Web        */
/* ======================================================= */
function initBgCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, maxDist: 140 };

  const colors = [
    'rgba(168, 85, 247, 0.85)', // Neon Purple
    'rgba(192, 132, 252, 0.75)', // Lilac
    'rgba(34, 211, 238, 0.8)',  // Cyan
    'rgba(236, 72, 153, 0.7)'   // Magenta
  ];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  const particleCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 16000), 75);

  class Node {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2.5 + 1.2;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.baseAlpha = Math.random() * 0.5 + 0.3;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse gentle attraction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.maxDist) {
          const force = (mouse.maxDist - dist) / mouse.maxDist;
          this.x += (dx / dist) * force * 1.2;
          this.y += (dy / dist) * force * 1.2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Node());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting laser web
    const maxLinkDist = 130;
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxLinkDist) {
          const alpha = (1 - dist / maxLinkDist) * 0.28;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

/* ======================================================= */
/*  2. HERO AMBIENT FLOATING PARTICLES                     */
/* ======================================================= */
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = 30;
  const colors = ['#C084FC', '#A855F7', '#22D3EE', '#EC4899'];

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    const size = Math.random() * 5 + 3;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDuration = (Math.random() * 6 + 6) + 's';
    p.style.animationDelay = (Math.random() * 4) + 's';
    p.style.opacity = (Math.random() * 0.35 + 0.15).toString();
    container.appendChild(p);
  }
}

/* ======================================================= */
/*  3. HARDWARE-ACCELERATED HERO PARALLAX                  */
/* ======================================================= */
function initSmoothParallax() {
  const parallaxBg = document.querySelector('.hero-parallax-bg');
  if (!parallaxBg) return;

  let latestKnownScrollY = 0;
  let currentY = 0;
  let isTicking = false;

  window.addEventListener('scroll', () => {
    latestKnownScrollY = window.scrollY;
    if (!isTicking) {
      window.requestAnimationFrame(updateParallax);
      isTicking = true;
    }
  }, { passive: true });

  function updateParallax() {
    currentY += (latestKnownScrollY - currentY) * 0.1;
    
    if (latestKnownScrollY < 1200) {
      const offset = currentY * 0.25;
      parallaxBg.style.transform = `translate3d(0, ${offset}px, 0)`;
    }

    if (Math.abs(latestKnownScrollY - currentY) > 0.5) {
      window.requestAnimationFrame(updateParallax);
    } else {
      isTicking = false;
    }
  }
}

/* ======================================================= */
/*  4. SCROLL INTERSECTION OBSERVER ANIMATIONS             */
/* ======================================================= */
function initScrollObserver() {
  const options = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.querySelector('[data-count]')) {
          animateCounters();
        }
      }
    });
  }, options);

  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el);
  });
}

/* ======================================================= */
/*  5. SEAMLESS INFINITE MARQUEE SLIDERS                   */
/*  - Loop infinitely right-to-left in continuous flow     */
/*  - Zero blur, zero circular distortion                  */
/*  - Instant pause on mouse hover / mobile touch          */
/* ======================================================= */
function initMarqueeSliders() {
  const marqueeConfigs = [
    { trackId: 'projectsTrack', duration: 44 },
    { trackId: 'audienceSliderTrack', duration: 32 },
    { trackId: 'toolsWideTrack', duration: 40 },
    { trackId: 'roadmapTrack', duration: 38 }
  ];

  marqueeConfigs.forEach(cfg => {
    const track = document.getElementById(cfg.trackId);
    if (!track) return;
    const wrapper = track.parentElement;
    if (!wrapper) return;

    // Get original cards
    const cards = Array.from(track.children);
    if (!cards.length) return;

    // Avoid double initialization
    if (track.querySelector('.marquee-group')) return;

    // Group 1
    const group1 = document.createElement('div');
    group1.className = 'marquee-group';
    cards.forEach(card => {
      card.style.filter = '';
      card.style.opacity = '';
      card.style.transform = '';
      group1.appendChild(card);
    });

    // Group 2 (identical clone for seamless loop)
    const group2 = group1.cloneNode(true);
    group2.setAttribute('aria-hidden', 'true');

    // Mount group1 + group2 into track
    track.innerHTML = '';
    track.appendChild(group1);
    track.appendChild(group2);

    track.classList.add('marquee-infinite-track');
    wrapper.classList.add('marquee-infinite-wrapper');
    track.style.animationDuration = `${cfg.duration}s`;

    // Mobile touch pause / resume support
    wrapper.addEventListener('touchstart', () => {
      track.style.animationPlayState = 'paused';
    }, { passive: true });

    wrapper.addEventListener('touchend', () => {
      track.style.animationPlayState = 'running';
    }, { passive: true });
  });
}

/* ======================================================= */
/*  6. FAQ ACCORDION                                       */
/* ======================================================= */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close other open items
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('active');
          const btn = other.querySelector('.faq-question');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      item.classList.toggle('active', !isActive);
      questionBtn.setAttribute('aria-expanded', !isActive);
    });
  });
}

/* ======================================================= */
/*  7. ANIMATED NUMBER COUNTERS                            */
/* ======================================================= */
function initCounters() {
  // Counters animate once when scrolled into view
}

function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach((counter) => {
    if (counter.classList.contains('counted')) return;
    
    const target = parseInt(counter.getAttribute('data-count'), 10);
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        counter.textContent = target;
        counter.classList.add('counted');
        clearInterval(timer);
      } else {
        counter.textContent = Math.floor(current);
      }
    }, stepTime);
  });
}

/* ======================================================= */
/*  8. NAVBAR SCROLL EFFECT & MOBILE MENU                  */
/* ======================================================= */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.contains('open');
      if (isOpen) {
        links.classList.remove('open');
        links.style.display = 'none';
      } else {
        links.classList.add('open');
        links.style.display = 'flex';
        links.style.flexDirection = 'column';
        links.style.position = 'absolute';
        links.style.top = '100%';
        links.style.left = '0';
        links.style.width = '100%';
        links.style.background = 'rgba(14, 6, 30, 0.98)';
        links.style.padding = '24px';
        links.style.gap = '18px';
        links.style.borderBottom = '1px solid rgba(168, 85, 247, 0.3)';
      }
    });

    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        if (links.classList.contains('open')) {
          links.classList.remove('open');
          links.style.display = 'none';
        }
      });
    });
  }
}

/* ======================================================= */
/*  9. BACK TO TOP BUTTON                                  */
/* ======================================================= */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ======================================================= */
/*  10. ENQUIRY FORM HANDLER WITH FEEDBACK                 */
/* ======================================================= */
function initFormHandler() {
  const form = document.getElementById('enquiryForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]')?.value.trim();
    const phone = form.querySelector('[name="phone"]')?.value.trim();
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!name || !phone) {
      alert('Please fill in your name and phone number to claim your free demo class.');
      return;
    }

    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting & Booking Demo...';
    submitBtn.disabled = true;

    setTimeout(() => {
      alert(`🎉 Thank you, ${name}! Your free demo class and course brochure request has been received. Our senior career counsellor from Sector 34A, Chandigarh will call you at ${phone} shortly.`);
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 1200);
  });
}



