import Luggage from '@/assets/icons/luggage.svg';
import Bookmark from '@/assets/icons/bookmark.svg';
import Camera from '@/assets/icons/camera.svg';
import DotsHorizontal from '@/assets/icons/dots-horizontal.svg';
import Calendar from '@/assets/icons/calendar.svg';
import Clock from '@/assets/icons/clock.svg';
import ArrowRight from '@/assets/icons/arrow-right.svg';

export const ICONS = {
  Luggage,
  Bookmark,
  Camera,
  DotsHorizontal,
  Calendar,
  Clock,
  ArrowRight,
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
