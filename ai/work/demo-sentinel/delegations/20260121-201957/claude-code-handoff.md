# Claude Code Handoff

## Status

**Claude Code has been selected as the executor for this work item.**

All other delegation engines (Jules, Codex, Gemini) were unavailable or failed.
Claude Code MUST now implement this work directly.

## Requirements

1. **NO STUBS**: Every function/component must be fully implemented
2. **NO PLACEHOLDERS**: No TODO comments without implementation
3. **NO PARTIAL WIRING**: All integrations must be complete
4. **RUN VERIFICATION**: Execute tests/linters and record results

## Work Item

- **Slug**: test-jules-connected
- **Delegation Dir**: /home/lucas/code/demo-sentinel/ai/work/demo-sentinel/delegations/20260121-201957
- **Active Dir**: ai/work/demo-sentinel

## Brief

```
# Test Delegation Brief

## Task
Create a simple test file at `test-delegation.txt` with the content "Delegation test successful".

## Acceptance Criteria
- File `test-delegation.txt` exists in repo root
- File contains the text "Delegation test successful"

## Requirements
- No stubs or placeholders
- Actually create the file
```

## Plan

```
# Plan: Demo Sentinel Platform

PLAN_STATUS: APPROVED

## Goal

Build a demo platform that replicates the Microsoft Sentinel interface for MSSP sales demos where clients interact hands-on with a realistic Sentinel experience using pre-loaded data sets from CSV files.

## Non-Goals

- Real Azure integration (no actual Log Analytics workspace)
- Real playbook execution (visual only)
- Mobile-optimized UI (tablet passable is sufficient)
- Multi-language support

## Assumptions

- CSV data will be provided by the user in the expected format
- Azure subscription is available for deployment
- Basic familiarity with React/TypeScript for maintenance

## Architecture Impact

New standalone application with:
- React + TypeScript + Fluent UI frontend
- Azure Functions Node.js API
- Cosmos DB for data storage
- Blob Storage for CSV files

## Acceptance Criteria

- [ ] AC1: UI Fidelity - Side-by-side with real Sentinel, indistinguishable at first glance
- [ ] AC2: KQL Works - Run `SecurityEvent | where EventID == 4625 | summarize count() by Account | top 10 by count_` and get correct results
- [ ] AC3: Data Isolation - Client A cannot see Client B's data under any circumstance
- [ ] AC4: Full Navigation - All Sentinel sections accessible and populated with data
- [ ] AC5: Data Set Switching - Admin can assign different data sets to different clients
- [ ] AC6: Performance - Queries return in <2 seconds for 100k row tables
- [ ] AC7: Mobile Passable - Readable on tablet (not optimized, but functional)

## Task Breakdown

### Phase 1: Project Setup
- [ ] Initialize React + TypeScript project with Vite
- [ ] Set up Fluent UI v9
- [ ] Create basic app shell with Sentinel layout
- [ ] Set up Azure Functions project
- [ ] Configure local development environment

### Phase 2: Core UI Components
- [ ] Build navigation sidebar with all Sentinel sections
- [ ] Implement Azure portal header
- [ ] Create data grid component (Fluent UI DetailsList)
- [ ] Build detail panel component
- [ ] Implement Sentinel dark theme styling

### Phase 3: Authentication
- [ ] Create login page
- [ ] Implement JWT auth in Azure Functions
- [ ] Build admin panel for user management
- [ ] Implement role-based access (Admin vs Client)

### Phase 4: Data Management
- [ ] Design Cosmos DB schema
- [ ] Build CSV upload and processing pipeline
- [ ] Implement data set management (create, assign, delete)
- [ ] Create sample data sets for testing

### Phase 5: KQL Engine
- [ ] Build KQL parser (using PEG.js or Chevrotain)
- [ ] Implement core operators (where, project, summarize, etc.)
- [ ] Build query executor against in-memory data
- [ ] Add pre-canned queries feature
- [ ] Implement query history

### Phase 6: Sentinel Pages
- [ ] Overview dashboard with charts and tiles
- [ ] Incidents page with list and detail views
- [ ] Logs page with KQL editor (Monaco)
- [ ] Data Connectors page
- [ ] Analytics rules page
- [ ] Workbooks page (read-only templates)
- [ ] Hunting page
- [ ] Entity Behavior (UEBA) pages
- [ ] Threat Intelligence page
- [ ] Automation/Playbooks page (visual only)
- [ ] Content Hub page
- [ ] Settings page

### Phase 7: Infrastructure
- [ ] Create Bicep templates for Azure resources
- [ ] Set up GitHub Actions CI/CD
- [ ] Configure production deployment
- [ ] Set up Application Insights monitoring

### Phase 8: Polish & Testing
- [ ] Screenshot comparison with real Sentinel
- [ ] Performance testing with large data sets
- [ ] Security review (auth, data isolation)
- [ ] End-to-end testing

## Delegation Brief Requirements

Each delegation must:
- Produce working code with no stubs or placeholders
- Include unit tests where applicable
- Follow existing code patterns and conventions
- Run linter and fix any issues

## Verification Plan

- Visual comparison with real Sentinel screenshots
- KQL query execution tests
- Auth and data isolation penetration testing
- Performance benchmarks with 100k+ rows

## Rollback Plan

- Git-based rollback to previous working state
- Azure deployment slots for zero-downtime rollback

## Risks / Unknowns

- KQL parser complexity may require iterative development
- Sentinel UI may change, requiring updates
- Large CSV files may need chunked processing
```

## Instructions for Claude Code

1. Read the brief and plan carefully
2. Implement all required changes directly
3. Update the work item tasks.md as you complete items
4. Run verification commands:
   - `python3 -m py_compile` for Python files
   - `bash -n` for shell scripts
   - Stack-specific tests (pnpm test, pytest, etc.)
5. After completion, update:
   - `changed-files.txt` with list of modified files
   - `patch.diff` with the diff
   - `handoff-summary.md` with results and evidence

## Evidence Required

- List of all files changed
- Commands executed and their output
- Test/lint results
- Any issues discovered (add to ai/known-issues.md)

