import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './InteractiveMuscleMapSection.css'

let PATHS_CACHE = null
let PATHS_PENDING = null

function useBodyPaths() {
  const [paths, setPaths] = useState(PATHS_CACHE)
  useEffect(() => {
    if (PATHS_CACHE) {
      setPaths(PATHS_CACHE)
      return
    }
    let alive = true
    PATHS_PENDING = PATHS_PENDING || import('../lib/body-paths.js').then(m => (PATHS_CACHE = m.default))
    PATHS_PENDING.then(p => {
      if (alive) setPaths(p)
    }).catch(() => {})
    return () => { alive = false }
  }, [])
  return paths
}

// Comprehensive muscle kinetics data
const MUSCLE_DETAILS = {
  chest: {
    name: 'Chest',
    latin: 'Pectoralis Major & Pectoralis Minor',
    slug: 'chest',
    recovery: 94,
    status: 'Optimal Readiness',
    statusClass: 'ready',
    lastTrained: '48h ago',
    optimalWindow: '48h – 72h',
    fatigueIndex: 'Low Local Fatigue',
    summary: 'Primary horizontal press engine. Controls humeral adduction, horizontal flexion, and shoulder internal rotation under axial load.',
    topEx: 'Incline Barbell Bench Press',
    exercises: [
      { name: 'Incline Barbell Bench Press', eq: 'Barbell', target: 'Upper Clavicular Head', setsReps: '3 × 6–8' },
      { name: 'Flat Dumbbell Press', eq: 'Dumbbell', target: 'Mid Sternal Head', setsReps: '4 × 8–10' },
      { name: 'Weighted Chest Dips', eq: 'Bodyweight', target: 'Lower Costal Margin', setsReps: '3 × 8–12' },
      { name: 'Standing Low-to-High Cable Flyes', eq: 'Cable', target: 'Upper Chest Fiber Peak', setsReps: '3 × 12–15' },
    ]
  },
  'upper-back': {
    name: 'Upper Back & Lats',
    latin: 'Latissimus Dorsi, Rhomboidei & Trapezius',
    slug: 'upper-back',
    recovery: 88,
    status: 'Optimal Readiness',
    statusClass: 'ready',
    lastTrained: '60h ago',
    optimalWindow: '48h – 72h',
    fatigueIndex: 'Moderate Local Recovery',
    summary: 'Primary kinetic anchor for vertical pulling, scapular retraction, and spinal stabilization under heavy axial loads.',
    topEx: 'Conventional Barbell Deadlift',
    exercises: [
      { name: 'Conventional Barbell Deadlift', eq: 'Barbell', target: 'Posterior Kinetic Chain', setsReps: '3 × 5' },
      { name: 'Weighted Neutral-Grip Pull-ups', eq: 'Bodyweight', target: 'Latissimus Dorsi Width', setsReps: '4 × 6–8' },
      { name: 'Bent-Over Barbell Rows (45°)', eq: 'Barbell', target: 'Mid-Back Thickness & Rhomboids', setsReps: '4 × 8–10' },
      { name: 'Chest-Supported Incline Row', eq: 'Dumbbell', target: 'Scapular Retractors', setsReps: '3 × 10–12' },
    ]
  },
  deltoids: {
    name: 'Shoulders',
    latin: 'Deltoideus (Anterior, Lateral & Posterior)',
    slug: 'deltoids',
    recovery: 91,
    status: 'Optimal Readiness',
    statusClass: 'ready',
    lastTrained: '72h ago',
    optimalWindow: '48h – 72h',
    fatigueIndex: 'Negligible Fatigue',
    summary: 'Tri-headed shoulder stabilizer and prime mover for humeral abduction, flexion, and transverse extension.',
    topEx: 'Standing Overhead Military Press',
    exercises: [
      { name: 'Standing Overhead Military Press', eq: 'Barbell', target: 'Anterior & Lateral Head', setsReps: '4 × 5–8' },
      { name: 'Dumbbell Lateral Raises (Strict)', eq: 'Dumbbell', target: 'Lateral Deltoid Peak', setsReps: '4 × 12–15' },
      { name: 'Seated Dumbbell Shoulder Press', eq: 'Dumbbell', target: 'Complete Shoulder Complex', setsReps: '3 × 8–10' },
      { name: 'Face Pulls with External Rotation', eq: 'Cable', target: 'Rear Deltoid & Rotator Cuff', setsReps: '4 × 15' },
    ]
  },
  biceps: {
    name: 'Arms',
    latin: 'Biceps Brachii, Brachialis & Triceps Brachii',
    slug: 'biceps',
    recovery: 96,
    status: 'Prime Readiness',
    statusClass: 'ready',
    lastTrained: '72h ago',
    optimalWindow: '48h – 72h',
    fatigueIndex: 'Full Recovery',
    summary: 'Governs elbow flexion, forearm supination, and elbow extension lockout across compound pressing and pulling.',
    topEx: 'Incline Dumbbell Bicep Curl',
    exercises: [
      { name: 'Incline Dumbbell Bicep Curl', eq: 'Dumbbell', target: 'Long Head Stretch', setsReps: '4 × 10–12' },
      { name: 'Overhead Cable Triceps Extension', eq: 'Cable', target: 'Triceps Long Head', setsReps: '4 × 12–15' },
      { name: 'Standing EZ-Bar Bicep Curl', eq: 'Barbell', target: 'Biceps Peak & Brachialis', setsReps: '3 × 8–10' },
      { name: 'Close-Grip Barbell Bench Press', eq: 'Barbell', target: 'Triceps Lateral & Medial Head', setsReps: '3 × 6–8' },
    ]
  },
  abs: {
    name: 'Core / Abs',
    latin: 'Rectus Abdominis, Obliquus Externus & Transversus',
    slug: 'abs',
    recovery: 85,
    status: 'Active Recovery',
    statusClass: 'ready',
    lastTrained: '24h ago',
    optimalWindow: '24h – 48h',
    fatigueIndex: 'Mild Local Soreness',
    summary: 'Primary anterior core brace. Prevents spinal hyperextension, transfers torsional torque, and stabilizes intra-abdominal pressure.',
    topEx: 'Hanging Leg Raises (Strict)',
    exercises: [
      { name: 'Hanging Leg Raises (Strict)', eq: 'Bodyweight', target: 'Lower Rectus Abdominis', setsReps: '4 × 12–15' },
      { name: 'Heavy Cable Woodchoppers', eq: 'Cable', target: 'Rotational Obliques', setsReps: '3 × 12/side' },
      { name: 'Ab Wheel Rollouts from Knees', eq: 'Bodyweight', target: 'Anti-Extension Stability', setsReps: '3 × 10–12' },
      { name: 'Weighted Decline Crunches', eq: 'Bodyweight', target: 'Upper Rectus Abdominis', setsReps: '3 × 15' },
    ]
  },
  quadriceps: {
    name: 'Quads',
    latin: 'Quadriceps Femoris (Vastus Lateralis, Medialis & Rectus)',
    slug: 'quadriceps',
    recovery: 98,
    status: 'Prime Readiness',
    statusClass: 'ready',
    lastTrained: '96h ago',
    optimalWindow: '72h – 96h',
    fatigueIndex: 'Full Systemic Recovery',
    summary: 'Highest force-producing muscle complex in the human body. Responsible for knee extension and axial drive.',
    topEx: 'Barbell High-Bar Back Squat',
    exercises: [
      { name: 'Barbell High-Bar Back Squat', eq: 'Barbell', target: 'Complete Quad & Core Complex', setsReps: '4 × 5–8' },
      { name: 'Bulgarian Split Squats', eq: 'Dumbbell', target: 'Vastus Lateralis & Glute Drive', setsReps: '3 × 8–10' },
      { name: 'Heavy 45° Leg Press', eq: 'Machine', target: 'Maximal Hypertrophic Load', setsReps: '4 × 10–12' },
      { name: 'Seated Leg Extensions (Tempo)', eq: 'Machine', target: 'Vastus Medialis Lockout', setsReps: '3 × 15' },
    ]
  },
  hamstring: {
    name: 'Hamstrings',
    latin: 'Biceps Femoris, Semitendinosus & Gluteus Maximus',
    slug: 'hamstring',
    recovery: 90,
    status: 'Optimal Readiness',
    statusClass: 'ready',
    lastTrained: '72h ago',
    optimalWindow: '72h – 96h',
    fatigueIndex: 'Low Local Fatigue',
    summary: 'Primary hip hinge and knee flexion engine. Directs athletic sprint acceleration and ground force absorption.',
    topEx: 'Romanian Barbell Deadlift (RDL)',
    exercises: [
      { name: 'Romanian Barbell Deadlift (RDL)', eq: 'Barbell', target: 'Hamstring Insertion & Glutes', setsReps: '4 × 8–10' },
      { name: 'Lying Leg Curl (Controlled Eccentric)', eq: 'Machine', target: 'Biceps Femoris Isolation', setsReps: '3 × 10–12' },
      { name: 'Barbell Hip Thrust with Pause', eq: 'Barbell', target: 'Gluteus Maximus Peak Lockout', setsReps: '4 × 8–10' },
    ]
  },
  calves: {
    name: 'Calves',
    latin: 'Gastrocnemius, Soleus & Tibialis Anterior',
    slug: 'calves',
    recovery: 95,
    status: 'Prime Readiness',
    statusClass: 'ready',
    lastTrained: '48h ago',
    optimalWindow: '24h – 48h',
    fatigueIndex: 'Negligible Fatigue',
    summary: 'Governs ankle plantarflexion, ground reaction force, and lower-body shock stabilization.',
    topEx: 'Standing Barbell Calf Raises',
    exercises: [
      { name: 'Standing Barbell Calf Raises', eq: 'Barbell', target: 'Gastrocnemius Medial/Lateral', setsReps: '4 × 12–15' },
      { name: 'Seated Machine Calf Raises', eq: 'Machine', target: 'Soleus Deep Head', setsReps: '3 × 15–20' },
      { name: 'Tibialis Anterior Wall Raises', eq: 'Bodyweight', target: 'Anterior Ankle Decelerators', setsReps: '3 × 20' },
    ]
  }
}

