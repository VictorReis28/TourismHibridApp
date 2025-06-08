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
import { ArrowLeft, Pencil } from 'lucide-react-native';

export default function SelectEditAttractionScreen() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [attractions, setAttractions] = useState([]);

  useEffect(() => {
    fetchAttractions().then(setAttractions);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Editar Atração
        </Text>
      </View>
      <ScrollView style={styles.list}>
        {attractions.map((attraction) => (
          <TouchableOpacity
            key={attraction.id}
            style={[styles.item, { backgroundColor: theme.colors.card }]}
            onPress={() =>
              router.push({
                pathname: '/admin/edit-attraction',
                params: { id: attraction.id },
              })
            }
          >
            {attraction.image ? (
              <Image
                source={{ uri: attraction.image }}
                style={styles.image}
                contentFit="cover"
              />
            ) : null}
            <View style={styles.info}>
              <Text style={[styles.name, { color: theme.colors.text }]}>
                {attraction.name}
              </Text>
              <Text
                style={[styles.category, { color: theme.colors.textSecondary }]}
              >
                {attraction.category}
              </Text>
            </View>
            <Pencil size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginLeft: 12,
  },
  list: {
    flex: 1,
    padding: 20,
  },
  item: {
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
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});
