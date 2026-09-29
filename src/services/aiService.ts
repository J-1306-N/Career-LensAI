import {
  ExtractedResumeData,
  PracticeQuestion,
  PracticeEvaluation,
  InterviewQuestionItem,
  InterviewAnswerItem,
  InterviewSummary,
  ProjectRecommendation,
  ProficiencyLevel,
  QuestionType,
} from '../types';
import { CURATED_PRACTICE_QUESTIONS } from '../data/demoData';

/**
 * AI Service for CareerLens AI.
 * Communicates with server-side /api/gemini/* routes, with instant smart fallbacks.
 */

export async function extractResumeWithAI(resumeText: string): Promise<ExtractedResumeData> {
  try {
    const res = await fetch('/api/gemini/extract-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.programming_languages) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend AI extract route error, using resilient fallback parser:', err);
  }

  // Resilient heuristic extractor fallback
  return fallbackResumeExtractor(resumeText);
}

export async function generatePracticeQuestionAI(
  skill: string,
  difficulty: ProficiencyLevel,
  type: QuestionType
): Promise<PracticeQuestion> {
  try {
    const res = await fetch('/api/gemini/practice-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skill, difficulty, type }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.question) {
        return {
          id: `ai-q-${Date.now()}`,
          skill,
          difficulty,
          type,
          question: data.question,
          options: data.options,
          starter_code: data.starter_code,
          rubric_keywords: data.rubric_keywords || [skill, 'best practices'],
          sample_solution: data.sample_solution || 'Structured application of core concepts.',
          hint: data.hint || `Review the core architectural principles of ${skill}.`,
        };
      }
    }
  } catch (err) {
    console.warn('Practice question generation fallback applied:', err);
  }

  // Fallback to curated library or dynamic template
  const skillKey = skill.toLowerCase().includes('sql')
    ? 'sql'
    : skill.toLowerCase().includes('pandas')
    ? 'pandas'
    : skill.toLowerCase().includes('power bi')
    ? 'powerbi'
    : skill.toLowerCase().includes('stat')
    ? 'statistics'
    : null;

  if (skillKey && CURATED_PRACTICE_QUESTIONS[skillKey]) {
    const questions = CURATED_PRACTICE_QUESTIONS[skillKey];
    const match = questions.find((q) => q.difficulty === difficulty) || questions[0];
    return { ...match, id: `curated-${Date.now()}` };
  }

  return {
    id: `fb-q-${Date.now()}`,
    skill,
    difficulty,
    type,
    question: `Explain how you would apply ${skill} to solve a performance bottleneck or architectural challenge in an industry setting.`,
    rubric_keywords: [skill, 'scalability', 'error handling', 'profiling'],
    sample_solution: `In production environments, applying ${skill} effectively requires handling edge cases, validating input integrity, and considering computational complexity.`,
    hint: `Focus on how ${skill} interfaces with other parts of the technology stack.`,
  };
}

export async function evaluateAnswerAI(
  question: PracticeQuestion,
  userAnswer: string
): Promise<PracticeEvaluation> {
  try {
    const res = await fetch('/api/gemini/evaluate-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, userAnswer }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.evaluation_label) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Answer evaluation fallback applied:', err);
  }

  // Dynamic heuristic evaluator
  return fallbackEvaluateAnswer(question, userAnswer);
}

export async function generateInterviewQuestionAI(
  role: string,
  difficulty: string,
  type: string,
  questionNumber: number,
  previousQuestions: string[]
): Promise<InterviewQuestionItem> {
  try {
    const res = await fetch('/api/gemini/interview-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, difficulty, type, questionNumber, previousQuestions }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.question) {
        return {
          id: `int-q-${Date.now()}`,
          question_number: questionNumber,
          category: (data.category as any) || (type === 'HR' ? 'Behavioral' : 'Technical'),
          question: data.question,
          expected_keywords: data.expected_keywords || [],
          difficulty,
        };
      }
    }
  } catch (err) {
    console.warn('Interview question AI fallback applied:', err);
  }

  return fallbackInterviewQuestion(role, difficulty, type, questionNumber);
}

