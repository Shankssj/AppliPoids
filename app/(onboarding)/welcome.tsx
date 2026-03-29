import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Button } from '../../src/components/ui';
import { colors, spacing } from '../../src/theme/tokens';

const { height } = Dimensions.get('window');

export default function Welcome() {
  return (
    <LinearGradient
      colors={[colors.primary[50], colors.neutral[50], colors.secondary[50]]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <View style={styles.illustration}>
          <View style={styles.illustrationCircle}>
            <Text style={styles.illustrationEmoji}>🌿</Text>
          </View>
          <View style={styles.sparkle1}>
            <Text style={{ fontSize: 24 }}>✨</Text>
          </View>
          <View style={styles.sparkle2}>
            <Text style={{ fontSize: 18 }}>🌸</Text>
          </View>
          <View style={styles.sparkle3}>
            <Text style={{ fontSize: 20 }}>🦋</Text>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text variant="display" align="center" color={colors.primary[500]}>
            VitaQuest
          </Text>
          <Text variant="h3" align="center" color={colors.neutral[400]} style={styles.subtitle}>
            Transforme ta vie en aventure
          </Text>
          <Text variant="body" align="center" color={colors.neutral[400]} style={styles.description}>
            Chaque pas, chaque repas, chaque nuit de sommeil{'\n'}
            te rapproche de la victoire.
          </Text>
        </View>

        <View style={styles.features}>
          {[
            { icon: '⚔️', text: 'Deviens un héros' },
            { icon: '🐣', text: 'Adopte un familier' },
            { icon: '🗺️', text: 'Accomplis des quêtes' },
          ].map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={{ fontSize: 20 }}>{f.icon}</Text>
              <Text variant="label" color={colors.neutral[500]} style={{ marginLeft: 12 }}>
                {f.text}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Commencer l'Aventure"
          onPress={() => router.push('/(onboarding)/character-create')}
          size="lg"
        />
        <Text variant="caption" align="center" style={styles.footerText}>
          Ton voyage commence ici
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  illustration: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  illustrationCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.primary[200],
  },
  illustrationEmoji: {
    fontSize: 56,
  },
  sparkle1: {
    position: 'absolute',
    top: 0,
    right: 10,
  },
  sparkle2: {
    position: 'absolute',
    bottom: 10,
    left: 0,
  },
  sparkle3: {
    position: 'absolute',
    top: 30,
    left: 5,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  subtitle: {
    marginTop: spacing.sm,
  },
  description: {
    marginTop: spacing.md,
    lineHeight: 22,
  },
  features: {
    alignSelf: 'stretch',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[0] + 'CC',
    padding: spacing.md,
    borderRadius: 12,
  },
  footer: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  footerText: {
    marginTop: spacing.sm,
  },
});
