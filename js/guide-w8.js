/* Week 8 guide: Project 2 (Olist E-commerce) + Resume + first applications */
GUIDES[8] = {
  intro: `<p><b>Why this week matters.</b> Project 2 is your proof that you can handle a real multi-table business dataset with SQL and Power BI. Interviewers often spend half the technical round on one project. The resume and applications at the end make sure the work gets seen. <b>You do not need to feel ready to apply.</b> Interviews are also practice.</p>
<p><b>By Sunday you will have:</b> the Olist dataset in PostgreSQL, 8 business questions answered with SQL, a star-schema Power BI model with DAX measures, a 2-3 page dashboard with drill-through, a README on GitHub, Resume v1, an updated LinkedIn profile and 5 job applications sent.</p>
<p><b>Time split:</b> Mon-Fri 1.5 h each. Saturday 3.5 h (insights + README + GitHub). Sunday 3.5 h (resume, LinkedIn, applications).</p>
<p><b>Dataset note.</b> Olist is a Brazilian marketplace dataset on Kaggle (link on the Resources page). Product category names are in Portuguese. Order data is from about 2016 to 2018, and the first and last months are partial. Your exact numbers may differ from any numbers written here: always trust your own query output and check it with a quick count.</p>
<p><b>Tables we use:</b> orders(order_id, customer_id, order_status, order_purchase_timestamp, order_delivered_customer_date, order_estimated_delivery_date), order_items(order_id, order_item_id, product_id, seller_id, price, freight_value), order_payments(order_id, payment_type, payment_installments, payment_value), order_reviews(order_id, review_score), customers(customer_id, customer_unique_id, customer_city, customer_state), products(product_id, product_category_name). These tables have more columns, but we only use these.</p>`,
  days: [
    /* ---------------- MON ---------------- */
    {
      title: 'Project 2 setup: load Olist and define 8 questions',
      time: '1.5 h',
      study: [
        'The dataset is a relational model: one row in orders can have many rows in order_items, order_payments and (sometimes) order_reviews.',
        'customer_id changes for every order. customer_unique_id identifies the real person. To count repeat buyers you MUST use customer_unique_id.',
        'Fan-out: if you join orders to order_items and to order_payments in one query, rows multiply and revenue is counted too many times. Aggregate each table to one row per order first, then join.',
        'Revenue choice: use SUM(price) from order_items for product revenue (GMV). Freight is separate. State your definition in the README.',
        'Only some orders are delivered. Decide a rule (for example order_status = \'delivered\') and use it consistently.',
        'A good project starts with business questions, not with queries. Each question needs a metric, a table and an output (chart or number).',
        'Data checks before analysis: row counts, duplicates, NULLs, min and max dates.'
      ],
      how: [
        '[10 min] Download the Olist dataset from Kaggle (see Resources, the free Kaggle account is needed). Unzip into a folder such as C:\\olist\\. You will see 9 CSV files.',
        '[10 min] Install PostgreSQL if you do not have it. In pgAdmin create a new database named olist.',
        '[20 min] Load all CSV files using the Python script in the example (it creates tables with the right columns automatically). Install the libraries first: pip install pandas sqlalchemy psycopg2-binary.',
        '[10 min] In pgAdmin Query Tool run the sanity checks from the example. Compare counts with the expected approximate counts.',
        '[25 min] Write your 8 business questions in a README draft (see example list). For each, note the metric and the tables.',
        '[10 min] Create the GitHub repo olist-ecommerce-analysis with folders sql/, powerbi/, images/ and a README.md. Commit the question list.',
        '[5 min] Tick the first task. Do not start analysis today.'
      ],
      example: `<p><b>Load script</b> (save as load_olist.py in the same folder as the CSVs, then run <code>python load_olist.py</code>). Replace YOUR_PASSWORD. It creates one table per file. We rename tables to short names:</p>
${pre(`import pandas as pd
from sqlalchemy import create_engine

engine = create_engine("postgresql+psycopg2://postgres:YOUR_PASSWORD@localhost:5432/olist")

files = {
    "orders": "olist_orders_dataset.csv",
    "order_items": "olist_order_items_dataset.csv",
    "order_payments": "olist_order_payments_dataset.csv",
    "order_reviews": "olist_order_reviews_dataset.csv",
    "customers": "olist_customers_dataset.csv",
    "products": "olist_products_dataset.csv",
    "sellers": "olist_sellers_dataset.csv",
    "category_translation": "product_category_name_translation.csv",
}

for table, f in files.items():
    df = pd.read_csv(f)
    if table == "orders":
        for c in ["order_purchase_timestamp", "order_delivered_customer_date",
                  "order_estimated_delivery_date"]:
            df[c] = pd.to_datetime(df[c])
    df.to_sql(table, engine, if_exists="replace", index=False)
    print(table, len(df))`)}
<p>Line by line: <code>files</code> maps table name to file name. The loop reads each CSV into a DataFrame. For orders, we convert 3 text columns to real timestamps so DATE_TRUNC works. <code>to_sql</code> creates the table and inserts all rows. The geolocation file is skipped because we do not need it.</p>
<p><b>Sanity checks</b> (run in pgAdmin):</p>
${pre(`SELECT 'orders' AS tbl, COUNT(*) FROM orders
UNION ALL SELECT 'order_items', COUNT(*) FROM order_items
UNION ALL SELECT 'order_payments', COUNT(*) FROM order_payments
UNION ALL SELECT 'order_reviews', COUNT(*) FROM order_reviews
UNION ALL SELECT 'customers', COUNT(*) FROM customers
UNION ALL SELECT 'products', COUNT(*) FROM products;
-- expected roughly: 99k orders, 112k items, 104k payments, 99k reviews, 99k customers, 33k products

SELECT order_status, COUNT(*) AS orders
FROM orders
GROUP BY order_status
ORDER BY orders DESC;
-- 'delivered' should be about 97% of orders

SELECT MIN(order_purchase_timestamp), MAX(order_purchase_timestamp) FROM orders;

-- check: one customer_id per order, but many orders per customer_unique_id?
SELECT COUNT(*) AS customer_ids, COUNT(DISTINCT customer_unique_id) AS real_people
FROM customers;
-- real_people is smaller than customer_ids (about 96k vs 99k)`)}
<p><b>Sample 8 business questions</b> (copy and adjust):</p>
${pre(`1. How did monthly revenue and orders trend? (growth, seasonality)
2. Which product categories earn the most revenue?
3. What share of delivered orders arrived later than the estimated date?
4. Does late delivery lower the review score?
5. How do customers pay (payment type mix, instalments)?
6. What percent of customers buy more than once (repeat rate)?
7. How does retention look by monthly cohort?
8. Which customer segments (RFM) matter most and what should the business do?`)}`,
      practice: [
        ['Write a query to count orders per status and show the percent of total.', `${pre(`SELECT order_status,
       COUNT(*) AS orders,
       ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS pct
FROM orders
GROUP BY order_status
ORDER BY orders DESC;`)}<p>COUNT(*) is the per-group count; SUM(COUNT(*)) OVER () adds all group counts to get the grand total.</p>`],
        ['Why do orders and customers join on customer_id but repeat analysis uses customer_unique_id? Show the query that proves they differ.', `${pre(`SELECT COUNT(DISTINCT customer_id)        AS customer_ids,
       COUNT(DISTINCT customer_unique_id) AS real_people
FROM customers;`)}<p>customer_id is created per order, so it is almost always unique. customer_unique_id is the same person across orders. Repeat buyers can only be seen with customer_unique_id.</p>`],
        ['Check if order_items has duplicate (order_id, order_item_id) rows.', `${pre(`SELECT order_id, order_item_id, COUNT(*)
FROM order_items
GROUP BY order_id, order_item_id
HAVING COUNT(*) > 1;`)}<p>Zero rows means the pair is a unique key. We expect zero.</p>`],
        ['Find how many orders have more than one payment row, and why this matters for joins.', `${pre(`SELECT COUNT(*) AS orders_with_multiple_payment_rows
FROM (
  SELECT order_id
  FROM order_payments
  GROUP BY order_id
  HAVING COUNT(*) > 1
) t;`)}<p>If you join order_items to order_payments directly, those orders appear several times and revenue is overstated. Aggregate payments per order first.</p>`],
        ['Show revenue (item price) and amount paid side by side for each delivered order, without double counting. Why is a direct join of order_items to order_payments wrong?', `${pre(`SELECT i.order_id, i.revenue, p.paid
FROM (SELECT order_id, SUM(price) AS revenue FROM order_items GROUP BY order_id) i
JOIN (SELECT order_id, SUM(payment_value) AS paid FROM order_payments GROUP BY order_id) p
  ON p.order_id = i.order_id
JOIN orders o ON o.order_id = i.order_id
WHERE o.order_status = 'delivered';`)}<p>Each side is first reduced to one row per order, so the join is one-to-one. If you join order_items (2 rows for an order) straight to order_payments (3 rows for the same order), that order becomes 2 x 3 = 6 rows and SUM(price) is 3 times too big. Paid can exceed revenue because it includes freight (and instalment interest).</p>`],
        ['Count NULL delivered dates by order status.', `${pre(`SELECT order_status,
       COUNT(*) AS orders,
       COUNT(*) FILTER (WHERE order_delivered_customer_date IS NULL) AS no_delivery_date
FROM orders
GROUP BY order_status
ORDER BY orders DESC;`)}<p>Delivered orders should have almost no NULLs; cancelled or shipped orders will. This tells you why you filter by status.</p>`]
      ],
      important: [
        ['Tell me about your Olist project in 30 seconds.', `<p>It is a Brazilian marketplace dataset with about 100,000 orders over 2016-2018 across 8 related tables. I loaded it into PostgreSQL, wrote SQL for revenue trend, categories, delivery delays, repeat rate, cohort retention and RFM, then built a Power BI star-schema dashboard. The key finding was that late deliveries are linked with lower review scores, and the repeat purchase rate is very low, which suggests a retention opportunity.</p>`],
        ['What data quality issues did you check before analysis?', `<p>I checked row counts, duplicate keys, NULLs in delivery dates by order status, and date ranges, because the first and last months are partial. I noticed customer_id is unique per order, so I used customer_unique_id for people. I also noticed multiple payment and review rows per order, so I aggregated them before joining to avoid double counting.</p>`],
        ['What is fan-out in a join and how do you prevent it?', `<p>It is when joining a table at order level to one at item or payment level repeats the order rows, so sums are inflated. I prevent it by aggregating the many-side table to the same grain first (a CTE with GROUP BY order_id) and then joining, and by checking that the row count before and after the join matches my expectation.</p>`]
      ],
      resources: [['Olist E-commerce', 'https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce'], ['GitHub', 'https://github.com'], ['DB Fiddle (run SQL online)', 'https://www.db-fiddle.com']],
      done: 'You are done when all tables are in PostgreSQL, your sanity-check counts look right, and 8 written business questions plus an empty GitHub repo exist.'
    },
    /* ---------------- TUE ---------------- */
    {
      title: 'SQL: revenue, categories, delivery delays, payment mix',
      time: '1.5 h',
      study: [
        'Monthly revenue: DATE_TRUNC(\'month\', timestamp) turns any date into the first day of its month, so you can GROUP BY month.',
        'Revenue = SUM(price) from order_items, joined to orders to get the date and status. Freight (freight_value) is shown separately.',
        'price columns loaded via pandas are floating-point. In PostgreSQL, ROUND(x, 2) needs numeric, so write ROUND(SUM(price)::numeric, 2).',
        'Categories are in Portuguese. Join to the translation table (category_translation) for English names, but first check its column names with SELECT * FROM category_translation LIMIT 5.',
        'A late delivery = the DATE of order_delivered_customer_date is later than the DATE of order_estimated_delivery_date. The estimate is stored at 00:00, so comparing raw timestamps would wrongly call a same-day afternoon delivery \'late\'; cast both to date.',
        'Delivery days = delivered date minus purchase date. In PostgreSQL subtracting two timestamps gives an interval, so use EXTRACT(EPOCH FROM (a - b)) / 86400 for days as a number.',
        'FILTER (WHERE ...) after an aggregate counts only some rows. It keeps late and total counts in one query.',
        'Window SUM() OVER () gives a grand total on every row, useful for percent-of-total.'
      ],
      how: [
        '[5 min] Create a file sql/02_basic_analysis.sql in your repo folder. Put a comment with the business question above every query.',
        '[15 min] Q1: monthly revenue and orders. Run it, then copy the result to Excel and make a line chart to see the trend. Note the partial months.',
        '[15 min] Q2: top categories by revenue. Run the Portuguese version first. Then run SELECT * FROM category_translation LIMIT 5 and use the English version.',
        '[20 min] Q3 and Q4: late delivery percent, average delivery days, and review score for late vs on-time orders.',
        '[10 min] Q5: payment mix.',
        '[15 min] For every query, write one sentence of insight with placeholders in your notes (for example "Late orders are X% and score Y vs Z").',
        '[10 min] Commit the SQL file to GitHub.'
      ],
      example: `<p><b>Q1. Monthly revenue and orders</b> (delivered orders only):</p>
${pre(`SELECT DATE_TRUNC('month', o.order_purchase_timestamp)::date AS month,
       COUNT(DISTINCT o.order_id)                AS orders,
       ROUND(SUM(oi.price)::numeric, 2)          AS revenue,
       ROUND((SUM(oi.price) / COUNT(DISTINCT o.order_id))::numeric, 2) AS aov
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
WHERE o.order_status = 'delivered'
GROUP BY 1
ORDER BY 1;`)}
<p>Reading: each row is a month with orders, revenue and AOV (average order value = revenue / orders). We count DISTINCT order_id because an order has several item rows. Expected shape: a few orders in late 2016, strong growth through 2017 with a spike around November, and a flatter 2018. The last months may be partial, so do not call the drop a trend before checking the dates.</p>
<p><b>Q2. Top 10 categories by revenue</b> (Portuguese names, always works):</p>
${pre(`SELECT p.product_category_name AS category,
       COUNT(DISTINCT oi.order_id)       AS orders,
       ROUND(SUM(oi.price)::numeric, 2)  AS revenue,
       ROUND((100.0 * SUM(oi.price) / SUM(SUM(oi.price)) OVER ())::numeric, 1) AS pct_of_revenue
FROM order_items oi
JOIN orders o   ON o.order_id = oi.order_id
JOIN products p ON p.product_id = oi.product_id
WHERE o.order_status = 'delivered'
GROUP BY p.product_category_name
ORDER BY revenue DESC
LIMIT 10;`)}
<p>With English names (check the translation table header first; the English column is normally product_category_name_english):</p>
${pre(`SELECT COALESCE(t.product_category_name_english, p.product_category_name) AS category,
       ROUND(SUM(oi.price)::numeric, 2) AS revenue
FROM order_items oi
JOIN orders o   ON o.order_id = oi.order_id
JOIN products p ON p.product_id = oi.product_id
LEFT JOIN category_translation t ON t.product_category_name = p.product_category_name
WHERE o.order_status = 'delivered'
GROUP BY 1
ORDER BY revenue DESC
LIMIT 10;`)}
<p>LEFT JOIN keeps products whose category has no translation. COALESCE picks the English name when present, otherwise the Portuguese one. Some products have a NULL category; they will appear as one NULL group: mention it in your notes.</p>
<p><b>Q3. Late deliveries and delivery time:</b></p>
${pre(`SELECT COUNT(*) AS delivered_orders,
       COUNT(*) FILTER (WHERE order_delivered_customer_date::date > order_estimated_delivery_date::date) AS late_orders,
       ROUND(100.0 * COUNT(*) FILTER (WHERE order_delivered_customer_date::date > order_estimated_delivery_date::date)
             / COUNT(*), 2) AS late_pct,
       ROUND(AVG(EXTRACT(EPOCH FROM (order_delivered_customer_date - order_purchase_timestamp)) / 86400)::numeric, 1)
             AS avg_delivery_days
FROM orders
WHERE order_status = 'delivered'
  AND order_delivered_customer_date IS NOT NULL;`)}
<p><b>Q4. Does being late lower the review score?</b> Reviews can be duplicated per order, so average them to one row per order first:</p>
${pre(`WITH rev AS (
  SELECT order_id, AVG(review_score) AS score
  FROM order_reviews
  GROUP BY order_id
)
SELECT CASE WHEN o.order_delivered_customer_date::date > o.order_estimated_delivery_date::date
            THEN 'Late' ELSE 'On time' END AS delivery,
       COUNT(*) AS orders,
       ROUND(AVG(r.score)::numeric, 2) AS avg_review_score
FROM orders o
JOIN rev r ON r.order_id = o.order_id
WHERE o.order_status = 'delivered'
  AND o.order_delivered_customer_date IS NOT NULL
GROUP BY 1;`)}
<p>Expected pattern: late orders have a clearly lower average score (often roughly 2.5 vs 4.3 for on-time; yours may differ). Your headline insight: "Late delivery is linked with about X points lower review score". Say "linked with", not "causes", because other things (product quality) also affect it.</p>
<p><b>Q5. Payment mix:</b></p>
${pre(`SELECT op.payment_type,
       COUNT(DISTINCT op.order_id) AS orders,
       ROUND(SUM(op.payment_value)::numeric, 2) AS total_paid,
       ROUND((100.0 * SUM(op.payment_value) / SUM(SUM(op.payment_value)) OVER ())::numeric, 1) AS pct_of_value
FROM order_payments op
JOIN orders o ON o.order_id = op.order_id
WHERE o.order_status = 'delivered'
GROUP BY op.payment_type
ORDER BY total_paid DESC;`)}
<p>Same delivered-orders rule as the revenue queries, so the numbers can be compared. Orders is joined only to filter by status (one row per order), and an order with two payment rows is still counted once in <code>orders</code>. Credit card is expected to be the largest share. Also try: average payment_installments for credit card orders.</p>`,
      practice: [
        ['Show total revenue and total freight for delivered orders, and freight as a percent of revenue.', `${pre(`SELECT ROUND(SUM(oi.price)::numeric, 2)         AS revenue,
       ROUND(SUM(oi.freight_value)::numeric, 2)  AS freight,
       ROUND((100.0 * SUM(oi.freight_value) / SUM(oi.price))::numeric, 1) AS freight_pct
FROM order_items oi
JOIN orders o ON o.order_id = oi.order_id
WHERE o.order_status = 'delivered';`)}<p>Freight as a share of price shows how expensive shipping is for customers.</p>`],
        ['Find the 5 busiest months by number of delivered orders.', `${pre(`SELECT DATE_TRUNC('month', order_purchase_timestamp)::date AS month,
       COUNT(*) AS orders
FROM orders
WHERE order_status = 'delivered'
GROUP BY 1
ORDER BY orders DESC
LIMIT 5;`)}`],
        ['Show revenue by customer state (top 10).', `${pre(`SELECT c.customer_state,
       ROUND(SUM(oi.price)::numeric, 2) AS revenue
FROM order_items oi
JOIN orders o    ON o.order_id = oi.order_id
JOIN customers c ON c.customer_id = o.customer_id
WHERE o.order_status = 'delivered'
GROUP BY c.customer_state
ORDER BY revenue DESC
LIMIT 10;`)}<p>Join path: items to orders (for status and customer_id) to customers (for state).</p>`],
        ['Month-over-month revenue growth percent using LAG.', `${pre(`WITH m AS (
  SELECT DATE_TRUNC('month', o.order_purchase_timestamp)::date AS month,
         SUM(oi.price) AS revenue
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.order_id
  WHERE o.order_status = 'delivered'
  GROUP BY 1
)
SELECT month,
       ROUND(revenue::numeric, 2) AS revenue,
       ROUND((100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))
             / LAG(revenue) OVER (ORDER BY month))::numeric, 1) AS mom_pct
FROM m
ORDER BY month;`)}<p>LAG gets the previous month's revenue. The first month has NULL growth because there is no previous row.</p>`],
        ['Average review score by delay bucket: on time, 1-3 days late, more than 3 days late (counted in whole calendar days).', `${pre(`WITH rev AS (
  SELECT order_id, AVG(review_score) AS score FROM order_reviews GROUP BY order_id
),
d AS (
  SELECT o.order_id,
         o.order_delivered_customer_date::date - o.order_estimated_delivery_date::date AS days_late
  FROM orders o
  WHERE o.order_status = 'delivered' AND o.order_delivered_customer_date IS NOT NULL
)
SELECT CASE WHEN d.days_late <= 0 THEN '1 On time'
            WHEN d.days_late <= 3 THEN '2 Late 1-3 days'
            ELSE '3 Late more than 3 days' END AS bucket,
       COUNT(*) AS orders,
       ROUND(AVG(r.score)::numeric, 2) AS avg_score
FROM d
JOIN rev r ON r.order_id = d.order_id
GROUP BY 1
ORDER BY 1;`)}<p>Buckets let you show a dose-response pattern: the later the order, the lower the score. That is a stronger story than a single late/on-time split.</p>`]
      ],
      important: [
        ['How did you calculate revenue, and why not use payment_value?', `<p>I used the sum of item price from order_items for delivered orders, because it is at product level and lets me split by category. Payment_value includes freight and instalment interest, and has multiple rows per order, so it is better for payment analysis. I documented my revenue definition in the README.</p>`],
        ['How did you handle late deliveries in your analysis?', `<p>I defined late as delivered date later than the estimated date, only for delivered orders with a delivery date. About X% were late. I then compared review scores of late and on-time orders and found late orders score about Y points lower, so delivery performance is a key driver of customer satisfaction.</p>`],
        ['Why use COUNT(DISTINCT order_id) in the revenue query?', `<p>Because the join to order_items creates one row per item. An order with three items would be counted three times with COUNT(*). DISTINCT counts each order once.</p>`]
      ],
      resources: [['Mode SQL Tutorial', 'https://mode.com/sql-tutorial'], ['DB Fiddle (run SQL online)', 'https://www.db-fiddle.com']],
      done: 'You are done when five queries run without errors, you have one insight sentence for each, and the SQL file is committed to GitHub.'
    },
    /* ---------------- WED ---------------- */
    {
      title: 'SQL: repeat customers, cohort retention, RFM',
      time: '1.5 h',
      study: [
        'Repeat-customer rate = customers with 2 or more orders / all customers. Always count people with customer_unique_id, not customer_id.',
        'Cohort = group of customers by the month of their FIRST order. Retention = share of that cohort that orders again in month 1, 2, 3...',
        'Cohort steps in SQL: (1) one row per customer-month of activity, (2) find each customer\'s first month with MIN, (3) join and compute month_number = months since first month, (4) count distinct customers per cohort and month_number, (5) divide by month 0 size.',
        'FIRST_VALUE(x) OVER (PARTITION BY cohort ORDER BY month_number) gives the cohort size (month 0) on every row.',
        'RFM = Recency, Frequency, Monetary. NTILE(n) splits ranked rows into n equal groups.',
        'Warning: Olist customers mostly buy once. Frequency is 1 for most of them, and NTILE on many ties splits identical values into different buckets arbitrarily. Use a rule-based frequency score (1 order, 2 orders, 3+) instead.',
        'Expect low retention and a low repeat rate (low single digits). That is a real finding, not a bug, but sanity check by hand on a small sample of customers.'
      ],
      how: [
        '[5 min] Create sql/03_customers.sql.',
        '[15 min] Repeat-customer rate query. Verify with a manual check: pick one customer_unique_id with 2 orders and confirm it in the orders table.',
        '[30 min] Cohort retention query. Run it and look at month 0 (should be 100%) and month 1 (expect a very small number). Export to Excel and make a heatmap with colour scales.',
        '[30 min] RFM query. Check the segment counts add up to the number of customers.',
        '[5 min] Write one insight sentence for each of the three outputs.',
        '[5 min] Commit to GitHub.'
      ],
      example: `<p><b>Q6. Repeat-customer rate:</b></p>
${pre(`WITH cust AS (
  SELECT c.customer_unique_id,
         COUNT(DISTINCT o.order_id) AS orders
  FROM orders o
  JOIN customers c ON c.customer_id = o.customer_id
  WHERE o.order_status = 'delivered'
  GROUP BY c.customer_unique_id
)
SELECT COUNT(*) AS customers,
       COUNT(*) FILTER (WHERE orders > 1) AS repeat_customers,
       ROUND(100.0 * COUNT(*) FILTER (WHERE orders > 1) / COUNT(*), 2) AS repeat_pct
FROM cust;`)}
<p>Reading: the CTE gives each person's number of delivered orders. The outer query counts people with more than one. Expect a low single-digit percent (around 3%). If you see 0% you probably used customer_id by mistake.</p>
<p><b>Q7. Monthly cohort retention:</b></p>
${pre(`WITH activity AS (
  SELECT DISTINCT c.customer_unique_id,
         DATE_TRUNC('month', o.order_purchase_timestamp)::date AS order_month
  FROM orders o
  JOIN customers c ON c.customer_id = o.customer_id
  WHERE o.order_status = 'delivered'
),
cohorts AS (
  SELECT customer_unique_id, MIN(order_month) AS cohort_month
  FROM activity
  GROUP BY customer_unique_id
),
cohort_counts AS (
  SELECT co.cohort_month,
         ((EXTRACT(YEAR FROM a.order_month) - EXTRACT(YEAR FROM co.cohort_month)) * 12
          + EXTRACT(MONTH FROM a.order_month) - EXTRACT(MONTH FROM co.cohort_month))::int AS month_number,
         COUNT(DISTINCT a.customer_unique_id) AS customers
  FROM activity a
  JOIN cohorts co ON co.customer_unique_id = a.customer_unique_id
  GROUP BY 1, 2
)
SELECT cohort_month,
       month_number,
       customers,
       ROUND(100.0 * customers /
             FIRST_VALUE(customers) OVER (PARTITION BY cohort_month ORDER BY month_number), 2) AS retention_pct
FROM cohort_counts
ORDER BY cohort_month, month_number;`)}
<p>Line by line: <b>activity</b> has one row per person per month they ordered. <b>cohorts</b> finds each person's first month. <b>cohort_counts</b> joins them and computes how many months after the first month each activity is (month_number 0 = the first month itself), then counts distinct people. The last SELECT divides each count by the month-0 count of the same cohort. Expect month 0 = 100% and later months well under 1% to a few percent. Pivot to a table in Power BI (matrix) or Excel for display.</p>
<p><b>Q8. RFM segments</b> (customer_unique_id level, delivered orders):</p>
${pre(`WITH base AS (
  SELECT c.customer_unique_id,
         MAX(o.order_purchase_timestamp)::date AS last_order,
         COUNT(DISTINCT o.order_id)            AS frequency,
         SUM(oi.price)                         AS monetary
  FROM orders o
  JOIN customers c    ON c.customer_id = o.customer_id
  JOIN order_items oi ON oi.order_id = o.order_id
  WHERE o.order_status = 'delivered'
  GROUP BY c.customer_unique_id
),
ref AS (
  SELECT MAX(last_order) + 1 AS ref_date FROM base
),
rfm AS (
  SELECT b.customer_unique_id,
         r.ref_date - b.last_order AS recency_days,
         b.frequency,
         b.monetary
  FROM base b CROSS JOIN ref r
),
scored AS (
  SELECT *,
         NTILE(4) OVER (ORDER BY recency_days DESC) AS r_score,   -- 4 = most recent
         CASE WHEN frequency = 1 THEN 1
              WHEN frequency = 2 THEN 2
              ELSE 3 END                            AS f_score,
         NTILE(4) OVER (ORDER BY monetary)          AS m_score    -- 4 = biggest spenders
  FROM rfm
)
SELECT CASE WHEN f_score >= 2 AND r_score >= 3 THEN 'Loyal and active'
            WHEN f_score >= 2 AND r_score <= 2 THEN 'Repeat but lapsing'
            WHEN f_score = 1 AND r_score >= 3 AND m_score >= 3 THEN 'New high spenders'
            WHEN f_score = 1 AND r_score >= 3 THEN 'New low spenders'
            ELSE 'One-time, inactive' END AS segment,
       COUNT(*) AS customers,
       ROUND(AVG(monetary)::numeric, 2) AS avg_spend,
       ROUND(SUM(monetary)::numeric, 0) AS total_spend
FROM scored
GROUP BY 1
ORDER BY total_spend DESC;`)}
<p>Reading: the reference date is the day after the last order in the data (never use today's date on old data, or recency becomes meaningless). Recency: NTILE ordered by recency_days DESC puts the longest gaps in group 1 and the most recent in group 4. Frequency uses a rule because nearly everyone has 1 order. The CASE gives each person one named segment. Marketing meaning: "New high spenders" are the best targets for a second-purchase offer; "Repeat but lapsing" need win-back messages.</p>`,
      practice: [
        ['Find the top 10 customer_unique_id values by number of delivered orders.', `${pre(`SELECT c.customer_unique_id, COUNT(DISTINCT o.order_id) AS orders
FROM orders o
JOIN customers c ON c.customer_id = o.customer_id
WHERE o.order_status = 'delivered'
GROUP BY c.customer_unique_id
ORDER BY orders DESC
LIMIT 10;`)}<p>Sanity check: the max is small (single digits to maybe 15), confirming that this is a mostly one-time-buyer business.</p>`],
        ['Compute the average gap in days between the first and second order for repeat customers.', `${pre(`WITH o AS (
  SELECT c.customer_unique_id,
         o.order_purchase_timestamp AS ts,
         ROW_NUMBER() OVER (PARTITION BY c.customer_unique_id
                            ORDER BY o.order_purchase_timestamp) AS rn
  FROM orders o
  JOIN customers c ON c.customer_id = o.customer_id
  WHERE o.order_status = 'delivered'
)
SELECT ROUND(AVG(EXTRACT(EPOCH FROM (o2.ts - o1.ts)) / 86400)::numeric, 1) AS avg_days_between
FROM o o1
JOIN o o2 ON o2.customer_unique_id = o1.customer_unique_id
         AND o1.rn = 1 AND o2.rn = 2;`)}<p>ROW_NUMBER numbers each customer's orders by time. We join order 1 with order 2 for the same person and average the gap.</p>`],
        ['What percent of customers in each cohort ordered again in month 1? Return only month 1.', `<p>Wrap the Q7 query and filter: add <code>WHERE month_number = 1</code> to the final SELECT (after FIRST_VALUE has been computed you need a subquery, so wrap it):</p>${pre(`SELECT cohort_month, customers, retention_pct
FROM (
  -- paste the final SELECT of the cohort query here
  SELECT cohort_month, month_number, customers,
         ROUND(100.0 * customers /
               FIRST_VALUE(customers) OVER (PARTITION BY cohort_month ORDER BY month_number), 2) AS retention_pct
  FROM cohort_counts
) x
WHERE month_number = 1
ORDER BY cohort_month;`)}<p>Filtering in the same SELECT would remove month 0 BEFORE the window function runs and break the percent. A subquery or CTE fixes the order of operations. (This snippet needs the earlier CTEs in front, same as Q7.)</p>`],
        ['Explain what is wrong with this: NTILE(5) OVER (ORDER BY frequency) when 97% of customers have frequency 1.', `<p>Ties are split arbitrarily across buckets, so two customers with the same frequency 1 can get different F scores. This makes the score meaningless. Use rule-based buckets (1, 2, 3+) via CASE instead, or rank only by values with a real spread.</p>`],
        ['Write a query for the average spend per customer for each RFM segment-like split: one-time vs repeat customers.', `${pre(`WITH cust AS (
  SELECT c.customer_unique_id,
         COUNT(DISTINCT o.order_id) AS orders,
         SUM(oi.price) AS spend
  FROM orders o
  JOIN customers c    ON c.customer_id = o.customer_id
  JOIN order_items oi ON oi.order_id = o.order_id
  WHERE o.order_status = 'delivered'
  GROUP BY c.customer_unique_id
)
SELECT CASE WHEN orders = 1 THEN 'One-time' ELSE 'Repeat' END AS type,
       COUNT(*) AS customers,
       ROUND(AVG(spend)::numeric, 2) AS avg_total_spend
FROM cust
GROUP BY 1;`)}<p>Repeat customers spend more in total simply because they buy more times. Compare also average order value to see if they spend more per order.</p>`]
      ],
      important: [
        ['How did you calculate cohort retention?', `<p>I took each customer's first order month as their cohort, then counted how many distinct customers from that cohort ordered in each following month, and divided by the cohort's size in month 0. I used customer_unique_id, delivered orders, and DATE_TRUNC for months. Retention was very low, which means the business depends on new customers.</p>`],
        ['What did your RFM analysis show and what would you recommend?', `<p>Most customers were one-time buyers, so I used a rule-based frequency score. The biggest group by customer count was inactive one-time buyers, while the most valuable groups were a small set of repeat and new high spenders. I would recommend a second-purchase offer within 30 days for new high spenders and a win-back campaign for lapsing repeat buyers.</p>`],
        ['Why did you use customer_unique_id and not customer_id?', `<p>Because customer_id is generated for each order, so each person looks like a new customer every time. customer_unique_id identifies the real person, so it is the only correct key for repeat rate, cohorts and RFM.</p>`]
      ],
      resources: [['Window Functions practice', 'https://www.windowfunctions.com'], ['Mode SQL Tutorial', 'https://mode.com/sql-tutorial']],
      done: 'You are done when the repeat rate, cohort retention and RFM queries run, the numbers pass a sanity check, and the three insight sentences are written.'
    },
    /* ---------------- THU ---------------- */
    {
      title: 'Power BI: star schema and DAX measures',
      time: '1.5 h',
      study: [
        'Star schema: one or more fact tables (events with numbers, such as order items) connected to small dimension tables (descriptions such as date, customer, product). Relationships are one-to-many from dimension to fact.',
        'Filters flow from the dimension (the "one" side) down to the fact (the "many" side). Keep relationships single direction and avoid many-to-many.',
        'A date table is required for time intelligence. Mark it as a date table in Power BI.',
        'Our model: Orders (one row per order), Fact_OrderItems, Fact_Payments, Dim_Customer, Dim_Product, Dim_Date. Orders sits between Dim_Customer, Dim_Date and the two fact tables. This is a slight snowflake and perfectly acceptable for an interview if you can explain it.',
        'Calculated column = computed row by row and stored in the table. Measure = computed on the fly at report time, responds to filters. Use measures for totals and ratios.',
        'CALCULATE changes the filter context. DIVIDE(a, b) safely handles division by zero. DATEADD shifts dates for previous-month comparisons.',
        'Aggregate reviews to one row per order in Power Query (Group By order_id, average of review_score) before loading, to avoid duplicate rows.'
      ],
      how: [
        '[10 min] Open Power BI Desktop. Get Data, PostgreSQL database (server localhost, database olist). Select orders, order_items, order_payments, order_reviews, customers, products. Choose Import, then Transform Data.',
        '[20 min] In Power Query: (a) orders: set the 3 timestamp columns to Date/Time and add a column PurchaseDate = Date.From([order_purchase_timestamp]) (Add Column, Custom Column). (b) order_reviews: Group By order_id with Average of review_score, name it review_score. (c) Merge orders with that review table (Left Outer on order_id) and expand review_score. (d) Rename tables: Orders, Fact_OrderItems, Fact_Payments, Dim_Customer, Dim_Product. Close and Apply.',
        '[10 min] Create the Dim_Date table with DAX (see example). Mark as date table.',
        '[15 min] In Model view create relationships: Dim_Date[Date] to Orders[PurchaseDate]; Dim_Customer[customer_id] to Orders[customer_id]; Orders[order_id] to Fact_OrderItems[order_id]; Orders[order_id] to Fact_Payments[order_id]; Dim_Product[product_id] to Fact_OrderItems[product_id]. All one-to-many, single direction.',
        '[25 min] Create a separate table called _Measures (Enter Data, empty) and add the DAX measures from the example. Test each in a Card or Table visual.',
        '[10 min] Take a screenshot of the Model view for your README.'
      ],
      example: `<p><b>Model sketch:</b></p>
${pre(`Dim_Date  1 --> * Orders   * <-- 1 Dim_Customer
                    |
          +---------+---------+
          1                   1
          |                   |
          *                   *
   Fact_OrderItems *<-- 1 Dim_Product      Fact_Payments`)}
<p>Orders[order_id] is unique, so it is the "one" side to both fact tables. Dim_Product is the "one" side to Fact_OrderItems.</p>
<p><b>Date table</b> (Modeling, New Table). The data covers 2016-2018:</p>
${pre(`Dim_Date =
ADDCOLUMNS(
    CALENDAR(DATE(2016, 1, 1), DATE(2018, 12, 31)),
    "Year", YEAR([Date]),
    "MonthNo", MONTH([Date]),
    "Month", FORMAT([Date], "MMM"),
    "YearMonth", FORMAT([Date], "yyyy-MM")
)`)}
<p>Then select the Month column, Column tools, Sort by column, MonthNo, so months do not sort alphabetically.</p>
<p><b>Calculated columns</b> on the Orders table (late flag compares the DATE parts with INT, because the estimate is stored at 00:00; the date columns may contain blanks for undelivered orders) and on Orders for the person key:</p>
${pre(`IsLate =
IF (
    NOT ISBLANK ( Orders[order_delivered_customer_date] )
        && INT ( Orders[order_delivered_customer_date] ) > INT ( Orders[order_estimated_delivery_date] ),
    1,
    0
)

Delivery Days =
IF (
    NOT ISBLANK ( Orders[order_delivered_customer_date] ),
    DATEDIFF ( Orders[order_purchase_timestamp], Orders[order_delivered_customer_date], DAY )
)

Person ID = RELATED ( Dim_Customer[customer_unique_id] )`)}
<p><b>Measures</b> (put them in the _Measures table):</p>
${pre(`Revenue =
CALCULATE ( SUM ( Fact_OrderItems[price] ), Orders[order_status] = "delivered" )

Freight =
CALCULATE ( SUM ( Fact_OrderItems[freight_value] ), Orders[order_status] = "delivered" )

Orders Count =
CALCULATE ( DISTINCTCOUNT ( Fact_OrderItems[order_id] ), Orders[order_status] = "delivered" )

AOV = DIVIDE ( [Revenue], [Orders Count] )

Revenue PM =
CALCULATE ( [Revenue], DATEADD ( Dim_Date[Date], -1, MONTH ) )

Revenue MoM % = DIVIDE ( [Revenue] - [Revenue PM], [Revenue PM] )

Delivered Orders =
CALCULATE ( COUNTROWS ( Orders ), Orders[order_status] = "delivered" )

Late % =
DIVIDE (
    CALCULATE ( SUM ( Orders[IsLate] ), Orders[order_status] = "delivered" ),
    [Delivered Orders]
)

Avg Review Score = AVERAGE ( Orders[review_score] )

Avg Delivery Days =
CALCULATE ( AVERAGE ( Orders[Delivery Days] ), Orders[order_status] = "delivered" )

Customers = DISTINCTCOUNT ( Orders[Person ID] )

Repeat Customers =
COUNTROWS (
    FILTER ( VALUES ( Orders[Person ID] ), CALCULATE ( COUNTROWS ( Orders ) ) > 1 )
)

Repeat Rate % = DIVIDE ( [Repeat Customers], [Customers] )`)}
<p>How it works: <b>Revenue</b> sums price, but the filter on Orders[order_status] flows from Orders down to the item rows through the relationship. <b>Revenue PM</b> shifts the date filter back one month, so the MoM measure works in any visual that has Dim_Date on the axis. <b>Late %</b> divides late delivered orders by delivered orders, and DIVIDE returns blank instead of an error if the denominator is 0. (A few delivered orders have no delivery date; they count in the denominator here but not in the SQL Q3 denominator, so the two percentages can differ slightly. Mention it in your README.) <b>Repeat Customers</b> loops over each distinct person in the current filter, counts their orders (CALCULATE turns the row into a filter), and keeps those with more than one. Review score is calculated at order level, so Avg Review Score is an average of order averages.</p>
<p>Note: Customers and Repeat measures count all orders statuses in the filter unless you add an order_status filter; if you want strictly delivered, wrap them in CALCULATE(..., Orders[order_status] = "delivered") and say so in the README.</p>`,
      practice: [
        ['Why is Dim_Date related to Orders[PurchaseDate] and not to the timestamp column?', `<p>A relationship needs matching keys. The timestamp includes the time of day, so it almost never equals a date at midnight. PurchaseDate is the date only (Date.From), so it matches Dim_Date[Date] exactly, and Dim_Date must contain every date once.</p>`],
        ['Write a measure for the share of revenue from credit card payments. (Hint: use Fact_Payments.)', `${pre(`Payment Value = SUM ( Fact_Payments[payment_value] )

Credit Card Share % =
DIVIDE (
    CALCULATE ( [Payment Value], Fact_Payments[payment_type] = "credit_card" ),
    [Payment Value]
)`)}<p>Both use payment_value from the payments table, so the share is consistent. The filter on payment_type is added inside CALCULATE only for the numerator.</p>`],
        ['Create a measure that returns revenue for the same month last year.', `${pre(`Revenue LY =
CALCULATE ( [Revenue], SAMEPERIODLASTYEAR ( Dim_Date[Date] ) )`)}<p>It works only with a continuous Dim_Date marked as a date table. Data begins in 2016 so only 2017 and 2018 will show values.</p>`],
        ['Write a measure for the average review score of late orders only.', `${pre(`Avg Review Late =
CALCULATE ( AVERAGE ( Orders[review_score] ), Orders[IsLate] = 1 )`)}<p>Compare it with a similar measure using IsLate = 0 to build a late vs on-time card or bar chart.</p>`],
        ['Explain the difference between a calculated column and a measure, with one example from this model.', `<p>A calculated column (Orders[IsLate]) is evaluated once per row when data refreshes and is stored in the model. A measure (Late %) is evaluated each time a visual draws, using the current filters. Use columns for row-level flags and groups, and measures for sums and ratios.</p>`]
      ],
      important: [
        ['What is a star schema and why use it?', `<p>It is a model with fact tables (transactions with numbers) connected to dimension tables (date, customer, product) by one-to-many relationships. It is fast, simple to filter, easy to understand and avoids ambiguous paths. In Power BI, filters flow from the dimensions to the facts.</p>`],
        ['What is the difference between a calculated column and a measure?', `<p>A calculated column is calculated row by row at refresh time and stored, so it uses memory and does not react to slicers. A measure is calculated at query time in the current filter context, so it reacts to slicers and is used for totals and ratios. I use measures for KPIs and columns for flags and categories.</p>`],
        ['Explain CALCULATE.', `<p>CALCULATE evaluates an expression after changing the filter context. For example CALCULATE(SUM(price), order_status = "delivered") sums price only for delivered orders, regardless of a different filter set by a slicer on the same column. It is the most important DAX function.</p>`],
        ['How do you do a month-over-month comparison in DAX?', `<p>I use a proper date table marked as a date table and write Revenue PM as CALCULATE([Revenue], DATEADD(Dim_Date[Date], -1, MONTH)), then MoM % = DIVIDE([Revenue] - [Revenue PM], [Revenue PM]).</p>`]
      ],
      resources: [['DAX Guide', 'https://dax.guide'], ['SQLBI', 'https://www.sqlbi.com'], ['Guy in a Cube (YouTube)', 'https://www.youtube.com/@GuyInACube']],
      done: 'You are done when the model has the 5 relationships, the date table is marked, and every measure returns a believable number in a Card visual.'
    },
    /* ---------------- FRI ---------------- */
    {
      title: 'Power BI: 2-3 page dashboard with drill-through',
      time: '1.5 h',
      study: [
        'A dashboard answers business questions at a glance. Put the most important KPIs at the top, trends in the middle, details below.',
        'Use as few visual types as possible: card (KPI), line chart (trend over time), bar chart (ranking), matrix (cohort table), map or table (details).',
        'Consistent design: one font, 3-4 colours, same slicer positions on every page, clear titles that state the question or message (for example "Late deliveries hurt review scores").',
        'Drill-through: right-click a data point (for example a category) on one page to jump to a detail page filtered for that item. Set up by dragging a field into the Drill-through well on the target page.',
        'Slicers (Year, State) and a "Back" button (automatically added) make the report interactive.',
        'Tooltips and conditional formatting add depth without clutter.',
        'Do not show everything you built. Three pages with a clear story beat eight pages with no message.'
      ],
      how: [
        '[10 min] Sketch the 3 pages on paper (see page plan below).',
        '[20 min] Page 1 Overview: 4 cards (Revenue, Orders Count, AOV, Avg Review Score), line chart Revenue by Dim_Date[YearMonth], bar chart of top 10 categories by Revenue (Dim_Product[product_category_name]), slicers for Year and customer state.',
        '[20 min] Page 2 Delivery and satisfaction: cards (Late %, Avg Delivery Days), column chart Avg Review Score by late vs on-time (use Orders[IsLate]), bar chart Late % by customer_state, and a payment type donut or bar.',
        '[15 min] Page 3 Customers: cards (Customers, Repeat Rate %), matrix for cohort retention (import the cohort query result as a table via Get Data or paste with Enter Data), and a bar chart of customers by RFM segment (also imported from your SQL result).',
        '[15 min] Drill-through page: create a page "Category Detail". Drag Dim_Product[product_category_name] into Drill through, Add drill-through fields here. Add cards, a monthly revenue line and a table of top products. Test: on Page 1 right-click a category bar, Drill through, Category Detail.',
        '[10 min] Format: same theme, titles with messages, align visuals, hide the Category Detail tab from navigation if you wish. Save the file as olist_dashboard.pbix.'
      ],
      example: `<p><b>Page plan</b> (draw this on paper first):</p>
${pre(`PAGE 1: Sales Overview
  Top row    : [Revenue] [Orders] [AOV] [Avg Review Score]
  Left       : Line - Revenue by Month  (Dim_Date[YearMonth])
  Right      : Bar  - Top 10 Categories by Revenue
  Slicers    : Year, Customer State (top-left)
  Message    : "Revenue grew strongly through 2017; a few categories drive most of it"

PAGE 2: Delivery & Satisfaction
  Top row    : [Late %] [Avg Delivery Days] [Avg Review Score]
  Left       : Column - Avg review score: Late vs On time
  Right      : Bar    - Late % by Customer State
  Bottom     : Payment type share
  Message    : "Late orders score about X points lower"

PAGE 3: Customers
  Top row    : [Customers] [Repeat Customers] [Repeat Rate %]
  Left       : Matrix - cohort month x month number, retention %
  Right      : Bar    - customers by RFM segment
  Message    : "Fewer than X% of customers buy again, retention is the biggest opportunity"

HIDDEN drill-through page: Category Detail (filtered by product_category_name)`)}
<p><b>Steps for drill-through in plain words:</b> On the Category Detail page, in the Visualizations pane scroll to the Drill through well. Drag Dim_Product[product_category_name] into it. Power BI adds a Back button. Go to Page 1, right-click one bar in the category chart, choose Drill through, then Category Detail. The detail page now shows only that category.</p>
<p><b>Conditional formatting tip for the cohort matrix:</b> select the matrix, Format, Cell elements, Background colour, fx, choose Gradient on the retention measure. High values get a darker colour, so the first columns stand out and the empty tail is visible.</p>
<p><b>Helpful DAX for a late vs on-time label</b> as a calculated column on Orders (use it as a legend or axis):</p>
${pre(`Delivery Status =
SWITCH (
    TRUE (),
    ISBLANK ( Orders[order_delivered_customer_date] ), "Not delivered",
    Orders[IsLate] = 1, "Late",
    "On time"
)`)}`,
      practice: [
        ['Which visual type would you use for: (a) revenue over months, (b) top 10 categories, (c) share of payment types, (d) cohort retention? Explain in one line each.', `<p>(a) Line chart: shows trend over time. (b) Horizontal bar chart sorted descending: easy to read long category names and rank. (c) Bar or donut with few slices (3-5 types), with percent labels. (d) Matrix with colour scale: two dimensions (cohort and month number) with a value in each cell.</p>`],
        ['Write a measure to show a KPI card title that changes with the slicer, e.g. "Revenue for 2017".', `${pre(`Revenue Title =
"Revenue for "
    & IF ( HASONEVALUE ( Dim_Date[Year] ), FORMAT ( SELECTEDVALUE ( Dim_Date[Year] ), "0" ), "all years" )`)}<p>HASONEVALUE is true when exactly one year is selected, so the title shows that year; otherwise it shows the text "all years". Use this measure in the visual title with the fx button.</p>`],
        ['The Category Detail drill-through shows all categories. What went wrong?', `<p>Check that Dim_Product[product_category_name] is in the Drill-through well of the detail page, that you right-click a visual that uses the same field (the category bar), and that there is no "keep all filters" confusion. Also confirm the relationship path from Dim_Product to the visuals on the page is working (Dim_Product 1 to Fact_OrderItems).</p>`],
        ['Create a measure for "% of orders late more than 3 days" (hint: add a calculated column first).', `${pre(`Days Late =
IF (
    NOT ISBLANK ( Orders[order_delivered_customer_date] ),
    DATEDIFF ( Orders[order_estimated_delivery_date], Orders[order_delivered_customer_date], DAY )
)

Late 3+ % =
DIVIDE (
    CALCULATE ( COUNTROWS ( Orders ), Orders[Days Late] > 3, Orders[order_status] = "delivered" ),
    [Delivered Orders]
)`)}<p>DATEDIFF counts day boundaries between the two dates: positive when delivery is after the estimate. The calculated column Days Late is created on the Orders table.</p>`],
        ['What are 3 signs of a bad dashboard and how does yours avoid them?', `<p>Too many visuals and colours, no clear message or title, and inconsistent numbers or formats. Mine uses 3 pages with 4-6 visuals each, message titles, one palette, the same slicers on each page, and formatted numbers (R$ for Brazilian reais with thousands separators, percentages with 1 decimal).</p>`]
      ],
      important: [
        ['Walk me through your dashboard.', `<p>It has three pages. Overview shows revenue, orders, AOV and review score with the monthly trend and top categories. Delivery and Satisfaction shows late percentage and how late orders get lower review scores. Customers shows the repeat rate, cohort retention and RFM segments. I added a drill-through from category to a detail page. The main message: growth is strong, but late delivery hurts satisfaction and very few customers return.</p>`],
        ['What is drill-through and how is it different from drill-down?', `<p>Drill-down moves through a hierarchy inside the same visual, such as year to month to day. Drill-through sends you to another page, filtered to the item you right-clicked, for example from a category on the overview to a category detail page.</p>`],
        ['How do you decide which visual to use?', `<p>I start from the question. Trend over time is a line; ranking is a sorted bar; part-to-whole with few parts is a donut or stacked bar; two dimensions with a value is a matrix with heat colours; one number is a card. I avoid pies with many slices and 3D charts.</p>`]
      ],
      resources: [['Microsoft Learn: Power BI', 'https://learn.microsoft.com/en-us/training/powerplatform/power-bi'], ['Guy in a Cube (YouTube)', 'https://www.youtube.com/@GuyInACube']],
      done: 'You are done when your .pbix has 3 clean pages plus a working drill-through page, with message titles and the same slicers on each page.'
    },
    /* ---------------- SAT ---------------- */
    {
      title: 'Insights, recommendations, README and GitHub',
      time: '3.5 h',
      study: [
        'An insight has four parts: Finding (what), Evidence (number), So what (why it matters), Recommendation (what to do and how to measure).',
        'Correlation is not causation. Write "linked with", not "caused by", unless you tested it.',
        'Recommendations must be specific and measurable: who does what, by when, and which metric to track. "Improve delivery" is weak; "Review the 3 worst states and set a delivery-time target, then track Late %" is strong.',
        'Limitations are a strength when stated honestly: partial first and last months, no cost or margin data, one marketplace, no marketing data.',
        'A README is the front door of the project. Recruiters read the top 20 lines only. Put the business problem, key findings with numbers, a screenshot and the tools at the top.',
        'Add the dashboard as screenshots (PNG) and, if possible, a short GIF. Power BI files cannot be viewed in a browser on GitHub, so screenshots are important. Optionally publish to Power BI Service and add a link, but it may need a work/school account.',
        'Use X/N placeholders in this guide, but your README must have your real numbers.'
      ],
      how: [
        '[40 min] Write down your 3-4 best insights from the SQL and the dashboard using the insight template. Use your real numbers.',
        '[30 min] Write 3 recommendations (see example). For each, define the metric to track.',
        '[20 min] Take dashboard screenshots (each page, 1600 px wide is fine) and save them as images/overview.png, images/delivery.png, images/customers.png, images/model.png. Hide any personal info.',
        '[50 min] Write the README using the template. Include the 8 questions, key findings, your revenue definition, data notes, how to reproduce, and limitations.',
        '[20 min] Organise the repo: sql/ (all .sql files, numbered), powerbi/ (pbix and, if size allows, the cohort/RFM CSV outputs), images/, README.md. Check the .pbix size (GitHub limit 100 MB per file; Olist pbix is usually fine).',
        '[20 min] Push to GitHub (git add ., git commit -m "Project 2: Olist analysis", git push). Open the repo in a private browser window and check it looks good. Pin the repo on your GitHub profile.',
        '[30 min] Rehearse the 2-minute project walkthrough aloud twice using the script in the example.'
      ],
      example: `<p><b>Insight template.</b> Fill with your numbers:</p>
${pre(`INSIGHT 1 - Delivery
Finding : Late deliveries are linked with much lower review scores.
Evidence: X% of delivered orders arrived after the estimated date. Late orders average Y review score vs Z for on-time orders.
So what: Dissatisfied customers are less likely to return, and the weakest delivery states pull the average down.
Action  : Review delivery promises and carriers in the N worst states; add a realistic buffer to the estimate. Track Late % and Avg Review Score monthly.

INSIGHT 2 - Retention
Finding : Very few customers buy again.
Evidence: Repeat rate is X% (N of M customers). Month-1 cohort retention is about Y%.
So what: Growth depends on constantly buying new customers, which costs more.
Action  : Test a second-purchase offer within 30 days for new high spenders (RFM). Success metric: month-1 retention up by N points.

INSIGHT 3 - Categories
Finding : A few categories generate most revenue.
Evidence: Top 5 categories = X% of revenue.
So what: Concentration risk, but also a focus for promotion and seller support.
Action  : Prioritise stock and seller quality in those categories; test cross-sell to related categories.

INSIGHT 4 - Payments
Finding : Credit card dominates; many orders use instalments.
Evidence: Credit card = X% of payment value; average instalments = N.
Action  : Keep instalment options visible in checkout; monitor failed-payment rates.`)}
<p><b>README template</b> (copy into README.md and fill in):</p>
${pre(`# Olist E-commerce: Sales, Delivery and Customer Analytics

## Business problem
A marketplace wants to understand revenue growth, delivery performance and customer retention.
Key questions: (list the 8 questions)

## Key findings
1. Late deliveries (X% of orders) are linked with review scores Y points lower.
2. Only X% of customers buy again; month-1 retention is about Y%.
3. Top 5 categories generate X% of revenue.
(Add one more with a number.)

## Dashboard
![Overview](images/overview.png)
![Delivery](images/delivery.png)
![Customers](images/customers.png)

## Tools
PostgreSQL (CTEs, window functions, cohort and RFM), Power BI (star schema, DAX, drill-through), Python (loading data)

## Data model
![Model](images/model.png)
Revenue = sum of item price for delivered orders (freight excluded).

## How to reproduce
1. Download the dataset from Kaggle (link).
2. Run load_olist.py to load tables into PostgreSQL.
3. Run the files in sql/ in order.
4. Open powerbi/olist_dashboard.pbix and refresh with your connection.

## Limitations
First and last months are partial; no cost/margin data; one marketplace; correlation, not proof of cause.

## Next steps
Predict late deliveries; test the second-purchase offer with an A/B test.`)}
<p><b>2-minute walkthrough script:</b> (1) Problem, 15 seconds: "I analysed about 100,000 marketplace orders to understand growth, delivery and retention." (2) Method, 30 seconds: "I loaded 8 tables into PostgreSQL, wrote SQL with CTEs and window functions for cohorts and RFM, and built a star-schema model in Power BI." (3) Findings, 45 seconds: your top 3 with numbers. (4) Recommendation, 20 seconds. (5) Learning/limits, 10 seconds: "If I had cost data I would analyse profit by category."</p>`,
      practice: [
        ['Rewrite this weak finding into a strong insight: "Delivery is bad."', `<p><b>Strong:</b> "X% of delivered orders arrived later than promised, and these orders averaged a review score of Y vs Z for on-time orders. The 3 worst states account for N% of late orders. Recommend reviewing carrier performance there and tracking Late % monthly."</p>`],
        ['Write a measurable recommendation for the low repeat rate.', `<p>"Send a time-limited offer to new customers 14 days after delivery. Run it as an A/B test on 50% of new customers for 8 weeks. Target: raise 60-day repeat purchase rate from X% to Y%. Measure with the cohort query."</p>`],
        ['List 4 limitations a recruiter would respect.', `<p>1) First and last months are partial. 2) No cost or margin, so no profit analysis. 3) Reviews are optional and may be biased towards extreme opinions. 4) Observational data, so the link between delay and score is not proof of cause.</p>`],
        ['A recruiter asks: "What would you do next with more time or data?" Give a good answer.', `<p>"I would add cost data to analyse profit by category, run a model to predict which orders will be late so the business can act in advance, and design an A/B test for a second-purchase offer to see if it really improves retention."</p>`],
        ['Check yourself: what must be visible in the first screen of your README?', `<p>Project title, one-line business problem, 3 findings with numbers, and one dashboard screenshot. A reader should understand the value in 20 seconds.</p>`]
      ],
      important: [
        ['What was the most interesting insight in your project and what would you recommend?', `<p>Late delivery is linked with lower review scores: late orders averaged about Y vs Z for on-time. Since reviews affect repeat purchase and marketplace reputation, I would recommend improving delivery estimates in the worst states and tracking Late % and review score monthly. I would also test it properly, because the link is not proof of cause.</p>`],
        ['What challenges did you face in the project?', `<p>The main ones were duplicate rows in joins (several payments and reviews per order), choosing customer_unique_id instead of customer_id, handling partial months, and getting a cohort retention query right. I solved them by aggregating before joining and sanity-checking counts at each step.</p>`],
        ['If you had to present this to a non-technical manager, how would you structure it?', `<p>Start with the business question, then 3 findings with one visual each, then recommendations with expected impact and a metric to track, and end with limitations and next steps. No SQL on the slides; show it only if asked.</p>`]
      ],
      resources: [['GitHub', 'https://github.com'], ['Olist E-commerce', 'https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce']],
      done: 'You are done when your GitHub repo has a README with real numbers and screenshots, you have rehearsed the 2-minute walkthrough twice, and the repo link works in a private window.'
    },
    /* ---------------- SUN ---------------- */
    {
      title: 'Resume v1, LinkedIn and your first 5 applications',
      time: '3.5 h',
      study: [
        'Recruiters spend about 10 seconds on a first look. Make the top third of page 1 count: name, links, a 2-line summary, skills.',
        'ATS (applicant tracking system) software reads your resume as text. Simple one-column layout, standard headings and plain fonts keep it readable.',
        'Bullet formula: Action verb + what you did + tool + result with a number. For example "Analysed X using SQL, which led to Y".',
        'Your survey-programmer job is real analyst work: data quality, logic, transformations, reporting, stakeholders. Say it in analyst language. Do not invent numbers: use real ones, or give honest estimates labelled as approximate.',
        'Keywords from the job description must appear naturally (SQL, Power BI, Excel, Python, dashboards, KPI, stakeholders).',
        'LinkedIn is a search engine: headline and About text should contain the same keywords. Recruiters search by skills and city.',
        'Applying is a routine, not a mood. Quality over speed: tailor 3 lines per application.',
        'Referral beats cold application. Even a short message to one person at the company helps.'
      ],
      how: [
        '[15 min] Open the resume rewrite table below. List your top 5 real achievements from your job with real numbers (surveys per month, respondents, hours saved, errors found, clients).',
        '[50 min] Rewrite each bullet using the formula. Build Resume v1 in a clean one-page format (Word or Google Docs), save as PDF named Firstname_Lastname_DataAnalyst.pdf. Use the ATS checklist.',
        '[10 min] Ask a friend or an AI chat to check for typos and readability. Do not paste private client names.',
        '[30 min] Update LinkedIn: headline, About, Skills (add SQL, Power BI, Excel, Python, Data Analysis), Featured section (GitHub projects), open-to-work (recruiters only).',
        '[20 min] Update Naukri, Foundit and Indeed profiles with the same keywords. Set job alerts for the titles below.',
        '[20 min] Create the application tracker (Google Sheet) with the columns shown below.',
        '[60 min] Apply to 5 jobs. For each: read the job description, copy 3 keywords into your summary line, apply, log it in the tracker. Send 2 connection or referral messages.',
        '[15 min] Review: which of the JOBS checklist items on the Jobs page can you tick today?'
      ],
      example: `<p><b>Rewrite 5 survey-programmer bullets</b> (use X, N as placeholders and replace with your REAL numbers; if you do not know a number, remove that part rather than invent it).</p>
${pre(`1. BEFORE: Programmed online surveys for clients.
   AFTER : Built and validated N+ online surveys per month (X respondents each) with complex skip logic and quotas, delivering clean datasets to clients with fewer than X% rework requests.

2. BEFORE: Checked data before delivery.
   AFTER : Designed data-quality checks (speeders, straight-liners, duplicates, logic violations) that cut invalid responses by X% and reduced manual QA time by about Y hours per project.

3. BEFORE: Exported data and made Excel tables for the research team.
   AFTER : Cleaned and transformed raw survey exports using Excel, Power Query and SQL/Python, producing analysis-ready tables and crosstabs used by N research managers each month.

4. BEFORE: Worked with clients on project requirements.
   AFTER : Translated client questions into measurable survey metrics and data specifications, working with project managers and clients on N+ projects to meet deadlines.

5. BEFORE: Fixed issues in surveys and data.
   AFTER : Investigated and resolved data discrepancies by tracing logic and tracking errors, improving first-time-right delivery from X% to Y%.`)}
<p><b>Strong action verbs:</b> analysed, built, cleaned, automated, reduced, identified, designed, validated, visualised, presented, reconciled.</p>
<p><b>Resume layout (one page):</b></p>
${pre(`Name | City | Phone | Email | LinkedIn | GitHub
SUMMARY (2 lines)
  Survey data professional with 2+ years of experience in data quality, moving into data analytics. Skilled in SQL, Power BI, Excel and Python; built
  [N] end-to-end analytics projects (only count the ones you have really finished).
SKILLS   SQL (PostgreSQL) | Power BI, DAX | Excel (Power Query) | Python (pandas) | Statistics, A/B testing | Data cleaning
EXPERIENCE   Job title, Company, dates
  - 4 to 5 rewritten bullets
PROJECTS
  Olist E-commerce Analytics (SQL, Power BI) - one-line result with numbers, GitHub link
  Survey / CSAT Insights Dashboard - one-line result
  Third project when finished
EDUCATION   MCA, university, year
CERTIFICATES (optional)`)}
<p><b>Use the project bullet from your plan:</b> "Wrote SQL (CTEs, window functions) on 100k+ orders to compute cohort retention and RFM segments; built a Power BI dashboard highlighting a delivery-delay issue linked to lower review scores."</p>
<p><b>ATS checklist:</b></p>
${pre(`[ ] One page, one column, no tables, text boxes, icons, photos or graphics
[ ] Standard headings: Summary, Skills, Experience, Projects, Education
[ ] Plain font (Calibri, Arial), size 10-11, consistent dates
[ ] File saved as PDF (or Word if the portal asks), named Firstname_Lastname_DataAnalyst
[ ] Keywords copied from the job description appear in skills and bullets
[ ] Every bullet starts with a verb and has a result (number if real)
[ ] Links (LinkedIn, GitHub) written as plain text and clickable
[ ] No spelling mistakes; same tense style throughout
[ ] No skills you cannot discuss in an interview
[ ] Contact details at the top, as text in the page body (not in the header)`)}
<p><b>LinkedIn headline</b> (220 characters max; keep the keywords, but do not claim a job title you have not held):</p>
${pre(`Survey Data Professional moving into Data Analytics | SQL | Power BI | Python | Excel | Open to Data Analyst roles`)}
<p><b>LinkedIn About template</b> (replace the brackets):</p>
${pre(`I turn messy data into clear decisions. For the last [2+] years I have worked with survey data: programming surveys, checking data quality and delivering clean datasets to [clients/teams]. That work taught me to question data, protect its quality and explain results to non-technical people.

Now I am focused on data analytics. My toolkit: SQL (PostgreSQL), Power BI and DAX, Excel and Power Query, Python (pandas), statistics and A/B testing.

Recent projects:
- Olist E-commerce Analytics: SQL cohort retention and RFM, Power BI dashboard on [100k+] orders. [GitHub link]
- Survey / CSAT Insights Dashboard: [one-line result]. [GitHub link]

I am looking for a Data Analyst role where I can [help the business improve X]. Open to roles in [cities / remote].
Contact: [email]`)}
<p><b>Job titles to search:</b> Data Analyst, Junior Data Analyst, Business Analyst, Reporting Analyst, MIS Analyst, BI Analyst, Power BI Developer, Operations Analyst, Insights Analyst, Research Analyst, Survey Data Analyst. Use filters: past 7 days, experience 0-3 years, your target cities and remote.</p>
<p><b>Daily application routine (about 60-90 minutes):</b></p>
${pre(`1. Search saved alerts on LinkedIn, Naukri, Foundit, Indeed, Wellfound (10 min)
2. Pick 3-5 jobs that match at least 60% of the skills (10 min)
3. For each: change the 3-line summary to include their keywords (10 min)
4. Apply, then log it in the tracker the same minute (5 min)
5. Find 1 person (recruiter or analyst at that company) and send a short message (10 min)
6. Follow up on applications older than 7 days (10 min)`)}
<p><b>Tracker columns (Google Sheet):</b></p>
${pre(`Date | Company | Role | Link | Source | Resume version | Referral? | Status (Applied/Screen/Interview/Rejected/Offer) | Next step | Follow-up date | Notes`)}
<p><b>Referral / connection message</b> (LinkedIn limits a connection note to about 200 characters on a free account and 300 on Premium, so keep the note short and send the resume in a follow-up message once they accept; no fabricated claims):</p>
${pre(`Hi [Name], I work with survey data (2+ years) and have built SQL and Power BI projects (GitHub: [link]). I saw the [Role] opening at [Company]. Could you share any advice on the team? Thank you!`)}`,
      practice: [
        ['Rewrite: "Responsible for quality checking of survey data."', `${pre(`Implemented automated and manual data-quality checks (speeders, straight-liners, duplicates, logic errors) on N+ survey projects, reducing invalid responses by X% before delivery.`)}<p>It names the actions, the scale and the result, and starts with a verb. If you do not have a real X, write "reducing manual rework" without a number rather than invent one.</p>`],
        ['Rewrite: "Created reports in Excel."', `${pre(`Built Excel reports with Power Query and pivot tables that consolidated N data sources, replacing X hours of manual work per week and giving managers a weekly view of [metric].`)}`],
        ['Write a 2-line resume summary for yourself.', `${pre(`Survey programming and data quality professional with 2+ years of experience, now building analytics skills in SQL, Power BI and Python. Built end-to-end projects on e-commerce and customer survey data, turning raw data into dashboards and recommendations.`)}<p>It states experience, tools and proof (projects) in two lines.</p>`],
        ['Which of these resume lines would an ATS or recruiter dislike, and why? (a) Skills in a graphic with star ratings, (b) "Expert in all MS Office", (c) "SQL (PostgreSQL), Power BI, DAX".', `<p>(a) Bad: ATS cannot read graphics, and star ratings mean nothing. (b) Vague and not credible: name specific tools and what you did. (c) Good: specific, searchable keywords.</p>`],
        ['Draft your tracker row for one application and the follow-up message after 7 days.', `<p>Row: 08-Oct | Company | Data Analyst | link | LinkedIn | v1 | No | Applied | Follow up | 15-Oct | Matches SQL/Power BI.</p>${pre(`Hi [Name], I applied for the Data Analyst role at [Company] on [date] and remain very interested. I have built SQL and Power BI projects on e-commerce data (GitHub: [link]). Could you tell me where the application stands or if I can share more? Thank you.`)}`]
      ],
      important: [
        ['Tell me about yourself. (60-second draft, refine in Week 11)', `<p>I am a data professional with more than two years of experience in survey programming, where I owned data quality, logic and delivery to clients. I enjoy the data part most, so I built skills in SQL, Power BI, Excel and Python, and completed projects on customer surveys and e-commerce data, including a cohort and RFM analysis with a Power BI dashboard. I am looking for a data analyst role where I can use my data quality mindset and my new analytics skills to help the business with decisions.</p>`],
        ['Why are you moving from survey programming to data analytics?', `<p>In survey work I saw that the most valuable part was what the data tells us, not just collecting it. I already clean, validate and structure data daily, so analytics is a natural next step. I have built the skills with projects, and I want to spend more of my time finding insights and supporting decisions.</p>`],
        ['What is your biggest strength for this role?', `<p>Data quality and attention to detail, built from years of checking logic, spotting errors and delivering clean data on deadline. Combined with SQL and Power BI, it means my analysis can be trusted. I also understand survey data deeply, which many analysts do not.</p>`]
      ],
      resources: [['Alex The Analyst (YouTube)', 'https://www.youtube.com/@AlexTheAnalyst'], ['GitHub', 'https://github.com'], ['AmbitionBox (India salaries)', 'https://www.ambitionbox.com']],
      done: 'You are done when Resume v1 (one-page PDF) exists, LinkedIn headline and About are updated, and 5 applications are logged in your tracker.'
    }
  ]
};
