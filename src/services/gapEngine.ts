import { Career, StudentSkill, SkillGapAnalysisResult, SkillGapDetail, NextStepItem, ProficiencyLevel, CareerAlignmentStatus, ProjectRecommendation } from '../types';
import { CAREERS_DATA } from '../data/careersData';
import { SKILLS_LIBRARY } from '../data/skillsLibrary';
import { INITIAL_PROJECT_RECOMMENDATIONS } from '../data/demoData';

const PROFICIENCY_SCORES: Record<ProficiencyLevel, number> = {
  'Not Started': 0,
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
};

/**
 * Deterministic, transparent Career Readiness & Skill Gap Engine.
 * Evaluates student competencies against the configured target career framework.
 */
export function analyzeSkillGaps(
  targetCareerId: string,
  studentSkills: StudentSkill[],
  studentId: string
): SkillGapAnalysisResult {
  const career = CAREERS_DATA.find((c) => c.id === targetCareerId) || CAREERS_DATA[0];

  let totalWeightedPoints = 0;
  let matchedWeightedPoints = 0;

  const strongMatches: SkillGapDetail[] = [];
  const partialMatches: SkillGapDetail[] = [];
  const missingSkills: SkillGapDetail[] = [];
  const allEvaluatedSkills: SkillGapDetail[] = [];

  // Map student skills for fast case-insensitive lookup
  const studentSkillsMap = new Map<string, StudentSkill>();
  studentSkills.forEach((s) => {
    studentSkillsMap.set(s.skill_id.toLowerCase(), s);
    studentSkillsMap.set(s.skill_name.toLowerCase(), s);
  });

  career.skills.forEach((reqSkill) => {
    const skillLib = SKILLS_LIBRARY[reqSkill.skill_id] || {
      category: 'Core CS',
      prerequisites: [],
      typical_hours: 30,
      description: reqSkill.why_relevant,
    };

    const maxContrib = reqSkill.weight * 10;
    totalWeightedPoints += maxContrib;

    const matchedStudentSkill =
      studentSkillsMap.get(reqSkill.skill_id.toLowerCase()) ||
      studentSkillsMap.get(reqSkill.skill_name.toLowerCase());

    let status: 'Strong Match' | 'Partial Match' | 'Missing';
    let scoreContribution = 0;
    let studentProficiency: ProficiencyLevel | undefined;

    if (!matchedStudentSkill) {
      status = 'Missing';
      scoreContribution = 0;
    } else {
      studentProficiency = matchedStudentSkill.proficiency;
      const studentScore = PROFICIENCY_SCORES[studentProficiency] || 1;
      const requiredScore = PROFICIENCY_SCORES[reqSkill.required_level] || 2;

      if (studentScore >= requiredScore) {
        status = 'Strong Match';
        scoreContribution = maxContrib; // 100% of weight points
      } else {
        status = 'Partial Match';
        // Partial credit: (studentScore / requiredScore) of weight points (e.g. 50% or 66%)
        const fraction = studentScore / requiredScore;
        scoreContribution = Math.round(maxContrib * fraction);
      }
    }

    matchedWeightedPoints += scoreContribution;

    // Determine recommended learning order: Core tech first, then tools, then supporting, then soft skills
    let orderPriority = 1;
    if (reqSkill.category_group === 'core_tech') orderPriority = 1;
    else if (reqSkill.category_group === 'tools') orderPriority = 2;
    else if (reqSkill.category_group === 'supporting_tech') orderPriority = 3;
    else orderPriority = 4;

    const detail: SkillGapDetail = {
      skill_id: reqSkill.skill_id,
      name: reqSkill.skill_name,
      category: skillLib.category,
      category_group: reqSkill.category_group,
      required_level: reqSkill.required_level,
      student_level: studentProficiency,
      status,
      weight: reqSkill.weight,
      score_contribution: scoreContribution,
      max_contribution: maxContrib,
      why_relevant: reqSkill.why_relevant,
      difficulty: reqSkill.required_level,
      prerequisites: skillLib.prerequisites || [],
      recommended_learning_order: orderPriority,
      suggested_practice: reqSkill.suggested_practice,
      suggested_project: reqSkill.suggested_project,
    };

    allEvaluatedSkills.push(detail);

    if (status === 'Strong Match') {
      strongMatches.push(detail);
    } else if (status === 'Partial Match') {
      partialMatches.push(detail);
    } else {
      missingSkills.push(detail);
    }
  });

  // Calculate percentage
  const overallPercentage = totalWeightedPoints > 0
    ? Math.round((matchedWeightedPoints / totalWeightedPoints) * 100)
    : 0;

  // Generate dynamic "Next 3 Steps" based on priority gaps
  const nextThreeSteps = generateNextThreeSteps(missingSkills, partialMatches, career);

  // Calculate alignment status (User Request Section 3 & 4)
  let careerAlignmentStatus: CareerAlignmentStatus;
  let statusColor: 'green' | 'yellow' | 'red';
  let statusExplanation: string;

  if (overallPercentage >= 70) {
    careerAlignmentStatus = 'Good skill alignment';
    statusColor = 'green';
    statusExplanation = `Your current skill profile shows strong alignment with ${career.name}. Complete recommended projects and interview drills to reach peak competitive readiness.`;
  } else if (overallPercentage >= 40) {
    careerAlignmentStatus = 'Possible with additional preparation';
    statusColor = 'yellow';
    statusExplanation = `You have foundational skills relevant to ${career.name}, but key tool proficiencies and intermediate concepts need structured preparation.`;
  } else {
    careerAlignmentStatus = 'Significant skill gaps';
    statusColor = 'red';
    statusExplanation = `Multiple core competencies required for ${career.name} have not yet been acquired. Work systematically starting from Phase 1 fundamentals.`;
  }

  // Recommended projects matching this career or generic fallback
  const matchingProjects = INITIAL_PROJECT_RECOMMENDATIONS.filter(
    (p) => p.target_career.toLowerCase() === career.name.toLowerCase()
  );
  const projectsRecommended: ProjectRecommendation[] = matchingProjects.length > 0
    ? matchingProjects
    : [
        {
          id: `proj-${career.id}-1`,
          title: `${career.name} Core Implementation Capstone`,
          problem_statement: `Build an industry-aligned project integrating ${career.skills.slice(0, 3).map((s) => s.skill_name).join(', ')}.`,
          skills_practiced: career.skills.slice(0, 4).map((s) => s.skill_name),
          target_career: career.name,
          difficulty: 'Intermediate',
          key_features: [
            'Architect scalable modular structure',
            'Integrate database and API connectivity',
            'Handle edge cases and comprehensive error logging',
            'Document architecture and deployment steps in README',
          ],
          suggested_technologies: career.typical_project_skills.slice(0, 4),
          expected_learning_outcome: `Tangible portfolio evidence of ${career.name} technical competency.`,
          estimated_days: 7,
          portfolio_impact: 'High',
        },
      ];

  // Recommended additional skills from preferred or tools
  const recommendedAdditional = career.preferred_skills && career.preferred_skills.length > 0
    ? career.preferred_skills
    : career.important_tools && career.important_tools.length > 0
      ? career.important_tools
      : ['Git & GitHub', 'Agile/Scrum', 'CI/CD Pipelines'];

  const practicalExperienceNeeded = career.practical_experience_needed ||
    'Hands-on practice solving real problem sets, completing capstone projects, and reviewing code in repositories.';

  return {
    career_id: career.id,
    career_name: career.name,
    student_id: studentId,
    analysis_date: new Date().toISOString(),
    overall_match_percentage: overallPercentage,
    matched_weighted_points: matchedWeightedPoints,
    total_weighted_points: totalWeightedPoints,
    strong_matches_count: strongMatches.length,
    partial_matches_count: partialMatches.length,
    missing_skills_count: missingSkills.length,
    strong_matches: strongMatches,
    partial_matches: partialMatches,
    missing_skills: missingSkills,
    all_evaluated_skills: allEvaluatedSkills,
    next_three_steps: nextThreeSteps,

    // User Section 4 Structured Separation:
    skills_already_have: strongMatches,
    skills_need_improvement: partialMatches,
    skills_missing: missingSkills,
    recommended_additional_skills: recommendedAdditional,
    practical_experience_needed: practicalExperienceNeeded,
    projects_recommended: projectsRecommended,
    interview_preparation_needed: career.interview_topics || [],

    // Alignment evaluation
    career_alignment_status: careerAlignmentStatus,
    status_color: statusColor,
    status_explanation: statusExplanation,

    methodology: {
      formula: 'Skill Match % = (Sum of Earned Weighted Points / Total Required Weighted Points) × 100',
      weights_explanation: 'Skills are categorized by industry framework necessity: Core Technical = Weight 3 (30 pts max), Supporting Technical & Tools = Weight 2 (20 pts max), Soft Skills = Weight 1 or 2 (10-20 pts max).',
      partial_credit_rule: 'Strong Match earns 100% of weighted points. Partial Match (e.g. Beginner when Intermediate is required) earns proportionate credit based on level gap (50% to 67%). Missing skills earn 0 points.',
    },
  };
}

