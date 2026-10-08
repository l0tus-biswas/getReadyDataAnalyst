/* Week 6 guide: Python for analysis (pandas) */
GUIDES[6] = {
  intro: `<p><b>Why this week matters.</b> If a job description says "Python", the interview will have a small pandas task: clean a messy table, group and aggregate, merge two tables, or remove outliers. These tasks are short, and they repeat. This week you learn exactly those patterns.</p>
<p><b>By Sunday you can:</b> read a CSV and explore it, filter with loc and iloc, clean missing and messy data, use groupby, pivot_table, merge, concat and apply, make the 6 basic charts, do an end-to-end EDA (exploratory data analysis), and write an outlier-removal function from memory.</p>
<p><b>Time split.</b> Mon: Python basics refresh. Tue: read and select data. Wed: cleaning. Thu: groupby, merge and the "session duration" interview problem. Fri: charts. Sat (3.5 h): full EDA notebook, your Week 6 deliverable. Sun (3.5 h): Q&A review, 5 SQL problems, and short optional numpy and scikit-learn peeks.</p>
<p><b>How to practise.</b> Open Jupyter (or Google Colab if installation is a problem). Type every example yourself; do not copy-paste. After each block, change one thing and predict the output before running. All examples use small inline data, so you can paste and run them. The same steps apply to any Kaggle file. Note: new pandas versions print a text column as <code>str</code>, older ones print <code>object</code>. Both are fine.</p>`,
  days: [
    /* ---------------- MON ---------------- */
    {
      title: 'Python refresh for analysts',
      time: '1.5 h',
      study: [
        'Basic types: int, float, str, bool. Check with type(x). Strings are text and have many methods: lower(), strip(), split(), replace().',
        'List [1,2,3] is ordered and changeable. Tuple (1,2) is ordered and fixed. Dict {"a":1} stores key-value pairs. Set {1,2} stores unique values only.',
        'Loops: for x in items, while condition. Use enumerate(items) for index plus value, and dict.items() for key plus value.',
        'Functions: def name(args): return value. Default arguments (pass_mark=40), *args and **kwargs for flexible inputs. A function with no return gives None.',
        'List comprehension builds a list in one line: [x*2 for x in nums if x > 0]. Dict comprehension: {x: x*x for x in nums}.',
        'lambda is a tiny one-line function: lambda x: x*2. You use it with sorted(key=...), map, and pandas apply.',
        'Mutable vs immutable: lists, dicts and sets can change in place; strings, tuples and numbers cannot. b = a does not copy a list, it makes a second name for the same list. Use a.copy().'
      ],
      how: [
        'Open Jupyter Notebook (or Colab). Create a notebook "w6_day1_python.ipynb". Add a markdown cell with the date and goal. [5 min]',
        'Type the first example block (lists, dict, comprehension). Predict each output first, then run. [15 min]',
        'Type the functions and lambda block. Change the pass mark and see the result change. [15 min]',
        'Type the word-count and duplicates blocks. These are very common interview warm-ups. [20 min]',
        'Solve the practice questions below without looking at the answers. Time yourself: 5 minutes each at most. [25 min]',
        'Check answers, then rewrite any wrong one from memory. Add a markdown cell "What I learned". [10 min]'
      ],
      example: `<p>Copy this into a notebook cell and run it. Expected output is in the comments.</p>
${pre(`sales = [120, 340, 90, 560, 210]
print(len(sales), sales[0], sales[-1], sales[1:3])   # 5 120 210 [340, 90]

big = [x for x in sales if x > 200]                  # filter
print(big)                                           # [340, 560, 210]
tax = [round(x * 0.18, 1) for x in sales]            # transform
print(tax)                                           # [21.6, 61.2, 16.2, 100.8, 37.8]

person = {'name': 'Asha', 'city': 'Pune'}
person['age'] = 28
print(person.get('phone', 'missing'))                # missing  (no error)
for k, v in person.items():
    print(k, v)                                      # name Asha / city Pune / age 28

def grade(score, pass_mark=40):
    if score >= pass_mark:
        return 'Pass'
    return 'Fail'
print(grade(55), grade(30), grade(30, pass_mark=25)) # Pass Fail Pass

pairs = [('Asha', 88), ('Ravi', 92), ('Meena', 75)]
print(sorted(pairs, key=lambda p: p[1], reverse=True))
# [('Ravi', 92), ('Asha', 88), ('Meena', 75)]

text = 'the cat and the dog and the bird'
counts = {}
for w in text.split():
    counts[w] = counts.get(w, 0) + 1
print(counts)   # {'the': 3, 'cat': 1, 'and': 2, 'dog': 1, 'bird': 1}`)}
<p><b>Line by line.</b> <code>sales[1:3]</code> is a slice: index 1 up to (not including) 3. The list comprehension reads "give me x for every x in sales if x is above 200". <code>person.get('phone', 'missing')</code> returns a default instead of an error when the key is absent. <code>sorted(..., key=lambda p: p[1])</code> sorts the tuples by their second item (the score). In the word count, <code>counts.get(w, 0) + 1</code> starts at 0 for a new word and adds 1 each time. The same idea in pandas is <code>value_counts()</code>.</p>
<p><b>The copy trap:</b></p>
${pre(`a = [1, 2]
b = a            # same list, two names
b.append(3)
print(a)         # [1, 2, 3]   a changed too!
c = a.copy()
c.append(4)
print(a, c)      # [1, 2, 3] [1, 2, 3, 4]`)}`,
      practice: [
        ['Square only the even numbers from [1,2,3,4,5,6] using a list comprehension.', `${pre(`[x * x for x in [1, 2, 3, 4, 5, 6] if x % 2 == 0]   # [4, 16, 36]`)}<p>x % 2 == 0 keeps even numbers; then x * x squares them.</p>`],
        ['Write a function is_palindrome(s) that ignores case, spaces and punctuation.', `${pre(`def is_palindrome(s):
    s = ''.join(ch.lower() for ch in s if ch.isalnum())
    return s == s[::-1]

print(is_palindrome('A man, a plan, a canal: Panama'))   # True`)}<p>Keep only letters and digits, make lower case, then compare with the reversed string (s[::-1]).</p>`],
        ['Count word frequency in a sentence and return the top 2 words.', `${pre(`from collections import Counter
text = 'the cat and the dog and the bird'
print(Counter(text.split()).most_common(2))   # [('the', 3), ('and', 2)]`)}<p>Counter is a dict specialised for counting. You can also use the dict with .get() shown in the example.</p>`],
        ['Return the duplicate values of a list: [1,2,3,2,4,3,3] gives [2,3].', `${pre(`def duplicates(lst):
    seen, dup = set(), set()
    for x in lst:
        if x in seen:
            dup.add(x)
        seen.add(x)
    return sorted(dup)

print(duplicates([1, 2, 3, 2, 4, 3, 3]))   # [2, 3]`)}<p>A set checks membership quickly. If an item was seen before, it is a duplicate.</p>`],
        ['Predict the output: a = [1,2]; b = a; b.append(3); print(a). Then fix it so a stays [1,2].', `<p>Output is [1, 2, 3], because b and a are the same list. Fix: <code>b = a.copy()</code> (or <code>list(a)</code>) before appending.</p>`],
        ['Sort a list of (name, score) tuples by score descending, then by name ascending for ties.', `${pre(`data = [('Asha', 88), ('Ravi', 92), ('Meena', 88)]
print(sorted(data, key=lambda p: (-p[1], p[0])))
# [('Ravi', 92), ('Asha', 88), ('Meena', 88)]`)}<p>The key returns a tuple. Negative score makes high scores first; the name breaks ties alphabetically.</p>`]
      ],
      important: [
        ['What is the difference between a list and a tuple?', `<p>Both are ordered collections. A list is mutable (you can add, remove or change items); a tuple is immutable. Tuples are slightly faster, can be dictionary keys, and signal "this should not change", like a coordinate pair. Lists are used when the data grows or changes.</p>`],
        ['What is a lambda function and where do you use it?', `<p>A lambda is a small anonymous function written in one line, like lambda x: x * 2. I use it for short logic inside sorted(key=...), map, filter and pandas apply. For anything longer than one simple expression I write a normal def function so it is readable.</p>`],
        ['What is the difference between == and is?', `<p>== checks if two values are equal. "is" checks if two names point to the very same object in memory. I use == for values and "is" only for None, for example x is None.</p>`],
        ['What are *args and **kwargs?', `<p>*args collects extra positional arguments into a tuple. **kwargs collects extra named arguments into a dictionary. They let a function accept a flexible number of inputs.</p>`]
      ],
      resources: [['Kaggle Learn (Python, Pandas)', 'https://www.kaggle.com/learn']],
      done: 'You are done when you can write a list comprehension, a function with a default argument, a word count, and a duplicates finder without looking.'
    },
    /* ---------------- TUE ---------------- */
    {
      title: 'Jupyter and pandas: read, explore, select, filter, sort',
      time: '1.5 h',
      study: [
        'A DataFrame is a table with rows and labelled columns. A Series is one column. Import with: import pandas as pd.',
        'Load data: pd.read_csv("file.csv"). Excel: pd.read_excel("file.xlsx"). First look: df.head(), df.shape, df.info(), df.describe(), df.columns, df.dtypes.',
        'Select columns: df["col"] gives a Series; df[["a","b"]] gives a DataFrame. Add a column by assignment: df["revenue"] = df["qty"] * df["price"].',
        'Filter rows with a boolean mask: df[df["revenue"] > 1000]. Combine with &amp; (and), | (or), and put each condition in brackets. Do not use "and"/"or" here.',
        'loc selects by label and also takes boolean masks: df.loc[rows, columns]. iloc selects by integer position: df.iloc[0:3, 0:2] (end is excluded in iloc, included in loc slices of labels).',
        'Sort: df.sort_values("revenue", ascending=False). Count categories: df["col"].value_counts(). Unique count: df["col"].nunique(). isin() filters a list of values.',
        'Always check df.shape before and after an operation. If the row count changes unexpectedly, you found a bug.'
      ],
      how: [
        'Start a notebook "w6_day2_pandas_basics.ipynb". Paste the example data (a CSV text inside a string). [10 min]',
        'Run read_csv, head, info, describe, shape. Write one markdown line under each saying what you learned. [15 min]',
        'Practice selecting: one column, two columns, new column revenue. [10 min]',
        'Practice filters: single condition, two conditions with &amp;, isin(), and between(). [20 min]',
        'Practice loc vs iloc with the same selection written both ways. [15 min]',
        'Sort and value_counts. Then download any small CSV from Kaggle, load it, and repeat the five first-look commands. [20 min]'
      ],
      example: `<p>Real files use <code>pd.read_csv('orders.csv')</code>. To make the example runnable we put the CSV text inside Python:</p>
${pre(`import pandas as pd
from io import StringIO

csv = """order_id,customer,region,category,qty,price,order_date
101,Asha,South,Tech,2,500,2024-01-05
102,Ravi,North,Furniture,1,1200,2024-01-09
103,Asha,South,Tech,3,450,2024-02-02
104,Meena,West,Office,10,20,2024-02-14
105,Ravi,North,Tech,1,800,2024-03-01
106,Asha,South,Office,5,25,2024-03-11
107,Kiran,East,Furniture,2,900,2024-03-20
108,Meena,West,Tech,1,650,2024-03-25
"""
df = pd.read_csv(StringIO(csv))
print(df.shape)                      # (8, 7)
print(df.head(3))
#    order_id customer region   category  qty  price  order_date
# 0       101     Asha  South       Tech    2    500  2024-01-05
# 1       102     Ravi  North  Furniture    1   1200  2024-01-09
# 2       103     Asha  South       Tech    3    450  2024-02-02

df['revenue'] = df['qty'] * df['price']

print(df.loc[df['revenue'] > 1000, ['order_id', 'customer', 'revenue']])
#    order_id customer  revenue
# 1       102     Ravi     1200
# 2       103     Asha     1350
# 6       107    Kiran     1800

print(df.loc[(df['region'] == 'South') & (df['category'] == 'Tech')])
# rows 0 and 2 (order 101 and 103, both Asha)

print(df.iloc[0:3, 0:3])             # first 3 rows, first 3 columns
#    order_id customer region
# 0       101     Asha  South
# 1       102     Ravi  North
# 2       103     Asha  South

print(df.sort_values('revenue', ascending=False).head(3)[['order_id', 'revenue']])
#    order_id  revenue
# 6       107     1800
# 2       103     1350
# 1       102     1200

print(df['category'].value_counts())   # Tech 4, Furniture 2, Office 2
print(df['customer'].nunique())        # 4`)}
<p><b>Explain.</b> <code>df['qty'] * df['price']</code> multiplies the two columns row by row (this is "vectorised": no loop needed). <code>df.loc[mask, cols]</code> keeps the rows where the mask is True and only the listed columns. In the two-condition filter each condition is in brackets and joined with <code>&amp;</code>. <code>iloc[0:3, 0:3]</code> uses positions, so it stops before 3. Both <code>loc</code> and <code>iloc</code> can give the same result on this default index, but loc will follow labels even if you change the index. Example: <code>df.set_index('order_id').loc[103, 'revenue']</code> returns 1350.</p>`,
      practice: [
        ['Show the number of rows and columns, and the data type of every column.', `${pre(`print(df.shape)    # (8, 8) after adding revenue
print(df.dtypes)
df.info()`)}<p>shape gives (rows, columns). info() also shows non-null counts, which tells you where data is missing.</p>`],
        ['Select orders with category Tech or Office using isin().', `${pre(`df[df['category'].isin(['Tech', 'Office'])]   # 6 rows`)}<p>isin is cleaner than writing several == conditions joined with |.</p>`],
        ['Select orders in South or West with revenue of at least 500, showing only order_id, region, revenue.', `${pre(`df.loc[df['region'].isin(['South', 'West']) & (df['revenue'] >= 500),
       ['order_id', 'region', 'revenue']]`)}<p>Result: orders 101 (1000), 103 (1350), 108 (650). Order 104 (200) and 106 (125) fail the revenue test.</p>`],
        ['What is the difference between loc and iloc? Show the same selection with both.', `${pre(`df.loc[0:2, ['customer', 'revenue']]    # rows with labels 0,1,2 (end INCLUDED)
df.iloc[0:3, [1, 7]]                  # positions 0,1,2 (end EXCLUDED)`)}<p>loc is label-based and includes the end label; iloc is position-based and excludes the end. This is a very common interview question.</p>`],
        ['Find the top 3 customers by total revenue (preview of groupby).', `${pre(`df.groupby('customer')['revenue'].sum().sort_values(ascending=False).head(3)
# Asha 2475, Ravi 2000, Kiran 1800`)}<p>Group by customer, add up revenue, sort descending, keep 3. Asha = 1000 + 1350 + 125 = 2475.</p>`],
        ['Why does df[df.revenue > 100 and df.qty > 1] fail? Fix it.', `<p>Python "and" tries to turn a whole Series into one True/False and raises a ValueError. Use element-wise <code>&amp;</code> and brackets: <code>df[(df.revenue &gt; 100) &amp; (df.qty &gt; 1)]</code>.</p>`]
      ],
      important: [
        ['loc vs iloc?', `<p>loc selects by label and accepts boolean masks, and label slices include the end. iloc selects by integer position and the end is excluded. I use loc for most analysis, for example df.loc[df.sales &gt; 100, "region"], and iloc for "first n rows" type tasks.</p>`],
        ['How do you quickly understand a new dataset in pandas?', `<p>I run shape, head, info, describe, and isna().sum(). Then value_counts on categorical columns, nunique for IDs, and check min and max of numeric and date columns. This tells me the size, types, missing values, and obvious problems before any analysis.</p>`],
        ['What is a vectorised operation and why is it better than a loop?', `<p>It applies an operation to a whole column at once, such as df["a"] * df["b"]. It runs in optimised C code, so it is much faster and shorter than a Python for loop or apply on rows. I use apply only when no built-in vectorised way exists.</p>`]
      ],
      resources: [['pandas: 10 minutes', 'https://pandas.pydata.org/docs/user_guide/10min.html'], ['Kaggle Learn (Python, Pandas)', 'https://www.kaggle.com/learn']],
      done: 'You are done when you can load a CSV, do the five first-look commands, filter with two conditions, and explain loc vs iloc.'
    },
    /* ---------------- WED ---------------- */
    {
      title: 'Cleaning data: nulls, duplicates, types, strings, dates',
      time: '1.5 h',
      study: [
        'Find missing values: df.isnull().sum() (count per column) or df.isna().mean() (share per column).',
        'Fill: df["age"].fillna(df["age"].median()). Numeric columns often use median (robust to outliers); categories often use the mode or the word "Unknown". Drop: df.dropna(subset=["col"]) removes rows where that column is missing.',
        'Duplicates: df.duplicated().sum() counts them; df.drop_duplicates() removes them (subset=[...] to decide by key columns, keep="first" or "last").',
        'Fix types: df["col"].astype(int). If a column has text mixed in, use pd.to_numeric(df["col"], errors="coerce"): bad values become NaN instead of crashing.',
        'Text cleaning: df["name"].str.strip().str.title(), str.lower(), str.replace(",", ""), str.contains("abc"), str.split(" ", expand=True).',
        'Dates: pd.to_datetime(df["date"], errors="coerce") then use df["date"].dt.year, .dt.month, .dt.day_name(). Invalid dates become NaT (missing).',
        'Cleaning order: look first, fix text, remove duplicates, fix types, handle missing values, check outliers, and log what you changed. Never overwrite the raw data; work on a copy.'
      ],
      how: [
        'New notebook "w6_day3_cleaning.ipynb". Paste the messy table from the example. Keep it as raw and make df = raw.copy(). [10 min]',
        'Run isnull().sum(), duplicated().sum(), dtypes. Write down every problem you see in a markdown cell. [10 min]',
        'Fix text columns first (strip, title) because it exposes hidden duplicates. [10 min]',
        'Drop duplicates, then convert amount and signup with to_numeric and to_datetime using errors="coerce". [15 min]',
        'Handle missing values: fill age with the median, drop rows with no name. Explain the choice in one markdown line. [15 min]',
        'Do the practice questions on the same table. Then clean any real Kaggle file the same way and list the issues you found. [25 min]',
        'Write a "cleaning log" table: issue, count, action. You will reuse it in every project README. [5 min]'
      ],
      example: `<p>A small messy table. It has extra spaces, mixed case, a duplicate, a missing name, a wrong age (230), numbers stored as text with commas and "n/a", and an invalid date.</p>
${pre(`import pandas as pd
import numpy as np

raw = pd.DataFrame({
    'name':   ['  asha ', 'RAVI', 'Asha ', 'Meena', None, 'Kiran'],
    'city':   ['pune', 'Delhi', 'pune', 'Mumbai', 'Delhi', 'delhi'],
    'age':    [28, 35, 28, np.nan, 41, 230],
    'amount': ['1,200', '800', '1,200', '950', 'n/a', '400'],
    'signup': ['2024-01-05', '2024-02-10', '2024-01-05', '2024-03-15', '2024-13-40', '2024-04-01'],
})
print(raw.isnull().sum())     # name 1, city 0, age 1, amount 0, signup 0

df = raw.copy()
df['name'] = df['name'].str.strip().str.title()    # 'asha' -> 'Asha'
df['city'] = df['city'].str.title()
print(df.duplicated().sum())                       # 1  (rows 0 and 2 now identical)
df = df.drop_duplicates()
print(df.shape)                                    # (5, 5)

df['amount'] = pd.to_numeric(df['amount'].str.replace(',', ''), errors='coerce')
df['signup'] = pd.to_datetime(df['signup'], errors='coerce')
print(df.dtypes)    # amount float64, signup datetime64

df['age'] = df['age'].fillna(df['age'].median())   # median of 28,35,41,230 = 38
df = df.dropna(subset=['name'])                    # drop the row with no name
df['age'] = df['age'].astype(int)
print(df)
#     name    city  age  amount     signup
# 0   Asha    Pune   28  1200.0 2024-01-05
# 1   Ravi   Delhi   35   800.0 2024-02-10
# 3  Meena  Mumbai   38   950.0 2024-03-15
# 5  Kiran   Delhi  230   400.0 2024-04-01`)}
<p><b>Explain.</b> The duplicate was hidden: "  asha " and "Asha " look different until you strip and fix the case, so always clean text first. <code>errors='coerce'</code> turned "n/a" and the impossible date 2024-13-40 into NaN/NaT (missing), instead of stopping with an error. We filled age with the median because it is not pulled by the extreme 230. But 230 is still wrong: that is an outlier or typo, handled in Saturday's outlier function. The median for Meena (38) is a guess; in a real project record that you imputed it. After dropna the row with a missing name is gone, which is why index 4 disappears.</p>`,
      practice: [
        ['What percentage of each column is missing?', `${pre(`(raw.isnull().mean() * 100).round(1)
# name 16.7, city 0.0, age 16.7, amount 0.0, signup 0.0`)}<p>isnull() gives True/False; mean of True/False is the share of True.</p>`],
        ['Make city names consistent in capitalisation and trim spaces.', `${pre(`df['city'] = df['city'].str.strip().str.title()`)}<p>Different spellings like "delhi" and "Delhi" would otherwise be treated as two cities in groupby.</p>`],
        ['Convert amount text like "1,200" and "n/a" to numbers without errors.', `${pre(`df['amount'] = pd.to_numeric(df['amount'].str.replace(',', ''), errors='coerce')`)}<p>Remove commas first, then coerce. "n/a" becomes NaN, which you can then fill or drop.</p>`],
        ['Create a column signup_month with the month name, and count signups per month.', `${pre(`df['signup_month'] = df['signup'].dt.month_name()
print(df['signup_month'].value_counts())`)}<p>The .dt accessor works only on datetime columns, so convert with to_datetime first. NaT rows are ignored.</p>`],
        ['Remove duplicates by key: keep the latest row per name when there is a date column.', `${pre(`df = df.sort_values('signup').drop_duplicates(subset='name', keep='last')`)}<p>Sort so the newest row is last, then keep='last' keeps it. This is the pandas version of ROW_NUMBER() = 1 in SQL.</p>`],
        ['Fill missing city with "Unknown" and missing amount with the median amount of that city.', `${pre(`df['city'] = df['city'].fillna('Unknown')
df['amount'] = df['amount'].fillna(df.groupby('city')['amount'].transform('median'))`)}<p>transform('median') returns a column the same length as df, with each row's group median, so fillna can match row by row.</p>`]
      ],
      important: [
        ['How do you handle missing values?', `<p>First I find out why they are missing and how many: isnull().sum(). If very few and random, I drop those rows. For numeric columns I often fill with the median (robust to outliers), for categories with the mode or "Unknown". If a lot is missing, I consider dropping the column or flagging it. I always record what I did, because filling changes the distribution.</p>`],
        ['How do you remove duplicates in pandas?', `<p>df.drop_duplicates() removes fully identical rows. With subset=[key columns] I decide duplicates by a key like order_id, and keep="first" or "last" chooses which row stays. I clean text (strip, case) before, because "Asha " and "asha" would not match.</p>`],
        ['What does errors="coerce" do?', `<p>In to_numeric and to_datetime it turns values that cannot be converted into NaN or NaT instead of raising an error. Then I can count and review those rows. It is useful for messy real data.</p>`],
        ['median or mean for filling missing numbers?', `<p>Median when the data is skewed or has outliers (income, order value), mean when it is roughly symmetric. Median is the safer default.</p>`]
      ],
      resources: [['pandas: 10 minutes', 'https://pandas.pydata.org/docs/user_guide/10min.html'], ['Kaggle Learn (Python, Pandas)', 'https://www.kaggle.com/learn']],
      done: 'You are done when you can clean the messy table (text, duplicates, types, missing values, dates) in one pass and write a cleaning log.'
    },
    /* ---------------- THU ---------------- */
    {
      title: 'groupby, pivot_table, merge/concat, apply/map, sessions',
      time: '1.5 h',
      study: [
        'groupby splits rows into groups, aggregates each group, and combines the result. Named aggregation: df.groupby("region").agg(total=("revenue","sum"), orders=("order_id","count")).',
        'reset_index() turns the group labels back into normal columns. transform("sum") returns a value for every original row (for "percent of group").',
        'pivot_table(index, columns, values, aggfunc, fill_value) makes an Excel-style summary. It is groupby plus reshaping.',
        'merge joins tables on a key column, like SQL: how="inner", "left", "right", "outer". join joins on the index. concat stacks tables on top of each other (axis=0) or side by side (axis=1).',
        'After a merge, always check df.shape and look for duplicated keys: a many-to-many merge multiplies rows. Use indicator=True to see which side each row came from.',
        'apply runs a function on each value or row; map replaces values using a dict. They are slower than vectorised code, so use vectorised operations (or np.where) when possible.',
        'Session problem: sort by user and time, find the gap to the previous event with groupby + diff, start a new session when the gap is above a limit (for example 30 minutes), use cumsum to number sessions, then take max minus min time.'
      ],
      how: [
        'New notebook "w6_day4_groupby_merge.ipynb". Paste the orders and customers tables. [10 min]',
        'Type the groupby/agg example. Then group by two columns. [10 min]',
        'Type pivot_table and compare it with the groupby result. [10 min]',
        'Do merge with how="left", "inner", "outer" and indicator=True. Predict the row counts first. [15 min]',
        'Do concat, map and apply. Then rewrite the apply with np.where to see the vectorised way. [10 min]',
        'Do the sessions problem step by step; print the table after each step. [25 min]',
        'Do the practice questions. Skip to the next only after you can explain each answer aloud. [10 min]'
      ],
      example: `<p><b>Part A: groupby, pivot, merge.</b></p>
${pre(`import pandas as pd, numpy as np

orders = pd.DataFrame({
    'order_id':    [101, 102, 103, 104, 105, 106],
    'customer_id': [1, 2, 1, 3, 2, 4],
    'region':      ['South', 'North', 'South', 'West', 'North', 'East'],
    'category':    ['Tech', 'Furniture', 'Tech', 'Office', 'Tech', 'Furniture'],
    'revenue':     [1000, 1200, 1350, 200, 800, 1800],
})
customers = pd.DataFrame({'customer_id': [1, 2, 3, 5],
                          'name': ['Asha', 'Ravi', 'Meena', 'Zoya']})

g = orders.groupby('region').agg(total_rev=('revenue', 'sum'),
                                 orders=('order_id', 'count'),
                                 avg_rev=('revenue', 'mean')).reset_index()
print(g)
#   region  total_rev  orders  avg_rev
# 0   East       1800       1   1800.0
# 1  North       2000       2   1000.0
# 2  South       2350       2   1175.0
# 3   West        200       1    200.0

print(orders.pivot_table(index='region', columns='category',
                         values='revenue', aggfunc='sum', fill_value=0))
# category  Furniture  Office  Tech
# East           1800       0     0
# North          1200       0   800
# South             0       0  2350
# West              0     200     0

left = orders.merge(customers, on='customer_id', how='left')
print(left[['order_id', 'customer_id', 'name']])   # order 106 (customer 4): name NaN
print(orders.merge(customers, on='customer_id', how='inner').shape)   # (5, 6)
out = orders.merge(customers, on='customer_id', how='outer', indicator=True)
print(out['_merge'].value_counts())   # both 5, left_only 1, right_only 1

more = pd.DataFrame({'order_id': [107], 'customer_id': [3], 'region': ['West'],
                     'category': ['Tech'], 'revenue': [650]})
print(pd.concat([orders, more], ignore_index=True).shape)   # (7, 5)

orders['size'] = np.where(orders['revenue'] >= 1000, 'Big', 'Small')   # vectorised
orders['pct_of_region'] = orders['revenue'] / orders.groupby('region')['revenue'].transform('sum')
print(orders[['order_id', 'region', 'pct_of_region']].round(2))
# 101 South 0.43, 102 North 0.60, 103 South 0.57, 104 West 1.00, 105 North 0.40, 106 East 1.00`)}
<p><b>Part B: the classic "group sessions by user and compute session duration" problem.</b></p>
${pre(`ev = pd.DataFrame({
    'user': ['u1', 'u1', 'u1', 'u2', 'u2', 'u2', 'u3'],
    'ts': pd.to_datetime(['2024-05-01 10:00', '2024-05-01 10:12', '2024-05-01 10:30',
                          '2024-05-01 11:00', '2024-05-01 11:05', '2024-05-01 12:00',
                          '2024-05-01 12:00'])
})
ev = ev.sort_values(['user', 'ts'])
ev['gap'] = ev.groupby('user')['ts'].diff()                          # time since previous event
ev['new'] = ev['gap'].isna() | (ev['gap'] > pd.Timedelta(minutes=30))   # new session?
ev['session'] = ev.groupby('user')['new'].cumsum()                   # session number per user
print(ev[['user', 'ts', 'gap', 'new', 'session']])
#   user                  ts             gap    new  session
# 0   u1 2024-05-01 10:00:00             NaT   True        1
# 1   u1 2024-05-01 10:12:00 0 days 00:12:00  False        1
# 2   u1 2024-05-01 10:30:00 0 days 00:18:00  False        1
# 3   u2 2024-05-01 11:00:00             NaT   True        1
# 4   u2 2024-05-01 11:05:00 0 days 00:05:00  False        1
# 5   u2 2024-05-01 12:00:00 0 days 00:55:00   True        2
# 6   u3 2024-05-01 12:00:00             NaT   True        1

ses = ev.groupby(['user', 'session']).agg(start=('ts', 'min'), end=('ts', 'max'),
                                          events=('ts', 'size')).reset_index()
ses['duration_min'] = (ses['end'] - ses['start']).dt.total_seconds() / 60
print(ses[['user', 'session', 'events', 'duration_min']])
#   user  session  events  duration_min
# 0   u1        1       3          30.0
# 1   u2        1       2           5.0
# 2   u2        2       1           0.0
# 3   u3        1       1           0.0`)}
<p><b>Explain the session logic in simple words.</b> (1) Sort so each user's events are in time order. (2) <code>diff()</code> inside each user gives the wait since the previous event; the first event has no previous one (NaT). (3) A new session starts at the first event or after a gap of more than 30 minutes. (4) <code>cumsum()</code> on True/False counts the starts, so each event gets its session number (True counts as 1). (5) Group by user and session, and duration is last time minus first time. User u2 has a 55-minute gap, so the 12:00 event is a second session. It is the same idea as the SQL pattern LAG + SUM() OVER. If the question just says "session = one user on one day", simply group by user and the date: <code>ev.groupby(['user', ev['ts'].dt.date])</code>.</p>`,
      practice: [
        ['Total revenue and number of orders per region, sorted by revenue descending.', `${pre(`orders.groupby('region').agg(total_rev=('revenue', 'sum'),
                              orders=('order_id', 'count')) \\
      .sort_values('total_rev', ascending=False).reset_index()`)}<p>Named aggregation gives readable column names. Result order: South 2350, North 2000, East 1800, West 200.</p>`],
        ['Which customers have more than one order?', `${pre(`c = orders.groupby('customer_id')['order_id'].count()
print(c[c > 1])     # customer 1 -> 2, customer 2 -> 2`)}<p>Count orders per customer, then filter the resulting Series with a condition.</p>`],
        ['Customers who have never ordered (anti join). Use customers and orders.', `${pre(`m = customers.merge(orders, on='customer_id', how='left', indicator=True)
print(m[m['_merge'] == 'left_only'][['customer_id', 'name']])   # customer 5 Zoya`)}<p>A left merge keeps all customers; rows with no matching order are marked left_only. SQL equivalent: LEFT JOIN ... WHERE o.customer_id IS NULL.</p>`],
        ['Highest-revenue order in each region.', `${pre(`top = orders.sort_values('revenue', ascending=False).groupby('region').head(1)
print(top[['region', 'order_id', 'revenue']])
# East 106 1800, South 103 1350, North 102 1200, West 104 200`)}<p>Sort first, then head(1) per group takes the top row. Alternative: orders.loc[orders.groupby('region')['revenue'].idxmax()].</p>`],
        ['Join result has more rows than expected. Give two reasons and a check.', `<p>The key is not unique in one table (duplicate customer_id in customers), so one order matches several rows (a one-to-many or many-to-many join). Or you used an outer join, which adds unmatched rows. Check: <code>customers['customer_id'].is_unique</code>, compare shapes before and after, and use <code>merge(..., validate='many_to_one')</code> to make pandas raise an error if the key is duplicated.</p>`],
        ['Per user, find the total time spent over all sessions, using the session table ses above.', `${pre(`print(ses.groupby('user')['duration_min'].sum())
# u1 30.0, u2 5.0, u3 0.0`)}<p>Sum of session durations per user. Idle time between sessions is not counted, which is what we want.</p>`]
      ],
      important: [
        ['What is the difference between merge, join and concat in pandas?', `<p>merge is a SQL-style join on column values with how = inner, left, right or outer. join is a shortcut that joins on the index. concat just stacks DataFrames one below the other (axis 0) or side by side (axis 1) without matching on keys, like UNION ALL.</p>`],
        ['How would you compute session duration per user from event timestamps?', `<p>Sort by user and time, use groupby plus diff to get the gap to the previous event, flag a new session when the gap is larger than a limit like 30 minutes or when it is the first event, cumsum those flags to get a session number, and then take max time minus min time per user and session.</p>`],
        ['apply vs vectorised operations?', `<p>Vectorised operations work on whole columns in compiled code and are fast. apply runs a Python function row by row or value by value and is slower. I use vectorised code, np.where or map first, and apply only for complex logic with no built-in way.</p>`],
        ['groupby vs pivot_table?', `<p>groupby aggregates in a long format with one row per group. pivot_table does the same aggregation but spreads one grouping into columns, like an Excel pivot, and supports fill_value and margins. Under the hood pivot_table uses groupby.</p>`]
      ],
      resources: [['pandas: 10 minutes', 'https://pandas.pydata.org/docs/user_guide/10min.html'], ['Kaggle Learn (Python, Pandas)', 'https://www.kaggle.com/learn']],
      done: 'You are done when you can do groupby with named aggregation, a pivot_table, a left merge with indicator, and the session-duration problem without looking.'
    },
    /* ---------------- FRI ---------------- */
    {
      title: 'Visualisation with matplotlib and seaborn',
      time: '1.5 h',
      study: [
        'matplotlib is the base plotting library; seaborn is built on it and makes nicer statistical charts with less code. Import: import matplotlib.pyplot as plt; import seaborn as sns.',
        'Choose the chart by the question: histogram = distribution of one number; bar = compare categories; line = trend over time; box plot = spread and outliers per group; scatter = relationship of two numbers; heatmap = correlation matrix or a two-way table.',
        'Make a figure with several charts: fig, ax = plt.subplots(2, 2, figsize=(10, 7)), then pass ax=ax[0,0] to each seaborn call.',
        'Every chart needs a title, readable axis labels, and (if more than one colour) a legend. Finish with plt.tight_layout() and plt.show() (or plt.savefig("name.png")).',
        'sns.histplot(data=df, x="col", bins=10); sns.barplot(data=df, x="cat", y="val") (shows the mean by default); sns.boxplot(...); sns.scatterplot(..., hue="group"); sns.heatmap(df.corr(), annot=True).',
        'A line chart for time: group by month first (df.groupby("month")["sales"].sum().plot()). Convert dates with to_datetime before.',
        'Optional: plotly.express (px.bar, px.line, px.scatter) makes interactive charts with hover; same data, one line each. Good for notebooks, but matplotlib/seaborn is enough for interviews.'
      ],
      how: [
        'Notebook "w6_day5_charts.ipynb". Paste the example data. Add %matplotlib inline in the first cell if charts do not show. [5 min]',
        'Draw the four charts from the example one by one. Add a title and axis labels to each. [25 min]',
        'Draw the heatmap of correlations. Describe in one markdown sentence what it shows. [10 min]',
        'Make a 2x2 grid with subplots and save it as a PNG. [15 min]',
        'Take a column from a Kaggle dataset and choose the right chart for 3 different questions. Write the question above each chart. [25 min]',
        'Optional (10 min): recreate one chart with plotly.express and hover over the points.',
        'Answer the practice questions. [10 min]'
      ],
      example: `<p>Small customer table. Run it to see the charts; the printed numbers are shown below.</p>
${pre(`import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

sat = pd.DataFrame({
    'class':     ['Eco', 'Eco', 'Business', 'Business', 'Eco', 'Business', 'Eco', 'Business'],
    'wifi':      [2, 3, 4, 5, 1, 4, 3, 5],
    'delay':     [10, 0, 5, 0, 45, 2, 20, 1],
    'satisfied': [0, 0, 1, 1, 0, 1, 0, 1],
})

fig, ax = plt.subplots(2, 2, figsize=(10, 7))
sns.histplot(data=sat, x='delay', bins=5, ax=ax[0, 0])
ax[0, 0].set_title('Distribution of delay (minutes)')

sns.barplot(data=sat, x='class', y='satisfied', ax=ax[0, 1])
ax[0, 1].set_title('Share satisfied by class')
ax[0, 1].set_ylabel('Share satisfied')

sns.boxplot(data=sat, x='class', y='delay', ax=ax[1, 0])
ax[1, 0].set_title('Delay by class')

sns.scatterplot(data=sat, x='delay', y='wifi', hue='class', ax=ax[1, 1])
ax[1, 1].set_title('Wifi rating vs delay')

plt.tight_layout()
plt.savefig('charts.png')      # or plt.show()

plt.figure()
sns.heatmap(sat[['wifi', 'delay', 'satisfied']].corr(), annot=True, cmap='coolwarm', vmin=-1, vmax=1)
plt.title('Correlation matrix')
plt.show()

print(sat[['wifi', 'delay', 'satisfied']].corr().round(2))
#            wifi  delay  satisfied
# wifi       1.00  -0.80       0.85
# delay     -0.80   1.00      -0.58
# satisfied  0.85  -0.58       1.00
print(sat.groupby('class')['satisfied'].mean())     # Business 1.0, Eco 0.0`)}
<p><b>Read the charts.</b> The bar chart shows Business customers are all satisfied here and Economy customers none (toy data!). The heatmap shows wifi rating has a strong positive link with satisfaction (0.85) and delay a negative one (-0.58). The box plot would show economy delays are bigger. Say it like an analyst: "Satisfaction is higher where wifi is rated higher and where delays are shorter. In this tiny sample the link is clear; on real data I would test it." And always remember that a correlation does not prove a cause.</p>
<p><b>Line chart for a trend (needs a date column):</b></p>
${pre(`monthly = df.groupby(df['order_date'].dt.to_period('M'))['revenue'].sum()
monthly.plot(kind='line', marker='o', title='Revenue by month')
plt.ylabel('Revenue'); plt.show()`)}
<p>Here <code>df</code> is the orders table from Tuesday with order_date converted by <code>pd.to_datetime</code>. <code>to_period('M')</code> groups by month.</p>`,
      practice: [
        ['Which chart would you use for: (a) age distribution, (b) average spend per plan, (c) monthly sales trend, (d) spread of delivery time per city, (e) price vs quantity?', `<p>(a) histogram, (b) bar chart, (c) line chart, (d) box plot, (e) scatter plot.</p>`],
        ['Plot a histogram of monthly_spend with 5 bins and a title.', `${pre(`sns.histplot(data=df, x='monthly_spend', bins=5)
plt.title('Monthly spend distribution')
plt.show()`)}<p>Bins group values into ranges; too few bins hide the shape, too many make noise.</p>`],
        ['Show the correlation matrix of numeric columns as an annotated heatmap.', `${pre(`sns.heatmap(df.select_dtypes('number').corr(), annot=True, cmap='coolwarm', vmin=-1, vmax=1)
plt.show()`)}<p>select_dtypes keeps only numeric columns. vmin and vmax fix the colour scale from -1 to 1 so colours are comparable.</p>`],
        ['Make a bar chart of total revenue by category sorted from high to low.', `${pre(`order = df.groupby('category')['revenue'].sum().sort_values(ascending=False)
sns.barplot(x=order.index, y=order.values)
plt.ylabel('Revenue'); plt.show()`)}<p>Sorted bars are easier to read. Use order.index for the labels and order.values for the heights.</p>`],
        ['Your bar chart shows "satisfied" as 0.5 for Economy. A manager asks what it means. What do you change?', `<p>The bar shows the mean of a 0/1 column, which is the share satisfied: 50%. Change the y-axis label to "Share satisfied (%)" (multiply by 100 or format as percent), add a title that states the message, and show the number of respondents n.</p>`],
        ['What is wrong with a pie chart of 12 categories, and what do you use instead?', `<p>Humans cannot compare 12 slice angles. Use a sorted horizontal bar chart. If you need part-of-whole, group small categories into "Other" first.</p>`]
      ],
      important: [
        ['How do you choose the right chart?', `<p>I start from the question. One number's distribution: histogram. Compare categories: sorted bar. Trend over time: line. Spread and outliers by group: box plot. Relationship between two numbers: scatter. Correlations or two-way tables: heatmap. I avoid pie charts with many slices and 3D charts.</p>`],
        ['What is the difference between matplotlib and seaborn?', `<p>matplotlib is the low-level base library giving full control. seaborn sits on top of it and works directly with DataFrames, gives good default styling and statistical charts such as box plots, histograms with density, and heatmaps in one line. I use seaborn for speed and matplotlib to adjust titles, labels and layout.</p>`],
        ['What does a box plot show?', `<p>The median (line in the box), the 25th and 75th percentiles (box edges, so the box is the IQR), whiskers for the range within 1.5 x IQR, and dots for outliers. It is the quickest way to compare spread and spot outliers between groups.</p>`]
      ],
      resources: [['Kaggle Learn (Python, Pandas)', 'https://www.kaggle.com/learn'], ['pandas: 10 minutes', 'https://pandas.pydata.org/docs/user_guide/10min.html']],
      done: 'You are done when you can draw a histogram, bar, line, box, scatter and heatmap from a DataFrame and say which question each one answers.'
    },
    /* ---------------- SAT ---------------- */
    {
      title: 'End-to-end EDA notebook and the outlier function',
      time: '3.5 h',
      study: [
        'EDA = exploratory data analysis: a structured first look at a dataset to find its shape, quality problems, patterns, and questions worth answering. It is not just charts; it ends with written insights.',
        'The standard flow: (1) load and look, (2) clean, (3) ask 3-5 questions, (4) answer each with a table and a chart, (5) write insights and next steps. Keep the notebook in that order with markdown headings.',
        'Outliers are values far from the rest. IQR rule: below Q1 - 1.5 x IQR or above Q3 + 1.5 x IQR. Z-score rule: more than 3 standard deviations from the mean. IQR works for skewed data; z-score assumes a roughly normal shape.',
        'Do not delete an outlier blindly. Ask: is it a data error (age 230), a real extreme (a huge order), or a different group? Fix errors, keep or cap real values, and report what you did.',
        'Z-score warning: with few rows the maximum possible z-score is small (with 10 points it cannot reach 3), so z = 3 finds nothing. IQR is safer on small samples.',
        'Every claim in your notebook should have a number. "Basic plan churn is 83% vs 0% for Pro" is an insight; "churn looks different" is not.',
        'Pick any Kaggle dataset (for example the Airline Passenger Satisfaction file used in Project 1, or one from Maven Analytics or Kaggle Datasets). The steps below work for any CSV.'
      ],
      how: [
        'Pick the Kaggle dataset (1,000 to 100,000 rows is ideal). Create a notebook "eda_<datasetname>.ipynb" with headings: 1 Load, 2 Clean, 3 Questions, 4 Analysis, 5 Insights. [10 min]',
        'Load and look: shape, head, info, describe, isnull().sum(), duplicated().sum(), value_counts on categories. Write the problems found. [25 min]',
        'Clean: apply Wednesday steps. Write a cleaning log in a markdown cell. [30 min]',
        'Write 4 specific questions in markdown (for example: which plan has the highest churn? what drives support calls?). [10 min]',
        'Answer each question with a groupby or crosstab table AND one chart. Put one sentence of interpretation under each. [60 min]',
        'Write the outlier function (below), test it on the toy data, then apply it to one numeric column of your dataset and compare mean and median before and after. [30 min]',
        'Write the Insights section: 3 findings with numbers and 2 suggested actions. Add a "Limitations" line. [20 min]',
        'Run Kernel > Restart and Run All to check the notebook runs from top to bottom. Save, and push to GitHub in a folder "python-eda". [20 min]'
      ],
      example: `<p><b>Part A: the outlier function</b> (a top interview request). Expected outputs shown.</p>
${pre(`import pandas as pd
import numpy as np

def remove_outliers(df, col, method='iqr', thresh=None):
    """Return df without outliers in column col.
    method='iqr': keep values within [Q1 - k*IQR, Q3 + k*IQR], k defaults to 1.5
    method='z'  : keep values with |z-score| <= z, z defaults to 3
    """
    if method == 'iqr':
        k = 1.5 if thresh is None else thresh
        q1, q3 = df[col].quantile([0.25, 0.75])
        iqr = q3 - q1
        mask = df[col].between(q1 - k * iqr, q3 + k * iqr)
    elif method == 'z':
        z = 3 if thresh is None else thresh
        mask = ((df[col] - df[col].mean()) / df[col].std()).abs() <= z
    else:
        raise ValueError("method must be 'iqr' or 'z'")
    return df[mask]

d = pd.DataFrame({'id': range(1, 11),
                  'amount': [100, 110, 95, 105, 120, 98, 102, 115, 108, 900]})
print(d['amount'].quantile([0.25, 0.75]).tolist())   # [100.5, 113.75]
print(remove_outliers(d, 'amount').shape)            # (9, 2)  IQR removes the 900
print(remove_outliers(d, 'amount', 'z').shape)       # (10, 2) z=3 removes NOTHING
print(remove_outliers(d, 'amount', 'z', 2.5).shape)  # (9, 2)`)}
<p><b>Explain.</b> Q1 = 100.5 and Q3 = 113.75, so IQR = 13.25. The upper fence is 113.75 + 1.5 x 13.25 = 133.6, so 900 is far above and removed. The z-score of 900 is 2.84: below 3, so the strict z = 3 rule keeps it. This is the small-sample effect (the extreme value itself inflates the standard deviation). With z = 2.5 it is removed. Lesson: tell the interviewer both methods and when each fails. <code>between(low, high)</code> returns True for values inside both limits, and <code>df[mask]</code> keeps those rows. Note that the function returns a new DataFrame and does not change the original.</p>
<p><b>Part B: a mini EDA</b> on an inline table (the same steps apply to the Kaggle file):</p>
${pre(`df = pd.DataFrame({
    'age':           [22, 25, 31, 38, 45, 52, 29, 34, 41, 60, 27, 230],
    'plan':          ['Basic','Basic','Pro','Pro','Pro','Basic','Basic','Pro','Pro','Basic','Basic','Pro'],
    'monthly_spend': [200, 250, 520, 610, 580, 180, 230, 600, 550, 150, 210, 640],
    'support_calls': [4, 5, 1, 0, 1, 6, 3, 1, 0, 7, 4, 1],
    'churned':       [1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0],
})
print(df.shape, df.isna().sum().sum(), df.duplicated().sum())   # (12, 5) 0 0
print(df['age'].describe().round(1)[['mean', '50%', 'max']])    # mean 52.8, median 36.0, max 230

df = df[df['age'].between(15, 100)].copy()   # age 230 is a data error: removed (.copy() avoids SettingWithCopyWarning in pandas 2.x)
print(df.shape)                          # (11, 5)

print(df.groupby('plan').agg(customers=('churned', 'size'),
                             churn_rate=('churned', 'mean'),
                             avg_spend=('monthly_spend', 'mean')).round(2))
#        customers  churn_rate  avg_spend
# plan
# Basic          6        0.83     203.33
# Pro            5        0.00     572.00

print(df[['age', 'monthly_spend', 'support_calls', 'churned']].corr().round(2)['churned'])
# age 0.07, monthly_spend -0.83, support_calls 0.81, churned 1.00`)}
<p><b>Insight written like an analyst:</b> "Basic-plan customers churn at 83% (5 of 6) against 0% for Pro (0 of 5). Churn goes together with more support calls (r = 0.81) and lower spend (r = -0.83). Suggested action: contact Basic customers after their second support call. Limitation: only 11 rows, so treat as a hypothesis." The mean age (52.8) was misleading because of the error 230, the median (36) was not: a good sentence for the interview.</p>
<p><b>Deliverable of the week:</b> one notebook that runs top to bottom, with at least 5 charts, 4 answered questions, the outlier function, and a written Insights section.</p>`,
      practice: [
        ['Write a function that removes outliers from a column using the IQR rule.', `${pre(`def iqr_filter(df, col, k=1.5):
    q1, q3 = df[col].quantile([0.25, 0.75])
    iqr = q3 - q1
    return df[df[col].between(q1 - k * iqr, q3 + k * iqr)]`)}<p>Compute Q1, Q3, the IQR, then keep values inside the fences.</p>`],
        ['Write a function that removes outliers using the z-score (threshold 3) without using scipy.', `${pre(`def z_filter(df, col, z=3):
    zs = (df[col] - df[col].mean()) / df[col].std()
    return df[zs.abs() <= z]`)}<p>The z-score says how many standard deviations a value is from the mean. Keep rows within the threshold.</p>`],
        ['Instead of removing outliers, cap them at the IQR fences (winsorising).', `${pre(`q1, q3 = df['x'].quantile([0.25, 0.75])
iqr = q3 - q1
df['x_capped'] = df['x'].clip(lower=q1 - 1.5 * iqr, upper=q3 + 1.5 * iqr)`)}<p>clip limits values to a range, so extreme values stay in the data but lose their pull on the mean.</p>`],
        ['In the toy df above, compute the churn rate by age_band (<30, 30-39, 40+).', `${pre(`df['age_band'] = pd.cut(df['age'], bins=[0, 29, 39, 100], labels=['<30', '30-39', '40+'])
print(df.groupby('age_band', observed=True)['churned'].mean().round(2))
# <30 0.75, 30-39 0.00, 40+ 0.50`)}<p>pd.cut turns a number into bands. With bins [0,29,39,100] the intervals are (0,29], (29,39], (39,100].</p>`],
        ['Show the effect of the outlier: mean and median of amount before and after remove_outliers on the toy data d.', `${pre(`print(d['amount'].mean(), d['amount'].median())            # 185.3 and 106.5
clean = remove_outliers(d, 'amount')
print(round(clean['amount'].mean(), 1), clean['amount'].median())   # 105.9 105.0`)}<p>One extreme value moved the mean from about 106 to 185, while the median barely changed. This is why median is robust.</p>`],
        ['Which of these is the better first step when you find age = 230: delete the row, cap it, or investigate?', `<p>Investigate first. Check the source: is it a typo (23 or 30?), a test record, or a unit error? If it is an obvious error and cannot be corrected, remove or set it to missing and note it in the cleaning log. If you cap, say that you did. Never silently change data.</p>`]
      ],
      important: [
        ['Write a function to remove outliers. How would you explain your choice of method?', `<p>I would write it with a method argument: IQR keeps values within Q1 minus 1.5 IQR and Q3 plus 1.5 IQR, and does not assume a normal shape; z-score keeps values within 3 standard deviations and suits roughly normal data. IQR is my default for skewed data and small samples. Before removing anything I check whether it is an error or a real value.</p>`],
        ['How do you detect and treat outliers?', `<p>Detect with box plots, IQR or z-score, and by looking at min and max. Then investigate. Errors are corrected or set to missing; real extremes can be kept, capped (winsorised), log-transformed, or analysed separately. I report both versions if the decision changes the result.</p>`],
        ['Walk me through how you do EDA on a new dataset.', `<p>Load and look at shape, types, missing values, duplicates. Clean the issues and log them. Write 3-5 questions tied to the business problem. Answer each with a summary table and a chart. Finish with insights that have numbers, recommendations, and limitations. I keep it in one notebook that runs from top to bottom.</p>`]
      ],
      resources: [['Kaggle Datasets', 'https://www.kaggle.com/datasets'], ['Maven Analytics Data Playground', 'https://mavenanalytics.io/data-playground'], ['Kaggle Learn (Python, Pandas)', 'https://www.kaggle.com/learn']],
      done: 'You are done when you have an EDA notebook that runs top to bottom with a cleaning log, 4 answered questions, 5+ charts, a working outlier function and a written insights section, pushed to GitHub.'
    },
    /* ---------------- SUN ---------------- */
    {
      title: 'Python Q&A review, 5 SQL problems, numpy and sklearn peek',
      time: '3.5 h',
      study: [
        'Review the Python / pandas section of the Interview Q&A page in this site. For each question, say the answer aloud in 30-60 seconds before reading the model answer.',
        'Pattern map: "remove outliers" = IQR/z function; "group sessions" = sort + diff + cumsum; "second highest" = sort_values + drop_duplicates or nlargest; "customers without orders" = left merge + indicator; "percent of group" = transform.',
        'SQL habit: 5 problems today. These are classic: top per group, no orders, running total, second highest, duplicates. Write the pandas version of two of them as well. It trains the SQL-to-pandas translation.',
        'Optional: numpy basics. An array is a fast, typed list: np.array([1,2,3]). Operations work on the whole array (a * 2, a.mean(), a[a > 2]). np.where(condition, x, y) is a vectorised if-else. Shape means rows and columns: a.shape.',
        'Advanced (skip if short on time): scikit-learn LinearRegression fits a line y = slope * x + intercept. For entry-level interviews you only need to say what it does; the code below is a 5-line peek.',
        'Weak-spot method: after the Q&A review mark each question green (can answer), yellow (partly), red (cannot). Re-do the reds tomorrow in your Week 7 warm-up.'
      ],
      how: [
        'Open the Interview Q&A page, Python section. For each question: cover the answer, speak, check. Mark green/yellow/red in your tracker. [40 min]',
        'Redo your 2 weakest pandas topics from the week (use your notebooks). Rewrite the outlier function and the session code from memory in a blank notebook. [40 min]',
        'Solve the 5 SQL problems in the practice section (create the tables in db-fiddle.com or your database from the example). [60 min]',
        'Write the pandas version of SQL problems 2 and 4. [20 min]',
        'Optional: numpy block and the numpy practice question. [15 min]',
        'Advanced (skip if short on time): run the scikit-learn peek and write 2 lines on what the slope means. [10 min]',
        'Write a 5-line "pandas cheat sheet" from memory: read, select, clean, groupby, merge. Save it for Week 12. [15 min]'
      ],
      example: `<p><b>Tables for the 5 SQL problems</b> (Postgres syntax; use db-fiddle.com):</p>
${pre(`CREATE TABLE customers (customer_id INT, name TEXT, region TEXT);
CREATE TABLE orders (order_id INT, customer_id INT, order_date DATE, amount INT);
INSERT INTO customers VALUES (1,'Asha','South'),(2,'Ravi','North'),
                             (3,'Meena','West'),(4,'Zoya','North');
INSERT INTO orders VALUES (101,1,'2024-01-05',1000),(102,2,'2024-01-09',1200),
  (103,1,'2024-02-02',1350),(104,3,'2024-02-14',200),(105,2,'2024-03-01',800);`)}
<p><b>pandas translation example</b> for "customers with no orders" (SQL problem 2):</p>
${pre(`import pandas as pd
customers = pd.DataFrame({'customer_id': [1, 2, 3, 4], 'name': ['Asha', 'Ravi', 'Meena', 'Zoya'],
                          'region': ['South', 'North', 'West', 'North']})
orders = pd.DataFrame({'order_id': [101, 102, 103, 104, 105], 'customer_id': [1, 2, 1, 3, 2],
                       'amount': [1000, 1200, 1350, 200, 800]})
m = customers.merge(orders, on='customer_id', how='left', indicator=True)
print(m.loc[m['_merge'] == 'left_only', ['customer_id', 'name']])   # 4 Zoya`)}
<p><b>Optional: numpy basics</b></p>
${pre(`import numpy as np
a = np.array([10, 20, 30, 40])
print(a.mean(), a.std().round(2), a.cumsum())   # 25.0 11.18 [ 10  30  60 100]
print(a[a > 15])                                # [20 30 40]
print(np.where(a > 25, 'high', 'low'))          # ['low' 'low' 'high' 'high']
m = np.array([[1, 2, 3], [4, 5, 6]])
print(m.shape, m.sum(axis=0), m.sum(axis=1))    # (2, 3) [5 7 9] [ 6 15]`)}
<p>axis=0 sums down the rows (one result per column); axis=1 sums across the columns (one result per row). Note: <code>a.std()</code> in numpy divides by n (population), while pandas <code>.std()</code> divides by n - 1 (sample) by default. This small difference is an interview favourite.</p>
<p><b>Advanced (skip if short on time): linear regression peek</b></p>
${pre(`import pandas as pd
from sklearn.linear_model import LinearRegression
data = pd.DataFrame({'ad_spend': [10, 20, 30, 40, 50], 'sales': [25, 45, 62, 85, 105]})
model = LinearRegression().fit(data[['ad_spend']], data['sales'])
print(round(model.coef_[0], 2), round(model.intercept_, 2))   # 2.0 4.4
print(round(model.score(data[['ad_spend']], data['sales']), 3))   # 0.998  (R squared)
print(model.predict(pd.DataFrame({'ad_spend': [60]})).round(1))   # [124.4]`)}
<p>Meaning: each extra unit of ad spend goes with about 2 more units of sales (slope 2.0), and the line explains 99.8% of the variation (R squared). It needs scikit-learn installed (pip install scikit-learn). Not needed for entry-level interviews; say "association, not proof of cause".</p>`,
      practice: [
        ['SQL 1: Top customer by total amount in each region.', `${pre(`WITH t AS (
  SELECT c.region, c.name, SUM(o.amount) AS total,
         RANK() OVER (PARTITION BY c.region ORDER BY SUM(o.amount) DESC) AS rnk
  FROM customers c JOIN orders o ON o.customer_id = c.customer_id
  GROUP BY c.region, c.name
)
SELECT region, name, total FROM t WHERE rnk = 1;`)}<p>Aggregate first, rank inside each region, keep rank 1. Result: South Asha 2350, North Ravi 2000, West Meena 200. (Zoya has no orders, so the inner join drops her.)</p>`],
        ['SQL 2: Customers who never placed an order.', `${pre(`SELECT c.customer_id, c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
WHERE o.order_id IS NULL;`)}<p>LEFT JOIN keeps all customers; unmatched ones have NULL order columns. Result: Zoya.</p>`],
        ['SQL 3: Running total of amount by order date.', `${pre(`SELECT order_id, order_date, amount,
       SUM(amount) OVER (ORDER BY order_date, order_id) AS running_total
FROM orders;`)}<p>SUM OVER with ORDER BY accumulates rows in date order. Values: 1000, 2200, 3550, 3750, 4550.</p>`],
        ['SQL 4: Second highest order amount.', `${pre(`SELECT DISTINCT amount
FROM orders
ORDER BY amount DESC
LIMIT 1 OFFSET 1;`)}<p>Sort descending, skip the first, take the next. Amounts are 1000, 1200, 1350, 200, 800, so the highest is 1350 and the result is 1200. DISTINCT makes sure ties do not count twice, so you get the second distinct value. DENSE_RANK() = 2 is the window-function alternative.</p>`],
        ['SQL 5: Find duplicate customer names (any table with possible repeats).', `${pre(`SELECT name, COUNT(*) AS cnt
FROM customers
GROUP BY name
HAVING COUNT(*) > 1;`)}<p>Group by the column, count each group, keep groups with more than one row. Returns no rows on this data (all names are unique).</p>`],
        ['Optional numpy: replace all values below 20 in np.array([5, 25, 15, 40]) by 20 (a floor).', `${pre(`a = np.array([5, 25, 15, 40])
print(np.where(a < 20, 20, a))   # [20 25 20 40]
print(np.maximum(a, 20))         # same result`)}<p>np.where is vectorised if-else: where the condition is true use 20, otherwise keep the original value.</p>`]
      ],
      important: [
        ['Pandas vs SQL: when would you use each?', `<p>SQL when the data is in a database, is large, and I need filters, joins and aggregations close to the source. pandas when I have a file or a query result and need flexible cleaning, reshaping, statistics, or charts in a notebook. In practice I pull the right slice with SQL and finish the analysis in pandas.</p>`],
        ['numpy vs pandas?', `<p>numpy gives fast n-dimensional arrays of one type and maths on them. pandas is built on numpy and adds labelled rows and columns, mixed types, missing-value handling, groupby, merge and date tools. numpy for numeric computation, pandas for tabular analysis.</p>`],
        ['What does the SettingWithCopyWarning mean?', `<p>It means you may be changing a copy of a slice and not the original. To avoid it, use df.loc[mask, "col"] = value for assignment, or take an explicit .copy() when you want an independent DataFrame. Note: pandas 3.x has copy-on-write, so this warning no longer appears; a filtered slice is always its own copy and chained assignment like df[mask]["col"] = value never changes the original (use df.loc[mask, "col"] = value).</p>`],
        ['How do you make your pandas code faster?', `<p>Use vectorised operations instead of loops and apply, choose proper dtypes (category for repeated text, smaller ints), read only the columns you need with usecols, and filter early. For very large data, process in chunks or use a database.</p>`]
      ],
      resources: [['Kaggle Learn (Python, Pandas)', 'https://www.kaggle.com/learn'], ['pandas: 10 minutes', 'https://pandas.pydata.org/docs/user_guide/10min.html'], ['DB Fiddle (run SQL online)', 'https://www.db-fiddle.com']],
      done: 'You are done when you have answered every Python Q&A aloud, solved the 5 SQL problems, and re-typed the outlier function and session code from memory.'
    }
  ]
};
