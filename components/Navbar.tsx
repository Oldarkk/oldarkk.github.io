"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const NAV_LINKS = [
  { label: "HOME", href: "#home" },
  { label: "ABOUT", href: "#about" },
  { label: "WORK", href: "#experience" },
  { label: "PROJECTS", href: "#projects" },
  { label: "CONTACT", href: "#contact" },
];

// ─── Navbar ───────────────────────────────────────────────────────────────────
// Minimal floating bar: "A." logo + hamburger.
// Opens a fullscreen overlay menu with massive Space Grotesk links.
// Links optimized for thumb reach on mobile (positioned in lower third).
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add backdrop blur after scrolling 50px
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleLinkClick = (href: string) => {
    setOpen(false);
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 500);
  };

  return (
    <>
      {/* ── Floating bar ── */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between px-6 lg:px-10 py-5 transition-all duration-300 ${
          scrolled ? "backdrop-blur-sm bg-[#0A0A0A]/60" : ""
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4, ease: [0.76, 0, 0.24, 1] }}
      >
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-grotesk text-2xl font-bold text-[#F5F5F5] tracking-tight"
          aria-label="Back to top"
          data-cursor-hover
        >
          A.
        </button>

        {/* Hamburger — desktop only; mobile uses dock */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="relative w-10 h-10 hidden md:flex flex-col items-end justify-center gap-[6px] focus:outline-none"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          data-cursor-hover
        >
          <motion.span
            className="block h-[1.5px] bg-[#F5F5F5] origin-right"
            animate={open ? { width: "24px", rotate: -45, y: 5 } : { width: "24px", rotate: 0, y: 0 }}
            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.span
            className="block h-[1.5px] bg-[#F5F5F5] origin-right"
            animate={open ? { width: "24px", rotate: 45, y: -4 } : { width: "16px", rotate: 0, y: 0 }}
            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
          />
        </button>
      </motion.header>

      {/* ── Fullscreen overlay ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[999] bg-[#0A0A0A] flex flex-col justify-end pb-16 px-8 lg:px-16"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Nav links — thumb-friendly position at bottom third */}
            <nav className="mb-12">
              <ul className="space-y-1">
                {NAV_LINKS.map((link, i) => (
                  <li key={link.label} className="overflow-hidden">
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "100%" }}
                      transition={{
                        duration: 0.5,
                        delay: i * 0.06 + 0.1,
                        ease: [0.76, 0, 0.24, 1],
                      }}
                    >
                      <button
                        onClick={() => handleLinkClick(link.href)}
                        className="group relative block font-grotesk font-bold uppercase text-[#F5F5F5] text-[clamp(3rem,10vw,6rem)] tracking-tight leading-none py-1 min-h-[48px] w-full text-left"
                        data-cursor-hover
                      >
                        {/* Primary label */}
                        <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">
                          {link.label}
                        </span>
                        {/* Acid green duplicate slides up on hover */}
                        <span
                          className="absolute inset-0 block font-grotesk font-bold uppercase text-[#AAFF00] text-[clamp(3rem,10vw,6rem)] tracking-tight leading-none py-1 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"
                          aria-hidden="true"
                        >
                          {link.label}
                        </span>
                      </button>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Bottom bar: location + socials */}
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <p className="font-inter text-sm text-[#F5F5F5]/40 tracking-wider">
                Miri, Sarawak 🇲🇾
              </p>
              <div className="flex gap-6">
                {[
                  { label: "GH", href: "https://github.com/Oldarkk" },
                  { label: "LI", href: "https://linkedin.com/in/mohdaimnn" },
                  { label: "WA", href: "https://wa.me/601780865862" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-grotesk text-sm font-medium text-[#F5F5F5]/40 hover:text-[#AAFF00] transition-colors duration-200 underline-draw"
                    data-cursor-hover
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
