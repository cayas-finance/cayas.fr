/*------------------------------------------------------------------------------
    JS Document (https://developer.mozilla.org/en/JavaScript)

    project:    Cayas
    created:    2025-01-01
    author:     Christophe ANDRIEU (http://www.stpo.fr)

    summary:    CONSTANTES
                UTILITIES
                DOCUMENT READY
                DEBOUNCE
                BREAKPOINTS
                ONZOOM
                PX_VALUE
                ACCESSIBLE GIANT TOGGLE
                ACCESSIBLE TABS
                DESKTOP/MOBILE TRAINING CANVAS TOGGLE
                ACCESSIBLE TOOLTIPS
                STICKY/FIXED IS PINNED
                STICKY/FIXED IS REVEAL
                CUSTOM KEY FOCUS
                SHOW-HIDE FOR PASSWORD FIELDS
                INPUT RANGE BUBBLES
----------------------------------------------------------------------------- */
(function () {
  //
  // == CONSTANTES
  // --------------------------------------------------
  var d = document,
    w = window,
    stpo = {};

  //
  // == UTILITIES
  // --------------------------------------------------
  var log = function (x) {
    if (typeof console !== "undefined") {
      console.log(x);
    }
  };

  //
  // == DOCUMENT READY
  // --------------------------------------------------
  // This is executed when HTML-Document is loaded and DOM is ready.
  document.addEventListener("DOMContentLoaded", function (event) {
    stpo.onZoom(); // makes onZoom available, thx
    stpo.toggle(); // shows and hides stuff
    stpo.isPinned(); // observes if sticky is pinned
    stpo.keyFocus(); // custom styles for keyboard tab focus

  });

  //
  // == DEBOUNCE
  // --------------------------------------------------
  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  // More here: https://davidwalsh.name/javascript-debounce-function
  stpo.debounce = function (func, wait, immediate) {
    var timeout;
    return function () {
      var context = this,
        args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  //
  // == BREAKPOINTS
  // --------------------------------------------------
  // Get the current breakpoint based on the ::before pseudo-element on body in base.scss.
  // More here: https://gomakethings.com/the-easy-way-to-manage-css-breakpoints-in-javascript/
  stpo.getBreakpoint = function () {
    return window
      .getComputedStyle(document.body, ":before")
      .content.replace(/\"/g, "");
  };

  //
  // == ONZOOM
  // --------------------------------------------------
  // Custom zoom event detector (used for burger show/hide).
  // Fired also on resize event.
  // More here: https://gist.github.com/Kubo2/6c818624b2995cd34f20
  stpo.onZoom = function () {
    var oldresize = w.onresize;
    w.onresize = function (e) {
      var event = window.event || e;
      if (typeof oldresize === "function" && !oldresize.call(window, event)) {
        return false;
      }
      if (typeof window.onzoom === "function") {
        return window.onzoom.call(window, event);
      }
    };
  };

  //
  // == PX_VALUE
  // --------------------------------------------------
  // This returns the width in px units from em units.
  // Useful when observing window width for responsive items (sliders, etc.).
  // for info (for 16px basic font-size):
  // 81.25em  = "1300px"
  // 75em     = "1200px"
  // 64em     = "1024px"
  // 48em     = "768px"
  // 37.5em   = "600px"
  stpo.pxValue = function (emValue) {
    return (
      emValue *
      parseFloat(
        w
          .getComputedStyle(d.getElementsByTagName("body")[0], null)
          .getPropertyValue("font-size")
      )
    );
  };

  //
  // == ACCESSIBLE GIANT TOGGLE
  // --------------------------------------------------
  // This function manages various .toggle components: disclosures, accordions, dropdowns navs, modals, burger menus.
  // It handles accessibility issues by toggling aria-attributes and visibility (hidden/visible) and moving focus.
  // The structure must be like: .toggle + nextSibling (as target, or targeted by aria-controls attribute).
  // This is basically a big toggle function with some special cases.
  // Linked elements:
  // - .toggle-closer: this is the class you put on the button(s) closing the target (must be inside the target)
  // - .toggle-overlay: this is the class you put on the overlay inside the target (used for CSS animations)
  // - [data-toggle-collection="true"]: this is the data-attribute you put on ancestor to make a 'collection'
  // Options on .toggle elements:
  //      - [data-trap] traps the focus in the target when open
  //      - [data-freeze] freezes the website when target is open
  //      - [data-click-outside] closes the target when clicking on the .toggle-overlay
  //      - [data-collection] should be used for dropdown menus (auto close submenu when focus goes outside)
  //      - [data-burger] handles the burger menu special case. Can be tricky.
  // It relies on stpo.debounce, stpo.breakpoints and stpo.onzoom utilities for window resizing stuff.
  // FIXME: doesn't handle nested toggles. nevermind. maybe latorz.
  stpo.toggle = function () {
    // breakpoints where burger is active.
    // CHANGE ME if needed (according to CSS):
    let mobileBreakpoints =
        "(breakpoint === 'large') || (breakpoint === 'medium') || (breakpoint === 'small') || (breakpoint === 'xsmall') || (breakpoint === 'xxsmall')",
      // must be declared to avoid trapFocus bug
      trapped;

    const // FOCUS TRAP FUNCTION
      // ------------------------
      // this is a simplified version of this: https://codepen.io/vaskort/pen/LYpwjoj
      trapFocus = (element) => {
        const focusableEls = Array.from(
            element.querySelectorAll(
              'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
          ),
          firstFocusableEl = focusableEls[0],
          handleFocus = (e) => {
            e.preventDefault();

            // if the focused element isn't in your modal container (you're out of the container)
            // force focus on first element (loop)
            if (!focusableEls.includes(e.target)) {
              firstFocusableEl.focus();
            }
          };

        // force focus on first element
        firstFocusableEl.focus();

        // on focus
        d.addEventListener("focus", handleFocus, true);

        return {
          onClose: () => {
            d.removeEventListener("focus", handleFocus, true);
          },
        };
      },
      // TOGGLE FUNCTION
      // ------------------------
      toggleCore = function (target, opener, options, e) {
        // get breakpoint for burger test
        var breakpoint = stpo.getBreakpoint();

        if (
          target.getAttribute("aria-hidden") === "true" &&
          e.key !== "Escape"
        ) {
          // if collection: close all others in collection
          if (options.isCollection === "true") {
            const parent = opener.closest("[data-toggle-collection-parent]");

            if (parent !== null) {
              parent
                .querySelectorAll("[data-collection]")
                .forEach(function (elm) {
                  if (
                    elm !== opener &&
                    elm.getAttribute("aria-expanded") === "true"
                  ) {
                    elm.click();
                  }
                });
            }
          }

          // show target
          target.setAttribute("aria-hidden", "false");

          // [aria-expanded]
          opener.setAttribute("aria-expanded", "true");

          // if burger, weird hack: opener is moved INSIDE its targeted element in order to be in the focustrap
          // CSS have to be strong here in order to keep the design pretty.
          if (options.isBurger === "true" && options.isTrap === "true") {
            // keep the placement of opener
            var openerMarker = document.createElement("div");
            openerMarker.id = "opener-was-here";
            opener.before(openerMarker);

            // move opener
            target.prepend(opener);

            // weird hack on the weird hack: remove/reset aria-expanded attribute to trigger CSS animation
            opener.removeAttribute("aria-expanded");
            w.setTimeout(function () {
              opener.setAttribute("aria-expanded", "true");
            }, 1);
          }

          // if not (burger && desktop)
          if (!(options.isBurger === "true" && !eval(mobileBreakpoints))) {
            // if html should be freezed
            if (options.isFreeze === "true") {
              d.getElementsByTagName("html")[0].classList.add("is-freezed");
            }

            // if focus should be trapped
            if (options.isTrap === "true") {
              trapped = trapFocus(target);
            }
          }
        } else if (target.getAttribute("aria-hidden") === "false") {
          // hide target
          target.setAttribute("aria-hidden", "true");

          // [aria-expanded]
          opener.setAttribute("aria-expanded", "false");

          // focus back on opener
          opener.focus();

          // if burger, weird hack resolution : opener is removed at its initial place
          if (options.isBurger === "true" && options.isTrap === "true") {
            // put it back
            if (d.getElementById("opener-was-here") !== null) {
              d.getElementById("opener-was-here").before(opener);
              d.getElementById("opener-was-here").remove();
            }

            // weird hack on the weird hack: remove/reset aria-expanded attribute to trigger CSS animation
            opener.setAttribute("aria-expanded", "true");
            w.setTimeout(function () {
              opener.setAttribute("aria-expanded", "false");
            }, 1);

            // focus on it
            opener.focus();
          }

          // if focus is trapped
          if (options.isTrap === "true" && trapped) {
            trapped.onClose();
            trapped = undefined;
          }

          // if html is freezed
          if (options.isFreeze === "true") {
            d.getElementsByTagName("html")[0].classList.remove("is-freezed");
          }

          // if there is an animation, play it (used for modals)
          if (options.closeDuration !== 0) {
            // artificially keep it visible
            target.style.visibility = "visible";

            // close it after duration
            w.setTimeout(function () {
              target.removeAttribute("style");
            }, options.closeDuration);
          }

          // pause *every* media on close (simplier, sorry)
          // relies on the plyr lib.
          Array.prototype.forEach.call(
            d.querySelectorAll(".plyr-media"),
            function (myPlayer) {
              myPlayer.pause();
            }
          );
        }
      };

    // FOR EACH
    // ------------------------
    Array.prototype.forEach.call(
      d.querySelectorAll(".toggle"),
      function (opener) {
        // INIT
        // ------------------------
        const // find target (or take opener next sibling)
          target =
            d.querySelector("#" + opener.getAttribute("aria-controls")) ||
            opener.nextElementSibling,
          // find overlay if exists
          overlay = target.querySelector(".toggle-overlay"),
          // find closers
          closers = target.querySelectorAll(".toggle-close"),
          // options mainly taken from opener data-attributes
          // closeDuration is tricky: gets the CSS value of transition duration on overlay if exists
          options = {
            closeDuration:
              overlay !== null
                ? parseFloat(getComputedStyle(overlay).transitionDuration) *
                    1000 || 0
                : 0,
            isTrap: opener.getAttribute("data-trap") || "false",
            isFreeze: opener.getAttribute("data-freeze") || "false",
            isClickOutside:
              opener.getAttribute("data-click-outside") || "false",
            isEchap: opener.getAttribute("data-echap") || "false",
            isCollection: opener.getAttribute("data-collection") || "false",
            isBurger: opener.getAttribute("data-burger") || "false",
          };

        // CLICK
        // ------------------------
        // add listener to opener
        opener.addEventListener("click", (e) =>
          toggleCore(target, opener, options, e)
        );

        // add listeners to each closer
        Array.prototype.forEach.call(closers, function (el) {
          // TRICKY: add a flag on event to add it only once
          if (!el._toggleCore) {
            el._toggleCore = true;
            el.addEventListener("click", (e) =>
              toggleCore(target, opener, options, e)
            );
          }
        });

        // if allowed, add listener on overlay click
        if (options.isClickOutside === "true") {
          overlay.addEventListener("click", (e) =>
            toggleCore(target, opener, options, e)
          );
        }

        // ECHAP
        // ------------------------
        // if allowed, add listener on ECHAP key
        // BUT ONLY if not (burger && desktop)
        if (options.isEchap === "true") {
          w.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
              var breakpoint = stpo.getBreakpoint();

              if (!(options.isBurger === "true" && !eval(mobileBreakpoints))) {
                toggleCore(target, opener, options, e);
              }
            }
          });
        }

        // TOGGLE COLLECTION FOCUS
        // ------------------------
        // toggle collection focus management
        if (options.isCollection === "true") {
          // find the container of dropdown item
          var container = opener.closest('[data-toggle-collection="true"]');

          // listen to focusout
          container.addEventListener("focusout", function (e) {
            // if focus is still in the container, do nothing
            if (container.contains(e.relatedTarget)) return;

            // otherwise, close current item (if open, desktop only)
            if (opener.getAttribute("aria-expanded") === "true") {
              var breakpoint = stpo.getBreakpoint();

              // on desktop
              if (!eval(mobileBreakpoints)) {
                toggleCore(target, opener, options, e);
              }

              // on mobile: it's handled by the click manager above
            }
          });
        }

        // BURGER MENU
        // ------------------------
        if (options.isBurger === "true") {
          // init lastBreakpoint
          // but make it empty to force test on load
          var lastBreakpoint = "";

          // this function observes the current MQ breakpoint
          const burgerWatch = function (e) {
            var breakpoint = stpo.getBreakpoint();

            // simplified version of breakpoint check
            // should better check the whole mobileBreakpoints but this should be enough...
            if (breakpoint !== lastBreakpoint) {
              // on "mobile"
              if (eval(mobileBreakpoints)) {
                // make it a modal window
                target.setAttribute("aria-modal", "true");

                // close burger menu
                if (opener.getAttribute("aria-expanded") === "true") {
                  opener.click();
                  return false;
                }
              }

              // on desktop
              else {
                // isn't a modal on desktop
                target.removeAttribute("aria-modal");

                // if closed, open burger menu
                if (opener.getAttribute("aria-expanded") === "false") {
                  opener.click();
                }

                // else if open
                // quick hack: kill freezed and trapped when coming from (mobile && burger open) to (desktop)
                // by clicking two times the opener (close + reopen)
                // yeah, that's pretty dirty, but it's an edge case I swear
                else if (!eval(mobileBreakpoints)) {
                  opener.click();
                  opener.click();
                }
              }

              // close open target [data-collection] items on resize
              target
                .querySelectorAll(
                  '.toggle[data-collection="true"][aria-expanded="true"]'
                )
                .forEach(function (collection) {
                  collection.click();
                });

              // update lastBreakpoint
              lastBreakpoint = stpo.getBreakpoint();
            }
          };

          // show or hide nav on load depending on window size
          w.addEventListener("load", burgerWatch);

          // show or hide nav on resize/zoom
          w.onzoom = stpo.debounce(burgerWatch, 50);
        }

        // AUTOCLICK (useful for modals that fire onload)
        // ------------------------
        if (opener.classList.contains("toggle--autoclick")) {
          opener.click();
        }
      }
    );
  };

  //
  // == STICKY/FIXED IS PINNED
  // --------------------------------------------------
  // This function adds a .is-pinned class on .sticky-watch elements when they are pinned.
  // CSS 'top' of element is used to provide threshold for hitting top of parent.
  // If threshold isn't set and position is fixed: works too.
  // The original idea comes from this guy: https://davidwalsh.name/detect-sticky
  stpo.isPinned = function () {
    if (typeof CSS !== "undefined") {
      const elements = d.querySelectorAll(".sticky-watch");

      Array.prototype.forEach.call(elements, function (el) {
        if (el !== null) {
          const observer = new IntersectionObserver(
            ([e]) =>
              e.target.classList.toggle("is-pinned", e.intersectionRatio < 1),
            { threshold: [1] }
          );

          observer.observe(el);
        }
      });
    }
  };

  //
  // == CUSTOM KEY FOCUS
  // --------------------------------------------------
  // Only show :focus styles on keyup() events
  // Items within the container will show a custom :focus style when using the keyboard only. Mouse interactions will prevent/remove the styles.
  // Basically adds a 'body--has-focus' on body element when keyup.
  // Based on: https://codepen.io/svinkle/pen/zzrORW
  // See base.scss for styles
  // Warning: doesn't like overflow:hidden on parents
  stpo.keyFocus = function () {
    (() => {
      const selectors = { container: "body" },
        classes = { containerHasFocus: "body--has-focus" },
        container = document.querySelector(selectors.container);

      // Add the focus class to the container if the keyboard
      // event is an element within the container
      d.addEventListener("keyup", (e) => {
        if (container.contains(e.target)) {
          container.classList.add(classes.containerHasFocus);
        } else {
          container.classList.remove(classes.containerHasFocus);
        }
      });

      // Remove the focus class on mouse click
      d.addEventListener("mousedown", (e) => {
        if (container.contains(e.target)) {
          container.classList.remove(classes.containerHasFocus);
        }
      });
    })();
  };
})();
