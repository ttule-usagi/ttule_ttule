import Image from 'next/image';

export default function Map() {
  const currentListId = 1;
  return (
    <div className='w-full h-full'>
      <Image
        src={`/api/map/place-list?listId=${currentListId}`}
        alt='장소 지도'
      />
    </div>
  );
}
