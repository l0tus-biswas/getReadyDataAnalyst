/* ---------------- Power BI / DAX and Excel interview Q&A (overrides QA.pbi and QA.excel from data-qa.js) ---------------- */

QA.pbi={name:'Power BI & DAX',emoji:'📊',
schema:pre(`SHARED SAMPLE MODEL (used by every DAX answer)

Sales (FACT, 8 rows)
OrderID  OrderDate    CustomerID  ProductID  Qty  UnitPrice  Discount
S1       10-Jan-2024  C1          P1         2    100        10
S2       15-Feb-2024  C1          P2         1    250         0
S3       20-Feb-2024  C2          P1         3    100        30
S4       05-Mar-2024  C3          P3         1    400        40
S5       12-Jan-2025  C2          P2         2    250        25
S6       08-Feb-2025  C1          P1         1    100         0
S7       18-Feb-2025  C3          P3         1    400         0
S8       09-Mar-2025  C4          P2         2    250         0

Product (DIM)                 Customer (DIM)
ProductID  Name      Category     CustomerID  Name   City
P1         Notebook  Stationery   C1          Asha   Mumbai
P2         Bag       Accessories  C2          Ravi   Delhi
P3         Lamp      Accessories  C3          Meena  Mumbai
                                  C4          Karan  Pune

Calendar (DIM) = CALENDAR(DATE(2024,1,1), DATE(2025,12,31))
columns: Date, Year, MonthNum, Month   (marked as date table)

Relationships (all one-to-many, single direction, active):
Product[ProductID]   1 -> *  Sales[ProductID]
Customer[CustomerID] 1 -> *  Sales[CustomerID]
Calendar[Date]       1 -> *  Sales[OrderDate]

BASE MEASURES (assumed in later answers)
Gross Sales      = SUMX(Sales, Sales[Qty] * Sales[UnitPrice])   -- 2650
Net Sales        = [Gross Sales] - SUM(Sales[Discount])         -- 2545
Unique Customers = DISTINCTCOUNT(Sales[CustomerID])             -- 4

HAND-WORKED REFERENCE VALUES
Net Sales by year : 2024 = 1070, 2025 = 1475
Net Sales by month: Jan-24 190, Feb-24 520, Mar-24 360, Jan-25 475, Feb-25 500, Mar-25 500
Net Sales by product: Notebook 560, Bag 1225, Lamp 760
Net Sales by category: Stationery 560, Accessories 1985
Net Sales by customer: Asha 540, Ravi 745, Meena 760, Karan 500`),
list:[

/* ---------- EASY ---------- */
{q:'Walk me through a Power BI project you have done. (very common opening question)',
short:'I answer in four parts: the business problem, the data and model I built, the key measures and visuals, and the result. I keep it to about two minutes and then offer to go deeper.',
a:`<p>Interviewers want to see that you understand the <b>whole flow</b>: problem, data, cleaning, model, DAX, visuals, insight, impact. Use STAR (Situation, Task, Action, Result). Fill the brackets with <b>your real</b> project facts. Never invent numbers; if you do not have an exact figure, say "roughly" or describe the change in words.</p>
${pre(`SITUATION: [Team/client] needed to see [business question, e.g. why sales were
           falling in some regions] but the data sat in [N] Excel/CSV/SQL sources
           and reports were built by hand every [week/month].
TASK:      I was responsible for [my part: data prep / model / dashboard / all of it]
           for [N] users in [team].
ACTION:    1. Loaded [N] tables from [source] and cleaned them in Power Query
              (fixed types, removed duplicates, merged [A] with [B]).
           2. Built a star schema: 1 fact table ([Sales]) and [N] dimensions
              (Date, Product, Customer), one-to-many relationships.
           3. Wrote [N] DAX measures: Net Sales, Unique Customers, YoY %, YTD,
              % of total.
           4. Built [N] pages: Overview (KPI cards, trend), Detail (matrix, drill-through).
              Added slicers, a tooltip, bookmarks for navigation.
           5. Published to the Service, set scheduled refresh [daily at X] via [gateway/cloud].
RESULT:    [N] manual hours per [week] saved, OR [stakeholder] used it to decide
           [decision]. Insight: [one finding with a number from your real data].
LEARNED:   [one challenge, e.g. slow report fixed by removing unused columns].`)}
<p><b>Why this works:</b> it shows the pipeline in order, uses the vocabulary interviewers listen for (star schema, measures, Power Query, refresh) and ends with business impact, which is what a hiring manager remembers. Practise it aloud until it is under two minutes.</p>`,
lvl:'E',freq:3,
follow:['Why did you choose a star schema for this project?','What was the hardest DAX measure you wrote?','How did you check that your numbers were correct?'],
mistake:'Listing tools and visuals ("I used cards, bar charts and slicers") without a business problem or a result. Also inventing impressive numbers that fall apart under follow-up questions.',
tags:['project','behavioural','star']},

{q:'What is the difference between a calculated column and a measure?',
short:'A calculated column is calculated row by row when the data refreshes and is stored in the model. A measure is calculated on the fly for whatever filters are active in the visual and takes no storage. I use measures for totals and ratios, and columns when I need a value to slice or filter by.',
a:`<p><b>Calculated column</b>: evaluated for <b>each row</b> at refresh time, result stored in the table (uses memory), behaves like any other column, so it can go on an axis, in a slicer or in a filter.</p>
<p><b>Measure</b>: evaluated at <b>query time</b> using the current filter context (slicers, rows and columns of the visual). Not stored, so it is light. Its answer changes from cell to cell.</p>
${pre(`-- Calculated column (row context, stored)
Line Amount = Sales[Qty] * Sales[UnitPrice]
-- values: 200, 250, 300, 400, 500, 100, 400, 500

-- Measure (filter context, not stored)
Total Line Amount = SUM(Sales[Line Amount])    -- 2650 on a card
                                              -- Accessories row: 250+400+500+400+500 = 2050`)}
<p><b>Rule of thumb:</b> if you will aggregate it (sum, average, ratio, % of total), write a measure. If you need to group or filter by it (for example an "Age band" or "Price band" label), use a column, ideally created in Power Query so it is not stored twice.</p>
<p><b>Why it matters:</b> a column that duplicates data makes the file bigger and slower; and a ratio stored as a column cannot be re-aggregated correctly at a total.</p>`,
lvl:'E',freq:3,
follow:['Can a measure be used on a slicer or an axis?','Where would you add a new column: Power Query or DAX?'],
mistake:'Saying a measure is "faster" without saying why, or creating calculated columns for numbers that should be measures (for example a percentage column that then gets summed).',
tags:['dax','model']},

{q:'What is a star schema and why do we use it in Power BI?',
short:'A star schema has one central fact table with the numbers, such as sales, connected to small dimension tables like product, customer and date through one-to-many relationships. It is fast, easy to understand and keeps DAX simple and correct.',
a:`<p><b>Fact table</b>: one row per event/transaction with numbers and keys (Sales: Qty, UnitPrice, Discount, CustomerID, ProductID, OrderDate).</p>
<p><b>Dimension tables</b>: descriptive attributes, one row per item (Product, Customer, Calendar). Used for slicers, rows and columns.</p>
${pre(`Product (1) ---->\\
                    (*) Sales (*) <---- (1) Customer
Calendar (1) ---->/`)}
<p><b>Why not one big flat table?</b> Product name and city repeat on every row (bigger file, typos like Mumbai/Mumbay), time intelligence needs a Date table, and DAX gets harder. <b>Why not snowflake?</b> Dimension-to-dimension chains add hops and complexity; for Power BI, flatten them into one dimension in Power Query.</p>
<p><b>How filters flow:</b> a slicer on Product[Category] = "Accessories" filters Product, which filters the related Sales rows (S2, S4, S5, S7, S8). The filter travels from the one side to the many side.</p>`,
lvl:'E',freq:3,
follow:['Star schema vs snowflake: which do you prefer?','What is the grain of your fact table?'],
mistake:'Describing the schema only in words ("tables connected") without naming fact vs dimension, one-to-many and the direction the filter flows.',
tags:['model','star']},

{q:'Write a measure for Net Sales and one for Unique Customers. What do they return on the sample data?',
short:'Net Sales is gross sales minus discount; I sum Qty times Price row by row with SUMX and subtract the discount total. Unique Customers is DISTINCTCOUNT on the customer ID so each customer counts once.',
a:`${pre(`Gross Sales = SUMX(Sales, Sales[Qty] * Sales[UnitPrice])
Net Sales   = [Gross Sales] - SUM(Sales[Discount])
Unique Customers = DISTINCTCOUNT(Sales[CustomerID])`)}
<p><b>On the sample:</b> Gross = 200+250+300+400+500+100+400+500 = <b>2650</b>. Discount = 10+0+30+40+25+0+0+0 = 105. Net Sales = 2650 - 105 = <b>2545</b>. Unique Customers = C1, C2, C3, C4 = <b>4</b> (COUNT would give 8 rows).</p>
<p><b>Why it works:</b> SUMX goes row by row so it can multiply Qty by UnitPrice before adding; DISTINCTCOUNT ignores repeats. If your table also has a Returns column, subtract SUM(Sales[Returns]) too. Say this to the interviewer; it shows you ask about the business definition first.</p>
<p>Note: DISTINCTCOUNT counts a BLANK as one value if blanks exist; use DISTINCTCOUNTNOBLANK to ignore blanks.</p>`,
lvl:'E',freq:3,
follow:['Why not SUM(Sales[Qty]) * SUM(Sales[UnitPrice])?','Difference between COUNT, COUNTROWS and DISTINCTCOUNT?'],
mistake:'Writing SUM(Sales[Qty] * Sales[UnitPrice]), which is invalid because SUM takes one column, not an expression. Use SUMX or a calculated column.',
tags:['dax','measure']},

{q:'SUM vs SUMX: what is the difference and when do you use SUMX?',
short:'SUM adds up one column. SUMX is an iterator: it goes row by row, calculates an expression, and then adds the results. I use SUMX when I need row-level maths such as Qty times Price before totalling.',
a:`${pre(`Total Qty    = SUM(Sales[Qty])                              -- 13
Gross Sales  = SUMX(Sales, Sales[Qty] * Sales[UnitPrice])   -- 2650`)}
<p><b>Why not multiply the totals?</b> SUM(Qty) x SUM(UnitPrice) = 13 x 1850 = 24,050, which is wrong. Revenue must be multiplied <b>per row</b> first (2x100, 1x250, 3x100 ...) and then added.</p>
<p>SUM(col) is really shorthand for SUMX over that column. The X family (AVERAGEX, MINX, MAXX, COUNTX) all work the same: table first, expression second. Inside the expression you have a <b>row context</b>; use RELATED() to reach a column on the one-side table, for example <code>SUMX(Sales, Sales[Qty] * RELATED(Product[Cost]))</code>.</p>
<p>Performance: iterators over a huge fact table with complex logic can be slow; keep the expression simple.</p>`,
lvl:'E',freq:3,
follow:['What is a row context?','Would you rather store Line Amount as a column and use SUM?'],
mistake:'Believing SUMX and SUM always give the same result. They do only when the expression is just the column itself.',
tags:['dax','iterator']},

{q:'Write a Discount % measure. Why use DIVIDE instead of the / operator?',
short:'Discount % is total discount divided by gross sales. I use DIVIDE because it returns a blank instead of an error when the denominator is zero, so visuals do not break.',
a:`${pre(`Discount % = DIVIDE(SUM(Sales[Discount]), [Gross Sales])
-- 105 / 2650 = 0.0396  (format as percentage: 3.96%)`)}
<p>DIVIDE(numerator, denominator, [alternate result]). If the denominator is 0 or blank it returns BLANK, or the alternate result if you give one, e.g. <code>DIVIDE(a, b, 0)</code>.</p>
<p><b>Important:</b> do not average a stored percentage column to get an overall rate. Weighted correctly it is total discount / total sales (105 / 2650), not the average of each row's percentage.</p>`,
lvl:'E',freq:3,
follow:['What does the measure show for a month with no sales?','Why should percentages be measures, not columns?'],
mistake:'Using a plain / operator and getting "Infinity" or NaN for empty periods, or averaging row-level percentages.',
tags:['dax','measure']},

{q:'Import vs DirectQuery vs Live Connection: what is the difference and which would you choose?',
short:'Import copies data into Power BI, so it is fastest and supports all of DAX, but it needs scheduled refresh. DirectQuery leaves data in the source and queries it live, so it is always current but slower and has some limits. Live Connection uses an existing Analysis Services or published semantic model. I default to Import unless the data is too big or must be real-time.',
a:`${pre(`Mode           Data stored        Speed     Freshness        Notes
Import         inside .pbix       fastest   on refresh       full DAX + Power Query; size limits depend on licence
DirectQuery    stays in source    slower    live             every visual fires a query; some DAX/Power Query limits;
                                                             source performance matters
Live connection existing model    fast      model's refresh  no own model: you only build reports
Composite      mix of both        mixed     mixed            e.g. big fact in DirectQuery, small dims in Import`)}
<p><b>Choose Import</b> for CSV/Excel and for most databases: quick visuals, scheduled refresh. <b>Choose DirectQuery</b> when data is too large to import or must show the latest values, and make sure the source is indexed. CSV and Excel files do not support DirectQuery.</p>
<p>Newer option: Direct Lake (Microsoft Fabric); mention only if the interviewer brings up Fabric.</p>`,
lvl:'E',freq:3,
follow:['How does a DirectQuery report get refreshed?','What are the downsides of DirectQuery?'],
mistake:'Saying DirectQuery is "better because it is live" without mentioning slower visuals and DAX/transformation limits.',
tags:['import','directquery','model']},

{q:'Why do you need a Calendar (Date) table? What makes a good one?',
short:'Time-intelligence functions like YTD, previous month and same period last year only work properly on a continuous date table. I create a Calendar table with every date, relate it to the fact table, mark it as the date table, and use its Year and Month columns for slicing.',
a:`${pre(`Calendar = CALENDAR(DATE(2024,1,1), DATE(2025,12,31))
Year     = YEAR('Calendar'[Date])
MonthNum = MONTH('Calendar'[Date])
Month    = FORMAT('Calendar'[Date], "MMM")   -- sort Month by MonthNum`)}
<p><b>Requirements:</b> (1) one row per day with no gaps, covering full years; (2) a unique Date column with no time part; (3) a one-to-many relationship Calendar[Date] to Sales[OrderDate]; (4) marked as date table (Table tools > Mark as date table).</p>
<p><b>Why not use the date column in Sales?</b> It has gaps (days with no sales), so DATEADD/SAMEPERIODLASTYEAR can return wrong or blank results, and you could not show months with zero sales. Also one shared Calendar slices all fact tables consistently.</p>
<p>Tip: for an Indian financial year (April to March), add FinYear and FinQuarter columns to the Calendar.</p>`,
lvl:'E',freq:3,
follow:['How do you handle Order Date and Ship Date both related to Calendar?','Can you use the auto date/time feature instead?'],
mistake:'Using the fact table date column for time intelligence, or building a Calendar that stops at the last sales date, which breaks the current year.',
tags:['dax','calendar','time-intelligence']},

{q:'What is the difference between a report and a dashboard? And slicers vs the Filters pane?',
short:'A report is multi-page and interactive, built in Desktop or the Service on one semantic model. A dashboard is a single page of pinned tiles in the Service, often from several reports. A slicer is a visible on-page filter for users; the Filters pane applies filters at visual, page or report level.',
a:`<p><b>Report</b>: one or more pages, many visuals, full cross-filtering, built from one dataset/semantic model. <b>Dashboard</b>: one canvas in the Power BI Service only, with tiles pinned from reports (and can mix sources), supports alerts; clicking a tile opens the source report. Dashboards are not cross-filtered like reports.</p>
<p><b>Slicer</b>: a visual on the page the viewer clicks; good for the filters you want everyone to use (Year, Region); can be synced across pages. <b>Filters pane</b>: filters set by the author at visual / page / all-pages level, hidden or locked if needed; good for permanent rules ("exclude test orders").</p>
<p>Also useful to know: <b>cross-filtering</b> (click a bar and the other visuals filter) versus <b>cross-highlighting</b>, and <b>Edit interactions</b> to switch this off between two visuals.</p>`,
lvl:'E',freq:2,
follow:['How do you sync a slicer across pages?','Can you pin a visual from a report to a dashboard?'],
mistake:'Calling a one-page report a "dashboard". In Power BI the words mean different objects.',
tags:['report','visuals']},

{q:'Which visual would you choose for each of these: trend over time, compare categories, share of total, one KPI, and detail with many numbers?',
short:'Line chart for a trend, bar or column chart to compare categories, a bar or donut with few slices for share of total, a card for one KPI, and a table or matrix for detail. I pick the visual from the question being answered, not from what looks nice.',
a:`${pre(`Question                         Visual (on the sample data)
Trend over time                  Line chart: Net Sales by Calendar[Month]
Compare categories               Clustered bar: Net Sales by Product[Name] (sorted high to low)
Share of total (few parts)       Donut / stacked bar: Net Sales by Category (22% / 78%)
Single headline number           Card: Net Sales = 2545
Detail and totals                Table or matrix: Customer rows, Net Sales and Discount % columns
Relationship of two numbers      Scatter: Gross Sales vs Discount per product
Rank / top N                     Bar chart with Top N visual filter`)}
<p><b>Good practice:</b> one message per visual, sort bars, start bar axes at zero, avoid pie charts with many slices, use few consistent colours, put KPI cards at the top, and add a title that states the finding ("Accessories is 78% of sales"). Add slicers for Year and Category and test cross-filtering.</p>`,
lvl:'E',freq:2,
follow:['Why avoid pie charts with many slices?','Matrix vs table?'],
mistake:'Choosing visuals by appearance (3D, many colours, gauges) instead of by the question the viewer needs answered.',
tags:['visuals','design']},

{q:'Merge vs Append in Power Query: what is the difference?',
short:'Append stacks tables on top of each other, like UNION, when they have the same columns. Merge joins tables side by side on a key column, like a SQL join, and I choose the join kind such as left outer.',
a:`<p><b>Append</b> (Home > Append Queries): combine rows, for example January.csv + February.csv + March.csv into one Sales table. Columns are matched by name; a missing column becomes null.</p>
<p><b>Merge</b> (Home > Merge Queries): add columns from another table by matching a key, for example Sales + Product on ProductID, then expand the columns you need.</p>
${pre(`Join kinds in Merge:
Left Outer  - all rows of first table + matches (most common)
Inner       - only matching rows
Full Outer  - all rows of both
Left Anti   - rows of first table with NO match   (finds missing products)`)}
<p><b>Watch out:</b> merging on a key that is not unique in the second table multiplies rows (one Sales row becomes two). Check keys with Group By or Column profile first. Also, in a star schema you usually do not need to merge a dimension into the fact; you relate them in the model instead. Merge when building a dimension or when you need a column that cannot be reached through a relationship.</p>`,
lvl:'E',freq:3,
follow:['What does a left anti join give you?','When would you not merge and use a relationship instead?'],
mistake:'Merging on a column with duplicate keys and then wondering why totals are inflated.',
tags:['powerquery','merge','append']},

/* ---------- MEDIUM ---------- */
{q:'Explain relationships in Power BI: cardinality, cross-filter direction, active vs inactive.',
short:'Cardinality says how rows match: usually one-to-many from a dimension to the fact table. Cross-filter direction says which way filters flow; single from the dimension to the fact is the default and the safest. Only one relationship between two tables can be active; the others are inactive and I switch them on in a measure with USERELATIONSHIP.',
a:`<p><b>Cardinality:</b> one-to-many (Product 1 -> Sales *) is the standard. Many-to-many exists but is easy to misuse; use a bridge table instead where possible. One-to-one means you can usually merge the tables.</p>
<p><b>Direction:</b> single = the one side filters the many side. Both (bi-directional) lets the fact filter the dimension too; it can create ambiguity and slow reports, so use it only when needed (for example a many-to-many bridge).</p>
<p><b>Active / inactive:</b> only one active relationship between two tables. If Sales has OrderDate and ShipDate both pointing to Calendar[Date], keep OrderDate active and use the other on demand:</p>
${pre(`Sales by Ship Date =
CALCULATE([Net Sales], USERELATIONSHIP(Sales[ShipDate], 'Calendar'[Date]))`)}
<p>(ShipDate is an extra column used only for this example; it is not in the sample table.) If a fact row has a key not found in the dimension, Power BI shows it under a BLANK row: check for it when totals do not match.</p>
<p><b>Why it matters:</b> the model decides how filters travel, so a wrong direction or an extra join changes every number.</p>`,
lvl:'M',freq:3,
follow:['Why avoid bi-directional filters?','What do you do when two tables have more than one possible path?'],
mistake:'Switching every relationship to "Both" to make a visual work. It hides a modelling problem and can cause ambiguous paths and wrong totals.',
tags:['model','relationships']},

{q:'Explain CALCULATE. Write a measure that always shows 2025 Net Sales.',
short:'CALCULATE evaluates an expression after changing the filter context. The first argument is the measure, the next arguments are the filters I add or replace. For example CALCULATE of Net Sales with Year equals 2025 gives 2025 sales whatever else is selected on that column.',
a:`${pre(`Net Sales 2025 = CALCULATE([Net Sales], 'Calendar'[Year] = 2025)    -- 1475`)}
<p><b>On the sample:</b> 2025 lines S5 to S8 give (500-25) + 100 + 400 + 500 = 1475.</p>
<p><b>Rules to remember:</b></p>
<ul><li>A filter on a column <b>replaces</b> any existing filter on that same column, so even if a slicer selects 2024, this measure still shows 1475. Other slicers (Region, Category) still apply.</li>
<li>The simple form <code>'Calendar'[Year] = 2025</code> is shorthand for a FILTER over ALL of that column. For conditions across measures or several columns use FILTER explicitly.</li>
<li>CALCULATE can also <b>remove</b> filters (ALL, REMOVEFILTERS) and <b>switch relationships</b> (USERELATIONSHIP).</li></ul>
${pre(`Accessories Net Sales = CALCULATE([Net Sales], Product[Category] = "Accessories")  -- 1985`)}
<p>Check: Bag 1225 + Lamp 760 = 1985.</p>`,
lvl:'M',freq:3,
follow:['What happens if a slicer already filters the same column?','What is the difference between filtering with a column and using FILTER()?'],
mistake:'Thinking CALCULATE "adds" to the slicer on the same column. It overrides that column filter unless you use KEEPFILTERS.',
tags:['dax','calculate','filter-context']},

{q:'Row context vs filter context. What is context transition?',
short:'Row context means DAX is standing on one row, like in a calculated column or inside SUMX. Filter context means the set of filters from slicers, visual rows and CALCULATE that decide which rows a measure sees. CALCULATE, including a measure reference, turns the current row into a filter; that is context transition.',
a:`<p><b>Row context:</b> exists in calculated columns and inside iterators (SUMX, FILTER, AVERAGEX). It knows the current row of <i>that table</i> only. It does <b>not</b> filter other tables or aggregate by itself.</p>
<p><b>Filter context:</b> the filters active when a measure is evaluated: row/column headers of the visual, slicers, page/report filters, and CALCULATE arguments.</p>
${pre(`Line Amount = Sales[Qty] * Sales[UnitPrice]      -- calculated column: row context
Net Sales cell "Bag"  = filter context Product[Name] = "Bag" -> 1225`)}
<p><b>Context transition:</b> when a measure is called inside a row context, the row is converted into filters. Example in a calculated column on Customer:</p>
${pre(`Customer Net Sales = [Net Sales]      -- calculated column on Customer
-- for Asha the row context becomes Customer[CustomerID] = "C1"
-- so it returns 540, not the grand total 2545`)}
<p>A measure used inside an iterator works the same way: <code>SUMX(VALUES(Customer[CustomerID]), [Net Sales])</code> evaluates [Net Sales] once per customer, each time with that customer filtered.</p>
<p><b>Why it matters:</b> most wrong-number bugs come from confusing these two contexts.</p>`,
lvl:'M',freq:3,
follow:['Why does a plain column reference not work in a measure without an aggregation?','What does RELATED do?'],
mistake:'Saying "row context filters the table". It does not filter anything; only filter context filters. Row context needs CALCULATE (context transition) to become a filter.',
tags:['dax','context','calculate']},

{q:'Write a measure for average Net Sales per customer. What is the value on the sample?',
short:'I divide Net Sales by the number of unique customers with DIVIDE. On the sample that is 2545 divided by 4 which is 636.25.',
a:`${pre(`Net Sales per Customer = DIVIDE([Net Sales], [Unique Customers])
-- 2545 / 4 = 636.25`)}
<p>Per customer: Asha 540, Ravi 745, Meena 760, Karan 500; average = 2545 / 4 = 636.25.</p>
<p><b>Why it works:</b> both measures use the same filter context, so at a month level it divides that month's sales by the customers who bought that month (Feb-2025: net 500 and 2 customers C1, C3, so 250).</p>
<p>Related ideas to mention: <b>Average Order Value</b> = DIVIDE([Net Sales], DISTINCTCOUNT(Sales[OrderID])) = 2545 / 8 = 318.13 here (each OrderID is one line in this sample; in real data an order has many lines, which is why DISTINCTCOUNT is used).</p>`,
lvl:'M',freq:3,
follow:['Average per customer vs average per order?','Why not AVERAGE on a column?'],
mistake:'Using AVERAGE(Sales[...]) which averages rows (lines), not customers.',
tags:['dax','measure','average']},

{q:'Explain ALL, ALLEXCEPT, REMOVEFILTERS and ALLSELECTED with an example.',
short:'They all change which filters CALCULATE keeps. ALL and REMOVEFILTERS clear filters from a table or column. ALLEXCEPT clears everything on a table except the columns I name. ALLSELECTED removes the visual-level filters but keeps what the user chose in slicers, which makes it best for percentage of what is selected.',
a:`${pre(`All Net Sales      = CALCULATE([Net Sales], REMOVEFILTERS(Product))      -- 2545 in every cell
Category Net Sales = CALCULATE([Net Sales], ALLEXCEPT(Product, Product[Category]))
-- on a product row: Notebook 560, Bag 1985, Lamp 1985 (category total)
Selected Net Sales = CALCULATE([Net Sales], ALLSELECTED(Product))`)}
<ul><li><b>ALL(table or column)</b>: returns all rows and, inside CALCULATE, removes the filter. Also usable as a table function (in RANKX, FILTER).</li>
<li><b>REMOVEFILTERS</b>: same effect as ALL but only allowed as a CALCULATE filter modifier; reads clearer ("remove filters"). Available in newer versions of Power BI Desktop.</li>
<li><b>ALLEXCEPT(table, col1, ...)</b>: clear all filters on that table except those columns.</li>
<li><b>ALLSELECTED</b>: clears the visual's own row/column filters but keeps slicers and outer filters. Example: a slicer picks only Accessories; ALLSELECTED gives the base for "share of what I selected", whereas ALL ignores the slicer.</li></ul>
<p><b>Why it matters:</b> these are what make "% of total" and "share within category" measures possible.</p>`,
lvl:'M',freq:3,
follow:['When would ALLSELECTED give a different % than ALL?','Does ALL(Product) also clear a filter on Product[Name]?'],
mistake:'Using ALL(Sales) when the filter lives on a dimension. The filter sits on Product or Calendar, so clear it there, not on the fact table.',
tags:['dax','all','filter-context']},

{q:'Write a "% of total" measure. Show the result by Category on the sample data.',
short:'I divide the current Net Sales by Net Sales with the category filter removed, using CALCULATE and ALL, wrapped in DIVIDE. Stationery is 560 out of 2545 which is about 22 percent, and Accessories is 1985 which is about 78 percent.',
a:`${pre(`Net Sales % of Total =
DIVIDE([Net Sales], CALCULATE([Net Sales], ALL(Product[Category])))`)}
${pre(`Category      Net Sales   % of Total
Stationery         560        22.0%
Accessories       1985        78.0%
Total             2545       100.0%`)}
<p>560 / 2545 = 0.2200; 1985 / 2545 = 0.7800 (rounded).</p>
<p><b>Why it works:</b> the numerator keeps the row's category filter; the denominator removes only the Category filter, so it is always the grand total. At the Total row both are 2545, so 100%.</p>
<p><b>Variation:</b> if the user also filters with a slicer and you want the percentage of the selected total, use ALLSELECTED(Product[Category]) instead of ALL. If the visual shows Product[Name], clear ALL(Product[Name]) or ALL(Product) as appropriate; the column you clear must match the rows shown.</p>`,
lvl:'M',freq:3,
follow:['What if the visual is by product name and not category?','ALL vs ALLSELECTED here?'],
mistake:'Clearing a column that is not in the visual, so the denominator is not the grand total and the percentages do not add to 100%.',
tags:['dax','all','percent']},

{q:'Write a Year-to-Date (YTD) Net Sales measure. What is the value at February 2025?',
short:'I use TOTALYTD with Net Sales and the date column of the Calendar table. For February 2025 it adds January and February 2025, which is 475 plus 500 equals 975.',
a:`${pre(`Net Sales YTD = TOTALYTD([Net Sales], 'Calendar'[Date])
-- same as: CALCULATE([Net Sales], DATESYTD('Calendar'[Date]))`)}
${pre(`Month     Net Sales   YTD
Jan-2025       475    475
Feb-2025       500    975
Mar-2025       500   1475      (equals the 2025 total)`)}
<p>Jan-25: S5 = 500 - 25 = 475. Feb-25: S6 100 + S7 400 = 500. YTD resets in January: Jan-2024 YTD would be 190, Feb-2024 = 190 + 520 = 710.</p>
<p><b>Why it works:</b> DATESYTD returns all dates from 1 January of the current year up to the last date in the current filter context; CALCULATE then evaluates Net Sales over that set. It needs a proper Calendar table.</p>
<p><b>Indian financial year (April to March):</b> pass the year-end date as the third argument, e.g. <code>TOTALYTD([Net Sales], 'Calendar'[Date], "3/31")</code>. The string format can depend on locale; test it in your file.</p>`,
lvl:'M',freq:3,
follow:['How would you make it a fiscal YTD?','What is the difference between YTD and a running total?'],
mistake:'Using the fact table date, or a Calendar with gaps, which gives blanks or wrong YTD values.',
tags:['dax','time-intelligence','ytd']},

{q:'Write a "previous month" measure and a Month-over-Month % measure. What is MoM for Feb 2025?',
short:'I shift the date filter back one month with DATEADD inside CALCULATE to get previous month sales, and then MoM percent is current minus previous divided by previous using DIVIDE. For February 2025 it is 500 against 475, which is about plus 5.3 percent.',
a:`${pre(`Net Sales PM = CALCULATE([Net Sales], DATEADD('Calendar'[Date], -1, MONTH))
Net Sales MoM % = DIVIDE([Net Sales] - [Net Sales PM], [Net Sales PM])`)}
${pre(`Month     Net Sales   PM    MoM %
Jan-2025       475   (blank: Dec-24 has no sales)  blank
Feb-2025       500   475     +5.26%     (25 / 475)
Mar-2025       500   500      0.00%`)}
<p>Jan-2025: Dec-2024 is in the Calendar but has no sales, so PM is blank and DIVIDE returns blank. For Jan-2024, DATEADD would go to Dec-2023, which is outside the Calendar, so the result is blank too.</p>
<p><b>Why it works:</b> DATEADD takes the dates currently visible (the selected month) and returns the same dates shifted by one month; CALCULATE swaps the filter. This works when the visual filters by month (or day) of the Calendar, not when an unrelated column is on the axis.</p>`,
lvl:'M',freq:3,
follow:['What does DATEADD return when you shift a 31-day month?','Difference between DATEADD and PREVIOUSMONTH?'],
mistake:'Subtracting 1 from the month number, which breaks across year boundaries. Use date functions on the Calendar table.',
tags:['dax','time-intelligence','mom']},

{q:'Write a Year-over-Year (YoY) % measure. What do you get for 2025 vs 2024 and for Feb 2025?',
short:'I get last year sales with SAMEPERIODLASTYEAR on the Calendar date and then YoY percent is current minus last year divided by last year with DIVIDE. For the full year 2025 it is 1475 against 1070, about plus 37.9 percent. For February 2025 it is 500 against 520, about minus 3.8 percent.',
a:`${pre(`Net Sales LY = CALCULATE([Net Sales], SAMEPERIODLASTYEAR('Calendar'[Date]))
Net Sales YoY % = DIVIDE([Net Sales] - [Net Sales LY], [Net Sales LY])`)}
${pre(`Period      Net Sales   LY     YoY %
Year 2025        1475   1070   +37.85%     (405 / 1070)
Feb 2025          500    520    -3.85%     (-20 / 520)
Mar 2025          500    360   +38.89%     (140 / 360)
Year 2024        1070  (blank)   blank`)}
<p>Feb-2024: S2 250 + S3 (300-30) 270 = 520. Mar-2024: S4 400-40 = 360.</p>
<p><b>Why it works:</b> SAMEPERIODLASTYEAR shifts the currently selected dates back exactly one year. Alternative: <code>DATEADD('Calendar'[Date], -1, YEAR)</code>. Both need a continuous, marked Calendar table. Format YoY as percentage and use DIVIDE to avoid errors when last year is zero or blank.</p>`,
lvl:'M',freq:3,
follow:['What if the Calendar table is missing dates?','How would you show YoY on a card for "latest month"?'],
mistake:'Calculating YoY with a Year slicer while the Calendar table is not marked/continuous, so LY shows blank or wrong.',
tags:['dax','time-intelligence','yoy']},

{q:'In Power Query, what is unpivot and when would you use it? Name other common cleaning steps.',
short:'Unpivot turns columns into rows. If a file has one column per month, I unpivot those columns so I get Month and Value columns, which is the shape Power BI needs to chart and filter by month. Other common steps are changing data types, removing duplicates and blanks, trimming text, splitting columns and Group By.',
a:`${pre(`BEFORE (wide)                 AFTER unpivot other columns (tall)
Product  Jan  Feb  Mar         Product  Month  Units
Pen       10   12    9         Pen      Jan     10
Bag        4    5    6         Pen      Feb     12
                               Pen      Mar      9
                               Bag      Jan      4 ... (6 rows total)`)}
<p>Steps: select the Product column, Transform > Unpivot Other Columns, rename Attribute to Month and Value to Units. "Unpivot Other Columns" is better than "Unpivot Columns" because new month columns added later are included automatically.</p>
<p><b>Other steps interviewers expect:</b> Use first row as headers; Change type (do it early and explicitly); Trim/Clean text; Remove duplicates / blank rows; Replace values; Split column by delimiter; Group By; Add custom/conditional column; Fill down; Merge and Append. Every step is recorded, so the clean-up repeats on each refresh.</p>`,
lvl:'M',freq:2,
follow:['Unpivot Columns vs Unpivot Other Columns?','Why clean in Power Query and not in DAX?'],
mistake:'Leaving data wide (one column per month) and writing a separate measure per month.',
tags:['powerquery','unpivot','cleaning']},

{q:'What is Row-Level Security (RLS) and how do you implement it?',
short:'RLS restricts which rows each user can see. I create roles in Power BI Desktop with a DAX filter, such as Region equals North, test with View as, publish, and then assign users to the role in the Service. For many users I use dynamic RLS with a security table and USERPRINCIPALNAME.',
a:`<p><b>Static RLS:</b> Modeling > Manage roles > create role "North" with a filter on a dimension table:</p>
${pre(`Customer[City] = "Mumbai"      -- role "Mumbai Team": sees only Mumbai customers' sales`)}
<p><b>Dynamic RLS:</b> one role, and a security table (UserEmail, Region):</p>
${pre(`Security[UserEmail] = USERPRINCIPALNAME()`)}
<p>The Security table relates to the dimension (for example Region) so the filter flows down to Sales.</p>
<p><b>Test:</b> Modeling > View as (choose role and optionally a user). <b>Assign:</b> Service > the semantic model > Security > add users or groups to the role.</p>
<p><b>Good to know:</b> RLS filters flow from the dimension to the fact like any filter; it applies to people with the <b>Viewer</b> permission, but workspace Admins, Members and Contributors can see all data; RLS is not the same as hiding a page (that is not security); Object-level security hides tables or columns.</p>`,
lvl:'M',freq:3,
follow:['Static vs dynamic RLS?','Who is not restricted by RLS?'],
mistake:'Putting the filter on the fact table or hiding a page and calling it security, or forgetting to assign users to the role in the Service.',
tags:['rls','security']},

{q:'A Power BI report is slow. How do you find and fix the problem?',
short:'I first measure with Performance Analyzer to see whether the slow part is the DAX, the visual rendering or the data model. Then I fix the biggest cause: remove unused columns and tables, use a star schema, replace calculated columns with measures or Power Query steps, simplify DAX, and reduce the number of visuals per page.',
a:`<ol><li><b>Find it:</b> View > Performance Analyzer > Start recording > Refresh visuals. It shows DAX query time, visual display time and "other" per visual. Copy a slow query into DAX Studio (external tool) for details.</li>
<li><b>Model:</b> star schema, remove columns and tables you do not use, avoid high-cardinality columns (split date-time into date and time, drop GUIDs), set correct data types, avoid bi-directional and many-to-many relationships.</li>
<li><b>DAX:</b> use variables (VAR) so a value is computed once, prefer simple column filters over FILTER on the whole table, avoid nested iterators, use DIVIDE.</li>
<li><b>Report design:</b> fewer visuals per page (each runs a query), limit slicers/tables with thousands of rows, use drill-through for detail pages.</li>
<li><b>Data:</b> Import mode where possible, push work to the source with query folding, use incremental refresh or aggregation tables for big facts.</li></ol>
<p><b>Why this order:</b> measuring first stops you from guessing; most fixes come from a smaller, cleaner model.</p>`,
lvl:'M',freq:3,
follow:['What is cardinality and why does it affect performance?','What does Performance Analyzer not tell you?'],
mistake:'Jumping to "use DirectQuery" or "buy Premium" without measuring where the time goes.',
tags:['performance','model','dax']},

{q:'What are bookmarks, drill-down and drill-through, and how are they different?',
short:'Drill-down moves down a hierarchy inside the same visual, for example year to quarter to month. Drill-through sends the user to a separate detail page already filtered to the item they right-clicked, such as one customer. A bookmark saves the current view of a page, filters and visible items, so I can use it for navigation buttons or toggles.',
a:`<ul><li><b>Drill-down / drill-up:</b> use a hierarchy on the axis (Year > Month). The visual changes level; it stays on the same page.</li>
<li><b>Drill-through:</b> create a detail page, drag a field (for example Customer[Name]) into its "Drill-through" well. Users right-click a customer in another page > Drill through > the page opens filtered to that customer. A back button is added automatically.</li>
<li><b>Bookmark:</b> View > Bookmarks > Add. Captures filters, slicers, sort and which visuals are visible. Pair with buttons to build a toggle between "Chart" and "Table", a navigation menu, or a "reset filters" button.</li>
<li><b>Tooltip page:</b> a small page that shows on hover over a visual.</li></ul>
<p><b>Why used:</b> they let one report serve both a summary view for managers and a detail view for analysts without a cluttered page.</p>`,
lvl:'M',freq:2,
follow:['How do you add a back button on a drill-through page?','Can a bookmark change the data?'],
mistake:'Mixing up drill-down (same visual, deeper level) with drill-through (different page, filtered).',
tags:['visuals','interactivity']},

{q:'What is a gateway and how does scheduled refresh work in the Power BI Service?',
short:'A gateway is a bridge that lets the Power BI Service reach data that is on-premises or in a private network so it can refresh. I install the on-premises data gateway, add the data source and credentials in the Service, and set a refresh schedule. Cloud sources like SharePoint Online or Azure SQL usually do not need a gateway.',
a:`<p><b>Flow:</b> publish the .pbix to a workspace > semantic model settings > Gateway connection (map the data source to the gateway) > enter credentials > Scheduled refresh (days and times, time zone) > optional failure notifications.</p>
<ul><li><b>Standard (on-premises data gateway):</b> shared, used by many people and reports; installed on an always-on machine.</li>
<li><b>Personal mode:</b> for one person, only Import mode; not for shared production.</li>
<li><b>Refresh limits</b> depend on the licence (for example roughly 8 per day on Pro and more on Premium); check current Microsoft documentation before quoting numbers.</li>
<li><b>Incremental refresh:</b> refresh only recent partitions of a large table to speed up and save load.</li>
<li><b>Common failures:</b> expired credentials, the gateway machine is offline, source schema changed (a column renamed), timeout.</li></ul>
<p><b>Why it matters:</b> without refresh the dashboard shows old data and people stop trusting it.</p>`,
lvl:'M',freq:2,
follow:['When do you not need a gateway?','A scheduled refresh failed overnight: what do you check?'],
mistake:'Saying "the gateway stores the data". It only relays queries and data; it does not store your semantic model.',
tags:['service','gateway','refresh']},

/* ---------- HARD ---------- */
{q:'Write a running (cumulative) Net Sales measure by month. What are the values on the sample?',
short:'I use CALCULATE with FILTER over ALL of the Calendar table, keeping only dates up to the last date in the current context. In a month visual this gives the total from the start up to that month. For the sample it reaches 710 at February 2024 and 2545 at March 2025.',
a:`${pre(`Running Net Sales =
CALCULATE(
    [Net Sales],
    FILTER(
        ALL('Calendar'),
        'Calendar'[Date] <= MAX('Calendar'[Date])
    )
)`)}
${pre(`Month     Net Sales   Running
Jan-2024       190      190
Feb-2024       520      710
Mar-2024       360     1070
Jan-2025       475     1545
Feb-2025       500     2045
Mar-2025       500     2545`)}
<p><b>Why it works:</b> MAX('Calendar'[Date]) is the last day of the month in that cell (evaluated before the filter is replaced). ALL('Calendar') removes the visual's own date filter, FILTER then keeps all dates from the beginning up to that last date, and Net Sales is summed over them. It crosses year boundaries; for a total that restarts every year use TOTALYTD.</p>
<p><b>Practical issue:</b> months after the last sale (Apr 2024 and so on) would repeat the final total in a line chart. If you do not want that, wrap it: <code>IF(ISBLANK([Net Sales]), BLANK(), &lt;the CALCULATE above&gt;)</code>. This also hides months with genuinely no sales, so decide what you want.</p>`,
lvl:'H',freq:2,
follow:['How would you restart the running total each year?','Why ALL on the Calendar table and not on the Date column?'],
mistake:'Forgetting ALL, so the filter only sees the single month and returns the monthly value, or using a date column from the fact table.',
tags:['dax','running-total','time-intelligence']},

{q:'Write a measure that ranks products by Net Sales, and one that gives the Net Sales of the top 2 products.',
short:'For the rank I use RANKX over all products with Net Sales as the value, which gives Bag 1, Lamp 2, Notebook 3. For top N I use TOPN to pick the best two products inside CALCULATE, which gives 1225 plus 760 which is 1985. For simple visuals I would use the Top N visual filter.',
a:`${pre(`Product Rank = RANKX(ALL(Product[Name]), [Net Sales])
Top 2 Products Net Sales =
CALCULATE([Net Sales], TOPN(2, ALL(Product[Name]), [Net Sales]))`)}
${pre(`Product    Net Sales   Rank
Bag             1225      1
Lamp             760      2
Notebook         560      3
Top 2 Products Net Sales (card) = 1225 + 760 = 1985`)}
<p><b>Why it works:</b> RANKX evaluates [Net Sales] for every product in ALL(Product[Name]) (so rank ignores the row filter) and returns the position of the current row's value; default order is descending and ties share a rank. TOPN returns the two product rows with the highest Net Sales, and CALCULATE filters Sales to those products.</p>
<p><b>Caveats:</b> (1) In the Total row of a matrix, RANKX returns 1 because the total is larger than any product; use <code>IF(HASONEVALUE(Product[Name]), RANKX(...))</code>. (2) If the user also uses slicers on Product, use ALLSELECTED(Product[Name]) so ranks respect them. (3) The TOPN measure overrides the Product[Name] filter, so on a product-by-row table every row shows 1985; use it on a card, or use the visual-level Top N filter for a ranked table.</p>`,
lvl:'H',freq:2,
follow:['How do ties behave in RANKX (Skip vs Dense)?','Show the Top 5 customers without writing DAX.'],
mistake:'Putting RANKX over the plain table (without ALL), which ranks each row against only itself and returns 1 everywhere.',
tags:['dax','rankx','topn']},

{q:'How many customers have Net Sales above 500? Write the measure and explain why it works.',
short:'I iterate over the distinct customers with FILTER, and for each customer I test Net Sales greater than 500, then count the rows that pass. Net Sales is a measure, so inside the iteration it is calculated for that one customer. On the sample the answer is 3: Asha 540, Ravi 745 and Meena 760; Karan is exactly 500 so he is not included.',
a:`${pre(`High Value Customers =
COUNTROWS(
    FILTER(
        VALUES(Customer[CustomerID]),
        [Net Sales] > 500
    )
)`)}
${pre(`Customer  Net Sales  > 500?
C1 Asha        540     yes
C2 Ravi        745     yes
C3 Meena       760     yes
C4 Karan       500     no   (equal, not greater)
Result = 3`)}
<p><b>Why it works:</b> VALUES(Customer[CustomerID]) gives the customers visible in the current context. FILTER creates a row context for each customer; referencing the <b>measure</b> [Net Sales] triggers context transition, so the row becomes a filter on that customer and Net Sales is computed per customer. COUNTROWS counts those that pass.</p>
<p>If you wrote <code>SUM(Sales[...])</code> directly inside FILTER it would not transition and each test would use the grand total. Using a measure (or wrapping in CALCULATE) is what makes it per customer.</p>`,
lvl:'H',freq:2,
follow:['What if you want the % of customers who are high value?','What happens if you replace the measure with SUM(Sales[Discount])?'],
mistake:'Using Sales[Qty] > 500 style row conditions, which tests single lines, not each customer total. The test must be on an aggregated value per customer.',
tags:['dax','iterator','context-transition']},

{q:'What is query folding and why does it matter?',
short:'Query folding means Power Query translates my steps into one native query, such as SQL, and the database does the work instead of Power BI. It makes refresh faster and enables incremental refresh. I keep foldable steps like filters and column selection early and I check View Native Query to confirm.',
a:`<p>When the source is a database (SQL Server, Azure SQL and similar), steps such as <b>filter rows, choose columns, rename, group by, simple merges</b> can be sent to the server as a single SQL statement. The result: less data travels to Power BI and the heavy work is done by the database.</p>
<ul><li><b>Check:</b> right-click a step > <b>View Native Query</b>. If it is greyed out, folding has stopped at that step.</li>
<li><b>What commonly breaks folding:</b> adding an index column, some custom columns and custom M functions, merging queries from different sources, certain pivot/unpivot operations, Table.Buffer. Exact behaviour depends on the connector.</li>
<li><b>Best practice:</b> do foldable steps first (filter, remove columns) and put non-foldable ones last.</li>
<li><b>Does not apply</b> to flat files (CSV, Excel), because there is no engine to push the query to.</li>
<li>Incremental refresh and DirectQuery depend on folding.</li></ul>
<p><b>Why it matters:</b> importing 50 million rows and then filtering is far slower than letting SQL Server return only the needed rows.</p>`,
lvl:'H',freq:2,
follow:['How would you know folding was lost in your query?','Can you use incremental refresh with a CSV?'],
mistake:'Claiming query folding works for CSV or Excel files, or doing a non-foldable step first so every later step also loses folding.',
tags:['powerquery','folding','performance']},

{q:'Unique Customers by category shows 2 and 4 but the total shows 4, not 6. Is that a bug? Explain.',
short:'It is not a bug. A distinct count is not additive: the same customer can buy in more than one category, so adding category counts double-counts people. The total correctly counts each customer once. I need to explain this to users and avoid summing such measures.',
a:`${pre(`Category      Unique Customers
Stationery                 2     (C1 Asha, C2 Ravi)
Accessories                4     (C1, C2, C3, C4)
Total                      4     not 2 + 4 = 6`)}
<p>Asha and Ravi bought both Stationery (Notebook) and Accessories (Bag), so they appear in both rows but only once in the grand total.</p>
<p><b>Why:</b> the Total row is not a sum of the rows above. DAX evaluates the measure again with <b>no category filter</b>, so DISTINCTCOUNT sees all sales and counts 4 distinct customers. The same applies to averages, ratios and percentages: totals are calculated from the data, not from the visible rows.</p>
<p><b>Related trap:</b> if you want the total to equal the sum of rows (for example for a budget split) you must write special logic, such as <code>SUMX(VALUES(Product[Category]), [Unique Customers])</code> but say clearly that it double-counts customers. Usually the correct answer is to keep the distinct total and label it.</p>`,
lvl:'H',freq:2,
follow:['Why is Discount % at the total row not the average of the row percentages?','How do you hide the total in a matrix?'],
mistake:'"Fixing" the total by summing the rows, which gives a wrong business number (6 customers when only 4 exist).',
tags:['dax','distinctcount','totals']}

]};


QA.excel={name:'Excel',emoji:'📗',
schema:pre(`SHARED SAMPLE SHEET "Sales" (data in A1:G9; formulas below assume these cells)

A        B          C      D        E    F      G
OrderID  OrderDate  Region Product  Qty  Price  Revenue (=E*F)
1001     05-Jan-25  North  Pen      10   5      50
1002     12-Jan-25  South  Book     3    120    360
1003     03-Feb-25  North  Book     2    120    240
1004     14-Feb-25  East   Pen      20   5      100
1005     20-Feb-25  South  Bag      1    800    800
1006     02-Mar-25  North  Bag      2    800    1600
1007     15-Mar-25  East   Book     5    120    600
1008     28-Mar-25  West   Pen      15   5      75

Grand total of Revenue = 3825   (North 1890, South 1160, East 700, West 75)

Lookup list J1:K4          Commission slab M1:N4        Single input
Product  Category          MinRevenue  Rate             P1 = 5%  (commission rate)
Pen      Stationery        0           2%
Book     Stationery        300         4%
Bag      Accessories       1000        6%`),
list:[

/* ---------- EASY ---------- */
{q:'Explain relative, absolute and mixed cell references. Give a formula where it matters.',
short:'A relative reference like G2 changes when I copy the formula. An absolute reference like $P$1 stays fixed. A mixed one like $A1 or A$1 locks only the column or only the row. I press F4 to toggle them. I lock a cell like a tax or commission rate so every row uses the same one.',
a:`<p>Commission = Revenue x the rate in P1 (5%). Put this in H2 and copy down:</p>
${pre(`=G2*$P$1
-- H2: 50 * 5% = 2.5      H7 (order 1006): 1600 * 5% = 80`)}
<p>When copied down, G2 becomes G3, G4 ... (relative) but $P$1 never moves (absolute). Without the dollars, row 3 would point to P2 (empty) and give 0.</p>
<p><b>Mixed example:</b> a multiplication grid with numbers down column A and across row 1: <code>=$A2*B$1</code>. The column is locked to A and the row locked to 1, so one formula fills the whole grid.</p>
<p><b>Why it works:</b> Excel stores references relative to the formula's own cell; the dollar sign tells it not to shift that part.</p>`,
lvl:'E',freq:3,
follow:['What does F4 do?','How do named ranges or Tables help with this?'],
mistake:'Forgetting the dollar signs on the lookup range or the rate cell, so the formula drifts down the sheet and returns #N/A or wrong values.',
tags:['basics','references']},

{q:'Use VLOOKUP to bring the Category for each product from the list in J1:K4. Why do you use FALSE?',
short:'I write VLOOKUP with the product, the locked lookup table, column number 2 and FALSE for exact match. FALSE matters because without it Excel does an approximate search that can silently return a wrong answer on unsorted data.',
a:`${pre(`=VLOOKUP(D2, $J$2:$K$4, 2, FALSE)
-- D2 = Pen  -> Stationery
-- order 1005 (Bag) -> Accessories`)}
<p>Arguments: lookup value (D2), table (lock with $), column index (2 = second column of the table, K), range_lookup (FALSE = exact).</p>
<p><b>Limits of VLOOKUP:</b> the key must be in the <b>first</b> column of the table; the column number breaks if columns are inserted; with TRUE (or omitted) it needs sorted data and can return wrong answers without any error. A product not in the list gives #N/A.</p>
<p><b>Better:</b> XLOOKUP or INDEX-MATCH (next questions).</p>`,
lvl:'E',freq:3,
follow:['What happens if you leave the last argument out?','Can VLOOKUP look to the left?'],
mistake:'Omitting FALSE (or using TRUE) for an ID or name lookup and getting plausible but wrong values.',
tags:['lookup','vlookup']},

{q:'Write XLOOKUP formulas: the Category for a product (with a friendly message if missing) and the Price of order 1005.',
short:'XLOOKUP takes what to find, where to look, and what to return, and does an exact match by default. I can add a fourth argument to show a message when nothing is found, and the return column can be on either side of the lookup column.',
a:`${pre(`=XLOOKUP(D2, $J$2:$J$4, $K$2:$K$4, "Not listed")
-- Pen -> Stationery;  a product "Lamp" -> Not listed

=XLOOKUP(1005, A2:A9, F2:F9)
-- 800`)}
<p><b>Why better than VLOOKUP:</b> separate lookup and return ranges (no column numbers), exact match by default, built-in if-not-found, can look left, can return several columns at once (<code>=XLOOKUP(1005, A2:A9, C2:G9)</code> spills the whole row), and search from the bottom with search_mode -1.</p>
<p><b>Version note:</b> XLOOKUP is in Excel 2021 and Microsoft 365, not in Excel 2016/2019. If you must support older versions use INDEX-MATCH.</p>`,
lvl:'E',freq:3,
follow:['What is the difference in default match behaviour vs VLOOKUP?','What would you use in Excel 2016?'],
mistake:'Using XLOOKUP in a file that colleagues open in Excel 2016/2019, where it shows #NAME?.',
tags:['lookup','xlookup']},

{q:'Write SUMIFS formulas: total revenue for North, and for South Book orders.',
short:'SUMIFS takes the range to add first, then pairs of criteria range and criteria. North total is 1890, and South Book is 360.',
a:`${pre(`=SUMIFS(G2:G9, C2:C9, "North")
-- 50 + 240 + 1600 = 1890

=SUMIFS(G2:G9, C2:C9, "South", D2:D9, "Book")
-- only order 1002 = 360

=SUMIFS(G2:G9, G2:G9, ">=300")
-- 360 + 800 + 1600 + 600 = 3360`)}
<p><b>Rules:</b> sum_range comes <b>first</b> (unlike SUMIF where it is last); all ranges must be the same size; multiple criteria are AND; use a cell reference for a criterion (for example C2:C9, F1) so you can change it without editing the formula; for comparison use text like ">=300" or ">"&amp;F1.</p>
<p>For OR logic, add two SUMIFS together or use SUMPRODUCT.</p>`,
lvl:'E',freq:3,
follow:['How do you sum between two dates?','What is the difference between SUMIF and SUMIFS?'],
mistake:'Putting the sum range last (SUMIF order) or using ranges of different sizes, which gives #VALUE!.',
tags:['sumifs','aggregation']},

{q:'How many orders are from North with Revenue of 240 or more? Also count the Pen orders.',
short:'COUNTIFS counts rows meeting several conditions. North with at least 240 gives 2 orders, 1003 and 1006. Pen orders is a simple COUNTIF that gives 3.',
a:`${pre(`=COUNTIFS(C2:C9, "North", G2:G9, ">=240")
-- 1003 (240) and 1006 (1600) = 2   (1001 is only 50)

=COUNTIF(D2:D9, "Pen")
-- 1001, 1004, 1008 = 3`)}
<p>COUNTIF is for one condition, COUNTIFS for many (AND). The criteria ranges must have the same size. COUNTIFS does not need a "count range"; it counts rows where all conditions are true.</p>
<p>Quick checks you can mention: <code>=COUNTA(A2:A9)</code> counts non-empty cells (8 here), <code>=COUNTBLANK()</code> counts empty ones, and <code>=SUMPRODUCT(1/COUNTIF(C2:C9,C2:C9))</code> is an old way to count unique values (4 regions).</p>`,
lvl:'E',freq:3,
follow:['How do you count unique values in Microsoft 365?','Can COUNTIFS do OR conditions?'],
mistake:'Using COUNT, which counts only numbers, to count text cells such as region names.',
tags:['countifs','aggregation']},

{q:'Find the average revenue of Pen orders. Why is this better than averaging a column of averages?',
short:'AVERAGEIFS averages only the rows that meet my condition. For Pen it is 50, 100 and 75, so the average is 75. I always average the underlying rows, not averages of groups, because group sizes differ.',
a:`${pre(`=AVERAGEIFS(G2:G9, D2:D9, "Pen")
-- (50 + 100 + 75) / 3 = 75`)}
<p>Be careful with a weighted question such as "average price per unit for Pen". The right answer is total revenue / total quantity: <code>=SUMIFS(G2:G9,D2:D9,"Pen")/SUMIFS(E2:E9,D2:D9,"Pen")</code> = 225 / 45 = 5. Averaging the Price column also gives 5 here because the price is constant, but with changing prices the weighted version is the correct one.</p>
<p><b>Why:</b> an average of averages gives a small group the same weight as a large one.</p>`,
lvl:'E',freq:2,
follow:['What does AVERAGEIFS return if nothing matches?','Average vs median: which one for skewed values like salary?'],
mistake:'Averaging percentages or averages from different groups instead of dividing totals.',
tags:['averageifs','aggregation']},

{q:'What is the difference between IFERROR and IFNA? When should you not use IFERROR?',
short:'IFERROR hides every kind of error and shows my fallback value. IFNA hides only the #N/A that lookups return when nothing is found. I prefer IFNA for lookups because IFERROR can hide real mistakes such as a wrong range or a typo.',
a:`${pre(`=IFNA(VLOOKUP("Lamp", $J$2:$K$4, 2, FALSE), "Not listed")
-- Lamp is not in the list -> Not listed

=IFERROR(G2/E2, 0)
-- if Qty (E2) is 0 or blank, show 0 instead of #DIV/0!`)}
<p><b>Common errors:</b> #N/A (lookup not found), #DIV/0! (divide by zero), #VALUE! (wrong data type, such as text in a calculation), #REF! (deleted cells), #NAME? (unknown function or version problem), #NUM! (invalid number).</p>
<p><b>Why be careful:</b> IFERROR(VLOOKUP(...), 0) would also hide a #REF! from a deleted column and silently show 0, so totals look fine but are wrong. Use the narrowest tool, and fix the cause where you can (for example make the IDs match).</p>`,
lvl:'E',freq:3,
follow:['How would you find the cause of a #VALUE! error?','What does #NAME? usually mean?'],
mistake:'Wrapping everything in IFERROR(...,0) to "clean" the sheet, which hides errors and makes totals wrong.',
tags:['errors','iferror']},

{q:'What is an Excel Table (Ctrl+T) and why is it better than a normal range?',
short:'A Table is a named, structured range that grows automatically when I add rows, copies formulas down by itself, and lets me write readable references like Sales[Revenue]. Pivots, charts and formulas that point at it always include new data.',
a:`<p>Select the data > Ctrl+T (My table has headers). Name it on Table Design, for example <b>tblSales</b>.</p>
${pre(`=SUM(tblSales[Revenue])                  -- 3825
=SUMIFS(tblSales[Revenue], tblSales[Region], "North")   -- 1890
Revenue column formula:  =[@Qty]*[@Price]  -- fills every row automatically`)}
<p><b>Benefits:</b> auto-expands (a new row 1009 is included in formulas, pivots and charts), banded rows and filter buttons, structured references that do not break when you insert columns, slicers on tables, and a good source for Power Query and pivot tables.</p>
<p>A pivot built on a plain range misses rows added below it; a Table avoids that. Remember to press Refresh on a pivot after the data changes.</p>`,
lvl:'E',freq:2,
follow:['What does [@Qty] mean?','How do you refresh a pivot when the source Table grows?'],
mistake:'Leaving data as a loose range with blank rows or merged cells, then building pivots and charts that miss new rows.',
tags:['tables','best-practice']},

{q:'How do you use Data Validation and Conditional Formatting? Give examples.',
short:'Data validation controls what can be typed, like a dropdown list of regions. Conditional formatting colours cells automatically based on a rule, like highlighting duplicate IDs or orders of 1000 or more. Both keep data clean and make problems visible.',
a:`<p><b>Data Validation</b> (Data > Data Validation): list (dropdown) from a range or typed items, whole number between limits, date range, text length, custom formula. Add an input message and an error alert.</p>
${pre(`Allow: List   Source: North,South,East,West     -> dropdown for Region
Custom rule to block duplicate OrderIDs: =COUNTIF($A:$A, A2)=1`)}
<p><b>Conditional Formatting</b> (Home > Conditional Formatting): built-in rules (highlight cell rules, top 10, data bars, colour scales, icon sets) or a formula to colour the whole row:</p>
${pre(`Rule formula (applied to A2:G9):  =$G2>=1000
-- row 1006 (Revenue 1600) is highlighted

Duplicates: Highlight Cells Rules > Duplicate Values`)}
<p><b>Why the $:</b> the column is locked ($G) so the whole row follows column G, while the row number moves down.</p>
<p>Tip: validation stops bad entries; it does not clean old data. Use both for input sheets and dashboards.</p>`,
lvl:'E',freq:2,
follow:['How would you build a dependent dropdown?','Why does the rule formula use $G2 and not G2?'],
mistake:'Forgetting that validation does not check pasted values, or writing the rule without the $ so only one column is coloured.',
tags:['validation','formatting']},

/* ---------- MEDIUM ---------- */
{q:'Add a column "Size": Large if Revenue is 1000 or more, Medium if 300 or more, otherwise Small. Show nested IF and IFS.',
short:'I test the highest threshold first. With nested IF it is IF(G2>=1000,"Large",IF(G2>=300,"Medium","Small")). In newer Excel I can use IFS, which is easier to read. Order 1006 with 1600 is Large, 1002 with 360 is Medium and 1001 with 50 is Small.',
a:`${pre(`=IF(G2>=1000, "Large", IF(G2>=300, "Medium", "Small"))

=IFS(G2>=1000, "Large", G2>=300, "Medium", TRUE, "Small")`)}
${pre(`OrderID  Revenue  Size
1001          50  Small
1002         360  Medium
1005         800  Medium
1006        1600  Large
1007         600  Medium`)}
<p><b>Why order matters:</b> Excel stops at the first TRUE. If you tested G2>=300 first, 1600 would be "Medium". Test from the strictest condition down.</p>
<p><b>Notes:</b> IFS is available in Excel 2019 and Microsoft 365; it returns #N/A if no condition is true, hence the final TRUE as a catch-all. For many ranges a lookup table with XLOOKUP approximate match is easier to maintain than a deep IF. Combine conditions with AND / OR: <code>=IF(AND(C2="North", G2>=240), "Check", "")</code>.</p>`,
lvl:'M',freq:3,
follow:['How would you avoid a long nested IF?','Difference between AND and OR in IF?'],
mistake:'Testing the lower threshold first so larger values never reach the higher branch.',
tags:['if','ifs','logic']},

{q:'Dates and text: from OrderDate show the month label, the first day one month later, the month-end, and the number of days between orders 1001 and 1007. Also total revenue for February without helper columns.',
short:'TEXT formats a date as text, EDATE adds months, EOMONTH gives month-end, and subtracting two dates gives days. For a month total I use SUMIFS with a start date and a before-next-month date so it works whatever the day.',
a:`${pre(`=TEXT(B2, "mmm-yyyy")      -> Jan-2025     (order 1001)
=TEXT(B2, "dddd")          -> Sunday       (05-Jan-2025)
=EDATE(B2, 1)              -> 05-Feb-2025  (format cell as date)
=EOMONTH(B4, 0)            -> 28-Feb-2025  (order 1003, 03-Feb-2025)
=B8-B2                     -> 69           (15-Mar-2025 minus 05-Jan-2025)
=MONTH(B2), =YEAR(B2), =DAY(B2)   -> 1, 2025, 5

=SUMIFS(G2:G9, B2:B9, ">="&DATE(2025,2,1), B2:B9, "<"&DATE(2025,3,1))
-- Feb: 240 + 100 + 800 = 1140`)}
<p>By month for the whole sheet: January 410 (50+360), February 1140, March 2275 (1600+600+75). Check: 410 + 1140 + 2275 = 3825.</p>
<p><b>Why this way:</b> dates are numbers in Excel (days since 1900), so you can subtract them and compare them. TEXT returns <b>text</b>, so you cannot do date maths on it afterwards. For SUMIFS use "greater than or equal to the first day" and "less than the first of next month"; this handles dates that have time parts too.</p>
<p>Also useful: TODAY(), NETWORKDAYS(start,end) for working days, DATEDIF for years/months between dates (hidden function).</p>`,
lvl:'M',freq:3,
follow:['Why does TEXT return text and what is the side effect?','How do you get the quarter from a date?'],
mistake:'Typing dates as text ("05-01-2025") so they cannot be compared or subtracted, or using TEXT() output in calculations.',
tags:['dates','text','sumifs']},

{q:'Return the price of order 1005 using INDEX-MATCH, and explain why people use it over VLOOKUP.',
short:'MATCH finds the row position of the order ID and INDEX returns the value from that position in the price column. It works to the left or right, and it does not break if columns are inserted.',
a:`${pre(`=INDEX(F2:F9, MATCH(1005, A2:A9, 0))
-- MATCH(1005, A2:A9, 0) = 5  (fifth row)
-- INDEX(F2:F9, 5) = 800`)}
<p>The 0 in MATCH means exact match (always use it for IDs). INDEX takes a range and a position; MATCH finds that position.</p>
<p><b>Why people use it:</b> works in any Excel version, can look left (for example find the OrderID from a Price), and uses actual column ranges, so inserting a column does not shift a hard-coded column number like VLOOKUP's. Two-way lookups use two MATCH functions (see the hard section). XLOOKUP replaces most uses in newer Excel.</p>`,
lvl:'M',freq:3,
follow:['What does MATCH return if the value is not found?','How do you do a left lookup with VLOOKUP?'],
mistake:'Leaving out the 0 (or using 1) in MATCH and getting a wrong row from an approximate match.',
tags:['lookup','index-match']},

{q:'Here is a pivot table of Revenue by Region. What can you say about it, and what would you do next?',
short:'I read the numbers, point out the biggest and smallest contributors, and then suggest the next cut, such as by month or product. North contributes about 49 percent of revenue, West only about 2 percent. I would also check that the pivot is refreshed and based on a Table.',
a:`${pre(`Row Labels   Sum of Revenue   % of Grand Total
North                1890            49.4%
South                1160            30.3%
East                  700            18.3%
West                   75             2.0%
Grand Total          3825           100.0%`)}
<p><b>Reading it:</b> North and South together are about 80% of revenue (3050 / 3825 = 79.7%). West is tiny, but it has only one order (1008), so it may simply be a new market or small data, so I would not conclude it is "bad" without more data.</p>
<p><b>Next steps in the pivot:</b> put Month under Region (or drag a Timeline slicer), add Product to columns, show values as % of column total, add a slicer, sort largest first, and add Count of OrderID to compare size with value (West 1 order, North 3).</p>
<p><b>Technical points to mention:</b> Insert > PivotTable; source should be a Table; Refresh after the data changes; group dates by months/years; a Calculated Field such as <code>= Revenue / Qty</code> gives a weighted average price (North: 1890 / 14 = 135); GETPIVOTDATA is what Excel writes when you click a pivot cell in a formula.</p>`,
lvl:'M',freq:3,
follow:['How do you show Sum and Count in the same pivot?','What does Refresh do and why is it needed?'],
mistake:'Describing the pivot as numbers only, without a conclusion or a suggested next question, or forgetting to refresh after editing the source.',
tags:['pivot','insight']},

{q:'Get the list of regions without duplicates, sorted A to Z, and the count of unique regions (dynamic arrays).',
short:'UNIQUE returns the distinct values, and wrapping it in SORT orders them. Wrapping UNIQUE in ROWS counts them. The result spills into the cells below, so I leave those cells empty.',
a:`${pre(`=SORT(UNIQUE(C2:C9))
-- spills 4 cells: East, North, South, West

=ROWS(UNIQUE(C2:C9))
-- 4

=SORT(UNIQUE(C2:C9), 1, -1)
-- Z to A: West, South, North, East`)}
<p><b>How dynamic arrays work:</b> one formula in one cell returns many values that spill down or across. Refer to the whole spill with a hash, for example <code>=SUM(E2#)</code> if E2 holds a spilling formula. If something is in the way you get a #SPILL! error.</p>
<p><b>Version note:</b> UNIQUE, SORT, FILTER, SORTBY, TAKE are in Microsoft 365 and Excel 2021 or later. In older Excel use Data > Remove Duplicates on a copy, or a pivot table.</p>`,
lvl:'M',freq:3,
follow:['What does #SPILL! mean?','How would you get the count of orders per region from this list?'],
mistake:'Typing the formula where cells below are not empty (causes #SPILL!), or expecting it to work in Excel 2016.',
tags:['dynamic-arrays','unique','sort']},

{q:'Show all North orders with revenue of 100 or more, sorted by revenue high to low, and show "None" if there are no rows.',
short:'FILTER keeps the rows that meet conditions and I multiply the conditions to mean AND. SORT then orders them by the revenue column. For North with at least 100 the result is order 1006 with 1600 then 1003 with 240.',
a:`${pre(`=SORT(FILTER(A2:G9, (C2:C9="North")*(G2:G9>=100), "None"), 7, -1)
-- Result (2 rows):
-- 1006  02-Mar-25  North  Bag   2  800  1600
-- 1003  03-Feb-25  North  Book  2  120   240`)}
<p>Order 1001 is North but only 50, so it is excluded. The third argument of FILTER is the value shown when nothing matches; 7 means sort by the 7th column of the filtered result (Revenue); -1 means descending.</p>
<p><b>Why multiply?</b> Each comparison returns TRUE/FALSE arrays; multiplying makes TRUE=1 and FALSE=0, so a row stays only if both are true (AND). For OR use addition: <code>(C2:C9="North")+(C2:C9="East")</code>.</p>
<p>Older Excel alternative: AutoFilter or an advanced filter; or a pivot table.</p>`,
lvl:'M',freq:2,
follow:['How do you write OR conditions in FILTER?','How would you return only OrderID and Revenue?'],
mistake:'Using AND() inside FILTER. AND returns one TRUE/FALSE for the whole range, not row by row; multiply the conditions instead.',
tags:['dynamic-arrays','filter','sort']},

{q:'A column of customer names has extra spaces and mixed case, and Amount is stored as text with commas. How do you clean it?',
short:'I keep a raw copy, then use TRIM and PROPER for the text, convert the amount from text to a number, and remove duplicates. If I will repeat this every month I do the same steps in Power Query so they run again with one refresh.',
a:`${pre(`Raw data:
Name              City     Amount
"  asha  rao "    mumbai   "1,200"
"RAVI KUMAR"      DELHI    "950"
"asha rao"        Mumbai   "1,200"

Formulas (copy down):
Name   =PROPER(TRIM(A2))                           -> Asha Rao,  Ravi Kumar,  Asha Rao
City   =PROPER(TRIM(B2))                           -> Mumbai, Delhi, Mumbai
Amount =VALUE(SUBSTITUTE(C2, ",", ""))             -> 1200, 950, 1200`)}
<p>After this, rows 1 and 3 are exact duplicates (Asha Rao, Mumbai, 1200). Copy the cleaned columns, Paste Special > Values, then Data > Remove Duplicates. Rows left: 2.</p>
<p><b>Extra tricks:</b> TRIM removes extra spaces but not non-breaking spaces from web data; use <code>SUBSTITUTE(A2, CHAR(160), " ")</code> first. CLEAN removes non-printing characters. Text to Columns splits a field and converts types; Find and Replace fixes spelling variations; Go To Special > Blanks finds empty cells; check numbers stored as text (green triangle).</p>
<p><b>Best practice:</b> never clean over your only copy; document what you changed. Power Query does the same (Trim, Clean, Capitalize Each Word, Change Type, Remove Duplicates) and records the steps for reuse.</p>`,
lvl:'M',freq:3,
follow:['When would you use Power Query instead of formulas?','How do you spot numbers stored as text?'],
mistake:'Cleaning directly over the raw data with no backup, or removing duplicates before standardising the text, so near-duplicates ("asha rao" and "  Asha Rao ") survive.',
tags:['cleaning','text','scenario']},

{q:'Give the top 3 orders by Revenue with their OrderIDs. Show a classic formula and a modern one.',
short:'Classic: LARGE gets the 1st, 2nd and 3rd biggest revenue, and INDEX-MATCH finds the order for each. Modern: SORT the table by revenue descending and TAKE the first 3 rows. The top 3 are 1006 with 1600, 1005 with 800 and 1007 with 600.',
a:`${pre(`=LARGE($G$2:$G$9, 1)      -> 1600
=LARGE($G$2:$G$9, 2)      ->  800
=LARGE($G$2:$G$9, 3)      ->  600

=INDEX($A$2:$A$9, MATCH(LARGE($G$2:$G$9, 1), $G$2:$G$9, 0))   -> 1006

Modern (Microsoft 365):
=TAKE(SORT(A2:G9, 7, -1), 3)
-- spills 3 rows: 1006, 1005, 1007`)}
<p><b>Caution with ties:</b> if two orders had the same revenue, MATCH would return the first one twice. Here all revenues are distinct. The modern SORT approach handles ties by keeping all rows.</p>
<p><b>Why it works:</b> LARGE(range, k) returns the k-th largest value; MATCH(...,0) finds its row; INDEX returns the ID from the same row. SORT reorders rows by the 7th column (Revenue), TAKE keeps the first N rows. TAKE exists only in recent Microsoft 365 builds; if it shows #NAME?, use the LARGE formulas above.</p>`,
lvl:'M',freq:2,
follow:['How would you get the bottom 3?','How does a pivot table show the top 3?'],
mistake:'Using MAX three times or sorting the sheet manually, which does not update when the data changes.',
tags:['large','dynamic-arrays','top-n']},

{q:'Add a running total of revenue and a rank column. What do they give for order 1003 and 1006?',
short:'For a running total I use SUM with the start cell locked and the end cell relative, so it grows as I copy down. For rank I use RANK.EQ with the full range locked. Order 1003 has a running total of 650 and rank 5, and 1006 has 3150 and rank 1.',
a:`${pre(`Running total in H2 (copy down):   =SUM($G$2:G2)
Rank in I2 (copy down):             =RANK.EQ(G2, $G$2:$G$9)

OrderID  Revenue  Running total  Rank
1001          50             50     8
1002         360            410     4
1003         240            650     5
1004         100            750     6
1005         800           1550     2
1006        1600           3150     1
1007         600           3750     3
1008          75           3825     7`)}
<p><b>Why it works:</b> in $G$2:G2 the start is locked and the end is relative, so row 3 becomes $G$2:G3 and the range grows by one row each time. RANK.EQ compares each revenue with the whole locked range (1600 is largest so rank 1). Tied values share the same rank and the next rank is skipped.</p>`,
lvl:'M',freq:2,
follow:['Mixed reference: why $G$2:G2?','RANK.EQ vs RANK.AVG with ties?'],
mistake:'Locking both ends ($G$2:$G$2) so the running total never grows, or locking nothing so the rank range slides down.',
tags:['references','running-total','rank']},

{q:'VLOOKUP returns #N/A even though I can see the value in the table. What are the possible reasons and fixes?',
short:'The usual causes are text versus number mismatch, hidden spaces, a lookup range that is not locked and has drifted, a key that is not in the first column, or using the wrong match type. I check the data types and trailing spaces first, then fix with TRIM or VALUE.',
a:`<ol><li><b>Number stored as text on one side</b> (ID 1005 vs "1005"). Fix: convert with <code>VALUE()</code> or <code>--A2</code>, or Text to Columns. Test with <code>=ISNUMBER(A2)</code>.</li>
<li><b>Hidden spaces or non-breaking spaces.</b> Fix: <code>TRIM()</code>, or SUBSTITUTE(x, CHAR(160), " ").</li>
<li><b>Range not locked</b>: copied down and the table moved. Fix: $J$2:$K$4.</li>
<li><b>Key is not in the first column</b> of the table_array. Fix: INDEX-MATCH or XLOOKUP.</li>
<li><b>Exact match missing</b> (TRUE/omitted) on unsorted data, or the value truly does not exist. Fix: FALSE.</li>
<li>Different spelling, for example "Notebook " vs "Notebook". Compare with <code>=EXACT(A2, J2)</code> or <code>=LEN(A2)</code>.</li></ol>
${pre(`=IFNA(VLOOKUP(TRIM(D2), $J$2:$K$4, 2, FALSE), "Check key")`)}
<p>A systematic way to debug: use <code>=MATCH(D2, $J$2:$J$4, 0)</code> by itself, then compare LEN of both cells.</p>`,
lvl:'M',freq:3,
follow:['How do you check whether a cell is text or number?','Would XLOOKUP avoid this problem?'],
mistake:'Wrapping the formula in IFERROR to hide #N/A without finding why the match fails.',
tags:['lookup','troubleshooting','cleaning']},

{q:'Power Query vs Excel formulas: when do you use which?',
short:'I use Power Query to clean and reshape data in a repeatable way, such as combining files, unpivoting and fixing types, because one refresh redoes all steps. I use formulas for calculations and lookups that live in the sheet, and pivot tables for summaries.',
a:`${pre(`Task                                       Better tool
Combine 12 monthly files                   Power Query (Append / From Folder)
Unpivot month columns                      Power Query
Fix types, trim, split, remove duplicates  Power Query (repeats on Refresh)
Join two tables on a key (big data)        Power Query Merge  (or XLOOKUP for small)
Row-level calc such as commission          Formula
Quick what-if on a few cells               Formula
Summarise by region/month                  Pivot table (+ slicers)`)}
<p><b>Why:</b> Power Query records every step and applies it again on each refresh, handles many more rows than cell formulas, and leaves the raw data untouched; formulas are live and easy to audit inside the sheet but slow on large lookups and get copied inconsistently. Typical flow: Power Query to clean, load to a Table, pivot or formulas to analyse, then a chart or dashboard.</p>
<p>Power Query is under Data > Get Data / From Table or Range. It is the same engine as Power BI's Power Query, so the skill transfers.</p>`,
lvl:'M',freq:3,
follow:['What happens to the steps when the source file changes?','Can Power Query write back to the source file?'],
mistake:'Doing manual find-and-replace clean-ups every month instead of recording the steps once in Power Query.',
tags:['powerquery','best-practice']},

{q:'How would you build a simple Excel dashboard? What are the best practices?',
short:'I start from a clean data Table, build the summaries with pivots or formulas on a separate calculations sheet, add charts and KPI cards on a dashboard sheet, and connect slicers. I keep it simple: a few KPIs at the top, one message per chart, consistent colours and no hard-coded numbers.',
a:`<ol><li><b>Question first:</b> what decision does this support? Pick 3-5 KPIs (for example total revenue 3825, orders 8, average order value 478.1, top region North).</li>
<li><b>Clean data in a Table</b> (or Power Query) so everything updates.</li>
<li><b>Calculation sheet:</b> pivots or SUMIFS blocks that feed each visual.</li>
<li><b>Dashboard sheet:</b> KPI cards at the top; below, a trend line (revenue by month), a bar chart (by region), maybe a table of top products.</li>
<li><b>Interactivity:</b> slicers and a timeline connected to several pivots (Slicer > Report Connections).</li>
<li><b>Design:</b> consistent colours, labels and titles, remove gridlines, align shapes, avoid 3D and too many colours, put the key message in the chart title ("North drives 49% of revenue").</li>
<li><b>Hygiene:</b> no hard-coded numbers, refresh pivots, protect the layout, document assumptions and data date.</li></ol>
<p>Check: average order value = 3825 / 8 = 478.125. <b>Why it matters:</b> a dashboard is judged by whether a manager can see the answer in 10 seconds. For larger data or sharing, mention that Power BI is the next step.</p>`,
lvl:'M',freq:3,
follow:['How do you make one slicer control several pivots?','When would you move this dashboard to Power BI?'],
mistake:'Crowding the sheet with many charts and colours, or typing totals by hand so the dashboard goes stale.',
tags:['dashboard','pivot','design']},

/* ---------- HARD ---------- */
{q:'Look up revenue using TWO criteria: the Revenue for Region = South AND Product = Bag. Show XLOOKUP and an alternative.',
short:'XLOOKUP can search a combined condition: I multiply two TRUE/FALSE tests to make a column of 1s and 0s and look up 1. For South and Bag the revenue is 800. If the combination is unique, SUMIFS gives the same answer and works in any version.',
a:`${pre(`=XLOOKUP(1, (C2:C9="South")*(D2:D9="Bag"), G2:G9, "Not found")
-- (C2:C9="South")*(D2:D9="Bag") gives {0;0;0;0;1;0;0;0}; row 5 is the match
-- result: 800  (order 1005)

Alternative (any version, if the pair is unique):
=SUMIFS(G2:G9, C2:C9, "South", D2:D9, "Bag")      -> 800

Alternative with INDEX-MATCH array logic:
=INDEX(G2:G9, MATCH(1, (C2:C9="South")*(D2:D9="Bag"), 0))
-- older Excel needs Ctrl+Shift+Enter for this form`)}
<p><b>Why it works:</b> each comparison creates a TRUE/FALSE array; multiplying converts to 1/0, so a 1 appears only where both conditions are true. XLOOKUP then finds the first 1 and returns the matching revenue.</p>
<p><b>Caution:</b> XLOOKUP returns only the first match. SUMIFS adds all matches, so if the same pair appeared twice SUMIFS would add them while XLOOKUP would not; pick the one that matches the business meaning. A helper column <code>=C2&amp;"|"&amp;D2</code> is another simple way.</p>`,
lvl:'H',freq:2,
follow:['What if there are two rows for South and Bag?','Why multiply instead of using AND()?'],
mistake:'Using AND() or && style logic, which does not work element by element in Excel arrays; multiply the conditions or use a helper key.',
tags:['xlookup','lookup','arrays']},

{q:'Use a slab table to find each order\'s commission rate and commission amount. Which formula and what is the result for orders 1005 and 1006?',
short:'This is an approximate-match lookup. XLOOKUP with match mode minus 1 returns the rate of the largest threshold that is not above the revenue. Order 1005 with 800 falls in the 300 slab, so rate 4 percent and commission 32. Order 1006 with 1600 is in the 1000 slab, so 6 percent and commission 96.',
a:`${pre(`Slab (M1:N4):  0 -> 2%,   300 -> 4%,   1000 -> 6%

=XLOOKUP(G2, $M$2:$M$4, $N$2:$N$4, , -1)
-- match_mode -1 = exact match or the next SMALLER item

Commission amount:
=G2 * XLOOKUP(G2, $M$2:$M$4, $N$2:$N$4, , -1)`)}
${pre(`OrderID  Revenue  Rate   Commission
1001          50    2%          1
1005         800    4%         32
1006        1600    6%         96`)}
<p><b>Older Excel:</b> <code>=VLOOKUP(G2, $M$2:$N$4, 2, TRUE)</code> or <code>=LOOKUP(G2, $M$2:$M$4, $N$2:$N$4)</code>. These require the slab column sorted <b>ascending</b>; if not, they return wrong answers without error. XLOOKUP with -1 does not need sorting.</p>
<p><b>Why it is better than nested IF:</b> the rates live in a table that finance can edit; no formulas change when a new slab is added (just extend the table range).</p>`,
lvl:'H',freq:2,
follow:['What happens if revenue is below the first threshold?','What does match_mode 1 do?'],
mistake:'Using VLOOKUP with TRUE on an unsorted slab table, which silently returns wrong rates.',
tags:['xlookup','approximate','lookup']},

{q:'You have a summary grid (regions down, products across). Return the revenue for East and Book using INDEX with two MATCH functions.',
short:'MATCH finds the row number of the region and another MATCH finds the column number of the product. INDEX then picks the cell where they cross. For East and Book the result is 600.',
a:`${pre(`      A       B     C      D
1     Region  Pen   Book   Bag
2     North    50    240   1600
3     South     0    360    800
4     East    100    600      0
5     West     75      0      0

=INDEX($B$2:$D$5, MATCH("East", $A$2:$A$5, 0), MATCH("Book", $B$1:$D$1, 0))
-- row = 3, column = 2  ->  600`)}
<p>Replace the two typed words with cell references (for example $G$1 and $G$2 from dropdowns) to make a lookup tool. Modern alternative: <code>=XLOOKUP("East", A2:A5, XLOOKUP("Book", B1:D1, B2:D5))</code> (the inner XLOOKUP returns the Book column, the outer picks the East row).</p>
<p>The grid can be built with SUMIFS: <code>=SUMIFS($G$2:$G$9, $C$2:$C$9, $A2, $D$2:$D$9, B$1)</code> copied across and down (note the mixed references), which is also a good mixed-reference example.</p>`,
lvl:'H',freq:1,
follow:['What does the third argument of INDEX mean?','How would you make the region and product selectable?'],
mistake:'Mixing up row and column order in INDEX (row first, column second), or MATCH ranges that do not align with the INDEX range.',
tags:['index-match','lookup','two-way']},

{q:'Without a helper column, calculate total revenue from Qty and Price, and total revenue where Region is East OR West. Which function?',
short:'SUMPRODUCT multiplies arrays row by row and adds the results. Qty times Price gives 3825, and for East or West I add two conditions together before multiplying by revenue, giving 775.',
a:`${pre(`=SUMPRODUCT(E2:E9, F2:F9)
-- 10*5 + 3*120 + 2*120 + 20*5 + 1*800 + 2*800 + 5*120 + 15*5 = 3825

=SUMPRODUCT(((C2:C9="East")+(C2:C9="West")) * E2:E9 * F2:F9)
-- East: 100 + 600 = 700;  West: 75;  total 775

=SUMPRODUCT((C2:C9="North")*(E2:E9>=5), G2:G9)
-- North orders with Qty >= 5: only 1001 -> 50`)}
<p><b>Why it works:</b> each comparison gives TRUE/FALSE per row; arithmetic turns them into 1/0. Adding conditions means OR, multiplying means AND. SUMPRODUCT then multiplies and sums everything without needing Ctrl+Shift+Enter.</p>
<p><b>When to prefer it:</b> OR conditions, weighted sums and calculations on arrays, or when you cannot add a helper column. For simple AND conditions SUMIFS is easier and faster on large data. For OR with SUMIFS: <code>=SUM(SUMIFS(G2:G9, C2:C9, {"East","West"}))</code> also gives 775.</p>`,
lvl:'H',freq:2,
follow:['SUMPRODUCT vs SUMIFS: which is faster?','Why do you multiply the conditions?'],
mistake:'Using commas for AND inside the first argument, for example SUMPRODUCT(cond1, cond2) with TRUE/FALSE values: text and booleans are treated as zero in comma-separated arrays; multiply the conditions or use double negatives.',
tags:['sumproduct','arrays','aggregation']}

]};
