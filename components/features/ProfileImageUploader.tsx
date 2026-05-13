'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Icon } from '../common/Icon';
import { compressImage } from '@/lib/utils/compressImage';

interface ProfileImageUploaderProps {
  onUploadImage: (file: File | null) => void;
}

export default function ProfileImageUploader({ onUploadImage }: ProfileImageUploaderProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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
      setPreviewImage(null);
      onUploadImage(null);
    }
  };

  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  return (
    <div className='w-34 h-34 bg-brand-blue-100 border border-brand-blue-700 rounded-full box-border relative'>
      <label
        htmlFor='previewImage'
        className='cursor-pointer'
      >
        {previewImage && (
          <Image
            src={previewImage}
            alt='Profile'
            fill={true}
            className='w-full h-full rounded-full cursor-pointer object-cover'
          />
        )}
      </label>
      <input
        type='file'
        accept='image/png, image/jpeg'
        className='absolute inset-0 opacity-0 cursor-pointer'
        id='previewImage'
        onChange={handleImageChange}
      />

      <button className='absolute w-10 h-10 bg-brand-blue-700 -right-2.75 bottom-0.5 rounded-full cursor-pointer flex items-center justify-center'>
        <Icon
          name='Camera'
          size={24}
        />
      </button>
    </div>
  );
}
