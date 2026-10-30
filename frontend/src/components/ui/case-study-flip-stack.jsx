import React, { useRef, useState, useMemo } from 'react'
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import {
  Activity,
  Cpu,
  Dumbbell,
  Timer,
  Flame,
  Trophy,
  Zap,
  ChevronRight,
  ArrowDown,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Droplets,
  Layers,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import './case-study-flip-stack.css'

/* ==========================================================================
   DEFAULT CARDS DATA - 6 CORE OPEN-GYM ENGINES IN STRICT REQUESTED ORDER:
   1. Animated muscle map of fatigue explorer (Card 1)
   2. AI workout generator (Card 2)
   3. Olympic Barbell & Plate Math Calculator (Card 3)
   4. High-Intensity Interval Timer Suite (Card 4)
   5. Macro Nutrition & Hydration Equalizer (Card 5)
   6. Branch Leaderboard & Athlete Gamification (Card 6)
   ========================================================================== */

function MuscleMapInteractivePreview({ onLaunch }) {
  const [selectedMuscle, setSelectedMuscle] = useState('chest')
  const [view, setView] = useState('front')

  const muscles = {
    chest: { label: 'Chest (Pectoralis)', recovery: 94, status: 'Recovered & Ready', color: '#00F59B' },
    delts: { label: 'Shoulders (Deltoids)', recovery: 88, status: 'Optimal Tension', color: '#00F59B' },
    quads: { label: 'Quads (Femoralis)', recovery: 38, status: 'High Fatigue (24h rest)', color: '#F59E0B' },
    lats: { label: 'Back (Latissimus)', recovery: 82, status: 'Primed for Overload', color: '#06B6D4' },
    core: { label: 'Abs & Obliques', recovery: 96, status: 'Core Stabilized', color: '#00F59B' },
  }

  const active = muscles[selectedMuscle] || muscles.chest

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Top selector pills */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['front', 'back'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                border: view === v ? '1px solid #00F59B' : '1px solid rgba(255,255,255,0.1)',
                background: view === v ? 'rgba(0,245,155,0.15)' : 'rgba(255,255,255,0.03)',
                color: view === v ? '#00F59B' : '#94a3b8',
                cursor: 'pointer',
              }}
            >
              {v} view
            </button>
          ))}
        </div>
        <span style={{ fontSize: '11px', color: '#00F59B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Activity size={12} /> Live Biometrics
        </span>
      </div>

      {/* Anatomical Preview Graphic */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '120px 1fr',
          gap: '16px',
          alignItems: 'center',
          background: 'rgba(5, 12, 22, 0.75)',
          padding: '16px',
          borderRadius: '16px',
          border: '1px solid rgba(0, 245, 155, 0.15)',
        }}
      >
        {/* Stylized Anatomical SVG Figure */}
        <div style={{ position: 'relative', height: '140px', display: 'flex', justifyContent: 'center' }}>
          <svg viewBox="0 0 100 160" style={{ height: '100%', filter: 'drop-shadow(0 0 12px rgba(0,245,155,0.25))' }}>
            {/* Head */}
            <circle cx="50" cy="18" r="12" fill="#1b2a3a" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
            {/* Torso */}
            <path
              d="M32 34 L68 34 L62 82 L38 82 Z"
              fill={selectedMuscle === 'chest' || selectedMuscle === 'core' ? 'rgba(0,245,155,0.35)' : '#1b2a3a'}
              stroke={selectedMuscle === 'chest' ? '#00F59B' : 'rgba(255,255,255,0.15)'}
              strokeWidth="2"
              onClick={() => setSelectedMuscle(selectedMuscle === 'chest' ? 'core' : 'chest')}
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
            />
            {/* Shoulders / Delts */}
            <circle
              cx="24" cy="38" r="8"
              fill={selectedMuscle === 'delts' ? 'rgba(0,245,155,0.5)' : '#1b2a3a'}
              stroke={selectedMuscle === 'delts' ? '#00F59B' : 'rgba(255,255,255,0.15)'}
              strokeWidth="1.5"
              onClick={() => setSelectedMuscle('delts')}
              style={{ cursor: 'pointer' }}
            />
            <circle
              cx="76" cy="38" r="8"
              fill={selectedMuscle === 'delts' ? 'rgba(0,245,155,0.5)' : '#1b2a3a'}
              stroke={selectedMuscle === 'delts' ? '#00F59B' : 'rgba(255,255,255,0.15)'}
              strokeWidth="1.5"
              onClick={() => setSelectedMuscle('delts')}
              style={{ cursor: 'pointer' }}
            />
            {/* Arms */}
            <line x1="22" y1="46" x2="16" y2="85" stroke="#1b2a3a" strokeWidth="6" strokeLinecap="round" />
            <line x1="78" y1="46" x2="84" y2="85" stroke="#1b2a3a" strokeWidth="6" strokeLinecap="round" />
            {/* Legs / Quads */}
            <path
              d="M38 86 L48 86 L44 148 L34 148 Z"
              fill={selectedMuscle === 'quads' ? 'rgba(245,158,11,0.45)' : '#1b2a3a'}
              stroke={selectedMuscle === 'quads' ? '#F59E0B' : 'rgba(255,255,255,0.15)'}
              strokeWidth="1.5"
              onClick={() => setSelectedMuscle('quads')}
              style={{ cursor: 'pointer' }}
            />
            <path
              d="M52 86 L62 86 L66 148 L56 148 Z"
              fill={selectedMuscle === 'quads' ? 'rgba(245,158,11,0.45)' : '#1b2a3a'}
              stroke={selectedMuscle === 'quads' ? '#F59E0B' : 'rgba(255,255,255,0.15)'}
              strokeWidth="1.5"
              onClick={() => setSelectedMuscle('quads')}
              style={{ cursor: 'pointer' }}
            />
          </svg>
        </div>

        {/* Dynamic Telemetry Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>
            {active.label}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '26px', fontWeight: 800, color: active.color, fontFamily: 'monospace' }}>
              {active.recovery}%
            </span>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Fatigue Recovery</span>
          </div>
          {/* Progress Bar */}
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${active.recovery}%`, height: '100%', background: active.color, transition: 'width 0.4s ease' }} />
          </div>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>
            Status: <strong style={{ color: active.color }}>{active.status}</strong>
          </span>
        </div>
      </div>

      {/* Quick Muscle Selector Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {Object.keys(muscles).map(key => (
          <button
            key={key}
            onClick={() => setSelectedMuscle(key)}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 600,
              border: selectedMuscle === key ? `1px solid ${muscles[key].color}` : '1px solid rgba(255,255,255,0.06)',
              background: selectedMuscle === key ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
              color: selectedMuscle === key ? '#ffffff' : '#64748b',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  )
}

function AIWorkoutInteractivePreview({ onLaunch }) {
  const [split, setSplit] = useState('Push Protocol')

  const routines = {
    'Push Protocol': [
      { name: 'Incline Barbell Bench', sets: '4 sets × 8-10 reps', rpe: 'RPE 8.5' },
      { name: 'Overhead Dumbbell Press', sets: '3 sets × 10 reps', rpe: 'RPE 8.0' },
      { name: 'Cable Lateral Raises', sets: '3 sets × 15 reps', rpe: 'RPE 9.0' },
    ],
    'Pull Hypertrophy': [
      { name: 'Deadlift (Competition Style)', sets: '4 sets × 5 reps', rpe: 'RPE 8.5' },
      { name: 'Neutral Grip Chest Supported Row', sets: '3 sets × 10 reps', rpe: 'RPE 8.0' },
      { name: 'Incline Dumbbell Bicep Curl', sets: '3 sets × 12 reps', rpe: 'RPE 8.5' },
    ],
    'Legs & Posterior': [
      { name: 'Safety Bar Squats', sets: '4 sets × 8 reps', rpe: 'RPE 8.5' },
      { name: 'Romanian Deadlift (RDL)', sets: '3 sets × 10 reps', rpe: 'RPE 8.0' },
      { name: 'Standing Calf Raise', sets: '4 sets × 15 reps', rpe: 'RPE 9.0' },
    ],
  }

  const activeRoutine = routines[split] || routines['Push Protocol']

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#A855F7', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Cpu size={13} /> NEURAL PROGRESSIVE OVERLOAD
        </span>
        <span style={{ fontSize: '11px', color: '#94a3b8' }}>Est. ~48 min</span>
      </div>

      {/* Split Selector */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {Object.keys(routines).map(s => (
          <button
            key={s}
            onClick={() => setSplit(s)}
            style={{
              flex: 1,
              padding: '6px 4px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 700,
              border: split === s ? '1px solid #A855F7' : '1px solid rgba(255,255,255,0.08)',
              background: split === s ? 'rgba(168,85,247,0.18)' : 'rgba(255,255,255,0.03)',
              color: split === s ? '#ffffff' : '#94a3b8',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Generated Sequence Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {activeRoutine.map((item, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: '10px',
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: '#A855F7', fontFamily: 'monospace', fontWeight: 700 }}>
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff' }}>
                {item.name}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>{item.sets}</span>
              <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: 'rgba(168,85,247,0.2)', color: '#d8b4fe' }}>
                {item.rpe}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BarbellPyramidInteractivePreview({ onLaunch }) {
  const [targetWeight, setTargetWeight] = useState(140)

  // Olympic Bar Math (20kg bar)
  const perSide = Math.max(0, (targetWeight - 20) / 2)
  const plates25 = Math.floor(perSide / 25)
  const rem25 = perSide % 25
  const plates20 = Math.floor(rem25 / 20)
  const rem20 = rem25 % 20
  const plates10 = Math.floor(rem20 / 10)
  const rem10 = rem20 % 10
  const plates5 = Math.floor(rem10 / 5)

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Dumbbell size={13} /> OLYMPIC BARBELL MATH
        </span>
        <span style={{ fontSize: '11px', color: '#94a3b8' }}>Standard 20kg Sleeve</span>
      </div>

      {/* Target Weight Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(24, 24, 27, 0.8)',
          padding: '12px 16px',
          borderRadius: '14px',
          border: '1px solid rgba(245, 158, 11, 0.2)',
        }}
      >
        <div>
          <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Target Load</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', fontFamily: 'monospace' }}>
            {targetWeight} <span style={{ fontSize: '14px', color: '#F59E0B' }}>KG</span>
            <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '6px' }}>({Math.round(targetWeight * 2.20462)} lbs)</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setTargetWeight(w => Math.max(20, w - 5))}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#ffffff',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            -5kg
          </button>
          <button
            onClick={() => setTargetWeight(w => w + 5)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.2)',
              border: '1px solid #F59E0B',
              color: '#ffffff',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            +5kg
          </button>
        </div>
      </div>

      {/* Barbell Plate Configuration Graphic */}
      <div
        style={{
          background: 'rgba(10, 10, 12, 0.7)',
          padding: '14px',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px' }}>
          Each Sleeve Load ({perSide} kg):
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {/* Barbell Collar */}
          <div style={{ width: '12px', height: '40px', background: '#475569', borderRadius: '2px' }} title="Bar Collar" />
          {plates25 > 0 && Array.from({ length: plates25 }).map((_, i) => (
            <div key={`25-${i}`} style={{ width: '18px', height: '62px', background: '#EF4444', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 800, color: '#fff' }}>
              25
            </div>
          ))}
          {plates20 > 0 && Array.from({ length: plates20 }).map((_, i) => (
            <div key={`20-${i}`} style={{ width: '16px', height: '54px', background: '#3B82F6', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 800, color: '#fff' }}>
              20
            </div>
          ))}
          {plates10 > 0 && Array.from({ length: plates10 }).map((_, i) => (
            <div key={`10-${i}`} style={{ width: '14px', height: '44px', background: '#10B981', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 800, color: '#fff' }}>
              10
            </div>
          ))}
          {plates5 > 0 && Array.from({ length: plates5 }).map((_, i) => (
            <div key={`5-${i}`} style={{ width: '12px', height: '36px', background: '#ffffff', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 800, color: '#000' }}>
              5
            </div>
          ))}
          <div style={{ width: '8px', height: '24px', background: '#F59E0B', borderRadius: '2px' }} title="Spring Collar 2.5kg" />
        </div>
      </div>
    </div>
  )
}

function IntervalTimerInteractivePreview({ onLaunch }) {
  const [mode, setMode] = useState('Tabata')
  const [isRunning, setIsRunning] = useState(false)

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#EF4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Timer size={13} /> METABOLIC TEMPO ENGINE
        </span>
        <span style={{ fontSize: '11px', color: '#94a3b8' }}>Round 4 of 8</span>
      </div>

      {/* Big Digital Athletic Timer Screen */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle, rgba(239,68,68,0.18) 0%, rgba(15,10,14,0.85) 75%)',
          padding: '18px',
          borderRadius: '16px',
          border: '1px solid rgba(239,68,68,0.25)',
          position: 'relative',
        }}
      >
        <span style={{ fontSize: '10px', color: '#EF4444', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Work Interval
        </span>
        <div style={{ fontSize: '42px', fontWeight: 900, color: '#ffffff', fontFamily: 'monospace', letterSpacing: '0.04em', lineHeight: 1.1 }}>
          00:18<span style={{ fontSize: '20px', color: '#EF4444' }}>.4</span>
        </div>
        <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(r => (
            <div
              key={r}
              style={{
                width: '14px',
                height: '4px',
                borderRadius: '2px',
                background: r <= 4 ? '#EF4444' : 'rgba(255,255,255,0.1)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Modes */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {['Tabata (20/10)', 'EMOM 1m', 'AMRAP 15m'].map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              flex: 1,
              padding: '6px 4px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 700,
              border: mode === m ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.08)',
              background: mode === m ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.03)',
              color: mode === m ? '#ffffff' : '#94a3b8',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  )
}

function MacroNutritionInteractivePreview({ onLaunch }) {
  const [waterGlasses, setWaterGlasses] = useState(6)

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#06B6D4', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Droplets size={13} /> CELLULAR NUTRITION MATRIX
        </span>
        <span style={{ fontSize: '11px', color: '#94a3b8' }}>2,850 kcal Goal</span>
      </div>

      {/* 3 Macro Bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(11,30,46,0.6)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(6,182,212,0.18)' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, color: '#e2e8f0', marginBottom: '4px' }}>
            <span>Protein (Anabolic Floor)</span>
            <span style={{ color: '#06B6D4', fontWeight: 700 }}>185g / 200g (92%)</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: '92%', height: '100%', background: '#06B6D4' }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, color: '#e2e8f0', marginBottom: '4px' }}>
            <span>Carbs (Glycogen Reload)</span>
            <span style={{ color: '#38BDF8', fontWeight: 700 }}>310g / 340g (91%)</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: '91%', height: '100%', background: '#38BDF8' }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, color: '#e2e8f0', marginBottom: '4px' }}>
            <span>Fats (Endocrine Support)</span>
            <span style={{ color: '#A5F3FC', fontWeight: 700 }}>62g / 70g (88%)</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: '88%', height: '100%', background: '#A5F3FC' }} />
          </div>
        </div>
      </div>

      {/* Hydration 8-Glass Matrix */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', color: '#94a3b8' }}>Hydration: {waterGlasses * 250} ml / 2500 ml</span>
        <div style={{ display: 'flex', gap: '5px' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(g => (
            <button
              key={g}
              onClick={() => setWaterGlasses(prev => (prev === g ? g - 1 : g))}
              style={{
                width: '18px',
                height: '24px',
                borderRadius: '4px',
                background: g <= waterGlasses ? '#06B6D4' : 'rgba(255,255,255,0.08)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
              title={`Glass ${g} (250ml)`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function LeaderboardInteractivePreview({ onLaunch }) {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#C084FC', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Trophy size={13} /> ATHLETE TIER RANKING
        </span>
        <span style={{ fontSize: '11px', color: '#F59E0B', fontWeight: 700 }}>🔥 14-Day Streak</span>
      </div>

      {/* Current Rank Card */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(168,85,247,0.2) 0%, rgba(19,13,36,0.85) 100%)',
          padding: '12px 14px',
          borderRadius: '12px',
          border: '1px solid rgba(192,132,252,0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#A855F7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '13px' }}>
            #1
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>You (Gym Legend)</div>
            <div style={{ fontSize: '11px', color: '#C084FC' }}>Diamond Tier • Branch Leader</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', fontFamily: 'monospace' }}>48,250 kg</div>
          <div style={{ fontSize: '10px', color: '#94a3b8' }}>Weekly Volume</div>
        </div>
      </div>

      {/* Top Rivals */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {[
          { rank: '#2', name: 'Marcus V.', tier: 'Platinum III', vol: '44,100 kg' },
          { rank: '#3', name: 'Elena R.', tier: 'Gold I', vol: '41,800 kg' },
        ].map(r => (
          <div
            key={r.rank}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.02)',
              fontSize: '11px',
            }}
          >
            <span style={{ color: '#94a3b8', fontWeight: 700 }}>{r.rank} {r.name} ({r.tier})</span>
            <span style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>{r.vol}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ==========================================================================
   INDIVIDUAL FLIP CARD COMPONENT (3D TRANSFORM MATH)
   ========================================================================== */

function FlipCard({
  item,
  index,
  total,
  progress,
  reduceMotion,
  onAction,
}) {
  const segment = 1 / Math.max(total, 1)
  const start = index * segment
  const end = Math.min(start + segment, 1)
  const entryStart = Math.max(0, start - segment)
  const entryEnd = index === 0 ? 0.0001 : Math.min(start, entryStart + segment * 0.7)

  // Hold card flat for the first portion of its segment, then smoothly flip upward:
  const flipDuration = segment * 0.65
  const exitStart = start + (segment - flipDuration)
  const exitEnd = end

  const stackedCardGap = Math.min(18, 54 / Math.max(total - 1, 1))
  const stackedOffset = index * stackedCardGap
  const restingOffset = Math.min(index * 12, 30)
  const restingScale = 1 - Math.min(index * 0.012, 0.035)

  const exitYPercent = useTransform(
    progress,
    [exitStart, exitEnd],
    reduceMotion ? [0, 0] : [0, -112],
  )
  const exitStackOffset = useTransform(
    progress,
    [exitStart, exitEnd],
    reduceMotion ? [0, 0] : [0, stackedOffset],
  )
  const exitY = useMotionTemplate`calc(${exitYPercent}% + ${exitStackOffset}px)`

  const rotateX = useTransform(
    progress,
    [exitStart, exitEnd],
    reduceMotion ? [0, 0] : [0, 22],
  )
  const opacity = useTransform(
    progress,
    [exitStart, exitEnd],
    reduceMotion ? [1, 0] : [1, 0.98],
  )
  const entryScale = useTransform(
    progress,
    [entryStart, entryEnd],
    index === 0 ? [1, 1] : [restingScale, 1],
  )
  const entryY = useTransform(
    progress,
    [entryStart, entryEnd],
    index === 0 ? [0, 0] : [restingOffset, 0],
  )

  return (
    <motion.article
      className="flip-card-article"
      style={{
        y: exitY,
        rotateX,
        opacity,
        zIndex: total - index,
        transformOrigin: '50% 50%',
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
      }}
    >
      <motion.div
        className="flip-card-body"
        style={{
          backgroundColor: item.background,
          y: entryY,
          scale: entryScale,
          transformOrigin: '50% 100%',
          border: `1px solid ${item.accentColor || 'rgba(255,255,255,0.1)'}33`,
        }}
      >
        {/* Left Column: Title, Description, Chips, Launch Button */}
        <div className="flip-card-left">
          <div>
            <div className="flip-card-badge-row">
              <span className="flip-card-number" style={{ color: item.accentColor || '#00F59B' }}>
                {item.number}
              </span>
              <span className="flip-card-tag" style={{ borderColor: `${item.accentColor}44`, color: item.accentColor }}>
                {item.tag}
              </span>
            </div>

            <p style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: item.accentColor, opacity: 0.9 }}>
              {item.eyebrow}
            </p>
            <h2 className="flip-card-heading">
              {item.title}
            </h2>
            <p className="flip-card-desc">
              {item.description}
            </p>
          </div>

          <div>
            <div className="flip-card-chips">
              {item.chips?.map((c, i) => (
                <span key={i} className="flip-chip">
                  {c}
                </span>
              ))}
            </div>

            <button
              className="flip-card-action-btn"
              onClick={onAction}
              style={{
                background: item.accentColor || '#00F59B',
                color: item.btnTextColor || '#050a14',
                boxShadow: `0 8px 24px ${item.accentColor}44`,
              }}
            >
              <span>{item.btnLabel}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Right Column: High-Craft Interactive Preview */}
        <div className="flip-card-right">
          {item.previewComponent}
        </div>
      </motion.div>
    </motion.article>
  )
}

/* ==========================================================================
   MAIN CaseStudyFlipStack EXPORT
   ========================================================================== */

export function CaseStudyFlipStack({
  items,
  className,
  hint = 'Scroll Down To Explore',
  heading = 'Engineered For Pure Performance.',
  endLabel = 'UNLEASH YOUR HIGHEST POTENTIAL',
  onOpenMuscles,
  onOpenAIGenerator,
  onOpenPyramid,
  onOpenInterval,
  onOpenMacro,
  onOpenLeaderboard,
}) {
  const stackRef = useRef(null)
  const reduceMotion = useReducedMotion() ?? false

  // 6 Core Features configured in strict requested sequence
  const defaultItems = useMemo(
    () => [
      {
        number: '01',
        tag: 'BIOMECHANICS MATRIX',
        eyebrow: 'Kinetic Anatomical Mapping',
        title: 'Animated Muscle Map & Fatigue Explorer',
        description:
          'Deep anatomical body mapping calculating localized muscle strain, recovery curves, and optimal fatigue distribution in real-time.',
        background: '#071822',
        accentColor: '#00F59B',
        btnTextColor: '#03170e',
        btnLabel: 'Launch 3D Muscle Explorer',
        chips: ['1:1 Isolated Strain', 'Hypertrophy Heatmap', 'Active Recovery Ramp'],
        previewComponent: <MuscleMapInteractivePreview onLaunch={onOpenMuscles} />,
        onAction: onOpenMuscles,
      },
      {
        number: '02',
        tag: 'AUTONOMOUS SYNTHESIS',
        eyebrow: 'Neural Split Generation',
        title: 'Autonomous AI Workout Generator',
        description:
          'Instant synthesis of your workout logs, progressive overload targets, and fatigue telemetry into complete structured training circuits.',
        background: '#120f29',
        accentColor: '#A855F7',
        btnTextColor: '#ffffff',
        btnLabel: 'Generate AI Workout Routine',
        chips: ['Under 3-Sec Build', 'RPE Auto-Calibration', 'Equipment Adaptive'],
        previewComponent: <AIWorkoutInteractivePreview onLaunch={onOpenAIGenerator} />,
        onAction: onOpenAIGenerator,
      },
      {
        number: '03',
        tag: 'OLYMPIC RIG MATH',
        eyebrow: 'Precision Bar Loading',
        title: 'Olympic Barbell & Pyramid Calculator',
        description:
          'Eliminate loading errors. Calculate exact bumper plate combinations, sleeve collars, and progressive overload pyramid percentages at a glance.',
        background: '#16151a',
        accentColor: '#F59E0B',
        btnTextColor: '#18181b',
        btnLabel: 'Open Barbell Plate Math',
        chips: ['Olympic 20kg Standard', 'Per-Sleeve Breakdown', '1RM Pyramid Curve'],
        previewComponent: <BarbellPyramidInteractivePreview onLaunch={onOpenPyramid} />,
        onAction: onOpenPyramid,
      },
      {
        number: '04',
        tag: 'METABOLIC PROTOCOLS',
        eyebrow: 'High-Tempo Interval Suite',
        title: 'Industrial Interval & Tabata Timer Suite',
        description:
          'Laser-accurate work-to-rest pacing for Tabata, EMOM, AMRAP, and HIIT protocols with acoustic countdown waves and round tracking.',
        background: '#1c0f16',
        accentColor: '#EF4444',
        btnTextColor: '#ffffff',
        btnLabel: 'Launch Interval Timer',
        chips: ['Tabata 20/10 Protocol', 'EMOM 1-Min Cycles', 'Acoustic Audio Beeps'],
        previewComponent: <IntervalTimerInteractivePreview onLaunch={onOpenInterval} />,
        onAction: onOpenInterval,
      },
      {
        number: '05',
        tag: 'ANABOLIC EQUILIBRIUM',
        eyebrow: 'Biometric Equalizer',
        title: 'Macro Nutrition & Hydration Equalizer',
        description:
          'Maintain metabolic homeostasis with dynamic macro ratios, caloric expenditure estimates, and a 24-point cellular hydration grid.',
        background: '#091c2b',
        accentColor: '#06B6D4',
        btnTextColor: '#041f26',
        btnLabel: 'Adjust Nutrition Targets',
        chips: ['Target Macro Split', '24-Glass Matrix', 'Dynamic Caloric Burn'],
        previewComponent: <MacroNutritionInteractivePreview onLaunch={onOpenMacro} />,
        onAction: onOpenMacro,
      },
      {
        number: '06',
        tag: 'COMPETITIVE ARENA',
        eyebrow: 'Honor & Progression',
        title: 'Branch Leaderboard & Athlete Tiers',
        description:
          'Climb through 8 performance tiers from Iron Recruit to Mythic Diamond. Prove your strength against top gym athletes in volume and streaks.',
        background: '#140c26',
        accentColor: '#C084FC',
        btnTextColor: '#1f0d38',
        btnLabel: 'View Leaderboard & Badges',
        chips: ['8 Athlete Tiers', 'Verified Volume Logs', 'Weekly Branch Cups'],
        previewComponent: <LeaderboardInteractivePreview onLaunch={onOpenLeaderboard} />,
        onAction: onOpenLeaderboard,
      },
    ],
    [onOpenMuscles, onOpenAIGenerator, onOpenPyramid, onOpenInterval, onOpenMacro, onOpenLeaderboard],
  )

  const activeItems = items && items.length > 0 ? items : defaultItems

  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ['start start', 'end end'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 22,
    mass: 0.7,
    restDelta: 0.0005,
  })

  const cardProgress = reduceMotion ? scrollYProgress : smoothProgress

  return (
    <main className={cn('flip-stack-root', className)}>
      {/* Editorial Intro Section */}
      <section className="flip-stack-header">
        <motion.div
          className="flip-stack-hint"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            animate={reduceMotion ? undefined : { y: [0, 5, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown size={14} />
          </motion.span>
          <span>{hint}</span>
        </motion.div>

        <h1 className="flip-stack-title">
          {heading}
        </h1>

        <p className="flip-stack-subtitle">
          Six battle-tested performance engines engineered to elevate your physical output,
          accelerate muscle recovery, and track every milligram of progressive overload.
        </p>
      </section>

      {/* 3D Scroll Track Container */}
      <div
        ref={stackRef}
        className="relative"
        style={{ height: `${(Math.max(activeItems.length, 1) + 1.2) * 92}vh` }}
      >
        <div className="flip-card-viewport">
          <div className="flip-card-stage">
            {[...activeItems].reverse().map((item, reverseIndex) => {
              const index = activeItems.length - reverseIndex - 1
              return (
                <FlipCard
                  key={`${item.title}-${index}`}
                  item={item}
                  index={index}
                  total={activeItems.length}
                  progress={cardProgress}
                  reduceMotion={reduceMotion}
                  onAction={item.onAction || (() => {})}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* Outro Transition Section */}
      <section className="flip-stack-footer">
        <div className="flip-stack-footer-badge">
          <Sparkles size={13} /> Integrated Performance Suite
        </div>
        <h2 className="flip-stack-footer-heading">
          {endLabel}
        </h2>
        <p className="flip-stack-footer-sub">
          Every tool is synchronized directly with your training history and active gym session.
        </p>
      </section>
    </main>
  )
}

export default CaseStudyFlipStack
