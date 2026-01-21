# Plan: Delegation Investigation - Why Jules/Codex Failed

**PLAN_STATUS: APPROVED**

**Slug**: delegation-investigation
**Created**: 2026-01-21

---

## Goal

Investigate and document why the `/delegate` command failed to use Jules and Codex engines in the `demo-sentinel` work item, understand how Gemini CLI and Claude Code behaved, and provide actionable recommendations for fixing the delegation workflow.

## Non-Goals

- Actually fixing the delegation scripts (separate work item)
- Modifying engine configurations
- Setting up GitHub/API credentials

---

## Investigation Findings

### Engine 1: Jules CLI - FAILED

**Root Cause**: Repository not connected to Jules via GitHub

**Evidence from logs**:
```
# jules-remote-new.log:
Error: the repo unknown/unknown either doesn't exist on GitHub or is not connected to Jules, please make sure to follow https://jules.google/docs

# jules-blocked.txt:
BLOCKED: Jules cannot access repo - not authorized or not connected

# jules.stderr.log:
[jules] GitHub preflight script not found, skipping
[jules] Starting Jules remote session...
[jules] Trying: echo prompt | jules remote new --repo .
[jules] Jules authorization/connection error detected
```

**Analysis**:
1. The repo is local only - no GitHub remote configured (`ORIGIN=` in repo-meta.txt)
2. Jules requires the repo to be pushed to GitHub AND connected to Jules service
3. The GitHub preflight script (`jules_preflight_github.py`) was not found
4. Jules detected `unknown/unknown` as the repo identifier, indicating no valid GitHub remote

**Fix Required**:
- Push repo to GitHub
- Connect repo to Jules at https://jules.google/docs
- Ensure `jules_preflight_github.py` exists in `scripts/ai/` or handle its absence gracefully

---

### Engine 2: Codex CLI - FAILED

**Root Cause**: Incorrect CLI invocation syntax

**Evidence from logs**:
```
# codex.attempt.log:
>> Trying: codex --prompt "$PROMPT"
error: unexpected argument '--prompt' found

  tip: to pass '--prompt' as a value, use '-- --prompt'

Usage: codex [OPTIONS] [PROMPT]
       codex [OPTIONS] <COMMAND> [ARGS]
```

**Analysis**:
1. The delegation script tries multiple invocation patterns:
   - `printf '%s\n' "$PROMPT" | codex` - should work (stdin)
   - `codex -p "$PROMPT"` - invalid flag
   - `codex run -p "$PROMPT"` - no `run` subcommand
   - `codex exec -p "$PROMPT"` - `exec` exists but `-p` is wrong
   - `codex --prompt "$PROMPT"` - invalid flag (only logged this one)

2. From `codex-help.txt`, the correct syntax is:
   - `codex [PROMPT]` - prompt as positional argument
   - `codex exec [PROMPT]` - for non-interactive execution
   - Use `--full-auto` or `--dangerously-bypass-approvals-and-sandbox` for automation

3. The script only logged ONE attempt but tries multiple - likely the first (stdin pipe) failed silently

**Fix Required**:
- Change to: `codex exec "$PROMPT" --full-auto` or `codex exec "$PROMPT" --dangerously-bypass-approvals-and-sandbox`
- Or: `codex "$PROMPT"` as positional argument (but needs interactive handling)
- Log ALL attempts, not just one

---

### Engine 3: Gemini CLI - PARTIAL/FAILED

**Root Cause**: Extension errors and tool policy denials

**Evidence from logs**:
```
# gemini.attempt.log:
>> Trying: printf '%s\n' "$PROMPT" | gemini
[ERROR] [ImportProcessor] Failed to import ts-ignore`: ENOENT: no such file or directory...
[ERROR] [ImportProcessor] Failed to import ts-nocheck`: ...
[ERROR] [ImportProcessor] Failed to import ts-expect-error`: ...

Loaded cached credentials.
... (extension loading)

