import * as dotenv from 'dotenv';
dotenv.config();

import { db, createPool } from '../src/db/index.ts';
import { modules, roadmapNodes, learningMaterials, tasks } from '../src/db/schema.ts';

/**
 * NECERA Backend Database Migration Script
 * Targets: Cloud SQL PostgreSQL
 * Modules:
 *  1. Blockchain Engineering, Smart Contracts & Web3 Protocols (mod_blockchain_01)
 *  2. Autonomous Robotics Kinematics, ROS2 & Perception (mod_robotics_02)
 *  3. Edge Computing, TinyML & Real-Time Embedded Intelligence (mod_edge_01)
 *
 * Each module includes:
 *  - Comprehensive metadata (syllabus, prerequisites, instructor, estimated hours, difficulty)
 *  - 8-node sequential concept roadmap structure
 *  - Associated practical engineering materials (code, architecture notes, schematics)
 *  - Hands-on evaluative engineering tasks with starter code and hints
 */

export const ADVANCED_MODULES = [
  {
    id: 'mod_blockchain_01',
    title: 'Blockchain Engineering, Smart Contracts & Web3 Protocols',
    description:
      'Rigorous systems engineering of decentralized ledgers: cryptographic primitives, Merkle Patricia tries, consensus algorithms (PoW, PoS, PBFT), EVM bytecode optimization, formal verification of Solidity contracts, DeFi AMM liquidity math, and Zero-Knowledge rollups.',
    category: 'Systems & Full Stack',
    difficulty: 'Advanced',
    thumbnail:
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
    instructor: 'Dr. Marcus Vance (Principal Systems Architect & Cryptographer)',
    estimatedHours: 52,
    prerequisites: 'Discrete Mathematics, Cryptography Foundations, C++ or Rust or Python',
    published: true,
    rating: '4.96',
    studentCount: 1840,
    conceptsCount: 8,
  },
  {
    id: 'mod_robotics_02',
    title: 'Autonomous Robotics Kinematics, ROS2 & Perception',
    description:
      'Comprehensive autonomous robotics stack: 3D spatial transformation math, Denavit-Hartenberg kinematics, ROS2 DDS pub/sub architecture and action servers, Extended Kalman Filter (EKF) sensor fusion, 3D LiDAR point cloud segmentation, and real-time SLAM navigation.',
    category: 'Systems & Full Stack',
    difficulty: 'Advanced',
    thumbnail:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    instructor: 'Prof. Viktor Morales (Director of Autonomous Robotics Lab)',
    estimatedHours: 56,
    prerequisites: 'Multivariable Calculus, Linear Algebra, C++, Physics & Classical Mechanics',
    published: true,
    rating: '4.93',
    studentCount: 1420,
    conceptsCount: 8,
  },
  {
    id: 'mod_edge_01',
    title: 'Edge Computing, TinyML & Real-Time Embedded Intelligence',
    description:
      'Ultra-low-power intelligent systems: ARM Cortex-M bare-metal register programming, FreeRTOS deterministic multitasking, INT8 post-training quantization, TensorFlow Lite for Microcontrollers (TFLite Micro), direct memory access (DMA) sensor streaming, and on-chip audio/vibration anomaly detection.',
    category: 'Systems & Full Stack',
    difficulty: 'Advanced',
    thumbnail:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    instructor: 'Eng. Sarah Jenkins (Senior Embedded Firmware & Edge AI Architect)',
    estimatedHours: 46,
    prerequisites: 'C / Embedded C, Computer Architecture Basics, Neural Network Fundamentals',
    published: true,
    rating: '4.92',
    studentCount: 1560,
    conceptsCount: 8,
  },
];

