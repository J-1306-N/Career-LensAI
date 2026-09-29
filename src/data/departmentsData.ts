/**
 * Centralized Academic Departments & Specializations Data Layer
 * Covers Engineering, Computing, Science, Commerce, Management, and Humanities.
 */

import { DegreeCategory } from './degreesData';

export interface DepartmentRecord {
  id: string;
  name: string;
  category: DegreeCategory;
  discipline: string;
  typicalDegrees: string[];
}

export const DEPARTMENT_RECORDS: DepartmentRecord[] = [
  // Computer Science & IT Specializations
  {
    id: 'dept-cs',
    name: 'Computer Science',
    category: 'Arts & Science',
    discipline: 'Computing Sciences',
    typicalDegrees: ['B.Sc', 'M.Sc', 'MCA', 'B.Tech', 'BE'],
  },
  {
    id: 'dept-cs-ds',
    name: 'Computer Science with Data Science',
    category: 'Arts & Science',
    discipline: 'Computing Sciences',
    typicalDegrees: ['B.Sc', 'M.Sc', 'B.Tech'],
  },
  {
    id: 'dept-ds',
    name: 'Data Science',
    category: 'Arts & Science',
    discipline: 'Data Analytics',
    typicalDegrees: ['B.Sc', 'M.Sc', 'B.Tech', 'BCA'],
  },
  {
    id: 'dept-it',
    name: 'Information Technology',
    category: 'Arts & Science',
    discipline: 'Computing Sciences',
    typicalDegrees: ['B.Sc', 'M.Sc', 'B.Tech'],
  },
  {
    id: 'dept-ai',
    name: 'Artificial Intelligence',
    category: 'Arts & Science',
    discipline: 'AI & Data Systems',
    typicalDegrees: ['B.Sc', 'M.Sc', 'BCA', 'B.Tech'],
  },
  {
    id: 'dept-aids',
    name: 'Artificial Intelligence and Data Science (AI & DS)',
    category: 'Engineering & Technology',
    discipline: 'AI & Data Systems',
    typicalDegrees: ['B.Tech', 'BE'],
  },
  {
    id: 'dept-cyber',
    name: 'Cyber Security',
    category: 'Engineering & Technology',
    discipline: 'Information Security',
    typicalDegrees: ['B.Sc', 'BCA', 'B.Tech', 'M.Sc'],
  },
  {
    id: 'dept-se',
    name: 'Software Engineering',
    category: 'Engineering & Technology',
    discipline: 'Software Architecture',
    typicalDegrees: ['B.Tech', 'BE', 'M.Sc Integrated'],
  },
  {
    id: 'dept-ca',
    name: 'Computer Applications',
    category: 'Computer Applications',
    discipline: 'Software Applications',
    typicalDegrees: ['BCA', 'MCA'],
  },
  {
    id: 'dept-ct',
    name: 'Computer Technology',
    category: 'Arts & Science',
    discipline: 'Hardware & Computing',
    typicalDegrees: ['B.Sc'],
  },
  {
    id: 'dept-cognitive',
    name: 'Cognitive Systems',
    category: 'Arts & Science',
    discipline: 'Cognitive Computing',
    typicalDegrees: ['B.Sc'],
  },

  // Engineering Core
  {
    id: 'dept-ece',
    name: 'Electronics and Communication Engineering (ECE)',
    category: 'Engineering & Technology',
    discipline: 'Electrical Sciences',
    typicalDegrees: ['BE', 'B.Tech', 'M.E', 'M.Tech'],
  },
  {
    id: 'dept-eee',
    name: 'Electrical and Electronics Engineering (EEE)',
    category: 'Engineering & Technology',
    discipline: 'Electrical Sciences',
    typicalDegrees: ['BE', 'B.Tech', 'M.E'],
  },
  {
    id: 'dept-mech',
    name: 'Mechanical Engineering',
    category: 'Engineering & Technology',
    discipline: 'Mechanical Sciences',
    typicalDegrees: ['BE', 'B.Tech', 'M.E'],
  },
  {
    id: 'dept-civil',
    name: 'Civil Engineering',
    category: 'Engineering & Technology',
    discipline: 'Infrastructure & Civil',
    typicalDegrees: ['BE', 'B.Tech', 'M.E'],
  },
  {
    id: 'dept-biotech-eng',
    name: 'Biotechnology',
    category: 'Engineering & Technology',
    discipline: 'Bio-Sciences',
    typicalDegrees: ['B.Tech', 'B.Sc', 'M.Sc', 'M.Tech'],
  },
  {
    id: 'dept-bioinfo',
    name: 'Bioinformatics',
    category: 'Arts & Science',
    discipline: 'Computational Biology',
    typicalDegrees: ['B.Sc', 'M.Sc'],
  },
  {
    id: 'dept-biomed',
    name: 'Biomedical Engineering',
    category: 'Engineering & Technology',
    discipline: 'Medical Technology',
    typicalDegrees: ['BE', 'B.Tech'],
  },
  {
    id: 'dept-robotics',
    name: 'Robotics and Automation',
    category: 'Engineering & Technology',
    discipline: 'Autonomous Systems',
    typicalDegrees: ['BE', 'B.Tech'],
  },
  {
    id: 'dept-mechatronics',
    name: 'Mechatronics Engineering',
    category: 'Engineering & Technology',
    discipline: 'Integrated Engineering',
    typicalDegrees: ['BE', 'B.Tech'],
  },
  {
    id: 'dept-chem-eng',
    name: 'Chemical Engineering',
    category: 'Engineering & Technology',
    discipline: 'Process Sciences',
    typicalDegrees: ['B.Tech', 'BE'],
  },
  {
    id: 'dept-aero',
    name: 'Aeronautical Engineering',
    category: 'Engineering & Technology',
    discipline: 'Aerospace',
    typicalDegrees: ['BE', 'B.Tech'],
  },

  // Basic Sciences
  {
    id: 'dept-maths',
    name: 'Mathematics',
    category: 'Arts & Science',
    discipline: 'Mathematical Sciences',
    typicalDegrees: ['B.Sc', 'M.Sc'],
  },
  {
    id: 'dept-stats',
    name: 'Statistics',
    category: 'Arts & Science',
    discipline: 'Statistical Sciences',
    typicalDegrees: ['B.Sc', 'M.Sc'],
  },
  {
    id: 'dept-physics',
    name: 'Physics',
    category: 'Arts & Science',
    discipline: 'Physical Sciences',
    typicalDegrees: ['B.Sc', 'M.Sc'],
  },
  {
    id: 'dept-chem',
    name: 'Chemistry',
    category: 'Arts & Science',
    discipline: 'Chemical Sciences',
    typicalDegrees: ['B.Sc', 'M.Sc'],
  },

  // Commerce & Management
  {
    id: 'dept-comm',
    name: 'Commerce',
    category: 'Commerce',
    discipline: 'Financial Accounting & Trade',
    typicalDegrees: ['B.Com', 'M.Com'],
  },
  {
    id: 'dept-comm-ca',
    name: 'Commerce with Computer Applications (B.Com CA)',
    category: 'Commerce',
    discipline: 'Business Computing',
    typicalDegrees: ['B.Com'],
  },
  {
    id: 'dept-comm-pa',
    name: 'Commerce with Professional Accounting (B.Com PA)',
    category: 'Commerce',
    discipline: 'Auditing & Accounting',
    typicalDegrees: ['B.Com'],
  },
  {
    id: 'dept-corp-sec',
    name: 'Corporate Secretaryship',
    category: 'Commerce',
    discipline: 'Corporate Governance',
    typicalDegrees: ['B.Com', 'M.Com'],
  },
  {
    id: 'dept-acc-fin',
    name: 'Accounting and Finance',
    category: 'Commerce',
    discipline: 'Financial Management',
    typicalDegrees: ['B.Com', 'M.Com'],
  },
  {
    id: 'dept-bba',
    name: 'Business Administration (BBA)',
    category: 'Management',
    discipline: 'Corporate Management',
    typicalDegrees: ['BBA'],
  },
  {
    id: 'dept-mgmt-mba',
    name: 'Management Studies (MBA)',
    category: 'Management',
    discipline: 'Strategic Management',
    typicalDegrees: ['MBA'],
  },

  // Humanities & Social Sciences
  {
    id: 'dept-econ',
    name: 'Economics',
    category: 'Arts & Science',
    discipline: 'Economic Sciences',
    typicalDegrees: ['BA', 'MA', 'B.Sc'],
  },
  {
    id: 'dept-eng-lit',
    name: 'English Literature',
    category: 'Arts & Science',
    discipline: 'Languages & Literature',
    typicalDegrees: ['BA', 'MA'],
  },
  {
    id: 'dept-tamil-lit',
    name: 'Tamil Literature',
    category: 'Arts & Science',
    discipline: 'Languages & Literature',
    typicalDegrees: ['BA', 'MA'],
  },
  {
    id: 'dept-psych',
    name: 'Psychology',
    category: 'Arts & Science',
    discipline: 'Behavioral Sciences',
    typicalDegrees: ['B.Sc', 'M.Sc', 'BA', 'MA'],
  },
  {
    id: 'dept-viscom',
    name: 'Visual Communication',
    category: 'Design & Humanities',
    discipline: 'Media & Design',
    typicalDegrees: ['B.Sc', 'M.Sc'],
  },
  {
    id: 'dept-journalism',
    name: 'Journalism and Mass Communication',
    category: 'Design & Humanities',
    discipline: 'Media & Communication',
    typicalDegrees: ['BA', 'MA', 'B.Sc'],
  },
];

export const DEPARTMENTS_DATA: string[] = DEPARTMENT_RECORDS.map((d) => d.name);

export function getDepartmentRecord(nameOrQuery: string): DepartmentRecord | null {
  if (!nameOrQuery) return null;
  const clean = nameOrQuery.trim().toLowerCase();
  return (
    DEPARTMENT_RECORDS.find(
      (d) =>
        d.id.toLowerCase() === clean ||
        d.name.toLowerCase() === clean ||
        d.name.toLowerCase().includes(clean)
    ) || null
  );
}
