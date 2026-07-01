import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { QueryBoundary } from '@/components/common/ui/boundary/Queryboundary';
import CorePlaceDetailContainer from '@/components/features/Place/CorePlaceDetailContainer';
import { prefetchCorePlace } from '@/lib/actions/prefetch/prefetchCorePlaceDetail';

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

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QueryBoundary>
        <CorePlaceDetailContainer placeId={placeId} />
      </QueryBoundary>
    </HydrationBoundary>
  );
}