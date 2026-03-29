import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from './storage';
import { Quest, QuestStatus } from '../types';
import { DAILY_QUESTS } from '../data/quests-daily';
import { getTodayString } from '../engine/streaks';

interface QuestState {
  quests: Quest[];
  lastGeneratedDate: string;
  generateDailyQuests: (playerWeek: number) => void;
  updateQuestProgress: (questId: string, progress: number) => void;
  completeQuest: (questId: string) => void;
  getActiveQuests: () => Quest[];
  getCompletedToday: () => Quest[];
}

export const useQuestStore = create<QuestState>()(
  persist(
    (set, get) => ({
      quests: [],
      lastGeneratedDate: '',

      generateDailyQuests: (playerWeek) => {
        const today = getTodayString();
        if (get().lastGeneratedDate === today) return;

        const difficulty = playerWeek <= 1 ? 'easy' : 'standard';
        const templates = DAILY_QUESTS.filter(
          (q) => q.difficulty === difficulty || q.difficulty === 'easy',
        );

        const selected = templates.slice(0, 4);
        const newQuests: Quest[] = selected.map((t) => ({
          id: `${t.id}_${today}`,
          templateId: t.id,
          type: t.type,
          title: t.title,
          description: t.description,
          flavorText: t.flavorText,
          icon: t.icon,
          stat: t.stat,
          target: t.baseTarget,
          unit: t.unit,
          currentProgress: 0,
          status: 'active' as QuestStatus,
          rewards: t.rewards,
          expiresAt: `${today}T23:59:59`,
          createdAt: new Date().toISOString(),
        }));

        const existingNonDaily = get().quests.filter((q) => q.type !== 'daily');
        set({
          quests: [...existingNonDaily, ...newQuests],
          lastGeneratedDate: today,
        });
      },

      updateQuestProgress: (questId, progress) => {
        set({
          quests: get().quests.map((q) =>
            q.id === questId
              ? {
                  ...q,
                  currentProgress: progress,
                  status: progress >= q.target ? 'completed' : q.status,
                }
              : q,
          ),
        });
      },

      completeQuest: (questId) => {
        set({
          quests: get().quests.map((q) =>
            q.id === questId ? { ...q, status: 'completed' as QuestStatus } : q,
          ),
        });
      },

      getActiveQuests: () => get().quests.filter((q) => q.status === 'active'),

      getCompletedToday: () => {
        const today = getTodayString();
        return get().quests.filter(
          (q) => q.status === 'completed' && q.createdAt.startsWith(today),
        );
      },
    }),
    {
      name: 'vitaquest-quests',
      storage: createJSONStorage(() => storage),
    },
  ),
);
