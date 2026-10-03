import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { ModulesView } from './components/modules/ModulesView';
import { AiMentorView } from './components/ai/AiMentorView';
import { AiProjectGeneratorView } from './components/ai/AiProjectGeneratorView';
import { CollaborationView } from './components/collaboration/CollaborationView';
import { HackathonsView } from './components/hackathons/HackathonsView';
import { PortfolioView } from './components/portfolio/PortfolioView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';

// Modals & Auth Screens
import { MaterialModal } from './components/materials/MaterialModal';
import { AssessmentModal } from './components/assessment/AssessmentModal';
import { ProfileModal } from './components/auth/ProfileModal';
import { AuthModal } from './components/auth/AuthModal';
import { AuthScreen } from './components/auth/AuthScreen';
import { OnboardingModal } from './components/onboarding/OnboardingModal';

const AppContent: React.FC = () => {
  const { role, isAuthenticated, needsOnboarding } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Modals state
  const [selectedModuleId, setSelectedModuleId] = useState<string>('mod_ml_01');
  const [selectedMaterialConceptId, setSelectedMaterialConceptId] = useState<string | null>(null);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mentorInitialTopic, setMentorInitialTopic] = useState<string | undefined>(undefined);

  // Requirement 1: FIRST SCREEN — LOGIN.
  // When the NECERA application opens, the FIRST screen must be the Login page.
  // Do not open directly to the dashboard.
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  const handleOpenMaterial = (conceptId: string) => {
    setSelectedMaterialConceptId(conceptId);
  };

  const handleOpenAssessment = (assessmentId: string) => {
    setSelectedAssessmentId(assessmentId);
  };

  const handleNavigateToMentor = (topic?: string) => {
    setMentorInitialTopic(topic);
    setActiveTab('mentor');
  };

  const handleSelectModule = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setActiveTab('roadmap');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Top Bar Contract Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-12">
        {activeTab === 'dashboard' && (
          <DashboardView
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenAssessment={handleOpenAssessment}
            onOpenMaterial={handleOpenMaterial}
          />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapView
            initialModuleId={selectedModuleId}
            onOpenMaterial={handleOpenMaterial}
            onOpenAssessment={handleOpenAssessment}
            onNavigateToMentor={handleNavigateToMentor}
          />
        )}

        {activeTab === 'modules' && (
          <ModulesView
            onSelectModule={handleSelectModule}
            onOpenRoadmap={() => setActiveTab('roadmap')}
          />
        )}

        {activeTab === 'mentor' && (
          <AiMentorView initialTopic={mentorInitialTopic} />
        )}

        {activeTab === 'project-lab' && (
          <AiProjectGeneratorView />
        )}

        {activeTab === 'collaboration' && (
          <CollaborationView />
        )}

        {activeTab === 'hackathons' && (
          <HackathonsView />
        )}

        {activeTab === 'portfolio' && (
          <PortfolioView />
        )}

        {activeTab === 'admin' && role === 'admin' && (
          <AdminDashboardView />
        )}
      </main>

      {/* Mobile Bottom Navigation (Visible on screen < 768px) */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Modals & Dialogs */}
      {selectedMaterialConceptId && (
        <MaterialModal
          conceptId={selectedMaterialConceptId}
          onClose={() => setSelectedMaterialConceptId(null)}
          onOpenAssessment={(asmId) => {
            setSelectedMaterialConceptId(null);
            setSelectedAssessmentId(asmId);
          }}
        />
      )}

      {selectedAssessmentId && (
        <AssessmentModal
          assessmentId={selectedAssessmentId}
          onClose={() => setSelectedAssessmentId(null)}
          onNavigateToMentor={(weakTopic) => {
            setSelectedAssessmentId(null);
            handleNavigateToMentor(weakTopic);
          }}
        />
      )}

      {showProfileModal && (
        <ProfileModal onClose={() => setShowProfileModal(false)} />
      )}

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
