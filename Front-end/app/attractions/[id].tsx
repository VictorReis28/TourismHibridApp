import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useThemeStore } from '@/stores/theme';
import { darkTheme, lightTheme } from '@/styles/theme';
import { Image } from 'expo-image';
import { Star, ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export default function AttractionDetailScreen() {
  const { id } = useLocalSearchParams();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;
  const router = useRouter();

  const [attraction, setAttraction] = useState<any>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/attractions`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((a: any) => a.id === id);
        setAttraction(found);
      });
  }, [id]);

  const handleRate = async (rating: number) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/attractions/${id}/rating`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating }),
      });
      if (!res.ok) throw new Error('Erro ao avaliar');
      const updated = await res.json();
      setAttraction((prev: any) => ({
        ...prev,
        rating: updated.rating,
        reviews: updated.reviews,
      }));
      setUserRating(rating);
      Alert.alert('Obrigado!', 'Sua avaliação foi registrada.');
    } catch {
      Alert.alert('Erro', 'Não foi possível registrar sua avaliação.');
    }
    setSubmitting(false);
  };

  // Função para garantir URL absoluta para imagens relativas
  function getImageUrl(image: string) {
    if (!image) return undefined;
    if (image.startsWith('http')) return image;
    return `${API_URL.replace(/\/$/, '')}/${image.replace(/^\/?/, '')}`;
  }

  if (!attraction) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <Text style={{ color: theme.colors.text }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginRight: 12 }}
          >
            <ArrowLeft size={28} color={theme.colors.text} />
          </TouchableOpacity>
          <Text
            style={[styles.title, { color: theme.colors.text }]}
            numberOfLines={1}
          >
            {attraction.name}
          </Text>
        </View>
        <Image
          source={{ uri: getImageUrl(attraction.image) }}
          style={styles.image}
          contentFit="cover"
        />
        <View style={styles.content}>
          <Text style={[styles.name, { color: theme.colors.text }]}>
            {attraction.name}
          </Text>
          <Text
            style={[styles.description, { color: theme.colors.textSecondary }]}
          >
            {attraction.description}
          </Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleRate(star)}
                disabled={submitting}
                activeOpacity={0.7}
              >
                <Star
                  size={32}
                  color={
                    star <= (userRating || Math.round(attraction.rating))
                      ? '#FFD700'
                      : theme.colors.textSecondary
                  }
                  fill={
                    star <= (userRating || Math.round(attraction.rating))
                      ? '#FFD700'
                      : 'none'
                  }
                  style={{ marginHorizontal: 2 }}
                />
              </TouchableOpacity>
            ))}
            <Text
              style={[
                styles.ratingText,
                { color: theme.colors.text, marginLeft: 8 },
              ]}
            >
              {Number(attraction.rating).toFixed(1)} ({attraction.reviews}{' '}
              avaliações)
            </Text>
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          padding: 20,
          backgroundColor: theme.colors.card,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            backgroundColor: theme.colors.primary,
            padding: 14,
            borderRadius: 10,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontFamily: 'Inter_600SemiBold',
              fontSize: 16,
            }}
          >
            Voltar
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    flex: 1,
  },
  image: {
    width: '100%',
    height: 220,
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    marginBottom: 24,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});
