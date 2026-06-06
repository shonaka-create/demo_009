// STASH — DON'T STOP DIGGIN'
// stashdig.com

(function () {
  'use strict';

  // ── Hamburger nav toggle ──────────────────────────────
  var burger  = document.getElementById('burger');
  var navMenu = document.getElementById('nav-menu');

  function closeMenu() {
    navMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }

  if (burger && navMenu) {
    burger.addEventListener('click', function () {
      var open = navMenu.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    });

    var closeBtn = document.getElementById('nav-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }

    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  // ── Scroll reveal ─────────────────────────────────────
  var reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // ── Active nav link on scroll ─────────────────────────
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav__menu a[href*="#"]');

  function setActive() {
    var current = '';
    sections.forEach(function (sec) {
      if (window.scrollY >= sec.offsetTop - 90) {
        current = sec.id;
      }
    });
    navLinks.forEach(function (a) {
      var href = a.getAttribute('href');
      a.classList.toggle('active', href.indexOf('#' + current) !== -1 && current !== '');
    });
  }

  window.addEventListener('scroll', setActive, { passive: true });

  // ── Smooth anchor scroll (offset for fixed nav) ───────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var selector = this.getAttribute('href');
      if (selector === '#') return;
      var target = document.querySelector(selector);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  // ── Nav border on scroll ──────────────────────────────
  var nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.style.borderBottomColor = window.scrollY > 40
        ? 'rgba(255,255,255,.12)'
        : 'rgba(255,255,255,.06)';
    }, { passive: true });
  }

})();
