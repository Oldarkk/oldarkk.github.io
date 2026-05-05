"use client";

import { useRef } from "react";
import { TimelineContent } from "@/components/ui/timeline-animation";
import ButtonWithIcon from "@/components/ui/button-with-icon";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";

// ─── About Section ────────────────────────────────────────────────────────────
// Layout adapted from about-section template, re-skinned to portfolio palette:
//   #0A0A0A bg, #F5F5F5 text, #AAFF00 acid green accent, #0A1A00 watermark
export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-8 px-4 lg:px-14"
    >
      {/* ── Background glows ── */}
      {/* Acid-green bloom — top-left, echoes the accent colour */}
      <div
        className="glow-blob absolute -top-24 -left-24 w-[520px] h-[520px] pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(170,255,0,0.09) 0%, transparent 70%)",
          filter: "blur(48px)",
        }}
      />
      {/* Steel-blue bloom — top-right */}
      <div
        className="glow-blob absolute -top-16 right-0 w-[480px] h-[420px] pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at top right, rgba(70,130,200,0.13) 0%, transparent 70%)",
          filter: "blur(64px)",
        }}
      />
      {/* Warm amber whisper — bottom-center, very faint depth */}
      <div
        className="glow-blob absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse at bottom, rgba(170,255,0,0.04) 0%, transparent 70%)",
          filter: "blur(72px)",
        }}
      />

      {/* ── All content above watermark ── */}
      <div className="relative z-10 max-w-6xl mx-auto">

        {/* ── Header row: section label + social links ── */}
        <div className="flex justify-between items-center mb-8 w-[85%] absolute lg:top-4 md:top-0 sm:-top-2 -top-3 z-10">
          <div className="flex items-center gap-2">
            <span className="text-[#AAFF00] animate-spin inline-block" style={{ animationDuration: "4s" }}>✱</span>
            <TimelineContent
              as="span"
              animationNum={0}
              timelineRef={sectionRef as React.RefObject<HTMLElement>}
              className="font-grotesk text-xs tracking-[0.4em] text-[#AAFF00] uppercase"
            >
              01 · About
            </TimelineContent>
          </div>

          {/* Social links */}
          <div className="flex gap-3">
            {[
              {
                href: "https://github.com/Oldarkk", label: "GitHub", icon: (
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
                )
              },
              {
                href: "https://linkedin.com/in/mohdaimnn", label: "LinkedIn", icon: (
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                )
              },
              {
                href: "https://www.tiktok.com/@mohdaimnn?_r=1&_t=ZS-95QLsu03Kie", label: "TikTok", icon: (
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.15a8.28 8.28 0 0 0 4.84 1.54V7.24a4.85 4.85 0 0 1-1.07-.55z" /></svg>
                )
              },
            ].map((s, i) => (
              <TimelineContent
                key={s.label}
                as="a"
                animationNum={i}
                timelineRef={sectionRef as React.RefObject<HTMLElement>}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-8 h-8 border border-[#F5F5F5]/10 bg-[#F5F5F5]/04 rounded-lg flex items-center justify-center text-[#F5F5F5]/40 hover:text-[#AAFF00] hover:border-[#AAFF00]/40 transition-colors duration-200"
              >
                {s.icon}
              </TimelineContent>
            ))}
          </div>
        </div>

        {/* ── Profile image in custom clip-path frame ── */}
        <TimelineContent
          as="figure"
          animationNum={4}
          timelineRef={sectionRef as React.RefObject<HTMLElement>}
          className="relative mt-16"
        >
          <svg className="w-full" width="100%" height="100%" viewBox="0 0 100 40">
            <defs>
              <clipPath id="clip-about" clipPathUnits="objectBoundingBox">
                <path
                  d="M0.0998072 1H0.422076H0.749756C0.767072 1 0.774207 0.961783 0.77561 0.942675V0.807325C0.777053 0.743631 0.791844 0.731953 0.799059 0.734076H0.969813C0.996268 0.730255 1.00088 0.693206 0.999875 0.675159V0.0700637C0.999875 0.0254777 0.985045 0.00477707 0.977629 0H0.902473C0.854975 0 0.890448 0.138535 0.850165 0.138535H0.0204424C0.00408849 0.142357 0 0.180467 0 0.199045V0.410828C0 0.449045 0.0136283 0.46603 0.0204424 0.469745H0.0523086C0.0696245 0.471019 0.0735527 0.497877 0.0733523 0.511146V0.915605C0.0723903 0.983121 0.090588 1 0.0998072 1Z"
                  fill="#D9D9D9"
                />
              </clipPath>
            </defs>
            <image
              clipPath="url(#clip-about)"
              preserveAspectRatio="xMidYMid slice"
              width="100%"
              height="100%"
              href="/aiman.jpg"
            />
          </svg>
        </TimelineContent>

        {/* ── Stats row ── */}
        <div className="flex flex-wrap lg:justify-start justify-between items-center py-3 text-sm relative">
          <TimelineContent
            as="div"
            animationNum={5}
            timelineRef={sectionRef as React.RefObject<HTMLElement>}
            className="flex gap-4"
          >
            <div className="flex items-center gap-2 mb-2 sm:text-base text-xs">
              <span className="text-[#AAFF00] font-bold">1+</span>
              <span className="text-[#F5F5F5]/40">years in industry</span>
              <span className="text-[#F5F5F5]/20">|</span>
            </div>
            <div className="flex items-center gap-2 mb-2 sm:text-base text-xs">
              <span className="text-[#AAFF00] font-bold">7</span>
              <span className="text-[#F5F5F5]/40">person team led</span>
            </div>
          </TimelineContent>

          <div className="lg:absolute right-0 bottom-16 flex lg:flex-col flex-row-reverse lg:gap-0 gap-4">
            <TimelineContent
              as="div"
              animationNum={6}
              timelineRef={sectionRef as React.RefObject<HTMLElement>}
              className="flex lg:text-4xl sm:text-3xl text-2xl items-center gap-2 mb-2"
            >
              <span className="text-[#AAFF00] font-semibold">5+</span>
              <span className="text-[#F5F5F5]/40 uppercase font-grotesk tracking-wider text-base">projects</span>
            </TimelineContent>
            <TimelineContent
              as="div"
              animationNum={7}
              timelineRef={sectionRef as React.RefObject<HTMLElement>}
              className="flex items-center gap-2 mb-2 sm:text-base text-xs"
            >
              <span className="text-[#AAFF00] font-bold">100%</span>
              <span className="text-[#F5F5F5]/40">delivered to client</span>
              <span className="text-[#F5F5F5]/20 lg:hidden block">|</span>
            </TimelineContent>
          </div>
        </div>

        {/* ── Main content grid ── */}
        <div className="grid md:grid-cols-3 gap-8 mt-4">

          {/* Bio — 2/3 width */}
          <div className="md:col-span-2">
            <h2
              className="font-grotesk sm:text-4xl md:text-5xl text-2xl font-bold text-[#F5F5F5] mb-8"
              style={{ lineHeight: "1.1", letterSpacing: "-0.03em" }}
            >
              <VerticalCutReveal
                splitBy="words"
                staggerDuration={0.08}
                staggerFrom="first"
                reverse={false}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 28,
                  delay: 0.4,
                }}
              >
                I Figure Things Out and Build Them.
              </VerticalCutReveal>
            </h2>

            <div className="grid md:grid-cols-2 gap-8 text-[#F5F5F5]/55">
              <TimelineContent
                as="p"
                animationNum={9}
                timelineRef={sectionRef as React.RefObject<HTMLElement>}
                className="leading-relaxed sm:text-base text-sm text-justify"
              >
                I&apos;m Aiman, a full-stack developer based in Miri, Sarawak.
                Currently working freelance, delivering client websites and building SERVIS.MY,
                a two-sided services marketplace for Sarawak.
              </TimelineContent>
              <TimelineContent
                as="p"
                animationNum={10}
                timelineRef={sectionRef as React.RefObject<HTMLElement>}
                className="leading-relaxed sm:text-base text-sm text-justify"
              >
                Former CTO at Zenara Jaya where I built and led a 7-person tech team,
                delivering 3 client projects with a 90% on-time rate. Comfortable across
                the full stack, from ERD design to production deployment.
              </TimelineContent>
            </div>
          </div>

          {/* CTA — 1/3 width */}
          <div className="md:col-span-1">
            <div className="text-right">
              <TimelineContent
                as="div"
                animationNum={12}
                timelineRef={sectionRef as React.RefObject<HTMLElement>}
                className="font-grotesk text-2xl font-bold text-[#AAFF00] mb-1 tracking-wide"
              >
                AIMAN
              </TimelineContent>
              <TimelineContent
                as="div"
                animationNum={13}
                timelineRef={sectionRef as React.RefObject<HTMLElement>}
                className="text-[#F5F5F5]/40 text-sm mb-8 font-inter"
              >
                Full-Stack Developer
              </TimelineContent>

              <TimelineContent
                as="p"
                animationNum={14}
                timelineRef={sectionRef as React.RefObject<HTMLElement>}
                className="text-[#F5F5F5]/70 font-grotesk text-sm mb-6"
              >
                Ready to build something that actually ships?
              </TimelineContent>

              <TimelineContent
                as="div"
                animationNum={15}
                timelineRef={sectionRef as React.RefObject<HTMLElement>}
                className="ml-auto w-fit"
              >
                <a href="#contact">
                  <ButtonWithIcon />
                </a>
              </TimelineContent>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
