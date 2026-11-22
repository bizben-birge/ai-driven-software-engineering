import { DoorClosed, Lock, SearchX } from 'lucide-react';
import type { Room } from '../types';

interface RoomListProps {
  rooms: readonly Room[];
  selectedId: string | null;
  totalRooms: number;
  onSelect: (id: string) => void;
}

export default function RoomList({ rooms, selectedId, totalRooms, onSelect }: RoomListProps) {
  if (rooms.length === 0) {
    return (
      <div role="status" className="flex items-start gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4">
        <SearchX size={22} className="mt-0.5 flex-shrink-0 text-slate-500" />
        <div>
          <div className="text-sm font-bold text-slate-800">No rooms match your requirements</div>
          <p className="text-sm text-slate-500">
            Try fewer attendees or remove some equipment. 0 of {totalRooms} rooms match.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-sm font-semibold text-slate-700">Select Room</span>
        <span className="text-xs text-slate-400">{rooms.length} of {totalRooms} rooms match</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {rooms.map((room) => {
          const active = room.id === selectedId;
          return (
            <button
              key={room.id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(room.id)}
              className={`flex items-start justify-between gap-2 rounded-xl border-2 p-3 text-left transition-all ${
                active
                  ? 'border-slate-800 bg-slate-50 ring-1 ring-slate-800'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${active ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <DoorClosed size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">{room.name}</div>
                  <div className="text-xs text-slate-400">{room.building} · {room.capacity} seats</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {room.equipment.map((item) => (
                      <span key={item} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {room.blocked && (
                <span className="flex flex-shrink-0 items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                  <Lock size={10} /> Blocked
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
