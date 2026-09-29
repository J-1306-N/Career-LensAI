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
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HowCalculatedModal } from '../components/common/HowCalculatedModal';
import { SkillGapDetail, SkillMatchStatus } from '../types';

export const SkillGapPage: React.FC = () => {
  const { currentCareer, gapAnalysis, setActiveTab } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isHowModalOpen, setIsHowModalOpen] = useState(false);
  const [selectedSkillModal, setSelectedSkillModal] = useState<SkillGapDetail | null>(null);

  // Filter skills
  const filteredSkills = gapAnalysis.all_evaluated_skills.filter((s) => {
    if (filterStatus !== 'all' && s.status !== filterStatus) return false;
    if (filterCategory !== 'all' && s.category_group !== filterCategory) return false;
    return true;
  });

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
            Skill Gap Analysis for {currentCareer.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent comparison between your current skill portfolio and our structured career matrix.
          </p>
        </div>

        <button
          onClick={() => setIsHowModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors self-start md:self-auto cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-indigo-300" />
          <span>How is this calculated?</span>
        </button>
      </div>

      {/* Summary Score Bar */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Overall Framework Readiness Index
            </div>
            <div className="text-3xl md:text-4xl font-black text-slate-900 font-mono mt-1 flex items-baseline gap-2">
              <span>{gapAnalysis.overall_match_percentage}%</span>
              <span className="text-xs font-sans text-slate-500 font-normal">
                ({gapAnalysis.matched_weighted_points} of {gapAnalysis.total_weighted_points} weighted points earned)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('roadmap')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <span>View Generated Roadmap</span>
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
              Strong Matches ({gapAnalysis.strong_matches_count})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              Partial Matches ({gapAnalysis.partial_matches_count})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              Missing Competencies ({gapAnalysis.missing_skills_count})
            </span>
          </div>
        </div>
      </div>

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
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors flex items-center gap-1"
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

      <HowCalculatedModal isOpen={isHowModalOpen} onClose={() => setIsHowModalOpen(false)} />
    </div>
  );
};
