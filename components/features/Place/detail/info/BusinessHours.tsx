import { Icon } from '@/components/common/Icon';
import InfoRow from './InfoRow';

export default function BusinessHours() {
  return (
    <>
      <InfoRow iconName='Clock'>
        <p className='text-typo-description text-brand-gray-500'>영업시간 확인 안됨</p>
      </InfoRow>
      <div className='flex gap-2 items-center bg-brand-blue-50 px-2.5 py-2 rounded-sm'>
        <Icon
          name='Announcement'
          size={16}
          className='text-brand-blue-300'
        />
        <p className='text-typo-caption text-brand-gray-500 whitespace-nowrap font-light'>
          정확한 영업시간은 구글맵에서 확인해주세요
        </p>
      </div>
    </>
  );
}
