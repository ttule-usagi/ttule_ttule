function SkeletonItem() {
  return (
    <div className='w-full flex justify-center wobbly-box'>
      <div className='w-full flex flex-col gap-1'>
        {/* 아이콘, 제목 */}
        <div className='flex items-center h-full gap-2'>
          <div className='w-7.5 h-7.5 rounded-sm bg-gray-200 animate-pulse' />
          <div className='h-7.5 w-1/2 rounded-sm bg-gray-200 animate-pulse' />
        </div>

        {/* 공개 여부, 장소 개수 */}
        <div className='flex gap-2 items-center'>
          <div className='h-5 w-12 rounded-sm bg-gray-200 animate-pulse' />
          <div className='h-5 w-16 rounded-sm bg-gray-200 animate-pulse' />
        </div>
      </div>
    </div>
  );
}

export function PlaceListItemSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className='flex flex-col gap-3 items-center w-full'>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonItem key={i} />
      ))}
    </div>
  );
}
