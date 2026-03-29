import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Button, Card } from '../../src/components/ui';
import { colors, spacing, radii, typography } from '../../src/theme/tokens';
import { usePlayerStore } from '../../src/stores/usePlayerStore';
import { usePetStore } from '../../src/stores/usePetStore';
import {
  AvatarGender,
  AvatarSkinTone,
  AvatarHairStyle,
  AvatarConfig,
  PetSpecies,
} from '../../src/types';

const GENDERS: { value: AvatarGender; label: string; icon: string }[] = [
  { value: 'masculine', label: 'Masculin', icon: '🧑' },
  { value: 'feminine', label: 'Féminin', icon: '👩' },
  { value: 'neutral', label: 'Neutre', icon: '🧝' },
];

const SKIN_TONES: { value: AvatarSkinTone; color: string }[] = [
  { value: 'light', color: '#FDEBD0' },
  { value: 'medium', color: '#E8C9A0' },
  { value: 'tan', color: '#C8A882' },
  { value: 'dark', color: '#A0785A' },
  { value: 'deep', color: '#6B4432' },
];

const HAIR_STYLES: { value: AvatarHairStyle; label: string }[] = [
  { value: 'short', label: 'Court' },
  { value: 'medium', label: 'Mi-long' },
  { value: 'long', label: 'Long' },
  { value: 'curly', label: 'Bouclé' },
  { value: 'braided', label: 'Tressé' },
  { value: 'bun', label: 'Chignon' },
];

const HAIR_COLORS = ['#2C1810', '#5A3825', '#8B6F47', '#C4A265', '#E8C980', '#D45B2C', '#1A1A2E'];
const EYE_COLORS = ['#4A3728', '#6B8E5A', '#5B7DB1', '#7A6BBF', '#3A3A3A'];

const PET_SPECIES: { value: PetSpecies; name: string; icon: string; color: string }[] = [
  { value: 'forest_spirit', name: 'Esprit de la Forêt', icon: '🌿', color: colors.primary[300] },
  { value: 'water_sprite', name: 'Sprite des Eaux', icon: '💧', color: colors.secondary[300] },
  { value: 'fire_fox', name: 'Renard de Flamme', icon: '🔥', color: colors.accent[300] },
  { value: 'wind_bird', name: 'Oiseau du Vent', icon: '🌬️', color: '#B89FD6' },
];

const GOALS = [
  { id: 'water', label: 'Boire plus d\'eau', icon: '💧' },
  { id: 'move', label: 'Bouger plus', icon: '🏃' },
  { id: 'sleep', label: 'Mieux dormir', icon: '🌙' },
  { id: 'eat', label: 'Manger équilibré', icon: '🥗' },
  { id: 'stress', label: 'Réduire le stress', icon: '🧘' },
];

