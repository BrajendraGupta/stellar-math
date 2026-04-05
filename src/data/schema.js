/**
 * Stellar Math — Master Question Schema
 *
 * Phase 1: Static JSON library
 * Phase 2: Template-based (procedural) generation supported via `template` field
 *
 * Question Object Shape:
 * {
 *   id:             string       — unique identifier, e.g. "g3-mult-001"
 *   grade:          number       — 1–10
 *   topic:          string       — e.g. "multiplication", "algebra", "geometry"
 *   subtopic:       string?      — optional finer grouping
 *   difficulty:     1|2|3        — 1=easy, 2=medium, 3=hard (also XP multiplier)
 *   type:           "mc"|"numeric" — multiple-choice or numeric input
 *   question_text:  string       — the question as shown to student
 *   display_mode:   "text"|"equation"|"visual" — how to render question
 *   options:        string[]?    — for mc type: [A, B, C, D]
 *   correct_answer: string       — for mc: "A"/"B"/"C"/"D"; for numeric: the number string
 *   hint_logic: {
 *     default:      string       — generic copilot hint
 *     common_errors?: {
 *       [wrongAnswer]: string    — specific hint for a known wrong answer
 *     }
 *   }
 *   manipulative:   string?      — "star-cubes"|"gravity-scale"|"coordinate-plane"|null
 *   template?: {                 — Phase 2: procedural generation
 *     type:         "arithmetic"|"equation"|"word-problem"
 *     variables:    { [varName]: { min, max, step? } }
 *     question_template: string  — e.g. "What is {{a}} × {{b}}?"
 *     answer_expr:  string       — e.g. "a * b"
 *   }
 * }
 */

export const TOPICS = {
  1:  ['counting', 'addition', 'subtraction', 'shapes'],
  2:  ['addition', 'subtraction', 'place-value', 'measurement'],
  3:  ['multiplication', 'division', 'fractions', 'time'],
  4:  ['multiplication', 'division', 'fractions', 'decimals'],
  5:  ['fractions', 'decimals', 'geometry', 'data'],
  6:  ['ratios', 'percentages', 'integers', 'expressions'],
  7:  ['algebra', 'geometry', 'statistics', 'proportions'],
  8:  ['linear-equations', 'functions', 'geometry', 'statistics'],
  9:  ['quadratics', 'polynomials', 'trigonometry', 'statistics'],
  10: ['calculus-intro', 'logarithms', 'advanced-geometry', 'probability'],
}

export const TOPIC_DISPLAY = {
  'counting':          { name: 'Counting Cosmos',      color: '#ff9800', planet: 'Mercury' },
  'addition':          { name: 'Addition Asteroid',    color: '#4caf50', planet: 'Venus' },
  'subtraction':       { name: 'Subtraction Station',  color: '#2196f3', planet: 'Earth' },
  'multiplication':    { name: 'Multiplication Moon',  color: '#9c27b0', planet: 'Mars' },
  'division':          { name: 'Division Dwarf',       color: '#f44336', planet: 'Jupiter' },
  'fractions':         { name: 'Fraction Frontier',    color: '#00bcd4', planet: 'Saturn' },
  'decimals':          { name: 'Decimal Deep-Space',   color: '#ffeb3b', planet: 'Io' },
  'geometry':          { name: 'Geometry Galaxy',      color: '#3f51b5', planet: 'Neptune' },
  'data':              { name: 'Data Drifter',         color: '#607d8b', planet: 'Pluto' },
  'place-value':       { name: 'Place-Value Pulsar',   color: '#795548', planet: 'Titan' },
  'measurement':       { name: 'Measurement Meteor',   color: '#8bc34a', planet: 'Europa' },
  'time':              { name: 'Time Traveler',        color: '#ff5722', planet: 'Ganymede' },
  'algebra':           { name: 'Algebra Andromeda',    color: '#e91e63', planet: 'Uranus' },
  'linear-equations':  { name: 'Linear Nebula',        color: '#009688', planet: 'Kepler' },
  'quadratics':        { name: 'Quadratic Quasar',     color: '#ff5722', planet: 'Proxima' },
  'shapes':            { name: 'Geometry Gems',        color: '#ff4081', planet: 'Venus-Moon' },
  'ratios':            { name: 'Ratio Ring',           color: '#cddc39', planet: 'Saturn-Ring' },
  'nebula':            { name: 'Cosmic Nebula',        color: '#ce93d8', planet: 'Nebula' },
}

/**
 * Prerequisite tree: topic -> { requires, masteryThreshold }
 * A topic is unlocked when all prerequisites meet the mastery threshold.
 * Topics with no entry in PREREQUISITES are always unlocked (if they have content).
 */
export const PREREQUISITES = {
  // Grade 3
  'multiplication': { requires: [], masteryThreshold: 0 },       // always unlocked
  'division':       { requires: ['multiplication'], masteryThreshold: 50 },
  'fractions':      { requires: ['division'], masteryThreshold: 40 },
  'time':           { requires: ['multiplication'], masteryThreshold: 50 },

  // Grade 4
  'decimals':       { requires: ['fractions'], masteryThreshold: 60 },

  // Grade 5+
  'geometry':       { requires: ['fractions'], masteryThreshold: 50 },
  'ratios':         { requires: ['fractions', 'decimals'], masteryThreshold: 60 },
  'algebra':        { requires: ['ratios'], masteryThreshold: 60 },
}

/** Minimum mastery across ALL topics in a grade to unlock the next grade */
export const GRADE_UNLOCK_THRESHOLD = 60

export const GRADE_GALAXIES = {
  1:  { name: 'Milky Way',      color: '#4fc3f7', description: 'The home galaxy — where every explorer begins!' },
  2:  { name: 'Andromeda',      color: '#81c784', description: 'The neighboring giant — addition and subtraction masters!' },
  3:  { name: 'Triangulum',     color: '#ce93d8', description: 'The triangle galaxy — multiplication and division!' },
  4:  { name: 'Sombrero',       color: '#ffb74d', description: 'Fractions and decimals in the hat-shaped nebula!' },
  5:  { name: 'Whirlpool',      color: '#4db6ac', description: 'Swirling with geometry and data analysis!' },
  6:  { name: 'Cartwheel',      color: '#f06292', description: 'Ratios and percentages spin this galaxy!' },
  7:  { name: 'Black Eye',      color: '#7986cb', description: 'Algebra lurks in the shadows here!' },
  8:  { name: 'Pinwheel',       color: '#4dd0e1', description: 'Linear equations map these spiral arms!' },
  9:  { name: 'Antennae',       color: '#aed581', description: 'Two galaxies colliding — quadratics meets trig!' },
  10: { name: 'Tadpole',        color: '#ff8a65', description: 'The edge of the universe — calculus and beyond!' },
}
