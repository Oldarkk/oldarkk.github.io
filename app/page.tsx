import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import MobileDock from "@/components/MobileDock";

// ─── Main page ────────────────────────────────────────────────────────────────
// Sections flow top to bottom. Projects uses its own sticky scroll container
// on desktop (horizontal) and stacked cards on mobile.
export default function Home() {
  return (
    <main className="pb-24 md:pb-0">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
      <MobileDock />
    </main>
  );
}
