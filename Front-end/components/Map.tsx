import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { useThemeStore } from '@/stores/theme';
import { darkTheme, lightTheme } from '@/styles/theme';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

interface MapProps {
  style?: any;
  location?: { latitude: number; longitude: number };
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  markers?: Array<{
    id: string;
    latitude: number;
    longitude: number;
    title: string;
    onPress?: () => void;
  }>;
  showsUserLocation?: boolean;
}

export const Map = forwardRef<any, MapProps>(
  (
    { style, location, markers, initialRegion, showsUserLocation = true },
    ref
  ) => {
    const isDarkMode = useThemeStore((state) => state.isDarkMode);
    const theme = isDarkMode ? darkTheme : lightTheme;
    const mapRef = useRef<MapView>(null);

    useImperativeHandle(ref, () => ({
      animateToRegion: (region: any) => {
        if (Platform.OS !== 'web' && mapRef.current) {
          mapRef.current.animateToRegion(region, 1000);
        }
      },
    }));

    useEffect(() => {
      if (location && mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    }, [location]);

    if (Platform.OS === 'web') {
      const center = location ||
        initialRegion || { latitude: 48.8584, longitude: 2.2945 };
      const zoom = 13;

      const markersString = markers
        ?.map(
          (marker) =>
            `&markers=color:red%7Clabel:${marker.title.charAt(0)}%7C${
              marker.latitude
            },${marker.longitude}`
        )
        .join('');

      const mapStyle = isDarkMode
        ? '&style=element:geometry%7Ccolor:0x212121&style=element:labels.icon%7Cvisibility:off&style=element:labels.text.fill%7Ccolor:0x757575&style=element:labels.text.stroke%7Ccolor:0x212121&style=feature:administrative%7Celement:geometry%7Ccolor:0x757575&style=feature:administrative.country%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:administrative.land_parcel%7Cvisibility:off&style=feature:administrative.locality%7Celement:labels.text.fill%7Ccolor:0xbdbdbd&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:poi.park%7Celement:geometry%7Ccolor:0x181818&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x616161&style=feature:poi.park%7Celement:labels.text.stroke%7Ccolor:0x1b1b1b&style=feature:road%7Celement:geometry.fill%7Ccolor:0x2c2c2c&style=feature:road%7Celement:labels.text.fill%7Ccolor:0x8a8a8a&style=feature:road.arterial%7Celement:geometry%7Ccolor:0x373737&style=feature:road.highway%7Celement:geometry%7Ccolor:0x3c3c3c&style=feature:road.highway.controlled_access%7Celement:geometry%7Ccolor:0x4e4e4e&style=feature:road.local%7Celement:labels.text.fill%7Ccolor:0x616161&style=feature:transit%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:water%7Celement:geometry%7Ccolor:0x000000&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x3d3d3d'
        : '';

      return (
        <View
          style={[
            styles.container,
            style,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <div style={{ width: '100%', height: '100%' }}>
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/view?key=YOUR_GOOGLE_MAPS_API_KEY&center=${
                center.latitude
              },${center.longitude}&zoom=${zoom}${
                markersString || ''
              }${mapStyle}`}
            />
          </div>
        </View>
      );
    }

    return (
      <View style={[styles.container, style]}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          showsUserLocation={showsUserLocation}
          showsMyLocationButton={true}
          customMapStyle={[]}
        >
          {markers?.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={marker.title}
              onPress={marker.onPress}
            />
          ))}
        </MapView>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
