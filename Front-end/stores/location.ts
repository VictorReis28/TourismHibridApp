import { create } from 'zustand';
import * as Location from 'expo-location';

export const useLocationStore = create((set) => ({
  location: null,
  setLocation: (location) => set({ location }),
  initializeLocation: async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permissão de localização negada');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      set({
        location: {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        },
      });
    } catch (error) {
      console.error('Erro ao obter localização:', error);
    }
  },
}));
