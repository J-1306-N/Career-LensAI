import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Sparkles,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Code,
  RotateCcw,
  BookOpen,
  Filter,
  Brain,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generatePracticeQuestionAI, evaluateAnswerAI } from '../services/aiService';
import { PracticeQuestion, PracticeEvaluation, ProficiencyLevel, QuestionType } from '../types';

export const PracticeCenterPage: React.FC = () => {
  const { currentCareer, gapAnalysis, addPracticeSubmission, practiceHistory, showToast } = useApp();

  // Skills available to practice (from missing and partial gaps)
  const gapSkills = [
    ...gapAnalysis.missing_skills.map((s) => s.name),
    ...gapAnalysis.partial_matches.map((s) => s.name),
    ...currentCareer.skills.map((s) => s.skill_name),
  ];
  // Deduplicate
  const uniqueSkills = Array.from(new Set(gapSkills));

  const [selectedSkill, setSelectedSkill] = useState<string>(uniqueSkills[0] || 'SQL (Structured Query Language)');
  const [selectedDifficulty, setSelectedDifficulty] = useState<ProficiencyLevel>('Beginner');
  const [selectedType, setSelectedType] = useState<QuestionType>('concept');

  const [currentQuestion, setCurrentQuestion] = useState<PracticeQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluation, setEvaluation] = useState<PracticeEvaluation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Load a practice question
  const handleLoadQuestion = async () => {
    setIsGenerating(true);
    setEvaluation(null);
    setUserAnswer('');
    setShowHint(false);

    try {
      const q = await generatePracticeQuestionAI(selectedSkill, selectedDifficulty, selectedType);
      setCurrentQuestion(q);
      if (q.starter_code) {
        setUserAnswer(q.starter_code);
      }
    } catch (err) {
      showToast('Could not load question. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    handleLoadQuestion();
  }, [selectedSkill, selectedDifficulty, selectedType]);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) {
      showToast('Please type your answer before submitting', 'error');
      return;
    }
    if (!currentQuestion) return;

    setIsEvaluating(true);
    try {
      const evalResult = await evaluateAnswerAI(currentQuestion, userAnswer);
      setEvaluation(evalResult);

      addPracticeSubmission({
        id: `sub-${Date.now()}`,
        question: currentQuestion,
        user_answer: userAnswer,
        evaluation: evalResult,
        submitted_at: new Date().toISOString(),
      });
    } catch (err) {
      showToast('Failed to evaluate answer. Please retry.', 'error');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Targeted Competency Drills</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            AI Practice Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Test yourself against your verified skill gaps with real-time AI rubric grading and feedback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-900 font-mono">
              {practiceHistory.length} Drills Logged
            </div>
            <div className="text-[10px] text-slate-400">
              Avg Score:{' '}
              {practiceHistory.length > 0
                ? Math.round(
                    practiceHistory.reduce((acc, p) => acc + p.evaluation.score, 0) / practiceHistory.length
                  )
                : 0}
              /100
            </div>
          </div>
        </div>
      </div>

      {/* Drill Config Controls */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Skill Gap Focus
          </label>
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {uniqueSkills.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Difficulty Tier
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {(['Beginner', 'Intermediate', 'Advanced'] as ProficiencyLevel[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDifficulty(d)}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedDifficulty === d
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Question Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as QuestionType)}
            className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="concept">Conceptual Reasoning</option>
            <option value="coding">Code Implementation</option>
            <option value="scenario">Industry Real-World Scenario</option>
            <option value="short_answer">Short Answer Drill</option>
          </select>
        </div>
      </div>

      {/* Main Question & Answer Panel */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
        {isGenerating ? (
          <div className="py-16 text-center space-y-3">
            <RotateCcw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-700">
              Generating tailored {selectedDifficulty} drill for {selectedSkill}...
            </p>
          </div>
        ) : currentQuestion ? (
          <div className="space-y-6">
            {/* Question Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold font-mono">
                  {currentQuestion.skill} • {currentQuestion.difficulty}
                </span>
                <span className="text-[11px] font-mono text-slate-400 capitalize">
                  {currentQuestion.type.replace('_', ' ')}
                </span>
              </div>

              <h2 className="text-base md:text-lg font-bold text-slate-900 leading-snug">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Hint Box (Collapsible) */}
            <div>
              {!showHint ? (
                <button
                  type="button"
                  onClick={() => setShowHint(true)}
                  className="text-xs text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>Need a conceptual hint?</span>
                </button>
              ) : (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Clue:</strong> {currentQuestion.hint}
                  </div>
                </div>
              )}
            </div>

            {/* Answer Input Form */}
            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Your Answer / Solution:
                </label>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  rows={currentQuestion.type === 'coding' ? 7 : 5}
                  placeholder="Type your explanation or solution here..."
                  className={`w-full text-xs p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 focus:bg-white resize-none ${
                    currentQuestion.type === 'coding' ? 'font-mono' : ''
                  }`}
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleLoadQuestion}
                  className="px-3.5 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Different Question</span>
                </button>

                <button
                  type="submit"
                  disabled={isEvaluating || !userAnswer.trim()}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  {isEvaluating ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      <span>Evaluating via AI Rubric...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Submit Answer for AI Grading</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* AI Evaluation Result Card */}
            {evaluation && (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2.5">
                    {evaluation.is_correct_or_mostly ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-amber-600" />
                    )}
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">
                        {evaluation.evaluation_label}
                      </h3>
                      <p className="text-xs text-slate-500">
                        AI Score: <strong className="font-mono text-indigo-600">{evaluation.score} / 100</strong>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      evaluation.is_correct_or_mostly
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {evaluation.evaluation_label}
                  </span>
                </div>

                {/* Feedback */}
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {evaluation.feedback}
                </p>

                {/* Key Points Covered vs Missing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-1">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Points Well Explained:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-emerald-800">
                      {evaluation.important_points_covered.map((pt, idx) => (
                        <li key={idx}>{pt}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 space-y-1">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      Important Missing Concepts:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-amber-800">
                      {evaluation.missing_concepts.map((pt, idx) => (
                        <li key={idx}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Follow-up Question */}
                {evaluation.follow_up_question && (
                  <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 space-y-1 text-xs">
                    <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      Follow-up Practice Question:
                    </span>
                    <p className="text-indigo-900 leading-relaxed">
                      {evaluation.follow_up_question}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
