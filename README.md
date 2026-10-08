# Get Ready, Data Analyst

A self-study site for becoming a job-ready entry-level Data Analyst in 12 weeks while working a full-time job.

- **12-week plan** (about 1.5 h on weekdays, 3.5 h on weekends) with a detailed guide for every day: what to study, step-by-step how-to, a worked example, practice questions with answers, and important interview questions.
- **235 interview questions** across SQL, Power BI/DAX, Excel, Python/pandas, statistics, business cases, survey analytics and HR. Each has a level, a 30-second spoken answer, the full answer, follow-ups and the most common mistake.
- **Flashcard quiz**, **149 topics** tagged Must / Optional / Advanced with interview weight, **4 portfolio projects**, a job-hunt checklist and application tracker.
- **SQL Lab**: run SQL in the browser (SQLite via sql.js) against the practice tables.
- **Gamified tracking**: XP, levels, streaks, badges and a "job readiness" score.
- **Optional cloud sync** of your progress through MongoDB.

Plain HTML, CSS and JavaScript. There is no build step. The only server code is `api/progress.js`.

## Run locally

Open `index.html` in Chrome or Edge. Progress is saved in the browser. Cloud sync is off when opened from a file.

To test with a local server: `python -m http.server 8000`, then open <http://localhost:8000>.

## Deploy to Vercel (with cloud sync)

1. Import this repository in Vercel. Framework preset: **Other**. No build command. Output directory: leave empty.
2. In **Settings > Environment Variables** add:
   - `MONGODB_URI`: your MongoDB Atlas connection string (include the database name).
   - `SYNC_KEY`: a long random passphrase you choose.
3. In **MongoDB Atlas > Network Access**, allow access from Vercel (Vercel uses changing IPs, so this usually means `0.0.0.0/0`). Use a dedicated database user with access to this one database only.
4. Deploy, open the site, go to **Settings > Cloud sync**, enter the same passphrase and click **Connect**.

Do not commit secrets. `.env*` files are ignored by git. See `.env.example`.

### How sync works

`GET /api/progress` returns your saved state and `PUT /api/progress` stores it. Every request needs the `x-sync-key` header, which the browser sends after you connect. The newest copy wins, compared by timestamp. A stale write is rejected with HTTP 409 and the browser takes the cloud copy.

## Project layout

```
index.html, plan.html, week-1..12.html, topics.html, interview.html,
qa-<topic>.html (8 pages), projects.html, jobs.html, resources.html,
sql-lab.html, settings.html
css/style.css
js/data-*.js        plan, topics, projects, misc
js/qa-*.js          interview question banks
js/guide-w1..12.js  day-by-day week guides
js/core.js, app.js, ux.js, sync.js   shared logic
js/page-*.js        one renderer per page
api/progress.js     serverless function for cloud sync
```

## Content notes

Code in the guides was run where possible (SQL in SQLite, Python/pandas/scipy in Python 3). PostgreSQL-specific SQL, DAX, Excel formulas and BI-tool menu paths were reviewed by hand but not executed; menu names vary by version. Dataset column names (Olist, Airline Satisfaction, Bank Marketing) come from memory, so check your real file's columns first. Interview patterns draw on public Glassdoor reports and SQL practice sites.
