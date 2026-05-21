'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PlaceMap() {
  const { listId } = useParams();
  const [mapImage, setMapImage] = useState<string>('');

  useEffect(() => {
    // listId가 없을 땐 기본 지도 이미지 + 문구
    if (!listId) {
      setMapImage('');
      return;
    }

    let objectUrl: string | null = null;

    // listId가 선택되면 mapUrl 업데이트
    const fetchMap = async () => {
      try {
        const response = await fetch(`/api/map/place-list?listId=${listId}`);
        const blobData = await response.blob();
        objectUrl = URL.createObjectURL(blobData);

        console.log('이미지: ', objectUrl);
        setMapImage(objectUrl);
      } catch (error) {
        console.error('지도 이미지를 불러오지 못했습니다:', error);
      }
    };

    fetchMap();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [listId]);

  return (
    <div className='w-full h-full relative'>
      {mapImage ? (
        <Image
          src={mapImage}
          alt='장소 리스트 지도'
          fill
          className='object-contain'
        />
      ) : (
        <div className='text-typo-sub-title '>장소 리스트를 선택하면 지도가 나타납니다</div>
      )}
    </div>
  );
}
