import { describe, expect, it } from 'vitest';
import { parseMinuteField, parseClockField, formatMinuteField } from './formValues';

describe('R1 strict form boundary', () => {
  it.each(['', ' ', '720.5', '7e2', '720x', '-1', '1441', '99999', 'Infinity'])('rejects malformed minute %j', value => {
    expect(Number.isNaN(parseMinuteField(value))).toBe(true);
  });
  it.each([['0', 0], ['720', 720], ['1440', 1440]])('accepts integer minute %s', (value, expected) => {
    expect(parseMinuteField(String(value))).toBe(expected);
  });
  it.each(['', '11:00:30', '24:00', '11:60', '1:00', '11:x'])('rejects malformed clock %j', value => {
    expect(Number.isNaN(parseClockField(value))).toBe(true);
  });
  it('converts valid clock fields and formats empty values safely', () => {
    expect(parseClockField('11:00')).toBe(660);
    expect(formatMinuteField(NaN)).toBe('Enter a valid time');
    expect(formatMinuteField(1440)).toBe('24:00');
  });
});
