import PlaceListEditForm from '@/components/features/place-list/edit/PlaceListEditForm';
import { placeListDetailQueryOptions } from '@/hooks/place-list/useGetPlaceListDetail';
import { getPlaceListDetail, getPlaceListPlaces } from '@/lib/actions/api/placeList';
import { findEmoji } from '@/lib/emoji';
import { getQueryClient } from '@/lib/utils/getQueryClient';
import { supabaseUser } from '@/lib/utils/supabase';
import { EditablePlace } from '@/types/placeList';

export default async function PlaceListDetail({ params }: { params: Promise<{ listId: string }> }) {
  const { listId } = await params;
  const queryClient = getQueryClient();
  const supabase = await supabaseUser();

  // 상세페이지에서 불러온 데이터 fetch
  const [detail, places] = await Promise.all([
    queryClient.fetchQuery({
      ...placeListDetailQueryOptions(listId),
      queryFn: () => getPlaceListDetail({ supabase, listId }),
    }),
    queryClient.fetchQuery({
      queryKey: ['place-list', listId, 'places', 'list', 'all'],
      queryFn: () =>
        getPlaceListPlaces({
          supabase,
          listId,
          sortBy: 'created_desc',
          cursor: null,
          limit: null,
        }),
    }),
    // TODO: 2차 추가
    // queryClient.fetchQuery({
    //   ...placeListTagsQueryOptions(listId),
    //   queryFn: () => getPlaceListTags({supabase, listId})
    // })
  ]);

  const initialIcon = await findEmoji(detail.icon);
  const editablePlaceData: EditablePlace[] = places.map((p) => ({
    id: p.id,
    customName: p.customName,
    memoContent: p.memoContent,
    // tags: p.tags
  }));

  return (
    <PlaceListEditForm
      listId={listId}
      initialDetail={detail}
      initialIcon={initialIcon}
      initialPlaces={editablePlaceData}
    />
  );
}
