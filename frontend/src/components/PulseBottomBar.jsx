import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './PulseBottomBar.css'

export default function PulseBottomBar({ onStart }) {
  const nav = useNavigate()
  const loc = useLocation()
  const path = loc.pathname.split('/')[1] || 'home'

  return (
    <nav className="pulse-floating-bottom-bar" aria-label="Pulse Executive Navigation">
      <div className="pulse-bar-inner">
        {/* Left: Brand Mark */}
        <div 
          className="pulse-brand-pill" 
          onClick={() => nav('/home')}
          title="Pulse by OpenGym"
        >
          <div className="pulse-brand-icon-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 5v14M18 5v14M3 8h3M18 8h3M3 16h3M18 16h3M6 12h12" />
            </svg>
          </div>
          <span className="pulse-brand-name">Pulse</span>
        </div>

        {/* Center: Navigation Links */}
        <div className="pulse-nav-links">
          <button 
            className={`pulse-nav-btn ${path === 'home' ? 'active' : ''}`}
            onClick={() => nav('/home')}
          >
            <span className="pulse-nav-dash">_</span>
            <span>Home</span>
          </button>

          <button 
            className={`pulse-nav-btn ${path === 'workout' ? 'active' : ''}`}
            onClick={() => {
              if (onStart) onStart()
              else nav('/workout')
            }}
          >
            <svg className="pulse-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
            <span>Workouts</span>
          </button>

          <button 
            className={`pulse-nav-btn ${path === 'coach' ? 'active' : ''}`}
            onClick={() => nav('/coach')}
          >
            <span className="pulse-sparkle-icon">✦</span>
            <span>Ai Coach</span>
          </button>

          <button 
            className={`pulse-nav-btn ${path === 'stats' || path === 'history' ? 'active' : ''}`}
            onClick={() => nav('/stats')}
          >
            <svg className="pulse-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <span>Progress</span>
          </button>

          <button 
            className={`pulse-nav-btn ${path === 'plan' || path === 'profile' ? 'active' : ''}`}
            onClick={() => nav('/plan')}
          >
            <svg className="pulse-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Profile</span>
          </button>
        </div>

        {/* Right: Utility Controls */}
        <div className="pulse-utility-actions">
          <button 
            className="pulse-icon-btn" 
            onClick={() => nav('/settings')} 
            title="Settings"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>

          <button 
            className="pulse-icon-btn" 
            title="Notifications"
            onClick={() => nav('/history')}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          <div 
            className="pulse-avatar-circle"
            onClick={() => nav('/plan')}
            title="Athlete Profile"
          >
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" 
              alt="User Avatar"
            />
          </div>
        </div>
      </div>
    </nav>
  )
}

