import { useMemo, useState } from 'react';
import { AlertTriangle, Building2, CheckCircle2, Clock, DoorClosed, Lock, Timer, XCircle } from 'lucide-react';
import Timeline from './components/Timeline';
import { checkRoom } from './contract/checkRoom';
import { CONTRACT_BOOKINGS, CONTRACT_ROOM, SIMULATED_NOW } from './contract/fixtures';
import type { Decision } from './contract/types';
import { parseDuration, parseStartTime } from './contract/validation';
import { MAX_BOOKING_MINUTES } from './utils/bookingRules';
import { minutesToLabel } from './utils/time';

const RESULT_STYLES = {
  available: {
    box: 'border-emerald-200 bg-emerald-50',
    title: 'text-emerald-800',
    text: 'text-emerald-700',
    label: 'Available',
  },
  unavailable: {
    box: 'border-red-200 bg-red-50',
    title: 'text-red-800',
    text: 'text-red-700',
    label: 'Unavailable',
  },
  validation_error: {
    box: 'border-amber-300 bg-amber-50',
    title: 'text-amber-900',
    text: 'text-amber-800',
    label: 'Check your input',
  },
} as const;

function ResultIcon({ kind }: { kind: Decision['kind'] }) {
  if (kind === 'available') return <CheckCircle2 size={24} className="mt-0.5 flex-shrink-0 text-emerald-600" />;
  if (kind === 'unavailable') return <XCircle size={24} className="mt-0.5 flex-shrink-0 text-red-600" />;
  return <AlertTriangle size={24} className="mt-0.5 flex-shrink-0 text-amber-600" />;
}

function App() {
  const [startTime, setStartTime] = useState('11:30');
  const [duration, setDuration] = useState('60');
  const [blocked, setBlocked] = useState(false);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [checksRun, setChecksRun] = useState(0);

  const room = useMemo(
    () => ({ ...CONTRACT_ROOM, blocked, bookings: [...CONTRACT_BOOKINGS] }),
    [blocked]
  );

  const startMin = parseStartTime(startTime);
  const durationMin = parseDuration(duration);
  const hasCandidate = decision !== null && decision.kind !== 'validation_error';

  const resetResult = () => setDecision(null);

  const handleCheck = () => {
    setDecision(checkRoom({ startTime, duration, blocked, bookings: CONTRACT_BOOKINGS, now: SIMULATED_NOW }));
    setChecksRun((count) => count + 1);
  };

  const style = decision ? RESULT_STYLES[decision.kind] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
        <header className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-white shadow-sm">
            <Building2 size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Smart Campus Room Availability</h1>
            <p className="text-sm text-slate-500">Code-based version · Practice 13 · fictional data only</p>
          </div>
        </header>

        <main className="rounded-2xl bg-white p-5 shadow-lg sm:p-7">
          <div className="flex flex-wrap items-center gap-3 rounded-xl border-2 border-slate-800 bg-slate-50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-white">
              <DoorClosed size={18} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">{CONTRACT_ROOM.name}</div>
              <div className="text-xs text-slate-500">{CONTRACT_ROOM.building} · {CONTRACT_ROOM.capacity} seats</div>
            </div>
            <div className="ml-auto flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm text-slate-700 ring-1 ring-slate-200">
              <Timer size={14} /> Simulated current time: <strong>{minutesToLabel(SIMULATED_NOW)}</strong>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="start-time" className="mb-1.5 block text-sm font-semibold text-slate-700">Start time</label>
              <div className="relative">
                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(event) => { setStartTime(event.target.value); resetResult(); }}
                  className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">Must be after {minutesToLabel(SIMULATED_NOW)}</p>
            </div>

            <div>
              <label htmlFor="duration" className="mb-1.5 block text-sm font-semibold text-slate-700">Duration (minutes)</label>
              <input
                id="duration"
                type="number"
                step={1}
                value={duration}
                onChange={(event) => { setDuration(event.target.value); resetResult(); }}
                className="w-full rounded-lg border border-slate-300 py-2.5 px-3 text-sm text-slate-800 outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
              />
              <p className="mt-1 text-xs text-slate-500">From 1 to {MAX_BOOKING_MINUTES} minutes</p>
            </div>

            <div className="sm:col-span-2">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Room status</span>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700">
                <input
                  id="room-blocked"
                  type="checkbox"
                  checked={blocked}
                  onChange={(event) => { setBlocked(event.target.checked); resetResult(); }}
                />
                <label htmlFor="room-blocked">Room is blocked (fictional status)</label>
                {blocked && <span className="ml-auto flex items-center gap-1 font-semibold text-red-700"><Lock size={14} /> Blocked</span>}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCheck}
            className="mt-5 w-full rounded-xl bg-slate-800 py-3 text-sm font-bold text-white shadow-sm hover:bg-slate-900 sm:w-auto sm:px-8"
          >
            Check availability
          </button>

          <div aria-live="polite">
            {decision && style && (
              <div role="status" data-testid="decision" className={`mt-5 flex items-start gap-3 rounded-xl border p-4 ${style.box}`}>
                <ResultIcon kind={decision.kind} />
                <div className="min-w-0 flex-1">
                  <div className={`text-base font-bold ${style.title}`}>{style.label}</div>
                  <p className={`text-sm ${style.text}`}>{decision.message}</p>
                  <p className="mt-2 text-xs text-slate-600">
                    available: <strong>{String(decision.available)}</strong> · reason code: <strong data-testid="reason-code">{decision.reasonCode}</strong>
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6">
            <Timeline
              room={room}
              candidateStart={hasCandidate ? startMin : null}
              candidateEnd={hasCandidate ? startMin + durationMin : null}
              currentTime={SIMULATED_NOW}
            />
          </div>

          <section className="mt-5 rounded-xl border border-slate-200 p-4">
            <h2 className="mb-2 text-sm font-semibold text-slate-700">
              Existing bookings (read-only) · {CONTRACT_BOOKINGS.length} booking
            </h2>
            <ul className="space-y-1.5" data-testid="booking-list">
              {CONTRACT_BOOKINGS.map((booking) => (
                <li key={`${booking.start}-${booking.end}`} className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                  <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
                  <span className="font-medium">{minutesToLabel(booking.start)}-{minutesToLabel(booking.end)}</span>
                  <span className="text-slate-500">{booking.label}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-slate-500">Checks run: {checksRun}. Checking never changes this list.</p>
          </section>
        </main>

        <p className="mt-4 text-center text-xs text-slate-500">
          Fictional campus room and bookings. No login, payment, real personal data or database.
        </p>
      </div>
    </div>
  );
}

export default App;
