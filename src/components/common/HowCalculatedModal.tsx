import React from 'react';
import { X, Calculator, ShieldCheck, Scale, AlertTriangle, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HowCalculatedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowCalculatedModal: React.FC<HowCalculatedModalProps> = ({ isOpen, onClose }) => {
  const { gapAnalysis, currentCareer } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">How is Skill Match Calculated?</h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">Mathematical Framework & Scoring Transparency</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 transition-colors hover:bg-slate-100"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Essential Academic Disclaimers */}
        <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 flex gap-3 text-amber-900 text-xs leading-relaxed">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Project Framework Notice:</span> The CareerLens AI match percentage is an academic curriculum alignment index based on our structured domain skill models. It is <span className="font-semibold underline">not</span> a guarantee of employment, job offer probability, or recruiter qualification.
          </div>
        </div>

        {/* The Exact Formula */}
        <div className="bg-slate-900 text-white rounded-xl p-5 font-mono text-sm space-y-3 shadow-inner">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider font-sans font-semibold">
            <span>Primary Formula</span>
            <span>Deterministic Scoring</span>
          </div>
          <div className="text-base text-indigo-300 font-bold bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            Skill Match % = (∑ Earned Weighted Points / ∑ Total Required Points) × 100
          </div>
          <div className="text-xs text-slate-300 space-y-1 font-sans">
            <div>
              Current Result for <strong className="text-white">{currentCareer.name}</strong>:
            </div>
            <div className="text-indigo-200 font-mono text-xs">
              {gapAnalysis.matched_weighted_points} earned / {gapAnalysis.total_weighted_points} total required = <strong className="text-white text-sm">{gapAnalysis.overall_match_percentage}%</strong>
            </div>
          </div>
        </div>

        {/* Weights Breakdown */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Scale className="w-4 h-4 text-indigo-600" />
            Weighted Skill Categories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/50 space-y-1">
              <div className="font-bold text-indigo-950 flex items-center justify-between">
                <span>Core Tech Skills</span>
                <span className="px-2 py-0.5 rounded bg-indigo-200/60 text-indigo-800 font-mono font-bold">Weight 3 (30 pts)</span>
              </div>
              <p className="text-slate-600 leading-normal">
                Indispensable foundations (e.g. SQL, Python, Pandas, React). Highest curriculum priority.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-sky-100 bg-sky-50/50 space-y-1">
              <div className="font-bold text-sky-950 flex items-center justify-between">
                <span>Tools & Platforms</span>
                <span className="px-2 py-0.5 rounded bg-sky-200/60 text-sky-800 font-mono font-bold">Weight 2 (20 pts)</span>
              </div>
              <p className="text-slate-600 leading-normal">
                Daily tools & frameworks (Power BI, Git, Docker, Postgres). Practical workflow enablers.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>Supporting & Soft</span>
                <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-mono font-bold">Weight 1-2 (10-20 pts)</span>
              </div>
              <p className="text-slate-600 leading-normal">
                Statistics, communication, problem solving, and agile collaboration etiquette.
              </p>
            </div>
          </div>
        </div>

        {/* Match Classification Rules */}
        <div className="space-y-3 border-t border-slate-100 pt-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Classification & Partial Credit Rules
          </h3>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-start gap-2.5 p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0"></span>
              <div>
                <strong className="text-emerald-900">Strong Match (100% credit):</strong> Student proficiency matches or exceeds the required level (e.g., student is Intermediate or Advanced when Intermediate is required).
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-2 rounded-lg bg-amber-50/60 border border-amber-100">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1 shrink-0"></span>
              <div>
                <strong className="text-amber-900">Partial Match (50% - 67% credit):</strong> Student has beginner exposure, but the role framework requires Intermediate or Advanced depth. Partial credit is awarded proportionally.
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-2 rounded-lg bg-rose-50/60 border border-rose-100">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-1 shrink-0"></span>
              <div>
                <strong className="text-rose-900">Missing (0% credit):</strong> Skill is completely absent from the student profile, requiring dedicated study and practice projects.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-sm font-medium transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
