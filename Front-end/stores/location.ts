import { create } from 'zustand';
import * as Location from 'expo-location';

interface LocationState {
  location: { latitude: number; longitude: number } | null;
  loading: boolean;
  error: string | null;
  setLocation: (location: { latitude: number; longitude: number }) => void;
  initializeLocation: () => Promise<void>;
}

export const useLocationStore = create<LocationState>((set) => ({
  location: null,
  loading: false,
  error: null,
  setLocation: (location) => set({ location }),
  initializeLocation: async () => {
    set({ loading: true, error: null });
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        set({ error: 'Permissão de localização negada', loading: false });
        return;
      }
      const currentLocation = await Location.getCurrentPositionAsync({});
      set({
        location: {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        },
        loading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: 'Erro ao obter localização',
        loading: false,
      });
    }
  },
}));
