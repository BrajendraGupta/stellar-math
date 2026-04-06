# /check-db

Audit all Dexie.js database code in Stellar Math for known error patterns that cause silent failures.

## Instructions

No arguments needed. Run a full audit of `src/db/index.js` and `src/store/index.js`.

---

### Step 1 — Read the files

Read both files completely:
- `src/db/index.js`
- `src/store/index.js`

Also read `src/data/schema.js` for the DB table definitions (to cross-check index names).

#### Expected tables in the current schema (version 3)

The Dexie database is at version 3. All of these tables must be declared:
- `profiles` — `++id, name`
- `sessions` — `++id, studentId, date`
- `answers` — `++id, sessionId, studentId, topic, grade, isCorrect, timestamp`
- `masteryScores` — `[studentId+grade+topic], studentId, grade`
- `earnedBadges` — `[studentId+badgeId], studentId`
- `dailyActivity` — `[studentId+date], studentId, date`
- `streakState` — `studentId`
- `masteryHistory` — `++id, [studentId+grade+topic], studentId, timestamp`
- `portalPins` — `studentId`

If a version upgrade is needed (new tables added), check that ALL prior tables are re-listed in the newer version call — missing a table in a new version causes Dexie to silently drop it.

---

### Step 2 — Run all checks

Check for every pattern below and report each finding as ✅ PASS or ❌ FAIL with the exact line number and a one-line explanation.

#### A. Primary key queries (most common Dexie mistake)
- **FAIL** if any table uses `.where('id').equals(...)` — primary keys (`++id`) are not queryable with `.where()`. Must use `table.get(id)` or `table.update(id, changes)` instead.
- **FAIL** if `.modify()` is called on a result of `.where('id').equals(...)`.

#### B. Compound index usage
- For every `.where('[field1+field2]')` or `.where('[field1+field2+field3]')` call, verify the compound index is declared in `db.version().stores()` for that table.
- **FAIL** if a compound index query is made on a table that does not have that index in its schema string.

#### C. Missing try/catch in store async actions
- Every `async` function in `src/store/index.js` that calls a `db.*` operation should have a `try/catch`.
- **WARN** (not fail) for any async store action without error handling that reaches a `set(...)` call for UI state.

#### D. Unhandled promise rejections
- Check that every `await` call in store actions is either inside a `try/catch` or is the last operation before a `set()` that won't be reached if the await throws.
- **WARN** for any `await` after the last `set()` call (state may update but DB operation silently fails).

#### E. Stale reads after writes
- **WARN** if a function reads a record, modifies it in memory, then writes it back without using a transaction — another concurrent write could be lost.

#### F. Missing indexes for query patterns
- For every `.where('fieldName').equals(...)` call, verify `fieldName` is declared as an index in that table's schema string.
- **FAIL** if querying a field that is not indexed (causes a full table scan or Dexie error).

#### G. Version consistency
- Verify `db.version(N).stores({...})` — if there are multiple version calls, check that the latest version includes **all** tables from the Expected Tables list above.
- **FAIL** if any expected table is missing from the latest version's stores declaration.
- **WARN** if older version calls are absent (needed for users upgrading from old versions).

#### H. PIN security (portalPins table)
- The `setPortalPin` function should hash with `crypto.subtle.digest('SHA-256', ...)` before storing. **WARN** if a PIN is stored as plain text.
- `verifyPortalPin` should compare hashes, not raw values.

#### I. Streak / daily activity consistency
- `upsertDailyActivity` should use `.put()` or a transaction to avoid lost updates if called concurrently.
- **WARN** if `checkAndUpdateStreak` reads `streakState` and writes it back without a transaction.

---

### Step 3 — Fix all FAILs automatically

For each ❌ FAIL finding, apply the fix directly to the file. Show a diff-style before/after for each fix.

Do not auto-fix WARNs — list them for the user to decide.

---

### Step 4 — Report summary

```
DB Audit Report
═══════════════
Checks run:    N
FAILs found:   N  (all fixed)
WARNs found:   N  (listed below)
Files modified: [list]
```

List all WARNs with file, line, and recommended action.
