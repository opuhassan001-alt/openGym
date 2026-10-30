import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const floatStyles = `
@keyframes ogHeroFloatCenter {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
@keyframes ogHeroFloatLeft {
  0%, 100% { transform: translateY(0px) rotate(-1.5deg); }
  50% { transform: translateY(-7px) rotate(1deg); }
}
@keyframes ogHeroFloatRight {
  0%, 100% { transform: translateY(0px) rotate(1.5deg); }
  50% { transform: translateY(-7px) rotate(-1deg); }
}
@keyframes ogHeroFloatBack {
  0%, 100% { transform: translateY(0px) scale(0.98); }
  50% { transform: translateY(-8px) scale(1.02); }
}
`;

const IMAGES = [
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png',
    bg: '#F4845F',
    panel: '#F79B7F',
    handPos: { top: '62.5%', left: '70.3%', rotate: '-14deg' },
    dumbbells: [
      {
        top: '62.5%',
        left: '70.3%',
        rotate: '-14deg',
        width: '22%',
        fistOverlay: {
          src: '/fists/c1_fist_right.png',
          top: '56.25%',
          left: '64.35%',
          width: '12.96%',
          height: '11.11%'
        }
      },
      {
        top: '62.1%',
        left: '32.4%',
        rotate: '14deg',
        width: '22%',
        fistOverlay: {
          src: '/fists/c1_fist_left.png',
          top: '56.25%',
          left: '25.46%',
          width: '12.96%',
          height: '11.11%'
        }
      }
    ]
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png',
    bg: '#6BBF7A',
    panel: '#85CC92',
    handPos: { top: '8.8%', left: '82.2%', rotate: '18deg' },
    dumbbells: [
      {
        top: '8.8%',
        left: '82.2%',
        rotate: '18deg',
        width: '21%',
        fistOverlay: {
          src: '/fists/c2_fist_right.png',
          top: '5.56%',
          left: '73.15%',
          width: '12.96%',
          height: '9.72%'
        }
      },
      {
        top: '7.8%',
        left: '17.4%',
        rotate: '-18deg',
        width: '21%',
        fistOverlay: {
          src: '/fists/c2_fist_left.png',
          top: '4.86%',
          left: '12.96%',
          width: '12.96%',
          height: '9.72%'
        }
      }
    ]
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png',
    bg: '#E882B4',
    panel: '#ED9DC4',
    handPos: { top: '9.7%', left: '73.0%', rotate: '8deg' },
    dumbbells: [
      {
        top: '9.7%',
        left: '73.0%',
        rotate: '8deg',
        width: '21%',
        fistOverlay: {
          src: '/fists/c3_fist_right.png',
          top: '5.56%',
          left: '67.59%',
          width: '12.96%',
          height: '9.72%'
        }
      },
      {
        top: '9.1%',
        left: '26.2%',
        rotate: '-8deg',
        width: '21%',
        fistOverlay: {
          src: '/fists/c3_fist_left.png',
          top: '4.86%',
          left: '20.37%',
          width: '12.96%',
          height: '9.72%'
        }
      }
    ]
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png',
    bg: '#6EB5FF',
    panel: '#8DC4FF',
    handPos: { top: '25.8%', left: '31.9%', rotate: '12deg' },
    dumbbells: [
      {
        top: '25.8%',
        left: '31.9%',
        rotate: '12deg',
        width: '22%',
        fistOverlay: {
          src: '/fists/c4_fist.png',
          top: '19.10%',
          left: '25.46%',
          width: '13.89%',
          height: '10.42%'
        }
      },
      {
        top: '46.5%',
        left: '73.2%',
        rotate: '-22deg',
        width: '20%'
      }
    ]
  }
];

