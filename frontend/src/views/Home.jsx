import { useState } from 'react'
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
    <div style={{ background: '#0A1A32', minHeight: '100vh', width: '100%', overflowX: 'clip' }}>
      {/* 3D Character Figurine Carousel Hero Section (OPEN GYM) — 100% UNTOUCHED */}
      <div
        className="hero-section-wrapper"
        style={{
          width: '100%',
          position: 'relative',
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