// Strict 1:1 Muscle Isolation Map (Zero bleeding, no accidental multiple muscle highlights)
const HIGHLIGHT_MAP = {
  chest: ['chest'],
  'upper-back': ['upper-back', 'lower-back', 'trapezius'],
  deltoids: ['deltoids'],
  biceps: ['biceps', 'triceps', 'forearm'],
  abs: ['abs', 'obliques', 'serratus'],
  quadriceps: ['quadriceps', 'hip-flexors'],
  hamstring: ['hamstring', 'gluteal', 'adductors'],
  calves: ['calves', 'tibialis']
}

// Complete anatomical slug mapping (Every muscle on the body belongs to a valid target)
const SLUG_TO_MUSCLE = {
  // Chest
  chest: 'chest',
  // Back & Lats
  'upper-back': 'upper-back',
  'lower-back': 'upper-back',
  trapezius: 'upper-back',
  // Shoulders
  deltoids: 'deltoids',
  // Arms
  biceps: 'biceps',
  triceps: 'biceps',
  forearm: 'biceps',
  // Core / Abs
  abs: 'abs',
  obliques: 'abs',
  serratus: 'abs',
  // Quads
  quadriceps: 'quadriceps',
  'hip-flexors': 'quadriceps',
  // Hamstrings & Glutes
  hamstring: 'hamstring',
  gluteal: 'hamstring',
  adductors: 'hamstring',
  // Calves
  calves: 'calves',
  tibialis: 'calves'
}

