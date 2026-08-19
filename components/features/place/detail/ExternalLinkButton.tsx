import { Icon } from '@/components/common/Icon';

interface ExternalLinkButtonProps {
  type: 'naver' | 'google';
  link: string;
}

export default function ExternalLinkButton({ type, link }: ExternalLinkButtonProps) {
  const isNaver = type === 'naver';

  return (
    <a
      href={link}
      target='_blank'
      rel='noopener noreferrer'
      className='flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 border border-brand-gray-200 rounded-lg bg-white hover:bg-brand-gray-100'
    >
      <Icon
        name={isNaver ? 'Naver' : 'Google'}
        size={isNaver ? 13 : 15}
      />
      <span className='text-typo-description font-medium text-brand-blue-700 whitespace-nowrap'>
        {isNaver ? '네이버' : '구글'}에서 보기
      </span>
    </a>
  );
}
