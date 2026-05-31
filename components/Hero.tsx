"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Subtle parallax on the title as the page scrolls.
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        el.style.transform = `translateY(${y * 0.15}px)`;
        el.style.opacity = String(Math.max(0, 1 - y / 600));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-32 max-w-6xl mx-auto"
    >
      <div ref={titleRef} className="will-change-transform">
        <h1
          className="animate-fade-up-1 font-display font-extrabold tracking-tighter mb-6
                 text-[clamp(2.75rem,12vw,7.5rem)]
                 leading-[1.02]
                 wrap-break-word"
        >
          <span className="block overflow-hidden">
            <span className="inline-block">Mazen</span>
          </span>
          <span className="gradient-text-animate block">Mohamed</span>
        </h1>

        <p className="animate-fade-up-2 text-muted max-w-xl leading-relaxed mb-10 font-light text-lg">
          Fullstack developer with 3+ years of experience crafting fast, accessible, and visually
          sharp web applications, specializing in React, TypeScript, and Tailwind CSS.
        </p>

        <div className="animate-fade-up-3 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg px-7 py-3.5 font-display font-semibold text-sm text-white transition-transform hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(255,77,109,0.4)]"
            style={{ background: "linear-gradient(135deg,#FF4D6D,#FF9F1C)" }}
          >
            {/* Shimmer sweep */}
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">See my work</span>
            <span className="relative transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-display font-semibold text-sm border border-border hover:bg-surface hover:border-white/25 transition-all hover:-translate-y-0.5"
          >
            Get in touch
          </a>
        </div>

        <a
          href="#about"
          className="animate-fade-up-5 group mt-20 inline-flex items-center gap-3 text-muted text-xs tracking-[0.1em] uppercase before:block before:h-px before:w-10 before:bg-muted before:transition-all before:duration-300 group-hover:before:w-16"
        >
          <span className="relative flex h-7 w-4 items-start justify-center rounded-full border border-border pt-1">
            <span
              className="h-1.5 w-1 rounded-full bg-muted"
              style={{ animation: "scroll-dot 1.8s ease-in-out infinite" }}
            />
          </span>
          Scroll to explore
        </a>
      </div>
    </section>
  );
}
