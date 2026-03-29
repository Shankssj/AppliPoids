import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Text, Card, ProgressBar, GradientBackground, StatBar } from '../../src/components/ui';
import { colors, spacing, radii, shadows } from '../../src/theme/tokens';
import { usePlayerStore } from '../../src/stores/usePlayerStore';
import { useStatsStore } from '../../src/stores/useStatsStore';
import { useHealthStore } from '../../src/stores/useHealthStore';
import { useQuestStore } from '../../src/stores/useQuestStore';
import { usePetStore } from '../../src/stores/usePetStore';
import { xpForLevel } from '../../src/engine/xp';
import { getMentorAdvice } from '../../src/engine/mentor';
import { StatType } from '../../src/types';

export default function Home() {
  const player = usePlayerStore((s) => s.player);
  const stats = useStatsStore((s) => s.stats);
  const getTodayLog = useHealthStore((s) => s.getTodayLog);
  const addWater = useHealthStore((s) => s.addWater);
  const addXp = usePlayerStore((s) => s.addXp);
  const quests = useQuestStore((s) => s.quests);
  const pet = usePetStore((s) => s.pet);

  const todayLog = getTodayLog();
  const completedToday = quests.filter((q) => q.status === 'completed').length;
  const totalToday = quests.filter((q) => q.type === 'daily').length || 1;

  const mentorAdvice = useMemo(
    () => getMentorAdvice(stats, todayLog, player?.currentStreak || 0),
    [stats, todayLog?.water, todayLog?.steps, player?.currentStreak],
  );

  if (!player) return null;

  const xpNeeded = xpForLevel(player.level);

  return (
    <GradientBackground>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text variant="caption" color={colors.neutral[400]}>Bienvenue,</Text>
            <Text variant="h2">{player.name}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/settings')} style={styles.settingsBtn}>
            <Text style={{ fontSize: 22 }}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar + Level */}
        <Card variant="elevated" style={styles.avatarCard}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatarCircle, { ...shadows.glow(stats.endurance >= stats.force && stats.endurance >= stats.magie && stats.endurance >= stats.vie ? colors.stat.endurance : colors.primary[300]) }]}>
                <Text style={{ fontSize: 48 }}>
                  {player.avatar.gender === 'feminine' ? '👩' : player.avatar.gender === 'masculine' ? '🧑' : '🧝'}
                </Text>
              </View>
              {pet && (
                <View style={styles.petMini}>
                  <Text style={{ fontSize: 20 }}>{pet.stage === 'egg' ? '🥚' : '🐾'}</Text>
                </View>
              )}
            </View>
            <View style={styles.levelInfo}>
              <View style={styles.levelBadge}>
                <Text variant="caption" color="#FFF">Niv. {player.level}</Text>
              </View>
              <ProgressBar
                progress={player.currentLevelXp}
                max={xpNeeded}
                color={colors.primary[300]}
                height={8}
              />
              <Text variant="caption" style={{ marginTop: 2 }}>
                {player.currentLevelXp} / {xpNeeded} XP
              </Text>
            </View>
          </View>
          {player.currentStreak > 0 && (
            <View style={styles.streakBanner}>
              <Text variant="caption" color={colors.warning}>
                🔥 {player.currentStreak} jour{player.currentStreak > 1 ? 's' : ''} de suite !
              </Text>
            </View>
          )}
        </Card>

        {/* Mentor */}
        <Card style={styles.mentorCard}>
          <View style={styles.mentorRow}>
            <View style={styles.mentorAvatar}>
              <Text style={{ fontSize: 28 }}>🧙</Text>
            </View>
            <View style={styles.mentorBubble}>
              <Text variant="caption" color={colors.secondary[400]}>
                {mentorAdvice.greeting}
              </Text>
              <Text variant="body" style={{ marginTop: 4 }}>
                {mentorAdvice.tip}
              </Text>
            </View>
          </View>
        </Card>

        {/* Stats */}
        <Text variant="h3" style={styles.sectionTitle}>Tes Stats</Text>
        <Card style={styles.statsCard}>
          <View style={styles.statsGrid}>
            {(['endurance', 'force', 'magie', 'vie'] as StatType[]).map((stat) => (
              <View key={stat} style={styles.statItem}>
                <StatBar stat={stat} value={stats[stat]} />
              </View>
            ))}
          </View>
        </Card>

        {/* Today's Progress */}
        <Text variant="h3" style={styles.sectionTitle}>Aujourd'hui</Text>
        <View style={styles.progressGrid}>
          <Card variant="elevated" style={styles.progressCard}>
            <Text style={{ fontSize: 28 }}>💧</Text>
            <Text variant="h3" color={colors.secondary[400]}>{todayLog.water}ml</Text>
            <Text variant="caption">/ 1500ml</Text>
            <ProgressBar progress={todayLog.water} max={1500} color={colors.secondary[300]} height={6} />
          </Card>
          <Card variant="elevated" style={styles.progressCard}>
            <Text style={{ fontSize: 28 }}>👣</Text>
            <Text variant="h3" color={colors.primary[400]}>{todayLog.steps}</Text>
            <Text variant="caption">/ 8000 pas</Text>
            <ProgressBar progress={todayLog.steps} max={8000} color={colors.primary[300]} height={6} />
          </Card>
          <Card variant="elevated" style={styles.progressCard}>
            <Text style={{ fontSize: 28 }}>🌙</Text>
            <Text variant="h3" color={colors.life[400]}>{todayLog.sleepHours}h</Text>
            <Text variant="caption">/ 8h sommeil</Text>
            <ProgressBar progress={todayLog.sleepHours} max={8} color={colors.life[300]} height={6} />
          </Card>
          <Card variant="elevated" style={styles.progressCard}>
            <Text style={{ fontSize: 28 }}>⚔️</Text>
            <Text variant="h3" color={colors.accent[400]}>{completedToday}</Text>
            <Text variant="caption">/ {totalToday} quêtes</Text>
            <ProgressBar progress={completedToday} max={totalToday} color={colors.accent[300]} height={6} />
          </Card>
        </View>

        {/* Quick Actions */}
        <Text variant="h3" style={styles.sectionTitle}>Actions Rapides</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: colors.secondary[50] }]}
            onPress={() => {
              addWater(250);
              addXp(5);
            }}
          >
            <Text style={{ fontSize: 22 }}>💧</Text>
            <Text variant="label" color={colors.secondary[400]}>+250ml</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: colors.primary[50] }]}
            onPress={() => router.push('/(tabs)/log')}
          >
            <Text style={{ fontSize: 22 }}>🏃</Text>
            <Text variant="label" color={colors.primary[400]}>Exercice</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: colors.life[50] }]}
            onPress={() => router.push('/mood-journal')}
          >
            <Text style={{ fontSize: 22 }}>😊</Text>
            <Text variant="label" color={colors.life[400]}>Humeur</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: colors.accent[50] }]}
            onPress={() => router.push('/shop')}
          >
            <Text style={{ fontSize: 22 }}>🛍️</Text>
            <Text variant="label" color={colors.accent[400]}>Boutique</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.neutral[0] + 'CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarCard: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary[200],
  },
  petMini: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.neutral[0],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
  },
  levelInfo: {
    flex: 1,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary[400],
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.full,
    marginBottom: spacing.xs,
  },
  streakBanner: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
    alignItems: 'center',
  },
  mentorCard: {
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  mentorRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  mentorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  mentorBubble: {
    flex: 1,
    backgroundColor: colors.neutral[50],
    padding: spacing.md,
    borderRadius: radii.md,
    borderTopLeftRadius: 4,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  statsCard: {
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  statsGrid: {
    gap: spacing.xs,
  },
  statItem: {
    flex: 1,
  },
  progressGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  progressCard: {
    width: '48%',
    flexGrow: 1,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  quickBtn: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.lg,
    gap: 4,
  },
});
