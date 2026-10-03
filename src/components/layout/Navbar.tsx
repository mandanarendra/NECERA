import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { NeceraLogo } from '../common/NeceraLogo';
import {
  Bell,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  User,
  Shield,
  GraduationCap,
  LogOut,
  Menu,
  X,
  Code2,
  Layers,
  MapPin,
  Bot,
  Users2,
  Trophy,
  Briefcase,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenProfile,
  onOpenAuth,
}) => {
  const { currentUser, role, switchRole, notifications, unreadNotifsCount, markAllNotificationsRead } = useAuth();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
    { id: 'roadmap', label: 'Roadmap', icon: MapPin },
    { id: 'modules', label: 'Modules', icon: Code2 },
    { id: 'mentor', label: 'AI Mentor', icon: Bot },
    { id: 'project-lab', label: 'Project Lab', icon: Sparkles },
    { id: 'collaboration', label: 'Teams', icon: Users2 },
    { id: 'hackathons', label: 'Hackathons', icon: Trophy },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
  ];

  // If role is admin, show Admin link
  if (role === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin Console', icon: Shield });
  }

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  const handleRoleSelect = (newRole: UserRole) => {
    switchRole(newRole);
    setShowRoleDropdown(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Zone 1: Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="text-left focus:outline-none transition-transform active:scale-95"
              aria-label="NECERA Platform Home"
            >
              <NeceraLogo size="md" showSubtext={true} />
            </button>
          </div>

          {/* Zone 2: Navigation Links (Text with hover underlines, single-line) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`whitespace-nowrap transition-colors relative py-1 text-sm ${
                    isActive
                      ? 'text-indigo-400 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-500 after:rounded-full'
                      : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions (Role Switcher, Notifications, User Profile) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Role Switcher Pill / Selector */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-800/80 transition-colors"
                title="Change active simulation role"
                aria-expanded={showRoleDropdown}
              >
                {role === 'student' && <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />}
                {role === 'faculty' && <User className="w-3.5 h-3.5 text-amber-400" />}
                {role === 'admin' && <Shield className="w-3.5 h-3.5 text-emerald-400" />}
                <span className="capitalize">{role}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1 z-50 animate-in fade-in-50 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Switch Perspective
                  </div>
                  <button
                    onClick={() => handleRoleSelect('student')}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between ${
                      role === 'student' ? 'text-indigo-400 bg-slate-800/60 font-medium' : 'text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-indigo-400" />
                      Student View
                    </span>
                    {role === 'student' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleRoleSelect('faculty')}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between ${
                      role === 'faculty' ? 'text-amber-400 bg-slate-800/60 font-medium' : 'text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4 text-amber-400" />
                      Faculty / Mentor
                    </span>
                    {role === 'faculty' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleRoleSelect('admin')}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between ${
                      role === 'admin' ? 'text-emerald-400 bg-slate-800/60 font-medium' : 'text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      Administrator
                    </span>
                    {role === 'admin' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800/80 transition-colors"
                aria-label={`Notifications ${unreadNotifsCount > 0 ? `(${unreadNotifsCount} unread)` : ''}`}
              >
                <Bell className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                )}
              </button>

              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in-50 duration-150">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800">
                    <span className="text-xs font-semibold text-slate-200">Platform Notifications</span>
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-500">No notifications yet</div>
                    ) : (
                      notifications.slice(0, 5).map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3 text-xs transition-colors ${notif.read ? 'opacity-70' : 'bg-slate-800/30'}`}
                        >
                          <div className="flex items-center justify-between font-medium text-slate-200">
                            <span>{notif.title}</span>
                            <span className="text-[10px] text-slate-500">{notif.time}</span>
                          </div>
                          <p className="mt-1 text-slate-400 text-[11px] line-clamp-2">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Menu */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors group"
              aria-label="View Student Profile"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-md object-cover ring-1 ring-slate-700 group-hover:ring-indigo-500 transition-all"
              />
              <span className="hidden md:inline text-xs font-medium text-slate-200 max-w-[100px] truncate">
                {currentUser.fullName.split(' ')[0]}
              </span>
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-down / Full Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[57px] z-30 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-top duration-200">
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-5 h-5 text-indigo-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-6 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-white truncate">{currentUser.fullName}</div>
                <div className="text-xs text-slate-400 truncate">{currentUser.collegeId} · {currentUser.branch}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onOpenProfile();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
              >
                Edit Profile
              </button>
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out / Switch
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
