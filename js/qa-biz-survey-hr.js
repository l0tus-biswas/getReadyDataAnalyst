/* qa-biz-survey-hr.js - rewritten Business, Survey and HR banks. Loads after data-qa.js and overrides QA.biz, QA.survey, QA.hr.
   All numbers inside examples are made-up, for practice only. */
(function(){
const I=(q,short,a,lvl,freq,follow,mistake,tags)=>({q,short,a,lvl,freq,follow,mistake,tags});
const ORD={E:0,M:1,H:2};
const byLevel=l=>l.map((x,i)=>[x,i]).sort((a,b)=>ORD[a[0].lvl]-ORD[b[0].lvl]||a[1]-b[1]).map(x=>x[0]);

/* ===================== BUSINESS CASES & METRICS (30) ===================== */
const biz=[

I(`What is the difference between a metric and a KPI? How do you choose KPIs for a business?`,
`A metric is any number you can measure. A KPI is one of the few metrics that show whether we are reaching a business goal. I start from the goal, then pick one main KPI, 3 or 4 supporting ones, and one guardrail.`,
`<p><b>Simple definition:</b> a metric measures something (page views, calls made). A KPI (Key Performance Indicator) is a metric tied to a goal, with an owner and a target. All KPIs are metrics, but most metrics are not KPIs.</p>
<p><b>How to choose, in 5 steps:</b></p>
<ol><li><b>Goal first.</b> "Grow revenue", "keep customers", "reduce delivery time". No goal means no KPI.</li>
<li><b>One main KPI</b> (often called the North Star) that shows the goal is being reached.</li>
<li><b>3 to 4 supporting KPIs</b> that explain why the main KPI moves (the drivers).</li>
<li><b>One guardrail:</b> a number that must not get worse while you chase the main KPI (for example complaints or refund rate).</li>
<li><b>Check each KPI:</b> measurable, you can influence it, and not easy to fake.</li></ol>
<p><b>Sample spoken answer:</b> "A metric is any number we track. A KPI is a metric linked to a goal. If the goal is to grow an online store, my main KPI is revenue, supported by traffic, conversion rate and average order value, because revenue is traffic times conversion times order value. My guardrail would be return rate, so we do not grow sales by selling things people send back."</p>`,
'E',3,[`What is a vanity metric? Give an example.`,`Can a company have too many KPIs?`],
`Listing 15 metrics with no goal. The interviewer wants to hear you pick a few and explain why.`,['cases','kpi']),

I(`What KPIs would you track for an e-commerce website?`,
`I follow the customer journey: traffic, conversion rate, average order value, then repeat purchase and returns. Revenue is traffic times conversion times order value, so those three explain most changes.`,
`<p><b>Structure (follow the customer journey):</b></p>
<ol><li><b>Acquire:</b> sessions, new users, CAC (cost to acquire one customer), traffic by channel.</li>
<li><b>Convert:</b> conversion rate = orders / sessions, add-to-cart rate, cart abandonment, checkout drop-off.</li>
<li><b>Value:</b> AOV (average order value) = revenue / orders, revenue, gross margin.</li>
<li><b>Retain:</b> repeat purchase rate, LTV (lifetime value), cohort retention.</li>
<li><b>Operations and experience:</b> delivery time, return rate, cancellation rate, NPS or CSAT.</li></ol>
<p><b>Key formula:</b> Revenue = Sessions x Conversion rate x AOV. If revenue moves, one of these three moved.</p>
<p><b>Sample spoken answer:</b> "I would pick revenue as the main KPI and break it into sessions, conversion rate and AOV. Then I would watch CAC and repeat purchase rate, because buying new customers is expensive and repeat customers are cheaper. My guardrails would be return rate and delivery time."</p>`,
'E',3,[`Which one would you look at first on a Monday morning?`,`Why does conversion rate differ on mobile and desktop?`],
`Giving a flat list of 10 words. Group them by funnel stage and name one guardrail.`,['cases','kpi','ecommerce']),

I(`What KPIs would you track for an edtech (online learning) platform?`,
`I follow the learner journey: sign-ups, activation (first lesson done), engagement, completion, then renewals and revenue. Completion and renewal matter most, because a learner who finishes is the one who pays again and recommends it.`,
`<p><b>Journey and metrics:</b></p>
<ol><li><b>Acquire:</b> sign-ups, cost per lead, CAC, demo-to-enrol rate.</li>
<li><b>Activate:</b> % of sign-ups who finish the first lesson within 7 days. (Define "activation" clearly, say this first.)</li>
<li><b>Engage:</b> minutes learned per week, lessons per week, weekly active learners.</li>
<li><b>Outcome:</b> course completion rate, assessment scores, certificates. For job-oriented courses, placement rate.</li>
<li><b>Retain and earn:</b> renewal rate, revenue per learner, refund rate, NPS.</li></ol>
<p><b>Example (illustrative):</b> 6,000 learners start a course and 1,800 finish. Completion = 1,800 / 6,000 = 30%. Then I find the lesson where most learners stop. If the biggest fall is at lesson 4, I study that lesson: too hard, too long, video not loading?</p>
<p><b>Sample spoken answer:</b> "My main KPI would be completion rate, because learning outcome drives renewals and word of mouth. I would support it with activation, weekly engagement and lesson-wise drop-off. CAC and renewal rate sit next to it. As a guardrail I would watch refund requests and support tickets."</p>`,
'E',3,[`How would you find why learners stop at lesson 4?`,`Is high watch time always good?`],
`Tracking only sign-ups and revenue. In edtech the learning outcome (completion) is what makes the business last.`,['cases','kpi','edtech']),

I(`What KPIs would you track for a fintech app (payments or lending)?`,
`First I ask if it is payments or lending. For payments: activation, transaction success rate, monthly active users. For lending: approval, disbursal, repayment and default rate. Trust and risk metrics matter more here than in most businesses.`,
`<p>Ask first: "Is it payments, lending or investing?" The KPIs differ. This shows you think about the business model.</p>
<p><b>Payments / wallet app:</b></p>
<ul><li><b>Activation:</b> % of sign-ups who finish KYC and make a first transaction.</li>
<li><b>Usage:</b> monthly active users, transactions per user, total payment value.</li>
<li><b>Quality:</b> transaction success rate (failed payments hurt trust), time to complete.</li>
<li><b>Money:</b> revenue per active user, fraud cost, support cost.</li></ul>
<p><b>Lending app:</b></p>
<ul><li><b>Funnel:</b> application, KYC completion, approval rate, disbursal rate.</li>
<li><b>Risk:</b> default rate, early delinquency (for example 30 days past due), collection efficiency.</li>
<li><b>Money:</b> CAC, cost of funds, profit per loan.</li></ul>
<p><b>Guardrails:</b> fraud rate, complaints, regulatory compliance. A higher approval rate is not "good" on its own: if defaults rise, the business loses money.</p>
<p><b>Sample spoken answer:</b> "For a payments app my main KPI is monthly active users who transact, with success rate as a guardrail. For lending I would balance approval rate against default rate, because growing loans with bad quality hurts profit later."</p>`,
'M',2,[`Why can a higher approval rate be bad for a lending app?`,`How would you measure fraud?`],
`Ignoring risk. In fintech, always pair a growth number with a risk or quality number.`,['cases','kpi','fintech']),

I(`What KPIs would you track for a SaaS (subscription software) product?`,
`I track MRR (monthly recurring revenue), customer churn and revenue churn, activation, and net revenue retention. In SaaS, keeping and growing existing customers is the main story.`,
`<p><b>Core SaaS metrics:</b></p>
<ul><li><b>MRR / ARR:</b> recurring revenue per month / per year. Track new, expansion and lost MRR separately.</li>
<li><b>Logo churn:</b> % of customers who cancel. <b>Revenue churn:</b> % of MRR lost. They can differ: losing 10 small customers is less harmful than losing 1 big one.</li>
<li><b>Net revenue retention (NRR):</b> revenue today from the customers you had a year ago, divided by what they paid then. Above 100% means existing customers grow even after some leave.</li>
<li><b>Activation:</b> % of new accounts that reach the "aha" action (for example created the first report).</li>
<li><b>CAC payback:</b> CAC / monthly gross profit per customer = months to earn back the acquisition cost.</li>
<li><b>Support:</b> tickets per account, NPS.</li></ul>
<p><b>Worked example (illustrative):</b> CAC = ₹600, gross profit per customer per month = ₹150. Payback = 600 / 150 = 4 months. If customers usually stay longer than 4 months, the customer is profitable.</p>
<p><b>Sample spoken answer:</b> "My main KPI is net revenue retention, since it shows if the customer base grows by itself. I would back it with logo churn, activation rate and CAC payback."</p>`,
'M',2,[`Which is worse, high logo churn or high revenue churn?`,`What does a CAC payback of 18 months tell you?`],
`Mixing up logo churn (count of customers) with revenue churn (money). Say which one you mean.`,['cases','kpi','saas']),

I(`Explain CTR, CPC, CAC, ROAS and ROI. How are they different?`,
`CTR is clicks per impression, CPC is cost per click, CAC is the cost to win one customer, ROAS is revenue per rupee of ad spend, and ROI is profit compared with cost. ROAS ignores margin, ROI does not.`,
`<table><tr><th>Metric</th><th>Formula</th><th>Tells you</th></tr>
<tr><td>CTR</td><td>clicks / impressions</td><td>Is the ad attractive?</td></tr>
<tr><td>CPC</td><td>spend / clicks</td><td>Cost of one visit</td></tr>
<tr><td>Conversion rate</td><td>conversions / clicks (or visits)</td><td>Does the landing page work?</td></tr>
<tr><td>CAC</td><td>total acquisition spend / new customers</td><td>Cost to win a customer</td></tr>
<tr><td>ROAS</td><td>revenue from ads / ad spend</td><td>Revenue per rupee spent</td></tr>
<tr><td>ROI</td><td>(gross profit - cost) / cost</td><td>Real return after costs</td></tr></table>
<p><b>Illustrative numbers:</b> spend ₹50,000; 400,000 impressions; 8,000 clicks; 200 customers; revenue ₹2,40,000.</p>
<ul><li>CTR = 8,000 / 400,000 = 2%</li><li>CPC = 50,000 / 8,000 = ₹6.25</li><li>Conversion = 200 / 8,000 = 2.5%</li><li>CAC = 50,000 / 200 = ₹250</li><li>ROAS = 2,40,000 / 50,000 = 4.8</li></ul>
<p>With 30% gross margin, gross profit = ₹72,000, which is more than the ₹50,000 spend, so ROI = (72,000 - 50,000) / 50,000 = 44%. But at a 20% margin, gross profit is only ₹48,000, less than the spend, so the same ROAS of 4.8 loses money. This is why margin matters.</p>
<p><b>Sample spoken answer:</b> "CTR tells me if the ad gets clicks, conversion rate tells me if the page converts, CAC is the cost of a customer, ROAS is revenue per rupee spent. I would not judge a campaign on ROAS alone because it ignores margin. I would check profit-based ROI and compare CAC with the customer's lifetime value."</p>`,
'E',3,[`Campaign A has a higher ROAS but lower sales volume than B. Which do you pick?`,`What is a good ROAS?`],
`Saying "high ROAS means profit". ROAS is revenue, not profit, and there is no universal "good ROAS": it depends on margin.`,['cases','marketing']),

I(`Aptitude: a price rises from ₹80 to ₹100. What is the % increase? If it falls back from ₹100 to ₹80, what is the % decrease?`,
`Increase is 20 on a base of 80, which is 25%. Decrease is 20 on a base of 100, which is 20%. The change is the same in rupees, but the base is different, so the percentages differ.`,
`<p><b>Rule:</b> % change = (new - old) / old x 100. The denominator is always the <b>old</b> value.</p>
<ul><li>Increase: (100 - 80) / 80 = 20 / 80 = 0.25 = <b>25%</b></li>
<li>Decrease: (80 - 100) / 100 = -20 / 100 = -0.20 = <b>20% decrease</b></li></ul>
<p><b>Why not symmetric?</b> Going up, you divide by the smaller number (80). Going down, you divide by the larger number (100).</p>
<p><b>Quick check:</b> 80 x 1.25 = 100, and 100 x 0.80 = 80. Both land correctly.</p>
<p><b>Say it aloud:</b> "Same ₹20 change, different base, so 25% up and 20% down."</p>`,
'E',3,[`What % increase do you need to recover from a 50% fall?`],
`Dividing by the new value instead of the old value.`,['cases','aptitude','percent']),

I(`Aptitude: conversion rate moves from 2.0% to 2.5%. How do you describe the change?`,
`It is a rise of 0.5 percentage points, which is a 25% relative increase. I always say both so nobody mixes them up.`,
`<p><b>Two ways to describe a change in a percentage:</b></p>
<ul><li><b>Percentage points (absolute):</b> 2.5% - 2.0% = <b>0.5 pp</b></li>
<li><b>Relative change:</b> (2.5 - 2.0) / 2.0 = 0.5 / 2.0 = <b>25%</b></li></ul>
<p><b>Why it matters:</b> "Conversion rose 25%" sounds huge, "rose 0.5 points" sounds small. Both are true, so a careful analyst gives both. With 100,000 visitors a month, 0.5 pp means 500 extra orders; at AOV ₹800 that is 500 x 800 = ₹4,00,000 more revenue a month.</p>
<p><b>Trap:</b> if a rate goes from 8% to 10%, it rose 2 percentage points, not "2%". The relative rise is 2 / 8 = 25%.</p>`,
'E',3,[`If 100,000 visitors come each month and AOV is ₹800, how much extra revenue per month?`],
`Calling a percentage-point change a percent change.`,['cases','aptitude','percent']),

I(`Aptitude: a month has 2,000 orders, new and returning customers in the ratio 3:2. New customers spend ₹600 per order on average, returning ₹900. Find total revenue and the overall average order value.`,
`Split 2,000 in the ratio 3:2 to get 1,200 new and 800 returning orders. Revenue is 1,200 x 600 plus 800 x 900, which is ₹14,40,000. Dividing by 2,000 orders gives an AOV of ₹720.`,
`<p><b>Step 1, split by ratio:</b> total parts = 3 + 2 = 5. One part = 2,000 / 5 = 400.</p>
<ul><li>New orders = 3 x 400 = 1,200</li><li>Returning orders = 2 x 400 = 800</li></ul>
<p><b>Step 2, revenue:</b></p>
<ul><li>New = 1,200 x 600 = ₹7,20,000</li><li>Returning = 800 x 900 = ₹7,20,000</li><li>Total = ₹14,40,000</li></ul>
<p><b>Step 3, overall AOV:</b> 14,40,000 / 2,000 = <b>₹720</b>.</p>
<p><b>Common trap:</b> the simple average of 600 and 900 is 750, but that is wrong because there are more new orders than returning ones. Always weight by volume.</p>
<p><b>Extra insight to say:</b> both groups bring the same revenue, even though new customers place 50% more orders.</p>`,
'E',2,[`Which group would you try to grow, and why?`],
`Taking the simple average of the two AOVs.`,['cases','aptitude','ratio']),

I(`Aptitude (funnel): 10,000 visitors. 40% view a product, 25% of those add to cart, 20% of those buy. How many buy, and what is the overall conversion?`,
`Multiply down the funnel: 10,000 x 0.40 x 0.25 x 0.20 equals 200 buyers. Overall conversion is 200 out of 10,000, which is 2%.`,
`<p>Each % applies to the people who survived the <b>previous</b> step, not to the original 10,000.</p>
<ul><li>View product: 10,000 x 0.40 = 4,000</li>
<li>Add to cart: 4,000 x 0.25 = 1,000</li>
<li>Buy: 1,000 x 0.20 = <b>200</b></li></ul>
<p>Overall conversion = 200 / 10,000 = <b>2%</b>. Also 0.40 x 0.25 x 0.20 = 0.02.</p>
<p><b>Likely follow-up:</b> which step is best to improve by 10 percentage points?</p>
<ul><li>View 40% to 50%: 5,000 x 0.25 x 0.20 = 250 buyers (+50)</li>
<li>Add-to-cart 25% to 35%: 4,000 x 0.35 x 0.20 = 280 buyers (+80)</li>
<li>Purchase 20% to 30%: 4,000 x 0.25 x 0.30 = 300 buyers (+100)</li></ul>
<p>The same 10-point gain pays differently, because each step has a different base. In real life I would also pick the step that is cheapest to fix and has the biggest leak.</p>`,
'E',3,[`Which step would you investigate first, and what data would you pull?`],
`Applying all percentages to the original 10,000.`,['cases','aptitude','funnel']),

I(`Which chart would you use: trend over time, comparing categories, share of total, relationship between two numbers, distribution?`,
`Line for trend, bar for comparing categories, stacked bar or a simple pie only for few parts of a whole, scatter for two numbers, histogram or box plot for distribution. I choose by the question the viewer wants answered.`,
`<table><tr><th>Question</th><th>Chart</th><th>Note</th></tr>
<tr><td>How did it change over time?</td><td>Line</td><td>Time on the x-axis, few lines only</td></tr>
<tr><td>Which category is bigger?</td><td>Bar (horizontal if names are long)</td><td>Sort high to low, start axis at zero</td></tr>
<tr><td>What is the share of the total?</td><td>Stacked bar, or pie/donut with 2 to 4 slices</td><td>Avoid a pie with 8 slices</td></tr>
<tr><td>Are two numbers related?</td><td>Scatter</td><td>Add a trend line; correlation is not cause</td></tr>
<tr><td>How are values spread?</td><td>Histogram or box plot</td><td>Shows outliers</td></tr>
<tr><td>Where do users drop?</td><td>Funnel or bar by step</td><td>Show % step to step</td></tr>
<tr><td>Actual vs target</td><td>Bullet chart or bar with a target line</td><td>Gauges waste space</td></tr>
<tr><td>Pattern in two dimensions (day x hour)</td><td>Heatmap</td><td>One colour scale</td></tr></table>
<p><b>Sample spoken answer:</b> "I start with the question. For monthly sales I use a line chart, because the eye follows a trend. For sales by region I use a sorted bar chart. I avoid 3D charts and pies with many slices because people cannot compare angles. I keep one message per chart and put the conclusion in the title."</p>`,
'E',3,[`When is a pie chart acceptable?`,`Why should a bar chart start at zero?`],
`Choosing a chart because it looks fancy. Always say what question the chart answers.`,['cases','charts','dashboard']),

I(`How do you explain a technical finding to a non-technical stakeholder?`,
`I lead with the answer and the decision it needs, give one or two numbers in plain words, show one simple chart, and say what I am unsure about. I avoid words like p-value or regression.`,
`<p><b>A simple structure (Answer, Evidence, Action):</b></p>
<ol><li><b>Answer first:</b> "Sales fell because mobile checkout is failing."</li>
<li><b>Evidence:</b> one or two numbers and one simple chart.</li>
<li><b>Impact in business terms:</b> rupees, orders, customers, not statistics.</li>
<li><b>Recommendation:</b> what should be done and by whom.</li>
<li><b>Confidence and limits:</b> "I am fairly sure. We have only 3 weeks of data."</li></ol>
<p><b>Translate jargon:</b></p>
<ul><li>"Statistically significant" becomes "the difference is unlikely to be just luck".</li>
<li>"Median" becomes "the typical customer".</li>
<li>"Correlation is not causation" becomes "these move together, but we have not shown that one causes the other".</li></ul>
<p><b>Bad vs good line:</b> Bad: "The coefficient of the logistic model is 0.42." Good: "Customers who use the app twice in the first week are much more likely to stay."</p>
<p><b>From my own work:</b> in survey projects I often had to explain to a client why a quota was not filling or why some data was removed. I used the same method: result first, then reason, then options. [Add one real example with X.]</p>`,
'E',3,[`The manager says "just give me the number". What do you do?`,`How do you present something that disappoints the stakeholder?`],
`Starting with how you did the analysis. Stakeholders care about the answer and the decision.`,['cases','communication']),

I(`Aptitude: Segment A has 200 customers with an average order of ₹500. Segment B has 300 customers with an average order of ₹800. What is the overall average order?`,
`I weight by number of customers: (200 x 500 + 300 x 800) / 500 gives ₹680. The simple average of 500 and 800 would be 650, which ignores that B has more customers.`,
`<p><b>Weighted average = total value / total count.</b></p>
<ul><li>A total = 200 x 500 = 1,00,000</li><li>B total = 300 x 800 = 2,40,000</li><li>Combined = 3,40,000 for 500 customers</li></ul>
<p>Overall average = 3,40,000 / 500 = <b>₹680</b>.</p>
<p><b>Sense check:</b> the answer must lie between 500 and 800, closer to 800 because B is larger (60% of customers). 500 x 0.4 + 800 x 0.6 = 200 + 480 = 680. Matches.</p>
<p><b>Why it matters at work:</b> averaging averages is a very common dashboard error, for example an average of monthly conversion rates instead of total orders / total sessions. In SQL or Power BI I would compute SUM(revenue) / SUM(orders), not AVG of a pre-computed average.</p>`,
'M',3,[`How would you do this in SQL?`,`Is the average of average conversion rates ever correct?`],
`Averaging the two averages (650).`,['cases','aptitude','average']),

I(`Sales dropped 25% last month. How do you investigate? (very common)`,
`First I check the drop is real, then I find where it sits by time, product, region, channel and customer type. Then I form a few hypotheses, test them with data, and recommend a fix. I think in terms of traffic times conversion times order value.`,
`<p><b>Structure (say it as numbered steps):</b></p>
<ol><li><b>Clarify.</b> 25% versus what: last month, or the same month last year? Which metric (orders, revenue, units)? All business or one part?</li>
<li><b>Is the data right?</b> Tracking tag broken? Pipeline delay? Definition changed (for example returns now netted)? Duplicates removed?</li>
<li><b>Is it normal?</b> Compare with the same month last year. Festival timing, month length and billing cycles can explain a lot.</li>
<li><b>Decompose:</b> Revenue = traffic x conversion rate x average order value. Find which one fell.</li>
<li><b>Slice</b> by product, region, channel, device, new vs returning customer, price band. Look for one or two slices that explain most of the fall.</li>
<li><b>Hypotheses.</b> Internal: stock-outs, price change, app bug, campaign stopped, delivery delay. External: competitor offer, season, news.</li>
<li><b>Test and recommend</b> with an action, an owner, and how we will monitor.</li></ol>
<p><b>Sample spoken answer (illustrative numbers):</b> "First I would ask whether 25% is against last month or last year, and confirm the dashboard is correct. Suppose it is real: revenue fell from 100 to 75. I would split it into traffic, conversion and order value. Say traffic and order value are flat, but conversion fell from 3% to 2.25%, which is exactly the 25% drop. So the problem is after people arrive. I would slice conversion by device. If desktop is stable but Android fell from 3% to 1.5%, I would check whether a recent app release broke checkout, and look at payment failure logs. I would tell the product team, suggest a fix or rollback, and set up a daily alert on conversion by device so we catch this in a day, not a month."</p>
<p><b>Why this works:</b> it has structure, uses a formula to narrow down quickly, and ends with action.</p>`,
'M',3,[`Traffic and conversion are flat but revenue fell. What now?`,`Only one region fell. What next?`,`How do you know the cause and not just a correlation?`],
`Jumping straight to guesses (competitor, season) without checking data quality and slicing first.`,['cases','metric-drop']),

I(`How would you measure the success of a new feature?`,
`I decide the goal first, then one success metric, supporting metrics for adoption and engagement, and a guardrail. I compare users who got the feature with a control group, because a before-and-after comparison can be fooled by season or campaigns.`,
`<p><b>Structure:</b></p>
<ol><li><b>Goal.</b> Why did we build it? (More orders, fewer support calls, better retention?)</li>
<li><b>Success metric.</b> One number tied to the goal. For a "reorder in one tap" button: repeat orders per user in 30 days.</li>
<li><b>Adoption.</b> % of eligible users who tried it. (Say "eligible": not all users can see it.)</li>
<li><b>Engagement.</b> How often they use it and whether they come back to it.</li>
<li><b>Guardrails.</b> Things that must not worsen: app speed, crash rate, complaints, revenue per user.</li>
<li><b>Comparison.</b> Best: A/B test with a control group. If not possible: a matched group of similar users, or before-and-after with the weakness stated.</li>
<li><b>Decision rule.</b> Agree before launch what result means keep, improve or remove.</li></ol>
<p><b>Sample spoken answer:</b> "Take a one-tap reorder button. My goal metric is repeat orders per user in 30 days. Adoption is the share of past buyers who use the button. Guardrails are crash rate and cancellation rate. I would roll it out to half the users first. If that group reorders more and cancellations do not rise, we expand. If adoption is low, the button may be hard to find, so I would check that before saying the feature failed."</p>`,
'M',3,[`Adoption is high but the success metric did not move. Why?`,`You cannot run an A/B test. What do you do?`],
`Using only "number of clicks" as success. Clicks show interest, not value.`,['cases','feature','metrics']),

I(`Define churn and retention. How would you analyse a churn problem using cohorts?`,
`Churn is the share of customers lost in a period, retention is the share who stay. I group customers by the month they joined (cohorts) and see what percent is still active each month, because one overall average hides whether newer customers behave worse.`,
`<p><b>Definitions (always state them first):</b></p>
<ul><li><b>Active:</b> what counts as alive? (A purchase in 30 days? A login this week?) It depends on the business.</li>
<li><b>Churn rate</b> = customers lost in the period / customers at the start. Example: start 1,000, lost 50, churn = 5% a month.</li>
<li><b>Retention rate</b> = 1 - churn = 95%.</li></ul>
<p><b>Why 5% a month is not small:</b> 0.95 to the power 12 is about 0.54, so only about 54% of customers remain after a year, which means about 46% are lost.</p>
<p><b>Cohort analysis, in steps:</b></p>
<ol><li>Group users by signup month (Jan cohort, Feb cohort).</li>
<li>For each cohort, compute % active in month 0, 1, 2, 3.</li>
<li>Read the triangle table: each row is a cohort, each column is its age.</li>
<li>Look for where the curve drops steeply (usually the first weeks), and whether newer cohorts are worse than older ones.</li>
<li>Segment by channel, plan, city and first product to find who leaves.</li></ol>
<p><b>Sample spoken answer:</b> "I would define active first, then plot retention by signup cohort. Suppose the January cohort keeps 40% at month 1 and the March cohort keeps only 30%. Something changed for newer users, maybe a new ad channel bringing low-intent users. I would split by channel, and if one channel is much worse, I would suggest cutting its spend and fixing onboarding for those users."</p>`,
'M',3,[`How do you calculate retention in SQL?`,`Retention drops mostly in week 1. What would you try?`],
`Using one blended churn number. It hides cohort differences, and it can look better just because many new customers joined.`,['cases','retention','cohort']),

I(`In your checkout funnel 62% of users who start checkout do not complete the purchase. How do you investigate?`,
`I break checkout into steps, find the biggest drop, and slice that step by device, payment method and new vs returning users. Then I look for technical reasons (errors) and business reasons (delivery charge shown late).`,
`<p><b>Steps:</b></p>
<ol><li><b>Check the baseline:</b> is 62% higher than usual? Compare with last month.</li>
<li><b>Break the funnel</b> into steps (address, delivery, payment, confirm) with % moving between steps.</li>
<li><b>Find the biggest leak</b> in users lost, not only in %.</li>
<li><b>Slice</b> that step: device, browser, payment method, city, new vs returning, coupon vs no coupon.</li>
<li><b>Two types of cause:</b> technical (payment failures, slow page, error messages) and business (surprise delivery charge, forced sign-up, missing preferred payment method, late delivery date).</li>
<li><b>Evidence:</b> error logs, gateway success rate, session recordings, a short exit survey.</li>
<li><b>Fix and test</b> with an A/B test, for example showing total cost earlier.</li></ol>
<p><b>Illustrative example:</b> 10,000 start checkout. Address step keeps 9,000, delivery keeps 8,200, payment keeps 4,500, confirm keeps 3,800. The biggest leak is payment: 8,200 to 4,500 loses 3,700 users (45% of those who reached it). Overall completion = 3,800 / 10,000 = 38%, so 62% abandon. I would check payment success by method: if UPI works 95% of the time but cards only 60%, the card flow is the issue.</p>`,
'M',3,[`Payment step fails mostly on one bank. What do you do?`,`How do you separate users who left because of price from those who hit an error?`],
`Looking only at final conversion. The step-by-step funnel shows where to look.`,['cases','funnel']),

I(`Campaign A spent ₹1,00,000 and got 400 customers with an average first order of ₹1,500. Campaign B spent ₹50,000 and got 150 customers with an average first order of ₹2,400. Gross margin is 30%. Which is better?`,
`A has the lower CAC (₹250 against ₹333), but B has the better return: ROAS 7.2 against 6.0, and profit after ad spend per rupee spent of 1.16 against 0.80. I would put the next rupee into B, but check how far B can scale and the repeat rate of each.`,
`<table><tr><th></th><th>A</th><th>B</th></tr>
<tr><td>CAC = spend / customers</td><td>1,00,000 / 400 = ₹250</td><td>50,000 / 150 = ₹333</td></tr>
<tr><td>Revenue = customers x order</td><td>400 x 1,500 = ₹6,00,000</td><td>150 x 2,400 = ₹3,60,000</td></tr>
<tr><td>ROAS = revenue / spend</td><td>6.0</td><td>7.2</td></tr>
<tr><td>Gross profit (30%)</td><td>₹1,80,000</td><td>₹1,08,000</td></tr>
<tr><td>Profit after ad spend</td><td>₹80,000</td><td>₹58,000</td></tr>
<tr><td>Profit per rupee spent</td><td>0.80</td><td>1.16</td></tr></table>
<p><b>Reading:</b> A makes more total profit (₹80,000 vs ₹58,000) because it is bigger. B is more efficient. If budget is limited, put the next rupee where the return per rupee is higher, B, <i>as long as B can take more spend</i> (small campaigns often get worse returns when scaled).</p>
<p><b>What else I would check:</b> repeat purchase after the first order (a cheap customer who never returns can be worse than an expensive loyal one), return rate, and whether these sales would have happened anyway (incrementality, tested with a holdout group).</p>
<p><b>Sample spoken answer:</b> "On the numbers, B is more efficient: for each rupee of ad spend it earns back more profit. A is bigger in total. I would move some budget to B in steps, watch whether its returns hold as spend grows, and compare repeat purchase rates before I decide fully."</p>`,
'M',3,[`What if B's customers return more often than A's?`,`How would you know the campaign caused those sales?`],
`Choosing the campaign with the lowest CAC and stopping there, or confusing ROAS with profit.`,['cases','marketing','roi']),

I(`You get five requests from different stakeholders at the same time. How do you prioritise?`,
`I ask what decision each request supports and by when, estimate the effort, then rank by business impact and urgency. I share the order openly and agree it with my manager, rather than silently choosing.`,
`<p><b>Method (impact, urgency, effort):</b></p>
<ol><li><b>Clarify each request:</b> what decision does it support? Who is the audience (CEO or an internal team)? When is the real deadline?</li>
<li><b>Score</b> impact (money, customers, risk), urgency (fixed date or not) and effort (hours).</li>
<li><b>Do first:</b> high impact and urgent. <b>Schedule:</b> high impact, not urgent. <b>Quick wins:</b> low effort, fit between tasks. <b>Push back or decline:</b> low impact, high effort.</li>
<li><b>Communicate:</b> send a short note: "Here is the order and expected dates. If you disagree, tell me the business reason."</li>
<li><b>Escalate</b> to my manager only when two high-priority requests clash, and bring a recommendation, not a complaint.</li></ol>
<p><b>Sample spoken answer:</b> "In survey projects I often had several live projects with fixed field dates, so I used the same approach. I listed each task with its deadline and how many people depended on it, finished the ones blocking others first, and told the others the new date early. For example [X: real project with a clash]. For analytics I would add one more question: does the request change a decision? A report nobody will act on goes last."</p>`,
'M',3,[`Your manager and a director give conflicting priorities. What do you do?`,`How do you say no politely?`],
`Trying to do everything, or silently dropping tasks. Stakeholders accept a late date if told early; they dislike surprises.`,['cases','stakeholder','prioritisation']),

I(`You find serious data quality issues one day before a client deadline. What do you do?`,
`I first measure how big and how risky the problem is. I fix what is quick and safe, tell the stakeholder early with a clear choice, deliver with a written caveat if needed, and then add a check so it does not repeat.`,
`<p><b>Steps:</b></p>
<ol><li><b>Size it:</b> how many rows or respondents, which columns, does it change the headline numbers? Run the result with and without the bad records.</li>
<li><b>Find the cause:</b> source error, logic bug, duplicate load, a join that multiplied rows? Fix at the source if possible.</li>
<li><b>Choose:</b> (a) fix fully, (b) fix the part that matters and flag the rest, (c) delay delivery. Decide by impact on the decision.</li>
<li><b>Communicate early</b> (not in the last hour): "I found X. It affects Y. Option 1 is..., option 2 is.... I recommend 1."</li>
<li><b>Document:</b> what was wrong, what I changed, what remains uncertain.</li>
<li><b>Prevent:</b> add validation checks (row counts, nulls, ranges, duplicates) before delivery next time.</li></ol>
<p><b>Sample spoken answer:</b> "In a survey project I once found [X: real example, such as a routing error sending the wrong respondents to a section]. I counted how many records were affected, which was [N]. I fixed the logic, re-ran the checks, told my manager the same day, and sent the client a short note on what changed. Afterwards I added a pre-delivery checklist. As an analyst I would do the same: never hide a data issue, and never present numbers I do not trust without a clear caveat."</p>
<p><b>This is a strong story for you</b>, because survey programming has exactly this pressure. Use a real one.</p>`,
'M',3,[`The manager says "just send it, the client will not notice". What do you do?`,`How do you decide whether to delay?`],
`Staying silent and hoping nobody notices, or saying "I would work overnight" with no plan. Interviewers want judgement and honesty.`,['cases','data-quality','behavioural']),

I(`Here is a dashboard with 15 charts, rainbow colours, a 3D pie and no titles. How would you critique and improve it?`,
`I would ask who uses it and what decision it supports, then cut it to the 4 or 5 numbers that matter, put key KPIs on top, use simple charts with clear titles and one colour palette, and show targets and comparisons.`,
`<p><b>Critique checklist:</b></p>
<ol><li><b>Purpose:</b> who is the user, what decision? A dashboard without a question is a data dump.</li>
<li><b>Hierarchy:</b> top row = 3 to 5 KPI cards with change vs last period. Below = trends. Below that = detail.</li>
<li><b>Right chart:</b> line for trend, sorted bar for comparison, no 3D, pie only with few slices.</li>
<li><b>Context:</b> targets, last period or a benchmark. A number alone says little.</li>
<li><b>Colour:</b> few colours, with meaning (red only for bad). Colour-blind safe if possible.</li>
<li><b>Labels:</b> titles that say the message ("Android conversion fell 2 points"), units, date range, definitions.</li>
<li><b>Interactivity:</b> a few useful filters (date, region), not 12 slicers.</li>
<li><b>Trust:</b> show data refresh time and KPI definitions.</li></ol>
<p><b>Sample spoken answer:</b> "First I would ask what decision the dashboard supports. Then I would remove anything that does not help that decision. I would keep KPI cards at the top with comparison to last month, use a line chart for trend and a sorted bar for region comparison, replace the 3D pie, and give each chart a title that says what to notice. I would add the last refresh date so users trust it."</p>`,
'M',2,[`Which chart would you remove first?`,`How do you check that people actually use the dashboard?`],
`Only talking about colours and looks. Start with the purpose and the user.`,['cases','dashboard','charts']),

I(`Aptitude: a price is increased by 20% and then discounted by 20%. What is the final price compared with the original?`,
`The final price is 4% lower than the original. Raising by 20% gives 1.2 times, cutting 20% of that gives 0.8 times, and 1.2 x 0.8 is 0.96.`,
`<p><b>Use multipliers.</b> +20% means x 1.20. -20% means x 0.80.</p>
<ul><li>Start at 100.</li><li>After +20%: 100 x 1.2 = 120.</li><li>After -20% (of 120): 120 x 0.8 = 96.</li></ul>
<p>Net change = 96 / 100 - 1 = <b>-4%</b>.</p>
<p><b>Why:</b> the 20% discount is taken from a bigger number (120), so it removes 24, not 20.</p>
<p><b>Order does not matter:</b> 0.8 x 1.2 is also 0.96.</p>
<p><b>Use in analytics:</b> successive growth rates must be multiplied, not added. +10% then +10% = 1.1 x 1.1 = 1.21, which is +21%.</p>`,
'M',3,[`Revenue falls 10% in Q1 and rises 10% in Q2. Is it back to the start?`],
`Adding or subtracting the percentages (saying the net change is 0%).`,['cases','aptitude','percent']),

I(`Aptitude (reading a table): quarterly sales in ₹ lakh. North: Q1 120, Q2 150. South: Q1 200, Q2 220. East: Q1 80, Q2 100. Which region grew fastest, which added the most, and what is the overall growth?`,
`North and East both grew 25%, South only 10%. In rupees North added the most, 30 lakh. Overall sales went from 400 to 470 lakh, which is +17.5%.`,
`<table><tr><th>Region</th><th>Q1</th><th>Q2</th><th>Change</th><th>% growth</th></tr>
<tr><td>North</td><td>120</td><td>150</td><td>+30</td><td>30 / 120 = 25%</td></tr>
<tr><td>South</td><td>200</td><td>220</td><td>+20</td><td>20 / 200 = 10%</td></tr>
<tr><td>East</td><td>80</td><td>100</td><td>+20</td><td>20 / 80 = 25%</td></tr>
<tr><td><b>Total</b></td><td>400</td><td>470</td><td>+70</td><td>70 / 400 = 17.5%</td></tr></table>
<ul><li><b>Fastest (%):</b> North and East tie at 25%.</li>
<li><b>Largest absolute add:</b> North (+30).</li>
<li><b>North's share of total growth:</b> 30 / 70 = 42.9%.</li>
<li><b>South:</b> the biggest region (200 of 400 = 50% of Q1 sales) but the slowest, so South pulls the total down.</li></ul>
<p><b>Trap:</b> do not average the three growth rates: (25 + 10 + 25) / 3 = 20%, which is wrong because regions have different sizes. The correct overall figure is 17.5%.</p>
<p><b>Tips for table questions:</b> read the title and unit first (lakh, crore, %), compute only what is asked, and check which base the question wants.</p>`,
'M',3,[`If South grew like North, what would total sales be?`,`Which region would you look at first and why?`],
`Averaging the regional growth percentages instead of using totals.`,['cases','aptitude','table']),

I(`Aptitude: revenue was ₹100 lakh, ₹120 lakh and ₹150 lakh in three consecutive years. What is the average yearly growth?`,
`Growth was 20% in year 2 and 25% in year 3. The simple average is 22.5%, but the correct compound rate (CAGR) is about 22.47%, because 100 grows by that rate twice to reach 150.`,
`<ul><li>Year 1 to 2: (120 - 100) / 100 = 20%</li><li>Year 2 to 3: (150 - 120) / 120 = 25%</li></ul>
<p><b>Simple average:</b> (20 + 25) / 2 = 22.5%.</p>
<p><b>CAGR (compound annual growth rate)</b> = (end / start) to the power (1 / number of periods) - 1 = (150 / 100) to the power 1/2 - 1 = 1.2247 - 1 = <b>22.47%</b>.</p>
<p><b>Check:</b> 100 x 1.2247 = 122.47, then x 1.2247 = 150. It works.</p>
<p><b>What to say:</b> the simple average is a fair quick estimate when growth rates are close (22.5% vs 22.47%), but CAGR is the correct way to describe steady growth over time. Periods = number of years between the first and last point: 3 data points means 2 periods, not 3.</p>
<p><b>Common mistake:</b> using 3 instead of 2 as the exponent.</p>`,
'M',2,[`Revenue doubles in 5 years. Roughly what is the CAGR?`],
`Using the number of data points instead of the number of periods.`,['cases','aptitude','growth']),

I(`An A/B test shows variant B converting at 5.4% and the control at 5.0%, with 10,000 users in each group. The team wants to ship B. What do you say?`,
`B looks 8% better in relative terms, but with 10,000 users per group this gap is not statistically convincing. It could be chance. I would not call it a win yet: I would let it reach the planned sample size, or ship only if being wrong is cheap.`,
`<p><b>Numbers:</b> control 500 conversions (5.0%), B 540 (5.4%). Difference = 0.4 pp, relative = 0.4 / 5.0 = 8%.</p>
<p><b>Is it chance?</b> Pooled rate = 5.2%. Standard error of the difference = square root of (0.052 x 0.948 x 2 / 10,000) = 0.314 pp. z = 0.4 / 0.314 = <b>1.27</b>, which gives a p-value around 0.20. In simple words: if B had no real effect, a gap this big would still appear about 1 time in 5 just by chance. The usual bar is z above about 1.96 (p below 0.05).</p>
<p><b>How big a sample would we need?</b> To reliably detect a rise from 5.0% to 5.5% (80% power, 5% significance) you need about 31,000 users per group. So this test was too small to answer the question.</p>
<p><b>What I would say:</b> "The result is promising but not proven. I would not stop early just because B is ahead, because peeking increases false wins. Let it run to the planned sample size, covering full weeks. Check guardrails like refund rate and page speed. If B is free to ship and low-risk, the team could ship it as a business choice, but they should know it is not proven."</p>
<p><b>Other checks:</b> equal group sizes (sample-ratio mismatch), only one change in B, the test covered weekdays and weekends.</p>`,
'M',3,[`What does a p-value of 0.03 mean, in simple words?`,`Why not stop the test as soon as B is ahead?`],
`Saying "B wins, 8% better", or saying "the p-value is the probability that B is better". Neither is correct.`,['cases','ab-test','stats']),

I(`Simpson's paradox: page B has a higher conversion rate than page A on desktop and on mobile, but a lower rate overall. How is that possible, and what do you report?`,
`It happens when the traffic mix differs between the pages: B got mostly low-converting mobile users and A got mostly desktop users. B is better within each device, so I would report by device and fix the traffic split.`,
`<p><b>Illustrative data:</b></p>
<table><tr><th></th><th>Desktop</th><th>Mobile</th><th>Overall</th></tr>
<tr><td>Page A</td><td>240 / 800 = 30%</td><td>10 / 200 = 5%</td><td>250 / 1,000 = 25%</td></tr>
<tr><td>Page B</td><td>66 / 200 = 33%</td><td>48 / 800 = 6%</td><td>114 / 1,000 = 11.4%</td></tr></table>
<p>B is better on desktop (33% vs 30%) and on mobile (6% vs 5%), yet worse overall (11.4% vs 25%).</p>
<p><b>Why:</b> A's visitors were 80% desktop (high converting), B's were 80% mobile (low converting). The overall rate is a weighted average, and the weights (device mix) differ, so it hides B's real strength.</p>
<p><b>In practice:</b> in a properly randomised A/B test, the device mix should be similar in both groups. If it is not, something is wrong with the split, so check that first.</p>
<p><b>What I report:</b> "Overall numbers mislead here. Within each device B is better. I would first check why traffic was not split evenly, fix that, and re-run. Meanwhile I would report by segment."</p>
<p><b>Lesson to say:</b> always slice by the obvious confounders (device, channel, new vs returning) before concluding from an overall number.</p>`,
'H',2,[`How would you prevent this in a real A/B test?`,`Which do you trust, the overall number or the segment numbers?`],
`Trusting the overall number blindly, or memorising the name "Simpson's paradox" without being able to show the weighted-average reason.`,['cases','stats','ab-test']),

I(`Daily active users fell 8% but revenue rose 5% in the same month. Is this good or bad? How would you find out?`,
`It can be either, so I look at why. Revenue may have risen from a price change or a few big buyers while the user base shrinks, which is a warning. I would split revenue into users times revenue per user and see which users left.`,
`<p><b>Think:</b> Revenue = active users x revenue per active user (ARPU). Users x 0.92 and revenue x 1.05 means ARPU went up by 1.05 / 0.92 = 1.141, about +14%.</p>
<p><b>Possible stories:</b></p>
<ul><li><b>Good:</b> we removed low-quality or fake users (bot clean-up), kept the valuable ones, and ARPU rose.</li>
<li><b>Neutral:</b> a price increase, a festival offer or a one-time bulk order lifted revenue.</li>
<li><b>Bad:</b> casual users are leaving, and a few heavy users are paying more. The base is shrinking, so future revenue is at risk.</li></ul>
<p><b>How I would check:</b></p>
<ol><li>Which users left? Compare by tenure, channel, plan and activity. Low-value or high-value?</li>
<li>Where did the revenue growth come from? Price, more spend per user, a few large accounts, one-time items?</li>
<li>Look at cohort retention for the last 3 months: trend or one bad month?</li>
<li>Check definition changes: was "active" redefined or tracking fixed? A tracking fix can drop DAU sharply.</li></ol>
<p><b>Sample spoken answer:</b> "I would not call it good or bad yet. Revenue per active user went up about 14%, so I would check if that is from price or from losing low-value users. If heavy users are staying and paying more, fine. If they are leaving too, the revenue growth is temporary. My recommendation depends on the cohort picture."</p>`,
'H',2,[`Which metric would you put on the CEO dashboard to catch this early?`,`How would you tell a bot clean-up from a real user loss?`],
`Celebrating revenue and ignoring the shrinking user base, or panicking about DAU without looking at who left.`,['cases','metrics','diagnosis']),

I(`The marketing team wants to give a 10% discount to all customers to boost sales. How would you decide whether it is a good idea?`,
`I would compare the extra sales the discount really creates with the money given away on sales that would have happened anyway. The key number is incremental profit, which I would measure with a test that has a no-discount control group.`,
`<p><b>The logic:</b> a discount costs money on every order, including from customers who would have paid full price. It only pays if the extra orders bring more profit than the money given away.</p>
<p><b>Illustrative example:</b> normally 1,000 orders at ₹1,000 with 30% margin = ₹300 profit per order = ₹3,00,000. With a 10% discount the profit per order is 300 - 100 = ₹200. To earn the same total profit we need 3,00,000 / 200 = 1,500 orders, which is 50% more orders. So at a 30% margin, a 10% discount must lift orders by 50% just to break even.</p>
<p><b>Steps:</b></p>
<ol><li>Clarify the goal: clear stock, win new customers, or lift a slow period?</li>
<li>Calculate the break-even uplift (as above).</li>
<li>Run a test: discount for a random half of customers, full price for the rest.</li>
<li>Measure incremental orders and incremental profit, not total sales.</li>
<li>Check side effects: do customers wait for the next sale, do repeat purchases fall afterwards (pull-forward), does the brand look cheap?</li>
<li>Recommend targeted offers (lapsed customers, abandoned carts) instead of discounting everyone.</li></ol>
<p><b>Sample spoken answer:</b> "At a 30% margin, a 10% discount needs about 50% more orders to break even. So I would test before rolling it out, measure incremental profit, and consider giving it only to customers who are less likely to buy without it."</p>`,
'H',2,[`How would you choose which customers get the discount?`,`What if sales rise 40% but profit falls?`],
`Judging the discount by sales growth only. Revenue can rise while profit falls.`,['cases','marketing','pricing']),

I(`Subscription revenue is flat but you hear that churn is rising. How do you investigate?`,
`I would separate customers lost, customers gained and revenue from existing customers. Flat revenue can hide rising churn if new sales or price rises cover for it. Then I would find which segment is churning and why, using cohorts and exit reasons.`,
`<p><b>Revenue bridge:</b> Ending MRR = Starting MRR + New + Expansion (upgrades) - Contraction (downgrades) - Churned. Flat revenue means these cancel out. Rising churn can be hidden by strong new sales, and that means the business works harder to stay in the same place.</p>
<p><b>Steps:</b></p>
<ol><li>Build the bridge for the last 6 months. Is churned MRR growing?</li>
<li>Separate logo churn and revenue churn.</li>
<li>Cohort view: do new cohorts leave sooner than old ones?</li>
<li>Segment: plan, company size, acquisition channel, onboarding path, support tickets in the last 30 days, usage before cancelling.</li>
<li>Leading signals: a usage drop a few weeks before cancelling is a typical warning. Build a simple at-risk list.</li>
<li>Reasons: exit survey and support notes. Coding the open-ended reasons is where your survey experience helps.</li>
<li>Recommend: fix onboarding, reach out to at-risk accounts, review pricing, and track churn weekly.</li></ol>
<p><b>Sample spoken answer:</b> "Flat revenue with rising churn means new business is covering a leak. I would build an MRR bridge, find the segment where churn rises, and check usage before cancellation. If most churners never finished onboarding, the fastest win is fixing the first 14 days, not offering discounts."</p>`,
'H',2,[`What is net revenue retention and why do good SaaS companies have it above 100%?`,`How do you separate involuntary churn (failed payments) from voluntary churn?`],
`Looking only at total revenue. The bridge reveals the hidden movements.`,['cases','churn','saas']),

I(`The CEO says conversion rate is 5%, but your dashboard shows 2%. What do you do?`,
`I would not argue about who is right. I would find out how each number is defined: the numerator, the denominator, the time window and the data source. Most of the time the gap is a definition difference, not an error.`,
`<p><b>Common reasons two "conversion rates" differ:</b></p>
<ul><li><b>Denominator:</b> orders / sessions vs orders / unique visitors vs orders / visitors who viewed a product.</li>
<li><b>Numerator:</b> orders placed vs orders paid vs orders delivered; cancelled or returned orders included or not.</li>
<li><b>Time window:</b> same-day conversion vs 7-day conversion (people who buy later).</li>
<li><b>Source:</b> web analytics tool vs order database (bots, ad blockers, cross-device).</li>
<li><b>Scope:</b> all traffic vs paid traffic only, web vs app.</li></ul>
<p><b>Illustrative:</b> 500 orders / 10,000 unique visitors = 5%, but 500 orders / 25,000 sessions = 2%. Same orders, different denominator.</p>
<p><b>What I do:</b></p>
<ol><li>Ask for the CEO's source and how the 5% was calculated.</li>
<li>Write both definitions side by side for the same date range.</li>
<li>Reproduce each number from raw data.</li>
<li>Agree one official definition, name it clearly (for example "session conversion rate") and document it in a metric glossary.</li>
<li>Show the definition on the dashboard (tooltip) so it does not repeat.</li></ol>
<p><b>Sample spoken answer:</b> "I would politely check the definition first. It is probably a denominator difference, like unique visitors against sessions. I would show both numbers with the maths and propose one agreed definition. This is also why I always write metric definitions on my dashboards."</p>
<p><b>Tie to your experience:</b> in survey work, "completion rate" or "incidence" can be calculated in more than one way, and clients sometimes compare the wrong ones, so you already know this problem.</p>`,
'H',3,[`How do you build trust in numbers across the company?`,`Which number do you present to the board?`],
`Defending your dashboard or assuming the CEO is wrong. Stay neutral and check the definitions.`,['cases','metrics','stakeholder'])

];

/* ===================== SURVEY ANALYTICS (20) ===================== */
const survey=[

I(`How is NPS calculated? What do the groups mean?`,
`NPS asks "How likely are you to recommend us, 0 to 10?" Promoters are 9 and 10, passives 7 and 8, detractors 0 to 6. NPS equals percent promoters minus percent detractors, so it runs from -100 to +100 and passives are ignored in the formula.`,
`<p><b>Formula:</b> NPS = % Promoters (9-10) - % Detractors (0-6). Report it as a plain number, for example +20, not as 20%.</p>
<p><b>Worked example (illustrative):</b> 1,000 respondents: 450 gave 9 or 10, 300 gave 7 or 8, 250 gave 0 to 6.</p>
<ul><li>Promoters = 450 / 1,000 = 45%</li><li>Passives = 30%</li><li>Detractors = 25%</li><li>NPS = 45 - 25 = <b>+20</b></li></ul>
<p><b>Points to mention:</b></p>
<ul><li>Passives count in the base (the 1,000) but do not enter the subtraction.</li>
<li>NPS is a loyalty and advocacy measure. It does not tell you why, so always add an open-ended "What is the main reason for your score?".</li>
<li>Compare with your own past scores (trend) and your own segments. What counts as "good" varies a lot by industry, so be careful with benchmarks.</li>
<li>NPS has sampling error. A small base can swing the score a lot.</li></ul>
<p><b>Sample spoken answer:</b> "I count promoters as 9 and 10, detractors as 0 to 6, and subtract the two percentages. With 45% promoters and 25% detractors, NPS is +20. I would always look at the reasons given by detractors, because that is where the action is."</p>`,
'E',3,[`Why do passives not count?`,`What is a good NPS?`],
`Calling NPS a percentage, or forgetting that passives stay in the base for the percentages.`,['survey','nps']),

I(`What are CSAT and CES, and how are they different from NPS?`,
`CSAT measures satisfaction with one experience, CES measures how easy it was to get something done, and NPS measures overall loyalty. I use CSAT and CES right after an interaction, and NPS for the relationship over time.`,
`<table><tr><th></th><th>Question (example)</th><th>How reported</th></tr>
<tr><td><b>CSAT</b></td><td>"How satisfied were you with your support chat?" 1 to 5</td><td>% satisfied = top-2 box (4 or 5) of all valid answers</td></tr>
<tr><td><b>CES</b></td><td>"The company made it easy to resolve my issue." 1 (strongly disagree) to 7 (strongly agree)</td><td>Average, or % agreeing (5 to 7)</td></tr>
<tr><td><b>NPS</b></td><td>"How likely are you to recommend us?" 0 to 10</td><td>% Promoters - % Detractors</td></tr></table>
<p><b>When to use which:</b></p>
<ul><li><b>CSAT:</b> after a specific moment (delivery, call, purchase). Short-term, specific.</li>
<li><b>CES:</b> after a task or service issue, where effort is the main driver of loyalty.</li>
<li><b>NPS:</b> the overall relationship, asked on a regular schedule (for example every quarter).</li></ul>
<p><b>Example:</b> 200 CSAT responses, 150 gave 4 or 5. CSAT = 150 / 200 = 75%.</p>
<p><b>Sample spoken answer:</b> "CSAT is satisfaction with a moment, CES is how much effort it took, and NPS is whether you would recommend the company. A customer can be satisfied with a single call (high CSAT) but still not recommend the company, so I use them together, not one instead of the other."</p>`,
'E',3,[`How would you report CSAT over time?`,`Which one predicts churn best?`],
`Treating all three as the same thing. They answer different questions.`,['survey','csat','ces']),

I(`How do you analyse Likert-scale data? What is top-2-box?`,
`Likert answers are ordered categories, so I first show the full distribution, then top-2-box (the percent choosing the two most positive options), and the mean for a quick comparison. For tests I use methods that suit ordered data.`,
`<p><b>What it is:</b> a Likert item is a statement with ordered answers such as Strongly disagree to Strongly agree (1 to 5). The gaps between points are not guaranteed to be equal, so the data is <b>ordinal</b>.</p>
<p><b>Step by step:</b></p>
<ol><li><b>Clean:</b> remove or flag "Don't know / Not applicable" before calculating, and show the base.</li>
<li><b>Distribution:</b> % for each point. This is the most honest view.</li>
<li><b>Top-2-box:</b> % choosing 4 or 5. Bottom-2-box: % choosing 1 or 2. Easy for managers to read.</li>
<li><b>Mean (or median):</b> a quick summary. In industry the mean is widely used, but remember it assumes equal gaps.</li>
<li><b>Compare groups:</b> test the top-2-box difference with a z-test for proportions or chi-square, or compare ratings with a Mann-Whitney / Kruskal-Wallis test. A t-test on the mean is common in practice and fine for large samples, but say its assumption.</li></ol>
<p><b>Example (illustrative):</b> 400 valid answers: 1 = 20, 2 = 40, 3 = 80, 4 = 160, 5 = 100. Top-2-box = (160 + 100) / 400 = 65%. Mean = (20 + 80 + 240 + 640 + 500) / 400 = 1,480 / 400 = 3.70.</p>
<p><b>Sample spoken answer:</b> "I show the whole distribution, then top-2-box for the headline. I use the mean for quick comparison but I do not average across very different items without thinking, and I test differences before saying a group is higher."</p>`,
'E',3,[`Why is the mean sometimes misleading for Likert data?`,`How do you handle "Neutral" and "Don't know"?`],
`Reporting only the mean. Two groups can have the same mean with very different distributions.`,['survey','likert']),

I(`What data quality problems appear in survey data, and how do you find them?`,
`The main ones are speeders, straight-liners, duplicates, bots, illogical answers and poor open-ends. I use several flags together, not one, and I look at the pattern before removing anyone.`,
`<table><tr><th>Problem</th><th>How to detect</th></tr>
<tr><td><b>Speeders</b></td><td>Completion time far below the median (a common rule is below about one-third to one-half of the median). Check by section too.</td></tr>
<tr><td><b>Straight-liners</b></td><td>Same answer across a long grid (zero variation). Be careful: it can be genuine if the grid items are all positive.</td></tr>
<tr><td><b>Bots / fraud</b></td><td>Gibberish or copy-pasted open-ends, many entries from the same IP or device, fake emails, failed hidden "honeypot" question.</td></tr>
<tr><td><b>Duplicates</b></td><td>Same respondent ID, email, device or identical answer pattern.</td></tr>
<tr><td><b>Logic errors</b></td><td>Contradictions (age 17 with 20 years of work experience), sums not equal to 100, answers shown to people who should be screened out.</td></tr>
<tr><td><b>Failed attention checks</b></td><td>"Select 'Agree' for this row" answered wrongly.</td></tr>
<tr><td><b>Poor open-ends</b></td><td>"asdf", "good", repeated text.</td></tr></table>
<p><b>Rule I follow:</b> build a quality score (for example one point per flag). Remove those with 2 or more serious flags, and manually review those with 1. Document the rule and the number removed, and give the client the list.</p>
<p><b>From my own work:</b> as a survey programmer I added many of these checks at the source: logic checks, attention checks, minimum time warnings, and quota controls. That means fewer problems reach the analysis stage. [Add one real example with X.]</p>`,
'E',3,[`Would you delete a speeder automatically?`,`How do you stop bots in the first place?`],
`Deleting based on one rule without checking. A fast respondent may just be a genuinely quick reader; combine flags.`,['survey','data-quality']),

I(`What is the difference between a population and a sample? Name some sampling methods.`,
`The population is everyone we want to learn about, the sample is the group we actually ask. Probability methods such as simple random and stratified give everyone a known chance of selection. Quota and convenience samples do not, so they can be biased.`,
`<p><b>Probability sampling</b> (each person has a known chance of selection, so the margin of error is meaningful):</p>
<ul><li><b>Simple random:</b> everyone has an equal chance.</li>
<li><b>Stratified:</b> split the population into groups (for example age bands) and sample within each, so every group is covered.</li>
<li><b>Cluster:</b> randomly pick groups (for example cities or schools) and survey people within them. Cheaper, less precise.</li>
<li><b>Systematic:</b> every k-th person from a list.</li></ul>
<p><b>Non-probability sampling</b> (no known chance, quicker and cheaper):</p>
<ul><li><b>Quota:</b> fill set numbers for each group (for example 50% female). Very common in market research and online panels.</li>
<li><b>Convenience:</b> whoever is easy to reach.</li>
<li><b>Snowball:</b> respondents refer others.</li></ul>
<p><b>Why it matters:</b> a quota sample can match the population on age and gender, but still miss people who never join panels. Formal margin-of-error formulas strictly apply to probability samples; for panels, say "indicative margin of error".</p>
<p><b>Sample spoken answer:</b> "In my projects most of the sample was online panel with quotas on age, gender and region. That helps the sample look like the population, but it is not random, so I would state that limitation when I report."</p>`,
'E',2,[`When would you choose stratified over simple random sampling?`,`Is a quota sample random?`],
`Saying a big sample is automatically a good sample. A huge biased sample is still biased.`,['survey','sampling']),

I(`How do you analyse open-ended survey responses?`,
`I read a sample to build a codeframe of themes, code every response against it, then count how often each theme appears and compare by segment. I keep an "Other" code small and check consistency between coders.`,
`<p><b>Steps:</b></p>
<ol><li><b>Clean:</b> remove blanks, "na", gibberish, duplicates. Keep a count.</li>
<li><b>Read a sample</b> (say 100 to 200 responses) to see the themes.</li>
<li><b>Build a codeframe:</b> a list of codes, each clear and not overlapping. Group them into nets (for example "Delivery" containing late, damaged, missing). Include "Other" and "Nothing / don't know".</li>
<li><b>Code every response.</b> One response can carry more than one code. Use keyword rules to speed up, but check by hand because words mislead (for example "not bad").</li>
<li><b>Quality check:</b> a second person codes 10% and compare. Agree on disputed codes.</li>
<li><b>Quantify:</b> % mentioning each theme, by segment (for example detractors vs promoters). Show 2 or 3 quotes per theme.</li>
<li><b>Report:</b> top themes, what changed from the last wave, recommended action.</li></ol>
<p><b>Sample spoken answer:</b> "For an NPS survey with 1,200 comments I would code the reasons into themes like price, delivery, support and product quality, then show that for example 40% of detractor comments mention delivery. That points the business to the fix. A machine can help with first-pass sentiment, but I would check a sample by hand."</p>`,
'E',2,[`How do you decide how many codes to have?`,`Can you use Python for this?`],
`Just showing a word cloud. It looks nice but gives no counts or action.`,['survey','open-end']),

I(`How does your survey-programming experience help you as a data analyst?`,
`I know how survey data is created: the logic, the routing and the quotas. So I can spot problems in the data quickly, I am used to clean respondent-level data, and I am used to client deadlines. I have added SQL, Python and Power BI to analyse and present that data.`,
`<p><b>Link each skill to an analyst task:</b></p>
<table><tr><th>What I did as a programmer</th><th>What it gives me as an analyst</th></tr>
<tr><td>Routing, skip logic and piping</td><td>I can read a questionnaire and know who was asked what, so I use the correct base for each %.</td></tr>
<tr><td>Quotas and sample management</td><td>I understand representativeness, over- and under-quota, and weighting needs.</td></tr>
<tr><td>Data QA (speeders, straight-liners, logic checks)</td><td>Data cleaning, validation and documentation of rules.</td></tr>
<tr><td>Exporting and structuring datasets (SPSS, Excel, CSV)</td><td>Working comfortably with wide respondent-level data, recoding, labels.</td></tr>
<tr><td>Client deadlines and last-minute changes</td><td>Delivering on time, communicating risks early.</td></tr>
<tr><td>Self-taught SQL, Python, Power BI</td><td>I can now analyse and visualise, not only collect.</td></tr></table>
<p><b>Sample spoken answer:</b> "For two years I built the surveys and made sure the data was right. That means I rarely get surprised by dirty data, because I know where it comes from. Now I want to be the person who turns that data into insights. I have built [X projects] with SQL, Python and Power BI. For example, [one project, one result]."</p>
<p><b>Honest point:</b> you do not have formal analyst job experience. Do not hide it. Present this as a strong base plus proof through projects.</p>`,
'E',3,[`Which tool did you use to program surveys, and what is the equivalent in analytics?`,`What is the first thing you check in a new survey dataset?`],
`Being modest ("I only did programming"). Tell the story of what you know about data and show the projects.`,['survey','career','transfer']),

I(`What is weighting and why is it needed? Give a simple example.`,
`If the sample does not match the population on key groups, say too many women, I give each respondent a weight so the groups count in their true proportions. A weight is population share divided by sample share.`,
`<p><b>Cell (post-stratification) weighting, simple case:</b> weight = population % / sample %.</p>
<p><b>Example (illustrative):</b> the population is 50% female and 50% male. The sample of 1,000 has 600 women and 400 men.</p>
<ul><li>Weight for women = 50 / 60 = 0.833</li><li>Weight for men = 50 / 40 = 1.25</li></ul>
<p>Check: 600 x 0.833 = 500 and 400 x 1.25 = 500. The weighted sample is 500 / 500 and the total is still 1,000.</p>
<p><b>Several variables:</b> when you need age, gender and region together, use <b>rim weighting (raking)</b>, which adjusts one variable at a time repeatedly until all margins match.</p>
<p><b>Cautions to say out loud:</b></p>
<ul><li>Weighting fixes the mix of known groups only. It cannot fix the problem when the people who answered differ from those who did not within a group.</li>
<li>Very large weights make results unstable. Trim them or merge small groups.</li>
<li>Weighting reduces the effective sample size (see the later question).</li>
<li>Show unweighted bases alongside weighted results.</li></ul>
<p><b>Sample spoken answer:</b> "If young respondents are over-represented, I weight so their share matches the population. I use a weight of population share divided by sample share, check that weighted totals match the targets, and report the unweighted base so the reader knows how many real people are behind each number."</p>`,
'M',3,[`When would you not weight?`,`What is rim weighting?`],
`Believing weighting removes all bias. It only corrects the groups you weight on.`,['survey','weighting']),

I(`What is non-response bias and how do you reduce it?`,
`It is bias that arises when the people who do not answer differ from those who do. A high response rate does not guarantee the answers are unbiased, but it lowers the risk. I reduce it with good design, reminders, and checking how respondents compare to the population.`,
`<p><b>Example (illustrative):</b> a satisfaction survey is emailed to customers. Very unhappy and very happy customers reply, the quiet middle does not. The results then look more extreme than the truth. Or, a long survey is skipped by busy people, so working professionals are under-represented.</p>
<p><b>How to reduce it:</b></p>
<ul><li><b>Design:</b> short survey, mobile-friendly, clear invite, honest time estimate, incentive where suitable.</li>
<li><b>Follow-up:</b> reminders, different times of day, other modes (phone, WhatsApp, in app).</li>
<li><b>Check:</b> compare respondent profile with the known population (age, region, usage). Compare early vs late responders; late responders often look like non-responders.</li>
<li><b>Adjust:</b> weight on known characteristics.</li>
<li><b>Be honest:</b> state the response rate and the limitation.</li></ul>
<p><b>Also related:</b> <b>sampling bias</b> is when the list you sample from misses people (for example a landline-only list). Non-response bias is about those who were chosen but did not respond.</p>
<p><b>Sample spoken answer:</b> "I would compare the profile of responders to the customer base and weight the gaps. I would also compare early and late responders, since late ones often resemble non-responders. And I would tell the stakeholder how much I trust the result."</p>`,
'M',3,[`Response rate is 8%. Is the survey useless?`,`How does bias differ from random error?`],
`Saying "we have 5,000 responses so bias is not a problem". Sample size reduces random error, not bias.`,['survey','bias']),

I(`What is the margin of error? Calculate it for a sample of 400.`,
`Margin of error shows how much a survey percentage could differ from the true value because we asked a sample, not everyone. For 400 respondents at 50%, it is about plus or minus 4.9 points at 95% confidence.`,
`<p><b>Formula for a proportion (95% confidence):</b> MOE = 1.96 x square root of ( p x (1 - p) / n ). The worst case is p = 50%, which gives the largest value.</p>
<p><b>Example:</b> n = 400, p = 0.5. Square root of (0.25 / 400) = square root of 0.000625 = 0.025. MOE = 1.96 x 0.025 = 0.049, which is <b>+/- 4.9 points</b>.</p>
<p><b>What it means:</b> if 52% say yes, the true figure is probably between about 47% and 57%. It does <b>not</b> mean there is a 95% chance the true value is in this range for any one survey, but that 95% of such intervals from repeated surveys would contain the truth.</p>
<p><b>Points to remember:</b></p>
<ul><li>Larger sample means smaller MOE, but slowly: you need 4 times the sample to halve it.</li>
<li>It covers sampling error only, not bias, bad questions or non-response.</li>
<li>For a subgroup, use the subgroup base: a segment of 100 gives 1.96 x square root of (0.25 / 100) = 9.8 points.</li>
<li>Strictly valid for random samples; for panels call it indicative.</li></ul>`,
'M',3,[`How many respondents do you need for plus or minus 5%?`,`Why is the margin of error larger for a sub-segment?`],
`Thinking the margin of error includes every kind of survey error.`,['survey','margin-of-error','stats']),

I(`In a crosstab, 52% of Group A are satisfied and 44% of Group B. Is the difference real?`,
`I do not decide by looking. I run a significance test for two proportions, which depends on the group sizes. With 300 in each group the gap is just at the 5% line, with 100 in each it is not significant.`,
`<p><b>Test:</b> two-proportion z-test (or chi-square for the 2x2 table). Both give the same answer for two groups.</p>
<p><b>Illustrative calculation:</b> pooled rate = 48%.</p>
<ul><li>n = 300 each: standard error = square root (0.48 x 0.52 x 2 / 300) = 0.0408. z = 0.08 / 0.0408 = <b>1.96</b>, right at the 5% line (borderline).</li>
<li>n = 100 each: standard error = square root (0.48 x 0.52 x 2 / 100) = 0.0707. z = 0.08 / 0.0707 = <b>1.13</b>, not significant.</li></ul>
<p>Same 8-point gap, different conclusion, because the bases are different.</p>
<p><b>How to speak about it:</b> "The difference is statistically significant at the 95% level" or "we cannot say the groups differ". Do not say "proves". Also say if it matters in practice, since a very large sample makes tiny gaps significant.</p>
<p><b>Cautions:</b></p>
<ul><li>A crosstab has many cells. With 100 comparisons, about 5 will look significant by chance. Focus on patterns that make sense, not single flags.</li>
<li>Check bases. Mark bases under 30 as "too small" and under 100 as "indicative" (common conventions).</li>
<li>Weighted data needs the effective base for tests.</li></ul>`,
'M',3,[`What does the letter next to a figure in a crosstab report mean?`,`What if you compare 20 groups at once?`],
`Calling a gap important just because it looks big, without checking the base size.`,['survey','crosstab','significance']),

I(`How do you find speeders and straight-liners in practice, and what do you do with them?`,
`I calculate each respondent's total time and compare it with the median, and I measure variation across grid questions. Then I combine the flags into a score, review the borderline cases, and remove only clear cases. I document the rule and the count.`,
`<p><b>Speeders (Excel/SQL/Python idea):</b></p>
<ol><li>Compute the median completion time. Example: median = 12 minutes.</li>
<li>Set a cut-off such as 40% of the median = 4.8 minutes. Many teams use roughly one-third to one-half; pick one, explain it, and apply it the same way every time.</li>
<li>Flag anyone below it. Also check the time per section, because someone can read the first page slowly and then rush.</li></ol>
<p><b>Straight-liners:</b> for each grid, compute the standard deviation across items (or count distinct answers). Standard deviation = 0 on a grid of 6 or more items is a flag. Check whether the items are reversed (a mix of positive and negative statements) because a genuine person would not tick the same box on all.</p>
<p><b>Then decide:</b></p>
<ul><li>One flag only: keep, or review manually.</li>
<li>Two or more flags (speeder + straight-liner + poor open-end): remove or reject.</li>
<li>If it is a paid panel, report to the panel provider and ask for a replacement.</li>
<li>Re-check that removing them does not skew quotas.</li></ul>
<p><b>Document:</b> rule, thresholds, number removed, before/after impact on key results.</p>
<p><b>Sample spoken answer:</b> "I do not delete on a single rule. I score respondents on several quality flags, check borderline ones by hand, and record the rules so someone else can repeat them. I also measure whether the cleaning changed the headline numbers."</p>`,
'M',3,[`What if removing speeders changes the main result?`,`How would you do this in Python?`],
`Using one cut-off without looking at the time distribution. A sensible cut-off comes from the data.`,['survey','data-quality']),

I(`NPS was +40 last quarter and +45 this quarter, with about 400 respondents each time. Can you say it improved?`,
`Not with confidence. At 400 respondents, each NPS has a margin of error of roughly 8 points, and the difference between two waves needs about 11 points to be clearly real. So a 5-point rise could easily be noise.`,
`<p><b>Why NPS needs care:</b> NPS combines two percentages, so its error is larger than for a single percentage.</p>
<p><b>Standard error of NPS:</b> square root of ( (p + d) - (p - d)^2 ) / n, where p = share of promoters and d = share of detractors.</p>
<p><b>Illustrative:</b> p = 0.45, d = 0.25 (NPS = +20), n = 400. (0.70 - 0.04) / 400 = 0.00165, square root = 0.0406, or 4.06 points. 95% margin = 1.96 x 4.06 = about <b>+/- 8 points</b>.</p>
<p><b>Comparing two waves</b> (both n = 400): standard error of the difference = 4.06 x square root of 2 = 5.74. A 95% margin = about <b>+/- 11 points</b>. So a 5-point move is well inside the noise.</p>
<p><b>What I would say:</b> "I would report +45 versus +40 as 'broadly stable, not clearly different'. I would look at the shifts in promoters and detractors, any change in who answered, and wait for the trend over several waves. If it matters, a larger sample would help."</p>
<p><b>Also check:</b> same method, same sample mix, same question wording between the two waves. Changes in these can move NPS on their own.</p>`,
'M',2,[`How could you increase the confidence?`,`Which matters more, a 5-point NPS move or a change in detractor reasons?`],
`Celebrating a small NPS move without any error margin.`,['survey','nps','significance']),

I(`How do you check that a survey sample is representative, and what do you do about quota fill problems?`,
`I compare the achieved sample with known population targets (for example census or customer base) on key variables, and I watch quota fill during fieldwork. If a quota is slow, I widen the invite, adjust incentives, or relax the quota in agreement with the client, and then correct with weighting.`,
`<p><b>Checking:</b></p>
<ol><li>List the targets (age, gender, region, usage) from a trusted source.</li>
<li>Compare achieved % with target %, and calculate the gap in points.</li>
<li>Look at the dropout pattern: which groups start but do not finish (a long grid can lose older or mobile respondents).</li>
<li>Check for hidden skew such as all responses on one device, or all in the first two hours of launch.</li></ol>
<p><b>When a quota is not filling (very common):</b></p>
<ul><li>Is incidence lower than planned? Recheck the screener: is it too strict or confusing?</li>
<li>Send more invites to that group, add another sample source, raise incentive.</li>
<li>Agree with the client a relaxed target (for example 90% of quota) and correct with weights.</li>
<li>Do not fill quota with poor data or by letting respondents change their answers to qualify.</li></ul>
<p><b>Terms:</b> <b>incidence rate</b> = % of those entering who qualify. If only 5% qualify, you need 20 people screened for one complete.</p>
<p><b>This is where your background helps:</b> you already monitor quotas live. As an analyst you can quantify the effect: how much does the headline number change after weighting?</p>`,
'M',2,[`What is incidence rate?`,`Would you ever close a quota early?`],
`Looking only at total sample size and ignoring who is inside it.`,['survey','quota','sampling']),

I(`You have scores for 8 satisfaction attributes and an overall satisfaction rating. How do you find what drives overall satisfaction?`,
`I use derived importance: relate each attribute to overall satisfaction using correlation or a simple regression, then plot importance against performance to see what is important but weak. That points to what to fix first.`,
`<p><b>Why not just ask "how important is X"?</b> People say everything is important (stated importance). Derived importance learns it from how ratings move together.</p>
<p><b>Steps:</b></p>
<ol><li>Clean the data. Remove "Don't know" answers or handle them by pairs.</li>
<li>Correlation of each attribute with overall satisfaction, as a first look.</li>
<li>Multiple regression with overall satisfaction as outcome and attributes as predictors. Standardised coefficients show relative importance. If attributes overlap heavily (multicollinearity), use relative-weights or Shapley methods, or combine similar attributes.</li>
<li>Plot a 2 x 2 chart: importance (derived) on one axis and performance (top-2-box) on the other.</li>
<li>Read it: <b>high importance and low performance</b> = fix first. High importance and high performance = protect. Low importance and low performance = low priority.</li></ol>
<p><b>Cautions:</b> this shows association, not proof of cause. Sample size should be several times the number of attributes. Ratings often correlate because of a general good or bad mood (halo effect).</p>
<p><b>Sample spoken answer:</b> "I would run a regression of overall satisfaction on the attributes and plot importance against performance. If delivery speed has high importance but a low top-2-box score, that is my first recommendation. I would also say it shows association, so the fix should be tracked."</p>`,
'M',2,[`What if two attributes are highly correlated with each other?`,`Why not just ask customers what matters to them?`],
`Reading correlation as cause, or not mentioning how the data was cleaned.`,['survey','drivers','stats']),

I(`How do you treat "Don't know", "Not applicable" and missing answers when you report results?`,
`I decide the base clearly: for a score like a mean or top-2-box I usually exclude "Don't know" and "Not applicable" and show the base, but if "Don't know" is itself a finding I report it. I also check whether the missing answers are random or systematic.`,
`<p><b>Think in terms of the base (the denominator):</b></p>
<ul><li><b>Not applicable / not asked (due to routing):</b> they are not part of the base. For example "Satisfaction with the delivery" is based on those who had a delivery.</li>
<li><b>Don't know:</b> a valid answer for knowledge or awareness questions ("Which brands have you heard of?"), and part of the story. For rating questions, many analysts exclude it for the mean but show it separately so the reader sees how many could not rate.</li>
<li><b>Refused / skipped:</b> check if skipping is linked to the question (income, age). If many skip, say so.</li></ul>
<p><b>Example (illustrative):</b> 500 asked, 100 say "Don't know", 400 rate, and 260 are satisfied. Satisfied among raters = 260 / 400 = 65%. Satisfied among all asked = 260 / 500 = 52%. Both can be correct, but they answer different questions. State the base on the chart.</p>
<p><b>Practical habits:</b> always write "Base: n = 400 respondents who rated" under a chart, keep one rule for the whole report, and keep a data dictionary that says which codes mean DK and NA.</p>
<p>Your programming experience (knowing who was routed to which question) makes this easier to get right.</p>`,
'M',2,[`A client wants the % on all respondents, not just those who rated. What do you do?`],
`Changing the base between charts without saying so.`,['survey','base','data-quality']),

I(`How many respondents do you need for a survey, and what if the client wants results for every sub-group?`,
`For overall results at 95% confidence and plus or minus 5 points I need about 385 respondents. But precision is set by the smallest group the client wants to read, so for sub-groups I plan the sample per group, not just in total.`,
`<p><b>Formula for a proportion:</b> n = 1.96^2 x p x (1 - p) / MOE^2. With p = 0.5 and MOE = 0.05: n = 3.84 x 0.25 / 0.0025 = <b>384.2</b>, so about <b>385</b>.</p>
<p><b>Sub-groups:</b> if the client wants 6 regions each read at plus or minus 5, they need 385 in each region, which is 2,310 in total. At plus or minus 10 points each group needs about 96 respondents, which is 576 in total.</p>
<p><b>Trade-offs to discuss:</b></p>
<ul><li>Budget and field time versus precision.</li>
<li>Do they need to compare groups? Detecting a small gap between two groups needs a larger base than estimating one group.</li>
<li>Options: boost the sample for small groups and weight back for total results, or combine groups, or accept wider margins and say so.</li>
<li>Finite population: if the population is small (for example 800 employees), you need fewer people, and a census may be better.</li>
<li>Allow for removals: if you expect 10% of data removed, recruit 10% extra.</li></ul>
<p><b>Sample spoken answer:</b> "I would ask what is the smallest group they need to read and what precision they accept. For total only, about 385. For six regions at plus or minus 5, about 385 per region. If that is too costly, I would suggest a boost sample for the key regions, or accepting plus or minus 10."</p>`,
'H',2,[`What if the client's budget only allows 500 respondents?`,`Does the population size matter?`],
`Giving "1,000 is enough" without asking about sub-groups and precision.`,['survey','sample-size','stats']),

I(`After weighting, your 1,000 respondents have an effective sample size of 960. What does that mean, and why does it matter?`,
`Weighting adds variation to respondent weights, and that reduces precision. The effective sample size tells me the size of an unweighted sample that would give the same precision. Here 1,000 weighted respondents behave like 960, so margins of error are a bit wider than the raw count suggests.`,
`<p><b>Formula (Kish):</b> effective n = (sum of weights)^2 / (sum of squared weights).</p>
<p><b>Using the earlier example:</b> 600 women with weight 0.8333 and 400 men with weight 1.25.</p>
<ul><li>Sum of weights = 500 + 500 = 1,000</li>
<li>Sum of squared weights = 600 x 0.6944 + 400 x 1.5625 = 416.7 + 625 = 1,041.7</li>
<li>Effective n = 1,000^2 / 1,041.7 = <b>960</b></li></ul>
<p><b>Design effect</b> = actual n / effective n = 1,000 / 960 = 1.04. Margin of error grows by the square root of 1.04, so about 2%. For small weight differences the cost is small.</p>
<p><b>When it matters:</b> with extreme weights (for example one group weighted 5 times), the effective n can drop sharply and results become unstable. Then I trim the weights, combine small cells, or plan a boost sample next time.</p>
<p><b>Use it for tests:</b> significance tests and margins of error on weighted data should use the effective sample size, not the raw count. Many tools do this for you, but you should know why.</p>
<p><b>Sample spoken answer:</b> "Weighting corrects the mix but costs some precision. I check effective sample size and the largest weights, and if they are large I trim them and say so in the methodology."</p>`,
'H',1,[`Why are very large weights a problem?`,`How do you trim weights?`],
`Using the raw respondent count for the margin of error on weighted data.`,['survey','weighting','stats']),

I(`A client wants to run a survey to find out why customers are leaving. How would you design it so the answers are trustworthy?`,
`I would start from the decision the client needs to make, sample both leavers and stayers, keep questions neutral and short, ask reasons in the customer's own words first, and then pre-test and check for bias. And I would compare the survey with behaviour data, because what people say and do can differ.`,
`<p><b>Steps:</b></p>
<ol><li><b>Objective:</b> what decision will this support (fix pricing, onboarding, delivery)?</li>
<li><b>Who to ask:</b> recent leavers (soon after leaving, so they remember), plus a comparison group of active customers, so you can see what leavers say differently.</li>
<li><b>Question design:</b>
<ul><li>Open-ended first: "What was the main reason you stopped?", then a list of reasons to rank.</li>
<li>Rotate the list order to avoid order bias. Include "Other (specify)" and "Don't know".</li>
<li>No leading words ("How disappointed were you by our slow delivery?"), no double-barrelled questions ("price and quality"), simple language.</li>
<li>Keep it short (under 5 to 7 minutes) to reduce drop-off.</li></ul></li>
<li><b>Bias risks:</b> low response from angry customers (non-response), people giving polite or socially acceptable reasons, and recall errors.</li>
<li><b>Pre-test</b> with a few people, and soft launch to check logic and timing.</li>
<li><b>Link to data:</b> join with behaviour (last usage, support tickets, plan) so you can check what people say against what they did.</li>
<li><b>Analysis:</b> code open-ends, compare leavers with stayers, test differences, report with base sizes and limitations.</li></ol>
<p><b>Sample spoken answer:</b> "I would ask recent leavers and a comparison group, put the open-ended reason first, rotate the options, and join the results with usage data. If a customer says 'price' but their usage had dropped months before, I would treat 'price' as a possible excuse, not the root cause."</p>`,
'H',2,[`How do you handle the fact that only angry leavers respond?`,`Which question would you ask first and why?`],
`Writing a long survey with leading or double-barrelled questions, and treating stated reasons as the whole truth.`,['survey','design','bias']),

I(`Your quarterly satisfaction tracker dropped 6 points. The client wants to blame the product. How would you check before agreeing?`,
`First I rule out survey causes: a change in sample mix, question wording, mode or fieldwork timing. Then I check whether the drop is statistically significant, and whether it shows up in all segments. Only then do I connect it to product or service changes.`,
`<p><b>Checklist:</b></p>
<ol><li><b>Significance:</b> with the base sizes, is a 6-point change outside the margin of error (for example about plus or minus 5 to 8 points for bases near 400)?</li>
<li><b>Method consistency:</b> same questionnaire, same question order, same mode (online vs phone), same sample source, same months/season, same incentives. Any change here can move scores.</li>
<li><b>Sample mix:</b> compare profile with the last wave (age, region, new vs long-term customers). Re-weight both waves on the same targets and see if the drop remains.</li>
<li><b>Data quality:</b> did the share removed for speeding or fraud change?</li>
<li><b>Where is the drop?</b> Slice by segment, region, product. A drop in one segment points to a specific cause. A drop everywhere may point to method.</li>
<li><b>Link to events:</b> price changes, outages, new policy, competitor activity, complaints data, operational KPIs.</li>
<li><b>Open-ends:</b> compare the main themes with the previous wave.</li></ol>
<p><b>What I tell the client:</b> "I cannot yet say it is the product. After we check the method and the mix, here is what the data shows. If the drop is real and concentrated in new customers after the March change, then there is a strong case for a product link, and I suggest a follow-up check."</p>
<p>This is a true strength of survey experience: you know how many non-product factors can shift a tracker.</p>`,
'H',2,[`Mode switched from phone to online between waves. What then?`,`How do you present an uncertain conclusion to a client who wants a clear answer?`],
`Accepting the first explanation that the client suggests, without checking the method.`,['survey','tracker','bias'])

];

/* ===================== HR & BEHAVIOURAL (25) ===================== */
/* Placeholders: X, N, [your detail]. Replace with REAL facts only. Never invent achievements. */
const hr=[

I(`Tell me about yourself.`,
`I am a survey programmer with 2+ years of experience in logic, quotas and data QA. Over the last months I taught myself SQL, Python and Power BI and built projects with them. Now I want to move into a data analyst role where I turn data into decisions.`,
`<p><b>Formula: Present, Past, Future (60 to 90 seconds).</b></p>
<p><b>Model answer (fill the brackets with real facts):</b></p>
<p>"I am [name]. For the last [2+ years] I have worked as a survey programmer at [company], where I build questionnaires with complex logic, manage quotas, and check the data quality before it goes to clients, often under tight deadlines. [One real number: for example I handled around N projects at a time / delivered N surveys.]</p>
<p>Working with this data made me curious about what happens after collection, so I taught myself SQL, Python and Power BI. I have built [N] projects, for example [one-line project and result], which you can see on my [GitHub / portfolio].</p>
<p>Now I am looking for an entry-level data analyst role where I can use my data-quality and domain understanding and grow into deeper analysis. That is why this role at [company] interests me."</p>
<p><b>What the interviewer is testing:</b> can you summarise your story clearly, and does it point toward this job? Keep it under 90 seconds, no life history, no school marks unless you are a fresh graduate.</p>
<p><b>Tips:</b> end with a bridge to the role, practise aloud until it sounds natural (not memorised), and have 2 or 3 numbers ready.</p>`,
'E',3,[`Which of those projects are you most proud of?`,`What does a typical day look like in your current job?`],
`Reading the CV aloud, or talking for 4 minutes about hobbies and school. Present, past, future, then stop.`,['hr','intro']),

I(`Why do you want to switch from survey programming to data analysis?`,
`I enjoyed the data and logic side of my work and I want to go from building data collection to working out what the data says and what to do next. I have already invested time in SQL, Python and Power BI, so this is a planned move, not a sudden one.`,
`<p><b>Model answer:</b></p>
<p>"In my current role I make sure the data is collected correctly. What I enjoy most is the moment the data comes in and someone asks 'so what does this tell us?'. I want to be the person who answers that. Over the last [N months] I learned SQL, Python and Power BI on my own and built [N] projects, for example [project]. I see my survey experience as an advantage: I understand how data is made, so I find errors faster and I know where bias can come from. I am not leaving because I dislike my job; I am moving toward the work I want to do next."</p>
<p><b>What the interviewer is testing:</b> is the move planned and positive, or an escape? Do you speak badly about your current employer? Do you show proof (projects) and not just wishes?</p>
<p><b>Avoid:</b> "salary is low", "no growth", "boring work", or blaming the manager. Talk about what you are moving towards.</p>`,
'E',3,[`Will you not miss survey programming?`,`Why not become a survey researcher or research analyst instead?`],
`Complaining about the current job. Always give a positive reason and show proof of learning.`,['hr','switch']),

I(`You have no data analyst experience. Why should we hire you?`,
`I do have close to two years of experience with data: building it, checking it and delivering it to clients on deadlines. I added SQL, Python and Power BI and built projects that you can see. I learn fast and I do not need hand-holding on data quality, which saves a team time.`,
`<p><b>Model answer:</b></p>
<p>"You are right that my job title was not 'analyst'. But the core of my work was data: logic, validation, cleaning and delivering clean datasets to clients on time, with [N] projects at a time. On top of that I taught myself [SQL, Python, Power BI] and built [N] projects. For example, in [project name] I [what you did] and found [result, using real numbers]. What I bring is attention to detail, comfort with messy data, a deadline habit and a strong willingness to learn. I do not claim to know everything, but I can contribute from week one on data checking and reporting while I grow on the analysis side."</p>
<p><b>What the interviewer is testing:</b> honesty plus confidence. Do you accept the gap without being defensive, and do you point to real proof?</p>
<p><b>Tip:</b> never exaggerate your experience. If they test SQL and you cannot do it, the exaggeration will show. Be accurate and show growth.</p>`,
'E',3,[`How do I know you can learn on the job?`,`Which is your weakest skill right now, and what are you doing about it?`],
`Becoming defensive or over-claiming. Calmly accept the gap and show proof.`,['hr','no-experience']),

I(`What are your strengths?`,
`My main strengths are attention to detail in data and a calm approach to deadlines. In survey work a small logic error can affect thousands of responses, so I check carefully. I also learn quickly: I picked up SQL, Python and Power BI by myself.`,
`<p><b>Pick 2 strengths that matter for an analyst, and prove each with a short example:</b></p>
<ol><li><b>Data accuracy / attention to detail.</b> "In [project], I caught [type of issue] before it reached the client by [what you checked]. It affected about N records."</li>
<li><b>Fast self-learning.</b> "I went from [no SQL] to [writing joins and window functions] in [N months], and I built [project] to prove it."</li>
<li>(Optional) <b>Clear communication with clients.</b> "I explain technical issues in simple words to clients and project managers."</li></ol>
<p><b>Structure for each:</b> strength, one-line proof, why it helps this job.</p>
<p><b>What the interviewer is testing:</b> self-awareness and relevance. A strength with no evidence is just a word.</p>`,
'E',3,[`Give me an example of that strength in action.`],
`Listing 6 adjectives (hard-working, team player, passionate) without a single example.`,['hr','strengths']),

I(`What is your weakness?`,
`Pick a real, small weakness and show what you are doing about it. For example: I used to spend too long polishing before sharing a first version. Now I timebox the work and send a draft early to get feedback.`,
`<p><b>Formula:</b> real weakness, impact, what you did, current result.</p>
<p><b>Good examples (choose one that is true for you):</b></p>
<ul><li>"I sometimes spent too long perfecting my work. I now set a time limit for each task and share a first version early. My manager's feedback is [X]."</li>
<li>"I am newer to statistics than to data handling. I am studying [topic] and applying it in [project]."</li>
<li>"I used to hesitate to ask for help. I now ask after trying for 30 minutes, with what I tried, so it saves time."</li></ul>
<p><b>Avoid:</b> "I am a perfectionist" with no fix, "I work too hard", a skill that is core to the job (for example "I am bad with numbers"), or "I have no weakness".</p>
<p><b>What the interviewer is testing:</b> honesty and growth mindset.</p>`,
'E',3,[`How do you know it is improving?`],
`Giving a fake weakness ("I care too much") or a weakness that disqualifies you.`,['hr','weakness']),

I(`Why do you want to join our company? Why this role?`,
`I will name one specific thing about their product or data that interests me, connect it to my skills, and say what I hope to learn. I research the company before every interview, so the answer is specific and not generic.`,
`<p><b>Prepare in 20 minutes before each interview:</b></p>
<ul><li>What does the company do, and who are its customers?</li>
<li>What kind of data do they have (orders, learners, loans, surveys)?</li>
<li>Read the job description: which tools and tasks match you?</li>
<li>Find one recent thing: a product launch, news, a blog post, a report.</li></ul>
<p><b>Model answer (fill the brackets):</b></p>
<p>"I am drawn to [company] because [specific: your product / the scale of data / how you use data to decide X]. In this role I would work with [tools from the JD], which matches what I have done in [project]. My survey background also helps with [customer feedback / data quality]. I also see that the team [something you found], and I would like to learn from that."</p>
<p><b>What the interviewer is testing:</b> did you do your research, and is your interest genuine or are you applying to everything?</p>
<p><b>Avoid:</b> "good brand", "good salary", "I need a job", or a generic answer you could say to any company.</p>`,
'E',3,[`What do you know about our product?`,`What do you think we could improve using data?`],
`A generic answer that fits any company. Mention one specific detail.`,['hr','company']),

I(`Where do you see yourself in 5 years?`,
`In five years I want to be a confident, senior analyst, strong in SQL, statistics and storytelling, with solid domain knowledge, and possibly guiding newer analysts. I want to grow here, not just in my title.`,
`<p><b>Model answer:</b></p>
<p>"In the first year I want to become reliable: deliver accurate analysis and dashboards that people use. In 2 to 3 years I want to own an area, such as [marketing / product / operations] analytics, and handle things like experiments and deeper analysis. In 5 years I see myself as a senior analyst who can guide juniors, and who has deep understanding of the business. I am open to whether that becomes analytics management or a specialist path, depending on where I am best."</p>
<p><b>What the interviewer is testing:</b> are you ambitious but realistic, and will you stay and grow with the company?</p>
<p><b>Avoid:</b> "I want your position", "I will start my own business", "I do not know", or a plan that has nothing to do with this job (for example moving abroad for another field).</p>`,
'E',3,[`What if there is no promotion path in 2 years?`],
`Either having no answer or being overly ambitious ("manager in 1 year").`,['hr','goals']),

I(`What is your notice period? Can you join earlier?`,
`I will give my exact notice period honestly and say whether it is negotiable, and I will not promise something I cannot do. I will say I want to leave my current team in a professional way, which also shows how I will treat this company.`,
`<p><b>Model answer:</b></p>
<p>"My notice period is [X days / X months]. I will hand over my current projects properly, and I would like to leave on good terms. If it helps, I can ask my manager about an earlier release or a buyout, but I cannot promise it now. [If serving: Last working day will be about DATE.]"</p>
<p><b>Points to know (India):</b></p>
<ul><li>Read your own offer letter and appointment letter for the exact notice and buyout rule.</li>
<li>A notice buyout may mean the new company pays, or you pay. Ask the HR how they handle it.</li>
<li>Do not tell HR "I can join in 15 days" if your contract says 60 days and your manager has not agreed.</li>
<li>If you are not serving yet, say when you would resign after the offer. If you are already serving, say your last working day.</li>
<li>Do not criticise your current manager when asking for early release.</li></ul>
<p><b>What the interviewer is testing:</b> how fast they can fill the role, and whether you are honest and professional. Many companies prefer a candidate who is a bit later but reliable over a promise that falls through.</p>`,
'E',3,[`Is the notice period negotiable?`,`Will you have any issue with a background or reference check?`],
`Promising a joining date that your current employer has not agreed to.`,['hr','notice']),

I(`What questions do you have for us?`,
`Always ask 2 or 3 good questions. They show you are serious. I ask about the first 90 days, how success is measured, the tools and data the team uses, and how feedback and growth work.`,
`<p><b>Good questions to choose from:</b></p>
<ul><li>"What would success look like in the first 90 days for this role?"</li>
<li>"What are the main data sources and tools the team uses today?"</li>
<li>"What is the biggest business question the analytics team is trying to answer this year?"</li>
<li>"How do analysts work with stakeholders: do you get a request and deliver, or do you take part in planning?"</li>
<li>"How does the team give feedback and support juniors?"</li>
<li>"Is there anything in my background you would like me to clarify?" (shows confidence, gives you a chance to fix doubts)</li></ul>
<p><b>Do not ask in a first round:</b> salary, leave, work from home policy first thing. Ask these with HR in the right round. Do not ask things you can read on their website.</p>
<p><b>What the interviewer is testing:</b> curiosity, preparation and fit. "No questions" looks disinterested.</p>`,
'E',3,[`Any concerns about your fit for this role?`],
`Saying "No, everything is clear." Ask at least two questions.`,['hr','questions']),

I(`Tell me about a challenging project and how you handled it. (use STAR)`,
`I use STAR: Situation, Task, Action, Result. I pick a real project with a deadline or a data problem, say what I personally did in simple steps, and end with a measurable result and a lesson.`,
`<p><b>STAR in 4 lines (about 90 seconds):</b></p>
<ol><li><b>Situation:</b> the context in one sentence.</li>
<li><b>Task:</b> what was my responsibility and the deadline or risk.</li>
<li><b>Action:</b> 2 to 3 specific things <i>I</i> did (say "I", not "we").</li>
<li><b>Result:</b> a number if possible, plus what I learned.</li></ol>
<p><b>Model structure (fill with a real story, never invent):</b></p>
<p>"<b>S:</b> On a [type] survey for [client type], we found two days before delivery that [problem, for example routing sent about N respondents to the wrong section]. <b>T:</b> I owned the survey logic and the deadline was [date]. <b>A:</b> I first counted how many records were affected, [N]. Then I fixed the logic, re-ran my test cases, and told the project manager the same day with two options. I also wrote a short checklist for similar surveys. <b>R:</b> We delivered [on time / one day late with the client's agreement], the client accepted the data, and the checklist is now used in [N] projects. I learned to report a problem early with options."</p>
<p><b>What the interviewer is testing:</b> your thinking, ownership and communication under pressure. Keep it specific and your own role clear.</p>
<p><b>Prepare 4 stories</b> and reuse them: (1) tight deadline, (2) a data error you caught, (3) conflict or difficult stakeholder, (4) self-learning or a project you built. Write each on one page with real numbers.</p>`,
'M',3,[`What would you do differently now?`,`What was your exact role versus the team's?`],
`Using "we" all the time, or giving a story with no result. Say what you did and the outcome.`,['hr','star']),

I(`How do you manage multiple deadlines at once?`,
`I list everything with due dates and impact, clarify real priorities with my manager, break big tasks into small steps, and warn people early if something will slip. I avoid switching between tasks too often.`,
`<p><b>Method:</b></p>
<ol><li><b>List all tasks</b> with the due date and who is waiting on it.</li>
<li><b>Rank</b> by impact and urgency. Ask my manager when two priorities clash.</li>
<li><b>Break down</b> big tasks into milestones, for example data check, analysis, draft, review.</li>
<li><b>Block time</b> for deep work and handle quick requests in batches.</li>
<li><b>Communicate early:</b> "This will be 1 day late because X. Here is what I can deliver today."</li>
<li><b>Review daily:</b> a 5-minute plan each morning.</li></ol>
<p><b>Real evidence (use your own):</b> "In survey work I often had [N] projects in field at once, each with a launch date. I used a tracker with the next action per project and checked it every morning. That is how I [delivered N projects on time / avoided missed launches]."</p>
<p><b>What the interviewer is testing:</b> organisation, communication and judgement, not just "I work hard".</p>`,
'M',3,[`What do you do when everything is urgent?`,`Tell me about a time you missed a deadline.`],
`Saying "I work late" as the plan. A system plus early communication is a better answer.`,['hr','deadlines']),

I(`Tell me about a mistake you made at work and what you did about it.`,
`I choose a real mistake that was small or medium, not a disaster. I own it, explain how I found it, what I did to fix it quickly, how I informed the right people, and what check I added so it cannot repeat.`,
`<p><b>Structure:</b> What happened, how I found out, what I did immediately, what I changed.</p>
<p><b>Model answer (use your real case):</b></p>
<p>"In a [type] project I [specific mistake, for example forgot to apply a quota rule / mis-coded a skip condition]. I noticed it during my final check / when the client asked about [issue]. I immediately told my manager, worked out that it affected about [N] respondents, fixed it and re-tested, and sent the client a short note on the corrected data. After that I added [a checklist item / a test case / a peer review step]. Since then [no similar issue in N projects]."</p>
<p><b>What the interviewer is testing:</b> honesty, ownership and learning. Everyone makes mistakes; what matters is that you do not hide them, and you build a safeguard.</p>
<p><b>Avoid:</b> "I never made a serious mistake", blaming others, or a mistake that shows poor ethics (such as hiding it).</p>`,
'M',3,[`How did your manager react?`,`Did you ever find a mistake in someone else's work? What did you do?`],
`Claiming no mistakes, or telling a story where someone else was to blame.`,['hr','mistake']),

I(`Tell me about a time you disagreed with a colleague or a client. How did you handle it?`,
`I listen first to understand their point, then I bring facts or data, and I look for a solution that serves the goal. If we still disagree, I take it to my manager respectfully. I try to keep the relationship intact.`,
`<p><b>Structure:</b> Situation, my view and their view, what I did to resolve it, outcome.</p>
<p><b>Model answer (use a real case):</b></p>
<p>"A client wanted [for example to add N more questions to a survey that was already too long / to change a quota target mid-field]. I thought it would hurt completion and data quality. I first asked why it was important. Then I showed them the current drop-off rate and an estimate of what the extra length could do. We agreed to [add only the 3 key questions / move the rest to a second wave]. The client was happy with the result and the survey completed on time."</p>
<p><b>What the interviewer is testing:</b> maturity and teamwork. Do you listen, use evidence, and keep calm? Or do you win arguments and damage relationships?</p>
<p><b>Rules:</b> never speak badly about the person. Show that you changed your own mind if they were right.</p>`,
'M',3,[`What if the client still insists?`,`Have you ever been proven wrong? What did you do?`],
`Telling a story where you were completely right and the other person was a fool.`,['hr','conflict']),

I(`What is your salary expectation? (India: CTC, fixed vs variable, in-hand)`,
`I would first say I would like to understand the role and the full compensation structure, then give a researched range based on my skills and the market, and say I am flexible for the right role. I do not give a random number or lie about my current salary.`,
`<p><b>Preparation (do this before any HR call):</b></p>
<ol><li><b>Research the market range</b> for entry-level data analyst roles in your city and company type. Check Glassdoor, AmbitionBox, LinkedIn salaries and ask peers. Do not rely on one site. I am not quoting any number here, because it changes by city, company and year.</li>
<li><b>Know your current numbers</b> from your payslip and offer letter: fixed pay, variable or bonus, PF, insurance, and in-hand monthly salary.</li>
<li><b>Know the terms.</b> <b>CTC</b> (cost to company) is the total the company spends, including employer PF, gratuity, insurance, and variable pay. <b>Fixed</b> is paid regardless of performance. <b>Variable</b> depends on performance and may not be paid in full. <b>In-hand</b> is what reaches your bank account after PF, tax and deductions. A higher CTC does not always mean a higher in-hand.</li>
<li><b>Decide your range:</b> a minimum you will accept, a realistic target, and a stretch.</li></ol>
<p><b>Model answer:</b></p>
<p>"Based on my research for this role and my skills, I am looking at around [your range] CTC, and I would like to understand the fixed and variable split. I am flexible, and most important for me are the role, the learning, and the growth path. May I ask what range you have set for this position?"</p>
<p><b>If they ask your current CTC:</b> be honest (they may check payslips or Form 16), but you can say "My current CTC is [X], of which fixed is [Y]. I am looking for a move that matches the new role's responsibilities." Do not inflate.</p>
<p><b>When you get an offer:</b> ask for the full breakup (fixed, variable, joining bonus, insurance, notice period, probation), compare in-hand, and take a day to respond politely. A reasonable hike for a career-switch role is not guaranteed. Switching domain sometimes means a smaller jump, and long-term growth matters more.</p>
<p><b>What the interviewer is testing:</b> realistic expectations, honesty, and negotiation maturity.</p>`,
'M',3,[`What is your current CTC and in-hand?`,`Our budget is lower than your range. What will you do?`],
`Giving a very high or very low number without research, or lying about the current CTC.`,['hr','salary']),

I(`How do you handle a stakeholder who keeps changing the requirement or pushes back on your numbers?`,
`I stay calm, restate what I understood, ask what decision they need to make, and show how the numbers were built. If the requirement changes, I explain the impact on time, and we agree one version in writing.`,
`<p><b>For changing requirements:</b></p>
<ol><li>Ask what decision the output will support. Often the real need is stable even if the request changes.</li>
<li>Confirm the requirement in writing (a short email with 3 bullet points).</li>
<li>When something new arrives, say: "I can add that. It adds about N hours, so the delivery moves from Tuesday to Wednesday. Is that okay, or should I drop something else?"</li></ol>
<p><b>For pushback on numbers:</b></p>
<ol><li>Do not defend or attack. Say "Let me check how it was calculated and show you."</li>
<li>Walk them through source, filters and definitions. Often the difference is a definition.</li>
<li>If you made an error, admit it and fix it. If you are right, show the evidence calmly.</li></ol>
<p><b>Link to your background:</b> "As a survey programmer I regularly worked with clients who changed the questionnaire after the survey was programmed. I learned to confirm changes in writing and to explain their impact on time and data."</p>
<p><b>What the interviewer is testing:</b> patience, communication and professionalism.</p>`,
'M',3,[`What if the stakeholder wants the data to show a particular result?`,`How do you document requirements?`],
`Either giving in to every change, or arguing. Aim for clarity and a written agreement.`,['hr','stakeholder']),

I(`How have you learned new skills quickly? How can we trust that you will learn on the job?`,
`I give a real example of my self-learning: how I started with SQL, what I practised, how long it took, and what I built to prove it. My method is to learn a little, build something real, and get feedback.`,
`<p><b>Model answer (use your real timeline):</b></p>
<p>"When I decided to move into analytics, I made a plan: [for example 1 to 2 hours daily]. I learned SQL by practising on [platform] and then wrote queries on a real-style dataset in [project]. For Python I started with pandas on [dataset]. For Power BI I rebuilt [a dashboard] and published it. I did not only watch videos, I built something at every step, so I could find my gaps. In [N months] I could [do concrete thing]. I will use the same method on the job: learn the data, the tools and the business questions in the first weeks and ask when I am stuck."</p>
<p><b>Evidence interviewers like:</b> projects, a GitHub link, certifications only if you actually used the skill, and the ability to explain what you built.</p>
<p><b>What the interviewer is testing:</b> motivation, discipline and honest self-assessment. A learning claim with no proof is weak.</p>`,
'M',3,[`How would you learn our internal systems in the first month?`,`What are you learning now?`],
`Saying "I am a fast learner" with no evidence.`,['hr','learning']),

I(`How do you handle feedback or criticism?`,
`I listen without defending, ask a question to be sure I understand, thank the person, and then act on it. I give them a quick follow-up so they see the change.`,
`<p><b>Model answer:</b></p>
<p>"I try to listen first and not explain why I did it. Then I clarify: 'Can you show me an example of what better looks like?' Then I fix it, and I tell the person what I changed. For example, [real example: a manager told me my reports were too long / my documentation was thin]. I [what you changed], and the next review said [result]."</p>
<p><b>What the interviewer is testing:</b> coachability. Entry-level analysts will be corrected often, and managers want people who improve quickly.</p>
<p><b>Avoid:</b> "I take criticism well" with no example, or saying "I only accept feedback if it is fair".</p>`,
'M',2,[`Tell me about the hardest feedback you received.`],
`No example. A real story makes the answer believable.`,['hr','feedback']),

I(`Tell me about a time you used data or a check to influence a decision, or to convince someone.`,
`I show a real case where I used numbers to change what was done, even a small one. I describe the problem, the data I used, how I presented it simply, and what changed because of it.`,
`<p><b>Model structure (use a real story, or a project):</b></p>
<p>"<b>S:</b> We had [a recurring problem, for example high drop-off in a survey / many quota failures]. <b>A:</b> I pulled the data on [what] and found that [X% of drop-offs came from one question / one device]. I made one simple chart and showed it to the project manager with a proposal to [change]. <b>R:</b> After the change, [completion rose from A% to B% / failure fell]. It saved about [N hours / N complaints]."</p>
<p><b>If you have no work example,</b> use a personal project: "In my [project], I analysed [dataset], found [insight], and recommended [action]."</p>
<p><b>What the interviewer is testing:</b> do you think like an analyst: observe, quantify, communicate, recommend?</p>
<p><b>Tip:</b> keep the numbers honest and small. A real small win beats an invented big one.</p>`,
'M',2,[`What would you have done if they disagreed with your recommendation?`],
`Describing a task you did rather than a decision you influenced.`,['hr','influence']),

I(`Tell me about a time you had to work with unclear instructions or ambiguity.`,
`I ask clarifying questions, state my assumptions, deliver a small first version, and refine it with feedback. I would rather confirm early than build the wrong thing.`,
`<p><b>Method:</b></p>
<ol><li>Ask: "What decision is this for? Who will use it? What is the deadline? What does a good result look like?"</li>
<li>Write my understanding and assumptions in 3 to 4 lines and send them for confirmation.</li>
<li>Build a quick first version (a draft table or one chart) and show it early.</li>
<li>Refine with feedback. Keep a note of final definitions.</li></ol>
<p><b>Model answer (use a real case):</b> "A client sent a brief that just said 'make the survey shorter'. I asked which questions were essential, what the target length was, and what the drop-off was. With that I proposed [change], and they approved it. Delivery was [on time]."</p>
<p><b>What the interviewer is testing:</b> initiative and communication, because analysts rarely get perfect briefs.</p>`,
'M',2,[`What if nobody is available to answer your questions?`],
`Waiting silently, or guessing and building the wrong thing.`,['hr','ambiguity']),

I(`What makes you different from other candidates, including freshers who have a data degree or strong SQL and Python skills?`,
`I can say honestly that I may know less theory than a fresher with a data degree. But I bring real work habits: two years of client deadlines, working with messy real data, and knowing where data comes from. I add projects to show the tool skills too.`,
`<p><b>Model answer:</b></p>
<p>"Many candidates can write SQL. What I add is real-world data experience: I know how data gets created, where it goes wrong, and how to deliver it under pressure. I have done that with real clients for [2+ years]. I also built [N projects] in SQL, Python and Power BI to show analytic skill. So you get someone who already knows professional work, who can start contributing to data checks and reporting early, and who is still keen to grow on the analysis side."</p>
<p><b>What the interviewer is testing:</b> your self-awareness and how you present your value. Do not run down other candidates.</p>
<p><b>Tip:</b> use 2 differentiators, each with one proof. Do not claim to be the best.</p>`,
'M',2,[`What is your weakest point compared to them?`],
`Comparing yourself to others negatively, or claiming to be "the best".`,['hr','differentiator']),

I(`Your manager gives you a report where the data seems to show a result the client will like, but you notice a data problem that weakens the conclusion. What do you do?`,
`I tell my manager right away, with evidence, and I do not hide or change the data. I explain the impact and suggest ways to fix or caveat the report. Trust in my numbers matters more than a pleasant message.`,
`<p><b>The principle:</b> the analyst's value is that people can trust the numbers. A pleasant but wrong result damages the client, and later you.</p>
<p><b>What I do, step by step:</b></p>
<ol><li><b>Verify</b> the problem first. Be sure, and size it (how many records, effect on the result).</li>
<li><b>Tell my manager promptly and privately,</b> with a short summary: "I found X. It affects Y. Here are options: fix and re-run, add a caveat, or delay."</li>
<li><b>Never quietly change numbers or leave out the problem.</b> If the pressure continues, I ask to document the decision in writing.</li>
<li><b>Offer a way forward:</b> a corrected version, or the original with a clear note on the limitation.</li>
<li><b>If it becomes an ethical issue</b> (asked to misrepresent data), I would raise it with the next level or compliance, politely and with evidence.</li></ol>
<p><b>Sample spoken answer:</b> "I would show my manager the evidence and suggest we either fix it before sending or clearly mark the limitation. I understand the pressure to give good news, but wrong numbers cost more later."</p>
<p><b>What the interviewer is testing:</b> integrity, courage and tact. This is a very common question for analyst roles.</p>`,
'H',2,[`The manager says to send it as it is. Now what?`,`Has this ever happened to you?`],
`Saying "I would do what the manager says", or going over the manager's head without first raising it directly.`,['hr','ethics']),

I(`Our entry-level analyst role pays less than what you earn now as a survey programmer, or has a lower title. Why would you accept it?`,
`I would explain that this is a deliberate move for long-term growth in analytics, not a short-term decision about pay, as long as the offer is fair and I can manage financially. I would also say that I want to see the growth path and the learning.`,
`<p><b>Model answer:</b></p>
<p>"I understand that I am changing career track, so the starting package may not be a big jump or may even be similar. For me the priority is building analytics skills and experience in a good team, because over 2 to 3 years that will matter much more for my growth than a small difference now. Of course, I do need the package to work for me, so I would like to understand the full structure and the review process."</p>
<p><b>Be honest with yourself first:</b> know your minimum number and your monthly commitments (rent, EMI, family). If the offer is below that, say politely that it does not work. Do not accept something you will regret in 3 months and leave.</p>
<p><b>Do not say:</b> "I do not care about money." It is unconvincing and weakens your negotiation.</p>
<p><b>What the interviewer is testing:</b> commitment to the career move, realistic expectations, and whether you will leave in a few months for a better paying role.</p>`,
'H',2,[`What if we cannot match your current salary?`,`Do you have other offers?`],
`Either saying "salary does not matter" or being inflexible about a switch-role hike. Balance both.`,['hr','salary','career-switch']),

I(`Tell me about a time you disagreed with your manager's decision. What did you do?`,
`I raise my concern privately with facts and a suggestion, listen to the reason, and then follow the decision if the manager still prefers it, unless it is unethical. I show professional disagreement without damaging trust.`,
`<p><b>Model answer (use a real case):</b></p>
<p>"My manager decided to [for example send the data to the client without a second QA round because of time]. I was worried about [specific risk]. I spoke to them privately and said, 'I am concerned about X. Could I do a quick 30-minute check on the 3 key questions to reduce the risk?' They agreed / they explained [reason] and decided to go ahead. I [followed the decision and noted the risk in writing / ran the quick check]. The outcome was [result]. I learned [lesson]."</p>
<p><b>Pattern:</b> private, factual, solution-focused, respectful, then commit. If it was unethical, escalate.</p>
<p><b>What the interviewer is testing:</b> can you have a polite spine? They do not want a yes-person or a rebel.</p>`,
'H',2,[`What if your manager was wrong in the end?`],
`Complaining about the manager, or saying you have never disagreed.`,['hr','manager']),

I(`We want someone who will stay. You are moving career tracks. How do we know you will not leave in a year?`,
`I would answer honestly that this is a considered move that I prepared for, that I am looking for growth here, and I will give concrete reasons I would stay: the learning, the type of problems, and the career path. I can point to my track record at my current company as evidence of commitment.`,
`<p><b>Model answer:</b></p>
<p>"This move is not an impulse. I spent [N months] learning and building projects before applying. I am choosing a role where I can grow for several years. At my current company I have stayed [N years] and taken on [more responsibility], which shows I commit to my work. If I join, I want to reach [goal], and this team offers [specific reason]. What would help me stay is clear learning goals and regular feedback, and I would ask for these early."</p>
<p><b>What the interviewer is testing:</b> hiring and training cost money, and they want to know it will not be wasted. They also test sincerity.</p>
<p><b>Avoid:</b> making big promises ("I will stay 10 years"). Give reasons, not promises.</p>`,
'H',1,[`What would make you leave?`],
`Promising to stay forever. Give real reasons instead.`,['hr','commitment']),

I(`You have another offer, or your current company gives a counter-offer. How will you decide?`,
`I would be open that I am considering options but I would compare them on growth, learning, team, and total compensation, not only the highest number. I do not use one offer to pressure another company, and I would make my decision with a clear reason.`,
`<p><b>If another offer exists (honest approach):</b></p>
<p>"I am in process with one or two other companies, and I am at different stages. [Company] is a strong option for me because [specific reason]. I would like to take a decision with full information, so I would appreciate knowing your timeline."</p>
<p><b>How I compare offers:</b></p>
<ol><li><b>Role and learning:</b> what will I work on, with which tools and mentors?</li>
<li><b>Team and manager:</b> who will I learn from?</li>
<li><b>Compensation:</b> fixed vs variable, in-hand, benefits, not only the CTC headline.</li>
<li><b>Stability and growth path.</b></li></ol>
<p><b>On counter-offers:</b> if my current company gives one only when I resign, I would ask why they did not offer growth earlier. I would think carefully, since the reasons I wanted to leave often remain. Whatever I choose, I would treat both companies respectfully. Do not lie about offers you do not have.</p>
<p><b>What the interviewer is testing:</b> honesty, maturity and whether you will accept their offer if they make one.</p>`,
'H',1,[`What would make you choose us?`,`Would you accept a counter-offer?`],
`Bluffing about other offers or turning the conversation into a bidding war.`,['hr','offers'])

];

QA.biz={name:'Business Cases & Metrics',emoji:'🧠',list:byLevel(biz)};
QA.survey={name:'Survey Analytics',emoji:'📋',list:byLevel(survey)};
QA.hr={name:'HR & Behavioural',emoji:'🤝',list:byLevel(hr)};
})();
