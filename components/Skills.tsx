"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
} from "motion/react";

const ROW1 = [
  { name: "Next.js",       category: "Framework" },
  { name: "React",         category: "UI Library" },
  { name: "TypeScript",    category: "Language" },
  { name: "Tailwind CSS",  category: "Styling" },
  { name: "Node.js",       category: "Runtime" },
  { name: "PostgreSQL",    category: "Database" },
  { name: "Python",        category: "Language" },
  { name: "Supabase",      category: "Backend" },
];

const ROW2 = [
  { name: "Framer Motion", category: "Animation" },
  { name: "Prisma",        category: "ORM" },
  { name: "Git",           category: "Version Control" },
  { name: "Vercel",        category: "Deployment" },
  { name: "AWS",           category: "Cloud" },
  { name: "Three.js",      category: "3D" },
  { name: "REST APIs",     category: "Integration" },
  { name: "Docker",        category: "DevOps" },
];

// Card width (200px) + gap (20px) × 16 items
const DRAG_LEFT_LIMIT = -(200 + 20) * 16;

function SkillCard({ name, category }: { name: string; category: string }) {
  return (
    <div className="flex-shrink-0 w-[200px] md:w-[240px] px-6 py-5 rounded-2xl border border-[#F5F5F5]/10 bg-[#F5F5F5]/[0.03] hover:border-[#AAFF00]/40 hover:bg-[#AAFF00]/[0.04] transition-colors duration-300 group">
      <p className="font-grotesk text-xs tracking-[0.2em] text-[#AAFF00]/60 uppercase mb-2 group-hover:text-[#AAFF00] transition-colors duration-300">
        {category}
      </p>
      <p className="font-grotesk text-lg font-semibold text-[#F5F5F5] tracking-tight">
        {name}
      </p>
    </div>
  );
}

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headingRef, { once: true, margin: "-10%" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Scroll-driven base transforms
  const scrollX1 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const scrollX2 = useTransform(scrollYProgress, [0, 1], ["-30%", "0%"]);

  // Writable drag offsets — combine with scroll so both work together
  const dragX1 = useMotionValue(0);
  const dragX2 = useMotionValue(0);
  const combinedX1 = useTransform(() => `calc(${scrollX1.get()} + ${dragX1.get()}px)`);
  const combinedX2 = useTransform(() => `calc(${scrollX2.get()} + ${dragX2.get()}px)`);

  return (
    <section
      id="skills"
      ref={containerRef}
      className="relative py-24 lg:py-32"
    >
      {/* ── Background glows ── */}
      {/* Violet bloom — top-right, tech/creative energy */}
      <div
        className="absolute -top-20 right-0 w-[550px] h-[480px] pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at top right, rgba(139,92,246,0.11) 0%, transparent 70%)",
          filter: "blur(72px)",
        }}
      />
      {/* Acid-green pulse — center-left */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -left-20 w-[420px] h-[420px] pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(170,255,0,0.07) 0%, transparent 70%)",
          filter: "blur(64px)",
        }}
      />
      {/* Cyan accent — bottom-center */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse at bottom, rgba(34,211,238,0.06) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* ── Heading ── */}
      <div ref={headingRef} className="px-4 lg:px-14 mb-16 lg:mb-20">
        <div className="max-w-6xl mx-auto">
          <motion.p
            className="font-grotesk text-xs tracking-[0.4em] text-[#AAFF00] uppercase mb-4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            02 · Stack
          </motion.p>
          <motion.h2
            className="text-section-heading text-[#F5F5F5]"
            initial={{ y: "100%", opacity: 0 }}
            animate={isInView ? { y: "0%", opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            THINGS I
            <br />
            BUILD WITH
          </motion.h2>
        </div>
      </div>

      {/* ── Rows with edge fade ── */}
      <div className="relative flex flex-col gap-5 overflow-hidden">
        {/* Edge fades */}
        <div className="absolute left-0 top-0 h-full w-32 lg:w-48 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #0A0A0A 0%, transparent 100%)" }} />
        <div className="absolute right-0 top-0 h-full w-32 lg:w-48 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #0A0A0A 0%, transparent 100%)" }} />

        {/* Row 1 — scroll left + draggable */}
        <motion.div
          style={{ x: combinedX1 }}
          drag="x"
          dragConstraints={{ left: DRAG_LEFT_LIMIT, right: 0 }}
          dragElastic={0.08}
          dragMomentum
          _dragX={dragX1}
          className="flex gap-5 w-max px-6 cursor-grab active:cursor-grabbing"
        >
          {[...ROW1, ...ROW1].map((skill, i) => (
            <SkillCard key={i} {...skill} />
          ))}
        </motion.div>

        {/* Row 2 — scroll right + draggable */}
        <motion.div
          style={{ x: combinedX2 }}
          drag="x"
          dragConstraints={{ left: DRAG_LEFT_LIMIT, right: 0 }}
          dragElastic={0.08}
          dragMomentum
          _dragX={dragX2}
          className="flex gap-5 w-max px-6 cursor-grab active:cursor-grabbing"
        >
          {[...ROW2, ...ROW2].map((skill, i) => (
            <SkillCard key={i} {...skill} />
          ))}
        </motion.div>
      </div>

      {/* ── Bottom divider ── */}
      <motion.div
        className="mt-16 lg:mt-24 mx-6 lg:mx-14 h-px bg-[#F5F5F5]/10"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        style={{ transformOrigin: "left" }}
        transition={{ duration: 1.2, delay: 0.4, ease: [0.76, 0, 0.24, 1] }}
      />
    </section>
  );
}
