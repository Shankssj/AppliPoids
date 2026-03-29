import { Pet, PetMood, PetStage } from '../types';

export const EVOLUTION_THRESHOLDS: Record<PetStage, number> = {
  egg: 0,
  baby: 100,
  juvenile: 500,
  adult: 2000,
  mythical: Infinity,
};

export const EGG_HATCH_SLEEP_STREAK = 7;
export const SLEEP_MINIMUM_HOURS = 7;

export function canHatchEgg(sleepStreak: number): boolean {
  return sleepStreak >= EGG_HATCH_SLEEP_STREAK;
}

export function getNextStage(current: PetStage): PetStage | null {
  const order: PetStage[] = ['egg', 'baby', 'juvenile', 'adult', 'mythical'];
  const idx = order.indexOf(current);
  return idx < order.length - 1 ? order[idx + 1] : null;
}

export function canEvolve(pet: Pet): boolean {
  if (pet.stage === 'egg') return canHatchEgg(pet.sleepStreak);
  const next = getNextStage(pet.stage);
  if (!next) return false;
  return pet.growthPoints >= EVOLUTION_THRESHOLDS[next];
}

export function computePetMood(daysSinceLastActive: number, fedToday: boolean, playedToday: boolean): PetMood {
  if (daysSinceLastActive === 0 && fedToday && playedToday) return 'happy';
  if (daysSinceLastActive === 0) return 'content';
  if (daysSinceLastActive === 1) return 'sleepy';
  if (daysSinceLastActive === 2) return 'hungry';
  return 'sad';
}

export const GROWTH_REWARDS = {
  DAILY_QUEST: 5,
  EPIC_QUEST: 10,
  STREAK_DAY: 3,
} as const;

export function getPetEmoji(stage: PetStage, mood: PetMood): string {
  if (stage === 'egg') return '🥚';
  const moodEmojis: Record<PetMood, string> = {
    happy: '😊',
    content: '🙂',
    sleepy: '😴',
    hungry: '😕',
    sad: '😢',
  };
  return moodEmojis[mood];
}

export function getPetStageLabel(stage: PetStage): string {
  const labels: Record<PetStage, string> = {
    egg: 'Oeuf',
    baby: 'Bébé',
    juvenile: 'Juvénile',
    adult: 'Adulte',
    mythical: 'Mythique',
  };
  return labels[stage];
}
