import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { useThemeStore } from '@/stores/theme';
import { useLocationStore } from '@/stores/location';
import { darkTheme, lightTheme } from '@/styles/theme';
import { router } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';

// URL base da API
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export default function NewAttraction() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;

  const preloadedLocation = useLocationStore((state) => state.location);
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    image: '',
    latitude: preloadedLocation?.latitude?.toString() || '0',
    longitude: preloadedLocation?.longitude?.toString() || '0',
  });

  const handleRegionChange = (region) => {
    setForm((prev) => ({
      ...prev,
      latitude: region.latitude.toString(),
      longitude: region.longitude.toString(),
    }));
  };

  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.description ||
      !form.category ||
      !form.latitude ||
      !form.longitude
    ) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const lat = parseFloat(form.latitude);
    const lng = parseFloat(form.longitude);
    if (
      isNaN(lat) ||
      isNaN(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      Alert.alert('Erro', 'Coordenadas inválidas');
      return;
    }

    const newAttraction = {
      name: form.name,
      description: form.description,
      category: form.category,
      image: form.image || null,
      latitude: lat,
      longitude: lng,
    };

    try {
      const res = await fetch(`${API_URL}/attractions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAttraction),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erro ao salvar atração');
      }
      Alert.alert('Sucesso', 'Atração cadastrada com sucesso!');
      router.back();
      // Opcional: pode emitir um evento ou usar contexto para recarregar lista na tela anterior
    } catch (error) {
      console.error('Erro ao salvar atração:', error);
      Alert.alert('Erro', 'Não foi possível salvar a atração');
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: theme.colors.text }}>Voltar</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Nova Atração
        </Text>
      </View>

      <ScrollView style={styles.form}>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: parseFloat(form.latitude) || 0,
              longitude: parseFloat(form.longitude) || 0,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onRegionChangeComplete={handleRegionChange}
          >
            <Marker
              coordinate={{
                latitude: parseFloat(form.latitude) || 0,
                longitude: parseFloat(form.longitude) || 0,
              }}
              draggable
              onDragEnd={(e) => {
                const { latitude, longitude } = e.nativeEvent.coordinate;
                setForm((prev) => ({
                  ...prev,
                  latitude: latitude.toString(),
                  longitude: longitude.toString(),
                }));
              }}
            />
          </MapView>
        </View>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.card,
              color: theme.colors.text,
              borderColor: theme.colors.border,
            },
          ]}
          placeholder="Nome da atração"
          placeholderTextColor={theme.colors.textSecondary}
          value={form.name}
          onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
        />

        <TextInput
          style={[
            styles.input,
            styles.textArea,
            {
              backgroundColor: theme.colors.card,
              color: theme.colors.text,
              borderColor: theme.colors.border,
            },
          ]}
          placeholder="Descrição"
          placeholderTextColor={theme.colors.textSecondary}
          multiline
          numberOfLines={4}
          value={form.description}
          onChangeText={(text) =>
            setForm((prev) => ({ ...prev, description: text }))
          }
        />

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.card,
              color: theme.colors.text,
              borderColor: theme.colors.border,
            },
          ]}
          placeholder="Categoria"
          placeholderTextColor={theme.colors.textSecondary}
          value={form.category}
          onChangeText={(text) =>
            setForm((prev) => ({ ...prev, category: text }))
          }
        />

        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: theme.colors.primary },
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Cadastrar Atração</Text>
        </TouchableOpacity>
      </ScrollView>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  form: {
    padding: 20,
  },
  mapContainer: {
    height: 200,
    marginBottom: 20,
  },
  map: {
    flex: 1,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
