import React, { useEffect } from 'react'
import { speakText, stopSpeaking } from '../../audio/SoundManager.js'

export default function AlienCopilot({ message = '', visible = false, onDismiss }) {
  // Read the hint aloud when copilot appears
  useEffect(() => {
    if (visible && message) {
      speakText(`Co-Pilot ARIA says: ${message}`)
    }
    return () => stopSpeaking()
  }, [visible, message])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 100,
      display: 'flex', alignItems: 'flex-end', gap: 12,
      animation: 'slide-up 0.4s ease forwards',
    }}>
      {/* Speech bubble */}
      <div style={{
        background: 'rgba(13, 21, 69, 0.95)',
        border: '2px solid var(--comet-cyan)',
        borderRadius: 16,
        padding: '12px 16px',
        maxWidth: 280,
        boxShadow: '0 0 20px rgba(0,229,255,0.3)',
        position: 'relative',
      }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--comet-cyan)', fontWeight: 700, marginBottom: 4 }}>
          Co-Pilot ARIA says:
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5, margin: 0 }}>
          {message}
        </p>
        {/* Arrow pointing right */}
        <div style={{
          position: 'absolute', right: -10, bottom: 24,
          width: 0, height: 0,
          borderTop: '8px solid transparent',
          borderBottom: '8px solid transparent',
          borderLeft: '10px solid var(--comet-cyan)',
        }} />
        <button
          onClick={onDismiss}
          style={{
            position: 'absolute', top: 6, right: 8,
            background: 'none', border: 'none',
            color: 'var(--text-muted)', cursor: 'pointer',
            fontSize: '1rem', lineHeight: 1,
          }}
        >✕</button>
      </div>

      {/* Alien character */}
      <svg width="80" height="100" viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg"
        style={{ animation: 'float 2s ease-in-out infinite', flexShrink: 0 }}>
        {/* Body */}
        <ellipse cx="40" cy="65" rx="22" ry="18" fill="url(#alien-body)" />

        {/* Head */}
        <ellipse cx="40" cy="38" rx="26" ry="28" fill="url(#alien-head)" />

        {/* Eyes — big, friendly */}
        <ellipse cx="28" cy="32" rx="9" ry="11" fill="white" />
        <ellipse cx="52" cy="32" rx="9" ry="11" fill="white" />
        <circle cx="29" cy="33" r="6" fill="#1565c0" />
        <circle cx="53" cy="33" r="6" fill="#1565c0" />
        <circle cx="30" cy="31" r="3" fill="black" />
        <circle cx="54" cy="31" r="3" fill="black" />
        <circle cx="31" cy="29" r="1.5" fill="white" />
        <circle cx="55" cy="29" r="1.5" fill="white" />

        {/* Smile */}
        <path d="M29 50 Q40 58 51 50" fill="none" stroke="#00e5ff" strokeWidth="2.5" strokeLinecap="round" />

        {/* Antennae */}
        <line x1="28" y1="12" x2="20" y2="2" stroke="#00e676" strokeWidth="2" />
        <circle cx="20" cy="2" r="3" fill="#00e676" />
        <line x1="52" y1="12" x2="60" y2="2" stroke="#00e676" strokeWidth="2" />
        <circle cx="60" cy="2" r="3" fill="#00e676" />

        {/* Arms */}
        <ellipse cx="14" cy="62" rx="6" ry="10" fill="url(#alien-body)" transform="rotate(-20 14 62)" />
        <ellipse cx="66" cy="62" rx="6" ry="10" fill="url(#alien-body)" transform="rotate(20 66 62)" />

        {/* Helmet ring */}
        <ellipse cx="40" cy="55" rx="26" ry="5" fill="none"
          stroke="rgba(0,229,255,0.5)" strokeWidth="2" strokeDasharray="4 3" />

        {/* Spacesuit details */}
        <circle cx="40" cy="65" r="5" fill="rgba(0,229,255,0.4)" />
        <line x1="35" y1="70" x2="45" y2="70" stroke="rgba(0,229,255,0.4)" strokeWidth="1.5" />

        <defs>
          <radialGradient id="alien-head" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#a5d6a7" />
            <stop offset="100%" stopColor="#2e7d32" />
          </radialGradient>
          <radialGradient id="alien-body" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#81c784" />
            <stop offset="100%" stopColor="#1b5e20" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}
