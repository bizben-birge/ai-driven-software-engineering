// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import App from '../App';
import { CONTRACT_BOOKINGS } from '../contract/fixtures';
import { SHARED_CASES } from '../contract/testCases';

afterEach(cleanup);

function check(startTime: string, duration: string, blocked: boolean) {
  fireEvent.change(screen.getByLabelText('Start time'), { target: { value: startTime } });
  fireEvent.change(screen.getByLabelText('Duration (minutes)'), { target: { value: duration } });
  const box = screen.getByLabelText('Room is blocked (fictional status)') as HTMLInputElement;
  if (box.checked !== blocked) fireEvent.click(box);
  fireEvent.click(screen.getByRole('button', { name: 'Check availability' }));
  return screen.getByTestId('decision');
}

const LABELS = { available: 'Available', unavailable: 'Unavailable', validation_error: 'Check your input' } as const;

describe('UI runs the shared cases', () => {
  it.each(SHARED_CASES)('$id $title', (testCase) => {
    render(<App />);
    const decision = check(testCase.startTime, testCase.duration, testCase.blocked);
    expect(within(decision).getByText(LABELS[testCase.expectedKind])).toBeTruthy();
    expect(within(decision).getByTestId('reason-code').textContent).toBe(testCase.expectedReason);
  });

  it('T8 shows the same booking list after every check', () => {
    render(<App />);
    const before = screen.getByTestId('booking-list').textContent;
    for (const testCase of SHARED_CASES) check(testCase.startTime, testCase.duration, testCase.blocked);
    expect(screen.getByTestId('booking-list').textContent).toBe(before);
    expect(CONTRACT_BOOKINGS).toHaveLength(1);
    expect(screen.getByText(/Checks run: 7\./)).toBeTruthy();
  });

  it('hides an old decision when an input changes', () => {
    render(<App />);
    check('11:30', '60', false);
    fireEvent.change(screen.getByLabelText('Duration (minutes)'), { target: { value: '30' } });
    expect(screen.queryByTestId('decision')).toBeNull();
  });

  it('draws the candidate on the timeline only for a valid request', () => {
    const { container } = render(<App />);
    check('11:30', '121', false);
    expect(container.querySelector('.absolute.border-dashed')).toBeNull();
    check('11:30', '60', false);
    expect(container.querySelector('.absolute.border-dashed')).not.toBeNull();
  });

  it('shows markup-like input as text and never as HTML', () => {
    render(<App />);
    const decision = check('11:30', '<img src=x onerror=alert(1)>', false);
    expect(decision.querySelector('img')).toBeNull();
    expect(within(decision).getByTestId('reason-code').textContent).toBe('INVALID_DURATION');
  });
});
