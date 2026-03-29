import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Text, Card, Button } from '../src/components/ui';
import { colors, spacing, radii, typography } from '../src/theme/tokens';
import { useHealthStore } from '../src/stores/useHealthStore';
import { usePlayerStore } from '../src/stores/usePlayerStore';
import { XP_SOURCES } from '../src/engine/xp';
import { Rating } from '../src/types';

const MOOD_FACES: { value: Rating; emoji: string; label: string }[] = [
  { value: 1, emoji: '😢', label: 'Terrible' },
  { value: 2, emoji: '😕', label: 'Pas top' },
  { value: 3, emoji: '😐', label: 'Ça va' },
  { value: 4, emoji: '🙂', label: 'Bien' },
  { value: 5, emoji: '😊', label: 'Super' },
];

const ENERGY_LEVELS: { value: Rating; label: string }[] = [
  { value: 1, label: 'Épuisé' },
  { value: 2, label: 'Fatigué' },
  { value: 3, label: 'Normal' },
  { value: 4, label: 'Énergique' },
  { value: 5, label: 'Au top !' },
];

const TAGS = [
  'Motivé', 'Anxieux', 'Serein', 'Fatigué', 'Heureux',
  'Stressé', 'Créatif', 'Mélancolique', 'Reconnaissant', 'Confiant',
];

