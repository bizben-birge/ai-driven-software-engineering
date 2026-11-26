# Practice 13 - Compare code-based and low-code solutions

Smart Campus room availability checker, built two times with one shared contract and the same eight tests.

Student: Sulubekov Dias, 24B032038. Classes: Thursday, 14:00 – 17:00.

| | Link |
|---|---|
| Code-based demo (Bolt, public, no sign-in) | https://smart-campus-practic-lkw3.bolt.host |
| Low-code demo (Appsmith, public, no sign-in) | https://app.appsmith.com/app/smart-campus-practice-13-low-code/page1-6b081c37f6c6480b7e2a987c |
| Bolt project | https://bolt.new/~/sb1-n7udkocg |
| This folder | https://github.com/bizben-birge/ai-driven-software-engineering/tree/main/practice-13 |

AI tools: Bolt.new Plan mode, option "Standard" (model and version not shown) for the plan; Claude Opus 5.5 (Anthropic)
for code, tests, Appsmith setup, comparison review and report. Appsmith Cloud free plan is the low-code builder.

## Results
| | Code-based | Low-code |
|---|---|---|
| T1-T8 on the public page | 8 / 8 | 8 / 8 |
| Automated tests | 94 pass | none in CI; editor self check 8 / 8 |
| Defects found / open | D1 / 0 | LC1 / 0 |
| Build + repair time | ~25 + ~12 min | ~17 + ~3 min |

Recommendation: code-based for this feature; low-code only for quick internal screens with no secrets.

## Folders
- code-based/ - React + TypeScript + Vite source (same files as in Bolt; README has the live link added after import).
  Run: npm ci, npm test, npm run typecheck, npm run lint, npm run build, npm run dev.
- low-code/ - Appsmith JS object (BookingLogic.js), widget settings (WIDGETS.md) and the Appsmith export JSON
  (export/). To open it: Appsmith -> workspace -> Import -> choose the JSON file.
- docs/ - report (PDF and DOCX), shared acceptance-criteria sheet, eight-case test table.
- screenshots/ - code-based, low-code and the figures used in the report.
- evidence/ - test logs, Bolt plan answer, prompts, time log, security checks, AI comparison review.

Fictional data only. No login, payment, real personal data, database or secrets in either version.
The email gets only the report PDF; everything else is here as separate files (no ZIP).
