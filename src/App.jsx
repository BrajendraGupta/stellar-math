import React, { useEffect } from 'react'
import { useStore } from './store/index.js'
import Dashboard from './pages/Dashboard.jsx'
import GalaxyMap from './pages/GalaxyMap.jsx'
import PlanetScreen from './pages/PlanetScreen.jsx'
import LevelScreen from './pages/LevelScreen.jsx'
import ProfileScreen from './pages/ProfileScreen.jsx'
import ProfilePicker from './pages/ProfilePicker.jsx'
import AlienCopilot from './components/svg/AlienCopilot.jsx'
import BadgePopup from './components/feedback/BadgePopup.jsx'

// ── Bottom Nav ────────────────────────────────────────────────────
function BottomNav() {
  const { currentMode, navigate, profile } = useStore()
  if (!profile) return null

  // Hide nav during active gameplay
  if (['level', 'nebula', 'levelComplete', 'levelFailed', 'nebulaUnlocked'].includes(currentMode)) return null

  const items = [
    { icon: '🏠', label: 'Home',    mode: 'dashboard' },
    { icon: '🌌', label: 'Galaxy',  mode: 'galaxy' },
    { icon: '👨‍🚀', label: 'Profile', mode: 'profile' },
  ]

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      display: 'flex', justifyContent: 'center',
      background: 'rgba(10,14,39,0.9)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--glass-border)',
      padding: '8px 0 12px',
      zIndex: 50,
      gap: 0,
    }}>
      {items.map(item => {
        const isActive = currentMode === item.mode ||
          (item.mode === 'galaxy' && ['galaxy', 'planet'].includes(currentMode))
        return (
          <button key={item.mode} onClick={() => navigate(item.mode)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '8px 32px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 2,
              opacity: isActive ? 1 : 0.5, transition: 'opacity 0.2s',
            }}>
            <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
            <span style={{
              fontSize: '0.7rem', fontWeight: 700,
              color: isActive ? 'var(--comet-cyan)' : 'var(--text-muted)',
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              {item.label}
            </span>
            {isActive && (
              <div style={{
                width: 4, height: 4, borderRadius: '50%',
                background: 'var(--comet-cyan)',
                boxShadow: '0 0 6px var(--comet-cyan)',
              }} />
            )}
          </button>
        )
      })}
    </nav>
  )
}

// ── Main App ──────────────────────────────────────────────────────
export default function App() {
  const { currentMode, init, profile, showCopilot, copilotMessage, dismissCopilot } = useStore()

  useEffect(() => {
    init()
  }, [])

  const renderPage = () => {
    switch (currentMode) {
      case 'profile':        return <ProfileScreen />
      case 'profilePicker':  return <ProfilePicker />
      case 'galaxy':         return <GalaxyMap />
      case 'planet':         return <PlanetScreen />
      case 'level':
      case 'nebula':
      case 'levelComplete':
      case 'levelFailed':
      case 'nebulaUnlocked': return <LevelScreen />
      case 'profile':        return <ProfileScreen />
      default:               return <Dashboard />
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Starfield background */}
      <div className="starfield" />

      {/* Page content — leave bottom space for nav */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%',
        height: profile && !['level','nebula','levelComplete','levelFailed','nebulaUnlocked'].includes(currentMode)
          ? 'calc(100% - 64px)' : '100%',
        overflow: 'hidden',
      }}>
        {renderPage()}
      </div>

      {/* Overlays */}
      <BadgePopup />
      <AlienCopilot
        visible={showCopilot && currentMode !== 'level' && currentMode !== 'nebula'}
        message={copilotMessage}
        onDismiss={dismissCopilot}
      />

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  )
}
