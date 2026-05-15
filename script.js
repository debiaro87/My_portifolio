/* ============================================================
   Debisa Ararsa Portfolio -- script.js  [FIXED]
   Handles: Particles, Typing Effect, Scroll Animations,
            Dark/Light Mode, Custom Cursor, Form, Mobile Menu,
            Counter Animations, Skill Bars, Navbar Scroll
   ============================================================ */

/* ---- UTILITY ---------------------------------------------- */
function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
function qsa(sel, ctx) {
  return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
}

/* ---- CANVAS PARTICLE BACKGROUND --------------------------- */
function initParticles() {
  var canvas = qs('#bg-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W = 0, H = 0;
  var PARTICLE_COUNT = 60;
  var particles = [];

  function isDark() {
    return document.documentElement.getAttribute('data-theme') !== 'light';
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeParticle(initial) {
    return {
      x:     Math.random() * W,
      y:     initial ? Math.random() * H : H + 10,
      vx:    (Math.random() - 0.5) * 0.3,
      vy:    -(Math.random() * 0.4 + 0.1),
      r:     Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
      decay: Math.random() * 0.001 + 0.0005
    };
  }

  function resetParticle(p) {
    p.x     = Math.random() * W;
    p.y     = H + 10;
    p.vx    = (Math.random() - 0.5) * 0.3;
    p.vy    = -(Math.random() * 0.4 + 0.1);
    p.r     = Math.random() * 1.5 + 0.5;
    p.alpha = Math.random() * 0.5 + 0.1;
    p.decay = Math.random() * 0.001 + 0.0005;
  }

  function drawGrid() {
    var color = isDark() ? 'rgba(0,212,255,0.03)' : 'rgba(0,100,180,0.04)';
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.5;
    var gap = 60, x, y;
    for (x = 0; x < W; x += gap) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (y = 0; y < H; y += gap) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  }

  function loop() {
    var i, p, color;
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    color = isDark() ? '0,212,255' : '0,100,180';
    for (i = 0; i < particles.length; i++) {
      p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
      if (p.alpha <= 0 || p.y < -10) resetParticle(p);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + color + ',' + p.alpha + ')';
      ctx.fill();
    }
    requestAnimationFrame(loop);
  }

  resize();
  for (var i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(makeParticle(true));
  }
  window.addEventListener('resize', resize);
  loop();
}

/* ---- CUSTOM CURSOR ---------------------------------------- */
function initCursor() {
  var dot  = qs('#cursorDot');
  var ring = qs('#cursorRing');
  if (!dot || !ring) return;

  var mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', function(e) {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();

  var interactables = 'a, button, input, textarea, .skill-card, .project-card, .cert-card, .blog-card';

  document.addEventListener('mouseover', function(e) {
    if (e.target && typeof e.target.closest === 'function' && e.target.closest(interactables)) {
      dot.style.width  = dot.style.height  = '12px';
      ring.style.width = ring.style.height = '56px';
      ring.style.opacity = '0.7';
    }
  });

  document.addEventListener('mouseout', function(e) {
    if (e.target && typeof e.target.closest === 'function' && e.target.closest(interactables)) {
      dot.style.width  = dot.style.height  = '6px';
      ring.style.width = ring.style.height = '36px';
      ring.style.opacity = '0.5';
    }
  });
}

/* ---- NAVBAR ----------------------------------------------- */
function initNavbar() {
  var nav = qs('#navbar');
  if (!nav) return;

  window.addEventListener('scroll', function() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  var sections = qsa('section[id]');
  var links    = qsa('.nav-link');
  if (!sections.length || !links.length) return;

  var observer = new IntersectionObserver(function(entries) {
    var i, j, k;
    for (i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        for (j = 0; j < links.length; j++) {
          links[j].classList.remove('active');
        }
        for (k = 0; k < links.length; k++) {
          if (links[k].getAttribute('href') === '#' + entries[i].target.id) {
            links[k].classList.add('active');
            break;
          }
        }
      }
    }
  }, { rootMargin: '-40% 0px -55% 0px' });

  for (var s = 0; s < sections.length; s++) {
    observer.observe(sections[s]);
  }
}

/* ---- MOBILE MENU ------------------------------------------ */
function initMobileMenu() {
  var hamburger = qs('#hamburger');
  var menu      = qs('#mobileMenu');
  if (!hamburger || !menu) return;

  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });

  var mobileLinks = qsa('.mobile-link, .mobile-resume');
  for (var i = 0; i < mobileLinks.length; i++) {
    mobileLinks[i].addEventListener('click', function() {
      hamburger.classList.remove('active');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
}

/* ---- DARK / LIGHT THEME ----------------------------------- */
function initTheme() {
  var btn  = qs('#themeToggle');
  var icon = qs('#themeIcon');
  if (!btn) return;

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('da-theme', theme);
    if (icon) {
      icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  var saved = localStorage.getItem('da-theme') || 'dark';
  applyTheme(saved);

  btn.addEventListener('click', function() {
    var current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

/* ---- TYPING EFFECT ---------------------------------------- */
function initTyping() {
  var el = qs('#typed-role');
  if (!el) return;

  var phrases = [
    'Full Stack Developer',
    'Cybersecurity Enthusiast',
    'CS Student @ Jimma University',
    'AI & Security Researcher',
    "Ethiopia's Digital Guardian"
  ];

  var pIdx = 0, cIdx = 0, deleting = false;

  function type() {
    var phrase = phrases[pIdx];
    if (!deleting) {
      cIdx++;
      el.textContent = phrase.slice(0, cIdx);
      if (cIdx === phrase.length) {
        deleting = true;
        setTimeout(type, 2200);
        return;
      }
    } else {
      cIdx--;
      el.textContent = phrase.slice(0, cIdx);
      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
    }
    setTimeout(type, deleting ? 45 : 75);
  }

  setTimeout(type, 900);
}

/* ---- SCROLL REVEAL ---------------------------------------- */
function initReveal() {
  var revealEls = qsa('.reveal');
  if (!revealEls.length) return;

  var observer = new IntersectionObserver(function(entries) {
    var i, siblings, idx;
    for (i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        siblings = qsa('.reveal', entries[i].target.parentElement);
        idx = siblings.indexOf(entries[i].target);
        (function(el, delay) {
          setTimeout(function() { el.classList.add('visible'); }, delay);
        })(entries[i].target, idx * 80);
        observer.unobserve(entries[i].target);
      }
    }
  }, { rootMargin: '0px 0px -80px 0px', threshold: 0.1 });

  for (var i = 0; i < revealEls.length; i++) {
    observer.observe(revealEls[i]);
  }
}

/* ---- SKILL BAR ANIMATION ---------------------------------- */
function initSkillBars() {
  var bars = qsa('.skill-fill');
  if (!bars.length) return;

  var observer = new IntersectionObserver(function(entries) {
    var i, width;
    for (i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        width = entries[i].target.getAttribute('data-width') || '0';
        entries[i].target.style.width = width + '%';
        observer.unobserve(entries[i].target);
      }
    }
  }, { threshold: 0.3 });

  for (var i = 0; i < bars.length; i++) {
    observer.observe(bars[i]);
  }
}

/* ---- COUNTER ANIMATION ------------------------------------ */
function initCounters() {
  var counters = qsa('.stat-num');
  if (!counters.length) return;

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  var observer = new IntersectionObserver(function(entries) {
    var i;
    for (i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        (function(el) {
          var target    = parseInt(el.getAttribute('data-count'), 10);
          var duration  = 1400;
          var startTime = null;
          function update(now) {
            if (!startTime) startTime = now;
            var elapsed  = now - startTime;
            var progress = Math.min(elapsed / duration, 1);
            el.textContent = Math.round(easeOut(progress) * target);
            if (progress < 1) {
              requestAnimationFrame(update);
            } else {
              el.textContent = target;
            }
          }
          requestAnimationFrame(update);
        })(entries[i].target);
        observer.unobserve(entries[i].target);
      }
    }
  }, { threshold: 0.5 });

  for (var i = 0; i < counters.length; i++) {
    observer.observe(counters[i]);
  }
}

/* ---- CONTACT FORM ----------------------------------------- */
function initContactForm() {
  var form    = qs('#contactForm');
  var success = qs('#formSuccess');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var btn      = form.querySelector('button[type="submit"]');
    var original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled  = true;
    setTimeout(function() {
      btn.innerHTML = original;
      btn.disabled  = false;
      form.reset();
      if (success) {
        success.classList.add('show');
        setTimeout(function() { success.classList.remove('show'); }, 5000);
      }
    }, 1500);
  });
}

/* ---- SMOOTH SCROLL ---------------------------------------- */
function initSmoothScroll() {
  var anchors = qsa('a[href^="#"]');
  for (var i = 0; i < anchors.length; i++) {
    anchors[i].addEventListener('click', function(e) {
      var href   = this.getAttribute('href');
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/* ---- KEYBOARD: Escape closes mobile menu ------------------ */
function initKeyboard() {
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      var menu      = qs('#mobileMenu');
      var hamburger = qs('#hamburger');
      if (menu && menu.classList.contains('open')) {
        menu.classList.remove('open');
        if (hamburger) hamburger.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });
}

/* ---- TERMINAL LINE STAGGER on load ------------------------ */
function staggerTerminal() {
  var lines = qsa('.term-line, .term-output');
  for (var i = 0; i < lines.length; i++) {
    lines[i].style.animationDelay = (0.2 + i * 0.15) + 's';
    lines[i].style.animation = 'fadeSlideIn 0.4s ease both';
  }
}

/* ---- CONSOLE EASTER EGG ----------------------------------- */
function consoleEgg() {
  console.log(
    '%c[DEBISA ARARSA PORTFOLIO]\n' +
    '%cHello, curious developer!\n' +
    '%cEmail   : debiaro@gmail.com\n' +
    '%cGitHub  : github.com/debiaro87/curriculum\n' +
    '%cTelegram: @debiaro',
    'color:#00d4ff; font-size:14px; font-weight:bold;',
    'color:#ffffff; font-size:12px;',
    'color:#00d4ff; font-size:11px;',
    'color:#00ff88; font-size:11px;',
    'color:#00d4ff; font-size:11px;'
  );
}

/* ---- BOOT: run everything on DOMContentLoaded ------------- */
document.addEventListener('DOMContentLoaded', function() {
  initParticles();
  initCursor();
  initNavbar();
  initMobileMenu();
  initTheme();
  initTyping();
  initReveal();
  initSkillBars();
  initCounters();
  initContactForm();
  initSmoothScroll();
  initKeyboard();
  staggerTerminal();
  consoleEgg();
});
