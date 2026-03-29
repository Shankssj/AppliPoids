import { Redirect } from 'expo-router';
import { usePlayerStore } from '../src/stores/usePlayerStore';

export default function Index() {
  const hasCompletedOnboarding = usePlayerStore((s) => s.hasCompletedOnboarding);

  if (hasCompletedOnboarding) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/(onboarding)/welcome" />;
}
