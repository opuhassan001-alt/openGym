import { useState, useEffect, useRef } from 'react'
import { voiceCoach } from '../../../brain/voice-engine/voiceCoach.js'
import Icon from './Icon.jsx'
import './NikeThemeLayer.css'

export default function IntervalTimerSuiteModal({ onClose }) {
  const [mode, setMode] = useState('tabata') // 'tabata' | 'emom' | 'amrap'
  const [workSec, setWorkSec] = useState(20)
  const [restSec, setRestSec] = useState(10)
  const [totalRounds, setTotalRounds] = useState(8)
  const [emomMin, setEmomMin] = useState(10)
  const [amrapMin, setAmrapMin] = useState(12)

  // Running state
  const [running, setRunning] = useState(false)
  const [currentRound, setCurrentRound] = useState(1)
  const [phase, setPhase] = useState('work') // 'work' | 'rest'
  const [timeLeft, setTimeLeft] = useState(20)
  const [flash, setFlash] = useState(false)

  const timerRef = useRef(null)

  // Configure defaults when mode changes
  useEffect(() => {
    setRunning(false)
    if (timerRef.current) clearInterval(timerRef.current)
    if (mode === 'tabata') {
      setWorkSec(20)
      setRestSec(10)
      setTotalRounds(8)
      setTimeLeft(20)
      setPhase('work')
      setCurrentRound(1)
    } else if (mode === 'emom') {
      setTimeLeft(60)
      setPhase('work')
      setCurrentRound(1)
    } else if (mode === 'amrap') {
      setTimeLeft(amrapMin * 60)
      setPhase('work')
    }
  }, [mode, amrapMin])

  // Timer Tick
  useEffect(() => {
    if (!running) return

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Phase transition
          setFlash(true)
          setTimeout(() => setFlash(false), 400)

          if (mode === 'tabata') {
            if (phase === 'work') {
              voiceCoach.speak(`Rest now! Round ${currentRound} done.`, true)
              setPhase('rest')
              return restSec
            } else {
              if (currentRound >= totalRounds) {
                setRunning(false)
                voiceCoach.speak(`Tabata completed! Outstanding work!`, true)
                return 0
              }
              const nextRound = currentRound + 1
              setCurrentRound(nextRound)
              setPhase('work')
              voiceCoach.speak(`Round ${nextRound}! Go!`, true)
              return workSec
            }
          } else if (mode === 'emom') {
            if (currentRound >= emomMin) {
              setRunning(false)
              voiceCoach.speak(`EMOM workout finished! Excellent pacing!`, true)
              return 0
            }
            const nextRound = currentRound + 1
            setCurrentRound(nextRound)
            voiceCoach.speak(`Minute ${nextRound}! New round start!`, true)
            return 60
          } else if (mode === 'amrap') {
            setRunning(false)
            voiceCoach.speak(`Time! AMRAP completed! Log your rounds!`, true)
            return 0
          }
        }

        // Audio countdown for final 3 seconds
        if (prev === 4) voiceCoach.speak('Three', false)
        if (prev === 3) voiceCoach.speak('Two', false)
        if (prev === 2) voiceCoach.speak('One', false)

        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [running, phase, currentRound, totalRounds, workSec, restSec, mode, emomMin])

  const toggleRun = () => {
    if (!running && timeLeft === 0) {
      setTimeLeft(mode === 'tabata' ? workSec : mode === 'emom' ? 60 : amrapMin * 60)
      setCurrentRound(1)
      setPhase('work')
    }
    setRunning(!running)
  }

  const resetTimer = () => {
    setRunning(false)
    if (timerRef.current) clearInterval(timerRef.current)
    setTimeLeft(mode === 'tabata' ? workSec : mode === 'emom' ? 60 : amrapMin * 60)
    setCurrentRound(1)
    setPhase('work')
  }

  const formatSec = (sec) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m > 0 ? `${m}:` : ''}${s < 10 && m > 0 ? '0' : ''}${s}`
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.88)',
      backdropFilter: 'blur(14px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: 16
    }}>
      <div style={{
        maxWidth: 440,
        width: '100%',
        background: flash ? '#ffffff' : '#0c0e12',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 24,
        padding: 24,
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.9)',
        transition: 'background 0.15s ease'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="elite-badge">INTERVAL SUITE</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, textTransform: 'uppercase', color: '#ffffff', marginTop: 4 }}>
              High-Intensity Clocks
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: 24, cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        {/* Mode Selector */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 4, marginBottom: 18 }}>
          {[
            { id: 'tabata', name: 'TABATA (20/10)' },
            { id: 'emom', name: 'EMOM' },
            { id: 'amrap', name: 'AMRAP' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                background: mode === m.id ? '#ccff00' : 'none',
                color: mode === m.id ? '#000000' : '#9ca3af'
              }}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* Big Athletic Digital Clock */}
        <div style={{
          background: phase === 'work' ? 'radial-gradient(circle, rgba(204,255,0,0.15) 0%, rgba(14,15,18,0.95) 80%)' : 'radial-gradient(circle, rgba(0,242,254,0.15) 0%, rgba(14,15,18,0.95) 80%)',
          border: `2px solid ${phase === 'work' ? 'rgba(204,255,0,0.4)' : 'rgba(0,242,254,0.4)'}`,
          borderRadius: 24,
          padding: '24px 16px',
          textAlign: 'center',
          marginBottom: 20
        }}>
          <div style={{
            fontSize: 13,
            fontWeight: 900,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: phase === 'work' ? '#ccff00' : '#00f2fe'
          }}>
            {phase === 'work' ? '🔥 WORK INTERVAL' : '💧 REST & BREATHE'}
          </div>

          <div style={{ fontSize: 72, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.04em', lineHeight: 1.1, margin: '8px 0' }}>
            {formatSec(timeLeft)}
          </div>

          <div style={{ fontSize: 13, fontWeight: 700, color: '#9ca3af' }}>
            {mode === 'tabata' && `Round ${currentRound} of ${totalRounds}`}
            {mode === 'emom' && `Minute ${currentRound} of ${emomMin}`}
            {mode === 'amrap' && `As Many Reps / Rounds As Possible`}
          </div>
        </div>

        {/* Control Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <button
            onClick={toggleRun}
            className="athletic-btn"
            style={{
              padding: '14px',
              fontSize: 15,
              background: running ? '#ff3b30' : '#ccff00',
              color: running ? '#ffffff' : '#000000'
            }}
          >
            {running ? '⏸ Pause' : '▶ Start Interval'}
          </button>
          <button
            onClick={resetTimer}
            className="athletic-btn-secondary"
            style={{ padding: '14px', fontSize: 14 }}
          >
            ↺ Reset
          </button>
        </div>
      </div>
    </div>
  )
}

