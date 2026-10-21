"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { cn } from "../../lib/utils.js";

/**
 * LayeredStack component (Pace UI / Componentry)
 * Resting state: Cards are centered and stacked like a deck of playing cards.
 * Hover / Active state: Cards fan out into their responsive grid positions with GSAP expo physics.
 */
export const LayeredStack = ({ 
  children, 
  className, 
  stacked = true,
  onStackChange,
  ...props 
}) => {
  const containerRef = useRef(null);
  const [isStacked, setIsStacked] = useState(stacked);
  const isStackedRef = useRef(stacked);

  // Predictable, aesthetic card rotations for realistic deck stacking
  const getDeckRotation = (i) => {
    const seedAngles = [-7, 5, -4, 6, -6, 3, -5, 7, -3, 4, -8, 6];
    return seedAngles[i % seedAngles.length];
  };

  const stackCards = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = Array.from(container.children);
    if (!cards.length) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    cards.forEach((card, i) => {
      const left = card.offsetLeft;
      const top = card.offsetTop;
      const width = card.offsetWidth;
      const height = card.offsetHeight;

      const offsetX = containerWidth / 2 - width / 2 - left;
      const offsetY = containerHeight / 2 - height / 2 - top;
      const rot = getDeckRotation(i);

      gsap.to(card, {
        x: offsetX,
        y: offsetY,
        rotate: rot,
        scale: 1,
        zIndex: 100 - i,
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });
    });

    setIsStacked(true);
    isStackedRef.current = true;
    onStackChange?.(true);
  }, [onStackChange]);

  const resetCards = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = Array.from(container.children);
    if (!cards.length) return;

    gsap.to(cards, {
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      zIndex: 1,
      duration: 0.7,
      ease: "power3.out",
      stagger: {
        amount: 0.08,
        from: "start",
      },
      overwrite: "auto",
    });

    setIsStacked(false);
    isStackedRef.current = false;
    onStackChange?.(false);
  }, [onStackChange]);

  useEffect(() => {
    // Initial stacking animation after layout mounts
    const timer = setTimeout(() => {
      if (isStackedRef.current) {
        stackCards();
      }
    }, 60);

    // Re-center if window or container resizes while stacked
    const handleResize = () => {
      if (isStackedRef.current) {
        stackCards();
      }
    };

    const container = containerRef.current;
    let resizeObserver = null;
    if (typeof ResizeObserver !== "undefined" && container) {
      resizeObserver = new ResizeObserver(() => {
        if (isStackedRef.current) {
          stackCards();
        }
      });
      resizeObserver.observe(container);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [stackCards]);

  return (
    <div
      ref={containerRef}
      className={cn("relative transition-all duration-300", className)}
      onMouseEnter={resetCards}
      onMouseLeave={stackCards}
      data-stacked={isStacked}
      {...props}
    >
      {children}
    </div>
  );
};

export default LayeredStack;

