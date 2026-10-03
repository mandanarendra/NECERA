import { relations } from 'drizzle-orm';
import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';

// 1. Users Table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Auth UID or student ID
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  passwordHash: text('password_hash'),
  passwordSalt: text('password_salt'),
  role: text('role').default('student'),
  collegeId: text('college_id'),
  branch: text('branch'),
  year: text('year'),
  interests: text('interests'), // Comma-separated or JSON
  goals: text('goals'), // Comma-separated or JSON
  onboardingCompleted: boolean('onboarding_completed').default(false),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 2. Learning Modules Table
export const modules = pgTable('modules', {
  id: text('id').primaryKey(), // e.g. 'mod_blockchain_01', 'mod_robotics_01', 'mod_edge_01'
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(), // 'Systems & Full Stack', 'AI & Machine Learning', etc.
  difficulty: text('difficulty').notNull(), // 'Beginner', 'Intermediate', 'Advanced'
  recommendedYear: text('recommended_year').default('All Years'), // '1st Year', '2nd Year', '3rd Year', '4th Year', 'All Years'
  thumbnail: text('thumbnail'),
  instructor: text('instructor'),
  estimatedHours: integer('estimated_hours').default(40),
  prerequisites: text('prerequisites'), // JSON or comma-separated list
  published: boolean('published').default(true),
  rating: text('rating').default('4.9'),
  studentCount: integer('student_count').default(0),
  conceptsCount: integer('concepts_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 3. Roadmap Nodes Table
export const roadmapNodes = pgTable('roadmap_nodes', {
  id: text('id').primaryKey(), // e.g. 'node_chain_01'
  moduleId: text('module_id')
    .references(() => modules.id, { onDelete: 'cascade' })
    .notNull(),
  order: integer('order').notNull(),
  conceptTitle: text('concept_title').notNull(),
  description: text('description').notNull(),
  difficulty: text('difficulty').notNull(),
  prerequisites: text('prerequisites'),
  status: text('status').default('unlocked'), // 'completed', 'in_progress', 'unlocked', 'locked'
  estimatedMinutes: integer('estimated_minutes').default(90),
  materialsCount: integer('materials_count').default(4),
  tasksCount: integer('tasks_count').default(2),
  passScoreRequired: integer('pass_score_required').default(80),
  weakTopics: text('weak_topics'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 4. Learning Materials Table
export const learningMaterials = pgTable('learning_materials', {
  id: text('id').primaryKey(),
  conceptId: text('concept_id')
    .references(() => roadmapNodes.id, { onDelete: 'cascade' })
    .notNull(),
  type: text('type').notNull(), // 'notes', 'code', 'pdf', 'video', 'dataset'
  title: text('title').notNull(),
  description: text('description'),
  durationOrPages: text('duration_or_pages'),
  downloadAllowed: boolean('download_allowed').default(true),
  content: text('content'),
  codeLanguage: text('code_language').default('python'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 5. Tasks Table
export const tasks = pgTable('tasks', {
  id: text('id').primaryKey(),
  conceptId: text('concept_id')
    .references(() => roadmapNodes.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  description: text('description'),
  difficulty: text('difficulty').notNull(),
  taskType: text('task_type').notNull(),
  instructions: text('instructions'),
  timeEstimateMinutes: integer('time_estimate_minutes').default(45),
  deadline: text('deadline'),
  maxScore: integer('max_score').default(100),
  passingScore: integer('passing_score').default(80),
  starterCode: text('starter_code'),
  solutionHint: text('solution_hint'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 6. Student Progress Table
export const studentProgress = pgTable('student_progress', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  moduleId: text('module_id')
    .references(() => modules.id, { onDelete: 'cascade' })
    .notNull(),
  progressPercent: integer('progress_percent').default(0),
  completed: boolean('completed').default(false),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relationships
export const modulesRelations = relations(modules, ({ many }) => ({
  nodes: many(roadmapNodes),
  progress: many(studentProgress),
}));

export const roadmapNodesRelations = relations(roadmapNodes, ({ one, many }) => ({
  module: one(modules, {
    fields: [roadmapNodes.moduleId],
    references: [modules.id],
  }),
  materials: many(learningMaterials),
  tasks: many(tasks),
}));

export const learningMaterialsRelations = relations(learningMaterials, ({ one }) => ({
  node: one(roadmapNodes, {
    fields: [learningMaterials.conceptId],
    references: [roadmapNodes.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  node: one(roadmapNodes, {
    fields: [tasks.conceptId],
    references: [roadmapNodes.id],
  }),
}));
