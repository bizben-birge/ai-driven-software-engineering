import { describe, it, expect } from 'vitest';
import { checkAvailability } from './validation';
import { MAX_BOOKING_MINUTES, MINUTE_IN_DAY } from './bookingRules';
import { SAMPLE_ROOMS, DEFAULT_CURRENT_TIME } from '../sampleData';
import type { Room } from '../types';

const NOW = 540;

function makeRoom(): Room {
  return {
    id: 'A101',
    name: 'Room A101',
    building: 'Engineering Block',
    capacity: 40,
    blocked: false,
    bookings: [
      { start: 780, end: 840, label: 'Software Engineering Practice' },
      { start: 600, end: 660, label: 'Data Structures Lecture' },
    ],
  };
}

describe('Practice #09 regression tests', () => {
  it('REG-A1: accepts 660-780 that touches both bookings', () => {
    const room = makeRoom();
    const result = checkAvailability(room, 660, 780, NOW);
    expect(result.available).toBe(true);
    expect(result.reasons).toEqual([]);
  });

  it('REG-B1: available check keeps bookings order and values', () => {
    const room = makeRoom();
    const before = structuredClone(room.bookings);
    const result = checkAvailability(room, 660, 720, NOW);
    expect(result.available).toBe(true);
    expect(room.bookings).toEqual(before);
  });

  it('REG-B2: unavailable check keeps bookings order and values', () => {
    const room = makeRoom();
    const before = structuredClone(room.bookings);
    const result = checkAvailability(room, 630, 690, NOW);
    expect(result.available).toBe(false);
    expect(room.bookings).toEqual(before);
  });

  it('REG-B3: never mutates bookings (frozen fixture, all paths)', () => {
    const room = makeRoom();
    Object.freeze(room.bookings);
    const before = structuredClone(room.bookings);
    expect(() => checkAvailability(room, 660, 720, NOW)).not.toThrow();
    expect(() => checkAvailability(room, 630, 690, NOW)).not.toThrow();
    expect(() => checkAvailability({ ...room, blocked: true }, 660, 720, NOW)).not.toThrow();
    expect(room.bookings).toEqual(before);
  });

  // ──────────────────────────────────────────────────────────────────
  // REG-C: scenario-specific regression guards.
  // Each test explains its expectation in terms of AC1–AC6.
  // ──────────────────────────────────────────────────────────────────

  // AC1 requires start > currentTime. A start at 530 (ten minutes before
  // NOW=540) is in the past, so the interval is invalid regardless of end.
  // The decision must be unavailable and the reason must mention "current
  // time" (AC6: descriptive feedback).
  it('REG-C1: rejects past start time (AC1, AC6)', () => {
    const room = makeRoom();
    const result = checkAvailability(room, 530, 570, NOW);
    expect(result.available).toBe(false);
    expect(result.reasons.length).toBeGreaterThan(0);
    expect(result.reasons.join(' ').toLowerCase()).toContain('current time');
  });

  // AC1 requires start < end. With start=700 and end=670 the interval is
  // reversed, so validateInterval must reject it. The reason must mention
  // "before" (AC6).
  it('REG-C2: rejects reversed interval start > end (AC1, AC6)', () => {
    const room = makeRoom();
    const result = checkAvailability(room, 700, 670, NOW);
    expect(result.available).toBe(false);
    expect(result.reasons.length).toBeGreaterThan(0);
    expect(result.reasons.join(' ').toLowerCase()).toContain('before');
  });

  // AC2 rejects any booking whose duration exceeds 120 minutes. 700–821 is
  // 121 minutes — one minute over the cap — so it must be unavailable with a
  // "maximum duration" reason (AC6). This guards against off-by-one errors at
  // the boundary.
  it('REG-C3: rejects 121-minute duration (AC2, AC6)', () => {
    const room = makeRoom();
    const result = checkAvailability(room, 700, 821, NOW);
    expect(result.available).toBe(false);
    expect(result.reasons.length).toBeGreaterThan(0);
    expect(result.reasons.join(' ').toLowerCase()).toContain('maximum duration');
  });

  // AC3 rejects any booking when the room is blocked, independent of interval
  // validity. A perfectly valid 660–720 slot on a blocked room must still be
  // unavailable, and the reason must mention "blocked" (AC6).
  it('REG-C4: rejects blocked room even with valid interval (AC3, AC6)', () => {
    const room = makeRoom();
    const result = checkAvailability({ ...room, blocked: true }, 660, 720, NOW);
    expect(result.available).toBe(false);
    expect(result.reasons.length).toBeGreaterThan(0);
    expect(result.reasons.join(' ').toLowerCase()).toContain('blocked');
  });

  // AC4 rejects intervals that overlap an existing booking. 630–690 overlaps
  // the 600–660 "Data Structures Lecture" (630 < 660 && 600 < 690), so it must
  // be unavailable with an "overlap" reason (AC6).
  it('REG-C5: rejects overlapping interval (AC4, AC6)', () => {
    const room = makeRoom();
    const result = checkAvailability(room, 630, 690, NOW);
    expect(result.available).toBe(false);
    expect(result.reasons.length).toBeGreaterThan(0);
    expect(result.reasons.join(' ').toLowerCase()).toContain('overlap');
  });

  // AC4 explicitly allows touching endpoints: an interval that starts exactly
  // where an existing booking ends (or ends exactly where one starts) does not
  // overlap. 570–600 touches the 600–660 booking at its start edge, and
  // 840–960 touches the 780–840 booking at its end edge. Both must be
  // available with no reasons.
  it('REG-C6: accepts touching endpoints before and after existing bookings (AC4)', () => {
    const room = makeRoom();

    const before = checkAvailability(room, 570, 600, NOW);
    expect(before.available).toBe(true);
    expect(before.reasons).toEqual([]);

    const after = checkAvailability(room, 840, 960, NOW);
    expect(after.available).toBe(true);
    expect(after.reasons).toEqual([]);
  });

  // AC5 requires that the availability decision never mutates existing booking
  // data. Running every rejection path (past, reversed, over-duration,
  // blocked, overlap) plus an available path must leave the room's bookings
  // array identical to the snapshot taken before any call.
  it('REG-C7: all rejection paths leave bookings unchanged (AC5)', () => {
    const room = makeRoom();
    const before = structuredClone(room.bookings);

    checkAvailability(room, 530, 570, NOW);                      // past start
    checkAvailability(room, 700, 670, NOW);                      // reversed
    checkAvailability(room, 700, 821, NOW);                      // over duration
    checkAvailability({ ...room, blocked: true }, 660, 720, NOW); // blocked
    checkAvailability(room, 630, 690, NOW);                      // overlap
    checkAvailability(room, 660, 720, NOW);                      // available

    expect(room.bookings).toEqual(before);
  });

  // Guard against accidental changes to the shared rule constants and sample
  // fixtures that every other test and the UI depend on. AC1 references 1440
  // (MINUTE_IN_DAY) and AC2 references 120 (MAX_BOOKING_MINUTES); if either
  // value drifts, acceptance behaviour changes silently. SAMPLE_ROOMS and
  // DEFAULT_CURRENT_TIME must also stay structurally identical.
  it('REG-C8: rule constants and sample fixtures are unchanged (AC1–AC6 baseline)', () => {
    expect(MAX_BOOKING_MINUTES).toBe(120);
    expect(MINUTE_IN_DAY).toBe(1440);
    expect(DEFAULT_CURRENT_TIME).toBe(540);

    expect(SAMPLE_ROOMS).toHaveLength(2);
    expect(SAMPLE_ROOMS[0].id).toBe('A101');
    expect(SAMPLE_ROOMS[0].blocked).toBe(false);
    expect(SAMPLE_ROOMS[0].bookings).toEqual([
      { start: 600, end: 660, label: 'Data Structures Lecture' },
    ]);
    expect(SAMPLE_ROOMS[1].id).toBe('B202');
    expect(SAMPLE_ROOMS[1].blocked).toBe(true);
    expect(SAMPLE_ROOMS[1].bookings).toEqual([]);
  });
});

