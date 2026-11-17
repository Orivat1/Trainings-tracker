# 006 — Wischen zum Löschen erkennt auch schnelle kurze Wische

- **Status**: DONE
- **Commit**: 9281c95
- **Severity**: LOW
- **Category**: Interruptibility (Gesten)
- **Estimated scope**: 1 Datei (`index.html`), ~10 Zeilen JS, plus `sw.js`-Version

## Problem

Satz oder Übung wird beim Wischen nach links nur gelöscht, wenn mehr als 96 px gezogen wurde. Ein schneller, kurzer Wisch (Flick) federt zurück, obwohl die Absicht klar ist. Native Listen (iOS Mail) werten auch die Geschwindigkeit.

Weil Löschen destruktiv ist, zählt hier nur ein echter Flick: **Geschwindigkeit der letzten ~100 ms über 0,5 px/ms** und mindestens 48 px Weg. Ein langsames Ziehen unter 96 px löscht weiterhin nicht. „Rückgängig“ im Toast fängt Versehen zusätzlich ab.

```js
// index.html:2679-2724 — relevante Teile, aktuell
const SWIPE_DELETE = 96;
let sw = null, dr = null, suppressClick = false;
…
  sw = { el, wrap: el.parentElement, x: e.clientX, y: e.clientY, dx: 0, active: false, id: e.pointerId };
…
  sw.dx = Math.min(0, dx);
  sw.el.style.transform = `translateX(${sw.dx}px)`;
  sw.wrap.classList.toggle('will-delete', sw.dx < -SWIPE_DELETE);
});
function endSwipe() {
  if (!sw) return;
  const s = sw; sw = null;
  if (!s.active) return;
  suppressClick = true; setTimeout(() => { suppressClick = false; }, 60);
  s.el.style.transition = 'transform 200ms cubic-bezier(0.22, 1, 0.36, 1)';
  if (s.dx < -SWIPE_DELETE) {
```

## Target

- In `sw` zusätzlich eine Stichprobe `{ sx, st }` halten (dx und Zeit), die höchstens ~100 ms alt ist.
- In `endSwipe`: Release-Geschwindigkeit `v = (s.sx - s.dx) / Math.max(1, performance.now() - s.st)` (positiv = nach links). Löschen, wenn `s.dx < -SWIPE_DELETE || (s.dx < -48 && v > 0.5)`.

```js
// Ziel — pointerdown
  sw = { el, wrap: el.parentElement, x: e.clientX, y: e.clientY, dx: 0, active: false, id: e.pointerId, sx: 0, st: performance.now() };
// Ziel — pointermove, direkt vor `sw.dx = Math.min(0, dx);`
  const now = performance.now();
  if (now - sw.st > 100) { sw.sx = sw.dx; sw.st = now; }                 // Stichprobe für die Wurf-Geschwindigkeit
// Ziel — endSwipe, vor dem if
  const v = (s.sx - s.dx) / Math.max(1, performance.now() - s.st);       // px/ms nach links in den letzten ~100 ms
  if (s.dx < -SWIPE_DELETE || (s.dx < -48 && v > 0.5)) {
```

## Repo conventions to follow

- Kurze deutsche Zeilenendkommentare wie im übrigen Code.

## Steps

1. `pointerdown`-Handler: Objekt `sw` um `sx: 0, st: performance.now()` erweitern.
2. `pointermove`-Handler: unmittelbar vor `sw.dx = Math.min(0, dx);` die zwei Zeilen aus dem Target einfügen (diese Stelle erreicht man nur, wenn `sw.active` ist).
3. `endSwipe`: vor `if (s.dx < -SWIPE_DELETE) {` die Zeile `const v = …` einfügen und die Bedingung wie im Target ersetzen.
4. `will-delete`-Markierung während des Ziehens unverändert lassen (rot erst ab 96 px).
5. `sw.js`: `CACHE` um eins erhöhen.

## Boundaries

- Löschlogik, `withUndo`, Rückfedern und Zeiten nicht ändern (Kurve/Dauer → Plan 008).
- Weicht der Code vom Zitat ab, STOPP und melden.

## Verification

- **Mechanical**: Keine Konsolenfehler.
- **Feel check** — nur am echten iPhone aussagekräftig:
  - Schneller kurzer Wisch nach links auf einem Satz → Satz gleitet raus, Toast „Satz gelöscht“ mit „Rückgängig“.
  - Langsam 5–6 cm ziehen (unter Rot-Grenze), loslassen → federt zurück.
  - Senkrecht scrollen über die Liste → nichts wird gelöscht.
- **Done when**: Flick löscht, langsames kurzes Ziehen nicht.
