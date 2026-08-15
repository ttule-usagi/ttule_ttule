import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useCheckCorePlaceExists } from '@/hooks/new-place/useCheckCorePlaceRegistered';
import { useModalStore } from '@/lib/store/modalStore';
import { SelectedGooglePlace } from '@/types/googleSearchApiDetail';

import { Icon } from '../../common/Icon';

interface Props {
  place: SelectedGooglePlace;
  addNewPlace: () => void;
  onClose: () => void;
}

export default function GooglePlaceDetail({ place, addNewPlace, onClose }: Props) {
  const router = useRouter();
  const { open } = useModalStore();
  const { data: existingCorePlaceId } = useCheckCorePlaceExists(place.id);

  const handleClickAddButton = () => {
    if (existingCorePlaceId) {
      open({
        type: 'confirmAction',
        props: {
          description: '이미 등록되어 있는 장소예요. \n 해당 장소로 이동하시겠어요?',
          confirmButtonText: '이동하기',
          onConfirm: () => router.push(`/places/detail/${existingCorePlaceId}`),
        },
      });
      return;
    }

    addNewPlace();
  };

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

  // 검색결과 중 'ㅣ'가 들어있는 에외처리
  const getDisplayName = (placeName?: string) => {
    if (!placeName) return '';
    if (placeName.includes('ㅣ')) return placeName.split('ㅣ')[0].trim();
    return placeName;
  };

  return (
    <div className='absolute flex-col w-90 min-w-75 top-30 -right-92 flex py-5 px-4 bg-brand-gray-0 rounded-lg shadow-lg'>
      <div className='pb-4 border-b-1 border-b-brand-gray-300'>
        <div className='flex-col'>
          <h3 className='text-typo-sub-title text-brand-gray-600 max-w-75'>{getDisplayName(place.displayName.text)}</h3>
          <span className='text-typo-base text-brand-gray-500'>
            {getDisplayName(place.additionalData?.displayName?.text)}
          </span>
        </div>
        <span className='text-typo-description text-brand-gray-500'>
          {place.additionalData?.primaryTypeDisplayName?.text}
        </span>
        <Icon
          className='absolute top-5 right-4 text-brand-gray-600 cursor-pointer hover:bg-brand-gray-100 rounded-full'
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
          <span className='text-typo-description text-brand-gray-500'>{place.formattedAddress}</span>
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
        <div
          className='flex flex-row gap-[6px] items-center justify-center m-auto h-10 r-2 text-typo-description font-medium text-white bg-brand-blue-700 rounded-lg size-full hover:bg-brand-blue-800 cursor-pointer'
          onClick={handleClickAddButton}
        >
          이 장소로 등록하기
        </div>
      </div>
    </div>
  );
}
