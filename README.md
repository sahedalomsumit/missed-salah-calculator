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
- **Print & PDF Export**: High-contrast dark-themed `@media print` styling that preserves the app's aesthetic in saved PDFs and one-click summary copying.
- **Full Mobile Responsiveness**: Thumb-friendly interactive wizard, clean responsive tables, and fluid layouts down to 320px screens.
- **Custom Islamic Logo & Favicon**: Scalable vector SVG brand logo and browser favicon featuring the crescent moon, mosque dome, minaret, and five prayer stars.
- **Companion Mobile App Integration**: Direct links to the **Salah Tracker** Android app to track daily prayers in real-time and log Qaza progress on the go.
- **Scholarly Disclaimer**: Prominently displays the required religious advisory note.

## Companion Mobile App: Salah Tracker

To track your 5 daily obligatory prayers in real time and manage your make-up Qaza prayers step-by-step on mobile:

📱 **[Download Salah Tracker on Google Play Store](https://play.google.com/store/apps/details?id=com.sahed.salah_tracker)**

- **Real-Time Tracking**: Mark Fajr, Dhuhr, Asr, Maghrib & Isha throughout your day.
- **Live Qaza Counter**: Subtract make-up prayers one by one with a single tap.
- **Streaks & Habits**: Keep track of prayer streaks and build lasting consistency.
- **Smart Reminders**: Timely notifications so you never miss a prayer.

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

## Credits

Built with ❤️ by **[Sahed](https://sahedalomsumit.com/)**

