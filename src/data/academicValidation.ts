/**
 * Centralized Academic Year, Semester & Program Structure Validation Engine
 * 
 * Strict Data Integrity:
 * - Validates academic duration according to degree configuration:
 *   - 3-Year Degrees (B.Sc, BCA, B.Com, BBA, BA): Valid years: 1st, 2nd, 3rd. (Year 4 is strictly invalid!)
 *   - 4-Year Degrees (BE, B.Tech): Valid years: 1st, 2nd, 3rd, 4th.
 *   - 2-Year Degrees (M.Sc, MCA, MBA, M.Tech, ME): Valid years: 1st, 2nd. (Year 3+ is strictly invalid!)
 *   - 5-Year Degrees (Integrated Programs): Valid years: 1st, 2nd, 3rd, 4th, 5th.
 *   - Unconfigured / Unknown Degrees: Returns "Program duration not configured".
 * 
 * - Validates Year-to-Semester consistency:
 *   - 1st Year -> 1st Semester or 2nd Semester
 *   - 2nd Year -> 3rd Semester or 4th Semester
 *   - 3rd Year -> 5th Semester or 6th Semester
 *   - 4th Year -> 7th Semester or 8th Semester
 *   - 5th Year -> 9th Semester or 10th Semester
 */

import { getDegreeRecord, getProgramDurationInfo } from './degreesData';
import { getCollegeRecord, formatCollegeDetail, CollegeRecord } from './collegesData';

export interface AcademicValidationResult {
  isValid: boolean;
  durationInfo: ReturnType<typeof getProgramDurationInfo>;
  yearValid: boolean;
  semesterValid: boolean;
  warning?: string;
  suggestedSemester?: string;
}

export const ALL_STANDARD_YEARS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  '5th Year',
] as const;

export const ALL_STANDARD_SEMESTERS = [
  '1st Semester',
  '2nd Semester',
  '3rd Semester',
  '4th Semester',
  '5th Semester',
  '6th Semester',
  '7th Semester',
  '8th Semester',
  '9th Semester',
  '10th Semester',
] as const;

/**
 * Maps an academic year to its standard semester numbers
 */
export const YEAR_TO_SEMESTERS_MAP: Record<string, string[]> = {
  '1st Year': ['1st Semester', '2nd Semester'],
  '2nd Year': ['3rd Semester', '4th Semester'],
  '3rd Year': ['5th Semester', '6th Semester'],
  '4th Year': ['7th Semester', '8th Semester'],
  '5th Year': ['9th Semester', '10th Semester'],
};

/**
 * Returns allowed academic years strictly based on degree duration
 */
export function getValidYearsForDegree(degreeNameOrQuery: string): string[] {
  const info = getProgramDurationInfo(degreeNameOrQuery);

  if (!info.isConfigured || !info.durationYears) {
    // If unknown degree, allow 1st through 4th Year and Postgraduate
    return ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  }

  const count = info.durationYears;
  const years: string[] = [];

  for (let i = 1; i <= Math.min(count, 5); i++) {
    const suffix = i === 1 ? '1st' : i === 2 ? '2nd' : i === 3 ? '3rd' : `${i}th`;
    years.push(`${suffix} Year`);
  }

  return years;
}

/**
 * Returns valid semesters for a specific academic year and degree
 */
export function getValidSemestersForYear(year: string, degreeNameOrQuery?: string): string[] {
  const semestersForYear = YEAR_TO_SEMESTERS_MAP[year];
  if (!semestersForYear) {
    return ['1st Semester', '2nd Semester'];
  }

  if (degreeNameOrQuery) {
    const info = getProgramDurationInfo(degreeNameOrQuery);
    if (info.isConfigured && info.semesterCount) {
      // Filter out semesters that exceed the program's total semester count
      return semestersForYear.filter((sem) => {
        const num = parseInt(sem.replace(/\D/g, ''), 10);
        return num <= info.semesterCount!;
      });
    }
  }

  return semestersForYear;
}

/**
 * Validates year, semester, and degree correlation
 */
export function validateAcademicStanding(
  year: string,
  semester: string,
  degree: string
): AcademicValidationResult {
  const durationInfo = getProgramDurationInfo(degree);
  const validYears = getValidYearsForDegree(degree);

  // 1. Year Validation against configured degree
  const yearValid = validYears.includes(year);
  if (!yearValid && durationInfo.isConfigured && durationInfo.durationYears) {
    return {
      isValid: false,
      durationInfo,
      yearValid: false,
      semesterValid: false,
      warning: `${degree} is a configured ${durationInfo.durationYears}-year program. ${year} is not valid for this degree.`,
    };
  }

  // 2. Semester Validation against Year
  const allowedSemesters = getValidSemestersForYear(year, degree);
  const semesterValid = allowedSemesters.includes(semester);

  if (!semesterValid) {
    const suggested = allowedSemesters[0] || '1st Semester';
    return {
      isValid: false,
      durationInfo,
      yearValid: true,
      semesterValid: false,
      warning: `In a standard academic structure, ${year} comprises ${allowedSemesters.join(' or ')}.`,
      suggestedSemester: suggested,
    };
  }

  return {
    isValid: true,
    durationInfo,
    yearValid: true,
    semesterValid: true,
  };
}

/**
 * Creates verified academic profile display object without inventing data
 */
export function getVerifiedEducationProfile(student: {
  college?: string;
  degree?: string;
  department?: string;
  year?: string;
  semester?: string;
}) {
  const collegeRec: CollegeRecord | null = student.college
    ? getCollegeRecord(student.college)
    : null;

  const degreeInfo = student.degree
    ? getProgramDurationInfo(student.degree)
    : {
        durationYears: null,
        semesterCount: null,
        displayDuration: 'Program duration not configured',
        structureText: 'Program duration not configured',
        level: 'Unknown' as const,
        category: 'Unknown' as const,
        isConfigured: false,
      };

  return {
    college: {
      name: student.college || 'Information not configured',
      type: formatCollegeDetail(collegeRec?.institutionType),
      city: formatCollegeDetail(collegeRec?.city),
      state: formatCollegeDetail(collegeRec?.state),
      affiliation: formatCollegeDetail(collegeRec?.affiliation),
      website: formatCollegeDetail(collegeRec?.website),
      isKnownRecord: !!collegeRec,
    },
    degree: {
      name: student.degree || 'Information not configured',
      level: degreeInfo.level,
      category: degreeInfo.category,
      duration: degreeInfo.displayDuration,
      structureText: degreeInfo.structureText,
      isConfigured: degreeInfo.isConfigured,
    },
    department: {
      name: student.department || 'Information not configured',
    },
    standing: {
      year: student.year || 'Information not configured',
      semester: student.semester || 'Information not configured',
      validation: validateAcademicStanding(
        student.year || '1st Year',
        student.semester || '1st Semester',
        student.degree || ''
      ),
    },
  };
}
