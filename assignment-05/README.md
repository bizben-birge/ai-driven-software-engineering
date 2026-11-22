# Smart Campus Room Availability Checker (Assignment #05)

Student: Sulubekov Dias, ID 24B032038
Live demo: https://smart-campus-assignm-m840.bolt.host
Bolt project: https://bolt.new/p/73126703

A small React + TypeScript + Vite app with fictional data only. The user enters room requirements (attendees and equipment), picks one of the matching rooms and checks a time slot. There is no login, payment, live API or database.

## Requirements

- Node.js 18 or newer (checked with Node 22), npm

## Setup and run

```
npm ci
npm run dev
```

Open the address that Vite prints (usually http://localhost:5173).

## Test and check commands

```
npm run test          # vitest run, all automated tests (70)
npm run typecheck     # tsc --noEmit -p tsconfig.app.json
npm run lint          # eslint .
npm run build         # production build into dist/
npm run preview       # serve the production build locally
npm audit --omit=dev  # dependency advisories for runtime packages
```

There is no format script and no CI pipeline yet (see the report, risk register).

## Acceptance criteria

- AC-A: invalid or past requests are rejected; start must be before end and after the current time.
- AC-B: bookings longer than 120 minutes and overlapping bookings are rejected; touching endpoints are allowed.
- AC-C: a blocked room is never reported as available.
- AC-D: only rooms with capacity >= attendees and all selected equipment are listed; a clear empty state appears when none match.
- AC-E: checks never change booking data; changing the room refreshes the result; feedback is clear on desktop and mobile.

## Project structure

```
src/
  types.ts                          shared types
  data/rooms.ts                     ROOM_CATALOG (5 fictional rooms), EQUIPMENT_OPTIONS, DEFAULT_CURRENT_TIME
  domain/bookingRules.ts            MAX_BOOKING_MINUTES, MINUTE_IN_DAY, durationMinutes()
  domain/availability.ts            validateInterval, checkDuration, overlapsExisting, checkAvailability
  domain/roomFilters.ts             hasEnoughCapacity, hasAllEquipment, filterRooms, resolveSelectedRoom
  domain/bookingRequest.ts          parseBookingRequest: raw form strings -> minutes
  utils/time.ts                     minutesToLabel, timeToMinutes, formatInterval
  components/*.tsx                  UI parts (filters, room list, form, result, timeline, bookings)
  App.tsx                           state and composition only
  test/fixtures.ts                  shared makeRoom() for tests
tests:
  src/domain/availability.test.ts   22 tests (AC-A, AC-B, AC-C, AC-E)
  src/domain/regression.test.ts     13 tests (regression guards, REG-DEP)
  src/domain/roomFilters.test.ts    19 tests (AC-D, room switching, boundaries)
  src/domain/bookingRequest.test.ts 11 tests (parsing, refactoring equivalence)
  src/App.test.tsx                  5 UI tests (jsdom + Testing Library)
```

## Agent instructions

See AGENTS.md (purpose, architecture, safe commands, forbidden actions, review gates). Bolt does not load it automatically, so the relevant rules are pasted into each prompt.

## Versions

- Baseline: commit 021a39b (end of Assignment #04, 56 tests)
- Final: last commit of the Assignment #05 branch a5 (history.bundle in the final source export)
- GitHub copy: https://github.com/bizben-birge/ai-driven-software-engineering/tree/main/assignment-05 (final files one by one; docs/baseline_to_final.diff shows every change from the baseline)
