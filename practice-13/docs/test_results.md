# Eight-case test table (expected and observed)

Both runs were on the public pages, not in the editors. Code-based: Chrome, 26 Nov 2026, final build index-CfsNHm_9.js
(11:33-11:35 UTC). Low-code: built-in browser without login, 26 Nov 2026 (12:11-12:12 UTC).

| Test | Input | Expected | Code-based observed | Low-code observed |
|---|---|---|---|---|
| T1 | 11:30, 60, not blocked | Available, AVAILABLE | Available, AVAILABLE, 11:30-12:30 - pass | Available, AVAILABLE, 11:30-12:30 - pass |
| T2 | 10:30, 60 | Unavailable, OVERLAP | Unavailable, OVERLAP with 10:00-11:00 - pass | Unavailable, OVERLAP with 10:00-11:00 - pass |
| T3 | 11:30, 60, blocked | Unavailable, ROOM_BLOCKED | Unavailable, ROOM_BLOCKED - pass | Unavailable, ROOM_BLOCKED - pass |
| T4 | 11:30, 0 | validation error, INVALID_DURATION | Check your input, INVALID_DURATION - pass | validation_error, INVALID_DURATION - pass |
| T5 | 11:30, 121 | validation error, DURATION_TOO_LONG | Check your input, DURATION_TOO_LONG - pass | validation_error, DURATION_TOO_LONG - pass |
| T6 | 08:00, 30 | validation error, PAST_START_TIME | Check your input, PAST_START_TIME - pass | validation_error, PAST_START_TIME - pass |
| T7 | 11:00, 60 | Available, AVAILABLE | Available, AVAILABLE, 11:00-12:00 - pass | Available, AVAILABLE, 11:00-12:00 - pass |
| T8 | after all checks | bookings unchanged | 1 booking 10:00-11:00, "Checks run: 8" - pass | 1 booking 10:00-11:00, "Checks run: 7" - pass |
| Result | | | 8 / 8 | 8 / 8 |

Code-based "Checks run: 8": seven tests plus one repeated click in the same session. The counter only shows that
checking does not touch the list.

Extra checks
| Check | Code-based | Low-code |
|---|---|---|
| Automated tests | 94 pass (26 contract, 11 UI, 57 old rule tests) | none in CI; editor self check of T1-T8: 8/8 |
| Boundaries (120/121, start = now, touching, 23:30+31, 25:00, 11:60) | unit tests pass | not tested one by one in the UI |
| Markup input in start time | rejected, shown as text (UI test) | INVALID_START_TIME, no HTML rendered |
| Old result hidden after input change | yes (UI test) | yes (screenshot) |
| Narrow screen 375 px | no horizontal scroll | no page scroll; button label cut, table scrolls sideways |
| Defects found during tests | D1 (fixed) | LC1 (fixed) |
| Unresolved defects | 0 | 0 |
