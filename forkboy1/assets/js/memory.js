(function memoryGame() {
  const SYMBOLS = ["⚡", "🔱", "🦉", "🐍", "🌊", "🔥", "⭐", "GABELJUNGE"];
  const BEST_KEY = "gabeljunge:memory:best";

  const grid = document.getElementById("memory-grid");
  const statMoves = document.getElementById("stat-moves");
  const statTime = document.getElementById("stat-time");
  const statBest = document.getElementById("stat-best");
  const btnShuffle = document.getElementById("btn-shuffle");

  let cards = [];
  let flipped = [];
  let matches = 0;
  let moves = 0;
  let timerId = null;
  let seconds = 0;
  let lock = false;

  function formatTime(s) {
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const r = String(s % 60).padStart(2, "0");
    return `${m}:${r}`;
  }

  function loadBest() {
    const best = localStorage.getItem(BEST_KEY);
    statBest.textContent = best ? formatTime(parseInt(best, 10)) : "–";
  }

  function shuffled(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function startTimer() {
    stopTimer();
    seconds = 0;
    statTime.textContent = formatTime(0);
    timerId = setInterval(() => {
      seconds += 1;
      statTime.textContent = formatTime(seconds);
    }, 1000);
  }
  function stopTimer() { if (timerId) clearInterval(timerId); timerId = null; }

  function buildBoard() {
    stopTimer();
    matches = 0;
    moves = 0;
    flipped = [];
    lock = false;
    statMoves.textContent = "0";
    statTime.textContent = "00:00";

    const deck = shuffled([...SYMBOLS, ...SYMBOLS]);
    grid.innerHTML = "";
    cards = deck.map((symbol, i) => {
      const card = document.createElement("div");
      card.className = "mem-card";
      card.dataset.symbol = symbol;
      card.dataset.index = i;
      card.innerHTML = `
        <div class="mem-card-inner">
          <div class="mem-face mem-front">?</div>
          <div class="mem-face mem-back">
            ${symbol === "GABELJUNGE"
              ? '<img src="assets/gabeljunge.png" alt="Gabeljunge" />'
              : `<span>${symbol}</span>`}
          </div>
        </div>`;
      card.addEventListener("click", () => flipCard(card));
      grid.appendChild(card);
      return card;
    });
  }

  function flipCard(card) {
    if (lock || card.classList.contains("flipped") || card.classList.contains("matched")) return;
    if (!timerId) startTimer();
    card.classList.add("flipped");
    flipped.push(card);

    if (flipped.length === 2) {
      moves += 1;
      statMoves.textContent = moves;
      lock = true;
      const [a, b] = flipped;
      if (a.dataset.symbol === b.dataset.symbol) {
        a.classList.add("matched");
        b.classList.add("matched");
        flipped = [];
        lock = false;
        matches += 1;
        if (matches === SYMBOLS.length) finishGame();
      } else {
        setTimeout(() => {
          a.classList.remove("flipped");
          b.classList.remove("flipped");
          flipped = [];
          lock = false;
        }, 800);
      }
    }
  }

  function finishGame() {
    stopTimer();
    const best = localStorage.getItem(BEST_KEY);
    if (!best || seconds < parseInt(best, 10)) {
      localStorage.setItem(BEST_KEY, String(seconds));
    }
    loadBest();
  }

  btnShuffle.addEventListener("click", buildBoard);
  loadBest();
  buildBoard();
})();
