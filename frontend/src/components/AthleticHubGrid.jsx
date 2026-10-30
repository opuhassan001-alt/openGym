import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  starterPlanSheet,
  plateInventorySheet,
  logPastWorkoutSheet,
  dumbbellInventorySheet,
  equipmentProfileSheet,
  customExSheet,
  planToolsSheet,
  importFromHevy,
  importFromApp
} from '../sheets.jsx'
import Icon from './Icon.jsx'
import './NikeThemeLayer.css'

export default function AthleticHubGrid({
  onOpenMacro,
  onOpenInterval,
  onOpenPyramid,
  onOpenGamification,
  onOpenAIGenerator
} = {}) {
  const nav = useNavigate()
  const fileInputRef = useRef(null)

  const handleCsvSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      importFromApp(file)
      e.target.value = ''
    }
  }

  const hubItems = [
    {
      title: 'Macro & Nutrition',
      subtitle: 'Calories, Protein & Water Ring',
      icon: 'sparkle',
      badge: 'NUTRITION MATRIX',
      action: () => onOpenMacro && onOpenMacro(),
      color: '#ccff00'
    },
    {
      title: 'Interval Timer Suite',
      subtitle: 'Tabata, EMOM & AMRAP Clocks',
      icon: 'sparkle',
      badge: 'HIIT CLOCKS',
      action: () => onOpenInterval && onOpenInterval(),
      color: '#ff375f'
    },
    {
      title: 'Warmup Pyramid',
      subtitle: 'CNS Ramp & Plate Calculator',
      icon: 'gear',
      badge: 'BARBELL MATH',
      action: () => onOpenPyramid && onOpenPyramid(),
      color: '#ff9f0a'
    },
    {
      title: 'Athlete Level & XP',
      subtitle: 'Trophies, Ranks & Quests',
      icon: 'sparkle',
      badge: 'GAMIFICATION',
      action: () => onOpenGamification && onOpenGamification(),
      color: '#ffd60a'
    },
    {
      title: 'AI Workout Generator',
      subtitle: 'Instant 20-Min Home/Hotel',
      icon: 'sparkle',
      badge: 'ON-DEMAND AI',
      action: () => onOpenAIGenerator && onOpenAIGenerator(),
      color: '#00f2fe'
    },
    {
      title: 'Starter Plans',
      subtitle: 'PPL, 5×5, Upper/Lower',
      icon: 'calendar',
      badge: '4 PRO TEMPLATES',
      action: () => starterPlanSheet(),
      color: '#30d158'
    },
    {
      title: 'Muscle Body Map',
      subtitle: 'Fatigue & Volume Zones',
      icon: 'sparkle',
      badge: 'LIVE ANATOMY',
      action: () => nav('/muscles'),
      color: '#00f2fe'
    },
    {
      title: 'AI Coach Chat',
      subtitle: 'Routine Advice & Intake',
      icon: 'sparkle',
      badge: 'AI ENGINE',
      action: () => nav('/coach-chat'),
      color: '#bf5af2'
    },
    {
      title: 'Import from Hevy',
      subtitle: 'Sync Workouts & Routines',
      icon: 'sparkle',
      badge: 'HEVY API SYNC',
      action: () => importFromHevy(),
      color: '#ff9500'
    },
    {
      title: 'Import CSV / Apps',
      subtitle: 'Strong, FitNotes, Apple',
      icon: 'arrowUp',
      badge: 'DATA MIGRATION',
      action: () => fileInputRef.current?.click(),
      color: '#30d158'
    },
    {
      title: 'Plate Math',
      subtitle: 'Barbell & Smith Calculator',
      icon: 'gear',
      badge: 'CALCULATOR',
      action: () => plateInventorySheet(),
      color: '#ff9f0a'
    },
    {
      title: 'Dumbbell Rack',
      subtitle: 'Pairs & Inventory Load',
      icon: 'dumbbell',
      badge: 'EQUIPMENT',
      action: () => dumbbellInventorySheet(),
      color: '#ffd60a'
    },
    {
      title: 'Equipment Filter',
      subtitle: 'Home vs Commercial Gym',
      icon: 'dumbbell',
      badge: 'PROFILE GEAR',
      action: () => equipmentProfileSheet(null),
      color: '#63e6e2'
    },
    {
      title: 'Custom Exercises',
      subtitle: 'Add Own Video & Photos',
      icon: 'camera',
      badge: 'CREATOR STUDIO',
      action: () => customExSheet(null, () => {}),
      color: '#ff2d55'
    },
    {
      title: 'Turnstile Check-In',
      subtitle: 'Barcode & QR Scanner',
      icon: 'qr',
      badge: 'GYM KIOSK',
      action: () => nav('/check-in'),
      color: '#0a84ff'
    },
    {
      title: 'Structural Balance',
      subtitle: 'Poliquin & ATG Ratios',
      icon: 'chart',
      badge: 'RATIOS',
      action: () => nav('/structural-balance'),
      color: '#34c759'
    },
    {
      title: 'Progress Photos',
      subtitle: 'Before & After Slider',
      icon: 'camera',
      badge: 'TRANSFORMATION',
      action: () => nav('/progress-photos'),
      color: '#ff375f'
    },
    {
      title: 'Tape Measurements',
      subtitle: 'Chest, Arms, Waist Track',
      icon: 'ruler',
      badge: 'BODY METRICS',
      action: () => nav('/measurements'),
      color: '#40c8e0'
    },
    {
      title: 'Plan PDF & Share',
      subtitle: 'Print or Export .opengym',
      icon: 'share',
      badge: 'EXPORT / PRINT',
      action: () => planToolsSheet(),
      color: '#af52de'
    },
    {
      title: 'Log Past Workout',
      subtitle: 'Backfill Paper Logbook',
      icon: 'pencil',
      badge: 'BACKFILL',
      action: () => logPastWorkoutSheet(),
      color: '#ffffff'
    }
  ]

  return (
    <div style={{ marginBottom: 18 }}>
      {/* Hidden file input for CSV/Export imports */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xml,.json,.txt"
        style={{ display: 'none' }}
        onChange={handleCsvSelect}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, padding: '0 2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#ffffff' }}>
            ATHLETE POWER SUITE
          </span>
          <span className="elite-badge" style={{ fontSize: 9, padding: '2px 6px' }}>15 PRO MODULES</span>
        </div>
        <span style={{ fontSize: 11, color: '#ccff00', fontWeight: 700 }}>ALL REPO FEATURES</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
        {hubItems.map((item, idx) => (
          <div
            key={idx}
            onClick={item.action}
            className="athletic-card"
            style={{
              padding: '12px 14px',
              margin: 0,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 92
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ 
                  fontSize: 8, 
                  fontWeight: 800, 
                  padding: '2px 5px', 
                  borderRadius: 4, 
                  background: 'rgba(255,255,255,0.06)', 
                  color: item.color,
                  letterSpacing: '0.04em'
                }}>
                  {item.badge}
                </span>
                <span style={{ color: item.color, fontSize: 15, display: 'flex', alignItems: 'center' }}>
                  <Icon name={item.icon} />
                </span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>
                {item.title}
              </div>
            </div>

            <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.subtitle}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
