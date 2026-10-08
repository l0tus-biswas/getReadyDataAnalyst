/* Week 3 guide: Excel + Power Query */
GUIDES[3] = {
  intro: `<p><b>Why this week matters:</b> Many analyst interviews include an Excel test or a take-home with a messy file. Interviewers want to see that you are fast with lookups, SUMIFS, pivot tables and cleaning. Power Query shows you can make cleaning repeatable, which is a big plus.</p>
<p><b>By Day 7 you can:</b> look up data with XLOOKUP / VLOOKUP / INDEX-MATCH, summarise with SUMIFS and pivots, clean a messy table in Power Query, and build a one-page Excel dashboard (KPI cards + 4 charts + slicers).</p>
<p><b>Time split:</b> Days 1-5, 1.5 h a day: 25 min learn, 45 min hands-on, 20 min practice questions. Day 6 (3.5 h): dashboard project. Day 7 (3.5 h): revision, interview questions and SQL window functions so your SQL does not go rusty.</p>
<p><b>Tip:</b> Type every formula yourself. Do not copy-paste. Muscle memory is what you need in a live test. Formulas below work in Excel 365 / 2021. Where a function is new (XLOOKUP, IFS, FILTER, UNIQUE), an older-version option is given.</p>`,
  days: [
    {
      title: `Lookups: XLOOKUP, VLOOKUP, INDEX-MATCH`,
      time: `1.5 h`,
      study: [
        `A lookup finds a value in one table using a key (like an ID) and brings back related data (like a name).`,
        `VLOOKUP(lookup_value, table_array, col_index, [range_lookup]) searches only the first column of the table and returns a value to its right.`,
        `Always use FALSE (or 0) as the last VLOOKUP argument for exact match. TRUE or leaving it blank means approximate match and needs sorted data.`,
        `VLOOKUP breaks when you insert or delete a column inside the table, because col_index is a fixed number. It also cannot look to the left.`,
        `INDEX(return_range, MATCH(lookup_value, lookup_range, 0)) works in any direction and does not break when columns are inserted.`,
        `XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode]) is the modern choice: exact match by default, looks left or right, has a built-in not-found text. It needs Excel 2021 or 365.`,
        `Common reasons for #N/A: the key is missing, extra spaces, or number stored as text (101 vs "101").`,
        `Approximate match is used for slabs (tax bands, grades): XLOOKUP match_mode -1 means exact or next smaller.`
      ],
      how: [
        `[10 min] Open a new workbook. Type the Employees table from the example into A1:D6. Press Ctrl+T to make it a Table (tick "My table has headers").`,
        `[15 min] In F2 type =VLOOKUP(104, A2:D6, 4, FALSE). Check the result. Now change 4 to 3 and see how the answer changes.`,
        `[15 min] Insert a new column between B and C. Look at your VLOOKUP: the col_index did not change, so the answer is wrong now. Undo with Ctrl+Z. This is the "when VLOOKUP breaks" story you tell in interviews.`,
        `[15 min] Write the same lookup with =INDEX(D2:D6, MATCH(102, A2:A6, 0)) and with XLOOKUP. Compare.`,
        `[15 min] Type the tax slab table (J1:K5) and do the approximate-match lookup with XLOOKUP and VLOOKUP.`,
        `[20 min] Do the practice questions below without looking at the answers. Then check.`
      ],
      example: `<p>Employees table in A1:D6:</p>${pre(`A      B       C       D
ID     Name    Dept    Salary
101    Asha    HR      40000
102    Ravi    IT      65000
103    Meena   IT      72000
104    Karan   Sales   50000
105    Divya   HR      45000`)}
<p>Formulas and results:</p>${pre(`=VLOOKUP(104, A2:D6, 4, FALSE)                 -> 50000
=INDEX(D2:D6, MATCH(102, A2:A6, 0))            -> 65000
=XLOOKUP(103, A2:A6, B2:B6, "Not found")       -> Meena
=XLOOKUP(999, A2:A6, B2:B6, "Not found")       -> Not found
=VLOOKUP(999, A2:D6, 4, FALSE)                 -> #N/A
=XLOOKUP("Divya", B2:B6, A2:A6)                -> 105   (looks LEFT)`)}
<p><b>Line by line:</b> VLOOKUP finds 104 in column A, then goes to the 4th column of A2:D6 (Salary) and returns 50000. MATCH(102, A2:A6, 0) returns the position (2). INDEX then picks the 2nd item of D2:D6, which is 65000. XLOOKUP needs two separate ranges: where to look, and what to return. That is why it can return a column on the left. The last example gives 105 which VLOOKUP cannot do, because ID is left of Name.</p>
<p>Tax slab table (J1:K5) for approximate match:</p>${pre(`J         K
MinSalary TaxRate
0         0%
30000     5%
60000     10%
70000     15%`)}
${pre(`=XLOOKUP(65000, J2:J5, K2:K5, , -1)    -> 10%
=VLOOKUP(65000, J2:K5, 2, TRUE)       -> 10%   (J must be sorted ascending)`)}
<p>65000 is not in the list, so Excel takes the next smaller value, 60000, and returns 10%.</p>`,
      practice: [
        [`Using the Employees table, return Meena's department with VLOOKUP.`, `${pre(`=VLOOKUP(103, A2:D6, 3, FALSE)`)}Result: IT. Department is the 3rd column of A2:D6.`],
        [`Return the salary of employee 105 using INDEX-MATCH.`, `${pre(`=INDEX(D2:D6, MATCH(105, A2:A6, 0))`)}Result: 45000. MATCH finds row position 5, INDEX returns the 5th salary.`],
        [`Find the ID of "Karan" (the ID column is to the LEFT of Name). Show one way with XLOOKUP and one way with INDEX-MATCH.`, `${pre(`=XLOOKUP("Karan", B2:B6, A2:A6)
=INDEX(A2:A6, MATCH("Karan", B2:B6, 0))`)}Both give 104. Plain VLOOKUP cannot look left.`],
        [`Return Name, Dept and Salary of employee 103 in one formula (spill).`, `${pre(`=XLOOKUP(103, A2:A6, B2:D6)`)}Result spills across 3 cells: Meena, IT, 72000. Because return_array has 3 columns, XLOOKUP returns the whole row.`],
        [`Your VLOOKUP(101, A2:D6, 4, FALSE) shows #N/A, but 101 is visible in the table. Give 3 reasons and a check for each.`, `<p>1) The ID in your lookup cell is text but the table has numbers (or the reverse). Check with =ISNUMBER(cell) or the green triangle. Fix with VALUE() or multiply by 1.</p><p>2) Hidden spaces. Check with =LEN(cell). Fix with TRIM().</p><p>3) Range does not include the row (range starts at A3). Check the table_array.</p>`],
        [`A salary of 71000 must get a tax rate using the slab table. Which formula and what result? What breaks if J is not sorted and you use VLOOKUP with TRUE?`, `${pre(`=XLOOKUP(71000, J2:J5, K2:K5, , -1)`)}Result: 15% (next smaller is 70000). With VLOOKUP TRUE and unsorted data the binary search gives wrong answers silently, so the safer choice is XLOOKUP with match_mode -1.`]
      ],
      important: [
        [`VLOOKUP vs XLOOKUP vs INDEX-MATCH: which do you use and why?`, `<p>VLOOKUP only looks right, uses a fixed column number so it breaks when columns change, and the default is approximate match. INDEX-MATCH works in any direction and is stable. XLOOKUP does the same with a simpler formula, defaults to exact match and has an if-not-found argument. I use XLOOKUP when the file will be opened in Excel 2021/365, and INDEX-MATCH when I must support older versions.</p>`],
        [`What does the last argument of VLOOKUP do?`, `<p>FALSE (or 0) means exact match. TRUE means approximate match: it returns the closest smaller value and needs the first column sorted ascending. I use TRUE only for slabs like tax or grade bands.</p>`],
        [`What do you do if the lookup key appears more than once?`, `<p>Lookups return the first match. If duplicates are a data problem I find them first (COUNTIF or Remove Duplicates). If I need the last match, XLOOKUP with search_mode -1 does it. If I need the sum of all matches I use SUMIFS instead.</p>`]
      ],
      resources: [[`Chandoo.org`, `https://chandoo.org`], [`ExcelIsFun (YouTube)`, `https://www.youtube.com/@excelisfun`]],
      done: `You are done when you can write an exact-match lookup three ways from memory and explain in 30 seconds why VLOOKUP breaks.`
    },
    {
      title: `SUMIFS, COUNTIFS, IF logic, text and date functions`,
      time: `1.5 h`,
      study: [
        `SUMIFS(sum_range, criteria_range1, criteria1, ...) adds numbers that meet ALL conditions. Note that sum_range comes FIRST.`,
        `COUNTIFS(criteria_range1, criteria1, ...) counts rows that meet all conditions. AVERAGEIFS works like SUMIFS.`,
        `Criteria can be text ("North"), numbers (500), comparisons (">500") or joined with cell values (">="&H1). Wildcards: * for any text, ? for one character.`,
        `IF(test, if_true, if_false). IFS(test1, result1, test2, result2, ..., TRUE, default) avoids nested IFs (Excel 2019+). AND and OR combine tests.`,
        `IFERROR(value, fallback) replaces any error. IFNA only replaces #N/A. Use them carefully: they can hide real mistakes.`,
        `Text functions: LEFT, RIGHT, MID(text, start, length), LEN, FIND (case-sensitive), SEARCH (not case-sensitive), TRIM, UPPER, PROPER, SUBSTITUTE, TEXTJOIN(delimiter, ignore_empty, range) (Excel 2019+; older Excel: join cells with &).`,
        `Date functions: DATE, YEAR, MONTH, DAY, TODAY, EOMONTH(date, months), EDATE, DATEDIF(start, end, "d"/"m"/"y"), NETWORKDAYS, TEXT(date, "mmm-yyyy").`,
        `A date in Excel is just a number (days since 1900), so end minus start gives days.`
      ],
      how: [
        `[10 min] Type the Sales table from the example into A1:F8. In G1 write Revenue, in G2 type =E2*F2 and fill down.`,
        `[20 min] Write the SUMIFS and COUNTIFS examples one by one. Change the criteria and watch the result.`,
        `[15 min] Add column H "Size" with the IFS formula. Then try the same logic with nested IF to see why IFS is cleaner.`,
        `[15 min] Type the SKU text in J2 and do LEFT/MID/RIGHT/FIND. Do TEXTJOIN on the Product column.`,
        `[10 min] Do the date formulas on column B.`,
        `[20 min] Solve the practice questions. Check the answers.`
      ],
      example: `<p>Sales table (use this table for all practice today):</p>${pre(`A        B           C       D        E     F      G
OrderID  OrderDate   Region  Product  Qty   Price  Revenue (=E*F)
1001     05-Jan-25   North   Pen      10    5      50
1002     12-Jan-25   South   Book     3     120    360
1003     03-Feb-25   North   Book     2     120    240
1004     14-Feb-25   East    Pen      20    5      100
1005     20-Feb-25   South   Bag      1     800    800
1006     02-Mar-25   North   Bag      2     800    1600
1007     15-Mar-25   East    Book     5     120    600`)}
${pre(`=SUMIFS(G2:G8, C2:C8, "North")                       -> 1890
=SUMIFS(G2:G8, C2:C8, "North", D2:D8, "Book")        -> 240
=COUNTIFS(C2:C8, "East")                             -> 2
=AVERAGEIFS(E2:E8, D2:D8, "Pen")                     -> 15
=COUNTIFS(G2:G8, ">500")                             -> 3
=IFS(G2>=1000,"Large", G2>=300,"Medium", TRUE,"Small")  -> Small (for G2 = 50)`)}
<p><b>Line by line:</b> In the first formula, G2:G8 is what to add, C2:C8 is where to check, "North" is the condition. Rows 2, 4 and 7 of the data (orders 1001, 1003, 1006) are North: 50 + 240 + 1600 = 1890. IFS tests left to right and stops at the first TRUE. The last pair TRUE,"Small" is the "else".</p>
<p>Text and date examples. Put the SKU NTH-BK-0042 in J2:</p>${pre(`=LEFT(J2,3)              -> NTH
=MID(J2,5,2)             -> BK
=RIGHT(J2,4)             -> 0042
=VALUE(RIGHT(J2,4))      -> 42
=FIND("-",J2)            -> 4
=TEXTJOIN(", ",TRUE,D2:D4) -> Pen, Book, Book
=EOMONTH(B3,0)           -> 31-Jan-25
=TEXT(B2,"mmm-yyyy")     -> Jan-2025
=B8-B2                   -> 69  (days between 5-Jan and 15-Mar)
=DATEDIF(B2,B8,"m")      -> 2   (complete months)`)}`,
      practice: [
        [`Total revenue for Region = South.`, `${pre(`=SUMIFS(G2:G8, C2:C8, "South")`)}Result: 1160 (360 + 800).`],
        [`How many orders have Revenue of 240 or more AND are in the North region?`, `${pre(`=COUNTIFS(C2:C8, "North", G2:G8, ">=240")`)}Result: 2 (orders 1003 and 1006). Order 1001 is only 50.`],
        [`Total revenue in February 2025 using the dates, not the month name.`, `${pre(`=SUMIFS(G2:G8, B2:B8, ">="&DATE(2025,2,1), B2:B8, "<"&DATE(2025,3,1))`)}Result: 1140 (240 + 100 + 800). Use "greater or equal to first day" and "less than first day of next month" so it works for any day.`],
        [`Add a column "Size": Large if Revenue is 1000 or more, Medium if 300 or more, else Small. Give the result for orders 1002 and 1006.`, `${pre(`=IFS(G2>=1000,"Large", G2>=300,"Medium", TRUE,"Small")`)}1002 (360) = Medium, 1006 (1600) = Large. Older Excel: =IF(G2>=1000,"Large",IF(G2>=300,"Medium","Small")).`],
        [`Show the average price per unit for each row without a #DIV/0! error if Qty is 0.`, `${pre(`=IFERROR(G2/E2, 0)`)}If Qty is 0 the division fails and 0 is shown. Better practice: =IF(E2=0, 0, G2/E2), so you only hide the error you expect.`],
        [`The SKU in J2 is NTH-BK-0042. Extract the middle part (BK) without counting characters by hand, so it works even if the first part has a different length.`, `${pre(`=MID(J2, FIND("-",J2)+1, FIND("-",J2,FIND("-",J2)+1) - FIND("-",J2) - 1)`)}Result: BK. First FIND gets the position of the first dash (4). Second FIND starts searching after it (position 7). The length is 7 - 4 - 1 = 2.`]
      ],
      important: [
        [`COUNTIF vs COUNTIFS vs SUMIFS?`, `<p>COUNTIF counts with one condition. COUNTIFS counts with many conditions combined with AND. SUMIFS adds a numeric column with many conditions. For OR logic I add two COUNTIFS together or use SUMPRODUCT.</p>`],
        [`How do you handle #N/A or #DIV/0! errors?`, `<p>Wrap the formula in IFERROR or IFNA, for example IFERROR(A2/B2, 0). But I first find the cause. Hiding every error can hide bad data, so I only wrap formulas where the error is expected.</p>`],
        [`How do you get the month and year from a date?`, `<p>MONTH(date) and YEAR(date) give numbers. TEXT(date, "mmm-yyyy") gives a label like Jan-2025. For grouping I prefer a pivot table date group or a Calendar table instead of formulas.</p>`]
      ],
      resources: [[`ExcelIsFun (YouTube)`, `https://www.youtube.com/@excelisfun`], [`Chandoo.org`, `https://chandoo.org`]],
      done: `You are done when you can write SUMIFS with a date range and an IFS formula without looking, and explain why sum_range comes first.`
    },
    {
      title: `Pivot tables, calculated fields, slicers, timelines`,
      time: `1.5 h`,
      study: [
        `A pivot table summarises a big table by dragging fields into Rows, Columns, Values and Filters.`,
        `Your data must be tidy: one header row, no blank rows or columns, no merged cells. Convert it to a Table (Ctrl+T) so the pivot grows with new data.`,
        `A pivot does not update by itself. Right-click > Refresh, or Data > Refresh All.`,
        `Value Field Settings lets you change Sum to Count, Average, and use "Show Values As" (for example % of Grand Total).`,
        `Group: right-click a date in the pivot > Group > choose Months and Years. You can also group numbers into ranges (bins).`,
        `Calculated field (PivotTable Analyze > Fields, Items & Sets > Calculated Field) makes a new column from other fields. It works on the SUMS of fields, not on each row.`,
        `Slicers (PivotTable Analyze > Insert Slicer) are clickable filter buttons. Timelines (Insert Timeline) filter by date. One slicer can control many pivots via Report Connections.`,
        `PivotChart (PivotTable Analyze > PivotChart) draws a chart that follows the pivot.`
      ],
      how: [
        `[5 min] Reuse the Sales table from yesterday (A1:G8). Click inside it and press Ctrl+T if it is not a Table yet.`,
        `[15 min] Insert > PivotTable > From Table/Range > New Worksheet. Put Region in Rows and Revenue in Values. Compare with the example result.`,
        `[15 min] Add Product to Columns. Then change Revenue to "Show Values As > % of Grand Total".`,
        `[15 min] Drag OrderDate to Rows. Right-click a date > Group > Months. Check the monthly totals.`,
        `[15 min] Add a calculated field: Avg Price = Revenue / Qty. Then try Revenue2 = Qty * Price and compare (see practice).`,
        `[10 min] Insert a slicer for Region and a timeline for OrderDate. Insert a PivotChart.`,
        `[15 min] Practice questions.`
      ],
      example: `<p>Using the Sales table from yesterday. Pivot 1: Region in Rows, Sum of Revenue in Values:</p>${pre(`Row Labels   Sum of Revenue
East                   700
North                 1890
South                 1160
Grand Total           3750`)}
<p>Pivot 2: OrderDate (grouped by Months) in Rows:</p>${pre(`Jan    410     (50 + 360)
Feb   1140     (240 + 100 + 800)
Mar   2200     (1600 + 600)
Total 3750`)}
<p>Pivot 3: Product in Rows, Revenue shown as % of Grand Total:</p>${pre(`Bag    64.0%    (2400 / 3750)
Book   32.0%    (1200 / 3750)
Pen     4.0%    (150 / 3750)`)}
<p><b>Explain:</b> Excel adds all Revenue values that share the same Region label. That is the same idea as SQL GROUP BY Region with SUM(Revenue). "Show Values As" divides each number by the grand total.</p>
<p><b>Calculated field trap:</b> A field "Avg Price" = Revenue / Qty works, because the pivot divides total Revenue by total Qty. But a field "Rev2" = Qty * Price multiplies the SUM of Qty by the SUM of Price, which is wrong (for North: 14 x 925 = 12950 instead of 1890). Create row-level calculations as a column in the source Table, not as a calculated field.</p>`,
      practice: [
        [`Which pivot fields give "total revenue by product and region"? What is the value for Bag in North?`, `<p>Rows: Product. Columns: Region. Values: Sum of Revenue. Bag in North = 1600 (only order 1006).</p>`],
        [`How do you show the number of orders per region instead of revenue?`, `<p>Put Region in Rows and OrderID in Values, then Value Field Settings > Count. Result: North 3, South 2, East 2.</p>`],
        [`How do you show revenue by month and year when the pivot shows each date separately?`, `<p>Right-click any date in the pivot > Group > select Months (and Years) > OK. Excel 365 may group dates automatically; if not, use this step.</p>`],
        [`Add a calculated field Avg Price. What formula and what value for Region = North?`, `${pre(`= Revenue / Qty`)}North: 1890 / 14 = 135. This is the weighted average price, which is more correct than averaging the Price column.`],
        [`You add a new row to the source data but the pivot does not show it. List two causes and fixes.`, `<p>1) The pivot was not refreshed. Fix: right-click > Refresh. 2) The source was a normal range, so the new row is outside it. Fix: convert the source to a Table (Ctrl+T) or change the data source in PivotTable Analyze > Change Data Source.</p>`],
        [`One Region slicer must control three pivots on a dashboard. How?`, `<p>Right-click the slicer > Report Connections (or PivotTable Connections) > tick all three pivots. All pivots must use the same source (same pivot cache) to appear in the list.</p>`]
      ],
      important: [
        [`What is a pivot table and when do you use it?`, `<p>A tool to summarise big tables quickly by dragging fields to rows, columns, values and filters. I use it for sales by region or month, counts, averages and quick checks. I keep the source as an Excel Table so it grows, and I refresh after changes.</p>`],
        [`Calculated field vs calculated column?`, `<p>A calculated field works on the summed values inside the pivot, so it is good for ratios like Revenue / Qty. A calculated column is added in the source data and works row by row. For row-level math such as Qty * Price I add a column to the source.</p>`],
        [`Pivot table vs SUMIFS?`, `<p>A pivot is fast for exploring and has slicers. SUMIFS is formula-based, so it can sit in a fixed report layout and recalculate automatically without refresh. For dashboards I often use pivots plus GETPIVOTDATA for KPI cards.</p>`]
      ],
      resources: [[`Chandoo.org`, `https://chandoo.org`], [`ExcelIsFun (YouTube)`, `https://www.youtube.com/@excelisfun`]],
      done: `You are done when you can build a pivot with a grouped date, a slicer and a pivot chart in under 5 minutes.`
    },
    {
      title: `Power Query: import, merge, append, unpivot, split, group`,
      time: `1.5 h`,
      study: [
        `Power Query is the tool inside Excel (and Power BI) to import and clean data. It records every step so you can refresh with one click.`,
        `Open it from Data > Get Data (or Data > From Table/Range for data already in the sheet). The window that opens is the Power Query Editor.`,
        `The Applied Steps list on the right is your recipe. Click a step to see data at that point. Each step is written in the M language (for example Table.TransformColumnTypes).`,
        `Always set correct data types (the ABC / 123 icon in the header). Wrong types cause wrong sorting, wrong sums and failed merges.`,
        `Merge Queries joins two tables side by side on a key (like a SQL JOIN). Join kinds: Left Outer, Right Outer, Full Outer, Inner, Left Anti, Right Anti.`,
        `Append Queries stacks tables with the same columns on top of each other (like SQL UNION ALL).`,
        `Unpivot Columns turns columns (like Jan, Feb, Mar) into rows (Month, Value). Prefer Unpivot Other Columns because it still works when new month columns appear.`,
        `Split Column (By Delimiter) cuts one column into several. Group By summarises rows (like GROUP BY in SQL).`,
        `Load with Home > Close & Load (or Close & Load To... to choose Table, Connection only, or Data Model). Refresh later with Data > Refresh All.`
      ],
      how: [
        `[10 min] Put the wide table (example) in a sheet. Click inside > Data > From Table/Range. The editor opens.`,
        `[15 min] Click the Product column header (select only that column). Then Transform > Unpivot Columns drop-down > Unpivot Other Columns. Rename the new columns to Month and Units.`,
        `[15 min] Create two small tables Orders and Customers (example). Load each as Connection only. Home > Merge Queries as New, choose CustID in both, join kind Left Outer. Expand the Name column.`,
        `[10 min] Try Inner join and Left Anti join. Compare row counts.`,
        `[10 min] Append: make two tables Sales_Jan and Sales_Feb with the same columns. Home > Append Queries as New.`,
        `[10 min] Try Split Column By Delimiter on a Full Name column and Group By on a sales table.`,
        `[20 min] Practice questions. Then Close & Load and press Data > Refresh All after editing source data.`
      ],
      example: `<p><b>1. Unpivot.</b> Wide table (months as columns):</p>${pre(`Product  Jan  Feb  Mar
Pen       10   20    5
Book       3    2    5
Bag        1    0    2`)}
<p>Select the Product column, then Transform > Unpivot Columns drop-down > Unpivot Other Columns. Rename Attribute to Month and Value to Units. Result (9 rows):</p>${pre(`Product  Month  Units
Pen      Jan    10
Pen      Feb    20
Pen      Mar     5
Book     Jan     3
... (9 rows in total)`)}
<p>The M code that Power Query writes (View > Advanced Editor):</p>${pre(`let
    Source = Excel.CurrentWorkbook(){[Name="tblWide"]}[Content],
    Typed = Table.TransformColumnTypes(Source,{{"Product", type text},{"Jan", Int64.Type},{"Feb", Int64.Type},{"Mar", Int64.Type}}),
    Unpivoted = Table.UnpivotOtherColumns(Typed, {"Product"}, "Month", "Units")
in
    Unpivoted`)}
<p><b>2. Merge.</b> Orders and Customers:</p>${pre(`Orders:                      Customers:
OrderID  CustID  Amount      CustID  Name
1        C1      500         C1      Asha
2        C2      300         C2      Ravi
3        C9      200         C3      Meena`)}
${pre(`Left Outer (all Orders): 3 rows. Order 3 has Name = null (C9 not in Customers).
Inner:                      2 rows (orders 1 and 2).
Left Anti (Orders only):    1 row  (order 3).`)}
<p>M for the left outer merge and expand:</p>${pre(`Merged = Table.NestedJoin(Orders, {"CustID"}, Customers, {"CustID"}, "Customers", JoinKind.LeftOuter),
Expanded = Table.ExpandTableColumn(Merged, "Customers", {"Name"}, {"Name"})`)}
<p><b>3. Group By</b> (Region, sum of Revenue):</p>${pre(`Table.Group(Source, {"Region"}, {{"Total Revenue", each List.Sum([Revenue]), type nullable number}})`)}
<p>In the UI: Transform > Group By > Region > operation Sum > column Revenue.</p>`,
      practice: [
        [`Months are in columns (Jan, Feb, Mar). Which Power Query command makes them rows, and which version is safer?`, `<p>Unpivot Columns. The safer one is Unpivot Other Columns (select the key columns first). It keeps working when a new month column such as Apr is added later.</p>`],
        [`Using the Orders and Customers tables: which join kind keeps all orders even if the customer is missing? How many rows? Which kind finds orders with no matching customer?`, `<p>Left Outer, 3 rows. Left Anti finds the unmatched orders: 1 row (order 3, customer C9).</p>`],
        [`Two sheets Jan and Feb have the same columns. How do you combine them? Merge or Append? What if there are 12 files in a folder?`, `<p>Append Queries (stack rows). For many files use Get Data > From File > From Folder and combine the files, so new files are added on refresh automatically.</p>`],
        [`A column "Full Name" has "Asha Rao". How do you get First and Last name columns?`, `<p>Select the column > Home (or Transform) > Split Column > By Delimiter > Space > "At each occurrence" > OK. You get Full Name.1 and Full Name.2. Rename them to First and Last. M step: Table.SplitColumn.</p>`],
        [`Dates like 05/01/2025 are read as 1 May instead of 5 January. Fix in Power Query.`, `<p>Right-click the column type icon > Change Type > Using Locale. Choose Date and a locale such as English (India) or English (United Kingdom) that uses day/month/year. The data type and the locale together decide how text is read.</p>`],
        [`Write the M step name that creates the data type change and explain why it should be the step right after the Source step.`, `<p>Table.TransformColumnTypes. Setting types early makes later steps (merge, sort, group) behave correctly, for example numbers sort as numbers, not as text.</p>`]
      ],
      important: [
        [`Merge vs Append in Power Query?`, `<p>Merge joins two tables side by side on a key, like a SQL JOIN. Append stacks tables with similar columns on top of each other, like UNION ALL.</p>`],
        [`Why use Power Query instead of formulas for cleaning?`, `<p>Power Query records each step, so cleaning is repeatable: when new data arrives I click Refresh and all steps run again. It handles large data, and nothing in the raw data is changed. Formulas are better for in-sheet calculations after the data is clean.</p>`],
        [`What is the difference between Unpivot and Pivot?`, `<p>Unpivot turns many columns into rows (wide to long), which is the format pivots, SQL and Power BI like best. Pivot Column does the opposite and turns row values into columns.</p>`]
      ],
      resources: [[`Microsoft Learn: Power BI`, `https://learn.microsoft.com/en-us/training/powerplatform/power-bi`], [`Chandoo.org`, `https://chandoo.org`]],
      done: `You are done when you can unpivot a wide table, merge two queries with a left outer join, and explain what Applied Steps are.`
    },
    {
      title: `Data-cleaning checklist + dynamic arrays`,
      time: `1.5 h`,
      study: [
        `Cleaning checklist: 1) keep a raw copy, 2) fix headers and types, 3) trim spaces, 4) fix case and spelling, 5) remove duplicates, 6) handle blanks, 7) check outliers and impossible values, 8) validate totals against the source.`,
        `TRIM removes extra spaces (it also collapses double spaces inside text). CLEAN removes hidden non-printing characters. A web-copied space is CHAR(160) and needs SUBSTITUTE(text, CHAR(160), " ").`,
        `Numbers stored as text: use VALUE(), or Data > Text to Columns > Finish, or in Power Query set the type. Dates stored as text: use DATEVALUE or Text to Columns with a DMY format.`,
        `Duplicates: Data > Remove Duplicates (deletes rows!), or Conditional Formatting > Highlight Cells Rules > Duplicate Values (just shows them), or a COUNTIF formula that checks if the count is greater than 1, as a flag.`,
        `Blanks: Home > Find and Select > Go To Special > Blanks selects all empty cells. Decide: fill, leave, or remove. Never silently fill with 0.`,
        `Outliers: use the IQR rule. Lower fence = Q1 - 1.5 x IQR, upper fence = Q3 + 1.5 x IQR, where IQR = Q3 - Q1. Use QUARTILE.INC.`,
        `Optional: dynamic array functions (Excel 365/2021) return many cells that spill: UNIQUE, SORT, FILTER. Older Excel: use Remove Duplicates, Sort button, and Advanced Filter.`,
        `Optional: if a spill range is blocked you get #SPILL!. Clear the cells in the way.`
      ],
      how: [
        `[10 min] Type the messy table (example) into a sheet. Duplicate the sheet and name the copy Raw (never edit Raw).`,
        `[20 min] Fix names, amounts and city spelling with formulas in helper columns. Then paste values over the original.`,
        `[10 min] Find the duplicate customer using conditional formatting, then remove it.`,
        `[10 min] Calculate Q1, Q3, IQR and fences for the Amount list with QUARTILE.INC. Flag the outlier.`,
        `[10 min] Repeat the same cleaning in Power Query (Transform > Format > Trim, Capitalize Each Word; Replace Values; Remove Duplicates). Notice the steps are saved.`,
        `[15 min] Optional: use UNIQUE, SORT, FILTER on yesterday's Sales table.`,
        `[15 min] Practice questions.`
      ],
      example: `<p>Messy data (Name has extra spaces, Amount is text with commas, City is spelled differently, row 5 duplicates row 2):</p>${pre(`ID  Name          City     Amount
1   " asha  rao " Mumbai   "1,200"
2   RAVI KUMAR    mumbai   950
3   Meena         Mumbay   (blank)
4   Karan         Delhi    1100
5   RAVI KUMAR    mumbai   950`)}
<p>Fixes in helper columns:</p>${pre(`Name:   =PROPER(TRIM(B2))                      -> "Asha Rao"
Amount: =VALUE(SUBSTITUTE(D2,",",""))             -> 1200
City:   map Mumbay -> Mumbai (Find & Replace, or a mapping table + XLOOKUP)
Dup:    =COUNTIFS($B$2:$B$6,B2,$D$2:$D$6,D2)>1    -> TRUE for IDs 2 and 5 (flag), keep one`)}
<p><b>Outliers with IQR.</b> Amounts in B2:B9: 900, 950, 1000, 1050, 1100, 1150, 1200, 9999.</p>${pre(`Q1  = QUARTILE.INC(B2:B9,1)   -> 987.5
Q3  = QUARTILE.INC(B2:B9,3)   -> 1162.5
IQR = Q3 - Q1                 -> 175
Upper fence = Q3 + 1.5*IQR    -> 1425
Lower fence = Q1 - 1.5*IQR    -> 725
9999 is above 1425 -> outlier`)}
<p>An outlier is not always wrong. Check it first (a real big order? an extra zero typed?) before deleting. Flag it, then decide.</p>
<p><b>Dynamic arrays</b> on the Sales table (A1:G8 from Day 2):</p>${pre(`=UNIQUE(C2:C8)                       -> North, South, East
=SORT(UNIQUE(C2:C8))                 -> East, North, South
=FILTER(A2:G8, C2:C8="North", "None")-> 3 rows (1001, 1003, 1006)
=SORT(FILTER(A2:G8,C2:C8="North"),7,-1) -> same 3 rows, biggest Revenue first (1006, 1003, 1001)
=SUM(FILTER(G2:G8, C2:C8="North"))   -> 1890`)}`,
      practice: [
        [`The cell B2 has " asha  rao " with spaces at the start, end and middle. Give the formula to get "Asha Rao".`, `${pre(`=PROPER(TRIM(B2))`)}TRIM removes leading, trailing and double spaces. PROPER capitalises each word.`],
        [`D2 contains the text "1,200". Convert it to a number you can sum.`, `${pre(`=VALUE(SUBSTITUTE(D2,",",""))`)}Result: 1200. SUBSTITUTE removes the comma and VALUE converts the text to a number. In Power Query: right-click column > Replace Values (comma with nothing), then set type to Whole Number.`],
        [`Find the number of blank cells in D2:D100 and select them to review.`, `${pre(`=COUNTBLANK(D2:D100)`)}To select them: select the range, press F5 > Special > Blanks > OK.`],
        [`Amounts are 900, 950, 1000, 1050, 1100, 1150, 1200, 9999. Is 1700 an outlier by the IQR rule? Show the formula for the upper fence.`, `${pre(`=QUARTILE.INC(B2:B9,3) + 1.5*(QUARTILE.INC(B2:B9,3) - QUARTILE.INC(B2:B9,1))`)}Result: 1425. 1700 is greater than 1425, so by the IQR rule it is an outlier.`],
        [`How many unique regions are in C2:C8 of the Sales table, and which formula returns them sorted? Give an older-Excel option.`, `${pre(`=SORT(UNIQUE(C2:C8))
=ROWS(UNIQUE(C2:C8))`)}Result: East, North, South and a count of 3. Older Excel: copy the column, Data > Remove Duplicates, then sort.`],
        [`Interview scenario: you get a customer file with 50,000 rows. Walk through how you clean it and keep it repeatable.`, `<p>Keep the raw file untouched. Load it in Power Query. Set data types, trim text, fix case, replace known spelling errors with a mapping table, remove duplicates by key, handle blanks by rule (flag or fill with agreed value), flag outliers instead of deleting. Check row counts and totals before and after. Load the clean table to a new sheet. When a new file comes, I just refresh.</p>`]
      ],
      important: [
        [`How do you clean a messy dataset in Excel?`, `<p>Make a raw copy first. Then fix types, TRIM and CLEAN text, standardise spelling, remove duplicates, handle blanks and check outliers. I prefer Power Query so the steps are saved and repeatable. At the end I reconcile counts and totals with the raw data.</p>`],
        [`How do you treat missing values and outliers?`, `<p>Missing: first understand why. Options are leave blank, fill with a business rule (like median or "Unknown"), or remove the row if few. I document the choice. Outliers: check if real or an error with the data owner. I flag them with the IQR rule, then decide to keep, cap or remove, and I note it in the report.</p>`],
        [`Name 3 dynamic array functions and one limitation.`, `<p>UNIQUE, SORT and FILTER (also SEQUENCE, TAKE). They return many values that spill into nearby cells. Limitation: they work only in Excel 365/2021, and a blocked spill range gives #SPILL!.</p>`]
      ],
      resources: [[`Chandoo.org`, `https://chandoo.org`]],
      done: `You are done when you can clean the messy sample with TRIM/PROPER/VALUE, flag a duplicate, and compute IQR fences without notes.`
    },
    {
      title: `Day 6 project: Excel dashboard on Superstore`,
      time: `3.5 h`,
      study: [
        `A good dashboard answers 3-4 business questions on one screen: how much did we sell, how much profit, where, and what changed.`,
        `Structure: Data sheet (clean Table), Calc sheet (pivots), Dashboard sheet (KPI cards, charts, slicers). Users only see Dashboard.`,
        `KPI cards that must react to slicers should read from a pivot with GETPIVOTDATA, not from a plain SUM of the table.`,
        `A distinct count (unique orders) in a pivot needs the Data Model: tick "Add this data to the Data Model" when inserting the pivot, then Value Field Settings > Distinct Count.`,
        `Chart choice: line for trend over time, bar for ranking categories, column for few categories, avoid pie with more than 4 slices.`,
        `Use one colour for normal data and one accent colour to highlight. Remove gridlines, add clear titles with the insight, and keep fonts consistent.`,
        `Profit Margin = Profit / Sales. Average Order Value (AOV) = Sales / Number of Orders.`,
        `Superstore column names vary by version. Typical columns: Order ID, Order Date, Ship Mode, Segment, Region, State, Category, Sub-Category, Sales, Quantity, Discount, Profit. Use the names in your file.`
      ],
      how: [
        `[15 min] Download a Superstore dataset (search "Superstore" on Kaggle Datasets). Open it in Excel. Save as Superstore_Dashboard.xlsx. Select data, Ctrl+T, name the table tblSuperstore (Table Design > Table Name).`,
        `[20 min] Check the data: types for Order Date (date), Sales and Profit (numbers). Fix problems using the Day 5 checklist. Add columns Year =YEAR([@[Order Date]]) and Month if needed.`,
        `[30 min] On a new sheet Calc build pivots (tick "Add this data to the Data Model" for EVERY pivot, because slicers can only connect pivots that share one cache; a Data Model pivot and a normal pivot cannot share a slicer): (1) KPI pivot: Sales, Profit, Orders (distinct count); (2) Sales by Month (grouped dates); (3) Sales by Category; (4) Profit by Region; (5) Top 10 Sub-Category by Sales (Value Filters > Top 10).`,
        `[30 min] On a new sheet Dashboard: insert 4 PivotCharts from those pivots: line (month), bar (category), column (region), bar (Top 10 sub-category).`,
        `[20 min] Add slicers for Region, Category and Segment plus a Timeline for Order Date. Connect every slicer to all pivots with Report Connections.`,
        `[30 min] Build KPI cards at the top: Total Sales, Total Profit, Profit Margin, Orders. Use GETPIVOTDATA. Format as big numbers in a bordered cell with a small label above.`,
        `[25 min] Polish: View > uncheck Gridlines, align shapes (Shape Format > Align), same colours, add titles with insight text, hide the Calc sheet or place it last.`,
        `[20 min] Test: click each slicer and check all cards and charts change. Write 3 insights in a text box. Save a screenshot for GitHub. Deliverable: Superstore_Dashboard.xlsx + screenshot.png.`
      ],
      example: `<p>Suggested layout (one screen):</p>${pre(`+--------------------------------------------------------+
| Superstore Sales Dashboard      [Region] [Category] [Year] |
+----------+----------+----------+----------+----------------+
| Sales    | Profit   | Margin % | Orders   |  (KPI cards)   |
+----------+----------+----------+----------+----------------+
| Sales by Month (line)       | Sales by Category (bar)     |
+-----------------------------+-----------------------------+
| Profit by Region (column)   | Top 10 Sub-Category (bar)   |
+-----------------------------+-----------------------------+
| Insight 1 / 2 / 3 (text box)                              |
+-----------------------------------------------------------+`)}
<p>KPI formulas. Suppose the KPI pivot starts at Calc!A3 with value fields named "Sum of Sales" and "Sum of Profit":</p>${pre(`Total Sales  : =GETPIVOTDATA("Sum of Sales", Calc!$A$3)
Total Profit : =GETPIVOTDATA("Sum of Profit", Calc!$A$3)
Profit Margin: =(Total Profit cell)/(Total Sales cell)   (format as %)
AOV          : =(Total Sales cell)/(Orders cell)`)}
<p>The GETPIVOTDATA formula returns the pivot's current grand total, so when a slicer changes the pivot the card changes too. A plain =SUM(tblSuperstore[Sales]) would never change.</p>
<p>Mini check with round numbers: if Sales = 2,000,000 and Profit = 250,000, then Margin = 250,000 / 2,000,000 = 12.5%. Your own totals depend on the file version, so compare your pivot total with =SUM(tblSuperstore[Sales]) to be sure the pivot is complete.</p>
<p>Distinct orders without the Data Model (365): <code>=COUNTA(UNIQUE(tblSuperstore[Order ID]))</code>. This is a formula, so it does not react to slicers; use the pivot Distinct Count if you want it to react.</p>`,
      practice: [
        [`Your KPI card shows the same total when you click a slicer. Why and how to fix?`, `<p>The card uses =SUM(table), which ignores pivot filters. Fix: build a pivot, connect the slicer to it, and read the card with GETPIVOTDATA.</p>`],
        [`The slicer changes one chart but not the others. Fix.`, `<p>Right-click the slicer > Report Connections > tick all pivots. All pivots must be built from the same table/pivot cache; create the next pivots by copying the first or using the same source.</p>`],
        [`Months are sorted Apr, Aug, Dec in the chart. How do you get Jan..Dec in order?`, `<p>Group the Order Date field by Months and Years in the pivot so Excel uses real date order. If you used text month names, add a month number column and sort by it, or add a custom list sort.</p>`],
        [`Write the profit margin formula and say what a negative margin in a Sub-Category means.`, `${pre(`=SUM(tblSuperstore[Profit]) / SUM(tblSuperstore[Sales])`)}Negative margin means that group loses money. In Superstore this often links to high discounts, so check Discount next.`],
        [`How do you show only the Top 10 Sub-Categories by Sales in a pivot?`, `<p>Click the filter arrow on Row Labels > Value Filters > Top 10 > Top 10 Items by Sum of Sales > OK. Then sort descending.</p>`],
        [`Give 3 insights format for the text box using this pattern: finding, number, action.`, `<p>Example pattern: "[Category X] gives the highest profit ([amount], margin [x%]), so protect its stock." / "[Category Y] has the lowest margin ([x%]), so review its discounts." / "Sales peak in [months], so plan inventory and campaigns before." Fill in the real numbers from your own pivots.</p>`]
      ],
      important: [
        [`How do you build an Excel dashboard? What are your best practices?`, `<p>Clean data in a Table or Power Query, summarise with pivots on a Calc sheet, show KPI cards and 4-6 charts on one Dashboard sheet, and connect slicers to all pivots. KPIs on top, few colours, clear titles, no hard-coded numbers, and a note on assumptions. I test every slicer before sharing.</p>`],
        [`Which chart for which question?`, `<p>Trend over time: line. Compare categories: bar or column. Share of total with few parts: pie or donut (max 4-5 parts), otherwise bar. Relationship between two numbers: scatter. Part-to-whole over time: stacked column.</p>`],
        [`Walk me through the insights in your dashboard.`, `<p>Start with the headline KPI, then the biggest driver (category/region), then one problem area (low margin), then a recommendation. Always quote numbers and end with a business action.</p>`]
      ],
      resources: [[`Kaggle Datasets`, `https://www.kaggle.com/datasets`], [`Maven Analytics Data Playground`, `https://mavenanalytics.io/data-playground`], [`Chandoo.org`, `https://chandoo.org`]],
      done: `You are done when your dashboard file has 4 KPI cards, 4 charts, 3 slicers that all work, and a screenshot saved.`
    },
    {
      title: `Review: Excel Q&A + SQL window functions revisited`,
      time: `3.5 h`,
      study: [
        `Revise lookups: XLOOKUP vs VLOOKUP vs INDEX-MATCH, and the four reasons for #N/A.`,
        `Revise SUMIFS / COUNTIFS, IFS, IFERROR and date criteria with ">="&DATE().`,
        `Revise pivot tables: refresh, grouping, calculated field limits, slicers and report connections.`,
        `Revise Power Query: merge vs append, unpivot, data types, refresh.`,
        `Revise the cleaning checklist and IQR outlier rule.`,
        `SQL window functions: ROW_NUMBER, RANK, DENSE_RANK, LAG, SUM() OVER (ORDER BY ...) for running total, and SUM() OVER () for share of total.`,
        `Advanced (skip if short on time): Power Pivot / Data Model. It lets Excel hold many related tables with relationships and DAX measures. Enable via File > Options > Add-ins > Manage: COM Add-ins > Go > tick Microsoft Power Pivot for Excel (in many 365 builds it is already under the Data tab as Manage Data Model). VBA is NOT needed for entry-level roles.`
      ],
      how: [
        `[40 min] Open the Interview Q&A page, section Excel. Read each question, answer aloud in 30-60 seconds, then read the model answer. Mark weak ones.`,
        `[30 min] Excel speed round: rebuild the Day 2 Sales sheet and the pivots from memory, timed. Target: under 15 minutes.`,
        `[60 min] Solve the 5 SQL window problems below in your SQL tool. Write each query yourself before checking.`,
        `[20 min] Optional: Power Pivot. Insert > PivotTable > tick "Add this data to the Data Model". Open the Power Pivot window and look at the diagram view. Just look, do not master it.`,
        `[30 min] Write a one-page Excel cheat sheet: formulas you must know, pivot steps, Power Query steps.`,
        `[30 min] Fix the weak questions. Commit your SQL answers to your sql-practice repo.`
      ],
      example: `<p>Table emp (use for the SQL problems):</p>${pre(`emp_id  name    dept   salary
1       Asha    HR     40000
2       Ravi    IT     65000
3       Meena   IT     72000
4       Karan   Sales  50000
5       Divya   HR     45000
6       Sam     IT     65000
7       Neha    Sales  58000`)}
<p>Problem 1: rank employees by salary inside each department with no gaps in rank numbers.</p>${pre(`SELECT name, dept, salary,
       DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS rnk
FROM emp;`)}
<p>Expected for IT: Meena 1, Ravi 2, Sam 2 (Ravi and Sam are tied, so both are 2). HR: Divya 1, Asha 2. Sales: Neha 1, Karan 2.</p>
<p><b>Explain:</b> PARTITION BY dept restarts the ranking for each department. ORDER BY salary DESC puts the highest salary first. DENSE_RANK gives the same number to ties and does not skip the next number.</p>`,
      practice: [
        [`SQL: Return the second highest salary in each department (ties count as the same rank). Give the result rows.`, `${pre(`SELECT name, dept, salary
FROM (
  SELECT name, dept, salary,
         DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS rnk
  FROM emp
) t
WHERE rnk = 2;`)}Result: Ravi (IT, 65000), Sam (IT, 65000), Asha (HR, 40000), Karan (Sales, 50000). A window function cannot be used directly in WHERE, so wrap it in a subquery or CTE.`],
        [`SQL: Show a running total of salary ordered by emp_id. What are the values?`, `${pre(`SELECT emp_id, name, salary,
       SUM(salary) OVER (ORDER BY emp_id) AS running_total
FROM emp;`)}Running totals: 40000, 105000, 177000, 227000, 272000, 337000, 395000.`],
        [`SQL: Show each employee's salary difference from the previous employee (by emp_id).`, `${pre(`SELECT emp_id, name, salary,
       salary - LAG(salary) OVER (ORDER BY emp_id) AS diff
FROM emp;`)}Result: NULL, 25000, 7000, -22000, -5000, 20000, -7000. The first row has no previous row, so LAG gives NULL.`],
        [`SQL: Show each employee's percent of total company salary, rounded to 2 decimals. What is Asha's value?`, `${pre(`SELECT name,
       ROUND(salary * 100.0 / SUM(salary) OVER (), 2) AS pct_of_total
FROM emp;`)}Total salary is 395000. Asha: 40000 * 100 / 395000 = 10.13. OVER () with nothing inside means the whole table is one window. The 100.0 avoids integer division.`],
        [`SQL: Pick one employee with the highest salary in each department (exactly one row per department, even for ties).`, `${pre(`SELECT name, dept, salary
FROM (
  SELECT name, dept, salary,
         ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC, emp_id) AS rn
  FROM emp
) t
WHERE rn = 1;`)}Result: Divya (HR), Meena (IT), Neha (Sales). ROW_NUMBER never gives ties; adding emp_id makes the tie-break fixed.`],
        [`Excel timed task (10 min): from the Sales table, give the formula for total revenue of Book in March and the result.`, `${pre(`=SUMIFS(G2:G8, D2:D8, "Book", B2:B8, ">="&DATE(2025,3,1), B2:B8, "<"&DATE(2025,4,1))`)}Result: 600 (order 1007).`]
      ],
      important: [
        [`ROW_NUMBER vs RANK vs DENSE_RANK?`, `<p>ROW_NUMBER gives a unique number to each row, even for ties. RANK gives the same number to ties and skips the next numbers (1, 2, 2, 4). DENSE_RANK gives the same number to ties and does not skip (1, 2, 2, 3).</p>`],
        [`Power Query vs formulas?`, `<p>Power Query is for repeatable import and cleaning: one click refresh, handles large data, saves steps. Formulas are for in-sheet calculations. I use Power Query to shape the data and formulas or pivots to analyse it.</p>`],
        [`What is the Data Model / Power Pivot in Excel?`, `<p>It is an in-memory model inside Excel where you load many tables, create relationships between them, and write DAX measures. It lets a pivot use several tables without VLOOKUPs and handles millions of rows. It is the same engine as Power BI.</p>`],
        [`When would you use Excel and when SQL or Power BI?`, `<p>Excel for quick analysis, small data (under about a million rows) and ad-hoc work. SQL to get and shape data from databases. Power BI for shared interactive dashboards with a proper data model and bigger data.</p>`]
      ],
      resources: [[`SQLBolt (interactive basics)`, `https://sqlbolt.com`], [`Window Functions practice`, `https://www.windowfunctions.com`], [`DataLemur (interview-style)`, `https://datalemur.com`]],
      done: `You are done when you can answer all Excel Q&A questions aloud, solve the 5 window problems without hints, and have a one-page Excel cheat sheet.`
    }
  ]
};
