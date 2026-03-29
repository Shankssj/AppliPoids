import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from './storage';
import { StatType, StatValues } from '../types';
import { DEFAULT_STATS, calculateStatDecay } from '../engine/stats';

interface StatsState {
  stats: StatValues;
  lastActivity: Record<StatType, string>;
  addStatPoints: (stat: StatType, points: number) => void;
  applyDecay: () => void;
  resetStats: () => void;
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      stats: { ...DEFAULT_STATS },
      lastActivity: {
        endurance: new Date().toISOString(),
        force: new Date().toISOString(),
        magie: new Date().toISOString(),
        vie: new Date().toISOString(),
      },

      addStatPoints: (stat, points) => {
        const { stats, lastActivity } = get();
        set({
          stats: {
            ...stats,
            [stat]: Math.min(100, stats[stat] + points),
          },
          lastActivity: {
            ...lastActivity,
            [stat]: new Date().toISOString(),
          },
        });
      },

      applyDecay: () => {
        const { stats, lastActivity } = get();
        const now = new Date();
        const newStats = { ...stats };
        for (const stat of Object.keys(stats) as StatType[]) {
          const lastDate = new Date(lastActivity[stat]);
          const daysSince = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
          newStats[stat] = calculateStatDecay(stats[stat], daysSince);
        }
        set({ stats: newStats });
      },

      resetStats: () => set({ stats: { ...DEFAULT_STATS } }),
    }),
    {
      name: 'vitaquest-stats',
      storage: createJSONStorage(() => storage),
    },
  ),
);
