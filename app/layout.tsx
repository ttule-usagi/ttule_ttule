import { GoogleTagManager } from '@next/third-parties/google';
import type { Metadata } from 'next';

import GlobalModal from '@/components/common/Modal/GlobalModal';
import Providers from '@/components/features/provider/Provider';
import { pretendard, paperlogySemiBold, paperlogyRegular, mona12 } from '@/public/fonts/fonts';

import './globals.css';

export const metadata: Metadata = {
  title: '뚤레뚤레',
  description: '함께 떠나기 좋은 여행 플래너',
  icons: {
    icon: '/images/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='ko'
      className={`${pretendard.variable} ${paperlogySemiBold.variable} ${paperlogyRegular.variable} ${mona12.variable} font-pretendard`}
    >
      <head>
        <meta charSet='utf-8' />
        <link
          rel='preconnect'
          href='https://googletagmanager.com'
        />
        <link
          rel='preconnect'
          href='https://storage.googleapis.com'
        />
        <link
          rel='icon'
          href='/images/favicon.ico'
          type='image/x-icon'
        />
        <link
          rel='apple-touch-icon'
          sizes='120x120'
          href='/images/favicon.png'
        />
      </head>

      <body className='min-h-full flex flex-col'>
        <Providers>
          {/* <!-- Google Tag Manager (noscript) --> */}
          <GoogleTagManager gtmId='GTM-WVTQPFKH' />
          <noscript>
            <iframe
              src='https://www.googletagmanager.com/ns.html?id=GTM-WVTQPFKH'
              height='0'
              width='0'
              style={{ display: 'none', visibility: 'hidden' }}
            ></iframe>
          </noscript>
          {/* <!-- End Google Tag Manager (noscript) --> */}
          {children}
          <GlobalModal />
        </Providers>
      </body>
    </html>
  );
}
