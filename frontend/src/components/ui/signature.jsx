"use client";

import { useEffect, useId, useState } from "react";
import { motion } from "framer-motion";
import opentype from "opentype.js";
import { cn } from "../../lib/utils.js";

let CACHED_FONT = null;
let FONT_PROMISE = null;

async function getFont(fontUrl) {
  if (CACHED_FONT) return CACHED_FONT;
  if (FONT_PROMISE) return FONT_PROMISE;

  FONT_PROMISE = (async () => {
    const urls = [
      fontUrl,
      "/LastoriaBoldRegular.otf",
      "./LastoriaBoldRegular.otf",
      "https://componentry.dev/LastoriaBoldRegular.otf",
      "https://www.componentry.fun/LastoriaBoldRegular.otf",
    ].filter(Boolean);

    for (const url of urls) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const buffer = await res.arrayBuffer();
          CACHED_FONT = opentype.parse(buffer);
          return CACHED_FONT;
        }
      } catch (err) {
        // try next url
      }
    }
    return null;
  })();

  return FONT_PROMISE;
}

/**
 * Signature Component (Componentry)
 * Renders an animated SVG handwriting signature effect using opentype.js and framer-motion.
 */
export function Signature({
  text = "Open Gym",
  color = "currentColor",
  fontSize = 32,
  duration = 1.5,
  delay = 0.1,
  className,
  inView = false,
  once = true,
  fontUrl = "/LastoriaBoldRegular.otf",
}) {
  const [paths, setPaths] = useState([]);
  const [width, setWidth] = useState(240);
  const height = fontSize * 2.8;
  const horizontalPadding = fontSize * 0.15;
  const baseline = fontSize * 1.6;
  const rawId = useId();
  const maskId = `signature-reveal-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  useEffect(() => {
    let alive = true;

    getFont(fontUrl).then((font) => {
      if (!alive || !font) return;

      let x = horizontalPadding;
      const newPaths = [];

      for (const char of text) {
        const glyph = font.charToGlyph(char);
        const path = glyph.getPath(x, baseline, fontSize);
        newPaths.push(path.toPathData(3));

        const advanceWidth = glyph.advanceWidth ?? font.unitsPerEm;
        x += advanceWidth * (fontSize / font.unitsPerEm);
      }

      setPaths(newPaths);
      setWidth(Math.ceil(x + horizontalPadding * 2));
    }).catch((err) => {
      console.warn("Signature font load notice:", err);
    });

    return () => {
      alive = false;
    };
  }, [text, fontSize, baseline, horizontalPadding, fontUrl]);

  const variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1 },
  };

  if (!paths.length) {
    return (
      <span
        className={cn(
          "inline-block font-serif italic tracking-wider opacity-85 select-none",
          className
        )}
        style={{ color, fontSize: `${fontSize * 0.75}px` }}
      >
        {text}
      </span>
    );
  }

  return (
    <motion.svg
      key={paths.length}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={cn("overflow-visible select-none inline-block", className)}
      initial="hidden"
      whileInView={inView ? "visible" : undefined}
      animate={inView ? undefined : "visible"}
      viewport={{ once }}
      aria-label={text}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          {paths.map((d, i) => (
            <motion.path
              key={`mask-${i}`}
              d={d}
              stroke="white"
              strokeWidth={Math.max(2.5, fontSize * 0.26)}
              fill="none"
              variants={variants}
              transition={{
                pathLength: {
                  delay: delay + i * 0.14,
                  duration,
                  ease: "easeInOut",
                },
                opacity: {
                  delay: delay + i * 0.14 + 0.01,
                  duration: 0.01,
                },
              }}
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </mask>
      </defs>

      {/* Dynamic stroke trace animation while being handwritten */}
      {paths.map((d, i) => (
        <motion.path
          key={`stroke-${i}`}
          d={d}
          stroke={color}
          strokeWidth={Math.max(1.8, fontSize * 0.045)}
          fill="none"
          variants={variants}
          transition={{
            pathLength: {
              delay: delay + i * 0.14,
              duration,
              ease: "easeInOut",
            },
            opacity: {
              delay: delay + i * 0.14 + 0.01,
              duration: 0.01,
            },
          }}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      {/* Solid filled ink layer revealed smoothly via mask */}
      <g mask={`url(#${maskId})`}>
        {paths.map((d, i) => (
          <path key={`fill-${i}`} d={d} fill={color} />
        ))}
      </g>
    </motion.svg>
  );
}

export default Signature;

