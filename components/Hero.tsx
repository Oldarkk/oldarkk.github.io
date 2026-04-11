"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useAnimationFrame } from "motion/react";
import { useMousePositionRef } from "@/hooks/useMousePosition";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import dynamic from "next/dynamic";

// Lazy-load the cube so the heavy imperative DOM work doesn't block initial paint
const RubiksCube = dynamic(() => import("./RubiksCube"), { ssr: false });

// ─── Scramble text hook ───────────────────────────────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&";

function useScramble(target: string, autoStart = true, duration = 1200) {
  const [display, setDisplay] = useState(() =>
    target.split("").map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join("")
  );
  const frameRef = useRef<number>(0);

  const scramble = useCallback(() => {
    const startTime = performance.now();
    const len = target.length;
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const resolved = Math.floor(progress * len);
      setDisplay(
        target.split("").map((char, i) => {
          if (i < resolved) return char;
          if (char === " ") return " ";
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join("")
      );
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        setDisplay(target);
      }
    };
    frameRef.current = requestAnimationFrame(step);
  }, [target, duration]);

  useEffect(() => {
    if (autoStart) {
      const t = setTimeout(scramble, 300);
      return () => { clearTimeout(t); cancelAnimationFrame(frameRef.current); };
    }
  }, [autoStart, scramble]);

  return { display, scramble };
}

// ─── Repelling character (desktop) ───────────────────────────────────────────
// Reads mouse from a ref — zero React re-renders on mouse move.
// Bounds cached on mount, NOT inside rAF.
function RepelChar({ char, mouseRef }: {
  char: string;
  mouseRef: React.RefObject<{ x: number; y: number }>;
}) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 150, damping: 20, mass: 0.5 });
  const boundsRef = useRef({ cx: 0, cy: 0 });

  const updateBounds = useCallback(() => {
    if (!spanRef.current) return;
    const r = spanRef.current.getBoundingClientRect();
    boundsRef.current = { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
  }, []);

  useEffect(() => {
    updateBounds();
    window.addEventListener("resize", updateBounds, { passive: true });
    window.addEventListener("scroll", updateBounds, { passive: true });
    return () => {
      window.removeEventListener("resize", updateBounds);
      window.removeEventListener("scroll", updateBounds);
    };
  }, [updateBounds]);

  useAnimationFrame(() => {
    const mouse = mouseRef.current;
    if (!mouse) return;
    const { cx, cy } = boundsRef.current;
    const dx = mouse.x - cx;
    const dy = mouse.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120 && dist > 0) {
      const force = (1 - dist / 120) * 60;
      x.set(-(dx / dist) * force);
      y.set(-(dy / dist) * force);
    } else if (Math.abs(x.get()) > 0.5 || Math.abs(y.get()) > 0.5) {
      x.set(0); y.set(0);
    }
  });

  return (
    <motion.span ref={spanRef} style={{ x: springX, y: springY, display: "inline-block" }}>
      {char === " " ? "\u00A0" : char}
    </motion.span>
  );
}

// ─── Marquee strip ────────────────────────────────────────────────────────────
const MARQUEE_TEXT = "Next.js · Supabase · React · Python · TypeScript · Tailwind CSS · Node.js · PostgreSQL · ";

function Marquee() {
  const text = MARQUEE_TEXT.repeat(3);
  return (
    <div className="overflow-hidden w-full" aria-hidden="true">
      <div className="flex whitespace-nowrap" style={{ animation: "marquee-scroll 25s linear infinite" }}>
        <span className="font-grotesk text-xs lg:text-sm tracking-widest text-[#F5F5F5]/25 uppercase pr-8">{text}</span>
        <span className="font-grotesk text-xs lg:text-sm tracking-widest text-[#F5F5F5]/25 uppercase pr-8" aria-hidden="true">{text}</span>
      </div>
    </div>
  );
}

