import { useEffect, useRef, useState } from 'react';
import { createMockAdapter, type MockMode } from '../explanation/adapter';
import type { ExplanationInput, ExplanationResult } from '../explanation/contract';
import { explainAvailability } from '../explanation/service';

const FAILURE_LABELS = {
  INVALID_INPUT: 'Invalid explanation input',
  TIMEOUT: 'The simulated service timed out',
  API_ERROR: 'The simulated service failed',
  MISSING_KEY: 'API key unavailable (simulation)',
  INVALID_OUTPUT: 'The response did not pass validation',
};

export default function ExplanationPanel({ input }: { input: ExplanationInput }) {
  const [mode, setMode] = useState<MockMode>('normal');
  const [pending, setPending] = useState(false);
  const [answer, setAnswer] = useState<ExplanationResult | null>(null);
  const requestId = useRef(0);

  useEffect(() => () => { requestId.current += 1; }, []);

  async function explain() {
    const id = ++requestId.current;
    setPending(true);
    setAnswer(null);
    const result = await explainAvailability(input, createMockAdapter(mode));
    if (id !== requestId.current) return;
    setAnswer(result);
    setPending(false);
  }

  return (
    <section aria-label="Availability explanation" className="mt-5 rounded-xl border border-slate-200 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800">Understand this result</h2>
          <p className="mt-1 text-sm text-slate-600">Mock mode · No external AI service or API key</p>
        </div>
        <button type="button" onClick={explain} disabled={pending}
          className="rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-900 disabled:opacity-50">
          {pending ? 'Explaining…' : 'Explain availability'}
        </button>
      </div>
      <p className="mt-2 text-sm text-slate-600">The confirmed status above comes from booking rules. An explanation cannot create or change a booking.</p>
      <div aria-live="polite" aria-atomic="true">
        {pending && <p className="mt-3 text-sm text-slate-600">Preparing a short explanation…</p>}
        {answer && <div className="mt-3 rounded-lg bg-slate-50 p-3">
          <h3 className="text-sm font-bold text-slate-800">{answer.source === 'mock' ? 'Generated explanation (mock)' : 'Rule-based fallback'}</h3>
          {answer.failure && <p className="mt-1 text-sm text-amber-800">{FAILURE_LABELS[answer.failure]}. A safe explanation is shown below.</p>}
          <p className="mt-2 text-base text-slate-800">{answer.explanation}</p>
          <p className="mt-2 text-xs text-slate-500">{answer.elapsedMs} ms · 0 API calls · $0 provider cost</p>
        </div>}
      </div>
      <details className="mt-3 text-sm text-slate-600">
        <summary className="cursor-pointer">Classroom failure simulation</summary>
        <label className="mt-2 block" htmlFor="explanation-mode">Mock response mode</label>
        <select id="explanation-mode" value={mode} disabled={pending}
          onChange={event => { setMode(event.target.value as MockMode); setAnswer(null); }}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
          <option value="normal">Normal response</option>
          <option value="timeout">Timeout</option>
          <option value="api-error">API failure</option>
          <option value="missing-key">Unavailable API key</option>
          <option value="invalid-output">Malformed response</option>
          <option value="conflicting-output">Conflicting response</option>
        </select>
        <p className="mt-2">These modes simulate service failures locally. They do not connect to a provider.</p>
      </details>
    </section>
  );
}
