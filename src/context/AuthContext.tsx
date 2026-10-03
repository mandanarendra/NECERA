import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, PlatformNotification, AcademicYear } from '../types';
import { neceraStore } from '../services/store';

interface AuthContextType {
  currentUser: UserProfile | null;
  role: UserRole;
  token: string | null;
  isAuthenticated: boolean;
  needsOnboarding: boolean;
  login: (emailOrId: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    fullName: string;
    email: string;
    collegeId: string;
    password: string;
    confirmPassword?: string;
    year: AcademicYear;
    branch: string;
  }) => Promise<{ success: boolean; error?: string }>;
  completeOnboarding: (data: {
    year: AcademicYear;
    branch: string;
    interests: string[];
    goals: string[];
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  switchRole: (newRole: UserRole) => void;
  notifications: PlatformNotification[];
  unreadNotifsCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'necera_auth_token';
const USER_KEY = 'necera_active_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY) || null;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [needsOnboarding, setNeedsOnboarding] = useState<boolean>(() => {
    return currentUser ? !currentUser.onboardingCompleted : false;
  });

  const [role, setRole] = useState<UserRole>(() => currentUser?.role || 'student');
  const [notifications, setNotifications] = useState<PlatformNotification[]>(() =>
    neceraStore.getNotifications()
  );

  const isAuthenticated = Boolean(token && currentUser);

  // Periodically sync notifications
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      setNotifications(neceraStore.getNotifications());
    }, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Synchronize on mount if token exists
  useEffect(() => {
    if (token && !currentUser) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((data) => {
          if (data.user) {
            setCurrentUser(data.user);
            setRole(data.user.role || 'student');
            setNeedsOnboarding(!data.user.onboardingCompleted);
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
          }
        })
        .catch(() => {
          // Token invalid, clear
          logout();
        });
    }
  }, [token]);

  const login = async (
    emailOrId: string,
    password: string,
    rememberMe = true
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrId, password, rememberMe }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed. Please check credentials.' };
      }

      setToken(data.token);
      setCurrentUser(data.user);
      setRole(data.user.role || 'student');
      setNeedsOnboarding(Boolean(data.requiresOnboarding));

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      neceraStore.setCurrentUser(data.user);

      return { success: true };
    } catch (err: any) {
      // Local fallback for offline simulation
      console.warn('Backend login unreachable, evaluating offline store:', err);
      const all = neceraStore.getAllUsers();
      const matched = all.find(
        (u) =>
          u.email.toLowerCase() === emailOrId.toLowerCase() ||
          u.collegeId.toLowerCase() === emailOrId.toLowerCase()
      );
      if (matched) {
        const dummyToken = 'offline_' + btoa(matched.id);
        setToken(dummyToken);
        setCurrentUser(matched);
        setRole(matched.role);
        setNeedsOnboarding(!matched.onboardingCompleted);
        localStorage.setItem(TOKEN_KEY, dummyToken);
        localStorage.setItem(USER_KEY, JSON.stringify(matched));
        return { success: true };
      }
      return { success: false, error: 'Could not connect to authentication server. Please try again.' };
    }
  };

  const register = async (data: {
    fullName: string;
    email: string;
    collegeId: string;
    password: string;
    confirmPassword?: string;
    year: AcademicYear;
    branch: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || 'Registration failed.' };
      }

      setToken(resData.token);
      setCurrentUser(resData.user);
      setRole(resData.user.role || 'student');
      setNeedsOnboarding(true);

      localStorage.setItem(TOKEN_KEY, resData.token);
      localStorage.setItem(USER_KEY, JSON.stringify(resData.user));
      neceraStore.setCurrentUser(resData.user);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: 'Network error occurred during registration. Please try again.' };
    }
  };

  const completeOnboarding = async (data: {
    year: AcademicYear;
    branch: string;
    interests: string[];
    goals: string[];
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uid: currentUser?.id,
          ...data,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || 'Failed to update preferences.' };
      }

      const updated = {
        ...currentUser,
        ...resData.user,
        onboardingCompleted: true,
      };

      setCurrentUser(updated);
      setNeedsOnboarding(false);
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      neceraStore.setCurrentUser(updated);

      return { success: true };
    } catch (err: any) {
      // Local fallback
      if (currentUser) {
        const updated = {
          ...currentUser,
          year: data.year,
          branch: data.branch,
          interests: data.interests,
          goals: data.goals,
          onboardingCompleted: true,
        };
        setCurrentUser(updated);
        setNeedsOnboarding(false);
        localStorage.setItem(USER_KEY, JSON.stringify(updated));
        neceraStore.setCurrentUser(updated);
        return { success: true };
      }
      return { success: false, error: 'Could not save onboarding preferences.' };
    }
  };

  const logout = () => {
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    setToken(null);
    setCurrentUser(null);
    setNeedsOnboarding(false);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    const merged = { ...currentUser, ...data };
    setCurrentUser(merged);
    localStorage.setItem(USER_KEY, JSON.stringify(merged));
    neceraStore.updateProfile(data);
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    if (currentUser) {
      const updated = { ...currentUser, role: newRole };
      setCurrentUser(updated);
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
    }
  };

  const markNotificationRead = (id: string) => {
    neceraStore.markNotificationAsRead(id);
    setNotifications(neceraStore.getNotifications());
  };

  const markAllNotificationsRead = () => {
    neceraStore.markAllNotificationsRead();
    setNotifications(neceraStore.getNotifications());
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        token,
        isAuthenticated,
        needsOnboarding,
        login,
        register,
        completeOnboarding,
        logout,
        updateProfile,
        switchRole,
        notifications,
        unreadNotifsCount,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
