import { skills } from "@/lib/data";

export default function Skills() {
  return (
    <section id="skills" className="py-28 px-6 md:px-12 max-w-6xl mx-auto">
      <div className="mb-16">
        <p className="flex items-center gap-2 text-accent1 text-xs font-medium tracking-[0.15em] uppercase mb-3 before:content-['//'] before:font-mono">
          What I use
        </p>
        <h2 className="font-display font-extrabold text-4xl md:text-5xl leading-tight tracking-tight">
          My <span className="gradient-text">tech stack</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="relative overflow-hidden bg-surface border border-border rounded-xl p-5 text-center transition-all duration-250 hover:border-accent1/40 hover:-translate-y-1 group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent1 to-accent4 opacity-0 group-hover:opacity-[0.08] transition-opacity" />
            <span className="text-3xl mb-2 block">{skill.icon}</span>
            <div className="font-display font-semibold text-sm relative">{skill.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
