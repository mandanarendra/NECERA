import React, { useState, useEffect } from 'react';
import { Assessment, AssessmentQuestion } from '../../types';
import { neceraStore } from '../../services/store';
import { ProgressBar } from '../common/ProgressBar';
import {
  X,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Award,
} from 'lucide-react';

interface AssessmentModalProps {
  assessmentId: string;
  onClose: () => void;
  onNavigateToMentor: (weakTopic?: string) => void;
}

export const AssessmentModal: React.FC<AssessmentModalProps> = ({
  assessmentId,
  onClose,
  onNavigateToMentor,
}) => {
  const [assessment, setAssessment] = useState<Assessment>(() =>
    neceraStore.getAssessment(assessmentId)
  );
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
    correctCount: number;
    totalCount: number;
  } | null>(null);

  // 15-minute countdown timer
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(assessment.durationMinutes * 60);

  useEffect(() => {
    if (isSubmitted || timeLeftSeconds <= 0) return;
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, timeLeftSeconds]);

  const questions = assessment.questions;
  const currentQ: AssessmentQuestion = questions[currentQuestionIndex];

  const handleSelectOption = (questionId: string, option: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = () => {
    const outcome = neceraStore.submitAssessment(assessmentId, answers);
    setResult(outcome);
    setIsSubmitted(true);
    setAssessment(outcome.assessment);
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setIsSubmitted(false);
    setResult(null);
    setTimeLeftSeconds(assessment.durationMinutes * 60);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in-50 duration-150 overflow-y-auto"
    >
      <div className="w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div>
            <div className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
              Mastery Verification Check
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {assessment.title}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {!isSubmitted && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 font-mono text-xs text-amber-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTimer(timeLeftSeconds)}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
              aria-label="Close Assessment"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Question Progress bar */}
        {!isSubmitted && (
          <div className="px-6 pt-4 pb-2 border-b border-slate-800/60 bg-slate-950/30">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span className="font-mono">{answeredCount} of {questions.length} answered</span>
            </div>
            <ProgressBar
              progress={Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}
              size="sm"
              variant="indigo"
              showPercent={false}
            />
          </div>
        )}

        {/* Modal Main Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!isSubmitted ? (
            /* Active Question State */
            <div className="space-y-6">
              
              {/* Question Body */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-indigo-400">
                  Question #{currentQuestionIndex + 1} ({currentQ.points} points)
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                  {currentQ.question}
                </h3>

                {currentQ.codeSnippet && (
                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-indigo-200 overflow-x-auto leading-relaxed">
                    <code>{currentQ.codeSnippet}</code>
                  </pre>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options?.map((option, optIdx) => {
                  const isSelected = answers[currentQ.id] === option;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQ.id, option)}
                      className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-white font-medium shadow-md'
                          : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                          isSelected
                            ? 'border-indigo-400 bg-indigo-600 text-white'
                            : 'border-slate-600 text-slate-500'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span className="leading-relaxed">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Controls between questions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 text-xs font-semibold transition-colors"
                >
                  Previous
                </button>

                <div className="flex items-center gap-3">
                  {currentQuestionIndex < questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                      className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                    >
                      Next Question
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={answeredCount === 0}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition-colors shadow-lg shadow-emerald-600/20 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit for Evaluation</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          ) : (
            /* Results & Diagnostic Review State */
            <div className="space-y-6">
              
              {/* Score Banner */}
              <div
                className={`p-6 rounded-2xl border text-center space-y-3 ${
                  result?.passed
                    ? 'bg-emerald-950/30 border-emerald-800/60'
                    : 'bg-amber-950/30 border-amber-800/60'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center text-2xl font-bold ${
                    result?.passed
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-amber-600/20 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  {result?.passed ? <Award className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-white">
                    {result?.passed ? 'Mastery Check Passed!' : 'Requires Revision'}
                  </h3>
                  <div className="text-3xl font-extrabold font-mono mt-1 text-white tabular-nums">
                    {result?.score}%
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {result?.correctCount} of {result?.totalCount} questions answered correctly · Passing threshold: {assessment.passingScore}%
                  </p>
                </div>

                {result?.passed ? (
                  <p className="text-xs text-emerald-300 max-w-md mx-auto">
                    Excellent comprehension of regression gradient mechanics. The subsequent concept <strong>Classification Algorithms & Boundaries</strong> is now unlocked in your roadmap!
                  </p>
                ) : (
                  <p className="text-xs text-amber-300 max-w-md mx-auto">
                    You did not reach the 80% threshold. The roadmap will remain locked until you review the flagged weak topics and re-attempt.
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  {!result?.passed && (
                    <button
                      onClick={handleRetry}
                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retry Assessment</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToMentor('L1 vs L2 Weight Shrinkage Derivation');
                    }}
                    className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                    <span>Review Mistakes with AI Mentor</span>
                  </button>
                </div>
              </div>

              {/* Question Breakdown with Explanations */}
              <div className="space-y-4">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Detailed Solution Explanations
                </div>

                {questions.map((q, idx) => {
                  const studentAnswer = answers[q.id];
                  const isCorrect =
                    studentAnswer?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border space-y-3 ${
                        isCorrect
                          ? 'bg-slate-900/60 border-emerald-900/40'
                          : 'bg-slate-900/60 border-amber-900/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="text-xs text-slate-400">
                            Question {idx + 1} · {q.conceptKey}
                          </div>
                          <div className="text-sm font-semibold text-white">{q.question}</div>
                        </div>
                        {isCorrect ? (
                          <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold shrink-0">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>+{q.points} pts</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold shrink-0">
                            <XCircle className="w-4 h-4" />
                            <span>0 pts</span>
                          </div>
                        )}
                      </div>

                      <div className="text-xs space-y-1 text-slate-300">
                        <div>
                          <span className="text-slate-500">Your choice: </span>
                          <span className={isCorrect ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                            {studentAnswer || 'Not answered'}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div>
                            <span className="text-slate-500">Correct solution: </span>
                            <span className="text-emerald-400 font-medium">{q.correctAnswer}</span>
                          </div>
                        )}
                      </div>

                      <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs text-slate-400 leading-relaxed">
                        <strong className="text-slate-300">Explanation: </strong>
                        {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
