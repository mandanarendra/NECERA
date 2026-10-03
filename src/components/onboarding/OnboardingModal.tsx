import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AcademicYear } from '../../types';
import { NeceraLogo } from '../common/NeceraLogo';
import {
  Sparkles,
  GraduationCap,
  Building2,
  Compass,
  Target,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Layers,
  BookOpen,
  Code2,
  Trophy,
  BrainCircuit,
  Rocket,
  Shield,
  Briefcase,
} from 'lucide-react';

interface OnboardingModalProps {
  onComplete?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const { currentUser, completeOnboarding } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedYear, setSelectedYear] = useState<AcademicYear>(
    (currentUser?.year as AcademicYear) || '1st Year'
  );
  const [selectedBranch, setSelectedBranch] = useState<string>(
    currentUser?.branch || 'AI & ML'
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    currentUser?.interests || ['Artificial Intelligence', 'Machine Learning']
  );
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    currentUser?.goals || ['Build projects', 'Prepare for placements']
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const interestOptions = [
    { id: 'Artificial Intelligence', label: 'Artificial Intelligence', icon: BrainCircuit },
    { id: 'Machine Learning', label: 'Machine Learning', icon: Layers },
    { id: 'Generative AI', label: 'Generative AI & LLMs', icon: Sparkles },
    { id: 'Data Science', label: 'Data Science & Analytics', icon: Compass },
    { id: 'Full Stack Development', label: 'Full Stack Web & Cloud', icon: Code2 },
    { id: 'Cybersecurity', label: 'Cybersecurity & Zero Trust', icon: Shield },
    { id: 'Cloud & DevOps', label: 'Cloud-Native & Kubernetes', icon: Rocket },
    { id: 'Computer Vision', label: 'Computer Vision & Deep Nets', icon: BookOpen },
    { id: 'NLP', label: 'Natural Language Processing', icon: BrainCircuit },
    { id: 'Autonomous Robotics', label: 'Autonomous Robotics & ROS2', icon: Trophy },
    { id: 'Edge Computing', label: 'Edge Computing & TinyML', icon: Layers },
    { id: 'UI/UX', label: 'Product Design & UI/UX', icon: Sparkles },
  ];

  const goalOptions = [
    { id: 'Learn from basics', label: 'Learn from basics', desc: 'Build rock-solid engineering foundations from scratch.' },
    { id: 'Improve my skills', label: 'Improve my skills', desc: 'Level up with industry standard practices and patterns.' },
    { id: 'Build projects', label: 'Build production projects', desc: 'Craft deployable full-stack & AI software for hands-on experience.' },
    { id: 'Prepare for placements', label: 'Prepare for placements', desc: 'Master coding interviews, system design, and algorithms.' },
    { id: 'Participate in hackathons', label: 'Participate in hackathons', desc: 'Join engineering teams to build rapid innovative solutions.' },
    { id: 'Explore AI', label: 'Explore frontier AI', desc: 'Experiment with autonomous agents, LLMs, and neural architectures.' },
    { id: 'Build a portfolio', label: 'Build verified portfolio', desc: 'Showcase cryptographically verified skill badges to employers.' },
  ];

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleFinish = async () => {
    if (selectedInterests.length === 0) {
      setErrorMsg('Please select at least one learning interest.');
      return;
    }
    if (selectedGoals.length === 0) {
      setErrorMsg('Please select at least one goal you want to achieve.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const result = await completeOnboarding({
      year: selectedYear,
      branch: selectedBranch,
      interests: selectedInterests,
      goals: selectedGoals,
    });

    setIsSubmitting(false);

    if (result.success) {
      if (onComplete) onComplete();
    } else {
      setErrorMsg(result.error || 'Failed to save onboarding preferences.');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in-50 duration-200 overflow-y-auto"
    >
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto p-6 sm:p-8 space-y-6">
        
        {/* Progress Bar & Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <NeceraLogo size="xs" showSubtext={false} />
            <div className="flex items-center gap-1.5 text-xs font-mono text-indigo-400">
              <span>Step {step} of 5</span>
            </div>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-xs sm:text-sm">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: WELCOME */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in-50 duration-200 text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600/30 to-cyan-500/20 border border-indigo-500/30 mx-auto flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-600/10">
              <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Welcome to NECERA, {currentUser?.fullName?.split(' ')[0] || 'Engineer'}!
              </h2>
              <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                NECERA is an autonomous learning and innovation platform specifically designed for engineering students.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <GraduationCap className="w-5 h-5 text-indigo-400" />
                <div className="text-xs font-bold text-white">Year-Wise Mastery</div>
                <div className="text-[11px] text-slate-400 leading-normal">
                  Curriculum customized for your academic year, with freedom to explore all 4 years.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <Layers className="w-5 h-5 text-cyan-400" />
                <div className="text-xs font-bold text-white">Adaptive Roadmaps</div>
                <div className="text-[11px] text-slate-400 leading-normal">
                  Sequential concept milestones that unlock as you pass diagnostic mastery checks.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <Briefcase className="w-5 h-5 text-emerald-400" />
                <div className="text-xs font-bold text-white">Verified Portfolio</div>
                <div className="text-[11px] text-slate-400 leading-normal">
                  Exportable, employer-ready engineering portfolio with verified badges.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/20 transition-all inline-flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* STEP 2: ACADEMIC YEAR */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in-50 duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Select Your Academic Year
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                This configures your primary recommended roadmap, but you can always explore other years.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  year: '1st Year' as AcademicYear,
                  title: '1st Year · Foundations',
                  desc: 'Programming fundamentals, Python, C/C++, Java Basics, HTML/CSS/JS, Git, and Mathematics.',
                },
                {
                  year: '2nd Year' as AcademicYear,
                  title: '2nd Year · Core & Systems',
                  desc: 'Data Structures, Algorithms, SQL/DBMS, OOP, Statistics, NumPy/Pandas, Networks, ML intro.',
                },
                {
                  year: '3rd Year' as AcademicYear,
                  title: '3rd Year · Advanced AI & Full-Stack',
                  desc: 'Deep Learning, NLP, Computer Vision, Generative AI, LLMs, AI Agents, Cloud & DevOps.',
                },
                {
                  year: '4th Year' as AcademicYear,
                  title: '4th Year · Capstone & Industry',
                  desc: 'Autonomous Robotics, System Design, Placements, Hackathons, Resume & Interview Prep.',
                },
              ].map((item) => {
                const isSelected = selectedYear === item.year;
                return (
                  <button
                    key={item.year}
                    type="button"
                    onClick={() => setSelectedYear(item.year)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-bold ${isSelected ? 'text-indigo-300' : 'text-white'}`}>
                        {item.title}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{item.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: BRANCH */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in-50 duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Select Your Engineering Branch
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Allows NECERA to curate engineering domain projects and industry skills for your department.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                'AI & ML',
                'CSE',
                'ECE',
                'EEE',
                'Mechanical',
                'Civil',
                'Data Science',
                'Information Technology',
                'Other',
              ].map((b) => {
                const isSelected = selectedBranch === b;
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setSelectedBranch(b)}
                    className={`p-3.5 rounded-xl border text-center font-bold text-xs transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: LEARNING INTERESTS */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in-50 duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Select Your Learning Interests
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Choose the technical tracks you want featured in your personalized recommendations.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {interestOptions.map((opt) => {
                const isSelected = selectedInterests.includes(opt.id);
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleInterest(opt.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500/50'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span className="text-xs font-semibold leading-snug">{opt.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(5)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: GOALS */}
        {step === 5 && (
          <div className="space-y-5 animate-in fade-in-50 duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                What do you want to achieve with NECERA?
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Select your primary goals. We adapt your project suggestions and assessment schedules accordingly.
              </p>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {goalOptions.map((g) => {
                const isSelected = selectedGoals.includes(g.id);
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => toggleGoal(g.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 text-white ring-1 ring-indigo-500/40'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{g.label}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{g.desc}</div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinish}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/25 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isSubmitting ? (
                  <span>Saving preferences...</span>
                ) : (
                  <>
                    <span>Enter Ecosystem Dashboard</span>
                    <Rocket className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
