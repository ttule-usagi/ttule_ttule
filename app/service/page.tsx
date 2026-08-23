import Link from 'next/link';

import Privacy from '@/components/features/service/Privacy';
import TermsOfUse from '@/components/features/service/TermsOfUse';
import { auth } from '@/lib/utils/auth';

const TAB_COMPONENT = {
  terms: TermsOfUse,
  privacy: Privacy,
};

type Tab = keyof typeof TAB_COMPONENT;

export default async function ServicePage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const currentTab: Tab = tab === 'privacy' ? 'privacy' : 'terms';
  const ActiveContent = TAB_COMPONENT[currentTab];
  const session = await auth();

  return (
    <div className='h-screen w-full flex flex-col'>
      <nav className='sticky top-0 w-full border-b border-brand-gray-200 text-typo-base z-10 bg-white flex flex-col pt-6 gap-3'>
        <div className='max-w-245 min-w-230 mx-auto w-full'>
          <div className='w-full flex items-center justify-end text-typo-caption text-brand-gray-400 gap-3'>
            {session && (
              <Link
                href='/lobby'
                className='hover:underline hover:text-brand-blue-800'
              >
                로비로 이동
              </Link>
            )}
            <Link
              href='/'
              className='hover:underline hover:text-brand-blue-800'
            >
              시작 페이지로 이동
            </Link>
          </div>
          <div className='flex gap-4 items-center justify-start'>
            <Link
              href='/service?tab=terms'
              className={`border-box py-3 px-4 border-b-2 ${
                currentTab === 'terms'
                  ? 'border-brand-blue-700 text-brand-blue-800 font-medium'
                  : 'text-brand-gray-500 border-transparent'
              }`}
            >
              이용약관
            </Link>
            <Link
              href='/service?tab=privacy'
              className={`border-box py-3 px-4 border-b-2 ${
                currentTab === 'privacy'
                  ? 'border-brand-blue-700 text-brand-blue-800 font-medium'
                  : 'text-brand-gray-500 border-transparent'
              }`}
            >
              개인정보처리방침
            </Link>
          </div>
        </div>
      </nav>

      <main className='flex-1 min-h-0 overflow-y-scroll overscroll-none'>
        <ActiveContent />
      </main>
    </div>
  );
}
