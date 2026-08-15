import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import GoogleMapEmbed from '@/components/features/map/GoogleMapEmbed';
import CorePlaceDetailContainer from '@/components/features/place/CorePlaceDetailContainer';
import { corePlaceDetailQueryOptions } from '@/hooks/place/useGetCorePlace';
import { prefetchCorePlace } from '@/lib/actions/api/prefetch/prefetchCorePlaceDetail';

export default async function PlaceDetailPage({ params }: { params: Promise<{ placeId: string }> }) {
  const { placeId } = await params;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });

  await prefetchCorePlace(queryClient, placeId);

  // googlePlaceId 추출
  const options = corePlaceDetailQueryOptions(placeId);
  const placeData = await queryClient.fetchQuery(options);
  const googlePlaceId = placeData?.place.googlePlaceId;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QueryBoundary>
        <div className='-mx-4'>
          <CorePlaceDetailContainer placeId={placeId} />
        </div>
      </QueryBoundary>
      <div className='absolute inset-0 ml-118'>
        <GoogleMapEmbed
          mode='place'
          googlePlaceId={googlePlaceId}
        />
      </div>
    </HydrationBoundary>
  );
}
