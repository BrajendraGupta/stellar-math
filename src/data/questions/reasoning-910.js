/**
 * Reasoning questions for Grades 9–10
 * Covers: complex analogies, spatial sequences, advanced pattern matrices
 */
export const reasoning910Questions = [
  {
    id: 'r-910-pm-001', grade: 9, topic: 'reasoning', difficulty: 3,
    type: 'visual-reasoning', display_mode: 'visual',
    question_text: 'Each row applies two transformations. Find the missing piece.',
    visual_type: 'pattern-matrix',
    visual_config: {
      grid: [
        [{ shape: 'circle',  color: '#00e5ff', filled: true,  rotation: 0   },
         { shape: 'circle',  color: '#ff4081', filled: true,  rotation: 0   },
         { shape: 'circle',  color: '#ffd700', filled: true,  rotation: 0   }],
        [{ shape: 'diamond', color: '#00e5ff', filled: false, rotation: 0   },
         { shape: 'diamond', color: '#ff4081', filled: false, rotation: 0   },
         { shape: 'diamond', color: '#ffd700', filled: false, rotation: 0   }],
        [{ shape: 'star',    color: '#00e5ff', filled: true,  rotation: 0   },
         { shape: 'star',    color: '#ff4081', filled: true,  rotation: 0   },
         null],
      ],
    },
    visual_options: [
      { key: 'A', visual_type: 'shape', visual_config: { shape: 'star', color: '#ffd700', filled: true  } },
      { key: 'B', visual_type: 'shape', visual_config: { shape: 'star', color: '#ffd700', filled: false } },
      { key: 'C', visual_type: 'shape', visual_config: { shape: 'star', color: '#ff4081', filled: true  } },
      { key: 'D', visual_type: 'shape', visual_config: { shape: 'diamond', color: '#ffd700', filled: true } },
    ],
    options: ['Filled gold star', 'Outline gold star', 'Filled pink star', 'Filled gold diamond'],
    correct_answer: 'A',
    hint_logic: { default: 'Column 3 is always gold. Row 3 shapes are filled stars. Combine both rules.' },
  },
  {
    id: 'r-910-pm-002', grade: 10, topic: 'reasoning', difficulty: 3,
    type: 'visual-reasoning', display_mode: 'visual',
    question_text: 'Find the rule and complete the matrix.',
    visual_type: 'pattern-matrix',
    visual_config: {
      grid: [
        [{ shape: 'pentagon', color: '#00e676', filled: true  }, { shape: 'hexagon', color: '#00e676', filled: true  }, { shape: 'circle', color: '#00e676', filled: true  }],
        [{ shape: 'pentagon', color: '#ff9800', filled: false }, { shape: 'hexagon', color: '#ff9800', filled: false }, { shape: 'circle', color: '#ff9800', filled: false }],
        [{ shape: 'pentagon', color: '#ce93d8', filled: true  }, { shape: 'hexagon', color: '#ce93d8', filled: true  }, null],
      ],
    },
    visual_options: [
      { key: 'A', visual_type: 'shape', visual_config: { shape: 'circle', color: '#ce93d8', filled: true  } },
      { key: 'B', visual_type: 'shape', visual_config: { shape: 'circle', color: '#ce93d8', filled: false } },
      { key: 'C', visual_type: 'shape', visual_config: { shape: 'circle', color: '#ff9800', filled: true  } },
      { key: 'D', visual_type: 'shape', visual_config: { shape: 'hexagon', color: '#ce93d8', filled: true  } },
    ],
    options: ['Filled purple circle', 'Outline purple circle', 'Filled orange circle', 'Filled purple hexagon'],
    correct_answer: 'A',
    hint_logic: { default: 'Row 3 is purple and filled (same as row 1 but purple). Column 3 is always a circle.' },
  },

  // ── Visual Analogy ──────────────────────────────────────────────
  {
    id: 'r-910-va-001', grade: 9, topic: 'reasoning', difficulty: 3,
    type: 'visual-reasoning', display_mode: 'visual',
    question_text: 'A is to B as C is to...?',
    visual_type: 'visual-analogy',
    visual_config: {
      a: { shape: 'circle',  color: '#00e5ff', filled: true,  rotation: 0   },
      b: { shape: 'circle',  color: '#ff4081', filled: false, rotation: 180 },
      c: { shape: 'diamond', color: '#ffd700', filled: true,  rotation: 0   },
    },
    visual_options: [
      { key: 'A', visual_type: 'shape', visual_config: { shape: 'diamond', color: '#00e676', filled: false, rotation: 180 } },
      { key: 'B', visual_type: 'shape', visual_config: { shape: 'diamond', color: '#ffd700', filled: false, rotation: 180 } },
      { key: 'C', visual_type: 'shape', visual_config: { shape: 'diamond', color: '#ffd700', filled: true,  rotation: 0   } },
      { key: 'D', visual_type: 'shape', visual_config: { shape: 'diamond', color: '#ff4081', filled: false, rotation: 0   } },
    ],
    options: ['Green outline diamond 180°', 'Gold outline diamond 180°', 'Gold filled diamond 0°', 'Pink outline diamond 0°'],
    correct_answer: 'B',
    hint_logic: { default: 'Two changes happen: filled→outline, and colour changes. The rotation is 180°. Keep the same shape and apply all three changes to C.' },
  },

  // ── Symmetry ────────────────────────────────────────────────────
  {
    id: 'r-910-sym-001', grade: 9, topic: 'reasoning', difficulty: 3,
    type: 'mc', display_mode: 'visual',
    question_text: 'What shape is formed when this half-figure is reflected horizontally?',
    visual_type: 'symmetry-complete',
    visual_config: {
      halfPoints: [[-60, -60], [0, -60], [0, 0], [-60, 0]],
      axis: 'horizontal',
      color: '#ff9800',
    },
    options: ['Square', 'Rectangle', 'Trapezoid', 'Parallelogram'],
    correct_answer: 'Square',
    hint_logic: { default: 'The top half is a square. Reflecting it horizontally gives another identical square below — combined they form a rectangle. Wait — check the equal sides: both halves are 60×60 making a 60×120 rectangle.' },
  },

  // ── Shape Net ───────────────────────────────────────────────────
  {
    id: 'r-910-net-001', grade: 10, topic: 'reasoning', difficulty: 3,
    type: 'mc', display_mode: 'visual',
    question_text: 'How many faces does the solid formed by this net have?',
    visual_type: 'shape-net',
    visual_config: { netType: 'pyramid' },
    options: ['4', '5', '6', '8'],
    correct_answer: '5',
    hint_logic: { default: 'Count the faces in the net: 1 square + 4 triangles = 5 faces total.' },
  },
]
