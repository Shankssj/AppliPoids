import { Platform } from 'react-native';
import { StateStorage } from 'zustand/middleware';

const webStorage: StateStorage = {
  getItem: (name: string) => {
    const value = localStorage.getItem(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    localStorage.setItem(name, value);
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

let storage: StateStorage;

if (Platform.OS === 'web') {
  storage = webStorage;
} else {
  // Lazy require pour éviter les erreurs import.meta sur le web
  const AsyncStorageModule = require('@react-native-async-storage/async-storage');
  
  // Sécurise l'import selon que le module utilise CommonJS ou ESM
  const AsyncStorage = AsyncStorageModule.default || AsyncStorageModule;
  
  storage = {
    getItem: async (name: string) => {
      const value = await AsyncStorage.getItem(name);
      return value ?? null;
    },
    setItem: async (name: string, value: string) => {
      await AsyncStorage.setItem(name, value);
    },
    removeItem: async (name: string) => {
      await AsyncStorage.removeItem(name);
    },
  };
}

export { storage };
