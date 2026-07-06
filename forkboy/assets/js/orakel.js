(async function orakel() {
  const quoteEl = document.getElementById("quote");
  const statusEl = document.getElementById("status");
  const btnNext = document.getElementById("btn-orakel");
  const btnSpeak = document.getElementById("btn-speak");
  const btnCopy = document.getElementById("btn-copy");
  const btnShare = document.getElementById("btn-share");

  let quotes = [];
  let current = "";

  function setStatus(msg) {
    statusEl.textContent = msg;
    if (msg) setTimeout(() => { if (statusEl.textContent === msg) statusEl.textContent = ""; }, 2500);
  }

  function showQuote(text) {
    current = text;
    quoteEl.style.opacity = "0";
    setTimeout(() => {
      quoteEl.textContent = `„${text}“`;
      quoteEl.style.opacity = "1";
    }, 180);
  }

  function randomQuote() {
    if (!quotes.length) return;
    let next = current;
    while (next === current && quotes.length > 1) {
      next = quotes[Math.floor(Math.random() * quotes.length)];
    }
    showQuote(next);
  }

  try {
    const res = await fetch("assets/data/zitate.json");
    if (!res.ok) throw new Error("Netzwerk-Antwort war nicht ok");
    quotes = await res.json();
    randomQuote();
  } catch (err) {
    quoteEl.textContent = "Das Orakel schweigt gerade (Zitate konnten nicht geladen werden).";
    console.error(err);
  }

  btnNext.addEventListener("click", randomQuote);

  btnSpeak.addEventListener("click", () => {
    if (!("speechSynthesis" in window)) {
      setStatus("Sprachausgabe wird von diesem Browser nicht unterstützt.");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(current);
    utterance.lang = "de-DE";
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  });

  btnCopy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(current);
      setStatus("In die Zwischenablage kopiert ✓");
    } catch {
      setStatus("Kopieren nicht möglich in diesem Browser.");
    }
  });

  btnShare.addEventListener("click", async () => {
    const shareData = { title: "Orakel des Gabeljungen", text: current, url: location.href };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch { /* Nutzer hat abgebrochen */ }
    } else {
      try {
        await navigator.clipboard.writeText(`${current} — ${location.href}`);
        setStatus("Teilen nicht verfügbar — stattdessen kopiert ✓");
      } catch {
        setStatus("Teilen wird von diesem Browser nicht unterstützt.");
      }
    }
  });
})();
