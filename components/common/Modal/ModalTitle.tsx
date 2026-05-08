interface ModalTitleProps {
  title: string;
  description?: string;
}

export default function ModalTitle({ title, description }: ModalTitleProps) {
  return (
    <div className='flex flex-col gap-0.5 items-center'>
      <p className='text-typo-sub-title text-brand-blue-700'>{title}</p>
      {description && <p className='text-typo-description text-brand-gray-600'>{description}</p>}
    </div>
  );
}
