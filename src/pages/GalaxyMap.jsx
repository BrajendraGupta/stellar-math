import React from 'react'
import { useStore } from '../store/index.js'
import { TOPICS, TOPIC_DISPLAY, GRADE_GALAXIES, PREREQUISITES } from '../data/schema.js'
import Planet from '../components/svg/Planet.jsx'
import { getAvailableTopics } from '../data/questions/index.js'

/**
 * Check if a topic is unlocked based on prerequisite mastery.
 */
function isTopicUnlocked(topic, grade, masteryGetter) {
  const prereq = PREREQUISITES[topic]
  if (!prereq) return true  // no prerequisites defined = unlocked
  if (prereq.requires.length === 0) return true

  return prereq.requires.every(reqTopic => {
    const mastery = masteryGetter(grade, reqTopic)
    return mastery >= prereq.masteryThreshold
  })
}

export default function GalaxyMap() {
  const { currentGrade, navigate, getMasteryForTopic, testMode } = useStore()
  const galaxy = GRADE_GALAXIES[currentGrade]
  const availableTopics = getAvailableTopics(currentGrade)
  const allTopics = TOPICS[currentGrade] || []

  return (
    <div className="fill flex-col" style={{ position: 'relative', zIndex: 1, overflow: 'auto', padding: '24px 32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <button className="btn btn-ghost" onClick={() => navigate('dashboard')} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
          ← Back
        </button>
        <div>
          <div style={{ fontSize: '0.8rem', color: galaxy.color, fontWeight: 800,
            textTransform: 'uppercase', letterSpacing: '0.12em' }}>Grade {currentGrade}</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'white' }}>{galaxy.name} Galaxy</h2>
        </div>
      </div>

      {/* Orbit path + planets */}
      <div style={{
        position: 'relative',
        flex: 1,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 40,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 0 60px',
      }}>
        {/* Connecting orbit lines */}
        <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', width: '100%', height: '100%', zIndex: 0 }}>
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="rgba(0,229,255,0.4)" />
            </marker>
          </defs>
          <path
            d="M 10%,50% Q 50%,10% 90%,50%"
            fill="none"
            stroke="rgba(0,229,255,0.12)"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
        </svg>

        {allTopics.map((topic, i) => {
          const display = TOPIC_DISPLAY[topic] || { name: topic, color: '#9e9e9e', planet: topic }
          const mastery = getMasteryForTopic(currentGrade, topic)
          const hasContent = availableTopics.includes(topic)

          // Check prerequisite-based unlock
          const prereqMet = isTopicUnlocked(topic, currentGrade, getMasteryForTopic)
          const isLocked = !hasContent || (!prereqMet && !testMode)

          // Build lock reason for tooltip
          let lockReason = ''
          if (!hasContent) {
            lockReason = 'Coming soon'
          } else if (!prereqMet) {
            const prereq = PREREQUISITES[topic]
            const unmet = prereq.requires.filter(r =>
              getMasteryForTopic(currentGrade, r) < prereq.masteryThreshold
            )
            const names = unmet.map(t => TOPIC_DISPLAY[t]?.name || t).join(', ')
            lockReason = `Reach ${prereq.masteryThreshold}% in ${names} to unlock`
          }

          return (
            <div key={topic} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              zIndex: 1, animation: `slide-up ${0.2 + i * 0.1}s ease forwards`,
            }}>
              <Planet
                color={display.color}
                size={isLocked ? 100 : 130}
                name={display.name}
                mastery={mastery}
                locked={isLocked}
                onClick={() => {
                  if (!isLocked) navigate('planet', currentGrade, topic)
                }}
              />
              {/* Lock reason or mastery star */}
              {isLocked ? (
                <div style={{
                  marginTop: 6, fontSize: '0.7rem', color: 'var(--text-muted)',
                  textAlign: 'center', maxWidth: 130, lineHeight: 1.3,
                }}>
                  🔒 {lockReason}
                </div>
              ) : mastery >= 80 ? (
                <div style={{ marginTop: 4, fontSize: '1.2rem' }}>⭐</div>
              ) : null}

              {/* Prerequisite connection arrows */}
              {PREREQUISITES[topic]?.requires.length > 0 && (
                <div style={{
                  marginTop: 2, fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)',
                  fontStyle: 'italic',
                }}>
                  {prereqMet ? '✓ unlocked' : `needs ${PREREQUISITES[topic].requires.join(', ')}`}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="glass-card" style={{ padding: '12px 20px', display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid var(--star-yellow)' }} />
          Mastery ring = progress
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span style={{ opacity: 0.4 }}>🔒</span> Locked (master prerequisites first)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          ⭐ Mastered (80%+)
        </div>
      </div>
    </div>
  )
}
