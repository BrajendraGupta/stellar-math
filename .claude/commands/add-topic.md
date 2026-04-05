# /add-topic

Add a new topic (planet) to an existing grade in Stellar Math — updates the schema, creates question stubs, and registers everything in the question index.

## Arguments
`$ARGUMENTS` contains grade and topic, e.g. `3 geometry` or `5 statistics`.

## Instructions

Parse `$ARGUMENTS` to extract `grade` (number 1–10) and `topic` (string, lowercase-hyphenated). If either is missing, ask the user before proceeding.

---

### Step 1 — Read current state

Read these files:
- `src/data/schema.js` — check `TOPICS[${grade}]` and `TOPIC_DISPLAY`
- `src/data/questions/grade${grade}.js` — check existing topic exports
- `src/data/questions/index.js` — check `QUESTION_BANK[${grade}]`

If the grade file doesn't exist, stop and tell the user to run `/add-grade ${grade}` first.
If the topic already exists in `TOPICS[${grade}]`, report that and stop.

---

### Step 2 — Confirm details

Ask the user to confirm or provide:
- **Display name** — e.g. "Geometry Galaxy" (or suggest one based on the topic)
- **Planet color** — suggest a hex color that doesn't conflict with existing topics for this grade
- **Planet name** — e.g. "Kepler-22b" (suggest a real or fictional space body)

Show: "I'll add topic '${topic}' to Grade ${grade} as '${displayName}' (${color}). Proceed?"

---

### Step 3 — Update schema.js

In `src/data/schema.js`:

1. Add `'${topic}'` to `TOPICS[${grade}]` array (append at the end).
2. If `'${topic}'` is not already in `TOPIC_DISPLAY`, add:
```js
'${topic}': { name: '${displayName}', color: '${color}', planet: '${planetName}' },
```

---

### Step 4 — Add question stubs to the grade file

In `src/data/questions/grade${grade}.js`:

1. Add a new named export array `grade${grade}${TopicPascalCase}` with **2 placeholder questions** — one `mc` at difficulty 1, one `numeric` at difficulty 2 — fully valid, space-themed, following the schema.
2. Append `...grade${grade}${TopicPascalCase}` to the `grade${grade}Questions` spread at the bottom.
3. If grade ≤ 3, also add a `grade${grade}${TopicPascalCase}Nebula` array with 1 visual placeholder question and append it to `grade${grade}NebulaQuestions`.

All placeholder questions must pass the same validation as `/add-questions`:
- MC: 4 options, correct answer in options
- Numeric: options null
- `hint_logic.default` required
- Space-themed text

---

### Step 5 — Register in the question index

In `src/data/questions/index.js`:

1. Update the import to include the new export:
```js
import { ..., grade${grade}${TopicPascalCase} } from './grade${grade}.js'
```
2. Add to `QUESTION_BANK[${grade}]`:
```js
'${topic}': grade${grade}Questions.filter(q => q.topic === '${topic}'),
```
3. If grade ≤ 3, add to `NEBULA_BANK[${grade}]`:
```js
'${topic}': grade${grade}NebulaQuestions.filter(q => q.topic === '${topic}'),
```

---

### Step 6 — Report

- Schema updated: topic added to `TOPICS[${grade}]` and `TOPIC_DISPLAY`
- Question stubs created in `grade${grade}.js`
- Index updated in `index.js`
- Suggestion: "Run `/add-questions ${grade} ${topic}` to replace the stubs with real questions."
