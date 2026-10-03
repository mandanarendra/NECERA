import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ProgressBar,
} from '../common/ProgressBar';
import { NeceraLogo } from '../common/NeceraLogo';
import {
  INITIAL_SKILLS_PROGRESS,
} from '../../data/seedData';
import {
  ArrowRight,
  Flame,
  Trophy,
  CheckCircle2,
  Clock,
  Code2,
  Sparkles,
  BookOpen,
  AlertTriangle,
  PlayCircle,
  ExternalLink,
  ChevronRight,
  Compass,
} from 'lucide-react';
import { neceraStore } from '../../services/store';

interface DashboardViewProps {
  onNavigate: (tab: string, context?: any) => void;
  onOpenAssessment: (assessmentId: string) => void;
  onOpenMaterial: (conceptId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenAssessment,
  onOpenMaterial,
}) => {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  const tasks = neceraStore.getTasks();
  const badges = neceraStore.getBadges();
  const projects = neceraStore.getProjects();
  const allModules = neceraStore.getModules();
  const currentRoadmapNode = neceraStore.getRoadmapNodes().find((n) => n.status === 'in_progress');
  const yearRecommendedModule = allModules.find((m) => m.recommendedYear === currentUser.year) || allModules[0];

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-200">
      
      {/* 1. Welcome Section & Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-6 sm:p-8">
        {/* Ambient Hero Art Overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 opacity-15 sm:opacity-25 pointer-events-none overflow-hidden">
          <img
            src="/src/assets/images/necera_hero_learning_1791000293234.jpg"
            alt="AI Engineering Ecosystem"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3">
              <NeceraLogo size="xs" variant="mark-only" />
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                <span>Engineering Workspace</span>
                <span aria-hidden="true">·</span>
                <span>{currentUser.branch}</span>
                <span aria-hidden="true">·</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-bold">
                  {currentUser.year}
                </span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Welcome back, {currentUser.fullName.split(' ')[0]} 👋
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your autonomous learning path is active. You have completed{' '}
              <span className="text-slate-200 font-medium">4 modules</span> and are currently mastering{' '}
              <span className="text-indigo-300 font-medium">{currentRoadmapNode?.conceptTitle || 'Linear Regression'}</span>.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="font-semibold text-slate-200 font-mono tabular-nums">{currentUser.currentStreakDays}</span>
                <span>Day Learning Streak</span>
              </div>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-slate-200 font-mono tabular-nums">{currentUser.totalScore}</span>
                <span>Total XP Earned</span>
              </div>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <div className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>ID: {currentUser.collegeId}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Button Group */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={() => onNavigate('roadmap')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <span>Continue Concept Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('mentor')}
              className="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/80 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Ask AI Mentor</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Primary 2-Column Responsive Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols on lg): Progress, Continue Learning, Active Roadmap */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Roadmap & Continue Learning Card */}
          <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Active Concept in Progress</h2>
                <div className="text-xs text-slate-400 mt-0.5">Machine Learning & Statistical Foundations</div>
              </div>
              <button
                onClick={() => onNavigate('roadmap')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                <span>Full Roadmap</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {currentRoadmapNode && (
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
                      <span>Node #{currentRoadmapNode.order}</span>
                      <span aria-hidden="true">·</span>
                      <span>{currentRoadmapNode.difficulty}</span>
                      <span aria-hidden="true">·</span>
                      <span>~{currentRoadmapNode.estimatedMinutes} mins</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1">
                      {currentRoadmapNode.conceptTitle}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {currentRoadmapNode.description}
                    </p>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <span className="text-2xl font-extrabold text-white font-mono tabular-nums">
                      {currentRoadmapNode.progress}%
                    </span>
                    <div className="text-[11px] text-slate-400">Mastery Level</div>
                  </div>
                </div>

                <ProgressBar progress={currentRoadmapNode.progress} size="md" variant="indigo" showPercent={false} />

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => onOpenMaterial(currentRoadmapNode.id)}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-2"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Study Materials ({currentRoadmapNode.materialsCount})</span>
                  </button>
                  <button
                    onClick={() => onOpenAssessment(currentRoadmapNode.assessmentId)}
                    className="px-4 py-2 rounded-lg bg-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-2"
                  >
                    <PlayCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Take Assessment Check</span>
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Overall Learning Progress (Database backed skills) */}
          <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Competency & Skill Progress</h2>
                <div className="text-xs text-slate-400 mt-0.5">Real-time mastery tracked across curriculum modules</div>
              </div>
              <span className="text-xs text-slate-400 font-mono">6 tracks monitored</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {INITIAL_SKILLS_PROGRESS.map((skill) => (
                <div
                  key={skill.name}
                  className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2.5 hover:border-slate-700/80 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">{skill.name}</span>
                    <span className="text-xs font-bold text-indigo-400 font-mono tabular-nums">
                      {skill.percentage}%
                    </span>
                  </div>
                  <ProgressBar
                    progress={skill.percentage}
                    size="sm"
                    variant={skill.percentage > 70 ? 'emerald' : skill.percentage > 40 ? 'indigo' : 'amber'}
                    showPercent={false}
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Level: {skill.level}</span>
                    <span>{skill.modulesCompleted} modules completed</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Assigned Tasks & Submissions */}
          <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Assigned Engineering Tasks</h2>
                <div className="text-xs text-slate-400 mt-0.5">Practical implementation and debugging requirements</div>
              </div>
              <button
                onClick={() => onNavigate('roadmap')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                View all tasks
              </button>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-xl bg-slate-800/30 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="capitalize text-indigo-400 font-semibold">{task.taskType}</span>
                      <span aria-hidden="true">·</span>
                      <span>{task.difficulty}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        Due {task.deadline}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-slate-200 truncate">{task.title}</div>
                    <p className="text-xs text-slate-400 line-clamp-1">{task.instructions}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {task.status === 'submitted' ? (
                      <div className="text-right">
                        <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Graded: {task.studentScore}/{task.maxScore}</span>
                        </div>
                        <span className="text-[10px] text-slate-500">Auto-verified</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => onNavigate('roadmap')}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Work on Task</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Active Projects Showcase */}
          <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Active Projects</h2>
                <div className="text-xs text-slate-400 mt-0.5">Capstone systems and AI-architected applications</div>
              </div>
              <button
                onClick={() => onNavigate('project-lab')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Project Lab
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="text-indigo-400 font-medium">{proj.category}</span>
                      <span className="font-mono tabular-nums font-bold text-slate-300">{proj.progressPercent}%</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-100 line-clamp-1">{proj.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{proj.problemStatement}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <ProgressBar progress={proj.progressPercent} size="sm" variant="cyan" showPercent={false} />
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{proj.milestones.filter((m) => m.completed).length} / {proj.milestones.length} Milestones</span>
                      <button
                        onClick={() => onNavigate('project-lab')}
                        className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                      >
                        Open Lab <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (1 Col on lg): Weak Topics, Diagnostics, Badges, Activity */}
        <div className="space-y-8">
          
          {/* Weak Topics Diagnostic & Targeted Revision */}
          <section className="rounded-2xl bg-amber-950/20 border border-amber-800/40 p-5 space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <h2 className="text-sm font-bold text-white tracking-tight">Diagnostic Feedback</h2>
            </div>
            <p className="text-xs text-amber-200/80 leading-relaxed">
              Recent assessment diagnostic flagged conceptual struggles in{' '}
              <strong className="text-amber-200">L1 vs L2 Weight Shrinkage Derivation</strong>.
            </p>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-amber-900/30 text-xs space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Recommended Action
              </div>
              <p className="text-slate-300 text-xs">
                Review diamond vs spherical constraint geometries before re-taking the mastery check.
              </p>
              <button
                onClick={() => onNavigate('mentor')}
                className="w-full mt-2 py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>Ask AI Mentor to Explain</span>
              </button>
            </div>
          </section>

          {/* Upcoming Assessments */}
          <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 space-y-4">
            <h2 className="text-sm font-bold text-white tracking-tight">Upcoming Assessments</h2>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-indigo-400 font-semibold">Mastery Evaluation</span>
                <span className="text-slate-400 font-mono">15 mins</span>
              </div>
              <div className="text-sm font-bold text-slate-200">Linear Regression & Regularization</div>
              <p className="text-xs text-slate-400">
                Minimum passing score: 80%. Attempts remaining: 2 / 3.
              </p>
              <button
                onClick={() => onOpenAssessment('asm_linreg')}
                className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Launch Assessment</span>
              </button>
            </div>
          </section>

          {/* Earned Badges Showcase */}
          <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white tracking-tight">Badges & Credentials</h2>
              <button
                onClick={() => onNavigate('portfolio')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Portfolio
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3 rounded-xl border flex flex-col items-center text-center space-y-1.5 transition-all ${
                    badge.isUnlocked
                      ? 'bg-slate-800/60 border-slate-700/80'
                      : 'bg-slate-900/40 border-slate-800/60 opacity-40 grayscale'
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-indigo-950/60 border border-indigo-800/50 flex items-center justify-center text-indigo-400">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-200 line-clamp-1">{badge.name}</span>
                  <span className="text-[10px] text-slate-400 line-clamp-1">{badge.category}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Activity Timeline */}
          <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 space-y-4">
            <h2 className="text-sm font-bold text-white tracking-tight">Recent Activity</h2>
            <div className="space-y-4 text-xs">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <div className="space-y-0.5">
                  <div className="text-slate-200 font-medium">Scored 92/100 on Vectorized Cost Function</div>
                  <div className="text-slate-500 text-[11px]">2 hours ago · Automated Evaluation</div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                <div className="space-y-0.5">
                  <div className="text-slate-200 font-medium">Completed study: Mathematical Derivations</div>
                  <div className="text-slate-500 text-[11px]">4 hours ago · Learning Materials</div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <div className="space-y-0.5">
                  <div className="text-slate-200 font-medium">Assessment Check Attempted (65%)</div>
                  <div className="text-slate-500 text-[11px]">Yesterday · Linear Regression</div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

    </div>
  );
};
