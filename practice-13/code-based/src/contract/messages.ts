import { MAX_BOOKING_MINUTES } from '../utils/bookingRules';
import { minutesToLabel } from '../utils/time';
import type { Booking } from '../types';
import type { DecisionKind, ReasonCode, ValidRequest } from './types';

export function kindFor(reasonCode: ReasonCode): DecisionKind {
  if (reasonCode === 'AVAILABLE') return 'available';
  if (reasonCode === 'ROOM_BLOCKED' || reasonCode === 'OVERLAP') return 'unavailable';
  return 'validation_error';
}

export function messageFor(
  reasonCode: ReasonCode,
  now: number,
  request?: ValidRequest,
  conflict?: Booking
): string {
  const slot = request ? `${minutesToLabel(request.start)}-${minutesToLabel(request.end)}` : '';
  switch (reasonCode) {
    case 'AVAILABLE':
      return `Available: the room is free from ${slot}.`;
    case 'OVERLAP':
      return conflict
        ? `Unavailable: ${slot} overlaps the existing booking ${minutesToLabel(conflict.start)}-${minutesToLabel(conflict.end)}.`
        : `Unavailable: ${slot} overlaps an existing booking.`;
    case 'ROOM_BLOCKED':
      return 'Unavailable: the room is blocked, so it cannot be booked.';
    case 'INVALID_START_TIME':
      return 'Please enter the start time as HH:MM, for example 11:30.';
    case 'PAST_START_TIME':
      return `The start time must be in the future (after ${minutesToLabel(now)}).`;
    case 'INVALID_DURATION':
      return 'The duration must be a whole number of minutes greater than 0.';
    case 'DURATION_TOO_LONG':
      return `The duration must be ${MAX_BOOKING_MINUTES} minutes or less.`;
    case 'ENDS_AFTER_MIDNIGHT':
      return 'The booking must end by 24:00 on the same day.';
  }
}
