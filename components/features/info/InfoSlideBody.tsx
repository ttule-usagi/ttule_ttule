interface InfoSlideBodyProps {
  media: React.ReactNode;
  description: React.ReactNode;
  features: React.ReactNode[];
  upcomingFeatures?: React.ReactNode[];
}

export default function InfoSlideBody({ media, description, features, upcomingFeatures }: InfoSlideBodyProps) {
  return (
    <div className='flex flex-col gap-4 items-start w-full overflow-y-auto'>
      <div className='w-full h-36 rounded-lg border border-brand-gray-200'>{media}</div>

      <div className='text-brand-gray-700 text-typo-base-bold w-full mt-1'>{description}</div>

      <ul className='flex flex-col gap-3 text-brand-gray-600 text-typo-description w-full'>
        {features.map((feature, i) => (
          <li
            key={i}
            className='flex gap-1'
          >
            <span className='font-bold shrink-0'>·</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {upcomingFeatures && upcomingFeatures.length > 0 && (
        <>
          <hr className='w-full border-brand-gray-200' />
          <div className='flex flex-col gap-3 w-full'>
            <p className='text-brand-gray-700 text-typo-base-bold'>추가 예정 기능</p>
            <ul className='flex flex-col gap-2 text-brand-gray-600 text-typo-description mb-4'>
              {upcomingFeatures.map((feature, i) => (
                <li
                  key={i}
                  className='flex gap-1'
                >
                  <span className='font-bold shrink-0'>·</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
