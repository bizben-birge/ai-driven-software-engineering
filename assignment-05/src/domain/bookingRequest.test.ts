import { describe, it, expect } from 'vitest';
import { parseBookingRequest } from './bookingRequest';
import { checkAvailability } from './availability';
import { timeToMinutes } from '../utils/time';
import { makeRoom } from '../test/fixtures';

function oldInlineParsing(start: string, end: string, now: string) {
  return { startMin: timeToMinutes(start), endMin: parseInt(end, 10), currentTime: Number(now) };
}

const FORM_INPUTS: [string, string, string][] = [
  ['09:30', '630', '540'],
  ['11:00', '720', '540'],
  ['12:00', '841', '540'],
  ['08:00', '600', '540'],
  ['05:00', '360', '-1'],
  ['', '', '540'],
  ['10:00', '630.75', '540'],
  ['10:00', '700abc', '540'],
];

describe('parseBookingRequest (Task 03 refactoring, behaviour must stay identical)', () => {
  it('PARSE-1: parses normal form values into minutes', () => {
    expect(parseBookingRequest('09:30', '630', '540')).toEqual({ startMin: 570, endMin: 630, currentTime: 540 });
  });

  it('PARSE-2: keeps each original parser for edge inputs', () => {
    const parsed = parseBookingRequest('', '630.75', '');
    expect(parsed.startMin).toBeNaN();
    expect(parsed.endMin).toBe(630);
    expect(parsed.currentTime).toBeNaN();
  });

  it('PARSE-4: empty current time becomes NaN, not 0 (AC-A fix; the old inline parsing gave 0)', () => {
    const room = makeRoom();
    expect(oldInlineParsing('05:00', '360', '').currentTime).toBe(0);
    const parsed = parseBookingRequest('05:00', '360', '');
    expect(parsed.currentTime).toBeNaN();
    expect(checkAvailability(room, parsed.startMin, parsed.endMin, parsed.currentTime).available).toBe(false);
  });

  it.each(FORM_INPUTS)('PARSE-3: same result as the old inline parsing for %s / %s / %s', (start, end, now) => {
    const room = makeRoom();
    const before = oldInlineParsing(start, end, now);
    const after = parseBookingRequest(start, end, now);
    expect(after).toEqual(before);
    expect(checkAvailability(room, after.startMin, after.endMin, after.currentTime)).toEqual(
      checkAvailability(room, before.startMin, before.endMin, before.currentTime)
    );
  });
});
