(function quiz() {
  const QUESTIONS = [
    {
      q: "Mit welchem Cheat-Code erscheint der Gabeljunge in Age of Mythology: Retold?",
      options: ["TINES OF POWER", "WUV WOO", "FOOTY", "BIG PROMO"],
      correct: 0,
    },
    {
      q: "Was benötigt man laut Cheat-Beschreibung, um den Gabeljungen herbeizurufen?",
      options: ["Nur einen Tempel", "Ein Dorfzentrum", "Einen Titanen", "Eine Werft"],
      correct: 1,
    },
    {
      q: "Welche Waffe trägt der Gabeljunge?",
      options: ["Ein Schwert", "Einen Bogen", "Eine Mistgabel", "Einen Speer"],
      correct: 2,
    },
    {
      q: "Wofür ist der Gabeljunge im Kampf bekannt?",
      options: [
        "Für enormen Schaden",
        "Für nichts – er ist rein kosmetisch",
        "Für Fernkampf-Angriffe",
        "Für Heilzauber",
      ],
      correct: 1,
    },
    {
      q: "Zu welcher Spielereihe gehört Age of Mythology?",
      options: ["Age of Empires", "Total War", "Civilization", "StarCraft"],
      correct: 0,
    },
  ];

  const elQTotal = document.getElementById("q-total");
  const elQCurrent = document.getElementById("q-current");
  const elQText = document.getElementById("q-text");
  const elOptions = document.getElementById("q-options");
  const elProgress = document.getElementById("progress");
  const elBody = document.getElementById("quiz-body");
  const elResult = document.getElementById("quiz-result");
  const elResultTitle = document.getElementById("result-title");
  const elResultText = document.getElementById("result-text");
  const btnRestart = document.getElementById("btn-restart");

  let order = [];
  let index = 0;
  let score = 0;
  let locked = false;

  function shuffled(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function start() {
    order = shuffled(QUESTIONS);
    index = 0;
    score = 0;
    locked = false;
    elQTotal.textContent = order.length;
    elBody.style.display = "block";
    elResult.style.display = "none";
    renderQuestion();
  }

  function renderQuestion() {
    locked = false;
    const item = order[index];
    elQCurrent.textContent = index + 1;
    elProgress.style.width = `${(index / order.length) * 100}%`;
    elQText.textContent = item.q;
    elOptions.innerHTML = "";

    const optionOrder = item.options.map((text, i) => ({ text, isCorrect: i === item.correct }));
    shuffled(optionOrder).forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = opt.text;
      btn.addEventListener("click", () => selectAnswer(btn, opt.isCorrect));
      elOptions.appendChild(btn);
    });
  }

  function selectAnswer(btn, isCorrect) {
    if (locked) return;
    locked = true;
    btn.classList.add(isCorrect ? "correct" : "wrong");
    if (isCorrect) score += 1;
    [...elOptions.children].forEach((b) => (b.disabled = true));

    setTimeout(() => {
      index += 1;
      if (index < order.length) {
        renderQuestion();
      } else {
        finish();
      }
    }, 700);
  }

  function finish() {
    elProgress.style.width = "100%";
    elBody.style.display = "none";
    elResult.style.display = "block";
    elResultTitle.textContent = score === order.length ? "Meisterhaft!" : "Ergebnis";
    elResultText.textContent = `Du hast ${score} von ${order.length} Fragen richtig beantwortet.`;
    if (score >= Math.ceil(order.length * 0.6)) launchConfetti();
  }

  btnRestart.addEventListener("click", start);
  start();

  /* ---------- Canvas-Konfetti bei gutem Ergebnis ---------- */
  function launchConfetti() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = document.getElementById("confetti-canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#e8c873", "#c9a659", "#e7dfc6", "#6fae6a"];
    const pieces = Array.from({ length: 140 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      size: 4 + Math.random() * 6,
      vy: 2 + Math.random() * 3,
      vx: (Math.random() - 0.5) * 2,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    let frame = 0;
    function tick() {
      frame += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });
      if (frame < 220) {
        requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    tick();
  }
})();
