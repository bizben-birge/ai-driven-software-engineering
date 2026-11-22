import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import type { AvailabilityResult, Room } from '../types';
import { durationMinutes } from '../domain/bookingRules';
import { minutesToLabel } from '../utils/time';

interface AvailabilityPanelProps {
  room: Room;
  result: AvailabilityResult;
  start: number;
  end: number;
}

export default function AvailabilityPanel({ room, result, start, end }: AvailabilityPanelProps) {
  if (result.available) {
    return (
      <div role="status" className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <CheckCircle2 size={24} className="mt-0.5 flex-shrink-0 text-emerald-600" />
        <div>
          <div className="text-base font-bold text-emerald-800">Available</div>
          <p className="text-sm text-emerald-700">
            {room.name} is free from {minutesToLabel(start)} to {minutesToLabel(end)} ({durationMinutes(start, end)} min). No conflicts detected.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div role="status" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
      <XCircle size={24} className="mt-0.5 flex-shrink-0 text-red-600" />
      <div className="flex-1">
        <div className="text-base font-bold text-red-800">Unavailable</div>
        <p className="text-sm text-red-700">{room.name} cannot be booked for this time:</p>
        <ul className="mt-1 space-y-1">
          {result.reasons.map((reason) => (
            <li key={reason} className="flex items-start gap-1.5 text-sm text-red-700">
              <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
              {reason}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
