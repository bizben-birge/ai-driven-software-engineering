import type { Booking } from '../types';

export type ReasonCode =
  | 'AVAILABLE'
  | 'INVALID_START_TIME'
  | 'PAST_START_TIME'
  | 'INVALID_DURATION'
  | 'DURATION_TOO_LONG'
  | 'ENDS_AFTER_MIDNIGHT'
  | 'ROOM_BLOCKED'
  | 'OVERLAP';

export type DecisionKind = 'available' | 'unavailable' | 'validation_error';

export interface CheckRequest {
  startTime: string;
  duration: string;
  blocked: boolean;
  bookings: readonly Booking[];
  now: number;
}

export interface ValidRequest {
  start: number;
  end: number;
  duration: number;
}

export type ValidationOutcome =
  | { ok: true; value: ValidRequest }
  | { ok: false; reasonCode: ReasonCode };

export interface Decision {
  available: boolean;
  kind: DecisionKind;
  reasonCode: ReasonCode;
  message: string;
}
