import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { BlobCard } from '@/components/ui/blob-card'
import './OpenGymBentoSection.css'

export default function OpenGymBentoSection({
  onStartWorkout,
  onOpenMuscles,
  onOpenMacro,
  onOpenInterval,
  onOpenPyramid,
  onOpenGamification,
  onOpenLeaderboard,
  onOpenCoach,
  onOpenLibrary,
  onOpenCheckin,
  onOpenPlan,
  userState,
}) {
  const nav = useNavigate()

  // --------------------------------------------------------------------------
  // PULSE AI FITNESS QUIZ & PLAN GENERATOR STATE (Dribbble: Ronas IT)
  // --------------------------------------------------------------------------
  const [quizGoal, setQuizGoal] = useState('build_muscle')
  const [quizStep, setQuizStep] = useState(6)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const goalConfigs = {
    build_muscle: {
      name: 'Build muscle',
      desc: 'Strength & definition',
      practice: 'Hypertrophy & Kinetic Power',
      duration: '45–60 min',
      freq: '4–5 days',
      level: 'Intermediate Athlete',
      courses: [
        { title: 'Foundation Hypertrophy', desc: 'Compound overload & kinetic balance' },
        { title: 'Olympic Pull & Press', desc: 'Explosive triples & barbell mastery' },
        { title: 'Full-Body Density', desc: 'Metabolic fatigue & rapid growth' },
      ]
    },
    lose_weight: {
      name: 'Lose weight',
      desc: 'Feel lighter and healthier',
      practice: 'High-Density Interval & Core',
      duration: '35–45 min',
      freq: '3–4 days',
      level: 'All Levels',
      courses: [
        { title: 'Metabolic Conditioning', desc: 'HIIT circuits & active recovery' },
        { title: 'Core & Kinetic Burn', desc: 'Spinal stability & lean mass' },
        { title: 'Tempo Resistance', desc: 'Continuous tension & caloric burn' },
      ]
    },
    boost_stamina: {
      name: 'Boost stamina',
      desc: 'Energy & performance',
      practice: 'Cardiovascular & VO2 Kinetics',
      duration: '40–50 min',
      freq: '4 days',
      level: 'Conditioned',
      courses: [
        { title: 'VO2 Max Threshold', desc: 'Interval sprints & rower pacing' },
        { title: 'Endurance Circuits', desc: 'Kettlebell flows & density' },
        { title: 'Aerobic Base Building', desc: 'Zone 2 steady-state endurance' },
      ]
    },
    olympic_strength: {
      name: 'Olympic strength',
      desc: '1RM power & heavy loads',
      practice: 'Barbell Periodization & 1RM',
      duration: '60–75 min',
      freq: '4–5 days',
      level: 'Advanced Athlete',
      courses: [
        { title: 'Texas Method Power', desc: 'Linear periodization & 1RM peaking' },
        { title: 'Clean & Snatch Velocity', desc: 'Triple extension velocity & catches' },
        { title: 'Squat & Deadlift Peak', desc: 'Axial chain loading & lockout force' },
      ]
    },
    be_healthier: {
      name: 'Be healthier',
      desc: 'Feel good, inside and out',
      practice: 'Functional Mobility & Posture',
      duration: '30–40 min',
      freq: '3–4 days',
      level: 'All Levels',
      courses: [
        { title: 'Joint Decompression', desc: 'Thoracic extension & hip opening' },
        { title: 'Functional Posture', desc: 'Rotator cuff & kinetic chain health' },
        { title: 'Daily Mobility Routine', desc: 'Flows for desk workers & lifters' },
      ]
    },
    stay_active: {
      name: 'Stay active',
      desc: 'Keep up with my lifestyle',
      practice: 'Daily Athletic Maintenance',
      duration: '30–45 min',
      freq: '3–5 days',
      level: 'All Levels',
      courses: [
        { title: 'Quick Dumbbell Circuit', desc: 'Fast full-body workout in 30 mins' },
        { title: 'Bodyweight Mastery', desc: 'Zero equipment functional strength' },
        { title: 'Active Flow Recharge', desc: 'Active recovery and joint reset' },
      ]
    }
  }

  const activeGoalData = goalConfigs[quizGoal] || goalConfigs.build_muscle

  // --------------------------------------------------------------------------
  // CARD 1: Smart Workout & 1RM Tracker State
  // --------------------------------------------------------------------------
  const [selectedExercise, setSelectedExercise] = useState('Barbell Bench Press')
  const [workWeight, setWorkWeight] = useState(100)
  const [workReps, setWorkReps] = useState(8)
  const [workSets, setWorkSets] = useState(3)
  const [loggedNotification, setLoggedNotification] = useState('')

  const calculated1RM = useMemo(() => {
    const w = parseFloat(workWeight) || 0
    const r = parseInt(workReps, 10) || 1
    if (r <= 1) return w
    // Epley Formula: 1RM = w * (1 + r / 30)
    return Math.round(w * (1 + r / 30) * 10) / 10
  }, [workWeight, workReps])

  const handleLogSet = (e) => {
    e.preventDefault()
    setLoggedNotification(`Recorded: ${selectedExercise} — ${workWeight} kg × ${workReps} reps (Set logged)`)
    setTimeout(() => setLoggedNotification(''), 4000)
  }

  // --------------------------------------------------------------------------
  // CARD 2: Barbell Math & Live Interval Timer State
  // --------------------------------------------------------------------------
  const [subTab, setSubTab] = useState('plates') // 'plates' | 'timer'
  const [targetBarbellWeight, setTargetBarbellWeight] = useState(100)
  const [barWeight, setBarWeight] = useState(20)

  // Calculate plates per side
  const platesPerSide = useMemo(() => {
    const target = parseFloat(targetBarbellWeight) || 0
    const bar = parseFloat(barWeight) || 20
    let rem = Math.max(0, (target - bar) / 2)
    const available = [25, 20, 15, 10, 5, 2.5, 1.25]
    const counts = {}

    for (const p of available) {
      if (rem >= p) {
        const num = Math.floor(rem / p)
        counts[p] = num
        rem = Math.round((rem - num * p) * 100) / 100
      }
    }
    return counts
  }, [targetBarbellWeight, barWeight])

  // Live Timer State
  const [timerMode, setTimerMode] = useState('tabata') // 'tabata' (20/10) | 'emom' (60s)
  const [timerSeconds, setTimerSeconds] = useState(20)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerState, setTimerState] = useState('WORK') // 'WORK' | 'REST'
  const timerIntervalRef = useRef(null)

  useEffect(() => {
    if (timerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            if (timerMode === 'tabata') {
              const nextState = timerState === 'WORK' ? 'REST' : 'WORK'
              setTimerState(nextState)
              return nextState === 'WORK' ? 20 : 10
            }
            if (timerMode === 'emom') {
              return 60
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(timerIntervalRef.current)
    }
    return () => clearInterval(timerIntervalRef.current)
  }, [timerRunning, timerState, timerMode])

  const handleTimerStart = () => setTimerRunning(true)
  const handleTimerPause = () => setTimerRunning(false)
  const handleTimerReset = () => {
    setTimerRunning(false)
    setTimerState('WORK')
    setTimerSeconds(timerMode === 'tabata' ? 20 : 60)
  }

  // --------------------------------------------------------------------------
  // CARD 3: Exercise Directory Search & Filter State
  // --------------------------------------------------------------------------
  const [exSearch, setExSearch] = useState('')
  const [exEquipFilter, setExEquipFilter] = useState('All')

  const sampleDirectory = useMemo(() => [
    { name: 'Barbell Bench Press', muscle: 'Chest', eq: 'Barbell', target: 'Pectoralis Major' },
    { name: 'Incline Dumbbell Press', muscle: 'Chest', eq: 'Dumbbell', target: 'Clavicular Head' },
    { name: 'Conventional Deadlift', muscle: 'Back', eq: 'Barbell', target: 'Posterior Chain' },
    { name: 'Neutral-Grip Lat Pulldown', muscle: 'Back', eq: 'Cable', target: 'Latissimus Dorsi' },
    { name: 'Barbell Back Squat', muscle: 'Legs', eq: 'Barbell', target: 'Quadriceps' },
    { name: 'Romanian Deadlift (RDL)', muscle: 'Legs', eq: 'Barbell', target: 'Hamstrings' },
    { name: 'Standing Overhead Military Press', muscle: 'Shoulders', eq: 'Barbell', target: 'Anterior Deltoid' },
    { name: 'Strict Dumbbell Lateral Raise', muscle: 'Shoulders', eq: 'Dumbbell', target: 'Lateral Deltoid' },
    { name: 'Standing Barbell Bicep Curl', muscle: 'Arms', eq: 'Barbell', target: 'Biceps Brachii' },
    { name: 'Triceps Rope Pushdown', muscle: 'Arms', eq: 'Cable', target: 'Triceps Lateral Head' },
    { name: 'Hanging Leg Raises', muscle: 'Core', eq: 'Bodyweight', target: 'Rectus Abdominis' },
    { name: 'Weighted Chest Dips', muscle: 'Chest', eq: 'Bodyweight', target: 'Lower Chest' },
  ], [])

  const filteredExercises = useMemo(() => {
    return sampleDirectory.filter((ex) => {
      const matchSearch = ex.name.toLowerCase().includes(exSearch.toLowerCase()) ||
                          ex.muscle.toLowerCase().includes(exSearch.toLowerCase())
      const matchEquip = exEquipFilter === 'All' || ex.eq === exEquipFilter
      return matchSearch && matchEquip
    })
  }, [sampleDirectory, exSearch, exEquipFilter])

  // --------------------------------------------------------------------------
  // CARD 4: Macro & Nutrition Fuel Matrix State
  // --------------------------------------------------------------------------
  const [macroWeight, setMacroWeight] = useState(75)
  const [macroGoal, setMacroGoal] = useState('maintain') // 'cut' | 'maintain' | 'bulk'

  const computedMacros = useMemo(() => {
    const w = parseFloat(macroWeight) || 75
    // Base BMR ~ w * 24 * 1.45 (moderate athlete activity)
    let cals = Math.round(w * 24 * 1.45)
    if (macroGoal === 'cut') cals -= 500
    if (macroGoal === 'bulk') cals += 350

    const proteinGrams = Math.round(w * 2.2)
    const fatGrams = Math.round(w * 0.9)
    const proteinCals = proteinGrams * 4
    const fatCals = fatGrams * 9
    const carbCals = Math.max(0, cals - proteinCals - fatCals)
    const carbGrams = Math.round(carbCals / 4)

    return {
      cals,
      protein: proteinGrams,
      fat: fatGrams,
      carbs: carbGrams,
    }
  }, [macroWeight, macroGoal])

  // --------------------------------------------------------------------------
  // CARD 5: Live Gym Crowd Meter & 24/7 QR Check-In State
  // --------------------------------------------------------------------------
  const [branch, setBranch] = useState('downtown')
  const [qrActive, setQrActive] = useState(false)

  const branchData = {
    downtown: { name: 'Downtown Elite 24/7', capacity: 42, racksFree: 6, peak: 'Low Wait' },
    uptown: { name: 'Uptown Performance', capacity: 78, racksFree: 2, peak: 'Peak Hour' },
    brooklyn: { name: 'Brooklyn Powerhouse', capacity: 28, racksFree: 8, peak: 'Optimal' },
  }
  const currentBranch = branchData[branch]

  // --------------------------------------------------------------------------
  // CARD 6: Transparent Membership & Instant Pass State
  // --------------------------------------------------------------------------
  const [passType, setPassType] = useState('monthly') // 'monthly' | 'weekly' | 'daypass'
  const [studentDiscount, setStudentDiscount] = useState(false)
  const [lockerAddon, setLockerAddon] = useState(false)
  const [passActivated, setPassActivated] = useState(false)

  const membershipCalc = useMemo(() => {
    let base = 29
    let period = '/ month'
    if (passType === 'weekly') {
      base = 12
      period = '/ week'
    } else if (passType === 'daypass') {
      base = 5
      period = '/ day pass'
    }

    const discountAmount = studentDiscount ? Math.round(base * 0.15 * 100) / 100 : 0
    const addonAmount = lockerAddon ? 5 : 0
    const total = Math.round((base - discountAmount + addonAmount) * 100) / 100

    return { base, period, discountAmount, addonAmount, total }
  }, [passType, studentDiscount, lockerAddon])

  return (
    <section className="opengym-bento-section">
      <div className="opengym-bento-container">

        {/* ====================================================================
            PULSE FITNESS QUIZ & AI PLAN GENERATOR (Dribbble: Ronas IT)
            ==================================================================== */}
        <div className="pulse-quiz-platform-wrapper">
          {/* Section Header */}
          <div className="bento-section-header">
            <h2 className="bento-section-title">
              Your goals. <span className="pulse-blue-text">Our plan.</span>
            </h2>
            <p className="bento-section-subtitle">
              Take a short fitness quiz and get a personalized training program, calibrated to your exact targets.
            </p>
          </div>

          {/* Quiz or Result View */}
          {!quizCompleted ? (
            /* SCREEN 1: Interactive Fitness Quiz */
            <div className="pulse-quiz-bento-layout">
              {/* Left Column: Bento Quiz UI */}
              <div className="pulse-quiz-left-col">
                {/* Top Mini Bento Row */}
                <div className="pulse-mini-bento-row">
                  <div className="pulse-mini-card">
                    <span className="pulse-tag-badge">FITNESS QUIZ</span>
                    <h4 className="pulse-mini-title">Find your <span className="pulse-italic-blue">perfect</span> plan</h4>
                    <p className="pulse-mini-sub">Answer a few questions and get your AI plan.</p>
                  </div>

                  <div className="pulse-mini-card center-stat">
                    <span className="pulse-stat-label">Question</span>
                    <div className="pulse-stat-number">06</div>
                    <span className="pulse-stat-sub">of 12</span>
                  </div>

                  <div className="pulse-mini-card center-stat">
                    <span className="pulse-stat-label">Type</span>
                    <div className="pulse-stat-text">Strength</div>
                    <span className="pulse-stat-sub">Kinetic & Power</span>
                  </div>
                </div>

                {/* Main Question Card */}
                <div className="pulse-main-quiz-card">
                  <div className="pulse-question-top-row">
                    <div>
                      <span className="pulse-section-micro-tag">CHOOSE YOUR GOAL</span>
                      <h3 className="pulse-question-heading">What do you want to achieve?</h3>
                      <p className="pulse-question-desc">
                        Select the option that best fits your current motivation or long-term training goal.
                      </p>
                    </div>

                    {/* 3D Dartboard Target Graphic */}
                    <div className="pulse-3d-target-visual" title="Calibrated Target">
                      <div className="target-ring outer" />
                      <div className="target-ring mid" />
                      <div className="target-ring bullseye" />
                      <div className="target-dart-arrow" />
                    </div>
                  </div>

                  {/* 6 Choice Cards in 3x2 Grid */}
                  <div className="pulse-choices-grid">
                    {[
                      {
                        id: 'build_muscle',
                        title: 'Build muscle',
                        desc: 'Strength & definition',
                        icon: (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 5v14M18 5v14M2 9h4M18 9h4M2 15h4M18 15h4M6 12h12" />
                          </svg>
                        )
                      },
                      {
                        id: 'lose_weight',
                        title: 'Lose weight',
                        desc: 'Feel lighter and healthier',
                        icon: (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 3v18M3 12h18M6 8l6-5 6 5M6 16l6 5 6-5" />
                          </svg>
                        )
                      },
                      {
                        id: 'boost_stamina',
                        title: 'Boost stamina',
                        desc: 'Energy & performance',
                        icon: (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                          </svg>
                        )
                      },
                      {
                        id: 'olympic_strength',
                        title: 'Olympic strength',
                        desc: '1RM power & heavy loads',
                        icon: (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                          </svg>
                        )
                      },
                      {
                        id: 'be_healthier',
                        title: 'Be healthier',
                        desc: 'Feel good, inside and out',
                        icon: (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                          </svg>
                        )
                      },
                      {
                        id: 'stay_active',
                        title: 'Stay active',
                        desc: 'Keep up with my lifestyle',
                        icon: (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                        )
                      }
                    ].map(choice => (
                      <motion.div
                        key={choice.id}
                        className={`pulse-choice-card ${quizGoal === choice.id ? 'selected' : ''}`}
                        onClick={() => setQuizGoal(choice.id)}
                        whileHover={{ scale: 1.025, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                      >
                        <div className="pulse-choice-top">
                          <div className="pulse-choice-icon-wrap">
                            {choice.icon}
                          </div>
                          <div className="pulse-choice-check-circle">
                            {quizGoal === choice.id && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className="pulse-choice-title">{choice.title}</div>
                        <div className="pulse-choice-sub">{choice.desc}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Actions Row */}
                  <div className="pulse-quiz-bottom-actions">
                    <button
                      className="pulse-skip-btn"
                      onClick={() => setQuizCompleted(true)}
                    >
                      Skip quiz
                    </button>
                    <div className="pulse-step-buttons">
                      <button
                        className="pulse-btn-back"
                        onClick={() => setQuizGoal('build_muscle')}
                      >
                        Back
                      </button>
                      <button
                        className="pulse-btn-next"
                        onClick={() => setQuizCompleted(true)}
                      >
                        <span>Next</span>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Deep Atmospheric Card + Stacked Metrics (ডানপাশে মেট্রিক কার্ড স্ট্যাকটা অবশ্যই থাকতে হবে) */}
              <div className="pulse-quiz-right-col">
                <div className="pulse-atmospheric-card">
                  <div className="pulse-atm-glow-backdrop" />
                  <div className="pulse-atm-silhouette-bg" />

                  <div className="pulse-atm-top-badge">
                    <span className="sparkle">✦</span>
                    <span>AI is learning what works for you</span>
                  </div>

                  <div className="pulse-atm-middle-content">
                    <span className="pulse-atm-pill">FIND YOUR BALANCE</span>
                    <h3 className="pulse-atm-hero-title">Your goals.<br />Our plan.</h3>
                    <p className="pulse-atm-desc">
                      Take a short fitness quiz and get a personalized training program, built just for you by AI.
                    </p>
                  </div>

                  {/* Right Stacked Metric Cards (ডানপাশে মেট্রিক কার্ড স্ট্যাকটা অবশ্যই থাকতে হবে) */}
                  <div className="pulse-right-metric-stack">
                    <div className="pulse-metric-card-row">
                      <div className="metric-info">
                        <span className="metric-tag">RECOMMENDED PRACTICE</span>
                        <div className="metric-value">{activeGoalData.practice}</div>
                        <span className="metric-sub">Calibrated for peak muscle kinetics</span>
                      </div>
                      <span className="metric-arrow">↗</span>
                    </div>

                    <div className="pulse-metric-card-row">
                      <div className="metric-info">
                        <span className="metric-tag">Recommended duration</span>
                        <div className="metric-value">{activeGoalData.duration}</div>
                        <span className="metric-sub">per session</span>
                      </div>
                      <span className="metric-icon-clock">⏱</span>
                    </div>

                    <div className="pulse-metric-card-row">
                      <div className="metric-info">
                        <span className="metric-tag">Weekly frequency</span>
                        <div className="metric-value">{activeGoalData.freq}</div>
                        <span className="metric-sub">per week</span>
                      </div>
                      <span className="metric-icon-calendar">📅</span>
                    </div>

                    <div className="pulse-metric-card-row">
                      <div className="metric-info">
                        <span className="metric-tag">Your level</span>
                        <div className="metric-value">{activeGoalData.level}</div>
                        <span className="metric-sub">Periodized training curve</span>
                      </div>
                      <span className="metric-icon-level">📊</span>
                    </div>

                    {/* Primary CTA */}
                    <motion.button
                      className="pulse-start-cta-btn"
                      onClick={() => onStartWorkout ? onStartWorkout() : nav('/workout')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      <span>Start your training</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* SCREEN 2: Personalized Plan Ready View (Matching Screenshot 2) */
            <div className="pulse-result-view-container">
              <div className="pulse-result-hero-box">
                <div className="pulse-result-left">
                  <div className="pulse-result-top-badges">
                    <span className="pulse-result-ai-tag">✦ Your Result</span>
                    <span className="pulse-result-category-tag">BODY BALANCE & POWER</span>
                  </div>

                  <h2 className="pulse-result-title">
                    Your training plan <br />
                    <span className="pulse-result-italic">is ready</span>
                  </h2>

                  <p className="pulse-result-desc">
                    Based on your quiz results, we've selected the optimal resistance practices and periodization for {activeGoalData.name.toLowerCase()}. Here's your calibrated training plan and recommended course tracks.
                  </p>

                  {/* Recommended Courses (3 Cards) */}
                  <div className="pulse-recommended-courses-section">
                    <div className="pulse-courses-label">RECOMMENDED TRACKS</div>
                    <div className="pulse-courses-grid">
                      {activeGoalData.courses.map((course, idx) => (
                        <motion.div
                          key={idx}
                          className="pulse-course-card"
                          onClick={() => onStartWorkout ? onStartWorkout() : nav('/workout')}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        >
                          <div className={`course-bg-overlay gradient-${idx + 1}`} />
                          <div className="course-card-content">
                            <div className="course-card-title">{course.title}</div>
                            <div className="course-card-desc">{course.desc}</div>
                          </div>
                          <span className="course-arrow">↗</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Stacked Metric Cards (ডানপাশে মেট্রিক কার্ড স্ট্যাকটা অবশ্যই থাকতে হবে) */}
                <div className="pulse-result-right-stack">
                  <div className="pulse-result-top-pill">
                    <span>✦ Your personalized plan</span>
                    <span className="sub">Based on your quiz results</span>
                  </div>

                  <div className="pulse-metric-card-row">
                    <div className="metric-info">
                      <span className="metric-tag">RECOMMENDED PRACTICE</span>
                      <div className="metric-value">{activeGoalData.practice}</div>
                      <span className="metric-sub">Balance, kinetic power and strength</span>
                    </div>
                    <span className="metric-arrow">↗</span>
                  </div>

                  <div className="pulse-metric-card-row">
                    <div className="metric-info">
                      <span className="metric-tag">Recommended duration</span>
                      <div className="metric-value">{activeGoalData.duration}</div>
                      <span className="metric-sub">per session</span>
                    </div>
                    <span className="metric-icon-clock">⏱</span>
                  </div>

                  <div className="pulse-metric-card-row">
                    <div className="metric-info">
                      <span className="metric-tag">Weekly frequency</span>
                      <div className="metric-value">{activeGoalData.freq}</div>
                      <span className="metric-sub">per week</span>
                    </div>
                    <span className="metric-icon-calendar">📅</span>
                  </div>

                  <div className="pulse-metric-card-row">
                    <div className="metric-info">
                      <span className="metric-tag">Your level</span>
                      <div className="metric-value">{activeGoalData.level}</div>
                      <span className="metric-sub">Optimal stimulus for your tier</span>
                    </div>
                    <span className="metric-icon-level">📊</span>
                  </div>

                  {/* Primary CTA */}
                  <button
                    className="pulse-start-cta-btn"
                    onClick={() => onStartWorkout ? onStartWorkout() : nav('/workout')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    <span>Start your training</span>
                  </button>

                  <button
                    className="pulse-retake-btn"
                    onClick={() => setQuizCompleted(false)}
                  >
                    ↺ Retake Quiz
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ====================================================================
            OPENGYM POWERHOUSE FEATURE SLOTS (Dark Obsidian High-Craft)
            ==================================================================== */}
        <div className="pulse-features-slot-header">
          <h3 className="pulse-features-title">
            OpenGym Power Suite Features
          </h3>
          <p className="pulse-features-sub">
            Calculated 1RM math, Olympic barbell visualizers, dynamic macronutrient matrices, and turnstile credentials.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="bento-functional-grid">

          {/* CARD 1: Smart Workout & 1RM Tracker Form (col-span-2, theme-dark #0B0D12) */}
          <div className="bento-card col-span-2 theme-dark">
            <div className="card-top">
              <div className="card-header-tag">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 5v14M18 5v14M2 9h4M18 9h4M2 15h4M18 15h4M6 12h12" />
                </svg>
                <span>Live Kinetic Tracker</span>
              </div>
              <h3 className="card-title">Smart Workout & 1RM Tracker</h3>
              <p className="card-desc">
                Input your current working weight and reps to compute your exact 1-Rep Max via Epley kinetic formula and log progressive sets.
              </p>

              {/* Working Functional Form */}
              <div className="functional-form-box">
                <form onSubmit={handleLogSet}>
                  <div className="form-row">
                    <div className="form-field" style={{ flex: 2 }}>
                      <label className="form-label">Exercise Target</label>
                      <select
                        className="form-select"
                        value={selectedExercise}
                        onChange={(e) => setSelectedExercise(e.target.value)}
                      >
                        <option value="Barbell Bench Press">Barbell Bench Press</option>
                        <option value="Barbell Back Squat">Barbell Back Squat</option>
                        <option value="Conventional Deadlift">Conventional Deadlift</option>
                        <option value="Standing Overhead Press">Standing Overhead Press</option>
                        <option value="Bent-Over Barbell Row">Bent-Over Barbell Row</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label className="form-label">Load (kg)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={workWeight}
                        min="10"
                        max="500"
                        step="0.5"
                        onChange={(e) => setWorkWeight(e.target.value)}
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Reps</label>
                      <input
                        type="number"
                        className="form-input"
                        value={workReps}
                        min="1"
                        max="30"
                        onChange={(e) => setWorkReps(e.target.value)}
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Sets</label>
                      <input
                        type="number"
                        className="form-input"
                        value={workSets}
                        min="1"
                        max="10"
                        onChange={(e) => setWorkSets(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Calculated 1RM & Percentage Matrix */}
                  <div className="rm-percentages-grid">
                    <div className="rm-col">
                      <div className="rm-pct-label">Estimated 1RM</div>
                      <div className="rm-pct-val" style={{ color: '#E8EFF5', fontSize: 16 }}>
                        {calculated1RM} kg
                      </div>
                    </div>
                    <div className="rm-col">
                      <div className="rm-pct-label">90% (Heavy 3-5)</div>
                      <div className="rm-pct-val">{Math.round(calculated1RM * 0.9 * 10) / 10} kg</div>
                    </div>
                    <div className="rm-col">
                      <div className="rm-pct-label">80% (Hypertrophy 8-10)</div>
                      <div className="rm-pct-val">{Math.round(calculated1RM * 0.8 * 10) / 10} kg</div>
                    </div>
                    <div className="rm-col">
                      <div className="rm-pct-label">70% (Speed / Volume)</div>
                      <div className="rm-pct-val">{Math.round(calculated1RM * 0.7 * 10) / 10} kg</div>
                    </div>
                  </div>

                  {loggedNotification && (
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#16A34A', marginBottom: 10, background: '#DCFCE7', padding: '6px 12px', borderRadius: 8 }}>
                      {loggedNotification}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="submit" className="form-btn-submit" style={{ flex: 1 }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Log Set to Tracker</span>
                    </button>
                    <button
                      type="button"
                      className="form-btn-secondary"
                      onClick={() => onStartWorkout ? onStartWorkout() : nav('/workout')}
                    >
                      <span>Launch Live Session</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* CARD 2: Barbell Plate Math & Interval Timers (col-span-1, theme-slate-blue #5271C4) */}
          <div className="bento-card col-span-1 theme-slate-blue">
            <div className="card-top">
              <div className="card-header-tag">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>Olympic Math & Timer</span>
              </div>
              <h3 className="card-title">Barbell Math & Timers</h3>
              <p className="card-desc">
                Calculate Olympic barbell sleeve loading or run a live countdown interval clock for Tabata and EMOM routines.
              </p>

              {/* Functional Sub-Tab Box */}
              <div className="functional-form-box">
                <div className="mini-tab-bar">
                  <button
                    className={`mini-tab-btn ${subTab === 'plates' ? 'active' : ''}`}
                    onClick={() => setSubTab('plates')}
                  >
                    Plate Calculator
                  </button>
                  <button
                    className={`mini-tab-btn ${subTab === 'timer' ? 'active' : ''}`}
                    onClick={() => setSubTab('timer')}
                  >
                    Interval Timer
                  </button>
                </div>

                {subTab === 'plates' ? (
                  <div>
                    <div className="form-row">
                      <div className="form-field">
                        <label className="form-label">Target Weight (kg)</label>
                        <input
                          type="number"
                          className="form-input"
                          value={targetBarbellWeight}
                          min="20"
                          max="450"
                          step="2.5"
                          onChange={(e) => setTargetBarbellWeight(e.target.value)}
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Bar Weight</label>
                        <select
                          className="form-select"
                          value={barWeight}
                          onChange={(e) => setBarWeight(parseFloat(e.target.value))}
                        >
                          <option value="20">20 kg (Standard)</option>
                          <option value="15">15 kg (Technique)</option>
                        </select>
                      </div>
                    </div>

                    {/* Barbell Sleeve Visualizer */}
                    <div className="barbell-visual-wrap">
                      <div className="barbell-shaft" />
                      <div className="barbell-collar" />
                      <div className="plates-stack">
                        {Object.entries(platesPerSide).flatMap(([plate, count]) =>
                          Array.from({ length: count }).map((_, idx) => (
                            <span
                              key={`${plate}-${idx}`}
                              className={`visual-plate p${plate.replace('.', '')}`}
                              title={`${plate} kg plate`}
                            >
                              {plate}
                            </span>
                          ))
                        )}
                        {Object.keys(platesPerSide).length === 0 && (
                          <span style={{ fontSize: 10, color: '#456D8B' }}>Empty Bar</span>
                        )}
                      </div>
                    </div>

                    <div style={{ fontSize: 11, color: '#456D8B', fontWeight: 600, textAlign: 'center' }}>
                      Per side: {Object.entries(platesPerSide).map(([p, c]) => `${c}×${p}kg`).join(', ') || 'No plates'}
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Live Interval Timer */}
                    <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                      <button
                        className={`ex-pill ${timerMode === 'tabata' ? 'active' : ''}`}
                        onClick={() => { setTimerMode('tabata'); setTimerSeconds(20); setTimerState('WORK'); setTimerRunning(false); }}
                      >
                        Tabata (20s/10s)
                      </button>
                      <button
                        className={`ex-pill ${timerMode === 'emom' ? 'active' : ''}`}
                        onClick={() => { setTimerMode('emom'); setTimerSeconds(60); setTimerState('WORK'); setTimerRunning(false); }}
                      >
                        EMOM (60s)
                      </button>
                    </div>

                    <div className="timer-display-box">
                      <div className="timer-digits">
                        00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
                      </div>
                      <span className={`timer-state-tag ${timerState === 'WORK' ? 'work' : 'rest'}`}>
                        {timerRunning ? timerState : 'READY'}
                      </span>
                    </div>

                    <div className="timer-actions-row">
                      {!timerRunning ? (
                        <button className="timer-action-btn start" onClick={handleTimerStart}>Start</button>
                      ) : (
                        <button className="timer-action-btn pause" onClick={handleTimerPause}>Pause</button>
                      )}
                      <button className="timer-action-btn reset" onClick={handleTimerReset}>Reset</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CARD 3: Exercise Directory Search & Filter (col-span-1, theme-ice-blue #E8F0FE) */}
          <div className="bento-card col-span-1 theme-ice-blue">
            <div className="card-top">
              <div className="card-header-tag">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                <span>5,600+ Exercise Directory</span>
              </div>
              <h3 className="card-title">Exercise Directory</h3>
              <p className="card-desc">
                Search and filter verified compound and isolation movements by target anatomy and available equipment.
              </p>

              {/* Working Search & Filter Form */}
              <div className="functional-form-box">
                <div style={{ marginBottom: 10 }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search exercise or muscle..."
                    value={exSearch}
                    onChange={(e) => setExSearch(e.target.value)}
                  />
                </div>

                <div className="ex-filter-pills">
                  {['All', 'Barbell', 'Dumbbell', 'Cable', 'Bodyweight'].map(eq => (
                    <button
                      key={eq}
                      className={`ex-pill ${exEquipFilter === eq ? 'active' : ''}`}
                      onClick={() => setExEquipFilter(eq)}
                    >
                      {eq}
                    </button>
                  ))}
                </div>

                <div className="ex-dir-results">
                  {filteredExercises.slice(0, 4).map((ex, i) => (
                    <div key={i} className="ex-dir-item">
                      <div>
                        <div className="ex-dir-name">{ex.name}</div>
                        <div style={{ fontSize: 10, color: '#456D8B' }}>{ex.target}</div>
                      </div>
                      <span className="ex-dir-eq">{ex.eq}</span>
                    </div>
                  ))}
                  {filteredExercises.length === 0 && (
                    <div style={{ fontSize: 12, color: '#456D8B', textAlign: 'center', padding: '12px 0' }}>
                      No matching exercises found.
                    </div>
                  )}
                </div>

                <button
                  className="form-btn-submit"
                  style={{ background: '#1B415D' }}
                  onClick={() => onOpenLibrary ? onOpenLibrary() : nav('/library')}
                >
                  <span>Explore Full 5,600+ Library</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* CARD 4: Macro & Nutrition Fuel Matrix (col-span-1, theme-ice-blue #E8F0FE) */}
          <div className="bento-card col-span-1 theme-ice-blue">
            <div className="card-top">
              <div className="card-header-tag">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 20V10M12 20V4M6 20v-6" />
                </svg>
                <span>Dynamic Fuel Matrix</span>
              </div>
              <h3 className="card-title">Macro & Nutrition Fuel</h3>
              <p className="card-desc">
                Calculate calibrated caloric expenditure and exact macronutrient grams mapped to daily training volume.
              </p>

              {/* Working Nutrition Calculator Form */}
              <div className="functional-form-box">
                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label">Bodyweight (kg)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={macroWeight}
                      min="40"
                      max="200"
                      onChange={(e) => setMacroWeight(e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Training Phase</label>
                    <select
                      className="form-select"
                      value={macroGoal}
                      onChange={(e) => setMacroGoal(e.target.value)}
                    >
                      <option value="cut">Cut (-500 kcal)</option>
                      <option value="maintain">Maintain (Balance)</option>
                      <option value="bulk">Bulk (+350 kcal)</option>
                    </select>
                  </div>
                </div>

                <div className="macro-output-grid">
                  <div className="macro-bar-row">
                    <div className="macro-label-wrap">
                      <span>Daily Energy</span>
                      <span style={{ color: '#E8EFF5' }}>{computedMacros.cals} kcal</span>
                    </div>
                    <div className="macro-meter-bg">
                      <div className="macro-meter-fill" style={{ width: '85%', background: '#1B415D' }} />
                    </div>
                  </div>

                  <div className="macro-bar-row">
                    <div className="macro-label-wrap">
                      <span>Protein (2.2g/kg)</span>
                      <span>{computedMacros.protein}g</span>
                    </div>
                    <div className="macro-meter-bg">
                      <div className="macro-meter-fill" style={{ width: '92%', background: '#456D8B' }} />
                    </div>
                  </div>

                  <div className="macro-bar-row">
                    <div className="macro-label-wrap">
                      <span>Carbohydrates</span>
                      <span>{computedMacros.carbs}g</span>
                    </div>
                    <div className="macro-meter-bg">
                      <div className="macro-meter-fill" style={{ width: '74%', background: '#1B415D' }} />
                    </div>
                  </div>

                  <div className="macro-bar-row">
                    <div className="macro-label-wrap">
                      <span>Fats</span>
                      <span>{computedMacros.fat}g</span>
                    </div>
                    <div className="macro-meter-bg">
                      <div className="macro-meter-fill" style={{ width: '60%', background: '#456D8B' }} />
                    </div>
                  </div>
                </div>

                <button
                  className="form-btn-submit"
                  style={{ background: '#1B415D' }}
                  onClick={() => onOpenMacro && onOpenMacro()}
                >
                  <span>Open Full Nutrition Engine</span>
                </button>
              </div>
            </div>
          </div>

          {/* CARD 5: Live Gym Crowd Meter & 24/7 QR Check-In (col-span-1, theme-slate-blue #5271C4) */}
          <div className="bento-card col-span-1 theme-slate-blue">
            <div className="card-top">
              <div className="card-header-tag">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>Live Facility Sensor</span>
              </div>
              <h3 className="card-title">Live Crowd & QR Pass</h3>
              <p className="card-desc">
                Live sensor capacity monitoring across branch turnstiles with instant digital QR pass generation.
              </p>

              {/* Working Live Crowd & QR Form */}
              <div className="functional-form-box">
                <div style={{ marginBottom: 12 }}>
                  <label className="form-label" style={{ marginBottom: 4 }}>Select Branch</label>
                  <select
                    className="form-select"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                  >
                    <option value="downtown">Downtown Elite 24/7</option>
                    <option value="uptown">Uptown High Performance</option>
                    <option value="brooklyn">Brooklyn Powerhouse</option>
                  </select>
                </div>

                <div className="crowd-meter-box">
                  <div className="crowd-header">
                    <span>Facility Capacity</span>
                    <span style={{ color: currentBranch.capacity > 70 ? '#DC2626' : '#16A34A' }}>
                      {currentBranch.capacity}% Full
                    </span>
                  </div>
                  <div className="crowd-bar-bg">
                    <div
                      className="crowd-bar-fill"
                      style={{
                        width: `${currentBranch.capacity}%`,
                        background: currentBranch.capacity > 70 ? '#DC2626' : currentBranch.capacity > 45 ? '#EAB308' : '#16A34A',
                      }}
                    />
                  </div>
                  <div className="crowd-sub-info">
                    <span>Squat Racks: <strong>{currentBranch.racksFree} Free</strong></span>
                    <span>Status: <strong>{currentBranch.peak}</strong></span>
                  </div>
                </div>

                {qrActive ? (
                  <div className="qr-code-rendered-box">
                    <div className="qr-code-graphic">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                        <rect x="14" y="14" width="3" height="3" />
                        <rect x="18" y="18" width="3" height="3" />
                      </svg>
                    </div>
                    <div className="qr-code-text">
                      <span className="qr-code-id">PASS #{Math.floor(100000 + Math.random() * 900000)}</span>
                      <span className="qr-code-status">● Turnstile Armed</span>
                      <span style={{ fontSize: 10, color: '#456D8B' }}>Valid for 15 minutes</span>
                    </div>
                  </div>
                ) : null}

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="form-btn-submit"
                    style={{ background: '#1B415D', flex: 1 }}
                    onClick={() => setQrActive(!qrActive)}
                  >
                    <span>{qrActive ? 'Hide QR Code' : 'Generate Digital Pass'}</span>
                  </button>
                  <button
                    className="form-btn-secondary"
                    onClick={() => onOpenCheckin ? onOpenCheckin() : nav('/checkin')}
                  >
                    Check In
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 6: Transparent Membership & Instant Pass with @unlumen-ui/blob-card (col-span-3) */}
          <div className="col-span-3 bento-blob-membership-wrapper">
            <BlobCard
              className="bento-blob-membership-card"
              headerHeight={210}
              header={
                <div>
                  <div className="card-header-tag" style={{ background: 'rgba(69, 109, 139, 0.25)', color: '#E8EFF5' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                    <span>Zero Lock-In Contract</span>
                  </div>
                  <h3 className="card-title" style={{ color: '#E8EFF5', fontSize: '22px', fontWeight: 800 }}>
                    Transparent Membership & Instant Access
                  </h3>
                  <p className="card-desc" style={{ color: '#456D8B', maxWidth: '720px' }}>
                    Select your preferred training cycle. No hidden setup charges, no fine print, cancel or freeze anytime with a single click.
                  </p>
                </div>
              }
            >
              {/* Working Membership Form inside BlobCard */}
              <div className="functional-form-box" style={{ marginTop: 0 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                  {/* Left: Options & Toggles */}
                  <div>
                    <div className="membership-type-tabs">
                      <button
                        className={`membership-type-btn ${passType === 'monthly' ? 'active' : ''}`}
                        onClick={() => setPassType('monthly')}
                      >
                        Monthly ($29/mo)
                      </button>
                      <button
                        className={`membership-type-btn ${passType === 'weekly' ? 'active' : ''}`}
                        onClick={() => setPassType('weekly')}
                      >
                        Weekly ($12/wk)
                      </button>
                      <button
                        className={`membership-type-btn ${passType === 'daypass' ? 'active' : ''}`}
                        onClick={() => setPassType('daypass')}
                      >
                        Drop-in Day Pass ($5)
                      </button>
                    </div>

                    <div className="membership-options-row">
                      <label className="membership-check-label">
                        <input
                          type="checkbox"
                          checked={studentDiscount}
                          onChange={(e) => setStudentDiscount(e.target.checked)}
                        />
                        <span>Student / First Responder (-15% Discount)</span>
                      </label>
                      <label className="membership-check-label">
                        <input
                          type="checkbox"
                          checked={lockerAddon}
                          onChange={(e) => setLockerAddon(e.target.checked)}
                        />
                        <span>Dedicated Locker & Towel Service (+$5)</span>
                      </label>
                    </div>

                    <div style={{ fontSize: 12, color: '#456D8B', lineHeight: 1.5 }}>
                      Includes 24/7 biometric gym turnstile access, mobile training app, Olympic platform access, and guest day passes.
                    </div>
                  </div>

                  {/* Right: Real-time Invoice Breakdown */}
                  <div>
                    <div className="invoice-breakdown-box">
                      <div className="invoice-row">
                        <span>Base Plan ({passType})</span>
                        <span>${membershipCalc.base.toFixed(2)}</span>
                      </div>
                      {studentDiscount && (
                        <div className="invoice-row" style={{ color: '#456D8B' }}>
                          <span>Student / First Responder Discount (-15%)</span>
                          <span>-${membershipCalc.discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      {lockerAddon && (
                        <div className="invoice-row">
                          <span>Locker & Towel Service</span>
                          <span>+${membershipCalc.addonAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="invoice-row">
                        <span>Initiation / Processing Fee</span>
                        <span style={{ color: '#E8EFF5', fontWeight: 700 }}>$0.00 (Free)</span>
                      </div>
                      <div className="invoice-row total">
                        <span>Total Due Today</span>
                        <span>${membershipCalc.total.toFixed(2)} {membershipCalc.period}</span>
                      </div>
                    </div>

                    {passActivated ? (
                      <div style={{ background: '#1B415D', color: '#E8EFF5', padding: '10px 14px', borderRadius: 8, fontSize: 13, fontWeight: 700, marginBottom: 10, textAlign: 'center' }}>
                        Pass Activated: Check your email & QR Check-In tab for turnstile credentials.
                      </div>
                    ) : null}

                    <button
                      className="form-btn-submit"
                      style={{ background: '#1B415D' }}
                      onClick={() => setPassActivated(true)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      <span>Activate Instant Pass (${membershipCalc.total.toFixed(2)})</span>
                    </button>
                  </div>
                </div>
              </div>
            </BlobCard>
          </div>

        </div>
      </div>
    </section>
  )
}
