import { Icon } from '@/components/common/Icon';
import PlaceMap from '@/components/features/Place/PlaceMap';
import SavedPlaceList from '@/components/features/Place/SavedPlaceList';
import SharedPlaceList from '@/components/features/Place/SharedPlaceList';
import Link from 'next/link';

export default function Page() {
  return (
    <div className='h-screen w-full flex'>
      {/* 좌측 장소 리스트 */}
      <div className='w-102 pt-5 px-4 pb-60 overflow-y-auto h-screen'>
        <div>검색창 자리</div>
        <div className='text-typo-big-title text-brand-blue-700 pb-6 mt-8'>저장된 장소 리스트</div>
        <Link
          href='/places/create'
          className='w-full max-h-19 flex justify-center items-center py-5.5 text-brand-gray-400 text-typo-sub-title mb-3 gap-2 wobbly-box'
        >
          <Icon
            name='Plus'
            size={32}
          />
          장소 리스트 만들기
        </Link>
        <SavedPlaceList />

        <div className='mt-17.5 text-typo-big-title text-brand-blue-700 pb-6'>공유된 장소 리스트</div>
        <SharedPlaceList />
      </div>
      {/* 우측 지도 */}
      <div className='flex-1 bg-brand-blue-50 h-full'>
        <PlaceMap />
      </div>
    </div>
  );
}
