import Dexie from 'dexie'

// ── Database Schema ───────────────────────────────────────────────
export const db = new Dexie('StellarMathDB')

db.version(2).stores({
  profiles:      '++id, name, avatar, currentGrade, createdAt',
  mastery:       '++id, [studentId+grade+topic], studentId',
  attempts:      '++id, studentId, questionId, grade, topic, correct, timestamp',
  struggleZones: '++id, [studentId+grade+topic], studentId',
  badges:        '++id, [studentId+badgeId], studentId',
  flightLog:     '++id, studentId',
})

db.version(3).stores({
  profiles:       '++id, name, avatar, currentGrade, createdAt',
  mastery:        '++id, [studentId+grade+topic], studentId',
  attempts:       '++id, studentId, questionId, grade, topic, correct, timestamp',
  struggleZones:  '++id, [studentId+grade+topic], studentId',
  badges:         '++id, [studentId+badgeId], studentId',
  flightLog:      '++id, studentId',
  // Feature: Daily streaks
  dailyActivity:  '++id, [studentId+date], studentId',
  streakState:    '++id, studentId',
  // Feature: Progress charts
  masteryHistory: '++id, [studentId+grade+topic], studentId',
  // Feature: Parent portal
  portalPins:     '++id, profileId',
})


// ── Helper: profile management ────────────────────────────────────
export async function getAllProfiles() {
  try {
    return await db.profiles.toArray()
  } catch (err) {
    console.error('Dexie getAllProfiles error:', err)
    return []
  }
}

