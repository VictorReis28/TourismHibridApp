import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
  Modal,
  FlatList,
} from 'react-native';
import { useThemeStore } from '@/stores/theme';
import { useLocationStore } from '@/stores/location';
import { darkTheme, lightTheme } from '@/styles/theme';
import { router } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { ArrowLeft } from 'lucide-react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function NewAttraction() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;

  const preloadedLocation = useLocationStore((state) => state.location);
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${API_URL}/categories`);
        if (!res.ok) throw new Error('Erro ao buscar categorias');
        const data = await res.json();
        const categoryNames = data
          .map((cat: any) => cat.name)
          .filter((name: string) => name.toLowerCase() !== 'todos');
        setCategories(categoryNames);
        setLoadingCategories(false);
      } catch (err) {
        setCategories([]);
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    image: '',
    latitude: preloadedLocation?.latitude?.toString() || '0',
    longitude: preloadedLocation?.longitude?.toString() || '0',
  });

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleRegionChange = (region) => {
    setForm((prev) => ({
      ...prev,
      latitude: region.latitude.toString(),
      longitude: region.longitude.toString(),
    }));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
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

    let imagePath = null;
    if (imageUri) {
      try {
        const formData = new FormData();
        formData.append('photo', {
          uri: imageUri,
          name: 'attraction.jpg',
          type: 'image/jpeg',
        } as any);
        const res = await fetch(`${API_URL}/photos`, {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (!res.ok) throw new Error('Erro ao enviar imagem');
        const data = await res.json();
        imagePath = data.path || data.url || null;
      } catch (err) {
        Alert.alert('Erro', 'Não foi possível enviar a imagem');
        return;
      }
    }

    const newAttraction = {
      name: form.name,
      description: form.description,
      category: form.category,
      image: imagePath,
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
    } catch (error) {
      console.error('Erro ao salvar atração:', error);
      Alert.alert('Erro', 'Não foi possível salvar a atração');
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.header, { marginBottom: 24 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 12 }}
        >
          <ArrowLeft size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Nova Atração
        </Text>
      </View>

      <View style={styles.form}>
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

        <TouchableOpacity
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              justifyContent: 'center',
              marginBottom: 15,
            },
          ]}
          onPress={() => setCategoryModalVisible(true)}
        >
          <Text
            style={{
              color: form.category
                ? theme.colors.text
                : theme.colors.textSecondary,
            }}
          >
            {form.category || 'Selecione uma categoria'}
          </Text>
        </TouchableOpacity>

        <Modal
          visible={categoryModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setCategoryModalVisible(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.4)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                backgroundColor: theme.colors.card,
                borderRadius: 10,
                width: '80%',
                maxHeight: '60%',
                padding: 20,
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 18,
                  marginBottom: 10,
                  color: theme.colors.text,
                }}
              >
                Escolha uma categoria
              </Text>
              <FlatList
                data={categories}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{ paddingVertical: 12 }}
                    onPress={() => {
                      setForm((prev) => ({ ...prev, category: item }));
                      setCategoryModalVisible(false);
                    }}
                  >
                    <Text style={{ color: theme.colors.text }}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={{ marginTop: 10, alignSelf: 'flex-end' }}
                onPress={() => setCategoryModalVisible(false)}
              >
                <Text style={{ color: theme.colors.primary }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 15,
              flexDirection: 'row',
              gap: 10,
            },
          ]}
          onPress={pickImage}
        >
          <Text style={{ color: theme.colors.text }}>
            {imageUri ? 'Alterar imagem' : 'Selecionar imagem'}
          </Text>
        </TouchableOpacity>
        {imageUri && (
          <View style={{ alignItems: 'center', marginBottom: 15 }}>
            <Image
              source={{ uri: imageUri }}
              style={{ width: 180, height: 120, borderRadius: 8 }}
              contentFit="cover"
            />
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: theme.colors.primary },
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Cadastrar Atração</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
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
