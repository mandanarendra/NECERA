export type UserRole = 'student' | 'faculty' | 'admin';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  collegeId: string;
  branch: string;
  year: string;
  avatarUrl: string;
  skills: string[];
  bio: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  joinedDate: string;
  completedModulesCount: number;
  totalScore: number;
  currentStreakDays: number;
  onboardingCompleted?: boolean;
  interests?: string[];
  goals?: string[];
}

export type AcademicYear = '1st Year' | '2nd Year' | '3rd Year' | '4th Year';

export type ModuleCategory = 'AI & Machine Learning' | 'Data Science' | 'Systems & Full Stack' | 'Cloud & DevOps' | 'Cybersecurity' | 'Programming' | 'Web Development' | 'UI/UX';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: ModuleCategory;
  difficulty: DifficultyLevel;
  recommendedYear?: AcademicYear | 'All Years';
  thumbnail: string;
  instructor: string;
  estimatedHours: number;
  prerequisites: string[];
  skillsLearned?: string[];
  published: boolean;
  studentCount: number;
  rating: number;
  conceptsCount: number;
  progressPercent: number; // For current student
  updatedAt: string;
}

export type NodeStatus = 'locked' | 'unlocked' | 'in_progress' | 'completed';

export interface RoadmapNode {
  id: string;
  moduleId: string;
  order: number;
  conceptTitle: string;
  description: string;
  difficulty: DifficultyLevel;
  prerequisites: string[];
  status: NodeStatus;
  progress: number; // 0 - 100
  estimatedMinutes: number;
  materialsCount: number;
  tasksCount: number;
  assessmentId: string;
  passScoreRequired: number;
  weakTopics?: string[];
}

export type MaterialType = 'pdf' | 'ppt' | 'video' | 'notes' | 'code' | 'dataset';

export interface LearningMaterial {
  id: string;
  conceptId: string;
  type: MaterialType;
  title: string;
  description: string;
  durationOrPages: string;
  downloadAllowed: boolean;
  completed: boolean;
  lastViewedAt?: string;
  content: string; // Markdown or code snippet or notes
  codeLanguage?: string;
}

export type TaskType = 'basic' | 'intermediate' | 'advanced' | 'challenge' | 'coding' | 'debugging' | 'mini_project';
export type TaskStatus = 'pending' | 'submitted' | 'graded';

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  hidden: boolean;
  passed?: boolean;
}

export interface Task {
  id: string;
  conceptId: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  taskType: TaskType;
  instructions: string;
  timeEstimateMinutes: number;
  deadline: string;
  maxScore: number;
  passingScore: number;
  status: TaskStatus;
  studentScore?: number;
  starterCode?: string;
  solutionHint?: string;
  testCases?: TestCase[];
  submittedCode?: string;
  submissionFeedback?: string;
}

export type QuestionType = 'mcq' | 'true_false' | 'short_answer' | 'code_output' | 'debugging';

export interface AssessmentQuestion {
  id: string;
  type: QuestionType;
  question: string;
  codeSnippet?: string;
  options?: string[]; // for mcq
  correctAnswer: string;
  explanation: string;
  points: number;
  conceptKey: string;
}

export interface Assessment {
  id: string;
  conceptId: string;
  title: string;
  description: string;
  durationMinutes: number;
  passingScore: number;
  questions: AssessmentQuestion[];
  attempts: number;
  maxAttempts: number;
  lastScore?: number;
  passed?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: 'Foundation' | 'Mastery' | 'Innovation' | 'Hackathon';
  earnedAt?: string;
  isUnlocked: boolean;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  deliverable: string;
}

export interface ActiveProject {
  id: string;
  title: string;
  problemStatement: string;
  realWorldObjective: string;
  category: string;
  difficulty: DifficultyLevel;
  requiredSkills: string[];
  techStack: string[];
  datasetSuggestions: string[];
  progressPercent: number;
  milestones: ProjectMilestone[];
  repoUrl?: string;
  liveUrl?: string;
  generatedByAi: boolean;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: 'Project Lead' | 'ML Engineer' | 'Data Scientist' | 'Backend Developer' | 'Frontend Developer' | 'UI/UX Designer';
  branch: string;
  email: string;
}

export interface Team {
  id: string;
  name: string;
  projectGoal: string;
  category: string;
  leadName: string;
  leadId: string;
  members: TeamMember[];
  openRoles: string[];
  hackathonId?: string;
  createdAt: string;
}

export interface Hackathon {
  id: string;
  title: string;
  tagline: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  teamSize: string;
  eligibility: string;
  rules: string[];
  problemStatements: { id: string; title: string; track: string; prompt: string }[];
  prizes: { rank: string; amount: string; perks: string }[];
  registered: boolean;
  status: 'upcoming' | 'live' | 'judging' | 'completed';
}

export interface PlatformNotification {
  id: string;
  title: string;
  message: string;
  type: 'achievement' | 'task' | 'system' | 'reminder';
  time: string;
  read: boolean;
}

export interface StudentProgressSkill {
  name: string;
  percentage: number;
  level: string;
  modulesCompleted: number;
}
