import { useState } from 'react'
import { voiceCoach } from '../../../brain/voice-engine/voiceCoach.js'
import { HyperPersonalizationEngine } from '../../../brain/ai-coach/hyperPersonalization.js'
import Icon from './Icon.jsx'
import './NikeThemeLayer.css'

export default function HyperPersonalizationCard({ S }) {
  const [muted, setMuted] = useState(voiceCoach.isMuted)
  const briefing = HyperPersonalizationEngine.generateAthleteBriefing(S)

  // Calculate muscle freshness dynamically from workouts
  const now = Date.now()
  const lastChestWorkout = S?.workouts?.slice().reverse().find(w => w.name?.toLowerCase().includes('chest') || w.name?.toLowerCase().includes('push'))
  const lastBackWorkout = S?.workouts?.slice().reverse().find(w => w.name?.toLowerCase().includes('back') || w.name?.toLowerCase().includes('pull'))
  const lastLegWorkout = S?.workouts?.slice().reverse().find(w => w.name?.toLowerCase().includes('leg'))

  const chestStatus = HyperPersonalizationEngine.calculateMuscleReadiness('chest', lastChestWorkout ? new Date(lastChestWorkout.d).getTime() : null)
  const backStatus = HyperPersonalizationEngine.calculateMuscleReadiness('lats', lastBackWorkout ? new Date(lastBackWorkout.d).getTime() : null)
  const legStatus = HyperPersonalizationEngine.calculateMuscleReadiness('quads', lastLegWorkout ? new Date(lastLegWorkout.d).getTime() : null)

  const handleVoiceToggle = (e) => {
    e.stopPropagation()
    const nextMuted = voiceCoach.toggleMute()
    setMuted(nextMuted)
    if (!nextMuted) {
      voiceCoach.speak('Voice Coach activated. Ready to train.', true)
    }
  }

  const testVoiceCue = (e) => {
    e.stopPropagation()
    voiceCoach.speak('Next set: Lock in and push your limits!', true)
  }

  return (
    <div className="athletic-card glow-lime">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="ai-pulse-dot" />
          <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#ccff00' }}>
            AI ATHLETE INTEL
          </span>
          <span className="elite-badge cyan">{briefing.coachStatus}</span>
        </div>

        {/* Voice Coach Switch */}
        <button 
          onClick={handleVoiceToggle} 
          className="athletic-btn-secondary" 
          style={{ padding: '4px 10px', fontSize: 11, borderRadius: 20, cursor: 'pointer' }}
          title="Toggle Hands-Free Voice Coach"
        >
          <span style={{ fontSize: 13 }}>{muted ? '🔇' : '🎙️'}</span>
          <span>{muted ? 'Voice Off' : 'Voice Active'}</span>
        </button>
      </div>

      {/* AI Daily Tip & Status */}
      <div style={{ fontSize: 14, lineHeight: 1.4, color: '#e5e7eb', marginBottom: 14, fontWeight: 500 }}>
        "{briefing.aiTip}"
      </div>

      {/* Muscle Readiness Heatmap Bar */}
      <div style={{ background: 'rgba(0, 0, 0, 0.4)', borderRadius: 12, padding: '10px 12px', marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: '#9ca3af', marginBottom: 6, textTransform: 'uppercase' }}>
          <span>Muscle Readiness (Recovery)</span>
          <span style={{ color: '#00f2fe' }}>Live Kinetics</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {/* Chest */}
          <div style={{ textAlign: 'center', padding: '6px 4px', background: 'rgba(255,255,255,0.04)', borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: '#9ca3af' }}>Chest / Push</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: chestStatus.readiness > 70 ? '#ccff00' : '#ff9f0a' }}>
              {chestStatus.readiness}%
            </div>
            <div style={{ fontSize: 9, color: '#6b7280' }}>{chestStatus.status}</div>
          </div>
          {/* Back */}
          <div style={{ textAlign: 'center', padding: '6px 4px', background: 'rgba(255,255,255,0.04)', borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: '#9ca3af' }}>Back / Pull</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: backStatus.readiness > 70 ? '#ccff00' : '#ff9f0a' }}>
              {backStatus.readiness}%
            </div>
            <div style={{ fontSize: 9, color: '#6b7280' }}>{backStatus.status}</div>
          </div>
          {/* Legs */}
          <div style={{ textAlign: 'center', padding: '6px 4px', background: 'rgba(255,255,255,0.04)', borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: '#9ca3af' }}>Legs / Quads</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: legStatus.readiness > 70 ? '#ccff00' : '#ff9f0a' }}>
              {legStatus.readiness}%
            </div>
            <div style={{ fontSize: 9, color: '#6b7280' }}>{legStatus.status}</div>
          </div>
        </div>
      </div>

      {/* Voice Demo Trigger */}
      {!muted && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
          <button 
            onClick={testVoiceCue} 
            style={{ fontSize: 11, color: '#ccff00', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            ▶ Test Voice Cue
          </button>
        </div>
      )}
    </div>
  )
}

