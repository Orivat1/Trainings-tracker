# 007 — `--drag` beim Fensterziehen nicht an den Inhalt vererben

- **Status**: DONE
- **Commit**: 9281c95
- **Severity**: LOW
- **Category**: Performance
- **Estimated scope**: 1 Datei (`index.html`), 1 CSS-Regel, plus `sw.js`-Version

## Problem

Beim Ziehen eines Fensters wird bei jeder Fingerbewegung `--drag` auf dem Hintergrund (`.sheet-backdrop`) gesetzt, um ihn auszublenden. Eigene Eigenschaften (Custom Properties) werden standardmäßig vererbt: Jede Änderung zwingt den Browser, die Stile des **gesamten** Fensterinhalts neu zu berechnen (z. B. lange Übungshistorie, Bericht). Gebraucht wird der Wert nur auf dem Hintergrund selbst. Ob das am Handy spürbar ruckelt, lässt sich aus dem Code nicht sicher sagen; der Fix ist trivial.

```js
// index.html:~4307 — in dragToClose (nicht ändern)
    bg.style.setProperty('--drag', Math.min(1, Math.max(0, off) / sheet.offsetHeight));
```

```css
/* index.html:1009 — Verwendung (nicht ändern) */
.sheet-backdrop[style*="--drag"] { background: color-mix(in srgb, var(--backdrop) calc((1 - var(--drag)) * 100%), transparent); }
```

## Target

`--drag` als nicht vererbende Zahl registrieren. Dann ändert sich nur der Stil des Hintergrunds.

```css
/* Ziel — direkt über der .sheet-backdrop[style*="--drag"]-Regel */
/* Zieh-Fortschritt nur am Hintergrund; nicht vererben, sonst rechnet der Browser bei jeder Bewegung den ganzen Fensterinhalt neu */
@property --drag { syntax: '<number>'; inherits: false; initial-value: 0; }
```

## Repo conventions to follow

- CSS im `<style>`-Block von `index.html`, deutscher Kommentar über der Regel.

## Steps

1. In `index.html` direkt über `.sheet-backdrop[style*="--drag"] { … }` die zwei Zeilen aus dem Target einfügen.
2. Sonst nichts ändern.
3. `sw.js`: `CACHE` um eins erhöhen.

## Boundaries

- JS nicht ändern.
- Weicht der Code vom Zitat ab, STOPP und melden.

## Verification

- **Mechanical**: Keine Konsolenfehler. Während ein Fenster gezogen wird, in der Konsole `getComputedStyle(document.querySelector('.sheet')).getPropertyValue('--drag')` → `0` (wird nicht mehr vom Hintergrund geerbt).
- **Feel check** (Vorschau 390×844; endgültig am iPhone):
  - Fenster öffnen und langsam nach unten ziehen → Hintergrund wird mit dem Ziehen heller/durchsichtiger wie bisher.
  - Loslassen ohne zu schließen → Hintergrund ist wieder voll abgedunkelt.
  - DevTools → Performance beim Ziehen: „Recalculate Style“ betrifft nur noch wenige Elemente.
- **Done when**: Verhalten unverändert, Regel vorhanden.
