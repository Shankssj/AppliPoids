import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Text, Card, Button, ProgressBar, GradientBackground } from '../../src/components/ui';
import { colors, spacing, radii, typography } from '../../src/theme/tokens';
import { useHealthStore } from '../../src/stores/useHealthStore';
import { usePlayerStore } from '../../src/stores/usePlayerStore';
import { useStatsStore } from '../../src/stores/useStatsStore';
import { usePetStore } from '../../src/stores/usePetStore';
import { XP_SOURCES } from '../../src/engine/xp';
import { ExerciseType, Intensity, Rating, MealType } from '../../src/types';

const WATER_AMOUNTS = [250, 500, 750];

const EXERCISE_TYPES: { value: ExerciseType; label: string; icon: string }[] = [
  { value: 'cardio', label: 'Cardio', icon: '🏃' },
  { value: 'strength', label: 'Musculation', icon: '💪' },
  { value: 'flexibility', label: 'Yoga / Étirement', icon: '🧘' },
  { value: 'other', label: 'Autre', icon: '⚡' },
];

const MEAL_TYPES: { value: MealType; label: string; icon: string }[] = [
  { value: 'breakfast', label: 'Petit-déj', icon: '🌅' },
  { value: 'lunch', label: 'Déjeuner', icon: '☀️' },
  { value: 'dinner', label: 'Dîner', icon: '🌙' },
  { value: 'snack', label: 'Collation', icon: '🍎' },
];

