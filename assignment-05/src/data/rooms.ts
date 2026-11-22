import type { Equipment, Room } from '../types';

export const EQUIPMENT_OPTIONS: readonly Equipment[] = [
  'Projector',
  'Whiteboard',
  'Video conferencing',
  'Computers',
];

export const ROOM_CATALOG: readonly Room[] = [
  {
    id: 'A101',
    name: 'Room A101',
    building: 'Engineering Block',
    capacity: 40,
    equipment: ['Projector', 'Whiteboard'],
    blocked: false,
    bookings: [{ start: 600, end: 660, label: 'Data Structures Lecture' }],
  },
  {
    id: 'B202',
    name: 'Room B202',
    building: 'Science Block',
    capacity: 25,
    equipment: ['Projector'],
    blocked: true,
    bookings: [],
  },
  {
    id: 'A105',
    name: 'Room A105',
    building: 'Engineering Block',
    capacity: 12,
    equipment: ['Whiteboard'],
    blocked: false,
    bookings: [{ start: 720, end: 780, label: 'Study Group' }],
  },
  {
    id: 'C310',
    name: 'Room C310',
    building: 'Main Building',
    capacity: 60,
    equipment: ['Projector', 'Whiteboard', 'Video conferencing'],
    blocked: false,
    bookings: [
      { start: 600, end: 720, label: 'Faculty Meeting' },
      { start: 840, end: 900, label: 'Guest Talk' },
    ],
  },
  {
    id: 'L014',
    name: 'Lab L014',
    building: 'Library',
    capacity: 30,
    equipment: ['Computers', 'Projector'],
    blocked: false,
    bookings: [{ start: 780, end: 840, label: 'Python Workshop' }],
  },
];

export const DEFAULT_CURRENT_TIME = 540;
