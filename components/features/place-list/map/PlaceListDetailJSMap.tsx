'use client';

import GoogleMapJS from '../../map/GoogleMapJS';
import { useMemo } from 'react';
import { useGetPlaceListPlacesCoordinate } from '@/hooks/place-list/useGetPlaceListPlacesCoordinate';
import GoogleMapEmbed from '../../map/GoogleMapEmbed';

export default function PlaceListDetailJSMap({ listId }: { listId: string }) {
  const { data: places } = useGetPlaceListPlacesCoordinate(listId);
  const coordinates = useMemo(
    () =>
      places
        .filter((item) => item.latitude && item.longitude)
        .map((item) => ({
          lat: item.latitude!,
          lng: item.longitude!,
          placeName: item.customName,
          category: item.category,
        })),
    [places],
  );

  // 저장된 장소가 없을 땐 embed 지도 렌더링
  return <>{coordinates.length > 0 ? <GoogleMapJS coordinates={coordinates} /> : <GoogleMapEmbed mode='view' />}</>;
}
