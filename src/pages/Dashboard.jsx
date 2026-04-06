import React, { useState } from 'react'
import { useStore } from '../store/index.js'
import { GRADE_GALAXIES, TOPICS, GRADE_UNLOCK_THRESHOLD } from '../data/schema.js'
import { getAvailableTopics } from '../data/questions/index.js'
import StreakBadge from '../components/ui/StreakBadge.jsx'

export default function Dashboard() {
  // All hooks must be called unconditionally — before any early returns
  const { profile, navigate, logout, isLoading, getMasteryForTopic, testMode, toggleTestMode } = useStore()
  const grade = useStore(s => s.currentGrade) || 3
  const currentStreak  = useStore(s => s.currentStreak)
  const todayXpEarned  = useStore(s => s.todayXpEarned)
  const dailyXpGoal    = useStore(s => s.dailyXpGoal)
  const goalMetToday   = useStore(s => s.goalMetToday)

  const galaxy = GRADE_GALAXIES[grade] || GRADE_GALAXIES[3]

  if (isLoading) {
    return (
      <div className="fill flex-center flex-col gap-md" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '3rem', animation: 'spin-slow 2s linear infinite' }}>🚀</div>
        <p style={{ color: 'var(--comet-cyan)', fontWeight: 700, letterSpacing: '0.1em' }}>
          INITIALIZING LAUNCH SEQUENCE...
        </p>
      </div>
    )
  }

  const xp = profile?.xp || 0

  return (
    <div className="fill flex-col mobile-pad" style={{ position: 'relative', zIndex: 1, overflow: 'auto', padding: '24px 32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ 
            width: 48, height: 48, borderRadius: '50%', background: 'var(--nebula-purple)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
          }}>
            {profile?.avatar || '🚀'}
          </div>
          <div>
            <h1 style={{
              fontSize: '1.8rem', fontWeight: 900,
              background: 'linear-gradient(90deg, var(--comet-cyan), var(--nebula-purple))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>STELLAR MATH</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Welcome back, Captain {profile?.name || 'Cadet'} 👋
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={logout} className="btn btn-ghost" style={{ fontSize: '0.7rem' }}>
            🔄 Switch Profile
          </button>
          <button
            onClick={toggleTestMode}
            className="btn btn-ghost"
            style={{
              fontSize: '0.7rem', color: testMode ? 'var(--star-yellow)' : 'var(--text-muted)',
              border: `1px solid ${testMode ? 'var(--star-yellow)' : 'rgba(255,255,255,0.1)'}`
            }}
          >
            {testMode ? '🛡️ TEST MODE ON' : '🚀 TEST MODE OFF'}
          </button>
          <div className="xp-chip">⭐ {xp} XP</div>
        </div>
      </div>

      {/* Streak & daily goal */}
      <div className="glass-card" style={{
        padding: '16px 24px', marginBottom: 20,
        display: 'flex', alignItems: 'center', gap: 24,
      }}>
        <StreakBadge
          streak={currentStreak}
          goalPct={dailyXpGoal > 0 ? Math.min(100, (todayXpEarned / dailyXpGoal) * 100) : 0}
          size="md"
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
            Daily Goal
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, height: 8, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 8,
              width: `${Math.min(100, dailyXpGoal > 0 ? (todayXpEarned / dailyXpGoal) * 100 : 0)}%`,
              background: goalMetToday
                ? 'linear-gradient(90deg, var(--planet-green), #00c853)'
                : 'linear-gradient(90deg, var(--star-yellow), #ff9800)',
              transition: 'width 0.6s ease',
            }} />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
            {todayXpEarned} / {dailyXpGoal} XP today
          </div>
        </div>
      </div>

      {/* Current Galaxy card */}
      <div className="glass-card" style={{
        padding: 24, marginBottom: 24,
        background: `linear-gradient(135deg, ${galaxy.color}12, rgba(0,0,0,0))`,
        borderColor: `${galaxy.color}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: galaxy.color, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
            Current Galaxy · Grade {grade}
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white' }}>{galaxy.name}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>{galaxy.description}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('galaxy', grade)}>
          Explore 🚀
        </button>
      </div>

      {/* Grade selector */}
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 16,
        textTransform: 'uppercase', letterSpacing: '0.1em' }}>Choose Your Galaxy</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
        {Object.entries(GRADE_GALAXIES).map(([g, gal]) => {
          const gradeNum = Number(g)
          const isActive = gradeNum === grade

          // Grade is unlocked if: it's grade 3 (base), OR it has content
          const gradeTopics = getAvailableTopics(gradeNum)
          const hasContent = gradeTopics.length > 0
          let isUnlocked = gradeNum <= 3 || hasContent

          // Check if previous grade is "passed" for the lock message
          const prevGrade = gradeNum - 1
          const prevTopics = getAvailableTopics(prevGrade)
          const prevAvgMastery = prevTopics.length > 0
            ? prevTopics.reduce((sum, t) => sum + getMasteryForTopic(prevGrade, t), 0) / prevTopics.length
            : 0
          const prevPassed = prevAvgMastery >= GRADE_UNLOCK_THRESHOLD
          
          // Simple unlocking logic
          if (!hasContent) isUnlocked = false

          // Compute average mastery for this grade's topics
          const avgMastery = gradeTopics.length > 0
            ? Math.round(gradeTopics.reduce((sum, t) => sum + getMasteryForTopic(gradeNum, t), 0) / gradeTopics.length)
            : 0

          return (
            <div
              key={g}
              onClick={() => isUnlocked && navigate('galaxy', gradeNum)}
              className="glass-card"
              style={{
                padding: '16px', cursor: isUnlocked ? 'pointer' : 'not-allowed',
                opacity: isUnlocked ? 1 : 0.35,
                border: isActive ? `2px solid ${gal.color}` : undefined,
                boxShadow: isActive ? `0 0 20px ${gal.color}40` : undefined,
                transition: 'all 0.3s ease',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: gal.color,
                textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                Grade {g}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'white' }}>{gal.name}</div>
              {!isUnlocked && (
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  {hasContent ? `🔒 Master Grade ${gradeNum - 1}` : '🌌 Coming Soon'}
                </div>
              )}
              {isUnlocked && gradeNum > 3 && !prevPassed && (
                <div style={{ fontSize: '0.6rem', color: 'var(--star-yellow)', marginTop: 4 }}>
                   Unlock Bonus: Mastery Required
                </div>
              )}
              {isUnlocked && gradeTopics.length > 0 && (
                <div style={{ marginTop: 6 }}>
                  <div className="progress-track" style={{ height: 4 }}>
                    <div className="progress-fill" style={{
                      width: `${avgMastery}%`,
                      background: `linear-gradient(90deg, ${gal.color}, ${gal.color}80)`,
                    }} />
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    {avgMastery}% mastery
                  </div>
                </div>
              )}
              {isActive && <div style={{ fontSize: '0.7rem', color: gal.color, marginTop: 4 }}>● CURRENT</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
