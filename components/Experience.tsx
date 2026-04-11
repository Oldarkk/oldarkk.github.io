"use client";

import { motion, AnimatePresence, useInView } from "motion/react";
import type { PanInfo } from "motion/react";
import { useRef, useState, useEffect, useCallback } from "react";
import { flushSync } from "react-dom";
import { Building2, Cpu, Globe, ArrowRight, Network } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ExperienceNode {
  id: string;
  badge: string;
  role: string;
  company: string;
  period: string;
  summary: string;
  details: string[];
  icon: React.ComponentType<{ className?: string }>;
  color: "lime" | "blue" | "amber" | "purple";
  position: { x: number; y: number };
}

interface Connection {
  from: string;
  to: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const NODE_W = 270;
const NODE_H = 190;
const H_GAP = 60;  // horizontal gap between nodes (desktop)
const V_GAP = 50;  // vertical gap between nodes (mobile)

// ─── Base data (positions assigned per layout) ────────────────────────────────
const BASE_NODES = [
  {
    id: "exp-1",
    badge: "origin",
    role: "Digital IT Administrator",
    company: "Misarma Enterprise",
    period: "Mar 2024 to Jul 2024",
    summary: "Resolved critical network issues and standardised company-wide email systems.",
    details: [
      "Resolved a critical network wiring conflict and upgraded router infrastructure, eliminating 100% of morning downtime complaints.",
      "Standardised email systems company-wide, significantly improving internal communication efficiency.",
      "Provided first-level technical support and collaborated with the marketing team on the company website.",
    ],
    icon: Network,
    color: "purple" as const,
  },
  {
    id: "exp-2",
    badge: "promoted",
    role: "Digital Strategist & IT Supervisor",
    company: "Borneoinspire",
    period: "Nov 2024 to Nov 2025",
    summary: "Promoted from intern within 3 months. Sole person for all digital and IT operations.",
    details: [
      "Promoted from intern to Digital Strategist and IT Support Supervisor within 3 months.",
      "Grew company Facebook page from ~400 to 1,000 followers in 8 months through consistent content creation.",
      "Led full email and website hosting migration from GoDaddy to Hostinger: 100% data migration, zero downtime, saving ~RM150 to RM250/year.",
      "Handled all creative output: flyers, module covers, photography, videography, and company logo revamp.",
    ],
    icon: Globe,
    color: "amber" as const,
  },
  {
    id: "exp-3",
    badge: "leadership",
    role: "Chief Technology Officer",
    company: "Zenara Jaya",
    period: "Nov 2025 to Mar 2026",
    summary: "Built and led a 7-person tech team. 90% on-time delivery across 3 client projects.",
    details: [
      "Built and led a 7-person tech team from scratch, growing from 2 hires to a full team of 7 in 3 months.",
      "Oversaw delivery of 3 external client projects with 90% on-time rate.",
      "Directed development of a custom ATS/HRM system with AI-powered resume scanning, processing 2,000+ resumes.",
      "Personally developed an MVP membership and course registration portal for a training provider.",
      "Led development of a GPS-based attendance system adopted by 15 staff during pilot phase.",
    ],
    icon: Cpu,
    color: "blue" as const,
  },
  {
    id: "exp-4",
    badge: "current",
    role: "Founder & Lead Developer",
    company: "Scribear",
    period: "Mar 2026 to Present",
    summary: "Founded a web dev agency. Architecting SERVIS.MY, a two-sided marketplace for Sarawak.",
    details: [
      "Founded Scribear, a web development agency empowering local Sarawak businesses with modern, conversion-optimised websites.",
      "Architecting and building SERVIS.MY, a two-sided marketplace connecting consumers with local service providers, built on Next.js 14, Supabase, and Vercel.",
      "Designed full system architecture including ERD, business model, and go-to-market strategy for pilot launch in Miri.",
      "Contributing hands-on to both frontend and backend development within a small team.",
    ],
    icon: Building2,
    color: "lime" as const,
  },
];

const CONNECTIONS: Connection[] = [
  { from: "exp-1", to: "exp-2" },
  { from: "exp-2", to: "exp-3" },
  { from: "exp-3", to: "exp-4" },
];

function makeHorizontalNodes(): ExperienceNode[] {
  return BASE_NODES.map((n, i) => ({
    ...n,
    position: { x: 40 + i * (NODE_W + H_GAP), y: 60 },
  }));
}

function makeVerticalNodes(): ExperienceNode[] {
  return BASE_NODES.map((n, i) => ({
    ...n,
    position: { x: 20, y: 20 + i * (NODE_H + V_GAP) },
  }));
}

function contentSizeFor(nodes: ExperienceNode[], vertical = false) {
  if (vertical) {
    return {
      width: NODE_W + 40,
      height: Math.max(...nodes.map((n) => n.position.y + NODE_H)) + 80,
    };
  }
  return {
    width: Math.max(...nodes.map((n) => n.position.x + NODE_W)) + 80,
    height: Math.max(...nodes.map((n) => n.position.y + NODE_H)) + 80,
  };
}

// ─── Color map ────────────────────────────────────────────────────────────────
const colorMap = {
  lime: {
    border: "border-[#AAFF00]/40",
    iconBg: "bg-[#AAFF00]/10 border-[#AAFF00]/40",
    iconText: "text-[#AAFF00]",
    badge: "border-[#AAFF00]/30 bg-[#AAFF00]/10 text-[#AAFF00]",
    dot: "bg-[#AAFF00]",
    ring: "ring-[#AAFF00]/40 shadow-[0_0_28px_rgba(170,255,0,0.12)]",
    accent: "#AAFF00",
  },
  blue: {
    border: "border-blue-400/40",
    iconBg: "bg-blue-400/10 border-blue-400/40",
    iconText: "text-blue-400",
    badge: "border-blue-400/30 bg-blue-400/10 text-blue-400",
    dot: "bg-blue-400",
    ring: "ring-blue-400/30 shadow-[0_0_28px_rgba(96,165,250,0.10)]",
    accent: "#60a5fa",
  },
  amber: {
    border: "border-amber-400/40",
    iconBg: "bg-amber-400/10 border-amber-400/40",
    iconText: "text-amber-400",
    badge: "border-amber-400/30 bg-amber-400/10 text-amber-400",
    dot: "bg-amber-400",
    ring: "ring-amber-400/30 shadow-[0_0_28px_rgba(251,191,36,0.10)]",
    accent: "#fbbf24",
  },
  purple: {
    border: "border-purple-400/40",
    iconBg: "bg-purple-400/10 border-purple-400/40",
    iconText: "text-purple-400",
    badge: "border-purple-400/30 bg-purple-400/10 text-purple-400",
    dot: "bg-purple-400",
    ring: "ring-purple-400/30 shadow-[0_0_28px_rgba(192,132,252,0.10)]",
    accent: "#c084fc",
  },
};

// ─── Connection Line ──────────────────────────────────────────────────────────
function ConnectionLine({
  from,
  to,
  nodes,
  vertical,
}: {
  from: string;
  to: string;
  nodes: ExperienceNode[];
  vertical: boolean;
}) {
  const fromNode = nodes.find((n) => n.id === from);
  const toNode = nodes.find((n) => n.id === to);
  if (!fromNode || !toNode) return null;

  let d: string;
  if (vertical) {
    // Bottom-center of fromNode to top-center of toNode
    const x1 = fromNode.position.x + NODE_W / 2;
    const y1 = fromNode.position.y + NODE_H;
    const x2 = toNode.position.x + NODE_W / 2;
    const y2 = toNode.position.y;
    const cp1y = y1 + (y2 - y1) * 0.5;
    const cp2y = y2 - (y2 - y1) * 0.5;
    d = `M${x1},${y1} C${x1},${cp1y} ${x2},${cp2y} ${x2},${y2}`;
  } else {
    // Right-center of fromNode to left-center of toNode
    const x1 = fromNode.position.x + NODE_W;
    const y1 = fromNode.position.y + NODE_H / 2;
    const x2 = toNode.position.x;
    const y2 = toNode.position.y + NODE_H / 2;
    const cp1x = x1 + (x2 - x1) * 0.5;
    const cp2x = x2 - (x2 - x1) * 0.5;
    d = `M${x1},${y1} C${cp1x},${y1} ${cp2x},${y2} ${x2},${y2}`;
  }

  return (
    <path
      d={d}
      fill="none"
      stroke="#AAFF00"
      strokeWidth={1.5}
      strokeDasharray="8,6"
      strokeLinecap="round"
      opacity={0.3}
    />
  );
}

// ─── Experience Section ───────────────────────────────────────────────────────
export default function Experience() {
  const headingRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headingRef, { once: true, margin: "-10%" });

