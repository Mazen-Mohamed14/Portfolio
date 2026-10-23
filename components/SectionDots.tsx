"use client";

import { useEffect, useState } from "react";
import { SECTION_IDS } from "@/lib/content";

/** The progress dots on the right; the crystal scene reports which section is on screen. */
export default function SectionDots() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const onSection = (e: Event) => setActive((e as CustomEvent<number>).detail);
    addEventListener("crystal:section", onSection);
    return () => removeEventListener("crystal:section", onSection);
  }, []);
  return (
    <div className="dots" aria-hidden="true">
      {SECTION_IDS.map((id, i) => <i key={id} className={i === active ? "on" : undefined} />)}
    </div>
  );
}
