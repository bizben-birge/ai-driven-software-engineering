import { MAX_BOOKING_MINUTES, MINUTE_IN_DAY } from '../utils/bookingRules';
import type { ValidationOutcome } from './types';

export function parseStartTime(value: string): number {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value.trim());
  if (!match) return NaN;
  return Number(match[1]) * 60 + Number(match[2]);
}

export function parseDuration(value: string): number {
  const text = value.trim();
  if (!/^-?\d{1,4}$/.test(text)) return NaN;
  return Number(text);
}

export function validateRequest(startTime: string, duration: string, now: number): ValidationOutcome {
  const start = parseStartTime(startTime);
  if (!Number.isFinite(start)) return { ok: false, reasonCode: 'INVALID_START_TIME' };

  if (start <= now) return { ok: false, reasonCode: 'PAST_START_TIME' };

  const minutes = parseDuration(duration);
  if (!Number.isFinite(minutes) || minutes <= 0) return { ok: false, reasonCode: 'INVALID_DURATION' };
  if (minutes > MAX_BOOKING_MINUTES) return { ok: false, reasonCode: 'DURATION_TOO_LONG' };

  const end = start + minutes;
  if (end > MINUTE_IN_DAY) return { ok: false, reasonCode: 'ENDS_AFTER_MIDNIGHT' };

  return { ok: true, value: { start, end, duration: minutes } };
}
