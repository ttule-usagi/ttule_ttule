export type PlanStatus = 'upcoming' | 'last' | 'current';
interface GetPlanStatusProps {
  departure: string | null;
  arrival: string | null;
  isDateUndecided: boolean;
}

/**
 * 여행의 현재 상태를 판별합니다. (진행중 포함, 3분류)
 *
 * @param props.departure 출발일
 * @param props.arrival 도착일
 * @param props.isDateUndecided 날짜 미정 여부 — true면 무조건 'upcoming' 반환
 * @returns 'upcoming' | 'last' | 'current' 중 하나
 */
export function getPlanStatus({ departure, arrival, isDateUndecided }: GetPlanStatusProps): PlanStatus {
  // 일정 미정이면 => 다가오는 여행
  if (isDateUndecided || !departure || !arrival) return 'upcoming';

  const today = new Date();
  const departureDate = new Date(departure);
  const arrivalDate = new Date(arrival);
  arrivalDate.setHours(23, 59, 59, 999); // 도착 시간을 그날의 끝 시각으로 보정

  // 오늘 날짜가 여행 일정에 포함되면 => 현재 여행
  if (today >= departureDate && today <= arrivalDate) return 'current';

  // 출발일이 오늘 뒤면 => 다가오는 여행
  if (departureDate > today) return 'upcoming';

  // 나머지는 지난 여행
  return 'last';
}
