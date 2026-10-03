import {
  UserProfile,
  LearningModule,
  RoadmapNode,
  LearningMaterial,
  Task,
  Assessment,
  Badge,
  ActiveProject,
  Team,
  Hackathon,
  PlatformNotification,
  UserRole,
} from '../types';

import {
  INITIAL_STUDENT_PROFILE,
  INITIAL_FACULTY_PROFILE,
  INITIAL_ADMIN_PROFILE,
  INITIAL_MODULES,
  INITIAL_ROADMAP_NODES,
  INITIAL_MATERIALS,
  INITIAL_TASKS,
  INITIAL_ASSESSMENT,
  INITIAL_ASSESSMENTS_MAP,
  INITIAL_BADGES,
  INITIAL_PROJECTS,
  INITIAL_TEAMS,
  INITIAL_HACKATHONS,
  INITIAL_NOTIFICATIONS,
} from '../data/seedData';

const STORAGE_KEYS = {
  CURRENT_USER: 'necera_current_user',
  ROLE: 'necera_active_role',
  MODULES: 'necera_modules',
  ROADMAP_NODES: 'necera_roadmap_nodes',
  MATERIALS: 'necera_materials',
  TASKS: 'necera_tasks',
  ASSESSMENTS: 'necera_assessments',
  BADGES: 'necera_badges',
  PROJECTS: 'necera_projects',
  TEAMS: 'necera_teams',
  HACKATHONS: 'necera_hackathons',
  NOTIFICATIONS: 'necera_notifications',
  ALL_USERS: 'necera_all_users',
};

