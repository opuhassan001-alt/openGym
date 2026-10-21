import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { TextRepel } from './ui/text-repel.jsx';

interface CharacterSlide {
  src: string;
  fallbackSrc: string;
  bg: string;
  panel: string;
}

const IMAGES: CharacterSlide[] = [
  {
    src: '/characters/char1.png?v=fixed2',
    fallbackSrc:
      'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png',
    bg: '#F4845F',
    panel: '#F79B7F',
  },
  {
    src: '/characters/char2.png?v=fixed2',
    fallbackSrc:
      'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png',
    bg: '#6BBF7A',
    panel: '#85CC92',
  },
  {
    src: '/characters/char3.png?v=fixed2',
    fallbackSrc:
      'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png',
    bg: '#E882B4',
    panel: '#ED9DC4',
  },
  {
    src: '/characters/char4.png?v=fixed2',
    fallbackSrc:
      'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png',
    bg: '#6EB5FF',
    panel: '#8DC4FF',
  },
];

export default function OpenGymHero() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );
  const isAnimatingRef = useRef<boolean>(false);
  const timeoutRef = useRef<number | null>(null);

  // Preload all 4 images on mount
  useEffect(() => {
    IMAGES.forEach((item) => {
      const img = new Image();
      img.src = item.src;
    });
  }, []);

  // Update isMobile on window resize
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Smooth 650ms carousel rotation
  const navigate = useCallback((direction: 'next' | 'prev') => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    setActiveIndex((prev) =>
      direction === 'next' ? (prev + 1) % 4 : (prev + 3) % 4
    );

    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      isAnimatingRef.current = false;
    }, 650);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') navigate('next');
      if (e.key === 'ArrowLeft') navigate('prev');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navigate]);

  const getRole = (index: number): 'center' | 'left' | 'right' | 'back' => {
    if (index === activeIndex) return 'center';
    if (index === (activeIndex + 3) % 4) return 'left';
    if (index === (activeIndex + 1) % 4) return 'right';
    return 'back';
  };

  const getRoleStyles = (
    role: 'center' | 'left' | 'right' | 'back'
  ): React.CSSProperties => {
    const transition =
      'transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1), height 650ms cubic-bezier(0.4,0,0.2,1), bottom 650ms cubic-bezier(0.4,0,0.2,1)';

    switch (role) {
      case 'center':
        return {
          transform: `translateX(-50%) scale(${isMobile ? 1.0 : 1.25})`,
          filter: 'blur(0px)',
          opacity: 1,
          zIndex: 20,
          left: '50%',
          height: isMobile ? '52%' : '76%',
          bottom: isMobile ? '22%' : 0,
          transition,
          willChange: 'transform, filter, opacity',
        };
      case 'left':
        return {
          transform: 'translateX(-50%) scale(0.85)',
          filter: 'blur(2px)',
          opacity: 0.85,
          zIndex: 10,
          left: isMobile ? '20%' : '30%',
          height: isMobile ? '16%' : '28%',
          bottom: isMobile ? '32%' : '12%',
          cursor: 'pointer',
          transition,
          willChange: 'transform, filter, opacity',
        };
      case 'right':
        return {
          transform: 'translateX(-50%) scale(0.85)',
          filter: 'blur(2px)',
          opacity: 0.85,
          zIndex: 10,
          left: isMobile ? '80%' : '70%',
          height: isMobile ? '16%' : '28%',
          bottom: isMobile ? '32%' : '12%',
          cursor: 'pointer',
          transition,
          willChange: 'transform, filter, opacity',
        };
      case 'back':
        return {
          transform: 'translateX(-50%) scale(0.8)',
          filter: 'blur(4px)',
          opacity: 1,
          zIndex: 5,
          left: '50%',
          height: isMobile ? '13%' : '22%',
          bottom: isMobile ? '32%' : '12%',
          transition,
          willChange: 'transform, filter, opacity',
        };
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: IMAGES[activeIndex].bg,
        transition: 'background-color 650ms cubic-bezier(0.4,0,0.2,1)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        className="relative w-full"
        style={{ height: '100vh', overflow: 'hidden' }}
      >
        {/* 2. Background Grand Interactive TextRepel "OPEN GYM" (Dead-centered horizontally and vertically behind 3D Characters) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <TextRepel
            text="OPEN GYM"
            radius={isMobile ? 120 : 200}
            strength={isMobile ? 35 : 65}
            className="w-full justify-center"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(80px, 20vw, 290px)',
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
            }}
          />
        </div>

        {/* 4. Carousel */}
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          {IMAGES.map((item, index) => {
            const role = getRole(index);
            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  aspectRatio: '0.75 / 1',
                  ...getRoleStyles(role),
                }}
                onClick={() => {
                  if (role === 'left') navigate('prev');
                  if (role === 'right') navigate('next');
                }}
              >
                <img
                  src={item.src}
                  onError={(e) => {
                    if (e.currentTarget.src !== item.fallbackSrc) {
                      e.currentTarget.src = item.fallbackSrc;
                    }
                  }}
                  alt={`Open Gym Character ${index + 1}`}
                  draggable={false}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'bottom center',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* 5. Bottom-left text + nav buttons */}
        <div
          style={{
            position: 'absolute',
            bottom: isMobile ? 24 : 72,
            left: isMobile ? 32 : 110,
            zIndex: 60,
            maxWidth: isMobile ? 280 : 380,
          }}
        >
          <p
            style={{
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              fontSize: isMobile ? 17 : 22,
              color: '#FFFFFF',
              opacity: 0.95,
              margin: '0 0 10px 0',
            }}
          >
            OPEN GYM FIGURINES
          </p>
          <p
            style={{
              fontSize: isMobile ? 12 : 13.5,
              color: '#FFFFFF',
              opacity: 0.88,
              lineHeight: 1.6,
              display: isMobile ? 'none' : 'block',
              margin: '0 0 20px 0',
            }}
          >
            your fitness, your schedule, your ultimate training ground. Whatever you are lifting heavy, changing endurance, or just starting out, unlock the strongest version of yourself without restriction.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              type="button"
              onClick={() => navigate('prev')}
              style={{
                width: isMobile ? 44 : 56,
                height: isMobile ? 44 : 56,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                cursor: 'pointer',
                backgroundColor: 'transparent',
                border: '2px solid #FFFFFF',
                transition: 'transform 150ms, background-color 150ms',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.08)';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              aria-label="Previous Athlete"
            >
              <ArrowLeft size={isMobile ? 20 : 26} strokeWidth={2.25} />
            </button>

            <button
              type="button"
              onClick={() => navigate('next')}
              style={{
                width: isMobile ? 44 : 56,
                height: isMobile ? 44 : 56,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                cursor: 'pointer',
                backgroundColor: 'transparent',
                border: '2px solid #FFFFFF',
                transition: 'transform 150ms, background-color 150ms',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.08)';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              aria-label="Next Athlete"
            >
              <ArrowRight size={isMobile ? 20 : 26} strokeWidth={2.25} />
            </button>
          </div>
        </div>

        {/* 6. Bottom-right link "DISCOVER IT" */}
        <a
          href="#discover"
          onClick={(e) => {
            e.preventDefault();
            navigate('next');
          }}
          style={{
            position: 'absolute',
            bottom: isMobile ? 24 : 72,
            right: isMobile ? 24 : 80,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            color: '#FFFFFF',
            textDecoration: 'none',
            zIndex: 60,
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(24px, 4vw, 56px)',
            fontWeight: 400,
            opacity: 0.95,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            textTransform: 'uppercase',
            transition: 'opacity 200ms',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.95')}
        >
          <span>DISCOVER IT</span>
          <ArrowRight size={isMobile ? 22 : 36} strokeWidth={2.25} />
        </a>
      </div>
    </div>
  );
}
