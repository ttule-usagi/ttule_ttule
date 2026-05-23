import { Icon } from '@/components/common/Icon';

export default async function PlaceListDetail({ params }: { params: Promise<{ listId: string }> }) {
  const { listId } = await params;
  return (
    <div className='flex flex-col text-typo-big-title text-brand-blue-700'>
      <header className='flex flex-col gap-4'>
        <div className='flex items-center gap-3'>
          <span className='font-mona12'>🐠</span>
          <p className='font-semibold flex-1'>교토나들이</p>

          <div className='flex gap-3'>
            <Icon
              name='Share'
              size={32}
              className='cursor-pointer'
            />
            <Icon
              name='DotsHorizontal'
              size={32}
              className='cursor-pointer'
            />
          </div>
        </div>

        <div className='flex flex-col gap-1 text-typo-base font-light'>
          <div className='flex gap-3 text-brand-gray-400'>
            <span>마스터닉네임</span>
            <span>이미지</span>
            <span>장소 32개</span>
            <span>공유됨</span>
          </div>
          <p className='text-brand-gray-600'>따뜻한 봄에 즐거운 여행을</p>
        </div>
      </header>
    </div>
  );
}
