import type { ExplanationInput, ReasonCode } from './contract';

const REASON_EXPLANATIONS: Record<Exclude<ReasonCode, 'AVAILABLE'>, string> = {
  INVALID_TIME: 'The requested time is missing, invalid, out of range, or not in increasing order.',
  INVALID_CURRENT_TIME: 'The current time must be a valid minute between 0 and 1440.',
  PAST_TIME: 'The start time must be later than the current time.',
  TOO_LONG: 'The requested duration is longer than the 120-minute limit.',
  BLOCKED: 'This room is currently blocked.',
  OVERLAP: 'The requested interval overlaps an existing booking.',
  OTHER_UNAVAILABLE: 'The booking checker rejected this request; check the confirmed reasons above.',
};

export function factExplanation(input: ExplanationInput): string {
  if (input.isAvailable) {
    return `${input.roomLabel} is available for the requested interval. This is an availability check, not a reservation.`;
  }
  return `${input.roomLabel} is unavailable for this request. ${REASON_EXPLANATIONS[input.reasonCode as Exclude<ReasonCode, 'AVAILABLE'>]}`;
}
