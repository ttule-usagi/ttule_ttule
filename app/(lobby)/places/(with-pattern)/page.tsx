import { Icon } from '@/components/common/Icon';
import PlaceList from '@/components/features/Place/PlaceList';
import Link from 'next/link';

export default function Page() {
  return (
    <>
      <div className='text-typo-big-title font-semibold text-brand-blue-700 pb-6'>저장된 장소 리스트</div>
      <Link
        href='/places/create'
        className='w-full max-h-19 flex justify-center items-center py-5.5 text-brand-gray-400 text-typo-sub-title font-medium mb-3 gap-2 wobbly-box'
      >
        <Icon
          name='Plus'
          size={32}
        />
        장소 리스트 만들기
      </Link>
      <PlaceList
        listType='owned'
        emptyText='장소 리스트가 아직 없습니다.'
      />

      <div className='mt-17.5 text-typo-title font-semibold text-brand-blue-700 pb-6'>공유된 장소 리스트</div>
      <PlaceList
        listType='shared'
        emptyText='초대된 장소 리스트가 아직 없습니다.'
      />
    </>
  );
}
