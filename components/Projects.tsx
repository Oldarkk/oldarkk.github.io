"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "motion/react";
import { ProjectsTable, type Project } from "@/components/ui/projects-table";

const PROJECTS: Project[] = [
  {
    id: "1",
    year: "2024",
    type: "agency",
    name: "Scribear",
    description: "Web development agency built for results, from design to deployment. We ship fast, clean, and scalable.",
    status: "live",
    stack: ["Next.js", "Tailwind CSS", "GSAP", "TypeScript"],
    href: "https://scribear.my",
    image: "/scribear.png",
  },
  {
    id: "2",
    year: "2024",
    type: "marketplace",
    name: "SERVIS.MY",
    description: "Two-sided local services marketplace connecting customers and service providers in Miri, Sarawak.",
    status: "in-progress",
    stack: ["Next.js", "Supabase", "Tailwind CSS", "PostgreSQL"],
    href: "#",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&auto=format&fit=crop&q=80",
  },
  {
    id: "3",
    year: "2023",
    type: "saas",
    name: "ATS / HRM",
    description: "Custom applicant tracking and HR management system, streamlining hiring and people ops for growing teams.",
    status: "shipped",
    stack: ["React", "Node.js", "PostgreSQL", "REST APIs"],
    href: "#",
    image: "https://images.unsplash.com/photo-1551288049-bbda38a10ad5?w=1600&auto=format&fit=crop&q=80",
  },
  {
    id: "4",
    year: "2023",
    type: "tool",
    name: "Internal Dashboard",
    description: "Business intelligence dashboard with real-time analytics, reporting, and team management tools.",
    status: "shipped",
    stack: ["React", "Python", "Supabase", "Tailwind CSS"],
    href: "#",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&auto=format&fit=crop&q=80",
  },
];

export default function Projects() {
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headingRef, { once: true, margin: "-10%" });

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [prevId, setPrevId] = useState<string | null>(null);

  const activeProject = PROJECTS.find((p) => p.id === expandedId);
  const prevIndex = PROJECTS.findIndex((p) => p.id === prevId);
  const currIndex = PROJECTS.findIndex((p) => p.id === expandedId);
  const slideDir = currIndex >= prevIndex ? 1 : -1;

  const handleExpand = (id: string | null) => {
    setPrevId(expandedId);
    setExpandedId(id);
  };

  return (
    <section id="projects" className="relative py-24 lg:py-32">

      {/* ── Background glows (sit behind project image layer) ── */}
      {/* Emerald glow — top-left corner anchor */}
      <div
        className="glow-blob absolute -top-16 -left-16 w-[480px] h-[400px] pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at top left, rgba(52,211,153,0.09) 0%, transparent 70%)",
          filter: "blur(72px)",
        }}
      />
      {/* Rose accent — bottom-right, warm contrast */}
      <div
        className="glow-blob absolute bottom-0 right-0 w-[500px] h-[440px] pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at bottom right, rgba(244,63,94,0.07) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      {/* Acid-green center pulse — very faint */}
      <div
        className="glow-blob absolute top-1/3 left-1/2 -translate-x-1/2 w-[560px] h-[400px] pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse, rgba(170,255,0,0.04) 0%, transparent 65%)",
          filter: "blur(90px)",
        }}
      />

      {/* ── Full-section background image ── */}
      <AnimatePresence mode="popLayout" custom={slideDir}>
        {activeProject?.image && (
          <motion.div
            key={expandedId}
            custom={slideDir}
            initial={{ x: `${slideDir * 40}%`, opacity: 0 }}
            animate={{ x: "0%", opacity: 1 }}
            exit={{ x: `${slideDir * -40}%`, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <Image
              src={activeProject.image}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              priority={false}
            />
            {/* Dark overlay — heavier on left so heading stays readable */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/90 via-[#0A0A0A]/75 to-[#0A0A0A]/90" />
            <div className="absolute inset-0 bg-[#0A0A0A]/60" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Heading ── */}
      <div ref={headingRef} className="relative z-10 px-4 lg:px-14 mb-12 lg:mb-16">
        <div className="max-w-6xl mx-auto">
          <motion.p
            className="font-grotesk text-xs tracking-[0.4em] text-[#AAFF00] uppercase mb-4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            03 · Projects
          </motion.p>
          <div className="overflow-hidden">
            <motion.h2
              className="text-section-heading text-[#F5F5F5]"
              initial={{ y: "100%", opacity: 0 }}
              animate={isInView ? { y: "0%", opacity: 1 } : {}}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            >
              SELECTED
              <br />
              WORK
            </motion.h2>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="relative z-10 px-4 lg:px-14">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
          >
            <ProjectsTable
              projects={PROJECTS}
              expandedId={expandedId}
              onExpandedChange={handleExpand}
            />
          </motion.div>
        </div>
      </div>

    </section>
  );
}
