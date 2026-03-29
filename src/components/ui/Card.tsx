import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors, spacing, radii, shadows } from '../../theme/tokens';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: keyof typeof spacing;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, variant = 'default', padding = 'md', style }: CardProps) {
  return (
    <View
      style={[
        styles.base,
        { padding: spacing[padding] },
        variant === 'elevated' && [styles.elevated, shadows.md],
        variant === 'outlined' && styles.outlined,
        variant === 'default' && shadows.sm,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.neutral[0],
    borderRadius: radii.lg,
  },
  elevated: {
    backgroundColor: colors.neutral[0],
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
  },
});
