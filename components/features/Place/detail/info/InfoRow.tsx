import { Icon, IconName } from '@/components/common/Icon';

interface InfoRowProps {
  iconName: IconName;
  children: React.ReactNode;
}

export default function InfoRow({ iconName, children }: InfoRowProps) {
  return (
    <div className='flex gap-4 items-start w-full overflow-hidden h-5'>
      <div className='flex flex-col items-center justify-center px-1 shrink-0 h-5'>
        <Icon
          name={iconName}
          size={18}
          className='shrink-0 text-brand-blue-700'
        />
      </div>
      <div className='flex-1 min-w-0'>{children}</div>
    </div>
  );
}
