/* SQL interview Q&A (45 questions). Loads after data-qa.js and OVERRIDES QA.sql.
   Practice schema = the Week 1/2 guide tables (customers, orders, employees, logins, contacts, suppliers)
   plus order 108 (NULL customer) and products / order_items / t_left / t_right.
   Every `run` query was executed on SQLite 3 and checked against the result tables shown in the answers. */
(function () {

const SQL_SCHEMA = `-- Practice schema (works in SQLite and PostgreSQL). Paste once, then try every answer.
CREATE TABLE customers (customer_id INT PRIMARY KEY, name VARCHAR(50), city VARCHAR(50));
CREATE TABLE orders    (order_id INT PRIMARY KEY, customer_id INT, order_date DATE, amount NUMERIC(10,2));
CREATE TABLE employees (emp_id INT PRIMARY KEY, name VARCHAR(50), dept VARCHAR(30), salary INT, manager_id INT);
CREATE TABLE logins    (user_id INT, login_date DATE);
CREATE TABLE contacts  (contact_id INT PRIMARY KEY, email VARCHAR(50));
CREATE TABLE suppliers (supplier_id INT PRIMARY KEY, name VARCHAR(50), city VARCHAR(50));
CREATE TABLE products  (product_id INT PRIMARY KEY, name VARCHAR(50), category VARCHAR(30), price INT);
CREATE TABLE order_items (order_id INT, product_id INT, qty INT);
CREATE TABLE t_left  (id INT);   -- tiny tables for the duplicate-key join question
CREATE TABLE t_right (id INT);

INSERT INTO customers VALUES (1,'Asha','Mumbai'),(2,'Ravi','Delhi'),(3,'Meena','Mumbai'),(4,'John','Pune'),(5,'Sara',NULL);

-- order 108 has a NULL customer_id on purpose (a guest checkout) to show NULL traps
INSERT INTO orders VALUES
 (101,1,'2024-01-05',250),(102,1,'2024-01-20',100),(103,2,'2024-02-02',400),(104,3,'2024-02-14',150),
 (105,3,'2024-03-01',300),(106,3,'2024-03-15',50),(107,2,'2024-03-20',200),(108,NULL,'2024-04-02',80);

INSERT INTO employees VALUES
 (1,'Anil','IT',90000,NULL),(2,'Bina','IT',70000,1),(3,'Chetan','IT',70000,1),(4,'Divya','HR',50000,1),
 (5,'Esha','HR',60000,4),(6,'Farhan','Sales',40000,1),(7,'Gita','Sales',55000,6),(8,'Hari','Sales',55000,6);

INSERT INTO logins VALUES
 (1,'2024-03-01'),(1,'2024-03-02'),(1,'2024-03-03'),(1,'2024-03-05'),(1,'2024-03-06'),(1,'2024-03-10'),
 (2,'2024-03-01'),(2,'2024-03-02');

INSERT INTO contacts VALUES (1,'a@x.com'),(2,'b@x.com'),(3,'a@x.com'),(4,'c@x.com'),(5,'b@x.com'),(6,'a@x.com');

INSERT INTO suppliers VALUES (1,'Alpha','Mumbai'),(2,'Beta','Chennai'),(3,'Gamma','Pune');

INSERT INTO products VALUES
 (1,'Pen','Stationery',10),(2,'Notebook','Stationery',50),(3,'Mouse','Electronics',500),
 (4,'Keyboard','Electronics',1200),(5,'Bag','Accessories',800),(6,'Cable','Electronics',150);

INSERT INTO order_items VALUES
 (101,3,1),(101,1,5),(102,1,10),(103,4,1),(104,2,3),(105,5,1),(105,3,1),(106,1,5),(107,4,1),(107,2,2);

INSERT INTO t_left  VALUES (1),(1),(2);
INSERT INTO t_right VALUES (1),(1),(3);`;

/* ---------- query strings (shown in the answer AND used as `run`) ---------- */
const Q_WH = `SELECT dept, COUNT(*) AS n
FROM employees
WHERE salary >= 55000
GROUP BY dept
HAVING COUNT(*) >= 2
ORDER BY dept;`;
const Q_ORD = `SELECT name, salary * 12 AS annual
FROM employees
WHERE salary * 12 > 800000
ORDER BY name;`;
const Q_NULL = `SELECT COUNT(*) AS all_rows, COUNT(city) AS non_null, COUNT(DISTINCT city) AS distinct_cities
FROM customers;`;
const Q_COAL = `SELECT name, COALESCE(city, 'Unknown') AS city
FROM customers
ORDER BY customer_id;`;
const Q_CASE = `SELECT CASE WHEN amount >= 300 THEN 'High'
            WHEN amount >= 150 THEN 'Medium'
            ELSE 'Low' END AS size_band,
       COUNT(*) AS orders
FROM orders
GROUP BY 1
ORDER BY MIN(amount) DESC;`;
const Q_JOIN = `SELECT c.name, COUNT(o.order_id) AS orders
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
GROUP BY c.customer_id, c.name
ORDER BY c.customer_id;`;
const Q_DUPJOIN = `SELECT 'INNER' AS join_type, COUNT(*) AS row_count
FROM t_left l JOIN t_right r ON l.id = r.id
UNION ALL
SELECT 'LEFT', COUNT(*)
FROM t_left l LEFT JOIN t_right r ON l.id = r.id;`;
const Q_ONWH = `SELECT c.name, COUNT(o.order_id) AS big_orders
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id AND o.amount >= 200
GROUP BY c.customer_id, c.name
ORDER BY c.customer_id;`;
const Q_UNION = `SELECT city FROM customers WHERE city IS NOT NULL
UNION
SELECT city FROM suppliers
ORDER BY city;`;
const Q_ANTI = `SELECT c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
WHERE o.order_id IS NULL
ORDER BY c.customer_id;`;
const Q_NOTIN = `SELECT name
FROM customers
WHERE customer_id NOT IN (SELECT customer_id FROM orders WHERE customer_id IS NOT NULL)
ORDER BY customer_id;`;
const Q_SELF = `SELECT e.name AS employee, e.salary, m.name AS manager, m.salary AS manager_salary
FROM employees e
JOIN employees m ON e.manager_id = m.emp_id
WHERE e.salary > m.salary
ORDER BY e.emp_id;`;
const Q_FAN = `SELECT o.customer_id, SUM(o.amount) AS revenue, SUM(i.units) AS units
FROM orders o
JOIN (SELECT order_id, SUM(qty) AS units FROM order_items GROUP BY order_id) i
  ON i.order_id = o.order_id
GROUP BY o.customer_id
ORDER BY o.customer_id;`;
const Q_SPEND = `SELECT c.name, SUM(o.amount) AS total_spend
FROM customers c
JOIN orders o ON o.customer_id = c.customer_id
GROUP BY c.customer_id, c.name
HAVING SUM(o.amount) > 400
ORDER BY total_spend DESC;`;
const Q_MONTH = `SELECT strftime('%Y-%m', order_date) AS month,
       SUM(amount) AS revenue,
       COUNT(*)    AS orders
FROM orders
GROUP BY 1
ORDER BY 1;`;
const Q_PIVOT = `SELECT customer_id,
       SUM(CASE WHEN strftime('%m', order_date) = '01' THEN amount ELSE 0 END) AS jan,
       SUM(CASE WHEN strftime('%m', order_date) = '02' THEN amount ELSE 0 END) AS feb,
       SUM(CASE WHEN strftime('%m', order_date) = '03' THEN amount ELSE 0 END) AS mar
FROM orders
WHERE customer_id IS NOT NULL
GROUP BY customer_id
ORDER BY customer_id;`;
const Q_DUPS = `SELECT email, COUNT(*) AS times
FROM contacts
GROUP BY email
HAVING COUNT(*) > 1
ORDER BY email;`;
const Q_DUPDEL = `SELECT contact_id, email
FROM (SELECT contact_id, email,
             ROW_NUMBER() OVER (PARTITION BY email ORDER BY contact_id) AS rn
      FROM contacts) t
WHERE rn > 1
ORDER BY contact_id;`;
const Q_EXISTS = `SELECT c.name
FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id)
ORDER BY c.customer_id;`;
const Q_CTE = `WITH totals AS (
  SELECT customer_id, SUM(amount) AS total
  FROM orders
  WHERE customer_id IS NOT NULL
  GROUP BY customer_id
)
SELECT c.name, t.total
FROM totals t
JOIN customers c ON c.customer_id = t.customer_id
ORDER BY t.total DESC;`;
const Q_NTH = `SELECT DISTINCT salary
FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
      FROM employees) t
WHERE rnk = 2;      -- change 2 to N`;
const Q_ABOVE = `SELECT e.name, e.dept, e.salary
FROM employees e
WHERE e.salary > (SELECT AVG(x.salary) FROM employees x WHERE x.dept = e.dept)
ORDER BY e.emp_id;`;
const Q_ABOVECTE = `WITH t AS (
  SELECT customer_id, SUM(amount) AS total
  FROM orders
  WHERE customer_id IS NOT NULL
  GROUP BY customer_id
),
a AS (SELECT AVG(total) AS avg_total FROM t)
SELECT c.name, t.total
FROM t
JOIN a ON t.total > a.avg_total
JOIN customers c ON c.customer_id = t.customer_id
ORDER BY t.total DESC;`;
const Q_WINAGG = `SELECT name, dept, salary,
       SUM(salary) OVER (PARTITION BY dept) AS dept_total
FROM employees
ORDER BY emp_id;`;
const Q_RANK = `SELECT name, salary,
       ROW_NUMBER() OVER (ORDER BY salary DESC, name) AS rn,
       RANK()       OVER (ORDER BY salary DESC)       AS rnk,
       DENSE_RANK() OVER (ORDER BY salary DESC)       AS drnk
FROM employees
ORDER BY salary DESC, name;`;
const Q_TOPN = `SELECT dept, name, salary, rnk
FROM (SELECT dept, name, salary,
             DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS rnk
      FROM employees) t
WHERE rnk <= 2
ORDER BY dept, rnk, name;`;
const Q_LATEST = `SELECT customer_id, order_id, order_date, amount
FROM (SELECT customer_id, order_id, order_date, amount,
             ROW_NUMBER() OVER (PARTITION BY customer_id
                                ORDER BY order_date DESC, order_id DESC) AS rn
      FROM orders
      WHERE customer_id IS NOT NULL) t
WHERE rn = 1
ORDER BY customer_id;`;
const Q_RUN = `SELECT order_id, order_date, amount,
       SUM(amount) OVER (ORDER BY order_date, order_id
                         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
FROM orders
ORDER BY order_date, order_id;`;
const Q_MOM = `WITH m AS (
  SELECT strftime('%Y-%m', order_date) AS month, SUM(amount) AS revenue
  FROM orders
  GROUP BY 1
)
SELECT month, revenue,
       LAG(revenue) OVER (ORDER BY month) AS prev_revenue,
       ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))
             / NULLIF(LAG(revenue) OVER (ORDER BY month), 0), 1) AS mom_pct
FROM m
ORDER BY month;`;
const Q_MA = `SELECT order_id, order_date, amount,
       ROUND(AVG(amount) OVER (ORDER BY order_date, order_id
                               ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS ma3
FROM orders
ORDER BY order_date, order_id;`;
const Q_PCT = `SELECT dept, SUM(salary) AS dept_salary,
       ROUND(100.0 * SUM(salary) / SUM(SUM(salary)) OVER (), 1) AS pct
FROM employees
GROUP BY dept
ORDER BY dept;`;
const Q_NTILE = `SELECT name, salary,
       NTILE(4) OVER (ORDER BY salary DESC, name) AS quartile
FROM employees
ORDER BY salary DESC, name;`;
const Q_GAP = `SELECT customer_id, order_id, order_date,
       CAST(julianday(order_date)
            - julianday(LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date))
            AS INTEGER) AS days_since_prev
FROM orders
WHERE customer_id IS NOT NULL
ORDER BY customer_id, order_date;`;
const Q_PARETO = `WITH t AS (
  SELECT customer_id, SUM(amount) AS total
  FROM orders
  WHERE customer_id IS NOT NULL
  GROUP BY customer_id
)
SELECT customer_id, total,
       SUM(total) OVER (ORDER BY total DESC, customer_id) AS running,
       ROUND(100.0 * SUM(total) OVER (ORDER BY total DESC, customer_id)
             / SUM(total) OVER (), 1) AS cum_pct
FROM t
ORDER BY total DESC;`;
const Q_ISLAND = `WITH d AS (
  SELECT DISTINCT user_id, login_date FROM logins
),
g AS (
  SELECT user_id, login_date,
         date(login_date, '-' || ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) || ' day') AS grp
  FROM d
)
SELECT user_id, MIN(login_date) AS streak_start, MAX(login_date) AS streak_end, COUNT(*) AS days
FROM g
GROUP BY user_id, grp
ORDER BY user_id, streak_start;`;
const Q_COHORT = `WITH m AS (
  SELECT DISTINCT customer_id,
         CAST(strftime('%Y', order_date) AS INT) * 12 + CAST(strftime('%m', order_date) AS INT) AS mn
  FROM orders
  WHERE customer_id IS NOT NULL
),
f AS (SELECT customer_id, MIN(mn) AS first_mn FROM m GROUP BY customer_id)
SELECT (f.first_mn - 1) / 12      AS cohort_year,
       (f.first_mn - 1) % 12 + 1  AS cohort_month,
       COUNT(DISTINCT f.customer_id)  AS cohort_size,
       COUNT(DISTINCT m2.customer_id) AS retained_m1
FROM f
LEFT JOIN m m2 ON m2.customer_id = f.customer_id AND m2.mn = f.first_mn + 1
GROUP BY f.first_mn
ORDER BY f.first_mn;`;
const Q_MEDIAN = `WITH r AS (
  SELECT salary,
         ROW_NUMBER() OVER (ORDER BY salary) AS rn,
         COUNT(*)     OVER ()                AS n
  FROM employees
)
SELECT AVG(salary) AS median_salary
FROM r
WHERE rn IN ((n + 1) / 2, (n + 2) / 2);`;
const Q_REC = `WITH RECURSIVE org AS (
  SELECT emp_id, name, manager_id, 0 AS level
  FROM employees
  WHERE manager_id IS NULL
  UNION ALL
  SELECT e.emp_id, e.name, e.manager_id, o.level + 1
  FROM employees e
  JOIN org o ON e.manager_id = o.emp_id
)
SELECT emp_id, name, level
FROM org
ORDER BY level, emp_id;`;
const Q_PROD = `SELECT p.name,
       COALESCE(SUM(i.qty), 0)           AS units,
       COALESCE(SUM(i.qty * p.price), 0) AS revenue
FROM products p
LEFT JOIN order_items i ON i.product_id = p.product_id
GROUP BY p.product_id, p.name
ORDER BY p.product_id;`;

QA.sql = {
name: 'SQL', emoji: '🗄️',
schemaSql: SQL_SCHEMA,
schema: pre(SQL_SCHEMA),
list: [

/* ================= BASICS ================= */
{ q: 'What is the difference between WHERE and HAVING?',
  short: 'WHERE filters individual rows before grouping, so it cannot use aggregates. HAVING filters groups after GROUP BY, so it can use COUNT, SUM and so on. I use WHERE first to cut rows early, then HAVING for conditions on the group result.',
  a: `<p><b>Approach:</b> think of the order. Rows are read, WHERE removes rows, GROUP BY makes groups, HAVING removes groups.</p>
<p>Question: per department, count employees earning 55000 or more, and keep only departments with at least 2 such people.</p>${pre(Q_WH)}
<p>Result:</p>${pre(`dept | n
IT | 3
Sales | 2`)}
<p><b>Why:</b> HR has Divya (50000) and Esha (60000). WHERE drops Divya first, so HR has only 1 row left and HAVING removes it. Putting <code>COUNT(*) &gt;= 2</code> in WHERE is an error because the count does not exist yet at that stage. A condition on a plain column (like salary) is better in WHERE because it is faster: fewer rows reach the grouping step.</p>`,
  run: Q_WH, lvl: 'E', freq: 3,
  follow: ['Can you use a SELECT alias in HAVING?', 'Can HAVING be used without GROUP BY?'],
  mistake: 'Writing an aggregate such as COUNT(*) &gt; 1 inside WHERE, or putting a plain row filter in HAVING (works but is slower and shows you do not know the order).',
  tags: ['aggregation', 'basics'] },

{ q: 'What is the logical order in which SQL executes a query?',
  short: 'FROM and JOINs, then WHERE, GROUP BY, HAVING, SELECT, DISTINCT, ORDER BY, and finally LIMIT. That is why a SELECT alias works in ORDER BY but not in WHERE.',
  a: `<p><b>Order (logical, not the order you type):</b> 1 FROM/JOIN, 2 WHERE, 3 GROUP BY, 4 HAVING, 5 SELECT (aliases and window functions are computed here), 6 DISTINCT, 7 ORDER BY, 8 LIMIT/OFFSET.</p>
<p>So this fails because <code>annual</code> does not exist yet when WHERE runs:</p>${pre(`SELECT name, salary * 12 AS annual
FROM employees
WHERE annual > 800000;      -- error in most databases`)}
<p>Fix: repeat the expression (or wrap the query in a subquery or CTE):</p>${pre(Q_ORD)}
<p>Result:</p>${pre(`name | annual
Anil | 1080000
Bina | 840000
Chetan | 840000`)}
<p><b>Why it matters:</b> window functions run in step 5, so you cannot put <code>ROW_NUMBER() OVER (...)</code> in WHERE either. Wrap it in a subquery or CTE and filter outside. ORDER BY runs after SELECT, so it may use the alias. (MySQL and SQLite are lenient about aliases in WHERE or HAVING, but do not rely on it in an interview; say the standard rule.)</p>`,
  run: Q_ORD, lvl: 'E', freq: 3,
  follow: ['Why can I not filter on ROW_NUMBER() in WHERE?', 'Does the optimiser really run it in this order?'],
  mistake: 'Using a SELECT alias in WHERE or HAVING, or filtering on a window function directly in WHERE.',
  tags: ['basics', 'execution-order'] },

{ q: 'How does SQL treat NULL? Explain COUNT(*), COUNT(col) and COUNT(DISTINCT col).',
  short: 'NULL means unknown, so any comparison with it (even NULL = NULL) is unknown and the row is dropped. I test with IS NULL. COUNT(*) counts rows, COUNT(col) counts non-null values, COUNT(DISTINCT col) counts unique non-null values.',
  a: `<p><b>Rule:</b> comparisons with NULL give UNKNOWN, and WHERE keeps only TRUE rows. So <code>city = NULL</code> never matches anything; use <code>city IS NULL</code>.</p>${pre(Q_NULL)}
<p>Result:</p>${pre(`all_rows | non_null | distinct_cities
5 | 4 | 3`)}
<p>5 customers; Sara has NULL city so COUNT(city) is 4; the cities are Mumbai, Delhi, Mumbai, Pune so 3 distinct.</p>
<p><b>Traps to say aloud:</b></p>
<ul><li><code>WHERE city &lt;&gt; 'Mumbai'</code> returns Ravi and John only. Sara (NULL) is silently dropped. To keep her: <code>city &lt;&gt; 'Mumbai' OR city IS NULL</code>.</li>
<li>SUM, AVG, MIN, MAX ignore NULLs. AVG of (10, NULL, 20) is 15, not 10.</li>
<li>NULL + 5 is NULL. Wrap with COALESCE when you need a number.</li>
<li>GROUP BY puts all NULLs into one group.</li></ul>`,
  run: Q_NULL, lvl: 'E', freq: 3,
  follow: ['What does NOT IN return when the list contains a NULL?', 'Does AVG treat NULL as zero?'],
  mistake: 'Writing = NULL or &lt;&gt; NULL, and forgetting that a filter like &lt;&gt; \'X\' also removes the NULL rows.',
  tags: ['null', 'basics'] },

{ q: 'How do you replace NULLs with a default value? What is COALESCE?',
  short: 'COALESCE(a, b, c) returns the first non-null argument. It is standard SQL and works everywhere; IFNULL, NVL and ISNULL are two-argument vendor versions. I use it for display and before arithmetic.',
  a: `${pre(Q_COAL)}
<p>Result:</p>${pre(`name | city
Asha | Mumbai
Ravi | Delhi
Meena | Mumbai
John | Pune
Sara | Unknown`)}
<p><b>Why:</b> the NULL city of Sara becomes 'Unknown' only in the output; the table is not changed. You can list many fallbacks: <code>COALESCE(mobile, phone, email, 'none')</code>.</p>
<p>Careful: replacing NULL by 0 before AVG changes the result, because NULL rows were being ignored and now they count as zeros. Decide what NULL means (missing vs zero) before you fill it. The opposite function is <code>NULLIF(a, b)</code>, which returns NULL when a equals b; it is the standard way to avoid divide-by-zero: <code>x / NULLIF(y, 0)</code>.</p>`,
  run: Q_COAL, lvl: 'E', freq: 2,
  follow: ['What does NULLIF do and when do you use it?', 'IFNULL vs COALESCE?'],
  mistake: 'Filling NULLs with 0 before an average, which silently changes the answer.',
  tags: ['null', 'functions'] },

{ q: 'How do you bucket values into labels such as High / Medium / Low?',
  short: 'Use a CASE WHEN expression. It checks conditions top to bottom and returns the first match, with ELSE as the fallback. I can GROUP BY the CASE to count rows per bucket.',
  a: `<p><b>Approach:</b> CASE gives a new column; then group by it.</p>${pre(Q_CASE)}
<p>Result:</p>${pre(`size_band | orders
High | 2
Medium | 3
Low | 3`)}
<p><b>Why this order of conditions:</b> CASE stops at the first true branch, so 400 matches <code>&gt;= 300</code> and never reaches the Medium test. If you wrote the 150 test first, everything above 150 would be Medium. Without ELSE, unmatched rows become NULL. <code>GROUP BY 1</code> means "group by the first select column"; many people prefer to repeat the expression for readability. ORDER BY MIN(amount) DESC just puts High first.</p>`,
  run: Q_CASE, lvl: 'E', freq: 3,
  follow: ['How do you use CASE inside SUM to pivot?', 'What is returned if no branch matches and there is no ELSE?'],
  mistake: 'Putting the conditions in the wrong order so a broad test (like &gt;= 150) catches rows meant for a stricter test.',
  tags: ['case', 'basics'] },

{ q: 'What is the difference between DELETE, TRUNCATE and DROP?',
  short: 'DELETE removes chosen rows, can have a WHERE, and can be rolled back. TRUNCATE empties the whole table quickly but keeps its structure. DROP removes the table itself, structure and data.',
  a: `<ul><li><b>DELETE</b> is DML. <code>DELETE FROM orders WHERE order_id = 108;</code> removes matching rows one by one (logged), fires triggers, can be rolled back, and keeps identity counters.</li>
<li><b>TRUNCATE</b> is DDL-like. <code>TRUNCATE TABLE orders;</code> removes all rows fast, no WHERE, usually resets auto-increment. In PostgreSQL and SQL Server it can still be rolled back inside a transaction; in MySQL and Oracle it commits at once. (SQLite has no TRUNCATE; use DELETE without WHERE.)</li>
<li><b>DROP</b> is DDL. <code>DROP TABLE orders;</code> removes data, columns, indexes and constraints. Everything is gone.</li></ul>
<p><b>Why it matters:</b> in a real job you run DELETE with a WHERE inside a transaction, check the row count, then commit. Foreign keys can block TRUNCATE and DROP.</p>`,
  lvl: 'E', freq: 3,
  follow: ['Can you roll back a TRUNCATE?', 'What happens to the identity counter after each?'],
  mistake: 'Saying TRUNCATE can never be rolled back; it depends on the database.',
  tags: ['ddl', 'theory'] },

{ q: 'What are a primary key, a foreign key and a unique key?',
  short: 'A primary key uniquely identifies each row: no NULLs, one per table. A foreign key points to a key in another table and keeps the link valid. A unique key also forbids duplicates but allows NULL, and a table can have many.',
  a: `${pre(`CREATE TABLE orders (
  order_id    INT PRIMARY KEY,                 -- unique, not null
  customer_id INT REFERENCES customers(customer_id),  -- foreign key
  invoice_no  VARCHAR(20) UNIQUE               -- unique, may be NULL
);`)}
<ul><li><b>Primary key:</b> one per table (can be made of several columns). Creates an index.</li>
<li><b>Foreign key:</b> you cannot insert an order for a customer that does not exist, and you cannot delete a customer who still has orders (unless ON DELETE CASCADE is set).</li>
<li><b>Unique key:</b> useful for natural identifiers like email. How many NULLs are allowed depends on the database (PostgreSQL and SQLite: many; SQL Server: one).</li></ul>
<p><b>Link to analytics:</b> join keys that are not really unique are the main cause of inflated row counts, so always check whether the key is unique on each side of a join.</p>`,
  lvl: 'E', freq: 2,
  follow: ['Can a foreign key be NULL?', 'What is a composite key?'],
  mistake: 'Saying a unique key and a primary key are the same; the PK disallows NULL and there is only one.',
  tags: ['keys', 'theory'] },

/* ================= JOINS ================= */
{ q: 'Explain INNER, LEFT, RIGHT and FULL OUTER JOIN. Show how you would list every customer with their number of orders.',
  short: 'INNER keeps only matching rows. LEFT keeps all rows of the left table and fills NULL where the right has no match. RIGHT is the mirror. FULL keeps everything from both. For orders per customer I LEFT JOIN from customers and COUNT a column of orders.',
  a: `<p><b>Approach:</b> customers must all appear, even those with zero orders, so customers is the left table and we use LEFT JOIN. Count <code>o.order_id</code>, not <code>*</code>.</p>${pre(Q_JOIN)}
<p>Result:</p>${pre(`name | orders
Asha | 2
Ravi | 2
Meena | 3
John | 0
Sara | 0`)}
<p><b>Why COUNT(o.order_id):</b> John has no orders, but the LEFT JOIN still creates one row for him with NULL order columns. COUNT(*) would say 1; COUNT(o.order_id) ignores the NULL and says 0. An INNER JOIN here would silently drop John and Sara. A SELF JOIN is just a table joined to itself (see the manager question).</p>
<ul><li>INNER: only rows with a match on both sides.</li><li>LEFT: all left rows + matches.</li><li>RIGHT: all right rows + matches (most people just swap the tables and use LEFT).</li><li>FULL: all rows from both; unmatched side is NULL. (MySQL has no FULL JOIN.)</li></ul>`,
  run: Q_JOIN, lvl: 'E', freq: 3,
  follow: ['What does COUNT(*) give for John here?', 'When would you choose RIGHT JOIN?'],
  mistake: 'Using COUNT(*) after a LEFT JOIN, which counts the NULL-filled row as 1.',
  tags: ['joins', 'aggregation'] },

{ q: 'Table A has ids (1,1,2) and table B has ids (1,1,3). How many rows do INNER, LEFT, RIGHT and FULL JOIN on id return?',
  short: 'Duplicate keys multiply. id 1 appears twice on each side so it gives 2 x 2 = 4 rows. INNER = 4, LEFT = 5 (adds id 2 with NULLs), RIGHT = 5 (adds id 3), FULL = 6.',
  a: `<p>In the practice schema these are <code>t_left</code> (1,1,2) and <code>t_right</code> (1,1,3).</p>
<p><b>Approach:</b> a join pairs every matching left row with every matching right row. Count per key, then add unmatched rows.</p>
<ul><li>id 1: 2 left rows x 2 right rows = 4 pairs.</li><li>id 2: only on the left. id 3: only on the right.</li></ul>${pre(Q_DUPJOIN)}
<p>Result (the two joins we can run directly):</p>${pre(`join_type | row_count
INNER | 4
LEFT | 5`)}
<p>RIGHT = 4 + 1 (id 3 with NULL on the left) = <b>5</b>. FULL = 4 + 1 + 1 = <b>6</b>.</p>
<p><b>Why it matters:</b> this is the classic "why did my row count go up after a join?" problem. A key that repeats on both sides multiplies rows. Also note that NULL keys never match each other, so rows with NULL ids would appear as unmatched in LEFT or FULL, not as pairs. In real work, check key uniqueness with <code>GROUP BY id HAVING COUNT(*) &gt; 1</code> before joining.</p>`,
  run: Q_DUPJOIN, lvl: 'M', freq: 3,
  follow: ['What if both tables also had a NULL id row?', 'How would you stop the multiplication?'],
  mistake: 'Answering 2 for the inner join (counting distinct ids) instead of multiplying the duplicates.',
  tags: ['joins', 'duplicates'] },

{ q: 'LEFT JOIN: what is the difference between a condition in ON and the same condition in WHERE?',
  short: 'A condition in ON decides which right-side rows match, so unmatched left rows still appear with NULLs. The same condition in WHERE runs after the join and throws away the NULL rows, which turns the LEFT JOIN into an inner join.',
  a: `<p>Task: for every customer, count orders of 200 or more.</p>${pre(Q_ONWH)}
<p>Result:</p>${pre(`name | big_orders
Asha | 1
Ravi | 2
Meena | 1
John | 0
Sara | 0`)}
<p>All 5 customers are present. Now move the filter into WHERE:</p>${pre(`SELECT c.name, COUNT(o.order_id) AS big_orders
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
WHERE o.amount >= 200
GROUP BY c.customer_id, c.name;`)}
<p>This returns only Asha 1, Ravi 2, Meena 1 (3 rows). John and Sara have o.amount NULL, <code>NULL &gt;= 200</code> is unknown, so WHERE deletes them.</p>
<p><b>Rule:</b> for the preserved (left) table, filter in WHERE; for the optional (right) table, filter in ON. For an INNER JOIN the two places give the same result.</p>`,
  run: Q_ONWH, lvl: 'M', freq: 2,
  follow: ['How would you write the WHERE version and still keep customers with no big orders?', 'Does this matter for INNER JOIN?'],
  mistake: 'Filtering the right table in WHERE after a LEFT JOIN and wondering why the unmatched rows disappeared.',
  tags: ['joins', 'null'] },

{ q: 'What is the difference between UNION and UNION ALL?',
  short: 'Both stack the results of two queries with the same number of compatible columns. UNION also removes duplicate rows, which costs a sort or hash. UNION ALL keeps every row and is faster, so I use it unless I need de-duplication.',
  a: `<p>Cities of customers combined with cities of suppliers:</p>${pre(Q_UNION)}
<p>Result (UNION):</p>${pre(`city
Chennai
Delhi
Mumbai
Pune`)}
<p>With <code>UNION ALL</code> you get all <b>7</b> rows (4 customer cities + 3 supplier cities), and Mumbai appears 3 times. UNION returned 4 because it removed the repeated Mumbai and Pune.</p>
<p><b>Rules:</b> same number of columns, compatible types, column names come from the first query, ORDER BY goes once at the very end. UNION compares whole rows, so two rows are duplicates only if every column matches. Use UNION ALL for stacking monthly tables or when the sets cannot overlap. INTERSECT (common rows) and EXCEPT (rows in the first but not the second; MINUS in Oracle) work the same way.</p>`,
  run: Q_UNION, lvl: 'E', freq: 3,
  follow: ['Which one is faster and why?', 'What do INTERSECT and EXCEPT do?'],
  mistake: 'Using UNION by habit when UNION ALL is meant: it silently drops legitimate duplicate rows and is slower.',
  tags: ['set-operations'] },

{ q: 'Find the customers who have never placed an order.',
  short: 'This is an anti-join. LEFT JOIN customers to orders and keep the rows where the order key is NULL. NOT EXISTS gives the same answer and is safer when NULLs are around.',
  a: `<p><b>Approach:</b> LEFT JOIN keeps all customers; the ones with no match have NULL in every order column. Filter on a column that can never be NULL in a real order, such as its primary key.</p>${pre(Q_ANTI)}
<p>Result:</p>${pre(`name
John
Sara`)}
<p>Other ways:</p>${pre(`-- NOT EXISTS (safe with NULLs)
SELECT name FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);`)}
<p><b>Why not test o.amount IS NULL?</b> An order could really have a NULL amount, and you would confuse it with "no order". Test the key. The NOT IN version has a NULL trap, covered in the next question.</p>`,
  run: Q_ANTI, lvl: 'E', freq: 3,
  follow: ['Rewrite it with NOT EXISTS.', 'Which is faster, LEFT JOIN / IS NULL or NOT EXISTS?'],
  mistake: 'Using an INNER JOIN or a WHERE on the right table, which can never return customers with no orders.',
  tags: ['joins', 'anti-join'] },

{ q: 'Why can NOT IN return no rows at all? How do you fix it?',
  short: 'If the subquery list contains even one NULL, NOT IN becomes unknown for every row, so nothing is returned. Filter the NULLs out of the subquery or use NOT EXISTS.',
  a: `<p><b>The trap.</b> Order 108 has <code>customer_id = NULL</code>. This query looks right but returns <b>0 rows</b>:</p>${pre(`SELECT name FROM customers
WHERE customer_id NOT IN (SELECT customer_id FROM orders);`)}
<p><b>Why:</b> <code>4 NOT IN (1,2,3,NULL)</code> means <code>4&lt;&gt;1 AND 4&lt;&gt;2 AND 4&lt;&gt;3 AND 4&lt;&gt;NULL</code>. The last part is UNKNOWN, so the whole AND is not TRUE, and the row is dropped.</p>
<p><b>Fix 1:</b> remove NULLs from the list.</p>${pre(Q_NOTIN)}
<p>Result:</p>${pre(`name
John
Sara`)}
<p><b>Fix 2:</b> use <code>NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id)</code> or the LEFT JOIN / IS NULL anti-join. IN is not affected by NULLs in the same way (it only misses the NULL itself), which is why the problem appears only with NOT IN.</p>`,
  run: Q_NOTIN, lvl: 'M', freq: 3,
  follow: ['Does IN have the same problem?', 'Which of the three anti-join styles do you prefer and why?'],
  mistake: 'Using NOT IN on a nullable column and trusting the empty result.',
  tags: ['null', 'subquery', 'anti-join'] },

{ q: 'Find employees who earn more than their manager.',
  short: 'It is a self join: join employees to employees, where the first copy\'s manager_id equals the second copy\'s emp_id, then compare salaries. The top boss has no manager, so an inner join drops him naturally.',
  a: `<p><b>Approach:</b> give the same table two aliases, e = the employee, m = the manager.</p>${pre(Q_SELF)}
<p>Result:</p>${pre(`employee | salary | manager | manager_salary
Esha | 60000 | Divya | 50000
Gita | 55000 | Farhan | 40000
Hari | 55000 | Farhan | 40000`)}
<p><b>Why:</b> Anil has manager_id NULL, so he has no partner row and is dropped by the inner join, which is correct here. If you wanted a list of all employees with manager names, including Anil, use LEFT JOIN and the manager column will be NULL for him. Always join on <code>e.manager_id = m.emp_id</code>, not the other way round.</p>`,
  run: Q_SELF, lvl: 'M', freq: 3,
  follow: ['List all employees with their manager name, showing "No manager" for the top person.', 'How would you find all employees under Anil at any depth?'],
  mistake: 'Joining on the wrong columns (emp_id = emp_id) or forgetting aliases, so the self join is ambiguous.',
  tags: ['joins', 'self-join'] },

{ q: 'After joining orders to order_items, your total revenue is much bigger than the real total. What went wrong and how do you fix it?',
  short: 'Join fan-out: an order with 3 item rows is repeated 3 times, so SUM(amount) counts it 3 times. Aggregate the many-side table to one row per order before joining, or sum at the item level.',
  a: `<p><b>Diagnosis.</b> <code>orders.amount</code> is stored once per order. <code>order_items</code> has several rows per order (order 101 has 2 items, 105 has 2, 107 has 2). After joining, the order amount repeats on every item row.</p>${pre(`SELECT SUM(o.amount) FROM orders o JOIN order_items i ON i.order_id = o.order_id;
-- 2200  (wrong; plain SUM(amount) FROM orders is 1530)`)}
<p><b>Fix:</b> collapse items to one row per order first, so the join is one-to-one.</p>${pre(Q_FAN)}
<p>Result:</p>${pre(`customer_id | revenue | units
1 | 350 | 16
2 | 600 | 4
3 | 500 | 10`)}
<p><b>How to catch it:</b> compare row counts before and after each join; run <code>GROUP BY key HAVING COUNT(*) &gt; 1</code> on the side you expect to be unique; do not mix a measure from a "one" table with a measure from a "many" table in the same group-by. (A band-aid like <code>COUNT(DISTINCT order_id)</code> works for counts but not for sums.) Note the inner join also drops order 108 because it has no items.</p>`,
  run: Q_FAN, lvl: 'H', freq: 3,
  follow: ['Why does COUNT(DISTINCT order_id) not fix SUM?', 'How can you check that a join is one-to-many before running the report?'],
  mistake: 'Summing a header-level column (order amount) after joining to a detail table, so each amount is counted once per item.',
  tags: ['joins', 'duplicates', 'debugging'] },

{ q: 'List every product with units sold and revenue, including products that were never sold.',
  short: 'Start from products and LEFT JOIN order_items, so unsold products stay. Wrap the sums in COALESCE to show 0 instead of NULL.',
  a: `<p><b>Approach:</b> the table you must not lose (products) goes on the left.</p>${pre(Q_PROD)}
<p>Result:</p>${pre(`name | units | revenue
Pen | 20 | 200
Notebook | 5 | 250
Mouse | 2 | 1000
Keyboard | 2 | 2400
Bag | 1 | 800
Cable | 0 | 0`)}
<p><b>Why:</b> Cable has no matching item, so SUM over its single NULL-filled row is NULL; COALESCE turns it into 0. Revenue is qty x price because this schema keeps price on products. Starting from order_items instead would never show Cable at all.</p>`,
  run: Q_PROD, lvl: 'M', freq: 2,
  follow: ['Show only the products never sold.', 'Revenue per category, with zero-sale categories included?'],
  mistake: 'Starting from order_items (or using INNER JOIN), which hides the products with no sales.',
  tags: ['joins', 'null'] },

/* ================= AGGREGATION ================= */
{ q: 'Which customers spent more than 400 in total? Show their names.',
  short: 'Join customers to orders, GROUP BY the customer, SUM the amount, and use HAVING SUM(amount) greater than 400 because the condition is on the group total. Sort by total descending.',
  a: `${pre(Q_SPEND)}
<p>Result:</p>${pre(`name | total_spend
Ravi | 600
Meena | 500`)}
<p><b>Why:</b> totals are Asha 350, Ravi 600, Meena 500. Asha misses the cut. Group by the customer id as well as name so two different customers with the same name do not merge. This inner join ignores customers with no orders, which is fine for "spent more than 400". Order 108 has no customer, so it joins to nobody and is not counted.</p>`,
  run: Q_SPEND, lvl: 'E', freq: 3,
  follow: ['Show the top 2 spenders only.', 'How would you also list customers with zero spend?'],
  mistake: 'Putting SUM(amount) &gt; 400 in WHERE instead of HAVING.',
  tags: ['aggregation', 'joins'] },

{ q: 'Write a query for monthly revenue and order count.',
  short: 'Convert the date to a month label, then GROUP BY it and SUM the amount. In PostgreSQL use DATE_TRUNC or TO_CHAR; in SQLite use strftime. Always sort by the month so the output is chronological.',
  a: `${pre(Q_MONTH)}
<p>Result:</p>${pre(`month | revenue | orders
2024-01 | 350 | 2
2024-02 | 550 | 2
2024-03 | 550 | 3
2024-04 | 80 | 1`)}
<p><b>Dialects.</b> The above is SQLite. PostgreSQL: <code>DATE_TRUNC('month', order_date)</code> (keeps a real date, best for charts) or <code>TO_CHAR(order_date, 'YYYY-MM')</code>. MySQL: <code>DATE_FORMAT(order_date, '%Y-%m')</code>. SQL Server: <code>FORMAT</code> or <code>DATEFROMPARTS(YEAR(d), MONTH(d), 1)</code>.</p>
<p><b>Why group by year and month, not just month:</b> grouping by <code>EXTRACT(MONTH ...)</code> alone would merge January 2024 with January 2025. A month with no orders does not appear at all; to show it you need a calendar table and a LEFT JOIN.</p>`,
  run: Q_MONTH, lvl: 'M', freq: 3,
  follow: ['How would you show months that have zero orders?', 'How do you get week or quarter instead?'],
  mistake: 'Grouping by month number only, mixing the same month of different years.',
  tags: ['dates', 'aggregation'] },

{ q: 'Show each customer\'s revenue for January, February and March as separate columns (pivot with CASE).',
  short: 'Use conditional aggregation: SUM(CASE WHEN month = X THEN amount ELSE 0 END) once per column, grouped by customer. SQL has no simple PIVOT that works everywhere, so this is the portable way.',
  a: `${pre(Q_PIVOT)}
<p>Result:</p>${pre(`customer_id | jan | feb | mar
1 | 350 | 0 | 0
2 | 0 | 400 | 200
3 | 0 | 150 | 350`)}
<p><b>Why:</b> for each row the CASE puts the amount into only the matching month column and 0 elsewhere; SUM then adds them up per customer. Use <code>COUNT(CASE WHEN ... THEN 1 END)</code> for counts (no ELSE, so non-matching rows are NULL and not counted). The weak point: the month columns are hard-coded; a new month means editing the query. Order 108 is excluded by the WHERE since it has no customer.</p>`,
  run: Q_PIVOT, lvl: 'M', freq: 3,
  follow: ['How would you do a count version instead of a sum?', 'How would you un-pivot columns back into rows?'],
  mistake: 'Forgetting GROUP BY, or using COUNT(CASE ... ELSE 0 END) which counts the zeros too.',
  tags: ['case', 'pivot', 'aggregation'] },

{ q: 'Find duplicate emails in a table and how many times each appears.',
  short: 'GROUP BY the email and keep groups with HAVING COUNT(*) greater than 1. For duplicates over several columns, group by all of them.',
  a: `${pre(Q_DUPS)}
<p>Result:</p>${pre(`email | times
a@x.com | 3
b@x.com | 2`)}
<p><b>Why:</b> c@x.com appears once, so it is filtered out by HAVING. To see the full duplicate rows (not just the key), join this result back to the table or use <code>COUNT(*) OVER (PARTITION BY email)</code> and filter on it in a subquery. Real data often hides duplicates behind case or trailing spaces, so check <code>LOWER(TRIM(email))</code> too.</p>`,
  run: Q_DUPS, lvl: 'E', freq: 3,
  follow: ['Now delete the duplicates but keep one copy.', 'How do you count how many distinct emails exist?'],
  mistake: 'Using WHERE COUNT(*) &gt; 1, or ignoring case and spaces that hide duplicates.',
  tags: ['duplicates', 'aggregation'] },

{ q: 'Delete duplicate emails but keep one row for each (the one with the lowest contact_id).',
  short: 'Number the rows inside each email with ROW_NUMBER ordered by id, then delete every row whose number is greater than 1. Always preview with a SELECT first and run the DELETE inside a transaction.',
  a: `<p><b>Step 1 - preview the rows that will go:</b></p>${pre(Q_DUPDEL)}
<p>Result:</p>${pre(`contact_id | email
3 | a@x.com
5 | b@x.com
6 | a@x.com`)}
<p><b>Step 2 - delete them:</b></p>${pre(`DELETE FROM contacts
WHERE contact_id IN (
  SELECT contact_id
  FROM (SELECT contact_id,
               ROW_NUMBER() OVER (PARTITION BY email ORDER BY contact_id) AS rn
        FROM contacts) t
  WHERE rn > 1);`)}
<p>Remaining contact_ids: <b>1, 2, 4</b>.</p>
<p><b>Why it works:</b> within each email, the lowest id gets rn = 1 and is kept; all others get 2, 3, ... and are deleted. Alternative that needs no window function: <code>DELETE FROM contacts WHERE contact_id NOT IN (SELECT MIN(contact_id) FROM contacts GROUP BY email);</code> (safe because contact_id is never NULL). If the whole row is duplicated and there is no id, copy DISTINCT rows into a new table and swap, or use the database's row id (ctid in PostgreSQL, ROWID in Oracle and SQLite). MySQL does not allow selecting from the table you are deleting from in a plain subquery; wrap it in another derived table.</p>`,
  run: Q_DUPDEL, lvl: 'M', freq: 3,
  follow: ['What if there is no id column?', 'How do you keep the latest row instead of the oldest?'],
  mistake: 'Running the DELETE without a preview or a transaction, or ordering the ROW_NUMBER wrongly so the wrong copy survives.',
  tags: ['duplicates', 'window'] },

/* ================= SUBQUERY / CTE ================= */
{ q: 'EXISTS vs IN: what is the difference, and which would you use?',
  short: 'IN compares a value to a list returned by a subquery. EXISTS asks "is there at least one matching row?" and stops at the first one. Modern optimisers often treat them the same, but NOT EXISTS is safer than NOT IN because of NULLs.',
  a: `${pre(Q_EXISTS)}
<p>Result (customers with at least one order):</p>${pre(`name
Asha
Ravi
Meena`)}
<p>Same with IN: <code>WHERE customer_id IN (SELECT customer_id FROM orders)</code>. Same three customers.</p>
<ul><li><b>EXISTS</b> is correlated (the inner query refers to the outer row), returns TRUE or FALSE, never cares about the selected columns (hence <code>SELECT 1</code>), and is not confused by NULLs.</li>
<li><b>IN</b> builds a list. Fine for small lists and readable. IN with a NULL in the list just fails to match NULL; but <b>NOT IN</b> with a NULL returns nothing.</li>
<li><b>Performance:</b> do not promise one is always faster. EXISTS tends to win when the outer table is small and the inner is large and indexed. Check the query plan.</li></ul>`,
  run: Q_EXISTS, lvl: 'M', freq: 2,
  follow: ['Why is NOT EXISTS safer than NOT IN?', 'Can you write the same thing as a JOIN, and what could go wrong?'],
  mistake: 'Claiming EXISTS is always faster than IN, and using NOT IN on nullable columns.',
  tags: ['subquery', 'null'] },

{ q: 'CTE vs subquery vs temp table vs view: when do you use each?',
  short: 'A subquery is inline and fine for one small step. A CTE (WITH) names a step, makes long queries readable, and can be used several times in one statement. A temp table is stored for the session and can be indexed, good for heavy reuse. A view is a saved query that lives in the database.',
  a: `<p>Example: total per customer as a CTE, then join to names.</p>${pre(Q_CTE)}
<p>Result:</p>${pre(`name | total
Ravi | 600
Meena | 500
Asha | 350`)}
<ul><li><b>Subquery:</b> inline in FROM, WHERE or SELECT. Fine for one step; deep nesting is hard to read.</li>
<li><b>CTE:</b> exists only for the one statement. Reads top to bottom, can be referenced many times and can be recursive. Not automatically faster; some databases (older PostgreSQL) materialise it, which can hurt or help.</li>
<li><b>Temp table:</b> real storage for the session. Use when the intermediate result is big, reused across many statements, or needs an index.</li>
<li><b>View:</b> a named saved query, no data stored; gives colleagues one agreed definition. A <b>materialised view</b> stores the result and must be refreshed.</li></ul>`,
  run: Q_CTE, lvl: 'E', freq: 3,
  follow: ['Is a CTE faster than a subquery?', 'What is a recursive CTE used for?'],
  mistake: 'Saying a CTE is always faster or that it stores its result for later queries.',
  tags: ['cte', 'subquery'] },

{ q: 'Find the Nth highest salary (for example the 2nd highest).',
  short: 'Rank salaries with DENSE_RANK in descending order and keep rank N. DENSE_RANK is right because ties share a rank and the next rank is not skipped. A LIMIT/OFFSET on DISTINCT salaries is a simpler alternative.',
  a: `${pre(Q_NTH)}
<p>Result:</p>${pre(`salary
70000`)}
<p>Distinct salaries from the top: 90000, 70000, 60000, 55000, 50000, 40000. The 2nd is 70000, held by both Bina and Chetan.</p>
<p><b>Why DENSE_RANK:</b> ROW_NUMBER would call Chetan the 3rd and give 70000 twice or skip it; RANK would give 1,2,2,4 so "rank 3" would not exist. DENSE_RANK gives 1,2,2,3 which matches what people mean by "2nd highest salary".</p>
<p><b>Other ways:</b></p>${pre(`-- OFFSET: returns NULL (not an empty result) when N is too big
SELECT (SELECT DISTINCT salary FROM employees
        ORDER BY salary DESC LIMIT 1 OFFSET 1) AS second_highest;

-- classic, 2nd only
SELECT MAX(salary) FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);`)}
<p>The scalar-subquery wrapper is useful because many interviewers ask "what if there is no 2nd highest?" and expect NULL. (SQL Server uses TOP and OFFSET ... FETCH instead of LIMIT.)</p>`,
  run: Q_NTH, lvl: 'M', freq: 3,
  follow: ['What if there is no Nth salary? Return NULL.', 'Nth highest salary per department?'],
  mistake: 'Using ROW_NUMBER or RANK, which mishandle ties, or using LIMIT/OFFSET without DISTINCT so duplicates count as separate ranks.',
  tags: ['window', 'ranking', 'subquery'] },

{ q: 'List employees who earn more than the average salary of their own department.',
  short: 'Use a correlated subquery that computes the average for the same department as the current row, or use AVG() OVER (PARTITION BY dept) in a CTE. Compare the salary with that value.',
  a: `${pre(Q_ABOVE)}
<p>Result:</p>${pre(`name | dept | salary
Anil | IT | 90000
Esha | HR | 60000
Gita | Sales | 55000
Hari | Sales | 55000`)}
<p><b>Why:</b> averages are IT 76666.67, HR 55000, Sales 50000. Notice this is per department, not the company average. The subquery is <i>correlated</i>: it uses <code>e.dept</code> from the outer row, so it is re-evaluated per department (the optimiser usually does this efficiently).</p>
<p>Window version, one pass over the table:</p>${pre(`SELECT name, dept, salary FROM (
  SELECT name, dept, salary, AVG(salary) OVER (PARTITION BY dept) AS dept_avg
  FROM employees) t
WHERE salary > dept_avg;`)}`,
  run: Q_ABOVE, lvl: 'M', freq: 3,
  follow: ['Show the difference from the average too.', 'What is a correlated subquery?'],
  mistake: 'Comparing against the company-wide average instead of the department average.',
  tags: ['subquery', 'window'] },

{ q: 'Which customers spent more than the average customer? (use two CTE steps)',
  short: 'Step 1 sums spend per customer. Step 2 averages those totals. Then compare each total to that average. Note that this averages over customers who have orders.',
  a: `${pre(Q_ABOVECTE)}
<p>Result:</p>${pre(`name | total
Ravi | 600
Meena | 500`)}
<p><b>Why:</b> totals are 350, 600, 500; the average of those is 483.33. Averaging the totals (not the raw order amounts) is the key: an average of order amounts would be a different number. Stating the definition ("average among customers who ordered") aloud matters; if John and Sara count as zero-spend customers the average drops to 290 and Asha would also qualify. Always clarify the population.</p>`,
  run: Q_ABOVECTE, lvl: 'M', freq: 2,
  follow: ['What changes if customers with no orders count as zero?', 'Write it with a scalar subquery instead of a CTE.'],
  mistake: 'Averaging the individual order amounts instead of the per-customer totals, and not stating who is included.',
  tags: ['cte', 'aggregation'] },

/* ================= WINDOW FUNCTIONS ================= */
{ q: 'What is a window function, and how is it different from GROUP BY?',
  short: 'GROUP BY collapses many rows into one row per group. A window function computes over a set of related rows but keeps every original row, so I can show the detail and the group total side by side.',
  a: `${pre(Q_WINAGG)}
<p>Result:</p>${pre(`name | dept | salary | dept_total
Anil | IT | 90000 | 230000
Bina | IT | 70000 | 230000
Chetan | IT | 70000 | 230000
Divya | HR | 50000 | 110000
Esha | HR | 60000 | 110000
Farhan | Sales | 40000 | 150000
Gita | Sales | 55000 | 150000
Hari | Sales | 55000 | 150000`)}
<p>All 8 rows stay. With GROUP BY dept you would get only 3 rows and lose the names.</p>
<p><b>Parts of OVER():</b> <code>PARTITION BY</code> = which group of rows to look at (optional; none means the whole table), <code>ORDER BY</code> = the order inside the group (needed for ranking, LAG, running totals), and a <b>frame</b> (<code>ROWS BETWEEN ...</code>) = which neighbouring rows to include. Window functions run in the SELECT step, so to filter on one, wrap the query in a subquery or CTE.</p>`,
  run: Q_WINAGG, lvl: 'E', freq: 3,
  follow: ['Can you use a window function in WHERE?', 'What does PARTITION BY do?'],
  mistake: 'Trying to filter on a window function in the same query level\'s WHERE clause.',
  tags: ['window'] },

{ q: 'Explain ROW_NUMBER, RANK and DENSE_RANK with an example that has ties.',
  short: 'All three number rows by an ORDER BY. ROW_NUMBER is always unique (1,2,3). RANK gives ties the same number and then skips (1,2,2,4). DENSE_RANK gives ties the same number and does not skip (1,2,2,3).',
  a: `${pre(Q_RANK)}
<p>Result:</p>${pre(`name | salary | rn | rnk | drnk
Anil | 90000 | 1 | 1 | 1
Bina | 70000 | 2 | 2 | 2
Chetan | 70000 | 3 | 2 | 2
Esha | 60000 | 4 | 4 | 3
Gita | 55000 | 5 | 5 | 4
Hari | 55000 | 6 | 5 | 4
Divya | 50000 | 7 | 7 | 5
Farhan | 40000 | 8 | 8 | 6`)}
<p><b>When to use which:</b> ROW_NUMBER to pick exactly one row per group (latest order, de-duplication). RANK when gaps are meaningful (sports rank). DENSE_RANK for "Nth highest" and "top N including ties".</p>
<p><b>Careful:</b> if two rows tie on the ORDER BY, ROW_NUMBER picks one of them arbitrarily. Add a tie-breaker column (here <code>name</code>) so the result is repeatable.</p>`,
  run: Q_RANK, lvl: 'E', freq: 3,
  follow: ['Which one would you use for the top 3 salaries including ties?', 'What does ROW_NUMBER do with ties?'],
  mistake: 'Not knowing that RANK skips numbers after a tie, or relying on ROW_NUMBER with ties and no tie-breaker.',
  tags: ['window', 'ranking'] },

{ q: 'Top 2 earners in each department (top-N per group). What happens with ties?',
  short: 'Rank inside each department with a window function PARTITION BY dept ORDER BY salary DESC, then filter rank less than or equal to 2 in an outer query. DENSE_RANK keeps ties; ROW_NUMBER returns exactly 2 rows per department.',
  a: `${pre(Q_TOPN)}
<p>Result:</p>${pre(`dept | name | salary | rnk
HR | Esha | 60000 | 1
HR | Divya | 50000 | 2
IT | Anil | 90000 | 1
IT | Bina | 70000 | 2
IT | Chetan | 70000 | 2
Sales | Gita | 55000 | 1
Sales | Hari | 55000 | 1
Sales | Farhan | 40000 | 2`)}
<p><b>Why 8 rows:</b> IT has a tie at 70000 and Sales has a tie at 55000, so both tied people appear and the next distinct salary is rank 2. With ROW_NUMBER you would get exactly 6 rows, but which tied person is shown would be arbitrary. Ask the interviewer: "do you want ties included?" That one question shows maturity.</p>
<p>We need the outer query because the rank is computed in SELECT and WHERE cannot see it yet. Some databases offer <code>QUALIFY</code> (Snowflake, BigQuery) to filter directly.</p>`,
  run: Q_TOPN, lvl: 'M', freq: 3,
  follow: ['Make it exactly 2 per department.', 'How is this different from the overall top 2?'],
  mistake: 'Using LIMIT 2, which gives the top 2 of the whole table, not 2 per group.',
  tags: ['window', 'ranking', 'top-n'] },

{ q: 'Get the latest order for each customer.',
  short: 'Number each customer\'s orders newest first with ROW_NUMBER PARTITION BY customer ORDER BY date DESC, and keep row number 1. Add a tie-breaker such as order_id so the result is deterministic.',
  a: `${pre(Q_LATEST)}
<p>Result:</p>${pre(`customer_id | order_id | order_date | amount
1 | 102 | 2024-01-20 | 100
2 | 107 | 2024-03-20 | 200
3 | 106 | 2024-03-15 | 50`)}
<p><b>Why ROW_NUMBER:</b> we want exactly one row per customer; if a customer had two orders on the same day, RANK would return both. The NULL-customer guest order is filtered out first, otherwise all guest orders would form one "customer" group. A join alternative: join orders to <code>SELECT customer_id, MAX(order_date)</code>, but that returns two rows when two orders share the max date.</p>`,
  run: Q_LATEST, lvl: 'M', freq: 3,
  follow: ['What if two orders are on the same date?', 'Get the first order instead.'],
  mistake: 'Using GROUP BY with MAX(date) and then selecting other columns, which gives wrong or invalid results.',
  tags: ['window', 'top-n', 'dedupe'] },

{ q: 'Calculate a running total of order amounts by date.',
  short: 'SUM(amount) OVER (ORDER BY order_date) with a frame from UNBOUNDED PRECEDING to CURRENT ROW. I add a tie-breaker and an explicit ROWS frame so rows on the same date do not jump together.',
  a: `${pre(Q_RUN)}
<p>Result:</p>${pre(`order_id | order_date | amount | running_total
101 | 2024-01-05 | 250 | 250
102 | 2024-01-20 | 100 | 350
103 | 2024-02-02 | 400 | 750
104 | 2024-02-14 | 150 | 900
105 | 2024-03-01 | 300 | 1200
106 | 2024-03-15 | 50 | 1250
107 | 2024-03-20 | 200 | 1450
108 | 2024-04-02 | 80 | 1530`)}
<p><b>Why the explicit frame:</b> when you write only <code>ORDER BY</code>, the default frame is <code>RANGE ... CURRENT ROW</code>, which treats rows with the same date as peers and gives all of them the same total. <code>ROWS</code> counts physical rows, so each row adds its own amount. Add <code>PARTITION BY customer_id</code> to restart the total for each customer. The last value, 1530, equals the plain sum, which is a good sanity check.</p>`,
  run: Q_RUN, lvl: 'M', freq: 3,
  follow: ['Restart the running total for each customer.', 'What is the difference between ROWS and RANGE?'],
  mistake: 'Leaving the default RANGE frame, so ties on the date all show the same running total.',
  tags: ['window', 'running-total'] },

{ q: 'Month-over-month revenue growth percent.',
  short: 'Aggregate to one row per month, then use LAG(revenue) to fetch the previous month, and compute (this - last) / last x 100. Wrap the divisor in NULLIF to avoid dividing by zero; the first month is NULL because it has no previous month.',
  a: `${pre(Q_MOM)}
<p>Result:</p>${pre(`month | revenue | prev_revenue | mom_pct
2024-01 | 350 | NULL | NULL
2024-02 | 550 | 350 | 57.1
2024-03 | 550 | 550 | 0.0
2024-04 | 80 | 550 | -85.5`)}
<p><b>Why:</b> LAG looks one row back in the ORDER BY order, so you must group first, otherwise it compares one order to the previous order. The <code>100.0</code> forces decimal division (integer / integer truncates in PostgreSQL and SQL Server). <code>NULLIF(x, 0)</code> turns a zero divisor into NULL instead of an error. LAG(col, 1, default) can give a default for the first row. Gaps matter: if a month has no sales it is missing, and LAG will compare to the earlier month; fill the gap with a calendar table if needed. PostgreSQL: use <code>DATE_TRUNC('month', order_date)</code> in the CTE.</p>`,
  run: Q_MOM, lvl: 'M', freq: 3,
  follow: ['What does LEAD do?', 'How do you compare with the same month last year?'],
  mistake: 'Using integer division (percent shows 0) or applying LAG before aggregating to months.',
  tags: ['window', 'lag', 'dates'] },

{ q: 'Calculate a 3-order moving average of the order amount.',
  short: 'AVG(amount) OVER (ORDER BY date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW): the current row plus the two before it. The first rows average fewer rows because the window is not full yet.',
  a: `${pre(Q_MA)}
<p>Result:</p>${pre(`order_id | order_date | amount | ma3
101 | 2024-01-05 | 250 | 250.0
102 | 2024-01-20 | 100 | 175.0
103 | 2024-02-02 | 400 | 250.0
104 | 2024-02-14 | 150 | 216.67
105 | 2024-03-01 | 300 | 283.33
106 | 2024-03-15 | 50 | 166.67
107 | 2024-03-20 | 200 | 183.33
108 | 2024-04-02 | 80 | 110.0`)}
<p><b>Why:</b> row 104 averages 100, 400, 150 = 216.67. Rows 101 and 102 have only 1 and 2 rows in the window; say that out loud, and if the interviewer wants only full windows, set the value to NULL for the first rows. <b>ROWS vs calendar days:</b> a "7-day average" is only equal to <code>ROWS BETWEEN 6 PRECEDING</code> if there is exactly one row per day with no gaps. For real daily data with missing days, build a complete date list first or use <code>RANGE BETWEEN INTERVAL '6 days' PRECEDING AND CURRENT ROW</code> (PostgreSQL).</p>`,
  run: Q_MA, lvl: 'M', freq: 2,
  follow: ['What if some days have no data?', 'How do you make the first rows NULL?'],
  mistake: 'Assuming 6 PRECEDING means 7 calendar days even when days are missing.',
  tags: ['window', 'moving-average'] },

{ q: 'Show each department\'s share of total salary as a percentage.',
  short: 'Group by department to get each total, then divide by the grand total, which I get with SUM(SUM(salary)) OVER (). Multiply by 100.0 to avoid integer division.',
  a: `${pre(Q_PCT)}
<p>Result:</p>${pre(`dept | dept_salary | pct
HR | 110000 | 22.4
IT | 230000 | 46.9
Sales | 150000 | 30.6`)}
<p><b>Why it works:</b> GROUP BY runs first and makes 3 rows. The window function then sums those 3 department totals across all rows (empty OVER means one big window) to get 490000. 230000 / 490000 = 46.9%. The inner SUM is the group aggregate, the outer SUM is the window aggregate; this is allowed because window functions run after grouping. The percentages add up to 100 (rounding aside), a handy check.</p>`,
  run: Q_PCT, lvl: 'M', freq: 3,
  follow: ['Share of each employee within their own department?', 'Why multiply by 100.0 and not 100?'],
  mistake: 'Integer division giving 0, or computing the total with a separate wrong-grain subquery.',
  tags: ['window', 'aggregation', 'percent'] },

{ q: 'Split employees into 4 equal salary groups (quartiles). How does NTILE handle ties and uneven counts?',
  short: 'NTILE(4) OVER (ORDER BY salary DESC) deals rows into 4 buckets of nearly equal size, bucket 1 being the highest. It ignores ties, so equal salaries can land in different buckets, and when rows do not divide evenly the first buckets get one extra row.',
  a: `${pre(Q_NTILE)}
<p>Result:</p>${pre(`name | salary | quartile
Anil | 90000 | 1
Bina | 70000 | 1
Chetan | 70000 | 2
Esha | 60000 | 2
Gita | 55000 | 3
Hari | 55000 | 3
Divya | 50000 | 4
Farhan | 40000 | 4`)}
<p><b>Why:</b> 8 rows into 4 buckets = 2 each. Notice Bina and Chetan both earn 70000 but sit in buckets 1 and 2; the tie-breaker (name) decided that. If you need equal values to share a bucket, use <code>PERCENT_RANK()</code> or <code>CUME_DIST()</code> and cut by percentage. With 10 rows and NTILE(4) the buckets would hold 3,3,2,2. Common use: RFM scoring, top 25% of customers.</p>`,
  run: Q_NTILE, lvl: 'M', freq: 2,
  follow: ['How would you keep ties in the same bucket?', 'What would NTILE(3) do on 8 rows?'],
  mistake: 'Believing NTILE puts equal values in the same bucket; it does not.',
  tags: ['window', 'ntile'] },

{ q: 'For each customer, how many days passed between consecutive orders?',
  short: 'Use LAG(order_date) partitioned by customer and ordered by date to fetch the previous order date, then subtract it from the current one. The first order of each customer has no previous date so the result is NULL.',
  a: `${pre(Q_GAP)}
<p>Result:</p>${pre(`customer_id | order_id | order_date | days_since_prev
1 | 101 | 2024-01-05 | NULL
1 | 102 | 2024-01-20 | 15
2 | 103 | 2024-02-02 | NULL
2 | 107 | 2024-03-20 | 47
3 | 104 | 2024-02-14 | NULL
3 | 105 | 2024-03-01 | 16
3 | 106 | 2024-03-15 | 14`)}
<p><b>Why PARTITION BY:</b> without it LAG would take the previous row of another customer. <b>Dialects:</b> SQLite has no date subtraction, so we use julianday. In PostgreSQL, <code>date - date</code> already returns days: <code>order_date - LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date)</code>. MySQL and SQL Server use <code>DATEDIFF</code>. 2024 is a leap year, so Feb 14 to Mar 1 is 16 days, a good detail to show you checked.</p>`,
  run: Q_GAP, lvl: 'H', freq: 2,
  follow: ['Average days between orders per customer?', 'Use LEAD to find the days until the next order.'],
  mistake: 'Forgetting PARTITION BY, so the first order of one customer is compared with the last order of another.',
  tags: ['window', 'lag', 'dates'] },

{ q: 'Which customers account for the first 75% of revenue? (cumulative percent / Pareto)',
  short: 'Total per customer, then a running sum ordered by total descending, divided by the grand total (SUM over an empty OVER). Customers up to the point where the running percent reaches the target form the top group.',
  a: `${pre(Q_PARETO)}
<p>Result:</p>${pre(`customer_id | total | running | cum_pct
2 | 600 | 600 | 41.4
3 | 500 | 1100 | 75.9
1 | 350 | 1450 | 100.0`)}
<p><b>Why:</b> two windows over the same 3 rows: an ordered one for the running sum and an empty OVER for the grand total, 1450. To pick "the customers that make up 75%", keep rows where the <i>previous</i> running percent is below 75, i.e. <code>cum_pct - 100.0 * total / grand_total &lt; 75</code>; here that keeps customers 2 and 3 (customer 3 crosses 75). Say the definition aloud: some people include the customer who crosses the line, some stop before it. The guest order 108 is excluded because it has no customer.</p>`,
  run: Q_PARETO, lvl: 'H', freq: 1,
  follow: ['Keep only customers needed to reach 75%.', 'How is this different from NTILE?'],
  mistake: 'Dividing by the wrong total (a filtered one), or not stating whether the crossing customer is included.',
  tags: ['window', 'running-total', 'percent'] },

/* ================= PATTERNS ================= */
{ q: 'Find consecutive login streaks per user (gaps and islands).',
  short: 'Remove duplicate dates, number each user\'s dates with ROW_NUMBER, and subtract that number (as days) from the date. Dates in the same unbroken streak give the same result, so grouping by it gives one row per streak.',
  a: `${pre(Q_ISLAND)}
<p>Result:</p>${pre(`user_id | streak_start | streak_end | days
1 | 2024-03-01 | 2024-03-03 | 3
1 | 2024-03-05 | 2024-03-06 | 2
1 | 2024-03-10 | 2024-03-10 | 1
2 | 2024-03-01 | 2024-03-02 | 2`)}
<p><b>The trick:</b> for user 1 the dates 1, 2, 3 have row numbers 1, 2, 3, so date minus row number is always Feb 29 (same group). The date 5 has row number 4, giving Mar 1: a new group, because the gap broke the pattern. To find users with a streak of at least 3 days, add <code>HAVING COUNT(*) &gt;= 3</code> and select the distinct user_id; that returns user 1.</p>
<p><b>Why DISTINCT first:</b> two logins on one day would add a row number without advancing the date and break the trick. <b>PostgreSQL:</b> <code>login_date - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date))::int AS grp</code>. Alternative: LAG to flag where the gap is more than 1 day, then a running SUM of the flags to number the streaks.</p>`,
  run: Q_ISLAND, lvl: 'H', freq: 2,
  follow: ['Return only users with a streak of 3 or more days.', 'What changes if a user can log in twice a day?'],
  mistake: 'Forgetting to de-duplicate dates first, which breaks the date-minus-row-number trick.',
  tags: ['window', 'gaps-islands', 'dates'] },

{ q: 'Calculate month-1 customer retention by first-order month (cohort analysis).',
  short: 'Find each customer\'s first order month, which is their cohort. Then count how many of them also ordered in the very next month, and divide by the cohort size. Keep each step in a CTE.',
  a: `<p><b>Approach:</b> 1) one row per customer per month (<code>m</code>), 2) first month per customer (<code>f</code>), 3) LEFT JOIN <code>m</code> again for first month + 1, 4) count cohort size and retained customers. Months are turned into a single number (year x 12 + month) so that "next month" is simply +1, even across December.</p>${pre(Q_COHORT)}
<p>Result:</p>${pre(`cohort_year | cohort_month | cohort_size | retained_m1
2024 | 1 | 1 | 0
2024 | 2 | 2 | 2`)}
<p><b>Reading it:</b> the Jan-2024 cohort is Asha only, and she did not order in February: retention 0%. The Feb cohort is Ravi and Meena; both ordered in March: 100%. Retention % = <code>100.0 * retained_m1 / cohort_size</code>. Use LEFT JOIN so cohorts with zero retained customers still show. COUNT(DISTINCT) protects against double counting.</p>
<p><b>Dialects:</b> SQLite strftime is used above. PostgreSQL: <code>EXTRACT(YEAR FROM order_date) * 12 + EXTRACT(MONTH FROM order_date)</code>, or <code>DATE_TRUNC('month', ...)</code> with <code>+ INTERVAL '1 month'</code>. With a tiny table the numbers look trivial, but the pattern is the point; on real data you add one retained column per month offset.</p>`,
  run: Q_COHORT, lvl: 'H', freq: 2,
  follow: ['How would you extend it to months 1, 2 and 3?', 'Retention vs churn?'],
  mistake: 'Defining the cohort by calendar month of any order instead of the customer\'s first order, or double-counting customers with several orders in a month.',
  tags: ['cohort', 'retention', 'cte'] },

{ q: 'Find the median salary.',
  short: 'Most databases have no simple MEDIAN. Number the sorted salaries with ROW_NUMBER, count the rows, and average the middle one or two rows. PostgreSQL also has PERCENTILE_CONT(0.5).',
  a: `${pre(Q_MEDIAN)}
<p>Result:</p>${pre(`median_salary
57500.0`)}
<p><b>Why:</b> sorted salaries are 40000, 50000, 55000, 55000, 60000, 70000, 70000, 90000 (n = 8). For an even n the median is the average of rows 4 and 5, which is (55000 + 60000) / 2 = 57500. The expression <code>(n+1)/2</code> and <code>(n+2)/2</code> uses integer division: for n = 8 it picks rows 4 and 5; for n = 7 it picks rows 4 and 4, the single middle row. So one formula handles both even and odd counts.</p>
<p><b>PostgreSQL / Oracle / Snowflake:</b> <code>SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary) FROM employees;</code>. Why median over mean: one very high salary (90000) pulls the mean up (61250) but barely moves the median. Good to say when asked about skewed data.</p>`,
  run: Q_MEDIAN, lvl: 'H', freq: 2,
  follow: ['Median per department?', 'When would you report median instead of mean?'],
  mistake: 'Picking only one middle row for an even number of rows, or using AVG and calling it the median.',
  tags: ['window', 'statistics'] },

{ q: 'Show each employee\'s level in the reporting hierarchy (recursive CTE).',
  short: 'A recursive CTE has an anchor query for the top person (no manager) and a recursive part that joins employees to the rows found so far, adding 1 to the level each time. It stops when no new rows are found.',
  a: `${pre(Q_REC)}
<p>Result:</p>${pre(`emp_id | name | level
1 | Anil | 0
2 | Bina | 1
3 | Chetan | 1
4 | Divya | 1
6 | Farhan | 1
5 | Esha | 2
7 | Gita | 2
8 | Hari | 2`)}
<p><b>How it works:</b> the anchor returns Anil at level 0. Round one finds everyone whose manager is already in the result (Bina, Chetan, Divya, Farhan) at level 1; round two finds Esha (under Divya) and Gita and Hari (under Farhan) at level 2; round three finds nobody, so it ends. <b>Dialect:</b> PostgreSQL, MySQL and SQLite need the word RECURSIVE; SQL Server and Oracle do not. If the data has a loop (A manages B manages A) the query never stops, so add a depth limit such as <code>WHERE o.level &lt; 10</code>. Same pattern: category trees, bill of materials, date series.</p>`,
  run: Q_REC, lvl: 'H', freq: 1,
  follow: ['How would you show the full chain "Anil > Divya > Esha" as text?', 'How do you protect against infinite loops?'],
  mistake: 'Forgetting the anchor member or having no stopping condition when the data contains a loop.',
  tags: ['cte', 'recursive', 'hierarchy'] },

/* ================= DESIGN / THEORY ================= */
{ q: 'What is an index? What are the trade-offs?',
  short: 'An index is a separate sorted structure, usually a B-tree, that lets the database find rows without scanning the whole table. It speeds up WHERE, JOIN and ORDER BY on the indexed columns, but costs storage and slows down INSERT, UPDATE and DELETE.',
  a: `<p><b>Idea:</b> like the index at the back of a book. Instead of reading every page (a full table scan) the database jumps to the right place.</p>${pre(`CREATE INDEX idx_orders_customer ON orders (customer_id);
-- helps: WHERE customer_id = 3, JOIN ... ON o.customer_id = c.customer_id`)}
<ul><li><b>Good candidates:</b> columns used in joins and WHERE, with many different values (high selectivity). Primary keys are indexed automatically.</li>
<li><b>Poor candidates:</b> columns with few values (a yes/no flag), tiny tables, columns changed constantly.</li>
<li><b>Cost:</b> disk space and every write must also update the index.</li>
<li><b>Composite index</b> (a, b) helps filters on a, or on a and b, but generally not on b alone (leftmost-prefix rule).</li>
<li><b>Index killers:</b> wrapping the column in a function (<code>WHERE YEAR(order_date) = 2024</code>, <code>LOWER(email) = ...</code>) or a leading wildcard (<code>LIKE '%son'</code>) usually prevents index use. Rewrite as a range: <code>order_date &gt;= '2024-01-01' AND order_date &lt; '2025-01-01'</code>.</li>
<li><b>Clustered vs non-clustered:</b> a clustered index decides the physical row order (one per table); non-clustered ones are separate lookups.</li></ul>`,
  lvl: 'E', freq: 3,
  follow: ['Why can a function on a column stop the index being used?', 'What is a composite index and does column order matter?'],
  mistake: 'Saying "add an index on every column"; indexes slow writes and use space.',
  tags: ['performance', 'index', 'theory'] },

{ q: 'A query is slow. How do you investigate and speed it up?',
  short: 'I read the execution plan (EXPLAIN) to see scans, joins and row estimates, then fix the biggest cost: filter early, select only needed columns, index the join and filter columns, avoid functions on indexed columns, and check for accidental row multiplication.',
  a: `<p><b>My checklist, in order:</b></p>
<ol><li><b>Run EXPLAIN (or EXPLAIN ANALYZE).</b> Look for full table scans on big tables, large row estimates, and expensive sorts or joins.</li>
<li><b>Reduce the data early:</b> WHERE before joining, SELECT only the columns you need (not <code>SELECT *</code>), filter on a date range.</li>
<li><b>Indexes</b> on join keys and filter columns; do not wrap those columns in functions.</li>
<li><b>Check the joins:</b> duplicate keys multiply rows; make sure every join has a condition.</li>
<li><b>Rewrite patterns:</b> UNION ALL instead of UNION when possible; EXISTS instead of a huge IN; pre-aggregate before joining; replace correlated subqueries with a join or window function.</li>
<li><b>Statistics and data size:</b> stale statistics can pick a bad plan; consider summary tables for dashboards.</li></ol>
<p><b>Why this order:</b> measure first, do not guess. In an entry-level interview it is enough to name EXPLAIN, indexes, early filtering and avoiding SELECT *, and to say you would test the change on a copy and compare timings.</p>`,
  lvl: 'M', freq: 2,
  follow: ['What does a "full table scan" mean in the plan?', 'Why is SELECT * discouraged?'],
  mistake: 'Answering "add an index" without looking at the plan or checking whether the query is returning too many rows.',
  tags: ['performance', 'theory'] },

{ q: 'What is normalization? Explain 1NF, 2NF and 3NF with a simple example.',
  short: 'Normalization organises data so each fact is stored once, which avoids update, insert and delete problems. 1NF: one value per cell. 2NF: every non-key column depends on the whole key. 3NF: non-key columns depend only on the key, not on each other.',
  a: `<p><b>Bad table:</b> <code>orders(order_id, customer_name, customer_city, items)</code> where items holds 'Pen, Mouse'.</p>
<ul><li><b>1NF:</b> each cell holds one atomic value and no repeating groups. Split items into rows (the <code>order_items</code> table).</li>
<li><b>2NF:</b> (needs 1NF) with a composite key like (order_id, product_id), a column such as product_name depends only on product_id, a part of the key. Move it to <code>products</code>.</li>
<li><b>3NF:</b> (needs 2NF) no transitive dependency: if customer_city depends on customer_name and not on the order, move the customer columns to <code>customers</code>. Non-key columns must depend on "the key, the whole key and nothing but the key".</li></ul>
<p><b>Benefit:</b> change a customer's city in one place. <b>Cost:</b> more joins. That is why reporting layers often <b>denormalise</b> on purpose (wide tables, star schemas) while source systems stay normalised. The practice schema in this site (customers, orders, order_items, products) is already roughly 3NF.</p>`,
  lvl: 'M', freq: 2,
  follow: ['When would you denormalise on purpose?', 'What is a transitive dependency?'],
  mistake: 'Reciting the definitions without a concrete example, or saying denormalised data is always wrong.',
  tags: ['design', 'theory', 'normalization'] },

{ q: 'What are fact and dimension tables, and what is a star schema? How does OLTP differ from OLAP?',
  short: 'A fact table stores measurable events (orders, sales) with numbers and foreign keys. Dimension tables describe them (customer, product, date). A star schema is one fact table surrounded by dimensions. OLTP systems run daily transactions; OLAP systems are built for analysis.',
  a: `<ul><li><b>Fact table:</b> one row per event at a chosen grain, for example one row per order line (<code>order_items</code>: qty, plus keys to order and product). Holds measures you sum or count.</li>
<li><b>Dimension table:</b> descriptive attributes you slice by: <code>customers</code> (city), <code>products</code> (category), a date table (month, quarter).</li>
<li><b>Star schema:</b> the fact table in the middle joined directly to the dimensions: simple, fast joins, easy for BI tools. A <b>snowflake</b> schema normalises the dimensions further (more joins, less duplication).</li>
<li><b>Grain:</b> decide it first ("one row per order line"). Mixing grains in one table is the classic cause of wrong totals (see the join fan-out question).</li></ul>
<p><b>OLTP vs OLAP:</b> OLTP (the app database): many small inserts and updates, normalised, row-oriented, current data. OLAP (the warehouse): few big read queries, denormalised star schemas, columnar storage, history. As an analyst you mostly query OLAP, and you should avoid heavy queries on the OLTP system.</p>`,
  lvl: 'E', freq: 2,
  follow: ['What is the grain of a fact table?', 'Why is a date dimension useful?'],
  mistake: 'Not being able to say what one row of the fact table represents (the grain).',
  tags: ['design', 'warehouse', 'theory'] }

]};
})();
