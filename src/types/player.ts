export type AvatarGender = 'masculine' | 'feminine' | 'neutral';
export type AvatarSkinTone = 'light' | 'medium' | 'tan' | 'dark' | 'deep';
export type AvatarHairStyle = 'short' | 'medium' | 'long' | 'curly' | 'braided' | 'bun';

export interface AvatarConfig {
  gender: AvatarGender;
  skinTone: AvatarSkinTone;
  hairStyle: AvatarHairStyle;
  hairColor: string;
  eyeColor: string;
  outfit: string;
  accessory: string | null;
  auraColor: string;
}

export interface Player {
  id: string;
  name: string;
  avatar: AvatarConfig;
  level: number;
  totalXp: number;
  currentLevelXp: number;
  currency: number;
  createdAt: string;
  lastActiveAt: string;
  currentStreak: number;
  longestStreak: number;
  goals: string[];
}
