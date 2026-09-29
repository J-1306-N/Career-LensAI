import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini SDK if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('[Gemini AI] Initialized server-side GoogleGenAI client');
  } catch (err) {
    console.warn('[Gemini AI] Could not initialize GoogleGenAI client:', err);
  }
} else {
  console.log('[Gemini AI] No valid GEMINI_API_KEY detected in environment; enabling built-in college domain heuristic fallbacks');
}

// ----------------- API Endpoints ----------------- //

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    ai_configured: !!ai,
    timestamp: new Date().toISOString(),
    service: 'CareerLens AI Backend Engine',
  });
});

// Resume Extraction
app.post('/api/gemini/extract-resume', async (req, res) => {
  const { resumeText } = req.body;
  if (!resumeText) {
    return res.status(400).json({ error: 'Resume text is required' });
  }

  if (ai) {
    try {
      const prompt = `You are an expert college technical career advisor and resume parser.
Analyze the following student resume text and extract all technical and career data into pure JSON matching this exact structure:
{
  "programming_languages": ["Python", "SQL", ...],
  "frameworks": ["FastAPI", "React", ...],
  "databases": ["PostgreSQL", ...],
  "data_tools": ["Excel", "Power BI", "Pandas", ...],
  "cloud_and_devops": ["Git", "GitHub", "Docker", ...],
  "projects": [
    { "title": "Project Name", "description": "1-2 sentence description", "tech_stack": ["Tech1", "Tech2"] }
  ],
  "certifications": ["Cert 1", ...],
  "soft_skills": ["Technical Communication", ...],
  "education": [
    { "degree": "Degree name", "institution": "College/University", "year_or_status": "Year or dates" }
  ],
  "experience": [
    { "role": "Role title", "company_or_org": "Org name", "duration": "Dates", "bullets": ["Task 1", "Task 2"] }
  ]
}

Resume Text:
"""${resumeText.slice(0, 8000)}"""`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (err: any) {
      console.warn('[Gemini Extract] API call failed, falling back:', err.message);
    }
  }

  // Fallback response handled gracefully by returning null, which triggers client heuristic
  return res.status(503).json({ fallback: true, message: 'AI processing fallback invoked' });
});

// Practice Question Generation
app.post('/api/gemini/practice-question', async (req, res) => {
  const { skill, difficulty, type } = req.body;

  if (ai) {
    try {
      const prompt = `Generate an engaging, practical ${difficulty} level practice question for a student learning "${skill}".
Question Type: ${type} (can be concept, multiple_choice, short_answer, coding, or scenario).
Respond in pure JSON matching this structure:
{
  "question": "The question prompt",
  "options": ["Option A", "Option B", "Option C", "Option D"] (only if multiple_choice, else omit),
  "starter_code": "template code with comments" (only if coding, else omit),
  "rubric_keywords": ["keyword 1", "keyword 2", "keyword 3"],
  "sample_solution": "Ideal concise student answer explaining core principles",
  "hint": "Gentle conceptual clue without giving away the direct answer"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (err: any) {
      console.warn('[Gemini Question] API call failed, falling back:', err.message);
    }
  }

  return res.status(503).json({ fallback: true });
});

// Answer Evaluation
app.post('/api/gemini/evaluate-answer', async (req, res) => {
  const { question, userAnswer } = req.body;

  if (ai) {
    try {
      const prompt = `You are a supportive, rigorous computer science professor and technical interview evaluator.
Evaluate the student's answer to this question:
Question: "${question.question}"
Target Skill: "${question.skill}"
Rubric Keywords: ${JSON.stringify(question.rubric_keywords || [])}
Sample Solution: "${question.sample_solution || ''}"

Student's Answer:
"""${userAnswer}"""

Evaluate the answer. Do NOT simply say whether it is right; explain the reasoning.
Respond in pure JSON:
{
  "evaluation_label": "Correct" | "Mostly Correct" | "Partially Correct" | "Needs Improvement",
  "is_correct_or_mostly": true | false,
  "score": number between 0 and 100,
  "feedback": "2-3 sentences evaluating answer clarity and correctness",
  "important_points_covered": ["point 1 that student successfully mentioned", ...],
  "missing_concepts": ["critical edge case or concept student skipped", ...],
  "follow_up_question": "A stimulating follow-up question to test deeper understanding",
  "suggested_drill": "Actionable 1-sentence practice advice"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (err: any) {
      console.warn('[Gemini Evaluate] API call failed, falling back:', err.message);
    }
  }

  return res.status(503).json({ fallback: true });
});

// Interview Question
app.post('/api/gemini/interview-question', async (req, res) => {
  const { role, difficulty, type, questionNumber, previousQuestions } = req.body;

  if (ai) {
    try {
      const prompt = `You are conducting a realistic job interview for a "${role}" position (${difficulty} level).
Interview Type: ${type} (Technical, HR, or Mixed).
This is question #${questionNumber}.
Previously asked questions: ${JSON.stringify(previousQuestions || [])}.
Generate the NEXT interview question. Avoid repeating topics already covered.
Respond in pure JSON:
{
  "question": "Realistic, conversational interview question",
  "category": "Technical" | "Behavioral" | "Scenario",
  "expected_keywords": ["keyword1", "keyword2"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.6,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (err: any) {
      console.warn('[Gemini Interview Q] API call failed, falling back:', err.message);
    }
  }

  return res.status(503).json({ fallback: true });
});

// Interview Feedback
app.post('/api/gemini/interview-feedback', async (req, res) => {
  const { question, userAnswer, role } = req.body;

  if (ai) {
    try {
      const prompt = `You are an experienced engineering hiring manager evaluating a candidate's answer during a mock interview for "${role}".
Question: "${question}"
Candidate Answer: "${userAnswer}"

Provide constructive feedback based on observable answer quality. Do not guarantee real hiring outcomes.
Respond in pure JSON:
{
  "feedback": "2-3 sentences of constructive, encouraging evaluation",
  "points_covered": ["Strength or relevant detail observed 1", ...],
  "points_missed": ["Important perspective or technical detail skipped", ...],
  "suggested_improvement": "Concrete suggestion for next time (e.g. use STAR method, mention trade-offs)",
  "rating_score": number between 1 and 10
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (err: any) {
      console.warn('[Gemini Interview Feedback] API call failed, falling back:', err.message);
    }
  }

  return res.status(503).json({ fallback: true });
});

// Project Recommendations
app.post('/api/gemini/project-recommendations', async (req, res) => {
  const { missingSkills, targetCareer } = req.body;

  if (ai) {
    try {
      const prompt = `You are a senior tech lead advising a college student targeting a "${targetCareer}" career.
Their missing or partial skills are: ${JSON.stringify(missingSkills)}.
Recommend 3 distinct, highly realistic portfolio projects specifically designed to close these skill gaps.
Respond in pure JSON array:
[
  {
    "id": "proj-1",
    "title": "Project Title",
    "problem_statement": "Real-world business or technical problem it solves",
    "skills_practiced": ["Skill 1", "Skill 2"],
    "target_career": "${targetCareer}",
    "difficulty": "Beginner" | "Intermediate" | "Advanced",
    "key_features": ["Feature 1", "Feature 2", "Feature 3"],
    "suggested_technologies": ["Tech 1", "Tech 2"],
    "expected_learning_outcome": "What student will master",
    "estimated_days": 5,
    "portfolio_impact": "High" | "Very High" | "Industry Standard"
  }
]`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.5,
        },
      });

      const parsed = JSON.parse(response.text || '[]');
      return res.json(parsed);
    } catch (err: any) {
      console.warn('[Gemini Projects] API call failed, falling back:', err.message);
    }
  }

  return res.status(503).json({ fallback: true });
});

// ----------------- Vite Integration & Static Serving ----------------- //

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files from Vite build output
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[CareerLens AI] Server running on http://localhost:${PORT}`);
  });
}

startServer();
