'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Icon } from '@/components/common/Icon';
import { deleteImage } from '@/lib/actions/storage';

interface Props {
  url: string | null;
  onChange: (url: string | null) => void;
}

export default function ImageUpload({ url, onChange }: Props) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 파일 업로드 처리
  const uploadFile = async (file: File) => {
    setError(null);
    setIsUploading(true);

    try {
      // 이전 이미지가 있으면 먼저 삭제
      if (url) {
        deleteImage(url); // fire and forget
      }

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/image/place', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? '업로드에 실패했습니다.');
        return;
      }

      setFileName(file.name);
      onChange(data.url);
    } catch (e) {
      console.error('Image upload error:', e);
      setError('업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  // 파일 검증
  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return '이미지 파일만 업로드 가능합니다.';
    }
    if (file.size > 20 * 1024 * 1024) {
      return '20MB 이하의 파일만 업로드 가능합니다.';
    }
    return null;
  };

  // input change 핸들러
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    uploadFile(file);
    // 같은 파일 다시 선택할 수 있게 input value 초기화
    e.target.value = '';
  };

  // 드래그앤드롭
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    uploadFile(file);
  };

  // 파일 제거
  const handleRemove = async () => {
    if (!url) return;
    await deleteImage(url);
    setFileName(null);
    onChange(null);
  };

  return (
    <div className='flex flex-col gap-3'>
      {/* 헤더 */}
      <div>
        <h4 className='text-typo-base text-brand-gray-600'>장소 사진</h4>
        <ul className='mt-3 text-typo-caption text-brand-gray-500 list-disc list-inside'>
          <li>장소를 대표하는 이미지를 등록할 수 있습니다.</li>
          <li>이미지 파일의 크기는 10MB를 초과할 수 없으며, 최대 1개까지 등록할 수 있습니다.</li>
        </ul>
      </div>

      {/* 드래그앤드롭 영역 */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-3 py-8 px-4 rounded-lg border border-dashed transition-colors ${
          isDragging ? 'border-brand-blue-700 bg-brand-blue-50' : 'border-brand-gray-200 bg-brand-blue-50/30'
        }`}
      >
        <p className='text-typo-description text-brand-gray-500 text-center'>
          {isUploading ? '업로드 중...' : '첨부할 파일을 여기에 끌어다 놓거나, 파일 선택 버튼을 직접 선택해주세요.'}
        </p>

        <button
          type='button'
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className='flex items-center gap-2 px-4 py-2 bg-white border border-brand-blue-700 rounded-sm text-typo-description text-brand-blue-700 hover:bg-brand-gray-50 disabled:opacity-50'
        >
          <Icon
            name='Image'
            size={18}
          />
          사진선택
        </button>

        <input
          ref={inputRef}
          type='file'
          accept='image/*'
          onChange={handleFileChange}
          className='hidden'
        />
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p
          role='alert'
          className='text-typo-description text-red-500'
        >
          {error}
        </p>
      )}

      {/* 업로드된 파일 표시 */}
      {url && (
        <div className='flex items-center justify-between px-3 py-2 bg-brand-gray-50 rounded-md'>
          <span className='text-typo-description text-brand-gray-700 truncate'>{fileName ?? '업로드된 이미지'}</span>
          <button
            type='button'
            onClick={handleRemove}
            className='ml-2 flex-shrink-0 text-brand-gray-500 hover:text-brand-gray-700'
            aria-label='이미지 제거'
          >
            <Icon
              name='XClose'
              size={20}
            />
          </button>
        </div>
      )}
    </div>
  );
}
