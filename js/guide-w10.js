/* Week 10 guide: Interview Drilling, Technical */
GUIDES[10] = {
  intro: `<p><b>Why this week matters.</b> Most analyst hiring loops are: online test, HR screen, technical round, manager round. This week drills the <b>technical round</b>: timed SQL, Power BI/DAX, Excel, Python, statistics, aptitude and a take-home case. The goal is not to learn new things. The goal is to make what you know <b>fast, accurate and easy to say aloud</b>.</p>
<p><b>By Sunday you will be able to:</b> solve window-function problems in about 10 minutes each, answer 100 rapid-fire questions in one line each, write 5 DAX measures from memory, solve percent and ratio questions without a calculator panic, read tables and charts quickly, finish a 3-hour take-home with a 5-slide deck, and you will have one recorded mock interview with a written weak-topic list.</p>
<p><b>How to work this week.</b> Use a timer for every drill. Use a plain notebook (or notes file) for a "flag list": every question you got wrong or slow goes on it. Redo the flag list the next day. A question you can answer twice in a row, in under a minute, is "done".</p>
<p><b>Time plan:</b> Mon SQL timed set (1.5 h), Tue SQL revision (1.5 h), Wed Power BI/DAX + Excel (1.5 h), Thu Python + stats (1.5 h), Fri aptitude + take-home practice (2 h: this day is 30 minutes longer than usual), Sat mock interview (3.5 h), Sun timed take-home (3.5 h).</p>
<p><b>Honest note.</b> Your SQL run-time practice is available free in the browser at DB Fiddle (see Resources). Paste the CREATE TABLE and INSERT statements from this guide and run the answers to see the output yourself.</p>`,
  days: [
    /* ---------------- MON ---------------- */
    {
      title: 'SQL: 5 timed window-function problems',
      time: '1.5 h',
      study: [
        `A window function calculates across a set of rows related to the current row but does NOT collapse rows (GROUP BY does). Syntax: function() OVER (PARTITION BY group ORDER BY sort).`,
        `PARTITION BY splits rows into groups (like GROUP BY but rows stay). ORDER BY inside OVER sets the order used for ranking or running totals.`,
        `Ranking: ROW_NUMBER gives 1,2,3 with no ties. RANK gives 1,1,3 (gap after tie). DENSE_RANK gives 1,1,2 (no gap). For "top N including ties" and "Nth highest" use DENSE_RANK. For "keep exactly one row" use ROW_NUMBER.`,
        `LAG(col) looks at the previous row, LEAD(col) at the next row. Use LAG for growth versus last period. The first row has no previous row so LAG gives NULL.`,
        `Running total: SUM(x) OVER (ORDER BY date). With ORDER BY and no frame the default is RANGE from the start to the current row, so rows with the same date get the same total. Write ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW when you want strict row-by-row.`,
        `You cannot filter on a window function in the same SELECT's WHERE. Wrap the query in a subquery or CTE, then filter in the outer query.`,
        `Consecutive days (gaps and islands): remove duplicate dates, number the rows per user, subtract the row number from the date. Consecutive dates give the same result, so GROUP BY that result and count.`,
        `Interview habit: before writing SQL, say the plan aloud in one sentence ("rank salaries per department, keep rank 2 or less"). Then write. Then test with the sample data in your head.`
      ],
      how: [
        `[5 min] Open DB Fiddle (or any SQL tool). Choose PostgreSQL or SQLite. Paste the schema from the example (all four tables).`,
        `[10 min] Warm-up: read the five problems. Do NOT read the solutions. Set a timer to 10 minutes per problem.`,
        `[50 min] Solve Problems 1 to 5, 10 minutes each, writing and running your own SQL. If the timer ends, stop, mark the problem on your flag list, and move on.`,
        `[15 min] Compare with the solutions. For each one write what you missed: syntax, logic, or edge case (ties, NULL, duplicates).`,
        `[10 min] Redo each failed problem from a blank screen, without looking.`,
        `[10 min] Try the practice questions below, and say the answer plan aloud before typing.`
      ],
      example: `<p><b>Schema and data</b> (PostgreSQL or SQLite; salaries are in thousands):</p>
${pre(`CREATE TABLE employees (emp_id INT, name TEXT, dept TEXT, salary INT);
INSERT INTO employees VALUES
 (1,'Asha','Sales',90),(2,'Ben','Sales',80),(3,'Chitra','Sales',80),(4,'Dev','Sales',60),
 (5,'Esha','IT',120),(6,'Farid','IT',100),(7,'Gita','IT',100),(8,'Hari','IT',70),
 (9,'Isha','HR',50),(10,'Jai','HR',55);

CREATE TABLE monthly_sales (month_start DATE, revenue INT);
INSERT INTO monthly_sales VALUES
 ('2025-01-01',100),('2025-02-01',120),('2025-03-01',90),('2025-04-01',135);

CREATE TABLE logins (user_id INT, login_date DATE);
INSERT INTO logins VALUES
 (1,'2025-01-01'),(1,'2025-01-02'),(1,'2025-01-03'),(1,'2025-01-05'),
 (2,'2025-01-01'),(2,'2025-01-03'),(2,'2025-01-04'),
 (3,'2025-01-01'),(3,'2025-01-01'),(3,'2025-01-02'),(3,'2025-01-03');

CREATE TABLE customers (cust_id INT, email TEXT, updated_at DATE);
INSERT INTO customers VALUES
 (1,'a@x.com','2025-01-01'),(2,'a@x.com','2025-03-01'),(3,'b@x.com','2025-02-01'),
 (4,'c@x.com','2025-01-15'),(5,'c@x.com','2025-01-20'),(6,'c@x.com','2025-01-20');`)}
<h4>Problem 1 (10 min): Top 2 salaries in each department, ties included. Show dept, name, salary.</h4>
${pre(`SELECT dept, name, salary
FROM (SELECT dept, name, salary,
             DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS rnk
      FROM employees) t
WHERE rnk <= 2
ORDER BY dept, rnk, name;`)}
${pre(`Expected: HR Jai 55 | HR Isha 50 | IT Esha 120 | IT Farid 100 | IT Gita 100
          Sales Asha 90 | Sales Ben 80 | Sales Chitra 80`)}
<p>Why: DENSE_RANK restarts for each dept. Farid and Gita tie at rank 2 so both appear. Dev (60, the third salary level in Sales) and Hari (70, the third level in IT) are excluded. ROW_NUMBER would have dropped one of the tied people.</p>
<h4>Problem 2 (10 min): For each month show revenue, running total, and month-over-month growth %.</h4>
${pre(`SELECT month_start, revenue,
       SUM(revenue) OVER (ORDER BY month_start) AS running_total,
       ROUND((revenue - LAG(revenue) OVER (ORDER BY month_start)) * 100.0
             / NULLIF(LAG(revenue) OVER (ORDER BY month_start), 0), 1) AS mom_pct
FROM monthly_sales
ORDER BY month_start;`)}
${pre(`Expected: 2025-01-01 100 100 NULL
          2025-02-01 120 220 20.0
          2025-03-01 90  310 -25.0
          2025-04-01 135 445 50.0`)}
<p>Why: (120-100)/100 = 20%; (90-120)/120 = -25%; (135-90)/90 = 50%. NULLIF protects against divide-by-zero. January has no previous month, so NULL is correct.</p>
<h4>Problem 3 (10 min): Users who logged in on 3 or more consecutive days.</h4>
${pre(`-- PostgreSQL
WITH d AS (SELECT DISTINCT user_id, login_date FROM logins),
g AS (SELECT user_id, login_date,
             login_date - (ROW_NUMBER() OVER (PARTITION BY user_id
                                              ORDER BY login_date))::int AS grp
      FROM d)
SELECT user_id, MIN(login_date) AS streak_start,
       MAX(login_date) AS streak_end, COUNT(*) AS days
FROM g
GROUP BY user_id, grp
HAVING COUNT(*) >= 3;`)}
${pre(`Expected: user 1 | 2025-01-01 | 2025-01-03 | 3
          user 3 | 2025-01-01 | 2025-01-03 | 3`)}
<p>Why: user 1 has Jan 1,2,3 then 5 (a gap). User 2 has 1, 3, 4: only 2 in a row. User 3 has a duplicate Jan 1 row, which DISTINCT removes first; then 1,2,3 is a 3-day streak. In SQL Server use DATEADD(day, -ROW_NUMBER() OVER (...), login_date) instead of the minus sign. In SQLite use julianday(login_date) - ROW_NUMBER() OVER (...). In MySQL use DATE_SUB(login_date, INTERVAL ROW_NUMBER() OVER (...) DAY).</p>
<h4>Problem 4 (10 min): The 3rd highest salary in each department (distinct salary levels). Departments with fewer than 3 levels return nothing.</h4>
${pre(`SELECT dept, name, salary
FROM (SELECT dept, name, salary,
             DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS rnk
      FROM employees) t
WHERE rnk = 3
ORDER BY dept;`)}
${pre(`Expected: IT Hari 70 | Sales Dev 60      (HR has only 2 salary levels: no row)`)}
<p>Why: Sales levels are 90, 80, 60 so the third is 60. IT levels are 120, 100, 70 so the third is 70. Change 3 to N for any N.</p>
<h4>Problem 5 (10 min): Remove duplicate emails from customers. Keep the most recently updated row; if tied on date keep the higher cust_id. First show the rows to keep, then delete the others.</h4>
${pre(`-- rows to keep
SELECT cust_id, email, updated_at
FROM (SELECT *, ROW_NUMBER() OVER (PARTITION BY email
                                   ORDER BY updated_at DESC, cust_id DESC) AS rn
      FROM customers) t
WHERE rn = 1;

-- delete the rest
DELETE FROM customers
WHERE cust_id IN (
  SELECT cust_id FROM (
    SELECT cust_id, ROW_NUMBER() OVER (PARTITION BY email
                                       ORDER BY updated_at DESC, cust_id DESC) AS rn
    FROM customers) t
  WHERE rn > 1);`)}
${pre(`Expected rows kept: cust_id 2 (a@x.com), 3 (b@x.com), 6 (c@x.com)`)}
<p>Why: for a@x.com, 2025-03-01 is the latest so cust 2 stays. For c@x.com, cust 5 and 6 tie on date, so the tie-breaker cust_id DESC keeps 6. In MySQL, deleting from a table that you also select from in a subquery needs an extra wrapper or a join-delete; mention that if asked.</p>`,
      practice: [
        [`Write a query for the second highest salary overall (not per department). Use the employees table.`, `${pre(`SELECT DISTINCT salary
FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS r
      FROM employees) t
WHERE r = 2;`)}<p>Result: 100. Distinct salaries are 120, 100, 90 ... so rank 2 is 100. DISTINCT is needed because two people have 100.</p>`],
        [`Show each employee's salary and the gap to the highest salary in the same department.`, `${pre(`SELECT name, dept, salary,
       salary - MAX(salary) OVER (PARTITION BY dept) AS gap_to_max
FROM employees;`)}<p>Example: Farid in IT shows -20 (100 minus 120). The top person in each dept shows 0.</p>`],
        [`Show each employee's share of the department salary total, as a percent with 1 decimal.`, `${pre(`SELECT dept, name,
       ROUND(salary * 100.0 / SUM(salary) OVER (PARTITION BY dept), 1) AS pct
FROM employees;`)}<p>Example: Isha is 50 / (50+55) = 47.6%; Jai is 52.4%. The 100.0 forces decimal math.</p>`],
        [`List employees earning more than the average of their own department. How many are there per department?`, `${pre(`SELECT dept, COUNT(*) AS n
FROM (SELECT dept, salary,
             AVG(salary) OVER (PARTITION BY dept) AS avg_sal
      FROM employees) t
WHERE salary > avg_sal
GROUP BY dept;`)}<p>Result: HR 1, IT 3, Sales 3. Averages are 52.5, 97.5 and 77.5.</p>`],
        [`Rewrite Problem 2's running total so that it adds row by row even if two rows share the same date.`, `${pre(`SELECT month_start, revenue,
       SUM(revenue) OVER (ORDER BY month_start, revenue
                          ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
FROM monthly_sales
ORDER BY month_start;
-- running_total: 100, 220, 310, 445 (same here because every month_start is unique)`)}<p>Without ROWS, the default RANGE frame gives tied dates the same total. ROWS counts physical rows. Add a tie-break column to the ORDER BY (here revenue; in real data an id) so the row-by-row order is repeatable.</p>`],
        [`Show for each login the previous login date for user 2 (use LAG).`, `${pre(`SELECT user_id, login_date,
       LAG(login_date) OVER (PARTITION BY user_id ORDER BY login_date) AS prev_login
FROM (SELECT DISTINCT user_id, login_date FROM logins) d
WHERE user_id = 2;`)}<p>Rows: 2025-01-01 NULL; 2025-01-03 prev 2025-01-01; 2025-01-04 prev 2025-01-03. Day gap = date minus prev date.</p>`]
      ],
      important: [
        [`ROW_NUMBER vs RANK vs DENSE_RANK: when do you use each?`, `<p>"For salaries 100, 100, 90: ROW_NUMBER gives 1, 2, 3 and always picks one row, good for dedupe. RANK gives 1, 1, 3 and skips after a tie. DENSE_RANK gives 1, 1, 2 with no gaps, which is what I use for top N and Nth highest including ties."</p>`],
        [`Why can't you use a window function in WHERE?`, `<p>"Because the logical order is FROM, WHERE, GROUP BY, HAVING, SELECT. Window functions are calculated in the SELECT step, after WHERE. So I calculate the rank in a subquery or CTE and filter in the outer query."</p>`],
        [`Find users with 3 consecutive login days. Explain the idea.`, `<p>"I remove duplicate dates, number each user's dates with ROW_NUMBER, then subtract the row number from the date. A run of consecutive days gives one constant value. I group by user and that value and keep groups with count 3 or more."</p>`]
      ],
      resources: [
        [`DB Fiddle (run SQL online)`, `https://www.db-fiddle.com`],
        [`Window Functions practice`, `https://www.windowfunctions.com`],
        [`DataLemur (interview-style)`, `https://datalemur.com`]
      ],
      done: `You are done when you can write top-N per group, running total with growth, consecutive-days, Nth highest and dedupe queries from a blank screen, each in about 10 minutes, and you know your three weakest.`
    },
    /* ---------------- TUE ---------------- */
    {
      title: 'SQL Q&A full revision and flagged questions',
      time: '1.5 h',
      study: [
        `Revision method: read the question, cover the answer, say your answer aloud in one or two sentences, then check. If you hesitate for more than 10 seconds, flag it.`,
        `Flag list: write flagged questions on a card or file. Re-do them tomorrow, then 3 days later, then a week later. Done means correct twice in a row.`,
        `Join row-count questions are classic. Duplicate keys multiply rows: if a key appears 2 times in A and 2 times in B, the join gives 4 rows for that key.`,
        `NULL traps: NULL = NULL is not true (use IS NULL). NOT IN with a NULL in the list returns no rows at all. Use NOT EXISTS or filter NULLs.`,
        `LEFT JOIN trap: a WHERE condition on the right table (WHERE o.status = 'paid') removes the NULL rows and turns the LEFT JOIN into an INNER JOIN. Put that condition in the ON clause instead.`,
        `Aggregates: COUNT(*) counts rows, COUNT(col) counts non-NULL values, COUNT(DISTINCT col) counts unique non-NULL values. HAVING filters groups, WHERE filters rows.`,
        `Know the logical order: FROM and JOIN, WHERE, GROUP BY, HAVING, SELECT, DISTINCT, ORDER BY, LIMIT. It explains most errors (for example, an alias from SELECT cannot be used in WHERE).`,
        `Also be ready to talk about performance: indexes speed up search and join keys but slow inserts; avoid SELECT *; filter early; use EXISTS for existence checks.`
      ],
      how: [
        `[10 min] Open the SQL section of the Interview Q&A page on this site. Read the list of questions only (not answers).`,
        `[30 min] Rapid-fire round 1: go through the 20 questions in the example. Answer each aloud in one line, then check. Put a flag on any miss.`,
        `[20 min] Tricky outputs: type the schema from the example into DB Fiddle and predict the output of each query BEFORE running. Compare.`,
        `[15 min] Re-do your flagged questions from Monday's problems (write the SQL again from scratch).`,
        `[10 min] Go through the SQL Q&A page questions you marked as hard in earlier weeks. Re-answer aloud.`,
        `[5 min] Write the top 3 weak SQL topics on your flag list with the next revision date.`
      ],
      example: `<h4>20 rapid-fire SQL questions (answer aloud, then check)</h4>
<ol>
<li><b>WHERE vs HAVING?</b> WHERE filters rows before grouping; HAVING filters groups after aggregation.</li>
<li><b>INNER vs LEFT JOIN?</b> INNER keeps only matches; LEFT keeps all left rows and gives NULL where there is no match.</li>
<li><b>Primary key vs foreign key?</b> PK uniquely identifies a row (no NULLs); FK points to a PK in another table.</li>
<li><b>UNION vs UNION ALL?</b> UNION removes duplicates and is slower; UNION ALL keeps everything.</li>
<li><b>COUNT(*) vs COUNT(col)?</b> All rows versus non-NULL values in that column.</li>
<li><b>How to test for NULL?</b> IS NULL / IS NOT NULL; never = NULL.</li>
<li><b>ROW_NUMBER vs RANK vs DENSE_RANK?</b> Unique numbers; ties then a gap; ties with no gap.</li>
<li><b>What do LAG and LEAD do?</b> Return a value from the previous or next row in the window order.</li>
<li><b>What is a CTE?</b> A named temporary result set defined with WITH, used in the next query; makes SQL readable.</li>
<li><b>Subquery vs CTE?</b> Same result mostly; a CTE is named, readable and reusable inside one statement.</li>
<li><b>DELETE vs TRUNCATE vs DROP?</b> Remove chosen rows; remove all rows fast; remove the whole table.</li>
<li><b>Logical order of a query?</b> FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT.</li>
<li><b>What is an index?</b> A structure (often B-tree) that speeds lookups and joins but slows writes and uses space.</li>
<li><b>EXISTS vs IN?</b> EXISTS checks that a matching row exists and can stop early; IN compares with a list and is risky with NULLs in NOT IN.</li>
<li><b>NOT IN problem?</b> If the list contains NULL, NOT IN returns no rows; use NOT EXISTS.</li>
<li><b>What is a self join?</b> A table joined to itself, for example employee to manager.</li>
<li><b>Find duplicates?</b> GROUP BY the columns and HAVING COUNT(*) greater than 1.</li>
<li><b>What does CASE WHEN do?</b> If/else logic in SQL, for example to create buckets or conditional sums.</li>
<li><b>GROUP BY vs PARTITION BY?</b> GROUP BY collapses rows to one per group; PARTITION BY keeps every row and adds a group-level calculation.</li>
<li><b>Default window frame with ORDER BY?</b> Range from the start to the current row; ties get the same running total, so use ROWS to be strict.</li>
</ol>
<h4>Tricky outputs (predict first)</h4>
${pre(`CREATE TABLE a (id INT);  INSERT INTO a VALUES (1),(1),(2);
CREATE TABLE b (id INT);  INSERT INTO b VALUES (1),(1),(3);

-- Q1
SELECT COUNT(*) FROM a JOIN b ON a.id = b.id;          -- ?
-- Q2
SELECT COUNT(*) FROM a LEFT JOIN b ON a.id = b.id;     -- ?

CREATE TABLE x (id INT);  INSERT INTO x VALUES (1),(2),(3);
CREATE TABLE y (id INT);  INSERT INTO y VALUES (1),(NULL);

-- Q3
SELECT id FROM x WHERE id NOT IN (SELECT id FROM y);   -- ?
-- Q4
SELECT id FROM x WHERE NOT EXISTS (SELECT 1 FROM y WHERE y.id = x.id);   -- ?
-- Q5
SELECT COUNT(*), COUNT(id), COUNT(DISTINCT id) FROM y; -- ?`)}
${pre(`Answers
Q1 = 4   (id 1: 2 x 2 rows; id 2 has no match)
Q2 = 5   (those 4 rows + id 2 with NULLs)
Q3 = no rows   (NOT IN against a list containing NULL is never true)
Q4 = 2 and 3
Q5 = 2, 1, 1`)}
<p><b>Why Q3 is empty:</b> id NOT IN (1, NULL) means id &lt;&gt; 1 AND id &lt;&gt; NULL. The second part is "unknown", never true, so no row passes. NOT EXISTS has no such problem.</p>
<p><b>LEFT JOIN filter trap:</b> customers A, B, C; orders: A paid, A cancelled, B cancelled.</p>
${pre(`-- turns into INNER JOIN: only A appears
SELECT c.name, o.order_id
FROM customers c LEFT JOIN orders o ON c.id = o.cust_id
WHERE o.status = 'paid';

-- keeps all customers; paid order shown only where it exists
SELECT c.name, o.order_id
FROM customers c LEFT JOIN orders o
  ON c.id = o.cust_id AND o.status = 'paid';`)}
<p>The first returns only A. The second returns A with the paid order, and B and C with NULL. Moving the condition to ON keeps the unmatched customers.</p>`,
      practice: [
        [`Tables A has ids (1,1,2) and B has ids (1,1,3). How many rows does a FULL OUTER JOIN on id give?`, `<p><b>6</b>. The 4 matching rows for id 1, plus id 2 from A with NULLs, plus id 3 from B with NULLs.</p>`],
        [`The query SELECT dept, COUNT(*) FROM emp WHERE COUNT(*) greater than 2 GROUP BY dept fails. Why and what is the fix?`, `${pre(`SELECT dept, COUNT(*)
FROM emp
GROUP BY dept
HAVING COUNT(*) > 2;`)}<p>Aggregates cannot be used in WHERE because WHERE runs before grouping. Use HAVING.</p>`],
        [`Count orders per customer including customers with zero orders (customers C(id,name), orders O(order_id, cust_id)).`, `${pre(`SELECT c.name, COUNT(o.order_id) AS n_orders
FROM customers c
LEFT JOIN orders o ON c.id = o.cust_id
GROUP BY c.name;`)}<p>Count the right table's column, not COUNT(*), because COUNT(*) would count the NULL row as 1.</p>`],
        [`Find customers who ordered in January but not in February (orders: cust_id, order_date).`, `${pre(`SELECT DISTINCT cust_id FROM orders
WHERE order_date >= '2025-01-01' AND order_date < '2025-02-01'
  AND cust_id NOT IN (
    SELECT cust_id FROM orders
    WHERE order_date >= '2025-02-01' AND order_date < '2025-03-01'
      AND cust_id IS NOT NULL);`)}<p>Uses half-open date ranges (works for dates with times). The IS NOT NULL guard avoids the NOT IN NULL trap.</p>`],
        [`Show the second order of each customer (orders: order_id, cust_id, order_date).`, `${pre(`SELECT cust_id, order_id
FROM (SELECT cust_id, order_id,
             ROW_NUMBER() OVER (PARTITION BY cust_id ORDER BY order_date) AS rn
      FROM orders) t
WHERE rn = 2;`)}<p>ROW_NUMBER numbers each customer's orders by date. Customers with one order do not appear.</p>`],
        [`Employees (emp_id, name, manager_id). Find employees who earn more than their manager (salary column too).`, `${pre(`SELECT e.name
FROM employees e
JOIN employees m ON e.manager_id = m.emp_id
WHERE e.salary > m.salary;`)}<p>A self join: the same table is used twice, once as employee (e) and once as manager (m).</p>`]
      ],
      important: [
        [`A join returns more rows than expected. How do you debug it?`, `<p>"I check whether the join keys are unique in each table with GROUP BY and HAVING COUNT greater than 1. Duplicate keys multiply rows. Then I dedupe one side, join on more columns, or aggregate before joining."</p>`],
        [`What is the difference between EXISTS and IN? When is NOT IN dangerous?`, `<p>"EXISTS asks whether a matching row exists and can stop at the first match. IN compares to a list. NOT IN is dangerous when the list has a NULL, because then no row passes the test. I use NOT EXISTS for that case."</p>`],
        [`How would you find and delete duplicate rows?`, `<p>"Find them with GROUP BY and HAVING COUNT greater than 1. To delete, number rows per duplicate group with ROW_NUMBER, ordered by the rule that decides which row to keep, and delete rows where the number is greater than 1."</p>`]
      ],
      resources: [
        [`DB Fiddle (run SQL online)`, `https://www.db-fiddle.com`],
        [`StrataScratch (company questions)`, `https://www.stratascratch.com`]
      ],
      done: `You are done when you can answer all 20 rapid-fire SQL questions in one line without hesitation, predict the five tricky outputs correctly, and every flagged question has been redone once.`
    },
    /* ---------------- WED ---------------- */
    {
      title: 'Power BI, DAX and Excel Q&A revision',
      time: '1.5 h',
      study: [
        `DAX measures are calculated at report time using the current filters. Calculated columns are calculated at refresh, row by row, and stored. Use measures for totals and ratios.`,
        `CALCULATE changes the filter context: CALCULATE(expression, filter1, filter2). It is the most important DAX function and a favourite interview question.`,
        `Row context means "the current row" (calculated columns and iterator functions like SUMX). Filter context means the filters from slicers, visuals, rows and columns of a matrix.`,
        `Time intelligence (SAMEPERIODLASTYEAR, TOTALYTD, DATESYTD) needs a proper Calendar table with continuous dates, marked as a date table, related to your fact table by date.`,
        `Star schema: one fact table (events, sales) in the middle and dimension tables (customer, product, date) around it, joined one-to-many with single-direction filters. It is faster and gives correct results.`,
        `ALL removes filters (for example for a grand total used in percent of total). ALLSELECTED keeps the filters coming from outside the visual (like slicers) and removes only the ones from the visual's own rows and columns.`,
        `Excel: XLOOKUP replaces VLOOKUP (looks left or right, exact match by default). SUMIFS/COUNTIFS for conditional totals, pivot tables for quick summaries, Power Query for repeatable cleaning.`,
        `Be ready to describe one real Power BI project: data, model, 3 measures, 3 visuals, insight and how you checked the numbers.`
      ],
      how: [
        `[10 min] Warm-up: close the guide and write 5 DAX measures from memory on paper or in a notes file (use the brief in the example). Do not peek.`,
        `[15 min] Compare with the answers. Fix errors. For each one, say aloud what it calculates.`,
        `[20 min] Rapid-fire round: answer the 12 Power BI/DAX questions aloud, one or two sentences each. Flag any hesitation.`,
        `[15 min] Rapid-fire round: answer the 8 Excel questions aloud.`,
        `[20 min] Open Power BI Desktop and type the five measures in a small model (even your Project 3 data) to see that they run. Open Excel and try the formulas in the example.`,
        `[10 min] Say your project walkthrough aloud once, with one DAX measure explained.`
      ],
      example: `<h4>Part 1: Write 5 DAX measures from memory</h4>
<p>Brief: tables Sales (OrderID, CustomerID, Amount, OrderDate), Calendar (Date) related to Sales[OrderDate], and Product (ProductKey, ProductName) related to Sales.</p>
${pre(`1  Total Sales = SUM(Sales[Amount])

2  Orders = DISTINCTCOUNT(Sales[OrderID])

3  Avg Order Value = DIVIDE([Total Sales], [Orders])

4  Sales LY = CALCULATE([Total Sales], SAMEPERIODLASTYEAR('Calendar'[Date]))
   YoY % = DIVIDE([Total Sales] - [Sales LY], [Sales LY])

5  Sales YTD = TOTALYTD([Total Sales], 'Calendar'[Date])`)}
<p><b>Extra measures if you have time:</b></p>
${pre(`% of All Products = DIVIDE([Total Sales], CALCULATE([Total Sales], ALL('Product')))

Unique Customers = DISTINCTCOUNT(Sales[CustomerID])

-- Advanced (skip if short on time)
Product Rank = RANKX(ALL('Product'[ProductName]), [Total Sales])`)}
<p><b>Mini test.</b> Data: 2024 has orders O1 (100 + 50), O2 (200) for customers C1, C2; 2025 has O3 (150) for C1. With no filter: Total Sales = 500, Orders = 3, Avg Order Value = 166.67. With a year slicer on 2025: Total Sales = 150, Sales LY = 350 (all 2024), YoY % = (150 - 350) / 350 = <b>-57.1%</b>. Why: SAMEPERIODLASTYEAR shifts the date filter back one year and CALCULATE re-evaluates the total in that new context. Note O1 has two rows, so DISTINCTCOUNT(OrderID) counts it once.</p>
<h4>Part 2: Excel practice table</h4>
${pre(`      A       B      C     D
1  Region  Product Qty   Price
2  East    Pen     10    5
3  West    Pen     20    5
4  East    Book    5     40
5  West    Book    8     40
6  East    Pen     15    5`)}
${pre(`=SUMIFS(C2:C6, A2:A6, "East", B2:B6, "Pen")           -> 25
=COUNTIFS(A2:A6, "East", B2:B6, "Pen")                 -> 2
=SUMPRODUCT((A2:A6="East")*C2:C6*D2:D6)                -> 325   (revenue for East)
=XLOOKUP("Book", B2:B6, D2:D6, "Not found")            -> 40
=XLOOKUP("Cap",  B2:B6, D2:D6, "Not found")            -> Not found
=INDEX(D2:D6, MATCH("Book", B2:B6, 0))                  -> 40`)}
<p><b>Check:</b> East Pen quantities are 10 and 15 = 25. East revenue = 10 x 5 + 5 x 40 + 15 x 5 = 50 + 200 + 75 = 325. The lookups return the first match. A pivot table with Region in rows and Sum of Qty in values would show East 30, West 28.</p>
<h4>Part 3: 12 rapid-fire Power BI and DAX questions</h4>
<ol>
<li><b>Measure vs calculated column?</b> Measure: calculated on the fly with the current filters. Column: stored per row at refresh; use for categories, not totals.</li>
<li><b>What is a star schema?</b> One fact table with dimension tables around it; faster and cleaner.</li>
<li><b>What does CALCULATE do?</b> Evaluates an expression after changing the filter context.</li>
<li><b>Row context vs filter context?</b> Current row (column or iterator) versus the filters from slicers and visuals.</li>
<li><b>Why a Calendar table?</b> Time intelligence needs continuous dates with no gaps, related to the fact table.</li>
<li><b>Import vs DirectQuery?</b> Import copies data in (fast, scheduled refresh); DirectQuery queries the source live (fresh, usually slower).</li>
<li><b>What is Row-Level Security?</b> DAX rules per role that limit which rows a user can see.</li>
<li><b>Merge vs Append?</b> Merge joins tables side by side on keys; Append stacks rows.</li>
<li><b>SUM vs SUMX?</b> SUM adds a column; SUMX evaluates an expression row by row, then sums.</li>
<li><b>Why use DIVIDE?</b> It handles divide-by-zero by returning blank (or a given alternative).</li>
<li><b>ALL vs ALLSELECTED?</b> ALL removes all filters; ALLSELECTED keeps outside filters such as slicers.</li>
<li><b>Why avoid bi-directional relationships?</b> They can cause ambiguity, wrong numbers and slow reports; prefer single direction and a clean star schema.</li>
</ol>
<h4>Part 4: 8 rapid-fire Excel questions</h4>
<ol>
<li><b>VLOOKUP vs XLOOKUP?</b> XLOOKUP looks any direction, defaults to exact match and has a not-found argument.</li>
<li><b>INDEX-MATCH?</b> Flexible lookup that does not break when columns are inserted.</li>
<li><b>SUMIFS vs SUMIF?</b> SUMIFS allows several conditions.</li>
<li><b>Absolute vs relative reference?</b> $A$1 stays fixed when copied; A1 shifts.</li>
<li><b>Handle #N/A or #DIV/0!?</b> IFERROR or IFNA around the formula.</li>
<li><b>What is a pivot table?</b> A drag-and-drop summary of a table by rows, columns and values.</li>
<li><b>Power Query vs formulas?</b> Power Query makes repeatable, refreshable cleaning; formulas are for in-sheet calculations.</li>
<li><b>Clean text data?</b> TRIM, CLEAN, PROPER or UPPER, Remove Duplicates, Text to Columns, convert text numbers.</li>
</ol>`,
      practice: [
        [`Write a measure for Customers Who Ordered and one for Orders per Customer.`, `${pre(`Customers = DISTINCTCOUNT(Sales[CustomerID])
Orders per Customer = DIVIDE([Orders], [Customers])`)}<p>With the mini test data for all years: 3 orders / 2 customers = 1.5.</p>`],
        [`Write a measure that shows sales only for the "East" region, using CALCULATE (table Sales has a Region column).`, `${pre(`East Sales = CALCULATE([Total Sales], Sales[Region] = "East")`)}<p>CALCULATE replaces any filter on Region with East, so the number is always East's sales.</p>`],
        [`Excel: from the practice table, what does =SUMIFS(C2:C6, B2:B6, "Book") return?`, `<p><b>13</b>. Book quantities are 5 and 8.</p>`],
        [`Write a measure for Month-to-Date and say what it needs.`, `${pre(`Sales MTD = TOTALMTD([Total Sales], 'Calendar'[Date])`)}<p>It needs a Calendar table related to the fact table and marked as a date table.</p>`],
        [`Your report is slow. Give 4 fixes.`, `<p>Use a star schema; remove unused columns and tables; reduce the number of visuals per page; replace calculated columns with measures where possible; use Import mode with aggregated tables; avoid high-cardinality columns such as unique IDs in visuals.</p>`],
        [`Why does a total row show a wrong ratio when you average a ratio column? Give the fix.`, `<p>An average of row ratios ignores the weight of each row. Create a measure that divides the sum of the numerator by the sum of the denominator, using DIVIDE.</p>`]
      ],
      important: [
        [`Explain CALCULATE with an example.`, `<p>"CALCULATE evaluates an expression in a modified filter context. For example, North Sales = CALCULATE([Total Sales], Sales[Region] = "North") always gives North's sales, even when a slicer is set to another region, because the filter on Region is replaced."</p>`],
        [`Calculated column or measure for profit margin %? Why?`, `<p>"A measure. Margin is a ratio, so I divide total profit by total revenue at the current filter. A column would be fixed per row and the total would be wrong."</p>`],
        [`How do you do year-over-year growth in DAX?`, `<p>"With a Calendar table I make Sales LY = CALCULATE([Total Sales], SAMEPERIODLASTYEAR('Calendar'[Date])) and YoY % = DIVIDE([Total Sales] - [Sales LY], [Sales LY]). DIVIDE avoids errors when last year is zero."</p>`],
        [`How do you choose between XLOOKUP and a Power BI relationship?`, `<p>"In Excel I use XLOOKUP for quick one-off lookups. In Power BI I use relationships in the data model so every visual uses the same join, and I avoid merging in Power Query unless I need columns physically in one table."</p>`]
      ],
      resources: [
        [`DAX Guide`, `https://dax.guide`],
        [`SQLBI`, `https://www.sqlbi.com`],
        [`Chandoo.org`, `https://chandoo.org`]
      ],
      done: `You are done when you can write the five core DAX measures from memory without errors, answer the 12 Power BI and 8 Excel questions in one or two sentences each, and have flagged the weak ones.`
    },
    /* ---------------- THU ---------------- */
    {
      title: 'Python and statistics Q&A revision',
      time: '1.5 h',
      study: [
        `Python data structures: list (ordered, changeable), tuple (ordered, fixed), set (unique values), dict (key-value pairs). Dict and set lookups are fast.`,
        `pandas basics: Series is one column, DataFrame is a table. loc selects by label or condition, iloc by position. groupby + agg summarises, merge joins, pivot_table reshapes, drop_duplicates dedupes, fillna handles missing.`,
        `Vectorised operations (df.a + df.b) are much faster than loops or apply. Use apply only when no vectorised way exists.`,
        `Dates: pd.to_datetime(col, errors='coerce') converts text to dates; then use the .dt accessor (dt.month, dt.year, dt.to_period('M')).`,
        `Statistics basics: mean is sensitive to outliers, median is robust. Standard deviation measures spread. IQR rule flags outliers below Q1 - 1.5 x IQR or above Q3 + 1.5 x IQR.`,
        `A p-value is the probability of seeing a result at least this extreme if there were truly no effect. A small p-value (below 0.05) means the result is unlikely to be chance. It is NOT the probability that the hypothesis is true, and it does not tell you the size of the effect.`,
        `Confidence interval: a range of plausible values for the true effect. If the CI for a difference excludes zero, the difference is significant at that level.`,
        `Type I error = false positive (alpha). Type II error = false negative (beta). A/B tests need a clear hypothesis, a primary metric, a pre-set sample size, random assignment and a fixed duration, and you must not stop the test early just because it looks good.`
      ],
      how: [
        `[10 min] Open a notebook. Re-create the orders table in the example and run the code. Check outputs match.`,
        `[20 min] Python rapid-fire: answer the 12 questions aloud in one or two sentences. Flag misses. Then type any code answers you were unsure about.`,
        `[15 min] Do the A/B test calculation by hand using the example numbers (do not use a library first). Then check with Python.`,
        `[20 min] Statistics rapid-fire: answer the 8 questions aloud. Practice explaining p-value and confidence interval to a non-technical person.`,
        `[15 min] Re-do 3 flagged Python or stats questions from the Interview Q&A page.`,
        `[10 min] Update your flag list with the top 3 weak topics.`
      ],
      example: `<h4>Part 1: pandas on a small orders table</h4>
${pre(`import pandas as pd

orders = pd.DataFrame({
  'order_id': [1,2,3,4,5,6],
  'cust_id':  [10,11,10,12,11,10],
  'order_date': ['2025-01-05','2025-01-20','2025-02-03','2025-02-10','2025-03-01','2025-03-15'],
  'amount':   [200,150,300,None,120,180]})
custs = pd.DataFrame({'cust_id':[10,11,13], 'city':['Pune','Delhi','Mumbai']})

orders['order_date'] = pd.to_datetime(orders['order_date'])
orders['month'] = orders['order_date'].dt.to_period('M').astype(str)

print(orders['amount'].isna().sum())                 # 1 missing amount

m = orders.merge(custs, on='cust_id', how='left')     # keep all orders
print(m.groupby('city', dropna=False)['amount'].agg(['count','sum','mean']))

print(orders.groupby('month')['amount'].sum())

per_cust = orders.groupby('cust_id')['order_id'].nunique()
print((per_cust >= 2).mean())                          # repeat-customer rate`)}
${pre(`Output
1
        count    sum        mean
city
Delhi       2  270.0  135.000000
Pune        3  680.0  226.666667
NaN         0    0.0         NaN     (customer 12 has no city)

month
2025-01    350.0
2025-02    300.0
2025-03    300.0

0.6666666666666666   (2 of 3 customers ordered at least twice)`)}
<p><b>Line by line.</b> to_datetime makes real dates so .dt works. A left merge keeps all 6 orders; customer 12 has no row in custs, so city is missing. groupby with dropna=False keeps that group visible instead of silently hiding it. sum skips the missing amount, and count counts only non-missing amounts. Customers 10 and 11 ordered more than once, 12 only once: 2 of 3 = 66.7%.</p>
<h4>Part 2: A/B test by hand</h4>
<p>Control: 200 conversions out of 5,000 (4.0%). Variant: 250 out of 5,000 (5.0%). Is the difference real?</p>
${pre(`p1 = 200/5000 = 0.04       p2 = 250/5000 = 0.05
pooled p = (200 + 250) / 10000 = 0.045
standard error = sqrt( 0.045 x 0.955 x (1/5000 + 1/5000) )
               = sqrt(0.042975 x 0.0004) = sqrt(0.00001719) = 0.004146
z = (0.05 - 0.04) / 0.004146 = 2.41
two-sided p-value = about 0.016`)}
<p>p = 0.016 is below 0.05, so the lift is statistically significant. The 95% confidence interval for the difference (variant minus control) is about 1.0 percentage point, from roughly 0.2 to 1.8 points. Say it in business words: "The variant lifts conversion from 4% to 5%, a 25% relative lift. The result is unlikely to be chance, but the true lift could be anywhere from 0.2 to 1.8 points, so I would check that it covers the cost of the change." (Also check guardrail metrics such as refunds or unsubscribes.)</p>
<h4>Part 3: 12 rapid-fire Python and pandas questions</h4>
<ol>
<li><b>List vs tuple vs set vs dict?</b> Ordered changeable; ordered fixed; unique unordered; key-value pairs.</li>
<li><b>Series vs DataFrame?</b> One labelled column versus a table of columns.</li>
<li><b>loc vs iloc?</b> By label or condition versus by integer position.</li>
<li><b>Handle missing values?</b> Understand why, then drop, fill with median/mode, or keep as unknown.</li>
<li><b>merge vs concat?</b> merge joins on keys like SQL; concat stacks along rows or columns.</li>
<li><b>groupby example?</b> df.groupby('city')['amount'].sum().</li>
<li><b>apply vs vectorised?</b> Vectorised is much faster; apply runs a Python function per row.</li>
<li><b>Remove duplicates?</b> df.drop_duplicates(subset=['email'], keep='first').</li>
<li><b>Read a very large CSV?</b> chunksize, usecols and dtype to save memory.</li>
<li><b>Convert text to dates?</b> pd.to_datetime(col, errors='coerce'), then the .dt accessor.</li>
<li><b>pivot_table?</b> df.pivot_table(index=..., columns=..., values=..., aggfunc='sum').</li>
<li><b>SettingWithCopyWarning?</b> You changed a slice that may be a copy; use .loc or .copy().</li>
</ol>
<h4>Part 4: 8 rapid-fire statistics questions</h4>
<ol>
<li><b>Mean vs median?</b> Use the median when data is skewed or has outliers.</li>
<li><b>What is a p-value?</b> The chance of a result this extreme if there is truly no effect.</li>
<li><b>Type I vs Type II?</b> False positive versus false negative.</li>
<li><b>What is a confidence interval?</b> A range of plausible values for the true number at a stated confidence.</li>
<li><b>Central Limit Theorem?</b> Sample means become roughly normal as sample size grows, whatever the original shape.</li>
<li><b>Correlation vs causation?</b> A link is not proof that one causes the other; confounders exist.</li>
<li><b>Detect outliers?</b> Box plot, IQR rule (1.5 x IQR) or z-score; investigate before removing.</li>
<li><b>Design an A/B test?</b> Hypothesis, one primary metric, guardrails, random split, sample size, fixed duration, then test.</li>
</ol>`,
      practice: [
        [`A column has values 10, 12, 12, 13, 12, 14, 13, 12, 100. Give the mean and median and say which describes it better.`, `<p>Mean = 198 / 9 = <b>22</b>. Median = <b>12</b>. The median describes the typical value; the 100 pulls the mean far up.</p>`],
        [`Using the IQR rule, is 100 an outlier in that data? (Q1 = 12, Q3 = 13.)`, `<p>IQR = 13 - 12 = 1. Upper fence = 13 + 1.5 x 1 = 14.5. 100 is above 14.5 so it is an outlier. Investigate it before removing: could be a typing error or a real big order.</p>`],
        [`Write pandas to get the top 3 customers by total amount from the orders table.`, `${pre(`orders.groupby('cust_id')['amount'].sum().nlargest(3)`)}<p>With the example: customer 10 = 680, customer 11 = 270, customer 12 = 0 (the missing amount is skipped).</p>`],
        [`An A/B test has p = 0.03. Your manager says "so there is a 97 percent chance the variant is better". Correct this.`, `<p>That is wrong. The p-value is the probability of seeing a result this extreme if there were no real difference. It is not the chance that the variant is better. Say: "If there were no true difference, results like this would happen about 3 percent of the time."</p>`],
        [`Write code that replaces missing amounts with the median amount and then adds a column that flags orders above 200.`, `${pre(`orders['amount'] = orders['amount'].fillna(orders['amount'].median())
orders['big_order'] = orders['amount'] > 200`)}<p>The median of 200, 150, 300, 120, 180 is 180. The big_order column is True for the 300 order only.</p>`],
        [`Your test with 100 users per group shows 5% vs 6% conversion and p = 0.8. Is the variant useless?`, `<p>No. The sample is far too small to detect a 1-point difference. The test is underpowered. Calculate the needed sample size beforehand (based on the minimum detectable effect), then run it long enough.</p>`]
      ],
      important: [
        [`Explain p-value to a non-technical manager.`, `<p>"If the new design had no real effect, we would see a difference this big only about X percent of the time just by luck. A small number means the result is probably real, but it does not tell us how big or how valuable the effect is."</p>`],
        [`How would you handle missing values in pandas?`, `<p>"First I find out why they are missing and how many. If few and random, I drop them. For numbers I often fill with the median, for categories with the mode or an unknown label. I check that my result does not change much when I choose differently."</p>`],
        [`You have a skewed distribution with outliers. How do you report the centre?`, `<p>"I report the median, with the IQR or percentiles, and mention the mean separately. I check outliers for errors before removing any."</p>`],
        [`An A/B test is significant but the lift is tiny. What do you recommend?`, `<p>"Statistical significance is not business significance. I look at the confidence interval and the cost to ship. If the lowest plausible lift still beats the cost, I recommend shipping. Otherwise I say it is not worth the change."</p>`]
      ],
      resources: [
        [`pandas: 10 minutes`, `https://pandas.pydata.org/docs/user_guide/10min.html`],
        [`StatQuest (YouTube)`, `https://www.youtube.com/@statquest`],
        [`Khan Academy Statistics`, `https://www.khanacademy.org/math/statistics-probability`]
      ],
      done: `You are done when you can answer the 12 Python and 8 stats questions in one or two sentences, explain p-value in plain words, and run the A/B test calculation by hand.`
    },
    /* ---------------- FRI ---------------- */
    {
      title: 'Aptitude, data interpretation and a 90-minute take-home case',
      time: '2 h',
      study: [
        `Time plan for today: this day is 2 hours (30 minutes aptitude and data interpretation, then the 90-minute case). If you only have 1.5 hours, do the aptitude block and the first 60 minutes of the case, and finish it on Saturday morning.`,
        `Percent change = (new - old) / old x 100. Always divide by the OLD value. A 25 percent rise followed by a 20 percent fall nets to zero because the base changes.`,
        `Percentage points versus percent: going from 4 percent to 5 percent is +1 percentage point and +25 percent relative.`,
        `Ratio: A:B = 3:5 means A is 3 parts and B is 5 parts out of 8. Total x part / total parts gives each share.`,
        `Weighted average: multiply each average by its group size, add, then divide by the total size. Never average two averages directly when group sizes differ.`,
        `Reading tables and charts: read the title and units first, check the axis start (a truncated axis exaggerates), identify what is being compared, then calculate. Estimate before calculating to catch mistakes.`,
        `Speed trick: x percent of y equals y percent of x (8 percent of 50 = 50 percent of 8 = 4). 10 percent is moving the decimal; 5 percent is half of that.`,
        `Take-home case structure: understand the question, check the data, explore, find the cause or answer with numbers, recommend, state limits. In a metric-drop case split revenue as orders x average order value, then split by region, product or channel.`
      ],
      how: [
        `[30 min] Aptitude block: set a timer for 30 minutes and do the 10 questions in the example on paper without a calculator. Mark your answers, then check. Aim for 8 out of 10.`,
        `[10 min] Case practice, minutes 0 to 10: read the case brief. Write the question in your own words, list 3 clarifying questions and 3 hypotheses.`,
        `[20 min] Minutes 10 to 30: type the data into Excel or pandas. Check totals. Calculate total revenue by month and region.`,
        `[25 min] Minutes 30 to 55: decompose the change: revenue = orders x average order value. Find which region and which part (orders or order value) explains the drop.`,
        `[20 min] Minutes 55 to 75: write 3 findings and 2 recommendations on 3 simple slides or a one-page note.`,
        `[15 min] Minutes 75 to 90: re-check every number, fix titles, write the limits and next steps. Stop at 90 minutes even if unfinished.`,
        `[10 min] Compare with the model answer. Add the gaps to your flag list.`
      ],
      example: `<h4>Aptitude block: 10 questions with worked answers</h4>
<p>Use the quarterly table for questions 7 and 8:</p>
${pre(`Quarter  Revenue  Cost
Q1       120      80
Q2       150      90
Q3       135      108
Q4       180      126`)}
<ol>
<li>Revenue rose from 40,000 to 52,000. Percent change? <b>(52,000 - 40,000) / 40,000 = 12,000 / 40,000 = 30%.</b></li>
<li>A price falls 20 percent and then rises 25 percent. Net change? <b>Start 100. After fall 80. After rise 80 x 1.25 = 100. Net 0 percent.</b></li>
<li>Sales of A and B are in the ratio 3:5 and the total is 4,000. B's sales? <b>Total parts 8. One part = 500. B = 5 x 500 = 2,500</b> (A = 1,500).</li>
<li>The average of 5 numbers is 42. A sixth number makes the average 45. What is it? <b>New total = 6 x 45 = 270. Old total = 5 x 42 = 210. Sixth = 60.</b></li>
<li>Conversion rate moves from 4 percent to 5 percent. Say it two ways. <b>+1 percentage point, or +25 percent relative (1 / 4).</b></li>
<li>Region X has 200 customers averaging 500 spend; region Y has 300 customers averaging 400. Overall average? <b>(200 x 500 + 300 x 400) / 500 = (100,000 + 120,000) / 500 = 440.</b></li>
<li>From the table: which quarter has the highest profit margin (profit / revenue)? <b>Q1: 40/120 = 33.3%. Q2: 60/150 = 40%. Q3: 27/135 = 20%. Q4: 54/180 = 30%. Answer Q2 (40%).</b></li>
<li>From the table: how did Q3 revenue change versus Q2? <b>(135 - 150) / 150 = -10%.</b> (Q4 versus Q3 is +45/135 = +33.3%.)</li>
<li>An item is marked 1,200. A 15 percent discount is given, then 5 percent more on the new price. Final price? <b>1,200 x 0.85 = 1,020. 1,020 x 0.95 = 969.</b> The total discount is 19.25 percent, not 20.</li>
<li>A pie chart slice is 72 degrees and the total is 2,500. What value is the slice? <b>72 / 360 = 20 percent. 20 percent of 2,500 = 500.</b></li>
</ol>
<h4>Take-home case (90 minutes): Why did revenue drop in month 6?</h4>
<p><b>Brief.</b> A subscription box company sells in three regions. Total revenue fell sharply in month 6. Find why and recommend what to do. Revenue = orders x average order value (AOV). Data (orders and AOV per month):</p>
${pre(`Month  North(orders, AOV)  South(orders, AOV)  West(orders, AOV)
1      1000, 500            800, 450            600, 400
2      1010, 500            820, 455            610, 400
3      1020, 505            830, 455            590, 405
4      1000, 500            840, 460            600, 400
5       990, 500            850, 460            620, 400
6       700, 510            860, 460            610, 395`)}
<p><b>Model answer (check your work against this):</b></p>
${pre(`Revenue by month (orders x AOV)
Month   North     South     West      Total
5       495,000   391,000   248,000   1,134,000
6       357,000   395,600   240,950     993,550

Total change 5 to 6 = -140,450  (-12.4%)
North  -138,000   (-27.9%)
South   +4,600
West    -7,050
North explains 138,000 / 140,450 = about 98% of the drop.

Inside North:
orders 990 -> 700   (-29.3%)
AOV    500 -> 510   (+2.0%)
So the drop is about FEWER ORDERS, not lower prices.`)}
<p><b>Finding 1:</b> Revenue fell 12.4% in month 6, and almost all of it (98%) came from North. <b>Finding 2:</b> In North, orders fell 29%, while average order value rose 2%. Price or basket size is not the problem; volume is. <b>Finding 3:</b> South grew slightly and West fell a little, so this is a North issue, not a company-wide one. <b>Recommendations:</b> (1) Check the data first: is North's order feed complete for month 6? (2) Check operations and marketing in North: stock-outs, delivery issues, a stopped campaign, a competitor launch, or a payment problem. (3) If it is real, run a recovery test (for example a win-back offer) in North and track weekly orders. <b>Limits:</b> only 6 months of data; no customer or channel detail; cause not proven from this table. <b>Next step:</b> pull new versus returning customers for North, and orders by week and channel.</p>`,
      practice: [
        [`A shop's sales went from 250 to 200. Percent decrease? What increase is needed to get back to 250?`, `<p>Decrease = 50 / 250 = <b>20%</b>. To return from 200 to 250 you need 50 / 200 = <b>25%</b> increase.</p>`],
        [`Ratio of boys to girls is 4:3 and there are 35 students. How many girls?`, `<p>Total parts 7. One part = 5. Girls = 3 x 5 = <b>15</b>.</p>`],
        [`Average marks of 20 students is 60 and of another 30 students is 70. Average of all 50?`, `<p>(20 x 60 + 30 x 70) / 50 = (1,200 + 2,100) / 50 = <b>66</b>.</p>`],
        [`Profit margin is 25 percent of revenue and revenue is 80,000. What is the cost?`, `<p>Profit = 20,000. Cost = 80,000 - 20,000 = <b>60,000</b>.</p>`],
        [`A bar chart shows sales of 90 and 100 on an axis that starts at 80. The second bar looks twice as tall. What is the real difference?`, `<p>Real difference is 10 / 90 = <b>11.1 percent</b>. A truncated axis (starts at 80, not 0) exaggerates the gap. Always read where the axis starts.</p>`],
        [`In the take-home case, if North's orders had stayed at 990, what would month 6 total revenue have been?`, `<p>North revenue would be 990 x 510 = 504,900. Total = 504,900 + 395,600 + 240,950 = <b>1,141,450</b>. That is 147,900 above the actual 993,550.</p>`]
      ],
      important: [
        [`Revenue dropped 12 percent last month. How do you find out why?`, `<p>"First I check data quality (missing feed, duplicated or delayed data). Then I split revenue into orders times order value. Then I split by region, product and channel to find where the drop is. I compare with last year for seasonality. Then I test causes like stock, price, marketing, competitor or tracking changes, and recommend a fix and a way to monitor it."</p>`],
        [`What is the difference between percentage points and percent?`, `<p>"Percentage points are the simple difference between two percentages. Percent change is relative to the starting value. From 4 to 5 percent is 1 percentage point, but a 25 percent relative increase."</p>`],
        [`How do you approach a take-home case with limited time?`, `<p>"I restate the question, check the data quickly, explore for the biggest pattern, then spend most time on 3 clear insights with numbers and a recommendation. I keep the slides simple, state my assumptions and limits, and always leave 15 minutes for checking numbers."</p>`]
      ],
      resources: [
        [`Khan Academy Statistics`, `https://www.khanacademy.org/math/statistics-probability`],
        [`Maven Analytics Data Playground`, `https://mavenanalytics.io/data-playground`]
      ],
      done: `You are done when you scored at least 8 of 10 on the aptitude block in 30 minutes, you can do the revenue decomposition (orders x average order value) by region, and you wrote 3 findings and a recommendation for the case within 90 minutes.`
    },
    /* ---------------- SAT ---------------- */
    {
      title: 'Mock interview #1 (technical): record, score, fix',
      time: '3.5 h',
      study: [
        `A mock interview shows gaps that studying alone hides: freezing under time pressure, long answers, unclear explanations. It is the highest-value practice of the week.`,
        `Format of the real technical round: 5 minutes intro, 25 to 35 minutes of live SQL and questions on Power BI, Python and stats, 10 minutes on a project, 5 minutes for your questions. This is usually 45 to 60 minutes.`,
        `Think aloud. Interviewers want to hear how you reason. A correct answer with silence scores lower than a nearly correct answer with a clear plan.`,
        `Answer structure for concept questions: definition in one sentence, example in one sentence, when you would use it. Target 30 to 60 seconds. If you do not know: say what you do know, then how you would find out.`,
        `For live SQL: restate the question, ask about ties and NULLs, say your plan, write the query in small steps, test with sample rows aloud.`,
        `Rating yourself honestly needs a scorecard. Rate each skill from 1 to 5 and write one concrete example for each rating. Look for patterns, not single mistakes.`,
        `Review the recording twice: once for content (was the answer correct?), once for delivery (pace, fillers like um/so/basically, length, confidence).`,
        `Turn findings into a weak-topic list with an action and a date. Only fix the 3 weakest topics first.`
      ],
      how: [
        `[15 min] Setup: find a friend, a colleague or use an AI chat as the interviewer (prompt in the example). Place your phone to record audio or video and test it. Open DB Fiddle or a notes editor for live SQL. Close other tabs.`,
        `[50 min] Run the mock interview using the 15-question script in the example. Keep to the timings. Do not pause the recording to restart answers; practise recovering.`,
        `[10 min] Immediately after: write what felt hard and the questions you could not answer. Take a break.`,
        `[40 min] First review pass: listen or watch at normal speed. Fill the scorecard. Note timestamps of weak moments.`,
        `[25 min] Second pass: count filler words in 3 minutes of answers, check the length of each answer, and check whether the first sentence of each answer gave the direct answer.`,
        `[40 min] Fix session: redo the 3 questions you answered worst. Re-record yourself giving better answers. Write the better versions in your notes.`,
        `[15 min] Write the weak-topic list (table in the example) and schedule the fixes for next week's revision. Add the date for Mock Interview #2.`,
        `[15 min] Prepare your own 5 questions to ask an interviewer (team, tools, success in 6 months, how data is accessed, what the first project would be).`
      ],
      example: `<h4>Mock interview script (about 45 minutes)</h4>
${pre(`Time    Block                 Question
0:00    Intro (3 min)         1. Tell me about yourself.
0:03    SQL (20 min)          2. WHERE vs HAVING; INNER vs LEFT JOIN.
                              3. Live: employees earning above their department average.
                              4. Live: second order of each customer (ROW_NUMBER).
                              5. Live: month-over-month growth with LAG.
                              6. Find and remove duplicate rows.
0:23    Power BI / Excel (7)  7. Measure vs calculated column.
                              8. Write a YoY % measure.
                              9. VLOOKUP vs XLOOKUP / pivot table use.
0:30    Python / stats (7)    10. Handling missing values in pandas.
                              11. Explain a p-value to a manager.
                              12. A/B test: 4% vs 5%, how do you decide?
0:37    Project (6 min)       13. Walk me through your project (2 minutes).
                              14. What was the hardest part and what did you learn?
0:43    Wrap-up (2 min)       15. Do you have any questions for us?`)}
<p><b>Prompt for an AI interviewer</b> (paste into a chat, then answer by typing or voice):</p>
${pre(`Act as a strict but fair interviewer for an entry-level Data Analyst role.
Ask me one question at a time. Cover: 4 SQL questions (2 with window functions),
2 Power BI/DAX, 1 Excel, 2 Python/pandas, 2 statistics, 1 project question.
Wait for my answer before the next question. After each answer give a score
from 1 to 5 and one sentence of feedback. At the end give a summary of my
3 strongest and 3 weakest topics.`)}
<p><b>Model answers for three of the questions</b> (compare with yours):</p>
${pre(`Q3: Employees above their department average
SELECT name, dept, salary
FROM (SELECT name, dept, salary,
             AVG(salary) OVER (PARTITION BY dept) AS dept_avg
      FROM employees) t
WHERE salary > dept_avg;

Q4: Second order of each customer
SELECT cust_id, order_id
FROM (SELECT cust_id, order_id,
             ROW_NUMBER() OVER (PARTITION BY cust_id ORDER BY order_date) AS rn
      FROM orders) t
WHERE rn = 2;

Q8: YoY %
Sales LY = CALCULATE([Total Sales], SAMEPERIODLASTYEAR('Calendar'[Date]))
YoY % = DIVIDE([Total Sales] - [Sales LY], [Sales LY])`)}
<h4>Scorecard (rate 1 to 5, write one example for each)</h4>
${pre(`Area                         Score   Evidence (one concrete example)
Correctness of SQL                   ____
Thinking aloud / plan first          ____
Concept answers (30-60 sec)          ____
Power BI / DAX knowledge             ____
Python / stats knowledge             ____
Project walkthrough clarity          ____
Handling "I do not know"             ____
Communication: pace, fillers, tone   ____
Total /40                            ____`)}
<p><b>How to review the recording.</b> Pass 1 (content): pause after every answer and ask three things. Was the first sentence the direct answer? Was it correct? Was it under 90 seconds? Mark each question green (good), amber (okay but unclear) or red (wrong or no answer). Pass 2 (delivery): listen to 3 minutes and count "um", "so", "basically", "actually". More than 5 per minute is high. Check your pace: if you cannot follow yourself at normal speed, slow down. Watch for long silences before answering (a short pause is fine; say "let me think for a moment").</p>
<h4>Weak-topic list template</h4>
${pre(`Topic                 What went wrong               Fix action                    Redo by
Window frames         could not explain ROWS vs RANGE  re-read, 3 queries          Tue
DAX CALCULATE         vague answer                  write 5 examples aloud         Wed
Explain p-value       too technical                 practise the 3-sentence answer Thu`)}
<p><b>Line by line.</b> The script follows the real order of a technical round, so it builds stamina. The AI prompt makes the chat score you and list weaknesses. The scorecard forces specific evidence, so you fix real problems and not feelings. The weak-topic table converts the review into scheduled actions.</p>`,
      practice: [
        [`Give a 30-second answer to "What is the difference between WHERE and HAVING?"`, `<p>"WHERE filters individual rows before grouping, and cannot use aggregates. HAVING filters groups after GROUP BY and can use aggregates like COUNT or SUM. For example, WHERE active = 1 keeps active rows, and HAVING COUNT(*) greater than 5 keeps only groups with more than five rows."</p>`],
        [`Give a 45-second answer to "How do you handle duplicate records in a dataset?"`, `<p>"First I detect them: in SQL with GROUP BY and HAVING COUNT greater than 1, in pandas with duplicated(). I check whether they are exact duplicates or the same entity with different values. For exact duplicates I drop them with drop_duplicates or ROW_NUMBER, keeping the latest or most complete row. For near duplicates I agree a rule with the business, and I log how many rows I removed."</p>`],
        [`You get stuck on a live SQL question. What do you say and do?`, `<p>Say: "Let me restate the problem and write the plan in steps." Break it into pieces (group, rank, filter), write the first step, run it on sample rows. If still stuck, say what you would try next, for example "I would use ROW_NUMBER in a subquery and filter outside." Partial reasoning earns credit; silence does not.</p>`],
        [`What are 3 good questions to ask the interviewer at the end?`, `<p>"What does success look like in the first six months?" "What tools and data sources does the team use, and how do analysts get access?" "Can you tell me about a recent project the team delivered and how stakeholders used it?"</p>`],
        [`You count 18 fillers in 2 minutes of your recording. What do you change?`, `<p>That is 9 per minute, which is high. Replace fillers with a short silent pause, slow down, and prepare the first sentence of common answers (definition first). Re-record after practising 3 answers aloud.</p>`]
      ],
      important: [
        [`How do you answer when you do not know the answer?`, `<p>"I say honestly that I have not used it, then tell what I know that is related and how I would solve it. For example, I may not know this function, but I know the concept, I would check the documentation, and I would test it on a small sample before using it."</p>`],
        [`Tell me about yourself in 60 seconds.`, `<p>"I am a survey programmer with 2+ years of experience building questionnaires and validating data. I like the data side, so I built skills in SQL, Power BI, Python and statistics. I completed three projects: survey insights, e-commerce analytics and a marketing funnel. I am looking for a data analyst role where I can use my data quality skills to support decisions."</p>`],
        [`Walk me through your project.`, `<p>Use the 2-minute script: context, question, method, findings with numbers, recommendation, learning. Practise it so it is under 2 minutes 15 seconds.</p>`]
      ],
      resources: [
        [`DB Fiddle (run SQL online)`, `https://www.db-fiddle.com`],
        [`Glassdoor interviews`, `https://www.glassdoor.co.in/Interview/index.htm`]
      ],
      done: `You are done when you have a recorded mock interview, a filled scorecard with evidence, 3 questions re-recorded better, and a weak-topic list with fix actions and dates.`
    },
    /* ---------------- SUN ---------------- */
    {
      title: 'Timed 3-hour take-home case and 5-slide presentation',
      time: '3.5 h',
      study: [
        `Take-home tests check four things: can you handle messy data, can you find the main answer, can you explain it clearly, and can you finish on time. Clean communication often beats extra analysis.`,
        `A good take-home has one clear answer to the question asked, supported by 3 insights with numbers, not 15 charts.`,
        `The 5-slide structure: (1) Context and question, (2) Data and method (including data checks), (3) Insights (three, each with one chart and one number), (4) Recommendation with expected impact, (5) Risks, limits and next steps.`,
        `Slide titles should be sentences that state the message ("Social spends 38 percent of budget but returns less than it costs") not labels ("Spend by channel").`,
        `State your assumptions explicitly. If the brief is unclear, make a reasonable assumption, write it down and carry on. Do not stop and wait.`,
        `Time split for 3 hours: 15 minutes read and plan, 20 minutes data checks and cleaning, 60 minutes analysis, 40 minutes slides, 20 minutes review of numbers and wording, 25 minutes buffer.`,
        `Common mistakes: no data checks, charts without conclusions, numbers that do not match between slides, over-complicated models, a recommendation that does not follow from the findings, ignoring the time limit.`,
        `Afterwards, practise presenting the 5 slides in 5 minutes out loud. Presenting is often part of the interview.`
      ],
      how: [
        `[10 min] Choose a dataset you have NOT analysed before (for example from Kaggle Datasets or the Maven Analytics Data Playground). Write a one-paragraph brief for yourself using the template in the example. Start your timer at the end of this step.`,
        `[0:00 to 0:15] Read the brief and the data description. Write the question in one sentence, 3 hypotheses and what the final recommendation could look like.`,
        `[0:15 to 0:35] Load the data. Check shape, types, missing, duplicates, ranges. Clean only what you need. Write down each assumption.`,
        `[0:35 to 1:35] Analysis: calculate the key metrics, segment them, find the 3 strongest patterns. Make 3 charts only. Save the numbers you will quote.`,
        `[1:35 to 2:15] Build 5 slides in PowerPoint or Google Slides using the template. Put the key number in each title.`,
        `[2:15 to 2:35] Review: recheck every number against your notebook, fix spelling, align the story, and make sure slide 4 follows from slide 3.`,
        `[2:35 to 3:00] Buffer. Stop at exactly 3 hours. Whatever is unfinished goes into the next steps slide.`,
        `[20 min] Present the 5 slides aloud in 5 minutes, record yourself, and self-score using the checklist. Then spend 30 minutes applying to 5 jobs (log them in your tracker).`
      ],
      example: `<h4>Self-brief template (write this before starting the clock)</h4>
${pre(`Business context : A [company type] wants to know [question].
Dataset          : [name, rows, period, key columns]
Question         : [one sentence]
Deliverable      : 5 slides + the notebook or workbook
Audience         : [marketing manager / operations head]
Time limit       : 3 hours`)}
<h4>5-slide template with worked content</h4>
<p>The sample below uses the campaign table from Week 9 (illustrative numbers): spend 210,000, revenue 384,000, 370 customers across Email, Search, Social and Referral.</p>
${pre(`SLIDE 1  Context and question
Title : "Where should next quarter's 210k marketing budget go?"
Body  : Four channels, 370 customers, 384k revenue last quarter.
        Question: which channels return the most per rupee, and what should change?

SLIDE 2  Data and method
Title : "Four channels, one quarter; checked for gaps and duplicates"
Body  : Source: campaign summary (4 rows). Checks: no missing values, totals match.
        Metrics: CTR, CAC, ROAS, ROI. Overall ROI = (384k - 210k) / 210k = 83%.
        Assumption: spend is the only cost; revenue is attributed to the last channel.

SLIDE 3  Insights (3 small charts or one chart plus 3 callouts)
Title : "Referral and Email return 4 to 5.4 times their cost; Social loses money"
        1. ROAS: Referral 5.4, Email 4.0, Search 1.7, Social 0.75.
        2. CAC: Referral 167, Email 200, Search 750, Social 2,000.
        3. Social is 38% of spend but 11% of customers.

SLIDE 4  Recommendation
Title : "Move 40k from Social to Email: about +80 customers at the same spend"
Body  : Assumes the extra Email spend works at half today's efficiency (CAC 400).
        Pilot with 20% of the budget for 4 weeks. Track CAC and ROAS weekly.

SLIDE 5  Risks, limits and next steps
Title : "Check scale and quality before moving the full budget"
Body  : Referral volume is small and may not scale. Email may saturate.
        Lifetime value not included. Next: cohort retention by channel; A/B test.`)}
<p><b>Check the maths used above.</b> ROI = 174,000 / 210,000 = 82.9 percent. Social spend 80,000 / 210,000 = 38 percent; Social customers 40 / 370 = 10.8 percent. The shift: lose about 20 customers from halving Social, gain 40,000 / 400 = 100 from Email, net +80.</p>
<h4>Self-scoring checklist (1 point each, aim for 10 of 12)</h4>
${pre(`[ ] Question restated clearly
[ ] Data checks shown (missing, duplicates, ranges)
[ ] Assumptions written down
[ ] Exactly 3 insights, each with a number
[ ] Every slide title is a sentence with a message
[ ] Charts are simple, labelled and have units
[ ] Recommendation follows from the insights
[ ] Expected impact is estimated, with assumptions
[ ] Limits and risks stated honestly
[ ] Numbers match across slides and notebook
[ ] Finished within 3 hours
[ ] Can present in 5 minutes without reading`)}
<p><b>Line by line.</b> Slide 1 sets the stage in one sentence. Slide 2 shows you checked the data, which earns trust. Slide 3 has only 3 insights, each with a number. Slide 4 gives one action and an impact estimate. Slide 5 shows maturity: you say what could go wrong. If a manager reads only the titles, they should get the whole story.</p>`,
      practice: [
        [`Rewrite the slide title "Spend by channel" so it states a message.`, `<p>"Social takes 38 percent of spend but delivers 11 percent of customers."</p><p>A good title is a sentence with a number and a conclusion.</p>`],
        [`Your data has 15 percent missing values in the key column and you have no time to investigate. What do you write on the slides?`, `<p>State it plainly on slide 2: "15 percent of rows have no value in column X; I excluded them (or filled with the median). The main result was checked both ways and the conclusion does not change." Add it as a risk and a next step. Never hide it.</p>`],
        [`You have 25 minutes left and your analysis is not finished. What do you do?`, `<p>Stop analysing. Build the slides from what you have, state the unfinished part as a limitation and a next step, and spend 10 minutes checking numbers. An on-time, clear, partial answer beats a late, complete one.</p>`],
        [`Turn this finding into a recommendation: "Orders from mobile app users convert 2 times more than web users."`, `<p>"Move the checkout nudge budget to the app and make app download prompts more visible on the web. Pilot for 4 weeks, track overall conversion and app install cost, and watch for web users who are only price-checking."</p>`],
        [`How do you present a recommendation when you are unsure about the cause?`, `<p>Say what the data shows, what you think the likely causes are, and propose a small test to confirm, instead of claiming certainty. Example: "The drop is in North orders. The likely causes are X and Y; I would check Z first."</p>`]
      ],
      important: [
        [`Walk me through how you approached this take-home.`, `<p>"I restated the question, checked and cleaned the data, explored the biggest patterns, picked three insights with numbers, estimated the impact of a recommendation with clear assumptions, and ended with limits and next steps. I spent most time on analysis and checking numbers, and kept slides simple."</p>`],
        [`What would you do if you had one more week on this case?`, `<p>"I would add customer lifetime value and retention by channel, validate the recommendation with an A/B or pilot, add confidence intervals where I used samples, and automate the cleaning steps."</p>`],
        [`How do you make sure the numbers in your deck are right?`, `<p>"I keep one notebook as the single source for every number, recalculate totals two ways, check that segment totals add up to the overall total, compare with simple estimates, and re-read every slide against the notebook before sending."</p>`]
      ],
      resources: [
        [`Kaggle Datasets`, `https://www.kaggle.com/datasets`],
        [`Maven Analytics Data Playground`, `https://mavenanalytics.io/data-playground`],
        [`Glassdoor interviews`, `https://www.glassdoor.co.in/Interview/index.htm`]
      ],
      done: `You are done when you finished a 3-hour take-home with a 5-slide deck, presented it in 5 minutes aloud, scored yourself on the checklist, and applied to 5 jobs.`
    }
  ]
};
