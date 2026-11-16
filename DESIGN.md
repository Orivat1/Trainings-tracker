---
name: Trainings-Tracker
description: Workout log for serious lifters — warm graphite, one ember accent, numbers first.
colors:
  ember: "#f0824c"
  ember-hover: "#f59362"
  ember-press: "#e2733e"
  ember-ink: "#1d0f07"
  ember-light: "#b8440f"
  ember-light-hover: "#a33b0b"
  ember-light-press: "#923409"
  ember-light-ink: "#fffaf6"
  cast-iron: "#121110"
  iron-plate: "#1a1917"
  iron-well: "#23211e"
  iron-raised: "#1f1d1b"
  chalk: "#f3f0ea"
  chalk-dust: "#aca69d"
  chalk-faint: "#918b81"
  chalk-paper: "#f6f5f2"
  chalk-card: "#fdfcfa"
  chalk-well: "#f0eee9"
  graphite-ink: "#1c1a17"
  graphite-mid: "#5e5952"
  graphite-faint: "#6f6a63"
  sage: "#86c49a"
  sage-light: "#2f7d4a"
  rose: "#ee8295"
  rose-light: "#b23a56"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "0.06em"
  numeric:
    fontFamily: "Geist Mono, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.25
    fontFeature: "tnum"
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
  full: "999px"
spacing:
  s-1: "4px"
  s-2: "8px"
  s-3: "12px"
  s-4: "16px"
  s-5: "20px"
  s-6: "24px"
  s-8: "32px"
  s-10: "40px"
  s-12: "48px"
components:
  button-primary:
    backgroundColor: "{colors.ember}"
    textColor: "{colors.ember-ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "44px"
  button-primary-press:
    backgroundColor: "{colors.ember-press}"
  button-secondary:
    backgroundColor: "{colors.iron-plate}"
    textColor: "{colors.chalk}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "44px"
  button-ghost:
    textColor: "{colors.chalk-dust}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "44px"
  card:
    backgroundColor: "{colors.iron-plate}"
    rounded: "{rounded.lg}"
    padding: "16px"
  input:
    backgroundColor: "{colors.iron-well}"
    textColor: "{colors.chalk}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "48px"
  set-number-input:
    backgroundColor: "{colors.iron-well}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.sm}"
    height: "44px"
  check-button-done:
    backgroundColor: "{colors.ember}"
    textColor: "{colors.ember-ink}"
    rounded: "{rounded.sm}"
    size: "44px"
  chip:
    textColor: "{colors.chalk-dust}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    padding: "0 12px"
    height: "36px"
  chip-selected:
    textColor: "{colors.ember}"
  nav-item-active:
    textColor: "{colors.chalk}"
    rounded: "{rounded.md}"
---

# Design System: Trainings-Tracker

## Overview

**Creative North Star: "Kreide & Gusseisen"** (chalk & cast iron)

The app is a quiet strength gym at night. Cast-iron surfaces in warm graphite, chalk-white type, and a single ember glow wherever something needs a lifter's attention: the action to take, a finished set, a new record. Nothing is decorative. The atmosphere comes from warmth in the neutrals (every grey leans brown, never blue), from fine light catching the top edges of plates, and from numbers set in tabular figures so weights and reps line up like a logbook.

Density is calm on review screens and compact where logging happens. The workout screen is built for 90 seconds of rest and sweaty hands: 44px touch targets everywhere, big numeric fields, one ember tick per completed set. Interaction is tactile and confident: buttons press down, checkmarks pop with a small spring, sheets rise from below. Every response is felt but brief.

Dark is the home theme; light mode is the same gym by daylight, with chalk paper and a deeper, rust-like ember. The system follows the OS setting, with a manual override.

**Key Characteristics:**
- Warm graphite neutrals, never cool grey.
- One accent (ember orange), used for action, completion and records.
- Geist for words, Geist Mono and tabular figures for every number that matters.
- Hairline borders with a lighter top edge instead of heavy shadows.
- Tactile press feedback (scale 0.92–0.99) on everything tappable.
- Mobile-first: bottom tab bar and docks on phones, sidebar from 960px.

