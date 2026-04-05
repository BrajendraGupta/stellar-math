import React from 'react'

// Animated SVG rocket — animates along the level progress track
export default function RocketShip({ progress = 0, size = 80, style = {} }) {
  const flameOpacity = progress < 100 ? 1 : 0

  return (
    <div
      style={{
        position: 'absolute',
        left: `calc(${progress}% - ${size / 2}px)`,
        bottom: 0,
        transition: 'left 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        filter: progress > 0 ? `drop-shadow(0 0 12px rgba(0,229,255,0.7))` : 'none',
        ...style,
      }}
    >
      <svg
        width={size} height={size * 1.5}
        viewBox="0 0 60 90"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: 'rotate(-45deg)', overflow: 'visible' }}
      >
        {/* Exhaust flame */}
        <g style={{ opacity: flameOpacity, transition: 'opacity 0.3s' }}>
          <ellipse cx="30" cy="82" rx="7" ry="14"
            fill="url(#flame-outer)" style={{ animation: 'flicker 0.15s infinite alternate' }} />
          <ellipse cx="30" cy="80" rx="4" ry="9"
            fill="url(#flame-inner)" />
        </g>

        {/* Main body */}
        <path d="M30 5 C20 20 15 40 15 60 L45 60 C45 40 40 20 30 5Z"
          fill="url(#body-grad)" stroke="#00e5ff" strokeWidth="1.5" />

        {/* Window */}
        <circle cx="30" cy="32" r="7" fill="url(#window-grad)" stroke="#00e5ff" strokeWidth="1.5" />
        <circle cx="30" cy="32" r="4" fill="rgba(255,255,255,0.9)" opacity="0.7" />
        <circle cx="28" cy="30" r="1.5" fill="white" opacity="0.9" />

        {/* Left fin */}
        <path d="M15 60 L5 75 L15 70Z"
          fill="url(#fin-grad)" stroke="#00e5ff" strokeWidth="1" />
        {/* Right fin */}
        <path d="M45 60 L55 75 L45 70Z"
          fill="url(#fin-grad)" stroke="#00e5ff" strokeWidth="1" />

        {/* Nose tip */}
        <path d="M30 5 L26 15 L34 15Z" fill="#00e5ff" opacity="0.9" />

        {/* Star decal */}
        <polygon
          points="30,20 31.5,25 36,25 32,28 33.5,33 30,30 26.5,33 28,28 24,25 28.5,25"
          fill="rgba(255,215,0,0.85)" />

        {/* Defs */}
        <defs>
          <linearGradient id="body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#1a2a6c" />
            <stop offset="50%"  stopColor="#2d4a9e" />
            <stop offset="100%" stopColor="#0d1545" />
          </linearGradient>
          <linearGradient id="fin-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="100%" stopColor="#1a2a6c" />
          </linearGradient>
          <radialGradient id="window-grad" cx="50%" cy="40%" r="50%">
            <stop offset="0%"   stopColor="#80deea" />
            <stop offset="100%" stopColor="#006064" />
          </radialGradient>
          <radialGradient id="flame-outer" cx="50%" cy="30%" r="50%">
            <stop offset="0%"   stopColor="#ff6f00" />
            <stop offset="100%" stopColor="rgba(255,111,0,0)" />
          </radialGradient>
          <radialGradient id="flame-inner" cx="50%" cy="30%" r="50%">
            <stop offset="0%"   stopColor="#fff176" />
            <stop offset="100%" stopColor="rgba(255,241,118,0)" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}
