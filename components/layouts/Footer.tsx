import Link from 'next/link';

export default function Footer() {
  return (
    <div className='bg-brand-gray-200'>
      <main className='max-w-350 min-w-230 mx-auto px-16 pt-10 pb-12 flex flex-col text-brand-gray-600'>
        <nav className='flex gap-4 text-typo-description'>
          <Link
            href='/service?tab=terms'
            className='hover:opacity-65 transition-opacity'
          >
            이용약관
          </Link>
          <Link
            href='/service?tab=privacy'
            className='hover:opacity-65 transition-opacity'
          >
            개인정보처리방침
          </Link>
        </nav>
      </main>
    </div>
  );
}
