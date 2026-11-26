# AI comparison and review (Task 6 and Task 7)

Tool: Claude Opus 5.5 (Anthropic), the same assistant that built both versions in this session.
Bolt could not run this prompt because the free Bolt plan was out of tokens after the implementation plan.
Because the reviewer also built the work, every claim below was checked again against a file or screenshot.
Claims with no evidence are marked "not verified".

## Prompt used (suggested comparison prompt from the slides, unchanged)

Compare these code-based and low-code implementations against the same requirements and test evidence.
Assess correctness, maintainability, portability, cost, and security. Identify unsupported assumptions.
For each risk, provide the observable evidence needed to verify it. Do not treat a platform as secure
merely because it is low-code.

Input given with the prompt: the shared contract (docs/acceptance_criteria.md), code-based source and test logs,
the low-code JS object and Appsmith export, the two T1-T8 tables, the DAST notes and the npm audit output.

## Answer (short form)

Correctness
- Both versions pass T1-T8 (8/8) on the public pages. Evidence: screenshots code_T1..T8 and lc_T1..lc_T7_T8.
- The code version also has 94 automated tests, with boundaries (120/121 minutes, start equal to now,
  touching bookings, 23:30 plus 31 minutes, malformed times). The low-code version has only manual UI runs
  and one editor self check of T1-T8. Boundaries in the low-code UI were not tested one by one.
- Unsupported assumption: "the two versions use the same rules". The low-code rules are a hand copy in a
  JS object. The copy was the same on 26 Nov (the export body equals lowcode/BookingLogic.js), but nothing
  stops the two copies from drifting later. Evidence needed: a shared test run against both after each change.

Maintainability
- Code: typed modules, lint, unit and UI tests, Git history, diff review. Evidence: package.json scripts, logs.
- Low-code: rules in one JS object, but behaviour also sits in widget properties (bindings, events, colours).
  A reviewer must open each widget or read a 78 KB export JSON. Two defects show this: LC1 came from the
  order of a platform event (onTextChanged ran after onClick), not from the rule code.

Portability
- Code: plain React + Vite build; runs on any static host. Evidence: npm run build, dist folder.
- Low-code: the export JSON can be imported only into Appsmith (cloud or self-hosted). Not verified: import
  into a self-hosted Appsmith was not tried.

Cost
- Measured: both used free plans, no payment. Bolt free tokens ran out during this practice.
- Not verified: future plan prices and limits for both platforms. They change and were not checked here.

Security
- Code: no secrets, no backend, inputs are typed, React renders text not HTML (UI test). SAST (grep and
  6 semgrep rules): 0 findings. SCA: 0 production advisories, 13 dev-tool advisories (vite, vitest, esbuild).
  Bolt host: HSTS yes, but no CSP, no X-Frame-Options, no X-Content-Type-Options (cannot be set on the free host).
- Low-code: no datasource, no connector, no API key. Raw input is never copied into the result text; the
  markup test did not render HTML. But: (1) a public Appsmith app sends the full JS object source to any
  visitor (public view API, checked without login); (2) "Make application public" is one switch, and workspace
  invites give access to all apps in the workspace; (3) the CSP allows scripts from any host and framing by
  any site; (4) the platform adds third-party scripts; (5) platform dependencies cannot be audited by me,
  so SCA is the vendor's job.
- Low-code is not safer by default. It moves some controls to the vendor and hides others in settings.

Risks and the evidence needed
| Risk | Evidence needed to verify |
| Rules drift between the two copies | run T1-T8 and the boundary cases on both after every change |
| Secret placed in a public JS object | read the public view API response without login and search for keys |
| Wrong app shared or made public | share settings screenshot; open the URL in a signed-out browser |
| Clickjacking on both hosts | response headers (X-Frame-Options or CSP frame-ancestors) |
| Vulnerable dev tools in the code project | npm audit after each dependency update |
| Platform event order breaks a result (like LC1) | manual first-click test after every low-code edit |

## My check of this answer
- 8/8 for both: confirmed by the screenshots and the test logs.
- "export body equals local file": confirmed by a script (JS equal to local file: True).
- "JS source is public": confirmed in a signed-out browser (evidence/dast_lowcode_headers.txt).
- Price and plan limits: left as not verified on purpose.
- Limit: only one markup string was tested in the low-code app, so I do not claim that the Appsmith text
  widget is safe for every input. The claim stays at what was observed.
