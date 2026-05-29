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
import Map from '@/assets/icons/map.svg';
import ArrowLeft from '@/assets/icons/arrow-left.svg';
import Search from '@/assets/icons/search.svg';
import Share from '@/assets/icons/share.svg';
import Edit from '@/assets/icons/edit.svg';
import ChevronDown from '@/assets/icons/chevron-down.svg';
import Check from '@/assets/icons/check.svg';
import Image from '@/assets/icons/image.svg';

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
  Map,
  ArrowLeft,
  Search,
  Share,
  Edit,
  ChevronDown,
  Check,
  Image,
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
