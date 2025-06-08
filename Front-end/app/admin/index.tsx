import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useThemeStore } from '@/stores/theme';
import { useLocationStore } from '@/stores/location';
import { darkTheme, lightTheme } from '@/styles/theme';
import {
  CirclePlus as PlusCircle,
  Trash2,
  Pencil,
  ArrowLeft,
} from 'lucide-react-native';
import * as Location from 'expo-location';

export default function AdminScreen() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;

  const setLocation = useLocationStore((state) => state.setLocation);

  useEffect(() => {
    const preloadLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permissão necessária',
            'Precisamos de acesso à sua localização para continuar.'
          );
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.error('Erro ao pré-carregar localização:', error);
      }
    };

    preloadLocation();
  }, []);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 12 }}
        >
          <ArrowLeft size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Administração
        </Text>
      </View>
      <Text
        style={[
          styles.subtitle,
          { color: theme.colors.textSecondary, marginLeft: 52 },
        ]}
      >
        Gerencie as atrações turísticas
      </Text>

      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={() => router.push('/admin/new-attraction')}
        >
          <PlusCircle size={24} color="#FFF" />
          <Text style={styles.buttonText}>Adicionar Atração</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: theme.colors.primary + 'CC' }, // Usando primary com opacidade
          ]}
          onPress={() => router.push('/admin/select-edit-attraction')}
        >
          <Pencil size={24} color="#FFF" />
          <Text style={styles.buttonText}>Editar Atração</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.error }]}
          onPress={() => router.push('/admin/delete-attractions')}
        >
          <Trash2 size={24} color="#FFF" />
          <Text style={styles.buttonText}>Remover Atrações</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    marginBottom: 24, // Adiciona espaçamento abaixo do header
  },
  title: {
    fontSize: 32,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  content: {
    padding: 20,
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});
