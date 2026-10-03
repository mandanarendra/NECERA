import * as dotenv from 'dotenv';
dotenv.config();

import { db } from '../src/db/index.ts';
import { users } from '../src/db/schema.ts';
import { hashPassword } from '../src/server/auth.ts';

export const SEED_USERS = [
  {
    uid: 'usr_student_jaswanth',
    email: 'jaswanth.k@eng.univ.edu',
    fullName: 'Jaswanth Kumar',
    collegeId: '2022AIML018',
    branch: 'AI & ML',
    year: '3rd Year',
    interests: 'Artificial Intelligence, Generative AI, LLMs, Machine Learning',
    goals: 'Build projects, Prepare for placements, Explore AI',
    onboardingCompleted: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    bio: '3rd Year AI & ML engineering student specializing in generative architectures and LLM application development.',
  },
  {
    uid: 'usr_student_aarav',
    email: 'aarav.sharma@eng.univ.edu',
    fullName: 'Aarav Sharma',
    collegeId: '2023CSB1042',
    branch: 'CSE',
    year: '2nd Year',
    interests: 'Data Structures, Machine Learning, Web Development',
    goals: 'Improve my skills, Build projects',
    onboardingCompleted: true,
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
    bio: '2nd Year Computer Science student passionate about data structures and machine learning fundamentals.',
  },
  {
    uid: 'usr_student_priya',
    email: 'priya.narang@eng.univ.edu',
    fullName: 'Priya Narang',
    collegeId: '2024ECE0055',
    branch: 'ECE',
    year: '1st Year',
    interests: 'Programming Fundamentals, Python, C/C++',
    goals: 'Learn from basics, Build projects',
    onboardingCompleted: true,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    bio: '1st Year engineering student learning programming fundamentals, problem solving, and Python systems.',
  },
  {
    uid: 'usr_student_karthik',
    email: 'karthik.rao@eng.univ.edu',
    fullName: 'Karthik Rao',
    collegeId: '2021MECH003',
    branch: 'Mechanical',
    year: '4th Year',
    interests: 'Autonomous Robotics, Edge Computing, System Design',
    goals: 'Prepare for placements, Build a portfolio',
    onboardingCompleted: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    bio: '4th Year engineering student focusing on robotics kinematics, TinyML, and capstone deployment.',
  },
  {
    uid: 'usr_admin_necera',
    email: 'admin@necera.edu',
    fullName: 'Dr. Marcus Vance (Admin)',
    collegeId: 'ADM_NEC_001',
    branch: 'Academic Infrastructure',
    year: '4th Year',
    role: 'admin',
    interests: 'Curriculum Engineering, Ecosystem Operations',
    goals: 'Prepare for placements',
    onboardingCompleted: true,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    bio: 'NECERA Platform Administrator and Academic Infrastructure Lead.',
  },
];

export async function seedUsers() {
  console.log('Seeding demo student accounts with secure password hashing...');
  const { hash, salt } = hashPassword('Password123!');

  for (const user of SEED_USERS) {
    await db
      .insert(users)
      .values({
        ...user,
        passwordHash: hash,
        passwordSalt: salt,
      })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          fullName: user.fullName,
          collegeId: user.collegeId,
          branch: user.branch,
          year: user.year,
          interests: user.interests,
          goals: user.goals,
          onboardingCompleted: user.onboardingCompleted,
          passwordHash: hash,
          passwordSalt: salt,
          updatedAt: new Date(),
        },
      });
    console.log(`✓ Seeded user: ${user.fullName} (${user.email} / ${user.collegeId})`);
  }
}

if (process.argv[1]?.endsWith('seed-users.ts')) {
  seedUsers()
    .then(() => {
      console.log('User seeding completed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeding failed:', err);
      process.exit(1);
    });
}
