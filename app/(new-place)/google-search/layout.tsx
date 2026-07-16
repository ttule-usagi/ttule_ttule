// app/(new-place)/layout.tsx
import Sidebar from '@/components/layouts/sidebar/Sidebar';

export default async function NewPlaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='relative overflow-hidden'>
      <Sidebar />
      <div className='ml-[64px]'>{children}</div>
    </div>
  );
}
