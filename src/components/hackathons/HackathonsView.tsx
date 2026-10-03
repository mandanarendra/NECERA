import React, { useState } from 'react';
import { Hackathon } from '../../types';
import { neceraStore } from '../../services/store';
import {
  Trophy,
  Calendar,
  Users,
  Award,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const HackathonsView: React.FC = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>(() =>
    neceraStore.getHackathons()
  );
  const [expandedId, setExpandedId] = useState<string | null>(hackathons[0]?.id || null);

  const handleRegister = (id: string) => {
    neceraStore.registerHackathon(id);
    setHackathons(neceraStore.getHackathons());
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>Competitive Engineering & Hackathons</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Grand Challenges & AI Sprints
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Test your systems under pressure. Build functional prototypes, submit reproducible code, and present to faculty and industry evaluators.
          </p>
        </div>
      </div>

      {/* Hackathons List */}
      <div className="space-y-6">
        {hackathons.map((hack) => {
          const isExpanded = expandedId === hack.id;

          return (
            <div
              key={hack.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden space-y-6 p-6 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-800 pb-5">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-indigo-400 font-medium">
                    <span className="uppercase font-mono">{hack.status}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {hack.startDate} – {hack.endDate}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      {hack.teamSize}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    {hack.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {hack.description}
                  </p>
                </div>

                {/* Registration Action */}
                <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                  {hack.registered ? (
                    <div className="px-4 py-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Registration Confirmed</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRegister(hack.id)}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Register Team</span>
                    </button>
                  )}

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : hack.id)}
                    className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>{isExpanded ? 'Hide Details' : 'Problem Statements & Prizes'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Expanded Problem Statements, Prizes, & Rules */}
              {isExpanded && (
                <div className="space-y-6 animate-in fade-in-50 duration-150 pt-2">
                  
                  {/* Problem Statements */}
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Official Problem Tracks
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {hack.problemStatements.map((ps) => (
                        <div
                          key={ps.id}
                          className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 flex flex-col justify-between"
                        >
                          <div className="space-y-1">
                            <span className="text-[11px] font-mono text-indigo-400 uppercase font-semibold">
                              {ps.track}
                            </span>
                            <h4 className="text-sm font-bold text-white leading-snug">{ps.title}</h4>
                            <p className="text-xs text-slate-400 leading-relaxed pt-1">{ps.prompt}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prizes */}
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Awards & Recognition
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {hack.prizes.map((pz, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-amber-400">{pz.rank}</span>
                            <span className="text-sm font-mono font-bold text-white">{pz.amount}</span>
                          </div>
                          <p className="text-xs text-slate-400">{pz.perks}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rules */}
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Evaluation Protocol & Rules</span>
                    </div>
                    <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                      {hack.rules.map((rule, idx) => (
                        <li key={idx}>{rule}</li>
                      ))}
                    </ul>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
