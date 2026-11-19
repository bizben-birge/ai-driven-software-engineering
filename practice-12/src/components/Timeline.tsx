import type { Room } from '../types';
import { MINUTE_IN_DAY } from '../utils/bookingRules';
import { minutesToLabel } from '../utils/time';

interface TimelineProps {
  room: Room;
  candidateStart: number | null;
  candidateEnd: number | null;
  currentTime: number;
}

const HOUR_MARKS = Array.from({ length: 25 }, (_, i) => i * 60);

export default function Timeline({ room, candidateStart, candidateEnd, currentTime }: TimelineProps) {
  const pct = (min: number) => `${(min / MINUTE_IN_DAY) * 100}%`;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">Daily Timeline — {room.name}</span>
        <span className="text-xs text-slate-400">00:00 → 24:00</span>
      </div>

      {/* Track */}
      <div className="relative h-12 w-full overflow-hidden rounded-lg bg-white ring-1 ring-slate-200">
        {/* Existing bookings */}
        {room.bookings.map((b, i) => (
          <div
            key={i}
            className="absolute top-0 flex h-full items-center justify-center overflow-hidden bg-amber-200/90 text-[10px] font-medium text-amber-900"
            style={{ left: pct(b.start), width: pct(b.end - b.start) }}
            title={`${minutesToLabel(b.start)}–${minutesToLabel(b.end)}: ${b.label}`}
          >
            <span className="truncate px-1">{b.label}</span>
          </div>
        ))}

        {/* Candidate interval */}
        {candidateStart !== null && candidateEnd !== null && candidateStart < candidateEnd && (
          <div
            className="absolute top-0 h-full border-2 border-dashed border-emerald-500 bg-emerald-300/40"
            style={{ left: pct(candidateStart), width: pct(candidateEnd - candidateStart) }}
          />
        )}

        {/* Current time marker */}
        {Number.isFinite(currentTime) && <div
          className="absolute top-0 z-10 h-full w-px bg-rose-500"
          style={{ left: pct(currentTime) }}
          title={`Now: ${minutesToLabel(currentTime)}`}
        >
          <div className="absolute -top-0 -left-1 h-2 w-2 rounded-full bg-rose-500" />
        </div>}
      </div>

      {/* Hour scale */}
      <div className="relative mt-1 h-4 w-full">
        {HOUR_MARKS.filter((_, i) => i % 3 === 0).map((m) => (
          <div
            key={m}
            className="absolute -translate-x-1/2 text-[9px] text-slate-400"
            style={{ left: pct(m) }}
          >
            {minutesToLabel(m)}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-amber-200" /> Existing booking
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm border-2 border-dashed border-emerald-500 bg-emerald-300/40" /> Candidate
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-px bg-rose-500" /> Current time
        </span>
      </div>
    </div>
  );
}
