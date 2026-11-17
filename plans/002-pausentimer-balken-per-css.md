# 002 — Pausentimer-Balken per CSS-Transition statt rAF-Schleife

- **Status**: DONE
- **Commit**: 9281c95
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 1 Datei (`index.html`), ~25 Zeilen JS, plus `sw.js`-Version

## Problem

Der 2px-Fortschrittsbalken des Pausentimers wird in einer `requestAnimationFrame`-Schleife jeden Frame per JS neu gesetzt, über die ganze Pause (typisch 90–180 s, viele Male pro Training). Die Bewegung ist vorher bekannt (linear von Restanteil bis 0), das kann der Browser als eine einzige Transition auf dem Compositor erledigen, ohne JS pro Frame. Spart Akku am Handy.

```js
// index.html:4189-4209 — aktuell
function startTimer(sec) {
  stopTimer();
  timer = { end: Date.now() + sec * 1000, total: sec };
  timer.iv = setInterval(tickTimer, 250);
  $('timer-wrap').classList.remove('hidden');
  document.body.classList.add('has-timer');
  tickTimer();
  const frame = () => {
    if (!timer) return;
    const left = Math.max(0, timer.end - Date.now());
    $('timer-bar').style.transform = `scaleX(${Math.min(1, left / (timer.total * 1000))})`;
    timer.raf = requestAnimationFrame(frame);
  };
  frame();
}
function stopTimer() {
  if (timer) { clearInterval(timer.iv); cancelAnimationFrame(timer.raf); }
  timer = null;
  $('timer-wrap').classList.add('hidden');
  document.body.classList.remove('has-timer');
}
```

```js
// index.html:4219-4226 — ±15 s ändern end und total (nicht ändern, nur ergänzen)
document.querySelector('.timer').addEventListener('click', e => {
  const b = e.target.closest('[data-t]'); if (!b || !timer) return;
  if (b.dataset.t === 'skip') return stopTimer();
  const d = +b.dataset.t;
  timer.end = Math.max(Date.now() + 1000, timer.end + d * 1000);
  timer.total = Math.max(timer.total + d, 1);
  tickTimer();
});
```

```css
/* index.html:914 — Balken (nicht ändern) */
.timer-track > i { display: block; height: 100%; background: var(--accent); transform-origin: left center; }
```

## Target

Eine Funktion `syncTimerBar()` setzt den Balken ohne Transition auf den aktuellen Restanteil, erzwingt einen Reflow und startet dann eine lineare Transition auf `scaleX(0)` über die verbleibende Zeit. Sie wird bei Start, bei ±15 s und beim Zurückkehren in die App aufgerufen. Konstante Bewegung → `linear` (Regel: „Constant motion (marquee, progress) → linear“).

Sonderfall „Bewegung reduzieren“: Die globale Regel (`index.html:1181-1186`) setzt `transition-duration: 1ms !important`, damit würde der Balken sofort auf 0 springen. Bei `reduced()` stattdessen den Balken in `tickTimer()` (alle 250 ms) setzen, ohne Transition. Das entspricht der dokumentierten Entscheidung „reduced motion = sofortige Änderung“.

```js
// Ziel
/** Balken einmal setzen und den Rest dem Browser überlassen (keine JS-Arbeit pro Frame) */
function syncTimerBar() {
  if (!timer) return;
  const bar = $('timer-bar'), left = Math.max(0, timer.end - Date.now());
  const ratio = Math.min(1, left / (timer.total * 1000));
  bar.style.transition = 'none';
  bar.style.transform = `scaleX(${ratio})`;
  if (reduced()) return;                 // reduzierte Bewegung: tickTimer setzt den Balken stufenweise
  void bar.offsetWidth;                  // Startwert festschreiben, sonst animiert der Browser vom alten Wert
  bar.style.transition = `transform ${left}ms linear`;
  bar.style.transform = 'scaleX(0)';
}
```

## Repo conventions to follow

- Globale Funktionen, `$()` für `getElementById`, `reduced()` für die Bewegungsabfrage (`index.html:1420`).
- Kommentare auf Deutsch, JSDoc-Stil `/** … */` über Funktionen wie bei `replay()` (`index.html:1629`).

## Steps

1. In `startTimer` den Block `const frame = () => { … }; frame();` ersetzen durch `syncTimerBar();`.
2. In `stopTimer` `cancelAnimationFrame(timer.raf);` entfernen (das `clearInterval` bleibt). Zusätzlich nach `timer = null;` den Balken zurücksetzen: `const bar = $('timer-bar'); bar.style.transition = 'none'; bar.style.transform = '';`
3. Die Funktion `syncTimerBar()` aus „Target“ direkt unter `stopTimer` einfügen.
4. In `tickTimer()` als erste Zeile nach der Berechnung von `left` ergänzen: `if (reduced()) $('timer-bar').style.transform = \`scaleX(${Math.min(1, (timer.end - Date.now()) / (timer.total * 1000))})\`;` — Achtung: `tickTimer` ruft bei Ablauf `stopTimer()` auf; die neue Zeile muss **vor** diesem Aufruf stehen und `timer` existiert dort noch.
5. Im ±15-s-Handler nach `tickTimer();` ergänzen: `syncTimerBar();`
6. Am Ende des Pausentimer-Abschnitts einen Listener ergänzen, damit der Balken nach dem Wechsel aus einer anderen App stimmt:
   `document.addEventListener('visibilitychange', () => { if (!document.hidden) syncTimerBar(); });`
7. `grep -n "timer.raf" index.html` muss leer sein.
8. `sw.js`: `CACHE` um eins erhöhen.

## Boundaries

- Timer-Logik (Ende, Ton, Vibration, Anzeige der Sekunden) nicht ändern.
- CSS nicht ändern.
- Weicht der Code vom Zitat ab, STOPP und melden.

## Verification

- **Mechanical**: Keine Konsolenfehler; `grep -n "requestAnimationFrame(frame)" index.html` leer.
- **Feel check** (Vorschau 390×844, Worker abmelden, Caches leeren, Testdaten laden):
  - Satz abhaken → Timer startet, Balken läuft gleichmäßig von voll nach leer und erreicht 0 genau, wenn die Uhr 0:00 zeigt.
  - +15 drücken → Balken springt auf den neuen Anteil und läuft gleichmäßig weiter, kein Ruckeln.
  - −15 bis kurz vor Ende → Balken springt passend zurück.
  - ✕ → Leiste verschwindet; neuer Timer startet wieder mit vollem Balken.
  - DevTools → Rendering → „prefers-reduced-motion: reduce“: Balken wird alle 250 ms ein Stück kürzer, springt nicht sofort auf 0.
  - Performance-Panel: während der Pause keine JS-Aufrufe pro Frame mehr (nur das 250-ms-Intervall).
- **Done when**: Alle Punkte oben erfüllt, kein rAF mehr im Timer.
