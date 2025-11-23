// User Profile Interface
export interface User {
  id: string;
  username: string;
  avatar_url?: string;
  level: number;
  total_points: number;
  current_streak: number;
  settings?: UserSettings;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  language: "pt-BR" | "en-US";
  notifications: boolean;
  theme?: "dark" | "light";
}

// Habit Categories
export type HabitCategory = "vice" | "health" | "training";

// Habit Interface
export interface Habit {
  id: string;
  user_id: string;
  title: string;
  category: HabitCategory;
  base_points: number;
  is_hard_mode_active: boolean;
  description?: string;
  icon?: string;
  created_at: string;
  updated_at: string;
}

// Daily Log Interface
export interface DailyLog {
  id: string;
  user_id: string;
  date: string;
  completed_habits: string[]; // Array of habit IDs
  daily_score: number;
  health_percentage: number;
  created_at: string;
  updated_at: string;
}

// Dynamic Goal Interface
export interface Goal {
  id: string;
  user_id: string;
  habit_id: string;
  title: string;
  target_days: number;
  current_progress: number;
  completed: boolean;
  failed: boolean;
  created_at: string;
  updated_at: string;
}

// Progress Tracking
export interface ProgressStats {
  weeklyScore: number;
  monthlyScore: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
}

// Onboarding State
export interface OnboardingState {
  completed: boolean;
  currentStep: number;
  selectedGoals?: string[];
}