export const ADVANCED_ROADMAP_NODES = [
  // --- 1. BLOCKCHAIN ROADMAP ---
  {
    id: 'node_chain_01',
    moduleId: 'mod_blockchain_01',
    order: 1,
    conceptTitle: 'Cryptographic Hashes & Merkle Tree Proofs',
    description:
      'Pre-image resistance, collision resistance, building binary Merkle trees in memory, and generating compact logarithmic authentication paths (SPV proofs).',
    difficulty: 'Intermediate',
    prerequisites: 'Bitwise Operators & Discrete Probability',
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
    description:
      'Nakamoto longest-chain consensus, difficulty adjustment algorithms, Casper FFG slashing penalties, and Practical Byzantine Fault Tolerance (PBFT) 3-phase commit.',
    difficulty: 'Advanced',
    prerequisites: 'Cryptographic Hashes & Merkle Tree Proofs',
    status: 'in_progress',
    estimatedMinutes: 130,
    materialsCount: 5,
    tasksCount: 3,
    passScoreRequired: 80,
    weakTopics: 'Slashing Conditions & Liveness vs Safety Trade-offs',
  },
  {
    id: 'node_chain_03',
    moduleId: 'mod_blockchain_01',
    order: 3,
    conceptTitle: 'Ethereum Virtual Machine (EVM) Bytecode & Gas Optimization',
    description:
      'Stack execution model, memory expansion quadratic gas cost, cold vs warm storage slots (EIP-2929), calldata slicing, and assembly (Yul) optimizations.',
    difficulty: 'Advanced',
    prerequisites: 'Consensus Mechanisms: PoW, PoS & BFT Protocols',
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
    description:
      'Comprehensive vulnerability mitigation: check-effects-interactions pattern for reentrancy, signature replay (EIP-712), read-only reentrancy, and automated symbolic execution with Mythril.',
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
    description:
      'Derivation of x * y = k invariant curves, pricing dynamics, calculating impermanent loss over volatility trajectories, and multi-hop routing math.',
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
    description:
      'Fraud proofs with interactive bisection games vs Validity proofs using zk-SNARK polynomial commitments (Groth16 & PLONK) and data availability layers.',
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
    description:
      'Outlier-resistant aggregation algorithms, threshold signature schemes (TSS), Chainlink Decentralized Oracle Networks, and Chainlink Cross-Chain Interoperability Protocol (CCIP).',
    difficulty: 'Intermediate',
    prerequisites: 'Layer-2 Scaling: Optimistic vs Zero-Knowledge Rollups',
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
    description:
      'Architect, implement, and formally verify an audited cross-border settlement protocol featuring flash-mint safeguards, multi-sig governance, and zero-knowledge privacy receipts.',
    difficulty: 'Advanced',
    prerequisites: 'Decentralized Oracles & Cross-Chain Interoperability',
    status: 'locked',
    estimatedMinutes: 240,
    materialsCount: 6,
    tasksCount: 4,
    passScoreRequired: 90,
  },

  // --- 2. ROBOTICS ROADMAP ---
  {
    id: 'node_robot_01',
    moduleId: 'mod_robotics_02',
    order: 1,
    conceptTitle: 'Spatial Math & Denavit-Hartenberg (DH) Kinematics',
    description:
      'Euler angles, SO(3) rotation matrices, SE(3) homogeneous transformations, unit quaternions, and forward kinematics for 6-DOF robotic manipulators using DH conventions.',
    difficulty: 'Intermediate',
    prerequisites: 'Linear Algebra & Vector Calculus',
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
    description:
      'DDS communications layer, intra-process zero-copy transport, managed lifecycle node state machines (Unconfigured, Inactive, Active), and pre-emptible Action servers.',
    difficulty: 'Intermediate',
    prerequisites: 'Spatial Math & Denavit-Hartenberg Kinematics',
    status: 'in_progress',
    estimatedMinutes: 140,
    materialsCount: 5,
    tasksCount: 3,
    passScoreRequired: 80,
    weakTopics: 'DDS QoS Reliability & Transient Local Durability on Lossy Networks',
  },
  {
    id: 'node_robot_03',
    moduleId: 'mod_robotics_02',
    order: 3,
    conceptTitle: 'Sensor Fusion via Extended Kalman Filter (EKF)',
    description:
      'Non-linear motion models, numerical Jacobian calculation, continuous-discrete EKF equations, and fusing noisy wheel odometry with 6-axis IMU acceleration and gyroscopic data.',
    difficulty: 'Advanced',
    prerequisites: 'ROS2 Node Graphs, Lifecycle & Action Servers',
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
    description:
      'Point Cloud Library (PCL), pass-through range filtering, octree spatial indexing, RANSAC geometric ground plane segmentation, and Euclidean clustering for obstacle detection.',
    difficulty: 'Advanced',
    prerequisites: 'Sensor Fusion via Extended Kalman Filter',
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
    description:
      'Simultaneous Localization and Mapping using Cartographer and RTAB-Map, scan-to-submap correlative matching, sparse pose graph optimization with g2o, and loop closure verification.',
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
    conceptTitle: 'Global & Local Path Planning: A* & TEB Planners',
    description:
      'Nav2 architecture: 2D costmaps, inflation layers, A* and Dijkstra global planning, and Timed Elastic Band (TEB) trajectory optimization accounting for non-holonomic kinematic limits.',
    difficulty: 'Intermediate',
    prerequisites: '2D/3D SLAM & Pose Graph Loop Closure',
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
    description:
      'Dual closed-loop PID velocity and current controllers, anti-windup integrators, optical encoder quadrature decoding, and robust CAN-bus motor telemetry protocols.',
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
    description:
      'Build and simulate an end-to-end autonomous planetary rover navigating an unmapped harsh obstacle field, avoiding dynamic hazards, and docking precisely with zero human intervention.',
    difficulty: 'Advanced',
    prerequisites: 'Motor Controller Tuning, Hardware PWM & CAN Open',
    status: 'locked',
    estimatedMinutes: 250,
    materialsCount: 6,
    tasksCount: 4,
    passScoreRequired: 90,
  },

  // --- 3. EDGE COMPUTING ROADMAP ---
  {
    id: 'node_edge_01',
    moduleId: 'mod_edge_01',
    order: 1,
    conceptTitle: 'ARM Cortex-M Architectures & Memory Mapped I/O',
    description:
      'ARMv7-M / ARMv8-M architecture, NVIC nested vectored interrupts, bit-banding, memory barrier instructions (DMB, DSB, ISB), linker script memory sections (.text, .data, .bss, .heap, .stack).',
    difficulty: 'Intermediate',
    prerequisites: 'C Programming & Digital Logic Basics',
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
    description:
      'Fixed-priority preemptive scheduling, Task Control Blocks (TCBs), priority inversion anomalies, Priority Inheritance Mutexes, and high-frequency ISR software timers.',
    difficulty: 'Intermediate',
    prerequisites: 'ARM Cortex-M Architectures & Memory Mapped I/O',
    status: 'in_progress',
    estimatedMinutes: 130,
    materialsCount: 5,
    tasksCount: 3,
    passScoreRequired: 80,
    weakTopics: 'Priority Inversion Mitigation & Task Stack Overflow Detection',
  },
  {
    id: 'node_edge_03',
    moduleId: 'mod_edge_01',
    order: 3,
    conceptTitle: 'Quantization-Aware Training (QAT) & Integer Arithmetic',
    description:
      'Affine quantization equation, symmetric vs asymmetric zero points, simulated quantization in forward pass, folded batch normalization, and fixed-point integer matrix multiplication.',
    difficulty: 'Advanced',
    prerequisites: 'FreeRTOS Real-Time Kernel & Inter-Task Semaphores',
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
    description:
      'FlatBuffer model serialization, MicroMutableOpResolver footprint reduction, static Tensor Arena memory allocation, and CMSIS-NN SIMD accelerated assembly kernels on Cortex-M4/M7.',
    difficulty: 'Advanced',
    prerequisites: 'Quantization-Aware Training (QAT) & Integer Arithmetic',
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
    description:
      'Configuring DMA circular buffers with half-transfer and full-transfer interrupts, double buffering audio sampling at 44.1kHz, and streaming 3-axis accelerometer data without CPU blocking.',
    difficulty: 'Intermediate',
    prerequisites: 'TensorFlow Lite for Microcontrollers',
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
    description:
      'Cortex-M WFI/WFE sleep instructions, Standby and Deep Stop power domains, ultra-low-leakage retention RAM, RTC periodic wakeups, and capacitor energy harvesting power budgets.',
    difficulty: 'Intermediate',
    prerequisites: 'High-Speed Sensor Interfacing',
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
    description:
      'On-device fixed-point Radix-4 FFT, spectral centroid extraction, log-mel filterbank bank generation, and running a 1D ConvNet under 64KB RAM for predictive mechanical maintenance.',
    difficulty: 'Advanced',
    prerequisites: 'Power Profiling, Sleep Modes & Energy Harvesting',
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
    description:
      'Deploy a complete solar-harvesting Cortex-M4 TinyML sensor node executing real-time bearing fault classification at 200Hz with sub-4ms inference latency and LoRaWAN alert broadcasts.',
    difficulty: 'Advanced',
    prerequisites: 'Edge Anomaly Detection from Vibration & Audio Streams',
    status: 'locked',
    estimatedMinutes: 240,
    materialsCount: 6,
    tasksCount: 4,
    passScoreRequired: 90,
  },
];

