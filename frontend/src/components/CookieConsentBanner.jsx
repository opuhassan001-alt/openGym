import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Cookie, X } from 'lucide-react'

const STORAGE_KEY = 'opengym_cookie_consent'

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)
  const nav = useNavigate()

  useEffect(() => {
    try {
      const consent = localStorage.getItem(STORAGE_KEY)
      if (!consent) {
        // Small delay so it animates in smoothly after initial paint
        const timer = setTimeout(() => setVisible(true), 1200)
        return () => clearTimeout(timer)
      }
    } catch {
      // In case localStorage is blocked in private browsing
    }
  }, [])

  const handleChoice = (val) => {
    try {
      localStorage.setItem(STORAGE_KEY, val)
    } catch {}
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label="Cookie and Privacy Consent"
      style={{
        position: 'fixed',
        bottom: 96,
        right: 24,
        zIndex: 9998,
        maxWidth: 440,
        width: 'calc(100% - 48px)',
        background: 'rgba(126, 144, 123, 0.96)',
        border: '2px solid #F59E0B',
        borderRadius: 20,
        padding: '20px 22px',
        boxShadow: '0 20px 48px -10px rgba(45, 55, 42, 0.5), 0 0 25px rgba(245, 158, 11, 0.45)',
        backdropFilter: 'blur(16px)',
        fontFamily: "'Inter', sans-serif",
        color: '#2D190E',
        animation: 'consentSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: '#F59E0B', border: '1px solid #D97706', boxShadow: '0 0 10px rgba(245, 158, 11, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2D190E'
          }}>
            <Cookie size={18} />
          </div>
          <div>
            <h4 style={{ fontSize: 15, fontWeight: 800, margin: 0, letterSpacing: '-0.01em' }}>
              Privacy &amp; Data Ethics
            </h4>
            <span style={{ fontSize: 11, color: '#B45309', fontWeight: 600 }}>Zero Ad Trackers · Local-First</span>
          </div>
        </div>

        <button
          onClick={() => handleChoice('essential')}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#2D190E',
            cursor: 'pointer',
            padding: 4,
            borderRadius: 6,
            display: 'flex'
          }}
          aria-label="Close cookie banner"
        >
          <X size={16} />
        </button>
      </div>

      <p style={{ fontSize: 13, color: '#3C271A', lineHeight: 1.5, margin: '0 0 16px' }}>
        We store training history and 3D kinetic metrics locally in your browser. No personal data is ever sold or tracked across third-party networks. Read our{' '}
        <span
          onClick={() => nav('/privacy')}
          style={{ color: '#2D190E', textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}
        >
          Privacy Policy
        </span>.
      </p>

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={() => handleChoice('accepted')}
          style={{
            flex: 1,
            background: '#F59E0B',
            color: '#2D190E',
            border: '1.5px solid #D97706',
            borderRadius: 10,
            padding: '10px 14px',
            fontSize: 13,
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 0 16px rgba(245, 158, 11, 0.5)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#FFB300'}
          onMouseLeave={e => e.currentTarget.style.background = '#F59E0B'}
        >
          Accept All
        </button>

        <button
          onClick={() => handleChoice('essential')}
          style={{
            flex: 1,
            background: 'rgba(245, 158, 11, 0.2)',
            color: '#2D190E',
            border: '1.5px solid #F59E0B',
            borderRadius: 10,
            padding: '10px 14px',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#F59E0B'
            e.currentTarget.style.borderColor = '#D97706'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)'
            e.currentTarget.style.borderColor = '#F59E0B'
          }}
        >
          Essential Only
        </button>
      </div>
    </div>
  )
}

