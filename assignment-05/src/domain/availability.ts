import type { Booking, Room, ValidationResult, AvailabilityResult } from '../types';
import { MAX_BOOKING_MINUTES, MINUTE_IN_DAY, durationMinutes } from './bookingRules';

const VALID: ValidationResult = { valid: true, reason: '' };

function invalid(reason: string): ValidationResult {
  return { valid: false, reason };
}

export function validateInterval(
  start: number,
  end: number,
  currentTime: number
): ValidationResult {
  if (isNaN(start) || isNaN(end)) {
    return invalid('Please enter valid numbers for start and end times.');
  }
  if (start < 0 || end > MINUTE_IN_DAY) {
    return invalid(`Times must be between 0 and ${MINUTE_IN_DAY} (00:00–24:00).`);
  }
  if (start >= end) {
    return invalid('Start time must be before end time.');
  }
  if (!Number.isFinite(currentTime) || currentTime < 0 || currentTime > MINUTE_IN_DAY) {
    return invalid(`Current time must be between 0 and ${MINUTE_IN_DAY} (00:00–24:00).`);
  }
  if (start <= currentTime) {
    return invalid(`Start time must be after the current time (${currentTime} min).`);
  }
  return VALID;
}

export function checkDuration(start: number, end: number): ValidationResult {
  if (durationMinutes(start, end) > MAX_BOOKING_MINUTES) {
    return invalid(`Booking exceeds the maximum duration of ${MAX_BOOKING_MINUTES} minutes.`);
  }
  return VALID;
}

export function overlapsExisting(
  start: number,
  end: number,
  bookings: readonly Pick<Booking, 'start' | 'end'>[]
): boolean {
  return bookings.some((b) => start < b.end && b.start < end);
}

export function checkAvailability(
  room: Room,
  start: number,
  end: number,
  currentTime: number
): AvailabilityResult {
  const reasons: string[] = [];

  const interval = validateInterval(start, end, currentTime);
  if (!interval.valid) {
    reasons.push(interval.reason);
  }

  const duration = checkDuration(start, end);
  if (!duration.valid) {
    reasons.push(duration.reason);
  }

  if (room.blocked) {
    reasons.push('This room is currently blocked and unavailable for booking.');
  }

  if (interval.valid && overlapsExisting(start, end, room.bookings)) {
    reasons.push('The requested interval overlaps an existing booking.');
  }

  return { available: reasons.length === 0, reasons };
}
