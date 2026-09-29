import { RoadmapPhase, RoadmapItem, SkillGapAnalysisResult, Career } from '../types';
import { SKILLS_LIBRARY } from '../data/skillsLibrary';

export function generatePersonalizedRoadmap(
  analysis: SkillGapAnalysisResult,
  career: Career,
  existingRoadmapItems?: RoadmapItem[]
): RoadmapPhase[] {
  // Check if we already have roadmap item states to preserve (e.g. In Progress, Completed)
  const existingStatusMap = new Map<string, RoadmapItem>();
  if (existingRoadmapItems) {
    existingRoadmapItems.forEach((item) => {
      existingStatusMap.set(item.skill_id, item);
    });
  }

  // The roadmap is customized dynamically based on the student's missing and partial skills!
  const needsWork = [...analysis.partial_matches, ...analysis.missing_skills];

  // Group needsWork into Fundamentals, Core, and Advanced
  const phase1Items: RoadmapItem[] = [];
  const phase2Items: RoadmapItem[] = [];
  const phase3Items: RoadmapItem[] = [];
  const phase4Items: RoadmapItem[] = [];
  const phase5Items: RoadmapItem[] = [];

  // Phase 1: Fundamentals (Beginner skills or foundational prerequisites missing)
  const fundamentalSkills = needsWork.filter(
    (s) => s.difficulty === 'Beginner' || s.student_level === 'Beginner'
  );

  // Phase 2: Core Skills (Intermediate core tech, tools, and supporting tech)
  const coreSkills = needsWork.filter(
    (s) => (s.difficulty === 'Intermediate' || s.category_group === 'core_tech' || s.category_group === 'tools') && !fundamentalSkills.includes(s)
  );

  // Phase 3: Advanced Skills (Advanced skills, cloud, scalability, specialized ML/DS)
  const advancedSkills = needsWork.filter(
    (s) => s.difficulty === 'Advanced' || (!fundamentalSkills.includes(s) && !coreSkills.includes(s))
  );

  // If student already has most skills, ensure at least one enrichment item is added so roadmap is never empty
  if (fundamentalSkills.length === 0 && coreSkills.length === 0 && advancedSkills.length === 0) {
    analysis.strong_matches.slice(0, 2).forEach((match) => {
      coreSkills.push(match);
    });
  }

  // Populate Phase 1 items
  (fundamentalSkills.length > 0 ? fundamentalSkills : needsWork.slice(0, 2)).forEach((skill, idx) => {
    const existing = existingStatusMap.get(skill.skill_id);
    const lib = SKILLS_LIBRARY[skill.skill_id];
    phase1Items.push({
      id: `phase1-${skill.skill_id}`,
      student_id: analysis.student_id,
      skill_id: skill.skill_id,
      skill_name: skill.name,
      phase_id: 1,
      phase_name: 'Phase 1 – Fundamentals',
      level: 'Beginner',
      prerequisites: lib?.prerequisites || ['Basic Computer Literacy'],
      estimated_hours: lib?.typical_hours ? Math.round(lib.typical_hours * 0.6) : 20,
      practice_task: skill.suggested_practice || `Master introductory syntax and key mechanics for ${skill.name}.`,
      mini_project: `Foundational drill: Build a minimal standalone demonstration using ${skill.name}.`,
      status: existing?.status || (skill.status === 'Partial Match' ? 'In Progress' : 'Not Started'),
      completed_at: existing?.completed_at,
    });
  });

  // Populate Phase 2 items
  (coreSkills.length > 0 ? coreSkills : needsWork.slice(2, 4)).forEach((skill, idx) => {
    const existing = existingStatusMap.get(skill.skill_id);
    const lib = SKILLS_LIBRARY[skill.skill_id];
    phase2Items.push({
      id: `phase2-${skill.skill_id}`,
      student_id: analysis.student_id,
      skill_id: skill.skill_id,
      skill_name: skill.name,
      phase_id: 2,
      phase_name: 'Phase 2 – Core Skills',
      level: 'Intermediate',
      prerequisites: [skill.prerequisites[0] || 'Phase 1 Fundamentals'],
      estimated_hours: lib?.typical_hours || 35,
      practice_task: skill.suggested_practice || `Implement intermediate workflows and multi-step pipelines for ${skill.name}.`,
      mini_project: skill.suggested_project || `Intermediate Capstone with ${skill.name}`,
      status: existing?.status || 'Not Started',
      completed_at: existing?.completed_at,
    });
  });

  // Populate Phase 3 items
  (advancedSkills.length > 0 ? advancedSkills : needsWork.slice(4, 6)).forEach((skill, idx) => {
    const existing = existingStatusMap.get(skill.skill_id);
    const lib = SKILLS_LIBRARY[skill.skill_id];
    phase3Items.push({
      id: `phase3-${skill.skill_id}`,
      student_id: analysis.student_id,
      skill_id: skill.skill_id,
      skill_name: skill.name,
      phase_id: 3,
      phase_name: 'Phase 3 – Advanced Skills',
      level: 'Advanced',
      prerequisites: ['Phase 2 Core Skills Mastery'],
      estimated_hours: lib?.typical_hours ? Math.round(lib.typical_hours * 1.2) : 45,
      practice_task: `High-scale optimization, performance profiling, and production edge cases in ${skill.name}.`,
      mini_project: `Production-ready architectural implementation leveraging ${skill.name}.`,
      status: existing?.status || 'Not Started',
      completed_at: existing?.completed_at,
    });
  });

  // Phase 4: Capstone Projects (Target career specific, tailored to gaps)
  career.typical_project_skills.slice(0, 2).forEach((projSkill, idx) => {
    const existing = existingStatusMap.get(`project-item-${idx}`);
    phase4Items.push({
      id: `phase4-project-${idx}`,
      student_id: analysis.student_id,
      skill_id: `project-item-${idx}`,
      skill_name: `${career.name} Capstone Portfolio: Part ${idx + 1}`,
      phase_id: 4,
      phase_name: 'Phase 4 – Projects',
      level: 'Intermediate',
      prerequisites: ['Phase 1 & 2 Completion'],
      estimated_hours: 40,
      practice_task: `Integrate ${projSkill} into a unified production repository with README and live demo.`,
      mini_project: `End-to-End ${career.name} Showcase Project incorporating ${projSkill}`,
      status: existing?.status || 'Not Started',
      completed_at: existing?.completed_at,
    });
  });

  // Phase 5: Interview Preparation
  career.interview_topics.slice(0, 3).forEach((topic, idx) => {
    const existing = existingStatusMap.get(`interview-item-${idx}`);
    phase5Items.push({
      id: `phase5-interview-${idx}`,
      student_id: analysis.student_id,
      skill_id: `interview-item-${idx}`,
      skill_name: `Interview Drill: ${topic.slice(0, 38)}...`,
      phase_id: 5,
      phase_name: 'Phase 5 – Interview Preparation',
      level: 'Advanced',
      prerequisites: ['Completed Phase 4 Portfolio Projects'],
      estimated_hours: 15,
      practice_task: `Practice technical explanation and behavioral STAR responses for: ${topic}`,
      mini_project: 'AI Mock Interview Simulator Complete Session (Technical + Behavioral)',
      status: existing?.status || 'Not Started',
      completed_at: existing?.completed_at,
    });
  });

  return [
    {
      phase_id: 1,
      title: 'Phase 1 – Fundamentals',
      subtitle: 'Foundational Knowledge & Syntax',
      description: 'Close basic prerequisite gaps and ensure solid programming and mathematical instincts.',
      items: phase1Items,
    },
    {
      phase_id: 2,
      title: 'Phase 2 – Core Skills',
      subtitle: 'Primary Industry Technologies',
      description: 'Master the high-weight tools and libraries demanded daily by employers in this domain.',
      items: phase2Items,
    },
    {
      phase_id: 3,
      title: 'Phase 3 – Advanced Skills',
      subtitle: 'Scalability, Architecture & Edge Cases',
      description: 'Learn performance profiling, advanced frameworks, and clean modular development.',
      items: phase3Items,
    },
    {
      phase_id: 4,
      title: 'Phase 4 – Projects',
      subtitle: 'Portfolio Proof-of-Work',
      description: 'Synthesize your competencies into real GitHub portfolio repositories with live demos.',
      items: phase4Items,
    },
    {
      phase_id: 5,
      title: 'Phase 5 – Interview Preparation',
      subtitle: 'Technical Drills & Behavioral Readiness',
      description: 'Rehearse realistic technical questions, system design trade-offs, and STAR scenarios.',
      items: phase5Items,
    },
  ];
}
