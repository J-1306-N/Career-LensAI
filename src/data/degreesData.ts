/**
 * Centralized Degree & Academic Program Data Layer
 * 
 * Strict Academic Integrity:
 * - Each degree defines exact Level, Category, Standard Duration (Years), and Semester Count.
 * - Understands distinction between B.Sc (3 Years / 6 Semesters), B.Tech / BE (4 Years / 8 Semesters),
 *   MCA / M.Sc (2 Years / 4 Semesters), and 5-Year Integrated Programs (5 Years / 10 Semesters).
 * - If unknown/unlisted program: duration defaults to "Program duration not configured".
 */

export type DegreeLevel = 'Undergraduate' | 'Postgraduate' | 'Integrated' | 'Doctoral' | 'Diploma';

export type DegreeCategory =
  | 'Arts & Science'
  | 'Engineering & Technology'
  | 'Computer Applications'
  | 'Commerce'
  | 'Management'
  | 'Law'
  | 'Science & Research'
  | 'Design & Humanities';

export interface DegreeRecord {
  id: string;
  name: string; // Full official program name (e.g., "B.Sc Computer Science")
  shortName: string; // Short code (e.g., "B.Sc CS")
  degreePrefix: string; // Base qualification (e.g., "B.Sc", "BCA", "B.Tech", "BE", "MCA", "M.Sc")
  specialization?: string; // Core discipline/specialization
  level: DegreeLevel;
  category: DegreeCategory;
  standardDurationYears: number; // e.g. 3, 4, 2, 5
  semesterCount: number; // e.g. 6, 8, 4, 10
  academicStructure: string; // e.g. "3 Years / 6 Semesters (CBCS Semester Pattern)"
}

