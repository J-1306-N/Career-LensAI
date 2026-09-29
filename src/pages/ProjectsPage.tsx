import React, { useState } from 'react';
import {
  FolderGit2,
  Sparkles,
  Bookmark,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  Code2,
  RotateCcw,
  Check,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { generateProjectRecommendationsAI } from '../services/aiService';

export const ProjectsPage: React.FC = () => {
  const { currentCareer, gapAnalysis, projects, toggleProjectSaved, toggleProjectCompleted, showToast } = useApp();
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'saved' | 'completed'>('all');

  const missingSkillNames = gapAnalysis.missing_skills.map((s) => s.name);

  const handleGenerateMoreProjects = async () => {
    setIsGeneratingMore(true);
    try {
      const more = await generateProjectRecommendationsAI(
        missingSkillNames.length ? missingSkillNames : ['SQL', 'Python'],
        currentCareer.name
      );
      showToast(`Generated ${more.length} customized project briefs!`);
    } catch (err) {
      showToast('Could not generate additional projects', 'error');
    } finally {
      setIsGeneratingMore(false);
    }
  };

  const handleToggleComplete = (projId: string, currentCompleted?: boolean) => {
    toggleProjectCompleted(projId);
    if (!currentCompleted) {
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.7 } });
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (filterType === 'saved') return p.is_saved;
    if (filterType === 'completed') return p.is_completed;
    return true;
  });

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Targeted Proof-of-Work Recommendations</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Portfolio Project Recommendations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Designed specifically to resolve your current skill gaps in {currentCareer.name}.
          </p>
        </div>

        <button
          onClick={handleGenerateMoreProjects}
          disabled={isGeneratingMore}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors self-start md:self-auto cursor-pointer"
        >
          {isGeneratingMore ? (
            <>
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
              <span>Synthesizing Projects...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate AI Projects</span>
            </>
          )}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Recommended ({projects.length})
          </button>
          <button
            onClick={() => setFilterType('saved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'saved' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Saved / Bookmarked ({projects.filter((p) => p.is_saved).length})
          </button>
          <button
            onClick={() => setFilterType('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'completed' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed Portfolio ({projects.filter((p) => p.is_completed).length})
          </button>
        </div>

        <span className="text-xs text-slate-400 font-mono hidden sm:inline">
          {projects.filter((p) => p.is_completed).length} of {projects.length} completed
        </span>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => {
          const isCompleted = project.is_completed;
          const isSaved = project.is_saved;

          return (
            <div
              key={project.id}
              className={`rounded-3xl border p-6 space-y-4 transition-all flex flex-col justify-between shadow-2xs ${
                isCompleted
                  ? 'bg-emerald-50/30 border-emerald-200'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-mono font-bold">
                      {project.difficulty} • {project.portfolio_impact} Impact
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 mt-1">
                      {project.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => toggleProjectSaved(project.id)}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      isSaved
                        ? 'bg-amber-50 text-amber-600 border-amber-200'
                        : 'text-slate-400 hover:text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                    title={isSaved ? 'Remove Bookmark' : 'Bookmark Project'}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
                  </button>
                </div>

                {/* Problem Statement */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-800">Problem:</strong> {project.problem_statement}
                </p>

                {/* Key Features */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Core Engineering Features:
                  </span>
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-0.5">
                    {project.key_features.map((feat, fIdx) => (
                      <li key={fIdx}>{feat}</li>
                    ))}
                  </ul>
                </div>

                {/* Skills Practiced Badges */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Skills Practiced:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {project.skills_practiced.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-mono border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Expected Learning Outcome */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  <strong className="text-slate-800 block mb-0.5">Learning Outcome:</strong>
                  {project.expected_learning_outcome}
                </div>
              </div>

              {/* Bottom Footer Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>~{project.estimated_days} days effort</span>
                </div>

                <button
                  onClick={() => handleToggleComplete(project.id, isCompleted)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isCompleted
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isCompleted ? 'Completed' : 'Mark Completed'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