export default function InteractiveMuscleMapSection() {
  const nav = useNavigate()
  const [selectedMuscle, setSelectedMuscle] = useState('upper-back')
  const [twoDView, setTwoDView] = useState('back') // 'front' | 'back'
  const pathsData = useBodyPaths()

  const detail = useMemo(() => {
    return MUSCLE_DETAILS[selectedMuscle] || MUSCLE_DETAILS['upper-back']
  }, [selectedMuscle])

  // Explicit user toggle of Front / Back perspective (Does NOT mutate selectedMuscle)
  const handleToggleView = (view) => {
    setTwoDView(view)
  }

  // Seamless muscle selection with smart perspective switch only when strictly required
  const handleSelectMuscle = (muscleId) => {
    setSelectedMuscle(muscleId)
    if (muscleId === 'chest' || muscleId === 'abs' || muscleId === 'quadriceps') {
      setTwoDView('front')
    } else if (muscleId === 'upper-back' || muscleId === 'hamstring') {
      setTwoDView('back')
    }
  }

  const muscleList = [
    { id: 'chest', label: 'Chest' },
    { id: 'upper-back', label: 'Back & Lats' },
    { id: 'deltoids', label: 'Shoulders' },
    { id: 'biceps', label: 'Arms' },
    { id: 'abs', label: 'Core / Abs' },
    { id: 'quadriceps', label: 'Quads' },
    { id: 'hamstring', label: 'Hamstrings' },
    { id: 'calves', label: 'Calves' },
  ]

  // Active highlighted muscle parts in 2D SVG
  const activeGreenParts = useMemo(() => {
    if (selectedMuscle === 'biceps') {
      return twoDView === 'front' ? ['biceps', 'forearm'] : ['triceps', 'forearm']
    }
    return HIGHLIGHT_MAP[selectedMuscle] || [selectedMuscle]
  }, [selectedMuscle, twoDView])

  // Retrieve SVG paths for male front or back
  const currentSvgView = pathsData?.male ? pathsData.male[twoDView] : null

  return (
    <section className="interactive-muscle-section" id="interactive-muscle-map">
      <div className="interactive-muscle-container">
        {/* Section Header */}
        <div className="muscle-section-header">
          <h2 className="muscle-section-title">
            Interactive Body Muscle Map
          </h2>
          <p className="muscle-section-desc">
            Visualise full-body muscle kinetics, fatigue distribution, and readiness scores. Select any muscle group to inspect recovery status and targeted compound exercises.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="muscle-grid-display">
          
          {/* Left: Picture-Perfect UNIQ Palette Anatomy Card */}
          <div
            className="muscle-visualizer-card"
            style={{
              background: '#09071D',
              borderRadius: '24px',
              border: '1px solid rgba(69, 109, 139, 0.28)',
              boxShadow: '0 16px 40px -8px rgba(9, 7, 29, 0.7)',
              padding: '24px 28px 20px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              width: '100%',
            }}
          >
            {/* Top Bar inside Card: Front / Back Toggle */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  background: '#0A1A32',
                  padding: '3px',
                  borderRadius: '9999px',
                  gap: 2,
                  border: '1px solid rgba(69, 109, 139, 0.2)',
                }}
              >
                <button
                  type="button"
                  onClick={() => handleToggleView('front')}
                  style={{
                    padding: '4px 14px',
                    borderRadius: '9999px',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: twoDView === 'front' ? '#1B415D' : 'transparent',
                    color: twoDView === 'front' ? '#E8EFF5' : '#456D8B',
                    boxShadow: twoDView === 'front' ? '0 2px 8px rgba(27, 65, 93, 0.5)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Front
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleView('back')}
                  style={{
                    padding: '4px 14px',
                    borderRadius: '9999px',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: twoDView === 'back' ? '#1B415D' : 'transparent',
                    color: twoDView === 'back' ? '#E8EFF5' : '#456D8B',
                    boxShadow: twoDView === 'back' ? '0 2px 8px rgba(27, 65, 93, 0.5)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Back
                </button>
              </div>
            </div>

            {/* Body Display: Pure 2D Anatomical Vector (Exact Reference Match) */}
            <div
              style={{
                width: '100%',
                height: '380px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px 0',
              }}
            >
              {currentSvgView ? (
                <svg
                  viewBox={currentSvgView.vb}
                  style={{
                    height: '100%',
                    width: 'auto',
                    maxHeight: '380px',
                    overflow: 'visible',
                  }}
                >
                  {/* Render Inert Silhouette and Interactive Muscles with UNIQ Palette */}
                  {Object.entries(currentSvgView.p).map(([slug, paths]) => {
                    const isGreen = activeGreenParts.includes(slug)
                    const targetMuscle = SLUG_TO_MUSCLE[slug]
                    const isInteractive = Boolean(targetMuscle)
                    const pathClass = !isInteractive
                      ? 'bm-path-inert'
                      : isGreen
                      ? 'bm-path-active'
                      : 'bm-path-interactive'

                    return (
                      <g key={slug}>
                        {paths.map((d, idx) => (
                          <path
                            key={idx}
                            d={d}
                            className={pathClass}
                            onClick={isInteractive ? () => handleSelectMuscle(targetMuscle) : undefined}
                          />
                        ))}
                      </g>
                    )
                  })}
                </svg>
              ) : (
                <div style={{ height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#456D8B', fontSize: '13px' }}>
                  Loading anatomical map...
                </div>
              )}
            </div>

            {/* Subtle Divider Line */}
            <div style={{ height: '1px', background: 'rgba(8, 105, 114, 0.45)', margin: '20px 0 14px' }} />

            {/* Bottom Row: Recovery Ramp + Selected Muscle */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
            >
              {/* Left: Recovery Ramp with 4-Tone Palette Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '13px', color: '#16B978', fontWeight: 600 }}>
                  Recovery Ramp:
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 14, height: 14, borderRadius: 3, background: '#A7FF84', boxShadow: '0 0 8px rgba(167, 255, 132, 0.6)' }} title="#A7FF84 (Fresh / 90–100%)" />
                  <span style={{ width: 14, height: 14, borderRadius: 3, background: '#16B978' }} title="#16B978 (Optimal / 70–89%)" />
                  <span style={{ width: 14, height: 14, borderRadius: 3, background: '#086972' }} title="#086972 (Recovering / 40–69%)" />
                  <span style={{ width: 14, height: 14, borderRadius: 3, background: '#071A52', border: '1.5px solid #16B978' }} title="#071A52 (Fatigued / <40%)" />
                </div>
              </div>

              {/* Right: Selected Muscle Label */}
              <div style={{ fontSize: '13px', color: '#16B978' }}>
                Selected: <strong style={{ color: '#A7FF84', fontWeight: 700, textShadow: '0 0 10px rgba(167, 255, 132, 0.35)' }}>{detail.name}</strong>
              </div>
            </div>

            {/* 8 Muscle Selection Buttons (Directly below in the Same Card Layout) */}
            <div
              className="muscle-quick-chips"
              style={{
                width: '100%',
                justifyContent: 'center',
                marginTop: 16,
                paddingTop: 14,
                borderTop: '1px dashed rgba(8, 105, 114, 0.45)',
              }}
            >
              {muscleList.map((m) => (
                <button
                  key={m.id}
                  className={`quick-chip ${selectedMuscle === m.id ? 'active' : ''}`}
                  onClick={() => handleSelectMuscle(m.id)}
                >
                  {m.label}
                </button>
              ))}
            </div>

          </div>

          {/* Right: Kinetic Diagnostics & Exercise Repertoire Panel */}
          <div className="muscle-detail-panel">
            <div className="detail-header-badge ready">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{detail.status}</span>
            </div>

            <h3 className="detail-muscle-name">{detail.name}</h3>
            <div className="detail-latin-name">{detail.latin}</div>

            <p style={{ fontSize: 13, color: '#CBD5E1', lineHeight: 1.5, margin: '0 0 20px' }}>
              {detail.summary}
            </p>

            <div className="detail-metrics-grid">
              <div className="metric-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="metric-card-label">Readiness Index</div>
                  <span style={{ fontSize: '10px', color: '#16B978', fontWeight: 800, letterSpacing: '0.04em' }}>
                    {detail.recovery >= 90 ? 'PEAK' : detail.recovery >= 70 ? 'OPTIMAL' : 'ACTIVE'}
                  </span>
                </div>
                <div className="metric-card-val" style={{ color: '#A7FF84', textShadow: '0 0 12px rgba(167, 255, 132, 0.4)' }}>{detail.recovery}%</div>
                
                {/* Right Recovery Color Bar Meter */}
                <div style={{ marginTop: 6, marginBottom: 6 }}>
                  <div style={{ height: 6, width: '100%', background: '#071A52', borderRadius: 999, overflow: 'hidden', border: '1px solid #086972' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${detail.recovery}%`,
                        background: 'linear-gradient(90deg, #086972 0%, #16B978 50%, #A7FF84 100%)',
                        borderRadius: 999,
                        boxShadow: '0 0 8px rgba(167, 255, 132, 0.6)',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                </div>

                <div className="metric-card-sub" style={{ color: '#A7FF84', textShadow: '0 0 12px rgba(167, 255, 132, 0.4)' }}>{detail.fatigueIndex}</div>
              </div>
              <div className="metric-card">
                <div className="metric-card-label">Recovery Window</div>
                <div className="metric-card-val" style={{ fontSize: 16 }}>{detail.optimalWindow}</div>
                <div className="metric-card-sub" style={{ color: '#94A3B8' }}>Last trained: {detail.lastTrained}</div>
              </div>
            </div>

            {/* Right Panel Recovery Scale Color Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: 'rgba(8, 105, 114, 0.25)',
                border: '1px solid rgba(8, 105, 114, 0.4)',
                borderRadius: '12px',
                marginBottom: '20px',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Color Scale:
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '11px', color: '#A7FF84', fontWeight: 700 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: '#A7FF84', boxShadow: '0 0 6px #A7FF84' }} /> Fresh
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '11px', color: '#16B978', fontWeight: 600 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: '#16B978' }} /> Optimal
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '11px', color: '#5EEAD4', fontWeight: 600 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: '#086972', border: '1px solid #16B978' }} /> Active
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: '#071A52', border: '1px solid #086972' }} /> Rest
                </span>
              </div>
            </div>

            {/* High-Yield Targeted Exercises */}
            <div className="detail-exercises-section">
              <div className="detail-section-title">High-Yield Target Exercises</div>
              <div className="exercise-list-box">
                {detail.exercises.map((ex, idx) => (
                  <div key={idx} className="target-exercise-row">
                    <div className="ex-info-left">
                      <span className="ex-name">{ex.name}</span>
                      <span className="ex-meta">{ex.target} · Optimal: {ex.setsReps}</span>
                    </div>
                    <span className="ex-badge-equipment">{ex.eq}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="muscle-detail-actions">
              <button
                className="panel-btn-primary"
                onClick={() => nav('/library')}
              >
                <span>View Full Library Exercises</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <button
                className="panel-btn-secondary"
                onClick={() => nav('/workout')}
              >
                <span>Log Routine</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
