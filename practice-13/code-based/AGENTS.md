# Smart Campus Practice 13 (code-based track)

## Scope
Implement the shared Practice 13 availability contract for one fictional room, Room A101.
Inputs: start time (HH:MM), duration in minutes, room blocked flag, the fixed fictional bookings. The simulated current time is 09:00.
Outputs: available (true/false), one reason code and one visible message.
The optional explanation feature from Practice 11/12 is not required and is removed from the UI and source.

## Source of truth
- src/utils/validation.ts, src/utils/bookingRules.ts, src/sampleData.ts and src/types.ts stay unchanged. The old 57 booking/regression/form tests stay unchanged.
- src/contract/ holds the new contract: validation.ts (input checks), availability.ts (blocked and overlap), messages.ts (visible text), checkRoom.ts (composition), fixtures.ts (frozen copy of the A101 baseline bookings) and testCases.ts (T1-T7 shared inputs).
- Do not change the six acceptance criteria or the booking rules to favor one track.

## Constraints
No login, database, booking creation, payment, real personal data, external API or secrets. No runtime dependencies besides React and lucide-react.
Relative imports. No comments in application code. Render user input only as text.

## Verification
Run npm test, npm run typecheck, npm run lint and npm run build. Run the shared cases T1-T8 by hand in the browser at desktop and narrow width. Never claim a check that was not run.

## Delivery
Source, README.pdf, report, screenshots and evidence go to GitHub bizben-birge/ai-driven-software-engineering/practice-13 as separate files. No ZIP. Publish only after checks pass.