## Colors

A warm-neutral palette of iron and chalk with a single ember accent and two quiet status tones.

### Primary
- **Ember** (dark theme): the only brand color. Primary buttons, the active nav icon, completed sets (soft ember wash plus a solid ember check), focus rings, the rest-timer progress line, selected chips and records. Hover and press steps are slightly lighter and darker.
- **Ember Rust** (`ember-light`, light theme): the same role by daylight, darkened to rust so it holds contrast on paper.
- **Ember Ink**: text and icons placed on solid ember (near-black in dark mode, warm white in light mode).
- **Ember Wash**: the accent at 9–11% opacity, behind completed sets, selected chips, focus halos and tip icons.

### Neutral
- **Cast Iron** (dark app background) / **Chalk Paper** (light): the floor everything stands on.
- **Iron Plate** / **Chalk Card**: cards, sets, secondary buttons.
- **Iron Well** / **Chalk Well**: recessed fields: inputs, number fields, segmented-control tracks.
- **Iron Raised**: floating layers: sheets, toasts, the rest timer.
- **Chalk** / **Graphite Ink**: primary text.
- **Chalk Dust** / **Graphite Mid**: secondary text, ghost buttons, inactive labels.
- **Chalk Faint** / **Graphite Faint**: tertiary text: meta, set index, "Vorher" values, section labels, placeholders.
- **Borders**: warm translucent white (dark) or warm translucent brown (light) in three strengths, plus a lighter top-edge highlight. Tokens: `--border-subtle` (dark `rgba(255,244,230,.07)`, light `rgba(48,32,16,.08)`), `--border` (11–12%), `--border-strong` (18–20%), `--border-top`.

### Status
- **Sage** (`sage` / `sage-light`): improvement and success: "up" tips, positive comparisons, success toasts. Always paired with its 10–14% wash.
- **Rose** (`rose` / `rose-light`): danger and decline: delete actions, invalid fields, "down" tips.

### Named Rules
**The One Ember Rule.** Ember is the only saturated color in the interface. If something new needs emphasis, it gets ember or nothing; never introduce a second accent hue.

**The Warm Grey Rule.** Every neutral carries a hint of brown (RGB tints like 255/244/230 and 48/32/16). A cool or pure grey is a bug.

**The Earned Glow Rule.** Ember marks what the lifter should do next or what they just achieved. Decorative ember (borders, dividers, background art) is not allowed.

## Typography

**Body Font:** Geist (fallback: ui-sans-serif, system-ui, -apple-system, Segoe UI)
**Numeric Font:** Geist Mono (fallback: ui-monospace, SF Mono, Menlo, Consolas)

**Character:** A clean, slightly technical grotesk with a monospaced sibling. Words stay neutral; the numbers carry the personality, set like a logbook entry.

### Hierarchy
- **Display** (700, 3rem–4rem, line-height 1.1, tracking −0.025em): big figures in summaries and the year review (workout duration, totals).
- **Headline** (700, 2rem, 1.1, −0.025em): page titles ("Training", "Fortschritt").
- **Title** (600, 1.25rem, 1.25, −0.01em): sheet titles, key figures in cards.
- **Body** (400, 1rem, 1.5): running text, inputs.
- **Body Small** (500–600, 0.875rem): buttons, secondary text, card titles, list rows.
- **Label** (600, 0.75rem, tracking 0.06em, UPPERCASE): section labels and small kicker text, in tertiary text color.
- **Numeric** (Geist Mono 500–600, tabular figures): timer, set index, and any value that ticks or must align. Inputs use Geist with `tabular-nums`.

### Named Rules
**The Aligned Numbers Rule.** Every weight, rep count, duration and comparison uses tabular figures. Columns of numbers must never shift width as values change.

**The Quiet Caps Rule.** Uppercase is reserved for 12px tracked labels in tertiary color. Never uppercase headings or buttons.

## Layout

