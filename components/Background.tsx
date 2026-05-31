"use client";

import { useEffect, useRef } from "react";

/**
 * Fixed, full-viewport ambient layer:
 *  - three slowly drifting aurora blobs
 *  - a fine grain texture (SVG noise)
 *  - a soft glow that lazily follows the cursor (desktop only)
 * All purely decorative and pointer-events-none.
 */
export default function Background() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let curX = targetX;
    let curY = targetY;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const tick = () => {
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      el.style.transform = `translate3d(${curX - 300}px, ${curY - 300}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Aurora blobs */}
      <div
        className="absolute -top-[20%] -left-[10%] h-[55vw] w-[55vw] rounded-full opacity-60 blur-[110px]"
        style={{
          background: "radial-gradient(circle, rgba(124,58,237,0.5), transparent 60%)",
          animation: "float-slow 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-[30%] -right-[15%] h-[50vw] w-[50vw] rounded-full opacity-50 blur-[120px]"
        style={{
          background: "radial-gradient(circle, rgba(255,77,109,0.4), transparent 60%)",
          animation: "float-slow-2 26s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-[-20%] left-[20%] h-[45vw] w-[45vw] rounded-full opacity-40 blur-[120px]"
        style={{
          background: "radial-gradient(circle, rgba(56,178,172,0.35), transparent 60%)",
          animation: "float-slow 30s ease-in-out infinite reverse",
        }}
      />

      {/* Cursor-following glow */}
      <div
        ref={glowRef}
        className="absolute left-0 top-0 h-[600px] w-[600px] rounded-full opacity-50 blur-[100px] will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(255,159,28,0.18), transparent 60%)",
        }}
      />

      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Vignette to keep edges grounded */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 0%, transparent 55%, rgba(10,10,15,0.7) 100%)",
        }}
      />
    </div>
  );
}
