import React from 'react';
import {
  LayoutDashboard,
  FileText,
  GitCompare,
  Milestone,
  CheckSquare,
  Bot,
  FolderGit2,
  LineChart,
  FileCheck2,
  Settings,
  GraduationCap,
  Sparkles,
  TrendingUp,
  LogOut,
  ChevronRight,
  User,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { activeTab, setActiveTab, gapAnalysis, setIsAboutModalOpen, logout, student, currentUser } = useApp();

  const mainJourneyItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: `${gapAnalysis.overall_match_percentage}%` },
    { id: 'resume', label: 'Resume Analyzer', icon: FileText },
    { id: 'gap-analysis', label: 'Skill Gap', icon: TrendingUp, badge: `${gapAnalysis.missing_skills_count} gaps` },
    { id: 'compare-careers', label: 'Career Comparison', icon: GitCompare },
    { id: 'roadmap', label: 'Learning Roadmap', icon: Milestone },
    { id: 'practice', label: 'Practice Center', icon: CheckSquare },
    { id: 'interview', label: 'AI Interview', icon: Bot, isNew: true },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'tracker', label: 'Progress', icon: LineChart },
    { id: 'report', label: 'Career Report', icon: FileCheck2 },
    { id: 'settings', label: 'Profile', icon: Settings },
  ];

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    onCloseMobile();
  };

  const handleLogout = () => {
    onCloseMobile();
    logout();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-[57px] left-0 z-40 w-64 h-screen lg:h-[calc(100vh-57px)] bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {/* User Quick Info */}
          <div className="px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {student.name.charAt(0) || 'S'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate leading-tight">
                {student.name}
              </p>
              <p className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">
                {currentUser?.email || student.email || 'student@careerlens.ai'}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="px-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Platform Journey
            </div>
            <div className="space-y-0.5 mt-1">
              {mainJourneyItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.badge && (
                        <span
                          className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                            isActive
                              ? 'bg-indigo-700/80 text-white'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {item.isNew && !isActive && (
                        <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          AI
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Actions: Project Guide + Logout */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70 space-y-2">
          <button
            onClick={() => setIsAboutModalOpen(true)}
            className="w-full p-2.5 rounded-xl border border-indigo-100 bg-white hover:bg-indigo-50/50 transition-colors text-left group flex items-start gap-2.5 shadow-2xs cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>College Evaluator</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                Docs & Architecture Guide
              </p>
            </div>
          </button>

          {/* Clearly visible Logout button requested in prompt */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer group"
          >
            <LogOut className="w-4 h-4 text-rose-500 group-hover:text-rose-600" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
