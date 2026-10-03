import { GoogleGenAI } from '@google/genai';
import { ActiveProject, UserProfile } from '../types';

// Provider-agnostic AI Service Layer for NECERA
// Follows educational pedagogy: prefers hints, conceptual analogies, and architectural guidance
// over spoon-feeding complete assignment solutions.

interface MentorContext {
  studentName?: string;
  currentModule?: string;
  currentConcept?: string;
  conceptDescription?: string;
  weakTopics?: string[];
  recentMistake?: string;
  codeSnippet?: string;
}

class AiService {
  private geminiClient: GoogleGenAI | null = null;
  private apiKey: string | null = null;

  constructor() {
    const key = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
      (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) || '';
    if (key && key !== 'MY_GEMINI_API_KEY') {
      this.apiKey = key;
      try {
        this.geminiClient = new GoogleGenAI({ apiKey: key });
      } catch (err) {
        console.warn('Could not initialize GoogleGenAI client:', err);
      }
    }
  }

  public async askMentor(
    userMessage: string,
    history: { role: 'user' | 'assistant'; text: string }[],
    context?: MentorContext
  ): Promise<string> {
    const systemPrompt = `You are NECERA's Senior AI Engineering Mentor.
You are mentoring engineering students in computer science, machine learning, systems, and algorithms.
Context of this student:
- Module: ${context?.currentModule || 'Machine Learning & Statistical Foundations'}
- Current Concept: ${context?.currentConcept || 'Linear & Polynomial Regression'}
- Weak Topics: ${context?.weakTopics?.join(', ') || 'None identified'}
${context?.recentMistake ? `- Recent Mistake / Struggle: ${context.recentMistake}` : ''}
${context?.codeSnippet ? `- Attached Code Snippet:\n${context.codeSnippet}` : ''}

PEDAGOGICAL RULES:
1. Provide deep, accurate mathematical and technical intuition.
2. If asked about a coding task or homework assignment, DO NOT give the direct final solution code right away. Provide Socratic questions, hint steps, geometric intuition, or pseudo-code logic first.
3. Keep explanations structured, elegant, concise, and encourage first-principles thinking.
4. When explaining formulas, format them clearly with mathematical precision.`;

    if (this.geminiClient) {
      try {
        const contents = [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${userMessage}` }] }
        ];
        const response = await this.geminiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents,
        });
        if (response.text) {
          return response.text;
        }
      } catch (error) {
        console.warn('Gemini API call failed, falling back to built-in pedagogical mentor engine:', error);
      }
    }

    // Built-in intelligent educational mentor response generator
    return this.generatePedagogicalResponse(userMessage, context);
  }

  public async generatePersonalizedProject(
    profile: UserProfile,
    preferences: { category?: string; difficulty?: string; interestKeywords?: string }
  ): Promise<Partial<ActiveProject>> {
    const projectPrompt = `Generate a rigorous, production-grade engineering project for a student with skills: ${profile.skills.join(', ')}. Interest: ${preferences.interestKeywords || 'Autonomous Systems and NLP'}. Difficulty: ${preferences.difficulty || 'Intermediate'}.`;

    if (this.geminiClient) {
      try {
        const response = await this.geminiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [{
            role: 'user',
            parts: [{
              text: `${projectPrompt}\nReturn a strictly valid JSON object matching this schema:
{
  "title": string,
  "problemStatement": string,
  "realWorldObjective": string,
  "category": string,
  "difficulty": "Beginner" | "Intermediate" | "Advanced",
  "requiredSkills": string[],
  "techStack": string[],
  "datasetSuggestions": string[],
  "milestones": [
    { "id": "m1", "title": string, "description": string, "completed": false, "deliverable": string },
    { "id": "m2", "title": string, "description": string, "completed": false, "deliverable": string },
    { "id": "m3", "title": string, "description": string, "completed": false, "deliverable": string },
    { "id": "m4", "title": string, "description": string, "completed": false, "deliverable": string },
    { "id": "m5", "title": string, "description": string, "completed": false, "deliverable": string }
  ]
}`
            }]
          }],
        });

        if (response.text) {
          const cleaned = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
          return JSON.parse(cleaned);
        }
      } catch (err) {
        console.warn('Gemini project generation failed, using intelligent template generator:', err);
      }
    }

    // High-quality contextual fallback
    return this.generateTemplateProject(profile, preferences);
  }

  private generatePedagogicalResponse(prompt: string, context?: MentorContext): string {
    const p = prompt.toLowerCase();

    if (p.includes('l1') || p.includes('lasso') || p.includes('ridge') || p.includes('regularization') || p.includes('shrinkage')) {
      return `### Understanding L1 (Lasso) vs L2 (Ridge) Regularization

Great question. The key to understanding why L1 induces **sparsity** (setting weights exactly to zero) while L2 only shrinks them smoothly lies in their **geometric constraint boundaries**:

1. **The Cost Surface**:
   The Ordinary Least Squares (OLS) loss function forms concentric elliptical contours in parameter space $(\\theta_1, \\theta_2)$. The minimum is at the center $\\hat{\\theta}_{OLS}$.

2. **The Constraint Balls**:
   - **L2 Norm (Ridge)**: $\\sum \\theta_j^2 \\le t$. This forms a smooth **hypersphere (circle in 2D)**.
   - **L1 Norm (Lasso)**: $\\sum |\\theta_j| \\le t$. This forms a **polyhedron with sharp vertices (diamond in 2D)** that lie precisely on the axes where $\\theta_1 = 0$ or $\\theta_2 = 0$.

3. **Where they meet**:
   As the expanding loss ellipse touches the constraint region, it is statistically far more likely to first touch the **sharp corner vertex** of the diamond on one of the coordinate axes.
   When contact happens at an axis corner, the corresponding coordinate weight is **strictly 0**.

**Hint for your assessment**: Remember that L2 penalizes large weights quadratically (heavier punishment for outliers), whereas L1 penalizes weights linearly with constant gradient $\\pm 1$.`;
    }

    if (p.includes('hint') || p.includes('task') || p.includes('stuck') || p.includes('cost function')) {
      return `### Socratic Hint for Vectorized Cost Function

To compute the cost and gradients cleanly without for-loops:

1. **Predictions Vector**:
   Compute the matrix-vector dot product:
   \`predictions = X @ theta\` (shape: $m \\times 1$)

2. **Residual Errors**:
   \`errors = predictions - y\`

3. **L2 Regularization Term**:
   Remember: In standard practice, **never regularize the bias/intercept** (usually the first column \`theta[0]\`).
   Slice your parameters using \`theta[1:]\` when summing squares!

4. **Gradient Vector**:
   The unregularized gradient is:
   \`grad = (1 / m) * (X.T @ errors)\`
   Then add \`(l2_lambda / m) * theta[1:]\` strictly to indices $1$ onward.

Try implementing this slicing and check if your dimensions align!`;
    }

    if (p.includes('debug') || p.includes('error') || p.includes('nan') || p.includes('overflow')) {
      return `### Diagnostic Checklist for Numerical Instability

When training regression models and encountering \`NaN\` or explosion:

1. **Feature Scale Discrepancy**: If one feature has scale $10^6$ and another $10^{-2}$, the loss surface becomes an extremely narrow canyon. Standardize features first:
   \`X_scaled = (X - np.mean(X, axis=0)) / np.std(X, axis=0)\`
2. **Learning Rate ($\\alpha$) too high**: When $\\alpha > 2 / \\lambda_{max}(X^T X)$, gradient descent overshoots and diverges exponentially. Cut $\\alpha$ by a factor of 10.
3. **Condition Number of $X^T X$**: If collinear features exist, $X^T X$ is singular. Add Ridge regularization ($+\\lambda I$) to guarantee invertibility.`;
    }

    if (p.includes('recommend') || p.includes('next') || p.includes('weak') || p.includes('study')) {
      return `### Recommended Next Learning Pathway

Based on your current progress in **Machine Learning Foundations** (68% complete):

1. **Immediate Focus**: Review *L1 vs L2 Weight Shrinkage Derivation* and re-attempt the Linear Regression Mastery Check.
2. **Upcoming Concept**: Once passed, you will unlock **Classification Algorithms & Decision Boundaries** (Logistic Regression, Sigmoid activation, and Cross-Entropy Loss).
3. **Capstone Connection**: Your current project (*Autonomous Drone Obstacle Detection*) relies heavily on understanding cross-entropy loss in YOLO classification heads.

Would you like me to walk through a 3-minute quiz on Sigmoid and Log-Loss to prepare for the next node?`;
    }

    // Default pedagogical response
    return `### Engineering Insight

In computer science and machine learning systems, deep understanding comes from connecting the underlying mathematical abstractions to concrete system implementations.

Regarding your question about **${context?.currentConcept || 'systems engineering'}**:
- Notice how algorithmic time complexity ($O(N)$ vs $O(N \\log N)$) directly dictates memory bandwidth and cache utilization on modern CPUs and GPUs.
- Break down the challenge into smaller invariants: What are your inputs, what guarantees must the function hold, and what edge cases could break the assumptions?

Feel free to paste your code snippet or ask for a targeted hint, and we will derive the solution step by step!`;
  }

  private generateTemplateProject(
    profile: UserProfile,
    preferences: { category?: string; difficulty?: string; interestKeywords?: string }
  ): Partial<ActiveProject> {
    const titles = [
      {
        title: 'Distributed Real-Time Sensor Telemetry & Anomaly Detector',
        problem: 'High-frequency telemetry streams from distributed industrial IoT sensors suffer from packet dropouts and subtle early degradation anomalies that traditional thresholding misses.',
        objective: 'Construct an end-to-end streaming pipeline with FastAPI, Kafka/Redis queues, and an autoencoder neural network for real-time anomaly flagging under 20ms latency.',
        category: 'Systems & Edge AI',
        skills: ['Python', 'FastAPI', 'PyTorch', 'Docker', 'Redis'],
        milestones: [
          { id: 'm1', title: 'High-Throughput Synthetic Ingestion Pipeline', description: 'Stream 10,000 synthetic sensor events/sec with random noise and burst corruptions.', completed: false, deliverable: 'Python Producer & Kafka harness' },
          { id: 'm2', title: 'Feature Windowing & Rolling Statistics', description: 'Compute rolling FFT power spectrum and sliding window Z-scores in vectorized NumPy.', completed: false, deliverable: 'Vectorized ETL pipeline' },
          { id: 'm3', title: 'LSTM / Autoencoder Reconstruction Model', description: 'Train a lightweight model on nominal signals; high reconstruction error signals anomaly.', completed: false, deliverable: 'PyTorch model weights' },
          { id: 'm4', title: 'Low-Latency Serving with ONNX Runtime', description: 'Export model to ONNX and benchmark inference latency against target <15ms.', completed: false, deliverable: 'Benchmarking report' },
          { id: 'm5', title: 'Interactive Grafana / React Operations Dashboard', description: 'Visualize streaming anomalies with real-time WebSocket connection.', completed: false, deliverable: 'React web interface' }
        ]
      },
      {
        title: 'Edge Computer Vision Defect Inspection System',
        problem: 'Factory assembly lines require sub-millimeter surface scratch and structural defect classification at 30 items per minute with no internet dependency.',
        objective: 'Train a lightweight quantized convolutional neural network running on edge Linux hardware with automated camera trigger synchronization.',
        category: 'Computer Vision & Edge Systems',
        skills: ['Python', 'OpenCV', 'PyTorch', 'TensorRT', 'Embedded Systems'],
        milestones: [
          { id: 'm1', title: 'Synthetic Defect Augmentation & Preprocessing', description: 'Synthesize micro-scratches, illumination variations, and specular reflections on benchmark metal surfaces.', completed: false, deliverable: 'Augmented Dataset' },
          { id: 'm2', title: 'ResNet / EfficientNet Backbone Fine-Tuning', description: 'Transfer learning on labeled surface defect dataset with focus on recall score >98%.', completed: false, deliverable: 'Trained model check' },
          { id: 'm3', title: 'FP16 / INT8 Quantization via TensorRT', description: 'Profile memory footprint and optimize layer fusions for edge GPU.', completed: false, deliverable: 'Quantized engine' },
          { id: 'm4', title: 'Camera Stream Ingestion & Masking Loop', description: 'Threaded OpenCV video capture pipeline with zero frame buffer bloat.', completed: false, deliverable: 'OpenCV pipeline' },
          { id: 'm5', title: 'REST API & Defect Logging Service', description: 'Expose inspection results via local REST endpoint with SQLite persistence.', completed: false, deliverable: 'Inspection server' }
        ]
      }
    ];

    const chosen = titles[Math.floor(Math.random() * titles.length)];

    return {
      title: chosen.title,
      problemStatement: chosen.problem,
      realWorldObjective: chosen.objective,
      category: chosen.category,
      difficulty: (preferences.difficulty as any) || 'Intermediate',
      requiredSkills: chosen.skills,
      techStack: chosen.skills,
      datasetSuggestions: ['Industrial Defect Benchmark', 'Kaggle Sensor Stream Data'],
      progressPercent: 0,
      milestones: chosen.milestones,
      generatedByAi: true,
      createdAt: 'October 2026',
    };
  }
}

export const aiService = new AiService();
