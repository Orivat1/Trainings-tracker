# 008 — Tour-Lichtkegel per transform bewegen, Wisch-Animation über Tokens

- **Status**: DONE
- **Commit**: 9281c95
- **Severity**: LOW
- **Category**: Performance / Cohesion & tokens
- **Estimated scope**: 1 Datei (`index.html`), 3 CSS-Regeln + 2 JS-Zeilen, plus `sw.js`-Version

## Problem

**A — Tour-Lichtkegel.** Zwischen den Schritten der Einführung gleitet der Lichtkegel über `left`, `top`, `width`, `height` (Layout-Eigenschaften, 300 ms). Die Position lässt sich per `transform` auf dem Compositor bewegen; Breite und Höhe bleiben (ein Skalieren würde die Rundung verzerren). Selten genutzt, daher LOW.

```css
/* index.html:583-588 — aktuell */
.tour-spot {
  position: fixed; border-radius: var(--r-lg); pointer-events: none;
  box-shadow: 0 0 0 2px var(--accent), 0 0 0 9999px var(--backdrop-strong, var(--backdrop));
  transition: left 300ms var(--ease-out), top 300ms var(--ease-out), width 300ms var(--ease-out), height 300ms var(--ease-out), box-shadow var(--dur) var(--ease-out);
}
.tour.no-target .tour-spot { left: 50% !important; top: 40% !important; width: 0 !important; height: 0 !important; box-shadow: 0 0 0 9999px var(--backdrop-strong, var(--backdrop)); }
```

```js
// index.html:~4043 — in tourPlace(), aktuell
  Object.assign(spot.style, { left: `${r.left - pad}px`, top: `${r.top - pad}px`, width: `${r.width + pad * 2}px`, height: `${h + pad * 2}px` });
```

**B — Fest eingetippte Werte.** Beim Wischen zum Löschen sind Kurve und Dauer als Literal im JS statt über die Tokens `--ease-out` / `--dur`:

```js
// index.html:2711 — aktuell
  s.el.style.transition = 'transform 200ms cubic-bezier(0.22, 1, 0.36, 1)';
```

## Target

**A**
```css
/* Ziel */
.tour-spot {
  position: fixed; left: 0; top: 0; border-radius: var(--r-lg); pointer-events: none;
  box-shadow: 0 0 0 2px var(--accent), 0 0 0 9999px var(--backdrop-strong, var(--backdrop));
  transition: transform 300ms var(--ease-out), width 300ms var(--ease-out), height 300ms var(--ease-out), box-shadow var(--dur) var(--ease-out);
}
.tour.no-target .tour-spot { transform: translate(50vw, 40vh) !important; width: 0 !important; height: 0 !important; box-shadow: 0 0 0 9999px var(--backdrop-strong, var(--backdrop)); }
```
```js
// Ziel — tourPlace()
  Object.assign(spot.style, { transform: `translate(${r.left - pad}px, ${r.top - pad}px)`, width: `${r.width + pad * 2}px`, height: `${h + pad * 2}px` });
```

**B**
```js
// Ziel
  s.el.style.transition = 'transform var(--dur) var(--ease-out)';
```
(`--dur` = 200ms, `--ease-out` = `cubic-bezier(0.22, 1, 0.36, 1)`: identische Werte, nur über die Tokens.)

## Repo conventions to follow

- Motion-Tokens oben in `index.html`: `--dur-fast: 150ms; --dur: 200ms; --dur-slow: 250ms; --ease-out: cubic-bezier(0.22, 1, 0.36, 1);`.
- Beispiel für Token-Nutzung: `.toast { transition: opacity var(--dur) var(--ease-out), transform var(--dur) var(--ease-out); }` (`index.html:~1143`).

## Steps

1. `.tour-spot`-Regel wie im Target A ersetzen (`left: 0; top: 0;` ergänzen, `left`/`top` aus der Transition nehmen, `transform` hinzufügen).
2. `.tour.no-target .tour-spot`-Regel wie im Target A ersetzen.
3. In `tourPlace()` die `Object.assign(spot.style, …)`-Zeile wie im Target A ersetzen.
4. `grep -n "spot.style\|tour-spot" index.html` — falls irgendwo sonst `left`/`top` auf den Spot gesetzt werden, STOPP und melden.
5. In `endSwipe` die Transition-Zeile wie im Target B ersetzen.
6. `sw.js`: `CACHE` um eins erhöhen.

## Boundaries

- Tour-Inhalte, Kartenposition und Schrittlogik nicht ändern.
- Wischlogik nicht ändern (nur die eine Zeile).
- Weicht der Code vom Zitat ab, STOPP und melden.

## Verification

- **Mechanical**: Keine Konsolenfehler.
- **Feel check** (Vorschau 390×844, Worker abmelden, Caches leeren, Testdaten laden):
  - Einstellungen → Hilfe → „Einführung in die App“; alle Schritte durchtippen → Lichtkegel gleitet weich zum nächsten Ziel und liegt exakt auf dem Element (inkl. Körperkarte).
  - Schritte ohne Ziel → Abdunklung über den ganzen Bildschirm, kein Rest-Rahmen sichtbar.
  - Fenstergröße ändern während der Tour → Spot sitzt danach wieder richtig.
  - Satz wegwischen und einen zurückfedern lassen → Bewegung unverändert.
- **Done when**: Spot positioniert per `transform`, keine `left`/`top`-Transition mehr, Wisch-Transition nutzt Tokens.
