import { useState, useEffect } from 'react'
import { MacroNutritionEngine } from '../../../brain/ai-coach/macroNutrition.js'
import Icon from './Icon.jsx'
import './NikeThemeLayer.css'

export default function MacroNutritionModal({ userWeight = 75, onClose }) {
  const [goal, setGoal] = useState('bulk')
  const [logged, setLogged] = useState(() => {
    try {
      const saved = localStorage.getItem('opengym_macro_log')
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return { protein: 120, carbs: 190, fats: 52, waterMl: 2250 }
  })

  const targets = MacroNutritionEngine.calculateTargets(userWeight, 175, 25, true, 1.45, goal)
  const progress = MacroNutritionEngine.computeProgress(logged, targets)

  useEffect(() => {
    localStorage.setItem('opengym_macro_log', JSON.stringify(logged))
  }, [logged])

  const addWater = (amount) => {
    setLogged(prev => ({ ...prev, waterMl: Math.max(0, (prev.waterMl || 0) + amount) }))
  }

  const addQuickMacro = (p = 0, c = 0, f = 0) => {
    setLogged(prev => ({
      ...prev,
      protein: Math.max(0, prev.protein + p),
      carbs: Math.max(0, prev.carbs + c),
      fats: Math.max(0, prev.fats + f)
    }))
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
        background: '#0d0f14',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 24,
        padding: 24,
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.9)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="elite-badge">NUTRITION & MACROS</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, textTransform: 'uppercase', color: '#ffffff', marginTop: 4 }}>
              Daily Fuel Matrix
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: 24, cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        {/* Goal Selector */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 4, marginBottom: 18 }}>
          {['cut', 'maintain', 'bulk'].map(k => (
            <button
              key={k}
              onClick={() => setGoal(k)}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                textTransform: 'uppercase',
                background: goal === k ? '#ccff00' : 'none',
                color: goal === k ? '#000000' : '#9ca3af'
              }}
            >
              {k}
            </button>
          ))}
        </div>

        {/* Big Calorie Ring & Dial */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(28,28,32,0.8) 0%, rgba(14,15,18,0.9) 100%)',
          borderRadius: 20,
          padding: 18,
          border: '1px solid rgba(255,255,255,0.08)',
          textAlign: 'center',
          marginBottom: 16
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>
            Calories Consumed / Target
          </div>
          <div style={{ fontSize: 36, fontWeight: 900, color: '#ffffff', margin: '6px 0' }}>
            {progress.consumedCalories} <span style={{ fontSize: 16, color: '#ccff00' }}>/ {targets.targetCalories} kcal</span>
          </div>
          {/* Visual Progress Bar */}
          <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 999, overflow: 'hidden', margin: '10px 0' }}>
            <div style={{ width: `${progress.caloriePct}%`, height: '100%', background: 'linear-gradient(90deg, #ccff00, #00f2fe)', borderRadius: 999 }} />
          </div>
          <div style={{ fontSize: 11, color: '#9ca3af' }}>
            {progress.remainingCalories > 0 ? `${progress.remainingCalories} kcal left for optimal recovery` : 'Calorie target achieved!'}
          </div>
        </div>

        {/* 3 Macro Cards (Protein, Carbs, Fats) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 18 }}>
          {/* Protein */}
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 12, border: '1px solid rgba(204,255,0,0.2)' }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#ccff00', textTransform: 'uppercase' }}>PROTEIN</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', margin: '4px 0' }}>
              {logged.protein}g
            </div>
            <div style={{ fontSize: 10, color: '#9ca3af' }}>of {targets.targetProtein}g ({progress.proteinPct}%)</div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 6, overflow: 'hidden' }}>
              <div style={{ width: `${progress.proteinPct}%`, height: '100%', background: '#ccff00' }} />
            </div>
          </div>

          {/* Carbs */}
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 12, border: '1px solid rgba(0,242,254,0.2)' }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#00f2fe', textTransform: 'uppercase' }}>CARBS</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', margin: '4px 0' }}>
              {logged.carbs}g
            </div>
            <div style={{ fontSize: 10, color: '#9ca3af' }}>of {targets.targetCarbs}g ({progress.carbsPct}%)</div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 6, overflow: 'hidden' }}>
              <div style={{ width: `${progress.carbsPct}%`, height: '100%', background: '#00f2fe' }} />
            </div>
          </div>

          {/* Fats */}
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 12, border: '1px solid rgba(255,159,10,0.2)' }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#ff9f0a', textTransform: 'uppercase' }}>FATS</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', margin: '4px 0' }}>
              {logged.fats}g
            </div>
            <div style={{ fontSize: 10, color: '#9ca3af' }}>of {targets.targetFats}g ({progress.fatsPct}%)</div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 6, overflow: 'hidden' }}>
              <div style={{ width: `${progress.fatsPct}%`, height: '100%', background: '#ff9f0a' }} />
            </div>
          </div>
        </div>

        {/* Quick Macro Logger Buttons */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', marginBottom: 8, textTransform: 'uppercase' }}>
            Quick Athlete Logging
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            <button
              onClick={() => addQuickMacro(30, 0, 2)}
              className="athletic-btn-secondary"
              style={{ fontSize: 11, padding: '8px 4px', cursor: 'pointer' }}
            >
              🍗 +30g Whey/Chicken
            </button>
            <button
              onClick={() => addQuickMacro(5, 45, 2)}
              className="athletic-btn-secondary"
              style={{ fontSize: 11, padding: '8px 4px', cursor: 'pointer' }}
            >
              🍚 +45g Rice/Oats
            </button>
            <button
              onClick={() => addQuickMacro(25, 40, 15)}
              className="athletic-btn-secondary"
              style={{ fontSize: 11, padding: '8px 4px', cursor: 'pointer' }}
            >
              🍱 +Standard Meal
            </button>
          </div>
        </div>

        {/* Hydration Tracker */}
        <div style={{ background: 'rgba(0, 242, 254, 0.05)', border: '1px solid rgba(0, 242, 254, 0.2)', borderRadius: 16, padding: 14, marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 18 }}>💧</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#00f2fe', textTransform: 'uppercase' }}>Hydration Status</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#ffffff' }}>
              {logged.waterMl} / {targets.targetWaterMl} ml
            </span>
          </div>

          <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 999, overflow: 'hidden', marginBottom: 10 }}>
            <div style={{ width: `${progress.waterPct}%`, height: '100%', background: '#00f2fe' }} />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => addWater(250)}
              className="athletic-btn-secondary"
              style={{ flex: 1, padding: '6px 0', fontSize: 11, cursor: 'pointer', color: '#00f2fe' }}
            >
              +250ml Glass
            </button>
            <button
              onClick={() => addWater(500)}
              className="athletic-btn-secondary"
              style={{ flex: 1, padding: '6px 0', fontSize: 11, cursor: 'pointer', color: '#00f2fe' }}
            >
              +500ml Bottle
            </button>
            <button
              onClick={() => setLogged(prev => ({ ...prev, waterMl: 0 }))}
              style={{ padding: '6px 10px', fontSize: 11, background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button onClick={onClose} className="athletic-btn" style={{ width: '100%' }}>
          Save & Lock Fuel
        </button>
      </div>
    </div>
  )
}

