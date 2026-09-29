import React, { useState } from 'react';
import {
  Menu,
  Sparkles,
  BookOpen,
  User,
  RotateCcw,
  Briefcase,
  ChevronDown,
  LogOut,
  Settings,
  LogIn,
  UserPlus,
  Shield,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CAREERS_DATA } from '../../data/careersData';

interface HeaderProps {
  onToggleMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav }) => {
  const {
    isAuthenticated,
    currentUser,
    logout,
    student,
    selectedCareerId,
    setSelectedCareerId,
    currentCareer,
    gapAnalysis,
    resetToDemoStudent,
    setIsAboutModalOpen,
    activeTab,
    setActiveTab,
  } = useApp();

  const [isCareerDropdownOpen, setIsCareerDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleBrandClick = () => {
    if (isAuthenticated) {
      setActiveTab('dashboard');
    } else {
      setActiveTab('landing');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-4 lg:px-8 py-2.5 transition-all">
      <div className="flex items-center justify-between gap-4 max-w-[1600px] mx-auto">
        {/* Left: Mobile Nav Button (if logged in) + Brand */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              onClick={onToggleMobileNav}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div
            onClick={handleBrandClick}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-sm shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              CL
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  CareerLens<span className="text-indigo-600">AI</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  College Ed.
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Skill Gap & Career Readiness Platform
              </p>
            </div>
          </div>
        </div>

        {/* Center: Target Career Switcher (Only if logged in) */}
        {isAuthenticated && (
          <div className="relative hidden md:block">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                Target Career:
              </span>
              <div className="relative">
                <button
                  onClick={() => setIsCareerDropdownOpen(!isCareerDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
                >
                  <span>{currentCareer.name}</span>
                  <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px]">
                    {gapAnalysis.overall_match_percentage}% Ready
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {isCareerDropdownOpen && (
                  <div className="absolute left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      Select Career Framework
                    </div>
                    {CAREERS_DATA.map((career) => (
                      <button
                        key={career.id}
                        onClick={() => {
                          setSelectedCareerId(career.id);
                          setIsCareerDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                          career.id === selectedCareerId ? 'font-bold text-indigo-600 bg-indigo-50/50' : 'text-slate-700'
                        }`}
                      >
                        <span>{career.name}</span>
                        {career.id === selectedCareerId && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Right Section: Based on Auth Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* College Evaluator Guide Button */}
          <button
            onClick={() => setIsAboutModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-900 hover:bg-amber-100 text-xs font-semibold transition-colors cursor-pointer"
            title="Read Problem Statement, Solution, Objectives, and Evaluator Demo Guide"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">Project Info / Docs</span>
            <span className="sm:hidden">Docs</span>
          </button>

          {!isAuthenticated ? (
            /* Logged-Out Actions: Login & Get Started */
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('login')}
                className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'login'
                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>

              <button
                onClick={() => setActiveTab('register')}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Get Started</span>
              </button>
            </div>
          ) : (
            /* Logged-In Actions: Reset Demo + User Menu */
            <>
              {/* Quick Demo Reset */}
              <button
                onClick={resetToDemoStudent}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer"
                title="Reset to default demo data for Jeffry A (Data Analyst)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo</span>
              </button>

              {/* User Dropdown Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    {student.name.charAt(0) || 'U'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-slate-800 leading-none">
                      {student.name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5 leading-none">
                      {currentCareer.name}
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 ml-0.5" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{student.name}</p>
                      <p className="text-[11px] text-slate-500 truncate font-mono">
                        {currentUser?.email || student.email || 'student@careerlens.ai'}
                      </p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setActiveTab('settings');
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-400" />
                        <span>Profile & Settings</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setActiveTab('report');
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors cursor-pointer"
                      >
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        <span>Career Readiness Report</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                        <span>Sign Out / Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
