/**
 * Centralized Industry Certifications Data Layer
 * Mapped to career roles and target competencies
 */

export interface IndustryCertification {
  id: string;
  name: string;
  issuer: string;
  level: 'Foundational' | 'Associate' | 'Professional' | 'Specialty';
  relevantCareerRoles: string[]; // career IDs
  relevantSkills: string[];
  estimatedPrepWeeks: number;
  officialUrl?: string;
  description: string;
}

export const CERTIFICATIONS_DATA: IndustryCertification[] = [
  {
    id: 'pl-300-powerbi',
    name: 'Microsoft Certified: Power BI Data Analyst Associate (PL-300)',
    issuer: 'Microsoft',
    level: 'Associate',
    relevantCareerRoles: ['data-analyst', 'business-intelligence-analyst', 'analytics-engineer'],
    relevantSkills: ['powerbi', 'sql', 'dax', 'data_modeling'],
    estimatedPrepWeeks: 8,
    officialUrl: 'https://learn.microsoft.com/certifications/power-bi-data-analyst-associate/',
    description: 'Demonstrates ability to deliver actionable insights by working with available data and applying domain expertise in Power BI.',
  },
  {
    id: 'google-data-analytics',
    name: 'Google Data Analytics Professional Certificate',
    issuer: 'Google',
    level: 'Foundational',
    relevantCareerRoles: ['data-analyst', 'business-analyst'],
    relevantSkills: ['sql', 'spreadsheets', 'tableau', 'r_programming', 'data_cleaning'],
    estimatedPrepWeeks: 12,
    officialUrl: 'https://grow.google/certificates/data-analytics/',
    description: 'Covers key analytical skills including data cleaning, problem solving, critical thinking, data ethics, and data visualization.',
  },
  {
    id: 'aws-cloud-practitioner',
    name: 'AWS Certified Cloud Practitioner (CLF-C02)',
    issuer: 'Amazon Web Services',
    level: 'Foundational',
    relevantCareerRoles: ['cloud-engineer', 'devops-engineer', 'software-developer', 'solutions-architect'],
    relevantSkills: ['aws', 'cloud_computing', 'cloud_security', 'devops'],
    estimatedPrepWeeks: 4,
    officialUrl: 'https://aws.amazon.com/certification/certified-cloud-practitioner/',
    description: 'Validates overall understanding of AWS Cloud concepts, services, and terminology for technical and non-technical roles.',
  },
  {
    id: 'aws-solutions-architect-assoc',
    name: 'AWS Certified Solutions Architect – Associate (SAA-C03)',
    issuer: 'Amazon Web Services',
    level: 'Associate',
    relevantCareerRoles: ['cloud-engineer', 'solutions-architect', 'backend-developer', 'devops-engineer'],
    relevantSkills: ['aws', 'cloud_architecture', 'vpc', 's3', 'ec2', 'lambda'],
    estimatedPrepWeeks: 10,
    officialUrl: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
    description: 'Validates ability to design and implement distributed systems on AWS that are secure, robust, and cost-effective.',
  },
  {
    id: 'meta-frontend-dev',
    name: 'Meta Front-End Developer Professional Certificate',
    issuer: 'Meta',
    level: 'Associate',
    relevantCareerRoles: ['frontend-developer', 'web-developer', 'react-developer', 'full-stack-developer'],
    relevantSkills: ['javascript', 'react', 'html_css', 'ui_ux_design', 'version_control'],
    estimatedPrepWeeks: 12,
    officialUrl: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
    description: 'Teaches how to create user interfaces, manage state in React, utilize CSS frameworks, and master JavaScript algorithms.',
  },
  {
    id: 'google-prof-data-engineer',
    name: 'Google Cloud Professional Data Engineer',
    issuer: 'Google Cloud',
    level: 'Professional',
    relevantCareerRoles: ['data-engineer', 'data-scientist', 'analytics-engineer'],
    relevantSkills: ['bigquery', 'dataflow', 'sql', 'python', 'cloud_pipelines'],
    estimatedPrepWeeks: 14,
    officialUrl: 'https://cloud.google.com/learn/certification/data-engineer',
    description: 'Enables data-driven decision making by collecting, transforming, and publishing data on Google Cloud.',
  },
  {
    id: 'comptia-security-plus',
    name: 'CompTIA Security+ (SY0-701)',
    issuer: 'CompTIA',
    level: 'Foundational',
    relevantCareerRoles: ['cyber-security-analyst', 'soc-analyst', 'network-security-engineer'],
    relevantSkills: ['cyber_security', 'threat_intelligence', 'network_security', 'cryptography'],
    estimatedPrepWeeks: 8,
    officialUrl: 'https://www.comptia.org/certifications/security',
    description: 'Global benchmark for foundational cybersecurity knowledge covering threats, vulnerabilities, architecture, and incident response.',
  },
  {
    id: 'pcap-python',
    name: 'PCAP – Certified Associate in Python Programming',
    issuer: 'Python Institute',
    level: 'Associate',
    relevantCareerRoles: ['python-developer', 'backend-developer', 'software-engineer', 'data-analyst'],
    relevantSkills: ['python', 'oop', 'data_structures', 'file_handling', 'algorithms'],
    estimatedPrepWeeks: 6,
    officialUrl: 'https://pythoninstitute.org/pcap',
    description: 'Demonstrates proficiency in Python object-oriented programming, data structures, exceptions, and core standard library modules.',
  },
];

/**
 * Returns certifications that match a target career ID or skill list
 */
export function getCertificationsForCareer(careerId: string): IndustryCertification[] {
  const cleanId = careerId.toLowerCase();
  return CERTIFICATIONS_DATA.filter((cert) =>
    cert.relevantCareerRoles.some((role) => role.includes(cleanId) || cleanId.includes(role))
  );
}
