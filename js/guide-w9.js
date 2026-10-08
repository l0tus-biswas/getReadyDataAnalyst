/* Week 9 guide: Project 3 (Martech / Edtech) */
GUIDES[9] = {
  intro: `<p><b>Why this week matters.</b> Interviewers at the manager round almost always ask: "Walk me through a project." Two projects show you can do the work. A <b>third project in a different domain</b> (marketing or learning analytics) shows range. It also gives you the funnel, ROI and segment vocabulary that most business teams use every day.</p>
<p><b>By Day 7 you will be able to:</b> clean and explore a campaign or learner dataset in pandas, build a funnel and a channel ROI table, build a clean Power BI dashboard, write insights with a clear recommendation, publish a README on GitHub, speak a 2-minute walkthrough, and send your first 10 job applications and 5 referral messages.</p>
<p><b>Which dataset?</b> Choose <b>UCI Bank Marketing</b> (martech) if you want a clear conversion story (one flat file, easy). Choose <b>OULAD</b> (edtech) if you want drop-off and risk analysis (several linked tables, a bit harder). Do only one. Depth beats two half-finished projects.</p>
<p><b>Time plan (about 10.5 hours):</b> Day 1 1.5 h questions, Day 2 1.5 h clean + EDA, Day 3 1.5 h funnel/ROI/segments, Day 4 1.5 h Power BI, Day 5 1.5 h insights, Day 6 3.5 h README + publish + pitch, Day 7 3.5 h job applications. All code below uses a <b>small inline sample</b> you can paste and run. The same steps apply to the real file. Always check real column names first with <code>df.columns</code> and <code>df.info()</code>.</p>`,
  days: [
    /* ---------------- MON ---------------- */
    {
      title: 'Choose the dataset and define business questions',
      time: '1.5 h',
      study: [
        `A project starts with a business question, not with code. A good question is measurable ("Which contact channel has the highest subscription rate?") and leads to a decision ("Where should we spend the next call-centre hour?").`,
        `Martech means marketing technology and analytics: channels, campaigns, leads, conversions and cost. Edtech means education technology: learners, courses, engagement, completion and dropout.`,
        `UCI Bank Marketing: each row is one customer contacted in a bank phone campaign. The target column (usually called y) says whether the customer subscribed to a term deposit (yes/no). Widely known columns are age, job, marital, education, balance, contact, month, duration and campaign. Exact names differ slightly by file version, so check df.columns. The original files use a semicolon as separator.`,
        `OULAD (Open University Learning Analytics Dataset) is several linked CSV tables about students, courses, registrations, assessments and clicks on the learning site. You join them on student and course keys. Check the data page for exact table and column names before you plan.`,
        `Conversion rate = people who did the goal action divided by people who could have done it. Funnel step conversion = people at step N divided by people at step N-1. Drop-off = 1 minus step conversion.`,
        `Marketing money metrics: CTR = clicks / impressions. CPC = spend / clicks. CAC = spend / new customers. ROAS = revenue / spend. ROI = (revenue - cost) / cost.`,
        `A data dictionary is a small table: column name, meaning, data type, known problems. It saves you from guessing later and impresses reviewers.`,
        `Write your hypothesis before you look at results. It turns exploring into testing and makes your story sound professional.`
      ],
      how: [
        `[10 min] Open the UCI Bank Marketing page and the OULAD page (links below). Read the description only. Pick ONE using this rule: want a simple conversion story, pick Bank Marketing; want drop-off and risk, pick OULAD. Write your choice in a notes file.`,
        `[10 min] Create the folder structure on your laptop: project3/ with sub-folders data/, notebooks/, dashboard/, images/ and an empty README.md. Download the dataset into data/. Do not edit the raw file ever.`,
        `[15 min] Open Jupyter or VS Code. Load the file: for Bank Marketing use pd.read_csv('data/bank-full.csv', sep=';'). Run df.shape, df.head(), df.info(), df.columns. Check the separator is right: if you see one giant column, change sep.`,
        `[20 min] Write a data dictionary in a markdown cell: one line per column with meaning and any worry (for example "duration: call length in seconds, known only after the call").`,
        `[20 min] Write 5 business questions. For each one write: the metric, the columns needed, and the decision it supports. Use the table in the example.`,
        `[10 min] Write 3 hypotheses ("cellular contact converts better than telephone"). Mark what result would prove you wrong.`,
        `[5 min] Create an empty GitHub repository named for the project (for example bank-marketing-analysis). Commit your notes file so you have a first commit today.`
      ],
      example: `<p><b>Sample data</b> (10 rows, bank-style). Paste this to practise the first steps. Same steps apply to the real file; check its column names first with df.info().</p>
${pre(`import pandas as pd

df = pd.DataFrame({
 'customer_id': [1,2,3,4,5,6,7,8,9,10],
 'age':     [34,45,29,52,41,60,38,27,47,33],
 'job':     ['admin','technician','student','retired','admin',
             'retired','technician','student','admin','technician'],
 'contact': ['cellular','telephone','cellular','cellular','telephone',
             'cellular','cellular','telephone','cellular','cellular'],
 'y':       ['no','no','yes','yes','no','yes','no','no','yes','no']})

print(df.shape)                        # (10, 5)
print(df['y'].value_counts())
df['subscribed'] = (df['y'] == 'yes').astype(int)
print(df.groupby('contact')['subscribed'].agg(['count','sum','mean']))`)}
<p><b>Expected output</b></p>
${pre(`(10, 5)
y
no     6
yes    4

           count  sum      mean
contact
cellular       7    4  0.571429
telephone      3    0  0.000000`)}
<p><b>Line by line.</b> <code>value_counts()</code> counts each answer: 4 of 10 said yes, so the overall conversion rate is 40%. We turn yes/no into 1/0 so that the average of the column equals the conversion rate. <code>groupby('contact')</code> then shows count (people), sum (subscribers) and mean (rate). Cellular converts 57%, telephone 0%. But telephone has only 3 rows, so we must not trust it. Always show the count next to a rate.</p>
<p><b>Question-planning table</b> (write one like this):</p>
${pre(`Question                                   Metric                  Columns            Decision
1 Which contact type converts best?        conversion rate         contact, y         Which channel to use
2 Which job/age groups convert best?       conversion rate/segment job, age, y        Who to target
3 Does more calling help?                  rate by campaign count  campaign, y        When to stop calling
4 Which month is best?                     rate by month           month, y           When to run campaigns
5 How big is the overall opportunity?      overall rate, volume    y                  Set a target`)}`,
      practice: [
        [`Rewrite the vague task "analyse the marketing data" as one measurable business question.`, `<p>"Which customer segments (by job and age group) have the highest subscription rate, and how much higher is it than the overall rate?"</p><p>It names a metric (subscription rate), a breakdown (segment) and a comparison, so you know what to calculate.</p>`],
        [`In the sample above, what is the overall conversion rate and how do you compute it in one line?`, `${pre(`(df['y'] == 'yes').mean()   # 0.4`)}<p>4 yes out of 10 rows = 40%. A True/False column averages to the share of True.</p>`],
        [`Cellular shows 57% and telephone shows 0%. Is "stop using telephone" a valid recommendation? Why or why not?`, `<p>Not yet. Telephone has only 3 rows, so the rate can swing a lot by chance. Check the full file counts and, if possible, a significance test. Report the count with every rate.</p>`],
        [`Write pandas code that shows the conversion rate by job, highest first.`, `${pre(`df.groupby('job')['subscribed'].mean().sort_values(ascending=False)`)}<p>Group by job, average the 1/0 column, sort. On the sample: retired 1.00, student 0.50, admin 0.33, technician 0.00.</p>`],
        [`A campaign spent 30,000, got 150 new customers and 120,000 revenue. Find CAC, ROAS and ROI.`, `<p>CAC = 30,000 / 150 = <b>200</b>. ROAS = 120,000 / 30,000 = <b>4.0</b>. ROI = (120,000 - 30,000) / 30,000 = <b>3.0 = 300%</b>. (Here "cost" is only the ad spend; say so.)</p>`],
        [`Write 2 hypotheses for an edtech (OULAD-style) project, with what would prove each wrong.`, `<p>H1: Learners who are active in week 1 are more likely to finish. Wrong if completion is the same for active and inactive learners. H2: Learners with more previous attempts drop out more. Wrong if the dropout rate does not rise with attempts.</p>`]
      ],
      important: [
        [`Why did you choose this project and dataset?`, `<p>"I wanted a business domain different from my survey work. Marketing funnels are used everywhere, and the Bank Marketing data lets me show conversion, segments and a budget recommendation. It is a real campaign dataset with enough rows to make the findings meaningful."</p>`],
        [`How did you decide which questions to analyse?`, `<p>"I started from the decisions a campaign manager makes: which channel, which customers, when to call, and when to stop. For each decision I wrote one metric and the columns needed. That kept the analysis focused instead of random charts."</p>`],
        [`Define conversion rate in your project and one limit of it.`, `<p>"Conversion rate is customers who subscribed divided by customers contacted. A limit is that it ignores cost and customer value, so I also looked at cost per customer and ROI where the data allowed."</p>`]
      ],
      resources: [
        [`UCI Bank Marketing`, `https://archive.ics.uci.edu/dataset/222/bank+marketing`],
        [`OULAD (edtech)`, `https://analyse.kmi.open.ac.uk/open_dataset`],
        [`pandas: 10 minutes`, `https://pandas.pydata.org/docs/user_guide/10min.html`]
      ],
      done: `You are done when you have a dataset loaded, a data dictionary, 5 written business questions with metrics and decisions, 3 hypotheses, and a first commit in an empty GitHub repo.`
    },
    /* ---------------- TUE ---------------- */
    {
      title: 'Clean the data and explore it (EDA) in pandas',
      time: '1.5 h',
      study: [
        `EDA (exploratory data analysis) means looking at the data in a planned way: size, types, missing values, duplicates, ranges, distributions and relationships to the target.`,
        `Cleaning order: first understand (info, describe), then fix types, then handle duplicates, then missing values, then impossible values, then create new columns. Keep a log of every change.`,
        `Missing values: decide per column. Drop if few rows and random. Fill with median for skewed numbers or mode for categories. Or keep as an explicit "unknown" category. In Bank Marketing, "unknown" is often written as a text value, not a real missing value, so isna() will not show it.`,
        `Impossible values (age 120, negative duration) are errors or special codes. Set them to missing, then treat them like missing values. Never silently delete without counting.`,
        `Text clean-up: strip spaces, make lower case, fix spelling variants ("Technician " and "TECHNICIAN" become "technician").`,
        `Binning with pd.cut turns a number (age) into groups (age bands). Groups are easier to explain on a dashboard than raw numbers.`,
        `Create a 1/0 target column (subscribed). The mean of this column by group equals the conversion rate. Always show group size next to it.`,
        `Know the leakage trap: in Bank Marketing, call duration is only known after the call, so it must not be used to predict who will subscribe. Mention this in your README as a data caveat.`
      ],
      how: [
        `[10 min] Open your notebook from Day 1. Run df.info(), df.describe() and df.isna().sum(). Write 3 observations in a markdown cell.`,
        `[10 min] Count duplicates with df.duplicated().sum(). Look at them with df[df.duplicated(keep=False)]. Drop with drop_duplicates() only after you understand why they exist.`,
        `[15 min] Clean text columns (strip, lower). Replace the text "unknown" with NaN where you want it treated as missing, but keep a count of how many there were.`,
        `[15 min] Handle missing and impossible values. Write down your rule for each column (fill, drop, keep as unknown) in a markdown cell.`,
        `[10 min] Create new columns: subscribed (1/0) and age_group (pd.cut).`,
        `[20 min] Do univariate EDA: value_counts for each category column, histogram for age and balance. Then bivariate EDA: conversion rate by job, by contact, by age_group. Use groupby and a bar chart (df.plot(kind='bar') or seaborn).`,
        `[10 min] Save cleaned data to data/clean.csv with df.to_csv('data/clean.csv', index=False). Commit the notebook with the message "EDA and cleaning".`
      ],
      example: `<p><b>Dirty sample</b> (8 rows with a duplicate, missing values, wrong case and age 120). Same steps apply to the real file; check its column names first with df.info().</p>
${pre(`import pandas as pd, numpy as np

df = pd.DataFrame({
 'customer_id':[1,2,3,3,4,5,6,7],
 'age':[34,45,np.nan,np.nan,29,120,41,38],
 'job':['admin','Technician ','student','student',None,'retired','admin','TECHNICIAN'],
 'contact':['cellular','telephone','cellular','cellular','cellular','unknown','cellular','telephone'],
 'duration':[120,300,45,45,600,210,90,15],
 'y':['no','yes','no','no','yes','no','yes','no']})

print(df.isna().sum())            # age 2, job 1
print(df.duplicated().sum())      # 1  (customer 3 twice)

df = df.drop_duplicates()
df['job'] = df['job'].str.strip().str.lower().fillna('unknown')
df['contact'] = df['contact'].replace('unknown', np.nan)
df.loc[df['age'] > 100, 'age'] = np.nan          # impossible age
df['age'] = df['age'].fillna(df['age'].median())  # median = 38.0
df['subscribed'] = df['y'].map({'yes': 1, 'no': 0})
df['age_group'] = pd.cut(df['age'], bins=[0,30,45,60,120],
                         labels=['30 and under','31-45','46-60','over 60'])

print(df.groupby('age_group', observed=True)['subscribed'].agg(['count','mean']))`)}
<p><b>Expected output</b> (after cleaning, 7 rows remain)</p>
${pre(`age_group      count      mean
30 and under      1  1.000000
31-45             6  0.333333`)}
<p><b>Line by line.</b> <code>isna().sum()</code> counts missing values per column. <code>drop_duplicates()</code> removes the repeated row of customer 3. <code>str.strip().str.lower()</code> makes "Technician " and "TECHNICIAN" the same word "technician". We turn age 120 into NaN first, then fill every NaN age with the median (38) of the valid ages: 34, 45, 29, 41, 38. The median is better than the mean because it is not pulled by extreme values. <code>pd.cut</code> puts each age in a band. With only 1 row in the first band, the 100% rate means nothing. That is exactly why you show counts.</p>`,
      practice: [
        [`How do you count missing values per column, and as a percentage?`, `${pre(`df.isna().sum()
(df.isna().mean() * 100).round(1)`)}<p>The first gives counts; the second gives the percent missing per column.</p>`],
        [`The column job has values "Admin", "admin " and "ADMIN". Write one line to make them the same.`, `${pre(`df['job'] = df['job'].str.strip().str.lower()`)}<p>strip removes spaces at both ends; lower makes all letters small, so all three become "admin".</p>`],
        [`Why is the median a better fill value than the mean for balance or income columns?`, `<p>These columns are usually right-skewed with a few very large values. The mean is pulled up by them; the median stays in the middle of typical customers.</p>`],
        [`Create age bands 18-29, 30-44, 45-59, 60 plus from a column age.`, `${pre(`df['age_group'] = pd.cut(df['age'],
    bins=[17, 29, 44, 59, 120],
    labels=['18-29','30-44','45-59','60+'])`)}<p>Bins are (17,29], (29,44], (44,59], (59,120]. Right edge is included, so age 29 falls in 18-29.</p>`],
        [`Write code to get the conversion rate and the count for each contact type, sorted by rate.`, `${pre(`(df.groupby('contact')['subscribed']
   .agg(['count','mean'])
   .sort_values('mean', ascending=False))`)}<p>Shows both volume and rate in one table.</p>`],
        [`You find that 20% of rows have "unknown" for the education column. What are your options and what would you choose?`, `<p>Options: drop those rows (loses 20% data and may bias results), fill with the most common value (can hide a real group), or keep "unknown" as its own category. Best here: keep it as its own category, and report if its conversion rate is different, because unknown may itself be a signal.</p>`]
      ],
      important: [
        [`Walk me through how you cleaned the data in your project.`, `<p>"First I checked shape, types, missing values and duplicates. I removed exact duplicates, standardised text, converted unknown codes to missing, set impossible values to missing, and filled missing numbers with the median. I wrote each rule down and counted how many rows each rule changed, so the cleaning is transparent and repeatable."</p>`],
        [`How do you decide between dropping and filling missing values?`, `<p>"I look at why it is missing and how much. If it is a tiny share and random, dropping is fine. If it is large or meaningful, I fill with median or mode, or keep an explicit unknown category. I always check that the choice does not change my main finding."</p>`],
        [`What is data leakage? Give an example from your project.`, `<p>"Leakage is when a column carries information that would not be known at the time of the decision. In Bank Marketing, call duration is known only after the call, so using it to predict who will subscribe would be unfair. I mention it as a caveat and do not use it for targeting."</p>`]
      ],
      resources: [
        [`pandas: 10 minutes`, `https://pandas.pydata.org/docs/user_guide/10min.html`],
        [`Kaggle Learn (Python, Pandas)`, `https://www.kaggle.com/learn`]
      ],
      done: `You are done when your notebook loads the raw file, applies documented cleaning rules, creates subscribed and age_group columns, shows 5 or more charts or tables of conversion by segment, and saves data/clean.csv.`
    },
    /* ---------------- WED ---------------- */
    {
      title: 'Funnel, channel ROI, drop-off and segment analysis',
      time: '1.5 h',
      study: [
        `A funnel is an ordered list of steps (impressions, clicks, signups, customers). For each step you calculate how many pass to the next step. The biggest drop is your biggest opportunity.`,
        `Two views: step conversion (customers / signups) and cumulative conversion from the top (customers / clicks). Use both: step shows where it leaks; cumulative shows total yield.`,
        `Channel ROI table: for each channel calculate CTR, CPC, CAC, ROAS and ROI. Compare channels on cost per outcome (CAC), not on volume alone.`,
        `Totals trap: overall ROAS is total revenue divided by total spend. It is NOT the average of the channel ROAS values. Always calculate ratios from summed numerators and denominators.`,
        `Drop-off analysis for learners: count how many are still active by week and see where the curve falls steeply. Completion rate = completed / registered.`,
        `Segment analysis: split by a business attribute (job, age band, course, region) and compare the rate. Use pd.crosstab or groupby. Check group size before trusting a rate.`,
        `Correlation is not causation. A high rate in a segment tells you where to look, not why it happens.`,
        `Optional (SQL view): the same channel table can be built with GROUP BY and SUM in SQL. This helps if the interviewer asks "how would you do this in SQL".`
      ],
      how: [
        `[10 min] Decide your funnel for the project. Bank Marketing has no impressions, so use: contacted, subscribed (and maybe contacted more than once). Edtech: registered, active in week 1, active in week 4, completed.`,
        `[20 min] Build the funnel table in pandas (counts per step, step conversion, cumulative conversion). If your real dataset has no spend or revenue, use the inline channel table below to practise the ROI formulas and state clearly that the figures are illustrative.`,
        `[20 min] Calculate channel metrics in a DataFrame: CTR, CPC, CAC, ROAS, ROI. Sort by ROI.`,
        `[15 min] Build the segment tables: conversion rate and count by 3 segment columns. Use crosstab with normalize='index' for percentages.`,
        `[15 min] Edtech only: build the drop-off curve (active learners per week) and completion rate by course.`,
        `[5 min] Write 3 one-line findings under each table in markdown (what, how big, so what).`,
        `[5 min] Export each final table with to_csv into the dashboard/ folder. Tomorrow Power BI will use these files.`
      ],
      example: `<p><b>Sample campaign table</b> (illustrative numbers). Same steps apply to the real file; check its column names first with df.info().</p>
${pre(`import pandas as pd

c = pd.DataFrame({
 'channel':['Email','Search','Social','Referral'],
 'impressions':[100000,80000,200000,5000],
 'clicks':[3000,4000,2000,500],
 'signups':[600,400,300,150],
 'customers':[150,120,40,60],
 'spend':[30000,90000,80000,10000],
 'revenue':[120000,150000,60000,54000]})

c['ctr']  = c['clicks'] / c['impressions']
c['cpc']  = c['spend'] / c['clicks']
c['cac']  = c['spend'] / c['customers']
c['roas'] = c['revenue'] / c['spend']
c['roi']  = (c['revenue'] - c['spend']) / c['spend']
print(c[['channel','ctr','cpc','cac','roas','roi']].round(3))

tot = c[['impressions','clicks','signups','customers']].sum()
print(tot)
print((tot / tot.shift(1)).round(3))    # step conversion`)}
<p><b>Expected output</b></p>
${pre(`   channel    ctr   cpc      cac   roas    roi
0    Email   0.03  10.0  200.000  4.000  3.000
1   Search   0.05  22.5  750.000  1.667  0.667
2   Social   0.01  40.0 2000.000  0.750 -0.250
3 Referral   0.10  20.0  166.667  5.400  4.400

impressions    385000
clicks           9500
signups          1450
customers         370

clicks 0.025, signups 0.153, customers 0.255  (step conversion)`)}
<p><b>Line by line.</b> Each new column is one formula applied to every channel at once. Search has the best CTR among big channels (5%), yet its CAC is 750, so it is expensive per customer. Social has 200,000 impressions but a CTR of 1% and a CAC of 2,000: ROAS 0.75 means every 1 rupee spent returns only 0.75, so the ROI is negative (-25%). Referral and Email are the most efficient. Overall: spend 210,000, revenue 384,000, so overall ROI = 174,000 / 210,000 = 82.9%. Notice that is not the simple average of the four ROIs. The funnel shows only 2.5% of impressions become clicks and 15.3% of clicks become signups, and 25.5% of signups become customers.</p>
<p><b>Edtech drop-off sample.</b> Ten learners with last active week and completed flag:</p>
${pre(`l = pd.DataFrame({'learner_id': range(1, 11),
  'course': ['A']*5 + ['B']*5,
  'last_week': [1,2,8,8,8,1,1,3,4,8],
  'completed': [0,0,1,1,1,0,0,0,0,1]})
print(l.groupby('course')['completed'].agg(['count','sum','mean']))
for w in [1, 2, 4, 8]:
    print(w, (l['last_week'] >= w).sum())   # still active in week w`)}
<p>Output: course A completes 60% (3 of 5), course B 20% (1 of 5). Active learners per week: week 1 = 10, week 2 = 7, week 4 = 5, week 8 = 4. The steepest fall is from week 1 to week 2 (30% of learners are gone), so onboarding is the first thing to fix.</p>`,
      practice: [
        [`CTR is 3% and there were 100,000 impressions. How many clicks?`, `<p>100,000 x 0.03 = <b>3,000 clicks</b>.</p>`],
        [`A channel has 500 clicks and 150 signups, then 60 customers. Give the click-to-signup rate, signup-to-customer rate and click-to-customer rate.`, `<p>150/500 = <b>30%</b>. 60/150 = <b>40%</b>. 60/500 = <b>12%</b> (equal to 0.30 x 0.40).</p>`],
        [`Spend 90,000 and revenue 150,000 with 120 customers. CAC, ROAS, ROI?`, `<p>CAC = 90,000/120 = <b>750</b>. ROAS = 150,000/90,000 = <b>1.67</b>. ROI = 60,000/90,000 = <b>66.7%</b>.</p>`],
        [`Why is "overall ROAS = average of the channel ROAS" wrong? Show with the sample.`, `<p>Channel ROAS are 4.0, 1.667, 0.75, 5.4. Their simple average is 2.954. The true overall ROAS is 384,000 / 210,000 = <b>1.829</b>. The average ignores that channels spend very different amounts. Always sum the numerator and denominator first.</p>`],
        [`Write pandas code to show the share of customers coming from each channel.`, `${pre(`c['cust_share'] = c['customers'] / c['customers'].sum()
c[['channel','cust_share']].round(3)`)}<p>Email 40.5%, Search 32.4%, Social 10.8%, Referral 16.2%.</p>`],
        [`Show the SQL for CAC per channel (table campaign with channel, spend, customers), highest CAC first.`, `${pre(`SELECT channel,
       SUM(spend) * 1.0 / NULLIF(SUM(customers), 0) AS cac
FROM campaign
GROUP BY channel
ORDER BY cac DESC;`)}<p>Multiplying by 1.0 avoids integer division; NULLIF avoids divide-by-zero.</p>`]
      ],
      important: [
        [`How would you find the biggest leak in a funnel?`, `<p>"I list each step with its count, calculate step-to-step conversion, and compare it with a benchmark or with other segments. The step with the largest relative drop and the largest volume is the best place to improve. Then I split that step by channel and segment to see where the drop is worst."</p>`],
        [`Which channel would you invest more in and why?`, `<p>"I compare channels on cost per customer and ROI, not only volume. In my table Referral and Email have the best ROAS, Social loses money. But I would check whether the good channels can scale, because returns usually fall when spend rises. So I would test a gradual shift, not move everything at once."</p>`],
        [`What is the difference between CAC and CPC?`, `<p>"CPC is cost per click. CAC is cost per acquired customer. CAC = CPC divided by the click-to-customer rate. A cheap click can still give an expensive customer if few clickers convert."</p>`]
      ],
      resources: [
        [`pandas: 10 minutes`, `https://pandas.pydata.org/docs/user_guide/10min.html`],
        [`Mode SQL Tutorial`, `https://mode.com/sql-tutorial`]
      ],
      done: `You are done when you have a funnel table, a channel (or segment) metrics table with CAC/ROAS/ROI or completion rates, a segment crosstab, and 3 written findings, all exported as CSV files.`
    },
    /* ---------------- THU ---------------- */
    {
      title: 'Build the Power BI dashboard',
      time: '1.5 h',
      study: [
        `A dashboard answers a few questions fast. Layout rule: KPI cards on top, the main chart in the middle, details and slicers at the side or bottom. One page for an interview project is enough; 2 pages is great.`,
        `Import the clean CSV: Home, Get data, Text/CSV, then Transform data to open Power Query. Check the data type of every column (whole number, decimal, text) before loading.`,
        `A measure is a DAX formula that calculates at report time and reacts to slicers. Use measures for ratios (CTR, CAC, ROAS, conversion rate). Never average a ratio column; use DIVIDE of sums.`,
        `DIVIDE(numerator, denominator) safely returns blank instead of an error when the denominator is zero.`,
        `Funnel visual needs two things: a category (step name) and a value. If your steps are in separate columns, select them in Power Query and use Transform, Unpivot Columns. You get an Attribute column (step) and a Value column.`,
        `Chart choice: bar chart to compare categories, line chart for time, funnel for steps, table or matrix for exact numbers, card for one KPI. Avoid pie charts with more than 4 slices.`,
        `Good dashboard design: consistent colours (one highlight colour), clear titles that state the message ("Referral gives the lowest cost per customer"), sorted bars, no clutter, number formats (percent, thousands).`,
        `Share carefully: screenshots and the .pbix file in GitHub are safe. "Publish to web" makes the report public to everyone, so use it only for open data like this.`
      ],
      how: [
        `[10 min] Open Power BI Desktop. Get data from your clean CSV files (the channel table and the segment tables from Day 3). In Power Query check types and click Close and Apply.`,
        `[10 min] If you use a funnel visual, duplicate the funnel table query, unpivot the step columns (Transform, Unpivot Columns), and name the columns Stage and Count.`,
        `[15 min] Create measures (Modelling, New measure). Use the DAX in the example: totals, CTR, signup rate, CAC, ROAS, ROI.`,
        `[10 min] Add KPI cards on the top row: Total Spend, Total Customers, CAC, ROAS (or Completion rate for edtech).`,
        `[20 min] Add visuals: a funnel chart for stages, a clustered bar of ROI or CAC by channel (sorted), a bar of conversion rate by segment, and a slicer for channel or segment.`,
        `[15 min] Format: page title, meaningful visual titles, percent and thousand formats, one accent colour. Turn off gridlines you do not need. Check the dashboard on one slicer click.`,
        `[10 min] Save as dashboard/project3.pbix. Take a screenshot (Windows key + Shift + S) and save as images/dashboard.png. Also export to PDF (File, Export, Export to PDF).`
      ],
      example: `<p><b>Data:</b> the Campaign table from Day 3 (channel, impressions, clicks, signups, customers, spend, revenue). Same steps apply to your real file; use your own column names.</p>
${pre(`Total Impressions = SUM(Campaign[impressions])
Total Clicks      = SUM(Campaign[clicks])
Total Signups     = SUM(Campaign[signups])
Total Customers   = SUM(Campaign[customers])
Total Spend       = SUM(Campaign[spend])
Total Revenue     = SUM(Campaign[revenue])

CTR          = DIVIDE([Total Clicks], [Total Impressions])
Signup Rate  = DIVIDE([Total Signups], [Total Clicks])
Customer Rate = DIVIDE([Total Customers], [Total Signups])
CAC          = DIVIDE([Total Spend], [Total Customers])
ROAS         = DIVIDE([Total Revenue], [Total Spend])
ROI          = DIVIDE([Total Revenue] - [Total Spend], [Total Spend])`)}
<p><b>Expected card values</b> with no slicer selected: Total Spend 210,000; Total Customers 370; CTR 2.47%; Signup Rate 15.3%; Customer Rate 25.5%; CAC 567.57; ROAS 1.83; ROI 82.9%. Click "Social" in the slicer and the same measures show Social only: CAC 2,000, ROAS 0.75, ROI -25%.</p>
<p><b>Why measures and not columns?</b> A measure recalculates for whatever is selected. Because every measure divides sums, the total row is correct (1.83) instead of the wrong average of channel ratios.</p>
<p><b>Suggested one-page layout</b></p>
${pre(`+------------------------------------------------------------+
| Title: Channel performance: where do customers cost least? |
| [Spend] [Customers] [CAC] [ROAS]          [Channel slicer] |
+-----------------------------+------------------------------+
| Funnel: Clicks > Signups >  | Bar: ROI by channel (sorted) |
| Customers                   |                              |
+-----------------------------+------------------------------+
| Bar: conversion rate by segment (job or age group)         |
+------------------------------------------------------------+`)}
<p><b>Line by line.</b> The top row gives the headline in 3 seconds. The funnel shows where people drop. The ROI bar shows which channel to cut or grow. The bottom bar shows who to target. Every chart title should be a sentence that states its message.</p>`,
      practice: [
        [`Write a DAX measure for Conversion Rate from a table Leads with columns Customers and Contacted.`, `${pre(`Conversion Rate = DIVIDE(SUM(Leads[Customers]), SUM(Leads[Contacted]))`)}<p>Divide the two sums so the result stays correct at any filter level.</p>`],
        [`Why can we not just drag a pre-calculated ROI column and set it to Average?`, `<p>The average of row ratios gives each row the same weight, even a tiny channel. The correct overall ROI uses total revenue and total spend, so create a measure.</p>`],
        [`Name the right visual for: (a) compare ROI across 4 channels, (b) steps from click to customer, (c) one KPI number.`, `<p>(a) Sorted clustered bar chart. (b) Funnel chart. (c) Card.</p>`],
        [`Your funnel steps are in three separate columns (clicks, signups, customers). How do you prepare data for the funnel visual?`, `<p>In Power Query select those columns, then Transform, Unpivot Columns. You get one column with the step name and one with the value, which the funnel visual needs.</p>`],
        [`Write a measure for Cost per Click and one that shows blank if there are no clicks.`, `${pre(`CPC = DIVIDE([Total Spend], [Total Clicks])`)}<p>DIVIDE returns blank when the denominator is zero or blank, so no error.</p>`],
        [`The ROI bar shows Social as -25%. How do you make the bad channel stand out without extra colours everywhere?`, `<p>Use conditional formatting: Format, Visual, Bars, fx. Set one colour for negative values (red) and a neutral grey/blue for positive. Keep all other elements neutral.</p>`]
      ],
      important: [
        [`Calculated column vs measure: which did you use for CAC and why?`, `<p>"A measure. CAC is a ratio, and a ratio must be calculated from totals at the current filter. A measure does that for every slicer selection and in total rows. A calculated column is stored row by row and cannot react to filters."</p>`],
        [`Walk me through your dashboard in 60 seconds.`, `<p>"The top cards show spend, customers, CAC and ROAS. The funnel shows where people drop between click and customer. The bar chart ranks channels by ROI, and Social is the only negative one. The bottom chart shows conversion by segment. The slicer lets the manager filter by channel. The main takeaway is to move budget from Social towards Email and Referral."</p>`],
        [`How do you keep a dashboard simple?`, `<p>"One question per page, 3 to 5 visuals, KPIs first, sorted charts, consistent colours, and titles that state the message. I remove anything that does not help a decision."</p>`]
      ],
      resources: [
        [`Microsoft Learn: Power BI`, `https://learn.microsoft.com/en-us/training/powerplatform/power-bi`],
        [`DAX Guide`, `https://dax.guide`],
        [`Guy in a Cube (YouTube)`, `https://www.youtube.com/@GuyInACube`]
      ],
      done: `You are done when you have a one- or two-page .pbix with KPI cards, a funnel, a ranked channel or segment chart, a slicer, correct DAX measures built on sums, plus a screenshot and a PDF export.`
    },
    /* ---------------- FRI ---------------- */
    {
      title: 'Write insights and recommendations',
      time: '1.5 h',
      study: [
        `An insight is not a chart. An insight = what you found (with a number) + why it matters + what to do. Use the pattern: Finding, So what, Now what.`,
        `Quantify every statement: "Referral CAC is 167 versus 2,000 for Social (12 times lower)" is stronger than "Referral is cheaper".`,
        `Rank by impact: choose the top 3 insights. Interviewers remember three things, not ten.`,
        `A recommendation must be actionable (who does what), measurable (how we will know it worked) and honest about risk (what could go wrong).`,
        `Estimate impact with a simple what-if. State your assumptions (for example returns on the extra spend are only half as good because channels saturate).`,
        `Name the limits: sample size per segment, data period, correlation is not causation, missing cost data, call duration leakage. Honest limits build trust.`,
        `Suggest a test: for budget changes, propose an A/B or pilot on a part of the budget before moving all of it.`,
        `Write for a non-technical manager: short sentences, no code, no jargon without a plain-language explanation.`
      ],
      how: [
        `[10 min] Re-read your tables and dashboard. List every number that surprised you. Pick the 3 largest or most useful.`,
        `[20 min] For each one write Finding, So what, Now what in 3 short lines. Use the example format.`,
        `[15 min] Calculate one what-if for the top recommendation (budget shift). Write assumptions next to it.`,
        `[10 min] Write the Limitations and Next steps list (3 to 4 bullets each).`,
        `[15 min] Write a 5-line executive summary at the top: situation, key finding, recommendation, expected impact, next step.`,
        `[10 min] Add a Findings text box to the Power BI page, or a short insights section in the notebook. Check every number matches the tables.`,
        `[10 min] Ask someone (or an AI chat) to read it and say what is unclear. Fix the unclear parts. Commit to GitHub.`
      ],
      example: `<p><b>Data used</b> (the sample channel table). Same method applies to the real file.</p>
${pre(`Channel   Spend    Customers  CAC     Revenue  ROAS  ROI
Email     30,000   150        200     120,000  4.00  +300%
Search    90,000   120        750     150,000  1.67  +67%
Social    80,000    40      2,000      60,000  0.75  -25%
Referral  10,000    60        167      54,000  5.40  +440%`)}
<p><b>Insight 1 (Finding, So what, Now what)</b></p>
${pre(`Finding:  Social took 38% of spend (80k of 210k) but gave only 11% of
          customers (40 of 370) and lost money (ROAS 0.75).
So what:  Every 100 rupees on Social returns 75, a direct loss.
Now what: Cut Social by half (40k) and move it to Email, then review
          after 4 weeks.`)}
<p><b>What-if for the budget shift</b> (assumptions written out):</p>
${pre(`Social 40k less:  lose about 20 customers and 30,000 revenue
                  (assume Social gives half the customers for half the spend).
Email 40k more:   Email CAC today is 200. Assume returns are only half as good
                  (CAC 400): 40,000 / 400 = 100 customers.
                  Email revenue per customer = 120,000 / 150 = 800
                  so 100 x 800 = 80,000 revenue.
Net result:       +80 customers, +50,000 revenue, same total spend.`)}
<p><b>Check:</b> 38% = 80/210 = 0.381; 11% = 40/370 = 0.108. Email revenue per customer 800 is correct (120,000 / 150). The net is 100 - 20 = 80 customers and 80,000 - 30,000 = 50,000 revenue.</p>
<p><b>Limitations to state:</b> the table is illustrative; Referral volume is small (5,000 impressions) and may not scale; Email may saturate; we did not include customer lifetime value. <b>Next step:</b> pilot the shift on 20% of the budget for 4 weeks and compare CAC.</p>
<p><b>Line by line.</b> The finding gives numbers. The "so what" translates them into plain money language. The "now what" is one clear action with a review date. The what-if shows your assumptions so the manager can challenge them, which is much better than a hidden guess.</p>`,
      practice: [
        [`Turn this into an insight: "Email has CAC 200 and Social has CAC 2000."`, `<p>"Social costs 10 times more per customer than Email (2,000 vs 200). Shift part of the Social budget to Email and track CAC for 4 weeks."</p><p>It has a comparison with a number, a so-what and an action.</p>`],
        [`Spend share vs customer share: Referral has 10,000 of 210,000 spend and 60 of 370 customers. Calculate both shares.`, `<p>Spend share = 10,000/210,000 = <b>4.8%</b>. Customer share = 60/370 = <b>16.2%</b>. Referral gets 3.4 times more customers than its share of spend.</p>`],
        [`Your recommendation is "increase Email spend by 30,000". What two assumptions should you state?`, `<p>(1) Whether the same CAC holds at higher spend (diminishing returns). (2) Whether Email has enough audience size to take the extra volume. Also state the time period.</p>`],
        [`A segment (students) shows a 50% conversion rate but there are only 2 students. How do you write it?`, `<p>Do not make it a finding. Write: "Students look promising (1 of 2 converted) but the sample is too small to conclude." Add it to next steps: collect more data.</p>`],
        [`Rewrite in plain language: "Conversion in the cellular segment is statistically higher at 95% confidence."`, `<p>"Customers contacted on mobile phones subscribe more often, and the gap is large enough that it is unlikely to be chance."</p>`],
        [`Write a 5-line executive summary for the sample channel data.`, `<p>1) Situation: we spent 210k on four channels for 384k revenue (ROI +83%). 2) Finding: Social used 38% of spend but lost money (ROAS 0.75). 3) Recommendation: move 40k from Social to Email. 4) Expected impact: about +80 customers at the same spend (assumes half the return on the extra spend). 5) Next step: pilot for 4 weeks and track CAC.</p>`]
      ],
      important: [
        [`What was your most important insight and what did you recommend?`, `<p>"Social used about 38% of the budget but only 11% of customers, with ROAS 0.75, so it lost money. I recommended moving half of it to Email and Referral, running a 4-week pilot, and tracking CAC. I also stated that returns may fall as spend grows."</p>`],
        [`How do you make sure your recommendation is not just a correlation?`, `<p>"I state it as a pattern, check the sample size, look for confounders such as customer type or month, and suggest a controlled pilot or A/B test before a full change."</p>`],
        [`How do you present findings to a non-technical manager?`, `<p>"I lead with the answer and the decision, show one chart per message, use plain words and money numbers, and keep detail for the appendix. I end with a clear next step."</p>`]
      ],
      resources: [],
      done: `You are done when you have 3 insights in Finding, So what, Now what format with numbers, one what-if with assumptions written out, a limitations list, a 5-line executive summary, and all numbers re-checked against your tables.`
    },
    /* ---------------- SAT ---------------- */
    {
      title: 'README, publish on GitHub and rehearse the 2-minute walkthrough',
      time: '3.5 h',
      study: [
        `A README is the front page of your project. A recruiter spends less than a minute on it. It must answer: what problem, what data, what you did, what you found, how to run it.`,
        `Good README sections: Title and one-line summary, Business problem, Data, Tools, Approach (steps), Key findings (with numbers), Dashboard screenshot, Recommendations, Limitations, How to run, Author/contact.`,
        `Git basics: init, add, commit, branch, remote, push. A commit is a saved snapshot; commit messages should say what changed ("Add channel ROI analysis").`,
        `Repo hygiene: do not commit very large raw files or any private data. Link to the source page and keep only a small sample or the cleaned output if the licence allows. Add a requirements.txt (pip freeze or list pandas, matplotlib, seaborn, jupyter).`,
        `Resume bullet formula: Action verb + what you did + data size + tool + result. Example: "Analysed 40k+ campaign records in pandas to find the highest-converting segments and proposed a budget shift."`,
        `The 2-minute walkthrough is about 250 words spoken at a calm pace (about 120 to 130 words per minute). Structure: Context (15 s), Question (15 s), Method (30 s), Findings (40 s), Recommendation and impact (15 s), Learning (5 s).`,
        `Speak your numbers clearly. Say "about 12 percent" not "0.117". Pause after the key finding.`,
        `Rehearse aloud and record your voice on your phone. Reading silently does not train your mouth. Aim for 3 rehearsals today, each shorter and smoother.`
      ],
      how: [
        `[40 min] Write README.md using the template in the example. Fill every section with real numbers and 2 images (dashboard screenshot and one key chart saved from your notebook).`,
        `[20 min] Tidy the repository: folders data/, notebooks/, dashboard/, images/. Rename the notebook to 01_cleaning_eda.ipynb. Add requirements.txt and a small .gitignore (large data files, .ipynb_checkpoints).`,
        `[20 min] Run the notebook from top to bottom after restarting the kernel (Kernel, Restart and Run All) to make sure it works. Fix errors.`,
        `[20 min] Publish: run the git commands in the example, open your repo in a browser and check the README looks right. Pin the repository on your GitHub profile.`,
        `[15 min] Add the project to your resume (one or two bullets) and to LinkedIn Featured or Projects.`,
        `[30 min] Write the 2-minute script (about 250 words) using the structure in the example.`,
        `[45 min] Rehearse aloud 3 to 5 times with a timer. Record the last one on your phone. Listen once and note two fixes (too fast? filler words? unclear number?). Re-record.`,
        `[20 min] Prepare answers to 5 follow-up questions: why this dataset, biggest challenge, what you would do with more data, how you checked data quality, a limitation.`
      ],
      example: `<p><b>README template</b> (copy and fill; numbers are examples).</p>
${pre(`# Bank Marketing: Which Customers and Channels Convert Best?
One-line summary: pandas + Power BI analysis of a bank phone campaign to find the
highest-converting segments and recommend a budget shift.

## Business problem
The campaign team has a limited number of calls. Who should they call, and
through which channel, to get more subscriptions?

## Data
UCI Bank Marketing dataset (link). 45k+ rows. Target: y (subscribed yes/no).
Note: call duration is known only after the call, so it is not used for targeting.

## Tools
Python (pandas, matplotlib), Power BI, GitHub

## Approach
1. Cleaned data: removed duplicates, standardised text, treated unknown as missing.
2. EDA: conversion rate by job, age group, contact type, month.
3. Funnel and channel metrics (CAC, ROAS, ROI).
4. Dashboard in Power BI.

## Key findings
- Overall conversion about 12%.   (use YOUR number)
- Segment X converts N times more than segment Y.
- Month Z has the best rate but few contacts.

## Recommendations
1. ...  2. ...  3. ...

## Limitations
Correlation not causation; some segments are small; no cost data in the file.

## How to run
pip install -r requirements.txt, open notebooks/01_cleaning_eda.ipynb

## Dashboard
![dashboard](images/dashboard.png)`)}
<p><b>Publish commands</b> (run in the project folder; replace the placeholders):</p>
${pre(`git init
git add .
git commit -m "Project 3: cleaning, EDA, dashboard, README"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main`)}
<p>Create the empty repo on GitHub first (no README there, to avoid a conflict). Later updates need only: <code>git add .</code>, <code>git commit -m "message"</code>, <code>git push</code>.</p>
<p><b>2-minute script</b> (about 250 words; adjust numbers to your project):</p>
${pre(`CONTEXT (15s)
"My third project analyses a bank's telemarketing campaign. The bank wants more
term-deposit subscriptions from a limited number of calls."

QUESTION (15s)
"I asked: which customer segments and contact channels convert best, and where
should the team focus?"

METHOD (30s)
"I used about 45,000 records. In pandas I removed duplicates, standardised text
and handled missing values. Then I calculated conversion rate by job, age group,
contact type and month, and built a Power BI dashboard with KPI cards,
a funnel and ranked charts."

FINDINGS (40s)
"The overall conversion rate was about 12 percent. Customers contacted on
mobile converted somewhat more than those on landline (fill in your own numbers). Students and retired
customers converted best, but I checked group sizes so I did not
over-trust small groups."

RECOMMENDATION (15s)
"I recommended prioritising mobile contact and the top segments, and running
a 4-week pilot to confirm the lift before changing the whole plan."

LEARNING (5s)
"I learned to report counts with every rate and to state limitations."`)}
<p><b>Line by line.</b> The README is built so a stranger can understand the project in one minute. The git commands save a snapshot and send it to GitHub. The script uses one idea per paragraph; you can say it in 2 minutes because each part has a time budget. Fill in the numbers from your own analysis. Never quote a number you cannot find in your notebook.</p>`,
      practice: [
        [`Write one resume bullet for your project using Action + what + size + tool + result.`, `<p>"Analysed 45k+ bank campaign records in pandas and built a Power BI dashboard to identify the highest-converting customer segments; recommended a channel and budget shift for a 4-week pilot."</p><p>Use your real row count. Do not claim a result you did not measure.</p>`],
        [`What is wrong with this README line: "I did EDA and made charts"? Rewrite it.`, `<p>It has no question, no number and no result. Better: "Explored 45k records; found that mobile-contacted customers convert at 15% versus 13% for landline customers, and that the lowest rate (about 4%) is where the contact type is unknown (check your exact numbers)."</p>`],
        [`Write the three git commands to save your latest changes and send them to GitHub.`, `${pre(`git add .
git commit -m "Update insights and README"
git push`)}<p>add stages the changes, commit saves a snapshot, push uploads it.</p>`],
        [`How many words fit in a 2-minute talk at 125 words per minute?`, `<p>2 x 125 = <b>250 words</b>. Aim for 230 to 260.</p>`],
        [`Name 3 things you should NOT commit to a public GitHub repository.`, `<p>Private or confidential data (client or employer data), passwords/API keys, and very large raw data files (link to the source instead).</p>`],
        [`An interviewer says: "What would you do with more time?" Give a good answer.`, `<p>"I would test the budget shift with a pilot, add customer lifetime value to the ROI, try a simple model to score customers by likelihood to subscribe (without using call duration), and automate the cleaning as a script."</p>`]
      ],
      important: [
        [`Give me a 2-minute walkthrough of your Project 3.`, `<p>Use your script: context, question, method, findings with numbers, recommendation, one learning. Practise until you can say it without reading. Keep it under 2 minutes 15 seconds.</p>`],
        [`What was the biggest challenge in this project and how did you solve it?`, `<p>"Messy values such as unknown codes and impossible ages. I standardised text, converted unknown codes to missing, wrote down every rule, and counted rows changed, so the cleaning was transparent. I also checked that my main finding did not change with the other choice."</p>`],
        [`What would you do differently?`, `<p>"I would add cost and customer value to measure true ROI, test my recommendation with a pilot, and package the cleaning into a reusable script."</p>`],
        [`How is this project different from your earlier ones?`, `<p>"Project 1 was survey analysis with CSAT and NPS, Project 2 was e-commerce with SQL. This one uses Python for cleaning and EDA and focuses on funnel, channel ROI and segments. Together they show three domains and three skill sets."</p>`]
      ],
      resources: [
        [`GitHub`, `https://github.com`],
        [`Alex The Analyst (YouTube)`, `https://www.youtube.com/@AlexTheAnalyst`]
      ],
      done: `You are done when the repo is public with a complete README and screenshot, the notebook re-runs cleanly, your resume has the bullet, and you can speak the walkthrough in 2 minutes without reading.`
    },
    /* ---------------- SUN ---------------- */
    {
      title: 'Apply to 10 jobs and send 5 referral messages',
      time: '3.5 h',
      study: [
        `Quality plus quantity: tailored applications work better than mass applications. 10 tailored applications beat 40 copy-paste ones. Keep your base resume and change the top section and keywords for each job.`,
        `ATS (applicant tracking system) software scans resumes for keywords. Copy exact skill words from the job description if you truly have them: SQL, Power BI, DAX, Python, pandas, Excel, dashboards, data cleaning.`,
        `Where to apply: Naukri, LinkedIn Jobs, Indeed, Foundit, Wellfound (startups) and company career pages. Set job alerts so new jobs come to you.`,
        `Which roles to target: Data Analyst, Junior Data Analyst, Business Analyst, BI Analyst, MIS Analyst, Reporting Analyst, Analytics Associate. Survey and market research firms are a strong match for your background.`,
        `Referrals: a referral often gets your resume read by a human. Ask people you already know first (college mates, ex-colleagues), then people at target companies.`,
        `A good referral message is short: who you are, what role you want, why you fit in one line, a clear small ask, and a link to your resume or GitHub. Never attach a resume to a first message to a stranger without context.`,
        `Track every application: company, role, date, link, status, follow-up date. Follow up after 5 to 7 days with a short polite message.`,
        `Rejections and silence are normal. A response rate of 5 to 10 percent is typical at the start. Keep going and improve the resume every 10 applications.`
      ],
      how: [
        `[20 min] Create a tracker (Excel or Google Sheet) with columns: Date, Company, Role, Link, Source, Referral?, Status, Follow-up date, Notes.`,
        `[15 min] Update the resume top section: headline, 3-line summary, skills line, and your three projects (Project 3 as a bullet with your numbers). Save as a PDF named FirstName_LastName_DataAnalyst.pdf.`,
        `[20 min] Search 3 portals with your target role titles and filters (0 to 2 years experience, your city or remote, posted in last 7 days). Shortlist 15 jobs. Skip jobs that need 5 or more years.`,
        `[75 min] Apply to 10 jobs (about 7 minutes each). For each one read the description, copy 3 to 5 keywords into your summary line, and submit. Log it in the tracker immediately.`,
        `[30 min] Find 5 people for referral messages (LinkedIn search: company name + data analyst). Customise and send the message in the example. Send only 5 today, personalised.`,
        `[20 min] Set job alerts on Naukri and LinkedIn for 2 to 3 role titles. Turn on "open to work" for recruiters only if you want that.`,
        `[20 min] Review the week: update the checklist on the Jobs page, list what worked, and plan next week's target (10 more applications and your Week 10 mock interview).`
      ],
      example: `<p><b>Tracker sample</b> (copy these columns into a sheet):</p>
${pre(`Date        Company      Role               Source    Referral  Status    Follow-up
12-Oct-25   ABC Research Junior Data Analyst  LinkedIn  No        Applied   19-Oct-25
12-Oct-25   XYZ Retail   BI Analyst           Naukri    Yes       Applied   17-Oct-25`)}
<p><b>Referral message (to someone you know slightly):</b></p>
${pre(`Hi Priya, hope you are doing well. I am a survey programmer with 2+ years
of experience moving into data analytics (SQL, Power BI, Python). I saw a
Junior Data Analyst opening at XYZ. Would you be open to referring me,
or telling me who handles hiring for it? I have a project portfolio here:
github.com/your-username. Happy to send my resume. Thank you!`)}
<p><b>Message to a stranger (no resume, just a question):</b></p>
${pre(`Hi Rahul, I am preparing for data analyst roles and saw you work on the
analytics team at XYZ. I recently built a marketing funnel project in
pandas and Power BI. Could I ask 2 quick questions about what the team
looks for in a junior analyst? Thank you for your time.`)}
<p><b>Tailoring example.</b> Job description says "SQL, Power BI, stakeholder reporting, data cleaning". Your resume summary becomes: "Data analyst with 2+ years of survey data experience. Strong in SQL, Power BI dashboards, data cleaning and stakeholder reporting. Built 3 portfolio projects (survey, e-commerce, marketing)."</p>
<p><b>Line by line.</b> The tracker prevents lost follow-ups. The first message is short, has one clear ask and a link as proof. The second asks for advice, which people find easier to say yes to, and often leads to a referral later. The tailoring example repeats the job's own words, which helps both ATS and the human reader, but only for skills you truly have.</p>`,
      practice: [
        [`How many applications and referral messages is the target for today, and how long should each application take?`, `<p>10 applications and 5 referral messages. About 7 minutes per application after your base resume is ready.</p>`],
        [`A job asks for 4 to 6 years of experience and a Tableau specialist. Should you apply?`, `<p>Usually skip it. It is far from your level and tool. Apply to roles asking 0 to 2 years with SQL, Power BI, Excel or Python. If you like the company, you may still send a short referral message.</p>`],
        [`Rewrite this weak summary: "Hardworking fresher looking for a good opportunity."`, `<p>"Data analyst with 2+ years of experience in survey data validation and logic. Skilled in SQL, Power BI, Python (pandas) and Excel. Built 3 end-to-end analytics projects with dashboards and recommendations."</p>`],
        [`Write a 2-line follow-up message for an application sent 7 days ago.`, `<p>"Hello, I applied for the Junior Data Analyst role on 12 October and wanted to confirm that my application was received. I am very interested and happy to share my project portfolio. Thank you."</p>`],
        [`If you send 10 applications a week for 4 weeks and 8 percent respond, how many responses do you expect?`, `<p>40 applications x 0.08 = <b>3.2</b>, so about 3 responses. This is why you need to keep applying and improve the resume, plus use referrals.</p>`]
      ],
      important: [
        [`Tell me about yourself. (Use it in every first call)`, `<p>"I am a survey programmer with 2+ years of experience in building questionnaires, validating data and fixing logic. I enjoyed working with the data, so I upskilled in SQL, Power BI, Python and statistics, and built three projects: survey insights, e-commerce analytics and a marketing funnel. I am now looking for a data analyst role where I can use my data quality skills to give business insights."</p>`],
        [`Why should we hire you with no analyst title?`, `<p>"I already work with respondent-level data every day, I know how bad data is created and how to catch it, and I have shown end-to-end analysis in three projects with dashboards and recommendations. I learn fast and communicate clearly."</p>`],
        [`What is your notice period and expected salary?`, `<p>"My notice period is [X days; say if negotiable]. For salary I looked at the market for junior analysts in this city and expect a range of [your researched range]; I am flexible for the right learning opportunity." (Check AmbitionBox and Glassdoor first.)</p>`]
      ],
      resources: [
        [`AmbitionBox (India salaries)`, `https://www.ambitionbox.com`],
        [`Glassdoor interviews`, `https://www.glassdoor.co.in/Interview/index.htm`]
      ],
      done: `You are done when 10 applications and 5 referral messages are logged in your tracker with follow-up dates, job alerts are set, and your resume top section matches your three projects.`
    }
  ]
};
