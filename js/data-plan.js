/* =========================================================
   DATA ANALYST QUEST — plan, topics, Q&A, projects, tracker
   Built from: Glassdoor interview reports (Infosys, Deloitte, Ivanti,
   AI Variant), DataLemur / StrataScratch / LeetCode patterns,
   InterviewQuery / Dataford product-analyst guides.
   ========================================================= */
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const pre=s=>'<pre>'+esc(s.trim())+'</pre>';
const M=t=>[t,'M'],O=t=>[t,'O'],A=t=>[t,'A'];
const DAYN=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

/* ---------------- 12-WEEK PLAN (weekday ≈1.5h, weekend ≈3.5h) ---------------- */
const WEEKS=[
{n:1,title:'SQL Foundations',goal:'Write SELECT, JOIN, GROUP BY queries confidently. SQL is tested in almost every analyst interview.',deliver:'GitHub repo "sql-practice" with 25+ solved queries.',days:[
 [M('Setup: install PostgreSQL/MySQL + DBeaver (or use db-fiddle.com). Load the Chinook sample DB. Learn SELECT, WHERE, ORDER BY, LIMIT, DISTINCT.')],
 [M('Aggregates: COUNT, SUM, AVG, MIN, MAX + GROUP BY + HAVING. Solve 5 problems on SQLBolt / Mode.')],
 [M('JOINs: INNER, LEFT, RIGHT, FULL, SELF. Draw each join on paper with example tables.')],
 [M('JOIN with DUPLICATE keys: build two small tables with repeated IDs and predict row counts for INNER vs LEFT join (asked at Deloitte).'),M('Practice: 8 easy JOIN + GROUP BY problems (HackerRank / LeetCode Database).')],
 [M('CASE WHEN, NULL handling (IS NULL, COALESCE), LIKE, IN, BETWEEN.'),O('Learn SQL order of execution: FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT.')],
 [M('Subqueries (scalar, IN, correlated) and CTEs (WITH). Rewrite 3 subqueries as CTEs.'),M('Create GitHub account + repo "sql-practice"; push your solved queries.')],
 [M('Weekly review: 10 mixed SQL problems + write a 1-page SQL cheat sheet.'),M('Read the first 10 SQL interview Q&As (Interview Q&A, SQL).')]]},
{n:2,title:'SQL Advanced: Window Functions',goal:'Window functions + CTEs are the #1 differentiator in SQL rounds (Infosys, Deloitte, StrataScratch patterns).',deliver:'10 business questions answered on Chinook/Northwind, pushed to GitHub.',days:[
 [M('Window functions: ROW_NUMBER, RANK, DENSE_RANK with PARTITION BY.')],
 [M('LAG / LEAD, running total (SUM OVER), moving average (ROWS BETWEEN).')],
 [M('NTILE, percent of total, and gap detection (consecutive days/IDs).'),M('Date functions (DATE_TRUNC, EXTRACT, DATEDIFF) and string functions. Asked in most SQL rounds.')],
 [M('Classic questions: find duplicates, delete duplicates, Nth highest salary, top-N per group, customers with no orders.')],
 [M('UNION vs UNION ALL, EXISTS vs IN, INTERSECT / EXCEPT.'),O('Views and basic indexes: what and why.')],
 [M('Solve 10 medium problems on DataLemur / StrataScratch (20 min each, timed, talk out loud).')],
 [M('Mini project: answer 10 business questions on Chinook/Northwind. Push to GitHub with README.'),A('Just read about recursive CTEs and EXPLAIN plans. Do not master them.')]]},
{n:3,title:'Excel + Power Query',goal:'Many interviews have an Excel scenario or take-home. Be fast with lookups, pivots and cleaning.',deliver:'Excel dashboard (KPI cards + 4 charts + slicers).',days:[
 [M('Lookups: XLOOKUP, VLOOKUP, INDEX-MATCH. Know when each breaks.')],
 [M('SUMIFS, COUNTIFS, AVERAGEIFS, IF/IFS/AND/OR/IFERROR; text (LEFT, MID, TEXTJOIN) and date functions.')],
 [M('Pivot tables: grouping, calculated fields, slicers, timelines, pivot charts.')],
 [M('Power Query: import, merge, append, unpivot, split, group by, data types.')],
 [M('Data-cleaning checklist on a messy dataset (duplicates, blanks, wrong types, spelling, outliers).'),O('Dynamic arrays: FILTER, UNIQUE, SORT.')],
 [M('Build an Excel dashboard on the Superstore dataset (KPIs, charts, slicers).')],
 [M('Read Excel Q&A. Redo 5 SQL window-function problems.'),A('Peek at Power Pivot / Data Model. VBA is NOT needed for entry-level roles.')]]},
{n:4,title:'Power BI Basics + Data Modeling',goal:'Interviewers ask for DAX measures live and for star-schema reasoning (Ivanti, Deloitte reports).',deliver:'First 2-page Power BI dashboard on Superstore.',days:[
 [M('Install Power BI Desktop. Connect Excel/CSV/SQL. Clean in Power Query.')],
 [M('Data modeling: fact vs dimension, star schema, 1:many relationships, cardinality, filter direction.')],
 [M('Visuals: bar, line, card, table, matrix, map, slicer. Formatting and sorting.')],
 [M('DAX basics: measure vs calculated column; SUM, AVERAGE, COUNTROWS, DISTINCTCOUNT, DIVIDE.')],
 [M('CALCULATE, FILTER, ALL, filter context vs row context. Write "Net Sales" and "Unique Customers" measures.')],
 [M('Build dashboard on Superstore/AdventureWorks (Overview + Product pages).')],
 [M('Review + Power BI Q&A. 5 SQL problems.'),O('Publish to Power BI Service. If your account blocks it, export PDF/screenshots instead.')]]},
{n:5,title:'Power BI Intermediate + Project 1 (Survey)',goal:'Use your survey background as a differentiator. Few freshers can show survey analytics.',deliver:'Project 1 live on GitHub (Survey / CSAT Dashboard).',days:[
 [M('Calendar table + time intelligence: TOTALYTD, SAMEPERIODLASTYEAR, DATEADD; MoM% and YoY%.')],
 [M('Drill-through, tooltips, conditional formatting.'),O('Bookmarks, what-if parameters.')],
 [M('Dashboard design: layout, KPI row on top, colors, storytelling, fewer visuals.')],
 [M('PROJECT 1: pick dataset, write 5 business questions, load and clean.')],
 [M('PROJECT 1: compute CSAT / NPS / top-2-box, segment crosstabs, find drivers.')],
 [M('PROJECT 1: build the Power BI dashboard (3 pages).')],
 [M('PROJECT 1: README, insights, 3 recommendations, push to GitHub.'),M('5 SQL problems (keep the daily habit).')]]},
{n:6,title:'Python for Analysis (pandas)',goal:'Pandas tasks appear when the JD says Python: groupby, merge, cleaning, outliers.',deliver:'Jupyter notebook EDA on a Kaggle dataset.',days:[
 [M('Python refresh: data types, list/dict/set/tuple, loops, functions, list comprehension, lambda.')],
 [M('Jupyter + pandas: read_csv, head, info, describe, select, filter, loc/iloc, sort.')],
 [M('Cleaning: isnull, fillna, dropna, drop_duplicates, astype, str methods, to_datetime.')],
 [M('groupby + agg, pivot_table, merge/join/concat, apply/map. Group sessions by user and compute session duration.')],
 [M('Visualisation with matplotlib/seaborn: hist, bar, line, box, scatter, heatmap.'),O('Try plotly.')],
 [M('End-to-end EDA on a Kaggle dataset: clean, ask questions, chart, write insights.'),M('Write a z-score / IQR outlier-removal function.')],
 [M('Python Q&A review + 5 SQL problems.'),O('numpy basics.'),A('Peek at linear regression in scikit-learn. Not needed for entry-level interviews.')]]},
{n:7,title:'Statistics + Business Thinking',goal:'Case questions ("sales dropped 25%", "p-value 0.04") are the usual manager-round filter.',deliver:'1-page "metric drop investigation" framework + KPI cheat sheet.',days:[
 [M('Descriptive stats: mean, median, mode, variance, std dev, percentiles, IQR, outliers.')],
 [M('Distributions: normal (68-95-99.7), skew, sampling, CLT, population vs sample.')],
 [M('Correlation vs causation, hypothesis testing, p-value, confidence interval, Type I/II errors.')],
 [M('A/B testing: control/treatment, metrics, guardrails, sample size idea, pitfalls.')],
 [M('KPIs: conversion, churn, retention, CAC, LTV, AOV, ROI, funnel, cohort, RFM.')],
 [M('Case practice: "Sales dropped 25%. What do you do?" Write the framework and say 3 cases out loud.')],
 [M('Stats + Business Q&A review.'),O('Survey statistics: weighting, margin of error, significance in crosstabs.')]]},
{n:8,title:'Project 2 (E-commerce) + Resume',goal:'Start applying now. You do not need to feel "ready". Interviews are also practice.',deliver:'Project 2 on GitHub + Resume v1 + LinkedIn updated + first 5 applications.',days:[
 [M('PROJECT 2: download Olist dataset, load into SQL, define 8 business questions.')],
 [M('PROJECT 2 SQL: revenue by month, top categories, delivery delays, payment mix.')],
 [M('PROJECT 2 SQL: repeat-customer rate, cohort retention, RFM segments.')],
 [M('PROJECT 2 Power BI: star-schema model + DAX measures.')],
 [M('PROJECT 2: 2-3 page dashboard with drill-through.')],
 [M('PROJECT 2: insights, recommendations, README, GitHub.')],
 [M('Resume v1: rewrite your current job as analyst work. Update LinkedIn headline + About.'),M('Apply to 5 jobs.')]]},
{n:9,title:'Project 3 (Martech / Edtech)',goal:'A second business domain shows range. Choose marketing or learner analytics.',deliver:'Project 3 on GitHub + 2-minute walkthrough rehearsed.',days:[
 [M('PROJECT 3: choose UCI Bank Marketing (martech) or OULAD (edtech). Define questions.')],
 [M('PROJECT 3: clean + EDA in Python.')],
 [M('PROJECT 3: funnel / channel ROI / drop-off / segment analysis.')],
 [M('PROJECT 3: Power BI dashboard.')],
 [M('PROJECT 3: insights + recommendations.')],
 [M('PROJECT 3: README + publish + practice a 2-min walkthrough aloud.')],
 [M('Apply to 10 jobs; send 5 referral/connection messages.')]]},
{n:10,title:'Interview Drilling: Technical',goal:'Interview loops: online test → HR screen → technical → manager. Drill the technical part.',deliver:'Mock interview #1 done + weak-topic list.',days:[
 [M('SQL: 5 timed problems (window functions focus).')],
 [M('SQL Q&A full revision. Redo flagged questions.')],
 [M('Power BI / DAX + Excel Q&A revision. Write 5 DAX measures from memory.')],
 [M('Python + Stats Q&A revision.')],
 [M('Aptitude + data interpretation practice (30 min), then a 90-min take-home case practice.')],
 [M('Mock interview #1 (technical) with a friend/AI. Record yourself.')],
 [M('Timed 3-hour take-home (dataset + question) and a 5-slide presentation.'),M('Apply to 5 jobs.')]]},
{n:11,title:'Cases, Behavioural & Polish',goal:'Manager round = project walkthrough + business case + communication.',deliver:'Mock interview #2 done + scripted HR answers.',days:[
 [M('Business cases: 5 more (metric drop, feature adoption, retention, campaign ROI).')],
 [M('HR answers: Tell me about yourself, why switch, strengths, salary expectation. Script and rehearse.')],
 [M('Rehearse all 3 project walkthroughs (2 min each + 5 min deep dive).')],
 [M('Review feedback from mocks and fix weak areas.'),O('Tableau Public intro: build 1 dashboard (2 hrs).')],
 [O('SQL performance: indexes and EXPLAIN (high level).'),A('Window-frame subtleties (ROWS vs RANGE).')],
 [M('Mock interview #2: full loop (HR + technical + case).')],
 [M('Apply to 10 jobs. Follow up with recruiters. Update application tracker.')]]},
{n:12,title:'Final Sprint',goal:'Keep applying daily. Aim for 5 quality applications a day until you have an offer.',deliver:'Mock #3 done, 50+ applications logged, next-30-day plan.',days:[
 [M('Revise cheat sheets: SQL, DAX, pandas, stats.')],
 [M('5 SQL problems + 1 Python/pandas mock task.')],
 [M('Polish GitHub READMEs + LinkedIn Featured section.')],
 [M('Mock interview #3.')],
 [M('Salary research (Glassdoor, AmbitionBox) and negotiation script.')],
 [M('Apply to 10 more jobs. Follow up on pending ones.')],
 [M('Retrospective: score yourself and plan the next 30 days.'),A('Only after your first DA job: look at Airflow, dbt, cloud basics.')]]}
];
WEEKS.forEach(w=>{w.days=w.days.map((d,di)=>d.map((t,i)=>({id:`w${w.n}d${di}t${i}`,text:t[0],tag:t[1],w:w.n,d:di})))});

