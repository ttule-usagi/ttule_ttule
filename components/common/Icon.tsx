import Luggage from '@/assets/icons/luggage.svg';
import Bookmark from '@/assets/icons/bookmark.svg';
import Camera from '@/assets/icons/camera.svg';

console.log('Luggage:', Luggage); // 실제 값 확인
console.log('Type:', typeof Luggage); // 타입 확인

export const ICONS = {
  Luggage,
  Bookmark,
  Camera,
} as const;

export type IconName = keyof typeof ICONS;

export type IconProps = {
  name: IconName;
  size?: number;
} & React.SVGProps<SVGSVGElement>;

export function Icon({ name, size = 16, ...props }: IconProps) {
  const SvgComponent = ICONS[name];
  return (
    <SvgComponent
      width={size}
      height={size}
      {...props}
    />
  );
}
