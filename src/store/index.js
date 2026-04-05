import { create } from 'zustand'
import {
  getAllProfiles, createProfile, deleteProfile, getProfileById, updateProfileXP,
  getMastery, setMastery, recordAttempt, awardBadge, getStudentBadges,
  saveFlightLog, loadFlightLog, isStruggleZone, getFullProfile,
  calculateTopicMastery
} from '../db/index.js'
import { playCorrect, playWrong, playBadge, playLevelComplete, playLevelFailed, playStreak } from '../audio/SoundManager.js'

const SESSION_KEY = 'stellar-math-active-profile-id'

// ── Badge Definitions ─────────────────────────────────────────────
export const BADGES = {
  FIRST_LAUNCH:    { id: 'FIRST_LAUNCH',    name: 'First Launch',     icon: '🚀', desc: 'Completed your first question! You are now officially a Space Cadet.' },
  PERFECT_ORBIT:   { id: 'PERFECT_ORBIT',   name: 'Perfect Orbit',    icon: '⭐', desc: '5 correct in a row! Your calculations are as precise as a pulsar.' },
  PLANET_EXPLORER: { id: 'PLANET_EXPLORER', name: 'Planet Explorer',  icon: '🪐', desc: 'Completed a full planet! You have mapped every crater and canyon on this world.' },
  NEBULA_SURVIVOR: { id: 'NEBULA_SURVIVOR', name: 'Nebula Survivor',  icon: '🌌', desc: 'Passed a remediation level! You navigated the cosmic fog and emerged stronger.' },
  MATH_HERO:       { id: 'MATH_HERO',       name: 'Math Hero',        icon: '🦸', desc: 'Reached 100 XP! Your math powers are becoming legendary across the sector.' },
  STREAK_3:        { id: 'STREAK_3',        name: '3-Star Streak',    icon: '💫', desc: '3 correct answers in a row! You are building serious momentum.' },
  GALAXY_CONQUEROR: { id: 'GALAXY_CONQUEROR', name: 'Galaxy Conqueror', icon: '🌀', desc: 'Mastered all topics in a single galaxy! The entire system is under your command.' },
  SPEED_RACER:      { id: 'SPEED_RACER',      name: 'Speed Racer',      icon: '🏎️', desc: 'Finished a level in record time! Your brain is faster than a warp drive.' },
  PERSISTENCE_PAID_OFF: { id: 'PERSISTENCE_PAID_OFF', name: 'Persistence', icon: '🔋', desc: 'Completed a level after initial struggle. Your grit is your greatest engine.' },
  STAR_CHAMPION:    { id: 'STAR_CHAMPION',    name: 'Star Champion',    icon: '🏆', desc: 'Earned 500 XP total! You are a true champion of the cosmos.' },
}

const initialState = {
  // Auth / Multi-profile
  profiles: [],
  studentId: null,
  profile: null,

  // Navigation
  currentGrade: null,
  currentTopic: null,
  currentMode: 'profilePicker', // 'profilePicker' | 'dashboard' | 'galaxy' | 'planet' | 'level' | 'nebula' | 'profile'

  // Session
  sessionStreak: 0,
  sessionCorrect: 0,
  sessionTotal: 0,

  // Current level state
  currentQuestionIndex: 0,
  currentQuestions: [],
  levelFails: 0,        // times failed this planet
  levelStartTime: 0,    // track time for speed badges
  rocketProgress: 0,    // 0-100% rocket travel on level screen
  showCopilot: false,
  copilotMessage: '',
  newBadge: null,       // badge just awarded, for popup

  // Loaded data
  masteryMap: {},       // { 'grade-topic': 0-100 }
  earnedBadges: [],
  struggleTopics: [],

  // UI state
  isLoading: true,
  needsNameEntry: false, 
  feedbackState: null,   // null | 'correct' | 'wrong'
  testMode: false,       // if true, bypasses all locks/prerequisites
  isInitialized: false,
}

