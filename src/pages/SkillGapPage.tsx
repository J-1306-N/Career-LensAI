import React, { useState } from 'react';
import {
  TrendingUp,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Layers,
  ArrowRight,
  BookOpen,
  FolderGit2,
  Lightbulb,
  Sparkles,
  Filter,
  CheckSquare,
  Bot,
  Award,
  ShieldAlert,
  Code2,
  FileCheck,
  Compass,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HowCalculatedModal } from '../components/common/HowCalculatedModal';
import { SkillGapDetail, SkillMatchStatus } from '../types';

export const SkillGapPage: React.FC = () => {
  const { currentCareer, gapAnalysis, setActiveTab } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isHowModalOpen, setIsHowModalOpen] = useState(false);
  const [activeSectionTab, setActiveSectionTab] = useState<'matrix' | 'readiness'>('readiness');

  // Filter skills for detailed cards
  const filteredSkills = gapAnalysis.all_evaluated_skills.filter((s) => {
    if (filterStatus !== 'all' && s.status !== filterStatus) return false;
    if (filterCategory !== 'all' && s.category_group !== filterCategory) return false;
    return true;
  });

  const statusColors = {
    'Good skill alignment': {
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-500',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
    },
    'Possible with additional preparation': {
      badge: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-400',
      icon: <AlertCircle className="w-4 h-4 text-amber-600" />,
    },
    'Significant skill gaps': {
      badge: 'bg-rose-50 text-rose-800 border-rose-200',
      dot: 'bg-rose-500',
      icon: <XCircle className="w-4 h-4 text-rose-600" />,
    },
  }[gapAnalysis.career_alignment_status];

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Mathematical Competency Alignment</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Skill Gap & Readiness Analysis: {currentCareer.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent mathematical comparison between your verified skills and configured career expectations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setIsHowModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-300" />
            <span>Calculation Formula</span>
          </button>
        </div>
      </div>

      {/* Summary Score Bar */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Career Alignment Index
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusColors.badge}`}>
                {statusColors.icon}
                <span>{gapAnalysis.career_alignment_status}</span>
              </span>
            </div>

            <div className="text-3xl md:text-4xl font-black text-slate-900 font-mono mt-1 flex items-baseline gap-2">
              <span>{gapAnalysis.overall_match_percentage}%</span>
              <span className="text-xs font-sans text-slate-500 font-normal">
                ({gapAnalysis.matched_weighted_points} / {gapAnalysis.total_weighted_points} weighted points earned)
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {gapAnalysis.status_explanation}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('roadmap')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <span>View Your Career Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all duration-700"
              style={{
                width: `${(gapAnalysis.strong_matches.reduce((acc, s) => acc + s.score_contribution, 0) / (gapAnalysis.total_weighted_points || 1)) * 100}%`,
              }}
              title="Strong Matches"
            ></div>
            <div
              className="bg-amber-400 h-full transition-all duration-700"
              style={{
                width: `${(gapAnalysis.partial_matches.reduce((acc, s) => acc + s.score_contribution, 0) / (gapAnalysis.total_weighted_points || 1)) * 100}%`,
              }}
              title="Partial Matches"
            ></div>
          </div>
          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Already Mastered ({gapAnalysis.strong_matches_count})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              Needs Improvement ({gapAnalysis.partial_matches_count})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              Missing Competencies ({gapAnalysis.missing_skills_count})
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>This evaluation reflects technical syllabus alignment only and does not represent an employment guarantee.</span>
        </div>
      </div>

      {/* Main View Switcher */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSectionTab('readiness')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSectionTab === 'readiness'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100'
            }`}
          >
            Structured Career Readiness (Sections A–G)
          </button>
          <button
            onClick={() => setActiveSectionTab('matrix')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSectionTab === 'matrix'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100'
            }`}
          >
            Skill Matrix & Weights ({gapAnalysis.all_evaluated_skills.length})
          </button>
        </div>
      </div>

      {activeSectionTab === 'readiness' ? (
        /* ========================================================================= */
        /* STRUCTURED CAREER READINESS ANALYSIS (SECTIONS A THROUGH G)              */
        /* ========================================================================= */
        <div className="space-y-6">
          {/* Section A, B, C: The Core Skill Triad */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* A. Skills the student already has */}
            <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>A. Skills You Already Have</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                  {gapAnalysis.skills_already_have.length}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Skills meeting or exceeding the required level for {currentCareer.name}.
              </p>
              {gapAnalysis.skills_already_have.length > 0 ? (
                <div className="space-y-1.5">
                  {gapAnalysis.skills_already_have.map((s) => (
                    <div
                      key={s.skill_id}
                      className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs flex items-center justify-between"
                    >
                      <div>
                        <strong className="text-emerald-950 font-semibold">{s.name}</strong>
                        <div className="text-[10px] text-emerald-700">
                          Your Level: {s.student_level} (Required: {s.required_level})
                        </div>
                      </div>
                      <span className="text-emerald-600 font-bold text-xs">✓ Mastered</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic p-3 text-center">None yet</p>
              )}
            </div>

            {/* B. Skills needing improvement */}
            <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>B. Skills Needing Improvement</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold font-mono">
                  {gapAnalysis.skills_need_improvement.length}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                You know the basics, but need higher proficiency to meet industry standards.
              </p>
              {gapAnalysis.skills_need_improvement.length > 0 ? (
                <div className="space-y-1.5">
                  {gapAnalysis.skills_need_improvement.map((s) => (
                    <div
                      key={s.skill_id}
                      className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 text-xs flex items-center justify-between"
                    >
                      <div>
                        <strong className="text-amber-950 font-semibold">{s.name}</strong>
                        <div className="text-[10px] text-amber-700">
                          Current: {s.student_level} → Needs: {s.required_level}
                        </div>
                      </div>
                      <span className="text-amber-700 font-bold text-xs">△ Level Up</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic p-3 text-center">No partial gaps</p>
              )}
            </div>

            {/* C. Skills that are missing */}
            <div className="p-5 rounded-2xl bg-white border border-rose-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-rose-100 pb-2">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>C. Skills You Are Missing</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold font-mono">
                  {gapAnalysis.skills_missing.length}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Required competencies that have not yet been started or detected.
              </p>
              {gapAnalysis.skills_missing.length > 0 ? (
                <div className="space-y-1.5">
                  {gapAnalysis.skills_missing.map((s) => (
                    <div
                      key={s.skill_id}
                      className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-100 text-xs flex items-center justify-between"
                    >
                      <div>
                        <strong className="text-rose-950 font-semibold">{s.name}</strong>
                        <div className="text-[10px] text-rose-700">
                          Priority #{s.recommended_learning_order} • Weight: {s.weight}x
                        </div>
                      </div>
                      <span className="text-rose-600 font-bold text-xs">✗ Missing</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic p-3 text-center">All required skills present!</p>
              )}
            </div>
          </div>

          {/* Section D, E, F, G: Complementary Readiness */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* D. Recommended Additional Skills */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs border-b border-slate-100 pb-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>D. Recommended Additional Skills & Tools</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Supplementary tooling and frameworks that give candidates a competitive edge.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {gapAnalysis.recommended_additional_skills.map((tool, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-medium"
                  >
                    + {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* E. Practical Experience Needed */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs border-b border-slate-100 pb-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>E. Practical Experience Needed</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                {gapAnalysis.practical_experience_needed}
              </p>
            </div>

            {/* F. Projects Recommended */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                  <FolderGit2 className="w-4 h-4 text-violet-600" />
                  <span>F. Projects Recommended</span>
                </div>
                <button
                  onClick={() => setActiveTab('projects')}
                  className="text-indigo-600 hover:text-indigo-800 text-[11px] font-semibold cursor-pointer"
                >
                  View All Projects →
                </button>
              </div>
              <div className="space-y-2">
                {gapAnalysis.projects_recommended.slice(0, 2).map((proj) => (
                  <div
                    key={proj.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-900">{proj.title}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-violet-100 text-violet-700 font-medium">
                        {proj.difficulty}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2">
                      {proj.problem_statement}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.suggested_technologies.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="text-[10px] text-slate-500 font-mono">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* G. Interview Preparation Needed */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                  <Bot className="w-4 h-4 text-amber-600" />
                  <span>G. Interview Preparation Needed</span>
                </div>
                <button
                  onClick={() => setActiveTab('interview')}
                  className="text-indigo-600 hover:text-indigo-800 text-[11px] font-semibold cursor-pointer"
                >
                  Start Mock Simulator →
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Core concepts and scenario drills tested during recruiter screening:
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {gapAnalysis.interview_preparation_needed.slice(0, 3).map((topic, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="line-clamp-2">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* SKILL MATRIX VIEW (FILTER TABS & CARDS)                                   */
        /* ========================================================================= */
        <div className="space-y-6">
          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: `All Skills (${gapAnalysis.all_evaluated_skills.length})` },
                { id: 'Missing', label: `Missing (${gapAnalysis.missing_skills_count})` },
                { id: 'Partial Match', label: `Partial (${gapAnalysis.partial_matches_count})` },
                { id: 'Strong Match', label: `Strong (${gapAnalysis.strong_matches_count})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    filterStatus === tab.id
                      ? 'bg-white text-indigo-700 shadow-2xs border border-indigo-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none"
              >
                <option value="all">All Category Groups</option>
                <option value="core_tech">Core Technical (Weight 3)</option>
                <option value="tools">Tools & Platforms (Weight 2)</option>
                <option value="supporting_tech">Supporting Technical (Weight 2)</option>
                <option value="soft_skills">Soft Skills (Weight 1-2)</option>
              </select>
            </div>
          </div>

          {/* Skills Detail Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSkills.map((skill) => {
              const statusBadge = {
                'Strong Match': 'bg-emerald-50 text-emerald-800 border-emerald-200',
                'Partial Match': 'bg-amber-50 text-amber-800 border-amber-200',
                'Missing': 'bg-rose-50 text-rose-800 border-rose-200',
              }[skill.status];

              const statusIcon = {
                'Strong Match': <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
                'Partial Match': <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />,
                'Missing': <XCircle className="w-4 h-4 text-rose-600 shrink-0" />,
              }[skill.status];

              return (
                <div
                  key={skill.skill_id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-sm transition-all space-y-3.5 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">{skill.name}</h3>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                          <span>Order Priority: #{skill.recommended_learning_order}</span>
                          <span>•</span>
                          <span>Weight: {skill.weight}x</span>
                          <span>•</span>
                          <span>Requires: {skill.required_level}</span>
                        </div>
                      </div>

                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBadge}`}>
                        {statusIcon}
                        <span>{skill.status}</span>
                      </span>
                    </div>

                    {/* Why Relevant */}
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {skill.why_relevant}
                    </p>

                    {/* Prerequisites & Action Details */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-start gap-2 text-slate-700">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-slate-900">Suggested Practice:</strong> {skill.suggested_practice}
                        </span>
                      </div>

                      <div className="flex items-start gap-2 text-slate-700">
                        <FolderGit2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-slate-900">Suggested Project:</strong> {skill.suggested_project}
                        </span>
                      </div>

                      {skill.prerequisites.length > 0 && (
                        <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 flex items-center gap-1 font-mono">
                          <span>Prerequisites:</span>
                          <span className="font-medium text-slate-700">
                            {skill.prerequisites.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-[11px] text-slate-500 font-mono">
                      Points Earned: <strong className="text-slate-800">{skill.score_contribution}</strong> / {skill.max_contribution}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveTab('practice')}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <CheckSquare className="w-3 h-3" />
                        <span>Practice Drill</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <HowCalculatedModal isOpen={isHowModalOpen} onClose={() => setIsHowModalOpen(false)} />
    </div>
  );
};
