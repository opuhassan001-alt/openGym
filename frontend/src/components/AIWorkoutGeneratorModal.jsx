import { useState } from 'react'
import { voiceCoach } from '../../../brain/voice-engine/voiceCoach.js'
import Icon from './Icon.jsx'
import './NikeThemeLayer.css'

export default function AIWorkoutGeneratorModal({ onClose, onStartWorkout }) {
  const [duration, setDuration] = useState(20) // 15, 20, 30, 45 min
  const [equipment, setEquipment] = useState('dumbbells') // 'dumbbells' | 'bodyweight' | 'barbell' | 'hotel'
  const [focus, setFocus] = useState('fullbody') // 'fullbody' | 'upper' | 'lower' | 'core_hiit'
  const [generatedCircuit, setGeneratedCircuit] = useState(null)

  // Database of hyper-effective rapid circuit templates
  const generateCircuit = () => {
    let exercises = []
    if (equipment === 'dumbbells') {
      if (focus === 'fullbody') {
        exercises = [
          { name: 'Dumbbell Goblet Squat', sets: 4, reps: '12 reps', rest: '45s', tip: 'Focus on full depth' },
          { name: 'Dumbbell Romanian Deadlift', sets: 4, reps: '10 reps', rest: '45s', tip: 'Hinge back, feel hamstrings' },
          { name: 'Dumbbell Flat/Floor Press', sets: 4, reps: '12 reps', rest: '45s', tip: 'Lock out elbows at top' },
          { name: 'Dumbbell Bent-Over Row', sets: 4, reps: '12 reps', rest: '45s', tip: 'Squeeze lats at apex' },
          { name: 'Dumbbell Push Press', sets: 3, reps: '10 reps', rest: '60s', tip: 'Explosive drive with legs' }
        ]
      } else if (focus === 'upper') {
        exercises = [
          { name: 'Dumbbell Overhead Press', sets: 4, reps: '10 reps', rest: '45s', tip: 'Core braced tight' },
          { name: 'Dumbbell Single-Arm Row', sets: 4, reps: '12 reps', rest: '45s', tip: 'Full scapular stretch' },
          { name: 'Dumbbell Floor Chest Flyes', sets: 3, reps: '12 reps', rest: '30s', tip: 'Controlled eccentric' },
          { name: 'Dumbbell Hammer Curls', sets: 3, reps: '15 reps', rest: '30s', tip: 'Constant bicep tension' },
          { name: 'Overhead Dumbbell Extension', sets: 3, reps: '12 reps', rest: '30s', tip: 'Keep elbows tucked' }
        ]
      } else {
        exercises = [
          { name: 'Dumbbell Walking Lunges', sets: 4, reps: '10 / leg', rest: '60s', tip: 'Torso upright' },
          { name: 'Dumbbell Romanian Deadlift', sets: 4, reps: '12 reps', rest: '45s', tip: 'Tight lower back' },
          { name: 'Dumbbell Calf Raises', sets: 4, reps: '20 reps', rest: '30s', tip: 'Pause at peak contraction' }
        ]
      }
    } else if (equipment === 'bodyweight' || equipment === 'hotel') {
      exercises = [
        { name: 'Explosive Jump Squats', sets: 4, reps: '15 reps', rest: '30s', tip: 'Soft landing on balls of feet' },
        { name: 'Tempo Push-ups (3-1-1)', sets: 4, reps: '12-15 reps', rest: '45s', tip: 'Full chest to deck' },
        { name: 'Alternating Reverse Lunges', sets: 4, reps: '12 / leg', rest: '30s', tip: 'Drive through front heel' },
        { name: 'Chair / Bed Tricep Dips', sets: 3, reps: '15 reps', rest: '30s', tip: 'Elbows back' },
        { name: 'Hollow Body Hold', sets: 3, reps: '45 sec', rest: '30s', tip: 'Lower back pressed to floor' }
      ]
    } else {
      exercises = [
        { name: 'Barbell Deadlift', sets: 4, reps: '8 reps', rest: '90s', tip: 'Double overhand tight grip' },
        { name: 'Barbell Bench Press', sets: 4, reps: '8 reps', rest: '90s', tip: 'Retract scapula firmly' },
        { name: 'Barbell Back Squat', sets: 4, reps: '8 reps', rest: '90s', tip: 'Brace into lifting belt' }
      ]
    }

    setGeneratedCircuit(exercises)
    voiceCoach.speak(`Instant ${duration} minute workout generated for ${equipment}! Lock in!`, true)
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
        maxWidth: 480,
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
              <span className="elite-badge">AI WORKOUT GENERATOR</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, textTransform: 'uppercase', color: '#ffffff', marginTop: 4 }}>
              Instant Circuit Builder
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: 24, cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        {!generatedCircuit ? (
          <div>
            {/* 1. Time Available */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Time Window Available</label>
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                {[15, 20, 30, 45].map(m => (
                  <button
                    key={m}
                    onClick={() => setDuration(m)}
                    style={{
                      flex: 1,
                      padding: '8px 0',
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      background: duration === m ? '#ccff00' : 'rgba(255,255,255,0.06)',
                      color: duration === m ? '#000000' : '#ffffff'
                    }}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Equipment on Hand */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Available Equipment</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 6 }}>
                {[
                  { id: 'dumbbells', name: 'Dumbbells Only' },
                  { id: 'bodyweight', name: 'Bodyweight Only' },
                  { id: 'hotel', name: 'Hotel / Minimal' },
                  { id: 'barbell', name: 'Full Barbell' }
                ].map(eq => (
                  <button
                    key={eq.id}
                    onClick={() => setEquipment(eq.id)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: 10,
                      fontSize: 12,
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      background: equipment === eq.id ? 'rgba(0, 242, 254, 0.2)' : 'rgba(255,255,255,0.06)',
                      border: equipment === eq.id ? '1px solid #00f2fe' : '1px solid transparent',
                      color: equipment === eq.id ? '#00f2fe' : '#ffffff'
                    }}
                  >
                    {eq.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Muscle Focus */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Target Training Focus</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 6 }}>
                {[
                  { id: 'fullbody', name: 'Full Body Density' },
                  { id: 'upper', name: 'Upper Body Blast' },
                  { id: 'lower', name: 'Legs & Posterior' },
                  { id: 'core_hiit', name: 'Metabolic & Core' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFocus(f.id)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: 10,
                      fontSize: 12,
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      background: focus === f.id ? 'rgba(204, 255, 0, 0.2)' : 'rgba(255,255,255,0.06)',
                      border: focus === f.id ? '1px solid #ccff00' : '1px solid transparent',
                      color: focus === f.id ? '#ccff00' : '#ffffff'
                    }}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Trigger */}
            <button onClick={generateCircuit} className="athletic-btn" style={{ width: '100%', padding: 14 }}>
              ⚡ Generate Optimized {duration}-Min Circuit
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#ccff00' }}>
                {duration} MIN · {equipment.toUpperCase()} · {focus.toUpperCase()}
              </span>
              <button
                onClick={() => setGeneratedCircuit(null)}
                style={{ fontSize: 11, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Change Inputs
              </button>
            </div>

            {/* Generated Routine List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
              {generatedCircuit.map((ex, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 14,
                    padding: '10px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#ffffff' }}>
                      {idx + 1}. {ex.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#00f2fe', marginTop: 2 }}>
                      {ex.sets} sets · {ex.reps} · Rest {ex.rest}
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: '#9ca3af', maxWidth: 120, textAlign: 'right' }}>
                    {ex.tip}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={onClose} className="athletic-btn" style={{ flex: 1 }}>
                🔥 Start Crushing It
              </button>
              <button onClick={() => setGeneratedCircuit(null)} className="athletic-btn-secondary" style={{ flex: 1 }}>
                Reroll
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

