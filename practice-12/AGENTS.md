# Smart Campus Practice 12

## Scope
Continue the final Practice 11 single-room availability checker. Show only A101 in the UI. A labelled classroom toggle changes its blocked state without mutating the baseline fixture. Retain both original fixtures only for the unchanged baseline tests.
Add only the optional Explain availability feature requested by Lesson 11 (submission number 12). This explicitly supersedes the previous no-UI-change rule for the explanation feature.

## Source of truth
- src/utils/validation.ts is the deterministic booking checker. Keep its behavior and file contents unchanged.
- src/utils/bookingRules.ts, src/sampleData.ts, src/types.ts and the 38 original booking/regression tests must remain unchanged.
- The explanation adapter must not decide availability, write bookings, or receive the booking list or personal data.
- The new contract uses F-AC1 to F-AC5 in README.md to avoid confusing it with the old booking AC1 to AC6.

## Structure
- src/App.tsx: form, confirmed decision and composition.
- src/components/ExplanationPanel.tsx: optional explanation and labelled classroom failure modes.
- src/explanation/contract.ts: bounded input/output contract and reason-code projection.
- src/explanation/facts.ts: approved explanation facts and deterministic fallback.
- src/explanation/adapter.ts: clearly labelled local mock; no external requests.
- src/explanation/service.ts: input validation, timeout, response validation and fallback.
- src/explanation/prompts.ts: three candidate instructions and the selected structured prompt.

## Constraints
No login, database, booking creation, payment, real personal information or client-side secrets. No provider API calls in the classroom mock. A future real provider requires a separate server adapter and a new review; never put a key in VITE_* variables.
Keep the supplied React + TypeScript + Vite project. Do not add runtime dependencies. Test-only jsdom and Testing Library are allowed for the required UI regression checks.
Use relative imports. Do not add comments to new application code. Preserve existing tests and assertions.

## Verification and review
Run npm test, npm run typecheck, npm run lint and npm run build.
Test normal cases, invalid inputs, timeout, API error, missing key, malformed/conflicting output, and a pending response when inputs change.
Review the diff together with this file, README.md, the feature contract and related caller files.
Report file/line evidence, severity, verification and the smallest useful fix. Classify findings as confirmed, plausible/unverified or unsupported. Do not invent findings to meet a count.
A requested read-only reviewer must not edit files, publish, merge or request production access.
Keep baseline, review and final evidence outside the deployed source. Never claim a check or human approval happened without evidence. The student makes the final submission decision.

## Delivery
Save source and evidence locally. The user requested a working published demo and a report under Practice_12. Publish the tested mock only after checks pass. No ZIP, WinRAR or OneDrive link in submission attachments. Word is for editing; the PDF is for submission.
