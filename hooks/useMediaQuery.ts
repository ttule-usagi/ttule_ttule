import { useCallback, useSyncExternalStore } from 'react';

export const MD_QUERY = '(width >= 48rem)'; // (min-width: 768px)

export const useMediaQuery = (query: string, serverFallback = false) => {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener('change', onStoreChange);
      return () => mediaQueryList.removeEventListener('change', onStoreChange);
    },
    [query], // query가 바뀔 때만 재구독
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverFallback,
  );
};