- **Spacing:** a strict 4px grid (4, 8, 12, 16, 20, 24, 32, 40, 48).
- **Content column:** max 680px, centered. Page side padding is 16px on phones, 32px from 640px, 40px from 960px. Top padding respects the safe area.
- **Phone (<960px):** a fixed bottom tab bar (3 items, 64px plus safe area, frosted glass). During a workout the tab bar hides and a frosted dock takes its place: add-exercise field, neutral "+" and a fixed "Beenden" button. While resting, the timer joins the dock as its top row, so the workout screen has one bottom surface instead of a stack.
- **Desktop (≥960px):** a 248px left sidebar with the brand mark replaces the tab bar. Content shifts right and docks align to the content area.
- **Touch:** 44px minimum target. Small visual elements (date chip, toast action) extend their hit area with an invisible pseudo-element.
- **Set grid:** `28px | flexible "Vorher" | 72px reps | 72px kg | 44px check` with 8px gaps.
- **Rhythm:** page head → 24px → content. Section labels have 32px above and 12px below.
- **Page head:** the title stands alone; supporting context (date, counts) sits below it as a 14px secondary line. No eyebrow above headings.

## Elevation & Depth

A hybrid system: depth comes mostly from tonal layering (well → plate → raised) and hairline borders with a lighter top edge, like light catching the rim of a plate. Shadows are soft, warm-tinted and used in three steps. Resting cards get only the smallest one; larger shadows mean something floats above the page.

### Shadow Vocabulary
- **Rest** (`--shadow-sm`, 1px soft drop): cards, secondary buttons, the active segment.
- **Lift** (`--shadow-md`): card hover on pointer devices.
- **Float** (`--shadow-lg`, long 24–56px blur): sheets, toasts, the rest timer.
- **Rim highlight** (`inset 0 1px 0 --highlight`): top edge on solid ember buttons and the brand mark.
- **Glass**: tab bar and dock use 80% background with `saturate(1.4) blur(16px)`.

### Named Rules
**The Top-Edge Rule.** Raised surfaces get a slightly lighter top border (`--border-top` / `--border-strong`) instead of a heavier shadow.

**The Float Means Temporary Rule.** Only transient layers (sheet, toast, timer) use the Float shadow. Permanent content never floats.

## Shapes

Softly rounded, nested radii: outer containers 16px, controls 10px, small inner elements 6px, chips and switches fully round. The rule is outer > inner, so a 10px control sits comfortably inside a 16px card. Icons are a single line set (Lucide style, 1.75px stroke). Bottom sheets round only their top corners and show a 36×4px grip. Data-viz marks are exempt from the scale and stay tiny: 2px legend swatches, 3px calendar cells, 4px bar tops.

## Components

### Buttons
Tactile and confident: every button presses down to 98% scale on tap (150ms, ease-out).
- **Shape:** gently rounded (10px), 44px tall (48px for large), 16px horizontal padding, 14px semibold label.
- **Primary:** solid ember with ember-ink label, rim highlight and Rest shadow. Press → darker ember.
- **Secondary:** iron plate with a hairline border, lighter top edge and Rest shadow.
- **Ghost:** no fill, secondary text color.
- **Danger:** rose wash background with rose label.
- **Disabled:** 40% opacity. **Loading:** label hidden, 16px spinner.

### Chips
- **Style:** 36px pill, 1px border, secondary text.
- **Selected:** ember wash, ember border, ember text. Press scales to 96%.

### Segmented Control
- Iron-well track (10px radius, 4px inset). The active segment is an iron plate (6px radius) with Rest shadow and a subtle inset border.

### Cards / Containers
- **Corner Style:** 16px.
- **Background:** iron plate / chalk card.
- **Shadow Strategy:** Rest; Lift on hover for tappable cards, which also rise by 1px.
- **Border:** subtle hairline with a lighter top edge.
- **Internal Padding:** 16px. List rows are at least 64px tall with 12/16px padding.

### Inputs / Fields
- **Style:** recessed iron well, 48px tall, 10px radius, subtle border, 16px text (prevents iOS zoom).
- **Focus:** ember border plus a 3px ember-wash halo.
- **Error:** rose border plus a rose halo, with the message above the field in rose.
- **Custom date field:** styled shell with the native input invisible on top.

