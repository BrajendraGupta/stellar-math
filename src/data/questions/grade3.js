// Grade 3 — Triangulum Galaxy
// Multiplication Planet (Mars)
//
// manipulative_config rule:
//   Only add star-cubes when groups × perGroup ≤ 30 (practical to display).
//   groups  = number of equal groups in the problem (first factor)
//   perGroup = size of each group (second factor)

export const grade3Multiplication = [
  {
    id: 'g3-mult-001',
    grade: 3, topic: 'multiplication', subtopic: 'basic-facts',
    difficulty: 1, type: 'mc',
    question_text: 'A rocket has 3 fuel tanks. Each tank holds 4 canisters. How many canisters total?',
    display_mode: 'text',
    options: ['10', '12', '14', '7'],
    correct_answer: '12',
    hint_logic: {
      default: "Think of it as 3 groups of 4, Captain! Count: 4, 8, 12 🚀",
      common_errors: {
        '10': "Close! Try adding 4 three times: 4 + 4 + 4",
        '7':  "That's 3 + 4, not 3 × 4. Multiplication means equal groups!",
      },
    },
    manipulative: 'star-cubes',
    manipulative_config: { groups: 3, perGroup: 4 }, // 3×4=12 ✓
  },
  {
    id: 'g3-mult-002',
    grade: 3, topic: 'multiplication', subtopic: 'basic-facts',
    difficulty: 1, type: 'mc',
    question_text: 'Our space station has 5 corridors. Each corridor has 6 airlocks. How many airlocks total?',
    display_mode: 'text',
    options: ['11', '25', '30', '36'],
    correct_answer: '30',
    hint_logic: {
      default: "5 × 6 — try skip counting by 6: 6, 12, 18, 24, 30! ⭐",
      common_errors: {
        '11': "That's 5 + 6. Remember: × means groups, not adding!",
        '25': "That's 5 × 5. Count those 6s again, Cadet!",
        '36': "That's 6 × 6. We have 5 corridors, not 6!",
      },
    },
    manipulative: 'star-cubes',
    manipulative_config: { groups: 5, perGroup: 6 }, // 5×6=30 ✓
  },
  {
    id: 'g3-mult-003',
    grade: 3, topic: 'multiplication', subtopic: 'basic-facts',
    difficulty: 1, type: 'numeric',
    question_text: 'Mission Control sends 7 supply pods. Each pod has 3 oxygen tanks. What is 7 × 3?',
    display_mode: 'text',
    options: null,
    correct_answer: '21',
    hint_logic: {
      default: "Skip count by 3 seven times: 3, 6, 9, 12, 15, 18, 21! 🌟",
    },
    manipulative: 'star-cubes',
    manipulative_config: { groups: 7, perGroup: 3 }, // 7×3=21 ✓
  },
  {
    id: 'g3-mult-004',
    grade: 3, topic: 'multiplication', subtopic: 'basic-facts',
    difficulty: 2, type: 'mc',
    question_text: 'The alien crew has 4 shuttles. Each shuttle holds 8 astronauts. How many astronauts total?',
    display_mode: 'text',
    options: ['24', '32', '40', '12'],
    correct_answer: '32',
    hint_logic: {
      default: "4 × 8: think 4 × 4 = 16, then double it! 16 × 2 = 32 🛸",
      common_errors: {
        '24': "Try again! 4 × 6 = 24, but we have 8 astronauts per shuttle.",
        '40': "Close! That would be 5 × 8. We only have 4 shuttles.",
      },
    },
    // 4×8=32 — over limit, no manipulative
  },
  {
    id: 'g3-mult-005',
    grade: 3, topic: 'multiplication', subtopic: 'basic-facts',
    difficulty: 2, type: 'numeric',
    question_text: 'Planet Zorg has 9 moons. Each moon has 6 craters worth exploring. What is 9 × 6?',
    display_mode: 'text',
    options: null,
    correct_answer: '54',
    hint_logic: {
      default: "9 × 6: try 10 × 6 = 60, then subtract 6. 60 - 6 = 54! 🌕",
    },
    // 9×6=54 — over limit, no manipulative
  },
  {
    id: 'g3-mult-006',
    grade: 3, topic: 'multiplication', subtopic: 'word-problems',
    difficulty: 2, type: 'mc',
    question_text: 'Captain Zara arranges 6 rows of star crystals with 7 crystals in each row. How many crystals are there?',
    display_mode: 'text',
    options: ['35', '42', '48', '13'],
    correct_answer: '42',
    hint_logic: {
      default: "6 × 7 = 42. Remember: 7 × 6 is the same as 6 × 7! (Commutative property!) ✨",
      common_errors: {
        '35': "That's 5 × 7. Count the rows again — there are 6!",
        '48': "That's 6 × 8. Each row has 7 crystals, not 8.",
        '13': "That's 6 + 7. We need multiplication (equal groups)!",
      },
    },
    // 6×7=42 — over limit, no manipulative
  },
  {
    id: 'g3-mult-007',
    grade: 3, topic: 'multiplication', subtopic: 'basic-facts',
    difficulty: 2, type: 'mc',
    question_text: 'What is 8 × 4?',
    display_mode: 'equation',
    options: ['28', '32', '36', '24'],
    correct_answer: '32',
    hint_logic: {
      default: "8 × 4: double 4 three times! 4 → 8 → 16 → 32 🚀",
      common_errors: {
        '28': "That's 7 × 4. Add one more group of 4!",
        '36': "That's 9 × 4. We only need 8 groups!",
        '24': "That's 8 × 3. Add one more group of 4 to 24!",
      },
    },
    // 8×4=32 — over limit, no manipulative
  },
  {
    id: 'g3-mult-008',
    grade: 3, topic: 'multiplication', subtopic: 'basic-facts',
    difficulty: 3, type: 'numeric',
    question_text: 'The Galactic Council meets every 7 days. How many days in 8 council meetings?',
    display_mode: 'text',
    options: null,
    correct_answer: '56',
    hint_logic: {
      default: "7 × 8 = 56. A trick: 7 × 8 = 56 sounds like 5, 6, 7, 8! ⭐",
    },
    // 7×8=56 — over limit, no manipulative
  },
  {
    id: 'g3-mult-009',
    grade: 3, topic: 'multiplication', subtopic: 'word-problems',
    difficulty: 3, type: 'mc',
    question_text: 'A starship uses 9 energy cubes per warp jump. After 9 jumps, how many cubes have been used?',
    display_mode: 'text',
    options: ['72', '81', '63', '90'],
    correct_answer: '81',
    hint_logic: {
      default: "9 × 9 = 81. For any 9s fact: the digits always add to 9! (8+1=9) 🌌",
      common_errors: {
        '72': "That's 8 × 9. One more jump: 72 + 9 = 81!",
        '63': "That's 7 × 9. Two more jumps needed!",
        '90': "That's 10 × 9. One less jump! 90 - 9 = 81.",
      },
    },
    // 9×9=81 — over limit, no manipulative
  },
  {
    id: 'g3-mult-010',
    grade: 3, topic: 'multiplication', subtopic: 'missing-factor',
    difficulty: 3, type: 'mc',
    question_text: 'Our rocket needs __ fuel pods to travel 48 light-years (6 light-years per pod). What is 6 × __ = 48?',
    display_mode: 'text',
    options: ['6', '7', '8', '9'],
    correct_answer: '8',
    hint_logic: {
      default: "Think: what times 6 equals 48? Count by 6s until you reach 48! 🛸",
      common_errors: {
        '6': "6 × 6 = 36, not 48. Keep going!",
        '7': "6 × 7 = 42, not 48. One more pod needed!",
        '9': "6 × 9 = 54 — that's too many! Try 8.",
      },
    },
    // missing-factor — no manipulative
  },
]

