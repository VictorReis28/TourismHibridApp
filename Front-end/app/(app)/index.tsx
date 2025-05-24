import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Pressable,
  TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import {
  Star,
  Navigation,
  Search,
  FileSliders as Sliders,
} from 'lucide-react-native';
import * as Location from 'expo-location';
import Animated, {
  FadeInDown,
  FadeOut,
  withSpring,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '@/stores/theme';
import { darkTheme, lightTheme } from '@/styles/theme';
import {
  fetchAttractions,
  categories,
  calculateDistance,
  type Attraction,
} from '@/components/data/attractions';
import { homeStyles } from '@/styles/screens/app/home.styles';
import { router } from 'expo-router';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const DISTANCE_FILTERS = [
  { label: 'Todos', value: null },
  { label: 'Até 5km', value: 5 },
  { label: 'Até 10km', value: 10 },
  { label: 'Até 50km', value: 50 },
  { label: 'Até 100km', value: 100 },
];

export default function HomeScreen() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const searchBarHeight = useSharedValue(0);
  const searchBarVisible = useSharedValue(false);

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
    })();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAttractions().then((data) => {
      setAttractions(data);
      setRefreshing(false);
    });
  }, []);

  const toggleSearch = () => {
    searchBarVisible.value = !searchBarVisible.value;
    searchBarHeight.value = withSpring(searchBarVisible.value ? 60 : 0);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const searchBarStyle = useAnimatedStyle(() => ({
    height: searchBarHeight.value,
    opacity: searchBarHeight.value === 0 ? 0 : 1,
    overflow: 'hidden',
  }));

  const renderAttractionCard = ({
    item,
    index,
  }: {
    item: Attraction;
    index: number;
  }) => {
    const distance = calculateDistance(location, item);
    if (selectedDistance && distance > selectedDistance) {
      return null;
    }

    return (
      <AnimatedPressable
        style={[homeStyles.card]}
        entering={FadeInDown.delay(index * 100)}
        exiting={FadeOut}
        onPress={() => router.push(`/attractions/${item.id}`)}
      >
        <Image
          source={{ uri: item.image }}
          style={homeStyles.image}
          contentFit="cover"
          transition={1000}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={homeStyles.gradient}
        />
        <View style={homeStyles.cardContent}>
          <View style={homeStyles.categoryBadge}>
            <Text style={homeStyles.categoryText}>{item.category}</Text>
          </View>
          <Text style={homeStyles.name}>{item.name}</Text>
          <Text style={homeStyles.description} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={homeStyles.cardFooter}>
            <View style={homeStyles.rating}>
              <Star size={16} color="#FFD700" fill="#FFD700" />
              <Text style={homeStyles.ratingText}>{item.rating}</Text>
              <Text style={homeStyles.reviewCount}>
                ({item.reviews.toLocaleString()} avaliações)
              </Text>
            </View>
            <View style={homeStyles.distance}>
              <Navigation size={16} color="#fff" />
              <Text style={homeStyles.distanceText}>{distance} km</Text>
            </View>
          </View>
        </View>
      </AnimatedPressable>
    );
  };

  const renderCategory = ({ item }: { item: string }) => (
    <Pressable
      onPress={() => setSelectedCategory(item)}
      style={[
        homeStyles.categoryButton,
        selectedCategory === item && { backgroundColor: theme.colors.primary },
      ]}
    >
      <Text
        style={[
          homeStyles.categoryButtonText,
          selectedCategory === item && { color: '#fff' },
        ]}
      >
        {item}
      </Text>
    </Pressable>
  );

  const filteredAttractions = attractions
    .filter(
      (attraction) =>
        selectedCategory === 'Todos' || attraction.category === selectedCategory
    )
    .filter(
      (attraction) =>
        searchQuery === '' ||
        attraction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attraction.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <View
      style={[
        homeStyles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View style={homeStyles.header}>
        <View style={homeStyles.headerTop}>
          <Text style={[homeStyles.title, { color: theme.colors.text }]}>
            Descobrir
          </Text>
          <View style={homeStyles.headerButtons}>
            <Pressable onPress={toggleSearch} style={homeStyles.iconButton}>
              <Search size={24} color={theme.colors.text} />
            </Pressable>
            <Pressable onPress={toggleFilters} style={homeStyles.iconButton}>
              <Sliders size={24} color={theme.colors.text} />
            </Pressable>
          </View>
        </View>
        <Text
          style={[homeStyles.subtitle, { color: theme.colors.textSecondary }]}
        >
          Explore atrações próximas
        </Text>
      </View>

      <Animated.View style={[homeStyles.searchBar, searchBarStyle]}>
        <TextInput
          placeholder="Buscar atrações..."
          style={[
            homeStyles.searchInput,
            { backgroundColor: theme.colors.surface },
          ]}
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </Animated.View>

      <View style={homeStyles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={homeStyles.categoriesList}
          contentContainerStyle={homeStyles.categoriesContent}
        />
      </View>

      <FlatList
        data={filteredAttractions}
        renderItem={renderAttractionCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={homeStyles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
      />

      {showFilters && (
        <View
          style={[
            homeStyles.filtersModal,
            { backgroundColor: theme.colors.card },
          ]}
        >
          <Text style={[homeStyles.filtersTitle, { color: theme.colors.text }]}>
            Filtros
          </Text>
          <View style={{ gap: 8 }}>
            {DISTANCE_FILTERS.map((filter) => (
              <TouchableOpacity
                key={filter.label}
                style={[
                  {
                    padding: 12,
                    borderRadius: 8,
                    backgroundColor:
                      selectedDistance === filter.value
                        ? theme.colors.primary
                        : theme.colors.surface,
                  },
                ]}
                onPress={() => {
                  setSelectedDistance(filter.value);
                  setShowFilters(false);
                }}
              >
                <Text
                  style={{
                    color:
                      selectedDistance === filter.value
                        ? '#fff'
                        : theme.colors.text,
                    fontFamily: 'Inter_600SemiBold',
                  }}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
