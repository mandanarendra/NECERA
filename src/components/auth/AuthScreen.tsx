import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AcademicYear } from '../../types';
import { NeceraLogo } from '../common/NeceraLogo';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  GraduationCap,
  Building2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  KeyRound,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { login, register } = useAuth();

  // Mode: 'login' | 'register' | 'forgot'
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Login form state
  const [loginEmailOrId, setLoginEmailOrId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCollegeId, setRegCollegeId] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regYear, setRegYear] = useState<AcademicYear>('1st Year');
  const [regBranch, setRegBranch] = useState('AI & ML');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Forgot password form state
  const [forgotEmailOrId, setForgotEmailOrId] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  // Status & feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Quick Persona Presets for fast testing
  const demoPersonas = [
    {
      year: '1st Year' as AcademicYear,
      name: 'Priya Narang',
      id: '2024ECE0055',
      email: 'priya.narang@eng.univ.edu',
      branch: 'ECE',
      focus: 'Programming Fundamentals & Python',
    },
    {
      year: '2nd Year' as AcademicYear,
      name: 'Aarav Sharma',
      id: '2023CSB1042',
      email: 'aarav.sharma@eng.univ.edu',
      branch: 'CSE',
      focus: 'Data Structures & ML Intro',
    },
    {
      year: '3rd Year' as AcademicYear,
      name: 'Jaswanth Kumar',
      id: '2022AIML018',
      email: 'jaswanth.k@eng.univ.edu',
      branch: 'AI & ML',
      focus: 'Generative AI & LLMs',
    },
    {
      year: '4th Year' as AcademicYear,
      name: 'Karthik Rao',
      id: '2021MECH003',
      email: 'karthik.rao@eng.univ.edu',
      branch: 'Mechanical',
      focus: 'Autonomous Robotics & Capstone',
    },
  ];

  const handleQuickFill = (email: string) => {
    setLoginEmailOrId(email);
    setLoginPassword('Password123!');
    setErrorMessage(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginEmailOrId.trim()) {
      setErrorMessage('Please enter your Email or Student ID.');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    const result = await login(loginEmailOrId.trim(), loginPassword, rememberMe);
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!regFullName.trim() || regFullName.trim().length < 2) {
      setErrorMessage('Please enter your legal Full Name.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regEmail.trim() || !emailRegex.test(regEmail.trim())) {
      setErrorMessage('Please enter a valid email address (e.g. name@college.edu).');
      return;
    }
    if (!regCollegeId.trim() || regCollegeId.trim().length < 3) {
      setErrorMessage('Please enter your Student ID / Roll Number.');
      return;
    }
    if (!regPassword || regPassword.length < 8) {
      setErrorMessage('Password must contain at least 8 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);
    const result = await register({
      fullName: regFullName.trim(),
      email: regEmail.trim().toLowerCase(),
      collegeId: regCollegeId.trim(),
      password: regPassword,
      confirmPassword: regConfirmPassword,
      year: regYear,
      branch: regBranch,
    });
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Registration failed.');
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setForgotSuccess(null);

    if (!forgotEmailOrId.trim()) {
      setErrorMessage('Please enter your registered Email or Student ID.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrId: forgotEmailOrId.trim() }),
      });
      const data = await res.json();
      setIsLoading(false);
      if (res.ok) {
        setForgotSuccess(data.message || 'Password reset link sent to your registered email.');
      } else {
        setErrorMessage(data.error || 'Unable to locate account with that identifier.');
      }
    } catch {
      setIsLoading(false);
      setForgotSuccess(`Password reset instructions simulated for ${forgotEmailOrId}.`);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-between relative overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background Ambient Glow Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-900/15 via-cyan-900/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <NeceraLogo size="md" showSubtext={true} />
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Ecosystem v2.4 Live
          </span>
        </div>
      </header>

      {/* Main Content Card Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-xl">
          {/* Main Card */}
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-10 transition-all">
            
            {/* Header / Tabs */}
            {mode !== 'forgot' && (
              <div className="flex items-center p-1 rounded-2xl bg-slate-950/80 border border-slate-800/80 mb-8">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    mode === 'login'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    mode === 'register'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Error Message Banner */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-red-950/40 border border-red-800/60 text-red-200 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in-50 duration-200">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">{errorMessage}</div>
              </div>
            )}

            {/* Success Message Banner */}
            {successMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in-50 duration-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1">{successMessage}</div>
              </div>
            )}

            {/* 1. LOGIN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Student & Faculty Sign In
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Enter your academic credentials to access your autonomous roadmap.
                  </p>
                </div>

                {/* Email / Student ID field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Email Address or Student ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={loginEmailOrId}
                      onChange={(e) => setLoginEmailOrId(e.target.value)}
                      placeholder="e.g. 2022AIML018 or jaswanth.k@eng.univ.edu"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    />
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setErrorMessage(null);
                        setForgotEmailOrId(loginEmailOrId);
                      }}
                      className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    />
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition-colors"
                      aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-xs text-slate-400">Remember this device for 14 days</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authenticating credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to NECERA</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* One-Click Quick Test Personas for Evaluators */}
                <div className="pt-5 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      Quick Test Personas (All 4 Academic Years)
                    </span>
                    <span className="text-slate-500 font-mono">1-Click</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {demoPersonas.map((p) => (
                      <button
                        key={p.year}
                        type="button"
                        onClick={() => handleQuickFill(p.email)}
                        className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-800/40 text-left transition-all group"
                      >
                        <div className="text-[10px] font-mono font-bold text-indigo-400 group-hover:text-indigo-300">
                          {p.year}
                        </div>
                        <div className="text-xs font-semibold text-white truncate mt-0.5">
                          {p.name.split(' ')[0]}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{p.branch}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            )}

            {/* 2. REGISTRATION FORM */}
            {mode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Create Student Account
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Join NECERA with your academic year and start your personalized learning track.
                  </p>
                </div>

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="e.g. Jaswanth Kumar"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Email and Student ID grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-300">
                      College Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="name@eng.univ.edu"
                        required
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                      <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-300">
                      Student ID / Roll No.
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={regCollegeId}
                        onChange={(e) => setRegCollegeId(e.target.value)}
                        placeholder="e.g. 2024ECE0055"
                        required
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                {/* Academic Year & Branch Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-300">
                      Academic Year
                    </label>
                    <div className="relative">
                      <select
                        value={regYear}
                        onChange={(e) => setRegYear(e.target.value as AcademicYear)}
                        className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none transition-colors"
                      >
                        <option value="1st Year">1st Year (Foundations)</option>
                        <option value="2nd Year">2nd Year (Core & Systems)</option>
                        <option value="3rd Year">3rd Year (Advanced AI & Full-Stack)</option>
                        <option value="4th Year">4th Year (Capstone & Industry)</option>
                      </select>
                      <GraduationCap className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-300">
                      Branch / Department
                    </label>
                    <div className="relative">
                      <select
                        value={regBranch}
                        onChange={(e) => setRegBranch(e.target.value)}
                        className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none transition-colors"
                      >
                        <option value="AI & ML">AI & Machine Learning</option>
                        <option value="CSE">Computer Science & Engineering</option>
                        <option value="ECE">Electronics & Communication</option>
                        <option value="EEE">Electrical & Electronics</option>
                        <option value="Mechanical">Mechanical Engineering</option>
                        <option value="Civil">Civil Engineering</option>
                        <option value="Other">Other Engineering Specialization</option>
                      </select>
                      <Building2 className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                {/* Password and Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-300">
                      Password (8+ chars)
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                      <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-300">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showRegConfirmPassword ? 'text' : 'password'}
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                      <KeyRound className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <button
                        type="button"
                        onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showRegConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-start gap-1.5 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>
                    Passwords are encrypted with salted PBKDF2 (SHA-512). Plain-text passwords are never stored.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Creating secure account...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* 3. FORGOT PASSWORD VIEW */}
            {mode === 'forgot' && (
              <form onSubmit={handleForgotSubmit} className="space-y-5">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Reset Your Password
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Enter your registered institutional email or Student ID to receive a password reset token.
                  </p>
                </div>

                {forgotSuccess ? (
                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 text-xs sm:text-sm space-y-3">
                    <div className="flex items-center gap-2 font-bold text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Reset Instructions Dispatched</span>
                    </div>
                    <p>{forgotSuccess}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setForgotSuccess(null);
                      }}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
                    >
                      Return to Sign In
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        Email Address or Student ID
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={forgotEmailOrId}
                          onChange={(e) => setForgotEmailOrId(e.target.value)}
                          placeholder="e.g. 2022AIML018 or jaswanth.k@eng.univ.edu"
                          required
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setMode('login');
                          setErrorMessage(null);
                        }}
                        className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <span>Send Reset Link</span>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}

          </div>

          {/* Academic Policy Footer Note */}
          <div className="text-center text-xs text-slate-500 mt-6 space-y-1">
            <p>
              NECERA Engineering Learning & Innovation Ecosystem
            </p>
            <p className="text-[11px] text-slate-600">
              Cross-year course exploration enabled · Academic Year sets personalized recommendations
            </p>
          </div>
        </div>
      </main>

      {/* Subtle Bottom Bar */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center sm:text-left text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-900">
        <div>© 2026 NECERA. All rights reserved.</div>
        <div className="flex items-center gap-4 text-slate-500">
          <span>Privacy & Security</span>
          <span>·</span>
          <span>Terms of Engineering Service</span>
          <span>·</span>
          <span>Academic Integrity Policy</span>
        </div>
      </footer>
    </div>
  );
};