// ── Grade 3 Division ──────────────────────────────────────────────
export const grade3Division = [
  {
    id: 'g3-div-001',
    grade: 3, topic: 'division', subtopic: 'basic-facts',
    difficulty: 1, type: 'mc',
    question_text: 'Commander Rex has 12 moon rocks to share equally among 3 crew members. How many does each get?',
    display_mode: 'text',
    options: ['3', '4', '5', '6'],
    correct_answer: '4',
    hint_logic: {
      default: "12 ÷ 3 = ? Think: 3 × ? = 12. Three groups of 4 = 12! 🌙",
      common_errors: {
        '3': "3 × 3 = 9, not 12. Try a bigger number!",
        '6': "3 × 6 = 18, too many! Try 4.",
      },
    },
    manipulative: 'star-cubes',
    manipulative_config: { groups: 3, perGroup: 4 }, // show 3 groups of 4 = 12 total
  },
  {
    id: 'g3-div-002',
    grade: 3, topic: 'division', subtopic: 'basic-facts',
    difficulty: 2, type: 'numeric',
    question_text: 'A shuttle carries 24 astronauts in rows of 6. How many rows are there? (24 ÷ 6 = ?)',
    display_mode: 'text',
    options: null,
    correct_answer: '4',
    hint_logic: {
      default: "6 × ? = 24. Skip count by 6: 6, 12, 18, 24. That's 4 steps! 🚀",
    },
    manipulative: 'star-cubes',
    manipulative_config: { groups: 4, perGroup: 6 },
  },
  {
    id: 'g3-div-003',
    grade: 3, topic: 'division', subtopic: 'basic-facts',
    difficulty: 1, type: 'mc',
    question_text: 'Captain Luna has 20 space crystals. She puts them into 4 equal bags. How many in each bag?',
    display_mode: 'text',
    options: ['4', '5', '6', '8'],
    correct_answer: '5',
    hint_logic: {
      default: "20 ÷ 4 = ? Think: 4 × ? = 20. 4 × 5 = 20! ✨",
      common_errors: { '4': "4 × 4 = 16, not 20. Try one more!", '8': "4 × 8 = 32 — that's too many crystals!" },
    },
    manipulative: 'star-cubes',
    manipulative_config: { groups: 4, perGroup: 5 },
  },
  {
    id: 'g3-div-004',
    grade: 3, topic: 'division', subtopic: 'basic-facts',
    difficulty: 1, type: 'mc',
    question_text: 'There are 15 planets to explore. 3 explorers share them equally. How many does each explore?',
    display_mode: 'text',
    options: ['3', '4', '5', '6'],
    correct_answer: '5',
    hint_logic: {
      default: "15 ÷ 3: think 3 × ? = 15. Skip count by 3: 3, 6, 9, 12, 15 — that's 5 jumps! 🪐",
    },
  },
  {
    id: 'g3-div-005',
    grade: 3, topic: 'division', subtopic: 'basic-facts',
    difficulty: 1, type: 'numeric',
    question_text: '18 ÷ 2 = ?',
    display_mode: 'equation',
    options: null,
    correct_answer: '9',
    hint_logic: { default: "2 × ? = 18. Count by 2s: 2, 4, 6, 8, 10, 12, 14, 16, 18 — that's 9 hops! 🚀" },
  },
  {
    id: 'g3-div-006',
    grade: 3, topic: 'division', subtopic: 'basic-facts',
    difficulty: 2, type: 'mc',
    question_text: 'A warp engine uses 7 fuel cells per hour. The spaceship has 42 fuel cells. How many hours can it run?',
    display_mode: 'text',
    options: ['5', '6', '7', '8'],
    correct_answer: '6',
    hint_logic: {
      default: "42 ÷ 7: think 7 × ? = 42. 7 × 6 = 42! ⚡",
      common_errors: { '5': "7 × 5 = 35, not enough! Add one more hour.", '7': "7 × 7 = 49, that's too many cells!" },
    },
  },
  {
    id: 'g3-div-007',
    grade: 3, topic: 'division', subtopic: 'basic-facts',
    difficulty: 2, type: 'numeric',
    question_text: '36 ÷ 9 = ?',
    display_mode: 'equation',
    options: null,
    correct_answer: '4',
    hint_logic: { default: "9 × ? = 36. Use the 9s trick: 9 × 4 = 36! (4 + 3 = 7... wait, try: 9×1=9, 9×2=18, 9×3=27, 9×4=36!) 🌟" },
  },
  {
    id: 'g3-div-008',
    grade: 3, topic: 'division', subtopic: 'word-problems',
    difficulty: 2, type: 'mc',
    question_text: 'The Galactic Library has 56 books split equally onto 8 shelves. How many books per shelf?',
    display_mode: 'text',
    options: ['6', '7', '8', '9'],
    correct_answer: '7',
    hint_logic: {
      default: "56 ÷ 8: think 8 × ? = 56. 8 × 7 = 56! 📚",
      common_errors: { '6': "8 × 6 = 48, not 56. Add one more!", '8': "8 × 8 = 64, too many! Go down one." },
    },
  },
  {
    id: 'g3-div-009',
    grade: 3, topic: 'division', subtopic: 'word-problems',
    difficulty: 3, type: 'numeric',
    question_text: 'A starship travels 72 light-years in 8 days. How many light-years per day?',
    display_mode: 'text',
    options: null,
    correct_answer: '9',
    hint_logic: { default: "72 ÷ 8: think 8 × ? = 72. 8 × 9 = 72! ⭐" },
  },
  {
    id: 'g3-div-010',
    grade: 3, topic: 'division', subtopic: 'missing-factor',
    difficulty: 3, type: 'mc',
    question_text: 'Mission Control packed 63 oxygen tanks into equal crates. Each crate holds 7 tanks. How many crates?',
    display_mode: 'text',
    options: ['7', '8', '9', '10'],
    correct_answer: '9',
    hint_logic: {
      default: "63 ÷ 7: count by 7s until you reach 63! 7, 14, 21, 28, 35, 42, 49, 56, 63 — that's 9 steps! 📦",
      common_errors: { '7': "7 × 7 = 49, not 63. Keep counting!", '8': "7 × 8 = 56, not 63. One more!" },
    },
  },
]

