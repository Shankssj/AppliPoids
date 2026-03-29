import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from './storage';
import { Pet, PetSpecies, PetMood } from '../types';
import { canEvolve, getNextStage, computePetMood, GROWTH_REWARDS } from '../engine/pet';

interface PetState {
  pet: Pet | null;
  createPet: (name: string, species: PetSpecies) => void;
  addGrowthPoints: (points: number) => void;
  feed: () => void;
  play: () => void;
  updateSleepStreak: (goodSleep: boolean) => void;
  tryEvolve: () => boolean;
  updateMood: (daysSinceActive: number) => void;
}

export const usePetStore = create<PetState>()(
  persist(
    (set, get) => ({
      pet: null,

      createPet: (name, species) => {
        set({
          pet: {
            id: Date.now().toString(),
            name,
            species,
            stage: 'egg',
            mood: 'content',
            bondLevel: 0,
            growthPoints: 0,
            fedToday: false,
            playedToday: false,
            lastInteraction: new Date().toISOString(),
            sleepStreak: 0,
          },
        });
      },

      addGrowthPoints: (points) => {
        const { pet } = get();
        if (!pet || pet.stage === 'egg') return;
        set({ pet: { ...pet, growthPoints: pet.growthPoints + points } });
      },

      feed: () => {
        const { pet } = get();
        if (!pet) return;
        set({
          pet: {
            ...pet,
            fedToday: true,
            bondLevel: Math.min(100, pet.bondLevel + 2),
            lastInteraction: new Date().toISOString(),
          },
        });
      },

      play: () => {
        const { pet } = get();
        if (!pet) return;
        set({
          pet: {
            ...pet,
            playedToday: true,
            bondLevel: Math.min(100, pet.bondLevel + 3),
            lastInteraction: new Date().toISOString(),
          },
        });
      },

      updateSleepStreak: (goodSleep) => {
        const { pet } = get();
        if (!pet) return;
        set({
          pet: {
            ...pet,
            sleepStreak: goodSleep ? pet.sleepStreak + 1 : 0,
          },
        });
      },

      tryEvolve: () => {
        const { pet } = get();
        if (!pet || !canEvolve(pet)) return false;
        const nextStage = getNextStage(pet.stage);
        if (!nextStage) return false;
        set({
          pet: {
            ...pet,
            stage: nextStage,
            hatchedAt: pet.stage === 'egg' ? new Date().toISOString() : pet.hatchedAt,
            evolvedAt: new Date().toISOString(),
          },
        });
        return true;
      },

      updateMood: (daysSinceActive) => {
        const { pet } = get();
        if (!pet) return;
        const mood = computePetMood(daysSinceActive, pet.fedToday, pet.playedToday);
        set({ pet: { ...pet, mood } });
      },
    }),
    {
      name: 'vitaquest-pet',
      storage: createJSONStorage(() => storage),
    },
  ),
);
