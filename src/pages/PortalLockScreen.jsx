import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../store/index.js'
import { hasPortalPin, setPortalPin } from '../db/index.js'
import PinInput from '../components/ui/PinInput.jsx'

const LOCKOUT_KEY = id => `stellar-pin-attempts-${id}`
const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 30_000

export default function PortalLockScreen() {
  const { studentId, profile, navigate, enterPortal } = useStore()
  const [mode, setMode]             = useState('loading') // loading | setup | setup-confirm | verify
  const [setupPin, setSetupPin]     = useState('')
  const [error, setError]           = useState(false)
  const [lockout, setLockout]       = useState(0) // seconds remaining
  const [attempts, setAttempts]     = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    hasPortalPin(studentId).then(has => setMode(has ? 'verify' : 'setup'))
    // Check existing lockout
    const stored = JSON.parse(localStorage.getItem(LOCKOUT_KEY(studentId)) || '{}')
    if (stored.until && Date.now() < stored.until) {
      const remaining = Math.ceil((stored.until - Date.now()) / 1000)
      startLockoutTimer(remaining)
      setAttempts(stored.attempts || MAX_ATTEMPTS)
    }
  }, [studentId])

  const startLockoutTimer = (seconds) => {
    setLockout(seconds)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setLockout(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          localStorage.removeItem(LOCKOUT_KEY(studentId))
          setAttempts(0)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSetup = (pin) => {
    setSetupPin(pin)
    setMode('setup-confirm')
  }

  const handleSetupConfirm = async (pin) => {
    if (pin !== setupPin) {
      setError(true)
      setTimeout(() => { setError(false); setMode('setup') }, 1200)
      return
    }
    await setPortalPin(studentId, pin)
    // Auto-enter portal after PIN setup
    await enterPortal(studentId, pin)
  }

  const handleVerify = async (pin) => {
    if (lockout > 0) return
    const ok = await enterPortal(studentId, pin)
    if (!ok) {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      setError(true)
      setTimeout(() => setError(false), 600)

      if (newAttempts >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_MS
        localStorage.setItem(LOCKOUT_KEY(studentId), JSON.stringify({ until, attempts: newAttempts }))
        startLockoutTimer(30)
      }
    }
  }

  return (
    <div className="fill flex-center flex-col" style={{ position: 'relative', zIndex: 1, gap: 24, padding: 24 }}>
      {/* Lock icon */}
      <div style={{ fontSize: '3.5rem', animation: 'float 3s ease-in-out infinite' }}>🔐</div>

      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'white', marginBottom: 8 }}>
          {mode === 'setup' ? 'Set a Portal PIN' : mode === 'setup-confirm' ? 'Confirm PIN' : 'Parent/Teacher Portal'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: 320 }}>
          {mode === 'setup'
            ? 'Create a 4-digit PIN to protect the portal. Keep it safe — there is no recovery without deleting the profile.'
            : mode === 'setup-confirm'
            ? 'Enter the same PIN again to confirm.'
            : `Enter PIN for ${profile?.name || 'this profile'}`}
        </p>
      </div>

      {mode === 'loading' && (
        <div style={{ fontSize: '2rem', animation: 'spin-slow 1.5s linear infinite' }}>⏳</div>
      )}

      {mode === 'setup' && (
        <PinInput onComplete={handleSetup} error={error} />
      )}

      {mode === 'setup-confirm' && (
        <PinInput onComplete={handleSetupConfirm} error={error} />
      )}

      {mode === 'verify' && (
        <>
          {lockout > 0 ? (
            <div style={{
              padding: '16px 24px', borderRadius: 12,
              background: 'rgba(255,71,87,0.1)', border: '2px solid var(--danger-red)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>⏱️</div>
              <p style={{ color: 'var(--danger-red)', fontWeight: 700, margin: 0 }}>
                Too many attempts. Wait {lockout}s.
              </p>
            </div>
          ) : (
            <PinInput onComplete={handleVerify} error={error} />
          )}
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: 280 }}>
            {MAX_ATTEMPTS - attempts} attempts remaining before lockout
          </p>
        </>
      )}

      <button className="btn btn-ghost" onClick={() => navigate('dashboard')} style={{ fontSize: '0.85rem' }}>
        ← Cancel
      </button>
    </div>
  )
}
