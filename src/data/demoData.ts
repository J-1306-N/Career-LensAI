import { Student, StudentSkill, PracticeQuestion, ProjectRecommendation } from '../types';

export const DEMO_CREDENTIALS = {
  email: 'demo@careerlens.ai',
  password: 'Demo@123',
};

export const DEMO_STUDENT: Student = {
  id: 'student-demo-jeffry',
  name: 'Jeffry A',
  email: 'demo@careerlens.ai',
  college: 'Rathinam College of Arts and Science, Coimbatore',
  degree: 'B.Sc Computer Science with Data Science',
  department: 'Computer Science with Data Science',
  year: '2nd Year',
  semester: '3rd Semester',
  career_goal: 'data-analyst',
  current_skill_level: 'Beginner',
  areas_of_interest: [
    'Data Cleaning & Transformation',
    'Business Intelligence Dashboards',
    'SQL Database Querying',
    'Exploratory Data Analysis',
  ],
  bio: 'Second-year undergraduate passionate about unlocking business stories behind messy numbers. Aiming to secure an entry-level Data Analyst internship.',
  updated_at: new Date().toISOString(),
};

export const DEMO_STUDENT_SKILLS: StudentSkill[] = [
  {
    student_id: 'student-demo-jeffry',
    skill_id: 'python',
    skill_name: 'Python',
    category: 'Language',
    proficiency: 'Beginner',
    source: 'onboarding',
    added_at: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    student_id: 'student-demo-jeffry',
    skill_id: 'sql',
    skill_name: 'SQL (Structured Query Language)',
    category: 'Database',
    proficiency: 'Beginner',
    source: 'onboarding',
    added_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    student_id: 'student-demo-jeffry',
    skill_id: 'html_css',
    skill_name: 'HTML5 & Modern CSS',
    category: 'Language',
    proficiency: 'Beginner',
    source: 'onboarding',
    added_at: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    student_id: 'student-demo-jeffry',
    skill_id: 'excel',
    skill_name: 'Advanced Excel & Sheets',
    category: 'Data Tool',
    proficiency: 'Beginner',
    source: 'onboarding',
    added_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

export const DEMO_RESUME_TEXT = `
JEFFRY A
Email: demo@careerlens.ai | LinkedIn: linkedin.com/in/jeffrya-data | Portfolio: github.com/jeffrya-cs
College: Rathinam College of Arts and Science, Coimbatore
Degree: B.Sc Computer Science with Data Science (Standard 3-Year Program)
Current: 2nd Year, 3rd Semester

CAREER OBJECTIVE
Enthusiastic Computer Science undergraduate specializing in Data Science. Seeking a Junior Data Analyst / Analytics Intern position where I can apply relational SQL querying, spreadsheet data cleansing, and Python automation to produce reliable business insights.

EDUCATION
- Bachelor of Science in Computer Science with Data Science (B.Sc CS with DS)
  Rathinam College of Arts and Science, Coimbatore (Affiliated to Bharathiar University)
  Academic Structure: 3 Years / 6 Semesters (2024 - 2027)
  Relevant Coursework: Database Management Systems (DBMS), Discrete Mathematics, Object-Oriented Programming, Introduction to Statistics, Web Design Fundamentals.

TECHNICAL SKILLS
- Programming Languages: Python (Beginner: basic syntax, loops, data structures, simple scripts), HTML5, CSS3
- Databases: SQL (MySQL / PostgreSQL basics: SELECT, WHERE, GROUP BY, basic INNER JOIN)
- Data Tools: Microsoft Excel (VLOOKUP, Pivot Tables, conditional formatting, basic charts), Google Sheets
- Version Control & Environment: Git, GitHub basics, VS Code, Jupyter Notebook

ACADEMIC PROJECTS
1. Student Gradebook & Attendance Tracker (Excel & Python)
   - Created a dynamic spreadsheet model utilizing conditional formatting and VLOOKUP to track scores of 60 students.
   - Built a lightweight Python script to read CSV exports and compute class mean and standard deviation.

2. Personal Portfolio Website (HTML & CSS)
   - Developed a responsive personal profile detailing academic projects, coursework, and contact details.

CERTIFICATIONS & WORKSHOPS
- SQL Basics for Data Science (Coursera - University of California, Davis)
- Python for Everybody (Coursera Specialization - in progress)
- Departmental Hackathon Participant: College Tech Fest 2025

EXTRACURRICULAR & LEADERSHIP
- Student Coordinator, Data Science & AI Campus Club
- Volunteer Peer Tutor for 1st Year Programming in Python
`;

export const CURATED_PRACTICE_QUESTIONS: Record<string, PracticeQuestion[]> = {
  sql: [
    {
      id: 'sql-q1',
      skill: 'SQL (Structured Query Language)',
      difficulty: 'Beginner',
      type: 'concept',
      question: 'Explain the fundamental difference between WHERE and HAVING clauses in SQL. When must you use HAVING instead of WHERE?',
      rubric_keywords: ['aggregation', 'GROUP BY', 'filtering rows vs groups', 'WHERE before aggregation', 'HAVING after GROUP BY'],
      sample_solution: 'The WHERE clause filters individual rows before any aggregations or groupings occur. The HAVING clause filters grouped records after the GROUP BY clause and aggregate functions (like SUM, COUNT, AVG) have been calculated.',
      hint: 'Think about whether you are filtering raw table rows or the result of a SUM() or COUNT().',
    },
    {
      id: 'sql-q2',
      skill: 'SQL (Structured Query Language)',
      difficulty: 'Intermediate',
      type: 'coding',
      question: 'Given an `orders` table with columns (order_id, customer_id, order_date, amount), write a query to find all customers who have placed at least 3 orders and spent a total of more than $500.',
      starter_code: `-- Write your SQL query below\nSELECT customer_id, COUNT(order_id) AS total_orders, SUM(amount) AS total_spent\nFROM orders\n-- Add your grouping and filtering here\n;`,
      rubric_keywords: ['GROUP BY customer_id', 'HAVING COUNT(order_id) >= 3', 'SUM(amount) > 500'],
      sample_solution: 'SELECT customer_id, COUNT(order_id) AS total_orders, SUM(amount) AS total_spent FROM orders GROUP BY customer_id HAVING COUNT(order_id) >= 3 AND SUM(amount) > 500;',
      hint: 'Remember that aggregate conditions on COUNT and SUM go into the HAVING clause after GROUP BY.',
    },
    {
      id: 'sql-q3',
      skill: 'SQL (Structured Query Language)',
      difficulty: 'Intermediate',
      type: 'scenario',
      question: 'Your company has an `employees` table and a `departments` table. The CEO asks for a list showing every department name along with the count of employees in that department, including departments that currently have 0 employees. Which SQL JOIN should you use and why?',
      rubric_keywords: ['LEFT JOIN', 'departments on left', 'preserve all departments', 'COUNT(employees.id)', 'NULL handling'],
      sample_solution: 'You should use a LEFT JOIN starting from departments to employees (or RIGHT JOIN if employees is listed first). This ensures that every department is preserved in the output even if no matching employee records exist in the right table.',
      hint: 'An INNER JOIN would omit departments with zero employees. What join keeps all rows from the primary table?',
    },
  ],
  pandas: [
    {
      id: 'pandas-q1',
      skill: 'Pandas & NumPy',
      difficulty: 'Beginner',
      type: 'concept',
      question: 'What is the difference between `.loc[]` and `.iloc[]` in a Pandas DataFrame?',
      rubric_keywords: ['loc label-based', 'iloc integer position-based', 'index labels', 'slicing differences'],
      sample_solution: '`.loc[]` is label-based indexing, meaning you refer to rows and columns by their names or boolean arrays. `.iloc[]` is integer position-based indexing, where you refer to rows and columns strictly by their 0-indexed integer numerical positions.',
      hint: 'The "i" in iloc stands for integer.',
    },
    {
      id: 'pandas-q2',
      skill: 'Pandas & NumPy',
      difficulty: 'Intermediate',
      type: 'coding',
      question: 'You have a DataFrame `df` with columns `["customer_id", "transaction_date", "purchase_amount"]`. Write a one-liner or short snippet to calculate the total purchase amount per customer and sort them descending by highest spender.',
      starter_code: `# df has customer_id, transaction_date, purchase_amount\nresult = df.groupby('customer_id')['purchase_amount'].sum().sort_values(ascending=False).reset_index()\nprint(result.head())`,
      rubric_keywords: ['groupby', 'purchase_amount', 'sum', 'sort_values', 'ascending=False'],
      sample_solution: "df.groupby('customer_id')['purchase_amount'].sum().sort_values(ascending=False).reset_index()",
      hint: 'Chain .groupby(), .sum(), and .sort_values(ascending=False).',
    },
  ],
  powerbi: [
    {
      id: 'pbi-q1',
      skill: 'Power BI',
      difficulty: 'Intermediate',
      type: 'concept',
      question: 'In Power BI, what is the crucial difference between a Calculated Column and a DAX Measure?',
      rubric_keywords: ['calculated column computed row-by-row at refresh', 'stored in RAM / model size', 'measure evaluated at query time', 'filter context', 'dynamic'],
      sample_solution: 'A Calculated Column is evaluated row-by-row during data refresh and stored in memory, consuming RAM. A DAX Measure is calculated on the fly depending on user interactions and filter context (slicers, visual filters) and does not store static row values in RAM.',
      hint: 'Consider when the computation happens and how it reacts when a user clicks a slicer.',
    },
  ],
  statistics: [
    {
      id: 'stat-q1',
      skill: 'Applied Statistics & Hypothesis Testing',
      difficulty: 'Intermediate',
      type: 'concept',
      question: 'In an A/B test for an e-commerce website, you obtain a p-value of 0.03 at an alpha significance level of 0.05. How do you interpret this result to your product manager?',
      rubric_keywords: ['reject null hypothesis', 'statistically significant', 'less than 5% probability of observing by random chance', 'variant performed better'],
      sample_solution: 'Since p-value (0.03) is less than the significance threshold alpha (0.05), we reject the null hypothesis. There is only a 3% probability that the observed conversion lift happened by random chance alone, which gives us statistical confidence that the test variation legitimately improved performance.',
      hint: 'Compare p-value with alpha. Does this support or reject the null hypothesis?',
    },
  ],
};

export const INITIAL_PROJECT_RECOMMENDATIONS: ProjectRecommendation[] = [
  {
    id: 'proj-1',
    title: 'Automated CSV Data Cleaning & Pipeline Tool',
    problem_statement: 'Companies receive weekly inconsistent CSV exports with null values, broken date formats, and duplicate records that require hours of tedious manual formatting.',
    skills_practiced: ['Python', 'Pandas & NumPy', 'Data Cleansing', 'Automated Scripting'],
    target_career: 'Data Analyst',
    difficulty: 'Beginner',
    key_features: [
      'Ingest dirty CSV files with missing headers and corrupted encoding',
      'Automate null imputation, deduplication, and datetime standardizing',
      'Export a structured audit log and clean export dataset',
      'Generate a terminal or lightweight web UI summary of cleaned anomalies',
    ],
    suggested_technologies: ['Python', 'Pandas', 'Jupyter', 'Argparse/Streamlit'],
    expected_learning_outcome: 'Build deep confidence manipulating tabular DataFrames in Pandas and transforming unnormalized messy data into pristine analytical shapes.',
    estimated_days: 4,
    portfolio_impact: 'High',
  },
  {
    id: 'proj-2',
    title: 'Retail Sales Cohort & Churn SQL Analysis',
    problem_statement: 'An e-commerce retailer wants to understand repeat customer retention rates, customer lifetime value (LTV), and which marketing acquisition channels produce the lowest churn.',
    skills_practiced: ['SQL (Structured Query Language)', 'PostgreSQL', 'Window Functions', 'Cohort Analysis'],
    target_career: 'Data Analyst',
    difficulty: 'Intermediate',
    key_features: [
      'Write multi-table CTEs to construct monthly acquisition cohorts',
      'Calculate month-by-month user retention matrices using window functions',
      'Calculate average order value (AOV) and revenue contribution per cohort',
      'Identify critical churn drop-off periods across customer lifecycles',
    ],
    suggested_technologies: ['PostgreSQL', 'DBeaver / pgAdmin', 'SQL CTEs', 'Window Functions'],
    expected_learning_outcome: 'Master advanced SQL window functions (ROW_NUMBER, DENSE_RANK, LAG/LEAD) and impress technical interviewers with real cohort logic.',
    estimated_days: 5,
    portfolio_impact: 'Very High',
  },
  {
    id: 'proj-3',
    title: 'Sales & Inventory Executive Power BI Dashboard',
    problem_statement: 'Store regional managers lack real-time visibility into out-of-stock SKUs, underperforming store branches, and inventory turnover ratios.',
    skills_practiced: ['Power BI', 'DAX Measures', 'Data Modeling (Star Schema)', 'Visual Storytelling'],
    target_career: 'Data Analyst',
    difficulty: 'Intermediate',
    key_features: [
      'Design a Star Schema linking fact sales tables with customer, product, and calendar dimensions',
      'Create DAX measures for Year-over-Year (YoY) Growth, MoM Variance, and Stock-to-Sales ratio',
      'Build dynamic interactive slicers with drill-through pages for product category details',
      'Implement color-coded alert KPI cards for inventory depletion warning thresholds',
    ],
    suggested_technologies: ['Power BI Desktop', 'DAX Studio', 'Star Schema Data Modeling', 'Excel/CSV Source'],
    expected_learning_outcome: 'Demonstrate real-world business intelligence mastery that hiring managers directly look for in entry-level analyst portfolios.',
    estimated_days: 7,
    portfolio_impact: 'Industry Standard',
  },
  {
    id: 'proj-4',
    title: 'E-commerce Landing Page A/B Testing Statistical Analysis',
    problem_statement: 'A product design team redesigned the checkout flow but needs statistical rigor to confirm if the 3.8% increase in conversions is statistically significant or random variation.',
    skills_practiced: ['Applied Statistics & Hypothesis Testing', 'Python', 'Matplotlib/Seaborn', 'Technical Storytelling'],
    target_career: 'Data Analyst',
    difficulty: 'Intermediate',
    key_features: [
      'Calculate minimum required sample size and statistical power (80% power at alpha=0.05)',
      'Conduct two-sample proportion Z-test and Chi-squared contingency test',
      'Plot conversion rate distributions and 95% confidence intervals',
      'Write a 2-page executive summary translating statistical findings into actionable business advice',
    ],
    suggested_technologies: ['Python', 'SciPy Stats', 'Seaborn', 'Markdown Report'],
    expected_learning_outcome: 'Prove to interviewers that you understand the mathematical foundations of business decision-making, not just surface-level tool syntax.',
    estimated_days: 5,
    portfolio_impact: 'High',
  },
];