export const useStore = create((set, get) => ({
  ...initialState,

  toggleTestMode: () => set(s => ({ testMode: !s.testMode })),

  // ── Initialization ─────────────────────────────────────────────
  init: async () => {
    if (get().isInitialized) return
    console.log('Store init starting...')
    set({ isLoading: true })
    
    try {
      const profiles = await getAllProfiles()
      console.log('Profiles loaded from DB:', profiles)
      const savedId = localStorage.getItem(SESSION_KEY)
      console.log('Saved ID from localStorage:', savedId)
      
      if (savedId) {
        const profile = await getProfileById(Number(savedId))
        console.log('Restored profile:', profile)
        if (profile) {
          await get().selectProfile(profile.id)
          set({ profiles, isLoading: false, isInitialized: true })
          return
        }
      }

      set({ profiles, currentMode: 'profilePicker', isLoading: false, isInitialized: true })
      console.log('Mode set to profilePicker')
    } catch (err) {
      console.error('Store init error:', err)
      set({ isLoading: false, currentMode: 'profilePicker', isInitialized: true })
    }
  },

  // ── Profile Management ─────────────────────────────────────────
  addProfile: async (name, avatar, grade) => {
    console.log('Adding profile:', { name, avatar, grade })
    const newProfile = await createProfile({ name, avatar, currentGrade: grade })
    const profiles = await getAllProfiles()
    set({ profiles })
    return newProfile
  },

  removeProfile: async (id) => {
    console.log('Removing profile:', id)
    await deleteProfile(id)
    const profiles = await getAllProfiles()
    set({ profiles })
    if (get().studentId === id) {
      get().logout()
    }
  },

  selectProfile: async (id) => {
    console.log('Selecting profile:', id)
    set({ isLoading: true })
    try {
      const profile = await getProfileById(id)
      if (!profile) {
        console.warn('Profile not found for ID:', id)
        set({ isLoading: false })
        return
      }

      localStorage.setItem(SESSION_KEY, String(id))
      
      const { masteryRecords, badges, struggles } = await getFullProfile(id)
      const masteryMap = {}
      masteryRecords.forEach(r => { masteryMap[`${r.grade}-${r.topic}`] = r.mastery })
      const flightLog = await loadFlightLog(id)

      set({
        studentId: id,
        profile,
        currentGrade: profile.currentGrade || flightLog?.lastGrade || 3,
        masteryMap,
        earnedBadges: badges,
        struggleTopics: struggles,
        currentMode: 'dashboard',
        isLoading: false,
      })
      console.log('Profile selected successfully')
    } catch (err) {
      console.error('selectProfile error:', err)
      set({ isLoading: false })
    }
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY)
    set({
      studentId: null,
      profile: null,
      currentMode: 'profilePicker',
      masteryMap: {},
      earnedBadges: [],
      struggleTopics: [],
    })
  },

  // ── Navigation ─────────────────────────────────────────────────
  setMode: (currentMode) => set({ currentMode }),
  navigate: (mode, grade = null, topic = null) => {
    set({
      currentMode: mode,
      currentGrade: grade ?? get().currentGrade,
      currentTopic: topic ?? get().currentTopic,
      feedbackState: null,
    })
  },

  // ── Start a Level ──────────────────────────────────────────────
  startLevel: (questions, isNebula = false) => {
    set({
      currentQuestions: questions,
      currentQuestionIndex: 0,
      sessionCorrect: 0,
      sessionTotal: 0,
      rocketProgress: 0,
      feedbackState: null,
      showCopilot: false,
      copilotMessage: '',
      currentMode: isNebula ? 'nebula' : 'level',
      levelStartTime: Date.now(),
    })
  },

  // ── Submit Answer ──────────────────────────────────────────────
  submitAnswer: async (answer) => {
    const state = get()
    const { currentQuestions, currentQuestionIndex, studentId, currentGrade, currentTopic } = state
    const question = currentQuestions[currentQuestionIndex]
    if (!question) return

    const isCorrect = String(answer).trim().toLowerCase() ===
                      String(question.correct_answer).trim().toLowerCase()

    // Record attempt — wrapped so a DB error never silently kills feedback
    try {
      await recordAttempt(studentId, question.id, currentGrade, currentTopic, isCorrect)
    } catch (err) {
      console.error('recordAttempt failed:', err)
    }

    // XP
    if (isCorrect) {
      const xpGain = question.difficulty * 10
      await updateProfileXP(studentId, xpGain)
      const updatedProfile = { ...state.profile, xp: (state.profile?.xp || 0) + xpGain }
      const newStreak = state.sessionStreak + 1
      const newProgress = Math.min(100, state.rocketProgress + (100 / currentQuestions.length))

      set({
        feedbackState: 'correct',
        sessionStreak: newStreak,
        sessionCorrect: state.sessionCorrect + 1,
        sessionTotal: state.sessionTotal + 1,
        rocketProgress: newProgress,
        profile: updatedProfile,
        showCopilot: false,
      })

      // Sound feedback
      if (newStreak >= 3) playStreak(newStreak)
      else playCorrect()

      // Badge checks
      const badges = []
      if (state.sessionCorrect === 0) badges.push('FIRST_LAUNCH')
      if (newStreak === 3)            badges.push('STREAK_3')
      if (newStreak === 5)            badges.push('PERFECT_ORBIT')
      if (updatedProfile.xp >= 100)   badges.push('MATH_HERO')
      if (updatedProfile.xp >= 500)   badges.push('STAR_CHAMPION')
      for (const badgeId of badges) {
        const newly = await awardBadge(studentId, badgeId)
        if (newly) {
          playBadge()
          const updatedBadges = await getStudentBadges(studentId)
          set({ newBadge: BADGES[badgeId], earnedBadges: updatedBadges })
          break
        }
      }
    } else {
      // Wrong: show copilot hint
      const hint = question.hint_logic?.default || "Double-check your work, Captain!"
      playWrong()
      set({
        feedbackState: 'wrong',
        sessionStreak: 0,
        sessionTotal: state.sessionTotal + 1,
        showCopilot: true,
        copilotMessage: hint,
      })
    }

    // Update mastery
    const key = `${currentGrade}-${currentTopic}`
    const newMastery = await calculateTopicMastery(studentId, currentGrade, currentTopic)
    await setMastery(studentId, currentGrade, currentTopic, newMastery)
    set(s => ({ masteryMap: { ...s.masteryMap, [key]: newMastery } }))
  },

  // ── Advance to next question ───────────────────────────────────
  nextQuestion: () => {
    const { currentQuestionIndex, currentQuestions } = get()
    if (currentQuestionIndex + 1 < currentQuestions.length) {
      set({
        currentQuestionIndex: currentQuestionIndex + 1,
        feedbackState: null,
        showCopilot: false,
      })
    } else {
      // Level complete
      get().completeLevel()
    }
  },

  // ── Level complete ─────────────────────────────────────────────
  completeLevel: async () => {
    const { studentId, currentGrade, currentTopic, sessionCorrect, currentQuestions, levelFails, currentMode } = get()
    const isNebula = currentMode === 'nebula'
    const pct = (sessionCorrect / currentQuestions.length) * 100
    const passed = pct >= 60

    if (passed) {
      // Award planet badge
      playLevelComplete()
      const badgesToAward = []
      badgesToAward.push(isNebula ? 'NEBULA_SURVIVOR' : 'PLANET_EXPLORER')

      // Speed Racer check: < 60 seconds for a full 10-question level
      const duration = (Date.now() - get().levelStartTime) / 1000
      if (duration < 60 && currentQuestions.length >= 5) {
        badgesToAward.push('SPEED_RACER')
      }

      // Persistence check
      if (levelFails > 0) {
        badgesToAward.push('PERSISTENCE_PAID_OFF')
      }

      // Galaxy Conqueror check
      const { getAvailableTopics } = await import('../data/questions/index.js')
      const topics = getAvailableTopics(currentGrade)
      const allMastered = topics.every(t => {
        if (t === currentTopic) return pct >= 80 // use current pct as it's not yet in masteryMap
        return get().getMasteryForTopic(currentGrade, t) >= 80
      })
      if (allMastered && topics.length > 0) {
        badgesToAward.push('GALAXY_CONQUEROR')
      }

      for (const bId of badgesToAward) {
        const newly = await awardBadge(studentId, bId)
        if (newly) {
          playBadge()
          const updatedBadges = await getStudentBadges(studentId)
          set({ newBadge: BADGES[bId], earnedBadges: updatedBadges })
          // We only show one popup at a time, so break after first newly awarded for this turn
          // (They will still see it in profile)
          break
        }
      }
      
      set({ currentMode: 'levelComplete', levelFails: 0 })
      await saveFlightLog(studentId, { lastGrade: currentGrade, lastTopic: currentTopic })
    } else {
      playLevelFailed()
      const newFails = levelFails + 1
      set({ levelFails: newFails })
      if (newFails >= 2) {
        set({ currentMode: 'nebulaUnlocked' })
      } else {
        set({ currentMode: 'levelFailed' })
      }
    }
  },

  dismissBadge: () => set({ newBadge: null }),
  dismissCopilot: () => set({ showCopilot: false }),

  getMasteryForTopic: (grade, topic) => {
    return get().masteryMap[`${grade}-${topic}`] || 0
  },
}))
