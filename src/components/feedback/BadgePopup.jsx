import React, { useEffect } from 'react'
import { useStore } from '../../store/index.js'

export default function BadgePopup() {
  const newBadge = useStore(s => s.newBadge)
  const dismissBadge = useStore(s => s.dismissBadge)

  useEffect(() => {
    if (newBadge) {
      const t = setTimeout(dismissBadge, 4000)
      return () => clearTimeout(t)
    }
  }, [newBadge, dismissBadge])

  if (!newBadge) return null

  return (
    <div style={{
      position: 'fixed', top: '80px', right: '20px',
      zIndex: 200,
      animation: 'badge-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      textAlign: 'center',
      pointerEvents: 'none',
    }}>
      {/* Glow ring */}
      <div style={{
        position: 'absolute', inset: -10,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,215,0,0.25), transparent 70%)',
        animation: 'pulse-glow 1s ease-in-out infinite',
      }} />

      <div style={{
        background: 'linear-gradient(135deg, #1a2a6c, #0d1545)',
        border: '2px solid var(--star-yellow)',
        borderRadius: 16,
        padding: '14px 20px',
        boxShadow: '0 0 20px rgba(255,215,0,0.3), 0 8px 24px rgba(0,0,0,0.4)',
        position: 'relative',
      }}>
        <div style={{ fontSize: '2rem', marginBottom: 4 }}>{newBadge.icon}</div>
        <div style={{
          color: 'var(--star-yellow)', fontSize: '0.65rem',
          fontWeight: 800, letterSpacing: '0.12em',
          textTransform: 'uppercase', marginBottom: 2,
        }}>Badge Unlocked!</div>
        <div style={{ fontSize: '1rem', fontWeight: 800, color: 'white', marginBottom: 4 }}>
          {newBadge.name}
        </div>
        {/* Stars decoration */}
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: `${10 + Math.random() * 80}%`,
            left: `${5 + Math.random() * 90}%`,
            fontSize: `${0.6 + Math.random() * 0.8}rem`,
            animation: `twinkle ${1 + Math.random()}s ease-in-out infinite alternate`,
            opacity: 0.7,
          }}>✦</div>
        ))}
      </div>
    </div>
  )
}
