"use client";

import React, { useEffect, useRef, useState, ElementType } from "react";
import { motion, Variants, HTMLMotionProps } from "framer-motion";

// Default reveal variants if none are passed
const DEFAULT_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" },
  }),
};

type TimelineContentProps<T extends ElementType = "div"> = {
  as?: T;
  animationNum?: number;
  timelineRef?: React.RefObject<HTMLElement | HTMLDivElement | null>;
  customVariants?: Variants;
  children?: React.ReactNode;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, "as">;

export function TimelineContent<T extends ElementType = "div">({
  as,
  animationNum = 0,
  timelineRef,
  customVariants,
  children,
  className,
  ...rest
}: TimelineContentProps<T>) {
  const [inView, setInView] = useState(false);
  const ownRef = useRef<Element>(null);

  useEffect(() => {
    // Watch the parent section ref if given, otherwise watch own element
    const target = timelineRef?.current ?? ownRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [timelineRef]);

  const variants = customVariants ?? DEFAULT_VARIANTS;
  const Tag = as ?? "div";

  // Build the motion component dynamically
  const MotionTag = motion(Tag as ElementType);

  return (
    <MotionTag
      ref={ownRef as React.Ref<HTMLElement>}
      className={className}
      custom={animationNum}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      {...(rest as HTMLMotionProps<"div">)}
    >
      {children}
    </MotionTag>
  );
}
