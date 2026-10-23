import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import { effectiveRoutines, effectiveRoutineIds, streakWeeks } from '../lib/history.js'
import { todayISO } from '../lib/format.js'
import { t } from '../lib/i18n.js'
import Icon from './Icon.jsx'
import { useConnectionTrouble } from './SyncBanner.jsx'
import './TopExecutiveMenu.css'

export default function TopExecutiveMenu({ onStart }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const nav = useNavigate()
  const loc = useLocation()

  const S = useStore(s => s.S)
  const user = useStore(s => s.user)
  const trouble = useConnectionTrouble()
  const streak = streakWeeks(S)
  const inWorkout = !!S.active && !S.active.editingWorkoutId

  const cur = loc.pathname.split('/')[1] || 'home'

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const handleNavigate = (path) => {
    setOpen(false)
    nav(path)
  }

  const handleStartWorkout = () => {
    setOpen(false)
    if (!S.active) {
      const todayRoutines = effectiveRoutines(S, todayISO())
      if (todayRoutines.some(r => r.ex.length)) {
        if (onStart) onStart(effectiveRoutineIds(S, todayISO()))
        return
      }
    }
    nav('/workout')
  }

  return (
    <>
      {open && <div className="top-exec-backdrop" onClick={() => setOpen(false)} />}

      <div className="top-exec-wrapper" ref={menuRef}>
        {/* Floating Three-Dot Trigger Button */}
        <button
          className={`top-exec-trigger ${open ? 'active' : ''}`}
          onClick={() => setOpen(prev => !prev)}
          aria-label="Executive Menu"
          title="openGym Executive Menu"
        >
          {/* Three dots icon (modern kebab) */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="2.2" />
            <circle cx="12" cy="12" r="2.2" />
            <circle cx="12" cy="19" r="2.2" />
          </svg>

          {/* Indicator dot: active workout (green) or trouble (red) */}
          {trouble ? (
            <span className="top-exec-dot" />
          ) : inWorkout ? (
            <span className="top-exec-dot active-workout" />
          ) : null}
        </button>

        {/* Dropdown Menu Panel */}
        {open && (
          <div className="top-exec-dropdown">
            {/* Header: Brand & Streak */}
            <div className="top-exec-header">
              <div className="top-exec-brand">
                <div className="top-exec-brand-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ccff00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 5v14M18 5v14M3 8h3M18 8h3M3 16h3M18 16h3M6 12h12" />
                  </svg>
                </div>
                <div>
                  <div className="top-exec-brand-title">OPENGYM</div>
                  <div className="top-exec-brand-sub">{user?.name ? t('Hi {0}', user.name) : 'Pro Athlete'}</div>
                </div>
              </div>

              {streak > 0 && (
                <div className="top-exec-streak" title={`${streak} Week Streak!`}>
                  <span className="top-exec-streak-icon">🔥</span>
                  <span className="top-exec-streak-text">{streak}w</span>
                </div>
              )}
            </div>

            <div className="top-exec-divider" />

            {/* Menu Items */}
            <div className="top-exec-items">
              <button
                className={`top-exec-item ${cur === 'home' ? 'active' : ''}`}
                onClick={() => handleNavigate('/home')}
              >
                <div className="top-exec-item-left">
                  <span className="top-exec-item-icon"><Icon name="house" /></span>
                  <span>{t('Home')}</span>
                </div>
                <span className="top-exec-badge">⌘1</span>
              </button>

              <button
                className={`top-exec-item ${cur === 'plan' ? 'active' : ''}`}
                onClick={() => handleNavigate('/plan')}
              >
                <div className="top-exec-item-left">
                  <span className="top-exec-item-icon"><Icon name="calendar" /></span>
                  <span>{t('Plan')}</span>
                </div>
                <span className="top-exec-badge">⌘2</span>
              </button>

              <button
                className="top-exec-item start-btn"
                onClick={handleStartWorkout}
              >
                <div className="top-exec-item-left">
                  <span className="top-exec-item-icon"><Icon name="play" /></span>
                  <span>{S.active ? t('Resume Session') : t('Start Workout')}</span>
                </div>
                <span className="top-exec-badge live">Space</span>
              </button>

              <button
                className={`top-exec-item ${cur === 'stats' || cur === 'history' ? 'active' : ''}`}
                onClick={() => handleNavigate('/stats')}
              >
                <div className="top-exec-item-left">
                  <span className="top-exec-item-icon"><Icon name="chart" /></span>
                  <span>{t('Stats & Records')}</span>
                </div>
                <span className="top-exec-badge">⌘3</span>
              </button>

              <button
                className={`top-exec-item ${cur === 'library' ? 'active' : ''}`}
                onClick={() => handleNavigate('/library')}
              >
                <div className="top-exec-item-left">
                  <span className="top-exec-item-icon"><Icon name="dumbbell" /></span>
                  <span>{t('Exercises')}</span>
                </div>
                <span className="top-exec-badge">⌘4</span>
              </button>

              <button
                className={`top-exec-item ${cur === 'muscles' ? 'active' : ''}`}
                onClick={() => handleNavigate('/muscles')}
              >
                <div className="top-exec-item-left">
                  <span className="top-exec-item-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="5" r="3" />
                      <path d="M12 8v8M9 11l3 2 3-2M9 16l3 2 3-2" />
                    </svg>
                  </span>
                  <span>3D Muscle Map</span>
                </div>
                <span className="top-exec-badge">3D</span>
              </button>

              <div className="top-exec-divider" />

              <button
                className={`top-exec-item ${cur === 'settings' ? 'active' : ''}`}
                onClick={() => handleNavigate('/settings')}
              >
                <div className="top-exec-item-left">
                  <span className="top-exec-item-icon"><Icon name="gear" /></span>
                  <span>{t('Settings')}</span>
                </div>
                {trouble ? (
                  <span className="top-exec-badge" style={{ color: '#ff3b30' }}>Issue</span>
                ) : (
                  <span className="top-exec-badge">⌘,</span>
                )}
              </button>

              <button
                className={`top-exec-item ${cur === 'privacy' ? 'active' : ''}`}
                onClick={() => handleNavigate('/privacy')}
              >
                <div className="top-exec-item-left">
                  <span className="top-exec-item-icon"><Icon name="shield" /></span>
                  <span>Privacy Policy</span>
                </div>
                <span className="top-exec-badge" style={{ color: '#A7FF84' }}>GDPR</span>
              </button>

              <button
                className={`top-exec-item ${cur === 'terms' ? 'active' : ''}`}
                onClick={() => handleNavigate('/terms')}
              >
                <div className="top-exec-item-left">
                  <span className="top-exec-item-icon"><Icon name="doc" /></span>
                  <span>Terms &amp; Conditions</span>
                </div>
                <span className="top-exec-badge">Legal</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

