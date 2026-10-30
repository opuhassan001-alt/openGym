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

export default function ConsumerFeatureShowcase({
  onOpenMacro,
  onOpenInterval,
  onOpenPyramid,
  onOpenGamification,
  onOpenAIGenerator
}) {
  const nav = useNavigate()

  const showcaseFeatures = [
    {
      id: 'macro',
      tag: 'NUTRITION & MACROS',
      tagColor: '#ccff00',
      title: 'Macro & Hydration Matrix',
      description: 'Precision Mifflin-St Jeor daily energy expenditure calculator with live protein, carb, and fat dials. Auto-calibrates for Cutting, Lean Bulking, or Recomposition with fluid hydration targets.',
      badgeText: 'DAILY FUELING',
      actionLabel: 'Launch Macro Tracker',
      action: () => onOpenMacro && onOpenMacro(),
      stats: 'BMR · TDEE · Water Ring'
    },
    {
      id: 'interval',
      tag: 'HIGH-INTENSITY CONDITIONING',
      tagColor: '#ff375f',
      title: 'Specialized Interval Clocks',
      description: 'Tabata (20/10), EMOM, and AMRAP clocks engineered with synthesized audio voice countdowns, round trackers, and high-visibility visual screen flashes for loud gym environments.',
      badgeText: 'HIIT & CROSSFIT',
      actionLabel: 'Launch Interval Suite',
      action: () => onOpenInterval && onOpenInterval(),
      stats: 'Tabata · EMOM · AMRAP'
    },
    {
      id: 'pyramid',
      tag: 'STRENGTH SCIENCE',
      tagColor: '#ff9f0a',
      title: 'Olympic Warmup Pyramid',
      description: 'Gradual central nervous system potentiation protocol. Calculates exact 40%, 60%, 80%, and 90% primer sets and tells you precisely which barbell plates to rack on each side.',
      badgeText: 'BARBELL MATH',
      actionLabel: 'Open Warmup Calculator',
      action: () => onOpenPyramid && onOpenPyramid(),
      stats: 'CNS Primer · Plate Loading'
    },
    {
      id: 'gamification',
      tag: 'ATHLETE MASTERY',
      tagColor: '#ffd60a',
      title: 'Athlete Level & Trophies',
      description: 'Gain XP for every 10 kg of iron moved. Climb 8 competitive tiers from Iron Novice to Apex God of Iron. Earn verified milestone trophy badges and compete in monthly tonnage quests.',
      badgeText: '8 TIERS & QUESTS',
      actionLabel: 'View Mastery Matrix',
      action: () => onOpenGamification && onOpenGamification(),
      stats: 'XP Tiers · Badges · Challenges'
    },
    {
      id: 'ai_gen',
      tag: 'AI WORKOUT BUILDER',
      tagColor: '#00f2fe',
      title: 'Instant 20-Min Circuit Generator',
      description: 'Traveling or short on time? Select your exact minute window and available equipment (Hotel, Dumbbells Only, Bodyweight). AI creates a tailored high-density circuit instantly.',
      badgeText: 'ON-DEMAND AI',
      actionLabel: 'Generate Rapid Circuit',
      action: () => onOpenAIGenerator && onOpenAIGenerator(),
      stats: 'Hotel · Dumbbells · Bodyweight'
    },
    {
      id: 'muscles',
      tag: 'ANATOMY & KINETICS',
      tagColor: '#30d158',
      title: 'Interactive 3D Body Muscle Map',
      description: 'Visual heat mapping of your entire muscular system. Track which muscles have taken high volume, which groups are actively recovering, and which have been neglected.',
      badgeText: 'HEATMAP ENGINE',
      actionLabel: 'Explore Muscle Anatomy',
      action: () => {
        const el = document.getElementById('interactive-muscle-map')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
        else nav('/muscles')
      },
      stats: 'Recovery · Fatigue · Volume'
    },
    {
      id: 'starter_plans',
      tag: 'TRAINING SYSTEMS',
      tagColor: '#bf5af2',
      title: 'Pro Starter Splits',
      description: 'Four battle-tested splits ready to launch with one click: Push / Pull / Legs (PPL), Upper / Lower, 5×5 Strength, and Full Body Frequency. Fully editable to match your gym equipment.',
      badgeText: '4 PRO TEMPLATES',
      actionLabel: 'Load Training Plan',
      action: () => starterPlanSheet(),
      stats: 'PPL · 5×5 · Upper/Lower'
    },
    {
      id: 'balance',
      tag: 'STRUCTURAL HEALTH',
      tagColor: '#40c8e0',
      title: 'Structural Balance Calculator',
      description: 'Diagnose joint imbalances and avoid shoulder/knee injuries using Charles Poliquin and ATG structural ratios between pushing, pulling, and posterior chain movements.',
      badgeText: 'INJURY PREVENTION',
      actionLabel: 'Calculate Joint Balance',
      action: () => nav('/structural-balance'),
      stats: 'Poliquin · Thibaudeau · ATG'
    },
    {
      id: 'photos',
      tag: 'BODY COMPOSITION',
      tagColor: '#ff2d55',
      title: 'Progress Photos Timeline',
      description: 'Private, on-device transformation tracking. Compare physical progress side-by-side using an interactive before-and-after slider with zero cloud data exposure.',
      badgeText: 'TRANSFORMATION',
      actionLabel: 'Open Photo Vault',
      action: () => nav('/progress-photos'),
      stats: 'Before/After Slider · Private'
    },
    {
      id: 'migration',
      tag: 'DATA FREEDOM',
      tagColor: '#ff9500',
      title: 'Hevy, Strong & CSV Importer',
      description: 'Never lose your training history. Direct 1-click sync via Hevy API key, or drag-and-drop CSV exports from Strong App, FitNotes, and Apple Health directly into your openGym profile.',
      badgeText: 'ZERO LOCK-IN',
      actionLabel: 'Sync Hevy / Import CSV',
      action: () => importFromHevy(),
      stats: 'Hevy API · Strong · FitNotes'
    }
  ]

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="elite-badge">DISCOVER THE PLATFORM</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, textTransform: 'uppercase', color: '#ffffff', marginTop: 4 }}>
            Enterprise Features Showcase
          </div>
        </div>
        <span style={{ fontSize: 11, color: '#ccff00', fontWeight: 800 }}>ONE-BY-ONE SUITE</span>
      </div>

      {/* One-By-One Feature Showcase Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {showcaseFeatures.map((feat, index) => (
          <div
            key={feat.id}
            className="athletic-card glow-lime"
            style={{
              padding: 20,
              margin: 0,
              borderLeft: `4px solid ${feat.tagColor}`,
              position: 'relative'
            }}
          >
            {/* Top Tag & Index */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  color: feat.tagColor,
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '3px 8px',
                  borderRadius: 6
                }}>
                  {feat.tag}
                </span>
                <span className="elite-badge" style={{ fontSize: 9, padding: '2px 6px', color: '#ffffff', borderColor: 'rgba(255,255,255,0.15)' }}>
                  {feat.badgeText}
                </span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 900, color: 'rgba(255,255,255,0.2)' }}>
                #{index + 1}
              </span>
            </div>

            {/* Feature Title */}
            <div style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', marginBottom: 8, letterSpacing: '-0.01em' }}>
              {feat.title}
            </div>

            {/* Feature Detailed Description */}
            <div style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.5, marginBottom: 16 }}>
              {feat.description}
            </div>

            {/* Bottom Action Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 12,
              borderTop: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 700, textTransform: 'uppercase' }}>
                {feat.stats}
              </span>

              <button
                onClick={feat.action}
                className="athletic-btn"
                style={{
                  padding: '8px 16px',
                  fontSize: 12,
                  cursor: 'pointer'
                }}
              >
                {feat.actionLabel} →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

