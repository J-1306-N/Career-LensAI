import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Briefcase,
  Play,
  Award,
  ShieldAlert,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { CAREERS_DATA } from '../data/careersData';
import {
  generateInterviewQuestionAI,
  evaluateInterviewAnswerAI,
} from '../services/aiService';
import {
  InterviewSession,
  InterviewType,
  InterviewDifficulty,
  InterviewQuestionItem,
  InterviewAnswerItem,
  InterviewSummary,
} from '../types';

export const InterviewSimulatorPage: React.FC = () => {
  const {
    currentCareer,
    student,
    activeInterviewSession,
    startNewInterviewSession,
    updateActiveInterviewSession,
    saveCompletedInterviewSession,
    showToast,
  } = useApp();

  // Setup form states
  const [role, setRole] = useState(currentCareer.name);
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>('Entry Level');
  const [interviewType, setInterviewType] = useState<InterviewType>('Technical');
  const [totalQuestionsCount] = useState(4); // 4-question comprehensive simulation

  // Active interaction states
  const [currentAnswerText, setCurrentAnswerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<InterviewAnswerItem | null>(null);

  const handleStartSession = async () => {
    setIsStarting(true);
    setLastFeedback(null);
    setCurrentAnswerText('');

    try {
      const firstQ = await generateInterviewQuestionAI(role, difficulty, interviewType, 1, []);

      const newSession: InterviewSession = {
        id: `int-sess-${Date.now()}`,
        student_id: student.id,
        role,
        difficulty,
        type: interviewType,
        created_at: new Date().toISOString(),
        status: 'in_progress',
        questions: [firstQ],
        answers: [],
      };

      startNewInterviewSession(newSession);
      showToast('Mock Interview started! Read Question #1 carefully.');
    } catch (err) {
      showToast('Failed to start interview. Please retry.', 'error');
    } finally {
      setIsStarting(false);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAnswerText.trim() || !activeInterviewSession) return;

    setIsSubmitting(true);
    try {
      const currentQ = activeInterviewSession.questions[activeInterviewSession.questions.length - 1];

      // Get feedback on answer
      const feedbackResult = await evaluateInterviewAnswerAI(
        currentQ.question,
        currentAnswerText,
        activeInterviewSession.role
      );

      const answerItem: InterviewAnswerItem = {
        question_id: currentQ.id,
        question_text: currentQ.question,
        user_answer: currentAnswerText,
        feedback: feedbackResult.feedback,
        points_covered: feedbackResult.points_covered,
        points_missed: feedbackResult.points_missed,
        suggested_improvement: feedbackResult.suggested_improvement,
        rating_score: feedbackResult.rating_score,
      };

      setLastFeedback(answerItem);

      // Check if session reached max questions
      const nextQNum = activeInterviewSession.questions.length + 1;

      if (nextQNum > totalQuestionsCount) {
        // Compute Final Session Summary
        const allAnswers = [...activeInterviewSession.answers, answerItem];
        const avgScore = Math.round(
          (allAnswers.reduce((acc, a) => acc + a.rating_score, 0) / allAnswers.length) * 10
        ) / 10;

        const summary: InterviewSummary = {
          total_questions: allAnswers.length,
          average_score: avgScore,
          observable_strengths: [
            'Clear communication of technical concepts',
            'Cohesive responses aligned with role expectations',
          ],
          key_areas_for_growth: [
            'Practice highlighting measurable project outcomes and trade-offs',
            'Incorporate the STAR framework when answering behavioral questions',
          ],
          confidence_rating:
            avgScore >= 8
              ? 'Interview-Ready in Fundamentals'
              : avgScore >= 6
              ? 'Solid Foundation'
              : 'Developing',
          closing_remarks:
            'You demonstrated solid foundational logic. Continue refining your real-world project stories to excel in campus technical screening rounds.',
        };

        const completedSession: InterviewSession = {
          ...activeInterviewSession,
          status: 'completed',
          answers: allAnswers,
          summary,
        };

        saveCompletedInterviewSession(completedSession);
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } else {
        // Fetch Next Question
        const askedTexts = activeInterviewSession.questions.map((q) => q.question);
        const nextQ = await generateInterviewQuestionAI(
          activeInterviewSession.role,
          activeInterviewSession.difficulty,
          activeInterviewSession.type,
          nextQNum,
          askedTexts
        );

        updateActiveInterviewSession((prev) => ({
          ...prev,
          questions: [...prev.questions, nextQ],
          answers: [...prev.answers, answerItem],
        }));

        setCurrentAnswerText('');
        showToast(`Answer logged. Question #${nextQNum} ready!`);
      }
    } catch (err) {
      showToast('Error processing answer. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestart = () => {
    handleStartSession();
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
            <Bot className="w-3.5 h-3.5" />
            <span>AI Mock Interview Simulator</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Realistic Interview Simulation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            One-question-at-a-time interactive mock interview with instant points-covered critique and constructive growth notes.
          </p>
        </div>
      </div>

      {/* Disclaimers & Ethics Note */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-800">Evaluator Note:</strong> Feedback is generated strictly on observable written answer quality to help students identify omitted technical details. It does not predict or guarantee real company hiring decisions.
        </div>
      </div>

      {/* State 1: Configuration / Start Screen */}
      {!activeInterviewSession ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">
              Configure Your Mock Interview
            </h2>
            <p className="text-xs text-slate-500">
              Select your targeted career role, interview flavor, and candidate seniority.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {CAREERS_DATA.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Interview Type
              </label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value as InterviewType)}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Technical">Technical & Architectural</option>
                <option value="HR">Behavioral (STAR Method)</option>
                <option value="Mixed">Mixed (Technical + Behavioral)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as InterviewDifficulty)}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Entry Level">Entry Level (College Grad)</option>
                <option value="Associate">Associate (1-2 yrs exp)</option>
                <option value="Senior Ready">Senior Ready</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleStartSession}
              disabled={isStarting}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              {isStarting ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Preparing Question #1...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Mock Interview</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : activeInterviewSession.status === 'completed' ? (
        /* State 3: Session Completed Summary */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6 animate-in fade-in duration-300">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Mock Interview Completed!
            </h2>
            <p className="text-xs text-slate-500">
              {activeInterviewSession.role} ({activeInterviewSession.difficulty} • {activeInterviewSession.type})
            </p>
          </div>

          {/* Performance Summary Banner */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400 font-mono uppercase tracking-wider">
                Average Score
              </div>
              <div className="text-3xl font-black font-mono text-emerald-400 mt-0.5">
                {activeInterviewSession.summary?.average_score} / 10
              </div>
              <div className="text-xs text-slate-300 mt-1">
                Rating: <strong className="text-white">{activeInterviewSession.summary?.confidence_rating}</strong>
              </div>
            </div>

            <button
              onClick={handleRestart}
              className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Start New Session
            </button>
          </div>

          {/* Strengths & Growth Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 space-y-2">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Observable Strengths:
              </span>
              <ul className="list-disc list-inside space-y-1 text-emerald-800">
                {activeInterviewSession.summary?.observable_strengths.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 space-y-2">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Areas for Growth:
              </span>
              <ul className="list-disc list-inside space-y-1 text-amber-800">
                {activeInterviewSession.summary?.key_areas_for_growth.map((g, idx) => (
                  <li key={idx}>{g}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Question by Question Review */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Transcript & Critique Review
            </h3>
            <div className="space-y-3">
              {activeInterviewSession.answers.map((ans, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>Q{idx + 1}: {ans.question_text}</span>
                    <span className="font-mono text-indigo-600 px-2 py-0.5 rounded bg-white border border-slate-200">
                      Score: {ans.rating_score}/10
                    </span>
                  </div>
                  <p className="text-slate-600 italic bg-white p-2.5 rounded-lg border border-slate-200">
                    "{ans.user_answer}"
                  </p>
                  <p className="text-slate-700">
                    <strong>Feedback:</strong> {ans.feedback}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* State 2: Active In-Progress Simulation */
        <div className="space-y-6">
          {/* Question Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center">
                  0{activeInterviewSession.questions.length}
                </span>
                <span className="text-xs font-bold text-slate-900">
                  Question {activeInterviewSession.questions.length} of {totalQuestionsCount}
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                {activeInterviewSession.role} • {activeInterviewSession.type}
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Interviewer Question:
              </div>
              <h2 className="text-base md:text-lg font-extrabold text-slate-900 leading-snug">
                {activeInterviewSession.questions[activeInterviewSession.questions.length - 1].question}
              </h2>
            </div>

            {/* Answer Box */}
            <form onSubmit={handleSubmitAnswer} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Your Spoken / Written Answer:
                </label>
                <textarea
                  value={currentAnswerText}
                  onChange={(e) => setCurrentAnswerText(e.target.value)}
                  rows={5}
                  placeholder="Explain your approach, technical reasoning, and real project examples..."
                  className="w-full text-xs p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 focus:bg-white resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !currentAnswerText.trim()}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      <span>Reviewing Answer with AI...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Answer & Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Feedback on Previous Answer */}
          {lastFeedback && (
            <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3 text-xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-indigo-200/60 pb-2">
                <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Critique for Previous Response (Score: {lastFeedback.rating_score}/10)
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">
                {lastFeedback.feedback}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-lg bg-white/80 border border-indigo-100">
                  <strong className="text-emerald-800 block mb-0.5">Points Covered:</strong>
                  {lastFeedback.points_covered.join(', ')}
                </div>
                <div className="p-2.5 rounded-lg bg-white/80 border border-indigo-100">
                  <strong className="text-amber-800 block mb-0.5">Suggested Polish:</strong>
                  {lastFeedback.suggested_improvement}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