### Navigation
- **Phone:** bottom tab bar, 3 equal items, icon over 12px label, tertiary color. Active item: primary text with ember icon. Press scales to 96%.
- **Desktop:** sidebar with ember brand mark. Items are 40px rows with icon and label. The active item becomes a small iron-plate card; hover gives a faint wash.

### Set Row (signature)
The heart of the app: one row per set in the set grid.
- Mono set index in tertiary color, a tappable "Vorher" value (copies last time's numbers), and two 44px number fields: semibold, centered, tabular, in an iron well with a 6px radius.
- **Done:** the whole row gets an ember wash, the index turns ember, fields lose their well, and the 44px check button fills solid ember with a spring pop (250ms).
- Swipe left to delete; long-press to drag and reorder.

### Rest Timer (signature)
Outside a workout: a floating 56px bar above the tab bar, iron raised with Float shadow. Inside a workout: a 52px row merged into the top of the frosted dock, with no own shadow or border. Both have an ember timer icon, a mono countdown at 20px, compact +/− buttons, and a 2px ember progress line along the bottom edge. It rises in over 250ms.

### Start Block (home)
The first thing under the page title: a 64px two-line primary button that proposes the next due workout ("Push starten" · exercise count · "zuletzt vor 7 Tagen", the template done longest ago in the last five weeks), with a ghost "Anderes Workout" below. A running workout replaces it with "… fortsetzen".

### Notices
Recurring prompts (Sunday wrap-up, backup reminder) are quiet list rows in one card below the week: 32px iron-well icon circle, title, one-line sub, chevron or compact secondary/ghost buttons. They never use ember, so the start button stays the only accent on the home screen.

### Workout Report (signature)
Opens straight after finishing, as a near-full-height sheet. Order: verdict (icon, title, one sentence, workout · date), then records as ember-wash cards (name with trophy, the record set in 32px Geist Mono, "Bisher …" below, staggered rise), then tiles, tonnage, per-exercise comparison and a single "Fertig". Stats count only ticked sets once a workout has any tick.

### Sheet & Toast
- **Sheet:** bottom sheet (max 560px wide, 88vh tall), iron raised, Float shadow, top-only 16px radius, grip handle. It slides up 32px over 250ms. Full variant (report): screen height minus the safe area on phones, 600px wide on larger screens. Decision sheets (open sets on finish, import) stack full-width actions: primary, then secondary, then a ghost way out.
- **Toast:** iron raised pill-ish card (10px radius), Float shadow, 14px medium text, status icon in sage or rose, and an optional ember "Rückgängig" (undo) action. It fades and lifts 8px.

### Insight Tip
Icon in a round wash (sage = up, ember = attention, rose = down), bold one-line headline, secondary explanation, and a 12px tertiary source line citing the study or guideline.

## Do's and Don'ts

### Do:
- **Do** take every color, size, radius and duration from the CSS tokens at the top of `index.html`. Components never hard-code values.
- **Do** keep every tappable element at least 44px (use an invisible hit area if the visual must be smaller).
- **Do** use tabular figures for every number and Geist Mono for ticking values.
- **Do** give every tappable element press feedback (scale 0.92–0.99, 150ms, ease-out `cubic-bezier(0.22, 1, 0.36, 1)`).
- **Do** define both themes for any new color: dark default, light under `prefers-color-scheme: light` and `[data-theme="light"]`.
- **Do** pair every status color with its soft wash rather than using it as a solid fill.

### Don't:
- **Don't** introduce a second accent hue or use ember decoratively.
- **Don't** use cool or pure greys anywhere.
- **Don't** use Float shadows on permanent content.
- **Don't** set uppercase anything except 12px tracked labels.
- **Don't** let the spring easing (`cubic-bezier(0.34, 1.56, 0.64, 1)`) leak beyond small confirmation moments like the set check.
- **Don't** make input text smaller than 16px (iOS zooms on focus).
