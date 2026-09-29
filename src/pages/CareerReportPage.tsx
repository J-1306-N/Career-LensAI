import React, { useMemo } from 'react';
import {
  Printer,
  Download,
  Share2,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  GraduationCap,
  Briefcase,
  Layers,
  Sparkles,
  Award,
  Building,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getVerifiedEducationProfile } from '../data/academicValidation';

export const CareerReportPage: React.FC = () => {
  const {
    student,
    currentCareer,
    gapAnalysis,
    roadmapPhases,
    projects,
    practiceHistory,
    interviewSessions,
    showToast,
  } = useApp();

  const verifiedEdu = useMemo(() => {
    return getVerifiedEducationProfile(student);
  }, [student]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const reportData = {
      generated_at: new Date().toISOString(),
      student_profile: {
        ...student,
        verified_institution: verifiedEdu.college,
        verified_academic_program: verifiedEdu.degree,
      },
      target_career: currentCareer.name,
      readiness_score: `${gapAnalysis.overall_match_percentage}%`,
      weighted_points: `${gapAnalysis.matched_weighted_points}/${gapAnalysis.total_weighted_points}`,
      competencies_breakdown: {
        strong_matches: gapAnalysis.strong_matches.map((s) => s.name),
        partial_matches: gapAnalysis.partial_matches.map((s) => `${s.name} (Need ${s.required_level})`),
        missing_skills: gapAnalysis.missing_skills.map((s) => s.name),
      },
      roadmap_milestones: roadmapPhases.flatMap((p) => p.items).map((i) => ({
        skill: i.skill_name,
        phase: i.phase_name,
        status: i.status,
      })),
      projects_recommended: projects.map((p) => ({
        title: p.title,
        difficulty: p.difficulty,
        completed: p.is_completed || false,
      })),
      interview_sessions: interviewSessions.map((s) => ({
        role: s.role,
        score: s.summary?.average_score,
        rating: s.summary?.confidence_rating,
      })),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CareerLens_Report_${student.name.replace(/\s+/g, '_')}_${currentCareer.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Exported Career Readiness Report as JSON!');
  };

  const allRoadmapItems = roadmapPhases.flatMap((p) => p.items);
  const completedCount = allRoadmapItems.filter((i) => i.status === 'Completed').length;

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Action Header (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Comprehensive Student Evaluation Dossier</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Career Readiness Audit Report
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Academic portfolio documentation ready for faculty evaluation, career fairs, or mentor reviews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* The Printable Document Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 md:p-12 space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Document Header & Institution Title */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-slate-900">
                CareerLens<span className="text-indigo-600">AI</span>
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                Official Student Report
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Report ID: CL-{student.id.slice(-6).toUpperCase()}-{Date.now().toString().slice(-4)}
            </p>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-500 space-y-0.5">
            <div>Generated: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div className="font-mono text-[11px]">Institution: {verifiedEdu.college.name}</div>
          </div>
        </div>

        {/* 1. Student Profile & Verified Academic Dossier */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 font-mono text-[11px] block">Candidate Name</span>
              <strong className="text-slate-900 text-sm">{student.name}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-mono text-[11px] block">Degree & Major</span>
              <strong className="text-slate-800">{student.degree}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-mono text-[11px] block">Academic Standing</span>
              <strong className="text-slate-800">{student.year} • {student.semester}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-mono text-[11px] block">Target Career Path</span>
              <strong className="text-indigo-600">{currentCareer.name}</strong>
            </div>
          </div>

          {/* Verified Metadata Sub-Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs p-4 rounded-xl border border-slate-200 bg-white">
            <div className="space-y-1">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-indigo-600" />
                Institution Details:
              </span>
              <div className="text-[11px] text-slate-600 space-y-0.5 pl-5">
                <div>Type: <strong className="text-slate-700">{verifiedEdu.college.type}</strong></div>
                <div>Location: <strong className="text-slate-700">{verifiedEdu.college.city !== 'Information not configured' ? `${verifiedEdu.college.city}, ${verifiedEdu.college.state}` : 'Information not configured'}</strong></div>
                <div>University Affiliation: <strong className="text-slate-700">{verifiedEdu.college.affiliation}</strong></div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                Program Structure:
              </span>
              <div className="text-[11px] text-slate-600 space-y-0.5 pl-5">
                <div>Category: <strong className="text-slate-700">{verifiedEdu.degree.category}</strong></div>
                <div>Level: <strong className="text-slate-700">{verifiedEdu.degree.level}</strong></div>
                <div>Standard Duration: <strong className="text-slate-700">{verifiedEdu.degree.duration}</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Readiness Metric & Transparent Formula */}
        <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Framework Skill Alignment
              </span>
              <div className="text-4xl font-black font-mono text-indigo-400 mt-0.5">
                {gapAnalysis.overall_match_percentage}%
              </div>
            </div>

            <div className="text-right text-xs text-slate-300 font-mono space-y-1">
              <div>Earned Weighted Points: <strong className="text-white">{gapAnalysis.matched_weighted_points}</strong></div>
              <div>Total Required Points: <strong className="text-white">{gapAnalysis.total_weighted_points}</strong></div>
            </div>
          </div>

          <div className="text-[11px] text-slate-300 border-t border-slate-800 pt-3 space-y-1">
            <span className="font-bold text-indigo-300 font-mono">Calculation Methodology:</span>
            <p className="leading-relaxed">
              Match % = (Earned Weighted Points / Total Weighted Points) × 100. Core technical competencies carry 30 max points, tools & supporting skills carry 20 max points. Strong matches receive 100% credit, while partial matches receive proportionate partial credit.
            </p>
          </div>
        </div>

        {/* 3. Competency Breakdown */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-200 pb-1">
            Competency Inventory Breakdown
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Strong */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Strong Matches ({gapAnalysis.strong_matches_count})
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {gapAnalysis.strong_matches.map((s) => (
                  <li key={s.skill_id}>
                    <strong>{s.name}</strong> ({s.student_level})
                  </li>
                ))}
              </ul>
            </div>

            {/* Partial */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Partial Matches ({gapAnalysis.partial_matches_count})
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {gapAnalysis.partial_matches.map((s) => (
                  <li key={s.skill_id}>
                    <strong>{s.name}</strong> (At {s.student_level}, needs {s.required_level})
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing */}
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
              <span className="font-bold text-rose-900 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-600" />
                Missing Competencies ({gapAnalysis.missing_skills_count})
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {gapAnalysis.missing_skills.map((s) => (
                  <li key={s.skill_id}>
                    <strong>{s.name}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 4. Action Roadmap Summary */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-200 pb-1">
            Personalized 5-Phase Development Roadmap
          </h2>
          <div className="space-y-2 text-xs">
            {roadmapPhases.map((phase) => (
              <div key={phase.phase_id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>{phase.title}</span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {phase.items.filter((i) => i.status === 'Completed').length} / {phase.items.length} done
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {phase.items.map((i) => (
                    <span
                      key={i.id}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono border ${
                        i.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : i.status === 'In Progress'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {i.skill_name} [{i.status}]
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Recommended Projects */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-200 pb-1">
            Recommended Proof-of-Work Projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {projects.slice(0, 4).map((p) => (
              <div key={p.id} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>{p.title}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                    {p.difficulty}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2">{p.problem_statement}</p>
                <div className="text-[10px] text-slate-400 font-mono pt-1">
                  Tech: {p.suggested_technologies.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Footer & Academic Sign-off */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <div>
            Generated by CareerLens AI • Computer Science University Project
          </div>
          <div>
            Candidate Signature: _______________________
          </div>
        </div>
      </div>
    </div>
  );
};
