import Background from "@/components/Background";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="relative bg-background text-[#F0EEF8] min-h-screen overflow-x-hidden">
      <Background />
      <Navbar />
      <div className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </div>
    </main>
  );
}
