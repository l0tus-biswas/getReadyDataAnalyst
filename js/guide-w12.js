GUIDES[12] = {
  intro: `<p>Week 12 is the <b>final sprint</b>. You do not learn new big topics now. You sharpen what you have, finish your public profile, take the last mock, learn how to talk about money, and build a daily routine that keeps applications going until you have an offer.</p>
<p><b>By Sunday you will have:</b> four one-page cheat sheets (SQL, DAX, pandas, stats), five SQL tasks and one pandas task solved under time, polished GitHub READMEs and LinkedIn, Mock #3 scored, a salary range and negotiation script, 10 more applications (50 or more in total), and a 30-day plan.</p>
<p><b>Time split:</b> Mon cheat sheets (1.5 h), Tue timed practice (1.5 h), Wed GitHub and LinkedIn (1.5 h), Thu mock #3 (1.5 h), Fri salary research (1.5 h), Sat applications (3.5 h), Sun retrospective and plan (3.5 h; the last part is optional).</p>
<p><b>Mindset:</b> You will get rejections. A rejection is not a verdict on you. It is data. Keep the routine going.</p>`,
  days: [
    {
      title: 'Revise cheat sheets: SQL, DAX, pandas, stats',
      time: '1.5 h',
      study: [
        `A cheat sheet is not a full note. It is one page of patterns you must be able to write without looking. Making it is itself revision.`,
        `SQL must-knows: SELECT order of execution (FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT), joins, CTE, window functions, CASE, date functions, NULL handling.`,
        `DAX must-knows: measure versus calculated column, CALCULATE, filter context, time intelligence (SAMEPERIODLASTYEAR, DATESYTD), DIVIDE, RELATED.`,
        `pandas must-knows: read, inspect, clean, filter, groupby, merge, pivot, datetime, apply versus vectorised operations.`,
        `Stats must-knows: mean, median, std dev, percentiles, correlation, p-value, confidence interval, A/B test idea, Type I and II errors, sampling bias.`,
        `Test yourself by covering the sheet and rewriting the pattern from memory. What you cannot rewrite is your weak spot.`
      ],
      how: [
        `[10 min] Open 4 blank pages (paper or doc): SQL, DAX, pandas, Stats.`,
        `[15 min] Copy the cheat sheet content below, but retype it yourself and add 2 patterns you often forget.`,
        `[20 min] SQL sheet: cover and rewrite from memory the window function, CTE and LEFT JOIN anti-join patterns. Run each in PostgreSQL or DB Fiddle once.`,
        `[15 min] DAX sheet: write 5 measures from memory (total, distinct count, ratio, YTD, previous year). Check in Power BI if you can.`,
        `[15 min] pandas sheet: open a notebook and run each line once on a small DataFrame.`,
        `[15 min] Stats sheet: say each definition aloud in one sentence. Finish by saving all four sheets as PDF and phone photos.`
      ],
      example: `<p><b>SQL sheet (PostgreSQL):</b></p>
${pre(`-- Order of execution: FROM/JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT

-- Rank within group
ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC)   -- 1,2,3,4 no ties
RANK()       OVER (...)   -- 1,1,3  (gaps)
DENSE_RANK() OVER (...)   -- 1,1,2  (no gaps)
LAG(x) OVER (ORDER BY d)  -- previous row; LEAD = next row
SUM(x) OVER (ORDER BY d)  -- running total (default frame is RANGE; use ROWS for ties)

-- Anti-join: customers with no orders
SELECT c.* FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
WHERE o.customer_id IS NULL;

-- CTE
WITH monthly AS (
  SELECT DATE_TRUNC('month', order_date) AS m, SUM(amount) AS rev
  FROM orders GROUP BY 1
)
SELECT * FROM monthly;

-- Conditional aggregate
SUM(CASE WHEN status = 'returned' THEN 1 ELSE 0 END)
-- NULL: use IS NULL, COALESCE(x,0), NULLIF(x,0). COUNT(*) counts rows, COUNT(col) skips NULLs.
-- Duplicates: GROUP BY ... HAVING COUNT(*) > 1`)}
<p><b>DAX sheet:</b></p>
${pre(`Total Sales   = SUM(Sales[Amount])
Orders        = DISTINCTCOUNT(Sales[OrderID])
AOV           = DIVIDE([Total Sales], [Orders])
Sales YTD     = TOTALYTD([Total Sales], 'Date'[Date])
Sales LY      = CALCULATE([Total Sales], SAMEPERIODLASTYEAR('Date'[Date]))
YoY %         = DIVIDE([Total Sales] - [Sales LY], [Sales LY])
Sales Online  = CALCULATE([Total Sales], Sales[Channel] = "Online")
% of All      = DIVIDE([Total Sales], CALCULATE([Total Sales], ALL(Sales)))
-- Measure = computed at query time, respects filters. Calculated column = per row, stored.
-- Time intelligence needs a proper Date table marked as a date table.`)}
<p><b>pandas sheet:</b></p>
${pre(`import pandas as pd
df = pd.read_csv("orders.csv", parse_dates=["order_date"])
df.info(); df.describe(); df.isna().sum()
df = df.drop_duplicates()
df["amount"] = df["amount"].fillna(0)
df[df["amount"] > 100]                               # filter
df.groupby("city", as_index=False)["amount"].sum()   # aggregate
df.merge(customers, on="customer_id", how="left")    # join
df.pivot_table(index="city", columns="status", values="amount", aggfunc="sum")
df["month"] = df["order_date"].dt.to_period("M")
df.sort_values("amount", ascending=False).head(5)`)}
<p><b>Stats sheet (say each in one sentence):</b></p>
<ul>
<li><b>Mean</b> is the average and is pulled by outliers; <b>median</b> is the middle value and is robust.</li>
<li><b>Standard deviation</b> shows how spread out values are around the mean.</li>
<li><b>Correlation</b> (-1 to +1) measures a linear relationship. It is not causation.</li>
<li><b>p-value</b> is the chance of seeing a result this extreme if there is truly no effect. A small value (commonly &lt; 0.05) suggests the result is unlikely to be chance.</li>
<li><b>95% confidence interval</b> is a range that, if we repeated the study many times, would contain the true value in about 95% of studies.</li>
<li><b>Type I error</b> = false positive (see an effect that is not there). <b>Type II error</b> = false negative (miss a real effect).</li>
<li><b>A/B test:</b> randomly split users, change one thing, compare a pre-defined metric, check significance and sample size.</li>
<li><b>Sampling bias:</b> sample does not represent the population (relevant for survey data: non-response bias).</li>
</ul>`,
      practice: [
        [`Which is executed first in SQL: WHERE or SELECT aliases? Can you use an alias from SELECT in WHERE?`, `<p>WHERE runs before SELECT, so you cannot use a SELECT alias in WHERE in standard SQL (PostgreSQL included). You can use it in ORDER BY. Repeat the expression or use a subquery or CTE.</p>`],
        [`Write the SQL pattern to find duplicate emails in users(user_id, email).`, `${pre(`SELECT email, COUNT(*) AS cnt
FROM users
GROUP BY email
HAVING COUNT(*) > 1;`)}<p>Explanation: group by the column that should be unique and keep groups with more than one row.</p>`],
        [`Write a DAX measure for sales share of each category (percent of total across all categories).`, `${pre(`Category Share =
DIVIDE(
    [Total Sales],
    CALCULATE([Total Sales], ALL(Products[Category]))
)`)}<p>Explanation: ALL removes the category filter in the denominator so every category is divided by the grand total.</p>`],
        [`pandas: get the top 3 rows by amount within each city.`, `${pre(`top3 = (df.sort_values("amount", ascending=False)
         .groupby("city")
         .head(3))`)}<p>Explanation: sort first, then take the first 3 rows of each group.</p>`],
        [`Stats: sales were 10, 12, 11, 13, 100. Which is better to report, mean or median, and why?`, `<p>Median = 12. Mean = 29.2. The value 100 is an outlier that pulls the mean up. The median is more typical. Say both and explain the outlier.</p>`]
      ],
      important: [
        [`What is the difference between RANK, DENSE_RANK and ROW_NUMBER?`, `<p>"ROW_NUMBER gives unique numbers with no ties. RANK gives the same number to ties and then skips numbers (1, 1, 3). DENSE_RANK gives the same number to ties and does not skip (1, 1, 2)."</p>`],
        [`Explain filter context in DAX.`, `<p>"Filter context is the set of filters that apply when a measure is calculated: from slicers, rows and columns of the visual, and page filters. The same measure gives different values in each cell because each cell has a different context. CALCULATE changes this context."</p>`],
        [`What does a p-value of 0.03 mean?`, `<p>"If there were really no effect, we would see a result this extreme only about 3 percent of the time. So we have evidence against no effect at the usual 5 percent level. It is not the probability that the hypothesis is true, and it does not show how big or important the effect is."</p>`]
      ],
      resources: [['DAX Guide','https://dax.guide'],['pandas: 10 minutes','https://pandas.pydata.org/docs/user_guide/10min.html']],
      done: `You are done when you have 4 one-page cheat sheets and you can rewrite the SQL window, anti-join and CTE patterns and 5 DAX measures from memory.`
    },
    {
      title: 'Timed practice: 5 SQL tasks + 1 pandas task',
      time: '1.5 h',
      study: [
        `A timed test checks speed and calm. Aim for 8 to 10 minutes per SQL task and 25 minutes for the pandas task.`,
        `Read the task twice. Write down the output columns first. Then write the query in small steps and test each step.`,
        `Common traps: duplicate rows after joins, NULLs in comparisons, dividing integers (use 100.0 not 100), forgetting that WHERE cannot filter on window functions (use a CTE).`,
        `If stuck for more than 5 minutes, write what you know and move on. In real interviews, partial correct work beats silence.`,
        `Check your result with a tiny test: does the total match? Is each customer counted once?`,
        `In pandas, inspect first (<code>info</code>, <code>head</code>, <code>isna().sum()</code>), then transform, then check the result.`
      ],
      how: [
        `[5 min] Create the tables below in PostgreSQL or DB Fiddle (copy the CREATE and INSERT).`,
        `[40 min] Solve SQL tasks 1 to 5 with a timer (8 min each). Do not look at the solutions until time ends for each.`,
        `[5 min] Check your answers against the solutions below. Mark each as correct, almost, or wrong.`,
        `[30 min] Solve the pandas task with a 25-minute timer. Use a notebook or Colab.`,
        `[5 min] Compare with the solution and write down the 2 patterns you missed.`
      ],
      example: `<p><b>Tiny schema (PostgreSQL):</b></p>
${pre(`CREATE TABLE customers (customer_id INT PRIMARY KEY, name TEXT, city TEXT);
CREATE TABLE orders (order_id INT PRIMARY KEY, customer_id INT, order_date DATE, amount NUMERIC(10,2));

INSERT INTO customers VALUES
 (1,'Asha','Pune'),(2,'Ravi','Pune'),(3,'Meena','Delhi'),(4,'Kiran','Delhi'),(5,'Jay','Mumbai');

INSERT INTO orders VALUES
 (101,1,'2024-01-05',500),(102,1,'2024-01-20',300),(103,2,'2024-01-11',700),
 (104,3,'2024-01-15',200),(105,1,'2024-02-03',400),(106,2,'2024-02-10',100),
 (107,3,'2024-02-18',900),(108,4,'2024-03-01',250);`)}
<p><b>Tasks:</b></p>
<ol>
<li>Find customers who never placed an order.</li>
<li>Top customer by total amount in each city (ties may all appear).</li>
<li>Monthly revenue and percent change versus the previous month.</li>
<li>For each customer, the date of their second order and days between first and second order.</li>
<li>Of customers whose first order was in January 2024, how many also ordered in February 2024?</li>
</ol>
<p><b>Solutions:</b></p>
${pre(`-- 1 (expected: Jay)
SELECT c.customer_id, c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
WHERE o.order_id IS NULL;

-- 2 (expected: Delhi Meena 1100 | Pune Asha 1200)
SELECT city, name, total FROM (
  SELECT c.city, c.name, SUM(o.amount) AS total,
         RANK() OVER (PARTITION BY c.city ORDER BY SUM(o.amount) DESC) AS rnk
  FROM customers c JOIN orders o ON o.customer_id = c.customer_id
  GROUP BY c.city, c.name
) t WHERE rnk = 1 ORDER BY city;

-- 3 (PostgreSQL; MySQL: DATE_FORMAT(order_date, '%Y-%m-01'))
-- expected: 2024-01-01 1700 NULL | 2024-02-01 1400 -17.6 | 2024-03-01 250 -82.1
WITH m AS (
  SELECT DATE_TRUNC('month', order_date)::date AS month, SUM(amount) AS revenue
  FROM orders GROUP BY 1
)
SELECT month, revenue,
       ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))
             / NULLIF(LAG(revenue) OVER (ORDER BY month), 0), 1) AS pct_change
