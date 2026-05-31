"use client";

import { useEffect, useRef, useState } from "react";

type CounterProps = {
  /** The full label to display, e.g. "3+", "20+", "∞". */
  value: string;
};

/**
 * Counts up to the numeric portion of `value` when it scrolls into view,
 * preserving any prefix/suffix (e.g. "+"). Non-numeric values (like "∞")
 * are rendered as-is.
 */
export default function Counter({ value }: CounterProps) {
  const match = value.match(/(\d+)/);
  const target = match ? parseInt(match[1], 10) : null;
  const suffix = match ? value.slice(match.index! + match[1].length) : "";
  const prefix = match ? value.slice(0, match.index!) : "";

  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(target === null ? value : "0");

  useEffect(() => {
    if (target === null) return;
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        if (reduced) {
          setDisplay(String(target));
          return;
        }

        const duration = 1400;
        const start = performance.now();
        const step = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          // easeOutExpo
          const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
          setDisplay(String(Math.round(eased * target)));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {target === null ? display : `${prefix}${display}${suffix}`}
    </span>
  );
}
