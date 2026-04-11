"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, Filter, Search, ExternalLink, X } from "lucide-react";
import { useMemo, useState } from "react";

type ProjectType = "agency" | "marketplace" | "saas" | "tool";
type ProjectStatus = "live" | "in-progress" | "shipped";

export interface Project {
  id: string;
  year: string;
  type: ProjectType;
  name: string;
  description: string;
  status: ProjectStatus;
  stack: string[];
  href?: string;
  image?: string;
}

type Filters = { type: string[]; status: string[]; stack: string[] };

const typeStyles: Record<ProjectType, string> = {
  agency:      "bg-violet-500/10 text-violet-400 border border-violet-500/20",
  marketplace: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
  saas:        "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  tool:        "bg-pink-500/10 text-pink-400 border border-pink-500/20",
};

const statusStyles: Record<ProjectStatus, string> = {
  live:          "text-[#AAFF00]",
  shipped:       "text-blue-400",
  "in-progress": "text-amber-400",
};

const statusDot: Record<ProjectStatus, string> = {
  live:          "bg-[#AAFF00] shadow-[0_0_6px_#AAFF00]",
  shipped:       "bg-blue-400",
  "in-progress": "bg-amber-400",
};

// ── Row ────────────────────────────────────────────────────────────────────────
function ProjectRow({
  project,
  expanded,
  onToggle,
}: {
  project: Project;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <motion.button
        onClick={onToggle}
        className="w-full px-4 sm:px-6 py-4 text-left transition-colors hover:bg-[#F5F5F5]/[0.03] active:bg-[#F5F5F5]/5"
      >
        {/* ── Desktop row ── */}
        <div className="hidden sm:flex items-center gap-4 min-w-0">
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
            <ChevronDown className="h-4 w-4 text-[#F5F5F5]/30" />
          </motion.div>
          <span className={`flex-shrink-0 px-2.5 py-1 rounded-full font-grotesk text-[10px] tracking-widest uppercase ${typeStyles[project.type]}`}>
            {project.type}
          </span>
          <span className="flex-shrink-0 font-mono text-xs text-[#F5F5F5]/40 w-10">{project.year}</span>
          <span className="flex-shrink-0 font-grotesk font-semibold text-sm text-[#F5F5F5] min-w-[120px]">{project.name}</span>
          <p className="flex-1 truncate font-inter text-sm text-[#F5F5F5]/50 min-w-0">{project.description}</p>
          <span className={`flex-shrink-0 flex items-center gap-1.5 font-grotesk text-xs font-semibold uppercase tracking-wider ${statusStyles[project.status]}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot[project.status]}`} />
            {project.status}
          </span>
          <span className="flex-shrink-0 w-16 text-right font-mono text-xs text-[#F5F5F5]/30">{project.stack.length} deps</span>
        </div>

        {/* ── Mobile row ── */}
        <div className="flex sm:hidden items-center gap-3 min-w-0">
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
            <ChevronDown className="h-4 w-4 text-[#F5F5F5]/30" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-grotesk font-semibold text-sm text-[#F5F5F5]">{project.name}</span>
              <span className={`flex-shrink-0 px-2 py-0.5 rounded-full font-grotesk text-[9px] tracking-widest uppercase ${typeStyles[project.type]}`}>
                {project.type}
              </span>
            </div>
            <p className="font-inter text-xs text-[#F5F5F5]/40 truncate">{project.description}</p>
          </div>
          <span className={`flex-shrink-0 flex items-center gap-1.5 font-grotesk text-xs font-semibold ${statusStyles[project.status]}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot[project.status]}`} />
          </span>
        </div>
      </motion.button>

      {/* ── Expanded details ── */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden border-t border-[#F5F5F5]/[0.06] bg-[#F5F5F5]/[0.02]"
          >
            <div className="px-4 sm:px-6 py-5 space-y-5">
              <div>
                <p className="mb-2 text-[10px] font-grotesk font-semibold uppercase tracking-widest text-[#F5F5F5]/30">About</p>
                <p className="font-inter text-sm text-[#F5F5F5]/70 leading-relaxed max-w-2xl">{project.description}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="mb-1 text-[10px] font-grotesk font-semibold uppercase tracking-widest text-[#F5F5F5]/30">Year</p>
                  <p className="font-mono text-[#F5F5F5]">{project.year}</p>
                </div>
                <div>
                  <p className="mb-1 text-[10px] font-grotesk font-semibold uppercase tracking-widest text-[#F5F5F5]/30">Type</p>
                  <p className="font-grotesk text-[#F5F5F5] capitalize">{project.type}</p>
                </div>
                <div>
                  <p className="mb-1 text-[10px] font-grotesk font-semibold uppercase tracking-widest text-[#F5F5F5]/30">Status</p>
                  <p className={`font-grotesk font-semibold capitalize ${statusStyles[project.status]}`}>{project.status}</p>
                </div>
                {project.href && (
                  <div>
                    <p className="mb-1 text-[10px] font-grotesk font-semibold uppercase tracking-widest text-[#F5F5F5]/30">Link</p>
                    <a
                      href={project.href}
                      target={project.href.startsWith("http") ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-grotesk text-xs text-[#AAFF00] hover:underline tracking-wider uppercase"
                    >
                      {project.href === "#contact" ? "Get in touch" : "View Project"}
                      <ExternalLink size={10} />
                    </a>
                  </div>
                )}
              </div>

              <div>
                <p className="mb-2 text-[10px] font-grotesk font-semibold uppercase tracking-widest text-[#F5F5F5]/30">Stack</p>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span key={tech} className="font-grotesk text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full border border-[#F5F5F5]/15 text-[#F5F5F5]/60">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Filter panel (desktop sidebar / mobile dropdown) ──────────────────────────
function FilterPanel({
  filters, onChange, projects, onClose,
}: {
  filters: Filters; onChange: (f: Filters) => void; projects: Project[]; onClose: () => void;
}) {
  const [types, statuses, stacks] = useMemo(() => [
    Array.from(new Set(projects.map((p) => p.type))),
    Array.from(new Set(projects.map((p) => p.status))),
    Array.from(new Set(projects.flatMap((p) => p.stack))),
  ], [projects]);

  const toggle = (cat: keyof Filters, val: string) => {
    const cur = filters[cat];
    onChange({ ...filters, [cat]: cur.includes(val) ? cur.filter((v) => v !== val) : [...cur, val] });
  };
  const clear = () => onChange({ type: [], status: [], stack: [] });
  const hasActive = Object.values(filters).some((g) => g.length > 0);

  const Group = ({ label, category, values }: { label: string; category: keyof Filters; values: string[] }) => (
    <div className="space-y-2">
      <p className="text-[10px] font-grotesk font-semibold uppercase tracking-widest text-[#F5F5F5]/30">{label}</p>
      {values.map((val) => {
        const sel = filters[category].includes(val);
        return (
          <motion.button key={val} type="button" whileHover={{ x: 2 }} onClick={() => toggle(category, val)}
            className={`flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 font-grotesk transition-colors ${
              sel ? "border-[#AAFF00]/50 bg-[#AAFF00]/10 text-[#AAFF00]"
                  : "border-[#F5F5F5]/10 text-[#F5F5F5]/50 hover:border-[#AAFF00]/30 hover:text-[#F5F5F5]"
            }`}>
            <span className="capitalize text-xs tracking-wider uppercase">{val}</span>
            {sel && <Check className="h-3 w-3" />}
          </motion.button>
        );
      })}
    </div>
  );

  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto bg-[#111111] p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-grotesk text-xs font-semibold uppercase tracking-widest text-[#F5F5F5]/50">Filters</h3>
        <div className="flex items-center gap-3">
          {hasActive && (
            <button onClick={clear} className="font-grotesk text-[10px] uppercase tracking-wider text-[#AAFF00] hover:opacity-70 transition-opacity">Clear</button>
          )}
          <button onClick={onClose} className="text-[#F5F5F5]/30 hover:text-[#F5F5F5] transition-colors sm:hidden">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <Group label="Type"   category="type"   values={types} />
      <Group label="Status" category="status" values={statuses} />
      <Group label="Stack"  category="stack"  values={stacks} />
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function ProjectsTable({
  projects,
  expandedId,
  onExpandedChange,
}: {
  projects: Project[];
  expandedId: string | null;
  onExpandedChange: (id: string | null) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters]         = useState<Filters>({ type: [], status: [], stack: [] });

  const filtered = useMemo(() => projects.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) &&
      (filters.type.length   === 0 || filters.type.includes(p.type)) &&
      (filters.status.length === 0 || filters.status.includes(p.status)) &&
      (filters.stack.length  === 0 || filters.stack.some((s) => p.stack.includes(s)))
    );
  }), [projects, filters, searchQuery]);

  const activeFilterCount = filters.type.length + filters.status.length + filters.stack.length;

  const handleToggle = (id: string) => {
    onExpandedChange(expandedId === id ? null : id);
  };

  return (
    <div className="relative flex flex-col border border-[#F5F5F5]/10 rounded-2xl overflow-hidden">

      {/* ── Header ── */}
      <div className="relative z-10 border-b border-[#F5F5F5]/10 bg-[#111111]/80 backdrop-blur-sm px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F5F5F5]/30" />
            <input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-lg border border-[#F5F5F5]/10 bg-[#0A0A0A]/80 pl-9 pr-4 font-inter text-sm text-[#F5F5F5] placeholder:text-[#F5F5F5]/25 outline-none focus:border-[#AAFF00]/40 transition-colors"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`relative flex h-9 items-center gap-2 rounded-lg border px-3 sm:px-4 font-grotesk text-xs uppercase tracking-wider transition-colors ${
                showFilters ? "border-[#AAFF00]/50 bg-[#AAFF00]/10 text-[#AAFF00]"
                            : "border-[#F5F5F5]/10 text-[#F5F5F5]/50 hover:border-[#AAFF00]/30 hover:text-[#F5F5F5]"
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Filter</span>
              {activeFilterCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#AAFF00] text-[#0A0A0A] text-[9px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
        <p className="mt-3 font-grotesk text-[10px] uppercase tracking-widest text-[#F5F5F5]/30">
          {filtered.length} of {projects.length} projects
        </p>
      </div>

      {/* ── Body ── */}
      <div className="relative z-10 flex flex-col sm:flex-row overflow-hidden" style={{ minHeight: 360 }}>

        {/* Filter panel — sidebar on desktop, top dropdown on mobile */}
        <AnimatePresence initial={false}>
          {showFilters && (
            <>
              {/* Desktop: sliding sidebar */}
              <motion.div
                key="filter-desktop"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 220, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.76, 0, 0.24, 1] }}
                className="hidden sm:block overflow-hidden flex-shrink-0 border-r border-[#F5F5F5]/10"
              >
                <FilterPanel filters={filters} onChange={setFilters} projects={projects} onClose={() => setShowFilters(false)} />
              </motion.div>

              {/* Mobile: sliding top panel */}
              <motion.div
                key="filter-mobile"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.76, 0, 0.24, 1] }}
                className="sm:hidden overflow-hidden border-b border-[#F5F5F5]/10"
              >
                <FilterPanel filters={filters} onChange={setFilters} projects={projects} onClose={() => setShowFilters(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Rows */}
        <div className="flex-1 overflow-y-auto bg-transparent divide-y divide-[#F5F5F5]/[0.06]">
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, delay: i * 0.03 }}
                >
                  <ProjectRow
                    project={project}
                    expanded={expandedId === project.id}
                    onToggle={() => handleToggle(project.id)}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center p-16">
                <p className="font-grotesk text-sm uppercase tracking-widest text-[#F5F5F5]/25">No projects match your filters.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default ProjectsTable;
