"use client";

import { useEffect, useState } from "react";
import { SECTION_IDS } from "@/lib/content";

/** The progress dots on the right; the crystal scene reports which section is on screen. Each dot links to its section. */
export default function SectionDots() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const onSection = (e: Event) => setActive((e as CustomEvent<number>).detail);
    addEventListener("crystal:section", onSection);
    return () => removeEventListener("crystal:section", onSection);
  }, []);
  return (
    <div className="dots" role="navigation" aria-label="Sections">
      {SECTION_IDS.map((id, i) => (
        <a key={id} href={`#${id}`} className={i === active ? "on" : undefined} aria-label={id === "top" ? "Top" : id[0].toUpperCase() + id.slice(1)} aria-current={i === active ? "true" : undefined}>
          <i />
        </a>
      ))}
    </div>
  );
}
