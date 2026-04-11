"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";

// ─── Thin acid-green scroll progress bar at top of viewport ──────────────────
export default function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div
      id="scroll-progress"
      aria-hidden="true"
      style={{ width: `${progress * 100}%` }}
    />
  );
}
