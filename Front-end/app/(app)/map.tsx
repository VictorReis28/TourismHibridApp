import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Dimensions, Pressable, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import * as Location from 'expo-location';
import { useThemeStore } from '@/stores/theme';
import { darkTheme, lightTheme } from '@/styles/theme';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { Star, Navigation, ChevronUp } from 'lucide-react-native';
import { Map } from '@/components/Map';
import {
  fetchAttractions,
  calculateDistance,
} from '@/components/data/attractions';
import { mapStyles as styles } from '@/styles/screens/app/map.styles';
import { useLocationStore } from '@/stores/location';
import { useRouter } from 'expo-router';

const { height } = Dimensions.get('window');

export default function MapScreen() {
  const router = useRouter();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [attractions, setAttractions] = useState([]);
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const bottomSheetHeight = useSharedValue(height * 0.3);
  const isExpanded = useSharedValue(false);
  const mapRef = useRef(null);
  const { location, loading, error, initializeLocation } = useLocationStore();

  useEffect(() => {
    (async () => {
      const data = await fetchAttractions();
      setAttractions(data);
      if (data.length > 0) setSelectedAttraction(data[0]);
    })();
  }, []);

  useEffect(() => {
    if (!location && !loading && !error) {
      initializeLocation();
    }
  }, [location, loading, error, initializeLocation]);

  const toggleBottomSheet = () => {
    const newHeight = isExpanded.value ? height * 0.3 : height * 0.7;
    bottomSheetHeight.value = withSpring(newHeight);
    isExpanded.value = !isExpanded.value;
  };

  const handleMarkerPress = (attraction) => {
    setSelectedAttraction(attraction);
    mapRef.current?.animateToRegion({
      latitude: attraction.coordinates.latitude,
      longitude: attraction.coordinates.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const handleAttractionPress = (attraction) => {
    setSelectedAttraction(attraction);
    mapRef.current?.animateToRegion({
      latitude: attraction.coordinates.latitude,
      longitude: attraction.coordinates.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    // Navegar para detalhes
    router.push(`/attractions/${attraction.id}`);
  };

  const bottomSheetStyle = useAnimatedStyle(() => ({
    height: bottomSheetHeight.value,
  }));

  // Loading
  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={{ color: theme.colors.text }}>Obtendo localização...</Text>
      </View>
    );
  }

  // Erro
  if (error) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={{ color: theme.colors.error }}>{error}</Text>
      </View>
    );
  }

  // Sem localização válida
  if (
    !location ||
    typeof location.latitude !== 'number' ||
    typeof location.longitude !== 'number'
  ) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={{ color: theme.colors.text }}>
          Localização não disponível.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Só renderize o Map se location estiver disponível e válido */}
      <Map
        ref={mapRef}
        style={styles.map}
        location={location}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        markers={attractions.map((attraction) => ({
          id: attraction.id,
          latitude: attraction.coordinates.latitude,
          longitude: attraction.coordinates.longitude,
          title: attraction.name,
          onPress: () => handleMarkerPress(attraction),
        }))}
        showsUserLocation={true}
      />

      <Animated.View
        style={[
          styles.bottomSheet,
          bottomSheetStyle,
          { backgroundColor: theme.colors.card },
        ]}
      >
        <Pressable onPress={toggleBottomSheet} style={styles.bottomSheetHeader}>
          <View
            style={[
              styles.bottomSheetHandle,
              { backgroundColor: theme.colors.border },
            ]}
          />
          <ChevronUp size={24} color={theme.colors.text} />
          <Text style={[styles.bottomSheetTitle, { color: theme.colors.text }]}>
            Atrações Turísticas
          </Text>
        </Pressable>

        <ScrollView style={styles.attractionsList}>
          {attractions.map((attraction) => {
            const distance = calculateDistance(location, attraction);
            const isSelected =
              selectedAttraction && selectedAttraction.id === attraction.id;

            return (
              <Pressable
                key={attraction.id}
                style={[
                  styles.attractionItem,
                  {
                    borderBottomColor: theme.colors.border,
                    backgroundColor: isSelected
                      ? theme.colors.surface
                      : 'transparent',
                  },
                ]}
                onPress={() => handleAttractionPress(attraction)}
              >
                {attraction.image ? (
                  <Image
                    source={{ uri: attraction.image }}
                    style={styles.attractionImage}
                    contentFit="cover"
                  />
                ) : null}
                <View style={styles.attractionInfo}>
                  <Text
                    style={[
                      styles.attractionName,
                      { color: theme.colors.text },
                    ]}
                  >
                    {attraction.name}
                  </Text>
                  <View style={styles.attractionDetails}>
                    <View style={styles.rating}>
                      <Star size={16} color="#FFD700" fill="#FFD700" />
                      <Text
                        style={[
                          styles.ratingText,
                          { color: theme.colors.text },
                        ]}
                      >
                        {attraction.rating}
                      </Text>
                    </View>
                    {/* Categoria como botão para detalhes */}
                    <Pressable
                      onPress={() =>
                        router.push(`/attractions/${attraction.id}`)
                      }
                      style={{ marginRight: 8 }}
                    >
                      <View
                        style={{
                          backgroundColor: theme.colors.card,
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          borderRadius: 8,
                          marginBottom: 2,
                          borderWidth: 1,
                          borderColor: theme.colors.border,
                        }}
                      >
                        <Text
                          style={{
                            color: theme.colors.primary,
                            fontFamily: 'Inter_600SemiBold',
                            fontSize: 13,
                          }}
                        >
                          {attraction.category}
                        </Text>
                      </View>
                    </Pressable>
                    <View style={styles.distance}>
                      <Navigation
                        size={16}
                        color={theme.colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.distanceText,
                          { color: theme.colors.textSecondary },
                        ]}
                      >
                        {distance} km
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </Animated.View>
    </View>
  );
}
