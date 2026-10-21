import { useState } from 'react'
import Icon from './Icon.jsx'
import './NikeThemeLayer.css'

export default function BarbellPyramidCalculatorModal({ onClose }) {
  const [targetWeight, setTargetWeight] = useState(100)
  const [barWeight, setBarWeight] = useState(20)

  // Standard scientific warmup percentages (Mark Rippetoe / Olympic Weightlifting standard)
  const warmupSteps = [
    { pct: 0, reps: '2 × 5', label: 'Empty Bar / Movement Activation', weight: barWeight },
    { pct: 40, reps: '5 reps', label: 'Speed & Bar Path Groove', weight: Math.round((targetWeight * 0.4) / 2.5) * 2.5 },
    { pct: 60, reps: '3 reps', label: 'Motor Unit Recruitment', weight: Math.round((targetWeight * 0.6) / 2.5) * 2.5 },
    { pct: 80, reps: '2 reps', label: 'Heavy CNS Potentiation', weight: Math.round((targetWeight * 0.8) / 2.5) * 2.5 },
    { pct: 90, reps: '1 rep', label: 'Final Primer (Zero Fatigue)', weight: Math.round((targetWeight * 0.9) / 2.5) * 2.5 },
    { pct: 100, reps: 'Working Set', label: '🔥 TARGET WORKING LOAD', weight: targetWeight, isTarget: true }
  ]

  // Calculate plate per side for a given weight
  const platesPerSide = (totalW) => {
    let side = Math.max(0, (totalW - barWeight) / 2)
    const available = [25, 20, 15, 10, 5, 2.5, 1.25]
    const loaded = []
    for (const p of available) {
      while (side >= p) {
        loaded.push(p)
        side -= p
      }
    }
    return loaded.length ? loaded.join(' + ') + ' kg' : 'None (Bar only)'
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(12px)',
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
              <span className="elite-badge">WARMUP CALCULATOR</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, textTransform: 'uppercase', color: '#ffffff', marginTop: 4 }}>
              Barbell Warmup Pyramid
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: 24, cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        {/* Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 18 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Target Work Weight (KG)</label>
            <input
              type="number"
              value={targetWeight}
              onChange={e => setTargetWeight(Math.max(20, Number(e.target.value) || 20))}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(204,255,0,0.3)',
                borderRadius: 12,
                color: '#ccff00',
                fontSize: 20,
                fontWeight: 900,
                marginTop: 4
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Bar Weight</label>
            <select
              value={barWeight}
              onChange={e => setBarWeight(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '12px 10px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 700,
                marginTop: 4
              }}
            >
              <option value={20}>20 kg (Olympic)</option>
              <option value={15}>15 kg (Women's)</option>
              <option value={10}>10 kg (Technique)</option>
            </select>
          </div>
        </div>

        {/* Warmup Progression Ladder */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {warmupSteps.map((step, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                borderRadius: 14,
                background: step.isTarget ? 'linear-gradient(90deg, rgba(204,255,0,0.15) 0%, rgba(204,255,0,0.05) 100%)' : 'rgba(255,255,255,0.03)',
                border: step.isTarget ? '1px solid rgba(204,255,0,0.4)' : '1px solid rgba(255,255,255,0.06)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 900,
                    color: step.isTarget ? '#ccff00' : '#00f2fe',
                    background: 'rgba(255,255,255,0.06)',
                    padding: '2px 6px',
                    borderRadius: 6
                  }}>
                    {step.reps}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: step.isTarget ? '#ffffff' : '#e5e7eb' }}>
                    {step.weight} KG
                  </span>
                </div>
                <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>
                  {step.label}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#ccff00' }}>
                  {platesPerSide(step.weight)}
                </div>
                <div style={{ fontSize: 9, color: '#6b7280', textTransform: 'uppercase' }}>
                  Per Side
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button onClick={onClose} className="athletic-btn" style={{ width: '100%' }}>
          Loaded & Ready to Lift
        </button>
      </div>
    </div>
  )
}

