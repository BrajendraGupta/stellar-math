# /validate-questions

Scan all question files in Stellar Math for schema violations, logic errors, and content issues. Optionally auto-fix safe problems.

## Arguments
`$ARGUMENTS` is optional. If a grade number is provided (e.g. `3`), only validate that grade. If empty, validate all grades.

---

### Step 1 — Discover question files

Read `src/data/questions/index.js` to find all imported grade files.
If `$ARGUMENTS` specifies a grade, only process `src/data/questions/grade${grade}.js`.
Otherwise read all `src/data/questions/grade*.js` files.

Also read `src/data/schema.js` for `TOPICS` and `TOPIC_DISPLAY` to cross-check.

---

### Step 2 — Validate every question object

For each question in every exported array, run all checks below.
Track results as ❌ ERROR (must fix), ⚠️ WARN (should fix), or ✅ OK.

#### Schema checks
1. **id** — must be a string, non-empty, and **unique** across the entire file. ❌ if duplicate or missing.
2. **grade** — must be a number 1–10 matching the file's grade. ❌ if wrong or missing.
3. **topic** — must be a string present in `TOPICS[grade]` in schema.js. ❌ if not.
4. **difficulty** — must be exactly `1`, `2`, or `3`. ❌ if anything else.
5. **type** — must be `'mc'` or `'numeric'`. ❌ if anything else.
6. **display_mode** — must be `'text'`, `'equation'`, or `'visual'`. ❌ if anything else.

#### Multiple-choice checks (type === 'mc')
7. **options** — must be an array of exactly 4 strings. ❌ if null, wrong length, or non-strings.
8. **correct_answer in options** — `options` must contain a string that exactly equals `correct_answer`. ❌ if not found. Show the mismatch.
9. **no duplicate options** — all 4 option strings must be distinct. ⚠️ if duplicates exist.

#### Numeric checks (type === 'numeric')
10. **options must be null** — ❌ if options is not null.
11. **correct_answer is a number string** — ⚠️ if it contains non-numeric characters (might be intentional for fractions like "1/4").

#### Hint logic checks
12. **hint_logic.default** — required on every question. ❌ if missing or empty string.
13. **common_errors keys match option values** — if `hint_logic.common_errors` exists, every key must be a string that appears in `options`. ⚠️ if a key doesn't match any option (dead hint).

#### Manipulative checks
14. **grade constraint** — `manipulative: 'star-cubes'` only allowed for grade ≤ 3. ❌ if used in grade 4+.
15. **config required** — if `manipulative` is set, `manipulative_config` must be present with `groups` and `perGroup` both positive integers. ❌ if missing.
16. **star count limit** — `groups × perGroup` must be ≤ 30. ❌ if over limit (too many to display).
17. **orphan config** — if `manipulative_config` is set but `manipulative` is not, it's dead config. ⚠️ warn.

#### Content checks
18. **space theme** — `question_text` should reference space concepts (rocket, planet, alien, mission, crew, orbit, galaxy, warp, etc.). ⚠️ if no space word detected.
19. **question_text length** — ⚠️ if under 10 characters or over 300 characters.
20. **ID format** — should follow `g{grade}-{topicCode}-{NNN}` convention. ⚠️ if it doesn't.

#### Cross-file checks
21. **IDs unique across all grades** — ❌ if the same ID appears in two different grade files.
22. **Registered in index** — every topic in a grade file should be registered in `QUESTION_BANK` in `index.js`. ⚠️ if a topic array has questions but isn't registered.

---

### Step 3 — Auto-fix safe ERRORs

Safe auto-fixes (apply without asking):
- Trim whitespace from `question_text`, `correct_answer`, and option strings
- Fix `correct_answer` capitalisation if it clearly matches an option case-insensitively

Unsafe fixes (ask before applying):
- Correcting `correct_answer` when the mismatch is ambiguous
- Removing questions with unfixable schema violations

---

### Step 4 — Report

Print a summary table:

```
Validation Report — Grade ${grade || 'All'}
══════════════════════════════════════════
Total questions scanned:   N
  ❌ Errors (must fix):    N
  ⚠️  Warnings:            N
  ✅ Passing:              N

Files with issues:
  grade3.js   — 2 errors, 1 warning
  grade4.js   — 0 errors, 3 warnings
```

Then list every ❌ ERROR with:
- File, question ID, field name, what was found, what was expected

Then list every ⚠️ WARN with:
- File, question ID, field name, recommendation

End with: "Run `/add-questions <grade> <topic>` to add or fix questions for a specific topic."
