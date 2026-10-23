import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import { effectiveRoutines, effectiveRoutineIds, lastBW } from '../lib/history.js'
import { todayISO } from '../lib/format.js'
import { startFlow } from '../sheets.jsx'
import SocialShareModal from '../components/SocialShareModal.jsx'
import GymLeaderboardModal from '../components/GymLeaderboardModal.jsx'
import MacroNutritionModal from '../components/MacroNutritionModal.jsx'
import IntervalTimerSuiteModal from '../components/IntervalTimerSuiteModal.jsx'
import BarbellPyramidCalculatorModal from '../components/BarbellPyramidCalculatorModal.jsx'
import GamificationModal from '../components/GamificationModal.jsx'
import AIWorkoutGeneratorModal from '../components/AIWorkoutGeneratorModal.jsx'
import OpenGymHero from '../components/OpenGymHero.tsx'
import OpenGymLayeredStack from '../components/OpenGymLayeredStack.jsx'
import InteractiveMuscleMapSection from '../components/InteractiveMuscleMapSection.jsx'
import OpenGymBentoSection from '../components/OpenGymBentoSection.jsx'
import PulseBottomBar from '../components/PulseBottomBar.jsx'

// Home = Hero Figurine Carousel + Section 1: Interactive Muscle Map + Section 2: Functional Bento Grid
export default function Home() {
  useEffect(() => {
    document.title = 'openGym — High-Performance Athletic Training & 3D Anatomy OS'
  }, [])
  const nav = useNavigate()
  const S = useStore(s => s.S)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false)
  const [showMacroModal, setShowMacroModal] = useState(false)
  const [showIntervalModal, setShowIntervalModal] = useState(false)
  const [showPyramidModal, setShowPyramidModal] = useState(false)
  const [showGamificationModal, setShowGamificationModal] = useState(false)
  const [showAIGeneratorModal, setShowAIGeneratorModal] = useState(false)

  const todayRoutines = effectiveRoutines(S, todayISO())
  const bw = lastBW(S)

  return (
    <div style={{ background: '#879A85', minHeight: '100vh', width: '100%' }}>
      {/* 3D Character Figurine Carousel Hero Section (OPEN GYM) — 100% UNTOUCHED */}
      <div
        className="hero-section-wrapper"
        style={{
          width: '100%',
          position: 'relative',
          margin: 0,
          padding: 0,
          border: 'none',
          outline: 'none',
        }}
      >
        <OpenGymHero />
      </div>

      {/* LayeredStack (GSAP 3D Dynamic Interactive Card Deck) showcasing 8 openGym Engines */}
      <OpenGymLayeredStack
        onOpenMuscles={() => nav('/muscles')}
        onOpenAIGenerator={() => setShowAIGeneratorModal(true)}
        onOpenPyramid={() => setShowPyramidModal(true)}
        onOpenInterval={() => setShowIntervalModal(true)}
        onOpenMacro={() => setShowMacroModal(true)}
        onOpenCheckin={() => nav('/checkin')}
        onOpenLeaderboard={() => setShowLeaderboardModal(true)}
        onOpenPlan={() => nav('/plan')}
      />

      {/* SECTION 1: Interactive 3D Body Muscle Map (Immediately following Hero) */}
      <InteractiveMuscleMapSection />

      {/* SECTION 2: Modern Minimalist Functional Bento Grid Layout (Zero-AI-Slop Interactive Forms) */}
      <OpenGymBentoSection
        onStartWorkout={() => {
          if (S.active) nav('/workout')
          else if (todayRoutines.length) startFlow(effectiveRoutineIds(S, todayISO()))
          else nav('/workout')
        }}
        onOpenMuscles={() => nav('/muscles')}
        onOpenMacro={() => setShowMacroModal(true)}
        onOpenInterval={() => setShowIntervalModal(true)}
        onOpenPyramid={() => setShowPyramidModal(true)}
        onOpenGamification={() => setShowGamificationModal(true)}
        onOpenLeaderboard={() => setShowLeaderboardModal(true)}
        onOpenCoach={() => nav('/coach')}
        onOpenLibrary={() => nav('/library')}
        onOpenCheckin={() => nav('/checkin')}
        onOpenPlan={() => nav('/plan')}
        userState={S}
      />

      {/* Interactive Modals */}
      {showShareModal && (
        <SocialShareModal 
          workout={S.workouts.at(-1) || { name: 'Full Body Power', vol: 8450, d: todayISO() }} 
          onClose={() => setShowShareModal(false)} 
        />
      )}

      {showLeaderboardModal && (
        <GymLeaderboardModal 
          userVolume={S.workouts.slice(-7).reduce((acc, w) => acc + (w.vol || 0), 0) || 8450}
          onClose={() => setShowLeaderboardModal(false)} 
        />
      )}

      {showMacroModal && (
        <MacroNutritionModal 
          userWeight={bw?.w || 75} 
          onClose={() => setShowMacroModal(false)} 
        />
      )}

      {showIntervalModal && (
        <IntervalTimerSuiteModal 
          onClose={() => setShowIntervalModal(false)} 
        />
      )}

      {showPyramidModal && (
        <BarbellPyramidCalculatorModal 
          onClose={() => setShowPyramidModal(false)} 
        />
      )}

      {showGamificationModal && (
        <GamificationModal 
          userState={S} 
          onClose={() => setShowGamificationModal(false)} 
        />
      )}

      {showAIGeneratorModal && (
        <AIWorkoutGeneratorModal 
          onClose={() => setShowAIGeneratorModal(false)} 
        />
      )}


      {/* Enterprise Multinational Footer */}
      <footer style={{
        background: '#7E907B',
        borderTop: '2px solid rgba(245, 158, 11, 0.45)',
        padding: '64px 24px 140px',
        color: '#2D190E',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40, marginBottom: 48 }}>
            
            {/* Col 1: Brand & Ethos */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2D190E', fontWeight: 900, fontSize: 16, border: '1.5px solid #D97706', boxShadow: '0 0 10px rgba(245, 158, 11, 0.4)' }}>
                  OG
                </div>
                <span style={{ fontSize: 20, fontWeight: 900, color: '#2D190E', letterSpacing: '-0.02em' }}>
                  openGym
                </span>
              </div>
              <p style={{ fontSize: 13, color: '#3C271A', lineHeight: 1.6, margin: '0 0 16px', maxWidth: 280, fontWeight: 600 }}>
                Enterprise-grade athletic intelligence. 3D body kinetics, barbell mathematics, and high-precision periodization.
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 11, background: 'rgba(245, 158, 11, 0.2)', color: '#2D190E', border: '1.5px solid #F59E0B', padding: '3px 8px', borderRadius: 6, fontWeight: 800, boxShadow: '0 0 8px rgba(245, 158, 11, 0.25)' }}>
                  TLS 1.3 Encrypted
                </span>
                <span style={{ fontSize: 11, background: 'rgba(245, 158, 11, 0.2)', color: '#2D190E', border: '1.5px solid #F59E0B', padding: '3px 8px', borderRadius: 6, fontWeight: 800, boxShadow: '0 0 8px rgba(245, 158, 11, 0.25)' }}>
                  Zero Trackers
                </span>
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#B45309', margin: '0 0 16px' }}>
                Core Platforms
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
                <li><span onClick={() => nav('/library')} style={{ color: '#2D190E', cursor: 'pointer', fontWeight: 700, transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = '#B45309'} onMouseLeave={e => e.currentTarget.style.color = '#2D190E'}>Exercise Repertoire (5,600+)</span></li>
                <li><span onClick={() => nav('/muscles')} style={{ color: '#2D190E', cursor: 'pointer', fontWeight: 700, transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = '#B45309'} onMouseLeave={e => e.currentTarget.style.color = '#2D190E'}>3D Body Muscle Kinetics</span></li>
                <li><span onClick={() => nav('/plan')} style={{ color: '#2D190E', cursor: 'pointer', fontWeight: 700, transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = '#B45309'} onMouseLeave={e => e.currentTarget.style.color = '#2D190E'}>Periodized Training Plans</span></li>
                <li><span onClick={() => nav('/stats')} style={{ color: '#2D190E', cursor: 'pointer', fontWeight: 700, transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = '#B45309'} onMouseLeave={e => e.currentTarget.style.color = '#2D190E'}>Volume &amp; Fatigue Analytics</span></li>
              </ul>
            </div>

            {/* Col 3: Legal & Governance */}
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#B45309', margin: '0 0 16px' }}>
                Legal &amp; Privacy
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
                <li><span onClick={() => nav('/privacy')} style={{ color: '#2D190E', cursor: 'pointer', fontWeight: 700, transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = '#B45309'} onMouseLeave={e => e.currentTarget.style.color = '#2D190E'}>Privacy Policy (GDPR/CCPA)</span></li>
                <li><span onClick={() => nav('/terms')} style={{ color: '#2D190E', cursor: 'pointer', fontWeight: 700, transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = '#B45309'} onMouseLeave={e => e.currentTarget.style.color = '#2D190E'}>Terms &amp; Conditions</span></li>
                <li><a href="mailto:security@opengym.app" style={{ color: '#2D190E', textDecoration: 'none', fontWeight: 700, transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = '#B45309'} onMouseLeave={e => e.currentTarget.style.color = '#2D190E'}>Security Vulnerability Disclosure</a></li>
                <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: '#2D190E', textDecoration: 'none', fontWeight: 700, transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = '#B45309'} onMouseLeave={e => e.currentTarget.style.color = '#2D190E'}>Open Source Architecture</a></li>
              </ul>
            </div>

            {/* Col 4: Clear Call-To-Action Card */}
            <div style={{ background: 'rgba(126, 144, 123, 0.95)', border: '2px solid #F59E0B', borderRadius: 16, padding: '24px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)' }}>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 900, color: '#2D190E', margin: '0 0 8px' }}>
                  Ready to Lift?
                </h4>
                <p style={{ fontSize: 12, color: '#3C271A', lineHeight: 1.5, margin: '0 0 16px', fontWeight: 600 }}>
                  Begin a workout session instantly or calibrate your Olympic barbell routine.
                </p>
              </div>
              <button
                onClick={() => {
                  if (S.active) nav('/workout');
                  else if (todayRoutines.length) startFlow(effectiveRoutineIds(S, todayISO()));
                  else nav('/workout');
                }}
                style={{
                  background: '#F59E0B',
                  color: '#2D190E',
                  border: '1.5px solid #D97706',
                  borderRadius: 10,
                  padding: '12px 16px',
                  fontWeight: 900,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 18px rgba(245, 158, 11, 0.5)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#D97706';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(245, 158, 11, 0.7)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#F59E0B';
                  e.currentTarget.style.color = '#2D190E';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 18px rgba(245, 158, 11, 0.5)';
                }}
              >
                <span>Launch Workout Session</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>

          </div>

          {/* Bottom Copyright & Status Bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            paddingTop: 24,
            borderTop: '1.5px solid rgba(245, 158, 11, 0.45)',
            fontSize: 12,
            color: '#2D190E',
            fontWeight: 700
          }}>
            <div>
              &copy; {new Date().getFullYear()} openGym Platform. Engineered with athletic precision. All rights reserved.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#2D190E', fontWeight: 800 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B', boxShadow: '0 0 10px #F59E0B' }} />
                Systems Operational (99.99%)
              </span>
              <span>v2.4 Production</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Ronas IT "Pulse" Executive Floating Navigation Bar */}
      <PulseBottomBar
        onStart={() => {
          if (S.active) nav('/workout')
          else if (todayRoutines.length) startFlow(effectiveRoutineIds(S, todayISO()))
          else nav('/workout')
        }}
      />
    </div>
  )
}
