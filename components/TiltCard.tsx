"use client";

import { useRef, type ReactNode } from "react";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees. Set 0 to disable the 3D tilt (spotlight only). */
  tilt?: number;
};

/**
 * Card that tracks the cursor to drive:
 *  - the `.spotlight` radial highlight (via --mx / --my)
 *  - an optional subtle 3D tilt toward the pointer
 * Falls back to a static element when reduced motion is preferred.
 */
export default function TiltCard({ children, className = "", tilt = 0 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    if (tilt && !reduced) {
      const rx = (0.5 - py) * tilt;
      const ry = (px - 0.5) * tilt;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    }
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    if (tilt) el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`spotlight ${className}`}
      style={{ transition: "transform 0.25s ease, border-color 0.3s ease, box-shadow 0.3s ease" }}
    >
      {children}
    </div>
  );
}
