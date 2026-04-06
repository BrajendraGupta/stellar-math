# /add-grade

Scaffold a complete new grade for Stellar Math — question file, galaxy definition, topic list, and question index registration.

## Arguments
`$ARGUMENTS` contains the grade number, e.g. `4` or `5`.

## Instructions

Parse `$ARGUMENTS` to extract `grade` (number 1–10). If missing or out of range, ask the user before proceeding.

---

### Step 1 — Check what already exists

Read these files:
- `src/data/schema.js` — check if `GRADE_GALAXIES[${grade}]` and `TOPICS[${grade}]` already exist
- `src/data/questions/index.js` — check if grade is already registered in `QUESTION_BANK`
- `src/data/questions/grade${grade}.js` — check if the file already exists

Also check the reasoning bank for this grade's range:
- Grade 1–2: `src/data/questions/reasoning-k2.js`
- Grade 3–5: `src/data/questions/reasoning-35.js`
- Grade 6–8: `src/data/questions/reasoning-68.js`
- Grade 9–10: `src/data/questions/reasoning-910.js`

If the grade is already fully set up, report that and stop. If partially set up, report what's missing and only add what's absent.

---

### Step 2 — Confirm the galaxy and topics

Show the user the planned galaxy name and topics from `GRADE_GALAXIES` and `TOPICS` in `schema.js`.

**Important:** Every grade automatically includes `'reasoning'` as a topic. This topic is powered by the shared reasoning bank files (not the grade file), so you do NOT create a `grade${grade}Reasoning` array in the grade file for it.

Ask: "I'll scaffold Grade ${grade} (${galaxyName} Galaxy) with topics: ${topicList}. The `reasoning` topic is always included and uses the shared reasoning bank. Proceed?"

Wait for confirmation before writing anything.

---

### Step 3 — Create the grade question file

Create `src/data/questions/grade${grade}.js` with:

1. A comment header: `// Grade ${grade} — ${galaxyName} Galaxy`
2. One named export array per topic in `TOPICS[${grade}]` **excluding `'reasoning'`** (reasoning lives in the shared bank files). Name each array `grade${grade}${TopicPascalCase}` (e.g. `grade4Fractions`). Each array starts with **2 placeholder questions** — one `mc` at difficulty 1 and one `numeric` at difficulty 2 — fully valid and space-themed.
3. If the grade is ≤ 3, also create a `grade${grade}${TopicPascalCase}Nebula` array with 2 visual/manipulative questions per topic.
4. A `grade${grade}Questions` export that spreads all topic arrays (not reasoning).
5. A `grade${grade}NebulaQuestions` export (empty array `[]` for grades > 3).

Validation rules for placeholder questions — same as `/add-questions`:
- MC: exactly 4 options, correct answer matches one option exactly
- Numeric: options is null
- `hint_logic.default` required
- Space-themed question text
- `manipulative_config` only if `groups × perGroup ≤ 30` and grade ≤ 3

---

### Step 4 — Register in the question index

Read `src/data/questions/index.js` and add the new grade.

**Import** the grade file:
```js
import { grade${grade}Questions, grade${grade}NebulaQuestions } from './grade${grade}.js'
```

**Add to `QUESTION_BANK`:**
```js
${grade}: {
  topicA: grade${grade}Questions.filter(q => q.topic === 'topicA'),
  topicB: grade${grade}Questions.filter(q => q.topic === 'topicB'),
  // ... one entry per topic in TOPICS[${grade}] except 'reasoning'
  reasoning: reasoningByGrade(/* existing reasoning bank arrays */, ${grade}),
},
```

The `reasoningByGrade(questions, grade)` helper is already defined in `index.js`. Pass the merged array of all 4 reasoning bank exports, then filter by grade. Check how existing grade entries call it and follow the same pattern.

**Add to `NEBULA_BANK`:**
```js
${grade}: {
  // only for grades ≤ 3: one entry per non-reasoning topic with nebula questions
},
```

---

### Step 5 — Verify schema.js has the grade defined

Check that `GRADE_GALAXIES[${grade}]` and `TOPICS[${grade}]` exist in `src/data/schema.js`.
If either is missing, add them. Use the existing entries as a style guide.
For `TOPIC_DISPLAY`, add any topics not already present with a fitting color and planet name.
`'reasoning'` should already be in `TOPIC_DISPLAY` — do not add a duplicate.

---

### Step 6 — Confirm and report

Report:
- File created: `src/data/questions/grade${grade}.js`
- Topics scaffolded and placeholder question count per topic
- `reasoning` topic registered via `reasoningByGrade()` (no new questions added — use `/add-questions ${grade} reasoning` to add reasoning questions)
- Index updated: `src/data/questions/index.js`
- Schema updated (if needed): `src/data/schema.js`
- Next step suggestion: "Run `/add-questions ${grade} <topic>` to fill in the real questions."
