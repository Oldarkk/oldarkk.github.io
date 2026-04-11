"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

// ─── Page-load wipe transition ────────────────────────────────────────────────
// A solid black panel sweeps across the viewport on mount, then recedes.
// Runs once per page load.
export default function PageTransition() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Remove from DOM after animation completes
    const t = setTimeout(() => setVisible(false), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="page-transition"
          className="fixed inset-0 z-[99999] bg-[#0A0A0A] origin-left"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          exit={{ scaleX: 0 }}
          transition={{
            duration: 1.0,
            ease: [0.76, 0, 0.24, 1],
            delay: 0.2,
          }}
          aria-hidden="true"
        />
      )}
    </AnimatePresence>
  );
}
