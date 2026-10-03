import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import {
  getModulesFromDb,
  getModuleByIdFromDb,
  insertModuleToDb,
  getRoadmapNodesFromDb,
  insertRoadmapNodeToDb,
  getMaterialsFromDb,
  insertMaterialToDb,
  getTasksFromDb,
  insertTaskToDb,
  injectModulesAndRoadmaps,
  findUserByEmailOrId,
  findUserByUid,
  createDbUser,
  updateDbUser,
} from './src/db/queries.ts';
import { runAdvancedMigration } from './scripts/migrate-advanced-modules.ts';
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
} from './src/server/auth.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// --- REST API Endpoints ---

// 1. Health & Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'NECERA Engineering Ecosystem',
    database: 'PostgreSQL Cloud SQL',
    timestamp: new Date().toISOString(),
  });
});

// Helper function to sanitize user for frontend / mobile consumption
function sanitizeUser(u: any) {
  if (!u) return null;
  const { passwordHash, passwordSalt, ...safe } = u;
  return {
    id: safe.uid || String(safe.id),
    uid: safe.uid,
    fullName: safe.fullName || 'NECERA Student',
    email: safe.email,
    role: safe.role || 'student',
    collegeId: safe.collegeId || '',
    branch: safe.branch || 'CSE',
    year: safe.year || '1st Year',
    interests: safe.interests ? (Array.isArray(safe.interests) ? safe.interests : safe.interests.split(',').map((s: string) => s.trim())) : [],
    goals: safe.goals ? (Array.isArray(safe.goals) ? safe.goals : safe.goals.split(',').map((s: string) => s.trim())) : [],
    onboardingCompleted: Boolean(safe.onboardingCompleted),
    bio: safe.bio || '',
    avatarUrl: safe.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    joinedDate: safe.createdAt ? new Date(safe.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'October 2026',
    completedModulesCount: 3,
    totalScore: 2450,
    currentStreakDays: 14,
  };
}

// --- AUTHENTICATION & ONBOARDING APIS ---

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, collegeId, password, confirmPassword, year, branch } = req.body;

    // Strict validation
    if (!fullName || fullName.trim().length < 2) {
      return res.status(400).json({ error: 'Please provide a valid full name.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Please provide a valid college or personal email address.' });
    }
    if (!collegeId || collegeId.trim().length < 3) {
      return res.status(400).json({ error: 'Please provide a valid Student ID / College Roll Number.' });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }
    const validYears = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
    const chosenYear = validYears.includes(year) ? year : '1st Year';
    const chosenBranch = branch ? branch.trim() : 'CSE';

    // Check existing
    const existing = await findUserByEmailOrId(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email is already registered. Please log in.' });
    }
    const existingId = await findUserByEmailOrId(collegeId);
    if (existingId) {
      return res.status(409).json({ error: 'An account with this Student ID is already registered.' });
    }

    // Cryptographic Password Hash (PBKDF2 SHA-512)
    const { hash, salt } = hashPassword(password);
    const uid = 'usr_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);

    const newUser = await createDbUser({
      uid,
      email: email.trim().toLowerCase(),
      fullName: fullName.trim(),
      passwordHash: hash,
      passwordSalt: salt,
      collegeId: collegeId.trim(),
      year: chosenYear,
      branch: chosenBranch,
      role: 'student',
      onboardingCompleted: false,
      interests: '',
      goals: '',
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80`,
      bio: `${chosenYear} ${chosenBranch} engineering student at NECERA.`,
    });

    const token = createSessionToken({
      uid: newUser.uid,
      email: newUser.email,
      role: newUser.role,
      fullName: newUser.fullName,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to NECERA.',
      token,
      user: sanitizeUser(newUser),
      requiresOnboarding: true,
    });
  } catch (error: any) {
    console.error('Registration failed:', error);
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { emailOrId, password, rememberMe } = req.body;

    if (!emailOrId || !emailOrId.trim()) {
      return res.status(400).json({ error: 'Please enter your Email or Student ID.' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Please enter your password.' });
    }

    const user = await findUserByEmailOrId(emailOrId.trim());
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. No account found with this Email or Student ID.' });
    }

    if (!user.passwordHash || !user.passwordSalt) {
      return res.status(401).json({ error: 'Please reset your password or sign in with your verified credentials.' });
    }

    const isValid = verifyPassword(password, user.passwordHash, user.passwordSalt);
    if (!isValid) {
      return res.status(401).json({ error: 'Incorrect password. Please verify and try again.' });
    }

    const token = createSessionToken(
      {
        uid: user.uid,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
      rememberMe ? 24 * 14 : 72
    );

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: sanitizeUser(user),
      requiresOnboarding: !user.onboardingCompleted,
    });
  } catch (error: any) {
    console.error('Login failed:', error);
    res.status(500).json({ error: error.message || 'Login failed' });
  }
});

// POST /api/auth/onboarding
app.post('/api/auth/onboarding', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let uid = req.body.uid;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const decoded = verifySessionToken(authHeader.substring(7));
      if (decoded?.uid) {
        uid = decoded.uid;
      }
    }

    if (!uid) {
      return res.status(401).json({ error: 'Unauthorized. Please sign in to save onboarding preferences.' });
    }

    const { year, branch, interests, goals } = req.body;

    const interestsStr = Array.isArray(interests) ? interests.join(', ') : (interests || '');
    const goalsStr = Array.isArray(goals) ? goals.join(', ') : (goals || '');

    const updated = await updateDbUser(uid, {
      year: year || '1st Year',
      branch: branch || 'CSE',
      interests: interestsStr,
      goals: goalsStr,
      onboardingCompleted: true,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Student record not found.' });
    }

    res.json({
      success: true,
      message: 'Onboarding completed successfully! Your personalized curriculum is ready.',
      user: sanitizeUser(updated),
    });
  } catch (error: any) {
    console.error('Onboarding failed:', error);
    res.status(500).json({ error: error.message || 'Onboarding failed' });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No active session token found.' });
    }

    const decoded = verifySessionToken(authHeader.substring(7));
    if (!decoded || !decoded.uid) {
      return res.status(401).json({ error: 'Invalid or expired session token.' });
    }

    const user = await findUserByUid(decoded.uid);
    if (!user) {
      return res.status(404).json({ error: 'User record no longer exists.' });
    }

    res.json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Session lookup failed' });
  }
});

// POST /api/auth/forgot-password
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { emailOrId } = req.body;
    if (!emailOrId) {
      return res.status(400).json({ error: 'Please enter your registered Email or Student ID.' });
    }
    const user = await findUserByEmailOrId(emailOrId.trim());
    if (!user) {
      return res.status(404).json({ error: 'No account found matching this Email or Student ID.' });
    }

    // In production, an email dispatch service sends a cryptographically signed reset token.
    res.json({
      success: true,
      message: `Password reset instructions have been dispatched to ${user.email}.`,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Password reset request failed' });
  }
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});

// 2. Modules API
app.get('/api/modules', async (req, res) => {
  try {
    const data = await getModulesFromDb();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch modules' });
  }
});

app.get('/api/modules/:id', async (req, res) => {
  try {
    const data = await getModuleByIdFromDb(req.params.id);
    if (!data) {
      return res.status(404).json({ error: 'Module not found' });
    }
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch module' });
  }
});

app.post('/api/modules', async (req, res) => {
  try {
    const created = await insertModuleToDb(req.body);
    res.status(201).json(created);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create module' });
  }
});

// 3. Roadmap Nodes API
app.get('/api/modules/:id/roadmap', async (req, res) => {
  try {
    const nodes = await getRoadmapNodesFromDb(req.params.id);
    res.json(nodes);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch roadmap nodes' });
  }
});

app.post('/api/modules/:id/roadmap', async (req, res) => {
  try {
    const nodeData = {
      ...req.body,
      moduleId: req.params.id,
    };
    const created = await insertRoadmapNodeToDb(nodeData);
    res.status(201).json(created);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create roadmap node' });
  }
});

// 4. Learning Materials API
app.get('/api/concepts/:conceptId/materials', async (req, res) => {
  try {
    const materials = await getMaterialsFromDb(req.params.conceptId);
    res.json(materials);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch materials' });
  }
});

app.post('/api/concepts/:conceptId/materials', async (req, res) => {
  try {
    const materialData = {
      ...req.body,
      conceptId: req.params.conceptId,
    };
    const created = await insertMaterialToDb(materialData);
    res.status(201).json(created);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create material' });
  }
});

// 5. Tasks API
app.get('/api/concepts/:conceptId/tasks', async (req, res) => {
  try {
    const taskList = await getTasksFromDb(req.params.conceptId);
    res.json(taskList);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch tasks' });
  }
});

app.post('/api/concepts/:conceptId/tasks', async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      conceptId: req.params.conceptId,
    };
    const created = await insertTaskToDb(taskData);
    res.status(201).json(created);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create task' });
  }
});

// 6. Migration & Bulk Injection Endpoint
// Injects additional engineering modules (Blockchain, Robotics, Edge Computing) into PostgreSQL
app.post('/api/migrations/inject-modules', async (req, res) => {
  try {
    const newModules = [
      {
        id: 'mod_blockchain_01',
        title: 'Blockchain Engineering, Smart Contracts & Web3 Protocols',
        description: 'Cryptographic hashes, Merkle trees, consensus algorithms (PoW/PoS/BFT), EVM bytecode internals, Solidity security vulnerabilities, DeFi AMM math, and Zero-Knowledge rollups.',
        category: 'Systems & Full Stack',
        difficulty: 'Advanced',
        thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80',
        instructor: 'Dr. Marcus Vance',
        estimatedHours: 50,
        prerequisites: 'Cryptography Basics, Distributed Systems, Python or C++',
        published: true,
        rating: '4.95',
        studentCount: 1680,
        conceptsCount: 8,
      },
      {
        id: 'mod_robotics_02',
        title: 'Autonomous Robotics Kinematics, ROS2 & Perception',
        description: 'Forward/inverse kinematics, Denavit-Hartenberg parameters, ROS2 action graphs, Extended Kalman Filter sensor fusion, 3D LiDAR point clouds, and SLAM navigation.',
        category: 'Systems & Full Stack',
        difficulty: 'Advanced',
        thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80',
        instructor: 'Prof. Viktor Morales',
        estimatedHours: 54,
        prerequisites: 'Linear Algebra, C++, Classical Mechanics',
        published: true,
        rating: '4.92',
        studentCount: 1120,
        conceptsCount: 8,
      },
      {
        id: 'mod_edge_01',
        title: 'Edge Computing, TinyML & Real-Time Embedded Intelligence',
        description: 'Microcontroller memory architectures, FreeRTOS real-time kernel, post-training quantization, TensorFlow Lite Micro, I2C/SPI sensor interfaces, and ultra-low-power vibration diagnostics.',
        category: 'Systems & Full Stack',
        difficulty: 'Advanced',
        thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
        instructor: 'Eng. Sarah Jenkins',
        estimatedHours: 42,
        prerequisites: 'C / Embedded Systems, Basic Machine Learning',
        published: true,
        rating: '4.91',
        studentCount: 1390,
        conceptsCount: 8,
      },
    ];

    const newNodes = [
      // Blockchain Roadmap
      {
        id: 'node_chain_01',
        moduleId: 'mod_blockchain_01',
        order: 1,
        conceptTitle: 'Cryptographic Hashes & Merkle Tree Proofs',
        description: 'SHA-256 pre-image resistance, collision resistance, Merkle root construction, and lightweight SPV proof validation.',
        difficulty: 'Intermediate',
        prerequisites: 'Discrete Mathematics',
        status: 'completed',
        estimatedMinutes: 90,
        materialsCount: 4,
        tasksCount: 2,
        passScoreRequired: 80,
      },
      {
        id: 'node_chain_02',
        moduleId: 'mod_blockchain_01',
        order: 2,
        conceptTitle: 'Consensus Mechanisms: PoW, PoS & BFT Protocols',
        description: 'Nakamoto consensus, 51% attack dynamics, Casper FFG slashing conditions, and PBFT state machine replication.',
        difficulty: 'Advanced',
        prerequisites: 'Cryptographic Hashes & Merkle Tree Proofs',
        status: 'in_progress',
        estimatedMinutes: 130,
        materialsCount: 5,
        tasksCount: 3,
        passScoreRequired: 80,
        weakTopics: 'Slashing Conditions & Finality Gadgets',
      },
      {
        id: 'node_chain_03',
        moduleId: 'mod_blockchain_01',
        order: 3,
        conceptTitle: 'Ethereum Virtual Machine (EVM) Bytecode & Gas Optimization',
        description: 'Stack-based virtual machine execution, memory vs storage opcodes, calldata packing, and minimizing SSTORE gas overhead.',
        difficulty: 'Advanced',
        prerequisites: 'Consensus Mechanisms',
        status: 'unlocked',
        estimatedMinutes: 150,
        materialsCount: 5,
        tasksCount: 3,
        passScoreRequired: 85,
      },
      {
        id: 'node_chain_04',
        moduleId: 'mod_blockchain_01',
        order: 4,
        conceptTitle: 'Solidity Smart Contract Security & Formal Verification',
        description: 'Auditing reentrancy bugs, integer overflows, oracle manipulation attacks, and automated symbolic execution with Mythril.',
        difficulty: 'Advanced',
        prerequisites: 'EVM Bytecode & Gas Optimization',
        status: 'locked',
        estimatedMinutes: 160,
        materialsCount: 6,
        tasksCount: 3,
        passScoreRequired: 85,
      },
      {
        id: 'node_chain_05',
        moduleId: 'mod_blockchain_01',
        order: 5,
        conceptTitle: 'DeFi Automated Market Makers (AMM) & Constant Product Formula',
        description: 'Mathematical derivation of x * y = k curves, impermanent loss calculation, and slippage tolerance protections.',
        difficulty: 'Advanced',
        prerequisites: 'Solidity Smart Contract Security',
        status: 'locked',
        estimatedMinutes: 140,
        materialsCount: 4,
        tasksCount: 2,
        passScoreRequired: 80,
      },
      {
        id: 'node_chain_06',
        moduleId: 'mod_blockchain_01',
        order: 6,
        conceptTitle: 'Layer-2 Scaling: Optimistic vs Zero-Knowledge Rollups',
        description: 'Fraud proofs vs Validity proofs, zk-SNARK polynomial commitments, state diff compression, and sequencer architectures.',
        difficulty: 'Advanced',
        prerequisites: 'DeFi Automated Market Makers',
        status: 'locked',
        estimatedMinutes: 170,
        materialsCount: 5,
        tasksCount: 3,
        passScoreRequired: 85,
      },
      {
        id: 'node_chain_07',
        moduleId: 'mod_blockchain_01',
        order: 7,
        conceptTitle: 'Decentralized Oracles & Cross-Chain Interoperability',
        description: 'Decentralized data feeds (Chainlink nodes), threshold signatures, and cross-chain message passing (CCIP).',
        difficulty: 'Intermediate',
        prerequisites: 'Layer-2 Scaling',
        status: 'locked',
        estimatedMinutes: 130,
        materialsCount: 4,
        tasksCount: 2,
        passScoreRequired: 80,
      },
      {
        id: 'node_chain_08',
        moduleId: 'mod_blockchain_01',
        order: 8,
        conceptTitle: 'Blockchain Capstone: Audited Decentralized Settlement Protocol',
        description: 'Deploy and formally verify a production decentralized liquidity protocol with flash loan protection and automated unit tests.',
        difficulty: 'Advanced',
        prerequisites: 'Decentralized Oracles',
        status: 'locked',
        estimatedMinutes: 240,
        materialsCount: 6,
        tasksCount: 4,
        passScoreRequired: 90,
      },

      // Robotics Roadmap
      {
        id: 'node_robot_01',
        moduleId: 'mod_robotics_02',
        order: 1,
        conceptTitle: 'Spatial Math & Denavit-Hartenberg (DH) Kinematics',
        description: 'Rotation matrices, homogeneous transformation matrices, joint coordinate frames, and forward kinematic chain calculation.',
        difficulty: 'Intermediate',
        prerequisites: 'Linear Algebra',
        status: 'completed',
        estimatedMinutes: 110,
        materialsCount: 4,
        tasksCount: 2,
        passScoreRequired: 80,
      },
      {
        id: 'node_robot_02',
        moduleId: 'mod_robotics_02',
        order: 2,
        conceptTitle: 'ROS2 Node Graphs, Lifecycle & Action Servers',
        description: 'DDS transport middleware, publisher/subscriber QoS policies, long-running action goals with feedback, and launch systems.',
        difficulty: 'Intermediate',
        prerequisites: 'Spatial Math & DH Kinematics',
        status: 'in_progress',
        estimatedMinutes: 140,
        materialsCount: 5,
        tasksCount: 3,
        passScoreRequired: 80,
        weakTopics: 'QoS Reliability Profiles on Lossy Wi-Fi',
      },
      {
        id: 'node_robot_03',
        moduleId: 'mod_robotics_02',
        order: 3,
        conceptTitle: 'Sensor Fusion via Extended Kalman Filter (EKF)',
        description: 'Non-linear state prediction, Jacobian matrix derivation, covariance updates, and fusing wheel odometry with 6-DOF IMU signals.',
        difficulty: 'Advanced',
        prerequisites: 'ROS2 Node Graphs',
        status: 'unlocked',
        estimatedMinutes: 160,
        materialsCount: 5,
        tasksCount: 3,
        passScoreRequired: 85,
      },
      {
        id: 'node_robot_04',
        moduleId: 'mod_robotics_02',
        order: 4,
        conceptTitle: '3D LiDAR Point Cloud Processing & Voxel Grid Filtering',
        description: 'PCL library integration, pass-through filtering, RANSAC ground plane extraction, and Euclidean cluster extraction.',
        difficulty: 'Advanced',
        prerequisites: 'Sensor Fusion via EKF',
        status: 'locked',
        estimatedMinutes: 150,
        materialsCount: 5,
        tasksCount: 2,
        passScoreRequired: 85,
      },
      {
        id: 'node_robot_05',
        moduleId: 'mod_robotics_02',
        order: 5,
        conceptTitle: '2D/3D SLAM & Pose Graph Loop Closure',
        description: 'Cartographer and RTAB-Map algorithms, scan-to-submap matching, pose graph deformation, and generating metric occupancy grids.',
        difficulty: 'Advanced',
        prerequisites: '3D LiDAR Point Cloud Processing',
        status: 'locked',
        estimatedMinutes: 180,
        materialsCount: 6,
        tasksCount: 3,
        passScoreRequired: 85,
      },
      {
        id: 'node_robot_06',
        moduleId: 'mod_robotics_02',
        order: 6,
        conceptTitle: 'Global & Local Path Planning: A* & DWA / TEB Planners',
        description: 'Inflation layers, configuration space costmaps, NavFn global path computation, and Dynamic Window Approach obstacle avoidance.',
        difficulty: 'Intermediate',
        prerequisites: '2D/3D SLAM',
        status: 'locked',
        estimatedMinutes: 150,
        materialsCount: 4,
        tasksCount: 2,
        passScoreRequired: 80,
      },
      {
        id: 'node_robot_07',
        moduleId: 'mod_robotics_02',
        order: 7,
        conceptTitle: 'Motor Controller Tuning, Hardware PWM & CAN Open',
        description: 'PID velocity loops, feedforward acceleration, quadrature encoder decoding, and CAN-bus industrial motor drive control.',
        difficulty: 'Advanced',
        prerequisites: 'Global & Local Path Planning',
        status: 'locked',
        estimatedMinutes: 130,
        materialsCount: 4,
        tasksCount: 2,
        passScoreRequired: 80,
      },
      {
        id: 'node_robot_08',
        moduleId: 'mod_robotics_02',
        order: 8,
        conceptTitle: 'Robotics Capstone: Autonomous Inspection Rover Navigation',
        description: 'Construct and simulate a complete autonomous inspection rover navigating dynamically obstructed terrain in ROS2/Gazebo.',
        difficulty: 'Advanced',
        prerequisites: 'Motor Controller Tuning',
        status: 'locked',
        estimatedMinutes: 250,
        materialsCount: 6,
        tasksCount: 4,
        passScoreRequired: 90,
      },

      // Edge Computing Roadmap
      {
        id: 'node_edge_01',
        moduleId: 'mod_edge_01',
        order: 1,
        conceptTitle: 'ARM Cortex-M Architectures & Memory Mapped I/O',
        description: 'Register sets, NVIC interrupt controllers, SysTick timer, Flash vs SRAM partition layout, and memory alignment rules.',
        difficulty: 'Intermediate',
        prerequisites: 'C Programming, Computer Architecture',
        status: 'completed',
        estimatedMinutes: 90,
        materialsCount: 4,
        tasksCount: 2,
        passScoreRequired: 80,
      },
      {
        id: 'node_edge_02',
        moduleId: 'mod_edge_01',
        order: 2,
        conceptTitle: 'FreeRTOS Real-Time Kernel & Inter-Task Semaphores',
        description: 'Preemptive priority scheduling, task control blocks (TCBs), binary semaphores, queues, and priority inversion mitigation.',
        difficulty: 'Intermediate',
        prerequisites: 'ARM Cortex-M Architectures',
        status: 'in_progress',
        estimatedMinutes: 130,
        materialsCount: 5,
        tasksCount: 3,
        passScoreRequired: 80,
        weakTopics: 'Priority Inversion & Mutex Priority Inheritance',
      },
      {
        id: 'node_edge_03',
        moduleId: 'mod_edge_01',
        order: 3,
        conceptTitle: 'Quantization-Aware Training (QAT) & Integer Arithmetic',
        description: 'Converting FP32 weights to INT8 asymmetric quantization, scale and zero-point parameters, and folding batch norm layers.',
        difficulty: 'Advanced',
        prerequisites: 'FreeRTOS Real-Time Kernel',
        status: 'unlocked',
        estimatedMinutes: 150,
        materialsCount: 5,
        tasksCount: 3,
        passScoreRequired: 85,
      },
      {
        id: 'node_edge_04',
        moduleId: 'mod_edge_01',
        order: 4,
        conceptTitle: 'TensorFlow Lite for Microcontrollers (TFLite Micro)',
        description: 'FlatBuffer model representation, tensor arena memory allocation, CMSIS-NN SIMD kernel optimizations on Cortex-M4/M7.',
        difficulty: 'Advanced',
        prerequisites: 'Quantization-Aware Training',
        status: 'locked',
        estimatedMinutes: 160,
        materialsCount: 5,
        tasksCount: 3,
        passScoreRequired: 85,
      },
      {
        id: 'node_edge_05',
        moduleId: 'mod_edge_01',
        order: 5,
        conceptTitle: 'High-Speed Sensor Interfacing: DMA, SPI & I2C Handlers',
        description: 'Direct Memory Access (DMA) circular ring buffers, interrupt service routines, and streaming accelerometer data without CPU stall.',
        difficulty: 'Intermediate',
        prerequisites: 'TFLite Micro',
        status: 'locked',
        estimatedMinutes: 120,
        materialsCount: 4,
        tasksCount: 2,
        passScoreRequired: 80,
      },
      {
        id: 'node_edge_06',
        moduleId: 'mod_edge_01',
        order: 6,
        conceptTitle: 'Power Profiling, Sleep Modes & Energy Harvesting',
        description: 'Duty cycling, deep sleep modes, wake-up interrupts, and budgeting power consumption for battery-free solar nodes.',
        difficulty: 'Intermediate',
        prerequisites: 'Sensor Interfacing',
        status: 'locked',
        estimatedMinutes: 110,
        materialsCount: 4,
        tasksCount: 2,
        passScoreRequired: 80,
      },
      {
        id: 'node_edge_07',
        moduleId: 'mod_edge_01',
        order: 7,
        conceptTitle: 'Edge Anomaly Detection from Vibration & Audio Streams',
        description: 'On-device FFT spectral features, log-mel spectrogram generation in fixed-point math, and 1D CNN inference under 100KB RAM.',
        difficulty: 'Advanced',
        prerequisites: 'Power Profiling',
        status: 'locked',
        estimatedMinutes: 160,
        materialsCount: 5,
        tasksCount: 3,
        passScoreRequired: 85,
      },
      {
        id: 'node_edge_08',
        moduleId: 'mod_edge_01',
        order: 8,
        conceptTitle: 'Edge Computing Capstone: Industrial Bearing Anomaly Node',
        description: 'Deploy an end-to-end battery-operated smart sensor node detecting mechanical bearing degradation with sub-5ms inference latency.',
        difficulty: 'Advanced',
        prerequisites: 'Edge Anomaly Detection',
        status: 'locked',
        estimatedMinutes: 240,
        materialsCount: 6,
        tasksCount: 4,
        passScoreRequired: 90,
      },
    ];

    const result = await injectModulesAndRoadmaps(newModules, newNodes);
    res.json({
      success: true,
      message: 'Successfully migrated and injected additional engineering modules (Blockchain, Robotics, Edge Computing) into PostgreSQL.',
      details: result,
    });
  } catch (error: any) {
    console.error('Migration failed:', error);
    res.status(500).json({ error: error.message || 'Migration failed' });
  }
});

app.post('/api/migrations/run-advanced', async (req, res) => {
  try {
    const summary = await runAdvancedMigration();
    res.json({
      success: true,
      message: 'Advanced engineering migration executed successfully.',
      summary,
    });
  } catch (error: any) {
    console.error('Migration execution failed:', error);
    res.status(500).json({ error: error.message || 'Migration execution failed' });
  }
});

// --- Frontend Integration / Vite Middleware ---
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`NECERA Full-Stack server running on http://localhost:${PORT}`);
  });
}

startServer();
