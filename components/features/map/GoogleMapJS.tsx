'use client';

import { useEffect, useRef, useState } from 'react';
import type { PlaceCategory } from '@/types/corePlace';
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

    let cancelled = false; // ← 추가

    const checkGoogle = setInterval(() => {
      if (typeof google === 'undefined' || !google.maps || typeof google.maps.importLibrary !== 'function') return;
      clearInterval(checkGoogle);

      const initMap = async () => {
        if (cancelled) return; // ← 언마운트 후 실행 방지

        const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;

        if (cancelled) return; // ← await 후에도 체크
        if (!mapRef.current) return;

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

    return () => {
      cancelled = true; // ← 언마운트 시 플래그
      clearInterval(checkGoogle);
    };
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

        // 마커 외부 div
        const markerDiv = document.createElement('div');
        markerDiv.style.cssText = `
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        `;

        // 원형 배경
        const circle = document.createElement('div');
        circle.style.cssText = `
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: ${bgColor};
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        `;

        // 이모지 span → circle 안에
        const emojiSpan = document.createElement('span');
        emojiSpan.className = 'font-mona12 text-emoji-title';
        emojiSpan.textContent = emoji;
        circle.appendChild(emojiSpan); // ← circle에 append

        // 장소 이름 라벨
        const label = document.createElement('div');
        label.style.cssText = `
          position: absolute;
          left: calc(100% + 6px);
          top: 50%;
          transform: translateY(-50%);
          background: white;
          border-radius: 4px;
          padding: 2px 6px;
          font-size: 11px;
          color: #374151;
          white-space: nowrap;
         
        `;
        label.textContent = coord.placeName;
        circle.appendChild(label);

        // 아래 꼭지
        const pin = document.createElement('div');
        pin.style.cssText = `
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid #ffffff;
        `;

        // markerDiv에 순서대로 append
        markerDiv.appendChild(circle); // 1. 원
        markerDiv.appendChild(pin); // 2. 꼭지

        const marker = new AdvancedMarkerElement({
          map: mapInstanceRef.current!,
          position: { lat: coord.lat, lng: coord.lng },
          content: markerDiv,
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
