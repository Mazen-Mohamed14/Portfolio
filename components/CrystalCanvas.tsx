"use client";

import { useEffect, useRef } from "react";
import { SECTION_IDS } from "@/lib/content";

/** The 3D crystal behind the page. Three.js loads after the text has rendered; without WebGL a still poster shows instead. */
export default function CrystalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    let stop: (() => void) | undefined;
    let cancelled = false;
    // if the 3D engine never gets going (blocked network, old device), show the poster
    const fallback = setTimeout(() => root.classList.add("no-gl"), 8000);

    import("@/lib/crystal-scene")
      .then(({ startCrystalScene }) => {
        if (cancelled || !canvasRef.current) return;
        stop = startCrystalScene({
          canvas: canvasRef.current,
          nav: document.getElementById("nav"),
          sectionCount: SECTION_IDS.length,
          onSection: (index) => window.dispatchEvent(new CustomEvent("crystal:section", { detail: index })),
          onReady: () => { clearTimeout(fallback); root.classList.remove("no-gl"); },
        });
      })
      .catch(() => { clearTimeout(fallback); root.classList.add("no-gl"); });

    // a change to the reduced-motion setting switches the whole animation model, so start fresh
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => location.reload();
    motion.addEventListener("change", onMotion);

    return () => {
      cancelled = true;
      clearTimeout(fallback);
      motion.removeEventListener("change", onMotion);
      stop?.();
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} id="gl" aria-hidden="true" />
      <div className="vig" aria-hidden="true" />
    </>
  );
}
