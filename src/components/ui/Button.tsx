import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from './Text';
import { colors, spacing, radii, shadows } from '../../theme/tokens';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        style={[isDisabled && styles.disabled, style]}
      >
        <LinearGradient
          colors={[colors.primary[300], colors.primary[400]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.base, styles[size], shadows.md]}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              {icon}
              <Text variant="label" color="#FFF" style={icon ? { marginLeft: 8 } : undefined}>
                {title}
              </Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.base,
        styles[size],
        variant === 'secondary' && styles.secondaryBg,
        variant === 'ghost' && styles.ghostBg,
        variant === 'danger' && styles.dangerBg,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.neutral[500]} />
      ) : (
        <>
          {icon}
          <Text
            variant="label"
            color={
              variant === 'secondary'
                ? colors.primary[500]
                : variant === 'danger'
                  ? colors.error
                  : colors.neutral[600]
            }
            style={icon ? { marginLeft: 8 } : undefined}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.lg,
  },
  sm: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
  },
  md: {
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.lg,
  },
  lg: {
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl,
  },
  secondaryBg: {
    backgroundColor: colors.primary[50],
    borderWidth: 1.5,
    borderColor: colors.primary[200],
  },
  ghostBg: {
    backgroundColor: 'transparent',
  },
  dangerBg: {
    backgroundColor: '#FDF0F0',
    borderWidth: 1.5,
    borderColor: '#F0C8C4',
  },
  disabled: {
    opacity: 0.5,
  },
});
