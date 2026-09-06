import DropDown from '@/components/common/Dropdown';
import { useDropdown } from '@/components/common/Dropdown/DropdownContext';
import { TAG_COLORS, TAG_PALETTE, TagColor } from '@/lib/constants/tag';

export default function ColorPickerButton({
  value,
  onChangeColor,
}: {
  value: TagColor;
  onChangeColor: (color: TagColor) => void;
}) {
  return (
    <DropDown
      placement='bottom-start'
      offsetValue={4}
    >
      <DropDown.Trigger className='rounded-lg border border-brand-gray-200 flex items-center justify-center p-2.5 box-border hover:bg-brand-gray-50'>
        <span className={`rounded-full w-7 h-7 ${value ? TAG_PALETTE[value] : TAG_PALETTE['red']}`} />
      </DropDown.Trigger>

      <DropDown.Menu className='bg-white px-4 py-3 z-1100 rounded-lg shadow-md border border-brand-gray-200'>
        <div
          role='radiogroup'
          aria-label='태그 색상 선택'
          className='flex items-center gap-3'
        >
          {TAG_COLORS.map((color, index) => (
            <ColorChip
              key={index}
              color={color}
              selected={value === color}
              onSelect={onChangeColor}
            />
          ))}
        </div>
      </DropDown.Menu>
    </DropDown>
  );
}

function ColorChip({
  color,
  selected,
  onSelect,
}: {
  color: TagColor;
  selected: boolean;
  onSelect: (color: TagColor) => void;
}) {
  const { close } = useDropdown();
  return (
    <button
      type='button'
      value={color}
      onClick={() => {
        onSelect(color);
        close();
      }}
      role='radio'
      aria-checked={selected}
      className={`rounded-full w-7 h-7 ${TAG_PALETTE[color]} cursor-pointer`}
    />
  );
}
