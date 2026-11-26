# Low-code configuration (read from the Appsmith export)

Page: Page1. Datasources: none. JS objects: BookingLogic.

## TitleText (TEXT_WIDGET)
- text: Smart Campus availability check - low-code version (Appsmith). Practice 13. Fictional data only.
- isVisible: True
- position: row 1.0-5.0, column 0.0-64.0 (64-column grid)

## StartInput (INPUT_WIDGET_V2)
- label: Start time (HH:MM)
- placeholderText: 11:30
- inputType: TEXT
- tooltip: Example: 11:30. The simulated current time is 09:00.
- onTextChanged: {{BookingLogic.clearDecision()}}
- isVisible: True
- position: row 9.0-16.0, column 0.0-27.0 (64-column grid)

## DurationInput (INPUT_WIDGET_V2)
- label: Duration (minutes)
- placeholderText: 60
- inputType: NUMBER
- tooltip: Whole minutes, from 1 to 120.
- onTextChanged: {{BookingLogic.clearDecision()}}
- isVisible: True
- position: row 16.0-23.0, column 0.0-27.0 (64-column grid)

## BlockedCheckbox (CHECKBOX_WIDGET)
- label: Room blocked (maintenance)
- defaultCheckedState: False
- onCheckChange: {{BookingLogic.clearDecision()}}
- isVisible: True
- position: row 23.0-27.0, column 0.0-27.0 (64-column grid)

## CheckButton (BUTTON_WIDGET)
- text: Check availability
- tooltip: Runs the availability check. It never changes the booking list.
- onClick: {{BookingLogic.check()}}
- isVisible: True
- position: row 27.0-31.0, column 0.0-17.0 (64-column grid)

## RoomText (TEXT_WIDGET)
- text: Room {{BookingLogic.roomName}} - Lecture Hall. Simulated current time: {{BookingLogic.toLabel(BookingLogic.nowMinutes)}}. Maximum duration: {{BookingLogic.maxMinutes}} minutes.
- isVisible: True
- position: row 5.0-9.0, column 0.0-64.0 (64-column grid)

## ResultText (TEXT_WIDGET)
- text: {{appsmith.store.decision && appsmith.store.decision.key === BookingLogic.keyOf(StartInput.text, DurationInput.text, BlockedCheckbox.isChecked) ? appsmith.store.decision.message + ' Reason code: ' + appsmith.store.decision.reasonCode + '. Result type: ' + appsmith.store.decision.kind + '.' : 'No result yet. Enter a start time and a duration, then press Check availability.'}}
- backgroundColor: {{!(appsmith.store.decision && appsmith.store.decision.key === BookingLogic.keyOf(StartInput.text, DurationInput.text, BlockedCheckbox.isChecked)) ? '#F1F5F9' : appsmith.store.decision.kind === 'available' ? '#DCFCE7' : appsmith.store.decision.kind === 'unavailable' ? '#FEE2E2' : '#FEF3C7'}}
- isVisible: True
- position: row 31.0-35.0, column 0.0-64.0 (64-column grid)

## BookingsTable (TABLE_WIDGET_V2)
- label: Data
- tableData: {{BookingLogic.bookings}}
- isVisible: True
- position: row 36.0-56.0, column 0.0-64.0 (64-column grid)

## ChecksText (TEXT_WIDGET)
- text: Checks run: {{appsmith.store.checks || 0}}. Checking never changes the read-only booking list above.
- isVisible: True
- position: row 56.0-60.0, column 0.0-64.0 (64-column grid)
