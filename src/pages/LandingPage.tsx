import React from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
  Target,
  Milestone,
  Bot,
  FolderGit2,
  CheckCircle2,
  GraduationCap,
  ChevronRight,
  Users,
  Compass,
  LogIn,
  UserPlus,
  UserCheck,
  ShieldCheck,
  Award,
  Layers,
  Code2,
  Database,
  BarChart3,
  Cpu,
  Globe,
  Binary,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CAREERS_DATA } from '../data/careersData';
import { DEMO_CREDENTIALS } from '../data/demoData';

export const LandingPage: React.FC = () => {
  const { setActiveTab, loginWithDemo, setIsAboutModalOpen } = useApp();

  const handleStartDemo = () => {
    loginWithDemo();
  };

  const handleGetStarted = () => {
    setActiveTab('register');
  };

  const handleLogin = () => {
    setActiveTab('login');
  };

  const careerIcons: Record<string, React.ReactNode> = {
    'python-developer': <Code2 className="w-5 h-5 text-indigo-500" />,
    'software-developer': <Layers className="w-5 h-5 text-sky-500" />,
    'data-analyst': <BarChart3 className="w-5 h-5 text-teal-500" />,
    'data-scientist': <Cpu className="w-5 h-5 text-amber-500" />,
    'machine-learning-engineer': <Binary className="w-5 h-5 text-rose-500" />,
    'web-developer': <Globe className="w-5 h-5 text-violet-500" />,
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Top Banner / Evaluator Demo Quick Pill */}
      <div className="max-w-4xl mx-auto -mt-2">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-indigo-50 border border-indigo-200/80 text-xs text-indigo-900 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold">College Project Demo Ready:</span>
            <span className="text-indigo-700 hidden sm:inline">
              Login with <strong className="font-mono text-slate-800">{DEMO_CREDENTIALS.email}</strong> / <strong className="font-mono text-slate-800">{DEMO_CREDENTIALS.password}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStartDemo}
              className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
            >
              1-Click Demo Login
            </button>
            <button
              onClick={() => setIsAboutModalOpen(true)}
              className="px-2.5 py-1 rounded-lg border border-indigo-200 hover:bg-white text-indigo-800 font-semibold text-[11px] transition-colors cursor-pointer"
            >
              Project Docs
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-14 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white px-6 md:px-12 border border-slate-800 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none"></div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI-Powered Career Readiness & Skill Gap Analyzer</span>
          </div>

          {/* Core Tagline requested by user */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Understand your skills. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-teal-300">
                Discover your gaps. Build your career.
              </span>
            </h1>
          </div>

          <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            CareerLens AI empowers Computer Science and Data Science students to transition confidently from coursework to campus recruitment. Evaluate your academic background and resume against real industry frameworks, get an explainable math score, dynamic 5-phase roadmap, and AI interview simulations.
          </p>

          {/* Primary Action Buttons: Get Started & Login */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={handleGetStarted}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleLogin}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-indigo-400" />
              <span>Login</span>
            </button>

            <button
              onClick={handleStartDemo}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20 font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-xs"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Demo Account (Jeffry A)</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-800/80 text-center">
            <div>
              <div className="text-2xl md:text-3xl font-extrabold text-indigo-400 font-mono">6</div>
              <div className="text-xs text-slate-400 mt-1">Configurable Career Frameworks</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-extrabold text-sky-400 font-mono">5-Phase</div>
              <div className="text-xs text-slate-400 mt-1">Dynamic Roadmaps</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-extrabold text-teal-400 font-mono">100%</div>
              <div className="text-xs text-slate-400 mt-1">Transparent Math Scoring</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-extrabold text-amber-400 font-mono">AI Mock</div>
              <div className="text-xs text-slate-400 mt-1">Interactive Interview Engine</div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Career Trajectories */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 font-mono">
            Structured Industry Frameworks
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            Targeted Tech Career Frameworks
          </h2>
          <p className="text-xs md:text-sm text-slate-500">
            Each role features weighted competencies: core technical skills, supporting tech, modern developer tools, and soft skills.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CAREERS_DATA.map((career) => (
            <div
              key={career.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {careerIcons[career.id] || <Code2 className="w-5 h-5 text-indigo-600" />}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                    {career.skills.length} Competencies
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base">{career.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {career.tagline}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {career.skills.slice(0, 4).map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-50/70 text-indigo-700 border border-indigo-100"
                    >
                      {s.skill_name}
                    </span>
                  ))}
                  {career.skills.length > 4 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400">
                      +{career.skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Weighted Scoring</span>
                <button
                  onClick={handleGetStarted}
                  className="font-bold text-indigo-600 group-hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Analyze Skills</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The 12-Step Journey Pipeline */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 font-mono">
            End-To-End Student Flow
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            From Coursework to Interview Readiness
          </h2>
          <p className="text-xs md:text-sm text-slate-500">
            Every step connects directly to the next, giving college students structured clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 relative group hover:border-indigo-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-base">Profile & Resume Ingestion</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload your resume or enter coursework. Our extraction engine detects programming languages, databases, tools, and project history into clean, structured data.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 relative group hover:border-indigo-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-base">Mathematical Gap Analysis</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Transparently compares your competencies against weighted industry requirements. Categorizes every skill into Strong Match, Partial Match, or Missing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 relative group hover:border-indigo-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-base">Personalized 5-Phase Roadmap</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No generic templates. Your roadmap prioritizes fundamentals, core tech, advanced scalability, portfolio projects, and interview drills tailored to your exact gaps.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 relative group hover:border-indigo-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h3 className="font-bold text-slate-900 text-base">AI Practice & Interactive Drills</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tackle conceptual, multiple choice, coding, and scenario questions. Receive instant rubric feedback, point breakdowns, and targeted follow-up drills.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 relative group hover:border-indigo-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm">
              05
            </div>
            <h3 className="font-bold text-slate-900 text-base">Targeted Project Recommendations</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Build resume-worthy proof-of-work. Receive custom project briefs (e.g. Sales Cohort Analysis or Automated CSV Pipeline) that target your missing competencies.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 relative group hover:border-indigo-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 text-violet-600 flex items-center justify-center font-bold text-sm">
              06
            </div>
            <h3 className="font-bold text-slate-900 text-base">AI Mock Interview Simulator</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Experience dynamic AI roleplay interviews (Technical, Behavioral, Mixed). Receive instant evaluations on conceptual coverage, communication clarity, and confidence.
            </p>
          </div>
        </div>
      </section>

      {/* College Project Architecture & Academic Notice */}
      <section className="p-8 rounded-3xl bg-slate-900 text-white space-y-6 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                College Software Engineering Project Dossier
              </h3>
              <p className="text-xs text-slate-400">
                Designed for University Faculty & Student Evaluators
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAboutModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 cursor-pointer self-start md:self-auto"
          >
            <span>Open Complete Project Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Transparent Math Formula</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Readiness score equals sum of matched weighted skills divided by total required framework skills. No black-box claims or pseudo-scientific hiring guarantees.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Users className="w-4 h-4 text-sky-400" />
              <span>Demo Student Preloaded</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Quickly test the platform using <strong>Jeffry A</strong> (2nd Year CS & Data Science undergraduate, Data Analyst aspirant) with pre-populated gaps and roadmaps.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Extensible Modular Design</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Career frameworks, skill catalogs, practice drill rubrics, and project matrices are structured as declarative TypeScript models ready for database migration.
            </p>
          </div>
        </div>

        {/* Bottom CTA on Landing Page */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm font-bold text-white">Ready to explore CareerLens AI?</p>
            <p className="text-xs text-slate-400">Create your student profile or jump right in with the demo account.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGetStarted}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md cursor-pointer transition-colors"
            >
              Get Started
            </button>
            <button
              onClick={handleLogin}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs cursor-pointer transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
