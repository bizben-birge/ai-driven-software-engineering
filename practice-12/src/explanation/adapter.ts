import { ExplanationError, type ExplanationInput } from './contract';
import { factExplanation } from './facts';
import { createPrompt } from './prompts';

export const MOCK_MODES = ['normal', 'timeout', 'api-error', 'missing-key', 'invalid-output', 'conflicting-output'] as const;
export type MockMode = typeof MOCK_MODES[number];
export type ExplanationAdapter = (input: Readonly<ExplanationInput>, signal: AbortSignal) => Promise<unknown>;

export function createMockAdapter(mode: MockMode = 'normal'): ExplanationAdapter {
  return (input, signal) => new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new ExplanationError('TIMEOUT'));
      return;
    }
    const onAbort = () => {
      clearTimeout(timer);
      reject(new ExplanationError('TIMEOUT'));
    };
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      if (mode === 'api-error') return reject(new ExplanationError('API_ERROR'));
      if (mode === 'missing-key') return reject(new ExplanationError('MISSING_KEY'));
      if (mode === 'invalid-output') return resolve({ explanation: 42 });
      if (mode === 'conflicting-output') return resolve({ explanation: 'This room is available. Your booking is confirmed.' });
      createPrompt(input);
      resolve({ explanation: factExplanation(input) });
    }, mode === 'timeout' ? 5000 : 80);
    signal.addEventListener('abort', onAbort, { once: true });
  });
}
