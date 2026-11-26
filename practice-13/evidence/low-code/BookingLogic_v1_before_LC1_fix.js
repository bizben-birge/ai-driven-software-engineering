export default {
  // Smart Campus Practice 13 - low-code version (Appsmith JS object "BookingLogic").
  // Fictional data only. Same contract, same reason codes and same check order as the code version.
  roomName: 'A101',
  nowMinutes: 540,
  maxMinutes: 120,
  dayMinutes: 1440,
  bookings: [
    { id: 'B1', room: 'A101', title: 'Data Structures Lecture', start: '10:00', end: '11:00' }
  ],

  toMinutes (text) {
    const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(String(text ?? '').trim());
    return match ? Number(match[1]) * 60 + Number(match[2]) : NaN;
  },

  toLabel (minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
  },

  parseDuration (text) {
    const value = String(text ?? '').trim();
    return /^-?\d{1,4}$/.test(value) ? Number(value) : NaN;
  },

  result (reasonCode, message) {
    const kind = reasonCode === 'AVAILABLE' ? 'available'
      : (reasonCode === 'ROOM_BLOCKED' || reasonCode === 'OVERLAP') ? 'unavailable'
      : 'validation_error';
    return { available: reasonCode === 'AVAILABLE', kind: kind, reasonCode: reasonCode, message: message };
  },

  // Pure rule: reads only its arguments and this.bookings, never changes them.
  decide (startText, durationText, blocked) {
    const start = this.toMinutes(startText);
    if (Number.isNaN(start)) return this.result('INVALID_START_TIME', 'Please enter the start time as HH:MM, for example 11:30.');
    if (start <= this.nowMinutes) return this.result('PAST_START_TIME', 'The start time must be in the future (after ' + this.toLabel(this.nowMinutes) + ').');
    const duration = this.parseDuration(durationText);
    if (Number.isNaN(duration) || duration <= 0) return this.result('INVALID_DURATION', 'The duration must be a whole number of minutes greater than 0.');
    if (duration > this.maxMinutes) return this.result('DURATION_TOO_LONG', 'The duration must be ' + this.maxMinutes + ' minutes or less.');
    const end = start + duration;
    if (end > this.dayMinutes) return this.result('ENDS_AFTER_MIDNIGHT', 'The booking must end by 24:00 on the same day.');
    const slot = this.toLabel(start) + '-' + this.toLabel(end);
    if (blocked === true) return this.result('ROOM_BLOCKED', 'Unavailable: the room is blocked, so it cannot be booked.');
    const conflict = this.bookings.find(b => start < this.toMinutes(b.end) && this.toMinutes(b.start) < end);
    if (conflict) return this.result('OVERLAP', 'Unavailable: ' + slot + ' overlaps the existing booking ' + conflict.start + '-' + conflict.end + '.');
    return this.result('AVAILABLE', 'Available: the room is free from ' + slot + '.');
  },

  // Button onClick: read the widgets, store the decision, count the check.
  async check () {
    const decision = this.decide(StartInput.text, DurationInput.text, BlockedCheckbox.isChecked);
    await storeValue('decision', decision, false);
    await storeValue('checks', (appsmith.store.checks || 0) + 1, false);
    return decision;
  },

  // Input onChange: hide an old decision so it never describes new input.
  async clearDecision () {
    await storeValue('decision', null, false);
  },

  // Editor-only self check of T1-T7 (run with the Run button). Not used by the page.
  selfTest () {
    const cases = [
      ['T1', '11:30', '60', false, 'AVAILABLE'],
      ['T2', '10:30', '60', false, 'OVERLAP'],
      ['T3', '11:30', '60', true, 'ROOM_BLOCKED'],
      ['T4', '11:30', '0', false, 'INVALID_DURATION'],
      ['T5', '11:30', '121', false, 'DURATION_TOO_LONG'],
      ['T6', '08:00', '30', false, 'PAST_START_TIME'],
      ['T7', '11:00', '60', false, 'AVAILABLE']
    ];
    const before = JSON.stringify(this.bookings);
    const rows = cases.map(c => {
      const got = this.decide(c[1], c[2], c[3]).reasonCode;
      return { id: c[0], expected: c[4], observed: got, pass: got === c[4] };
    });
    rows.push({ id: 'T8', expected: 'bookings unchanged', observed: JSON.stringify(this.bookings) === before ? 'bookings unchanged' : 'changed', pass: JSON.stringify(this.bookings) === before });
    return rows;
  }
}
