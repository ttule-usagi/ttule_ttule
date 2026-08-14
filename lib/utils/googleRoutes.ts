'use server';

import { PlanTransitMode, VEHICLE_TO_TRAVEL_MODE } from '@/types/plan';

export interface RouteResult {
  distanceMeters: number;
  durationMinutes: number;
}

export async function getRouteDistance(
  origin: { lat: number; lng: number; googlePlaceId?: string | null },
  destination: { lat: number; lng: number; googlePlaceId?: string | null },
  transitMode: PlanTransitMode = 'transit',
): Promise<RouteResult | null> {
  const travelMode = VEHICLE_TO_TRAVEL_MODE[transitMode];
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  // origin/destination 구성 — place_id 있으면 우선 사용
  const originPayload = origin.googlePlaceId
    ? { placeId: origin.googlePlaceId }
    : { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } };

  const destinationPayload = destination.googlePlaceId
    ? { placeId: destination.googlePlaceId }
    : { location: { latLng: { latitude: destination.lat, longitude: destination.lng } } };

  try {
    const res = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey!,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters',
        Referer: process.env.NEXT_PUBLIC_BASE_URL!,
      },
      body: JSON.stringify({
        origin: originPayload,
        destination: destinationPayload,
        travelMode,
        languageCode: 'ko',
      }),
    });

    const data = await res.json();
    const route = data.routes?.[0];
    if (!route) return null;

    return {
      distanceMeters: route.distanceMeters,
      durationMinutes: Math.round(Number(route.duration.replace('s', '')) / 60),
    };
  } catch (error) {
    console.error('❌ Routes API 에러:', error);
    return null;
  }
}
