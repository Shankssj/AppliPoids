import { StatType, StatValues } from './game';

export type QuestType = 'daily' | 'epic' | 'boss';
export type QuestStatus = 'available' | 'active' | 'completed' | 'expired';
export type QuestUnit = 'steps' | 'ml' | 'hours' | 'sessions' | 'calories' | 'count';

export interface QuestRewards {
  xp: number;
  currency: number;
  statPoints: Partial<StatValues>;
  itemId?: string;
}

export interface Quest {
  id: string;
  templateId: string;
  type: QuestType;
  title: string;
  description: string;
  flavorText: string;
  icon: string;
  stat: StatType;
  target: number;
  unit: QuestUnit;
  currentProgress: number;
  status: QuestStatus;
  rewards: QuestRewards;
  expiresAt: string;
  createdAt: string;
}

export interface BossPhase {
  hpThreshold: number;
  challenge: string;
  bonusReward: QuestRewards;
}

export interface BossQuest extends Quest {
  type: 'boss';
  bossName: string;
  bossHp: number;
  currentBossDamage: number;
  bossImageKey: string;
  phases: BossPhase[];
}

export interface QuestTemplate {
  id: string;
  type: QuestType;
  title: string;
  description: string;
  flavorText: string;
  icon: string;
  stat: StatType;
  baseTarget: number;
  unit: QuestUnit;
  rewards: QuestRewards;
  difficulty: 'easy' | 'standard' | 'challenge';
  weekAvailable?: number;
}
