import type { AvailabilityResult } from '../types';

export const MAX_LABEL_LENGTH = 60;
export const MAX_EXPLANATION_LENGTH = 320;
export const EXPLANATION_TIMEOUT_MS = 1200;

export const REASON_CODES = [
  'AVAILABLE', 'INVALID_TIME', 'INVALID_CURRENT_TIME', 'PAST_TIME',
  'TOO_LONG', 'BLOCKED', 'OVERLAP', 'OTHER_UNAVAILABLE',
] as const;

export type ReasonCode = typeof REASON_CODES[number];

export interface ExplanationInput {
  roomLabel: string;
  start: number | null;
  end: number | null;
  isAvailable: boolean;
  reasonCode: ReasonCode;
}

export interface ExplanationResponse {
  explanation: string;
}

export type ExplanationSource = 'mock' | 'fallback';
export type FailureCode = 'INVALID_INPUT' | 'TIMEOUT' | 'API_ERROR' | 'MISSING_KEY' | 'INVALID_OUTPUT';

export interface ExplanationResult extends ExplanationResponse {
  source: ExplanationSource;
  failure?: FailureCode;
  elapsedMs: number;
}

export class ExplanationError extends Error {
  constructor(public readonly code: FailureCode) {
    super(code);
    this.name = 'ExplanationError';
  }
}

const INPUT_KEYS = ['roomLabel', 'start', 'end', 'isAvailable', 'reasonCode'];

function isMinute(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 1440;
}

export function validateExplanationInput(value: unknown): ExplanationInput {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ExplanationError('INVALID_INPUT');
  }
  const input = value as Record<string, unknown>;
  const keys = Object.keys(input);
  if (keys.length !== INPUT_KEYS.length || keys.some(key => !INPUT_KEYS.includes(key))) {
    throw new ExplanationError('INVALID_INPUT');
  }
  if (typeof input.roomLabel !== 'string' || input.roomLabel.trim() !== input.roomLabel ||
      input.roomLabel.length < 1 || input.roomLabel.length > MAX_LABEL_LENGTH ||
      !/^[A-Za-z0-9][A-Za-z0-9 _-]*$/.test(input.roomLabel) ||
      typeof input.isAvailable !== 'boolean' ||
      !REASON_CODES.includes(input.reasonCode as ReasonCode)) {
    throw new ExplanationError('INVALID_INPUT');
  }
  const reasonCode = input.reasonCode as ReasonCode;
  if (input.isAvailable !== (reasonCode === 'AVAILABLE')) {
    throw new ExplanationError('INVALID_INPUT');
  }
  const validTimes = isMinute(input.start) && isMinute(input.end);
  const invalidTimeContext = reasonCode === 'INVALID_TIME' &&
    (input.start === null || isMinute(input.start)) &&
    (input.end === null || isMinute(input.end));
  if (!validTimes && !invalidTimeContext) throw new ExplanationError('INVALID_INPUT');
  if (reasonCode !== 'INVALID_TIME' && (input.start as number) >= (input.end as number)) {
    throw new ExplanationError('INVALID_INPUT');
  }
  return {
    roomLabel: input.roomLabel,
    start: input.start as number | null,
    end: input.end as number | null,
    isAvailable: input.isAvailable,
    reasonCode,
  };
}

export function buildExplanationInput(
  roomLabel: string,
  start: number,
  end: number,
  result: AvailabilityResult,
): ExplanationInput {
  const reason = result.reasons[0] ?? '';
  let reasonCode: ReasonCode = result.available ? 'AVAILABLE' : 'OTHER_UNAVAILABLE';
  if (!result.available) {
    if (reason.startsWith('Current time must')) reasonCode = 'INVALID_CURRENT_TIME';
    else if (reason.startsWith('Start time must be after')) reasonCode = 'PAST_TIME';
    else if (reason.startsWith('Booking exceeds')) reasonCode = 'TOO_LONG';
    else if (reason.startsWith('This room is currently blocked')) reasonCode = 'BLOCKED';
    else if (reason.startsWith('The requested interval overlaps')) reasonCode = 'OVERLAP';
    else if (reason.startsWith('Please enter') || reason.startsWith('Times must') ||
             reason.startsWith('Start time must be before')) reasonCode = 'INVALID_TIME';
  }
  return {
    roomLabel,
    start: isMinute(start) ? start : null,
    end: isMinute(end) ? end : null,
    isAvailable: result.available,
    reasonCode,
  };
}

export function validateExplanationResponse(value: unknown): ExplanationResponse {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ExplanationError('INVALID_OUTPUT');
  }
  const response = value as Record<string, unknown>;
  const keys = Object.keys(response);
  if (keys.length !== 1 || keys[0] !== 'explanation' || typeof response.explanation !== 'string') {
    throw new ExplanationError('INVALID_OUTPUT');
  }
  const explanation = response.explanation;
  if (!explanation.trim() || explanation.length > MAX_EXPLANATION_LENGTH ||
      /[<>\r\n]/.test(explanation) || explanation.split(/[.!?]+/).filter(s => s.trim()).length > 2) {
    throw new ExplanationError('INVALID_OUTPUT');
  }
  return { explanation };
}
