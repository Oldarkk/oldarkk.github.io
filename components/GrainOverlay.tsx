"use client";

import { useEffect, useRef } from "react";
import { useIsDesktop } from "@/hooks/useMediaQuery";

// ─── Grain overlay — CSS background-position shift (zero per-frame JS) ────────
// Old approach: createImageData at full viewport resolution every frame (≈8M
// Math.random calls/frame at 1080p). Completely CPU-bound.
//
// New approach:
//   1. Render one 256×256 grain tile to an off-screen canvas ONCE on mount.
//   2. Convert to a data URL and set as CSS background-image.
//   3. Animate background-position via CSS `steps(1)` keyframes — compositor only,
//      zero JS per frame.
//
// Result: 0 rAF callbacks, 0 Math.random calls after mount.

function generateGrainTile(size = 256): string {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const val = (Math.random() * 255) | 0;
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
    data[i + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
}

export default function GrainOverlay() {
  const isDesktop = useIsDesktop();
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDesktop || !divRef.current) return;
    // Single allocation on mount — no per-frame work
    const url = generateGrainTile(256);
    divRef.current.style.backgroundImage = `url(${url})`;
  }, [isDesktop]);

  if (!isDesktop) return null;

  return (
    <div
      ref={divRef}
      id="grain-overlay"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9998,
        opacity: 0.04,
        mixBlendMode: "overlay",
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
        // CSS animation shifts background-position — runs on compositor, no JS
        animation: "grain-shift 0.6s steps(1) infinite",
      }}
    />
  );
}
