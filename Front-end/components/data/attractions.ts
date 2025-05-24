import { getDistance } from 'geolib';
import type { Location } from 'expo-location';

export interface Attraction {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export const categories = [
  'Todos',
  'Monumentos',
  'Museus',
  'Natureza',
  'Religiosos',
  'Parques',
  'Arquitetura',
];

// Buscar atrações da API com tratamento de erro e dados
export async function fetchAttractions(): Promise<Attraction[]> {
  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';
  try {
    const res = await fetch(`${API_URL}/attractions`);
    if (!res.ok) throw new Error('Erro ao buscar atrações');
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map((a: any) => ({
      id: a.id,
      name: a.name,
      description: a.description,
      image: a.image || '',
      rating: Number(a.rating) || 0,
      reviews: Number(a.reviews) || 0,
      category: a.category || '',
      coordinates: {
        latitude: Number(a.latitude),
        longitude: Number(a.longitude),
      },
    }));
  } catch (err) {
    console.error('Erro ao buscar atrações:', err);
    return [];
  }
}

export function calculateDistance(
  userLocation: Location | null,
  attraction: Attraction
): number {
  if (!userLocation) return 0;
  const distance = getDistance(
    {
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
    },
    attraction.coordinates
  );
  return Math.round((distance / 1000) * 10) / 10;
}
