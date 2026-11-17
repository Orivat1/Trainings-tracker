# 001 — Live-Punkt im Workout-Kopf ohne Endlos-Pulsieren

- **Status**: DONE
- **Commit**: 9281c95
- **Severity**: MEDIUM
- **Category**: Cohesion & tokens / Purpose & frequency
- **Estimated scope**: 1 Datei (`index.html`), 1 Zeile CSS, plus `sw.js`-Version

## Problem

Der kleine Ember-Punkt neben der laufenden Workout-Uhr pulsiert endlos, solange das Workout offen ist (also 60–90 Minuten am Stück, im Blickfeld oben im Workout-Kopf). `DESIGN.md` legt fest: „Nothing loops“ und „Don't add looping or decorative motion“. Dazu läuft die Animation die ganze Zeit auf dem Handy im Gym (Akku).

```css
/* index.html:555-556 — aktuell */
.live-dot { position: relative; width: 8px; height: 8px; border-radius: 50%; background: var(--accent); }
.live-dot::after { content: ""; position: absolute; inset: 0; border-radius: 50%; background: var(--accent); animation: pulse 1.8s var(--ease-out) infinite; }
```

```js
// index.html:2177 — Verwendung (nicht ändern)
? `<span class="live-dot" aria-hidden="true"></span><span>${fmtClock(Date.now() - w.startedAt)}</span><span class="sr-only">Workout läuft</span>`
```

## Target

Der Punkt steht still. Die tickende Uhr daneben zeigt bereits, dass das Workout läuft.

```css
/* Ziel */
.live-dot { position: relative; width: 8px; height: 8px; border-radius: 50%; background: var(--accent); }
```

Die Zeile `.live-dot::after { … }` entfällt komplett.

## Repo conventions to follow

- CSS lebt in `index.html` im `<style>`-Block, Kommentare auf Deutsch.
- `@keyframes pulse` (`index.html:1164`) bleibt stehen, falls es noch woanders genutzt wird: vorher mit `grep -n "pulse" index.html` prüfen. Wird es nirgends sonst genutzt, die Keyframe-Zeile ebenfalls löschen.

## Steps

1. In `index.html` die Zeile `.live-dot::after { content: ""; … animation: pulse 1.8s var(--ease-out) infinite; }` löschen.
2. `grep -n "pulse" index.html` ausführen. Kommt `pulse` nur noch in `@keyframes pulse { … }` vor, diese Zeile löschen.
3. In `sw.js` `const CACHE = 'training-vNN'` um eins erhöhen.

## Boundaries

- Markup in Zeile 2177 nicht ändern.
- Keine anderen Animationen anfassen.
- Weicht der Code vom Zitat ab, STOPP und melden.

## Verification

- **Mechanical**: `grep -n "infinite" index.html` zeigt nur noch den Lade-Spinner (`spin 700ms linear infinite`).
- **Feel check**: Vorschau in 390×844, Service Worker abmelden und Caches leeren, Workout starten. Der Punkt neben der Uhr ist ein ruhiger Ember-Punkt, nichts bewegt sich außer den Ziffern.
- **Done when**: Kein `infinite` mehr außer dem Spinner, Punkt sichtbar und statisch.