export const ADVANCED_MATERIALS = [
  // Blockchain Material
  {
    id: 'mat_chain_01_notes',
    conceptId: 'node_chain_01',
    type: 'notes',
    title: 'Cryptographic Hashing & Merkle Patricia Trie Internals',
    description: 'Mathematical derivation of SHA-256 compression function and logarithmic proof complexity.',
    durationOrPages: '14 pages',
    downloadAllowed: true,
    content: `# Cryptographic Hashes & Merkle Trees in Distributed Systems

## 1. SHA-256 Compression Anatomy
SHA-256 operates on 512-bit message blocks through 64 rounds of non-linear transformations:
- Bitwise rotations: ROTR and SHR operations
- Non-linear majority function: Maj(x, y, z) = (x & y) ^ (x & z) ^ (y & z)
- Conditional choice function: Ch(x, y, z) = (x & y) ^ (~x & z)

## 2. Merkle Root Construction
For a set of transactions $T = {t_1, t_2, ..., t_n}$:
1. Compute leaf hashes: $H_i = \\text{SHA256}(\\text{SHA256}(t_i))$
2. Combine adjacent pairs: $H_{parent} = \\text{SHA256}(\\text{SHA256}(H_{left} \\parallel H_{right}))$
3. If odd number of leaves, replicate the final leaf.

### Proof Verification Complexity
Verification requires only $\\lceil \\log_2(n) \\rceil$ sibling hashes rather than downloading the full block of transactions.`,
    codeLanguage: 'markdown',
  },
  {
    id: 'mat_chain_01_code',
    conceptId: 'node_chain_01',
    type: 'code',
    title: 'Python SPV Merkle Tree Generator & Verifier',
    description: 'Production implementation of a binary Merkle tree with proof generation and verification.',
    durationOrPages: '95 lines',
    downloadAllowed: true,
    content: `import hashlib
from typing import List, Tuple

def double_sha256(data: bytes) -> bytes:
    return hashlib.sha256(hashlib.sha256(data).digest()).digest()

class MerkleTree:
    def __init__(self, elements: List[bytes]):
        self.leaves = [double_sha256(elem) for elem in elements]
        if not self.leaves:
            raise ValueError("Merkle tree requires at least one leaf.")
        self.layers = [self.leaves]
        self._build()

    def _build(self):
        current = self.leaves
        while len(current) > 1:
            next_layer = []
            for i in range(0, len(current), 2):
                left = current[i]
                right = current[i + 1] if i + 1 < len(current) else left
                parent = double_sha256(left + right)
                next_layer.append(parent)
            self.layers.append(next_layer)
            current = next_layer

    @property
    def root(self) -> bytes:
        return self.layers[-1][0]

    def get_proof(self, index: int) -> List[Tuple[bytes, str]]:
        proof = []
        for layer in self.layers[:-1]:
            is_right = (index % 2 == 1)
            pair_index = index - 1 if is_right else index + 1
            if pair_index < len(layer):
                sibling = layer[pair_index]
            else:
                sibling = layer[index]
            proof.append((sibling, 'left' if is_right else 'right'))
            index //= 2
        return proof

    @staticmethod
    def verify_proof(leaf: bytes, proof: List[Tuple[bytes, str]], expected_root: bytes) -> bool:
        current = double_sha256(leaf)
        for sibling, position in proof:
            if position == 'left':
                current = double_sha256(sibling + current)
            else:
                current = double_sha256(current + sibling)
        return current == expected_root`,
    codeLanguage: 'python',
  },

  // Robotics Material
  {
    id: 'mat_robot_01_notes',
    conceptId: 'node_robot_01',
    type: 'notes',
    title: 'Denavit-Hartenberg (DH) Coordinate Transformations',
    description: 'Systematic convention for attaching reference frames to robotic manipulator links.',
    durationOrPages: '18 pages',
    downloadAllowed: true,
    content: `# Denavit-Hartenberg (DH) Transformation Conventions

## 1. The Four DH Parameters
For every joint $i$ and link $i$:
1. $a_i$ (link length): Distance along $X_i$ axis from $Z_{i-1}$ to $Z_i$.
2. $\\alpha_i$ (link twist): Angle about $X_i$ axis from $Z_{i-1}$ to $Z_i$.
3. $d_i$ (link offset): Distance along $Z_{i-1}$ axis from $X_{i-1}$ to $X_i$.
4. $\\theta_i$ (joint angle): Angle about $Z_{i-1}$ axis from $X_{i-1}$ to $X_i$.

## 2. Homogeneous Transformation Matrix
$$A_i = \\text{Rot}(Z, \\theta_i) \\text{Trans}(Z, d_i) \\text{Trans}(X, a_i) \\text{Rot}(X, \\alpha_i)$$

Multiplying successive $A_i$ matrices yields the end-effector transform:
$$T_0^n = A_1 \\cdot A_2 \\cdot \\dots \\cdot A_n$$`,
    codeLanguage: 'markdown',
  },

  // Edge Computing Material
  {
    id: 'mat_edge_01_notes',
    conceptId: 'node_edge_01',
    type: 'notes',
    title: 'ARM Cortex-M Memory Map, Linker Scripts & Startup Code',
    description: 'Detailed memory segmentation, vector table layout, and bare-metal initialization.',
    durationOrPages: '16 pages',
    downloadAllowed: true,
    content: `# ARM Cortex-M Embedded Architecture & Memory Map

## 1. Vector Table Architecture
At address 0x0000_0000 (aliased to Flash at 0x0800_0000 on STM32):
- Offset 0x00: Initial Main Stack Pointer (MSP) top-of-stack address
- Offset 0x04: Reset Handler function pointer
- Offset 0x08: Non-Maskable Interrupt (NMI)
- Offset 0x0C: HardFault Handler
- Offset 0x2C: SysTick Timer Handler

## 2. Memory Sections & Initialization Sequence
- \`.text\`: Program machine code stored in non-volatile Flash memory.
- \`.rodata\`: Immutable constants and lookup tables stored in Flash.
- \`.data\`: Initialized global and static variables. Copied from Flash (LMA) to SRAM (VMA) during Reset_Handler.
- \`.bss\`: Zero-initialized global/static variables. Cleared to zero in SRAM by Reset_Handler.`,
    codeLanguage: 'markdown',
  },
];

