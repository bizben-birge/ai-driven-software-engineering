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
  blocked: boolean;
  bookings: Booking[];
}

export interface ValidationResult {
  valid: boolean;
  reason: string;
}

export interface AvailabilityResult {
  available: boolean;
  reasons: string[];
}