export async function createProfile({ name, avatar, currentGrade }) {
  try {
    const id = await db.profiles.add({
      name,
      avatar,
      currentGrade,
      xp: 0,
      totalStars: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
    console.log('Profile created in DB with ID:', id)
    return await db.profiles.get(id)
  } catch (err) {
    console.error('Dexie createProfile error:', err)
    throw err
  }
}

export async function deleteProfile(id) {
  return db.profiles.delete(id)
}

export async function updateProfile(id, updates) {
  await db.profiles.update(id, { ...updates, updatedAt: Date.now() })
  return db.profiles.get(id)
}

export async function getProfileById(id) {
  return db.profiles.get(id)
}

export async function updateProfileXP(studentId, xpDelta) {
  const profile = await db.profiles.get(studentId)
  if (profile) {
    await db.profiles.update(studentId, {
      xp: (profile.xp || 0) + xpDelta,
      updatedAt: Date.now(),
    })
  }
}

// ── Mastery helpers ───────────────────────────────────────────────
export async function getMastery(studentId, grade, topic) {
  const rec = await db.mastery
    .where('[studentId+grade+topic]')
    .equals([studentId, grade, topic])
    .first()
  return rec ? rec.mastery : 0
}

export async function setMastery(studentId, grade, topic, mastery) {
  const existing = await db.mastery
    .where('[studentId+grade+topic]')
    .equals([studentId, grade, topic])
    .first()
  if (existing) {
    await db.mastery.update(existing.id, { mastery, updatedAt: Date.now() })
  } else {
    await db.mastery.add({ studentId, grade, topic, mastery, updatedAt: Date.now() })
  }

  // Write mastery history snapshot (throttled: max one per hour per topic)
  const lastHistory = await db.masteryHistory
    .where('[studentId+grade+topic]')
    .equals([studentId, grade, topic])
    .last()
  const oneHour = 60 * 60 * 1000
  if (!lastHistory || Date.now() - lastHistory.recordedAt > oneHour) {
    await db.masteryHistory.add({ studentId, grade, topic, mastery, recordedAt: Date.now() })
    // Prune to latest 30 records per topic
    const all = await db.masteryHistory
      .where('[studentId+grade+topic]')
      .equals([studentId, grade, topic])
      .toArray()
    if (all.length > 30) {
      const sorted = all.sort((a, b) => a.recordedAt - b.recordedAt)
      const toDelete = sorted.slice(0, all.length - 30).map(r => r.id)
      await db.masteryHistory.bulkDelete(toDelete)
    }
  }
}

// ── Mastery history (for charts) ──────────────────────────────────
export async function getMasteryHistory(studentId, grade, topic) {
  const records = await db.masteryHistory
    .where('[studentId+grade+topic]')
    .equals([studentId, grade, topic])
    .toArray()
  return records.sort((a, b) => a.recordedAt - b.recordedAt)
}

// ── Attempt recording ─────────────────────────────────────────────
export async function recordAttempt(studentId, questionId, grade, topic, correct) {
  await db.attempts.add({
    studentId, questionId, grade, topic, correct,
    timestamp: Date.now(),
  })
  // Check for struggle zone: 3+ wrong in last 5 for this topic
  const all = await db.attempts
    .where('studentId').equals(studentId)
    .and(a => a.grade === grade && a.topic === topic)
    .toArray()
  const recent = all.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5)
  const wrongCount = recent.filter(a => !a.correct).length
  if (wrongCount >= 3) {
    await markStruggleZone(studentId, grade, topic)
  }
}

// ── Struggle Zone ─────────────────────────────────────────────────
export async function markStruggleZone(studentId, grade, topic) {
  const existing = await db.struggleZones
    .where('[studentId+grade+topic]')
    .equals([studentId, grade, topic])
    .first()
  if (!existing) {
    await db.struggleZones.add({ studentId, grade, topic, markedAt: Date.now() })
  }
}

export async function isStruggleZone(studentId, grade, topic) {
  const rec = await db.struggleZones
    .where('[studentId+grade+topic]')
    .equals([studentId, grade, topic])
    .first()
  return !!rec
}

// ── Badges ────────────────────────────────────────────────────────
export async function awardBadge(studentId, badgeId) {
  const existing = await db.badges
    .where('[studentId+badgeId]')
    .equals([studentId, badgeId])
    .first()
  if (!existing) {
    await db.badges.add({ studentId, badgeId, awardedAt: Date.now() })
    return true
  }
  return false
}

export async function getStudentBadges(studentId) {
  return db.badges.where('studentId').equals(studentId).toArray()
}

// ── Flight Log (session state) ────────────────────────────────────
export async function saveFlightLog(studentId, logData) {
  const existing = await db.flightLog.where('studentId').equals(studentId).first()
  if (existing) {
    await db.flightLog.update(existing.id, { ...logData, updatedAt: Date.now() })
  } else {
    await db.flightLog.add({ studentId, ...logData, updatedAt: Date.now() })
  }
}

export async function loadFlightLog(studentId) {
  return db.flightLog.where('studentId').equals(studentId).first()
}

export async function calculateTopicMastery(studentId, grade, topic) {
  const attempts = await db.attempts
    .where('studentId').equals(studentId)
    .and(a => a.grade === grade && a.topic === topic)
    .toArray()
  if (attempts.length === 0) return 0
  const correct = attempts.filter(a => a.correct).length
  return Math.min(100, Math.round((correct / attempts.length) * 100))
}

// ── Full profile summary ──────────────────────────────────────────
export async function getFullProfile(studentId) {
  const profile = await db.profiles.get(studentId)
  const masteryRecords = await db.mastery.where('studentId').equals(studentId).toArray()
  const struggles = await db.struggleZones.where('studentId').equals(studentId).toArray()
  const badgeList = await getStudentBadges(studentId)
  const attemptCount = await db.attempts.where('studentId').equals(studentId).count()
  return { profile, masteryRecords, struggles, badges: badgeList, attemptCount }
}

// ── Daily Activity & Streaks ──────────────────────────────────────
function todayKey() {
  return new Date().toLocaleDateString('en-CA') // YYYY-MM-DD
}

export async function getTodayActivity(studentId) {
  return db.dailyActivity
    .where('[studentId+date]')
    .equals([studentId, todayKey()])
    .first()
}

export async function upsertDailyActivity(studentId, xpDelta) {
  const date = todayKey()
  const existing = await db.dailyActivity
    .where('[studentId+date]')
    .equals([studentId, date])
    .first()
  if (existing) {
    await db.dailyActivity.update(existing.id, {
      xpEarned: (existing.xpEarned || 0) + xpDelta,
      questionsAttempted: (existing.questionsAttempted || 0) + 1,
    })
  } else {
    await db.dailyActivity.add({
      studentId, date,
      xpEarned: xpDelta,
      questionsAttempted: 1,
      goalMet: false,
    })
  }
}

export async function markGoalMet(studentId) {
  const date = todayKey()
  const existing = await db.dailyActivity
    .where('[studentId+date]')
    .equals([studentId, date])
    .first()
  if (existing) {
    await db.dailyActivity.update(existing.id, { goalMet: true })
  }
}

export async function getLast14DaysActivity(studentId) {
  const results = []
  const now = new Date()
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const date = d.toLocaleDateString('en-CA')
    const rec = await db.dailyActivity
      .where('[studentId+date]')
      .equals([studentId, date])
      .first()
    results.push({ date, xpEarned: rec?.xpEarned || 0, goalMet: rec?.goalMet || false })
  }
  return results
}

