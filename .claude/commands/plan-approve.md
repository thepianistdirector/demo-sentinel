---
description: "Approve the current ACTIVE plan by setting PLAN_STATUS: APPROVED."
---
You are executing /plan-approve.

This command APPROVES the current active plan AND automatically triggers delegation.
Claude Code orchestrates; substantial implementation is always delegated (Jules -> Codex -> Gemini).

## Procedure

### 1) Validate prerequisites
- Read ai/tasks.md and find ACTIVE_SLUG and ACTIVE_PLAN.
- If ACTIVE_SLUG is "none" or empty, STOP and tell user to create a plan first.
- Read the plan file at ACTIVE_PLAN.
- If plan file doesn't exist, STOP and tell user to create it.

### 2) Approve the plan (if not already)
- If plan file does NOT contain `PLAN_STATUS: APPROVED`:
  - Add or update `PLAN_STATUS: APPROVED` at the end of the plan file.
  - Update ai/tasks.md: tick any approval-related checkboxes.

### 3) Create delegation brief (if not exists)
- Check if a delegation folder exists at ai/delegations/*-<ACTIVE_SLUG>/.
- If no delegation folder exists OR no brief.md in it:
  - Create new folder: ai/delegations/<YYYYMMDD-HHMM>-<ACTIVE_SLUG>/
  - Create brief.md inside it with:
    - Repo meta (root, origin, branch)
    - Extracted tasks from the plan file (or from ai/tasks.md work item section)
    - Acceptance criteria from the plan
    - Guardrails: "No stubs. No placeholders. Tests required."
    - Required outputs: changed files list, commands executed, patch.diff

### 4) Trigger /delegate
- Run the /delegate command to delegate implementation to external engines.
- This runs: scripts/ai/delegate.sh "<slug>" "<brief_path>"

### 5) Finish (orchestration only)
- After delegation completes, inspect the handoff-summary.md
- Update ai/tasks.md with any progress made by the delegate
- DO NOT implement product features yourself. All product code changes come from delegation.

## Output
- Confirm plan approval status
- Confirm delegation brief path
- Report delegation result (success/failure)
- If engines are missing or fail, record in ai/known-issues.md and inform user
