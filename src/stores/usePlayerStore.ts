import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from './storage';
import { Player, AvatarConfig } from '../types';
import { getLevelFromTotalXp, applyStreakBonus } from '../engine/xp';

interface PlayerState {
  player: Player | null;
  hasCompletedOnboarding: boolean;
  createPlayer: (name: string, avatar: AvatarConfig, goals: string[]) => void;
  addXp: (amount: number) => void;
  addCurrency: (amount: number) => void;
  updateStreak: (streak: number) => void;
  updateLastActive: () => void;
  setOnboardingComplete: () => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      player: null,
      hasCompletedOnboarding: false,

      createPlayer: (name, avatar, goals) => {
        const player: Player = {
          id: Date.now().toString(),
          name,
          avatar,
          level: 1,
          totalXp: 0,
          currentLevelXp: 0,
          currency: 50,
          createdAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
          currentStreak: 0,
          longestStreak: 0,
          goals,
        };
        set({ player, hasCompletedOnboarding: true });
      },

      addXp: (amount) => {
        const { player } = get();
        if (!player) return;
        const boosted = applyStreakBonus(amount, player.currentStreak);
        const newTotal = player.totalXp + boosted;
        const { level, currentLevelXp } = getLevelFromTotalXp(newTotal);
        set({
          player: {
            ...player,
            totalXp: newTotal,
            level,
            currentLevelXp,
          },
        });
      },

      addCurrency: (amount) => {
        const { player } = get();
        if (!player) return;
        set({ player: { ...player, currency: player.currency + amount } });
      },

      updateStreak: (streak) => {
        const { player } = get();
        if (!player) return;
        set({
          player: {
            ...player,
            currentStreak: streak,
            longestStreak: Math.max(player.longestStreak, streak),
          },
        });
      },

      updateLastActive: () => {
        const { player } = get();
        if (!player) return;
        set({ player: { ...player, lastActiveAt: new Date().toISOString() } });
      },

      setOnboardingComplete: () => set({ hasCompletedOnboarding: true }),
    }),
    {
      name: 'vitaquest-player',
      storage: createJSONStorage(() => storage),
    },
  ),
);
