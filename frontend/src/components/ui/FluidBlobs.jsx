"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useAnimationFrame,
} from "framer-motion";

const DEFAULT_LIGHT = ["#3B82F6", "#06B6D4", "#8B5CF6", "#60A5FA"];
const DEFAULT_DARK = ["#1D4ED8", "#0284C7", "#7C3AED", "#2563EB"];

function getBlobConfig(index, customSize) {
  const freqs = [800, 1000, 1600, 520, 1100, 700, 1300];
  const amps = [28, 32, 22, 36, 25, 30, 20];
  const phases = [0, 2.1, 4.5, 1.8, 3.3, 5.2, 0.9];
  const a = index % 7;
  return {
    size:
      customSize != null
        ? customSize
        : [240, 200, 220, 170, 210, 190, 230][a],
    spring: {
      stiffness: [75, 38, 20, 55, 45, 30, 60][a],
      damping: [22, 16, 11, 19, 14, 12, 20][a],
    },
    driftX: { freq: freqs[a], amp: amps[a], phase: phases[a] },
    driftY: {
      freq: freqs[(a + 3) % 7],
      amp: amps[(a + 2) % 7],
      phase: phases[(a + 4) % 7],
    },
    pulse: {
      duration: [3.2, 4.1, 3.7, 4.8, 3.5, 4.4, 3.9][a],
      delay: [0, 0.6, 1.1, 1.8, 0.3, 1.4, 0.9][a],
    },
  };
}

function SingleBlob({
  color,
  config,
  mouseX,
  mouseY,
  isInsideRef,
  t,
  blur,
  origin,
  containerW,
  containerH,
}) {
  const { size, spring, driftX, driftY, pulse } = config;
  const initialX = origin ? (origin.x / 100) * containerW : containerW / 2;
  const initialY = origin ? (origin.y / 100) * containerH : containerH / 2;

  const targetX = useMotionValue(initialX);
  const targetY = useMotionValue(initialY);

  useAnimationFrame(() => {
    if (isInsideRef.current) {
      targetX.set(mouseX.get());
      targetY.set(mouseY.get());
    } else {
      targetX.set(initialX);
      targetY.set(initialY);
    }
  });

  const springX = useSpring(targetX, spring);
  const springY = useSpring(targetY, spring);

  const left = useTransform([springX, t], ([xVal, time]) => {
    return (
      xVal + Math.sin(time / driftX.freq + driftX.phase) * driftX.amp - size / 2
    );
  });

  const top = useTransform([springY, t], ([yVal, time]) => {
    return (
      yVal + Math.cos(time / driftY.freq + driftY.phase) * driftY.amp - size / 2
    );
  });

  return (
    <motion.div
      style={{
        position: "absolute",
        borderRadius: "9999px",
        width: size,
        height: size,
        left,
        top,
        background: color,
        filter: `blur(${blur}px)`,
        willChange: "transform",
        pointerEvents: "none",
      }}
      animate={{
        scale: [1, 1.18, 0.88, 1.12, 0.95, 1],
        opacity: [0.72, 0.92, 0.68, 0.88, 0.78, 0.72],
      }}
      transition={{
        duration: pulse.duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: pulse.delay,
      }}
    />
  );
}

export function FluidBlobs({
  colors,
  lightColors = DEFAULT_LIGHT,
  darkColors = DEFAULT_DARK,
  sizes,
  blur = 50,
  origins = [
    { x: 50, y: -55 },
    { x: 50, y: -25 },
    { x: 50, y: -25 },
    { x: 50, y: -25 },
  ],
  margin = 60,
  className = "",
}) {
  const containerRef = React.useRef(null);
  const [dimensions, setDimensions] = React.useState({ w: 400, h: 224 });

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const updateSize = () => {
      if (el.offsetWidth > 0 && el.offsetHeight > 0) {
        setDimensions({ w: el.offsetWidth, h: el.offsetHeight });
      }
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const mouseX = useMotionValue(dimensions.w / 2);
  const mouseY = useMotionValue(dimensions.h / 2);
  const isInsideRef = React.useRef(false);

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const topMargin = typeof margin === "number" ? margin : margin?.top ?? 0;
      const rightMargin =
        typeof margin === "number" ? margin : margin?.right ?? 0;
      const bottomMargin =
        typeof margin === "number" ? margin : margin?.bottom ?? 0;
      const leftMargin =
        typeof margin === "number" ? margin : margin?.left ?? 0;

      const inside =
        e.clientX >= rect.left - leftMargin &&
        e.clientX <= rect.right + rightMargin &&
        e.clientY >= rect.top - topMargin &&
        e.clientY <= rect.bottom + bottomMargin;

      isInsideRef.current = inside;
      if (inside) {
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, margin]);

  const t = useMotionValue(0);
  useAnimationFrame((time) => t.set(time));

  // Default to vibrant dark colors in athletic dark mode
  const activeColors =
    colors != null
      ? colors
      : darkColors ?? DEFAULT_DARK;

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {activeColors.map((color, idx) => {
        const sizeConfig = Array.isArray(sizes)
          ? sizes[idx]
          : typeof sizes === "number"
          ? sizes
          : undefined;
        const config = getBlobConfig(idx, sizeConfig);
        return (
          <SingleBlob
            key={idx}
            color={color}
            config={config}
            mouseX={mouseX}
            mouseY={mouseY}
            isInsideRef={isInsideRef}
            t={t}
            blur={blur}
            origin={origins ? origins[idx] : undefined}
            containerW={dimensions.w}
            containerH={dimensions.h}
          />
        );
      })}
    </div>
  );
}

