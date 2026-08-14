'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Icon } from '@/components/common/Icon';
import NotePage from '@/components/common/NotePage';
import { useConfirmWithdraw } from '@/hooks/auth/useConfirmWithdraw';
import { useEditMyInfo } from '@/hooks/user/useEditMyInfo';
import { useGetUserInfo } from '@/hooks/user/useGetUserInfo';
import { DEFAULT_PROFILE_IMAGE } from '@/lib/constants/image';

import ProfileImageUploader from '../ProfileImageUploader';

interface initialDataProps {
  username: string;
}

export default function EditInfoForm() {
  const { data: initialUserInfo } = useGetUserInfo();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [userInfo, setUserInfo] = useState<initialDataProps>({
    username: initialUserInfo.username ?? '',
  });
  const { confirmWithdraw } = useConfirmWithdraw();
  const { mutate: editMyInfo, isPending, fieldError, setFieldError } = useEditMyInfo();

  const handleSubmit = async () => {
    editMyInfo(
      { username: userInfo.username, newProfileImage, currentProfileImage: initialUserInfo.profileImageUrl ?? '' },
      { onSuccess: () => setIsEdit(false) },
    );
  };

  // 취소 버튼 클릭
  const handleCancel = () => {
    setIsEdit(false);
    setFieldError(null);
    setUserInfo({ username: initialUserInfo.username ?? '' });
    setNewProfileImage(null);
  };

  return (
    <NotePage title={isEdit ? '내 정보 수정' : '내 정보'}>
      {!isEdit && (
        <Icon
          name='Setting'
          size={32}
          className='absolute top-24.5 right-8 cursor-pointer'
          onClick={() => setIsEdit(true)}
        />
      )}
      <div className='grid grid-cols-[16rem] grid-rows-[repeat(13,44px)] content-start h-full justify-center items-center relative'>
        <div className='row-span-6 flex justify-center relative'>
          {isEdit ? (
            <ProfileImageUploader
              onUploadImage={setNewProfileImage}
              initialImageURL={initialUserInfo.profileImageUrl ?? ''}
            />
          ) : (
            <div className='w-34 h-34 rounded-full bg-brand-blue-100 box-border border border-brand-blue-700'>
              <Image
                src={initialUserInfo.profileImageUrl || DEFAULT_PROFILE_IMAGE}
                alt='나의 프로필 이미지'
                width={136}
                height={136}
                className='w-full h-full rounded-full object-cover'
              />
            </div>
          )}
          {fieldError?.field === 'image' && (
            <p className='absolute left-0 -bottom-7 text-typo-caption text-tag-red-text whitespace-nowrap bg-white/70'>
              {fieldError.message}
            </p>
          )}
        </div>

        {/* 이메일 */}
        <div className='w-full flex gap-3 text-typo-base font-light justify-self-stretch items-start'>
          <span className='text-brand-blue-700'>가입 이메일: </span>
          <p
            className='flex-1 min-w-0 max-h-6 text-brand-gray-400 truncate'
            title={initialUserInfo.email && initialUserInfo.email.length > 18 ? initialUserInfo.email : undefined}
          >
            {initialUserInfo.email}
          </p>
        </div>

        {/* 닉네임 */}
        <div className='flex flex-col w-full justify-self-stretch'>
          <div className='flex gap-3 text-typo-base font-light items-center'>
            <label
              htmlFor='username'
              className='shrink-0'
            >
              <div className='text-brand-blue-700'>{`뚤레 닉네임: `}</div>
            </label>
            {isEdit ? (
              <input
                id='username'
                type='text'
                maxLength={9}
                placeholder={'뚤레 닉네임 입력'}
                value={userInfo.username}
                onChange={(e) => setUserInfo((prev) => ({ ...prev, username: e.target.value }))}
                className='inline-block w-full min-w-0 flex-1 h-8 py-2 box-border focus:outline-none placeholder:text-brand-gray-400 border rounded-sm bg-brand-gray-100 border-brand-gray-200 px-2'
                disabled={!isEdit}
              />
            ) : (
              <p
                className='flex-1 min-w-0 truncate'
                title={userInfo.username.length > 12 ? userInfo.username : undefined}
              >
                {userInfo.username}
              </p>
            )}
          </div>
        </div>
        {/* 에러 - 필드/폼 레벨 통합 */}
        <p className='text-left text-typo-caption text-tag-red-text min-h-4.5 -mt-4 -mr-11'>
          {' '}
          {fieldError?.field !== 'image' && fieldError?.message}
        </p>

        <button
          onClick={confirmWithdraw}
          className='hover:underline text-brand-gray-500 font-light text-left justify-self-start'
        >
          탈퇴하기
        </button>

        <div className='row-span-2 w-full flex gap-4 justify-self-stretch'>
          {isEdit && (
            <>
              <button
                className='flex-1 h-12 rounded-sm text-typo-base box-border font-medium bg-brand-gray-50 text-brand-gray-400 border border-brand-gray-200'
                onClick={handleCancel}
                disabled={isPending}
              >
                취소
              </button>
              <button
                className='flex-1 h-12 rounded-sm text-typo-base box-border font-medium bg-brand-blue-700 text-brand-gray-0 border border-transparent'
                onClick={handleSubmit}
                disabled={isPending}
              >
                {isPending ? '수정 중...' : '수정하기'}
              </button>
            </>
          )}
        </div>
      </div>
    </NotePage>
  );
}
