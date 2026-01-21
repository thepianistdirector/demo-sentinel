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

- **Slug**: demo-sentinel
- **Delegation Dir**: /home/lucas/code/demo-sentinel/ai/work/demo-sentinel/delegations/20260121-203439
- **Active Dir**: ai/work/demo-sentinel

## Brief

```
# Delegation Brief: Phase 4 - Data Management

## Summary

Implement the data management layer for the Demo Sentinel platform, including CSV data loading, data storage structure, and data set management.

## Context

The frontend exists at `frontend/` with React + TypeScript + Fluent UI v9.
Authentication is implemented (Phase 3). Now we need to handle data.

For Phase 4, we focus on **frontend-only** mock data management since:
- The Azure Functions backend is not yet built (Phase 7)
- We need to demonstrate data isolation concepts in the UI

## Tasks

### 1. Create Data Types (`frontend/src/types/data.ts`)
Define TypeScript interfaces for:
- SecurityEvent (log entries)
- Incident (security incidents)
- Alert (security alerts)
- DataConnector (connector config)
- DataSet (collection of data for a client)

### 2. Create Mock Data Sets (`frontend/src/data/`)
Create mock data files:
- `frontend/src/data/healthcare.ts` - Healthcare industry sample data
- `frontend/src/data/financial.ts` - Financial industry sample data
- `frontend/src/data/index.ts` - Export all data sets

Each data set should include:
- ~50 SecurityEvent records
- ~10 Incident records
- ~20 Alert records
- Realistic timestamps (last 30 days)
- Industry-appropriate event types

### 3. Create Data Context (`frontend/src/contexts/DataContext.tsx`)
React context for:
- Current data set selection
- Loading data based on user's dataSetId
- Switching data sets (admin only)
- Providing data to components

### 4. Update Pages to Use Real Data
Modify these pages to consume data from DataContext instead of inline mock data:
- Overview.tsx (use incident/alert counts)
- Incidents.tsx (use incident data)
- Logs.tsx (use security events)

### 5. Create Admin Data Set Switcher
- Add data set selector dropdown for admin users
- Allow admins to preview different client data sets
- Store selection in context

## Acceptance Criteria

- [ ] Data types are properly typed with TypeScript
- [ ] At least 2 mock data sets exist with realistic data
- [ ] DataContext provides data to components
- [ ] Overview, Incidents, and Logs pages use context data
- [ ] Admin users can switch between data sets
- [ ] Non-admin users only see their assigned data set
- [ ] Build passes with no TypeScript errors

## Technical Requirements

- Use React Context API (consistent with auth implementation)
- Match existing code style and patterns
- No external data libraries needed
- All data is mock/hardcoded (backend comes later)

## Files to Create/Modify

- CREATE: `frontend/src/types/data.ts`
- CREATE: `frontend/src/data/healthcare.ts`
- CREATE: `frontend/src/data/financial.ts`
- CREATE: `frontend/src/data/index.ts`
- CREATE: `frontend/src/contexts/DataContext.tsx`
- MODIFY: `frontend/src/pages/Overview.tsx`
- MODIFY: `frontend/src/pages/Incidents.tsx`
- MODIFY: `frontend/src/pages/Logs.tsx`
- MODIFY: `frontend/src/main.tsx` (wrap with DataProvider)
- MODIFY: `frontend/src/components/Layout.tsx` (add data set switcher for admin)

## Verification

```bash
cd frontend && npm run build
```

Build must pass with zero errors.
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

