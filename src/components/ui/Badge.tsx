import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { colors, radii, spacing } from '../../theme/tokens';

interface BadgeProps {
  label: string;
  color?: string;
  size?: 'sm' | 'md';
}

export function Badge({ label, color = colors.primary[300], size = 'md' }: BadgeProps) {
  return (
    <View style={[styles.base, styles[size], { backgroundColor: color + '20', borderColor: color }]}>
      <Text variant="caption" color={color} style={size === 'sm' ? { fontSize: 10 } : undefined}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  md: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
});
