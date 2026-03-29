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
  // Lazy require to avoid import.meta issues on web
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
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