FROM m ORDER BY month;

-- 4 (FILTER works in PostgreSQL and SQLite; in MySQL/SQL Server use MAX(CASE WHEN rn = 2 THEN order_date END))
-- expected: 1 2024-01-20 15 | 2 2024-02-10 30 | 3 2024-02-18 34
SELECT customer_id,
       MAX(order_date) FILTER (WHERE rn = 2) AS second_order,
       MAX(order_date) FILTER (WHERE rn = 2) - MAX(order_date) FILTER (WHERE rn = 1) AS days_gap
FROM (
  SELECT customer_id, order_date,
         ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date) AS rn
  FROM orders
) t
WHERE rn <= 2
GROUP BY customer_id
HAVING MAX(order_date) FILTER (WHERE rn = 2) IS NOT NULL;

-- 5 (expected: cohort_size 3, ordered_in_feb 3)
WITH first_order AS (
  SELECT customer_id, MIN(order_date) AS first_date
  FROM orders GROUP BY customer_id
)
SELECT COUNT(*) AS cohort_size,
       SUM(CASE WHEN EXISTS (
         SELECT 1 FROM orders o
         WHERE o.customer_id = f.customer_id
           AND o.order_date >= DATE '2024-02-01' AND o.order_date < DATE '2024-03-01'
       ) THEN 1 ELSE 0 END) AS ordered_in_feb
