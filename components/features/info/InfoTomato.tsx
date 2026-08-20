import Image from 'next/image';

interface InfoTomatoProps {
  onClick: () => void;
}

export default function InfoTomato({ onClick }: InfoTomatoProps) {
  return (
    <div
      className='flex flex-col items-center mb-1'
      onClick={onClick}
    >
      <div className='relative group cursor-pointer'>
        <div className='absolute flex flex-col items-center -top-12.5 -left-9 drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-white transition-opacity duration-200 rounded-lg size-max px-2.5 py-1 opacity-0 group-hover:pointer-events-auto group-hover:opacity-100'>
          <p className='text-typo-base text-brand-gray-600 p-1'>안녕하세요? 뚤레예요.</p>
          {/* <span className='text-typo-caption text-brand-blue-400'>클릭해주세요</span> */}
        </div>
        <div className='absolute top-1 left-1 blue-tomato-flag'>
          <Image
            src='/images/bluetomato2.webp'
            width={90}
            height={77.91}
            alt='tomato-base'
          />
        </div>

        <Image
          src='/images/bluetomato1.webp'
          width={90}
          height={77.91}
          alt='tomato-base'
        />
      </div>
    </div>
  );
}
