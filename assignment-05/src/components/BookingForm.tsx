import { Clock } from 'lucide-react';
import { MINUTE_IN_DAY } from '../domain/bookingRules';
import { minutesToLabel } from '../utils/time';
import { INPUT_CLASS } from './inputStyles';

interface BookingFormProps {
  startTimeStr: string;
  endTimeStr: string;
  currentTimeStr: string;
  currentTime: number;
  startMin: number;
  endMin: number;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  onCurrentTimeChange: (value: string) => void;
}

export default function BookingForm({
  startTimeStr,
  endTimeStr,
  currentTimeStr,
  currentTime,
  startMin,
  endMin,
  onStartChange,
  onEndChange,
  onCurrentTimeChange,
}: BookingFormProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="start-time" className="mb-1.5 block text-sm font-semibold text-slate-700">Start Time</label>
        <div className="relative">
          <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="start-time"
            type="time"
            value={startTimeStr}
            onChange={(e) => onStartChange(e.target.value)}
            className={`${INPUT_CLASS} w-full pl-9`}
          />
        </div>
        <p className="mt-1 text-xs text-slate-400">{startMin} min after midnight</p>
      </div>

      <div>
        <label htmlFor="end-time" className="mb-1.5 block text-sm font-semibold text-slate-700">End Time (min after midnight)</label>
        <div className="relative">
          <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="end-time"
            type="number"
            min={0}
            max={MINUTE_IN_DAY}
            value={endTimeStr}
            onChange={(e) => onEndChange(e.target.value)}
            className={`${INPUT_CLASS} w-full pl-9`}
          />
        </div>
        <p className="mt-1 text-xs text-slate-400">{minutesToLabel(endMin)}</p>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="current-time" className="mb-1.5 block text-sm font-semibold text-slate-700">
          Current Time (minutes after midnight)
        </label>
        <div className="flex items-center gap-3">
          <input
            id="current-time"
            type="number"
            min={0}
            max={MINUTE_IN_DAY}
            value={currentTimeStr}
            onChange={(e) => onCurrentTimeChange(e.target.value)}
            className={`${INPUT_CLASS} w-32 pl-3`}
          />
          <span className="text-sm text-slate-500">= {minutesToLabel(currentTime)}</span>
        </div>
      </div>
    </div>
  );
}