// ── Grade 3 Fractions ─────────────────────────────────────────────
export const grade3Fractions = [
  {
    id: 'g3-frac-001',
    grade: 3, topic: 'fractions', subtopic: 'basic',
    difficulty: 1, type: 'mc',
    question_text: 'Our space pizza is cut into 4 equal slices. The crew ate 1 slice. What fraction was eaten?',
    display_mode: 'text',
    options: ['1/2', '1/4', '1/3', '2/4'],
    correct_answer: '1/4',
    hint_logic: {
      default: "1 slice out of 4 total slices = 1/4. The bottom number is how many total pieces! 🍕",
    },
  },
  // ── Visual Fraction Questions ──────────────────────────────────
  {
    id: 'g3-frac-v01',
    grade: 3, topic: 'fractions', subtopic: 'visual',
    difficulty: 1, type: 'mc',
    question_text: 'Look at the pie chart! What fraction of the space fuel tank is filled?',
    display_mode: 'visual',
    visual_type: 'fraction-pie',
    visual_config: { total: 4, filled: 2, color: '#00e5ff' },
    options: ['1/4', '2/4', '3/4', '1/2'],
    correct_answer: '2/4',
    hint_logic: {
      default: "Count the colored slices (2) and total slices (4). That's 2/4! 🥧",
      common_errors: {
        '1/4': "Count again — there are 2 colored slices, not 1!",
        '1/2': "2/4 is the same as 1/2, but the answer here uses the pie's total slices!",
      },
    },
  },
  {
    id: 'g3-frac-v02',
    grade: 3, topic: 'fractions', subtopic: 'visual',
    difficulty: 1, type: 'mc',
    question_text: 'How much of this asteroid has been mined? Look at the colored sections!',
    display_mode: 'visual',
    visual_type: 'fraction-pie',
    visual_config: { total: 3, filled: 1, color: '#ff6b6b' },
    options: ['1/2', '1/3', '2/3', '3/3'],
    correct_answer: '1/3',
    hint_logic: {
      default: "The circle is split into 3 equal parts, and 1 is colored. That's 1/3! 🪨",
    },
  },
  {
    id: 'g3-frac-v03',
    grade: 3, topic: 'fractions', subtopic: 'visual',
    difficulty: 2, type: 'mc',
    question_text: 'The crew ate some of the space cake! What fraction is LEFT? (Look at the empty slices)',
    display_mode: 'visual',
    visual_type: 'fraction-pie',
    visual_config: { total: 8, filled: 5, color: '#69ff47' },
    options: ['3/8', '5/8', '4/8', '6/8'],
    correct_answer: '3/8',
    hint_logic: {
      default: "The colored part is what's been eaten (5/8). The empty part is what's LEFT: 8 - 5 = 3 slices, so 3/8!",
      common_errors: {
        '5/8': "That's the eaten part! The question asks what's LEFT (empty slices).",
      },
    },
  },
  {
    id: 'g3-frac-v04',
    grade: 3, topic: 'fractions', subtopic: 'visual',
    difficulty: 2, type: 'mc',
    question_text: 'Which fraction is bigger? Compare the two fuel tanks!',
    display_mode: 'visual',
    visual_type: 'fraction-compare',
    visual_config: {
      left: { total: 4, filled: 3, color: '#00e5ff', label: '3/4' },
      right: { total: 4, filled: 1, color: '#ff6b6b', label: '1/4' },
    },
    options: ['3/4', '1/4', 'They are equal'],
    correct_answer: '3/4',
    hint_logic: {
      default: "Look at the pies! The blue one has more filled in. 3/4 > 1/4! 🔵",
    },
  },
  {
    id: 'g3-frac-002',
    grade: 3, topic: 'fractions', subtopic: 'basic',
    difficulty: 1, type: 'mc',
    question_text: 'A space bar is cut into 3 equal pieces. The crew eats 2 pieces. What fraction did they eat?',
    display_mode: 'text',
    options: ['1/3', '2/3', '3/2', '1/2'],
    correct_answer: '2/3',
    hint_logic: { default: "2 pieces eaten out of 3 total = 2/3. Top number = pieces eaten! 🍫" },
  },
  {
    id: 'g3-frac-003',
    grade: 3, topic: 'fractions', subtopic: 'basic',
    difficulty: 1, type: 'mc',
    question_text: 'Which fraction means ONE HALF?',
    display_mode: 'text',
    options: ['1/4', '2/1', '1/2', '2/4'],
    correct_answer: '1/2',
    hint_logic: { default: "1/2 means 1 out of 2 equal parts — exactly half! ✂️" },
  },
  {
    id: 'g3-frac-004',
    grade: 3, topic: 'fractions', subtopic: 'number-line',
    difficulty: 2, type: 'mc',
    question_text: 'On a number line from 0 to 1, where does 3/4 sit?',
    display_mode: 'text',
    options: ['Closer to 0', 'Exactly at 1/2', 'Closer to 1', 'Past 1'],
    correct_answer: 'Closer to 1',
    hint_logic: { default: "3/4 is 75% of the way from 0 to 1 — past the midpoint, so closer to 1! 📍" },
  },
  {
    id: 'g3-frac-005',
    grade: 3, topic: 'fractions', subtopic: 'comparing',
    difficulty: 2, type: 'mc',
    question_text: 'Which fraction is SMALLER: 1/3 or 1/6?',
    display_mode: 'text',
    options: ['1/3', '1/6', 'They are equal'],
    correct_answer: '1/6',
    hint_logic: {
      default: "When the top is the same, bigger bottom = smaller fraction. 1/6 < 1/3 because sixths are tinier pieces! 🔬",
      common_errors: { '1/3': "Bigger denominator = smaller piece! 1/6 is actually smaller." },
    },
  },
  {
    id: 'g3-frac-006',
    grade: 3, topic: 'fractions', subtopic: 'comparing',
    difficulty: 2, type: 'mc',
    question_text: 'The alien crew ate 3/4 of a moon cheese. Commander Zek ate 2/4. Who ate more?',
    display_mode: 'text',
    options: ['The alien crew', 'Commander Zek', 'They ate the same amount'],
    correct_answer: 'The alien crew',
    hint_logic: { default: "Same denominator — just compare the tops! 3 > 2, so 3/4 > 2/4. 🧀" },
  },
  {
    id: 'g3-frac-007',
    grade: 3, topic: 'fractions', subtopic: 'whole-numbers',
    difficulty: 3, type: 'mc',
    question_text: 'Captain Nova has 2 whole space pies, each cut into 4 slices. She gave away 3 slices. What fraction is LEFT?',
    display_mode: 'text',
    options: ['5/4', '5/8', '3/8', '6/8'],
    correct_answer: '5/8',
    hint_logic: { default: "2 pies × 4 slices = 8 slices total. Gave away 3. 8 - 3 = 5 slices left = 5/8! 🥧" },
  },
  {
    id: 'g3-frac-008',
    grade: 3, topic: 'fractions', subtopic: 'word-problems',
    difficulty: 3, type: 'mc',
    question_text: '4/8 of the stars in the nebula are blue. Is that more than, less than, or equal to half?',
    display_mode: 'text',
    options: ['More than half', 'Less than half', 'Equal to half'],
    correct_answer: 'Equal to half',
    hint_logic: { default: "4/8 = 4 out of 8. Half of 8 is 4! So 4/8 = 1/2 exactly. ⚖️" },
  },
]

