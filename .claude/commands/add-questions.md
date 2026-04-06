# /add-questions

Add one or more validated questions to an existing grade and topic in the Stellar Math question bank.

## Arguments
`$ARGUMENTS` contains the grade and topic, e.g. `3 multiplication` or `4 fractions` or `3 reasoning`.

## Instructions

Parse `$ARGUMENTS` to extract `grade` (number 1–10) and `topic` (string). If either is missing or invalid, ask the user to provide them before proceeding.

---

### Step 1 — Read current state

**For standard topics** (anything except `reasoning`):
- `src/data/questions/grade${grade}.js` — existing questions for this grade
- `src/data/schema.js` — TOPICS map to confirm the topic exists for this grade
- `src/data/questions/index.js` — to confirm the grade/topic is registered

**For the `reasoning` topic**, the questions live in dedicated bank files (not the grade file). Read the correct bank based on grade:
- Grade 1–2: `src/data/questions/reasoning-k2.js`
- Grade 3–5: `src/data/questions/reasoning-35.js`
- Grade 6–8: `src/data/questions/reasoning-68.js`
- Grade 9–10: `src/data/questions/reasoning-910.js`

Also read `src/data/questions/index.js` to see how `reasoningByGrade()` filters questions into each grade's `QUESTION_BANK` entry.

If the grade file doesn't exist for a standard topic, stop and tell the user to run `/add-grade ${grade}` first.
If the topic is not in `TOPICS[${grade}]` in schema.js, stop and tell the user to run `/add-topic ${grade} ${topic}` first.

---

### Step 2 — Understand what already exists

Scan the existing questions for this grade+topic combination and report:
- How many questions already exist
- The highest existing question ID (e.g. `g3-mult-010`) so you can continue the sequence
- The difficulty distribution (how many at difficulty 1, 2, 3)
- Which subtopics are already covered
- For `reasoning`: which `visual_type` values are already used

---

### Step 3 — Ask the user how many questions to add

Ask: "How many questions would you like to add to Grade ${grade} — ${topic}? (Enter a number, or describe them and I'll generate them)"

If the user describes questions in plain English, generate them directly. If the user says a number without detail, ask for specifics: type (mc/numeric/visual-reasoning), difficulty, subtopic, and whether to include a manipulative (grades 1–3 only).

---

### Step 4 — Generate and validate each question

There are **three question types**. Use the correct schema for each:

---

#### Type A — `mc` (multiple choice) and `numeric`

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

---

#### Type B — `visual-reasoning`

Used exclusively for the `reasoning` topic. Rendered with SVG visual components, NOT text options.

```js
{
  id:             'g${grade}-rsn-NNN',
  grade:          ${grade},
  topic:          'reasoning',
  subtopic:       string,        // e.g. 'pattern-matrix', 'odd-one-out', 'visual-analogy'
  difficulty:     1 | 2 | 3,
  type:           'visual-reasoning',
  question_text:  string,        // instruction text, e.g. "What comes next in the pattern?"
  display_mode:   'visual',
  visual_type:    string,        // see Visual Types below
  // visual_type-specific config fields — see per-type schemas below
  options:        null,          // always null for visual-reasoning
  correct_answer: string,        // e.g. 'A' | 'B' | 'C' | 'D' for visual_options, or item index for odd-one-out
  visual_options?: VisualOption[], // required for most visual types (see below)
  hint_logic: {
    default: string,             // required
  },
}
```

##### Visual Types reference

Each `visual_type` maps to a React component in `src/components/visuals/`. Use the exact field names shown.

---

**`pattern-matrix`** → `PatternMatrix.jsx`
A 2D grid of shapes where one cell shows "?". The answer options are shapes to place in the "?" cell.

```js
visual_type: 'pattern-matrix',
matrix: ShapeDescriptor[][],   // 2D array, null = the "?" cell
visual_options: VisualOption[], // 4 options, each with type:'shape' and a ShapeDescriptor
correct_answer: 'A' | 'B' | 'C' | 'D',
```

---

**`odd-one-out`** → `OddOneOut.jsx`
Five items displayed in a row; the student taps the one that doesn't belong.

```js
visual_type: 'odd-one-out',
items: ShapeDescriptor[],   // exactly 5 items
// NO visual_options — user taps directly on an item
correct_answer: string,     // '0'–'4' (index of the odd item)
```

---

**`rotation`** → `RotationQuestion.jsx`
Shows a reference shape and asks which option shows it rotated by a given angle.

```js
visual_type: 'rotation',
shape: ShapeDescriptor,
degrees: 90 | 180 | 270,
visual_options: VisualOption[], // 4 options, each type:'shape'
correct_answer: 'A' | 'B' | 'C' | 'D',
```

---

**`reflection`** → `ReflectionQuestion.jsx`
Shows a shape and a mirror axis; asks which option is the correct reflection.

```js
visual_type: 'reflection',
shape: ShapeDescriptor,
axis: 'vertical' | 'horizontal',
visual_options: VisualOption[],
correct_answer: 'A' | 'B' | 'C' | 'D',
```

