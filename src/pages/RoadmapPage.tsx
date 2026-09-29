import React from 'react';
import {
  Milestone,
  CheckCircle2,
  Clock,
  BookOpen,
  FolderGit2,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Shield,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { RoadmapItem, RoadmapStatus } from '../types';

export const RoadmapPage: React.FC = () => {
  const { currentCareer, roadmapPhases, updateRoadmapItemStatus, regenerateRoadmap, setActiveTab } = useApp();

  const handleToggleStatus = (item: RoadmapItem) => {
    let nextStatus: RoadmapStatus = 'Not Started';
    if (item.status === 'Not Started') nextStatus = 'In Progress';
    else if (item.status === 'In Progress') {
      nextStatus = 'Completed';
      // Trigger subtle celebratory confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } else {
      nextStatus = 'Not Started';
    }
    updateRoadmapItemStatus(item.id, nextStatus);
  };

  const allItems = roadmapPhases.flatMap((p) => p.items);
  const completedCount = allItems.filter((i) => i.status === 'Completed').length;
  const progressPct = allItems.length > 0 ? Math.round((completedCount / allItems.length) * 100) : 0;

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
            <Milestone className="w-3.5 h-3.5" />
            <span>Dynamic 5-Phase Sequence</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Personalized Roadmap for {currentCareer.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dynamically synthesized to close your exact missing prerequisites, core tools, and project proof-of-work.
          </p>
        </div>

        <button
          onClick={regenerateRoadmap}
          className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs self-start md:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Recalculate Roadmap</span>
        </button>
      </div>

      {/* Roadmap Progress Status */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 font-mono">
            Roadmap Completion
          </span>
          <div className="text-3xl font-black font-mono">
            {completedCount} of {allItems.length} Milestones Achieved ({progressPct}%)
          </div>
          <p className="text-xs text-slate-300">
            Click any milestone card or status pill below to advance from <strong className="text-white">Not Started</strong> → <strong className="text-amber-300">In Progress</strong> → <strong className="text-emerald-400">Completed</strong>.
          </p>
        </div>

        <div className="w-full sm:w-48 space-y-1.5 shrink-0">
          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
          <div className="text-right text-[11px] text-slate-400 font-mono">
            {allItems.length - completedCount} milestones remaining
          </div>
        </div>
      </div>

      {/* 5 Phases Vertical Accordion/Timeline */}
      <div className="space-y-8">
        {roadmapPhases.map((phase) => (
          <div key={phase.phase_id} className="space-y-3">
            {/* Phase Header */}
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                0{phase.phase_id}
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-900">{phase.title}</h2>
                <p className="text-xs text-slate-500">{phase.description}</p>
              </div>
            </div>

            {/* Phase Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-0 sm:pl-11">
              {phase.items.map((item) => {
                const isCompleted = item.status === 'Completed';
                const isInProgress = item.status === 'In Progress';

                return (
                  <div
                    key={item.id}
                    className={`p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                      isCompleted
                        ? 'bg-emerald-50/40 border-emerald-200 shadow-2xs'
                        : isInProgress
                        ? 'bg-amber-50/30 border-amber-200 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="space-y-2.5">
                      {/* Top Skill & Status Pill */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3
                            className={`font-bold text-sm ${
                              isCompleted ? 'line-through text-slate-500' : 'text-slate-900'
                            }`}
                          >
                            {item.skill_name}
                          </h3>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                            <span>Level: {item.level}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              ~{item.estimated_hours} hrs
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleStatus(item)}
                          className={`px-2.5 py-1 rounded-full text-xs font-bold transition-transform active:scale-95 cursor-pointer border ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : isInProgress
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {item.status}
                        </button>
                      </div>

                      {/* Tasks and Projects */}
                      <div className="p-3 rounded-xl bg-white/80 border border-slate-200 space-y-2 text-xs">
                        <div className="flex items-start gap-2 text-slate-700">
                          <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-slate-900">Practice Task:</span>{' '}
                            {item.practice_task}
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-slate-700">
                          <FolderGit2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-slate-900">Mini Project:</span>{' '}
                            {item.mini_project}
                          </div>
                        </div>
                      </div>

                      {item.prerequisites.length > 0 && (
                        <div className="text-[11px] text-slate-400 font-mono">
                          Prerequisites: <span className="text-slate-600">{item.prerequisites.join(', ')}</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Toggle Status</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('practice')}
                        className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1"
                      >
                        <span>Take Practice Drill</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
