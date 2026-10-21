"use client";

import * as React from "react";
import { FluidBlobs } from "@/components/ui/FluidBlobs";
import { GlowEffect } from "@/components/ui/glow-effect";
import { cn } from "@/lib/utils";
import "./blob-card.css";

const DEFAULT_LIGHT = ["#1B415D", "#456D8B", "#0A1A32", "#E8EFF5"];
const DEFAULT_DARK = ["#1B415D", "#456D8B", "#09071D", "#E8EFF5"];
const DEFAULT_GLOW = [
  "#1B415D",
  "#456D8B",
  "#0A1A32",
  "#E8EFF5",
  "#1B415D",
];

export function BlobCard({
  header,
  children,
  headerHeight = 224,
  lightColors = DEFAULT_LIGHT,
  darkColors = DEFAULT_DARK,
  glowColors = DEFAULT_GLOW,
  className,
}) {
  return (
    <div className={cn("blob-card-wrapper relative w-full", className)}>
      {/* 1.5px Animated Glow Border */}
      <div className="blob-card-glow-track absolute -inset-[1.5px] rounded-[25.5px] overflow-hidden z-0">
        <GlowEffect
          colors={glowColors}
          mode="rotate"
          blur="strongest"
          duration={5}
          scale={1}
        />
      </div>

      {/* Main Inner Surface */}
      <div className="blob-card-inner relative z-10 rounded-[24px] overflow-hidden bg-background">
        {/* Animated Fluid Blobs Header */}
        <div
          className="blob-card-header-surface relative overflow-hidden rounded-t-[24px]"
          style={{ height: headerHeight }}
        >
          <FluidBlobs
            lightColors={lightColors}
            darkColors={darkColors}
            origins={[
              { x: 28, y: -35 },
              { x: 50, y: -20 },
              { x: 72, y: -35 },
              { x: 50, y: -5 },
            ]}
            margin={60}
            blur={45}
          />
          {/* Bottom fade into card background */}
          <div className="blob-card-header-fade absolute inset-0 pointer-events-none" />
          {header && (
            <div className="blob-card-header-content relative z-10 p-8 pb-0">
              {header}
            </div>
          )}
        </div>

        {/* Card Body Content */}
        {children && <div className="blob-card-body">{children}</div>}
      </div>
    </div>
  );
}
