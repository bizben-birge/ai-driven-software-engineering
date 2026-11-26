import { SAMPLE_ROOMS, DEFAULT_CURRENT_TIME } from '../sampleData';
import type { Booking } from '../types';

const baselineRoom = SAMPLE_ROOMS[0];

export const CONTRACT_ROOM = {
  id: baselineRoom.id,
  name: baselineRoom.name,
  building: baselineRoom.building,
  capacity: baselineRoom.capacity,
} as const;

export const SIMULATED_NOW = DEFAULT_CURRENT_TIME;

export const CONTRACT_BOOKINGS: readonly Booking[] = Object.freeze(
  baselineRoom.bookings.map((booking) => Object.freeze({ ...booking }))
);
