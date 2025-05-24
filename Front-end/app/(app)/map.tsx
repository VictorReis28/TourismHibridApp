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

const { height } = Dimensions.get('window');

export default function MapScreen() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [attractions, setAttractions] = useState([]);
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const bottomSheetHeight = useSharedValue(height * 0.3);
  const isExpanded = useSharedValue(false);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const data = await fetchAttractions();
      setAttractions(data);
      if (data.length > 0) setSelectedAttraction(data[0]);
    })();
  }, []);

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
  };

  const bottomSheetStyle = useAnimatedStyle(() => ({
    height: bottomSheetHeight.value,
  }));

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {selectedAttraction && selectedAttraction.coordinates && (
        <Map
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: selectedAttraction.coordinates.latitude,
            longitude: selectedAttraction.coordinates.longitude,
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
        />
      )}

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
                <Image
                  source={{ uri: attraction.image }}
                  style={styles.attractionImage}
                  contentFit="cover"
                />
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
