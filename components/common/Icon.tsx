import Luggage from '@/assets/icons/luggage.svg';
import Bookmark from '@/assets/icons/bookmark.svg';
import Camera from '@/assets/icons/camera.svg';
import DotsHorizontal from '@/assets/icons/dots-horizontal.svg';
import Calendar from '@/assets/icons/calendar.svg';
import Clock from '@/assets/icons/clock.svg';
import ArrowRight from '@/assets/icons/arrow-right.svg';
import Copy from '@/assets/icons/copy.svg';
import Link from '@/assets/icons/link.svg';
import XClose from '@/assets/icons/x-close.svg';
import Google from '@/assets/icons/google.svg';
import Plus from '@/assets/icons/plus.svg';

export const ICONS = {
  Luggage,
  Bookmark,
  Camera,
  DotsHorizontal,
  Calendar,
  Clock,
  ArrowRight,
  Copy,
  Link,
  XClose,
  Google,
  Plus,
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
