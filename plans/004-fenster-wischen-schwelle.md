# 004 — Fenster schließen schon bei lockerem Runterwischen

- **Status**: DONE
- **Commit**: 9281c95
- **Severity**: MEDIUM
- **Category**: Interruptibility (Gesten)
- **Estimated scope**: 1 Datei (`index.html`), ~6 Zeilen JS, plus `sw.js`-Version

## Problem

Ein Fenster (Sheet) schließt beim Loslassen nur, wenn es über 25 % seiner Höhe gezogen wurde oder mit mehr als **0,5 px/ms** (500 px/s) geflickt wurde. Ein normales, lockeres Runterwischen liegt deutlich darunter, das Fenster federt zurück und man muss nochmal wischen. Übliche Schwelle für „Fling“: Strecke / Zeit > **~0,11 px/ms**.

Zweites Problem: Die Geschwindigkeit wird über die ganze Geste gemittelt, auch wenn der Finger am Ende wieder nach oben zieht (Nutzer will abbrechen). Dann darf es nicht schließen.

```js
// index.html:4279-4321 — relevante Teile, aktuell
  let y0 = 0, t0 = 0, dy = 0, inBody = false, dragging = false, tracking = false;
  …
  sheet.addEventListener('touchmove', e => {
    if (!tracking) return;
    dy = e.touches[0].clientY - y0;
    …
    e.preventDefault();
    const off = dy > 0 ? dy : dy / 4;                                                // nach oben nur mit Widerstand
    sheet.style.transform = `translateY(${off}px)`;
    bg.style.setProperty('--drag', Math.min(1, Math.max(0, off) / sheet.offsetHeight));
  }, { passive: false });
  const end = () => {
    if (!tracking) return;
    tracking = false;
    if (!dragging) return;
    dragging = false;
    sheet.classList.remove('is-dragging');
    const v = dy / Math.max(1, performance.now() - t0);
    if (dy > sheet.offsetHeight * 0.25 || (dy > 40 && v > 0.5)) {
      sheet.style.transform = 'translateY(100%)';
      closeSheet();
    } else {
      sheet.style.transform = '';
      bg.style.removeProperty('--drag');
    }
  };
```

## Target

- Fling-Schwelle `v > 0.11` (px/ms, Durchschnitt seit Fingerauflage, wie bisher berechnet), Mindeststrecke 40 px bleibt.
- Zusätzlich: Hat sich der Finger in der letzten Bewegung nach oben bewegt, wird der Fling nicht gewertet (die 25-%-Regel gilt weiter).

```js
// Ziel — Variablen
  let y0 = 0, t0 = 0, dy = 0, lastDy = 0, inBody = false, dragging = false, tracking = false;
// Ziel — in touchmove, als erste Zeile nach `if (!tracking) return;`
    lastDy = dy;
// Ziel — in end()
    const v = dy / Math.max(1, performance.now() - t0);
    const goingDown = dy >= lastDy;                                                  // am Ende nicht wieder hochgezogen
    if (dy > sheet.offsetHeight * 0.25 || (dy > 40 && v > 0.11 && goingDown)) {
```

Im `touchstart`-Handler `lastDy = 0;` neben `dy = 0;` setzen.

## Repo conventions to follow

- Kommentare auf Deutsch am Zeilenende, ausgerichtet wie die vorhandenen (`// nach oben nur mit Widerstand`).

## Steps

1. Variablen-Zeile in `dragToClose` um `lastDy = 0` erweitern (siehe Target).
2. In `touchstart` nach `dy = 0;` ergänzen: `lastDy = 0;`.
3. In `touchmove` direkt nach `if (!tracking) return;` die Zeile `lastDy = dy;` einfügen (vor der Neuberechnung von `dy`).
4. In `end()` die Bedingung wie im Target ersetzen und die Zeile `const goingDown = …` davor einfügen.
5. `sw.js`: `CACHE` um eins erhöhen.

## Boundaries

- Nichts an Scroll-Erkennung, `preventDefault`, Widerstand nach oben oder `closeSheet` ändern.
- Weicht der Code vom Zitat ab, STOPP und melden.

## Verification

- **Mechanical**: Keine Konsolenfehler.
- **Feel check** — nur auf dem echten iPhone aussagekräftig (Touch-Gesten lassen sich in der Emulation nicht beurteilen):
  - Ein Fenster öffnen (z. B. „Neues Workout“), mit lockerem kurzem Wisch nach unten → schließt.
  - Langsam 2–3 cm ziehen und wieder hochschieben, loslassen → federt zurück, schließt nicht.
  - Im Inhalt scrollen (Fenster mit langer Liste) → scrollt normal, schließt nicht.
- **Done when**: Lockeres Runterwischen schließt, Abbrechen per Hochziehen funktioniert.
