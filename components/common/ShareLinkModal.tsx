import { Icon } from './Icon';

interface ShareLinkModalProps {
  title: string;
  description: string;
  link: string;
}

export default function ShareLinkModal({ title, description, link }: ShareLinkModalProps) {
  return (
    <div className='h-full w-full bg-[rgba(38,38,38,50)] flex items-center justify-center z-50'>
      <div className='flex flex-col gap-5 bg-white max-w-140 aspect-560/191 rounded-lg relative pt-7 px-6 pb-6'>
        <Icon
          name='XClose'
          size={32}
          className='absolute top-3 right-3 text-brand-gray-500'
        />

        <div className='flex flex-col gap-0.5'>
          <p className='text-typo-sub-title text-brand-blue-700'>{title}</p>
          <p className='text-typo-description text-brand-gray-600'>{description}</p>
        </div>

        <div className='flex flex-col gap-1'>
          <p className='text-typo-caption text-brand-gray-400'>공유 링크</p>

          <div className='flex justify-between'>
            <div className='flex flex-1 bg-brand-gray-200 py-3 px-4 gap-2.5'>
              <Icon
                name='Link'
                size={16}
                className='text-brand-gray-400'
              />
              <p className='flex-1 text-typo-description text-brand-gray-700'>{link}</p>
            </div>
            <button className='flex items-center justify-center gap-1 bg-brand-blue-700 text-typo-base text-brand-gray-0 max-w-32'>
              <Icon
                name='Copy'
                size={16}
                className='text-brand-gray-0'
              />
              링크 복사
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
