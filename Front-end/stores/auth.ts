import { create } from 'zustand';
import * as LocalAuthentication from 'expo-local-authentication';
import { Alert, Platform } from 'react-native';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isBiometricsEnabled: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithBiometrics: () => Promise<void>;
  logout: () => Promise<void>;
  checkBiometricsAvailable: () => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<void>;
  setupBiometrics: () => Promise<void>;
  toggleBiometrics: () => Promise<void>;
  updateUserAvatar: (avatarUri: string) => Promise<void>;
}

// URL base da API
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  isBiometricsEnabled: false,

  login: async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Usuário ou senha inválidos');
      }
      const data = await res.json();
      set({ isAuthenticated: true, user: data.user });

      // Buscar biometria do backend
      const bioRes = await fetch(`${API_URL}/users/${data.user.id}/biometrics`);
      const bioData = await bioRes.json();
      set({ isBiometricsEnabled: !!bioData.enabled });

      if (!bioData.enabled && Platform.OS !== 'web') {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (hasHardware && isEnrolled) {
          Alert.alert(
            'Autenticação Biométrica',
            'Deseja usar sua biometria para fazer login mais rapidamente nas próximas vezes?',
            [
              { text: 'Agora não', style: 'cancel' },
              {
                text: 'Configurar',
                onPress: async () => {
                  await get().setupBiometrics();
                },
              },
            ]
          );
        }
      }
    } catch (error: any) {
      throw new Error(error.message || 'Falha no login');
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erro ao cadastrar');
      }
      const data = await res.json();
      set({ isAuthenticated: true, user: data.user });
    } catch (error: any) {
      throw new Error(error.message || 'Falha no cadastro');
    }
  },

  setupBiometrics: async () => {
    try {
      const { user } = get();
      if (!user) throw new Error('Usuário não encontrado');
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Confirme sua identidade',
      });
      if (result.success) {
        await fetch(`${API_URL}/users/${user.id}/biometrics`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enabled: true }),
        });
        set({ isBiometricsEnabled: true });
        Alert.alert(
          'Sucesso',
          'Autenticação biométrica configurada com sucesso!'
        );
      }
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível configurar a autenticação biométrica'
      );
    }
  },

  toggleBiometrics: async () => {
    try {
      const { user, isBiometricsEnabled } = get();
      if (!user) throw new Error('Usuário não encontrado');
      if (!isBiometricsEnabled) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Confirme sua identidade para ativar a biometria',
        });
        if (result.success) {
          await fetch(`${API_URL}/users/${user.id}/biometrics`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ enabled: true }),
          });
          set({ isBiometricsEnabled: true });
          Alert.alert('Sucesso', 'Autenticação biométrica ativada!');
        }
      } else {
        await fetch(`${API_URL}/users/${user.id}/biometrics`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enabled: false }),
        });
        set({ isBiometricsEnabled: false });
        Alert.alert('Sucesso', 'Autenticação biométrica desativada!');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao configurar biometria');
    }
  },

  loginWithBiometrics: async () => {
    try {
      const { user } = get();
      if (!user)
        throw new Error(
          'Nenhum usuário encontrado para autenticação biométrica'
        );
      const bioRes = await fetch(`${API_URL}/users/${user.id}/biometrics`);
      const bioData = await bioRes.json();
      if (!bioData.enabled)
        throw new Error(
          'Autenticação biométrica não está configurada para este usuário'
        );
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Entrar com biometria',
        disableDeviceFallback: false,
      });
      if (biometricAuth.success) {
        set({ isAuthenticated: true, isBiometricsEnabled: true });
      } else {
        throw new Error('Autenticação biométrica falhou');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Falha na autenticação biométrica');
    }
  },

  updateUserAvatar: async (avatarUri: string) => {
    try {
      const { user } = get();
      if (!user) throw new Error('Usuário não encontrado');
      const res = await fetch(`${API_URL}/users/${user.id}/avatar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: avatarUri }),
      });
      if (!res.ok) throw new Error('Falha ao atualizar avatar');
      set({ user: { ...user, avatar: avatarUri } });
    } catch (error: any) {
      throw new Error('Falha ao atualizar avatar');
    }
  },

  logout: async () => {
    set({ isAuthenticated: false, user: null, isBiometricsEnabled: false });
  },

  checkBiometricsAvailable: async () => {
    if (Platform.OS === 'web') return false;
    const { user } = get();
    if (!user) return false;
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const bioRes = await fetch(`${API_URL}/users/${user.id}/biometrics`);
    const bioData = await bioRes.json();
    return hasHardware && isEnrolled && !!bioData.enabled;
  },
}));