// ── Grade 3 Visual Multiplication (Array) ────────────────────────
export const grade3MultiplicationVisual = [
  {
    id: 'g3-mult-v01',
    grade: 3, topic: 'multiplication', subtopic: 'arrays',
    difficulty: 1, type: 'mc',
    question_text: 'Count the star crystals! How many are there in this array?',
    display_mode: 'visual',
    visual_type: 'array-dots',
    visual_config: { rows: 3, cols: 4, color: '#ffd700' },
    options: ['7', '10', '12', '14'],
    correct_answer: '12',
    hint_logic: {
      default: "Count the rows (3) and columns (4). 3 × 4 = 12 crystals! 💎",
      common_errors: {
        '7': "That's 3 + 4. With arrays, we MULTIPLY rows × columns!",
      },
    },
  },
  {
    id: 'g3-mult-v02',
    grade: 3, topic: 'multiplication', subtopic: 'arrays',
    difficulty: 1, type: 'mc',
    question_text: 'The space station has pods arranged in rows and columns. How many pods total?',
    display_mode: 'visual',
    visual_type: 'array-dots',
    visual_config: { rows: 2, cols: 5, color: '#00e5ff' },
    options: ['7', '8', '10', '12'],
    correct_answer: '10',
    hint_logic: {
      default: "2 rows × 5 columns = 10 pods! Skip count by 5: 5, 10! 🛸",
    },
  },
  {
    id: 'g3-mult-v03',
    grade: 3, topic: 'multiplication', subtopic: 'arrays',
    difficulty: 2, type: 'numeric',
    question_text: 'Write the multiplication fact for this array. How many stars total?',
    display_mode: 'visual',
    visual_type: 'array-dots',
    visual_config: { rows: 4, cols: 6, color: '#ff9ff3' },
    options: null,
    correct_answer: '24',
    hint_logic: {
      default: "Count: 4 rows × 6 columns. 4 × 6 = 24! ⭐",
    },
  },
  {
    id: 'g3-mult-v04',
    grade: 3, topic: 'multiplication', subtopic: 'arrays',
    difficulty: 2, type: 'mc',
    question_text: 'Which multiplication fact does this array show?',
    display_mode: 'visual',
    visual_type: 'array-dots',
    visual_config: { rows: 5, cols: 3, color: '#69ff47' },
    options: ['5 + 3 = 8', '5 × 3 = 15', '3 × 3 = 9', '5 × 5 = 25'],
    correct_answer: '5 × 3 = 15',
    hint_logic: {
      default: "Count the rows (5) and columns (3). The array shows 5 × 3 = 15! 🌟",
      common_errors: {
        '5 + 3 = 8': "Arrays show multiplication (×), not addition (+)!",
      },
    },
  },
]

