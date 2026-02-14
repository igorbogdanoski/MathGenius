
export type Language = 'MK' | 'SQ' | 'TR' | 'EN';

export type Difficulty = 'Focus' | 'Practice' | 'Challenge';

export type ProblemType = 'multiple_choice' | 'input' | 'graphing' | 'table_completion';

export interface Translation {
  MK: string;
  SQ: string;
  TR: string;
  EN: string;
}

export interface AITutorLogic {
  hint: Translation; // Level 2: Scaffolding hint
  explanation: Translation; // Level 3: Step-by-step
}

export interface Problem {
  id: string;
  lessonId: string; // e.g., "11.1", "11.2"
  type: ProblemType;
  difficulty: Difficulty;
  question: Translation;
  illustration_description?: string; // For GenAI image generation context
  ai_tutor_logic: AITutorLogic;
  correctAnswer: any; // Can be string, number, or coordinate array
  options?: Translation[]; // For multiple choice
  graphConfig?: {
    equation?: string; // e.g., "y=2x+1"
    requiredPoints?: { x: number; y: number }[];
  };
}

export interface Lesson {
  id: string;
  title: Translation;
  introText: Translation;
  problems: Problem[];
}

// --- GAMIFICATION TYPES ---

export type ItemType = 'avatar' | 'accessory' | 'theme';

export interface ShopItem {
  id: string;
  type: ItemType;
  name: string;
  cost: number;
  value: string; // Emoji char or CSS class
  description: string;
}

export interface UserState {
  userId?: string;
  name?: string;
  language: Language;
  masteryPoints: number;
  streak: number;
  currentLessonId: string | null;
  currentProblemIndex: number;
  path: Difficulty; // Adaptive path
  history: {
    problemId: string;
    correct: boolean;
    timestamp: number;
  }[];
  completedLessons: string[]; // IDs of lessons fully completed
  // Gamification State
  inventory: string[]; // IDs of owned items
  equipped: {
    avatar: string;
    accessory: string | null;
    theme: string;
  };
}

// --- NEW TEACHER DASHBOARD TYPES ---

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string; // Emoji char
  overallMastery: number; // 0-100
  weakestTopic: string;
  strongestTopic: string;
  lastActive: string;
  status: 'At Risk' | 'On Track' | 'Advanced';
  history: {
    problemId: string;
    topic: string;
    correct: boolean;
    timeSpent: number; // seconds
  }[];
}