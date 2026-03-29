import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Text, Card, Button, Badge } from '../src/components/ui';
import { colors, spacing, radii } from '../src/theme/tokens';
import { usePlayerStore } from '../src/stores/usePlayerStore';
import { useShopStore } from '../src/stores/useShopStore';
import { SHOP_ITEMS } from '../src/data/shop-items';
import { ItemCategory, Rarity } from '../src/types';

const CATEGORIES: { value: ItemCategory | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: 'Tout', icon: '🏪' },
  { value: 'outfit', label: 'Tenues', icon: '👕' },
  { value: 'accessory', label: 'Accessoires', icon: '💎' },
  { value: 'aura', label: 'Auras', icon: '✨' },
  { value: 'pet_costume', label: 'Familier', icon: '🎀' },
];

const RARITY_COLORS: Record<Rarity, string> = {
  common: colors.rarity.common,
  rare: colors.rarity.rare,
  epic: colors.rarity.epic,
  legendary: colors.rarity.legendary,
};

const RARITY_LABELS: Record<Rarity, string> = {
  common: 'Commun',
  rare: 'Rare',
  epic: 'Épique',
  legendary: 'Légendaire',
};

export default function Shop() {
  const [category, setCategory] = useState<ItemCategory | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const player = usePlayerStore((s) => s.player);
  const addCurrency = usePlayerStore((s) => s.addCurrency);
  const { ownedItems, purchaseItem, equipItem } = useShopStore();

  if (!player) return null;

  const filteredItems = category === 'all'
    ? SHOP_ITEMS
    : SHOP_ITEMS.filter((i) => i.category === category);

  const handlePurchase = (itemId: string) => {
    const item = SHOP_ITEMS.find((i) => i.id === itemId);
    if (!item || player.currency < item.price) return;
    if (item.unlockLevel && player.level < item.unlockLevel) return;

    addCurrency(-item.price);
    purchaseItem(itemId);
    equipItem(item.category, item.name);
    setSelectedItem(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text variant="h3" color={colors.neutral[400]}>✕</Text>
        </TouchableOpacity>
        <Text variant="h2">Boutique</Text>
        <View style={styles.currencyBadge}>
          <Text variant="label" color={colors.warning}>{player.currency} 💰</Text>
        </View>
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        <View style={styles.categoryRow}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c.value}
              style={[styles.categoryBtn, category === c.value && styles.categoryBtnActive]}
              onPress={() => setCategory(c.value)}
            >
              <Text style={{ fontSize: 18 }}>{c.icon}</Text>
              <Text
                variant="caption"
                color={category === c.value ? '#FFF' : colors.neutral[500]}
              >
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Items Grid */}
      <View style={styles.grid}>
        {filteredItems.map((item) => {
          const owned = ownedItems.includes(item.id);
          const locked = item.unlockLevel ? player.level < item.unlockLevel : false;
          const canAfford = player.currency >= item.price;
          const rarityColor = RARITY_COLORS[item.rarity];

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.itemCard,
                { borderColor: selectedItem === item.id ? rarityColor : colors.neutral[200] },
                owned && styles.itemOwned,
              ]}
              onPress={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
            >
              <View style={[styles.rarityStrip, { backgroundColor: rarityColor }]} />
              <View style={styles.itemContent}>
                <Text style={{ fontSize: 28 }}>
                  {item.category === 'outfit' ? '👕' :
                   item.category === 'accessory' ? '💎' :
                   item.category === 'aura' ? '✨' : '🎀'}
                </Text>
                <Text variant="label" align="center" numberOfLines={1} style={{ fontSize: 12 }}>
                  {item.name}
                </Text>
                <Badge label={RARITY_LABELS[item.rarity]} color={rarityColor} size="sm" />
                {owned ? (
                  <Text variant="caption" color={colors.success}>✅ Obtenu</Text>
                ) : locked ? (
                  <Text variant="caption" color={colors.neutral[400]}>🔒 Niv.{item.unlockLevel}</Text>
                ) : (
                  <Text
                    variant="caption"
                    color={canAfford ? colors.warning : colors.error}
                  >
                    {item.price} 💰
                  </Text>
                )}
              </View>

              {selectedItem === item.id && !owned && !locked && (
                <View style={styles.buyOverlay}>
                  <Text variant="caption" color={colors.neutral[500]} numberOfLines={2}>
                    {item.description}
                  </Text>
                  <Button
                    title={canAfford ? 'Acheter' : 'Pas assez'}
                    onPress={() => handlePurchase(item.id)}
                    disabled={!canAfford}
                    size="sm"
                  />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
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
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  currencyBadge: {
    backgroundColor: colors.warning + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
  },
  categoryScroll: {
    marginBottom: spacing.lg,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
    backgroundColor: colors.neutral[100],
  },
  categoryBtnActive: {
    backgroundColor: colors.primary[300],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  itemCard: {
    width: '48%',
    flexGrow: 1,
    borderRadius: radii.lg,
    backgroundColor: colors.neutral[0],
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  itemOwned: {
    opacity: 0.7,
  },
  rarityStrip: {
    height: 4,
    width: '100%',
  },
  itemContent: {
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  buyOverlay: {
    padding: spacing.md,
    backgroundColor: colors.neutral[50],
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    gap: spacing.sm,
  },
});
