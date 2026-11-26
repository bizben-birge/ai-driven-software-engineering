import { computeAvailability, findConflict } from './availability';
import { kindFor, messageFor } from './messages';
import type { CheckRequest, Decision } from './types';
import { validateRequest } from './validation';

export function checkRoom(request: CheckRequest): Decision {
  const validation = validateRequest(request.startTime, request.duration, request.now);
  if (!validation.ok) {
    return {
      available: false,
      kind: kindFor(validation.reasonCode),
      reasonCode: validation.reasonCode,
      message: messageFor(validation.reasonCode, request.now),
    };
  }

  const reasonCode = computeAvailability(validation.value, request.blocked, request.bookings);
  const conflict = reasonCode === 'OVERLAP' ? findConflict(validation.value, request.bookings) : undefined;
  return {
    available: reasonCode === 'AVAILABLE',
    kind: kindFor(reasonCode),
    reasonCode,
    message: messageFor(reasonCode, request.now, validation.value, conflict),
  };
}
