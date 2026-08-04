/* ============================================================
   Asite — page behaviour
   Plain JavaScript, no dependencies.

   Contents
   : 1. Config
   : 2. Announcement / optional-content toggles
   : 3. Mobile navigation menu
   : 4. "Who needs Asite" carousel
   : 5. Hero play / pause control
   ============================================================ */

(function () {
  "use strict";

  /* ---------- 1. Config ----------
     Flip these to change page behaviour — no other edits needed. */
  var CONFIG = {
    showAnnouncement: true,   // top black announcement bar
    showFourthInsight: true,  // 4th card in the Insights grid
    autoAdvance: false,       // carousel auto-advances every 6s
    autoAdvanceMs: 6000,
    slideDurationMs: 7000     // hero slideshow: time each image is held
  };

  /* ---------- 2. Announcement / optional-content toggles ---------- */

  if (!CONFIG.showAnnouncement) {
    var announce = document.querySelector(".announce");
    if (announce) announce.classList.add("is-hidden");
  }

  if (!CONFIG.showFourthInsight) {
    var fourth = document.querySelector('[data-optional="fourth-insight"]');
    if (fourth) fourth.classList.add("is-hidden");
  }

  /* ---------- 3. Mobile navigation menu ---------- */

  var shell = document.querySelector(".hero__shell");
  var toggle = document.querySelector(".nav__toggle");

  if (shell && toggle) {
    toggle.addEventListener("click", function () {
      var open = shell.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    // close the menu after choosing a link
    shell.querySelectorAll(".nav-menu a").forEach(function (link) {
      link.addEventListener("click", function () {
        shell.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // mobile nav: floats over the hero at rest, pins to the top once scrolled
  var nav = document.querySelector(".nav");
  var mqMobile = window.matchMedia("(max-width: 1079px)");
  function onNavScroll() {
    if (!nav) return;
    if (!mqMobile.matches) { nav.classList.remove("is-stuck"); return; }
    nav.classList.toggle("is-stuck", window.scrollY > 140);
  }
  window.addEventListener("scroll", onNavScroll, { passive: true });
  onNavScroll();

  /* ---------- 4. "Who needs Asite" carousel ---------- */

  var rail = document.querySelector(".who__rail");

  function step(dir, wrap) {
    if (!rail) return;
    var card = rail.firstElementChild;
    var width = card ? card.getBoundingClientRect().width + 20 : rail.clientWidth;
    var max = rail.scrollWidth - rail.clientWidth - 4;

    if (wrap && dir > 0 && rail.scrollLeft >= max) {
      rail.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    rail.scrollBy({ left: dir * width, behavior: "smooth" });
  }

  document.querySelectorAll("[data-carousel-prev]").forEach(function (btn) {
    btn.addEventListener("click", function () { step(-1, false); });
  });
  document.querySelectorAll("[data-carousel-next]").forEach(function (btn) {
    btn.addEventListener("click", function () { step(1, false); });
  });

  if (CONFIG.autoAdvance && rail) {
    var timer = setInterval(function () { step(1, true); }, CONFIG.autoAdvanceMs);
    // stop auto-advance as soon as the visitor interacts with the rail
    ["pointerdown", "wheel", "touchstart"].forEach(function (evt) {
      rail.addEventListener(evt, function () { clearInterval(timer); }, { once: true, passive: true });
    });
  }

  /* ---------- 5. Athena — Asite Intelligence assistant ---------- */

  var ATHENA = {
    replies: [
      "Thanks — that's exactly the kind of workflow Asite connects. A specialist can show you how it looks with your own documents; book a demo whenever suits.",
      "Good question. The short answer: one common data environment, one auditable record of every revision. Want a 30-minute walkthrough with our team?",
      "Noted. Most teams start with document control, then grow into field workflows and AI agents. I can point you to a demo, or ask me something else."
    ]
  };

  var athena = document.querySelector(".athena");
  if (athena) {
    var blob = athena.querySelector(".athena__blob");
    var panel = athena.querySelector(".athena__panel");
    var thread = athena.querySelector(".athena__thread");
    var form = athena.querySelector(".athena__form");
    var input = form.querySelector("input");
    var replyIndex = 0;

    function setOpen(open) {
      panel.hidden = !open;
      blob.setAttribute("aria-expanded", String(open));
      if (open) input.focus();
    }

    blob.addEventListener("click", function () { setOpen(panel.hidden); });
    athena.querySelector(".athena__close").addEventListener("click", function () { setOpen(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hidden) setOpen(false);
    });

    function addMessage(text, who) {
      var p = document.createElement("p");
      p.className = "athena__msg athena__msg--" + who;
      p.textContent = text;
      thread.appendChild(p);
      thread.scrollTop = thread.scrollHeight;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var text = input.value.trim();
      if (!text) return;
      addMessage(text, "user");
      input.value = "";
      setTimeout(function () {
        addMessage(ATHENA.replies[replyIndex % ATHENA.replies.length], "bot");
        replyIndex += 1;
      }, 600);
    });
  }

  /* ---------- 6. Hero slideshow + play / pause control ---------- */

  var playWrap = document.querySelector(".hero__play-wrap");
  var playBtn = document.querySelector(".hero__play");
  var media = document.querySelector(".hero__media");
  var slides = media ? [].slice.call(media.querySelectorAll("img")) : [];
  var progressBar = document.querySelector(".hero__progress i");

  if (media && slides.length) {
    var current = 0;
    var paused = false;
    var slideStart = performance.now();
    var pausedAt = 0;

    // give the first slide its drift
    slides[0].classList.add("kb-a");

    function show(idx) {
      var prev = slides[current];
      var next = slides[idx];
      prev.classList.remove("is-active");
      // restart the Ken Burns animation, alternating direction
      next.classList.remove("kb-a", "kb-b");
      void next.offsetWidth; // reflow so the animation restarts
      next.classList.add(idx % 2 ? "kb-b" : "kb-a", "is-active");
      current = idx;
      slideStart = performance.now();
    }

    function setPaused(state) {
      paused = state;
      media.classList.toggle("is-paused", paused);
      if (playWrap) playWrap.classList.toggle("is-paused", paused);
      if (playBtn) {
        playBtn.setAttribute("aria-pressed", String(paused));
        playBtn.setAttribute("aria-label", paused ? "Play slideshow" : "Pause slideshow");
      }
      if (paused) pausedAt = performance.now();
      else slideStart += performance.now() - pausedAt; // resume where we left off
    }

    if (playBtn) {
      playBtn.addEventListener("click", function () { setPaused(!paused); });
    }

    // one loop drives both the slide changes and the progress bar
    function tick(now) {
      if (!paused) {
        var elapsed = now - slideStart;
        if (elapsed >= CONFIG.slideDurationMs) {
          show((current + 1) % slides.length);
          elapsed = 0;
        }
        if (progressBar) {
          progressBar.style.width = Math.min(100, (elapsed / CONFIG.slideDurationMs) * 100) + "%";
        }
      }
      window.requestAnimationFrame(tick);
    }
    window.requestAnimationFrame(tick);
  } else if (playWrap && playBtn) {
    // no slideshow present — keep the button as a simple toggle
    playBtn.addEventListener("click", function () {
      var p = playWrap.classList.toggle("is-paused");
      playBtn.setAttribute("aria-pressed", String(p));
      playBtn.setAttribute("aria-label", p ? "Play" : "Pause");
    });
  }
})();
