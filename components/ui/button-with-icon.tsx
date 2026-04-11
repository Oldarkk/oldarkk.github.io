import { ArrowUpRight } from "lucide-react";

// Uses transform/opacity only — no padding or layout changes on hover/tap.
// This keeps animation on the GPU compositor and avoids layout recalc on mobile.
const ButtonWithIcon = () => {
  return (
    <div className="relative inline-flex items-center h-12 rounded-full bg-[#AAFF00] overflow-hidden group cursor-pointer hover:shadow-[0_8px_32px_rgba(170,255,0,0.35)] transition-shadow duration-300">
      {/* Label */}
      <span className="relative z-10 pl-6 pr-14 font-grotesk font-semibold text-sm tracking-wider uppercase text-[#0A0A0A] transition-transform duration-300 group-hover:-translate-x-1">
        Let&apos;s Collaborate
      </span>

      {/* Icon pill — translates left on hover, no layout change */}
      <div className="absolute right-1 w-10 h-10 bg-[#0A0A0A] text-[#AAFF00] rounded-full flex items-center justify-center transition-transform duration-300 group-hover:-translate-x-[calc(100%-1rem)] group-hover:rotate-45">
        <ArrowUpRight size={16} />
      </div>
    </div>
  );
};

export default ButtonWithIcon;
