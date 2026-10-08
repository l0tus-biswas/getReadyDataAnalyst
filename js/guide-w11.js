GUIDES[11] = {
  intro: `<p>Week 11 is about the <b>manager round</b>. By now you can write SQL and build dashboards. A manager also wants to know: can you think about a business problem, can you explain your work in simple words, and will you be easy to work with?</p>
<p><b>By Day 7 you will be able to:</b> solve a business case with a clear structure, say your HR answers smoothly (no reading from paper), present each project in 2 minutes or 5 minutes, and finish one full mock interview (HR + technical + case). You will also send 10 applications.</p>
<p><b>Time split:</b> Day 1 cases (1.5 h), Day 2 HR scripts (1.5 h), Day 3 project walkthroughs (1.5 h), Day 4 feedback fixes (1.5 h, plus an optional 2 h Tableau block you can move to any free day), Day 5 optional SQL performance (1.5 h), Day 6 mock interview #2 (3.5 h), Day 7 applications (3.5 h).</p>
<p><b>Rule for this week:</b> say answers out loud. Reading an answer in your head is not practice. Record your voice on your phone and listen once.</p>`,
  days: [
    {
      title: 'Business cases: 5 styles, one structure',
      time: '1.5 h',
      study: [
        `A business case question has no single right answer. The interviewer checks your <b>structure</b>: do you clarify first, break the problem into parts, use data, and end with a recommendation?`,
        `Use this frame every time: <b>Clarify, Define the metric, Break down, Prioritise, Recommend, Next steps</b>.`,
        `Metric drop: first check if it is real (tracking bug, seasonality), then split by time, segment, channel, device, product. Find where the drop sits.`,
        `Feature adoption: define a success metric before launch, plus a guardrail metric (something that must not get worse). Compare users who used the feature with a control group, if you can.`,
        `Retention and churn: define "active" and "churned" first. Look at cohorts (users grouped by signup month), not one overall average.`,
        `Campaign ROI: ROI = (incremental profit - cost) / cost. Use <b>incremental</b> results versus a control or holdout group, not total sales.`,
        `KPI questions: pick one North Star metric, then 3 to 5 supporting metrics, and 1 guardrail. Match them to the business model.`,
        `Always say your assumptions out loud. Numbers in the cases below are made-up examples.`
      ],
      how: [
        `[10 min] Write the frame (Clarify, Define, Break down, Prioritise, Recommend, Next steps) on a sticky note. Keep it on your desk all week.`,
        `[10 min] Read Case 1 and Case 2 below. Notice how each answer starts with questions, not with guesses.`,
        `[15 min] Read Cases 3, 4 and 5. Underline the one formula or idea in each.`,
        `[25 min] Pick 3 cases. Cover the sample answer and speak your own answer for 3 minutes each. Use a timer.`,
        `[20 min] Compare with the sample. Write what you missed (a metric, a segment, a guardrail).`,
        `[10 min] Do the first 2 practice questions in this section from a blank page.`
      ],
      example: `<p><b>Case 1: Metric drop (e-commerce).</b> "Orders dropped 15% last week versus the week before. What do you do?"</p>
<p><b>Structure:</b> 1) Confirm the data is right. 2) Find where the drop is. 3) Form hypotheses. 4) Test them. 5) Recommend.</p>
<p><b>Spoken answer:</b> "First I want to confirm the drop is real. I will check if tracking or the data pipeline broke, and whether last week had a holiday or sale in the week before. Then I will split orders by channel (app, web), platform (Android, iOS), city, product category, and new versus returning customers. Usually the drop sits in one slice. Say it sits in Android app orders. Then I check the funnel: sessions, product page views, add to cart, checkout, payment success. If sessions are normal but payment success fell, it could be a payment gateway issue or a new app release bug. If sessions fell, I check marketing spend and traffic sources. My recommendation depends on the finding, for example: roll back the release, or fix the payment failure. I would also set an alert on daily orders by platform so we catch this faster next time."</p>
<p><b>Query to find the slice (PostgreSQL):</b></p>
${pre(`-- orders(order_id, order_date, platform, city, amount)
SELECT platform,
       SUM(CASE WHEN order_date >= DATE '2024-05-13' AND order_date < DATE '2024-05-20' THEN 1 ELSE 0 END) AS this_week,
       SUM(CASE WHEN order_date >= DATE '2024-05-06' AND order_date < DATE '2024-05-13' THEN 1 ELSE 0 END) AS last_week
FROM orders
WHERE order_date >= DATE '2024-05-06' AND order_date < DATE '2024-05-20'
GROUP BY platform;`)}
<p><b>Case 2: Feature adoption (edtech).</b> "We launched a live doubt-solving feature in our learning app. How do you measure success?"</p>
<p><b>Spoken answer:</b> "First, what is the goal of the feature? I assume it is to help students learn better so they stay on the platform. Then my metrics are: <b>Adoption</b> = students who used the feature at least once / active students. <b>Engagement</b> = doubts asked per user per week and repeat usage in 4 weeks. <b>Outcome</b> = course completion rate and test scores of users versus non-users. <b>Guardrails</b> = app crash rate, average doubt response time, and support tickets. Users who choose a feature are usually more motivated, so a simple comparison is biased. If possible I would run an A/B test, or compare similar students (same course, same signup month) with and without the feature. I would report adoption first, and impact after 4 to 6 weeks."</p>
<p><b>Case 3: Retention and churn (fintech).</b> "Monthly active users of our payments app are flat but we keep adding new users. Why?"</p>
<p><b>Spoken answer:</b> "Flat active users with strong new signups means older users are leaving. I would define active: at least one transaction in the month. Then I build cohort retention: of users who joined in January, what percent were active in month 1, 2, 3. I compare cohorts to see if newer cohorts retain worse. I also split by first action (did they complete KYC, did they do a first payment within 7 days), by acquisition channel, and by city. Often the key is an activation event: users who make a first payment in 7 days retain much better. If that is true, the fix is onboarding, for example nudges and a first-payment reward. I would also check churn reasons from support tickets and app reviews."</p>
<p><b>Case 4: Campaign ROI (marketing).</b> "We sent a discount campaign to 2,00,000 users. It cost Rs 5,00,000. Was it worth it?" (example numbers)</p>
<p><b>Spoken answer:</b> "I need incremental results, not total orders, because some users would have bought anyway. Suppose we had a holdout: the campaign group converted at 1.5% and a similar holdout group at 1.0%. The extra 0.5% of 2,00,000 users is 1,000 incremental orders. If margin after discount is Rs 600 per order, incremental profit is Rs 6,00,000. ROI is (6,00,000 - 5,00,000) / 5,00,000 = 20%. So it is positive, but small. I would also check if the discount just pulled forward future orders, whether those customers came back later, and which segment gave the best ROI so we target them next time."</p>
<p><b>Case 5: Which KPIs would you track?</b> "You join a food delivery startup. Which KPIs do you track?"</p>
<p><b>Spoken answer:</b> "I would pick a North Star: <b>completed orders per week</b>, because it captures both demand and supply working. Supporting metrics: new and repeat customers, average order value, delivery time (promised versus actual), order cancellation rate, restaurant acceptance rate, and customer rating. Guardrails: cost per order and refund rate, so we do not grow orders by losing money. For edtech I would use course completion and weekly active learners. For fintech I would use activated users (first transaction in 7 days), monthly transacting users, failed payment rate, and fraud rate."</p>`,
      practice: [
        [`Daily active users on our app dropped 10% today. Give your first 3 steps.`, `<p>1) Check data: is tracking or the pipeline broken, is it a holiday or outage day? 2) Split by platform, app version, city, channel to find the slice. 3) Check the funnel and recent changes (release, campaign ended, server issue).</p><p>Explanation: confirm real, locate, then explain. Never jump to a cause.</p>`],
        [`What is the difference between a success metric and a guardrail metric?`, `<p>The success metric is what you want to improve (for example, checkout conversion). The guardrail is what must not get worse while you improve it (for example, refund rate or page load time).</p>`],
        [`Write a query: weekly retention for users who signed up in a given week and were active again the next week. Tables: users(user_id, signup_date), activity(user_id, activity_date).`, `${pre(`SELECT COUNT(DISTINCT u.user_id) AS cohort_size,
       COUNT(DISTINCT a.user_id) AS retained_next_week
FROM users u
LEFT JOIN activity a
  ON a.user_id = u.user_id
 AND a.activity_date >= u.signup_date + 7
 AND a.activity_date <  u.signup_date + 14
WHERE u.signup_date >= DATE '2024-05-06'
  AND u.signup_date <  DATE '2024-05-13';`)}<p>Explanation: for each user we look for activity in days 7 to 13 after signup. Retention = retained_next_week / cohort_size. In PostgreSQL, date + integer adds days.</p>`],
        [`A campaign cost Rs 2,00,000. Treated users bought 3,000 orders. A holdout of the same size bought 2,200 orders. Margin is Rs 400 per order. Compute ROI.`, `<p>Incremental orders = 3,000 - 2,200 = 800. Incremental profit = 800 x 400 = Rs 3,20,000. ROI = (3,20,000 - 2,00,000) / 2,00,000 = 60%.</p><p>Explanation: only the extra orders count; use the holdout as the baseline.</p>`],
        [`Our average order value rose 8% but total revenue is flat. What could be going on?`, `<p>Orders (volume) must have fallen about 7%. Check: did we cut discounts or raise prices (fewer low-value orders), did a segment of small orders disappear, did traffic or conversion fall? Revenue = orders x AOV, so always look at both parts.</p>`],
        [`Which KPIs would you track for an online learning platform?`, `<p>North Star: weekly active learners completing lessons. Supporting: signup to first-lesson rate, course completion rate, repeat purchase, test scores. Guardrails: refund rate, support tickets, video buffering errors.</p>`]
      ],
      important: [
        [`Walk me through how you would investigate a sudden drop in a key metric.`, `<p>"I start by checking the data for bugs and seasonality. Then I break the metric by time, platform, channel, geography and product to find where the drop sits. I follow the funnel to find the step that changed and list recent events like releases or campaigns. I confirm the cause with data, then recommend a fix and add monitoring."</p>`],
        [`How do you decide the success metric for a new feature?`, `<p>"I ask what the feature should change for the user and for the business. I choose one primary metric tied to that, a few supporting metrics, and a guardrail. I define it before launch and compare with a control group where possible."</p>`],
        [`Why use incremental results for campaign ROI?`, `<p>"Some customers would have bought without the campaign. Total sales overstate the effect. A holdout group shows the baseline, so the difference is the real impact."</p>`]
      ],
      resources: [],
      done: `You are done when you can solve any one of the 5 cases out loud in 3 minutes using the frame, without looking at the sample answer.`
    },
    {
      title: 'HR answers: script and rehearse',
      time: '1.5 h',
      study: [
        `HR answers should be 60 to 90 seconds. Short and clear beats long and perfect.`,
        `Use <b>Present, Past, Future</b> for "Tell me about yourself": what you do now, how you got here, what you want next.`,
        `Use <b>STAR</b> for behavioural questions: Situation, Task, Action, Result. Spend most of the time on Action and Result.`,
        `Only use true stories from your work. Write numbers as placeholders (X, N) and fill them with your real numbers. Never invent achievements. If you do not know the exact figure, say "about" or "roughly".`,
        `For "why switch", talk about what you are moving <b>towards</b> (insights, decisions), not what you are running away from.`,
        `A good weakness is real, not a disguised strength, and shows what you are doing to fix it.`,
        `For salary, do research first (Glassdoor, AmbitionBox), give a range, and keep it flexible. See Week 12 for the full negotiation script.`
      ],
      how: [
        `[15 min] Read the model answers below. Replace X and N with your real numbers in a notes file.`,
        `[20 min] Write your own "Tell me about yourself" in 150 to 200 words. Cut every long sentence in half.`,
        `[10 min] Choose 4 true stories from your last 2 years: a tight deadline, a data error you caught, something you taught yourself, a disagreement with a client or teammate.`,
        `[20 min] Write each story in STAR form with 4 lines. Add your real numbers.`,
        `[20 min] Say each answer aloud with a timer. Record on your phone. Listen once. Remove filler words ("basically", "actually").`,
        `[5 min] Save the final scripts in one file called hr-answers.txt. You will use it in Day 6's mock.`
      ],
      example: `<p><b>Tell me about yourself (about 75 seconds).</b></p>
<p>"I am a survey programmer with over 2 years of experience. I build questionnaires with skip logic and quotas, and I run data checks so clients get clean respondent data on time. In that work I started to enjoy the data itself, so over the last few months I trained myself in SQL, Python and Power BI. I built [N] projects: an e-commerce analysis on SQL and Power BI, a survey insights dashboard, and a [marketing or edtech] analysis in Python. For example, in the e-commerce project I found [insight with X]. Now I want a Data Analyst role where I can use my data quality skills and survey background and grow into answering business questions with data."</p>
<p><b>Why are you switching?</b> "In survey programming I build the way data is collected. I enjoy that, but the part I like most is when the data comes in and we find a pattern. I want to be the person who turns data into decisions. I did not just decide this; I invested several months in skills and projects to prepare."</p>
<p><b>You have no analyst experience. Why hire you?</b> "I have two years of working with respondent-level data: logic, quality checks, quotas and client deadlines. Those are analyst habits. On top of that I have hands-on SQL, Python and Power BI projects. I can show you my GitHub. I learn fast: [one specific example with a number]. I would need a short ramp-up on your business, and I am ready for that."</p>
<p><b>Important:</b> the STAR stories below are TEMPLATES showing the shape of a good answer. Replace each one with something that really happened to you, and delete any sentence that is not true.</p>
<p><b>STAR 1: Tight deadline.</b> <i>Situation:</i> A client survey of N respondents had to go live in [X] days, and the questionnaire changed late. <i>Task:</i> I had to reprogram and test everything without missing the date. <i>Action:</i> I listed all changes, programmed the high-risk logic first, and tested with a checklist of paths. I told the project manager early which items were risky. <i>Result:</i> We launched on time with [X] issues found in the first day. [Add the real feedback from the client or manager if you have it; if not, leave it out.]</p>
<p><b>STAR 2: Data error caught.</b> <i>Situation:</i> While checking the first data export, I saw [X]% of respondents with an impossible answer pattern (for example, wrong skip logic). <i>Task:</i> Find the cause and protect the client's data. <i>Action:</i> I traced the question routing, found a condition that was wrong, fixed it, and flagged the affected N respondents. <i>Result:</i> [The real outcome, for example the client received corrected data before analysis.] [If true: I added that check to my standard QA list.]</p>
<p><b>STAR 3: Self-learning.</b> <i>Situation:</i> My job did not need SQL, but I wanted an analyst role. <i>Task:</i> Learn SQL, Python and Power BI while working full time. <i>Action:</i> I planned 1.5 hours each weekday and 3.5 hours on weekends, practised problems daily and built [N] projects. <i>Result:</i> I can now write joins, CTEs and window functions, and I published my projects on GitHub.</p>
<p><b>STAR 4: Disagreement.</b> <i>Situation:</i> A client wanted a change that would break the logic or quota balance. <i>Task:</i> Protect data quality without being difficult. <i>Action:</i> I showed with a small example what the change would do to the data and offered two options. <i>Result:</i> [The real outcome, for example which option the client chose and whether the deadline was met.]</p>
<p><b>Strengths:</b> "Attention to detail and data validation from my QA work, and learning fast. Evidence: [one example]." <b>Weakness (example):</b> "I used to spend too long polishing before sharing. Now I set a time limit, share a first version early, and improve based on feedback." Over-polishing is a very common answer, so use it only if it is genuinely yours; otherwise pick a real one (for example, hesitating to ask clarifying questions early) and describe what you now do about it.</p>
<p><b>Salary expectation:</b> "I am more focused on the role and learning right now. Based on my research on sites like AmbitionBox and Glassdoor for entry-level analyst roles in [city], I am looking at around [your researched range, for example X to Y LPA]. I am flexible depending on the role and the full package. May I ask what range you have budgeted?" (Fill in a range you have researched yourself; do not quote a number you cannot back up.)</p>`,
      practice: [
        [`Rewrite this weak answer: "I am hardworking and I want a good company to grow."`, `<p>Better: "I have two years of survey programming where I validated data and met client deadlines. I now want to use SQL, Python and Power BI to answer business questions, and I am looking for a data analyst role to do that."</p><p>Explanation: it shows evidence and a clear direction instead of general words.</p>`],
        [`Give a STAR answer for "Tell me about a mistake you made."`, `<p><i>S (example only, use your own real mistake):</i> In one project I missed a quota check before launch. <i>T:</i> Fix it quickly and keep client trust. <i>A:</i> I told my manager the same day, paused the link, corrected the quota rule, and checked the N completes affected. <i>R:</i> Only [X] respondents were affected and we replaced them. I now run a pre-launch checklist that includes quotas.</p><p>Explanation: honest, shows ownership, ends with a fix. Use your own real mistake.</p>`],
        [`The interviewer asks, "Where do you see yourself in 5 years?" Answer in 3 sentences.`, `<p>"In 5 years I want to be a strong analyst who owns analysis end to end and maybe leads small projects. I want to deepen my skills in SQL, statistics and storytelling with data. I am looking for a place where I can learn from experienced people and take on more responsibility over time."</p>`],
        [`How do you answer "Why should we hire you over someone with 2 years of analyst experience?"`, `<p>"I will not claim more experience than I have. What I bring is strong data quality habits, domain knowledge about how survey data is created, and proof of skills through projects. I learn quickly and I am motivated. I would be glad to do a small test task to show this."</p>`],
        [`What should you do if you do not know a number for your STAR result?`, `<p>Use a safe estimate ("about 20 to 30 percent faster") and say it is approximate, or describe the result without a number ("the client accepted the data without a second round of fixes"). Never make up exact figures.</p>`]
      ],
      important: [
        [`Tell me about yourself.`, `<p>Present: survey programmer, 2+ years, logic and data QA. Past: how I moved towards data and learned SQL, Python and Power BI. Future: I want a data analyst role. Keep it under 90 seconds and end with a project result.</p>`],
        [`Why do you want to move from survey programming to analytics?`, `<p>"I like data work and I want to move from collecting data to using it for decisions. I prepared with months of learning and real projects, so this is a planned move."</p>`],
        [`What is your biggest weakness?`, `<p>"I used to over-polish my work before sharing. I now time-box tasks, share a first version early, and improve with feedback. It has made me faster."</p>`]
      ],
      resources: [],
      done: `You are done when you can say "Tell me about yourself", "Why switch", and 3 STAR stories from memory, each within 90 seconds, with your real numbers filled in.`
    },
    {
      title: 'Project walkthroughs: 2 min and 5 min',
      time: '1.5 h',
      study: [
        `Most manager rounds start with "Walk me through a project." Your answer shows how you think, so structure matters more than detail.`,
        `The <b>2-minute version</b> has 6 parts: Problem, Data, Approach, Key insights, Recommendation or impact, Tools and what you learned.`,
        `The <b>5-minute deep dive</b> adds: data cleaning decisions, data model, one tricky SQL or DAX part, a challenge you solved, limitations, and what you would do next.`,
        `Start with the business question, not the tools. "I wanted to know why repeat customers are low" is better than "I used Power BI and SQL".`,
        `Give at least 2 numbers and 1 recommendation per project. Use your real figures (X, N here).`,
        `Be ready for follow-ups: why this chart, why this join, what if data is missing, how do you know it is correct.`,
        `Know your limits. Saying "this data has no cost column, so I could not calculate profit" shows maturity.`
      ],
      how: [
        `[10 min] Read the model 2-minute answer below.`,
        `[25 min] Write the 2-minute script for Project 1 (survey) using the 6 parts. About 250 to 300 words.`,
        `[15 min] Write Project 2 (e-commerce) and Project 3 (martech or edtech) scripts in the same way.`,
        `[25 min] Say all three aloud with a timer. Each must be 1 min 45 s to 2 min 15 s.`,
        `[10 min] Add a deep-dive page for each project: data model sketch, one SQL or pandas snippet you can explain line by line, 2 challenges, 2 limitations.`,
        `[5 min] Put your project URLs and the one-line bullet from each README in your notes.`
      ],
      example: `<p><b>Model 2-minute walkthrough (e-commerce project, numbers are placeholders):</b></p>
<p>"<b>Problem:</b> An online marketplace wanted to understand why many customers buy only once. <b>Data:</b> I used the Olist e-commerce dataset: about [N] orders across tables for orders, customers, payments, items and reviews. <b>Approach:</b> I loaded it into PostgreSQL, cleaned duplicates and nulls, and used SQL with CTEs and window functions to build monthly revenue, repeat-customer rate and cohort retention. Then I built a star schema in Power BI with DAX measures for revenue, orders and repeat rate. <b>Insights:</b> Only [X]% of customers ordered a second time. Orders delivered later than promised had an average review score [X] points lower. [Only add a claim about low-review customers not returning if you actually measured it.] Revenue was concentrated in [X] categories. <b>Recommendation:</b> Improve delivery estimates in the slowest regions and target a follow-up offer to customers within [X] days of a good first delivery. <b>Learning:</b> The hardest part was cohort retention in SQL, and I learned to check my results against a simple manual count."</p>
<p><b>Deep-dive checklist (5 minutes):</b></p>
<ul>
<li><b>Data model:</b> one fact table (order items) and dimension tables (customer, product, date). One sentence on why star schema.</li>
<li><b>Tricky part:</b> for example, how you counted repeat customers with COUNT(DISTINCT order_id) per customer_unique_id and filtered HAVING COUNT(DISTINCT order_id) &gt; 1 (COUNT(*) would count item rows, not orders).</li>
<li><b>Challenge:</b> for example, a one-to-many join (an order with several payment rows) duplicating revenue, solved by aggregating to one row per order before the join.</li>
<li><b>Limitation:</b> no cost data, one-time snapshot, correlation is not proof of cause.</li>
<li><b>Next step:</b> test an A/B on delivery messaging, add a churn model.</li>
</ul>
<p>A snippet you may be asked to explain (customer_orders here stands for orders joined to customers, so each row has customer_unique_id and order_id):</p>
${pre(`-- customers who ordered more than once
SELECT customer_unique_id, COUNT(DISTINCT order_id) AS orders
FROM customer_orders
GROUP BY customer_unique_id
HAVING COUNT(DISTINCT order_id) > 1;`)}`,
      practice: [
        [`Write the first 3 sentences of your survey dashboard project walkthrough using Problem, Data, Approach.`, `<p>Example: "A research team wanted to know which customer groups are least satisfied and what drives their score. I used [dataset] with [N] survey responses and [X] questions. I cleaned missing values and recoded rating scales, then calculated CSAT, NPS and top-2-box by segment."</p><p>Explanation: question first, then data, then method.</p>`],
        [`The interviewer says "Why did you choose a bar chart there?" What do you say?`, `<p>"I am comparing a measure across categories, and bars let the eye compare lengths exactly. I sorted them so the biggest gap is clear. A pie chart would make small differences hard to see."</p>`],
        [`"How do you know your numbers are correct?" Give 3 checks.`, `<p>1) Reconcile totals against the source (row counts, total revenue). 2) Check a few records by hand. 3) Test edge cases such as nulls, duplicates and date boundaries. Also compare SQL and dashboard results.</p>`],
        [`What do you say if you do not remember a detail of your own project?`, `<p>Say what you do remember, then reason: "I do not recall the exact number. I believe it was around X. I can check my repo and send it." Do not guess confidently. Keep a one-page cheat note of key numbers.</p>`],
        [`Give two honest limitations of a Kaggle-data project and say how you would fix them in real work.`, `<p>1) The data is clean and static, unlike company data. In real work I would validate with the data owner and use refreshes. 2) No business context or cost data. In real work I would ask stakeholders for their goals and costs. Honest limits show maturity.</p>`]
      ],
      important: [
        [`Walk me through a project you are proud of.`, `<p>Use the 2-minute structure: business problem, data, approach, 2 key insights with numbers, recommendation, and one learning. Stop after about 2 minutes and say "I can go deeper into the data model or the SQL if you like."</p>`],
        [`What was the hardest part of your project and how did you solve it?`, `<p>Pick one real technical problem (for example, duplicated revenue after a join). Say how you found it (totals did not match), what you changed (aggregate first, then join), and how you checked it.</p>`],
        [`What would you do differently if you did this project again?`, `<p>"I would define the business questions with a stakeholder first, document assumptions earlier, add a data quality check step, and test one recommendation with an experiment."</p>`]
      ],
      resources: [],
      done: `You are done when you can present each of your 3 projects in 2 minutes without notes, and extend any one to 5 minutes.`
    },
    {
      title: 'Feedback review + optional Tableau Public',
      time: '1.5 h',
      study: [
        `A mock interview only helps if you turn the feedback into a fix list. Sort every mistake into a category: <b>Concept</b>, <b>SQL or code</b>, <b>Communication</b>, <b>Case structure</b>.`,
        `Fix by priority: first mistakes that repeat, then mistakes in must-know topics (joins, GROUP BY, window functions, DAX basics, statistics basics).`,
        `For each weak topic: re-learn (15 min), solve 3 fresh problems (30 min), explain it aloud (5 min).`,
        `Optional: Tableau Public is a free tool for building and publishing dashboards. Many job posts list "Power BI or Tableau". You do not need to master it, just show you can learn it.`,
        `Optional: Tableau terms. <b>Dimension</b> = a category (blue pill, like Region). <b>Measure</b> = a number (green pill, like Sales). <b>Sheet</b> = one chart. <b>Dashboard</b> = a page that holds several sheets.`,
        `Optional: A <b>calculated field</b> is a new column you define with a formula, similar to a DAX measure or an Excel formula.`
      ],
      how: [
        `[10 min] Collect all feedback: Mock #1 notes, take-home feedback, and any wrong answers in your Q&A tracker. Put them in one table: Topic, What went wrong, Category, Fix.`,
        `[10 min] Mark the top 3 repeating problems. Write a one-line fix for each (for example, "Always say the join type and why").`,
        `[40 min] Fix them: for each, re-read the topic, then solve 3 new practice problems from SQL practice sites in the Resources page, and explain your solution aloud.`,
        `[15 min] Retest: ask a friend or an AI to ask 5 questions on your weak topics. Score yourself out of 5.`,
        `[15 min] Update your tracker and write your focus list for the Day 6 mock.`,
        `Optional [2 h, move to a free evening or a spare day]: do the Tableau Public build below.`
      ],
      example: `<p><b>Feedback tracker (copy this table):</b></p>
${pre(`Topic            | What went wrong                  | Category      | Fix                          | Retest score
Window functions | Used RANK, needed ROW_NUMBER      | SQL           | Write 3 examples of each      | 4/5
Case answer      | Jumped to answer without clarify  | Case structure| Use the 6-step frame          | 3/5
Speed            | Spoke 4 min for 2-min question    | Communication | Timer + shorter sentences     | 4/5`)}
<p><b>Optional: Tableau Public dashboard in 2 hours (real UI flow).</b></p>
<ol>
<li>Go to public.tableau.com and download the free Tableau Public app (or use the web authoring). Sign in or create a free account.</li>
<li><b>Connect:</b> open the app, on the Connect pane choose <b>Microsoft Excel</b> or <b>Text file</b> and select a file, for example orders.csv from your e-commerce project (columns: order_date, category, region, sales, profit).</li>
<li>On the Data Source page check the data types (date, text, number). Click <b>Sheet 1</b> at the bottom.</li>
<li><b>Build chart 1:</b> drag <b>Order Date</b> (dimension) to Columns and right-click it to choose Month. Drag <b>Sales</b> (measure) to Rows. You get a line chart of monthly sales.</li>
<li><b>Build chart 2:</b> new sheet. Drag <b>Category</b> to Rows and <b>Sales</b> to Columns. Use the sort button in the toolbar to sort descending. Drag <b>Region</b> to Color.</li>
<li><b>Calculated field:</b> menu <b>Analysis &gt; Create Calculated Field</b>. Name it Profit Ratio and type <code>SUM([Profit]) / SUM([Sales])</code>. Click OK, then use it in a third sheet, for example a bar by Category.</li>
<li><b>Dashboard:</b> click the <b>New Dashboard</b> icon at the bottom. Set Size to Automatic. Drag your 3 sheets in. Turn on <b>Use as Filter</b> (funnel icon on a sheet) so clicking a bar filters the others. Add a title and a text box with 2 key insights.</li>
<li><b>Publish:</b> menu <b>File &gt; Save to Tableau Public</b>. Sign in, give the workbook a name, and it opens in your browser. Copy the link into your README and LinkedIn Featured section.</li>
</ol>
<p>Note: the Tableau Public app saves only to the public cloud, so never use private company data in it.</p>`,
      practice: [
        [`Your top 3 weak topics from the mock are joins, window functions and case structure. How do you plan 90 minutes?`, `<p>30 min joins (explain INNER vs LEFT and do 3 problems), 30 min window functions (ROW_NUMBER, RANK, LAG, SUM OVER: 3 problems), 25 min case (solve one case with the 6-step frame aloud), 5 min update tracker.</p><p>Explanation: time follows weakness, and each block ends with practice.</p>`],
        [`In Tableau, what is the difference between a dimension and a measure?`, `<p>A dimension is a category used to split data (Region, Product). A measure is a numeric value that is aggregated (Sales, Profit). Dimensions create groups; measures are summed or averaged inside them.</p>`],
        [`Write a Tableau calculated field for profit margin and for "High Sales" flag above 10,000.`, `${pre(`Profit Margin:  SUM([Profit]) / SUM([Sales])

High Sales:     IF SUM([Sales]) > 10000 THEN "High" ELSE "Normal" END`)}<p>Explanation: aggregate with SUM first, then divide. The IF needs END at the end.</p>`],
        [`What is the equivalent of a Tableau dashboard filter action in Power BI?`, `<p>Cross-filtering and cross-highlighting between visuals (clicking a bar filters other visuals). You can adjust it under Edit interactions.</p>`],
        [`Name 3 mistakes that make a dashboard hard to read.`, `<p>Too many charts or colours, no clear title or insight, and wrong chart type (for example, a pie with 12 slices). Other ones: unsorted bars, missing units, and no filters for the main questions.</p>`]
      ],
      important: [
        [`Have you used Tableau? How is it different from Power BI?`, `<p>"I have used Power BI in depth and I built one dashboard in Tableau Public (say this only if you really did the optional build; otherwise say you have not used Tableau yet but the concepts are the same and you can learn it quickly). Both connect to data, build visuals and publish. Power BI has DAX and tight Microsoft integration and a lower price. Tableau is known for flexible visual exploration. The concepts (dimensions, measures, filters) transfer, so I can pick up either quickly."</p>`],
        [`How do you act on interview feedback?`, `<p>"I write each point into a tracker with a category, make a fix plan for repeated issues first, practise with new problems, and test myself again. After Mock #1 I improved [specific item]."</p>`]
      ],
      resources: [['Tableau Public','https://public.tableau.com'],['Kaggle Datasets','https://www.kaggle.com/datasets']],
      done: `You are done when your feedback tracker lists your top 3 weak topics with a retest score of at least 4/5 on each. (Optional: you also have a published Tableau Public dashboard link.)`
    },
    {
      title: 'Optional: SQL performance and window frames',
      time: '1.5 h',
      study: [
        `Optional: An <b>index</b> is a sorted structure on a column (like a book index) that lets the database find rows without reading the whole table. The common type is B-tree.`,
        `Optional: Indexes speed up reads (WHERE, JOIN, ORDER BY) but slow down writes (INSERT, UPDATE) and use storage. Do not index everything.`,
        `Optional: <code>EXPLAIN</code> shows the plan the database will use. In PostgreSQL, <code>EXPLAIN ANALYZE</code> also runs the query and shows real times. Read: <b>Seq Scan</b> (reads the whole table), <b>Index Scan</b>, <b>Index Only Scan</b>, <b>Bitmap Heap Scan</b>, and join types <b>Nested Loop</b>, <b>Hash Join</b>, <b>Merge Join</b>.`,
        `Optional: A Seq Scan is not always bad. For a small table or when you need most rows, it is the fastest choice.`,
        `Optional: A <b>sargable</b> condition lets the database use an index. Wrapping the column in a function (<code>WHERE DATE(order_ts) = ...</code>) usually stops index use. Compare the raw column with a range instead.`,
        `Optional: Avoid <code>SELECT *</code>: it reads and sends more columns than needed and blocks Index Only Scans. Filter early, and do not use <code>LIKE '%text'</code> (a leading wildcard cannot use a normal B-tree).`,
        `Optional: Join order is chosen by the query planner using table statistics. You usually do not control it. You help by having indexes on join keys, filtering before joining, and keeping statistics fresh (<code>ANALYZE</code>).`,
        `Advanced (skip if short on time): window frames. <b>ROWS</b> counts physical rows. <b>RANGE</b> groups rows with the same ORDER BY value (ties) together. The default frame when you use ORDER BY is <code>RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code>.`
      ],
      how: [
        `[10 min] Optional: read the study points on indexes and EXPLAIN. Draw a small picture of a B-tree if it helps.`,
        `[20 min] Optional: in PostgreSQL (or DB Fiddle) create the orders table below, insert generated rows, run EXPLAIN before and after creating the index.`,
        `[10 min] Optional: rewrite the 3 non-sargable queries in the examples.`,
        `[25 min] Advanced: create the sales table below and run the ROWS versus RANGE query. Check you can predict each output value before you run it.`,
        `[15 min] Advanced: try the moving average and the LAST_VALUE trap.`,
        `[10 min] Write 5 sentences you can say about performance in an interview, using the model answers below.`
      ],
      example: `<p><b>Optional: indexes and EXPLAIN (PostgreSQL).</b></p>
${pre(`CREATE TABLE orders (
  order_id    SERIAL PRIMARY KEY,
  customer_id INT,
  order_date  DATE,
  amount      NUMERIC(10,2)
);

INSERT INTO orders (customer_id, order_date, amount)
SELECT (random()*10000)::int,
       DATE '2024-01-01' + (random()*364)::int,
       (random()*5000)::numeric(10,2)
FROM generate_series(1, 200000);

ANALYZE orders;

EXPLAIN ANALYZE
SELECT * FROM orders WHERE customer_id = 4242;
-- likely: Seq Scan on orders (reads all rows, filters)

CREATE INDEX idx_orders_customer ON orders (customer_id);
ANALYZE orders;

EXPLAIN ANALYZE
SELECT order_id, amount FROM orders WHERE customer_id = 4242;
-- likely: Bitmap Heap Scan / Index Scan using idx_orders_customer`)}
<p>What to read in the output: the node name (Seq Scan or Index Scan), <code>rows=</code> (estimated rows), <code>actual time=</code> and "Execution Time" at the end. Big differences between estimated and actual rows mean old statistics. Note: EXPLAIN ANALYZE really runs the query, so for INSERT, UPDATE or DELETE wrap it in <code>BEGIN; ... ROLLBACK;</code>.</p>
<p><b>Sargable versus non-sargable:</b></p>
${pre(`-- Bad: function on the column, index on order_date cannot be used
SELECT * FROM orders WHERE EXTRACT(YEAR FROM order_date) = 2024;
-- Good: range on the raw column
SELECT order_id, amount FROM orders
WHERE order_date >= DATE '2024-01-01' AND order_date < DATE '2025-01-01';

-- Bad: arithmetic on the column
SELECT order_id FROM orders WHERE amount + 100 > 1000;
-- Good
SELECT order_id FROM orders WHERE amount > 900;

-- Bad: leading wildcard
SELECT * FROM customers WHERE name LIKE '%kumar';
-- Better: prefix search can use a B-tree (depending on collation setup)
SELECT customer_id FROM customers WHERE name LIKE 'kumar%';`)}
<p><b>Advanced: ROWS versus RANGE.</b></p>
${pre(`CREATE TABLE sales (day DATE, amt INT);
INSERT INTO sales VALUES
 ('2024-01-01', 10),
 ('2024-01-02', 20),
 ('2024-01-02', 30),   -- tie on the same day
 ('2024-01-03', 40);

SELECT day, amt,
  SUM(amt) OVER (ORDER BY day ROWS  BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS rows_sum,
  SUM(amt) OVER (ORDER BY day RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS range_sum
FROM sales;`)}
<p>Result: rows_sum = 10, 30, 60, 100 (if the 20 row happens to come before the 30 row; the other way round the two tied rows show 40 and 60). range_sum = 10, 60, 60, 100 every time. With RANGE, both rows on 2024-01-02 are "peers" (same ORDER BY value), so each sees both of them. With ROWS, each row only sees rows up to itself, and the order of tied rows is not guaranteed.</p>
<p><b>3-row moving average:</b></p>
${pre(`SELECT day, amt,
  AVG(amt) OVER (ORDER BY day ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS ma3
FROM sales;`)}
<p><b>LAST_VALUE trap:</b> with the default frame, LAST_VALUE returns the current row's value (or its peers'), not the last in the partition. Fix it by setting the frame:</p>
${pre(`SELECT day, amt,
  LAST_VALUE(amt) OVER (ORDER BY day
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_amt
FROM sales;`)}`,
      practice: [
        [`Optional: Why does a query with <code>WHERE EXTRACT(YEAR FROM order_date) = 2024</code> not use an index on order_date?`, `<p>The index is built on the raw order_date values, not on the year extracted from them. The database has to compute the function for every row. Rewrite as a range: <code>order_date &gt;= '2024-01-01' AND order_date &lt; '2025-01-01'</code>. (An expression index on the year is also possible.)</p>`],
        [`Optional: What does "Seq Scan" in EXPLAIN mean, and is it always bad?`, `<p>It reads the whole table row by row. It is fine for small tables or when the query needs a large share of the rows. It is a problem on big tables when only a few rows are needed and no index exists.</p>`],
        [`Optional: Rewrite to be faster: <code>SELECT * FROM orders WHERE customer_id = 4242 ORDER BY order_date DESC LIMIT 5;</code> Which index helps?`, `${pre(`SELECT order_id, order_date, amount
FROM orders
WHERE customer_id = 4242
ORDER BY order_date DESC
LIMIT 5;

CREATE INDEX idx_orders_cust_date ON orders (customer_id, order_date DESC);`)}<p>Explanation: select only needed columns, and a composite index (filter column first, then sort column) lets the database read the latest 5 rows already in order.</p>`],
        [`Advanced: Predict the output of <code>SUM(amt) OVER (ORDER BY day RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)</code> for amounts 5, 5, 10 where the first two rows have the same day and the third a later day.`, `<p>10, 10, 20. The first two rows are peers on the same day so both show 5+5 = 10. The third row adds 10 for 20.</p>`],
        [`Advanced: Write a query for a running total by day per customer that treats rows with the same date separately (no tie merge).`, `${pre(`SELECT customer_id, order_date, amount,
  SUM(amount) OVER (
    PARTITION BY customer_id
    ORDER BY order_date, order_id
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
FROM orders;`)}<p>Explanation: ROWS plus a unique tiebreaker (order_id) gives a stable row-by-row running total.</p>`]
      ],
      important: [
        [`How do you make a slow SQL query faster?`, `<p>"First I run EXPLAIN ANALYZE to see where time goes. Then I check for full scans on large tables, add or fix indexes on filter and join columns, select only needed columns, make predicates sargable, filter before joining, and avoid unnecessary DISTINCT or sorting. I measure again after each change."</p>`],
        [`What is an index and what is its downside?`, `<p>"An index is a sorted structure that helps the database find rows quickly. The downside is slower inserts and updates and extra storage, so I index columns used often in WHERE and JOIN, not every column."</p>`],
        [`What is the difference between ROWS and RANGE in a window frame?`, `<p>"ROWS counts physical rows around the current row. RANGE uses the ORDER BY value, so rows with equal values (ties) are treated together. That is why a running total with default RANGE shows the same value for tied rows."</p>`]
      ],
      resources: [['Window Functions practice','https://www.windowfunctions.com'],['DB Fiddle (run SQL online)','https://www.db-fiddle.com']],
      done: `You are done when you can explain what an index does, read a simple EXPLAIN output (Seq Scan versus Index Scan), and (if you did the advanced part) say why ROWS and RANGE can give different running totals.`
    },
    {
      title: 'Mock interview #2: full loop',
      time: '3.5 h',
      study: [
        `A full loop has 3 parts like a real hiring process: <b>HR round</b> (about you, motivation, salary), <b>technical round</b> (SQL, Power BI/DAX, Python, stats), and <b>case or manager round</b> (project and business thinking).`,
        `Treat it as real: camera on, formal dress at least on top, no notes except a blank page and a pen.`,
        `Score yourself with the same sheet every time so you can see progress from Mock #1 to #3.`,
        `Use an honest partner: a friend working in IT, or an AI chat that you ask to act as a strict interviewer and to give a score after each part.`,
        `Do not stop to fix mistakes during the mock. Note them and move on, just like a real interview.`,
        `After the mock, spend 30 minutes on the scoring sheet and a fix list. That is where the learning happens.`
      ],
      how: [
        `[10 min] Set up: quiet room, water, blank page, timer, recording on (screen and voice). Give your partner the question list below.`,
        `[30 min] Part 1 HR: Tell me about yourself, why switch, no-experience objection, 1 STAR question, strengths and weaknesses, salary expectation, "any questions for us?".`,
        `[60 min] Part 2 Technical: 4 SQL questions (join, GROUP BY with HAVING, window function, CTE), 3 DAX or Power BI questions, 2 pandas questions, 3 statistics questions. Type the SQL in a real editor.`,
        `[30 min] Part 3 Case and project: one business case (any of Day 1's 5 styles, new numbers) and one project walkthrough with 2 follow-ups.`,
        `[10 min] Break. Drink water. Do not look at notes.`,
        `[45 min] Review: listen to the recording, fill the scoring sheet, write a fix list with the top 5 gaps.`,
        `[25 min] Start fixing the first gap, then schedule the others across Day 7 and next week.`
      ],
      example: `<p><b>Question bank for your partner (pick a mix from each part):</b></p>
<ul>
<li><b>HR:</b> Tell me about yourself. Why data analytics? Why should we hire you without analyst experience? Tell me about a deadline you nearly missed (STAR). A weakness. Your salary expectation. Your notice period and joining time.</li>
<li><b>SQL (type it):</b> 1) Top 3 products by revenue per category. 2) Customers with more than 2 orders and total above X. 3) Month-over-month revenue change using LAG. 4) Customers who never ordered (LEFT JOIN and IS NULL).</li>
<li><b>Power BI:</b> What is the difference between a calculated column and a measure? What is a star schema? What does CALCULATE do? How do you handle slow reports?</li>
<li><b>Python:</b> Group by and aggregate in pandas. How do you handle missing values? Merge two DataFrames.</li>
<li><b>Statistics:</b> Mean versus median. What is a p-value? What is correlation versus causation?</li>
<li><b>Case:</b> "Daily signups fell 12% this week. What do you do?" Then "Which KPIs for an edtech app?"</li>
<li><b>Project:</b> 2-minute walkthrough, then "why this model?" and "what would you do next?".</li>
</ul>
<p><b>Scoring sheet (score each 1 to 5, 5 is best):</b></p>
${pre(`Part / Skill                          | Score (1-5) | Notes
HR: clarity and 90-second limit        |             |
HR: STAR story with a result           |             |
Technical: SQL correctness             |             |
Technical: SQL explained while typing  |             |
Technical: Power BI / DAX concepts     |             |
Technical: Python and statistics       |             |
Case: asked clarifying questions       |             |
Case: structure and recommendation     |             |
Project: 2-minute structure            |             |
Communication: pace, filler words      |             |
Confidence: eye contact, calm voice    |             |
TOTAL (max 55)                         |             |
Top 5 gaps to fix:  1.  2.  3.  4.  5.`)}
<p>Reading the total: 44 to 55 means interview-ready, 33 to 43 means good, keep polishing the lowest scores, below 33 means focus your next week on the top 3 gaps and repeat a shorter mock (45 minutes) before Mock #3.</p>`,
      practice: [
        [`SQL warm-up: top 3 products by revenue in each category. Tables: products(product_id, category), order_items(product_id, quantity, price).`, `${pre(`SELECT category, product_id, revenue
FROM (
  SELECT p.category, p.product_id,
         SUM(oi.quantity * oi.price) AS revenue,
         ROW_NUMBER() OVER (PARTITION BY p.category
                            ORDER BY SUM(oi.quantity * oi.price) DESC) AS rn
  FROM products p
  JOIN order_items oi ON oi.product_id = p.product_id
  GROUP BY p.category, p.product_id
) t
WHERE rn <= 3;`)}<p>Explanation: window functions run after GROUP BY, so ROW_NUMBER can rank the grouped sums. Use DENSE_RANK if ties should all stay.</p>`],
        [`SQL: month-over-month revenue change in percent. Table: orders(order_date, amount).`, `${pre(`WITH m AS (
  SELECT DATE_TRUNC('month', order_date) AS month, SUM(amount) AS revenue
  FROM orders GROUP BY 1
)
SELECT month, revenue,
       ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))
             / NULLIF(LAG(revenue) OVER (ORDER BY month), 0), 1) AS pct_change
FROM m
ORDER BY month;`)}<p>Explanation: LAG gets last month; NULLIF avoids division by zero; the first month is NULL.</p>`],
        [`DAX: what is the difference between a calculated column and a measure?`, `<p>A calculated column is computed row by row at refresh and stored in the model (uses memory, can be used in slicers and rows). A measure is calculated on the fly in the context of filters in the visual and is not stored. Use measures for aggregations such as total sales.</p>`],
        [`pandas: show total sales per region sorted high to low, given df with region and sales.`, `${pre(`result = (df.groupby("region", as_index=False)["sales"]
            .sum()
            .sort_values("sales", ascending=False))`)}<p>Explanation: groupby, aggregate, then sort.</p>`],
        [`Stats: explain a p-value to a non-technical manager in 2 sentences.`, `<p>"It tells us how surprising our result would be if there was really no effect. A small p-value (commonly below 0.05) means the result is unlikely to be just random chance, but it does not tell the size or importance of the effect."</p>`]
      ],
      important: [
        [`What do you do when you do not know the answer in an interview?`, `<p>"I say what I do know, think aloud, and give my best reasoning. For example, I may not remember the syntax, but I know the idea, and I say how I would check it. I do not guess silently or pretend."</p>`],
        [`Do you have any questions for us?`, `<p>Ask 2 good ones: "What does success look like in the first 3 months?" and "What tools and data does the team use day to day, and who will I work with?" Avoid asking about salary or leave in a first round unless they raise it.</p>`]
      ],
      resources: [['Glassdoor interviews','https://www.glassdoor.co.in/Interview/index.htm']],
      done: `You are done when the full loop is recorded, the scoring sheet is filled, and you have a written list of the top 5 gaps with a day set to fix each.`
    },
    {
      title: 'Apply to 10 jobs and follow up',
      time: '3.5 h',
      study: [
        `Quality beats quantity: a tailored application that matches 60 to 70 percent of the job description is better than 10 blind clicks.`,
        `An <b>ATS</b> (applicant tracking system) scans your resume for keywords from the job post. Use the exact words from the post when they are true for you (SQL, Power BI, DAX, Python, pandas, stakeholder, dashboard).`,
        `Referrals and direct messages to recruiters often work better than job-board applications. Message first, apply second.`,
        `Follow up 5 to 7 days after applying with a short, polite message. One follow-up is enough per recruiter, a second after another week at most.`,
        `Track everything. A simple sheet (Company, Role, Link, Date, Status, Next step, Contact) saves you from confusion when calls start.`,
        `Prepare for the first call: know the job description, your 2-minute intro, your notice period, and your expected salary range.`
      ],
      how: [
        `[20 min] Open your tracker (Jobs page of this site or a sheet). Check statuses and mark applications that need a follow-up (older than 5 days).`,
        `[40 min] Send follow-ups for old applications and 5 referral or recruiter messages (templates below).`,
        `[90 min] Find and apply to 10 jobs. For each: read the job post (3 min), match 3 keywords into your resume summary (3 min), submit (3 min). Aim for about 9 minutes each.`,
        `[20 min] Log each application in the tracker with the link and date. Set a follow-up date 6 days later.`,
        `[20 min] Prepare for any recruiter call this week: re-read your HR answers and the job post.`,
        `[20 min] Reflect: which job titles match you best (Data Analyst, Junior Data Analyst, BI Analyst, Reporting Analyst, MIS Analyst, Research Analyst)? Use those in your search next week.`
      ],
      example: `<p><b>Recruiter follow-up message (after applying):</b></p>
${pre(`Hi [Name],
I applied for the [Role] position (ID/link: ...) on [date]. I have 2+ years in survey data
and have built SQL, Power BI and Python projects (GitHub: ...). I would be glad to share
more about how I can help your team. Could you tell me the next steps?
Thank you,
[Your name]`)}
<p><b>Referral message to a connection at the company:</b></p>
${pre(`Hi [Name], I noticed [Company] is hiring for [Role]. I am moving from survey
programming into data analytics and have projects in SQL and Power BI.
Would you be open to referring me or sharing any tips? I can send my resume.
Thank you for your time.`)}
<p><b>Tracker columns:</b></p>
${pre(`Company | Role | Link | Applied on | Source (portal/referral) | Status | Contact | Follow-up date | Notes`)}
<p><b>Where to search:</b> LinkedIn, Naukri, Indeed, Foundit, Wellfound (for startups), and company career pages. Set alerts for "data analyst", "junior data analyst", "business analyst", "MIS analyst", "reporting analyst".</p>
<p><b>Honest resume tip:</b> change only the summary and keyword order for each job. Do not add skills you do not have. If you cannot explain a skill in an interview, remove it.</p>`,
      practice: [
        [`Write a 2-line resume summary for a Data Analyst role using your background.`, `<p>"Data-focused professional with 2+ years in survey programming and data quality, skilled in SQL, Power BI and Python (pandas). Built [N] analytics projects covering e-commerce, survey insights and marketing, and looking to turn data into business decisions."</p>`],
        [`A job post asks for 3 years of experience. Should you still apply?`, `<p>Yes, if you match most of the skills. Experience requirements are often flexible. Highlight 2+ years of data work and relevant projects. Do not apply if the main requirement is a skill you do not have at all (for example, 5 years of Spark).</p>`],
        [`What is the best time to follow up and what should you say?`, `<p>After 5 to 7 days. Keep it short: mention the role and date, one line about your fit, and ask about the next steps. Stay polite and do not message daily.</p>`],
        [`The recruiter asks "What is your notice period?" and yours is 60 days. How do you answer?`, `<p>Be honest: "My notice period is 60 days. I can try for an early release, and I will confirm what is possible after I get an offer." Never promise something you cannot deliver.</p>`],
        [`How do you choose which 10 jobs to apply to from 40 results?`, `<p>Rank by match on 3 things: required skills you have, junior or entry-level wording, and company type you want. Apply first to the top 10 matches and save the rest for tomorrow.</p>`]
      ],
      important: [
        [`How are you searching for jobs and how many companies are you in touch with?`, `<p>"I apply on LinkedIn, Naukri and company sites, and I message recruiters and referrals. I track each application and follow up after a week. Right now I have [N] active conversations and I am preparing for rounds."</p>`],
        [`Do you have other offers or interviews in progress?`, `<p>Answer truthfully and calmly: "I am interviewing with a few companies, and this role is a strong fit for me because [reason]." Never invent offers.</p>`]
      ],
      resources: [['GitHub','https://github.com']],
      done: `You are done when 10 tailored applications are logged in your tracker with follow-up dates and at least 5 referral or recruiter messages are sent.`
    }
  ]
};
