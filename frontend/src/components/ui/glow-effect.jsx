"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const BLUR_PRESETS = {
  softest: "blur-xs",
  soft: "blur-sm",
  medium: "blur-md",
  strong: "blur-lg",
  stronger: "blur-xl",
  strongest: "blur-2xl",
  none: "blur-none",
};

const BLUR_PIXELS = {
  softest: 4,
  soft: 8,
  medium: 14,
  strong: 20,
  stronger: 32,
  strongest: 48,
  none: 0,
};

function getBlurFilter(blur) {
  if (typeof blur === "number") return `blur(${blur}px)`;
  const px = BLUR_PIXELS[blur];
  return px !== undefined ? `blur(${px}px)` : "blur(14px)";
}

export function GlowEffect({
  colors = ["#FF5733", "#33FF57", "#3357FF", "#F1C40F"],
  mode = "rotate",
  blur = "strong",
  scale = 1,
  duration = 5,
  transition,
  className,
  style,
}) {
  const baseTransition = {
    repeat: Infinity,
    duration,
    ease: "linear",
  };

  const animations = {
    rotate: {
      background: [
        `conic-gradient(from 0deg at 50% 50%, ${colors.join(", ")})`,
        `conic-gradient(from 360deg at 50% 50%, ${colors.join(", ")})`,
      ],
      transition: transition ?? baseTransition,
    },
    pulse: {
      background: colors.map(
        (c) => `radial-gradient(circle at 50% 50%, ${c} 0%, transparent 100%)`
      ),
      scale: [scale, scale * 1.1, scale],
      opacity: [0.5, 0.8, 0.5],
      transition: transition ?? { ...baseTransition, repeatType: "mirror" },
    },
    breathe: {
      background: colors.map(
        (c) => `radial-gradient(circle at 50% 50%, ${c} 0%, transparent 100%)`
      ),
      scale: [scale, scale * 1.05, scale],
      transition: transition ?? { ...baseTransition, repeatType: "mirror" },
    },
    colorShift: {
      background: colors.map((c, i) => {
        const next = colors[(i + 1) % colors.length];
        return `conic-gradient(from 0deg at 50% 50%, ${c} 0%, ${next} 50%, ${c} 100%)`;
      }),
      transition: transition ?? { ...baseTransition, repeatType: "mirror" },
    },
    flowHorizontal: {
      background: colors.map((c, i) => {
        const next = colors[(i + 1) % colors.length];
        return `linear-gradient(to right, ${c}, ${next})`;
      }),
      transition: transition ?? { ...baseTransition, repeatType: "mirror" },
    },
    static: {
      background: `linear-gradient(to right, ${colors.join(", ")})`,
    },
  };

  return (
    <motion.div
      animate={animations[mode] || animations.rotate}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        willChange: "transform",
        transform: `scale(${scale})`,
        filter: getBlurFilter(blur),
        ...style,
      }}
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full transform-gpu",
        typeof blur === "string" ? BLUR_PRESETS[blur] : "",
        className
      )}
    />
  );
}

