# Animations-Pläne

Aus dem Animations-Audit vom 17.11.2026 (Commit `9281c95`). Jeder Plan ist in sich vollständig und kann einzeln von einem Agenten umgesetzt werden. Nach jeder Umsetzung: `CACHE` in `sw.js` erhöhen, in Handygröße testen, auf Deutsch committen, auf `main` pushen (siehe `CLAUDE.md`).

| # | Titel | Schwere | Status |
|---|---|---|---|
| 001 | [Live-Punkt ohne Endlos-Pulsieren](001-live-punkt-ohne-schleife.md) | MEDIUM | DONE |
| 002 | [Pausentimer-Balken per CSS-Transition](002-pausentimer-balken-per-css.md) | MEDIUM | DONE |
| 003 | [Kennzahlen nur einmal hochzählen](003-hochzaehlen-nur-einmal.md) | MEDIUM | DONE |
| 004 | [Fenster schließen bei lockerem Wisch](004-fenster-wischen-schwelle.md) | MEDIUM | DONE |
| 005 | [Seitenwechsel kürzer](005-seitenwechsel-kuerzer.md) | MEDIUM | DONE |
| 006 | [Wischen zum Löschen erkennt Flick](006-wischen-loeschen-flick.md) | LOW | DONE |
| 007 | [`--drag` nicht vererben](007-drag-variable-nicht-vererben.md) | LOW | DONE |
| 008 | [Tour-Spot per transform, Tokens beim Wischen](008-tour-spot-transform-und-tokens.md) | LOW | DONE |

## Empfohlene Reihenfolge

1. **001, 003, 005, 007**: je eine bis wenige Zeilen, voneinander unabhängig, in der Vorschau prüfbar. Können zusammen in einem Durchgang erledigt werden.
2. **002**: etwas mehr JS (Timer), in der Vorschau gut prüfbar.
3. **004, 006**: Gesten; die Schwellen sind nur am echten iPhone sinnvoll zu beurteilen. Nach dem Push am Handy testen und Schwellen bei Bedarf nachjustieren.
4. **008**: zuletzt (selten genutzt).

## Abhängigkeiten

- **006 und 008** ändern beide `endSwipe()` (`index.html:~2705-2724`), aber unterschiedliche Zeilen (006: Bedingung, 008: Transition-Zeile). Nacheinander umsetzen, nicht parallel.
- **004 und 007** betreffen beide das Fensterziehen, aber verschiedene Stellen (JS vs. CSS). Unabhängig.
- Alle anderen Pläne sind unabhängig.
