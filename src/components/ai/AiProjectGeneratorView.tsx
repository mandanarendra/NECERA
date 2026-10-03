import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { aiService } from '../../services/aiService';
import { neceraStore } from '../../services/store';
import { ActiveProject, DifficultyLevel } from '../../types';
import {
  Sparkles,
  Layers,
  CheckCircle2,
  Cpu,
  Database,
  ArrowRight,
  ExternalLink,
  Code2,
  FolderGit2,
} from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

export const AiProjectGeneratorView: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeProjects, setActiveProjects] = useState<ActiveProject[]>(() =>
    neceraStore.getProjects()
  );

  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Intermediate');
  const [interestKeywords, setInterestKeywords] = useState('Autonomous Systems & Edge AI');
  const [targetCategory, setTargetCategory] = useState('Computer Vision & Embedded AI');
  const [generating, setGenerating] = useState(false);
  const [generatedProject, setGeneratedProject] = useState<Partial<ActiveProject> | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const proj = await aiService.generatePersonalizedProject(currentUser, {
        category: targetCategory,
        difficulty,
        interestKeywords,
      });
      setGeneratedProject(proj);
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handleAcceptProject = () => {
    if (!generatedProject || !generatedProject.title) return;
    const fullProject: ActiveProject = {
      id: `proj_${Date.now()}`,
      title: generatedProject.title,
      problemStatement: generatedProject.problemStatement || '',
      realWorldObjective: generatedProject.realWorldObjective || '',
      category: generatedProject.category || targetCategory,
      difficulty: (generatedProject.difficulty as any) || difficulty,
      requiredSkills: generatedProject.requiredSkills || ['Python', 'PyTorch'],
      techStack: generatedProject.techStack || ['Python', 'Docker'],
      datasetSuggestions: generatedProject.datasetSuggestions || ['Benchmark Dataset'],
      progressPercent: 0,
      milestones: generatedProject.milestones || [],
      generatedByAi: true,
      createdAt: 'Just now',
    };

    neceraStore.addProject(fullProject);
    setActiveProjects(neceraStore.getProjects());
    setGeneratedProject(null);
  };

  const handleToggleMilestone = (projId: string, milestoneId: string) => {
    neceraStore.toggleMilestone(projId, milestoneId);
    setActiveProjects(neceraStore.getProjects());
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Project Architect & Milestone Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Personalized Engineering Project Lab
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Synthesizes industry-grade capstone challenges tailored to your verified syllabus progress. The AI acts as your Architect; you engineer the solution.
          </p>
        </div>
      </div>

      {/* Generator Configuration Deck */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/20 border border-slate-800 space-y-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <span>Project Synthesis Parameters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Target Domain</label>
            <select
              value={targetCategory}
              onChange={(e) => setTargetCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="Computer Vision & Embedded AI">Computer Vision & Embedded AI</option>
              <option value="NLP & Information Extraction">NLP & Information Extraction</option>
              <option value="Distributed Systems & Cloud">Distributed Systems & Cloud</option>
              <option value="Autonomous Robotics & Control">Autonomous Robotics & Control</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Complexity Tier</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="Beginner">Beginner (Foundational)</option>
              <option value="Intermediate">Intermediate (Capstone Standard)</option>
              <option value="Advanced">Advanced (Production Scale)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Interests & Sub-fields</label>
            <input
              type="text"
              value={interestKeywords}
              onChange={(e) => setInterestKeywords(e.target.value)}
              placeholder="e.g. Edge inference, TensorRT, Drone navigation"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Student's Verified Skills Badge Display */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="text-slate-500">Injecting Verified Skills:</span>
          {currentUser.skills.map((skill) => (
            <span key={skill} className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[11px]">
              {skill}
            </span>
          ))}
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          <Sparkles className="w-4 h-4" />
          <span>{generating ? 'Synthesizing Architecture & Milestones...' : 'Generate Personalized Project'}</span>
        </button>
      </div>

      {/* Newly Generated Project Preview */}
      {generatedProject && (
        <div className="p-6 rounded-2xl bg-indigo-950/20 border border-indigo-500/40 space-y-6 animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-900/40 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold mb-1">
                <span>AI-Architected Specification</span>
                <span aria-hidden="true">·</span>
                <span>{generatedProject.difficulty}</span>
                <span aria-hidden="true">·</span>
                <span>{generatedProject.category}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                {generatedProject.title}
              </h2>
            </div>

            <button
              onClick={handleAcceptProject}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center gap-2 shrink-0 shadow-lg shadow-indigo-600/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Accept into Workspace</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed">
            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Problem Statement</div>
              <p className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                {generatedProject.problemStatement}
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Engineering Objective</div>
              <p className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                {generatedProject.realWorldObjective}
              </p>
            </div>
          </div>

          {/* Suggested Milestones */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Architectural Milestones ({generatedProject.milestones?.length} Stages)
            </div>
            <div className="space-y-2">
              {generatedProject.milestones?.map((m, idx) => (
                <div key={m.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-indigo-400 shrink-0 mt-0.5">
                    Stage {idx + 1}
                  </span>
                  <div className="flex-1 space-y-0.5 text-xs">
                    <div className="font-semibold text-white">{m.title}</div>
                    <div className="text-slate-400">{m.description}</div>
                    <div className="text-[11px] text-cyan-400 pt-1 font-mono">Deliverable: {m.deliverable}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Student Projects Workspace */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight">Active Project Workspace</h2>

        <div className="space-y-6">
          {activeProjects.map((proj) => (
            <div
              key={proj.id}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
                    <span>{proj.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{proj.difficulty}</span>
                    {proj.generatedByAi && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-cyan-400 font-semibold">AI Architected</span>
                      </>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">{proj.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  {proj.repoUrl && (
                    <a
                      href={proj.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1.5 transition-colors"
                    >
                      <FolderGit2 className="w-3.5 h-3.5" />
                      <span>Code Repo</span>
                    </a>
                  )}
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs flex items-center gap-1.5 hover:bg-indigo-600 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live App</span>
                    </a>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                {proj.problemStatement}
              </p>

              {/* Progress */}
              <div className="space-y-1">
                <ProgressBar progress={proj.progressPercent} size="sm" variant="cyan" showPercent={true} />
              </div>

              {/* Milestones Checklist */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-semibold text-slate-300">Milestone Checkpoints</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {proj.milestones.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleToggleMilestone(proj.id, m.id)}
                      className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                        m.completed
                          ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-300'
                          : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800/70'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                          m.completed
                            ? 'border-emerald-500 bg-emerald-600 text-slate-950'
                            : 'border-slate-600'
                        }`}
                      >
                        {m.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <div className="space-y-0.5 text-xs">
                        <div className={`font-semibold ${m.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                          {m.title}
                        </div>
                        <div className="text-[11px] text-slate-400">{m.deliverable}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
