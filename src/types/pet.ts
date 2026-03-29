export type PetStage = 'egg' | 'baby' | 'juvenile' | 'adult' | 'mythical';
export type PetMood = 'happy' | 'content' | 'sleepy' | 'hungry' | 'sad';
export type PetSpecies = 'forest_spirit' | 'water_sprite' | 'fire_fox' | 'wind_bird';

export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  stage: PetStage;
  mood: PetMood;
  bondLevel: number;
  growthPoints: number;
  fedToday: boolean;
  playedToday: boolean;
  lastInteraction: string;
  hatchedAt?: string;
  evolvedAt?: string;
  sleepStreak: number;
}
