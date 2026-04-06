import React, { useRef, useState } from 'react'

/**
 * PinInput — 4 auto-advancing digit boxes.
 * onComplete: (pinString) => void
 */
export default function PinInput({ onComplete, error = false }) {
  const [digits, setDigits] = useState(['', '', '', ''])
  const refs = [useRef(), useRef(), useRef(), useRef()]

  const handleChange = (i, val) => {
    const digit = val.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[i] = digit
    setDigits(next)

    if (digit && i < 3) {
      refs[i + 1].current?.focus()
    }

    if (next.every(d => d !== '')) {
      onComplete(next.join(''))
    }
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs[i - 1].current?.focus()
    }
  }

  const reset = () => {
    setDigits(['', '', '', ''])
    refs[0].current?.focus()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div
        role="group"
        aria-label="PIN entry"
        autoComplete="off"
        style={{ display: 'flex', gap: 12 }}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={refs[i]}
            type="password"
            inputMode="numeric"
            maxLength={1}
            autoComplete="off"
            data-lpignore="true"
            data-1p-ignore="true"
            data-bwignore="true"
            aria-label={`PIN digit ${i + 1}`}
            value={d}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            style={{
              width: 52, height: 60,
              textAlign: 'center',
              fontSize: '1.6rem',
              fontWeight: 900,
              background: 'var(--glass-bg)',
              border: `2px solid ${error ? 'var(--danger-red)' : d ? 'var(--comet-cyan)' : 'var(--glass-border)'}`,
              borderRadius: 12,
              color: 'white',
              outline: 'none',
              caretColor: 'var(--comet-cyan)',
              transition: 'border-color 0.2s',
            }}
          />
        ))}
      </div>
      {error && (
        <p style={{ color: 'var(--danger-red)', fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>
          Incorrect PIN. Try again.
        </p>
      )}
    </div>
  )
}