  const [isMobile, setIsMobile] = useState(false);
  const [nodes, setNodes] = useState<ExperienceNode[]>(makeHorizontalNodes());
  const [contentSize, setContentSize] = useState(() => contentSizeFor(makeHorizontalNodes()));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);

  // Switch layout when screen size changes
  useEffect(() => {
    const update = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      const fresh = mobile ? makeVerticalNodes() : makeHorizontalNodes();
      setNodes(fresh);
      setContentSize(contentSizeFor(fresh, mobile));
      setSelectedId(null);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleDragStart = useCallback((id: string) => {
    setDraggingNodeId(id);
    const node = nodes.find((n) => n.id === id);
    if (node) dragStartPos.current = { x: node.position.x, y: node.position.y };
  }, [nodes]);

  const handleDrag = useCallback((id: string, { offset }: PanInfo) => {
    if (draggingNodeId !== id || !dragStartPos.current) return;
    const x = Math.max(0, dragStartPos.current.x + offset.x);
    const y = Math.max(0, dragStartPos.current.y + offset.y);
    flushSync(() => {
      setNodes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, position: { x, y } } : n))
      );
    });
    setContentSize((prev) => ({
      width: Math.max(prev.width, x + NODE_W + 80),
      height: Math.max(prev.height, y + NODE_H + 80),
    }));
  }, [draggingNodeId]);

  const handleDragEnd = useCallback(() => {
    setDraggingNodeId(null);
    dragStartPos.current = null;
  }, []);

  const handleNodeClick = useCallback((id: string) => {
    if (draggingNodeId) return;
    setSelectedId((prev) => (prev === id ? null : id));
  }, [draggingNodeId]);

  const selectedNode = nodes.find((n) => n.id === selectedId);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (selectedId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedId]);

  // Canvas height: on mobile fits all vertical nodes + padding; desktop fixed
  const canvasHeight = isMobile
    ? Math.min(contentSize.height + 20, 580)
    : NODE_H + 140;

  return (
    <section id="experience" className="relative px-4 sm:px-6 lg:px-10 py-24 lg:py-32">
      {/* Background glows */}
      <div
        className="absolute -top-20 -left-10 w-[460px] h-[420px] pointer-events-none z-0"
        style={{ background: "radial-gradient(circle at top left, rgba(96,165,250,0.09) 0%, transparent 70%)", filter: "blur(72px)" }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[400px] pointer-events-none z-0"
        style={{ background: "radial-gradient(circle at bottom right, rgba(251,191,36,0.07) 0%, transparent 70%)", filter: "blur(80px)" }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 right-0 w-[380px] h-[380px] pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(170,255,0,0.06) 0%, transparent 70%)", filter: "blur(64px)" }}
      />

      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div ref={headingRef} className="mb-10 sm:mb-12">
          <motion.p
            className="font-grotesk text-xs tracking-[0.4em] text-[#AAFF00] uppercase mb-4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
          >
            04 · Experience
          </motion.p>
          <div className="overflow-hidden">
            <motion.h2
              className="text-section-heading text-[#F5F5F5]"
              initial={{ y: "100%", opacity: 0 }}
              animate={isInView ? { y: "0%", opacity: 1 } : {}}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            >
              WHERE I&apos;VE
              <br />
              WORKED
            </motion.h2>
          </div>
        </div>

        {/* Workflow Canvas */}
        <motion.div
          className="relative w-full overflow-hidden rounded-2xl border border-[#F5F5F5]/10 bg-[#0D0D0D] p-4 sm:p-5 lg:p-6"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Block Header */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 rounded-full border border-[#AAFF00]/30 bg-[#AAFF00]/10 px-2.5 sm:px-3 py-1">
                <div className="h-1.5 w-1.5 rounded-full bg-[#AAFF00] animate-pulse" />
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#AAFF00]">Active</span>
              </div>
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#F5F5F5]/40">Career Workflow</span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.15em] text-[#F5F5F5]/20 hidden sm:block">
              {nodes.length} Nodes · {CONNECTIONS.length} Connections
            </span>
          </div>

          {/* Scrollable Canvas */}
          <div
            ref={canvasRef}
            data-lenis-prevent
            className="relative w-full overflow-auto rounded-xl border border-[#F5F5F5]/[0.06] bg-[#080808]"
            style={{ height: canvasHeight }}
          >
            {/* Dot-grid */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(245,245,245,0.045) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />

            {/* Content wrapper */}
            <div
              className="relative"
              style={{ minWidth: contentSize.width, minHeight: contentSize.height }}
            >
              {/* SVG connections */}
              <svg
                className="absolute top-0 left-0 pointer-events-none"
                width={contentSize.width}
                height={contentSize.height}
                style={{ overflow: "visible" }}
                aria-hidden="true"
              >
                {CONNECTIONS.map((c) => (
                  <ConnectionLine
                    key={`${c.from}-${c.to}`}
                    from={c.from}
                    to={c.to}
                    nodes={nodes}
                    vertical={isMobile}
                  />
                ))}
              </svg>

              {/* Nodes */}
              {nodes.map((node, i) => {
                const Icon = node.icon;
                const colors = colorMap[node.color];
                const isDragging = draggingNodeId === node.id;
                const isSelected = selectedId === node.id;

                return (
                  <motion.div
                    key={node.id}
                    drag={!isMobile}
                    dragMomentum={false}
                    dragConstraints={{ left: 0, top: 0, right: 100000, bottom: 100000 }}
                    onDragStart={() => handleDragStart(node.id)}
                    onDrag={(_, info) => handleDrag(node.id, info)}
                    onDragEnd={handleDragEnd}
                    onClick={() => handleNodeClick(node.id)}
                    style={{
                      x: node.position.x,
                      y: node.position.y,
                      width: NODE_W,
                      transformOrigin: "0 0",
                    }}
                    className={`absolute ${isMobile ? "cursor-pointer" : "cursor-grab"}`}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileDrag={{ scale: 1.04, zIndex: 50, cursor: "grabbing" }}
                  >
                    <div
                      className={[
                        "relative w-full overflow-hidden rounded-xl border p-4 transition-all bg-[#111111]",
                        colors.border,
                        isDragging ? "shadow-xl ring-2 ring-[#AAFF00]/20" : "",
                        isSelected ? `ring-2 ${colors.ring}` : "",
                      ].join(" ")}
                      style={{ height: NODE_H }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />

                      <div className="relative flex flex-col justify-between h-full">
                        <div>
                          <div className="flex items-center gap-2 mb-2.5">
                            <div className={["flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border", colors.iconBg, colors.iconText].join(" ")}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <span className={["text-[10px] uppercase tracking-[0.18em] font-semibold rounded-full border px-2 py-0.5", colors.badge].join(" ")}>
                              {node.badge}
                            </span>
                          </div>
                          <h3 className="text-sm font-semibold text-[#F5F5F5] leading-snug">{node.role}</h3>
                          <p className={`text-xs font-medium mt-0.5 ${colors.iconText}`}>{node.company}</p>
                        </div>

                        <div>
                          <p className="text-xs text-[#F5F5F5]/50 line-clamp-2 leading-relaxed">{node.summary}</p>
                          <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-[#F5F5F5]/30 uppercase tracking-[0.12em]">
                            <ArrowRight className="h-3 w-3 shrink-0" aria-hidden="true" />
                            <span>{node.period}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Block Footer */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#F5F5F5]/[0.06] bg-[#F5F5F5]/[0.015] px-3 sm:px-4 py-2.5">
            <div className="flex flex-wrap items-center gap-3 sm:gap-5">
              {nodes.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleNodeClick(n.id)}
                  className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-[#F5F5F5]/45 hover:text-[#F5F5F5]/70 transition-colors"
                >
                  <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${colorMap[n.color].dot}`} />
                  <span className="uppercase tracking-[0.12em] sm:tracking-[0.15em]">{n.company}</span>
                </button>
              ))}
            </div>
            <p className="text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#F5F5F5]/25">
              {isMobile ? "Tap to view details" : "Drag to reposition · Click to view details"}
            </p>
          </div>
        </motion.div>

      </div>

      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {selectedNode && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-[1200] bg-[#0A0A0A]/85 md:backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelectedId(null)}
            />

            {/* Modal panel — bottom sheet on mobile, centered overlay on desktop */}
            <motion.div
              key={selectedNode.id}
              role="dialog"
              aria-modal="true"
              aria-label={`${selectedNode.role} at ${selectedNode.company}`}
              className="fixed z-[1201] bottom-0 left-0 right-0 md:inset-0 md:flex md:items-center md:justify-center md:p-8"
              initial={isMobile ? { y: "100%", opacity: 0 } : { opacity: 0, scale: 0.96, y: 0 }}
              animate={isMobile ? { y: 0, opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={isMobile ? { y: "100%", opacity: 0 } : { opacity: 0, scale: 0.96, y: 0 }}
              transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
              style={{ willChange: "transform" }}
              onClick={(e) => { if (e.target === e.currentTarget) setSelectedId(null); }}
            >
              <div className="relative w-full md:max-w-4xl rounded-t-2xl md:rounded-2xl border border-[#F5F5F5]/10 bg-[#0D0D0D] overflow-hidden">
                {/* Accent glow */}
                <div
                  className="absolute top-0 left-0 w-[480px] h-[280px] pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at top left, ${colorMap[selectedNode.color].accent}14 0%, transparent 65%)`,
                  }}
                />

                {/* Drag handle — mobile only */}
                <div className="md:hidden flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1 rounded-full bg-[#F5F5F5]/20" />
                </div>

                {/* ── Top bar ── */}
                <div className="relative flex items-center justify-between px-5 md:px-10 pt-4 md:pt-8 pb-4 md:pb-6 border-b border-[#F5F5F5]/[0.06]">
                  <div className="flex items-center gap-3 md:gap-5 min-w-0">
                    <div className={`flex h-10 w-10 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-xl md:rounded-2xl border ${colorMap[selectedNode.color].iconBg} ${colorMap[selectedNode.color].iconText}`}>
                      <selectedNode.icon className="h-5 w-5 md:h-7 md:w-7" />
                    </div>
                    <div className="min-w-0">
                      <span className={`text-[10px] md:text-xs uppercase tracking-[0.3em] font-semibold ${colorMap[selectedNode.color].iconText}`}>
                        {selectedNode.period}
                      </span>
                      <h3 className="font-grotesk font-bold text-[#F5F5F5] text-lg md:text-3xl leading-tight">
                        {selectedNode.role}
                      </h3>
                      <p className="text-[#F5F5F5]/40 text-sm md:text-base font-inter mt-0.5">{selectedNode.company}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedId(null)}
                    className="ml-4 w-8 h-8 md:w-10 md:h-10 flex-shrink-0 rounded-full border border-[#F5F5F5]/15 flex items-center justify-center text-[#F5F5F5]/40 hover:text-[#AAFF00] hover:border-[#AAFF00]/30 transition-colors text-base md:text-lg leading-none"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                {/* ── Body ── */}
                <div className="relative px-5 md:px-10 py-5 md:py-8 md:grid md:grid-cols-[220px_1fr] md:gap-12">

                  {/* Left column — desktop meta */}
                  <div className="hidden md:flex flex-col gap-5 border-r border-[#F5F5F5]/[0.06] pr-12">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-[#F5F5F5]/30 mb-2">Status</p>
                      <span className={`text-[10px] uppercase tracking-[0.2em] font-semibold rounded-full border px-3 py-1.5 ${colorMap[selectedNode.color].badge}`}>
                        {selectedNode.badge}
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-[#F5F5F5]/30 mb-2">Period</p>
                      <p className={`text-sm font-semibold leading-snug ${colorMap[selectedNode.color].iconText}`}>{selectedNode.period}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-[#F5F5F5]/30 mb-2">Company</p>
                      <p className="text-sm text-[#F5F5F5]/60 font-inter">{selectedNode.company}</p>
                    </div>
                    <div className="mt-auto pt-5 border-t border-[#F5F5F5]/[0.06]">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-[#F5F5F5]/30 mb-2">Summary</p>
                      <p className="text-sm text-[#F5F5F5]/50 leading-relaxed font-inter">{selectedNode.summary}</p>
                    </div>
                  </div>

                  {/* Right column — highlights */}
                  <div>
                    <p className="hidden md:block text-[10px] uppercase tracking-[0.25em] text-[#F5F5F5]/30 mb-5">Highlights</p>
                    <ul className="space-y-3 md:space-y-5 border-l-2 pl-4 md:pl-6" style={{ borderColor: `${colorMap[selectedNode.color].accent}30` }}>
                      {selectedNode.details.map((d, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.12 + i * 0.07 }}
                          className="flex items-start gap-2.5 text-sm md:text-[0.95rem] text-[#F5F5F5]/60 leading-relaxed font-inter"
                        >
                          <ArrowRight
                            className="w-3.5 h-3.5 md:w-4 md:h-4 mt-0.5 flex-shrink-0"
                            style={{ color: colorMap[selectedNode.color].accent }}
                          />
                          {d}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* ── Footer ── */}
                <div className="relative px-5 md:px-10 py-4 md:py-5 border-t border-[#F5F5F5]/[0.06] flex items-center justify-between">
                  <span className={`md:hidden text-[10px] uppercase tracking-[0.2em] font-semibold rounded-full border px-2.5 py-1 ${colorMap[selectedNode.color].badge}`}>
                    {selectedNode.badge}
                  </span>
                  <span className="hidden md:block text-xs uppercase tracking-[0.2em] text-[#F5F5F5]/20 font-inter">
                    {selectedNode.details.length} highlights
                  </span>
                  <button
                    onClick={() => setSelectedId(null)}
                    className="font-grotesk text-xs tracking-widest uppercase text-[#F5F5F5]/30 hover:text-[#AAFF00] transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