---

**`visual-analogy`** → `VisualAnalogy.jsx`
A:B :: C:? — show three shapes and ask which completes the analogy.

```js
visual_type: 'visual-analogy',
a: ShapeDescriptor,
b: ShapeDescriptor,
c: ShapeDescriptor,
visual_options: VisualOption[],
correct_answer: 'A' | 'B' | 'C' | 'D',
```

---

**`symmetry-complete`** → `SymmetryComplete.jsx`
Half a shape is shown; ask which option completes it symmetrically.

```js
visual_type: 'symmetry-complete',
shape: ShapeDescriptor,
axis: 'vertical' | 'horizontal',
visual_options: VisualOption[],
correct_answer: 'A' | 'B' | 'C' | 'D',
```

---

**`shape-net`** → `ShapeNet.jsx`
A 2D net; ask which 3D solid it folds into.

```js
visual_type: 'shape-net',
netType: 'cube' | 'prism' | 'pyramid',
visual_options: VisualOption[],  // type:'shape', each with a ShapeDescriptor naming a 3D solid
correct_answer: 'A' | 'B' | 'C' | 'D',
```

---

##### ShapeDescriptor format

Used wherever a shape must be described in data:

```js
{
  shape:    'circle' | 'square' | 'triangle' | 'pentagon' | 'hexagon' |
            'star' | 'diamond' | 'cross' | 'arrow',
  color:    string,       // CSS color e.g. '#e53935', 'var(--comet-cyan)'
  rotation: number,       // degrees, default 0
  filled:   boolean,      // true = solid fill, false = outline only
  size:     'sm' | 'md' | 'lg',
}
```

---

##### VisualOption format

Used in `visual_options` arrays for most visual types:

```js
{
  label: 'A' | 'B' | 'C' | 'D',
  type:  'shape' | 'shapes-row' | 'pattern-matrix',
  // For type:'shape':
  descriptor: ShapeDescriptor,
  // For type:'shapes-row':
  shapes: ShapeDescriptor[],
  // For type:'pattern-matrix':
  matrix: ShapeDescriptor[][],
}
```

---

### Step 5 — Validation rules — enforce all of these

**Common to all types:**
1. `difficulty` must be 1, 2, or 3.
2. `hint_logic.default` is required on every question.
3. Question IDs must be unique — check against all existing IDs in the target file.
4. `question_text` must be space-themed and engaging (rockets, planets, aliens, missions, etc.).

**For `mc`:**
5. `options` must be an array of exactly 4 strings, and `correct_answer` must exactly match one of them (case-sensitive).

**For `numeric`:**
6. `options` must be `null`.

**For `mc` and `numeric`:**
7. `manipulative: 'star-cubes'` only allowed for grade ≤ 3.
8. If `manipulative` is set, `manipulative_config` is **required** and `groups × perGroup` must be ≤ 30.

**For `visual-reasoning`:**
9. `options` must be `null`.
10. `visual_type` must be one of the 7 values listed above.
11. For types with `visual_options`: must be exactly 4 items with labels A/B/C/D.
12. `correct_answer` must be a valid label for the visual type:
    - Most types: `'A'` | `'B'` | `'C'` | `'D'`
    - `odd-one-out`: `'0'` | `'1'` | `'2'` | `'3'` | `'4'`
13. `display_mode` must be `'visual'`.
14. For `odd-one-out`: `items` must have exactly 5 entries; no `visual_options`.

If any validation rule fails, fix the question before writing — do not write invalid questions.

---

### Step 6 — Show questions for approval

Before writing to disk, display all generated questions clearly in a readable format. Ask: "Shall I add these questions? (yes / adjust / cancel)"

If the user says "adjust", ask what to change and regenerate. Do not write until approved.

---

### Step 7 — Write to file

**For standard topics** (not `reasoning`):
1. Open `src/data/questions/grade${grade}.js`
2. Append the new questions to the correct export array (e.g. `grade${grade}${TopicPascalCase}` like `grade3Multiplication`)
3. If that named export doesn't exist yet, add it and include it in `grade${grade}Questions`

**For `reasoning`**:
1. Determine the correct bank file from the grade:
   - Grade 1–2 → `src/data/questions/reasoning-k2.js`
   - Grade 3–5 → `src/data/questions/reasoning-35.js`
   - Grade 6–8 → `src/data/questions/reasoning-68.js`
   - Grade 9–10 → `src/data/questions/reasoning-910.js`
2. Append the new questions to the main export array in that file (e.g. `reasoningK2`)
3. The `reasoningByGrade(questions, grade)` helper in `index.js` already filters by `q.grade`, so no changes to `index.js` are needed as long as `q.grade` is set correctly.

Do **not** modify `src/data/schema.js` or `src/data/questions/index.js` unless a new topic export is missing.

---

### Step 8 — Confirm

Report:
- How many questions were added
- New total for this grade/topic
- New difficulty distribution
- For reasoning: which `visual_type` values were added
- Any questions that were skipped due to validation failures (and why)