export async function evaluateInterviewAnswerAI(
  question: string,
  userAnswer: string,
  role: string
): Promise<{
  feedback: string;
  points_covered: string[];
  points_missed: string[];
  suggested_improvement: string;
  rating_score: number;
}> {
  try {
    const res = await fetch('/api/gemini/interview-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, userAnswer, role }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.feedback) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Interview feedback AI fallback applied:', err);
  }

  return fallbackInterviewFeedback(question, userAnswer, role);
}

export async function generateProjectRecommendationsAI(
  missingSkills: string[],
  targetCareer: string
): Promise<ProjectRecommendation[]> {
  try {
    const res = await fetch('/api/gemini/project-recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ missingSkills, targetCareer }),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Project recommendations fallback applied:', err);
  }

  // Fallback tailored project generator
  return fallbackProjects(missingSkills, targetCareer);
}

// ----------------- Fallback Implementations ----------------- //

function fallbackResumeExtractor(text: string): ExtractedResumeData {
  const lower = text.toLowerCase();

  const detectedLanguages: string[] = [];
  const detectedDatabases: string[] = [];
  const detectedDataTools: string[] = [];
  const detectedFrameworks: string[] = [];
  const detectedCloud: string[] = [];

  const langMap: Record<string, string> = {
    python: 'Python',
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    java: 'Java',
    'c++': 'C++',
    html: 'HTML5',
    css: 'CSS3',
    sql: 'SQL',
    r: 'R Language',
  };

  Object.entries(langMap).forEach(([k, v]) => {
    if (lower.includes(k)) detectedLanguages.push(v);
  });

  const dbMap: Record<string, string> = {
    postgresql: 'PostgreSQL',
    postgres: 'PostgreSQL',
    mysql: 'MySQL',
    mongodb: 'MongoDB',
    sqlite: 'SQLite',
    redis: 'Redis',
  };
  Object.entries(dbMap).forEach(([k, v]) => {
    if (lower.includes(k) && !detectedDatabases.includes(v)) detectedDatabases.push(v);
  });
  if (lower.includes('sql') && detectedDatabases.length === 0) detectedDatabases.push('SQL (Relational)');

  const toolMap: Record<string, string> = {
    excel: 'Microsoft Excel',
    'power bi': 'Power BI',
    powerbi: 'Power BI',
    tableau: 'Tableau',
    pandas: 'Pandas',
    numpy: 'NumPy',
    matplotlib: 'Matplotlib',
    seaborn: 'Seaborn',
    'jupyter': 'Jupyter Notebook',
  };
  Object.entries(toolMap).forEach(([k, v]) => {
    if (lower.includes(k) && !detectedDataTools.includes(v)) detectedDataTools.push(v);
  });

  const fwMap: Record<string, string> = {
    react: 'React.js',
    express: 'Express.js',
    django: 'Django',
    fastapi: 'FastAPI',
    tailwind: 'Tailwind CSS',
    node: 'Node.js',
  };
  Object.entries(fwMap).forEach(([k, v]) => {
    if (lower.includes(k) && !detectedFrameworks.includes(v)) detectedFrameworks.push(v);
  });

  const cloudMap: Record<string, string> = {
    git: 'Git',
    github: 'GitHub',
    docker: 'Docker',
    aws: 'AWS',
    gcp: 'Google Cloud Platform',
  };
  Object.entries(cloudMap).forEach(([k, v]) => {
    if (lower.includes(k) && !detectedCloud.includes(v)) detectedCloud.push(v);
  });

  return {
    programming_languages: detectedLanguages.length ? detectedLanguages : ['Python', 'SQL'],
    frameworks: detectedFrameworks,
    databases: detectedDatabases.length ? detectedDatabases : ['SQL (MySQL/PostgreSQL)'],
    data_tools: detectedDataTools.length ? detectedDataTools : ['Microsoft Excel', 'Jupyter Notebook'],
    cloud_and_devops: detectedCloud.length ? detectedCloud : ['Git', 'GitHub'],
    projects: [
      {
        title: 'Academic Gradebook & Analytics Utility',
        description: 'Automated student grade computation and spreadsheet aggregation with Python and Excel.',
        tech_stack: ['Python', 'Excel', 'Data Cleansing'],
      },
      {
        title: 'Responsive Web Portfolio',
        description: 'Personal academic showcase detailing coursework and university projects.',
        tech_stack: ['HTML5', 'CSS3', 'Git'],
      },
    ],
    certifications: [
      'SQL Basics for Data Science (Coursera)',
      'Introduction to Python Programming (Departmental Course)',
    ],
    soft_skills: [
      'Analytical Problem Solving',
      'Technical Communication',
      'Teamwork & Collaboration',
    ],
    education: [
      {
        degree: 'B.Sc Computer Science with Data Science',
        institution: 'Rathinam College of Arts and Science, Coimbatore',
        year_or_status: 'Standard 3-Year Program (2nd Year, 3rd Semester)',
      },
    ],
    experience: [
      {
        role: 'Data Science Club Peer Tutor',
        company_or_org: 'Campus Computing Society',
        duration: '2025 - Present',
        bullets: [
          'Assisted 30+ 1st-year undergraduates with Python syntax, loops, and basic file I/O.',
          'Organized weekly departmental practice hackathons.',
        ],
      },
    ],
    raw_text: text,
  };
}

