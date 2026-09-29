import React, { useState, useMemo } from 'react';
import {
  GitCompare,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Briefcase,
  Layers,
  ArrowRight,
  BookOpen,
  FolderGit2,
  Bot,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CAREERS_DATA } from '../data/careersData';
import { analyzeSkillGaps } from '../services/gapEngine';

export const CareerComparisonPage: React.FC = () => {
  const { student, studentSkills, setSelectedCareerId, setActiveTab, showToast } = useApp();

  // Up to 3 selected careers to compare (defaults: Data Analyst, Python Developer, Software Developer)
  const [selectedIds, setSelectedIds] = useState<string[]>(['data-analyst', 'python-developer', 'software-developer']);

  const handleToggleCareer = (careerId: string) => {
    if (selectedIds.includes(careerId)) {
      if (selectedIds.length === 1) {
        showToast('Please keep at least 1 career selected', 'info');
        return;
      }
      setSelectedIds(selectedIds.filter((id) => id !== careerId));
    } else {
      if (selectedIds.length >= 3) {
        showToast('You can compare up to 3 careers at once', 'info');
        return;
      }
      setSelectedIds([...selectedIds, careerId]);
    }
  };

  // Perform analyses for each selected career
  const comparisons = useMemo(() => {
    return selectedIds.map((id) => {
      const career = CAREERS_DATA.find((c) => c.id === id) || CAREERS_DATA[0];
      const analysis = analyzeSkillGaps(id, studentSkills, student.id);
      return {
        career,
        analysis,
      };
    });
  }, [selectedIds, studentSkills, student.id]);

  const handleSetPrimaryCareer = (careerId: string, careerName: string) => {
    setSelectedCareerId(careerId);
    showToast(`Set primary career goal to ${careerName}!`);
    setActiveTab('dashboard');
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
          <GitCompare className="w-3.5 h-3.5" />
          <span>Factual Multi-Track Alignment</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          What-If Career Comparison
        </h1>
        <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
          Select up to 3 career paths to examine side-by-side. We present strictly objective, factual differences in skill requirements, student matching status, and project demands so you can make your own informed decision.
        </p>
      </div>

      {/* Career Selector Pills */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
        <span className="text-xs font-bold text-slate-700 block">
          Select Careers to Compare (Max 3):
        </span>
        <div className="flex flex-wrap gap-2">
          {CAREERS_DATA.map((career) => {
            const isSelected = selectedIds.includes(career.id);
            return (
              <button
                key={career.id}
                onClick={() => handleToggleCareer(career.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{career.name}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {comparisons.map(({ career, analysis }) => (
          <div
            key={career.id}
            className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between"
          >
            {/* Top Card Header */}
            <div className="p-6 bg-slate-50/70 border-b border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Career Framework
                </span>
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {analysis.overall_match_percentage}% Matched
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-slate-900">{career.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {career.tagline}
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-500 h-full"
                    style={{
                      width: `${(analysis.strong_matches.length / (career.skills.length || 1)) * 100}%`,
                    }}
                  ></div>
                  <div
                    className="bg-amber-400 h-full"
                    style={{
                      width: `${(analysis.partial_matches.length / (career.skills.length || 1)) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>{analysis.strong_matches_count} Strong</span>
                  <span>{analysis.partial_matches_count} Partial</span>
                  <span>{analysis.missing_skills_count} Missing</span>
                </div>
              </div>
            </div>

            {/* Content Breakdown */}
            <div className="p-6 space-y-6 flex-1 text-xs text-slate-700">
              {/* Matching Skills */}
              <div className="space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Matching Skills ({analysis.strong_matches_count})</span>
                </div>
                {analysis.strong_matches.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {analysis.strong_matches.map((s) => (
                      <span
                        key={s.skill_id}
                        className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px]"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">No strong match yet</p>
                )}
              </div>

              {/* Partial Skills */}
              <div className="space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Partial Matches ({analysis.partial_matches_count})</span>
                </div>
                {analysis.partial_matches.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {analysis.partial_matches.map((s) => (
                      <span
                        key={s.skill_id}
                        className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[11px]"
                      >
                        {s.name} (Need {s.required_level})
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">None</p>
                )}
              </div>

              {/* Missing Skills */}
              <div className="space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Missing Gaps ({analysis.missing_skills_count})</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {analysis.missing_skills.map((s) => (
                    <span
                      key={s.skill_id}
                      className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[11px]"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Example Project Types */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <FolderGit2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Typical Project Skills</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                  {career.typical_project_skills.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="truncate">{item}</li>
                  ))}
                </ul>
              </div>

              {/* Key Interview Topics */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <Bot className="w-3.5 h-3.5 text-violet-600" />
                  <span>Interview Focus Topics</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                  {career.interview_topics.slice(0, 2).map((top, idx) => (
                    <li key={idx} className="line-clamp-2">{top}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Action */}
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <button
                onClick={() => handleSetPrimaryCareer(career.id, career.name)}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>Make Primary Goal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
