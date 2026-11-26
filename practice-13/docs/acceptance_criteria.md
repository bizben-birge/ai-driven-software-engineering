# Shared requirement and acceptance-criteria sheet (Practice 13)

Same sheet for the code-based version (Bolt, React + TypeScript) and the low-code version (Appsmith).
Written before both implementations. Fictional data only.

## User story
As a student, I want to check if Room A101 is free for a future start time and a duration, so that I can plan a study session.

## Inputs
| Input | Type | Example |
|---|---|---|
| Start time | text in HH:MM (00:00-23:59) | 11:30 |
| Duration | whole minutes | 60 |
| Room blocked | yes / no | no |
| Existing bookings | fixed fictional list | A101 10:00-11:00 Data Structures Lecture |
| Current time | simulated, fixed | 09:00 |

## Outputs
| Output | Values |
|---|---|
| available | true / false |
| reasonCode | one of the eight codes below |
| message | one clear sentence for the student |

## Acceptance criteria
| ID | Criterion | Reason codes |
|---|---|---|
| AC1 | Start time must be in the future (after 09:00). | PAST_START_TIME |
| AC2 | Duration must be greater than zero and at most 120 minutes. | INVALID_DURATION, DURATION_TOO_LONG |
| AC3 | Overlapping bookings are unavailable. Touching (end = start) is not overlap. | OVERLAP |
| AC4 | Blocked room is unavailable. | ROOM_BLOCKED |
| AC5 | Display a clear decision without changing existing bookings. | all |
| AC6 | Invalid input receives understandable feedback. | INVALID_START_TIME, INVALID_DURATION, ENDS_AFTER_MIDNIGHT |

## Order of checks (first match wins)
1. INVALID_START_TIME - start is not a real HH:MM time
2. PAST_START_TIME - start is 09:00 or earlier
3. INVALID_DURATION - duration is empty, not a whole number, or 0 or less
4. DURATION_TOO_LONG - duration is more than 120
5. ENDS_AFTER_MIDNIGHT - start + duration is later than 24:00
6. ROOM_BLOCKED - the blocked flag is on
7. OVERLAP - the interval overlaps an existing booking
8. AVAILABLE - none of the above

Codes 1-5 are validation errors ("Check your input"), codes 6-7 are "Unavailable", code 8 is "Available".

## Messages (same text in both versions)
| Code | Message |
|---|---|
| AVAILABLE | Available: the room is free from 11:30-12:30. |
| OVERLAP | Unavailable: 10:30-11:30 overlaps the existing booking 10:00-11:00. |
| ROOM_BLOCKED | Unavailable: the room is blocked, so it cannot be booked. |
| INVALID_START_TIME | Please enter the start time as HH:MM, for example 11:30. |
| PAST_START_TIME | The start time must be in the future (after 09:00). |
| INVALID_DURATION | The duration must be a whole number of minutes greater than 0. |
| DURATION_TOO_LONG | The duration must be 120 minutes or less. |
| ENDS_AFTER_MIDNIGHT | The booking must end by 24:00 on the same day. |

## Common test inputs (prepared before implementation)
| Test | Start | Duration | Blocked | Expected |
|---|---|---|---|---|
| T1 | 11:30 | 60 | no | Available, AVAILABLE |
| T2 | 10:30 | 60 | no | Unavailable, OVERLAP |
| T3 | 11:30 | 60 | yes | Unavailable, ROOM_BLOCKED |
| T4 | 11:30 | 0 | no | validation error, INVALID_DURATION |
| T5 | 11:30 | 121 | no | validation error, DURATION_TOO_LONG |
| T6 | 08:00 | 30 | no | validation error, PAST_START_TIME |
| T7 | 11:00 | 60 | no | Available, AVAILABLE (touches the booking end) |
| T8 | after T1-T7 | | | booking list still has only A101 10:00-11:00 |
