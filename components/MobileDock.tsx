"use client";

import { motion } from "motion/react";
import { Home, User, Code2, FolderOpen, Mail } from "lucide-react";
import { useState, useEffect } from "react";

const ITEMS = [
  { icon: Home, label: "Home", href: "#home" },
  { icon: User, label: "About", href: "#about" },
  { icon: Code2, label: "Projects", href: "#projects" },
  { icon: FolderOpen, label: "Work", href: "#experience" },
  { icon: Mail, label: "Contact", href: "#contact" },
];

export default function MobileDock() {
  const [active, setActive] = useState("#home");

  // Highlight whichever section is most visible
  useEffect(() => {
    const ids = ITEMS.map((i) => i.href.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry with the largest intersection ratio
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { threshold: [0.2, 0.5] }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleTap = (href: string) => {
    setActive(href);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      aria-label="Mobile navigation"
      className="fixed bottom-4 left-0 right-0 z-[1100] md:hidden flex justify-center px-4"
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2.0, duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="flex items-end gap-0.5 px-2.5 py-2 rounded-2xl border border-[#F5F5F5]/10 bg-[#0A0A0A]/85 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04)]">
        {ITEMS.map(({ icon: Icon, label, href }) => {
          const isActive = active === href;
          return (
            <motion.button
              key={href}
              onClick={() => handleTap(href)}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              className="relative flex flex-col items-center gap-0.5 px-3.5 py-1.5 rounded-xl min-w-[52px]"
              animate={{ backgroundColor: isActive ? "rgba(170,255,0,0.08)" : "rgba(0,0,0,0)" }}
              transition={{ duration: 0.2 }}
              whileTap={{ scale: 0.88 }}
            >
              <motion.div
                animate={{
                  color: isActive ? "#AAFF00" : "rgba(245,245,245,0.35)",
                  y: isActive ? -1 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                <Icon size={19} strokeWidth={isActive ? 2.2 : 1.8} />
              </motion.div>

              <span
                className="text-[9px] font-grotesk font-semibold uppercase tracking-[0.08em] leading-none"
                style={{ color: isActive ? "#AAFF00" : "rgba(245,245,245,0.28)" }}
              >
                {label}
              </span>

              {/* Active dot */}
              {isActive && (
                <motion.div
                  layoutId="dock-pip"
                  className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[#AAFF00]"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}
