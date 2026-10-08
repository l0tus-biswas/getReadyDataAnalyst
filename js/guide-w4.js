/* Week 4 guide: Power BI Basics + Data Modeling */
GUIDES[4] = {
  intro: `<p><b>Why this week matters:</b> Interviewers (Ivanti, Deloitte and others) often ask you to write DAX measures live and to explain a star schema. If you can say "fact table, dimension tables, one-to-many, measure not column" and write Net Sales and Unique Customers, you already beat many freshers.</p>
<p><b>By Sunday you can:</b> load and clean data in Power BI, build a star-schema model, create the common visuals, write 8-10 basic DAX measures, explain CALCULATE and filter context in simple words, and show a 2-page dashboard on Superstore.</p>
<p><b>Time split:</b> Mon-Fri, 1.5 h: 25 min learn, 45 min hands-on, 20 min practice. Saturday (3.5 h): build the dashboard. Sunday (3.5 h): review Power BI Q&A, practise DAX from memory, 5 SQL problems, optional publish.</p>
<p><b>Note:</b> Power BI Desktop runs on Windows only. If your work laptop blocks installs, use a personal Windows PC. Excel formulas from Week 3 and SQL joins from Week 1 will help here: a relationship is like a JOIN, and a measure is like an aggregate in GROUP BY.</p>`,
  days: [
    {
      title: `Install Power BI Desktop, connect and clean data`,
      time: `1.5 h`,
      study: [
        `Power BI Desktop is the free tool to build reports. It has 3 views on the left: Report (visuals), Table (see data), Model (relationships).`,
        `Get data: Home > Get data. Common sources: Excel workbook, Text/CSV, PostgreSQL database (under More > Database), Folder.`,
        `Import mode copies the data into the file (fast, default). DirectQuery reads the source live (slower, fewer DAX features). Start with Import.`,
        `In the Navigator window you choose Load (load as is) or Transform Data (open Power Query Editor to clean first). Prefer Transform Data.`,
        `Power Query Editor works like Excel Power Query: Applied Steps on the right, each step is an M function (Table.TransformColumnTypes, Table.Distinct and so on).`,
        `Typical cleaning: Use First Row as Headers, set data types, Transform > Format > Trim / Capitalize Each Word, Replace Values, Remove Duplicates, Remove Rows > Remove Blank Rows, rename columns.`,
        `Click Home > Close and Apply to load the cleaned data into the model.`,
        `Good habit: clean in Power Query (once, at the source), not with calculated columns later.`
      ],
      how: [
        `[15 min] Download Power BI Desktop from the Microsoft Store (search "Power BI Desktop") or from the Microsoft download page. Install and sign in if asked (you can close the sign-in box).`,
        `[10 min] Save the Orders sample (example below) as orders.csv with Notepad (File > Save As, type orders.csv, Encoding UTF-8).`,
        `[10 min] Home > Get data > Text/CSV > choose orders.csv > click Transform Data.`,
        `[25 min] In Power Query Editor do the cleaning steps listed in the example. Watch Applied Steps grow. Open View > Advanced Editor and read the M code.`,
        `[10 min] Home > Close and Apply. Go to Table view and check the cleaned data.`,
        `[10 min] Also try Get data > Excel workbook with your Week 3 Superstore file. Optional: Get data > More > Database > PostgreSQL database (type server and database name, choose Import).`,
        `[10 min] Practice questions.`
      ],
      example: `<p>Raw file orders.csv (3 problems: spaces and lower case in names, text amount with comma, one duplicate row, one blank city):</p>${pre(`OrderID,OrderDate,Customer,City,Amount
1,2025-01-05, asha rao ,mumbai,500
2,2025-01-07,Ravi Kumar,Delhi,"1,200"
2,2025-01-07,Ravi Kumar,Delhi,"1,200"
3,2025-01-09,Meena,,300`)}
<p>Steps in Power Query Editor and what you see:</p>${pre(`1. Use First Row as Headers (Home) - if headers came as Column1..5
2. Customer: select column > Transform > Format > Trim, then Format > Capitalize Each Word
   " asha rao " -> "Asha Rao"
3. City: Transform > Format > Capitalize Each Word    mumbai -> Mumbai
4. Amount: right-click > Replace Values: "," with nothing  ("1,200" -> "1200")
5. Set types: OrderDate = Date, Amount = Whole Number (or Decimal), OrderID = Whole Number
6. Select all columns > Home > Remove Rows > Remove Duplicates   (4 rows -> 3 rows)
7. City blank: Transform > Replace Values: null with "Unknown"`)}
<p>Result after cleaning (3 rows):</p>${pre(`OrderID  OrderDate   Customer    City     Amount
1        2025-01-05  Asha Rao    Mumbai    500
2        2025-01-07  Ravi Kumar  Delhi    1200
3        2025-01-09  Meena       Unknown   300`)}
<p>The M code behind a few of those steps:</p>${pre(`Trimmed = Table.TransformColumns(Source, {{"Customer", each Text.Proper(Text.Trim(_)), type text}}),
NoComma = Table.ReplaceValue(Trimmed, ",", "", Replacer.ReplaceText, {"Amount"}),
Typed   = Table.TransformColumnTypes(NoComma, {{"Amount", Int64.Type}, {"OrderDate", type date}}),
NoDups  = Table.Distinct(Typed)`)}
<p><b>Explain:</b> Text.Trim removes spaces at the ends, Text.Proper capitalises each word. Replace Values removes the comma so the text can become a number. Table.Distinct removes duplicate rows. Because every step is recorded, when a new orders.csv arrives you press Refresh and all steps run again.</p>`,
      practice: [
        [`What is the difference between Load and Transform Data in the Navigator window?`, `<p>Load puts the data into the model as it is. Transform Data opens Power Query Editor so you can clean first. In real work always use Transform Data to check types and quality.</p>`],
        [`In the example, how many rows remain after Remove Duplicates and why?`, `<p>3 rows. Row with OrderID 2 appears twice with identical values in every column, so one is removed. Remove Duplicates compares the columns you select, so select all columns (or only the key) on purpose.</p>`],
        [`Amount is text because of "1,200". Which two steps make it numeric, and what M function sets the type?`, `<p>Replace Values (comma with nothing), then Change Type to Whole Number. The type step uses Table.TransformColumnTypes.</p>`],
        [`What is the difference between Import and DirectQuery? Which one for a 50,000-row CSV?`, `<p>Import copies data into Power BI (fast, full DAX, scheduled refresh). DirectQuery runs queries on the source each time (always fresh, slower, some limits). A 50,000-row CSV: Import. CSV files do not support DirectQuery anyway.</p>`],
        [`You cleaned data and clicked Close and Apply. Next month the CSV has new rows. What do you do?`, `<p>Replace the file (same name and path) or update the source path in Home > Transform data > Data source settings, then click Home > Refresh. All Applied Steps run on the new data.</p>`],
        [`Where should you do cleaning: Power Query or DAX calculated columns? Why?`, `<p>Power Query. It runs once at refresh, keeps the model small and fast, and the steps are visible. Calculated columns add to model size and are harder to maintain. Use DAX for calculations that depend on filters (measures).</p>`]
      ],
      important: [
        [`Walk me through how you prepare data in Power BI.`, `<p>I connect to the source, choose Transform Data, check headers and data types, trim and standardise text, remove duplicates, handle nulls with a clear rule, rename columns to business names, and then Close and Apply. I keep the steps clean and in order so refresh works every time.</p>`],
        [`Import vs DirectQuery vs Live connection?`, `<p>Import copies data into Power BI: fast and flexible, with scheduled refresh. DirectQuery queries the source live: data is always fresh but reports are slower and some features are limited. Live connection connects to a published dataset or Analysis Services model. I default to Import unless the data is very big or must be real time.</p>`],
        [`Merge vs Append in Power Query?`, `<p>Merge joins tables side by side on key columns, like a SQL JOIN. Append stacks tables on top of each other, like UNION ALL.</p>`]
      ],
      resources: [[`Microsoft Learn: Power BI`, `https://learn.microsoft.com/en-us/training/powerplatform/power-bi`], [`Guy in a Cube (YouTube)`, `https://www.youtube.com/@GuyInACube`]],
      done: `You are done when Power BI Desktop is installed, you have loaded and cleaned a CSV, and you can explain Load vs Transform Data and Import vs DirectQuery.`
    },
    {
      title: `Data modeling: fact vs dimension, star schema, relationships`,
      time: `1.5 h`,
      study: [
        `A fact table stores events or transactions (one row per sale, order line, click). It has numbers (Qty, Amount) and keys to dimensions.`,
        `A dimension table describes things (Product, Customer, Date, Region). One row per thing, with a unique key and descriptive columns.`,
        `A star schema: one fact table in the middle, dimension tables around it, each linked with a one-to-many relationship (1 on the dimension, many on the fact).`,
        `Cardinality: one-to-many (normal), one-to-one (rare, could be merged), many-to-many (avoid when possible; creates confusing results).`,
        `Cross-filter direction: Single means the filter flows from dimension to fact (default and recommended). Both can cause ambiguity and slowness; use only when needed.`,
        `A relationship needs a key column with unique values on the "one" side. If the dimension key has duplicates you get an error, so clean it in Power Query first.`,
        `Only one relationship between two tables can be active. Others are inactive (dotted line) and used with USERELATIONSHIP in DAX. Example: Order Date and Ship Date both linked to the Date table.`,
        `Build a Calendar (Date) table and mark it: Table tools > Mark as date table. Time intelligence needs it.`,
        `Snowflake schema: dimensions linked to other dimensions (Product to Category). More tables, more joins. Star is simpler and faster for most reports.`
      ],
      how: [
        `[10 min] Create 3 small tables in Excel (example) on separate sheets: Sales, Product, Customer. Save the file.`,
        `[10 min] In Power BI: Get data > Excel workbook > select all 3 sheets > Load.`,
        `[15 min] Open Model view (icon on the left). If Power BI auto-detected relationships, read them. Delete them (select line > Delete) and recreate by dragging Product[ProductID] onto Sales[ProductID] and Customer[CustomerID] onto Sales[CustomerID].`,
        `[10 min] Double-click a relationship line. Check Cardinality = One to many, Cross filter direction = Single, Make this relationship active = ticked.`,
        `[15 min] Go to Report view. Build a table with Product[ProductName] and Sum of Sales[Qty]. Then remove the relationship and see what changes (every product shows the same total).`,
        `[10 min] Redraw the star schema on paper with your Superstore plan: fact Orders, dims Product, Customer, Date, Region/Location.`,
        `[20 min] Practice questions.`
      ],
      example: `<p>Three sample tables:</p>${pre(`Sales (FACT)                              Product (DIM)           Customer (DIM)
OrderID CustomerID ProductID Qty UnitPrice  ProductID Name       Cat    CustomerID Name   City
S1      C1         P1        2   100        P1   Notebook Stationery  C1   Asha  Mumbai
S2      C1         P2        1   250        P2   Bag      Accessories C2   Ravi  Delhi
S3      C2         P1        3   100        P3   Lamp     Accessories C3   Meena Mumbai
S4      C3         P3        1   400
S5      C2         P2        2   250
S6      C1         P1        1   100`)}
<p>Model view picture (text version):</p>${pre(`Product (1) ----> (*) Sales (*) <---- (1) Customer
                           |
                    (later) Calendar (1)  on Sales[OrderDate]`)}
<p>Relationships to create:</p>${pre(`Product[ProductID]   1 ---> *  Sales[ProductID]    (single direction, active)
Customer[CustomerID] 1 ---> *  Sales[CustomerID]   (single direction, active)`)}
<p><b>How filter flows:</b> When you put Product[Cat] = "Accessories" on a slicer, the filter moves from Product to Sales along the relationship and only the Sales rows S2, S4, S5 stay. Sales never filters Product (single direction). With no relationship the slicer does nothing to Sales and every product shows the total of all sales.</p>
<p><b>Why not one flat table?</b> A flat table repeats product name and city on every row. It wastes memory, is easy to get inconsistent (Mumbai vs Mumbay) and makes slicers and DAX slower and harder.</p>`,
      practice: [
        [`Classify as fact or dimension: Orders, Customers, Products, Payments, Calendar, Web clicks.`, `<p>Facts: Orders, Payments, Web clicks (events with numbers/timestamps). Dimensions: Customers, Products, Calendar (descriptive things).</p>`],
        [`In the sample, which side is the "one" and which is the "many" in Product-Sales? Why?`, `<p>Product is the one side (each ProductID appears once). Sales is the many side (P1 appears in S1, S3 and S6).</p>`],
        [`Power BI says "relationship can't be created because one of the columns must have unique values". Cause and fix?`, `<p>The column on the one side has duplicates (for example the same ProductID twice in the Product table). Fix: check with Remove Duplicates or a group-by count in Power Query, correct the data, or create a proper unique key.</p>`],
        [`A report has Order Date and Ship Date, both linked to the Calendar table. Why is one line dotted and how do you use it?`, `<p>Only one relationship between two tables can be active. The other is inactive. Use it in a measure: <code>Sales by Ship Date = CALCULATE([Total Sales], USERELATIONSHIP(Sales[ShipDate], 'Calendar'[Date]))</code>.</p>`],
        [`You put Customer[City] in a table with Sum of Qty from Sales but all cities show the same number (10). What is wrong?`, `<p>There is no working relationship between Customer and Sales (missing, inactive or wrong columns), so the filter from city cannot reach the fact table. Fix the relationship in Model view. With the right relationship the totals split: Mumbai = 5 (customer C1 has 2+1+1 = 4, customer C3 has 1) and Delhi = 5 (customer C2 has 3+2).</p>`],
        [`Explain star vs snowflake schema in two sentences. Which do you prefer?`, `<p>Star: dimensions connect directly to the fact table (one hop). Snowflake: dimensions connect to other dimensions (Product to Category to Department). I prefer star for Power BI because it is simpler, faster and easier to write DAX on.</p>`]
      ],
      important: [
        [`What is a star schema and why use it?`, `<p>One central fact table (transactions) linked to dimension tables (date, product, customer) by one-to-many relationships. It is fast, simple for DAX and avoids ambiguity compared with one flat table or a snowflake.</p>`],
        [`What are cardinality and cross-filter direction?`, `<p>Cardinality says how rows match between tables: one-to-many is normal, many-to-many is risky. Cross-filter direction says how filters flow: Single means from the dimension to the fact. I keep Single and avoid Both unless I really need it.</p>`],
        [`Why do you need a separate Date table?`, `<p>Time intelligence functions need a continuous date table with no gaps, marked as a date table and related to the fact table. It also gives me year, quarter and month columns for slicing.</p>`]
      ],
      resources: [[`SQLBI`, `https://www.sqlbi.com`], [`Microsoft Learn: Power BI`, `https://learn.microsoft.com/en-us/training/powerplatform/power-bi`]],
      done: `You are done when you can draw a star schema for an e-commerce dataset from memory and explain one-to-many and filter direction in 30 seconds.`
    },
    {
      title: `Visuals: bar, line, card, table, matrix, map, slicer`,
      time: `1.5 h`,
      study: [
        `Build a visual by clicking an icon in the Visualizations pane and dragging fields into the field wells (Axis, Values, Legend, Rows, Columns), or tick fields in the Data pane.`,
        `Visual choice: bar or column to compare categories, line for trend over time, card for one KPI number, table for exact values, matrix for a pivot-like table with rows and columns, map for locations, slicer for user filters.`,
        `Format a visual with the Format button (paint roller) in the Visualizations pane: title, data labels, colours, axis, gridlines.`,
        `Sort a visual: click the three dots (More options) on the visual > Sort axis > choose field and ascending or descending.`,
        `Months sort alphabetically by default. Fix: select the Month Name column in the Data pane > Column tools > Sort by column > Month Number.`,
        `Matrix: put fields in Rows, Columns and Values. Use the expand icons or the drill buttons to go down a hierarchy; turn subtotals on or off in the Format pane.`,
        `Cross-filtering: clicking a bar filters other visuals. Control it with Format > Edit interactions. Slicers can be synced across pages: View > Sync slicers.`,
        `Map and filled map need the field Data category set (Column tools > Data category > City, State and so on). Map visuals may be disabled by your organisation; use a bar chart then.`,
        `Keep it simple: 5-7 visuals per page, consistent colours, clear titles.`
      ],
      how: [
        `[5 min] Use the Superstore data or the Sales/Product/Customer sample from yesterday (add a few more rows if needed).`,
        `[15 min] Build: a Clustered bar chart (Category on Y axis, Sales on X), a Line chart (Order Date month on X, Sales on Y), and 3 Cards (Total Sales, Total Profit, Orders).`,
        `[15 min] Build a Table (ProductName, Qty, Sales) and a Matrix (Category rows, Region columns, Sales values). Turn on row subtotals.`,
        `[10 min] Add a slicer (Region) and set Slicer settings > Style > Dropdown. Add another slicer for Year using the Tile style.`,
        `[15 min] Fix month sort using Sort by column. Sort the bar chart descending by Sales.`,
        `[10 min] Use Format to set titles, data labels and one accent colour. Use Edit interactions to stop the card from being filtered by a chart (optional).`,
        `[20 min] Practice questions.`
      ],
      example: `<p>Sample question and the visual you would build (Superstore-style columns: Category, Region, Order Date, Sales, Profit):</p>${pre(`Business question                          Visual           Fields
How much did we sell in total?             Card             Sales (sum)
Which category sells most?                 Bar chart        Axis: Category, Values: Sales
How do sales change by month?              Line chart       Axis: Month, Values: Sales
Sales by category and region?              Matrix           Rows: Category, Columns: Region, Values: Sales
Exact numbers per product?                 Table            Product, Qty, Sales
Where do we sell?                          Map              Location: State/City, Size: Sales
Let user pick a region                     Slicer           Region`)}
<p><b>Example result</b> for the sample Sales table (Qty by Category with Product relationship): a bar chart gives Stationery = 6 (2+3+1) and Accessories = 4 (1+1+2). A card of Qty shows 10.</p>
<p><b>Fixing month order:</b> Suppose you have a table Calendar with MonthName (Jan, Feb, ...) and MonthNum (1, 2, ...). Click MonthName in the Data pane > Column tools > Sort by column > MonthNum. The axis now shows Jan, Feb, Mar instead of Apr, Aug, Dec.</p>
<p><b>Explain:</b> Power BI sorts text alphabetically, so it needs a number column to know the real order. This is a classic interview and real-work problem.</p>`,
      practice: [
        [`Which visual do you pick for: (a) total profit, (b) profit trend by month, (c) top 10 sub-categories by profit, (d) sales by category and region together?`, `<p>(a) Card. (b) Line chart. (c) Bar chart with a Top N filter on Sub-Category. (d) Matrix (or a clustered column with Region as Legend).</p>`],
        [`How do you show only the Top 10 sub-categories in a bar chart?`, `<p>Select the visual > Filters pane > hover on Sub-Category > expand > Filter type: Top N > Show items: Top 10 > By value: drag Sales (or Profit) in > Apply filter.</p>`],
        [`The month axis shows Apr, Aug, Dec, Feb... How do you fix it?`, `<p>Select MonthName in the Data pane > Column tools > Sort by column > MonthNum (a numeric column). Both columns must be in the same table.</p>`],
        [`You click a bar and the KPI card also changes, but you want the card to stay fixed. What do you do?`, `<p>Select the bar chart > Format tab > Edit interactions > on the card click the "None" icon (circle with a slash). The bar chart no longer filters the card.</p>`],
        [`Slicer on Region should also filter the Page 2 visuals. How?`, `<p>View > Sync slicers > tick the pages where the slicer should apply (Sync column) and show on the pages where you want it visible (Visible column).</p>`],
        [`Matrix vs table vs pivot table: when do you use a matrix?`, `<p>A table lists rows with columns (flat). A matrix works like an Excel pivot with fields in rows and columns, subtotals and drill. Use a matrix when you need a cross-tab such as Category by Region.</p>`]
      ],
      important: [
        [`What are slicers vs filters? What are the filter levels?`, `<p>Slicers are visible controls on the page that users click. The Filters pane has filters at visual level, page level and report level, which the report builder sets. I use slicers for user choice and the Filters pane for fixed rules such as Top 10.</p>`],
        [`Report vs dashboard in Power BI?`, `<p>A report is multi-page and interactive, built in Desktop. A dashboard is a single page of pinned tiles in Power BI Service, taken from one or more reports.</p>`],
        [`How do you choose the right chart?`, `<p>I start from the question. Trend over time: line. Compare categories: bar. Exact values: table. Part of whole with few parts: donut or stacked bar. Two numbers relationship: scatter. I avoid 3D, too many colours and more than 7 visuals on a page.</p>`]
      ],
      resources: [[`Guy in a Cube (YouTube)`, `https://www.youtube.com/@GuyInACube`], [`Microsoft Learn: Power BI`, `https://learn.microsoft.com/en-us/training/powerplatform/power-bi`]],
      done: `You are done when you can build a 6-visual page with slicers, fix month sorting, and say why you chose each visual.`
    },
    {
      title: `DAX basics: measure vs calculated column`,
      time: `1.5 h`,
      study: [
        `DAX (Data Analysis Expressions) is the formula language of Power BI. It looks like Excel formulas but works on tables and columns.`,
        `A calculated column is computed row by row when data refreshes and stored in the table. Create it: Table tools > New column. Use it for row-level values you need as a slicer or axis.`,
        `A measure is computed when the visual is drawn, using the filters on that visual (the filter context). Nothing is stored. Create it: Home > New measure (or Modeling > New measure). Use it for totals, ratios, counts.`,
        `Write column references as Table[Column], for example Sales[Qty]. Write measure references as [Measure Name] with no table name.`,
        `Aggregators: SUM(column), AVERAGE(column), MIN, MAX, COUNTROWS(table), COUNT(column), DISTINCTCOUNT(column).`,
        `DIVIDE(numerator, denominator, [alternate]) divides safely: it returns BLANK (or your alternate result) instead of an error when the denominator is 0. Prefer it over the / sign.`,
        `SUMX(table, expression) is an iterator: it computes the expression for each row, then adds. SUMX(Sales, Sales[Qty] * Sales[UnitPrice]) gives the same as a calculated column plus SUM, without storing the column.`,
        `Rule of thumb: if you will add it up or average it, use a measure. If you need to slice or filter by it, use a column.`
      ],
      how: [
        `[10 min] Load the Sales table from Day 2 into Power BI (add a Discount column as shown in the example). Keep the Product and Customer tables and relationships.`,
        `[10 min] Create the calculated column Line Amount: click Sales table > Table tools > New column > type the formula.`,
        `[25 min] Create measures one by one (Home > New measure). After each, drag it to a Card visual and compare with the expected value in the example.`,
        `[10 min] Create a matrix with Product[Name] in rows and Total Sales plus Discount % as values. Check the numbers.`,
        `[10 min] Create Sales (SUMX version) and check that it matches Total Sales.`,
        `[10 min] Put measures into a separate table (Home > Enter data > empty table named Measures) or a display folder to stay organised. Optional.`,
        `[15 min] Practice questions.`
      ],
      example: `<p>Sales table with a Discount column (amount of discount per order line):</p>${pre(`OrderID CustomerID ProductID Qty UnitPrice Discount
S1      C1         P1        2   100       10
S2      C1         P2        1   250        0
S3      C2         P1        3   100       30
S4      C3         P3        1   400       40
S5      C2         P2        2   250       25
S6      C1         P1        1   100        0`)}
<p>Calculated column (Table tools > New column):</p>${pre(`Line Amount = Sales[Qty] * Sales[UnitPrice]`)}
<p>Values: 200, 250, 300, 400, 500, 100.</p>
<p>Measures (Home > New measure):</p>${pre(`Total Sales      = SUM(Sales[Line Amount])                       -- 1750
Total Qty        = SUM(Sales[Qty])                               -- 10
Order Lines      = COUNTROWS(Sales)                              -- 6
Unique Customers = DISTINCTCOUNT(Sales[CustomerID])              -- 3
Avg Line Amount  = AVERAGE(Sales[Line Amount])                   -- 291.67
Net Sales        = [Total Sales] - SUM(Sales[Discount])          -- 1645
Discount %       = DIVIDE(SUM(Sales[Discount]), [Total Sales])   -- 0.06 (6%)
Sales (SUMX)     = SUMX(Sales, Sales[Qty] * Sales[UnitPrice])    -- 1750`)}
<p><b>Explain:</b> Line Amount is calculated once per row at refresh. Total Sales adds the column for whatever rows the visual allows. In a card with no filter it is 1750. In a matrix row for customer C2 it is only C2's rows: 300 + 500 = 800. Net Sales subtracts discount (105 total) from 1750 and gives 1645. DISTINCTCOUNT counts customers once each: C1, C2, C3 = 3, although there are 6 rows. Discount % uses DIVIDE so a filter that shows no sales will not cause an error.</p>
<p>Format Discount % as Percentage: select the measure > Measure tools > Format > Percentage.</p>`,
      practice: [
        [`Write a measure for total quantity and give its value for the sample.`, `${pre(`Total Qty = SUM(Sales[Qty])`)}Value: 10 (2+1+3+1+2+1).`],
        [`Write a measure for the number of unique customers. What is the value and what would COUNT(Sales[CustomerID]) give?`, `${pre(`Unique Customers = DISTINCTCOUNT(Sales[CustomerID])`)}Value: 3. COUNT counts all non-blank values, so it gives 6.`],
        [`Write Net Sales = gross sales minus discount and give the value. Then write Discount % safely.`, `${pre(`Net Sales   = [Total Sales] - SUM(Sales[Discount])
Discount % = DIVIDE(SUM(Sales[Discount]), [Total Sales])`)}Net Sales = 1750 - 105 = 1645. Discount % = 105 / 1750 = 0.06 (6%).`],
        [`Write a measure for average order value, where an order is a distinct OrderID. Value?`, `${pre(`AOV = DIVIDE([Total Sales], DISTINCTCOUNT(Sales[OrderID]))`)}1750 / 6 = 291.67. Here each OrderID is one line, so AOV equals the average line amount. In real data an order has many lines.`],
        [`Calculated column or measure: (a) Line Amount per row, (b) Total Sales, (c) a "Price Band" (Low/High) to use in a slicer, (d) Profit Margin %.`, `<p>(a) Calculated column (or SUMX in a measure). (b) Measure. (c) Calculated column, because slicers need a column. (d) Measure, because a ratio must be calculated after totals: DIVIDE([Total Profit], [Total Sales]).</p>`],
        [`Why is Margin % = AVERAGE(Sales[MarginPct]) usually wrong for a total, and what is the correct measure?`, `<p>Averaging row percentages gives each row equal weight, so small orders count as much as big ones. Correct: divide the totals.</p>${pre(`Margin % = DIVIDE(SUM(Sales[Profit]), SUM(Sales[Line Amount]))`)}`]
      ],
      important: [
        [`Calculated column vs measure?`, `<p>A calculated column is computed row by row at refresh and stored in the model, so it uses memory; I use it when I need to slice or group by it. A measure is computed at query time from the current filter context and is not stored. I use measures for totals, ratios and KPIs.</p>`],
        [`Write a measure for Net Sales and Unique Customers.`, `${pre(`Net Sales = SUM(Sales[Gross]) - SUM(Sales[Discount]) - SUM(Sales[Returns])
Unique Customers = DISTINCTCOUNT(Sales[CustomerID])`)}<p>DISTINCTCOUNT counts each customer once, however many orders they have.</p>`],
        [`SUM vs SUMX?`, `<p>SUM adds one column. SUMX is an iterator: it evaluates an expression for each row of a table and then adds the results, for example SUMX(Sales, Sales[Qty] * Sales[UnitPrice]). Use SUMX when the value needs row-level math before adding.</p>`],
        [`Why use DIVIDE instead of the / sign?`, `<p>DIVIDE handles division by zero safely: it returns blank or an alternate value instead of an error, so visuals do not break.</p>`]
      ],
      resources: [[`DAX Guide`, `https://dax.guide`], [`SQLBI`, `https://www.sqlbi.com`]],
      done: `You are done when you can write Total Sales, Unique Customers, Net Sales and Discount % from memory and explain measure vs calculated column.`
    },
    {
      title: `CALCULATE, FILTER, ALL, filter context vs row context`,
      time: `1.5 h`,
      study: [
        `Filter context = the set of filters that apply to a measure at the moment: slicers, rows and columns of the visual, page filters, and relationships. Each cell in a visual has its own filter context.`,
        `Row context = "the current row" while DAX loops over a table. It exists in calculated columns and inside iterators like SUMX. It does NOT filter other tables by itself.`,
        `CALCULATE(expression, filter1, filter2, ...) changes the filter context, then evaluates the expression. It is the most important DAX function.`,
        `A simple filter such as Product[Category] = "Accessories" inside CALCULATE replaces any existing filter on that same column.`,
        `FILTER(table, condition) returns the rows of a table that meet a condition. Use it inside CALCULATE when the condition is complex, like Sales[Line Amount] > 250.`,
        `ALL(table or column) removes filters. CALCULATE([Total Sales], ALL(Product)) gives the grand total ignoring product filters. REMOVEFILTERS(Product) does the same and reads more clearly (use it inside CALCULATE).`,
        `Percent of total = DIVIDE([Total Sales], CALCULATE([Total Sales], ALL(Product))).`,
        `Advanced (skip if short on time): context transition. When CALCULATE is used inside a row context (for example in a calculated column), the current row becomes a filter. So Customer[Total] = CALCULATE([Total Sales]) gives each customer's sales.`
      ],
      how: [
        `[10 min] Make sure your model has Sales, Product and Customer related as on Day 2 and the measures from Day 4.`,
        `[15 min] Create the measures Accessories Sales, High Value Sales, Mumbai Sales. Put Product[Category] in a matrix row and observe how each measure behaves.`,
        `[15 min] Create All Sales (with ALL) and Sales % of Total. Use them in the matrix with Category in rows.`,
        `[10 min] Create the measures Net Sales and Unique Customers (already learned) on the same matrix and verify.`,
        `[10 min] Write on paper: for the matrix cell "Stationery / Total Sales" list which filters are active. Then do it for "Stationery / Accessories Sales".`,
        `[25 min] Practice questions. Explain each answer aloud.`
      ],
      example: `<p>Use the same data (Sales with Line Amount: S1 200, S2 250, S3 300, S4 400, S5 500, S6 100) and Product: P1 Notebook Stationery, P2 Bag Accessories, P3 Lamp Accessories. Customer: C1 Asha Mumbai, C2 Ravi Delhi, C3 Meena Mumbai.</p>${pre(`Accessories Sales = CALCULATE([Total Sales], Product[Category] = "Accessories")
High Value Sales  = CALCULATE([Total Sales], FILTER(Sales, Sales[Line Amount] > 250))
Mumbai Sales      = CALCULATE([Total Sales], Customer[City] = "Mumbai")
All Sales         = CALCULATE([Total Sales], ALL(Product))
Sales % of Total  = DIVIDE([Total Sales], [All Sales])`)}
<p>Matrix with Product[Category] in rows:</p>${pre(`Category      Total Sales  Accessories Sales  All Sales  Sales % of Total
Stationery            600               1150       1750            34.3%
Accessories          1150               1150       1750            65.7%
Total                1750               1150       1750           100.0%`)}
<p>Other values (no filter, card): High Value Sales = 1200 (S3 300 + S4 400 + S5 500; S2 is exactly 250 so not included). Mumbai Sales = 950 (C1: 200+250+100 = 550, C3: 400).</p>
<p><b>Explain:</b> In the Stationery row the filter context contains Category = Stationery, so Total Sales = 600. In "Accessories Sales", CALCULATE replaces that filter with Category = Accessories, so Stationery row also shows 1150. In "All Sales", ALL(Product) removes the product filter, so every row shows 1750, which is the right denominator for the percentage: 600 / 1750 = 34.3%.</p>
<p><b>Row context vs filter context:</b> The column Line Amount = Sales[Qty] * Sales[UnitPrice] is evaluated in a row context (one row at a time, no filters needed). The measure Total Sales in a matrix cell is evaluated in a filter context (which rows are visible). SUMX creates a row context inside a measure.</p>`,
      practice: [
        [`Write a measure for Accessories sales and say what it shows in the Stationery row of a matrix.`, `${pre(`Accessories Sales = CALCULATE([Total Sales], Product[Category] = "Accessories")`)}It shows 1150 in the Stationery row too, because CALCULATE replaces the Category filter with Accessories.`],
        [`Write a measure that gives sales of lines above 250 and its value.`, `${pre(`High Value Sales = CALCULATE([Total Sales], FILTER(Sales, Sales[Line Amount] > 250))`)}Value: 1200. FILTER goes through each Sales row and keeps those with Line Amount above 250 (S3, S4, S5).`],
        [`Write Sales % of Total by category and give the Accessories value.`, `${pre(`Sales % of Total = DIVIDE([Total Sales], CALCULATE([Total Sales], ALL(Product)))`)}Accessories: 1150 / 1750 = 65.7%. ALL(Product) removes the category filter in the denominator.`],
        [`How many unique customers bought Accessories? Write a measure and the value.`, `${pre(`Accessory Customers = CALCULATE(DISTINCTCOUNT(Sales[CustomerID]), Product[Category] = "Accessories")`)}Accessories lines are S2 (C1), S4 (C3), S5 (C2), so 3 customers.`],
        [`Explain row context vs filter context in two or three sentences with one example each.`, `<p>Row context means the current row: in the calculated column Line Amount = Qty * UnitPrice each row uses its own Qty and UnitPrice. Filter context means the filters applied to the data: in a matrix cell for Mumbai the measure Total Sales only sees rows of Mumbai customers (950). CALCULATE changes the filter context, and an iterator like SUMX creates a row context.</p>`],
        [`Advanced: Write a calculated column on Customer that gives each customer's total sales. Values?`, `${pre(`Customer Total = CALCULATE([Total Sales])`)}C1 = 550, C2 = 800, C3 = 400. Inside a calculated column, the current row is turned into a filter by CALCULATE (context transition), so the measure sees only that customer's sales.`]
      ],
      important: [
        [`Explain CALCULATE.`, `<p>CALCULATE evaluates an expression in a modified filter context. For example CALCULATE([Total Sales], Product[Category] = "Accessories") gives sales for that category. It can add, replace or remove filters, using functions like FILTER, ALL and REMOVEFILTERS.</p>`],
        [`Row context vs filter context?`, `<p>Row context is the current row, as in calculated columns and iterators like SUMX. Filter context is the filters from slicers, visual axes, relationships and CALCULATE that decide which rows a measure sees. CALCULATE turns a row context into a filter context.</p>`],
        [`How do you calculate percent of total?`, `<p>DIVIDE([Total Sales], CALCULATE([Total Sales], ALL(Product))). The numerator follows the visual filters, the denominator removes the product filter to give the grand total. I choose the table or column inside ALL according to which level of total I need.</p>`],
        [`What is the difference between ALL and FILTER?`, `<p>ALL removes filters from a table or column. FILTER returns only the rows of a table that meet a condition. I use FILTER to add a rule and ALL to remove one.</p>`]
      ],
      resources: [[`DAX Guide`, `https://dax.guide`], [`SQLBI`, `https://www.sqlbi.com`], [`Guy in a Cube (YouTube)`, `https://www.youtube.com/@GuyInACube`]],
      done: `You are done when you can write Net Sales, Unique Customers, a CALCULATE category measure and a percent-of-total measure without notes, and explain filter context aloud.`
    },
    {
      title: `Weekend project: Superstore Power BI dashboard (2 pages)`,
      time: `3.5 h`,
      study: [
        `Plan before you build: write 4 business questions. Example: How are sales and profit trending? Which category and region earn most? Which sub-categories lose money? Do discounts hurt profit?`,
        `Model: a flat Superstore sheet can be used directly for a first dashboard. For a better score, split it into Fact (Orders) and dimensions (Product, Customer, Location) in Power Query and add a Calendar table.`,
        `To split a dimension in Power Query: right-click the Superstore query > Reference, keep the needed columns (Home > Choose Columns), then Remove Duplicates. Check that the key (for example Product ID) is unique. In some Superstore versions one Product ID has more than one name; if the relationship fails, use a different key or keep that dimension in the flat table.`,
        `Calendar table (Modeling > New table): Calendar = CALENDAR(MIN(Orders[Order Date]), MAX(Orders[Order Date])). Add Year = YEAR('Calendar'[Date]), MonthNum = MONTH('Calendar'[Date]), Month = FORMAT('Calendar'[Date], "MMM"). Relate Calendar[Date] to Orders[Order Date] and Mark as date table.`,
        `Core measures: Total Sales, Total Profit, Profit Margin %, Orders (distinct), Unique Customers, Avg Discount.`,
        `Page 1 (Overview): KPI cards, sales trend, sales by region, sales by category, slicers. Page 2 (Product): matrix by category and sub-category, top and bottom sub-categories by profit, scatter of Sales vs Profit.`,
        `Design rules: KPI row on top, one theme colour plus one accent, same chart sizes, aligned edges (Format > Align), titles that state the point, no more than 7 visuals per page.`,
        `Column names with spaces need square brackets in DAX: Orders[Order Date], Orders[Sales]. Use the exact names from your file.`
      ],
      how: [
        `[10 min] Write 4 business questions in a text file. Download Superstore from Kaggle Datasets (search "Superstore") or reuse your Week 3 file.`,
        `[25 min] Get data > Excel or CSV > Transform Data. Check types (dates as Date, Sales/Profit/Discount as Decimal, Quantity as Whole number). Trim text, fix any issues. Close and Apply.`,
        `[20 min] Model: add the Calendar table with the DAX above; create relationships; Mark as date table (Table tools). Optional: split dimensions in Power Query.`,
        `[25 min] Create measures: Total Sales, Total Profit, Profit Margin %, Orders, Unique Customers. Format them (Measure tools).`,
        `[35 min] Page 1 Overview: 4 cards, line chart (Calendar Month by Sales), bar (Region), donut or bar (Category), slicers for Year and Region. Align and format.`,
        `[35 min] Page 2 Product: matrix (Category > Sub-Category with Sales, Profit, Margin %), bar with Top 10 sub-categories by Profit, bar of bottom 5, scatter (Sales on X, Profit on Y, details Sub-Category).`,
        `[20 min] Add page navigation (optional), titles, and Sync slicers. Test every slicer and cross-filter.`,
        `[25 min] Write 3-5 insights with numbers in a text box. Export: File > Export > Export to PDF. Take screenshots. Save the .pbix. Deliverable: Superstore.pbix + PDF/screenshots.`
      ],
      example: `<p>Measures to create (adjust names to your table; here the table is called Orders):</p>${pre(`Total Sales      = SUM(Orders[Sales])
Total Profit     = SUM(Orders[Profit])
Profit Margin %  = DIVIDE([Total Profit], [Total Sales])
Orders           = DISTINCTCOUNT(Orders[Order ID])
Unique Customers = DISTINCTCOUNT(Orders[Customer ID])
Avg Discount     = AVERAGE(Orders[Discount])
Sales Share %    = DIVIDE([Total Sales], CALCULATE([Total Sales], ALL(Orders[Category])))`)}
<p>Calendar table (Modeling > New table):</p>${pre(`Calendar = CALENDAR(MIN(Orders[Order Date]), MAX(Orders[Order Date]))`)}
<p>Then add columns (Table tools > New column): <code>Year = YEAR('Calendar'[Date])</code>, <code>MonthNum = MONTH('Calendar'[Date])</code>, <code>Month = FORMAT('Calendar'[Date], "MMM")</code>. Set Month to sort by MonthNum.</p>
<p>Page layouts:</p>${pre(`PAGE 1 - OVERVIEW
[Year slicer] [Region slicer]
[Sales card] [Profit card] [Margin % card] [Orders card] [Customers card]
[Sales by Month (line)         ] [Sales by Category (donut/bar)]
[Sales by Region (bar)         ] [Top 5 States (bar)           ]

PAGE 2 - PRODUCT
[Category slicer]
[Matrix: Category > Sub-Category | Sales | Profit | Margin %]
[Top 10 Sub-Category by Profit]  [Bottom 5 Sub-Category by Profit]
[Scatter: Sales (X) vs Profit (Y), detail = Sub-Category]`)}
<p><b>Check your numbers:</b> Total Sales on the card must equal the total of the matrix and the sum of the bar chart. If not, a filter or a relationship is wrong. Also compare with =SUM() of the Sales column in Excel.</p>
<p><b>Insight format:</b> "Finding + number + action". Example pattern: "[Sub-category] loses money (profit [x]) while discount averages [y%], so cap discounts there." Use your real numbers.</p>`,
      practice: [
        [`Write the Profit Margin % measure and say what you see if it is negative in a sub-category.`, `${pre(`Profit Margin % = DIVIDE([Total Profit], [Total Sales])`)}A negative margin means the sub-category loses money. Check discount and cost drivers next.`],
        [`Orders count: why DISTINCTCOUNT(Orders[Order ID]) and not COUNTROWS(Orders)?`, `<p>In Superstore an order has several lines (one per product). COUNTROWS counts lines, DISTINCTCOUNT counts each order once, which is the business meaning of "orders".</p>`],
        [`Write the Calendar table in DAX and name two requirements for it to work with time intelligence.`, `${pre(`Calendar = CALENDAR(MIN(Orders[Order Date]), MAX(Orders[Order Date]))`)}It must have continuous dates without gaps, be related to the fact table on the date column, and be marked as a date table.`],
        [`The total on the card is different from the total in the matrix. List 3 causes.`, `<p>1) A slicer, page or visual filter applies to one but not the other. 2) Interactions: a visual is not filtered by another (Edit interactions). 3) Missing or wrong relationship, or duplicates in a dimension key. Compare with the raw total from the source.</p>`],
        [`How do you show the 5 worst sub-categories by profit?`, `<p>Add a bar chart with Sub-Category and Total Profit. In the Filters pane choose Sub-Category > Filter type: Top N > Show items: Bottom 5 > By value: Total Profit > Apply filter.</p>`],
        [`Give 3 design improvements for a dashboard that has 14 visuals, 8 colours and no titles.`, `<p>Cut to 5-7 visuals that answer the business questions, use one theme colour and one accent for highlights, add titles that say the point, align and size visuals equally, put KPIs on top, and add a short insight box.</p>`]
      ],
      important: [
        [`Walk me through your Power BI dashboard project.`, `<p>I use STAR. Situation: a retail dataset and questions about sales and profit. Task: build a 2-page dashboard for managers. Action: cleaned data in Power Query, built a star schema with a Calendar table, wrote measures for sales, profit, margin and unique customers, and designed Overview and Product pages with slicers. Result: say what YOUR dashboard showed (in the common Superstore data some sub-categories lose money where discounts are high, but quote only what you actually found) and the action you recommended, such as a discount cap. I keep it to 2 minutes and offer a deep dive.</p>`],
        [`How do you optimise a slow report?`, `<p>Use a star schema, remove unused columns and tables, reduce high-cardinality columns, prefer measures over calculated columns, avoid heavy iterators, use Import mode, limit visuals per page, and check Performance Analyzer (View > Performance analyzer) to see which visual is slow.</p>`],
        [`What do you do when numbers on the dashboard do not match the source?`, `<p>I compare grand totals first, then check filters and slicers, relationships and duplicates in dimension keys, data types and the Power Query steps like remove duplicates or filters. I validate with a simple SQL or Excel total.</p>`]
      ],
      resources: [[`Kaggle Datasets`, `https://www.kaggle.com/datasets`], [`Maven Analytics Data Playground`, `https://mavenanalytics.io/data-playground`], [`DAX Guide`, `https://dax.guide`]],
      done: `You are done when you have a 2-page Superstore.pbix with working slicers, 5 measures, a Calendar table, 3-5 written insights, and a PDF or screenshots saved.`
    },
    {
      title: `Review: Power BI Q&A + 5 SQL problems + optional publish`,
      time: `3.5 h`,
      study: [
        `Revise the Power BI Q&A: measure vs column, star schema, CALCULATE, row vs filter context, import vs DirectQuery, calendar table, RLS, optimisation.`,
        `Revise DAX from memory: Total Sales, Net Sales, Unique Customers, Discount %, Profit Margin %, Sales % of Total, an Accessories-style CALCULATE measure.`,
        `Time intelligence preview (Week 5): Sales LY = CALCULATE([Total Sales], SAMEPERIODLASTYEAR('Calendar'[Date])); YoY % = DIVIDE([Total Sales] - [Sales LY], [Sales LY]). It needs a marked Date table.`,
        `Row-Level Security idea: a DAX filter on a role, such as Region[Region] = "North", so a user sees only those rows. You define it in Desktop (Modeling > Manage roles), assign users in Service.`,
        `SQL habit: keep solving 5 problems every review day. Today uses customers and orders tables (LEFT JOIN, GROUP BY, HAVING, DATE_TRUNC, ROW_NUMBER).`,
        `Optional: Publish to Power BI Service: Home > Publish. It needs a work or school account. Personal email addresses (Gmail and similar) are usually not accepted. If you cannot publish, use File > Export > Export to PDF and keep screenshots instead.`
      ],
      how: [
        `[40 min] Open Interview Q&A, Power BI and DAX section. Answer each question aloud in 30-60 seconds before reading the model answer. Mark weak ones.`,
        `[40 min] DAX from memory: close all notes and write the 8 measures from Day 4-6 in a blank Power BI file or on paper. Check against your .pbix.`,
        `[60 min] Solve the 5 SQL problems below. Write the query first, then run it on a small test table.`,
        `[20 min] Optional: try Home > Publish. If it works, open the report in the browser. If it is blocked, export to PDF.`,
        `[20 min] Update your cheat sheet: DAX functions, relationship rules, visual choices.`,
        `[30 min] Say your project walkthrough aloud once and record it on your phone. Note where you hesitate.`
      ],
      example: `<p>Tables for the SQL problems (PostgreSQL):</p>${pre(`customers                      orders
customer_id  name              order_id  customer_id  order_date   amount
1            Asha              101       1            2025-01-05   500
2            Ravi              102       1            2025-01-20   300
3            Meena             103       2            2025-02-10   700
4            Karan             104       3            2025-02-15   200
                               105       1            2025-03-01   400`)}
<p>Problem 1: customers who never ordered.</p>${pre(`SELECT c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
WHERE o.order_id IS NULL;`)}
<p>Result: Karan. The LEFT JOIN keeps every customer. Customers without orders get NULL in the order columns, and the WHERE keeps only those.</p>`,
      practice: [
        [`SQL: Total order amount per customer, including customers with no orders (show 0). Give the result.`, `${pre(`SELECT c.name, COALESCE(SUM(o.amount), 0) AS total_amount
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
GROUP BY c.customer_id, c.name
ORDER BY total_amount DESC;`)}Grouping by customer_id as well as name keeps two customers with the same name separate. Asha 1200, Ravi 700, Meena 200, Karan 0. SUM of nothing is NULL, so COALESCE turns it into 0.`],
        [`SQL: Monthly revenue.`, `${pre(`SELECT DATE_TRUNC('month', order_date)::date AS month,
       SUM(amount) AS revenue
FROM orders
GROUP BY 1
ORDER BY 1;`)}2025-01-01 = 800, 2025-02-01 = 900, 2025-03-01 = 400. DATE_TRUNC rounds each date down to the first day of its month.`],
        [`SQL: Customers with more than one order.`, `${pre(`SELECT customer_id, COUNT(*) AS order_count
FROM orders
GROUP BY customer_id
HAVING COUNT(*) > 1;`)}Result: customer 1 (Asha) with 3 orders. HAVING filters after grouping; WHERE cannot use COUNT.`],
        [`SQL: Each customer's latest order.`, `${pre(`SELECT customer_id, order_id, order_date, amount
FROM (
  SELECT *,
         ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn
  FROM orders
) t
WHERE rn = 1;`)}Result: order 105 (customer 1), 103 (customer 2), 104 (customer 3).`],
        [`SQL: Running total of revenue by order date.`, `${pre(`SELECT order_id, order_date, amount,
       SUM(amount) OVER (ORDER BY order_date, order_id) AS running_total
FROM orders;`)}Running totals: 500, 800, 1500, 1700, 2100. Adding order_id in the ORDER BY makes the order fixed if two rows have the same date.`],
        [`DAX recall: write Net Sales, Unique Customers, and a measure for sales of the Accessories category. Then explain what happens to the last one in a category matrix.`, `${pre(`Net Sales = SUM(Sales[Gross]) - SUM(Sales[Discount]) - SUM(Sales[Returns])
Unique Customers = DISTINCTCOUNT(Sales[CustomerID])
Accessories Sales = CALCULATE([Total Sales], Product[Category] = "Accessories")`)}In a matrix by category the Accessories measure shows the Accessories total on every row, because CALCULATE replaces the category filter.`]
      ],
      important: [
        [`How do you create a Year-over-Year growth measure?`, `${pre(`Sales LY = CALCULATE([Total Sales], SAMEPERIODLASTYEAR('Calendar'[Date]))
YoY % = DIVIDE([Total Sales] - [Sales LY], [Sales LY])`)}<p>It needs a continuous Calendar table, marked as a date table and related to the fact table.</p>`],
        [`What is Row-Level Security?`, `<p>RLS restricts which rows a user sees using DAX filter rules on roles, for example Region[Name] = "North". I define roles in Power BI Desktop (Modeling > Manage roles) and assign users in the Service. A security table with USERPRINCIPALNAME() can make it dynamic.</p>`],
        [`Tell me about yourself and one Power BI project.`, `<p>Give 60-90 seconds on your survey programming background with 2+ years, then link it: "I clean and validate respondent data, so I enjoy the data side. I built a Superstore dashboard in Power BI with a Calendar table and measures like Net Sales and Unique Customers, and I found which sub-categories lose money." Then offer a deep dive.</p>`]
      ],
      resources: [[`Microsoft Learn: Power BI`, `https://learn.microsoft.com/en-us/training/powerplatform/power-bi`], [`DAX Guide`, `https://dax.guide`], [`DataLemur (interview-style)`, `https://datalemur.com`]],
      done: `You are done when you can answer the Power BI Q&A aloud, write the 8 core measures from memory, and solve the 5 SQL problems without hints.`
    }
  ]
};
