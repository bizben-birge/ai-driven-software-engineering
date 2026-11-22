import { Users } from 'lucide-react';
import type { Equipment } from '../types';
import { EQUIPMENT_OPTIONS } from '../data/rooms';
import { INPUT_CLASS } from './inputStyles';

interface RoomFiltersProps {
  attendees: number;
  equipment: readonly Equipment[];
  onAttendeesChange: (value: number) => void;
  onToggleEquipment: (item: Equipment) => void;
}

export default function RoomFilters({
  attendees,
  equipment,
  onAttendeesChange,
  onToggleEquipment,
}: RoomFiltersProps) {
  return (
    <fieldset className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      <legend className="px-1 text-sm font-semibold text-slate-700">Room Requirements</legend>
      <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
        <div>
          <label htmlFor="attendees" className="mb-1.5 block text-xs font-semibold text-slate-600">
            Attendees
          </label>
          <div className="relative">
            <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="attendees"
              type="number"
              min={1}
              value={attendees}
              onChange={(e) => onAttendeesChange(Number(e.target.value))}
              className={`${INPUT_CLASS} w-full bg-white pl-9`}
            />
          </div>
        </div>
        <div>
          <span className="mb-1.5 block text-xs font-semibold text-slate-600">Required equipment (all selected)</span>
          <div className="flex flex-wrap gap-2">
            {EQUIPMENT_OPTIONS.map((item) => {
              const selected = equipment.includes(item);
              return (
                <label
                  key={item}
                  className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    selected
                      ? 'border-slate-800 bg-slate-800 text-white'
                      : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={selected}
                    onChange={() => onToggleEquipment(item)}
                  />
                  {item}
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </fieldset>
  );
}
