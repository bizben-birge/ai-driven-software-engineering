# Smart Campus Practice 13 - code-based version

Room availability checker for one fictional room (Room A101). This is the code-based half of Practice 13 "Compare code-based and low-code solutions". The low-code half is an Appsmith app; both follow the same contract and the same eight tests.

Student: Sulubekov Dias, 24B032038. Classes: Thursday, 14:00-17:00.

Live demo (public, no sign-in): https://smart-campus-practic-lkw3.bolt.host

Source and submission files: https://github.com/bizben-birge/ai-driven-software-engineering/tree/main/practice-13

## Contract
User story: As a student, I want to check if Room A101 is free for a future start time and a duration, so that I can plan a study session.

Inputs: start time (HH:MM), duration in minutes, room blocked flag, fixed fictional bookings (A101: 10:00-11:00 Data Structures Lecture). The simulated current time is 09:00, so the tests always give the same answer.

Outputs: available (true or false), reason code, visible message.

- AC1: Start time must be in the future.
- AC2: Duration must be greater than zero and at most 120 minutes.
- AC3: Overlapping bookings are unavailable.
- AC4: Blocked room is unavailable.
- AC5: Display a clear decision without changing existing bookings.
- AC6: Invalid input receives understandable feedback.

Reason codes and the order of checks (first match wins):

1. INVALID_START_TIME: start is empty or not HH:MM.
2. PAST_START_TIME: start is 09:00 or earlier.
3. INVALID_DURATION: duration is empty, not a whole number, 0 or negative.
4. DURATION_TOO_LONG: duration is more than 120.
5. ENDS_AFTER_MIDNIGHT: start + duration is after 24:00.
6. ROOM_BLOCKED: the room is blocked.
7. OVERLAP: the interval overlaps a booking. Touching ends (for example 11:00 after 10:00-11:00) are allowed.
8. AVAILABLE: none of the above.

Codes 1-5 are shown as "Check your input" (validation error), 6-7 as "Unavailable", 8 as "Available".

## Shared tests
| ID | Start | Duration | Blocked | Expected |
| --- | --- | --- | --- | --- |
| T1 | 11:30 | 60 | no | Available, AVAILABLE |
| T2 | 10:30 | 60 | no | Unavailable, OVERLAP |
| T3 | 11:30 | 60 | yes | Unavailable, ROOM_BLOCKED |
| T4 | 11:30 | 0 | no | Validation error, INVALID_DURATION |
| T5 | 11:30 | 121 | no | Validation error, DURATION_TOO_LONG |
| T6 | 08:00 | 30 | no | Validation error, PAST_START_TIME |
| T7 | 11:00 | 60 | no | Available, AVAILABLE |
| T8 | after T1-T7 | | | booking list still has one booking 10:00-11:00 |

## Structure
- src/contract/validation.ts: parses and checks the input only.
- src/contract/availability.ts: blocked and overlap rules only. It reuses overlapsExisting from src/utils/validation.ts.
- src/contract/messages.ts: visible text for every reason code.
- src/contract/checkRoom.ts: joins the three parts and returns one decision.
- src/contract/fixtures.ts: frozen copy of the A101 baseline bookings and the simulated time.
- src/App.tsx: form, decision panel, timeline and read-only booking list. Works at desktop and narrow width.
- Tests: src/contract/contract.test.ts (rules), src/components/App.test.tsx (UI), plus the unchanged old tests in src/utils.

## Run
```text
npm ci
npm run dev
npm test
npm run typecheck
npm run lint
npm run build
```

## Limitations
- One room and one fixed booking. The simulated clock is fixed at 09:00 and does not follow the real time.
- It only checks availability. It never creates or saves a booking.
- npm audit shows 0 problems for the runtime packages. It still shows 13 problems in development tools (vite dev server, vitest, typescript-eslint). They are not part of the published site. Upgrading them needs major version changes, so this is left as a known risk.
