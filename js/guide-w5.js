/* Week 5 guide: Power BI intermediate + Project 1 (Survey / CSAT dashboard) */
GUIDES[5] = {
  intro: `<p><b>Why this week matters.</b> In interviews, "show me a YoY measure" and "walk me through your dashboard" are very common. This week you learn the DAX time-intelligence pattern, the features that make a report feel professional (drill-through, tooltips, conditional formatting), and then you build <b>Project 1</b>. Your survey job is your edge: most freshers cannot explain NPS, top-2-box, speeders or significance in a crosstab. You can.</p>
<p><b>By Day 7 you can:</b> build a Calendar table and write MoM and YoY measures; add drill-through and tooltip pages; lay out a clean dashboard; and show a finished 3-page survey dashboard on GitHub with insights and recommendations.</p>
<p><b>Time split.</b> Days 1-3 (1.5 h each): learn the Power BI skills on your Week 4 Superstore file. Days 4-5 (1.5 h each): data work (Power Query or pandas). Day 6 (3.5 h): build the dashboard. Day 7 (3.5 h): README, insights, GitHub, and 5 SQL problems. Do not skip the Day 7 SQL: it keeps your daily habit alive.</p>`,
  days: [
    /* ---------------- MON ---------------- */
    {
      title: 'Calendar table and time intelligence',
      time: '1.5 h',
      study: [
        'Time-intelligence functions (TOTALYTD, SAMEPERIODLASTYEAR, DATEADD) only work with a proper Calendar (date) table. The fact table date column alone is not enough.',
        'A Calendar table has one row per day, no gaps, from 1 Jan of the first year to 31 Dec of the last year. Create it with CALENDAR(start, end) or CALENDARAUTO().',
        'After creating it, use Table tools > Mark as date table and pick the Date column. Then link Calendar[Date] to your fact table date (one-to-many, Calendar on the one side).',
        'Add helper columns: Year, Month number, Month name. Use "Sort by column" so month names sort Jan, Feb, Mar and not alphabetically.',
        'TOTALYTD(measure, dates) gives the year-to-date total. SAMEPERIODLASTYEAR(dates) shifts the same dates back one year. DATEADD(dates, -1, MONTH) shifts back one month.',
        'MoM % and YoY % = (current - previous) / previous. Always use DIVIDE so a zero or blank previous value does not give an error.',
        'In visuals, always put Calendar[Year] or Calendar[Month] on the axis, never the fact table date. Otherwise the time functions return wrong or blank values.'
      ],
      how: [
        'Open your Week 4 Superstore .pbix. In the Model view, note the name of your order date column (for example Orders[Order Date]). [5 min]',
        'Modeling > New table. Type the Calendar formula from the example (use the first and last year found in your data). [10 min]',
        'Select the Calendar table, add the columns Year, MonthNo and Month. Select the Month column > Column tools > Sort by column > MonthNo. [10 min]',
        'Table tools > Mark as date table > choose Calendar[Date]. In Model view drag Calendar[Date] onto Orders[Order Date] so a 1:many line appears. [10 min]',
        'Create the measures Total Sales, Sales YTD, Sales LY, YoY %, Sales PM and MoM % (see example). Put them in a "Measures" table or folder. [20 min]',
        'Build a matrix: rows = Calendar[Year] and Calendar[Month], values = Total Sales, Sales LY, YoY %, MoM %. Check by hand that one cell is correct using a calculator. [20 min]',
        'Format YoY % and MoM % as percentage (1 decimal). Add a line chart with Total Sales and Sales LY by Month. [15 min]'
      ],
      example: `<p><b>Tiny fact table</b> (Sales). Only four months, so you can check by hand:</p>
${pre(`Order Date   Sales
2023-01-15    100
2023-02-10    120
2024-01-20    130
2024-02-18    150`)}
<p><b>Step 1: Calendar table</b> (Modeling > New table):</p>
${pre(`Calendar =
ADDCOLUMNS (
    CALENDAR (
        DATE ( YEAR ( MIN ( Sales[Order Date] ) ), 1, 1 ),
        DATE ( YEAR ( MAX ( Sales[Order Date] ) ), 12, 31 )
    ),
    "Year", YEAR ( [Date] ),
    "MonthNo", MONTH ( [Date] ),
    "Month", FORMAT ( [Date], "MMM" )
)`)}
<p>CALENDAR makes one row per day. The MIN/MAX/YEAR/DATE part forces the table to start on 1 Jan and end on 31 Dec. Then mark it as the date table and relate Calendar[Date] to Sales[Order Date].</p>
<p><b>Step 2: measures</b></p>
${pre(`Total Sales = SUM ( Sales[Sales] )

Sales YTD = TOTALYTD ( [Total Sales], 'Calendar'[Date] )

Sales LY = CALCULATE ( [Total Sales], SAMEPERIODLASTYEAR ( 'Calendar'[Date] ) )

YoY % = DIVIDE ( [Total Sales] - [Sales LY], [Sales LY] )

Sales PM = CALCULATE ( [Total Sales], DATEADD ( 'Calendar'[Date], -1, MONTH ) )

MoM % = DIVIDE ( [Total Sales] - [Sales PM], [Sales PM] )`)}
<p><b>Expected result in a matrix (Year, Month):</b></p>
${pre(`Year Month  Total Sales  Sales YTD  Sales LY  YoY %   Sales PM  MoM %
2023 Jan        100        100     (blank)  (blank)  (blank)  (blank)
2023 Feb        120        220     (blank)  (blank)      100    20.0%
2024 Jan        130        130         100    30.0%  (blank)  (blank)
2024 Feb        150        280         120    25.0%      130    15.4%`)}
<p><b>Read it line by line.</b> Feb 2024: Total Sales is 150. Same period last year (Feb 2023) is 120, so YoY = (150 - 120) / 120 = 25%. Previous month (Jan 2024) is 130, so MoM = (150 - 130) / 130 = 15.4%. YTD for Feb 2024 = 130 + 150 = 280. Jan 2024 MoM shows blank because Dec 2023 has no data in this tiny table. DIVIDE returns blank instead of an error. That is correct behaviour.</p>
<p><b>Indian financial year:</b> <code>TOTALYTD ( [Total Sales], 'Calendar'[Date], "3/31" )</code> ends the year on 31 March.</p>`,
      practice: [
        ['Write a calculated table that gives one row per day between 1 Jan 2022 and 31 Dec 2024.', `${pre(`Calendar = CALENDAR ( DATE ( 2022, 1, 1 ), DATE ( 2024, 12, 31 ) )`)}<p>CALENDAR takes a start date and an end date and returns a table with one column called Date.</p>`],
        ['Why must you "Mark as date table" and why must the Calendar have no missing days?', `<p>Time-intelligence functions move dates forward and back. If days are missing, the shifted period is wrong or blank. Marking tells Power BI which column is the official date, so functions work correctly even if you filter the Calendar. Also, the date column must have unique values with no blanks.</p>`],
        ['Write a measure for YoY growth % of [Total Sales].', `${pre(`YoY % =
VAR LY = CALCULATE ( [Total Sales], SAMEPERIODLASTYEAR ( 'Calendar'[Date] ) )
RETURN DIVIDE ( [Total Sales] - LY, LY )`)}<p>VAR stores last year's value once. DIVIDE avoids a divide-by-zero error.</p>`],
        ['Write a measure for sales of the previous month, and then MoM %.', `${pre(`Sales PM = CALCULATE ( [Total Sales], DATEADD ( 'Calendar'[Date], -1, MONTH ) )
MoM % = DIVIDE ( [Total Sales] - [Sales PM], [Sales PM] )`)}<p>DATEADD with -1 and MONTH shifts every date in the current filter back by one month.</p>`],
        ['Your YoY % shows blank for every row in the matrix. List three reasons.', `<p>(1) The matrix uses the fact table date, not Calendar[Date] or Calendar[Year]. (2) There is no relationship from Calendar to the fact table, or it points the wrong way. (3) The Calendar is not marked as a date table or has gaps/duplicate dates. Also check that last-year data really exists.</p>`],
        ['Write a rolling 3-month sales measure.', `${pre(`Sales Rolling 3M =
CALCULATE (
    [Total Sales],
    DATESINPERIOD ( 'Calendar'[Date], MAX ( 'Calendar'[Date] ), -3, MONTH )
)`)}<p>DATESINPERIOD returns the 3 months ending on the last visible date. In a monthly visual this sums the current and the two previous months.</p>`]
      ],
      important: [
        ['What is time intelligence in DAX and what do you need for it?', `<p>Time intelligence means calculations over time periods: YTD, same period last year, previous month, rolling windows. You need a separate Calendar table with continuous daily dates, marked as the date table, and related to the fact table. Then functions like TOTALYTD, SAMEPERIODLASTYEAR and DATEADD work correctly.</p>`],
        ['How do you calculate YoY growth in Power BI?', `<p>First a Sales LY measure with CALCULATE and SAMEPERIODLASTYEAR on the Calendar date. Then YoY % = DIVIDE(current minus last year, last year). I use DIVIDE so there is no error when last year is zero or blank, and I put Calendar columns on the visual axis.</p>`],
        ['Difference between SAMEPERIODLASTYEAR and DATEADD?', `<p>SAMEPERIODLASTYEAR is a shortcut for shifting the dates back exactly one year. DATEADD is more flexible: you choose the number and the interval (day, month, quarter, year), for example -1 MONTH for MoM. Both return a table of dates and are used inside CALCULATE.</p>`]
      ],
      resources: [['DAX Guide (look up any function)', 'https://dax.guide'], ['SQLBI (DAX articles)', 'https://www.sqlbi.com'], ['Microsoft Learn: Power BI', 'https://learn.microsoft.com/en-us/training/powerplatform/power-bi']],
      done: 'You are done when you can create a Calendar table, mark it, and write YTD, last-year, YoY % and MoM % measures from memory.'
    },
    /* ---------------- TUE ---------------- */
    {
      title: 'Drill-through, tooltips, conditional formatting',
      time: '1.5 h',
      study: [
        'Drill-down moves inside the same visual (Year > Quarter > Month). Drill-through jumps to a different page that shows detail for the one item you right-clicked.',
        'To make a drill-through page: add a new page, drag a field (for example Product Category) into the "Drill through" well in the Visualizations pane. Power BI adds a Back button automatically.',
        'A report-page tooltip is a small page that appears when you hover over a visual. Make a page, set Page information > Allow use as tooltip = On, and set the canvas size to Tooltip.',
        'Conditional formatting changes color by value. Three styles: Gradient (scale), Rules (if value below 0 then red), Field value (a measure returns a color code).',
        'Use color with meaning: red for bad, green for good, grey for neutral. Never use red/green alone because some people are colour-blind. Add an arrow or sign as well.',
        'Optional: Bookmarks save a state of the page (filters, visible visuals). With buttons and the Selection pane you can build a "toggle between chart and table" button.',
        'Optional: a What-if parameter (Modeling > New parameter) creates a slider table plus a measure. It lets users test "what if discount is 10%".'
      ],
      how: [
        'Open your Superstore report. Add a new page named "Product Detail". Drag Category (and Sub-Category if you like) into the Drill through well. [10 min]',
        'On Product Detail add: card Total Sales, card Profit, bar chart Sales by Sub-Category, line chart Sales by Month. Go back to the Overview page, right-click a bar > Drill through > Product Detail. Test it. [20 min]',
        'Create another page "Tip". In the formatting pane turn on Allow use as tooltip. Add one card (Total Sales) and one small line chart. Set Canvas settings Type = Tooltip. [15 min]',
        'On the Overview bar chart: Format > General > Tooltips > Type = Report page > Page = Tip. Hover to test. [10 min]',
        'Matrix or table: Format > Cell elements > Background color > turn on > fx. Try Gradient on Profit, then Rules (Profit less than 0 = red). [15 min]',
        'Create the color measure from the example and use "Format by: Field value" on a KPI card font color. [10 min]',
        'Optional (10 min): add a bookmark pair for "Chart view" and "Table view", or create a What-if parameter named Discount (0 to 0.3, step 0.05).'
      ],
      example: `<p><b>Color measure (Field value formatting).</b> Assume you built [YoY %] yesterday.</p>
${pre(`YoY Color =
IF (
    ISBLANK ( [YoY %] ), "#7F7F7F",     -- grey if no data
    IF ( [YoY %] < 0, "#C0392B", "#2E8B57" )   -- red if negative, green otherwise
)`)}
<p>Select the card visual > Format > Callout value > Color > fx > Format style = Field value > Based on field = YoY Color. The card now turns red when growth is negative.</p>
<p><b>Rules-based formatting on a table (no DAX needed):</b></p>
${pre(`Table:   Region   Profit
         East     1,200      -> normal
         West      -300      -> red background (rule: Profit < 0)`)}
<p>Steps: Format > Cell elements > Background color > fx > Format style = Rules > "If value is less than 0 then red". Add a second rule "if value is greater than or equal to 0 then green".</p>
<p><b>What-if parameter (optional).</b> Modeling > New parameter > Numeric range, min 0, max 0.3, step 0.05, "Add slicer" ticked. Power BI creates this:</p>
${pre(`Discount = GENERATESERIES ( 0, 0.3, 0.05 )
Discount Value = SELECTEDVALUE ( 'Discount'[Discount], 0 )`)}
<p>Then write your own measure that uses the slider:</p>
${pre(`Sales After Discount = [Total Sales] * ( 1 - [Discount Value] )`)}
<p>If the slider is at 0.10 and Total Sales is 1,000,000, the card shows 900,000.</p>
<p><b>How drill-through works in simple words:</b> when you right-click a bar for "Furniture", Power BI sends the filter Category = Furniture to the Product Detail page. Every visual on that page now shows only Furniture. That is why one detail page can serve all categories.</p>`,
      practice: [
        ['What is the difference between drill-down and drill-through?', `<p>Drill-down changes the level of detail inside the same visual (for example Year to Month). Drill-through opens another page that is filtered to the item you picked (for example the detail page for Furniture).</p>`],
        ['Name the setting that makes a page usable as a tooltip.', `<p>On the page: Format > Page information > Allow use as tooltip = On. Also set Canvas settings Type to Tooltip so the page has the small size. Then in the visual: Format > General > Tooltips > Type = Report page and choose the page.</p>`],
        ['Write a measure that returns the text "Up" or "Down" for YoY % and show how to use it for color.', `${pre(`YoY Label = IF ( [YoY %] >= 0, "Up", "Down" )
YoY Color = IF ( [YoY %] >= 0, "#2E8B57", "#C0392B" )`)}<p>Use YoY Color in Format by Field value. A hex colour string is valid output for conditional formatting.</p>`],
        ['Why is red/green-only formatting a bad idea? What do you add?', `<p>About 1 in 12 men have red-green colour blindness. Add an arrow, a plus/minus sign, or an icon so the meaning does not depend on colour only.</p>`],
        ['Create a What-if parameter so the user can test a price increase from 0% to 20%. Write the measure for new sales.', `${pre(`Price Increase = GENERATESERIES ( 0, 0.2, 0.01 )
Price Increase Value = SELECTEDVALUE ( 'Price Increase'[Price Increase], 0 )
Sales With Increase = [Total Sales] * ( 1 + [Price Increase Value] )`)}<p>This simple version assumes volume does not change. Say that assumption aloud in an interview.</p>`]
      ],
      important: [
        ['What is drill-through and when do you use it?', `<p>Drill-through lets the user right-click a data point and jump to a detail page filtered to that item. I use it to keep the main page clean (summary only) and put detail on a second page, for example a product or customer detail page.</p>`],
        ['How do you highlight bad values in a Power BI table?', `<p>Conditional formatting: Format > Cell elements > Background or Font colour > fx. I use Rules for clear thresholds (below 0 is red) or a measure that returns a colour code for logic that needs DAX. I also add icons so it works for colour-blind users.</p>`],
        ['What is a bookmark used for?', `<p>A bookmark saves the current state of a page: filters, slicers, visible visuals. With buttons it gives navigation or toggles, for example switching between a chart and a table, or a "reset filters" button.</p>`]
      ],
      resources: [['Guy in a Cube (YouTube)', 'https://www.youtube.com/@GuyInACube'], ['Microsoft Learn: Power BI', 'https://learn.microsoft.com/en-us/training/powerplatform/power-bi']],
      done: 'You are done when your Superstore report has one working drill-through page, one tooltip page, and at least one conditional format.'
    },
    /* ---------------- WED ---------------- */
    {
      title: 'Dashboard design and storytelling',
      time: '1.5 h',
      study: [
        'A dashboard answers a few questions fast. Ask first: who uses it and what decision will they take? Then decide the visuals.',
        'Layout rule: top = KPI row (3-5 cards), middle = trend and main comparison, bottom or right = detail. People read left to right, top to bottom.',
        'Use fewer visuals: 6 to 8 per page. If a visual does not support a question, remove it.',
        'Choose the visual by the question. Trend over time = line. Compare categories = bar (sorted). Part of whole with 2-4 parts = stacked bar or donut. Exact numbers = table. Avoid pie charts with many slices, 3D, and dual axes.',
        'Colors: one main brand colour, one highlight colour, greys for the rest. Use the same colour for the same meaning on every page. Keep contrast high for text.',
        'Storytelling: give each page a headline that states the finding ("Economy customers are 40 points less satisfied") instead of a label ("Satisfaction by class").',
        'Consistency: same fonts, same alignment (use Align and Distribute in the Format menu), same slicer position on every page, and a clear navigation (page tabs or buttons).'
      ],
      how: [
        'Open Superstore. Sketch on paper a 3-section layout for the Overview page: KPI row, trend, comparison. [10 min]',
        'Set the page size and background: View > Page view > Fit to page. Format page > Canvas background light grey, and give visuals white backgrounds with a thin border. [10 min]',
        'Rebuild the top row with 4 cards: Total Sales, Profit, Profit Margin %, YoY %. Align them with Format > Align and Distribute horizontally. [15 min]',
        'Add a line chart (Sales and Sales LY by Month) and a sorted bar chart (Sales by Category). Remove gridlines, chart borders and unnecessary axis titles. [20 min]',
        'Replace page title with a message title using a text box: "Sales grew 12% YoY, but profit margin fell in Furniture". Use your real numbers. [10 min]',
        'Apply a consistent colour theme: View > Themes > pick one. Set a highlight colour for Sales LY (grey) vs Sales (blue). [10 min]',
        'The 5-second test: show the page to a friend (or look away and back). Can they say the main message in 5 seconds? Fix what is confusing. [15 min]'
      ],
      example: `<p><b>Wireframe for a one-page dashboard</b> (draw this before touching Power BI):</p>
${pre(`+------------------------------------------------------------+
| Headline: Sales up 12% YoY, margin down in Furniture        |
+----------+----------+----------+----------+----------------+
| Sales    | Profit   | Margin % | YoY %    | Slicers:       |
| 2.3M     | 280K     | 12.2%    | +12%     | Year, Region   |
+----------+----------+----------+----------+----------------+
| Line: Sales vs Last Year by month   | Bar: Sales by        |
| (trend, 60% width)                  | Category (sorted)    |
+-------------------------------------+----------------------+
| Table or matrix: top 10 products (drill-through enabled)   |
+------------------------------------------------------------+`)}
<p><b>KPI card with a sign, using a text measure:</b></p>
${pre(`YoY Text =
VAR v = [YoY %]
RETURN IF ( ISBLANK ( v ), "n/a", FORMAT ( v, "+0.0%;-0.0%" ) )`)}
<p>If YoY % is 0.123 the card shows +12.3%. If it is -0.05 it shows -5.0%. The sign tells the meaning without colour.</p>
<p><b>Bad vs good (talk about this in interviews):</b></p>
${pre(`BAD : 14 visuals, rainbow colours, pie with 12 slices, no title message.
GOOD: 6 visuals, 2 colours, sorted bars, headline sentence, KPI row first.`)}
<p>The bad page makes the reader work. The good page gives the answer, and the details are one click away (drill-through or tooltip).</p>`,
      practice: [
        ['Which chart type would you choose: (a) sales trend over 24 months, (b) sales by 8 product categories, (c) share of 3 customer segments?', `<p>(a) Line chart. (b) Horizontal or vertical bar chart sorted high to low. (c) Stacked 100% bar or a donut (only 3 parts, so a donut is readable). Reason: match the chart to the question, and keep comparisons easy to read.</p>`],
        ['A manager says the dashboard is "too busy". Name 4 fixes.', `<p>Remove visuals that do not answer a question; limit to one accent colour; delete gridlines, borders and repeated axis titles; move detail to a drill-through or tooltip page; sort and align everything.</p>`],
        ['Why put KPIs at the top left?', `<p>People scan left to right, top to bottom. The most important numbers should be seen first, so the reader gets the answer before looking at the details.</p>`],
        ['Write a title measure that changes with the slicer, e.g. "Sales in 2024: 2.3M".', `${pre(`Page Title =
"Sales in " & SELECTEDVALUE ( 'Calendar'[Year], "all years" ) & ": "
    & FORMAT ( [Total Sales] / 1000000, "0.0" ) & "M"`)}<p>SELECTEDVALUE returns the year if only one year is selected, otherwise the text "all years". Use it in a card or in Format > Title > fx.</p>`],
        ['Your KPI card shows 0.123456 instead of 12.3%. Two ways to fix?', `<p>Select the measure and set Format = Percentage with 1 decimal in Measure tools. Or wrap with FORMAT in a text measure: FORMAT([YoY %], "0.0%"). The first one is better because the value stays numeric.</p>`]
      ],
      important: [
        ['How do you decide which visual to use?', `<p>I start from the question. Trend = line chart. Comparison across categories = sorted bar. Composition with few parts = stacked bar or donut. Relationship between two numbers = scatter. Exact values = table. I avoid 3D, many-slice pies and decorative visuals.</p>`],
        ['What makes a good dashboard?', `<p>It has a clear audience and decision, a KPI row at the top, few visuals with a consistent colour scheme, a headline that states the insight, interactivity (slicers, drill-through) that does not hide the main message, and fast performance. I test it with the 5-second rule.</p>`],
        ['How would you present a dashboard to a non-technical manager?', `<p>Start with the business question, then give the headline result, then show one or two supporting visuals, then the recommendation. I avoid technical terms and tell the story of what happened, why, and what to do next.</p>`]
      ],
      resources: [['Microsoft Learn: Power BI', 'https://learn.microsoft.com/en-us/training/powerplatform/power-bi'], ['Guy in a Cube (YouTube)', 'https://www.youtube.com/@GuyInACube']],
      done: 'You are done when your Superstore Overview page passes the 5-second test and has a KPI row, a message title, and no more than 8 visuals.'
    },
    /* ---------------- THU ---------------- */
    {
      title: 'Project 1: dataset, 5 questions, load and clean',
      time: '1.5 h',
      study: [
        'A project starts with questions, not charts. Write 5 business questions first; everything you build must help answer them.',
        'Dataset options from the plan: Airline Passenger Satisfaction (Kaggle) or Stack Overflow Developer Survey. Choose the airline one if you want a ready CSAT dashboard; use your own anonymised data only if it is safe and allowed.',
        'Likert scale: answers like Strongly disagree ... Strongly agree. Recode them to numbers 1-5 so you can average them. Reverse-coded items (negative wording) must be flipped: new = 6 - old on a 1-5 scale.',
        'CSAT = % of customers who gave a satisfied rating (usually top 2 of 5). NPS comes from a 0-10 "likelihood to recommend" question. Check which questions your dataset has.',
        'Important about the Airline file: it has 0-5 service ratings and a satisfaction label, but no 0-10 recommend question. So true NPS is not possible there. Either use another survey with 0-10, or state clearly "NPS-style proxy". Never invent a metric silently.',
        'Survey data-quality checks: duplicates, missing values, speeders (very short completion time), straight-liners (same answer on every rating), impossible values (age 230), and the "0 = not applicable" code that must not count as a low score.',
        'Document every cleaning decision (what, how many rows, why). This table becomes part of your README and shows analyst discipline.'
      ],
      how: [
        'Download the Airline Passenger Satisfaction dataset from the Kaggle link below (needs a free Kaggle login). Open the CSV in Excel and read all column names. In the version I know, the ratings run 0-5 and there is a satisfaction column; confirm with df.columns. [10 min]',
        'Write 5 business questions in a text file (examples in the example block). Each must be answerable with numbers and lead to an action. [15 min]',
        'Load into Python: pd.read_csv(path). Or load into Power BI and clean with Power Query: Remove duplicates, Replace errors, Change type. Pick one tool and stay with it. [10 min]',
        'Run the data-quality checks: shape, info, isna().sum(), duplicated().sum(), value_counts() on each categorical column, describe() for age and delay. [20 min]',
        'Fix issues using the pattern in the example: strip text, drop duplicates, recode, flag speeders and straight-liners (flag, do not delete blindly). [25 min]',
        'Write a small "Cleaning log" table: issue, rows affected, action taken. Save the cleaned file as survey_clean.csv. [10 min]'
      ],
      example: `<p><b>Five good business questions</b> (for the airline data, adjust for your dataset):</p>
${pre(`1. Which passenger segments (class, travel type, age band) are least satisfied?
2. Which service ratings (wifi, seat comfort, boarding...) differ most between
   satisfied and unsatisfied passengers?
3. Do delays reduce satisfaction, and from how many minutes?
4. Are differences between segments statistically significant or just noise?
5. What are the top 3 fixes that would raise satisfaction most?`)}
<p><b>Cleaning on a small inline sample.</b> The same steps apply to the Kaggle file. Copy and run:</p>
${pre(`import pandas as pd
import numpy as np

raw = pd.DataFrame({
    'resp_id':      [1, 2, 3, 3, 4, 5, 6, 7, 8, 9],
    'segment':      ['Business', 'Economy', 'Economy', 'Economy', 'Business',
                     'Economy', ' business', 'Economy', 'Business', 'Economy'],
    'recommend':    [10, 9, 6, 6, 8, 3, 9, np.nan, 10, 5],
    'food': ['Agree', 'Strongly agree', 'Disagree', 'Disagree', 'Neutral',
             'Strongly disagree', 'Strongly agree', 'Agree', 'Agree', 'Neutral'],
    'seat': ['Agree', 'Agree', 'Disagree', 'Disagree', 'Agree',
             'Disagree', 'Strongly agree', 'Agree', 'Strongly agree', 'Disagree'],
    'duration_sec': [420, 380, 35, 35, 300, 410, 25, 360, 390, 330],
})
print(raw.shape)                                  # (10, 6)
print(raw.duplicated(subset='resp_id').sum())     # 1  (resp 3 twice)

df = raw.drop_duplicates(subset='resp_id').copy()
df['segment'] = df['segment'].str.strip().str.title()
print(df['segment'].value_counts())               # Economy 5, Business 4

likert = {'Strongly disagree': 1, 'Disagree': 2, 'Neutral': 3,
          'Agree': 4, 'Strongly agree': 5}
for c in ['food', 'seat']:
    df[c + '_score'] = df[c].map(likert)

med = df['duration_sec'].median()                 # 360.0
df['speeder'] = df['duration_sec'] < 0.3 * med    # faster than 30% of median
print(df[['resp_id', 'duration_sec', 'speeder']])
# speeders: resp 3 (35 sec) and resp 6 (25 sec)

df['straight'] = df[['food_score', 'seat_score']].nunique(axis=1) == 1
clean = df[~df['speeder'] & df['recommend'].notna()]
print(clean.shape)                                # (6, 10)`)}
<p><b>Line by line.</b> <code>duplicated(subset='resp_id')</code> finds repeated IDs. <code>str.strip().str.title()</code> turns " business" into "Business" so groups are not split. <code>map(likert)</code> converts words to 1-5. A speeder is anyone who took under 30% of the median time (here 0.3 x 360 = 108 seconds). <code>nunique(axis=1) == 1</code> means all answers in the row are the same: a straight-liner. With only 2 rating columns this test is not meaningful; on the real file use all 14 service ratings. Finally we drop speeders and rows with a missing recommend score, leaving 6 clean rows. In a real project you would keep the flagged rows in a separate file and report how many you removed.</p>
<p><b>Power Query route:</b> Home > Transform data > select ID column > Remove duplicates; Transform > Format > Trim and Capitalize Each Word; Add column > Conditional column for the Likert recode; Replace Values for 0 = "not applicable" with null.</p>`,
      practice: [
        ['Using raw from the example, how many duplicate respondent IDs are there and which row would drop_duplicates keep?', `${pre(`raw.duplicated(subset='resp_id').sum()   # 1
raw.drop_duplicates(subset='resp_id')      # keeps the first resp_id 3 row`)}<p>By default keep='first'. Use keep='last' if the later submission is the valid one.</p>`],
        ['Clean the segment column so " business", "Business " and "BUSINESS" become one group.', `${pre(`df['segment'] = df['segment'].str.strip().str.title()`)}<p>strip removes spaces at the ends, title makes the first letter capital and the rest lower case.</p>`],
        ['Recode a negatively worded question q_hard (1-5) so that a high score is always good.', `${pre(`df['q_hard_rev'] = 6 - df['q_hard']`)}<p>On a 1-5 scale, reversing means new = (max + min) - old = 6 - old. So 1 becomes 5 and 5 becomes 1.</p>`],
        ['Flag respondents who finished in less than one third of the median time.', `${pre(`med = df['duration_sec'].median()
df['speeder'] = df['duration_sec'] < med / 3`)}<p>A boolean column keeps the information, so you can decide later whether to drop or only report them.</p>`],
        ['The ratings 0-5 use 0 for "not applicable". How do you stop 0 lowering your averages?', `${pre(`rating_cols = ['wifi', 'seat']          # your real rating columns
df[rating_cols] = df[rating_cols].replace(0, np.nan)`)}<p>NaN is ignored by mean(), so the average is calculated only from people who rated the service.</p>`],
        ['Write 2 weak and 2 strong business questions for a CSAT project and say why.', `<p>Weak: "Show satisfaction" (no decision), "Make a dashboard" (a tool, not a question). Strong: "Which class has the lowest top-2-box for seat comfort, and by how many points?" and "Does a delay over 30 minutes drop satisfaction?" Strong questions have a metric, a comparison and an action.</p>`]
      ],
      important: [
        ['How do you check the quality of survey data before analysing it?', `<p>I check duplicates, missing values, out-of-range answers, speeders (completion time far below the median), straight-liners (same answer on a whole grid), and logic violations such as an answer given to a question that should have been skipped. I flag them, count them, report the impact, and then decide whether to remove them.</p>`],
        ['What is a Likert scale and how do you analyse it?', `<p>A Likert scale is an ordered agreement scale like Strongly disagree to Strongly agree. I recode it to 1-5 and report the top-2-box percentage, the mean, and the distribution. I remember that the data is ordinal, so I show the distribution and not only the mean.</p>`],
        ['What do you do with missing values in survey data?', `<p>First understand why: skipped question, not applicable, or drop-off. If a small share is missing at random, I exclude those rows from that metric only. I do not fill ratings with the mean, because it hides real opinion. I always report the base size (n) per metric.</p>`]
      ],
      resources: [['Airline Passenger Satisfaction (Kaggle)', 'https://www.kaggle.com/datasets/teejmahal20/airline-passenger-satisfaction'], ['Stack Overflow Developer Survey', 'https://survey.stackoverflow.co/'], ['pandas: 10 minutes', 'https://pandas.pydata.org/docs/user_guide/10min.html']],
      done: 'You are done when you have 5 written business questions, a cleaned file survey_clean.csv, and a cleaning log with row counts.'
    },
    /* ---------------- FRI ---------------- */
    {
      title: 'Project 1: CSAT, NPS, top-2-box, crosstabs, drivers',
      time: '1.5 h',
      study: [
        'CSAT = number of satisfied responses (4 or 5 on a 5-point scale) divided by all valid responses. Say the scale and the base every time.',
        'Top-2-box = % of respondents choosing the top two answers (4 or 5 on a 5-point scale; 9 or 10 on a 10-point scale if you define it so). It is simple and robust.',
        'NPS = %Promoters (9-10) minus %Detractors (0-6), range -100 to +100. Passives (7-8) count in the base but not in the formula. Report it as a number, not a percent sign.',
        'A crosstab (cross-tabulation) is a table of one question by one segment. In pandas use pd.crosstab or groupby. Show column percentages and the base size n.',
        'Is a difference real? Use the chi-square test of independence for categorical counts. Small p-value (below 0.05) means the difference is unlikely to be chance. With small samples, differences can be noise even if they look big.',
        'Drivers: which ratings move overall satisfaction most? Simple approach: correlation of each rating with the overall score, or the gap in top-2-box between satisfied and unsatisfied groups. Say "associated with", not "causes".',
        'Importance vs performance: a driver with high importance and low top-2-box is your top fix. That is a recommendation framework managers understand.'
      ],
      how: [
        'Open your cleaned file in a notebook (or Power Query). Compute overall CSAT (top-2-box of overall satisfaction) and NPS or a clearly named proxy. [15 min]',
        'Compute the same metrics by segment: class, customer type, travel type, age band. Use groupby. [15 min]',
        'Make 2 crosstabs with column percentages: satisfaction by class and by travel type. Add the n. [15 min]',
        'Run chi2_contingency on those crosstabs and note p-values. [10 min]',
        'Find drivers: correlation of every service rating with a 0/1 satisfied flag, sorted. Also compute top-2-box per rating for satisfied vs unsatisfied. [20 min]',
        'Export 3 small result tables to CSV (segment_metrics.csv, drivers.csv, crosstab.csv) for Power BI tomorrow. [10 min]',
        'Write 3 plain-sentence findings with numbers in a text file. [5 min]'
      ],
      example: `<p>Continuing with the cleaned inline sample (6 rows) from Day 4. On the real file the same code works with your column names. Copy and run (it includes the cleaning code again so it runs by itself):</p>
${pre(`import pandas as pd, numpy as np
from scipy.stats import chi2_contingency

clean = pd.DataFrame({
    'resp_id':   [1, 2, 4, 5, 8, 9],
    'segment':   ['Business','Economy','Business','Economy','Business','Economy'],
    'recommend': [10, 9, 8, 3, 10, 5],
    'food_score':[4, 5, 3, 1, 4, 3],
    'seat_score':[4, 4, 4, 2, 5, 2],
})

def nps(s):
    s = s.dropna()
    return 100 * ((s >= 9).mean() - (s <= 6).mean())

print(nps(clean['recommend']))                    # 16.67
print(clean.groupby('segment')['recommend'].apply(nps))
# Business  66.67
# Economy  -33.33

clean['seat_t2b'] = clean['seat_score'] >= 4      # top-2-box flag
print(clean.groupby('segment')['seat_t2b'].mean() * 100)
# Business 100.0, Economy 33.3

clean['nps_cat'] = pd.cut(clean['recommend'], bins=[-1, 6, 8, 10],
                          labels=['Detractor', 'Passive', 'Promoter'])
print(pd.crosstab(clean['segment'], clean['nps_cat']))
# nps_cat   Detractor Passive Promoter
# Business          0       1        2
# Economy           2       0        1

print(clean[['recommend', 'food_score', 'seat_score']].corr().round(2)['recommend'])
# food_score 0.86, seat_score 0.94  -> seat is the stronger driver here

# Chi-square on a bigger table of counts (satisfied vs not, by class)
t = pd.DataFrame({'Satisfied': [80, 60], 'Not satisfied': [20, 40]},
                 index=['Business', 'Economy'])
chi2, p, dof, expected = chi2_contingency(t)
print(round(chi2, 2), round(p, 4), dof)          # 8.6 0.0034 1`)}
<p><b>Explain it.</b> In the 6-row sample: Promoters (9-10) = 3 of 6 = 50%. Detractors (0-6) = 2 of 6 = 33.3%. NPS = 50 - 33.3 = 16.7. By segment: Business has 2 promoters and 1 passive out of 3, so NPS = +66.7. Economy has 1 promoter and 2 detractors out of 3, so NPS = -33.3. In the chi-square table, 80% of Business are satisfied vs 60% of Economy. The p-value 0.0034 is below 0.05, so the difference is statistically significant. Note that 80% vs 60% satisfied with only 10 people in each class (8 of 10 vs 6 of 10) gives p = 0.63: sample size matters. (scipy applies Yates continuity correction to 2x2 tables by default; without it the first table gives chi-square 9.52, p = 0.0020, the same conclusion.) Also note: with only 3 people per segment, the 6-row sample is for learning the code, not for conclusions. On the real file you will have thousands of rows.</p>
<p><b>The same NPS in DAX</b> (for Day 6), with a calculated column for the group:</p>
${pre(`NPS Group =
SWITCH (
    TRUE (),
    ISBLANK ( Survey[Recommend] ), BLANK (),
    Survey[Recommend] >= 9, "Promoter",
    Survey[Recommend] >= 7, "Passive",
    "Detractor"
)

Promoters  = CALCULATE ( COUNTROWS ( Survey ), Survey[NPS Group] = "Promoter" )
Detractors = CALCULATE ( COUNTROWS ( Survey ), Survey[NPS Group] = "Detractor" )
Responses  = COUNT ( Survey[Recommend] )
NPS        = DIVIDE ( [Promoters] - [Detractors], [Responses] ) * 100`)}
<p>Using a group column avoids the DAX trap where a blank value is treated like 0 in a comparison such as Recommend &lt;= 6. COUNT counts only the non-blank numbers.</p>
<p><b>Airline dataset note:</b> it has no 0-10 recommend question. Use CSAT = % "satisfied" (from the satisfaction column) and top-2-box (4 or 5) on each service rating. If you want an NPS-style number, build it from a clearly labelled proxy and say so in the README.</p>`,
      practice: [
        ['Write a function nps(series) that returns NPS from a 0-10 series. Test it on [10, 9, 8, 6, 3].', `${pre(`def nps(s):
    s = s.dropna()
    return 100 * ((s >= 9).mean() - (s <= 6).mean())

print(nps(pd.Series([10, 9, 8, 6, 3])))   # 0.0`)}<p>Promoters = 2 of 5 = 40%, detractors = 2 of 5 = 40% (6 and 3), so NPS = 0.</p>`],
        ['Compute top-2-box % for column rating (1-5) by segment.', `${pre(`df['t2b'] = df['rating'] >= 4
df.groupby('segment')['t2b'].mean() * 100`)}<p>The mean of a True/False column is the share of True values.</p>`],
        ['Make a crosstab of segment vs NPS category with row percentages.', `${pre(`pd.crosstab(clean['segment'], clean['nps_cat'], normalize='index').round(2)`)}<p>normalize='index' makes each row sum to 1. Use normalize='columns' for column percentages.</p>`],
        ['Two segments: 8 of 10 satisfied vs 6 of 10 satisfied. Is the difference significant?', `${pre(`t = pd.DataFrame({'S': [8, 6], 'N': [2, 4]}, index=['A', 'B'])
print(round(chi2_contingency(t)[1], 3))   # 0.626`)}<p>p = 0.63 (default Yates correction; 0.33 without it), far above 0.05, so with n = 10 each we cannot say there is a real difference. This is why you always show n.</p>`],
        ['Rank service ratings by their association with overall satisfaction.', `${pre(`rating_cols = ['food_score', 'seat_score']
drivers = clean[rating_cols + ['recommend']].corr()['recommend'].drop('recommend')
print(drivers.sort_values(ascending=False))`)}<p>corr()['recommend'] gives each rating's correlation with the outcome. The biggest values are candidate drivers. Remember: correlation is not proof of cause.</p>`],
        ['Write the DAX measure for top-2-box % of Survey[Seat Score] (1-5).', `${pre(`Seat Top2Box % =
DIVIDE (
    CALCULATE ( COUNTROWS ( Survey ), Survey[Seat Score] >= 4 ),
    COUNT ( Survey[Seat Score] )
)`)}<p>Numerator counts rows scoring 4 or 5. The denominator counts valid (non-blank) answers only.</p>`]
      ],
      important: [
        ['How is NPS calculated and what are its limits?', `<p>Ask "How likely are you to recommend us, 0 to 10". Promoters are 9-10, passives 7-8, detractors 0-6. NPS = %Promoters minus %Detractors, from -100 to +100. Limits: it hides the passives, it is sensitive to small samples, it needs margin of error, and a single number does not say why people feel that way, so I pair it with drivers or comments.</p>`],
        ['What is top-2-box and why use it?', `<p>It is the percentage of respondents who pick the two best answers on the scale, such as 4 or 5 out of 5. It is easy to explain, less affected by outliers than a mean, and works for ordinal data. I always report it with the base size.</p>`],
        ['How would you find the drivers of satisfaction?', `<p>I look at the correlation of each rating with overall satisfaction, and at the gap in top-2-box between satisfied and unsatisfied customers. Then I plot importance against performance: high importance and low score are the first fixes. For deeper work, regression, but I would say these are associations and not proven causes.</p>`],
        ['How do you know if a difference between two segments is significant?', `<p>For counts such as satisfied vs not, I use a chi-square test; for means, a t-test. If the p-value is below 0.05, the difference is unlikely to be chance. I also look at the effect size and sample size, because a tiny difference can be significant in a huge sample but not matter to the business.</p>`]
      ],
      resources: [['Airline Passenger Satisfaction (Kaggle)', 'https://www.kaggle.com/datasets/teejmahal20/airline-passenger-satisfaction'], ['pandas: 10 minutes', 'https://pandas.pydata.org/docs/user_guide/10min.html']],
      done: 'You are done when you have CSAT, top-2-box, a segment table, 2 crosstabs with a p-value, a ranked driver list, and 3 findings written with numbers.'
    },
    /* ---------------- SAT ---------------- */
    {
      title: 'Project 1: build the 3-page Power BI dashboard',
      time: '3.5 h',
      study: [
        'Three pages with three jobs. Overview = "How are we doing?" Segments = "Who is unhappy?" Drivers = "What should we fix?". Each page has one headline message.',
        'Import your cleaned data and your result tables (segment_metrics.csv, drivers.csv) into Power BI. Use the cleaned respondent-level table for slicers and measures; use the small tables only for charts that came from Python.',
        'Prefer DAX measures over pre-calculated columns for CSAT, top-2-box and NPS, so they respond to slicers.',
        'Every percentage should be shown with its base n. A card "Responses (n)" on each page is the minimum.',
        'Use a diverging scale for satisfaction heat maps (red = low, green = high) with the neutral colour at the overall average.',
        'Add data-quality information somewhere small (for example "x speeders removed") to show you checked.',
        'Use drill-through (Segment detail page) and tooltips from earlier this week. They are the proof that you can use features, not only draw bars.'
      ],
      how: [
        'Home > Get data > Text/CSV: load survey_clean.csv and drivers.csv. Check data types in Power Query. Rename the main table Survey. [15 min]',
        'Create measures: Responses, CSAT %, Top2Box % (one per key rating), NPS (if available) and a Satisfaction Gap measure vs overall. Put them in a Measures folder. [25 min]',
        'Page 1 Overview: KPI cards (Responses, CSAT %, NPS or proxy, Avg delay), a bar chart of top-2-box by service rating (sorted), a column chart of CSAT % by month if you have a date, and slicers for class/travel type. Add a message title. [40 min]',
        'Page 2 Segments: a matrix with segments in rows and service ratings in columns, values = Top2Box %, with Gradient conditional formatting. Add a bar chart of CSAT % by age band and a slicer panel. [40 min]',
        'Page 3 Drivers: bar chart from drivers.csv sorted by correlation, and a scatter or table of importance vs performance (correlation vs top-2-box). Add a text box with the 3 recommendations. [35 min]',
        'Add drill-through from the Segments matrix to a detail page (Segment detail) and a tooltip page for the bars. [20 min]',
        'Polish: align visuals, consistent colours, titles that state the insight, hide gridlines, add page navigation buttons. Run the 5-second test on each page. [20 min]',
        'Export screenshots (File > Export > PDF, and take 3 PNG screenshots). Save the .pbix. [10 min]'
      ],
      example: `<p><b>Page plan (wireframe)</b>:</p>
${pre(`PAGE 1  OVERVIEW        "Overall CSAT is 56%; wifi and online booking lag"
 [Responses n] [CSAT %] [NPS or proxy] [Avg delay]      [Slicers: Class, Type]
 [Bar: Top-2-box by service rating, sorted]   [Column: CSAT % by month]

PAGE 2  SEGMENTS        "Economy and loyal-customer gap is the biggest"
 [Matrix: Segment x Rating, Top2Box %, heat colours]
 [Bar: CSAT % by age band]            [Bar: CSAT % by travel type]

PAGE 3  DRIVERS         "Fix these 3 first"
 [Bar: correlation with satisfaction]  [Table: importance vs performance]
 [Text: 3 recommendations]`)}
<p><b>Key measures</b> (assume tables and columns named as in Day 4's cleaned file; adjust the names to yours):</p>
${pre(`Responses = COUNTROWS ( Survey )

CSAT % =
DIVIDE (
    CALCULATE ( COUNTROWS ( Survey ), Survey[Satisfaction Flag] = 1 ),
    COUNTROWS ( Survey )
)

Seat Top2Box % =
DIVIDE (
    CALCULATE ( COUNTROWS ( Survey ), Survey[Seat Score] >= 4 ),
    COUNT ( Survey[Seat Score] )
)

CSAT Overall % =
CALCULATE ( [CSAT %], ALL ( Survey ) )

CSAT Gap vs Overall = [CSAT %] - [CSAT Overall %]

Low Base Warning =
IF ( [Responses] < 30, "Low base: read with care", "" )`)}
<p><b>What the key measures do.</b> CSAT % divides the satisfied rows by all rows in the current filter. CSAT Overall % uses ALL to ignore the filters so every segment can be compared against the total. CSAT Gap is the difference in percentage points; a negative value is a red flag. Low Base Warning is a small text measure to put under a chart: a good survey habit that impresses interviewers. Satisfaction Flag is a 0/1 column you make in Python or Power Query from the satisfaction label (satisfied = 1).</p>
<p><b>Time box.</b> If a page takes longer than planned, ship a simpler version. A finished 3-page dashboard beats a perfect single page.</p>`,
      practice: [
        ['Write a measure for CSAT % that uses the column Survey[Satisfied] with values 1 and 0.', `${pre(`CSAT % = DIVIDE ( SUM ( Survey[Satisfied] ), COUNTROWS ( Survey ) )`)}<p>Summing a 0/1 column counts the satisfied people. Dividing by rows gives the percentage.</p>`],
        ['Write a measure that shows how many percentage points a segment is above or below the overall CSAT.', `${pre(`CSAT Overall % = CALCULATE ( [CSAT %], ALL ( Survey ) )
CSAT Gap = [CSAT %] - [CSAT Overall %]`)}<p>ALL removes the segment filters so the overall number stays fixed.</p>`],
        ['A heat-map matrix colours every cell red because the range is huge. What is wrong and how to fix it?', `<p>The gradient is using min/max across all cells, or a few extreme cells dominate. Fix: in Conditional formatting set Minimum, Centre and Maximum to fixed numbers (for example 0, 0.5, 1) and use a diverging scale with the middle colour near the average.</p>`],
        ['How can you let the user see the base size for each bar without cluttering the chart?', `<p>Add Responses to the tooltip (Visualizations > Tooltips well), or use a report-page tooltip. Also add the Low Base Warning measure as a subtitle.</p>`],
        ['Write a DAX measure for NPS by segment (the Segment slicer or axis does the split).', `${pre(`NPS = DIVIDE ( [Promoters] - [Detractors], [Responses] ) * 100`)}<p>Given the Promoters, Detractors and Responses measures from Day 5. Because they are measures, putting Segment on the axis calculates NPS for each segment automatically.</p>`]
      ],
      important: [
        ['Walk me through your dashboard (2 minutes).', `<p>I start with the business problem: find which passenger groups are unhappy and what to fix. Then page 1 shows overall CSAT and service ratings, page 2 shows which segments are below average, page 3 shows the drivers and my three recommendations. I mention the data cleaning (duplicates, speeders), the DAX measures I wrote (CSAT, top-2-box, gap vs overall), and end with the main insight and the action.</p>`],
        ['Why did you choose these visuals?', `<p>Sorted bars compare ratings easily; a matrix with heat colours shows segment-by-rating gaps in one view; a driver bar chart gives a ranked fix list. I avoided pie charts and decoration so the reader sees the message in 5 seconds.</p>`],
        ['How did you handle small sample sizes in segments?', `<p>I show n on every chart, add a low-base warning under 30 responses, avoid conclusions on tiny segments, and use significance testing before calling a difference real.</p>`]
      ],
      resources: [['Microsoft Learn: Power BI', 'https://learn.microsoft.com/en-us/training/powerplatform/power-bi'], ['DAX Guide', 'https://dax.guide']],
      done: 'You are done when you have a saved .pbix with 3 pages, working slicers, at least one drill-through or tooltip, and 3 exported screenshots.'
    },
    /* ---------------- SUN ---------------- */
    {
      title: 'Project 1: README, insights, GitHub + 5 SQL problems',
      time: '3.5 h',
      study: [
        'An insight is: finding + number + so-what. "Economy class top-2-box on wifi is 31%, 18 points below Business; wifi is the biggest driver, so fix wifi first on economy-heavy routes."',
        'A recommendation must be specific, owned and measurable: what to do, for whom, and the target. "Improve service" is not a recommendation.',
        'A good README has: title, business problem, dataset, tools, method (cleaning log), key insights with numbers, screenshots, 3 recommendations, how to reproduce, and limitations.',
        'GitHub basics: repository, commit, push. Put the notebook, cleaned data (or a link if large), the .pbix and the screenshots in the repo. Do not upload personal or confidential respondent data.',
        'A resume bullet: action verb + what + scale + result. Use the bullet idea from the plan and put your real numbers in.',
        'A 2-minute pitch: problem, data, what you did, top insight, recommendation, what you would do next.',
        'Keep the SQL habit: 5 problems today. Survey-themed ones follow, so your SQL and your project use the same language.'
      ],
      how: [
        'Open a notes file. Write the 3 insights (finding + number + so-what) and the 3 recommendations (action + who + target). Check each number against your dashboard. [30 min]',
        'Create the repo folder: README.md, notebook/, data/ (small sample or link), dashboard/ (.pbix and screenshots), results/ (csv). [10 min]',
        'Write the README with the template in the example. Add the 3 screenshots with Markdown image links. [45 min]',
        'Publish: create the repo on github.com, then in the folder run the git commands in the example. Open the page and check that images show. [20 min]',
        'Write the resume bullet and the 2-minute pitch. Rehearse the pitch twice aloud, record it on your phone once. [25 min]',
        'Solve the 5 SQL problems in the practice section on db-fiddle.com or your own database (create the survey table first). [60 min]',
        'Review: read the project aloud as if to an interviewer. List 3 questions they could ask and write short answers. [20 min]'
      ],
      example: `<p><b>README template</b> (copy into README.md and fill your numbers):</p>
${pre(`# Airline Passenger Satisfaction: CSAT Insights Dashboard

## Business problem
Which passenger groups are least satisfied, and which service areas should
the airline fix first?

## Data
Kaggle Airline Passenger Satisfaction (n = ____ after cleaning).

## Tools
Python (pandas, scipy), Power BI (DAX), GitHub.

## Method
1. Cleaning: removed ___ duplicates, ___ speeders flagged, recoded 0 = N/A to blank.
2. Metrics: CSAT %, top-2-box per rating, gap vs overall, chi-square for segments.
3. Dashboard: 3 pages (Overview, Segments, Drivers).

## Key insights
1. Economy CSAT is __% vs __% in Business (p < 0.05).
2. Wifi and online boarding have the largest gap between satisfied and not.
3. Delays over __ minutes cut satisfaction by __ points.

## Recommendations
1. Fix inflight wifi on economy-heavy routes; target +10 pts top-2-box in 6 months.
2. Redesign online boarding; target ...
3. Proactive delay messaging for delays above 30 minutes; target ...

## Screenshots
![Overview](dashboard/overview.png)

## Limitations
Correlation is not causation; one survey wave; no 0-10 recommend question, so no true NPS.`)}
<p><b>Git commands</b> (run in the project folder; after creating an empty repo on github.com):</p>
${pre(`git init
git add .
git commit -m "Project 1: survey CSAT dashboard"
git branch -M main
git remote add origin https://github.com/YOUR-NAME/survey-csat-dashboard.git
git push -u origin main`)}
<p>Replace YOUR-NAME with your GitHub user name. If push asks for a password, use a personal access token or sign in through the browser prompt.</p>
<p><b>Resume bullet (fill real numbers):</b></p>
${pre(`Analysed 100K+ airline survey responses in Python and Power BI; built a 3-page
dashboard (CSAT, top-2-box, drivers) and identified wifi and online boarding as the
top satisfaction drivers; recommended 3 fixes with target improvements.`)}
<p><b>SQL practice table</b> for the 5 problems below (Postgres syntax):</p>
${pre(`CREATE TABLE survey (
  resp_id INT, segment TEXT, recommend INT, csat INT, submitted_at DATE);
INSERT INTO survey VALUES
 (1,'Business',10,5,'2024-01-05'),(2,'Economy',9,4,'2024-01-18'),
 (3,'Economy',6,2,'2024-02-03'),(3,'Economy',6,2,'2024-02-04'),
 (4,'Business',8,4,'2024-02-20'),(5,'Economy',3,1,'2024-03-02'),
 (6,'Business',9,5,'2024-03-15');`)}`,
      practice: [
        ['SQL 1: How many responses per segment?', `${pre(`SELECT segment, COUNT(*) AS responses
FROM survey
GROUP BY segment;`)}<p>Result: Business 3, Economy 4. Note that resp_id 3 is counted twice, which leads to the next problem.</p>`],
        ['SQL 2: Find respondents who appear more than once.', `${pre(`SELECT resp_id, COUNT(*) AS times
FROM survey
GROUP BY resp_id
HAVING COUNT(*) > 1;`)}<p>HAVING filters groups after counting. Result: resp_id 3, times 2.</p>`],
        ['SQL 3: Keep only the latest response per respondent.', `${pre(`SELECT resp_id, segment, recommend, csat, submitted_at
FROM (
  SELECT *,
         ROW_NUMBER() OVER (PARTITION BY resp_id ORDER BY submitted_at DESC) AS rn
  FROM survey
) t
WHERE rn = 1;`)}<p>ROW_NUMBER numbers each respondent's rows from newest to oldest; rn = 1 is the newest. This returns 6 rows.</p>`],
        ['SQL 4: Calculate NPS per segment (on the de-duplicated data you can wrap problem 3 in a CTE).', `${pre(`SELECT segment,
       ROUND(100.0 * (SUM(CASE WHEN recommend >= 9 THEN 1 ELSE 0 END)
                    - SUM(CASE WHEN recommend <= 6 THEN 1 ELSE 0 END))
             / COUNT(recommend), 1) AS nps
FROM survey
GROUP BY segment;`)}<p>CASE WHEN turns promoters and detractors into 1/0, SUM counts them, COUNT(recommend) is the number of valid answers. The 100.0 forces decimal division, so the result is not rounded down to an integer. (This example includes the duplicate row; use the de-duplicated CTE for the true number.)</p>`],
        ['SQL 5: Monthly response count and change from the previous month.', `${pre(`WITH m AS (
  SELECT DATE_TRUNC('month', submitted_at) AS mth, COUNT(*) AS responses
  FROM survey
  GROUP BY 1
)
SELECT mth, responses,
       responses - LAG(responses) OVER (ORDER BY mth) AS change_vs_prev
FROM m
ORDER BY mth;`)}<p>The CTE counts per month. LAG reads the previous row's value in month order. The first month has NULL change. Result: Jan 2, Feb 3 (+1), Mar 2 (-1).</p>`],
        ['Write one insight and one recommendation in the correct format.', `<p>Insight: "Economy top-2-box on wifi is 31%, which is 18 points below Business, and wifi has the strongest link with overall satisfaction (r = 0.55)." Recommendation: "Upgrade wifi on the five busiest economy routes first; target 45% top-2-box within two quarters and track it monthly in this dashboard." Both use numbers, a so-what, and a target.</p>`]
      ],
      important: [
        ['Tell me about your survey project.', `<p>I analysed airline passenger survey data to find which groups are least satisfied and what drives it. I cleaned the data (duplicates, 0 = not applicable, speeders), computed CSAT and top-2-box by segment, tested differences with chi-square, and built a 3-page Power BI dashboard. The main finding was that wifi and online boarding are the biggest drivers and economy passengers are the least satisfied. I recommended three fixes with targets. I come from a survey-programming background, so I paid attention to data quality and base sizes.</p>`],
        ['What would you do differently or next?', `<p>I would add open-text comment analysis, track the metrics over time with several survey waves, apply weighting if the sample is not representative, and run a regression to separate the effect of each driver while controlling for the others.</p>`],
        ['What are the limitations of your analysis?', `<p>It is one survey, so I can show association and not cause. Self-reported satisfaction has response bias. The dataset has no 0-10 recommend question, so I could not compute true NPS. Small segments have wide margins of error. I state these limits in the README.</p>`]
      ],
      resources: [['GitHub', 'https://github.com'], ['DB Fiddle (run SQL online)', 'https://www.db-fiddle.com'], ['Airline Passenger Satisfaction (Kaggle)', 'https://www.kaggle.com/datasets/teejmahal20/airline-passenger-satisfaction']],
      done: 'You are done when your Project 1 repo is public with README, screenshots, 3 insights and 3 recommendations, you have rehearsed the 2-minute pitch, and you solved the 5 SQL problems.'
    }
  ]
};
