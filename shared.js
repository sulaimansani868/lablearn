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
     in the HTML of every page.

     The overlay is always rendered (display: flex) but starts hidden
     via opacity:0 + visibility:hidden. Clicking the burger adds the
     class .open, which CSS transitions to opacity:1 + visible,
     producing the drop-down slide animation.

     On CLOSE the .open class is removed. The CSS transition runs in
     reverse (slide up + fade out). The overlay becomes non-interactive
     again automatically via pointer-events:none in the closed state.

     HOW TO CHANGE THE ANIMATION:
       Speed and easing → edit the transition values in shared.css
       Slide distance   → edit translateY(-12px) in shared.css
       Link stagger     → edit the nth-child delays in shared.css

     HOW TO DISABLE THE ANIMATION ENTIRELY:
       In shared.css, remove the transition property from .nav-mobile
       and .nav-mobile.open, and remove the opacity/transform/
       visibility rules. Then change display:flex to display:none
       and .nav-mobile.open back to display:flex.
  ════════════════════════════════════════════════════════════════════ */
  function initMobileNav() {
    var burger = document.getElementById('navBurger');
    var mob    = document.getElementById('navMobile');

    /* If either element is missing on this page, do nothing */
    if (!burger || !mob) return;

    function openNav() {
      mob.classList.add('open');
      burger.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden'; /* prevent background scroll */
    }

    function closeNav() {
      mob.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      /*
       * NOTE: no need to manually restore display or visibility here.
       * The CSS transition in shared.css handles hiding the overlay
       * automatically once .open is removed — visibility:hidden fires
       * after the 0.32s transition ends via the delayed transition rule.
       */
    }

    function toggleNav() {
      mob.classList.contains('open') ? closeNav() : openNav();
    }

    /* Set initial aria state */
    burger.setAttribute('aria-expanded', 'false');

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

    /* Tapping outside the menu panel content → close */
    document.addEventListener('click', function (e) {
      if (
        mob.classList.contains('open') &&
        !mob.contains(e.target) &&
        !burger.contains(e.target)
      ) {
        closeNav();
      }
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

  /* ══════════════════════════════════════════════════════════════════
     TOC HIGHLIGHT — tutorial sidebar table of contents
     ══════════════════════════════════════════════════════════════════

     HOW IT WORKS:
     Every tutorial page has a sidebar (.toc-sidebar) containing a
     list of anchor links (.toc-list a) that point to headings on the
     page (e.g. href="#beer-lambert").

     This function watches all <h2> and <h3> elements that have an id
     attribute using IntersectionObserver. When a heading enters the
     top portion of the viewport, the matching TOC link gets the class
     .active, which the CSS in tutorial.css styles as a teal left
     border and bold text.

     On pages that have no .toc-list (every page except the six
     tutorial articles), the function returns immediately — no errors.

     HOW TO ADJUST THE TRIGGER POINT:
     The rootMargin below is "-10% 0px -80% 0px". This means:
       · Top edge:    10% inset from the top of the viewport
       · Bottom edge: 80% inset from the bottom of the viewport
     So the observer fires when a heading enters the narrow band
     between 10% and 20% from the top — roughly where the reader's
     eye is focused. Increase the bottom inset to fire earlier
     (e.g. "-10% 0px -70% 0px"). Decrease it to fire later.

     HOW IT HANDLES MULTIPLE HEADINGS VISIBLE AT ONCE:
     Only the most recently intersected heading is highlighted.
     This gives a natural "current section" feel as you scroll.
  ════════════════════════════════════════════════════════════════════ */
  function initTocHighlight() {
    /* Only run on pages that have a TOC sidebar */
    var tocLinks = document.querySelectorAll('.toc-list a');
    if (!tocLinks.length) return;

    /* Collect all headings on the page that have an id */
    var headings = document.querySelectorAll('.article h2[id], .article h3[id]');
    if (!headings.length) return;

    function setActive(id) {
      /* Remove .active from all TOC links */
      tocLinks.forEach(function (link) {
        link.classList.remove('active');
      });
      /* Add .active to the link whose href matches the heading id */
      var activeLink = document.querySelector('.toc-list a[href="#' + id + '"]');
      if (activeLink) activeLink.classList.add('active');
    }

    /*
     * rootMargin fires when a heading enters the band between
     * 10% from the top and 20% from the top of the viewport.
     * Adjust the second value (-80% → -70% etc.) to taste.
     */
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, { rootMargin: '-10% 0px -80% 0px' });

    headings.forEach(function (h) { observer.observe(h); });
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
    initTocHighlight();
  });

})(); /* end IIFE — keeps all variables private, no global pollution */
