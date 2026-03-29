import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from './storage';
import { DailyLog, MealEntry, ExerciseEntry, MoodEntry, Rating } from '../types';
import { getTodayString } from '../engine/streaks';

function createEmptyLog(date: string): DailyLog {
  return {
    id: date,
    date,
    water: 0,
    steps: 0,
    sleepHours: 0,
    sleepQuality: 3,
    meals: [],
    exercises: [],
    mood: null,
    isActive: true,
  };
}

interface HealthState {
  logs: Record<string, DailyLog>;
  getTodayLog: () => DailyLog;
  addWater: (ml: number) => void;
  setSteps: (steps: number) => void;
  setSleep: (hours: number, quality: Rating) => void;
  addMeal: (meal: MealEntry) => void;
  addExercise: (exercise: ExerciseEntry) => void;
  setMood: (mood: MoodEntry) => void;
  getActiveDates: () => string[];
}

export const useHealthStore = create<HealthState>()(
  persist(
    (set, get) => ({
      logs: {},

      getTodayLog: () => {
        const today = getTodayString();
        const { logs } = get();
        if (!logs[today]) {
          const newLog = createEmptyLog(today);
          set({ logs: { ...logs, [today]: newLog } });
          return newLog;
        }
        return logs[today];
      },

      addWater: (ml) => {
        const today = getTodayString();
        const { logs } = get();
        const log = logs[today] || createEmptyLog(today);
        set({
          logs: {
            ...logs,
            [today]: { ...log, water: log.water + ml, isActive: true },
          },
        });
      },

      setSteps: (steps) => {
        const today = getTodayString();
        const { logs } = get();
        const log = logs[today] || createEmptyLog(today);
        set({
          logs: {
            ...logs,
            [today]: { ...log, steps, isActive: true },
          },
        });
      },

      setSleep: (hours, quality) => {
        const today = getTodayString();
        const { logs } = get();
        const log = logs[today] || createEmptyLog(today);
        set({
          logs: {
            ...logs,
            [today]: { ...log, sleepHours: hours, sleepQuality: quality, isActive: true },
          },
        });
      },

      addMeal: (meal) => {
        const today = getTodayString();
        const { logs } = get();
        const log = logs[today] || createEmptyLog(today);
        set({
          logs: {
            ...logs,
            [today]: { ...log, meals: [...log.meals, meal], isActive: true },
          },
        });
      },

      addExercise: (exercise) => {
        const today = getTodayString();
        const { logs } = get();
        const log = logs[today] || createEmptyLog(today);
        set({
          logs: {
            ...logs,
            [today]: { ...log, exercises: [...log.exercises, exercise], isActive: true },
          },
        });
      },

      setMood: (mood) => {
        const today = getTodayString();
        const { logs } = get();
        const log = logs[today] || createEmptyLog(today);
        set({
          logs: {
            ...logs,
            [today]: { ...log, mood, isActive: true },
          },
        });
      },

      getActiveDates: () => {
        const { logs } = get();
        return Object.keys(logs).filter((d) => logs[d].isActive);
      },
    }),
    {
      name: 'vitaquest-health',
      storage: createJSONStorage(() => storage),
    },
  ),
);
