import { ShopItem } from '../types';

export const SHOP_ITEMS: ShopItem[] = [
  // Outfits
  { id: 'outfit_forest', name: 'Tunique de la Forêt', description: 'Tissée avec des feuilles enchantées', category: 'outfit', price: 100, rarity: 'common', imageKey: 'outfit_forest' },
  { id: 'outfit_ocean', name: 'Cape des Marées', description: 'Ondule comme les vagues de l\'océan', category: 'outfit', price: 200, rarity: 'rare', imageKey: 'outfit_ocean' },
  { id: 'outfit_mountain', name: 'Armure de Pierre Vivante', description: 'Forgée dans le coeur d\'un volcan bienveillant', category: 'outfit', price: 500, rarity: 'epic', imageKey: 'outfit_mountain' },
  { id: 'outfit_celestial', name: 'Robe Céleste', description: 'Brodée avec la lumière des étoiles', category: 'outfit', price: 1000, rarity: 'legendary', imageKey: 'outfit_celestial', unlockLevel: 20 },
  // Accessories
  { id: 'acc_leaf_crown', name: 'Couronne de Feuilles', description: 'Un diadème naturel', category: 'accessory', price: 75, rarity: 'common', imageKey: 'acc_leaf_crown' },
  { id: 'acc_crystal', name: 'Pendentif de Cristal', description: 'Brille doucement au clair de lune', category: 'accessory', price: 150, rarity: 'rare', imageKey: 'acc_crystal' },
  { id: 'acc_wings', name: 'Ailes de Luciole', description: 'Des ailes translucides qui scintillent', category: 'accessory', price: 400, rarity: 'epic', imageKey: 'acc_wings' },
  // Auras
  { id: 'aura_firefly', name: 'Lucioles Dansantes', description: 'Des petites lumières virevoltent autour de toi', category: 'aura', price: 200, rarity: 'rare', imageKey: 'aura_firefly' },
  { id: 'aura_petals', name: 'Pétales au Vent', description: 'Des pétales de cerisier flottent dans l\'air', category: 'aura', price: 350, rarity: 'epic', imageKey: 'aura_petals' },
  { id: 'aura_rainbow', name: 'Arc-en-Ciel Intérieur', description: 'Un halo de couleurs t\'entoure', category: 'aura', price: 800, rarity: 'legendary', imageKey: 'aura_rainbow', unlockLevel: 15 },
  // Pet Costumes
  { id: 'pet_hat', name: 'Petit Chapeau de Mage', description: 'Pour que ton familier soit aussi stylé que toi', category: 'pet_costume', price: 100, rarity: 'common', imageKey: 'pet_hat' },
  { id: 'pet_scarf', name: 'Écharpe Enchantée', description: 'Garde ton compagnon au chaud', category: 'pet_costume', price: 150, rarity: 'rare', imageKey: 'pet_scarf' },
];
