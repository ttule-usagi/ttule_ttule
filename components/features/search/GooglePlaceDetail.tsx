import { SelectedGooglePlace } from '@/types/googleSearchApiDetail';
import { Icon } from '../../common/Icon';
import Link from 'next/link';

interface Props {
  place: SelectedGooglePlace;
  onClose: () => void;
}

export default function GooglePlaceDetail({ place, onClose }: Props) {
  console.log(place);

  const getBusinessStatus = (status?: string) => {
    switch (status) {
      case 'OPERATIONAL':
        return '정상 영업 중';
      case 'CLOSED_PERMANENTLY':
        return '폐업';
      case 'CLOSED_TEMPORARILY':
        return '임시 휴무';
      default:
        return '영업 정보 없음';
    }
  };

  return (
    <div className='absolute flex-col w-90 min-w-75 top-25 -right-95 flex py-5 px-4 bg-brand-gray-0 rounded-lg shadow-lg'>
      <div className='pb-4 border-b-1 border-b-brand-gray-300'>
        <div className='flex-col'>
          <h3 className='text-typo-sub-title text-brand-gray-600 max-w-75'>{place.displayName.text}</h3>
          <span className='text-typo-base text-brand-gray-500'>{place.additionalData?.displayName?.text}</span>
        </div>
        <span className='text-typo-description text-brand-gray-500'>{place.primaryTypeDisplayName?.text}</span>
        <Icon
          className='absolute top-5 right-4 text-brand-gray-600 cursor-pointer'
          name='XClose'
          size={30}
          onClick={onClose}
        />
      </div>
      <div className='flex flex-col gap-3 pt-5'>
        <div className='flex flex-row gap-4'>
          <Icon
            className='shrink-0 mt-[2px]'
            name='Map'
            size={16}
          />
          <span className='text-typo-description text-brand-gray-500'>{place.additionalData?.formattedAddress}</span>
        </div>
        <div className='flex items-center flex-row gap-4'>
          <Icon
            className='text-brand-blue-700'
            name='Clock'
            size={16}
          />
          <span className='text-typo-description text-brand-gray-500'>
            {getBusinessStatus(place.additionalData?.businessStatus)}
          </span>
        </div>
        <Link
          href={place.additionalData?.googleMapsUri || '#'}
          target='_blank'
          rel='noopener noreferrer'
        >
          <div className='flex flex-row gap-[6px] items-center justify-center m-auto h-10 r-2 text-typo-description font-medium text-brand-blue-700 border-1 border-brand-gray-200 rounded-lg size-full hover:bg-brand-gray-50'>
            <Icon
              className=''
              name='Google'
              size={15}
            />
            구글에서 확인하기
          </div>
        </Link>
        <div className='flex flex-row gap-[6px] items-center justify-center m-auto h-10 r-2 text-typo-description font-medium text-white bg-brand-blue-700 rounded-lg size-full'>
          이 장소로 등록하기
        </div>
      </div>
    </div>
  );
}
