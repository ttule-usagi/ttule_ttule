'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function ProfileImageUploader() {
  const [image, setImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const objectURL = URL.createObjectURL(file);
      setImage(objectURL);
    }
  };

  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image);
    };
  }, [image]);

  return (
    <div className='w-34 h-34 bg-brand-blue-100 border border-brand-blue-700 rounded-full box-border relative'>
      <label
        htmlFor='image'
        className='cursor-pointer'
      >
        {image && (
          <Image
            src={image}
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
        id='image'
        onChange={handleImageChange}
      />

      <button className='absolute w-10 h-10 bg-brand-blue-700 -right-2.75 bottom-0.5 rounded-full cursor-pointer'>
        c
      </button>
    </div>
  );
}
