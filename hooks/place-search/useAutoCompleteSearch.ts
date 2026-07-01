import { useQuery } from '@tanstack/react-query';
import type { AutoCompleteResults } from '@/types/CorePlace';

interface FetchAutoCompleteProps {
  query: string;
  limit?: number;
}

const fetchAutoComplete = async ({ query, limit = 5 }: FetchAutoCompleteProps): Promise<AutoCompleteResults> => {
  const params = new URLSearchParams({ query, limit: String(limit) });
  const res = await fetch(`/api/view/search/auto-complete?${params.toString()}`);

  if (!res.ok) throw new Error('자동완성 결과를 가져오는 데 실패했습니다.');
  return res.json();
};

export const useAutoCompleteSearch = (query: string) => {
  const trimmedQuery = query.trim();

  return useQuery({
    queryKey: ['autoCompletePlaces', trimmedQuery],
    queryFn: () => fetchAutoComplete({ query: trimmedQuery }),
    enabled: trimmedQuery.length > 0,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
};
