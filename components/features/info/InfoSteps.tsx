import Image from 'next/image';

import InfoSlideBody from './InfoSlideBody';

export interface InfoStep {
  title: string;
  content: React.ReactNode;
}

export const InfoSteps: InfoStep[] = [
  {
    title: '여행 계획 편집',
    content: (
      <InfoSlideBody
        media={
          <Image
            src='/images/info_plan.jpg'
            alt='로비 화면'
            className='w-full h-full object-cover rounded-lg'
            height={144}
            width={340}
          />
        }
        description={
          <>
            <p>나만의 여행계획을 만들고,</p>
            <p>친구와 함께 편집할 수 있어요.</p>
          </>
        }
        features={[
          <>
            지도와 함께 보는 <strong className='font-bold'>단일 뷰</strong>, 일정을 모아 보는
            <strong className='font-bold'>전체 뷰</strong>를 지원해요
          </>,
          '여행 기간을 자유롭게 설정할 수 있어요(일정 미정 가능)',

          <>
            <strong className='font-bold'>장소·메모 일정</strong>으로 여행 계획을 자유롭게 구성할 수 있어요
          </>,

          <>
            <strong className='font-bold'>드래그</strong>로 일정의 순서를 바꾸거나, 화면을 스크롤 할 수 있어요
          </>,
          '장소 리스트에서 드래그로 간편하게 일정표에 일정 추가 가능',
          <>
            <strong className='font-bold'>편집모드</strong>로 한번에 편리하게 수정·관리할 수 있어요
          </>,
          <>
            공개여부를 설정하여 모두에게 <strong className='font-bold'>공유</strong>할 수 있어요
          </>,
        ]}
        upcomingFeatures={['체크리스트 기능', '지도에서 일정에 따른 이동 동선 확인']}
      />
    ),
  },
  {
    title: '장소 리스트',
    content: (
      <InfoSlideBody
        media={
          <Image
            src='/images/info_list.jpg'
            alt='장소 리스트 화면'
            className='w-full h-full object-cover rounded-lg'
            height={144}
            width={340}
          />
        }
        description={
          <>
            <p>나만의 장소 리스트에 장소를 추가하고,</p>
            <p>친구를 초대해 함께 관리할 수 있어요.</p>
          </>
        }
        features={[
          '여행 계획과 별도로 장소 리스트를 생성·관리해요',

          <>
            <strong className='font-bold'>지도</strong>에서 저장된 장소를 한 눈에 모아 볼 수 있어요
          </>,
          <>
            저장한 장소에 기록하고 싶은 <strong className='font-bold'>정보/메모</strong>를 자유롭게 추가해요
          </>,
          <>
            공개여부를 설정하여 모두에게 <strong className='font-bold'>공유</strong>할 수 있어요
          </>,
          <>
            단일/전체 <strong className='font-bold'>편집 모드</strong>로 간편하게 수정·관리할 수 있어요
          </>,
        ]}
        upcomingFeatures={[
          '태그 기반 필터링으로 원하는 장소만 빠르게 탐색',
          '사진이나 리스트에 포함된 장소를 일괄 추가·삭제',
        ]}
      />
    ),
  },
  {
    title: '장소 검색',
    content: (
      <InfoSlideBody
        media={
          <Image
            src='/images/info_search.jpg'
            alt='장소 검색 화면'
            className='w-full h-full object-cover rounded-lg'
            height={144}
            width={340}
          />
        }
        description={
          <>
            <p>다국어로 장소를 검색하여</p>
            <p>장소 리스트나 여행 계획에 추가할 수 있어요.</p>
          </>
        }
        features={[
          <>
            <strong className='font-bold'>지도</strong>에서 검색한 장소의 위치를 바로 확인할 수 있어요
          </>,
          '등록되지 않은 장소는 직접 추가할 수 있어요(구글 지도 기준)',
          '네이버와 구글에서 더 자세한 장소 정보를 확인할 수 있어요',

          <>
            장소를 친구와 <strong className='font-bold'>공유</strong>할 수 있어요
          </>,
        ]}
        upcomingFeatures={['유저 리뷰 및 별점', '장소 수정 리포트']}
      />
    ),
  },

  {
    title: '로비 화면',
    content: (
      <InfoSlideBody
        media={
          <Image
            src='/images/info_lobby.jpg'
            alt='로비 화면'
            className='w-full h-full object-cover rounded-lg'
            height={144}
            width={340}
          />
        }
        description={
          <>
            <p>나의 여행 계획을 한눈에 모아보고,</p>
            <p>간편하게 관리할 수 있어요.</p>
          </>
        }
        features={[
          '새로운 여행 계획을 만들 수 있어요',
          '초대받은 링크로 여행 계획에 참여할 수 있어요',
          '옵션을 통해 계획 정보 및 공유 등을 간편하게 관리해요',
          <>
            여행 계획을 <strong className='font-bold'>복제</strong>해서 새로운 계획을 만들 수 있어요
          </>,
          '여행 기간에 따라 계획을 구분해서 볼 수 있어요',
        ]}
        upcomingFeatures={['복제 옵션 설정(복제 권한·복제 범위)']}
      />
    ),
  },
];
