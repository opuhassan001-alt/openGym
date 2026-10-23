import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, AlertTriangle, Scale, CreditCard, ShieldCheck, Mail } from 'lucide-react'

export default function TermsAndConditions() {
  const nav = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Terms & Conditions — openGym'
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
            <FileText size={14} color="#F59E0B" />
            <span style={{ fontSize: 11, fontWeight: 800, color: '#F59E0B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Standard Athletic Terms of Service
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: '#2D190E', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            Terms &amp; Conditions
          </h1>
          <p style={{ fontSize: 16, color: '#3C271A', lineHeight: 1.6, margin: 0, maxWidth: 720 }}>
            Welcome to openGym. By accessing or using our application, 3D anatomical viewer, barbell loading algorithms, or membership services, you agree to be bound by these Terms of Service and all applicable athletic safety regulations.
          </p>
        </div>

        {/* Legal Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* Medical Notice Alert */}
          <section style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: 18, padding: '24px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#FCA5A5', marginBottom: 10 }}>
              <AlertTriangle size={22} />
              <strong style={{ fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Important Medical &amp; Physical Liability Disclaimer
              </strong>
            </div>
            <p style={{ fontSize: 14, color: '#FEE2E2', lineHeight: 1.6, margin: 0 }}>
              openGym provides training tracking software, kinematic calculators, and automated interval protocols for informational athletic purposes only. <strong>We do not provide medical advice.</strong> High-load resistance training and high-intensity interval conditioning carry inherent risks of musculoskeletal injury or cardiovascular strain. Always consult a certified healthcare professional before beginning any new training program.
            </p>
          </section>

          <section style={{ background: 'rgba(8, 105, 114, 0.15)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 18, padding: '28px 24px' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#2D190E', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#D97706' }}>1.</span> Platform Access &amp; Account Responsibility
            </h2>
            <p style={{ fontSize: 14, color: '#3C271A', lineHeight: 1.6, margin: '0 0 12px' }}>
              You may access openGym in Guest Mode without registration, or create a verified profile secured by Passkeys (FIDO2 / WebAuthn). You are responsible for maintaining the physical security of devices paired to your account.
            </p>
            <ul style={{ paddingLeft: 20, fontSize: 14, color: '#3C271A', lineHeight: 1.7, margin: 0 }}>
              <li>You agree not to reverse engineer or abuse API synchronization endpoints.</li>
              <li>You agree not to upload malicious media attachments or attempt denial-of-service against shared community instances.</li>
            </ul>
          </section>

          <section style={{ background: 'rgba(8, 105, 114, 0.15)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 18, padding: '28px 24px' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#2D190E', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#D97706' }}>2.</span> Transparent Memberships &amp; Instant Cancellation
            </h2>
            <p style={{ fontSize: 14, color: '#3C271A', lineHeight: 1.6, margin: '0 0 12px' }}>
              Our Transparent Membership tier operates on a strict zero-lock-in philosophy:
            </p>
            <ul style={{ paddingLeft: 20, fontSize: 14, color: '#3C271A', lineHeight: 1.7, margin: 0 }}>
              <li><strong>Zero Hidden Fees:</strong> No initiation, cancellation, or processing charges ever.</li>
              <li><strong>Instant One-Click Freeze or Cancel:</strong> You may cancel or freeze your subscription at any moment with immediate effect through the membership portal.</li>
              <li><strong>Pro-Rata Refunds:</strong> Unused full prepaid cycles are eligible for pro-rated refunds within 14 calendar days of transaction date.</li>
            </ul>
          </section>

          <section style={{ background: 'rgba(8, 105, 114, 0.15)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 18, padding: '28px 24px' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#2D190E', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#D97706' }}>3.</span> Intellectual Property &amp; Open Source
            </h2>
            <p style={{ fontSize: 14, color: '#3C271A', lineHeight: 1.6, margin: 0 }}>
              The openGym client interface, 3D character assets, anatomical motion rigs, and proprietary barbell calculators are protected by international copyright laws. Community contributors and self-hosted operators must adhere to the open-source license terms outlined in the root repository.
            </p>
          </section>

          <section style={{ background: 'rgba(8, 105, 114, 0.15)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 18, padding: '28px 24px' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#2D190E', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#D97706' }}>4.</span> Limitation of Liability &amp; Governing Law
            </h2>
            <p style={{ fontSize: 14, color: '#3C271A', lineHeight: 1.6, margin: 0 }}>
              To the fullest extent permitted by law, openGym, its developers, and affiliates shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use of physical exercise recommendations, equipment configurations, or training calculations. These terms are governed by the laws of the jurisdiction in which the deployment instance is established.
            </p>
          </section>

          <section style={{ background: 'rgba(8, 105, 114, 0.15)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 18, padding: '28px 24px' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#2D190E', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#D97706' }}>5.</span> Legal Inquiries
            </h2>
            <p style={{ fontSize: 14, color: '#3C271A', lineHeight: 1.6, marginBottom: 16 }}>
              For formal legal notices, terms clarification, or institutional gym partnerships:
            </p>
            <a
              href="mailto:legal@opengym.app"
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
              <span>legal@opengym.app</span>
            </a>
          </section>

        </div>

      </div>
    </div>
  )
}