class NeceraStore {
  private getStorage<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private setStorage<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('Storage set failed:', e);
    }
  }

  // --- Auth & Users ---
  public getCurrentUser(): UserProfile {
    return this.getStorage<UserProfile>(STORAGE_KEYS.CURRENT_USER, INITIAL_STUDENT_PROFILE);
  }

  public setCurrentUser(user: UserProfile): void {
    this.setStorage(STORAGE_KEYS.CURRENT_USER, user);
  }

  public getAllUsers(): UserProfile[] {
    return this.getStorage<UserProfile[]>(STORAGE_KEYS.ALL_USERS, [
      INITIAL_STUDENT_PROFILE,
      INITIAL_FACULTY_PROFILE,
      INITIAL_ADMIN_PROFILE,
      {
        id: 'usr_student_02',
        fullName: 'Priya Narang',
        email: 'priya.narang@eng.univ.edu',
        role: 'student',
        collegeId: '2023ECB1089',
        branch: 'Electronics & Communication',
        year: '3rd Year (VI Semester)',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
        skills: ['Embedded C', 'MATLAB', 'PyTorch', 'Signal Processing'],
        bio: 'Hardware-software co-design enthusiast working on biomedical signal decoders.',
        githubUrl: 'https://github.com/priya-narang',
        linkedinUrl: 'https://linkedin.com/in/priya-narang',
        portfolioUrl: 'https://priya.necera.dev',
        joinedDate: 'September 2024',
        completedModulesCount: 3,
        totalScore: 2310,
        currentStreakDays: 8,
      },
      {
        id: 'usr_student_03',
        fullName: 'Karthik Rao',
        email: 'karthik.rao@eng.univ.edu',
        role: 'student',
        collegeId: '2022CSB1012',
        branch: 'Computer Science & Engineering',
        year: '4th Year (VIII Semester)',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
        skills: ['Go', 'Rust', 'Docker', 'Kubernetes', 'PostgreSQL'],
        bio: 'Distributed systems builder, open-source contributor, passionate about high-throughput backends.',
        githubUrl: 'https://github.com/karthik-rao-dev',
        linkedinUrl: 'https://linkedin.com/in/karthik-rao',
        portfolioUrl: 'https://karthik.necera.dev',
        joinedDate: 'July 2023',
        completedModulesCount: 6,
        totalScore: 4120,
        currentStreakDays: 21,
      },
    ]);
  }

  public switchRole(role: UserRole): UserProfile {
    let newUser: UserProfile;
    if (role === 'faculty') {
      newUser = INITIAL_FACULTY_PROFILE;
    } else if (role === 'admin') {
      newUser = INITIAL_ADMIN_PROFILE;
    } else {
      newUser = INITIAL_STUDENT_PROFILE;
    }
    this.setCurrentUser(newUser);
    return newUser;
  }

  public updateProfile(updated: Partial<UserProfile>): UserProfile {
    const current = this.getCurrentUser();
    const merged = { ...current, ...updated };
    this.setCurrentUser(merged);

    // Update in all users list as well
    const all = this.getAllUsers();
    const index = all.findIndex((u) => u.id === merged.id);
    if (index !== -1) {
      all[index] = merged;
      this.setStorage(STORAGE_KEYS.ALL_USERS, all);
    }
    return merged;
  }

  // --- Modules ---
  public getModules(): LearningModule[] {
    const stored = this.getStorage<LearningModule[]>(STORAGE_KEYS.MODULES, []);
    // Merge stored progress with INITIAL_MODULES so new modules are always present
    const map = new Map<string, LearningModule>();
    INITIAL_MODULES.forEach((m) => map.set(m.id, m));
    stored.forEach((m) => {
      const existing = map.get(m.id);
      if (existing) {
        map.set(m.id, { ...existing, progressPercent: m.progressPercent, studentCount: m.studentCount });
      } else {
        map.set(m.id, m);
      }
    });
    return Array.from(map.values());
  }

  public getModuleById(id: string): LearningModule | undefined {
    return this.getModules().find((m) => m.id === id);
  }

  public saveModule(module: LearningModule): void {
    const modules = this.getModules();
    const index = modules.findIndex((m) => m.id === module.id);
    if (index !== -1) {
      modules[index] = module;
    } else {
      modules.push(module);
    }
    this.setStorage(STORAGE_KEYS.MODULES, modules);
  }

  // --- Roadmap Nodes ---
  public getRoadmapNodes(moduleId: string = 'mod_ml_01'): RoadmapNode[] {
    const stored = this.getStorage<RoadmapNode[]>(STORAGE_KEYS.ROADMAP_NODES, []);
    const storedMap = new Map<string, RoadmapNode>();
    stored.forEach((n) => storedMap.set(n.id, n));

    const nodesForModule = INITIAL_ROADMAP_NODES.filter((n) => n.moduleId === moduleId).map((initNode) => {
      return storedMap.get(initNode.id) || initNode;
    });

    return nodesForModule.sort((a, b) => a.order - b.order);
  }

  public getRoadmapNodeById(nodeId: string): RoadmapNode | undefined {
    const stored = this.getStorage<RoadmapNode[]>(STORAGE_KEYS.ROADMAP_NODES, []);
    const foundStored = stored.find((n) => n.id === nodeId);
    if (foundStored) return foundStored;
    return INITIAL_ROADMAP_NODES.find((n) => n.id === nodeId);
  }

  public updateRoadmapNode(node: RoadmapNode): void {
    const nodes = this.getStorage<RoadmapNode[]>(STORAGE_KEYS.ROADMAP_NODES, INITIAL_ROADMAP_NODES);
    const index = nodes.findIndex((n) => n.id === node.id);
    if (index !== -1) {
      nodes[index] = node;
    } else {
      nodes.push(node);
    }
    this.setStorage(STORAGE_KEYS.ROADMAP_NODES, nodes);
  }

  public unlockNextConcept(completedNodeId: string): void {
    const node = this.getRoadmapNodeById(completedNodeId);
    const moduleId = node?.moduleId || 'mod_ml_01';
    const nodes = this.getRoadmapNodes(moduleId);
    const currentIndex = nodes.findIndex((n) => n.id === completedNodeId);
    if (currentIndex !== -1) {
      nodes[currentIndex].status = 'completed';
      nodes[currentIndex].progress = 100;

      // Unlock next
      if (currentIndex + 1 < nodes.length) {
        if (nodes[currentIndex + 1].status === 'locked') {
          nodes[currentIndex + 1].status = 'unlocked';
        }
      }

      // Persist
      const allStored = this.getStorage<RoadmapNode[]>(STORAGE_KEYS.ROADMAP_NODES, INITIAL_ROADMAP_NODES);
      nodes.forEach((updated) => {
        const idx = allStored.findIndex((a) => a.id === updated.id);
        if (idx !== -1) {
          allStored[idx] = updated;
        } else {
          allStored.push(updated);
        }
      });
      this.setStorage(STORAGE_KEYS.ROADMAP_NODES, allStored);
    }
  }

  // --- Learning Materials ---
  public getMaterials(conceptId: string): LearningMaterial[] {
    const all = this.getStorage<LearningMaterial[]>(STORAGE_KEYS.MATERIALS, INITIAL_MATERIALS);
    const existing = all.filter((m) => m.conceptId === conceptId);
    if (existing.length > 0) return existing;

    // Generate concept-specific materials dynamically
    const node = this.getRoadmapNodeById(conceptId);
    const title = node?.conceptTitle || 'Core Engineering Concept';
    const description = node?.description || 'Mathematical fundamentals and architectural derivation.';

    const dynamicMaterials: LearningMaterial[] = [
      {
        id: `mat_${conceptId}_notes`,
        conceptId,
        type: 'notes',
        title: `Comprehensive Theory & Derivations: ${title}`,
        description,
        durationOrPages: '18 min read',
        downloadAllowed: true,
        completed: false,
        content: `# ${title}
## Core Engineering Formulation
${description}

### Invariants & Mathematical Formulations
- **Computational Complexity**: $O(N)$ runtime with amortized $O(1)$ memory allocation.
- **Architectural Constraints**: Designed for distributed scale, deterministic fault-tolerance, and low-latency throughput.

### Implementation Checklist
1. Validate tensor and memory bounds prior to invocation.
2. Maintain idempotency and thread-safe synchronization.
3. Profile runtime cache misses and vectorization opportunities.`,
      },
      {
        id: `mat_${conceptId}_code`,
        conceptId,
        type: 'code',
        title: `Production Code Implementation: ${title}`,
        description: 'Vectorized, runnable code with automated unit assertions.',
        durationOrPages: 'Interactive Sandbox',
        downloadAllowed: true,
        completed: false,
        codeLanguage: 'python',
        content: `import numpy as np
import time

# NECERA Production Implementation: ${title}
class EngineModule:
    def __init__(self, debug: bool = True):
        self.debug = debug
        self.state = {}

    def forward(self, x: np.ndarray) -> np.ndarray:
        # Vectorized batch transformation
        t0 = time.perf_counter()
        normalized = (x - np.mean(x, axis=0)) / (np.std(x, axis=0) + 1e-8)
        transformed = np.tanh(normalized)
        elapsed_ms = (time.perf_counter() - t0) * 1000
        if self.debug:
            print(f"[{title}] Execution Time: {elapsed_ms:.3f}ms")
        return transformed

# Verification Test Harness
sample_input = np.random.randn(256, 32)
engine = EngineModule()
output = engine.forward(sample_input)
print(f"Output shape: {output.shape} | Mean: {np.mean(output):.4f} | Std: {np.std(output):.4f}")
assert output.shape == sample_input.shape, "Shape assertion passed!"`,
      },
      {
        id: `mat_${conceptId}_slides`,
        conceptId,
        type: 'pdf',
        title: `Lecture Slide Deck: ${title}`,
        description: 'University slide deck with architectural diagrams and benchmarks.',
        durationOrPages: '28 slides PDF',
        downloadAllowed: true,
        completed: false,
        content: `https://cdn.necera.edu/slides/${conceptId}.pdf`,
      },
      {
        id: `mat_${conceptId}_dataset`,
        conceptId,
        type: 'dataset',
        title: `Benchmark Dataset for ${title}`,
        description: 'Cleaned validation vectors with ground-truth target outputs.',
        durationOrPages: '3.8 MB Dataset',
        downloadAllowed: true,
        completed: false,
        content: `https://cdn.necera.edu/datasets/${conceptId}.csv`,
      },
    ];

    all.push(...dynamicMaterials);
    this.setStorage(STORAGE_KEYS.MATERIALS, all);
    return dynamicMaterials;
  }

  public toggleMaterialCompleted(materialId: string): LearningMaterial[] {
    const all = this.getStorage<LearningMaterial[]>(STORAGE_KEYS.MATERIALS, INITIAL_MATERIALS);
    const item = all.find((m) => m.id === materialId);
    if (item) {
      item.completed = !item.completed;
      item.lastViewedAt = 'Just now';
      this.setStorage(STORAGE_KEYS.MATERIALS, all);
    }
    return all;
  }

  // --- Tasks ---
  public getTasks(conceptId?: string): Task[] {
    const all = this.getStorage<Task[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    if (conceptId) {
      const existing = all.filter((t) => t.conceptId === conceptId);
      if (existing.length > 0) return existing;

      const node = this.getRoadmapNodeById(conceptId);
      const title = node?.conceptTitle || 'Engineering Module';

      const dynamicTask: Task = {
        id: `task_${conceptId}_01`,
        conceptId,
        title: `Implement & Benchmark: ${title}`,
        description: `Write a high-performance, vectorized implementation of ${title} conforming to standard interface constraints.`,
        difficulty: node?.difficulty || 'Intermediate',
        taskType: 'coding',
        instructions: `Complete the forward execution method for ${title}. Verify all unit assertions pass with zero NaN exceptions.`,
        timeEstimateMinutes: 45,
        deadline: 'In 3 days',
        maxScore: 100,
        passingScore: 80,
        status: 'pending',
        starterCode: `import numpy as np

def execute_${conceptId.replace(/-/g, '_')}(inputs: np.ndarray) -> np.ndarray:
    """
    Implementation for ${title}
    Args:
        inputs: numpy array with batch data
    Returns:
        transformed output matrix
    """
    # TODO: Implement algorithm
    return inputs
`,
        solutionHint: `Ensure you normalize feature scales and use vectorized matrix operations rather than python loops.`,
      };

      all.push(dynamicTask);
      this.setStorage(STORAGE_KEYS.TASKS, all);
      return [dynamicTask];
    }
    return all;
  }

  public submitTask(taskId: string, code: string): Task | undefined {
    const all = this.getStorage<Task[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    const task = all.find((t) => t.id === taskId);
    if (task) {
      task.status = 'submitted';
      task.submittedCode = code;
      task.studentScore = 95;
      task.submissionFeedback = 'Automatic verification passed! All test vectors matched expected outputs within 10ms.';
      this.setStorage(STORAGE_KEYS.TASKS, all);

      this.addNotification({
        title: `Task Submitted: ${task.title}`,
        message: 'Your code passed automated test cases and earned 95/100 points!',
        type: 'task',
      });
      return task;
    }
    return undefined;
  }

  // --- Assessments ---
  public getAssessment(assessmentId: string = 'asm_linreg'): Assessment {
    const assessments = this.getStorage<Record<string, Assessment>>(
      STORAGE_KEYS.ASSESSMENTS,
      INITIAL_ASSESSMENTS_MAP
    );
    if (assessments[assessmentId]) return assessments[assessmentId];
    if (INITIAL_ASSESSMENTS_MAP[assessmentId]) return INITIAL_ASSESSMENTS_MAP[assessmentId];

    // Look up concept node for assessmentId
    const node = INITIAL_ROADMAP_NODES.find((n) => n.assessmentId === assessmentId) ||
      INITIAL_ROADMAP_NODES.find((n) => n.id === assessmentId);

    const title = node?.conceptTitle || 'Mastery Verification Check';

    const dynamicAssessment: Assessment = {
      id: assessmentId,
      conceptId: node?.id || 'node_linreg',
      title: `${title} Mastery Check`,
      description: `Formal 15-minute diagnostic assessment covering ${title} mechanisms and design tradeoffs.`,
      durationMinutes: 15,
      passingScore: node?.passScoreRequired || 80,
      attempts: 0,
      maxAttempts: 3,
      passed: false,
      questions: [
        {
          id: `${assessmentId}_q1`,
          type: 'mcq',
          question: `What is the principal architectural objective of ${title}?`,
          options: [
            `Ensuring deterministic asymptotic bounds and minimizing computational complexity.`,
            `Eliminating all hardware dependencies by running in interpreted bytecode only.`,
            `Maximizing memory usage to prevent CPU cache thrashing.`,
            `Skipping input validation for maximum execution speed.`,
          ],
          correctAnswer: `Ensuring deterministic asymptotic bounds and minimizing computational complexity.`,
          explanation: `In production engineering, predictability and deterministic algorithmic bounds are essential for system reliability and fault tolerance.`,
          points: 25,
          conceptKey: `${title} - Core Invariants`,
        },
        {
          id: `${assessmentId}_q2`,
          type: 'true_false',
          question: `True or False: Vectorized operations in tensor frameworks achieve superior throughput compared to standard Python loops primarily due to SIMD hardware parallelization and contiguous memory access.`,
          options: ['True', 'False'],
          correctAnswer: 'True',
          explanation: `Vectorized execution leverages Single Instruction Multiple Data (SIMD) registers and avoids the overhead of the Python Global Interpreter Lock (GIL) and dynamic type dispatch per iteration.`,
          points: 25,
          conceptKey: `${title} - Vectorization`,
        },
        {
          id: `${assessmentId}_q3`,
          type: 'mcq',
          question: `When deploying ${title} in a high-traffic production pipeline, which metric is most critical for detecting system degradation?`,
          options: [
            `P99 Latency and Error Rate Distributions`,
            `Total lines of source code written`,
            `Frequency of Git commits per day`,
            `Number of unused dependencies in requirements.txt`,
          ],
          correctAnswer: `P99 Latency and Error Rate Distributions`,
          explanation: `P99 latency captures tail latency experienced by outlier requests and provides early warning for queue starvation or thread pool exhaustion.`,
          points: 25,
          conceptKey: `${title} - Production Observability`,
        },
        {
          id: `${assessmentId}_q4`,
          type: 'mcq',
          question: `How does proper regularization or bounding prevent catastrophic failure in ${title}?`,
          options: [
            `By penalizing excessive model complexity or extreme weights, stabilizing numerical gradient updates.`,
            `By setting all network weights to random numbers during inference.`,
            `By disabling backward propagation entirely.`,
            `By forcing single-threaded execution on the host machine.`,
          ],
          correctAnswer: `By penalizing excessive model complexity or extreme weights, stabilizing numerical gradient updates.`,
          explanation: `Regularization bounds the parameter search space and prevents the optimizer from fitting high-frequency noise or encountering exploding numerical conditions.`,
          points: 25,
          conceptKey: `${title} - Regularization & Stability`,
        },
      ],
    };

    assessments[assessmentId] = dynamicAssessment;
    this.setStorage(STORAGE_KEYS.ASSESSMENTS, assessments);
    return dynamicAssessment;
  }

  public submitAssessment(
    assessmentId: string,
    answers: Record<string, string>
  ): { score: number; passed: boolean; correctCount: number; totalCount: number; assessment: Assessment } {
    const assessment = this.getAssessment(assessmentId);
    let earnedPoints = 0;
    let totalPoints = 0;
    let correctCount = 0;

    assessment.questions.forEach((q) => {
      totalPoints += q.points;
      if (answers[q.id]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        earnedPoints += q.points;
        correctCount++;
      }
    });

    const score = Math.round((earnedPoints / totalPoints) * 100);
    const passed = score >= assessment.passingScore;

    assessment.attempts += 1;
    assessment.lastScore = score;
    assessment.passed = passed;

    const all = this.getStorage<Record<string, Assessment>>(
      STORAGE_KEYS.ASSESSMENTS,
      INITIAL_ASSESSMENTS_MAP
    );
    all[assessmentId] = assessment;
    this.setStorage(STORAGE_KEYS.ASSESSMENTS, all);

    if (passed) {
      this.unlockNextConcept(assessment.conceptId);
      const nextNode = this.getRoadmapNodeById(assessment.conceptId);
      this.addNotification({
        title: `Assessment Passed: ${assessment.title}`,
        message: `Congratulations! You scored ${score}% and unlocked the next concept on your roadmap!`,
        type: 'achievement',
      });
    } else {
      this.addNotification({
        title: `Assessment Diagnostic Feedback (${score}%)`,
        message: `Passing score is ${assessment.passingScore}%. Weak topics identified. Check the AI Mentor for targeted revision.`,
        type: 'reminder',
      });
    }

    return { score, passed, correctCount, totalCount: assessment.questions.length, assessment };
  }

  // --- Badges ---
  public getBadges(): Badge[] {
    return this.getStorage<Badge[]>(STORAGE_KEYS.BADGES, INITIAL_BADGES);
  }

  // --- Projects ---
  public getProjects(): ActiveProject[] {
    const stored = this.getStorage<ActiveProject[]>(STORAGE_KEYS.PROJECTS, []);
    const map = new Map<string, ActiveProject>();
    INITIAL_PROJECTS.forEach((p) => map.set(p.id, p));
    stored.forEach((p) => {
      const existing = map.get(p.id);
      if (existing) {
        map.set(p.id, { ...existing, milestones: p.milestones, progressPercent: p.progressPercent });
      } else {
        map.set(p.id, p);
      }
    });
    return Array.from(map.values());
  }

  public addProject(project: ActiveProject): void {
    const projects = this.getProjects();
    projects.unshift(project);
    this.setStorage(STORAGE_KEYS.PROJECTS, projects);

    this.addNotification({
      title: 'New Project Added to Workspace',
      message: `"${project.title}" was generated and initialized in your active project workspace.`,
      type: 'achievement',
    });
  }

  public toggleMilestone(projectId: string, milestoneId: string): void {
    const projects = this.getProjects();
    const proj = projects.find((p) => p.id === projectId);
    if (proj) {
      const ms = proj.milestones.find((m) => m.id === milestoneId);
      if (ms) {
        ms.completed = !ms.completed;
        const completedCount = proj.milestones.filter((m) => m.completed).length;
        proj.progressPercent = Math.round((completedCount / proj.milestones.length) * 100);
        this.setStorage(STORAGE_KEYS.PROJECTS, projects);
      }
    }
  }

  // --- Teams ---
  public getTeams(): Team[] {
    return this.getStorage<Team[]>(STORAGE_KEYS.TEAMS, INITIAL_TEAMS);
  }

  public createTeam(newTeam: Omit<Team, 'id' | 'createdAt'>): Team {
    const teams = this.getTeams();
    const team: Team = {
      ...newTeam,
      id: `team_${Date.now()}`,
      createdAt: 'Just now',
    };
    teams.unshift(team);
    this.setStorage(STORAGE_KEYS.TEAMS, teams);

    this.addNotification({
      title: 'Team Created Successfully',
      message: `You founded team "${team.name}" and opened slots for collaboration.`,
      type: 'system',
    });
    return team;
  }

  public joinTeam(teamId: string, roleName: string): boolean {
    const teams = this.getTeams();
    const user = this.getCurrentUser();
    const team = teams.find((t) => t.id === teamId);
    if (team) {
      const alreadyIn = team.members.some((m) => m.id === user.id);
      if (!alreadyIn) {
        team.members.push({
          id: user.id,
          name: user.fullName,
          avatar: user.avatarUrl,
          role: (roleName as any) || 'ML Engineer',
          branch: `${user.branch} (${user.year})`,
          email: user.email,
        });
        team.openRoles = team.openRoles.filter((r) => r !== roleName);
        this.setStorage(STORAGE_KEYS.TEAMS, teams);

        this.addNotification({
          title: `Joined Team: ${team.name}`,
          message: `You were added to ${team.name} as ${roleName}. Welcome to the collaboration workspace!`,
          type: 'system',
        });
        return true;
      }
    }
    return false;
  }

  // --- Hackathons ---
  public getHackathons(): Hackathon[] {
    return this.getStorage<Hackathon[]>(STORAGE_KEYS.HACKATHONS, INITIAL_HACKATHONS);
  }

  public registerHackathon(hackathonId: string): void {
    const list = this.getHackathons();
    const item = list.find((h) => h.id === hackathonId);
    if (item) {
      item.registered = true;
      this.setStorage(STORAGE_KEYS.HACKATHONS, list);
      this.addNotification({
        title: `Registered for ${item.title}`,
        message: 'Your registration is verified. Check problem statements and assemble your team!',
        type: 'achievement',
      });
    }
  }

  // --- Notifications ---
  public getNotifications(): PlatformNotification[] {
    return this.getStorage<PlatformNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }

  public markNotificationAsRead(id: string): void {
    const notifs = this.getNotifications();
    const found = notifs.find((n) => n.id === id);
    if (found) {
      found.read = true;
      this.setStorage(STORAGE_KEYS.NOTIFICATIONS, notifs);
    }
  }

  public markAllNotificationsRead(): void {
    const notifs = this.getNotifications().map((n) => ({ ...n, read: true }));
    this.setStorage(STORAGE_KEYS.NOTIFICATIONS, notifs);
  }

  public addNotification(notif: Omit<PlatformNotification, 'id' | 'time' | 'read'>): void {
    const notifs = this.getNotifications();
    const newNotif: PlatformNotification = {
      ...notif,
      id: `notif_${Date.now()}`,
      time: 'Just now',
      read: false,
    };
    notifs.unshift(newNotif);
    this.setStorage(STORAGE_KEYS.NOTIFICATIONS, notifs);
  }
}

export const neceraStore = new NeceraStore();
