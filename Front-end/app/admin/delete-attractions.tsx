import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { useThemeStore } from '@/stores/theme';
import { darkTheme, lightTheme } from '@/styles/theme';
import { Image } from 'expo-image';
import { fetchAttractions } from '@/components/data/attractions';
import { Check, ArrowLeft } from 'lucide-react-native';

export default function DeleteAttractionsScreen() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [selectedAttractions, setSelectedAttractions] = useState<Set<string>>(
    new Set()
  );
  const [attractions, setAttractions] = useState([]);

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedAttractions);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedAttractions(newSelection);
  };

  useEffect(() => {
    fetchAttractions().then(setAttractions);
  }, []);

  const handleDelete = async () => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';
    try {
      const res = await fetch(`${API_URL}/attractions`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedAttractions) }),
      });
      if (!res.ok) throw new Error('Erro ao excluir atrações');
      // Recarrega a lista após exclusão
      const data = await fetchAttractions();
      setAttractions(data);
      setSelectedAttractions(new Set());
      router.back();
    } catch (err) {
      alert('Erro ao excluir atrações');
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Remover Atrações
        </Text>
      </View>

      <ScrollView style={styles.list}>
        {attractions.map((attraction) => (
          <TouchableOpacity
            key={attraction.id}
            style={[
              styles.attractionItem,
              {
                backgroundColor: selectedAttractions.has(attraction.id)
                  ? theme.colors.primary + '20'
                  : theme.colors.card,
              },
            ]}
            onPress={() => toggleSelection(attraction.id)}
          >
            <Image
              source={{ uri: attraction.image }}
              style={styles.image}
              contentFit="cover"
            />
            <View style={styles.attractionInfo}>
              <Text
                style={[styles.attractionName, { color: theme.colors.text }]}
              >
                {attraction.name}
              </Text>
              <Text
                style={[
                  styles.attractionCategory,
                  { color: theme.colors.textSecondary },
                ]}
                numberOfLines={1}
              >
                {attraction.category}
              </Text>
            </View>
            {selectedAttractions.has(attraction.id) && (
              <View
                style={[
                  styles.checkmark,
                  { backgroundColor: theme.colors.primary },
                ]}
              >
                <Check size={16} color="#FFF" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.error }]}
          onPress={handleDelete}
          disabled={selectedAttractions.size === 0}
        >
          <Text style={styles.buttonText}>
            Excluir ({selectedAttractions.size})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.surface }]}
          onPress={() => router.back()}
        >
          <Text style={[styles.buttonText, { color: theme.colors.text }]}>
            Cancelar
          </Text>
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
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  list: {
    flex: 1,
    padding: 20,
  },
  attractionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  attractionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  attractionName: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    marginBottom: 4,
  },
  attractionCategory: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 20,
    gap: 12,
  },
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});
