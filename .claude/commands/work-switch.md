---
description: "Switch to a different work item. Usage: /work-switch <slug>"
allowed-tools: ["Read", "Edit", "Write", "Glob"]
---
You are executing /work-switch with argument: $ARGUMENTS

## Purpose

Switch the active work item to a different one. This updates `ai/tasks.md` to point to the new work item and marks the previous one as BLOCKED.

## Steps

### 1. Parse the target slug

The target slug is provided as $ARGUMENTS. If empty, show available work items and ask user to specify.

### 2. Verify target exists

Check if `ai/work/<slug>/` exists:
- If it exists, proceed with switch
- If it doesn't exist, ask if user wants to create a new work item with that slug

### 3. Read current active state

Read `ai/tasks.md` and note:
- Current ACTIVE_SLUG
- Current ACTIVE_DIR
- Current ACTIVE_STATE

### 4. Update previous work item (if any)

If there was a previous active work item that is still ACTIVE:
1. Set its state to BLOCKED in `ai/tasks.md`
2. Add blocked reason: "switched to <new_slug>"

### 5. Update ai/tasks.md pointers

Update the header fields:
```
ACTIVE_SLUG: <new_slug>
ACTIVE_DIR: ai/work/<new_slug>
ACTIVE_PLAN: ai/work/<new_slug>/plan.md
ACTIVE_STATE: ACTIVE
ACTIVE_BLOCKED_REASON:
ACTIVE_UPDATED_AT: <today>
```

### 6. Confirm switch

Print confirmation:
- Previous work item: <old_slug> (now BLOCKED)
- Active work item: <new_slug>
- Tasks file: ai/work/<new_slug>/tasks.md

## Creating a new work item

If the target slug doesn't exist, offer to create it:

1. Create directory: `ai/work/<slug>/`
2. Create `ai/work/<slug>/plan.md` with PLAN_STATUS: DRAFT
3. Create `ai/work/<slug>/tasks.md` with empty task list
4. Create `ai/work/<slug>/delegations/` and `ai/work/<slug>/reviews/`
5. Update `ai/tasks.md` to point to new work item
6. Add entry in Work Items section of `ai/tasks.md`

## Example

```
/work-switch my-feature
```

Result:
- Switches active work item to "my-feature"
- If "my-feature" doesn't exist, creates it
- Previous work item marked BLOCKED
