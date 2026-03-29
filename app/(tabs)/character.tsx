import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, ProgressBar, GradientBackground, StatBar, Badge } from '../../src/components/ui';
import { colors, spacing, radii, shadows } from '../../src/theme/tokens';
import { usePlayerStore } from '../../src/stores/usePlayerStore';
import { useStatsStore } from '../../src/stores/useStatsStore';
import { useShopStore } from '../../src/stores/useShopStore';
import { xpForLevel } from '../../src/engine/xp';
import { computeAuraColor } from '../../src/engine/stats';
import { StatType } from '../../src/types';

export default function Character() {
  const player = usePlayerStore((s) => s.player);
  const stats = useStatsStore((s) => s.stats);
  const equippedItems = useShopStore((s) => s.equippedItems);

  if (!player) return null;

  const auraColor = computeAuraColor(stats);
  const xpNeeded = xpForLevel(player.level);
  const totalStats = stats.endurance + stats.force + stats.magie + stats.vie;

  return (
    <GradientBackground variant="evening">
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text variant="h1" style={styles.title}>Fiche du Héros</Text>

        {/* Avatar Display */}
        <Card variant="elevated" style={styles.avatarCard}>
          <View style={styles.avatarContainer}>
            <View style={[styles.auraRing, { borderColor: auraColor, ...shadows.glow(auraColor) }]}>
              <View style={styles.avatarInner}>
                <Text style={{ fontSize: 64 }}>
                  {player.avatar.gender === 'feminine' ? '👩' : player.avatar.gender === 'masculine' ? '🧑' : '🧝'}
                </Text>
              </View>
            </View>
            <Text variant="h2" align="center" style={{ marginTop: spacing.md }}>{player.name}</Text>
            <View style={styles.levelRow}>
              <Badge label={`Niveau ${player.level}`} color={colors.primary[400]} />
              <Badge label={`${player.currency} 💰`} color={colors.warning} />
            </View>
          </View>

          <View style={styles.xpSection}>
            <ProgressBar
              progress={player.currentLevelXp}
              max={xpNeeded}
              color={colors.primary[300]}
              height={10}
              showLabel
              label="Expérience"
            />
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text variant="h3" color={colors.warning}>{player.currentStreak}</Text>
              <Text variant="caption">Jours de suite</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoItem}>
              <Text variant="h3" color={colors.primary[400]}>{player.totalXp}</Text>
              <Text variant="caption">XP Total</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoItem}>
              <Text variant="h3" color={colors.secondary[400]}>{Math.round(totalStats)}</Text>
              <Text variant="caption">Stats Total</Text>
            </View>
          </View>
        </Card>

        {/* Stats Radar (simplified) */}
        <Text variant="h3" style={styles.sectionTitle}>Statistiques</Text>
        <Card style={styles.statsCard}>
          {(['endurance', 'force', 'magie', 'vie'] as StatType[]).map((stat) => (
            <StatBar key={stat} stat={stat} value={stats[stat]} />
          ))}
          <View style={styles.auraInfo}>
            <View style={[styles.auraDot, { backgroundColor: auraColor }]} />
            <Text variant="caption">
              Aura : {
                stats.endurance >= stats.force && stats.endurance >= stats.magie && stats.endurance >= stats.vie
                  ? 'Endurance'
                  : stats.force >= stats.magie && stats.force >= stats.vie
                    ? 'Force'
                    : stats.magie >= stats.vie
                      ? 'Magie'
                      : 'Vie'
              }
            </Text>
          </View>
        </Card>

        {/* Equipment */}
        <Text variant="h3" style={styles.sectionTitle}>Équipement</Text>
        <Card style={styles.equipCard}>
          {[
            { slot: 'outfit', label: 'Tenue', icon: '👕', default: 'Tunique de Départ' },
            { slot: 'accessory', label: 'Accessoire', icon: '💎', default: 'Aucun' },
            { slot: 'aura', label: 'Aura', icon: '✨', default: 'Aura Naturelle' },
          ].map((item) => (
            <View key={item.slot} style={styles.equipRow}>
              <Text style={{ fontSize: 24 }}>{item.icon}</Text>
              <View style={styles.equipInfo}>
                <Text variant="caption" color={colors.neutral[400]}>{item.label}</Text>
                <Text variant="label">{equippedItems[item.slot] || item.default}</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Achievements preview */}
        <Text variant="h3" style={styles.sectionTitle}>Accomplissements</Text>
        <Card style={styles.achieveCard}>
          <View style={styles.achieveGrid}>
            {[
              { icon: '🌱', label: 'Premier Pas', done: player.totalXp > 0 },
              { icon: '💧', label: 'Hydraté', done: false },
              { icon: '🔥', label: '7 jours', done: player.longestStreak >= 7 },
              { icon: '⚔️', label: 'Niveau 5', done: player.level >= 5 },
              { icon: '🐣', label: 'Éclosion', done: false },
              { icon: '🏆', label: 'Boss Vaincu', done: false },
            ].map((a, i) => (
              <View key={i} style={[styles.achieveItem, !a.done && styles.achieveLocked]}>
                <Text style={{ fontSize: 28, opacity: a.done ? 1 : 0.3 }}>{a.icon}</Text>
                <Text variant="caption" color={a.done ? colors.neutral[600] : colors.neutral[300]}>
                  {a.label}
                </Text>
              </View>
            ))}
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
  title: { marginBottom: spacing.lg },
  avatarCard: {
    padding: spacing.xl,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
  },
  auraRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.neutral[50],
  },
  avatarInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  xpSection: {
    width: '100%',
    marginTop: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  infoItem: {
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: colors.neutral[200],
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  statsCard: {
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  auraInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  auraDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  equipCard: {
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  equipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  equipInfo: {
    flex: 1,
  },
  achieveCard: {
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  achieveGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
  },
  achieveItem: {
    width: '28%',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: colors.neutral[50],
    gap: 4,
  },
  achieveLocked: {
    backgroundColor: colors.neutral[100],
  },
});
