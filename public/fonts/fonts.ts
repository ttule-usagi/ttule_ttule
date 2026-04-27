import localFont from 'next/font/local';

// 1. Pretendard 가변 폰트
export const pretendard = localFont({
  src: './PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920', // 가변 두께 범위
  variable: '--font-pretendard',
});

// 2. Mona12ColorEmoji (아이콘용)
export const mona12 = localFont({
  src: [
    {
      path: './Mona12ColorEmoji.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-nona12',
});