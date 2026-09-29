import React, { useState, useMemo, useEffect } from 'react';
import {
  Settings,
  User,
  GraduationCap,
  Briefcase,
  RotateCcw,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Shield,
  Cpu,
  LogOut,
  Mail,
  Building,
  BookOpen,
  Layers,
  AlertCircle,
  Calendar,
  Globe,
  MapPin,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CAREERS_DATA } from '../data/careersData';
import { COLLEGE_RECORDS, formatCollegeDetail } from '../data/collegesData';
import { DEGREE_RECORDS, getProgramDurationInfo } from '../data/degreesData';
import { DEPARTMENT_RECORDS } from '../data/departmentsData';
import {
  getValidYearsForDegree,
  getValidSemestersForYear,
  validateAcademicStanding,
  getVerifiedEducationProfile,
} from '../data/academicValidation';
import { AutocompleteInput, AutocompleteItem } from '../components/common/AutocompleteInput';
import { ProficiencyLevel } from '../types';

export const ProfileSettingsPage: React.FC = () => {
  const {
    student,
    updateStudent,
    studentSkills,
    updateSkillProficiency,
    removeStudentSkill,
    addStudentSkill,
    resetToDemoStudent,
    showToast,
    logout,
    currentUser,
  } = useApp();

  const [name, setName] = useState(student.name);
  const [college, setCollege] = useState(student.college);
  const [degree, setDegree] = useState(student.degree);
  const [department, setDepartment] = useState(student.department);
  const [year, setYear] = useState(student.year);
  const [semester, setSemester] = useState(student.semester);
  const [careerGoal, setCareerGoal] = useState(student.career_goal);
  const [bio, setBio] = useState(student.bio || '');

  // Add new skill state
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<ProficiencyLevel>('Beginner');
  const [newSkillCategory, setNewSkillCategory] = useState<string>('Language');

  // Centralized options
  const collegeOptions: AutocompleteItem[] = useMemo(() => {
    return COLLEGE_RECORDS.map((c) => ({
      label: c.name,
      value: c.name,
      subtitle: `${c.institutionType} • ${c.city}, ${c.state}${c.affiliation ? ` • Affiliated to ${c.affiliation}` : ''}`,
      badge: c.city,
    }));
  }, []);

  const degreeOptions: AutocompleteItem[] = useMemo(() => {
    return DEGREE_RECORDS.map((d) => ({
      label: d.name,
      value: d.name,
      subtitle: `${d.level} • ${d.category} • ${d.standardDurationYears} Years (${d.semesterCount} Semesters)`,
      badge: `${d.standardDurationYears} Years`,
    }));
  }, []);

  const departmentOptions: AutocompleteItem[] = useMemo(() => {
    return DEPARTMENT_RECORDS.map((dept) => ({
      label: dept.name,
      value: dept.name,
      subtitle: `${dept.discipline} • ${dept.category}`,
      badge: dept.category,
    }));
  }, []);

  // Program duration and valid years/semesters
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

  // Academic standing validation
  const standingValidation = useMemo(
    () => validateAcademicStanding(year, semester, degree),
    [year, semester, degree]
  );

  const verifiedPreview = useMemo(() => {
    return getVerifiedEducationProfile({
      college,
      degree,
      department,
      year,
      semester,
    });
  }, [college, degree, department, year, semester]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudent({
      name,
      college,
      degree,
      department,
      year,
      semester,
      career_goal: careerGoal,
      bio,
    });
  };

  const handleAddNewSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    addStudentSkill({
      skill_id: newSkillName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      skill_name: newSkillName.trim(),
      category: newSkillCategory,
      proficiency: newSkillLevel,
      source: 'manual',
    });

    setNewSkillName('');
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
            <Settings className="w-3.5 h-3.5" />
            <span>Candidate Dossier & Preferences</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Profile & Skill Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Update your academic credentials, fine-tune recognized competencies, or switch career frameworks.
          </p>
        </div>

        <button
          onClick={resetToDemoStudent}
          className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Reset to Jeffry A (Demo)</span>
        </button>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-600" />
          <span>Academic & Personal Information</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Student Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <AutocompleteInput
            label="University / College"
            value={college}
            onChange={setCollege}
            options={collegeOptions}
            placeholder="Search college (e.g. Rathinam, PSG, Anna Univ...)"
            required
            icon={<GraduationCap className="w-4 h-4" />}
          />

          <AutocompleteInput
            label="Degree Program"
            value={degree}
            onChange={setDegree}
            options={degreeOptions}
            placeholder="Search degree (e.g. B.Sc Computer Science, BCA, B.Tech...)"
            required
            icon={<Briefcase className="w-4 h-4" />}
          />

          <AutocompleteInput
            label="Department / Specialization"
            value={department}
            onChange={setDepartment}
            options={departmentOptions}
            placeholder="Search department (e.g. Computer Science, Data Science...)"
            required
            icon={<Layers className="w-4 h-4" />}
          />

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Academic Year</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Configured years: {availableYears.join(', ')}
            </span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Academic Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              {availableSemesters.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Valid for {year}: {availableSemesters.join(' or ')}
            </span>
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Primary Target Career Framework</label>
            <select
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              {CAREERS_DATA.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Short Candidate Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Brief summary of your academic interests..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
        </div>

        {/* Live Academic Metadata Preview */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-indigo-600" />
              <span>Verified Institution & Academic Structure</span>
            </span>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
              {degreeDurationInfo.displayDuration}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600">
            <div>
              <span className="text-slate-400 block font-mono">Institution Type:</span>
              <span>{verifiedPreview.college.type}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-mono">Affiliation:</span>
              <span>{verifiedPreview.college.affiliation}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-mono">Location:</span>
              <span>
                {verifiedPreview.college.city !== 'Information not configured'
                  ? `${verifiedPreview.college.city}, ${verifiedPreview.college.state}`
                  : 'Information not configured'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>

      {/* Skills Management Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <span>Declared Skill Competencies ({studentSkills.length})</span>
          </h2>
          <span className="text-xs text-slate-500">
            Skills are used by the Skill Gap Engine to benchmark your readiness.
          </span>
        </div>

        {/* Add Skill Form */}
        <form onSubmit={handleAddNewSkill} className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
          <span className="text-xs font-bold text-indigo-950 block">Add New Competency</span>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            <div className="sm:col-span-2">
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="Skill name (e.g. Docker, Tableau, React...)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <select
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(e.target.value as ProficiencyLevel)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Skill</span>
              </button>
            </div>
          </div>
        </form>

        {/* Skills Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-mono text-[11px] uppercase">
                <th className="py-2.5 px-3">Skill Name</th>
                <th className="py-2.5 px-3">Proficiency Level</th>
                <th className="py-2.5 px-3">Source</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentSkills.map((s) => (
                <tr key={s.skill_id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {s.skill_name}
                  </td>
                  <td className="py-3 px-3">
                    <select
                      value={s.proficiency}
                      onChange={(e) => updateSkillProficiency(s.skill_id, e.target.value as ProficiencyLevel)}
                      className="px-2 py-1 rounded border border-slate-200 bg-white font-medium text-slate-700"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono capitalize">
                      {s.source}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => removeStudentSkill(s.skill_id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                      title="Remove Skill"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account Session & Logout Section */}
      <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              <span>Current Session & Security</span>
            </h3>
            <p className="text-xs text-slate-500">
              Signed in as <strong>{student.name}</strong> ({currentUser?.email || student.email || 'demo@careerlens.ai'}).
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>Sign Out / Logout</span>
          </button>
        </div>
      </div>

      {/* Technical Runtime Information */}
      <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-600" />
          Technical Runtime Information
        </h3>
        <p className="leading-relaxed">
          Running <strong>CareerLens AI v1.0</strong> with Express proxy backend routes for Gemini GenAI (model: <code className="font-mono text-indigo-600">gemini-3.8-flash</code>). All API requests are sanitized and routed securely server-side.
        </p>
      </div>
    </div>
  );
};
