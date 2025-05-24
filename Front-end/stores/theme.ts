import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const storage = Platform.select({
  web: {
    getItem: async (key: string) => localStorage.getItem(key),
    setItem: async (key: string, value: string) =>
      localStorage.setItem(key, value),
    removeItem: async (key: string) => localStorage.removeItem(key),
  },
  default: AsyncStorage,
});

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: false,
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));
