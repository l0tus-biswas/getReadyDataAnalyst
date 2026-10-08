/* Week 7 guide: Statistics + Business Thinking */
GUIDES[7] = {
  intro: `<p><b>Why this week matters.</b> Almost every manager round has a "case" question ("sales dropped 25%, what do you do?") or a stats question ("p-value is 0.04, what does it mean?"). You do not need advanced maths. You need clear definitions, small worked numbers, and a calm structure you can say aloud.</p>
<p><b>By Sunday you will be able to:</b> calculate mean, median, standard deviation and IQR by hand; explain the normal curve, CLT, p-value, confidence interval and Type I/II errors in plain words; read an A/B test result; define 10 business KPIs; and answer a metric-drop case with a fixed framework.</p>
<p><b>Time split:</b> Mon-Fri 1.5 h each (about 30 min learn, 45 min practice by hand, 15 min speak your answers aloud). Saturday 3.5 h: case practice with a timed mock. Sunday 3.5 h: review, KPI sheet and survey statistics (your edge as a survey programmer).</p>
<p><b>Tip:</b> Use a calculator and a notebook. Doing the arithmetic by hand once makes the idea stick for ever.</p>`,
  days: [
    /* ---------------- MON ---------------- */
    {
      title: 'Descriptive statistics',
      time: '1.5 h',
      study: [
        'Mean = sum of values divided by count. It is pulled by very large or very small values (outliers).',
        'Median = the middle value after sorting. It is not affected by outliers, so use it for skewed data like salary or delivery days.',
        'Mode = the most frequent value. Useful for categories (most common payment type).',
        'Variance = average of squared distances from the mean. Standard deviation (std dev) = square root of variance, in the same unit as the data.',
        'Sample std dev divides by n-1 (use when your data is a sample, the default in Excel STDEV.S and pandas .std()). Population std dev divides by n.',
        'Percentile: the value below which a given % of data falls. Quartiles are the 25th, 50th and 75th percentiles (Q1, Q2, Q3).',
        'IQR = Q3 - Q1. The outlier rule: a value below Q1 - 1.5 x IQR or above Q3 + 1.5 x IQR is flagged as an outlier.',
        'Rule: if mean is much bigger than median, the data is right-skewed (a long tail of large values).'
      ],
      how: [
        '[10 min] Read the study points once. Say each definition aloud in one sentence.',
        '[15 min] Work through the example below on paper. Do not just read it. Cover the answer and compute first.',
        '[10 min] In Excel, type the example values in A1:A7. Check with =AVERAGE, =MEDIAN, =MODE.SNGL, =STDEV.S, =QUARTILE.INC(A1:A7,1), =QUARTILE.INC(A1:A7,3). Your hand answers must match.',
        '[10 min] In Python run the pandas snippet in the example and compare.',
        '[30 min] Solve the practice questions below by hand, then check the answers.',
        '[15 min] Say the important questions aloud (30 seconds each). Record yourself on your phone once.'
      ],
      example: `<p><b>Data:</b> delivery days of 7 orders: 2, 4, 4, 5, 7, 9, 30 (already sorted, n = 7).</p>
<p><b>Mean</b> = (2+4+4+5+7+9+30) / 7 = 61 / 7 = <b>8.71</b>. <b>Median</b> = 4th value = <b>5</b>. <b>Mode</b> = <b>4</b> (appears twice). Mean is far above median because of the 30, so the data is right-skewed.</p>
<p><b>Quartiles</b> (Excel QUARTILE.INC and pandas default): position = (n-1) x p. Q1: 6 x 0.25 = 1.5, so halfway between the 2nd and 3rd values (index 1 and 2: 4 and 4) = 4. Q3: 6 x 0.75 = 4.5, halfway between index 4 and 5 (7 and 9) = 8.</p>
${pre(`IQR   = Q3 - Q1 = 8 - 4 = 4
Lower fence = Q1 - 1.5 x IQR = 4 - 6 = -2
Upper fence = Q3 + 1.5 x IQR = 8 + 6 = 14
30 > 14  -> 30 is an outlier`)}
<p><b>Std dev, small clean example:</b> data 4, 6, 8, 10, 12. Mean = 8. Distances: -4, -2, 0, 2, 4. Squares: 16, 4, 0, 4, 16, total 40.</p>
${pre(`Sample variance     = 40 / (5-1) = 10     -> sample std dev     = sqrt(10) = 3.16
Population variance = 40 / 5     = 8      -> population std dev = sqrt(8)  = 2.83`)}
<p>Meaning: a typical value is about 3 units away from the mean.</p>
${pre(`import pandas as pd
s = pd.Series([2, 4, 4, 5, 7, 9, 30])
print(s.mean(), s.median(), s.mode()[0])   # 8.714..., 5.0, 4
print(s.quantile([0.25, 0.75]))            # 4.0 and 8.0
print(s.std())                             # sample std dev = 9.66
print(s.describe())`)}
<p>Line by line: <code>quantile</code> uses the same linear rule as Excel QUARTILE.INC, so you get 4 and 8. <code>.std()</code> is the sample version (n-1). Tools may give slightly different quartiles on small data: that is normal, say which method you used.</p>`,
      practice: [
        ['Find the mean and median of 3, 5, 7, 9, 100. Which one describes a "typical" value better?', `${pre(`Mean   = (3+5+7+9+100) / 5 = 124 / 5 = 24.8
Median = middle of sorted list = 7`)}<p>Median (7) is better because 100 is an outlier and drags the mean to 24.8, which is not close to any normal value.</p>`],
        ['What is the mode of 2, 3, 3, 4, 4, 4, 5? What if all values are different?', `<p>Mode = <b>4</b> (appears 3 times). If every value is different there is no mode (or all values tie). Mode is mostly used for categories.</p>`],
        ['Find the population and sample std dev of 2, 4, 4, 4, 5, 5, 7, 9.', `${pre(`Mean = 40 / 8 = 5
Distances: -3 -1 -1 -1 0 0 2 4
Squares  :  9  1  1  1 0 0 4 16  -> total 32
Population variance = 32/8 = 4      -> std dev = 2
Sample variance     = 32/7 = 4.571  -> std dev = 2.14`)}<p>Population gives exactly 2. Sample is a little larger because dividing by n-1 corrects for using a sample.</p>`],
        ['Data: 10, 12, 13, 14, 15, 16, 18, 45. Use the IQR rule. Is 45 an outlier?', `${pre(`n = 8, positions = 7 x p
Q1: 7 x 0.25 = 1.75 -> 12 + 0.75 x (13-12) = 12.75
Q3: 7 x 0.75 = 5.25 -> 16 + 0.25 x (18-16) = 16.5
IQR = 16.5 - 12.75 = 3.75
Upper fence = 16.5 + 1.5 x 3.75 = 22.125
Lower fence = 12.75 - 5.625 = 7.125`)}<p>45 &gt; 22.125, so <b>yes, 45 is an outlier</b>. 10 is above 7.125 so it is fine.</p>`],
        ['What is the 90th percentile of 1, 2, 3, ..., 10 (Excel PERCENTILE.INC method)?', `${pre(`position = (n-1) x 0.9 = 9 x 0.9 = 8.1 (counting from 0)
index 8 = 9, index 9 = 10
value = 9 + 0.1 x (10 - 9) = 9.1`)}<p>The 90th percentile is 9.1. Meaning: about 90% of values are below it.</p>`],
        ['A report shows average salary 12 lakh but median 7 lakh. What does this tell you and which do you show the CEO?', `<p>Mean &gt; median by a lot means the data is right-skewed: a few very high salaries pull the average up. Show the <b>median</b> as the typical salary, and mention the mean and the spread (for example Q1-Q3) so nothing is hidden.</p>`]
      ],
      important: [
        ['When would you use median instead of mean?', `<p>When data is skewed or has outliers, for example salary, order value, delivery time. The median is the middle value and is not moved by extreme values. I usually show both and the gap between them tells me how skewed the data is.</p>`],
        ['What is standard deviation and what does a high value mean?', `<p>It measures how far values typically are from the mean, in the same unit as the data. High std dev means values are spread out and the mean is less representative. For example two stores with the same average sales can have very different std dev, and the unstable one is riskier.</p>`],
        ['How do you detect outliers and what do you do with them?', `<p>I use the IQR rule (below Q1 - 1.5 IQR or above Q3 + 1.5 IQR) or a z-score above 3, and I also plot a box plot. I then investigate: is it a data error (fix or remove), or a real extreme event (keep, and report with median or capped values)? I never delete outliers without checking the cause.</p>`],
        ['Why does sample std dev divide by n-1?', `<p>The sample mean is calculated from the same data, so the data sits slightly closer to it than to the true mean. Dividing by n-1 corrects that bias, so the sample variance is a fair estimate of the population variance.</p>`]
      ],
      resources: [['Khan Academy Statistics', 'https://www.khanacademy.org/math/statistics-probability'], ['StatQuest (YouTube)', 'https://www.youtube.com/@statquest']],
      done: 'You are done when you can calculate mean, median, std dev and IQR outliers for 8 numbers by hand and explain why median beats mean for skewed data.'
    },
    /* ---------------- TUE ---------------- */
    {
      title: 'Distributions, sampling and CLT',
      time: '1.5 h',
      study: [
        'Population = everyone you care about. Sample = the part you actually measured. A statistic (sample mean) estimates a parameter (population mean).',
        'Normal distribution: bell shape, symmetric around the mean. Defined by the mean and the std dev.',
        '68-95-99.7 rule: about 68% of values fall within 1 std dev of the mean, 95% within 2, 99.7% within 3.',
        'Z-score = (value - mean) / std dev. It tells how many std devs a value is from the mean. Beyond +/-3 is rare.',
        'Skew: right-skewed has a long tail on the right (mean > median); left-skewed is the opposite. Order values and delivery times are usually right-skewed.',
        'Standard error (SE) of a mean = std dev / sqrt(n). It tells how much the sample mean would jump around between samples. More data = smaller SE.',
        'Central Limit Theorem (CLT): if you take many samples, the sample MEANS form a roughly normal curve, even when the raw data is skewed, once n is reasonably large (a common rule: n of about 30 or more).',
        'Why CLT matters: it lets us build confidence intervals and run tests on means and proportions.'
      ],
      how: [
        '[10 min] Read the study list. Draw a bell curve on paper and mark -3 to +3 std devs with 68/95/99.7.',
        '[15 min] Do the z-score example below by hand.',
        '[15 min] In Excel, simulate CLT: in A1:A1000 type =-LN(RAND())*10 (right-skewed data). Make a histogram. Then in column C make 200 sample means: in C1 =AVERAGE(OFFSET($A$1,(ROW()-1)*5,0,5,1)) and fill down to C200 (each is the mean of 5 values). Make a histogram of column C. It should look more bell-shaped and narrower. Optional: change 5 to 30 and compare.',
        '[30 min] Solve the practice questions by hand.',
        '[15 min] Say the CLT explanation aloud in 30 seconds without the word "theorem".',
        '[5 min] Write 3 lines in your notebook: population vs sample, SE, CLT.'
      ],
      example: `<p><b>Z-score.</b> A test has mean 60 and std dev 10. Riya scored 80.</p>
${pre(`z = (80 - 60) / 10 = 2.0
By 68-95-99.7: 95% of people score between 40 and 80.
So 5% are outside, 2.5% above 80 and 2.5% below 40.
Riya is in about the top 2.5%  (exact: 97.7th percentile)`)}
<p><b>CLT and standard error.</b> Order values have mean Rs 800 and std dev Rs 400 (skewed). You take a sample of n = 100 orders.</p>
${pre(`SE = 400 / sqrt(100) = 400 / 10 = 40
The sample mean will usually be within 2 x 40 = Rs 80 of 800
(95% of sample means between 720 and 880)

With n = 400:  SE = 400 / 20 = 20   -> four times the data halves the error`)}
<p>Explain simply: individual orders vary a lot (std dev 400), but the average of 100 orders varies much less (SE 40). That is why averages from big samples are reliable.</p>
${pre(`import numpy as np
rng = np.random.default_rng(1)
data = rng.exponential(scale=10, size=100000)          # skewed
means = [rng.choice(data, 30).mean() for _ in range(2000)]
print(round(data.mean(),1), round(np.std(means),2))    # about 10 and about 1.8
# std of means is about 10/sqrt(30) = 1.83`)}`,
      practice: [
        ['Exam mean = 70, std dev = 8. Find the z-score of a student with 54 and of a student with 86.', `${pre(`z(54) = (54-70)/8 = -2.0
z(86) = (86-70)/8 = +2.0`)}<p>Both are 2 std devs away, one below and one above the average.</p>`],
        ['Heights are normal with mean 160 cm and std dev 10 cm. What % of people are between 150 and 170 cm? Above 180 cm?', `<p>150 and 170 are mean +/- 1 std dev, so about <b>68%</b>. 180 is +2 std devs. About 95% lie between 140 and 180, so 5% are outside and 2.5% are above 180: about <b>2.5%</b>.</p>`],
        ['Daily orders have mean 500 and std dev 50. A day has 680 orders. Is it unusual?', `${pre(`z = (680 - 500) / 50 = 3.6`)}<p>Beyond 3 std devs happens about 0.3% of the time, so yes, very unusual. Check for a campaign, a bulk order, or a tracking bug.</p>`],
        ['Std dev of customer ratings is 1.2. What is the standard error of the mean for n = 36 and for n = 144?', `${pre(`n = 36 : SE = 1.2 / 6  = 0.2
n = 144: SE = 1.2 / 12 = 0.1`)}<p>Four times the sample halves the SE.</p>`],
        ['Survey: 1,600 respondents, 50% say "yes". What is the standard error of the proportion? Give the range 95% of surveys would fall in.', `${pre(`SE = sqrt( p(1-p) / n ) = sqrt( 0.5 x 0.5 / 1600 )
   = sqrt(0.0001563) = 0.0125  (1.25 percentage points)
95% range = 50% +/- 1.96 x 1.25% = 50% +/- 2.45%  -> 47.55% to 52.45%`)}<p>This is the margin of error idea, you will use it again on Sunday.</p>`],
        ['Explain in two sentences why the average of a sample is more stable than a single value, even if the data is not normal.', `<p>A single value can be any extreme value, but in an average the highs and lows cancel out, so the spread shrinks by sqrt(n). By the CLT, those sample averages also look roughly normal when n is big enough, even if the raw data is skewed.</p>`]
      ],
      important: [
        ['Explain the Central Limit Theorem in simple words.', `<p>If you repeatedly take samples and calculate their averages, those averages form a bell-shaped curve centred on the true average, even when the original data is skewed. The bigger the sample, the narrower the bell (spread = std dev divided by square root of n). It is why we can use normal-based confidence intervals and tests on real, messy data.</p>`],
        ['What is the difference between population and sample?', `<p>Population is the full group I want to learn about, such as all customers. A sample is the subset I actually measure, such as 1,000 surveyed customers. I use the sample statistic to estimate the population parameter, and I must make sure the sample is random and representative, otherwise it is biased.</p>`],
        ['What is a z-score and where have you used it?', `<p>It is (value - mean) / std dev, the number of standard deviations a value is from the mean. I use it to compare values on different scales and to flag outliers: beyond about 3 means unusual. For example, in survey data I can flag respondents whose completion time has a very low z-score as possible speeders.</p>`]
      ],
      resources: [['Khan Academy Statistics', 'https://www.khanacademy.org/math/statistics-probability'], ['StatQuest (YouTube)', 'https://www.youtube.com/@statquest']],
      done: 'You are done when you can compute a z-score, apply the 68-95-99.7 rule, calculate a standard error and explain CLT aloud in 30 seconds.'
    },
    /* ---------------- WED ---------------- */
    {
      title: 'Correlation, hypothesis tests, p-value, CI',
      time: '1.5 h',
      study: [
        'Correlation (r) measures how strongly two numeric variables move together, from -1 to +1. 0 means no straight-line relation.',
        'Correlation is not causation: a third factor (confounder), reverse direction, or coincidence can create it. Experiments (A/B tests) are how we prove cause.',
        'Hypothesis test: H0 (null) = "no effect / no difference". H1 (alternative) = "there is an effect". We ask: if H0 were true, how surprising is our data?',
        'p-value = the probability of getting a result at least this extreme if H0 were true. It is NOT the probability that H0 is true.',
        'Significance level alpha (usually 0.05): if p &lt; alpha we reject H0 ("statistically significant").',
        'Confidence interval (CI): a range of plausible values for the true number. A 95% CI means the method captures the true value in 95% of repeated samples. Rough formula for a mean: estimate +/- 1.96 x SE.',
        'Type I error = false positive (reject H0 when it is true), probability = alpha. Type II error = false negative (miss a real effect), probability = beta. Power = 1 - beta.',
        'Statistically significant is not the same as practically important. With huge samples tiny, useless differences become significant.'
      ],
      how: [
        '[10 min] Read the study list. Write H0 and H1 for "does the new app version raise the average rating?".',
        '[20 min] Work the correlation and z-test examples below on paper.',
        '[10 min] In Excel check correlation with =CORREL(range_x, range_y) using the example data.',
        '[30 min] Solve practice questions.',
        '[15 min] Practise the "p-value = 0.04" answer aloud, three times, until it is smooth.',
        '[5 min] Add a table to your notebook: Type I vs Type II with a real-life example (spam filter or medical test).'
      ],
      example: `<p><b>Correlation.</b> x = ad spend (in thousands): 1, 2, 3, 4, 5. y = sales (in lakhs): 2, 4, 5, 4, 5.</p>
${pre(`mean x = 3, mean y = 4
dx = -2 -1 0 1 2
dy = -2  0 1 0 1
sum(dx*dy) = 4 + 0 + 0 + 0 + 2 = 6
sum(dx^2)  = 4+1+0+1+4 = 10
sum(dy^2)  = 4+0+1+0+1 = 6
r = 6 / sqrt(10 x 6) = 6 / 7.746 = 0.775`)}
<p>r = 0.78 means a strong positive relation. It does not prove ads cause sales: maybe both rise in festival season.</p>
<p><b>Confidence interval and test for a mean.</b> 100 customers rated service. Mean 4.2, std dev 1.0. Is the true average different from the target 4.0?</p>
${pre(`SE = 1.0 / sqrt(100) = 0.1
95% CI = 4.2 +/- 1.96 x 0.1 = 4.2 +/- 0.196  -> [4.004, 4.396]

H0: true mean = 4.0     H1: true mean is not 4.0
z = (4.2 - 4.0) / 0.1 = 2.0
two-sided p-value = about 0.0455`)}
<p>Reading it: p = 0.0455 is less than 0.05, so we reject H0. This agrees with the CI, which just barely excludes 4.0. Honest wording: "the average rating is about 4.2, and the true value is likely between 4.0 and 4.4. The difference from 4.0 is small, so check if 0.2 matters to the business." (For small samples tools use the t-distribution, but the idea is the same.)</p>
${pre(`from scipy import stats
print(stats.pearsonr([1,2,3,4,5],[2,4,5,4,5])[0])   # 0.7746`)}`,
      practice: [
        ['Ice-cream sales and drowning cases both rise in summer, r = 0.9. Does ice cream cause drowning?', `<p>No. Hot weather (a confounder) increases both. Correlation shows a link, not a cause. To prove cause you need a controlled experiment or careful causal analysis.</p>`],
        ['A test gives p = 0.03 at alpha = 0.05. What is your decision and what does 0.03 mean?', `<p>p &lt; 0.05, so reject H0 (significant). Meaning: if there were truly no effect, we would see a result this extreme or more about 3% of the time. It does not mean there is a 97% chance the effect is real.</p>`],
        ['n = 64, sample mean = 52, std dev = 8, H0: mean = 50. Compute SE, z, 95% CI and decide at alpha 0.05.', `${pre(`SE = 8 / sqrt(64) = 1
z  = (52 - 50) / 1 = 2.0     -> p about 0.0455 (two-sided)
95% CI = 52 +/- 1.96 x 1 = [50.04, 53.96]`)}<p>p &lt; 0.05 and the CI does not contain 50, so reject H0. Same conclusion both ways.</p>`],
        ['Give a business example of Type I and Type II error for a fraud-detection model.', `<p><b>Type I (false positive):</b> a genuine customer's payment is blocked as fraud. <b>Type II (false negative):</b> a real fraud payment passes. Which hurts more depends on cost: blocked customers lose trust, missed fraud loses money. We choose the threshold using these costs.</p>`],
        ['Compute r for x = 1, 2, 3 and y = 6, 4, 2. Explain the sign.', `${pre(`mean x = 2, mean y = 4
dx = -1 0 1, dy = 2 0 -2
sum(dx*dy) = -2 + 0 - 2 = -4
sum(dx^2) = 2, sum(dy^2) = 8
r = -4 / sqrt(2 x 8) = -4 / 4 = -1`)}<p>r = -1: a perfect negative line. When x goes up, y goes down.</p>`],
        ['A 95% CI for the average delivery time is [3.8, 4.4] days. A colleague says "95% chance the true mean is in this range". Is that exactly right?', `<p>Strictly, no. The true mean is a fixed number. The 95% refers to the method: if we repeated the sampling many times, 95% of the intervals built this way would contain the true mean. In interviews it is fine to say "we are 95% confident the true mean lies in this range", just do not say it is the probability that H0 is true or that 95% of orders fall in the range.</p>`]
      ],
      important: [
        ['What is a p-value? Explain to a non-technical manager.', `<p>It answers: "if nothing really changed, how often would we still see a difference this big just by luck?" A small p-value, below 0.05, means luck is an unlikely explanation, so we treat the difference as real. It does not say how big or how useful the difference is.</p>`],
        ['What is a confidence interval and why is it better than just a p-value?', `<p>It is a range of plausible values for the true effect, such as "conversion went up by 0.2 to 1.1 percentage points". It shows both significance (does it include zero?) and size and uncertainty, which helps the business judge if the effect is worth acting on.</p>`],
        ['What are Type I and Type II errors?', `<p>Type I is a false alarm: we say there is an effect when there is none, probability alpha, usually 5%. Type II is a miss: we fail to detect a real effect, probability beta. Power is 1 minus beta, usually aimed at 80%. Lowering one error usually raises the other unless you collect more data.</p>`],
        ['Correlation vs causation: how do you establish causation?', `<p>Correlation shows two things move together. For causation I need to rule out confounders and reverse direction, best done by a randomised experiment like an A/B test. When we cannot experiment, I use matched comparisons or before/after with control groups and state the limits.</p>`]
      ],
      resources: [['Khan Academy Statistics', 'https://www.khanacademy.org/math/statistics-probability'], ['StatQuest (YouTube)', 'https://www.youtube.com/@statquest']],
      done: 'You are done when you can explain p-value, CI and Type I/II errors in plain words, and run a one-sample z-test with arithmetic.'
    },
    /* ---------------- THU ---------------- */
    {
      title: 'A/B testing',
      time: '1.5 h',
      study: [
        'A/B test = a randomised experiment. Users are randomly split into control (A, old version) and treatment (B, new version). Only one thing differs.',
        'Primary metric: the one number that decides the test (for example checkout conversion rate). Pick it BEFORE the test.',
        'Guardrail metrics: things that must not get worse (page load time, refund rate, unsubscribe rate), even if the primary metric improves.',
        'Randomisation unit: usually the user, not the page view, so one person always sees one version.',
        'Sample size depends on baseline rate, the smallest effect you care about (MDE, minimum detectable effect), alpha (0.05) and power (0.8). Smaller effects need much more data.',
        'Rough rule for conversion tests (alpha 0.05, power 0.8): users per group = 16 x p(1-p) / d^2, where p is the baseline rate and d is the absolute lift you want to detect.',
        'Run for full business cycles (at least 1-2 whole weeks) so weekday and weekend behaviour are both covered.',
        'Pitfalls: peeking and stopping early, testing many metrics (multiple comparisons), sample ratio mismatch (SRM, the split is not what you planned), novelty effect, and contamination between groups.'
      ],
      how: [
        '[10 min] Read the study list. Write the 6 parts of a test plan: hypothesis, primary metric, guardrails, unit, sample size, duration.',
        '[20 min] Work through the conversion example below, including the z-test arithmetic.',
        '[10 min] Run the Python snippet (needs scipy and statsmodels, pip install statsmodels) or just use an online A/B calculator to confirm p of about 0.058.',
        '[30 min] Solve practice questions.',
        '[15 min] Write a one-paragraph test plan for "a green Buy button instead of blue" and say it aloud.',
        '[5 min] Note 4 pitfalls on a sticky note.'
      ],
      example: `<p><b>Result table</b> (checkout page test, 2 weeks):</p>
${pre(`Group      Users    Conversions   Rate
Control    10,000   500           5.0%
Treatment  10,000   560           5.6%
Lift = +0.6 percentage points = +12% relative (0.6 / 5.0)`)}
<p><b>Is it significant?</b> Use the two-proportion z-test.</p>
${pre(`pooled p = (500 + 560) / 20,000 = 0.053
SE = sqrt( 0.053 x 0.947 x (1/10000 + 1/10000) )
   = sqrt( 0.050191 x 0.0002 )
   = sqrt(0.00001004) = 0.003168
z  = 0.006 / 0.003168 = 1.89
two-sided p = about 0.058

95% CI for the difference = 0.006 +/- 1.96 x 0.003168
                          = 0.006 +/- 0.0062 = [-0.0002, +0.0122]`)}
<p><b>Reading it:</b> p = 0.058 is above 0.05, and the CI includes zero. We cannot claim a win yet. We also cannot say "no effect": the CI says the true lift could be from about 0 to 1.2 points. Good answer: "Not statistically significant at 95%. The effect may be positive, so extend the test or run it with a bigger sample, rather than calling it a failure or a success."</p>
<p><b>Sample size idea.</b> Baseline 5%, you want to detect +1 point (d = 0.01):</p>
${pre(`n per group = 16 x 0.05 x 0.95 / 0.01^2 = 16 x 0.0475 / 0.0001 = 7,600
Total = 15,200 users
Half the effect (d = 0.005) -> 4 times the users = 30,400 per group
(The 16 rule is a rough guide: an exact power calculation for 5% vs 6% gives about 8,150 per group.)`)}
${pre(`from statsmodels.stats.proportion import proportions_ztest
z, p = proportions_ztest([560, 500], [10000, 10000])
print(round(z,2), round(p,3))     # 1.89 0.058`)}`,
      practice: [
        ['Control: 200 conversions of 2,000. Treatment: 260 of 2,000. Compute both rates and the relative lift.', `${pre(`Control   = 200/2000 = 10%
Treatment = 260/2000 = 13%
Absolute lift = 3 points, relative lift = 3/10 = 30%`)}`],
        ['For the same data run the z-test and decide at 95%.', `${pre(`pooled p = 460 / 4000 = 0.115
SE = sqrt( 0.115 x 0.885 x (2/2000) ) = sqrt(0.101775 x 0.001) = 0.01009
z  = 0.03 / 0.01009 = 2.97   -> p about 0.003`)}<p>p &lt; 0.05, so significant. Roll out, after checking guardrails.</p>`],
        ['Baseline conversion is 10%. You want to detect a 2-point absolute lift. How many users per group? If the site gets 1,000 eligible users a day (both groups together), how long to run?', `${pre(`n = 16 x 0.10 x 0.90 / 0.02^2 = 16 x 0.09 / 0.0004 = 3,600 per group
Total = 7,200 users -> 7.2 days at 1,000/day`)}<p>Run for <b>14 days</b> (two full weeks) to cover weekday and weekend behaviour, even though 8 days gives enough users.</p>`],
        ['You planned a 50/50 split. You got 10,000 users in control and 10,600 in treatment. Is that a problem?', `${pre(`Total = 20,600, expected 10,300 each
Chi-square = (10000-10300)^2/10300 + (10600-10300)^2/10300
           = 8.74 + 8.74 = 17.5   (1 degree of freedom, critical 3.84)`)}<p>p &lt; 0.001: this is a <b>sample ratio mismatch (SRM)</b>. Something is wrong with assignment or tracking. Do not trust the results until you find the bug.</p>`],
        ['Treatment lifts conversion but page load time goes from 2s to 4s. What do you do?', `<p>Load time is a guardrail. A 2-second slowdown can hurt SEO, mobile users and later purchases. Do not ship blindly: check whether the lift holds for slow-network users, try to fix performance, and re-test. Decide with the business cost of each.</p>`],
        ['The test shows p = 0.04 after day 3 of a planned 14 days. The PM wants to stop and launch. What do you say?', `<p>Do not stop. Checking daily and stopping at the first p &lt; 0.05 ("peeking") inflates false positives far above 5%. Early data is also noisy and misses weekend behaviour. Stick to the planned sample size, or use a method designed for sequential testing agreed beforehand.</p>`]
      ],
      important: [
        ['How do you design an A/B test?', `<p>State a hypothesis and one primary metric, add guardrail metrics, choose the randomisation unit (usually user), calculate sample size from baseline rate, minimum detectable effect, alpha 0.05 and power 0.8, run for whole weeks, check for sample ratio mismatch, then analyse once at the end with a significance test and a confidence interval, and make a business decision.</p>`],
        ['An A/B test shows p = 0.04. What do you do?', `<p>It means that with no real difference, we would see this result about 4% of the time, so it is significant at 5%. Before acting I check effect size and its CI (is it worth it?), sample size and duration, whether I peeked or tested many metrics, guardrails, and SRM. If all good, I recommend rollout, maybe gradually.</p>`],
        ['What are common A/B testing pitfalls?', `<p>Peeking and stopping early, running too short or not covering a full week, testing many metrics or segments until something is significant, sample ratio mismatch, novelty effect where users click new things just because they are new, and users seeing both versions. I also remember that significant does not mean important.</p>`]
      ],
      resources: [['StatQuest (YouTube)', 'https://www.youtube.com/@statquest'], ['Khan Academy Statistics', 'https://www.khanacademy.org/math/statistics-probability']],
      done: 'You are done when you can read an A/B result table, do the z-test arithmetic, estimate sample size with the 16 x p(1-p)/d^2 rule and name 4 pitfalls.'
    },
    /* ---------------- FRI ---------------- */
    {
      title: 'Business KPIs, funnel, cohort, RFM',
      time: '1.5 h',
      study: [
        'Conversion rate = conversions / visitors (or sessions). AOV (average order value) = revenue / number of orders.',
        'Churn rate = customers lost in a period / customers at the start of the period. Retention rate = 1 - churn (or: customers still active / starting customers).',
        'CAC (customer acquisition cost) = marketing + sales spend / number of NEW customers gained.',
        'LTV (lifetime value) = money a customer brings over their life. Simple version: monthly margin per customer / monthly churn rate.',
        'ROI = (gain - cost) / cost. ROAS (return on ad spend) = revenue / ad spend. ROI should use profit, ROAS uses revenue, do not mix them.',
        'Funnel: ordered steps (visit, product view, add to cart, checkout, purchase). Step conversion = step N / step N-1. Find the biggest drop.',
        'Cohort: a group of customers who started in the same period (for example January signups). Cohort retention tables show what % of each cohort is active in month 1, 2, 3...',
        'RFM: score customers by Recency (days since last order, lower is better), Frequency (number of orders) and Monetary (total spend). Used to find champions and at-risk customers.'
      ],
      how: [
        '[10 min] Read the study list. Write each formula on a flash card (front: name, back: formula).',
        '[20 min] Work the KPI numbers below on paper.',
        '[15 min] Do the funnel and cohort tables in Excel: type the numbers, compute step % with a formula, and add conditional formatting colour scale on the cohort table.',
        '[10 min] Read the RFM SQL and run it on any orders table you have (for example your Project 1 data or a quick test table).',
        '[25 min] Solve practice questions.',
        '[10 min] Start your 1-page KPI cheat sheet (this is a week deliverable): KPI, formula, example, what to do if it falls.'
      ],
      example: `<p><b>One month of an online shop.</b></p>
${pre(`Visits 50,000   Orders 2,000   Revenue Rs 10,00,000
Customers at start 2,000, lost during month 100
Marketing spend Rs 2,00,000, new customers gained 400
Gross margin 40%

Conversion = 2,000 / 50,000     = 4%
AOV        = 10,00,000 / 2,000  = Rs 500
Churn      = 100 / 2,000        = 5%      Retention = 95%
CAC        = 2,00,000 / 400     = Rs 500
Margin per customer per month (say monthly revenue per customer Rs 500 x 40%) = Rs 200
LTV        = 200 / 0.05         = Rs 4,000   (lifespan = 1/0.05 = 20 months)
LTV : CAC  = 4,000 / 500        = 8 : 1   (3:1 or more is considered healthy)`)}
<p><b>ROI vs ROAS.</b> An ad campaign costs Rs 1,00,000 and brings Rs 3,00,000 revenue at 30% margin.</p>
${pre(`ROAS = 3,00,000 / 1,00,000 = 3.0
Profit = 3,00,000 x 30% = 90,000
ROI = (90,000 - 1,00,000) / 1,00,000 = -10%`)}
<p>ROAS looks great (3x) but profit ROI is negative. This is a classic interview insight.</p>
<p><b>Funnel.</b></p>
${pre(`Step           Users   Step conversion
Visit          10,000  -
Product view    3,000  30.0%
Add to cart       600  20.0%   <- biggest drop
Checkout          300  50.0%
Purchase          200  66.7%
Overall = 200 / 10,000 = 2%`)}
<p><b>Cohort retention</b> (customers active in each month after first purchase):</p>
${pre(`Cohort   Size   M0     M1    M2    M3
Jan      200    100%   30%   22%   18%
Feb      250    100%   34%   25%   -
Mar      300    100%   28%   -     -`)}
<p>Read across a row for one cohort's life, down a column to compare cohorts at the same age. March M1 is lower than Feb, so check what changed in March (campaign quality, delivery issues).</p>
<p><b>RFM in SQL</b> (table <code>sales(customer_id, order_date DATE, amount)</code>, PostgreSQL). NTILE(5) splits customers into 5 equal groups; 5 is best:</p>
${pre(`WITH rfm AS (
  SELECT customer_id,
         DATE '2024-12-31' - MAX(order_date) AS recency_days,
         COUNT(*)    AS frequency,
         SUM(amount) AS monetary
  FROM sales
  GROUP BY customer_id
)
SELECT customer_id, recency_days, frequency, monetary,
       NTILE(5) OVER (ORDER BY recency_days DESC) AS r_score,  -- long gap = 1, recent = 5
       NTILE(5) OVER (ORDER BY frequency)         AS f_score,
       NTILE(5) OVER (ORDER BY monetary)          AS m_score
FROM rfm;`)}
<p>Champions have r, f, m all 4-5. "At risk" customers have high f and m but low r (they used to buy a lot and have gone quiet).</p>`,
      practice: [
        ['Visits 20,000; orders 600; revenue Rs 3,60,000. Compute conversion and AOV.', `${pre(`Conversion = 600 / 20,000 = 3%
AOV = 3,60,000 / 600 = Rs 600`)}`],
        ['500 subscribers at the start of March, 25 cancel, 40 new join. Compute churn rate.', `${pre(`Churn = 25 / 500 = 5%   (new joiners are NOT in the numerator or denominator)
Ending subscribers = 500 - 25 + 40 = 515`)}`],
        ['Spend on ads Rs 5,00,000 gave 1,000 new customers. Each customer gives Rs 1,500 lifetime profit. Compute CAC, LTV:CAC and say if it is worth it.', `${pre(`CAC = 5,00,000 / 1,000 = Rs 500
LTV:CAC = 1,500 / 500 = 3 : 1`)}<p>3:1 is the usual healthy benchmark, so yes, worth it, but check the payback time (how many months to recover Rs 500).</p>`],
        ['Funnel: 8,000 visits, 2,400 product views, 480 add to cart, 240 checkout, 120 purchase. Find step conversions and the biggest leak.', `${pre(`views / visits   = 2400/8000 = 30%
cart / views     = 480/2400  = 20%
checkout / cart  = 240/480   = 50%
purchase / check = 120/240   = 50%
overall = 120/8000 = 1.5%`)}<p>Lowest step rate is view to cart (20%). But also compare against benchmarks and past data: a 20% step might be normal, and the real problem could be the 50% checkout drop. Segment before deciding.</p>`],
        ['A campaign cost Rs 2,00,000 and produced Rs 5,00,000 revenue at 25% margin. Compute ROAS and ROI.', `${pre(`ROAS = 5,00,000 / 2,00,000 = 2.5
Profit = 5,00,000 x 25% = 1,25,000
ROI = (1,25,000 - 2,00,000) / 2,00,000 = -37.5%`)}<p>Loss-making despite 2.5x ROAS. Margin matters.</p>`],
        ['Write a SQL query (PostgreSQL) for monthly active customers and the number of repeat customers (2 or more orders) using sales(customer_id, order_date, amount).', `${pre(`-- monthly active customers
SELECT DATE_TRUNC('month', order_date)::date AS month,
       COUNT(DISTINCT customer_id) AS active_customers
FROM sales
GROUP BY 1
ORDER BY 1;

-- repeat customers overall
SELECT COUNT(*) AS repeat_customers
FROM (
  SELECT customer_id
  FROM sales
  GROUP BY customer_id
  HAVING COUNT(*) >= 2
) t;`)}<p>HAVING filters groups after GROUP BY, so it finds customers with at least 2 rows.</p>`]
      ],
      important: [
        ['Define churn and retention and how you would analyse them.', `<p>Churn is the percentage of customers lost in a period, retention is the percentage who stay. I build a cohort table by first-purchase month, plot retention curves, find where the biggest drop happens, then segment by channel, plan, region or product to see who leaves, and form hypotheses to test.</p>`],
        ['What are CAC and LTV and why is LTV:CAC important?', `<p>CAC is the cost to win one new customer. LTV is the profit a customer brings over their life. LTV:CAC shows if growth is profitable. Around 3:1 is considered healthy. Much lower means we overpay for customers; very high may mean we under-invest in growth.</p>`],
        ['What is RFM analysis?', `<p>It scores customers on Recency (days since last order), Frequency (number of orders) and Monetary value (total spend). I rank each into 1-5 groups, then name segments such as Champions (high on all three), Loyal, At risk (used to buy but quiet now) and Lost. Marketing can then treat each group differently, for example win-back offers for At risk.</p>`],
        ['ROAS vs ROI: what is the difference?', `<p>ROAS is revenue divided by ad spend. ROI is profit minus cost, divided by cost. A campaign can have a ROAS of 3 and still lose money if the margin is low, so decisions should use ROI on profit.</p>`]
      ],
      resources: [['Mode SQL Tutorial', 'https://mode.com/sql-tutorial'], ['StatQuest (YouTube)', 'https://www.youtube.com/@statquest']],
      done: 'You are done when you can write the formula for 10 KPIs without notes, and explain a funnel, a cohort table and RFM with a tiny example.'
    },
    /* ---------------- SAT ---------------- */
    {
      title: 'Case practice: "Sales dropped 25%"',
      time: '3.5 h',
      study: [
        'A case question tests how you think, not whether you know the "right" answer. Interviewers want a structure, clear steps and a recommendation.',
        'Use this fixed framework: V.S.D.S.H.R. = Validate, Size and time, Decompose, Segment, Hypothesise, Recommend.',
        'Validate: is the data correct? Check pipeline failures, tracking changes, definition changes, duplicate or missing days.',
        'Size and time: how big, since when, sudden or gradual, is it seasonal (compare to the same month last year, day of week, festivals)?',
        'Decompose with a formula: Revenue = traffic x conversion rate x AOV. Find which part fell. Other splits: new vs repeat customers, orders x items per order x price.',
        'Segment: by channel, device, region, category, customer type, price band. Find where the drop is concentrated. A drop that is everywhere is different from one in a single segment.',
        'Hypothesise: internal (release bug, price change, stock-out, campaign stopped, delivery issue) and external (competitor, season, policy, economy). Say how you would test each.',
        'Recommend: a short-term fix, a longer-term action, and the metric you will monitor. Mention what you would need from other teams.'
      ],
      how: [
        '[10 min] Read the framework. Write it on one page titled "Metric Drop Investigation" (this is your week deliverable).',
        '[15 min] Read the worked answer below, then close it and write your own version from memory.',
        '[15 min] For each hypothesis, write what data would confirm or reject it.',
        '[40 min] Do the 3 case drills in practice below: write a half-page outline for each, then say each aloud in 3 minutes. Record on your phone.',
        '[10 min] Listen to the recording. Fix: Did you start with validation? Did you give numbers? Did you end with a recommendation?',
        '[45 min] Timed mock: ask a friend (or an AI chat) to give you a NEW case you have not seen ("orders fell in one city", "refund rate doubled"). Give yourself 5 min to structure on paper and 5 min to speak. Then ask for feedback on structure and numbers.',
        '[45 min] Write the KPI cheat sheet from Friday as a clean 1-page table. Add a "if it falls, check..." column. Save it as a PDF in your notes.'
      ],
      example: `<p><b>Question:</b> "Our online sales dropped 25% last month. What do you do?"</p>
<p><b>1. Clarify first (30 seconds):</b> "Which metric: revenue or orders? Compared with which period? Is it all products and regions?"</p>
<p><b>2. Validate:</b> "I first check the data: did the tracking or ETL fail, did the definition of 'sale' change, are any days missing? I compare with finance numbers."</p>
<p><b>3. Size and time:</b> "I look at daily revenue. Was it a sudden step on one date or a slow slide? I compare with the same month last year and with the usual seasonal pattern."</p>
<p><b>4. Decompose.</b> Suppose we find this:</p>
${pre(`Revenue = Visits x Conversion x AOV

            Last month    This month   Change
Visits      200,000       190,000      -5%
Conversion  2.5%          2.0%         -20%
AOV         Rs 2,000      Rs 2,000     0%
Orders      5,000         3,800        -24%
Revenue     Rs 1.00 cr    Rs 0.76 cr   -24%   (0.95 x 0.80 = 0.76)`)}
<p>"Traffic fell a little, but most of the damage is conversion. AOV is flat, so customers who buy still spend the same."</p>
<p><b>5. Segment conversion:</b></p>
${pre(`Segment                 Last month   This month
Desktop                 3.5%         3.5%
Mobile - iOS            2.4%         2.3%
Mobile - Android        2.4%         0.9%    <- the problem
New vs repeat           both fell, new more`)}
<p>"The drop is almost all Android app users, starting on the day of the app release 5.2."</p>
<p><b>6. Hypotheses:</b> a bug in checkout or payment on the new Android build (most likely, because it started on the release date and only affects one platform); payment gateway failures for some banks; a slow page. "I would check crash logs, checkout error rates by app version, and payment success rate by method."</p>
<p><b>7. Recommend:</b> "Short term: ask engineering to roll back or hotfix the Android release, and re-send reminders to users with abandoned carts. Long term: add alerts on conversion by platform and release, and a staged rollout (5% of users first). I would monitor Android conversion daily until it returns to about 2.4%. Estimated revenue at stake: 0.9 vs 2.4 percent on that segment."</p>
<p><b>Why this answer works:</b> it asks questions, checks data first, uses a formula to split the problem, finds one segment, links to a cause, and ends with actions and a monitor metric.</p>`,
      practice: [
        ['Drill 1: "Daily active users (DAU) of our app fell 15% in two weeks." Write your outline.', `<p><b>Outline:</b> (1) Validate the event tracking and the DAU definition. (2) Time: sudden or gradual, weekday pattern, holiday? (3) Decompose: DAU = new users + returning users; check new installs (marketing, app store rank) and returning (retention). (4) Segment by platform, app version, country, acquisition channel, user tenure. (5) Hypotheses: release bug or crash, push notifications turned off, campaign ended, competitor, seasonality. (6) Recommend: fix or rollback, re-engage lapsed users, watch D1/D7 retention and crash-free rate.</p>`],
        ['Drill 2: "We launched a new feature 30 days ago. Only 3% of users use it. Is it a failure?"', `<p><b>Outline:</b> Define the target: what adoption was expected, and for which users? 3% of all users may be fine if the feature is for a niche segment. Funnel: exposed (saw it) - tried it - used it again. If exposure is low, it is a discoverability problem, not a product problem. Check repeat use (retention of feature users) and whether feature users have higher retention or revenue (careful: they may be more engaged anyway). Recommend: improve placement, run an A/B test, interview users, decide on a metric target before declaring failure.</p>`],
        ['Drill 3: "A marketing campaign cost Rs 5 lakh. How do you decide if it worked?"', `<p><b>Outline:</b> Define the goal (sales, leads, signups). Compare against a baseline or control group (holdout, same period last year, similar region without the campaign) to find the incremental result. Compute incremental revenue x margin minus cost = ROI, and CAC for new customers vs normal CAC. Look at quality: retention of campaign customers after 30-90 days. Recommend: scale, tweak or stop, and keep a holdout next time.</p>`],
        ['In the worked example, what if Visits had fallen 25% and conversion and AOV had stayed flat? How does the investigation change?', `<p>Now the problem is traffic. I would split visits by channel (organic, paid, direct, email, referral). Look for a stopped campaign, lower ad budget, SEO ranking loss, a broken tracking tag, or a site outage. Then check each channel against the calendar of marketing activities.</p>`],
        ['Revenue fell but orders are flat. What does that tell you and what do you check?', `<p>Revenue = orders x AOV, so AOV fell. Check: price cuts or discounts, mix shift to cheaper products, fewer items per order, a free-shipping threshold change, or refunds. Segment AOV by category and customer type.</p>`]
      ],
      important: [
        ['Sales dropped 25% last month. How do you investigate? (30-60 second version)', `<p>I first validate the data, then check the size and timing against seasonality. I split revenue into traffic, conversion and average order value to see which fell, then segment by channel, device, region and product to find where it is concentrated. From that I form hypotheses, such as a release bug, stock-out or a stopped campaign, test them with data, and end with a fix, a long-term action and a metric to monitor.</p>`],
        ['What if you cannot find any single segment with the drop?', `<p>Then the drop is broad, which points to something global: seasonality, macro or competitor change, pricing, a site-wide issue, or the data itself. I compare to last year, check market indicators and external events, check site-wide speed and outages, and look at customer feedback and reviews. I would also re-check my data definitions.</p>`],
        ['How do you prioritise when many hypotheses exist?', `<p>I rank by likelihood and by effort to check. I test the cheap and likely ones first, for example "did anything release on the date the drop started?", before expensive ones like customer interviews. Each check should clearly confirm or reject one hypothesis.</p>`]
      ],
      resources: [],
      done: 'You are done when you have a 1-page metric-drop framework and you have said three cases aloud, each in about 3 minutes, starting with validation and ending with a recommendation.'
    },
    /* ---------------- SUN ---------------- */
    {
      title: 'Q&A review, KPI sheet and survey statistics',
      time: '3.5 h',
      study: [
        'Review block: re-do the hardest hand-calculations from Mon-Fri without looking (IQR fences, z-score, SE, z-test, A/B test, LTV, ROI).',
        'Optional: Survey margin of error for a proportion = 1.96 x sqrt(p(1-p)/n). Worst case is p = 0.5. A bigger sample gives a smaller margin, but with diminishing returns.',
        'Optional: Weighting. If your sample has too many of one group, give each respondent a weight = population share / sample share, so the totals match the real population.',
        'Optional: Design effect and effective sample size. Weights reduce precision, so the effective n is smaller than the raw n. Mention it, you do not need to calculate it.',
        'Optional: Significance in crosstabs. To test if two groups differ in a survey answer, use a chi-square test (or two-proportion z-test for 2 groups). With many crosstab cells, some will look "significant" by luck (multiple comparisons).',
        'Optional: NPS = % promoters (score 9-10) minus % detractors (0-6). Passives (7-8) are ignored. Top-2-box = % choosing the top two points on a scale.',
        'Your edge: most analysts have never cleaned or weighted survey data. Use this in interviews.'
      ],
      how: [
        '[45 min] Timed recall: close this guide and write the formulas for mean, std dev, IQR fences, z-score, SE, CI, z-test for proportions, sample size, CAC, LTV, ROI. Check against Mon-Fri and mark mistakes.',
        '[45 min] Q&A drill: open the Stats and Case sections of the Interview Q&A page in this app. Answer 15 questions aloud, 30-60 seconds each. Flag the weak ones and re-read.',
        '[30 min] Finish the KPI cheat sheet (one page: KPI, formula, tiny example, "if it falls, check...") and the metric-drop framework page.',
        '[45 min] Optional: do the survey statistics example below and the practice questions. Compute by hand, then confirm in Python.',
        '[30 min] Mini deliverable: a one-page "Survey statistics notes" with margin of error table, weighting example and the crosstab test. Put it in your notes or GitHub.',
        '[15 min] Plan next week: Project 2 starts tomorrow. Make sure PostgreSQL (or your SQL tool) and Power BI Desktop are installed.'
      ],
      example: `<p><b>Optional: Survey statistics.</b></p>
<p><b>Margin of error.</b> A survey of n = 400, 50% say "satisfied".</p>
${pre(`MoE = 1.96 x sqrt(0.5 x 0.5 / 400) = 1.96 x 0.025 = 0.049  -> +/- 4.9 points
n = 1000: 1.96 x sqrt(0.25/1000) = 1.96 x 0.0158 = +/- 3.1 points
n = 1600: +/- 2.45 points      (to halve the error you need 4 times the sample)`)}
<p><b>Weighting.</b> Sample has 60% men, 40% women. The target population is 50/50.</p>
${pre(`weight(men)   = 50 / 60 = 0.833
weight(women) = 50 / 40 = 1.25
If 70% of men and 50% of women say "yes":
unweighted yes = 0.6 x 70% + 0.4 x 50% = 62%
weighted yes   = 0.5 x 70% + 0.5 x 50% = 60%`)}
<p>Weighting moves the total from 62% to 60% because women were under-represented.</p>
<p><b>Significance in a crosstab.</b> Satisfied by gender:</p>
${pre(`          Satisfied  Not    Total   % satisfied
Male      120        80     200     60%
Female     90       110     200     45%
Total     210       190     400

Expected if no difference (row total x column total / 400):
Male satisfied   = 200 x 210 / 400 = 105     Male not   = 95
Female satisfied = 105                        Female not = 95

chi-square = (120-105)^2/105 + (80-95)^2/95 + (90-105)^2/105 + (110-95)^2/95
           = 2.143 + 2.368 + 2.143 + 2.368 = 9.02
Degrees of freedom = (2-1) x (2-1) = 1. Critical value at 5% = 3.84.
9.02 > 3.84 -> p about 0.003 -> the 15-point gap is statistically significant.`)}
${pre(`from scipy.stats import chi2_contingency
chi2, p, dof, exp = chi2_contingency([[120, 80], [90, 110]], correction=False)
print(round(chi2, 2), round(p, 4))   # 9.02 0.0027`)}
<p>Plain words: if men and women were really equally satisfied, a gap this big would happen by luck only about 0.3% of the time. With <code>correction=False</code> the result matches the hand calculation; by default scipy applies a continuity correction on 2x2 tables, which gives a slightly smaller chi-square.</p>`,
      practice: [
        ['Timed recall (5 min): write the formulas for SE of a mean, SE of a proportion, 95% CI, and sample size for a conversion test.', `${pre(`SE (mean)       = s / sqrt(n)
SE (proportion) = sqrt( p(1-p) / n )
95% CI          = estimate +/- 1.96 x SE
n per group     = 16 x p(1-p) / d^2      (rough, 80% power, alpha 0.05)`)}`],
        ['Optional: What is the margin of error for n = 100 and p = 0.5? How big must n be for +/- 3 points?', `${pre(`n = 100: 1.96 x sqrt(0.25/100) = 1.96 x 0.05 = 0.098 -> +/- 9.8 points
For 0.03: n = (1.96 x 0.5 / 0.03)^2 = (32.67)^2 = 1,067`)}<p>You need about 1,070 respondents for +/- 3 points at 95%.</p>`],
        ['Optional: A sample is 30% age 18-30 and 70% age 31+, but the population is 50/50. Give the weights.', `${pre(`weight(18-30) = 50/30 = 1.667
weight(31+)   = 50/70 = 0.714`)}<p>Check: 0.3 x 1.667 = 0.5 and 0.7 x 0.714 = 0.5, so the weighted sample is 50/50.</p>`],
        ['Optional: 100 responses: 50 give 9-10, 30 give 7-8, 20 give 0-6. Compute NPS.', `${pre(`Promoters = 50%, Detractors = 20%
NPS = 50 - 20 = +30`)}<p>NPS is written as a number from -100 to +100, not as a percentage.</p>`],
        ['Optional: You compare 20 survey questions across gender at alpha 0.05 and 2 show significance. Should you celebrate?', `<p>Be careful. With 20 tests at 5%, you expect about 1 false positive by luck alone (20 x 0.05 = 1). Two significant results is close to what chance gives. Use a stricter alpha (for example Bonferroni: 0.05 / 20 = 0.0025), or treat them as leads to confirm, not findings.</p>`],
        ['Mock: answer aloud in 60 seconds: "Your survey shows satisfaction of 62%. How reliable is that?"', `<p>Model answer: "It depends on sample size and how the sample was drawn. With n = 1,000 the margin of error is about plus or minus 3 points, so the true figure is likely 59 to 65%. I would also check response rate, whether the sample matches the population (weighting), and any question wording bias. Then I would report the number with its margin, not as an exact value."</p>`]
      ],
      important: [
        ['What is margin of error?', `<p>It is the half-width of the confidence interval of a survey estimate, usually at 95%. For a proportion it is 1.96 x sqrt(p(1-p)/n). With n = 1,000 and p = 50% it is about plus or minus 3 points. It only covers random sampling error, not bias from wording or non-response.</p>`],
        ['Why and how do you weight survey data?', `<p>When some groups respond more than others, the sample does not match the population, so results are biased. I give each group a weight of population share divided by sample share so totals match known benchmarks like age and gender. The cost is lower precision, so I report the effective sample size and avoid extreme weights.</p>`],
        ['How do you check if two groups in a survey differ significantly?', `<p>For a yes/no answer I use a two-proportion z-test or chi-square test on the crosstab, and report the difference with a confidence interval. For means such as a rating, a t-test. I also avoid reading too much into many cells at once, because some will be significant by chance.</p>`],
        ['Give your 3 favourite statistics ideas that you would use in your first month as an analyst.', `<p>First, always report spread and median alongside the mean. Second, put a confidence interval or margin of error on every estimate from a sample. Third, check the sample or test design (bias, sample size, sample ratio mismatch) before trusting a result.</p>`]
      ],
      resources: [['Khan Academy Statistics', 'https://www.khanacademy.org/math/statistics-probability'], ['StatQuest (YouTube)', 'https://www.youtube.com/@statquest']],
      done: 'You are done when you can answer 15 stats and case questions aloud without notes, your KPI sheet and metric-drop page are finished, and (optional) you can run a crosstab significance test by hand.'
    }
  ]
};
