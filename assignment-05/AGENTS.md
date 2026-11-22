# AGENTS.md

## Purpose
Smart Campus Room Availability Checker: a small React + TypeScript + Vite single page with fictional data only.
The user sets requirements (attendees, equipment), picks one matching room and a time interval, and sees an Available / Unavailable decision with clear reasons.
There is no backend, login, database, payment or live API.

## Architecture
- src/data/rooms.ts - room catalog (5 fictional rooms), equipment options, default current time
- src/domain/bookingRules.ts - rule constants (120, 1440) and durationMinutes
- src/domain/availability.ts - time rules: validateInterval, checkDuration, overlapsExisting, checkAvailability
- src/domain/roomFilters.ts - room rules: hasEnoughCapacity, hasAllEquipment, filterRooms, resolveSelectedRoom
- src/domain/bookingRequest.ts - parseBookingRequest: the one place that turns raw form strings (start, end, current time) into numbers
- src/utils/time.ts - time parsing and formatting helpers
- src/components/*.tsx - UI parts only; src/App.tsx - state and composition only
- src/types.ts - shared types; src/test/fixtures.ts - shared makeRoom() for tests
- Tests: src/domain/*.test.ts (unit) and src/App.test.tsx (UI behaviour in jsdom)

## Acceptance criteria (must stay true after every change)
- AC-A: invalid or past requests are rejected; start must be before end and after the current time.
- AC-B: bookings longer than 120 minutes and overlapping bookings are rejected; touching endpoints are allowed.
- AC-C: a blocked room is never reported as available.
- AC-D: only rooms with capacity >= attendees and all selected equipment are listed; a clear empty state appears when none match.
- AC-E: checks never change booking data; changing the room refreshes the result; feedback is clear on desktop and mobile.

## Setup
- Node.js 18 or newer, npm
- npm ci (or npm install when the lockfile must change; this needs approval)

## Safe commands
- npm run test (vitest run)
- npm run typecheck
- npm run lint
- npm run build
- npm run dev / npm run preview (local only)
- npm audit (read-only report)
- git status, git diff, git log (read-only)

## Coding conventions
- TypeScript strict mode; pure functions for rules; no comments needed for obvious code.
- Keep time rules in availability.ts and room rules in roomFilters.ts; do not mix them.
- Use relative imports (./ and ../), not the @/ alias.
- Do not change existing reason texts or the values of rooms A101 and B202.
- Use a design pattern only for a concrete maintainability problem; no Singleton, Factory or class hierarchies.

## Test expectations
- Every change keeps all existing tests green; do not weaken or delete assertions.
- A bug fix comes with a focused regression test that fails before the fix and passes after it.
- Before proposing acceptance run: npm run test, npm run typecheck, npm run lint, npm run build. Report the real output.

## Forbidden actions
- No secrets: no API keys, tokens, passwords or .env files; no real personal data.
- No production deployment: the agent must not publish, deploy, change hosting or domains, or add CI/CD secrets. Only the student publishes with Bolt Publish after review.
- No destructive commands: no rm -rf, no git reset --hard, no force push, no deleting tests or history.
- No unreviewed dependency changes: do not add, remove or upgrade packages, or edit package.json / package-lock.json, without the student's approval.
- No backend, database, login, payments, live APIs, new pages or saved bookings. @supabase/supabase-js is unused; do not import it.

## Review gates
1. Read-only review first (Bolt Plan mode); cite files, functions and lines.
2. Propose a minimal diff and wait for the student's approval before editing files.
3. One change at a time; the student reads the diff and runs the safe commands.
4. Do not claim that a command or test ran unless its real output is shown.
5. Only the student merges and publishes.

## Note for Bolt
Bolt does not load this file automatically. The student pastes the relevant sections into each prompt.
