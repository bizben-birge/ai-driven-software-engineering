import type { Room, ValidationResult, AvailabilityResult } from '../types';
import { MAX_BOOKING_MINUTES, MINUTE_IN_DAY } from './bookingRules';

export function validateInterval(
  start: number,
  end: number,
  currentTime: number
): ValidationResult {
  if (isNaN(start) || isNaN(end)) {
    return { valid: false, reason: 'Please enter valid numbers for start and end times.' };
  }
  if (!Number.isFinite(currentTime) || currentTime < 0 || currentTime > MINUTE_IN_DAY) {
    return {
      valid: false,
      reason: 'Current time must be a number between 0 and 1440 (00:00–24:00).',
    };
  }
  if (start < 0 || end > MINUTE_IN_DAY) {
    return { valid: false, reason: 'Times must be between 0 and 1440 (00:00–24:00).' };
  }
  if (start >= end) {
    return { valid: false, reason: 'Start time must be before end time.' };
  }
  if (start <= currentTime) {
    return {
      valid: false,
      reason: `Start time must be after the current time (${currentTime} min).`,
    };
  }
  return { valid: true, reason: '' };
}

export function checkDuration(start: number, end: number): ValidationResult {
  if (end - start > MAX_BOOKING_MINUTES) {
    return {
      valid: false,
      reason: `Booking exceeds the maximum duration of ${MAX_BOOKING_MINUTES} minutes.`,
    };
  }
  return { valid: true, reason: '' };
}

export function overlapsExisting(
  start: number,
  end: number,
  bookings: { start: number; end: number }[]
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
