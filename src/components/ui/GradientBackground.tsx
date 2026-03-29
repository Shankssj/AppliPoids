import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/tokens';

interface GradientBackgroundProps {
  children: React.ReactNode;
  variant?: 'morning' | 'afternoon' | 'evening' | 'night' | 'auto';
}

function getTimeVariant(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
}

export function GradientBackground({ children, variant = 'auto' }: GradientBackgroundProps) {
  const timeVariant = variant === 'auto' ? getTimeVariant() : variant;
  const gradientColors = colors.timeOfDay[timeVariant] as unknown as [string, string, ...string[]];

  return (
    <LinearGradient colors={gradientColors} style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 0.3, y: 1 }}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