describe('Task #08 mitigation 1 — invalid currentTime rejection (AC1, AC6)', () => {
  // AC1 requires a valid currentTime so the "start must be after now" check
  // is not bypassed. NaN comparisons always return false, so without this
  // guard a NaN/negative/out-of-range currentTime silently makes every slot
  // look available. These tests pin the fix.

  it('REG-D1: rejects NaN currentTime', () => {
    const room = makeRoom();
    const result = checkAvailability(room, 660, 720, NaN);
    expect(result.available).toBe(false);
    expect(result.reasons.length).toBeGreaterThan(0);
    expect(result.reasons.join(' ').toLowerCase()).toContain('current time');
  });

  it('REG-D2: rejects negative currentTime (-1)', () => {
    const room = makeRoom();
    const result = checkAvailability(room, 660, 720, -1);
    expect(result.available).toBe(false);
    expect(result.reasons.length).toBeGreaterThan(0);
    expect(result.reasons.join(' ').toLowerCase()).toContain('current time');
  });

  it('REG-D3: rejects currentTime beyond 1440 (1441)', () => {
    const room = makeRoom();
    const result = checkAvailability(room, 660, 720, 1441);
    expect(result.available).toBe(false);
    expect(result.reasons.length).toBeGreaterThan(0);
    // Distinguishes the new range check from the old "after current time" check.
    expect(result.reasons.join(' ').toLowerCase()).toContain('between 0 and 1440');
  });

  it('REG-D4: empty Current Time field value is treated as invalid, not 0', () => {
    const room = makeRoom();
    // Mirrors the App.tsx conversion: empty string -> NaN (not 0).
    const emptyFieldValue = '';
    const currentTime = emptyFieldValue === '' ? NaN : Number(emptyFieldValue);
    const result = checkAvailability(room, 300, 360, currentTime);
    expect(result.available).toBe(false);
    expect(result.reasons.length).toBeGreaterThan(0);
    expect(result.reasons.join(' ').toLowerCase()).toContain('current time');
  });

  it('REG-D5: valid currentTime (540) keeps normal AC1–AC6 behaviour', () => {
    const room = makeRoom();
    const result = checkAvailability(room, 660, 720, 540);
    expect(result.available).toBe(true);
    expect(result.reasons).toEqual([]);
  });
});
