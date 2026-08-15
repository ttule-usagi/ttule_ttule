import Script from 'next/script';

import ScrollToTop from '@/components/common/ScrollTopTop';
import PlaceListMap from '@/components/features/place-list/map/PlaceListMap';
import CorePlaceSearchInput from '@/components/features/search/CorePlaceSearchInput';
import { auth } from '@/lib/utils/auth';

export default async function PlaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <div className='h-screen w-full flex'>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&loading=async`}
        strategy='afterInteractive'
      />
      <div
        className='w-102 overflow-y-auto h-screen'
        id='scroll-container'
      >
        {session && (
          <div className='fixed top-5 z-10 px-4 w-102'>
            <CorePlaceSearchInput />
          </div>
        )}
        <ScrollToTop />
        {children}
      </div>
      <PlaceListMap />
    </div>
  );
}
