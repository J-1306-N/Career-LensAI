import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Student,
  StudentSkill,
  Career,
  SkillGapAnalysisResult,
  RoadmapPhase,
  RoadmapItem,
  RoadmapStatus,
  ExtractedResumeData,
  PracticeSubmissionRecord,
  InterviewSession,
  ProjectRecommendation,
  ProficiencyLevel,
  UserAccount,
} from '../types';
import { DEMO_STUDENT, DEMO_STUDENT_SKILLS, INITIAL_PROJECT_RECOMMENDATIONS, DEMO_CREDENTIALS } from '../data/demoData';
import { CAREERS_DATA } from '../data/careersData';
import { analyzeSkillGaps } from '../services/gapEngine';
import { generatePersonalizedRoadmap } from '../services/roadmapEngine';

interface AppContextType {
  // Authentication State
  isAuthenticated: boolean;
  currentUser: UserAccount | null;
  login: (email: string, password: string) => { success: boolean; message?: string };
  loginWithDemo: () => void;
  register: (name: string, email: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  completeOnboarding: (updates: {
    name: string;
    college: string;
    degree: string;
    department: string;
    year: string;
    semester: string;
    career_goal: string;
    skills: Array<{ name: string; category?: string; proficiency: ProficiencyLevel }>;
  }) => void;

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Student State
  student: Student;
  updateStudent: (updates: Partial<Student>) => void;
  resetToDemoStudent: () => void;

  // Career Selection
  selectedCareerId: string;
  setSelectedCareerId: (careerId: string) => void;
  currentCareer: Career;

  // Student Skills
  studentSkills: StudentSkill[];
  addStudentSkill: (skill: Omit<StudentSkill, 'student_id' | 'added_at'>) => void;
  updateSkillProficiency: (skillId: string, proficiency: ProficiencyLevel) => void;
  removeStudentSkill: (skillId: string) => void;
  bulkAddSkillsFromResume: (skills: Array<{ name: string; category: string; proficiency: ProficiencyLevel }>) => void;

  // Resume Data
  extractedResume: ExtractedResumeData | null;
  setExtractedResume: (data: ExtractedResumeData | null) => void;

  // Skill Gap Analysis
  gapAnalysis: SkillGapAnalysisResult;
  recomputeGapAnalysis: () => void;

  // Roadmap
  roadmapPhases: RoadmapPhase[];
  updateRoadmapItemStatus: (itemId: string, status: RoadmapStatus) => void;
  regenerateRoadmap: () => void;

  // Practice Center
  practiceHistory: PracticeSubmissionRecord[];
  addPracticeSubmission: (record: PracticeSubmissionRecord) => void;

  // Interview Simulator
  interviewSessions: InterviewSession[];
  activeInterviewSession: InterviewSession | null;
  startNewInterviewSession: (session: InterviewSession) => void;
  updateActiveInterviewSession: (updater: (prev: InterviewSession) => InterviewSession) => void;
  saveCompletedInterviewSession: (session: InterviewSession) => void;

  // Project Recommendations
  projects: ProjectRecommendation[];
  toggleProjectSaved: (projectId: string) => void;
  toggleProjectCompleted: (projectId: string) => void;

  // Notification Toast
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  clearToast: () => void;

  // College Evaluator Guide Modal
  isAboutModalOpen: boolean;
  setIsAboutModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  AUTH_SESSION: 'careerlens_auth_session_v1',
  REGISTERED_USERS: 'careerlens_registered_users_v1',
  STUDENT: 'careerlens_student_v1',
  SKILLS: 'careerlens_skills_v1',
  CAREER_ID: 'careerlens_career_id_v1',
  ROADMAP_ITEMS: 'careerlens_roadmap_items_v1',
  PRACTICE_HISTORY: 'careerlens_practice_v1',
  INTERVIEWS: 'careerlens_interviews_v1',
  PROJECTS: 'careerlens_projects_v1',
};

const DEFAULT_DEMO_USER: UserAccount = {
  id: 'user-demo',
  name: 'Jeffry A',
  email: DEMO_CREDENTIALS.email,
  password: DEMO_CREDENTIALS.password,
  has_completed_onboarding: true,
  created_at: new Date('2026-01-01').toISOString(),
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Registered Users list
  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return [DEFAULT_DEMO_USER];
    } catch {
      return [DEFAULT_DEMO_USER];
    }
  });

  // Current authenticated user session
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const session = sessionStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (session) {
        const parsed = JSON.parse(session);
        return parsed.user || null;
      }
      return null;
    } catch {
      return null;
    }
  });

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const session = sessionStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (session) {
        const parsed = JSON.parse(session);
        return Boolean(parsed.isAuthenticated);
      }
      return false;
    } catch {
      return false;
    }
  });

  // Active Tab: defaults to 'landing' when logged out
  const [activeTab, setActiveTab] = useState<string>(() => {
    try {
      const session = sessionStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (session) {
        const parsed = JSON.parse(session);
        if (parsed.isAuthenticated) {
          return parsed.lastTab || 'dashboard';
        }
      }
      return 'landing';
    } catch {
      return 'landing';
    }
  });

  // Student State
  const [student, setStudent] = useState<Student>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENT);
      return saved ? JSON.parse(saved) : DEMO_STUDENT;
    } catch {
      return DEMO_STUDENT;
    }
  });

  // Selected Career
  const [selectedCareerId, setSelectedCareerId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CAREER_ID);
      return saved || DEMO_STUDENT.career_goal;
    } catch {
      return DEMO_STUDENT.career_goal;
    }
  });

  // Skills
  const [studentSkills, setStudentSkills] = useState<StudentSkill[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SKILLS);
      return saved ? JSON.parse(saved) : DEMO_STUDENT_SKILLS;
    } catch {
      return DEMO_STUDENT_SKILLS;
    }
  });

  // Resume State
  const [extractedResume, setExtractedResume] = useState<ExtractedResumeData | null>(null);

  // Practice History
  const [practiceHistory, setPracticeHistory] = useState<PracticeSubmissionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRACTICE_HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Interview Sessions
  const [interviewSessions, setInterviewSessions] = useState<InterviewSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INTERVIEWS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeInterviewSession, setActiveInterviewSession] = useState<InterviewSession | null>(null);

  // Projects
  const [projects, setProjects] = useState<ProjectRecommendation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return saved ? JSON.parse(saved) : INITIAL_PROJECT_RECOMMENDATIONS;
    } catch {
      return INITIAL_PROJECT_RECOMMENDATIONS;
    }
  });

  // Saved Roadmap Items
  const [storedRoadmapItems, setStoredRoadmapItems] = useState<RoadmapItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROADMAP_ITEMS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Derived current career
  const currentCareer = useMemo(() => {
    return CAREERS_DATA.find((c) => c.id === selectedCareerId) || CAREERS_DATA[0];
  }, [selectedCareerId]);

  // Compute Skill Gap Analysis
  const gapAnalysis = useMemo(() => {
    return analyzeSkillGaps(selectedCareerId, studentSkills, student.id);
  }, [selectedCareerId, studentSkills, student.id]);

  // Generate Roadmap dynamically from gap analysis
  const roadmapPhases = useMemo(() => {
    return generatePersonalizedRoadmap(gapAnalysis, currentCareer, storedRoadmapItems);
  }, [gapAnalysis, currentCareer, storedRoadmapItems]);

  // Persist items
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(student));
    } catch {}
  }, [student]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(studentSkills));
    } catch {}
  }, [studentSkills]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CAREER_ID, selectedCareerId);
    } catch {}
  }, [selectedCareerId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRACTICE_HISTORY, JSON.stringify(practiceHistory));
    } catch {}
  }, [practiceHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(interviewSessions));
    } catch {}
  }, [interviewSessions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch {}
  }, [projects]);

  // Persist registered users
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(registeredUsers));
    } catch {}
  }, [registeredUsers]);

  // Sync auth session to sessionStorage for refresh persistence
  useEffect(() => {
    try {
      if (isAuthenticated && currentUser) {
        sessionStorage.setItem(
          STORAGE_KEYS.AUTH_SESSION,
          JSON.stringify({
            isAuthenticated: true,
            user: currentUser,
            lastTab: activeTab,
          })
        );
      } else {
        sessionStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
      }
    } catch {}
  }, [isAuthenticated, currentUser, activeTab]);

  // Route Guard: enforce that logged-out users cannot directly access dashboard or protected tools
  useEffect(() => {
    const publicTabs = ['landing', 'login', 'register'];
    if (!isAuthenticated && !publicTabs.includes(activeTab)) {
      setActiveTab('landing');
    }
  }, [isAuthenticated, activeTab]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const clearToast = () => setToast(null);

  // Authentication Actions
  const login = (email: string, password: string): { success: boolean; message?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // Check demo credentials directly
    if (
      cleanEmail === DEMO_CREDENTIALS.email.toLowerCase() &&
      cleanPass === DEMO_CREDENTIALS.password
    ) {
      loginWithDemo();
      return { success: true };
    }

    // Check registered accounts
    const user = registeredUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === cleanPass
    );

    if (!user) {
      return { success: false, message: 'Invalid email or password. Please verify and try again.' };
    }

    setCurrentUser(user);
    setIsAuthenticated(true);

    if (!user.has_completed_onboarding) {
      setActiveTab('onboarding');
      showToast(`Welcome back, ${user.name}! Please finish setting up your career profile.`);
    } else {
      setActiveTab('dashboard');
      showToast(`Signed in successfully! Welcome, ${user.name}.`);
    }

    return { success: true };
  };

  const loginWithDemo = () => {
    const demoAccount = DEFAULT_DEMO_USER;
    setCurrentUser(demoAccount);
    setIsAuthenticated(true);
    resetToDemoStudent();
    setActiveTab('dashboard');
    showToast('Signed in as Demo Student: Jeffry A (demo@careerlens.ai)');
  };

  const register = (
    name: string,
    email: string,
    password: string
  ): { success: boolean; message?: string } => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanName || cleanName.length < 2) {
      return { success: false, message: 'Please enter a valid full name (at least 2 characters).' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    if (cleanPass.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    const exists = registeredUsers.some((u) => u.email.toLowerCase() === cleanEmail);
    if (exists || cleanEmail === DEMO_CREDENTIALS.email.toLowerCase()) {
      return { success: false, message: 'An account with this email already exists. Please log in.' };
    }

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      password: cleanPass,
      has_completed_onboarding: false,
      created_at: new Date().toISOString(),
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);

    // Initialize fresh student profile for the new registrant
    const newStudent: Student = {
      id: `student-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      college: '',
      degree: '',
      department: '',
      year: '1st Year',
      semester: '1st Semester',
      career_goal: 'python-developer',
      current_skill_level: 'Beginner',
      areas_of_interest: [],
      updated_at: new Date().toISOString(),
    };

    setStudent(newStudent);
    setStudentSkills([]);
    setStoredRoadmapItems([]);
    setExtractedResume(null);
    setActiveInterviewSession(null);
    setSelectedCareerId('python-developer');

    // Send directly to the onboarding wizard
    setActiveTab('onboarding');
    showToast(`Account created! Let's set up your career profile.`);

    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    try {
      sessionStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    } catch {}
    setActiveTab('landing');
    showToast('You have been logged out successfully.', 'info');
  };

  const completeOnboarding = (updates: {
    name: string;
    college: string;
    degree: string;
    department: string;
    year: string;
    semester: string;
    career_goal: string;
    skills: Array<{ name: string; category?: string; proficiency: ProficiencyLevel }>;
  }) => {
    // 1. Update student profile
    setStudent((prev) => ({
      ...prev,
      name: updates.name.trim() || prev.name,
      college: updates.college.trim() || 'University Department of Computing',
      degree: updates.degree.trim() || 'BSc Computer Science',
      department: updates.department.trim() || 'Computer Science & Engineering',
      year: updates.year || '2nd Year',
      semester: updates.semester || '3rd Semester',
      career_goal: updates.career_goal || 'python-developer',
      updated_at: new Date().toISOString(),
    }));

    setSelectedCareerId(updates.career_goal || 'python-developer');

    // 2. Add selected skills
    const newStudentSkills: StudentSkill[] = updates.skills.map((s) => ({
      student_id: student.id,
      skill_id: s.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      skill_name: s.name,
      category: s.category || 'Core Tech',
      proficiency: s.proficiency,
      source: 'onboarding',
      added_at: new Date().toISOString(),
    }));

    setStudentSkills(newStudentSkills);

    // 3. Mark user as onboarded
    if (currentUser) {
      const updatedUser: UserAccount = {
        ...currentUser,
        has_completed_onboarding: true,
      };
      setCurrentUser(updatedUser);
      setRegisteredUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id ? updatedUser : u))
      );
    }

    // 4. Redirect to Dashboard
    setActiveTab('dashboard');
    showToast('Career profile created! Welcome to your CareerLens AI Dashboard. 🚀');
  };

  const updateStudent = (updates: Partial<Student>) => {
    setStudent((prev) => {
      const updated = { ...prev, ...updates, updated_at: new Date().toISOString() };
      if (updates.career_goal && updates.career_goal !== selectedCareerId) {
        setSelectedCareerId(updates.career_goal);
      }
      return updated;
    });
    showToast('Student profile updated successfully!');
  };

  const resetToDemoStudent = () => {
    setStudent(DEMO_STUDENT);
    setSelectedCareerId('data-analyst');
    setStudentSkills(DEMO_STUDENT_SKILLS);
    setProjects(INITIAL_PROJECT_RECOMMENDATIONS);
    setStoredRoadmapItems([]);
    setExtractedResume(null);
    setActiveInterviewSession(null);
    showToast('Reset to evaluator demo profile: Jeffry A (Data Analyst)');
  };

  const addStudentSkill = (newSkill: Omit<StudentSkill, 'student_id' | 'added_at'>) => {
    setStudentSkills((prev) => {
      const existingIdx = prev.findIndex(
        (s) => s.skill_id.toLowerCase() === newSkill.skill_id.toLowerCase() ||
               s.skill_name.toLowerCase() === newSkill.skill_name.toLowerCase()
      );

      const skillItem: StudentSkill = {
        ...newSkill,
        student_id: student.id,
        added_at: new Date().toISOString(),
      };

      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = skillItem;
        return copy;
      }
      return [...prev, skillItem];
    });
    showToast(`Added ${newSkill.skill_name} (${newSkill.proficiency})`);
  };

  const updateSkillProficiency = (skillId: string, proficiency: ProficiencyLevel) => {
    setStudentSkills((prev) =>
      prev.map((s) => (s.skill_id === skillId ? { ...s, proficiency } : s))
    );
    showToast(`Updated proficiency to ${proficiency}`);
  };

  const removeStudentSkill = (skillId: string) => {
    setStudentSkills((prev) => prev.filter((s) => s.skill_id !== skillId));
    showToast('Skill removed');
  };

  const bulkAddSkillsFromResume = (
    skillsToAdd: Array<{ name: string; category: string; proficiency: ProficiencyLevel }>
  ) => {
    setStudentSkills((prev) => {
      const existingNames = new Set(prev.map((s) => s.skill_name.toLowerCase()));
      const newItems: StudentSkill[] = [];

      skillsToAdd.forEach((item) => {
        const lower = item.name.toLowerCase();
        if (!existingNames.has(lower)) {
          const id = lower.replace(/[^a-z0-9]/g, '_');
          newItems.push({
            student_id: student.id,
            skill_id: id,
            skill_name: item.name,
            category: item.category,
            proficiency: item.proficiency,
            source: 'resume',
            added_at: new Date().toISOString(),
          });
          existingNames.add(lower);
        }
      });

      return [...prev, ...newItems];
    });
    showToast(`Imported ${skillsToAdd.length} skills into your career profile!`);
  };

  const updateRoadmapItemStatus = (itemId: string, status: RoadmapStatus) => {
    const allItems = roadmapPhases.flatMap((p) => p.items);
    const target = allItems.find((i) => i.id === itemId);
    if (!target) return;

    const updatedItem: RoadmapItem = {
      ...target,
      status,
      completed_at: status === 'Completed' ? new Date().toISOString() : undefined,
    };

    setStoredRoadmapItems((prev) => {
      const filtered = prev.filter((i) => i.id !== itemId);
      const next = [...filtered, updatedItem];
      try {
        localStorage.setItem(STORAGE_KEYS.ROADMAP_ITEMS, JSON.stringify(next));
      } catch {}
      return next;
    });

    if (status === 'Completed') {
      showToast(`Completed roadmap item: ${target.skill_name}! 🎉`);
    } else {
      showToast(`Updated: ${target.skill_name} -> ${status}`);
    }
  };

  const regenerateRoadmap = () => {
    setStoredRoadmapItems([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.ROADMAP_ITEMS);
    } catch {}
    showToast('Roadmap recalculated based on latest skill analysis.');
  };

  const addPracticeSubmission = (record: PracticeSubmissionRecord) => {
    setPracticeHistory((prev) => [record, ...prev]);
    showToast(`Practice scored: ${record.evaluation.score}/100 (${record.evaluation.evaluation_label})`);
  };

  const startNewInterviewSession = (session: InterviewSession) => {
    setActiveInterviewSession(session);
    setActiveTab('interview');
  };

  const updateActiveInterviewSession = (updater: (prev: InterviewSession) => InterviewSession) => {
    setActiveInterviewSession((prev) => (prev ? updater(prev) : null));
  };

  const saveCompletedInterviewSession = (session: InterviewSession) => {
    setInterviewSessions((prev) => [session, ...prev]);
    setActiveInterviewSession(session);
    showToast('Interview session completed & recorded! 🏆');
  };

  const toggleProjectSaved = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, is_saved: !p.is_saved } : p))
    );
  };

  const toggleProjectCompleted = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, is_completed: !p.is_completed } : p))
    );
    showToast('Project progress updated!');
  };

  const recomputeGapAnalysis = () => {
    showToast('Refreshed skill gap analysis against target requirements.');
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        login,
        loginWithDemo,
        register,
        logout,
        completeOnboarding,
        activeTab,
        setActiveTab,
        student,
        updateStudent,
        resetToDemoStudent,
        selectedCareerId,
        setSelectedCareerId,
        currentCareer,
        studentSkills,
        addStudentSkill,
        updateSkillProficiency,
        removeStudentSkill,
        bulkAddSkillsFromResume,
        extractedResume,
        setExtractedResume,
        gapAnalysis,
        recomputeGapAnalysis,
        roadmapPhases,
        updateRoadmapItemStatus,
        regenerateRoadmap,
        practiceHistory,
        addPracticeSubmission,
        interviewSessions,
        activeInterviewSession,
        startNewInterviewSession,
        updateActiveInterviewSession,
        saveCompletedInterviewSession,
        projects,
        toggleProjectSaved,
        toggleProjectCompleted,
        toast,
        showToast,
        clearToast,
        isAboutModalOpen,
        setIsAboutModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
