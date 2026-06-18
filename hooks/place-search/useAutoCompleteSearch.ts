import { useQuery } from '@tanstack/react-query';
import { getAutoCompletePlaces } from '@/lib/actions/places';

export const useAutoCompleteSearch = (query: string) => {
  const trimmedQuery = query.trim();

  return useQuery({
    // 검색어가 바뀔 때마다 별도의 캐시 엔트리로 관리됨
    // 같은 검색어로 다시 들어오면(예: 지웠다가 다시 입력) 캐시된 결과를 즉시 사용
    queryKey: ['autoCompletePlaces', trimmedQuery],
    queryFn: () => getAutoCompletePlaces({ query: trimmedQuery }),
    // 빈 문자열일 때는 요청 자체를 보내지 않음
    enabled: trimmedQuery.length > 0,
    // 같은 검색어에 대해 일정 시간 내 재요청 시 네트워크 호출 없이 캐시 사용
    staleTime: 1000 * 60,
    // 자동완성 결과는 길게 들고 있을 필요가 없으므로 짧게 유지
    gcTime: 1000 * 60 * 5,
  });
};
