import Script from 'next/script';

import PlaceListMap from '@/components/features/place-list/map/PlaceListMap';

export default function PlaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='h-full w-full flex'>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&loading=async`}
        strategy='afterInteractive'
      />
      {children}
      <PlaceListMap />
    </div>
  );
}
