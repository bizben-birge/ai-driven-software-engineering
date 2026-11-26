# Low-code version (Appsmith)

Public app: https://app.appsmith.com/app/smart-campus-practice-13-low-code/page1-6b081c37f6c6480b7e2a987c

- Platform: Appsmith Cloud, free plan. One page, 9 widgets, 1 JS object, no datasource, no connector, no secrets.
- BookingLogic.js: the JS object, the same text as in the app (checked against the export).
  It holds the rules, because widget settings alone cannot check an overlap or return the reason codes in order.
- WIDGETS.md: every widget with its label, events and bindings, read from the export.
- export/smart-campus-practice-13-low-code.appsmith.json: Appsmith "Export application" file (77 918 bytes).
  Import: Appsmith -> workspace -> Create new -> Import -> choose this file.

Simulated or limited behaviour (also in the report):
- The current time is fixed at 09:00 and the booking list is fixed fictional data. No booking is saved.
- Start time is a text input (HH:MM) because the Input widget has no time type.
- On a 375 px screen the button label is cut to "Check a..." and the table scrolls sideways.
- Boundary cases were tested only in the code-based version and in the script self check, not one by one in this UI.
- Note: a public Appsmith app sends this script to every visitor. Never put a key or password in it.
