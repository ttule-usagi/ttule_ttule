import { CorePlaceImage } from '@/types/CorePlace';
import Image from 'next/image';

interface PlaceImageProps {
  images: CorePlaceImage[];
  koreanName: string;
}

export default function PlaceImage({ images, koreanName }: PlaceImageProps) {
  const mainImage = images.find((img) => img.isMain) ?? images[0];

  return (
    <div className='h-60 w-full bg-brand-gray-100 flex flex-col items-center justify-center'>
      {mainImage ? (
        <Image
          src={mainImage.imgUrl}
          alt={koreanName}
          width={360}
          height={240}
          className='object-cover w-full h-full'
        />
      ) : (
        <Image
          src={'/images/not-found-big.png'}
          alt='not-found'
          width={360}
          height={240}
          className='w-full h-full object-cover'
        />
      )}
    </div>
  );
}
