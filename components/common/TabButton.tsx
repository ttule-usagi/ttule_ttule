interface TabButtonProps {
  activated: boolean;
  buttonText: string;
  onSetTab: () => void;
}

export default function TabButton({ activated, buttonText, onSetTab }: TabButtonProps) {
  return (
    <button
      className={`text-typo-base py-1.5 box-border h-full border-b-2 ${activated ? 'font-medium text-brand-blue-800 border-brand-blue-700' : 'text-brand-gray-500 border-transparent'}`}
      onClick={onSetTab}
    >
      {buttonText}
    </button>
  );
}
