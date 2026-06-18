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
        ? 'rgba(255,60,0,.32)'
        : 'rgba(255,60,0,.14)';
    }, { passive: true });
  }

  // ── Gallery slider ────────────────────────────────────
  var slider   = document.getElementById('gallery-slider');
  var dotsWrap = document.getElementById('gallery-dots');
  var prevBtn  = document.querySelector('.gallery__btn--prev');
  var nextBtn  = document.querySelector('.gallery__btn--next');

  if (slider && dotsWrap) {
    var slides     = slider.querySelectorAll('.gallery__slide');
    var slideCount = slides.length;
    var dots       = [];
    var current    = 0;

    // Create dots
    for (var i = 0; i < slideCount; i++) {
      (function(idx) {
        var dot = document.createElement('button');
        dot.className = 'gallery__dot' + (idx === 0 ? ' active' : '');
        dot.setAttribute('aria-label', (idx + 1) + ' 枚目');
        dot.addEventListener('click', function() { goTo(idx); });
        dotsWrap.appendChild(dot);
        dots.push(dot);
      })(i);
    }

    function goTo(idx) {
      current = Math.max(0, Math.min(idx, slideCount - 1));
      var slideW = slides[0].offsetWidth + 10; // width + gap
      slider.scrollTo({ left: slideW * current, behavior: 'smooth' });
      dots.forEach(function(d, i) { d.classList.toggle('active', i === current); });
    }

    if (prevBtn) prevBtn.addEventListener('click', function() { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function() { goTo(current + 1); });

    // Update dot on native scroll
    slider.addEventListener('scroll', function() {
      var slideW = slides[0].offsetWidth + 10;
      var idx = Math.round(slider.scrollLeft / slideW);
      if (idx !== current) { current = idx; dots.forEach(function(d, i) { d.classList.toggle('active', i === current); }); }
    }, { passive: true });
  }

  // ── DIG characters — dig-up reveal on scroll ──────────
  var digItems = document.querySelectorAll('[data-dig]');
  if ('IntersectionObserver' in window && digItems.length) {
    var digIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          // small delay so user "sees" the dig happening
          setTimeout(function () {
            e.target.classList.add('dug');
          }, 300);
          digIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    digItems.forEach(function (el) { digIO.observe(el); });
  } else {
    digItems.forEach(function (el) { el.classList.add('dug'); });
  }

})();
