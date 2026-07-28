import { CorePlaceImage } from '@/types/CorePlace';
import Image from 'next/image';

interface PlaceImageProps {
  images: CorePlaceImage[];
  koreanName: string;
}

export default function PlaceImage({ images, koreanName }: PlaceImageProps) {
  const mainImage = images.find((img) => img.isMain) ?? images[0];

  return (
    <div className='h-60 w-full'>
      {mainImage ? (
        <Image
          src={mainImage.imgUrl}
          alt={koreanName}
          fill
          className='object-cover'
        />
      ) : (
        <div className='w-full h-full bg-brand-gray-100 rounded-lg' />
      )}
    </div>
  );
}
