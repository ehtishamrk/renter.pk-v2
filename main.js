/**
 * RENTER.PK — MAIN JAVASCRIPT
 * Version: 2.0 | April 2026
 * Modular, performant, accessible
 */

'use strict';

/* ================================================
   UTILITY HELPERS
================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

/* ================================================
   PRELOADER
================================================ */
(function initPreloader() {
  const preloader = $('.preloader');
  const counter  = $('.preloader-counter');
  if (!preloader || !counter) return;

  let count = 0;
  let windowLoaded = false;

  on(window, 'load', () => { windowLoaded = true; });

  const tick = setInterval(() => {
    if (count < 99) {
      count++;
      counter.textContent = count;
    } else if (count === 99 && windowLoaded) {
      count++;
      counter.textContent = 100;
      clearInterval(tick);
      setTimeout(() => {
        preloader.classList.add('complete');
        setTimeout(() => preloader.style.display = 'none', 1300);
      }, 180);
    }
  }, 25);
})();

/* ================================================
   SCROLL PROGRESS BAR
================================================ */
(function initScrollProgress() {
  const bar = $('.scroll-progress');
  if (!bar) return;
  on(window, 'scroll', () => {
    const el = document.documentElement;
    bar.style.width = (el.scrollTop / (el.scrollHeight - el.clientHeight) * 100) + '%';
  }, { passive: true });
})();

/* ================================================
   NAVBAR SCROLL STATE
================================================ */
(function initNavbar() {
  const nav = $('#navbar');
  if (!nav) return;
  on(window, 'scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
})();

/* ================================================
   MOBILE MENU
================================================ */
const mobileMenu = $('#mobileMenu');

function toggleMobileMenu() {
  const isOpen = mobileMenu.classList.toggle('open');
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

// Close when clicking outside
on(document, 'click', (e) => {
  if (mobileMenu &&
      mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      !e.target.closest('.nav-toggle')) {
    toggleMobileMenu();
  }
});

/* ================================================
   PAGE NAVIGATION (SPA routing)
================================================ */
function showPage(pageId) {
  // Hide all pages
  $$('.page').forEach(p => p.classList.remove('active'));

  // Show target
  const target = $(`#page-${pageId}`);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Close mobile menu
  if (mobileMenu?.classList.contains('open')) toggleMobileMenu();

  // Update nav active links
  $$('.nav-links a, .mobile-menu-links a').forEach(a => a.classList.remove('active'));
  $$(`[onclick="showPage('${pageId}')"]`).forEach(el => {
    if (el.tagName === 'A') el.classList.add('active');
  });

  // Re-run animations for new page content
  initRevealAnimations();
}

/* ================================================
   MODALS
================================================ */
function openModal(type) {
  $(`#${type}Modal`)?.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal(type) {
  $(`#${type}Modal`)?.classList.remove('show');
  document.body.style.overflow = '';
}

function switchModal(from, to) {
  closeModal(from);
  setTimeout(() => openModal(to), 320);
}

// Close on backdrop click
$$('.modal-overlay').forEach(overlay => {
  on(overlay, 'click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('show');
      document.body.style.overflow = '';
    }
  });
});

// Keyboard: ESC and tab trap
on(document, 'keydown', (e) => {
  if (e.key === 'Escape') {
    $$('.modal-overlay.show').forEach(m => m.classList.remove('show'));
    if (mobileMenu?.classList.contains('open')) toggleMobileMenu();
    document.body.style.overflow = '';
  }

  if (e.key === 'Tab') {
    const activeModal = $('.modal-overlay.show .modal');
    if (!activeModal) return;
    const focusable = $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', activeModal);
    if (!focusable.length) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
  }
});

/* ================================================
   FORM HANDLERS
================================================ */
function handleLogin(e) {
  e.preventDefault();
  submitForm(e.target, 'Logging in...', 'Success!', () => closeModal('login'));
}

function handleSignup(e) {
  e.preventDefault();
  submitForm(e.target, 'Signing up...', 'Account Created!', () => closeModal('signup'));
}

function handleContact(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.form-btn');
  const origText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
  btn.style.background = '#22c55e';
  setTimeout(() => {
    btn.innerHTML = origText;
    btn.style.background = '';
    e.target.reset();
  }, 2500);
}

function submitForm(form, loadingText, successText, callback) {
  const btn = form.querySelector('.form-btn');
  const span = btn.querySelector('span');
  const orig = span ? span.textContent : btn.textContent;

  btn.disabled = true;
  if (span) span.textContent = loadingText; else btn.textContent = loadingText;
  btn.style.opacity = '0.75';

  setTimeout(() => {
    if (span) span.textContent = successText; else btn.textContent = successText;
    btn.style.background = '#22c55e';
    btn.style.opacity = '1';
    setTimeout(() => {
      btn.disabled = false;
      if (span) span.textContent = orig; else btn.textContent = orig;
      btn.style.background = '';
      if (callback) callback();
    }, 900);
  }, 1400);
}

/* ================================================
   LISTING FILTERS (generic)
================================================ */
function createFilter(gridId, tabSelector) {
  return function filter(type, btn) {
    $$(tabSelector).forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    $$(`#${gridId} .listing-card`).forEach(card => {
      if (card._hideTimeout) clearTimeout(card._hideTimeout);

      const match = type === 'all' || card.dataset.category === type || card.dataset.type === type;
      if (match) {
        card.style.display = 'block';
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
        });
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(18px) scale(0.96)';
        card._hideTimeout = setTimeout(() => { card.style.display = 'none'; }, 300);
      }
    });
  };
}

