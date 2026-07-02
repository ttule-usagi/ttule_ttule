interface ModalContentProps {
  children: React.ReactNode;
}

export default function ModalContent({ children }: ModalContentProps) {
  return <div className='text-typo-description text-brand-gray-600 text-center whitespace-pre-line'>{children}</div>;
}
