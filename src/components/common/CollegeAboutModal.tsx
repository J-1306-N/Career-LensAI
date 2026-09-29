import React from 'react';
import { X, GraduationCap, Target, Lightbulb, Compass, Award, Database, Cpu, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CollegeAboutModal: React.FC = () => {
  const { isAboutModalOpen, setIsAboutModalOpen, resetToDemoStudent, setActiveTab } = useApp();

  if (!isAboutModalOpen) return null;

  const startDemoGuide = () => {
    resetToDemoStudent();
    setIsAboutModalOpen(false);
    setActiveTab('dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 md:p-8 space-y-6">
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">CareerLens AI</h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  College Capstone Documentation
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                AI-Powered Career Readiness & Skill Gap Analyzer • Computer Science / Data Science Project
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAboutModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 transition-colors hover:bg-slate-100"
            aria-label="Close project info"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Run Banner */}
        <div className="bg-gradient-to-r from-indigo-500 to-violet-600 rounded-xl p-4 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-indigo-500/10">
          <div>
            <h4 className="font-bold text-sm">Evaluating this project right now?</h4>
            <p className="text-xs text-indigo-100 mt-0.5">
              Load the evaluator demo account (Jeffry A, Data Analyst) to test the end-to-end flow in 3 minutes.
            </p>
          </div>
          <button
            onClick={startDemoGuide}
            className="px-4 py-2 bg-white text-indigo-700 hover:bg-indigo-50 text-xs font-bold rounded-lg shrink-0 shadow-sm transition-transform active:scale-95"
          >
            Launch Evaluator Demo Flow
          </button>
        </div>

        {/* Section 1: Problem Statement */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-4 h-4 text-rose-500" />
            1. Core Problem Statement
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            Many university engineering and computer science undergraduates know their intended career title (such as Data Analyst, Python Backend Developer, or ML Engineer) but face substantial information asymmetry. They struggle to know:
            <br />
            <strong>(a)</strong> What specific technical and behavioral competencies real roles actually require,
            <br />
            <strong>(b)</strong> Exactly which skills their current college coursework has already satisfied vs which are missing,
            <br />
            <strong>(c)</strong> What learning sequence and practical capstone projects they must build to become interview-ready.
          </p>
        </div>

        {/* Section 2: Proposed Solution */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            2. Proposed Solution
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <strong>CareerLens AI</strong> creates an end-to-end personalized development pathway. By evaluating student resumes and self-reported skills against an open, extensible career matrix, the system calculates transparent mathematical alignment metrics, synthesizes a dynamic 5-phase learning roadmap, curates hands-on practice problems, recommends customized portfolio projects, and runs realistic AI-powered mock interviews.
          </p>
        </div>

        {/* Section 3: Project Objectives */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            3. Project Objectives
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
            <div className="flex items-start gap-2 p-2.5 rounded-lg border border-slate-200 bg-white">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Identify Existing Skills:</strong> Ingest resumes and student inputs with entity extraction.</span>
            </div>
            <div className="flex items-start gap-2 p-2.5 rounded-lg border border-slate-200 bg-white">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Detect Skill Gaps:</strong> Contrast against 6 extensible tech career frameworks.</span>
            </div>
            <div className="flex items-start gap-2 p-2.5 rounded-lg border border-slate-200 bg-white">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Personalize Learning Paths:</strong> Generate tailored 5-phase roadmaps from fundamentals to interview prep.</span>
            </div>
            <div className="flex items-start gap-2 p-2.5 rounded-lg border border-slate-200 bg-white">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>AI Practice & Interview:</strong> Provide real-time rubric feedback and situational drill questions.</span>
            </div>
          </div>
        </div>

        {/* Section 4: System Architecture & Data Model */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-violet-600" />
            4. System Architecture
          </h3>
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 space-y-2 font-mono">
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="px-2 py-1 bg-white rounded border border-slate-200 font-semibold text-indigo-600">Frontend: React 19 + TypeScript + Tailwind</span>
              <span className="px-2 py-1 bg-white rounded border border-slate-200 font-semibold text-emerald-600">Backend: Express.js (Node.js)</span>
              <span className="px-2 py-1 bg-white rounded border border-slate-200 font-semibold text-amber-600">AI: @google/genai (gemini-3.8-flash)</span>
              <span className="px-2 py-1 bg-white rounded border border-slate-200 font-semibold text-sky-600">State & Storage: Context API + LocalStorage</span>
            </div>
            <p className="text-slate-600 font-sans text-xs">
              All Gemini API calls are strictly handled server-side through protected proxy routes (`/api/gemini/*`), ensuring total zero client credential exposure and automatic fallback resilience.
            </p>
          </div>
        </div>

        {/* Section 5: Future Scope */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-4 h-4 text-teal-600" />
            5. Future Scope & Roadmap
          </h3>
          <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <li><strong>Live Job Market Scraping:</strong> Ingest real-time Indeed/LinkedIn job descriptions to dynamically adapt weighting formulas.</li>
            <li><strong>LMS Platform Integration:</strong> Automatically sync progress from Coursera, LeetCode, GitHub, and edX APIs.</li>
            <li><strong>Multilingual Support:</strong> Offer career guidance and interview simulators in regional and global languages.</li>
            <li><strong>Enterprise Recruiter Portal:</strong> Allow verified campus recruiters to search anonymized competency profiles.</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono">
            College Evaluator Version 1.0
          </div>
          <button
            onClick={() => setIsAboutModalOpen(false)}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold transition-colors"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
