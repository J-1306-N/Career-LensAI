/**
 * CareerLens AI Data Models
 * Strictly typed schemas for students, skills, career frameworks, roadmaps,
 * assessments, interview simulators, and gap analytics.
 */

export type ProficiencyLevel = 'Not Started' | 'Beginner' | 'Intermediate' | 'Advanced';
export type SkillMatchStatus = 'Strong Match' | 'Partial Match' | 'Missing';
export type RoadmapStatus = 'Not Started' | 'In Progress' | 'Completed';
export type QuestionType = 'concept' | 'multiple_choice' | 'short_answer' | 'coding' | 'scenario';
export type InterviewType = 'Technical' | 'HR' | 'Mixed';
export type InterviewDifficulty = 'Entry Level' | 'Associate' | 'Senior Ready';

export type CareerAlignmentStatus =
  | 'Good skill alignment'
  | 'Possible with additional preparation'
  | 'Significant skill gaps';

export interface Student {
  id: string;
  name: string;
  email?: string;
  college: string;
  degree: string;
  department: string;
  year: string;
  semester: string;
  career_goal: string;
  current_skill_level: ProficiencyLevel;
  areas_of_interest: string[];
  bio?: string;
  updated_at: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  has_completed_onboarding: boolean;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Language' | 'Framework' | 'Database' | 'Data Tool' | 'Cloud & DevOps' | 'Core CS' | 'Soft Skills' | 'Machine Learning' | 'Hardware & IoT' | 'Domain Skill';
  level: ProficiencyLevel;
  description: string;
  prerequisites: string[];
  typical_hours: number;
}

export interface CareerSkill {
  career_id: string;
  skill_id: string;
  skill_name: string;
  importance: 'Critical' | 'Important' | 'Bonus';
  weight: number; // 3 for critical core, 2 for supporting/tools, 1 for soft/bonus
  required_level: ProficiencyLevel;
  category_group: 'core_tech' | 'supporting_tech' | 'tools' | 'soft_skills';
  why_relevant: string;
  prerequisites?: string[];
  suggested_practice: string;
  suggested_project: string;
}

export interface Career {
  id: string;
  name: string;
  domain: string;
  tagline: string;
  description: string;
  typical_roles: string[];
  responsibilities: string[];
  skills: CareerSkill[];
  preferred_skills?: string[];
  important_tools?: string[];
  recommended_certifications?: string[];
  recommended_project_types?: string[];
  practical_experience_needed?: string;
  typical_project_skills: string[];
  interview_topics: string[];
  learning_prerequisites?: string[];
}

export interface StudentSkill {
  student_id: string;
  skill_id: string;
  skill_name: string;
  category: string;
  proficiency: ProficiencyLevel;
  experience_years_or_months?: string; // e.g. "6 months", "1 year"
  evidence_or_source?: string; // e.g. "Coursework", "Self-taught", "Internship", "GitHub"
  source: 'onboarding' | 'resume' | 'manual' | 'practice_verified';
  verified_score?: number;
  added_at: string;
}

export interface SkillGapDetail {
  skill_id: string;
  name: string;
  category: string;
  category_group: 'core_tech' | 'supporting_tech' | 'tools' | 'soft_skills';
  required_level: ProficiencyLevel;
  student_level?: ProficiencyLevel;
  status: SkillMatchStatus;
  weight: number;
  score_contribution: number;
  max_contribution: number;
  why_relevant: string;
  difficulty: ProficiencyLevel;
  prerequisites: string[];
  recommended_learning_order: number;
  suggested_practice: string;
  suggested_project: string;
}

export interface NextStepItem {
  id: string;
  step_number: number;
  title: string;
  skill_name: string;
  description: string;
  action_type: 'learn' | 'practice' | 'project' | 'interview';
  target_url?: string;
}

export interface SkillGapAnalysisResult {
  career_id: string;
  career_name: string;
  student_id: string;
  analysis_date: string;
  overall_match_percentage: number;
  matched_weighted_points: number;
  total_weighted_points: number;
  strong_matches_count: number;
  partial_matches_count: number;
  missing_skills_count: number;
  strong_matches: SkillGapDetail[];
  partial_matches: SkillGapDetail[];
  missing_skills: SkillGapDetail[];
  all_evaluated_skills: SkillGapDetail[];
  next_three_steps: NextStepItem[];

  // User Section 4 Structured Separation:
  skills_already_have: SkillGapDetail[];
  skills_need_improvement: SkillGapDetail[];
  skills_missing: SkillGapDetail[];
  recommended_additional_skills: string[];
  practical_experience_needed: string;
  projects_recommended: ProjectRecommendation[];
  interview_preparation_needed: string[];

  // Alignment evaluation
  career_alignment_status: CareerAlignmentStatus;
  status_color: 'green' | 'yellow' | 'red';
  status_explanation: string;

