'use client';

import { useEffect, useState } from 'react';

interface GoogleMapEmbedProps {
  mode: 'place' | 'search' | 'view';
  googlePlaceId?: string;
  query?: string;
  center?: string;
  zoom?: string;
}

export default function GoogleMapEmbed({ mode, googlePlaceId, query }: GoogleMapEmbedProps) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams({ mode });
    if (googlePlaceId) params.set('googlePlaceId', googlePlaceId);
    if (query) params.set('query', query);

    fetch(`/api/map/google-embed?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setSrc(data.src));
  }, [mode, googlePlaceId, query]);

  if (!src)
    return (
      <div className='w-full h-full bg-brand-gray-100 flex items-center justify-center'>
        <p className='text-typo-description text-brand-gray-400'>지도를 불러오는 중...</p>
      </div>
    );

  return (
    <iframe
      src={src}
      className='w-full h-full border-0'
      loading='lazy'
      allowFullScreen
      referrerPolicy='no-referrer-when-downgrade'
    />
  );
}
