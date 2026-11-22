export const MAX_BOOKING_MINUTES = 120;
export const MINUTE_IN_DAY = 1440;

export function durationMinutes(start: number, end: number): number {
  return end - start;
}
