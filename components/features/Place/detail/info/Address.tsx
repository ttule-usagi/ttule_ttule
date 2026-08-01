import InfoRow from './InfoRow';

export default function Address({ address }: { address: string }) {
  return (
    <InfoRow iconName='Map'>
      <p className='text-typo-description text-brand-gray-500'>{address}</p>
    </InfoRow>
  );
}