const filterListings = createFilter('featuredListings', '.featured-tab');
const filterVehicles = createFilter('vehiclesGrid', '#page-vehicles .toggle-tab');
const filterTools    = createFilter('toolsGrid', '#page-tools .toggle-tab');
const filterClothes  = createFilter('clothesGrid', '#page-clothes .toggle-tab');

/* ================================================
   CATEGORY SCROLL
================================================ */
function scrollCategories(dir) {
  const track = $('#categoriesTrack');
  if (!track) return;
  track.scrollBy({ left: 370 * dir, behavior: 'smooth' });
}

/* ================================================
   FAQ ACCORDION
================================================ */
function toggleFaq(btn) {
  const item = btn.parentElement;
  const wasOpen = item.classList.contains('open');
  $$('.faq-item').forEach(f => f.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}

/* ================================================
   SCROLL REVEAL ANIMATIONS
================================================ */
let revealObserver = null;

function initRevealAnimations() {
  if (revealObserver) revealObserver.disconnect();

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  $$('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-item')
    .forEach(el => revealObserver.observe(el));
}

/* ================================================
   HOW IT WORKS — TIMELINE LINE ANIMATION
================================================ */
function initHiwLine() {
  const line = $('.hiw-line');
  if (!line) return;
  new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) line.classList.add('animated'); });
  }, { threshold: 0.5 }).observe(line);
}

/* ================================================
   COUNTER ANIMATION
================================================ */
function animateCounter(el, target, suffix = '') {
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;
  const run = () => {
    current += increment;
    if (current >= target) {
      el.textContent = target.toLocaleString() + suffix;
    } else {
      el.textContent = Math.floor(current).toLocaleString() + suffix;
      requestAnimationFrame(run);
    }
  };
  run();
}

function initCounters() {
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const text = el.textContent;
      if (text.includes('K')) animateCounter(el, parseInt(text), 'K+');
      else if (text.includes('B')) animateCounter(el, parseInt(text), 'B+');
      statObserver.unobserve(el);
    });
  }, { threshold: 0.6 });

  $$('.hero-float-stat h4, .pm-stat-value').forEach(el => statObserver.observe(el));
}

/* ================================================
   FAVORITE / WISHLIST TOGGLE
================================================ */
function initFavorites() {
  on(document, 'click', (e) => {
    const btn = e.target.closest('.listing-favorite');
    if (!btn) return;
    e.stopPropagation();
    btn.classList.toggle('active');
    const icon = btn.querySelector('i');
    if (icon) {
      icon.classList.toggle('far', !btn.classList.contains('active'));
      icon.classList.toggle('fas',  btn.classList.contains('active'));
    }
  });
}

/* ================================================
   MAGNETIC BUTTON EFFECT
================================================ */
function initMagneticButtons() {
  if (window.innerWidth <= 768) return;
  $$('.btn-magnetic').forEach(btn => {
    on(btn, 'mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.12;
      const y = (e.clientY - r.top - r.height / 2) * 0.12;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    on(btn, 'mouseleave', () => { btn.style.transform = ''; });
  });
}

/* ================================================
   HERO CARD 3D TILT
================================================ */
function initCardTilt() {
  if (window.innerWidth <= 768) return;
  $$('.hero-card-main').forEach(card => {
    on(card, 'mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top)  / r.height - 0.5) * 16;
      const ry = ((e.clientX - r.left) / r.width  - 0.5) * -16;
      card.style.transform = `translate(-50%,-50%) perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.025)`;
    });
    on(card, 'mouseleave', () => { card.style.transform = 'translate(-50%, -50%)'; });
  });
}

/* ================================================
   PARALLAX — HERO BLOBS
================================================ */
function initParallax() {
  if (window.innerWidth <= 768) return;
  const blobs = $$('.hero-blob');
  on(window, 'scroll', () => {
    const y = window.pageYOffset;
    blobs.forEach((b, i) => {
      b.style.transform = `translateY(${y * (0.18 + i * 0.08)}px)`;
    });
  }, { passive: true });
}

/* ================================================
   COOKIE CONSENT
================================================ */
function initCookieConsent() {
  const banner = $('#cookieConsent');
  if (!banner || localStorage.getItem('cookieConsent')) return;
  setTimeout(() => banner.classList.add('show'), 3200);
}

function acceptCookies() {
  localStorage.setItem('cookieConsent', 'accepted');
  $('#cookieConsent')?.classList.remove('show');
}

function declineCookies() {
  localStorage.setItem('cookieConsent', 'declined');
  $('#cookieConsent')?.classList.remove('show');
}

/* ================================================
   LOADING SPINNER
================================================ */
function showLoading(text = 'Loading...') {
  const s = $('#loadingSpinner');
  if (!s) return;
  s.querySelector('.spinner-text').textContent = text;
  s.classList.add('show');
}

function hideLoading() {
  $('#loadingSpinner')?.classList.remove('show');
}

/* ================================================
   PREVENT DEFAULT ON EMPTY ANCHOR LINKS
================================================ */
function initAnchors() {
  on(document, 'click', (e) => {
    const a = e.target.closest('a[href="#"]');
    if (a && !a.hasAttribute('onclick')) e.preventDefault();
  });
}

/* ================================================
   INIT — ALL SYSTEMS GO
================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initRevealAnimations();
  initHiwLine();
  initCounters();
  initFavorites();
  initMagneticButtons();
  initCardTilt();
  initParallax();
  initCookieConsent();
  initAnchors();

  // Dev console greeting
  console.log('%c RENTER.PK ', 'background:#8B2942;color:white;font-size:18px;padding:10px 20px;border-radius:6px;font-weight:bold');
  console.log('%c Pakistan\'s Premier Rental Marketplace ', 'color:#C9A76C;font-size:13px;padding:4px;');
});

on(window, 'load', () => {
  // Ensure all animations re-trigger after full load
  initRevealAnimations();
});
