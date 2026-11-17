# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Trainings-Tracker: a German-language workout log PWA for strength lifters, used mainly as an installed app on an iPhone in the gym. No build, no framework, no dependencies, no tests. The whole app is `index.html` (CSS + HTML + JS in one file, ~4,400 lines). `sw.js` is the service worker, `manifest.json` the PWA manifest, `fonts/` the self-hosted Geist/Geist Mono woff2 files, `icons/` the app icons (referenced with `?v=2`).

Product context lives in `PRODUCT.md`, the visual system ("Kreide & Gusseisen") in `DESIGN.md` plus its sidecar `.impeccable/design.json`. Read `DESIGN.md` before any UI change; both docs are maintained with the Impeccable skill (`/impeccable document` refreshes them, `/impeccable doctor` checks drift).

## Release workflow (push = deploy)

- `main` is deployed to GitHub Pages (github.com/Orivat1/Trainings-tracker) on every push. There is no staging.
- After **every** change to app files: bump `CACHE` in `sw.js` (`training-vNN`), commit with a short German message, push to `main` without asking. Several sessions push to `main` in parallel (often from git worktrees), so on a rejected push run `git fetch origin && git rebase origin/main` and push again.
- Docs-only commits (`DESIGN.md`, `.impeccable/`, this file) don't need a cache bump.

## Running and testing locally

The machine has no Node and no Python. The local server is a small PowerShell `HttpListener` script configured in `.claude/launch.json` (gitignored, path differs per checkout). Start it through the preview tools (`preview_start` with the config name), never via Bash.
- `tracker` → port 8765. This port is often already held by another session's server serving the main checkout; the config may then just attach to that URL.
- `tracker-worktree` → port 8766, serves the current worktree. Use it to test changes before pushing.

Testing rules:
- Always test at phone size (e.g. 390×844) in the preview browser.
- Test data only ever goes into the preview browser's localStorage, never into the user's real app. `training-backup-testdaten.json` (untracked) holds 46 seeded workouts that can be loaded via `fetch('/training-backup-testdaten.json')` into localStorage. Back up the preview data in `sessionStorage` before destructive tests and restore it afterwards.
- The service worker is offline-first: a plain reload serves the **old** cached `index.html`. Before checking a change, unregister the worker and clear caches in the page (`navigator.serviceWorker.getRegistrations()` → `unregister()`, `caches.keys()` → `caches.delete()`), then reload.
- App functions are globals, so behavior can be tested directly from `javascript_tool` (e.g. `weekWrap(mon)`, `stagnation(ex, w)`, `sanitizeData(raw)`).

## Architecture of index.html

The file is organized in banner-commented sections (`/* ==== Name ==== */`): CSS tokens and components first, then static HTML for the four views, then JS sections (Daten, Helfer, Navigation, Training, Übungs-Bibliothek, Routinen, Workout, Fortschritt, Wochenbericht, Wochenabschluss, Muskel-Heatmap, Kalender, Jahresrückblick, Einstellungen, Einführung, Backup, Pausentimer, Sheet/Toast, Start).

**Data.** Everything lives in one object `data`, persisted as JSON under localStorage key `trainings-tracker-v1`:
`{ workouts: [{ id, created, name, date, startedAt?, finishedAt?, lastAt?, autoFinished?, routine?, exercises: [{ name, goal?, note?, rest?, sets: [{ reps, weight, done, warm? }] }] }], settings, muscleMap, routines: [{ id, name, exercises: [{ name, sets, reps }] }] }`.
- `load()` always passes stored data through `sanitizeData()`, which is a strict whitelist (also used for backup import). **Any new field must be added to `sanitizeData()` or it is silently dropped** on the next load or import.
- `save()` writes the whole object and filters out workouts flagged `tour: true` (the demo workout of the guided tour).

**Exercises have no IDs.** They are matched by name through `exKey()` (trimmed, lowercased, whitespace-collapsed) everywhere: history, records, stagnation, muscle map, routines. Renaming or merging (`renameExercise()`) rewrites names across all workouts, routines and `muscleMap`. Use `exKey()` for any new name comparison; never compare raw names.

**Which sets count.** Statistics go through `workSets(w, ex)`: warm-up sets (`warm: true`) never count, and once a workout has any ticked set only ticked sets count (`onlyDone`). `workCount`, `workReps`, `volume`, `exBest`, `prInfo`, `huntText` and the weekly stats build on this; keep new statistics on the same helpers.

**Rendering.** `state.view` is one of `home | progress | more | workout`. `show(view)` toggles the view sections, runs the view's render function (`renderHome`, `renderProgress`, `renderMore`, `renderWorkout`) via `render()`, and plays the directional entrance animation only when the view actually changes. Render functions rebuild their section with template strings and `innerHTML`; all user text must go through `esc()`. Event handling is delegated per view via `data-act` / `data-*` attributes. Inside a workout, `renderExercises()` rebuilds the exercise list (it restores focus itself); live typing only updates via `renderProgressBlock()` / `updatePR()` so inputs aren't re-rendered.

**Sheets and toasts.** `openSheet(title, html, { full })` returns the sheet body. It locks background scroll (`lockScroll`) and adds drag-to-close (`dragToClose`). `closeSheet()` undoes both. Destructive actions use `withUndo()` / `withLibraryUndo()`, which snapshot data and offer "Rückgängig" in a toast.

**Domain logic worth knowing.**
- `suggestions()` picks the next workout from weekday habit, plan order and recency.
- `startWorkout()` prefers a same-named routine (`workoutFromRoutine()`) over copying the last workout.
- `weekStats()` / `weekWrap()` compare a week with the 4-week average and generate evidence-based tips with sources (`SRC`). Pass week starts explicitly: `weekStats(mon, span)` has a second parameter, so don't use it as a bare `.map` callback.
- Estimated 1RM uses Epley (`e1rm()`, ≤12 reps). Stagnation (`stagnation()` in a workout, `stagnant` in `weekWrap`) means no e1RM gain over three training weeks.
- `autoFinishStale()` ends workouts forgotten for 2 h, dated to the last activity.

**Service worker and updates.** `sw.js` is offline-first: it serves from cache and revalidates in the background, and precaches the app shell and fonts (new static assets must be added to its `FILES` list). On a new version the page reloads only when `calm()` (not in a workout, no sheet, no tour, no focused input); otherwise `applyUpdate()` retries after leaving the workout or closing a sheet.

## Conventions

- UI copy is German: direct, gym-literate, no exclamation-heavy marketing. Code comments are German too.
- Styling only through the CSS custom properties at the top of `index.html`, in both themes (dark default; light via `prefers-color-scheme` and `[data-theme="light"]`). One accent color (ember orange) only. 44px minimum touch targets, 16px minimum input font size (iOS zoom).
- Number formatting goes through the cached `Intl` helpers (`num`, `dfmt`, `fmtr`), not `toLocaleString` in loops (a measured performance issue on phones).
- Every animation must degrade under `prefers-reduced-motion`. There is a global reduced-motion rule, and JS motion checks `reduced()`.
- New icons are added to the inline icon map as Lucide-style SVG paths (1.75px stroke).
