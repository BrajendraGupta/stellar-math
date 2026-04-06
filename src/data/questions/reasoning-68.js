/**
 * Reasoning questions for Grades 6–8
 * Covers: complex matrix patterns, rotations, shape nets, visual analogies, symmetry
 */
export const reasoning68Questions = [
  // ── Pattern Matrix ──────────────────────────────────────────────
  {
    id: 'r-68-pm-001', grade: 6, topic: 'reasoning', difficulty: 2,
    type: 'visual-reasoning', display_mode: 'visual',
    question_text: 'Complete the pattern matrix.',
    visual_type: 'pattern-matrix',
    visual_config: {
      grid: [
        [{ shape: 'circle', color: '#00e5ff', filled: true }, { shape: 'circle', color: '#00e5ff', filled: false }, { shape: 'circle', color: '#00e5ff', filled: true }],
        [{ shape: 'diamond', color: '#ff4081', filled: false }, { shape: 'diamond', color: '#ff4081', filled: true }, { shape: 'diamond', color: '#ff4081', filled: false }],
        [null, { shape: 'star', color: '#ffd700', filled: false }, { shape: 'star', color: '#ffd700', filled: true }],
      ],
    },
    visual_options: [
      { key: 'A', visual_type: 'shape', visual_config: { shape: 'star', color: '#ffd700', filled: true  } },
      { key: 'B', visual_type: 'shape', visual_config: { shape: 'star', color: '#ffd700', filled: false } },
      { key: 'C', visual_type: 'shape', visual_config: { shape: 'circle', color: '#ffd700', filled: true } },
      { key: 'D', visual_type: 'shape', visual_config: { shape: 'star', color: '#ff4081', filled: true  } },
    ],
    options: ['Filled gold star', 'Outline gold star', 'Filled gold circle', 'Filled pink star'],
    correct_answer: 'A',
    hint_logic: { default: 'Each row alternates filled/outline. Row 3 column 1 should match the pattern: true, false, true → first is true.' },
  },
  {
    id: 'r-68-pm-002', grade: 7, topic: 'reasoning', difficulty: 3,
    type: 'visual-reasoning', display_mode: 'visual',
    question_text: 'What completes the size-progression matrix?',
    visual_type: 'pattern-matrix',
    visual_config: {
      grid: [
        [{ shape: 'circle', color: '#00e676', size: 0.4 }, { shape: 'circle', color: '#00e676', size: 0.65 }, { shape: 'circle', color: '#00e676', size: 0.9 }],
        [{ shape: 'square', color: '#ff9800', size: 0.9 }, { shape: 'square', color: '#ff9800', size: 0.65 }, { shape: 'square', color: '#ff9800', size: 0.4 }],
        [{ shape: 'star',   color: '#ce93d8', size: 0.4 }, { shape: 'star',   color: '#ce93d8', size: 0.65 }, null],
      ],
    },
    visual_options: [
      { key: 'A', visual_type: 'shape', visual_config: { shape: 'star', color: '#ce93d8', size: 0.9  } },
      { key: 'B', visual_type: 'shape', visual_config: { shape: 'star', color: '#ce93d8', size: 0.4  } },
      { key: 'C', visual_type: 'shape', visual_config: { shape: 'star', color: '#ce93d8', size: 0.65 } },
      { key: 'D', visual_type: 'shape', visual_config: { shape: 'circle', color: '#ce93d8', size: 0.9 } },
    ],
    options: ['Large star', 'Small star', 'Medium star', 'Large circle'],
    correct_answer: 'A',
    hint_logic: { default: 'Row 1 goes small→medium→large. Row 3 follows the same rule.' },
  },

  // ── Rotation ────────────────────────────────────────────────────
  {
    id: 'r-68-rot-001', grade: 6, topic: 'reasoning', difficulty: 2,
    type: 'visual-reasoning', display_mode: 'visual',
    question_text: 'Which shows the shape after a 270° clockwise rotation?',
    visual_type: 'rotation',
    visual_config: { reference: { shape: 'arrow', color: '#ce93d8', rotation: 0 }, rotationDeg: 270 },
    visual_options: [
      { key: 'A', visual_type: 'shape', visual_config: { shape: 'arrow', color: '#ce93d8', rotation: 90  } },
      { key: 'B', visual_type: 'shape', visual_config: { shape: 'arrow', color: '#ce93d8', rotation: 180 } },
      { key: 'C', visual_type: 'shape', visual_config: { shape: 'arrow', color: '#ce93d8', rotation: 270 } },
      { key: 'D', visual_type: 'shape', visual_config: { shape: 'arrow', color: '#ce93d8', rotation: 0   } },
    ],
    options: ['90°', '180°', '270°', '0° (no change)'],
    correct_answer: 'C',
    hint_logic: { default: '270° clockwise = 90° counter-clockwise. The top of the arrow now faces left.' },
  },

  // ── Shape Nets ──────────────────────────────────────────────────
  {
    id: 'r-68-net-001', grade: 6, topic: 'reasoning', difficulty: 2,
    type: 'mc', display_mode: 'visual',
    question_text: 'Which 3D solid is formed by this net?',
    visual_type: 'shape-net',
    visual_config: { netType: 'triangular-prism' },
    options: ['Cube', 'Square pyramid', 'Triangular prism', 'Cylinder'],
    correct_answer: 'Triangular prism',
    hint_logic: { default: 'Count the faces: 2 triangles + 3 rectangles = triangular prism.' },
  },

  // ── Visual Analogy ──────────────────────────────────────────────
  {
    id: 'r-68-va-001', grade: 7, topic: 'reasoning', difficulty: 3,
    type: 'visual-reasoning', display_mode: 'visual',
    question_text: 'A is to B as C is to...?',
    visual_type: 'visual-analogy',
    visual_config: {
      a: { shape: 'square',   color: '#00e5ff', rotation: 0   },
      b: { shape: 'square',   color: '#00e5ff', rotation: 45  },
      c: { shape: 'pentagon', color: '#ff4081', rotation: 0   },
    },
    visual_options: [
      { key: 'A', visual_type: 'shape', visual_config: { shape: 'pentagon', color: '#ff4081', rotation: 36  } },
      { key: 'B', visual_type: 'shape', visual_config: { shape: 'pentagon', color: '#ff4081', rotation: 45  } },
      { key: 'C', visual_type: 'shape', visual_config: { shape: 'pentagon', color: '#ff4081', rotation: 90  } },
      { key: 'D', visual_type: 'shape', visual_config: { shape: 'pentagon', color: '#ff4081', rotation: 0   } },
    ],
    options: ['36° (half-step)', '45°', '90°', 'No rotation'],
    correct_answer: 'A',
    hint_logic: { default: 'The square rotates by half its symmetry angle (90°/2 = 45°). For a pentagon with 72° symmetry, the half-step is 36°.' },
  },

  // ── Symmetry ────────────────────────────────────────────────────
  {
    id: 'r-68-sym-001', grade: 8, topic: 'reasoning', difficulty: 3,
    type: 'mc', display_mode: 'visual',
    question_text: 'Which option correctly completes the symmetric figure?',
    visual_type: 'symmetry-complete',
    visual_config: {
      halfPoints: [[-70, -40], [-20, -40], [-20, 40], [-70, 40]],
      axis: 'vertical',
      color: '#00e5ff',
    },
    options: ['Rectangle', 'Square', 'Parallelogram', 'Trapezoid'],
    correct_answer: 'Rectangle',
    hint_logic: { default: 'The left half is a rectangle. Reflecting it gives a larger rectangle.' },
  },
]
