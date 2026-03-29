import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { ProgressBar } from './ProgressBar';
import { colors, spacing } from '../../theme/tokens';
import { StatType } from '../../types';

interface StatBarProps {
  stat: StatType;
  value: number;
  maxValue?: number;
}

const STAT_CONFIG: Record<StatType, { label: string; icon: string; color: string }> = {
  endurance: { label: 'Endurance', icon: '🏃', color: colors.stat.endurance },
  force: { label: 'Force', icon: '💪', color: colors.stat.force },
  magie: { label: 'Magie', icon: '✨', color: colors.stat.magie },
  vie: { label: 'Vie', icon: '❤️', color: colors.stat.vie },
};

export function StatBar({ stat, value, maxValue = 100 }: StatBarProps) {
  const config = STAT_CONFIG[stat];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="label">
          {config.icon} {config.label}
        </Text>
        <Text variant="caption" color={config.color}>
          {Math.round(value)}
        </Text>
      </View>
      <ProgressBar progress={value} max={maxValue} color={config.color} height={8} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
});
