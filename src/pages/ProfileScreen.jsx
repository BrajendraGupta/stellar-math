import React from 'react'
import { useStore, BADGES } from '../store/index.js'

export default function ProfileScreen() {
  const { profile, earnedBadges, masteryMap, navigate } = useStore()
  const xp = profile?.xp || 0
  const level = Math.floor(xp / 100) + 1
  const xpToNext = 100 - (xp % 100)

  const earnedIds = new Set(earnedBadges.map(b => b.badgeId))

  return (
    <div className="fill flex-col" style={{ position: 'relative', zIndex: 1, overflow: 'auto', padding: '24px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <button className="btn btn-ghost" onClick={() => navigate('dashboard')} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>← Back</button>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'white' }}>Flight Log</h2>
      </div>

      {/* Profile card */}
      <div className="glass-card" style={{
        padding: 24, marginBottom: 24,
        background: 'linear-gradient(135deg, rgba(0,229,255,0.08), rgba(0,0,0,0))',
        borderColor: 'rgba(0,229,255,0.3)',
        display: 'flex', alignItems: 'center', gap: 20,
      }}>
        {/* Avatar */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--comet-cyan), var(--nebula-purple))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.5rem', flexShrink: 0,
          boxShadow: '0 0 20px rgba(0,229,255,0.4)',
        }}>
          {profile?.avatar || '🚀'}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', marginBottom: 4 }}>
            Captain {profile?.name || 'Cadet'}
          </h3>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 8 }}>
            Level {level} Space Explorer
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div className="xp-chip">⭐ {xp} XP</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                {xpToNext} XP to Level {level + 1}
              </div>
              <div className="progress-track" style={{ height: 8 }}>
                <div className="progress-fill" style={{ width: `${(xp % 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)',
        textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Space Badges</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
        {Object.values(BADGES).map(badge => {
          const earned = earnedIds.has(badge.id)
          return (
            <div key={badge.id} className="tooltip-container">
              <div className="glass-card" style={{
                padding: '16px 12px', textAlign: 'center',
                opacity: earned ? 1 : 0.35,
                border: earned ? '1px solid rgba(255,215,0,0.4)' : undefined,
                background: earned ? 'rgba(255,215,0,0.06)' : undefined,
                transition: 'all 0.3s',
                height: '100%',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 6, filter: earned ? 'none' : 'grayscale(1)' }}>
                  {badge.icon}
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700,
                  color: earned ? 'var(--star-yellow)' : 'var(--text-muted)' }}>
                  {badge.name}
                </div>
                {!earned && (
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>🔒 Locked</div>
                )}
              </div>
              <div className="tooltip-text">
                <strong style={{ color: 'var(--star-yellow)', display: 'block', marginBottom: 4 }}>{badge.name}</strong>
                {badge.desc}
              </div>
            </div>
          )
        })}
      </div>

      {/* Mastery breakdown */}
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)',
        textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Topic Mastery</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Object.entries(masteryMap).length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No mastery data yet — start a mission! 🚀
          </p>
        ) : (
          Object.entries(masteryMap).map(([key, mastery]) => {
            const [grade, topic] = key.split('-')
            return (
              <div key={key} className="glass-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ minWidth: 140 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Grade {grade}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', textTransform: 'capitalize' }}>
                    {topic.replace(/-/g, ' ')}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${mastery}%` }} />
                  </div>
                </div>
                <div style={{ minWidth: 48, textAlign: 'right', fontWeight: 700,
                  color: mastery >= 80 ? 'var(--planet-green)' : mastery >= 50 ? 'var(--star-yellow)' : 'var(--danger-red)' }}>
                  {mastery}%
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
