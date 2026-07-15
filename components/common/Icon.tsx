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
import ChevronRight from '@/assets/icons/chevron-right.svg';
import ChevronLeft from '@/assets/icons/chevron-left.svg';
import Check from '@/assets/icons/check.svg';
import Image from '@/assets/icons/image.svg';
import RatingStar from '@/assets/icons/rating-star.svg';
import Minus from '@/assets/icons/minus.svg';
import AlertCircle from '@/assets/icons/alert-circle.svg';
import Announcement from '@/assets/icons/announcement.svg';
import Globe from '@/assets/icons/globe.svg';
import CalendarPlus from '@/assets/icons/calendar-plus.svg';
import ChevronUp from '@/assets/icons/chevron-up.svg';
import BookmarkFilled from '@/assets/icons/bookmarked.svg';
import Hamburger from '@/assets/icons/hamburger.svg';
import MessageDots from '@/assets/icons/message-dots.svg';
import PageLeft from '@/assets/icons/page-left.svg';
import PageRight from '@/assets/icons/page-right.svg';
import Columns from '@/assets/icons/columns.svg';
import CheckboxChecked from '@/assets/icons/check-square.svg';
import Setting from '@/assets/icons/settings.svg';
import UserPlus from '@/assets/icons/user-plus.svg';

export const ICONS = {
  Luggage,
  Bookmark,
  BookmarkFilled,
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
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Image,
  RatingStar,
  Minus,
  AlertCircle,
  Announcement,
  Globe,
  CalendarPlus,
  Hamburger,
  MessageDots,
  PageLeft,
  PageRight,
  Columns,
  CheckboxChecked,
  Setting,
  UserPlus,
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
