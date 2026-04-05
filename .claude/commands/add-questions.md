# /add-questions

Add one or more validated questions to an existing grade and topic in the Stellar Math question bank.

## Arguments
`$ARGUMENTS` contains the grade and topic, e.g. `3 multiplication` or `4 fractions`.

## Instructions

Parse `$ARGUMENTS` to extract `grade` (number 1–10) and `topic` (string). If either is missing or invalid, ask the user to provide them before proceeding.

---

### Step 1 — Read current state

Read these files before making any changes:
- `src/data/questions/grade${grade}.js` — existing questions for this grade
- `src/data/schema.js` — TOPICS map to confirm the topic exists for this grade
- `src/data/questions/index.js` — to confirm the grade/topic is registered

If the grade file doesn't exist, stop and tell the user to run `/add-grade ${grade}` first.
If the topic is not in `TOPICS[${grade}]` in schema.js, stop and tell the user to run `/add-topic ${grade} ${topic}` first.

---

### Step 2 — Understand what already exists

Scan the existing questions for this grade+topic combination and report:
- How many questions already exist
- The highest existing question ID (e.g. `g3-mult-010`) so you can continue the sequence
- The difficulty distribution (how many at difficulty 1, 2, 3)
- Which subtopics are already covered

---

### Step 3 — Ask the user how many questions to add

Ask: "How many questions would you like to add to Grade ${grade} — ${topic}? (Enter a number, or describe them and I'll generate them)"

If the user describes questions in plain English (e.g. "add 3 word problems about fractions at difficulty 2"), generate them directly. If the user says a number without detail, ask for specifics: type (mc/numeric), difficulty, subtopic, and whether to include a manipulative.

---

### Step 4 — Generate and validate each question

For each question, construct a valid question object following this schema exactly:

```js
{
  id:             'g${grade}-${topicCode}-NNN',   // continue from last existing ID
  grade:          ${grade},
  topic:          '${topic}',
  subtopic:       string,                          // e.g. 'basic-facts', 'word-problems'
  difficulty:     1 | 2 | 3,
  type:           'mc' | 'numeric',
  question_text:  string,                          // space-themed, engaging
  display_mode:   'text' | 'equation' | 'visual',
  options:        string[] | null,                 // array of 4 for mc, null for numeric
  correct_answer: string,                          // must exactly match one option for mc
  hint_logic: {
    default:        string,                        // co-pilot hint — required
    common_errors?: { [wrongAnswer]: string }      // optional per-wrong-answer hints
  },
  manipulative?:        'star-cubes' | null,       // only for grades 1–3
  manipulative_config?: { groups: number, perGroup: number },  // required if manipulative set
}
```

**Validation rules — enforce all of these:**
1. For `type: 'mc'`: `options` must be an array of exactly 4 strings, and `correct_answer` must exactly match one of them (case-sensitive string comparison).
2. For `type: 'numeric'`: `options` must be `null`.
3. `difficulty` must be 1, 2, or 3.
4. `manipulative: 'star-cubes'` only allowed for grade ≤ 3.
5. If `manipulative` is set, `manipulative_config` is **required** and `groups × perGroup` must be ≤ 30.
6. `hint_logic.default` is required on every question.
7. Question IDs must be unique — check against all existing IDs in the file.
8. `question_text` must be space-themed and engaging (rockets, planets, aliens, missions, etc.).

If any validation rule fails, fix the question before writing it — do not write invalid questions.

---

### Step 5 — Show questions for approval

Before writing to disk, display all generated questions clearly in a readable format. Ask: "Shall I add these questions? (yes / adjust / cancel)"

If the user says "adjust", ask what to change and regenerate. Do not write until approved.

---

### Step 6 — Write to file

Once approved:

1. Open `src/data/questions/grade${grade}.js`
2. Append the new questions to the correct export array (e.g. `grade${grade}${TopicPascalCase}` like `grade3Multiplication`)
3. If that named export doesn't exist yet, add it and include it in `grade${grade}Questions`

Do **not** modify any other file unless the topic array needs to be added to `grade${grade}Questions` at the bottom.

---

### Step 7 — Confirm

Report:
- How many questions were added
- New total for this grade/topic
- New difficulty distribution
- Any questions that were skipped due to validation failures (and why)
