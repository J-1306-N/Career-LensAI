import React from 'react';
import {
  LineChart,
  CheckCircle2,
  Clock,
  Sparkles,
  Milestone,
  CheckSquare,
  Bot,
  FolderGit2,
  TrendingUp,
  Award,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProgressTrackerPage: React.FC = () => {
  const {
    currentCareer,
    roadmapPhases,
    practiceHistory,
    interviewSessions,
    projects,
    gapAnalysis,
    setActiveTab,
  } = useApp();

  const allRoadmapItems = roadmapPhases.flatMap((p) => p.items);
  const completedRoadmap = allRoadmapItems.filter((i) => i.status === 'Completed');
  const inProgressRoadmap = allRoadmapItems.filter((i) => i.status === 'In Progress');
  const roadmapPct = allRoadmapItems.length > 0
    ? Math.round((completedRoadmap.length / allRoadmapItems.length) * 100)
    : 0;

  const completedProjects = projects.filter((p) => p.is_completed);
  const avgPracticeScore = practiceHistory.length > 0
    ? Math.round(
        practiceHistory.reduce((acc, p) => acc + p.evaluation.score, 0) / practiceHistory.length
      )
    : 0;

  const avgInterviewScore = interviewSessions.length > 0
    ? (
        interviewSessions.reduce((acc, s) => acc + (s.summary?.average_score || 0), 0) /
        interviewSessions.length
      ).toFixed(1)
    : '0';

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
          <LineChart className="w-3.5 h-3.5" />
          <span>Real-Time Progress & Analytics</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Progress Tracker
        </h1>
        <p className="text-xs text-slate-500">
          Persistent audit of completed milestones, practice drills, mock interviews, and portfolio projects.
        </p>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Roadmap Completion</span>
          <div className="text-3xl font-black text-indigo-600 font-mono">
            {roadmapPct}%
          </div>
          <p className="text-[11px] text-slate-500">
            {completedRoadmap.length} of {allRoadmapItems.length} items complete
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">AI Practice Drills</span>
          <div className="text-3xl font-black text-emerald-600 font-mono">
            {practiceHistory.length}
          </div>
          <p className="text-[11px] text-slate-500">
            Avg Score: <strong>{avgPracticeScore}/100</strong>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Mock Interviews</span>
          <div className="text-3xl font-black text-violet-600 font-mono">
            {interviewSessions.length}
          </div>
          <p className="text-[11px] text-slate-500">
            Avg Rating: <strong>{avgInterviewScore}/10</strong>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Completed Projects</span>
          <div className="text-3xl font-black text-teal-600 font-mono">
            {completedProjects.length}
          </div>
          <p className="text-[11px] text-slate-500">
            {completedProjects.length} proof-of-work repositories
          </p>
        </div>
      </div>

      {/* Detailed Status Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completed Milestones List */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Completed Roadmap Milestones ({completedRoadmap.length})
            </h3>
            <button
              onClick={() => setActiveTab('roadmap')}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              Roadmap →
            </button>
          </div>

          {completedRoadmap.length > 0 ? (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {completedRoadmap.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900">{item.skill_name}</span>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {item.phase_name} • {item.level}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                    Done
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400 space-y-2">
              <Milestone className="w-8 h-8 text-slate-300 mx-auto" />
              <p>No roadmap items completed yet.</p>
              <button
                onClick={() => setActiveTab('roadmap')}
                className="text-indigo-600 font-bold hover:underline"
              >
                Mark milestones in Roadmap →
              </button>
            </div>
          )}
        </div>

        {/* In-Progress Milestones */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              Active / In Progress Milestones ({inProgressRoadmap.length})
            </h3>
            <button
              onClick={() => setActiveTab('roadmap')}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              Roadmap →
            </button>
          </div>

          {inProgressRoadmap.length > 0 ? (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {inProgressRoadmap.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900">{item.skill_name}</span>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {item.phase_name} • ~{item.estimated_hours} hrs
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold font-mono">
                    In Progress
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400 space-y-2">
              <Clock className="w-8 h-8 text-slate-300 mx-auto" />
              <p>No active milestones set to in-progress.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-4">
        <h3 className="font-bold text-sm text-slate-900">
          Recent Student Assessment Activity
        </h3>

        {practiceHistory.length > 0 ? (
          <div className="space-y-2 text-xs">
            {practiceHistory.slice(0, 5).map((record) => (
              <div
                key={record.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <span className="font-bold text-slate-900">{record.question.skill}</span>
                  <p className="text-slate-500 text-[11px] truncate max-w-md">
                    {record.question.question}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-white border border-slate-200 text-indigo-600 font-bold">
                    Score: {record.evaluation.score}/100
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(record.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-4 text-center">
            No practice questions taken yet. Start a drill in the AI Practice Center.
          </p>
        )}
      </div>
    </div>
  );
};
