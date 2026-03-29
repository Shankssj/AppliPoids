import { PetSpecies, PetStage } from '../types';

export interface PetStageInfo {
  stage: PetStage;
  name: string;
  description: string;
  size: number;
  emoji: string;
}

export const PET_STAGES: Record<PetStage, PetStageInfo> = {
  egg: {
    stage: 'egg',
    name: 'Oeuf Mystérieux',
    description: 'Un oeuf chaud qui pulse doucement. Il a besoin de bonnes nuits de sommeil pour éclore.',
    size: 60,
    emoji: '🥚',
  },
  baby: {
    stage: 'baby',
    name: 'Nouveau-né',
    description: 'Un petit être adorable qui découvre le monde. Prends soin de lui !',
    size: 80,
    emoji: '🐣',
  },
  juvenile: {
    stage: 'juvenile',
    name: 'Juvénile',
    description: 'Il grandit vite ! Ses pouvoirs commencent à se manifester.',
    size: 100,
    emoji: '🐾',
  },
  adult: {
    stage: 'adult',
    name: 'Adulte',
    description: 'Un compagnon fidèle et puissant qui t\'accompagne dans toutes tes aventures.',
    size: 120,
    emoji: '✨',
  },
  mythical: {
    stage: 'mythical',
    name: 'Mythique',
    description: 'Une créature légendaire ! Votre lien est indestructible.',
    size: 140,
    emoji: '🌟',
  },
};

export const PET_SPECIES_INFO: Record<PetSpecies, { name: string; element: string; color: string }> = {
  forest_spirit: { name: 'Esprit de la Forêt', element: 'Nature', color: '#7EC8A0' },
  water_sprite: { name: 'Sprite des Eaux', element: 'Eau', color: '#9BB5E0' },
  fire_fox: { name: 'Renard de Flamme', element: 'Feu', color: '#D4A574' },
  wind_bird: { name: 'Oiseau du Vent', element: 'Air', color: '#B89FD6' },
};
