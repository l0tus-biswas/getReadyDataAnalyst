/* Week 1 guide: SQL Foundations. Dialect: PostgreSQL unless stated. */
(function () {
const S = `-- Practice schema (PostgreSQL). Paste in DBeaver or db-fiddle.com and run once.
CREATE TABLE customers (
  customer_id INT PRIMARY KEY,
  name        VARCHAR(50),
  city        VARCHAR(50)
);
CREATE TABLE orders (
  order_id    INT PRIMARY KEY,
  customer_id INT,
  order_date  DATE,
  amount      NUMERIC(10,2)
);
CREATE TABLE employees (
  emp_id     INT PRIMARY KEY,
  name       VARCHAR(50),
  dept       VARCHAR(30),
  salary     INT,
  manager_id INT
);

INSERT INTO customers VALUES
 (1,'Asha','Mumbai'),(2,'Ravi','Delhi'),(3,'Meena','Mumbai'),
 (4,'John','Pune'),(5,'Sara',NULL);

INSERT INTO orders VALUES
 (101,1,'2024-01-05',250),(102,1,'2024-01-20',100),
 (103,2,'2024-02-02',400),(104,3,'2024-02-14',150),
 (105,3,'2024-03-01',300),(106,3,'2024-03-15',50),
 (107,2,'2024-03-20',200);

INSERT INTO employees VALUES
 (1,'Anil','IT',90000,NULL),(2,'Bina','IT',70000,1),
 (3,'Chetan','IT',70000,1),(4,'Divya','HR',50000,1),
 (5,'Esha','HR',60000,4),(6,'Farhan','Sales',40000,1),
 (7,'Gita','Sales',55000,6),(8,'Hari','Sales',55000,6);`;

const A = (sql, why) => pre(sql) + '<p>' + why + '</p>';

GUIDES[1] = {
intro: `<p>SQL is tested in almost every data analyst interview, often as the first filter. This week you build the base: SELECT, filters, GROUP BY, JOINs, CASE, NULL handling, subqueries and CTEs. Nothing here is hard, but you must be able to write it without looking.</p>
<p><b>By Sunday you can:</b> read a business question, pick the right tables, join them without wrong row counts, group and filter the result, and explain your query aloud. You will also have a GitHub repo with your solved queries.</p>
<p><b>Time split:</b> weekdays 1.5 h = 20 min reading, 50 min typing queries, 20 min practice questions. Weekend = more practice and one deliverable. Type every query yourself. Do not copy and paste.</p>
<p><b>Dialect:</b> all SQL here is PostgreSQL. Small differences in MySQL and SQL Server are noted where they matter.</p>`,
days: [
/* ---------------- MON ---------------- */
{
title: 'Setup + SELECT basics',
time: '1.5 h',
study: [
 'A database is a set of tables. A table has columns (fields) and rows (records).',
 'SELECT chooses columns; FROM names the table. SELECT * means all columns (fine for exploring, avoid in final work).',
 'WHERE filters rows before anything else. Text values use single quotes: dept = \'IT\'.',
 'ORDER BY sorts. ASC is the default; use DESC for biggest first. You can sort by two columns.',
 'LIMIT n returns only the first n rows (PostgreSQL, MySQL). SQL Server uses SELECT TOP n instead.',
 'DISTINCT removes duplicate rows from the result.',
 'Comparison tools: =, &lt;&gt; (not equal), &gt;, &lt;, &gt;=, &lt;=, AND, OR, NOT. Use brackets when mixing AND with OR.',
 'An alias (AS total) gives a column a friendly name in the output.'],
how: [
 '[20 min] Install PostgreSQL (use the Windows installer, note the password you set for user postgres, keep port 5432) and DBeaver Community. If install fails, skip it and use db-fiddle.com (choose PostgreSQL) for now.',
 '[10 min] In DBeaver: New Database Connection, PostgreSQL, enter host localhost, port 5432, user postgres, your password. Right click Databases and create a database named practice.',
 '[10 min] Open a SQL editor on that database. Paste the practice schema from the example below. Run it with Alt+X (run script). Check with SELECT * FROM employees;',
 '[15 min] Load the Chinook sample database: download the PostgreSQL .sql script from the Chinook GitHub page (see resources), create a second database named chinook and run the script. Table names may be quoted like "Track" in this version. If you get "relation does not exist", put double quotes around the name.',
 '[25 min] Type the example queries below one by one. Change the WHERE value and predict the result before you run it.',
 '[10 min] Solve the practice questions. Save your answers in a file called week1.sql. You will push it to GitHub on Saturday.'],
example: `<p>We use three small tables all week: <b>customers</b>, <b>orders</b>, <b>employees</b>. Run this once.</p>` + pre(S) + `
<p>Now try three queries:</p>` + pre(`-- 1. IT employees, highest salary first (name breaks the tie)
SELECT name, salary
FROM employees
WHERE dept = 'IT'
ORDER BY salary DESC, name;

-- 2. Which departments exist?
SELECT DISTINCT dept FROM employees;

-- 3. Top 3 paid employees
SELECT name, salary
FROM employees
ORDER BY salary DESC, name
LIMIT 3;`) + pre(`Result of query 1:
name    | salary
Anil    | 90000
Bina    | 70000
Chetan  | 70000

Result of query 2 (order can vary): IT, HR, Sales

Result of query 3:
Anil 90000 / Bina 70000 / Chetan 70000`) + `
<p><b>Line by line (query 1):</b> FROM picks the table. WHERE keeps only rows where dept is IT. SELECT shows two columns. ORDER BY sorts by salary high to low; if two salaries are equal, name A to Z decides. Query 3 has no WHERE, so all 8 rows are sorted and LIMIT cuts the first 3. In SQL Server write <code>SELECT TOP 3 name, salary FROM employees ORDER BY salary DESC</code>.</p>`,
practice: [
 ['Names of Sales employees who earn more than 50000.', A(`SELECT name FROM employees
WHERE dept = 'Sales' AND salary > 50000;`, 'Returns Gita and Hari. Farhan earns 40000 so he is filtered out.')],
 ['List the distinct cities in the customers table. How many rows come back?', A(`SELECT DISTINCT city FROM customers;`, '4 rows: Mumbai, Delhi, Pune and NULL. DISTINCT treats NULL as one value. Sara has no city, so she gives the NULL row.')],
 ['Show the 2 highest paid employees (name, salary).', A(`SELECT name, salary FROM employees
ORDER BY salary DESC, name
LIMIT 2;`, 'Anil 90000 and Bina 70000. Chetan also has 70000, so a stable tie-break column (name) matters. Without it the database may return Bina or Chetan.')],
 ['Show orders placed in February 2024 (order_id, order_date, amount).', A(`SELECT order_id, order_date, amount FROM orders
WHERE order_date BETWEEN '2024-02-01' AND '2024-02-29';`, 'Orders 103 and 104. BETWEEN includes both ends. 2024 is a leap year so February ends on the 29th.')],
 ['Employees in HR or IT who earn 70000 or less (name, dept).', A(`SELECT name, dept FROM employees
WHERE dept IN ('HR','IT') AND salary <= 70000;`, 'Bina, Chetan (IT), Divya, Esha (HR). Anil is excluded because 90000 is above 70000.')],
 ['Write the query "first order only (earliest date)" so it also works in SQL Server.', A(`SELECT TOP 1 order_id, order_date
FROM orders
ORDER BY order_date;`, 'Returns order 101 (2024-01-05). SQL Server uses TOP, PostgreSQL and MySQL use LIMIT 1 at the end.')]
],
important: [
 ['What is the difference between WHERE and ORDER BY?', `<p>WHERE removes rows that do not match a condition. ORDER BY only changes the order of the rows that are left. WHERE runs first, ORDER BY runs near the end.</p>`],
 ['How do you get the top 5 rows in different databases?', `<p>PostgreSQL and MySQL: <code>ORDER BY col DESC LIMIT 5</code>. SQL Server: <code>SELECT TOP 5 ... ORDER BY col DESC</code>. Oracle 12c and newer: <code>FETCH FIRST 5 ROWS ONLY</code>. Always add ORDER BY, because "top" has no meaning without an order.</p>`],
 ['What does DISTINCT do and when do you use it?', `<p>It removes duplicate rows from the result. I use it to see the list of unique values in a column, or to remove duplicates after a join. I also check why duplicates appeared, because a join mistake is a common cause.</p>`]
],
resources: [['SQLBolt (interactive lessons 1-6)', 'https://sqlbolt.com'], ['Chinook database on GitHub', 'https://github.com/lerocha/chinook-database'], ['db-fiddle (run SQL online)', 'https://www.db-fiddle.com']],
done: 'You are done when your practice schema and Chinook are loaded and you can write SELECT with WHERE, ORDER BY, LIMIT and DISTINCT without looking.'
},
/* ---------------- TUE ---------------- */
{
title: 'Aggregates, GROUP BY, HAVING',
time: '1.5 h',
study: [
 'Aggregate functions turn many rows into one value: COUNT, SUM, AVG, MIN, MAX.',
 'COUNT(*) counts all rows. COUNT(column) counts rows where that column is NOT NULL. COUNT(DISTINCT column) counts unique non-null values.',
 'GROUP BY splits rows into groups and gives one result row per group.',
 'Every column in SELECT must be either inside an aggregate or listed in GROUP BY. Otherwise PostgreSQL gives an error.',
 'WHERE filters rows BEFORE grouping. HAVING filters groups AFTER grouping (use it with aggregates).',
 'SUM and AVG ignore NULL values. AVG of (10, 20, NULL) is 15, not 10.',
 'ROUND(x, 2) rounds to 2 decimals. In PostgreSQL ROUND with 2 arguments needs a numeric type, not a float.'],
how: [
 '[10 min] Open SQLBolt lessons on aggregates (lessons 10 and 11) and read the rule about GROUP BY.',
 '[20 min] Type the example queries below. For each one, count the groups on paper first.',
 '[10 min] Break it on purpose: remove customer_id from GROUP BY and read the error message. Errors are teachers.',
 '[25 min] Solve 5 aggregate problems on SQLBolt (the exercises after lessons 10-11) or Mode SQL tutorial, then do the practice questions below.',
 '[15 min] Write week1.sql notes: one comment line explaining WHERE vs HAVING in your own words.',
 '[10 min] Try the same in Chinook: count tracks per genre ("Track" table, GROUP BY "GenreId").'],
example: `<p>Use the tables from Monday. Orders per customer:</p>` + pre(`SELECT customer_id,
       COUNT(*)                AS n_orders,
       SUM(amount)             AS total,
       ROUND(AVG(amount), 2)   AS avg_order
FROM orders
GROUP BY customer_id
ORDER BY customer_id;`) + pre(`customer_id | n_orders | total  | avg_order
1           | 2        | 350.00 | 175.00
2           | 2        | 600.00 | 300.00
3           | 3        | 500.00 | 166.67`) + `<p>Now keep only customers whose total is above 400:</p>` + pre(`SELECT customer_id, SUM(amount) AS total
FROM orders
GROUP BY customer_id
HAVING SUM(amount) > 400
ORDER BY customer_id;`) + pre(`customer_id | total
2           | 600.00
3           | 500.00`) + `<p><b>Explain:</b> The database first reads all 7 orders, puts them in 3 groups by customer_id, then computes COUNT, SUM, AVG for each group. In the second query HAVING removes group 1 because its total (350) is not above 400. You cannot write WHERE SUM(amount) &gt; 400, because WHERE runs before groups exist.</p>`,
practice: [
 ['How many orders exist and what is the total revenue?', A(`SELECT COUNT(*) AS n_orders, SUM(amount) AS revenue FROM orders;`, '7 orders and 1450.00 revenue (250+100+400+150+300+50+200).')],
 ['Average salary per department, rounded to 2 decimals.', A(`SELECT dept, ROUND(AVG(salary), 2) AS avg_salary
FROM employees
GROUP BY dept
ORDER BY dept;`, 'HR 55000.00, IT 76666.67, Sales 50000.00.')],
 ['Departments that have more than 2 employees.', A(`SELECT dept, COUNT(*) AS n
FROM employees
GROUP BY dept
HAVING COUNT(*) > 2;`, 'IT (3) and Sales (3). HR has only 2, so HAVING removes it.')],
 ['On customers, what do COUNT(*), COUNT(city) and COUNT(DISTINCT city) return?', A(`SELECT COUNT(*), COUNT(city), COUNT(DISTINCT city) FROM customers;`, '5, 4, 3. Sara has a NULL city, so COUNT(city) skips her. Distinct cities are Mumbai, Delhi, Pune.')],
 ['Revenue per month in 2024 (month number and total).', A(`SELECT EXTRACT(MONTH FROM order_date) AS mth, SUM(amount) AS revenue
FROM orders
GROUP BY EXTRACT(MONTH FROM order_date)
ORDER BY mth;`, 'Month 1 = 350, month 2 = 550, month 3 = 550. EXTRACT works in PostgreSQL and MySQL. SQL Server uses MONTH(order_date).')],
 ['Show each customer\'s largest order, but only customers whose largest order is at least 300.', A(`SELECT customer_id, MAX(amount) AS max_order
FROM orders
GROUP BY customer_id
HAVING MAX(amount) >= 300;`, 'Customer 2 (400) and customer 3 (300). Customer 1 maxes at 250.')]
],
important: [
 ['What is the difference between WHERE and HAVING?', `<p>WHERE filters individual rows before grouping. HAVING filters groups after GROUP BY, so it can use aggregates like SUM or COUNT. Example: WHERE order_date is in 2024, then HAVING SUM(amount) is above 400.</p>`],
 ['What is the difference between COUNT(*), COUNT(column) and COUNT(DISTINCT column)?', `<p>COUNT(*) counts every row. COUNT(column) counts rows where the column is not NULL. COUNT(DISTINCT column) counts unique non-null values. On 5 customers with one NULL city and 3 distinct cities I get 5, 4, 3.</p>`],
 ['Why do you get an error when you select a column that is not in GROUP BY?', `<p>After grouping there is one row per group, so the database does not know which value of the extra column to show. Fix it by adding the column to GROUP BY or wrapping it in an aggregate such as MAX. (MySQL with ONLY_FULL_GROUP_BY off may return a random value, which is dangerous.)</p>`]
],
resources: [['SQLBolt', 'https://sqlbolt.com'], ['Mode SQL tutorial', 'https://mode.com/sql-tutorial']],
done: 'You are done when you can explain WHERE vs HAVING aloud and write a GROUP BY with HAVING from memory.'
},
/* ---------------- WED ---------------- */
{
title: 'JOINs: INNER, LEFT, RIGHT, FULL, SELF',
time: '1.5 h',
study: [
 'A JOIN combines rows from two tables using a matching condition, usually ON a.key = b.key.',
 'INNER JOIN keeps only rows that match in both tables.',
 'LEFT JOIN keeps ALL rows from the left table; if there is no match, right-side columns are NULL.',
 'RIGHT JOIN is the mirror of LEFT JOIN. Most people just swap the table order and use LEFT.',
 'FULL JOIN keeps all rows from both sides. MySQL does not have FULL JOIN (use LEFT JOIN UNION RIGHT JOIN).',
 'SELF JOIN joins a table to itself using two aliases, e.g. employee and manager.',
 'Use table aliases (c, o, e, m) and prefix columns (c.name) so the query is readable and avoids "ambiguous column" errors.',
 'Finding rows with no match: LEFT JOIN, then WHERE right_table.key IS NULL.'],
how: [
 '[15 min] On paper, draw customers (5 rows) and orders (7 rows). Draw lines between matching customer_id values. Circle customers with no line (John, Sara).',
 '[15 min] Predict row counts: INNER = ?, LEFT = ?, FULL = ?. Write your guess. Then run the queries below to check.',
 '[25 min] Type each join in the example. Change LEFT to INNER and watch which rows disappear.',
 '[15 min] Draw INNER, LEFT, RIGHT, FULL as two circles on paper. Write one sentence under each.',
 '[20 min] Solve the practice questions. Read the SQLBolt lessons on joins (lessons 6 and 7) if any confuses you.'],
example: `<p>Tables: customers (5 rows), orders (7 rows). Customers 4 (John) and 5 (Sara) have no orders.</p>` + pre(`-- INNER JOIN: only customers that have orders
SELECT c.name, o.order_id, o.amount
FROM customers c
INNER JOIN orders o ON o.customer_id = c.customer_id
ORDER BY c.name, o.order_id;`) + pre(`name  | order_id | amount
Asha  | 101      | 250.00
Asha  | 102      | 100.00
Meena | 104      | 150.00
Meena | 105      | 300.00
Meena | 106      | 50.00
Ravi  | 103      | 400.00
Ravi  | 107      | 200.00      -> 7 rows`) + pre(`-- LEFT JOIN: keep every customer
SELECT c.name, o.order_id
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
ORDER BY c.name, o.order_id;`) + `<p>This returns 9 rows: the same 7 plus John and Sara with order_id = NULL.</p>` + pre(`-- SELF JOIN: employee and manager
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.emp_id
ORDER BY e.emp_id;`) + pre(`employee | manager
Anil     | NULL
Bina     | Anil
Chetan   | Anil
Divya    | Anil
Esha     | Divya
Farhan   | Anil
Gita     | Farhan
Hari     | Farhan`) + `<p><b>Explain:</b> In the self join, the same table plays two roles. e is the employee row, m is the manager row found by matching e.manager_id to m.emp_id. Anil has manager_id NULL, so the LEFT JOIN keeps him with a NULL manager. An INNER JOIN would drop him.</p>`,
practice: [
 ['List every order with the customer name (inner join). How many rows?', A(`SELECT c.name, o.order_id
FROM customers c
JOIN orders o ON o.customer_id = c.customer_id;`, '7 rows. JOIN alone means INNER JOIN. John and Sara have no orders so they do not appear.')],
 ['Find customers who have never placed an order.', A(`SELECT c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
WHERE o.order_id IS NULL;`, 'John and Sara. After the LEFT JOIN, customers without orders have NULL in every orders column, so the IS NULL test finds them.')],
 ['Total spent per customer, including customers with no orders (show 0).', A(`SELECT c.name, COALESCE(SUM(o.amount), 0) AS total
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
GROUP BY c.name
ORDER BY c.name;`, 'Asha 350, John 0, Meena 500, Ravi 600, Sara 0. SUM of no rows is NULL, so COALESCE turns it into 0.')],
 ['Find employees who earn more than their own manager.', A(`SELECT e.name
FROM employees e
JOIN employees m ON e.manager_id = m.emp_id
WHERE e.salary > m.salary;`, 'Esha (60000 vs Divya 50000), Gita and Hari (55000 vs Farhan 40000). Bina, Chetan earn less than Anil.')],
 ['How many rows does a FULL JOIN of customers and orders return, and why?', A(`SELECT c.name, o.order_id
FROM customers c
FULL JOIN orders o ON o.customer_id = c.customer_id;`, '9 rows: 7 matches + 2 unmatched customers. Every order has a customer, so no unmatched orders. MySQL has no FULL JOIN.')]
],
important: [
 ['Explain INNER, LEFT, RIGHT and FULL JOIN.', `<p>INNER keeps only matching rows. LEFT keeps all rows of the left table and fills NULL where the right has no match. RIGHT is the same for the right table. FULL keeps all rows from both. I use LEFT JOIN when I must not lose the main table, for example all customers even without orders.</p>`],
 ['How do you find records in table A that are missing in table B?', `<p>LEFT JOIN B and filter WHERE B.key IS NULL, or use NOT EXISTS. Both are safe. NOT IN is risky if the subquery returns NULL.</p>`],
 ['What is a self join? Give an example.', `<p>A table joined to itself using two aliases. Example: employees with manager_id. Join e.manager_id = m.emp_id to show each employee with their manager name. Use LEFT JOIN so the top manager (no manager) is not lost.</p>`]
],
resources: [['SQLBolt', 'https://sqlbolt.com'], ['Mode SQL tutorial (joins)', 'https://mode.com/sql-tutorial']],
done: 'You are done when you can draw all join types from memory and predict the row count of an INNER and LEFT join on the practice tables.'
},
/* ---------------- THU ---------------- */
{
title: 'JOINs with duplicate keys + 8 easy problems',
time: '1.5 h',
study: [
 'If the join key repeats on both sides, rows multiply. A key appearing 2 times on the left and 3 times on the right gives 2 x 3 = 6 rows.',
 'Row count of an INNER join = sum over each key value of (left count x right count).',
 'LEFT JOIN count = INNER count + number of left rows that found no match.',
 'This "fan-out" makes SUM and COUNT wrong if you aggregate after a careless join. Use COUNT(DISTINCT id) or aggregate before joining.',
 'NULL never equals NULL, so rows with NULL keys do not match in a join.',
 'A condition in ON changes which rows match. The same condition in WHERE removes rows after the join. For a LEFT JOIN this difference is important.',
 'CROSS JOIN pairs every left row with every right row (m x n rows).'],
how: [
 '[15 min] Create the two duplicate-key tables from the example. Do not run the queries yet.',
 '[15 min] Predict on paper: INNER, LEFT, RIGHT, FULL row counts. Write the numbers down, then run and compare. This exact exercise was asked in a Deloitte interview.',
 '[10 min] Run the fan-out example (COUNT with and without DISTINCT).',
 '[40 min] Solve 8 easy JOIN + GROUP BY problems: pick them from HackerRank SQL (Basic Join section) or LeetCode Database (easy: Combine Two Tables, Customers Who Never Order, Employees Earning More Than Their Managers). Write each into week1.sql.',
 '[10 min] Write a 3-line note: "How I check a join for duplicates" (count rows before and after).'],
example: `<p>Two tables where the key 1 repeats:</p>` + pre(`CREATE TABLE left_t  (id INT);
CREATE TABLE right_t (id INT);
INSERT INTO left_t  VALUES (1),(1),(2),(3);
INSERT INTO right_t VALUES (1),(1),(1),(2),(4);

SELECT COUNT(*) FROM left_t  l INNER JOIN right_t r ON l.id = r.id;  -- 7
SELECT COUNT(*) FROM left_t  l LEFT  JOIN right_t r ON l.id = r.id;  -- 8
SELECT COUNT(*) FROM left_t  l RIGHT JOIN right_t r ON l.id = r.id;  -- 8
SELECT COUNT(*) FROM left_t  l FULL  JOIN right_t r ON l.id = r.id;  -- 9`) + `
<p><b>Why:</b></p>` + pre(`id | left | right | matched rows
1  |  2   |  3    | 2 x 3 = 6
2  |  1   |  1    | 1 x 1 = 1
3  |  1   |  0    | no match (left only)
4  |  0   |  1    | no match (right only)

INNER = 6 + 1             = 7
LEFT  = 7 + 1 (id 3)      = 8
RIGHT = 7 + 1 (id 4)      = 8
FULL  = 7 + 1 + 1         = 9`) + `<p>Simple rule: INNER multiplies the counts per key. LEFT and RIGHT add the unmatched rows of one side. FULL adds both. Now the fan-out effect on real tables:</p>` + pre(`SELECT COUNT(*)                    AS rows_after_join,
       COUNT(DISTINCT c.customer_id) AS real_customers
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id;`) + pre(`rows_after_join | real_customers
9               | 5`) + `<p>The result has 9 rows because customers with several orders repeat. COUNT(*) gives 9 but there are only 5 customers. Always use COUNT(DISTINCT ...) when the join can repeat rows.</p>`,
practice: [
 ['In the example tables, how many rows does left_t INNER JOIN right_t return? Explain the calculation.', A(`-- id 1: 2 x 3 = 6, id 2: 1 x 1 = 1, ids 3 and 4 do not match
SELECT COUNT(*) FROM left_t l JOIN right_t r ON l.id = r.id;`, '7 rows. Multiply the counts per key and add them.')],
 ['Same tables: how many rows for LEFT JOIN, and which rows have NULL on the right?', A(`SELECT l.id, r.id AS r_id
FROM left_t l LEFT JOIN right_t r ON l.id = r.id;`, '8 rows. Only the left row with id 3 has NULL in r_id, because 3 is missing from right_t.')],
 ['How many rows does left_t CROSS JOIN right_t return?', A(`SELECT COUNT(*) FROM left_t CROSS JOIN right_t;`, '20 rows (4 x 5). CROSS JOIN ignores keys and pairs every row with every row.')],
 ['Count how many customers placed at least one order (after joining customers and orders).', A(`SELECT COUNT(DISTINCT c.customer_id) AS customers_with_orders
FROM customers c
JOIN orders o ON o.customer_id = c.customer_id;`, '3. COUNT(*) would give 7 because of repeated customers.')],
 ['Customers LEFT JOIN orders, keep only orders above 200. Compare (a) condition in WHERE and (b) condition in ON. How many rows each?', A(`-- (a) WHERE
SELECT c.name, o.order_id FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
WHERE o.amount > 200;                 -- 3 rows

-- (b) ON
SELECT c.name, o.order_id FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id AND o.amount > 200;  -- 5 rows`, '(a) gives 3 rows (orders 101, 103, 105) because WHERE throws away the NULL rows and turns the LEFT JOIN into an INNER JOIN. (b) keeps all 5 customers; John and Sara and any customer without a big order get NULL.')],
 ['If both tables had a row with id = NULL, would an INNER JOIN on id match them?', A(`SELECT NULL = NULL;   -- returns NULL, not true`, 'No. NULL = NULL is unknown, so the join condition is not true. NULL keys never match.')]
],
important: [
 ['Table A has the key 1 twice, table B has the key 1 three times. How many rows does an INNER JOIN return for key 1?', `<p>Six rows, because each of the 2 rows in A matches each of the 3 rows in B (2 x 3). A LEFT JOIN gives the same six for that key; the difference appears only for keys that have no match.</p>`],
 ['Your join returned more rows than the original table. What happened and how do you fix it?', `<p>The key is not unique on the other table, so rows fan out. I check with GROUP BY key HAVING COUNT(*) &gt; 1. Fixes: aggregate the second table first, remove duplicates, add the missing join column, or use DISTINCT only if it is logically correct.</p>`],
 ['What is the difference between putting a filter in ON and in WHERE for a LEFT JOIN?', `<p>A filter in ON decides which rows match, and the left rows are still kept with NULLs. A filter on the right table in WHERE runs after the join and removes the NULL rows, so the LEFT JOIN behaves like an INNER JOIN.</p>`]
],
resources: [['HackerRank SQL', 'https://www.hackerrank.com/domains/sql'], ['LeetCode Database problems', 'https://leetcode.com/problemset/database/']],
done: 'You are done when you can predict INNER and LEFT row counts for tables with repeated keys and you have 8 easy join problems saved in week1.sql.'
},
/* ---------------- FRI ---------------- */
{
title: 'CASE WHEN, NULL handling, LIKE, IN, BETWEEN + order of execution',
time: '1.5 h',
study: [
 'CASE WHEN works like IF/ELSE inside a query: CASE WHEN condition THEN value ... ELSE value END.',
 'NULL means "unknown" or "no value". It is not zero and not an empty string.',
 'Test NULL with IS NULL / IS NOT NULL. Never use = NULL (it never returns true).',
 'COALESCE(a, b, c) returns the first value that is not NULL. Use it to replace NULL with a default.',
 'Any comparison with NULL gives unknown, so <code>city &lt;&gt; \'Mumbai\'</code> drops rows where city is NULL.',
 'LIKE is pattern matching: % means any number of characters, _ means exactly one character. LIKE is case-sensitive in PostgreSQL (use ILIKE for ignoring case); in MySQL it is usually case-insensitive.',
 'IN (a, b, c) is a short form of many ORs. BETWEEN x AND y includes both x and y.',
 'NOT IN returns nothing if the list contains a NULL. This is a classic interview trap.',
 'Optional: SQL runs in this order: FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT. This explains why you cannot use a SELECT alias in WHERE (PostgreSQL) but can use it in ORDER BY.'],
how: [
 '[15 min] Type the CASE example and add a fourth band of your own.',
 '[15 min] Type the NULL examples. Read each result and say aloud why it is that result.',
 '[10 min] Try LIKE patterns: names starting with a letter, ending with a letter, second letter.',
 '[25 min] Solve the practice questions.',
 '[10 min] Optional: write the order of execution on a sticky note: FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT. For each step write one example of why it matters.',
 '[15 min] Add 3 queries to week1.sql using CASE, COALESCE and IS NULL.'],
example: pre(`SELECT name, salary,
       CASE WHEN salary >= 70000 THEN 'High'
            WHEN salary >= 50000 THEN 'Mid'
            ELSE 'Low' END AS band
FROM employees
ORDER BY emp_id;`) + pre(`name   | salary | band
Anil   | 90000  | High
Bina   | 70000  | High
Chetan | 70000  | High
Divya  | 50000  | Mid
Esha   | 60000  | Mid
Farhan | 40000  | Low
Gita   | 55000  | Mid
Hari   | 55000  | Mid`) + `<p>CASE checks the conditions from top to bottom and stops at the first one that is true. So the order matters: Bina (70000) matches the first line and never reaches the second.</p>` + pre(`-- NULL handling
SELECT name, COALESCE(city, 'Unknown') AS city FROM customers;   -- Sara becomes Unknown

SELECT name FROM customers WHERE city <> 'Mumbai';                -- Ravi, John (Sara is missing!)
SELECT name FROM customers WHERE city <> 'Mumbai' OR city IS NULL;-- Ravi, John, Sara

-- The NOT IN trap: returns ZERO rows because the list contains NULL
SELECT name FROM customers WHERE customer_id NOT IN (1, 2, NULL);`) + `<p><b>Why the last query returns nothing:</b> <code>customer_id NOT IN (1,2,NULL)</code> means customer_id &lt;&gt; 1 AND customer_id &lt;&gt; 2 AND customer_id &lt;&gt; NULL. The last part is unknown for every row, so the whole condition is never true. Safe fix: use NOT EXISTS, or remove NULLs from the list.</p>` + pre(`-- LIKE
SELECT name FROM employees WHERE name LIKE 'A%';   -- Anil
SELECT name FROM employees WHERE name LIKE '%a';   -- Bina, Divya, Esha, Gita`),
practice: [
 ['Label each order: amount 300 or more = Large, 150 or more = Medium, else Small.', A(`SELECT order_id, amount,
       CASE WHEN amount >= 300 THEN 'Large'
            WHEN amount >= 150 THEN 'Medium'
            ELSE 'Small' END AS size
FROM orders ORDER BY order_id;`, '101 Medium, 102 Small, 103 Large, 104 Medium, 105 Large, 106 Small, 107 Medium.')],
 ['How many customers have no city recorded?', A(`SELECT COUNT(*) FROM customers WHERE city IS NULL;`, '1 (Sara). Writing city = NULL would return 0, which is wrong.')],
 ['List customers whose city is not Mumbai. Then fix the query so customers with unknown city are included.', A(`SELECT name FROM customers
WHERE city <> 'Mumbai' OR city IS NULL;`, 'Ravi, John, Sara. Plain city &lt;&gt; \'Mumbai\' returns only Ravi and John because the NULL comparison is unknown.')],
 ['In ONE row, show total amount of orders that are 300 or more, and total of the rest.', A(`SELECT SUM(CASE WHEN amount >= 300 THEN amount ELSE 0 END) AS large_total,
       SUM(CASE WHEN amount <  300 THEN amount ELSE 0 END) AS other_total
FROM orders;`, 'large_total = 700 (400 + 300), other_total = 750. This "conditional aggregation" is very common in analyst work.')],
 ['Employees in HR or Sales whose salary is between 50000 and 60000, and employees whose name has "a" as the second letter.', A(`SELECT name FROM employees
WHERE dept IN ('HR','Sales') AND salary BETWEEN 50000 AND 60000;   -- Divya, Esha, Gita, Hari

SELECT name FROM employees WHERE name LIKE '_a%';                  -- Farhan, Hari`, 'BETWEEN includes 50000 and 60000. The underscore matches exactly one character, so _a% means second letter is a.')],
 ['Why does this query return no rows, and how would you fix it? SELECT name FROM customers WHERE customer_id NOT IN (SELECT customer_id FROM orders_with_nulls);', A(`-- orders_with_nulls is imaginary; this CTE builds it: ids 1 and 2 plus one NULL
WITH orders_with_nulls(customer_id) AS (VALUES (1),(2),(NULL))
SELECT c.name FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders_with_nulls x WHERE x.customer_id = c.customer_id)
ORDER BY c.name;`, 'Returns John, Meena, Sara (customer ids 4, 3, 5). If the subquery returns even one NULL, NOT IN becomes unknown for every row and returns zero rows. NOT EXISTS ignores the NULL correctly.')]
],
important: [
 ['What is the difference between NULL, 0 and an empty string?', `<p>NULL means the value is unknown or missing. 0 is a real number and an empty string is a real text value of length zero. NULL is ignored by SUM, AVG and COUNT(column), but 0 is not. I test it with IS NULL and replace it with COALESCE.</p>`],
 ['Why does NOT IN sometimes return no rows?', `<p>If the list or subquery contains a NULL, then "x NOT IN (..., NULL)" is unknown for every row, so nothing is returned. I use NOT EXISTS or a LEFT JOIN with IS NULL, which are safe.</p>`],
 ['What is the logical order of execution of a SQL query?', `<p>FROM and JOINs, then WHERE, GROUP BY, HAVING, SELECT, DISTINCT, ORDER BY, LIMIT. That is why WHERE cannot see a SELECT alias or an aggregate, but ORDER BY can use the alias.</p>`]
],
resources: [['SQLBolt', 'https://sqlbolt.com'], ['Mode SQL tutorial', 'https://mode.com/sql-tutorial']],
done: 'You are done when you can use CASE, COALESCE and IS NULL without help and explain the NOT IN trap in one minute.'
},
/* ---------------- SAT ---------------- */
{
title: 'Subqueries, CTEs, and your first GitHub repo',
time: '3.5 h',
study: [
 'A subquery is a SELECT inside another query, written in brackets.',
 'Scalar subquery returns one value (like the average salary) and can be used in WHERE or SELECT.',
 'IN subquery returns a list: WHERE customer_id IN (SELECT customer_id FROM orders).',
 'A correlated subquery uses a column from the outer query, so it runs once per outer row (can be slow on large tables).',
 'A subquery in FROM (derived table) needs an alias.',
 'A CTE starts with WITH name AS (...). It is a named temporary result that reads top to bottom. Interviewers prefer CTEs because they are easier to read.',
 'You can chain several CTEs: WITH a AS (...), b AS (...) SELECT ... FROM a JOIN b ....',
 'Git basics: a repository (repo) is a folder tracked by Git. You add files, commit (save a snapshot) and push (upload) to GitHub.'],
how: [
 '[20 min] Type the three subquery types from the example. For each, run the inner query alone first and read its result.',
 '[20 min] Rewrite the correlated subquery as a CTE (the example shows one). Then rewrite 2 more subqueries from earlier weeks as CTEs: the rule is 3 rewrites total.',
 '[40 min] Do the practice questions. Write both a subquery version and a CTE version for at least two of them.',
 '[20 min] Create a free GitHub account (github.com). Click New repository, name it sql-practice, tick "Add a README".',
 '[30 min] On your PC, install Git for Windows. In the folder with week1.sql run: git init, git add ., git commit -m "week 1 queries", git branch -M main, git remote add origin YOUR_REPO_URL, git push -u origin main. (Or use the "Add file > Upload files" button on GitHub if Git feels hard today.)',
 '[30 min] Clean your week1.sql: add a comment above each query with the business question in plain English. A reader should understand it without running it.',
 '[20 min] Solve 3 more medium-easy problems from LeetCode Database or HackerRank and save them.'],
example: `<p>Using Monday's tables. Goal: find employees earning above the company average (61250).</p>` + pre(`-- 1. Scalar subquery
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees)
ORDER BY salary DESC, name;`) + pre(`name   | salary
Anil   | 90000
Bina   | 70000
Chetan | 70000`) + `<p>The inner query runs first and returns one number: 61250. The outer query keeps employees above it.</p>` + pre(`-- 2. IN subquery: customers who have ordered
SELECT name FROM customers
WHERE customer_id IN (SELECT customer_id FROM orders);     -- Asha, Ravi, Meena

-- 3. Correlated subquery: earn more than own department average
SELECT e.name, e.dept, e.salary
FROM employees e
WHERE e.salary > (SELECT AVG(x.salary) FROM employees x WHERE x.dept = e.dept)
ORDER BY e.name;`) + pre(`-- Same question as a CTE (easier to read)
WITH dept_avg AS (
  SELECT dept, AVG(salary) AS avg_sal
  FROM employees
  GROUP BY dept
)
SELECT e.name, e.dept, e.salary
FROM employees e
JOIN dept_avg d ON d.dept = e.dept
WHERE e.salary > d.avg_sal
ORDER BY e.name;`) + pre(`name  | dept  | salary
Anil  | IT    | 90000
Esha  | HR    | 60000
Gita  | Sales | 55000
Hari  | Sales | 55000`) + `<p><b>Explain:</b> Department averages are IT 76666.67, HR 55000, Sales 50000. Anil beats 76666.67; Esha beats 55000; Gita and Hari beat 50000. The CTE calculates the three averages once, then we join them back to each employee. The correlated version recalculates the average for every employee row. Same answer, but the CTE is easier to explain in an interview.</p>
<h4>Deliverable: GitHub repo sql-practice</h4>` + pre(`sql-practice/
  README.md        (one paragraph: what this repo is, tools used)
  week1.sql        (all your queries, each with a comment line)`),
practice: [
 ['Orders with amount above the average order amount.', A(`SELECT order_id, amount FROM orders
WHERE amount > (SELECT AVG(amount) FROM orders);`, 'Average = 1450 / 7 = 207.14. Orders 101 (250), 103 (400), 105 (300) are above it.')],
 ['Customers whose total spend is above 400. Use a CTE.', A(`WITH totals AS (
  SELECT customer_id, SUM(amount) AS total
  FROM orders GROUP BY customer_id
)
SELECT c.name, t.total
FROM totals t
JOIN customers c ON c.customer_id = t.customer_id
WHERE t.total > 400
ORDER BY c.name;`, 'Meena (500) and Ravi (600).')],
 ['Orders that are above the average of the SAME customer (correlated subquery).', A(`SELECT o.order_id, o.customer_id, o.amount
FROM orders o
WHERE o.amount > (SELECT AVG(x.amount) FROM orders x WHERE x.customer_id = o.customer_id)
ORDER BY o.order_id;`, 'Orders 101 (250 vs avg 175), 103 (400 vs 300), 105 (300 vs 166.67).')],
 ['Highest paid employee in each department, using a correlated subquery.', A(`SELECT e.dept, e.name, e.salary
FROM employees e
WHERE e.salary = (SELECT MAX(x.salary) FROM employees x WHERE x.dept = e.dept)
ORDER BY e.dept, e.name;`, 'HR Esha 60000, IT Anil 90000, Sales Gita 55000 and Hari 55000 (a tie, both are shown).')],
 ['Second highest distinct salary using a subquery (no window function).', A(`SELECT MAX(salary) AS second_highest
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);`, '70000. The inner query finds 90000; the outer takes the maximum of what is below it.')],
 ['Rewrite practice 1 as a CTE.', A(`WITH avg_amt AS (SELECT AVG(amount) AS a FROM orders)
SELECT o.order_id, o.amount
FROM orders o CROSS JOIN avg_amt
WHERE o.amount > avg_amt.a;`, 'Same 3 rows. The CTE has exactly one row, so CROSS JOIN adds the average to every order without multiplying rows.')]
],
important: [
 ['What is the difference between a subquery and a CTE?', `<p>Both give a temporary result. A subquery is written inside another query; a CTE is named at the top with WITH and can be used more than once and read top to bottom. A CTE is usually more readable. In PostgreSQL 12 and newer, performance is generally the same for simple cases.</p>`],
 ['What is a correlated subquery?', `<p>A subquery that refers to a column of the outer query, so it is evaluated for each outer row. Example: salary greater than the average salary of the same department. It can be slow on large tables, so I often rewrite it as a join with a pre-aggregated CTE or with a window function.</p>`],
 ['How would you find the second highest salary?', `<p>Simple way: MAX(salary) where salary is less than MAX(salary). General way for the Nth: DENSE_RANK in a CTE (next week) or <code>SELECT DISTINCT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET N-1</code> (returns no row, not an error, if there is no Nth salary).</p>`]
],
resources: [['GitHub', 'https://github.com'], ['LeetCode Database problems', 'https://leetcode.com/problemset/database/']],
done: 'You are done when your sql-practice repo is live with week1.sql and you can rewrite any simple subquery as a CTE.'
},
/* ---------------- SUN ---------------- */
{
title: 'Weekly review: 10 mixed problems + cheat sheet',
time: '3.5 h',
study: [
 'Revise the order you build a query: pick tables, JOIN, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT.',
 'Revise the 5 traps: NULL comparisons, NOT IN with NULL, duplicate-key row multiplication, WHERE vs HAVING, filter in ON vs WHERE for LEFT JOIN.',
 'Revise COUNT(*) vs COUNT(col) vs COUNT(DISTINCT col).',
 'Revise how to find "customers with no orders" (LEFT JOIN IS NULL or NOT EXISTS).',
 'Speak while you solve. In interviews you must explain your logic aloud, not only write the query.',
 'A cheat sheet is a one-page summary written in your own words. Writing it is the real revision.'],
how: [
 '[15 min] Re-run the practice schema in a fresh database so you know it works from zero.',
 '[80 min] Timed block: solve the 10 problems below (6 have answers in the practice section). Give each 8 minutes. Say your approach aloud. If stuck after 8 minutes, look at the answer, close it, and retype from memory.',
 '[20 min] Problems 7 to 10 (do them without answers, then self-check): (7) number of orders per month with a customer count; (8) the customer with the most orders; (9) average salary of employees with a manager; (10) the order that has the highest amount.',
 '[40 min] Write the 1-page SQL cheat sheet (use the template below). Save as cheatsheet.md in your repo.',
 '[25 min] Read the first 10 SQL questions in the Interview Q&A page of this site. After each, say the answer aloud in 30 seconds. Mark the ones you stumbled on.',
 '[20 min] Push all work to GitHub with git add ., git commit -m "week 1 review", git push. Check that the repo shows your files.'],
example: `<p>Cheat sheet template. Copy this into cheatsheet.md and fill it in your own words with 1 example each.</p>` + pre(`# SQL cheat sheet (week 1)
## Query order I write
SELECT cols FROM t JOIN t2 ON ... WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT n

## Logical order SQL runs
FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT

## Joins
INNER: matches only | LEFT: all left | FULL: all both
Rows per key = left count x right count
No match: LEFT JOIN ... WHERE right.key IS NULL

## NULL
x IS NULL | COALESCE(x, 0) | NOT IN + NULL = no rows (use NOT EXISTS)

## Aggregates
COUNT(*) vs COUNT(col) vs COUNT(DISTINCT col)
WHERE = before group, HAVING = after group

## Patterns
Conditional sum: SUM(CASE WHEN cond THEN amt ELSE 0 END)
Above average: WHERE x > (SELECT AVG(x) FROM t)
CTE: WITH name AS (SELECT ...) SELECT ... FROM name`) + `
<p>Sample timed problem and how to talk through it. <b>Question:</b> which customer spent the most?</p>` + pre(`SELECT c.name, SUM(o.amount) AS total
FROM customers c
JOIN orders o ON o.customer_id = c.customer_id
GROUP BY c.name
ORDER BY total DESC
LIMIT 1;`) + pre(`name | total
Ravi | 600.00`) + `<p><b>What to say aloud:</b> "I need the customer name and the sum of their orders, so I join customers to orders on customer_id. I group by customer name, sum the amount, sort from biggest to smallest and take one row. If two customers tie, I would use RANK instead of LIMIT 1."</p>`,
practice: [
 ['Which customer spent the most? (see example)', A(`SELECT c.name, SUM(o.amount) AS total
FROM customers c JOIN orders o ON o.customer_id = c.customer_id
GROUP BY c.name ORDER BY total DESC LIMIT 1;`, 'Ravi, 600. Mention ties as a follow-up point.')],
 ['Which department has the highest total payroll?', A(`SELECT dept, SUM(salary) AS payroll
FROM employees GROUP BY dept
ORDER BY payroll DESC LIMIT 1;`, 'IT with 230000 (HR 110000, Sales 150000).')],
 ['How many employees have no manager?', A(`SELECT COUNT(*) FROM employees WHERE manager_id IS NULL;`, '1 (Anil). Use IS NULL, not = NULL.')],
 ['Number of orders for every customer, including customers with zero.', A(`SELECT c.name, COUNT(o.order_id) AS n_orders
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
GROUP BY c.name ORDER BY c.name;`, 'Asha 2, John 0, Meena 3, Ravi 2, Sara 0. COUNT(o.order_id) skips NULLs, so unmatched customers get 0. COUNT(*) would wrongly give 1.')],
 ['Months in which revenue was above 500.', A(`SELECT EXTRACT(MONTH FROM order_date) AS mth, SUM(amount) AS revenue
FROM orders
GROUP BY EXTRACT(MONTH FROM order_date)
HAVING SUM(amount) > 500
ORDER BY mth;`, 'February (550) and March (550). January is 350.')],
 ['Find employees who share the same salary with another employee in the same department.', A(`SELECT DISTINCT e1.name, e1.dept, e1.salary
FROM employees e1
JOIN employees e2
  ON e1.dept = e2.dept AND e1.salary = e2.salary AND e1.emp_id <> e2.emp_id
ORDER BY e1.name;`, 'Bina, Chetan (IT, 70000) and Gita, Hari (Sales, 55000). The e1.emp_id &lt;&gt; e2.emp_id part stops a row from matching itself.')]
],
important: [
 ['Walk me through how you would write a SQL query for a new business question.', `<p>First I clarify the question and the metric. Then I find which tables hold the data and how they join. I start small: SELECT from the main table, then add joins one at a time, checking row counts. Then filters, grouping and sorting. At the end I check for NULLs, duplicates and ties.</p>`],
 ['How do you check that your query result is correct?', `<p>I compare totals with a simple query on one table, check row counts before and after each join, test one customer by hand, and look for NULLs and duplicate rows. If the numbers do not match, I find which join changed the count.</p>`],
 ['What are the most common SQL mistakes you avoid?', `<p>Using = NULL instead of IS NULL, forgetting that NOT IN fails with NULL, joining on non-unique keys and counting duplicates, mixing up WHERE and HAVING, and filtering the right table in WHERE after a LEFT JOIN.</p>`]
],
resources: [['SQLBolt', 'https://sqlbolt.com'], ['GitHub', 'https://github.com']],
done: 'You are done when 10 mixed problems are solved and timed, cheatsheet.md is on GitHub, and you have read and said aloud the first 10 SQL Q&As.'
}
]
};
})();
