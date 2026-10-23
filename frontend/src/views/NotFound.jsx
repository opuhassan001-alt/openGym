import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, Dumbbell, Compass, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const nav = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = '404 — Lost In The Set | openGym'
  }, [])

  return (
    <div style={{
      background: '#879A85',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      fontFamily: "'Inter', sans-serif",
      color: '#2D190E',
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: 580,
        width: '100%',
        textAlign: 'center',
        background: 'rgba(8, 105, 114, 0.25)',
        border: '1px solid rgba(8, 105, 114, 0.5)',
        borderRadius: 28,
        padding: '52px 32px',
        boxShadow: '0 24px 60px -12px rgba(7, 26, 82, 0.9)',
        backdropFilter: 'blur(16px)'
      }}>
        
        {/* Giant Kinetic 404 Badge */}
        <div style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: 'clamp(90px, 16vw, 140px)',
          lineHeight: 1,
          letterSpacing: '-0.02em',
          color: '#F59E0B',
          textShadow: '0 0 35px rgba(167, 255, 132, 0.45)',
          margin: '0 0 16px'
        }}>
          404
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(22, 185, 120, 0.2)',
          border: '1px solid #D97706',
          padding: '6px 16px',
          borderRadius: 999,
          color: '#2D190E',
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 20
        }}>
          <Compass size={14} color="#F59E0B" />
          <span>Kinetic Route Not Found</span>
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 900, margin: '0 0 12px', letterSpacing: '-0.01em' }}>
          LOST IN THE SET
        </h1>

        <p style={{ fontSize: 15, color: '#3C271A', lineHeight: 1.6, margin: '0 0 36px', maxWidth: 440, marginLeft: 'auto', marginRight: 'auto' }}>
          The exercise link, routine blueprint, or training URL you entered doesn&apos;t exist or has been shifted in the workout schedule.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360, margin: '0 auto' }}>
          <button
            onClick={() => nav('/home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              background: '#D97706',
              color: '#879A85',
              border: '1px solid #F59E0B',
              borderRadius: 12,
              padding: '14px 20px',
              fontSize: 14,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 18px rgba(22, 185, 120, 0.4)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#F59E0B'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#D97706'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <Home size={18} />
            <span>Return to Home Dashboard</span>
          </button>

          <button
            onClick={() => nav('/library')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              background: 'rgba(245, 158, 11, 0.2)',
              color: '#2D190E',
              border: '1px solid #F59E0B',
              borderRadius: 12,
              padding: '14px 20px',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(22, 185, 120, 0.3)'
              e.currentTarget.style.borderColor = '#D97706'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)'
              e.currentTarget.style.borderColor = '#F59E0B'
            }}
          >
            <Dumbbell size={18} color="#F59E0B" />
            <span>Browse Exercise Library</span>
          </button>
        </div>

      </div>
    </div>
  )
}

