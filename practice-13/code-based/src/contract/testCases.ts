import type { DecisionKind, ReasonCode } from './types';

export interface SharedCase {
  id: string;
  title: string;
  startTime: string;
  duration: string;
  blocked: boolean;
  expectedKind: DecisionKind;
  expectedReason: ReasonCode;
}

export const SHARED_CASES: readonly SharedCase[] = [
  { id: 'T1', title: 'valid free interval', startTime: '11:30', duration: '60', blocked: false, expectedKind: 'available', expectedReason: 'AVAILABLE' },
  { id: 'T2', title: 'overlap with an existing booking', startTime: '10:30', duration: '60', blocked: false, expectedKind: 'unavailable', expectedReason: 'OVERLAP' },
  { id: 'T3', title: 'blocked room', startTime: '11:30', duration: '60', blocked: true, expectedKind: 'unavailable', expectedReason: 'ROOM_BLOCKED' },
  { id: 'T4', title: 'duration = 0', startTime: '11:30', duration: '0', blocked: false, expectedKind: 'validation_error', expectedReason: 'INVALID_DURATION' },
  { id: 'T5', title: 'duration = 121 minutes', startTime: '11:30', duration: '121', blocked: false, expectedKind: 'validation_error', expectedReason: 'DURATION_TOO_LONG' },
  { id: 'T6', title: 'past start time', startTime: '08:00', duration: '30', blocked: false, expectedKind: 'validation_error', expectedReason: 'PAST_START_TIME' },
  { id: 'T7', title: 'adjacent non-overlapping interval', startTime: '11:00', duration: '60', blocked: false, expectedKind: 'available', expectedReason: 'AVAILABLE' },
];
