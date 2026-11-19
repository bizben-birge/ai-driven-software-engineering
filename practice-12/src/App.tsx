import { useState, useMemo } from 'react';
import { CheckCircle2, XCircle, Clock, DoorClosed, Building2, Users, Lock, AlertTriangle } from 'lucide-react';
import type { AvailabilityResult } from './types';
import { SAMPLE_ROOMS, DEFAULT_CURRENT_TIME } from './sampleData';
import { MAX_BOOKING_MINUTES, MINUTE_IN_DAY } from './utils/bookingRules';
import { checkAvailability } from './utils/validation';
import { minutesToLabel } from './utils/time';
import { parseClockField, parseMinuteField, formatMinuteField } from './utils/formValues';
import Timeline from './components/Timeline';
import ExplanationPanel from './components/ExplanationPanel';
import { buildExplanationInput } from './explanation/contract';

function App() {
  const [roomBlocked, setRoomBlocked] = useState(false);
  const [startTimeStr, setStartTimeStr] = useState('09:30');
  const [endTimeStr, setEndTimeStr] = useState('630');
  const [currentTimeStr, setCurrentTimeStr] = useState(String(DEFAULT_CURRENT_TIME));
  const [hasChecked, setHasChecked] = useState(false);

  const selectedRoom = useMemo(
    () => ({ ...SAMPLE_ROOMS[0], blocked: roomBlocked }),
    [roomBlocked]
  );

  const startMin = parseClockField(startTimeStr);
  const endMin = parseMinuteField(endTimeStr);
  const currentTime = parseMinuteField(currentTimeStr);

  const result: AvailabilityResult = useMemo(
    () => checkAvailability(selectedRoom, startMin, endMin, currentTime),
    [selectedRoom, startMin, endMin, currentTime]
  );

  const handleCheck = () => setHasChecked(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
        {/* Header */}
        <header className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-white shadow-sm">
            <Building2 size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Smart Campus Room Availability</h1>
            <p className="text-sm text-slate-500">Check if a room is free for your requested time slot.</p>
          </div>
        </header>

        {/* Main card */}
        <div className="rounded-2xl bg-white p-5 shadow-lg sm:p-7">
          {/* Form grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <div className="flex items-center gap-3 rounded-xl border-2 border-slate-800 bg-slate-50 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-white">
                  <DoorClosed size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">{selectedRoom.name}</div>
                  <div className="text-xs text-slate-500">{selectedRoom.building} · {selectedRoom.capacity} seats</div>
                </div>
                {roomBlocked && <span className="ml-auto flex items-center gap-1 text-sm font-semibold text-red-700"><Lock size={14} /> Blocked</span>}
              </div>
              <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={roomBlocked}
                  onChange={(e) => { setRoomBlocked(e.target.checked); setHasChecked(false); }}
                />
                Classroom simulation: block A101
              </label>
            </div>

            {/* Start time */}
            <div>
              <label htmlFor="start-time" className="mb-1.5 block text-sm font-semibold text-slate-700">Start Time</label>
              <div className="relative">
                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="time"
                  id="start-time"
                  value={startTimeStr}
                  onChange={(e) => { setStartTimeStr(e.target.value); setHasChecked(false); }}
                  className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
                />
              </div>
              <p className="mt-1 text-xs text-slate-400">{Number.isFinite(startMin) ? `${startMin} min after midnight` : 'Enter a valid time'}</p>
            </div>

            {/* End time */}
            <div>
              <label htmlFor="end-time" className="mb-1.5 block text-sm font-semibold text-slate-700">End Time (min after midnight)</label>
              <div className="relative">
                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  id="end-time"
                  min={0}
                  max={MINUTE_IN_DAY}
                  value={endTimeStr}
                  onChange={(e) => { setEndTimeStr(e.target.value); setHasChecked(false); }}
                  className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
                />
              </div>
              <p className="mt-1 text-xs text-slate-400">{formatMinuteField(endMin)}</p>
            </div>

            {/* Current time */}
            <div className="sm:col-span-2">
              <label htmlFor="current-time" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Current Time (minutes after midnight)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  id="current-time"
                  min={0}
                  max={MINUTE_IN_DAY}
                  value={currentTimeStr}
                  onChange={(e) => { setCurrentTimeStr(e.target.value); setHasChecked(false); }}
                  className="w-32 rounded-lg border border-slate-300 py-2.5 px-3 text-sm text-slate-800 outline-none transition focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
                />
                <span className="text-sm text-slate-500">= {formatMinuteField(currentTime)}</span>
              </div>
            </div>
          </div>

          {/* Duration hint */}
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
            <Users size={14} />
            Max booking duration: {MAX_BOOKING_MINUTES} min · Touching endpoints are allowed (no overlap)
          </div>

          {/* Check button */}
          <button
            onClick={handleCheck}
            className="mt-5 w-full rounded-xl bg-slate-800 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-900 active:scale-[0.99] sm:w-auto sm:px-8"
          >
            Check Availability
          </button>

          {/* Result */}
          {hasChecked && (
            <div className="mt-5 animate-[fadeIn_0.2s_ease-in]">
              {result.available ? (
                <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <CheckCircle2 size={24} className="mt-0.5 flex-shrink-0 text-emerald-600" />
                  <div>
                    <div className="text-base font-bold text-emerald-800">Available</div>
                    <p className="text-sm text-emerald-700">
                      {selectedRoom.name} is free from {minutesToLabel(startMin)} to {minutesToLabel(endMin)} ({endMin - startMin} min). No conflicts detected.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                  <XCircle size={24} className="mt-0.5 flex-shrink-0 text-red-600" />
                  <div className="flex-1">
                    <div className="text-base font-bold text-red-800">Unavailable</div>
                    <ul className="mt-1 space-y-1">
                      {result.reasons.map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-sm text-red-700">
                          <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Timeline */}
          {hasChecked && (
            <ExplanationPanel
              key={`${roomBlocked}:${startTimeStr}:${endTimeStr}:${currentTime}`}
              input={buildExplanationInput(selectedRoom.name, startMin, endMin, result)}
            />
          )}

          <div className="mt-6">
            <Timeline
              room={selectedRoom}
              candidateStart={hasChecked ? startMin : null}
              candidateEnd={hasChecked ? endMin : null}
              currentTime={currentTime}
            />
          </div>

          {/* Existing bookings list */}
          <div className="mt-5 rounded-xl border border-slate-200 p-4">
            <h3 className="mb-2 text-sm font-semibold text-slate-700">Existing Bookings — {selectedRoom.name}</h3>
            {selectedRoom.bookings.length === 0 ? (
              <p className="text-sm text-slate-400">No existing bookings for this room.</p>
            ) : (
              <ul className="space-y-1.5">
                {selectedRoom.bookings.map((b, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
                    <span className="font-medium">{minutesToLabel(b.start)} – {minutesToLabel(b.end)}</span>
                    <span className="text-slate-400">({b.end - b.start} min)</span>
                    <span className="ml-auto truncate text-slate-500">{b.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          Fictional sample data · Times are minutes after midnight (0–1440)
        </p>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

export default App;
