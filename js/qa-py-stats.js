/* Python/pandas and Statistics interview Q&A (overrides QA.py and QA.stats from data-qa.js).
   py(...) = code block, out(...) = its printed output. Both are just pre(). */
(function(){
const py=s=>pre(s), out=s=>pre(s);
const SCHEMA=`import pandas as pd, numpy as np

df = pd.DataFrame({
    'order_id':   [101, 102, 103, 104, 105, 106, 107, 108],
    'customer':   ['Asha', 'Ravi', 'Asha', 'Meena', 'Ravi', 'Zoya', 'Asha', 'Meena'],
    'region':     ['South', 'North', 'South', 'West', 'North', 'East', 'South', 'West'],
    'category':   ['Tech', 'Furniture', 'Tech', 'Office', 'Tech', 'Furniture', 'Furniture', 'Tech'],
    'revenue':    [1000, 1200, 1350, 200, np.nan, 1800, 250, 900],
    'order_date': ['2024-01-05', '2024-01-18', '2024-02-03', '2024-02-14',
                   '2024-02-20', '2024-03-02', '2024-03-15', '2024-03-28'],
})
customers = pd.DataFrame({'customer': ['Asha', 'Ravi', 'Meena', 'Kiran'],
                          'city': ['Pune', 'Delhi', 'Mumbai', 'Chennai']})
# order 105 has a missing revenue; Zoya is not in customers; Kiran has no orders`;

QA.py={name:'Python / pandas',emoji:'🐍',
schema: pre(SCHEMA),
list:[
/* ---------------- EASY ---------------- */
{q:`What is the difference between a list, tuple, set and dict? When do you use each?`,
short:`A list is ordered and changeable, a tuple is ordered but fixed, a set keeps only unique items, and a dict stores key-value pairs. I use a list for a sequence I will change, a tuple for fixed records, a set to remove duplicates or check membership fast, and a dict to look things up by a key.`,
a:`<p>All four are built-in containers. The choice depends on three things: do you need order, do you need to change it, and do you need to look things up by a key.</p>
${py(`nums = [3, 1, 3, 2]            # list: ordered, mutable, duplicates allowed
point = (28.6, 77.2)           # tuple: ordered, immutable
uniq = set(nums)               # set: unique, no order, no index
ages = {'Asha': 28, 'Ravi': 31}  # dict: key -> value

nums.append(5)                 # fine
print(len(uniq), 3 in uniq)    # fast membership test
print(sorted(uniq))
print(ages['Asha'], ages.get('Zoya', 'not found'))
print({1, 2, 3} & {2, 3, 4})   # intersection`)}
${out(`3 True
[1, 2, 3]
28 not found
{2, 3}`)}
<p><b>Why it matters.</b> A set or dict checks "is this in here?" in almost constant time, a list has to scan every item. A tuple can be a dict key, a list cannot (it is mutable, so not hashable). Dict keys must be unique and hashable.</p>`,
lvl:'E',freq:3,
follow:[`Can a list be a dict key? Why not?`,`Is a dict ordered?`,`How do you remove duplicates from a list?`],
mistake:`Saying a set is "ordered" or forgetting that <code>{}</code> creates an empty dict, not an empty set (use <code>set()</code>).`,
tags:['python','basics']},

{q:`What is mutable vs immutable? What happens when you write b = a for a list?`,
short:`Mutable objects such as lists, dicts and sets can be changed in place; immutable ones such as strings, tuples and numbers cannot. With b = a no copy is made, both names point to the same list, so changing b also changes a. Use a.copy() for an independent list.`,
a:`${py(`a = [1, 2, 3]
b = a              # same list, two names
b.append(4)
print(a)           # a changed too

c = a.copy()       # real (shallow) copy
c.append(5)
print(a, c)

t = (1, 2, 3)
try:
    t[0] = 9
except TypeError:
    print('tuple cannot be changed')

s = 'abc'
s.upper()          # returns a NEW string, s is unchanged
print(s)`)}
${out(`[1, 2, 3, 4]
[1, 2, 3, 4] [1, 2, 3, 4, 5]
tuple cannot be changed
abc`)}
<p><b>Why it matters.</b> Functions that receive a list can silently change the caller's list. In pandas the same idea shows up as views vs copies. <code>copy()</code> is shallow: a list of lists still shares the inner lists, use <code>copy.deepcopy</code> for that.</p>`,
lvl:'E',freq:3,
follow:[`Why is def f(x, items=[]) a bad idea?`,`What is the difference between a shallow and a deep copy?`],
mistake:`Thinking <code>b = a</code> copies the list, or thinking <code>s.upper()</code> changes the string in place.`,
tags:['python','basics']},

{q:`What is the difference between a Series and a DataFrame? How do you quickly explore a new DataFrame?`,
short:`A Series is one labelled column, a DataFrame is a table of Series that share the same index. To explore I check shape, dtypes, head, missing counts and describe, before I do any analysis.`,
a:`${py(SCHEMA)}
<p>Using the shared sample table above:</p>
${py(`print(type(df['revenue']).__name__)     # one column -> Series
print(type(df[['revenue']]).__name__)   # list of columns -> DataFrame
print(df.shape)
print(df.isna().sum())
print(df['revenue'].describe().round(1))`)}
${out(`Series
DataFrame
(8, 6)
order_id      0
customer      0
region        0
category      0
revenue       1
order_date    0
dtype: int64
count       7.0
mean      957.1
std       577.7
min       200.0
25%       575.0
50%      1000.0
75%      1275.0
max      1800.0
Name: revenue, dtype: float64`)}
<p>My first-look routine: <code>df.shape</code>, <code>df.head()</code>, <code>df.dtypes</code>, <code>df.isna().sum()</code>, <code>df.duplicated().sum()</code>, <code>df.describe()</code>. Note that <code>describe()</code> ignores the NaN: count is 7, not 8. <b>Version note:</b> in older pandas a text column's dtype prints as <code>object</code>, in pandas 3 it prints as <code>str</code>; both are fine.</p>`,
lvl:'E',freq:3,
follow:[`What does df.info() show that df.describe() does not?`,`What is the difference between df['a'] and df[['a']]?`],
mistake:`Skipping this first look and jumping into groupby, then getting wrong totals because of NaN or duplicate rows.`,
tags:['pandas','eda']},

{q:`Explain loc vs iloc. Show how to select rows by a condition.`,
short:`loc selects by label and by boolean mask, iloc selects by integer position. With a slice, loc includes the end label while iloc excludes the end position. For conditions I use a boolean mask inside loc.`,
a:`${py(`print(df.loc[1, 'customer'])                 # row label 1, column name
print(df.iloc[1, 1])                       # row position 1, column position 1
print(df.loc[df['revenue'] > 1000, ['order_id', 'revenue']])
print(df.iloc[0:2, 0:2])                   # end position EXCLUDED
print(df.loc[0:2, 'order_id'].tolist())    # end label INCLUDED`)}
${out(`Ravi
Ravi
   order_id  revenue
1       102   1200.0
2       103   1350.0
5       106   1800.0
   order_id customer
0       101     Asha
1       102     Ravi
[101, 102, 103]`)}
<p><b>Why it matters.</b> Our index is 0..7, so label and position look the same here. After you filter or sort, the labels stay but positions change, and that is where beginners get wrong rows. Rule: <code>loc</code> when you think in names and conditions, <code>iloc</code> when you think "first 5 rows" or "last column".</p>`,
lvl:'E',freq:3,
follow:[`What happens to the index after you filter rows? How do you reset it?`,`How would you select the last 3 rows?`],
mistake:`Using <code>df.loc[0:2]</code> and expecting 2 rows. It returns 3, because the end label is included.`,
tags:['pandas','selection']},

{q:`What is a list comprehension? Write one to square the even numbers, and a dict comprehension.`,
short:`It is a short way to build a new list from a loop and an optional condition, written in one line. It is shorter and usually faster than an append loop, but I switch to a normal loop when the logic is long.`,
a:`${py(`nums = [1, 2, 3, 4, 5, 6]
print([n * n for n in nums if n % 2 == 0])          # filter + transform
print([('even' if n % 2 == 0 else 'odd') for n in nums[:3]])
print({n: n * n for n in nums[:3]})                 # dict comprehension
print(sorted({w[0] for w in ['apple', 'avocado', 'banana']}))  # set comprehension`)}
${out(`[4, 16, 36]
['odd', 'even', 'odd']
{1: 1, 2: 4, 3: 9}
['a', 'b']`)}
<p>Read it as: "give me <code>n*n</code> for every <code>n</code> in <code>nums</code> if <code>n</code> is even". The <code>if</code> at the end filters; an <code>if/else</code> at the front chooses a value. Same result as a for loop with <code>append</code>, but without the temporary list variable.</p>`,
lvl:'E',freq:3,
follow:[`Rewrite it as a normal for loop.`,`What is the difference between a list comprehension and a generator expression?`],
mistake:`Putting the filter <code>if</code> at the front without an <code>else</code> (syntax error), or writing a comprehension so nested that nobody can read it.`,
tags:['python','basics']},

{q:`What is a lambda function? Give a use with sorted and with pandas.`,
short:`A lambda is a small unnamed one-line function, for example lambda x: x * 2. I use it when a function needs a quick rule, such as the sort key in sorted or a simple apply on a column.`,
a:`${py(`pairs = [('Asha', 88), ('Ravi', 92), ('Meena', 75)]
print(sorted(pairs, key=lambda p: p[1], reverse=True))   # sort by score

square = lambda x: x * x                                  # same as def square(x): return x * x
print(square(7))

s = pd.Series([100, 250, 40])
print(s.apply(lambda v: 'high' if v > 90 else 'low').tolist())`)}
${out(`[('Ravi', 92), ('Asha', 88), ('Meena', 75)]
49
['high', 'high', 'low']`)}
<p>A lambda can hold only one expression. If you need several lines or a name that explains the rule, write a normal <code>def</code>. In pandas, prefer a vectorised expression (<code>s &gt; 90</code>) over <code>apply(lambda ...)</code> whenever possible: it is much faster on large data.</p>`,
lvl:'E',freq:3,
follow:[`When would you avoid a lambda?`,`How do you sort a dict by its values?`],
mistake:`Using lambda with apply on a big column when a vectorised operation exists.`,
tags:['python','basics']},

{q:`What are *args and **kwargs?`,
short:`*args collects extra positional arguments into a tuple, and **kwargs collects extra keyword arguments into a dict. They let one function accept a flexible number of inputs.`,
a:`${py(`def total(*args):
    return sum(args)

def describe(name, **kwargs):
    return name + ' ' + str(kwargs)

print(total(1, 2, 3))
print(describe('Asha', city='Pune', age=28))

nums = [4, 5, 6]
print(total(*nums))                  # * also UNPACKS a list into arguments`)}
${out(`6
Asha {'city': 'Pune', 'age': 28}
15`)}
<p>Inside the function, <code>args</code> is a tuple and <code>kwargs</code> is a dict. The names args and kwargs are only convention; the stars are what matter. Order in a signature: normal arguments, then <code>*args</code>, then <code>**kwargs</code>.</p>`,
lvl:'E',freq:2,
follow:[`What is a default argument and what is the mutable-default trap?`,`What does the * do in a function call?`],
mistake:`Thinking the names matter (they do not) or that args is a list (it is a tuple).`,
tags:['python','functions']},

{q:`Count how many times each word appears in a sentence and show the top 2. (Simple dict task)`,
short:`I loop over the words and keep a dict where the key is the word and the value is its count, using get with a default of 0. collections.Counter does the same job in one line, and most_common gives the top ones.`,
a:`${py(`from collections import Counter

text = 'the cat and the dog and the bird'
counts = {}
for w in text.split():
    counts[w] = counts.get(w, 0) + 1
print(counts)

print(Counter(text.split()).most_common(2))
print(sorted(counts.items(), key=lambda kv: kv[1], reverse=True)[:2])`)}
${out(`{'the': 3, 'cat': 1, 'and': 2, 'dog': 1, 'bird': 1}
[('the', 3), ('and', 2)]
[('the', 3), ('and', 2)]`)}
<p><code>counts.get(w, 0)</code> returns 0 the first time a word is seen, so no KeyError. Say out loud if case or punctuation matters: use <code>text.lower()</code> and strip punctuation first. In pandas the same job is <code>pd.Series(text.split()).value_counts()</code>.</p>`,
lvl:'E',freq:3,
follow:[`How would you ignore upper/lower case and punctuation?`,`Write a function to check if a string is a palindrome.`],
mistake:`Writing <code>counts[w] += 1</code> without handling the first occurrence, which raises KeyError.`,
tags:['python','dict','strings']},

{q:`Filter rows with more than one condition in pandas. What are the common syntax traps?`,
short:`I build a boolean mask, wrap each condition in brackets and combine them with & for and, | for or, ~ for not. Python's and/or do not work on columns. isin handles a list of values, and query is a readable alternative.`,
a:`${py(`mask = (df['region'] == 'South') & (df['revenue'] >= 1000)
print(df.loc[mask, ['order_id', 'region', 'revenue']])

print(df[df['category'].isin(['Tech', 'Office']) & df['revenue'].notna()].shape)
print(df[~df['region'].isin(['South'])]['order_id'].tolist())
print(df.query("region == 'North' or revenue > 1500")['order_id'].tolist())`)}
${out(`order_id region  revenue
0       101  South   1000.0
2       103  South   1350.0
(4, 6)
[102, 104, 105, 106, 108]
[102, 105, 106]`)}
<p><b>Traps.</b> (1) Missing brackets: <code>df['a']==1 &amp; df['b']==2</code> fails because <code>&amp;</code> binds tighter than <code>==</code>. (2) <code>and</code>/<code>or</code> raise "truth value of a Series is ambiguous". (3) A NaN compares False with everything, so rows with NaN revenue silently drop out of <code>revenue &gt; 1000</code> and also out of <code>revenue &lt;= 1000</code>.</p>`,
lvl:'E',freq:3,
follow:[`How do you filter rows where a text column contains a word?`,`What does between() do?`],
mistake:`Using <code>and</code> / <code>or</code> instead of <code>&amp;</code> / <code>|</code>, or forgetting the brackets.`,
tags:['pandas','selection']},

{q:`How do you convert a text column to datetime or numbers, and extract the month?`,
short:`pd.to_datetime for dates and pd.to_numeric for numbers, both with errors='coerce' so bad values become NaT or NaN instead of crashing. After that, the .dt accessor gives month, year, weekday and so on.`,
a:`${py(`df['order_date'] = pd.to_datetime(df['order_date'], errors='coerce')
df['month'] = df['order_date'].dt.month
df['weekday'] = df['order_date'].dt.day_name()
print(df[['order_date', 'month', 'weekday']].head(3))
print(df['order_date'].dtype)

bad = pd.Series(['12', '7', 'n/a'])
print(pd.to_numeric(bad, errors='coerce').tolist())
print(pd.to_datetime(pd.Series(['05/01/2024']), format='%d/%m/%Y')[0].month)`)}
${out(`order_date  month   weekday
0 2024-01-05      1    Friday
1 2024-01-18      1  Thursday
2 2024-02-03      2  Saturday
datetime64[us]
[12.0, 7.0, nan]
1`)}
<p><b>Why it matters.</b> Dates stored as text sort wrongly and cannot do date arithmetic. For day-first dates like <code>05/01/2024</code> always give <code>format=</code>, otherwise pandas may read it as 1 May instead of 5 January. On a modern pandas the dtype prints as <code>datetime64[us]</code>; older versions print <code>datetime64[ns]</code>, same idea. After <code>coerce</code>, check <code>isna().sum()</code> to see how many values failed. <code>astype(int)</code> would raise an error on 'n/a'; to_numeric with coerce is the safe route.</p>`,
lvl:'E',freq:3,
follow:[`How do you find rows whose date failed to parse?`,`How do you get the difference between two dates in days?`],
mistake:`Not specifying the date format for day-first data, so days and months get swapped without any error.`,
tags:['pandas','datetime']},

{q:`Remove duplicates from a Python list while keeping the original order. How do you find which items are duplicated?`,
short:`list(dict.fromkeys(items)) removes duplicates and keeps first-seen order, because dict keys are unique and ordered. To find the duplicated ones I count with Counter and keep the items with count above 1.`,
a:`${py(`from collections import Counter

items = ['b', 'a', 'b', 'c', 'a', 'b']
print(len(set(items)))                     # 3 unique, but list(set(items)) has NO guaranteed order
print(list(dict.fromkeys(items)))          # unique, first-seen order kept

seen, result = set(), []
for x in items:                            # same idea, long form
    if x not in seen:
        seen.add(x)
        result.append(x)
print(result)

print([k for k, c in Counter(items).items() if c > 1])`)}
${out(`3
['b', 'a', 'c']
['b', 'a', 'c']
['b', 'a']`)}
<p><code>list(set(items))</code> is the shortest answer but it loses order. The set <code>seen</code> makes the "have I seen this?" check fast; checking <code>x in result</code> on a list would be slow for big lists.</p>`,
lvl:'E',freq:2,
follow:[`What is the time complexity of the loop version?`,`How do you do this for a DataFrame column?`],
mistake:`Using <code>list(set(x))</code> when the order matters.`,
tags:['python','lists']},

/* ---------------- MEDIUM ---------------- */
{q:`How do you handle missing values in pandas? Show detect, drop and fill.`,
short:`First I find how many are missing and ask why. Then I drop rows if few and random, or fill with a sensible value such as the median or a group median, and I keep a flag column when missingness itself may matter. I never fill blindly because it can bias the result.`,
a:`${py(`print(df['revenue'].isna().sum())                       # how many
print(round(df['revenue'].mean(), 1), df['revenue'].median())

df['rev_median'] = df['revenue'].fillna(df['revenue'].median())      # simple fill
df['rev_group'] = df['revenue'].fillna(
    df.groupby('category')['revenue'].transform('median'))           # smarter fill
df['rev_missing'] = df['revenue'].isna()                             # keep a flag

print(df.loc[4, ['order_id', 'rev_median', 'rev_group']].tolist())
print(df.dropna(subset=['revenue']).shape)                           # drop rows`)}
${out(`1
957.1 1000.0
[105.0, 1000.0, 1000.0]
(7, 9)`)}
<p><b>Choosing.</b> Drop when the missing share is small and random. Median fill for skewed numbers (mean is dragged by outliers). Group median when the group explains the value (Tech orders vs Office orders); here the Tech median happens to equal the overall median, so both fills give 1000. Forward fill (<code>ffill</code>) for time series. Mode for categories. Note that <code>mean</code>, <code>sum</code> and <code>count</code> skip NaN by default, so your totals already "ignore" the missing row: say that out loud.</p>`,
lvl:'M',freq:3,
follow:[`What if 40% of a column is missing?`,`What is the difference between dropna(how='any') and how='all'?`],
mistake:`Filling everything with 0 or the mean without asking why the value is missing; this distorts averages and spreads.`,
tags:['pandas','cleaning']},

{q:`Total orders, total revenue and average revenue per region. Write the groupby.`,
short:`groupby the region, then agg with named outputs: count of order_id, sum and mean of revenue, then reset_index to get a normal table. Sum and mean skip the missing revenue value.`,
a:`${py(`out = (df.groupby('region')
         .agg(orders=('order_id', 'count'),
              total=('revenue', 'sum'),
              avg=('revenue', 'mean'))
         .reset_index())
print(out)`)}
${out(`region  orders   total          avg
0   East       1  1800.0  1800.000000
1  North       2  1200.0  1200.000000
2  South       3  2600.0   866.666667
3   West       2  1100.0   550.000000`)}
<p><b>Check by hand.</b> North has two orders (102 = 1200, 105 = missing), so orders = 2, total = 1200 and avg = 1200, not 600: the mean divides by the 1 non-null value. If you want the NaN to count as zero you must say so with <code>fillna(0)</code>. <code>count</code> counts non-null values of the column you give it, which is why I count <code>order_id</code> (never missing) and not <code>revenue</code>.</p>`,
lvl:'M',freq:3,
follow:[`How do you sort the result by total, highest first?`,`How do you group by two columns?`,`What is the difference between size() and count()?`],
mistake:`Counting a column that has NaN and being surprised the count is lower than the number of rows.`,
tags:['pandas','groupby']},

{q:`Show the count and percentage of each category, and a crosstab of region by category.`,
short:`value_counts gives counts, with normalize=True it gives proportions. pd.crosstab gives a two-way frequency table, and normalize='index' turns each row into percentages that add to 100.`,
a:`${py(`print(df['category'].value_counts())
print(df['category'].value_counts(normalize=True).round(2))
print(pd.crosstab(df['region'], df['category']))
print(pd.crosstab(df['region'], df['category'], normalize='index').round(2))`)}
${out(`category
Tech         4
Furniture    3
Office       1
Name: count, dtype: int64
category
Tech         0.50
Furniture    0.38
Office       0.12
Name: proportion, dtype: float64
category  Furniture  Office  Tech
region                           
East              1       0     0
North             1       0     1
South             1       0     2
West              0       1     1
category  Furniture  Office  Tech
region                           
East           1.00     0.0  0.00
North          0.50     0.0  0.50
South          0.33     0.0  0.67
West           0.00     0.5  0.50`)}
<p>Reading the last table: each row sums to 1, so "among South orders, 67% are Tech and 33% Furniture". Use <code>normalize='columns'</code> for column percentages and <code>'all'</code> for share of the grand total. <b>Version note:</b> the count column is called <code>count</code> in pandas 2 and later; older versions show the column name instead. This is the same thing as a survey crosstab, so connect it to your own work in the interview.</p>`,
lvl:'M',freq:3,
follow:[`How do you include missing values in value_counts?`,`How do you add row and column totals to crosstab?`],
mistake:`Reading row percentages as column percentages. Always say which direction adds to 100.`,
tags:['pandas','eda']},

{q:`Explain the types of merge. Write a left join of orders with customers and find unmatched rows.`,
short:`Inner keeps only matching keys, left keeps all rows of the left table, right keeps all of the right, and outer keeps everything. With a left join, unmatched rows get NaN, and indicator=True tells me which rows matched.`,
a:`${py(`m = df.merge(customers, on='customer', how='left')
print(m[['order_id', 'customer', 'city']])

print(df.merge(customers, on='customer', how='inner').shape)       # Zoya dropped

outer = df.merge(customers, on='customer', how='outer', indicator=True)
print(outer['_merge'].value_counts().sort_index())`)}
${out(`order_id customer    city
0       101     Asha    Pune
1       102     Ravi   Delhi
2       103     Asha    Pune
3       104    Meena  Mumbai
4       105     Ravi   Delhi
5       106     Zoya     NaN
6       107     Asha    Pune
7       108    Meena  Mumbai
(7, 7)
_merge
left_only     1
right_only    1
both          7
Name: count, dtype: int64`)}
<p>Same logic as SQL joins. Zoya has no customer record, so she gets NaN city in the left join and disappears from the inner join. Kiran has no orders and only shows up in the outer join (<code>right_only</code>). <b>Always check the row count before and after a merge.</b> If the right table has duplicate keys, rows multiply (see the anti-join question).</p>`,
lvl:'M',freq:3,
follow:[`What if the key columns have different names in the two tables?`,`How do you merge on two columns?`],
mistake:`Not checking row counts after a merge, so duplicate keys silently inflate revenue totals.`,
tags:['pandas','merge']},

{q:`merge vs join vs concat: what is the difference?`,
short:`merge is a SQL-style join on column values, join is a shortcut to join on the index, and concat just stacks DataFrames on top of each other (axis 0) or side by side (axis 1) without matching on keys.`,
a:`${py(`jan_feb = df.iloc[:4]
mar = df.iloc[4:]
stacked = pd.concat([jan_feb, mar], ignore_index=True)     # stack rows
print(stacked.shape, stacked.index.tolist())

extra = pd.DataFrame({'order_id': [101, 102, 103, 104], 'discount': [0, 50, 0, 10]})
print(df.merge(extra, on='order_id', how='left')['discount'].tolist())
print(df.set_index('order_id').join(extra.set_index('order_id'))['discount'].tolist())`)}
${out(`(8, 6) [0, 1, 2, 3, 4, 5, 6, 7]
[0.0, 50.0, 0.0, 10.0, nan, nan, nan, nan]
[0.0, 50.0, 0.0, 10.0, nan, nan, nan, nan]`)}
<p><b>When.</b> Same columns, more rows (monthly files) means <code>concat</code>. Extra columns from a lookup table means <code>merge</code>. <code>join</code> is the same as merge when keys are already the index. Concat without <code>ignore_index=True</code> keeps the old index values, so you can get duplicate labels.</p>`,
lvl:'M',freq:3,
follow:[`What does concat do if the two tables have different columns?`,`What is the SQL equivalent of concat?`],
mistake:`Using concat with axis=1 to attach a lookup, which lines rows up by index, not by key, and gives wrong rows.`,
tags:['pandas','merge']},

{q:`Make a pivot table of total revenue by region and month. Why use pivot_table instead of pivot?`,
short:`pivot_table takes index, columns, values and an aggfunc, so it aggregates and handles duplicate combinations. pivot only reshapes and fails if a combination appears twice. I use fill_value for gaps and margins for totals.`,
a:`${py(`df['order_date'] = pd.to_datetime(df['order_date'])
df['month'] = df['order_date'].dt.month

pt = df.pivot_table(index='region', columns='month', values='revenue',
                    aggfunc='sum', fill_value=0, margins=True)
print(pt)`)}
${out(`month        1       2       3     All
region                                
East       0.0     0.0  1800.0  1800.0
North   1200.0     0.0     0.0  1200.0
South   1000.0  1350.0   250.0  2600.0
West       0.0   200.0   900.0  1100.0
All     2200.0  1550.0  2950.0  6700.0`)}
<p>Each cell is the sum for that region and month. The <code>All</code> row and column come from <code>margins=True</code>. It is the same as Excel's PivotTable and as <code>groupby(['region','month'])['revenue'].sum().unstack()</code>. Note the NaN revenue of order 105 is skipped, so North in February is 0. A <code>0</code> here could mean "no sales" or "sales not recorded": mention that.</p>`,
lvl:'M',freq:3,
follow:[`How do you get several aggregations (sum and count) in one pivot?`,`How do you flatten the column names afterwards?`],
mistake:`Using pivot on data with repeated index/column pairs, which raises a "duplicate entries" error.`,
tags:['pandas','pivot']},

{q:`apply vs map vs vectorised operations: which is faster and when do you use each?`,
short:`Vectorised operations work on the whole column at once and are the fastest, so I try them first. map is for replacing values through a dict or function on one Series, and apply runs a Python function row by row, which is flexible but slow.`,
a:`${py(`df['rev_gst'] = df['revenue'] * 1.18                              # 1. vectorised
df['size'] = np.where(df['revenue'] >= 1000, 'Big', 'Small')      # vectorised if/else
df['region_code'] = df['region'].map({'South': 'S', 'North': 'N', 'West': 'W', 'East': 'E'})
df['label'] = df.apply(lambda r: r['customer'] + '-' + str(r['order_id']), axis=1)

print(df[['order_id', 'revenue', 'rev_gst', 'size', 'region_code', 'label']].head(5))`)}
${out(`order_id  revenue  rev_gst   size region_code      label
0       101   1000.0   1180.0    Big           S   Asha-101
1       102   1200.0   1416.0    Big           N   Ravi-102
2       103   1350.0   1593.0    Big           S   Asha-103
3       104    200.0    236.0  Small           W  Meena-104
4       105      NaN      NaN  Small           N   Ravi-105`)}
<p><b>Speed order.</b> vectorised, then map, then apply(axis=1). For many conditions use <code>np.select</code> or <code>pd.cut</code>. <b>Spot the gotcha:</b> row 105 has a missing revenue, but <code>np.where</code> labelled it "Small" because <code>NaN &gt;= 1000</code> is False. Handle missing explicitly, for example with <code>np.select([df.revenue.isna(), df.revenue &gt;= 1000], ['Unknown', 'Big'], 'Small')</code>. Use <code>apply(axis=1)</code> only when the logic really needs several columns and cannot be vectorised.</p>`,
lvl:'M',freq:3,
follow:[`How would you apply a function to every column?`,`What does map do with a key that is not in the dict?`],
mistake:`Using apply(axis=1) for simple arithmetic on millions of rows.`,
tags:['pandas','apply']},

{q:`How do you find and remove duplicate rows? How do you keep the highest score per email?`,
short:`duplicated() flags repeats and drop_duplicates() removes them. I choose the columns with subset and which row to keep with keep. To keep the best row per key I sort first, then drop duplicates keeping the first.`,
a:`${py(`dup = pd.DataFrame({'email': ['a@x.com', 'b@x.com', 'a@x.com', 'c@x.com', 'b@x.com'],
                    'score': [10, 20, 15, 30, 20]})
print(dup.duplicated().tolist())                    # whole row
print(dup.duplicated(subset='email').tolist())      # only email
print(dup.drop_duplicates(subset='email', keep='first'))
print(dup.sort_values('score', ascending=False).drop_duplicates('email'))`)}
${out(`[False, False, False, False, True]
[False, False, True, False, True]
     email  score
0  a@x.com     10
1  b@x.com     20
3  c@x.com     30
     email  score
3  c@x.com     30
4  b@x.com     20
2  a@x.com     15`)}
<p>Only index 4 is a full-row duplicate (same email and score). With <code>subset='email'</code> both index 2 and 4 are repeats. The last line sorts so the highest score comes first, then keeps that first row for each email. Before deleting, <b>look at the duplicates</b> (<code>dup[dup.duplicated('email', keep=False)]</code>) and ask whether they are errors or genuine repeat events.</p>`,
lvl:'M',freq:3,
follow:[`What does keep=False do?`,`How do you count duplicates per key?`],
mistake:`Dropping duplicates on all columns when the real key is one column (or the reverse), and so keeping or losing the wrong rows.`,
tags:['pandas','cleaning']},

{q:`What is SettingWithCopyWarning and how do you avoid it?`,
short:`It warns that you may be changing a copy of the data instead of the original, which usually happens with chained indexing like df[mask]['col'] = value. I avoid it by assigning with a single loc call, or by calling .copy() when I want an independent table.`,
a:`${py(`south = df[df['region'] == 'South'].copy()     # explicit independent copy
south['revenue'] = south['revenue'] * 10      # safe: only the copy changes
print(df['revenue'].tolist())                 # original untouched

df.loc[df['region'] == 'South', 'revenue'] *= 2   # one loc step changes the ORIGINAL
print(df['revenue'].tolist())
print(south['revenue'].tolist())`)}
${out(`[1000.0, 1200.0, 1350.0, 200.0, nan, 1800.0, 250.0, 900.0]
[2000.0, 1200.0, 2700.0, 200.0, nan, 1800.0, 500.0, 900.0]
[10000.0, 13500.0, 2500.0]`)}
<p><b>The bad pattern</b> is two steps: <code>df[df['revenue'] &gt; 1000]['flag'] = 1</code>. The first step may return a copy, so the second step changes something you throw away. <b>Version note:</b> pandas 3 uses Copy-on-Write, so the SettingWithCopyWarning no longer exists. Chained assignment simply never updates the original (it raises a ChainedAssignmentError warning), and a filtered slice always behaves like a copy. In pandas 1.x/2.x it sometimes worked and sometimes did not, which is why the rule is the same everywhere: <b>one <code>loc</code> to change the original, <code>.copy()</code> to make a new table</b>.</p>`,
lvl:'M',freq:3,
follow:[`What is the difference between a view and a copy?`,`Does df2 = df make a copy?`],
mistake:`Silencing the warning instead of fixing the assignment, so the change quietly does not happen.`,
tags:['pandas','warning']},

{q:`How would you read a very large CSV that does not fit in memory?`,
short:`Read only the columns I need with usecols, set smaller dtypes, and read in pieces with chunksize, aggregating each chunk and combining the results. If it keeps growing I would load it into a database and use SQL, or use a tool built for big data.`,
a:`${py(`import io
csv = io.StringIO('order_id,region,revenue\\n101,South,1000\\n102,North,1200\\n103,South,1350\\n104,West,200\\n')

total = {}
for chunk in pd.read_csv(csv, usecols=['region', 'revenue'],
                         dtype={'region': 'category'}, chunksize=2):
    part = chunk.groupby('region', observed=True)['revenue'].sum()
    for k, v in part.items():
        total[k] = total.get(k, 0) + int(v)
print(total)`)}
${out(`{'North': 1200, 'South': 2350, 'West': 200}`)}
<p>With a real file you pass the file path instead of the small StringIO. Each chunk is a normal DataFrame, so you reduce it to a small summary and add it to a running total; never append every chunk to a big list. Other levers: <code>dtype</code> (int32, float32, category for repeated text) can cut memory a lot, <code>nrows=1000</code> to peek, and <code>df.memory_usage(deep=True)</code> to measure. Averages across chunks need a running sum and count, not an average of averages.</p>`,
lvl:'M',freq:3,
follow:[`How do you compute a mean across chunks correctly?`,`When would you move to SQL instead?`],
mistake:`Averaging the chunk averages, which is wrong when chunks have different sizes.`,
tags:['pandas','performance']},

{q:`Add a column showing each order's share of its category's total revenue. (groupby + transform)`,
short:`transform returns a result with the same length as the original, so I compute the group total with transform('sum') and divide each row by it. agg would give one row per group instead, which cannot be divided row by row.`,
a:`${py(`df['cat_total'] = df.groupby('category')['revenue'].transform('sum')
df['share_pct'] = (df['revenue'] / df['cat_total'] * 100).round(1)
print(df[['order_id', 'category', 'revenue', 'cat_total', 'share_pct']])`)}
${out(`order_id   category  revenue  cat_total  share_pct
0       101       Tech   1000.0     3250.0       30.8
1       102  Furniture   1200.0     3250.0       36.9
2       103       Tech   1350.0     3250.0       41.5
3       104     Office    200.0      200.0      100.0
4       105       Tech      NaN     3250.0        NaN
5       106  Furniture   1800.0     3250.0       55.4
6       107  Furniture    250.0     3250.0        7.7
7       108       Tech    900.0     3250.0       27.7`)}
<p>Check: Furniture total = 1200 + 1800 + 250 = 3250, so order 102 is 1200 / 3250 = 36.9%. Tech total = 1000 + 1350 + 900 = 3250 (the NaN is skipped), so order 101 = 30.8%. The row with NaN revenue stays NaN. <code>transform</code> is the pandas version of a SQL window function <code>SUM(revenue) OVER (PARTITION BY category)</code>.</p>`,
lvl:'M',freq:2,
follow:[`How do you get a running total within a group?`,`What is the difference between agg and transform?`],
mistake:`Using agg and then trying to divide a full column by a shorter group-level result.`,
tags:['pandas','groupby']},

{q:`Get the top-revenue order in each region, and the top 3 orders overall.`,
short:`For overall top N I use nlargest. For top per group I sort by the value descending and take head(1) from each group, or use rank within the group.`,
a:`${py(`top_per_region = (df.sort_values('revenue', ascending=False)
                .groupby('region').head(1)
                .sort_values('region'))
print(top_per_region[['region', 'order_id', 'revenue']])

print(df.nlargest(3, 'revenue')[['order_id', 'revenue']])

df['rank_in_region'] = df.groupby('region')['revenue'].rank(ascending=False, method='dense')
print(df[['order_id', 'region', 'revenue', 'rank_in_region']].head(5))`)}
${out(`region  order_id  revenue
5   East       106   1800.0
1  North       102   1200.0
2  South       103   1350.0
7   West       108    900.0
   order_id  revenue
5       106   1800.0
2       103   1350.0
1       102   1200.0
   order_id region  revenue  rank_in_region
0       101  South   1000.0             2.0
1       102  North   1200.0             1.0
2       103  South   1350.0             1.0
3       104   West    200.0             2.0
4       105  North      NaN             NaN`)}
<p>South has three orders, so head(1) after sorting keeps only the best one (1350). For the "second highest per group" style of question, use the rank column and filter <code>== 2</code>. <code>rank</code> with <code>method='dense'</code> behaves like SQL <code>DENSE_RANK</code>: ties share a rank and no number is skipped. NaN rows get NaN rank and are sorted last.</p>`,
lvl:'M',freq:3,
follow:[`How do you find the Nth highest value in a column?`,`What is the difference between rank methods?`],
mistake:`Using groupby().max() when you need the whole row (order id, customer) of the maximum, not only the number.`,
tags:['pandas','groupby']},

{q:`Clean a messy text column: spaces, mixed case, and a currency symbol in numbers.`,
short:`I use the .str accessor: strip removes spaces, lower or title fixes the case, and str.replace with a regex removes symbols. Then astype converts to numbers. After cleaning I check value_counts to see that the variants merged.`,
a:`${py(`city = pd.Series([' Pune ', 'pune', 'PUNE', 'Mumbai', 'mumbai ', None])
clean = city.str.strip().str.title()
print(clean.tolist())
print(clean.value_counts())

price = pd.Series(['Rs 1,200', 'Rs 950'])
print(price.str.replace('[^0-9]', '', regex=True).astype(int).tolist())`)}
${out(`['Pune', 'Pune', 'Pune', 'Mumbai', 'Mumbai', nan]
Pune      3
Mumbai    2
Name: count, dtype: int64
[1200, 950]`)}
<p>The .str methods skip missing values (None becomes NaN) instead of crashing. Without the clean-up, Pune would be counted as three different cities and every groupby would be wrong. For harder cases (misspellings), build a mapping dict and use <code>map</code>, or fuzzy matching. Use <code>regex=True</code> explicitly; the default changed between pandas versions.</p>`,
lvl:'M',freq:2,
follow:[`How do you filter rows where text contains a word, ignoring case?`,`How do you split 'Asha Rao' into two columns?`],
mistake:`Cleaning for display only and not noticing that "Pune" and "pune " still group separately.`,
tags:['pandas','strings','cleaning']},

/* ---------------- HARD ---------------- */
{q:`Write a function to detect outliers using the IQR rule.`,
short:`Find Q1 and Q3, compute IQR as Q3 minus Q1, and flag anything below Q1 minus 1.5 IQR or above Q3 plus 1.5 IQR. I return a boolean mask so the caller can remove, cap or just inspect the rows. IQR works better than z-score on skewed data and small samples.`,
a:`${py(`def iqr_outliers(s, k=1.5):
    q1, q3 = s.quantile([0.25, 0.75])
    iqr = q3 - q1
    low, high = q1 - k * iqr, q3 + k * iqr
    return (s < low) | (s > high)

d = pd.DataFrame({'amount': [4, 5, 6, 7, 8, 9, 10, 11, 40]})
mask = iqr_outliers(d['amount'])
print(d[mask])
print(d[~mask].shape)
print(d['amount'].clip(0, 16).tolist())      # capping instead of removing`)}
${out(`amount
8      40
(8, 1)
[4, 5, 6, 7, 8, 9, 10, 11, 16]`)}
<p><b>Hand check.</b> Q1 = 6, Q3 = 10, IQR = 4. Fences: 6 - 6 = 0 and 10 + 6 = 16. So 40 is flagged, nothing else. Returning a mask (not a new table) is more flexible: <code>d[~mask]</code> removes, <code>clip</code> caps (winsorising). <b>Before removing</b>, ask whether 40 is an error or a real big customer; deleting real data biases the result. Do the check per group if groups have different scales.</p>`,
lvl:'H',freq:3,
follow:[`Why 1.5? What would 3 mean?`,`How would you do it separately for each category?`],
mistake:`Deleting every flagged value automatically without asking whether it is an error or a real extreme.`,
tags:['pandas','outliers']},

{q:`Write a z-score outlier function. When does the z-score method fail?`,
short:`z = (value minus mean) divided by standard deviation, and I flag values with |z| above 3. It fails on small or skewed samples because the outlier itself inflates the mean and standard deviation, so it can hide itself. I then prefer IQR or a median-based score.`,
a:`${py(`def zscore_outliers(s, z=3):
    zs = (s - s.mean()) / s.std()          # pandas std is the sample std (ddof=1)
    return zs.abs() > z

d = pd.DataFrame({'amount': [4, 5, 6, 7, 8, 9, 10, 11, 40]})
zs = (d['amount'] - d['amount'].mean()) / d['amount'].std()
print(round(zs.iloc[-1], 2))                 # z of the value 40
print(zscore_outliers(d['amount']).sum())    # flagged at z = 3
print(zscore_outliers(d['amount'], 2.5).sum())
print(round(8 / 9 ** 0.5, 2))                # biggest possible z when n = 9`)}
${out(`2.61
0
1
2.67`)}
<p><b>Why it failed.</b> Mean = 11.1 and sd = 11.07 (dragged up by the 40), so z for 40 is only 2.61, below 3. With n values, the largest possible z-score is (n - 1)/sqrt(n), which is 2.67 for n = 9: with fewer than 11 points, |z| &gt; 3 can <b>never</b> happen. Fixes: IQR, a lower cut-off like 2.5, or a robust z with median and MAD. The z-score also assumes a roughly bell-shaped distribution.</p>`,
lvl:'H',freq:2,
follow:[`What is a robust z-score?`,`Which method for income data and why?`],
mistake:`Trusting |z| &gt; 3 on a small dataset and reporting "no outliers" when one clearly exists.`,
tags:['pandas','outliers','stats']},

{q:`You have a table of user events with timestamps. Group them into sessions (a new session after 30 minutes of inactivity) and compute the number of sessions and the total and average session duration per user.`,
short:`Sort by user and time, take the gap to the previous event per user, mark a new session when the gap is missing or above 30 minutes, and cumulative-sum that flag to get a session number. Then group by user and session to get start, end and duration, and group again per user.`,
a:`${py(`ev = pd.DataFrame({
    'user_id': ['u1', 'u1', 'u1', 'u1', 'u1', 'u2', 'u2', 'u3'],
    'ts': pd.to_datetime(['2024-05-01 10:00', '2024-05-01 10:20', '2024-05-01 10:45',
                          '2024-05-01 11:30', '2024-05-01 11:40',
                          '2024-05-01 09:00', '2024-05-01 09:10', '2024-05-01 12:00'])})

ev = ev.sort_values(['user_id', 'ts'])
gap = ev.groupby('user_id')['ts'].diff()
ev['new_session'] = gap.isna() | (gap > pd.Timedelta(minutes=30))
ev['session_no'] = ev.groupby('user_id')['new_session'].cumsum()

sess = ev.groupby(['user_id', 'session_no'])['ts'].agg(start='min', end='max')
sess['minutes'] = (sess['end'] - sess['start']).dt.total_seconds() / 60
print(sess['minutes'])
print(sess.groupby('user_id')['minutes'].agg(sessions='count', total='sum', avg='mean'))`)}
${out(`user_id  session_no
u1       1             45.0
         2             10.0
u2       1             10.0
u3       1              0.0
Name: minutes, dtype: float64
         sessions  total   avg
user_id                       
u1              2   55.0  27.5
u2              1   10.0  10.0
u3              1    0.0   0.0`)}
<p><b>Walk through.</b> For u1 the gaps are 20, 25, 45 and 10 minutes. Only the 45-minute gap is above 30, so there are two sessions: 10:00 to 10:45 (45 min) and 11:30 to 11:40 (10 min). The first event of each user has no previous event (gap is NaN), so it starts session 1. <code>cumsum</code> on a True/False column counts the starts so far, which gives the session number. A one-event session (u3) has duration 0: say how you would treat it.</p>
<p><b>If the question is simpler</b> ("total time per user" with one start and one end column per row), it is just <code>df['dur'] = (df.end - df.start).dt.total_seconds()</code> then <code>groupby('user_id')['dur'].agg(['count','sum','mean'])</code>.</p>`,
lvl:'H',freq:3,
follow:[`How would you do this in SQL?`,`What about sessions that cross midnight?`],
mistake:`Using max minus min per user, which merges sessions from different days into one huge duration.`,
tags:['pandas','groupby','datetime']},

{q:`Show monthly revenue and the month-over-month growth percentage.`,
short:`Convert the date, group by month (a period or resample), sum the revenue, and apply pct_change for the growth versus the previous month. I also say how I treat missing values and a partial month.`,
a:`${py(`df['order_date'] = pd.to_datetime(df['order_date'])
monthly = df.groupby(df['order_date'].dt.to_period('M'))['revenue'].sum()
print(monthly)
print((monthly.pct_change() * 100).round(1))

same = df.set_index('order_date')['revenue'].resample('MS').sum()
print(same.tolist())`)}
${out(`order_date
2024-01    2200.0
2024-02    1550.0
2024-03    2950.0
Freq: M, Name: revenue, dtype: float64
order_date
2024-01     NaN
2024-02   -29.5
2024-03    90.3
Freq: M, Name: revenue, dtype: float64
[2200.0, 1550.0, 2950.0]`)}
<p><b>Check.</b> Jan = 1000 + 1200 = 2200. Feb = 1350 + 200 = 1550 (order 105 is NaN, skipped). Mar = 1800 + 250 + 900 = 2950. Growth Feb vs Jan = (1550 - 2200) / 2200 = -29.5%; Mar vs Feb = (2950 - 1550) / 1550 = +90.3%. The first month has no previous month, so NaN. The Feb dip is partly the missing value: a good analyst flags this before reporting a 29% fall. <code>resample</code> needs a datetime index and also creates months with no data (as 0), which groupby would skip.</p>`,
lvl:'H',freq:2,
follow:[`How do you compare with the same month last year?`,`How do you get a 3-month rolling average?`],
mistake:`Reporting growth from a month that has missing or partial data without saying so.`,
tags:['pandas','datetime']},

{q:`Find customers who never ordered, and orders whose customer is not in the customer table. What can go wrong with merge row counts?`,
short:`For customers without orders I use an anti-join: a left merge with indicator and keep left_only, or isin with a tilde. The big merge risk is duplicate keys in the lookup table, which multiply rows, so I check counts or use validate.`,
a:`${py(`never = customers[~customers['customer'].isin(df['customer'])]['customer'].tolist()
orphans = df[~df['customer'].isin(customers['customer'])]['customer'].unique().tolist()
print(never, orphans)

m = customers.merge(df[['customer']].drop_duplicates(), on='customer', how='left', indicator=True)
print(m.loc[m['_merge'] == 'left_only', 'customer'].tolist())

dup_cust = pd.concat([customers, customers.iloc[[0]]])      # Asha listed twice
print(len(df.merge(customers, on='customer')), len(df.merge(dup_cust, on='customer')))
try:
    df.merge(dup_cust, on='customer', validate='m:1')
except pd.errors.MergeError:
    print('MergeError: duplicate key found')`)}
${out(`['Kiran'] ['Zoya']
['Kiran']
7 10
MergeError: duplicate key found`)}
<p>Kiran has no orders, and Zoya's order has no customer record. When Asha appears twice in the lookup, her 3 orders become 6 rows, so the merge returns 10 rows instead of 7, and any revenue sum is now wrong. <code>validate='m:1'</code> (many orders to one customer) makes pandas stop with an error instead. The <code>~</code> means "not". This is the same as SQL <code>LEFT JOIN ... WHERE right.key IS NULL</code>.</p>`,
lvl:'H',freq:2,
follow:[`How do you find duplicate keys in the lookup table before merging?`,`What does validate='1:1' check?`],
mistake:`Merging without checking the key is unique in the lookup table and silently double-counting.`,
tags:['pandas','merge']},

{q:`For each customer, find the first order date and the number of days since their previous order.`,
short:`Sort by customer and date, then use groupby with min for the first date and groupby with diff for the gap to the previous order. diff returns NaT for each customer's first order, and dt.days turns the gap into a number.`,
a:`${py(`df['order_date'] = pd.to_datetime(df['order_date'])
df = df.sort_values(['customer', 'order_date'])
df['days_since_prev'] = df.groupby('customer')['order_date'].diff().dt.days
first_order = df.groupby('customer')['order_date'].min()

print(df[['customer', 'order_id', 'order_date', 'days_since_prev']])
print(first_order.dt.strftime('%Y-%m-%d').to_dict())`)}
${out(`customer  order_id order_date  days_since_prev
0     Asha       101 2024-01-05              NaN
2     Asha       103 2024-02-03             29.0
6     Asha       107 2024-03-15             41.0
3    Meena       104 2024-02-14              NaN
7    Meena       108 2024-03-28             43.0
1     Ravi       102 2024-01-18              NaN
4     Ravi       105 2024-02-20             33.0
5     Zoya       106 2024-03-02              NaN
{'Asha': '2024-01-05', 'Meena': '2024-02-14', 'Ravi': '2024-01-18', 'Zoya': '2024-03-02'}`)}
<p>Because of the groupby, the gap is calculated inside each customer: Asha's 2024-01-05 to 2024-02-03 is 29 days, then to 2024-03-15 is 41 days. Without groupby, the first order of Meena would be compared with the last order of Ravi, which is wrong. This pattern (sort, group, diff/shift) also gives repeat-purchase intervals and time to next event; it is the pandas version of SQL <code>LAG()</code>.</p>`,
lvl:'H',freq:2,
follow:[`How would you get the second order of each customer?`,`How do you compute the average repeat-purchase gap?`],
mistake:`Forgetting to sort first, so diff compares rows that are not in time order.`,
tags:['pandas','groupby','datetime']}
]};

/* ====================== STATISTICS ====================== */
QA.stats={name:'Statistics & A/B Testing',emoji:'📐',list:[
/* ---------------- EASY ---------------- */
{q:`Explain mean, median and mode. When do you report the median instead of the mean?`,
short:`Mean is the average, median is the middle value after sorting, and mode is the most frequent value. The mean is pulled by extreme values, the median is not, so for skewed data like income or order value I report the median, or both.`,
a:`<p>Take six daily order values: <b>2, 3, 3, 5, 7, 30</b>.</p>
<ul><li>Mean = (2 + 3 + 3 + 5 + 7 + 30) / 6 = 50 / 6 = <b>8.33</b></li>
<li>Median: the middle two values are 3 and 5 (positions 3 and 4 of 6), average = <b>4</b></li>
<li>Mode = <b>3</b> (appears twice)</li></ul>
${py(`import numpy as np
from statistics import mode
d = [2, 3, 3, 5, 7, 30]
print(round(np.mean(d), 2), np.median(d), mode(d))`)}
${out(`8.33 4.0 3`)}
<p><b>Why.</b> One value (30) moved the mean to 8.33, higher than five of the six values, while the median stays at 4. So the mean does not describe a "typical" day here. Use the median for skewed data with outliers, the mean when data is roughly symmetric and you need totals (mean times count equals the total), the mode for categories ("most common plan").</p>`,
lvl:'E',freq:3,
follow:[`What is the relation between mean and median in right-skewed data?`,`Can a dataset have more than one mode?`],
mistake:`Reporting an average income or order value from skewed data without checking the median.`,
tags:['stats','basics']},

{q:`What is standard deviation? Sample vs population standard deviation, with an example.`,
short:`Standard deviation tells how far values typically sit from the mean, in the same unit as the data. Population divides the squared deviations by n, sample divides by n minus 1, because a sample is on average a bit less spread out than the full population. For data from a sample I use n minus 1.`,
a:`<p>Data: <b>2, 4, 4, 4, 5, 5, 7, 9</b>. Mean = 40 / 8 = <b>5</b>.</p>
<p>Squared deviations from 5: 9, 1, 1, 1, 0, 0, 4, 16. Sum = <b>32</b>.</p>
<ul><li>Population variance = 32 / 8 = 4, so population SD = <b>2.0</b></li>
<li>Sample variance = 32 / 7 = 4.571, so sample SD = <b>2.138</b></li></ul>
${py(`import numpy as np
x = [2, 4, 4, 4, 5, 5, 7, 9]
print(np.std(x), round(np.std(x, ddof=1), 3), round(np.var(x, ddof=1), 3))`)}
${out(`2.0 2.138 4.571`)}
<p><b>Careful.</b> numpy's <code>np.std</code> uses n (ddof=0) by default, while pandas <code>.std()</code> and Excel's STDEV.S use n - 1. Pandas and numpy give different answers on the same list. The sample figure is the right one when your data is a sample used to estimate a bigger population (almost always).</p>`,
lvl:'E',freq:3,
follow:[`Why is it squared and not just the absolute deviation?`,`What does a large standard deviation tell you?`],
mistake:`Using np.std and pd.Series.std interchangeably, not knowing one divides by n and the other by n - 1.`,
tags:['stats','basics']},

{q:`What are percentiles and quartiles? Explain the IQR with a small example.`,
short:`The Pth percentile is the value below which P percent of the data falls. Q1, median and Q3 are the 25th, 50th and 75th percentiles, and IQR is Q3 minus Q1, the spread of the middle half of the data. It ignores extreme values, so it is a robust measure of spread.`,
a:`<p>Data (n = 9, already sorted): <b>4, 5, 6, 7, 8, 9, 10, 11, 40</b>.</p>
<ul><li>Median = 5th value = <b>8</b></li>
<li>Q1 = 3rd value = <b>6</b>, Q3 = 7th value = <b>10</b> (with 9 values the quartile positions fall exactly on data points)</li>
<li>IQR = 10 - 6 = <b>4</b></li></ul>
${py(`import numpy as np
d = [4, 5, 6, 7, 8, 9, 10, 11, 40]
print(np.percentile(d, [25, 50, 75]).tolist(), round(np.percentile(d, 90), 1))`)}
${out(`[6.0, 8.0, 10.0] 16.8`)}
<p>The 90th percentile is 11 + 0.2 x (40 - 11) = 16.8 (interpolating between the 8th and 9th values). <b>Note.</b> Different software uses slightly different quartile rules, so with small data the "textbook" Q1 and Excel's can differ a little; in the interview say which method you used. A box plot draws the box from Q1 to Q3 with a line at the median.</p>`,
lvl:'E',freq:3,
follow:[`How do you use the IQR to find outliers?`,`What does "the 90th percentile of delivery time is 3 days" mean?`],
mistake:`Confusing the percentile value with the percentage: "90th percentile" is a value in the data's unit, not 90%.`,
tags:['stats','basics']},

{q:`Explain the normal distribution and the 68-95-99.7 rule. What is a z-score?`,
short:`The normal distribution is a symmetric bell curve defined by its mean and standard deviation. About 68% of values lie within 1 SD of the mean, 95% within 2 SD and 99.7% within 3 SD. A z-score says how many standard deviations a value is from the mean.`,
a:`<p>Example: exam marks with mean <b>60</b> and SD <b>10</b>.</p>
<ul><li>68% of students score between 50 and 70, 95% between 40 and 80, 99.7% between 30 and 90.</li>
<li>A student scoring 80 has z = (80 - 60) / 10 = <b>2</b>, which is better than about 97.7% of students.</li>
<li>Only about 2.5% score above 80 (the 5% outside two SD is split into two tails).</li></ul>
${py(`from scipy import stats
print(round(stats.norm.cdf(1) - stats.norm.cdf(-1), 4), round(stats.norm.cdf(2) - stats.norm.cdf(-2), 4))
print(round(stats.norm.cdf(2), 4), round(stats.norm.ppf(0.975), 2))`)}
${out(`0.6827 0.9545
0.9772 1.96`)}
<p>The exact two-SD figure is 95.45%; 1.96 SD gives exactly 95%, which is why 1.96 appears in confidence intervals. z-scores let you compare values from different scales (a mark of 80 in maths vs 70 in English). The rule only holds for roughly bell-shaped data; do not use it on skewed data like income.</p>`,
lvl:'E',freq:3,
follow:[`What proportion lies above 1 SD from the mean?`,`How do you check whether data is roughly normal?`],
mistake:`Applying the 68-95-99.7 rule to skewed data.`,
tags:['stats','normal']},

{q:`What is skewness? How does it relate to mean and median?`,
short:`Skewness measures asymmetry. In a right-skewed distribution there is a long tail of large values and the mean is greater than the median; in left skew it is the other way round. Income and order values are typically right-skewed.`,
a:`<p>Monthly incomes (thousand rupees): <b>20, 22, 25, 28, 30, 35, 200</b>.</p>
${py(`import numpy as np
inc = [20, 22, 25, 28, 30, 35, 200]
print(round(np.mean(inc), 1), np.median(inc))`)}
${out(`51.4 28.0`)}
<p>Mean = 360 / 7 = 51.4 but median = 28. The mean sits far to the right of the median, which is the signature of <b>right (positive) skew</b>: a few very high values pull the mean up. Practical rules: for right skew report the median, consider a log transform before modelling, and prefer non-parametric tests or bootstrapping when the sample is small. Left skew (for example "age at retirement" or exam marks bunched near the maximum) has mean &lt; median.</p>`,
lvl:'E',freq:2,
follow:[`Which chart shows skew best?`,`What does a log transform do?`],
mistake:`Remembering skew by where the "hump" is; skew is named by the side of the long tail.`,
tags:['stats','distribution']},

{q:`Correlation vs causation. What does a correlation coefficient of 0.8 tell you?`,
short:`Correlation means two variables move together; causation means one actually produces the change in the other. r = 0.8 says a strong positive linear relationship, but not why. A third factor, reverse direction or coincidence can create it, and only a randomised experiment like an A/B test can prove cause.`,
a:`<ul><li><b>r</b> ranges from -1 to +1. Near +1: both rise together. Near -1: one rises as the other falls. Near 0: no <i>linear</i> relationship (there could still be a curve).</li>
<li>Classic example: ice-cream sales and drowning cases are positively correlated. Hot weather (a <b>confounder</b>) increases both; ice cream does not cause drowning.</li>
<li>Other explanations: reverse causality (do hospitals cause illness because sick people go there?) and pure coincidence in many variables.</li></ul>
<p><b>How to get closer to causation.</b> Run a randomised experiment (random assignment spreads confounders equally across groups), or in observational data control for known confounders and say clearly that you can only show association. Also: r = 0.8 means r squared = 0.64, so the line explains about 64% of the variation. It is not "80% accurate".</p>`,
lvl:'E',freq:3,
follow:[`Give a business example of a confounder.`,`Can the correlation be 0 and the variables still be related?`],
mistake:`Saying "X increased Y" from a correlation, or reading r = 0.8 as "80% of the time".`,
tags:['stats','correlation']},

{q:`Population vs sample. Name some sampling methods and the common sources of bias.`,
short:`The population is everyone you want to learn about, the sample is the part you actually measure. Random sampling gives every member a known chance, so the sample represents the population. Bias comes from who is selected (selection bias) and who answers (non-response bias).`,
a:`<ul><li><b>Simple random:</b> everyone has an equal chance, like drawing names from a hat.</li>
<li><b>Stratified:</b> split into groups (e.g. city tier or age band) and sample inside each group, so small groups are not missed.</li>
<li><b>Cluster:</b> randomly pick whole groups (e.g. 10 offices) and survey everyone inside.</li>
<li><b>Systematic:</b> every k-th record. <b>Convenience:</b> whoever is easy to reach, which is not random.</li></ul>
<p><b>Bias examples.</b> An online survey about internet use under-represents people with no internet (selection bias). A feedback form answered mostly by very angry or very happy customers (non-response / self-selection). Asking only current customers about why people leave (survivorship bias). A bigger sample does not fix bias: a million biased responses are still biased. For survey data, weighting can reduce the problem when you know the true population mix.</p>`,
lvl:'E',freq:3,
follow:[`Why is stratified sampling sometimes better than simple random?`,`What is survivorship bias?`],
mistake:`Thinking a large sample automatically means a representative sample.`,
tags:['stats','sampling','survey']},

{q:`Basic probability puzzles: two dice, three coin flips, and a card draw.`,
short:`Probability is favourable outcomes divided by total equally likely outcomes. For independent events I multiply, and for "at least one" it is easiest to use 1 minus the chance of none.`,
a:`<ul><li><b>Two dice sum to 7.</b> 36 equally likely pairs; the pairs (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) work: 6/36 = <b>1/6</b>.</li>
<li><b>At least one head in 3 flips.</b> P(no heads) = (1/2)^3 = 1/8, so answer = 1 - 1/8 = <b>7/8 = 0.875</b>.</li>
<li><b>Ace or a heart from a 52-card deck.</b> 4 aces + 13 hearts - 1 ace of hearts counted twice = 16 cards: 16/52 = 4/13 = <b>0.308</b>.</li>
<li><b>Two heads in a row:</b> independent events multiply: 1/2 x 1/2 = 1/4.</li></ul>
${py(`from itertools import product
pairs = list(product(range(1, 7), repeat=2))
print(sum(a + b == 7 for a, b in pairs), len(pairs))
print(1 - 0.5 ** 3, round(16 / 52, 3))`)}
${out(`6 36
0.875 0.308`)}
<p><b>Why the subtraction.</b> For "ace or heart" you must remove the double-counted card: P(A or B) = P(A) + P(B) - P(A and B) = 4/52 + 13/52 - 1/52. Say "mutually exclusive" only if the events cannot happen together.</p>`,
lvl:'E',freq:3,
follow:[`What is the probability of getting a sum of 7 or 11 with two dice?`,`Are two events that are mutually exclusive also independent?`],
mistake:`Adding probabilities of events that overlap without subtracting the overlap.`,
tags:['stats','probability']},

{q:`What is expected value? A game costs Rs 10 to play: you roll a fair die and win Rs 30 only if it shows 6. Should you play?`,
short:`Expected value is the long-run average outcome: each outcome multiplied by its probability, then added. Here the expected win is 30 x 1/6 = Rs 5, less the Rs 10 cost, so on average you lose Rs 5 per game and should not play.`,
a:`<p>Net outcomes: with probability 1/6 you get +30 - 10 = <b>+20</b>; with probability 5/6 you get <b>-10</b>.</p>
<p>EV = (1/6) x 20 + (5/6) x (-10) = 3.33 - 8.33 = <b>-5</b>.</p>
${py(`ev = (1/6) * 20 + (5/6) * (-10)
print(round(ev, 2))
print(round(30 * (1/6) - 10, 2))`)}
${out(`-5.0
-5.0`)}
<p>EV is an average over many plays, not what happens in one play: you may win once, but over 600 plays you lose about Rs 3,000. The game would be fair if the prize were Rs 60 (60 x 1/6 = 10). Analysts use the same idea for decisions: expected revenue of a discount offer is (conversion rate x margin) minus cost.</p>`,
lvl:'E',freq:2,
follow:[`What prize would make the game fair?`,`How is expected value used in a business decision?`],
mistake:`Forgetting to subtract the cost, or confusing the expected value with a result you will see in one play.`,
tags:['stats','probability']},

{q:`What are Type I and Type II errors? What are alpha, beta and power?`,
short:`Type I is a false positive: you reject the null when it is actually true, and its probability is alpha, usually 5%. Type II is a false negative: you miss a real effect, with probability beta. Power equals 1 minus beta, the chance of detecting a real effect.`,
a:`<table><tr><th></th><th>Truth: no effect</th><th>Truth: real effect</th></tr>
<tr><td><b>Test says effect</b></td><td>Type I error (alpha)</td><td>Correct (power = 1 - beta)</td></tr>
<tr><td><b>Test says no effect</b></td><td>Correct (1 - alpha)</td><td>Type II error (beta)</td></tr></table>
<p><b>A/B example.</b> Type I: you launch a new checkout page that does nothing. Type II: you throw away a page that really would have raised sales. Which is worse depends on cost: launching a risky change blindly (Type I) vs. missing a big win (Type II).</p>
<p><b>Controls.</b> You choose alpha before the test. Power goes up with a larger sample, a bigger true effect, and less noisy data; typical target is 80%. Lowering alpha (stricter test) reduces Type I errors but increases Type II unless you raise the sample size.</p>`,
lvl:'E',freq:3,
follow:[`If you set alpha to 0.01, what happens to power?`,`How do you increase the power of a test?`],
mistake:`Mixing up the two types, or saying alpha is the probability that the null is true.`,
tags:['stats','hypothesis']},

{q:`What is a p-value? Explain a hypothesis test in simple steps.`,
short:`The p-value is the probability of seeing a result at least this extreme if the null hypothesis were true. A small p-value says the data is surprising under the null, so we reject it. It is not the probability that the null is true, and it does not measure the size of the effect.`,
a:`<ol><li>State the null H0 (no difference) and the alternative H1 (there is a difference).</li>
<li>Choose alpha (usually 0.05) before looking at results.</li>
<li>Compute a test statistic and its p-value from the data.</li>
<li>If p &lt; alpha, reject H0 ("statistically significant"); otherwise "fail to reject" (we did not find enough evidence, which is not proof of no effect).</li></ol>
<p><b>Plain example.</b> A coin lands heads 9 out of 10 times. If the coin were fair, getting 9 or more heads (or 9 or more tails) in 10 flips has probability 2 x (10 + 1)/1024 = 22/1024 = <b>0.021</b>. That is small, so we doubt the coin is fair.</p>
${py(`from math import comb
p_one_side = (comb(10, 9) + comb(10, 10)) / 2 ** 10
print(round(p_one_side, 4), round(2 * p_one_side, 4))`)}
${out(`0.0107 0.0215`)}
<p><b>Common wrong statements.</b> "p = 0.021 means a 2.1% chance the coin is fair" (wrong), "p = 0.21 proves the coin is fair" (wrong). A tiny p-value can also come from a trivially small effect when the sample is huge.</p>`,
lvl:'E',freq:3,
follow:[`What is the difference between one-sided and two-sided p-values?`,`Does p &gt; 0.05 mean there is no effect?`],
mistake:`Saying the p-value is the probability that the null hypothesis is true.`,
tags:['stats','hypothesis','p-value']},

/* ---------------- MEDIUM ---------------- */
{q:`An A/B test shows p = 0.04. What does that mean, and what do you do?`,
short:`If the new version truly made no difference, we would see a result this extreme only about 4% of the time. It is below 0.05, so it is statistically significant, but I would not ship on that alone. I check the effect size and its confidence interval, the planned sample size, that I did not peek or test many metrics, guardrail metrics and the business impact.`,
a:`<p><b>What p = 0.04 says.</b> Assuming no real difference, there is a 4% chance of a gap at least this large from random noise alone. It is <b>not</b> a 96% chance that the new version is better.</p>
<p><b>My checklist before deciding:</b></p>
<ol><li><b>Effect size and CI.</b> Is the lift worth it? For example, lift = +0.2 percentage points with a 95% CI of [0.01, 0.39] is "significant" but possibly too small to matter.</li>
<li><b>Design.</b> Was the sample size fixed in advance and reached, and the test run for full weekly cycles? Stopping the first time p dips below 0.05 inflates false positives.</li>
<li><b>Multiple comparisons.</b> Did we look at 10 metrics or 5 variants? Then one p = 0.04 is not surprising (see the multiple testing question).</li>
<li><b>Data health.</b> Is the traffic split as planned (no sample ratio mismatch), no tracking bugs, no bots?</li>
<li><b>Guardrails.</b> Did revenue per user, page speed or complaints get worse?</li>
<li><b>Practical significance and cost.</b> Does the benefit exceed the cost of building and maintaining the change?</li></ol>
<p><b>Decision wording.</b> "The result is statistically significant at the 5% level. The estimated lift is X with a 95% CI of Y to Z, guardrails are fine, so I recommend rolling out gradually / re-running to confirm." p = 0.04 is only moderate evidence: it is close to the threshold, so replication is reasonable when the cost of being wrong is high.</p>`,
lvl:'M',freq:3,
follow:[`What if p = 0.06 instead?`,`The sample size is huge and the lift is 0.01%. Do you ship?`],
mistake:`Saying "96% sure the new version is better", or shipping without looking at the effect size and guardrails.`,
tags:['stats','ab-test','p-value']},

{q:`Calculate and interpret a 95% confidence interval for a mean.`,
short:`A 95% CI for the mean is sample mean plus or minus about 1.96 standard errors, where the standard error is SD divided by the square root of n. If we repeated the study many times, about 95% of the intervals built this way would contain the true mean. A bigger sample gives a narrower interval.`,
a:`<p>Sample: mean = <b>50</b> minutes, sample SD = <b>10</b>, n = <b>100</b> (average time on an app).</p>
<ul><li>Standard error SE = 10 / sqrt(100) = <b>1</b></li>
<li>95% CI is approximately 50 +/- 1.96 x 1 = <b>48.04 to 51.96</b></li>
<li>With n = 100 the t-distribution (t = 1.984, 99 degrees of freedom) gives 48.02 to 51.98, almost the same.</li></ul>
${py(`from scipy import stats
mean, sd, n = 50, 10, 100
se = sd / n ** 0.5
print(se, round(mean - 1.96 * se, 2), round(mean + 1.96 * se, 2))
t = stats.t.ppf(0.975, n - 1)
print(round(t, 3), round(mean - t * se, 2), round(mean + t * se, 2))
print(round(1.96 * 10 / 400 ** 0.5, 2))`)}
${out(`1.0 48.04 51.96
1.984 48.02 51.98
0.98`)}
<p><b>Interpretation (careful wording).</b> "We are 95% confident the true mean lies between 48.0 and 52.0" is the normal interview phrase. Strictly, the 95% describes the method: 95% of intervals made this way capture the true mean. It does <b>not</b> mean 95% of the individual users fall in this range. Quadrupling the sample to 400 halves the SE (10 / 20 = 0.5) and the margin becomes 0.98.</p>`,
lvl:'M',freq:3,
follow:[`What happens to the CI if you want 99% confidence?`,`When do you use t instead of z?`],
mistake:`Saying the interval contains 95% of the data, or that the true mean has a 95% probability of being inside this one fixed interval.`,
tags:['stats','confidence-interval']},

{q:`Worked A/B test: version A converts 200 of 2,000 visitors, version B converts 250 of 2,000. Is B better? Run the test.`,
short:`The rates are 10% and 12.5%, a lift of 2.5 percentage points. I run a two-proportion z-test: pooled rate, standard error, then z. Here z is about 2.50 and the two-sided p-value is about 0.012, so the difference is statistically significant at 5%.`,
a:`<p>H0: the true conversion rates are equal. Two-sided test, alpha = 0.05.</p>
<ol><li>p_A = 200/2000 = 0.10, p_B = 250/2000 = 0.125, difference = <b>0.025</b>.</li>
<li>Pooled rate p = (200 + 250) / 4000 = <b>0.1125</b>.</li>
<li>SE = sqrt( p(1 - p) x (1/2000 + 1/2000) ) = sqrt(0.1125 x 0.8875 x 0.001) = <b>0.00999</b>.</li>
<li>z = 0.025 / 0.00999 = <b>2.50</b>.</li>
<li>Two-sided p-value = 2 x P(Z &gt; 2.50) = <b>0.0124</b>. Since 0.0124 &lt; 0.05, reject H0.</li>
<li>95% CI for the difference (unpooled SE = 0.00998): 0.025 +/- 1.96 x 0.00998 = <b>0.54 to 4.46 percentage points</b>.</li></ol>
${py(`from math import sqrt, erfc
xa, xb, n = 200, 250, 2000
pa, pb = xa / n, xb / n
p = (xa + xb) / (2 * n)
se = sqrt(p * (1 - p) * (2 / n))
z = (pb - pa) / se
pval = erfc(abs(z) / sqrt(2))                 # two-sided normal p-value
print(round(se, 5), round(z, 2), round(pval, 4))
se_u = sqrt(pa * (1 - pa) / n + pb * (1 - pb) / n)
print(round((pb - pa - 1.96 * se_u) * 100, 2), round((pb - pa + 1.96 * se_u) * 100, 2))`)}
${out(`0.00999 2.5 0.0124
0.54 4.46`)}
<p><b>Conclusion to say.</b> B is better by 2.5 points (a 25% relative lift), p = 0.012, CI 0.5 to 4.5 points: the lift is probably real but could be small, and the decision should also consider cost and guardrail metrics. If the data came from one-sided hypothesis "B is better" you would halve the p-value, but decide the direction before the test.</p>`,
lvl:'M',freq:3,
follow:[`Why do we pool the rates for the standard error?`,`How would you run it with scipy or statsmodels?`],
mistake:`Comparing 10% and 12.5% by eye, without checking whether the gap is bigger than random noise for this sample size.`,
tags:['stats','ab-test','z-test']},

{q:`Survey margin of error: how many respondents do you need for a +/- 3% margin? What does the margin of error mean?`,
short:`For a proportion the 95% margin of error is about 1.96 times the square root of p(1-p)/n. The worst case is p = 50%, giving roughly 1 divided by the square root of n. So n = 1,000 gives about +/- 3.1 points, and to halve the margin you need four times the sample.`,
a:`<p>Worst case p = 0.5: margin = 1.96 x sqrt(0.25 / n).</p>
<ul><li>n = 100: 1.96 x 0.05 = <b>+/- 9.8 points</b></li>
<li>n = 400: 1.96 x 0.025 = <b>+/- 4.9 points</b></li>
<li>n = 1,000: 1.96 x 0.0158 = <b>+/- 3.1 points</b></li></ul>
${py(`from math import sqrt, ceil
for n in (100, 400, 1000):
    print(n, round(1.96 * sqrt(0.25 / n) * 100, 1))
print(ceil(1.96 ** 2 * 0.25 / 0.03 ** 2))      # n for +/- 3 points`)}
${out(`100 9.8
400 4.9
1000 3.1
1068`)}
<p>For exactly +/- 3 points you need n = 1.96^2 x 0.25 / 0.03^2 = <b>1,068</b>. Meaning: if 52% of 1,000 respondents prefer a brand, the true population share is likely between about 49% and 55%. It only covers random sampling error. It says nothing about bias from a poor sample or badly worded questions, and it applies to the total sample: sub-groups (for example women aged 18-24) have much fewer respondents and a much wider margin. Your survey experience is relevant here, say so.</p>`,
lvl:'M',freq:3,
follow:[`Why does the margin shrink only with the square root of n?`,`What happens to the margin for a sub-group of 100 people?`],
mistake:`Believing the margin of error also protects against sampling bias.`,
tags:['stats','survey','confidence-interval']},

{q:`Explain the Central Limit Theorem and the standard error. Why does it matter?`,
short:`The CLT says that the distribution of sample means becomes approximately normal as the sample size grows, whatever the shape of the original data, with a spread equal to the standard deviation divided by the square root of n. That is why we can use normal-based tests and confidence intervals for means.`,
a:`<p>Suppose daily spend per user is right-skewed with mean <b>50</b> and SD <b>20</b>. The individual values are not normal. But if you repeatedly take samples of n = 100 and compute each sample's mean:</p>
<ul><li>The sample means cluster around 50 (the population mean).</li>
<li>Their spread is the <b>standard error</b> = 20 / sqrt(100) = <b>2</b>.</li>
<li>Their histogram is close to a bell curve, so about 95% of sample means fall within 50 +/- 2 x 2 = 46 to 54.</li></ul>
<p><b>Why it matters.</b> It justifies t-tests, z-tests and CIs for means even when raw data is skewed, provided n is reasonably large (a rule of thumb is 30 or more, more for very skewed data). Distinguish: SD describes spread of <i>individual values</i>, SE describes spread of the <i>sample mean</i>. SE shrinks with sqrt(n); SD does not shrink with more data.</p>
${py(`sd, n = 20, 100
se = sd / n ** 0.5
print(se, 50 - 2 * se, 50 + 2 * se)`)}
${out(`2.0 46.0 54.0`)}`,
lvl:'M',freq:3,
follow:[`Does the CLT say the data becomes normal as n grows?`,`When does the CLT work poorly?`],
mistake:`Saying the data itself becomes normal. Only the distribution of the sample mean does.`,
tags:['stats','clt']},

{q:`Conditional probability and Bayes: a disease affects 1% of people. A test is 90% sensitive and 95% specific. You test positive. What is the chance you have the disease?`,
short:`Only about 15%. Most people are healthy, so even a small false-positive rate produces more false positives than there are true positives. I show it with 10,000 people: 90 true positives and 495 false positives, so 90 out of 585 positives are really sick.`,
a:`<p>Use natural frequencies, imagine <b>10,000 people</b>:</p>
<ul><li>Sick: 1% = <b>100</b> people. The test finds 90% = <b>90</b> true positives (10 missed).</li>
<li>Healthy: <b>9,900</b> people. Specificity 95% means 5% false positives = <b>495</b>.</li>
<li>Total positives = 90 + 495 = <b>585</b>. Chance sick given positive = 90 / 585 = <b>15.4%</b>.</li></ul>
<p>Bayes' formula: P(D|+) = P(+|D) P(D) / [P(+|D) P(D) + P(+|not D) P(not D)] = (0.9 x 0.01) / (0.9 x 0.01 + 0.05 x 0.99) = 0.009 / 0.0585.</p>
${py(`prev, sens, spec = 0.01, 0.90, 0.95
tp = prev * sens
fp = (1 - prev) * (1 - spec)
print(round(tp, 4), round(fp, 4), round(tp / (tp + fp), 3))`)}
${out(`0.009 0.0495 0.154`)}
<p><b>Message.</b> A positive test is not a diagnosis when the condition is rare. This is the base-rate effect, and the same idea applies to fraud alerts and spam filters: most alerts can be false alarms. Do not confuse P(positive | sick) = 90% with P(sick | positive) = 15%.</p>`,
lvl:'M',freq:3,
follow:[`What if the disease prevalence were 20%?`,`What is the difference between sensitivity and specificity?`],
mistake:`Answering 90%, which mixes up P(positive given sick) with P(sick given positive).`,
tags:['stats','probability','bayes']},

{q:`Which hypothesis test would you use: t-test, z-test, chi-square, ANOVA? How do you choose?`,
short:`I choose by the type of outcome and the number of groups. Comparing means of two groups: t-test. Means of three or more groups: ANOVA. Counts or proportions across categories: chi-square, or a two-proportion z-test for two conversion rates. If the data is very skewed or ordinal, a non-parametric test such as Mann-Whitney.`,
a:`<table><tr><th>Question</th><th>Test</th></tr>
<tr><td>Mean of two independent groups (average order value, A vs B)</td><td>Independent (Welch) t-test</td></tr>
<tr><td>Same people before vs after</td><td>Paired t-test</td></tr>
<tr><td>Means of 3+ groups</td><td>One-way ANOVA</td></tr>
<tr><td>Two conversion rates (large n)</td><td>Two-proportion z-test (or chi-square on a 2x2)</td></tr>
<tr><td>Two categorical variables (region vs plan)</td><td>Chi-square test of independence</td></tr>
<tr><td>Skewed or ordinal data (Likert), small n</td><td>Mann-Whitney U (two groups), Kruskal-Wallis (3+)</td></tr>
<tr><td>Relationship between two numeric variables</td><td>Correlation test / regression</td></tr></table>
<p><b>Assumptions to mention.</b> Observations independent; for t-tests the sample means are roughly normal (fine for large n by the CLT); for chi-square the expected count in each cell is at least about 5. Use Welch's version when the two groups may have different variances. Always report effect size and a confidence interval, not only the p-value.</p>`,
lvl:'M',freq:3,
follow:[`Why not run several t-tests instead of ANOVA?`,`What does the chi-square test actually compare?`],
mistake:`Using a t-test on counts/categories, or a chi-square test on averages.`,
tags:['stats','hypothesis']},

{q:`Do a chi-square test of independence on a small 2x2 table.`,
short:`I compare the observed counts with the counts I would expect if the two variables were unrelated, and sum (observed - expected)^2 / expected over all cells. A big total, compared to the chi-square distribution, gives a small p-value.`,
a:`<p>50 people in each of two groups were asked if they prefer the new design: Group A 30 yes / 20 no, Group B 20 yes / 30 no.</p>
<ul><li>Totals: 50 yes and 50 no overall, so under independence each cell is expected to be 100 x (50/100) x (50/100) = <b>25</b>.</li>
<li>Chi-square = (30-25)^2/25 + (20-25)^2/25 + (20-25)^2/25 + (30-25)^2/25 = 1 + 1 + 1 + 1 = <b>4.0</b>.</li>
<li>Degrees of freedom = (2-1) x (2-1) = 1. The 5% critical value for 1 df is 3.84, and 4.0 &gt; 3.84, so p is about <b>0.046</b>: significant.</li></ul>
${py(`from scipy import stats
obs = [[30, 20], [20, 30]]
chi2, p, dof, expected = stats.chi2_contingency(obs, correction=False)
print(chi2, round(p, 4), dof)
print(expected.tolist())
chi2c, pc, _, _ = stats.chi2_contingency(obs)          # default for 2x2: Yates correction
print(round(chi2c, 2), round(pc, 4))`)}
${out(`4.0 0.0455 1
[[25.0, 25.0], [25.0, 25.0]]
3.24 0.0719`)}
<p><b>Careful.</b> scipy applies Yates' continuity correction to a 2x2 table by default, which gives chi-square 3.24 and p = 0.072 (not significant). The hand calculation above is the uncorrected one. The result is borderline, so the honest statement is "weak evidence of a difference", not "proof". Small expected counts (below 5) make chi-square unreliable; use Fisher's exact test then.</p>`,
lvl:'M',freq:2,
follow:[`What are the degrees of freedom for a 3x4 table?`,`Does a significant chi-square tell you the strength of the association?`],
mistake:`Using percentages instead of counts in the chi-square formula.`,
tags:['stats','chi-square']},

{q:`How do you decide the sample size for an A/B test? What is power and MDE? Is there a rule of thumb?`,
short:`Sample size depends on the baseline rate, the smallest lift you care about (the minimum detectable effect), alpha and the power. A handy rule is n per group is about 16 times the variance divided by the square of the lift, for 5% alpha and 80% power. Small lifts need very large samples.`,
a:`<p><b>Inputs:</b> baseline conversion, MDE (smallest change worth detecting), alpha (5%), power (80%).</p>
<p><b>Rule of thumb</b> (alpha 5% two-sided, power 80%): n per group = <b>16 x p(1 - p) / delta^2</b>, where delta is the absolute lift and p the baseline (use the average of the two rates for a better estimate).</p>
<p><b>Example.</b> Baseline 10%, you want to detect a lift to 12% (delta = 0.02).</p>
<ul><li>Rule with p = 0.10: 16 x 0.09 / 0.0004 = <b>3,600</b> per group.</li>
<li>Using the average rate 0.11: 16 x 0.11 x 0.89 / 0.0004 = <b>3,916</b> per group.</li>
<li>Exact normal formula: about <b>3,838</b> per group, so the rule is in the right range.</li></ul>
${py(`za, zb = 1.96, 0.8416                    # 5% two-sided, 80% power
p1, p2 = 0.10, 0.12
n = (za + zb) ** 2 * (p1 * (1 - p1) + p2 * (1 - p2)) / (p2 - p1) ** 2
print(round(16 * 0.09 / 0.02 ** 2), round(16 * 0.11 * 0.89 / 0.02 ** 2), round(n))
n_half = (za + zb) ** 2 * (p1 * (1 - p1) + 0.11 * 0.89) / 0.01 ** 2
print(round(n_half / n, 1))`)}
${out(`3600 3916 3838
3.8`)}
<p><b>Intuition.</b> Halving the lift you want to detect needs about 4 times the sample (delta is squared). Higher power or smaller alpha also needs more. With 2,000 visitors a day split equally, about 3,900 per group takes roughly 4 days, but run at least a full week to cover weekday effects. A test with too few users is "under-powered": it can miss real wins, and the wins it does find tend to be exaggerated.</p>`,
lvl:'M',freq:3,
follow:[`Why must you decide the sample size before starting?`,`The sample you need would take 6 months. What can you do?`],
mistake:`Starting a test without a sample size and ending it when it "looks significant".`,
tags:['stats','ab-test','sample-size']},

{q:`How would you design an A/B test end to end? What can go wrong?`,
short:`State a hypothesis and one primary metric with guardrails, randomise users into groups, compute the sample size, run for full business cycles without peeking, check that the split is as planned, then analyse with a pre-agreed test and decide using effect size and its interval.`,
a:`<ol><li><b>Hypothesis and metric.</b> "A shorter checkout form raises purchase conversion." Primary metric: purchase rate per user. Guardrails: revenue per user, page load time, refunds.</li>
<li><b>Unit of randomisation.</b> Usually the user (not the page view), so one person always sees one version.</li>
<li><b>Sample size and duration.</b> From baseline, MDE, alpha, power; run at least 1-2 full weeks to cover weekday and weekend behaviour.</li>
<li><b>Randomise and check.</b> Verify the split (for example 50/50) and that the groups look alike on pre-test traits.</li>
<li><b>Run without peeking</b> or use a sequential method designed for it.</li>
<li><b>Analyse</b> with the planned test; report lift, CI and p-value, and look at guardrails and key segments (careful with many slices).</li>
<li><b>Decide</b> on practical value, then roll out gradually.</li></ol>
<p><b>What goes wrong:</b> sample ratio mismatch (the split is 52/48 instead of 50/50, which signals a bug), peeking, running multiple metrics, novelty effect (users click a new thing because it is new), seasonality or a marketing campaign during the test, users in both groups, and interference between users (network effects).</p>`,
lvl:'M',freq:3,
follow:[`What is a novelty effect?`,`What if you cannot randomise?`],
mistake:`Skipping the sample size and the guardrail metrics, and ending the test when the result "looks good".`,
tags:['stats','ab-test']},

{q:`Why is peeking at results or testing many metrics a problem? What is the multiple comparisons problem?`,
short:`Each test has a 5% chance of a false positive, so the more tests or looks you do, the more likely at least one false positive appears. With 20 independent tests at 5%, there is a 64% chance of at least one. Fix it by fixing the plan in advance, correcting the threshold (for example Bonferroni), and focusing on one primary metric.`,
a:`<p>P(at least one false positive in k independent tests) = 1 - (1 - 0.05)^k.</p>
<ul><li>k = 5: 1 - 0.95^5 = <b>22.6%</b></li>
<li>k = 20: 1 - 0.95^20 = <b>64.2%</b></li></ul>
${py(`for k in (1, 5, 20):
    print(k, round(1 - 0.95 ** k, 3), round(0.05 / k, 4))`)}
${out(`1 0.05 0.05
5 0.226 0.01
20 0.642 0.0025`)}
<p>The third number is the <b>Bonferroni</b> threshold, alpha divided by the number of tests (5 tests: 0.01 each). It is simple and conservative. <b>Peeking</b> is the same problem over time: checking the p-value every day and stopping when it first dips below 0.05 gives far more than a 5% false-positive rate. Also "slicing" results by many segments after the fact (new users, Android, Pune, ...) until something is significant is fishing; treat such findings as ideas to test next, not conclusions.</p>`,
lvl:'M',freq:2,
follow:[`What is a false discovery rate?`,`How is a primary metric different from a secondary metric?`],
mistake:`Looking at 20 segments, finding one with p &lt; 0.05 and reporting it as a result.`,
tags:['stats','ab-test','p-value']},

{q:`What is Simpson's paradox? Give a worked example.`,
short:`A trend that holds inside every group can reverse when the groups are combined, because the groups have very different sizes and the mix hides the real comparison. So I always check the result by key segments before trusting an overall number.`,
a:`<p>Two ad versions, with leads split into easy and hard (conversions / leads):</p>
<table><tr><th></th><th>Easy leads</th><th>Hard leads</th><th>Overall</th></tr>
<tr><td>Ad A</td><td>81 / 87 = 93.1%</td><td>192 / 263 = 73.0%</td><td>273 / 350 = <b>78.0%</b></td></tr>
<tr><td>Ad B</td><td>234 / 270 = 86.7%</td><td>55 / 80 = 68.8%</td><td>289 / 350 = <b>82.6%</b></td></tr></table>
<p>A is better in <b>both</b> groups, yet B looks better overall. Why? Ad A was shown mostly to hard leads (263 of its 350) while Ad B got mostly easy leads (270 of 350). The overall rate mixes "ad quality" with "lead difficulty".</p>
${py(`a = [(81, 87), (192, 263)]
b = [(234, 270), (55, 80)]
rate = lambda s: round(sum(x for x, n in s) / sum(n for x, n in s), 3)
print([round(x / n, 3) for x, n in a], [round(x / n, 3) for x, n in b])
print(rate(a), rate(b))`)}
${out(`[0.931, 0.73] [0.867, 0.688]
0.78 0.826`)}
<p><b>Which number to trust?</b> Here, the per-group numbers, because lead difficulty is a confounder that affected who saw which ad. In a properly randomised A/B test both ads get a similar mix of leads, which prevents the problem. In general: understand how the data was generated, then decide whether to segment.</p>`,
lvl:'M',freq:3,
follow:[`How would randomisation prevent this?`,`Have you seen this in real data, such as conversion by device?`],
mistake:`Quoting only the overall rate when group sizes are very uneven.`,
tags:['stats','simpsons-paradox']},

{q:`How do you detect outliers using IQR and z-score, with numbers? What do you do with them?`,
short:`With IQR, anything below Q1 minus 1.5 IQR or above Q3 plus 1.5 IQR is flagged. With z-score, anything beyond 3 standard deviations is flagged. Then I investigate: if it is a data error I fix or remove it, if it is genuine I keep it, cap it, or analyse it separately.`,
a:`<p>Data: <b>4, 5, 6, 7, 8, 9, 10, 11, 40</b> (n = 9).</p>
<ul><li><b>IQR rule:</b> Q1 = 6, Q3 = 10, IQR = 4. Lower fence = 6 - 6 = 0, upper fence = 10 + 6 = 16. The value <b>40</b> is outside, so it is an outlier.</li>
<li><b>z-score:</b> mean = 11.11, sample SD = 11.07. For 40: z = (40 - 11.11) / 11.07 = <b>2.61</b>. Under the usual cut-off of 3 it is <b>not</b> flagged, because the outlier inflated the mean and SD. With n = 9 a z above 2.67 is impossible.</li></ul>
${py(`import numpy as np
d = np.array([4, 5, 6, 7, 8, 9, 10, 11, 40])
q1, q3 = np.percentile(d, [25, 75])
print(q1, q3, q1 - 1.5 * (q3 - q1), q3 + 1.5 * (q3 - q1))
print(round(d.mean(), 2), round(d.std(ddof=1), 2), round((40 - d.mean()) / d.std(ddof=1), 2))`)}
${out(`6.0 10.0 0.0 16.0
11.11 11.07 2.61`)}
<p><b>Treatment.</b> 1) Check if it is an entry error (400 typed as 40, wrong unit). 2) If real, keep it and report the median and IQR, or analyse with and without it. 3) Cap (winsorise) at the fences, or transform (log). Never delete a point only because it hurts the result. IQR is the safer default for skewed or small data.</p>`,
lvl:'M',freq:3,
follow:[`Why is the multiplier 1.5?`,`How do outliers affect mean, median and correlation?`],
mistake:`Removing outliers automatically before checking whether they are real.`,
tags:['stats','outliers']},

/* ---------------- HARD ---------------- */
{q:`Explain simple linear regression and R-squared with a small example.`,
short:`Regression fits the straight line y = a + b x that minimises the squared gaps between the line and the points. The slope b says how much y changes for one unit of x, and R-squared is the share of the variation in y that the line explains, between 0 and 1.`,
a:`<p>Data: x = 1, 2, 3, 4, 5 (ad spend) and y = 2, 4, 5, 4, 5 (sales).</p>
<ul><li>Means: x-bar = 3, y-bar = 4.</li>
<li>Slope b = sum((x - 3)(y - 4)) / sum((x - 3)^2) = 6 / 10 = <b>0.6</b>. Intercept a = 4 - 0.6 x 3 = <b>2.2</b>. Line: y = 2.2 + 0.6x.</li>
<li>Fitted values: 2.8, 3.4, 4.0, 4.6, 5.2. Residuals: -0.8, 0.6, 1.0, -0.6, -0.2. Unexplained variation SSE = 0.64 + 0.36 + 1 + 0.36 + 0.04 = <b>2.4</b>.</li>
<li>Total variation SST = sum((y - 4)^2) = 4 + 0 + 1 + 0 + 1 = <b>6</b>.</li>
<li>R-squared = 1 - SSE/SST = 1 - 2.4/6 = <b>0.60</b> (equals r squared; r = 0.775).</li></ul>
${py(`from scipy import stats
r = stats.linregress([1, 2, 3, 4, 5], [2, 4, 5, 4, 5])
print(round(r.slope, 2), round(r.intercept, 2), round(r.rvalue, 3), round(r.rvalue ** 2, 2))`)}
${out(`0.6 2.2 0.775 0.6`)}
<p><b>Interpretation.</b> "Each extra unit of ad spend goes with 0.6 more units of sales; the line explains 60% of the variation in sales." Warnings: R-squared always rises when you add variables (use adjusted R-squared), a high R-squared does not prove causation, and always plot the data: outliers or a curved pattern can mislead. Do not predict far outside the range of x you saw.</p>`,
lvl:'H',freq:2,
follow:[`What does a low R-squared mean? Is the model useless?`,`What are the main assumptions of linear regression?`],
mistake:`Saying R-squared 0.6 means the model is "60% accurate", or that x causes y.`,
tags:['stats','regression']},

{q:`An A/B test shows a lift of +2 percentage points with a 95% CI of [-0.5, +4.5]. What do you conclude?`,
short:`The data is consistent with anything from a small drop to a decent gain, and the interval includes zero, so the result is not statistically significant at 5% (p is about 0.12). That does not prove no effect; it means the test is inconclusive. I would extend or repeat with more sample, or decide based on cost and risk.`,
a:`<p>A 95% CI that contains 0 corresponds to a two-sided p-value above 0.05. We can back out the p-value: half-width = 2.5 points, so SE = 2.5 / 1.96 = 1.276 points; z = 2 / 1.276 = 1.57; two-sided p = <b>0.117</b>.</p>
${py(`from math import erfc, sqrt
est, lo, hi = 2.0, -0.5, 4.5
se = (hi - lo) / (2 * 1.96)
z = est / se
print(round(se, 3), round(z, 2), round(erfc(abs(z) / sqrt(2)), 3))`)}
${out(`1.276 1.57 0.117`)}
<p><b>What I say.</b> "We cannot rule out zero effect, but we also cannot rule out a gain up to 4.5 points. The test was not precise enough." Options: (1) extend the test or rerun with a sample size based on the lift we care about; (2) if the change is cheap and low-risk, and the downside (-0.5) is acceptable, ship it as a judgement call and monitor; (3) if it is costly, do not ship. <b>Avoid</b> saying "B has no effect" or "the result is nearly significant, so B wins". The CI is more informative than p alone: it shows both the plausible size and the uncertainty.</p>`,
lvl:'H',freq:3,
follow:[`How is the CI related to the p-value?`,`How would you plan the next test?`],
mistake:`Treating "not significant" as "proved no difference".`,
tags:['stats','ab-test','confidence-interval']},

{q:`One-sided vs two-sided test, and paired vs independent t-test: when do you use which? Show why pairing matters.`,
short:`A two-sided test looks for a difference in either direction and is the safe default. A one-sided test is only for a direction decided in advance. Use a paired test when the same people are measured twice, because it removes person-to-person variation and is much more sensitive.`,
a:`<p>Five students' scores before and after a training:</p>
<ul><li>Before: 70, 65, 80, 75, 60. After: 74, 66, 85, 78, 63.</li>
<li>Differences: 4, 1, 5, 3, 3. Mean difference = <b>3.2</b>, SD of differences = <b>1.48</b>.</li>
<li>Paired t = 3.2 / (1.48 / sqrt(5)) = 3.2 / 0.663 = <b>4.82</b>, 4 degrees of freedom, two-sided p = <b>0.0085</b>.</li>
<li>Wrongly treating them as two independent groups: the students differ a lot from each other (60 to 80), so the 3.2 gain is buried: t = 0.60, p = <b>0.565</b>.</li></ul>
${py(`from scipy import stats
before = [70, 65, 80, 75, 60]
after = [74, 66, 85, 78, 63]
print([round(float(v), 4) for v in stats.ttest_rel(after, before)[:2]])
print([round(float(v), 4) for v in stats.ttest_ind(after, before)[:2]])
print(round(float(stats.ttest_rel(after, before, alternative='greater').pvalue), 4))`)}
${out(`[4.8242, 0.0085]
[0.6, 0.5651]
0.0042`)}
<p><b>One- vs two-sided.</b> The one-sided p (alternative "after is greater") is 0.0042, exactly half of 0.0085. That is the temptation to pick one-sided afterwards to get a smaller p: this is cheating unless you committed to the direction before seeing the data and would truly ignore an effect in the other direction. For A/B tests a harmful change matters too, so two-sided is standard. Paired data are the same units measured twice (before/after, left/right); independent groups are different units.</p>`,
lvl:'H',freq:2,
follow:[`Give an A/B example where pairing is not possible.`,`Which test would you use for before/after with skewed differences?`],
mistake:`Using an independent test on paired data, or choosing one-sided after seeing the data.`,
tags:['stats','hypothesis','t-test']},

{q:`Bayes follow-up: the same person takes the same test again and is positive again. What is the chance now? What assumption are you making?`,
short:`The first positive moved the chance from 1% to about 15.4%. I use 15.4% as the new starting point and update again with a second positive, which gives about 77%. This assumes the two test results are independent given the person's true status.`,
a:`<p>Update step by step with the same test (sensitivity 90%, specificity 95%).</p>
<ul><li>Prior before test 2 = <b>0.1538</b> (the result of the first positive).</li>
<li>True positive mass = 0.1538 x 0.90 = 0.1385. False positive mass = 0.8462 x 0.05 = 0.0423.</li>
<li>Posterior = 0.1385 / (0.1385 + 0.0423) = <b>0.766</b>.</li></ul>
<p>Shortcut: both positives together: sick = 0.01 x 0.9 x 0.9 = 0.0081, healthy = 0.99 x 0.05 x 0.05 = 0.002475, posterior = 0.0081 / (0.0081 + 0.002475) = 0.766.</p>
${py(`prior = 0.01
for k in (1, 2):
    tp = prior * 0.90
    fp = (1 - prior) * 0.05
    prior = tp / (tp + fp)
    print(k, round(prior, 3))
print(round(0.01 * 0.81 / (0.01 * 0.81 + 0.99 * 0.0025), 3))`)}
${out(`1 0.154
2 0.766
0.766`)}
<p><b>Assumption.</b> Independence of the two tests given the person's true status. If the false positives come from something persistent in that person (for example a cross-reacting condition), the same test would repeat the same error and the real answer would be lower than 77%. So a confirmatory test should ideally use a <i>different</i> method. This is the logic behind two-step screening and fraud-alert reviews.</p>`,
lvl:'H',freq:2,
follow:[`What is the difference between Bayes with frequencies and the formula?`,`What if the second test is negative?`],
mistake:`Re-using the original 1% prevalence as the prior for the second test instead of the updated probability.`,
tags:['stats','probability','bayes']},

{q:`Your survey sample has 70% women and 30% men, but the population is 50/50. Women score satisfaction 8 and men 6. How do you correct the overall average, and what are the limits of weighting?`,
short:`I give each respondent a weight equal to population share divided by sample share, so women count less and men more. The unweighted mean of 7.4 becomes a weighted mean of 7.0. Weighting fixes the mix of known traits but cannot fix bias in who answered inside each group.`,
a:`<ul><li>Unweighted mean = 0.7 x 8 + 0.3 x 6 = 5.6 + 1.8 = <b>7.4</b> (the sample over-represents the happier group).</li>
<li>Weights: women = 0.5 / 0.7 = <b>0.714</b>, men = 0.5 / 0.3 = <b>1.667</b>.</li>
<li>Weighted mean = (70 x 0.714 x 8 + 30 x 1.667 x 6) / (70 x 0.714 + 30 x 1.667) = (400 + 300) / 100 = <b>7.0</b>, which equals 0.5 x 8 + 0.5 x 6.</li></ul>
${py(`import numpy as np
share_s = {'F': 0.7, 'M': 0.3}
share_p = {'F': 0.5, 'M': 0.5}
w = {g: share_p[g] / share_s[g] for g in share_s}
score = {'F': 8, 'M': 6}
n = {'F': 70, 'M': 30}
num = sum(n[g] * w[g] * score[g] for g in n)
den = sum(n[g] * w[g] for g in n)
print({g: round(v, 3) for g, v in w.items()}, round(num / den, 2))
print(round(0.7 * 8 + 0.3 * 6, 1))`)}
${out(`{'F': 0.714, 'M': 1.667} 7.0
7.4`)}
<p><b>Limits.</b> (1) Weights only help for traits you know the population split of (age, gender, region). (2) The women who answered may still differ from the women who did not (non-response bias inside the group). (3) Large weights (for example 5 or more) make the estimate unstable and increase variance, so trim them or merge small groups. (4) Report both weighted and unweighted base sizes. Your survey background gives you an advantage here: mention quotas and raking (iterative weighting on several traits).</p>`,
lvl:'H',freq:2,
follow:[`What is raking (iterative proportional fitting)?`,`What is the effect of weighting on the margin of error?`],
mistake:`Believing weighting removes all bias, or using very large weights without checking the effect on stability.`,
tags:['stats','survey','sampling']},

{q:`In an A/B test, the traffic split should be 50/50 but you see 10,300 users in A and 9,700 in B. Is this a problem? Show the check.`,
short:`Yes, it is probably a bug. This is a sample ratio mismatch. A chi-square test against the planned 50/50 split gives chi-square 18 and p of about 0.00002, far too small to be chance, so I would not trust the test results until the cause (assignment or tracking bug) is found.`,
a:`<p>Expected under a true 50/50 split: 10,000 in each (total 20,000).</p>
<ul><li>Chi-square = (10300 - 10000)^2 / 10000 + (9700 - 10000)^2 / 10000 = 9 + 9 = <b>18</b>.</li>
<li>1 degree of freedom: the 0.1% critical value is 10.8, and 18 is above that, so p is about <b>0.00002</b>.</li></ul>
${py(`from scipy import stats
res = stats.chisquare([10300, 9700])          # equal expected counts by default
print(float(res.statistic), float(res.pvalue) < 0.001, round(float(res.pvalue), 6))`)}
${out(`18.0 True 2.2e-05`)}
<p><b>Why serious.</b> The difference of 600 users looks small (3%), but with 20,000 users the random variation in each group is only about 71 users (SD of the count = sqrt(20000 x 0.25)), so a gap of 300 is more than 4 SD away. Random assignment should not produce this. Typical causes: a bot filter that hits one version, a redirect or slow page loses users in B, a tracking pixel that fails, or the assignment logic is broken. When the missing users are not random, the groups are no longer comparable and the conversion difference may be an artefact. Teams usually run this SRM check with a strict threshold (p &lt; 0.001) before reading any result. <b>Action:</b> pause, find the cause, fix, rerun. Do not "fix" it by dropping random users.</p>`,
lvl:'H',freq:2,
follow:[`What other checks do you run before reading results?`,`What if the mismatch was only 50.2% vs 49.8%?`],
mistake:`Ignoring a "small" imbalance and reading the conversion result anyway.`,
tags:['stats','ab-test','chi-square']}
]};
})();
