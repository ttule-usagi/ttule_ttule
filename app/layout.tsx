import type { Metadata } from 'next';
import { pretendard, paperlogySemiBold, paperlogyRegular } from '@/public/fonts/fonts';
import './globals.css';
import Providers from '@/components/features/provider/Provider';
import GlobalModal from '@/components/common/GlobalModal';

export const metadata: Metadata = {
  title: '뚤레뚤레',
  description: '함께 떠나기 좋은 여행 플래너',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='ko'
      className={`${pretendard.variable} ${paperlogySemiBold.variable} ${paperlogyRegular.variable} font-pretendard`}
    >
      <Providers>
        <body className='min-h-full flex flex-col'>
          {children}
          <GlobalModal />
        </body>
      </Providers>
    </html>
  );
}
