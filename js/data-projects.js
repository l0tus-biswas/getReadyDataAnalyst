/* ---------------- PROJECTS ---------------- */
const PROJECTS=[
{id:'p1',name:'Project 1: Survey / CSAT Insights Dashboard',tag:'M',domain:'Survey (your edge)',tools:'Python/Power Query, Power BI',
 data:[['Airline Passenger Satisfaction (Kaggle)','https://www.kaggle.com/datasets/teejmahal20/airline-passenger-satisfaction'],['Stack Overflow Developer Survey','https://survey.stackoverflow.co/']],
 qs:'Which segments are least satisfied? What drives NPS most? Where do scores differ significantly? What are the top 3 fixes?',
 steps:['Pick dataset and write 5 business questions','Clean data: missing values, duplicates, recode Likert scales','Compute CSAT, NPS and top-2-box by segment','Crosstabs and significance to find drivers','Build 3-page Power BI dashboard (Overview, Segments, Drivers)','Write insights + 3 recommendations','README with screenshots on GitHub','Add resume bullet + rehearse 2-min pitch'],
 bullet:'Analysed N survey responses to identify the top 3 drivers of dissatisfaction; built a 3-page Power BI dashboard that quantified NPS by segment and recommended fixes.'},
{id:'p2',name:'Project 2: E-commerce Sales & Customer Analytics',tag:'M',domain:'E-commerce',tools:'SQL, Power BI',
 data:[['Olist Brazilian E-commerce (Kaggle)','https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce']],
 qs:'Revenue trend? Top categories? Repeat-customer rate? Cohort retention? Delivery delay vs review score?',
 steps:['Load multi-table dataset into SQL, define 8 questions','SQL: monthly revenue, top categories, payment mix','SQL: repeat rate, cohort retention, RFM segments','Star-schema model + DAX measures in Power BI','2-3 page dashboard with drill-through','Insights + recommendations','README + GitHub'],
 bullet:'Wrote SQL (CTEs, window functions) on 100k+ orders to compute cohort retention and RFM segments; built a Power BI dashboard highlighting a delivery-delay issue linked to lower review scores.'},
{id:'p3',name:'Project 3: Martech or Edtech Analytics',tag:'M',domain:'Marketing / Education',tools:'Python (pandas), Power BI',
 data:[['UCI Bank Marketing (martech)','https://archive.ics.uci.edu/dataset/222/bank+marketing'],['OULAD Open University Learning Analytics (edtech)','https://analyse.kmi.open.ac.uk/open_dataset']],
 qs:'Which channel/segment converts best? Where is the funnel/drop-off? Who is at risk of dropping out?',
 steps:['Choose domain, define questions','Clean + EDA in pandas','Funnel / channel ROI / drop-off / segments','Power BI dashboard','Insights + recommendations','README + 2-min walkthrough practice'],
 bullet:'Performed EDA on 40k+ records in pandas to find the highest-converting customer segments and recommended budget reallocation.'},
{id:'p4',name:'Project 4 (Bonus): Survey Data Quality Checker',tag:'O',domain:'Your job domain + automation',tools:'Python',
 data:[['Any survey export you can anonymise, or generate synthetic data','https://www.kaggle.com/datasets']],
 qs:'Can a script flag speeders, straight-liners, duplicates and logic violations and output an Excel report?',
 steps:['Define quality rules (speeders, straight-lining, duplicates, skip-logic errors)','Write pandas script to flag rows','Export Excel summary report','README + sample output'],
 bullet:'Automated survey data-quality checks in Python, flagging speeders and straight-liners and cutting manual QA time by X%.'}
];

