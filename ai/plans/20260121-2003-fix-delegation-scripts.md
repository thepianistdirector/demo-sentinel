# Plan: Fix Delegation Scripts

**PLAN_STATUS: APPROVED**

**Slug**: fix-delegation-scripts
**Created**: 2026-01-21

---

## Goal

Implement permanent fixes for all delegation scripts to ensure the delegation chain (Jules -> Codex -> Gemini -> Claude Code) works correctly. Fixes must not reduce functionality.

## Non-Goals

- Changing the delegation order
- Adding new engines
- Modifying authentication flows

---

## Root Causes (from investigation)

1. **Jules**: Preflight script path is hardcoded to repo-local, but script exists at global path
2. **Codex**: Uses invalid `--prompt` flag instead of correct positional argument syntax
3. **Gemini**: Exits 0 even when work fails, no verification of actual changes
4. **Orchestrator**: Relies only on exit codes, no verification that work was actually done

---

## Acceptance Criteria

- [ ] AC1: Jules delegation finds and runs preflight script from global path
- [ ] AC2: Codex delegation uses correct CLI syntax (`codex exec "$PROMPT"`)
- [ ] AC3: Gemini delegation verifies actual changes were made before reporting success
- [ ] AC4: All scripts verify git status/changes after engine runs
- [ ] AC5: No functionality is removed from existing scripts
- [ ] AC6: Scripts remain portable (work on any repo)

---

## Implementation

### Fix 1: delegate_jules.sh

**Change**: Look for preflight script at both global and repo-local paths.

```bash
# Check global path first, then repo-local
GLOBAL_SCRIPTS="${GLOBAL_SCRIPTS:-$HOME/.local/share/claude-code/scripts/ai}"
if [[ -f "$GLOBAL_SCRIPTS/jules_preflight_github.py" ]]; then
  PREFLIGHT_SCRIPT="$GLOBAL_SCRIPTS/jules_preflight_github.py"
elif [[ -f "$ROOT/scripts/ai/jules_preflight_github.py" ]]; then
  PREFLIGHT_SCRIPT="$ROOT/scripts/ai/jules_preflight_github.py"
else
  log "GitHub preflight script not found at global or repo path"
fi
```

### Fix 2: delegate_codex.sh

**Change**: Use correct Codex CLI syntax based on actual help output.

From codex help:
- `codex [PROMPT]` - positional argument
- `codex exec [PROMPT]` - non-interactive mode
- `--full-auto` for automated execution
- `--dangerously-bypass-approvals-and-sandbox` for full automation

```bash
# Correct invocations
CANDIDATES=(
  "codex exec \"\$PROMPT\" --full-auto -C \"$ROOT\""
  "codex \"\$PROMPT\" --full-auto -C \"$ROOT\""
)
```

### Fix 3: delegate_gemini.sh

**Change**: Add verification that actual changes were made after Gemini runs.

```bash
# After gemini run, verify changes
CHANGES=$(git status --porcelain 2>/dev/null)
if [[ -z "$CHANGES" ]]; then
  log "Gemini completed but no changes detected - marking as failed"
  exit 1
fi
```

### Fix 4: All scripts - Add verification function

**Change**: Add a common verification pattern to all engine scripts.

```bash
verify_work_done() {
  local changes=$(git status --porcelain 2>/dev/null)
  if [[ -n "$changes" ]]; then
    return 0  # Changes detected
  fi
  # Also check if any new files in delegation dir
  local new_files=$(find "$DELEG_DIR" -newer "$DELEG_DIR/brief.md" -type f 2>/dev/null | wc -l)
  if [[ "$new_files" -gt 2 ]]; then
    return 0  # New delegation artifacts created
  fi
  return 1  # No work detected
}
```

---

## Tasks

- [x] Fix delegate_jules.sh - global preflight path lookup
- [x] Fix delegate_codex.sh - correct CLI invocation
- [x] Fix delegate_gemini.sh - add verification
- [x] Add verification to delegate.sh orchestrator
- [x] Backup scripts before changes
- [x] Document changes in ai/decisions.md

---

## Rollback Plan

Scripts are stored at `~/.local/share/claude-code/scripts/ai/`.
Backup before changes: `cp -r ~/.local/share/claude-code/scripts/ai ~/.local/share/claude-code/scripts/ai.bak`
Restore if needed: `cp -r ~/.local/share/claude-code/scripts/ai.bak ~/.local/share/claude-code/scripts/ai`

---

## Risks

- Codex `--full-auto` may still require some interactive approval
- Gemini verification might false-negative if it writes to different locations
- Jules preflight requires GITHUB_TOKEN to be set

---

## Verification Plan

After implementation:
1. Run `/delegate` on current repo
2. Verify Jules preflight runs (or fails gracefully if no token)
3. Verify Codex uses correct syntax in logs
4. Verify Gemini verification catches no-op runs
5. Check `selected-engine.txt` shows correct engine selection