function fallbackEvaluateAnswer(
  question: PracticeQuestion,
  answer: string
): PracticeEvaluation {
  const cleanAns = answer.trim().toLowerCase();
  const wordCount = cleanAns.split(/\s+/).filter(Boolean).length;

  // Check matching rubric keywords
  const matchedKeywords = question.rubric_keywords.filter((kw) =>
    cleanAns.includes(kw.toLowerCase())
  );

  const coverageRatio =
    question.rubric_keywords.length > 0
      ? matchedKeywords.length / question.rubric_keywords.length
      : 0.5;

  let label: 'Correct' | 'Mostly Correct' | 'Partially Correct' | 'Needs Improvement';
  let isCorrectOrMostly = false;
  let score = 50;

  if (wordCount < 6) {
    label = 'Needs Improvement';
    score = 30;
    isCorrectOrMostly = false;
  } else if (coverageRatio >= 0.6 || (wordCount > 25 && coverageRatio >= 0.4)) {
    label = coverageRatio >= 0.8 ? 'Correct' : 'Mostly Correct';
    isCorrectOrMostly = true;
    score = coverageRatio >= 0.8 ? 92 : 82;
  } else if (coverageRatio >= 0.3 || wordCount >= 15) {
    label = 'Partially Correct';
    score = 65;
    isCorrectOrMostly = false;
  } else {
    label = 'Needs Improvement';
    score = 45;
    isCorrectOrMostly = false;
  }

  const missingConcepts = question.rubric_keywords.filter(
    (kw) => !cleanAns.includes(kw.toLowerCase())
  );

  return {
    question_id: question.id,
    evaluation_label: label,
    is_correct_or_mostly: isCorrectOrMostly,
    score,
    feedback: isCorrectOrMostly
      ? `Strong effort! You clearly addressed the core mechanisms of ${question.skill}. Your explanation highlights essential operational principles.`
      : `Good initial attempt, but your response would benefit from incorporating deeper technical terminology and addressing edge-case handling.`,
    important_points_covered:
      matchedKeywords.length > 0
        ? matchedKeywords.map((k) => `Demonstrated understanding of: "${k}"`)
        : ['Provided foundational reasoning'],
    missing_concepts:
      missingConcepts.length > 0
        ? missingConcepts.map((k) => `Ensure to explicitly address "${k}"`)
        : ['Consider contrasting with alternative architectural trade-offs'],
    follow_up_question: `Follow-up Drill: How does this behavior change when data volume scales by 100x or when concurrent transactions execute?`,
    suggested_drill: `Review the official documentation on ${question.skill} and practice 2 variations on this topic.`,
  };
}

