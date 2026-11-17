# 003 — Kennzahlen auf „Training“ nur einmal pro App-Start hochzählen

- **Status**: DONE
- **Commit**: 9281c95
- **Severity**: MEDIUM
- **Category**: Purpose & frequency
- **Estimated scope**: 1 Datei (`index.html`), 2 Zeilen JS, plus `sw.js`-Version

## Problem

Bei **jeder** Rückkehr auf den Tab „Training“ (nach jedem Workout, jedem Blick in Fortschritt/Einstellungen) zählen die Kennzahlen 700 ms von 0 hoch. Das passiert viele Male am Tag; beim fünften Mal ist es keine Information mehr, sondern Warten auf die Zahl. `DESIGN.md` beschreibt das Hochzählen nur für Berichte: „key figures count up when a report opens“.

```js
// index.html:1621-1627 — aktuell (in show())
  if (from !== view) {
    const el = $('v-' + view);
    el.classList.remove('from-left', 'from-right');
    if (from) el.classList.add(VIEW_ORDER[view] > VIEW_ORDER[from] ? 'from-right' : 'from-left');
    replay(el, 'is-entering', 500);
    if (view === 'home') countUp(el.querySelector('.metrics'));
  }
```

```js
// index.html:4258 — Berichte (bleibt unverändert)
  countUp(bg);
```

## Target

Die Startseiten-Kennzahlen zählen genau einmal hoch: beim ersten Anzeigen nach dem App-Start. Danach stehen die Zahlen sofort da. Berichte zählen weiterhin jedes Mal hoch (selten, ein „Moment“).

```js
// Ziel (in show())
    if (view === 'home' && !homeCounted) { homeCounted = true; countUp(el.querySelector('.metrics')); }
```

```js
// Ziel (direkt über function show)
let homeCounted = false;   // Kennzahlen zählen nur beim ersten Öffnen nach dem Start hoch
```

## Repo conventions to follow

- Modul-Variablen stehen als `let` direkt über der Funktion, die sie nutzt (Beispiel `let liveTimer = null;` über `render()`, `index.html:~1650`).

## Steps

1. Direkt über `function show(view) {` die Zeile `let homeCounted = false;   // Kennzahlen zählen nur beim ersten Öffnen nach dem Start hoch` einfügen.
2. In `show()` die Zeile `if (view === 'home') countUp(el.querySelector('.metrics'));` ersetzen durch `if (view === 'home' && !homeCounted) { homeCounted = true; countUp(el.querySelector('.metrics')); }`.
3. `countUp` selbst und den Aufruf `countUp(bg)` nicht ändern.
4. `sw.js`: `CACHE` um eins erhöhen.

## Boundaries

- Nur diese zwei Stellen. Kein Ändern von `countUp`.
- Weicht der Code vom Zitat ab, STOPP und melden.

## Verification

- **Mechanical**: Keine Konsolenfehler beim Laden.
- **Feel check** (Vorschau 390×844, Worker abmelden, Caches leeren, Testdaten laden):
  - App neu laden → Kennzahlen zählen einmal hoch.
  - Zu „Fortschritt“ und zurück → Zahlen stehen sofort da.
  - Workout starten und beenden → Bericht zählt weiterhin hoch; danach zurück auf „Training“ → Zahlen stehen sofort.
- **Done when**: Hochzählen auf der Startseite nur nach dem Laden der App.
