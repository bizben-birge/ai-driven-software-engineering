import type { Room } from '../types';
import { durationMinutes } from '../domain/bookingRules';
import { formatInterval } from '../utils/time';

export default function BookingList({ room }: { room: Room }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <h3 className="mb-2 text-sm font-semibold text-slate-700">Existing Bookings — {room.name}</h3>
      {room.bookings.length === 0 ? (
        <p className="text-sm text-slate-400">No existing bookings for this room.</p>
      ) : (
        <ul className="space-y-1.5">
          {room.bookings.map((b) => (
            <li key={`${b.start}-${b.end}`} className="flex items-center gap-2 text-sm text-slate-600">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
              <span className="font-medium">{formatInterval(b.start, b.end)}</span>
              <span className="text-slate-400">({durationMinutes(b.start, b.end)} min)</span>
              <span className="ml-auto truncate text-slate-500">{b.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
