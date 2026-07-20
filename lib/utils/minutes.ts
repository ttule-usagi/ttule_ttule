/**
 * 분을 읽기 쉬운 시간 단위로 변환합니다.
 * - 60분 미만: N분
 * - 60분 이상: N시간 / N시간 N분
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `약 ${minutes}분`;

  const hours = Math.floor(minutes / 60);
  const remainMinutes = minutes % 60;

  if (remainMinutes === 0) return `약 ${hours}시간`;
  return `약 ${hours}시간 ${remainMinutes}분`;
}
