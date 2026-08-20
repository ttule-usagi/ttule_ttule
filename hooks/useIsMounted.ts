import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

export function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // 클라이언트에서 렌더링될 때의 값
    () => false, // 서버(SSR/빌드)에서 렌더링될 때의 값
  );
}
