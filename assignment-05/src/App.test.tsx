import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import App from './App';

afterEach(cleanup);

function setValue(label: RegExp, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

function roomButton(name: string) {
  return screen.getByRole('button', { name: new RegExp(name) });
}

function toggleEquipment(name: string) {
  fireEvent.click(screen.getByLabelText(name));
}

describe('App UI behaviour (integration)', () => {
  it('UI-1: filters show only matching rooms and update the count', () => {
    render(<App />);
    expect(screen.getByText('5 of 5 rooms match')).toBeTruthy();
    setValue(/Attendees/, '35');
    toggleEquipment('Projector');
    expect(screen.getByText('2 of 5 rooms match')).toBeTruthy();
    expect(roomButton('Room A101')).toBeTruthy();
    expect(roomButton('Room C310')).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Lab L014/ })).toBeNull();
  });

  it('UI-2: impossible requirements show the empty state and disable the check', () => {
    render(<App />);
    setValue(/Attendees/, '100');
    expect(screen.getByText('No rooms match your requirements')).toBeTruthy();
    expect(screen.getByText(/0 of 5 rooms match/)).toBeTruthy();
    const check = screen.getByRole('button', { name: 'Check Availability' }) as HTMLButtonElement;
    expect(check.disabled).toBe(true);
  });

  it('UI-3: changing the selected room refreshes the result for that room (F5)', () => {
    render(<App />);
    setValue(/Start Time/, '11:00');
    setValue(/End Time/, '720');
    fireEvent.click(screen.getByRole('button', { name: 'Check Availability' }));
    expect(screen.getByText('Available')).toBeTruthy();
    expect(screen.getByText(/Room A101 is free from 11:00 to 12:00/)).toBeTruthy();

    fireEvent.click(roomButton('Room C310'));
    expect(screen.getByText('Unavailable')).toBeTruthy();
    expect(screen.getByText('Room C310 cannot be booked for this time:')).toBeTruthy();
    expect(screen.getByText('The requested interval overlaps an existing booking.')).toBeTruthy();

    fireEvent.click(roomButton('Room B202'));
    expect(screen.getByText('This room is currently blocked and unavailable for booking.')).toBeTruthy();

    fireEvent.click(roomButton('Room A105'));
    expect(screen.getByText(/Room A105 is free from 11:00 to 12:00/)).toBeTruthy();
  });

  it('UI-4: editing the time hides the old result until Check is pressed again', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Check Availability' }));
    expect(screen.getByText('Unavailable')).toBeTruthy();
    setValue(/End Time/, '700');
    expect(screen.queryByText('Unavailable')).toBeNull();
  });

  it('UI-5: an empty Current Time field never makes a past slot available (AC-A)', () => {
    render(<App />);
    setValue(/Start Time/, '05:00');
    setValue(/End Time/, '360');
    setValue(/Current Time/, '');
    fireEvent.click(screen.getByRole('button', { name: 'Check Availability' }));
    expect(screen.getByText('Unavailable')).toBeTruthy();
    expect(screen.getByText(/Current time must be between 0 and 1440/)).toBeTruthy();
  });
});