export default function HealthLog() {
  const getTodayLog = useHealthStore((s) => s.getTodayLog);
  const addWater = useHealthStore((s) => s.addWater);
  const setSteps = useHealthStore((s) => s.setSteps);
  const setSleep = useHealthStore((s) => s.setSleep);
  const addMeal = useHealthStore((s) => s.addMeal);
  const addExercise = useHealthStore((s) => s.addExercise);
  const addXp = usePlayerStore((s) => s.addXp);
  const addStatPoints = useStatsStore((s) => s.addStatPoints);
  const updateSleepStreak = usePetStore((s) => s.updateSleepStreak);

  const todayLog = getTodayLog();

  const [stepsInput, setStepsInput] = useState(todayLog.steps.toString());
  const [sleepInput, setSleepInput] = useState(todayLog.sleepHours.toString());
  const [exerciseType, setExerciseType] = useState<ExerciseType>('cardio');
  const [exerciseDuration, setExerciseDuration] = useState('30');
  const [exerciseName, setExerciseName] = useState('');
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [mealDesc, setMealDesc] = useState('');
  const [mealQuality, setMealQuality] = useState<Rating>(3);

  const handleAddWater = (ml: number) => {
    addWater(ml);
    addXp(XP_SOURCES.LOG_WATER_250ML);
    addStatPoints('vie', 0.5);
  };

  const handleSaveSteps = () => {
    const steps = parseInt(stepsInput) || 0;
    setSteps(steps);
    addStatPoints('endurance', (steps / 1000) * 0.5);
  };

  const handleSaveSleep = () => {
    const hours = parseFloat(sleepInput) || 0;
    setSleep(hours, 3);
    if (hours >= 7) {
      addStatPoints('magie', 3);
      updateSleepStreak(true);
    } else {
      updateSleepStreak(false);
    }
    addXp(10);
  };

  const handleAddExercise = () => {
    const duration = parseInt(exerciseDuration) || 30;
    addExercise({
      id: Date.now().toString(),
      type: exerciseType,
      name: exerciseName || EXERCISE_TYPES.find((e) => e.value === exerciseType)?.label || 'Exercice',
      durationMinutes: duration,
      intensity: duration > 45 ? 'intense' : duration > 20 ? 'moderate' : 'light',
      caloriesEstimate: Math.floor(duration * 7),
    });
    addXp(XP_SOURCES.LOG_EXERCISE);
    addStatPoints(exerciseType === 'cardio' ? 'endurance' : exerciseType === 'strength' ? 'force' : 'magie', 2);
    setExerciseName('');
    setExerciseDuration('30');
  };

  const handleAddMeal = () => {
    addMeal({
      id: Date.now().toString(),
      time: new Date().toTimeString().slice(0, 5),
      type: mealType,
      description: mealDesc || mealType,
      quality: mealQuality,
    });
    addXp(XP_SOURCES.LOG_MEAL);
    if (mealQuality >= 3) addStatPoints('vie', 1);
    setMealDesc('');
    setMealQuality(3);
  };

  return (
    <GradientBackground variant="morning">
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text variant="h1" style={styles.title}>Journal de Santé</Text>

        {/* Water */}
        <Card variant="elevated" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={{ fontSize: 24 }}>💧</Text>
            <Text variant="h3">Hydratation</Text>
            <Text variant="label" color={colors.secondary[400]}>{todayLog.water}ml</Text>
          </View>
          <ProgressBar progress={todayLog.water} max={1500} color={colors.secondary[300]} height={10} />
          <View style={styles.waterBtns}>
            {WATER_AMOUNTS.map((ml) => (
              <TouchableOpacity
                key={ml}
                style={styles.waterBtn}
                onPress={() => handleAddWater(ml)}
              >
                <Text variant="label" color={colors.secondary[400]}>+{ml}ml</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Steps */}
        <Card variant="elevated" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={{ fontSize: 24 }}>👣</Text>
            <Text variant="h3">Pas</Text>
          </View>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.numberInput}
              keyboardType="numeric"
              value={stepsInput}
              onChangeText={setStepsInput}
              placeholder="0"
              placeholderTextColor={colors.neutral[300]}
            />
            <Text variant="body" color={colors.neutral[400]}> pas</Text>
            <Button title="Enregistrer" onPress={handleSaveSteps} size="sm" />
          </View>
          <ProgressBar progress={todayLog.steps} max={8000} color={colors.primary[300]} height={8} />
          <Text variant="caption" color={colors.primary[400]} style={{ marginTop: 4 }}>
            +{((todayLog.steps / 1000) * 0.5).toFixed(1)} Endurance
          </Text>
        </Card>

        {/* Sleep */}
        <Card variant="elevated" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={{ fontSize: 24 }}>🌙</Text>
            <Text variant="h3">Sommeil</Text>
          </View>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.numberInput}
              keyboardType="decimal-pad"
              value={sleepInput}
              onChangeText={setSleepInput}
              placeholder="0"
              placeholderTextColor={colors.neutral[300]}
            />
            <Text variant="body" color={colors.neutral[400]}> heures</Text>
            <Button title="Enregistrer" onPress={handleSaveSleep} size="sm" />
          </View>
          <ProgressBar progress={todayLog.sleepHours} max={8} color={colors.life[300]} height={8} />
          <Text variant="caption" color={colors.life[400]} style={{ marginTop: 4 }}>
            7h+ de sommeil = +3 Magie + progression familier 🥚
          </Text>
        </Card>

        {/* Exercise */}
        <Card variant="elevated" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={{ fontSize: 24 }}>🏋️</Text>
            <Text variant="h3">Exercice</Text>
            <Text variant="caption" color={colors.neutral[400]}>
              {todayLog.exercises.length} séance{todayLog.exercises.length > 1 ? 's' : ''}
            </Text>
          </View>
          <View style={styles.chipRow}>
            {EXERCISE_TYPES.map((e) => (
              <TouchableOpacity
                key={e.value}
                style={[styles.chip, exerciseType === e.value && styles.chipActive]}
                onPress={() => setExerciseType(e.value)}
              >
                <Text style={{ fontSize: 16 }}>{e.icon}</Text>
                <Text
                  variant="caption"
                  color={exerciseType === e.value ? '#FFF' : colors.neutral[500]}
                >
                  {e.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="Nom de l'exercice (optionnel)"
            placeholderTextColor={colors.neutral[300]}
            value={exerciseName}
            onChangeText={setExerciseName}
          />
          <View style={styles.inputRow}>
            <TextInput
              style={styles.numberInput}
              keyboardType="numeric"
              value={exerciseDuration}
              onChangeText={setExerciseDuration}
              placeholder="30"
              placeholderTextColor={colors.neutral[300]}
            />
            <Text variant="body" color={colors.neutral[400]}> min</Text>
            <Button title="Ajouter" onPress={handleAddExercise} size="sm" />
          </View>
          {todayLog.exercises.map((e, i) => (
            <View key={i} style={styles.logItem}>
              <Text variant="caption">
                {EXERCISE_TYPES.find((t) => t.value === e.type)?.icon} {e.name} - {e.durationMinutes}min
              </Text>
            </View>
          ))}
        </Card>

        {/* Meals */}
        <Card variant="elevated" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={{ fontSize: 24 }}>🍽️</Text>
            <Text variant="h3">Repas</Text>
            <Text variant="caption" color={colors.neutral[400]}>
              {todayLog.meals.length} repas
            </Text>
          </View>
          <View style={styles.chipRow}>
            {MEAL_TYPES.map((m) => (
              <TouchableOpacity
                key={m.value}
                style={[styles.chip, mealType === m.value && styles.chipActive]}
                onPress={() => setMealType(m.value)}
              >
                <Text style={{ fontSize: 14 }}>{m.icon}</Text>
                <Text
                  variant="caption"
                  color={mealType === m.value ? '#FFF' : colors.neutral[500]}
                >
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="Qu'as-tu mangé ?"
            placeholderTextColor={colors.neutral[300]}
            value={mealDesc}
            onChangeText={setMealDesc}
          />
          <View style={styles.qualityRow}>
            <Text variant="caption">Qualité :</Text>
            {([1, 2, 3, 4, 5] as Rating[]).map((q) => (
              <TouchableOpacity
                key={q}
                style={[styles.qualityBtn, mealQuality === q && styles.qualityBtnActive]}
                onPress={() => setMealQuality(q)}
              >
                <Text style={{ fontSize: 18 }}>
                  {q === 1 ? '😞' : q === 2 ? '😕' : q === 3 ? '😐' : q === 4 ? '🙂' : '😊'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Button title="Ajouter le repas" onPress={handleAddMeal} size="sm" variant="secondary" />
          {todayLog.meals.map((m, i) => (
            <View key={i} style={styles.logItem}>
              <Text variant="caption">
                {MEAL_TYPES.find((t) => t.value === m.type)?.icon} {m.description} ({['😞', '😕', '😐', '🙂', '😊'][m.quality - 1]})
              </Text>
            </View>
          ))}
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
  section: {
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  numberInput: {
    backgroundColor: colors.neutral[50],
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: colors.neutral[600],
    borderWidth: 1,
    borderColor: colors.neutral[200],
    width: 80,
    textAlign: 'center',
  },
  textInput: {
    backgroundColor: colors.neutral[50],
    borderRadius: radii.md,
    padding: spacing.md,
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: colors.neutral[600],
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  waterBtns: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  waterBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: colors.secondary[50],
    borderWidth: 1,
    borderColor: colors.secondary[200],
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
    backgroundColor: colors.neutral[100],
  },
  chipActive: {
    backgroundColor: colors.primary[300],
  },
  qualityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  qualityBtn: {
    padding: 4,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  qualityBtnActive: {
    borderColor: colors.primary[300],
    backgroundColor: colors.primary[50],
  },
  logItem: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.neutral[50],
    borderRadius: radii.sm,
  },
});
