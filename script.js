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

  // ── DIG WALL + STASH PASS ─────────────────────────────
  // Peel / press the wall; finding the 3 hidden "treasures" grants a
  // STASH PASS, persisted in localStorage. WEB → リアル → WEB の入口。
  (function digWall() {
    var TOTAL = 3;
    var KEY = 'stash_found_v1';
    var pass = document.getElementById('stash-pass');
    if (!pass) return;

    var board    = document.getElementById('dw-board');
    var dotsWrap = document.getElementById('stash-pass-dots');
    var countEl  = document.getElementById('stash-pass-count');
    var lockedEl = document.getElementById('stash-pass-locked');
    var unlockEl = document.getElementById('stash-pass-unlocked');
    var panel    = document.getElementById('stash-pass-panel');
    var toggle   = document.getElementById('stash-pass-toggle');
    var closeBtn = document.getElementById('stash-pass-close');

    var found = [];
    try { found = JSON.parse(localStorage.getItem(KEY) || '[]') || []; } catch (e) { found = []; }
    found = found.filter(function (v, i, a) { return a.indexOf(v) === i; });

    function save() { try { localStorage.setItem(KEY, JSON.stringify(found)); } catch (e) {} }

    function renderDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      for (var i = 0; i < TOTAL; i++) {
        var d = document.createElement('i');
        if (i < found.length) d.className = 'on';
        dotsWrap.appendChild(d);
      }
    }

    function renderPass() {
      if (found.length > 0) pass.hidden = false;
      if (countEl) countEl.textContent = String(Math.min(found.length, TOTAL));
      renderDots();
      var complete = found.length >= TOTAL;
      pass.classList.toggle('is-complete', complete);
      if (lockedEl) lockedEl.hidden = complete;
      if (unlockEl) unlockEl.hidden = !complete;
    }

    function openPanel(open) {
      if (!panel || !toggle) return;
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    if (toggle)   toggle.addEventListener('click', function () { openPanel(panel.hidden); });
    if (closeBtn) closeBtn.addEventListener('click', function () { openPanel(false); });

    function registerTreasure(id, el) {
      if (!id || found.indexOf(id) !== -1) return;
      found.push(id); save(); renderPass();
      if (el) {
        el.classList.remove('just-found');
        // reflow to restart the animation
        void el.offsetWidth;
        el.classList.add('just-found');
      }
      if (found.length >= TOTAL) { setTimeout(function () { openPanel(true); }, 480); }
    }

    if (board) {
      var items = board.querySelectorAll('.dw-item');
      items.forEach(function (el) {
        var kind = el.getAttribute('data-dw');
        var id   = el.getAttribute('data-id');
        if (kind === 'treasure' && id && found.indexOf(id) !== -1) el.classList.add('revealed');
        el.addEventListener('click', function () {
          var nowRevealed = el.classList.toggle('revealed');
          if (kind === 'treasure' && nowRevealed) registerTreasure(id, el);
        });
      });
    }

    renderPass();
  })();

})();
