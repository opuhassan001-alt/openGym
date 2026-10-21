import { useState } from 'react'
import './NikeThemeLayer.css'

export default function EditorialBlogSection() {
  const [selectedArticle, setSelectedArticle] = useState(null)

  const articles = [
    {
      id: 1,
      tag: 'HYPERTROPHY SCIENCE',
      tagColor: '#ccff00',
      title: 'The Mechanical Tension Protocol: Why 2 Reps In Reserve Drives 85% More Growth',
      readTime: '4 MIN READ',
      author: 'Dr. Andrew Huberman & Brad Schoenfeld synthesis',
      summary: 'True muscular hypertrophy requires high motor-unit recruitment without excessive central nervous system fatigue. Learn how RIR auto-regulation guarantees consistent weekly progression.',
      content: `The primary driver of muscle hypertrophy is mechanical tension experienced by high-threshold motor units. When training to absolute muscular failure on every set, fatigue accumulates exponentially faster than adaptation.\n\nBy stopping sets at RPE 8 to 9 (1-2 reps shy of failure), you stimulate virtually identical protein synthesis rates while halving the recovery time required for your nervous system. openGym's auto-regulation engine automatically shifts your loads to keep you in this anabolic sweet spot.`
    },
    {
      id: 2,
      tag: 'NUTRITION & MACROS',
      tagColor: '#00f2fe',
      title: 'The 2.2g Protein Rule & Nutrient Timing for Natural Athletes',
      readTime: '3 MIN READ',
      author: 'Eric Helms Muscle & Strength Protocol',
      summary: 'Optimal amino acid saturation throughout the day prevents catabolism during heavy training cycles. How to balance carbs around your workout window.',
      content: `Consuming 2.0 to 2.2 grams of protein per kilogram of lean body mass maximizes fractional synthetic rate in resistance-trained athletes. Distributing this across 3 to 5 protein feedings ensures continuous leucine trigger activation.\n\nPairing high-glycemic carbohydrates 60 minutes pre-workout replenishes intra-muscular glycogen, directly boosting total workout tonnage.`
    },
    {
      id: 3,
      tag: 'RECOVERY KINETICS',
      tagColor: '#ff9f0a',
      title: 'Structural Balance: Avoiding Rotator Cuff and Knee Injuries Under Heavy Loads',
      readTime: '5 MIN READ',
      author: 'Charles Poliquin Principles',
      summary: 'Why bench press to chest-supported row ratios matter more than your 1RM, and how to bulletproof your joints using ATG principles.',
      content: `An athlete with a 140kg bench press but only a 35kg external rotation is a walking rotator cuff injury waiting to happen. Optimal joint longevity requires a 1:1 pulling-to-pushing volume ratio and balanced quadricep-to-hamstring strength.\n\nUtilizing openGym's Structural Balance calculator lets you diagnose asymmetries before they manifest as chronic tendonitis.`
    }
  ]

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="elite-badge cyan">ATHLETE INTEL</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, textTransform: 'uppercase', color: '#ffffff', marginTop: 4 }}>
            Editorial & Training Science
          </div>
        </div>
        <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600 }}>CURATED ARTICLES</span>
      </div>

      {/* Article Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
        {articles.map(art => (
          <div
            key={art.id}
            onClick={() => setSelectedArticle(art)}
            className="athletic-card"
            style={{
              padding: 18,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              margin: 0
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{
                  fontSize: 9,
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  color: art.tagColor,
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '3px 8px',
                  borderRadius: 6
                }}>
                  {art.tag}
                </span>
                <span style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600 }}>{art.readTime}</span>
              </div>

              <div style={{ fontSize: 15, fontWeight: 800, color: '#ffffff', lineHeight: 1.3, marginBottom: 8 }}>
                {art.title}
              </div>

              <div style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.4 }}>
                {art.summary}
              </div>
            </div>

            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>{art.author}</span>
              <span style={{ fontSize: 12, color: '#ccff00', fontWeight: 800 }}>Read Article →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Article Full View Modal */}
      {selectedArticle && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.88)',
          backdropFilter: 'blur(14px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: 16
        }}>
          <div style={{
            maxWidth: 500,
            width: '100%',
            maxHeight: '85vh',
            overflowY: 'auto',
            background: '#0c0e12',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 24,
            padding: 24,
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.9)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span className="elite-badge" style={{ color: selectedArticle.tagColor }}>
                {selectedArticle.tag}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: 24, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ fontSize: 22, fontWeight: 900, color: '#ffffff', lineHeight: 1.25, marginBottom: 10 }}>
              {selectedArticle.title}
            </div>

            <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 18 }}>
              {selectedArticle.author} · {selectedArticle.readTime}
            </div>

            <div style={{ fontSize: 14, lineHeight: 1.6, color: '#d1d5db', whiteSpace: 'pre-line', marginBottom: 20 }}>
              {selectedArticle.content}
            </div>

            <button
              onClick={() => setSelectedArticle(null)}
              className="athletic-btn"
              style={{ width: '100%' }}
            >
              Close Article
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

