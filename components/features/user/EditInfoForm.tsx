'use client';

import Image from 'next/image';
import { useState } from 'react';

import CancelButton from '@/components/common/CancelButton';
import ConfirmButton from '@/components/common/ConfirmButton';
import { useConfirmWithdraw } from '@/hooks/user/useConfirmWithdraw';
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
    <div className='min-h-101.5 flex flex-col justify-center items-center mb-13.75'>
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

      <div className='max-w-3xs mt-5.75'>
        <div className='flex flex-col gap-1 font-light text-typo-base'>
          {/* 이메일 */}
          <div className='w-full flex gap-3 py-2 text-typo-base font-light min-w-87.5'>
            <span className='text-brand-blue-700'>가입 이메일: </span>
            <p className='flex-1 max-h-6 text-brand-gray-400'>{initialUserInfo.email}</p>
          </div>

          {/* 닉네임 */}
          <div className='flex flex-col'>
            <div className='w-full flex gap-3 py-2 text-typo-base font-light min-w-87.5'>
              <label htmlFor='username'>
                <div className='text-brand-blue-700'>{`뚤레 닉네임: `}</div>
              </label>
              <input
                id='username'
                type='text'
                placeholder={'뚤레 닉네임 입력'}
                value={userInfo.username}
                onChange={(e) => setUserInfo((prev) => ({ ...prev, username: e.target.value }))}
                className='flex-1 max-h-6 border-none focus:outline-none placeholder:text-brand-gray-400'
                disabled={!isEdit}
              />
            </div>
            {/* 닉네임 에러 */}
            {fieldError?.field === 'username' && (
              <p className='text-left w-full -mt-1 text-typo-caption text-tag-red-text'>{fieldError.message}</p>
            )}
          </div>
          {/* 폼 레벨 에러 - 이미지 수정 오류, 시스템 오류 등*/}
          {fieldError && !fieldError.field && (
            <p className='text-left w-full mt-1 text-typo-caption text-tag-red-text'>{fieldError.message}</p>
          )}
        </div>

        <button
          onClick={confirmWithdraw}
          className='hover:underline text-brand-gray-500 font-light mt-14'
        >
          탈퇴하기
        </button>

        <div className='flex w-full gap-4 mt-7.75'>
          {!isEdit ? (
            <button
              className='btn-small w-full bg-brand-blue-700 text-brand-gray-50'
              onClick={() => setIsEdit(true)}
            >
              정보 수정하기
            </button>
          ) : (
            <>
              <CancelButton
                text='취소'
                onClick={handleCancel}
                disabled={isPending}
              />
              <ConfirmButton
                text={isPending ? '수정 중...' : '수정하기'}
                onClick={handleSubmit}
                disabled={isPending}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
