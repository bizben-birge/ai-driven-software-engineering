import { timeToMinutes } from '../utils/time';

export interface BookingRequest {
  startMin: number;
  endMin: number;
  currentTime: number;
}

export function parseBookingRequest(
  startTimeStr: string,
  endTimeStr: string,
  currentTimeStr: string
): BookingRequest {
  return {
    startMin: timeToMinutes(startTimeStr),
    endMin: parseInt(endTimeStr, 10),
    currentTime: currentTimeStr.trim() === '' ? NaN : Number(currentTimeStr),
  };
}
