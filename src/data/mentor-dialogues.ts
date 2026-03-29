export interface MentorDialogue {
  id: string;
  context: string;
  text: string;
}

export const MENTOR_GREETINGS: string[] = [
  'Bonjour, jeune héros ! Prêt pour une nouvelle aventure ?',
  'Ah, te revoilà ! La forêt murmure que tu deviens plus fort.',
  'Bienvenue, aventurier. Les étoiles annoncent une belle journée.',
  'Le vent m\'a dit que tu étais en chemin. Allons-y !',
  'Chaque jour est une nouvelle page de ta légende.',
  'Tes pas font trembler les ombres. Continue !',
  'Le monde a besoin de héros comme toi. Qu\'allons-nous accomplir ?',
];

export const MENTOR_ENCOURAGEMENTS: string[] = [
  'Chaque effort compte, même le plus petit.',
  'Tu es plus fort que tu ne le crois.',
  'La persévérance est la plus puissante des magies.',
  'Ton familier est fier de toi !',
  'Les grandes quêtes se conquièrent un pas à la fois.',
  'Rappelle-toi : les héros aussi ont le droit de se reposer.',
  'Ta lumière grandit de jour en jour.',
];

export const MENTOR_RETURN_MESSAGES: string[] = [
  'Te revoilà ! Ton familier s\'ennuyait un peu...',
  'Content de te revoir ! Reprends tranquillement.',
  'La route est longue, mais chaque retour est une victoire.',
  'Pas de pression. L\'important c\'est d\'être là.',
];

export const MENTOR_STREAK_MESSAGES: Record<number, string> = {
  3: 'Trois jours d\'affilée ! Tu commences à trouver ton rythme.',
  7: 'Une semaine complète ! Ton aura brille plus fort.',
  14: 'Deux semaines ! Tu es devenu un vrai aventurier.',
  30: 'Un mois ! Les légendes parlent de toi dans tout le royaume.',
  60: 'Deux mois de persévérance ! Tu es un champion.',
  100: 'CENT JOURS ! Tu es désormais une légende vivante !',
};
