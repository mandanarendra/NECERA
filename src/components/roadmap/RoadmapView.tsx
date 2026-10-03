import React, { useState, useEffect } from 'react';
import { RoadmapNode, LearningModule } from '../../types';
import { neceraStore } from '../../services/store';
import { ProgressBar } from '../common/ProgressBar';
import {
  CheckCircle2,
  Lock,
  PlayCircle,
  BookOpen,
  Code2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Info,
  Clock,
  Layers,
  ChevronDown,
} from 'lucide-react';

interface RoadmapViewProps {
  initialModuleId?: string;
  onOpenMaterial: (conceptId: string) => void;
  onOpenAssessment: (assessmentId: string) => void;
  onNavigateToMentor: (conceptKey?: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  initialModuleId = 'mod_ml_01',
  onOpenMaterial,
  onOpenAssessment,
  onNavigateToMentor,
}) => {
  const modules = neceraStore.getModules();
  const [activeModuleId, setActiveModuleId] = useState<string>(initialModuleId);

  useEffect(() => {
    if (initialModuleId && initialModuleId !== activeModuleId) {
      setActiveModuleId(initialModuleId);
    }
  }, [initialModuleId]);

  const [nodes, setNodes] = useState<RoadmapNode[]>(() =>
    neceraStore.getRoadmapNodes(activeModuleId)
  );

  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(() => {
    const list = neceraStore.getRoadmapNodes(activeModuleId);
    return list.find((n) => n.status === 'in_progress') || list[0] || null;
  });

  // When activeModuleId changes, refresh nodes and selected node
  useEffect(() => {
    const list = neceraStore.getRoadmapNodes(activeModuleId);
    setNodes(list);
    const inProg = list.find((n) => n.status === 'in_progress') || list[0] || null;
    setSelectedNode(inProg);
  }, [activeModuleId]);

  const activeModule: LearningModule | undefined = modules.find((m) => m.id === activeModuleId);

  const handleSelectNode = (node: RoadmapNode) => {
    setSelectedNode(node);
  };

  const completedCount = nodes.filter((n) => n.status === 'completed').length;
  const overallRoadmapProgress = nodes.length > 0 ? Math.round((completedCount / nodes.length) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-200">
      
      {/* Course Roadmap Selector & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-indigo-400">
            <span>{activeModule?.category || 'Curriculum Track'}</span>
            <span aria-hidden="true">·</span>
            <span>{nodes.length} Sequential Milestones</span>
            <span aria-hidden="true">·</span>
            <span>Lead: {activeModule?.instructor || 'Faculty Team'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {activeModule?.title || 'Interactive Concept Roadmap Engine'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {activeModule?.description ||
              'Sequential engineering mastery path. Pass assessments with ≥80% to unlock downstream architecture concepts.'}
          </p>
        </div>

        {/* Course Switcher Dropdown */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
          <div className="relative">
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Switch Course Roadmap
            </label>
            <div className="relative">
              <select
                value={activeModuleId}
                onChange={(e) => setActiveModuleId(e.target.value)}
                className="w-full sm:w-80 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 focus:outline-none focus:border-indigo-500 appearance-none pr-9 cursor-pointer transition-colors"
              >
                {modules.map((mod) => (
                  <option key={mod.id} value={mod.id}>
                    {mod.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-white font-mono">
                {completedCount} / {nodes.length} Mastered
              </div>
              <div className="text-[10px] text-slate-500">Track Progress</div>
            </div>
            <div className="w-24">
              <ProgressBar progress={overallRoadmapProgress} size="sm" variant="indigo" showPercent={false} />
              <div className="text-[10px] text-right font-mono text-indigo-400 mt-0.5">{overallRoadmapProgress}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Zone Responsive Interactive Layout */}
      {nodes.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-sm">
          No concepts currently populated for this module.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left / Center Zone: Responsive Connected Node Timeline (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Concept Sequence (Tap Node to Inspect)</span>
            </div>

            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-800">
              {nodes.map((node, index) => {
                const isSelected = selectedNode?.id === node.id;
                const isLocked = node.status === 'locked';
                const isCompleted = node.status === 'completed';
                const isInProgress = node.status === 'in_progress';

                return (
                  <div key={node.id} className="relative group">
                    {/* Status Indicator Icon along the spine */}
                    <div
                      className={`absolute -left-6 sm:-left-8 top-3.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-slate-950 transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 text-slate-950'
                          : isInProgress
                          ? 'bg-indigo-500 text-white ring-indigo-500/30 animate-pulse'
                          : isLocked
                          ? 'bg-slate-800 text-slate-500'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : isLocked ? (
                        <Lock className="w-3 h-3" />
                      ) : (
                        <span className="font-mono text-[11px]">{index + 1}</span>
                      )}
                    </div>

                    {/* Node Card */}
                    <button
                      onClick={() => handleSelectNode(node)}
                      disabled={isLocked}
                      className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all ${
                        isSelected
                          ? 'bg-slate-800/90 border-indigo-500/80 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/40'
                          : isLocked
                          ? 'bg-slate-900/40 border-slate-800/60 opacity-60 cursor-not-allowed'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className={`font-semibold ${isCompleted ? 'text-emerald-400' : isInProgress ? 'text-indigo-400' : 'text-slate-500'}`}>
                              {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : isLocked ? 'Locked' : 'Unlocked'}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{node.difficulty}</span>
                            <span aria-hidden="true">·</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-500" />
                              ~{node.estimatedMinutes}m
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                            {node.conceptTitle}
                          </h3>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {isCompleted && (
                            <span className="text-xs font-bold text-emerald-400 font-mono">100%</span>
                          )}
                          {isInProgress && (
                            <span className="text-xs font-bold text-indigo-400 font-mono">{node.progress}%</span>
                          )}
                          {isLocked && (
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Lock className="w-3 h-3" /> Requires Stage #{index}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {node.description}
                      </p>

                      {/* Progress Bar for In-Progress */}
                      {isInProgress && (
                        <div className="mt-3">
                          <ProgressBar progress={node.progress} size="sm" variant="indigo" showPercent={false} />
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Zone: Selected Node Concept Detail & Action Deck (lg:col-span-5) */}
          <div className="lg:col-span-5 sticky top-20">
            {selectedNode && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
                <div className="space-y-2 border-b border-slate-800 pb-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="text-indigo-400 font-bold uppercase tracking-wider">
                      Concept Detail · Stage {selectedNode.order} of {nodes.length}
                    </span>
                    <span className="font-mono">{selectedNode.difficulty}</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white">
                    {selectedNode.conceptTitle}
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {selectedNode.description}
                  </p>
                </div>

                {/* Prerequisites */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    <span>Concept Prerequisites</span>
                  </div>
                  {selectedNode.prerequisites.length === 0 ? (
                    <div className="text-xs text-slate-500">None · Foundational starting point</div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 text-xs text-slate-300">
                      {selectedNode.prerequisites.map((req, i) => (
                        <span key={i} className="text-slate-400">
                          {req}{i < selectedNode.prerequisites.length - 1 ? ' · ' : ''}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Weak Topics Diagnostic Warning if any */}
                {selectedNode.weakTopics && selectedNode.weakTopics.length > 0 && (
                  <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/50 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Identified Diagnostic Weak Topics</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Review these areas before retrying the assessment:
                    </p>
                    <div className="text-xs text-amber-200/90 font-medium">
                      {selectedNode.weakTopics.join(' · ')}
                    </div>
                    <button
                      onClick={() => onNavigateToMentor(selectedNode.weakTopics?.[0])}
                      className="w-full mt-2 py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                      <span>Review with AI Mentor</span>
                    </button>
                  </div>
                )}

                {/* Structured Stage Steps: Learn -> Practice -> Assessment */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-slate-300">Curriculum Flow</div>

                  {/* Step 1: Study Materials */}
                  <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-950/60 border border-indigo-800/50 flex items-center justify-center text-indigo-400 shrink-0">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">1. Learning Materials</div>
                        <div className="text-[11px] text-slate-400">
                          {selectedNode.materialsCount} resources (Notes, Code, Slides)
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onOpenMaterial(selectedNode.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-indigo-400 border border-slate-700 transition-colors"
                    >
                      Open
                    </button>
                  </div>

                  {/* Step 2: Practice & Tasks */}
                  <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-950/60 border border-indigo-800/50 flex items-center justify-center text-indigo-400 shrink-0">
                        <Code2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">2. Practice Tasks</div>
                        <div className="text-[11px] text-slate-400">
                          {selectedNode.tasksCount} coding & debugging tasks
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onOpenMaterial(selectedNode.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
                    >
                      View
                    </button>
                  </div>

                  {/* Step 3: Assessment Check */}
                  <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-800/50 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300 shrink-0">
                        <PlayCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">3. Mastery Assessment</div>
                        <div className="text-[11px] text-indigo-300">
                          Passing score: {selectedNode.passScoreRequired}%
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onOpenAssessment(selectedNode.assessmentId)}
                      disabled={selectedNode.status === 'locked'}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-semibold text-white transition-colors flex items-center gap-1"
                    >
                      <span>Start</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