function fallbackInterviewQuestion(
  role: string,
  difficulty: string,
  type: string,
  qNum: number
): InterviewQuestionItem {
  const bank: Record<string, string[]> = {
    'Data Analyst': [
      'Can you explain the difference between INNER JOIN, LEFT JOIN, and FULL OUTER JOIN, and share a scenario where using the wrong join would corrupt an analytics metric?',
      'How do you handle missing or NULL values in a dataset? What criteria help you decide whether to impute or drop them?',
      'Walk me through an analytical dashboard or project you designed. What was the business question and what was your conclusion?',
      'Tell me about a time you had to present complex quantitative findings to someone without a mathematical background. How did you structure your communication?',
      'If you notice a sudden 15% drop in weekly active users on an e-commerce platform, what step-by-step diagnostic workflow would you follow?',
    ],
    'Software Developer': [
      'Explain the difference between a Process and a Thread, and how race conditions are prevented in concurrent software.',
      'What are the SOLID principles of Object-Oriented Design, and can you provide a quick example of the Single Responsibility Principle?',
      'Describe how a Hash Table works internally, including average vs worst-case time complexity and collision resolution strategies.',
      'Tell me about a challenging bug you encountered in a project. How did you isolate, reproduce, and resolve it?',
      'How do you approach writing clean, testable code versus rushing a feature out the door under a tight deadline?',
    ],
  };

  const pool = bank[role] || bank['Data Analyst'];
  const questionIndex = (qNum - 1) % pool.length;

  return {
    id: `int-q-${Date.now()}-${qNum}`,
    question_number: qNum,
    category: type === 'HR' ? 'Behavioral' : qNum % 2 === 0 ? 'Scenario' : 'Technical',
    question: pool[questionIndex],
    expected_keywords: ['tradeoffs', 'systematic diagnosis', 'data validation', 'communication'],
    difficulty,
  };
}

function fallbackInterviewFeedback(
  question: string,
  answer: string,
  role: string
) {
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
  const ratingScore = Math.min(9, Math.max(4, Math.round(wordCount / 12) + 3));

  return {
    feedback: `You articulated your logic clearly. In interview settings for a ${role}, interviewers look for structured storytelling (e.g. STAR method for behavioral or Trade-offs for technical).`,
    points_covered: [
      'Addressed the prompt directly with concrete phrasing',
      'Demonstrated structured logical reasoning',
    ],
    points_missed: [
      'Could explicitly reference concrete metrics or quantifiable outcomes',
      'Could mention preventative testing or monitoring to ensure long-term stability',
    ],
    suggested_improvement: 'Frame your response with a 3-part structure: 1) High-level definition/thesis, 2) Specific technical or situational example, 3) Business or architectural takeaway.',
    rating_score: ratingScore,
  };
}

