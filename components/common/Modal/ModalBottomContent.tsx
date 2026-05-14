interface ModalBottomContentProps {
  children: React.ReactNode;
}

export default function ModalBottomContent({ children }: ModalBottomContentProps) {
  return <div className='flex justify-center items-center gap-2.5'>{children}</div>;
}