export const DEGREE_RECORDS: DegreeRecord[] = [
  // ==========================================
  // B.Sc Programs (Undergraduate: 3 Years / 6 Semesters)
  // ==========================================
  {
    id: 'bsc-cs',
    name: 'B.Sc Computer Science',
    shortName: 'B.Sc CS',
    degreePrefix: 'B.Sc',
    specialization: 'Computer Science',
    level: 'Undergraduate',
    category: 'Arts & Science',
    standardDurationYears: 3,
    semesterCount: 6,
    academicStructure: '3 Years / 6 Semesters (Semester Pattern)',
  },
  {
    id: 'bsc-ds',
    name: 'B.Sc Data Science',
    shortName: 'B.Sc DS',
    degreePrefix: 'B.Sc',
    specialization: 'Data Science',
    level: 'Undergraduate',
    category: 'Arts & Science',
    standardDurationYears: 3,
    semesterCount: 6,
    academicStructure: '3 Years / 6 Semesters (Semester Pattern)',
  },
  {
    id: 'bsc-cs-ds',
    name: 'B.Sc Computer Science with Data Science',
    shortName: 'B.Sc CS (Data Science)',
    degreePrefix: 'B.Sc',
    specialization: 'Computer Science with Data Science',
    level: 'Undergraduate',
    category: 'Arts & Science',
    standardDurationYears: 3,
    semesterCount: 6,
    academicStructure: '3 Years / 6 Semesters (Semester Pattern)',
  },
  {
    id: 'bsc-it',
    name: 'B.Sc Information Technology',
    shortName: 'B.Sc IT',
    degreePrefix: 'B.Sc',
    specialization: 'Information Technology',
    level: 'Undergraduate',
    category: 'Arts & Science',
    standardDurationYears: 3,
    semesterCount: 6,
    academicStructure: '3 Years / 6 Semesters (Semester Pattern)',
  },
  {
    id: 'bsc-aiml',
    name: 'B.Sc Artificial Intelligence and Machine Learning',
    shortName: 'B.Sc AI & ML',
    degreePrefix: 'B.Sc',
    specialization: 'Artificial Intelligence and Machine Learning',
    level: 'Undergraduate',
    category: 'Arts & Science',
    standardDurationYears: 3,
    semesterCount: 6,
    academicStructure: '3 Years / 6 Semesters (Semester Pattern)',
  },
  {
    id: 'bsc-cyber',
    name: 'B.Sc Cyber Security',
    shortName: 'B.Sc Cyber',
    degreePrefix: 'B.Sc',
    specialization: 'Cyber Security',
    level: 'Undergraduate',
    category: 'Arts & Science',
    standardDurationYears: 3,
    semesterCount: 6,
    academicStructure: '3 Years / 6 Semesters (Semester Pattern)',
  },
  {
    id: 'bsc-ct',
    name: 'B.Sc Computer Technology',
    shortName: 'B.Sc CT',
    degreePrefix: 'B.Sc',
    specialization: 'Computer Technology',
    level: 'Undergraduate',
    category: 'Arts & Science',
    standardDurationYears: 3,
    semesterCount: 6,
    academicStructure: '3 Years / 6 Semesters (Semester Pattern)',
  },
  {
    id: 'bsc-maths',
    name: 'B.Sc Mathematics',
    shortName: 'B.Sc Maths',
    degreePrefix: 'B.Sc',
    specialization: 'Mathematics',
    level: 'Undergraduate',
    category: 'Arts & Science',
    standardDurationYears: 3,
    semesterCount: 6,
    academicStructure: '3 Years / 6 Semesters (Semester Pattern)',
  },
  {
    id: 'bsc-stats',
    name: 'B.Sc Statistics',
    shortName: 'B.Sc Stats',
    degreePrefix: 'B.Sc',
    specialization: 'Statistics',
    level: 'Undergraduate',
    category: 'Arts & Science',
    standardDurationYears: 3,
    semesterCount: 6,
    academicStructure: '3 Years / 6 Semesters (Semester Pattern)',
  },
  {
    id: 'bsc-physics',
    name: 'B.Sc Physics',
    shortName: 'B.Sc Physics',
    degreePrefix: 'B.Sc',
    specialization: 'Physics',
    level: 'Undergraduate',
    category: 'Arts & Science',
    standardDurationYears: 3,
    semesterCount: 6,
    academicStructure: '3 Years / 6 Semesters (Semester Pattern)',
  },
  {
    id: 'bsc-electronics',
    name: 'B.Sc Electronics',
    shortName: 'B.Sc Electronics',
    degreePrefix: 'B.Sc',
    specialization: 'Electronics',
    level: 'Undergraduate',
    category: 'Arts & Science',
    standardDurationYears: 3,
    semesterCount: 6,
    academicStructure: '3 Years / 6 Semesters (Semester Pattern)',
  },
  {
    id: 'bsc-biotech',
    name: 'B.Sc Biotechnology',
    shortName: 'B.Sc Biotech',
    degreePrefix: 'B.Sc',
    specialization: 'Biotechnology',
    level: 'Undergraduate',
    category: 'Arts & Science',
    standardDurationYears: 3,
    semesterCount: 6,
    academicStructure: '3 Years / 6 Semesters (Semester Pattern)',
  },

  // ==========================================
  // BCA Programs (Undergraduate: 3 Years / 6 Semesters)
  // ==========================================
  {
    id: 'bca-general',
    name: 'BCA (Bachelor of Computer Applications)',
    shortName: 'BCA',
    degreePrefix: 'BCA',
    specialization: 'Computer Applications',
    level: 'Undergraduate',
    category: 'Computer Applications',
    standardDurationYears: 3,
    semesterCount: 6,
    academicStructure: '3 Years / 6 Semesters (Semester Pattern)',
  },
  {
    id: 'bca-ds',
    name: 'BCA Data Science',
    shortName: 'BCA DS',
    degreePrefix: 'BCA',
    specialization: 'Data Science',
    level: 'Undergraduate',
    category: 'Computer Applications',
    standardDurationYears: 3,
    semesterCount: 6,
    academicStructure: '3 Years / 6 Semesters (Semester Pattern)',
  },
  {
    id: 'bca-ai',
    name: 'BCA Artificial Intelligence',
    shortName: 'BCA AI',
    degreePrefix: 'BCA',
    specialization: 'Artificial Intelligence',
    level: 'Undergraduate',
    category: 'Computer Applications',
    standardDurationYears: 3,
    semesterCount: 6,
    academicStructure: '3 Years / 6 Semesters (Semester Pattern)',
  },
  {
    id: 'bca-cloud',
    name: 'BCA Cloud Computing',
    shortName: 'BCA Cloud',
    degreePrefix: 'BCA',
    specialization: 'Cloud Computing',
    level: 'Undergraduate',
    category: 'Computer Applications',
    standardDurationYears: 3,
    semesterCount: 6,
    academicStructure: '3 Years / 6 Semesters (Semester Pattern)',
  },
  {
    id: 'bca-cyber',
    name: 'BCA Cyber Security',
    shortName: 'BCA Cyber',
    degreePrefix: 'BCA',
    specialization: 'Cyber Security',
    level: 'Undergraduate',
    category: 'Computer Applications',
    standardDurationYears: 3,
    semesterCount: 6,
    academicStructure: '3 Years / 6 Semesters (Semester Pattern)',
  },

  // ==========================================
  // B.Com & Management Programs (Undergraduate: 3 Years / 6 Semesters)
  // ==========================================
  {
    id: 'bcom-general',
    name: 'B.Com (General)',
    shortName: 'B.Com',
    degreePrefix: 'B.Com',
    specialization: 'General Commerce',
    level: 'Undergraduate',
    category: 'Commerce',
    standardDurationYears: 3,
    semesterCount: 6,
    academicStructure: '3 Years / 6 Semesters (Semester Pattern)',
  },
  {
    id: 'bcom-ca',
    name: 'B.Com Computer Applications (B.Com CA)',
    shortName: 'B.Com CA',
    degreePrefix: 'B.Com',
    specialization: 'Computer Applications',
    level: 'Undergraduate',
    category: 'Commerce',
    standardDurationYears: 3,
    semesterCount: 6,
    academicStructure: '3 Years / 6 Semesters (Semester Pattern)',
  },
  {
    id: 'bcom-it',
    name: 'B.Com Information Technology',
    shortName: 'B.Com IT',
    degreePrefix: 'B.Com',
    specialization: 'Information Technology',
    level: 'Undergraduate',
    category: 'Commerce',
    standardDurationYears: 3,
    semesterCount: 6,
    academicStructure: '3 Years / 6 Semesters (Semester Pattern)',
  },
  {
    id: 'bcom-pa',
    name: 'B.Com Professional Accounting (B.Com PA)',
    shortName: 'B.Com PA',
    degreePrefix: 'B.Com',
    specialization: 'Professional Accounting',
    level: 'Undergraduate',
    category: 'Commerce',
    standardDurationYears: 3,
    semesterCount: 6,
    academicStructure: '3 Years / 6 Semesters (Semester Pattern)',
  },
  {
    id: 'bcom-af',
    name: 'B.Com Accounting and Finance (B.Com A&F)',
    shortName: 'B.Com A&F',
    degreePrefix: 'B.Com',
    specialization: 'Accounting & Finance',
    level: 'Undergraduate',
    category: 'Commerce',
    standardDurationYears: 3,
    semesterCount: 6,
    academicStructure: '3 Years / 6 Semesters (Semester Pattern)',
  },
  {
    id: 'bba-general',
    name: 'BBA (Bachelor of Business Administration)',
    shortName: 'BBA',
    degreePrefix: 'BBA',
    specialization: 'Business Administration',
    level: 'Undergraduate',
    category: 'Management',
    standardDurationYears: 3,
    semesterCount: 6,
    academicStructure: '3 Years / 6 Semesters (Semester Pattern)',
  },
  {
    id: 'bba-ca',
    name: 'BBA Computer Applications',
    shortName: 'BBA CA',
    degreePrefix: 'BBA',
    specialization: 'Computer Applications',
    level: 'Undergraduate',
    category: 'Management',
    standardDurationYears: 3,
    semesterCount: 6,
    academicStructure: '3 Years / 6 Semesters (Semester Pattern)',
  },
  {
    id: 'ba-english',
    name: 'BA English Literature',
    shortName: 'BA English',
    degreePrefix: 'BA',
    specialization: 'English Literature',
    level: 'Undergraduate',
    category: 'Arts & Science',
    standardDurationYears: 3,
    semesterCount: 6,
    academicStructure: '3 Years / 6 Semesters (Semester Pattern)',
  },
  {
    id: 'ba-economics',
    name: 'BA Economics',
    shortName: 'BA Economics',
    degreePrefix: 'BA',
    specialization: 'Economics',
    level: 'Undergraduate',
    category: 'Arts & Science',
    standardDurationYears: 3,
    semesterCount: 6,
    academicStructure: '3 Years / 6 Semesters (Semester Pattern)',
  },

  // ==========================================
  // B.Tech & BE Programs (Undergraduate: 4 Years / 8 Semesters)
  // ==========================================
  {
    id: 'btech-cse',
    name: 'B.Tech Computer Science and Engineering',
    shortName: 'B.Tech CSE',
    degreePrefix: 'B.Tech',
    specialization: 'Computer Science and Engineering',
    level: 'Undergraduate',
    category: 'Engineering & Technology',
    standardDurationYears: 4,
    semesterCount: 8,
    academicStructure: '4 Years / 8 Semesters (Engineering Curriculum)',
  },
  {
    id: 'btech-aids',
    name: 'B.Tech Artificial Intelligence and Data Science (AI & DS)',
    shortName: 'B.Tech AI & DS',
    degreePrefix: 'B.Tech',
    specialization: 'Artificial Intelligence and Data Science',
    level: 'Undergraduate',
    category: 'Engineering & Technology',
    standardDurationYears: 4,
    semesterCount: 8,
    academicStructure: '4 Years / 8 Semesters (Engineering Curriculum)',
  },
  {
    id: 'btech-aiml',
    name: 'B.Tech Artificial Intelligence and Machine Learning (AI & ML)',
    shortName: 'B.Tech AI & ML',
    degreePrefix: 'B.Tech',
    specialization: 'Artificial Intelligence and Machine Learning',
    level: 'Undergraduate',
    category: 'Engineering & Technology',
    standardDurationYears: 4,
    semesterCount: 8,
    academicStructure: '4 Years / 8 Semesters (Engineering Curriculum)',
  },
  {
    id: 'btech-it',
    name: 'B.Tech Information Technology',
    shortName: 'B.Tech IT',
    degreePrefix: 'B.Tech',
    specialization: 'Information Technology',
    level: 'Undergraduate',
    category: 'Engineering & Technology',
    standardDurationYears: 4,
    semesterCount: 8,
    academicStructure: '4 Years / 8 Semesters (Engineering Curriculum)',
  },
  {
    id: 'btech-cyber',
    name: 'B.Tech Cyber Security',
    shortName: 'B.Tech Cyber',
    degreePrefix: 'B.Tech',
    specialization: 'Cyber Security',
    level: 'Undergraduate',
    category: 'Engineering & Technology',
    standardDurationYears: 4,
    semesterCount: 8,
    academicStructure: '4 Years / 8 Semesters (Engineering Curriculum)',
  },
  {
    id: 'be-cse',
    name: 'BE Computer Science and Engineering',
    shortName: 'BE CSE',
    degreePrefix: 'BE',
    specialization: 'Computer Science and Engineering',
    level: 'Undergraduate',
    category: 'Engineering & Technology',
    standardDurationYears: 4,
    semesterCount: 8,
    academicStructure: '4 Years / 8 Semesters (Engineering Curriculum)',
  },
  {
    id: 'be-ece',
    name: 'BE Electronics and Communication Engineering',
    shortName: 'BE ECE',
    degreePrefix: 'BE',
    specialization: 'Electronics and Communication Engineering',
    level: 'Undergraduate',
    category: 'Engineering & Technology',
    standardDurationYears: 4,
    semesterCount: 8,
    academicStructure: '4 Years / 8 Semesters (Engineering Curriculum)',
  },
  {
    id: 'be-eee',
    name: 'BE Electrical and Electronics Engineering',
    shortName: 'BE EEE',
    degreePrefix: 'BE',
    specialization: 'Electrical and Electronics Engineering',
    level: 'Undergraduate',
    category: 'Engineering & Technology',
    standardDurationYears: 4,
    semesterCount: 8,
    academicStructure: '4 Years / 8 Semesters (Engineering Curriculum)',
  },
  {
    id: 'be-mech',
    name: 'BE Mechanical Engineering',
    shortName: 'BE Mech',
    degreePrefix: 'BE',
    specialization: 'Mechanical Engineering',
    level: 'Undergraduate',
    category: 'Engineering & Technology',
    standardDurationYears: 4,
    semesterCount: 8,
    academicStructure: '4 Years / 8 Semesters (Engineering Curriculum)',
  },
  {
    id: 'be-civil',
    name: 'BE Civil Engineering',
    shortName: 'BE Civil',
    degreePrefix: 'BE',
    specialization: 'Civil Engineering',
    level: 'Undergraduate',
    category: 'Engineering & Technology',
    standardDurationYears: 4,
    semesterCount: 8,
    academicStructure: '4 Years / 8 Semesters (Engineering Curriculum)',
  },
  {
    id: 'be-biomed',
    name: 'BE Biomedical Engineering',
    shortName: 'BE Biomed',
    degreePrefix: 'BE',
    specialization: 'Biomedical Engineering',
    level: 'Undergraduate',
    category: 'Engineering & Technology',
    standardDurationYears: 4,
    semesterCount: 8,
    academicStructure: '4 Years / 8 Semesters (Engineering Curriculum)',
  },
  {
    id: 'be-mechatronics',
    name: 'BE Mechatronics Engineering',
    shortName: 'BE Mechatronics',
    degreePrefix: 'BE',
    specialization: 'Mechatronics Engineering',
    level: 'Undergraduate',
    category: 'Engineering & Technology',
    standardDurationYears: 4,
    semesterCount: 8,
    academicStructure: '4 Years / 8 Semesters (Engineering Curriculum)',
  },

  // ==========================================
  // Postgraduate Programs (Postgraduate: 2 Years / 4 Semesters)
  // ==========================================
  {
    id: 'msc-cs',
    name: 'M.Sc Computer Science',
    shortName: 'M.Sc CS',
    degreePrefix: 'M.Sc',
    specialization: 'Computer Science',
    level: 'Postgraduate',
    category: 'Arts & Science',
    standardDurationYears: 2,
    semesterCount: 4,
    academicStructure: '2 Years / 4 Semesters (Postgraduate Pattern)',
  },
  {
    id: 'msc-ds',
    name: 'M.Sc Data Science',
    shortName: 'M.Sc DS',
    degreePrefix: 'M.Sc',
    specialization: 'Data Science',
    level: 'Postgraduate',
    category: 'Arts & Science',
    standardDurationYears: 2,
    semesterCount: 4,
    academicStructure: '2 Years / 4 Semesters (Postgraduate Pattern)',
  },
  {
    id: 'msc-it',
    name: 'M.Sc Information Technology',
    shortName: 'M.Sc IT',
    degreePrefix: 'M.Sc',
    specialization: 'Information Technology',
    level: 'Postgraduate',
    category: 'Arts & Science',
    standardDurationYears: 2,
    semesterCount: 4,
    academicStructure: '2 Years / 4 Semesters (Postgraduate Pattern)',
  },
  {
    id: 'mca-general',
    name: 'MCA (Master of Computer Applications)',
    shortName: 'MCA',
    degreePrefix: 'MCA',
    specialization: 'Computer Applications',
    level: 'Postgraduate',
    category: 'Computer Applications',
    standardDurationYears: 2,
    semesterCount: 4,
    academicStructure: '2 Years / 4 Semesters (AICTE Revised Pattern)',
  },
  {
    id: 'mba-general',
    name: 'MBA (Master of Business Administration)',
    shortName: 'MBA',
    degreePrefix: 'MBA',
    specialization: 'Business Administration',
    level: 'Postgraduate',
    category: 'Management',
    standardDurationYears: 2,
    semesterCount: 4,
    academicStructure: '2 Years / 4 Semesters (Postgraduate Pattern)',
  },
  {
    id: 'mcom-general',
    name: 'M.Com (Master of Commerce)',
    shortName: 'M.Com',
    degreePrefix: 'M.Com',
    specialization: 'Commerce',
    level: 'Postgraduate',
    category: 'Commerce',
    standardDurationYears: 2,
    semesterCount: 4,
    academicStructure: '2 Years / 4 Semesters (Postgraduate Pattern)',
  },
  {
    id: 'me-cse',
    name: 'M.E Computer Science and Engineering',
    shortName: 'M.E CSE',
    degreePrefix: 'M.E',
    specialization: 'Computer Science and Engineering',
    level: 'Postgraduate',
    category: 'Engineering & Technology',
    standardDurationYears: 2,
    semesterCount: 4,
    academicStructure: '2 Years / 4 Semesters (Postgraduate Engineering)',
  },
  {
    id: 'mtech-ds',
    name: 'M.Tech Data Science',
    shortName: 'M.Tech DS',
    degreePrefix: 'M.Tech',
    specialization: 'Data Science',
    level: 'Postgraduate',
    category: 'Engineering & Technology',
    standardDurationYears: 2,
    semesterCount: 4,
    academicStructure: '2 Years / 4 Semesters (Postgraduate Engineering)',
  },
  {
    id: 'ma-english',
    name: 'MA English Literature',
    shortName: 'MA English',
    degreePrefix: 'MA',
    specialization: 'English Literature',
    level: 'Postgraduate',
    category: 'Arts & Science',
    standardDurationYears: 2,
    semesterCount: 4,
    academicStructure: '2 Years / 4 Semesters (Postgraduate Pattern)',
  },
  {
    id: 'llb',
    name: 'LLB (Bachelor of Legislative Law)',
    shortName: 'LLB',
    degreePrefix: 'LLB',
    specialization: 'Law',
    level: 'Undergraduate',
    category: 'Law',
    standardDurationYears: 3,
    semesterCount: 6,
    academicStructure: '3 Years / 6 Semesters (Bar Council Standard)',
  },
  {
    id: 'llm',
    name: 'LLM (Master of Laws)',
    shortName: 'LLM',
    degreePrefix: 'LLM',
    specialization: 'Law',
    level: 'Postgraduate',
    category: 'Law',
    standardDurationYears: 2,
    semesterCount: 4,
    academicStructure: '2 Years / 4 Semesters (Postgraduate Law)',
  },

  // ==========================================
  // Integrated Programs (Integrated: 5 Years / 10 Semesters)
  // ==========================================
  {
    id: 'msc-ss-integrated',
    name: 'M.Sc Software Systems (5-Year Integrated)',
    shortName: 'M.Sc SS Integrated',
    degreePrefix: 'M.Sc Integrated',
    specialization: 'Software Systems',
    level: 'Integrated',
    category: 'Computer Applications',
    standardDurationYears: 5,
    semesterCount: 10,
    academicStructure: '5 Years / 10 Semesters (Integrated Master Program)',
  },
  {
    id: 'msc-ds-integrated',
    name: 'M.Sc Data Science (5-Year Integrated)',
    shortName: 'M.Sc DS Integrated',
    degreePrefix: 'M.Sc Integrated',
    specialization: 'Data Science',
    level: 'Integrated',
    category: 'Arts & Science',
    standardDurationYears: 5,
    semesterCount: 10,
    academicStructure: '5 Years / 10 Semesters (Integrated Master Program)',
  },
  {
    id: 'btech-mtech-dual',
    name: 'B.Tech + M.Tech Dual Degree (5-Year Integrated)',
    shortName: 'Dual Degree (B.Tech + M.Tech)',
    degreePrefix: 'B.Tech + M.Tech',
    specialization: 'Computer Science and Engineering',
    level: 'Integrated',
    category: 'Engineering & Technology',
    standardDurationYears: 5,
    semesterCount: 10,
    academicStructure: '5 Years / 10 Semesters (Integrated Dual Degree)',
  },
];