// ── Grade 3 Division Visual ──────────────────────────────────────
export const grade3DivisionVisual = [
  {
    id: 'g3-div-v01',
    grade: 3, topic: 'division', subtopic: 'visual-sharing',
    difficulty: 1, type: 'mc',
    question_text: 'Share 12 space gems equally into 3 groups. Look at the groups — how many in each?',
    display_mode: 'visual',
    visual_type: 'array-dots',
    visual_config: { rows: 3, cols: 4, color: '#ffd700' },
    options: ['3', '4', '6', '9'],
    correct_answer: '4',
    hint_logic: {
      default: "12 gems ÷ 3 groups = 4 in each group. Each row has 4! 💎",
    },
  },
]

// ── Grade 3 Pattern Questions ────────────────────────────────────
export const grade3Patterns = [
  {
    id: 'g3-pat-001',
    grade: 3, topic: 'multiplication', subtopic: 'patterns',
    difficulty: 1, type: 'mc',
    question_text: 'What shape comes next in this pattern?',
    display_mode: 'visual',
    visual_type: 'pattern',
    visual_config: {
      pattern: [
        { shape: 'circle', colorIndex: 0 },
        { shape: 'square', colorIndex: 1 },
        { shape: 'circle', colorIndex: 0 },
        { shape: 'square', colorIndex: 1 },
        { shape: 'circle', colorIndex: 0 },
      ],
      missingIndex: 4,
    },
    options: ['Red Circle', 'Yellow Square', 'Blue Triangle', 'Green Star'],
    correct_answer: 'Red Circle',
    hint_logic: {
      default: "The pattern goes: circle, square, circle, square... What comes next? 🔴",
    },
  },
  {
    id: 'g3-pat-002',
    grade: 3, topic: 'multiplication', subtopic: 'patterns',
    difficulty: 2, type: 'mc',
    question_text: 'What shape is missing from the sequence?',
    display_mode: 'visual',
    visual_type: 'pattern',
    visual_config: {
      pattern: [
        { shape: 'triangle', colorIndex: 2 },
        { shape: 'star', colorIndex: 1 },
        { shape: 'diamond', colorIndex: 3 },
        { shape: 'triangle', colorIndex: 2 },
        { shape: 'star', colorIndex: 1 },
        { shape: 'diamond', colorIndex: 3 },
      ],
      missingIndex: 3,
    },
    options: ['Yellow Star', 'Blue Triangle', 'Green Diamond', 'Red Circle'],
    correct_answer: 'Blue Triangle',
    hint_logic: {
      default: "The pattern repeats every 3 shapes: triangle → star → diamond → triangle → ...",
    },
  },
]

