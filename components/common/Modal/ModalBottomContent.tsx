interface ModalBottomContentProps {
  children: React.ReactNode;
  classname?: string;
}

export default function ModalBottomContent({ children, classname }: ModalBottomContentProps) {
  return <div className={classname || 'flex justify-center items-center gap-2.5'}>{children}</div>;
}