Error executing tool read_file: File not found: /home/lucas/code/demo-sentinel/docs/plans/2026-01-21-demo-sentinel-design.md
Error executing tool run_shell_command: Tool "run_shell_command" not found in registry...
Error executing tool delegate_to_agent: Tool execution denied by policy.
Error executing tool read_multiple_files: Tool execution denied by policy.
Error executing tool create_directory: Tool execution denied by policy.
```

**Analysis**:
1. Gemini CLI started successfully and loaded credentials
2. Many MCP extensions loaded (context7, exa, jules integration, etc.)
3. The ImportProcessor errors are from a malformed `chrome-devtools-mcp` extension
4. Gemini tried to work but encountered:
   - File path errors (design doc in wrong location)
   - Tool registry mismatches (`run_shell_command` not available)
   - Policy denials for file/agent operations

5. This indicates Gemini CLI **did run** but couldn't complete the task due to:
   - Restrictive default policies
   - Misconfigured extensions
   - Brief referenced non-existent files

**Fix Required**:
- Fix or remove broken `chrome-devtools-mcp` extension
- Configure Gemini with appropriate tool permissions
- Ensure brief doesn't reference non-existent paths
- May need `--sandbox` or policy flags for automation

---

### Engine 4: Claude Code - NOT REACHED

**Evidence**: No `claude_code*.log` files exist

**Analysis**:
The delegate script runs engines in order until one succeeds. Since Gemini exits 0 on startup (even if work fails internally), the script thought Gemini "succeeded" and didn't fall through to Claude Code.

Looking at `delegate_gemini.sh`:
```bash
for c in "${CANDIDATES[@]}"; do
  bash -lc "PROMPT=\$(cat \"$BRIEF\"); $c" >> "$DELEG_DIR/gemini.attempt.log" 2>&1
  code=$?
  if [[ $code -eq 0 ]]; then
    exit 0  # <-- Exits on first "success"
  fi
done
exit 1
```

The `printf '%s\n' "$PROMPT" | gemini` command likely exited 0 even though the work wasn't completed, because:
- Gemini CLI may exit 0 after running (regardless of task completion)
- The script doesn't verify actual work was done

**Fix Required**:
- Add verification step after each engine: check if files were actually modified
- Don't rely solely on exit codes - verify git status or changed files
- Add explicit success markers that engines must produce

---

## Summary Table

| Engine | Status | Root Cause | Quick Fix |
|--------|--------|------------|-----------|
| Jules | BLOCKED | No GitHub remote, not connected to Jules | Push to GitHub, connect to Jules |
| Codex | FAILED | Wrong CLI flags (`--prompt` invalid) | Use `codex exec "$PROMPT" --full-auto` |
| Gemini | FALSE SUCCESS | Exited 0 but tools denied, files missing | Add verification, fix policies |
| Claude Code | NOT TRIED | Gemini false-positive stopped chain | Fix Gemini exit detection |

---

## Acceptance Criteria

- [x] AC1: Document why Jules failed with evidence from logs
- [x] AC2: Document why Codex failed with evidence from logs
- [x] AC3: Document how Gemini CLI behaved with evidence
- [x] AC4: Document why Claude Code was not invoked
- [x] AC5: Provide actionable fix recommendations for each engine

---

## Recommendations

### Immediate Fixes

1. **Codex script** (`delegate_codex.sh`):
   ```bash
   # Replace candidates with:
   codex exec "$PROMPT" --full-auto -C "$ROOT"
   # Or for more permissive:
   codex exec "$PROMPT" --dangerously-bypass-approvals-and-sandbox -C "$ROOT"
   ```

2. **Gemini script** (`delegate_gemini.sh`):
   ```bash
   # Add after gemini run:
   CHANGES=$(git status --porcelain 2>/dev/null)
   if [[ -z "$CHANGES" ]]; then
     echo "No changes detected - marking as failed"
     exit 1
   fi
   ```

3. **Jules requirements**:
   - Push repo to GitHub
   - Connect at https://jules.google/docs
   - Create preflight script or document it's optional

### Structural Improvements

1. All engine scripts should verify work was done (not just exit code)
2. Log all invocation attempts, not just successful/last one
3. Add explicit success markers (e.g., `$DELEG_DIR/work-completed.marker`)
4. Consider timeouts for interactive CLI tools

---

## Tasks

- [x] Investigate Jules failure
- [x] Investigate Codex failure
- [x] Investigate Gemini behavior
- [x] Determine why Claude Code wasn't tried
- [x] Document recommendations

---

## Rollback Plan

N/A - This is an investigation work item with no code changes.

## Risks

- None for investigation phase
- Script fixes should be tested in isolation before deploying
