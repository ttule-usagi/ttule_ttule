interface DropDownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function DropDownItem({ children, onClick }: DropDownItemProps) {
  return (
    <div
      className='w-full text-typo-base font-light text-left text-brand-gray-700 cursor-pointer hover:bg-brand-gray-100 rounded-lg px-5 py-2 '
      onClick={onClick}
    >
      {children}
    </div>
  );
}
