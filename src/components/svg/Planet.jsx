import React from 'react'

export default function Planet({ color = '#9c27b0', size = 120, name = 'Planet', mastery = 0, locked = false, onClick, style = {} }) {
  const id = `planet-${name.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <div
      onClick={!locked ? onClick : undefined}
      style={{
        cursor: locked ? 'not-allowed' : 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        opacity: locked ? 0.4 : 1,
        transition: 'all 0.3s ease',
        ...style,
      }}
    >
      <div style={{ position: 'relative', filter: locked ? 'grayscale(1)' : `drop-shadow(0 0 16px ${color}60)` }}>
        <svg width={size} height={size} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"
          style={{ animation: locked ? 'none' : 'float 4s ease-in-out infinite' }}>

          {/* Ring */}
          <ellipse cx="60" cy="72" rx="55" ry="12"
            fill="none" stroke={`${color}80`} strokeWidth="6"
            style={{ transform: 'rotate(-15deg)', transformOrigin: '60px 72px' }} />

          {/* Planet body */}
          <circle cx="60" cy="60" r="44" fill={`url(#grad-${id})`} />

          {/* Surface detail */}
          <ellipse cx="45" cy="48" rx="12" ry="8" fill={`${color}40`} />
          <ellipse cx="72" cy="70" rx="8" ry="5" fill={`${color}30`} />
          <ellipse cx="55" cy="75" rx="6" ry="4" fill={`${color}35`} />

          {/* Shine */}
          <ellipse cx="42" cy="38" rx="14" ry="10" fill="rgba(255,255,255,0.18)" />
          <circle  cx="38" cy="34" r="4" fill="rgba(255,255,255,0.22)" />

          {/* Mastery overlay */}
          {mastery > 0 && (
            <circle cx="60" cy="60" r="44"
              fill="none"
              stroke="rgba(255,215,0,0.6)"
              strokeWidth="3"
              strokeDasharray={`${(mastery / 100) * 276.5} 276.5`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
          )}

          {/* Lock icon */}
          {locked && (
            <g transform="translate(45, 45)">
              <rect x="5" y="10" width="20" height="16" rx="3" fill="rgba(0,0,0,0.7)" />
              <path d="M9 10 V7 A6 6 0 0 1 21 7 V10" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" />
            </g>
          )}

          <defs>
            <radialGradient id={`grad-${id}`} cx="35%" cy="30%" r="70%">
              <stop offset="0%"   stopColor={`${color}ff`} />
              <stop offset="60%"  stopColor={color} />
              <stop offset="100%" stopColor={`${color}88`} />
            </radialGradient>
          </defs>
        </svg>

        {/* Mastery % badge */}
        {mastery > 0 && !locked && (
          <div style={{
            position: 'absolute', top: -6, right: -6,
            background: 'rgba(255,215,0,0.9)',
            color: '#1a1a1a',
            borderRadius: 99, padding: '2px 8px',
            fontSize: '0.75rem', fontWeight: 800,
          }}>{mastery}%</div>
        )}
      </div>

      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: locked ? 'var(--text-muted)' : 'var(--text-primary)', textAlign: 'center' }}>
        {name}
      </span>
    </div>
  )
}