export default function CharacterCreate() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<AvatarGender>('neutral');
  const [skinTone, setSkinTone] = useState<AvatarSkinTone>('medium');
  const [hairStyle, setHairStyle] = useState<AvatarHairStyle>('medium');
  const [hairColor, setHairColor] = useState(HAIR_COLORS[0]);
  const [eyeColor, setEyeColor] = useState(EYE_COLORS[0]);
  const [petSpecies, setPetSpecies] = useState<PetSpecies>('forest_spirit');
  const [petName, setPetName] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const createPlayer = usePlayerStore((s) => s.createPlayer);
  const createPet = usePetStore((s) => s.createPet);

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );
  };

  const handleFinish = () => {
    const avatar: AvatarConfig = {
      gender,
      skinTone,
      hairStyle,
      hairColor,
      eyeColor,
      outfit: 'outfit_forest',
      accessory: null,
      auraColor: '#FFD700',
    };
    createPlayer(name || 'Aventurier', avatar, selectedGoals);
    createPet(petName || 'Mon Familier', petSpecies);
    router.replace('/(tabs)/home');
  };

  const getAvatarPreview = () => {
    const genderEmoji = GENDERS.find((g) => g.value === gender)?.icon || '🧝';
    return (
      <View style={styles.avatarPreview}>
        <View style={[styles.avatarCircle, { borderColor: colors.primary[300] }]}>
          <Text style={{ fontSize: 56 }}>{genderEmoji}</Text>
        </View>
        {name ? (
          <Text variant="h3" align="center" style={{ marginTop: spacing.sm }}>
            {name}
          </Text>
        ) : null}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[colors.neutral[50], colors.primary[50]]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.stepIndicator}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[
                styles.stepDot,
                i === step && styles.stepDotActive,
                i < step && styles.stepDotDone,
              ]}
            />
          ))}
        </View>

        {step === 0 && (
          <View style={styles.stepContent}>
            <Text variant="h1" align="center">Crée ton Héros</Text>
            <Text variant="body" align="center" style={{ marginTop: spacing.sm, marginBottom: spacing.lg }}>
              Choisis l'apparence de ton avatar
            </Text>

            {getAvatarPreview()}

            <Card style={styles.section}>
              <Text variant="label" style={styles.sectionTitle}>Nom du héros</Text>
              <TextInput
                style={styles.input}
                placeholder="Entrez votre nom..."
                placeholderTextColor={colors.neutral[300]}
                value={name}
                onChangeText={setName}
              />
            </Card>

            <Card style={styles.section}>
              <Text variant="label" style={styles.sectionTitle}>Apparence</Text>
              <View style={styles.optionRow}>
                {GENDERS.map((g) => (
                  <TouchableOpacity
                    key={g.value}
                    style={[styles.optionBtn, gender === g.value && styles.optionBtnActive]}
                    onPress={() => setGender(g.value)}
                  >
                    <Text style={{ fontSize: 24 }}>{g.icon}</Text>
                    <Text variant="caption" style={{ marginTop: 4 }}>{g.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>

            <Card style={styles.section}>
              <Text variant="label" style={styles.sectionTitle}>Teint</Text>
              <View style={styles.colorRow}>
                {SKIN_TONES.map((s) => (
                  <TouchableOpacity
                    key={s.value}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: s.color },
                      skinTone === s.value && styles.colorCircleActive,
                    ]}
                    onPress={() => setSkinTone(s.value)}
                  />
                ))}
              </View>
            </Card>

            <Card style={styles.section}>
              <Text variant="label" style={styles.sectionTitle}>Coiffure</Text>
              <View style={styles.chipRow}>
                {HAIR_STYLES.map((h) => (
                  <TouchableOpacity
                    key={h.value}
                    style={[styles.chip, hairStyle === h.value && styles.chipActive]}
                    onPress={() => setHairStyle(h.value)}
                  >
                    <Text
                      variant="caption"
                      color={hairStyle === h.value ? '#FFF' : colors.neutral[500]}
                    >
                      {h.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>

            <Card style={styles.section}>
              <Text variant="label" style={styles.sectionTitle}>Couleur des cheveux</Text>
              <View style={styles.colorRow}>
                {HAIR_COLORS.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: c },
                      hairColor === c && styles.colorCircleActive,
                    ]}
                    onPress={() => setHairColor(c)}
                  />
                ))}
              </View>
            </Card>

            <Card style={styles.section}>
              <Text variant="label" style={styles.sectionTitle}>Couleur des yeux</Text>
              <View style={styles.colorRow}>
                {EYE_COLORS.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: c },
                      eyeColor === c && styles.colorCircleActive,
                    ]}
                    onPress={() => setEyeColor(c)}
                  />
                ))}
              </View>
            </Card>

            <Button title="Suivant" onPress={() => setStep(1)} size="lg" />
          </View>
        )}

        {step === 1 && (
          <View style={styles.stepContent}>
            <Text variant="h1" align="center">Choisis ton Familier</Text>
            <Text variant="body" align="center" style={{ marginTop: spacing.sm, marginBottom: spacing.lg }}>
              Un compagnon t'accompagnera dans ton aventure
            </Text>

            <View style={styles.petGrid}>
              {PET_SPECIES.map((p) => (
                <TouchableOpacity
                  key={p.value}
                  style={[
                    styles.petCard,
                    petSpecies === p.value && { borderColor: p.color, borderWidth: 2.5 },
                  ]}
                  onPress={() => setPetSpecies(p.value)}
                >
                  <View style={[styles.petIconCircle, { backgroundColor: p.color + '20' }]}>
                    <Text style={{ fontSize: 32 }}>{p.icon}</Text>
                  </View>
                  <Text variant="label" align="center" style={{ marginTop: spacing.sm }}>
                    {p.name}
                  </Text>
                  <Text variant="caption" align="center" style={{ marginTop: 2 }}>
                    🥚 Commence en oeuf
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Card style={styles.section}>
              <Text variant="label" style={styles.sectionTitle}>Nom de ton familier</Text>
              <TextInput
                style={styles.input}
                placeholder="Comment s'appelle-t-il ?"
                placeholderTextColor={colors.neutral[300]}
                value={petName}
                onChangeText={setPetName}
              />
            </Card>

            <Card variant="outlined" style={[styles.section, { borderColor: colors.secondary[200] }]}>
              <Text variant="caption" color={colors.secondary[400]}>
                🥚 Ton familier naîtra sous forme d'oeuf. Il éclora après 7 nuits de bon sommeil !
              </Text>
            </Card>

            <View style={styles.navButtons}>
              <Button title="Retour" onPress={() => setStep(0)} variant="ghost" />
              <Button title="Suivant" onPress={() => setStep(2)} />
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContent}>
            <Text variant="h1" align="center">Tes Objectifs</Text>
            <Text variant="body" align="center" style={{ marginTop: spacing.sm, marginBottom: spacing.lg }}>
              Qu'aimerais-tu améliorer ? (choisis-en au moins un)
            </Text>

            <View style={styles.goalsContainer}>
              {GOALS.map((g) => {
                const isSelected = selectedGoals.includes(g.id);
                return (
                  <TouchableOpacity
                    key={g.id}
                    style={[styles.goalCard, isSelected && styles.goalCardActive]}
                    onPress={() => toggleGoal(g.id)}
                  >
                    <Text style={{ fontSize: 28 }}>{g.icon}</Text>
                    <Text
                      variant="label"
                      color={isSelected ? colors.primary[500] : colors.neutral[500]}
                      style={{ marginTop: spacing.sm }}
                    >
                      {g.label}
                    </Text>
                    {isSelected && (
                      <View style={styles.checkmark}>
                        <Text style={{ fontSize: 14, color: '#FFF' }}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.navButtons}>
              <Button title="Retour" onPress={() => setStep(1)} variant="ghost" />
              <Button
                title="Commencer !"
                onPress={handleFinish}
                disabled={selectedGoals.length === 0}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.xxl,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.neutral[200],
  },
  stepDotActive: {
    backgroundColor: colors.primary[300],
    width: 28,
  },
  stepDotDone: {
    backgroundColor: colors.primary[200],
  },
  stepContent: {
    gap: spacing.md,
  },
  avatarPreview: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  section: {
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.neutral[50],
    borderRadius: radii.md,
    padding: spacing.md,
    fontSize: 16,
    fontFamily: typography.fontFamily.regular,
    color: colors.neutral[600],
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  optionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  optionBtn: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.neutral[50],
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
  },
  optionBtnActive: {
    borderColor: colors.primary[300],
    backgroundColor: colors.primary[50],
  },
  colorRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorCircleActive: {
    borderColor: colors.primary[400],
    borderWidth: 3,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
    backgroundColor: colors.neutral[100],
  },
  chipActive: {
    backgroundColor: colors.primary[300],
  },
  petGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  petCard: {
    width: '46%',
    padding: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.neutral[0],
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
  },
  petIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  goalCard: {
    width: '44%',
    padding: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: colors.neutral[0],
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
  },
  goalCardActive: {
    borderColor: colors.primary[300],
    backgroundColor: colors.primary[50],
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary[300],
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
});
