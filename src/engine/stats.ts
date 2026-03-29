import { StatType, StatValues } from '../types';

export function calculateStatGain(stat: StatType, action: string, value: number): number {
  const gains: Record<string, Record<string, (v: number) => number>> = {
    endurance: {
      steps: (v) => (v / 1000) * 0.5,
      cardio_session: () => 2,
    },
    force: {
      strength_session: () => 2,
      yoga_session: () => 1,
    },
    magie: {
      sleep_hours: (v) => v >= 8 ? 3 : v >= 6 ? 1.5 : 0,
      meditation: () => 2,
    },
    vie: {
      healthy_meal: () => 1,
      water_ml: (v) => (v / 500) * 0.5,
    },
  };
  const statGains = gains[stat];
  if (!statGains || !statGains[action]) return 0;
  return Math.round(statGains[action](value) * 10) / 10;
}

export function calculateStatDecay(currentValue: number, daysSinceActivity: number): number {
  if (daysSinceActivity <= 0) return currentValue;
  const decay = daysSinceActivity * 1;
  return Math.max(5, currentValue - decay);
}

export function computeAuraColor(stats: StatValues): string {
  const entries = Object.entries(stats) as [StatType, number][];
  const max = Math.max(...entries.map(([, v]) => v));
  const min = Math.min(...entries.map(([, v]) => v));

  if (max - min <= 10) return '#FFD700';

  const dominant = entries.find(([, v]) => v === max)![0];
  const auraMap: Record<StatType, string> = {
    endurance: '#7EC8A0',
    force: '#D4A574',
    magie: '#9BB5E0',
    vie: '#E8A0B4',
  };
  return auraMap[dominant];
}

export function getStatLabel(stat: StatType): string {
  const labels: Record<StatType, string> = {
    endurance: 'Endurance',
    force: 'Force',
    magie: 'Magie',
    vie: 'Vie',
  };
  return labels[stat];
}

export function getStatIcon(stat: StatType): string {
  const icons: Record<StatType, string> = {
    endurance: 'wind',
    force: 'shield',
    magie: 'star',
    vie: 'heart',
  };
  return icons[stat];
}

export const DEFAULT_STATS: StatValues = {
  endurance: 10,
  force: 10,
  magie: 10,
  vie: 10,
};
