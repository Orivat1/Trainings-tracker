# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Serious strength lifters: experienced people who train with progressive overload, track their numbers closely and want to see them move. The main situation is a phone in the gym — between sets, short rest, sweaty hands, one-handed — plus a few minutes after a workout or at the end of the week to review progress.

Today the only real user is the author; the product is meant to become a public app for other lifters.

## Product Purpose

A workout log (German name: Trainings-Tracker) for recording sets, reps and weights for each exercise, then turning that history into progress the lifter can act on. Success: logging a set takes seconds and never slows down a workout, and the review screens tell the lifter something true and useful about their training.

## Positioning

Three things together set it apart from an ordinary workout log:

1. **Fast logging mid-set.** Entering reps and kg, ticking sets off, a "Vorher" (last time) column and a rest timer are tuned for speed during a set.
2. **Evidence-based insights.** Weekly report, Sunday "Wochenabschluss" against the 4-week average, PR detection, progress charts, muscle heatmap and year review. Tips cite guidelines and studies (e.g. ACSM, Schoenfeld, Pelland) instead of generic fitness advice.
3. **Premium feel.** It should feel as polished as a paid app and be motivating to open.

## Operating Context

- Installed as a PWA on the phone home screen and used offline-capable in the gym. Desktop (sidebar layout ≥960px) is secondary.
- One workout = a list of exercises, each with sets (reps, weight in kg, done). Exercises are matched by name.
- Rituals: log during the session → finish workout → Leistungsbericht (per-exercise comparison) → weekly wrap-up on Sunday (with grace on Mon/Tue) → occasional backup export.

## Capabilities and Constraints

- **Currently built:** workouts/exercises/sets, previous-values column, rest timer, PR detection and "Rekord-Jagd" hint, workout duration and report, swipe to delete, drag to reorder, undo toasts, weekly report and wrap-up with sourced tips, exercise progress chart, muscle heatmap (automatic + manual mapping), training calendar, year review, tonnage comparisons, backup export/share and import with validation (import replaces data), backup reminder after 14 days, system/light/dark theme.
- **Language:** UI is German for now; other languages may come later.
- **Stack today:** a single `index.html` (HTML/CSS/JS, no build) plus `sw.js` and `manifest.json`, deployed to GitHub Pages. Build tools or a framework are allowed if the work needs them.
- **Data today:** stored only in the browser (localStorage), no account or server; backup through file export/import.
- **Open decisions:** whether accounts, a server or cloud sync come with the public launch; how exercises get stable IDs or a shared exercise library; languages beyond German.

## Brand Commitments

- Name: Trainings-Tracker (home-screen title "Training").
- Voice: German, direct, gym-literate; insights are backed by named sources.
- The current visual system ("Kreide & Gusseisen") is the incumbent design but **not** binding — it may be replaced in a redesign.

## Evidence on Hand

- No real users other than the author, and no testimonials, ratings, press or usage numbers. Do not invent any.
- Study and guideline citations used in the weekly tips live in `index.html`.
- App icons in `icons/`.

## Product Principles

1. **Never slow down a set.** Every logging interaction is measured against a lifter with 90 seconds of rest and sweaty hands.
2. **Numbers that mean something.** Show progress only where it is accurate and actionable; back advice with sources.
3. **Built for lifters who know what they're doing.** Respect training vocabulary and depth; don't over-explain the basics.
4. **Premium through precision.** Polish shows in speed, clarity and detail, not decoration.
5. **The lifter's data is theirs.** Keep backup and export reliable; never lose a workout.
