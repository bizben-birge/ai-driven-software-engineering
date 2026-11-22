import { describe, it, expect } from 'vitest';
import { filterRooms, hasAllEquipment, hasEnoughCapacity, resolveSelectedRoom } from './roomFilters';
import { checkAvailability } from './availability';
import { MINUTE_IN_DAY } from './bookingRules';
import { ROOM_CATALOG } from '../data/rooms';
import { makeRoom, NOW } from '../test/fixtures';

function ids(rooms: readonly { id: string }[]): string[] {
  return rooms.map((r) => r.id);
}

describe('Room catalog data', () => {
  it('DATA-1: has at least four rooms with unique IDs and all required fields', () => {
    expect(ROOM_CATALOG.length).toBeGreaterThanOrEqual(4);
    expect(new Set(ids(ROOM_CATALOG)).size).toBe(ROOM_CATALOG.length);
    for (const room of ROOM_CATALOG) {
      expect(room.name.length).toBeGreaterThan(0);
      expect(room.capacity).toBeGreaterThan(0);
      expect(Array.isArray(room.equipment)).toBe(true);
      expect(typeof room.blocked).toBe('boolean');
      expect(Array.isArray(room.bookings)).toBe(true);
    }
  });

  it('DATA-2: every booking is valid and bookings in one room do not overlap', () => {
    for (const room of ROOM_CATALOG) {
      const sorted = [...room.bookings].sort((a, b) => a.start - b.start);
      sorted.forEach((b, i) => {
        expect(b.start).toBeGreaterThanOrEqual(0);
        expect(b.end).toBeLessThanOrEqual(MINUTE_IN_DAY);
        expect(b.start).toBeLessThan(b.end);
        if (i > 0) expect(sorted[i - 1].end).toBeLessThanOrEqual(b.start);
      });
    }
  });
});

describe('F1 capacity filter', () => {
  it('F1-1: exact capacity is enough (40 seats, 40 attendees)', () => {
    expect(hasEnoughCapacity(makeRoom({ capacity: 40 }), 40)).toBe(true);
  });

  it('F1-2: insufficient capacity is excluded (40 seats, 41 attendees)', () => {
    expect(hasEnoughCapacity(makeRoom({ capacity: 40 }), 41)).toBe(false);
    expect(ids(filterRooms([makeRoom({ capacity: 40 })], { attendees: 41, equipment: [] }))).toEqual([]);
  });

  it('F1-3: catalog filter keeps only rooms with capacity >= attendees', () => {
    const result = filterRooms(ROOM_CATALOG, { attendees: 40, equipment: [] });
    expect(ids(result)).toEqual(['A101', 'C310']);
  });
});

describe('F2 equipment filter', () => {
  it('F2-1: room with all selected items matches', () => {
    const room = makeRoom({ equipment: ['Projector', 'Whiteboard'] });
    expect(hasAllEquipment(room, ['Projector', 'Whiteboard'])).toBe(true);
  });

  it('F2-2: room missing one selected item does not match', () => {
    const room = makeRoom({ equipment: ['Projector'] });
    expect(hasAllEquipment(room, ['Projector', 'Whiteboard'])).toBe(false);
  });

  it('F2-3: no selected equipment means only capacity is checked', () => {
    const result = filterRooms(ROOM_CATALOG, { attendees: 1, equipment: [] });
    expect(result).toHaveLength(ROOM_CATALOG.length);
  });

  it('F2-4: catalog filter with Projector + Video conferencing returns only C310', () => {
    const result = filterRooms(ROOM_CATALOG, {
      attendees: 10,
      equipment: ['Projector', 'Video conferencing'],
    });
    expect(ids(result)).toEqual(['C310']);
  });
});

describe('F3 blocked rooms', () => {
  it('F3-1: a blocked room can match filters but is never reported as available', () => {
    const matches = filterRooms(ROOM_CATALOG, { attendees: 20, equipment: ['Projector'] });
    const blocked = matches.find((r) => r.id === 'B202');
    expect(blocked).toBeDefined();
    const result = checkAvailability(blocked!, 660, 720, NOW);
    expect(result.available).toBe(false);
    expect(result.reasons.join(' ').toLowerCase()).toContain('blocked');
  });

  it('F3-2: no blocked catalog room is available for any free slot', () => {
    for (const room of ROOM_CATALOG.filter((r) => r.blocked)) {
      for (const [start, end] of [[600, 660], [960, 1020], [1200, 1320]]) {
        expect(checkAvailability(room, start, end, NOW).available).toBe(false);
      }
    }
  });
});

describe('F4 empty state', () => {
  it('F4-1: impossible requirements return an empty list and no selected room', () => {
    const result = filterRooms(ROOM_CATALOG, { attendees: 100, equipment: [] });
    expect(result).toEqual([]);
    expect(resolveSelectedRoom(result, 'A101')).toBeNull();
  });
});

describe('F5 room selection', () => {
  it('F5-1: keeps the chosen room while it still matches', () => {
    const matches = filterRooms(ROOM_CATALOG, { attendees: 10, equipment: [] });
    expect(resolveSelectedRoom(matches, 'L014')?.id).toBe('L014');
  });

  it('F5-2: falls back to the first matching room when the chosen room is filtered out', () => {
    const matches = filterRooms(ROOM_CATALOG, { attendees: 50, equipment: [] });
    expect(resolveSelectedRoom(matches, 'A105')?.id).toBe('C310');
  });

  it('F5-3: the check uses the chosen room bookings, not another room', () => {
    const a101 = resolveSelectedRoom(ROOM_CATALOG, 'A101')!;
    const a105 = resolveSelectedRoom(ROOM_CATALOG, 'A105')!;
    expect(checkAvailability(a101, 620, 680, NOW).available).toBe(false);
    expect(checkAvailability(a105, 620, 680, NOW).available).toBe(true);
  });
});

describe('Boundaries on catalog rooms', () => {
  const free = makeRoom({ bookings: [] });
  const busy = makeRoom();

  it('BND-1: exactly 120 minutes is accepted, 121 minutes is rejected', () => {
    expect(checkAvailability(free, 700, 820, NOW).available).toBe(true);
    const over = checkAvailability(free, 700, 821, NOW);
    expect(over.available).toBe(false);
    expect(over.reasons.join(' ')).toContain('maximum duration');
  });

  it('BND-2: touching intervals are accepted, overlapping by one minute is rejected', () => {
    expect(checkAvailability(busy, 660, 700, NOW).available).toBe(true);
    expect(checkAvailability(busy, 560, 600, NOW).available).toBe(true);
    expect(checkAvailability(busy, 659, 700, NOW).available).toBe(false);
    expect(checkAvailability(busy, 560, 601, NOW).available).toBe(false);
  });

  it('BND-3: exact capacity is included, capacity minus one is excluded', () => {
    const room = makeRoom({ capacity: 25 });
    expect(filterRooms([room], { attendees: 25, equipment: [] })).toHaveLength(1);
    expect(filterRooms([room], { attendees: 26, equipment: [] })).toHaveLength(0);
  });
});

describe('AC5 with filters', () => {
  it('AC5-F: filtering and checking never change the catalog', () => {
    const before = structuredClone(ROOM_CATALOG);
    const result = filterRooms(ROOM_CATALOG, { attendees: 10, equipment: ['Projector'] });
    result.forEach((room) => checkAvailability(room, 660, 720, NOW));
    expect(result).not.toBe(ROOM_CATALOG);
    expect(ROOM_CATALOG).toEqual(before);
  });
});
