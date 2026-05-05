import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import CustomCursor from "@/components/CustomCursor";
import GrainOverlay from "@/components/GrainOverlay";
import ScrollProgress from "@/components/ScrollProgress";
import PageTransition from "@/components/PageTransition";

// ─── Google Fonts ─────────────────────────────────────────────────────────────
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Aiman — Full Stack Developer",
  description:
    "Full-stack developer based in Miri, Sarawak. Building web products that ship.",
  keywords: ["full stack developer", "Next.js", "Supabase", "Miri", "Sarawak", "Malaysia"],
  authors: [{ name: "Aiman" }],
  openGraph: {
    title: "Aiman — Full Stack Developer",
    description: "Building products that solve real problems.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="bg-[#0A0A0A] text-[#F5F5F5] antialiased overflow-x-hidden">
        {/* Page wipe transition on load */}
        <PageTransition />

        {/* Smooth scroll provider */}
        <LenisProvider>
          {/* Desktop-only: custom cursor with mix-blend-mode:difference */}
          <CustomCursor />

          {/* Desktop-only: animated film grain overlay */}
          <GrainOverlay />

          {/* Acid-green scroll progress bar at top */}
          <ScrollProgress />

          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
