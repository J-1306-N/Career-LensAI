import React, { useState } from 'react';
import {
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Milestone,
  CheckSquare,
  Bot,
  FolderGit2,
  FileText,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  Flame,
  Award,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HowCalculatedModal } from '../components/common/HowCalculatedModal';
import { CAREERS_DATA } from '../data/careersData';

export const DashboardPage: React.FC = () => {
  const {
    student,
    currentCareer,
    selectedCareerId,
    setSelectedCareerId,
    gapAnalysis,
    roadmapPhases,
    practiceHistory,
    interviewSessions,
    projects,
    setActiveTab,
    resetToDemoStudent,
  } = useApp();

  const [isHowModalOpen, setIsHowModalOpen] = useState(false);

  // Calculate learning progress stats
  const allRoadmapItems = roadmapPhases.flatMap((p) => p.items);
  const completedRoadmapCount = allRoadmapItems.filter((i) => i.status === 'Completed').length;
  const inProgressRoadmapCount = allRoadmapItems.filter((i) => i.status === 'In Progress').length;
  const roadmapProgressPct = allRoadmapItems.length > 0
    ? Math.round((completedRoadmapCount / allRoadmapItems.length) * 100)
    : 0;

  // Next skill recommendation
  const recommendedNextSkill = gapAnalysis.missing_skills[0] || gapAnalysis.partial_matches[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Welcome / Career Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 md:p-8 border border-slate-800 shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-600/20 via-indigo-600/5 to-transparent pointer-events-none"></div>

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/20">
                {student.degree}
              </span>
              {student.department && (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                  {student.department}
                </span>
              )}
              <span className="text-xs text-slate-400 font-mono">
                {student.year} • {student.semester}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome back, {student.name} 👋
            </h1>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {student.college && (
                <span className="text-slate-400 block mb-0.5">
                  Institution: <strong className="text-slate-200">{student.college}</strong>
                </span>
              )}
              You are tracking career readiness for <strong className="text-white underline decoration-indigo-400 underline-offset-4">{currentCareer.name}</strong>. Below is your real-time mathematical competency gap breakdown and next action plan.
            </p>
          </div>

          {/* Quick Career Switcher on Banner */}
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-2.5 shrink-0 min-w-[260px]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Target Framework</span>
              <span className="text-indigo-400 font-mono text-xs">{gapAnalysis.overall_match_percentage}%</span>
            </div>
            <select
              value={selectedCareerId}
              onChange={(e) => setSelectedCareerId(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-900 text-white px-3 py-2 rounded-xl border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {CAREERS_DATA.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <button
                onClick={() => setActiveTab('compare-careers')}
                className="hover:text-indigo-300 transition-colors cursor-pointer"
              >
                Compare with other careers →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Row with Donut & Counts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Match Percentage Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <span>Skill Match Score</span>
              <button
                onClick={() => setIsHowModalOpen(true)}
                className="text-slate-400 hover:text-indigo-600 transition-colors"
                title="How is this calculated?"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono flex items-baseline gap-1">
              <span>{gapAnalysis.overall_match_percentage}%</span>
            </div>
            <p className="text-[11px] text-slate-500">
              {gapAnalysis.matched_weighted_points} / {gapAnalysis.total_weighted_points} weighted points
            </p>
          </div>

          {/* Clean Circular Progress SVG */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-indigo-600 transition-all duration-1000 ease-out"
                strokeDasharray={`${gapAnalysis.overall_match_percentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[11px] font-bold font-mono text-slate-800">
              {gapAnalysis.overall_match_percentage}%
            </span>
          </div>
        </div>

        {/* Strong & Partial Competencies */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="text-xs font-semibold text-slate-500">Verified Competencies</div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-black text-emerald-600 font-mono">
                {gapAnalysis.strong_matches_count}
              </span>
              <span className="text-xs text-slate-500 block">Strong Matches</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-amber-600 font-mono">
                {gapAnalysis.partial_matches_count}
              </span>
              <span className="text-xs text-slate-500 block">Partial Matches</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full"
              style={{
                width: `${(gapAnalysis.strong_matches_count / (currentCareer.skills.length || 1)) * 100}%`,
              }}
            ></div>
            <div
              className="bg-amber-400 h-full"
              style={{
                width: `${(gapAnalysis.partial_matches_count / (currentCareer.skills.length || 1)) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Missing Skills Gap */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">Immediate Skill Gaps</div>
          <div className="text-3xl font-black text-rose-600 font-mono">
            {gapAnalysis.missing_skills_count}
          </div>
          <p className="text-[11px] text-slate-500">
            Skills to acquire for standard entry-level readiness
          </p>
          <button
            onClick={() => setActiveTab('gap-analysis')}
            className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 pt-1 cursor-pointer"
          >
            <span>View gap breakdown</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Roadmap Progress */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="text-xs font-semibold text-slate-500">Roadmap Progress</div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-indigo-600 font-mono">
              {completedRoadmapCount} / {allRoadmapItems.length}
            </span>
            <span className="text-xs font-mono text-slate-500 font-bold">
              {roadmapProgressPct}% done
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-500"
              style={{ width: `${roadmapProgressPct}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-slate-500 truncate">
            {inProgressRoadmapCount} tasks currently in progress
          </p>
        </div>
      </div>

      {/* Your Next 3 Steps Section (Dynamically personalized to gaps!) */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 border border-indigo-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 font-mono">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Personalized Recommendation Engine</span>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-slate-900 mt-0.5">
              Your Next 3 Action Steps
            </h2>
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Dynamically adapted to your {gapAnalysis.missing_skills_count} remaining gaps
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {gapAnalysis.next_three_steps.map((step) => (
            <div
              key={step.id}
              onClick={() => setActiveTab(step.target_url || 'roadmap')}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-800 text-xs font-bold font-mono flex items-center justify-center">
                    0{step.step_number}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                    {step.action_type}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {step.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs font-semibold text-indigo-600">
                <span>Start action</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Skill Competency Grid & Roadmap Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Required Framework Skills Overview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {currentCareer.name} Competency Status
              </h2>
              <p className="text-xs text-slate-500">
                Detailed contrast between your recorded proficiency and target expectations.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('gap-analysis')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Full Gap Analysis</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {gapAnalysis.all_evaluated_skills.map((skill) => {
              const statusStyles = {
                'Strong Match': 'bg-emerald-50 text-emerald-700 border-emerald-200',
                'Partial Match': 'bg-amber-50 text-amber-700 border-amber-200',
                'Missing': 'bg-rose-50 text-rose-700 border-rose-200',
              }[skill.status];

              return (
                <div
                  key={skill.skill_id}
                  className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{skill.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Requires: {skill.required_level}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusStyles}`}>
                      {skill.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {skill.why_relevant}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">
                      You: <strong className="text-slate-700">{skill.student_level || 'None'}</strong>
                    </span>
                    <span className="font-mono text-slate-500">
                      {skill.score_contribution} / {skill.max_contribution} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (1 col): Roadmap Quick Timeline & Action Centers */}
        <div className="space-y-6">
          {/* Quick Roadmap Timeline Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Milestone className="w-4 h-4 text-indigo-600" />
                Roadmap Timeline
              </h3>
              <button
                onClick={() => setActiveTab('roadmap')}
                className="text-xs text-indigo-600 font-bold hover:underline"
              >
                View all
              </button>
            </div>

            <div className="space-y-3 relative pl-4 border-l-2 border-slate-200">
              {roadmapPhases.slice(0, 3).map((phase) => (
                <div key={phase.phase_id} className="relative space-y-1">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-white"></div>
                  <div className="text-xs font-bold text-slate-900">{phase.title}</div>
                  <p className="text-[11px] text-slate-500">{phase.subtitle}</p>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {phase.items.length} prioritized tasks
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('roadmap')}
              className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Open Personalized Roadmap</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive AI Tools Quick Launch */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Interactive AI Readiness Tools
            </h3>

            <div
              onClick={() => setActiveTab('practice')}
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    AI Practice Center
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {practiceHistory.length} drills completed
                  </div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </div>

            <div
              onClick={() => setActiveTab('interview')}
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    AI Mock Interview
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {interviewSessions.length} sessions logged
                  </div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </div>

            <div
              onClick={() => setActiveTab('resume')}
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    Resume Analyzer
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Scan new PDF/text resume
                  </div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </div>
          </div>
        </div>
      </div>

      <HowCalculatedModal isOpen={isHowModalOpen} onClose={() => setIsHowModalOpen(false)} />
    </div>
  );
};