export const ADVANCED_TASKS = [
  {
    id: 'task_chain_01_spv',
    conceptId: 'node_chain_01',
    title: 'Implement Logarithmic SPV Merkle Proof Validator',
    description: 'Construct a function that verifies an unspent transaction output belongs to a block header root.',
    difficulty: 'Intermediate',
    taskType: 'Coding Exercise',
    instructions:
      'Given an unspent transaction leaf hash and an array of sibling hashes with directional flags, compute the candidate Merkle root using double-SHA256 and assert equality with the target root.',
    timeEstimateMinutes: 45,
    deadline: '7 days',
    maxScore: 100,
    passingScore: 80,
    starterCode: `def verify_spv_proof(tx_leaf: bytes, proof_path: list, expected_merkle_root: bytes) -> bool:
    # TODO: Implement sequential double SHA-256 folding
    pass`,
    solutionHint:
      'Iterate through each sibling in proof_path. If direction is left, hash sibling + current; if right, hash current + sibling.',
  },
  {
    id: 'task_robot_01_dh',
    conceptId: 'node_robot_01',
    title: 'Compute 3-DOF Planar Arm Forward Kinematics Matrix',
    description: 'Derive and code the homogeneous transformation matrix from DH parameter table.',
    difficulty: 'Intermediate',
    taskType: 'Engineering Lab',
    instructions:
      'Implement the homogeneous matrix multiplication for a 3-DOF planar arm with link lengths l1, l2, l3 and joint angles theta1, theta2, theta3. Return the (x, y) coordinates of the end effector.',
    timeEstimateMinutes: 60,
    deadline: '7 days',
    maxScore: 100,
    passingScore: 80,
    starterCode: `import numpy as np

def forward_kinematics_3dof(l1: float, l2: float, l3: float, q1: float, q2: float, q3: float):
    # TODO: Compute cumulative transformation
    pass`,
    solutionHint: 'x = l1*cos(q1) + l2*cos(q1+q2) + l3*cos(q1+q2+q3); y = l1*sin(q1) + l2*sin(q1+q2) + l3*sin(q1+q2+q3)',
  },
  {
    id: 'task_edge_01_dma',
    conceptId: 'node_edge_01',
    title: 'Configure DMA Ring Buffer Circular Audio Stream',
    description: 'Write the C pseudo-firmware to configure dual-buffer DMA transfer from I2S microphone to SRAM.',
    difficulty: 'Advanced',
    taskType: 'Firmware Design',
    instructions:
      'Design the circular DMA interrupt handler servicing Half-Transfer Complete (HT) and Transfer Complete (TC) callbacks without audio frame dropping.',
    timeEstimateMinutes: 50,
    deadline: '7 days',
    maxScore: 100,
    passingScore: 80,
    starterCode: `void DMA1_Stream0_IRQHandler(void) {
    // TODO: Check and clear HTIF and TCIF flags
}`,
    solutionHint: 'When HT fires, process buffer segment 0 (samples 0 to N/2-1). When TC fires, process segment 1 (samples N/2 to N-1).',
  },
];

