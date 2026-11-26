import { describe, expect, it } from 'vitest';
import { checkRoom } from './checkRoom';
import { CONTRACT_BOOKINGS, SIMULATED_NOW } from './fixtures';
import { SHARED_CASES } from './testCases';
import { parseDuration, parseStartTime, validateRequest } from './validation';
import { computeAvailability } from './availability';

function run(startTime: string, duration: string, blocked = false) {
  return checkRoom({ startTime, duration, blocked, bookings: CONTRACT_BOOKINGS, now: SIMULATED_NOW });
}

describe('Shared contract cases T1-T7', () => {
  it.each(SHARED_CASES)('$id $title', (testCase) => {
    const decision = run(testCase.startTime, testCase.duration, testCase.blocked);
    expect(decision.kind).toBe(testCase.expectedKind);
    expect(decision.reasonCode).toBe(testCase.expectedReason);
    expect(decision.available).toBe(testCase.expectedKind === 'available');
    expect(decision.message.length).toBeGreaterThan(10);
  });
});

describe('T8 booking data unchanged', () => {
  it('keeps the frozen fixture identical after all shared checks', () => {
    const before = JSON.stringify(CONTRACT_BOOKINGS);
    for (const testCase of SHARED_CASES) run(testCase.startTime, testCase.duration, testCase.blocked);
    expect(JSON.stringify(CONTRACT_BOOKINGS)).toBe(before);
    expect(Object.isFrozen(CONTRACT_BOOKINGS)).toBe(true);
    expect(CONTRACT_BOOKINGS).toHaveLength(1);
  });
});

describe('Boundaries', () => {
  it('accepts exactly 120 minutes and rejects 121', () => {
    expect(run('12:00', '120').reasonCode).toBe('AVAILABLE');
    expect(run('12:00', '121').reasonCode).toBe('DURATION_TOO_LONG');
  });

  it('rejects a start equal to the simulated current time', () => {
    expect(run('09:00', '30').reasonCode).toBe('PAST_START_TIME');
    expect(run('09:01', '30').reasonCode).toBe('AVAILABLE');
  });

  it('allows a booking that ends exactly when the existing booking starts', () => {
    expect(run('09:30', '30').reasonCode).toBe('AVAILABLE');
    expect(run('09:30', '31').reasonCode).toBe('OVERLAP');
  });

  it('reports overlap for containing and contained intervals', () => {
    expect(run('09:30', '120').reasonCode).toBe('OVERLAP');
    expect(run('10:15', '15').reasonCode).toBe('OVERLAP');
  });

  it('gives validation errors before blocked or overlap reasons', () => {
    expect(run('10:30', '0', true).reasonCode).toBe('INVALID_DURATION');
    expect(run('08:00', '30', true).reasonCode).toBe('PAST_START_TIME');
  });

  it('checks the start time before the duration, as in the accepted plan', () => {
    expect(run('08:00', '0').reasonCode).toBe('PAST_START_TIME');
    expect(run('08:00', '121').reasonCode).toBe('PAST_START_TIME');
  });

  it('rejects malformed clock values that a loose parser would accept', () => {
    expect(run('25:00', '30').reasonCode).toBe('INVALID_START_TIME');
    expect(run('11:30abc', '30').reasonCode).toBe('INVALID_START_TIME');
    expect(run('11:60', '30').reasonCode).toBe('INVALID_START_TIME');
  });

  it('puts blocked before overlap', () => {
    expect(run('10:30', '60', true).reasonCode).toBe('ROOM_BLOCKED');
  });

  it('rejects a booking that would end after midnight', () => {
    expect(run('23:30', '30').reasonCode).toBe('AVAILABLE');
    expect(run('23:30', '31').reasonCode).toBe('ENDS_AFTER_MIDNIGHT');
  });
});

describe('Invalid input feedback (AC6)', () => {
  it.each([
    ['', '60', 'INVALID_START_TIME'],
    ['25:00', '60', 'INVALID_START_TIME'],
    ['11:30', '', 'INVALID_DURATION'],
    ['11:30', '-5', 'INVALID_DURATION'],
    ['11:30', '30.5', 'INVALID_DURATION'],
    ['11:30', 'abc', 'INVALID_DURATION'],
    ['11:30', '<script>', 'INVALID_DURATION'],
  ])('start %j duration %j gives %s', (startTime, duration, reason) => {
    const decision = run(startTime, duration);
    expect(decision.kind).toBe('validation_error');
    expect(decision.reasonCode).toBe(reason);
    expect(decision.available).toBe(false);
  });
});

describe('Separated layers', () => {
  it('parses input without deciding availability', () => {
    expect(parseStartTime('11:30')).toBe(690);
    expect(parseDuration(' 60 ')).toBe(60);
    expect(validateRequest('11:30', '60', SIMULATED_NOW)).toEqual({ ok: true, value: { start: 690, end: 750, duration: 60 } });
  });

  it('computes availability from a valid request only', () => {
    expect(computeAvailability({ start: 690, end: 750, duration: 60 }, false, CONTRACT_BOOKINGS)).toBe('AVAILABLE');
    expect(computeAvailability({ start: 630, end: 690, duration: 60 }, false, CONTRACT_BOOKINGS)).toBe('OVERLAP');
  });
});
