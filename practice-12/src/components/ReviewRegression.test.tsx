// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import App from '../App';
import { SAMPLE_ROOMS } from '../sampleData';

afterEach(cleanup);

describe('Verified review findings', () => {
  it('shows one room and changes its blocked scenario without mutating baseline data', async () => {
    const before = JSON.stringify(SAMPLE_ROOMS);
    render(<App />);
    expect(screen.queryByText('Room B202')).toBeNull();
    fireEvent.change(screen.getByLabelText('Start Time'), { target: { value: '11:00' } });
    fireEvent.change(screen.getByLabelText('End Time (min after midnight)'), { target: { value: '720' } });
    fireEvent.click(screen.getByLabelText('Classroom simulation: block A101'));
    fireEvent.click(screen.getByRole('button', { name: 'Check Availability' }));
    expect(screen.getByText('Unavailable')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Explain availability' }));
    await screen.findByText('Generated explanation (mock)');
    expect(screen.getByText(/Room A101 is unavailable for this request. This room is currently blocked/)).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Classroom simulation: block A101'));
    expect(screen.queryByText('Generated explanation (mock)')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Check Availability' }));
    expect(screen.getByText('Available')).toBeTruthy();
    expect(JSON.stringify(SAMPLE_ROOMS)).toBe(before);
  });

  it('R1 rejects fractional end time instead of silently truncating it', () => {
    const { container } = render(<App />);
    fireEvent.change(container.querySelector('input[type="time"]')!, { target: { value: '11:00' } });
    fireEvent.change(screen.getAllByRole('spinbutton')[0], { target: { value: '720.5' } });
    fireEvent.click(screen.getByRole('button', { name: 'Check Availability' }));
    expect(screen.getByText('Unavailable')).toBeTruthy();
    expect(screen.queryByText('Available')).toBeNull();
  });

  it('R2 provides programmatic names for all time inputs', () => {
    render(<App />);
    expect(screen.getByLabelText('Start Time')).toBeTruthy();
    expect(screen.getByLabelText('End Time (min after midnight)')).toBeTruthy();
    expect(screen.getByLabelText('Current Time (minutes after midnight)')).toBeTruthy();
  });

  it('retains Available for a valid request and labels its explanation', async () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('Start Time'), { target: { value: '11:00' } });
    fireEvent.change(screen.getByLabelText('End Time (min after midnight)'), { target: { value: '720' } });
    fireEvent.click(screen.getByRole('button', { name: 'Check Availability' }));
    expect(screen.getByText('Available')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Explain availability' }));
    await screen.findByText('Generated explanation (mock)');
    expect(screen.getByText('Available')).toBeTruthy();
    expect(screen.getByText(/This is an availability check, not a reservation/)).toBeTruthy();
  });

  it('shows a readable empty-field error and leaves status Unavailable', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('Current Time (minutes after midnight)'), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Check Availability' }));
    expect(screen.getByText('Unavailable')).toBeTruthy();
    expect(screen.queryByText(/NaN/)).toBeNull();
    expect(screen.queryByTitle(/NaN/)).toBeNull();
  });
});
