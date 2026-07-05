'use client';

import { useEffect, useState } from 'react';

interface GoogleMapEmbedProps {
  mode: 'place' | 'search' | 'view';
  googlePlaceId?: string;
  query?: string;
}

export default function GoogleMapEmbed({ mode, googlePlaceId, query }: GoogleMapEmbedProps) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams({ mode });
    if (googlePlaceId) params.set('googlePlaceId', googlePlaceId);
    if (query) params.set('query', query);

    fetch(`/api/map/google-search?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setSrc(data.src));
  }, [mode, googlePlaceId, query]);

  if (!src) return <div className='w-full h-full bg-brand-gray-100' />;

  return (
    <iframe
      src={src}
      className='w-full h-full border-0 z-index-[-1]'
      loading='lazy'
      allowFullScreen
      referrerPolicy='no-referrer-when-downgrade'
    />
  );
}
