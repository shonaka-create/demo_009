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
  // Peel the wall; tapping the 3 hidden "treasures" (暗号①②③) assembles a
  // STASH-related secret phrase and grants a STASH PASS. State is NOT
  // persisted — one reload and you have to dig it up all over again.
  (function digWall() {
    var TOTAL = 3;
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
    var secretEl = document.getElementById('stash-pass-secret');
    var codeEl   = document.getElementById('stash-pass-code');
    var copyBtn  = document.getElementById('stash-pass-copy');

    // Canonical order + words come from the board markup (data-id / data-word).
    var ORDER = [];   // ['t1','t2','t3']
    var WORDS = {};   // { t1: "DON'T", ... }

    // In-memory only — resets on reload (no localStorage).
    var found = [];

    function secretPhrase() {
      return ORDER.map(function (id) { return WORDS[id]; }).join(' ');
    }

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
      if (complete && secretEl) secretEl.textContent = secretPhrase();
    }

    function openPanel(open) {
      if (!panel || !toggle) return;
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    if (toggle)   toggle.addEventListener('click', function () { openPanel(panel.hidden); });
    if (closeBtn) closeBtn.addEventListener('click', function () { openPanel(false); });

    // Copy the assembled cipher + pass code to the clipboard.
    function fallbackCopy(text) {
      try {
        var ta = document.createElement('textarea');
        ta.value = text; ta.setAttribute('readonly', '');
        ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); document.body.removeChild(ta);
      } catch (e) {}
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var code = codeEl ? codeEl.textContent.trim() : '';
        var text = 'STASH 発掘暗号\n' + secretPhrase() + '\n' + code;
        var done = function () {
          copyBtn.classList.add('copied');
          copyBtn.textContent = '✓ コピーしました';
          setTimeout(function () {
            copyBtn.classList.remove('copied');
            copyBtn.textContent = '📋 暗号をコピー';
          }, 1800);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
        } else {
          fallbackCopy(text); done();
        }
      });
    }

    function registerTreasure(id, el) {
      if (!id || found.indexOf(id) !== -1) return;
      found.push(id); renderPass();
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
        if (kind === 'treasure' && id) {
          ORDER.push(id);
          WORDS[id] = el.getAttribute('data-word') || id;
        }
        el.addEventListener('click', function () {
          var nowRevealed = el.classList.toggle('revealed');
          if (kind === 'treasure' && nowRevealed) registerTreasure(id, el);
        });
      });
    }

    renderPass();
  })();

  // ── DIG MAP ───────────────────────────────────────────
  // Choose a zone and "dig" it open. Pure UI — independent of STASH PASS.
  (function digMap() {
    var map = document.getElementById('dig-map');
    if (!map) return;

    map.querySelectorAll('.dm-plot').forEach(function (el) {
      el.addEventListener('click', function () {
        var dug = el.classList.toggle('dug');
        if (dug) {
          el.classList.remove('just-dug');
          void el.offsetWidth; // reflow to restart animation
          el.classList.add('just-dug');
        }
      });
    });
  })();

  // ── Sticker → real image (drop-in) ────────────────────
  // For every [data-img], try images/stickers/<name>.png. If it loads,
  // swap the CSS text sticker for the real image; if not, leave the CSS one.
  (function stickerImages() {
    var els = document.querySelectorAll('[data-img]');
    els.forEach(function (el) {
      var name = el.getAttribute('data-img');
      if (!name) return;
      var url = 'images/stickers/' + name + '.png';
      var probe = new Image();
      probe.onload = function () {
        el.style.backgroundImage = 'url("' + url + '")';
        el.classList.add('has-img');
      };
      probe.onerror = function () { /* keep CSS fallback */ };
      probe.src = url;
    });
  })();

})();
