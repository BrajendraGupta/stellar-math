import Dexie from 'dexie'

// ── Database Schema ───────────────────────────────────────────────
export const db = new Dexie('StellarMathDB')

db.version(2).stores({
  // Student profile: one record per student
  profiles: '++id, name, avatar, currentGrade, createdAt',

  // Skill mastery per topic: (studentId, grade, topic) -> mastery 0-100
  mastery: '++id, [studentId+grade+topic], studentId',

  // Per-question attempt history
  attempts: '++id, studentId, questionId, grade, topic, correct, timestamp',

  // Struggle zones: topics where user missed >3 consecutive
  struggleZones: '++id, [studentId+grade+topic], studentId',

  // Earned badges
  badges: '++id, [studentId+badgeId], studentId',

  // Flight log: current session state
  flightLog: '++id, studentId',
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
}

// ── Attempt recording ─────────────────────────────────────────────
export async function recordAttempt(studentId, questionId, grade, topic, correct) {
  await db.attempts.add({
    studentId, questionId, grade, topic, correct,
    timestamp: Date.now(),
  })
  // Check for struggle zone: 3+ wrong in last 5 for this topic
  // Use single-field index (studentId) + in-memory filter — no compound index needed on attempts
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
    return true // newly awarded
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
