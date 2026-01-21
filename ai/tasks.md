# ai/tasks.md — Taskboard (Single Source of Truth)

ACTIVE_SLUG: demo-sentinel
ACTIVE_DIR: ai/work/demo-sentinel
ACTIVE_PLAN: ai/plans/20260121-1630-demo-sentinel.md
ACTIVE_BRANCH: main
ACTIVE_STATE: ACTIVE
ACTIVE_BLOCKED_REASON:
ACTIVE_UPDATED_AT: 2026-01-21

---

## How to use this file
- This file is authoritative for whether work may proceed.
- Maintain one ACTIVE work item at a time.
- Use checkboxes for deterministic progress tracking.

---

## Work Items

### demo-sentinel

**Goal:** Build a demo platform replicating Microsoft Sentinel interface for MSSP sales demos

**Plan:** ai/plans/20260121-1630-demo-sentinel.md

**Acceptance Criteria:**
- [ ] AC1: UI Fidelity - Side-by-side with real Sentinel, indistinguishable at first glance
- [ ] AC2: KQL Works - Full KQL engine with pre-canned queries
- [ ] AC3: Data Isolation - Client A cannot see Client B's data
- [ ] AC4: Full Navigation - All Sentinel sections accessible
- [ ] AC5: Data Set Switching - Admin can assign different data sets to clients
- [ ] AC6: Performance - Queries return in <2 seconds for 100k rows
- [ ] AC7: Mobile Passable - Readable on tablet

**Tasks:**
- [ ] Phase 1: Project Setup
- [ ] Phase 2: Core UI Components
- [ ] Phase 3: Authentication
- [ ] Phase 4: Data Management
- [ ] Phase 5: KQL Engine
- [ ] Phase 6: Sentinel Pages
- [ ] Phase 7: Infrastructure
- [ ] Phase 8: Polish & Testing

---

### delegation-investigation

**Goal:** Investigate why /delegate failed to use Jules and Codex, and document how Gemini CLI and Claude Code behaved

**Plan:** ai/plans/20260121-1959-delegation-investigation.md

**Status:** DONE (Investigation Complete)

**Findings Summary:**
- **Jules**: BLOCKED - repo not on GitHub, not connected to Jules service
- **Codex**: FAILED - script uses invalid `--prompt` flag; correct syntax is `codex exec "$PROMPT" --full-auto`
- **Gemini**: FALSE SUCCESS - exited 0 but tools were denied by policy, no actual work done
- **Claude Code**: NOT TRIED - Gemini's false success stopped the delegation chain

**Tasks:**
- [x] Investigate Jules failure (repo not on GitHub)
- [x] Investigate Codex failure (wrong CLI flags)
- [x] Investigate Gemini behavior (policy denials, exit 0)
- [x] Determine why Claude Code wasn't invoked (false positive from Gemini)
- [x] Document recommendations for fixing scripts

---

### fix-delegation-scripts

**Goal:** Implement permanent fixes for delegation scripts so Jules/Codex/Gemini/Claude chain works correctly

**Plan:** ai/plans/20260121-2003-fix-delegation-scripts.md

**Status:** DONE

**Changes Made:**
1. **delegate_jules.sh**: Now looks for preflight script at global path (`$HOME/.local/share/claude-code/scripts/ai/`) first, then repo-local
2. **delegate_codex.sh**: Complete rewrite with correct CLI syntax (`codex exec --full-auto`), proper logging, and verification
3. **delegate_gemini.sh**: Complete rewrite with verification - detects false success by checking git changes and error patterns
4. **delegate.sh**: Added pre/post git state tracking and verification function as safety net

**Tasks:**
- [x] Fix delegate_jules.sh - global preflight path lookup
- [x] Fix delegate_codex.sh - correct CLI invocation (`codex exec --full-auto`)
- [x] Fix delegate_gemini.sh - add verification of actual changes
- [x] Update delegate.sh - add verification safety net
- [x] Backup scripts before changes

**Files Modified:**
- `~/.local/share/claude-code/scripts/ai/delegate.sh`
- `~/.local/share/claude-code/scripts/ai/delegate_jules.sh`
- `~/.local/share/claude-code/scripts/ai/delegate_codex.sh`
- `~/.local/share/claude-code/scripts/ai/delegate_gemini.sh`

**Backup:** `~/.local/share/claude-code/scripts/ai.bak/`
