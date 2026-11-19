// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../App';

afterEach(cleanup);

function check() {
  fireEvent.click(screen.getByRole('button', { name: 'Check Availability' }));
}

describe('F-AC5: real App interactions', () => {
  it('keeps confirmed Unavailable when a mock explanation is generated', async () => {
    render(<App />);
    check();
    expect(screen.getByText('Unavailable')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Explain availability' }));
    await screen.findByText('Generated explanation (mock)');
    expect(screen.getByText('Unavailable')).toBeTruthy();
    expect(screen.queryByText('Available')).toBeNull();
    expect(screen.getByText('Room A101 is unavailable for this request. The requested interval overlaps an existing booking.')).toBeTruthy();
  });

  it('displays blocked-room explanation without changing status', async () => {
    render(<App />);
    fireEvent.click(screen.getByLabelText('Classroom simulation: block A101'));
    check();
    fireEvent.click(screen.getByRole('button', { name: 'Explain availability' }));
    await screen.findByText('Generated explanation (mock)');
    expect(screen.getByText('Unavailable')).toBeTruthy();
    expect(screen.getByText('Room A101 is unavailable for this request. This room is currently blocked.')).toBeTruthy();
  });

  it.each(['api-error', 'missing-key', 'invalid-output', 'conflicting-output'])('shows labelled fallback for %s', async mode => {
    render(<App />);
    check();
    fireEvent.change(screen.getByLabelText('Mock response mode'), { target: { value: mode } });
    fireEvent.click(screen.getByRole('button', { name: 'Explain availability' }));
    await screen.findByText('Rule-based fallback');
    expect(screen.getByText('Unavailable')).toBeTruthy();
    expect(screen.queryByText('Available')).toBeNull();
  });

  it('shows fallback after a real 1200 ms timeout', async () => {
    render(<App />);
    check();
    fireEvent.change(screen.getByLabelText('Mock response mode'), { target: { value: 'timeout' } });
    fireEvent.click(screen.getByRole('button', { name: 'Explain availability' }));
    await waitFor(() => expect(screen.getByText('Rule-based fallback')).toBeTruthy(), { timeout: 2500 });
    expect(screen.getByText('Unavailable')).toBeTruthy();
  });

  it('does not display an old response after the user changes the room state', async () => {
    render(<App />);
    check();
    fireEvent.click(screen.getByRole('button', { name: 'Explain availability' }));
    fireEvent.click(screen.getByLabelText('Classroom simulation: block A101'));
    expect(screen.queryByRole('region', { name: 'Availability explanation' })).toBeNull();
    check();
    fireEvent.click(screen.getByRole('button', { name: 'Explain availability' }));
    await screen.findByText('Generated explanation (mock)');
    expect(screen.queryByText('Room A101 is unavailable for this request. The requested interval overlaps an existing booking.')).toBeNull();
    expect(screen.getByText('Room A101 is unavailable for this request. This room is currently blocked.')).toBeTruthy();
  });
});
