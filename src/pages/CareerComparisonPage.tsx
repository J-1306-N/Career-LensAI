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
  Search,
  Filter,
  Sparkles,
  ShieldAlert,
  Compass,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CAREERS_DATA } from '../data/careersData';
import { CAREER_DOMAINS, CareerDomain } from '../data/careerFrameworksData';
import { analyzeSkillGaps } from '../services/gapEngine';

export const CareerComparisonPage: React.FC = () => {
  const { student, studentSkills, setSelectedCareerId, setActiveTab, showToast } = useApp();

  const [activeView, setActiveView] = useState<'options' | 'compare'>('options');
  const [selectedIds, setSelectedIds] = useState<string[]>(['data-analyst', 'python-developer', 'software-developer']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

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

  // Calculate alignment for ALL careers
  const allCareerAnalyses = useMemo(() => {
    return CAREERS_DATA.map((career) => {
      const analysis = analyzeSkillGaps(career.id, studentSkills, student.id);
      return {
        career,
        analysis,
      };
    });
  }, [studentSkills, student.id]);

  // Filtered list for "Career Options Based on Your Current Skills"
  const filteredOptions = useMemo(() => {
    return allCareerAnalyses
      .filter(({ career, analysis }) => {
        // Domain filter
        if (selectedDomain !== 'All' && career.domain !== selectedDomain) {
          return false;
        }
        // Status filter
        if (statusFilter !== 'All' && analysis.career_alignment_status !== statusFilter) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = career.name.toLowerCase().includes(q);
          const matchDomain = career.domain?.toLowerCase().includes(q);
          const matchSkill = career.skills.some((s) => s.skill_name.toLowerCase().includes(q));
          if (!matchName && !matchDomain && !matchSkill) return false;
        }
        return true;
      })
      .sort((a, b) => b.analysis.overall_match_percentage - a.analysis.overall_match_percentage);
  }, [allCareerAnalyses, selectedDomain, statusFilter, searchQuery]);

  // Selected careers for side-by-side comparison
  const sideBySideComparisons = useMemo(() => {
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
      <div className="border-b border-slate-200 pb-5 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>Multi-Track Skill Alignment Engine</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
              Career Options Based on Your Current Skills
            </h1>
            <p className="text-xs text-slate-500 max-w-3xl leading-relaxed mt-0.5">
              Deterministic skill-to-career mapping evaluating your exact verified competencies against industry-standard role requirements across 24+ engineering and technology domains.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0 border border-slate-200">
            <button
              onClick={() => setActiveView('options')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeView === 'options'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Career Options ({allCareerAnalyses.length})
            </button>
            <button
              onClick={() => setActiveView('compare')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeView === 'compare'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Side-by-Side Compare ({selectedIds.length}/3)
            </button>
          </div>
        </div>

        {/* Factual Disclaimer Banner (Mandatory per Section 3) */}
        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold">Skill Alignment Disclaimer:</strong> This evaluation measures curriculum and technical skill compatibility based strictly on configured role matrices. It represents skill alignment only and does NOT guarantee employment, placement, or salary outcomes.
          </div>
        </div>
      </div>

      {activeView === 'options' ? (
        /* ========================================================================= */
        /* TAB 1: ALL CAREER OPTIONS BASED ON CURRENT SKILLS                        */
        /* ========================================================================= */
        <div className="space-y-6">
          {/* Controls: Search, Domain Filter, Status Filter */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search role or skill (e.g. SQL, React, Cloud)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white"
                />
              </div>

              {/* Domain Filter */}
              <div>
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white font-medium text-slate-700 cursor-pointer"
                >
                  <option value="All">All Domains ({CAREER_DOMAINS.length - 1} tech areas)</option>
                  {CAREER_DOMAINS.filter((d) => d !== 'All').map((dom) => (
                    <option key={dom} value={dom}>
                      {dom}
                    </option>
                  ))}
                </select>
              </div>

              {/* Alignment Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white font-medium text-slate-700 cursor-pointer"
                >
                  <option value="All">All Alignment Statuses</option>
                  <option value="Good skill alignment">Good skill alignment (70%+)</option>
                  <option value="Possible with additional preparation">Possible with additional prep (40%-69%)</option>
                  <option value="Significant skill gaps">Significant skill gaps (&lt;40%)</option>
                </select>
              </div>
            </div>

            {/* Quick Status Legend */}
            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                Status Legend:
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <strong>Good skill alignment</strong> (70%+)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <strong>Possible with additional preparation</strong> (40–69%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <strong>Significant skill gaps</strong> (&lt;40%)
              </span>
            </div>
          </div>

          {/* Role Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredOptions.map(({ career, analysis }) => {
              const statusColors = {
                'Good skill alignment': {
                  badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                  dot: 'bg-emerald-500',
                  icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
                },
                'Possible with additional preparation': {
                  badge: 'bg-amber-50 text-amber-800 border-amber-200',
                  dot: 'bg-amber-400',
                  icon: <AlertCircle className="w-3.5 h-3.5 text-amber-600" />,
                },
                'Significant skill gaps': {
                  badge: 'bg-rose-50 text-rose-800 border-rose-200',
                  dot: 'bg-rose-500',
                  icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
                },
              }[analysis.career_alignment_status];

              return (
                <div
                  key={career.id}
                  className="rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-5 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 font-mono">
                            {career.domain}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {career.skills.length} Required Skills
                          </span>
                        </div>
                        <h3 className="font-extrabold text-base text-slate-900 mt-1">
                          {career.name}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                          {career.tagline}
                        </p>
                      </div>

                      {/* Match percentage score */}
                      <div className="text-right shrink-0">
                        <div className="text-2xl font-black text-slate-900 font-mono">
                          {analysis.overall_match_percentage}%
                        </div>
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">
                          Alignment
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusColors.badge}`}>
                        {statusColors.icon}
                        <span>{analysis.career_alignment_status}</span>
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                      <div
                        className="bg-emerald-500 h-full"
                        style={{
                          width: `${(analysis.strong_matches.length / (career.skills.length || 1)) * 100}%`,
                        }}
                        title="Strong Matches"
                      ></div>
                      <div
                        className="bg-amber-400 h-full"
                        style={{
                          width: `${(analysis.partial_matches.length / (career.skills.length || 1)) * 100}%`,
                        }}
                        title="Partial Matches"
                      ></div>
                    </div>

                    {/* Detailed Skill Breakdown: Matching, Needing Improvement, Missing */}
                    <div className="space-y-2.5 pt-1 text-xs">
                      {/* Matching Skills */}
                      <div>
                        <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Matching Skills ({analysis.strong_matches_count}):</span>
                        </div>
                        {analysis.strong_matches.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {analysis.strong_matches.map((s) => (
                              <span
                                key={s.skill_id}
                                className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-medium"
                              >
                                {s.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-400 italic">No matching skills yet</p>
                        )}
                      </div>

                      {/* Needs Improvement */}
                      {analysis.partial_matches.length > 0 && (
                        <div>
                          <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            <span>Skills Needing Improvement ({analysis.partial_matches_count}):</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {analysis.partial_matches.map((s) => (
                              <span
                                key={s.skill_id}
                                className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-medium"
                              >
                                {s.name} (Needs {s.required_level})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Missing Skills */}
                      {analysis.missing_skills.length > 0 && (
                        <div>
                          <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>Missing Skills ({analysis.missing_skills_count}):</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {analysis.missing_skills.slice(0, 5).map((s) => (
                              <span
                                key={s.skill_id}
                                className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-medium"
                              >
                                {s.name}
                              </span>
                            ))}
                            {analysis.missing_skills.length > 5 && (
                              <span className="text-[10px] text-slate-400 font-mono self-center">
                                +{analysis.missing_skills.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      onClick={() => handleToggleCareer(career.id)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                        selectedIds.includes(career.id)
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {selectedIds.includes(career.id) ? '✓ In Comparison' : '+ Compare Side-by-Side'}
                    </button>

                    <button
                      onClick={() => handleSetPrimaryCareer(career.id, career.name)}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Set as Target Goal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredOptions.length === 0 && (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <p className="text-slate-500 text-sm">
                No career paths match your query or filter criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDomain('All');
                  setStatusFilter('All');
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ========================================================================= */
        /* TAB 2: SIDE-BY-SIDE COMPARISON (WHAT-IF ANALYSIS)                        */
        /* ========================================================================= */
        <div className="space-y-6">
          {/* Career Selector Pills */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <span className="text-xs font-bold text-slate-700 block">
              Select Careers to Compare (Max 3):
            </span>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
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
            {sideBySideComparisons.map(({ career, analysis }) => (
              <div
                key={career.id}
                className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                {/* Top Card Header */}
                <div className="p-6 bg-slate-50/70 border-b border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      {career.domain}
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

                  {/* Status */}
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    analysis.status_color === 'green'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : analysis.status_color === 'yellow'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}>
                    <span>{analysis.career_alignment_status}</span>
                  </span>

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
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <span>Make Primary Goal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
