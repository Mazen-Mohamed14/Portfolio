"use client";

const links = ["About", "Skills", "Projects", "Contact"];

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-5 bg-[rgba(10,10,15,0.85)] backdrop-blur-md border-b border-border">
      <span className="font-display font-extrabold text-xl gradient-text">MM</span>
      <ul className="hidden md:flex gap-10 list-none">
        {links.map((link) => (
          <li key={link}>
            <a
              href={`#${link.toLowerCase()}`}
              className="text-muted hover:text-[#F0EEF8] transition-colors text-sm font-medium tracking-widest uppercase"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