export default function MoodJournal() {
  const [mood, setMood] = useState<Rating>(3);
  const [energy, setEnergy] = useState<Rating>(3);
  const [stress, setStress] = useState<Rating>(1);
  const [journal, setJournal] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showBreathing, setShowBreathing] = useState(false);
  const [breathCount, setBreathCount] = useState(0);
  const [saved, setSaved] = useState(false);

  const setMoodEntry = useHealthStore((s) => s.setMood);
  const addXp = usePlayerStore((s) => s.addXp);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSave = () => {
    setMoodEntry({
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      mood,
      energy,
      stress,
      journalText: journal || undefined,
      tags: selectedTags,
      timestamp: new Date().toISOString(),
    });
    addXp(XP_SOURCES.MOOD_JOURNAL);
    setSaved(true);
    setTimeout(() => router.back(), 1500);
  };

  if (saved) {
    return (
      <View style={styles.savedContainer}>
        <Text style={{ fontSize: 64 }}>✨</Text>
        <Text variant="h2" align="center">Journal enregistré !</Text>
        <Text variant="h3" color={colors.primary[400]}>+{XP_SOURCES.MOOD_JOURNAL} XP</Text>
        <Text variant="body" align="center" color={colors.neutral[400]}>
          Se connaître soi-même est la première quête.
        </Text>
      </View>
    );
  }

  if (showBreathing) {
    return (
      <View style={styles.breathingContainer}>
        <Text variant="h2" align="center">Respiration Guidée</Text>
        <Text variant="body" align="center" color={colors.neutral[400]} style={{ marginTop: spacing.sm }}>
          Inspire... Expire... Laisse le stress s'envoler.
        </Text>
        <View style={styles.breathCircle}>
          <Text style={{ fontSize: 48 }}>🌬️</Text>
          <Text variant="h1" color={colors.secondary[400]}>{breathCount}/6</Text>
        </View>
        <Text variant="body" align="center" color={colors.secondary[400]}>
          {breathCount % 2 === 0 ? 'Inspire profondément...' : 'Expire lentement...'}
        </Text>
        <Button
          title={breathCount >= 6 ? 'Terminé !' : 'Suivant'}
          onPress={() => {
            if (breathCount >= 6) {
              setShowBreathing(false);
              setStress(Math.max(1, stress - 1) as Rating);
            } else {
              setBreathCount(breathCount + 1);
            }
          }}
          size="lg"
        />
        <Button
          title="Passer"
          onPress={() => setShowBreathing(false)}
          variant="ghost"
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text variant="h3" color={colors.neutral[400]}>✕</Text>
        </TouchableOpacity>
        <Text variant="h2">Journal d'Humeur</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Mood */}
      <Card style={styles.section}>
        <Text variant="h3">Comment te sens-tu ?</Text>
        <View style={styles.faceRow}>
          {MOOD_FACES.map((f) => (
            <TouchableOpacity
              key={f.value}
              style={[styles.faceBtn, mood === f.value && styles.faceBtnActive]}
              onPress={() => setMood(f.value)}
            >
              <Text style={{ fontSize: 32 }}>{f.emoji}</Text>
              <Text variant="caption" color={mood === f.value ? colors.primary[400] : colors.neutral[400]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Energy */}
      <Card style={styles.section}>
        <Text variant="h3">Ton énergie</Text>
        <View style={styles.sliderRow}>
          {ENERGY_LEVELS.map((e) => (
            <TouchableOpacity
              key={e.value}
              style={[
                styles.sliderBtn,
                energy === e.value && { backgroundColor: colors.primary[300] },
              ]}
              onPress={() => setEnergy(e.value)}
            >
              <Text variant="caption" color={energy === e.value ? '#FFF' : colors.neutral[500]}>
                {e.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Stress */}
      <Card style={styles.section}>
        <Text variant="h3">Niveau de stress</Text>
        <View style={styles.sliderRow}>
          {([1, 2, 3, 4, 5] as Rating[]).map((s) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.sliderBtn,
                stress === s && { backgroundColor: s >= 4 ? colors.error : colors.secondary[300] },
              ]}
              onPress={() => {
                setStress(s);
                if (s >= 4) setShowBreathing(true);
              }}
            >
              <Text variant="caption" color={stress === s ? '#FFF' : colors.neutral[500]}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {stress >= 4 && (
          <TouchableOpacity
            style={styles.breathingPrompt}
            onPress={() => setShowBreathing(true)}
          >
            <Text style={{ fontSize: 16 }}>🌬️</Text>
            <Text variant="caption" color={colors.secondary[400]}>
              Tu sembles stressé. Essaye un exercice de respiration !
            </Text>
          </TouchableOpacity>
        )}
      </Card>

      {/* Tags */}
      <Card style={styles.section}>
        <Text variant="h3">Tags</Text>
        <View style={styles.tagRow}>
          {TAGS.map((tag) => {
            const selected = selectedTags.includes(tag);
            return (
              <TouchableOpacity
                key={tag}
                style={[styles.tag, selected && styles.tagActive]}
                onPress={() => toggleTag(tag)}
              >
                <Text variant="caption" color={selected ? '#FFF' : colors.neutral[500]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      {/* Journal */}
      <Card style={styles.section}>
        <Text variant="h3">Notes (optionnel)</Text>
        <TextInput
          style={styles.journalInput}
          multiline
          numberOfLines={4}
          placeholder="Raconte ta journée..."
          placeholderTextColor={colors.neutral[300]}
          value={journal}
          onChangeText={setJournal}
          textAlignVertical="top"
        />
      </Card>

      <Button title="Enregistrer" onPress={handleSave} size="lg" />
      <View style={{ height: spacing.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  section: {
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  faceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  faceBtn: {
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: 'transparent',
    flex: 1,
  },
  faceBtnActive: {
    borderColor: colors.primary[300],
    backgroundColor: colors.primary[50],
  },
  sliderRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  sliderBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: colors.neutral[100],
  },
  breathingPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.secondary[50],
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
    backgroundColor: colors.neutral[100],
  },
  tagActive: {
    backgroundColor: colors.primary[300],
  },
  journalInput: {
    backgroundColor: colors.neutral[50],
    borderRadius: radii.md,
    padding: spacing.md,
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: colors.neutral[600],
    borderWidth: 1,
    borderColor: colors.neutral[200],
    minHeight: 100,
  },
  savedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.neutral[50],
    gap: spacing.md,
    padding: spacing.xl,
  },
  breathingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary[50],
    gap: spacing.xl,
    padding: spacing.xl,
  },
  breathCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.secondary[100],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.secondary[300],
  },
});
