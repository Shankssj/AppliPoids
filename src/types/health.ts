export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type ExerciseType = 'cardio' | 'strength' | 'flexibility' | 'other';
export type Intensity = 'light' | 'moderate' | 'intense';
export type Rating = 1 | 2 | 3 | 4 | 5;

export interface DailyLog {
  id: string;
  date: string;
  water: number;
  steps: number;
  sleepHours: number;
  sleepQuality: Rating;
  meals: MealEntry[];
  exercises: ExerciseEntry[];
  mood: MoodEntry | null;
  isActive: boolean;
}

export interface MealEntry {
  id: string;
  time: string;
  type: MealType;
  description: string;
  quality: Rating;
}

export interface ExerciseEntry {
  id: string;
  type: ExerciseType;
  name: string;
  durationMinutes: number;
  intensity: Intensity;
  caloriesEstimate?: number;
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: Rating;
  energy: Rating;
  stress: Rating;
  journalText?: string;
  tags: string[];
  timestamp: string;
}
