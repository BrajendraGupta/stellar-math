import { create } from 'zustand'
import {
  getAllProfiles, createProfile, deleteProfile, getProfileById, updateProfileXP,
  getMastery, setMastery, recordAttempt, awardBadge, getStudentBadges,
  saveFlightLog, loadFlightLog, isStruggleZone, getFullProfile,
  calculateTopicMastery,
  checkAndUpdateStreak, getStreakState, getTodayActivity, upsertDailyActivity, markGoalMet,
  verifyPortalPin, hasPortalPin,
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
  STREAK_7:         { id: 'STREAK_7',         name: '7-Day Streak',     icon: '🔥', desc: '7 days in a row! Your consistency is as reliable as a pulsar.' },
  STREAK_30:        { id: 'STREAK_30',        name: '30-Day Streak',    icon: '🌟', desc: '30 days in a row! You are a legend of the cosmos.' },
  MINDS_EYE:        { id: 'MINDS_EYE',        name: "Mind's Eye",       icon: '🧠', desc: 'Mastered the Mind Maze at 80%+! Your spatial reasoning is out of this world.' },
  PATTERN_MASTER:   { id: 'PATTERN_MASTER',   name: 'Pattern Master',   icon: '🔷', desc: '10 reasoning questions correct in a row! You see patterns no one else can.' },
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

  // Streak & daily goals
  currentStreak: 0,
  longestStreak: 0,
  todayXpEarned: 0,
  dailyXpGoal: 50,
  goalMetToday: false,

  // Portal
  portalAuthenticated: false,

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

      // Load streak + daily activity
      const streakData = await checkAndUpdateStreak(id)
      const todayActivity = await getTodayActivity(id)
      const streakState = await getStreakState(id)
      const dailyXpGoal = streakState?.dailyXpGoal || 50
      const todayXpEarned = todayActivity?.xpEarned || 0

      set({
        studentId: id,
        profile,
        currentGrade: profile.currentGrade || flightLog?.lastGrade || 3,
        masteryMap,
        earnedBadges: badges,
        struggleTopics: struggles,
        currentMode: 'dashboard',
        isLoading: false,
        currentStreak: streakData.currentStreak,
        longestStreak: streakData.longestStreak,
        todayXpEarned,
        dailyXpGoal,
        goalMetToday: todayXpEarned >= dailyXpGoal,
        portalAuthenticated: false,
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
      portalAuthenticated: false,
      currentStreak: 0,
      longestStreak: 0,
      todayXpEarned: 0,
      goalMetToday: false,
    })
  },

  // ── Portal ──────────────────────────────────────────────────────
  enterPortal: async (profileId, pin) => {
    const ok = await verifyPortalPin(profileId, pin)
    if (ok) {
      set({ portalAuthenticated: true, currentMode: 'portal' })
      return true
    }
    return false
  },

  exitPortal: () => set({ portalAuthenticated: false, currentMode: 'dashboard' }),

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
  submitAnswer: (answer) => {
    const state = get()
    const { currentQuestions, currentQuestionIndex, studentId, currentGrade, currentTopic } = state
    const question = currentQuestions[currentQuestionIndex]
    if (!question) return

    const isCorrect = String(answer).trim().toLowerCase() ===
                      String(question.correct_answer).trim().toLowerCase()

    // ── Update UI immediately so mobile doesn't freeze ──────────────
    if (isCorrect) {
      const xpGain = question.difficulty * 10
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

      if (newStreak >= 3) playStreak(newStreak)
      else playCorrect()

      // ── DB writes in background — never block the UI ────────────
      ;(async () => {
        try {
          await recordAttempt(studentId, question.id, currentGrade, currentTopic, isCorrect)
        } catch (err) {
          console.error('recordAttempt failed:', err)
        }

        try {
          await updateProfileXP(studentId, xpGain)
        } catch (err) {
          console.error('updateProfileXP failed:', err)
        }

        try {
          await upsertDailyActivity(studentId, xpGain)
          const newTodayXp = (state.todayXpEarned || 0) + xpGain
          const wasGoalMet = state.goalMetToday
          const isGoalNowMet = newTodayXp >= state.dailyXpGoal
          if (isGoalNowMet && !wasGoalMet) {
            await markGoalMet(studentId)
            const streakResult = await checkAndUpdateStreak(studentId)
            set({
              todayXpEarned: newTodayXp,
              goalMetToday: true,
              currentStreak: streakResult.currentStreak,
              longestStreak: streakResult.longestStreak,
            })
          } else {
            set({ todayXpEarned: newTodayXp })
          }
        } catch (err) {
          console.error('daily activity update failed:', err)
        }

        // Badge checks
        try {
          const newStreak = get().sessionStreak
          const updatedXp = get().profile?.xp || 0
          const badges = []
          if (state.sessionCorrect === 0)    badges.push('FIRST_LAUNCH')
          if (newStreak === 3)               badges.push('STREAK_3')
          if (newStreak === 5)               badges.push('PERFECT_ORBIT')
          if (newStreak === 10 && currentTopic === 'reasoning') badges.push('PATTERN_MASTER')
          if (updatedXp >= 100)              badges.push('MATH_HERO')
          if (updatedXp >= 500)              badges.push('STAR_CHAMPION')
          const cs = get().currentStreak
          if (cs >= 7)  badges.push('STREAK_7')
          if (cs >= 30) badges.push('STREAK_30')
          for (const badgeId of badges) {
            const newly = await awardBadge(studentId, badgeId)
            if (newly) {
              playBadge()
              const updatedBadges = await getStudentBadges(studentId)
              set({ newBadge: BADGES[badgeId], earnedBadges: updatedBadges })
              break
            }
          }
        } catch (err) {
          console.error('badge check failed:', err)
        }

        // Update mastery
        try {
          const key = `${currentGrade}-${currentTopic}`
          const newMastery = await calculateTopicMastery(studentId, currentGrade, currentTopic)
          await setMastery(studentId, currentGrade, currentTopic, newMastery)
          set(s => ({ masteryMap: { ...s.masteryMap, [key]: newMastery } }))
        } catch (err) {
          console.error('mastery update failed:', err)
        }
      })()
    } else {
      // Wrong: show copilot hint immediately
      const hint = question.hint_logic?.default || "Double-check your work, Captain!"
      playWrong()
      set({
        feedbackState: 'wrong',
        sessionStreak: 0,
        sessionTotal: state.sessionTotal + 1,
        showCopilot: true,
        copilotMessage: hint,
      })

      // DB writes in background
      ;(async () => {
        try {
          await recordAttempt(studentId, question.id, currentGrade, currentTopic, false)
        } catch (err) {
          console.error('recordAttempt failed:', err)
        }
        try {
          const key = `${currentGrade}-${currentTopic}`
          const newMastery = await calculateTopicMastery(studentId, currentGrade, currentTopic)
          await setMastery(studentId, currentGrade, currentTopic, newMastery)
          set(s => ({ masteryMap: { ...s.masteryMap, [key]: newMastery } }))
        } catch (err) {
          console.error('mastery update failed:', err)
        }
      })()
    }
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
        if (t === currentTopic) return pct >= 80
        return get().getMasteryForTopic(currentGrade, t) >= 80
      })
      if (allMastered && topics.length > 0) {
        badgesToAward.push('GALAXY_CONQUEROR')
      }

      // Mind's Eye: mastered reasoning topic at 80%+
      if (currentTopic === 'reasoning' && pct >= 80) {
        badgesToAward.push('MINDS_EYE')
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
