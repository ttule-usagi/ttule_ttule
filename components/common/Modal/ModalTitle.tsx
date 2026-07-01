interface ModalTitleProps {
  title: string;
  description?: string;
  error?: boolean;
}

export default function ModalTitle({ title, description, error = false }: ModalTitleProps) {
  return (
    <div className='flex flex-col gap-0.5 items-center'>
      <p className={`text-typo-sub-title ${error ? 'text-tag-red-text' : 'text-brand-blue-700'} `}>{title}</p>
      {description && <p className='text-typo-description text-brand-gray-600'>{description}</p>}
    </div>
  );
}
