import {
  EXPLANATION_TIMEOUT_MS, ExplanationError,
  validateExplanationInput, validateExplanationResponse,
  type ExplanationResult, type FailureCode,
} from './contract';
import { createMockAdapter, type ExplanationAdapter } from './adapter';
import { factExplanation } from './facts';

export async function explainAvailability(
  value: unknown,
  adapter: ExplanationAdapter = createMockAdapter(),
  timeoutMs = EXPLANATION_TIMEOUT_MS,
): Promise<ExplanationResult> {
  const started = performance.now();
  const elapsedMs = () => Math.round(performance.now() - started);
  let input;
  try {
    input = validateExplanationInput(value);
  } catch {
    return {
      explanation: 'The explanation request was rejected. Check the confirmed booking status above.',
      source: 'fallback', failure: 'INVALID_INPUT', elapsedMs: elapsedMs(),
    };
  }
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        reject(new ExplanationError('TIMEOUT'));
        controller.abort();
      }, timeoutMs);
    });
    const response = await Promise.race([
      adapter(Object.freeze({ ...input }), controller.signal), timeout,
    ]);
    const validated = validateExplanationResponse(response);
    if (validated.explanation !== factExplanation(input)) throw new ExplanationError('INVALID_OUTPUT');
    return { ...validated, source: 'mock', elapsedMs: elapsedMs() };
  } catch (error) {
    const failure: FailureCode = error instanceof ExplanationError ? error.code : 'API_ERROR';
    return { explanation: factExplanation(input), source: 'fallback', failure, elapsedMs: elapsedMs() };
  } finally {
    clearTimeout(timer);
    controller.abort();
  }
}
