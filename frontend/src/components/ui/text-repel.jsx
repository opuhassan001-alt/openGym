"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "../../lib/utils.js";

function RepelLetter({
  letter,
  mouseX,
  mouseY,
  radius,
  strength,
  mode,
  stiffness,
  damping,
  mass,
  className,
}) {
  const ref = useRef(null);
  const originX = useRef(0);
  const originY = useRef(0);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness, damping, mass });
  const springY = useSpring(y, { stiffness, damping, mass });

  // Subtle tilt proportional to horizontal displacement
  const rotate = useTransform(springX, (v) => v * 0.25);

  // Capture original position relative to the container
  useEffect(() => {
    const capture = () => {
      if (!ref.current) return;
      const container = ref.current.closest("[data-text-repel]");
      if (!container) return;
      const cr = container.getBoundingClientRect();
      const lr = ref.current.getBoundingClientRect();
      originX.current = lr.left - cr.left + lr.width / 2;
      originY.current = lr.top - cr.top + lr.height / 2;
    };

    const raf = requestAnimationFrame(capture);
    window.addEventListener("resize", capture);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", capture);
    };
  }, []);

  // React to cursor position changes via motion value subscriptions
  useEffect(() => {
    const update = () => {
      const mx = mouseX.get();
      const my = mouseY.get();
      const dx = originX.current - mx;
      const dy = originY.current - my;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius && distance > 0) {
        // Quadratic falloff for natural spring force
        const force = Math.pow(1 - distance / radius, 2) * strength;
        const angle = Math.atan2(dy, dx);
        const dir = mode === "attract" ? -1 : 1;
        x.set(Math.cos(angle) * force * dir);
        y.set(Math.sin(angle) * force * dir);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    const unsub1 = mouseX.on("change", update);
    const unsub2 = mouseY.on("change", update);
    return () => {
      unsub1();
      unsub2();
    };
  }, [mouseX, mouseY, radius, strength, mode, x, y]);

  if (letter === " ") {
    return <span className="inline-block whitespace-pre" style={{ width: "0.28em" }}> </span>;
  }

  return (
    <motion.span
      ref={ref}
      className={cn(
        "inline-block whitespace-pre will-change-transform select-none",
        className
      )}
      style={{ x: springX, y: springY, rotate }}
      aria-hidden
    >
      {letter}
    </motion.span>
  );
}

export function TextRepel({
  text = "OPEN GYM",
  className,
  letterClassName,
  style,
  radius = 160,
  strength = 55,
  mode = "repel",
  stiffness = 180,
  damping = 14,
  mass = 0.4,
}) {
  const containerRef = useRef(null);
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);

  // Global pointer move listener so letters repel even when background has pointer-events: none
  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    const handlePointerLeave = () => {
      mouseX.set(-9999);
      mouseY.set(-9999);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      data-text-repel
      className={cn(
        "inline-flex flex-nowrap items-center justify-center cursor-default select-none",
        className
      )}
      style={style}
      aria-label={text}
    >
      {text.split("").map((letter, i) => (
        <RepelLetter
          key={`${letter}-${i}`}
          letter={letter}
          mouseX={mouseX}
          mouseY={mouseY}
          radius={radius}
          strength={strength}
          mode={mode}
          stiffness={stiffness}
          damping={damping}
          mass={mass}
          className={letterClassName}
        />
      ))}
    </div>
  );
}

export default TextRepel;
