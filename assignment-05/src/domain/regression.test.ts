import { describe, it, expect } from 'vitest';
import { checkAvailability } from './availability';
import { MAX_BOOKING_MINUTES, MINUTE_IN_DAY } from './bookingRules';
import { ROOM_CATALOG, DEFAULT_CURRENT_TIME } from '../data/rooms';
import { makeRoom as makeBaseRoom, NOW } from '../test/fixtures';
import pkg from '../../package.json';

function makeRoom() {
  return makeBaseRoom({
    bookings: [
      { start: 780, end: 840, label: 'Software Engineering Practice' },
      { start: 600, end: 660, label: 'Data Structures Lecture' },
    ],
  });
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

  it('REG-C8: rule constants and original rooms are unchanged (AC1–AC6 baseline)', () => {
    expect(MAX_BOOKING_MINUTES).toBe(120);
    expect(MINUTE_IN_DAY).toBe(1440);
    expect(DEFAULT_CURRENT_TIME).toBe(540);

    expect(ROOM_CATALOG.length).toBeGreaterThanOrEqual(4);
    const a101 = ROOM_CATALOG.find((r) => r.id === 'A101');
    const b202 = ROOM_CATALOG.find((r) => r.id === 'B202');
    expect(a101?.blocked).toBe(false);
    expect(a101?.bookings).toEqual([
      { start: 600, end: 660, label: 'Data Structures Lecture' },
    ]);
    expect(b202?.blocked).toBe(true);
    expect(b202?.bookings).toEqual([]);
  });
});

describe('Assignment #05 mitigation 2 — unused database client stays removed', () => {
  it('REG-DEP: package.json has no @supabase/supabase-js dependency', () => {
    expect(pkg.dependencies).not.toHaveProperty('@supabase/supabase-js');
    expect(pkg.devDependencies).not.toHaveProperty('@supabase/supabase-js');
  });
});
