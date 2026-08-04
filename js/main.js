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
    autoAdvanceMs: 6000
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

  /* ---------- 6. Hero play / pause control ---------- */

  var playWrap = document.querySelector(".hero__play-wrap");
  var playBtn = document.querySelector(".hero__play");

  if (playWrap && playBtn) {
    playBtn.addEventListener("click", function () {
      var paused = playWrap.classList.toggle("is-paused");
      playBtn.setAttribute("aria-pressed", String(paused));
      playBtn.setAttribute("aria-label", paused ? "Play" : "Pause");
    });
  }
})();
