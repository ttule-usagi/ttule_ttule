'use client';

import { usePathname } from 'next/navigation';
import GoogleMapEmbed from '../../map/GoogleMapEmbed';

interface MapParams {
  match: (pathname: string) => boolean;
  mapType: 'embed' | 'hidden';
  block?: boolean;
}

const MAP_ROUTE_CONFIG: MapParams[] = [
  { match: (p) => p === '/places', mapType: 'embed' }, // 장소 리스트 목록
  { match: (p) => p === '/places/create', mapType: 'embed', block: true }, // 장소 리스트 생성
  { match: (p) => p === '/places/search', mapType: 'hidden' }, // DB 장소검색
  { match: (p) => /^\/places\/detail\/[^/]+$/.test(p), mapType: 'hidden' },
  { match: (p) => /^\/places\/[^/]+\/edit$/.test(p), mapType: 'hidden' }, // 장소 리스트 편집
  { match: (p) => /^\/places\/[^/]+$/.test(p), mapType: 'hidden' }, // 장소 리스트 상세
];

export default function PlaceListEmbedMap() {
  const pathname = usePathname();
  const config = MAP_ROUTE_CONFIG.find((c) => c.match(pathname));

  if (!config || config.mapType !== 'embed') return null;

  return (
    <div className='absolute inset-0 ml-118'>
      <GoogleMapEmbed mode='view' />
      {config.block && <div className='absolute inset-0 bg-white/40' />}
    </div>
  );
}
