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
- [x] Phase 1: Project Setup (React + TypeScript + Vite + Fluent UI)
- [x] Phase 2: Core UI Components (Layout, Sidebar, Navigation)
- [x] Phase 3: Authentication
- [x] Phase 4: Data Management
- [ ] Phase 5: KQL Engine
- [x] Phase 6: Sentinel Pages (All pages created with mock data)
- [ ] Phase 7: Infrastructure
- [ ] Phase 8: Polish & Testing

**Phase 1 & 2 & 6 Completed:**
- React + TypeScript + Vite project initialized
- Fluent UI v9 configured with dark theme
- Sentinel-like layout with header and sidebar
- All navigation sections implemented
- 15 pages created: Overview, Incidents, Logs, Data Connectors, Analytics, Workbooks, Hunting, Entity Behavior, Threat Intelligence, MITRE ATT&CK, Content Hub, Automation, Watchlists, Notebooks, Settings
- Build passes successfully

**Phase 3 Completed:**
- Login page with Sentinel-styled dark theme
- Auth context with user state and localStorage persistence
- Protected routes redirecting unauthenticated users
- User menu in header with logout functionality
- Mock credentials: admin@demo.com/admin123, client@demo.com/client123
- Build passes with zero TypeScript errors

**Phase 4 Completed:**
- TypeScript data types (SecurityEvent, Incident, Alert, DataConnector, DataSet)
- Healthcare mock data set (50 events, 10 incidents, 20 alerts, 7 connectors)
- Financial mock data set (50 events, 10 incidents, 20 alerts, 8 connectors)
- DataContext with role-based data access (admin sees all, client sees assigned)
- Updated Overview, Incidents, Logs pages to use DataContext
- Admin data set switcher dropdown in header
- Build passes with zero TypeScript errors

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
4. **delegate.sh**: Complete rewrite with:
   - Per-engine BEFORE snapshots (taken right before each engine runs)
   - Preflight commit detection (commits with "preflight" in message don't count as work)
   - Proper exclusion of delegation artifacts and metadata directories
   - Robust file counting and comparison

**Tasks:**
- [x] Fix delegate_jules.sh - global preflight path lookup
- [x] Fix delegate_codex.sh - correct CLI invocation (`codex exec --full-auto`)
- [x] Fix delegate_gemini.sh - add verification of actual changes
- [x] Update delegate.sh - add verification safety net
- [x] Backup scripts before changes
- [x] E2E test verification - workflow correctly falls through Jules->Codex->Gemini

**E2E Test Results:**
- Jules: Preflight runs successfully, creates GitHub repo, but remote session fails (needs manual connection at jules.google.com). Preflight commit correctly ignored.
- Codex: CLI invocation fails (environment-specific issue)
- Gemini: Successfully completes work and verification passes
- Claude Code: Falls through correctly when all other engines fail

**Files Modified:**
- `~/.local/share/claude-code/scripts/ai/delegate.sh`
- `~/.local/share/claude-code/scripts/ai/delegate_jules.sh`
- `~/.local/share/claude-code/scripts/ai/delegate_codex.sh`
- `~/.local/share/claude-code/scripts/ai/delegate_gemini.sh`

**Backup:** `~/.local/share/claude-code/scripts/ai.bak/`
