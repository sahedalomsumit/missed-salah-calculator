# Lifetime Missed Salah / Qaza Calculator

A modern, transparent, and spiritually serene web application built with **HTML5, CSS, and Vanilla JavaScript (zero frameworks, zero dependencies)**. It calculates an individual's lifetime missed obligatory prayers (Salah) and outstanding debt (**Remaining Qaza**) across their lifetime prayer-behavior periods.

## Key Features

- **Three Prayer-Behavior Periods**:
  1. **Regularly prayed** → 5/5 prayers per day (0 missed)
  2. **Partially prayed** → user chooses average missed prayers per day (1, 2, 3, or 4 missed / day)
  3. **Did not pray** → 5/5 missed per day (calculated automatically as remaining duration)
- **Menstruation Days Excluded (Females)**: Accurately excludes menstruation days from obligatory prayer counts ($Months \times Avg\ Days$).
- **Calendar-Accurate Math**: Uses exact calendar arithmetic rather than assuming 365-day years, handling leap years and variable month lengths.
- **Lifetime Missed vs. Remaining Qaza**: Clearly separates what was historically missed from what has already been made up.
- **Equivalent Duration**: Converts missed prayers into an equivalent duration (Years, Months, Days) of all 5 daily prayers.
- **Transparent Audit Trail**: An expandable *"How was this calculated?"* breakdown showing all 7 calculation steps with exact numbers.
- **Instant Recalculation Drawer**: An *"Adjust my calculation"* slide-over panel that recalculates everything in real-time.
- **Qaza Roadmap Planner**: Personalized pace selector (1, 5, 10, or 20 per day) with estimated completion dates and breakdown by individual prayer (Fajr, Dhuhr, Asr, Maghrib, Isha, and optional Hanafi Witr).
- **Audio Feedback**: Subtle calming chimes generated via the Web Audio API (100% offline).
- **Print & Clipboard Export**: Dedicated `@media print` styles and one-click summary copying.
- **Scholarly Disclaimer**: Prominently displays the required religious advisory note.

## Running Locally

Simply open [index.html](file:///d:/pCloud-laptop/github/missed-salah-calculator/index.html) in any modern browser, or run a local server:

```bash
# Python
python -m http.server 8080

# Or Node (npx)
npx serve .
```

Then visit `http://localhost:8080`.

## Testing

Run unit tests via Node.js:

```bash
node test/calculator.test.js
node test/ui_simulation.test.js
```
