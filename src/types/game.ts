export type StatType = 'endurance' | 'force' | 'magie' | 'vie';

export interface StatValues {
  endurance: number;
  force: number;
  magie: number;
  vie: number;
}

export interface StatModifier {
  stat: StatType;
  value: number;
  source: string;
  expiresAt?: string;
}

export interface SkillNode {
  id: string;
  stat: StatType;
  name: string;
  description: string;
  tier: number;
  cost: number;
  unlocked: boolean;
  prerequisiteIds: string[];
  effect: SkillEffect;
}

export interface SkillEffect {
  type: 'stat_bonus' | 'xp_multiplier' | 'quest_unlock' | 'cosmetic';
  stat?: StatType;
  value: number;
  description: string;
}

export type ItemCategory = 'outfit' | 'accessory' | 'background' | 'aura' | 'pet_costume';
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  price: number;
  rarity: Rarity;
  imageKey: string;
  unlockLevel?: number;
}
