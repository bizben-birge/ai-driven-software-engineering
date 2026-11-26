# AI-Driven Software Engineering

Coursework by Sulubekov Dias, 24B032038. This repository starts with Practice 12; every later work is a separate folder.

## Practice 12
- [Individual source files and full README](practice-12/)
- [README as PDF](practice-12/README.pdf)
- [Main report PDF](practice-12/docs/Practice_12_Report.pdf)
- [Editable report](practice-12/docs/Practice_12_Report.docx)
- [Screenshots](practice-12/screenshots/)
- [Verification evidence](practice-12/evidence/)
- [Bolt workspace (account access)](https://bolt.new/~/sb1-ux8l63wx)
- [Public live demo](https://smart-campus-practic-bbg1.bolt.host)

The demo uses one fictional room and a labelled local mock explanation. There are no model API calls, login, database or real reservations. The final application passed 116 tests, typecheck, lint and a production build. The main PDF is also the email attachment; source archives are not required.

To run: open practice-12, run `npm ci`, then `npm run dev`. See the practice README for the full contract and verification commands.

## Assignment 05
- [Individual source files and full README](assignment-05/)
- [README as PDF](assignment-05/README.pdf)
- [AGENTS.md](assignment-05/AGENTS.md)
- [Main report PDF](assignment-05/docs/Assignment_05_Report.pdf)
- [Editable report](assignment-05/docs/Assignment_05_Report.docx)
- [Changes from the baseline (diff)](assignment-05/docs/baseline_to_final.diff) and [commit list](assignment-05/docs/git_history.txt)
- [Screenshots](assignment-05/screenshots/)
- [Verification evidence and AI prompts](assignment-05/evidence/)
- [Bolt project](https://bolt.new/p/73126703)
- [Public live demo](https://smart-campus-assignm-m840.bolt.host)

Smart Campus Room Availability Checker with fictional data only (no login, database or live API). Baseline: end of Assignment 04 (56 tests). Final: 70 tests, typecheck, lint and build pass; release decision CONDITIONAL. AI assistant: Bolt.new agent in Plan mode.

To run: open assignment-05, run `npm ci`, then `npm test` or `npm run dev`.

## Practice 13
- [Individual source files and full README](practice-13/)
- [README as PDF](practice-13/README.pdf)
- [Main report PDF](practice-13/docs/Practice_13_Report.pdf)
- [Editable report](practice-13/docs/Practice_13_Report.docx)
- [Shared acceptance criteria](practice-13/docs/acceptance_criteria.md) and [eight-case test table](practice-13/docs/test_results.md)
- [Code-based source](practice-13/code-based/) and [low-code script, widgets and Appsmith export](practice-13/low-code/)
- [Screenshots](practice-13/screenshots/)
- [Verification evidence and AI prompts](practice-13/evidence/)
- [Bolt project](https://bolt.new/~/sb1-n7udkocg)
- [Public live demo, code-based](https://smart-campus-practic-lkw3.bolt.host)
- [Public live demo, low-code (Appsmith)](https://app.appsmith.com/app/smart-campus-practice-13-low-code/page1-6b081c37f6c6480b7e2a987c)

Compare code-based and low-code solutions: the same Smart Campus availability contract built in Bolt (React + TypeScript) and in Appsmith. Both pass T1-T8 (8/8); the code-based version also passes 94 automated tests. Fictional data only, no login, database or secrets.

To run the code-based version: open practice-13/code-based, run `npm ci`, then `npm test` or `npm run dev`.
