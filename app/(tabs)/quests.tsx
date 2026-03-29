import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, ProgressBar, GradientBackground } from '../../src/components/ui';
import { colors, spacing, radii, shadows } from '../../src/theme/tokens';
import { useQuestStore } from '../../src/stores/useQuestStore';
import { usePlayerStore } from '../../src/stores/usePlayerStore';
import { useHealthStore } from '../../src/stores/useHealthStore';
import { useStatsStore } from '../../src/stores/useStatsStore';
import { isWeekend, getBossName, calculateBossHp } from '../../src/engine/boss';
import { Quest, StatType } from '../../src/types';

const STAT_COLORS: Record<StatType, string> = {
  endurance: colors.stat.endurance,
  force: colors.stat.force,
  magie: colors.stat.magie,
  vie: colors.stat.vie,
};

const QUEST_ICONS: Record<string, string> = {
  droplet: '💧',
  footprints: '👣',
  moon: '🌙',
  dumbbell: '💪',
  utensils: '🍽️',
  'book-heart': '📖',
  map: '🗺️',
  swords: '⚔️',
  sparkles: '✨',
  waves: '🌊',
  compass: '🧭',
};

function QuestCard({ quest, onClaim }: { quest: Quest; onClaim: () => void }) {
  const progress = Math.min(quest.currentProgress / quest.target, 1);
  const isComplete = quest.status === 'completed';
  const color = STAT_COLORS[quest.stat];

  return (
    <Card
      variant={isComplete ? 'outlined' : 'elevated'}
      style={[styles.questCard, isComplete && { borderColor: color, opacity: 0.8 }]}
    >
      <View style={styles.questRow}>
        <View style={[styles.questIcon, { backgroundColor: color + '20' }]}>
          <Text style={{ fontSize: 22 }}>{QUEST_ICONS[quest.icon] || '⭐'}</Text>
        </View>
        <View style={styles.questInfo}>
          <Text variant="label">{quest.title}</Text>
          <Text variant="caption" color={colors.neutral[400]} numberOfLines={1}>
            {quest.description}
          </Text>
          <ProgressBar
            progress={quest.currentProgress}
            max={quest.target}
            color={color}
            height={6}
          />
          <Text variant="caption" color={color} style={{ marginTop: 2 }}>
            {quest.currentProgress} / {quest.target} {quest.unit === 'ml' ? 'ml' : quest.unit === 'steps' ? 'pas' : quest.unit === 'hours' ? 'h' : ''}
          </Text>
        </View>
        <View style={styles.questReward}>
          {isComplete ? (
            <TouchableOpacity onPress={onClaim} style={[styles.claimBtn, { backgroundColor: color }]}>
              <Text variant="caption" color="#FFF">Récupérer</Text>
            </TouchableOpacity>
          ) : (
            <View>
              <Text variant="caption" color={colors.warning}>+{quest.rewards.xp} XP</Text>
              <Text variant="caption" color={colors.accent[300]}>+{quest.rewards.currency} 💰</Text>
            </View>
          )}
        </View>
      </View>
      <Text variant="caption" color={colors.neutral[300]} style={styles.flavorText}>
        "{quest.flavorText}"
      </Text>
    </Card>
  );
}

export default function Quests() {
  const player = usePlayerStore((s) => s.player);
  const addXp = usePlayerStore((s) => s.addXp);
  const addCurrency = usePlayerStore((s) => s.addCurrency);
  const addStatPoints = useStatsStore((s) => s.addStatPoints);
  const { quests, generateDailyQuests } = useQuestStore();

  useEffect(() => {
    if (player) {
      const weeksSinceStart = Math.floor(
        (Date.now() - new Date(player.createdAt).getTime()) / (7 * 24 * 60 * 60 * 1000),
      );
      generateDailyQuests(weeksSinceStart + 1);
    }
  }, [player]);

  const dailyQuests = quests.filter((q) => q.type === 'daily');
  const epicQuests = quests.filter((q) => q.type === 'epic');

  const claimReward = (quest: Quest) => {
    addXp(quest.rewards.xp);
    addCurrency(quest.rewards.currency);
    for (const [stat, points] of Object.entries(quest.rewards.statPoints)) {
      if (points) addStatPoints(stat as StatType, points);
    }
  };

  return (
    <GradientBackground variant="afternoon">
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text variant="h1" style={styles.title}>Tableau des Quêtes</Text>

        {/* Daily Quests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={{ fontSize: 20 }}>📜</Text>
            <Text variant="h3">Quêtes Journalières</Text>
          </View>
          {dailyQuests.length > 0 ? (
            dailyQuests.map((q) => (
              <QuestCard key={q.id} quest={q} onClaim={() => claimReward(q)} />
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Text variant="body" align="center" color={colors.neutral[400]}>
                Les quêtes du jour vont bientôt apparaître...
              </Text>
            </Card>
          )}
        </View>

        {/* Epic Quests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={{ fontSize: 20 }}>🏆</Text>
            <Text variant="h3">Quêtes Épiques</Text>
          </View>
          {epicQuests.length > 0 ? (
            epicQuests.map((q) => (
              <QuestCard key={q.id} quest={q} onClaim={() => claimReward(q)} />
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Text variant="body" align="center" color={colors.neutral[400]}>
                Complete des quêtes journalières pour débloquer des quêtes épiques !
              </Text>
            </Card>
          )}
        </View>

        {/* Boss */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={{ fontSize: 20 }}>🐉</Text>
            <Text variant="h3">Boss du Weekend</Text>
          </View>
          {isWeekend() && player ? (
            <Card variant="elevated" style={styles.bossCard}>
              <Text variant="h2" align="center" color={colors.error}>
                {getBossName(player.level)}
              </Text>
              <View style={styles.bossHpBar}>
                <Text style={{ fontSize: 40 }}>🐲</Text>
                <ProgressBar
                  progress={calculateBossHp(player.level)}
                  max={calculateBossHp(player.level)}
                  color={colors.error}
                  height={16}
                  showLabel
                  label="HP"
                />
              </View>
              <Text variant="body" align="center" color={colors.neutral[400]}>
                Fais du sport et complète tes quêtes pour infliger des dégâts !
              </Text>
            </Card>
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={{ fontSize: 40, textAlign: 'center' }}>😴</Text>
              <Text variant="body" align="center" color={colors.neutral[400]} style={{ marginTop: spacing.sm }}>
                Le prochain boss arrive ce weekend !{'\n'}
                Prépare-toi, héros.
              </Text>
            </Card>
          )}
        </View>
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
  title: {
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  questCard: {
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  questRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  questIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questInfo: {
    flex: 1,
    gap: 2,
  },
  questReward: {
    alignItems: 'flex-end',
  },
  claimBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
  },
  flavorText: {
    fontStyle: 'italic',
    marginTop: spacing.sm,
  },
  emptyCard: {
    padding: spacing.xl,
  },
  bossCard: {
    padding: spacing.lg,
    backgroundColor: '#FDF0F0',
    gap: spacing.md,
  },
  bossHpBar: {
    alignItems: 'center',
    gap: spacing.sm,
  },
});