// ── Questions with NumberLine manipulative ────────────────────────
export const grade3NumberLine = [
  {
    id: 'g3-nl-001',
    grade: 3, topic: 'multiplication', subtopic: 'skip-counting',
    difficulty: 1, type: 'mc',
    question_text: 'Use the number line! Skip count by 3 four times starting at 0. Where do you land?',
    display_mode: 'text',
    options: ['9', '12', '15', '7'],
    correct_answer: '12',
    hint_logic: {
      default: "Jump by 3s: 0 → 3 → 6 → 9 → 12. That's 4 × 3 = 12! 🦘",
    },
    manipulative: 'number-line',
    manipulative_config: {
      min: 0, max: 20, step: 1, highlight: 12,
      jumps: [
        { from: 0, to: 3, label: '+3', color: '#ffd700' },
        { from: 3, to: 6, label: '+3', color: '#ffd700' },
        { from: 6, to: 9, label: '+3', color: '#ffd700' },
        { from: 9, to: 12, label: '+3', color: '#ffd700' },
      ],
    },
  },
  {
    id: 'g3-nl-002',
    grade: 3, topic: 'multiplication', subtopic: 'skip-counting',
    difficulty: 2, type: 'numeric',
    question_text: 'Skip count by 5 three times from 0. What number do you reach?',
    display_mode: 'text',
    options: null,
    correct_answer: '15',
    hint_logic: {
      default: "Count the jumps on the number line: 0 → 5 → 10 → 15! ⭐",
    },
    manipulative: 'number-line',
    manipulative_config: {
      min: 0, max: 20, step: 1, highlight: 15,
      jumps: [
        { from: 0, to: 5, label: '+5', color: '#00e5ff' },
        { from: 5, to: 10, label: '+5', color: '#00e5ff' },
        { from: 10, to: 15, label: '+5', color: '#00e5ff' },
      ],
    },
  },
]

// ── Questions with FractionBar manipulative ──────────────────────
export const grade3FractionBar = [
  {
    id: 'g3-fb-001',
    grade: 3, topic: 'fractions', subtopic: 'comparing',
    difficulty: 2, type: 'mc',
    question_text: 'Use the fraction bars! Which fraction is larger: 2/3 or 1/4?',
    display_mode: 'text',
    options: ['2/3', '1/4', 'They are equal'],
    correct_answer: '2/3',
    hint_logic: {
      default: "Look at how much of each bar is filled. The bar with more color is the bigger fraction! 📊",
    },
    manipulative: 'fraction-bar',
    manipulative_config: {
      bars: [
        { total: 3, filled: 2, color: '#00e5ff', label: '2/3' },
        { total: 4, filled: 1, color: '#ff6b6b', label: '1/4' },
      ],
    },
  },
  {
    id: 'g3-fb-002',
    grade: 3, topic: 'fractions', subtopic: 'equivalent',
    difficulty: 2, type: 'mc',
    question_text: 'Look at both fraction bars. Are these fractions equal? 1/2 and 2/4',
    display_mode: 'text',
    options: ['Yes, they are equal!', 'No, 1/2 is bigger', 'No, 2/4 is bigger'],
    correct_answer: 'Yes, they are equal!',
    hint_logic: {
      default: "Both bars have the SAME amount filled! 1/2 = 2/4 — they are equivalent fractions! 🎯",
    },
    manipulative: 'fraction-bar',
    manipulative_config: {
      bars: [
        { total: 2, filled: 1, color: '#ffd700', label: '1/2' },
        { total: 4, filled: 2, color: '#69ff47', label: '2/4' },
      ],
    },
  },
  {
    id: 'g3-fb-003',
    grade: 3, topic: 'fractions', subtopic: 'basic',
    difficulty: 1, type: 'mc',
    question_text: 'Tap the fraction bar to show 3/4. How many segments should be colored?',
    display_mode: 'text',
    options: ['2', '3', '4', '1'],
    correct_answer: '3',
    hint_logic: {
      default: "3/4 means 3 out of 4 parts. Color 3 segments! 📊",
    },
    manipulative: 'fraction-bar',
    manipulative_config: {
      bars: [
        { total: 4, filled: 0, color: '#ff9ff3', label: '?/4' },
      ],
      interactive: true,
    },
  },
]

