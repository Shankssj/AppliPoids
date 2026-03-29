import { DailyLog, StatValues } from '../types';

interface MentorAdvice {
  greeting: string;
  tip: string;
  questSuggestion?: string;
}

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return 'La nuit est encore jeune, aventurier...';
  if (hour < 12) return 'Bonjour, héros ! Une nouvelle journée t\'attend.';
  if (hour < 18) return 'L\'après-midi est le moment idéal pour progresser !';
  return 'Bonsoir, vaillant guerrier. Le repos approche.';
}

export function getMentorAdvice(
  stats: StatValues,
  todayLog: DailyLog | null,
  streak: number,
): MentorAdvice {
  const greeting = getTimeGreeting();

  if (!todayLog || !todayLog.isActive) {
    return {
      greeting,
      tip: 'Je ne t\'ai pas vu aujourd\'hui ! Commence par un petit objectif pour garder ton élan.',
      questSuggestion: 'Bois un verre d\'eau pour commencer.',
    };
  }

  if (todayLog.sleepHours > 0 && todayLog.sleepHours < 6) {
    return {
      greeting,
      tip: 'Tu as peu dormi cette nuit. Privilégie une marche douce plutôt qu\'un sprint aujourd\'hui.',
      questSuggestion: 'Quête de marche tranquille recommandée.',
    };
  }

  if (todayLog.water < 750) {
    return {
      greeting,
      tip: 'Tu n\'as pas encore assez bu. L\'hydratation est la base de toute aventure !',
      questSuggestion: 'Bois 500ml d\'eau dans la prochaine heure.',
    };
  }

  if (todayLog.mood && todayLog.mood.stress >= 4) {
    return {
      greeting,
      tip: 'Je sens que le stress pèse sur toi. Prends un moment pour respirer.',
      questSuggestion: 'Quête de cohérence cardiaque : 3 minutes de respiration.',
    };
  }

  const lowestStat = (Object.entries(stats) as [string, number][])
    .sort(([, a], [, b]) => a - b)[0];

  const statTips: Record<string, string> = {
    endurance: 'Ta stamina pourrait être renforcée. Une petite marche ferait du bien !',
    force: 'Tes muscles demandent de l\'attention. Quelques exercices peut-être ?',
    magie: 'Ton esprit a besoin de repos. Pense à méditer ou bien dormir ce soir.',
    vie: 'Tes points de vie sont bas. Un bon repas et de l\'eau te redonneront de l\'énergie !',
  };

  if (streak >= 7) {
    return {
      greeting,
      tip: `${streak} jours de suite ! Tu es incroyable. Continue comme ça, champion !`,
    };
  }

  return {
    greeting,
    tip: statTips[lowestStat[0]] || 'Continue tes efforts, chaque pas compte !',
  };
}
