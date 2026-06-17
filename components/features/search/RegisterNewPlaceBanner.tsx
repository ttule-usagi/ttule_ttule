import { Icon } from '@/components/common/Icon';
import Link from 'next/link';

export default function RegisterNewPlaceBanner() {
  return (
    <div className='flex flex-col gap-2 items-center'>
      <p className='text-typo-description text-brand-gray-600 font-light'>찾는 장소가 없나요?</p>
      <Link
        href={'/google-search'}
        className='w-full py-3 flex gap-1 items-center justify-center bg-brand-blue-700 text-white rounded-sm hover:bg-brand-blue-800 transition-colors'
      >
        <Icon
          name='Plus'
          size={20}
        />{' '}
        신규 장소 등록
      </Link>
    </div>
  );
}