FROM first_order f
WHERE f.first_date >= DATE '2024-01-01' AND f.first_date < DATE '2024-02-01';`)}
<p>Check on the sample data: task 2 returns Pune: Asha 1200 (Ravi has 800) and Delhi: Meena 1100 (Kiran has 250). Jay has no orders, so Mumbai does not appear. Task 3: January 1700, February 1400 (-17.6%), March 250 (-82.1%). Task 5: January first-order customers are 1, 2, 3 (cohort_size = 3); all three also ordered in February, so ordered_in_feb = 3. Task 4: customer 1 second order 2024-01-20 and gap 15 days; customer 2 second order 2024-02-10, gap 30 days; customer 3 second order 2024-02-18, gap 34 days.</p>
<p><b>pandas task (25 min):</b> You have <code>orders.csv</code> with order_id, customer_id, order_date, city, amount (some amounts missing, some duplicate rows). Clean it, compute monthly revenue and growth, top 3 cities by revenue, and the repeat-customer rate.</p>
${pre(`import pandas as pd

df = pd.read_csv("orders.csv", parse_dates=["order_date"])
print(df.info()); print(df.isna().sum())

# clean
df = df.drop_duplicates(subset="order_id")
df["amount"] = df["amount"].fillna(0)     # or drop, state your assumption

# monthly revenue and growth
df["month"] = df["order_date"].dt.to_period("M")
monthly = df.groupby("month", as_index=False)["amount"].sum()
monthly["growth_pct"] = monthly["amount"].pct_change() * 100

# top 3 cities
top_cities = (df.groupby("city")["amount"].sum()
                .sort_values(ascending=False)
                .head(3))

