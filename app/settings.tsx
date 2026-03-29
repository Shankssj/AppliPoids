import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Text, Card, Button } from '../src/components/ui';
import { colors, spacing, radii } from '../src/theme/tokens';
import { usePlayerStore } from '../src/stores/usePlayerStore';
import { useStatsStore } from '../src/stores/useStatsStore';

export default function Settings() {
  const player = usePlayerStore((s) => s.player);
  const [notifications, setNotifications] = useState({
    water: true,
    exercise: true,
    sleep: true,
    mood: true,
  });

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExport = () => {
    Alert.alert('Export', 'Les données seront exportées en JSON. (Fonctionnalité à venir)');
  };

  const handleReset = () => {
    Alert.alert(
      'Réinitialiser',
      'Es-tu sûr de vouloir tout recommencer ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: () => {
            // Would clear all stores
            Alert.alert('Réinitialisation', 'Redémarre l\'application pour commencer une nouvelle aventure.');
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text variant="h3" color={colors.neutral[400]}>✕</Text>
        </TouchableOpacity>
        <Text variant="h2">Paramètres</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Profile */}
      <Card style={styles.section}>
        <Text variant="h3">Profil</Text>
        {player && (
          <View style={styles.profileRow}>
            <View style={styles.profileAvatar}>
              <Text style={{ fontSize: 32 }}>
                {player.avatar.gender === 'feminine' ? '👩' : player.avatar.gender === 'masculine' ? '🧑' : '🧝'}
              </Text>
            </View>
            <View>
              <Text variant="label">{player.name}</Text>
              <Text variant="caption" color={colors.neutral[400]}>
                Niveau {player.level} | {player.totalXp} XP total
              </Text>
              <Text variant="caption" color={colors.neutral[400]}>
                Membre depuis le {new Date(player.createdAt).toLocaleDateString('fr-FR')}
              </Text>
            </View>
          </View>
        )}
      </Card>

      {/* Notifications */}
      <Card style={styles.section}>
        <Text variant="h3">Rappels</Text>
        {([
          { key: 'water' as const, label: 'Hydratation', icon: '💧', desc: 'Rappel toutes les 2h' },
          { key: 'exercise' as const, label: 'Exercice', icon: '🏃', desc: 'Rappel quotidien' },
          { key: 'sleep' as const, label: 'Sommeil', icon: '🌙', desc: 'Rappel le soir' },
          { key: 'mood' as const, label: 'Humeur', icon: '😊', desc: 'Rappel quotidien' },
        ]).map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.settingRow}
            onPress={() => toggleNotif(item.key)}
          >
            <Text style={{ fontSize: 20 }}>{item.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text variant="label">{item.label}</Text>
              <Text variant="caption" color={colors.neutral[400]}>{item.desc}</Text>
            </View>
            <View style={[styles.toggle, notifications[item.key] && styles.toggleActive]}>
              <View style={[styles.toggleDot, notifications[item.key] && styles.toggleDotActive]} />
            </View>
          </TouchableOpacity>
        ))}
      </Card>

      {/* Data */}
      <Card style={styles.section}>
        <Text variant="h3">Données</Text>
        <TouchableOpacity style={styles.settingRow} onPress={handleExport}>
          <Text style={{ fontSize: 20 }}>📤</Text>
          <View style={{ flex: 1 }}>
            <Text variant="label">Exporter les données</Text>
            <Text variant="caption" color={colors.neutral[400]}>Télécharge tes données en JSON</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingRow} onPress={handleReset}>
          <Text style={{ fontSize: 20 }}>⚠️</Text>
          <View style={{ flex: 1 }}>
            <Text variant="label" color={colors.error}>Réinitialiser</Text>
            <Text variant="caption" color={colors.neutral[400]}>Supprimer toutes les données</Text>
          </View>
        </TouchableOpacity>
      </Card>

      {/* About */}
      <Card style={styles.section}>
        <Text variant="h3">À propos</Text>
        <View style={styles.aboutRow}>
          <Text variant="body" color={colors.primary[400]} style={{ fontWeight: 'bold' }}>
            VitaQuest
          </Text>
          <Text variant="caption" color={colors.neutral[400]}>Version 1.0.0</Text>
        </View>
        <Text variant="caption" color={colors.neutral[400]}>
          Transforme ta santé en aventure RPG.{'\n'}
          Chaque effort compte, chaque jour est une victoire.
        </Text>
        <Text variant="caption" color={colors.neutral[300]} style={{ marginTop: spacing.sm }}>
          Fait avec 💚 pour les héros du quotidien
        </Text>
      </Card>

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
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary[200],
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.neutral[200],
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: colors.primary[300],
  },
  toggleDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.neutral[0],
  },
  toggleDotActive: {
    alignSelf: 'flex-end',
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
