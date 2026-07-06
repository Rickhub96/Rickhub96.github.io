(function clickerGame() {
  const STORAGE_KEY = "gabeljunge:clicker:v1";

  const UPGRADES = [
    { id: "helfer", name: "Gabel-Helfer", desc: "+1 Gunst / Sek.", baseCost: 15, rate: 1 },
    { id: "schmied", name: "Dorf-Schmied", desc: "+5 Gunst / Sek.", baseCost: 90, rate: 5 },
    { id: "tempel", name: "Tempelchor", desc: "+20 Gunst / Sek.", baseCost: 400, rate: 20 },
    { id: "titan", name: "Titanenwache", desc: "+80 Gunst / Sek.", baseCost: 1800, rate: 80 },
  ];

  const defaultState = { gunst: 0, totalClicks: 0, owned: {}, clickPower: 1 };
  let state = load();

  const els = {
    gunst: document.getElementById("stat-gunst"),
    rate: document.getElementById("stat-rate"),
    clicks: document.getElementById("stat-clicks"),
    clickPower: document.getElementById("click-power"),
    shop: document.getElementById("shop"),
    clickBtn: document.getElementById("gabel-click"),
    reset: document.getElementById("btn-reset"),
  };

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredCloneSafe(defaultState);
      return { ...structuredCloneSafe(defaultState), ...JSON.parse(raw) };
    } catch {
      return structuredCloneSafe(defaultState);
    }
  }

  function structuredCloneSafe(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function currentRate() {
    return UPGRADES.reduce((sum, u) => sum + (state.owned[u.id] || 0) * u.rate, 0);
  }

  function costFor(upgrade) {
    const owned = state.owned[upgrade.id] || 0;
    return Math.round(upgrade.baseCost * Math.pow(1.16, owned));
  }

  function playBlip(freq) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch { /* Audio evtl. blockiert, kein Problem */ }
  }

  function floatText(x, y, text) {
    const el = document.createElement("span");
    el.className = "float-pop";
    el.textContent = text;
    el.style.left = x + "px";
    el.style.top = y + "px";
    els.clickBtn.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }

  function render() {
    els.gunst.textContent = Math.floor(state.gunst).toLocaleString("de-DE");
    els.rate.textContent = currentRate().toLocaleString("de-DE");
    els.clicks.textContent = state.totalClicks.toLocaleString("de-DE");
    els.clickPower.textContent = state.clickPower;

    els.shop.innerHTML = "";
    UPGRADES.forEach((u) => {
      const owned = state.owned[u.id] || 0;
      const cost = costFor(u);
      const item = document.createElement("div");
      item.className = "shop-item";
      item.innerHTML = `
        <div class="desc">
          <h3>${u.name} <span class="hud" style="color:var(--bronze);">(${owned})</span></h3>
          <p>${u.desc} · Kosten: <span class="hud">${cost}</span> Gunst</p>
        </div>
      `;
      const buyBtn = document.createElement("button");
      buyBtn.className = "btn";
      buyBtn.textContent = "Kaufen";
      buyBtn.disabled = state.gunst < cost;
      buyBtn.addEventListener("click", () => buy(u));
      item.appendChild(buyBtn);
      els.shop.appendChild(item);
    });
  }

  function buy(upgrade) {
    const cost = costFor(upgrade);
    if (state.gunst < cost) return;
    state.gunst -= cost;
    state.owned[upgrade.id] = (state.owned[upgrade.id] || 0) + 1;
    playBlip(440 + Object.keys(state.owned).length * 20);
    save();
    render();
  }

  els.clickBtn.addEventListener("click", (e) => {
    state.gunst += state.clickPower;
    state.totalClicks += 1;
    const rect = els.clickBtn.getBoundingClientRect();
    floatText(e.clientX - rect.left, e.clientY - rect.top, `+${state.clickPower}`);
    playBlip(620);
    save();
    render();
  });

  els.reset.addEventListener("click", () => {
    if (!confirm("Wirklich den gesamten Fortschritt löschen?")) return;
    state = structuredCloneSafe(defaultState);
    save();
    render();
  });

  // Passives Einkommen — ein Tick pro Sekunde
  setInterval(() => {
    const rate = currentRate();
    if (rate > 0) {
      state.gunst += rate;
      save();
      render();
    }
  }, 1000);

  render();
})();
