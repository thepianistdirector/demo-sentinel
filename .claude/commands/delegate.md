---
description: "Delegate implementation to external engines (Jules -> Codex -> Gemini -> Claude Code) using scripts/ai/delegate.sh."
---
You are executing /delegate.

## Step 1: Identify Active Work Item

Read ai/tasks.md and identify:
- ACTIVE_SLUG
- ACTIVE_DIR (if using new work item structure)
- ACTIVE_PLAN

## Step 2: Prepare Delegation Brief

Determine the brief location:
- If ACTIVE_DIR exists: `<ACTIVE_DIR>/delegations/<timestamp>/brief.md`
- Otherwise: `ai/delegations/<timestamp>-<slug>/brief.md`

If the brief doesn't exist, create it with:
- Summary of the work item goals
- Specific acceptance criteria
- Files to modify
- Verification commands

## Step 3: Run Delegation Script

Execute:
```bash
scripts/ai/delegate.sh "<slug>" "<brief_path>"
```

Engine order: Jules -> Codex -> Gemini -> Claude Code

## Step 4: Handle Results

### If an external engine (Jules/Codex/Gemini) succeeded:
1. Inspect git diff
2. Update work item tasks.md progress checkboxes
3. Run `scripts/ai/verify.sh` and capture evidence in reviews/

### If Claude Code was selected (4th fallback):

**IMPORTANT**: When Claude Code is selected, you MUST immediately implement the work.

1. Read the handoff file: `<delegation_dir>/claude-code-handoff.md`
2. Implement all required changes directly (NO STUBS)
3. After implementation, update:
   - `<delegation_dir>/changed-files.txt` with actual changed files
   - `<delegation_dir>/patch.diff` with `git diff`
   - `<delegation_dir>/handoff-summary.md` with evidence
4. Update work item tasks.md with completed items
5. Run verification commands and record results
6. Create review report with evidence

## Detection of Claude Code Selection

After running delegate.sh, check if Claude Code was selected:
```bash
cat <delegation_dir>/selected-engine.txt
```

If it shows "claude_code", proceed immediately to implement the handoff.
