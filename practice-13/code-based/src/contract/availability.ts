import type { Booking } from '../types';
import { overlapsExisting } from '../utils/validation';
import type { ReasonCode, ValidRequest } from './types';

export function findConflict(request: ValidRequest, bookings: readonly Booking[]): Booking | undefined {
  return bookings.find((booking) => overlapsExisting(request.start, request.end, [booking]));
}

export function computeAvailability(
  request: ValidRequest,
  blocked: boolean,
  bookings: readonly Booking[]
): ReasonCode {
  if (blocked) return 'ROOM_BLOCKED';
  if (findConflict(request, bookings)) return 'OVERLAP';
  return 'AVAILABLE';
}
