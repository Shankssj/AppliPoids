import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { usePlayerStore } from '../src/stores/usePlayerStore';

export default function Index() {
  const hasCompletedOnboarding = usePlayerStore((s) => s.hasCompletedOnboarding);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Écoute la fin du chargement des données persistées
    const unsubHydrate = usePlayerStore.persist.onFinishHydration(() => setIsHydrated(true));
    
    // Vérifie si le chargement a déjà eu lieu (cas où le composant est re-monté)
    setIsHydrated(usePlayerStore.persist.hasHydrated());

    return () => {
      unsubHydrate();
    };
  }, []);

  // Tant que Zustand n'a pas fini de charger la sauvegarde, on n'affiche rien 
  // (Vous pourriez aussi mettre un SplashScreen ou un Loader ici)
  if (!isHydrated) {
    return null;
  }

  if (hasCompletedOnboarding) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/(onboarding)/welcome" />;
}