import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield, Lock, EyeOff, Database, Server, RefreshCw, Mail } from 'lucide-react'

export default function PrivacyPolicy() {
  const nav = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Privacy Policy — openGym'
  }, [])

  return (
    <div style={{ background: '#879A85', minHeight: '100vh', color: '#2D190E', padding: '48px 24px 80px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        
        {/* Top Header & Back Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
          <button
            onClick={() => nav('/home')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(245, 158, 11, 0.2)',
              border: '1px solid #F59E0B',
              color: '#F59E0B',
              padding: '10px 18px',
              borderRadius: 12,
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 14,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#D97706'
              e.currentTarget.style.color = '#879A85'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)'
              e.currentTarget.style.color = '#F59E0B'
            }}
          >
            <ArrowLeft size={18} />
            <span>Back to openGym</span>
          </button>

          <span style={{ fontSize: 13, color: '#D97706', fontWeight: 600 }}>
            Effective: October 2026 · Version 2.4
          </span>
        </div>

        {/* Hero Banner */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(126, 144, 123, 0.95) 0%, rgba(126, 144, 123, 0.95) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.5)',
          borderRadius: 24,
          padding: '36px 32px',
          marginBottom: 44,
          boxShadow: '0 16px 40px -10px rgba(45, 55, 42, 0.35)'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(22, 185, 120, 0.2)', border: '1px solid #D97706', padding: '4px 12px', borderRadius: 999, marginBottom: 16 }}>
            <Shield size={14} color="#F59E0B" />
            <span style={{ fontSize: 11, fontWeight: 800, color: '#F59E0B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Multinational Data Governance Standard
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: '#2D190E', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            Privacy Policy &amp; Data Ethics
          </h1>
          <p style={{ fontSize: 16, color: '#3C271A', lineHeight: 1.6, margin: 0, maxWidth: 720 }}>
            openGym operates on a strict <strong style={{ color: '#F59E0B' }}>Local-First &amp; Zero-Telemetry</strong> foundation. Your physical training data, biometric fatigue markers, and 1RM records belong to you alone. We do not sell, broker, or monetize your personal health data under any circumstance.
          </p>
        </div>

        {/* Quick Highlights Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 44 }}>
          <div style={{ background: 'rgba(8, 105, 114, 0.25)', border: '1px solid rgba(126, 144, 123, 0.95)', borderRadius: 16, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#F59E0B', marginBottom: 8 }}>
              <Lock size={20} />
              <strong style={{ fontSize: 15 }}>Zero Password Storage</strong>
            </div>
            <p style={{ fontSize: 13, color: '#4A3425', margin: 0, lineHeight: 1.5 }}>
              Passkey WebAuthn cryptographic authentication. Private keys never leave your secure hardware enclave.
            </p>
          </div>

          <div style={{ background: 'rgba(8, 105, 114, 0.25)', border: '1px solid rgba(126, 144, 123, 0.95)', borderRadius: 16, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#D97706', marginBottom: 8 }}>
              <Database size={20} />
              <strong style={{ fontSize: 15 }}>Local-First Storage</strong>
            </div>
            <p style={{ fontSize: 13, color: '#4A3425', margin: 0, lineHeight: 1.5 }}>
              All routines, rep counts, and body metrics reside in browser IndexedDB/LocalStorage. Guest mode runs with zero backend touches.
            </p>
          </div>

          <div style={{ background: 'rgba(8, 105, 114, 0.25)', border: '1px solid rgba(126, 144, 123, 0.95)', borderRadius: 16, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#5EEAD4', marginBottom: 8 }}>
              <EyeOff size={20} />
              <strong style={{ fontSize: 15 }}>No Third-Party Trackers</strong>
            </div>
            <p style={{ fontSize: 13, color: '#4A3425', margin: 0, lineHeight: 1.5 }}>
              No Google Analytics, Meta Pixel, or marketing surveillance scripts. Zero cross-site behavioural profiling.
            </p>
          </div>
        </div>

        {/* Legal Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          
          <section style={{ background: 'rgba(8, 105, 114, 0.15)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 18, padding: '28px 24px' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#2D190E', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#D97706' }}>1.</span> Information We Process
            </h2>
            <p style={{ fontSize: 14, color: '#3C271A', lineHeight: 1.6, marginBottom: 12 }}>
              Depending on how you use openGym (Guest Mode vs. Self-Hosted / Account Sync), we process the following data categories:
            </p>
            <ul style={{ paddingLeft: 20, fontSize: 14, color: '#3C271A', lineHeight: 1.7, margin: 0 }}>
              <li><strong>Kinetic &amp; Workout Data:</strong> Routine names, exercise selections, weights lifted (kg/lbs), rep counts, RPE scores, and rest intervals.</li>
              <li><strong>Anatomical Fatigue Metrics:</strong> Muscle group fatigue values used dynamically to render the 3D and 2D muscle recovery status maps.</li>
              <li><strong>Authentication Credentials:</strong> WebAuthn public key credentials (Passkeys) and salted cryptographic hashes where password fallback is explicitly enabled.</li>
              <li><strong>Technical Device State:</strong> Screen orientation and theme preferences saved strictly to client local storage.</li>
            </ul>
          </section>

          <section style={{ background: 'rgba(8, 105, 114, 0.15)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 18, padding: '28px 24px' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#2D190E', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#D97706' }}>2.</span> GDPR &amp; International Privacy Rights
            </h2>
            <p style={{ fontSize: 14, color: '#3C271A', lineHeight: 1.6, marginBottom: 12 }}>
              In full compliance with European Union GDPR (General Data Protection Regulation), California Consumer Privacy Act (CCPA/CPRA), and UK GDPR, you have the following irrevocable rights:
            </p>
            <ul style={{ paddingLeft: 20, fontSize: 14, color: '#3C271A', lineHeight: 1.7, margin: 0 }}>
              <li><strong>Right to Access &amp; Portability:</strong> Export your full workout history anytime via Settings → Export JSON / CSV.</li>
              <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> Instantly purge your local workout storage or trigger server deletion from Settings → Account → Delete Profile.</li>
              <li><strong>Right to Restrict Processing:</strong> Switch to pure Guest Mode to disable all network sync entirely.</li>
            </ul>
          </section>

          <section style={{ background: 'rgba(8, 105, 114, 0.15)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 18, padding: '28px 24px' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#2D190E', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#D97706' }}>3.</span> Cookies &amp; Local Storage Declaration
            </h2>
            <p style={{ fontSize: 14, color: '#3C271A', lineHeight: 1.6, margin: '0 0 12px' }}>
              openGym does not use commercial tracking cookies. We utilize strictly necessary local browser storage mechanisms:
            </p>
            <div style={{ background: 'rgba(7, 26, 82, 0.6)', border: '1px solid rgba(8, 105, 114, 0.5)', borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12, fontSize: 13, borderBottom: '1px solid rgba(8, 105, 114, 0.3)', paddingBottom: 8, marginBottom: 8 }}>
                <strong style={{ color: '#F59E0B' }}>Key</strong>
                <strong style={{ color: '#F59E0B' }}>Purpose</strong>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12, fontSize: 13, color: '#3C271A', marginBottom: 6 }}>
                <code>gym_state_v1</code>
                <span>Stores your training logs, custom exercises, and fatigue metrics locally.</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12, fontSize: 13, color: '#3C271A', marginBottom: 6 }}>
                <code>opengym_cookie_consent</code>
                <span>Records your cookie banner preference (essential only vs accepted).</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12, fontSize: 13, color: '#3C271A' }}>
                <code>session (HTTP-Only)</code>
                <span>Secure cryptographically signed cookie for account authentication over HTTPS.</span>
              </div>
            </div>
          </section>

          <section style={{ background: 'rgba(8, 105, 114, 0.15)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 18, padding: '28px 24px' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#2D190E', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#D97706' }}>4.</span> Security Architecture &amp; Encryption
            </h2>
            <p style={{ fontSize: 14, color: '#3C271A', lineHeight: 1.6, margin: 0 }}>
              All network transmissions are enforced over <strong style={{ color: '#F59E0B' }}>TLS 1.3 / HTTPS</strong> with HSTS preloading. Media attachments and workout states are protected at rest with AES-256 encryption. Our architecture employs strict Content Security Policies (CSP) and subresource integrity checks to neutralize XSS and session hijacking vectors.
            </p>
          </section>

          <section style={{ background: 'rgba(8, 105, 114, 0.15)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 18, padding: '28px 24px' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#2D190E', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#D97706' }}>5.</span> Contact &amp; Data Protection Officer
            </h2>
            <p style={{ fontSize: 14, color: '#3C271A', lineHeight: 1.6, marginBottom: 16 }}>
              For data access requests, privacy verifications, or compliance audits, contact our Data Protection Office:
            </p>
            <a
              href="mailto:privacy@opengym.app"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#D97706',
                color: '#879A85',
                padding: '10px 18px',
                borderRadius: 10,
                textDecoration: 'none',
                fontWeight: 800,
                fontSize: 14,
              }}
            >
              <Mail size={16} />
              <span>privacy@opengym.app</span>
            </a>
          </section>

        </div>

      </div>
    </div>
  )
}