// ── Nebula (Remediation) — Simpler Multiplication ─────────────────
export const grade3MultiplicationNebula = [
  {
    id: 'g3-mult-neb-001',
    grade: 3, topic: 'multiplication', subtopic: 'nebula-basic',
    difficulty: 1, type: 'mc',
    question_text: 'Use the Star-Cubes below! How many stars are in 2 groups of 3?',
    display_mode: 'visual',
    options: ['3', '5', '6', '8'],
    correct_answer: '6',
    hint_logic: {
      default: "Count all the stars in both groups! 3 + 3 = 6 🌟",
    },
    manipulative: 'star-cubes',
    manipulative_config: { groups: 2, perGroup: 3 },
  },
  {
    id: 'g3-mult-neb-002',
    grade: 3, topic: 'multiplication', subtopic: 'nebula-basic',
    difficulty: 1, type: 'mc',
    question_text: 'Use the Star-Cubes! How many stars are in 3 groups of 2?',
    display_mode: 'visual',
    options: ['2', '5', '6', '9'],
    correct_answer: '6',
    hint_logic: {
      default: "Count all stars: 2 + 2 + 2 = 6! This is what 3 × 2 means! ⭐",
    },
    manipulative: 'star-cubes',
    manipulative_config: { groups: 3, perGroup: 2 },
  },
  {
    id: 'g3-mult-neb-003',
    grade: 3, topic: 'multiplication', subtopic: 'nebula-basic',
    difficulty: 1, type: 'mc',
    question_text: 'Use the Star-Cubes! 4 groups of 2 stars. Count them all!',
    display_mode: 'visual',
    options: ['4', '6', '8', '10'],
    correct_answer: '8',
    hint_logic: {
      default: "2 + 2 + 2 + 2 = 8. Great! That's the same as 4 × 2 = 8! 🚀",
    },
    manipulative: 'star-cubes',
    manipulative_config: { groups: 4, perGroup: 2 },
  },
]

