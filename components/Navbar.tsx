"use client";

import { useEffect, useState } from "react";

const links = ["About", "Skills", "Projects", "Contact"];

export default function Navbar() {
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
      setScrolled(h.scrollTop > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view.
  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.toLowerCase()))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "bg-[rgba(10,10,15,0.72)] backdrop-blur-xl border-border py-3.5"
          : "bg-transparent border-transparent py-5"
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-12">
        <a
          href="#hero"
          className="font-display font-extrabold text-xl gradient-text transition-transform hover:scale-110"
        >
          MM
        </a>

        <ul className="hidden md:flex gap-9 list-none">
          {links.map((link) => {
            const id = link.toLowerCase();
            const isActive = active === id;
            return (
              <li key={link}>
                <a
                  href={`#${id}`}
                  className={`group relative text-sm font-medium tracking-widest uppercase transition-colors ${
                    isActive ? "text-[#F0EEF8]" : "text-muted hover:text-[#F0EEF8]"
                  }`}
                >
                  {link}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px bg-linear-to-r from-accent1 to-accent2 transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          <span
            className={`h-0.5 w-6 bg-[#F0EEF8] transition-all duration-300 ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-[#F0EEF8] transition-all duration-300 ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-[#F0EEF8] transition-all duration-300 ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-72 border-b border-border" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col gap-1 px-6 py-4 bg-[rgba(10,10,15,0.92)] backdrop-blur-xl">
          {links.map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="block py-2.5 text-sm font-medium tracking-widest uppercase text-muted hover:text-[#F0EEF8] transition-colors"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Scroll progress bar */}
      <div
        className="absolute bottom-0 left-0 h-px w-full origin-left bg-linear-to-r from-accent1 via-accent2 to-accent4 transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress / 100})`, opacity: progress > 0.1 ? 1 : 0 }}
      />
    </nav>
  );
}
