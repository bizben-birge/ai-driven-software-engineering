import { describe, it, expect } from 'vitest';
import { checkAvailability } from './validation';
import type { Room, Booking } from '../types';

const NOW = 540;

function makeRoom(overrides: Partial<Room> = {}): Room {
  const bookings: Booking[] = overrides.bookings ?? [
    { start: 600, end: 660, label: 'Data Structures Lecture' },
  ];
  return {
    id: 'A101',
    name: 'Room A101',
    building: 'Engineering Block',
    capacity: 40,
    blocked: overrides.blocked ?? false,
    bookings: bookings.map((b) => ({ ...b })),
  };
}

/** Helper: assert the result is unavailable with at least one non-empty reason. */
function expectUnavailable(
  result: { available: boolean; reasons: string[] },
  label: string,
): void {
  expect(result.available, `${label} should be unavailable`).toBe(false);
  expect(result.reasons.length, `${label} should have at least one reason`).toBeGreaterThan(0);
  for (const reason of result.reasons) {
    expect(typeof reason, `${label} reason should be a string`).toBe('string');
    expect(reason.length, `${label} reason should be non-empty`).toBeGreaterThan(0);
  }
}

/** Helper: assert the result is available with zero reasons. */
function expectAvailable(
  result: { available: boolean; reasons: string[] },
  label: string,
): void {
  expect(result.available, `${label} should be available`).toBe(true);
  expect(result.reasons, `${label} should have no reasons`).toEqual([]);
}

