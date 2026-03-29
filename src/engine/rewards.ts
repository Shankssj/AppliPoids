import { QuestRewards, StatType } from '../types';

export function createReward(
  xp: number,
  currency: number,
  stat: StatType,
  statPoints: number,
  itemId?: string,
): QuestRewards {
  return {
    xp,
    currency,
    statPoints: { [stat]: statPoints },
    itemId,
  };
}

export function mergeRewards(a: QuestRewards, b: QuestRewards): QuestRewards {
  const merged: QuestRewards = {
    xp: a.xp + b.xp,
    currency: a.currency + b.currency,
    statPoints: { ...a.statPoints },
  };

  for (const [key, val] of Object.entries(b.statPoints)) {
    const stat = key as StatType;
    merged.statPoints[stat] = (merged.statPoints[stat] || 0) + (val || 0);
  }

  return merged;
}

export function scaleRewards(reward: QuestRewards, multiplier: number): QuestRewards {
  const scaled: QuestRewards = {
    xp: Math.floor(reward.xp * multiplier),
    currency: Math.floor(reward.currency * multiplier),
    statPoints: {},
  };

  for (const [key, val] of Object.entries(reward.statPoints)) {
    if (val) {
      scaled.statPoints[key as StatType] = Math.floor(val * multiplier);
    }
  }

  return scaled;
}
