import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors, radii } from '../../theme/tokens';
import { Text } from './Text';

interface ProgressBarProps {
  progress: number;
  max: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
}

export function ProgressBar({
  progress,
  max,
  color = colors.primary[300],
  height = 12,
  showLabel = false,
  label,
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min(progress / max, 1);
  const width = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      width.value = withTiming(percentage, {
        duration: 800,
        easing: Easing.bezierFn(0.25, 0.1, 0.25, 1),
      });
    } else {
      width.value = percentage;
    }
  }, [percentage, animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return (
    <View>
      {showLabel && (
        <View style={styles.labelRow}>
          <Text variant="caption">{label || ''}</Text>
          <Text variant="caption">
            {progress}/{max}
          </Text>
        </View>
      )}
      <View style={[styles.track, { height, borderRadius: height / 2 }]}>
        <Animated.View
          style={[
            styles.fill,
            { backgroundColor: color, borderRadius: height / 2 },
            animatedStyle,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: colors.neutral[100],
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
});
