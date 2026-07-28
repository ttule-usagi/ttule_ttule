import InfoRow from './InfoRow';

export default function WebsiteUri({ websiteUri }: { websiteUri: string }) {
  return (
    <InfoRow iconName='Globe'>
      <a
        href={websiteUri}
        target='_blank'
        rel='noopener noreferrer'
        className='text-typo-description text-brand-gray-500 underline truncate '
      >
        {websiteUri.replace(/^https?:\/\//, '')}
      </a>
    </InfoRow>
  );
}
