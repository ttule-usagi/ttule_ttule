import type { SupabaseClient } from '@supabase/supabase-js';
import type { AutoCompleteResults, PlaceSearchResults } from '@/types/CorePlace';

interface GetAutoCompletePlacesProps {
  supabase: SupabaseClient;
  query: string;
  limit?: number;
}

export const getAutoCompletePlaces = async ({
  supabase,
  query,
  limit = 5,
}: GetAutoCompletePlacesProps): Promise<AutoCompleteResults> => {
  const trimmedQuery = query.trim();
  if (trimmedQuery === '') return { items: [] };

  const { data, error } = await supabase.rpc('search_places_autocomplete', {
    p_query: trimmedQuery,
    p_limit: limit,
  });

  if (error) throw error;
  if (!data) throw new Error('자동완성 결과를 가져오는 데 실패했습니다.');
  return data as AutoCompleteResults;
};

interface GetPlaceSearchResultsProps {
  supabase: SupabaseClient;
  query: string;
  limit?: number;
  offset?: number;
}

export const getPlaceSearchResults = async ({
  supabase,
  query,
  limit = 10,
  offset = 0,
}: GetPlaceSearchResultsProps): Promise<PlaceSearchResults> => {
  const trimmedQuery = query.trim();
  if (trimmedQuery === '') return { items: [], totalCount: 0 };

  const { data, error } = await supabase.rpc('search_places', {
    p_query: trimmedQuery,
    p_limit: limit,
    p_offset: offset,
  });

  if (error) throw error;
  if (!data) throw new Error('검색 결과를 가져오는 데 실패했습니다.');
  return data as PlaceSearchResults;
};
