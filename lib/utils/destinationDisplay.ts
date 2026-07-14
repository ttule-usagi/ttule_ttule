// lib/utils/destinationDisplay.ts
import { DESTINATIONS } from '@/lib/utils/destinations';

interface DestinationDisplay {
  text: string;
  fontSize: string;
}

export function getDestinationDisplay(destination: string | null): DestinationDisplay {
  if (!destination) {
    return { text: 'KOR', fontSize: 'text-[100px]' };
  }

  const trimmed = destination.trim();
  const len = [...trimmed].length;

  if (len === 2) return { text: trimmed, fontSize: 'text-[100px]' };
  if (len === 3) return { text: trimmed, fontSize: 'text-[88px]' };
  if (len === 4) return { text: trimmed, fontSize: 'text-[72px]' };

  // 5글자 이상 → city로 찾아서 countryCode 반환
  const item = DESTINATIONS.find((d) => d.city === trimmed);
  return {
    text: item?.countryCode ?? 'KOR',
    fontSize: 'text-[101px]',
  };
}