// ── Grade 3 Time ──────────────────────────────────────────────────
export const grade3Time = [
  {
    id: 'g3-time-001',
    grade: 3, topic: 'time', subtopic: 'reading-clocks',
    difficulty: 1, type: 'mc',
    question_text: 'The mission clock shows the hour hand on 3 and the minute hand on 12. What time is it?',
    display_mode: 'text',
    options: ['12:03', '3:00', '3:30', '12:15'],
    correct_answer: '3:00',
    hint_logic: {
      default: "When the minute hand points to 12, it's exactly on the hour! Hour hand on 3 = 3:00 🕒",
      common_errors: {
        '12:03': "The hour hand tells the hour (3), the minute hand on 12 means :00!",
        '3:30': "3:30 means the minute hand is on the 6, not the 12.",
      },
    },
  },
  {
    id: 'g3-time-002',
    grade: 3, topic: 'time', subtopic: 'reading-clocks',
    difficulty: 1, type: 'mc',
    question_text: 'The space station clock shows 7:30. Where is the minute hand pointing?',
    display_mode: 'text',
    options: ['The 12', 'The 3', 'The 6', 'The 9'],
    correct_answer: 'The 6',
    hint_logic: {
      default: "At :30 (half past), the minute hand always points to the 6! ⏰",
      common_errors: {
        'The 12': "The 12 means :00 (on the hour), not :30.",
        'The 3': "The 3 means :15 (quarter past).",
      },
    },
  },
  {
    id: 'g3-time-003',
    grade: 3, topic: 'time', subtopic: 'elapsed-time',
    difficulty: 2, type: 'numeric',
    question_text: 'Commander Zara\'s rocket launched at 2:00 and landed at 2:45. How many minutes was the flight?',
    display_mode: 'text',
    options: null,
    correct_answer: '45',
    hint_logic: {
      default: "Count from 2:00 to 2:45 — that's 45 minutes! Elapsed time = end time − start time ⏱️",
    },
  },
  {
    id: 'g3-time-004',
    grade: 3, topic: 'time', subtopic: 'elapsed-time',
    difficulty: 2, type: 'mc',
    question_text: 'The space walk started at 10:15 and ended at 11:00. How long was the space walk?',
    display_mode: 'text',
    options: ['30 minutes', '45 minutes', '1 hour', '1 hour 15 minutes'],
    correct_answer: '45 minutes',
    hint_logic: {
      default: "10:15 to 11:00 — count up: 10:15 → 10:30 is 15 min, 10:30 → 11:00 is 30 min. 15 + 30 = 45! 🚀",
      common_errors: {
        '30 minutes': "Try again! 10:15 to 10:45 is 30 min, but we go all the way to 11:00.",
        '1 hour': "1 hour would be 10:15 to 11:15. We stop at 11:00!",
      },
    },
  },
  {
    id: 'g3-time-005',
    grade: 3, topic: 'time', subtopic: 'reading-clocks',
    difficulty: 1, type: 'mc',
    question_text: 'The warp drive countdown shows 15 minutes past 4. What time is that?',
    display_mode: 'text',
    options: ['4:05', '4:15', '4:50', '15:04'],
    correct_answer: '4:15',
    hint_logic: {
      default: "15 minutes past 4 = 4:15. The minute hand points to the 3 for :15! ⭐",
    },
  },
  {
    id: 'g3-time-006',
    grade: 3, topic: 'time', subtopic: 'elapsed-time',
    difficulty: 2, type: 'mc',
    question_text: 'Mission Control scheduled a repair at 9:00 AM. It takes 2 hours and 30 minutes. When does it finish?',
    display_mode: 'text',
    options: ['10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM'],
    correct_answer: '11:30 AM',
    hint_logic: {
      default: "9:00 + 2 hours = 11:00, then add 30 minutes = 11:30 AM! ⏰",
      common_errors: {
        '11:00 AM': "Don't forget the 30 extra minutes! 11:00 + :30 = 11:30.",
        '10:30 AM': "That's only 1 hour 30 minutes. We need 2 hours 30 minutes!",
      },
    },
  },
  {
    id: 'g3-time-007',
    grade: 3, topic: 'time', subtopic: 'units',
    difficulty: 1, type: 'mc',
    question_text: 'How many minutes are in 1 hour?',
    display_mode: 'text',
    options: ['24', '30', '60', '100'],
    correct_answer: '60',
    hint_logic: {
      default: "There are always 60 minutes in 1 hour! 60 seconds in a minute, 60 minutes in an hour. 🕐",
    },
  },
  {
    id: 'g3-time-008',
    grade: 3, topic: 'time', subtopic: 'units',
    difficulty: 2, type: 'numeric',
    question_text: 'The alien planet\'s day lasts 3 hours. How many minutes is that?',
    display_mode: 'text',
    options: null,
    correct_answer: '180',
    hint_logic: {
      default: "3 hours × 60 minutes per hour = 180 minutes! 🌍",
    },
  },
  {
    id: 'g3-time-009',
    grade: 3, topic: 'time', subtopic: 'reading-clocks',
    difficulty: 2, type: 'mc',
    question_text: 'The digital clock in the cockpit reads 8:45. What does this mean in words?',
    display_mode: 'text',
    options: [
      'Quarter past 8',
      'Half past 8',
      'Quarter to 9',
      'Quarter to 8',
    ],
    correct_answer: 'Quarter to 9',
    hint_logic: {
      default: "8:45 is 15 minutes BEFORE 9:00 — that's quarter to 9! 🕗",
      common_errors: {
        'Quarter past 8': "Quarter past 8 = 8:15. At 8:45 we're close to 9, not 15 min after 8.",
        'Half past 8': "Half past 8 = 8:30. We're 15 minutes further than that!",
      },
    },
  },
  {
    id: 'g3-time-010',
    grade: 3, topic: 'time', subtopic: 'elapsed-time',
    difficulty: 3, type: 'mc',
    question_text: 'A star map takes 1 hour 15 minutes to print. It started at 3:50 PM. When will it finish?',
    display_mode: 'text',
    options: ['4:50 PM', '5:00 PM', '5:05 PM', '5:15 PM'],
    correct_answer: '5:05 PM',
    hint_logic: {
      default: "3:50 + 1 hour = 4:50. Then 4:50 + 15 min = 5:05 PM! ⏱️",
      common_errors: {
        '4:50 PM': "Don't forget the extra 15 minutes! 4:50 + 15 = 5:05.",
        '5:00 PM': "3:50 + 1 hr 15 min: add 10 min to reach 4:00, then 1 hr = 5:00, then 5 more min = 5:05.",
      },
    },
  },
]

// ── All grade 3 questions aggregated ─────────────────────────────
export const grade3Questions = [
  ...grade3Multiplication,
  ...grade3MultiplicationVisual,
  ...grade3NumberLine,
  ...grade3Division,
  ...grade3DivisionVisual,
  ...grade3Fractions,
  ...grade3FractionBar,
  ...grade3Patterns,
  ...grade3Time,
]

export const grade3NebulaQuestions = [
  ...grade3MultiplicationNebula,
]
