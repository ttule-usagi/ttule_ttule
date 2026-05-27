import { useQuery } from '@tanstack/react-query';

interface UseGoogleSearchOptions {
  query: string;
  languageCode?: string;
}

export const useGoogleSearch = ({ query, languageCode }: UseGoogleSearchOptions) => {
  return useQuery({
    queryKey: ['googleSearch', query, languageCode],
    queryFn: async () => {
      const res = await fetch('/api/google-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, languageCode }),
      });
      if (!res.ok) throw new Error('Search failed');
      return res.json();
    },
    enabled: !!query.trim(),
    staleTime: 1000 * 60 * 10, // 10분 캐시
  });
};
