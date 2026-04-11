"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { useIsMobile } from "@/hooks/useMediaQuery";

const EMAIL = "mohdaimnn@gmail.com";
const YEAR = new Date().getFullYear();

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/Oldarkk" },
  { label: "LinkedIn", href: "https://linkedin.com/in/mohdaimnn" },
  { label: "WhatsApp", href: "https://wa.me/601780865862" },
];

const HEADING_WORDS = ["LET'S", "BUILD", "SOMETHING."];

// ─── Contact Section ──────────────────────────────────────────────────────────
// Full-viewport dark section. Massive staggered heading reveal.
// Email copy interaction: morphs to "COPIED ✓" in acid green briefly.
// Morphing blob background for depth.
export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });
  const isMobile = useIsMobile();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = EMAIL;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:absolute;left:-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen flex flex-col justify-center px-6 lg:px-10 py-24 lg:py-32"
      ref={ref}
    >
      {/* ── Morphing blob background ── */}
      <BlobBackground />

      {/* ── Background glows (complement blob, don't fight it) ── */}
      {/* Acid-green crown — top-center, invitation light */}
      <div
        className="glow-blob absolute -top-10 left-1/2 -translate-x-1/2 w-[640px] h-[400px] pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse at top, rgba(170,255,0,0.07) 0%, transparent 65%)",
          filter: "blur(80px)",
        }}
      />
      {/* Indigo depth — bottom-left */}
      <div
        className="glow-blob absolute bottom-0 -left-10 w-[440px] h-[440px] pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at bottom left, rgba(99,102,241,0.09) 0%, transparent 70%)",
          filter: "blur(72px)",
        }}
      />
      {/* Warm amber — far right, warmth to the CTA */}
      <div
        className="glow-blob absolute top-1/2 -translate-y-1/2 -right-16 w-[400px] h-[400px] pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(251,146,60,0.07) 0%, transparent 70%)",
          filter: "blur(72px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* ── Section label ── */}
        <motion.p
          className="font-grotesk text-xs tracking-[0.4em] text-[#AAFF00] uppercase mb-12 lg:mb-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          05 · Contact
        </motion.p>

        {/* ── Massive heading ── */}
        <div className="mb-16 lg:mb-24">
          {HEADING_WORDS.map((word, i) => (
            <div key={word} className="overflow-hidden">
              <motion.h2
                className="font-grotesk font-bold text-[#F5F5F5] leading-none block"
                style={{ fontSize: "clamp(3rem, 12vw, 10rem)" }}
                initial={{ y: "100%", opacity: 0 }}
                animate={isInView ? { y: "0%", opacity: 1 } : {}}
                transition={{
                  duration: 0.8,
                  delay: i * 0.12,
                  ease: [0.76, 0, 0.24, 1],
                }}
              >
                {word}
              </motion.h2>
            </div>
          ))}
        </div>

        {/* ── Email copy ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-12 lg:mb-16"
        >
          <p className="font-inter text-[#F5F5F5]/30 text-xs tracking-widest uppercase mb-3">
            Drop a line
          </p>
          <button
            onClick={handleCopy}
            className="group flex items-center gap-4 focus:outline-none"
            aria-label="Copy email address"
            data-cursor-hover
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="copied"
                  className="font-grotesk font-bold text-[#AAFF00]"
                  style={{ fontSize: "clamp(1rem, 3.5vw, 2.5rem)" }}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  COPIED ✓
                </motion.span>
              ) : (
                <motion.span
                  key="email"
                  className="font-grotesk font-bold text-[#F5F5F5] underline-draw group-hover:text-[#AAFF00] transition-colors duration-200"
                  style={{ fontSize: "clamp(1rem, 3.5vw, 2.5rem)" }}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {EMAIL}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Copy icon */}
            <motion.div
              className="w-8 h-8 rounded-full border border-[#F5F5F5]/20 flex items-center justify-center flex-shrink-0"
              animate={{
                borderColor: copied ? "#AAFF00" : "rgba(245,245,245,0.2)",
                scale: copied ? 1.1 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-xs">{copied ? "✓" : "⌘"}</span>
            </motion.div>
          </button>
        </motion.div>

        {/* ── Social links ── */}
        <motion.div
          className="flex flex-wrap gap-6 lg:gap-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-grotesk text-sm tracking-widest uppercase text-[#F5F5F5]/40 hover:text-[#AAFF00] transition-colors duration-200 underline-draw min-h-[48px] flex items-center"
              data-cursor-hover
            >
              {s.label}
            </a>
          ))}
        </motion.div>

        {/* ── Footer bar ── */}
        <motion.div
          className="mt-20 lg:mt-28 pt-6 border-t border-[#F5F5F5]/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <p className="font-inter text-[#F5F5F5]/20 text-xs tracking-widest">
            © {YEAR} Aiman. All rights reserved.
          </p>
          <p className="font-grotesk text-[#F5F5F5]/20 text-xs tracking-wider">
            Miri, Sarawak 🇲🇾
          </p>
        </motion.div>
      </div>

      {/* ── Mobile toast notification ── */}
      <AnimatePresence>
        {copied && isMobile && (
          <motion.div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#AAFF00] text-[#0A0A0A] font-grotesk font-bold text-sm tracking-wider px-6 py-3 rounded-full"
            initial={{ y: 20, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            Copied ✓
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── Slowly morphing blob background ─────────────────────────────────────────
function BlobBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute rounded-full filter blur-[120px] opacity-20 lg:blur-[120px] blur-0"
        style={{
          width: "60vw",
          height: "60vw",
          background: "#0A1A00",
          left: "20%",
          top: "10%",
        }}
        animate={{
          borderRadius: [
            "60% 40% 30% 70% / 60% 30% 70% 40%",
            "30% 60% 70% 40% / 50% 60% 30% 60%",
            "60% 40% 30% 70% / 60% 30% 70% 40%",
          ],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
