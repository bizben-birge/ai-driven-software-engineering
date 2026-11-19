# Evidence index

- 01-04: baseline, 38 original tests and static/build checks.
- 05: initial candidate, before focused review fixes.
- 09: two failing reproductions before the R1/R2 repairs.
- 14-17: earlier verified version, 115 tests, before the final one-room correction.
- 18-21: final one-room version, 116 tests, typecheck, lint and build.
- observed_cases.json: 17 expected/observed cases and measured mock latency; prompt designs share the same mock reference output.
- browser_qa_v2.json and screenshots: final published desktop checks and local mobile timeout.
- independent_review.txt: original read-only review. Historical line numbers identify that reviewed revision, not the later layout.
- one_room_review.txt: final independent compliance check.
- candidate_diff.txt and project_diff.txt: changes relative to the original baseline.
- preservation.json: six protected baseline files are unchanged.
- source_sha256.json: all 37 published source/configuration files match this repository copy byte for byte.

Reports and evidence contain fictional classroom data. No external model was called; mock results do not benchmark model quality.
