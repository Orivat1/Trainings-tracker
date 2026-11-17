# 005 — Seitenwechsel kürzer: 220 ms, Versatz höchstens 90 ms

- **Status**: DONE
- **Commit**: 9281c95
- **Severity**: MEDIUM
- **Category**: Easing & duration
- **Estimated scope**: 1 Datei (`index.html`), 6 Zeilen CSS, plus `sw.js`-Version

## Problem

Bei jedem Tab-Wechsel gleiten die Abschnitte der Ansicht 300 ms herein, versetzt um bis zu 150 ms: Der letzte Abschnitt ist erst nach 450 ms da und bis zu 150 ms komplett unsichtbar (`both` hält `opacity: 0` während der Verzögerung). Tab-Wechsel passieren oft; UI-Animationen sollen unter 300 ms bleiben. Die Richtung und das Gleiten selbst sind in `DESIGN.md` festgelegt und bleiben.

```css
/* index.html:1166-1176 — aktuell */
/* Seitenwechsel: Abschnitte gleiten aus der Richtung des Tabs herein, leicht versetzt */
.view.is-entering > * { animation: view-in 300ms var(--ease-out) both; }
.view.is-entering > :nth-child(2) { animation-delay: 30ms; }
.view.is-entering > :nth-child(3) { animation-delay: 60ms; }
.view.is-entering > :nth-child(4) { animation-delay: 90ms; }
.view.is-entering > :nth-child(5) { animation-delay: 120ms; }
.view.is-entering > :nth-child(n+6) { animation-delay: 150ms; }
.view.is-entering { --dx: 0px; }
.view.from-right { --dx: 24px; }
.view.from-left { --dx: -24px; }
@keyframes view-in { from { opacity: 0; transform: translate3d(var(--dx), 6px, 0); } to { opacity: 1; transform: none; } }
```

```js
// index.html:1625 — Klasse wird 500 ms gehalten (passt weiter, nicht ändern)
    replay(el, 'is-entering', 500);
```

## Target

```css
/* Ziel */
/* Seitenwechsel: Abschnitte gleiten aus der Richtung des Tabs herein, leicht versetzt (gesamt ≤ 310 ms) */
.view.is-entering > * { animation: view-in 220ms var(--ease-out) both; }
.view.is-entering > :nth-child(2) { animation-delay: 30ms; }
.view.is-entering > :nth-child(3) { animation-delay: 60ms; }
.view.is-entering > :nth-child(n+4) { animation-delay: 90ms; }
.view.is-entering { --dx: 0px; }
.view.from-right { --dx: 24px; }
.view.from-left { --dx: -24px; }
@keyframes view-in { from { opacity: 0; transform: translate3d(var(--dx), 6px, 0); } to { opacity: 1; transform: none; } }
```

Kurve bleibt `var(--ease-out)` = `cubic-bezier(0.22, 1, 0.36, 1)` (Token in `index.html` oben, `--ease-out`).

## Repo conventions to follow

- Dauern als Tokens: `--dur-fast: 150ms; --dur: 200ms; --dur-slow: 250ms;`. 220 ms liegt bewusst dazwischen und wird wie die bisherigen 300 ms als Literal geschrieben.

## Steps

1. In `index.html` die sechs Zeilen von `.view.is-entering > * {` bis `.view.is-entering > :nth-child(n+6) { … }` durch die vier Zeilen aus dem Target ersetzen. Kommentarzeile darüber wie im Target anpassen.
2. `--dx`-Zeilen und `@keyframes view-in` unverändert lassen.
3. `sw.js`: `CACHE` um eins erhöhen.

## Boundaries

- `replay(el, 'is-entering', 500)` nicht ändern (500 ms > 310 ms, reicht).
- Richtung, Versatzweg (24 px / 6 px) und Kurve nicht ändern.
- Weicht der Code vom Zitat ab, STOPP und melden.

## Verification

- **Mechanical**: Keine Konsolenfehler.
- **Feel check** (Vorschau 390×844, Worker abmelden, Caches leeren, Testdaten laden):
  - Zwischen „Training“, „Fortschritt“, „Einstellungen“ wechseln → Inhalte kommen aus der richtigen Richtung, spürbar schneller, keine leeren Bereiche unten.
  - DevTools → Animations-Panel auf 10 %: letzter Abschnitt startet nach 90 ms, alles ist nach ~310 ms fertig.
- **Done when**: Gesamtdauer ≤ 310 ms, Richtung unverändert.
