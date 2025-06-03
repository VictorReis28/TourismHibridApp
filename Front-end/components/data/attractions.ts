import { getDistance } from 'geolib';

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
      image: a.image
        ? a.image.startsWith('http')
          ? a.image
          : `${API_URL.replace(/\/$/, '')}/${a.image.replace(/^\/?/, '')}`
        : 'https://placehold.co/600x400?text=Sem+Imagem',
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
  userLocation: { latitude: number; longitude: number } | null,
  attraction: Attraction
): number {
  if (
    !userLocation ||
    typeof userLocation.latitude !== 'number' ||
    typeof userLocation.longitude !== 'number'
  ) {
    return 0;
  }
  const distance = getDistance(
    {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
    },
    {
      latitude: attraction.coordinates.latitude,
      longitude: attraction.coordinates.longitude,
    }
  );
  return Math.round((distance / 1000) * 10) / 10;
}
