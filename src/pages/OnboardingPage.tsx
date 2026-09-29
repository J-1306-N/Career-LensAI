import React, { useState, useMemo, useEffect } from 'react';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  CheckCircle2,
  BookOpen,
  Layers,
  Code2,
  Search,
  Check,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  Terminal,
  Wrench,
  HelpCircle,
  Award,
  AlertCircle,
  Building,
  MapPin,
  Calendar,
  Globe,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COLLEGE_RECORDS, CollegeRecord, formatCollegeDetail } from '../data/collegesData';
import { DEGREE_RECORDS, DegreeRecord, getProgramDurationInfo } from '../data/degreesData';
import { DEPARTMENT_RECORDS } from '../data/departmentsData';
import {
  getValidYearsForDegree,
  getValidSemestersForYear,
  validateAcademicStanding,
  getVerifiedEducationProfile,
} from '../data/academicValidation';
import { CAREER_DOMAINS, CareerDomain } from '../data/careerFrameworksData';
import { searchCareerFrameworks, getCareerFrameworkById } from '../services/careerService';
import { AutocompleteInput, AutocompleteItem } from '../components/common/AutocompleteInput';
import { ProficiencyLevel } from '../types';

export const OnboardingPage: React.FC = () => {
  const { student, completeOnboarding, showToast } = useApp();

  // Wizard Step (1 to 5)
  const [step, setStep] = useState<number>(1);

  // Step 1: Personal Information
  const [name, setName] = useState(student.name || '');
  const [college, setCollege] = useState(student.college || 'Rathinam College of Arts and Science, Coimbatore');
  const [degree, setDegree] = useState(student.degree || 'B.Sc Computer Science');
  const [department, setDepartment] = useState(student.department || 'Computer Science');

  // Step 2: Academic Information
  const [year, setYear] = useState(student.year || '2nd Year');
  const [semester, setSemester] = useState(student.semester || '3rd Semester');

  // Step 3: Career Goal Search & Filter
  const [careerSearchQuery, setCareerSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<CareerDomain>('All');
  const [selectedCareerId, setSelectedCareerId] = useState<string>(student.career_goal || 'data-analyst');

  // Step 4: Current Skills
  const [skills, setSkills] = useState<Array<{ name: string; category?: string; proficiency: ProficiencyLevel }>>([
    { name: 'Python', category: 'Language', proficiency: 'Beginner' },
    { name: 'SQL', category: 'Database', proficiency: 'Beginner' },
    { name: 'HTML', category: 'Language', proficiency: 'Beginner' },
    { name: 'Excel', category: 'Data Tool', proficiency: 'Beginner' },
  ]);
  const [skillInput, setSkillInput] = useState('');
  const [skillProficiency, setSkillProficiency] = useState<ProficiencyLevel>('Beginner');

  // Error messaging for steps
  const [stepError, setStepError] = useState<string | null>(null);

  // Centralized College Autocomplete Options
  const collegeOptions: AutocompleteItem[] = useMemo(() => {
    return COLLEGE_RECORDS.map((c) => ({
      label: c.name,
      value: c.name,
      subtitle: `${c.institutionType} • ${c.city}, ${c.state}${c.affiliation ? ` • Affiliated to ${c.affiliation}` : ''}`,
      badge: c.city,
    }));
  }, []);

  // Centralized Degree Autocomplete Options
  const degreeOptions: AutocompleteItem[] = useMemo(() => {
    return DEGREE_RECORDS.map((d) => ({
      label: d.name,
      value: d.name,
      subtitle: `${d.level} • ${d.category} • ${d.standardDurationYears} Years (${d.semesterCount} Semesters)`,
      badge: `${d.standardDurationYears} Years`,
    }));
  }, []);

  // Centralized Department Autocomplete Options
  const departmentOptions: AutocompleteItem[] = useMemo(() => {
    return DEPARTMENT_RECORDS.map((dept) => ({
      label: dept.name,
      value: dept.name,
      subtitle: `${dept.discipline} • ${dept.category}`,
      badge: dept.category,
    }));
  }, []);

  // Dynamic Academic Standing Calculations
  const degreeDurationInfo = useMemo(() => getProgramDurationInfo(degree), [degree]);
  const availableYears = useMemo(() => getValidYearsForDegree(degree), [degree]);
  const availableSemesters = useMemo(() => getValidSemestersForYear(year, degree), [year, degree]);

  // Adjust year if current year is not valid for newly selected degree
  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(year)) {
      setYear(availableYears[0]);
    }
  }, [availableYears, year]);

  // Adjust semester if current semester is not valid for newly selected year
  useEffect(() => {
    if (availableSemesters.length > 0 && !availableSemesters.includes(semester)) {
      setSemester(availableSemesters[0]);
    }
  }, [availableSemesters, semester]);

  // Academic validation status
  const standingValidation = useMemo(
    () => validateAcademicStanding(year, semester, degree),
    [year, semester, degree]
  );

  // Filtered careers list
  const filteredCareers = useMemo(() => {
    return searchCareerFrameworks(careerSearchQuery, selectedDomain);
  }, [careerSearchQuery, selectedDomain]);

  // Selected Career Framework Details
  const selectedFramework = useMemo(() => {
    return getCareerFrameworkById(selectedCareerId) || filteredCareers[0] || getCareerFrameworkById('data-analyst')!;
  }, [selectedCareerId, filteredCareers]);

  // Step 1 Validation & Next
  const handleNextStep1 = () => {
    if (!name.trim()) {
      setStepError('Please enter your full student name.');
      return;
    }
    if (!college.trim()) {
      setStepError('Please select or enter your college / university.');
      return;
    }
    if (!degree.trim()) {
      setStepError('Please select or enter your degree program.');
      return;
    }
    if (!department.trim()) {
      setStepError('Please select or enter your department.');
      return;
    }
    setStepError(null);
    setStep(2);
  };

  // Step 2 Validation & Next
  const handleNextStep2 = () => {
    if (!standingValidation.isValid && standingValidation.warning) {
      setStepError(standingValidation.warning);
      return;
    }
    setStepError(null);
    setStep(3);
  };

  // Step 3 Validation & Next
  const handleNextStep3 = () => {
    if (!selectedCareerId) {
      setStepError('Please select your target career goal.');
      return;
    }
    setStepError(null);
    setStep(4);
  };

  // Step 4 Skills Management
  const handleAddManualSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (skills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      showToast('Skill already added to your list', 'info');
      return;
    }
    setSkills([...skills, { name: trimmed, proficiency: skillProficiency }]);
    setSkillInput('');
  };

  const handleQuickAddSkill = (skillName: string) => {
    if (skills.some((s) => s.name.toLowerCase() === skillName.toLowerCase())) {
      return;
    }
    setSkills([...skills, { name: skillName, proficiency: 'Beginner' }]);
  };

  const handleRemoveSkill = (nameToRemove: string) => {
    setSkills(skills.filter((s) => s.name !== nameToRemove));
  };

  const handleNextStep4 = () => {
    if (skills.length === 0) {
      setStepError('Please add at least one skill you currently know (e.g. Python, SQL, HTML, or Excel).');
      return;
    }
    setStepError(null);
    setStep(5);
  };

  // Step 5: Final Profile Creation
  const handleCreateProfile = () => {
    completeOnboarding({
      name: name.trim() || 'Student',
      college: college.trim(),
      degree: degree.trim(),
      department: department.trim(),
      year,
      semester,
      career_goal: selectedCareerId,
      skills,
    });
  };

  // Step 5 Verified Preview Object
  const verifiedPreview = useMemo(() => {
    return getVerifiedEducationProfile({
      college,
      degree,
      department,
      year,
      semester,
    });
  }, [college, degree, department, year, semester]);

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
          <GraduationCap className="w-4 h-4" />
          <span>Student Career Profile Onboarding</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Personalize Your Career Readiness Journey
        </h1>
        <p className="text-xs md:text-sm text-slate-500 max-w-lg mx-auto">
          Complete the guided setup to benchmark your competencies against industry frameworks and generate your personalized roadmap.
        </p>
      </div>

      {/* Progress Indicator - Step X of 5 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 font-mono">
            Step {step} of 5
          </span>
          <span className="text-xs text-slate-500 font-semibold">
            {step === 1 && 'Personal Information'}
            {step === 2 && 'Academic Information'}
            {step === 3 && 'Target Career Goal'}
            {step === 4 && 'Current Skills'}
            {step === 5 && 'Confirmation & Review'}
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300 ease-out"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Step checkpoints */}
        <div className="grid grid-cols-5 gap-1 mt-3 text-center">
          {[
            { num: 1, label: 'Personal' },
            { num: 2, label: 'Academic' },
            { num: 3, label: 'Career' },
            { num: 4, label: 'Skills' },
            { num: 5, label: 'Confirm' },
          ].map((item) => (
            <div
              key={item.num}
              onClick={() => {
                if (item.num < step) setStep(item.num);
              }}
              className={`text-[11px] font-semibold py-1 rounded-lg transition-colors ${
                step === item.num
                  ? 'text-indigo-600 font-bold bg-indigo-50'
                  : item.num < step
                  ? 'text-emerald-700 cursor-pointer hover:bg-slate-50'
                  : 'text-slate-400'
              }`}
            >
              {item.num < step ? '✓ ' : ''}{item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {stepError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between animate-in fade-in">
            <span>{stepError}</span>
            <button onClick={() => setStepError(null)} className="text-rose-500 hover:text-rose-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 1: Personal Information with College, Degree & Department Autocompletes */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">
                  Step 1 of 5: Personal & Institution Details
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-mono font-bold">
                  Step 1 of 5
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Search or select your institution, degree program, and department from the central repository.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Samantha Patel"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>

              {/* College Autocomplete with Search, Keyboard Nav & Manual Fallback */}
              <AutocompleteInput
                label="College / University"
                value={college}
                onChange={setCollege}
                options={collegeOptions}
                placeholder="Search college (e.g. Rathinam, PSG, Anna University, SKCET...)"
                required
                helperText="Type 1 or more letters to view matching college suggestions. If not listed, enter manually."
                icon={<GraduationCap className="w-4 h-4" />}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Degree Autocomplete */}
                <AutocompleteInput
                  label="Degree Program"
                  value={degree}
                  onChange={setDegree}
                  options={degreeOptions}
                  placeholder="Search degree (e.g. B.Sc Computer Science, BCA, B.Tech CSE, MCA...)"
                  required
                  helperText="Search by degree prefix or full program (e.g. B.Sc, BCA, B.Tech, BE, MCA)."
                  icon={<BookOpen className="w-4 h-4" />}
                />

                {/* Department / Specialization Autocomplete */}
                <AutocompleteInput
                  label="Department / Specialization"
                  value={department}
                  onChange={setDepartment}
                  options={departmentOptions}
                  placeholder="Search department (e.g. Computer Science, Data Science, AI...)"
                  required
                  helperText="Select or enter your department discipline."
                  icon={<Layers className="w-4 h-4" />}
                />
              </div>

              {/* Live Program Duration Preview Badge */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-700 block">Configured Academic Program Structure:</span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    {degreeDurationInfo.isConfigured
                      ? `${degreeDurationInfo.level} • ${degreeDurationInfo.category} • ${degreeDurationInfo.structureText}`
                      : 'Program duration not configured in standard database'}
                  </span>
                </div>
                <span
                  className={`text-[11px] font-mono px-2.5 py-1 rounded-full border font-bold ${
                    degreeDurationInfo.isConfigured
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {degreeDurationInfo.displayDuration}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleNextStep1}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
              >
                <span>Continue to Academic Standing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Academic Information with Dynamic Program Duration & Year/Semester Consistency */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">
                  Step 2 of 5: Academic Standing & Validation
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-mono font-bold">
                  Step 2 of 5
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Your selectable years and semesters are validated dynamically against <strong>{degree}</strong>.
              </p>
            </div>

            {/* Configured Program Duration Context Banner */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  Program Duration: {degreeDurationInfo.displayDuration}
                </span>
                <span className="font-mono text-[10px] uppercase font-bold text-indigo-700 px-2 py-0.5 rounded bg-indigo-100/70">
                  {degreeDurationInfo.level}
                </span>
              </div>
              <p className="text-indigo-800 text-[11px] leading-relaxed">
                {degreeDurationInfo.isConfigured
                  ? `For ${degree}, standard academic progress spans ${degreeDurationInfo.durationYears} years (${degreeDurationInfo.semesterCount} semesters).`
                  : 'Program duration not configured in standard database. You can select your current standing below.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Academic Year <span className="text-rose-500">*</span>
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
                >
                  {availableYears.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Available years: {availableYears.join(', ')}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Semester <span className="text-rose-500">*</span>
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
                >
                  {availableSemesters.map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Valid semesters for {year}: {availableSemesters.join(' or ')}
                </span>
              </div>
            </div>

            {/* Academic Standing Consistency Card */}
            <div
              className={`p-4 rounded-2xl border text-xs flex items-center justify-between ${
                standingValidation.isValid
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {standingValidation.isValid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                )}
                <div>
                  <span className="font-bold block">
                    {standingValidation.isValid
                      ? 'Academic Standing Validated & Consistent'
                      : 'Academic Standing Inconsistency Detected'}
                  </span>
                  <p className="text-[11px] opacity-90">
                    {standingValidation.isValid
                      ? `${year} matches ${semester} in a standard ${degreeDurationInfo.displayDuration} schedule.`
                      : standingValidation.warning}
                  </p>
                </div>
              </div>

              {standingValidation.suggestedSemester && (
                <button
                  type="button"
                  onClick={() => setSemester(standingValidation.suggestedSemester!)}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shrink-0 transition-colors"
                >
                  Auto-adjust to {standingValidation.suggestedSemester}
                </button>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNextStep2}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
              >
                <span>Continue to Career Goal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Expanded Career Selection with Search, Domain Filter & Detailed Card */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">
                  Step 3 of 5: Select Your Career Goal
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-mono font-bold">
                  Step 3 of 5
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Explore tech and non-tech career roles across 12 domains. Search by keyword or filter by domain.
              </p>
            </div>

            {/* Search Input "Search your career" */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={careerSearchQuery}
                onChange={(e) => setCareerSearchQuery(e.target.value)}
                placeholder="Search your career (e.g. Data Analyst, Cyber, AI, Full Stack, Cloud...)"
                className="w-full text-xs pl-10 pr-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-2xs font-medium"
              />
              {careerSearchQuery && (
                <button
                  onClick={() => setCareerSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Domain / Category Filter */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">Filter by Domain:</span>
                <span className="text-[11px] text-slate-400">{filteredCareers.length} roles found</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {CAREER_DOMAINS.map((dom) => (
                  <button
                    key={dom}
                    type="button"
                    onClick={() => setSelectedDomain(dom)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selectedDomain === dom
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {dom}
                  </button>
                ))}
              </div>
            </div>

            {/* Career Frameworks Selection Grid */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Choose Target Role:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto p-1 border border-slate-200 rounded-2xl bg-slate-50/50">
                {filteredCareers.map((c) => {
                  const isSelected = selectedCareerId === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCareerId(c.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900 leading-tight">{c.title}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-1" />}
                        </div>
                        <span className="text-[10px] font-mono text-indigo-700 block">
                          {c.domain}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-2 pt-1 border-t border-slate-100 flex items-center justify-between">
                        <span>{c.coreSkills.length} Core Skills</span>
                        <span className="text-slate-400">{c.tools.length} Tools</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dedicated Career Selection Detail Card */}
            {selectedFramework && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 border border-indigo-200 shadow-sm space-y-4 animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100/80 pb-3">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-bold uppercase tracking-wider mb-1">
                      {selectedFramework.domain}
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900">{selectedFramework.title}</h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{selectedFramework.description}</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleNextStep3}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/25 shrink-0 cursor-pointer self-start sm:self-auto"
                  >
                    <span>Continue with this career</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Core & Supporting Skills */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                      <Terminal className="w-3.5 h-3.5 text-indigo-600" />
                      Core Technical Skills:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedFramework.coreSkills.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-indigo-100/70 text-indigo-800 text-[11px] font-medium border border-indigo-200">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                      <Wrench className="w-3.5 h-3.5 text-sky-600" />
                      Supporting Skills & Tools:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedFramework.supportingSkills.concat(selectedFramework.tools).map((t, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Skill Tiers: Beginner, Intermediate, Advanced */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-indigo-100/60 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1">
                    <span className="font-bold text-emerald-700 block">Beginner Competencies</span>
                    <p className="text-slate-600 text-[10px] leading-relaxed">
                      {selectedFramework.beginnerSkills.join(', ')}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1">
                    <span className="font-bold text-indigo-700 block">Intermediate Milestones</span>
                    <p className="text-slate-600 text-[10px] leading-relaxed">
                      {selectedFramework.intermediateSkills.join(', ')}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1">
                    <span className="font-bold text-purple-700 block">Advanced Mastery</span>
                    <p className="text-slate-600 text-[10px] leading-relaxed">
                      {selectedFramework.advancedSkills.join(', ')}
                    </p>
                  </div>
                </div>

                {/* Key Interview Topics */}
                <div className="pt-2 border-t border-indigo-100/60 text-xs">
                  <span className="font-bold text-slate-800 block mb-1.5 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                    Key Interview Topics:
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-600 list-disc list-inside">
                    {selectedFramework.interviewTopics.map((topic, i) => (
                      <li key={i} className="truncate">{topic}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNextStep3}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
              >
                <span>Continue to Skills</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Current Skills */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">
                  Step 4 of 5: Declare Current Skills
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-mono font-bold">
                  Step 4 of 5
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Enter skills you currently know (e.g. Python, SQL, HTML, Excel). You can use quick chips or type custom skills.
              </p>
            </div>

            {/* Currently Added Skills Chips */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Your Declared Skills ({skills.length})
                </label>
                <span className="text-[11px] text-slate-400">Click &times; to remove</span>
              </div>

              {skills.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-400">
                  No skills added yet. Use the quick suggestions below or type your skills manually.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  {skills.map((s, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs group"
                    >
                      <span>{s.name}</span>
                      <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 text-[10px] font-mono">
                        {s.proficiency}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s.name)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                        aria-label={`Remove ${s.name}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Suggestions Chips based on selected role */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Quick Add Suggestions for {selectedFramework.title}:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[...selectedFramework.coreSkills, ...selectedFramework.tools, 'Python', 'SQL', 'HTML', 'Excel'].slice(0, 10).map(
                  (sName, i) => {
                    const isAdded = skills.some((s) => s.name.toLowerCase() === sName.toLowerCase());
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleQuickAddSkill(sName)}
                        disabled={isAdded}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                          isAdded
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-default'
                            : 'bg-white hover:bg-indigo-50 border-slate-300 text-slate-700 hover:border-indigo-300'
                        }`}
                      >
                        {isAdded ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Plus className="w-3 h-3 text-slate-400" />
                        )}
                        <span>{sName}</span>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Manual Skill Input Row */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
              <span className="text-xs font-bold text-indigo-950 block">Add Any Custom Skill</span>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="e.g. Python, SQL, HTML, Excel, Docker, Pandas"
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddManualSkill();
                    }
                  }}
                />
                <select
                  value={skillProficiency}
                  onChange={(e) => setSkillProficiency(e.target.value as ProficiencyLevel)}
                  className="text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddManualSkill}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNextStep4}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
              >
                <span>Continue to Confirmation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Confirmation & Profile Creation with Verified Data Dossier */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">
                  Step 5 of 5: Review & Confirmation
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono font-bold">
                  Step 5 of 5
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Confirm your verified candidate dossier. Once created, your Career Readiness Dashboard will open instantly.
              </p>
            </div>

            {/* Profile Dossier Summary */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-5">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                    Candidate Name
                  </span>
                  <span className="font-extrabold text-slate-900 text-lg">{name}</span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                    Target Career Goal
                  </span>
                  <span className="font-bold text-indigo-700 text-sm">{selectedFramework.title}</span>
                  <span className="text-[10px] text-slate-500 block font-mono">{selectedFramework.domain}</span>
                </div>
              </div>

              {/* Verified Institution Details Card */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Building className="w-4 h-4 text-indigo-600" />
                  <span>Configured Institution Record</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">Institution</span>
                    <strong className="text-slate-800 font-semibold">{verifiedPreview.college.name}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">Type</span>
                    <span className="text-slate-700">{verifiedPreview.college.type}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">City & State</span>
                    <span className="text-slate-700">
                      {verifiedPreview.college.city !== 'Information not configured'
                        ? `${verifiedPreview.college.city}, ${verifiedPreview.college.state}`
                        : 'Information not configured'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">University Affiliation</span>
                    <span className="text-slate-700">{verifiedPreview.college.affiliation}</span>
                  </div>
                </div>
              </div>

              {/* Verified Academic Program & Standing Card */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>Degree, Department & Academic Standing</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">Degree Program</span>
                    <strong className="text-slate-800 font-semibold">{verifiedPreview.degree.name}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">Department / Branch</span>
                    <span className="text-slate-700">{verifiedPreview.department.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">Program Duration</span>
                    <span className="text-slate-700 font-mono">{verifiedPreview.degree.duration}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">Current Standing</span>
                    <span className="font-bold text-indigo-700 font-mono">
                      {year} • {semester}
                    </span>
                  </div>
                </div>
              </div>

              {/* Declared Initial Skills */}
              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono mb-2">
                  Recognized Initial Skills ({skills.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-2xs"
                    >
                      {s.name}{' '}
                      <span className="text-[10px] text-indigo-600 font-mono">
                        ({s.proficiency})
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Ready to Calculate Readiness Score & Build Personalized Roadmap</span>
              </div>
              <p className="text-emerald-800 text-[11px] leading-relaxed">
                Your profile will be benchmarked against the <strong>{selectedFramework.title}</strong> framework ({selectedFramework.coreSkills.length} core competencies).
              </p>
            </div>

            {/* Confirmation Buttons with exact required label */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleCreateProfile}
                className="px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-md shadow-emerald-600/25"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create My Career Profile</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
