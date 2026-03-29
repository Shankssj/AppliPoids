import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { colors, typography } from '../../theme/tokens';

interface AppTextProps extends TextProps {
  variant?: 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  color?: string;
  align?: 'left' | 'center' | 'right';
}

export function Text({ variant = 'body', color, align, style, ...props }: AppTextProps) {
  return (
    <RNText
      style={[
        styles.base,
        styles[variant],
        color ? { color } : undefined,
        align ? { textAlign: align } : undefined,
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: typography.fontFamily.regular,
    color: colors.neutral[500],
  },
  display: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: typography.fontSize.display,
    color: colors.neutral[700],
    lineHeight: 48,
  },
  h1: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xxl,
    color: colors.neutral[700],
    lineHeight: 40,
  },
  h2: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xl,
    color: colors.neutral[600],
    lineHeight: 32,
  },
  h3: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.lg,
    color: colors.neutral[600],
    lineHeight: 28,
  },
  body: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
    color: colors.neutral[500],
    lineHeight: 24,
  },
  caption: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.neutral[400],
    lineHeight: 16,
  },
  label: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.neutral[600],
    lineHeight: 20,
  },
});
