const BASE_XP = 100;
const EXPONENT = 1.2;

export function xpForLevel(level: number): number {
  return Math.floor(BASE_XP * Math.pow(level, EXPONENT));
}

export function totalXpForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i <= level; i++) {
    total += xpForLevel(i);
  }
  return total;
}

export function getLevelFromTotalXp(totalXp: number): { level: number; currentLevelXp: number; xpToNextLevel: number } {
  let level = 1;
  let accumulated = 0;
  while (accumulated + xpForLevel(level) <= totalXp) {
    accumulated += xpForLevel(level);
    level++;
  }
  return {
    level,
    currentLevelXp: totalXp - accumulated,
    xpToNextLevel: xpForLevel(level),
  };
}

export function calculateStreakMultiplier(streak: number): number {
  if (streak <= 0) return 1.0;
  return Math.min(2.0, 1.0 + Math.log10(streak + 1) * 0.65);
}

export function applyStreakBonus(baseXp: number, streak: number): number {
  return Math.floor(baseXp * calculateStreakMultiplier(streak));
}

export const XP_SOURCES = {
  DAILY_QUEST: 60,
  EPIC_QUEST: 300,
  BOSS_DEFEAT: 750,
  LOG_MEAL: 10,
  LOG_WATER_250ML: 5,
  LOG_EXERCISE: 30,
  MOOD_JOURNAL: 15,
  STREAK_DAILY: 5,
} as const;
