import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Team, UserProfile } from '../../types';
import { neceraStore } from '../../services/store';
import {
  Users2,
  UserPlus,
  Search,
  CheckCircle2,
  Sparkles,
  Shield,
  Layers,
  Code2,
  Mail,
  Plus,
} from 'lucide-react';

export const CollaborationView: React.FC = () => {
  const { currentUser } = useAuth();
  const [teams, setTeams] = useState<Team[]>(() => neceraStore.getTeams());
  const [peers] = useState<UserProfile[]>(() =>
    neceraStore.getAllUsers().filter((u) => u.id !== currentUser.id)
  );

  const [searchSkill, setSearchSkill] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamGoal, setNewTeamGoal] = useState('');
  const [newTeamCategory, setNewTeamCategory] = useState('Autonomous AI & Embedded Systems');

  const filteredPeers = peers.filter((p) => {
    if (!searchSkill) return true;
    return (
      p.skills.some((s) => s.toLowerCase().includes(searchSkill.toLowerCase())) ||
      p.branch.toLowerCase().includes(searchSkill.toLowerCase()) ||
      p.fullName.toLowerCase().includes(searchSkill.toLowerCase())
    );
  });

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim() || !newTeamGoal.trim()) return;

    const created = neceraStore.createTeam({
      name: newTeamName,
      projectGoal: newTeamGoal,
      category: newTeamCategory,
      leadName: currentUser.fullName,
      leadId: currentUser.id,
      members: [
        {
          id: currentUser.id,
          name: currentUser.fullName,
          avatar: currentUser.avatarUrl,
          role: 'Project Lead',
          branch: `${currentUser.branch} (${currentUser.year})`,
          email: currentUser.email,
        },
      ],
      openRoles: ['ML Engineer', 'Frontend Developer', 'Data Scientist'],
    });

    setTeams(neceraStore.getTeams());
    setShowCreateModal(false);
    setNewTeamName('');
    setNewTeamGoal('');
  };

  const handleJoinTeam = (teamId: string, roleName: string) => {
    const success = neceraStore.joinTeam(teamId, roleName);
    if (success) {
      setTeams(neceraStore.getTeams());
    } else {
      alert('You are already a member of this team or the role has been filled.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
            <Users2 className="w-3.5 h-3.5" />
            <span>Student Collaboration Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Engineering Teams & Peer Discovery
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Find complementary teammates across departments. Assemble interdisciplinary project squads with dedicated engineering roles.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-2 self-start md:self-auto shrink-0 shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Form New Squad</span>
        </button>
      </div>

      {/* Active Teams Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight">Active Engineering Teams</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {teams.map((team) => (
            <div
              key={team.id}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-indigo-400">{team.category}</span>
                  <span className="text-slate-500">Lead: {team.leadName}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{team.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{team.projectGoal}</p>

                {/* Team Members List */}
                <div className="pt-2 space-y-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Current Members ({team.members.length})
                  </div>
                  <div className="space-y-2">
                    {team.members.map((member) => (
                      <div
                        key={member.id}
                        className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-semibold text-white">{member.name}</div>
                            <div className="text-[10px] text-slate-400">{member.branch}</div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-indigo-300 text-[11px] font-medium">
                          {member.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Open Roles & Join Action */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Open Project Roles
                </div>
                {team.openRoles.length === 0 ? (
                  <div className="text-xs text-slate-500">All slots filled</div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {team.openRoles.map((roleName) => (
                      <button
                        key={roleName}
                        onClick={() => handleJoinTeam(team.id, roleName)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-600 hover:text-white border border-indigo-800/50 text-indigo-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Join as {roleName}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Peer Discovery Section */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Peer Talent Directory</h2>
            <p className="text-xs text-slate-400">Discover fellow engineering students by skill and department.</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchSkill}
              onChange={(e) => setSearchSkill(e.target.value)}
              placeholder="Search by skill (PyTorch, Go, C++)..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPeers.map((peer) => (
            <div
              key={peer.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={peer.avatarUrl}
                  alt={peer.fullName}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-700"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-white truncate">{peer.fullName}</h3>
                  <div className="text-[11px] text-slate-400 truncate">{peer.branch}</div>
                  <div className="text-[10px] text-indigo-400 font-mono">{peer.collegeId}</div>
                </div>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {peer.bio}
              </p>

              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] text-slate-500 font-medium">Demonstrated Skills:</div>
                <div className="flex flex-wrap gap-1.5">
                  {peer.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-mono">{peer.totalScore} XP</span>
                <button
                  onClick={() => alert(`Invitation sent to ${peer.fullName}!`)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white font-semibold transition-colors flex items-center gap-1.5 text-xs"
                >
                  <Mail className="w-3 h-3" />
                  <span>Invite to Team</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in-50 duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Create Engineering Project Squad</h3>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Squad Name</label>
                <input
                  type="text"
                  required
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="e.g. Autonomous Vision Collective"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Specialization Domain</label>
                <select
                  value={newTeamCategory}
                  onChange={(e) => setNewTeamCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Autonomous AI & Embedded Systems">Autonomous AI & Embedded Systems</option>
                  <option value="Healthcare AI & Biosignals">Healthcare AI & Biosignals</option>
                  <option value="High-Throughput Systems & Cloud">High-Throughput Systems & Cloud</option>
                  <option value="CleanTech & Energy Agents">CleanTech & Energy Agents</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mission / Project Objective</label>
                <textarea
                  rows={3}
                  required
                  value={newTeamGoal}
                  onChange={(e) => setNewTeamGoal(e.target.value)}
                  placeholder="What production system is your squad assembling?"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20"
                >
                  Publish Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
