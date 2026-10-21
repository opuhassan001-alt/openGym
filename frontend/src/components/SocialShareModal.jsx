import { useState, useRef } from 'react'
import Icon from './Icon.jsx'
import './NikeThemeLayer.css'

export default function SocialShareModal({ workout, onClose }) {
  const [copied, setCopied] = useState(false)
  const cardRef = useRef(null)

  const dateStr = workout?.d ? new Date(workout.d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TODAY'
  const workoutName = workout?.name || 'TRAINING SESSION'
  const totalVol = Math.round(workout?.vol || 0)
  const totalSets = workout?.entries ? workout.entries.reduce((acc, e) => acc + (e.sets?.length || 0), 0) : 18
  const durationMin = workout?.dur ? Math.round(workout.dur / 60000) : 52

  const handleCopyText = () => {
    const text = `🔥 Just crushed ${workoutName} on openGym!\n📊 Volume: ${totalVol.toLocaleString()} kg | Sets: ${totalSets} | Duration: ${durationMin}m\n⚡ Train Hard. Track Smart.`
    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
      <div style={{ maxWidth: 400, width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Story Card Preview */}
        <div ref={cardRef} className="share-story-card">
          {/* Card Top */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span className="elite-badge">OPENGYM ATHLETE</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.05em' }}>
                {dateStr}
              </span>
            </div>

            <div style={{ fontSize: 26, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#ffffff', lineHeight: 1.15, marginBottom: 8 }}>
              {workoutName}
            </div>

            <div style={{ display: 'inline-block', height: 3, width: 48, background: '#ccff00', borderRadius: 2, marginBottom: 20 }} />
          </div>

          {/* Metrics Center */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, margin: '20px 0' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: 16, padding: 14, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Total Load</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#ccff00', marginTop: 4 }}>
                {totalVol ? totalVol.toLocaleString() : '8,450'} <span style={{ fontSize: 13, color: '#ffffff' }}>KG</span>
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: 16, padding: 14, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Volume Sets</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#00f2fe', marginTop: 4 }}>
                {totalSets} <span style={{ fontSize: 13, color: '#ffffff' }}>SETS</span>
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: 16, padding: 14, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Duration</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#ffffff', marginTop: 4 }}>
                {durationMin} <span style={{ fontSize: 13, color: '#9ca3af' }}>MIN</span>
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: 16, padding: 14, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Intensity</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#ff5500', marginTop: 4 }}>
                RPE 9.0
              </div>
            </div>
          </div>

          {/* Card Bottom / Watermark */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', color: '#ccff00' }}>
              ⚡ NEVER SETTLE
            </span>
            <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>
              OPENGYM ENTERPRISE
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleCopyText} className="athletic-btn" style={{ flex: 1 }}>
            {copied ? '✓ Copied Text!' : '📋 Copy Stats'}
          </button>
          <button onClick={onClose} className="athletic-btn-secondary" style={{ flex: 1 }}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

