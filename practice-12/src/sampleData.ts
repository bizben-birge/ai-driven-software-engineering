import type { Room } from './types';

export const SAMPLE_ROOMS: Room[] = [
  {
    id: 'A101',
    name: 'Room A101',
    building: 'Engineering Block',
    capacity: 40,
    blocked: false,
    bookings: [
      { start: 600, end: 660, label: 'Data Structures Lecture' },
    ],
  },
  {
    id: 'B202',
    name: 'Room B202',
    building: 'Science Block',
    capacity: 25,
    blocked: true,
    bookings: [],
  },
];

export const DEFAULT_CURRENT_TIME = 540;
