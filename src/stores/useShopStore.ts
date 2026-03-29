import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from './storage';

interface ShopState {
  ownedItems: string[];
  equippedItems: Record<string, string>;
  purchaseItem: (itemId: string) => void;
  equipItem: (category: string, itemId: string) => void;
  ownsItem: (itemId: string) => boolean;
}

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      ownedItems: [],
      equippedItems: {},

      purchaseItem: (itemId) => {
        set({ ownedItems: [...get().ownedItems, itemId] });
      },

      equipItem: (category, itemId) => {
        set({
          equippedItems: { ...get().equippedItems, [category]: itemId },
        });
      },

      ownsItem: (itemId) => get().ownedItems.includes(itemId),
    }),
    {
      name: 'vitaquest-shop',
      storage: createJSONStorage(() => storage),
    },
  ),
);
