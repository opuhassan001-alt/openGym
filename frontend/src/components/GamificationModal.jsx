import { useState } from 'react'
import { GamificationEngine } from '../../../brain/ai-coach/gamification.js'
import Icon from './Icon.jsx'
import './NikeThemeLayer.css'

export default function GamificationModal({ userState, onClose }) {
  const [activeTab, setActiveTab] = useState('profile') // 'profile' | 'badges' | 'challenges'
  const profile = GamificationEngine.calculateProfile(userState)

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
        maxWidth: 460,
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: '#0c0e12',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 24,
        padding: 24,
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.9)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="elite-badge">GAMIFICATION & QUESTS</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, textTransform: 'uppercase', color: '#ffffff', marginTop: 4 }}>
              Athlete Mastery Matrix
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: 24, cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 4, marginBottom: 18 }}>
          {[
            { id: 'profile', name: 'LEVEL & XP' },
            { id: 'badges', name: 'TROPHIES' },
            { id: 'challenges', name: 'CHALLENGES' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === t.id ? '#ccff00' : 'none',
                color: activeTab === t.id ? '#000000' : '#9ca3af'
              }}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Tab 1: Profile Level & XP */}
        {activeTab === 'profile' && (
          <div>
            {/* Level Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(204,255,0,0.15) 0%, rgba(14,15,18,0.95) 100%)',
              border: '1px solid rgba(204,255,0,0.3)',
              borderRadius: 20,
              padding: 20,
              textAlign: 'center',
              marginBottom: 16
            }}>
              <div style={{ fontSize: 44, marginBottom: 4 }}>{profile.currentRank.badge}</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#ccff00', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                LEVEL {profile.currentRank.level} ATHLETE
              </div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#ffffff', margin: '4px 0' }}>
                {profile.currentRank.title}
              </div>

              {/* XP Progress Bar */}
              <div style={{ height: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 999, overflow: 'hidden', margin: '14px 0' }}>
                <div style={{ width: `${profile.progressPct}%`, height: '100%', background: 'linear-gradient(90deg, #ccff00, #00f2fe)', borderRadius: 999 }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', fontWeight: 600 }}>
                <span>{profile.totalXP.toLocaleString()} Total XP</span>
                <span>{profile.nextRank ? `${profile.xpNeeded.toLocaleString()} XP to Level ${profile.nextRank.level}` : 'Max Tier Achieved'}</span>
              </div>
            </div>

            {/* Lifetime Stats Matrix */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: 10, color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700 }}>Total Volume Lifted</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#ccff00', marginTop: 4 }}>
                  {profile.totalVolume.toLocaleString()} <span style={{ fontSize: 12, color: '#ffffff' }}>KG</span>
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: 10, color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700 }}>Verified Sessions</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#00f2fe', marginTop: 4 }}>
                  {profile.sessionCount} <span style={{ fontSize: 12, color: '#ffffff' }}>LOGS</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Trophies & Badges */}
        {activeTab === 'badges' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {GamificationEngine.BADGES.map(badge => (
              <div
                key={badge.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '12px 14px',
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: 14,
                  border: '1px solid rgba(255,255,255,0.08)'
                }}
              >
                <div style={{ fontSize: 28, background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '4px 8px' }}>
                  {badge.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#ffffff' }}>{badge.name}</div>
                    <span style={{ fontSize: 10, color: '#ccff00', fontWeight: 800 }}>+{badge.xp} XP</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{badge.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Monthly Challenges */}
        {activeTab === 'challenges' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(255,85,0,0.15) 0%, rgba(14,15,18,0.95) 100%)',
              border: '1px solid rgba(255,85,0,0.3)',
              borderRadius: 16,
              padding: 16
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span className="elite-badge" style={{ color: '#ff5500', borderColor: 'rgba(255,85,0,0.4)', background: 'rgba(255,85,0,0.1)' }}>
                  ACTIVE MONTHLY CHALLENGE
                </span>
                <span style={{ fontSize: 11, color: '#ff5500', fontWeight: 800 }}>OCTOBER CRUSHER</span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#ffffff', margin: '4px 0' }}>
                50,000 KG Tonnage Conquest
              </div>
              <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 10 }}>
                Accumulate 50,000 kg across all resistance movements this month.
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, Math.round((profile.totalVolume / 50000) * 100))}%`, height: '100%', background: '#ff5500' }} />
              </div>
              <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 6, textAlign: 'right' }}>
                {profile.totalVolume.toLocaleString()} / 50,000 kg ({Math.min(100, Math.round((profile.totalVolume / 50000) * 100))}%)
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button onClick={onClose} className="athletic-btn" style={{ width: '100%' }}>
          Claim Glory & Return
        </button>
      </div>
    </div>
  )
}

