# Get Ready, Data Analyst

A self-study platform for becoming a job-ready entry-level Data Analyst in 12 weeks while working a full-time job. Every learner has an account; an admin manages users. It works on laptop, iPad and phone, and offline once installed.

## What is inside

- **Accounts and admin panel**: email and password sign-in. The admin creates users, resets passwords, disables or deletes accounts, and can **view the app as any learner (read-only)**. Viewing as a user saves nothing and records nothing for them: the server refuses every write, the study timer is off, and the learner's data is never copied to the admin's browser. Each start and stop of a view is noted in an admin activity log. There is no sign-up, no "forgot password" and no change-password form; the admin sets and resets passwords.
- **Profile**: avatar in the top bar opens a page with your stats, badges and sign-out.
- **12-week plan** (Days 1-5 of each week about 1.5 h, Days 6-7 about 3.5 h; Day 1 is the day you start) with a detailed guide for every day: what to study, step-by-step how-to, a worked example, practice questions with answers, important interview questions, and a notes box.
- **235 interview questions** across SQL, Power BI/DAX, Excel, Python/pandas, statistics, business cases, survey analytics and HR. Each has a level, a 30-second spoken answer, the full answer, follow-ups and the most common mistake.
- **Review (spaced repetition)**, **mock interviews**, **weekly check-in**, **My Progress** (goal, heatmap, weekly summary, weak-spot report), a **study timer that counts only real interaction**, **search**, **notes**, **flashcard quiz**, **149 topics**, **4 portfolio projects**, a job-hunt tracker, **SQL Lab**, and gamified XP, levels, badges and celebrations.

Plain HTML, CSS and JavaScript on the front end; three small serverless functions (`api/`) and MongoDB for accounts and progress.

## Run locally

```
npm install
npm run dev          # http://localhost:3000
```

Create a `.env` file (see `.env.example`). The first time the app starts with no admin in the database it creates one from `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Sign in with those, open **Admin panel**, and add your users.

Opening `index.html` straight from the file system still works in **local mode** (no accounts, progress kept in that browser).

## Deploy to Vercel

1. Import the repository. Framework preset **Other**. Leave the build command and output directory empty: the pages are already generated and committed, so there is nothing to build. (`package.json` deliberately has no `build` script, otherwise Vercel would try to run one.)
2. Add these **environment variables** (Settings > Environment Variables):

   | Name | Value |
   |---|---|
   | `MONGODB_URI` | MongoDB Atlas connection string, including the database name |
   | `SESSION_SECRET` | a long random string (24+ characters) that signs sign-in cookies |
   | `ADMIN_EMAIL` | email for the first admin |
   | `ADMIN_PASSWORD` | password for the first admin (8+ characters) |

3. In **MongoDB Atlas > Network Access** allow Vercel to connect (its IPs change, so this usually means `0.0.0.0/0`). Use a database user limited to this database.
4. Deploy, open the site, sign in as the admin and create users.

After deploying, open the site on your phone or iPad and use **Add to Home Screen** (Safari) or **Install app** (Chrome/Edge). Pages and scripts are cached so the app keeps working without a connection, and changes sync when you are back online.

## Security notes

- Passwords are hashed with scrypt and a per-user salt; they are never stored or logged in plain text.
- Sessions are signed, HttpOnly, SameSite cookies. Disabling a user, resetting a password or changing a role signs that user out everywhere.
- Every write needs a custom request header, so other websites cannot post to the API.
- Sign-in is limited to 8 failed attempts per email or address in 15 minutes.
- `.env` is git-ignored. Never commit secrets.

## Changing the site

All HTML pages and `sw.js` are generated from one template:

```
npm run build:pages           # node tools/build-pages.js (run locally, then commit the result)
python tools/make-icons.py    # regenerate the app icons (needs Pillow)
```

Edit `tools/build-pages.js` rather than the `.html` files.

## Project layout

```
*.html                     generated pages (login.html is stand-alone)
manifest.webmanifest, sw.js, icons/    installable app + offline cache
css/style.css, css/features.css
api/auth.js, progress.js, admin.js     serverless functions
api/_lib/                  database, sessions and password helpers
js/data-*.js, qa-*.js, guide-w1..12.js  content
js/core.js, app.js, ux.js, auth.js      shared logic, accounts, read-only mode
js/sr.js, timer.js, notes.js, mock.js, checkin.js, progress.js, search.js
js/page-*.js               one renderer per page
tools/                     page builder, icon generator, local dev server
```

## Content notes

Code in the guides was run where possible (SQL in SQLite, Python/pandas/scipy in Python 3). PostgreSQL-specific SQL, DAX, Excel formulas and BI-tool menu paths were reviewed by hand but not executed; menu names vary by version. Dataset column names (Olist, Airline Satisfaction, Bank Marketing) come from memory, so check your real file's columns first. Interview patterns draw on public Glassdoor reports and SQL practice sites.
