/* ==========================================================================
   FRISINA ASCONE MODICA — interazioni
   Vanilla JS, nessuna dipendenza. Progressive enhancement: senza JS il sito
   resta leggibile e navigabile.
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------- 1. Header */
  var nav = doc.querySelector('.nav');
  var lastState = null;

  function onScroll() {
    var solid = window.scrollY > 24;
    if (solid === lastState) return;
    lastState = solid;
    doc.body.classList.toggle('is-scrolled', solid);
    if (nav) nav.classList.toggle('is-solid', solid);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ------------------------------------------- 2. Barra inaugurazione */
  var launchBar = doc.querySelector('.launch');
  var launchKey = 'fam-launch-dismissed';
  try {
    if (window.localStorage.getItem(launchKey) === '1' && launchBar) {
      launchBar.classList.add('is-hidden');
    }
  } catch (e) { /* storage non disponibile */ }

  var launchClose = doc.querySelector('.launch__close');
  if (launchClose && launchBar) {
    launchClose.addEventListener('click', function () {
      launchBar.classList.add('is-hidden');
      try { window.localStorage.setItem(launchKey, '1'); } catch (e) {}
    });
  }

  /* --------------------------------------------------- 3. Menu mobile */
  var toggle = doc.querySelector('.nav__toggle');
  var menu = doc.querySelector('.menu');

  function setMenu(open) {
    doc.body.classList.toggle('menu-open', open);
    if (toggle) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
    }
    if (open && menu) {
      var first = menu.querySelector('a');
      if (first) first.focus({ preventScroll: true });
    }
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      setMenu(!doc.body.classList.contains('menu-open'));
    });
  }
  if (menu) {
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
  }
  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  /* ------------------------------------------- 4. Rivelazioni in scroll */
  var revealEls = doc.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ------------------------------------------------ 5. Fade immagini */
  doc.querySelectorAll('img[data-fade]').forEach(function (img) {
    function done() { img.classList.add('is-loaded'); }
    if (img.complete && img.naturalWidth) { done(); }
    else {
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    }
  });

  /* ---------------------------------------------------- 6. Filtri */
  var grid = doc.querySelector('[data-filter-grid]');
  if (grid) {
    var items = Array.prototype.slice.call(grid.children).filter(function (el) {
      return el.hasAttribute('data-type');
    });
    var state = { type: 'tutti', status: 'tutti' };
    var countEl = doc.querySelector('[data-filter-count]');
    var emptyEl = doc.querySelector('[data-filter-empty]');

    function apply() {
      var visible = 0;
      items.forEach(function (item) {
        var okType = state.type === 'tutti' || item.getAttribute('data-type') === state.type;
        var okStatus = state.status === 'tutti' || item.getAttribute('data-status') === state.status;
        var show = okType && okStatus;
        item.hidden = !show;
        if (show) visible++;
      });
      if (countEl) countEl.textContent = (visible < 10 ? '0' : '') + visible;
      if (emptyEl) emptyEl.hidden = visible !== 0;
    }

    doc.querySelectorAll('[data-filter]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var group = btn.getAttribute('data-group');
        doc.querySelectorAll('[data-filter][data-group="' + group + '"]').forEach(function (b) {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
        state[group] = btn.getAttribute('data-filter');
        apply();
      });
    });

    apply();
  }

  /* -------------------------------------------------- 7. Countdown */
  doc.querySelectorAll('[data-countdown]').forEach(function (el) {
    var target = new Date(el.getAttribute('data-countdown')).getTime();
    if (isNaN(target)) return;
    var units = {
      days: el.querySelector('[data-unit="days"]'),
      hours: el.querySelector('[data-unit="hours"]'),
      minutes: el.querySelector('[data-unit="minutes"]'),
      seconds: el.querySelector('[data-unit="seconds"]')
    };
    var live = el.querySelector('[data-countdown-live]');

    function pad(n) { return (n < 10 ? '0' : '') + n; }

    function tick() {
      var diff = Math.max(0, target - Date.now());
      var total = Math.floor(diff / 1000);
      var d = Math.floor(total / 86400);
      var h = Math.floor((total % 86400) / 3600);
      var m = Math.floor((total % 3600) / 60);
      var s = total % 60;
      if (units.days) units.days.textContent = pad(d);
      if (units.hours) units.hours.textContent = pad(h);
      if (units.minutes) units.minutes.textContent = pad(m);
      if (units.seconds) units.seconds.textContent = pad(s);
      if (live) {
        live.textContent = d > 0
          ? 'Mancano ' + d + ' giorni all\'inaugurazione'
          : 'Oggi è il giorno dell\'inaugurazione';
      }
      if (diff === 0) clearInterval(timer);
    }

    var timer = setInterval(tick, 1000);
    tick();
  });

  /* ------------------------------------------------- 8. Form contatti */
  var form = doc.querySelector('[data-inquiry]');
  if (form) {
    var status = form.querySelector('[data-form-status]');
    var LABELS = {
      nome: 'Nome e cognome',
      email: 'Email',
      telefono: 'Telefono',
      tipo: 'Tipo di progetto',
      budget: 'Budget indicativo',
      localita: 'Località',
      messaggio: 'Messaggio'
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (typeof form.reportValidity === 'function' && !form.reportValidity()) return;

      var data = new FormData(form);
      var lines = [];
      data.forEach(function (value, key) {
        if (key === 'privacy' || !String(value).trim()) return;
        lines.push((LABELS[key] || key) + ': ' + value);
      });

      var email = form.getAttribute('data-mail') || 'studio@frisinaasconemodica.it';
      var subject = 'Richiesta di consulenza — ' + (data.get('tipo') || 'nuovo progetto');
      var href = 'mailto:' + email +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));

      window.location.href = href;

      if (status) {
        status.textContent = 'Grazie. Stiamo aprendo il tuo programma di posta per completare l\'invio: se non si apre, scrivi a ' + email + '.';
        form.reset();
      }
    });
  }

  /* ------------------------------------------------- 9. Anno footer */
  /* --------------------------- 8b. Precompilazione da query string */
  try {
    var params = new URLSearchParams(window.location.search);
    if (params.get('oggetto') === 'inaugurazione' && form) {
      var tipo = form.querySelector('[name="tipo"]');
      if (tipo) tipo.value = 'inaugurazione';
      var msg = form.querySelector('[name="messaggio"]');
      if (msg && !msg.value) {
        msg.value = 'Confermo la mia presenza all\'inaugurazione della nuova sede.';
      }
    }
  } catch (e) { /* URLSearchParams non disponibile */ }

  doc.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ------------------------------------------- 10. Parallasse leggera */
  var heroImg = doc.querySelector('[data-parallax] img');
  if (heroImg && !reduceMotion) {
    var ticking = false;
    function frame() {
      var y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        heroImg.style.transform = 'translate3d(0,' + (y * 0.09).toFixed(2) + 'px,0) scale(' + (1 + Math.min(y, 600) * 0.00009).toFixed(4) + ')';
      }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(frame);
    }, { passive: true });
  }
})();
