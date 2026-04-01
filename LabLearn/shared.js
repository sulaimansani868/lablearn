/*
 * LabLearn — shared.js
 * ════════════════════════════════════════════════════════════════════
 * This single file contains JavaScript that runs on EVERY page:
 *   · Mobile hamburger nav (open / close / keyboard close)
 *   · Coming-soon dialog (used on pages with data-cs links)
 *
 * HOW IT WORKS:
 *   Each function checks whether the element it needs actually exists
 *   before trying to use it (e.g. the coming-soon overlay only exists
 *   on index.html and apps.html). If the element is missing, the
 *   function does nothing — so there are no errors on other pages.
 *
 * HOW TO ADD BEHAVIOUR TO ALL PAGES:
 *   Write a new function here and call it at the bottom of this file.
 *   It will automatically run on every page that loads shared.js.
 *
 * HOW TO ADD BEHAVIOUR TO ONE PAGE ONLY:
 *   Add a <script> block at the bottom of that page's HTML file,
 *   after the <script src="shared.js"> line.
 * ════════════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════════════
     MOBILE NAV
     ══════════════════════════════════════════════════════════════════

     HOW IT WORKS:
     The burger button (#navBurger) and the overlay (#navMobile) exist
     in the HTML of every page. Clicking the burger toggles the class
     .open on both elements. The CSS in shared.css makes:
       .nav-mobile.open  → display: flex  (shows the overlay)
       .nav-burger.open  → animates bars to × shape

     HOW TO CHANGE BEHAVIOUR:
     · To close the menu when clicking outside it: add a click
       listener on document and call closeNav() if the click
       target is not inside nav or .nav-mobile.
     · To add a transition/slide animation: add a CSS transition
       on .nav-mobile (e.g. transform: translateY(-100%)) instead
       of toggling display. Change display:none to visibility:hidden
       and opacity:0, then toggle those instead of display.
  ════════════════════════════════════════════════════════════════════ */
  function initMobileNav() {
    var burger = document.getElementById('navBurger');
    var mob    = document.getElementById('navMobile');

    /* If either element is missing on this page, do nothing */
    if (!burger || !mob) return;

    function openNav() {
      mob.classList.add('open');
      burger.classList.add('open');
      document.body.style.overflow = 'hidden'; /* prevent background scroll */
    }

    function closeNav() {
      mob.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    }

    function toggleNav() {
      mob.classList.contains('open') ? closeNav() : openNav();
    }

    /* Burger tap → toggle menu */
    burger.addEventListener('click', toggleNav);

    /* Tapping any link inside the mobile menu → close menu */
    mob.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeNav);
    });

    /* Pressing Escape key → close menu */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    /* Tapping the dark area outside the menu panel → close */
    mob.addEventListener('click', function (e) {
      if (e.target === mob) closeNav();
    });
  }

  /* ══════════════════════════════════════════════════════════════════
     COMING-SOON DIALOG
     ══════════════════════════════════════════════════════════════════

     HOW IT WORKS:
     Any link or element with the attribute data-cs="Page name" is
     intercepted. Instead of following the href, a modal dialog opens
     showing the page name and a "Got it" button.

     The overlay element (#csOverlay) only exists in index.html and
     apps.html. On other pages the function returns silently.

     HOW TO CONVERT A COMING-SOON LINK TO A REAL LINK:
     Remove data-cs="..." from the element and give it a real href.
     The dialog will no longer intercept it.

     HOW TO ADD A NEW COMING-SOON LINK:
     Add data-cs="Your Page Name" to any <a> or <button> tag.
     No other changes needed.
  ════════════════════════════════════════════════════════════════════ */
  function initComingSoon() {
    var overlay  = document.getElementById('csOverlay');
    var pageSpan = document.getElementById('csPageName');
    var closeBtn = document.getElementById('csClose');

    /* Only run on pages that have the dialog */
    if (!overlay || !pageSpan || !closeBtn) return;

    function openCS(label) {
      pageSpan.textContent = label || 'this page';
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeCS() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    /* "Got it" button */
    closeBtn.addEventListener('click', closeCS);

    /* Click on dark backdrop */
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeCS();
    });

    /* Escape key */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeCS();
    });

    /* Intercept ALL clicks on [data-cs] elements anywhere on the page */
    document.addEventListener('click', function (e) {
      var el = e.target.closest('[data-cs]');
      if (!el) return;
      e.preventDefault();
      openCS(el.dataset.cs);
    });
  }

  /* ══════════════════════════════════════════════════════════════════
     FAQ ACCORDION
     ══════════════════════════════════════════════════════════════════
     Used on apps.html and contact.html.
     Clicking a .faq-q button toggles .open on its .faq-item parent.
     Only one item can be open at a time.
  ════════════════════════════════════════════════════════════════════ */
  function initFaqAccordion() {
    var questions = document.querySelectorAll('.faq-q');
    if (!questions.length) return;

    questions.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item   = btn.closest('.faq-item');
        var isOpen = item.classList.contains('open');
        /* Close all items first */
        document.querySelectorAll('.faq-item').forEach(function (i) {
          i.classList.remove('open');
        });
        /* Re-open clicked item if it was closed */
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  /* ══════════════════════════════════════════════════════════════════
     SCROLL REVEAL ANIMATION
     ══════════════════════════════════════════════════════════════════
     Elements with class "reveal" or "reveal-grid" start invisible
     (opacity: 0, translateY: 36px — set in each page's CSS) and gain
     the class "visible" when they enter the viewport.

     HOW TO CONTROL THE TRIGGER POINT:
     Change threshold: 0.1 below.
       0.0 = fires as soon as 1px enters the screen
       0.1 = fires when 10% of the element is visible (default)
       0.3 = fires when 30% is visible (later, more dramatic)
  ════════════════════════════════════════════════════════════════════ */
  function initScrollReveal() {
    var elements = document.querySelectorAll('.reveal, .reveal-grid');
    if (!elements.length) return;

    /* IntersectionObserver is supported in all modern browsers */
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); /* animate once then stop watching */
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ── INITIALISE ALL MODULES ──────────────────────────────────────
     All functions are called here. Each one safely checks whether
     the elements it needs exist before doing anything, so it is safe
     to load shared.js on every page without errors.
  ────────────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav();
    initComingSoon();
    initFaqAccordion();
    initScrollReveal();
  });

})(); /* end IIFE — keeps all variables private, no global pollution */
