"use client";

import { useEffect, useRef, useState } from "react";
import { CV_URL } from "@/lib/content";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#stack", label: "Stack" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

/** Desktop: a plain bar of links. Phones: a dark glass capsule with Resume and a menu button. */
export default function Nav() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen((wasOpen) => { if (wasOpen) btnRef.current?.focus(); return false; }); }
    };
    // close when the layout switches between phone and desktop
    const mq = matchMedia("(max-width: 720px)");
    const onLayout = () => setOpen(false);
    addEventListener("keydown", onKey);
    mq.addEventListener("change", onLayout);
    return () => { removeEventListener("keydown", onKey); mq.removeEventListener("change", onLayout); };
  }, []);

  useEffect(() => { if (open) firstLinkRef.current?.focus(); }, [open]);

  return (
    <nav id="nav">
      <b>MAZEN MOHAMED</b>
      <span className={`links${open ? " open" : ""}`} id="navlinks" onClick={(e) => { if ((e.target as HTMLElement).closest("a")) setOpen(false); }}>
        {LINKS.map((l, i) => (
          <a key={l.href} href={l.href} ref={i === 0 ? firstLinkRef : undefined}>{l.label}</a>
        ))}
        <a className="nav-cv" href={CV_URL} target="_blank" rel="noopener">Resume</a>
      </span>
      <span className="nav-mobile">
        <a className="nav-cv" href={CV_URL} target="_blank" rel="noopener">Resume</a>
        <button
          ref={btnRef}
          id="menubtn"
          className="menu-btn"
          type="button"
          aria-expanded={open}
          aria-controls="navlinks"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <i /><i />
        </button>
      </span>
    </nav>
  );
}
