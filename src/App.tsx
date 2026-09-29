import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Toast } from './components/common/Toast';
import { CollegeAboutModal } from './components/common/CollegeAboutModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ResumeAnalyzerPage } from './pages/ResumeAnalyzerPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { CareerComparisonPage } from './pages/CareerComparisonPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { PracticeCenterPage } from './pages/PracticeCenterPage';
import { InterviewSimulatorPage } from './pages/InterviewSimulatorPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProgressTrackerPage } from './pages/ProgressTrackerPage';
import { CareerReportPage } from './pages/CareerReportPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';

const AppContent: React.FC = () => {
  const { activeTab, isAuthenticated } = useApp();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // If user is NOT authenticated, only show public logged-out pages
  if (!isAuthenticated) {
    const renderLoggedOutPage = () => {
      switch (activeTab) {
        case 'login':
          return <LoginPage />;
        case 'register':
          return <RegisterPage />;
        case 'landing':
        default:
          return <LandingPage />;
      }
    };

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
        <Header onToggleMobileNav={() => {}} />

        <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 md:p-8 min-w-0">
          {renderLoggedOutPage()}
        </main>

        <Toast />
        <CollegeAboutModal />
      </div>
    );
  }

  // If user IS authenticated, check for onboarding
  const renderLoggedInPage = () => {
    switch (activeTab) {
      case 'onboarding':
        return <OnboardingPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'resume':
        return <ResumeAnalyzerPage />;
      case 'gap-analysis':
        return <SkillGapPage />;
      case 'compare-careers':
        return <CareerComparisonPage />;
      case 'roadmap':
        return <RoadmapPage />;
      case 'practice':
        return <PracticeCenterPage />;
      case 'interview':
        return <InterviewSimulatorPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'tracker':
        return <ProgressTrackerPage />;
      case 'report':
        return <CareerReportPage />;
      case 'settings':
        return <ProfileSettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  // If on onboarding wizard, render dedicated focused shell without sidebar distraction
  if (activeTab === 'onboarding') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
        <Header onToggleMobileNav={() => {}} />

        <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 min-w-0">
          <OnboardingPage />
        </main>

        <Toast />
        <CollegeAboutModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Header onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)} />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar
          isMobileOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
        />

        <main className="flex-1 p-4 md:p-8 min-w-0 overflow-x-hidden">
          {renderLoggedInPage()}
        </main>
      </div>

      <Toast />
      <CollegeAboutModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