// Flat string array for backward compatibility
export const DEGREES_DATA: string[] = DEGREE_RECORDS.map((d) => d.name);

/**
 * Normalizes degree search or exact match
 */
export function getDegreeRecord(degreeQueryOrName: string): DegreeRecord | null {
  if (!degreeQueryOrName) return null;
  const clean = degreeQueryOrName.trim().toLowerCase();

  // Exact ID
  const byId = DEGREE_RECORDS.find((d) => d.id.toLowerCase() === clean);
  if (byId) return byId;

  // Exact Name
  const byName = DEGREE_RECORDS.find((d) => d.name.toLowerCase() === clean);
  if (byName) return byName;

  // Exact Short Name
  const byShort = DEGREE_RECORDS.find((d) => d.shortName.toLowerCase() === clean);
  if (byShort) return byShort;

  // Partial match where name or shortName is contained
  const partial = DEGREE_RECORDS.find((d) => {
    const dName = d.name.toLowerCase();
    const dShort = d.shortName.toLowerCase();
    return dName.includes(clean) || clean.includes(dName) || dShort.includes(clean);
  });
  if (partial) return partial;

  // Check prefix matches (e.g. user typed "B.Sc" or "BSc" or "B.Tech" or "BE" or "MCA")
  const prefixClean = clean.replace(/[^a-z]/g, '');
  const prefixMatch = DEGREE_RECORDS.find((d) => {
    const pClean = d.degreePrefix.toLowerCase().replace(/[^a-z]/g, '');
    return pClean === prefixClean || prefixClean.startsWith(pClean);
  });

  return prefixMatch || null;
}

/**
 * Returns structured duration and academic structure information.
 * If program duration is unknown: explicitly returns "Program duration not configured".
 */
export function getProgramDurationInfo(degreeStr: string): {
  durationYears: number | null;
  semesterCount: number | null;
  displayDuration: string;
  structureText: string;
  level: DegreeLevel | 'Unknown';
  category: DegreeCategory | 'Unknown';
  isConfigured: boolean;
} {
  const record = getDegreeRecord(degreeStr);

  if (!record) {
    return {
      durationYears: null,
      semesterCount: null,
      displayDuration: 'Program duration not configured',
      structureText: 'Program duration not configured',
      level: 'Unknown',
      category: 'Unknown',
      isConfigured: false,
    };
  }

  return {
    durationYears: record.standardDurationYears,
    semesterCount: record.semesterCount,
    displayDuration: `${record.standardDurationYears} Years (${record.semesterCount} Semesters)`,
    structureText: record.academicStructure,
    level: record.level,
    category: record.category,
    isConfigured: true,
  };
}
