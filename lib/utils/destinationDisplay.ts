import { DESTINATIONS } from '@/lib/utils/destinations';

type Variant = 'mobile' | 'desktop';

interface DestinationDisplay {
  text: string;
  fontSize: string;
}

// 글자 수 → 폰트 크기 매핑 (변형별)
const FONT_SIZE: Record<Variant, Record<number, string>> = {
  desktop: {
    2: 'text-[100px]',
    3: 'text-[88px]',
    4: 'text-[72px]',
  },
  mobile: {
    2: 'text-[11cqw]',
    3: 'text-[10.81cqw]',
  },
};

const FALLBACK_FONT_SIZE: Record<Variant, string> = {
  desktop: 'text-[101px]',
  mobile: FONT_SIZE.mobile[3],
};

export function getDestinationDisplay(destination: string | null, variant: Variant = 'desktop'): DestinationDisplay {
  if (!destination) {
    return { text: 'KOR', fontSize: 'FONT_SIZE[variant][3]' };
  }

  const trimmed = destination.trim();
  const len = [...trimmed].length;

  const size = FONT_SIZE[variant][len];
  if (size) return { text: trimmed, fontSize: size };

  // 5글자 이상 → city로 찾아서 countryCode 반환
  const item = DESTINATIONS.find((d) => d.city === trimmed);
  return {
    text: item?.countryCode ?? 'KOR',
    fontSize: FALLBACK_FONT_SIZE[variant],
  };
}
