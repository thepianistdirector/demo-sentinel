# Decision Log

---

## 2026-01-21: Fix Delegation Script Chain

**Context:** The `/delegate` command was failing to properly use Jules, Codex, and Gemini engines due to multiple issues discovered during investigation.

**Decision:** Implement verification-based success detection across all delegation scripts.

**Changes:**
1. Scripts now verify actual git changes occurred, not just exit codes
2. Jules preflight script lookup uses global path as primary, repo-local as fallback
3. Codex uses correct CLI syntax (`codex exec --full-auto`)
4. Gemini checks for tool execution errors in output before reporting success
5. Main orchestrator has verification safety net

**Tradeoffs:**
- (+) Eliminates false-positive success from engines that exit 0 without doing work
- (+) Jules preflight works regardless of whether script is copied to repo
- (+) Better logging for debugging delegation failures
- (-) Slightly more complex scripts
- (-) Verification may false-negative if engine writes to unexpected locations

**Alternatives Considered:**
- Require explicit success marker files from engines (rejected: too invasive)
- Parse engine output for success keywords (rejected: brittle)
- Use git hooks to detect changes (rejected: adds dependencies)

**Files:** `~/.local/share/claude-code/scripts/ai/delegate*.sh`

---

## 2026-01-21: Verification Refinements

**Context:** Initial verification implementation had false positives due to:
1. Delegation artifacts being counted as "work"
2. Jules preflight commits being counted as "work"
3. BEFORE snapshot being taken once instead of per-engine

**Decision:** Implement multi-layer verification with specific exclusions.

**Changes:**
1. BEFORE snapshot taken immediately before EACH engine runs
2. Preflight commits (message contains "preflight") explicitly excluded from work detection
3. Directories excluded from status comparison:
   - `ai/delegations/`
   - `ai/reviews/`
   - `ai/work/*/delegations/`
   - Current delegation directory
4. File count comparison instead of raw string comparison

**Tradeoffs:**
- (+) No more false positives from preflight commits or artifacts
- (+) Each engine evaluated independently against its own baseline
- (-) Slightly more complex verification logic
- (-) Preflight commits always ignored (can't use them as work indicator)

**Verification Criteria:**
- New non-preflight commit created
- More files in working tree (outside excluded dirs)
- Different files in status (actual new content)
