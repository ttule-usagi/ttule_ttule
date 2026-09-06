import { Icon } from '@/components/common/Icon';
import { TagColor } from '@/lib/constants/tag';

import ColorPickerButton from './ColorPickerButton';

interface TagRowProps {
  color: TagColor;
  name: string;
  onDelete: () => void;
  onChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeColor: (color: TagColor) => void;
}

export default function TagRow({ color, name, onChangeName, onDelete, onChangeColor }: TagRowProps) {
  return (
    <div className='flex items-center gap-2'>
      <ColorPickerButton
        value={color}
        onChangeColor={onChangeColor}
      />

      <div className='flex-1 relative'>
        <input
          type='text'
          className='items-center box-border w-full border-transparent rounded-lg px-3 h-12 bg-brand-gray-100 border focus:outline-none focus:bg-brand-gray-0 focus:border-brand-blue-400 hover:bg-brand-gray-200 text-brand-gray-700 placeholder-brand-gray-400'
          value={name}
          onChange={onChangeName}
          placeholder='태그명'
        />
        <button
          onClick={onDelete}
          className='absolute right-3 top-3 text-brand-gray-500 cursor-pointer hover:text-brand-blue-800'
        >
          <Icon
            name='XClose'
            size={24}
          />
        </button>
      </div>
    </div>
  );
}
