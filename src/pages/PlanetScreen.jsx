import React from 'react'
import { useStore } from '../store/index.js'
import { TOPIC_DISPLAY, GRADE_GALAXIES } from '../data/schema.js'
import { getQuestionsForLevel, getNebulaQuestions } from '../data/questions/index.js'

export default function PlanetScreen() {
  const { currentGrade, currentTopic, navigate, startLevel, getMasteryForTopic, struggleTopics } = useStore()
  const display = TOPIC_DISPLAY[currentTopic] || { name: currentTopic, color: '#9e9e9e' }
  const galaxy = GRADE_GALAXIES[currentGrade]
  const mastery = getMasteryForTopic(currentGrade, currentTopic)
  const isStruggle = struggleTopics.some(s => s.grade === currentGrade && s.topic === currentTopic)

  const handleStartLevel = () => {
    const questions = getQuestionsForLevel(currentGrade, currentTopic, 10, mastery, isStruggle)
    startLevel(questions, false)
  }

  const handleStartNebula = () => {
    const questions = getNebulaQuestions(currentGrade, currentTopic)
    startLevel(questions, true)
  }

  const hasNebula = getNebulaQuestions(currentGrade, currentTopic).length > 0

  return (
    <div className="fill flex-center" style={{ position: 'relative', zIndex: 1, padding: 24 }}>
      <div className="glass-card" style={{
        padding: '40px 48px', maxWidth: 560, width: '100%', textAlign: 'center',
        background: `linear-gradient(135deg, ${display.color}10, rgba(0,0,0,0))`,
        borderColor: `${display.color}40`,
        animation: 'slide-up 0.4s ease forwards',
      }}>
        {/* Planet visualization */}
        <div style={{
          width: 140, height: 140, margin: '0 auto 24px',
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 30%, ${display.color}, ${display.color}60)`,
          boxShadow: `0 0 40px ${display.color}50`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'float 4s ease-in-out infinite',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.2), transparent 60%)',
          }} />
          <span style={{ fontSize: '3rem' }}>🌍</span>
        </div>

        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: display.color,
          textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>
          {galaxy.name} Galaxy · Grade {currentGrade}
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', marginBottom: 12 }}>
          {display.name}
        </h2>

        {/* Mastery bar */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem',
            color: 'var(--text-muted)', marginBottom: 6 }}>
            <span>Mastery</span>
            <span style={{ color: display.color, fontWeight: 700 }}>{mastery}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${mastery}%`,
              background: `linear-gradient(90deg, ${display.color}, ${display.color}80)` }} />
          </div>
        </div>

        {/* Adaptive difficulty indicator */}
        {isStruggle && (
          <div className="glass-card" style={{ padding: '10px 16px', marginBottom: 12, textAlign: 'left',
            borderColor: 'rgba(255,152,0,0.4)', background: 'rgba(255,152,0,0.06)' }}>
            <p style={{ fontSize: '0.85rem', color: '#ffb74d', margin: 0, fontWeight: 600 }}>
              🛡️ Support Mode — Questions adapted to help you build confidence!
            </p>
          </div>
        )}

        {/* Mission brief */}
        <div className="glass-card" style={{ padding: '16px 20px', marginBottom: 24, textAlign: 'left' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--comet-cyan)', fontWeight: 700, marginBottom: 6,
            textTransform: 'uppercase', letterSpacing: '0.08em' }}>Mission Brief</div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {mastery < 30
              ? 'Start with the basics! Answer 6 or more correctly to pass. You\'ve got this, Captain! 🚀'
              : mastery < 60
              ? 'Building momentum! The questions will match your growing skills. Score 60% to pass! 🚀'
              : mastery < 80
              ? 'You\'re getting strong! Expect tougher challenges this time. Score 60% to pass! 💪'
              : 'Master level! Prepare for the hardest questions. Prove your expertise! ⭐'
            }
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button className="btn btn-primary" onClick={handleStartLevel} style={{ fontSize: '1.1rem', padding: '16px' }}>
            🚀 Launch Mission
          </button>

          {hasNebula && (
            <button className="btn btn-ghost" onClick={handleStartNebula} style={{ fontSize: '0.95rem' }}>
              🌌 Enter Nebula (Practice Mode)
            </button>
          )}

          <button className="btn btn-ghost" onClick={() => navigate('galaxy', currentGrade)} style={{ fontSize: '0.9rem' }}>
            ← Back to Galaxy Map
          </button>
        </div>
      </div>
    </div>
  )
}
