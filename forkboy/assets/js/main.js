/* =========================================================
   main.js — läuft auf JEDER Seite
   Technik-Showcase: DOM-APIs, matchMedia, Canvas + rAF,
   Keyboard-Event-Buffer (Cheat-Code), IntersectionObserver
   ========================================================= */

(function navigation() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Aktuelle Seite in der Navigation markieren
  const here = location.pathname.split("/").pop() || "index.html";
  links.querySelectorAll("a").forEach((a) => {
    const target = a.getAttribute("href");
    if (target === here) a.setAttribute("aria-current", "page");
  });
})();

/* ---------- Ambient-Hintergrund: treibende Funken/Runen ---------- */
(function ambientCanvas() {
  const canvas = document.getElementById("ambient-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let particles = [];
  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  function spawn(n) {
    particles = Array.from({ length: n }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 0.6 + Math.random() * 1.8,
      vy: -(0.15 + Math.random() * 0.35),
      vx: (Math.random() - 0.5) * 0.15,
      glow: 0.3 + Math.random() * 0.7,
    }));
  }
  spawn(Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 18000)));

  function tick() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(232, 200, 115, 0.8)";
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
      ctx.globalAlpha = p.glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    if (!reduceMotion) requestAnimationFrame(tick);
  }
  // Bei "reduced motion" nur ein statisches Standbild rendern
  tick();
})();

/* ---------- Scroll-Reveal via IntersectionObserver ---------- */
(function scrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => io.observe(el));
})();

/* ---------- Sitesweiter Cheat-Code-Easter-Egg ---------- */
(function cheatListener() {
  const overlay = document.getElementById("cheat-overlay");
  if (!overlay) return;
  const CODE = "tines of power";
  let buffer = "";

  function playThunder() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const bufferSize = ctx.sampleRate * 1.2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);

      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(180, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.9, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.1);

      noise.connect(filter).connect(gain).connect(ctx.destination);
      noise.start();
      noise.stop(ctx.currentTime + 1.2);
    } catch (e) {
      /* Web Audio evtl. nicht verfügbar — Easter Egg läuft dann stumm */
    }
  }

  window.addEventListener("keydown", (e) => {
    if (e.key.length > 1) return; // Steuertasten ignorieren
    buffer = (buffer + e.key).toLowerCase().slice(-CODE.length);
    if (buffer === CODE) {
      playThunder();
      document.body.classList.add("shake");
      overlay.classList.add("show");
      setTimeout(() => document.body.classList.remove("shake"), 400);
      setTimeout(() => overlay.classList.remove("show"), 2600);
      buffer = "";
    }
  });
})();
