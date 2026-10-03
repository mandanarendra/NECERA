import React, { useState } from 'react';
import { LearningMaterial, Task } from '../../types';
import { neceraStore } from '../../services/store';
import {
  X,
  BookOpen,
  Code2,
  FileText,
  Video,
  Database,
  CheckCircle2,
  Download,
  Copy,
  Check,
  Play,
  Terminal,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface MaterialModalProps {
  conceptId: string;
  onClose: () => void;
  onOpenAssessment: (assessmentId: string) => void;
}

export const MaterialModal: React.FC<MaterialModalProps> = ({
  conceptId,
  onClose,
  onOpenAssessment,
}) => {
  const conceptNode = neceraStore.getRoadmapNodeById(conceptId);
  const [materials, setMaterials] = useState<LearningMaterial[]>(() =>
    neceraStore.getMaterials(conceptId)
  );
  const [tasks, setTasks] = useState<Task[]>(() => neceraStore.getTasks(conceptId));
  const [activeTab, setActiveTab] = useState<'materials' | 'tasks'>('materials');
  const [selectedMaterial, setSelectedMaterial] = useState<LearningMaterial | null>(
    materials[0] || null
  );

  const [copied, setCopied] = useState(false);
  const [runOutput, setRunOutput] = useState<string | null>(null);
  const [isRunningCode, setIsRunningCode] = useState(false);

  // Selected task state
  const [selectedTask, setSelectedTask] = useState<Task | null>(tasks[0] || null);
  const [taskCode, setTaskCode] = useState<string>(
    selectedTask?.submittedCode || selectedTask?.starterCode || ''
  );
  const [taskFeedback, setTaskFeedback] = useState<string | null>(
    selectedTask?.submissionFeedback || null
  );

  const handleToggleComplete = (matId: string) => {
    const updated = neceraStore.toggleMaterialCompleted(matId);
    setMaterials(updated.filter((m) => m.conceptId === conceptId));
    if (selectedMaterial && selectedMaterial.id === matId) {
      setSelectedMaterial({ ...selectedMaterial, completed: !selectedMaterial.completed });
    }
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunCode = (code: string) => {
    setIsRunningCode(true);
    setRunOutput(null);
    setTimeout(() => {
      setIsRunningCode(false);
      setRunOutput(
        `[NECERA Python 3.12 Runtime — Simulated Execution]\nModule Execution: ${conceptNode?.conceptTitle || 'Core Concept'}\nAll tensor dimension invariants verified.\nVectorized execution time: 3.8ms | Status: Converged.`
      );
    }, 600);
  };

  const handleSubmitTask = () => {
    if (!selectedTask) return;
    const updated = neceraStore.submitTask(selectedTask.id, taskCode);
    if (updated) {
      setSelectedTask({ ...updated });
      setTaskFeedback(updated.submissionFeedback || 'Submission successful!');
      setTasks(neceraStore.getTasks(conceptId));
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in-50 duration-150 overflow-y-auto"
    >
      <div className="w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                Concept Learning Studio · Stage {conceptNode?.order || 1}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {conceptNode?.conceptTitle || 'Curriculum Concept'}
              </h2>
            </div>

            {/* Segmented Controls for Tabs */}
            <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 ml-4">
              <button
                onClick={() => setActiveTab('materials')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === 'materials'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Materials ({materials.length})
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === 'tasks'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tasks & Practice ({tasks.length})
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAssessment('asm_linreg')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-xs font-semibold hover:bg-indigo-600 hover:text-white transition-colors"
            >
              <span>Take Assessment</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close Learning Studio"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="sm:hidden flex border-b border-slate-800 bg-slate-900 px-4 py-2 gap-2">
          <button
            onClick={() => setActiveTab('materials')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg ${
              activeTab === 'materials' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-800'
            }`}
          >
            Materials ({materials.length})
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg ${
              activeTab === 'tasks' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-800'
            }`}
          >
            Tasks ({tasks.length})
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'materials' ? (
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[480px]">
              
              {/* Materials Left List (md:col-span-4) */}
              <div className="md:col-span-4 border-r border-slate-800/80 p-4 space-y-2 bg-slate-950/30">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Concept Curriculum
                </div>
                {materials.map((mat) => {
                  const isSelected = selectedMaterial?.id === mat.id;
                  const Icon =
                    mat.type === 'notes'
                      ? FileText
                      : mat.type === 'code'
                      ? Code2
                      : mat.type === 'video'
                      ? Video
                      : mat.type === 'dataset'
                      ? Database
                      : BookOpen;

                  return (
                    <button
                      key={mat.id}
                      onClick={() => setSelectedMaterial(mat)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-slate-800 border-indigo-500/80 shadow-md text-white'
                          : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/40'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="text-xs font-semibold truncate">{mat.title}</div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span className="uppercase font-mono">{mat.type}</span>
                          <span aria-hidden="true">·</span>
                          <span>{mat.durationOrPages}</span>
                          {mat.completed && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-emerald-400 font-semibold">Done</span>
                            </>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Material Detail Viewer (md:col-span-8) */}
              <div className="md:col-span-8 p-6 space-y-6 flex flex-col justify-between">
                {selectedMaterial ? (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                      <div>
                        <div className="text-xs text-indigo-400 font-medium">
                          {selectedMaterial.type.toUpperCase()} · {selectedMaterial.durationOrPages}
                        </div>
                        <h3 className="text-lg font-bold text-white mt-0.5">
                          {selectedMaterial.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleComplete(selectedMaterial.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                            selectedMaterial.completed
                              ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{selectedMaterial.completed ? 'Completed' : 'Mark Complete'}</span>
                        </button>

                        {selectedMaterial.downloadAllowed && (
                          <button
                            onClick={() => alert(`Downloading ${selectedMaterial.title} archive.`)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                            title="Download material"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Content Display based on type */}
                    {selectedMaterial.type === 'notes' && (
                      <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed font-sans bg-slate-950/40 p-4 rounded-xl border border-slate-800 whitespace-pre-line font-mono">
                        {selectedMaterial.content}
                      </div>
                    )}

                    {selectedMaterial.type === 'code' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between px-3 py-2 bg-slate-950 rounded-t-xl border border-slate-800 border-b-0 text-xs text-slate-400">
                          <span className="font-mono">linear_regression.py</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopyCode(selectedMaterial.content)}
                              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                            >
                              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copied ? 'Copied' : 'Copy'}</span>
                            </button>
                            <button
                              onClick={() => handleRunCode(selectedMaterial.content)}
                              disabled={isRunningCode}
                              className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors disabled:opacity-50"
                            >
                              <Play className="w-3 h-3 fill-white" />
                              <span>{isRunningCode ? 'Running...' : 'Run In Sandbox'}</span>
                            </button>
                          </div>
                        </div>

                        <pre className="p-4 rounded-b-xl bg-slate-950 border border-slate-800 text-xs font-mono text-indigo-200 overflow-x-auto leading-relaxed max-h-72">
                          <code>{selectedMaterial.content}</code>
                        </pre>

                        {runOutput && (
                          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-900/40 space-y-2">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                              <Terminal className="w-3.5 h-3.5" />
                              <span>Execution Output</span>
                            </div>
                            <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap">
                              {runOutput}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedMaterial.type === 'video' && (
                      <div className="space-y-3">
                        <div className="aspect-video rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center p-6 space-y-3">
                          <div className="w-14 h-14 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400 cursor-pointer hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 fill-indigo-400 translate-x-0.5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">Intuition: Gradient Descent Geometry</h4>
                            <p className="text-xs text-slate-400 mt-1">3D Visual animation of hyper-parameter loss bowl</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedMaterial.type === 'pdf' && (
                      <div className="p-8 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-3">
                        <FileText className="w-12 h-12 text-indigo-400 mx-auto" />
                        <h4 className="text-sm font-bold text-white">Lecture Presentation Deck</h4>
                        <p className="text-xs text-slate-400 max-w-md mx-auto">
                          Includes 34 high-resolution diagnostic slides on Bias-Variance tradeoff, L1/L2 formulation, and feature scaling.
                        </p>
                        <button
                          onClick={() => alert('Opening slide deck in reader mode.')}
                          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
                        >
                          <span>Open PDF Viewer</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {selectedMaterial.type === 'dataset' && (
                      <div className="p-8 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-3">
                        <Database className="w-12 h-12 text-cyan-400 mx-auto" />
                        <h4 className="text-sm font-bold text-white">California Housing Clean Benchmark</h4>
                        <p className="text-xs text-slate-400 max-w-md mx-auto">
                          Preprocessed CSV with 20,640 records and 8 features. Standardized column types with outlier annotations.
                        </p>
                        <button
                          onClick={() => alert('Dataset download initiated (CSV format, 2.4 MB).')}
                          className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download CSV (2.4 MB)</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-12 text-center text-xs text-slate-500">
                    Select a learning material from the curriculum on the left.
                  </div>
                )}
              </div>

            </div>
          ) : (
            /* Tasks and Coding Practice Tab */
            <div className="p-6 space-y-6">
              {selectedTask ? (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
                        <span className="capitalize">{selectedTask.taskType}</span>
                        <span aria-hidden="true">·</span>
                        <span>{selectedTask.difficulty}</span>
                        <span aria-hidden="true">·</span>
                        <span>Due {selectedTask.deadline}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mt-1">
                        {selectedTask.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {selectedTask.instructions}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono text-slate-400">
                        Passing Score: {selectedTask.passingScore}/{selectedTask.maxScore}
                      </span>
                    </div>
                  </div>

                  {/* Code Editor Area */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-mono">solution_submission.py</span>
                      <span className="text-[11px] text-slate-500">Auto-tested on submission</span>
                    </div>
                    <textarea
                      value={taskCode}
                      onChange={(e) => setTaskCode(e.target.value)}
                      rows={10}
                      className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
                      placeholder="Write your vectorized implementation here..."
                    />
                  </div>

                  {/* Submission Feedback Banner */}
                  {taskFeedback && (
                    <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/50 text-xs space-y-1">
                      <div className="flex items-center gap-2 font-bold text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Automated Test Suite Results</span>
                      </div>
                      <p className="text-slate-300">{taskFeedback}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    {selectedTask.solutionHint && (
                      <div className="text-xs text-slate-400 max-w-md">
                        <span className="text-amber-400 font-semibold">Hint: </span>
                        {selectedTask.solutionHint}
                      </div>
                    )}
                    <button
                      onClick={handleSubmitTask}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-2 ml-auto"
                    >
                      <Terminal className="w-4 h-4" />
                      <span>Verify & Submit Code</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-slate-500">No tasks found.</div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