// ─── Badge — availability indicator ──────────────────────────────────────────
function Badge() {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#AAFF00]/25 bg-[#AAFF00]/5 mb-6">
      <span className="w-2 h-2 rounded-full bg-[#AAFF00]" style={{ animation: "badge-blink 2s ease-in-out infinite" }} />
      <span className="font-grotesk text-xs tracking-[0.2em] text-[#AAFF00] uppercase">Available for work</span>
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
export default function Hero() {
  const isDesktop = useIsDesktop();
  const mouseRef = useMousePositionRef();
  const { display: nameDisplay, scramble } = useScramble("AIMAN", true, 1400);
  const [tapped, setTapped] = useState(false);

  const handleTap = () => {
    if (!isDesktop && !tapped) {
      setTapped(true);
      scramble();
      setTimeout(() => setTapped(false), 1500);
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-[100svh] flex flex-col px-6 lg:px-14 pt-24 pb-0"
    >
      {/* ── Background glows ── */}
      {/* Acid-green spotlight — top-center, hero "source" light */}
      <div
        className="absolute top-0 left-0 right-0 h-[500px] pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse at top center, rgba(170,255,0,0.07) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />
      {/* Deep indigo bloom — bottom-right, contrast depth */}
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at bottom right, rgba(99,102,241,0.12) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      {/* Faint teal glimmer — bottom-left edge */}
      <div
        className="absolute bottom-10 -left-20 w-[360px] h-[360px] pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(20,184,166,0.07) 0%, transparent 70%)",
          filter: "blur(72px)",
        }}
      />

      {/* ── Subtle grid background (matches sample) ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── Main content row ── */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-28 lg:gap-56 py-10">

        {/* ── Left: text ── */}
        <div className="relative z-10 flex-none text-center lg:text-left lg:pl-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <Badge />
          </motion.div>

          {/* Name */}
          <motion.h1
            className="text-hero text-[#F5F5F5] select-none mb-4 whitespace-nowrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 1.1 }}
            onClick={handleTap}
            data-cursor-hover
          >
            {isDesktop
              ? nameDisplay.split("").map((char, i) => (
                <RepelChar key={i} char={char} mouseRef={mouseRef} />
              ))
              : nameDisplay}
          </motion.h1>

          {/* Role */}
          <motion.p
            className="font-inter text-[#AAFF00] text-sm lg:text-base tracking-[0.2em] uppercase mb-5"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5, ease: [0.76, 0, 0.24, 1] }}
          >
            Full Stack Developer &amp; Founder
          </motion.p>

          {/* Bio */}
          <motion.p
            className="font-inter text-[#F5F5F5]/50 text-sm lg:text-base leading-relaxed mb-8 max-w-md mx-auto lg:mx-0"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.7, ease: [0.76, 0, 0.24, 1] }}
          >
            Like a Rubik&apos;s Cube, every complex problem has an elegant solution.
            I build products that solve real problems and ship things that work.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="flex gap-4 flex-wrap justify-center lg:justify-start"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.9, ease: [0.76, 0, 0.24, 1] }}
          >
            <a
              href="#projects"
              className="inline-flex items-center gap-2 font-grotesk text-sm font-semibold tracking-wider px-6 py-3 rounded-xl bg-[#AAFF00] text-[#0A0A0A] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(170,255,0,0.35)] transition-all duration-200 min-h-[48px]"
              data-cursor-hover
            >
              View Projects →
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 font-grotesk text-sm font-semibold tracking-wider px-6 py-3 rounded-xl border border-[#F5F5F5]/15 text-[#F5F5F5] hover:border-[#AAFF00]/50 hover:text-[#AAFF00] transition-all duration-200 min-h-[48px]"
              data-cursor-hover
            >
              Get In Touch
            </a>
          </motion.div>

          {/* Mobile tap hint */}
          {!isDesktop && (
            <motion.p
              className="font-inter text-[#F5F5F5]/20 text-xs mt-4 tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              tap name to scramble
            </motion.p>
          )}
        </div>

        {/* ── Right: Rubik's Cube ── */}
        <div className="flex-shrink-0 lg:scale-[1.45]">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.3, ease: [0.34, 1.25, 0.64, 1] }}
          >
            <RubiksCube />
          </motion.div>
        </div>
      </div>

      {/* ── Marquee strip at bottom ── */}
      <motion.div
        className="relative z-10 pb-6 lg:pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
      >
        <Marquee />
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-10 right-6 lg:right-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.6 }}
        aria-hidden="true"
      >
        <motion.div
          className="w-px h-14 bg-gradient-to-b from-transparent to-[#AAFF00]/50"
          animate={{ scaleY: [0, 1, 0], y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
