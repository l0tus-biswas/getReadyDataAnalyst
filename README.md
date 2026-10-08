# Get Ready, Data Analyst

A self-study site for becoming a job-ready entry-level Data Analyst in 12 weeks while working a full-time job. It works on laptop, iPad and phone, and offline once installed.

## What is inside

- **12-week plan** (Days 1-5 of each week about 1.5 h, Days 6-7 about 3.5 h; Day 1 is the day you start) with a detailed guide for every day: what to study, step-by-step how-to, a worked example, practice questions with answers, important interview questions, and a notes box.
- **235 interview questions** across SQL, Power BI/DAX, Excel, Python/pandas, statistics, business cases, survey analytics and HR. Each has a level, a 30-second spoken answer, the full answer, follow-ups and the most common mistake.
- **Review (spaced repetition)**: flagged, prepared and missed questions come back after 1, 3, 7, 14, 30 and 60 days.
- **Mock interview**: timed sets (SQL sprint, technical round, full loop, cases and HR, or a one-topic drill) picked from your weak spots, self-scored, with a report. Misses go to the review queue.
- **Weekly check-in**: how the week went, carry leftover tasks forward, shift the plan if you fell behind.
- **My Progress**: daily goal, study calendar (heatmap), weekly summary, ranked weak-spot report and mock history.
- **Study timer** that counts only real interaction (taps, typing, ticking, answering). Scrolling or leaving a page open counts for nothing. It also pauses when the tab is hidden or another tab is the active one. Optional 15/25/45-minute focus sessions.
- **Search** across topics, questions, guides, practice and your notes (press `/`), **Notes** for each plan day.
- **Flashcard quiz**, **149 topics** tagged Must / Optional / Advanced with interview weight, **4 portfolio projects**, a job-hunt checklist and application tracker.
- **SQL Lab**: run SQL in the browser (SQLite via sql.js) against the practice tables.
- **Gamified tracking**: XP, levels, streaks, badges, celebration popups and a "job readiness" score.

Plain HTML, CSS and JavaScript. No framework and no server code.

## Run locally

Open `index.html` in Chrome or Edge. Progress is saved in your browser (localStorage), so use the same browser each time. The plan starts on the date you choose in Settings.

To test with a local server: `python -m http.server 8000`, then open <http://localhost:8000>. Offline support (service worker) only works over `https://` or `localhost`.

## Deploy to Vercel

It is a static site. Import the repository with the **Other** framework preset, no build command and an empty output directory. Nothing else is needed.

After deploying, open the site on your phone or iPad and use **Add to Home Screen** (Safari) or **Install app** (Chrome/Edge). Pages and scripts are cached so it keeps working without a connection. When you are online the newest files are always used first.

## Changing the site

All HTML pages and `sw.js` are generated from one template:

```
node tools/build-pages.js     # regenerate the pages and the offline cache list
python tools/make-icons.py    # regenerate the app icons (needs Pillow)
```

Edit `tools/build-pages.js` rather than the `.html` files.

## Project layout

```
index.html, plan.html, week-1..12.html, review.html, mock.html, checkin.html,
progress.html, notes.html, search.html, topics.html, interview.html,
qa-<topic>.html (8 pages), projects.html, jobs.html, resources.html,
sql-lab.html, settings.html           (generated)
manifest.webmanifest, sw.js, icons/   installable app + offline cache
css/style.css, css/features.css
js/data-*.js         plan, topics, projects, misc
js/qa-*.js           interview question banks
js/guide-w1..12.js   day-by-day week guides
js/core.js           state, scoring, badges
js/app.js, ux.js     navigation, quiz, celebrations, code highlighting
js/sr.js, timer.js, notes.js, mock.js, checkin.js, progress.js, search.js
js/page-*.js         one renderer per page
tools/               page builder and icon generator
```

## Content notes

Code in the guides was run where possible (SQL in SQLite, Python/pandas/scipy in Python 3). PostgreSQL-specific SQL, DAX, Excel formulas and BI-tool menu paths were reviewed by hand but not executed; menu names vary by version. Dataset column names (Olist, Airline Satisfaction, Bank Marketing) come from memory, so check your real file's columns first. Interview patterns draw on public Glassdoor reports and SQL practice sites.