/**
 * Generates actionable "Next 3 Steps" personalized to the student's actual skill gaps
 */
function generateNextThreeSteps(
  missing: SkillGapDetail[],
  partial: SkillGapDetail[],
  career: Career
): NextStepItem[] {
  const steps: NextStepItem[] = [];

  // Step 1: Address highest priority partial or missing core technical skill
  const priorityCore =
    partial.find((p) => p.category_group === 'core_tech') ||
    missing.find((m) => m.category_group === 'core_tech');

  if (priorityCore) {
    steps.push({
      id: 'step-1',
      step_number: 1,
      title: priorityCore.status === 'Partial Match'
        ? `Advance ${priorityCore.name} to ${priorityCore.required_level}`
        : `Master ${priorityCore.name} Fundamentals`,
      skill_name: priorityCore.name,
      description: priorityCore.suggested_practice,
      action_type: 'practice',
      target_url: 'practice',
    });
  } else if (missing.length > 0) {
    steps.push({
      id: 'step-1',
      step_number: 1,
      title: `Start Learning ${missing[0].name}`,
      skill_name: missing[0].name,
      description: missing[0].suggested_practice,
      action_type: 'learn',
      target_url: 'roadmap',
    });
  } else {
    steps.push({
      id: 'step-1',
      step_number: 1,
      title: `Review Core Fundamentals for ${career.name}`,
      skill_name: 'Core Review',
      description: 'Solidify your grasp on primary theoretical and practical concepts.',
      action_type: 'practice',
      target_url: 'practice',
    });
  }

  // Step 2: Essential Tool or Supporting Technical Skill
  const priorityTool =
    missing.find((m) => m.category_group === 'tools' || m.category_group === 'supporting_tech') ||
    partial.find((p) => p.category_group === 'tools') ||
    missing[1] ||
    partial[0];

  if (priorityTool) {
    steps.push({
      id: 'step-2',
      step_number: 2,
      title: `Hands-on Practice with ${priorityTool.name}`,
      skill_name: priorityTool.name,
      description: priorityTool.suggested_practice,
      action_type: 'practice',
      target_url: 'practice',
    });
  } else {
    steps.push({
      id: 'step-2',
      step_number: 2,
      title: 'Practice Applied Technical Challenges',
      skill_name: 'Applied Problems',
      description: 'Work through interactive drills in our AI Practice Center.',
      action_type: 'practice',
      target_url: 'practice',
    });
  }

  // Step 3: Capstone or Portfolio Project
  const projectSkill = missing[0] || partial[0] || career.skills[0];
  steps.push({
    id: 'step-3',
    step_number: 3,
    title: `Build Project: ${projectSkill.suggested_project}`,
    skill_name: projectSkill.name,
    description: `Synthesize your skills into a tangible resume proof-of-work project: ${projectSkill.suggested_project}.`,
    action_type: 'project',
    target_url: 'projects',
  });

  return steps;
}
