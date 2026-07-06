# Gabeljunge.io

Ein Fan-Projekt über den **Gabeljungen** aus *Age of Mythology: Retold*
(erscheint per Cheat-Code `TINES OF POWER`) — und gleichzeitig ein Showcase
für möglichst viele verschiedene JavaScript-Spielereien auf GitHub Pages.
Reines HTML/CSS/JS, kein Build-Schritt, kein Framework.

## Struktur

```
├── index.html          Startseite / Übersicht
├── orakel.html          Zufalls-Sprüche (fetch, SpeechSynthesis, Clipboard, Web Share)
├── clicker.html         Idle-Clicker "Gunst-Schmiede" (localStorage, setInterval, Web Audio)
├── arena.html            Canvas-Ausweichspiel "Meteor-Arena" (rAF, Fullscreen, Vibration)
├── quiz.html             Quiz "Wissensarena" (Konfetti-Canvas)
├── soundboard.html       "Klang-Schmiede" (Web Audio Synthese + AnalyserNode-Visualizer)
├── memory.html           Memory "Gedächtnistempel" (CSS-3D-Flip)
├── 404.html              Individuelle Fehlerseite
├── assets/
│   ├── gabeljunge.png    ← HIER dein eigenes Bild einsetzen (gleicher Dateiname!)
│   ├── css/style.css     Design-System (dunkelblau + Gold, Cinzel/EB Garamond)
│   ├── js/               Ein Skript pro Seite + main.js (Navigation, Ambient-Canvas,
│   │                      sitesweiter Cheat-Code-Easter-Egg)
│   └── data/zitate.json  Sprüche für das Orakel
└── .nojekyll
```

## Eigenes Bild einsetzen

Ersetze einfach `assets/gabeljunge.png` durch dein eigenes Bild — **gleicher
Dateiname und Ordner**, dann taucht es automatisch auf jeder Seite auf (Nav,
Hero, Clicker, Arena, Memory, 404-Seite). Ein quadratisches Bild (z. B.
600×600 px) funktioniert am besten, da es überall kreisförmig zugeschnitten wird.

## Lokal ansehen

Kein Server nötig — die Seiten funktionieren beim direkten Öffnen der
`.html`-Dateien im Browser (Doppelklick). Für Fetch-Aufrufe (Orakel-Seite)
empfiehlt sich trotzdem ein einfacher lokaler Server, z. B.:

```bash
python3 -m http.server 8000
```

und dann `http://localhost:8000` öffnen.

## Auf GitHub Pages veröffentlichen

1. Neues Repository auf GitHub anlegen, z. B. `gabeljunge-io`.
2. Den gesamten Inhalt dieses Ordners in das Repository pushen:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Gabeljunge.io"
   git branch -M main
   git remote add origin https://github.com/<dein-nutzername>/<repo-name>.git
   git push -u origin main
   ```
3. Im Repository unter **Settings → Pages**:
   - "Source" auf **Deploy from a branch** stellen
   - Branch `main`, Ordner `/ (root)` auswählen, speichern.
4. Nach ein bis zwei Minuten ist die Seite erreichbar unter:
   `https://<dein-nutzername>.github.io/<repo-name>/`
   (bzw. direkt unter `https://<dein-nutzername>.github.io/`, falls das Repo
   `<dein-nutzername>.github.io` heißt).

## Easter Egg

Tippe auf einer beliebigen Seite `tines of power` — der sitesweite
Cheat-Code-Listener (`assets/js/main.js`) reagiert mit Donnergeräusch,
Screen-Shake und einem großen Gabeljungen-Overlay.

## Verwendete Web-APIs (Übersicht)

Canvas 2D · requestAnimationFrame · Web Audio API (Oscillator, Noise-Buffer,
BiquadFilter, AnalyserNode) · localStorage · fetch · SpeechSynthesis ·
Clipboard API · Web Share API · IntersectionObserver · matchMedia
(prefers-reduced-motion) · Fullscreen API · Vibration API · Touch Events ·
CSS 3D Transforms.

---

Inoffizielles Fan-Projekt, kein offizielles World's Edge- / Xbox-Game-Studios-Produkt.
