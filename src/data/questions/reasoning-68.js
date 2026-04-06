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
    options: ['36°', '45°', '90°', 'No rotation'],
    correct_answer: 'B',
    hint_logic: { default: 'Look at how much the square rotated from A to B — it turned 45°. Apply the same rotation to the pentagon.' },
  },

  // ── Grade 7: Additional questions ──────────────────────────────
  {
    id: 'r-7-pm-001', grade: 7, topic: 'reasoning', difficulty: 2,
    type: 'visual-reasoning', display_mode: 'visual',
    question_text: 'Complete the pattern: each row changes one property at a time.',
    visual_type: 'pattern-matrix',
    visual_config: {
      grid: [
        [{ shape: 'circle',   color: '#00e5ff', filled: true  }, { shape: 'circle',   color: '#ff4081', filled: true  }, { shape: 'circle',   color: '#ffd700', filled: true  }],
        [{ shape: 'square',   color: '#00e5ff', filled: true  }, { shape: 'square',   color: '#ff4081', filled: true  }, { shape: 'square',   color: '#ffd700', filled: true  }],
        [{ shape: 'triangle', color: '#00e5ff', filled: true  }, { shape: 'triangle', color: '#ff4081', filled: true  }, null],
      ],
    },
    visual_options: [
      { key: 'A', visual_type: 'shape', visual_config: { shape: 'triangle', color: '#ffd700', filled: true  } },
      { key: 'B', visual_type: 'shape', visual_config: { shape: 'triangle', color: '#ffd700', filled: false } },
      { key: 'C', visual_type: 'shape', visual_config: { shape: 'circle',   color: '#ffd700', filled: true  } },
      { key: 'D', visual_type: 'shape', visual_config: { shape: 'triangle', color: '#00e5ff', filled: true  } },
    ],
    options: ['Yellow triangle (filled)', 'Yellow triangle (outline)', 'Yellow circle', 'Cyan triangle'],
    correct_answer: 'A',
    hint_logic: { default: 'Each column has the same color. Column 3 is always gold/yellow. Each row has the same shape. Row 3 is triangles.' },
  },
  {
    id: 'r-7-oo-001', grade: 7, topic: 'reasoning', difficulty: 2,
    type: 'visual-reasoning', display_mode: 'visual',
    question_text: 'Which shape does NOT belong with the others?',
    visual_type: 'odd-one-out',
    visual_config: {
      items: [
        { shape: 'pentagon',  color: '#00e5ff', filled: true },
        { shape: 'hexagon',   color: '#00e5ff', filled: true },
        { shape: 'circle',    color: '#00e5ff', filled: true },
        { shape: 'triangle',  color: '#00e5ff', filled: true },
        { shape: 'square',    color: '#00e5ff', filled: true },
      ],
      oddIndex: 2,
    },
    options: [],
    correct_answer: '2',
    hint_logic: { default: 'Pentagon, hexagon, triangle, and square all have straight sides (polygons). The circle has no straight sides — it is the odd one out.' },
  },
  {
    id: 'r-7-rot-001', grade: 7, topic: 'reasoning', difficulty: 2,
    type: 'visual-reasoning', display_mode: 'visual',
    question_text: 'Which shows the shape after a 90° clockwise rotation?',
    visual_type: 'rotation',
    visual_config: { reference: { shape: 'arrow', color: '#00e676', rotation: 0 }, rotationDeg: 90 },
    visual_options: [
      { key: 'A', visual_type: 'shape', visual_config: { shape: 'arrow', color: '#00e676', rotation: 90  } },
      { key: 'B', visual_type: 'shape', visual_config: { shape: 'arrow', color: '#00e676', rotation: 180 } },
      { key: 'C', visual_type: 'shape', visual_config: { shape: 'arrow', color: '#00e676', rotation: 270 } },
      { key: 'D', visual_type: 'shape', visual_config: { shape: 'arrow', color: '#00e676', rotation: 0   } },
    ],
    options: ['90° (pointing right)', '180° (pointing down)', '270° (pointing left)', '0° (no change)'],
    correct_answer: 'A',
    hint_logic: { default: 'A 90° clockwise rotation turns the top to point right. The arrow that was pointing up now points to the right.' },
  },
  {
    id: 'r-7-va-002', grade: 7, topic: 'reasoning', difficulty: 3,
    type: 'visual-reasoning', display_mode: 'visual',
    question_text: 'A is to B as C is to...? (Think about fill: solid → outline)',
    visual_type: 'visual-analogy',
    visual_config: {
      a: { shape: 'square',   color: '#ff9800', filled: true  },
      b: { shape: 'square',   color: '#ff9800', filled: false },
      c: { shape: 'circle',   color: '#ce93d8', filled: true  },
    },
    visual_options: [
      { key: 'A', visual_type: 'shape', visual_config: { shape: 'circle', color: '#ce93d8', filled: false } },
      { key: 'B', visual_type: 'shape', visual_config: { shape: 'circle', color: '#ce93d8', filled: true  } },
      { key: 'C', visual_type: 'shape', visual_config: { shape: 'square', color: '#ce93d8', filled: false } },
      { key: 'D', visual_type: 'shape', visual_config: { shape: 'circle', color: '#ff9800', filled: false } },
    ],
    options: ['Outline purple circle', 'Filled purple circle', 'Outline purple square', 'Outline orange circle'],
    correct_answer: 'A',
    hint_logic: { default: 'The square changed from filled to outline. Apply the same change to the circle: filled circle → outline circle.' },
  },
  {
    id: 'r-7-pm-002', grade: 7, topic: 'reasoning', difficulty: 3,
    type: 'visual-reasoning', display_mode: 'visual',
    question_text: 'Find the missing piece in the rotation pattern.',
    visual_type: 'pattern-matrix',
    visual_config: {
      grid: [
        [{ shape: 'arrow', color: '#00e5ff', rotation: 0   }, { shape: 'arrow', color: '#00e5ff', rotation: 90  }, { shape: 'arrow', color: '#00e5ff', rotation: 180 }],
        [{ shape: 'arrow', color: '#ff4081', rotation: 90  }, { shape: 'arrow', color: '#ff4081', rotation: 180 }, { shape: 'arrow', color: '#ff4081', rotation: 270 }],
        [{ shape: 'arrow', color: '#ffd700', rotation: 180 }, { shape: 'arrow', color: '#ffd700', rotation: 270 }, null],
      ],
    },
    visual_options: [
      { key: 'A', visual_type: 'shape', visual_config: { shape: 'arrow', color: '#ffd700', rotation: 0   } },
      { key: 'B', visual_type: 'shape', visual_config: { shape: 'arrow', color: '#ffd700', rotation: 90  } },
      { key: 'C', visual_type: 'shape', visual_config: { shape: 'arrow', color: '#ffd700', rotation: 270 } },
      { key: 'D', visual_type: 'shape', visual_config: { shape: 'arrow', color: '#ffd700', rotation: 180 } },
    ],
    options: ['0° (up)', '90° (right)', '270° (left)', '180° (down)'],
    correct_answer: 'A',
    hint_logic: { default: 'Each row starts 90° further along than the previous row. Row 3 starts at 180°, then 270°, then wraps to 360° = 0° (pointing up).' },
  },
  {
    id: 'r-7-oo-002', grade: 7, topic: 'reasoning', difficulty: 3,
    type: 'visual-reasoning', display_mode: 'visual',
    question_text: 'Which shape is the odd one out? (Think about number of sides)',
    visual_type: 'odd-one-out',
    visual_config: {
      items: [
        { shape: 'square',   color: '#ff9800', filled: false },
        { shape: 'diamond',  color: '#ff9800', filled: false },
        { shape: 'triangle', color: '#ff9800', filled: false },
        { shape: 'hexagon',  color: '#ff9800', filled: false },
        { shape: 'pentagon', color: '#ff9800', filled: false },
      ],
      oddIndex: 2,
    },
    options: [],
    correct_answer: '2',
    hint_logic: { default: 'Square = 4 sides, diamond = 4 sides, hexagon = 6 sides, pentagon = 5 sides. Triangle is the only shape with 3 sides — the odd one out.' },
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
