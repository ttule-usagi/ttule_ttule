import CancelButton from '@/components/common/CancelButton';
import ConfirmButton from '@/components/common/ConfirmButton';
import ProfileImageUploader from '@/components/features/ProfileImageUploader';

export default function SignUp() {
  return (
    <div className='bg-brand-blue-50 w-screen h-screen flex items-center justify-center'>
      <main className='w-140 min-h-190.75 px-7.25 py-24.5 bg-[url("/images/bg-note.svg")] bg-no-repeat bg-cover'>
        <div className='w-full h-full flex flex-col items-center justify-center'>
          <p className='text-typo-title w-full font-medium text-brand-blue-800 mb-29.25'>뚤레뚤레 가입하기</p>

          <ProfileImageUploader />

          <div className='flex flex-col gap-5 font-light text-typo-base mt-7.75'>
            <div className='flex gap-3'>
              <span className='text-brand-blue-700'>구글 이메일:</span>
              <span className='text-brand-gray-400'>as;dfjk124@gmail.com</span>
            </div>
            <div className='flex gap-3'>
              <label
                className='text-brand-blue-700'
                htmlFor='nickname'
              >
                뚤레 닉네임:
              </label>
              <input
                type='text'
                className='text-typo-base font-light focus:outline-none placeholder:text-brand-gray-300'
                placeholder='랜덤닉네임'
                id='nickname'
              />
            </div>
          </div>

          <div className='flex gap-4 mt-18.25'>
            <CancelButton text='취소' />
            <ConfirmButton text='확인' />
          </div>
        </div>
      </main>
    </div>
  );
}
