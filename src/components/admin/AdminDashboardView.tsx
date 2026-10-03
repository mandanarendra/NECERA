import React, { useState } from 'react';
import { neceraStore } from '../../services/store';
import { UserProfile, LearningModule, UserRole } from '../../types';
import {
  Users,
  Layers,
  Award,
  CheckCircle2,
  TrendingUp,
  Search,
  Shield,
  BookOpen,
  Plus,
  Filter,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>(() => neceraStore.getAllUsers());
  const [modules, setModules] = useState<LearningModule[]>(() => neceraStore.getModules());
  const [searchUser, setSearchUser] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'modules'>('users');

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.collegeId.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.role.toLowerCase().includes(searchUser.toLowerCase())
  );

  const metrics = [
    { label: 'Enrolled Students', value: '4,892', change: '+12% this month', icon: Users, color: 'text-indigo-400' },
    { label: 'Curriculum Modules', value: `${modules.length}`, change: '100% active', icon: BookOpen, color: 'text-emerald-400' },
    { label: 'Assessments Passed', value: '18,420', change: '84.2% pass rate', icon: CheckCircle2, color: 'text-cyan-400' },
    { label: 'Active Project Squads', value: '342', change: '+28 new teams', icon: Award, color: 'text-amber-400' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Academic Infrastructure & Dean Office</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            NECERA Ecosystem Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Monitor real-time student competencies, authorize university curriculum tracks, and govern platform role assignments.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'users' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            User Management ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('modules')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'modules' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Curriculum Modules ({modules.length})
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{m.label}</span>
                <Icon className={`w-4 h-4 ${m.color}`} />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-white font-mono tabular-nums">{m.value}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{m.change}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Table / Management Container */}
      {activeTab === 'users' ? (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">University User Registry</h2>
              <div className="text-xs text-slate-400">Manage students, faculty mentors, and institutional permissions.</div>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                placeholder="Filter by name, email, ID..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Responsive Table Container (Internal scrolling only, zero whole-page horizontal spill) */}
          <div className="overflow-x-auto rounded-xl border border-slate-800/80">
            <table className="w-full text-left text-xs text-slate-300 divide-y divide-slate-800">
              <thead className="bg-slate-950/70 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Member</th>
                  <th className="px-4 py-3">Institutional ID</th>
                  <th className="px-4 py-3">Role & Department</th>
                  <th className="px-4 py-3">Track Record</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40 font-normal">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatarUrl}
                          alt={user.fullName}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700"
                        />
                        <div>
                          <div className="font-semibold text-white">{user.fullName}</div>
                          <div className="text-[11px] text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap font-mono text-slate-400 text-[11px]">
                      {user.collegeId}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                            user.role === 'admin'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : user.role === 'faculty'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                          }`}
                        >
                          {user.role}
                        </span>
                        <span className="text-slate-400 text-[11px]">{user.branch}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap font-mono text-slate-300">
                      {user.totalScore} XP · {user.completedModulesCount} Modules
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap text-right">
                      <button
                        onClick={() => alert(`Opening administrative audit log for ${user.fullName}.`)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 transition-colors"
                      >
                        Audit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Modules Management Tab */
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Active Curriculum Tracks</h2>
              <div className="text-xs text-slate-400">Institutional learning modules and published status.</div>
            </div>
            <button
              onClick={() => alert('New Curriculum Track wizard launched.')}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Module</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="text-xs text-indigo-400 font-semibold">{m.category}</div>
                  <h3 className="text-sm font-bold text-white">{m.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{m.description}</p>
                  <div className="text-[11px] text-slate-500 pt-1 font-mono">
                    Lead: {m.instructor} · {m.conceptsCount} Concepts · {m.studentCount} Students
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                    Published
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
