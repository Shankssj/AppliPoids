import { DailyLog } from '../types';

export function calculateBossHp(playerLevel: number): number {
  return 500 + playerLevel * 100;
}

export function calculateDamage(log: DailyLog, questsCompleted: number): number {
  let damage = 0;
  const totalCalories = log.exercises.reduce((sum, e) => sum + (e.caloriesEstimate || 0), 0);
  damage += totalCalories;
  damage += Math.floor(log.steps / 1000) * 50;
  damage += questsCompleted * 100;
  if (log.water >= 1500) damage += 75;
  return damage;
}

export function isWeekend(): boolean {
  const day = new Date().getDay();
  return day === 0 || day === 6;
}

export function getBossName(level: number): string {
  const bosses = [
    'Le Spectre de la Flemme',
    'Le Golem de Paresse',
    'L\'Ombre de la Procrastination',
    'Le Dragon Sédentaire',
    'Le Titan du Canapé',
    'La Chimère de la Malbouffe',
    'Le Kraken du Stress',
    'Le Phénix de l\'Insomnie',
  ];
  return bosses[level % bosses.length];
}

export function getBossFlavorText(bossName: string): string {
  const texts: Record<string, string> = {
    'Le Spectre de la Flemme': 'Une brume lourde s\'abat sur la vallée... seul le mouvement peut la dissiper.',
    'Le Golem de Paresse': 'Un géant de pierre s\'est installé sur le chemin. Chaque pas le fissure un peu plus.',
    'L\'Ombre de la Procrastination': 'Elle murmure "demain" à l\'oreille des voyageurs imprudents...',
    'Le Dragon Sédentaire': 'Endormi depuis des éons, il se nourrit de l\'inaction des héros.',
    'Le Titan du Canapé': 'Confortable mais redoutable, il attire les aventuriers dans son piège douillet.',
    'La Chimère de la Malbouffe': 'Ses trois têtes offrent des tentations sucrées, salées et grasses.',
    'Le Kraken du Stress': 'Ses tentacules s\'enroulent autour de l\'esprit. La respiration est la clé.',
    'Le Phénix de l\'Insomnie': 'Il brûle dans la nuit, empêchant le repos des braves.',
  };
  return texts[bossName] || 'Un ennemi redoutable se dresse devant toi !';
}
