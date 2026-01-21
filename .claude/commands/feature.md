---
description: "Start a new work item: plan → tasks → delegate → integrate → verify → docs → done."
---
You are executing /feature.

Follow the repo workflow exactly:
1) Create a plan file under ai/plans/YYYYMMDD-HHMM-<slug>.md with PLAN_STATUS: DRAFT and explicit Acceptance Criteria.
2) Update ai/tasks.md:
   - set ACTIVE_SLUG, ACTIVE_PLAN, ACTIVE_STATE=ACTIVE, ACTIVE_UPDATED_AT
   - add a WORK ITEM section with AC checkboxes and granular tasks
3) Approve the plan only after it is coherent: set PLAN_STATUS: APPROVED.
4) Create ai/delegations/<timestamp>-<slug>/brief.md with tasks + ACs and "no stubs, run tests" requirements.
5) Run /delegate.
6) Integrate changes, then run scripts/ai/verify.sh and write ai/reviews/<timestamp>-<slug>.md with evidence.
7) Update docs + ai/known-issues.md + ai/decisions.md as needed.
8) Keep working until DONE or explicitly BLOCKED in ai/tasks.md.