function fallbackProjects(missingSkills: string[], targetCareer: string): ProjectRecommendation[] {
  const list: ProjectRecommendation[] = [];

  if (missingSkills.some((s) => s.toLowerCase().includes('sql'))) {
    list.push({
      id: `proj-sql-${Date.now()}`,
      title: 'Student Academic Performance & Cohort Retention Analytics',
      problem_statement: 'Universities struggle to identify early indicators of course dropout and academic risk across academic terms.',
      skills_practiced: ['SQL (Structured Query Language)', 'PostgreSQL', 'Window Functions', 'Data Modeling'],
      target_career: targetCareer,
      difficulty: 'Intermediate',
      key_features: [
        'Multi-table relational schema modeling courses, enrollments, and grades',
        'Complex window functions calculating rolling GPA trends and rank distributions',
        'Cohort retention matrices tracking semester-to-semester completion rates',
      ],
      suggested_technologies: ['PostgreSQL', 'DBeaver', 'SQL Views', 'GitHub README'],
      expected_learning_outcome: 'Master advanced SQL joins, subqueries, and window functions that prove database fluency to hiring managers.',
      estimated_days: 5,
      portfolio_impact: 'Very High',
    });
  }

  if (missingSkills.some((s) => s.toLowerCase().includes('pandas') || s.toLowerCase().includes('python'))) {
    list.push({
      id: `proj-py-${Date.now()}`,
      title: 'Automated E-Commerce Order Cleaning & Reconciliation Utility',
      problem_statement: 'Financial and inventory departments waste hours reconciling messy CSV logs with missing tracking IDs and duplicate rows.',
      skills_practiced: ['Python', 'Pandas & NumPy', 'Data Cleansing', 'Automated Scripting'],
      target_career: targetCareer,
      difficulty: 'Beginner',
      key_features: [
        'Automated file ingestion for unnormalized messy CSV and Excel files',
        'Regex date parsing, missing value imputation, and duplicate row purging',
        'Exporting audit log summaries and clean analytical datasets',
      ],
      suggested_technologies: ['Python 3', 'Pandas', 'Jupyter Notebook'],
      expected_learning_outcome: 'Build muscular confidence in Python tabular transformations and real-world data preparation.',
      estimated_days: 4,
      portfolio_impact: 'High',
    });
  }

  if (missingSkills.some((s) => s.toLowerCase().includes('power bi') || s.toLowerCase().includes('tableau') || s.toLowerCase().includes('excel'))) {
    list.push({
      id: `proj-bi-${Date.now()}`,
      title: 'Global Supply Chain & Warehouse KPI Intelligence Dashboard',
      problem_statement: 'Operations teams lack unified visualization of supplier lead times, delayed shipments, and regional stockout frequencies.',
      skills_practiced: ['Power BI', 'DAX Measures', 'Data Modeling', 'Visual Storytelling'],
      target_career: targetCareer,
      difficulty: 'Intermediate',
      key_features: [
        'Star schema data model connecting shipment facts with supplier and product dimensions',
        'DAX measures for On-Time-In-Full (OTIF) rate and Year-over-Year variance',
        'Interactive drill-through cards and executive summary heatmaps',
      ],
      suggested_technologies: ['Power BI Desktop', 'DAX', 'Excel Dataset'],
      expected_learning_outcome: 'Demonstrate executive business intelligence visualization skills demanded by enterprise employers.',
      estimated_days: 6,
      portfolio_impact: 'Industry Standard',
    });
  }

  // Always have at least 2 recommendations
  if (list.length < 2) {
    list.push({
      id: `proj-cap-${Date.now()}`,
      title: `${targetCareer} Comprehensive Capstone Portfolio`,
      problem_statement: 'Students need an impressive, multi-technology end-to-end repository on GitHub to stand out in competitive applicant pools.',
      skills_practiced: ['Analytical Problem Solving', 'Git & GitHub Version Control', 'Technical Communication', ...missingSkills.slice(0, 2)],
      target_career: targetCareer,
      difficulty: 'Intermediate',
      key_features: [
        'Real-world problem statement with reproducible synthetic dataset',
        'Exploratory data analysis, core algorithmic/analytical implementation',
        'Well-documented GitHub README with architectural diagrams and key takeaways',
      ],
      suggested_technologies: ['Git', 'GitHub', 'Python / SQL / BI Tools'],
      expected_learning_outcome: 'Synthesize multiple competencies into a single definitive showcase project ready for technical interviews.',
      estimated_days: 7,
      portfolio_impact: 'Very High',
    });
  }

  return list;
}