# repeat-customer rate
orders_per_cust = df.groupby("customer_id")["order_id"].nunique()
repeat_rate = (orders_per_cust > 1).mean()
print(monthly, top_cities, f"Repeat rate: {repeat_rate:.1%}")`)}`,
      practice: [
        [`Why does a LEFT JOIN with a WHERE filter on the right table's column sometimes behave like an INNER JOIN?`, `<p>Because rows with no match have NULL in the right-table columns, and a condition like <code>o.amount &gt; 100</code> is not true for NULL, so those rows are removed. Put the filter in the ON clause to keep unmatched left rows, or use IS NULL when you want the anti-join.</p>`],
        [`Write a query: customers who ordered in both January and February 2024.`, `${pre(`SELECT customer_id
FROM orders
WHERE order_date >= DATE '2024-01-01' AND order_date < DATE '2024-03-01'
GROUP BY customer_id
HAVING COUNT(DISTINCT DATE_TRUNC('month', order_date)) = 2;`)}<p>Explanation: only Jan and Feb are in range; two distinct months means both. DATE_TRUNC is PostgreSQL; in MySQL use MONTH(order_date) inside COUNT(DISTINCT ...). On the sample data this returns customers 1, 2 and 3.</p>`],
        [`Write a query to show each order with the customer's running total of amount.`, `${pre(`SELECT order_id, customer_id, order_date, amount,
  SUM(amount) OVER (PARTITION BY customer_id ORDER BY order_date, order_id
                    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
FROM orders;`)}<p>Explanation: PARTITION BY restarts the sum for each customer. Customer 1 shows 500, 800, 1200; customer 2 shows 700, 800; customer 3 shows 200, 1100; customer 4 shows 250.</p>`],
        [`pandas: how do you find customers with more than one order?`, `${pre(`counts = df.groupby("customer_id")["order_id"].nunique()
repeat_customers = counts[counts > 1].index.tolist()`)}<p>Explanation: count distinct orders per customer and keep those above 1.</p>`],
        [`pandas: convert a text column "12-05-2024" (day-month-year) into a date and make a month column.`, `${pre(`df["order_date"] = pd.to_datetime(df["order_date"], format="%d-%m-%Y")
df["month"] = df["order_date"].dt.to_period("M")`)}<p>Explanation: give the format explicitly so day and month are not mixed up.</p>`],
        [`SQL: percent of total revenue by city (use the sample tables).`, `${pre(`SELECT c.city,
       SUM(o.amount) AS revenue,
       ROUND(100.0 * SUM(o.amount) / SUM(SUM(o.amount)) OVER (), 1) AS pct_of_total
FROM customers c JOIN orders o ON o.customer_id = c.customer_id
GROUP BY c.city
ORDER BY revenue DESC;`)}<p>Explanation: a window SUM over the grouped sums gives the grand total 3350. Result: Pune 2000 (59.7), Delhi 1350 (40.3). Mumbai is missing because Jay has no orders (use LEFT JOIN to show it as 0).</p>`]
      ],
      important: [
        [`How do you check that a query result is correct?`, `<p>"I compare totals and row counts to the source table, test with a small sample I can calculate by hand, and look for duplicates after joins and for NULL handling. I also check edge cases like the first and last date."</p>`],
        [`How do you handle missing values in pandas?`, `<p>"First I check how many are missing and why. Then I choose: drop rows if few and random, fill with 0 or a median if meaningful, or flag them. I write down the assumption, because it changes the result."</p>`]
      ],
      resources: [['DataLemur (interview-style)','https://datalemur.com'],['DB Fiddle (run SQL online)','https://www.db-fiddle.com']],
      done: `You are done when you have solved 5 SQL tasks (within about 10 minutes each) and the pandas task, and you have written down the 2 patterns you missed.`
    },
    {
      title: 'Polish GitHub READMEs and LinkedIn Featured',
      time: '1.5 h',
      study: [
        `Recruiters spend under a minute on your GitHub or LinkedIn. They look for: clear headline, a short story of results, screenshots, and links that work.`,
        `A good project README answers: What problem? What data? What did you do? What did you find? How to run it? Add 1 or 2 screenshots at the top.`,
        `Lead with insights and impact, not with tool lists. "Found that late deliveries cut review scores by X points" is stronger than "Used SQL".`,
        `Pin your 3 best repositories on your GitHub profile. Add a short profile README with who you are and links.`,
        `LinkedIn: headline with role and skills, an About section of 4 to 6 lines, a Featured section with your projects, and skills that match job posts.`,
        `Do not publish private or client data. Use public datasets only, and do not include any information from your employer.`
      ],
      how: [
        `[10 min] Open each project repository. List what is missing: screenshot, insights, run steps, dataset link.`,
        `[30 min] Rewrite the README of each project using the template below (about 10 min each). Add a screenshot of the dashboard or chart.`,
        `[10 min] On GitHub: Profile, then Customize pins and pin the 3 best repos. Add a short bio line and your location (city).`,
        `[20 min] LinkedIn: update headline, About, and add each project to the Featured section (with link and image). Add the top 10 skills.`,
        `[10 min] Ask a friend to open your links in a private window and tell you what they understand in 30 seconds.`,
        `[10 min] Add the same GitHub and LinkedIn link in your resume header and check that every link works.`
      ],
      example: `<p><b>Project README template:</b></p>
${pre(`# E-commerce Sales and Customer Analytics

![Dashboard screenshot](images/dashboard.png)

## Business question
Why do most customers buy only once, and where can we improve repeat purchase?

## Data
Olist Brazilian e-commerce dataset (Kaggle), N orders, 8 tables.

## What I did
- Loaded the data to PostgreSQL, cleaned duplicates and nulls
- SQL: monthly revenue, repeat rate, cohort retention, RFM segments (CTEs, window functions)
- Power BI: star schema, DAX measures, 3-page dashboard

## Key insights
1. Only X% of customers placed a second order
2. Late deliveries were linked to review scores X points lower
3. Top X categories give Y% of revenue

## Recommendations
- Improve delivery estimates in the slowest regions
- Send a follow-up offer after a good first delivery

## Tools
PostgreSQL, Power BI (DAX), Python (pandas)

## How to run
1. Create the DB and run sql/01_schema.sql
2. Run the queries in sql/02_analysis.sql
3. Open dashboard/olist.pbix (Power BI Desktop)

## Limitations and next steps
No cost data, so profit was not analysed. Next: test a delivery-message A/B experiment.`)}
<p><b>LinkedIn headline examples:</b></p>
${pre(`Data Analyst | SQL | Power BI | Python | Survey Data and Data Quality
Aspiring Data Analyst | SQL, Power BI, Python | 2+ years in survey data and QA`)}
<p><b>About section (adjust to your truth):</b></p>
<p>"I work with survey and respondent data: logic, quality checks and client deadlines for 2+ years. I use that background to analyse data with SQL, Python (pandas) and Power BI. Recent projects: e-commerce customer analytics (cohorts and RFM), survey insights dashboard (CSAT and NPS drivers), and a marketing funnel analysis. I am open to Data Analyst roles. Projects and code are on GitHub: [link]."</p>
<p><b>Featured section:</b> add 3 items: the GitHub profile, your best dashboard (screenshot linked to the repo or Tableau Public link), and your resume PDF if you are comfortable.</p>`,
      practice: [
        [`Rewrite this bullet to show impact: "Used SQL and Power BI for analysis of sales data".`, `<p>"Analysed N orders with SQL (CTEs, window functions) and built a Power BI dashboard that showed repeat purchase is only X%, leading to 2 recommendations to improve retention."</p>`],
        [`What 5 things must every project README have?`, `<p>Business question, data source, what you did, key insights with numbers, and how to run or view it (plus a screenshot). Recommendations and limitations make it stronger.</p>`],
        [`Write your LinkedIn headline in under 120 characters for a Data Analyst job search.`, `<p>"Data Analyst | SQL | Power BI | Python | 2+ yrs Survey Data and QA" (about 62 characters). Use your real skills.</p>`],
        [`A project uses data exported from your employer. Can you publish it?`, `<p>No. Do not publish employer or client data. Use public datasets or synthetic data. If unsure, ask your manager. Publishing confidential data can end your career or your job offer.</p>`]
      ],
      important: [
        [`Can you share your GitHub or portfolio?`, `<p>"Yes. I have 3 pinned projects: an e-commerce analysis in SQL and Power BI, a survey insights dashboard, and a marketing or edtech analysis in Python. Each README has the business question, insights and screenshots. I can walk you through any of them."</p>`],
        [`How do you present your findings to a non-technical audience?`, `<p>"I start with the answer, then show 2 or 3 supporting charts, then the recommendation. I avoid jargon, use clear titles that state the insight, and tell what action to take."</p>`]
      ],
      resources: [['GitHub','https://github.com'],['Tableau Public','https://public.tableau.com']],
      done: `You are done when 3 repos are pinned with READMEs that include a screenshot and insights, and your LinkedIn headline, About and Featured sections are updated and tested in a private window.`
    },
    {
      title: 'Mock interview #3',
      time: '1.5 h',
      study: [
        `Mock #3 is your last practice. It should be tougher and shorter than a real interview: 75 minutes, with no pauses.`,
        `Ask your partner to push with follow-up questions ("why?", "what if the data had nulls?", "how would you check this?").`,
        `Compare your score to Mock #1 and Mock #2. The aim is steady improvement and no major weak area (no score below 3 out of 5).`,
        `Practise recovering from a mistake: say "Let me correct that", fix it calmly, and continue.`,
        `Finish with the questions you will ask the interviewer. Having good questions shows interest.`
      ],
      how: [
        `[5 min] Set up: camera, recording, timer, the scoring sheet from Mock #2 (see Week 11 Saturday).`,
        `[10 min] HR round: Tell me about yourself, why switch, strengths and weaknesses, expected salary.`,
        `[25 min] Technical: 3 SQL questions (one with window functions), 2 DAX questions, 2 pandas or stats questions. Have the partner change the data after you answer to test understanding.`,
        `[15 min] Case: a new business case in a style you practised least. Include a KPI question.`,
        `[10 min] Project: a 2-minute walkthrough with 3 follow-up questions.`,
        `[10 min] Quick scoring: fill your sheet, note the top 3 gaps. Spend any leftover time to fix the first gap tonight or tomorrow.`
      ],
      example: `<p><b>Mock #3 question set (tougher):</b></p>
<ul>
<li><b>SQL 1:</b> "Find users who logged in on 3 consecutive days."</li>
<li><b>SQL 2:</b> "Second highest salary per department."</li>
<li><b>SQL 3:</b> "Explain this query's output and fix the duplicated revenue after the join."</li>
<li><b>DAX:</b> "Write a measure for customers who bought last month but not this month." / "Why is my measure slow?"</li>
<li><b>Stats:</b> "Conversion rose from 4.0% to 4.4% after a change. Can you say the change worked?" Expected: need sample sizes, significance test and randomisation, consider novelty effect and seasonality.</li>
<li><b>Case:</b> "Fintech app: UPI transaction success rate fell. What do you do?"</li>
<li><b>Behavioural:</b> "Tell me about a time you disagreed with a stakeholder."</li>
</ul>
<p><b>Model SQL for consecutive days (PostgreSQL):</b></p>
${pre(`-- logins(user_id, login_date)  one row per user per day (use DISTINCT if not)
WITH d AS (
  SELECT DISTINCT user_id, login_date FROM logins
),
g AS (
  SELECT user_id, login_date,
         login_date - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date))::int AS grp
  FROM d
)
SELECT user_id, MIN(login_date) AS streak_start, MAX(login_date) AS streak_end, COUNT(*) AS days
FROM g
GROUP BY user_id, grp
HAVING COUNT(*) >= 3;`)}
<p>How it works: subtracting the row number from the date gives the same value for consecutive days (the "gaps and islands" trick).</p>
<p><b>Model answer for the conversion question:</b> "Going from 4.0% to 4.4% is a 10% relative lift, but I cannot say it worked yet. I need to know the sample size, whether users were randomly assigned, and whether the difference is statistically significant, for example with a two-proportion test. I also check for other changes at that time, like a sale. If it was a proper A/B test with enough users, then yes, and I would also look at guardrail metrics."</p>
<p><b>Scoring:</b> use the same sheet. Target: total at least 44 out of 55 with no skill below 3.</p>`,
      practice: [
        [`SQL: for logins(user_id, login_date), find the longest streak per user. (Use the consecutive days pattern.)`, `${pre(`WITH d AS (SELECT DISTINCT user_id, login_date FROM logins),
g AS (
  SELECT user_id, login_date,
         login_date - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date))::int AS grp
  FROM d
),
s AS (
  SELECT user_id, COUNT(*) AS streak FROM g GROUP BY user_id, grp
)
SELECT user_id, MAX(streak) AS longest_streak
FROM s GROUP BY user_id;`)}<p>Explanation: each streak shares one grp value. Count per grp, then take the max. With the Week 10 logins data: user 1 = 3, user 2 = 2, user 3 = 3 (the duplicate Jan 1 row is removed by DISTINCT). SQL Server: DATEADD(day, -ROW_NUMBER() OVER (...), login_date); MySQL: DATE_SUB(login_date, INTERVAL ROW_NUMBER() OVER (...) DAY).</p>`],
        [`Second highest salary per department. Table emp(emp_id, dept, salary).`, `${pre(`SELECT dept, salary FROM (
  SELECT dept, salary,
         DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS r
  FROM emp
) t WHERE r = 2;`)}<p>Explanation: DENSE_RANK handles ties; filter r = 2 in an outer query.</p>`],
        [`DAX: customers who bought last month but not in the current month (conceptually).`, `${pre(`Lost Customers =
VAR LastMonthCust =
    CALCULATETABLE(VALUES(Sales[CustomerID]), PREVIOUSMONTH('Date'[Date]))
VAR ThisMonthCust = VALUES(Sales[CustomerID])
RETURN COUNTROWS(EXCEPT(LastMonthCust, ThisMonthCust))`)}<p>Explanation: take the set of customers from the previous month and remove those present in the current filter context. It needs a proper Date table and works when the visual is at month level.</p>`],
        [`The interviewer asks a question you do not understand. What do you do?`, `<p>Ask a clarifying question or repeat it in your own words: "Do you mean X or Y?" That is a positive sign, not a weakness.</p>`],
        [`What are 2 good questions you can ask at the end of an interview?`, `<p>"What would success look like in the first 90 days?" and "What does the data stack and team structure look like, and who would I work with most?" Another: "What are the next steps in the process?"</p>`]
      ],
      important: [
        [`Conversion rose after a change. How do you know it was the change?`, `<p>"Ideally from a randomised A/B test: same time, random users, one change, a pre-defined metric, enough sample size and a significance test. Without that, other things (season, campaigns) could explain it, so I would be careful and say it is a correlation."</p>`],
        [`Tell me about a time you disagreed with someone.`, `<p>Use your STAR story: situation, what each side wanted, how you used data or an example to explain, how you reached a compromise, and the result. Stay respectful and never blame a person.</p>`]
      ],
      resources: [],
      done: `You are done when Mock #3 is scored with a total at least equal to Mock #2, no skill below 3, and you know your top 3 remaining gaps.`
    },
    {
      title: 'Salary research and negotiation script',
      time: '1.5 h',
      study: [
        `Salary depends on city, company type (product company, startup, IT services, captive/GCC), your skills and how many offers you have. Do research instead of guessing.`,
        `Where to look: Glassdoor, AmbitionBox, LinkedIn salary insights, and people you know. Always check <b>several</b> sources and treat them as rough ranges, not facts. Look at the range for "Data Analyst" with 0 to 2 years.`,
        `In India, learn the words: <b>CTC</b> (cost to company: all benefits together), <b>fixed</b> versus <b>variable</b> pay, <b>in-hand</b> (take-home after deductions like PF and tax), <b>notice period</b> and <b>joining bonus</b>.`,
        `Compare offers on the whole package: fixed pay, variable pay, bonus, insurance, learning, work mode (remote or hybrid), growth path, and the manager and team.`,
        `Give a range when asked, not a single number. Put your target in the lower half and your minimum at the bottom. Say your reason: skills and market data.`,
        `Be polite and calm. A negotiation is a conversation, not a fight. Do not lie about your current salary or offers.`
      ],
      how: [
        `[25 min] Open Glassdoor and AmbitionBox. Search "Data Analyst" and "Junior Data Analyst" in your target city. Note the range you see in 3 to 5 company types. Write them in a table with the source and date.`,
        `[10 min] Decide 3 numbers: your <b>target</b>, your <b>acceptable minimum</b>, and your <b>walk-away</b> point. Use your own research and your current CTC. Do not share the walk-away number.`,
        `[15 min] Write your answers for "What is your current CTC?" and "What is your expected CTC?" using the scripts below.`,
        `[20 min] Say each script aloud 3 times. Then practise with a partner who pushes back.`,
        `[10 min] Prepare a short list of non-salary items you can ask for: early review, learning budget, hybrid option, joining date.`,
        `[10 min] Save your research table and scripts in one document for the next interviews.`
      ],
      example: `<p><b>Research table (fill with real data from the sites; do not copy numbers from anyone else):</b></p>
${pre(`Source        | Role + city           | Range seen (check Glassdoor / AmbitionBox) | Date checked | Notes
Glassdoor     | Data Analyst, Pune    | ...                                        | ...          | company type
AmbitionBox   | Jr Data Analyst, BLR  | ...                                        | ...          | experience band
LinkedIn      | Data Analyst, Mumbai  | ...                                        | ...          | ...`)}
<p><b>Script 1: "What is your expected salary?" (early round)</b></p>
<p>"I would like to understand the role and responsibilities first. Based on my research for this kind of role and experience level in this city, and on my skills in SQL, Power BI and Python, I am looking for something in a fair market range. May I know the budget you have for this position?"</p>
<p><b>Script 2: if they insist on a number (give a range)</b></p>
<p>"From what I see on Glassdoor and AmbitionBox, entry-level analyst roles here pay in the range of [X to Y]. Considering my skills and 2 years of data experience, I am hoping for the upper part of that range. I am flexible depending on the whole package and growth in the role."</p>
<p><b>Script 3: "What is your current CTC?"</b></p>
<p>"My current CTC is [number: be honest]. I am moving to a new role, so I am looking at the market rate for the analyst role rather than only a percentage hike. I would like to be considered for [range]."</p>
<p><b>Script 4: after the offer (negotiate)</b></p>
<p>"Thank you, I am very happy to receive this offer and I am excited about the role. Based on my research and my skills, I was hoping for [your number]. Is there any flexibility on the fixed component? If not, could we discuss a review after 6 months or a learning budget?"</p>
<p><b>Script 5: ask for time to decide</b></p>
<p>"Thank you for the offer. May I have until [date] to review the details and confirm?"</p>
<p><b>Script 6: when you have another interview in progress</b></p>
<p>"I am in the final stage with another company, but your role is my preference because of [reason]. If we can align on the package, I can decide quickly."</p>
<p><b>Do not:</b> say a very low number to look humble, lie about your CTC (background checks can verify), accept on the spot, or discuss other companies' details. <b>Do:</b> ask for the offer in writing, read the fixed/variable split and the notice and bond terms, and check for any service agreement.</p>`,
      practice: [
        [`The HR asks for your expected CTC in the very first call. Give a safe reply.`, `<p>"I would like to understand the role first. Could you share the range for this position? Based on my research I expect a fair market range for an entry-level analyst, and I am flexible."</p><p>Explanation: asks for their budget without lying or naming a number too early.</p>`],
        [`Convert this CTC example into in-hand thinking: CTC Rs 6,00,000 with Rs 50,000 variable and fixed Rs 5,50,000. What should you ask?`, `<p>Ask: what is the fixed pay, how and when is the variable paid and is it guaranteed, what are PF and insurance deductions, and what is the monthly in-hand? Variable is not guaranteed, so compare fixed pay between offers. (Numbers here are only a calculation example.)</p>`],
        [`Offer A has higher CTC but a long commute and no learning; Offer B has lower CTC with a strong team and tools. How do you decide?`, `<p>List what matters: pay (fixed part), learning, manager and team quality, tools and data, growth, work mode, job security. At entry level, learning and a good manager often matter as much as a small pay difference. Choose based on a simple scored comparison.</p>`],
        [`How do you respond if the recruiter says "This is our final offer and the budget is fixed"?`, `<p>"I understand. Could we look at other parts, such as a joining bonus, a 6-month salary review, or a learning budget?" If the offer is still right for you, accept politely. If not, decline respectfully and keep the relationship.</p>`],
        [`Name 4 pieces of salary information you should have written down before any interview.`, `<p>Your target range, your acceptable minimum, your current fixed and variable pay and your notice period (and buyout possibility). Also the research table of market ranges with source and date.</p>`]
      ],
      important: [
        [`What are your salary expectations?`, `<p>"I have researched the market for this role, level and city. I am looking for a range around [X to Y], depending on the full package and growth. I am more interested in the right role, and I am flexible. What is the budget for this position?"</p>`],
        [`Why do you want this much?`, `<p>"Because of the skills I bring (SQL, Power BI, Python, data quality) and what I found in market data for similar roles. I also see this as long-term growth, so I am open to talk about structure."</p>`]
      ],
      resources: [['Glassdoor interviews','https://www.glassdoor.co.in/Interview/index.htm'],['AmbitionBox (India salaries)','https://www.ambitionbox.com']],
      done: `You are done when you have a research table from at least 2 sites, your target and minimum numbers written privately, and you can say the expected-CTC and negotiation scripts aloud calmly.`
    },
    {
      title: 'Apply to 10 more jobs + daily routine',
      time: '3.5 h',
      study: [
        `A job hunt is a numbers game plus a quality game. The goal in this phase is 5 quality applications a day on weekdays (if you can) until you have an offer, along with 2 to 3 messages to people.`,
        `Break the day into blocks: <b>search</b> (20 min), <b>apply</b> (45 min), <b>network</b> (15 min), <b>practice</b> (30 min). On busy days do a short version: 2 applications and 1 SQL problem.`,
        `Track the funnel: applications, replies, screening calls, technical rounds, offers. If replies are low (for example, fewer than 1 in 20), fix your resume and titles. If calls come but rounds fail, fix interview skills.`,
        `Use job alerts on LinkedIn, Naukri, Indeed and Foundit. Apply early: jobs posted in the last 24 to 48 hours get more attention.`,
        `Prepare 3 resume versions: Data Analyst, BI or Reporting Analyst, and Research or Survey Analyst. Choose the closest one per job.`,
        `Rejections and silence are normal at this stage. Ask for feedback politely when you get a chance.`
      ],
      how: [
        `[20 min] Review your tracker: statuses, follow-up dates, any call or interview scheduled. Send follow-ups for items older than 6 days.`,
        `[20 min] Check inbox and phone for recruiter messages. Reply within a few hours when you can.`,
        `[100 min] Apply to 10 jobs: for each, tailor the summary and keywords (about 10 minutes each). Log each one.`,
        `[30 min] Network: send 5 connection requests with a short note to analysts or recruiters at companies you applied to, and ask 2 existing contacts for referrals.`,
        `[20 min] Practise: one SQL problem or one case, aloud.`,
        `[20 min] Update the funnel counts: applied, replies, calls, interviews. Write one improvement for next week.`
      ],
      example: `<p><b>Your daily routine (weekday, 1.5 h):</b></p>
${pre(`15 min  Search: new jobs from alerts (last 24-48 h), shortlist 5
45 min  Apply: tailor summary and keywords, submit, log in tracker
15 min  Network: 2-3 messages (recruiters, alumni, referrals)
15 min  Practice: 1 SQL problem or 1 case aloud`)}
<p><b>Weekly funnel table:</b></p>
${pre(`Week | Applied | Replies | Screening calls | Technical rounds | Offers | Lesson / change
11   |  10     |         |                 |                  |        |
12   |  10+    |         |                 |                  |        |`)}
<p><b>Connection note to a professional (keep it under 200 characters: the free LinkedIn limit):</b></p>
${pre(`Hi [Name], I am moving from survey data into analytics (SQL, Power BI, Python).
I saw [Company] hires analysts. May I ask 2 quick questions about the role? Thank you.`)}
<p><b>Quick diagnosis:</b></p>
<ul>
<li>Many applications, no replies: resume or job titles are not matching. Add keywords, simplify layout, use the exact job title, and prefer jobs where you match 60% or more.</li>
<li>Replies but you fail the phone screen: practise the 2-minute intro, notice period and salary answers.</li>
<li>Pass screening, fail technical: more SQL timed practice and one dataset walkthrough.</li>
<li>Pass technical, fail manager round: practise cases, project storytelling and behavioural stories.</li>
</ul>`,
      practice: [
        [`You applied to 30 jobs and got 1 reply. What do you check first?`, `<p>The resume match: job titles, keywords and the summary. Make sure it is one page, in a simple ATS-friendly format with clear skills and 3 project bullets that show results. Also check that you apply to roles you match, and use referrals.</p>`],
        [`Write a follow-up message to a recruiter who has not replied for a week.`, `${pre(`Hi [Name], I wanted to follow up on my application for [Role] on [date].
I am still very interested and happy to share more about my SQL and Power BI projects.
Could you let me know the status? Thank you.`)}<p>Explanation: short, polite, specific, ends with a clear question.</p>`],
        [`How do you adapt your resume for a "Business Analyst" job versus a "Data Analyst" job?`, `<p>For Business Analyst, lead with stakeholder communication, requirements, and business-case thinking along with SQL and dashboards. For Data Analyst, lead with SQL, Python, Power BI and analysis projects. Keep all content true.</p>`],
        [`What do you do if a recruiter calls when you are not ready to talk?`, `<p>Say politely: "Thank you for calling. I am in the middle of something. Can we talk at [time] today or tomorrow?" Then prepare for 10 minutes using your notes. Never take an important call in a noisy place.</p>`],
        [`What metrics do you track for your job search, and why?`, `<p>Applications sent, reply rate, calls, interview rounds passed and offers. These show which stage is weak, so you fix the right thing instead of just applying more.</p>`]
      ],
      important: [
        [`Why are you changing jobs and when can you join?`, `<p>"I want to move into a full-time analytics role, which my current job does not offer. My notice period is [N] days, and I can try to join earlier if needed." Be honest, positive about the current employer, and never criticise them.</p>`],
        [`What are you doing to keep improving while you search?`, `<p>"Every day I practise SQL and cases, and I work on my projects. This week I [specific example]. I treat each interview as feedback and I update my plan after it."</p>`]
      ],
      resources: [],
      done: `You are done when 10 more applications are logged (50 or more in total), follow-ups are sent, and your funnel table is updated with one improvement for next week.`
    },
    {
      title: 'Retrospective, next 30 days, and what to learn after your first DA job',
      time: '3.5 h',
      study: [
        `A retrospective means looking back to learn: what worked, what did not, what to change. It takes 1 to 2 hours and makes the next month much better.`,
        `Score yourself honestly on 10 skills (1 to 5). A skill below 3 becomes a priority in your 30-day plan.`,
        `The 30-day plan has 4 parts: apply daily, practise interview skills, improve one project, and keep learning one new topic. Do not try to do everything.`,
        `Plan your week around fixed times. A plan that says "when I have time" does not happen.`,
        `Advanced (skip if short on time): <b>after you get your first data analyst job</b> you can look at data engineering tools. <b>Airflow</b> schedules and runs data pipelines (jobs written in Python as DAGs). <b>dbt</b> lets you write SQL models, tests and documentation for transforming data in a warehouse. <b>Cloud basics</b>: a data warehouse such as BigQuery, Snowflake or Redshift, and storage like S3 or GCS.`,
        `Advanced (skip if short on time): Learn these only when your job needs them. Right now, SQL, Power BI, Python and communication are what get you hired.`
      ],
      how: [
        `[20 min] Write what you achieved in 12 weeks: skills learned, projects built, mock scores, applications sent. Look at your tracker in this site and the Jobs page.`,
        `[30 min] Score yourself on the sheet below. For each score below 3, write one practice action.`,
        `[20 min] Write 3 things that worked (for example, daily SQL) and 3 things that did not (for example, skipping mock reviews).`,
        `[40 min] Build your 30-day plan with the template below. Put recurring blocks in your calendar with times.`,
        `[30 min] Choose one project to improve (add a README insight, new chart, SQL view or a deployed Tableau Public version).`,
        `[20 min] Write a short note to yourself: what you will do when you get a rejection and when you get an offer.`,
        `[Optional 20 min] Advanced: read the dbt and Airflow notes below and save the links for later. Do not install anything yet.`
      ],
      example: `<p><b>Self-score sheet (1 to 5):</b></p>
${pre(`Skill                               | Score | If below 3, action this month
SQL: joins and aggregation           |       |
SQL: window functions and CTEs       |       |
Excel and Power Query                |       |
Power BI: modelling and DAX          |       |
Python and pandas                    |       |
Statistics and A/B testing basics    |       |
Business cases and KPIs              |       |
Project storytelling                 |       |
HR and behavioural answers           |       |
Job-search routine                   |       |`)}
<p><b>30-day plan template:</b></p>
${pre(`Weekly rhythm (fixed times)
Mon-Fri: 60 min applications + networking, 30 min practice (SQL or case)
Sat: 1 mock interview (45-75 min) + review, 1.5 h project improvement
Sun: weekly review of the funnel, 1 h new topic, plan next week

Week 1: Fix lowest-scoring skill. Apply 25+ jobs. 1 mock.
Week 2: Improve one project (add insight + chart). Apply 25+. 1 mock.
Week 3: Practise cases and a take-home test. Apply 25+. 1 mock.
Week 4: Review funnel. Update resume version. Ask for feedback. Apply 25+. 1 mock.

Target by day 30: 100+ applications logged, 5+ interviews, offers: as many as possible.`)}
<p><b>Rejection rule:</b> After each rejection write one line: what did I learn? Do not reread the rejection. Apply to 2 more jobs that day.</p>
<p><b>Advanced (skip if short on time): what to learn after your first DA job.</b></p>
<ul>
<li><b>Airflow:</b> an open-source tool for scheduling and monitoring workflows (pipelines). You define a DAG (a graph of tasks with an order) in Python. Use case: run a daily data load, then a transformation, then send a report.</li>
<li><b>dbt:</b> turns SQL SELECT statements into tables or views in your warehouse, with tests (for example, unique and not null) and documentation. Analysts who know dbt can own their own clean data models.</li>
<li><b>Cloud basics:</b> understand storage (S3, GCS, Azure Blob), a cloud warehouse (BigQuery, Snowflake, Redshift) and how costs depend on data scanned or compute used.</li>
</ul>
${pre(`# Minimal Airflow DAG (Airflow 2.4 or later)
from datetime import datetime
from airflow import DAG
from airflow.operators.python import PythonOperator

def load_data():
    print("loading data")

with DAG(dag_id="daily_load", start_date=datetime(2024, 1, 1),
         schedule="@daily", catchup=False) as dag:
    PythonOperator(task_id="load", python_callable=load_data)`)}
${pre(`-- dbt model: models/marts/monthly_revenue.sql
select
    date_trunc('month', order_date) as month,
    sum(amount) as revenue
from {{ ref('stg_orders') }}
group by 1`)}
<p>Suggested order after your first job: strengthen SQL and modelling at work first, then a cloud warehouse, then dbt, then Airflow. Learn what your team uses.</p>`,
      practice: [
        [`Pick your 2 lowest self-scores and write one 30-minute practice action for each.`, `<p>Example: Window functions below 3: solve 3 problems on a SQL practice site and explain each aloud. Cases below 3: do one case from Week 11 using the 6-step frame and record yourself. The point is a small, specific, scheduled action.</p>`],
        [`Write 3 measurable goals for the next 30 days.`, `<p>Example: 100 applications logged; 4 mock interviews completed with a score of 44 or more; 1 project improved and republished. Goals must be countable.</p>`],
        [`What is dbt in one sentence and why do analysts like it?`, `<p>dbt is a tool where you write SQL SELECT models that it builds in your warehouse, with tests and documentation. Analysts like it because the transformations are version-controlled, reusable and tested.</p>`],
        [`What is the difference between a data analyst and a data engineer?`, `<p>An analyst explores and explains data to answer business questions (SQL, BI tools, statistics). An engineer builds and maintains the pipelines and platforms that deliver clean data (Python, Airflow, cloud, warehouses). They work together.</p>`],
        [`Advanced: why does an Airflow DAG need catchup=False in many setups?`, `<p>If start_date is in the past, Airflow by default runs a DAG run for every missed interval (backfill). catchup=False makes it run only the latest interval, which avoids a flood of old runs.</p>`]
      ],
      important: [
        [`Where do you see yourself in 2 to 3 years?`, `<p>"As a stronger analyst who owns analysis from question to recommendation, with solid SQL, modelling and some automation skills. Later I would like to grow into senior analyst or analytics lead, depending on the team's needs."</p>`],
        [`How do you keep learning?`, `<p>"I set weekly learning goals, practise with real datasets, build small projects and review what I learned every week. After this job search I plan to learn [one tool your target jobs ask for]."</p>`],
        [`Have you heard of Airflow or dbt?`, `<p>"Yes. Airflow schedules data pipelines and dbt manages SQL transformations with tests. I have not used them in a job yet, but I understand the purpose and I would learn them if the team needs them." Be honest about your level.</p>`]
      ],
      resources: [['Alex The Analyst (YouTube)','https://www.youtube.com/@AlexTheAnalyst']],
      done: `You are done when your self-score sheet and 30-day plan are written and scheduled in your calendar, and you know the one-line meaning of Airflow, dbt and a cloud warehouse (optional).`
    }
  ]
};
