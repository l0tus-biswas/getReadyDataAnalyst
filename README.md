# Get Ready, Data Analyst

A self-study site for becoming a job-ready entry-level Data Analyst in 12 weeks while working a full-time job.

- **12-week plan** (Days 1-5 of each week about 1.5 h, Days 6-7 about 3.5 h; Day 1 is the day you start) with a detailed guide for every day: what to study, step-by-step how-to, a worked example, practice questions with answers, and important interview questions.
- **235 interview questions** across SQL, Power BI/DAX, Excel, Python/pandas, statistics, business cases, survey analytics and HR. Each has a level, a 30-second spoken answer, the full answer, follow-ups and the most common mistake.
- **Flashcard quiz**, **149 topics** tagged Must / Optional / Advanced with interview weight, **4 portfolio projects**, a job-hunt checklist and application tracker.
- **SQL Lab**: run SQL in the browser (SQLite via sql.js) against the practice tables.
- **Gamified tracking**: XP, levels, streaks, badges and a "job readiness" score.

Plain HTML, CSS and JavaScript. There is no build step and no server code.

## Run locally

Open `index.html` in Chrome or Edge. Progress is saved in your browser (localStorage), so use the same browser each time. The plan starts on the date you choose in Settings: Day 1 is that date.

To test with a local server: `python -m http.server 8000`, then open <http://localhost:8000>.

## Deploy to Vercel

It is a static site. Import the repository in Vercel with the **Other** framework preset, no build command and an empty output directory. Nothing else is needed.

## Project layout

```
index.html, plan.html, week-1..12.html, topics.html, interview.html,
qa-<topic>.html (8 pages), projects.html, jobs.html, resources.html,
sql-lab.html, settings.html
css/style.css
js/data-*.js        plan, topics, projects, misc
js/qa-*.js          interview question banks
js/guide-w1..12.js  day-by-day week guides
js/core.js, app.js, ux.js   shared logic
js/page-*.js        one renderer per page
```

## Content notes

Code in the guides was run where possible (SQL in SQLite, Python/pandas/scipy in Python 3). PostgreSQL-specific SQL, DAX, Excel formulas and BI-tool menu paths were reviewed by hand but not executed; menu names vary by version. Dataset column names (Olist, Airline Satisfaction, Bank Marketing) come from memory, so check your real file's columns first. Interview patterns draw on public Glassdoor reports and SQL practice sites.
