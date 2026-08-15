import { PlanTransitMode } from '@/types/plan';

const GOOGLE_MAPS_URL_TRAVEL_MODE: Record<PlanTransitMode, string> = {
  walking: 'walking',
  cycling: 'bicycling',
  driving: 'driving',
  transit: 'transit',
};

export function buildGoogleMapsDirectionsUrl(
  origin: { lat: number; lng: number; googlePlaceId: string | null; name: string },
  destination: { lat: number; lng: number; googlePlaceId: string | null; name: string },
  mode: PlanTransitMode,
): string {
  const params = new URLSearchParams({
    api: '1',
    origin: origin.name ?? `${origin.lat},${origin.lng}`,
    destination: destination.name ?? `${destination.lat},${destination.lng}`,
    travelmode: GOOGLE_MAPS_URL_TRAVEL_MODE[mode],
  });
  if (origin.googlePlaceId) params.set('origin_place_id', origin.googlePlaceId);
  if (destination.googlePlaceId) params.set('destination_place_id', destination.googlePlaceId);

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
