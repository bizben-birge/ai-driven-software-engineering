# Smart Campus Practice 12

An optional explanation for the existing room availability checker. The classroom build uses a local mock, not a live LLM. It makes no provider calls and needs no API key. The existing booking checker alone decides Available or Unavailable.

Student: Sulubekov Dias, 24B032038. Classes: Thursday, 16:00-17:00 (lesson 14:00-17:00).

Live demo: https://smart-campus-practice-12-dias.qorsastudio.chatgpt.site

Source and submission files: https://github.com/bizben-birge/ai-driven-software-engineering/tree/main/practice-12

Only A101 is shown. The labelled blocked-state toggle changes its classroom scenario without changing stored bookings. The two original fixtures remain unchanged for baseline regression tests.

## Run
Tested with Node.js 24.13.0 and npm 11.6.2. From this directory:

```text
npm ci
npm run dev
npm test
npm run typecheck
npm run lint
npm run build
npm run preview
```

All old tests remain in src/utils. New feature tests are in src/explanation and UI tests in src/components. No external provider or real data is used.

## Feature contract
User story: As a student, I want a short explanation of room availability so I understand the decision.

- F-AC1: existing availability and overlap rules remain unchanged.
- F-AC2: explanations agree with the deterministic result and invent no booking details.
- F-AC3: empty, malformed and overly long input is rejected before the adapter.
- F-AC4: timeout, simulated API error or missing key produces a safe deterministic fallback.
- F-AC5: the UI distinguishes confirmed status from generated mock text and fallback.

Input has exactly roomLabel, start, end, isAvailable and reasonCode. roomLabel is 1-60 ASCII letters, digits, spaces, underscores or hyphens, with no surrounding whitespace. Minutes are integers in 0-1440. An INVALID_TIME explanation may use null for an invalid endpoint. isAvailable is a Boolean; only AVAILABLE may pair with true. Other reason codes are INVALID_TIME, INVALID_CURRENT_TIME, PAST_TIME, TOO_LONG, BLOCKED, OVERLAP and OTHER_UNAVAILABLE. A primary reason is projected from the first existing checker reason; the confirmed panel still shows every reason.

The adapter output is an object with exactly one explanation string, 1-320 characters and at most two sentences. Responses must match the approved explanation for the supplied status and reason. This deliberately strict classroom contract rejects unsupported facts; it is not a general solution to semantic validation of arbitrary LLM prose.

## Flow and trust boundary
Form -> existing checkAvailability -> confirmed result -> minimal structured context -> input validator -> mock adapter -> format and factual validation -> explanation UI.

The confirmed result is rendered separately. No booking list, person name or booking description enters the adapter. It receives a frozen copy and has no setter for confirmed status or bookings. Error paths use local facts. The service times out after 1200 ms and cancels its mock timer. Input changes hide and remount the explanation panel, so an older response cannot replace the new result.

For this explicitly labelled mock, the adapter runs in the browser and no network boundary is crossed. With a real provider, replace this boundary with a server endpoint: browser -> server validates request and recomputes deterministic status -> server provider adapter -> output validation -> browser. Provider keys must exist only on the server. That extension is outside this submission.

## Demonstration
1. Room A101, 11:00-720, current time 540: Available. Click Explain availability.
2. Room A101, 10:30-690: overlap, Unavailable.
3. Enable Classroom simulation: block A101, then check again: Unavailable.
4. Use the Classroom failure simulation section to try timeout, API failure, unavailable key, malformed response and conflicting response. These are labelled local fault simulations.
5. Change any input during an explanation and recheck; no old explanation should appear.

The mock uses deterministic text templates. prompts.ts contains three prompts and a selected system/context contract for comparison; prompt wording is not interpreted by the mock. Mock latency and zero provider cost do not predict live model latency, price or quality.

## Baseline
Reconstructed from Assignment_04/smart-campus-a4-initial-source.zip (Practice 10 checkpoint 1b5b5cc), overlaid with the final Practice_11 App.tsx, validation.ts, regression.test.ts and AGENTS.md. Before feature edits: 38 tests passed, typecheck/lint/build passed. The untouched source checkpoint and SHA-256 manifest are retained in the local work folder, outside the hosted project.

## Submission materials
The GitHub practice-12 folder contains the individual source files, README.pdf, the report in docs, screenshots and evidence. The main report PDF is also sent as the email attachment. No ZIP or other source archive is needed.

The report covers Tasks 1-7, three prompt designs with the same mock reference output, 17 observed cases, independent review and the fixes. Historical review line numbers refer to the candidate or the earlier reviewed revision; evidence identifies that context.