export async function getStreakState(studentId) {
  return db.streakState.where('studentId').equals(studentId).first()
}

export async function checkAndUpdateStreak(studentId) {
  const today = todayKey()
  const yesterday = (() => {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    return d.toLocaleDateString('en-CA')
  })()

  const state = await db.streakState.where('studentId').equals(studentId).first()

  if (!state) {
    await db.streakState.add({
      studentId,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
      dailyXpGoal: 50,
    })
    return { currentStreak: 0, longestStreak: 0, isNewDay: true }
  }

  const { lastActiveDate, currentStreak, longestStreak } = state

  if (lastActiveDate === today) {
    // Already active today — no change
    return { currentStreak, longestStreak, isNewDay: false }
  }

  let newStreak
  if (lastActiveDate === yesterday) {
    newStreak = currentStreak + 1
  } else {
    newStreak = 1 // Gap > 1 day — reset
  }
  const newLongest = Math.max(longestStreak, newStreak)

  await db.streakState.update(state.id, {
    currentStreak: newStreak,
    longestStreak: newLongest,
    lastActiveDate: today,
  })

  return { currentStreak: newStreak, longestStreak: newLongest, isNewDay: true }
}

export async function getSessionAccuracyTrend(studentId, limit = 14) {
  const allAttempts = await db.attempts
    .where('studentId').equals(studentId)
    .toArray()

  const byDay = {}
  allAttempts.forEach(a => {
    const date = new Date(a.timestamp).toLocaleDateString('en-CA')
    if (!byDay[date]) byDay[date] = { correct: 0, total: 0 }
    byDay[date].total++
    if (a.correct) byDay[date].correct++
  })

  return Object.entries(byDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-limit)
    .map(([date, { correct, total }]) => ({
      date,
      accuracyPct: total > 0 ? Math.round((correct / total) * 100) : 0,
    }))
}

// ── Portal PIN ────────────────────────────────────────────────────
async function hashPin(pin) {
  const encoded = new TextEncoder().encode(String(pin))
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded)
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function hasPortalPin(profileId) {
  const rec = await db.portalPins.where('profileId').equals(profileId).first()
  return !!rec
}

export async function setPortalPin(profileId, pin) {
  const pinHash = await hashPin(pin)
  const existing = await db.portalPins.where('profileId').equals(profileId).first()
  if (existing) {
    await db.portalPins.update(existing.id, { pinHash })
  } else {
    await db.portalPins.add({ profileId, pinHash })
  }
}

export async function verifyPortalPin(profileId, pin) {
  const rec = await db.portalPins.where('profileId').equals(profileId).first()
  if (!rec) return false
  const pinHash = await hashPin(pin)
  return pinHash === rec.pinHash
}
