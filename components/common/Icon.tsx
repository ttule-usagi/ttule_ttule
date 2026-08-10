import AlertCircle from '@/assets/icons/alert-circle.svg';
import Announcement from '@/assets/icons/announcement.svg';
import ArrowLeft from '@/assets/icons/arrow-left.svg';
import ArrowRight from '@/assets/icons/arrow-right.svg';
import BookmarkCheck from '@/assets/icons/bookmark-check.svg';
import Bookmark from '@/assets/icons/bookmark.svg';
import BookmarkFilled from '@/assets/icons/bookmarked.svg';
import CalendarPlus from '@/assets/icons/calendar-plus.svg';
import Calendar from '@/assets/icons/calendar.svg';
import Camera from '@/assets/icons/camera.svg';
import CheckboxChecked from '@/assets/icons/check-square.svg';
import Check from '@/assets/icons/check.svg';
import ChevronDown from '@/assets/icons/chevron-down.svg';
import ChevronLeft from '@/assets/icons/chevron-left.svg';
import ChevronRight from '@/assets/icons/chevron-right.svg';
import ChevronUp from '@/assets/icons/chevron-up.svg';
import Clock from '@/assets/icons/clock.svg';
import Columns from '@/assets/icons/columns.svg';
import Copy from '@/assets/icons/copy.svg';
import DotsHorizontal from '@/assets/icons/dots-horizontal.svg';
import Duplicate from '@/assets/icons/duplicate.svg';
import Edit from '@/assets/icons/edit.svg';
import Globe from '@/assets/icons/globe.svg';
import Google from '@/assets/icons/google.svg';
import Hamburger from '@/assets/icons/hamburger.svg';
import Image from '@/assets/icons/image.svg';
import LinkThin from '@/assets/icons/link-thin.svg';
import Link from '@/assets/icons/link.svg';
import Lock from '@/assets/icons/lock.svg';
import Luggage from '@/assets/icons/luggage.svg';
import Map from '@/assets/icons/map.svg';
import MessageDots from '@/assets/icons/message-dots.svg';
import Minus from '@/assets/icons/minus.svg';
import Naver from '@/assets/icons/naver.svg';
import PageLeft from '@/assets/icons/page-left.svg';
import PageRight from '@/assets/icons/page-right.svg';
import Plus from '@/assets/icons/plus.svg';
import RatingStar from '@/assets/icons/rating-star.svg';
import RoundStar from '@/assets/icons/round-star.svg';
import Search from '@/assets/icons/search.svg';
import Setting from '@/assets/icons/settings.svg';
import Share from '@/assets/icons/share.svg';
import UserPlus from '@/assets/icons/user-plus.svg';
import XClose from '@/assets/icons/x-close.svg';

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
  Lock,
  LinkThin,
  Naver,
  RoundStar,
  BookmarkCheck,
  Duplicate,
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
