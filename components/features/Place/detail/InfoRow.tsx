import { Icon, IconName } from '@/components/common/Icon';

interface InfoRowProps {
  iconName: IconName;
  children: React.ReactNode;
}

export default function InfoRow({ iconName, children }: InfoRowProps) {
  return (
    <div className='flex gap-4 items-center w-full'>
      <div className='flex items-center px-1'>
        <Icon
          name={iconName}
          size={18}
          className='shrink-0 text-brand-blue-700'
        />
      </div>
      <div className='flex-1'>{children}</div>
    </div>
  );
}
