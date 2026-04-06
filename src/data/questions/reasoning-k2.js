/**
 * Reasoning questions for Grades 1–2
 * Covers: patterns, symmetry, odd-one-out, number bonds
 */
export const reasoningK2Questions = [
  // ── Pattern Matrix ──────────────────────────────────────────────
  {
    id: 'r-k2-pm-001', grade: 1, topic: 'reasoning', difficulty: 1,
    type: 'visual-reasoning', display_mode: 'visual',
    question_text: 'Which shape completes the pattern?',
    visual_type: 'pattern-matrix',
    visual_config: {
      grid: [
        [{ shape: 'circle', color: '#00e5ff' }, { shape: 'square', color: '#00e5ff' }],
        [{ shape: 'circle', color: '#ff9800' }, null],
      ],
    },
    visual_options: [
      { key: 'A', visual_type: 'shape', visual_config: { shape: 'square', color: '#ff9800' } },
      { key: 'B', visual_type: 'shape', visual_config: { shape: 'circle', color: '#ff9800' } },
      { key: 'C', visual_type: 'shape', visual_config: { shape: 'square', color: '#00e5ff' } },
      { key: 'D', visual_type: 'shape', visual_config: { shape: 'triangle', color: '#ff9800' } },
    ],
    options: ['Square (orange)', 'Circle (orange)', 'Square (blue)', 'Triangle (orange)'],
    correct_answer: 'A',
    hint_logic: { default: 'Look at each row — what shape comes after a circle in the first row?' },
  },
  {
    id: 'r-k2-pm-002', grade: 1, topic: 'reasoning', difficulty: 1,
    type: 'visual-reasoning', display_mode: 'visual',
    question_text: 'What goes in the empty box?',
    visual_type: 'pattern-matrix',
    visual_config: {
      grid: [
        [{ shape: 'triangle', color: '#00e676' }, { shape: 'triangle', color: '#00e676' }, { shape: 'circle', color: '#00e676' }],
        [{ shape: 'triangle', color: '#ffd700' }, { shape: 'triangle', color: '#ffd700' }, null],
        [{ shape: 'triangle', color: '#ff4081' }, { shape: 'triangle', color: '#ff4081' }, { shape: 'circle', color: '#ff4081' }],
      ],
    },
    visual_options: [
      { key: 'A', visual_type: 'shape', visual_config: { shape: 'circle', color: '#ffd700' } },
      { key: 'B', visual_type: 'shape', visual_config: { shape: 'triangle', color: '#ffd700' } },
      { key: 'C', visual_type: 'shape', visual_config: { shape: 'circle', color: '#00e676' } },
      { key: 'D', visual_type: 'shape', visual_config: { shape: 'square', color: '#ffd700' } },
    ],
    options: ['Circle (yellow)', 'Triangle (yellow)', 'Circle (green)', 'Square (yellow)'],
    correct_answer: 'A',
    hint_logic: { default: 'Each row ends with the same shape. What shape ends the other rows?' },
  },

  // ── Odd One Out ─────────────────────────────────────────────────
  {
    id: 'r-k2-oo-001', grade: 1, topic: 'reasoning', difficulty: 1,
    type: 'mc', display_mode: 'visual',
    question_text: 'Which shape does NOT belong?',
    visual_type: 'odd-one-out',
    visual_config: {
      items: [
        { shape: 'circle', color: '#00e5ff' },
        { shape: 'circle', color: '#ff9800' },
        { shape: 'square', color: '#00e5ff' },
        { shape: 'circle', color: '#ffd700' },
        { shape: 'circle', color: '#00e676' },
      ],
      oddIndex: 2,
    },
    options: ['Shape 1', 'Shape 2', 'Shape 3', 'Shape 4'],
    correct_answer: 'Shape 3',
    hint_logic: { default: 'Most shapes are the same type. Which one is a different shape?' },
  },
  {
    id: 'r-k2-oo-002', grade: 2, topic: 'reasoning', difficulty: 1,
    type: 'mc', display_mode: 'visual',
    question_text: 'Which does NOT belong with the others?',
    visual_type: 'odd-one-out',
    visual_config: {
      items: [
        { shape: 'triangle', color: '#ce93d8' },
        { shape: 'triangle', color: '#ce93d8', rotation: 60 },
        { shape: 'triangle', color: '#ce93d8', rotation: 120 },
        { shape: 'pentagon', color: '#ce93d8' },
        { shape: 'triangle', color: '#ce93d8', rotation: 180 },
      ],
      oddIndex: 3,
    },
    options: ['Shape 1', 'Shape 2', 'Shape 3', 'Shape 4'],
    correct_answer: 'Shape 4',
    hint_logic: { default: 'Count the sides of each shape. Which one has a different number of sides?' },
  },

  // ── Symmetry Complete ───────────────────────────────────────────
  {
    id: 'r-k2-sym-001', grade: 2, topic: 'reasoning', difficulty: 2,
    type: 'mc', display_mode: 'visual',
    question_text: 'Which option shows the complete symmetrical shape?',
    visual_type: 'symmetry-complete',
    visual_config: {
      halfPoints: [[-60, -50], [-10, -50], [-10, 0], [-60, 0]],
      axis: 'vertical',
      color: '#00e676',
    },
    options: ['Rectangle', 'Triangle', 'Circle', 'Pentagon'],
    correct_answer: 'Rectangle',
    hint_logic: { default: 'Mirror the left side across the line. What shape does the whole thing make?' },
  },

  // ── Number Bonds ────────────────────────────────────────────────
  {
    id: 'r-k2-nb-001', grade: 1, topic: 'reasoning', difficulty: 1,
    type: 'numeric', display_mode: 'visual',
    question_text: 'What is the missing total?',
    visual_type: 'number-bonds',
    visual_config: { total: 9, parts: [4, 5], hidePart: 'total' },
    correct_answer: '9',
    hint_logic: { default: 'Add the two bottom numbers together!' },
  },
  {
    id: 'r-k2-nb-002', grade: 1, topic: 'reasoning', difficulty: 1,
    type: 'numeric', display_mode: 'visual',
    question_text: 'What is the missing part?',
    visual_type: 'number-bonds',
    visual_config: { total: 10, parts: [6, 4], hidePart: 1 },
    correct_answer: '4',
    hint_logic: {
      default: 'If the total is 10 and one part is 6, what is 10 minus 6?',
      common_errors: { '16': 'That is adding, not finding the missing part. Try 10 − 6.' },
    },
  },
  {
    id: 'r-k2-nb-003', grade: 2, topic: 'reasoning', difficulty: 2,
    type: 'numeric', display_mode: 'visual',
    question_text: 'What is the missing part?',
    visual_type: 'number-bonds',
    visual_config: { total: 15, parts: [8, 7], hidePart: 0 },
    correct_answer: '8',
    hint_logic: { default: 'Total is 15, one part is 7. What is 15 − 7?' },
  },

  // ── Visual Analogy ──────────────────────────────────────────────
  {
    id: 'r-k2-va-001', grade: 2, topic: 'reasoning', difficulty: 2,
    type: 'visual-reasoning', display_mode: 'visual',
    question_text: 'Shape A is to Shape B as Shape C is to...?',
    visual_type: 'visual-analogy',
    visual_config: {
      a: { shape: 'square',   color: '#00e5ff', filled: true },
      b: { shape: 'square',   color: '#00e5ff', filled: false },
      c: { shape: 'triangle', color: '#ff9800', filled: true },
    },
    visual_options: [
      { key: 'A', visual_type: 'shape', visual_config: { shape: 'triangle', color: '#ff9800', filled: false } },
      { key: 'B', visual_type: 'shape', visual_config: { shape: 'triangle', color: '#ff9800', filled: true } },
      { key: 'C', visual_type: 'shape', visual_config: { shape: 'circle', color: '#ff9800', filled: false } },
      { key: 'D', visual_type: 'shape', visual_config: { shape: 'square', color: '#ff9800', filled: false } },
    ],
    options: ['Outline triangle', 'Filled triangle', 'Outline circle', 'Outline square'],
    correct_answer: 'A',
    hint_logic: { default: 'Shape A is filled and Shape B is the outline. Apply the same change to Shape C.' },
  },
]
