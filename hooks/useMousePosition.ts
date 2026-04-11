"use client";

import { useEffect, useRef } from "react";

export interface MousePositionRef {
  x: number;
  y: number;
}

// ─── useMousePositionRef ──────────────────────────────────────────────────────
// Returns a stable ref (not state) that is mutated on every mousemove.
// Because it's a ref — NOT state — updating it never triggers a React re-render.
// Animation loops that need the current cursor position should read this ref
// directly inside their rAF callbacks, avoiding the Hero re-render on every
// mouse move that the previous useState-based hook caused.
export function useMousePositionRef(): React.RefObject<MousePositionRef> {
  const ref = useRef<MousePositionRef>({ x: 0, y: 0 });

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      ref.current.x = e.clientX;
      ref.current.y = e.clientY;
    };
    window.addEventListener("mousemove", handle, { passive: true });
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  return ref;
}

// ─── Legacy state-based version (keep for components that need reactive updates)
// Only use this where you genuinely need React to re-render on mouse move.
import { useState } from "react";

export interface MousePosition {
  x: number;
  y: number;
}

export function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handle, { passive: true });
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  return position;
}
