import { skills } from "@/lib/data";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";

export default function Skills() {
  return (
    <section id="skills" className="py-28 px-6 md:px-12 max-w-6xl mx-auto scroll-mt-24">
      <Reveal className="mb-16">
        <p className="flex items-center gap-2 text-accent1 text-xs font-medium tracking-[0.15em] uppercase mb-3 before:content-['//'] before:font-mono">
          What I use
        </p>
        <h2 className="font-display font-extrabold text-4xl md:text-5xl leading-tight tracking-tight">
          My <span className="gradient-text">tech stack</span>
        </h2>
      </Reveal>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {skills.map((skill, i) => (
          <Reveal key={skill.name} delay={(i % 6) * 50 + Math.floor(i / 6) * 40}>
            <TiltCard
              tilt={8}
              className="group relative overflow-hidden bg-surface border border-border rounded-xl p-5 text-center hover:border-accent1/40 h-full"
            >
              <div className="absolute inset-0 bg-linear-to-br from-accent1 to-accent4 opacity-0 group-hover:opacity-[0.1] transition-opacity duration-300" />
              <span className="text-3xl mb-2 block transition-transform duration-300 group-hover:scale-125 group-hover:-translate-y-0.5">
                {skill.icon}
              </span>
              <div className="font-display font-semibold text-sm relative">{skill.name}</div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
