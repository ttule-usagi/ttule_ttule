type ToggleMenuModalProps = {
  children: React.ReactNode;
};

export default function ToggleMenuModal({ children }: ToggleMenuModalProps) {
  return <div className='flex flex-col bg-white gap-4 rounded-lg px-5 py-4 shadow-md min-w-60.25'>{children}</div>;
}
