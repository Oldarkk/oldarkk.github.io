"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useIsDesktop } from "@/hooks/useMediaQuery";

// ─── Custom cursor (desktop only) ────────────────────────────────────────────
// mix-blend-mode: difference creates the colour-inverting effect.
// Spring physics make it feel organic, not mechanical.
export default function CustomCursor() {
  const isDesktop = useIsDesktop();
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(true);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Raw mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring-smoothed position for the dot (fast)
  const dotX = useSpring(mouseX, { stiffness: 1000, damping: 50, mass: 0.1 });
  const dotY = useSpring(mouseY, { stiffness: 1000, damping: 50, mass: 0.1 });

  // Spring-smoothed position for the ring (slower = trailing effect)
  const ringX = useSpring(mouseX, { stiffness: 200, damping: 30, mass: 0.5 });
  const ringY = useSpring(mouseY, { stiffness: 200, damping: 30, mass: 0.5 });

  useEffect(() => {
    if (!isDesktop) return;

    // Single mousemove handler — avoids the mouseover event which fires on
    // every child element transition and triggers excessive setHovered calls.
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setHidden(false);
      const target = e.target as HTMLElement;
      const isClickable = target.closest("a, button, [data-cursor-hover]") !== null;
      setHovered((prev) => (prev !== isClickable ? isClickable : prev));
    };

    const handleLeave = () => setHidden(true);
    const handleEnter = () => setHidden(false);

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
    };
  }, [isDesktop, mouseX, mouseY]);

  if (!isDesktop) return null;

  return (
    <div
      ref={cursorRef}
      className="custom-cursor"
      aria-hidden="true"
    >
      {/* Outer ring — trails behind */}
      <motion.div
        className="absolute rounded-full border border-white"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: hidden ? 0 : 1,
        }}
        animate={{
          width: hovered ? 56 : 32,
          height: hovered ? 56 : 32,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />

      {/* Inner dot — snaps to cursor */}
      <motion.div
        className="absolute rounded-full bg-white"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: hidden ? 0 : 1,
        }}
        animate={{
          width: hovered ? 8 : 6,
          height: hovered ? 8 : 6,
        }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}
