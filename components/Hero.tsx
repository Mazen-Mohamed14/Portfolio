export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-32 max-w-6xl mx-auto"
    >
      {/* Background blob */}
      <div className="fixed top-[-30%] right-[-20%] w-[60vw] h-[60vw] rounded-full pointer-events-none z-0 bg-[radial-gradient(circle,rgba(124,58,237,0.12)_0%,transparent_70%)]" />

      <h1
        className="animate-fade-up-1 font-display font-extrabold leading-[0.95] tracking-tight mb-6"
        style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)" }}
      >
        Mazen
        <br />
        <span className="gradient-text-full">Mohamed</span>
      </h1>

      <p className="animate-fade-up-2 text-muted max-w-xl leading-relaxed mb-10 font-light text-lg">
        Fullstack developer with 3+ years of experience crafting fast, accessible, and visually
        sharp web applications — specializing in React, TypeScript, and Tailwind CSS.
      </p>

      <div className="animate-fade-up-3 flex flex-wrap gap-4">
        <a
          href="#projects"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-display font-semibold text-sm text-white transition-transform hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,77,109,0.35)]"
          style={{ background: "linear-gradient(135deg,#FF4D6D,#FF9F1C)" }}
        >
          See my work →
        </a>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-display font-semibold text-sm border border-border hover:bg-surface hover:border-white/25 transition-all"
        >
          Get in touch
        </a>
      </div>

      <div className="animate-fade-up-5 flex items-center gap-3 mt-20 text-muted text-xs tracking-[0.1em] uppercase before:content-[''] before:block before:w-10 before:h-px before:bg-muted">
        Scroll to explore
      </div>
    </section>
  );
}
