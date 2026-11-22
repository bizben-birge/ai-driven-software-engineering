export type Equipment = 'Projector' | 'Whiteboard' | 'Video conferencing' | 'Computers';

export interface Booking {
  start: number;
  end: number;
  label: string;
}

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  equipment: readonly Equipment[];
  blocked: boolean;
  bookings: readonly Booking[];
}

export interface RoomRequirements {
  attendees: number;
  equipment: readonly Equipment[];
}

export interface ValidationResult {
  valid: boolean;
  reason: string;
}

export interface AvailabilityResult {
  available: boolean;
  reasons: string[];
}
