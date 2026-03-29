import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Button, ProgressBar, GradientBackground, Badge } from '../../src/components/ui';
import { colors, spacing, radii, shadows } from '../../src/theme/tokens';
import { usePetStore } from '../../src/stores/usePetStore';
import { useHealthStore } from '../../src/stores/useHealthStore';
import { usePlayerStore } from '../../src/stores/usePlayerStore';
import { PET_STAGES, PET_SPECIES_INFO } from '../../src/data/pet-stages';
import { EVOLUTION_THRESHOLDS, EGG_HATCH_SLEEP_STREAK } from '../../src/engine/pet';
import { PetStage } from '../../src/types';

const MOOD_DISPLAY: Record<string, { emoji: string; label: string; color: string }> = {
  happy: { emoji: '😊', label: 'Heureux', color: colors.success },
  content: { emoji: '🙂', label: 'Content', color: colors.primary[300] },
  sleepy: { emoji: '😴', label: 'Endormi', color: colors.secondary[300] },
  hungry: { emoji: '😕', label: 'A faim', color: colors.warning },
  sad: { emoji: '😢', label: 'Triste', color: colors.error },
};

export default function PetScreen() {
  const pet = usePetStore((s) => s.pet);
  const feed = usePetStore((s) => s.feed);
  const play = usePetStore((s) => s.play);
  const tryEvolve = usePetStore((s) => s.tryEvolve);
  const addXp = usePlayerStore((s) => s.addXp);
  const todayLog = useHealthStore((s) => s.getTodayLog)();

  if (!pet) {
    return (
      <GradientBackground>
        <View style={styles.emptyContainer}>
          <Text style={{ fontSize: 64 }}>🥚</Text>
          <Text variant="h2" align="center">Pas encore de familier</Text>
          <Text variant="body" align="center" color={colors.neutral[400]}>
            Crée ton personnage pour recevoir un oeuf !
          </Text>
        </View>
      </GradientBackground>
    );
  }

  const stageInfo = PET_STAGES[pet.stage];
  const speciesInfo = PET_SPECIES_INFO[pet.species];
  const moodInfo = MOOD_DISPLAY[pet.mood];
  const nextStage = pet.stage === 'mythical' ? null : (
    ['egg', 'baby', 'juvenile', 'adult', 'mythical'] as PetStage[]
  )[((['egg', 'baby', 'juvenile', 'adult', 'mythical'] as PetStage[]).indexOf(pet.stage) + 1)];

  const growthTarget = nextStage ? EVOLUTION_THRESHOLDS[nextStage] : pet.growthPoints;
  const canFeed = !pet.fedToday && todayLog.meals.length > 0;
  const canPlay = !pet.playedToday;

  const handleFeed = () => {
    feed();
    addXp(5);
  };

  const handlePlay = () => {
    play();
    addXp(5);
  };

  const handleEvolve = () => {
    const evolved = tryEvolve();
    if (evolved) {
      addXp(100);
    }
  };

  return (
    <GradientBackground variant="morning">
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text variant="h1" style={styles.title}>Mon Familier</Text>

        {/* Pet Display */}
        <Card variant="elevated" style={styles.petCard}>
          <View style={[styles.petContainer, { ...shadows.glow(speciesInfo.color) }]}>
            <View style={[styles.petCircle, { borderColor: speciesInfo.color }]}>
              <Text style={{ fontSize: stageInfo.size * 0.8 }}>{stageInfo.emoji}</Text>
            </View>
          </View>

          <Text variant="h2" align="center" style={{ marginTop: spacing.md }}>
            {pet.name}
          </Text>

          <View style={styles.petInfoRow}>
            <Badge label={speciesInfo.name} color={speciesInfo.color} />
            <Badge label={stageInfo.name} color={colors.neutral[400]} />
          </View>

          {/* Mood */}
          <View style={[styles.moodCard, { backgroundColor: moodInfo.color + '15' }]}>
            <Text style={{ fontSize: 28 }}>{moodInfo.emoji}</Text>
            <View>
              <Text variant="label" color={moodInfo.color}>{moodInfo.label}</Text>
              <Text variant="caption" color={colors.neutral[400]}>
                Lien : {pet.bondLevel}/100
              </Text>
            </View>
          </View>
        </Card>

        {/* Growth / Evolution */}
        <Card style={styles.section}>
          <Text variant="h3">Croissance</Text>
          {pet.stage === 'egg' ? (
            <View style={styles.eggSection}>
              <Text style={{ fontSize: 40, textAlign: 'center' }}>🥚</Text>
              <Text variant="body" align="center" style={{ marginTop: spacing.sm }}>
                Ton oeuf a besoin de bonnes nuits de sommeil pour éclore !
              </Text>
              <ProgressBar
                progress={pet.sleepStreak}
                max={EGG_HATCH_SLEEP_STREAK}
                color={colors.secondary[300]}
                height={12}
                showLabel
                label="Nuits de sommeil (7h+)"
              />
              <Text variant="caption" align="center" color={colors.secondary[400]}>
                {pet.sleepStreak} / {EGG_HATCH_SLEEP_STREAK} nuits - {pet.sleepStreak >= EGG_HATCH_SLEEP_STREAK ? 'Prêt à éclore !' : `Encore ${EGG_HATCH_SLEEP_STREAK - pet.sleepStreak} nuits`}
              </Text>
              {pet.sleepStreak >= EGG_HATCH_SLEEP_STREAK && (
                <Button title="Faire éclore l'oeuf ! 🐣" onPress={handleEvolve} size="lg" />
              )}
            </View>
          ) : (
            <View style={styles.growthSection}>
              <ProgressBar
                progress={pet.growthPoints}
                max={growthTarget || 1}
                color={speciesInfo.color}
                height={12}
                showLabel
                label={nextStage ? `Vers ${PET_STAGES[nextStage].name}` : 'Stade Maximum'}
              />
              {nextStage && pet.growthPoints >= (growthTarget || Infinity) && (
                <Button title={`Évoluer en ${PET_STAGES[nextStage].name} !`} onPress={handleEvolve} size="lg" />
              )}
            </View>
          )}
        </Card>

        {/* Interactions */}
        {pet.stage !== 'egg' && (
          <Card style={styles.section}>
            <Text variant="h3">Interactions</Text>
            <View style={styles.interactionRow}>
              <TouchableOpacity
                style={[styles.interactionBtn, !canFeed && styles.interactionDisabled]}
                onPress={handleFeed}
                disabled={!canFeed}
              >
                <Text style={{ fontSize: 32 }}>🍖</Text>
                <Text variant="label" color={canFeed ? colors.accent[400] : colors.neutral[300]}>
                  Nourrir
                </Text>
                <Text variant="caption" color={colors.neutral[400]}>
                  {pet.fedToday ? '✅ Déjà nourri' : 'Enregistre un repas'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.interactionBtn, !canPlay && styles.interactionDisabled]}
                onPress={handlePlay}
                disabled={!canPlay}
              >
                <Text style={{ fontSize: 32 }}>🎾</Text>
                <Text variant="label" color={canPlay ? colors.primary[400] : colors.neutral[300]}>
                  Jouer
                </Text>
                <Text variant="caption" color={colors.neutral[400]}>
                  {pet.playedToday ? '✅ Déjà joué' : 'Jouer ensemble'}
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}

        {/* Evolution Timeline */}
        <Card style={styles.section}>
          <Text variant="h3">Évolution</Text>
          <View style={styles.timeline}>
            {(['egg', 'baby', 'juvenile', 'adult', 'mythical'] as PetStage[]).map((stage, i) => {
              const info = PET_STAGES[stage];
              const isCurrent = pet.stage === stage;
              const isPast = (['egg', 'baby', 'juvenile', 'adult', 'mythical'] as PetStage[]).indexOf(pet.stage) > i;
              return (
                <View key={stage} style={styles.timelineItem}>
                  <View
                    style={[
                      styles.timelineDot,
                      isCurrent && { backgroundColor: speciesInfo.color, borderColor: speciesInfo.color },
                      isPast && { backgroundColor: colors.primary[200], borderColor: colors.primary[200] },
                    ]}
                  >
                    <Text style={{ fontSize: isCurrent ? 18 : 14 }}>{info.emoji}</Text>
                  </View>
                  <Text
                    variant="caption"
                    color={isCurrent ? speciesInfo.color : isPast ? colors.primary[400] : colors.neutral[300]}
                  >
                    {info.name}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: spacing.lg,
    paddingTop: 60,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  title: { marginBottom: spacing.lg },
  petCard: {
    padding: spacing.xl,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  petContainer: {
    borderRadius: 70,
  },
  petCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.neutral[50],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  petInfoRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  moodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
    marginTop: spacing.md,
    width: '100%',
  },
  section: {
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  eggSection: {
    gap: spacing.md,
  },
  growthSection: {
    gap: spacing.md,
  },
  interactionRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  interactionBtn: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: colors.neutral[50],
    gap: 4,
  },
  interactionDisabled: {
    opacity: 0.5,
  },
  timeline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineItem: {
    alignItems: 'center',
    gap: 4,
  },
  timelineDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.neutral[200],
    borderWidth: 2,
    borderColor: colors.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
});
