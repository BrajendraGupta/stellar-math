/**
 * Reasoning questions for Grades 3–5
 * Covers: pattern matrices, rotations, reflections, shape nets, visual analogies
 */
export const reasoning35Questions = [
  // ── Pattern Matrix 3×3 ──────────────────────────────────────────
  {
    id: 'r-35-pm-001', grade: 3, topic: 'reasoning', difficulty: 1,
    type: 'visual-reasoning', display_mode: 'visual',
    question_text: 'Which shape completes the 3×3 pattern?',
    visual_type: 'pattern-matrix',
    visual_config: {
      grid: [
        [{ shape: 'circle', color: '#00e5ff' }, { shape: 'square', color: '#00e5ff' }, { shape: 'triangle', color: '#00e5ff' }],
        [{ shape: 'circle', color: '#ffd700' }, { shape: 'square', color: '#ffd700' }, { shape: 'triangle', color: '#ffd700' }],
        [{ shape: 'circle', color: '#00e676' }, { shape: 'square', color: '#00e676' }, null],
      ],
    },
    visual_options: [
      { key: 'A', visual_type: 'shape', visual_config: { shape: 'triangle', color: '#00e676' } },
      { key: 'B', visual_type: 'shape', visual_config: { shape: 'circle',   color: '#00e676' } },
      { key: 'C', visual_type: 'shape', visual_config: { shape: 'triangle', color: '#ffd700' } },
      { key: 'D', visual_type: 'shape', visual_config: { shape: 'square',   color: '#00e676' } },
    ],
    options: ['Green triangle', 'Green circle', 'Yellow triangle', 'Green square'],
    correct_answer: 'A',
    hint_logic: { default: 'Each row has the same colour. Each column has the same shape. What fits row 3, column 3?' },
  },
  {
    id: 'r-35-pm-002', grade: 4, topic: 'reasoning', difficulty: 2,
    type: 'visual-reasoning', display_mode: 'visual',
    question_text: 'Find the missing piece in the matrix.',
    visual_type: 'pattern-matrix',
    visual_config: {
      grid: [
        [{ shape: 'circle', color: '#ce93d8', filled: true  }, { shape: 'circle', color: '#ce93d8', filled: false }, { shape: 'circle', color: '#ce93d8', filled: true  }],
        [{ shape: 'square', color: '#00e5ff', filled: false }, { shape: 'square', color: '#00e5ff', filled: true  }, { shape: 'square', color: '#00e5ff', filled: false }],
        [{ shape: 'star',   color: '#ffd700', filled: true  }, null,                                                 { shape: 'star',   color: '#ffd700', filled: true  }],
      ],
    },
    visual_options: [
      { key: 'A', visual_type: 'shape', visual_config: { shape: 'star', color: '#ffd700', filled: false } },
      { key: 'B', visual_type: 'shape', visual_config: { shape: 'star', color: '#ffd700', filled: true  } },
      { key: 'C', visual_type: 'shape', visual_config: { shape: 'circle', color: '#ffd700', filled: false } },
      { key: 'D', visual_type: 'shape', visual_config: { shape: 'star', color: '#ce93d8', filled: false } },
    ],
    options: ['Outline star (gold)', 'Filled star (gold)', 'Outline circle (gold)', 'Outline star (purple)'],
    correct_answer: 'A',
    hint_logic: { default: 'Look at the filled/outline pattern across each row. Row 3 alternates filled-?-filled.' },
  },

  // ── Rotation ────────────────────────────────────────────────────
  {
    id: 'r-35-rot-001', grade: 3, topic: 'reasoning', difficulty: 2,
    type: 'visual-reasoning', display_mode: 'visual',
    question_text: 'Which option shows the arrow rotated 90° clockwise?',
    visual_type: 'rotation',
    visual_config: { reference: { shape: 'arrow', color: '#00e5ff', rotation: 0 }, rotationDeg: 90 },
    visual_options: [
      { key: 'A', visual_type: 'shape', visual_config: { shape: 'arrow', color: '#00e5ff', rotation: 90  } },
      { key: 'B', visual_type: 'shape', visual_config: { shape: 'arrow', color: '#00e5ff', rotation: 180 } },
      { key: 'C', visual_type: 'shape', visual_config: { shape: 'arrow', color: '#00e5ff', rotation: 270 } },
      { key: 'D', visual_type: 'shape', visual_config: { shape: 'arrow', color: '#00e5ff', rotation: 0   } },
    ],
    options: ['90° right', '180°', '270° right', 'No rotation'],
    correct_answer: 'A',
    hint_logic: { default: 'Rotating 90° clockwise turns the top to face right.' },
  },
  {
    id: 'r-35-rot-002', grade: 4, topic: 'reasoning', difficulty: 2,
    type: 'visual-reasoning', display_mode: 'visual',
    question_text: 'Which shows the shape rotated 180°?',
    visual_type: 'rotation',
    visual_config: { reference: { shape: 'triangle', color: '#ff9800', rotation: 0 }, rotationDeg: 180 },
    visual_options: [
      { key: 'A', visual_type: 'shape', visual_config: { shape: 'triangle', color: '#ff9800', rotation: 90  } },
      { key: 'B', visual_type: 'shape', visual_config: { shape: 'triangle', color: '#ff9800', rotation: 180 } },
      { key: 'C', visual_type: 'shape', visual_config: { shape: 'triangle', color: '#ff9800', rotation: 45  } },
      { key: 'D', visual_type: 'shape', visual_config: { shape: 'triangle', color: '#ff9800', rotation: 270 } },
    ],
    options: ['90°', '180°', '45°', '270°'],
    correct_answer: 'B',
    hint_logic: { default: 'A 180° rotation flips the shape upside down.' },
  },

  // ── Reflection ──────────────────────────────────────────────────
  {
    id: 'r-35-ref-001', grade: 3, topic: 'reasoning', difficulty: 2,
    type: 'visual-reasoning', display_mode: 'visual',
    question_text: 'Which option is the correct vertical reflection?',
    visual_type: 'reflection',
    visual_config: { shape: { shape: 'arrow', color: '#00e676', rotation: -30 }, axis: 'vertical' },
    visual_options: [
      { key: 'A', visual_type: 'shape', visual_config: { shape: 'arrow', color: '#00e676', rotation: 30   } },
      { key: 'B', visual_type: 'shape', visual_config: { shape: 'arrow', color: '#00e676', rotation: -30  } },
      { key: 'C', visual_type: 'shape', visual_config: { shape: 'arrow', color: '#00e676', rotation: 150  } },
      { key: 'D', visual_type: 'shape', visual_config: { shape: 'arrow', color: '#00e676', rotation: -150 } },
    ],
    options: ['30°', '-30° (same)', '150°', '-150°'],
    correct_answer: 'A',
    hint_logic: { default: 'A vertical mirror flips left and right. The angle reflects the other way across the vertical axis.' },
  },

  // ── Shape Net ───────────────────────────────────────────────────
  {
    id: 'r-35-net-001', grade: 5, topic: 'reasoning', difficulty: 2,
    type: 'mc', display_mode: 'visual',
    question_text: 'This net folds into which 3D shape?',
    visual_type: 'shape-net',
    visual_config: { netType: 'cube' },
    options: ['Cube', 'Pyramid', 'Cylinder', 'Triangular prism'],
    correct_answer: 'Cube',
    hint_logic: { default: 'A cube net has 6 equal square faces arranged in a cross pattern.' },
  },
  {
    id: 'r-35-net-002', grade: 5, topic: 'reasoning', difficulty: 3,
    type: 'mc', display_mode: 'visual',
    question_text: 'Which solid does this net create?',
    visual_type: 'shape-net',
    visual_config: { netType: 'pyramid' },
    options: ['Cube', 'Square pyramid', 'Triangular prism', 'Cone'],
    correct_answer: 'Square pyramid',
    hint_logic: { default: 'Count the faces: 1 square base + 4 triangles = square pyramid.' },
  },

  // ── Visual Analogy ──────────────────────────────────────────────
  {
    id: 'r-35-va-001', grade: 4, topic: 'reasoning', difficulty: 2,
    type: 'visual-reasoning', display_mode: 'visual',
    question_text: 'Shape A is to B as C is to...?',
    visual_type: 'visual-analogy',
    visual_config: {
      a: { shape: 'circle',   color: '#00e5ff', filled: true  },
      b: { shape: 'circle',   color: '#ff4081', filled: true  },
      c: { shape: 'pentagon', color: '#00e5ff', filled: true  },
    },
    visual_options: [
      { key: 'A', visual_type: 'shape', visual_config: { shape: 'pentagon', color: '#ff4081', filled: true  } },
      { key: 'B', visual_type: 'shape', visual_config: { shape: 'pentagon', color: '#00e5ff', filled: true  } },
      { key: 'C', visual_type: 'shape', visual_config: { shape: 'circle',   color: '#ff4081', filled: true  } },
      { key: 'D', visual_type: 'shape', visual_config: { shape: 'pentagon', color: '#ffd700', filled: true  } },
    ],
    options: ['Pink pentagon', 'Blue pentagon', 'Pink circle', 'Yellow pentagon'],
    correct_answer: 'A',
    hint_logic: { default: 'The shape stays the same but the colour changes from blue to pink. Apply that to C.' },
  },

  // ── Odd One Out ─────────────────────────────────────────────────
  {
    id: 'r-35-oo-001', grade: 3, topic: 'reasoning', difficulty: 1,
    type: 'mc', display_mode: 'visual',
    question_text: 'Which shape is the odd one out?',
    visual_type: 'odd-one-out',
    visual_config: {
      items: [
        { shape: 'pentagon', color: '#ce93d8' },
        { shape: 'hexagon',  color: '#ce93d8' },
        { shape: 'pentagon', color: '#ffd700' },
        { shape: 'pentagon', color: '#00e676' },
        { shape: 'pentagon', color: '#ff9800' },
      ],
      oddIndex: 1,
    },
    options: ['Shape 1', 'Shape 2', 'Shape 3', 'Shape 4'],
    correct_answer: 'Shape 2',
    hint_logic: { default: 'Count the sides. Most shapes have 5 sides. Which has 6?' },
  },
]
