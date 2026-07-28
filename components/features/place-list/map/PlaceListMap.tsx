'use client';

import { usePathname } from 'next/navigation';
import GoogleMapEmbed from '../../map/GoogleMapEmbed';
import { Suspense } from 'react';
import PlaceListDetailJSMap from './PlaceListDetailJSMap';

interface MapParams {
  match: (pathname: string) => boolean;
  mapType: 'js' | 'embed' | 'hidden';
  block?: boolean;
}

const MAP_ROUTE_CONFIG: MapParams[] = [
  { match: (p) => p === '/places', mapType: 'embed' }, // 장소 리스트 목록
  { match: (p) => p === '/places/create', mapType: 'embed', block: true }, // 장소 리스트 생성
  { match: (p) => p === '/places/search', mapType: 'hidden' }, // DB 장소검색
  { match: (p) => /^\/places\/detail\/[^/]+$/.test(p), mapType: 'hidden' }, // 장소 상세
  { match: (p) => /^\/places\/[^/]+\/edit$/.test(p), mapType: 'js', block: true }, // 장소 리스트 편집
  { match: (p) => /^\/places\/[^/]+$/.test(p), mapType: 'js' }, // 장소 리스트 상세
];

export default function PlaceListMap() {
  const pathname = usePathname();
  const config = MAP_ROUTE_CONFIG.find((c) => c.match(pathname));

  // hidden이면 지도 렌더링X
  if (!config || config.mapType === 'hidden') return null;

  // URL에서 listId 추출
  const listIdMatch = pathname.match(/^\/places\/([^/]+)(?:\/edit)?$/);
  const listId = config?.mapType === 'js' ? listIdMatch?.[1] : undefined;

  return (
    <div className='absolute inset-0 ml-118'>
      {config.mapType === 'embed' && <GoogleMapEmbed mode='view' />}
      {config.mapType === 'js' && listId && (
        <Suspense fallback={null}>
          <PlaceListDetailJSMap listId={listId} />
        </Suspense>
      )}
      {config.block && (
        <div className='absolute inset-0 bg-white/86 flex flex-col items-center justify-center'>
          <span className='text-typo-base text-brand-gray-400'>지금은 지도를 조작할 수 없습니다.</span>
        </div>
      )}
    </div>
  );
}
