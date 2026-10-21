import { useState } from 'react'
import Icon from './Icon.jsx'
import './NikeThemeLayer.css'

export default function GymLeaderboardModal({ onClose, userVolume = 8450 }) {
  const [filter, setFilter] = useState('volume') // 'volume' | 'streak'

  const leaderboardData = [
    { rank: 1, name: 'Marcus V.', badge: '⚡ TITAN', volume: 24850, streak: 18, avatar: '🏋️' },
    { rank: 2, name: 'Sarah Connor', badge: '🔥 ELITE', volume: 21300, streak: 14, avatar: '⚡' },
    { rank: 3, name: 'Alex Rivera', badge: '💪 PRO', volume: 18900, streak: 12, avatar: '🥊' },
    { rank: 4, name: 'You (Athlete)', badge: '🚀 RISING', volume: userVolume || 8450, streak: 5, avatar: '👑', isUser: true },
    { rank: 5, name: 'David Kim', badge: '👊 GRINDER', volume: 7800, streak: 4, avatar: '🏃' },
    { rank: 6, name: 'Emma Watson', badge: '⭐ ACTIVE', volume: 6500, streak: 3, avatar: '🧘' }
  ]

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: 16
    }}>
      <div style={{ maxWidth: 440, width: '100%', background: '#101216', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 20, boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="elite-badge">GLOBAL COMMUNITY</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, textTransform: 'uppercase', color: '#ffffff', marginTop: 4 }}>
              Gym Leaderboard
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: 22, cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        {/* Filter Toggle */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: 4, marginBottom: 16 }}>
          <button 
            onClick={() => setFilter('volume')}
            style={{
              flex: 1,
              padding: '6px 0',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: filter === 'volume' ? '#ccff00' : 'none',
              color: filter === 'volume' ? '#000000' : '#9ca3af'
            }}
          >
            Weekly Load (KG)
          </button>
          <button 
            onClick={() => setFilter('streak')}
            style={{
              flex: 1,
              padding: '6px 0',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: filter === 'streak' ? '#ccff00' : 'none',
              color: filter === 'streak' ? '#000000' : '#9ca3af'
            }}
          >
            Streak (Weeks)
          </button>
        </div>

        {/* List of Athletes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 320, overflowY: 'auto' }}>
          {leaderboardData.map((athlete) => (
            <div 
              key={athlete.rank}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 12,
                background: athlete.isUser ? 'rgba(204, 255, 0, 0.12)' : 'rgba(255,255,255,0.03)',
                border: athlete.isUser ? '1px solid rgba(204, 255, 0, 0.35)' : '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ 
                  fontSize: 13, 
                  fontWeight: 900, 
                  width: 22, 
                  color: athlete.rank === 1 ? '#ffd60a' : athlete.rank === 2 ? '#c0c0c0' : athlete.rank === 3 ? '#cd7f32' : '#9ca3af' 
                }}>
                  #{athlete.rank}
                </span>
                <span style={{ fontSize: 18 }}>{athlete.avatar}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: athlete.isUser ? '#ccff00' : '#ffffff' }}>
                    {athlete.name}
                  </div>
                  <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600 }}>
                    {athlete.badge}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: '#ffffff' }}>
                  {filter === 'volume' ? `${athlete.volume.toLocaleString()} kg` : `${athlete.streak} wks`}
                </div>
                <div style={{ fontSize: 9, color: '#6b7280', textTransform: 'uppercase' }}>
                  {filter === 'volume' ? 'Total Moved' : 'Consecutive'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button onClick={onClose} className="athletic-btn" style={{ width: '100%' }}>
            Keep Crushing It
          </button>
        </div>
      </div>
    </div>
  )
}