// Glossy 3D Dumbbell SVG Overlay with metallic gradients, specular highlights & cylindrical plates
function Dumbbell3D({ id = 'db' }) {
  const barGradId = `barGrad_${id}`;
  const plateGradId = `plateGrad_${id}`;
  const rimGradId = `rimGrad_${id}`;
  const steelGradId = `steelGrad_${id}`;

  return (
    <svg viewBox="0 0 160 80" className="w-full h-auto drop-shadow-2xl" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Metallic chrome gradient for center knurled bar */}
        <linearGradient id={barGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8892b0" />
          <stop offset="25%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#4a5568" />
          <stop offset="100%" stopColor="#1a202c" />
        </linearGradient>

        {/* 3D Cylindrical heavy plate gradient */}
        <linearGradient id={plateGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="20%" stopColor="#6b7280" />
          <stop offset="42%" stopColor="#d1d5db" />
          <stop offset="68%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>

        {/* Plate rim highlight */}
        <linearGradient id={rimGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#111827" stopOpacity="0.3" />
        </linearGradient>

        {/* Steel collar lock gradient */}
        <linearGradient id={steelGradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4b5563" />
          <stop offset="50%" stopColor="#f3f4f6" />
          <stop offset="100%" stopColor="#1f2937" />
        </linearGradient>
      </defs>

      {/* Center Grip Bar */}
      <rect x="42" y="34" width="76" height="12" rx="4" fill={`url(#${barGradId})`} />

      {/* Grip Knurling lines (textured steel grip) */}
      <line x1="50" y1="34" x2="50" y2="46" stroke="#1f2937" strokeWidth="1.5" opacity="0.65" />
      <line x1="58" y1="34" x2="58" y2="46" stroke="#1f2937" strokeWidth="1.5" opacity="0.65" />
      <line x1="66" y1="34" x2="66" y2="46" stroke="#1f2937" strokeWidth="1.5" opacity="0.65" />
      <line x1="74" y1="34" x2="74" y2="46" stroke="#1f2937" strokeWidth="1.5" opacity="0.65" />
      <line x1="86" y1="34" x2="86" y2="46" stroke="#1f2937" strokeWidth="1.5" opacity="0.65" />
      <line x1="94" y1="34" x2="94" y2="46" stroke="#1f2937" strokeWidth="1.5" opacity="0.65" />
      <line x1="102" y1="34" x2="102" y2="46" stroke="#1f2937" strokeWidth="1.5" opacity="0.65" />
      <line x1="110" y1="34" x2="110" y2="46" stroke="#1f2937" strokeWidth="1.5" opacity="0.65" />

      {/* Left Plate Collar Ring */}
      <rect x="38" y="30" width="4" height="20" rx="1.5" fill={`url(#${steelGradId})`} />

      {/* Left Plate 1 (Inner Heavy Disc) */}
      <rect x="26" y="14" width="12" height="52" rx="5" fill={`url(#${plateGradId})`} />
      {/* Left Plate 2 (Outer Heavy Disc) */}
      <rect x="12" y="6" width="14" height="68" rx="6" fill={`url(#${plateGradId})`} stroke={`url(#${rimGradId})`} strokeWidth="1.2" />
      {/* Left Plate Outer Cap Bevel */}
      <ellipse cx="12" cy="40" rx="4" ry="34" fill="#1f2937" />

      {/* Right Plate Collar Ring */}
      <rect x="118" y="30" width="4" height="20" rx="1.5" fill={`url(#${steelGradId})`} />

      {/* Right Plate 1 (Inner Heavy Disc) */}
      <rect x="122" y="14" width="12" height="52" rx="5" fill={`url(#${plateGradId})`} />
      {/* Right Plate 2 (Outer Heavy Disc) */}
      <rect x="134" y="6" width="14" height="68" rx="6" fill={`url(#${plateGradId})`} stroke={`url(#${rimGradId})`} strokeWidth="1.2" />
      {/* Right Plate Outer Cap Bevel */}
      <ellipse cx="148" cy="40" rx="4" ry="34" fill="#e5e7eb" opacity="0.9" />
    </svg>
  );
}

export default function OpenGym3DHero({ onSlideChange }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 640 : false);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  // Notify parent on slide change
  useEffect(() => {
    if (typeof onSlideChange === 'function') {
      onSlideChange(activeIndex);
    }
  }, [activeIndex, onSlideChange]);

  // Preload all 4 images on mount
  useEffect(() => {
    IMAGES.forEach((item) => {
      const img = new Image();
      img.src = item.src;
    });

    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Continuous auto-rotation loop: rotates every 3 seconds
  const startAutoRotation = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 4);
    }, 3000);
  };

  useEffect(() => {
    if (!isHovered) {
      startAutoRotation();
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered]);

  const navigate = (direction) => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (direction === 'next') {
      setActiveIndex((prev) => (prev + 1) % 4);
    } else {
      setActiveIndex((prev) => (prev + 3) % 4);
    }

    setTimeout(() => {
      setIsAnimating(false);
    }, 650);

    // Reset auto-rotation timer after manual click
    if (!isHovered) {
      startAutoRotation();
    }
  };

  const jumpTo = (index) => {
    if (isAnimating || index === activeIndex) return;
    setIsAnimating(true);
    setActiveIndex(index);
    setTimeout(() => {
      setIsAnimating(false);
    }, 650);
    if (!isHovered) {
      startAutoRotation();
    }
  };

  // Derive roles
  const getRole = (index) => {
    if (index === activeIndex) return 'center';
    if (index === (activeIndex + 3) % 4) return 'left';
    if (index === (activeIndex + 1) % 4) return 'right';
    return 'back';
  };

  const getRoleStyles = (role) => {
    switch (role) {
      case 'center':
        return {
          transform: `translateX(-50%) scale(${isMobile ? 1.0 : 1.18})`,
          filter: 'blur(0px)',
          opacity: 1,
          zIndex: 20,
          left: '50%',
          height: isMobile ? '48%' : '70%',
          bottom: isMobile ? '22%' : '4%'
        };
      case 'left':
        return {
          transform: 'translateX(-50%) scale(0.8)',
          filter: 'blur(1.5px)',
          opacity: 0.9,
          zIndex: 10,
          left: isMobile ? '18%' : '25%',
          height: isMobile ? '15%' : '24%',
          bottom: isMobile ? '28%' : '16%'
        };
      case 'right':
        return {
          transform: 'translateX(-50%) scale(0.8)',
          filter: 'blur(1.5px)',
          opacity: 0.9,
          zIndex: 10,
          left: isMobile ? '82%' : '75%',
          height: isMobile ? '15%' : '24%',
          bottom: isMobile ? '28%' : '16%'
        };
      case 'back':
      default:
        return {
          transform: 'translateX(-50%) scale(0.8)',
          filter: 'blur(3px)',
          opacity: 0.92,
          zIndex: 6,
          left: '50%',
          height: isMobile ? '15%' : '22%',
          bottom: isMobile ? '36%' : '42%'
        };
    }
  };

  const getFloatingAnimation = (role) => {
    switch (role) {
      case 'center':
        return 'ogHeroFloatCenter 4s ease-in-out infinite';
      case 'left':
        return 'ogHeroFloatLeft 3.6s ease-in-out infinite 0.3s';
      case 'right':
        return 'ogHeroFloatRight 3.8s ease-in-out infinite 0.6s';
      case 'back':
      default:
        return 'ogHeroFloatBack 4.2s ease-in-out infinite 0.9s';
    }
  };

  return (
    <div
      style={{
        backgroundColor: IMAGES[activeIndex].bg,
        transition: 'background-color 650ms cubic-bezier(0.4,0,0.2,1)',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        width: '100%',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
        {/* Continuous 3D Floating & Orbiting keyframes */}
        <style>{floatStyles}</style>

        {/* Grain overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 50,
            opacity: 0.35,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat'
          }}
        />

        {/* Top-left brand label "OPEN GYM" */}
        <div
          style={{
            position: 'absolute',
            top: isMobile ? '20px' : '36px',
            left: isMobile ? '20px' : '110px',
            zIndex: 60,
            userSelect: 'none'
          }}
        >
          <span
            style={{
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'white',
              opacity: 0.9,
              letterSpacing: '0.22em'
            }}
          >
            OPEN GYM
          </span>
        </div>

        {/* Giant ghost text "OPEN GYM" */}
        <div
          style={{
            position: 'absolute',
            insetInline: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 2,
            top: '18%'
          }}
        >
          <h1
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(90px, 24vw, 360px)',
              fontWeight: 900,
              color: 'white',
              opacity: 1,
              lineHeight: 1,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
              margin: 0
            }}
          >
            OPEN GYM
          </h1>
        </div>

        {/* 3D Character Carousel with Dumbbells (Continuous 3D Orbit & Floating Motion) */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 3 }}>
          {IMAGES.map((item, index) => {
            const role = getRole(index);
            const roleStyle = getRoleStyles(role);

            return (
              <div
                key={index}
                onClick={() => {
                  if (role === 'left') navigate('prev');
                  if (role === 'right') navigate('next');
                }}
                style={{
                  position: 'absolute',
                  aspectRatio: '3 / 4',
                  cursor: role === 'left' || role === 'right' ? 'pointer' : 'default',
                  transition:
                    'transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1), height 650ms cubic-bezier(0.4,0,0.2,1), bottom 650ms cubic-bezier(0.4,0,0.2,1)',
                  willChange: 'transform, filter, opacity',
                  ...roleStyle
                }}
              >
                {/* Floating animation wrapper ensuring characters are always continuously moving */}
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    animation: getFloatingAnimation(role),
                    willChange: 'transform'
                  }}
                >
                  {/* 3D Character Figurine */}
                  <img
                    src={item.src}
                    alt={`Open Gym Athlete ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      display: 'block'
                    }}
                    draggable={false}
                  />

                  {/* 3D-shaded Dumbbell Overlays anchored directly at character's hands */}
                  {(item.dumbbells || [item.handPos]).map((db, dbIdx) => (
                    <React.Fragment key={dbIdx}>
                      {/* 1. Dumbbell: Placed at hand, with bar sitting directly behind the knuckles */}
                      <div
                        style={{
                          position: 'absolute',
                          top: db.top,
                          left: db.left,
                          transform: `translate(-50%, -50%) rotate(${db.rotate})`,
                          width: db.width || '22%',
                          pointerEvents: 'none',
                          zIndex: 2,
                          filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.45))'
                        }}
                      >
                        <Dumbbell3D id={`c${index}_d${dbIdx}`} />
                      </div>

                      {/* 2. Authentic Clenched Fist Overlay: Real character knuckles wrapped OVER the bar! */}
                      {db.fistOverlay && (
                        <div
                          style={{
                            position: 'absolute',
                            top: db.fistOverlay.top,
                            left: db.fistOverlay.left,
                            width: db.fistOverlay.width,
                            height: db.fistOverlay.height,
                            pointerEvents: 'none',
                            zIndex: 3
                          }}
                        >
                          <img
                            src={db.fistOverlay.src}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            alt=""
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              display: 'block'
                            }}
                            draggable={false}
                          />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom-left text + nav buttons */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            position: 'absolute',
            bottom: isMobile ? '24px' : '64px',
            left: isMobile ? '20px' : '110px',
            zIndex: 60,
            maxWidth: '340px'
          }}
        >
          <p
            style={{
              marginBottom: '10px',
              fontSize: isMobile ? '18px' : '22px',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: 'white',
              opacity: 0.95,
              letterSpacing: '0.04em',
              margin: 0
            }}
          >
            OPEN GYM CLUB
          </p>

          {!isMobile && (
            <p
              style={{
                fontSize: '13.5px',
                color: 'white',
                opacity: 0.85,
                lineHeight: 1.6,
                marginTop: '8px',
                marginBottom: '14px'
              }}
            >
              Train stronger every day with world-class equipment, heavy dumbbells, and high-energy coaching. Push your limits and sculpt your best physique at Open Gym. Join now.
            </p>
          )}

          {/* Active athlete indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            {IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => jumpTo(i)}
                style={{
                  width: i === activeIndex ? '28px' : '8px',
                  height: '6px',
                  borderRadius: '9999px',
                  backgroundColor: i === activeIndex ? '#ffffff' : 'rgba(255,255,255,0.4)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                  padding: 0
                }}
                aria-label={`Jump to athlete ${i + 1}`}
              />
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => navigate('prev')}
              style={{
                width: isMobile ? '46px' : '58px',
                height: isMobile ? '46px' : '58px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                background: 'transparent',
                border: '2px solid white',
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 150ms ease, background-color 150ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.08)';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              aria-label="Previous Character"
            >
              <ArrowLeft size={isMobile ? 22 : 26} strokeWidth={2.25} />
            </button>

            <button
              onClick={() => navigate('next')}
              style={{
                width: isMobile ? '46px' : '58px',
                height: isMobile ? '46px' : '58px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                background: 'transparent',
                border: '2px solid white',
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 150ms ease, background-color 150ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.08)';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              aria-label="Next Character"
            >
              <ArrowRight size={isMobile ? 22 : 26} strokeWidth={2.25} />
            </button>
          </div>
        </div>

        {/* Bottom-right link "JOIN OPEN GYM" */}
        <div
          style={{
            position: 'absolute',
            bottom: isMobile ? '24px' : '64px',
            right: isMobile ? '20px' : '64px',
            zIndex: 60
          }}
        >
          <a
            href="#join"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textTransform: 'uppercase',
              textDecoration: 'none',
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(26px, 4vw, 56px)',
              fontWeight: 400,
              color: 'white',
              opacity: 0.95,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              transition: 'opacity 200ms ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.95';
            }}
          >
            <span>JOIN OPEN GYM</span>
            <ArrowRight size={isMobile ? 24 : 36} strokeWidth={2.25} />
          </a>
        </div>
      </div>
    </div>
  );
}
