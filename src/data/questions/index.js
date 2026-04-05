import { grade1Questions } from './grade1.js'
import { grade2Questions } from './grade2.js'
import { grade3Questions, grade3NebulaQuestions } from './grade3.js'
import { grade4Questions } from './grade4.js'
import { grade5Questions } from './grade5.js'

// Question registry — add grades as you expand content
const QUESTION_BANK = {
  1: {
    counting:    grade1Questions.filter(q => q.topic === 'counting'),
    addition:    grade1Questions.filter(q => q.topic === 'addition'),
    subtraction: grade1Questions.filter(q => q.topic === 'subtraction'),
    shapes:      grade1Questions.filter(q => q.topic === 'shapes'),
  },
  2: {
    addition:    grade2Questions.filter(q => q.topic === 'addition'),
    subtraction: grade2Questions.filter(q => q.topic === 'subtraction'),
    'place-value': grade2Questions.filter(q => q.topic === 'place-value'),
    measurement: grade2Questions.filter(q => q.topic === 'measurement'),
  },
  3: {
    multiplication: grade3Questions.filter(q => q.topic === 'multiplication'),
    division:       grade3Questions.filter(q => q.topic === 'division'),
    fractions:      grade3Questions.filter(q => q.topic === 'fractions'),
    time:           grade3Questions.filter(q => q.topic === 'time'),
  },
  4: {
    multiplication: grade4Questions.filter(q => q.topic === 'multiplication'),
    division:       grade4Questions.filter(q => q.topic === 'division'),
    fractions:      grade4Questions.filter(q => q.topic === 'fractions'),
    decimals:       grade4Questions.filter(q => q.topic === 'decimals'),
  },
  5: {
    fractions:      grade5Questions.filter(q => q.topic === 'fractions'),
    decimals:       grade5Questions.filter(q => q.topic === 'decimals'),
    geometry:       grade5Questions.filter(q => q.topic === 'geometry'),
    data:           grade5Questions.filter(q => q.topic === 'data'),
  },
}

const NEBULA_BANK = {
  3: {
    multiplication: grade3NebulaQuestions,
  },
}

/**
 * Adaptive question selection — adjusts difficulty based on mastery and struggle state.
 *
 * @param {number} grade
 * @param {string} topic
 * @param {number} count       — how many questions to return
 * @param {number} mastery     — 0-100 current mastery for this topic
 * @param {boolean} isStruggle — whether this topic is in the struggle zone
 */
export function getQuestionsForLevel(grade, topic, count = 10, mastery = 0, isStruggle = false) {
  const pool = QUESTION_BANK[grade]?.[topic] || []
  if (pool.length === 0) return []

  // Determine difficulty weights based on mastery
  let weights
  if (isStruggle || mastery < 40) {
    // Mostly Easy
    weights = { 1: 5, 2: 1, 3: 0 }
  } else if (mastery < 80) {
    // Mostly Medium
    weights = { 1: 1, 2: 5, 3: 1 }
  } else {
    // Mostly Hard
    weights = { 1: 0, 2: 1, 3: 5 }
  }

  // Score each question by its difficulty weight
  const scored = pool.map(q => ({
    question: q,
    weight: weights[q.difficulty] || 1,
  }))

  // Weighted shuffle: higher weight = more likely to be picked
  const selected = []
  const remaining = [...scored]

  while (selected.length < count && remaining.length > 0) {
    const totalWeight = remaining.reduce((sum, s) => sum + s.weight, 0)
    if (totalWeight === 0) {
      // All weights zero — fall back to random from remaining
      const idx = Math.floor(Math.random() * remaining.length)
      selected.push(remaining.splice(idx, 1)[0].question)
      continue
    }
    let r = Math.random() * totalWeight
    for (let i = 0; i < remaining.length; i++) {
      r -= remaining[i].weight
      if (r <= 0) {
        selected.push(remaining.splice(i, 1)[0].question)
        break
      }
    }
  }

  // Final shuffle so order isn't predictable
  return selected.sort(() => Math.random() - 0.5)
}

export function getNebulaQuestions(grade, topic) {
  return NEBULA_BANK[grade]?.[topic] || []
}

export function getAvailableTopics(grade) {
  return Object.keys(QUESTION_BANK[grade] || {})
}

export function getAvailableGrades() {
  return Object.keys(QUESTION_BANK).map(Number)
}
