import type { Booking, Room } from '../types';

export const NOW = 540;

const DEFAULT_BOOKINGS: readonly Booking[] = [
  { start: 600, end: 660, label: 'Data Structures Lecture' },
];

export function makeRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: 'A101',
    name: 'Room A101',
    building: 'Engineering Block',
    capacity: 40,
    equipment: ['Projector', 'Whiteboard'],
    blocked: false,
    ...overrides,
    bookings: (overrides.bookings ?? DEFAULT_BOOKINGS).map((b) => ({ ...b })),
  };
}
