(function meteorArena() {
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");
  const overlay = document.getElementById("game-overlay");
  const btnStart = document.getElementById("btn-start");
  const btnFullscreen = document.getElementById("btn-fullscreen");
  const scoreEl = document.getElementById("stat-score");
  const highEl = document.getElementById("stat-high");
  const livesEl = document.getElementById("stat-lives");
  const HIGH_KEY = "gabeljunge:arena:highscore";

  const sprite = new Image();
  sprite.src = "assets/gabeljunge.png";

  const W = canvas.width, H = canvas.height;
  let player, meteors, score, lives, running, lastSpawn, keys;

  function resetState() {
    player = { x: W / 2 - 30, y: H - 90, w: 60, h: 60, speed: 7 };
    meteors = [];
    score = 0;
    lives = 3;
    running = false;
    lastSpawn = 0;
    keys = { left: false, right: false };
  }
  resetState();
  highEl.textContent = localStorage.getItem(HIGH_KEY) || "0";

  function heartString(n) {
    return "❤".repeat(Math.max(n, 0)) + "♡".repeat(Math.max(3 - n, 0));
  }

  function spawnMeteor(timestamp) {
    if (timestamp - lastSpawn < Math.max(280, 900 - score * 4)) return;
    lastSpawn = timestamp;
    const size = 24 + Math.random() * 28;
    meteors.push({
      x: Math.random() * (W - size),
      y: -size,
      size,
      vy: 2.4 + Math.random() * 2.2 + score * 0.01,
    });
  }

  function rectsOverlap(a, b) {
    return a.x < b.x + b.size && a.x + a.w > b.x && a.y < b.y + b.size && a.y + a.h > b.y;
  }

  function vibrate(ms) {
    if (navigator.vibrate) navigator.vibrate(ms);
  }

  function update(timestamp) {
    if (!running) return;

    if (keys.left) player.x -= player.speed;
    if (keys.right) player.x += player.speed;
    player.x = Math.max(0, Math.min(W - player.w, player.x));

    spawnMeteor(timestamp);

    meteors.forEach((m) => (m.y += m.vy));

    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      if (rectsOverlap(player, m)) {
        meteors.splice(i, 1);
        lives -= 1;
        vibrate(120);
        livesEl.textContent = heartString(lives);
        if (lives <= 0) {
          endGame();
          return;
        }
      } else if (m.y > H + m.size) {
        meteors.splice(i, 1);
        score += 1;
        scoreEl.textContent = score;
      }
    }

    draw();
    requestAnimationFrame(update);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Sternenhintergrund
    ctx.fillStyle = "rgba(232,200,115,0.5)";
    for (let i = 0; i < 40; i++) {
      const sx = (i * 97) % W;
      const sy = (i * 53 + (Date.now() / 20)) % H;
      ctx.fillRect(sx, sy, 1.5, 1.5);
    }

    // Meteore
    ctx.fillStyle = "#c1440e";
    meteors.forEach((m) => {
      ctx.beginPath();
      ctx.arc(m.x + m.size / 2, m.y + m.size / 2, m.size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ff7a3d";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Spieler
    if (sprite.complete && sprite.naturalWidth > 0) {
      ctx.drawImage(sprite, player.x, player.y, player.w, player.h);
    } else {
      ctx.fillStyle = "#e8c873";
      ctx.fillRect(player.x, player.y, player.w, player.h);
    }
  }

  function endGame() {
    running = false;
    const best = Math.max(score, parseInt(localStorage.getItem(HIGH_KEY) || "0", 10));
    localStorage.setItem(HIGH_KEY, String(best));
    highEl.textContent = best;
    overlay.classList.remove("hidden");
    overlay.innerHTML = `
      <h2 style="margin:0;">Getroffen!</h2>
      <p class="lede" style="margin:0;">Du hast <strong>${score}</strong> Meteore überlebt.</p>
      <button class="btn primary" id="btn-start">Nochmal versuchen</button>
    `;
    document.getElementById("btn-start").addEventListener("click", startGame);
  }

  function startGame() {
    resetState();
    livesEl.textContent = heartString(lives);
    scoreEl.textContent = "0";
    overlay.classList.add("hidden");
    running = true;
    requestAnimationFrame(update);
  }

  btnStart.addEventListener("click", startGame);

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") keys.left = true;
    if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") keys.right = true;
  });
  window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") keys.left = false;
    if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") keys.right = false;
  });

  // Touch-Steuerung: ziehen, um den Gabeljungen zu bewegen
  let touchStartX = null;
  canvas.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  canvas.addEventListener("touchmove", (e) => {
    if (touchStartX === null || !running) return;
    const dx = e.touches[0].clientX - touchStartX;
    const scale = W / canvas.getBoundingClientRect().width;
    player.x = Math.max(0, Math.min(W - player.w, player.x + dx * scale));
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  btnFullscreen.addEventListener("click", () => {
    const wrap = document.getElementById("game-wrap");
    if (!document.fullscreenElement) {
      wrap.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.();
    }
  });

  draw();
})();
