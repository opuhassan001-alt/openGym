import { useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import { effectiveRoutineIds, effectiveRoutines, streakWeeks } from '../lib/history.js'
import { todayISO } from '../lib/format.js'
import { t } from '../lib/i18n.js'
import Icon from './Icon.jsx'
import Elapsed from './Elapsed.jsx'
import { useConnectionTrouble } from './SyncBanner.jsx'

function Tab({ active, icon, label, onClick, dot, shortcut }) {
  return (
    <button className={active ? 'on' : ''} onClick={onClick} aria-label={dot ? label + ', ' + t('Connection problem') : undefined}>
      <span className="tab-ic">
        <Icon name={icon} />
        {dot && <span className="tab-dot" aria-hidden="true" />}
      </span>
      <span className="tab-lbl">{label}</span>
      <span className="desktop-tooltip">
        <span>{label}</span>
        {shortcut && <span className="shortcut-pill">{shortcut}</span>}
      </span>
    </button>
  )
}

export default function TabBar({ onStart }) {
  const nav = useNavigate()
  const loc = useLocation()
  const S = useStore(s => s.S)
  const user = useStore(s => s.user)
  const isGuest = useStore(s => s.isGuest())
  const trouble = useConnectionTrouble()
  if (!user && !isGuest) return null
  const cur = loc.pathname.split('/')[1] || 'home'
  const on = k => cur === k || (cur === 'history' && k === 'stats') || (cur === 'settings' && k === 'home') || (cur === 'muscles' && k === 'library') || (cur === 'structural-balance' && k === 'stats')

  const running = !!S.active && cur !== 'workout' && !S.active.editingWorkoutId && !S.active.backfill && S.active.start > 0
  const streak = streakWeeks(S)

  const startWorkout = () => {
    if (!S.active) {
      if (effectiveRoutines(S, todayISO()).some(r => r.ex.length)) { onStart(effectiveRoutineIds(S, todayISO())); return }
    }
    nav('/workout')
  }

  return (
    <nav id="tabbar">
      {/* Desktop Brand Header */}
      <div className="desktop-nav-brand" onClick={() => nav('/home')} title="openGym Executive Suite">
        <div className="brand-logo-mark">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 5v14M18 5v14M3 8h3M18 8h3M3 16h3M18 16h3M6 12h12" />
          </svg>
        </div>
        <span className="desktop-tooltip">
          <span>openGym Pro</span>
          <span className="shortcut-pill">v1.4</span>
        </span>
      </div>

      {/* Main Nav Action Group */}
      <div className="nav-items-group">
        <Tab active={on('home')} icon="house" label={t('Home')} shortcut="⌘1" dot={trouble} onClick={() => nav('/home')} />
        <Tab active={on('plan')} icon="calendar" label={t('Plan')} shortcut="⌘2" onClick={() => nav('/plan')} />
        <button className={'start' + (S.active ? ' rec' : '') + (S.active && cur === 'workout' ? ' on' : '')} onClick={startWorkout}
          aria-label={running ? t('Resume') : undefined}>
          <span className="cir"><Icon name="play" /></span>
          {running ? <span className="tab-time"><Elapsed start={S.active.start} /></span>
            : <span className="tab-lbl">{S.active ? (cur === 'workout' ? t('Workout') : S.active.editingWorkoutId ? t('Edit workout') : t('Resume')) : t('Start')}</span>}
          <span className="desktop-tooltip">
            <span>{S.active ? 'Resume Session' : 'Quick Workout'}</span>
            <span className="shortcut-pill">Space</span>
          </span>
        </button>
        <Tab active={on('stats')} icon="chart" label={t('Stats')} shortcut="⌘3" onClick={() => nav('/stats')} />
        <Tab active={on('library')} icon="dumbbell" label={t('Exercises')} shortcut="⌘4" onClick={() => nav('/library')} />
      </div>

      {/* Desktop Utility Footer */}
      <div className="desktop-nav-footer">
        {streak > 0 && (
          <div className="desktop-streak-badge" title={`${streak} Week Streak!`}>
            <span className="streak-icon">🔥</span>
            <span className="streak-num">{streak}</span>
          </div>
        )}
        <button className="desktop-util-btn" onClick={() => nav('/settings')} aria-label={t('Settings')}>
          <Icon name="gear" />
          {trouble && <span className="tab-dot" aria-hidden="true" />}
          <span className="desktop-tooltip">
            <span>{t('Settings')}</span>
            <span className="shortcut-pill">⌘,</span>
          </span>
        </button>
      </div>
    </nav>
  )
}