/**
 * Migration Runner Function
 */
export async function runAdvancedMigration() {
  console.log('=====================================================');
  console.log('NECERA Database Migration: Advanced Engineering Modules');
  console.log('Target: PostgreSQL (Cloud SQL us-west1)');
  console.log('Modules: Blockchain, Robotics, Edge Computing');
  console.log('=====================================================\n');

  try {
    // 1. Insert/Update Modules
    console.log(`[1/4] Inserting/Upserting ${ADVANCED_MODULES.length} Advanced Modules...`);
    for (const mod of ADVANCED_MODULES) {
      await db
        .insert(modules)
        .values(mod)
        .onConflictDoUpdate({
          target: modules.id,
          set: {
            title: mod.title,
            description: mod.description,
            category: mod.category,
            difficulty: mod.difficulty,
            thumbnail: mod.thumbnail,
            instructor: mod.instructor,
            estimatedHours: mod.estimatedHours,
            prerequisites: mod.prerequisites,
            published: mod.published,
            rating: mod.rating,
            studentCount: mod.studentCount,
            conceptsCount: mod.conceptsCount,
            updatedAt: new Date(),
          },
        });
      console.log(`  ✓ Module saved: ${mod.id} - ${mod.title}`);
    }

    // 2. Insert/Update Roadmap Nodes
    console.log(`\n[2/4] Inserting/Upserting ${ADVANCED_ROADMAP_NODES.length} Concept Roadmap Nodes...`);
    for (const node of ADVANCED_ROADMAP_NODES) {
      await db
        .insert(roadmapNodes)
        .values(node)
        .onConflictDoUpdate({
          target: roadmapNodes.id,
          set: {
            moduleId: node.moduleId,
            order: node.order,
            conceptTitle: node.conceptTitle,
            description: node.description,
            difficulty: node.difficulty,
            prerequisites: node.prerequisites,
            status: node.status,
            estimatedMinutes: node.estimatedMinutes,
            materialsCount: node.materialsCount,
            tasksCount: node.tasksCount,
            passScoreRequired: node.passScoreRequired,
            weakTopics: node.weakTopics,
          },
        });
      console.log(`  ✓ Roadmap node saved: [${node.moduleId}] Node #${node.order} - ${node.conceptTitle}`);
    }

    // 3. Insert/Update Learning Materials
    console.log(`\n[3/4] Inserting/Upserting ${ADVANCED_MATERIALS.length} Engineering Learning Materials...`);
    for (const mat of ADVANCED_MATERIALS) {
      await db
        .insert(learningMaterials)
        .values(mat)
        .onConflictDoUpdate({
          target: learningMaterials.id,
          set: {
            conceptId: mat.conceptId,
            type: mat.type,
            title: mat.title,
            description: mat.description,
            durationOrPages: mat.durationOrPages,
            downloadAllowed: mat.downloadAllowed,
            content: mat.content,
            codeLanguage: mat.codeLanguage,
          },
        });
      console.log(`  ✓ Material saved: ${mat.id} (${mat.type}) for ${mat.conceptId}`);
    }

    // 4. Insert/Update Tasks
    console.log(`\n[4/4] Inserting/Upserting ${ADVANCED_TASKS.length} Engineering Tasks & Labs...`);
    for (const task of ADVANCED_TASKS) {
      await db
        .insert(tasks)
        .values(task)
        .onConflictDoUpdate({
          target: tasks.id,
          set: {
            conceptId: task.conceptId,
            title: task.title,
            description: task.description,
            difficulty: task.difficulty,
            taskType: task.taskType,
            instructions: task.instructions,
            timeEstimateMinutes: task.timeEstimateMinutes,
            deadline: task.deadline,
            maxScore: task.maxScore,
            passingScore: task.passingScore,
            starterCode: task.starterCode,
            solutionHint: task.solutionHint,
          },
        });
      console.log(`  ✓ Task saved: ${task.id} (${task.taskType}) for ${task.conceptId}`);
    }

    console.log('\n=====================================================');
    console.log('✅ NECERA Advanced Modules Migration Succeeded!');
    console.log(`   - Modules: ${ADVANCED_MODULES.length}`);
    console.log(`   - Roadmap Nodes: ${ADVANCED_ROADMAP_NODES.length}`);
    console.log(`   - Learning Materials: ${ADVANCED_MATERIALS.length}`);
    console.log(`   - Tasks: ${ADVANCED_TASKS.length}`);
    console.log('=====================================================\n');

    return {
      success: true,
      modulesCount: ADVANCED_MODULES.length,
      nodesCount: ADVANCED_ROADMAP_NODES.length,
      materialsCount: ADVANCED_MATERIALS.length,
      tasksCount: ADVANCED_TASKS.length,
    };
  } catch (error) {
    console.error('\n❌ Migration Failed:', error);
    throw error;
  }
}

// Execute directly if run via CLI
const isDirectExecution = process.argv[1]?.endsWith('migrate-advanced-modules.ts');
if (isDirectExecution) {
  runAdvancedMigration()
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      console.error('Fatal migration error:', err);
      process.exit(1);
    });
}
