import { Career, CareerSkill } from '../types';
import { CareerFramework, CAREER_FRAMEWORKS, mapDomainToFilter, CareerDomain } from '../data/careerFrameworksData';

/**
 * Converts a structured CareerFramework into a full Career model
 * with weighted competencies for the Skill Gap Engine and Roadmap generator.
 */
export function convertFrameworkToCareer(framework: CareerFramework): Career {
  const skills: CareerSkill[] = [];

  // 1. Core Technical Skills (Weight 3, Critical)
  framework.coreSkills.forEach((skillName) => {
    const id = skillName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    skills.push({
      career_id: framework.id,
      skill_id: id,
      skill_name: skillName,
      importance: 'Critical',
      weight: 3,
      required_level: 'Intermediate',
      category_group: 'core_tech',
      why_relevant: `${skillName} is a foundational requirement in ${framework.title} industry frameworks for core solution design and implementation.`,
      suggested_practice: `Complete practical projects and hands-on coding drills focusing on ${skillName}.`,
      suggested_project: `${framework.title} Portfolio Project with ${skillName}`,
    });
  });

  // 2. Supporting Technical Skills (Weight 2, Important)
  framework.supportingSkills.forEach((skillName) => {
    const id = skillName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    skills.push({
      career_id: framework.id,
      skill_id: id,
      skill_name: skillName,
      importance: 'Important',
      weight: 2,
      required_level: 'Intermediate',
      category_group: 'supporting_tech',
      why_relevant: `${skillName} complements core duties by streamlining system robustness, integration, and collaboration.`,
      suggested_practice: `Review standard patterns, write integration tests, and build supporting modules using ${skillName}.`,
      suggested_project: `System Integration Module utilizing ${skillName}`,
    });
  });

  // 3. Tools (Weight 2, Important)
  framework.tools.slice(0, 4).forEach((toolName) => {
    const id = toolName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    skills.push({
      career_id: framework.id,
      skill_id: id,
      skill_name: toolName,
      importance: 'Important',
      weight: 2,
      required_level: 'Beginner',
      category_group: 'tools',
      why_relevant: `Proficiency in ${toolName} accelerates development workflows and aligns with industry toolchains.`,
      suggested_practice: `Setup local configuration, automate tasks, and configure workflows using ${toolName}.`,
      suggested_project: `Automated Pipeline & Workspace with ${toolName}`,
    });
  });

  // 4. Soft & Communication Skills (Weight 1, Bonus)
  skills.push({
    career_id: framework.id,
    skill_id: 'technical_communication',
    skill_name: 'Technical Communication & Collaboration',
    importance: 'Bonus',
    weight: 1,
    required_level: 'Intermediate',
    category_group: 'soft_skills',
    why_relevant: 'Explaining design decisions, conducting code reviews, and writing clear documentation for cross-functional teams.',
    suggested_practice: 'Present architectural ideas in tech retrospectives and document API schemas.',
    suggested_project: 'Technical Design Specification Document',
  });

  return {
    id: framework.id,
    name: framework.title,
    domain: framework.domain,
    tagline: framework.description,
    description: framework.description,
    typical_roles: [
      framework.title,
      `Associate ${framework.title}`,
      `Senior ${framework.title}`,
      `${framework.domain} Specialist`,
    ],
    responsibilities: [
      `Apply ${framework.coreSkills.slice(0, 2).join(' and ')} to architect production solutions`,
      `Leverage tools like ${framework.tools.slice(0, 3).join(', ')} to automate workflows`,
      `Continuously integrate best practices across ${framework.intermediateSkills.slice(0, 2).join(' and ')}`,
      `Prepare technical deliverables and participate in collaborative code/architecture reviews`,
    ],
    skills,
    typical_project_skills: [...framework.coreSkills, ...framework.tools.slice(0, 3)],
    interview_topics: framework.interviewTopics,
  };
}

/**
 * Search and filter career frameworks
 */
export function searchCareerFrameworks(
  query: string,
  domainFilter: CareerDomain = 'All'
): CareerFramework[] {
  const cleanQuery = query.trim().toLowerCase();

  return CAREER_FRAMEWORKS.filter((career) => {
    // 1. Domain Filter
    if (domainFilter !== 'All') {
      const mappedDomain = mapDomainToFilter(career.domain);
      if (mappedDomain !== domainFilter) {
        return false;
      }
    }

    // 2. Text Search Query
    if (!cleanQuery) return true;

    const matchesTitle = career.title.toLowerCase().includes(cleanQuery);
    const matchesDomain = career.domain.toLowerCase().includes(cleanQuery);
    const matchesDesc = career.description.toLowerCase().includes(cleanQuery);
    const matchesCore = career.coreSkills.some((s) => s.toLowerCase().includes(cleanQuery));
    const matchesTools = career.tools.some((t) => t.toLowerCase().includes(cleanQuery));

    return matchesTitle || matchesDomain || matchesDesc || matchesCore || matchesTools;
  });
}

/**
 * Get framework by ID
 */
export function getCareerFrameworkById(id: string): CareerFramework | undefined {
  return CAREER_FRAMEWORKS.find((c) => c.id === id);
}
