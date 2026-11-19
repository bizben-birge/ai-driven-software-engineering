import { minutesToLabel } from './time';

export function parseMinuteField(value: string): number {
  if (!/^\d{1,4}$/.test(value)) return NaN;
  const minute = Number(value);
  return minute <= 1440 ? minute : NaN;
}

export function parseClockField(value: string): number {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return NaN;
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

export function formatMinuteField(value: number): string {
  return Number.isFinite(value) ? minutesToLabel(value) : 'Enter a valid time';
}
