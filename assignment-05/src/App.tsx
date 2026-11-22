import { useMemo, useState } from 'react';
import { Building2, Users } from 'lucide-react';
import type { Equipment } from './types';
import { ROOM_CATALOG, DEFAULT_CURRENT_TIME } from './data/rooms';
import { MAX_BOOKING_MINUTES } from './domain/bookingRules';
import { checkAvailability } from './domain/availability';
import { filterRooms, resolveSelectedRoom } from './domain/roomFilters';
import { parseBookingRequest } from './domain/bookingRequest';
import RoomFilters from './components/RoomFilters';
import RoomList from './components/RoomList';
import BookingForm from './components/BookingForm';
import AvailabilityPanel from './components/AvailabilityPanel';
import Timeline from './components/Timeline';
import BookingList from './components/BookingList';

function App() {
  const [attendees, setAttendees] = useState(10);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [roomId, setRoomId] = useState(ROOM_CATALOG[0].id);
  const [startTimeStr, setStartTimeStr] = useState('09:30');
  const [endTimeStr, setEndTimeStr] = useState('630');
  const [currentTimeStr, setCurrentTimeStr] = useState(String(DEFAULT_CURRENT_TIME));
  const [checkedKey, setCheckedKey] = useState<string | null>(null);

  const matchingRooms = useMemo(
    () => filterRooms(ROOM_CATALOG, { attendees, equipment }),
    [attendees, equipment]
  );
  const selectedRoom = resolveSelectedRoom(matchingRooms, roomId);

  const { startMin, endMin, currentTime } = parseBookingRequest(startTimeStr, endTimeStr, currentTimeStr);
  const intervalKey = `${startTimeStr}|${endTimeStr}|${currentTimeStr}`;
  const hasChecked = checkedKey === intervalKey;

  const result = useMemo(
    () => (selectedRoom ? checkAvailability(selectedRoom, startMin, endMin, currentTime) : null),
    [selectedRoom, startMin, endMin, currentTime]
  );

  const toggleEquipment = (item: Equipment) =>
    setEquipment((current) =>
      current.includes(item) ? current.filter((e) => e !== item) : [...current, item]
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
        <header className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-white shadow-sm">
            <Building2 size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Smart Campus Room Availability</h1>
            <p className="text-sm text-slate-500">Find a room that fits your group, then check your time slot.</p>
          </div>
        </header>

        <div className="space-y-5 rounded-2xl bg-white p-5 shadow-lg sm:p-7">
          <RoomFilters
            attendees={attendees}
            equipment={equipment}
            onAttendeesChange={setAttendees}
            onToggleEquipment={toggleEquipment}
          />

          <RoomList
            rooms={matchingRooms}
            selectedId={selectedRoom?.id ?? null}
            totalRooms={ROOM_CATALOG.length}
            onSelect={setRoomId}
          />

          <BookingForm
            startTimeStr={startTimeStr}
            endTimeStr={endTimeStr}
            currentTimeStr={currentTimeStr}
            currentTime={currentTime}
            startMin={startMin}
            endMin={endMin}
            onStartChange={setStartTimeStr}
            onEndChange={setEndTimeStr}
            onCurrentTimeChange={setCurrentTimeStr}
          />

          <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
            <Users size={14} />
            Max booking duration: {MAX_BOOKING_MINUTES} min · Touching endpoints are allowed (no overlap)
          </div>

          <button
            type="button"
            onClick={() => setCheckedKey(intervalKey)}
            disabled={!selectedRoom}
            className="w-full rounded-xl bg-slate-800 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-900 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto sm:px-8"
          >
            Check Availability
          </button>

          {selectedRoom && result && (
            <>
              {hasChecked && (
                <div className="animate-[fadeIn_0.2s_ease-in]">
                  <AvailabilityPanel room={selectedRoom} result={result} start={startMin} end={endMin} />
                </div>
              )}
              <Timeline
                room={selectedRoom}
                candidateStart={hasChecked ? startMin : null}
                candidateEnd={hasChecked ? endMin : null}
                currentTime={currentTime}
              />
              <BookingList room={selectedRoom} />
            </>
          )}
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
