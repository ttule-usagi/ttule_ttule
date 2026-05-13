'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Icon } from '../common/Icon';
import { compressImage } from '@/lib/utils/compressImage';

interface ProfileImageUploaderProps {
  onUploadImage: (file: File | null) => void;
  initialImageURL?: string;
}

export default function ProfileImageUploader({ onUploadImage, initialImageURL }: ProfileImageUploaderProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const displayImage = previewImage || initialImageURL || null;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setPreviewImage(null);
      onUploadImage(null);
      return;
    }

    try {
      const compressedFile = await compressImage(file);
      const objectURL = URL.createObjectURL(compressedFile);
      setPreviewImage(objectURL);
      onUploadImage(compressedFile);
    } catch (error) {
      console.error('이미지 처리 중 오류 발생:', error);
      setPreviewImage(initialImageURL || null);
      onUploadImage(null);
    }
  };

  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  return (
    <div className='w-34 h-34 bg-brand-blue-100 border border-brand-blue-700 rounded-full box-border relative'>
      <label
        htmlFor='previewImage'
        className='cursor-pointer block w-full h-full'
      >
        {displayImage && (
          <Image
            src={displayImage}
            unoptimized={displayImage.startsWith('blob:')}
            alt='Profile'
            fill={true}
            className='object-cover rounded-full'
          />
        )}

        <div className='absolute w-10 h-10 bg-brand-blue-700 -right-2.75 bottom-0.5 rounded-full flex items-center justify-center pointer-events-none'>
          <Icon
            name='Camera'
            size={24}
          />
        </div>
      </label>
      <input
        type='file'
        accept='image/png, image/jpeg'
        className='absolute inset-0 opacity-0 cursor-pointer'
        id='previewImage'
        onChange={handleImageChange}
      />
    </div>
  );
}
