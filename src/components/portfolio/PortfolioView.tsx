import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { neceraStore } from '../../services/store';
import { NeceraLogo } from '../common/NeceraLogo';
import {
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Award,
  Download,
  CheckCircle2,
  Cpu,
  Trophy,
  Calendar,
  Share2,
} from 'lucide-react';

export const PortfolioView: React.FC = () => {
  const { currentUser } = useAuth();
  const badges = neceraStore.getBadges().filter((b) => b.isUnlocked);
  const projects = neceraStore.getProjects();

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Portfolio link copied to clipboard!');
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-200 max-w-5xl mx-auto">
      
      {/* Portfolio Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        {/* Official Institutional Verification Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <NeceraLogo size="xs" subtext="Verified Academic Record" />
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>ID Verified</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.fullName}
              referrerPolicy="no-referrer"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-indigo-500/40 shadow-xl"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                <span>Verified Engineering Candidate</span>
                <span aria-hidden="true">·</span>
                <span>{currentUser.collegeId}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {currentUser.fullName}
              </h1>
              <div className="text-sm text-slate-400">
                {currentUser.branch} · {currentUser.year}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors flex items-center gap-1.5 shadow-lg shadow-indigo-600/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Dossier</span>
            </button>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-4">
          {currentUser.bio}
        </p>

        {/* External Links */}
        <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
          {currentUser.githubUrl && (
            <a
              href={currentUser.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          )}
          {currentUser.linkedinUrl && (
            <a
              href={currentUser.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
            >
              <Linkedin className="w-4 h-4 text-blue-400" />
              <span>LinkedIn</span>
            </a>
          )}
          {currentUser.portfolioUrl && (
            <a
              href={currentUser.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Personal Site</span>
            </a>
          )}
        </div>
      </div>

      {/* Verified Skills Section */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <span>Curriculum Verified Skills & Competencies</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          {currentUser.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 rounded-xl bg-slate-800/70 border border-slate-700/80 text-xs font-semibold text-slate-200 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{skill}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Verified Projects Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight">Verified Engineering Projects</h2>

        <div className="space-y-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
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
                  <h3 className="text-base sm:text-lg font-bold text-white">{proj.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  {proj.repoUrl && (
                    <a
                      href={proj.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Code Repository</span>
                    </a>
                  )}
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Deployment</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <div>
                  <strong className="text-slate-200">Problem Statement: </strong>
                  {proj.problemStatement}
                </div>
                <div>
                  <strong className="text-slate-200">Engineering Objective: </strong>
                  {proj.realWorldObjective}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {proj.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-0.5 rounded-md bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Earned Badges & Certificates */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight">Earned Micro-Credentials</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400 shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="text-xs text-indigo-400 font-semibold">{badge.category}</div>
                <h4 className="text-sm font-bold text-white truncate">{badge.name}</h4>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{badge.description}</p>
                {badge.earnedAt && (
                  <div className="text-[10px] text-slate-500 font-mono pt-1">Issued: {badge.earnedAt}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