  methodology: {
    formula: string;
    weights_explanation: string;
    partial_credit_rule: string;
  };
}

export interface CareerOptionMatch {
  career: Career;
  matching_skills: SkillGapDetail[];
  skills_needing_improvement: SkillGapDetail[];
  missing_skills: SkillGapDetail[];
  recommended_additional_skills: string[];
  overall_match_percentage: number;
  alignment_status: CareerAlignmentStatus;
  status_color: 'green' | 'yellow' | 'red';
  status_explanation: string;
  strong_count: number;
  partial_count: number;
  missing_count: number;
}

export interface RoadmapItem {
  id: string;
  student_id: string;
  skill_id: string;
  skill_name: string;
  phase_id: number;
  phase_name: string;
  level: ProficiencyLevel;
  prerequisites: string[];
  estimated_hours: number;
  why_needed: string;
  practice_task: string;
  mini_project: string;
  status: RoadmapStatus;
  notes?: string;
  completed_at?: string;
}

export interface RoadmapPhase {
  phase_id: number;
  title: string;
  subtitle: string;
  description: string;
  items: RoadmapItem[];
}

export interface PracticeQuestion {
  id: string;
  skill: string;
  difficulty: ProficiencyLevel;
  type: QuestionType;
  question: string;
  context?: string;
  options?: string[]; // for multiple_choice
  starter_code?: string; // for coding
  rubric_keywords: string[];
  sample_solution: string;
  hint: string;
}

export interface PracticeEvaluation {
  question_id: string;
  evaluation_label: 'Correct' | 'Mostly Correct' | 'Partially Correct' | 'Needs Improvement';
  is_correct_or_mostly: boolean;
  score: number; // 0-100
  feedback: string;
  important_points_covered: string[];
  missing_concepts: string[];
  follow_up_question: string;
  suggested_drill: string;
}

export interface PracticeSubmissionRecord {
  id: string;
  question: PracticeQuestion;
  user_answer: string;
  evaluation: PracticeEvaluation;
  submitted_at: string;
}

export interface PracticeActivityItem {
  id: string;
  skill_id: string;
  skill_name: string;
  topic: string;
  level: ProficiencyLevel;
  activity_description: string;
  is_completed: boolean;
  category: string;
}

export interface InterviewQuestionItem {
  id: string;
  question_number: number;
  category: 'Technical' | 'Behavioral' | 'Scenario';
  question: string;
  expected_keywords: string[];
  difficulty: string;
}

export interface InterviewAnswerItem {
  question_id: string;
  question_text: string;
  user_answer: string;
  feedback: string;
  points_covered: string[];
  points_missed: string[];
  suggested_improvement: string;
  rating_score: number; // 1 to 10
}

export interface InterviewSummary {
  total_questions: number;
  average_score: number; // out of 10
  observable_strengths: string[];
  key_areas_for_growth: string[];
  confidence_rating: 'Developing' | 'Solid Foundation' | 'Interview-Ready in Fundamentals';
  closing_remarks: string;
}

export interface InterviewSession {
  id: string;
  student_id: string;
  role: string;
  difficulty: InterviewDifficulty;
  type: InterviewType;
  created_at: string;
  status: 'in_progress' | 'completed';
  questions: InterviewQuestionItem[];
  answers: InterviewAnswerItem[];
  summary?: InterviewSummary;
}

export interface ProjectRecommendation {
  id: string;
  title: string;
  problem_statement: string;
  skills_practiced: string[];
  target_career: string;
  difficulty: ProficiencyLevel;
  key_features: string[];
  skills_gained?: string[];
  why_recommended?: string;
  expected_outcome?: string;
  suggested_technologies: string[];
  expected_learning_outcome: string;
  estimated_days: number;
  portfolio_impact: 'High' | 'Very High' | 'Industry Standard';
  is_saved?: boolean;
  is_completed?: boolean;
}

export interface ExtractedResumeData {
  programming_languages: string[];
  frameworks: string[];
  databases: string[];
  data_tools: string[];
  cloud_and_devops: string[];
  projects: Array<{
    title: string;
    description: string;
    tech_stack: string[];
  }>;
  certifications: string[];
  soft_skills: string[];
  education: Array<{
    degree: string;
    institution: string;
    year_or_status: string;
  }>;
  experience: Array<{
    role: string;
    company_or_org: string;
    duration: string;
    bullets: string[];
  }>;
  raw_text?: string;
  file_name?: string;
}

export interface CareerComparisonItem {
  career: Career;
  analysis: SkillGapAnalysisResult;
  matching_skills_names: string[];
  missing_skills_names: string[];
  partial_skills_names: string[];
  unique_learning_areas: string[];
  sample_projects: string[];
  interview_focus_areas: string[];
}
