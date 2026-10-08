/* Week 2 guide: SQL Advanced / Window Functions. Dialect: PostgreSQL unless stated. */
(function () {
const S = `-- Same practice schema as Week 1 (PostgreSQL). Skip if you already loaded it.
CREATE TABLE customers (customer_id INT PRIMARY KEY, name VARCHAR(50), city VARCHAR(50));
CREATE TABLE orders (order_id INT PRIMARY KEY, customer_id INT, order_date DATE, amount NUMERIC(10,2));
CREATE TABLE employees (emp_id INT PRIMARY KEY, name VARCHAR(50), dept VARCHAR(30), salary INT, manager_id INT);

INSERT INTO customers VALUES (1,'Asha','Mumbai'),(2,'Ravi','Delhi'),(3,'Meena','Mumbai'),(4,'John','Pune'),(5,'Sara',NULL);
INSERT INTO orders VALUES
 (101,1,'2024-01-05',250),(102,1,'2024-01-20',100),(103,2,'2024-02-02',400),(104,3,'2024-02-14',150),
 (105,3,'2024-03-01',300),(106,3,'2024-03-15',50),(107,2,'2024-03-20',200);
INSERT INTO employees VALUES
 (1,'Anil','IT',90000,NULL),(2,'Bina','IT',70000,1),(3,'Chetan','IT',70000,1),(4,'Divya','HR',50000,1),
 (5,'Esha','HR',60000,4),(6,'Farhan','Sales',40000,1),(7,'Gita','Sales',55000,6),(8,'Hari','Sales',55000,6);`;

const EXTRA = `-- Extra tables for Week 2
CREATE TABLE logins (user_id INT, login_date DATE);
INSERT INTO logins VALUES
 (1,'2024-03-01'),(1,'2024-03-02'),(1,'2024-03-03'),(1,'2024-03-05'),(1,'2024-03-06'),(1,'2024-03-10'),
 (2,'2024-03-01'),(2,'2024-03-02');

CREATE TABLE contacts (contact_id INT PRIMARY KEY, email VARCHAR(50));
INSERT INTO contacts VALUES
 (1,'a@x.com'),(2,'b@x.com'),(3,'a@x.com'),(4,'c@x.com'),(5,'b@x.com'),(6,'a@x.com');

CREATE TABLE suppliers (supplier_id INT PRIMARY KEY, name VARCHAR(50), city VARCHAR(50));
INSERT INTO suppliers VALUES (1,'Alpha','Mumbai'),(2,'Beta','Chennai'),(3,'Gamma','Pune');`;

const A = (sql, why) => pre(sql) + '<p>' + why + '</p>';

GUIDES[2] = {
intro: `<p>Window functions plus CTEs are the biggest difference between a weak and a strong SQL round. Almost every medium interview question (Nth highest, top-N per group, running total, month-on-month growth, find duplicates) uses them. This week you learn them step by step and practise the classic patterns until they are automatic.</p>
<p><b>By Day 7 you can:</b> rank rows inside groups, compare a row with the previous row, build running totals and moving averages, find duplicates and gaps, and answer 10 business questions on a real sample database (Chinook or Northwind) with a GitHub README.</p>
<p><b>Time split:</b> weekdays 1.5 h = 25 min learn, 45 min type queries, 20 min practice. Day 6 = 10 timed problems. Day 7 = mini project. Load the Week 1 schema first; Day 3 and Day 4 add three small tables.</p>
<p><b>Dialect:</b> PostgreSQL. Window functions also work in MySQL 8+, SQL Server and Oracle with the same syntax.</p>`,
days: [
/* ---------------- MON ---------------- */
{
title: 'ROW_NUMBER, RANK, DENSE_RANK',
time: '1.5 h',
study: [
 'A window function does a calculation across related rows but keeps every row (unlike GROUP BY, which collapses rows).',
 'The syntax is function() OVER (PARTITION BY group_col ORDER BY sort_col). OVER tells SQL this is a window function.',
 'PARTITION BY splits rows into groups (like GROUP BY but without collapsing). Leave it out to treat the whole table as one group.',
 'ROW_NUMBER() gives 1, 2, 3, ... with no ties. If two rows tie, the order between them is arbitrary unless you add a tie-break column.',
 'RANK() gives tied rows the same number and then skips numbers: 1, 2, 2, 4.',
 'DENSE_RANK() gives tied rows the same number and does not skip: 1, 2, 2, 3.',
 'You cannot use a window function in WHERE or HAVING. Put it in a CTE or subquery, then filter in the outer query.',
 'Rule of thumb: Nth highest value = DENSE_RANK. "Latest row per customer" = ROW_NUMBER.'],
how: [
 '[10 min] Load the Week 1 schema if needed (it is in the example). Check SELECT * FROM employees returns 8 rows.',
 '[20 min] Type the first example. Predict the 3 rank columns for the Sales department on paper before running.',
 '[15 min] Change the ORDER BY to ascending and see what changes. Remove PARTITION BY and see the whole table ranked.',
 '[25 min] Wrap the query in a CTE and filter WHERE rnk = 1 (highest per department). This pattern is used in many interview questions.',
 '[20 min] Solve the practice questions. Optional extra: try the Ranking section on windowfunctions.com (see resources).'],
example: `<p>Setup (run once if not loaded):</p>` + pre(S) + `<p>Rank employees by salary inside each department:</p>` + pre(`SELECT dept, name, salary,
       ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC, name) AS row_num,
       RANK()       OVER (PARTITION BY dept ORDER BY salary DESC)       AS rnk,
       DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC)       AS dense_rnk
FROM employees
ORDER BY dept, salary DESC, name;`) + pre(`dept  | name   | salary | row_num | rnk | dense_rnk
HR    | Esha   | 60000  | 1       | 1   | 1
HR    | Divya  | 50000  | 2       | 2   | 2
IT    | Anil   | 90000  | 1       | 1   | 1
IT    | Bina   | 70000  | 2       | 2   | 2
IT    | Chetan | 70000  | 3       | 2   | 2
Sales | Gita   | 55000  | 1       | 1   | 1
Sales | Hari   | 55000  | 2       | 1   | 1
Sales | Farhan | 40000  | 3       | 3   | 2`) + `<p><b>Explain:</b> PARTITION BY dept makes three separate groups, and ranking restarts in each. Bina and Chetan tie at 70000: ROW_NUMBER still gives 2 and 3 (using name as a tie-break), RANK gives both 2, DENSE_RANK gives both 2. In Sales, after two rows tied at rank 1, RANK jumps to 3 (it skips 2), but DENSE_RANK continues with 2.</p>
<p>Now the standard pattern: top earner per department. A window function cannot be in WHERE, so use a CTE:</p>` + pre(`WITH ranked AS (
  SELECT dept, name, salary,
         RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS rnk
  FROM employees
)
SELECT dept, name, salary
FROM ranked
WHERE rnk = 1
ORDER BY dept, name;`) + pre(`dept  | name | salary
HR    | Esha | 60000
IT    | Anil | 90000
Sales | Gita | 55000
Sales | Hari | 55000`),
practice: [
 ['Rank ALL employees by salary (highest first) with RANK and DENSE_RANK. What are the ranks of Esha and Divya?', A(`SELECT name, salary,
       RANK()       OVER (ORDER BY salary DESC) AS rnk,
       DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rnk
FROM employees ORDER BY salary DESC, name;`, 'Order: Anil 1/1, Bina 2/2, Chetan 2/2, Esha 4/3, Gita 5/4, Hari 5/4, Divya 7/5, Farhan 8/6. Esha is RANK 4 but DENSE_RANK 3 because RANK skips after the tie.')],
 ['Find the highest paid employee(s) in each department (keep ties).', A(`WITH r AS (
  SELECT dept, name, salary, RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS rnk
  FROM employees)
SELECT dept, name, salary FROM r WHERE rnk = 1 ORDER BY dept, name;`, 'Esha, Anil, Gita, Hari. If the question wants exactly one person per dept, use ROW_NUMBER instead.')],
 ['Top 2 salary levels in each department (all employees who have one of the top 2 distinct salaries).', A(`WITH r AS (
  SELECT dept, name, salary,
         DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS d
  FROM employees)
SELECT dept, name, salary FROM r WHERE d <= 2 ORDER BY dept, salary DESC, name;`, 'HR: Esha, Divya. IT: Anil, Bina, Chetan. Sales: Gita, Hari, Farhan (distinct salaries 55000 and 40000 are the top 2). DENSE_RANK is right for "top N values".')],
 ['Latest order of each customer (order_id, order_date).', A(`WITH x AS (
  SELECT order_id, customer_id, order_date,
         ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn
  FROM orders)
SELECT customer_id, order_id, order_date FROM x WHERE rn = 1 ORDER BY customer_id;`, 'Customer 1: order 102 (2024-01-20), customer 2: order 107 (2024-03-20), customer 3: order 106 (2024-03-15).')],
 ['Find the 2nd highest salary in the company using DENSE_RANK. Which employees earn it?', A(`WITH r AS (
  SELECT name, salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS d FROM employees)
SELECT name, salary FROM r WHERE d = 2;`, 'Bina and Chetan, 70000. RANK would also give 2 here, but DENSE_RANK is the safe choice for "Nth highest" because RANK can skip the number N after a tie at the top.')],
 ['Why does this fail: SELECT name FROM employees WHERE ROW_NUMBER() OVER (ORDER BY salary) = 1;', A(`-- Correct version
SELECT name FROM (
  SELECT name, ROW_NUMBER() OVER (ORDER BY salary) AS rn FROM employees
) t WHERE rn = 1;`, 'Window functions run after WHERE in the processing order, so WHERE cannot see them. Wrap the query in a subquery or CTE, then filter. Answer: Farhan (lowest salary).')]
],
important: [
 ['What is the difference between ROW_NUMBER, RANK and DENSE_RANK?', `<p>All three number rows inside a window. ROW_NUMBER gives unique numbers even for ties. RANK gives ties the same number and skips the next numbers (1, 2, 2, 4). DENSE_RANK gives ties the same number without gaps (1, 2, 2, 3). For the Nth highest salary I use DENSE_RANK.</p>`],
 ['What is the difference between GROUP BY and a window function?', `<p>GROUP BY collapses rows into one row per group. A window function keeps all rows and adds a calculated column per row, using PARTITION BY to define the group. So I can show each employee with their department average on the same row.</p>`],
 ['How do you get the top 3 salaries per department?', `<p>Use DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) in a CTE, then filter WHERE rank is 3 or less in the outer query. I choose RANK or ROW_NUMBER depending on how ties should be treated, and I ask the interviewer.</p>`]
],
resources: [['WindowFunctions.com (interactive)', 'https://www.windowfunctions.com'], ['StrataScratch window functions article', 'https://stratascratch.com/blog/types-of-window-functions-in-sql-and-questions-asked-by-airbnb-netflix-twitter-and-uber']],
done: 'You are done when you can write a "top-N per group" query with DENSE_RANK in a CTE without looking and explain the 3 ranking functions with an example.'
},
/* ---------------- TUE ---------------- */
{
title: 'LAG, LEAD, running total, moving average',
time: '1.5 h',
study: [
 'LAG(col) returns the value from the previous row (within the window order). LEAD(col) returns the value from the next row.',
 'LAG(col, 1, 0) takes an offset (how many rows back) and a default value for the first row (instead of NULL).',
 'Month-on-month (MoM) growth % = (this month - last month) / last month x 100. Use LAG to get last month.',
 'SUM(col) OVER (ORDER BY x) gives a running total (cumulative sum). Add PARTITION BY to restart per group.',
 'A frame says which rows to include around the current row: ROWS BETWEEN 1 PRECEDING AND CURRENT ROW means this row and the one before.',
 'Moving average = AVG(col) OVER (ORDER BY x ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) for a 3-row average.',
 'If you use ORDER BY without a frame, the default frame is RANGE UNBOUNDED PRECEDING to CURRENT ROW. Rows with the same ORDER BY value (peers) are added together, so use a unique sort key or ROWS explicitly.',
 'Avoid divide by zero: write NULLIF(prev, 0) in the denominator.'],
how: [
 '[15 min] Build the monthly revenue CTE from the example and check it returns 3 rows (350, 550, 550).',
 '[20 min] Add LAG and compute MoM %. Predict February: 57.1.',
 '[20 min] Add running total and moving average columns. Check the last running total equals the total revenue (1450).',
 '[10 min] Try LEAD and see how it is the mirror of LAG.',
 '[25 min] Solve the practice questions. Keep a note: "LAG = look back, LEAD = look forward".'],
example: `<p>Monthly revenue with MoM growth, running total and 2-month moving average:</p>` + pre(`WITH monthly AS (
  SELECT EXTRACT(MONTH FROM order_date) AS mth, SUM(amount) AS revenue
  FROM orders
  GROUP BY EXTRACT(MONTH FROM order_date)
)
SELECT mth, revenue,
       LAG(revenue) OVER (ORDER BY mth) AS prev_revenue,
       ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY mth))
             / NULLIF(LAG(revenue) OVER (ORDER BY mth), 0), 1) AS mom_pct,
       SUM(revenue) OVER (ORDER BY mth) AS running_total,
       ROUND(AVG(revenue) OVER (ORDER BY mth
             ROWS BETWEEN 1 PRECEDING AND CURRENT ROW), 2) AS moving_avg_2
FROM monthly
ORDER BY mth;`) + pre(`mth | revenue | prev_revenue | mom_pct | running_total | moving_avg_2
1   | 350.00  | NULL         | NULL    | 350.00        | 350.00
2   | 550.00  | 350.00       | 57.1    | 900.00        | 450.00
3   | 550.00  | 550.00       | 0.0     | 1450.00       | 550.00`) + `<p><b>Explain:</b> The CTE makes one row per month. LAG gets last month's revenue; January has no previous month so it is NULL. February: (550 - 350) / 350 = 57.1 percent. The running total adds each month to all earlier ones, so it ends at 1450 (the full revenue). The moving average takes the current and the previous month: (350 + 550) / 2 = 450. In a real project use DATE_TRUNC('month', order_date) so months from different years do not mix. MySQL has no DATE_TRUNC; use DATE_FORMAT(order_date, '%Y-%m-01').</p>
<p>Per customer, each order with the previous order amount (restart for every customer):</p>` + pre(`SELECT customer_id, order_id, amount,
       LAG(amount)  OVER (PARTITION BY customer_id ORDER BY order_date) AS prev_amount,
       SUM(amount)  OVER (PARTITION BY customer_id ORDER BY order_date) AS cust_running_total
FROM orders
WHERE customer_id = 3
ORDER BY order_date;`) + pre(`customer_id | order_id | amount | prev_amount | cust_running_total
3           | 104      | 150.00 | NULL        | 150.00
3           | 105      | 300.00 | 150.00      | 450.00
3           | 106      | 50.00  | 300.00      | 500.00`),
practice: [
 ['For each order show the previous order amount of the same customer.', A(`SELECT order_id, customer_id, amount,
       LAG(amount) OVER (PARTITION BY customer_id ORDER BY order_date) AS prev_amount
FROM orders ORDER BY order_id;`, '101 NULL, 102 250, 103 NULL, 104 NULL, 105 150, 106 300, 107 400. The first order of each customer has no previous order.')],
 ['Days since the customer\'s previous order.', A(`SELECT order_id, customer_id, order_date,
       order_date - LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS days_gap
FROM orders ORDER BY order_id;`, 'Gaps: 101 NULL, 102 15, 103 NULL, 104 NULL, 105 16, 106 14, 107 47. In PostgreSQL date minus date gives days. MySQL: DATEDIFF(order_date, LAG(...)). SQL Server: DATEDIFF(day, LAG(...), order_date).')],
 ['Running total of revenue by order date across all customers.', A(`SELECT order_id, order_date, amount,
       SUM(amount) OVER (ORDER BY order_date, order_id) AS running_total
FROM orders ORDER BY order_date, order_id;`, 'Totals: 250, 350, 750, 900, 1200, 1250, 1450. Adding order_id makes the sort unique, which avoids peer-row surprises.')],
 ['Running total per customer (restarts for each customer).', A(`SELECT customer_id, order_id, amount,
       SUM(amount) OVER (PARTITION BY customer_id ORDER BY order_date) AS running_total
FROM orders ORDER BY customer_id, order_date;`, 'Customer 1: 250, 350. Customer 2: 400, 600. Customer 3: 150, 450, 500.')],
 ['For each order, show the NEXT order amount of the same customer (LEAD) and use 0 when there is none.', A(`SELECT order_id, customer_id, amount,
       LEAD(amount, 1, 0) OVER (PARTITION BY customer_id ORDER BY order_date) AS next_amount
FROM orders ORDER BY order_id;`, '101 100, 102 0, 103 200, 104 300, 105 50, 106 0, 107 0. The third argument of LEAD is the default.')],
 ['Calculate MoM % for the monthly revenue and say what Feb to Mar means.', A(`WITH monthly AS (
  SELECT EXTRACT(MONTH FROM order_date) AS mth, SUM(amount) AS revenue
  FROM orders GROUP BY EXTRACT(MONTH FROM order_date))
SELECT mth, revenue,
       ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY mth))
             / NULLIF(LAG(revenue) OVER (ORDER BY mth), 0), 1) AS mom_pct
FROM monthly ORDER BY mth;
-- mth 1: NULL | mth 2: 57.1 | mth 3: 0.0`, 'February grew 57.1 percent over January. March is flat (550 vs 550). In an interview say: "Growth was driven by February; March did not grow, so I would check whether orders per customer or order count changed."')]
],
important: [
 ['How do you calculate month-on-month growth in SQL?', `<p>First aggregate revenue per month in a CTE. Then use LAG(revenue) OVER (ORDER BY month) to get last month. Growth percent is (revenue - prev) / prev x 100. I use NULLIF on prev to avoid division by zero and handle the first month, which has NULL.</p>`],
 ['How do you calculate a running total?', `<p>SUM(amount) OVER (ORDER BY date). With PARTITION BY customer_id it restarts for every customer. I make the ORDER BY unique so tied dates do not get added together, or I write ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW.</p>`],
 ['What is the difference between LAG and LEAD?', `<p>LAG looks at a previous row and LEAD looks at a next row in the window order. Both take an offset and a default value. Example: LAG(amount, 1, 0) is the previous amount, or 0 for the first row.</p>`]
],
resources: [['WindowFunctions.com', 'https://www.windowfunctions.com'], ['Mode SQL tutorial (window functions)', 'https://mode.com/sql-tutorial']],
done: 'You are done when you can write MoM growth % and a running total from memory and explain what the frame ROWS BETWEEN does.'
},
/* ---------------- WED ---------------- */
{
title: 'NTILE, percent of total, gap detection + date/string functions',
time: '1.5 h',
study: [
 'NTILE(n) splits ordered rows into n buckets of nearly equal size (quartiles use NTILE(4)). If rows do not divide evenly, the first buckets get one extra row.',
 'Percent of total = value / SUM(value) OVER () x 100. The empty OVER () means "the whole result is one window".',
 'You can combine group aggregates with windows: SUM(SUM(amount)) OVER () sums the group totals.',
 'Gap detection: use LAG to compare a row with the previous one, and flag when the difference is more than 1 day (or 1 id).',
 'Consecutive streaks: date minus ROW_NUMBER stays constant inside one streak. Group by that value to find streaks.',
 'DATE_TRUNC(\'month\', d) rounds a date down to the month (PostgreSQL). EXTRACT(YEAR FROM d) gets a part. Date difference: PostgreSQL date - date, MySQL DATEDIFF(a, b), SQL Server DATEDIFF(day, b, a).',
 'Optional: string functions UPPER, LOWER, LENGTH, TRIM, SUBSTRING, REPLACE, CONCAT or ||, and SPLIT_PART(text, delimiter, n) in PostgreSQL. MySQL: SUBSTRING_INDEX.'],
how: [
 '[10 min] Create the logins table from the example (EXTRA section).',
 '[20 min] Run NTILE and percent-of-total queries. Check that percentages add up to about 100.',
 '[25 min] Run the gap query, then the streak query. On paper, write date minus row number for each login to see why it groups streaks.',
 '[10 min] run the date and string function lines and note the output.',
 '[25 min] Solve the practice questions.'],
example: pre(EXTRA) + `<p><b>1. Percent of total revenue per customer:</b></p>` + pre(`SELECT customer_id,
       SUM(amount) AS total,
       ROUND(100.0 * SUM(amount) / SUM(SUM(amount)) OVER (), 1) AS pct_of_total
FROM orders
GROUP BY customer_id
ORDER BY customer_id;`) + pre(`customer_id | total  | pct_of_total
1           | 350.00 | 24.1
2           | 600.00 | 41.4
3           | 500.00 | 34.5`) + `<p>First GROUP BY makes one total per customer. Then SUM(SUM(amount)) OVER () adds those three totals into 1450. Each total is divided by 1450.</p>
<p><b>2. NTILE(2): split employees into top half and bottom half by salary:</b></p>` + pre(`SELECT name, salary,
       NTILE(2) OVER (ORDER BY salary DESC, name) AS half
FROM employees
ORDER BY salary DESC, name;`) + pre(`Anil 90000 -> 1     Gita   55000 -> 2
Bina 70000 -> 1     Hari   55000 -> 2
Chetan 70000 -> 1   Divya  50000 -> 2
Esha 60000 -> 1     Farhan 40000 -> 2`) + `<p><b>3. Gaps between logins:</b></p>` + pre(`SELECT user_id, login_date,
       login_date - LAG(login_date) OVER (PARTITION BY user_id ORDER BY login_date) AS days_since_prev
FROM logins
ORDER BY user_id, login_date;`) + pre(`user_id | login_date | days_since_prev
1       | 2024-03-01 | NULL
1       | 2024-03-02 | 1
1       | 2024-03-03 | 1
1       | 2024-03-05 | 2     <- gap (a day missed)
1       | 2024-03-06 | 1
1       | 2024-03-10 | 4     <- gap
2       | 2024-03-01 | NULL
2       | 2024-03-02 | 1`) + `<p><b>4. Consecutive-day streaks</b> (PostgreSQL: date minus integer gives a date):</p>` + pre(`WITH x AS (
  SELECT user_id, login_date,
         login_date - CAST(ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) AS INT) AS grp
  FROM logins
)
SELECT user_id, MIN(login_date) AS streak_start, MAX(login_date) AS streak_end, COUNT(*) AS days
FROM x
GROUP BY user_id, grp
ORDER BY user_id, streak_start;`) + pre(`user_id | streak_start | streak_end | days
1       | 2024-03-01   | 2024-03-03 | 3
1       | 2024-03-05   | 2024-03-06 | 2
1       | 2024-03-10   | 2024-03-10 | 1
2       | 2024-03-01   | 2024-03-02 | 2`) + `<p><b>Why it works:</b> For user 1, the dates minus row numbers are: Mar 1 - 1 = Feb 29, Mar 2 - 2 = Feb 29, Mar 3 - 3 = Feb 29 (same group), Mar 5 - 4 = Mar 1 (new group), Mar 6 - 5 = Mar 1, Mar 10 - 6 = Mar 4. Days in a streak share one value, so GROUP BY finds them. (MySQL: DATE_SUB(login_date, INTERVAL rn DAY) instead of date minus integer.)</p>` + pre(`-- Optional: date and string functions (PostgreSQL)
SELECT DATE_TRUNC('month', DATE '2024-03-15');      -- 2024-03-01 00:00:00
SELECT EXTRACT(YEAR FROM DATE '2024-03-15');        -- 2024
SELECT SPLIT_PART('asha@gmail.com', '@', 2);        -- gmail.com
SELECT UPPER('asha'), LENGTH('asha');               -- ASHA, 4`),
practice: [
 ['Split the 8 employees into 4 salary quartiles with NTILE(4), highest salary first.', A(`SELECT name, salary, NTILE(4) OVER (ORDER BY salary DESC, name) AS quartile
FROM employees ORDER BY salary DESC, name;`, 'Two employees in each quartile: Anil, Bina = 1; Chetan, Esha = 2; Gita, Hari = 3; Divya, Farhan = 4.')],
 ['Show each employee\'s share of their department payroll in percent (1 decimal).', A(`SELECT dept, name, salary,
       ROUND(100.0 * salary / SUM(salary) OVER (PARTITION BY dept), 1) AS pct_of_dept
FROM employees ORDER BY dept, name;`, 'IT total is 230000: Anil 39.1, Bina 30.4, Chetan 30.4. HR total 110000: Divya 45.5, Esha 54.5. Sales total 150000: Farhan 26.7, Gita 36.7, Hari 36.7.')],
 ['For each order, its percent of the customer\'s total (customer 3 only needs to be checked).', A(`SELECT order_id, customer_id, amount,
       ROUND(100.0 * amount / SUM(amount) OVER (PARTITION BY customer_id), 1) AS pct
FROM orders ORDER BY order_id;`, 'Customer 3 orders: 104 = 30.0, 105 = 60.0, 106 = 10.0.')],
 ['Find logins that came after a gap of more than 1 day.', A(`WITH g AS (
  SELECT user_id, login_date,
         login_date - LAG(login_date) OVER (PARTITION BY user_id ORDER BY login_date) AS d
  FROM logins)
SELECT user_id, login_date FROM g WHERE d > 1 ORDER BY user_id, login_date;`, '(1, 2024-03-05) and (1, 2024-03-10). A filter on a window result needs the CTE.')],
 ['Longest login streak per user.', A(`WITH x AS (
  SELECT user_id, login_date,
         login_date - CAST(ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) AS INT) AS grp
  FROM logins),
s AS (SELECT user_id, grp, COUNT(*) AS days FROM x GROUP BY user_id, grp)
SELECT user_id, MAX(days) AS longest_streak FROM s GROUP BY user_id ORDER BY user_id;`, 'User 1 = 3 days, user 2 = 2 days. If logins can repeat on the same day, use COUNT(DISTINCT login_date) after removing duplicates first.')],
 ['Optional: get the domain from the email asha@gmail.com in PostgreSQL and in MySQL.', A(`-- PostgreSQL
SELECT SPLIT_PART('asha@gmail.com', '@', 2);
-- MySQL
SELECT SUBSTRING_INDEX('asha@gmail.com', '@', -1);`, 'Both return gmail.com.')]
],
important: [
 ['How would you find users who logged in on 3 consecutive days?', `<p>Remove duplicate days per user, then number the days with ROW_NUMBER per user. Subtract the row number from the date. Days in the same streak give the same result. GROUP BY user and that value and keep groups with COUNT of 3 or more. Another way is LAG or LEAD twice and check the dates differ by one day.</p>`],
 ['How do you calculate percent of total in SQL?', `<p>Divide the row value by SUM(value) OVER (). Add PARTITION BY to get the percent within a group. Multiply by 100.0 (with a decimal point) so integer division does not give zero.</p>`],
 ['What does NTILE do and where would an analyst use it?', `<p>NTILE(n) splits ordered rows into n nearly equal buckets. I use NTILE(4) for quartiles, or NTILE(10) for deciles, for example to find the top 10 percent of customers by spend. It is the base for RFM scoring.</p>`]
],
resources: [['WindowFunctions.com', 'https://www.windowfunctions.com'], ['Mode SQL tutorial', 'https://mode.com/sql-tutorial']],
done: 'You are done when you can calculate percent of total and a consecutive-days streak, and you know the date function for your target database.'
},
/* ---------------- THU ---------------- */
{
title: 'Classic interview questions: duplicates, Nth highest, top-N per group, no orders',
time: '1.5 h',
study: [
 'Find duplicates: GROUP BY the column(s) and HAVING COUNT(*) > 1.',
 'Delete duplicates but keep one row: keep the smallest id per group, delete the rest. Always run a SELECT first to see what will be deleted.',
 'Nth highest salary: use DENSE_RANK() = N in a CTE, or SELECT DISTINCT salary ORDER BY salary DESC LIMIT 1 OFFSET N-1.',
 'Top-N per group: ROW_NUMBER or DENSE_RANK with PARTITION BY group, then filter rn <= N in the outer query.',
 'Customers with no orders: LEFT JOIN ... WHERE o.key IS NULL, or NOT EXISTS.',
 'Ties matter. Always ask: "If two people share the Nth salary, show both?" This question impresses interviewers.',
 'MySQL warning: you cannot DELETE from a table and select from the same table in a plain subquery (error 1093). Use a derived table or a join delete.'],
how: [
 '[10 min] Create the contacts table from the Day 3 EXTRA block (it has duplicate emails).',
 '[15 min] Find duplicates, then write the SELECT that lists the rows you would delete before running any DELETE.',
 '[15 min] Delete duplicates keeping the lowest id. Check the table afterwards.',
 '[20 min] Write Nth highest salary 3 ways (DENSE_RANK, OFFSET, subquery). Test N = 2 and N = 3.',
 '[20 min] Write top-2 orders per customer. Then customers with no orders in March.',
 '[10 min] Save these 5 patterns as a section "Classic questions" in your repo README or week2.sql.'],
example: `<p>Use the <b>contacts</b> table (emails a@x.com repeats 3 times, b@x.com twice, c@x.com once).</p>` + pre(`-- 1. Find duplicate emails
SELECT email, COUNT(*) AS n
FROM contacts
GROUP BY email
HAVING COUNT(*) > 1
ORDER BY email;`) + pre(`email   | n
a@x.com | 3
b@x.com | 2`) + pre(`-- 2. See which rows will be deleted (keep the lowest id per email)
SELECT * FROM contacts
WHERE contact_id NOT IN (SELECT MIN(contact_id) FROM contacts GROUP BY email);
-- rows 3, 5, 6

-- 3. Delete them (PostgreSQL; MySQL raises error 1093 for this form, use the derived-table version below)
DELETE FROM contacts
WHERE contact_id NOT IN (SELECT MIN(contact_id) FROM contacts GROUP BY email);
-- table now has ids 1, 2, 4`) + `<p>Another way that also works in MySQL 8 (ROW_NUMBER inside a derived table):</p>` + pre(`DELETE FROM contacts
WHERE contact_id IN (
  SELECT contact_id FROM (
    SELECT contact_id,
           ROW_NUMBER() OVER (PARTITION BY email ORDER BY contact_id) AS rn
    FROM contacts) t
  WHERE rn > 1);`) + `<p><b>Nth highest salary (N = 3):</b> distinct salaries high to low are 90000, 70000, 60000, 55000, 50000, 40000, so the 3rd is 60000.</p>` + pre(`-- Way 1: DENSE_RANK
WITH r AS (
  SELECT name, salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS d FROM employees)
SELECT name, salary FROM r WHERE d = 3;           -- Esha 60000

-- Way 2: OFFSET (N - 1 = 2)
SELECT DISTINCT salary FROM employees
ORDER BY salary DESC LIMIT 1 OFFSET 2;            -- 60000`) + pre(`-- Top 2 orders per customer by amount
WITH x AS (
  SELECT customer_id, order_id, amount,
         ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY amount DESC) AS rn
  FROM orders)
SELECT customer_id, order_id, amount FROM x WHERE rn <= 2 ORDER BY customer_id, rn;`) + pre(`customer_id | order_id | amount
1           | 101      | 250.00
1           | 102      | 100.00
2           | 103      | 400.00
2           | 107      | 200.00
3           | 105      | 300.00
3           | 104      | 150.00`) + `<p><b>Explain:</b> Way 1 numbers distinct salaries with DENSE_RANK and keeps rank 3 (all people who have it). Way 2 removes repeated salaries with DISTINCT, sorts, skips 2 rows (OFFSET 2) and takes one. If fewer than 3 distinct salaries exist, Way 2 returns no row, and you can wrap it as a subquery in SELECT to return NULL instead. SQL Server: use OFFSET 2 ROWS FETCH NEXT 1 ROWS ONLY.</p>`,
practice: [
 ['Find duplicate emails and how many times each appears.', A(`SELECT email, COUNT(*) FROM contacts GROUP BY email HAVING COUNT(*) > 1;`, 'a@x.com 3 and b@x.com 2. c@x.com is not duplicated.')],
 ['Delete duplicate emails, keeping the row with the lowest contact_id. Which ids remain?', A(`DELETE FROM contacts
WHERE contact_id NOT IN (SELECT MIN(contact_id) FROM contacts GROUP BY email);`, 'Ids 1, 2, 4 remain. MIN(contact_id) per email is 1 (a), 2 (b), 4 (c); everything else is deleted. (Re-run the INSERT to restore the data before the next question that needs it.)')],
 ['Third highest distinct salary, and make the query return NULL when it does not exist.', A(`SELECT (SELECT DISTINCT salary FROM employees
        ORDER BY salary DESC LIMIT 1 OFFSET 2) AS third_highest;`, '60000. A scalar subquery that returns no row becomes NULL, so the outer SELECT always returns one row. This handles the edge case interviewers ask about.')],
 ['Second highest salary in each department (all people who hold it).', A(`WITH r AS (
  SELECT dept, name, salary,
         DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS d
  FROM employees)
SELECT dept, name, salary FROM r WHERE d = 2 ORDER BY dept, name;`, 'HR: Divya 50000. IT: Bina and Chetan 70000. Sales: Farhan 40000.')],
 ['Customers who placed no order in March 2024.', A(`SELECT c.name FROM customers c
WHERE NOT EXISTS (
  SELECT 1 FROM orders o
  WHERE o.customer_id = c.customer_id
    AND o.order_date >= '2024-03-01' AND o.order_date < '2024-04-01')
ORDER BY c.name;`, 'Asha, John, Sara. Meena (105, 106) and Ravi (107) ordered in March. A range with < the next month start is safer than BETWEEN for dates that may have time parts.')],
 ['Top customer by revenue in each city (use the customers table; skip NULL city).', A(`WITH t AS (
  SELECT c.city, c.name, SUM(o.amount) AS total,
         ROW_NUMBER() OVER (PARTITION BY c.city ORDER BY SUM(o.amount) DESC) AS rn
  FROM customers c JOIN orders o ON o.customer_id = c.customer_id
  WHERE c.city IS NOT NULL
  GROUP BY c.city, c.name)
SELECT city, name, total FROM t WHERE rn = 1 ORDER BY city;`, 'Delhi: Ravi 600. Mumbai: Meena 500 (Asha has 350). Window functions can use aggregates in their ORDER BY because GROUP BY runs first.')]
],
important: [
 ['How do you find and delete duplicate rows?', `<p>To find: GROUP BY the columns that define a duplicate and HAVING COUNT(*) greater than 1. To delete: number rows per duplicate group with ROW_NUMBER (or take MIN(id) per group) and delete all rows except the first. I run the SELECT first to check what will be removed, and do it inside a transaction.</p>`],
 ['Find the Nth highest salary.', `<p>I use DENSE_RANK() OVER (ORDER BY salary DESC) in a CTE and filter for N. This handles ties correctly. Another way is SELECT DISTINCT salary ORDER BY salary DESC with OFFSET N-1 LIMIT 1. I would also ask what to return if fewer than N salaries exist.</p>`],
 ['Find the top 3 products by sales in each category.', `<p>Aggregate sales per product, then use ROW_NUMBER or DENSE_RANK partitioned by category and ordered by sales descending, in a CTE. In the outer query filter rank 3 or less. I choose RANK/DENSE_RANK if ties should all be shown.</p>`],
 ['How do you list customers who have never ordered?', `<p>LEFT JOIN orders and keep rows where the order id IS NULL, or use NOT EXISTS. I avoid NOT IN because a NULL in the subquery makes it return nothing.</p>`]
],
resources: [['DataLemur', 'https://datalemur.com'], ['StrataScratch', 'https://www.stratascratch.com']],
done: 'You are done when you can write all 5 classic patterns (duplicates, delete duplicates, Nth highest, top-N per group, no orders) from memory.'
},
/* ---------------- FRI ---------------- */
{
title: 'UNION vs UNION ALL, EXISTS vs IN, INTERSECT / EXCEPT + views and indexes',
time: '1.5 h',
study: [
 'UNION stacks the results of two queries and removes duplicates. UNION ALL stacks them and keeps duplicates (faster).',
 'Both queries must return the same number of columns with compatible types, in the same order.',
 'INTERSECT returns rows that appear in both results. EXCEPT returns rows from the first result that are not in the second. Oracle calls EXCEPT "MINUS". MySQL supports INTERSECT and EXCEPT only from version 8.0.31.',
 'In set operations, NULLs are treated as equal to each other (unlike in joins).',
 'EXISTS checks if a subquery returns any row; it stops at the first match. IN compares a value to a list.',
 'NOT EXISTS is safe with NULLs. NOT IN is not. Prefer EXISTS or NOT EXISTS for "does it exist" questions.',
 'Optional: a view is a saved query that you use like a table. It stores no data. An index is a lookup structure that makes searching on a column faster but slows inserts a little and uses space.'],
how: [
 '[10 min] Create the suppliers table from the Day 3 EXTRA block.',
 '[20 min] Run UNION, UNION ALL, INTERSECT and EXCEPT on the city lists. Predict row counts first.',
 '[20 min] Write the same "customers with orders" question using IN, EXISTS and a JOIN. Compare results.',
 '[15 min] Write the "customers without orders" using NOT IN, NOT EXISTS, LEFT JOIN. Then think: which one breaks if orders.customer_id had a NULL?',
 '[15 min] Optional: create a view and an index (see example), and read about when an index helps.',
 '[10 min] Add 3 lines to week2.sql comments: "UNION vs UNION ALL", "EXISTS vs IN", "view vs table".'],
example: `<p>Customers' cities: Mumbai, Delhi, Mumbai, Pune, NULL. Suppliers' cities: Mumbai, Chennai, Pune.</p>` + pre(`SELECT city FROM customers
UNION
SELECT city FROM suppliers;
-- 5 rows: Mumbai, Delhi, Pune, NULL, Chennai (duplicates removed)

SELECT city FROM customers
UNION ALL
SELECT city FROM suppliers;
-- 8 rows (5 + 3, nothing removed)

SELECT city FROM customers
INTERSECT
SELECT city FROM suppliers;
-- 2 rows: Mumbai, Pune

SELECT city FROM customers
EXCEPT
SELECT city FROM suppliers;
-- 2 rows: Delhi, NULL`) + `<p><b>Explain:</b> UNION has to compare rows to remove duplicates, so it does extra work. If you know there are no duplicates, or you want them, use UNION ALL. INTERSECT keeps the cities common to both lists (Mumbai, Pune). EXCEPT keeps customer cities missing from suppliers (Delhi and the NULL).</p>` + pre(`-- EXISTS: customers who have at least one order
SELECT c.name FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id)
ORDER BY c.name;                      -- Asha, Meena, Ravi

-- NOT EXISTS: customers with no order
SELECT c.name FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id)
ORDER BY c.name;                      -- John, Sara`) + `<p>The SELECT 1 is a convention: EXISTS only checks if a row is found, the selected value does not matter. A join would repeat customers with many orders; EXISTS never does.</p>` + pre(`-- Optional: view and index
CREATE VIEW customer_totals AS
SELECT customer_id, COUNT(*) AS n_orders, SUM(amount) AS total
FROM orders GROUP BY customer_id;

SELECT * FROM customer_totals WHERE total > 400;   -- customers 2 and 3

CREATE INDEX idx_orders_customer ON orders (customer_id);`) + `<p>The view saves the GROUP BY logic under a name; every time you query it, the database runs the stored query. The index lets the database find all orders of one customer without reading the whole table. Good columns to index: those used often in WHERE and JOIN conditions.</p>`,
practice: [
 ['How many rows do UNION and UNION ALL return for the two city lists? Why do they differ?', A(`SELECT city FROM customers UNION SELECT city FROM suppliers;      -- 5
SELECT city FROM customers UNION ALL SELECT city FROM suppliers;  -- 8`, '5 and 8. UNION removes 3 duplicate rows (Mumbai appears 3 times, so 2 extra copies go, and Pune appears twice, so 1 extra copy goes). UNION ALL keeps all 5 + 3 rows.')],
 ['Cities where both a customer and a supplier exist.', A(`SELECT city FROM customers
INTERSECT
SELECT city FROM suppliers;`, 'Mumbai and Pune. Same result with an INNER JOIN on city plus DISTINCT; NULLs would not match there.')],
 ['Cities that have customers but no suppliers, written WITHOUT EXCEPT.', A(`SELECT DISTINCT c.city
FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM suppliers s WHERE s.city = c.city);`, 'Delhi and NULL. Note: s.city = c.city is never true for NULL, so the NULL row is kept by NOT EXISTS, matching EXCEPT. For databases without EXCEPT (older MySQL), this is the workaround.')],
 ['Customers who have placed at least one order, using EXISTS. Why might you prefer it to a JOIN?', A(`SELECT name FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);`, 'Asha, Ravi, Meena. A JOIN would return Asha and Ravi twice and Meena three times unless you add DISTINCT.')],
 ['Customers whose city is NOT in the supplier cities, with NOT IN. What is the result and what is the danger?', A(`SELECT name FROM customers
WHERE city NOT IN (SELECT city FROM suppliers);`, 'Only Ravi (Delhi). Sara (NULL city) is dropped. If suppliers had a row with city NULL, the query would return zero rows, so prefer NOT EXISTS.')],
 ['Optional: What is the difference between a view and a table, and when does an index NOT help?', A(`-- Example idea: an index on a column with only 2 distinct values
-- (like gender) or on a tiny table is rarely used by the database.`, 'A table stores data; a view stores only a query. An index does not help much on very small tables, on columns with very few distinct values, or when the query reads most of the table anyway.')]
],
important: [
 ['What is the difference between UNION and UNION ALL?', `<p>UNION combines two result sets and removes duplicates; UNION ALL combines them and keeps every row. UNION ALL is faster because it skips the duplicate check, so I use it unless I need unique rows. Both need the same number of columns and compatible types.</p>`],
 ['EXISTS vs IN: when do you use which?', `<p>EXISTS asks "is there at least one matching row" and stops at the first, so it works well with big correlated subqueries and is safe with NULLs. IN compares against a list and is fine for small lists. For negation I use NOT EXISTS because NOT IN returns nothing when the list has a NULL.</p>`],
 ['What is an index and what is a view?', `<p>An index is an extra structure on one or more columns that makes searching and joining faster, at the cost of storage and slower writes. A view is a saved SELECT that behaves like a table, used to simplify complex queries or restrict access. A normal view stores no data.</p>`]
],
resources: [['DataLemur', 'https://datalemur.com'], ['Mode SQL tutorial', 'https://mode.com/sql-tutorial']],
done: 'You are done when you can say when to use UNION ALL, EXISTS and NOT EXISTS, and you can write INTERSECT and EXCEPT queries.'
},
/* ---------------- SAT ---------------- */
{
title: 'Timed practice: 10 medium problems',
time: '3.5 h',
study: [
 'Interview SQL is timed. You usually get 15 to 25 minutes per question and must talk while you type.',
 'Use a fixed routine: (1) repeat the question, (2) ask about ties, NULLs and duplicates, (3) name the tables and keys, (4) write the simple version first, (5) test on tiny data.',
 'Most medium problems are one of: ranking, running total, LAG/LEAD, duplicates, anti-join (no match), conditional aggregation, or self join.',
 'If you get stuck, write the SQL for the part you know (the join, the group) and say what is missing. Partial progress with a clear plan scores better than silence.',
 'After each problem, write what pattern it used. Patterns repeat across companies.',
 'DataLemur and StrataScratch show company-tagged questions. Choose "Medium", filter by SQL topic.'],
how: [
 '[10 min] Open DataLemur (free). Pick 10 Medium problems: aim for 3 window function, 2 join, 2 aggregation with CASE, 1 duplicates, 1 date, 1 self join. StrataScratch is an alternative (free tier has limits).',
 '[150 min] For each problem: set a timer for 20 minutes. Talk out loud as if the interviewer is listening. Write the query. Submit. If wrong, give yourself 5 more minutes. Then read the solution.',
 '[20 min] In a table in your notes, log for each problem: name, minutes taken, solved yes/no, pattern, what went wrong.',
 '[20 min] Redo the 2 slowest problems from scratch without looking.',
 '[10 min] Practice 6 extra questions on your own schema (below). They are fully solved so you can compare.',
 '[Deliverable] A table of 10 problems with times and patterns, saved in week2-log.md in your GitHub repo.'],
example: `<p>Sample timed problem on your practice schema. <b>"Find the month with the highest revenue. If two months tie, return both."</b></p>
<p>Say aloud: "I need revenue per month, then rank months by revenue. Ties should both appear, so I use RANK or DENSE_RANK, not LIMIT 1."</p>` + pre(`WITH m AS (
  SELECT EXTRACT(MONTH FROM order_date) AS mth, SUM(amount) AS revenue
  FROM orders
  GROUP BY EXTRACT(MONTH FROM order_date)
), r AS (
  SELECT mth, revenue, RANK() OVER (ORDER BY revenue DESC) AS rnk FROM m
)
SELECT mth, revenue FROM r WHERE rnk = 1 ORDER BY mth;`) + pre(`mth | revenue
2   | 550.00
3   | 550.00`) + `<p><b>Explain:</b> Step 1 (CTE m): revenue per month is 350, 550, 550. Step 2 (CTE r): RANK gives 550 and 550 both rank 1 and 350 rank 3. Step 3: keep rank 1, so both February and March appear. With LIMIT 1 you would silently drop one of them, which is the mistake interviewers look for. Note: in real data also group by year.</p>
<p><b>Log template for week2-log.md:</b></p>` + pre(`| # | Problem | Minutes | Solved | Pattern        | Mistake / lesson          |
|---|---------|---------|--------|----------------|---------------------------|
| 1 | ...     | 18      | yes    | DENSE_RANK     | forgot PARTITION BY       |`),
practice: [
 ['Customers whose FIRST order was above 200.', A(`WITH f AS (
  SELECT customer_id, amount,
         ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date) AS rn
  FROM orders)
SELECT c.name FROM f JOIN customers c ON c.customer_id = f.customer_id
WHERE f.rn = 1 AND f.amount > 200 ORDER BY c.name;`, 'Asha (first order 250) and Ravi (400). Meena\'s first order was 150.')],
 ['Month(s) with highest revenue, keeping ties (see example).', A(`WITH m AS (
  SELECT EXTRACT(MONTH FROM order_date) AS mth, SUM(amount) AS revenue
  FROM orders GROUP BY EXTRACT(MONTH FROM order_date)),
r AS (SELECT mth, revenue, RANK() OVER (ORDER BY revenue DESC) AS rnk FROM m)
SELECT mth, revenue FROM r WHERE rnk = 1 ORDER BY mth;
-- 2 | 550.00 and 3 | 550.00`, 'February and March, both 550. LIMIT 1 would return only one of them.')],
 ['Employees who earn more than everyone in HR.', A(`SELECT name, salary FROM employees
WHERE salary > (SELECT MAX(salary) FROM employees WHERE dept = 'HR')
ORDER BY salary DESC, name;`, 'HR max is 60000, so Anil 90000, Bina 70000, Chetan 70000. Gita and Hari (55000) are below.')],
 ['Cumulative percent of revenue by customer, biggest customer first (Pareto view).', A(`WITH t AS (
  SELECT customer_id, SUM(amount) AS total FROM orders GROUP BY customer_id)
SELECT customer_id, total,
       ROUND(100.0 * SUM(total) OVER (ORDER BY total DESC) / SUM(total) OVER (), 1) AS cum_pct
FROM t ORDER BY total DESC;`, 'Customer 2: 600, 41.4. Customer 3: 500, 75.9. Customer 1: 350, 100.0. Two customers give three quarters of revenue.')],
 ['Customers who ordered in two consecutive months (single year of data).', A(`WITH cm AS (
  SELECT DISTINCT customer_id, CAST(EXTRACT(MONTH FROM order_date) AS INT) AS mth
  FROM orders),
x AS (
  SELECT customer_id, mth,
         LAG(mth) OVER (PARTITION BY customer_id ORDER BY mth) AS prev_mth
  FROM cm)
SELECT DISTINCT customer_id FROM x WHERE mth - prev_mth = 1 ORDER BY customer_id;`, 'Customers 2 (Feb, Mar) and 3 (Feb, Mar). Customer 1 only ordered in January. For multi-year data use year*12+month as the month number.')],
 ['Customers whose average order amount is above the overall average order amount.', A(`SELECT customer_id, ROUND(AVG(amount), 2) AS avg_amt
FROM orders
GROUP BY customer_id
HAVING AVG(amount) > (SELECT AVG(amount) FROM orders);`, 'Only customer 2 (avg 300). Overall average is 207.14; customer 1 has 175 and customer 3 has 166.67.')]
],
important: [
 ['How do you approach a SQL question in a timed interview?', `<p>I repeat the question in my own words, ask about ties, NULLs and duplicates, and name the tables and keys. I write the simplest version first, then improve it. I explain aloud while typing, test with a tiny example, and mention how I would check the result on real data.</p>`],
 ['Which SQL patterns do you see most often in analyst interviews?', `<p>Ranking and top-N per group, running total and MoM growth with LAG, duplicates, customers with no orders (anti-join), conditional aggregation with CASE, and self joins such as employees and managers. I practise these until they are automatic.</p>`],
 ['You are stuck in the middle of an interview question. What do you do?', `<p>I say what I know and what is missing. I write the join and group parts that I am sure about, then ask a clarifying question or try a smaller example. Interviewers want to see how I think, so I keep talking and do not go silent.</p>`]
],
resources: [['DataLemur', 'https://datalemur.com'], ['StrataScratch', 'https://www.stratascratch.com'], ['LeetCode Database problems', 'https://leetcode.com/problemset/database/']],
done: 'You are done when you have solved 10 timed medium problems, logged times and patterns in week2-log.md, and know your 2 weakest patterns.'
},
/* ---------------- SUN ---------------- */
{
title: 'Mini project: 10 business questions on Chinook + README',
time: '3.5 h',
study: [
 'A business question is not "write a join". It is "which country brings the most revenue?" Your job is to turn it into SQL, then explain the answer in a sentence.',
 'Chinook is a digital music store. Real tables and columns: Customer (CustomerId, FirstName, LastName, Country), Invoice (InvoiceId, CustomerId, InvoiceDate, BillingCountry, Total), InvoiceLine (InvoiceId, TrackId, UnitPrice, Quantity), Track (TrackId, Name, AlbumId, GenreId, UnitPrice), Album (AlbumId, Title, ArtistId), Artist (ArtistId, Name), Genre (GenreId, Name). In the PostgreSQL version these names are often quoted, so write "Invoice" and "Total" with double quotes.',
 'Your answers on GitHub will be read by recruiters: give each query a title, the question, the SQL and a one-line insight.',
 'A good README says: what the project is, the dataset, the tools, the 10 questions and what you learned.',
 'Advanced (skip if short on time): a recursive CTE walks a hierarchy such as employee to manager levels. EXPLAIN shows how the database will run a query. Just read about both, do not master them.'],
how: [
 '[15 min] Connect to the chinook database in DBeaver. Open the table list. Run SELECT * FROM "Invoice" LIMIT 5; Note the exact names; if your version has lowercase names, drop the quotes.',
 '[100 min] Answer the 10 questions below one by one. Write each into chinook-queries.sql with a comment: question, query, one-line insight (read the result and say what it means).',
 '[25 min] Create README.md in your repo: title, dataset link, tools (PostgreSQL, DBeaver), the 10 questions as a list, and 3 lessons learned.',
 '[15 min] Push to GitHub (git add ., git commit -m "week 2 chinook queries", git push). Open the repo page and check the README renders.',
 '[Advanced, 20 min] Read the recursive CTE example and run it on the practice employees table. Run EXPLAIN once on a query and notice "Seq Scan" vs "Index Scan". Do not memorise anything.',
 '[5 min] Tick the weekly checklist and note your weak topics for week 3.'],
example: `<p><b>The 10 questions.</b> Write queries for all of them:</p>` + pre(`1. Top 5 countries by total revenue.
2. Top 10 customers by total spend (full name + total).
3. Revenue by genre.
4. Monthly revenue and month-on-month growth %.
5. Best-selling artist by revenue.
6. Customers who bought in only one year (or only one genre).
7. Running total of revenue by month.
8. Top 3 tracks by revenue within each genre.
9. Customers who have not purchased in the last 12 months of data.
10. Average invoice value by country, only countries with 5+ invoices.`) + `<p><b>Model answers for three of them</b> (PostgreSQL, quoted names as in the standard Chinook script; if your copy uses lowercase names, remove the quotes):</p>` + pre(`-- Q1: Top 5 countries by revenue
SELECT "BillingCountry", SUM("Total") AS revenue
FROM "Invoice"
GROUP BY "BillingCountry"
ORDER BY revenue DESC
LIMIT 5;

-- Q3: Revenue by genre
SELECT g."Name" AS genre, SUM(il."UnitPrice" * il."Quantity") AS revenue
FROM "InvoiceLine" il
JOIN "Track" t ON t."TrackId" = il."TrackId"
JOIN "Genre" g ON g."GenreId" = t."GenreId"
GROUP BY g."Name"
ORDER BY revenue DESC;

-- Q4: Monthly revenue with MoM growth
WITH m AS (
  SELECT DATE_TRUNC('month', "InvoiceDate") AS month, SUM("Total") AS revenue
  FROM "Invoice" GROUP BY 1
)
SELECT month, revenue,
       ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))
             / NULLIF(LAG(revenue) OVER (ORDER BY month), 0), 1) AS mom_pct
FROM m ORDER BY month;`) + `<p><b>Explain:</b> Q1 groups invoices by country, sums Total and shows the top 5. Q3 walks from the invoice line to the track to the genre, because the genre is stored on the track. Q4 is the same MoM pattern you practised on Day 2. Your exact numbers depend on your copy of the database, so read your own output and write the insight, for example: "The USA brings the most revenue, about a fifth of the total." Check the real numbers before you write a sentence.</p>
<p><b>README template:</b></p>` + pre(`# Chinook SQL Analysis
Business questions answered with PostgreSQL on the Chinook music-store database.

## Questions
1. Top 5 countries by revenue ...
(list all 10)

## Skills shown
JOINs, GROUP BY / HAVING, CTEs, window functions (RANK, LAG, running total)

## Key insights
- ...
- ...

## How to run
Load the Chinook PostgreSQL script, then run chinook-queries.sql`),
practice: [
 ['Chinook Q2: top 10 customers by total spend (full name and total).', A(`SELECT c."FirstName" || ' ' || c."LastName" AS customer, SUM(i."Total") AS total_spend
FROM "Customer" c
JOIN "Invoice" i ON i."CustomerId" = c."CustomerId"
GROUP BY c."CustomerId", c."FirstName", c."LastName"
ORDER BY total_spend DESC
LIMIT 10;`, 'Group by CustomerId (the unique key) plus the name columns, so two customers with the same name are not merged. || joins text in PostgreSQL; MySQL uses CONCAT().')],
 ['Chinook Q8: top 3 tracks by revenue within each genre.', A(`WITH t AS (
  SELECT g."Name" AS genre, tr."Name" AS track,
         SUM(il."UnitPrice" * il."Quantity") AS revenue
  FROM "InvoiceLine" il
  JOIN "Track" tr ON tr."TrackId" = il."TrackId"
  JOIN "Genre" g  ON g."GenreId" = tr."GenreId"
  GROUP BY g."Name", tr."Name"),
r AS (
  SELECT genre, track, revenue,
         ROW_NUMBER() OVER (PARTITION BY genre ORDER BY revenue DESC, track) AS rn
  FROM t)
SELECT genre, track, revenue FROM r WHERE rn <= 3 ORDER BY genre, rn;`, 'Aggregate first, then rank inside each genre, then keep rank 3 or less. Same top-N-per-group pattern as Day 4.')],
 ['Chinook Q10: average invoice value by country, only countries with 5 or more invoices.', A(`SELECT "BillingCountry", COUNT(*) AS n_invoices, ROUND(AVG("Total"), 2) AS avg_invoice
FROM "Invoice"
GROUP BY "BillingCountry"
HAVING COUNT(*) >= 5
ORDER BY avg_invoice DESC;`, 'HAVING filters countries after grouping. ROUND(..., 2) works because Total is a numeric type in the PostgreSQL script.')],
 ['Advanced: using the practice employees table, show every employee with their level in the hierarchy (Anil is level 1).', A(`WITH RECURSIVE chain AS (
  SELECT emp_id, name, manager_id, 1 AS lvl
  FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.emp_id, e.name, e.manager_id, c.lvl + 1
  FROM employees e
  JOIN chain c ON e.manager_id = c.emp_id
)
SELECT name, lvl FROM chain ORDER BY lvl, emp_id;`, 'Level 1: Anil. Level 2: Bina, Chetan, Divya, Farhan. Level 3: Esha (under Divya), Gita and Hari (under Farhan). The first SELECT is the start (top boss); the part after UNION ALL repeatedly adds the next level until no more rows are found. SQL Server omits the word RECURSIVE.')],
 ['Advanced: what do you look for in the output of EXPLAIN on a slow query?', A(`EXPLAIN SELECT * FROM orders WHERE customer_id = 3;`, 'Look at the scan type. "Seq Scan" means the whole table is read; "Index Scan" means an index is used. After CREATE INDEX on customer_id, the plan may change on a large table (on a tiny table PostgreSQL still prefers a Seq Scan). EXPLAIN ANALYZE also runs the query and shows real times. At entry level, knowing this is enough.')]
],
important: [
 ['Tell me about a SQL project you did.', `<p>I analysed the Chinook music-store database with PostgreSQL. I answered 10 business questions such as top countries by revenue, revenue by genre, month-on-month growth and top tracks per genre. I used joins, CTEs and window functions, and wrote an insight for each result in a README on GitHub.</p>`],
 ['How would you find the month-on-month revenue growth for a store?', `<p>Aggregate revenue by month in a CTE using DATE_TRUNC, then use LAG to get the previous month and calculate (revenue minus previous) divided by previous times 100. I handle the first month, which has no previous value, and I check the totals against a simple SUM.</p>`],
 ['What is a recursive CTE? (advanced)', `<p>A CTE that refers to itself. It has a starting query and a repeating part joined with UNION ALL, and it stops when no new rows appear. It is used for hierarchies like employee-manager levels or category trees. I know the idea but have only practised it on small examples.</p>`]
],
resources: [['Chinook database on GitHub', 'https://github.com/lerocha/chinook-database'], ['GitHub', 'https://github.com']],
done: 'You are done when 10 Chinook business questions are answered with insights, a README is live on GitHub, and you have read (not mastered) recursive CTEs and EXPLAIN.'
}
]
};
})();
