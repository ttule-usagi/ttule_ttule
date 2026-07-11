'use client';

import { useEffect, useRef, useState } from 'react';
import type { PlaceCategory } from '@/types/CorePlace';
import { CATEGORY_COLORS, CATEGORY_EMOJI } from '@/lib/utils/placeCategory';

interface MapCoordinate {
  lat: number;
  lng: number;
  placeName: string;
  category: PlaceCategory | null;
}

interface GoogleMapJSProps {
  coordinates: MapCoordinate[];
  // plan_item이 없을 때 나라 중심 좌표
  defaultCenter?: { lat: number; lng: number };
  defaultZoom?: number;
}

export default function GoogleMapJS({
  coordinates,
  defaultCenter = { lat: 37.5665, lng: 126.978 }, // 기본: 서울
  defaultZoom = 12,
}: GoogleMapJSProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  // 지도 초기화
  // 지도 초기화 완료 여부를 상태로 관리
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstanceRef.current) return;

    const checkGoogle = setInterval(() => {
      if (typeof google === 'undefined' || !google.maps) return;
      clearInterval(checkGoogle);

      const initMap = async () => {
        const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;

        mapInstanceRef.current = new Map(mapRef.current!, {
          center: coordinates.length > 0 ? { lat: coordinates[0].lat, lng: coordinates[0].lng } : defaultCenter,
          zoom: coordinates.length > 0 ? 13 : defaultZoom,
          mapId: process.env.NEXT_PUBLIC_GOOGLE_JS_MAP_ID,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        });

        setIsMapReady(true);
      };

      initMap();
    }, 100);

    return () => clearInterval(checkGoogle);
  }, []);

  // 마커 업데이트 — isMapReady가 true일 때만 실행
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return;

    const updateMarkers = async () => {
      const { AdvancedMarkerElement, PinElement } = (await google.maps.importLibrary(
        'marker',
      )) as google.maps.MarkerLibrary;

      markersRef.current.forEach((marker) => {
        marker.map = null;
      });
      markersRef.current = [];

      if (coordinates.length === 0) return;

      const newMarkers = coordinates.map((coord) => {
        const category = coord.category as PlaceCategory | null;
        const bgColor = category ? CATEGORY_COLORS[category] : '#C0C8E0';
        const emoji = category ? CATEGORY_EMOJI[category] : '📍';

        const glyphSpan = document.createElement('span');
        glyphSpan.textContent = emoji;
        glyphSpan.style.cssText = `
        font-family: 'Mona12', 'Mona', sans-serif;
        font-size: 14px;
        line-height: 1;
      `;

        const pinElement = new PinElement({
          background: bgColor,
          borderColor: '#ffffff',
          glyphColor: '#ffffff',
          glyphText: emoji,
          scale: 1.2,
        });

        const marker = new AdvancedMarkerElement({
          map: mapInstanceRef.current!,
          position: { lat: coord.lat, lng: coord.lng },
          content: pinElement,
          title: coord.placeName,
        });

        return marker;
      });

      markersRef.current = newMarkers;

      if (coordinates.length > 1) {
        const bounds = new google.maps.LatLngBounds();
        coordinates.forEach((coord) => bounds.extend({ lat: coord.lat, lng: coord.lng }));
        mapInstanceRef.current!.fitBounds(bounds, 80);
      } else if (coordinates.length === 1) {
        mapInstanceRef.current!.setCenter({ lat: coordinates[0].lat, lng: coordinates[0].lng });
        mapInstanceRef.current!.setZoom(15);
      }
    };

    updateMarkers();
  }, [isMapReady, coordinates]);

  return (
    <div
      ref={mapRef}
      className='w-full h-full'
    />
  );
}