describe('checkAvailability — acceptance criteria AC1–AC6', () => {
  // ──────────────────────────────────────────────
  // AC1: Accept only when 0 ≤ start < end ≤ 1440 and start > currentTime.
  // ──────────────────────────────────────────────

  // T02 — 540–570, starts at current time → false (AC1)
  it('T02: rejects when start equals current time', () => {
    const room = makeRoom();
    const result = checkAvailability(room, 540, 570, NOW);
    expectUnavailable(result, 'T02');
    expect(result.reasons.join(' ').toLowerCase()).toContain('current time');
  });

  // T03 — 720–720, zero duration → false (AC1)
  it('T03: rejects zero-duration interval', () => {
    const room = makeRoom();
    const result = checkAvailability(room, 720, 720, NOW);
    expectUnavailable(result, 'T03');
  });

  // T04 — 750–720, reversed → false (AC1)
  it('T04: rejects reversed interval (start > end)', () => {
    const room = makeRoom();
    const result = checkAvailability(room, 750, 720, NOW);
    expectUnavailable(result, 'T04');
  });

  // T05 — 1380–1441, past day end → false (AC1)
  it('T05: rejects end beyond 1440', () => {
    const room = makeRoom();
    const result = checkAvailability(room, 1380, 1441, NOW);
    expectUnavailable(result, 'T05');
    expect(result.reasons.join(' ')).toContain('1440');
  });

  // T16 — 1320–1440, ends exactly at 24:00 → true (AC1, AC2)
  it('T16: accepts interval ending exactly at 1440', () => {
    const room = makeRoom();
    const result = checkAvailability(room, 1320, 1440, NOW);
    expectAvailable(result, 'T16');
  });

  // T17 — 541–571, one minute after now → true (AC1)
  it('T17: accepts start one minute after current time', () => {
    const room = makeRoom();
    const result = checkAvailability(room, 541, 571, NOW);
    expectAvailable(result, 'T17');
  });

  // Boundary: negative start → false (AC1: 0 ≤ start)
  it('BOUNDARY: rejects negative start (-1)', () => {
    const room = makeRoom();
    const result = checkAvailability(room, -1, 60, NOW);
    expectUnavailable(result, 'negative start');
  });

  // Boundary: NaN inputs → false (AC1: must be valid numbers)
  it('BOUNDARY: rejects NaN inputs', () => {
    const room = makeRoom();
    const result = checkAvailability(room, NaN, NaN, NOW);
    expectUnavailable(result, 'NaN inputs');
  });

  // ──────────────────────────────────────────────
  // AC2: Reject bookings longer than 120 minutes.
  // ──────────────────────────────────────────────

  // T06 — 720–840, exactly 120 minutes → true (AC2)
  it('T06: accepts exactly 120-minute booking', () => {
    const room = makeRoom();
    const result = checkAvailability(room, 720, 840, NOW);
    expectAvailable(result, 'T06');
  });

  // T07 — 720–841, 121 minutes → false (AC2)
  it('T07: rejects 121-minute booking', () => {
    const room = makeRoom();
    const result = checkAvailability(room, 720, 841, NOW);
    expectUnavailable(result, 'T07');
    expect(result.reasons.join(' ').toLowerCase()).toContain('maximum duration');
  });

  // ──────────────────────────────────────────────
  // AC3: Reject when room is blocked.
  // ──────────────────────────────────────────────

  // T13 — 660–720, blocked = true → false (AC3)
  it('T13: rejects when room is blocked', () => {
    const room = makeRoom({ blocked: true });
    const result = checkAvailability(room, 660, 720, NOW);
    expectUnavailable(result, 'T13');
    expect(result.reasons.join(' ').toLowerCase()).toContain('blocked');
  });

  // ──────────────────────────────────────────────
  // AC4: Reject overlapping intervals; touching endpoints allowed.
  // ──────────────────────────────────────────────

  // T01 — 660–720, touching after existing → true (AC4)
  it('T01: accepts touching-endpoint after existing booking', () => {
    const room = makeRoom();
    const result = checkAvailability(room, 660, 720, NOW);
    expectAvailable(result, 'T01');
  });

  // T08 — 570–600, touching before existing → true (AC4)
  it('T08: accepts touching-endpoint before existing booking', () => {
    const room = makeRoom();
    const result = checkAvailability(room, 570, 600, NOW);
    expectAvailable(result, 'T08');
  });

  // T09 — 630–690, partial overlap → false (AC4)
  it('T09: rejects partial overlap with existing booking', () => {
    const room = makeRoom();
    const result = checkAvailability(room, 630, 690, NOW);
    expectUnavailable(result, 'T09');
    expect(result.reasons.join(' ').toLowerCase()).toContain('overlap');
  });

  // T10 — 570–690, contains existing booking → false (AC4)
  it('T10: rejects interval that contains existing booking', () => {
    const room = makeRoom();
    const result = checkAvailability(room, 570, 690, NOW);
    expectUnavailable(result, 'T10');
    expect(result.reasons.join(' ').toLowerCase()).toContain('overlap');
  });

  // T11 — 615–645, inside existing booking → false (AC4)
  it('T11: rejects interval inside existing booking', () => {
    const room = makeRoom();
    const result = checkAvailability(room, 615, 645, NOW);
    expectUnavailable(result, 'T11');
    expect(result.reasons.join(' ').toLowerCase()).toContain('overlap');
  });

  // T12 — 600–660, identical to existing → false (AC4)
  it('T12: rejects interval identical to existing booking', () => {
    const room = makeRoom();
    const result = checkAvailability(room, 600, 660, NOW);
    expectUnavailable(result, 'T12');
    expect(result.reasons.join(' ').toLowerCase()).toContain('overlap');
  });

  // T14 — 630–690, no bookings → true (AC4)
  it('T14: accepts overlapping-looking interval when no bookings exist', () => {
    const room = makeRoom({ bookings: [] });
    const result = checkAvailability(room, 630, 690, NOW);
    expectAvailable(result, 'T14');
  });

  // ──────────────────────────────────────────────
  // AC5: Decision without mutating existing booking data.
  // ──────────────────────────────────────────────

  // T15 — 630–690, default fixture → false + bookings unchanged (AC5)
  it('T15: rejects overlapping interval and leaves bookings unchanged', () => {
    const room = makeRoom();
    const snapshot: Booking[] = room.bookings.map((b) => ({ ...b }));
    const result = checkAvailability(room, 630, 690, NOW);
    expectUnavailable(result, 'T15');
    expect(room.bookings).toEqual(snapshot);
  });

  // AC5 also: available decision must not mutate bookings
  it('AC5-avail: available decision does not mutate bookings', () => {
    const room = makeRoom();
    const snapshot: Booking[] = room.bookings.map((b) => ({ ...b }));
    const result = checkAvailability(room, 660, 720, NOW);
    expectAvailable(result, 'AC5-avail');
    expect(room.bookings).toEqual(snapshot);
  });

  // ──────────────────────────────────────────────
  // AC6: Understandable validation feedback.
  // Verifies that each rejection type produces a reason containing
  // a keyword relevant to that specific failure mode — catching
  // right-decision-for-wrong-reason bugs.
  // ──────────────────────────────────────────────

  it('AC6: each rejection type produces a relevant, descriptive reason', () => {
    const cases: Array<{
      label: string;
      start: number;
      end: number;
      room: Room;
      keyword: string;
    }> = [
      { label: 'starts at now', start: 540, end: 570, room: makeRoom(), keyword: 'current time' },
      { label: 'zero duration', start: 720, end: 720, room: makeRoom(), keyword: 'before' },
      { label: 'reversed', start: 750, end: 720, room: makeRoom(), keyword: 'before' },
      { label: 'past day end', start: 1380, end: 1441, room: makeRoom(), keyword: '1440' },
      { label: 'over max duration', start: 720, end: 841, room: makeRoom(), keyword: 'maximum duration' },
      { label: 'blocked room', start: 660, end: 720, room: makeRoom({ blocked: true }), keyword: 'blocked' },
      { label: 'overlap', start: 630, end: 690, room: makeRoom(), keyword: 'overlap' },
    ];

    for (const c of cases) {
      const result = checkAvailability(c.room, c.start, c.end, NOW);
      expectUnavailable(result, c.label);
      expect(
        result.reasons.join(' ').toLowerCase(),
        `case "${c.label}" reason should contain "${c.keyword}"`,
      ).toContain(c.keyword);
    }
  });
});
